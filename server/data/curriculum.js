const curriculum = [
  {
    id: 'html-basics',
    title: 'HTML Basics',
    level: 'beginner',
    language: 'html',
    description: 'Learn the foundational building blocks of the web.',
    exercises: [
      {
        title: 'The Skeleton of the Web',
        instruction: 'Change the text inside the <h1> tag to say "Hello CodLift".',
        task: 'Update the h1 tag text.',
        initial_code: '<html>\n  <body>\n    <h1>Welcome</h1>\n  </body>\n</html>',
        test_cases: [
          { type: 'regex', pattern: '<h1>Hello CodLift<\\/h1>', message: 'The h1 tag should contain "Hello CodLift"' }
        ]
      },
      {
        title: 'Structuring with Paragraphs',
        instruction: 'Add a paragraph below the heading with the text "Learning to code is fun!".',
        task: 'Add a paragraph tag.',
        initial_code: '<h1>CodLift</h1>\n<!-- Add paragraph here -->',
        test_cases: [
          { type: 'regex', pattern: '<p>Learning to code is fun!<\\/p>', message: 'Missing or incorrect paragraph tag' }
        ]
      }
    ]
  },
  {
    id: 'css-styling',
    title: 'CSS Styling',
    level: 'beginner',
    language: 'css',
    description: 'Learn how to style HTML elements.',
    exercises: [
      {
        title: 'Painting with CSS',
        instruction: 'Change the color of the <h1> tag to "cyan".',
        task: 'Update the color property.',
        initial_code: '<style>\n  h1 {\n    color: white;\n  }\n</style>\n<h1>Colorful World</h1>',
        test_cases: [
          { type: 'regex', pattern: 'color:\\s*cyan', message: 'The h1 color should be set to cyan' }
        ]
      }
    ]
  },
  {
    id: 'js-fundamentals',
    title: 'JavaScript Fundamentals',
    level: 'intermediate',
    language: 'javascript',
    description: 'Learn the core concepts of JavaScript.',
    exercises: [
      {
        title: 'Mastering Functions',
        instruction: 'Create a function named `greetUser` that takes a `name` and logs "Hello, [name]!" to the console.',
        task: 'Define a function and log the output.',
        initial_code: '// Write your function here\n\ngreetUser("Student");',
        test_cases: [
          { type: 'output', expected: 'Hello, Student!', message: 'The function should log "Hello, Student!"' },
          { type: 'function_exists', name: 'greetUser', message: 'Function "greetUser" not found' }
        ]
      }
    ]
  }
];

module.exports = curriculum;
