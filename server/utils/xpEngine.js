/**
 * CodLift XP Engine
 * Single source of truth for XP calculation.
 *
 * Formula: XP = floor((BaseXP × DifficultyMultiplier × StreakMultiplier) + SpeedBonus)
 */

const levels = require('../data/levels.json');
const curriculum = require('../data/curriculum');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Return rank object for a given total XP. */
function getRankForXP(totalXP) {
  const sorted = [...levels.ranks].sort((a, b) => b.xp_required - a.xp_required);
  return sorted.find(r => totalXP >= r.xp_required) || levels.ranks[0];
}

/** Return next rank (or null if already at max). */
function getNextRank(totalXP) {
  const sorted = [...levels.ranks].sort((a, b) => a.xp_required - b.xp_required);
  return sorted.find(r => r.xp_required > totalXP) || null;
}

/** Resolve the lesson-level difficulty for a given exercise id. */
function getDifficultyForExercise(exerciseId, lessonId) {
  const lesson = curriculum.find(l =>
    l.id === lessonId || l.exercises.some(e => e.id === exerciseId)
  );
  if (!lesson) return 'beginner';
  return lesson.level || 'beginner';
}

// ─── Main Calculator ───────────────────────────────────────────────────────────

/**
 * Calculate XP earned for a correct submission.
 *
 * @param {object} opts
 * @param {string} opts.exerciseId  - exercise slug (e.g. "html_1_1")
 * @param {string} opts.lessonId    - lesson slug  (e.g. "html-basics")
 * @param {number} opts.solveTimeMs - milliseconds taken to solve (optional)
 * @param {number} opts.streakDays  - user's current streak in days
 * @returns {{ xp: number, breakdown: object }}
 */
function calculateXP({ exerciseId, lessonId, solveTimeMs = null, streakDays = 0 }) {
  const baseXP = levels.base_xp.default;

  // 1. Difficulty multiplier
  const difficulty = getDifficultyForExercise(exerciseId, lessonId);
  const diffMult = levels.difficulty_multipliers[difficulty] || 1.0;

  // 2. Streak multiplier
  let streakMult = 1.0;
  const sm = levels.streak_multiplier;
  if (streakDays >= 30)      streakMult = sm['30_days'];
  else if (streakDays >= 14) streakMult = sm['14_days'];
  else if (streakDays >= 7)  streakMult = sm['7_days'];
  else if (streakDays >= 3)  streakMult = sm['3_days'];

  // 3. Speed bonus
  let speedBonus = 0;
  if (solveTimeMs !== null) {
    const secs = solveTimeMs / 1000;
    const sb = levels.speed_bonus;
    if (secs < 30)       speedBonus = sb['under_30s'];
    else if (secs < 60)  speedBonus = sb['under_60s'];
    else if (secs < 120) speedBonus = sb['under_120s'];
  }

  const xp = Math.floor((baseXP * diffMult * streakMult) + speedBonus);

  return {
    xp,
    breakdown: {
      baseXP,
      difficulty,
      difficultyMultiplier: diffMult,
      streakDays,
      streakMultiplier: streakMult,
      solveTimeMs,
      speedBonus
    }
  };
}

module.exports = { calculateXP, getRankForXP, getNextRank };
