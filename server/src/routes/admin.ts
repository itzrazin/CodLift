import express from 'express';
import { 
  getAdminStats, 
  getAllUsers, 
  updateUserRole, 
  getAllInquiries, 
  updateInquiryStatus, 
  deleteUser 
} from '../controllers/adminController';
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

// DELETE /api/admin/users/:userId - Delete a user record completely
router.delete('/users/:userId', deleteUser);

// GET /api/admin/inquiries - Get all inquiries (paginated)
router.get('/inquiries', getAllInquiries);

// PUT /api/admin/inquiries/:inquiryId/status - Update inquiry status
router.put('/inquiries/:inquiryId/status', updateInquiryStatus);

export default router;
