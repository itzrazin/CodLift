const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../db');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const googleId = profile.id;
      const displayName = profile.displayName;

      // Check if user exists by email
      const existingUserResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      
      if (existingUserResult.rows.length > 0) {
        let user = existingUserResult.rows[0];
        
        // If user exists but doesn't have google_id, update it
        if (!user.google_id) {
            await db.query('UPDATE users SET google_id = $1 WHERE id = $2', [googleId, user.id]);
        }
        
        return done(null, user);
      }

      // Generate a unique username for new Google users
      let baseUsername = displayName.replace(/\s+/g, '').toLowerCase();
      let uniqueUsername = baseUsername;
      let counter = 1;
      
      let usernameCheck = await db.query('SELECT username FROM users WHERE username = $1', [uniqueUsername]);
      while (usernameCheck.rows.length > 0) {
          uniqueUsername = `${baseUsername}${counter}`;
          counter++;
          usernameCheck = await db.query('SELECT username FROM users WHERE username = $1', [uniqueUsername]);
      }

      // Create new user
      const newUserResult = await db.query(
        'INSERT INTO users (email, username, google_id, last_login) VALUES ($1, $2, $3, NOW()) RETURNING *',
        [email, uniqueUsername, googleId]
      );
      
      return done(null, newUserResult.rows[0]);
    } catch (error) {
      console.error('Google OAuth Error:', error);
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
