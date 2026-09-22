// scripts/generators/transformToSudheerStyle.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../public/data/interview-questions');

const TARGET_SUBJECTS = [
  'javascript',
  'react',
  'css',
  'typescript',
  'es6',
  'dom',
  'bom',
  'web-apis',
  'redux'
];

function cleanText(t) {
  return (t || '').replace(/[*_#`]/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Curated dictionary of authentic human interview questions for high-frequency topics
 */
const HIGH_FREQUENCY_QUESTIONS = {
  // JavaScript Core & Engine
  'execution context, creation phase & execution phase': 'What is an Execution Context in JavaScript and how do the Creation and Execution phases work?',
  'lexical environment & variable environment structures': 'What is a Lexical Environment in JavaScript and how does it differ from a Variable Environment?',
  'scope chain resolution & identifier lookups': 'How does the Scope Chain work in JavaScript and how are variable lookups resolved?',
  'closures, lexical scope capture & memory footprints': 'What are Closures in JavaScript and how do they capture lexical scope?',
  'garbage collection (mark-and-sweep algorithm)': 'How does Garbage Collection work in JavaScript and what is the Mark-and-Sweep algorithm?',
  'v8 generational garbage collector (scavenger & mark-sweep)': 'What is the difference between the Scavenger and Mark-Sweep phases in V8 Garbage Collection?',
  'memory leaks: detached dom nodes, global leakage & uncleaned timers': 'What are the common causes of memory leaks in JavaScript and how do you prevent them?',
  'hoisting semantics for var, let, const & function declarations': 'What is Hoisting in JavaScript and how does it work for var, let, const, and functions?',
  'temporal dead zone (tdz) & variable lifecycle states': 'What is the Temporal Dead Zone (TDZ) in JavaScript?',
  'the "this" keyword binding rules (default, implicit, explicit, new)': 'How is the "this" keyword determined in JavaScript and what are the 4 binding rules?',
  'function.prototype.call, apply & bind mechanics': 'What is the difference between call(), apply(), and bind() in JavaScript?',
  'prototypal inheritance & prototype chain lookups': 'What is Prototypal Inheritance and how does the prototype chain work in JavaScript?',
  'object.__proto__ vs object.prototype relationships': 'What is the difference between __proto__ and prototype in JavaScript?',
  'object.create() & pure prototype delegation': 'What is Object.create() and how does it achieve prototype delegation in JavaScript?',
  'event loop architecture: call stack, task queue & microtask queue': 'What is the Event Loop in JavaScript and how do the Call Stack, Microtask Queue, and Callback Queue interact?',
  'microtask vs macrotask execution order invariants': 'What is the difference between microtasks and macrotasks in JavaScript and which has higher priority?',
  'asynchronous foundations: callbacks vs promises vs async/await': 'What is the difference between Callbacks, Promises, and Async/Await in JavaScript?',
  'v8 engine architecture: ignition interpreter & turbofan jit compiler': 'How does the V8 engine execute JavaScript using the Ignition interpreter and TurboFan compiler?',
  'event propagation: capturing, target & bubbling phases': 'What are the three phases of Event Propagation in the browser DOM?',
  'event delegation & high-performance event listeners': 'What is Event Delegation and why is it recommended for dynamic web applications?',
  'function debouncing vs throttling implementations': 'What is the difference between Debouncing and Throttling in JavaScript?',
  'javascript type system & primitive vs reference types': 'What is the difference between primitive types and reference types in JavaScript?',
  'implicit type coercion & strict equality (=== vs ==)': 'What is the difference between == and === operators in JavaScript?',
  'object property descriptors (writable, enumerable, configurable)': 'What are Object property descriptors (writable, enumerable, configurable) in JavaScript?',
  'strict mode ("use strict") behavior & runtime enforcements': 'What is Strict Mode ("use strict") in JavaScript and what benefits does it provide?',

  // CSS & Modern Layouts
  'universal box-sizing reset (*, *::before, *::after { box-sizing: border-box; })': 'What is the CSS Box Model and why do we use box-sizing: border-box?',
  'css cascade, inheritance & specificity calculation rules': 'How does CSS Specificity work and how is selector weight calculated?',
  'flexbox architecture: flex-direction, justify-content, align-items, flex-grow': 'What is Flexbox and what are the key properties for aligning and distributing items?',
  'css grid layout: grid-template-columns, fr units, minmax(), grid-template-areas': 'What is CSS Grid and how does it differ from Flexbox for page layouts?',
  'stacking context, z-index isolation & stacking order rules': 'What is a Stacking Context in CSS and what properties trigger a new stacking context?',
  'block formatting context (bfc): float containment & margin collapsing': 'What is a Block Formatting Context (BFC) and how does it prevent margin collapsing?',
  'css units: px vs em vs rem vs vw/vh vs ch': 'What is the difference between px, em, rem, and viewport units (vw/vh) in CSS?',
  'centering techniques: margin auto, flexbox, grid, absolute + transform': 'What are the best ways to center a div horizontally and vertically in CSS?',
  'pseudo-classes vs pseudo-elements (:hover, :focus-visible vs ::before, ::after)': 'What is the difference between a pseudo-class and a pseudo-element in CSS?',
  'layout thrashing, reflow & repaint optimization': 'What is the difference between Reflow and Repaint in browser rendering and how do you prevent layout thrashing?',

  // React Architecture
  'jsx transformation & react.createelement pipeline': 'What is JSX and how does React transform it into elements?',
  'virtual dom, reconciliation & fiber diffing algorithm': 'What is the Virtual DOM and how does React reconciliation work?',
  'react fiber architecture: priority scheduling, work loop & lane model': 'What is React Fiber and why was it introduced?',
  'component lifecycle: render phase vs commit phase': 'What is the difference between the Render Phase and Commit Phase in React?',
  'state vs props: unidirectional data flow & immutability': 'What is the difference between state and props in React?',
  'react hooks rules & fiber memory cell linked list mechanics': 'What are the Rules of Hooks in React and why must they be called at the top level?',
  'usestate & usereducer internal state update pipelines': 'When should you use useReducer instead of useState in React?',
  'useeffect lifecycle synchronization, cleanup functions & stale closures': 'How does useEffect work and why is the cleanup function important?',
  'usememo vs usecallback: reference equality & cache invalidation': 'What is the difference between useMemo and useCallback in React?',
  'useref: persistent mutable values & dom node references': 'What is useRef used for in React and how is it different from useState?',
  'controlled vs uncontrolled components & form state architecture': 'What is the difference between Controlled and Uncontrolled components in React?',
  'react context api vs redux: performance, re-renders & state isolation': 'What is the difference between React Context API and Redux for global state management?',
  'react.memo, purecomponent & shallow comparison optimization': 'How does React.memo optimize functional components and when should you use it?',

  // TypeScript
  'type inference, type annotations & type widening': 'What is the difference between Type Inference, Type Annotation, and Type Widening in TypeScript?',
  'type aliases vs interfaces: declaration merging & structural typing': 'What is the difference between an Interface and a Type Alias in TypeScript?',
  'any vs unknown vs never: type safety escape hatches & bottom types': 'What is the difference between any, unknown, and never in TypeScript?',
  'union vs intersection types (a | b vs a & b) & discriminated unions': 'What is the difference between Union types and Intersection types in TypeScript?',
  'generics: generic functions, interfaces, constraints & defaults': 'What are Generics in TypeScript and why are they useful?',
  'type narrowing & type guards: typeof, instanceof, in, custom predicates': 'How does Type Narrowing work in TypeScript and how do you write custom type guards?',
  'type assertions ("as type") vs type casting vs non-null assertion (!)': 'What is the difference between Type Assertions ("as") and Type Casting in TypeScript?',

  // ES6+
  'let and const block scoping & temporal dead zone (tdz)': 'What is the difference between let, const, and var in ES6?',
  'arrow functions: syntax, lexical this binding & arguments object absence': 'What are arrow functions in ES6 and how does lexical "this" binding work?',
  'destructuring assignment: objects, arrays, nested defaults & rest patterns': 'How does destructuring assignment work for arrays and objects in ES6?',
  'template literals, tagged templates & string interpolation': 'What are template literals and tagged templates in ES6?',
  'promises: states, chaining, error handling & promise.all/allsettled/race': 'What is a Promise in JavaScript and how does promise chaining work?',
  'async/await syntax, sequential vs parallel execution & try/catch': 'How does async/await work in JavaScript and how do you handle errors?',
  'es6 classes: constructor, super, static methods & inheritance': 'How do classes and inheritance work in ES6 compared to traditional prototypes?',

  // DOM
  'document tree node hierarchy & element relationships': 'What is the DOM tree hierarchy and what is the difference between a Node and an Element?',
  'dom querying: getelementbyid vs queryselector & queryselectorall': 'What is the difference between getElementById and querySelector in the DOM?',
  'innerhtml vs textcontent vs innertext: performance & xss implications': 'What is the difference between innerHTML, textContent, and innerText?',
  'mutationobserver api: asynchronous dom mutation tracking': 'What is MutationObserver and how does it track DOM changes asynchronously?',

  // BOM
  'the window global object & browser execution context': 'What is the difference between the window object and the document object in JavaScript?',
  'web storage: localstorage vs sessionstorage persistence & origin isolation': 'What is the difference between localStorage, sessionStorage, and Cookies?',
  'history api: pushstate, replacestate & popstate event navigation': 'How does the HTML5 History API (pushState/replaceState) enable client-side routing?',

  // Web APIs
  'fetch api & asynchronous http requests': 'What is the Fetch API and how does it differ from XMLHttpRequest?',
  'intersection observer api: lazy loading & infinite scrolling': 'What is the Intersection Observer API and how is it used for image lazy loading?',
  'web workers: multi-threaded background execution & postmessage': 'What are Web Workers and how do they enable background multi-threading in JavaScript?',

  // Redux
  'redux core principles: single source of truth, read-only state & pure functions': 'What are the three core principles of Redux?',
  'redux data flow: dispatch -> action -> middleware -> reducer -> store -> view': 'How does unidirectional data flow work in Redux?',
  'pure reducers & immutable state update mechanics': 'Why must Redux reducers be pure functions and how is immutability maintained?',
  'redux middleware architecture: redux thunk vs redux saga': 'What is Redux Middleware and what is the difference between Redux Thunk and Redux Saga?'
};

/**
 * Natural question stem converter for any concept
 */
function convertToInterviewQuestion(rawConcept, rawQuestion, subject) {
  if (rawQuestion && rawQuestion.trim().endsWith('?') && rawQuestion.length > 15) {
    return rawQuestion.trim();
  }

  const concept = cleanText(rawConcept || rawQuestion).toLowerCase();

  // Check exact dictionary match
  if (HIGH_FREQUENCY_QUESTIONS[concept]) {
    return HIGH_FREQUENCY_QUESTIONS[concept];
  }

  // Check partial dictionary match
  for (const [key, qText] of Object.entries(HIGH_FREQUENCY_QUESTIONS)) {
    if (concept.includes(key) || key.includes(concept)) {
      return qText;
    }
  }

  const cClean = cleanText(rawConcept || rawQuestion);

  // Structural grammar heuristics
  if (/^what\s+is\b|^how\s+does\b|^why\s+do\b|^when\s+should\b/i.test(cClean)) {
    return cClean.endsWith('?') ? cClean : `${cClean}?`;
  }

  if (/\bvs\.?\b|\bversus\b/i.test(cClean)) {
    const parts = cClean.split(/\bvs\.?\b|\bversus\b/i);
    return `What is the difference between ${parts[0].trim()} and ${parts[1].trim()}?`;
  }

  if (/\b(difference|comparison)\b/i.test(cClean)) {
    return `What is the difference between ${cClean.replace(/\b(difference|comparison)\b/gi, '').trim()}?`;
  }

  if (/\b(rules|lifecycle|architecture|mechanics|pipeline|execution)\b/i.test(cClean)) {
    return `How does ${cClean} work in ${subject}?`;
  }

  if (/\b(principles|fundamentals|best practices)\b/i.test(cClean)) {
    return `What are the core principles of ${cClean} in ${subject}?`;
  }

  return `What is ${cClean} in ${subject} and how does it work?`;
}

/**
 * Generates a clean, beginner-friendly Sudheer Jonna-style code example with input, comments, and console outputs
 */
function generateSudheerStyleCodeSnippet(concept, subject, q) {
  const c = cleanText(concept).toLowerCase();

  if (c.includes('execution context') || c.includes('creation phase')) {
    return `// Demonstrating Creation Phase (Hoisting) vs Execution Phase in JavaScript
console.log(greeting); // Output: undefined (hoisted in Creation Phase)
// console.log(user);  // ReferenceError: Cannot access 'user' before initialization (TDZ)

var greeting = "Hello, world!";
let user = "Sudheer";

function displayWelcome() {
  console.log(greeting + " Welcome, " + user + "!");
}

displayWelcome(); // Output: Hello, world! Welcome, Sudheer! (Execution Phase)`;
  }

  if (c.includes('call, apply') || c.includes('call, apply & bind')) {
    return `// Demonstrating call(), apply(), and bind()
var person = { firstName: "John", lastName: "Doe" };

function introduce(greeting, city) {
  console.log(greeting + ", I am " + this.firstName + " " + this.lastName + " from " + city + ".");
}

// 1. call(): passes arguments one by one
introduce.call(person, "Hello", "New York");
// Output: Hello, I am John Doe from New York.

// 2. apply(): passes arguments as an array
introduce.apply(person, ["Hi", "London"]);
// Output: Hi, I am John Doe from London.

// 3. bind(): returns a new function with bound 'this'
var boundIntroduce = introduce.bind(person, "Greetings", "Tokyo");
boundIntroduce();
// Output: Greetings, I am John Doe from Tokyo.`;
  }

  if (c.includes('closure')) {
    return `// Practical Closure Example: Counter with private state
function createCounter() {
  var count = 0; // Private variable enclosed in outer scope

  return {
    increment: function() {
      count++;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

var counter = createCounter();
console.log(counter.increment()); // Output: 1
console.log(counter.increment()); // Output: 2
console.log(counter.getCount());  // Output: 2
// count variable cannot be accessed or modified directly from outside`;
  }

  if (c.includes('box-sizing') || c.includes('box model')) {
    return `/* Universal Box-Sizing Reset */
*, *::before, *::after {
  box-sizing: border-box;
}

/* Example: Width calculation comparison */
.content-box-element {
  box-sizing: content-box;
  width: 200px;
  padding: 20px;
  border: 5px solid black;
  /* Total width on screen = 200 + 40 + 10 = 250px (expands!) */
}

.border-box-element {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 5px solid black;
  /* Total width on screen = exactly 200px (padding & border stay inside!) */
}`;
  }

  if (c.includes('jsx') || c.includes('createelement')) {
    return `// 1. What you write in JSX:
const element = <h1 className="greeting">Hello, world!</h1>;

// 2. What Babel/Vite compiles JSX into behind the scenes:
const compiledElement = React.createElement(
  'h1',
  { className: 'greeting' },
  'Hello, world!'
);

// 3. What React.createElement returns (a lightweight Virtual DOM object):
/*
{
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
}
*/`;
  }

  if (c.includes('type inference') || c.includes('widening')) {
    return `// 1. Type Inference: TypeScript infers types automatically
let userName = "Kunal";   // Inferred as string
let score = 100;          // Inferred as number

// 2. Type Annotation: Explicitly declaring intended types
let isActive: boolean = true;
function add(a: number, b: number): number {
  return a + b;
}

// 3. Type Widening: Mutable variables widen literal values to general types
const fixedStatus = "loading"; // Type is literally "loading"
let mutableStatus = "loading"; // Widened to general type 'string'`;
  }

  // Preserve existing snippet if it's already clean, otherwise return a clean pattern
  if (q.codeSnippet && q.codeSnippet.length > 40 && !q.codeSnippet.includes('processData()')) {
    return q.codeSnippet;
  }

  return `// Example: Demonstrating ${cleanText(concept)}
function demonstrateFeature() {
  console.log("Evaluating ${cleanText(concept)} in ${subject}...");
  // Standard implementation follows predictable specifications
}

demonstrateFeature();`;
}

console.log('Starting Sudheer Jonna-style interview questions & answers upgrade...');

let totalUpdated = 0;

for (const subId of TARGET_SUBJECTS) {
  const filePath = path.join(DATA_DIR, `${subId}.json`);
  if (!fs.existsSync(filePath)) continue;

  const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const subName = subId.toUpperCase();

  const upgraded = questions.map((q, idx) => {
    totalUpdated++;
    const qNum = q.questionNumber || (idx + 1);
    const rawConcept = cleanText(q.concept || q.subtopic || q.question);

    // 1. Convert title into real human interview question
    const interviewQuestion = convertToInterviewQuestion(rawConcept, q.question, subName);

    // 2. Clear concept tag
    const conceptTag = rawConcept;

    // 3. Clean Sudheer Jonna-style code example
    const codeSnippet = generateSudheerStyleCodeSnippet(rawConcept, subId, q);

    // 4. Synchronize MCQ question stem
    const mcqQuestion = interviewQuestion;

    return {
      ...q,
      question: interviewQuestion,
      concept: conceptTag,
      mcqQuestion: interviewQuestion,
      codeSnippet,
      example: codeSnippet,
      codeExample: codeSnippet,
    };
  });

  fs.writeFileSync(filePath, JSON.stringify(upgraded, null, 2), 'utf8');
  console.log(`✓ ${subId.padEnd(16)}: Converted ${upgraded.length} questions to authentic interview questions.`);
}

console.log('\n======================================================');
console.log(`🎉 SUDHEER JONNA-STYLE UPGRADE COMPLETE!`);
console.log(`TOTAL QUESTIONS UPGRADED: ${totalUpdated}`);
console.log('======================================================');
