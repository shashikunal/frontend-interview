// scripts/generate-all-modules.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GEN_DIR = path.resolve(__dirname, 'generators');

if (!fs.existsSync(GEN_DIR)) {
  fs.mkdirSync(GEN_DIR, { recursive: true });
}

function createGeneratorFile(filename, subjectId, functionName, questionsData) {
  const code = `// scripts/generators/${filename}
// 100% PURE ${subjectId.toUpperCase()} Interview Questions Generator - Zero Cross-Subject Contamination

export function ${functionName}(index) {
  const num = index + 1;
  const id = \`iq-${subjectId}-\${String(num).padStart(4, '0')}\`;

  let difficulty = 'EASY';
  let experienceLevel = 'FRESHER';

  if (index < 400) {
    difficulty = 'EASY';
    experienceLevel = index < 200 ? 'FRESHER' : '1_3_YEARS';
  } else if (index < 800) {
    difficulty = 'INTERMEDIATE';
    experienceLevel = '3_5_YEARS';
  } else {
    difficulty = 'DIFFICULT';
    experienceLevel = index < 900 ? '5_8_YEARS' : '8_PLUS_YEARS';
  }

  const bank = ${JSON.stringify(questionsData, null, 2)};

  const topicObj = bank[index % bank.length];
  const iteration = Math.floor(index / bank.length) + 1;

  let questionText = topicObj.q;
  if (iteration > 1) {
    if (difficulty === 'EASY') {
      questionText = \`[Part \${iteration}] \${topicObj.q}\`;
    } else if (difficulty === 'INTERMEDIATE') {
      questionText = \`In professional engineering, how does \${topicObj.concept} under \${topicObj.topic} operate in production environments?\`;
    } else {
      questionText = \`Enterprise Architecture: Deep analysis of \${topicObj.concept} under \${topicObj.topic}. Discuss runtime mechanics, performance optimization, and architectural trade-offs.\`;
    }
  }

  return {
    id,
    subject: '${subjectId}',
    topic: topicObj.topic,
    subtopic: topicObj.concept,
    concept: \`\${topicObj.concept} (Part \${iteration})\`,
    difficulty,
    questionType: index % 3 === 0 ? 'CONCEPTUAL' : (index % 3 === 1 ? 'DEFINITION' : 'CODE'),
    experienceLevel,
    tags: ['${subjectId}', difficulty.toLowerCase(), experienceLevel.toLowerCase(), 'interview-prep'],
    question: questionText,
    shortAnswer: topicObj.shortAnswer,
    interviewAnswer: topicObj.interviewAnswer,
    detailedExplanation: topicObj.detailedExplanation,
    why: topicObj.why,
    howItWorks: topicObj.howItWorks,
    realWorldExample: topicObj.realWorldExample,
    example: topicObj.snippet,
    codeSnippet: topicObj.snippet,
    lineByLineExplanation: topicObj.lineByLine,
    executionFlow: topicObj.executionFlow,
    commonMistakes: topicObj.mistakes,
    interviewTraps: topicObj.traps,
    interviewTips: topicObj.tips,
    followUps: topicObj.followUps,
    followUpAnswers: topicObj.followUpAnswers,
  };
}
`;

  fs.writeFileSync(path.join(GEN_DIR, filename), code, 'utf-8');
  console.log(`✅ Generated: ${filename}`);
}

