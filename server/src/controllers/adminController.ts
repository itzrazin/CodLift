import { Response } from 'express';
import * as db from '../db';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

/**
 * GET /api/admin/stats
 * Returns real-time statistics from the database for the admin dashboard
 */
export const getAdminStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Total users count
    const totalUsersResult = await db.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(totalUsersResult.rows[0].count, 10);

    // Active users (logged in within last 7 days)
    const activeUsersResult = await db.query(
      `SELECT COUNT(*) as count FROM users WHERE last_login >= NOW() - INTERVAL '7 days'`
    );
    const activeUsers = parseInt(activeUsersResult.rows[0].count, 10);

    // Total lessons completed (from progress table)
    const completedLessonsResult = await db.query(
      `SELECT COUNT(*) as count FROM progress WHERE completed = true`
    );
    const completedLessons = parseInt(completedLessonsResult.rows[0].count, 10);

    // Total XP earned across all users
    const totalXpResult = await db.query('SELECT SUM(xp_total) as total FROM users');
    const totalXp = parseInt(totalXpResult.rows[0].total || '0', 10);

    // Average XP per user
    const avgXp = totalUsers > 0 ? Math.round(totalXp / totalUsers) : 0;

    // New users this week
    const newUsersResult = await db.query(
      `SELECT COUNT(*) as count FROM users WHERE created_at >= NOW() - INTERVAL '7 days'`
    );
    const newUsers = parseInt(newUsersResult.rows[0].count, 10);

    // User growth percentage (compare this week vs last week)
    const lastWeekUsersResult = await db.query(
      `SELECT COUNT(*) as count FROM users WHERE created_at >= NOW() - INTERVAL '14 days' AND created_at < NOW() - INTERVAL '7 days'`
    );
    const lastWeekUsers = parseInt(lastWeekUsersResult.rows[0].count, 10);
    const userGrowth = lastWeekUsers > 0 
      ? Math.round(((newUsers - lastWeekUsers) / lastWeekUsers) * 100) 
      : 0;

    // Daily active users for the last 7 days (for traffic chart)
    const dailyActiveUsersResult = await db.query(`
      SELECT 
        DATE(last_login) as date,
        COUNT(*) as count
      FROM users
      WHERE last_login >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(last_login)
      ORDER BY date ASC
    `);
    const dailyActiveUsers = dailyActiveUsersResult.rows.map(row => ({
      date: row.date,
      count: parseInt(row.count, 10)
    }));

    // Admin count
    const adminCountResult = await db.query(`SELECT COUNT(*) as count FROM users WHERE role = 'admin'`);
    const adminCount = parseInt(adminCountResult.rows[0].count, 10);

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        completedLessons,
        totalXp,
        avgXp,
        newUsers,
        userGrowth,
        dailyActiveUsers,
        adminCount
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch admin statistics' });
  }
};

/**
 * GET /api/admin/users
 * Returns paginated list of all users with their details
 */
export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const usersResult = await db.query(
      `SELECT id, name, username, email, role, level, xp_total, streak, created_at, last_login 
       FROM users 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await db.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      success: true,
      users: usersResult.rows,
      pagination: {
        page,
        limit,
        totalUsers,
        totalPages
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

/**
 * PUT /api/admin/users/:userId/role
 * Update a user's role (admin/user)
 */
export const updateUserRole = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be "admin" or "user"' });
    }

    const result = await db.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
      [role, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
};
