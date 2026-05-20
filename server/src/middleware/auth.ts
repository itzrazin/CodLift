import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// AuthenticatedRequest is just Request — req.user.id is provided via Express namespace augmentation in types/express.d.ts
export type AuthenticatedRequest = Request;

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void | Response {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { id: string };
    req.user = { id: decoded.id } as Express.User;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid authentication token' });
  }
}