// -------------------------------------------------------------
// 1. ES6 (ECMAScript 2015)
// -------------------------------------------------------------
createGeneratorFile('es6Generator.mjs', 'es6', 'generateEs6Question', [
  {
    q: "What are Arrow Functions in ES6, and how do they differ from regular function declarations regarding 'this' and 'arguments'?",
    concept: "Arrow Functions & Lexical Binding",
    topic: "Arrow Functions vs Traditional Functions (Lexical Binding)",
    shortAnswer: "Arrow functions provide a concise syntax for writing functions. Crucially, arrow functions do NOT have their own 'this', 'arguments', 'super', or 'new.target' bindings; instead, they inherit 'this' lexically from their enclosing parent scope.",
    interviewAnswer: "Arrow functions have 4 key differences compared to regular functions: 1) Lexical 'this': Arrow functions capture 'this' from the surrounding lexical context where they were created; they cannot be rebound using call, apply, or bind. 2) No 'arguments' object: To access arguments, you use ES6 rest parameters (`...args`). 3) Cannot be constructors: Calling `new ArrowFunction()` throws a TypeError because they lack an internal [[Construct]] method and prototype property. 4) Concise syntax with implicit returns for single expressions.",
    detailedExplanation: "### Deep Dive into Arrow Functions\n\n1. **Lexical This**: In ES5, callbacks inside setTimeout or array methods lost their outer `this`, requiring `var self = this;` or `.bind(this)`. Arrow functions resolve this problem natively.\n2. **No Prototype Property**: Because arrow functions cannot be used with the `new` keyword as constructors, V8 does not allocate a `prototype` object for them, saving memory.\n3. **Method Pitfall**: Never use arrow functions as object methods (e.g. `const user = { name: 'Alex', greet: () => this.name }`) because `this` will point to `window` or `undefined`, NOT the object.",
    why: "Arrow functions were introduced in ES6 to eliminate callback `this` loss and provide concise functional syntax for array operations like map, filter, and reduce.",
    howItWorks: "1. V8 parses arrow function syntax.\n2. Instead of creating a new Execution Context with dynamic `this`, the engine resolves `this` by looking up the Lexical Environment scope chain.",
    realWorldExample: "Handling timer callbacks inside a class or object: using an arrow function inside `setInterval(() => this.tick(), 1000)` preserves `this` pointing to the class instance.",
    snippet: `// ES6 Arrow Function vs Traditional Function
const timer = {
  seconds: 0,
  start() {
    // Arrow function lexically captures 'this' from start()
    setInterval(() => {
      this.seconds++;
      console.log('Elapsed:', this.seconds);
    }, 1000);
  }
};

// Concise syntax with implicit return
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8]`,
    lineByLine: [
      { line: 6, code: "setInterval(() => {", explanation: "Arrow function inherits 'this' from timer.start() context." },
      { line: 7, code: "this.seconds++;", explanation: "Correctly increments timer.seconds without losing reference." },
      { line: 14, code: "const doubled = numbers.map(n => n * 2);", explanation: "Implicit return: returns n * 2 without needing return keyword or braces." },
    ],
    executionFlow: [
      "Step 1: timer.start() is invoked, binding 'this' to timer object.",
      "Step 2: Arrow function callback is passed to setInterval.",
      "Step 3: When timer triggers, arrow function evaluates 'this' from enclosing lexical scope.",
      "Step 4: timer.seconds is incremented predictably.",
    ],
    mistakes: [
      "Using an arrow function as an object method and expecting `this` to refer to the object.",
      "Attempting to use `new` with an arrow function (throws TypeError).",
    ],
    traps: [
      "Trap: Can you change the `this` of an arrow function using `fn.call(customContext)`? Tip: No! Arrow functions permanently ignore call, apply, and bind context overrides.",
    ],
    tips: [
      "For freshers: Use arrow functions for callbacks and array transformations. Use regular methods for object/class methods.",
    ],
    followUps: [
      "Why can't arrow functions be used as constructors with the `new` keyword?",
      "How do you access function arguments in an arrow function?",
    ],
    followUpAnswers: [
      "Arrow functions lack an internal `[[Construct]]` method and do not have a `prototype` property, so the JavaScript engine explicitly forbids instantiation with `new`.",
      "You use ES6 rest parameters (`(...args) => { console.log(args); }`), which collects all passed arguments into a true Array."
    ]
  },
  {
    q: "What is Destructuring Assignment in ES6, and how does it work for both Arrays and Objects?",
    concept: "Array and Object Destructuring Syntax",
    topic: "Destructuring Patterns, Rest Parameters & Spread Operators",
    shortAnswer: "Destructuring assignment in ES6 allows you to extract values from arrays or properties from objects into distinct variables using a syntax that mirrors array and object literals.",
    interviewAnswer: "Destructuring is an essential modern ES6 feature: 1) Object Destructuring: Extracts properties by matching key names (e.g. `const { name, age } = user`). You can rename variables (`{ name: userName }`) and provide default values (`{ role = 'guest' }`). 2) Array Destructuring: Extracts elements based on index order (e.g. `const [first, second] = list`). You can skip items with commas (`const [, second] = list`). 3) Rest in destructuring: Use `...rest` to gather remaining properties or elements into a new object or array.",
    detailedExplanation: "### Understanding Destructuring Mechanics\n\n1. **Object Destructuring**: Looks up property keys using ECMAScript `[[Get]]`. If property is `undefined`, the fallback default value is evaluated.\n2. **Array Destructuring**: Uses the Iterable Protocol (`Symbol.iterator`). Works on Arrays, Strings, Sets, Maps, and any iterable.\n3. **Nested Destructuring**: You can unpack deeply nested API response trees in a single readable line.",
    why: "Destructuring eliminates tedious, repetitive property access statements (`var user = res.data.user; var id = user.id;`), making code concise, declarative, and less error-prone.",
    howItWorks: "1. V8 evaluates the right-hand expression.\n2. Pattern matching engine creates variables for each matched target.\n3. Default values evaluate only if the resolved value is strictly `undefined`.",
    realWorldExample: "Unpacking React hook return values (`const [count, setCount] = useState(0)`) or unpacking API payloads in Express/React function parameters.",
    snippet: `// 1. Object Destructuring with renaming and default values
const user = { id: 101, username: 'AlexRivera' };
const { username: displayName, role = 'Member' } = user;
console.log(displayName); // 'AlexRivera'
console.log(role);        // 'Member' (default value applied)

// 2. Array Destructuring with skipping and rest
const rgb = [255, 128, 0];
const [red, , blue] = rgb;
console.log(red, blue); // 255 0

// 3. Swapping variables without a temporary variable
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // 2 1`,
    lineByLine: [
      { line: 3, code: "const { username: displayName, role = 'Member' } = user;", explanation: "Renames username to displayName and applies fallback default for role." },
      { line: 9, code: "const [red, , blue] = rgb;", explanation: "Skips second element (index 1) via empty comma." },
      { line: 14, code: "[a, b] = [b, a];", explanation: "Simultaneous variable swap without creating a temporary variable." },
    ],
    executionFlow: [
      "Step 1: Right-hand object or array is evaluated.",
      "Step 2: Keys or iterator positions are matched.",
      "Step 3: New local constants are initialized with extracted values.",
    ],
    mistakes: [
      "Destructuring from `null` or `undefined` (throws TypeError: Cannot destructure property of null).",
      "Expecting default values to trigger on `null` (defaults ONLY trigger on `undefined`).",
    ],
    traps: [
      "Trap: Does a default value trigger if the property is `null`? Tip: NO! Default values trigger ONLY when the value is strictly `undefined`.",
    ],
    tips: [
      "For freshers: Always provide a fallback empty object when destructuring parameters: `function print({ id, name } = {})`.",
    ],
    followUps: [
      "What happens when you destructure a property that equals `null` with a default value?",
      "Can you destructure values from custom iterable objects?",
    ],
    followUpAnswers: [
      "The variable will be assigned `null`. Default values in destructuring only trigger if the property evaluates strictly to `undefined`.",
      "Yes, array destructuring works on any object implementing the `[Symbol.iterator]` protocol, including Sets, Maps, and custom generator objects."
    ]
  }
]);

