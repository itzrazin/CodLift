// Client-side curriculum — mirrors server/data/curriculum.js
// Used as instant fallback so lessons load without waiting for backend
export const clientCurriculum = [
  // ─── BEGINNER TRACK ───────────────────────────────────────────
  {
    id: 'html-basics', title: 'HTML Basics', level: 'beginner', language: 'html',
    description: 'Learn the foundational building blocks of every website through deep dives into HTML syntax and structure.',
    exercises: [
      {
        title: 'The Skeleton of the Web',
        instruction: 'HTML (HyperText Markup Language) is the absolute backbone of every website on the internet today. Whether you are using a simple personal blog or a complex social media platform like Facebook, HTML provides the underlying structure that browsers use to render content. Elements in HTML are defined by "tags," which are typically written as a pair: an opening tag like <h1> and a closing tag like </h1>.\n\nThe <h1> tag specifically represents the most important heading on a page. In the hierarchy of SEO (Search Engine Optimization), having a clear and unique <h1> is critical because it tells search engines exactly what your page is about. Browsers also use this hierarchy to help screen readers navigate content for visually impaired users. Every professional website should follow a logical heading structure, starting with H1 and descending to H2, H3, and so on.\n\nIn this first exercise, you will practice modifying the content within these tags. By changing the text inside the <h1> tag, you are directly manipulating the "Document Object Model" (DOM) that the browser displays.\n\nChange the text inside the <h1> tag in the editor to say exactly "Hello CodLift".',
        task: 'Update the h1 tag text to: Hello CodLift',
        initial_code: '<html>\n  <body>\n    <h1>Welcome</h1>\n    <!-- Pro-Tip: Only use ONE H1 tag per page to keep your SEO score high and your content structure clean! -->\n  </body>\n</html>',
        test_cases: { expected_output: 'Hello CodLift' }
      },
      {
        title: 'Paragraphs & Text Blocks',
        instruction: 'When building a website, you will often need to display large blocks of text, descriptions, or articles. This is where the <p> (paragraph) tag comes into play. While headings are for titles and sub-titles, the <p> tag is designed for the body of your content. By default, browsers add a small amount of space (margin) above and below a paragraph to make it distinct from the surrounding elements, which improves readability for your users.\n\nReadability is one of the most important aspects of modern web design. Users tend to "scan" pages rather than read every word, so breaking your content into logical paragraphs is essential for keeping them engaged. In professional development, you will also learn about semantic tags like <article> or <section> that wrap these paragraphs, but the <p> tag remains the primary container for text. Remember that HTML is strictly for structure; while you can make text bold or italic using tags like <strong> or <em>, the actual "look" and "feel" should eventually be handled by CSS.\n\nIn this exercise, you will learn how to add new elements to an existing structure. Look at the code provided and identify where the heading ends.\n\nAdd a paragraph tag <p> below the heading with the text "Learning to code is fun!".',
        task: 'Add a <p> tag with the text: Learning to code is fun!',
        initial_code: '<h1>CodLift</h1>\n<!-- Add your paragraph below this line -->\n\n<!-- Pro-Tip: Use "Lorem Ipsum" placeholder text when you are designing a layout but don\'t have the final content yet! -->',
        test_cases: { expected_output: 'Learning to code is fun!' }
      },
      {
        title: 'Hyperlinks & Global Connectivity',
        instruction: 'The <a> (anchor) tag is perhaps the most powerful element in the HTML specification. It is what makes the "Web" a web—it allows you to connect one document to another through hyperlinks. Without the anchor tag, every website would be an isolated island. The <a> tag uses an "attribute" called "href" (Hypertext Reference) to specify the destination URL.\n\nAttributes are special keywords inside the opening tag that provide additional information about the element. For a link to work, the "href" attribute is mandatory. You can link to pages within your own website (relative links) or to external websites (absolute links). Professional developers also use attributes like "target=\'_blank\'" to make links open in a new tab, which helps keep users on your site while they explore external resources. Accessibility is also key here; always ensure your link text (the text between the opening and closing tags) is descriptive so that users know where they are going before they click.\n\nCreate a link that says "Visit CodLift" pointing to the URL "https://codlift.site". Make sure you include the full protocol (https://) in the href attribute.\n\nAdd: <a href="https://codlift.site">Visit CodLift</a>',
        task: 'Add a hyperlink pointing to https://codlift.site with the text "Visit CodLift".',
        initial_code: '<p>Check out our site:</p>\n<!-- Add link here -->\n\n<!-- Common Pitfall: Forgetting the "https://" in your URL will cause the browser to look for a file on your own server instead of the actual website! -->',
        test_cases: { expected_output: 'https://codlift.site' }
      },
    ]
  },
  {
    id: 'html-structure', title: 'HTML Structure & Semantics', level: 'beginner', language: 'html',
    description: 'Build accessible, structured web pages using semantic HTML5 elements that search engines and screen readers understand.',
    exercises: [
      {
        title: 'Semantic Layout',
        instruction: 'Imagine you are organizing a library. You would not just throw all the books into one giant pile — you would use **shelves**, **sections**, and **labels** so anyone could find what they need. **Semantic HTML** works exactly the same way for your web pages.\n\nBefore HTML5, developers used generic **<div>** tags for everything — headers, sidebars, footers. The problem? A <div> tells the browser absolutely nothing about the content it contains. It is just a featureless container. HTML5 introduced **semantic elements** like **<header>**, **<main>**, **<footer>**, **<article>**, and **<section>** that describe the *purpose* of the content they wrap.\n\nWhy does this matter? Two critical reasons. First, **accessibility**: screen readers used by visually impaired people rely on semantic tags to navigate your page. A screen reader can jump directly to the <main> content, skip the <nav>, or read the <footer> — but only if you use the correct tags. Second, **SEO**: Google\'s crawlers use semantic structure to understand your page hierarchy and rank it appropriately in search results.\n\nThe **<header>** element typically contains your site logo, navigation bar, and page title. The **<main>** element wraps the primary content that is unique to that page (there should only be one <main> per page). The **<footer>** holds copyright notices, legal links, and secondary navigation.\n\n**Pro-Tip:** Never use a <div> when a semantic tag exists for that purpose. Replacing <div class="header"> with <header> makes your code shorter, cleaner, and far more accessible.\n\nWrap the heading in a <header> tag and the paragraph in a <main> tag.',
        task: 'Wrap the <h1> inside a <header> element, and the <p> inside a <main> element.',
        initial_code: '<h1>My Blog</h1>\n<p>Welcome to my blog!</p>\n\n<!-- Pro-Tip: There should only be ONE <main> element per page! -->',
      },
      {
        title: 'Forms & Inputs',
        instruction: 'Think of an HTML **form** like a physical job application. It has fields to fill in (your name, email, etc.), labels that explain what goes where, and a submit button to send it off. Without forms, the web would be a one-way street — you could read information but never send any back.\n\nThe **<form>** element is the container that groups all your input fields together. Inside it, you use **<input>** elements to create fields where users can type. The **type** attribute on an input determines what kind of data it accepts — "text" for names, "email" for email addresses (with built-in browser validation), "password" for hidden characters, and many more.\n\nThe **<label>** element is critically important for **accessibility**. It tells both the user and screen readers which input field a particular label belongs to. You connect a label to an input using the **"for"** attribute on the label, which should match the **"id"** attribute on the input. Without this connection, visually impaired users will not know what each field is asking for.\n\nFinally, the **<button>** element with **type="submit"** triggers the form submission. When clicked, the browser collects all the input values and sends them to the server (or to your JavaScript handler).\n\n**Pro-Tip:** Always use <label> elements with matching "for" and "id" attributes. Skipping labels is one of the most common accessibility violations on the web — and it can hurt your site\'s SEO ranking.\n\nCreate a form with a text input labeled "Name" and a submit button that says "Submit".',
        task: 'Build a <form> containing a <label> for "Name", an <input> of type "text", and a <button> of type "submit".',
        initial_code: '<!-- Build your form here -->\n\n<!-- Common Pitfall: Forgetting the "for" attribute on labels means screen readers cannot associate the label with its input field! -->',
      },
      {
        title: 'Tables',
        instruction: 'Imagine a spreadsheet like Google Sheets or Excel. It organizes information into **rows** and **columns** so you can compare data at a glance. The HTML **<table>** element does exactly the same thing for web pages.\n\nA table is built from several nested elements working together. The **<table>** tag is the outer container. Inside it, **<tr>** (table row) creates each horizontal row. Within each row, you use **<th>** (table header) for column titles and **<td>** (table data) for regular cells. The <th> element automatically makes text bold and centered, signaling to both users and search engines that this cell is a label rather than data.\n\nTables were historically misused for page layouts (before Flexbox and Grid existed), but modern best practice is to use tables strictly for **tabular data** — things like pricing comparisons, statistics, schedules, or leaderboards. Using tables for layout is now considered an anti-pattern because it breaks accessibility and makes your HTML rigid and difficult to maintain.\n\nFor accessibility, you can add a **<caption>** element immediately inside the <table> to provide a title. Screen readers will announce this caption before reading the table data, giving users important context.\n\n**Pro-Tip:** Always include <th> elements in your header row. Without them, assistive technologies cannot distinguish between header cells and data cells, making your table nearly unusable for visually impaired users.\n\nCreate a 2-column table with headers "Name" and "Score" and at least 2 data rows.',
        task: 'Create a <table> with <tr> rows, <th> headers for "Name" and "Score", and 2 data rows using <td> cells.',
        initial_code: '<!-- Create table here -->\n\n<!-- Pro-Tip: Add a <caption> element inside your table for better accessibility and SEO! -->',
      },
    ]
  },
  {
    id: 'css-styling', title: 'CSS Styling', level: 'beginner', language: 'css',
    description: 'Transform plain HTML into beautiful, high-performance interfaces with modern CSS techniques.',
    exercises: [
      {
        title: 'Painting with CSS',
        instruction: 'CSS (Cascading Style Sheets) is the language used to describe the presentation of a web page. While HTML provides the structure, CSS provides the "skin." In modern web development, the separation of concerns is a fundamental principle: HTML handles the data and structure, while CSS handles the visual aesthetics.\n\nOne of the most basic ways to apply CSS is by using the "color" property. This property specifically changes the foreground color of text. You can specify colors using several formats: predefined names (like "red"), Hexadecimal codes (like "#ff0000"), RGB values, or HSL (Hue, Saturation, Lightness). HSL is often preferred by professional designers because it is more intuitive to read and modify. For example, changing the "lightness" value in HSL lets you quickly create hover states without changing the base color.\n\nIn this exercise, you will practice selecting an element and changing its color property. Notice how the <style> tag in the HTML allows us to write CSS directly within the document, although in larger projects, you would typically use an external .css file.\n\nChange the color of the h1 to "cyan" to match the CodLift brand.',
        task: 'Set h1 { color: cyan; }',
        initial_code: '<style>\n  h1 {\n    color: white;\n    /* Pro-Tip: Use CSS variables (e.g., --brand-color: #00f5d4) to maintain consistency across your entire project! */\n  }\n</style>\n<h1>Colorful World</h1>',
        test_cases: { expected_output: 'color: cyan' }
      },
      {
        title: 'The Box Model: Padding & Spacing',
        instruction: 'The CSS Box Model is the most important concept to master if you want to build professional layouts. Every single element on a web page is treated as a rectangular box. This box consists of four distinct layers: the content itself, the padding (space inside the border), the border, and the margin (space outside the border).\n\nPadding is critical because it gives your content "room to breathe." Without sufficient padding, text can feel cramped and difficult to read, which negatively impacts the User Experience (UX). In modern design, "white space" is used strategically to guide the user\'s eye and emphasize important information. You can set padding for all sides at once using the `padding` shorthand, or specify individual sides like `padding-top` or `padding-left` for more granular control. When you add padding, the total size of the element increases unless you use the `box-sizing: border-box` property, which is a standard practice in modern development.\n\nAdd 20px of padding to the .box class to see how it expands the background area around the text.',
        task: 'Set padding: 20px on .box',
        initial_code: '<style>\n  .box {\n    background: #00F5D4;\n    color: #080b10;\n    font-weight: bold;\n    /* Add padding here */\n  }\n</style>\n<div class="box">Spacious Box</div>\n\n<!-- Pro-Tip: Always set "box-sizing: border-box" at the top of your CSS to make layout math much easier to manage! -->',
      },
    ]
  },
  {
    id: 'css-flexbox', title: 'CSS Flexbox', level: 'beginner', language: 'css',
    description: 'Master the modern flexbox layout system used by professional developers to build responsive, one-dimensional layouts.',
    exercises: [
      {
        title: 'Enable Flexbox',
        instruction: 'Imagine you have a shelf of books. Normally, books stack top-to-bottom because that is how the browser renders block elements. But what if you want them side-by-side, like on a bookshelf? That is exactly what **Flexbox** does — it changes how child elements are arranged inside a container.\n\nFlexbox is activated by setting **display: flex** on a parent element (the "flex container"). Once activated, all direct children become **flex items** and automatically line up in a horizontal row — the default **flex-direction** is "row". This is one of the most powerful CSS properties because it instantly transforms a vertical stack into a horizontal layout with zero math.\n\nBefore Flexbox, developers used painful hacks like **float: left** and **clearfix** to achieve horizontal layouts. These hacks were fragile, hard to maintain, and caused countless bugs with element overlap. Flexbox replaced all of that with a clean, predictable system that became a CSS standard in 2017.\n\nThe **flex container** controls the overall layout direction, while each **flex item** can individually control how much space it takes using properties like **flex-grow**, **flex-shrink**, and **flex-basis**. You will learn these advanced properties in later exercises.\n\n**Pro-Tip:** Flexbox is designed for **one-dimensional** layouts (either a row OR a column). If you need a two-dimensional layout (rows AND columns simultaneously), you should use CSS Grid instead. Knowing when to use Flexbox vs. Grid is a key skill that separates junior developers from senior ones.\n\nAdd display: flex to .container to arrange the items horizontally.',
        task: 'Set display: flex on the .container class to make child items line up in a row.',
        initial_code: '<style>\n  .container {\n    background: #1a1a2e;\n    padding: 20px;\n    /* Enable flex here */\n  }\n  .item { background: #00f5d4; color: black; padding: 10px 20px; margin: 5px; border-radius: 8px; }\n</style>\n<div class="container">\n  <div class="item">A</div>\n  <div class="item">B</div>\n  <div class="item">C</div>\n</div>\n\n<!-- Pro-Tip: Once you set display: flex, ALL direct children become flex items automatically — no extra classes needed! -->',
      },
      {
        title: 'Justify & Align',
        instruction: 'Now that your flex container is active, it is time to learn the two most important alignment properties in all of CSS: **justify-content** and **align-items**.\n\nThink of it like a remote control for your layout. **justify-content** controls positioning along the **main axis** (horizontal by default). Common values include "center" (centers items), "space-between" (spreads items with space between them), "space-around" (adds equal space around each item), and "flex-end" (pushes items to the right).\n\n**align-items** controls positioning along the **cross axis** (vertical by default). Common values include "center" (vertically centers items), "flex-start" (pushes to top), "flex-end" (pushes to bottom), and "stretch" (fills the entire height — the default behavior).\n\nThe combination of **justify-content: center** and **align-items: center** is perhaps the most famous CSS trick of all time. Before Flexbox, perfectly centering an element both horizontally and vertically was one of the hardest problems in web development, requiring complex calculations with margins and transforms. With Flexbox, it takes exactly two lines of code.\n\nFor this to work vertically, the container must have a defined **height**. Without a height, the container collapses to fit its content, and vertical centering becomes invisible.\n\n**Pro-Tip:** The "main axis" and "cross axis" swap when you change flex-direction to "column." In column mode, justify-content controls vertical positioning and align-items controls horizontal positioning. This trips up even experienced developers!\n\nCenter the item both horizontally and vertically inside the container (the container already has height: 200px).',
        task: 'Add justify-content: center and align-items: center to the .container to perfectly center the child element.',
        initial_code: '<style>\n  .container {\n    display: flex;\n    background: #1a1a2e;\n    height: 200px;\n    /* Add justify-content and align-items */\n  }\n  .item { background: #00f5d4; color: black; padding: 15px 25px; border-radius: 8px; }\n</style>\n<div class="container">\n  <div class="item">Centered!</div>\n</div>\n\n<!-- Common Pitfall: If your vertical centering is not working, check that the container has an explicit height set! -->',
      },
      {
        title: 'Flex Direction & Wrap',
        instruction: 'By default, Flexbox arranges items in a **row** (left to right). But real-world layouts often need items to stack **vertically** — for example, a sidebar menu where links go top-to-bottom. The **flex-direction** property lets you change the main axis.\n\nSetting **flex-direction: column** rotates the layout 90 degrees so items stack vertically instead of horizontally. Other values include "row-reverse" (right to left) and "column-reverse" (bottom to top), which are useful for special layouts like chat messages that appear newest-first.\n\nThe second critical property here is **flex-wrap**. By default, Flexbox tries to squeeze all items into a single line, even if it means shrinking them below their natural size. Setting **flex-wrap: wrap** tells Flexbox to allow items to flow onto the next line when there is not enough space. This is essential for building responsive layouts — on a phone, items naturally wrap into a vertical stack, while on a desktop they spread across the row.\n\nYou can combine both properties into the shorthand **flex-flow**. For example, "flex-flow: column wrap" sets both direction and wrapping in one declaration. Professional developers almost always use the shorthand to keep their CSS concise.\n\n**Pro-Tip:** When using flex-wrap, combine it with a **gap** property (e.g., gap: 10px) to add consistent spacing between items. This is much cleaner than using margins, which can cause uneven spacing at the edges of your container.\n\nSet .container to column direction and allow wrapping.',
        task: 'Add flex-direction: column and flex-wrap: wrap to the .container.',
        initial_code: '<style>\n  .container {\n    display: flex;\n    background: #1a1a2e;\n    padding: 20px;\n    /* Add direction and wrap */\n  }\n  .item { background: #ffd60a; color: black; padding: 10px; margin: 5px; border-radius: 8px; }\n</style>\n<div class="container">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n</div>\n\n<!-- Pro-Tip: Use the shorthand "flex-flow: column wrap" to set both properties in a single line! -->',
      },
    ]
  },
  {
    id: 'css-grid', title: 'CSS Grid & Responsive', level: 'beginner', language: 'css',
    description: 'Build complex responsive layouts with CSS Grid and media queries — the two-dimensional layout system that powers modern web design.',
    exercises: [
      {
        title: 'Your First Grid',
        instruction: 'If Flexbox is a bookshelf (one-dimensional), then **CSS Grid** is a chessboard — it lets you control **both rows and columns** simultaneously. This makes Grid the most powerful layout system in CSS, ideal for complex page structures like dashboards, galleries, and entire page layouts.\n\nTo activate Grid, set **display: grid** on a container. Then define columns using **grid-template-columns**. The **fr** unit (fraction) is a special Grid unit that distributes available space proportionally. Writing "1fr 1fr 1fr" creates three columns of equal width. You could also write "2fr 1fr" to make the first column twice as wide as the second.\n\nThe **gap** property adds consistent spacing between grid cells without needing margins. Before the gap property existed, developers used padding hacks that caused headaches with alignment. Gap is clean, predictable, and works in both Grid and Flexbox.\n\nGrid automatically places child elements into the defined cells in order. If you have 6 items and 3 columns, Grid creates 2 rows automatically. You can also explicitly control row heights using **grid-template-rows**.\n\n**Pro-Tip:** Use "repeat(3, 1fr)" instead of "1fr 1fr 1fr" for cleaner code. For auto-responsive grids, the pattern "grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))" creates a fully responsive grid without any media queries — items automatically wrap based on available space.\n\nCreate a 3-column grid where each column takes equal space (1fr each).',
        task: 'Set display: grid and grid-template-columns: 1fr 1fr 1fr on the .grid container.',
        initial_code: '<style>\n  .grid {\n    background: #0d131a;\n    padding: 20px;\n    gap: 15px;\n    /* Add grid styles */\n  }\n  .cell { background: #00f5d4; color: black; padding: 20px; border-radius: 8px; text-align: center; font-weight: bold; }\n</style>\n<div class="grid">\n  <div class="cell">1</div>\n  <div class="cell">2</div>\n  <div class="cell">3</div>\n  <div class="cell">4</div>\n  <div class="cell">5</div>\n  <div class="cell">6</div>\n</div>\n\n<!-- Pro-Tip: Use repeat(3, 1fr) as a shorthand for 1fr 1fr 1fr! -->',
      },
      {
        title: 'Media Queries',
        instruction: 'Your grid looks great on a desktop, but what happens when a user opens your site on a phone? The three columns get squeezed into a tiny screen and become unreadable. This is where **media queries** come in — they let you apply different CSS rules based on the user\'s screen size.\n\nThe syntax is **@media (max-width: 600px) { ... }**, which means "apply these styles only when the screen is 600 pixels wide or smaller." Inside the curly braces, you override the grid to show a single column: "grid-template-columns: 1fr".\n\nThe number 600px is called a **breakpoint** — it is the threshold where your layout switches from one design to another. Common industry breakpoints are 768px (tablet), 1024px (small laptop), and 1440px (desktop). Professional developers typically use a **mobile-first** approach, where the base CSS targets phones and media queries add complexity for larger screens.\n\nMedia queries can test for many conditions beyond width: screen orientation, pixel density (for Retina displays), and even whether the user prefers dark mode using "prefers-color-scheme: dark".\n\n**Pro-Tip:** Place your @media queries at the bottom of your CSS file, after all base styles. If you put them in the middle, they can be overridden by later rules due to the CSS cascade.\n\nAdd a media query that switches the grid to a single column on screens narrower than 600px.',
        task: 'Add a @media (max-width: 600px) block that sets .grid to grid-template-columns: 1fr.',
        initial_code: '<style>\n  .grid {\n    display: grid;\n    grid-template-columns: 1fr 1fr 1fr;\n    gap: 15px;\n    padding: 20px;\n    background: #0d131a;\n  }\n  /* Add media query here */\n  .cell { background: #ffd60a; color: black; padding: 20px; border-radius: 8px; text-align: center; }\n</style>\n<div class="grid">\n  <div class="cell">A</div>\n  <div class="cell">B</div>\n  <div class="cell">C</div>\n</div>\n\n<!-- Common Pitfall: Make sure your @media block comes AFTER the .grid rule! -->',
      },
    ]
  },
  {
    id: 'js-fundamentals', title: 'JavaScript Fundamentals', level: 'beginner', language: 'javascript',
    description: 'Bring your websites to life with logic, variables, functions, and data structures — the core building blocks of every web application.',
    exercises: [
      {
        title: 'Variables & Data Types',
        instruction: 'Think of a **variable** like a labeled box in a warehouse. The label is the variable name, and the contents are the value. In JavaScript, you create variables using two keywords: **const** and **let**.\n\n**const** (short for "constant") creates a variable whose value cannot be reassigned after creation. Use it for values that should never change — like a user\'s ID or a configuration setting. **let** creates a variable that CAN be reassigned later — like a score counter or a shopping cart total.\n\nThere is also a legacy keyword called **var**, but modern JavaScript developers avoid it because it has confusing scoping rules that lead to bugs. Always prefer const by default, and only use let when you explicitly need to reassign.\n\nJavaScript has several **data types**: strings (text in quotes), numbers (integers and decimals), booleans (true/false), null (intentionally empty), undefined (not yet assigned), and objects (complex structures). Understanding types is crucial because JavaScript is **dynamically typed** — it does not enforce types at compile time, which means bugs from type mismatches are common.\n\n**Pro-Tip:** Always declare variables with const first. Only switch to let if you discover you need to reassign the value later. This "const-first" habit prevents accidental mutations and makes your code more predictable.\n\nCreate a const called name with your name, and a let called age with your age. Then use console.log() to print both.',
        task: 'Declare a const named "name" (string) and a let named "age" (number), then console.log both values.',
        initial_code: '// Declare your variables here\n\n// Log them\n\n// Pro-Tip: Use const by default, only use let when you need to reassign!',
        test_cases: { expected_output: 'console.log' }
      },
      {
        title: 'Mastering Functions',
        instruction: 'A **function** is like a recipe card in a kitchen. You write the instructions once, give it a name, and then "call" it whenever you need that dish made. Without functions, you would copy-paste the same code everywhere — a maintenance nightmare.\n\nYou define a function using the **function** keyword, followed by a name, parentheses for **parameters** (inputs), and curly braces for the code body. **Parameters** are placeholders that receive values (called **arguments**) when the function is called.\n\nThe **return** keyword sends a value back to wherever the function was called. Without return, the function produces no output (it returns "undefined"). Modern JavaScript also supports **arrow functions** — a shorter syntax: "const greet = (name) => { ... }".\n\n**Pro-Tip:** A function should do ONE thing well. If it is longer than 10-15 lines, break it into smaller functions. This is called the "Single Responsibility Principle" and is a hallmark of clean code.\n\nCreate a function named greetUser that takes a name parameter and returns "Hello, [name]!".',
        task: 'Define a function greetUser(name) that returns the string "Hello, [name]!" using the name parameter.',
        initial_code: '// Write your function here\n\nconsole.log(greetUser("Student"));\n\n// Common Pitfall: Forgetting "return" means your function outputs undefined!',
      },
      {
        title: 'Arrays',
        instruction: 'An **array** is like a numbered filing cabinet. Each drawer has an **index** (starting at 0) and holds a value. Arrays store ordered collections — like usernames, quiz scores, or shopping cart items.\n\nCreate an array with square brackets: **const fruits = ["apple", "banana", "cherry"]**. Access items by index: **fruits[0]** returns "apple". The index starting at 0 is called **zero-based indexing** and is universal across nearly all programming languages.\n\nArrays have powerful built-in **methods**: **.push()** (adds to end), **.pop()** (removes from end), **.length** (returns count), **.map()** (transforms every item), **.filter()** (keeps items matching a condition), and **.find()** (returns first match). These are the backbone of modern JavaScript.\n\n**Pro-Tip:** Never access an index that does not exist. If your array has 3 items, accessing fruits[10] returns "undefined" — not an error. Always check .length before accessing by index.\n\nCreate an array called fruits with 3 fruit names. Then log the first item using fruits[0].',
        task: 'Create a const array named "fruits" with 3 strings, then console.log(fruits[0]).',
        initial_code: '// Create your array here\n\n// Log the first item\n\n// Pro-Tip: Arrays are zero-indexed — the first item is at index 0!',
      },
      {
        title: 'Objects',
        instruction: 'If arrays are filing cabinets with numbered drawers, **objects** are cabinets with labeled drawers. Instead of accessing data by index, you use a descriptive **key** like "name" or "email". This makes objects perfect for representing real-world entities.\n\nCreate an object with curly braces: **const person = { name: "Alex", age: 25, job: "Developer" }**. Each entry is a **key-value pair**. Access values with **dot notation** (person.name) or **bracket notation** (person["name"]).\n\nObjects can contain any data type as values — strings, numbers, arrays, even other objects. In real-world development, API responses are almost always **JSON** (JavaScript Object Notation) — which is literally this syntax. Mastering objects means you can work with any API.\n\n**Pro-Tip:** Use **destructuring** to extract values cleanly: "const { name, age } = person;" creates two variables instantly. This is heavily used in React for extracting props.\n\nCreate an object called person with name, age, and job properties. Log the name.',
        task: 'Create a const object named "person" with keys name, age, and job, then console.log(person.name).',
        initial_code: '// Create your object here\n\n// Log the name property\n\n// Pro-Tip: Use destructuring — const { name } = person — for cleaner code!',
      },
      {
        title: 'Loops',
        instruction: 'Imagine you are a teacher grading 100 essays. You would not write 100 individual instructions — you would write ONE set and repeat it. That is exactly what **loops** do.\n\nThe **for loop** has three parts: **initialization** (let i = 1), a **condition** (i <= 5), and an **increment** (i++). The loop checks the condition before each iteration — if true, it runs; if false, it stops.\n\nJavaScript also has **while** loops, **do...while** loops, and modern methods like **.forEach()** and **.map()** that loop through arrays without manual index management.\n\nLoops are powerful but dangerous: **infinite loops** (where the condition never becomes false) crash the browser. Always ensure your loop has a clear exit condition.\n\n**Pro-Tip:** In modern JavaScript, prefer **.forEach()** or **.map()** over traditional for loops when iterating arrays. They are more readable and less error-prone.\n\nWrite a for loop that logs numbers 1 to 5.',
        task: 'Write a for loop starting at 1, ending at 5, that uses console.log to print each number.',
        initial_code: '// Write your loop here\n\n// Common Pitfall: Forgetting i++ creates an infinite loop!',
      },
    ]
  },
  {
    id: 'dom-manipulation', title: 'DOM Manipulation', level: 'beginner', language: 'html',
    description: 'Use JavaScript to make web pages interactive by reading, modifying, and creating elements in the Document Object Model.',
    exercises: [
      {
        title: 'Selecting Elements',
        instruction: 'The **DOM** (Document Object Model) is the browser\'s internal representation of your HTML page as a tree of objects. Every tag becomes a "node" in this tree, and JavaScript can read, modify, or delete any node. This is what makes web pages **interactive**.\n\nThe most fundamental DOM method is **document.getElementById()**. You pass it a string matching an element\'s **id** attribute, and it returns a reference to that element. Once you have this reference, you can change its text content using the **.textContent** property, modify its HTML using **.innerHTML**, or alter its styles, classes, and attributes.\n\nThere are other selection methods too: **document.querySelector()** selects the first element matching a CSS selector (very powerful), **document.querySelectorAll()** returns all matching elements, and **document.getElementsByClassName()** selects by class name.\n\nIn professional development, DOM manipulation is the foundation of every interactive feature — from toggling dark mode to building infinite scroll feeds. React, Vue, and Angular all abstract over these methods, but understanding raw DOM manipulation is essential for debugging and performance optimization.\n\n**Pro-Tip:** Use querySelector() instead of getElementById() in modern code. It accepts any CSS selector (like ".class", "#id", or "div > p"), making it far more flexible. However, getElementById() is slightly faster for simple ID lookups.\n\nComplete the changeText() function to change the h1 text to "I clicked it!" when the button is clicked.',
        task: 'Inside changeText(), use document.getElementById("title").textContent = "I clicked it!" to update the heading.',
        initial_code: '<!DOCTYPE html>\n<html>\n<body>\n  <h1 id="title">Click the button!</h1>\n  <button onclick="changeText()">Click Me</button>\n  <script>\n    function changeText() {\n      // Change the h1 text here\n    }\n  </script>\n</body>\n</html>\n\n<!-- Pro-Tip: Use .textContent for plain text, .innerHTML only when you need to insert HTML tags! -->',
      },
      {
        title: 'Changing Styles',
        instruction: 'Beyond changing text, JavaScript can modify any CSS property on an element through the **element.style** property. This lets you create dynamic visual effects — hover animations, theme toggles, loading indicators, and more.\n\nThe syntax is: **element.style.propertyName = "value"**. Note that CSS property names with hyphens (like "background-color") are written in **camelCase** in JavaScript: "backgroundColor". This is because hyphens are not valid in JavaScript property names.\n\nCommon style manipulations include changing **backgroundColor**, **color**, **display** (to show/hide elements), **opacity** (for fade effects), and **transform** (for animations). You can even add transitions in CSS and then toggle classes with JavaScript to create smooth, performant animations.\n\nFor more complex style changes, professional developers prefer toggling **CSS classes** using **element.classList.add()**, **.remove()**, or **.toggle()** instead of setting individual styles. This keeps your styling in CSS (where it belongs) and your logic in JavaScript.\n\n**Pro-Tip:** Avoid setting styles directly with element.style in production code. Instead, define CSS classes like ".active" or ".hidden" and toggle them with classList.toggle("active"). This is cleaner, more maintainable, and leverages CSS caching for better performance.\n\nComplete the changeColor() function to change the box background color to "cyan" when the button is clicked.',
        task: 'Inside changeColor(), use document.getElementById("box").style.backgroundColor = "cyan" to update the color.',
        initial_code: '<!DOCTYPE html>\n<html>\n<body>\n  <div id="box" style="width:100px;height:100px;background:red;border-radius:8px;"></div>\n  <br>\n  <button onclick="changeColor()">Change Color</button>\n  <script>\n    function changeColor() {\n      // Change the background color here\n    }\n  </script>\n</body>\n</html>\n\n<!-- Common Pitfall: CSS "background-color" becomes "backgroundColor" in JavaScript — no hyphens allowed! -->',
      },
    ]
  },
  {
    id: 'js-events', title: 'JS Events & Forms', level: 'beginner', language: 'html',
    description: 'Handle user interactions with JavaScript event listeners — the professional way to build interactive web applications.',
    exercises: [
      {
        title: 'Event Listeners',
        instruction: 'In the previous lesson, you used **onclick** directly in the HTML to handle clicks. While this works, professional developers avoid inline event handlers because they mix JavaScript logic into HTML, making code harder to maintain and debug.\n\nThe modern approach is **addEventListener()**. This method attaches an event handler to an element entirely from JavaScript. The syntax is: **element.addEventListener("eventType", callbackFunction)**. The first argument is the event type (like "click", "mouseover", "keydown", "submit"), and the second is the function to run when that event fires.\n\nThe biggest advantage of addEventListener over onclick is that you can attach **multiple handlers** to the same element. With onclick, each new assignment overwrites the previous one. addEventListener stacks them, so all handlers run in order.\n\nEvents also "**bubble**" up the DOM tree — a click on a button also triggers click events on its parent div, the body, and the document. This behavior is called **event propagation** and is the foundation of a powerful pattern called **event delegation**, where you listen on a parent element and handle clicks for dynamically created children.\n\n**Pro-Tip:** Always use addEventListener instead of inline onclick attributes. It keeps your HTML clean, your JavaScript organized, and makes it easy to remove listeners later with removeEventListener — essential for preventing memory leaks in single-page applications.\n\nAdd a click event listener to the button that logs "Button clicked!" to the console.',
        task: 'Use btn.addEventListener("click", function() { console.log("Button clicked!"); }) to attach the handler.',
        initial_code: '<!DOCTYPE html>\n<html>\n<body>\n  <button id="btn">Click Me</button>\n  <script>\n    const btn = document.getElementById("btn");\n    // Add event listener here\n  </script>\n</body>\n</html>\n\n<!-- Pro-Tip: You can listen for "mouseover", "keydown", "scroll", and dozens of other event types! -->',
      },
      {
        title: 'Form Validation',
        instruction: 'When a user submits a form, the browser\'s default behavior is to reload the page and send the data to a server. In modern single-page applications (SPAs), you almost always want to **prevent** this default behavior and handle the submission with JavaScript instead.\n\nThe **event.preventDefault()** method stops the browser from performing its default action. For forms, this means the page will NOT reload, giving your JavaScript full control over what happens next — you can validate inputs, show error messages, or send data to an API using fetch().\n\n**Form validation** is checking that user input meets your requirements before processing it. Common validations include: checking that required fields are not empty, verifying email formats, ensuring passwords meet length requirements, and confirming that numeric fields contain valid numbers.\n\nThe pattern is: listen for the "submit" event on the form, call preventDefault(), read input values with **document.getElementById("inputId").value**, check the values, and show appropriate feedback. This client-side validation provides instant feedback to users, but remember — you must ALSO validate on the server side because client-side validation can be bypassed.\n\n**Pro-Tip:** Use the HTML5 "required" attribute on inputs for basic validation that works without JavaScript. Combine it with JavaScript validation for custom rules and better user experience. Never rely solely on client-side validation for security-critical checks.\n\nPrevent the form from submitting and show an alert if the name field is empty.',
        task: 'Call e.preventDefault(), then check if the name input value is empty. If empty, show an alert saying "Name is required!".',
        initial_code: '<!DOCTYPE html>\n<html>\n<body>\n  <form id="myForm">\n    <input type="text" id="name" placeholder="Your name" />\n    <button type="submit">Submit</button>\n  </form>\n  <script>\n    document.getElementById("myForm").addEventListener("submit", function(e) {\n      // Validate here\n    });\n  </script>\n</body>\n</html>\n\n<!-- Common Pitfall: Forgetting e.preventDefault() means the page reloads and you lose all your JavaScript state! -->',
      },
    ]
  },
        initial_code: '<!DOCTYPE html>\n<html>\n<body>\n  <h1 id="title">Click the button!</h1>\n  <button onclick="changeText()">Click Me</button>\n  <script>\n    function changeText() {\n      // Change the h1 text here\n    }\n  </script>\n</body>\n</html>',
      },
      {
        title: 'Changing Styles',
        instruction: 'element.style lets you change CSS from JavaScript.\n\nClick the button to change the box background color to "cyan".',
        task: 'Change the .box background color to cyan on button click.',
        initial_code: '<!DOCTYPE html>\n<html>\n<body>\n  <div id="box" style="width:100px;height:100px;background:red;border-radius:8px;"></div>\n  <br>\n  <button onclick="changeColor()">Change Color</button>\n  <script>\n    function changeColor() {\n      // Change the background color here\n    }\n  </script>\n</body>\n</html>',
      },
    ]
  },
  {
    id: 'js-events', title: 'JS Events & Forms', level: 'beginner', language: 'html',
    description: 'Handle user interactions with JavaScript event listeners.',
    exercises: [
      {
        title: 'Event Listeners',
        instruction: 'addEventListener attaches event handlers to elements without using inline onclick.\n\nAdd a click event listener to the button that logs "Button clicked!" to the console.',
        task: 'Use addEventListener("click", ...) on the button.',
        initial_code: '<!DOCTYPE html>\n<html>\n<body>\n  <button id="btn">Click Me</button>\n  <script>\n    const btn = document.getElementById("btn");\n    // Add event listener here\n  </script>\n</body>\n</html>',
      },
      {
        title: 'Form Validation',
        instruction: 'Prevent form submission with event.preventDefault() and validate input.\n\nPrevent the form from submitting and show an alert if the name field is empty.',
        task: 'Validate the form: show alert if name is empty.',
        initial_code: '<!DOCTYPE html>\n<html>\n<body>\n  <form id="myForm">\n    <input type="text" id="name" placeholder="Your name" />\n    <button type="submit">Submit</button>\n  </form>\n  <script>\n    document.getElementById("myForm").addEventListener("submit", function(e) {\n      // Validate here\n    });\n  </script>\n</body>\n</html>',
      },
    ]
  },

  // ─── PRO TRACK ────────────────────────────────────────────────
  {
    id: 'react-components', title: 'React Components', level: 'pro', language: 'javascript',
    description: 'Build reusable UI components with React and JSX.',
    exercises: [
      {
        title: 'Your First Component',
        instruction: 'React components are JavaScript functions that return JSX (HTML-like syntax).\n\nCreate a functional component called Greeting that returns <h1>Hello, React!</h1>. Then render it.',
        task: 'Create and render a Greeting component.',
        initial_code: '// Write your Greeting component\nfunction Greeting() {\n  // Return JSX here\n}\n\n// Render it\nconsole.log("Greeting component created!");\n',
      },
      {
        title: 'Props',
        instruction: 'Props let you pass data into components, making them reusable.\n\nCreate a Card component that accepts a title prop and displays it in an <h2>.',
        task: 'Create Card({ title }) that renders <h2>{title}</h2>',
        initial_code: '// Create Card component with title prop\nfunction Card(props) {\n  // Return h2 with props.title\n}\n\nconsole.log("Card component ready!");\n',
      },
      {
        title: 'State with useState',
        instruction: 'useState lets components remember and update values.\n\nCreate a counter that starts at 0. Clicking "+" increases it, "-" decreases it.',
        task: 'Use useState to build a counter with + and - buttons.',
        initial_code: '// Counter component using useState\n// import React, { useState } from "react";\n\nfunction Counter() {\n  // Add state here\n  return (\n    <div>\n      <button>-</button>\n      <span>0</span>\n      <button>+</button>\n    </div>\n  );\n}\n',
      },
    ]
  },
  {
    id: 'react-hooks', title: 'React Hooks', level: 'pro', language: 'javascript',
    description: 'Master useEffect, useCallback, and custom hooks.',
    exercises: [
      {
        title: 'useEffect Basics',
        instruction: 'useEffect runs code after the component renders. The dependency array controls when it re-runs.\n\nLog "Component mounted!" when the component first renders (empty dependency array).',
        task: 'Use useEffect with [] to log on mount.',
        initial_code: '// import { useEffect } from "react";\n\nfunction MyComponent() {\n  // Add useEffect here\n  \n  return <div>Check the console!</div>;\n}\n',
      },
      {
        title: 'Fetching Data',
        instruction: 'useEffect is perfect for fetching data when a component loads.\n\nFetch users from https://jsonplaceholder.typicode.com/users and log the first user\'s name.',
        task: 'Fetch from the API in useEffect and log data.',
        initial_code: '// Fetch data with useEffect\nasync function loadUsers() {\n  const res = await fetch("https://jsonplaceholder.typicode.com/users");\n  const data = await res.json();\n  // Log the first user\'s name here\n}\n\nloadUsers();\n',
      },
    ]
  },
  {
    id: 'node-express', title: 'Node.js & Express', level: 'pro', language: 'javascript',
    description: 'Build backend APIs with Node.js and the Express framework.',
    exercises: [
      {
        title: 'Express Hello World',
        instruction: 'Express is a minimal Node.js framework for building APIs.\n\nWrite an Express route GET /hello that responds with { message: "Hello World" }.',
        task: 'Create a GET /hello route that returns JSON.',
        initial_code: 'const express = require("express");\nconst app = express();\n\n// Add your GET /hello route here\n\napp.listen(3000, () => console.log("Server running on port 3000"));\n',
      },
      {
        title: 'Route Parameters',
        instruction: 'Express uses :paramName for dynamic URL segments.\n\nCreate a GET /user/:id route that responds with { userId: id }.',
        task: 'Create GET /user/:id route returning the id as JSON.',
        initial_code: 'const express = require("express");\nconst app = express();\n\n// Add your /user/:id route here\n\napp.listen(3000);\n',
      },
    ]
  },
  {
    id: 'api-fetching', title: 'Fetch API & Async', level: 'pro', language: 'javascript',
    description: 'Master async/await and the Fetch API for real-world data.',
    exercises: [
      {
        title: 'Async/Await',
        instruction: 'async/await makes asynchronous code read like synchronous code.\n\nWrite an async function fetchData that fetches https://jsonplaceholder.typicode.com/posts/1 and returns the title.',
        task: 'Create async fetchData() that returns the post title.',
        initial_code: '// Write your async function\nasync function fetchData() {\n  // Fetch and return the title\n}\n\nfetchData().then(title => console.log(title));\n',
      },
      {
        title: 'Error Handling',
        instruction: 'Always wrap fetch calls in try/catch to handle network errors gracefully.\n\nWrap your fetch in try/catch and log a friendly error message if it fails.',
        task: 'Add try/catch with a friendly error message.',
        initial_code: 'async function fetchData(url) {\n  // Add try/catch around the fetch\n  const res = await fetch(url);\n  const data = await res.json();\n  return data;\n}\n\nfetchData("https://invalid-url-xyz.com").then(console.log);\n',
      },
    ]
  },

  // ─── MASTER TRACK ─────────────────────────────────────────────
  {
    id: 'system-design', title: 'System Design Basics', level: 'master', language: 'javascript',
    description: 'Learn to design scalable, production-ready systems.',
    exercises: [
      {
        title: 'REST API Design',
        instruction: 'Good REST APIs follow conventions: GET for reading, POST for creating, PUT for updating, DELETE for removing.\n\nWrite comments describing what endpoints a "todo app" REST API would need.',
        task: 'Document 4 REST endpoints for a todo app (comments only).',
        initial_code: '// REST API for a Todo App\n// Document your endpoints here:\n\n// GET   /todos       → \n// POST  /todos       → \n// PUT   /todos/:id   → \n// DELETE /todos/:id  → \n\nconsole.log("API design documented!");\n',
      },
    ]
  },
  {
    id: 'data-structures', title: 'Data Structures', level: 'master', language: 'javascript',
    description: 'Master the data structures used in technical interviews.',
    exercises: [
      {
        title: 'Linked List',
        instruction: 'A linked list is a chain of nodes where each node holds a value and a pointer to the next node.\n\nCreate a Node class with value and next properties. Create 3 nodes and link them.',
        task: 'Create 3 linked Node objects.',
        initial_code: '// Create a Node class\nclass Node {\n  // Add constructor with value and next\n}\n\n// Create and link 3 nodes\nconst node1 = new Node(1);\nconst node2 = new Node(2);\nconst node3 = new Node(3);\n// Link them here\n\nconsole.log(node1.next.value); // Should log 2\n',
      },
      {
        title: 'Stack (LIFO)',
        instruction: 'A stack is a Last-In-First-Out structure. Like a stack of plates.\n\nImplement a Stack class with push(), pop(), and peek() methods.',
        task: 'Build a Stack with push, pop, and peek methods.',
        initial_code: 'class Stack {\n  constructor() {\n    this.items = [];\n  }\n  \n  // Add push(item), pop(), peek() methods\n}\n\nconst s = new Stack();\ns.push(1); s.push(2); s.push(3);\nconsole.log(s.peek()); // 3\nconsole.log(s.pop());  // 3\nconsole.log(s.peek()); // 2\n',
      },
      {
        title: 'Binary Search',
        instruction: 'Binary search finds an item in a sorted array in O(log n) time by repeatedly halving the search space.\n\nImplement binarySearch(arr, target) that returns the index of target, or -1 if not found.',
        task: 'Implement binary search returning the index or -1.',
        initial_code: 'function binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  \n  // Implement binary search here\n}\n\nconst arr = [1, 3, 5, 7, 9, 11, 13];\nconsole.log(binarySearch(arr, 7));  // 3\nconsole.log(binarySearch(arr, 6));  // -1\n',
      },
    ]
  },
];

// Helper: get lessons grouped by level
export const getLessonsByLevel = (level) =>
  clientCurriculum.filter(l => l.level === level);

// Helper: get a specific lesson
export const getLessonById = (id) =>
  clientCurriculum.find(l => l.id === id);
