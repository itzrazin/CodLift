import { Response } from 'express';
import * as db from '../db';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import * as mailer from '../utils/mailer';

/**
 * HELPER: Log Admin Action
 */
const logAdminAction = async (admin: any, action: string, targetType: string, targetId: string, details: any = {}) => {
  try {
    await db.query(
      `INSERT INTO admin_audit_log (admin_id, admin_email, action, target_type, target_id, details)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [admin.id, admin.email, action, targetType, targetId, JSON.stringify(details)]
    );
  } catch (err) {
    console.error('Failed to log admin action:', err);
  }
};

/**
 * GET /api/admin/stats
 */
export const getAdminStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const totalUsers = (await db.query('SELECT COUNT(*) FROM users')).rows[0].count;
    const activeUsers7d = (await db.query("SELECT COUNT(*) FROM users WHERE last_login >= NOW() - INTERVAL '7 days'")).rows[0].count;
    const totalXp = (await db.query('SELECT SUM(xp_total) FROM users')).rows[0].sum || 0;
    const totalCompleted = (await db.query('SELECT COUNT(*) FROM progress WHERE is_completed = true')).rows[0].count;
    
    const bannedUsers = (await db.query('SELECT COUNT(*) FROM users WHERE is_banned = true')).rows[0].count;
    const openInquiries = (await db.query("SELECT COUNT(*) FROM inquiries WHERE status != 'Resolved'")).rows[0].count;
    const totalAdmins = (await db.query("SELECT COUNT(*) FROM users WHERE role = 'admin'")).rows[0].count;
    const newUsers7d = (await db.query("SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '7 days'")).rows[0].count;

    res.json({
      success: true,
      stats: {
        totalUsers: parseInt(totalUsers),
        activeUsers7d: parseInt(activeUsers7d),
        totalXp: parseInt(totalXp),
        totalCompleted: parseInt(totalCompleted),
        bannedUsers: parseInt(bannedUsers),
        openInquiries: parseInt(openInquiries),
        totalAdmins: parseInt(totalAdmins),
        newUsers7d: parseInt(newUsers7d)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

/**
 * GET /api/admin/stats/growth
 */
export const getGrowthStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM users
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch growth stats' });
  }
};

/**
 * GET /api/admin/stats/activity
 */
export const getActivityStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await db.query(`
      SELECT DATE(last_login) as date, COUNT(*) as count
      FROM users
      WHERE last_login >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(last_login)
      ORDER BY date ASC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity stats' });
  }
};

/**
 * GET /api/admin/stats/top-learners
 */
export const getTopLearners = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await db.query(`
      SELECT username, level, xp_total, 
             (SELECT COUNT(*) FROM progress WHERE user_id = users.id AND is_completed = true) as lessons_completed
      FROM users
      ORDER BY xp_total DESC
      LIMIT 10
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top learners' });
  }
};

/**
 * GET /api/admin/stats/lesson-completion
 */
export const getLessonCompletionStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await db.query(`
      SELECT 
        lesson_id, 
        COUNT(*) as total_attempts,
        SUM(CASE WHEN is_completed = true THEN 1 ELSE 0 END) as total_completions,
        ROUND((SUM(CASE WHEN is_completed = true THEN 1 ELSE 0 END)::numeric / COUNT(*)) * 100, 2) as completion_rate
      FROM progress
      GROUP BY lesson_id
      ORDER BY completion_rate ASC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lesson completion stats' });
  }
};

/**
 * GET /api/admin/users
 */
