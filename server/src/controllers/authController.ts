import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import * as db from '../db';
import * as mailer from '../utils/mailer';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, username, password, address, profile_photo } = req.body;

    if (!name || !email || !username || !password) {
      return res.status(400).json({ error: 'Name, email, username, and password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if email exists
    const existingEmail = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingEmail.rows.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Check if username exists
    const existingUsername = await db.query('SELECT id FROM users WHERE username = $1', [username]);
    if (existingUsername.rows.length > 0) {
      return res.status(400).json({ error: 'Username already in use' });
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await db.query(
      `INSERT INTO users (name, email, username, password, address, profile_photo, created_at, last_login)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING
         id, email,
         COALESCE(name, '')            AS name,
         COALESCE(username, '')        AS username,
         COALESCE(address, '')         AS address,
         COALESCE(profile_photo, '')   AS profile_photo,
         COALESCE(avatar, 'User:purple') AS avatar,
         COALESCE(role, 'user')        AS role,
         COALESCE(level, 'beginner')   AS level,
         COALESCE(xp_total, 0)         AS xp_total,
         COALESCE(streak, 0)           AS streak,
         COALESCE(bio, '')             AS bio,
         COALESCE(github_username, '') AS github_username,
         COALESCE(linkedin_username,'') AS linkedin_username,
         created_at`,
      [name, email, username, hashedPassword, address || null, profile_photo || null]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

    res.json({ token, user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const result = await db.query(
      'SELECT * FROM users WHERE username = $1 OR email = $1',
      [username]
    );
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

    const updateResult = await db.query(
      `UPDATE users SET last_login = NOW() WHERE id = $1
       RETURNING
         id, email,
         COALESCE(name, '')            AS name,
         COALESCE(username, '')        AS username,
         COALESCE(address, '')         AS address,
         COALESCE(profile_photo, '')   AS profile_photo,
         COALESCE(avatar, 'User:purple') AS avatar,
         COALESCE(role, 'user')        AS role,
         COALESCE(level, 'beginner')   AS level,
         COALESCE(xp_total, 0)         AS xp_total,
         COALESCE(streak, 0)           AS streak,
         COALESCE(bio, '')             AS bio,
         COALESCE(github_username, '') AS github_username,
         COALESCE(linkedin_username,'') AS linkedin_username,
         created_at, last_login`,
      [user.id]
    );
    const updatedUser = updateResult.rows[0];

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

    res.json({ token, user: updatedUser });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const userRes = await db.query('SELECT id, username FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      // Return success anyway to prevent email enumeration
      return res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
    }

    const user = userRes.rows[0];
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    await db.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, token, expiresAt]
    );

    const resetLink = `${process.env.CLIENT_URL || 'https://codlift.site'}/reset-password?token=${token}`;
    await mailer.sendCustomEmail(
      email,
      'Password Reset Request',
      `Hello ${user.username},\n\nWe received a request to reset your password. Click the link below to reset it:\n${resetLink}\n\nThis link expires in 1 hour.\nIf you did not request this, please ignore this email.`
    );

    res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: 'Token and new password required' });
    if (newPassword.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

    const tokenRes = await db.query(
      'SELECT user_id FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW()',
      [token]
    );

    if (tokenRes.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const userId = tokenRes.rows[0].user_id;
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);
    await db.query('DELETE FROM password_reset_tokens WHERE user_id = $1', [userId]);

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};