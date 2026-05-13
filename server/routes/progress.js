const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get user progress summary (for dashboard/unlocking)
router.get('/user/progress', auth, async (req, res) => {
  try {
    const result = await db.query('SELECT lesson_id, exercise_id, code_content, is_completed FROM progress WHERE user_id = $1', [req.user.id]);
    
    // Transform into a format that's easy for the frontend:
    // { completed_lessons: ["html-basics", "css-flexbox"], last_exercise: { slug: "html-basics", id: 2 } }
    const completedExercises = result.rows;
    const completedLessonIds = [...new Set(completedExercises.map(ex => ex.lesson_id))];
    
    res.json({
      completed_lessons: completedLessonIds,
      progress_data: completedExercises,
      current_xp: req.user.xp_total || 0
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update progress (completed an activity)
router.post('/user/update-progress', auth, async (req, res) => {
  try {
    const { lesson_id, exercise_id, code_submitted, xp_earned = 10 } = req.body;
    
    if (!lesson_id || !exercise_id) {
      return res.status(400).json({ error: 'Missing lesson_id or exercise_id' });
    }

    await db.query(
      'INSERT INTO progress (user_id, lesson_id, exercise_id, code_content, xp_earned, is_completed) VALUES ($1, $2, $3, $4, $5, true) ON CONFLICT (user_id, lesson_id, exercise_id) DO UPDATE SET is_completed = true, code_content = $4, completed_at = NOW()',
      [req.user.id, lesson_id, exercise_id, code_submitted, xp_earned]
    );

    // Update user's total XP
    const userUpdate = await db.query(
      'UPDATE users SET xp_total = COALESCE(xp_total, 0) + $1 WHERE id = $2 RETURNING xp_total',
      [xp_earned, req.user.id]
    );

    res.json({ 
      success: true, 
      current_xp: userUpdate.rows[0].xp_total 
    });
  } catch (error) {
    console.error('Error updating user progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Smart Resume: Find the next lesson for the user
router.get('/resume', auth, async (req, res) => {
  // ... (keep existing resume logic)
  try {
    const curriculum = require('../data/curriculum');
    const result = await db.query(
      'SELECT lesson_id, exercise_id FROM progress WHERE user_id = $1 ORDER BY completed_at DESC LIMIT 1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      const first = curriculum[0];
      return res.json({
        nextLesson: {
          level: first.category?.toLowerCase() || 'beginner',
          slug: first.id,
          exerciseId: 1
        }
      });
    }

    const last = result.rows[0];
    const lastIdx = curriculum.findIndex(l => l.id === last.lesson_id);
    const nextIdx = lastIdx + 1 < curriculum.length ? lastIdx + 1 : lastIdx;
    const next = curriculum[nextIdx];

    res.json({
      nextLesson: {
        level: next.category?.toLowerCase() || 'beginner',
        slug: next.id,
        exerciseId: 1
      }
    });
  } catch (error) {
    console.error('Error in resume:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
