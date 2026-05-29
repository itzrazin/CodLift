import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as db from '../db';

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