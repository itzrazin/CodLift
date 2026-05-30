/**
 * CodLift Manual Verification Library
 * Covers ALL lessons: HTML Basics, HTML Structure, CSS Styling, CSS Flexbox,
 * CSS Grid, JS Fundamentals, and Arena challenges.
 * Predicts every plausible user error — but passes immediately on correct code.
 */

const FULL_DOC = new Set(['html_1_1', 'dom_1_1', 'dom_1_2', 'events_1_1', 'events_1_2']);

// ─── CORE HELPERS ─────────────────────────────────────────────────────────────

function htmlGlobal(code: string, id: string): string[] {
  const errs: string[] = [];

  // Only warn about full-doc tags when they're not expected
  if (!FULL_DOC.has(id)) {
    ['<html>', '</html>', '<body>', '</body>', '<head>', '</head>'].forEach(t => {
      if (code.toLowerCase().includes(t))
        errs.push(`Concept Misunderstanding: You included \`${t}\`. Only write the specific element requested. The browser handles the rest automatically.`);
    });
  }

  // Mismatched angle brackets
  const opens  = (code.match(/</g)  || []).length;
  const closes = (code.match(/>/g)  || []).length;
  if (opens !== closes)
    errs.push(`Syntax Pitfall: Mismatched angle brackets. You have ${opens} \`<\` and ${closes} \`>\`. Every tag needs both.`);

  // Unclosed common tags
  if (code.match(/<html[^>]*>/i) && !code.match(/<\/html>/i))
    errs.push('Syntax Pitfall: Opened `<html>` but forgot to close it with `</html>`.');
  if (code.match(/<body[^>]*>/i) && !code.match(/<\/body>/i))
    errs.push('Syntax Pitfall: Opened `<body>` but forgot to close it with `</body>`.');

  // Numeric tag names
  const numTag = code.match(/<[0-9]+>/);
  if (numTag) errs.push(`Syntax Pitfall: Invalid tag \`${numTag[0]}\`. HTML tags cannot start with numbers.`);

  return errs;
}

