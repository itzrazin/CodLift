const express = require('express');
const router = express.Router();
const axios = require('axios');

const PISTON_URL = (process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston').replace(/\/+$/, '');

// Language version mapping
const LANGUAGE_MAP = {
  'javascript': { language: 'javascript', version: '18.15.0' },
  'js': { language: 'javascript', version: '18.15.0' },
  'python': { language: 'python', version: '3.10.0' },
  'python3': { language: 'python', version: '3.10.0' },
  'html': { language: 'javascript', version: '18.15.0' }, // HTML renders client-side
  'css': { language: 'javascript', version: '18.15.0' },  // CSS renders client-side
};

router.post('/', async (req, res) => {
  const { language, code } = req.body;
  
  if (!code || code.trim().length === 0) {
    return res.json({ 
      run: { stdout: '', stderr: 'No code provided', code: 1, output: 'No code provided' }
    });
  }

  // For HTML/CSS, we don't execute server-side
  const lang = (language || 'javascript').toLowerCase();
  if (lang === 'html' || lang === 'css') {
    return res.json({
      run: { stdout: 'HTML/CSS renders in preview panel', stderr: '', code: 0, output: 'HTML/CSS renders in preview panel' },
      language: lang,
      renderInPreview: true
    });
  }

  const langConfig = LANGUAGE_MAP[lang] || { language: lang, version: '*' };

  try {
    const response = await axios.post(`${PISTON_URL}/execute`, {
      language: langConfig.language,
      version: langConfig.version,
      files: [{ content: code }]
    }, {
      timeout: 15000 // 15 second timeout
    });

    const data = response.data;
    res.json({
      ...data,
      run: {
        ...data.run,
        output: data.run?.stdout || data.run?.stderr || data.run?.output || ''
      }
    });
  } catch (err) {
    console.error('Code execution error:', err.message);
    if (err.code === 'ECONNABORTED') {
      return res.status(408).json({ message: 'Code execution timed out. Your code might have an infinite loop! 🔄' });
    }
    res.status(500).json({ message: 'Code execution service is temporarily unavailable. Try again in a moment! ⚡' });
  }
});

// Automated Test Runner & Verification Gatekeeper
router.post('/verify', async (req, res) => {
  const { code, topic, instruction, language, test_cases } = req.body;
  
  // 1. Run the code first to get actual output (if not HTML/CSS)
  let actualOutput = '';
  let runError = '';
  
  const lang = (language || 'javascript').toLowerCase();
  if (lang !== 'html' && lang !== 'css') {
    try {
      const langConfig = LANGUAGE_MAP[lang] || { language: lang, version: '*' };
      
      // If we're testing a function return, we might need to append a console.log
      let codeToRun = code;
      if (test_cases?.function_name && !code.includes(`console.log(${test_cases.function_name}`)) {
        // Simple heuristic: if we expect a function return, call it and log it
        const args = test_cases.test_args || '';
        codeToRun += `\nconsole.log(${test_cases.function_name}(${args}));`;
      }

      const response = await axios.post(`${PISTON_URL}/execute`, {
        language: langConfig.language,
        version: langConfig.version,
        files: [{ content: codeToRun }]
      }, { timeout: 10000 });
      
      actualOutput = (response.data.run?.stdout || '').trim();
      runError = (response.data.run?.stderr || '').trim();
    } catch (err) {
      console.error('Execution during verify failed:', err.message);
    }
  }

  // 2. Direct Test Case Validation (The "Test Runner")
  if (test_cases?.expected_output) {
    const expected = test_cases.expected_output.toString().trim();
    
    // Check if actual output matches expected output (strict or partial)
    if (actualOutput === expected || actualOutput.includes(expected)) {
      return res.json({
        isCorrect: true,
        feedback: `Excellent! The code produced the expected output: "${expected}". 🎉`
      });
    }
    
    // If we have an error, and it's not HTML, maybe return that
    if (runError && lang !== 'html') {
      return res.json({
        isCorrect: false,
        feedback: `Execution Error: ${runError.split('\n')[0]}. Try fixing your syntax!`
      });
    }
  }

  // 3. AI Verification (For conceptual tasks or where output match is tricky)
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === 'your_openrouter_key_here') {
    // Fallback: simple text match if no AI key and direct match failed
    const expected = test_cases?.expected_output || '';
    const success = code.toLowerCase().includes(expected.toLowerCase());
    return res.json({ 
      isCorrect: success, 
      feedback: success 
        ? "Great job! Your code seems to contain the correct logic. 🎉" 
        : `Almost there! Make sure your code addresses: "${expected}"`
    });
  }

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'google/gemini-2.0-flash-lite-preview-02-05:free',
      messages: [
        { 
          role: 'system', 
          content: `You are the CodLift AI Gatekeeper. Your goal is to strictly verify student code submissions.
          
          Context:
          - Language: ${language}
          - Topic: ${topic}
          - Instruction: ${instruction}
          - Expected Output/Key: ${JSON.stringify(test_cases)}
          - Actual Output from Execution: "${actualOutput}"
          
          Guidelines:
          1. Return RAW JSON ONLY: {"isCorrect": true/false, "feedback": "Brief pedagogical feedback"}
          2. isCorrect: true if the code fulfills the logic, even if output slightly differs (unless output is the point).
          3. feedback: If false, explain what's missing or why the output was wrong.`
        },
        { 
          role: 'user', 
          content: `Student Code:
          \`\`\`${language}
          ${code}
          \`\`\`
          
          Actual Output: ${actualOutput}
          
          Is this correct?`
        }
      ],
      max_tokens: 300,
      temperature: 0.1
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://codlift.site',
        'X-Title': 'CodLift'
      }
    });

    const content = response.data.choices[0].message.content.trim();
    const cleanContent = content.replace(/^```json\s*|```\s*$/g, '').trim();
    
    try {
      const parsed = JSON.parse(cleanContent);
      return res.json({
        isCorrect: !!(parsed.isCorrect ?? parsed.success),
        feedback: parsed.feedback || "Verified!"
      });
    } catch (parseErr) {
      throw new Error('Invalid AI response');
    }
  } catch (err) {
    // Final Fallback
    const expected = test_cases?.expected_output || '';
    const isCorrect = expected ? code.includes(expected) : true;
    res.json({ 
      isCorrect, 
      feedback: isCorrect ? "Verified via fallback!" : `Check your code for: "${expected}"`
    });
  }
});

module.exports = router;
