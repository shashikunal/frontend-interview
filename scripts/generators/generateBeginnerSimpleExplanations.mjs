// scripts/generators/generateBeginnerSimpleExplanations.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../public/data/interview-questions');

const TARGET_SUBJECTS = [
  'javascript',
  'css',
  'es6',
  'dom',
  'bom',
  'web-apis',
  'typescript',
  'react',
  'redux'
];

const COMPILER_JARGON = [
  'compilation pipeline',
  'ignition bytecode',
  'turbofan',
  'abstract syntax tree',
  'cssom & render tree synthesis',
  'event dispatch & propagation pipeline',
  'typescript compiler (tsc) pipeline',
  'fiber node & work loop',
  'single source of truth & immutability: redux maintains the entire application state in a single immutable',
  'deep technical dive',
  'ast',
  'bytecode interpreter'
];

function isAdvancedCompilerExplanation(text, detailed) {
  if (!text) return true;
  const lower = text.toLowerCase();
  if (COMPILER_JARGON.some(j => lower.includes(j))) return true;
  if (detailed && detailed.toLowerCase().slice(0, 100).includes(lower.slice(0, 50))) return true;
  return false;
}

function cleanText(t) {
  return (t || '').replace(/[*_#`]/g, '').replace(/\s+/g, ' ').trim();
}

function getFirstSentence(text) {
  const clean = cleanText(text);
  const m = clean.match(/^.+?[.?!](?=\s|$)/);
  return m ? m[0].trim() : clean;
}

/**
 * Generates a clean, beginner-friendly explanation with:
 * 1. Plain-English analogy or simple overview.
 * 2. 2-3 step-by-step bullet points.
 * 3. A memorable beginner takeaway rule.
 */
function createBeginnerExplanation(q, subject) {
  const concept = cleanText(q.concept || q.subtopic || q.question);
  const topic = cleanText(q.topic || subject);
  const lowerConcept = concept.toLowerCase();
  const short = cleanText(q.shortAnswer);

  // Subject-specific beginner explanations
  if (subject === 'javascript') {
    if (/execution context|creation phase|execution phase/i.test(lowerConcept)) {
      return `An **Execution Context** is like a workspace or container that JavaScript sets up whenever your code runs. Think of it as the environment where JavaScript prepares and evaluates your code.

Whenever JavaScript runs your code, it does so in two simple phases:
1. **Creation Phase (Preparation)**: Before executing a single line, JavaScript scans your code and reserves memory for all variables and functions (known as Hoisting). Variables with \`var\` are initialized as \`undefined\`, while \`let\` and \`const\` remain uninitialized in a waiting state.
2. **Execution Phase (Running Code)**: JavaScript runs through your code line-by-line from top to bottom, assigns actual values to your variables, and executes your functions in order.

💡 **Beginner Rule**: First JavaScript prepares memory (Creation), and then it runs your code (Execution).`;
    }

    if (/lexical environment|variable environment/i.test(lowerConcept)) {
      return `A **Lexical Environment** is JavaScript's way of tracking where variables and functions sit in your code. The word "lexical" simply means "where it is physically written in your source file".

Every environment has two main parts:
1. **Environment Record**: An internal storage space that holds all local variables and function declarations declared inside that block or function.
2. **Outer Reference**: A link pointing to the parent (outer) environment. If JavaScript cannot find a variable in the local scope, it follows this link to search outer scopes.

💡 **Beginner Rule**: Scope is determined by where you write your code in your editor, not where or when you call it.`;
    }

    if (/scope chain|identifier lookup/i.test(lowerConcept)) {
      return `The **Scope Chain** is the path JavaScript takes to find the value of a variable when your code asks for it.

When you use a variable:
1. JavaScript first searches inside the current function's local scope.
2. If it is not found, it moves one step up to the outer parent function.
3. It repeats this step-by-step all the way up to the global \`window\` (or \`global\`) scope.
4. If it reaches the top and still cannot find the variable, it throws a \`ReferenceError\`.

💡 **Beginner Rule**: Scope lookups always travel upwards from child to parent, never downwards from parent into child.`;
    }

    if (/closure/i.test(lowerConcept)) {
      return `A **Closure** is when an inner function remembers and keeps access to variables from its outer parent function, even after the parent function has finished running and returned.

Think of it like a backpack:
1. **Parent Runs**: The parent function runs, creates variables, and defines an inner function.
2. **Backpack Packed**: The inner function packs all the variables it needs from the parent into its "backpack".
3. **Parent Returns**: Even though the parent is done executing, the inner function retains its backpack and can use those variables anytime it is called later.

💡 **Beginner Rule**: Closures allow you to create private variables and maintain state between function calls without polluting the global scope.`;
    }

    if (/garbage collection|memory leak/i.test(lowerConcept)) {
      return `**Garbage Collection** is JavaScript's automatic cleanup crew. When variables and objects are no longer needed or reachable by your code, JavaScript automatically frees up that memory so your browser does not slow down.

How it works simply:
1. **Reachability**: JavaScript starts from "root" objects (like the global \`window\`) and follows all references to see what objects can still be reached.
2. **Mark-and-Sweep**: Objects that can be reached are marked as active; any object left unmarked is considered trash and swept away from memory.
3. **Memory Leaks**: Occur when you forget to clean up references (such as uncleared \`setInterval\` timers or detached DOM elements), preventing the garbage collector from freeing them.

💡 **Beginner Rule**: If you attach a timer or event listener, always clean it up when the component or element is removed.`;
    }

    if (/hoisting/i.test(lowerConcept)) {
      return `**Hoisting** is JavaScript's behavior of allocating memory for variable and function declarations during the Creation Phase before any code executes.

How different declarations behave:
1. **Function Declarations**: Fully hoisted and can be called before their definition in the file.
2. **\`var\` Variables**: Hoisted, but initialized with \`undefined\`. Accessing them before their declaration returns \`undefined\` instead of an error.
3. **\`let\` and \`const\`**: Hoisted, but not initialized. They sit in the **Temporal Dead Zone (TDZ)**, and accessing them before their declaration throws a \`ReferenceError\`.

💡 **Beginner Rule**: Always declare variables and functions at the top of their scope before using them to keep code readable and bug-free.`;
    }

    if (/temporal dead zone|tdz/i.test(lowerConcept)) {
      return `The **Temporal Dead Zone (TDZ)** is the period between the start of a block of code and the exact line where a \`let\` or \`const\` variable is declared.

1. **Entering Scope**: When the block starts, JavaScript knows the variable exists, but it has not initialized it yet.
2. **The Dead Zone**: If you attempt to read or write to that variable before reaching its declaration line, JavaScript throws a \`ReferenceError\`.
3. **Safe to Use**: Once the engine executes the declaration line, the variable leaves the TDZ and is ready for normal use.

💡 **Beginner Rule**: The TDZ was added in ES6 to protect developers from using uninitialized variables before they are declared.`;
    }

    if (/this keyword|call|apply|bind/i.test(lowerConcept)) {
      return `In JavaScript, the **\`this\`** keyword refers to the object currently executing the function. Unlike regular variables, its value depends entirely on *how* the function is called.

The 4 common ways \`this\` is determined:
1. **Object Method (\`obj.greet()\`)**: \`this\` points to \`obj\`.
2. **Standalone Function (\`greet()\`)**: \`this\` defaults to the global \`window\` (or \`undefined\` in strict mode).
3. **Constructor (\`new User()\`)**: \`this\` points to the newly created object instance.
4. **Explicit Binding (\`call\`, \`apply\`, \`bind\`)**: You manually tell JavaScript which object \`this\` should point to.

💡 **Beginner Rule**: Ask "What object is to the left of the dot when this function is called?" That object is your \`this\`. Arrow functions do not have their own \`this\`; they inherit it from their outer scope.`;
    }

    if (/event loop|microtask|macrotask/i.test(lowerConcept)) {
      return `The **Event Loop** is the mechanism that allows single-threaded JavaScript to perform non-blocking asynchronous operations (like timers, network requests, and clicks).

Think of it as a continuous traffic controller:
1. **Call Stack**: Synchronous code runs here line-by-line. JavaScript never interrupts the Call Stack while code is running.
2. **Microtask Queue (High Priority)**: When the Call Stack becomes empty, the Event Loop drains all resolved Promises (\`.then()\`, \`async/await\`, \`queueMicrotask\`) first.
3. **Macrotask Queue (Standard Priority)**: Once microtasks are completely finished, the Event Loop picks the next timer or event callback (\`setTimeout\`, \`setInterval\`, DOM events).

💡 **Beginner Rule**: Promises (microtasks) always run before timers (macrotasks) after synchronous code finishes.`;
    }

    if (/prototype|inheritance/i.test(lowerConcept)) {
      return `JavaScript uses **Prototypal Inheritance**, meaning objects can inherit properties and methods directly from other objects.

How the prototype chain works:
1. Every JavaScript object has an internal link (\`__proto__\`) pointing to its prototype object.
2. When you access \`user.name\`, JavaScript checks if \`name\` exists directly on \`user\`.
3. If not, it walks up the prototype chain to check the prototype object.
4. It keeps climbing until it either finds the property or hits \`null\` at the very end of the chain.

💡 **Beginner Rule**: Prototypes save memory because all instances share the same methods on their prototype rather than creating duplicate copies.`;
    }
  }

  if (subject === 'css') {
    if (/box-sizing|box model/i.test(lowerConcept)) {
      return `In CSS, every element is rendered as a rectangular box composed of content, padding, border, and margin.

By default (\`box-sizing: content-box\`):
- Adding \`20px\` padding to a \`200px\` wide element expands its total width to \`240px\`, frequently breaking page layouts.

Using **\`box-sizing: border-box\`**:
- Tells the browser to include padding and borders *inside* the specified width. A \`200px\` element stays exactly \`200px\`.
- Applying \`*, *::before, *::after { box-sizing: border-box; }\` guarantees consistent, predictable dimensions across your entire layout.

💡 **Beginner Rule**: Always set \`box-sizing: border-box\` on all elements at the start of your project to prevent unexpected width overflows.`;
    }

    if (/flexbox/i.test(lowerConcept)) {
      return `**Flexbox** is a one-dimensional CSS layout tool designed to arrange items in either a row (horizontally) or a column (vertically).

Key concepts:
1. **Flex Container**: Setting \`display: flex\` turns a parent into a flex container and all its immediate children into flex items.
2. **Main Axis & Cross Axis**: By default, the main axis is horizontal. You use \`justify-content\` to align items along the main axis and \`align-items\` to align along the cross axis.
3. **Dynamic Spacing**: Flex items can automatically grow (\`flex-grow\`), shrink (\`flex-shrink\`), or wrap (\`flex-wrap\`) to fit any screen size.

💡 **Beginner Rule**: Use Flexbox for one-dimensional layouts (navbars, card rows, centering items). Use Grid for two-dimensional page layouts (rows AND columns).`;
    }

    if (/grid/i.test(lowerConcept)) {
      return `**CSS Grid** is a powerful two-dimensional layout system that lets you organize content into both rows and columns at the same time.

How it works:
1. **Grid Container**: Setting \`display: grid\` on a parent element creates a grid formatting context.
2. **Track Definitions**: Use \`grid-template-columns\` and \`grid-template-rows\` to define column and row sizes (e.g. \`repeat(3, 1fr)\` for 3 equal columns).
3. **Gap & Placement**: Use \`gap\` to add clean spacing between cells without awkward negative margins.

💡 **Beginner Rule**: Grid is the ideal choice for full-page layouts, photo galleries, and dashboards with complex row-and-column alignment.`;
    }

    if (/specificity|cascade/i.test(lowerConcept)) {
      return `**CSS Specificity** is the score-based ranking system browsers use to decide which CSS rule wins when multiple rules target the same element.

The specificity hierarchy (from highest to lowest priority):
1. **Inline Styles** (\`style="..."\`): Highest priority (score: 1000).
2. **IDs** (\`#header\`): Very strong priority (score: 100).
3. **Classes, Attributes, and Pseudo-classes** (\`.nav\`, \`[type="text"]\`, \`:hover\`): Standard styling (score: 10).
4. **Element Tags and Pseudo-elements** (\`div\`, \`p\`, \`::before\`): Lowest base priority (score: 1).

💡 **Beginner Rule**: Avoid using \`!important\` to fix styling issues. Instead, keep specificity low and consistent by styling with single class selectors.`;
    }
  }

  if (subject === 'react') {
    if (/jsx|createelement/i.test(lowerConcept)) {
      return `Web browsers do not understand JSX syntax (like \`<h1>Hello</h1>\` written directly inside JavaScript files).

**JSX Transformation** is the build step that makes JSX browser-friendly:
1. **Build Step**: A compiler (like Babel or Vite) automatically converts your JSX tags into standard JavaScript function calls (\`React.createElement\` or \`_jsx\`).
2. **Virtual DOM Objects**: These function calls evaluate to simple JavaScript objects that describe what should appear on the screen.
3. **Rendering**: React takes these objects and updates the real browser DOM with minimal changes.

💡 **Beginner Rule**: JSX is just syntactic sugar for function calls that return plain JavaScript objects representing your UI.`;
    }

    if (/virtual dom|reconciliation|diffing/i.test(lowerConcept)) {
      return `The **Virtual DOM** is a lightweight in-memory JavaScript copy of the real browser DOM.

Why React uses it:
1. **Updating the Real DOM is Slow**: Frequent DOM redraws and reflows are expensive for browsers.
2. **Diffing Algorithm**: When state changes, React creates a new Virtual DOM tree and compares ("diffs") it with the previous Virtual DOM tree.
3. **Minimal Updates**: React calculates the exact minimal changes needed and updates only those specific elements in the real DOM.

💡 **Beginner Rule**: The Virtual DOM prevents unnecessary full-page redraws by batching and applying only the differences to the real DOM.`;
    }

    if (/fiber/i.test(lowerConcept)) {
      return `**React Fiber** is the underlying engine inside React that powers component rendering and updates.

In simple terms:
1. **Chunking Work**: In older versions of React, once rendering started, it could not be stopped until the whole page finished, freezing user interactions.
2. **Interruptible Rendering**: Fiber breaks rendering work into small units. If a user types or clicks while React is computing in the background, React can pause its background work, handle the user input immediately, and resume rendering later.

💡 **Beginner Rule**: Fiber makes complex React applications feel fast and responsive by prioritizing urgent user interactions over background updates.`;
    }

    if (/hook|state|useeffect|usestate|usememo|usecallback|useref/i.test(lowerConcept)) {
      return `**React Hooks** are built-in functions that let you "hook into" React state and component lifecycle features from functional components.

Core rules to remember:
1. **Only Call at the Top Level**: Never call hooks inside loops, conditional \`if\` statements, or nested functions. React relies on the exact order of hook calls on every render.
2. **Only Call from React Functions**: Call hooks only from React function components or custom hooks.
3. **Dependency Arrays**: When using \`useEffect\` or \`useMemo\`, always declare every external variable you use in the dependency array to avoid stale values.

💡 **Beginner Rule**: Hooks keep your component state predictable by associating persistent memory cells with your component across re-renders.`;
    }
  }

  if (subject === 'typescript') {
    if (/inference|annotation|widening/i.test(lowerConcept)) {
      return `TypeScript helps you catch bugs early by checking variable types before your code runs in production.

The difference between the three key terms:
1. **Type Inference**: TypeScript is smart enough to guess the type automatically. For example, if you write \`let count = 0\`, TypeScript infers that \`count\` is a \`number\` without you adding \`: number\`.
2. **Type Annotation**: You explicitly declare the intended type, such as \`let user: string = "Kunal"\`.
3. **Type Widening**: When you declare a variable with \`let\`, TypeScript widens specific literal values (like the string \`"admin"\`) to the general \`string\` type, because a \`let\` variable can be reassigned to any other string later.

💡 **Beginner Rule**: Rely on automatic Type Inference for local variables, and use explicit Type Annotations for function parameters and return types.`;
    }

    if (/interface|type alias/i.test(lowerConcept)) {
      return `In TypeScript, both **Interfaces** and **Type Aliases** allow you to define the shape and contract of data objects.

How to choose between them:
1. **Interfaces (\`interface User { ... }\`)**: Best for modeling object shapes and public APIs. Interfaces support "declaration merging" (adding new fields to existing interfaces) and can be extended with \`extends\`.
2. **Type Aliases (\`type ID = string | number\`)**: More flexible for creating unions, primitives, tuples, and mapped types that interfaces cannot represent.

💡 **Beginner Rule**: Use \`interface\` when defining objects and component props; use \`type\` when creating unions (\`A | B\`) or complex utility types.`;
    }

    if (/generics/i.test(lowerConcept)) {
      return `**Generics** allow you to write reusable functions and components that work with a variety of data types while keeping 100% type safety.

Think of generics as variables, but for *types* instead of *values*:
1. Instead of locking a function to only accept strings or numbers, you pass a type parameter: \`<T>\`.
2. When you call the function, TypeScript captures the exact type of argument you passed and enforces it across the return value and internal operations.

💡 **Beginner Rule**: Generics eliminate the need to use \`any\` when writing reusable helper functions, API clients, and data collections.`;
    }
  }

  if (subject === 'dom') {
    if (/tree|node|hierarchy/i.test(lowerConcept)) {
      return `The **DOM (Document Object Model)** is the browser's in-memory representation of an HTML document as a structured family tree.

How the tree is organized:
1. **Document**: The root container representing the whole web page.
2. **Elements**: Tags like \`<html>\`, \`<body>\`, and \`<button>\` are element nodes that form parent-child and sibling relationships.
3. **Text & Attributes**: Text content inside tags and attributes (like \`class\` or \`id\`) are also nodes on this tree.
4. **JavaScript Access**: JavaScript uses methods like \`document.querySelector()\` to find, modify, or delete any node dynamically.

💡 **Beginner Rule**: Any visual change you see on a web page happens by modifying nodes in the DOM tree.`;
    }

    if (/event bubbling|capturing|delegation/i.test(lowerConcept)) {
      return `When you click an element on a web page, the event travels through the DOM tree in a standard 3-phase journey:

1. **Capturing Phase**: The event travels down from the top (\`window\` and \`document\`) down through ancestor elements to the target element you clicked.
2. **Target Phase**: The event reaches the specific element that triggered the interaction.
3. **Bubbling Phase**: The event "bubbles" back up from the target element through all its parent ancestors to the top of the document.
4. **Event Delegation**: Because events bubble up, you can attach a single event listener to a common parent element to handle clicks on dozens of child buttons efficiently.

💡 **Beginner Rule**: Event Delegation saves browser memory by listening on one parent instead of adding separate listeners to hundreds of list items.`;
    }
  }

  if (subject === 'redux') {
    if (/principles|single source|store/i.test(lowerConcept)) {
      return `**Redux** is a state management library built on three fundamental principles to make application data predictable and easy to debug:

1. **Single Source of Truth**: The entire state of your application is stored in one central JavaScript object called the **Store**.
2. **State is Read-Only**: You cannot modify state directly. The only way to trigger a state change is to dispatch an **Action** (an object describing what happened).
3. **Changes Made with Pure Functions**: State updates are calculated by **Reducers**—pure functions that take the current state and an action, and return a brand new state object.

💡 **Beginner Rule**: Data in Redux always flows in a single direction: Component -> Dispatches Action -> Reducer Computes New State -> Store Updates -> Component Re-renders.`;
    }

    if (/reducer|action|dispatch/i.test(lowerConcept)) {
      return `In Redux, state changes follow a strict, predictable 3-part cycle:

1. **Action**: A simple JavaScript object describing what event occurred, such as \`{ type: 'cart/addItem', payload: product }\`.
2. **Dispatch**: The method used to send that action to the Redux store (\`dispatch(action)\`).
3. **Reducer**: A pure function with the signature \`(state, action) => newState\`. It checks the action type and returns a fresh copy of the updated state without mutating the original object.

💡 **Beginner Rule**: Reducers must never mutate state directly (\`state.count++\`); they must always return a new state object (\`{ ...state, count: state.count + 1 }\`).`;
    }
  }

  if (subject === 'es6') {
    if (/let|const|var/i.test(lowerConcept)) {
      return `JavaScript has three keywords for declaring variables, with modern development heavily favoring \`const\` and \`let\` over legacy \`var\`:

1. **\`const\`**: Block-scoped. Cannot be reassigned once declared. Use this as your default for all variables.
2. **\`let\`**: Block-scoped. Can be reassigned when state needs to change (e.g. counters, loop iterators).
3. **\`var\`**: Function-scoped (or global). Can be redeclared, hoists with \`undefined\`, and leaks outside \`if\` blocks and loops. Avoid using \`var\` in modern code.

💡 **Beginner Rule**: Default to \`const\` everywhere; only switch to \`let\` when you specifically know the variable will be reassigned.`;
    }

    if (/arrow function/i.test(lowerConcept)) {
      return `**Arrow functions** (\`() => {}\`) provide a modern, concise syntax for writing JavaScript functions.

Two major advantages:
1. **Shorter Syntax**: You can omit the \`function\` keyword and write clean one-liners with implicit returns: \`const double = x => x * 2\`.
2. **Lexical \`this\`**: Arrow functions do not bind their own \`this\`. Instead, they inherit \`this\` from the surrounding code where they were written, solving common binding bugs in callbacks and timers.

💡 **Beginner Rule**: Use arrow functions for callbacks, array methods (\`.map()\`, \`.filter()\`), and component handlers to preserve lexical scope.`;
    }

    if (/promise|async|await/i.test(lowerConcept)) {
      return `**Promises** and **async/await** allow JavaScript to handle asynchronous tasks (like fetching data from a server) without freezing the user interface.

How they work together:
1. **Promise**: An object representing a task that will finish in the future. It starts in a **pending** state, and settles as either **fulfilled** (success) or **rejected** (error).
2. **\`async\`**: Declares that a function returns a Promise automatically.
3. **\`await\`**: Pauses the execution of the async function until the Promise settles, letting you write async code that reads top-to-bottom like synchronous code.

💡 **Beginner Rule**: Always wrap \`await\` calls inside a \`try...catch\` block to cleanly handle network failures and API errors.`;
    }
  }

  if (subject === 'web-apis') {
    if (/fetch/i.test(lowerConcept)) {
      return `The **Fetch API** is the modern native browser interface for making HTTP network requests.

How to use it simply:
1. **Request**: Calling \`fetch(url)\` returns a Promise that resolves to a \`Response\` object as soon as the server sends headers.
2. **Parsing Data**: You call \`await response.json()\` to parse the response body into usable JavaScript objects.
3. **HTTP Status Checking**: Fetch only rejects on network failure (offline); it does not reject on 404 or 500 errors. You must check \`if (!response.ok)\` manually.

💡 **Beginner Rule**: Always check \`response.ok\` before reading response data with the Fetch API.`;
    }

    if (/localstorage|sessionstorage/i.test(lowerConcept)) {
      return `Web Storage lets you save key-value pairs directly in the user's browser without requiring a database.

The difference between the two storage types:
1. **\`localStorage\`**: Persists permanently. Data remains intact even when the user closes their browser or restarts their computer.
2. **\`sessionStorage\`**: Temporary storage. Data is automatically cleared as soon as the user closes the browser tab.
3. **Strings Only**: Web Storage only stores strings. Use \`JSON.stringify()\` to save objects and \`JSON.parse()\` to read them back.

💡 **Beginner Rule**: Never store sensitive data (passwords, JWT auth tokens) in localStorage because any script on the page (including XSS vulnerabilities) can read it.`;
    }
  }

  // Authoritative fallback: Clean, intuitive 3-step breakdown based on shortAnswer
  const cleanFirst = getFirstSentence(short) || `${concept} is a fundamental concept in ${subject}.`;
  return `${cleanFirst}

In practical web development:
1. **Purpose**: It provides a clean, standardized way to handle ${concept} without unexpected side effects.
2. **Behavior**: Modern browsers and runtimes execute this deterministically to ensure predictable state and rendering.
3. **Best Practice**: Keeping your code aligned with this pattern prevents subtle bugs and ensures high performance.

💡 **Beginner Rule**: Master the core mechanism of ${concept} before exploring advanced optimizations.`;
}

console.log(`Auditing and synthesizing beginner-friendly explanations for 9 core subjects...`);

let updatedCount = 0;
let preservedCount = 0;
let totalChecked = 0;

for (const subId of TARGET_SUBJECTS) {
  const filePath = path.join(DATA_DIR, `${subId}.json`);
  if (!fs.existsSync(filePath)) continue;

  const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let subUpdated = 0;

  const updated = questions.map((q) => {
    totalChecked++;
    const currentSimple = q.simpleExplanation || '';
    const detailed = q.detailedExplanation || '';

    const needsBeginnerRevamp = isAdvancedCompilerExplanation(currentSimple, detailed);

    if (!needsBeginnerRevamp) {
      preservedCount++;
      return q;
    }

    subUpdated++;
    updatedCount++;

    const beginnerExplanation = createBeginnerExplanation(q, subId);

    return {
      ...q,
      simpleExplanation: beginnerExplanation,
      // Ensure detailedAnswer exists for beginner mode fallback
      detailedAnswer: q.detailedAnswer || beginnerExplanation,
    };
  });

  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf8');
  console.log(`✓ ${subId.padEnd(16)}: Replaced ${subUpdated} advanced compiler explanations with beginner explanations.`);
}

console.log('\n======================================================');
console.log(`🎉 BEGINNER EXPLANATION CONVERSION COMPLETE!`);
console.log(`TOTAL QUESTIONS CHECKED:     ${totalChecked}`);
console.log(`CONVERTED TO BEGINNER LEVEL: ${updatedCount}`);
console.log(`ALREADY BEGINNER-FRIENDLY:   ${preservedCount}`);
console.log('======================================================');
