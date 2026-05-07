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

// AI Verification Gatekeeper
router.post('/verify', async (req, res) => {
  const { code, topic, instruction, language, test_cases } = req.body;
  
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === 'your_openrouter_key_here') {
    // Fallback: simple text match if no AI key
    const expected = test_cases?.expected_output || '';
    const success = code.toLowerCase().includes(expected.toLowerCase());
    return res.json({ 
      success, 
      feedback: success ? "Excellent! Your code correctly solves the challenge! 🎉" : `Almost there! Make sure your code includes: "${expected}"`
    });
  }

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'google/gemini-2.0-flash-001', // High-performance Gemini model
      messages: [
        { 
          role: 'system', 
          content: `You are the CodLift AI Gatekeeper. Your goal is to strictly verify student code submissions while being flexible about style.
          
          Guidelines:
          1. Return RAW JSON ONLY: {"isCorrect": true/false, "feedback": "Brief pedagogical feedback"}
          2. isCorrect: true if the code fulfills the logic. Ignore extra whitespace, newlines, or case sensitivity unless critical to the task.
          3. feedback: If isCorrect is false, explain what's missing without giving the final code.`
        },
        { 
          role: 'user', 
          content: `Topic: ${topic}
          Language: ${language}
          Instruction: ${instruction}
          Task Requirements: ${JSON.stringify(test_cases)}
          
          Student Code to Verify:
          \`\`\`${language}
          ${code}
          \`\`\`
          
          Analyze the code. Is it correct?`
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
    
    // Robust JSON Extraction: Strip markdown backticks if present
    const cleanContent = content.replace(/^```json\s*|```\s*$/g, '').trim();
    
    try {
      const parsed = JSON.parse(cleanContent);
      const isCorrect = !!(parsed.isCorrect ?? parsed.success);
      return res.json({
        isCorrect,
        feedback: parsed.feedback || (isCorrect ? "Great job!" : "Not quite right.")
      });
    } catch (parseErr) {
      console.error('AI JSON Parse Error:', parseErr.message, 'Content:', content);
      throw new Error('Invalid JSON format');
    }
    
  } catch (err) {
    console.error('AI Verify Error:', err.message);
    
    // Fallback Logic: Simple Regex/Keyphrase check if AI fails
    const expected = test_cases?.expected_output || '';
    const codeClean = code.toLowerCase().replace(/\s+/g, '');
    const expectedClean = expected.toLowerCase().replace(/\s+/g, '');
    
    const isCorrect = expected ? codeClean.includes(expectedClean) : true;
    
    res.json({ 
      isCorrect, 
      feedback: isCorrect 
        ? "Code verified! Keep up the momentum! 🚀 (Verified via fallback)" 
        : `Almost there! Your code doesn't seem to include the required part: "${expected}"`
    });
  }
});

module.exports = router;
