const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const { calculateXP } = require('../utils/xpEngine');

// ─── GET: User progress summary ───────────────────────────────────────────────
// Used by the dashboard to determine which lessons are unlocked.
router.get('/progress', auth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT lesson_id, exercise_id, code_content, is_completed FROM progress WHERE user_id = $1',
      [req.user.id]
    );

    const completedExercises = result.rows;
    const completedLessonIds = [...new Set(completedExercises.map(ex => ex.lesson_id))];

    // Fetch fresh XP from DB — never rely on client-provided value
    const userRow = await db.query('SELECT xp_total, streak FROM users WHERE id = $1', [req.user.id]);
    const currentXP = userRow.rows[0]?.xp_total || 0;
    const streakDays = userRow.rows[0]?.streak || 0;

    res.json({
      completed_lessons: completedLessonIds,
      progress_data:     completedExercises
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── POST: Record a completed exercise & award XP ─────────────────────────────
// XP is computed entirely server-side; the client's xp_earned value is IGNORED.
router.post('/update-progress', auth, async (req, res) => {
  try {
    const { lesson_id, exercise_id, code_submitted, solve_time_ms } = req.body;

    if (!lesson_id || !exercise_id) {
      return res.status(400).json({ error: 'Missing lesson_id or exercise_id' });
    }

    // Fetch streak for multiplier calculation
    const userRow = await db.query('SELECT streak, xp_total FROM users WHERE id = $1', [req.user.id]);
    const streakDays = userRow.rows[0]?.streak || 0;

    // Check for first-time completion to prevent duplicate XP awards
    const existing = await db.query(
      'SELECT id FROM progress WHERE user_id = $1 AND lesson_id = $2 AND exercise_id = $3 AND is_completed = true',
      [req.user.id, lesson_id, exercise_id]
    );
    const alreadyCompleted = existing.rows.length > 0;

    let xpEarned = 0;
    let breakdown = {};

    if (!alreadyCompleted) {
      const xpResult = calculateXP({
        exerciseId: exercise_id,
        lessonId: lesson_id,
        solveTimeMs: solve_time_ms ? parseInt(solve_time_ms) : null,
        streakDays: parseInt(streakDays) || 0
      });
      xpEarned = xpResult.xp;
      breakdown = xpResult.breakdown;
    }

    // Upsert progress row
    await db.query(
      `INSERT INTO progress (user_id, lesson_id, exercise_id, code_content, xp_earned, is_completed)
       VALUES ($1, $2, $3, $4, $5, true)
       ON CONFLICT (user_id, lesson_id, exercise_id)
       DO UPDATE SET is_completed = true, code_content = $4, xp_earned = CASE WHEN progress.is_completed = true THEN progress.xp_earned ELSE $5 END, completed_at = NOW()`,
      [req.user.id, lesson_id, exercise_id, code_submitted, xpEarned]
    );

    let currentXP = userRow.rows[0]?.xp_total || 0;

    if (!alreadyCompleted && xpEarned > 0) {
      // Award XP only on first correct completion
      const updated = await db.query(
        'UPDATE users SET xp_total = COALESCE(xp_total, 0) + $1, xp = COALESCE(xp, 0) + $1 WHERE id = $2 RETURNING xp_total',
        [xpEarned, req.user.id]
      );
      currentXP = updated.rows[0].xp_total;
    }

    res.json({
      success:       true,
      already_done:  alreadyCompleted,
      xp_earned:     xpEarned,
      xp_total:      currentXP,
      breakdown:     breakdown
    });
  } catch (error) {
    console.error('Error updating user progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── GET: Smart Resume ────────────────────────────────────────────────────────
// Returns the next lesson the user should continue from.
router.get('/resume', auth, async (req, res) => {
  try {
    const curriculum = require('../data/curriculum');
    const result = await db.query(
      'SELECT lesson_id, exercise_id FROM progress WHERE user_id = $1 AND is_completed = true',
      [req.user.id]
    );

    const completedSet = new Set(result.rows.map(r => `${r.lesson_id}:${r.exercise_id}`));

    let nextLesson = null;
    let nextExerciseId = 1;

    for (const lesson of curriculum) {
      for (let i = 0; i < lesson.exercises.length; i++) {
        const exNum = i + 1;
        if (!completedSet.has(`${lesson.id}:${exNum}`)) {
          nextLesson = lesson;
          nextExerciseId = exNum;
          break;
        }
      }
      if (nextLesson) break;
    }

    if (!nextLesson) {
      // Completed everything
      const last = curriculum[curriculum.length - 1];
      nextLesson = last;
      nextExerciseId = last.exercises.length;
    }

    res.json({
      nextLesson: {
        level:      nextLesson.level?.toLowerCase() || 'beginner',
        slug:       nextLesson.id,
        exerciseId: nextExerciseId
      }
    });
  } catch (error) {
    console.error('Error in resume:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
