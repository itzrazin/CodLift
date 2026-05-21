import { Response } from 'express';
import * as db from '../db';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const USER_SELECT = `
  id, email,
  COALESCE(name, '')             AS name,
  COALESCE(username, '')         AS username,
  COALESCE(address, '')          AS address,
  COALESCE(profile_photo, '')    AS profile_photo,
  COALESCE(avatar, 'User:purple') AS avatar,
  COALESCE(role, 'user')         AS role,
  COALESCE(level, 'beginner')    AS level,
  COALESCE(bio, '')              AS bio,
  COALESCE(github_username, '')  AS github_username,
  COALESCE(linkedin_username, '') AS linkedin_username,
  created_at, last_login
`;

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await db.query(
      `SELECT ${USER_SELECT} FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, address, profile_photo } = req.body;

    const result = await db.query(
      `UPDATE users
       SET name          = COALESCE($1, name),
           address       = COALESCE($2, address),
           profile_photo = COALESCE($3, profile_photo)
       WHERE id = $4
       RETURNING ${USER_SELECT}`,
      [name, address, profile_photo, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