function jsGlobal(code: string): string[] {
  const errs: string[] = [];

  if (code.match(/while\s*\(\s*true\s*\)/))
    errs.push('Logical Error: `while (true)` creates an infinite loop and will crash. Add a breakout condition.');

  if (code.match(/if\s*\(\s*[a-zA-Z0-9_]+\s*=[^=]/))
    errs.push('Logical Error: Using `=` inside an `if` condition. Use `===` to compare values, not `=` which assigns.');

  if (code.match(/["'][0-9]+["']\s*[-*\/]/))
    errs.push('Concept Misunderstanding: Performing arithmetic on a string number. Remove the quotes to use a real number.');

  return errs;
}

function cssGlobal(code: string): string[] {
  const errs: string[] = [];

  // Missing semicolons after values (heuristic: property:value with no semicolon before })
  if (code.match(/:\s*[^;{}]+\n\s*}/))
    errs.push('Syntax Pitfall: Missing semicolon `;` at the end of a CSS property. Every property must end with `;`.');

  // Using = instead of : in CSS
  if (code.match(/[a-z-]+\s*=\s*[a-z]/))
    errs.push('Syntax Pitfall: Using `=` in CSS. CSS properties use a colon `:` not an equals sign `=`. Example: `color: purple;`');

  return errs;
}

// ─── PER-EXERCISE VALIDATORS ──────────────────────────────────────────────────
const V: Record<string, (code: string) => string[]> = {

  // ══════════════════════════════════════════════════════════════════════════
  // LESSON: HTML Basics
  // ══════════════════════════════════════════════════════════════════════════

  html_1_1(code) {
    const e: string[] = [];
    const lc = code.toLowerCase();

    // Correct answer check — pass immediately
    if (code.includes('Hello CodLift') && lc.includes('<h1') && lc.includes('</h1>')) return [];

    if (!lc.includes('<h1')) {
      if (code.includes('<H1')) e.push('Syntax Pitfall: HTML tags should be lowercase. Use `<h1>` not `<H1>`.');
      else e.push('Missing `<h1>` tag. Wrap your text in `<h1>` and `</h1>`.');
    }
    if (lc.includes('<h1') && !lc.includes('</h1>'))
      e.push('Syntax Pitfall: Missing closing `</h1>`. Every opening tag needs a matching closing tag.');
    if (!code.includes('Hello CodLift')) {
      if (code.includes('hello codlift') || code.includes('HELLO CODLIFT'))
        e.push('Logical Error: The text must be EXACTLY "Hello CodLift" — capital H and capital C.');
      else
        e.push('Logical Error: The text inside `<h1>` must be exactly "Hello CodLift". Check for typos.');
    }
    if (code.includes('<h2') || code.includes('<h3'))
      e.push('Concept Misunderstanding: Use `<h1>` for the main heading, not `<h2>` or `<h3>`.');
    return e;
  },

  html_1_2(code) {
    const e: string[] = [];
    const lc = code.toLowerCase();

    if (lc.includes('<p') && lc.includes('</p>') && code.includes('Learning to code is fun!')) return [];

    if (code.match(/<P\s*>/)) e.push('Syntax Pitfall: Use lowercase `<p>` instead of `<P>`.');
    if (!lc.includes('<p')) e.push('Missing `<p>` opening tag. Add a paragraph element.');
    if (lc.includes('<p') && !lc.includes('</p>')) e.push('Syntax Pitfall: Missing closing `</p>` tag.');
    if (!code.includes('Learning to code is fun!')) {
      if (code.includes('Learning to code is fun'))
        e.push('Logical Error: Missing the exclamation mark `!` at the end. Text must be exactly "Learning to code is fun!"');
      else if (code.toLowerCase().includes('learning to code is fun!'))
        e.push('Logical Error: Check your capitalization. The text must be exactly "Learning to code is fun!"');
      else
        e.push('Logical Error: Paragraph text must be exactly "Learning to code is fun!" — include punctuation and correct capitalization.');
    }
    if (code.includes('<h1') && code.toLowerCase().includes('learning'))
      e.push('Concept Misunderstanding: "Learning to code is fun!" should be inside a `<p>` tag, not inside a heading tag.');
    return e;
  },

  html_1_3(code) {
    const e: string[] = [];
    const lc = code.toLowerCase();

    if (lc.includes('<a ') && code.includes('https://codlift.site') && lc.includes('</a>')) return [];

    if (!lc.match(/<a[\s>]/)) return ['Concept Misunderstanding: Use an `<a>` anchor tag to create hyperlinks. Start with `<a href="...">`'];
    if (!code.includes('href=')) e.push('Syntax Pitfall: Missing `href` attribute. The link needs `href="..."` to know where to go.');
    if (code.match(/href=['"]www\./)) e.push('Logical Error: URLs must start with `https://` not just `www.`. Change to `href="https://..."`');
    if (code.match(/href=['"]http:\/\//)) e.push('Logical Error: Use `https://` (secure) not `http://`. Change to `https://codlift.site`.');
    if (!code.includes('https://codlift.site')) e.push('Logical Error: The `href` value must be exactly `https://codlift.site`.');
    if (!lc.includes('</a>')) e.push('Syntax Pitfall: Missing closing `</a>` tag.');
    if (!code.match(/href\s*=\s*["']/)) e.push('Syntax Pitfall: The `href` value must be wrapped in quotes, like `href="https://codlift.site"`.');
    return e;
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LESSON: HTML Structure & Semantics
  // ══════════════════════════════════════════════════════════════════════════

  html_2_1(code) {
    const e: string[] = [];
    const lc = code.toLowerCase();

    const hasHeader = lc.match(/<header[\s>]/);
    const hasMain   = lc.match(/<main[\s>]/);
    const h1InHeader = lc.match(/<header[\s>][\s\S]*?<h1[\s>]/);
    const pInMain    = lc.match(/<main[\s>][\s\S]*?<p[\s>]/);

    if (hasHeader && hasMain && h1InHeader && pInMain &&
        lc.includes('</header>') && lc.includes('</main>')) return [];

    if (!hasHeader) {
      if (lc.includes('<div') && lc.includes('header'))
        e.push('Concept Misunderstanding: You used a `<div>` with "header" text. Use the actual `<header>` semantic element instead.');
      else
        e.push('Missing `<header>` element. Wrap the `<h1>` inside a `<header>` tag.');
    }
    if (!hasMain) {
      if (lc.includes('<div') && lc.includes('main'))
        e.push('Concept Misunderstanding: Use the actual `<main>` element, not a `<div>` with "main" in it.');
      else
        e.push('Missing `<main>` element. Wrap the `<p>` inside a `<main>` tag.');
    }
    if (hasHeader && !lc.includes('</header>'))
      e.push('Syntax Pitfall: Opened `<header>` but missing the closing `</header>` tag.');
    if (hasMain && !lc.includes('</main>'))
      e.push('Syntax Pitfall: Opened `<main>` but missing the closing `</main>` tag.');
    if (hasHeader && !h1InHeader)
      e.push('Concept Misunderstanding: The `<h1>` must be nested INSIDE `<header>`, not placed outside it.');
    if (hasMain && !pInMain)
      e.push('Concept Misunderstanding: The `<p>` must be nested INSIDE `<main>`, not placed outside it.');
    if (lc.match(/<header[\s>][\s\S]*?<main[\s>]/))
      e.push('Concept Misunderstanding: `<main>` should be a sibling of `<header>`, not nested inside it.');
    return e;
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LESSON: CSS Styling
  // ══════════════════════════════════════════════════════════════════════════

  css_1_1(code) {
    const e: string[] = [];
    const lc = code.toLowerCase();

    if ((lc.includes('color: purple') || lc.includes('color:purple')) &&
        (lc.includes('h1 {') || lc.includes('h1{'))) return [];

    if (!lc.includes('h1 {') && !lc.includes('h1{')) {
      if (lc.includes('.h1') || lc.includes('#h1'))
        e.push('Syntax Pitfall: To target a tag element, just write `h1` not `.h1` or `#h1`. Dots are for classes, hashes for IDs.');
      else
        e.push('Syntax Pitfall: Missing the `h1` CSS selector. Start with `h1 {`.');
    }
    if (!lc.includes('color:') && !lc.includes('color :')) {
      if (lc.includes('text-color:') || lc.includes('font-color:'))
        e.push('Concept Misunderstanding: The correct CSS property is `color:`, not `text-color:` or `font-color:`.');
      else if (lc.includes('background-color:'))
        e.push('Concept Misunderstanding: `background-color` changes the background. Use `color:` to change the text color.');
      else
        e.push('Missing the `color:` CSS property inside the `h1` rule.');
    }
    if (!lc.includes('purple')) {
      if (lc.includes('#a855f7') || lc.includes('rgb(168') || lc.includes('hsl(270'))
        e.push('Logical Error: The task requires the keyword `purple`, not a hex/rgb/hsl value.');
      else
        e.push('Logical Error: The color value must be `purple`. Example: `color: purple;`');
    }
    if (lc.includes('color:') && !lc.match(/color\s*:\s*purple\s*;/))
      e.push('Syntax Pitfall: Missing semicolon `;` after `purple`. Every CSS value must end with `;`.');
    if (!code.includes('{') || !code.includes('}'))
      e.push('Syntax Pitfall: Missing curly braces `{}`. A CSS rule needs `selector { property: value; }` format.');
    return e;
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LESSON: CSS Flexbox
  // ══════════════════════════════════════════════════════════════════════════

  css_2_1(code) {
    const e: string[] = [];
    const lc = code.toLowerCase();

    if (lc.includes('.container') && lc.includes('display: flex') || lc.includes('display:flex')) return [];

    if (!lc.includes('.container')) {
      if (lc.includes('container {') || lc.includes('container{'))
        e.push('Syntax Pitfall: To target a class, use a dot before the name: `.container { ... }` not `container { ... }`.');
      else
        e.push('Missing `.container` selector. Your CSS rule should target `.container`.');
    }
    if (!lc.includes('display:') && !lc.includes('display :')) {
      e.push('Missing `display:` property. Add `display: flex;` inside `.container { }`.');
    }
    if (lc.includes('display:') && !lc.includes('flex')) {
      if (lc.includes('display: block') || lc.includes('display:block'))
        e.push('Logical Error: `display: block` stacks items vertically. Use `display: flex` to arrange them in a row.');
      else if (lc.includes('display: grid') || lc.includes('display:grid'))
        e.push('Logical Error: `display: grid` is a different layout system. Use `display: flex` for this exercise.');
      else
        e.push('Logical Error: The value must be `flex`. Use `display: flex;`');
    }
    if (lc.includes('display: flex') && !lc.match(/display\s*:\s*flex\s*;/))
      e.push('Syntax Pitfall: Missing semicolon `;` after `flex`. Write `display: flex;`');
    if (lc.includes('flex') && lc.match(/\.item\s*\{[^}]*display\s*:\s*flex/))
      e.push('Concept Misunderstanding: You set `display: flex` on `.item`. It must be set on the PARENT `.container`, not the children.');
    return e;
  },

  css_2_2(code) {
    const e: string[] = [];
    const lc = code.toLowerCase();

    const hasJustify = lc.includes('justify-content: center') || lc.includes('justify-content:center');
    const hasAlign   = lc.includes('align-items: center') || lc.includes('align-items:center');

    if (hasJustify && hasAlign) return [];

    if (!lc.includes('justify-content')) {
      if (lc.includes('justify-self') || lc.includes('justify-items'))
        e.push('Concept Misunderstanding: Use `justify-content` (not `justify-self` or `justify-items`) to align flex children horizontally.');
      else
        e.push('Missing `justify-content: center;` property. Add it inside `.container`.');
    }
    if (!lc.includes('align-items')) {
      if (lc.includes('align-self') || lc.includes('align-content'))
        e.push('Concept Misunderstanding: Use `align-items` (not `align-self` or `align-content`) to vertically center flex children.');
      else
        e.push('Missing `align-items: center;` property. Add it inside `.container`.');
    }
    if (lc.includes('justify-content') && !lc.includes('justify-content: center') && !lc.includes('justify-content:center'))
      e.push('Logical Error: `justify-content` value must be `center`. You might have written `flex-start`, `flex-end`, or left it blank.');
    if (lc.includes('align-items') && !lc.includes('align-items: center') && !lc.includes('align-items:center'))
      e.push('Logical Error: `align-items` value must be `center`. Check the value you provided.');
    if (!lc.includes('justify-content: center;') && lc.includes('justify-content: center'))
      e.push('Syntax Pitfall: Missing semicolon `;` after `justify-content: center`.');
    if (!lc.includes('align-items: center;') && lc.includes('align-items: center'))
      e.push('Syntax Pitfall: Missing semicolon `;` after `align-items: center`.');
    return e;
  },

  css_2_3(code) {
    const e: string[] = [];
    const lc = code.toLowerCase();

    const hasDir  = lc.includes('flex-direction: column') || lc.includes('flex-direction:column');
    const hasWrap = lc.includes('flex-wrap: wrap') || lc.includes('flex-wrap:wrap');

    if (hasDir && hasWrap) return [];

    if (!lc.includes('flex-direction')) {
      e.push('Missing `flex-direction: column;` property. Add it to `.container`.');
    }
    if (lc.includes('flex-direction') && !lc.includes('column')) {
      if (lc.includes('flex-direction: row') || lc.includes('flex-direction:row'))
        e.push('Logical Error: `flex-direction: row` is the default (horizontal). Change it to `column` to stack vertically.');
      else
        e.push('Logical Error: `flex-direction` value must be `column`.');
    }
    if (!lc.includes('flex-wrap')) {
      e.push('Missing `flex-wrap: wrap;` property. Add it to `.container`.');
    }
    if (lc.includes('flex-wrap') && !lc.includes('wrap')) {
      if (lc.includes('flex-wrap: nowrap') || lc.includes('flex-wrap:nowrap'))
        e.push('Logical Error: `flex-wrap: nowrap` prevents wrapping. Change it to `wrap`.');
      else
        e.push('Logical Error: `flex-wrap` value must be `wrap`.');
    }
    if (lc.includes('flex-direction: column') && !lc.match(/flex-direction\s*:\s*column\s*;/))
      e.push('Syntax Pitfall: Missing semicolon after `flex-direction: column`.');
    if (lc.includes('flex-wrap: wrap') && !lc.match(/flex-wrap\s*:\s*wrap\s*;/))
      e.push('Syntax Pitfall: Missing semicolon after `flex-wrap: wrap`.');
    return e;
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LESSON: CSS Grid & Responsive
  // ══════════════════════════════════════════════════════════════════════════

  css_3_1(code) {
    const e: string[] = [];
    const lc = code.toLowerCase();

    const hasGrid = lc.includes('display: grid') || lc.includes('display:grid');
    const hasCols = lc.includes('grid-template-columns: 1fr 1fr 1fr') ||
                    lc.includes('grid-template-columns:1fr 1fr 1fr') ||
                    lc.includes('repeat(3, 1fr)') ||
                    lc.includes('repeat(3,1fr)');

    if (hasGrid && hasCols) return [];

    if (!hasGrid) {
      if (lc.includes('display: flex') || lc.includes('display:flex'))
        e.push('Logical Error: You used `display: flex` (1D layout). This exercise requires `display: grid` (2D layout).');
      else
        e.push('Missing `display: grid;` inside `.grid`. The grid engine must be turned on first.');
    }
    if (!lc.includes('grid-template-columns')) {
      if (lc.includes('grid-template-rows'))
        e.push('Concept Misunderstanding: `grid-template-rows` defines horizontal rows. Use `grid-template-columns` to define vertical columns.');
      else
        e.push('Missing `grid-template-columns` property. Add `grid-template-columns: 1fr 1fr 1fr;` to define 3 columns.');
    }
    if (lc.includes('grid-template-columns') && !hasCols) {
      if (lc.match(/grid-template-columns\s*:\s*1fr\s*1fr\s*[^1]/))
        e.push('Logical Error: You defined only 2 columns. The task requires 3 equal columns: `1fr 1fr 1fr`.');
      else if (lc.includes('33%') || lc.includes('33.33%'))
        e.push('Concept Misunderstanding: Use `1fr` units instead of percentages. `1fr 1fr 1fr` means 3 equal fractions.');
      else
        e.push('Logical Error: `grid-template-columns` must be `1fr 1fr 1fr` (three equal columns).');
    }
    return e;
  },

  css_3_2(code) {
    const e: string[] = [];
    const lc = code.toLowerCase();

    const hasMedia  = lc.includes('@media');
    const has600    = lc.includes('max-width: 600px') || lc.includes('max-width:600px');
    const has1fr    = lc.match(/@media[^{]*\{[^}]*\.grid[^}]*1fr[^}]*/);

    if (hasMedia && has600 && has1fr) return [];

    if (!hasMedia) e.push('Missing `@media` query block. This is needed to apply styles based on screen width.');
    if (hasMedia && !has600) {
      if (lc.includes('min-width'))
        e.push('Logical Error: You used `min-width` — that targets LARGE screens. Use `max-width: 600px` to target small screens.');
      else if (lc.includes('max-width') && !lc.includes('600px'))
        e.push('Logical Error: The breakpoint must be `600px`. Change to `@media (max-width: 600px)`.');
      else
        e.push('Logical Error: Media query condition must be `(max-width: 600px)`. The breakpoint targets screens 600px wide or less.');
    }
    if (hasMedia && has600 && !has1fr)
      e.push('Missing `grid-template-columns: 1fr;` inside the media query. Without it, the grid won\'t collapse on small screens.');
    if (hasMedia && lc.includes('max-width: 600px') && !lc.includes('{') )
      e.push('Syntax Pitfall: Your media query is missing curly braces. Structure: `@media (max-width: 600px) { .grid { ... } }`');
    return e;
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LESSON: JavaScript Fundamentals
  // ══════════════════════════════════════════════════════════════════════════

  js_1_1(code) {
    const e: string[] = [];

    if ((code.includes('let friend') || code.includes('let  friend')) &&
        (code.includes('"Alex"') || code.includes("'Alex'"))) return [];

    if (!code.includes('let ') && !code.includes('const ') && !code.includes('var ')) {
      e.push('Syntax Pitfall: You must declare the variable using a keyword. Use `let friend = "Alex";`');
    }
    if (code.includes('const ') && !code.includes('let '))
      e.push('Logical Error: Use `let` to declare the variable, not `const`. The task specifically asks for `let`.');
    if (code.includes('var '))
      e.push('Concept Misunderstanding: `var` is an older style. Use modern `let` instead.');
    if (code.includes('let') && !code.match(/let\s+friend/))
      e.push('Logical Error: The variable must be named exactly `friend`. Check your spelling.');
    if (!code.includes('='))
      e.push('Syntax Pitfall: Missing the assignment operator `=`. Use `let friend = "Alex";`');
    if (code.match(/let\s+friend\s*=\s*Alex/) && !code.match(/["']Alex["']/))
      e.push('Concept Misunderstanding: `Alex` without quotes is treated as an undefined variable. Add quotes: `"Alex"`.');
    if (!code.match(/["']Alex["']/))
      e.push('Logical Error: The value must be the string `"Alex"` (with quotes). Make sure the spelling and quotes are correct.');
    return e;
  },

  js_1_2(code) {
    const e: string[] = [];

    const hasFunc     = code.match(/function\s+greetUser\s*\(\s*name\s*\)/);
    const hasReturn   = code.includes('return');
    const hasTemplate = code.match(/[`"']Hello,\s*\$\{name\}![`"']/) ||
                        code.match(/[`"']Hello,\s*"\s*\+\s*name/) ||
                        code.match(/"Hello, "\s*\+\s*name\s*\+\s*"!"/) ||
                        code.match(/`Hello, \$\{name\}!`/);

    if (hasFunc && hasReturn && (hasTemplate || code.match(/"Hello, " \+ name \+ "!"/))) return [];

    if (!code.match(/function\s+greetUser/)) {
      if (code.match(/const\s+greetUser\s*=\s*\(/))
        e.push('Concept Misunderstanding: You used an arrow function. The task requires a regular `function greetUser(name) { ... }` declaration.');
      else
        e.push('Missing function declaration. Start with `function greetUser(name) {`.');
    }
    if (code.match(/function\s+greetUser/) && !code.match(/\(\s*name\s*\)/))
      e.push('Logical Error: The function must accept a parameter named exactly `name`. Write `greetUser(name)`.');
    if (!hasReturn) {
      if (code.includes('console.log'))
        e.push('Concept Misunderstanding: `console.log` prints to the terminal but doesn\'t return a value. Use `return "Hello, " + name + "!";`');
      else
        e.push('Concept Misunderstanding: Missing `return` keyword. The function must `return` its result.');
    }
    if (hasReturn && code.match(/return\s+["'`]Hello,\s*name!/))
      e.push('Logical Error: You hardcoded the word "name" as text. Use the variable: `return "Hello, " + name + "!";`');
    if (hasReturn && !code.match(/Hello,\s*("|'|\$\{)/))
      e.push('Logical Error: Return value must follow the format "Hello, [name]!". Check your string concatenation.');
    return e;
  },

  js_1_3(code) {
    const e: string[] = [];

    const hasArray   = code.match(/const\s+fruits\s*=\s*\[/);
    const has3Items  = (code.match(/,/g) || []).length >= 2;
    const hasLog     = code.includes('console.log');
    const hasIndex0  = code.includes('fruits[0]');

    if (hasArray && has3Items && hasLog && hasIndex0) return [];

    if (!code.match(/const\s+fruits/)) {
      if (code.match(/let\s+fruits/))
        e.push('Logical Error: Use `const` for arrays that won\'t be reassigned. Change `let` to `const`.');
      else
        e.push('Missing array declaration. Create `const fruits = [...]` with 3 items.');
    }
    if (!code.match(/\[/))
      e.push('Syntax Pitfall: Arrays use square brackets `[...]`, not curly braces or parentheses.');
    if (code.match(/\[/) && !has3Items)
      e.push('Logical Error: Your array needs at least 3 items separated by commas. Example: `["Apple", "Banana", "Cherry"]`.');
    if (!hasLog)
      e.push('Missing `console.log(fruits[0])` to print the first element.');
    if (hasLog && !hasIndex0) {
      if (code.includes('fruits[1]'))
        e.push('Logical Error: `fruits[1]` is the SECOND item (index starts at 0). Use `fruits[0]` for the first item.');
      else
        e.push('Logical Error: Use `fruits[0]` to access the first item. Arrays start at index 0, not 1.');
    }
    if (code.includes('fruits.0') || code.includes('fruits.(0)'))
      e.push('Syntax Pitfall: To access an array element, use square brackets: `fruits[0]`, not `fruits.0`.');
    return e;
  },

  js_1_4(code) {
    const e: string[] = [];

    const hasObj  = code.match(/const\s+person\s*=\s*\{/);
    const hasName = code.includes('name:') || code.includes("name :");
    const hasAge  = code.includes('age:')  || code.includes("age :");
    const hasJob  = code.includes('job:')  || code.includes("job :");
    const hasLog  = code.includes('console.log') && code.includes('person.name');

    if (hasObj && hasName && hasAge && hasJob && hasLog) return [];

    if (!hasObj) {
      if (code.match(/let\s+person/))
        e.push('Logical Error: Use `const` for objects. Change `let` to `const`.');
      else if (!code.includes('{'))
        e.push('Missing object literal. Use curly braces: `const person = { ... }`.');
      else
        e.push('Missing `const person = {`. Start your object declaration correctly.');
    }
    if (hasObj && !hasName) e.push('Missing `name:` property in the person object. Add `name: "Alex",` (or any name).');
    if (hasObj && !hasAge)  e.push('Missing `age:` property in the person object. Add `age: 25,`.');
    if (hasObj && !hasJob)  e.push('Missing `job:` property in the person object. Add `job: "Developer"` (or any job).');
    if (hasObj && hasName && hasAge && hasJob) {
      // Check for missing commas
      if (!code.match(/name\s*:.*,/) || !code.match(/age\s*:.*,/))
        e.push('Syntax Pitfall: Properties must be separated by commas. Make sure there\'s a comma after each property except the last.');
    }
    if (!hasLog) {
      e.push('Missing `console.log(person.name)` to print the name from the object.');
    }
    if (code.includes('person["name"]')) {
      // bracket notation is fine, but let's see if they log it
    }
    if (code.includes('console.log') && !code.includes('person.name') && !code.includes('person["name"]'))
      e.push('Logical Error: Log `person.name` to access the name property. Use dot notation: `console.log(person.name)`.');
    return e;
  },

  js_1_5(code) {
    const e: string[] = [];

    const hasFor      = code.includes('for');
    const hasLet      = code.match(/for\s*\(\s*let\s+i/);
    const startsAt1   = code.match(/let\s+i\s*=\s*1/);
    const endsAt5     = code.match(/i\s*<=\s*5/);
    const hasIncr     = code.includes('i++');
    const hasLog      = code.includes('console.log');

    if (hasFor && hasLet && startsAt1 && endsAt5 && hasIncr && hasLog) return [];

    if (!hasFor)
      e.push('Missing `for` loop. Start with `for (let i = 1; i <= 5; i++) {`.');
    if (hasFor && !hasLet) {
      if (code.match(/for\s*\(\s*i\s*=/))
        e.push('Syntax Pitfall: Missing `let` in the loop initializer. Write `for (let i = 1; ...)`.');
      else if (code.match(/for\s*\(\s*var\s+i/))
        e.push('Concept Misunderstanding: Use `let` instead of `var` in modern JavaScript.');
    }
    if (hasFor && !startsAt1) {
      if (code.match(/let\s+i\s*=\s*0/))
        e.push('Logical Error: The loop must start at 1, not 0. Change to `let i = 1`.');
      else
        e.push('Logical Error: The loop counter must start at exactly 1. Change the initializer.');
    }
    if (hasFor && !endsAt5) {
      if (code.match(/i\s*<\s*5/))
        e.push('Logical Error: `i < 5` stops at 4. Use `i <= 5` to include 5 in the output.');
      else if (code.match(/i\s*<=\s*4/))
        e.push('Logical Error: `i <= 4` stops at 4. Change to `i <= 5`.');
      else if (code.match(/i\s*<\s*6/))
        e.push('Logical Error: `i < 6` also works, but the conventional and clearer form is `i <= 5`.');
      else
        e.push('Logical Error: The stopping condition must be `i <= 5`.');
    }
    if (hasFor && !hasIncr) {
      if (code.includes('i--'))
        e.push('Logical Error: `i--` decrements (counts down). Use `i++` to count up.');
      else if (code.includes('i += 2'))
        e.push('Logical Error: `i += 2` skips every other number. Use `i++` to count by 1.');
      else
        e.push('Logical Error: Missing `i++` incrementer. Without it, `i` never changes and you\'ll get an infinite loop!');
    }
    if (!hasLog)
      e.push('Missing `console.log(i)` inside the loop body to print each number.');
    if (hasLog && !code.includes('console.log(i)'))
      e.push('Logical Error: Use `console.log(i)` to print the loop counter. You might be logging something else.');
    return e;
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ARENA CHALLENGES
  // ══════════════════════════════════════════════════════════════════════════

  'fix-the-counter'(code) {
    const e: string[] = [];

    if ((code.includes('count + 1') || code.includes('count+1') || code.includes('count+= 1')) &&
        !code.includes('count + 10')) return [];

    if (code.includes('count + 10'))
      e.push('Logical Error: Still adding 10 instead of 1. Change `count + 10` to `count + 1`.');
    if (!code.includes('count + 1') && !code.includes('count+1')) {
      if (code.includes('setCount(1)'))
        e.push('Logical Error: `setCount(1)` always resets the count to 1. Use `setCount(count + 1)` to increment from the current value.');
      else if (code.includes('count++'))
        e.push('Concept Misunderstanding: `count++` modifies the variable directly but `setCount` expects a value. Use `setCount(count + 1)`.');
      else
        e.push('Logical Error: The counter must increment by exactly 1. Use `setCount(count + 1)`.');
    }
    return e;
  },

  'array-compressor'(code) {
    const e: string[] = [];

    const hasFunc   = code.match(/function\s+compress/);
    const hasFilter = code.includes('.filter(');
    const hasSort   = code.includes('.sort(');
    const hasReturn = code.includes('return');
    const filtersOdd = code.includes('% 2 !== 0') || code.includes('%2!==0') || code.includes('% 2 != 0');

    if (hasFunc && hasFilter && hasSort && hasReturn && filtersOdd) return [];

    if (!hasFunc) e.push('Missing function `compress`. Start with `function compress(arr) {`.');
    if (!hasReturn) e.push('Concept Misunderstanding: Missing `return` statement. The function must return the result array.');
    if (!hasFilter) {
      if (code.includes('for ') || code.includes('for('))
        e.push('Concept Misunderstanding: A `for` loop works but the task expects using `.filter()` for cleaner code.');
      else
        e.push('Concept Misunderstanding: Use `.filter()` to keep only odd numbers from the array.');
    }
    if (hasFilter && (code.includes('% 2 === 0') || code.includes('%2===0') || code.includes('% 2 == 0')))
      e.push('Logical Error: `% 2 === 0` keeps EVEN numbers. Use `% 2 !== 0` to keep ODD numbers instead.');
    if (!hasSort) e.push('Missing `.sort()` call. After filtering, sort the result in ascending order: `.sort((a, b) => a - b)`.');
    if (hasSort && !code.includes('a - b') && !code.includes('a-b'))
      e.push('Logical Error: `.sort()` without a comparator sorts alphabetically (10 comes before 9). Use `.sort((a, b) => a - b)` for numeric sort.');
    if (!code.includes('Set') && !code.includes('filter') && !code.includes('includes') && !code.includes('indexOf'))
      e.push('Concept Misunderstanding: The array has duplicate values. You need to remove duplicates (use `Set`, or `.filter()` with `.indexOf()`).');
    return e;
  },

  'auth-logic-101'(code) {
    const e: string[] = [];

    const hasFunc     = code.match(/function\s+authorize/);
    const hasVerified = code.includes('is_verified');
    const hasAdmin    = code.includes('admin');
    const hasRole     = code.includes('role') || code.includes('requiredRole');
    const hasReturn   = code.includes('return true') || code.includes('return false');

    if (hasFunc && hasVerified && hasAdmin && hasRole && hasReturn) return [];

    if (!hasFunc) e.push('Missing function declaration. Start with `function authorize(user, requiredRole) {`.');
    if (!hasVerified)
      e.push('Logical Error: You must check `user.is_verified === true`. Without this check, unverified users could gain access.');
    if (!hasAdmin)
      e.push('Logical Error: Admin users should bypass role restrictions. Add a check: `user.role === "admin"`.');
    if (!hasRole)
      e.push('Logical Error: You must compare `user.role` against `requiredRole`. Add `user.role === requiredRole`.');
    if (!hasReturn) {
      if (!code.includes('return'))
        e.push('Concept Misunderstanding: The function must `return true` or `return false`. Add return statements.');
      else
        e.push('Logical Error: Make sure your function explicitly returns `true` for authorized and `false` for denied.');
    }
    if (code.includes('user.verified') && !code.includes('user.is_verified'))
      e.push('Logical Error: The field is `user.is_verified`, not `user.verified`. Check the exact property name.');
    return e;
  },

  'algorithm-duel'(code) {
    const e: string[] = [];

    const hasFunc    = code.match(/function\s+singleNonDuplicate/);
    const hasWhile   = code.includes('while') || code.includes('for');
    const hasMid     = code.includes('mid');
    const hasLeft    = code.includes('left');
    const hasReturn  = code.includes('return');

    if (hasFunc && hasWhile && hasMid && hasLeft && hasReturn) return [];

    if (!hasFunc) e.push('Missing `singleNonDuplicate` function declaration.');
    if (!hasWhile) e.push('Logical Error: O(log n) requires a binary search loop (`while`). A simple linear scan is O(n).');
    if (!hasMid)   e.push('Logical Error: Binary search requires a `mid` pointer to split the search space.');
    if (!hasLeft)  e.push('Logical Error: Missing `left` and `right` boundary pointers needed for binary search.');
    if (!hasReturn) e.push('Concept Misunderstanding: Missing `return` statement. The function must return the unique element.');
    if (code.includes('for') && !code.includes('while') && code.match(/for\s*\(\s*let\s+i\s*=\s*0/))
      e.push('Logical Error: A simple `for` loop is O(n) time. The task requires O(log n) binary search with `while (left < right)`.');
    return e;
  }
};

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export const validateExercise = (id: string, code: string, language: string) => {
  let errors: string[] = [];

  // 1. Universal language-level checks
  if (language === 'html') {
    errors = [...errors, ...htmlGlobal(code, id)];
  } else if (language === 'javascript') {
    errors = [...errors, ...jsGlobal(code)];
  } else if (language === 'css') {
    errors = [...errors, ...cssGlobal(code)];
  }

  // 2. Per-exercise predictive checks
  if (V[id]) {
    // Run the per-exercise validator first for an early correct-answer pass
    const specific = V[id](code);
    if (specific.length === 0) {
      // Zero specific errors AND zero global errors → accept
      if (errors.length === 0) {
        return {
          isCorrect: true,
          feedback: '### ✅ DIAGNOSTICS CLEAN\n\nSyntax and structural integrity verified. All checks passed.'
        };
      }
    }
    errors = [...errors, ...specific];
  }

  // Remove duplicates
  errors = [...new Set(errors)];

  if (errors.length > 0) {
    return {
      isCorrect: false,
      feedback: `### ❌ SYSTEM FAILURE DETECTED\n\nYour code did not pass the Validation Engine. Review the diagnostics below:\n\n${errors.map(e => `> **WARNING:** ${e}`).join('\n\n')}\n\n*Terminal Action:* Correct the highlighted anomalies and re-initiate sequence.`
    };
  }

  // No specific validator exists → fall through to AI verification
  return null;
};
