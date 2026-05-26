import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import rateLimit from 'express-rate-limit';

// Route Imports
import authRouter from './routes/auth';
import executeRouter from './routes/execute';
import lessonsRouter from './routes/lessons';
import progressRouter from './routes/progress';
import userRouter from './routes/user';
import leaderboardRouter from './routes/leaderboard';
import adminRouter from './routes/admin';

// Data / DB
import * as db from './db';
import { pool } from './db';
import { curriculum } from './data/curriculum';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dynamic CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://codlift.site',
  'https://www.codlift.site',
  'https://codlift.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin    = origin.replace(/\/$/, '');
    const isWhitelisted  = allowedOrigins.includes(cleanOrigin);
    const isVercelPreview = cleanOrigin.endsWith('.vercel.app') && cleanOrigin.includes('codlift-');
    
    if (isWhitelisted || isVercelPreview) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(helmet({
  contentSecurityPolicy: false, // Handled by frontend index.html for now
}));

// ─── Rate Limiters ────────────────────────────────────────────────────────────
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { error: 'Too many messages sent, please try again after an hour' }
});

// ─── System Routes ─────────────────────────────────────────────────────────────
app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'CodLift API is running', timestamp: new Date().toISOString() });
});

// ─── Dynamic Sitemap ───────────────────────────────────────────────────────────
app.get('/sitemap.xml', (_req: Request, res: Response) => {
  let baseUrl = process.env.CLIENT_URL || 'https://codlift.site';
  if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);

  const staticPages = [
    '', '/login', '/signup', '/dashboard', '/arena', '/profile',
    '/leaderboard', '/blog', '/blog/how-to-learn-html',
    '/blog/best-free-coding-platform', '/blog/learn-javascript-interactively',
    '/blog/zero-to-first-website', '/privacy-policy', '/terms-of-service', '/about'
  ];

  const lessonPages: string[] = [];
  curriculum.forEach((module) => {
    module.exercises.forEach((_exercise: any, index: number) => {
      lessonPages.push(`/learn/${module.level}/${module.id}/${index + 1}`);
    });
  });

  const allUrls = [...staticPages, ...lessonPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls.map((url) => `
    <url>
      <loc>${baseUrl}${url}</loc>
      <changefreq>weekly</changefreq>
      <priority>${url === '' ? '1.0' : '0.8'}</priority>
    </url>
  `).join('')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(sitemap);
});

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',        authRouter);
app.use('/api/execute',     executeRouter);
app.use('/api/lessons',     lessonsRouter);
app.use('/api/progress',    progressRouter);
app.use('/api/user',        userRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/admin',       adminRouter);

// Public Contact Form inquiry Submission
app.post('/api/contact', contactLimiter, async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }
    await pool.query(
      'INSERT INTO inquiries (name, email, subject, message) VALUES ($1, $2, $3, $4)',
      [name, email, subject || 'General Inquiry', message]
    );
    res.json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Failed to submit contact inquiry:', err);
    res.status(500).json({ error: 'Failed to process inquiry submission.' });
  }
});

// ─── Global error handler ──────────────────────────────────────────────────────
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  const status  = err.status || err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message || 'Internal server error';

  res.status(status).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CodLift API running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   CORS allowed origins: ${allowedOrigins.join(', ')}`);
});

export default app;
