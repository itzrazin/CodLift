/**
 * CodLift Manual Verification Library
 * Deterministic validation logic for each lesson to ensure 100% accuracy
 * before falling back to AI or generic checks.
 */

const validators = {
  // --- HTML BASICS ---
  html_1_1: (code) => {
    const errors = [];
    if (code.includes('</html')) errors.push("Remove any stray '</html>' tags. You only need the h1 for this task.");
    if (!code.match(/<h1\s*>.*?<\/h1>/i)) errors.push("Missing or malformed <h1> opening or closing tags.");
    if (code.match(/<h1[^>]*?[a-zA-Z]/i) && !code.match(/<h1\s*>/i)) errors.push("Malformed opening tag (e.g. <h1Hello). Add a '>' after 'h1'.");
    if (!code.includes('Hello CodLift')) errors.push("The text must be exactly 'Hello CodLift'.");
    return errors;
  },
  html_1_2: (code) => {
    const errors = [];
    if (!code.match(/<p\s*>.*?<\/p>/i)) errors.push("You must add a proper <p> tag with a closing </p>.");
    if (!code.includes('Learning to code is fun!')) errors.push("The paragraph text must be exactly 'Learning to code is fun!'.");
    return errors;
  },
  html_1_3: (code) => {
    const errors = [];
    if (!code.match(/<a\s+href="https:\/\/codlift\.site"\s*>.*?<\/a>/i)) {
      if (!code.includes('https://codlift.site')) errors.push("The href attribute must be exactly 'https://codlift.site'.");
      if (!code.includes('Visit CodLift')) errors.push("The link text must be 'Visit CodLift'.");
      errors.push("Missing or malformed <a> tag structure.");
    }
    return errors;
  },
  html_2_1: (code) => {
    const errors = [];
    if (!code.match(/<header\s*>.*?<h1\s*>.*?<\/h1>.*?<\/header>/is)) errors.push("The <h1> must be wrapped inside a <header> element.");
    if (!code.match(/<main\s*>.*?<p\s*>.*?<\/p>.*?<\/main>/is)) errors.push("The <p> must be wrapped inside a <main> element.");
    return errors;
  },

  // --- CSS STYLING ---
  css_1_1: (code) => {
    const errors = [];
    if (!code.match(/h1\s*\{\s*color\s*:\s*purple\s*;?\s*\}/i)) {
      if (!code.includes('h1')) errors.push("Missing 'h1' selector.");
      if (!code.includes('color')) errors.push("Missing 'color' property.");
      if (!code.includes('purple')) errors.push("Value must be 'purple'.");
      errors.push("Ensure your CSS follows the format: selector { property: value; }");
    }
    return errors;
  },
  css_2_1: (code) => {
    const errors = [];
    if (!code.match(/\.container\s*\{[^}]*?display\s*:\s*flex\s*;?[^}]*?\}/i)) errors.push("Missing 'display: flex' inside the .container class.");
    return errors;
  },
  css_2_2: (code) => {
    const errors = [];
    if (!code.includes('justify-content: center')) errors.push("Missing 'justify-content: center'.");
    if (!code.includes('align-items: center')) errors.push("Missing 'align-items: center'.");
    return errors;
  },
  css_2_3: (code) => {
    const errors = [];
    if (!code.includes('flex-direction: column')) errors.push("Missing 'flex-direction: column'.");
    if (!code.includes('flex-wrap: wrap')) errors.push("Missing 'flex-wrap: wrap'.");
    return errors;
  },
  css_3_1: (code) => {
    const errors = [];
    if (!code.includes('display: grid')) errors.push("Missing 'display: grid'.");
    if (!code.includes('grid-template-columns: 1fr 1fr 1fr')) errors.push("Missing 'grid-template-columns: 1fr 1fr 1fr'.");
    return errors;
  },
  css_3_2: (code) => {
    const errors = [];
    if (!code.includes('@media (max-width: 600px)')) errors.push("Missing media query: '@media (max-width: 600px)'.");
    if (!code.match(/grid-template-columns\s*:\s*1fr/i)) errors.push("Missing 'grid-template-columns: 1fr' inside the media query.");
    return errors;
  },

  // --- JS FUNDAMENTALS ---
  js_1_1: (code) => {
    const errors = [];
    if (!code.match(/let\s+friend\s*=\s*["']Alex["']\s*;?/)) {
      if (!code.includes('let')) errors.push("Use the 'let' keyword to create the variable.");
      if (!code.includes('friend')) errors.push("Variable name must be 'friend'.");
      if (!code.includes('Alex')) errors.push("Value must be 'Alex' (in quotes).");
    }
    return errors;
  },
  js_1_2: (code) => {
    const errors = [];
    if (!code.includes('function greetUser')) errors.push("Missing function definition: 'function greetUser(name)'.");
    if (!code.includes('return')) errors.push("The function must 'return' the result.");
    if (!code.includes('Hello, ') || !code.includes('!')) errors.push("Return string must follow format: 'Hello, ' + name + '!'");
    return errors;
  },
  js_1_3: (code) => {
    const errors = [];
    if (!code.includes('fruits = [')) errors.push("Create an array named 'fruits'.");
    if (!code.includes('fruits[0]')) errors.push("Log the first item using 'fruits[0]'.");
    return errors;
  },
  js_1_4: (code) => {
    const errors = [];
    if (!code.includes('person = {')) errors.push("Create an object named 'person'.");
    if (!code.includes('name:')) errors.push("Object must have a 'name' key.");
    if (!code.includes('person.name')) errors.push("Log the name using 'person.name'.");
    return errors;
  },
  js_1_5: (code) => {
    const errors = [];
    if (!code.includes('for (')) errors.push("Use a 'for' loop.");
    if (!code.includes('i <= 5')) errors.push("Loop should end at 5.");
    if (!code.includes('console.log(i)')) errors.push("Log the current number 'i'.");
    return errors;
  }
};

const validateExercise = (id, code, actualOutput) => {
  if (!validators[id]) return null; // No manual validator for this ID
  
  const errors = validators[id](code, actualOutput);
  if (errors.length > 0) {
    return {
      isCorrect: false,
      feedback: "### ❌ Manual Verification Failed\n\n" + errors.map(e => `- ${e}`).join('\n')
    };
  }
  
  return {
    isCorrect: true,
    feedback: "### ✅ Manual Verification Passed\n\nYour code followed every instruction perfectly!"
  };
};

module.exports = { validateExercise };
