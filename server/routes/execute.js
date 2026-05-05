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

module.exports = router;