export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search as string || '';
    const role = req.query.role as string || 'all';
    const status = req.query.status as string || 'all';
    const sortBy = req.query.sortBy as string || 'created_at';
    const sortOrder = (req.query.sortOrder as string || 'DESC').toUpperCase();

    // BUG 6 FIX: Allowlist sort parameters to prevent SQL injection
    const ALLOWED_SORT_COLS = ['created_at', 'last_login', 'username', 'email', 'xp_total', 'level', 'role'];
    const ALLOWED_SORT_DIR = ['ASC', 'DESC'];
    
    const safeSortBy = ALLOWED_SORT_COLS.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = ALLOWED_SORT_DIR.includes(sortOrder) ? sortOrder : 'DESC';

    let query = `SELECT id, avatar, username, email, role, level, xp_total, is_banned, last_login, created_at FROM users WHERE 1=1`;
    const params: any[] = [];

    if (search) {
      query += ` AND (username ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1} OR name ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
    }

    if (role !== 'all') {
      query += ` AND role = $${params.length + 1}`;
      params.push(role);
    }

    if (status === 'banned') {
      query += ` AND is_banned = true`;
    } else if (status === 'active') {
      query += ` AND is_banned = false`;
    }

    const countQuery = query.replace('id, avatar, username, email, role, level, xp_total, is_banned, last_login, created_at', 'COUNT(*)');
    const totalResult = await db.query(countQuery, params);
    const totalUsers = parseInt(totalResult.rows[0].count);

    query += ` ORDER BY ${safeSortBy} ${safeSortOrder} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    res.json({
      success: true,
      users: result.rows,
      pagination: {
        page,
        limit,
        total: totalUsers,
        totalPages: Math.ceil(totalUsers / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

/**
 * GET /api/admin/users/:userId
 */
export const getUserDetail = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const userResult = await db.query(
      'SELECT id, avatar, username, email, role, level, xp_total, streak, created_at, last_login, bio, github_username, linkedin_username, is_banned, ban_reason, banned_at FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const progressResult = await db.query(
      'SELECT lesson_id, exercise_id, completed_at FROM progress WHERE user_id = $1 AND is_completed = true ORDER BY completed_at DESC',
      [userId]
    );

    res.json({
      success: true,
      user: userResult.rows[0],
      progress: progressResult.rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user detail' });
  }
};

/**
 * PUT /api/admin/users/:userId/role
 */
export const updateUserRole = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    await db.query('UPDATE users SET role = $1 WHERE id = $2', [role, userId]);
    
    const adminEmail = (await db.query('SELECT email FROM users WHERE id = $1', [req.user!.id])).rows[0].email;
    await logAdminAction({ id: req.user!.id, email: adminEmail }, 'UPDATE_USER_ROLE', 'user', userId, { role });

    res.json({ success: true, message: 'Role updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update role' });
  }
};

/**
 * PUT /api/admin/users/:userId/ban
 */
export const banUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    if (!reason) return res.status(400).json({ error: 'Ban reason is required' });

    await db.query(
      'UPDATE users SET is_banned = true, ban_reason = $1, banned_at = NOW() WHERE id = $2',
      [reason, userId]
    );

    const adminEmail = (await db.query('SELECT email FROM users WHERE id = $1', [req.user!.id])).rows[0].email;
    await logAdminAction({ id: req.user!.id, email: adminEmail }, 'BAN_USER', 'user', userId, { reason });

    res.json({ success: true, message: 'User banned' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to ban user' });
  }
};

/**
 * PUT /api/admin/users/:userId/unban
 */
export const unbanUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    await db.query('UPDATE users SET is_banned = false, ban_reason = NULL, banned_at = NULL WHERE id = $1', [userId]);

    const adminEmail = (await db.query('SELECT email FROM users WHERE id = $1', [req.user!.id])).rows[0].email;
    await logAdminAction({ id: req.user!.id, email: adminEmail }, 'UNBAN_USER', 'user', userId);

    res.json({ success: true, message: 'User unbanned' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unban user' });
  }
};

/**
 * POST /api/admin/users/:userId/send-email
 */
export const sendEmailToUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { subject, message } = req.body;

    const user = (await db.query('SELECT email FROM users WHERE id = $1', [userId])).rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });

    await mailer.sendCustomEmail(user.email, subject, message);

    const adminEmail = (await db.query('SELECT email FROM users WHERE id = $1', [req.user!.id])).rows[0].email;
    await logAdminAction({ id: req.user!.id, email: adminEmail }, 'SEND_EMAIL', 'user', userId, { subject });

    res.json({ success: true, message: 'Email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email' });
  }
};

/**
 * GET /api/admin/inquiries
 */
export const getAllInquiries = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status as string || 'all';

    let query = 'SELECT id, name, email, subject, message, status, created_at FROM inquiries';
    const params: any[] = [];

    if (status !== 'all') {
      query += ' WHERE status = $1';
      params.push(status);
    }

    const totalInquiries = (await db.query(query.replace('id, name, email, subject, message, status, created_at', 'COUNT(*)'), params)).rows[0].count;

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    res.json({
      success: true,
      inquiries: result.rows,
      pagination: {
        page,
        limit,
        total: parseInt(totalInquiries),
        totalPages: Math.ceil(parseInt(totalInquiries) / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
};

/**
 * POST /api/admin/inquiries/:inquiryId/reply
 */
export const replyToInquiry = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { inquiryId } = req.params;
    const { message } = req.body;

    const inquiry = (await db.query('SELECT email, subject FROM inquiries WHERE id = $1', [inquiryId])).rows[0];
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });

    await mailer.sendCustomEmail(inquiry.email, `Re: ${inquiry.subject}`, message);

    await db.query(
      'INSERT INTO inquiry_replies (inquiry_id, reply_text, replied_by_admin_id) VALUES ($1, $2, $3)',
      [inquiryId, message, req.user!.id]
    );

    await db.query("UPDATE inquiries SET status = 'In Progress' WHERE id = $1 AND status = 'Pending'", [inquiryId]);

    const adminEmail = (await db.query('SELECT email FROM users WHERE id = $1', [req.user!.id])).rows[0].email;
    await logAdminAction({ id: req.user!.id, email: adminEmail }, 'REPLY_INQUIRY', 'inquiry', inquiryId);

    res.json({ success: true, message: 'Reply sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send reply' });
  }
};

