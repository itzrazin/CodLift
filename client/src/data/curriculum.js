export const clientCurriculum = [
  // ─── BEGINNER TRACK ───────────────────────────────────────────
  {
    id: 'html-basics',
    title: 'HTML Basics',
    level: 'beginner',
    language: 'html',
    description: 'Learn the foundational building blocks of every website through deep dives into HTML syntax and structure.',
    exercises: [
      {
        id: 'html_1_1',
        title: 'The Skeleton of the Web',
        instruction: `
### What is HTML?

HTML (HyperText Markup Language) provides the structural skeleton of every website. It tells the browser exactly how to arrange text, images, and other content on the screen. 

Without HTML, a website would just be a messy pile of words with no headers, buttons, or structure.

### The Logic of Tags

We build this structure using **tags**. A tag is like a pair of bookends wrapped around a piece of text to give it meaning.

For example, to make a big, bold title, we wrap text in a Heading tag.

### The Code

\`\`\`html
<h1>Hello CodLift</h1>
\`\`\`

### Breaking It Down

1. **\`<\`** and **\`>\`** — Angle brackets wrap the command
2. **\`h1\`** — The tag name (Heading 1 = the most important title)
3. **\`Hello CodLift\`** — The actual content the user sees
4. **\`</h1\`** — The **closing tag** with a forward slash (\`/\`) to tell the browser "stop making text big here"

### ⚠️ Common Mistake

Forgetting the \`/\` in the closing tag:
\`\`\`html
<h1>Welcome<h1>  <!-- ❌ WRONG: missing the slash -->
<h1>Welcome</h1> <!-- ✅ CORRECT -->
\`\`\`

**Your Task:**
Update the text inside the existing \`<h1>\` tag in the editor to exactly read: "Hello CodLift".`,
        task: 'Update the h1 tag text to exactly: Hello CodLift',
        initial_code: '<html>\n  <body>\n    <h1>Welcome</h1>\n  </body>\n</html>',
        test_cases: { 
          expected_output: 'Hello CodLift',
          solution: '<html>\n  <body>\n    <h1>Hello CodLift</h1>\n  </body>\n</html>',
          force_ai: true
        }
      },
      {
        id: 'html_1_2',
        title: 'Paragraphs & Text Blocks',
        instruction: `
### The Paragraph Tag

Websites consist mostly of text, but reading one giant "wall of text" is overwhelming. The **Paragraph tag (\`<p>\`)** breaks text into readable blocks.

When a browser sees a \`<p>\` tag, it automatically adds invisible spacing (margin) above and below the block, giving your text "room to breathe."

### The Code

\`\`\`html
<p>Learning to code is fun!</p>
\`\`\`

### Breaking It Down

1. **\`<p>\`** — The opening paragraph tag
2. **\`Learning to code is fun!\`** — The content of the paragraph
3. **\`</p>\`** — The closing paragraph tag (note the slash)

### ⚠️ Common Mistake

Do NOT put heading tags inside paragraph tags. A paragraph is meant for regular body text, while a heading is meant to be a title.

\`\`\`html
<!-- ❌ WRONG: Don't nest structural elements incorrectly -->
<p><h1>My Title</h1></p>

<!-- ✅ CORRECT: Keep them separate -->
<h1>My Title</h1>
<p>My paragraph text goes here.</p>
\`\`\`

**Your Task:**
Below the existing heading, add a new \`<p>\` tag and set its text content to exactly: "Learning to code is fun!".`,
        task: 'Add a <p> tag with the text exactly: Learning to code is fun!',
        initial_code: '<h1>CodLift</h1>\n<!-- Add your paragraph below this line -->',
        test_cases: { 
          expected_output: 'Learning to code is fun!',
          solution: '<h1>CodLift</h1>\n<p>Learning to code is fun!</p>',
          force_ai: true
        }
      },
      {
        id: 'html_1_3',
        title: 'Hyperlinks & Global Connectivity',
        instruction: `
### What is a Hyperlink?

A hyperlink (or "link") allows users to jump from one web page to another. To create links in HTML, we use the **Anchor tag (\`<a>\`)**.

A link requires two pieces of information:
1. The **text** the user will click on
2. The **destination address** (URL) the browser will go to

### Using Attributes

To tell the anchor tag where to go, we use an **Attribute** called \`href\` (Hypertext Reference). Attributes provide extra information to a tag.

### The Code

\`\`\`html
<a href="https://codlift.site">Visit CodLift</a>
\`\`\`

### Breaking It Down

1. **\`<a \`** — The opening anchor tag
2. **\`href="https://codlift.site"\`** — The attribute defining the destination URL
3. **\`>\`** — Closes the opening tag
4. **\`Visit CodLift\`** — The clickable text displayed to the user
5. **\`</a>\`** — The closing anchor tag

### ⚠️ Common Mistake

Always include \`https://\` at the beginning of your external links. If you just write \`href="www.google.com"\`, the browser will look for a file named "www.google.com" on your *own* website instead of going to the actual internet.

**Your Task:**
Create a new anchor tag that says "Visit CodLift". You must set the href attribute to point to the exact URL "https://codlift.site".`,
        task: 'Add a hyperlink pointing to https://codlift.site with the text "Visit CodLift".',
        initial_code: '<p>Check out our site:</p>\n<!-- Add link here -->',
        test_cases: { 
          expected_output: 'https://codlift.site',
          solution: '<p>Check out our site:</p>\n<a href="https://codlift.site">Visit CodLift</a>',
          force_ai: true
        }
      },
    ]
  },
  {
    id: 'html-structure',
    title: 'HTML Structure & Semantics',
    level: 'beginner',
    language: 'html',
    description: 'Build accessible, structured web pages using semantic HTML5 elements that search engines and screen readers understand.',
    exercises: [
      {
        id: 'html_2_1',
        title: 'Semantic Layout',
        instruction: `
### Semantic HTML

"Semantic" means "meaningful." Early websites used generic tags (\`<div>\`) for everything, making it impossible for browsers or screen readers to know which part was the menu, the main content, or the footer. 

Semantic HTML solves this by providing specific tags for specific page regions.

### Key Semantic Tags

| Tag | Purpose |
|---|---|
| \`<header>\` | The top area, usually containing the logo or navigation menu |
| \`<main>\` | The primary content of the page (only use ONE per page) |
| \`<footer>\` | The bottom area, often containing copyright info or links |
| \`<nav>\` | A block containing navigation links |

### Why Semantics Matter

1. **Accessibility**: Screen readers rely on semantic tags to announce page structure to visually impaired users.
2. **SEO**: Search engines like Google prioritize content inside \`<main>\` over content in sidebars or footers.

### The Code

\`\`\`html
<header>
  <h1>My Website</h1>
</header>
<main>
  <p>Welcome to the main content!</p>
</main>
\`\`\`

### ⚠️ Common Mistake

Do not use more than one \`<main>\` tag on a page. A page only has one primary subject. If you have two \`<main>\` tags, it confuses accessibility tools and search engines.

**Your Task:**
Wrap the existing \`<h1>\` heading exactly inside a proper \`<header>\` element. Then, wrap the existing \`<p>\` paragraph exactly inside a \`<main>\` element.`,
        task: 'Wrap the <h1> inside a <header> element, and the <p> inside a <main> element.',
        initial_code: '<h1>My Blog</h1>\n<p>Welcome to my blog!</p>',
        test_cases: {
          solution: '<header>\n  <h1>My Blog</h1>\n</header>\n<main>\n  <p>Welcome to my blog!</p>\n</main>',
          force_ai: true
        }
      }
    ]
  },
  {
    id: 'css-styling',
    title: 'CSS Styling',
    level: 'beginner',
    language: 'css',
    description: 'Transform plain HTML into beautiful, high-performance interfaces with modern CSS techniques.',
    exercises: [
      {
        id: 'css_1_1',
        title: 'Painting with CSS',
        instruction: `
### What is CSS?

While HTML provides the structure of a page, **CSS (Cascading Style Sheets)** controls its visual appearance — colors, fonts, spacing, and layout. 

Separating content (HTML) from presentation (CSS) keeps code organized and allows you to change the look of an entire website by editing one CSS file.

### CSS Selectors

To style an HTML element, you need to "select" it first. 

\`\`\`css
h1 {
  color: purple;
}
\`\`\`

### Breaking It Down

1. **\`h1\`** — The **Selector**. It targets all \`<h1>\` tags on the page.
2. **\`{\`** and **\`}\`** — Curly braces contain the styling rules.
3. **\`color\`** — The **Property**. It specifies *what* you want to change (text color).
4. **\`:\`** — The colon separates the property from the value.
5. **\`purple\`** — The **Value**. It defines the new state.
6. **\`;\`** — The **Semicolon**. It marks the end of the rule.

### ⚠️ Common Mistake

Beginners often use an equals sign \`=\` instead of a colon \`:\`, or they forget the semicolon \`;\`.

\`\`\`css
h1 {
  color = purple  /* ❌ WRONG: Uses =, missing semicolon */
  color: purple;  /* ✅ CORRECT */
}
\`\`\`

**Your Task:**
Update the CSS rule for the \`h1\` selector. Change the value of the color property to exactly "purple" to match the CodLift brand aesthetic.`,
        task: 'Set h1 { color: purple; }',
        initial_code: '<style>\n  h1 {\n    color: white;\n  }\n</style>\n<h1>Colorful World</h1>',
        test_cases: { 
          expected_output: 'color: purple',
          solution: '<style>\n  h1 {\n    color: purple;\n  }\n</style>\n<h1>Colorful World</h1>',
          force_ai: true
        }
      }
    ]
  },
  {
    id: 'css-flexbox',
    title: 'CSS Flexbox',
    level: 'beginner',
    language: 'css',
    description: 'Master the modern flexbox layout system used by professional developers to build responsive, one-dimensional layouts.',
    exercises: [
      {
        id: 'css_2_1',
        title: 'Enable Flexbox',
        instruction: `
### What is Flexbox?

By default, HTML elements **stack vertically** — one on top of the next. Flexbox is a CSS layout mode that lets you **arrange items in a row or column** with total control over spacing and alignment.

You activate Flexbox by adding **one line** to the parent element:

\`\`\`css
.container {
  display: flex;
}
\`\`\`

### Breaking It Down

- **\`.container\`** — the selector that targets your parent element
- **\`display\`** — the property that controls *how* elements are laid out
- **\`flex\`** — the value that activates the Flexbox engine
- **\`;\`** — the semicolon that ends every CSS declaration

Once you add \`display: flex\` to a parent, **all direct children** immediately line up horizontally in a row.

### Important Rule

\`display: flex\` goes on the **parent container**, NOT on the child items. You're setting rules for the shelf, not for the books.

**Your Task:**
Add \`display: flex\` inside the \`.container\` rule so all three items line up in a horizontal row.`,
        task: 'Set display: flex on the .container class.',
        initial_code: '<style>\n  .container {\n    background: #1a1a2e;\n    padding: 20px;\n    /* Add display: flex here */\n  }\n  .item { background: #a855f7; padding: 10px; margin: 5px; }\n</style>\n<div class="container">\n  <div class="item">A</div>\n  <div class="item">B</div>\n  <div class="item">C</div>\n</div>',
        test_cases: {
          solution: '<style>\n  .container {\n    background: #1a1a2e;\n    padding: 20px;\n    display: flex;\n  }\n  .item { background: #a855f7; padding: 10px; margin: 5px; }\n</style>\n<div class="container">\n  <div class="item">A</div>\n  <div class="item">B</div>\n  <div class="item">C</div>\n</div>',
          force_ai: true
        }
      },
      {
        id: 'css_2_2',
        title: 'Justify & Align',
        instruction: `
### Aligning Items in Flexbox

Once Flexbox is active, you have two powerful properties to control **where** items sit inside the container:

| Property | Controls | Common Values |
|---|---|---|
| \`justify-content\` | Horizontal position (left/right) | \`flex-start\`, \`center\`, \`flex-end\`, \`space-between\` |
| \`align-items\` | Vertical position (up/down) | \`flex-start\`, \`center\`, \`flex-end\`, \`stretch\` |

### The Code

\`\`\`css
.container {
  display: flex;
  justify-content: center;  /* centers horizontally */
  align-items: center;       /* centers vertically */
}
\`\`\`

### What Each Line Does

- **\`justify-content: center\`** — pushes children to the horizontal center of the container
- **\`align-items: center\`** — pushes children to the vertical center of the container

> **Note:** Vertical centering only works if the container has an explicit \`height\`. The starter code already has \`height: 200px\` so you're good.

### Common Values Reference

- \`flex-start\` — items pile up at the start (left or top)
- \`center\` — items sit in the middle
- \`flex-end\` — items pile up at the end (right or bottom)
- \`space-between\` — items spread out, first and last touch the edges

**Your Task:**
Add \`justify-content: center\` and \`align-items: center\` inside the \`.container\` rule to center the box in both directions.`,
        task: 'Add justify-content: center and align-items: center to the .container.',
        initial_code: '<style>\n  .container {\n    display: flex;\n    background: #1a1a2e;\n    height: 200px;\n    /* Add justify-content and align-items */\n  }\n  .item { background: #a855f7; padding: 15px; border-radius: 8px; }\n</style>\n<div class="container">\n  <div class="item">Centered!</div>\n</div>',
        test_cases: {
          solution: '<style>\n  .container {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    background: #1a1a2e;\n    height: 200px;\n  }\n  .item { background: #a855f7; padding: 15px; border-radius: 8px; }\n</style>\n<div class="container">\n  <div class="item">Centered!</div>\n</div>',
          force_ai: true
        }
      },
      {
        id: 'css_2_3',
        title: 'Flex Direction & Wrap',
        instruction: `
### Controlling Direction and Wrapping

Flexbox has two more essential properties:

**\`flex-direction\`** — controls which direction items flow.

| Value | Effect |
|---|---|
| \`row\` | Left to right (default) |
| \`column\` | Top to bottom |
| \`row-reverse\` | Right to left |
| \`column-reverse\` | Bottom to top |

**\`flex-wrap\`** — controls what happens when items don't fit.

| Value | Effect |
|---|---|
| \`nowrap\` | Force everything onto one line (default) |
| \`wrap\` | Allow items to move to a new line |

### The Code

\`\`\`css
.container {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
\`\`\`

- **\`flex-direction: column\`** — stacks items from top to bottom instead of left to right
- **\`flex-wrap: wrap\`** — when items overflow, they wrap to the next line instead of shrinking

### ⚠️ Watch Out

When \`flex-direction\` is \`column\`, the axes flip:
- \`justify-content\` now controls **vertical** alignment
- \`align-items\` now controls **horizontal** alignment

This trips up even experienced developers!

**Your Task:**
Add \`flex-direction: column\` and \`flex-wrap: wrap\` to the \`.container\` rule.`,
        task: 'Add flex-direction: column and flex-wrap: wrap to the .container.',
        initial_code: '<style>\n  .container {\n    display: flex;\n    background: #1a1a2e;\n    padding: 20px;\n    /* Add direction and wrap */\n  }\n  .item { background: #ffd60a; padding: 10px; margin: 5px; }\n</style>\n<div class="container">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n</div>',
        test_cases: {
          solution: '<style>\n  .container {\n    display: flex;\n    flex-direction: column;\n    flex-wrap: wrap;\n    background: #1a1a2e;\n    padding: 20px;\n  }\n  .item { background: #ffd60a; padding: 10px; margin: 5px; }\n</style>\n<div class="container">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n</div>',
          force_ai: true
        }
      }
    ]
  },
  {
    id: 'css-grid',
    title: 'CSS Grid & Responsive',
    level: 'beginner',
    language: 'css',
    description: 'Build complex responsive layouts with CSS Grid and media queries — the two-dimensional layout system that powers modern web design.',
    exercises: [
      {
        id: 'css_3_1',
        title: 'Your First Grid',
        instruction: `
### What is CSS Grid?

CSS Grid is a **two-dimensional** layout system. While Flexbox controls items in one direction (row OR column), Grid lets you control **rows AND columns simultaneously** — perfect for complex page layouts.

### Enabling Grid

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
\`\`\`

### What Each Property Does

- **\`display: grid\`** — activates the Grid layout engine on the container
- **\`grid-template-columns\`** — defines how many columns to create and how wide each is
- **\`1fr 1fr 1fr\`** — creates 3 columns, each taking an equal share of available space

### The \`fr\` Unit

\`fr\` stands for **fraction**. It divides the available space into equal parts.
- \`1fr 1fr 1fr\` → 3 equal columns (33.33% each)
- \`2fr 1fr\` → first column is twice as wide as the second
- You can also write \`repeat(3, 1fr)\` as a shorthand for \`1fr 1fr 1fr\`

### Key Difference: Grid vs Flexbox

| | Flexbox | Grid |
|---|---|---|
| Dimensions | 1D (row or column) | 2D (rows AND columns) |
| Best for | Navigation bars, button groups | Page layouts, card grids |

**Your Task:**
Add \`display: grid\` and \`grid-template-columns: 1fr 1fr 1fr\` to the \`.grid\` container.`,
        task: 'Set display: grid and grid-template-columns: 1fr 1fr 1fr on the .grid container.',
        initial_code: '<style>\n  .grid {\n    background: #0d131a;\n    padding: 20px;\n    gap: 15px;\n    /* Add grid styles here */\n  }\n  .cell { background: #a855f7; color: black; padding: 20px; border-radius: 8px; text-align: center; }\n</style>\n<div class="grid">\n  <div class="cell">1</div>\n  <div class="cell">2</div>\n  <div class="cell">3</div>\n  <div class="cell">4</div>\n  <div class="cell">5</div>\n  <div class="cell">6</div>\n</div>',
        test_cases: {
          solution: '<style>\n  .grid {\n    display: grid;\n    grid-template-columns: 1fr 1fr 1fr;\n    background: #0d131a;\n    padding: 20px;\n    gap: 15px;\n  }\n  .cell { background: #a855f7; color: black; padding: 20px; border-radius: 8px; text-align: center; }\n</style>\n<div class="grid">\n  <div class="cell">1</div>\n  <div class="cell">2</div>\n  <div class="cell">3</div>\n  <div class="cell">4</div>\n  <div class="cell">5</div>\n  <div class="cell">6</div>\n</div>',
          force_ai: true
        }
      },
      {
        id: 'css_3_2',
        title: 'Media Queries',
        instruction: `
### Making Your Site Responsive

A **media query** applies CSS rules **only when a condition is true** — such as when the screen is smaller than a certain width. This is the foundation of responsive web design.

### The Syntax

\`\`\`css
@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
\`\`\`

### Breaking It Down

- **\`@media\`** — the keyword that starts a conditional CSS block
- **\`(max-width: 600px)\`** — the condition: "apply these styles when screen width is 600px or less"
- **\`.grid { ... }\`** — the CSS to apply when the condition is true
- **\`grid-template-columns: 1fr\`** — collapses the 3-column grid into a single column

### Common Breakpoints Used in Production

| Breakpoint | Target Device |
|---|---|
| \`max-width: 480px\` | Small phones |
| \`max-width: 768px\` | Tablets |
| \`max-width: 1024px\` | Small laptops |

### ⚠️ Placement Matters

Put \`@media\` blocks **below** the regular styles they override. CSS reads top-to-bottom, so later rules win.

**Your Task:**
Below the existing styles, add \`@media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }\` to collapse the grid to one column on small screens.`,
        task: 'Add a @media (max-width: 600px) block that sets .grid to grid-template-columns: 1fr.',
        initial_code: '<style>\n  .grid {\n    display: grid;\n    grid-template-columns: 1fr 1fr 1fr;\n    gap: 15px;\n    padding: 20px;\n    background: #0d131a;\n  }\n  /* Add media query here */\n  .cell { background: #ffd60a; color: black; padding: 20px; border-radius: 8px; text-align: center; }\n</style>\n<div class="grid">\n  <div class="cell">A</div>\n  <div class="cell">B</div>\n  <div class="cell">C</div>\n</div>',
        test_cases: {
          solution: '<style>\n  .grid {\n    display: grid;\n    grid-template-columns: 1fr 1fr 1fr;\n    gap: 15px;\n    padding: 20px;\n    background: #0d131a;\n  }\n  @media (max-width: 600px) {\n    .grid {\n      grid-template-columns: 1fr;\n    }\n  }\n  .cell { background: #ffd60a; color: black; padding: 20px; border-radius: 8px; text-align: center; }\n</style>\n<div class="grid">\n  <div class="cell">A</div>\n  <div class="cell">B</div>\n  <div class="cell">C</div>\n</div>',
          force_ai: true
        }
      }
    ]
  },
  {
    id: 'js-fundamentals',
    title: 'JavaScript Fundamentals',
    level: 'beginner',
    language: 'javascript',
    description: 'Learn how to create labeled containers to hold information in the computer\'s memory.',
    exercises: [
      {
        id: 'js_1_1',
        title: 'Variables',
        instruction: `
### What is a Variable?

A variable is a **named storage location** in memory. You use it to save a value so you can use it later in your program.

### The Three Keywords

| Keyword | When to Use |
|---|---|
| \`let\` | Value might change later |
| \`const\` | Value never changes |
| \`var\` | Old style — avoid in modern JS |

### Syntax

\`\`\`javascript
let myName = "Alex";
\`\`\`

- **\`let\`** — declares the variable
- **\`myName\`** — the name you give it (no spaces, case-sensitive)
- **\`=\`** — the assignment operator (puts the value inside)
- **\`"Alex"\`** — a string value (text always goes in quotes)
- **\`;\`** — ends the statement

### Data Types in JavaScript

\`\`\`javascript
let score = 100;           // Number — no quotes
let name = "Alex";         // String — use quotes
let isLoggedIn = true;     // Boolean — true or false
\`\`\`

### ⚠️ Common Mistake

Forgetting quotes around text:
\`\`\`javascript
let name = Alex;   // ❌ ERROR: JavaScript looks for a variable named Alex
let name = "Alex"; // ✅ CORRECT
\`\`\`

**Your Task:**
Create a variable using \`let\` named \`friend\` and store the string \`"Alex"\` in it.`,
        task: 'Create a variable named friend and store "Alex" in it.',
        initial_code: '// Create your variable below this line\n',
        test_cases: { 
          expected_output: 'let friend = "Alex"',
          solution: 'let friend = "Alex";',
          force_ai: true
        }
      },
      {
        id: 'js_1_2',
        title: 'Functions',
        instruction: `
### What is a Function?

A function is a **reusable block of code** with a name. Instead of writing the same logic multiple times, you write it once in a function and call it by name whenever you need it.

### Basic Syntax

\`\`\`javascript
function greet(name) {
  return "Hello, " + name + "!";
}
\`\`\`

### The Parts of a Function

- **\`function\`** — the keyword that defines a function
- **\`greet\`** — the function name (you choose this)
- **\`(name)\`** — the parameter — a placeholder for the input value
- **\`{ ... }\`** — the function body where your logic lives
- **\`return\`** — sends the result back to whoever called the function

### Calling a Function

\`\`\`javascript
console.log(greet("Student")); // Output: Hello, Student!
\`\`\`

### String Concatenation

To build strings with variables, use \`+\` to join pieces:
\`\`\`javascript
"Hello, " + name + "!"  // joins 3 parts into one string
\`\`\`

Or use a template literal (backticks):
\`\`\`javascript
\`Hello, \${name}!\`  // same result, cleaner syntax
\`\`\`

### ⚠️ Don't Forget \`return\`

\`console.log\` inside a function just prints to the console — it doesn't give the value back. Always use \`return\` when the function needs to produce a result.

**Your Task:**
Define a function named \`greetUser\` that takes a \`name\` parameter and returns the string \`"Hello, [name]!"\`.`,
        task: 'Define a function greetUser(name) that returns the string "Hello, [name]!".',
        initial_code: '// Write your function here\n\nconsole.log(greetUser("Student"));',
        test_cases: { 
          function_name: 'greetUser', 
          test_args: '"Student"', 
          expected_output: 'Hello, Student!',
          solution: 'function greetUser(name) {\n  return "Hello, " + name + "!";\n}',
          force_ai: true
        }
      },
      {
        id: 'js_1_3',
        title: 'Arrays',
        instruction: `
### What is an Array?

An array is a **list of values** stored in a single variable. Instead of making 10 separate variables for 10 fruits, you put them all in one array.

### Creating an Array

\`\`\`javascript
const fruits = ["Apple", "Banana", "Cherry"];
\`\`\`

- \`[\` and \`]\` — square brackets wrap the array
- Items are separated by **commas**
- Use \`const\` when the array won't be replaced entirely

### Accessing Items

Arrays use **zero-based indexing** — the first item is at position \`0\`:

\`\`\`javascript
console.log(fruits[0]); // "Apple"
console.log(fruits[1]); // "Banana"
console.log(fruits[2]); // "Cherry"
\`\`\`

### Useful Array Properties

\`\`\`javascript
fruits.length; // → 3  (number of items)
\`\`\`

### ⚠️ Zero-Based Indexing Trap

The most common mistake is using the wrong index:
- \`fruits[1]\` is the **second** item, NOT the first
- \`fruits[3]\` on a 3-item array returns \`undefined\`

**Your Task:**
Create a \`const\` array named \`fruits\` containing 3 string items. Then use \`console.log(fruits[0])\` to print the first item.`,
        task: 'Create an array named fruits and log the first item.',
        initial_code: '// Create your array here\n',
        test_cases: {
          solution: 'const fruits = ["Apple", "Banana", "Cherry"];\nconsole.log(fruits[0]);',
          force_ai: true
        }
      },
      {
        id: 'js_1_4',
        title: 'Objects',
        instruction: `
### What is an Object?

An object groups **related data** together using named keys instead of numbered indexes. Think of it as a structured record describing a single thing.

### Creating an Object

\`\`\`javascript
const person = {
  name: "Alex",
  age: 25,
  job: "Developer"
};
\`\`\`

### The Parts

- \`{\` and \`}\` — curly braces wrap the object
- **Keys** — the property names (\`name\`, \`age\`, \`job\`)
- **Values** — the data stored for each key
- **Colon** — separates the key from its value: \`key: value\`
- **Comma** — separates each property from the next (no comma after the last one)

### Accessing Properties

**Dot notation** (most common):
\`\`\`javascript
console.log(person.name); // "Alex"
console.log(person.age);  // 25
\`\`\`

**Bracket notation** (useful when key is dynamic):
\`\`\`javascript
console.log(person["name"]); // "Alex"
\`\`\`

### ⚠️ Don't Forget Commas

\`\`\`javascript
const person = {
  name: "Alex"   // ❌ missing comma — will cause an error
  age: 25
};
\`\`\`

**Your Task:**
Create a \`const\` object named \`person\` with three keys: \`name\`, \`age\`, and \`job\`. Then log \`person.name\` to the console.`,
        task: 'Create an object named person and log the name.',
        initial_code: '// Create your object here\n',
        test_cases: {
          solution: 'const person = {\n  name: "Alex",\n  age: 25,\n  job: "Developer"\n};\nconsole.log(person.name);',
          force_ai: true
        }
      },
      {
        id: 'js_1_5',
        title: 'Loops',
        instruction: `
### What is a Loop?

A loop lets you **repeat a block of code** multiple times without rewriting it. Instead of writing \`console.log(1)\` five times, a loop does it in 3 lines.

### The \`for\` Loop

\`\`\`javascript
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
\`\`\`

### Breaking Down the Three Parts

| Part | Code | Meaning |
|---|---|---|
| **Initialize** | \`let i = 1\` | Create counter, start at 1 |
| **Condition** | \`i <= 5\` | Keep looping while this is true |
| **Update** | \`i++\` | Add 1 to \`i\` after each loop |

The loop body \`{ ... }\` runs once for each iteration.

### What \`i++\` Does

\`i++\` is shorthand for \`i = i + 1\`. It increments the counter so the loop eventually stops.

### The Output

\`\`\`
1
2
3
4
5
\`\`\`

### ⚠️ Infinite Loop Warning

If you forget \`i++\`, the counter never changes. The condition \`i <= 5\` stays true forever and your code crashes. Always include the update part!

Other common mistakes:
- \`i < 5\` instead of \`i <= 5\` → prints 1 to 4 only
- \`i = 0\` instead of \`i = 1\` → starts from 0

**Your Task:**
Write a \`for\` loop that starts at \`1\`, ends at \`5\`, and uses \`console.log(i)\` to print each number.`,
        task: 'Write a for loop starting at 1, ending at 5, that prints each number.',
        initial_code: '// Write your loop here\n',
        test_cases: {
          solution: 'for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}',
          force_ai: true
        }
      }
    ]
  }
];

// Helper: get lessons grouped by level
export const getLessonsByLevel = (level) =>
  clientCurriculum.filter(l => l.level === level);

// Helper: get a specific lesson
export const getLessonById = (id) =>
  clientCurriculum.find(l => l.id === id);
