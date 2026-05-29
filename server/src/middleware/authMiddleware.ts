import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as db from '../db';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

/**
 * JWT — HOW IT WORKS
 * 
 * A JWT has 3 parts separated by dots: header.payload.signature
 * The header says which algorithm is used (HS256)
 * The payload contains the data we encoded, like { id: "abc123", iat: 1234567890, exp: 1235567890 }
 * The signature is created by hashing header + payload with our JWT_SECRET — only our server can create a valid signature
 * When the user sends the token back, we verify the signature. If someone tampered with the payload, the signature won't match and we reject it
 * This means we don't need to query the database on every request — we trust the token
 */
export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void | Response> => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Strip the "Bearer " prefix to get just the token
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  try {
    // Verify the signature. If it fails (expired, tampered, missing), catch the error
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    
    // Check if user exists and is not banned
    const userResult = await db.query('SELECT id, role, is_banned FROM users WHERE id = $1', [decoded.id]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (user.is_banned) {
      return res.status(403).json({ error: 'Account suspended.' });
    }

    // If it passes, attach user data to req.user
    req.user = { 
      id: user.id,
      role: user.role
    };
    
    // Call next() to pass control to the actual route handler
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export const isAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await db.query(
      'SELECT role FROM users WHERE id = $1 AND role = $2',
      [req.user.id, 'admin']
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    next();
  } catch (err) {
    console.error('Admin middleware error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
