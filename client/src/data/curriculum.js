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
<div class="p-4 bg-yellow/10 border border-yellow/20 rounded-xl my-4">
  <h4 class="text-yellow font-bold flex items-center gap-2 mb-2">💡 Think of it this way...</h4>
  <p class="text-sm">Imagine your body without any skin, muscles, or clothes — just the bare <strong>Human Skeleton</strong>. It provides the fundamental structure that holds everything else up. Without bones, you would just be a puddle on the floor! Similarly, <strong>HTML (HyperText Markup Language)</strong> is the strict structural skeleton of every single website. It defines where the head, body, and limbs of your page go.</p>
</div>

### Step 1: What is HTML?

HTML stands for HyperText Markup Language. 
Think of it as a set of instructions that tells the browser (like Chrome or Safari) exactly how to arrange things on a screen.
We call it a "Markup Language" because we "mark up" plain text with special symbols to give it meaning.
Without HTML, a website would just be a giant, messy pile of words with no headers, no buttons, and no structure.

### Step 2: The Logic of Tags

To build this skeleton, we use things called **tags**.
A tag is like a pair of bookends that you wrap around a piece of text.
If you want a title to be big and bold, you don't just type the title; you wrap it in a "Heading" tag.
This tells the computer: "Everything inside these two symbols is the most important title on the page!"

### Step 3: The Simplest Code Example

Look at this tiny snippet:

\`\`\`html
<h1>Hello CodLift</h1>
\`\`\`

### Step 4: Breaking Down Every Character

1. **\`<\`**: This is the "Less Than" symbol. In coding, it acts like the start of a whisper. It tells the computer, "Pay attention, a command is coming!"
2. **\`h1\`**: This is the command itself. "h" stands for Heading, and "1" means it is the most important one.
3. **\`>\`**: This is the "Greater Than" symbol. It closes the command, like saying "Over" on a walkie-talkie.
4. **\`Hello CodLift\`**: This is the actual text that the human user will see on their screen.
5. **\`</h1\`**: Notice the **\`/\`** (Forward Slash). This is the "End" signal. It tells the computer, "The heading is finished now. Stop making the text big."

### Wait! Don't Make This Mistake:

A common mistake for beginners is forgetting the **\`/\`** in the closing tag. 
If you write \`<h1>Welcome<h1>\`, the computer will think you never finished the first heading!
It might try to make your *entire* website look like one giant title. 
Always remember: every "Open" command needs a "Close" command with a slash.

**Your Task:**
Update the text inside the existing <h1> tag in the editor to exactly read: "Hello CodLift".`,
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
<div class="p-4 bg-blue/10 border border-blue/20 rounded-xl my-4">
  <h4 class="text-blue font-bold flex items-center gap-2 mb-2">💡 Think of it this way...</h4>
  <p class="text-sm">Imagine you are writing a letter on a fresh sheet of paper. When you finish one thought and want to start another, you skip a line. This gives your writing "room to breathe" so the reader doesn't get overwhelmed. The <strong>&lt;p&gt; (Paragraph) tag</strong> does exactly this for your website.</p>
</div>

### Step 1: The Logic of Blocks

Websites are mostly made of text. 
But if you just pile all your words into one giant block, nobody will want to read it.
It looks like a "wall of text" which is very scary for users!
To fix this, we use the Paragraph tag to break our thoughts into smaller, bite-sized pieces.

### Step 2: Why do we need it?

The computer uses the Paragraph tag to know where one block of text ends and the next begins.
When the browser sees this tag, it automatically adds a little bit of invisible "cushion" (empty space) above and below the text.
This empty space makes your website look professional and clean.
Without this tag, your sentences would all squish together like one long, never-ending line.

### Step 3: The Simplest Code Example

Here is how you write a simple paragraph in HTML:

\`\`\`html
<p>Learning to code is fun!</p>
\`\`\`

### Step 4: Breaking Down Every Character

1. **\`<\`**: The start symbol. It tells the browser, "I am about to give you a structural instruction."
2. **\`p\`**: This stands for **Paragraph**. It is the shortest way to tell the computer to start a new block of text.
3. **\`>\`**: The closing symbol for the start tag. It means, "The instruction is ready, now here comes the text!"
4. **\`Learning to code is fun!\`**: This is your content. You can type anything here—sentences, stories, or jokes.
5. **\`</p>\`**: The end tag. The **\`/\`** (slash) is the most important part here. It tells the computer, "Stop the paragraph here and add the cushion space now."

### Wait! Don't Make This Mistake:

A common mistake is putting a Heading tag (\`<h1>\`) *inside* a Paragraph tag (\`<p>\`). 
This is like trying to put a giant billboard inside a small cardboard box. 
It confuses the computer and can make your layout break!
Always keep your paragraphs for regular text, and use headings only for titles.

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
<div class="p-4 bg-green/10 border border-green/20 rounded-xl my-4">
  <h4 class="text-green font-bold flex items-center gap-2 mb-2">💡 Think of it this way...</h4>
  <p class="text-sm">Imagine your website is a house. But what if you want to visit your neighbor's house? You need a <strong>Magic Doorway</strong>. In the world of websites, these doorways are called <strong>Hyperlinks</strong>. They allow you to hop from one website to another in a single click.</p>
</div>

### Step 1: The Logic of the Doorway

A link is more than just text. It is a "portal."
When you see a link like "Visit Google," there are two parts:
1. The part you see: The words "Visit Google."
2. The secret part: The actual address (URL) where the portal leads.
To make this work, we use the **Anchor tag** (which looks like \`<a>\`).

### Step 2: What is an Attribute?

A regular box is just a box. But a box with a "Fragile" sticker has extra information.
In coding, we use **Attributes** to give our tags extra information.
The Anchor tag needs a special attribute called **\`href\`** to know where to go.
Without \`href\`, the link is like a door that leads to nowhere—it won't do anything when you click it!

### Step 3: The Simplest Code Example

Here is how you create a working link:

\`\`\`html
<a href="https://codlift.site">Visit CodLift</a>
\`\`\`

### Step 4: Breaking Down Every Character

1. **\`<\`**: The start of the instruction.
2. **\`a\`**: This stands for **Anchor**. Think of it like dropping an anchor at a specific spot on the web.
3. **The Space**: Very important! It separates the tag name (\`a\`) from the extra information (\`href\`).
4. **\`href\`**: This stands for **Hypertext Reference**. It is the "Address Label" for the link.
5. **\`=\`**: The assignment symbol. It tells the computer: "The address is equal to the following text."
6. **\`"https://codlift.site"\`**: The destination. We put it in **quotes** so the computer knows it is a specific web address.
7. **\`>\`**: This closes the opening tag.
8. **\`Visit CodLift\`**: These are the words the user will actually see and click on.
9. **\`</a>\`**: The end tag. It tells the computer, "This is the end of the clickable area."

### Wait! Don't Make This Mistake:

If you forget the \`https://\` at the start of your address, the link might break!
The computer will look for a file on *your* own computer instead of searching the whole internet. 
Always include the full address to make sure your magic doorway works.

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
<div class="p-4 bg-orange/10 border border-orange/20 rounded-xl my-4">
  <h4 class="text-orange font-bold flex items-center gap-2 mb-2">💡 Think of it this way...</h4>
  <p class="text-sm">Imagine you are moving into a brand new house. You wouldn't just throw everything into a massive, unlabelled pile in the living room. Instead, you use specific <strong>Rooms</strong>. You have a Kitchen for cooking, a Bedroom for sleeping, and a Garage for the car. <strong>Semantic HTML</strong> is just like naming the rooms in your website so the computer knows what happens in each one.</p>
</div>

### Step 1: The Logic of "Meaning"

In the early days of the internet, developers used plain "Boxes" (called \`<div>\` tags) for everything.
The problem was that the computer couldn't tell which box was the menu, which box was the footer, and which box was the actual story.
It was like a house where every room was just called "Room." 
To fix this, we use **Semantic Tags**. "Semantic" is just a fancy word for "Meaningful."

### Step 2: Why do we need it?

When you use meaningful tags like \`<header>\` and \`<main>\`, you are helping two types of "visitors":
1. **Search Engines (like Google):** Google's robots read your site to decide if it's good. If they see a \`<main>\` tag, they know: "Aha! This is the most important part of the page!"
2. **Screen Readers:** People who cannot see use special software that reads the website out loud. If you use semantic tags, the software can tell them: "You are now entering the Header section."

### Step 3: The Simplest Code Example

Here is how you wrap your content in meaningful rooms:

\`\`\`html
<header>
  <h1>My Website</h1>
</header>
<main>
  <p>Welcome to the main content!</p>
</main>
\`\`\`

### Step 4: Breaking Down Every Character

1. **\`<header>\`**: The start tag for the top of your page. It usually holds your logo or menu.
2. **\`<h1>My Website</h1>\`**: The content inside the header.
3. **\`</header>\`**: The end of the top section.
4. **\`<main>\`**: The start tag for the primary "room" of your page. There should only ever be ONE of these per page!
5. **\`<p>...</p>\`**: The content inside the main room.
6. **\`</main>\`**: The end of the primary section.

### Wait! Don't Make This Mistake:

Don't use more than one \`<main>\` tag on a page. 
A house usually only has one "Main Hall." 
If you have two, the computer won't know which one is the real main section.
Always keep it simple: one header for the top, and one main for the middle.

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
<div class="p-4 bg-pink/10 border border-pink/20 rounded-xl my-4">
  <h4 class="text-pink font-bold flex items-center gap-2 mb-2">💡 Think of it this way...</h4>
  <p class="text-sm">Imagine opening your <strong>Wardrobe/Closet</strong> in the morning. You have your physical body (that's the HTML), but now you get to choose your style. Do you want to wear a red shirt? Blue pants? A hat? <strong>CSS (Cascading Style Sheets)</strong> is exactly like dressing up your website. HTML provides the body, but CSS controls the colors and clothes.</p>
</div>

### Step 1: The Logic of "Separation"

In coding, we like to keep things organized.
We use HTML to build the "Bones" of the site, but we use a different language called CSS to choose the "Colors."
This is great because if you want to change your site from Blue to Purple, you only have to change one small piece of CSS code, rather than changing every single page of your website.

### Step 2: What is a Selector?

To change the color of a title, the computer needs to know *which* title you are talking about.
A **Selector** is like a finger pointing at an element. 
If you write \`h1\`, you are pointing at all the big titles and saying, "Hey you! Change your color!"

### Step 3: The Simplest Code Example

Here is a simple CSS rule that changes the color of a heading:

\`\`\`css
h1 {
  color: purple;
}
\`\`\`

### Step 4: Breaking Down Every Character

1. **\`h1\`**: The **Selector**. It points to the HTML tag we want to style.
2. **\`{\`**: The **Opening Curly Brace**. It tells the computer, "The styling instructions start here."
3. **The Space/Indent**: We usually put a few spaces before the next word to make it easier for humans to read.
4. **\`color\`**: This is the **Property**. It tells the computer *what* we want to change (in this case, the text color).
5. **\`:\`**: The **Colon**. It separates the property from the value. It means "set the color TO..."
6. **\`purple\`**: This is the **Value**. It is the actual color we want to use.
7. **\`;\`**: The **Semicolon**. It means "This instruction is finished."
8. **\`}\`**: The **Closing Curly Brace**. It means "No more styles for this element."

### Wait! Don't Make This Mistake:

A very common mistake is using the wrong symbols. 
Beginners often use an equals sign \`=\` instead of a colon \`:\`, or they forget the semicolon \`;\`.
If you write \`color = purple\`, the computer will simply ignore you!
Always remember: **Property : Value ;**

**Your Task:**
Update the CSS rule for the h1 selector. Change the value of the color property to exactly "purple" to match the CodLift brand aesthetic.`,
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
<div class="p-4 bg-indigo/10 border border-indigo/20 rounded-xl my-4">
  <h4 class="text-indigo font-bold flex items-center gap-2 mb-2">💡 Think of it this way...</h4>
  <p class="text-sm">Imagine you have a large stack of hardcover books. Normally, if you drop them, they will stack on top of each other in a tall tower. But what if you want them to sit neatly side-by-side on a bookshelf? <strong>Flexbox</strong> is like the shelf that forces your items to line up in a beautiful, horizontal row instead of a messy vertical tower.</p>