// -------------------------------------------------------------
// 2. ES7 (ECMAScript 2016)
// -------------------------------------------------------------
createGeneratorFile('es7Generator.mjs', 'es7', 'generateEs7Question', [
  {
    q: "What features were introduced in ECMAScript 2016 (ES7), and how does Array.prototype.includes() improve on indexOf()?",
    concept: "Array.prototype.includes() & Exponentiation Operator",
    topic: "Array.prototype.includes() & Search Semantics",
    shortAnswer: "ES7 introduced exactly two features: Array.prototype.includes() and the Exponentiation operator (**). includes() returns a boolean indicating whether an array contains an element, correctly detecting NaN where indexOf() fails.",
    interviewAnswer: "ES7 was the first yearly release under the modern TC39 process and added two major features: 1) `Array.prototype.includes(searchElement, fromIndex)`: Returns a boolean (`true`/`false`), replacing clunky `arr.indexOf(item) !== -1`. More importantly, `includes()` uses the SameValueZero comparison algorithm, so it correctly finds `NaN` in arrays, whereas `indexOf([NaN])` returns `-1`. 2) The Exponentiation operator (`**`), providing clean syntax for `Math.pow(base, exponent)` with right-associative precedence.",
    detailedExplanation: "### The Two Pillars of ES7\n\n1. **Array.prototype.includes**:\n   - In ES5: `if (arr.indexOf(x) !== -1)` was prone to bugs because `indexOf` returns 0 for index 0 (which is falsy).\n   - `includes()` uses **SameValueZero** equality, which treats `NaN` as equal to `NaN` (unlike `===`).\n2. **Exponentiation Operator (`**`)**:\n   - Syntax: `2 ** 3 === 8`.\n   - Supports assignment shorthand: `let x = 2; x **= 3;` (x becomes 8).\n   - Right-associative: `2 ** 3 ** 2` is evaluated as `2 ** (3 ** 2) = 2 ** 9 = 512`, NOT `(2 ** 3) ** 2 = 64`.\n3. **TC39 Release Cadence**: Marked the shift from large multi-year specifications to smaller, annual, predictable feature releases.",
    why: "ES7 streamlined everyday array membership checks and mathematical exponent calculations with cleaner syntax and bug-free NaN handling.",
    howItWorks: "1. V8 invokes Array.prototype.includes with target value.\n2. Engine iterates array length, comparing elements using SameValueZero algorithm.\n3. Emits boolean true if found; false otherwise.",
    realWorldExample: "Checking permissions in an auth guard: `if (userRoles.includes('ADMIN')) { grantAccess(); }`.",
    snippet: `// 1. Array.prototype.includes vs indexOf
const fruits = ['apple', 'banana', NaN];

// Clean boolean check
console.log(fruits.includes('banana')); // true
console.log(fruits.includes('orange')); // false

// The NaN gotcha where indexOf fails:
console.log(fruits.indexOf(NaN));   // -1 (indexOf cannot find NaN!)
console.log(fruits.includes(NaN));  // true (SameValueZero finds NaN!)

// 2. Exponentiation Operator (**)
console.log(2 ** 3); // 8 (same as Math.pow(2, 3))
console.log(2 ** 3 ** 2); // 512 (Right-associative: 2 ** 9)`,
    lineByLine: [
      { line: 5, code: "fruits.includes('banana')", explanation: "Returns true directly without checking !== -1." },
      { line: 9, code: "fruits.indexOf(NaN)", explanation: "Returns -1 because indexOf uses strict equality (NaN === NaN is false)." },
      { line: 10, code: "fruits.includes(NaN)", explanation: "Returns true because includes uses SameValueZero." },
      { line: 13, code: "2 ** 3", explanation: "Exponentiation operator: computes 2 to the power of 3." },
    ],
    executionFlow: [
      "Step 1: Engine initializes fruits array with strings and NaN.",
      "Step 2: includes() checks elements using SameValueZero.",
      "Step 3: NaN element is matched successfully.",
    ],
    mistakes: ["Using indexOf to check for NaN presence in an array."],
    traps: ["Trap: Why does `[NaN].indexOf(NaN)` return -1 while `[NaN].includes(NaN)` returns true? Tip: indexOf uses === (where NaN !== NaN), while includes uses SameValueZero."],
    tips: ["For freshers: Always use `.includes()` instead of `.indexOf() !== -1` when checking if an array contains an item."],
    followUps: ["What is SameValueZero comparison?", "What is the associativity of the exponentiation operator?"],
    followUpAnswers: [
      "SameValueZero is an equality comparison algorithm that operates identically to strict equality (===) except that it treats `NaN` as equal to `NaN`.",
      "The exponentiation operator is right-associative, meaning `a ** b ** c` evaluates as `a ** (b ** c)`."
    ]
  }
]);

// -------------------------------------------------------------
// 3. ES8 (ECMAScript 2017)
// -------------------------------------------------------------
createGeneratorFile('es8Generator.mjs', 'es8', 'generateEs8Question', [
  {
    q: "What features were introduced in ECMAScript 2017 (ES8), and how do async/await functions work under the hood?",
    concept: "async/await, Object.entries/values & String Padding",
    topic: "Async Functions & Promise Resolution Pipeline",
    shortAnswer: "ES8 introduced async/await, Object.values(), Object.entries(), Object.getOwnPropertyDescriptors(), String.prototype.padStart()/padEnd(), trailing commas in parameter lists, and SharedArrayBuffer/Atomics.",
    interviewAnswer: "ES8 brought monumental improvements: 1) `async/await`: Syntactic sugar over Promises and Generators. An `async` function always returns a Promise. The `await` keyword pauses function execution until the awaited Promise resolves or rejects. 2) `Object.entries()` and `Object.values()`: Extract key-value tuples or values directly as arrays, making object iteration as easy as arrays. 3) `String.prototype.padStart()` and `padEnd()`: Native string formatting. 4) `Object.getOwnPropertyDescriptors()`: Solved the issue of copying getters and setters during object cloning.",
    detailedExplanation: "### ES8 Core Innovations\n\n1. **async/await Internals**: An `async` function is wrapped in a Promise. When `await` is hit, V8 creates a microtask continuation, yields execution back to the caller, and resumes when the Promise resolves.\n2. **Object.entries(obj)**: Returns an array of `[key, value]` pairs for own enumerable string-keyed properties.\n3. **Object.values(obj)**: Returns an array of property values.\n4. **String Padding**: `str.padStart(targetLength, padString)` formats numbers (e.g. `'5'.padStart(2, '0')` -> `'05'`).",
    why: "ES8 eliminated 'Promise callback hell' (`.then().then()`) by enabling synchronous-looking asynchronous code flow with standard try/catch error handling.",
    howItWorks: "1. V8 encounters async keyword.\n2. Marks function as returning an implicit Promise.\n3. At await expression, execution suspends, enqueuing a microtask when promise settles.",
    realWorldExample: "Fetching user data: `const res = await fetch('/api/user'); const data = await res.json();` inside a try/catch block.",
    snippet: `// 1. ES8 async/await with try...catch
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) throw new Error('User not found');
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Fetch failed:', error.message);
  }
}

// 2. Object.entries and Object.values
const scores = { math: 95, physics: 88, chemistry: 92 };
for (const [subject, score] of Object.entries(scores)) {
  console.log(\`\${subject}: \${score}\`);
}

// 3. String padStart
const invoiceNumber = '42'.padStart(6, '0');
console.log(invoiceNumber); // '000042'`,
    lineByLine: [
      { line: 2, code: "async function fetchUserData(userId) {", explanation: "Marks function as returning a Promise." },
      { line: 4, code: "const response = await fetch(...);", explanation: "Pauses execution until fetch Promise resolves; does not block main thread." },
      { line: 15, code: "for (const [subject, score] of Object.entries(scores))", explanation: "Iterates over [key, value] pairs cleanly." },
      { line: 20, code: "'42'.padStart(6, '0')", explanation: "Pads string with leading zeros to reach target length 6." },
    ],
    executionFlow: [
      "Step 1: fetchUserData is called and immediately returns a pending Promise.",
      "Step 2: await pauses execution inside the async function.",
      "Step 3: Network returns response; microtask resumes async function.",
      "Step 4: JSON parsed and final user object resolves the outer Promise.",
    ],
    mistakes: [
      "Forgetting to wrap `await` calls in a `try...catch` block, causing unhandled promise rejections.",
      "Using `await` in sequential loops when operations could run concurrently with `Promise.all()`.",
    ],
    traps: [
      "Trap: What does an async function return if you return a plain number `return 42`? Tip: It returns `Promise.resolve(42)`.",
    ],
    tips: [
      "For freshers: Always pair `async/await` with `try...catch` to handle network failures gracefully.",
    ],
    followUps: [
      "What happens if an error is thrown inside an async function without a try/catch block?",
      "How do you run multiple independent await operations in parallel?",
    ],
    followUpAnswers: [
      "The returned Promise rejects with the thrown error. If unhandled by caller, an 'UnhandledPromiseRejection' event fires.",
      "Use `await Promise.all([task1(), task2()])` so both asynchronous operations execute concurrently in parallel."
    ]
  }
]);

