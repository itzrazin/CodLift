const curriculum = [
  {
    id: 'html-basics',
    title: 'HTML Basics',
    level: 'beginner',
    language: 'html',
    description: 'Learn the foundational building blocks of the web and how to structure content.',
    exercises: [
      {
        title: 'The Skeleton of the Web',
        instruction: 'HTML (HyperText Markup Language) is the backbone of every website. Elements are defined by "tags" like <h1> for headings. Change the text inside the <h1> tag to say "Hello CodLift".',
        task: 'Update the h1 tag text.',
        initial_code: '<html>\n  <body>\n    <h1>Welcome</h1>\n  </body>\n</html>',
        test_cases: [
          { type: 'regex', pattern: '<h1>Hello CodLift<\\/h1>', message: 'The h1 tag should contain "Hello CodLift"' }
        ]
      },
      {
        title: 'Structuring with Paragraphs',
        instruction: 'Paragraphs are created using the <p> tag. They help separate blocks of text. Add a paragraph below the heading with the text "Learning to code is fun!".',
        task: 'Add a paragraph tag.',
        initial_code: '<h1>CodLift</h1>\n<!-- Add paragraph here -->',
        test_cases: [
          { type: 'regex', pattern: '<p>Learning to code is fun!<\\/p>', message: 'Missing or incorrect paragraph tag' }
        ]
      },
      {
        title: 'Hyperlinks & Navigation',
        instruction: 'The <a> tag (anchor) is used to create links. Use the href attribute to specify the destination. Create a link that says "Visit CodLift" and points to "https://codlift.site".',
        task: 'Add an anchor tag with href.',
        initial_code: '<p>Check out our site:</p>\n<!-- Add link here -->',
        test_cases: [
          { type: 'regex', pattern: '<a href="https:\\/\\/codlift\\.site">Visit CodLift<\\/a>', message: 'The link should point to https://codlift.site and say "Visit CodLift"' }
        ]
      }
    ]
  },
  {
    id: 'css-styling',
    title: 'CSS Styling',
    level: 'beginner',
    language: 'css',
    description: 'Learn how to transform plain HTML into beautiful interfaces with CSS.',
    exercises: [
      {
        title: 'Painting with CSS',
        instruction: 'CSS (Cascading Style Sheets) controls the look of your site. The "color" property changes text color. Change the color of the <h1> tag to "cyan".',
        task: 'Update the color property.',
        initial_code: '<style>\n  h1 {\n    color: white;\n  }\n</style>\n<h1>Colorful World</h1>',
        test_cases: [
          { type: 'regex', pattern: 'color:\\s*cyan', message: 'The h1 color should be set to cyan' }
        ]
      },
      {
        title: 'The Box Model: Padding',
        instruction: 'Padding creates space inside an element. Add 20px of padding to the .box class.',
        task: 'Set the padding property.',
        initial_code: '<style>\n  .box {\n    background: #00F5D4;\n    /* Add padding here */\n  }\n</style>\n<div class="box">Spacious Box</div>',
        test_cases: [
          { type: 'regex', pattern: 'padding:\\s*20px', message: 'Padding should be 20px' }
        ]
      }
    ]
  },
  {
    id: 'js-fundamentals',
    title: 'JavaScript Fundamentals',
    level: 'intermediate',
    language: 'javascript',
    description: 'Bring your websites to life with logic, variables, and functions.',
    exercises: [
      {
        title: 'Mastering Functions',
        instruction: 'Functions are reusable blocks of code. Create a function named `greetUser` that takes a `name` parameter and returns "Hello, [name]!".',
        task: 'Define a function and return the output.',
        initial_code: '// Write your function here\n\nconsole.log(greetUser("Student"));',
        test_cases: [
          { type: 'output', expected: 'Hello, Student!', message: 'The function should log "Hello, Student!"' },
          { type: 'function_exists', name: 'greetUser', message: 'Function "greetUser" not found' }
        ]
      }
    ]
  }
];

module.exports = curriculum;
