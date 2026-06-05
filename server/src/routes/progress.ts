import express, { Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import * as db from '../db';
import { curriculum } from '../data/curriculum';
import levelsData from '../data/levels.json';
import { consumeVerificationToken } from '../utils/verificationStore';
import rateLimit from 'express-rate-limit';

const progressLimiter = rateLimit({
  windowMs: 5000,
  max: 2,
  message: { error: 'Too many progress updates, please try again later.' }
});

const router = express.Router();

/**
 * XP CALCULATION ENGINE
 */
function calculateXP(solveTimeMs: number | null, difficulty: string): number {
  const baseXP = levelsData.base_xp.default;
  const multiplier = (levelsData.difficulty_multipliers as any)[difficulty] || 1.0;
  
  let xp = baseXP * multiplier;

  // Apply speed bonus
  if (solveTimeMs) {
    if (solveTimeMs < 30000) {
      xp += levelsData.speed_bonus.under_30s;
    } else if (solveTimeMs < 60000) {
      xp += levelsData.speed_bonus.under_60s;
    } else if (solveTimeMs < 120000) {
      xp += levelsData.speed_bonus.under_120s;
    }
  }

  return Math.round(xp);
}

// GET /api/progress - Fetch all progress for the current user
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await db.query(
      'SELECT * FROM progress WHERE user_id = $1 ORDER BY completed_at DESC',
      [req.user!.id]
    );
    res.json({ progress_data: result.rows });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/progress/update-progress - Record lesson completion and award XP
router.post('/update-progress', authMiddleware, progressLimiter, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { lesson_id, exercise_id, code_submitted, solve_time_ms, verificationToken } = req.body;
    const userId = req.user!.id;

    if (!lesson_id || !exercise_id || !verificationToken) {
      return res.status(400).json({ error: 'Missing lesson_id, exercise_id, or verification token' });
    }

    if (code_submitted && code_submitted.length > 50000) {
      return res.status(400).json({ error: 'Code submitted is too large' });
    }

    // 0. Resolve the actual string ID for the token (since client sends numerical index)
    let tokenExerciseId = exercise_id;
    const lesson = curriculum.find(l => l.id === lesson_id);
    if (lesson && !isNaN(parseInt(exercise_id))) {
      const idx = parseInt(exercise_id) - 1;
      if (lesson.exercises[idx]) {
        tokenExerciseId = lesson.exercises[idx].id;
      }
    } else if (lesson_id === 'arena') {
      // For arena, client usually sends the string ID directly, but let's be safe.
      tokenExerciseId = exercise_id;
    }

    // 0.5 Verify the token
    const isValidToken = consumeVerificationToken(verificationToken, userId, lesson_id, tokenExerciseId);
    if (!isValidToken) {
      return res.status(403).json({ error: 'Invalid or expired verification token. Please re-verify your code.' });
    }

    // 1. Check if already completed
    const existing = await db.query(
      'SELECT id FROM progress WHERE user_id = $1 AND lesson_id = $2 AND exercise_id = $3 AND is_completed = true',
      [userId, lesson_id, exercise_id]
    );

    const alreadyCompleted = existing.rows.length > 0;
    let xpEarned = 0;

    // 2. Calculate XP only for new completions
    if (!alreadyCompleted) {
      const lesson = curriculum.find(l => l.id === lesson_id);
      const difficulty = lesson?.level || 'beginner';
      xpEarned = calculateXP(solve_time_ms, difficulty);
    }

    // 3. Insert or update progress
    await db.query(
      `INSERT INTO progress (user_id, lesson_id, exercise_id, is_completed, code_content, xp_earned)
       VALUES ($1, $2, $3, true, $4, $5)
       ON CONFLICT (user_id, lesson_id, exercise_id)
       DO UPDATE SET 
         is_completed = true, 
         code_content = $4,
         xp_earned = CASE WHEN progress.is_completed = false THEN $5 ELSE progress.xp_earned END,
         completed_at = CURRENT_TIMESTAMP`,
      [userId, lesson_id, exercise_id, code_submitted, xpEarned]
    );

    // 4. Update user total XP
    if (xpEarned > 0) {
      await db.query(
        'UPDATE users SET xp = COALESCE(xp, 0) + $1, xp_total = COALESCE(xp_total, 0) + $1 WHERE id = $2',
        [xpEarned, userId]
      );
    }

    res.json({ 
      success: true, 
      already_done: alreadyCompleted,
      xp_earned: xpEarned
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/progress/resume - Get the last uncompleted exercise for the user
router.get('/resume', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await db.query(
      'SELECT lesson_id, exercise_id FROM progress WHERE user_id = $1 AND is_completed = true ORDER BY completed_at DESC LIMIT 1',
      [req.user!.id]
    );

    if (result.rows.length === 0) {
      // No progress yet, start with first lesson
      const firstLesson = curriculum[0];
      return res.json({
        resume: {
          level:      firstLesson.level,
          slug:       firstLesson.id,
          exerciseId: 1
        }
      });
    }

    const last = result.rows[0];
    const lastLesson = curriculum.find(l => l.id === last.lesson_id);
    if (!lastLesson) return res.status(404).json({ error: 'Last lesson not found' });

    const lastExId = parseInt(last.exercise_id);
    let nextExerciseId = lastExId + 1;
    let nextLesson = lastLesson;

    if (nextExerciseId > lastLesson.exercises.length) {
      const currentIdx = curriculum.findIndex(l => l.id === last.lesson_id);
      if (currentIdx < curriculum.length - 1) {
        nextLesson = curriculum[currentIdx + 1];
        nextExerciseId = 1;
      } else {
        // All lessons completed!
        return res.json({ resume: null });
      }
    }

    res.json({
      resume: {
        level:      nextLesson.level,
        slug:       nextLesson.id,
        exerciseId: nextExerciseId
      }
    });
  } catch (error) {
    console.error('Error in resume:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
