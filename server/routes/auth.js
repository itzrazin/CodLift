const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple'); // Wait, prompt said jwt + bcryptjs. Let me use jsonwebtoken.
// Actually, package.json has jsonwebtoken.
const jwt2 = require('jsonwebtoken');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO users (email, password, username, last_login) VALUES ($1, $2, $3, NOW()) RETURNING id, email, username, xp, streak',
      [email, hashedPassword, username]
    );

    const user = result.rows[0];
    const token = jwt2.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    try {
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Welcome to CodeLift!',
        text: `Hi ${username},\n\nWelcome to CodeLift. Start your coding journey today!`
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

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Streak Logic
    let streak = user.streak || 0;
    if (user.last_login) {
      const lastLogin = new Date(user.last_login);
      const today = new Date();
      // Calculate difference in days
      lastLogin.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      const diffTime = Math.abs(today - lastLogin);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays === 1) {
        streak++;
      } else if (diffDays > 1) {
        streak = 1;
      }
    } else {
      streak = 1; // First login since signup probably, but signup sets last_login now
    }

    const updateResult = await pool.query(
      'UPDATE users SET streak = $1, last_login = NOW() WHERE id = $2 RETURNING id, email, username, xp, streak',
      [streak, user.id]
    );
    const updatedUser = updateResult.rows[0];

    const token = jwt2.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    try {
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'New login to CodeLift',
        text: `Hi ${user.username},\n\nA new login to your CodeLift account was detected.`
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

const auth = require('../middleware/auth');
const passport = require('../config/passport');

router.get('/me', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, username, avatar, level, xp, xp_total, streak, longest_streak, is_admin, goal, notifications FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/level', auth, async (req, res) => {
  try {
    const { level } = req.body;
    await pool.query('UPDATE users SET level = $1 WHERE id = $2', [level, req.user.id]);
    res.json({ success: true, level });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  const token = jwt2.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  const isNew = req.user.is_new_user ? 'true' : 'false';
  res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/oauth/callback?token=${token}&is_new=${isNew}`);
});

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  const token = jwt2.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  const isNew = req.user.is_new_user ? 'true' : 'false';
  res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/oauth/callback?token=${token}&is_new=${isNew}`);
});

module.exports = router;

