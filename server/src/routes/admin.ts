import express from 'express';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware';
import * as adminController from '../controllers/adminController';

const router = express.Router();

// All routes here require admin access
router.use(authMiddleware, isAdmin);

// Dashboard Stats
router.get('/stats', adminController.getAdminStats);
router.get('/stats/growth', adminController.getGrowthStats);
router.get('/stats/top-learners', adminController.getTopLearners);

// User Management
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserDetail);
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
router.post('/broadcast/email', adminController.broadcastEmail);
router.get('/announcements', adminController.getAnnouncements);
router.post('/announcements', adminController.createAnnouncement);

// Audit Log
router.get('/audit-log', adminController.getAuditLog);

export default router;