</div>

### Step 1: The Logic of Alignment

In standard HTML, elements like to stack vertically (one on top of the other).
But most websites need things to be horizontal (like a menu bar or a row of photos).
In the old days, this was very hard to do!
Now, we use **Flexbox**. By telling a parent "box" to be "Flex," all the children inside it will instantly snap into a perfect row.

### Step 2: What is a Container?

Think of Flexbox like a "Parent" and its "Children."
The parent is the large box that holds everything. 
When the parent says "I am a Flexbox," it is giving a rule to all its children. 
It tells them: "Line up and follow my instructions!"

### Step 3: The Simplest Code Example

Here is how you turn a regular box into a Flexbox:

\`\`\`css
.container {
  display: flex;
}
\`\`\`

### Step 4: Breaking Down Every Character

1. **\`.container\`**: This is the **Selector**. It points to the parent box that holds all the items.
2. **\`{\`**: The start of our styling rules.
3. **\`display\`**: This is the **Property**. It tells the computer *how* this box should behave on the screen.
4. **\`:\`**: The colon that separates the property from the value.
5. **\`flex\`**: This is the **Value**. It is the magic word that activates the Flexbox engine!
6. **\`;\`**: The end of the instruction.
7. **\`}\`**: The end of the style rule.

### Wait! Don't Make This Mistake:

A common mistake is putting \`display: flex\` on the small items instead of the large parent box. 
If you want your books to line up, you give the shelf the instructions, not each individual book. 
Always remember: set Flexbox on the **Container (the parent)**!

**Your Task:**
Locate the .container class in the CSS. Add the \`display: flex\` property to instantly force all the nested child elements to line up in a horizontal row.`,
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
<div class="p-4 bg-teal/10 border border-teal/20 rounded-xl my-4">
  <h4 class="text-teal font-bold flex items-center gap-2 mb-2">💡 Think of it this way...</h4>
  <p class="text-sm">Imagine you have an <strong>Incredibly Precise Remote Control</strong> for your layout. You can push a button to move your items to the center, the left, or the right. <strong>Justify-Content</strong> and <strong>Align-Items</strong> are the buttons on that remote control that let you position your items perfectly within their container.</p>
