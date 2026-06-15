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
  },

  // ─── PRO TRACK ────────────────────────────────────────────────────────────
  {
    id: 'dom-manipulation',
    title: 'DOM Manipulation',
    level: 'pro',
    language: 'javascript',
    description: 'Learn to dynamically read and rewrite any element on the page using the Document Object Model — the live, programmable map of your webpage.',
    exercises: [
      {
        id: 'dom_1_1',
        title: 'Selecting Elements',
        instruction: `
### What is the DOM?

When the browser loads your HTML, it converts every tag into a live JavaScript object — forming a tree called the **Document Object Model (DOM)**. JavaScript can grab any node in this tree and change it instantly, without reloading the page.

### querySelector — Your Universal Selector

\`\`\`javascript
const title = document.querySelector('h1');
title.textContent = 'Hello from JavaScript!';
\`\`\`

### Breaking It Down

| Part | Meaning |
|---|---|
| \`document\` | The global object for the whole page |
| \`.querySelector()\` | Finds the first element matching a CSS selector |
| \`'h1'\` | Selects the first \`<h1>\` tag |
| \`.textContent\` | Gets or sets the visible text inside an element |

### Selector Cheat Sheet

| You want | Write |
|---|---|
| Tag | \`'h1'\`, \`'p'\`, \`'div'\` |
| ID | \`'#myId'\` |
| Class | \`'.myClass'\` |

### ⚠️ Common Mistake

Forgetting the \`#\` or \`.\` prefix:
\`\`\`javascript
document.querySelector('myId')    // ❌ Looks for a tag named "myId"
document.querySelector('#myId')   // ✅ Correct — selects by ID
\`\`\`

**Your Task:**
Use \`document.querySelector\` to select the element with id \`output\`. Set its \`textContent\` to exactly: "DOM Selected!"`,
        task: 'Use querySelector to select #output and set its textContent to "DOM Selected!"',
        initial_code: `<!DOCTYPE html>
<html>
<body>
  <p id="output">Original text</p>
  <script>
    // Write your code here
  </script>
</body>
</html>`,
        test_cases: {
          solution: `<!DOCTYPE html>\n<html>\n<body>\n  <p id="output">Original text</p>\n  <script>\n    const el = document.querySelector('#output');\n    el.textContent = 'DOM Selected!';\n  </script>\n</body>\n</html>`,
          force_ai: true
        }
      },
      {
        id: 'dom_1_2',
        title: 'Changing Styles Dynamically',
        instruction: `
### The style Property

Every DOM element has a \`style\` property that maps directly to inline CSS. Setting it changes the element's appearance instantly.

\`\`\`javascript
const box = document.querySelector('#box');
box.style.backgroundColor = 'purple';
box.style.fontSize = '24px';
\`\`\`

### camelCase Rule

CSS uses hyphens, but JavaScript uses camelCase for the same properties:

| CSS | JavaScript |
|---|---|
| \`background-color\` | \`backgroundColor\` |
| \`font-size\` | \`fontSize\` |
| \`border-radius\` | \`borderRadius\` |
| \`text-align\` | \`textAlign\` |

All values must be **strings** — even numeric ones: \`box.style.width = '200px'\`.

### ⚠️ Common Mistake

\`\`\`javascript
box.style.background-color = 'red'; // ❌ Syntax error — JS reads - as minus
box.style.backgroundColor = 'red';  // ✅ Correct camelCase
\`\`\`

**Your Task:**
Select the element with id \`box\`. Set its \`backgroundColor\` to \`'crimson'\` and its \`color\` (text color) to \`'white'\`.`,
        task: 'Select #box, set its backgroundColor to "crimson" and color to "white".',
        initial_code: `<!DOCTYPE html>
<html>
<body>
  <div id="box" style="padding:20px;">Hello Box</div>
  <script>
    // Write your code here
  </script>
</body>
</html>`,
        test_cases: {
          solution: `<!DOCTYPE html>\n<html>\n<body>\n  <div id="box" style="padding:20px;">Hello Box</div>\n  <script>\n    const box = document.querySelector('#box');\n    box.style.backgroundColor = 'crimson';\n    box.style.color = 'white';\n  </script>\n</body>\n</html>`,
          force_ai: true
        }
      },
      {
        id: 'dom_1_3',
        title: 'Creating & Appending Elements',
        instruction: `
### Building Elements from Scratch

JavaScript lets you create brand-new HTML elements and insert them anywhere on the page — no page reload needed.

### The Two-Step Process

\`\`\`javascript
// Step 1: Build (exists only in memory)
const newItem = document.createElement('li');
newItem.textContent = 'Added by JavaScript!';

// Step 2: Attach to the page
document.querySelector('ul').appendChild(newItem);
\`\`\`

### Breaking It Down

| Method | What it does |
|---|---|
| \`createElement('li')\` | Creates a detached \`<li>\` node in memory |
| \`.textContent = '...'\` | Sets the visible text content |
| \`.appendChild(el)\` | Attaches the node as the last child |

### Other Useful Methods

- \`prepend(el)\` — inserts as first child
- \`insertAdjacentElement('beforeend', el)\` — flexible positioning
- \`remove()\` — removes an element from the DOM

### ⚠️ Common Mistake

Only creating, but never appending:
\`\`\`javascript
const p = document.createElement('p'); // ❌ Still invisible!
// You MUST append it:
document.querySelector('#container').appendChild(p); // ✅
\`\`\`

**Your Task:**
Create a new \`<p>\` element. Set its \`textContent\` to \`"I was created by JS"\`. Then append it to the \`#container\` element.`,
        task: 'Create a <p> element, set its text, and append it to #container.',
        initial_code: `<!DOCTYPE html>
<html>
<body>
  <div id="container"></div>
  <script>
    // Write your code here
  </script>
</body>
</html>`,
        test_cases: {
          solution: `<!DOCTYPE html>\n<html>\n<body>\n  <div id="container"></div>\n  <script>\n    const p = document.createElement('p');\n    p.textContent = 'I was created by JS';\n    document.querySelector('#container').appendChild(p);\n  </script>\n</body>\n</html>`,
          force_ai: true
        }
      }
    ]
  },
  {
    id: 'events-and-forms',
    title: 'Events & Forms',
    level: 'pro',
    language: 'javascript',
    description: 'Make your websites react to user input — clicks, keypresses, form submissions — using the browser\'s event system.',
    exercises: [
      {
        id: 'events_1_1',
        title: 'Click Events',
        instruction: `
### Event-Driven Programming

The web is event-driven: code runs in response to user actions (clicks, keypresses, etc.). The professional way to listen for events is \`addEventListener\`.

\`\`\`javascript
const btn = document.querySelector('#myButton');
btn.addEventListener('click', function() {
  alert('Clicked!');
});
\`\`\`

### Breaking It Down

| Part | Meaning |
|---|---|
| \`addEventListener\` | Registers an event listener on the element |
| \`'click'\` | The event type to listen for |
| \`function() { ... }\` | The callback — runs when the event fires |

### Common Event Types

| Event | Trigger |
|---|---|
| \`'click'\` | Mouse click |
| \`'mouseover'\` | Mouse enters element |
| \`'keydown'\` | Key pressed |
| \`'submit'\` | Form submitted |
| \`'input'\` | Input field value changes |

### ⚠️ Common Mistake

\`\`\`javascript
btn.onclick = myFunc();  // ❌ Calls myFunc() IMMEDIATELY
btn.onclick = myFunc;    // ✅ Passes the function reference
btn.addEventListener('click', myFunc); // ✅ Best practice
\`\`\`

**Your Task:**
Select the button with id \`myBtn\`. Add a \`click\` event listener. When clicked, set \`#result\`'s \`textContent\` to exactly: "Button clicked!"`,
        task: 'Add a click listener on #myBtn that sets #result textContent to "Button clicked!"',
        initial_code: `<!DOCTYPE html>
<html>
<body>
  <button id="myBtn">Click Me</button>
  <p id="result">Waiting...</p>
  <script>
    // Write your code here
  </script>
</body>
</html>`,
        test_cases: {
          solution: `<!DOCTYPE html>\n<html>\n<body>\n  <button id="myBtn">Click Me</button>\n  <p id="result">Waiting...</p>\n  <script>\n    const btn = document.querySelector('#myBtn');\n    btn.addEventListener('click', function() {\n      document.querySelector('#result').textContent = 'Button clicked!';\n    });\n  </script>\n</body>\n</html>`,
          force_ai: true
        }
      },
      {
        id: 'events_1_2',
        title: 'Reading Form Input',
        instruction: `
### The .value Property

Every \`<input>\` element has a \`.value\` property that holds whatever the user has typed. You read it inside an event handler:

\`\`\`javascript
document.querySelector('#submitBtn').addEventListener('click', function() {
  const name = document.querySelector('#nameInput').value;
  console.log('User typed:', name);
});
\`\`\`

### Building a Dynamic Response

\`\`\`javascript
document.querySelector('#submitBtn').addEventListener('click', function() {
  const val = document.querySelector('#nameInput').value;
  document.querySelector('#output').textContent = 'Hello, ' + val + '!';
});
\`\`\`

### event.preventDefault()

When a \`<form>\` is submitted, the browser refreshes the page by default. Call \`event.preventDefault()\` inside a \`submit\` handler to stop this:
\`\`\`javascript
form.addEventListener('submit', function(event) {
  event.preventDefault();
  // Now handle submission in JS
});
\`\`\`

### ⚠️ Common Mistake

Reading \`.value\` before the user interacts:
\`\`\`javascript
const val = input.value; // ❌ Empty string — user hasn't typed yet!
btn.addEventListener('click', function() {
  const val = input.value; // ✅ Read INSIDE the callback
});
\`\`\`

**Your Task:**
Add a \`click\` listener to \`#submitBtn\`. Read \`#nameInput\`'s \`.value\` and set \`#output\`'s \`textContent\` to \`"Hello, [value]!"\`.`,
        task: 'Read #nameInput.value on button click and display "Hello, [value]!" in #output.',
        initial_code: `<!DOCTYPE html>
<html>
<body>
  <input id="nameInput" type="text" placeholder="Enter your name" />
  <button id="submitBtn">Submit</button>
  <p id="output"></p>
  <script>
    // Write your code here
  </script>
</body>
</html>`,
        test_cases: {
          solution: `<!DOCTYPE html>\n<html>\n<body>\n  <input id="nameInput" type="text" placeholder="Enter your name" />\n  <button id="submitBtn">Submit</button>\n  <p id="output"></p>\n  <script>\n    document.querySelector('#submitBtn').addEventListener('click', function() {\n      const val = document.querySelector('#nameInput').value;\n      document.querySelector('#output').textContent = 'Hello, ' + val + '!';\n    });\n  </script>\n</body>\n</html>`,
          force_ai: true
        }
      },
      {
        id: 'events_1_3',
        title: 'Event Delegation',
        instruction: `
### The Problem with Many Listeners

Attaching individual listeners to 100 list items wastes memory. Dynamically added items won't have listeners at all!

### Event Bubbling

When you click an \`<li>\`, the click event **bubbles up** through every ancestor: \`li → ul → body → document\`. We can listen at the parent and catch all child events.

\`\`\`javascript
document.querySelector('#list').addEventListener('click', function(event) {
  if (event.target.tagName === 'LI') {
    event.target.style.color = 'purple';
  }
});
\`\`\`

### The event Object

The \`event\` parameter is automatically passed to every listener callback:

| Property | Meaning |
|---|---|
| \`event.target\` | The exact element that was clicked |
| \`event.currentTarget\` | The element the listener is attached to |
| \`event.type\` | The event type (e.g. \`'click'\`) |

### ⚠️ Common Mistake

\`tagName\` always returns **UPPERCASE** in HTML:
\`\`\`javascript
event.target.tagName === 'li'  // ❌ Never matches
event.target.tagName === 'LI'  // ✅ Correct
\`\`\`

**Your Task:**
Add one \`click\` listener to \`#list\`. Inside, check if \`event.target.tagName === 'LI'\`. If so, set \`event.target.style.fontWeight\` to \`'bold'\`.`,
        task: 'Add one click listener on #list. Bold any <li> that is clicked using event delegation.',
        initial_code: `<!DOCTYPE html>
<html>
<body>
  <ul id="list">
    <li>Item One</li>
    <li>Item Two</li>
    <li>Item Three</li>
  </ul>
  <script>
    // Write your code here
  </script>
</body>
</html>`,
        test_cases: {
          solution: `<!DOCTYPE html>\n<html>\n<body>\n  <ul id="list">\n    <li>Item One</li>\n    <li>Item Two</li>\n    <li>Item Three</li>\n  </ul>\n  <script>\n    document.querySelector('#list').addEventListener('click', function(event) {\n      if (event.target.tagName === 'LI') {\n        event.target.style.fontWeight = 'bold';\n      }\n    });\n  </script>\n</body>\n</html>`,
          force_ai: true
        }
      }
    ]
  },
  {
    id: 'async-javascript',
    title: 'Async JavaScript',
    level: 'pro',
    language: 'javascript',
    description: 'Master the art of asynchronous programming — fetching data from APIs, handling Promises, and writing clean async/await code.',
    exercises: [
      {
        id: 'async_1_1',
        title: 'Callbacks & setTimeout',
        instruction: `
### Why Async Matters

JavaScript runs on a single thread. Without async, waiting for a slow operation (network, timer) would freeze your entire UI.

Asynchronous code says: "Start this task, give me a callback to run when it's done, and keep going."

### setTimeout — The Classic Async Tool

\`\`\`javascript
console.log('Start');

setTimeout(function() {
  console.log('Runs after 2 seconds');
}, 2000);

console.log('End'); // Prints BEFORE the timeout!
\`\`\`

Output: \`Start → End → Runs after 2 seconds\`

### Breaking It Down

| Part | Meaning |
|---|---|
| \`setTimeout\` | Schedules code to run after a delay |
| \`function() { ... }\` | The callback to run when timer expires |
| \`2000\` | Delay in milliseconds (2 seconds) |

### ⚠️ Common Mistake

\`\`\`javascript
setTimeout(myFunc(), 1000);  // ❌ Calls myFunc() immediately, passes its result
setTimeout(myFunc, 1000);    // ✅ Passes the function reference
setTimeout(function() { myFunc(); }, 1000); // ✅ Also correct
\`\`\`

**Your Task:**
Write a \`setTimeout\` with a 1000ms delay. Inside the callback, set \`document.querySelector('#message').textContent\` to \`"Loaded!"\`.`,
        task: 'Use setTimeout (1000ms) to set #message textContent to "Loaded!" after 1 second.',
        initial_code: `// Simulate a delayed data load
const msg = document.querySelector('#message');
// Write your setTimeout here
`,
        test_cases: {
          solution: `const msg = document.querySelector('#message');\nsetTimeout(function() {\n  document.querySelector('#message').textContent = 'Loaded!';\n}, 1000);`,
          force_ai: true
        }
      },
      {
        id: 'async_1_2',
        title: 'Promises',
        instruction: `
### What is a Promise?

A Promise is an object representing a **future value**. It has three states:

| State | Meaning |
|---|---|
| Pending | Operation in progress |
| Fulfilled | Succeeded — value available |
| Rejected | Failed — error available |

### .then() and .catch()

\`\`\`javascript
fetchData()
  .then(function(data) {
    console.log(data.message);
  })
  .catch(function(error) {
    console.error('Error:', error);
  });
\`\`\`

### Chaining .then()

Each \`.then()\` receives the return value of the previous one. You can chain multiple \`.then()\` calls in sequence:

\`\`\`javascript
fetch('/api/user')
  .then(response => response.json())   // parse JSON
  .then(user => console.log(user.name)) // use the data
  .catch(err => console.error(err));
\`\`\`

### ⚠️ Common Mistake

Not returning inside a \`.then()\`:
\`\`\`javascript
.then(response => {
  response.json(); // ❌ No return — next .then gets undefined
})
.then(response => {
  return response.json(); // ✅ Correct
})
\`\`\`

And always add \`.catch()\` — unhandled rejections cause silent bugs!

**Your Task:**
Call \`fetchData()\`. Chain a \`.then()\` that logs \`data.message\`. Chain a \`.catch()\` that logs any error.`,
        task: 'Chain .then() and .catch() on fetchData() to log data.message or the error.',
        initial_code: `function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ message: 'Hello from API' }), 500);
  });
}

// Call fetchData() and chain .then() and .catch() here
`,
        test_cases: {
          solution: `function fetchData() {\n  return new Promise((resolve) => {\n    setTimeout(() => resolve({ message: 'Hello from API' }), 500);\n  });\n}\n\nfetchData()\n  .then(function(data) {\n    console.log(data.message);\n  })\n  .catch(function(error) {\n    console.error(error);\n  });`,
          force_ai: true
        }
      },
      {
        id: 'async_1_3',
        title: 'Async / Await',
        instruction: `
### Cleaner Async Code

\`async/await\` is syntactic sugar over Promises. It makes async code read like synchronous code — top-to-bottom, no callback chains.

\`\`\`javascript
async function loadUser() {
  try {
    const user = await fetchUser();
    console.log(user.name);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
\`\`\`

### The Rules

| Keyword | Rule |
|---|---|
| \`async\` | Goes before \`function\`. Makes the function return a Promise. |
| \`await\` | Can only be used INSIDE an \`async\` function. Pauses until the Promise resolves. |
| \`try/catch\` | Replaces \`.catch()\` for error handling in async functions. |

### async/await vs .then()

Both are equivalent — use whichever is cleaner:
\`\`\`javascript
// Promise chain
fetchUser().then(u => console.log(u.name)).catch(e => console.error(e));

// async/await
async function go() {
  try { console.log((await fetchUser()).name); }
  catch(e) { console.error(e); }
}
\`\`\`

### ⚠️ Common Mistakes

\`\`\`javascript
// Forgetting await:
const user = fetchUser(); // ❌ user is a Promise, not the data!
const user = await fetchUser(); // ✅

// Using await outside async:
const data = await fetch('/api'); // ❌ SyntaxError at top level
async function go() { const data = await fetch('/api'); } // ✅
\`\`\`

**Your Task:**
Write an \`async\` function named \`getData\`. Inside, \`await\` the \`fetchUser()\` call, log \`user.name\`, and catch errors with try/catch.`,
        task: 'Write async function getData() that awaits fetchUser(), logs user.name, catches errors.',
        initial_code: `function fetchUser() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ name: 'Alex', role: 'admin' }), 500);
  });
}

// Write your async function here
`,
        test_cases: {
          solution: `function fetchUser() {\n  return new Promise((resolve) => {\n    setTimeout(() => resolve({ name: 'Alex', role: 'admin' }), 500);\n  });\n}\n\nasync function getData() {\n  try {\n    const user = await fetchUser();\n    console.log(user.name);\n  } catch (error) {\n    console.error(error.message);\n  }\n}\n\ngetData();`,
          force_ai: true
        }
      }
    ]
  },
  {
    id: 'js-closures',
    title: 'Closures & Scope',
    level: 'pro',
    language: 'javascript',
    description: 'Understand one of JavaScript\'s most powerful (and misunderstood) features — closures — and how scope determines what variables your functions can see.',
    exercises: [
      {
        id: 'closures_1_1',
        title: 'Scope & the Scope Chain',
        instruction: `
### Variable Scope

Scope determines which variables are accessible where. JavaScript has three scope levels:

| Scope | Created with | Accessible where |
|---|---|---|
| Global | Outside all functions | Everywhere |
| Function | Inside a function | Only inside that function |
| Block | Inside \`{ }\` with \`let\`/\`const\` | Only inside that block |

### var vs let vs const

\`\`\`javascript
if (true) {
  var x = 10;   // function-scoped — leaks out!
  let y = 20;   // block-scoped — stays inside
}
console.log(x); // 10 ✅
console.log(y); // ReferenceError ❌
\`\`\`

### The Scope Chain

Inner functions can access outer scope variables:
\`\`\`javascript
const appName = 'CodLift';
function printApp() {
  console.log(appName); // ✅ Found in outer (global) scope
}
printApp();
\`\`\`

### ⚠️ Common Mistake

Forgetting \`let\`/\`const\` accidentally creates a global:
\`\`\`javascript
function bad() {
  myVar = 'oops'; // ❌ No declaration — becomes global!
}
\`\`\`

Always use \`let\` or \`const\` to avoid polluting global scope.

**Your Task:**
Declare \`const appName = "CodLift"\` in the global scope. Write a function \`printApp()\` that logs \`appName\`. Call \`printApp()\`.`,
        task: 'Declare const appName globally. Write printApp() that logs it. Call printApp().',
        initial_code: `// Declare appName here (outer scope)

function printApp() {
  // Log appName here (from outer scope)
}

printApp();`,
        test_cases: {
          solution: `const appName = 'CodLift';\n\nfunction printApp() {\n  console.log(appName);\n}\n\nprintApp();`,
          force_ai: true
        }
      },
      {
        id: 'closures_1_2',
        title: 'Closures — Functions with Memory',
        instruction: `
### What is a Closure?

A **closure** is a function that remembers the variables from its outer scope — even after that outer function has returned.

\`\`\`javascript
function makeCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
\`\`\`

### Why \`count\` Persists

Normally, \`count\` would be destroyed when \`makeCounter\` returns. But the returned function holds a **reference to \`count\`'s scope**, keeping it alive.

### Practical Uses

- **Private state** — variables not accessible from outside
- **Factory functions** — create specialized functions on demand
- **Memoization** — cache results

### ⚠️ Classic Closure Bug (Loop + var)

\`\`\`javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // Prints 3, 3, 3 ❌
}
// Fix: use let instead of var
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // Prints 0, 1, 2 ✅
}
\`\`\`

**Your Task:**
Write \`makeMultiplier(factor)\` that returns a function. The returned function takes a \`number\` and returns \`number * factor\`. Create \`const double = makeMultiplier(2)\` and log \`double(5)\`.`,
        task: 'Write makeMultiplier(factor) that returns a function multiplying by factor. Test with double(5).',
        initial_code: `// Write your closure here

const double = makeMultiplier(2);
console.log(double(5)); // Should print 10`,
        test_cases: {
          solution: `function makeMultiplier(factor) {\n  return function(number) {\n    return number * factor;\n  };\n}\n\nconst double = makeMultiplier(2);\nconsole.log(double(5));`,
          force_ai: true
        }
      }
    ]
  },
  {
    id: 'array-methods',
    title: 'Array Methods',
    level: 'pro',
    language: 'javascript',
    description: 'Unlock the full power of JavaScript arrays with map, filter, and reduce — the three functional programming tools that replace 90% of all loops.',
    exercises: [
      {
        id: 'arr_1_1',
        title: 'Array.map()',
        instruction: `
### What is .map()?

\`.map()\` transforms every item in an array into a new item, returning a **brand new array** of the same length. The original array is never modified.

\`\`\`javascript
const numbers = [1, 2, 3];
const doubled = numbers.map(function(num) {
  return num * 2;
});
console.log(doubled); // [2, 4, 6]
console.log(numbers); // [1, 2, 3] — unchanged
\`\`\`

### Arrow Function Version

\`\`\`javascript
const doubled = numbers.map(num => num * 2);
\`\`\`

### When to Use .map()

Use \`.map()\` when you want to **transform** every item. The output always has the same number of items as the input.

| Method | Purpose | Output length |
|---|---|---|
| \`.map()\` | Transform items | Same as input |
| \`.filter()\` | Remove items | ≤ input length |
| \`.reduce()\` | Combine to one value | Single value |

### ⚠️ Common Mistake

Forgetting \`return\` in the callback:
\`\`\`javascript
const result = numbers.map(function(num) {
  num * 2;  // ❌ No return — every item becomes undefined!
  return num * 2; // ✅
});
\`\`\`

**Your Task:**
Given the \`prices\` array, use \`.map()\` to create \`discounted\` — every price multiplied by \`0.9\` (10% off). Log \`discounted\`.`,
        task: 'Use .map() on prices array to create discounted (×0.9). Log it.',
        initial_code: `const prices = [100, 200, 300, 400, 500];

// Create discounted array using .map()
const discounted = prices.map(/* your callback here */);

console.log(discounted);`,
        test_cases: {
          solution: `const prices = [100, 200, 300, 400, 500];\n\nconst discounted = prices.map(function(price) {\n  return price * 0.9;\n});\n\nconsole.log(discounted);`,
          force_ai: true
        }
      },
      {
        id: 'arr_1_2',
        title: 'Array.filter()',
        instruction: `
### What is .filter()?

\`.filter()\` creates a new array with only the items where the callback returns \`true\`. Items returning \`false\` are removed.

\`\`\`javascript
const ages = [12, 18, 25, 14, 30];
const adults = ages.filter(function(age) {
  return age >= 18;
});
console.log(adults); // [18, 25, 30]
\`\`\`

### The Callback Must Return a Boolean

- Return \`true\` → keep the item
- Return \`false\` → discard the item

### Chaining with .map()

These methods can be combined:
\`\`\`javascript
const expensiveDiscounted = prices
  .filter(p => p > 100)    // only expensive items
  .map(p => p * 0.9);      // apply discount
\`\`\`

### ⚠️ Common Mistakes

\`\`\`javascript
// Returning the value instead of a condition (truthy values still "pass"):
ages.filter(age => age); // ❌ Keeps all non-zero ages, not just adults

// Mutating inside .filter() (don't do this):
ages.filter(age => { ages.push(99); return age >= 18; }); // ❌
\`\`\`

**Your Task:**
Given the \`words\` array, use \`.filter()\` to create \`longWords\` — only words with \`length\` greater than 4. Log \`longWords\`.`,
        task: 'Use .filter() on words to create longWords (length > 4). Log it.',
        initial_code: `const words = ['cat', 'elephant', 'dog', 'javascript', 'sun', 'moon'];

// Filter words longer than 4 characters
const longWords = words.filter(/* your callback here */);

console.log(longWords);`,
        test_cases: {
          solution: `const words = ['cat', 'elephant', 'dog', 'javascript', 'sun', 'moon'];\n\nconst longWords = words.filter(function(word) {\n  return word.length > 4;\n});\n\nconsole.log(longWords);`,
          force_ai: true
        }
      },
      {
        id: 'arr_1_3',
        title: 'Array.reduce()',
        instruction: `
### What is .reduce()?

\`.reduce()\` processes every item in an array and combines them into a **single value** using an accumulator.

\`\`\`javascript
const scores = [10, 20, 30];
const total = scores.reduce(function(acc, score) {
  return acc + score;
}, 0);
console.log(total); // 60
\`\`\`

### The Two Arguments

\`.reduce(callback, initialValue)\`

The callback receives:
1. \`acc\` — the running total (starts as \`initialValue\`)
2. \`current\` — the current array item

### Trace Through the Example

| Step | acc | score | returns |
|---|---|---|---|
| 1 | 0 | 10 | 10 |
| 2 | 10 | 20 | 30 |
| 3 | 30 | 30 | 60 |

### Beyond Summing

\`.reduce()\` can build any type of result:
\`\`\`javascript
// Count occurrences
['a','b','a','c','a'].reduce((acc, x) => {
  acc[x] = (acc[x] || 0) + 1; return acc;
}, {}); // { a:3, b:1, c:1 }
\`\`\`

### ⚠️ Common Mistake

Forgetting the initial value:
\`\`\`javascript
[].reduce((a, b) => a + b);        // ❌ TypeError on empty arrays
[].reduce((a, b) => a + b, 0);     // ✅ Always provide initial value
\`\`\`

**Your Task:**
Use \`.reduce()\` on the \`scores\` array to calculate the total sum, starting from \`0\`. Log \`sum\`.`,
        task: 'Use .reduce() on scores to sum all values starting from 0. Log sum.',
        initial_code: `const scores = [85, 90, 78, 92, 88];

// Calculate the total sum using .reduce()
const sum = scores.reduce(/* your callback and initial value here */);

console.log(sum);`,
        test_cases: {
          solution: `const scores = [85, 90, 78, 92, 88];\n\nconst sum = scores.reduce(function(total, score) {\n  return total + score;\n}, 0);\n\nconsole.log(sum);`,
          force_ai: true
        }
      }
    ]
  },
  {
    id: 'oop-basics',
    title: 'OOP & Classes',
    level: 'pro',
    language: 'javascript',
    description: 'Model real-world entities with JavaScript classes — write structured, reusable, and maintainable code using Object-Oriented Programming principles.',
    exercises: [
      {
        id: 'oop_1_1',
        title: 'Classes & Constructors',
        instruction: `
### What is a Class?

A class is a **blueprint** for creating objects. All instances share the same structure (properties and methods) but have their own data.

\`\`\`javascript
class Animal {
  constructor(name, sound) {
    this.name = name;
    this.sound = sound;
  }

  speak() {
    return this.name + ' says ' + this.sound;
  }
}

const dog = new Animal('Rex', 'Woof');
console.log(dog.speak()); // Rex says Woof
\`\`\`

### Anatomy of a Class

| Part | Purpose |
|---|---|
| \`class Name\` | Declares the class |
| \`constructor()\` | Runs when \`new\` is called — sets up initial data |
| \`this.prop\` | Stores data on the instance |
| Method | A function shared by all instances |

### Creating Instances

\`\`\`javascript
const cat = new Animal('Whiskers', 'Meow');
const bird = new Animal('Tweety', 'Tweet');
\`\`\`

Each instance has its own \`name\` and \`sound\`, but shares the \`speak()\` method.

### ⚠️ Common Mistakes

\`\`\`javascript
Animal('Rex', 'Woof');      // ❌ Missing \`new\` — \`this\` is undefined
new Animal('Rex', 'Woof');  // ✅

// Using arrow functions as methods (breaks \`this\`):
class Bad {
  describe = () => this.name; // ⚠️ Works but not class prototype — avoid
  describe() { return this.name; } // ✅ Standard method syntax
}
\`\`\`

**Your Task:**
Create a class \`Car\` with \`constructor(brand, speed)\`. Add a method \`describe()\` returning \`"[brand] goes [speed]km/h"\`. Instantiate with \`new Car('Tesla', 200)\` and log \`describe()\`.`,
        task: 'Create class Car(brand, speed) with describe() method. Instantiate and log describe().',
        initial_code: `// Define your Car class here

const myCar = new Car('Tesla', 200);
console.log(myCar.describe()); // Tesla goes 200km/h`,
        test_cases: {
          solution: `class Car {\n  constructor(brand, speed) {\n    this.brand = brand;\n    this.speed = speed;\n  }\n\n  describe() {\n    return this.brand + ' goes ' + this.speed + 'km/h';\n  }\n}\n\nconst myCar = new Car('Tesla', 200);\nconsole.log(myCar.describe());`,
          force_ai: true
        }
      },
      {
        id: 'oop_1_2',
        title: 'Inheritance with extends',
        instruction: `
### What is Inheritance?

A child class can **inherit** all properties and methods from a parent class using \`extends\`. It can also add new methods or override existing ones.

\`\`\`javascript
class Animal {
  constructor(name) { this.name = name; }
  speak() { return this.name + ' makes a sound'; }
}

class Dog extends Animal {
  constructor(name) {
    super(name); // MUST call super() first!
  }
  speak() {
    return this.name + ' barks'; // override
  }
}

const rex = new Dog('Rex');
console.log(rex.speak()); // Rex barks
\`\`\`

### The super() Rule

If a subclass defines a \`constructor\`, it **must** call \`super()\` before accessing \`this\`:

\`\`\`javascript
constructor(name, breed) {
  super(name);        // ✅ Initialize parent first
  this.breed = breed; // ✅ Now safe to use this
}
\`\`\`

### Method Resolution Order

When you call \`dog.speak()\`, JavaScript looks:
1. On the instance itself
2. On \`Dog.prototype\`
3. On \`Animal.prototype\`

### ⚠️ Common Mistakes

\`\`\`javascript
// Forgetting super() in subclass constructor:
class Dog extends Animal {
  constructor(name) {
    this.name = name; // ❌ ReferenceError: Must call super() first
    super(name);
  }
}

// Not calling super() at all:
class Dog extends Animal {
  constructor(name) { /* no super */ } // ❌ ReferenceError
}
\`\`\`

**Your Task:**
Create a \`Vehicle\` class with \`constructor(type)\` and \`describe()\` returning \`"Vehicle type: [type]"\`. Create \`Truck extends Vehicle\` with \`constructor(payload)\` calling \`super('Truck')\`, and \`info()\` returning \`"Truck with [payload]t payload"\`. Log both methods.`,
        task: 'Create Vehicle and Truck (extends Vehicle) classes. Instantiate Truck and log describe() and info().',
        initial_code: `// Define Vehicle class here

// Define Truck class that extends Vehicle here

const t = new Truck(5);
console.log(t.describe()); // Vehicle type: Truck
console.log(t.info());     // Truck with 5t payload`,
        test_cases: {
          solution: `class Vehicle {\n  constructor(type) {\n    this.type = type;\n  }\n  describe() {\n    return 'Vehicle type: ' + this.type;\n  }\n}\n\nclass Truck extends Vehicle {\n  constructor(payload) {\n    super('Truck');\n    this.payload = payload;\n  }\n  info() {\n    return 'Truck with ' + this.payload + 't payload';\n  }\n}\n\nconst t = new Truck(5);\nconsole.log(t.describe());\nconsole.log(t.info());`,
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

// Helper: get the next lesson after the given lesson ID.
// Returns null if currentId is the last lesson in the curriculum.
export const getNextLesson = (currentId) => {
  const idx = clientCurriculum.findIndex(l => l.id === currentId);
  if (idx === -1 || idx >= clientCurriculum.length - 1) return null;
  return clientCurriculum[idx + 1];
};
