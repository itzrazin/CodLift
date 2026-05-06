const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const auth = require('../middleware/auth');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT lesson_id FROM progress WHERE user_id = $1', [req.user.id]);
    const completedLessonIds = result.rows.map(row => row.lesson_id);
    res.json(completedLessonIds);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Server error fetching progress' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { lesson_id } = req.body;
    await pool.query(
      'INSERT INTO progress (user_id, lesson_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, lesson_id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ error: 'Server error saving progress' });
  }
});

module.exports = router;
