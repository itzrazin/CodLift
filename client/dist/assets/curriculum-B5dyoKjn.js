var e=[{id:`html-basics`,title:`HTML Basics`,level:`beginner`,language:`html`,description:`Learn the foundational building blocks of every website.`,exercises:[{title:`The Skeleton of the Web`,instruction:`HTML (HyperText Markup Language) is the backbone of every website. Elements are defined by "tags" like <h1> for headings.

Change the text inside the <h1> tag to say "Hello CodLift".`,task:`Update the h1 tag text to: Hello CodLift`,initial_code:`<html>
  <body>
    <h1>Welcome</h1>
  </body>
</html>`},{title:`Paragraphs & Text`,instruction:`Paragraphs use the <p> tag. They separate blocks of text nicely.

Add a paragraph below the heading with the text "Learning to code is fun!".`,task:`Add a <p> tag with the text: Learning to code is fun!`,initial_code:`<h1>CodLift</h1>
<!-- Add paragraph here -->`},{title:`Hyperlinks & Navigation`,instruction:`The <a> tag creates clickable links. The href attribute sets the destination.

Create a link that says "Visit CodLift" pointing to "https://codlift.site".`,task:`Add: <a href="https://codlift.site">Visit CodLift</a>`,initial_code:`<p>Check out our site:</p>
<!-- Add link here -->`},{title:`Images`,instruction:`The <img> tag displays images. It uses src for the URL and alt for accessibility text.

Add an image with src="https://via.placeholder.com/300" and alt="Placeholder".`,task:`Add an <img> tag with the correct src and alt attributes.`,initial_code:`<h2>My Image</h2>
<!-- Add image here -->`},{title:`Lists`,instruction:`HTML has two types of lists:
• <ul> = unordered (bullet points)
• <ol> = ordered (numbered)

Create an unordered list with 3 items: HTML, CSS, JavaScript.`,task:`Create a <ul> with 3 <li> items.`,initial_code:`<h2>My Skills</h2>
<!-- Add unordered list here -->`}]},{id:`html-structure`,title:`HTML Structure & Semantics`,level:`beginner`,language:`html`,description:`Build accessible, structured web pages using semantic HTML5 elements.`,exercises:[{title:`Semantic Layout`,instruction:`HTML5 has semantic tags that describe content: <header>, <main>, <footer>, <article>, <section>.

Wrap the heading in a <header> and the paragraph in <main>.`,task:`Use <header> and <main> to structure the page.`,initial_code:`<h1>My Blog</h1>
<p>Welcome to my blog!</p>`},{title:`Forms & Inputs`,instruction:`Forms collect user input using <form>, <input>, <label>, and <button>.

Create a form with a text input labeled "Name" and a submit button.`,task:`Build a form with a labeled input and submit button.`,initial_code:`<!-- Build your form here -->
`},{title:`Tables`,instruction:`Tables organize data in rows and columns using <table>, <tr>, <th>, and <td>.

Create a 2-column table with headers "Name" and "Score" and 2 data rows.`,task:`Create a table with 2 columns and 2 data rows.`,initial_code:`<!-- Create table here -->
`}]},{id:`css-styling`,title:`CSS Styling`,level:`beginner`,language:`css`,description:`Transform plain HTML into beautiful interfaces with CSS.`,exercises:[{title:`Painting with CSS`,instruction:`CSS controls how HTML looks. The color property changes text color.

Change the color of the h1 to "cyan".`,task:`Set h1 { color: cyan; }`,initial_code:`<style>
  h1 {
    color: white;
  }
</style>
<h1>Colorful World</h1>`},{title:`The Box Model: Padding`,instruction:`Every element has a box model: content → padding → border → margin.

Add 20px of padding to the .box class.`,task:`Set padding: 20px on .box`,initial_code:`<style>
  .box {
    background: #00F5D4;
    /* Add padding here */
  }
</style>
<div class="box">Spacious Box</div>`},{title:`Background & Borders`,instruction:`CSS lets you set backgrounds and borders on elements.

Give .card a background-color of "#1a1a2e", border-radius of "12px", and padding of "24px".`,task:`Style .card with background, border-radius, and padding.`,initial_code:`<style>
  .card {
    /* Add styles here */
  }
</style>
<div class="card">My Card</div>`},{title:`Typography`,instruction:`CSS controls fonts with font-family, font-size, font-weight, and text-align.

Make the h1 font-size 48px, font-weight bold, and text-align center.`,task:`Style the h1 with font-size, font-weight, and text-align.`,initial_code:`<style>
  h1 {
    /* Add typography styles */
  }
</style>
<h1>Big Bold Title</h1>`}]},{id:`css-flexbox`,title:`CSS Flexbox`,level:`beginner`,language:`css`,description:`Master the modern flexbox layout system to build responsive UIs.`,exercises:[{title:`Enable Flexbox`,instruction:`Flexbox is activated by setting display: flex on a container. By default, children line up in a row.

Add display: flex to .container.`,task:`Set display: flex on .container`,initial_code:`<style>
  .container {
    background: #1a1a2e;
    padding: 20px;
    /* Enable flex here */
  }
  .item { background: #00f5d4; color: black; padding: 10px 20px; margin: 5px; border-radius: 8px; }
</style>
<div class="container">
  <div class="item">A</div>
  <div class="item">B</div>
  <div class="item">C</div>
</div>`},{title:`Justify & Align`,instruction:`justify-content controls horizontal alignment. align-items controls vertical alignment.

Center items both horizontally and vertically in the container (height: 200px).`,task:`Use justify-content: center and align-items: center`,initial_code:`<style>
  .container {
    display: flex;
    background: #1a1a2e;
    height: 200px;
    /* Add justify-content and align-items */
  }
  .item { background: #00f5d4; color: black; padding: 15px 25px; border-radius: 8px; }
</style>
<div class="container">
  <div class="item">Centered!</div>
</div>`},{title:`Flex Direction & Wrap`,instruction:`flex-direction changes the main axis (row or column). flex-wrap allows items to wrap to the next line.

Set .container to column direction and allow wrapping.`,task:`Set flex-direction: column and flex-wrap: wrap`,initial_code:`<style>
  .container {
    display: flex;
    background: #1a1a2e;
    padding: 20px;
    /* Add direction and wrap */
  }
  .item { background: #ffd60a; color: black; padding: 10px; margin: 5px; border-radius: 8px; }
</style>
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
</div>`}]},{id:`css-grid`,title:`CSS Grid & Responsive`,level:`beginner`,language:`css`,description:`Build complex responsive layouts with CSS Grid and media queries.`,exercises:[{title:`Your First Grid`,instruction:`CSS Grid creates two-dimensional layouts. Use display: grid and grid-template-columns to define columns.

Create a 3-column grid where each column takes equal space (1fr each).`,task:`Set display: grid and grid-template-columns: 1fr 1fr 1fr`,initial_code:`<style>
  .grid {
    background: #0d131a;
    padding: 20px;
    gap: 15px;
    /* Add grid styles */
  }
  .cell { background: #00f5d4; color: black; padding: 20px; border-radius: 8px; text-align: center; font-weight: bold; }
</style>
<div class="grid">
  <div class="cell">1</div>
  <div class="cell">2</div>
  <div class="cell">3</div>
  <div class="cell">4</div>
  <div class="cell">5</div>
  <div class="cell">6</div>
</div>`},{title:`Media Queries`,instruction:`Media queries make layouts responsive. @media (max-width: 600px) targets small screens.

Make the .grid switch to a single column on screens narrower than 600px.`,task:`Add a @media query that sets grid-template-columns: 1fr at max-width: 600px`,initial_code:`<style>
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 15px;
    padding: 20px;
    background: #0d131a;
  }
  /* Add media query here */
  .cell { background: #ffd60a; color: black; padding: 20px; border-radius: 8px; text-align: center; }
</style>
<div class="grid">
  <div class="cell">A</div>
  <div class="cell">B</div>
  <div class="cell">C</div>
</div>`}]},{id:`js-fundamentals`,title:`JavaScript Fundamentals`,level:`beginner`,language:`javascript`,description:`Bring your websites to life with logic, variables, and functions.`,exercises:[{title:`Variables & Data Types`,instruction:`JavaScript stores data in variables. Use let for values that change, const for ones that don't.

Create a const called name with your name, and a let called age with your age. Then console.log both.`,task:`Declare name and age variables and log them.`,initial_code:`// Declare your variables here

// Log them
`},{title:`Mastering Functions`,instruction:`Functions are reusable blocks of code. Create a function named greetUser that takes a name parameter and returns "Hello, [name]!".`,task:`Define greetUser(name) that returns "Hello, [name]!"`,initial_code:`// Write your function here

console.log(greetUser("Student"));
`},{title:`Arrays`,instruction:`Arrays store ordered lists of values. You can access items by index (starting at 0).

Create an array called fruits with 3 fruit names. Then log the first item.`,task:`Create a fruits array and log fruits[0]`,initial_code:`// Create your array here

// Log the first item
`},{title:`Objects`,instruction:`Objects store key-value pairs and represent real-world things.

Create an object called person with name, age, and job properties. Log the name.`,task:`Create a person object with 3 properties and log person.name`,initial_code:`// Create your object here

// Log the name property
`},{title:`Loops`,instruction:`Loops repeat code. A for loop runs a set number of times.

Write a for loop that logs numbers 1 to 5.`,task:`Write a for loop that logs 1, 2, 3, 4, 5`,initial_code:`// Write your loop here
`}]},{id:`dom-manipulation`,title:`DOM Manipulation`,level:`beginner`,language:`html`,description:`Use JavaScript to make web pages interactive by manipulating the DOM.`,exercises:[{title:`Selecting Elements`,instruction:`document.getElementById() selects an element by its id.

Click the button to change the heading text to "I clicked it!".`,task:`Use getElementById to change the h1 text on button click.`,initial_code:`<!DOCTYPE html>
<html>
<body>
  <h1 id="title">Click the button!</h1>
  <button onclick="changeText()">Click Me</button>
  <script>
    function changeText() {
      // Change the h1 text here
    }
  <\/script>
</body>
</html>`},{title:`Changing Styles`,instruction:`element.style lets you change CSS from JavaScript.

Click the button to change the box background color to "cyan".`,task:`Change the .box background color to cyan on button click.`,initial_code:`<!DOCTYPE html>
<html>
<body>
  <div id="box" style="width:100px;height:100px;background:red;border-radius:8px;"></div>
  <br>
  <button onclick="changeColor()">Change Color</button>
  <script>
    function changeColor() {
      // Change the background color here
    }
  <\/script>
</body>
</html>`}]},{id:`js-events`,title:`JS Events & Forms`,level:`beginner`,language:`html`,description:`Handle user interactions with JavaScript event listeners.`,exercises:[{title:`Event Listeners`,instruction:`addEventListener attaches event handlers to elements without using inline onclick.

Add a click event listener to the button that logs "Button clicked!" to the console.`,task:`Use addEventListener("click", ...) on the button.`,initial_code:`<!DOCTYPE html>
<html>
<body>
  <button id="btn">Click Me</button>
  <script>
    const btn = document.getElementById("btn");
    // Add event listener here
  <\/script>
</body>
</html>`},{title:`Form Validation`,instruction:`Prevent form submission with event.preventDefault() and validate input.

Prevent the form from submitting and show an alert if the name field is empty.`,task:`Validate the form: show alert if name is empty.`,initial_code:`<!DOCTYPE html>
<html>
<body>
  <form id="myForm">
    <input type="text" id="name" placeholder="Your name" />
    <button type="submit">Submit</button>
  </form>
  <script>
    document.getElementById("myForm").addEventListener("submit", function(e) {
      // Validate here
    });
  <\/script>
</body>
</html>`}]},{id:`react-components`,title:`React Components`,level:`pro`,language:`javascript`,description:`Build reusable UI components with React and JSX.`,exercises:[{title:`Your First Component`,instruction:`React components are JavaScript functions that return JSX (HTML-like syntax).

Create a functional component called Greeting that returns <h1>Hello, React!</h1>. Then render it.`,task:`Create and render a Greeting component.`,initial_code:`// Write your Greeting component
function Greeting() {
  // Return JSX here
}

// Render it
console.log("Greeting component created!");
`},{title:`Props`,instruction:`Props let you pass data into components, making them reusable.

Create a Card component that accepts a title prop and displays it in an <h2>.`,task:`Create Card({ title }) that renders <h2>{title}</h2>`,initial_code:`// Create Card component with title prop
function Card(props) {
  // Return h2 with props.title
}

console.log("Card component ready!");
`},{title:`State with useState`,instruction:`useState lets components remember and update values.

Create a counter that starts at 0. Clicking "+" increases it, "-" decreases it.`,task:`Use useState to build a counter with + and - buttons.`,initial_code:`// Counter component using useState
// import React, { useState } from "react";

function Counter() {
  // Add state here
  return (
    <div>
      <button>-</button>
      <span>0</span>
      <button>+</button>
    </div>
  );
}
`}]},{id:`react-hooks`,title:`React Hooks`,level:`pro`,language:`javascript`,description:`Master useEffect, useCallback, and custom hooks.`,exercises:[{title:`useEffect Basics`,instruction:`useEffect runs code after the component renders. The dependency array controls when it re-runs.

Log "Component mounted!" when the component first renders (empty dependency array).`,task:`Use useEffect with [] to log on mount.`,initial_code:`// import { useEffect } from "react";

function MyComponent() {
  // Add useEffect here
  
  return <div>Check the console!</div>;
}
`},{title:`Fetching Data`,instruction:`useEffect is perfect for fetching data when a component loads.

Fetch users from https://jsonplaceholder.typicode.com/users and log the first user's name.`,task:`Fetch from the API in useEffect and log data.`,initial_code:`// Fetch data with useEffect
async function loadUsers() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await res.json();
  // Log the first user's name here
}

loadUsers();
`}]},{id:`node-express`,title:`Node.js & Express`,level:`pro`,language:`javascript`,description:`Build backend APIs with Node.js and the Express framework.`,exercises:[{title:`Express Hello World`,instruction:`Express is a minimal Node.js framework for building APIs.

Write an Express route GET /hello that responds with { message: "Hello World" }.`,task:`Create a GET /hello route that returns JSON.`,initial_code:`const express = require("express");
const app = express();

// Add your GET /hello route here

app.listen(3000, () => console.log("Server running on port 3000"));
`},{title:`Route Parameters`,instruction:`Express uses :paramName for dynamic URL segments.

Create a GET /user/:id route that responds with { userId: id }.`,task:`Create GET /user/:id route returning the id as JSON.`,initial_code:`const express = require("express");
const app = express();

// Add your /user/:id route here

app.listen(3000);
`}]},{id:`api-fetching`,title:`Fetch API & Async`,level:`pro`,language:`javascript`,description:`Master async/await and the Fetch API for real-world data.`,exercises:[{title:`Async/Await`,instruction:`async/await makes asynchronous code read like synchronous code.

Write an async function fetchData that fetches https://jsonplaceholder.typicode.com/posts/1 and returns the title.`,task:`Create async fetchData() that returns the post title.`,initial_code:`// Write your async function
async function fetchData() {
  // Fetch and return the title
}

fetchData().then(title => console.log(title));
`},{title:`Error Handling`,instruction:`Always wrap fetch calls in try/catch to handle network errors gracefully.

Wrap your fetch in try/catch and log a friendly error message if it fails.`,task:`Add try/catch with a friendly error message.`,initial_code:`async function fetchData(url) {
  // Add try/catch around the fetch
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

fetchData("https://invalid-url-xyz.com").then(console.log);
`}]},{id:`system-design`,title:`System Design Basics`,level:`master`,language:`javascript`,description:`Learn to design scalable, production-ready systems.`,exercises:[{title:`REST API Design`,instruction:`Good REST APIs follow conventions: GET for reading, POST for creating, PUT for updating, DELETE for removing.

Write comments describing what endpoints a "todo app" REST API would need.`,task:`Document 4 REST endpoints for a todo app (comments only).`,initial_code:`// REST API for a Todo App
// Document your endpoints here:

// GET   /todos       → 
// POST  /todos       → 
// PUT   /todos/:id   → 
// DELETE /todos/:id  → 

console.log("API design documented!");
`}]},{id:`data-structures`,title:`Data Structures`,level:`master`,language:`javascript`,description:`Master the data structures used in technical interviews.`,exercises:[{title:`Linked List`,instruction:`A linked list is a chain of nodes where each node holds a value and a pointer to the next node.

Create a Node class with value and next properties. Create 3 nodes and link them.`,task:`Create 3 linked Node objects.`,initial_code:`// Create a Node class
class Node {
  // Add constructor with value and next
}

// Create and link 3 nodes
const node1 = new Node(1);
const node2 = new Node(2);
const node3 = new Node(3);
// Link them here

console.log(node1.next.value); // Should log 2
`},{title:`Stack (LIFO)`,instruction:`A stack is a Last-In-First-Out structure. Like a stack of plates.

Implement a Stack class with push(), pop(), and peek() methods.`,task:`Build a Stack with push, pop, and peek methods.`,initial_code:`class Stack {
  constructor() {
    this.items = [];
  }
  
  // Add push(item), pop(), peek() methods
}

const s = new Stack();
s.push(1); s.push(2); s.push(3);
console.log(s.peek()); // 3
console.log(s.pop());  // 3
console.log(s.peek()); // 2
`},{title:`Binary Search`,instruction:`Binary search finds an item in a sorted array in O(log n) time by repeatedly halving the search space.

Implement binarySearch(arr, target) that returns the index of target, or -1 if not found.`,task:`Implement binary search returning the index or -1.`,initial_code:`function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  // Implement binary search here
}

const arr = [1, 3, 5, 7, 9, 11, 13];
console.log(binarySearch(arr, 7));  // 3
console.log(binarySearch(arr, 6));  // -1
`}]}];export{e as t};