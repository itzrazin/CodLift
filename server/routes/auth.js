const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

const sanitizeUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  level: user.level,
  xp_total: user.xp_total,
  current_streak: user.current_streak,
  longest_streak: user.longest_streak,
  last_active_date: user.last_active_date,
  created_at: user.created_at
});

// Helper to update streak
const updateStreak = async (userId) => {
  const result = await db.query('SELECT last_active_date, current_streak, longest_streak FROM users WHERE id = $1', [userId]);
  if (result.rows.length === 0) return;
  
  const user = result.rows[0];
  const today = new Date().toISOString().split('T')[0];
  const lastActive = user.last_active_date ? new Date(user.last_active_date).toISOString().split('T')[0] : null;
  
  let newStreak = user.current_streak || 0;
  
  if (lastActive === today) {
    // Already active today, no change
    return;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (lastActive === yesterdayStr) {
    newStreak += 1;
  } else if (lastActive !== today) {
    newStreak = 1;
  }
  
  const newLongest = Math.max(newStreak, user.longest_streak || 0);
  
  await db.query(
    'UPDATE users SET current_streak = $1, longest_streak = $2, last_active_date = $3 WHERE id = $4',
    [newStreak, newLongest, today, userId]
  );
};

// Register
router.post('/signup', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    
    if (!email || !password || !username) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    
    // Check if user exists
    const userCheck = await db.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (userCheck.rows.length > 0) {
      const existing = userCheck.rows[0];
      if (existing.email === email) return res.status(400).json({ message: 'Email already in use.' });
      if (existing.username === username) return res.status(400).json({ message: 'Username already taken.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );
    
    const newUser = result.rows[0];
    const token = createToken(newUser.id);

    // Send Welcome Email (Async, non-blocking)
    try {
      const { sendWelcomeEmail } = require('../utils/mailer');
      sendWelcomeEmail(email, username);
    } catch (e) { /* mailer optional */ }

    res.status(201).json({ 
      token, 
      user: sanitizeUser(newUser),
      is_new_user: true
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (!user) return res.status(400).json({ message: 'No account found with this email.' });
    
    if (user.password === 'oauth') {
      return res.status(400).json({ message: 'This account uses social login. Try Google or GitHub.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password.' });

    // Update streak
    await updateStreak(user.id);

    const token = createToken(user.id);

    res.json({ 
      token, 
      user: sanitizeUser(user),
      is_new_user: !user.level
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    await updateStreak(req.user.id);
    // Re-fetch after streak update
    const result = await db.query(
      'SELECT id, username, email, avatar, level, xp_total, current_streak, longest_streak, last_active_date, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update user level (onboarding)
router.put('/level', authenticateToken, async (req, res) => {
  try {
    const { level } = req.body;
    const validLevels = ['beginner', 'intermediate', 'pro', 'master'];
    
    if (!validLevels.includes(level)) {
      return res.status(400).json({ message: 'Invalid level. Choose: beginner, intermediate, pro, master.' });
    }

    await db.query('UPDATE users SET level = $1 WHERE id = $2', [level, req.user.id]);
    
    res.json({ message: 'Level updated!', level });
  } catch (err) {
    console.error('Level update error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username, avatar } = req.body;
    
    if (username) {
      const exists = await db.query('SELECT id FROM users WHERE username = $1 AND id != $2', [username, req.user.id]);
      if (exists.rows.length > 0) {
        return res.status(400).json({ message: 'Username already taken.' });
      }
    }

    await db.query(
      'UPDATE users SET username = COALESCE($1, username), avatar = COALESCE($2, avatar) WHERE id = $3',
      [username, avatar, req.user.id]
    );

    const result = await db.query('SELECT id, username, email, avatar, level, xp_total, current_streak, longest_streak FROM users WHERE id = $1', [req.user.id]);
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=google_failed' }),
  (req, res) => {
    const token = createToken(req.user.id);
    const isNew = req.user.is_new_user ? 'true' : 'false';
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/oauth/callback?token=${token}&is_new=${isNew}`);
  }
);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));

router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/login?error=github_failed' }),
  (req, res) => {
    const token = createToken(req.user.id);
    const isNew = req.user.is_new_user ? 'true' : 'false';
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/oauth/callback?token=${token}&is_new=${isNew}`);
  }
);

module.exports = router;