</div>

### Step 1: The Logic of Two Directions

Once you turn on Flexbox, you gain control over two directions:
1. **The Main Axis (Horizontal):** Moving things Left, Right, or Center.
2. **The Cross Axis (Vertical):** Moving things Top, Bottom, or Center.
By combining these two, you can put an item exactly in the middle of a box—something that used to be a nightmare for web developers!

### Step 2: What is Justify-Content?

Think of this as your "Horizontal Button." 
If you want your menu links to spread out across the page, or stay huddled together in the center, you use **justify-content**.
Values like \`center\` or \`space-between\` tell the computer exactly how much "air" (empty space) to put between your items.

### Step 3: The Simplest Code Example

Here is how you perfectly center an item:

\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`

### Step 4: Breaking Down Every Character

1. **\`justify-content\`**: The property for horizontal alignment.
2. **\`:\`**: The separator.
3. **\`center\`**: The value that tells the items to move to the middle.
4. **\`align-items\`**: The property for vertical alignment.
5. **\`center\`**: The value that tells the items to stay in the middle vertically.

### Wait! Don't Make This Mistake:

Vertical centering (\`align-items: center\`) only works if your container has a **Height**. 
If your container is squashed flat like a pancake, you won't see any vertical movement! 
Always check that your parent box has enough room (\`height\`) for the items to move up and down.

**Your Task:**
Inside the .container class, add both \`justify-content: center\` and \`align-items: center\` to perfectly center the nested item both horizontally and vertically.`,
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
<div class="p-4 bg-amber/10 border border-amber/20 rounded-xl my-4">
  <h4 class="text-amber font-bold flex items-center gap-2 mb-2">💡 Think of it this way...</h4>
  <p class="text-sm">Imagine you have a bookshelf. Sometimes you want the books to sit side-by-side (like a row). But sometimes, if the shelf is too narrow, you want to <strong>Rotate the Shelf</strong> so the books stack one on top of the other (like a column). <strong>Flex-Direction</strong> and <strong>Flex-Wrap</strong> let you control this rotation and flow.</p>
</div>

### Step 1: The Logic of Rotation

By default, Flexbox always thinks you want a horizontal row.
But what if you are building a menu for a mobile phone?
On a small screen, a long horizontal row will go off the edge of the screen!
To fix this, we use **flex-direction: column**. This "rotates" the axis so items stack vertically.

### Step 2: What is Wrapping?

