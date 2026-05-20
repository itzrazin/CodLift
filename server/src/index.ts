import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import helmet from 'helmet';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

// Load .env — from server/src/index.ts, workspace root is 3 levels up
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

import { pool } from './db';
import passportConfig from './config/passport';
import curriculum from './data/curriculum';

// Routes
import authRouter       from './routes/auth';
import aiRouter         from './routes/ai';
import executeRouter    from './routes/execute';
import lessonsRouter    from './routes/lessons';
import progressRouter   from './routes/progress';
import leaderboardRouter from './routes/leaderboard';

const PgSession = connectPgSimple(session);
const app       = express();
const PORT      = process.env.PORT || 5000;

// Trust proxy for secure cookies and OAuth redirects on Render/Vercel
app.set('trust proxy', 1);

// Security HTTP headers
app.use(helmet({
  contentSecurityPolicy:    false,
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://codlift.onrender.com',
  'https://codlift.site',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
].filter(Boolean).map((url) => (url as string).replace(/\/$/, ''));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin    = origin.replace(/\/$/, '');
    const isWhitelisted  = allowedOrigins.includes(cleanOrigin);
    const isVercelPreview = cleanOrigin.endsWith('.vercel.app') && cleanOrigin.includes('codlift-');

    if (isWhitelisted || isVercelPreview) {
      return callback(null, true);
    }

    if (process.env.NODE_ENV === 'production') {
      console.warn(`[CORS] Blocked unknown origin: ${origin}`);
      return callback(Object.assign(new Error('CORS: origin not allowed'), { status: 403 }));
    }

    console.warn(`[CORS] Unknown origin allowed in dev: ${origin}`);
    return callback(null, true);
  },
  credentials: true
}));

// Session — PostgreSQL-backed store
app.use(session({
  store: new PgSession({
    pool,
    tableName:           'sessions',
    createTableIfMissing: true
  }),
  secret:           process.env.SESSION_SECRET || 'codlift_default_secret_123',
  resave:           false,
  saveUninitialized: false,
  cookie: {
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   24 * 60 * 60 * 1000
  }
}));

// Passport OAuth
app.use(passportConfig.initialize());
app.use(passportConfig.session());

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// ─── Health check ──────────────────────────────────────────────────────────────
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
app.use('/api/ai',          aiRouter);
app.use('/api/execute',     executeRouter);
app.use('/api/lessons',     lessonsRouter);
app.use('/api/progress',    progressRouter);
app.use('/api/user',        progressRouter); // alias
app.use('/api/leaderboard', leaderboardRouter);

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