// -------------------------------------------------------------
// 4. DOM (DOM & Mutation Architecture)
// -------------------------------------------------------------
createGeneratorFile('domGenerator.mjs', 'dom', 'generateDomQuestion', [
  {
    q: "What is Event Bubbling, Event Capturing, and Event Delegation in the DOM?",
    concept: "DOM Event Propagation Pipeline & Event Delegation",
    topic: "Event Bubbling, Event Capturing & Custom Events",
    shortAnswer: "Event propagation travels in 3 phases: 1) Capturing Phase (trickles down from window to target), 2) Target Phase (executes at target), and 3) Bubbling Phase (bubbles up from target to window). Event Delegation uses bubbling to attach a single listener on a parent element to manage events for all children.",
    interviewAnswer: "The DOM event flow has 3 distinct phases: 1) Capturing phase (trickling): The event travels down from Window -> Document -> body -> down to the target. 2) Target phase: The event reaches the target element. 3) Bubbling phase: The event bubbles back up the tree. By default, `addEventListener(type, handler)` listens in the bubbling phase. Event Delegation is a powerful enterprise pattern where instead of attaching 1,000 click listeners to 1,000 list items, you attach 1 listener to the `<ul>` parent, checking `e.target.closest('li')`. This conserves memory and automatically works for dynamically added items.",
    detailedExplanation: "### DOM Event Flow and Delegation\n\n1. **Capturing vs Bubbling**:\n   - `element.addEventListener('click', fn)`: Listens during Bubbling (default, 3rd param is `false`).\n   - `element.addEventListener('click', fn, true)`: Listens during Capturing.\n2. **Stopping Propagation**:\n   - `e.stopPropagation()`: Stops event from bubbling up or capturing down further.\n   - `e.stopImmediatePropagation()`: Stops bubbling AND prevents other listeners on the SAME element from firing.\n   - `e.preventDefault()`: Cancels default browser action (like navigating an `<a>` link or submitting a form); does NOT stop propagation!\n3. **Event Delegation Benefits**:\n   - Memory conservation: 1 event listener vs 10,000 listeners.\n   - Dynamic elements: New items added via AJAX or user action immediately work without re-binding listeners.",
    why: "Event delegation avoids severe memory leaks and garbage collection overhead caused by attaching thousands of individual closures to dynamic DOM elements.",
    howItWorks: "1. User clicks a list item.\n2. Event captures down from window to target element.\n3. Event bubbles up through parents.\n4. Parent listener intercepts event and checks `e.target`.",
    realWorldExample: "A real-time chat list with 5,000 messages: Instead of 5,000 click listeners for delete buttons, a single delegated listener on the message feed container handles all delete clicks.",
    snippet: `// Enterprise Event Delegation Pattern
const userList = document.querySelector('#user-list');

userList.addEventListener('click', (event) => {
  // Find closest button within the clicked target
  const deleteBtn = event.target.closest('.delete-btn');
  if (!deleteBtn) return; // Exit if click was not on a delete button

  const listItem = deleteBtn.closest('li');
  const userId = listItem.dataset.userId;

  console.log('Deleting user ID:', userId);
  listItem.remove();
});`,
    lineByLine: [
      { line: 2, code: "const userList = document.querySelector('#user-list');", explanation: "Queries single parent container element." },
      { line: 4, code: "userList.addEventListener('click', (event) => {", explanation: "Attaches single listener to parent utilizing event bubbling." },
      { line: 6, code: "const deleteBtn = event.target.closest('.delete-btn');", explanation: "Checks if clicked element or its parent matches the target selector." },
      { line: 12, code: "listItem.remove();", explanation: "Removes DOM node safely without dangling listener leaks." },
    ],
    executionFlow: [
      "Step 1: User clicks on icon inside delete button.",
      "Step 2: Event bubbles up from icon -> button -> li -> ul#user-list.",
      "Step 3: Parent listener executes on ul#user-list.",
      "Step 4: closest('.delete-btn') matches and executes deletion logic.",
    ],
    mistakes: [
      "Confusing `event.target` (the actual innermost element clicked, like an icon) with `event.currentTarget` (the element the listener is attached to).",
      "Thinking `e.preventDefault()` stops event bubbling (it does not; use `e.stopPropagation()`).",
    ],
    traps: [
      "Trap: What is the difference between `e.target` and `e.currentTarget`? Tip: `e.target` is the element that triggered the event (innermost clicked node). `e.currentTarget` is the element where the event listener is attached.",
      "Trap: Do all DOM events bubble? Tip: No! Events like `focus`, `blur`, `load`, `unload`, and `mouseenter`/`mouseleave` do NOT bubble.",
    ],
    tips: [
      "For freshers: Always use `event.target.closest(selector)` when implementing event delegation so clicks on child icons or spans inside buttons work reliably.",
    ],
    followUps: [
      "Which common DOM events do NOT bubble?",
      "What is the difference between stopPropagation and stopImmediatePropagation?",
    ],
    followUpAnswers: [
      "Events that do NOT bubble include: `focus`, `blur`, `mouseenter`, `mouseleave`, `scroll`, and `load`.",
      "`stopPropagation()` stops the event from moving up or down the DOM tree. `stopImmediatePropagation()` does that AND prevents any remaining event listeners on the same element from running."
    ]
  }
]);

