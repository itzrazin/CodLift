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
      const profilePhoto = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

      // Check if user exists by email
      const existingUserResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      
      if (existingUserResult.rows.length > 0) {
        const user = existingUserResult.rows[0];
        
        // If user exists but doesn't have google_id, link the account
        if (!user.google_id) {
          await db.query(
            'UPDATE users SET google_id = $1, last_login = NOW() WHERE id = $2',
            [googleId, user.id]
          );
          user.google_id = googleId;
        } else {
          await db.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
        }
        
        return done(null, user);
      }

      // Create new user with 'name' (not 'username') to match new schema
      const newUserResult = await db.query(
        `INSERT INTO users (email, name, google_id, profile_photo, last_login)
         VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
        [email, displayName, googleId, profilePhoto]
      );
      
      const newUser = newUserResult.rows[0];
      (newUser as any).isNew = true;
      return done(null, newUser);
    } catch (error: any) {
      console.error('Google OAuth Error:', error);
      return done(error, undefined);
    }
  }
));

// Stateless JWT — no session serialization needed, but Passport requires these stubs
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
