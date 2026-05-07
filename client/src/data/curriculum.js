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
    description: 'Build accessible, structured web pages using semantic HTML5 elements.',
    exercises: [
      {
        title: 'Semantic Layout',
        instruction: 'HTML5 has semantic tags that describe content: <header>, <main>, <footer>, <article>, <section>.\n\nWrap the heading in a <header> and the paragraph in <main>.',
        task: 'Use <header> and <main> to structure the page.',
        initial_code: '<h1>My Blog</h1>\n<p>Welcome to my blog!</p>',
      },
      {
        title: 'Forms & Inputs',
        instruction: 'Forms collect user input using <form>, <input>, <label>, and <button>.\n\nCreate a form with a text input labeled "Name" and a submit button.',
        task: 'Build a form with a labeled input and submit button.',
        initial_code: '<!-- Build your form here -->\n',
      },
      {
        title: 'Tables',
        instruction: 'Tables organize data in rows and columns using <table>, <tr>, <th>, and <td>.\n\nCreate a 2-column table with headers "Name" and "Score" and 2 data rows.',
        task: 'Create a table with 2 columns and 2 data rows.',
        initial_code: '<!-- Create table here -->\n',
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
    description: 'Master the modern flexbox layout system to build responsive UIs.',
    exercises: [
      {
        title: 'Enable Flexbox',
        instruction: 'Flexbox is activated by setting display: flex on a container. By default, children line up in a row.\n\nAdd display: flex to .container.',
        task: 'Set display: flex on .container',
        initial_code: '<style>\n  .container {\n    background: #1a1a2e;\n    padding: 20px;\n    /* Enable flex here */\n  }\n  .item { background: #00f5d4; color: black; padding: 10px 20px; margin: 5px; border-radius: 8px; }\n</style>\n<div class="container">\n  <div class="item">A</div>\n  <div class="item">B</div>\n  <div class="item">C</div>\n</div>',
      },
      {
        title: 'Justify & Align',
        instruction: 'justify-content controls horizontal alignment. align-items controls vertical alignment.\n\nCenter items both horizontally and vertically in the container (height: 200px).',
        task: 'Use justify-content: center and align-items: center',
        initial_code: '<style>\n  .container {\n    display: flex;\n    background: #1a1a2e;\n    height: 200px;\n    /* Add justify-content and align-items */\n  }\n  .item { background: #00f5d4; color: black; padding: 15px 25px; border-radius: 8px; }\n</style>\n<div class="container">\n  <div class="item">Centered!</div>\n</div>',
      },
      {
        title: 'Flex Direction & Wrap',
        instruction: 'flex-direction changes the main axis (row or column). flex-wrap allows items to wrap to the next line.\n\nSet .container to column direction and allow wrapping.',
        task: 'Set flex-direction: column and flex-wrap: wrap',
        initial_code: '<style>\n  .container {\n    display: flex;\n    background: #1a1a2e;\n    padding: 20px;\n    /* Add direction and wrap */\n  }\n  .item { background: #ffd60a; color: black; padding: 10px; margin: 5px; border-radius: 8px; }\n</style>\n<div class="container">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n</div>',
      },
    ]
  },
  {
    id: 'css-grid', title: 'CSS Grid & Responsive', level: 'beginner', language: 'css',
    description: 'Build complex responsive layouts with CSS Grid and media queries.',
    exercises: [
      {
        title: 'Your First Grid',
        instruction: 'CSS Grid creates two-dimensional layouts. Use display: grid and grid-template-columns to define columns.\n\nCreate a 3-column grid where each column takes equal space (1fr each).',
        task: 'Set display: grid and grid-template-columns: 1fr 1fr 1fr',
        initial_code: '<style>\n  .grid {\n    background: #0d131a;\n    padding: 20px;\n    gap: 15px;\n    /* Add grid styles */\n  }\n  .cell { background: #00f5d4; color: black; padding: 20px; border-radius: 8px; text-align: center; font-weight: bold; }\n</style>\n<div class="grid">\n  <div class="cell">1</div>\n  <div class="cell">2</div>\n  <div class="cell">3</div>\n  <div class="cell">4</div>\n  <div class="cell">5</div>\n  <div class="cell">6</div>\n</div>',
      },
      {
        title: 'Media Queries',
        instruction: 'Media queries make layouts responsive. @media (max-width: 600px) targets small screens.\n\nMake the .grid switch to a single column on screens narrower than 600px.',
        task: 'Add a @media query that sets grid-template-columns: 1fr at max-width: 600px',
        initial_code: '<style>\n  .grid {\n    display: grid;\n    grid-template-columns: 1fr 1fr 1fr;\n    gap: 15px;\n    padding: 20px;\n    background: #0d131a;\n  }\n  /* Add media query here */\n  .cell { background: #ffd60a; color: black; padding: 20px; border-radius: 8px; text-align: center; }\n</style>\n<div class="grid">\n  <div class="cell">A</div>\n  <div class="cell">B</div>\n  <div class="cell">C</div>\n</div>',
      },
    ]
  },
  {
    id: 'js-fundamentals', title: 'JavaScript Fundamentals', level: 'beginner', language: 'javascript',
    description: 'Bring your websites to life with logic, variables, and functions.',
    exercises: [
      {
        title: 'Variables & Data Types',
        instruction: 'JavaScript stores data in variables. Use let for values that change, const for ones that don\'t.\n\nCreate a const called name with your name, and a let called age with your age. Then console.log both.',
        task: 'Declare name and age variables and log them.',
        initial_code: '// Declare your variables here\n\n// Log them\n',
        test_cases: { expected_output: 'console.log' }
      },
      {
        title: 'Mastering Functions',
        instruction: 'Functions are reusable blocks of code. Create a function named greetUser that takes a name parameter and returns "Hello, [name]!".',
        task: 'Define greetUser(name) that returns "Hello, [name]!"',
        initial_code: '// Write your function here\n\nconsole.log(greetUser("Student"));\n',
      },
      {
        title: 'Arrays',
        instruction: 'Arrays store ordered lists of values. You can access items by index (starting at 0).\n\nCreate an array called fruits with 3 fruit names. Then log the first item.',
        task: 'Create a fruits array and log fruits[0]',
        initial_code: '// Create your array here\n\n// Log the first item\n',
      },
      {
        title: 'Objects',
        instruction: 'Objects store key-value pairs and represent real-world things.\n\nCreate an object called person with name, age, and job properties. Log the name.',
        task: 'Create a person object with 3 properties and log person.name',
        initial_code: '// Create your object here\n\n// Log the name property\n',
      },
      {
        title: 'Loops',
        instruction: 'Loops repeat code. A for loop runs a set number of times.\n\nWrite a for loop that logs numbers 1 to 5.',
        task: 'Write a for loop that logs 1, 2, 3, 4, 5',
        initial_code: '// Write your loop here\n',
      },
    ]
  },
  {
    id: 'dom-manipulation', title: 'DOM Manipulation', level: 'beginner', language: 'html',
    description: 'Use JavaScript to make web pages interactive by manipulating the DOM.',
    exercises: [
      {
        title: 'Selecting Elements',
        instruction: 'document.getElementById() selects an element by its id.\n\nClick the button to change the heading text to "I clicked it!".',
        task: 'Use getElementById to change the h1 text on button click.',
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
