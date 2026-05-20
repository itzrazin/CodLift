import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import * as db from '../db';
import authMiddleware, { AuthenticatedRequest } from '../middleware/auth';
import passport from '../config/passport';

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS
  }
});

// ─── POST /api/auth/signup ─────────────────────────────────────────────────────
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const existingEmail = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingEmail.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const existingUsername = await db.query('SELECT id FROM users WHERE username = $1', [username]);
    if (existingUsername.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.query(
      'INSERT INTO users (username, email, password, last_login) VALUES ($1, $2, $3, NOW()) RETURNING id, email, username, streak, level, xp_total, created_at, bio, github_username, linkedin_username, avatar',
      [username, email, hashedPassword]
    );

    const user  = result.rows[0];
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || '', { expiresIn: '7d' });

    try {
      await transporter.sendMail({
        from:    process.env.GMAIL_USER,
        to:      email,
        subject: 'Welcome to CodeLift!',
        text:    `Hi ${username},\n\nWelcome to CodeLift. Start your coding journey today!`
      });
    } catch (mailError) {
      console.error('Error sending welcome email:', mailError);
    }

    res.json({ token, user });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// ─── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    if (!user.password) {
      return res.status(401).json({ error: 'Invalid credentials (try logging in with Google)' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    let streak = user.streak || 0;
    if (user.last_login) {
      const lastLogin = new Date(user.last_login);
      const today     = new Date();
      lastLogin.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil(Math.abs(today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
      } else if (diffDays > 1) {
        streak = 1;
      }
    } else {
      streak = 1;
    }

    const updateResult = await db.query(
      'UPDATE users SET streak = $1, last_login = NOW() WHERE id = $2 RETURNING id, email, username, streak, level, xp_total, created_at, bio, github_username, linkedin_username, avatar',
      [streak, user.id]
    );
    const updatedUser = updateResult.rows[0];

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || '', { expiresIn: '7d' });

    try {
      await transporter.sendMail({
        from:    process.env.GMAIL_USER,
        to:      email,
        subject: 'New login to CodeLift',
        text:    `Hi ${user.username},\n\nA new login to your CodeLift account was detected.`
      });
    } catch (mailError) {
      console.error('Error sending security email:', mailError);
    }

    res.json({ token, user: updatedUser });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ─── Google OAuth ──────────────────────────────────────────────────────────────
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req: any, res: Response) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET || '', { expiresIn: '7d' });
    res.redirect(`${process.env.CLIENT_URL || 'https://codlift.site'}/auth/callback?token=${token}`);
  }
);

// ─── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await db.query(
      'SELECT id, email, username, streak, level, xp_total, created_at, bio, github_username, linkedin_username, avatar FROM users WHERE id = $1',
      [req.user!.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── POST /api/auth/logout ─────────────────────────────────────────────────────
router.post('/logout', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// ─── PUT /api/auth/level ───────────────────────────────────────────────────────
router.put('/level', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { level } = req.body;
    if (!level) {
      return res.status(400).json({ error: 'Level is required' });
    }
    const result = await db.query(
      'UPDATE users SET level = $1 WHERE id = $2 RETURNING id, email, username, streak, level, xp_total, created_at, bio, github_username, linkedin_username, avatar',
      [level, req.user!.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Update level error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── PUT /api/auth/profile ─────────────────────────────────────────────────────
router.put('/profile', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, bio, github_username, linkedin_username, avatar } = req.body;

    if (username) {
      const existingUsername = await db.query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [username, req.user!.id]
      );
      if (existingUsername.rows.length > 0) {
        return res.status(400).json({ error: 'Username already exists' });
      }
    }

    const result = await db.query(
      `UPDATE users
       SET username          = COALESCE($1, username),
           bio               = COALESCE($2, bio),
           github_username   = COALESCE($3, github_username),
           linkedin_username = COALESCE($4, linkedin_username),
           avatar            = COALESCE($5, avatar)
       WHERE id = $6
       RETURNING id, email, username, streak, level, xp_total, created_at, bio, github_username, linkedin_username, avatar`,
      [username, bio, github_username, linkedin_username, avatar, req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error during profile update' });
  }
});

export default router;
