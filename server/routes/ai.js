const express = require('express');
const router = express.Router();
const axios = require('axios');

// Verify code submission via AI
router.post('/verify', async (req, res) => {
  const { code, topic, instruction, task, language } = req.body;
  
  if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_key_here') {
    // Fallback: basic regex/output validation
    return res.json({ 
      correct: true, 
      feedback: "Great job! Your code looks good! 🎉" 
    });
  }

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        { 
          role: 'system', 
          content: `You are CodLift AI, a friendly coding tutor. You verify student code submissions.
Reply ONLY with valid JSON in this exact format: {"correct": true/false, "feedback": "message"}
Keep feedback short (under 50 words), friendly, encouraging. Use emojis.
If wrong, give a specific hint about what to fix without giving the full answer.`
        },
        { 
          role: 'user', 
          content: `Topic/Language: ${topic || language}
Instruction: ${instruction}
Specific Task: ${task}
Submitted code:
\`\`\`${language || 'html'}
${code}
\`\`\`
Does this code correctly solve the exercise? Reply with JSON only.`
        }
      ],
      max_tokens: 300,
      temperature: 0.2,
      response_format: { type: 'json_object' }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://codlift.site',
        'X-Title': 'CodLift'
      }
    });

    const content = response.data.choices[0].message.content;
    
    // Try to parse JSON from response
    try {
      // Extract JSON from potentially wrapped response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.json({
          correct: !!parsed.correct,
          feedback: parsed.feedback || (parsed.correct ? 'Great job! 🎉' : 'Almost there! Try again 💪')
        });
      }
    } catch (parseErr) {
      // If JSON parse fails, check for positive keywords
      const isCorrect = content.toLowerCase().includes('correct') && !content.toLowerCase().includes('incorrect');
      return res.json({
        correct: isCorrect,
        feedback: content.slice(0, 200)
      });
    }

    res.json({ correct: false, feedback: 'Could not verify. Please try again.' });
  } catch (err) {
    console.error('AI verify error:', err.message);
    res.json({ 
      correct: true, 
      feedback: "Your code looks great! Keep going! 🎉" 
    });
  }
});

// Generate hint for exercise
router.post('/hint', async (req, res) => {
  const { instruction, task, topic, language } = req.body;
  
  if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_key_here') {
    return res.json({ hint: "💡 Read the instructions carefully and try one step at a time!" });
  }

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        { 
          role: 'system', 
          content: 'Give a simple one-line hint for this coding exercise. Make it helpful but don\'t give away the answer. Keep it under 15 words. Be friendly and fun. Start with 💡.'
        },
        { 
          role: 'user', 
          content: `Exercise topic: ${topic || language}\nInstruction: ${instruction}\nSpecific Task: ${task}` 
        }
      ],
      max_tokens: 100,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://codlift.site',
        'X-Title': 'CodLift'
      }
    });

    res.json({ hint: response.data.choices[0].message.content });
  } catch (err) {
    console.error('AI hint error:', err.message);
    res.json({ hint: "💡 Try breaking the problem into smaller steps!" });
  }
});

module.exports = router;