Think of a word processor (like Google Docs). 
When you type to the end of a line, the computer automatically moves the next word to the new line below.
This is called **Wrapping**.
In Flexbox, we use **flex-wrap: wrap** to tell the items: "If you run out of room, don't shrink! Just move down to the next row."

### Step 3: The Simplest Code Example

Here is how you make a vertical stack that wraps:

\`\`\`css
.container {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
\`\`\`

### Step 4: Breaking Down Every Character

1. **\`flex-direction\`**: The property that chooses Row or Column.
2. **\`:\`**: The separator.
3. **\`column\`**: The value that makes things stack vertically.
4. **\`flex-wrap\`**: The property that controls if items stay on one line or move to many.
5. **\`wrap\`**: The value that allows items to jump to a new line when they run out of space.

### Wait! Don't Make This Mistake:

When you switch to \`flex-direction: column\`, the "Main Axis" and "Cross Axis" swap places!
Now, \`justify-content\` will move things Up and Down, and \`align-items\` will move things Left and Right. 
This is the number one thing that confuses even professional developers!

**Your Task:**
Locate the .container class. Add the \`flex-direction: column\` property and the \`flex-wrap: wrap\` property to properly stack the items and allow them to wrap.`,
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
<div class="p-4 bg-emerald/10 border border-emerald/20 rounded-xl my-4">
  <h4 class="text-emerald font-bold flex items-center gap-2 mb-2">💡 Think of it this way...</h4>
  <p class="text-sm">If Flexbox is like a bookshelf (one row), then <strong>CSS Grid</strong> is like an <strong>Advanced Chessboard</strong>. It allows you to control both <strong>Rows</strong> and <strong>Columns</strong> at the exact same time. This is the most powerful tool you have for building the overall layout of a professional website.</p>
</div>

### Step 1: The Logic of the "Grid"

Imagine you are designing a newspaper. You have some articles that are narrow, and some that are wide.
You also have rows of pictures and rows of text.
Trying to do this with one-dimensional tools is very hard. 
**CSS Grid** creates an invisible grid of lines on your page, and you just tell the items which "cell" of the grid they should sit in.

### Step 2: What is the "fr" Unit?

In the old days, we had to use percentages (like 33.33%) to make columns.
This was very annoying!
Now, we use a special unit called **\`fr\`** (which stands for **Fraction**).
If you write \`1fr 1fr 1fr\`, you are telling the computer: "Divide the screen into 3 equal pieces and give one piece to each column."
It handles all the difficult math for you!

### Step 3: The Simplest Code Example

Here is how you make a 3-column grid:

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
\`\`\`

### Step 4: Breaking Down Every Character

1. **\`display: grid\`**: This activates the Grid engine for the parent box.
2. **\`grid-template-columns\`**: This is the property that defines the vertical columns.
3. **\`1fr 1fr 1fr\`**: This tells the computer to create three columns, each taking up one equal "Fraction" of the available space.
4. **\`gap: 15px\`**: This is a bonus property that adds perfectly even space between all the boxes.

### Wait! Don't Make This Mistake:

A common mistake is thinking that \`grid-template-columns\` creates the content. 
It only creates the **Slots**. 
If you define 3 columns but you only have 2 items, the 3rd slot will just stay empty. 
Always make sure your grid plan matches the number of items you have!

**Your Task:**
Inside the .grid container class, add \`display: grid\` to enable the engine, and then add \`grid-template-columns: 1fr 1fr 1fr\` to define three equal-width columns.`,
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
<div class="p-4 bg-rose/10 border border-rose/20 rounded-xl my-4">
  <h4 class="text-rose font-bold flex items-center gap-2 mb-2">💡 Think of it this way...</h4>
  <p class="text-sm">Imagine your website has a <strong>Magic Mirror</strong>. When it looks at a giant desktop monitor, it sees plenty of room and spreads out comfortably. But when it looks at a tiny mobile phone, it realizes it needs to "shrink" and rearrange its furniture to fit. <strong>Media Queries</strong> are the sensors that tell your website how big the screen is.</p>
</div>

### Step 1: The Logic of Responsiveness

Your website needs to look good on everything from a huge TV to a tiny watch.
We call this **Responsive Design**.
A "Media Query" is like an **IF statement** for your styles. 
It says: "IF the screen is smaller than 600 pixels, THEN change the layout to be a single column."

