/**
 * CodLift Manual Verification Library
 * Deterministic validation logic for each exercise to ensure 100% accuracy.
 * Each lesson-specific validator returns an array of error strings (empty = pass).
 */

// IDs of lessons where the student writes a FULL HTML document (html, body, head tags are expected)
const FULL_DOCUMENT_LESSONS = new Set(['html_1_1']);

const validators = {

  // ─────────────────────────────────────────────────────────
  // GLOBAL HELPERS (run for all HTML lessons not in FULL_DOCUMENT_LESSONS)
  // ─────────────────────────────────────────────────────────
  _globalHTMLCheck: (code, id) => {
    const errors = [];

    // Skip boilerplate checks for full-document lessons
    if (!FULL_DOCUMENT_LESSONS.has(id)) {
      const boilerplateTags = ['<html>', '</html>', '<body>', '</body>', '<head>', '</head>'];
      boilerplateTags.forEach(tag => {
        if (code.toLowerCase().includes(tag)) {
          errors.push(`❌ Remove the \`${tag}\` tag — you only need to write the specific element the task asks for.`);
        }
      });
    }

    // Mismatched angle brackets (< vs >)
    const openCount = (code.match(/</g) || []).length;
    const closeCount = (code.match(/>/g) || []).length;
    if (openCount !== closeCount) {
      errors.push(`❌ Mismatched brackets: you have ${openCount} opening \`<\` but ${closeCount} closing \`>\`. Every tag needs both.`);
    }

    // Detect clearly malformed tags like <h1Hello or <1>
    // A valid tag: < then letters/digits, then either whitespace, / or >
    const malformedTags = code.match(/<[a-zA-Z0-9]+[^a-zA-Z0-9\s\/>'"=\-_\.#]/g);
    if (malformedTags) {
      errors.push(`❌ Malformed tag found: \`${malformedTags[0]}\`. Tags must look like \`<h1>\` or \`<h1 class="...">\`.`);
    }

    // Detect numeric-only or totally invalid tags like <1>
    const invalidTags = code.match(/<[0-9]+>/g);
    if (invalidTags) {
      errors.push(`❌ Invalid tag: \`${invalidTags[0]}\` — HTML tag names cannot be numbers.`);
    }

    return errors;
  },

  // ─────────────────────────────────────────────────────────
  // HTML BASICS
  // ─────────────────────────────────────────────────────────

  /**
   * html_1_1: "The Skeleton of the Web"
   * Task: Change the h1 text to exactly "Hello CodLift"
   * Initial code includes <html><body>...</body></html> wrapper
   */
  html_1_1: (code) => {
    const errors = [];

    // Must have a valid <h1> tag
    if (!code.match(/<h1\s*>/i)) {
      if (code.match(/<h1[^>]/i)) {
        errors.push('❌ Malformed `<h1>` opening tag — it should be exactly `<h1>` with nothing between `h1` and `>`.');
      } else {
        errors.push('❌ Missing `<h1>` opening tag.');
      }
    }
    // Must have closing </h1>
    if (!code.match(/<\/h1>/i)) {
      errors.push('❌ Missing closing `</h1>` tag. Every opening tag needs a matching closing tag with a `/`.');
    }
    // Must have correct text
    if (!code.includes('Hello CodLift')) {
      errors.push('❌ The text inside `<h1>` must be exactly **Hello CodLift** (watch for typos, extra spaces, or wrong capitalisation).');
    }
    return errors;
  },

  /**
   * html_1_2: "Paragraphs & Text Blocks"
   * Task: Add a <p> tag with text "Learning to code is fun!"
   */
  html_1_2: (code) => {
    const errors = [];
    if (!code.match(/<p\s*>/i)) errors.push('❌ Missing `<p>` opening tag — wrap your text in a paragraph element.');
    if (!code.match(/<\/p>/i)) errors.push('❌ Missing closing `</p>` tag.');
    if (!code.includes('Learning to code is fun!')) {
      errors.push("❌ The paragraph text must be exactly: **Learning to code is fun!** (check punctuation and capitalisation).");
    }
    return errors;
  },

  /**
   * html_1_3: "Hyperlinks & Global Connectivity"
   * Task: Add <a href="https://codlift.site">Visit CodLift</a>
   */
  html_1_3: (code) => {
    const errors = [];
    const hasValidAnchor = code.match(/<a\s+href="https:\/\/codlift\.site"\s*>Visit CodLift<\/a>/i);
    if (!hasValidAnchor) {
      if (!code.match(/<a\s/i)) {
        errors.push('❌ Missing `<a>` anchor tag entirely. Add one to create a hyperlink.');
      } else {
        if (!code.includes('href=')) errors.push('❌ Missing `href` attribute on your `<a>` tag.');
        if (!code.includes('https://codlift.site')) errors.push('❌ The `href` value must be exactly `https://codlift.site`.');
        if (!code.includes('Visit CodLift')) errors.push('❌ The visible link text must be exactly **Visit CodLift**.');
        if (!code.match(/<\/a>/i)) errors.push('❌ Missing closing `</a>` tag.');
      }
    }
    return errors;
  },

  /**
   * html_2_1: "Semantic Layout"
   * Task: Wrap h1 in <header>, p in <main>
   */
  html_2_1: (code) => {
    const errors = [];
    if (!code.match(/<header[\s>]/i)) errors.push('❌ Missing `<header>` element. Wrap the `<h1>` inside a `<header>` tag.');
    if (!code.match(/<\/header>/i)) errors.push('❌ Missing closing `</header>` tag.');
    if (!code.match(/<main[\s>]/i)) errors.push('❌ Missing `<main>` element. Wrap the `<p>` inside a `<main>` tag.');
    if (!code.match(/<\/main>/i)) errors.push('❌ Missing closing `</main>` tag.');
    // Check nesting: h1 must be inside header, p inside main
    if (!code.match(/<header[\s>].*?<h1[\s>].*?<\/h1>.*?<\/header>/is)) {
      errors.push('❌ The `<h1>` must be **inside** the `<header>` element, not outside it.');
    }
    if (!code.match(/<main[\s>].*?<p[\s>].*?<\/p>.*?<\/main>/is)) {
      errors.push('❌ The `<p>` must be **inside** the `<main>` element, not outside it.');
    }
    return errors;
  },

  // ─────────────────────────────────────────────────────────
  // CSS STYLING
  // ─────────────────────────────────────────────────────────

  css_1_1: (code) => {
    const errors = [];
    if (!code.match(/h1\s*\{[^}]*color\s*:\s*purple\s*;?[^}]*\}/i)) {
      if (!code.match(/h1\s*\{/i)) errors.push("❌ Missing `h1` selector — your CSS rule must target the `h1` element.");
      else if (!code.includes('color')) errors.push("❌ Missing `color` property inside `h1 { ... }`.");
      else if (!code.includes('purple')) errors.push("❌ The `color` value must be `purple`, not something else.");
      else errors.push("❌ Syntax error in CSS rule. Expected format: `h1 { color: purple; }`");
    }
    return errors;
  },

  css_2_1: (code) => {
    const errors = [];
    if (!code.match(/\.container\s*\{[^}]*display\s*:\s*flex[^}]*\}/i)) {
      if (!code.match(/\.container\s*\{/i)) errors.push("❌ Missing `.container` selector in your CSS.");
      else errors.push("❌ Missing `display: flex` inside `.container { ... }`. Add it to activate Flexbox.");
    }
    return errors;
  },

  css_2_2: (code) => {
    const errors = [];
    if (!code.match(/justify-content\s*:\s*center/i)) errors.push("❌ Missing `justify-content: center` in `.container`.");
    if (!code.match(/align-items\s*:\s*center/i)) errors.push("❌ Missing `align-items: center` in `.container`.");
    return errors;
  },

  css_2_3: (code) => {
    const errors = [];
    if (!code.match(/flex-direction\s*:\s*column/i)) errors.push("❌ Missing `flex-direction: column`.");
    if (!code.match(/flex-wrap\s*:\s*wrap/i)) errors.push("❌ Missing `flex-wrap: wrap`.");
    return errors;
  },

  css_3_1: (code) => {
    const errors = [];
    if (!code.match(/display\s*:\s*grid/i)) errors.push("❌ Missing `display: grid` inside `.grid { ... }`.");
    if (!code.match(/grid-template-columns\s*:\s*1fr\s+1fr\s+1fr/i)) {
      errors.push("❌ Missing `grid-template-columns: 1fr 1fr 1fr` — this creates 3 equal columns.");
    }
    return errors;
  },

  css_3_2: (code) => {
    const errors = [];
    if (!code.match(/@media\s*\(\s*max-width\s*:\s*600px\s*\)/i)) {
      errors.push("❌ Missing media query: `@media (max-width: 600px) { ... }`.");
    }
    // Inside the media query there should be grid-template-columns: 1fr
    if (!code.match(/grid-template-columns\s*:\s*1fr\s*;/i)) {
      errors.push("❌ Inside the `@media` block, set `.grid { grid-template-columns: 1fr; }` to collapse to a single column.");
    }
    return errors;
  },

  // ─────────────────────────────────────────────────────────
  // JS FUNDAMENTALS
  // ─────────────────────────────────────────────────────────

  js_1_1: (code) => {
    const errors = [];
    if (!code.match(/let\s+friend\s*=\s*["']Alex["']/)) {
      if (!code.match(/let\s+friend/)) {
        if (!code.includes('let')) errors.push("❌ Use the `let` keyword to declare the variable.");
        if (!code.includes('friend')) errors.push("❌ The variable name must be `friend`.");
      }
      if (!code.includes('Alex')) {
        errors.push('❌ The value must be `"Alex"` (with quotes).');
      } else if (!code.match(/["']Alex["']/)) {
        errors.push('❌ `Alex` must be a string — wrap it in quotes: `"Alex"`.');
      }
      if (!code.includes('=')) errors.push("❌ Use the `=` operator to assign the value to the variable.");
    }
    return errors;
  },

  js_1_2: (code) => {
    const errors = [];
    if (!code.match(/function\s+greetUser\s*\(\s*name\s*\)/)) {
      if (!code.match(/function\s+greetUser/)) errors.push("❌ Missing function declaration: `function greetUser(name) { ... }`");
      else errors.push("❌ The function must accept a parameter named `name`: `function greetUser(name)`.");
    }
    if (!code.includes('return')) errors.push("❌ Missing `return` keyword — the function must return the result string.");
    if (!code.match(/["']Hello, ["']/) && !code.match(/`Hello,/)) {
      errors.push('❌ The returned string must start with `"Hello, "` (with a comma and a space).');
    }
    return errors;
  },

  js_1_3: (code) => {
    const errors = [];
    if (!code.match(/(const|let|var)\s+fruits\s*=\s*\[/)) {
      errors.push("❌ Declare an array named `fruits` using `const fruits = [...]`.");
    }
    if (!code.includes('fruits[0]')) errors.push("❌ Log the first item using `console.log(fruits[0])`.");
    if (!code.includes('console.log')) errors.push("❌ Use `console.log(...)` to print the output.");
    return errors;
  },

  js_1_4: (code) => {
    const errors = [];
    if (!code.match(/(const|let|var)\s+person\s*=\s*\{/)) {
      errors.push("❌ Declare an object named `person` using `const person = { ... }`.");
    }
    if (!code.match(/name\s*:/)) errors.push("❌ The object must have a `name` key (e.g. `name: \"Alex\"`).");
    if (!code.match(/age\s*:/)) errors.push("❌ The object must have an `age` key (e.g. `age: 25`).");
    if (!code.match(/job\s*:/)) errors.push("❌ The object must have a `job` key (e.g. `job: \"Developer\"`).");
    if (!code.includes('person.name')) errors.push("❌ Log the name using `console.log(person.name)`.");
    return errors;
  },

  js_1_5: (code) => {
    const errors = [];
    if (!code.match(/for\s*\(/)) errors.push("❌ Use a `for` loop: `for (let i = 1; i <= 5; i++) { ... }`");
    if (!code.match(/i\s*<=\s*5/)) errors.push("❌ The loop condition must be `i <= 5` so it runs up to (and including) 5.");
    if (!code.match(/i\s*=\s*1/)) errors.push("❌ Start the loop counter at 1: `let i = 1`.");
    if (!code.match(/i\+\+/)) errors.push("❌ Increment the counter with `i++` to avoid an infinite loop.");
    if (!code.includes('console.log(i)')) errors.push("❌ Log the current number inside the loop: `console.log(i)`.");
    return errors;
  }
};

// ─────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────
const validateExercise = (id, code, language) => {
  let errors = [];

  // 1. Run global HTML syntax checks (only for HTML exercises)
  if (language === 'html') {
    errors = [...errors, ...validators._globalHTMLCheck(code, id)];
  }

  // 2. Run lesson-specific checks (if a validator exists for this id)
  if (validators[id]) {
    const lessonErrors = validators[id](code);
    errors = [...errors, ...lessonErrors];
  }

  // Deduplicate errors
  errors = Array.from(new Set(errors));

  if (errors.length > 0) {
    return {
      isCorrect: false,
      feedback: `### ❌ Submission Rejected\n\nYour code has the following issues:\n\n${errors.map(e => `- ${e}`).join('\n')}\n\n> Fix each issue above and try submitting again. 🛠️`
    };
  }

  // If a lesson-specific validator exists and found no errors, pass
  // If no validator exists for this id, return null so AI handles it
  if (validators[id]) {
    return { isCorrect: true, feedback: '### ✅ Looking good! Verified by syntax checker.' };
  }

  return null; // Let AI handle lessons without a manual validator
};

module.exports = { validateExercise };