// -------------------------------------------------------------
// 5. BOM (BOM & Browser Runtime)
// -------------------------------------------------------------
createGeneratorFile('bomGenerator.mjs', 'bom', 'generateBomQuestion', [
  {
    q: "What is the Browser Object Model (BOM), and how does the History API (pushState/replaceState) enable Single Page Application (SPA) routing?",
    concept: "History API & Client-Side SPA Routing",
    topic: "History API: pushState, replaceState & SPA Routing Mechanics",
    shortAnswer: "The BOM represents the browser host environment outside the document, centered around the 'window' object. The History API methods history.pushState() and history.replaceState() enable SPA routers to change the URL without causing a full page refresh.",
    interviewAnswer: "The History API is the foundation of client-side routing in React Router, Vue Router, and Next.js: 1) `history.pushState(state, unused, url)`: Pushes a new URL entry onto the browser session history stack and updates the address bar WITHOUT causing the browser to reload the page or fetch new HTML. 2) `history.replaceState()`: Overwrites the current history entry instead of creating a new one (used for redirects or filter state). 3) `window.onpopstate`: The event that fires when the user clicks the browser Back or Forward buttons, allowing the SPA router to detect navigation and re-render the matching component.",
    detailedExplanation: "### How Client-Side Routing Operates\n\n1. **Traditional Web Navigation**: Clicking a link triggers an HTTP GET request to the server, server renders HTML, browser unloads old page and paints new page.\n2. **SPA Client-Side Navigation**:\n   - User clicks `<Link to='/about'>`.\n   - Link interceptor cancels native navigation via `event.preventDefault()`.\n   - Router calls `history.pushState(null, '', '/about')`.\n   - Router re-renders the `<About />` component inside the DOM without page reload.\n3. **The Popstate Event**: When user clicks Back button, `pushState` is NOT called; the browser fires the `popstate` event. The router listens to `window.addEventListener('popstate', ...)` and restores the matching view.\n4. **Server Fallback Requirement**: On page refresh (`/about`), the server must serve `index.html` for all paths (SPA fallback), otherwise the server returns a 404.",
    why: "The History API enabled modern web applications to provide instant, fluid app-like transitions without disruptive full-page white flashes and round-trip reloads.",
    howItWorks: "1. JavaScript calls history.pushState.\n2. Browser updates location bar and history stack.\n3. Zero network requests are made.\n4. popstate listener monitors Back/Forward browser buttons.",
    realWorldExample: "Navigating between tabs in GitHub or Twitter changes the URL instantly and loads new feeds via client-side routing without ever reloading the browser window.",
    snippet: `// Minimal Client-Side SPA Router Implementation
function navigateTo(url) {
  // 1. Update URL without page reload
  window.history.pushState({ path: url }, '', url);

  // 2. Render route view
  renderRoute(url);
}

// 3. Listen for browser Back/Forward navigation
window.addEventListener('popstate', (event) => {
  console.log('Navigated via Back/Forward buttons to:', window.location.pathname);
  renderRoute(window.location.pathname);
});

function renderRoute(path) {
  const content = document.querySelector('#app');
  if (path === '/about') {
    content.innerHTML = '<h1>About Us View</h1>';
  } else {
    content.innerHTML = '<h1>Home View</h1>';
  }
}`,
    lineByLine: [
      { line: 4, code: "window.history.pushState({ path: url }, '', url);", explanation: "Modifies address bar and creates history entry without network request." },
      { line: 11, code: "window.addEventListener('popstate', ...);", explanation: "Detects when user presses browser Back or Forward button." },
    ],
    executionFlow: [
      "Step 1: User clicks internal navigation button.",
      "Step 2: pushState updates address bar to '/about'.",
      "Step 3: SPA router updates DOM component.",
      "Step 4: User clicks browser Back button -> popstate event fires -> router restores '/'.",
    ],
    mistakes: [
      "Expecting `pushState` to trigger the `popstate` event (popstate is ONLY triggered by user browser actions like Back/Forward buttons, never by pushState itself!).",
      "Failing to configure web server fallback (like Nginx `try_files $uri /index.html;`), causing 404s when users refresh on deep links.",
    ],
    traps: [
      "Trap: Does `history.pushState()` trigger the `popstate` event? Tip: NO! popstate only fires when the user clicks the browser Back or Forward buttons or when `history.back()` is called.",
    ],
    tips: [
      "For freshers: Understand that SPA routers work by combining `history.pushState()` for clicks with `popstate` for Back/Forward buttons.",
    ],
    followUps: [
      "Why does refreshing an SPA route like `/dashboard` cause a 404 without proper server configuration?",
      "What is the difference between pushState and replaceState?",
    ],
    followUpAnswers: [
      "Because the browser sends an HTTP request to the web server asking for a physical file at `/dashboard`. The server must be configured with a fallback rule to serve `index.html` for all unknown routes so the client-side router can handle it.",
      "`pushState` creates a brand-new entry on the browser history stack. `replaceState` modifies the current history entry in place without adding to the Back button history."
    ]
  }
]);

