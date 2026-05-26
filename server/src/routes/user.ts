import express, { Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import * as userController from '../controllers/userController';
import * as db from '../db';

const router = express.Router();

router.get('/me', authMiddleware, userController.getMe);
router.put('/profile', authMiddleware, userController.updateProfile);

router.put('/level', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { level } = req.body;
    const validLevels = ['beginner', 'intermediate', 'pro', 'master'];
    
    if (!validLevels.includes(level)) {
      return res.status(400).json({ error: 'Invalid level' });
    }
    
    await db.query('UPDATE users SET level = $1 WHERE id = $2', [level, req.user!.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Update level error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
