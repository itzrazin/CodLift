const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../db');

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
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
        // Link Google ID to existing account
        await db.query('UPDATE users SET google_id = $1, avatar = COALESCE(avatar, $2) WHERE id = $3', 
          [profile.id, profile.photos?.[0]?.value, result.rows[0].id]);
        return done(null, { ...result.rows[0], is_new_user: false });
      }

      // Create new user
      const username = profile.displayName?.replace(/\s+/g, '') || `user${profile.id.slice(0, 8)}`;
      const newUser = await db.query(
        'INSERT INTO users (username, email, google_id, avatar, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [username, email, profile.id, profile.photos?.[0]?.value, 'oauth']
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
      callbackURL: '/api/auth/github/callback',
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
          await db.query('UPDATE users SET github_id = $1, avatar = COALESCE(avatar, $2) WHERE id = $3', 
            [profile.id.toString(), profile.photos?.[0]?.value, result.rows[0].id]);
          return done(null, { ...result.rows[0], is_new_user: false });
        }

        const username = profile.username || `user${profile.id}`;
        const newUser = await db.query(
          'INSERT INTO users (username, email, github_id, avatar, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [username, email, profile.id.toString(), profile.photos?.[0]?.value, 'oauth']
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
passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
