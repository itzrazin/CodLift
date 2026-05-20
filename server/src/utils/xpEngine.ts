import levels from '../data/levels.json';
import curriculum from '../data/curriculum';

export interface Rank {
  rank: number;
  title: string;
  xp_required: number;
  badge: string;
}

export function getRankForXP(totalXP: number): Rank {
  const sorted = [...levels.ranks].sort((a, b) => b.xp_required - a.xp_required);
  return (sorted.find(r => totalXP >= r.xp_required) || levels.ranks[0]) as Rank;
}

export function getNextRank(totalXP: number): Rank | null {
  const sorted = [...levels.ranks].sort((a, b) => a.xp_required - b.xp_required);
  return (sorted.find(r => r.xp_required > totalXP) || null) as Rank | null;
}

export function getDifficultyForExercise(exerciseId: string, lessonId: string): string {
  const lesson = curriculum.find(l =>
    l.id === lessonId || l.exercises.some(e => e.id === exerciseId)
  );
  if (!lesson) {
    if (lessonId === 'fix-the-counter' || exerciseId === 'fix-the-counter') return 'beginner';
    if (lessonId === 'array-compressor' || exerciseId === 'array-compressor') return 'pro';
    if (lessonId === 'auth-logic-101' || exerciseId === 'auth-logic-101') return 'master';
    if (lessonId === 'algorithm-duel' || exerciseId === 'algorithm-duel') return 'master';
    return 'beginner';
  }
  return lesson.level || 'beginner';
}

interface CalculateXPOpts {
  exerciseId: string;
  lessonId: string;
  solveTimeMs?: number | null;
  streakDays?: number;
}

export function calculateXP({ exerciseId, lessonId, solveTimeMs = null, streakDays = 0 }: CalculateXPOpts) {
  const baseXP = levels.base_xp.default;

  // 1. Difficulty multiplier
  const difficulty = getDifficultyForExercise(exerciseId, lessonId);
  const diffMult = (levels.difficulty_multipliers as Record<string, number>)[difficulty] || 1.0;

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
