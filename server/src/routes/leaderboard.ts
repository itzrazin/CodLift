import express, { Request, Response } from 'express';
import * as db from '../db';

const router = express.Router();

// GET /api/leaderboard?period=weekly|all-time
router.get('/', async (req: Request, res: Response) => {
  try {
    const period = typeof req.query.period === 'string' ? req.query.period : 'all-time';
    const limitParam = typeof req.query.limit === 'string' ? req.query.limit : '50';
    const limit = Math.min(parseInt(limitParam) || 50, 100);
    
    let query: string;
    if (period === 'weekly') {
      // Weekly: XP earned in last 7 days via progress completions
      query = `
        SELECT 
          u.id, COALESCE(u.username, u.name, 'Anonymous') as username, u.profile_photo as avatar, u.level,
          COALESCE(COUNT(DISTINCT p.lesson_id || '-' || p.exercise_id) FILTER (WHERE p.is_completed = true), 0) as lessons_completed
        FROM users u
        LEFT JOIN progress p ON p.user_id = u.id AND p.is_completed = true AND p.completed_at >= NOW() - INTERVAL '7 days'
        GROUP BY u.id, u.name, u.username, u.profile_photo, u.level
        ORDER BY lessons_completed DESC, username ASC
        LIMIT $1
      `;
    } else {
      query = `
        SELECT 
          u.id, COALESCE(u.username, u.name, 'Anonymous') as username, u.profile_photo as avatar, u.level,
          COALESCE(COUNT(DISTINCT p.lesson_id || '-' || p.exercise_id), 0) as lessons_completed
        FROM users u
        LEFT JOIN progress p ON p.user_id = u.id AND p.is_completed = true
        GROUP BY u.id, u.name, u.username, u.profile_photo, u.level
        ORDER BY lessons_completed DESC, username ASC
        LIMIT $1
      `;
    }

    const result = await db.query(query, [limit]);
    
    const ranked = result.rows.map((row: any, index: number) => ({
      rank: index + 1,
      id: row.id,
      username: row.username,
      avatar: row.avatar,
      level: row.level || 'beginner',
      lessons_completed: parseInt(row.lessons_completed) || 0,
    }));

    res.json({ leaderboard: ranked, period, total: ranked.length });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(503).json({ error: 'Leaderboard temporarily unavailable. Please try again later.' });
  }
});

export default router;