### Step 2: What is a Breakpoint?

Think of a "Breakpoint" as a line in the sand.
On one side of the line (Big screens), the website uses its default layout.
Once the screen size crosses that line (Small screens), the website instantly switches to a new set of rules.
Most professional sites have breakpoints for Tablets and Phones.

### Step 3: The Simplest Code Example

Here is how you tell a grid to collapse on small screens:

\`\`\`css
@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
\`\`\`

### Step 4: Breaking Down Every Character

1. **\`@media\`**: The special keyword that tells the computer, "I am starting a screen-size rule."
2. **\`(max-width: 600px)\`**: The condition. It means: "If the screen is 600 pixels wide or LESS."
3. **\`{\`**: The start of the special rules for small screens.
4. **\`.grid { ... }\`**: We put our regular CSS rules *inside* the media query block to override them.
5. **\`1fr\`**: We change the 3-column grid back to a 1-column stack so it fits on a phone.

### Wait! Don't Make This Mistake:

Always place your \`@media\` rules at the **Bottom** of your CSS file. 
CSS stands for "Cascading Style Sheets," which means the rules at the bottom of the file always "win" over the rules at the top. 
If you put your media query at the top, your regular styles might overwrite it!

**Your Task:**
Below all the existing CSS, add a new media query block: \`@media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }\` to force the grid to collapse on tiny screens.`,
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
        title: 'Creating a Labeled Bucket',
        instruction: `
<div class="p-4 bg-purple/10 border border-purple/20 rounded-xl my-4">
  <h4 class="text-purple font-bold flex items-center gap-2 mb-2">💡 Think of it this way...</h4>
  <p class="text-sm">Imagine you are moving houses. You have a lot of stuff, so you use <strong>Cardboard Boxes</strong>. You write a label on the outside like "Books" so you know what is inside. In JavaScript, we do the exact same thing with <strong>Variables</strong>.</p>
</div>

### Step 1: The Logic of Storage

Computers are incredibly fast, but they have a very short memory. 
If you tell a computer "My name is Alex," it will forget that name a split-second later unless you save it.
To save information, we create a "labeled bucket" in the computer's memory.
We give the bucket a name (the label) so we can find it later when we need it.

### Step 2: The Simplest Code Example

Here is how we tell the computer to make a new bucket and put something in it:

\`\`\`javascript
let myBox = "Books";
\`\`\`

### Step 3: Breaking Down Every Character

1. **\`let\`**: This is a "Keyword." It is a special signal that tells the computer: "I am about to create a new labeled bucket!"
2. **The Space**: We put a space after \`let\` so the computer doesn't get confused. It needs to know where the "Create" command ends and the "Name" begins.
3. **\`myBox\`**: This is the **Name** or **Label** of our bucket. You can call it almost anything, like \`userName\` or \`score\`.
4. **\`=\`**: This is the **Assignment Operator**. In coding, it acts like an **Arrow**. It means: "Take the stuff on the right and put it INTO the bucket on the left."
5. **\`"Books"\`**: These are **Quotes**. We use them to tell the computer: "This is just plain text, not a command."
6. **\`;\`**: This is a **Semicolon**. It works just like a **Period** at the end of a sentence. It tells the computer, "I am done with this instruction."

### Wait! Don't Make This Mistake:

Beginners often forget the quotes around words. 
If you write \`let myBox = Books;\` (without quotes), the computer will look for *another* bucket named Books!
Since it won't find one, it will panic and show an error. 
If you want to store a literal word, always wrap it in "quotes".

**Your Task:**
Create a variable named \`friend\` and store the word \`"Alex"\` inside it.`,
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
        title: 'Mastering Functions',
        instruction: `
<div class="p-4 bg-yellow/10 border border-yellow/20 rounded-xl my-4">
  <h4 class="text-yellow font-bold flex items-center gap-2 mb-2">💡 Think of it this way...</h4>
  <p class="text-sm">Imagine you have a <strong>Recipe Card</strong> for baking a cake. You don't want to write down every single step every time you bake; you just want to say "Follow the Cake Recipe." A <strong>Function</strong> is exactly like that recipe card. You write the instructions once, give it a name, and then you can "call" it whenever you need to do that work again.</p>
</div>

### Step 1: The Logic of Reusability

In coding, we hate repeating ourselves. 
If you need to calculate a tax rate or greet a user 100 times, you shouldn't type that logic 100 times.
Instead, you wrap that logic in a "Function."
This makes your code clean and easy to fix—if the tax rate changes, you only fix it in one place!

### Step 2: What are Parameters?

Think of a "Coffee Machine." 
The machine has a set of instructions (grind beans, heat water, pour).
But you get to choose the **Input**: do you want "Dark Roast" or "Light Roast"?
In coding, these inputs are called **Parameters**. 
They are placeholders that let you customize what the function does each time you use it.

### Step 3: The Simplest Code Example

Here is how you write a simple greeting function:

\`\`\`javascript
function sayHello(name) {
  return "Hello, " + name + "!";
}
\`\`\`

### Step 4: Breaking Down Every Character

1. **\`function\`**: The keyword that tells the computer, "I am about to write a recipe."
2. **\`sayHello\`**: The **Name** of the function. This is what you'll use to "call" it later.
3. **\`(name)\`**: The **Parameter**. It acts like an empty slot where you will drop a specific name later.
4. **\`{\`**: The start of the instructions.
5. **\`return\`**: The most important word! it tells the computer, "Give this result back to me."
6. **\`"Hello, " + name\`**: This "glues" the word Hello to whatever name you provided.
7. **\`}\`**: The end of the recipe.

### Wait! Don't Make This Mistake:

A common mistake is forgetting the **\`return\`** keyword. 
If you forget it, the function will do the work in secret but it won't "hand" you the result. 
It's like a chef who cooks a delicious meal but then throws it in the trash instead of serving it to you! 
Always use \`return\` if you want to use the result later.

**Your Task:**
Define a new function named \`greetUser\` that accepts a single \`name\` parameter. Inside the function, it must return the exact string "Hello, [name]!" using the provided name.`,
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
        title: 'Arrays',
        instruction: `
<div class="p-4 bg-orange/10 border border-orange/20 rounded-xl my-4">
  <h4 class="text-orange font-bold flex items-center gap-2 mb-2">💡 Think of it this way...</h4>
  <p class="text-sm">Imagine you have a <strong>Large Filing Cabinet</strong> with many drawers. Each drawer is numbered starting from 0, 1, 2, and so on. You use this cabinet to store a long list of related things, like a list of your favorite fruits. An <strong>Array</strong> is exactly like this numbered filing cabinet.</p>
</div>

### Step 1: The Logic of "Lists"

Sometimes, you don't just want one piece of information; you want a whole collection.
Instead of creating 10 different variables for 10 different fruits, you can just create one "Array" that holds all of them.
This keeps your code organized and allows you to perform actions on the whole list at once.

### Step 2: What is Zero-Based Indexing?

This is the part that confuses everyone!
In the real world, we start counting at 1. 
But in coding, we start counting at **0**. 
The first drawer in your filing cabinet is always drawer number 0. 
The second drawer is number 1. 
Always remember: **Count starts at Zero!**

### Step 3: The Simplest Code Example

Here is how you create a list of fruits and find the first one:

\`\`\`javascript
const fruits = ["Apple", "Banana", "Cherry"];
console.log(fruits[0]); // This gives you "Apple"
\`\`\`

### Step 4: Breaking Down Every Character

1. **\`[\`**: The square bracket is the "Cabinet Door." It tells the computer, "A list starts here!"
2. **\`"Apple"\`**: The first item in the list.
3. **\`,\`**: The comma is very important. it separates the items so the computer knows they are different.
4. **\`]\`**: The closing bracket. It means the list is finished.
5. **\`fruits[0]\`**: This is how you "Open a Drawer." You name the cabinet (\`fruits\`) and then put the drawer number (\`0\`) in square brackets.

### Wait! Don't Make This Mistake:

A common mistake is trying to find the 3rd item by typing \`fruits[3]\`. 
Because we start at 0, the 3rd item is actually at drawer number **2**! 
If you type 3, the computer will look for a 4th item, find nothing, and say "undefined."

**Your Task:**
Create a const array named \`fruits\` with 3 strings. Then log the first item using \`fruits[0]\`.`,
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
<div class="p-4 bg-red/10 border border-red/20 rounded-xl my-4">
  <h4 class="text-red font-bold flex items-center gap-2 mb-2">💡 Think of it this way...</h4>
  <p class="text-sm">If an Array is a cabinet with numbered drawers, an <strong>Object</strong> is a cabinet with <strong>Text Labels</strong> on each drawer. Instead of remembering that drawer #0 is the name, you just look for the drawer labeled "Name." Objects are the best way to describe "Things" in the real world, like a Person or a Car.</p>
