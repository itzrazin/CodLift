import express from 'express';
import { getAdminStats, getAllUsers, updateUserRole } from '../controllers/adminController';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// All admin routes require authentication AND admin role
router.use(authMiddleware);
router.use(isAdmin);

// GET /api/admin/stats - Get dashboard statistics
router.get('/stats', getAdminStats);

// GET /api/admin/users - Get all users (paginated)
router.get('/users', getAllUsers);

// PUT /api/admin/users/:userId/role - Update user role
router.put('/users/:userId/role', updateUserRole);

export default router;
