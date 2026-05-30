import express from 'express';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware';
import * as adminController from '../controllers/adminController';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const broadcastLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1,
  message: { error: 'Rate limit exceeded. Try again in 10 minutes.' }
});

// Public announcements route (must be before auth middleware)
router.get('/announcements', adminController.getAnnouncements);

// All routes here require admin access
router.use(authMiddleware, isAdmin);

// Dashboard Stats
router.get('/stats', adminController.getAdminStats);
router.get('/stats/growth', adminController.getGrowthStats);
router.get('/stats/activity', adminController.getActivityStats);
router.get('/stats/top-learners', adminController.getTopLearners);
router.get('/stats/lesson-completion', adminController.getLessonCompletionStats);

// User Management
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserDetail);
router.put('/users/:userId/role', adminController.updateUserRole);
router.put('/users/:userId/ban', adminController.banUser);
router.put('/users/:userId/unban', adminController.unbanUser);
router.put('/users/:userId/reset-xp', adminController.resetUserXP);
router.put('/users/:userId/reset-progress', adminController.resetUserProgress);
router.post('/users/:userId/send-email', adminController.sendEmailToUser);
router.delete('/users/:userId', adminController.deleteUser);

// Inquiries / Support
router.get('/inquiries', adminController.getAllInquiries);
router.post('/inquiries/:inquiryId/reply', adminController.replyToInquiry);
router.put('/inquiries/:inquiryId/status', adminController.updateInquiryStatus);

// Broadcast & Announcements
router.post('/broadcast/email', broadcastLimiter, adminController.broadcastEmail);
router.post('/announcements', adminController.createAnnouncement);
router.delete('/announcements/:id', adminController.deleteAnnouncement);

// Audit Log
router.get('/audit-log', adminController.getAuditLog);

export default router;