</div>

### Step 1: The Logic of "Properties"

Real-world objects have characteristics. 
A car has a Color, a Brand, and a Speed. 
In coding, we call these characteristics **Properties**. 
An Object lets you group all these properties together so they don't get lost.

### Step 2: The Key-Value Pair

Every drawer in an Object has two parts:
1. **The Key:** The label on the drawer (like "age").
2. **The Value:** The stuff inside the drawer (like "25").
We use a **Colon** to link them together.

### Step 3: The Simplest Code Example

Here is how you describe a person:

\`\`\`javascript
const person = {
  name: "Alex",
  age: 25
};
console.log(person.name); // This gives you "Alex"
\`\`\`

### Step 4: Breaking Down Every Character

1. **\`{\`**: The **Curly Brace** is the "Object Door."
2. **\`name\`**: The **Key** (the label).
3. **\`:\`**: The connector.
4. **\`"Alex"\`**: The **Value** (the content).
5. **\`,\`**: Separates different properties.
6. **\`person.name\`**: The **Dot Notation**. This is the easiest way to look inside an object. You say "Object Name" + "Dot" + "Label Name."

### Wait! Don't Make This Mistake:

Don't forget the comma between properties! 
If you have a name and an age, you must put a comma after the name. 
If you forget it, the computer will think the name and age are one big, confusing word.

**Your Task:**
Create a const object named \`person\` with keys \`name\`, \`age\`, and \`job\`. Then log \`person.name\`.`,
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
<div class="p-4 bg-yellow/10 border border-yellow/20 rounded-xl my-4">
  <h4 class="text-yellow font-bold flex items-center gap-2 mb-2">💡 Think of it this way...</h4>
  <p class="text-sm">Imagine you are in trouble at school and the teacher tells you to write "I will not talk in class" 100 times on the <strong>Chalkboard</strong>. Your hand would get very tired! In coding, a <strong>Loop</strong> is like having a robot write those lines for you. You just tell the robot: "Write this sentence 100 times," and it does all the hard work in a second.</p>
