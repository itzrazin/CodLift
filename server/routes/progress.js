const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Get all progress for a user
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const result = await db.query(
      'SELECT lesson_id, exercise_id, is_completed, attempts, xp_earned, completed_at FROM progress WHERE user_id = $1 ORDER BY lesson_id, exercise_id',
      [userId]
    );
    
    res.json({ progress: result.rows });
  } catch (err) {
    console.error('Get progress error:', err);
    res.status(500).json({ message: 'Error fetching progress.' });
  }
});

// Save exercise completion
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { lesson_id, exercise_id, code_submitted, xp_earned = 10 } = req.body;
    const userId = req.user.id;

    // Upsert progress
    const result = await db.query(
      `INSERT INTO progress (user_id, lesson_id, exercise_id, is_completed, attempts, xp_earned, code_submitted, completed_at)
       VALUES ($1, $2, $3, true, 1, $4, $5, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, lesson_id, exercise_id)
       DO UPDATE SET 
         is_completed = true,
         attempts = progress.attempts + 1,
         xp_earned = GREATEST(progress.xp_earned, $4),
         code_submitted = $5,
         completed_at = COALESCE(progress.completed_at, CURRENT_TIMESTAMP)
       RETURNING *`,
      [userId, lesson_id, exercise_id, xp_earned, code_submitted]
    );

    // Only award XP if this is first completion
    if (result.rows[0].attempts === 1) {
      await db.query('UPDATE users SET xp_total = xp_total + $1 WHERE id = $2', [xp_earned, userId]);
    }

    // Check for achievements
    await checkAchievements(userId);

    // Get updated user XP
    const userResult = await db.query('SELECT xp_total FROM users WHERE id = $1', [userId]);

    res.json({ 
      progress: result.rows[0],
      total_xp: userResult.rows[0].xp_total,
      xp_gained: result.rows[0].attempts === 1 ? xp_earned : 0
    });
  } catch (err) {
    console.error('Save progress error:', err);
    res.status(500).json({ message: 'Error saving progress.' });
  }
});

// Get bookmarks
router.get('/:userId/bookmarks', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const result = await db.query(
      'SELECT lesson_id, exercise_id, created_at FROM bookmarks WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    res.json({ bookmarks: result.rows });
  } catch (err) {
    console.error('Get bookmarks error:', err);
    res.status(500).json({ message: 'Error fetching bookmarks.' });
  }
});

// Toggle bookmark
router.post('/bookmark', authenticateToken, async (req, res) => {
  try {
    const { lesson_id, exercise_id } = req.body;
    const userId = req.user.id;

    // Check if already bookmarked
    const existing = await db.query(
      'SELECT id FROM bookmarks WHERE user_id = $1 AND lesson_id = $2 AND exercise_id = $3',
      [userId, lesson_id, exercise_id]
    );

    if (existing.rows.length > 0) {
      await db.query('DELETE FROM bookmarks WHERE id = $1', [existing.rows[0].id]);
      res.json({ bookmarked: false });
    } else {
      await db.query(
        'INSERT INTO bookmarks (user_id, lesson_id, exercise_id) VALUES ($1, $2, $3)',
        [userId, lesson_id, exercise_id]
      );
      res.json({ bookmarked: true });
    }
  } catch (err) {
    console.error('Bookmark error:', err);
    res.status(500).json({ message: 'Error toggling bookmark.' });
  }
});

// Check and award achievements
async function checkAchievements(userId) {
  try {
    const progressResult = await db.query(
      'SELECT COUNT(*) as total FROM progress WHERE user_id = $1 AND is_completed = true',
      [userId]
    );
    const totalCompleted = parseInt(progressResult.rows[0].total);

    const achievements = [
      { count: 1, badge: 'First Steps', },
      { count: 5, badge: 'Getting Started' },
      { count: 10, badge: 'On Fire' },
      { count: 25, badge: 'Code Warrior' },
      { count: 50, badge: 'Half Century' },
      { count: 100, badge: 'Centurion' },
    ];

    for (const ach of achievements) {
      if (totalCompleted >= ach.count) {
        await db.query(
          'INSERT INTO achievements (user_id, badge_name) VALUES ($1, $2) ON CONFLICT (user_id, badge_name) DO NOTHING',
          [userId, ach.badge]
        );
      }
    }
  } catch (err) {
    console.error('Achievement check error:', err);
  }
}

module.exports = router;
