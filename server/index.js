const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const helmet = require('helmet');

// Load .env from parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// Also try local .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for secure cookies and OAuth redirects on Render/Vercel
app.set('trust proxy', 1);

// Security HTTP headers
app.use(helmet({
  contentSecurityPolicy: false,
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
].filter(Boolean).map(url => url.replace(/\/$/, ''));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    
    // Check if origin is in allowed list or is a Vercel preview URL
    const isVercelPreview = cleanOrigin.endsWith('.vercel.app') && cleanOrigin.includes('codlift-');
    
    if (allowedOrigins.indexOf(cleanOrigin) !== -1 || isVercelPreview) {
      return callback(null, true);
    }
    
    console.log('CORS blocked origin:', origin);
    // In production, you might want to block unknown origins, 
    // but for now we'll allow but log for debugging.
    return callback(null, true);
  },
  credentials: true
}));

// Session configuration for Passport — PostgreSQL-backed store
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./db'); // reuse existing pg pool

app.use(session({
  store: new pgSession({
    pool,                   // use existing pg connection pool
    tableName: 'sessions',  // auto-created by connect-pg-simple
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET || 'codlift_default_secret_123',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport for OAuth
const passport = require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'CodLift API is running', timestamp: new Date().toISOString() });
});

const curriculum = require('./data/curriculum');

// Dynamic Sitemap Generation
app.get('/sitemap.xml', (req, res) => {
  let baseUrl = process.env.CLIENT_URL || 'https://codlift.site';
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }
  
  // Static pages
  const staticPages = [
    '',
    '/login',
    '/signup',
    '/dashboard',
    '/arena',
    '/profile',
    '/leaderboard',
    '/blog',
    '/blog/how-to-learn-html',
    '/blog/best-free-coding-platform',
    '/blog/learn-javascript-interactively',
    '/blog/zero-to-first-website',
    '/privacy-policy',
    '/terms-of-service',
    '/about'
  ];

  // Dynamic lesson pages from curriculum
  const lessonPages = [];
  curriculum.forEach((module) => {
    module.exercises.forEach((exercise, index) => {
      lessonPages.push(`/learn/${module.level}/${module.id}/${index + 1}`);
    });
  });

  const allUrls = [...staticPages, ...lessonPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls.map(url => `
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

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/execute', require('./routes/execute'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/leaderboard', require('./routes/leaderboard'));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || err.statusCode || 500;
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

module.exports = app;
