import { Response } from 'express';
import * as db from '../db';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const sanitize = (str: any): string => {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').substring(0, 500);
};

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

    const { name, username, address, profile_photo, bio, github_username, linkedin_username, avatar } = req.body;

    const result = await db.query(
      `UPDATE users
       SET name              = $1,
           username          = $2,
           address           = $3,
           profile_photo     = $4,
           bio               = $5,
           github_username   = $6,
           linkedin_username = $7,
           avatar            = $8
       WHERE id = $9
       RETURNING ${USER_SELECT}`,
      [
        sanitize(name), 
        sanitize(username), 
        sanitize(address), 
        sanitize(profile_photo), 
        sanitize(bio), 
        sanitize(github_username), 
        sanitize(linkedin_username), 
        sanitize(avatar),
        userId
      ]
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
