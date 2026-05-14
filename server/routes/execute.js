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
    if (manualResult && manualResult.isCorrect && !test_cases?.force_ai) {
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

  // ── Step 3: AI Semantic Verification ─────────────────────────────────────
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'your_openrouter_key_here') {
    // No AI key — fall back to expected_output string match
    const expected = test_cases?.expected_output || '';
    const success  = code.toLowerCase().includes(String(expected).toLowerCase());
    return res.json({
      isCorrect: success,
      feedback:  success
        ? '### ✅ Accepted\n\nYour code contains the required output. (AI validator offline)'
        : `### ❌ Rejected\n\nYour code must include: \`${expected}\``
    });
  }

  try {
    const aiRes = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: `You are the CodLift Master Validator — an EXTREMELY STRICT but fair coding judge.

EVALUATION CRITERIA:
1. SYNTAX: Reject malformed tags, unclosed brackets, invalid HTML.
2. STRUCTURE: Tags must be properly nested. No stray elements.
3. LOGIC: Code must exactly fulfill the Specific Task — no more, no less.
4. COMPARISON: Structurally match any provided solution (whitespace OK, content must match).
5. QUALITY: Even if the required output is present, broken surrounding code → WRONG.

RESPONSE FORMAT: Raw JSON ONLY — no markdown wrapper:
{"isCorrect": true/false, "feedback": "Markdown-formatted report"}

FEEDBACK FORMAT:
- Start with "### ✅ Submission Accepted" or "### ❌ Submission Rejected"
- If wrong: precise bulleted list of each specific error with the exact tag/line
- Tone: firm, professional, encouraging. Use emojis sparingly. 🔍 🛠️`
        },
        {
          role: 'user',
          content: `Exercise Topic: ${topic}
Language: ${language}
Specific Task: ${task}
Instruction Context: ${instruction}
Test Requirements: ${JSON.stringify(test_cases)}

Student Submission:
\`\`\`${language}
${code}
\`\`\`

Actual Execution Output: "${actualOutput}"

Perform a strict line-by-line verification. Is every requirement met?`
        }
      ],
      max_tokens:      800,
      temperature:     0,
      response_format: { type: 'json_object' }
    }, {
      timeout: 20000,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://codlift.site',
        'X-Title':      'CodLift'
      }
    });

    const raw     = aiRes.data.choices[0].message.content.trim();
    const clean   = raw.replace(/^```json\s*|```\s*$/g, '').trim();
    const parsed  = JSON.parse(clean);

    return res.json({
      isCorrect: !!parsed.isCorrect,
      feedback:  parsed.feedback
    });

  } catch (err) {
    console.error('AI verification failed:', err.response?.data || err.message);
    return res.json({
      isCorrect: false,
      feedback:  '### ⚠️ Verification Unavailable\n\nThe AI validator is temporarily busy. Please try again in 30 seconds. Your progress is safe.'
    });
  }
});

module.exports = router;
