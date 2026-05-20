import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import * as db from '../db';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
      if (!email) {
        return done(new Error('No email found in Google profile'), undefined);
      }
      const googleId = profile.id;
      const displayName = profile.displayName;

      // Check if user exists by email
      const existingUserResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      
      if (existingUserResult.rows.length > 0) {
        const user = existingUserResult.rows[0];
        
        // If user exists but doesn't have google_id, update it
        if (!user.google_id) {
            await db.query('UPDATE users SET google_id = $1 WHERE id = $2', [googleId, user.id]);
            user.google_id = googleId;
        }
        
        return done(null, user);
      }

      // Generate a unique username for new Google users
      const baseUsername = displayName.replace(/\s+/g, '').toLowerCase();
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
    } catch (error: any) {
      console.error('Google OAuth Error:', error);
      return done(error, undefined);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: any, done) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error: any) {
    done(error, null);
  }
});

export default passport;
