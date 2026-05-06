const curriculum = [
  // HTML - Tier 1
  {
    title: "HTML Elements",
    category: "HTML",
    tier: 1,
    order_index: 1,
    content: "HTML elements are the building blocks of web pages. An element usually consists of a start tag, content, and an end tag.",
    task: "Create a paragraph element containing the text 'Hello World'.",
    test_cases: { expected_output: "<p>Hello World</p>" }
  },
  {
    title: "Page Structure",
    category: "HTML",
    tier: 1,
    order_index: 2,
    content: "A standard HTML document requires a specific structure, including <html>, <head>, and <body> tags.",
    task: "Create an h1 heading with the text 'My Page' inside a body tag.",
    test_cases: { expected_output: "<body><h1>My Page</h1></body>" }
  },
  {
    title: "HTML Attributes",
    category: "HTML",
    tier: 1,
    order_index: 3,
    content: "Attributes provide additional information about HTML elements, like the href attribute for links.",
    task: "Create a link (a tag) with href='https://example.com' and text 'Click Here'.",
    test_cases: { expected_output: "<a href=\"https://example.com\">Click Here</a>" }
  },
  // CSS - Tier 2
  {
    title: "CSS Colors",
    category: "CSS",
    tier: 2,
    order_index: 4,
    content: "CSS allows you to style your HTML. You can change text color using the 'color' property.",
    task: "Write CSS to change the color of all paragraphs to red.",
    test_cases: { expected_output: "p { color: red; }" }
  },
  {
    title: "CSS Layouts",
    category: "CSS",
    tier: 2,
    order_index: 5,
    content: "The display property in CSS controls how an element is displayed. Block elements take up full width, while inline elements only take up as much width as necessary.",
    task: "Set the display of all spans to block.",
    test_cases: { expected_output: "span { display: block; }" }
  },
  {
    title: "Flexbox",
    category: "CSS",
    tier: 2,
    order_index: 6,
    content: "Flexbox is a layout model that allows elements to align and distribute space within a container.",
    task: "Create a class '.container' and set its display to flex.",
    test_cases: { expected_output: ".container { display: flex; }" }
  },
  // JS - Tier 3
  {
    title: "JS Variables",
    category: "JS",
    tier: 3,
    order_index: 7,
    content: "Variables are used to store data in JavaScript. You can use let or const to declare variables.",
    task: "Declare a constant variable named 'greeting' and assign it the string 'Hello'. Print it.",
    test_cases: { expected_output: "Hello" }
  },
  {
    title: "JS Functions",
    category: "JS",
    tier: 3,
    order_index: 8,
    content: "Functions are reusable blocks of code that perform a specific task.",
    task: "Write a function 'add' that takes two arguments and returns their sum. Call console.log(add(2, 3)).",
    test_cases: { expected_output: "5" }
  },
  {
    title: "JS Loops",
    category: "JS",
    tier: 3,
    order_index: 9,
    content: "Loops are used to execute a block of code repeatedly until a certain condition is met.",
    task: "Write a for loop that prints numbers from 1 to 3, each on a new line.",
    test_cases: { expected_output: "1\n2\n3" }
  }
];

module.exports = curriculum;