</div>

### Step 1: The Logic of Repetition

Computers are perfect for doing boring, repetitive tasks. 
If you need to print a list of 1,000 users, or check 5,000 files, you use a Loop.
A loop repeats the same block of code over and over until a specific "stopping point" is reached.

### Step 2: The Three Parts of a Loop

To make a loop work, you need three pieces of information:
1. **The Starting Point:** Where do we begin counting? (Usually at 0 or 1).
2. **The Stopping Rule:** When should we stop? (Example: "Stop when you reach 100").
3. **The Step:** How do we move to the next number? (Example: "Add 1 every time").

### Step 3: The Simplest Code Example

Here is a loop that counts from 1 to 5:

\`\`\`javascript
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
\`\`\`

### Step 4: Breaking Down Every Character

1. **\`for\`**: The keyword that starts the loop engine.
2. **\`let i = 1\`**: The **Start**. We create a tiny counter variable named \`i\` and set it to 1.
3. **\`;\`**: Semicolons separate the three parts of the loop.
4. **\`i <= 5\`**: The **Rule**. It means: "Keep going as long as \`i\` is less than or equal to 5."
5. **\`i++\`**: The **Step**. This is a shortcut for "Add 1 to \`i\`."
6. **\`{ ... }\`**: The code inside these braces is what gets repeated.

### Wait! Don't Make This Mistake:

The most dangerous mistake is the **Infinite Loop**. 
If you forget to add the "Step" (\`i++\`), the counter will stay at 1 forever. 
The computer will keep looping forever and ever until it crashes or your computer gets very hot! 
Always make sure your "Stopping Rule" will eventually become true.

**Your Task:**
Write a classic for loop starting exactly at 1 and ending exactly at 5. Inside the loop, use \`console.log()\` to print the current number during each iteration.`,
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