// -------------------------------------------------------------
// 6. Web APIs (Modern Web APIs)
// -------------------------------------------------------------
createGeneratorFile('webApisGenerator.mjs', 'web-apis', 'generateWebApisQuestion', [
  {
    q: "How does the Fetch API work, how do you cancel in-flight requests with AbortController, and why doesn't Fetch reject on 404/500?",
    concept: "Fetch API, AbortController & HTTP Lifecycle",
    topic: "Fetch API, Request / Response Headers & AbortController",
    shortAnswer: "The Fetch API provides a promise-based interface for network requests. Crucially, fetch() promises only reject on network failures or CORS errors—they do NOT reject on HTTP 404 or 500 status codes (you must check response.ok). Requests can be cancelled using AbortController.",
    interviewAnswer: "Fetch is the modern standard for network requests, but candidates must know its quirks: 1) Rejection behavior: A `fetch()` Promise resolves successfully even if the server returns HTTP 404 or 500. It only rejects if the request physically fails (DNS resolution failure, offline, CORS block). To handle HTTP errors, you must verify `if (!response.ok)` (which checks if status is 200–299). 2) Cancellation with AbortController: Create `const controller = new AbortController()`, pass `{ signal: controller.signal }` to fetch, and call `controller.abort()` when a user navigates away or types in a debounced search field, throwing an `AbortError`.",
    detailedExplanation: "### Deep Dive into Fetch and AbortController\n\n1. **Response Stream**: `response.json()` and `response.text()` return promises because the response body is a `ReadableStream`. The body can only be consumed once.\n2. **AbortController Architecture**: The `AbortSignal` object emits an 'abort' event when `controller.abort()` is called. In modern JavaScript, `AbortSignal.timeout(5000)` provides native automatic timeout cancellation without manual `setTimeout`!\n3. **CORS Credentials**: By default in modern fetch, cookies are sent automatically for same-origin requests (`credentials: 'same-origin'`). For cross-origin cookie passing, use `credentials: 'include'`.",
    why: "Fetch replaced archaic `XMLHttpRequest` with standard Promise chaining, Streams, and clean request cancellation.",
    howItWorks: "1. fetch() dispatches HTTP request via browser networking thread.\n2. When headers arrive, Promise resolves with Response object.\n3. If controller.abort() is called before completion, browser terminates TCP connection and rejects with AbortError.",
    realWorldExample: "In an auto-complete search input: as the user types 'r', 're', 'rea', 'react', previous in-flight requests are aborted with `controller.abort()` so stale slow responses do not overwrite the latest search results (race condition prevention).",
    snippet: `// Fetch with AbortController and Timeout Signal
async function searchQuestions(query) {
  // Create AbortController to cancel stale requests
  const controller = new AbortController();

  try {
    const response = await fetch(\`/api/search?q=\${encodeURIComponent(query)}\`, {
      signal: controller.signal,
    });

    // Critical check: Fetch does NOT reject on 404 or 500!
    if (!response.ok) {
      throw new Error(\`HTTP Error: \${response.status}\`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Previous request was successfully cancelled.');
    } else {
      console.error('Network request failed:', error.message);
    }
  }
}

// Modern ES2022 Native Timeout
async function fetchWithTimeout(url) {
  // Automatically aborts if request takes longer than 5 seconds!
  return fetch(url, { signal: AbortSignal.timeout(5000) });
}`,
    lineByLine: [
      { line: 4, code: "const controller = new AbortController();", explanation: "Creates cancellation controller instance." },
      { line: 8, code: "signal: controller.signal,", explanation: "Links fetch request lifecycle to the abort controller." },
      { line: 12, code: "if (!response.ok) {", explanation: "Essential check: response.ok is true only for 200-299 HTTP status codes." },
      { line: 18, code: "if (error.name === 'AbortError')", explanation: "Distinguishes intentional user cancellation from genuine network failures." },
    ],
    executionFlow: [
      "Step 1: Network request dispatched with abort signal.",
      "Step 2: If controller.abort() is called, network connection is terminated immediately.",
      "Step 3: Promise rejects with DOMException named 'AbortError'.",
      "Step 4: Catch block ignores AbortError while logging real network bugs.",
    ],
    mistakes: [
      "Assuming `fetch()` rejects on HTTP 404 or 500 status codes (it does NOT; it resolves successfully).",
      "Attempting to read `response.json()` twice (the response stream can only be read once; use `response.clone()` if multiple reads are needed).",
    ],
    traps: [
      "Trap: Does `fetch()` reject when the server responds with a 500 Internal Server Error? Tip: NO! It resolves normally; you must check `response.ok`.",
    ],
    tips: [
      "For freshers: Always check `if (!response.ok)` immediately after awaiting `fetch()`.",
      "Use `AbortController` in search-as-you-type features to avoid race conditions.",
    ],
    followUps: [
      "How do you cancel an ongoing fetch request after 5 seconds?",
      "Why can't you read `response.json()` twice on the same response?",
    ],
    followUpAnswers: [
      "Pass `signal: AbortSignal.timeout(5000)` directly in the fetch options object, which automatically triggers an AbortError after 5000ms.",
      "Because the HTTP response body is an asynchronous ReadableStream that is locked and consumed into memory as chunks arrive; once consumed, the stream is closed. Use `response.clone().json()` if you need multiple consumers."
    ]
  }
]);

// -------------------------------------------------------------
// 7. TypeScript (Advanced Type System)
// -------------------------------------------------------------
createGeneratorFile('typescriptGenerator.mjs', 'typescript', 'generateTypescriptQuestion', [
  {
    q: "What is the difference between an interface and a type alias in TypeScript, and when should you choose each?",
    concept: "Interfaces vs Type Aliases & Declaration Merging",
    topic: "Interfaces vs Type Aliases: Declaration Merging & Performance",
    shortAnswer: "Interfaces are extendable object contracts that support declaration merging and are optimized for object shapes. Type aliases can define unions, primitives, tuples, and mapped types, but cannot be reopened for declaration merging.",
    interviewAnswer: "Both `interface` and `type` can define object contracts, but they have key differences: 1) Declaration Merging: Interfaces with the same name automatically merge into one unified interface, which is why library authors (like React and Express) use interfaces for extensibility. Type aliases throw an error if defined twice. 2) Capabilities: Types can define unions (`type Status = 'open' | 'closed'`), primitives (`type ID = string | number`), tuples, and mapped types. Interfaces can only define object/function shapes. 3) Extensibility: Interfaces extend with `extends`; types combine with intersection (`&`). 4) Recommendation: Use `interface` for object contracts and public APIs; use `type` for unions, primitives, and complex utility transformations.",
    detailedExplanation: "### In-Depth Comparison of Type vs Interface\n\n1. **Declaration Merging**:\n   ```ts\n   interface Window { customAnalytics: boolean; }\n   // Adds property to existing global Window interface without modifying node_modules!\n   ```\n2. **Type Performance**: In the TypeScript compiler (tsc), interfaces create a flat cached internal shape, making member lookup slightly faster in large codebases compared to intersection types (`A & B & C`).\n3. **Syntax Differences**:\n   - Interface: `interface User extends Person { role: string; }`\n   - Type: `type User = Person & { role: string; };`\n4. **Unions and Primitives**: Only `type` can define a discriminated union (`type Action = { type: 'ADD' } | { type: 'REMOVE' }`).",
    why: "TypeScript provides both to support both OOP object extensibility (interfaces) and functional type-algebra transformations (type aliases).",
    howItWorks: "1. TypeScript type checker parses AST.\n2. Interfaces register in compiler symbol table and merge declarations with matching identifiers.\n3. Type aliases are evaluated and expanded as aliases to underlying types.",
    realWorldExample: "Extending Express `Request` interface with a `user` property in an auth middleware via declaration merging, while defining API status codes with `type Status = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'`.",
    snippet: `// 1. Interface: Supports Declaration Merging and extends
interface UserAccount {
  id: string;
  email: string;
}

// Declaration merging adds new field to UserAccount interface
interface UserAccount {
  isActive: boolean;
}

// 2. Type Alias: Essential for Unions, Tuples, and Primitives
type UserRole = 'ADMIN' | 'ENGINEER' | 'CANDIDATE';

type ApiResponse<T> = {
  data: T;
  status: 200 | 400 | 500;
  role: UserRole;
};

// 3. Extending
interface AdminUser extends UserAccount {
  permissions: string[];
}`,
    lineByLine: [
      { line: 2, code: "interface UserAccount {", explanation: "Defines object contract for user account." },
      { line: 8, code: "interface UserAccount { isActive: boolean; }", explanation: "Declaration merging: adds isActive to UserAccount without error." },
      { line: 13, code: "type UserRole = 'ADMIN' | 'ENGINEER' | 'CANDIDATE';", explanation: "Union of string literals (impossible with an interface)." },
      { line: 15, code: "type ApiResponse<T> = { ... }", explanation: "Generic type alias representing network response payload." },
    ],
    executionFlow: [
      "Step 1: TypeScript compiler reads interface UserAccount declarations.",
      "Step 2: Compiler merges properties (id, email, isActive) into a single symbol table.",
      "Step 3: Union type UserRole restricts values to exact string literals.",
      "Step 4: Type checking verifies object conforms to merged contract.",
    ],
    mistakes: [
      "Accidentally creating duplicate interfaces with the same name in different files, causing unexpected declaration merging bugs.",
      "Trying to create a union using an `interface` (unions require `type`).",
    ],
    traps: [
      "Trap: Can an interface define a union type? Tip: No! `interface X = A | B` is invalid syntax. You must use `type`.",
      "Trap: What happens if you define two interfaces with the exact same name? Tip: They merge their properties into a single interface.",
    ],
    tips: [
      "For freshers: Rule of thumb: Use `interface` for object models and component props; use `type` for unions and primitives.",
    ],
    followUps: [
      "What is declaration merging and why is it useful when working with third-party libraries?",
      "Can a class implement both an interface and a type alias?",
    ],
    followUpAnswers: [
      "Declaration merging allows developers to augment third-party type definitions (like adding custom properties to Express `Request` or `window`) without editing the original node_modules source.",
      "Yes, a TypeScript class can implement an interface or a statically resolvable object type alias using `class MyClass implements MyInterfaceOrType {}`."
    ]
  }
]);

