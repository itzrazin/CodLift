import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import passport from '../config/passport';
import rateLimit from 'express-rate-limit';
import { register, login } from '../controllers/authController';

const router = express.Router();

// Rate limiter: Max 10 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts, please try again after 15 minutes' }
});

// ─── POST /api/auth/register ───────────────────────────────────────────────────
router.post('/register', register);
// Keeping /signup as an alias for backward compatibility with frontend
router.post('/signup', register);

// ─── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', loginLimiter, login);

// ─── POST /api/auth/logout ─────────────────────────────────────────────────────
router.post('/logout', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// ─── Google OAuth ──────────────────────────────────────────────────────────────
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req: any, res: Response) => {
    // Note: This relies on passport.ts returning a user with id
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET || '', { expiresIn: '7d' });
    res.redirect(`${process.env.CLIENT_URL || 'https://codlift.site'}/auth/callback?token=${token}`);
  }
);

export default router;
