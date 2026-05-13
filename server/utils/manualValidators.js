/**
 * CodLift Manual Verification Library
 * Covers: Beginner, Pro, Master tracks
 */

// Lessons where <html><body> etc. are EXPECTED (full document exercises)
const FULL_DOC = new Set(['html_1_1', 'dom_1_1', 'dom_1_2', 'events_1_1', 'events_1_2']);

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function htmlGlobal(code, id) {
  const errs = [];
  if (!FULL_DOC.has(id)) {
    ['<html>', '</html>', '<body>', '</body>', '<head>', '</head>'].forEach(t => {
      if (code.toLowerCase().includes(t))
        errs.push(`Remove the \`${t}\` tag — only write the specific element the task asks for.`);
    });
  }
  const opens = (code.match(/</g) || []).length;
  const closes = (code.match(/>/g) || []).length;
  if (opens !== closes)
    errs.push(`Mismatched angle brackets: ${opens} \`<\` vs ${closes} \`>\`. Every tag needs both.`);
  const badTag = code.match(/<[a-zA-Z][a-zA-Z0-9]*[^a-zA-Z0-9\s\/>'"=\-_.#:]/);
  if (badTag) errs.push(`Malformed tag: \`${badTag[0]}\` — tags must look like \`<h1>\` or \`<h1 class="…">\`.`);
  const numTag = code.match(/<[0-9]+>/);
  if (numTag) errs.push(`Invalid tag \`${numTag[0]}\` — HTML tag names cannot be numbers.`);
  return errs;
}

function cssPropCheck(code, selector, prop, value, label) {
  const re = new RegExp(`${selector.replace('.', '\\.')}\\s*\\{[^}]*${prop}\\s*:\\s*${value}[^}]*\\}`, 'i');
  if (re.test(code)) return [];
  const errs = [];
  if (!code.includes(selector)) errs.push(`Missing \`${selector}\` selector.`);
  else if (!code.includes(prop)) errs.push(`Missing \`${prop}\` property inside \`${selector} { … }\`.`);
  else errs.push(`The \`${prop}\` value must be \`${value}\`. ${label || ''}`);
  return errs;
}

// ─── VALIDATORS ───────────────────────────────────────────────────────────────
const V = {

  // ── BEGINNER: HTML Basics ─────────────────────────────────────────────────

  html_1_1(code) {
    const e = [];
    if (!code.match(/<h1\s*>/i))
      e.push(!code.match(/<h1/i) ? 'Missing `<h1>` tag.' : 'Malformed `<h1>` tag — it should be exactly `<h1>` with nothing extra before `>`.');
    if (!code.match(/<\/h1>/i))
      e.push('Missing closing `</h1>` tag. Every opening tag needs a `/` in the closing tag.');
    if (!code.includes('Hello CodLift'))
      e.push('The text inside `<h1>` must be exactly **Hello CodLift** — check spelling and capitalisation.');
    return e;
  },

  html_1_2(code) {
    const e = [];
    if (!code.match(/<p\s*>/i)) e.push('Missing `<p>` opening tag.');
    if (!code.match(/<\/p>/i))  e.push('Missing closing `</p>` tag.');
    if (!code.includes('Learning to code is fun!'))
      e.push('Paragraph text must be exactly: **Learning to code is fun!** (check punctuation).');
    return e;
  },

  html_1_3(code) {
    const e = [];
    if (!code.match(/<a\s/i))
      return ['Missing `<a>` anchor tag. Add one to create a hyperlink.'];
    if (!code.includes('href='))   e.push('Missing `href` attribute on your `<a>` tag.');
    if (!code.includes('https://codlift.site')) e.push('`href` must be exactly `https://codlift.site` (include `https://`).');
    if (!code.includes('Visit CodLift'))        e.push('Link text must be exactly **Visit CodLift**.');
    if (!code.match(/<\/a>/i))                  e.push('Missing closing `</a>` tag.');
    return e;
  },

  // ── BEGINNER: HTML Structure & Semantics ──────────────────────────────────

  html_2_1(code) {
    const e = [];
    if (!code.match(/<header[\s>]/i)) e.push('Missing `<header>` element.');
    if (!code.match(/<\/header>/i))   e.push('Missing closing `</header>` tag.');
    if (!code.match(/<main[\s>]/i))   e.push('Missing `<main>` element.');
    if (!code.match(/<\/main>/i))     e.push('Missing closing `</main>` tag.');
    if (code.match(/<header[\s>]/i) && !code.match(/<header[\s>][\s\S]*?<h1[\s>]/i))
      e.push('The `<h1>` must be **inside** `<header>`, not outside it.');
    if (code.match(/<main[\s>]/i) && !code.match(/<main[\s>][\s\S]*?<p[\s>]/i))
      e.push('The `<p>` must be **inside** `<main>`, not outside it.');
    return e;
  },

  // forms & tables — server curriculum only, no ID assigned, skip manual

  // ── BEGINNER: CSS Styling ─────────────────────────────────────────────────

  css_1_1(code) {
    // client curriculum: color: purple
    // server curriculum: color: cyan — check both
    const wantPurple = code.includes('purple') || !code.includes('cyan');
    const color = wantPurple ? 'purple' : 'cyan';
    return cssPropCheck(code, 'h1', 'color', color,
      `Syntax: \`h1 { color: ${color}; }\``);
  },

  // ── BEGINNER: CSS Flexbox ─────────────────────────────────────────────────

  css_2_1(code) {
    const e = [];
    if (!code.match(/\.container\s*\{[^}]*display\s*:\s*flex[^}]*\}/i)) {
      if (!code.match(/\.container\s*\{/i)) e.push('Missing `.container` selector.');
      else e.push('Missing `display: flex` inside `.container { … }` to activate Flexbox.');
    }
    return e;
  },

  css_2_2(code) {
    const e = [];
    if (!code.match(/justify-content\s*:\s*center/i)) e.push('Missing `justify-content: center` in `.container`.');
    if (!code.match(/align-items\s*:\s*center/i))     e.push('Missing `align-items: center` in `.container`.');
    return e;
  },

  css_2_3(code) {
    const e = [];
    if (!code.match(/flex-direction\s*:\s*column/i)) e.push('Missing `flex-direction: column`.');
    if (!code.match(/flex-wrap\s*:\s*wrap/i))        e.push('Missing `flex-wrap: wrap`.');
    return e;
  },

  // ── BEGINNER: CSS Grid ────────────────────────────────────────────────────

  css_3_1(code) {
    const e = [];
    if (!code.match(/display\s*:\s*grid/i))
      e.push('Missing `display: grid` inside `.grid { … }`.');
    if (!code.match(/grid-template-columns\s*:\s*1fr\s+1fr\s+1fr/i))
      e.push('Missing `grid-template-columns: 1fr 1fr 1fr` (3 equal columns).');
    return e;
  },

  css_3_2(code) {
    const e = [];
    if (!code.match(/@media\s*\(\s*max-width\s*:\s*600px\s*\)/i))
      e.push('Missing `@media (max-width: 600px) { … }` block.');
    if (!code.match(/grid-template-columns\s*:\s*1fr\s*;/i))
      e.push('Inside `@media`, set `.grid { grid-template-columns: 1fr; }` to collapse to 1 column.');
    return e;
  },

  // ── BEGINNER: JS Fundamentals ─────────────────────────────────────────────

  js_1_1(code) {
    // "friend" variable
    const e = [];
    if (!code.match(/let\s+friend\s*=/)) {
      if (!code.includes('let'))    e.push('Use the `let` keyword to declare the variable.');
      if (!code.includes('friend')) e.push('Variable name must be `friend`.');
      if (!code.includes('='))      e.push('Use `=` to assign a value.');
    }
    if (!code.match(/["']Alex["']/)) e.push('Value must be `"Alex"` (a string in quotes).');
    return e;
  },

  js_1_2(code) {
    const e = [];
    if (!code.match(/function\s+greetUser\s*\(\s*name\s*\)/))
      e.push(!code.match(/function\s+greetUser/) ?
        'Missing `function greetUser(name) { … }` declaration.' :
        'The function parameter must be named `name`: `function greetUser(name)`.');
    if (!code.includes('return'))
      e.push('Missing `return` — the function must return the result string.');
    if (!code.match(/["'`]Hello,\s*/))
      e.push('Returned string must start with `"Hello, "` (comma + space).');
    if (!code.match(/[+`].*name.*!/))
      e.push('String must end with the `name` variable followed by `!`.');
    return e;
  },

  js_1_3(code) {
    const e = [];
    if (!code.match(/(const|let|var)\s+fruits\s*=\s*\[/))
      e.push('Declare an array: `const fruits = ["item1", "item2", "item3"]`.');
    if (!code.includes('fruits[0]'))
      e.push('Access first item with `fruits[0]`.');
    if (!code.includes('console.log'))
      e.push('Use `console.log(fruits[0])` to print the result.');
    return e;
  },

  js_1_4(code) {
    const e = [];
    if (!code.match(/(const|let|var)\s+person\s*=\s*\{/))
      e.push('Declare an object: `const person = { … }`.');
    if (!code.match(/name\s*:/))   e.push('Object must have a `name` key.');
    if (!code.match(/age\s*:/))    e.push('Object must have an `age` key.');
    if (!code.match(/job\s*:/))    e.push('Object must have a `job` key.');
    if (!code.includes('person.name')) e.push('Log the name with `console.log(person.name)`.');
    return e;
  },

  js_1_5(code) {
    const e = [];
    if (!code.match(/for\s*\(/))       e.push('Use a `for` loop: `for (let i = 1; i <= 5; i++) { … }`');
    if (!code.match(/i\s*=\s*1/))      e.push('Start the counter at `1`: `let i = 1`.');
    if (!code.match(/i\s*<=\s*5/))     e.push('Condition must be `i <= 5` to loop up to (and including) 5.');
    if (!code.match(/i\+\+/))          e.push('Add `i++` to increment the counter and prevent an infinite loop.');
    if (!code.includes('console.log(i)')) e.push('Log each number with `console.log(i)` inside the loop.');
    return e;
  },

  // ── BEGINNER: DOM Manipulation ────────────────────────────────────────────

  dom_1_1(code) {
    const e = [];
    if (!code.includes('getElementById("title")') && !code.includes("getElementById('title')"))
      e.push('Use `document.getElementById("title")` to select the heading element.');
    if (!code.includes('.textContent'))
      e.push('Use `.textContent` to change the element\'s text (not `.innerHTML`).');
    if (!code.includes('I clicked it!'))
      e.push('Set textContent to exactly `"I clicked it!"` — check spelling.');
    return e;
  },

  dom_1_2(code) {
    const e = [];
    if (!code.includes('getElementById("box")') && !code.includes("getElementById('box')"))
      e.push('Use `document.getElementById("box")` to select the box element.');
    if (!code.includes('.style.backgroundColor'))
      e.push('Use `.style.backgroundColor` — CSS `background-color` becomes camelCase in JS.');
    if (!code.includes('cyan'))
      e.push('Set backgroundColor to exactly `"cyan"`.');
    return e;
  },

  // ── BEGINNER: JS Events & Forms ───────────────────────────────────────────

  events_1_1(code) {
    const e = [];
    if (!code.includes('addEventListener'))
      e.push('Use `btn.addEventListener("click", …)` — do not use the inline `onclick` attribute.');
    if (!code.match(/addEventListener\s*\(\s*["']click["']/))
      e.push('The event type must be `"click"` (lowercase string).');
    if (!code.includes('console.log'))
      e.push('Inside the handler, use `console.log(…)` to print the message.');
    if (!code.includes('Button clicked!'))
      e.push('Log exactly `"Button clicked!"` — check spelling and exclamation mark.');
    return e;
  },

  events_1_2(code) {
    const e = [];
    if (!code.includes('preventDefault'))
      e.push('Call `e.preventDefault()` first to stop the page from reloading on submit.');
    if (!code.includes('.value'))
      e.push('Read the input value with `document.getElementById("name").value`.');
    if (!code.match(/=\s*=\s*["']{2}|===\s*["']{2}/))
      e.push('Check if the input is empty by comparing `.value === ""`.');
    if (!code.includes('alert'))
      e.push('Show `alert("Name is required!")` when the field is empty.');
    if (!code.includes('Name is required!'))
      e.push('Alert text must be exactly `"Name is required!"` — check punctuation.');
    return e;
  },

  // ── PRO: React Components ─────────────────────────────────────────────────

  react_1_1(code) {
    const e = [];
    if (!code.match(/function\s+Greeting\s*\(/))
      e.push('Define a function component named `Greeting` (capital G): `function Greeting() { … }`');
    if (!code.includes('return'))
      e.push('The component must `return` JSX — do not forget the return statement.');
    if (!code.includes('Hello, React!'))
      e.push('The returned `<h1>` must contain exactly **Hello, React!**');
    if (!code.match(/<h1[\s>]/))
      e.push('Return an `<h1>` element inside the component.');
    return e;
  },

  react_1_2(code) {
    const e = [];
    if (!code.match(/function\s+Card\s*\(/))
      e.push('Define a component named `Card`: `function Card(props) { … }`');
    if (!code.includes('return'))
      e.push('The component must `return` JSX.');
    if (!code.match(/<h2[\s>]/))
      e.push('Return an `<h2>` element.');
    if (!code.match(/props\.title|{title}/))
      e.push('Render the title with `{props.title}` or `{title}` (if using destructuring).');
    return e;
  },

  react_1_3(code) {
    const e = [];
    if (!code.includes('useState'))
      e.push('Use the `useState` hook: `const [count, setCount] = useState(0)`.');
    if (!code.match(/useState\s*\(\s*0\s*\)/))
      e.push('Initialise state at `0`: `useState(0)`.');
    if (!code.includes('setCount'))
      e.push('Use `setCount(count + 1)` and `setCount(count - 1)` in your button handlers.');
    return e;
  },

  // ── PRO: React Hooks ─────────────────────────────────────────────────────

  hooks_1_1(code) {
    const e = [];
    if (!code.includes('useEffect'))
      e.push('Add a `useEffect` hook: `useEffect(() => { … }, [])`.');
    if (!code.match(/useEffect\s*\(.*\[\s*\]/s))
      e.push('Pass an empty array `[]` as the second argument so it only runs once on mount.');
    if (!code.includes('Component mounted!'))
      e.push('Log exactly `"Component mounted!"` inside the useEffect.');
    return e;
  },

  hooks_1_2(code) {
    const e = [];
    if (!code.includes('data[0].name') && !code.includes('data[0]["name"]'))
      e.push('Log the first user\'s name with `console.log(data[0].name)`.');
    if (!code.includes('console.log'))
      e.push('Use `console.log(…)` to print the result.');
    return e;
  },

  // ── PRO: Node / Express ──────────────────────────────────────────────────

  express_1_1(code) {
    const e = [];
    if (!code.match(/app\.get\s*\(\s*["']\/hello["']/))
      e.push('Create a route: `app.get("/hello", (req, res) => { … })`.');
    if (!code.includes('res.json'))
      e.push('Respond with `res.json(…)` — not `res.send()`.');
    if (!code.includes('Hello World') && !code.includes('message'))
      e.push('Return a JSON object with key `message` and value `"Hello World"`.');
    return e;
  },

  express_1_2(code) {
    const e = [];
    if (!code.match(/app\.get\s*\(\s*["']\/user\/:id["']/))
      e.push('Route path must be `/user/:id` (with colon prefix on `id`).');
    if (!code.includes('req.params.id'))
      e.push('Extract the id with `req.params.id`.');
    if (!code.includes('res.json'))
      e.push('Return the result with `res.json({ userId: req.params.id })`.');
    return e;
  },

  // ── PRO: Fetch API / Async ────────────────────────────────────────────────

  async_1_1(code) {
    const e = [];
    if (!code.match(/async\s+function\s+fetchData/))
      e.push('Mark the function as `async`: `async function fetchData() { … }`.');
    if (!code.includes('await fetch'))
      e.push('Use `await fetch(url)` to make the HTTP request.');
    if (!code.includes('await res.json()') && !code.includes('await response.json()'))
      e.push('Parse the response with `await res.json()`.');
    if (!code.includes('return') || (!code.includes('.title') && !code.includes('["title"]')))
      e.push('Return `data.title` from the function.');
    return e;
  },

  async_1_2(code) {
    const e = [];
    if (!code.includes('try'))
      e.push('Wrap your fetch in a `try { … }` block.');
    if (!code.includes('catch'))
      e.push('Add a `catch (error) { … }` block after `try`.');
    if (!code.includes('console.error'))
      e.push('Inside `catch`, use `console.error(…)` to log the error.');
    if (!code.includes('Fetch failed'))
      e.push('Error message must start with `"Fetch failed: "`.');
    return e;
  },

  // ── MASTER: System Design ────────────────────────────────────────────────

  system_1_1(code) {
    const e = [];
    if (!code.match(/GET\s+\/todos/i))    e.push('Document: `GET /todos` → Get all todos');
    if (!code.match(/POST\s+\/todos/i))   e.push('Document: `POST /todos` → Create a new todo');
    if (!code.match(/PUT\s+\/todos\/:id/i)) e.push('Document: `PUT /todos/:id` → Update a specific todo');
    if (!code.match(/DELETE\s+\/todos\/:id/i)) e.push('Document: `DELETE /todos/:id` → Delete a specific todo');
    if (!code.includes('console.log'))    e.push('Keep `console.log("API design documented!")` at the bottom.');
    return e;
  },

  // ── MASTER: Data Structures ──────────────────────────────────────────────

  ds_1_1(code) {
    const e = [];
    if (!code.match(/class\s+Node/))
      e.push('Define a `class Node { … }` class.');
    if (!code.includes('this.value'))
      e.push('In the constructor, set `this.value = value`.');
    if (!code.includes('this.next'))
      e.push('In the constructor, set `this.next = null`.');
    if (!code.includes('node1.next = node2'))
      e.push('Link the nodes: `node1.next = node2`.');
    if (!code.includes('node2.next = node3'))
      e.push('Link the nodes: `node2.next = node3`.');
    return e;
  },

  ds_1_2(code) {
    const e = [];
    if (!code.match(/push\s*\(item\)/))
      e.push('Define `push(item) { this.items.push(item); }`.');
    if (!code.match(/pop\s*\(\s*\)\s*\{[^}]*\.pop\(\)/))
      e.push('Define `pop() { return this.items.pop(); }`.');
    if (!code.match(/peek\s*\(\s*\)/))
      e.push('Define `peek() { return this.items[this.items.length - 1]; }`.');
    return e;
  },

  ds_1_3(code) {
    const e = [];
    if (!code.match(/while\s*\(\s*left\s*<=\s*right\s*\)/))
      e.push('Add `while (left <= right) { … }` loop.');
    if (!code.match(/Math\.floor\s*\(\s*\(\s*left\s*\+\s*right\s*\)\s*\/\s*2\s*\)/))
      e.push('Calculate mid: `let mid = Math.floor((left + right) / 2)`.');
    if (!code.match(/arr\s*\[\s*mid\s*\]\s*===\s*target/))
      e.push('If `arr[mid] === target`, return `mid`.');
    if (!code.match(/left\s*=\s*mid\s*\+\s*1/))
      e.push('If `arr[mid] < target`, set `left = mid + 1`.');
    if (!code.match(/right\s*=\s*mid\s*-\s*1/))
      e.push('If `arr[mid] > target`, set `right = mid - 1`.');
    if (!code.match(/return\s+-1/))
      e.push('Return `-1` after the loop if target is not found.');
    return e;
  }
};

// ─── MAIN EXPORT ───────────────────────────────────────────────────────────────
const validateExercise = (id, code, language) => {
  let errors = [];

  // 1. Global HTML structural checks
  if (language === 'html') {
    errors = [...errors, ...htmlGlobal(code, id)];
  }

  // 2. Lesson-specific checks
  if (V[id]) {
    errors = [...errors, ...V[id](code)];
  }

  // Remove duplicates
  errors = [...new Set(errors)];

  if (errors.length > 0) {
    return {
      isCorrect: false,
      feedback: `### ❌ Submission Rejected\n\nFix the following issues and resubmit:\n\n${errors.map(e => `- ${e}`).join('\n')}\n\n> 🛠️ Fix each issue above and try again.`
    };
  }

  // If we have a specific validator and it passed, accept immediately
  if (V[id]) {
    return { isCorrect: true, feedback: '### ✅ Syntax Check Passed\n\nYour code structure looks correct!' };
  }

  // No validator for this id — let AI handle it
  return null;
};

module.exports = { validateExercise };