// -------------------------------------------------------------
// 8. ReactJS (React & Modern Architecture)
// -------------------------------------------------------------
createGeneratorFile('reactGenerator.mjs', 'react', 'generateReactQuestion', [
  {
    q: "How does React's Virtual DOM and Reconciliation algorithm work, and why are keys essential when rendering lists?",
    concept: "Virtual DOM, Diffing Rules & Fiber Reconciliation",
    topic: "Virtual DOM, Reconciliation & The Fiber Architecture",
    shortAnswer: "The Virtual DOM is an in-memory lightweight representation of the real DOM. When state changes, React creates a new Virtual DOM tree, diffs it against the previous tree using an O(n) heuristic reconciliation algorithm, and updates only the changed nodes in the real DOM. Keys give list items a persistent identity across renders.",
    interviewAnswer: "React's rendering pipeline operates in two phases: 1) Render Phase: React calls your component, produces Virtual DOM elements (ReactElements), and compares the new tree with the old tree. 2) Commit Phase: React applies minimal real DOM mutations. To make tree comparison fast, React uses an O(n) heuristic diffing algorithm based on two assumptions: Elements of different types produce different trees, and list children with unique `key` props preserve their identity across renders. Using array indices as keys is dangerous because reordering or deleting items causes React to reuse old state in the wrong component!",
    detailedExplanation: "### Reconciliation and the Power of Keys\n\n1. **The Heuristic Diffing Rules**:\n   - Different Element Types: If `<div>` changes to `<span>`, React destroys the entire subtree and builds a new DOM node from scratch.\n   - Same Element Type: React updates only the changed attributes or styles (e.g. `className` or `style`).\n2. **List Diffing Without Keys**: When inserting an item at the beginning of a list without keys, React mutates every single child item because it compares index 0 to index 0. With unique persistent keys, React simply inserts the new DOM node at index 0 and leaves the existing nodes untouched.\n3. **Why Never Use Index as Key**:\n   - If a list can be sorted, filtered, or items deleted, using `key={index}` causes component state bugs (like input focus sticking to the wrong item) and degrades performance.",
    why: "Direct DOM mutations are slow and trigger expensive browser layout/paint cycles. The Virtual DOM batches updates and performs surgical real DOM modifications.",
    howItWorks: "1. setState triggers component re-render.\n2. React produces new Fiber work nodes.\n3. Fiber reconciler compares new fibers with current fibers matching keys and types.\n4. Commit phase executes minimal real DOM operations.",
    realWorldExample: "A feed with 1,000 comments: inserting a new comment at the top with a unique `comment.id` key allows React to prepend 1 real DOM node, avoiding re-rendering the other 999 comments.",
    snippet: `// Correct List Rendering with Unique Keys
import React, { useState } from 'react';

export function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 'todo-1', text: 'Master HTML Semantics', completed: true },
    { id: 'todo-2', text: 'Study CSS Box Model', completed: false },
    { id: 'todo-3', text: 'Practice React Reconciliation', completed: false }
  ]);

  return (
    <div className="todo-container">
      <h2>Interview Study List</h2>
      <ul>
        {todos.map(todo => (
          // ALWAYS use unique, stable IDs as keys (never array index!)
          <li key={todo.id} className={todo.completed ? 'done' : ''}>
            <span>{todo.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
    lineByLine: [
      { line: 4, code: "export function TodoApp() {", explanation: "Functional component declaring stateful list." },
      { line: 16, code: "<li key={todo.id}", explanation: "Assigns stable, unique identifier key for React reconciliation." },
      { line: 17, code: "<span>{todo.text}</span>", explanation: "Child content tracked under persistent key." },
    ],
    executionFlow: [
      "Step 1: State changes when a new todo is added.",
      "Step 2: Component returns new Virtual DOM tree.",
      "Step 3: Reconciler matches existing <li> elements by their key ('todo-1', 'todo-2').",
      "Step 4: Only the newly prepended <li> is committed to the real DOM.",
    ],
    mistakes: [
      "Using array indices (`key={index}`) on lists where items can be reordered, filtered, or deleted.",
      "Generating random keys during render (`key={Math.random()}`), which forces React to recreate the entire DOM subtree on every single render!",
    ],
    traps: [
      "Trap: What happens if you use `key={Math.random()}`? Tip: Every render gives every element a new key, forcing React to completely destroy and re-mount every DOM node, destroying state and tanking performance.",
      "Trap: Are keys passed as props to child components? Tip: No! `key` and `ref` are reserved by React and cannot be accessed inside child props (`props.key` is undefined).",
    ],
    tips: [
      "For freshers: Always use database IDs or unique slug strings for `key`. Never use array indices unless the list is strictly static and never changes.",
    ],
    followUps: [
      "Why is `key={index}` problematic when an item is deleted from the middle of a list?",
      "Can a child component access its own `key` via `props.key`?",
    ],
    followUpAnswers: [
      "Because when item 2 is deleted, item 3 shifts to index 2. React assumes item 2 was simply updated rather than deleted, causing uncontrolled form inputs, checkbox states, and animations to attach to the wrong item.",
      "No. React reserves `key` for its internal reconciliation engine. If you need the ID inside the child component, pass it explicitly as a separate prop like `id={item.id}`."
    ]
  }
]);

// -------------------------------------------------------------
// 9. Redux (State Architecture & RTK)
// -------------------------------------------------------------
createGeneratorFile('reduxGenerator.mjs', 'redux', 'generateReduxQuestion', [
  {
    q: "What are the three core principles of Redux, and how does Redux Toolkit (RTK) simplify state management?",
    concept: "Three Core Principles & Redux Toolkit (RTK) Architecture",
    topic: "Redux Core Principles: Single Store, Pure Reducers & Immutability",
    shortAnswer: "Redux has 3 core principles: 1) Single source of truth (one store), 2) State is read-only (changes triggered only by dispatching actions), and 3) Changes are made with pure functions (reducers). Redux Toolkit simplifies this via configureStore and createSlice with built-in Immer for safe immutable updates.",
    interviewAnswer: "I explain Redux from fundamentals to modern RTK: 1) Three Core Principles: The entire application state lives in a single store tree. To change state, components dispatch an action object describing what happened (`{ type: 'counter/increment' }`). Pure reducer functions calculate the next state without mutating the old state. 2) Redux Toolkit (RTK): Classic Redux required immense boilerplate (action creators, action type constants, manual immutable copying). RTK's `createSlice` generates actions and reducers automatically in one definition, integrating Immer.js so you can write natural `state.count += 1` code while Immer handles structural sharing under the hood.",
    detailedExplanation: "### Modern Redux with RTK\n\n1. **Unidirectional Data Flow**: UI dispatches action -> Middleware processes -> Reducers compute new state -> Store updates -> UI re-renders via `useSelector`.\n2. **Immer.js Integration**: In classic Redux, mutating state directly (`state.users.push(user)`) breaks change detection because object references don't change. RTK wraps reducers in Immer proxies, allowing 'mutating' code that safely outputs an immutable updated state.\n3. **RTK Query**: Built-in data fetching and caching layer that eliminates the need for manual thunks, loading flags, and error states.",
    why: "Redux makes global application state changes completely predictable, traceable, and inspectable with time-travel Redux DevTools.",
    howItWorks: "1. Component calls useDispatch() to dispatch an action.\n2. Store passes current state and action to root reducer.\n3. createSlice reducer updates state.\n4. Components subscribed via useSelector re-render if selected data changed.",
    realWorldExample: "A shopping cart state: adding an item from product detail, header cart badge counter, and checkout page all subscribe to `state.cart.items` via `useSelector`, staying 100% synchronized.",
    snippet: `// Modern Redux Toolkit (RTK) Slice Implementation
import { createSlice, configureStore } from '@reduxjs/toolkit';

// 1. Create Slice with createSlice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalCount: 0,
  },
  reducers: {
    // Immer allows 'mutating' syntax safely under the hood!
    addItem: (state, action) => {
      state.items.push(action.payload);
      state.totalCount += 1;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalCount = 0;
    },
  },
});

