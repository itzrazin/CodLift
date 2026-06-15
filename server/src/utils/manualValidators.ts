/**
 * CodLift Manual Verification Library
 * Covers ALL lessons: HTML Basics, HTML Structure, CSS Styling, CSS Flexbox,
 * CSS Grid, JS Fundamentals, and all Pro Track lessons:
 * DOM Manipulation, Events & Forms, Async JS, Closures, Array Methods, OOP & Classes.
 * Predicts every plausible user error — but passes immediately on correct code.
 */

const FULL_DOC = new Set([
  'html_1_1',
  'dom_1_1', 'dom_1_2', 'dom_1_3',
  'events_1_1', 'events_1_2', 'events_1_3',
]);

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
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PRO TRACK — DOM MANIPULATION
  // ══════════════════════════════════════════════════════════════════════════

  dom_1_1(code) {
    const e: string[] = [];
    const lc = code.toLowerCase();

    const hasQuery   = code.includes('querySelector');
    const hasOutput  = code.includes("'#output'") || code.includes('"#output"');
    const hasText    = code.includes('textContent');
    const hasValue   = code.includes('DOM Selected!');

    if (hasQuery && hasOutput && hasText && hasValue) return [];

    if (!hasQuery) {
      if (code.includes('getElementById'))
        e.push('Logical Error: `getElementById` works but this exercise requires `querySelector`. Use `document.querySelector(\'#output\')`.');
      else if (code.includes('getElement'))
        e.push('Concept Misunderstanding: `getElementByClassName/TagName` returns a collection, not a single element. Use `document.querySelector(\'#output\')`.');
      else
        e.push('Missing `document.querySelector()`. Use it to select the `#output` element.');
    }
    if (hasQuery && !hasOutput) {
      if (code.includes("querySelector('output'") || code.includes('querySelector("output"'))
        e.push('Syntax Pitfall: Selecting by ID requires a `#` prefix. Use `\'#output\'` not `\'output\'`.');
      else if (code.includes("querySelector('.output'") || code.includes('querySelector(".output"'))
        e.push('Syntax Pitfall: `.output` selects by class. For an ID, use `#output` with a hash symbol.');
      else
        e.push('Logical Error: Target the correct element using `document.querySelector(\'#output\')`.');
    }
    if (!hasText) {
      if (code.includes('innerHTML'))
        e.push('Concept Misunderstanding: `innerHTML` works but exposes XSS risks. Prefer `textContent` for setting plain text.');
      else if (code.includes('innerText'))
        e.push('Concept Misunderstanding: `innerText` is similar but triggers layout reflow. Prefer `textContent` for this exercise.');
      else
        e.push('Missing `.textContent` assignment. Set `element.textContent = \'DOM Selected!\'` to update the text.');
    }
    if (hasText && !hasValue)
      e.push('Logical Error: The text must be exactly `"DOM Selected!"`. Check capitalization and punctuation.');
    return e;
  },

  dom_1_2(code) {
    const e: string[] = [];

    const hasQuery  = code.includes('querySelector');
    const hasBox    = code.includes("'#box'") || code.includes('"#box"');
    const hasBG     = code.includes('backgroundColor') || code.includes('background-color');
    const hasBGVal  = code.includes('crimson');
    const hasColor  = code.includes('.style.color');
    const hasColorV = code.includes('white');

    if (hasQuery && hasBox && hasBG && hasBGVal && hasColor && hasColorV) return [];

    if (!hasQuery)
      e.push('Missing `document.querySelector()`. Select the element with `document.querySelector(\'#box\')`.');
    if (hasQuery && !hasBox)
      e.push('Logical Error: Select the correct element: `document.querySelector(\'#box\')`.');
    if (!hasBG) {
      if (code.includes('background-color'))
        e.push('Syntax Pitfall: In JavaScript `style` object, use camelCase: `backgroundColor` not `background-color`. Hyphens are invalid property names.');
      else
        e.push('Missing `.style.backgroundColor` assignment. Set `element.style.backgroundColor = \'crimson\'`.');
    }
    if (hasBG && !hasBGVal)
      e.push('Logical Error: The background color value must be exactly `\'crimson\'`. Check the string value.');
    if (!hasColor)
      e.push('Missing `.style.color` assignment. Also set the text color: `element.style.color = \'white\'`.');
    if (hasColor && !hasColorV)
      e.push('Logical Error: The text color value must be exactly `\'white\'`.');
    if (code.includes('style.background-color'))
      e.push('Syntax Pitfall: `style.background-color` is a syntax error in JavaScript. Use camelCase: `style.backgroundColor`.');
    return e;
  },

  dom_1_3(code) {
    const e: string[] = [];

    const hasCreate    = code.includes('createElement');
    const hasPTag      = code.includes("createElement('p')") || code.includes('createElement("p")');
    const hasText      = code.includes('textContent');
    const hasTextVal   = code.includes('I was created by JS');
    const hasAppend    = code.includes('appendChild');
    const hasContainer = code.includes('#container') || code.includes('container');

    if (hasCreate && hasPTag && hasText && hasTextVal && hasAppend && hasContainer) return [];

    if (!hasCreate) {
      if (code.includes('innerHTML'))
        e.push('Concept Misunderstanding: `innerHTML` can work but the task requires `document.createElement(\'p\')` — the proper DOM method.');
      else
        e.push('Missing `document.createElement(\'p\')`. Create the element with this method first.');
    }
    if (hasCreate && !hasPTag)
      e.push('Logical Error: You must create a `<p>` element. Use `document.createElement(\'p\')`.');
    if (!hasText)
      e.push('Missing `.textContent` assignment. Set `element.textContent = \'I was created by JS\'` after creating it.');
    if (hasText && !hasTextVal)
      e.push('Logical Error: The textContent must be exactly `"I was created by JS"`. Check spelling and capitalization.');
    if (!hasAppend) {
      if (code.includes('prepend'))
        e.push('Logical Error: `prepend` inserts at the beginning. The task requires `appendChild` to add at the end.');
      else if (code.includes('innerHTML'))
        e.push('Concept Misunderstanding: You cannot `appendChild` an HTML string. Create a real element with `createElement` then use `appendChild`.');
      else
        e.push('Missing `appendChild()`. After creating the element, attach it to the page: `container.appendChild(p)`.');
    }
    if (hasCreate && hasAppend && !hasContainer)
      e.push('Logical Error: Append the new element to `#container`. Use `document.querySelector(\'#container\').appendChild(p)`.');
    if (hasCreate && !hasAppend && hasContainer)
      e.push('Logical Error: You selected the container but forgot to call `appendChild()`. The element is only in memory — not on the page yet!');
    return e;
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PRO TRACK — EVENTS & FORMS
  // ══════════════════════════════════════════════════════════════════════════

  events_1_1(code) {
    const e: string[] = [];

    const hasListener = code.includes('addEventListener');
    const hasClick    = code.includes("'click'") || code.includes('"click"');
    const hasBtn      = code.includes("'#myBtn'") || code.includes('"#myBtn"');
    const hasResult   = code.includes("'#result'") || code.includes('"#result"');
    const hasText     = code.includes('textContent');
    const hasValue    = code.includes('Button clicked!');

    if (hasListener && hasClick && hasBtn && hasResult && hasText && hasValue) return [];

    if (!hasListener) {
      if (code.includes('.onclick'))
        e.push('Concept Misunderstanding: `element.onclick = fn` is older style. Use `addEventListener(\'click\', fn)` — it supports multiple listeners and is the professional approach.');
      else
        e.push('Missing `addEventListener`. Attach the event listener: `btn.addEventListener(\'click\', function() { ... })`.');
    }
    if (!hasClick) {
      if (code.includes('"click"') || code.includes("'click'"))  {
        // already present
      } else if (code.includes('mouse') || code.includes('hover'))
        e.push('Logical Error: Use the event type `\'click\'` not `\'mouseover\'` or `\'hover\'`.');
      else if (hasListener)
        e.push('Missing event type `\'click\'`. First argument to `addEventListener` must be the event name as a string: `\'click\'`.');
    }
    if (!hasBtn)
      e.push('Logical Error: Select the correct button: `document.querySelector(\'#myBtn\')`.');
    if (!hasResult)
      e.push('Logical Error: Inside the callback, target `#result`: `document.querySelector(\'#result\').textContent = \'Button clicked!\'`.');
    if (!hasText)
      e.push('Missing `.textContent` assignment. Set the text: `element.textContent = \'Button clicked!\'`.');
    if (hasText && !hasValue)
      e.push('Logical Error: The text must be exactly `"Button clicked!"` with correct capitalization and punctuation.');
    if (code.match(/addEventListener\s*\(\s*['"]click['"]\s*,\s*\w+\s*\(\s*\)/))
      e.push('Syntax Pitfall: You called the function with `()` inside `addEventListener`. Remove the parentheses — pass the function reference, not its return value.');
    return e;
  },

  events_1_2(code) {
    const e: string[] = [];

    const hasListener  = code.includes('addEventListener');
    const hasClick     = code.includes("'click'") || code.includes('"click"');
    const hasInput     = code.includes('nameInput') || code.includes("'#nameInput'") || code.includes('"#nameInput"');
    const hasValue     = code.includes('.value');
    const hasOutput    = code.includes('output');
    const hasText      = code.includes('textContent');
    const hasHello     = code.includes('Hello,') || code.includes("'Hello, '") || code.includes('"Hello, "');

    if (hasListener && hasClick && hasInput && hasValue && hasOutput && hasText && hasHello) return [];

    if (!hasListener)
      e.push('Missing `addEventListener`. Add: `document.querySelector(\'#submitBtn\').addEventListener(\'click\', function() { ... })`.');
    if (!hasInput)
      e.push('Missing reference to `#nameInput`. Select it with `document.querySelector(\'#nameInput\')`.');
    if (!hasValue) {
      if (code.includes('innerHTML') && code.includes('input'))
        e.push('Concept Misunderstanding: To read what the user typed, use `.value` not `.innerHTML`. Input elements store their text in `.value`.');
      else
        e.push('Missing `.value` property. Read user input with `document.querySelector(\'#nameInput\').value`.');
    }
    if (hasValue && !code.match(/\.value\s*(?!\s*=)/))
      e.push('Logical Error: You might be assigning to `.value` instead of reading from it. Assign to `textContent` of `#output` instead.');
    if (!hasOutput)
      e.push('Missing reference to `#output`. Set its text: `document.querySelector(\'#output\').textContent = \'Hello, \' + val + \'!\'`.');
    if (!hasHello)
      e.push('Logical Error: The output must start with `"Hello, "`. Format: `\'Hello, \' + val + \'!\'`.');
    if (hasValue && !hasListener)
      e.push('Logical Error: You read `.value` outside an event handler. Move the code inside the `click` callback so it runs AFTER the user types.');
    return e;
  },

  events_1_3(code) {
    const e: string[] = [];

    const hasListener  = code.includes('addEventListener');
    const hasList      = code.includes("'#list'") || code.includes('"#list"');
    const hasEvent     = code.match(/function\s*\(\s*event\s*\)/) || code.match(/\(\s*e\s*\)\s*=>/) || code.match(/\(\s*event\s*\)\s*=>/);
    const hasTarget    = code.includes('event.target') || code.includes('e.target');
    const hasTagName   = code.includes('tagName');
    const hasLI        = code.includes("'LI'") || code.includes('"LI"');
    const hasFontBold  = code.includes('fontWeight') && (code.includes('bold') || code.includes("'bold'"));

    if (hasListener && hasList && hasEvent && hasTarget && hasTagName && hasLI && hasFontBold) return [];

    if (!hasListener)
      e.push('Missing `addEventListener`. Attach a single listener to `#list`: `document.querySelector(\'#list\').addEventListener(\'click\', function(event) { ... })`.');
    if (!hasList)
      e.push('Logical Error: The listener must be on `#list` (the parent), not on individual `<li>` elements. Use `document.querySelector(\'#list\')`.');
    if (hasListener && !hasEvent)
      e.push('Missing event parameter. Your callback needs to accept the event object: `function(event) { ... }`.');
    if (!hasTarget)
      e.push('Missing `event.target`. Use it to find what was actually clicked: `if (event.target.tagName === \'LI\')`.');
    if (!hasTagName)
      e.push('Missing `.tagName` check. Before reacting, verify the clicked element is an `<li>`: `event.target.tagName === \'LI\'`.');
    if (hasTagName && !hasLI) {
      if (code.includes("'li'") || code.includes('"li"'))
        e.push('Logical Error: `tagName` returns UPPERCASE strings in HTML. Use `\'LI\'` not `\'li\'`.');
      else
        e.push('Logical Error: Compare against `\'LI\'` (uppercase) — `tagName` always returns uppercase in HTML.');
    }
    if (!hasFontBold) {
      if (code.includes('fontWeight') && !code.includes('bold'))
        e.push('Logical Error: Set `fontWeight` to the string `\'bold\'`: `event.target.style.fontWeight = \'bold\'`.');
      else
        e.push('Missing `fontWeight` assignment. Set `event.target.style.fontWeight = \'bold\'` inside the `if` block.');
    }
    return e;
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PRO TRACK — ASYNC JAVASCRIPT
  // ══════════════════════════════════════════════════════════════════════════

  async_1_1(code) {
    const e: string[] = [];

    const hasTimeout  = code.includes('setTimeout');
    const has1000     = code.includes('1000');
    const hasCallback = code.match(/setTimeout\s*\(\s*function/)  || code.match(/setTimeout\s*\(\s*\(/);
    const hasText     = code.includes('textContent');
    const hasLoaded   = code.includes('Loaded!');

    if (hasTimeout && has1000 && hasCallback && hasText && hasLoaded) return [];

    if (!hasTimeout)
      e.push('Missing `setTimeout`. Start with `setTimeout(function() { ... }, 1000)`.');
    if (hasTimeout && !has1000) {
      if (code.includes('1') && code.match(/setTimeout\s*\([^)]+,\s*[0-9]+/))
        e.push('Logical Error: The delay must be exactly `1000` milliseconds (1 second).');
      else
        e.push('Logical Error: Specify the delay as `1000` (milliseconds) as the second argument: `setTimeout(fn, 1000)`.');
    }
    if (hasTimeout && code.match(/setTimeout\s*\(\s*\w+\s*\(\s*\)/))
      e.push('Syntax Pitfall: You passed a function call (with `()`) to `setTimeout`. This runs the function immediately! Pass the reference without parentheses, or wrap in `function() { ... }`.');
    if (!hasCallback && hasTimeout)
      e.push('Missing callback function inside `setTimeout`. The first argument must be a function: `setTimeout(function() { ... }, 1000)`.');
    if (!hasText)
      e.push('Missing `.textContent` assignment inside the callback. Set `document.querySelector(\'#message\').textContent = \'Loaded!\'`.');
    if (hasText && !hasLoaded)
      e.push('Logical Error: The text must be exactly `"Loaded!"` with the exclamation mark.');
    return e;
  },

  async_1_2(code) {
    const e: string[] = [];

    const hasFetchCall = code.match(/fetchData\s*\(\s*\)/);
    const hasThen      = code.includes('.then(');
    const hasCatch     = code.includes('.catch(');
    const hasDataMsg   = code.includes('data.message');
    const hasLog       = code.includes('console.log') || code.includes('console.error');

    if (hasFetchCall && hasThen && hasCatch && hasDataMsg && hasLog) return [];

    if (!hasFetchCall)
      e.push('Missing `fetchData()` call. Call the function and chain `.then()` and `.catch()` onto it.');
    if (!hasThen) {
      if (code.includes('async') && code.includes('await'))
        e.push('Concept Misunderstanding: This exercise requires Promise chaining with `.then()` and `.catch()`, not `async/await`. Save `async/await` for the next exercise!');
      else
        e.push('Missing `.then()`. Chain it onto `fetchData()`: `fetchData().then(function(data) { ... })`.');
    }
    if (!hasCatch)
      e.push('Missing `.catch()`. Always handle errors: chain `.catch(function(error) { ... })` at the end.');
    if (hasThen && !hasDataMsg)
      e.push('Logical Error: Inside `.then()`, log `data.message` not just `data`. The response object has a `message` property.');
    if (hasThen && code.match(/\.then\s*\(\s*function\s*\([^)]*\)\s*\{[^}]*(?!return)[^}]*\}/))
      e.push('Concept Misunderstanding: If your `.then()` callback needs to pass data to the next `.then()`, remember to `return` the value inside the callback.');
    return e;
  },

  async_1_3(code) {
    const e: string[] = [];

    const hasAsync    = code.includes('async function');
    const hasGetData  = code.match(/async\s+function\s+getData/);
    const hasAwait    = code.includes('await');
    const hasTryCatch = code.includes('try') && code.includes('catch');
    const hasLog      = code.includes('console.log') && code.includes('user.name');
    const hasCatchLog = code.includes('console.error') || (code.includes('catch') && code.includes('console.log'));
    const hasCall     = code.match(/getData\s*\(\s*\)/);

    if (hasGetData && hasAwait && hasTryCatch && hasLog && hasCatchLog) return [];

    if (!hasAsync)
      e.push('Missing `async` keyword. Declare the function with: `async function getData() { ... }`.');
    if (hasAsync && !hasGetData)
      e.push('Logical Error: The function must be named exactly `getData`. Check the function name.');
    if (!hasAwait) {
      if (code.includes('.then('))
        e.push('Concept Misunderstanding: Use `await` instead of `.then()` for this exercise. The `async/await` pattern is cleaner for sequential async operations.');
      else
        e.push('Missing `await`. Pause execution until `fetchUser()` resolves: `const user = await fetchUser()`.');
    }
    if (hasAwait && !code.includes('async'))
      e.push('Syntax Pitfall: `await` can only be used inside an `async` function. Add `async` before `function getData()`.');
    if (!hasTryCatch) {
      if (code.includes('.catch('))
        e.push('Concept Misunderstanding: When using `async/await`, handle errors with `try { ... } catch(error) { ... }` instead of `.catch()`.');
      else
        e.push('Missing `try/catch` block. Wrap your `await` in `try { ... } catch(error) { ... }` to handle network errors.');
    }
    if (!hasLog)
      e.push('Missing `console.log(user.name)` inside the `try` block.');
    if (!hasCatchLog)
      e.push('Missing error logging in `catch`. Add `console.error(error.message)` inside the `catch` block.');
    if (!hasCall)
      e.push('Missing `getData()` call. After defining the function, call it: `getData();`.');
    return e;
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PRO TRACK — CLOSURES & SCOPE
  // ══════════════════════════════════════════════════════════════════════════

  closures_1_1(code) {
    const e: string[] = [];

    const hasConst    = code.match(/const\s+appName/);
    const hasCodLift  = code.includes('CodLift');
    const hasFunc     = code.match(/function\s+printApp/);
    const hasLog      = code.includes('console.log') && code.includes('appName');
    const hasCall     = code.match(/printApp\s*\(\s*\)/);

    if (hasConst && hasCodLift && hasFunc && hasLog && hasCall) return [];

    if (!hasConst) {
      if (code.match(/let\s+appName/))
        e.push('Logical Error: Use `const` for a value that never changes. Replace `let appName` with `const appName`.');
      else if (code.match(/var\s+appName/))
        e.push('Concept Misunderstanding: Use `const` not `var`. Modern JavaScript prefers `const`/`let`.');
      else
        e.push('Missing `const appName`. Declare it in the global scope: `const appName = \'CodLift\'`.');
    }
    if (!hasCodLift)
      e.push('Logical Error: The value of `appName` must be exactly `\'CodLift\'` (capital C, capital L, no spaces).');
    if (!hasFunc) {
      if (code.match(/const\s+printApp\s*=\s*/))
        e.push('Concept Misunderstanding: You used an arrow/expression function. The task requires a regular `function printApp() { ... }` declaration.');
      else
        e.push('Missing `function printApp() { ... }` declaration.');
    }
    if (hasFunc && !hasLog)
      e.push('Missing `console.log(appName)` inside `printApp`. The function must log the `appName` variable.');
    if (hasLog && !code.includes('appName') && code.includes('console.log(\'CodLift\')'))
      e.push('Logical Error: Log the variable `appName`, not the literal string `\'CodLift\'`. The whole point is to access the outer scope variable.');
    if (!hasCall)
      e.push('Missing `printApp()` call. After defining the function, call it to execute it.');
    if (hasFunc && code.match(/function\s+printApp[^{]+\{[^}]*const\s+appName/))
      e.push('Concept Misunderstanding: `const appName` is declared INSIDE `printApp`. It must be in the OUTER (global) scope so the function accesses it via the scope chain.');
    return e;
  },

  closures_1_2(code) {
    const e: string[] = [];

    const hasFunc      = code.match(/function\s+makeMultiplier\s*\(\s*factor\s*\)/);
    const hasInnerFunc = code.match(/return\s+function/);
    const hasNumber    = code.match(/function\s*\(\s*number\s*\)/);
    const hasMultiply  = code.includes('number * factor') || code.includes('factor * number');
    const hasDouble    = code.match(/const\s+double\s*=\s*makeMultiplier\s*\(\s*2\s*\)/);
    const hasLog       = code.includes('console.log') && code.includes('double(5)');

    if (hasFunc && hasInnerFunc && hasNumber && hasMultiply && hasDouble && hasLog) return [];

    if (!hasFunc) {
      if (code.match(/function\s+makeMultiplier\s*\(/))
        e.push('Logical Error: The outer function must accept exactly one parameter named `factor`. Check: `function makeMultiplier(factor)`.');
      else
        e.push('Missing outer function `makeMultiplier`. Start with `function makeMultiplier(factor) { ... }`.');
    }
    if (hasFunc && !hasInnerFunc) {
      if (code.match(/const\s+\w+\s*=\s*\(\s*number\s*\)\s*=>/))
        e.push('Concept Misunderstanding: You used an arrow function expression. Try using `return function(number) { ... }` instead — it works the same way and is easier to read.');
      else
        e.push('Missing `return function(number) { ... }` inside `makeMultiplier`. The outer function must return the inner function.');
    }
    if (hasInnerFunc && !hasNumber)
      e.push('Logical Error: The returned inner function must accept a parameter named `number`: `return function(number) { ... }`.');
    if (!hasMultiply) {
      if (code.includes('number + factor') || code.includes('number - factor'))
        e.push('Logical Error: The inner function must MULTIPLY `number` by `factor`: `return number * factor`.');
      else if (hasInnerFunc)
        e.push('Missing multiplication. Inside the returned function, `return number * factor`.');
    }
    if (!hasDouble)
      e.push('Missing `const double = makeMultiplier(2)`. Create the specialized double function by calling `makeMultiplier(2)`.');
    if (!hasLog)
      e.push('Missing `console.log(double(5))`. Call `double(5)` and log the result — it should print `10`.');
    if (hasFunc && code.match(/function\s+makeMultiplier[^{]+\{[^}]*return[^;]*\*[^}]*\}/) && !hasInnerFunc)
      e.push('Concept Misunderstanding: `makeMultiplier` must return a NEW FUNCTION, not directly return the multiplication result. The closure is the key pattern here.');
    return e;
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PRO TRACK — ARRAY METHODS
  // ══════════════════════════════════════════════════════════════════════════

  arr_1_1(code) {
    const e: string[] = [];

    const hasPrices     = code.includes('prices');
    const hasMap        = code.includes('.map(');
    const hasDiscounted = code.match(/const\s+discounted\s*=/);
    const hasCallback   = code.match(/\.map\s*\(\s*(function|\()/);
    const hasReturn     = code.match(/\.map\s*\([^)]*function[^{]*\{[^}]*return/) || code.match(/\.map\s*\([^)]*=>/);
    const has09         = code.includes('0.9') || code.includes('* 0.9') || code.includes('* .9');
    const hasLog        = code.includes('console.log') && code.includes('discounted');

    if (hasPrices && hasMap && hasDiscounted && hasReturn && has09 && hasLog) return [];

    if (!hasMap) {
      if (code.includes('forEach'))
        e.push('Concept Misunderstanding: `.forEach()` iterates but does NOT return a new array. Use `.map()` which creates and returns the transformed array.');
      else if (code.includes('for '))
        e.push('Concept Misunderstanding: A `for` loop works, but this exercise requires `.map()` — the functional, modern approach.');
      else
        e.push('Missing `.map()`. Apply it to the `prices` array: `prices.map(function(price) { ... })`.');
    }
    if (!hasDiscounted)
      e.push('Missing `const discounted =`. Store the result of `.map()` in a variable named `discounted`.');
    if (hasMap && !hasReturn) {
      if (code.match(/\.map\s*\(\s*function[^{]*\{(?!.*return)/s))
        e.push('Logical Error: Missing `return` inside the `.map()` callback! Without it, every item becomes `undefined`. Add `return price * 0.9`.');
    }
    if (!has09) {
      if (code.includes('0.1') || code.includes('- 10'))
        e.push('Logical Error: To get 90% of the price (10% off), multiply by `0.9`, not `0.1` or subtract `10`.');
      else if (hasMap)
        e.push('Logical Error: The transformation must multiply each price by `0.9`: `return price * 0.9`.');
    }
    if (!hasLog)
      e.push('Missing `console.log(discounted)` to display the result.');
    return e;
  },

  arr_1_2(code) {
    const e: string[] = [];

    const hasWords     = code.includes('words');
    const hasFilter    = code.includes('.filter(');
    const hasLongWords = code.match(/const\s+longWords\s*=/);
    const hasLength    = code.includes('.length') && code.includes('> 4');
    const hasReturn    = code.match(/\.filter\s*\([^)]*function[^{]*\{[^}]*return/) || code.match(/\.filter\s*\([^)]*=>/);
    const hasLog       = code.includes('console.log') && code.includes('longWords');

    if (hasWords && hasFilter && hasLongWords && hasLength && hasReturn && hasLog) return [];

    if (!hasFilter) {
      if (code.includes('.map('))
        e.push('Concept Misunderstanding: `.map()` transforms items but keeps ALL of them. Use `.filter()` to keep ONLY the items that pass a test.');
      else if (code.includes('for '))
        e.push('Concept Misunderstanding: A `for` loop works but this exercise requires `.filter()` — the functional, modern approach.');
      else
        e.push('Missing `.filter()`. Apply it to the `words` array: `words.filter(function(word) { return word.length > 4; })`.');
    }
    if (!hasLongWords)
      e.push('Missing `const longWords =`. Store the filtered result in a variable named `longWords`.');
    if (hasFilter && !hasReturn) {
      if (code.match(/\.filter\s*\(\s*function[^{]*\{(?!.*return)/s))
        e.push('Logical Error: Missing `return` inside the `.filter()` callback! Without it, all items are kept (falsy return = discard, but `undefined` is falsy). Add `return word.length > 4`.');
    }
    if (!hasLength) {
      if (code.includes('.length') && code.includes('> 5'))
        e.push('Logical Error: The condition must be `word.length > 4` (greater than 4), not `> 5`.');
      else if (code.includes('.length') && code.includes('>= 5'))
        e.push('Logical Error: `>= 5` means 5 or more characters. The task requires strictly more than 4: `> 4`.');
      else if (hasFilter)
        e.push('Missing length check. The callback must test `word.length > 4`.');
    }
    if (!hasLog)
      e.push('Missing `console.log(longWords)` to display the result.');
    return e;
  },

  arr_1_3(code) {
    const e: string[] = [];

    const hasScores  = code.includes('scores');
    const hasReduce  = code.includes('.reduce(');
    const hasSum     = code.match(/const\s+sum\s*=/);
    const hasAcc     = code.match(/\.reduce\s*\(\s*(function|\()/) && (code.includes('total') || code.includes('acc') || code.includes('sum'));
    const hasReturn  = code.match(/\.reduce\s*\([^{]*\{[^}]*return/) || code.match(/\.reduce\s*\([^)]*=>/);
    const hasInitVal = code.match(/\.reduce\s*\([^)]+,\s*0\s*\)/);
    const hasLog     = code.includes('console.log') && code.includes('sum');

    if (hasScores && hasReduce && hasSum && hasReturn && hasInitVal && hasLog) return [];

    if (!hasReduce) {
      if (code.includes('.map(') || code.includes('.filter('))
        e.push('Concept Misunderstanding: `.map()` and `.filter()` return arrays. Use `.reduce()` to combine all array values into a SINGLE number.');
      else if (code.includes('for '))
        e.push('Concept Misunderstanding: A `for` loop works but this exercise requires `.reduce()` — the functional approach for accumulation.');
      else
        e.push('Missing `.reduce()`. Use it: `scores.reduce(function(total, score) { return total + score; }, 0)`.');
    }
    if (!hasSum)
      e.push('Missing `const sum =`. Store the result: `const sum = scores.reduce(...)`.');
    if (hasReduce && !hasReturn)
      e.push('Logical Error: Missing `return` in the `.reduce()` callback. Without it, `total` becomes `undefined` after the first iteration. Add `return total + score`.');
    if (hasReduce && !hasInitVal) {
      if (code.match(/\.reduce\s*\([^)]+\)/) && !code.includes(', 0)'))
        e.push('Logical Error: Missing initial value for the accumulator. Add `0` as the second argument: `.reduce(function(total, score) { ... }, 0)`.');
    }
    if (hasReduce && code.match(/\.reduce\s*\([^{]*\{[^}]*total\s*\*\s*score/))
      e.push('Logical Error: You multiplied `total * score` instead of adding. Use `return total + score` to sum the values.');
    if (!hasLog)
      e.push('Missing `console.log(sum)` to display the total.');
    return e;
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PRO TRACK — OOP & CLASSES
  // ══════════════════════════════════════════════════════════════════════════

  oop_1_1(code) {
    const e: string[] = [];

    const hasClass      = code.match(/class\s+Car/);
    const hasCtor       = code.match(/constructor\s*\(\s*brand\s*,\s*speed\s*\)/);
    const hasThisBrand  = code.includes('this.brand') && code.includes('this.speed');
    const hasDescribe   = code.match(/describe\s*\(\s*\)/);
    const hasReturn     = code.includes('return') && (code.includes('brand') || code.includes('this.brand'));
    const hasKmh        = code.includes('km/h');
    const hasNew        = code.match(/new\s+Car\s*\(/);
    const hasLog        = code.includes('console.log') && code.includes('describe()');

    if (hasClass && hasCtor && hasThisBrand && hasDescribe && hasReturn && hasKmh && hasNew && hasLog) return [];

    if (!hasClass) {
      if (code.match(/function\s+Car\s*\(/))
        e.push('Concept Misunderstanding: You used a constructor function. The task requires ES6 `class` syntax: `class Car { constructor(brand, speed) { ... } }`.');
      else
        e.push('Missing `class Car { ... }`. Define your class first.');
    }
    if (hasClass && !hasCtor) {
      if (code.match(/constructor\s*\(\s*brand\s*\)/))
        e.push('Logical Error: The constructor needs TWO parameters: `constructor(brand, speed)`.');
      else if (code.match(/constructor/))
        e.push('Logical Error: The constructor parameter names must be exactly `brand` and `speed`.');
      else
        e.push('Missing `constructor(brand, speed)` inside the `Car` class.');
    }
    if (hasClass && !hasThisBrand) {
      if (code.includes('brand') && !code.includes('this.brand'))
        e.push('Logical Error: Store the parameters on the instance using `this`: `this.brand = brand; this.speed = speed;`.');
    }
    if (!hasDescribe) {
      if (code.includes('describe'))
        e.push('Logical Error: The method must be named exactly `describe` with no typos, defined as `describe() { ... }` inside the class.');
      else
        e.push('Missing `describe()` method inside the `Car` class.');
    }
    if (hasDescribe && !hasReturn)
      e.push('Missing `return` in `describe()`. The method must return the string, not log it. Use `return this.brand + \' goes \' + this.speed + \'km/h\'`.');
    if (hasDescribe && hasReturn && !hasKmh)
      e.push('Logical Error: The returned string must include `"km/h"`. Format: `"[brand] goes [speed]km/h"`.');
    if (!hasNew) {
      if (code.includes('Car('))
        e.push('Syntax Pitfall: Missing `new` keyword. Use `new Car(\'Tesla\', 200)` to create an instance.');
    }
    if (!hasLog)
      e.push('Missing `console.log(myCar.describe())`. Call the method and log its result.');
    if (hasNew && code.match(/Car\s*\(\s*['"]Tesla['"]\s*\)/) && !code.match(/Car\s*\(\s*['"]Tesla['"]\s*,\s*200/))
      e.push('Logical Error: Pass both arguments when instantiating: `new Car(\'Tesla\', 200)`.');
    return e;
  },

  oop_1_2(code) {
    const e: string[] = [];

    const hasVehicle    = code.match(/class\s+Vehicle/);
    const hasVehicleCtr = code.match(/class\s+Vehicle[^{]*\{[\s\S]*?constructor\s*\(\s*type\s*\)/);
    const hasThisType   = code.includes('this.type');
    const hasDescribe   = code.match(/describe\s*\(\s*\)/);
    const hasTruck      = code.match(/class\s+Truck\s+extends\s+Vehicle/);
    const hasTruckCtr   = code.match(/class\s+Truck[^{]*\{[\s\S]*?constructor\s*\(\s*payload\s*\)/);
    const hasSuper      = code.includes('super(');
    const hasSuperTruck = code.includes("super('Truck')") || code.includes('super("Truck")');
    const hasPayload    = code.includes('this.payload');
    const hasInfo       = code.match(/info\s*\(\s*\)/);
    const hasNew        = code.match(/new\s+Truck\s*\(/);
    const hasLog        = code.includes('console.log') && code.includes('describe()') && code.includes('info()');

    if (hasVehicle && hasVehicleCtr && hasThisType && hasDescribe && hasTruck && hasTruckCtr && hasSuperTruck && hasPayload && hasInfo && hasNew && hasLog) return [];

    if (!hasVehicle)
      e.push('Missing `class Vehicle { ... }`. Define the parent class first.');
    if (hasVehicle && !hasVehicleCtr)
      e.push('Missing `constructor(type)` in the `Vehicle` class. Add it to store `this.type = type`.');
    if (hasVehicle && !hasThisType)
      e.push('Missing `this.type = type` inside `Vehicle`\'s constructor.');
    if (!hasDescribe)
      e.push('Missing `describe()` method in `Vehicle`. Add: `describe() { return \'Vehicle type: \' + this.type; }`.');
    if (!hasTruck) {
      if (code.match(/class\s+Truck/) && !code.match(/extends\s+Vehicle/))
        e.push('Missing `extends Vehicle`. The `Truck` class must inherit from `Vehicle`: `class Truck extends Vehicle`.');
      else
        e.push('Missing `class Truck extends Vehicle { ... }`.');
    }
    if (hasTruck && !hasTruckCtr)
      e.push('Missing `constructor(payload)` in `Truck`. Add it to call `super(\'Truck\')` and set `this.payload`.');
    if (!hasSuper) {
      if (hasTruck)
        e.push('Missing `super()` call inside `Truck\'s constructor. Call `super(\'Truck\')` before using `this`.');
    }
    if (hasSuper && !hasSuperTruck)
      e.push('Logical Error: Call `super(\'Truck\')` to initialize the parent `Vehicle` with the type `\'Truck\'`.');
    if (hasTruck && !hasPayload)
      e.push('Missing `this.payload = payload` inside `Truck`\'s constructor.');
    if (!hasInfo)
      e.push('Missing `info()` method in `Truck`. Add: `info() { return \'Truck with \' + this.payload + \'t payload\'; }`.');
    if (!hasNew)
      e.push('Missing `new Truck(5)` instantiation.');
    if (!hasLog)
      e.push('Missing `console.log` calls. Log both `t.describe()` and `t.info()`.');
    if (code.match(/class\s+Truck[^{]*\{[\s\S]*?constructor[^{]*\{[\s\S]*?this\.[^;]+;[\s\S]*?super/))
      e.push('Syntax Pitfall: Inside a subclass constructor, `super()` must be called BEFORE any `this.` assignments. Move `super(\'Truck\')` to the top of the constructor.');
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
