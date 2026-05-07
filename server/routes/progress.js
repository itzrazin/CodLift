const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query('SELECT lesson_id, exercise_id, is_completed FROM progress WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Server error fetching progress' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { lesson_id, exercise_id = '1', xp_earned = 10 } = req.body;
    await db.query(
      'INSERT INTO progress (user_id, lesson_id, exercise_id, xp_earned, is_completed) VALUES ($1, $2, $3, $4, true) ON CONFLICT (user_id, lesson_id, exercise_id) DO UPDATE SET is_completed = true, completed_at = NOW()',
      [req.user.id, lesson_id, exercise_id, xp_earned]
    );
    // Update user's total XP
    await db.query('UPDATE users SET xp_total = COALESCE(xp_total, 0) + $1 WHERE id = $2', [xp_earned, req.user.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ error: 'Server error saving progress' });
  }
});

// Smart Resume: Find the next lesson for the user
router.get('/resume', auth, async (req, res) => {
  try {
    const curriculum = require('../data/curriculum');
    const result = await db.query(
      'SELECT lesson_id, exercise_id FROM progress WHERE user_id = $1 ORDER BY completed_at DESC LIMIT 1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      // New user, start from first lesson
      const first = curriculum[0];
      return res.json({
        nextLesson: {
          level: first.category.toLowerCase(),
          slug: first.id || 'html-basics',
          exerciseId: 1
        }
      });
    }

    const last = result.rows[0];
    // Find last lesson in curriculum
    const lastIdx = curriculum.findIndex(l => l.id === last.lesson_id);
    
    // Logic to find next lesson or next exercise
    // (Simplification: return the next lesson in sequence)
    const nextIdx = lastIdx + 1 < curriculum.length ? lastIdx + 1 : lastIdx;
    const next = curriculum[nextIdx];

    res.json({
      nextLesson: {
        level: next.category.toLowerCase(),
        slug: next.id || next.title.toLowerCase().replace(/\s+/g, '-'),
        exerciseId: 1
      }
    });
  } catch (error) {
    console.error('Error in resume:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
