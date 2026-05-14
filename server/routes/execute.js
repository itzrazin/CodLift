const express  = require('express');
const router   = express.Router();
const axios    = require('axios');
const auth     = require('../middleware/auth');
const { validateExercise } = require('../utils/manualValidators');

// ─── Piston API config ────────────────────────────────────────────────────────
const PISTON_URL = (process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston').replace(/\/+$/, '');

/** Map client language string to Piston language identifier. */
const getPistonLang = (ext) => {
  const map = {
    js:         'javascript',
    javascript: 'javascript',
    py:         'python',
    python:     'python',
    html:       'html',
    css:        'css'
  };
  return map[ext] || ext;
};

// ─── Simple in-memory rate limiter ────────────────────────────────────────────
// Prevents XP spam by limiting /verify calls to 1 per 3 seconds per user/IP.
const rateLimitMap = new Map();
const RATE_LIMIT_MS = 3000; // 3 second cooldown per user

function isRateLimited(key) {
  const last = rateLimitMap.get(key);
  if (!last) return false;
  const elapsed = Date.now() - last;
  return elapsed < RATE_LIMIT_MS;
}

function setRateLimit(key) {
  rateLimitMap.set(key, Date.now());
  // Clean up old entries every 10 minutes to prevent memory leak
  if (rateLimitMap.size > 5000) {
    const cutoff = Date.now() - 60_000;
    for (const [k, v] of rateLimitMap) {
      if (v < cutoff) rateLimitMap.delete(k);
    }
  }
}

// ─── POST /execute — Run code ─────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { code, language, stdin = '' } = req.body;
  const lang = getPistonLang(language);

  // HTML/CSS: return code directly for client-side preview rendering
  if (lang === 'html' || lang === 'css') {
    return res.json({ run: { stdout: code, stderr: '', output: code } });
  }

  try {
    const response = await axios.post(`${PISTON_URL}/execute`, {
      language: lang,
      version:  '*',
      files:    [{ content: code }],
      stdin
    });
    res.json(response.data);
  } catch (err) {
    console.error('Piston execute error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Code execution failed. Please try again.' });
  }
});

// ─── POST /execute/verify — Validate submission & gate XP ────────────────────
// Requires authentication so XP can be attributed to the correct user.
router.post('/verify', auth, async (req, res) => {
  const { id, code, topic, instruction, task, language, test_cases, start_time } = req.body;

  // ── Rate limiting: prevent submission spam ─────────────────────────────────
  const rateLimitKey = `verify_${req.user.id}`;
  if (isRateLimited(rateLimitKey)) {
    return res.status(429).json({
      isCorrect: false,
      feedback:  '### ⏳ Slow Down!\n\nYou\'re submitting too fast. Wait a moment before trying again.'
    });
  }
  setRateLimit(rateLimitKey);

  // ── Step 1: Deterministic Manual Validation ───────────────────────────────
  // Runs for all exercises that have a registered validator. Fast, free, exact.
  if (id || language) {
    const manualResult = validateExercise(id, code, language);

    if (manualResult && !manualResult.isCorrect) {
      // Deterministically wrong — return immediately, no AI call needed
      return res.json(manualResult);
    }

    if (manualResult && manualResult.isCorrect && !test_cases?.force_ai) {
      // Deterministically correct — accept without AI call
      return res.json(manualResult);
    }
    // No manual validator for this exercise → fall through to AI
  }

  // ── Step 2: Run code to get actual output (for non-HTML/CSS) ─────────────
  let actualOutput = '';
  const lang = getPistonLang(language);

  if (lang === 'html' || lang === 'css') {
    actualOutput = code;
  } else {
    try {
      const runRes = await axios.post(`${PISTON_URL}/execute`, {
        language: lang,
        version:  '*',
        files:    [{ content: code }],
        stdin:    test_cases?.stdin || ''
      });
      actualOutput = runRes.data.run.stdout || '';

      // If there's a runtime error, fail fast
      const stderr = runRes.data.run.stderr || '';
      if (stderr && !actualOutput) {
        return res.json({
          isCorrect: false,
          feedback:  `### ❌ Runtime Error\n\nYour code crashed:\n\`\`\`\n${stderr.slice(0, 400)}\n\`\`\``
        });
      }
    } catch (err) {
      console.error('Piston execution failed during verify:', err.message);
      // Continue to AI — it can still verify logic from code analysis
    }
  }

  // ── Step 3: AI Semantic Verification (Fallback for exercises without validators) ─
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'your_openrouter_key_here') {
    // Fallback when no AI key: basic text match
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
          content: `You are the CodLift Master Validator — an EXTREMELY STRICT coding judge.

STRICT CRITERIA:
1. SYNTAX: Reject malformed tags (e.g., <h1Hello, <1>, </h1, missing brackets).
2. STRUCTURE: Tags must be properly nested and balanced.
3. LOGIC: The code must exactly fulfill the Specific Task.
4. COMPARISON: If a "solution" is in the Requirements, compare structurally (whitespace is OK, content must match).
5. NO GIBBERISH: Even if the required string is present, surrounding broken code → WRONG.

RESPONSE FORMAT: Return RAW JSON ONLY:
{"isCorrect": true/false, "feedback": "Markdown-formatted report"}

FEEDBACK GUIDELINES:
- Start with "### ❌ Submission Rejected" or "### ✅ Submission Accepted".
- If wrong: precise bulleted list of errors. Mention exact tags/symbols. Be firm but professional. Use emojis 🔍🛠️`
        },
        {
          role: 'user',
          content: `Exercise: ${topic}
Language: ${language}
Specific Task: ${task}
Instruction: ${instruction}
Requirements: ${JSON.stringify(test_cases)}

Student Submission:
\`\`\`${language}
${code}
\`\`\`

Actual Output from execution: "${actualOutput}"

Perform a line-by-line verification. Is this code correct?`
        }
      ],
      max_tokens:      800,
      temperature:     0,
      response_format: { type: 'json_object' }
    }, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://codlift.site',
        'X-Title':      'CodLift'
      }
    });

    const content      = aiRes.data.choices[0].message.content.trim();
    const cleanContent = content.replace(/^```json\s*|```\s*$/g, '').trim();
    const parsed       = JSON.parse(cleanContent);

    return res.json({
      isCorrect: !!parsed.isCorrect,
      feedback:  parsed.feedback
    });
  } catch (err) {
    console.error('AI verification failed:', err.response?.data || err.message);
    res.json({
      isCorrect: false,
      feedback:  '### ⚠️ Verification Unavailable\n\nThe AI validator is busy. Please try again in 30 seconds.'
    });
  }
});

module.exports = router;
