/**
 * Verification Token Store
 *
 * Couples /execute/verify with /progress/update-progress.
 * A single-use token is issued when code is verified as correct.
 * Progress can only be recorded if that token is presented and consumed.
 *
 * This prevents:
 *  - Direct XP farming by calling progress API without solving the exercise
 *  - Bypassing verification entirely
 *  - Replaying old verification tokens
 */
import crypto from 'crypto';

interface VerificationRecord {
  userId:     string;
  exerciseId: string;
  lessonId:   string;
  expiresAt:  number;
}

const store = new Map<string, VerificationRecord>();
const TOKEN_TTL_MS = 120_000; // 2 minutes to complete the progress save after verify

/** Issue a one-time token after a successful verification. */
export const createVerificationToken = (
  userId:     string,
  exerciseId: string,
  lessonId:   string
): string => {
  const token = crypto.randomBytes(20).toString('hex');
  store.set(token, {
    userId,
    exerciseId,
    lessonId,
    expiresAt: Date.now() + TOKEN_TTL_MS,
  });

  // Lazy cleanup: purge expired entries whenever the store grows large
  if (store.size > 5_000) {
    const now = Date.now();
    for (const [k, v] of store) {
      if (v.expiresAt < now) store.delete(k);
    }
  }

  return token;
};

/**
 * Validate and consume a verification token.
 * Returns true only if:
 *  - The token exists
 *  - It belongs to the requesting user
 *  - It matches the lesson + exercise being recorded
 *  - It has not expired
 * Deletes the token on first use (single-use).
 */
export const consumeVerificationToken = (
  token:      string,
  userId:     string,
  lessonId:   string,
  exerciseId: string
): boolean => {
  const record = store.get(token);
  if (!record) return false;
  if (record.userId     !== userId)     { store.delete(token); return false; }
  if (record.lessonId   !== lessonId)   { store.delete(token); return false; }
  if (record.exerciseId !== exerciseId) { store.delete(token); return false; }
  if (Date.now() > record.expiresAt)    { store.delete(token); return false; }
  store.delete(token); // single-use
  return true;
};
