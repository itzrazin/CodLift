const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');

// Load .env from parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// Also try local .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL, 
  'http://localhost:5173', 
  'http://127.0.0.1:5173', 
  'http://localhost:3000'
].filter(Boolean).map(url => url.replace(/\/$/, '')); // Remove trailing slashes

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.indexOf(cleanOrigin) !== -1) return callback(null, true);
    console.log('CORS blocked origin:', origin);
    return callback(null, true); // Allow all in development
  },
  credentials: true
}));

// Passport for OAuth
const passport = require('./config/passport');
app.use(passport.initialize());

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
  curriculum.forEach(lesson => {
    lesson.exercises.forEach(ex => {
      lessonPages.push(`/learn/${lesson.level}/${lesson.id}/${ex.number || 1}`);
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

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 CodLift API running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});
