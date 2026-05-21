import express, { Request, Response } from 'express';
import axios from 'axios';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import * as db from '../db';

const router = express.Router();

// GET /api/lessons/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM lessons WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ error: 'Server error fetching lesson' });
  }
});

// POST /api/lessons/:id/submit
router.post('/:id/submit', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userCode, language = 'javascript' } = req.body;

    const result = await db.query('SELECT * FROM lessons WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    const lesson = result.rows[0];

    let stdout = '';
    try {
      const pistonRes = await axios.post('https://emkc.org/api/v2/piston/execute', {
        language: language === 'javascript' ? 'javascript' : language,
        version:  language === 'javascript' ? '18.15.0' : '*',
        files:    [{ content: userCode }]
      });
      stdout = pistonRes.data.run?.stdout || pistonRes.data.run?.output || '';
    } catch (e) {
      stdout = userCode;
    }

    const expectedOutput = lesson.test_cases.expected_output.trim();
    const actualOutput   = stdout.trim();

    const isMatch =
      actualOutput.includes(expectedOutput) ||
      userCode.replace(/\s+/g, '').includes(expectedOutput.replace(/\s+/g, ''));

    if (isMatch) {
      const exerciseId = req.body.exerciseId || '1';

      await db.query(
        `INSERT INTO progress (user_id, lesson_id, exercise_id, is_completed)
         VALUES ($1, $2, $3, true)
         ON CONFLICT (user_id, lesson_id, exercise_id)
         DO UPDATE SET is_completed = true, completed_at = NOW()`,
        [req.user!.id, id, exerciseId]
      );

      res.json({ success: true });
    } else {
      res.json({ success: false, hint: "Output didn't match expected." });
    }
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({ error: 'Server error during submission' });
  }
});

export default router;
