/**
 * CodLift Manual Verification Library - The "Universal Error Mapping" Engine
 * Covers: Beginner, Pro, Master tracks
 * Predicts Logical Errors, Syntax Pitfalls, and Concept Misunderstandings.
 */

const FULL_DOC = new Set(['html_1_1', 'dom_1_1', 'dom_1_2', 'events_1_1', 'events_1_2']);

// ─── CORE HELPERS (Syntax & Concept Checks) ──────────────────────────────────
function htmlGlobal(code, id) {
  const errs = [];
  if (!FULL_DOC.has(id)) {
    ['<html>', '</html>', '<body>', '</body>', '<head>', '</head>'].forEach(t => {
      if (code.toLowerCase().includes(t))
        errs.push(`Concept Misunderstanding: You included \`${t}\`. Only write the specific element requested. The browser environment handles the rest.`);
    });
  }
  const opens = (code.match(/</g) || []).length;
  const closes = (code.match(/>/g) || []).length;
  if (opens !== closes)
    errs.push(`Syntax Pitfall: Mismatched angle brackets. You have ${opens} \`<\` and ${closes} \`>\`. Every tag needs both to form a complete element.`);
  
  if (code.match(/<html[^>]*>/i) && !code.match(/<\/html>/i))
    errs.push('Syntax Pitfall: You opened an `<html>` tag but forgot to close it with `</html>`.');
    
  if (code.match(/<body[^>]*>/i) && !code.match(/<\/body>/i))
    errs.push('Syntax Pitfall: You opened a `<body>` tag but forgot to close it with `</body>`.');
  
  const badTag = code.match(/<[a-zA-Z][a-zA-Z0-9]*[^a-zA-Z0-9\s\/>'"=\-_.#:]/);
  if (badTag) errs.push(`Syntax Pitfall: Malformed tag \`${badTag[0]}\`. Ensure there are no stray symbols inside your tags.`);
  
  const numTag = code.match(/<[0-9]+>/);
  if (numTag) errs.push(`Syntax Pitfall: Invalid tag \`${numTag[0]}\`. HTML tags cannot begin with numbers.`);
  
  return errs;
}

function jsGlobal(code) {
  const errs = [];
  // Predict infinite loops
  if (code.match(/while\s*\(\s*true\s*\)/))
    errs.push(`Logical Error: \`while (true)\` detected. This creates an infinite loop and crashes the browser. Provide a breakout condition.`);
  
  // Syntax pitfalls
  if (code.match(/function\s+[a-zA-Z0-9_]+\s*\([^)]*\)\s*[^\{]/) && !code.includes('=>'))
    errs.push(`Syntax Pitfall: Missing \`{\` after function declaration. Functions require a block body.`);
  
  // Assignment vs Comparison
  if (code.match(/if\s*\(\s*[a-zA-Z0-9_]+\s*=[^=]/))
    errs.push(`Logical Error: Using \`=\` instead of \`===\` inside an \`if\` statement. \`=\` assigns a value, \`===\` compares values.`);
  
  // Concept Misunderstanding: Math on strings
  if (code.match(/["'][0-9]+["']\s*[-*\/]/))
    errs.push(`Concept Misunderstanding: Trying to perform arithmetic (-, *, /) on a string number (e.g. "5"). Use raw numbers instead.`);

  return errs;
}

// ─── VALIDATORS (Predictive Mappings) ─────────────────────────────────────────
const V = {

  // ── BEGINNER: HTML Basics ──
  html_1_1(code) {
    const e = [];
    if (!code.match(/<h1/i)) {
      if (code.match(/<H1/)) e.push('Syntax Pitfall: While HTML is case-insensitive, best practice requires lowercase tags like `<h1>`.');
      else e.push('Missing `<h1>` tag entirely. Start by wrapping your text in `<h1>` and `</h1>`.');
    }
    if (code.match(/<h1/) && !code.match(/<\/h1>/i)) e.push('Syntax Pitfall: Missing closing `</h1>` tag. Tags act like containers; close them!');
    if (!code.includes('Hello CodLift')) e.push('Logical Error: The text inside must be EXACTLY "Hello CodLift". Check for typos or capitalization mismatches.');
    return e;
  },

  html_1_2(code) {
    const e = [];
    if (code.match(/<P/)) e.push('Syntax Pitfall: Use lowercase `<p>` instead of `<P>`.');
    if (!code.match(/<p\s*>/i)) e.push('Missing `<p>` opening tag.');
    if (!code.match(/<\/p>/i))  e.push('Missing closing `</p>` tag.');
    if (!code.includes('Learning to code is fun!')) e.push('Logical Error: Paragraph text must exactly match "Learning to code is fun!" including punctuation.');
    return e;
  },

  html_1_3(code) {
    const e = [];
    if (!code.match(/<a\s/i)) return ['Concept Misunderstanding: Missing anchor tag `<a>`. Use it to create hyperlinks.'];
    if (!code.includes('href=')) e.push('Syntax Pitfall: Missing `href` attribute. How will the link know where to go?');
    if (code.includes('href="www.')) e.push('Logical Error: URLs in `href` must start with `https://`, not just `www.`');
    if (!code.includes('https://codlift.site')) e.push('The `href` destination must be exactly `https://codlift.site`.');
    if (!code.match(/<\/a>/i)) e.push('Syntax Pitfall: Missing closing `</a>` tag.');
    return e;
  },

  // ── BEGINNER: HTML Structure ──
  html_2_1(code) {
    const e = [];
    if (!code.match(/<header[\s>]/i)) e.push('Missing `<header>` element to contain the page title.');
    if (!code.match(/<main[\s>]/i))   e.push('Missing `<main>` element to contain the primary content.');
    if (code.match(/<header[\s>]/i) && !code.match(/<header[\s>][\s\S]*?<h1[\s>]/i))
      e.push('Concept Misunderstanding: The `<h1>` must be nested **inside** the `<header>`, not outside or parallel to it.');
    if (code.match(/<main[\s>]/i) && !code.match(/<main[\s>][\s\S]*?<p[\s>]/i))
      e.push('Concept Misunderstanding: The `<p>` must be nested **inside** the `<main>`.');
    return e;
  },

  // ── BEGINNER: CSS Styling ──
  css_1_1(code) {
    const e = [];
    if (!code.includes('h1 {') && !code.includes('h1{')) e.push('Syntax Pitfall: Missing the `h1` CSS selector followed by `{`.');
    if (!code.includes('color:')) e.push('Concept Misunderstanding: Use the `color:` property to change text color, not `background-color:` or `text-color:`.');
    if (!code.includes('cyan') && !code.includes('purple')) e.push('Logical Error: The assigned color value is incorrect based on the task requirements.');
    if (!code.match(/color\s*:\s*(cyan|purple)\s*;/i)) e.push('Syntax Pitfall: Missing a semicolon `;` at the end of the CSS property.');
    return e;
  },

  // ── BEGINNER: JS Fundamentals ──
  js_1_1(code) {
    const e = [];
    if (!code.includes('let ')) {
      if (code.includes('const ')) e.push('Logical Error: Use `let` instead of `const` if the variable might change later (even if it does not here, follow the prompt).');
      else e.push('Syntax Pitfall: You must declare the variable using the `let` keyword.');
    }
    if (!code.includes('=')) e.push('Syntax Pitfall: Missing the assignment operator `=`.');
    if (code.includes('let friend = Alex')) e.push('Concept Misunderstanding: `Alex` is being treated as a variable. Wrap it in quotes `"Alex"` to make it a string.');
    if (!code.match(/["']Alex["']/)) e.push('Logical Error: The value assigned must be EXACTLY the string `"Alex"`.');
    return e;
  },

  js_1_2(code) {
    const e = [];
    if (!code.match(/function\s+greetUser/)) e.push('Missing function declaration for `greetUser`.');
    if (!code.match(/\(\s*name\s*\)/)) e.push('Logical Error: The function must accept a parameter exactly named `name`.');
    if (!code.includes('return')) e.push('Concept Misunderstanding: The function must `return` the value, not just `console.log` it.');
    if (code.match(/return\s+["'`]Hello,\s*name!["'`]/)) e.push('Concept Misunderstanding: You hardcoded the word "name" instead of using the variable. Break the string or use template literals.');
    return e;
  },

  js_1_5(code) {
    const e = [];
    if (code.match(/for\s*\(\s*[a-zA-Z]+\s*=\s*1\s*;/)) e.push('Syntax Pitfall: Missing `let` in the for loop initialization (e.g., `let i = 1`).');
    if (code.match(/i\s*<\s*5/)) e.push('Logical Error: Off-by-one error! `i < 5` stops at 4. Use `i <= 5` to include 5.');
    if (!code.match(/i\+\+/)) e.push('Logical Error: Missing incrementer `i++`. This will cause an infinite loop.');
    if (!code.includes('console.log')) e.push('Missing `console.log` to print the iteration value.');
    return e;
  }
};

// ─── MAIN EXPORT ───────────────────────────────────────────────────────────────
const validateExercise = (id, code, language) => {
  let errors = [];

  // 1. Universal Checks
  if (language === 'html') {
    errors = [...errors, ...htmlGlobal(code, id)];
  } else if (language === 'javascript') {
    errors = [...errors, ...jsGlobal(code)];
  }

  // 2. Predictive Mapped Checks
  if (V[id]) {
    errors = [...errors, ...V[id](code)];
  }

  // Remove duplicates
  errors = [...new Set(errors)];

  if (errors.length > 0) {
    return {
      isCorrect: false,
      feedback: `### ❌ SYSTEM FAILURE DETECTED\n\nYour code did not pass the Validation Engine. Review the diagnostics below:\n\n${errors.map(e => `> **WARNING:** ${e}`).join('\n\n')}\n\n*Terminal Action:* Correct the highlighted anomalies and re-initiate sequence.`
    };
  }

  // If we have a specific validator and it passed, accept immediately
  if (V[id]) {
    return { isCorrect: true, feedback: '### ✅ DIAGNOSTICS CLEAN\n\nSyntax and structural integrity verified. Proceeding to execution.' };
  }

  // Fallback for AI verification
  return null;
};

module.exports = { validateExercise };