/**
 * PUT /api/admin/inquiries/:inquiryId/status
 */
export const updateInquiryStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { inquiryId } = req.params;
    const { status } = req.body;

    if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await db.query('UPDATE inquiries SET status = $1 WHERE id = $2', [status, inquiryId]);
    
    const adminEmail = (await db.query('SELECT email FROM users WHERE id = $1', [req.user!.id])).rows[0].email;
    await logAdminAction({ id: req.user!.id, email: adminEmail }, 'UPDATE_INQUIRY_STATUS', 'inquiry', inquiryId, { status });

    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};

/**
 * DELETE /api/admin/users/:userId
 */
export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    if (req.user?.id === userId) return res.status(400).json({ error: 'Cannot delete self' });

    await db.query('DELETE FROM users WHERE id = $1', [userId]);
    
    const adminEmail = (await db.query('SELECT email FROM users WHERE id = $1', [req.user!.id])).rows[0].email;
    await logAdminAction({ id: req.user!.id, email: adminEmail }, 'DELETE_USER', 'user', userId);

    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

/**
 * GET /api/admin/audit-log
 */
export const getAuditLog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    const total = (await db.query('SELECT COUNT(*) FROM admin_audit_log')).rows[0].count;
    const result = await db.query(
      'SELECT * FROM admin_audit_log ORDER BY performed_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    res.json({
      success: true,
      logs: result.rows,
      pagination: {
        page,
        limit,
        total: parseInt(total),
        totalPages: Math.ceil(parseInt(total) / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};

/**
 * PUT /api/admin/users/:userId/reset-xp
 */
export const resetUserXP = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    await db.query('UPDATE users SET xp = 0, xp_total = 0 WHERE id = $1', [userId]);
    
    const adminEmail = (await db.query('SELECT email FROM users WHERE id = $1', [req.user!.id])).rows[0].email;
    await logAdminAction({ id: req.user!.id, email: adminEmail }, 'RESET_XP', 'user', userId);
    
    res.json({ success: true, message: 'XP reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset XP' });
  }
};

/**
 * PUT /api/admin/users/:userId/reset-progress
 */
export const resetUserProgress = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    await db.query('DELETE FROM progress WHERE user_id = $1', [userId]);
    
    const adminEmail = (await db.query('SELECT email FROM users WHERE id = $1', [req.user!.id])).rows[0].email;
    await logAdminAction({ id: req.user!.id, email: adminEmail }, 'RESET_PROGRESS', 'user', userId);
    
    res.json({ success: true, message: 'Progress reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset progress' });
  }
};

/**
 * POST /api/admin/broadcast/email
 */
export const broadcastEmail = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { audience, subject, message } = req.body;
    
    let query = 'SELECT email FROM users WHERE is_banned = false';
    if (audience === 'admins') query += " AND role = 'admin'";
    else if (['beginner', 'pro', 'master'].includes(audience)) query += ` AND level = '${audience}'`;
    
    const result = await db.query(query);
    const emails = result.rows.map(r => r.email);
    
    await mailer.sendBulkEmail(emails, subject, message);
    
    const adminEmail = (await db.query('SELECT email FROM users WHERE id = $1', [req.user!.id])).rows[0].email;
    await logAdminAction({ id: req.user!.id, email: adminEmail }, 'BROADCAST_EMAIL', 'platform', 'all', { audience, subject });
    
    res.json({ success: true, message: `Email sent to ${emails.length} users` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to broadcast email' });
  }
};

/**
 * POST /api/admin/announcements
 */
export const createAnnouncement = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, message, type, expires_at } = req.body;
    await db.query(
      'INSERT INTO announcements (title, message, type, expires_at, created_by) VALUES ($1, $2, $3, $4, $5)',
      [title, message, type, expires_at, req.user!.id]
    );
    
    const adminEmail = (await db.query('SELECT email FROM users WHERE id = $1', [req.user!.id])).rows[0].email;
    await logAdminAction({ id: req.user!.id, email: adminEmail }, 'CREATE_ANNOUNCEMENT', 'announcement', 'new');
    
    res.json({ success: true, message: 'Announcement created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create announcement' });
  }
};

/**
 * GET /api/admin/announcements
 */
export const getAnnouncements = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM announcements ORDER BY created_at DESC');
    res.json({ success: true, announcements: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
};

/**
 * DELETE /api/admin/announcements/:id
 */
export const deleteAnnouncement = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM announcements WHERE id = $1', [id]);
    
    const adminEmail = (await db.query('SELECT email FROM users WHERE id = $1', [req.user!.id])).rows[0].email;
    await logAdminAction({ id: req.user!.id, email: adminEmail }, 'DELETE_ANNOUNCEMENT', 'announcement', id);

    res.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
};
