const express  = require('express');
const router   = express.Router();
const axios    = require('axios');
const crypto   = require('crypto');
const auth     = require('../middleware/auth');
const { validateExercise } = require('../utils/manualValidators');

// ─── Piston API config ────────────────────────────────────────────────────────
const PISTON_URL     = (process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston').replace(/\/+$/, '');
const PISTON_TIMEOUT = 8000; // 8 s — prevents infinite loop submissions from hanging server

/** Map client language string to Piston language identifier. */
const getPistonLang = (ext) => {
  const map = {
    js: 'javascript', javascript: 'javascript',
    py: 'python',     python: 'python',
    html: 'html',     css: 'css'
  };
  return map[ext] || ext;
};

// ─── Anti-Cheat & Rate Limit Store ────────────────────────────────────────────
// Per user+exercise: stores { lastHash, lastSubmitMs }
// Prevents: (1) rapid-fire spam, (2) resubmitting the exact same code.
const submissionStore = new Map();
const RATE_LIMIT_MS   = 3000;  // 3 s between any two submissions
const DEDUP_WINDOW_MS = 60000; // 60 s window for duplicate-code detection

/** SHA-256 fingerprint of submitted code (normalised whitespace). */
function codeHash(code) {
  const normalised = code.replace(/\s+/g, ' ').trim();
  return crypto.createHash('sha256').update(normalised).digest('hex');
}

function getStoreKey(userId, exerciseId) {
  return `${userId}::${exerciseId}`;
}

/** Returns { blocked, reason } */
function checkAntiCheat(userId, exerciseId, code) {
  const key    = getStoreKey(userId, exerciseId);
  const record = submissionStore.get(key);
  const now    = Date.now();

  if (record) {
    // 1. Rate limit — too fast
    if (now - record.lastSubmitMs < RATE_LIMIT_MS) {
      return { blocked: true, reason: 'rate_limit' };
    }
    // 2. Duplicate code within dedup window
    if (now - record.lastSubmitMs < DEDUP_WINDOW_MS && codeHash(code) === record.lastHash) {
      return { blocked: true, reason: 'duplicate' };
    }
  }
  return { blocked: false };
}

function recordSubmission(userId, exerciseId, code) {
  const key = getStoreKey(userId, exerciseId);
  submissionStore.set(key, { lastHash: codeHash(code), lastSubmitMs: Date.now() });

  // Housekeeping: evict entries older than 10 min to prevent memory growth
  if (submissionStore.size > 10_000) {
    const cutoff = Date.now() - 600_000;
    for (const [k, v] of submissionStore) {
      if (v.lastSubmitMs < cutoff) submissionStore.delete(k);
    }
  }
}

// ─── POST /execute — Run code ─────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { code, language, stdin = '' } = req.body;
  const lang = getPistonLang(language);

  if (lang === 'html' || lang === 'css') {
    return res.json({ run: { stdout: code, stderr: '', output: code } });
  }

  try {
    const response = await axios.post(`${PISTON_URL}/execute`, {
      language: lang,
      version:  '*',
      files:    [{ content: code }],
      stdin
    }, { timeout: PISTON_TIMEOUT });

    res.json(response.data);
  } catch (err) {
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      return res.status(408).json({
        error: '⏱️ Execution timed out. Check for infinite loops in your code.'
      });
    }
    console.error('Piston execute error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Code execution failed. Please try again.' });
  }
});

// ─── POST /execute/verify — Validate & gate XP ───────────────────────────────
// Requires auth. Runs anti-cheat, then deterministic validator, then AI fallback.
router.post('/verify', auth, async (req, res) => {
  const { id, code, topic, instruction, task, language, test_cases, start_time } = req.body;

  if (!code || typeof code !== 'string' || code.trim().length === 0) {
    return res.status(400).json({
      isCorrect: false,
      feedback:  '### ❌ Empty Submission\n\nYour code editor is empty. Write some code and try again!'
    });
  }

  // ── Anti-cheat check ─────────────────────────────────────────────────────
  const { blocked, reason } = checkAntiCheat(req.user.id, id || language, code);

  if (blocked) {
    const feedbackMap = {
      rate_limit: '### ⏳ Slow Down!\n\nYou\'re submitting too fast. Wait a moment and try again.',
      duplicate:  '### 🔄 Duplicate Submission Detected\n\nYour code is identical to your last attempt. Make a change and try again. Copying the same solution repeatedly won\'t earn you XP.'
    };
    return res.status(429).json({
      isCorrect: false,
      feedback:  feedbackMap[reason] || '### ⚠️ Submission Blocked'
    });
  }

  // Record this submission BEFORE validation (prevents spamming on fast responses)
  recordSubmission(req.user.id, id || language, code);

  // ── Step 1: Deterministic Manual Validation ───────────────────────────────
  if (id || language) {
    const manualResult = validateExercise(id, code, language);

    if (manualResult && !manualResult.isCorrect) {
      return res.json(manualResult); // Fast-fail — wrong
    }
    if (manualResult && manualResult.isCorrect) {
      return res.json(manualResult); // Fast-accept — correct
    }
  }

  // ── Step 2: Run code through Piston to get actual output ──────────────────
  let actualOutput = '';
  const lang = getPistonLang(language);

  if (lang !== 'html' && lang !== 'css') {
    try {
      const runRes = await axios.post(`${PISTON_URL}/execute`, {
        language: lang,
        version:  '*',
        files:    [{ content: code }],
        stdin:    test_cases?.stdin || ''
      }, { timeout: PISTON_TIMEOUT });

      actualOutput    = runRes.data.run.stdout || '';
      const stderr    = runRes.data.run.stderr || '';

      // If code crashed with no output, report the runtime error immediately
      if (stderr && !actualOutput) {
        return res.json({
          isCorrect: false,
          feedback:  `### ❌ Runtime Error\n\nYour code crashed:\n\`\`\`\n${stderr.slice(0, 500)}\n\`\`\``
        });
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        return res.json({
          isCorrect: false,
          feedback:  '### ⏱️ Execution Timeout\n\nYour code took too long to run. Check for infinite loops.'
        });
      }
      // Piston down — continue to AI for static analysis
    }
  } else {
    actualOutput = code;
  }

  // ── Step 3: Deterministic Fallback Verification (AI Removed) ─────────────
  const expected = test_cases?.expected_output || '';
  const solutionText = test_cases?.solution || '';
  
  let isCorrect = false;
  
  if (expected) {
    isCorrect = code.toLowerCase().includes(String(expected).toLowerCase()) || actualOutput.toLowerCase().includes(String(expected).toLowerCase());
  } else if (solutionText) {
    // Normalise whitespace to compare structures
    const normCode = code.replace(/\s+/g, '').toLowerCase();
    const normSol = solutionText.replace(/\s+/g, '').toLowerCase();
    isCorrect = normCode.includes(normSol);
  } else {
    isCorrect = true; // Fallback to true if no tests specified
  }
  
  return res.json({
    isCorrect,
    feedback: isCorrect
      ? '### ✅ Accepted\n\nYour code successfully fulfills the requirements.'
      : `### ❌ Rejected\n\nYour code must include the required output: \`${expected}\``
  });
});

module.exports = router;
