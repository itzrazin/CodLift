const express = require('express');
const router = express.Router();
const axios = require('axios');
const path = require('path');

// Piston API configuration
const PISTON_URL = (process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston').replace(/\/+$/, '');

// Helper to determine language for Piston
const getPistonLang = (ext) => {
  const map = {
    'js': 'javascript',
    'javascript': 'javascript',
    'py': 'python',
    'python': 'python',
    'html': 'html',
    'css': 'css'
  };
  return map[ext] || ext;
};

// Main execution endpoint
router.post('/', async (req, res) => {
  const { code, language, stdin = '' } = req.body;
  const lang = getPistonLang(language);

  // HTML/CSS don't run on Piston, they just return the code for preview
  if (lang === 'html' || lang === 'css') {
    return res.json({ run: { stdout: code, stderr: '', output: code } });
  }

  try {
    const response = await axios.post(`${PISTON_URL}/execute`, {
      language: lang,
      version: '*',
      files: [{ content: code }],
      stdin: stdin
    });

    res.json(response.data);
  } catch (err) {
    console.error('Piston error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Code execution failed' });
  }
});

// Automated Test Runner & Verification Gatekeeper
router.post('/verify', async (req, res) => {
  const { code, topic, instruction, task, language, test_cases } = req.body;
  
  // 1. Run the code first to get actual output (if not HTML/CSS)
  let actualOutput = '';
  let runError = '';
  const lang = getPistonLang(language);

  if (lang === 'html' || lang === 'css') {
    // For HTML/CSS, we don't "run" on server, we just analyze the code
    actualOutput = code; 
  } else {
    try {
      const runRes = await axios.post(`${PISTON_URL}/execute`, {
        language: lang,
        version: '*',
        files: [{ content: code }],
        stdin: test_cases?.stdin || ''
      });
      actualOutput = runRes.data.run.stdout || '';
      runError = runRes.data.run.stderr || '';
    } catch (err) {
      console.error('Execution failed for verification:', err.message);
      // Don't fail the whole request, AI might still verify logic
    }
  }

  // 2. Programmatic Verification (Simple exact matches or regex)
  if (test_cases?.expected_output && !test_cases.use_ai_only) {
    const trimmedCode = code.replace(/\s+/g, ' ').trim();
    const trimmedExpected = String(test_cases.expected_output).trim();
    
    // For very simple exact text matches, we can be quick.
    // But we avoid passing if the code looks like gibberish.
    const isExactMatch = trimmedCode === trimmedExpected || 
                         (language === 'html' && trimmedCode.includes(`>${trimmedExpected}<`));

    // If it's a simple match and doesn't look like gibberish (basic tag check)
    const looksLikeValidHTML = language !== 'html' || (code.includes('<') && code.includes('>'));

    if (isExactMatch && looksLikeValidHTML && !test_cases.force_ai) {
      return res.json({ 
        isCorrect: true, 
        feedback: "Perfect match! Your code is clean and correct. 🎯" 
      });
    }
  }

  // 3. AI Verification (The Pedantic Judge)
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === 'your_openrouter_key_here') {
    // Fallback: simple text match if no AI key
    const expected = test_cases?.expected_output || '';
    const success = code.toLowerCase().includes(String(expected).toLowerCase());
    return res.json({ 
      isCorrect: success, 
      feedback: success 
        ? "Verified via basic check. (AI is currently offline)" 
        : `Your code must contain: "${expected}"`
    });
  }

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        { 
          role: 'system', 
          content: `You are the CodLift Master Validator. Your goal is to be an EXTREMELY STRICT coding judge. 
          You verify every single line, tag, symbol, and detail.
          
          STRICT CRITERIA:
          1. SYNTAX: Reject any malformed tags (e.g., <h1Hello, <1>, </h1, missing brackets).
          2. STRUCTURE: Tags must be properly nested and balanced. Reject stray or misplaced tags (like </html> at the top).
          3. LOGIC: The code must fulfill the Specific Task exactly.
          4. COMPARISON: If a "solution" is provided in the Requirements, compare the student's code against it. It doesn't have to be a literal string match (whitespace is okay), but the structure and content must be equivalent.
          5. NO GIBBERISH: Even if the required string is present, if the surrounding code is nonsense or broken, it is WRONG.
          
          RESPONSE FORMAT:
          Return RAW JSON ONLY: {"isCorrect": true/false, "feedback": "Markdown-formatted report"}
          
          FEEDBACK GUIDELINES:
          - Start with "### ❌ Submission Rejected" or "### ✅ Submission Accepted".
          - If wrong, provide a PRECISE bulleted list of errors.
          - Mention exactly which tag or symbol is broken.
          - Be firm but professional. Use emojis. 🔍🛠️`
        },
        { 
          role: 'user', 
          content: `Exercise: ${topic}
Language: ${language}
Specific Task: ${task}
Instruction Context: ${instruction}
Requirements: ${JSON.stringify(test_cases)}

Student Submission:
\`\`\`${language}
${code}
\`\`\`

Actual Output from execution (if any): "${actualOutput}"

Perform a line-by-line verification. Is this code perfect?`
        }
      ],
      max_tokens: 800,
      temperature: 0,
      response_format: { type: 'json_object' }
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://codlift.site',
        'X-Title': 'CodLift'
      }
    });

    const content = response.data.choices[0].message.content.trim();
    
    try {
      const cleanContent = content.replace(/^```json\s*|```\s*$/g, '').trim();
      const parsed = JSON.parse(cleanContent);
      
      return res.json({
        isCorrect: !!parsed.isCorrect,
        feedback: parsed.feedback
      });
    } catch (parseErr) {
      console.error('AI JSON Parse Error:', content);
      throw new Error('Invalid AI response format');
    }
  } catch (err) {
    console.error('AI verification failed:', err.response?.data || err.message);
    const expected = test_cases?.expected_output || '';
    const isCorrect = expected ? code.toLowerCase().includes(String(expected).toLowerCase()) : true;
    res.json({ 
      isCorrect, 
      feedback: isCorrect ? "Verified (Fallback). Keep going! 🚀" : `Double check your syntax and ensure it includes: "${expected}"`
    });
  }
});

module.exports = router;
