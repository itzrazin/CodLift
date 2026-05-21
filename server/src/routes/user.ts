import express from 'express';
import { getMe, updateProfile } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

// GET /api/user/me
router.get('/me', getMe);

// PUT /api/user/profile
router.put('/profile', updateProfile);

export default router;
