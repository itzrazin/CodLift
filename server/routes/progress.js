const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const auth = require('../middleware/auth');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT lesson_id, exercise_id, is_completed FROM progress WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Server error fetching progress' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { lesson_id, exercise_id = '1', xp_earned = 10 } = req.body;
    await pool.query(
      'INSERT INTO progress (user_id, lesson_id, exercise_id, xp_earned, is_completed) VALUES ($1, $2, $3, $4, true) ON CONFLICT (user_id, lesson_id, exercise_id) DO UPDATE SET is_completed = true, completed_at = NOW()',
      [req.user.id, lesson_id, exercise_id, xp_earned]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ error: 'Server error saving progress' });
  }
});


module.exports = router;
