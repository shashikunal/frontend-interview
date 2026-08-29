#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Data files to process
const DATA_FILES = [
  'javascript-es6',
  'reactjs',
  'typescript',
  'css',
  'frontend-performance',
  'dom-web-apis',
  'dom-advanced',
];

// Output directory
const OUTPUT_DIR = path.join(__dirname, 'docs', 'questions');

// Category mapping for folder structure
const CATEGORY_FOLDERS = {
  'JavaScript & ES6': 'javascript-es6',
  'ReactJS': 'reactjs',
  'TypeScript': 'typescript',
  'CSS': 'css',
  'Frontend Performance': 'frontend-performance',
  'DOM & Web APIs': 'dom-web-apis',
  'DOM Advanced APIs': 'dom-advanced',
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getCategoryFolder(category) {
  return CATEGORY_FOLDERS[category] || slugify(category);
}

function generateKeyConcepts(question) {
  const concepts = [];
  const q = question.question.toLowerCase();
  const a = question.answer.toLowerCase();

  if (q.includes('===') || q.includes('==') || a.includes('coercion')) {
    concepts.push('Strict equality (===) vs loose equality (==)');
    concepts.push('Type coercion in JavaScript');
    concepts.push('Abstract Equality Comparison Algorithm');
    concepts.push('Strict Equality Comparison Algorithm');
  }
  if (q.includes('promise') || a.includes('promise')) {
    concepts.push('Promise states: pending, fulfilled, rejected');
    concepts.push('Promise chaining with .then() and .catch()');
    concepts.push('Promise.all(), Promise.race(), Promise.allSettled()');
  }
  if (q.includes('closure') || a.includes('closure')) {
    concepts.push('Lexical scoping');
    concepts.push('Function returning function');
    concepts.push('Captured variables');
  }
  if (q.includes('event loop') || a.includes('event loop')) {
    concepts.push('Call stack');
    concepts.push('Task queue (macrotasks)');
    concepts.push('Microtask queue');
    concepts.push('Event loop tick');
  }
  if (q.includes('var') && (q.includes('let') || q.includes('const'))) {
    concepts.push('Function scope vs block scope');
    concepts.push('Hoisting behavior');
    concepts.push('Temporal Dead Zone (TDZ)');
  }
  if (q.includes('this') || a.includes('this')) {
    concepts.push('Call-site binding');
    concepts.push('Implicit, explicit, new, and default binding');
    concepts.push('Arrow function lexical this');
  }
  if (q.includes('prototype') || a.includes('prototype')) {
    concepts.push('Prototype chain');
    concepts.push('Object.create()');
    concepts.push('Constructor functions');
  }
  if (q.includes('async') || q.includes('await')) {
    concepts.push('Async function returns Promise');
    concepts.push('Await pauses execution');
    concepts.push('Error handling with try/catch');
  }
  if (q.includes('map') || q.includes('foreach') || q.includes('reduce') || q.includes('filter')) {
    concepts.push('Array iteration methods');
    concepts.push('Functional programming patterns');
    concepts.push('Immutability considerations');
  }

  if (concepts.length === 0) {
    concepts.push('Core JavaScript concept');
    concepts.push('Interview-relevant knowledge');
    concepts.push('Practical application in React');
  }

  return concepts;
}

function generateSyntaxExamples(question) {
  const examples = [];
  const q = question.question.toLowerCase();

  if (q.includes('===') || q.includes('==')) {
    examples.push({
      title: 'Loose Equality (==)',
      code: `// Type coercion occurs
5 == "5"        // true
null == undefined  // true
0 == false      // true
"" == 0         // true
"0" == false    // true`,
      explanation: 'Loose equality converts both operands to the same type before comparing. This can lead to unexpected results.'
    });
    examples.push({
      title: 'Strict Equality (===)',
      code: `// No type coercion
5 === "5"       // false
null === undefined  // false
0 === false     // false
"" === 0        // false
"0" === false   // false`,
      explanation: 'Strict equality compares both value and type without conversion. This is the recommended approach.'
    });
    examples.push({
      title: 'Best Practice',
      code: `// Always prefer ===
if (value === expected) { ... }
if (userInput === "yes") { ... }

// Use Object.is() for special cases
Object.is(NaN, NaN)        // true (=== returns false)
Object.is(0, -0)           // false (=== returns true)`,
      explanation: 'Use strict equality by default. Object.is() handles edge cases like NaN and ±0.'
    });
  }

  if (q.includes('promise')) {
    examples.push({
      title: 'Basic Promise',
      code: `const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("done"), 1000)
})

promise
  .then(result => console.log(result))
  .catch(error => console.error(error))`,
      explanation: 'Creating and consuming a basic Promise with resolve and reject.'
    });
    examples.push({
      title: 'Promise Chaining',
      code: `fetchUser(id)
  .then(user => fetchPosts(user.id))
  .then(posts => render(posts))
  .catch(handleError)`,
      explanation: 'Chaining multiple async operations with automatic error propagation.'
    });
  }

  if (q.includes('var') && (q.includes('let') || q.includes('const'))) {
    examples.push({
      title: 'var - Function Scoped',
      code: `function example() {
  if (true) {
    var x = 10
  }
  console.log(x) // 10 - accessible outside block
}`,
      explanation: 'var is function-scoped, not block-scoped.'
    });
    examples.push({
      title: 'let/const - Block Scoped',
      code: `function example() {
  if (true) {
    let y = 10
    const z = 20
  }
  console.log(y) // ReferenceError
  console.log(z) // ReferenceError
}`,
      explanation: 'let and const are block-scoped, limited to the {} block.'
    });
    examples.push({
      title: 'Hoisting Differences',
      code: `console.log(a) // undefined (hoisted)
var a = 5

console.log(b) // ReferenceError (TDZ)
let b = 5`,
      explanation: 'var is hoisted and initialized with undefined. let/const are hoisted but uninitialized (TDZ).'
    });
  }

  if (q.includes('closure')) {
    examples.push({
      title: 'Basic Closure',
      code: `function outer() {
  const secret = "hidden"
  return function inner() {
    return secret // accesses outer scope
  }
}

const getSecret = outer()
console.log(getSecret()) // "hidden"`,
      explanation: 'Inner function retains access to outer function scope after outer returns.'
    });
    examples.push({
      title: 'Closure in React (useState)',
      code: `function Counter() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount(c => c + 1) // closure captures latest count
  }
  // ...
}`,
      explanation: 'React hooks use closures to capture state values. Functional updates avoid stale closures.'
    });
  }

  if (q.includes('event loop')) {
    examples.push({
      title: 'Event Loop Order',
      code: `console.log('1')

setTimeout(() => console.log('2'), 0)

Promise.resolve().then(() => console.log('3'))

console.log('4')

// Output: 1, 4, 3, 2`,
      explanation: 'Synchronous code runs first, then microtasks (Promise), then macrotasks (setTimeout).'
    });
  }

  if (q.includes('this')) {
    examples.push({
      title: 'this Binding Rules',
      code: `// Default binding
function foo() { console.log(this) }
foo() // window (or undefined in strict)

// Implicit binding
const obj = { foo: function() { console.log(this) } }
obj.foo() // obj

// Explicit binding
foo.call(obj) // obj

// new binding
new foo() // new instance

// Arrow function (lexical)
const arrow = () => console.log(this)
arrow() // enclosing scope's this`,
      explanation: 'this is determined by how a function is called (call-site), not where it\'s defined. Arrow functions inherit this lexically.'
    });
  }

  if (q.includes('map') || q.includes('foreach') || q.includes('reduce') || q.includes('filter')) {
    examples.push({
      title: 'map() - Transform',
      code: `const numbers = [1, 2, 3]
const doubled = numbers.map(n => n * 2)
// [2, 4, 6] - new array, same length`,
      explanation: 'map() creates a new array with transformed values. Returns a new array.'
    });
    examples.push({
      title: 'forEach() - Side Effects',
      code: `const numbers = [1, 2, 3]
numbers.forEach(n => console.log(n * 2))
// Logs: 2, 4, 6
// Returns: undefined`,
      explanation: 'forEach() executes a function for each element. Returns undefined, used for side effects only.'
    });
    examples.push({
      title: 'reduce() - Accumulate',
      code: `const numbers = [1, 2, 3]
const sum = numbers.reduce((acc, n) => acc + n, 0)
// 6 - single accumulated value`,
      explanation: 'reduce() reduces array to a single value. Powerful for transformations, grouping, and computations.'
    });
  }

  // Generic fallback
  if (examples.length === 0) {
    examples.push({
      title: 'General Syntax',
      code: `// Example related to: ${question.question}
// Refer to the answer section for details`,
      explanation: 'This question covers fundamental concepts. See the Overview section for the detailed answer.'
    });
  }

  return examples;
}

function generateAdditionalExamples(question) {
  const examples = [];
  const q = question.question.toLowerCase();

  if (q.includes('===') || q.includes('==')) {
    examples.push({
      title: 'Real-world Bug Prevention',
      code: `// BAD: Unexpected coercion
function isActive(user) {
  return user.status == "active" // "1" == "active" -> false, but 1 == "1" -> true
}

// GOOD: Explicit comparison
function isActive(user) {
  return user.status === "active"
}

// Type-safe API response handling
function parseResponse(data) {
  if (data && typeof data === "object" && "id" in data) {
    return data
  }
  throw new Error("Invalid user data")
}`,
      explanation: 'Using === prevents subtle bugs from type coercion, especially with API data.'
    });
  }

  if (q.includes('promise')) {
    examples.push({
      title: 'Parallel vs Sequential',
      code: `// Sequential (slower)
const user = await fetchUser(id)
const posts = await fetchPosts(id)

// Parallel (faster) - Promise.all
const [user, posts] = await Promise.all([
  fetchUser(id),
  fetchPosts(id)
])

// Race - first to settle
const result = await Promise.race([
  fetchWithTimeout(5000),
  fetchData()
])`,
      explanation: 'Promise.all() runs promises in parallel. Promise.race() returns the first settled promise.'
    });
  }

  if (q.includes('var') && (q.includes('let') || q.includes('const'))) {
    examples.push({
      title: 'Loop Variable Capture',
      code: `// PROBLEM with var
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100)
}
// Logs: 3, 3, 3

// SOLUTION with let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100)
}
// Logs: 0, 1, 2`,
      explanation: 'var creates one shared variable. let creates a new binding per iteration.'
    });
  }

  return examples;
}

function generateSpecifications(question) {
  const specs = [];
  const q = question.question.toLowerCase();

  if (q.includes('===') || q.includes('==')) {
    specs.push({
      name: 'ECMAScript Language Specification - Abstract Equality Comparison',
      url: 'https://tc39.es/ecma262/#sec-abstract-equality-comparison',
      status: 'Living Standard',
      comment: 'Defines the == algorithm with type coercion'
    });
    specs.push({
      name: 'ECMAScript Language Specification - Strict Equality Comparison',
      url: 'https://tc39.es/ecma262/#sec-strict-equality-comparison',
      status: 'Living Standard',
      comment: 'Defines the === algorithm without type coercion'
    });
  }

  if (q.includes('promise')) {
    specs.push({
      name: 'ECMAScript 2015 (ES6) - Promise Objects',
      url: 'https://tc39.es/ecma262/#sec-promise-objects',
      status: 'Standard',
      comment: 'Standardized Promise implementation'
    });
    specs.push({
      name: 'Promises/A+ Specification',
      url: 'https://promisesaplus.com/',
      status: 'Standard',
      comment: 'Interoperable Promise specification'
    });
  }

  if (q.includes('var') && (q.includes('let') || q.includes('const'))) {
    specs.push({
      name: 'ECMAScript 2015 (ES6) - let and const Declarations',
      url: 'https://tc39.es/ecma262/#sec-let-and-const-declarations',
      status: 'Standard',
      comment: 'Introduced block-scoped declarations'
    });
  }

  if (q.includes('async') || q.includes('await')) {
    specs.push({
      name: 'ECMAScript 2017 - Async Functions',
      url: 'https://tc39.es/ecma262/#sec-async-function-definitions',
      status: 'Standard',
      comment: 'Syntactic sugar over Promises'
    });
  }

  // Generic fallback
  if (specs.length === 0) {
    specs.push({
      name: 'ECMAScript Language Specification',
      url: 'https://tc39.es/ecma262/',
      status: 'Living Standard',
      comment: 'The official JavaScript language specification'
    });
    specs.push({
      name: 'MDN Web Docs - JavaScript',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      status: 'Documentation',
      comment: 'Comprehensive JavaScript reference and guides'
    });
  }

  return specs;
}

function generateBrowserCompat(question) {
  const compat = [];
  const q = question.question.toLowerCase()

  // Modern JS features (ES6+) - widely supported
  const modernFeatures = q.includes('let') || q.includes('const') || q.includes('arrow') ||
                         q.includes('promise') || q.includes('async') || q.includes('map') ||
                         q.includes('reduce') || q.includes('spread') || q.includes('destructur')

  if (modernFeatures) {
    compat.push(
      { name: 'Chrome', desktop: 'Full Support', mobile: 'Full Support', notes: 'Since v49+' },
      { name: 'Firefox', desktop: 'Full Support', mobile: 'Full Support', notes: 'Since v45+' },
      { name: 'Safari', desktop: 'Full Support', mobile: 'Full Support', notes: 'Since v10+' },
      { name: 'Edge', desktop: 'Full Support', mobile: 'Full Support', notes: 'Since v14+' },
      { name: 'Opera', desktop: 'Full Support', mobile: 'Full Support', notes: 'Since v36+' }
    )
  } else {
    // Older features - universally supported
    compat.push(
      { name: 'Chrome', desktop: 'Full Support', mobile: 'Full Support', notes: 'All versions' },
      { name: 'Firefox', desktop: 'Full Support', mobile: 'Full Support', notes: 'All versions' },
      { name: 'Safari', desktop: 'Full Support', mobile: 'Full Support', notes: 'All versions' },
      { name: 'Edge', desktop: 'Full Support', mobile: 'Full Support', notes: 'All versions' },
      { name: 'IE 11', desktop: 'Full Support', mobile: 'N/A', notes: 'Legacy support' }
    )
  }

  return compat;
}

function getCodeOutput(question) {
  if (!question.code) return 'No code example available for this question.'

  const q = question.question.toLowerCase()

  if (q.includes('typeof null')) {
    return '"object"'
  }
  if (q.includes('===') || q.includes('==')) {
    return `// Example outputs:
5 == "5"        // true
5 === "5"       // false
null == undefined  // true
null === undefined // false`
  }
  if (question.code) {
    return `// Run the code to see output
// The code editor above is interactive
// Click "Run Code" to execute`
  }

  return 'Click "Run Code" to execute the example.'
}

function generateMarkdown(question, fileIndex, totalQuestions) {
  const categoryFolder = getCategoryFolder(question.category);
  const concepts = generateKeyConcepts(question);
  const syntaxExamples = generateSyntaxExamples(question);
  const additionalExamples = generateAdditionalExamples(question);
  const specs = generateSpecifications(question);
  const compat = generateBrowserCompat(question);

  let md = `---
title: "${question.question}"
category: "${question.category}"
difficulty: "${question.difficulty}"
questionId: ${question.id}
totalQuestions: ${totalQuestions}
---

# ${question.question}

> **Category:** ${question.category} | **Difficulty:** ${question.difficulty} | **Question #${question.id}**

## Overview

${question.answer.split('\n\n').map(p => p.trim()).join('\n\n')}

## Key Concepts

${concepts.map(c => `- ${c}`).join('\n')}

## Syntax & Examples

`;

  syntaxExamples.forEach(ex => {
    md += `### ${ex.title}\n\n\`\`\`javascript\n${ex.code}\n\`\`\`\n\n${ex.explanation}\n\n`;
  });

  if (additionalExamples.length > 0) {
    md += `## Additional Examples\n\n`;
    additionalExamples.forEach(ex => {
      md += `### ${ex.title}\n\n\`\`\`javascript\n${ex.code}\n\`\`\`\n\n${ex.explanation}\n\n`;
    });
  }

  if (question.code) {
    md += `## Interactive Code Example\n\n\`\`\`javascript\n${question.code}\n\`\`\`\n\n**Expected Output:**\n\n\`\`\`\n${getCodeOutput(question)}\n\`\`\`\n\n`;
  }

  if (question.example) {
    md += `## Reference Example\n\n\`\`\`javascript\n${question.example}\n\`\`\`\n\n`;
  }

  md += `## Specifications\n\n| Specification | Status | Comment |\n|---------------|--------|---------|\n`;
  specs.forEach(s => {
    md += `| [${s.name}](${s.url}) | ${s.status} | ${s.comment} |\n`;
  });

  md += `\n## Browser Compatibility\n\n| Browser | Desktop | Mobile | Notes |\n|---------|---------|--------|-------|\n`;
  compat.forEach(c => {
    md += `| ${c.name} | ${c.desktop} | ${c.mobile} | ${c.notes} |\n`;
  });

  md += `\n> **Note:** Compatibility data is generated based on the JavaScript/ECMAScript features discussed in this question.

## See Also

- [All Questions](../index.md)
- [Previous Question](../${categoryFolder}/${String(question.id - 1).padStart(4, '0')}.md)
- [Next Question](../${categoryFolder}/${String(question.id + 1).padStart(4, '0')}.md)
- [Category: ${question.category}](../${categoryFolder}/index.md)

---

*Generated from react-interview-prep question database*`;

  return md;
}

async function main() {
  console.log('Generating markdown documentation...');

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Create category directories
  for (const folder of Object.values(CATEGORY_FOLDERS)) {
    const dir = path.join(OUTPUT_DIR, folder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  let allQuestions = [];

  // Load all questions
  for (const file of DATA_FILES) {
    const filePath = path.join(__dirname, 'public', 'data', `${file}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    allQuestions = allQuestions.concat(data);
    console.log(`Loaded ${data.length} questions from ${file}.json`);
  }

  console.log(`Total questions: ${allQuestions.length}`);

  // Sort by ID
  allQuestions.sort((a, b) => a.id - b.id);

  // Generate markdown for each question
  let generated = 0;
  for (const question of allQuestions) {
    const categoryFolder = getCategoryFolder(question.category);
    const fileName = `${String(question.id).padStart(4, '0')}.md`;
    const filePath = path.join(OUTPUT_DIR, categoryFolder, fileName);

    const md = generateMarkdown(question, generated, allQuestions.length);
    fs.writeFileSync(filePath, md);
    generated++;

    if (generated % 1000 === 0) {
      console.log(`Generated ${generated}/${allQuestions.length} files...`);
    }
  }

  // Generate index files
  generateIndexFiles(allQuestions);

  console.log(`\nDone! Generated ${generated} markdown files in ${OUTPUT_DIR}`);
}

function generateIndexFiles(allQuestions) {
  // Main index
  let mainIndex = `# React Interview Questions Documentation\n\nAuto-generated MDN-style documentation for all interview questions.\n\n## Categories\n\n`;

  const categories = [...new Set(allQuestions.map(q => q.category))].sort();

  for (const cat of categories) {
    const folder = getCategoryFolder(cat);
    const count = allQuestions.filter(q => q.category === cat).length;
    mainIndex += `- [${cat} (${count} questions)](${folder}/index.md)\n`;
  }

  mainIndex += `\n---\n\n*Total: ${allQuestions.length} questions*\n`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.md'), mainIndex);

  // Category indexes
  for (const cat of categories) {
    const folder = getCategoryFolder(cat);
    const catQuestions = allQuestions.filter(q => q.category === cat).sort((a, b) => a.id - b.id);

    let catIndex = `# ${cat}\n\n${catQuestions.length} questions\n\n`;

    // Group by difficulty
    const difficulties = ['Easy', 'Medium', 'Hard'];
    for (const diff of difficulties) {
      const diffQuestions = catQuestions.filter(q => q.difficulty === diff);
      if (diffQuestions.length === 0) continue;

      catIndex += `## ${diff} (${diffQuestions.length})\n\n`;
      for (const q of diffQuestions) {
        catIndex += `- [#${q.id}: ${q.question}](${String(q.id).padStart(4, '0')}.md)\n`;
      }
      catIndex += '\n';
    }

    fs.writeFileSync(path.join(OUTPUT_DIR, folder, 'index.md'), catIndex);
  }
}

main().catch(console.error);