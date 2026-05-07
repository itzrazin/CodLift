const curriculum = [
  // HTML Basics
  {
    title: "HTML Elements",
    category: "HTML",
    tier: 1,
    order_index: 1,
    content: "HTML (HyperText Markup Language) is the backbone of every website. Elements are defined by 'tags' like <h1> for headings.",
    task: "Update the h1 tag text to: Hello CodLift",
    test_cases: { expected_output: "Hello CodLift" }
  },
  {
    title: "Paragraphs & Text",
    category: "HTML",
    tier: 1,
    order_index: 2,
    content: "Paragraphs use the <p> tag. They separate blocks of text nicely.",
    task: "Add a <p> tag with the text: Learning to code is fun!",
    test_cases: { expected_output: "Learning to code is fun!" }
  },
  {
    title: "Hyperlinks & Navigation",
    category: "HTML",
    tier: 1,
    order_index: 3,
    content: "The <a> tag creates clickable links. The href attribute sets the destination.",
    task: "Add: <a href=\"https://codlift.site\">Visit CodLift</a>",
    test_cases: { expected_output: "<a href=\"https://codlift.site\">Visit CodLift</a>" }
  },
  // CSS Styling
  {
    title: "CSS Colors",
    category: "CSS",
    tier: 2,
    order_index: 4,
    content: "CSS controls how HTML looks. The color property changes text color.",
    task: "Set h1 { color: cyan; }",
    test_cases: { expected_output: "color: cyan" }
  },
  {
    title: "CSS Padding",
    category: "CSS",
    tier: 2,
    order_index: 5,
    content: "Padding creates space inside an element's border.",
    task: "Set padding: 20px on .box",
    test_cases: { expected_output: "padding: 20px" }
  },
  {
    title: "Flexbox Layout",
    category: "CSS",
    tier: 2,
    order_index: 6,
    content: "Flexbox is a layout model that allows elements to align and distribute space.",
    task: "Set display: flex on .container",
    test_cases: { expected_output: "display: flex" }
  },
  // JS Fundamentals
  {
    title: "JS Variables",
    category: "JS",
    tier: 3,
    order_index: 7,
    content: "Variables are used to store data in JavaScript. Use let or const to declare variables.",
    task: "Declare a constant variable named 'name' and assign it your name. Log it.",
    test_cases: { expected_output: "name" }
  },
  {
    title: "JS Functions",
    category: "JS",
    tier: 3,
    order_index: 8,
    content: "Functions are reusable blocks of code that perform a specific task.",
    task: "Define a function greetUser(name) that returns 'Hello, [name]!'",
    test_cases: { expected_output: "Hello," }
  },
  {
    title: "JS Loops",
    category: "JS",
    tier: 3,
    order_index: 9,
    content: "Loops repeat code until a condition is met.",
    task: "Write a for loop that logs numbers 1 to 5.",
    test_cases: { expected_output: "5" }
  }
];

module.exports = curriculum;
