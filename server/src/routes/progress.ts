import express, { Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import * as db from '../db';
import curriculum from '../data/curriculum';

const router = express.Router();

// ─── GET /api/progress — User progress summary ────────────────────────────────
router.get('/progress', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await db.query(
      'SELECT lesson_id, exercise_id, code_content, is_completed FROM progress WHERE user_id = $1',
      [req.user!.id]
    );

    const completedExercises  = result.rows;
    const completedLessonIds  = [...new Set<string>(completedExercises.map((ex: any) => ex.lesson_id))];

    res.json({
      completed_lessons: completedLessonIds,
      progress_data:     completedExercises
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── POST /api/progress/update-progress — Record completed exercise ──────────
router.post('/update-progress', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { lesson_id, exercise_id, code_submitted } = req.body;

    if (!lesson_id || !exercise_id) {
      return res.status(400).json({ error: 'Missing lesson_id or exercise_id' });
    }

    const existing = await db.query(
      'SELECT id FROM progress WHERE user_id = $1 AND lesson_id = $2 AND exercise_id = $3 AND is_completed = true',
      [req.user!.id, lesson_id, exercise_id]
    );
    const alreadyCompleted = existing.rows.length > 0;

    await db.query(
      `INSERT INTO progress (user_id, lesson_id, exercise_id, code_content, is_completed)
       VALUES ($1, $2, $3, $4, true)
       ON CONFLICT (user_id, lesson_id, exercise_id)
       DO UPDATE SET is_completed = true, code_content = $4, completed_at = NOW()`,
      [req.user!.id, lesson_id, exercise_id, code_submitted]
    );

    res.json({
      success:      true,
      already_done: alreadyCompleted
    });
  } catch (error) {
    console.error('Error updating user progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── GET /api/progress/resume — Smart Resume ─────────────────────────────────
router.get('/resume', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await db.query(
      'SELECT lesson_id, exercise_id FROM progress WHERE user_id = $1 AND is_completed = true',
      [req.user!.id]
    );

    const completedSet = new Set<string>(result.rows.map((r: any) => `${r.lesson_id}:${r.exercise_id}`));

    let nextLesson: any = null;
    let nextExerciseId  = 1;

    for (const lesson of curriculum) {
      for (let i = 0; i < lesson.exercises.length; i++) {
        const exNum = i + 1;
        if (!completedSet.has(`${lesson.id}:${exNum}`)) {
          nextLesson     = lesson;
          nextExerciseId = exNum;
          break;
        }
      }
      if (nextLesson) break;
    }

    if (!nextLesson) {
      const last     = curriculum[curriculum.length - 1];
      nextLesson     = last;
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

export default router;
