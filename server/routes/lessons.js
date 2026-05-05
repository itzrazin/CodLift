const express = require('express');
const router = express.Router();
const curriculum = require('../data/curriculum');
const { authenticateToken } = require('../middleware/auth');

// Get all levels with lesson summaries
router.get('/', (req, res) => {
  const levels = {};
  
  for (const lesson of curriculum) {
    if (!levels[lesson.level]) {
      levels[lesson.level] = [];
    }
    levels[lesson.level].push({
      id: lesson.id,
      title: lesson.title,
      level: lesson.level,
      language: lesson.language,
      exerciseCount: lesson.exercises.length,
      description: lesson.description
    });
  }
  
  res.json({ levels, lessons: curriculum.map(l => ({
    id: l.id,
    title: l.title,
    level: l.level,
    language: l.language,
    exerciseCount: l.exercises.length,
    description: l.description
  }))});
});

// Get specific lesson with all exercises
router.get('/:id', (req, res) => {
  const lesson = curriculum.find(l => l.id === req.params.id);
  if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
  res.json(lesson);
});

// Get specific exercise within a lesson
router.get('/:lessonId/exercise/:exerciseId', (req, res) => {
  const lesson = curriculum.find(l => l.id === req.params.lessonId);
  if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
  
  const exerciseIndex = parseInt(req.params.exerciseId) - 1;
  if (exerciseIndex < 0 || exerciseIndex >= lesson.exercises.length) {
    return res.status(404).json({ message: 'Exercise not found' });
  }
  
  const exercise = lesson.exercises[exerciseIndex];
  
  res.json({
    lesson: {
      id: lesson.id,
      title: lesson.title,
      level: lesson.level,
      language: lesson.language,
      totalExercises: lesson.exercises.length
    },
    exercise: {
      ...exercise,
      number: exerciseIndex + 1,
      total: lesson.exercises.length
    }
  });
});

module.exports = router;