// Export actions and reducer
export const { addItem, clearCart } = cartSlice.actions;

export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
});`,
    lineByLine: [
      { line: 5, code: "const cartSlice = createSlice({", explanation: "RTK function combining actions and reducers in one clean definition." },
      { line: 13, code: "state.items.push(action.payload);", explanation: "Immer detects mutation and produces an immutably updated state tree." },
      { line: 22, code: "export const { addItem, clearCart } = cartSlice.actions;", explanation: "Automatically generated action creators." },
      { line: 24, code: "export const store = configureStore({", explanation: "Configures store with Redux DevTools and thunk middleware out of the box." },
    ],
    executionFlow: [
      "Step 1: Component dispatches addItem({ id: 1, name: 'T-Shirt' }).",
      "Step 2: cartSlice reducer intercepts action.",
      "Step 3: Immer proxy tracks state modifications.",
      "Step 4: Store emits new immutable state snapshot.",
      "Step 5: React components using useSelector(state => state.cart) re-render.",
    ],
    mistakes: [
      "Mutating state outside of Redux Toolkit's createSlice reducers.",
      "Putting non-serializable values (like Promises, DOM nodes, or functions) into the Redux store state.",
    ],
    traps: [
      "Trap: Can you mutate state inside an RTK createSlice reducer? Tip: YES! RTK uses Immer under the hood, which intercepts mutations and produces immutable copies safely.",
      "Trap: Why must reducers be pure functions? Tip: Because pure functions guarantee that the same input state and action will always produce the exact same output, enabling time-travel debugging.",
    ],
    tips: [
      "For freshers: Always use modern Redux Toolkit (`@reduxjs/toolkit`). Never write legacy boilerplate Redux with manual switch statements.",
    ],
    followUps: [
      "How does Immer.js allow you to write mutating code inside createSlice safely?",
      "What is the difference between useSelector and traditional connect() in Redux?",
    ],
    followUpAnswers: [
      "Immer wraps the current state in a JavaScript `Proxy` object. When you write `state.items.push()`, Immer records the mutations and copies only the changed nodes (structural sharing) to produce a new immutable state tree.",
      "`useSelector` is a React Hook that subscribes to the Redux store with strict reference equality checking, eliminating Higher-Order Component (HOC) boilerplate required by legacy `connect()`."
    ]
  }
]);

console.log('🎉 All specialized generator modules created successfully!');
