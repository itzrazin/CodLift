const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../db');

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    proxy: true
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists with this Google ID
      let result = await db.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
      
      if (result.rows.length > 0) {
        return done(null, { ...result.rows[0], is_new_user: false });
      }

      // Check if user exists with this email
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.id}@google.oauth`;
      result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      
      if (result.rows.length > 0) {
        // Link Google ID and sync fresh avatar
        const avatarUrl = profile.photos?.[0]?.value || result.rows[0].avatar;
        await db.query('UPDATE users SET google_id = $1, avatar = $2 WHERE id = $3', 
          [profile.id, avatarUrl, result.rows[0].id]);
        return done(null, { ...result.rows[0], google_id: profile.id, avatar: avatarUrl, is_new_user: false });
      }

      // Create new user — ensure unique username to avoid DB unique-constraint crash
      let baseUsername = profile.displayName?.replace(/\s+/g, '') || `user${profile.id.slice(0, 8)}`;
      // Sanitise: keep only alphanumeric + underscore, max 30 chars
      baseUsername = baseUsername.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 26);
      if (!baseUsername) baseUsername = 'user';

      // Check for collision and append suffix if needed
      let username = baseUsername;
      const taken = await db.query('SELECT 1 FROM users WHERE username = $1', [username]);
      if (taken.rows.length > 0) {
        username = `${baseUsername}${Math.floor(1000 + Math.random() * 9000)}`;
      }

      const randomPass = require('crypto').randomBytes(16).toString('hex');
      const avatarUrl  = profile.photos?.[0]?.value ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=00f5d4&color=080b10`;
      const newUser = await db.query(
        'INSERT INTO users (username, email, google_id, avatar, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [username, email, profile.id, avatarUrl, randomPass]
      );

      return done(null, { ...newUser.rows[0], is_new_user: true });
    } catch (err) {
      return done(err, null);
    }
  }));
}

// GitHub OAuth Strategy - will be enabled when passport-github2 is installed
try {
  const GitHubStrategy = require('passport-github2').Strategy;
  
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || '/api/auth/github/callback',
      proxy: true,
      scope: ['user:email']
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        let result = await db.query('SELECT * FROM users WHERE github_id = $1', [profile.id.toString()]);
        
        if (result.rows.length > 0) {
          return done(null, { ...result.rows[0], is_new_user: false });
        }

        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.id}@github.oauth`;
        result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length > 0) {
          const avatarUrl = profile.photos?.[0]?.value || result.rows[0].avatar;
          await db.query('UPDATE users SET github_id = $1, avatar = $2 WHERE id = $3', 
            [profile.id.toString(), avatarUrl, result.rows[0].id]);
          return done(null, { ...result.rows[0], github_id: profile.id.toString(), avatar: avatarUrl, is_new_user: false });
        }

        // Ensure unique username for GitHub OAuth signup
        let baseUsername = (profile.username || `user${profile.id}`)
          .replace(/[^a-zA-Z0-9_]/g, '').slice(0, 26) || 'user';
        let username = baseUsername;
        const ghTaken = await db.query('SELECT 1 FROM users WHERE username = $1', [username]);
        if (ghTaken.rows.length > 0) {
          username = `${baseUsername}${Math.floor(1000 + Math.random() * 9000)}`;
        }

        const randomPass = require('crypto').randomBytes(16).toString('hex');
        const avatarUrl  = profile.photos?.[0]?.value ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=00f5d4&color=080b10`;
        const newUser = await db.query(
          'INSERT INTO users (username, email, github_id, avatar, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [username, email, profile.id.toString(), avatarUrl, randomPass]
        );

        return done(null, { ...newUser.rows[0], is_new_user: true });
      } catch (err) {
        return done(err, null);
      }
    }));
  }
} catch (e) {
  console.log('passport-github2 not installed, GitHub OAuth disabled');
}

passport.serializeUser((user, done) => done(null, user.id));

// Only select the columns actually needed — never expose the hashed password
// in the request cycle unnecessarily.
passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query(
      'SELECT id, email, username, avatar, level, xp, xp_total, streak, longest_streak, is_admin FROM users WHERE id = $1',
      [id]
    );
    done(null, result.rows[0] || null);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
