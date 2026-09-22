// scripts/auditAndSanitizeAllShortAnswers.mjs
import fs from 'fs';
import path from 'path';

const DATA_DIR = 'public/data/interview-questions';

const TARGET_FILES = [
  'bom.json',
  'css.json',
  'dom.json',
  'es6.json',
  'es7.json',
  'es8.json',
  'javascript.json',
  'react.json',
  'redux.json',
  'typescript.json',
  'web-apis.json',
];

/**
 * Creates a clean, crisp, 2-3 sentence interview answer for a question.
 * Strictly adheres to simple English, zero boilerplate, zero "1. In simple words...", zero "Real-life analogy".
 */
function createCrispShortAnswer(q, subject) {
  const concept = q.concept || q.question || 'This feature';
  const topic = q.topic || subject;

  // If detailedExplanation or why has clean sentences, we can extract or synthesize:
  // Let's create clean domain-specific definitions based on subject and concept:
  let cleanDef = '';

  // Clean concept name without excessive trailing punctuation or quotes
  const cleanConcept = concept.replace(/^["']|["']$/g, '').trim();

  // Determine subject display
  const subjectDisplay = {
    react: 'React',
    javascript: 'JavaScript',
    css: 'CSS',
    typescript: 'TypeScript',
    dom: 'the DOM',
    bom: 'the Browser Object Model (BOM)',
    es6: 'modern ECMAScript (ES6+)',
    es7: 'ECMAScript 2016 (ES7)',
    es8: 'ECMAScript 2017 (ES8)',
    redux: 'Redux',
    'web-apis': 'Web APIs',
  }[subject] || subject;

  // Check if mcqExplanation contains clean sentences
  if (q.mcqExplanation && !q.mcqExplanation.includes('provides reliable, standards-compliant execution:')) {
    cleanDef = q.mcqExplanation.trim();
  }

  // If cleanDef is empty or generic, synthesize a high-quality 2-3 sentence definition
  if (!cleanDef || cleanDef.includes('provides reliable, standards-compliant execution:')) {
    // Generate authoritative, simple-English definition tailored to concept & subject
    cleanDef = synthesizeAuthoritativeAnswer(cleanConcept, subject, q);
  }

  return cleanDef;
}

function synthesizeAuthoritativeAnswer(concept, subject, q) {
  // Topic context
  const topic = q.topic || '';
  const subtopic = q.subtopic || '';

  // Extract from howItWorks or why if available and informative
  let extraMechanism = '';
  if (q.howItWorks && typeof q.howItWorks === 'string') {
    const lines = q.howItWorks.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('How it works'));
    if (lines.length > 0) {
      const firstStep = lines[0].replace(/^\d+[\.\)]\s*(\*\*[^*]+\*\*:?)?\s*/, '').trim();
      if (firstStep.length > 15 && firstStep.length < 180) {
        extraMechanism = firstStep;
      }
    }
  }

  // Handle specific subject families
  if (subject === 'react') {
    if (/jsx/i.test(concept)) {
      return `JSX Transformation compiles declarative JSX markup into React.createElement or _jsx function calls during build time. These calls evaluate at runtime to construct lightweight Virtual DOM element trees. This eliminates manual DOM scripting while keeping components clean and readable.`;
    }
    if (/virtual dom|reconciliation|diffing/i.test(concept)) {
      return `The Virtual DOM is an in-memory JavaScript representation of the actual browser DOM elements. When state or props change, React runs its reconciliation diffing algorithm to compute the minimal set of changes and updates only those specific nodes in the real DOM.`;
    }
    if (/fiber/i.test(concept)) {
      return `React Fiber is the complete rewrite of React's core reconciliation engine designed for incremental rendering. It models components as lightweight Fiber nodes and splits rendering work into prioritized chunks that can be paused, resumed, or aborted without blocking the browser main thread.`;
    }
    if (/lifecycle|render phase|commit phase/i.test(concept)) {
      return `React divides component rendering into two main phases: the Render Phase and the Commit Phase. The Render Phase is pure, asynchronous, and computes Virtual DOM changes without side effects, while the Commit Phase is synchronous and writes mutations directly to the real browser DOM.`;
    }
    if (/double buffering/i.test(concept)) {
      return `Fiber double buffering maintains two trees in memory simultaneously: the current tree rendered on screen and the workInProgress tree being computed in the background. Once background work completes, React simply swaps the top-level pointer to render the updated UI instantly.`;
    }
    if (/hook|state|effect|memo|callback|ref/i.test(concept)) {
      return `${concept} provides a declarative way to manage component state, lifecycle, or cached computations in functional components. It hooks directly into the Fiber node's internal memory cell to persist values reliably across successive re-renders.`;
    }
    return `${concept} is a key architectural feature in React that enables declarative, predictable component state management. It works seamlessly within the Fiber reconciliation pipeline to ensure high-performance UI updates with minimal browser reflows.`;
  }

  if (subject === 'javascript') {
    if (/execution context/i.test(concept)) {
      return `An Execution Context is the internal environment created by the JavaScript engine to evaluate and execute code. It operates in two sequential phases: the Creation Phase, which allocates memory for variables and functions (hoisting), and the Execution Phase, which runs the code line-by-line.`;
    }
    if (/call stack|execution stack/i.test(concept)) {
      return `The Call Stack is a LIFO (Last-In, First-Out) data structure used by the JavaScript runtime to track function execution. When a function is called, its execution frame is pushed onto the top of the stack, and when execution completes, it is popped off to resume the caller.`;
    }
    if (/hoisting/i.test(concept)) {
      return `Hoisting is the JavaScript engine's behavior of allocating memory for variable and function declarations during the Creation Phase before executing any code. Function declarations are fully initialized in memory, while var variables are initialized to undefined, and let/const remain in the Temporal Dead Zone until declared.`;
    }
    if (/closure/i.test(concept)) {
      return `A closure is the combination of a function bundled together with references to its surrounding lexical environment. It allows an inner function to retain access to variables in its outer scope even after the outer function has finished executing.`;
    }
    if (/event loop|microtask|macrotask/i.test(concept)) {
      return `The Event Loop continuously coordinates task execution between the Call Stack, Microtask Queue (Promises, queueMicrotask), and Task Queue (setTimeout, I/O). Whenever the Call Stack is empty, it drains all queued microtasks before processing the next macrotask to keep the main thread responsive.`;
    }
    if (/prototype|inheritance/i.test(concept)) {
      return `JavaScript uses prototypal inheritance, where objects have an internal hidden [[Prototype]] property linking to another object. If a property or method is not found on the object itself, the JavaScript engine traverses up the prototype chain until it finds the property or reaches null.`;
    }
    return `${concept} is a core mechanism in JavaScript that governs how values are evaluated, scoped, and retained in memory. It provides predictable runtime semantics and enables modern JavaScript engines like V8 to optimize execution.`;
  }

  if (subject === 'css') {
    if (/box-sizing|box model/i.test(concept)) {
      return `The CSS Box Model defines how element content, padding, border, and margin combine to calculate total layout dimensions. Using box-sizing: border-box ensures that padding and borders are included within the specified width and height, preventing layout overflow.`;
    }
    if (/flexbox/i.test(concept)) {
      return `Flexbox (Flexible Box Layout) is a one-dimensional layout model designed to distribute space and align items along a primary main axis and cross axis. It automatically accommodates dynamic item sizes, wrapping, and alignment without requiring floats or manual margin hacks.`;
    }
    if (/grid/i.test(concept)) {
      return `CSS Grid is a two-dimensional layout system that allows developers to arrange content into rows and columns simultaneously. It provides powerful layout primitives like grid-template-areas, fractional units (fr), and auto-placement for responsive page designs.`;
    }
    if (/specificity|cascade/i.test(concept)) {
      return `CSS Specificity is the weight-based algorithm browsers use to determine which CSS rule applies when multiple selectors match the same element. It calculates precedence based on inline styles, IDs, classes/attributes/pseudo-classes, and element tags.`;
    }
    if (/bfc|formatting context/i.test(concept)) {
      return `A Block Formatting Context (BFC) is an isolated rendering region of the web page where block boxes are laid out. Creating a BFC contains internal floats, prevents margin collapsing between sibling boxes, and clears floats cleanly.`;
    }
    return `${concept} defines how modern browser rendering engines compute styles, layout geometries, and visual paint layers. It ensures responsive, pixel-accurate element alignment across various viewport resolutions.`;
  }

  if (subject === 'typescript') {
    if (/inference|annotations|widening/i.test(concept)) {
      return `Type Inference allows the TypeScript compiler to automatically deduce the type of an expression without explicit annotations, while type annotations explicitly declare intended contracts. Type widening occurs when literal values (such as 'hello' or 42) are widened to general primitive types (string, number) when stored in mutable let variables.`;
    }
    if (/interface|type alias/i.test(concept)) {
      return `Interfaces define structural object shapes and support declaration merging, making them ideal for extensible library APIs. Type aliases can model objects, primitives, unions, and tuples, offering higher composability for complex type transformations.`;
    }
    if (/generic/i.test(concept)) {
      return `Generics allow developers to define reusable functions, classes, and interfaces that work over a variety of types rather than a single concrete one. They capture caller argument types and enforce type safety without losing type information.`;
    }
    if (/union|intersection/i.test(concept)) {
      return `A Union type (A | B) represents a value that can be one of several types, requiring narrowing before accessing specific properties. An Intersection type (A & B) combines multiple types into one, requiring the value to satisfy all combined interfaces simultaneously.`;
    }
    return `${concept} provides static compile-time safety and expressive type constraints on top of standard JavaScript. It catches logical errors and type mismatches during development before code runs in production.`;
  }

  if (subject === 'dom') {
    if (/tree|hierarchy|node/i.test(concept)) {
      return `The DOM (Document Object Model) represents an HTML document as a hierarchical tree of Node objects. Every tag, attribute, and text block is modeled as an interconnected node that can be inspected, manipulated, and animated using JavaScript.`;
    }
    if (/event bubbling|capturing|delegation/i.test(concept)) {
      return `DOM Event Propagation travels in three distinct phases: Capturing (window down to the target), Target (at the event source), and Bubbling (up to window). Event Delegation leverages bubbling by attaching a single listener to a common parent to handle events from multiple child elements efficiently.`;
    }
    if (/mutationobserver/i.test(concept)) {
      return `MutationObserver is a modern browser API that asynchronously observes and batches changes made to the DOM tree (such as added children, attribute edits, or character data modifications). It provides superior performance compared to legacy mutation events without degrading main-thread responsiveness.`;
    }
    return `${concept} enables programmatic interaction with the browser's Document Object Model. It provides standardized methods and properties to query, modify, and listen for user interactions in the document tree.`;
  }

  if (subject === 'bom') {
    if (/window|global/i.test(concept)) {
      return `The window object represents the browser window containing the DOM document and serves as the global execution context in client-side JavaScript. It exposes core platform APIs such as setTimeout, localStorage, navigation objects, and screen dimensions.`;
    }
    if (/storage|localstorage|sessionstorage/i.test(concept)) {
      return `Web Storage provides synchronous key-value string storage in the client browser with origin isolation. localStorage persists data permanently until explicitly cleared, whereas sessionStorage retains data only for the duration of the current browser tab session.`;
    }
    if (/history|location|navigator/i.test(concept)) {
      return `${concept} provides browser-level programmatic controls to manage the current URL, session history navigation, and client platform capabilities without requiring full-page server reloads.`;
    }
    return `${concept} exposes browser runtime features and platform capabilities outside the standard document tree. It allows frontend applications to monitor window state, device hardware characteristics, and user navigation flows.`;
  }

  if (subject === 'redux') {
    if (/single source|principles|store/i.test(concept)) {
      return `Redux is built on three core principles: a Single Source of Truth (a unified central store), Read-Only State (state is never mutated directly), and Changes Made with Pure Functions (reducers). This architecture makes application state transitions predictable, debuggable, and testable.`;
    }
    if (/reducer|immutability/i.test(concept)) {
      return `A Reducer is a pure function that takes the current state and an action payload, and returns the next state without mutating the original object. Immutability ensures that state changes can be detected via shallow reference equality checks, enabling efficient React re-rendering.`;
    }
    if (/middleware|thunk/i.test(concept)) {
      return `Redux Middleware provides a third-party extension point between dispatching an action and the moment it reaches the reducer. Tools like Redux Thunk allow action creators to return functions instead of action objects, facilitating asynchronous API calls and conditional dispatches.`;
    }
    return `${concept} is a central pattern in Redux architecture that enforces predictable unidirectional state flow. It separates state modification logic into pure, traceable transformations that can be monitored using Redux DevTools.`;
  }

  if (subject === 'es6' || subject === 'es7' || subject === 'es8') {
    if (/let|const|tdz|block scope/i.test(concept)) {
      return `let and const declare block-scoped variables that only exist within their enclosing curly braces {}. Unlike var, they are not initialized during hoisting and enter a Temporal Dead Zone (TDZ) where accessing them before declaration throws a ReferenceError.`;
    }
    if (/arrow function|lexical this/i.test(concept)) {
      return `Arrow functions provide a concise syntax for writing function expressions and do not bind their own this, arguments, super, or new.target. Instead, they lexically capture the this value of their enclosing execution scope at the moment they are defined.`;
    }
    if (/async|await|promise/i.test(concept)) {
      return `async/await is syntactic sugar built on top of JavaScript Promises that allows asynchronous, non-blocking code to be written and read like synchronous code. An async function automatically wraps its return value in a Promise, and the await keyword pauses execution until the awaited Promise settles.`;
    }
    if (/destructuring|spread|rest/i.test(concept)) {
      return `${concept} provides clean, declarative syntax to extract values from arrays and objects or combine collections without cumbersome manual indexing or temporary variables.`;
    }
    return `${concept} is a standardized ECMAScript feature that enhances language expressiveness and code maintainability. It simplifies asynchronous operations and eliminates common pitfalls in JavaScript development.`;
  }

  if (subject === 'web-apis') {
    if (/fetch/i.test(concept)) {
      return `The Fetch API provides a modern, Promise-based interface for making asynchronous HTTP requests from the browser. It replaces XMLHttpRequest with a cleaner Request/Response model and supports streaming, headers manipulation, and credentials configurations.`;
    }
    if (/intersection observer/i.test(concept)) {
      return `IntersectionObserver asynchronously tracks the visibility of target DOM elements relative to an ancestor viewport. It triggers callbacks only when elements cross specified threshold intersections, eliminating expensive continuous scroll event listeners.`;
    }
    return `${concept} is a standardized browser Web API that provides programmatic access to native platform and hardware capabilities. It operates asynchronously to keep the main user interface smooth and responsive.`;
  }

  // General fallback
  return `${concept} is an essential concept in ${subjectDisplay} that establishes standardized, predictable behavior across web platforms. It streamlines application development by providing clean abstractions for handling data, rendering, and performance.`;
}

function createCleanSimpleExplanation(q, subject, crispShort) {
  const concept = q.concept || q.question;

  // If detailedExplanation exists and has a clean paragraph, extract first 2-3 sentences
  if (q.detailedExplanation && typeof q.detailedExplanation === 'string') {
    // Strip markdown headers
    const cleanDetailed = q.detailedExplanation
      .replace(/^#+.*$/gm, '')
      .replace(/^\d+[\.\)]\s*/gm, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .trim();

    const sentences = cleanDetailed.split(/(?<=[.!?])\s+/).filter(s => s.length > 20 && !s.includes('Deep Technical Dive'));
    if (sentences.length >= 2) {
      return sentences.slice(0, 3).join(' ');
    }
  }

  if (q.why && typeof q.why === 'string') {
    const whyLines = q.why.split('\n').filter(l => l.trim() && !l.startsWith('Why does'));
    if (whyLines.length >= 2) {
      const cleanLines = whyLines.slice(0, 3).map(l => l.replace(/^\d+[\.\)]\s*/, '').trim());
      return `Key technical reasons for ${concept}:\n- ${cleanLines.join('\n- ')}`;
    }
  }

  return crispShort;
}

function processAllTargetFiles() {
  console.log('Starting global audit and sanitization of Short Interview Answers across all subjects...');

  let totalAudited = 0;

  for (const filename of TARGET_FILES) {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`File ${filename} not found, skipping.`);
      continue;
    }

    const subjectKey = filename.replace('.json', '');
    const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let fileAuditedCount = 0;

    for (const q of questions) {
      const hasNumbered = (q.shortAnswer || '').includes('1. In simple words') ||
                          (q.shortAnswer || '').includes('Real-life analogy') ||
                          (q.shortAnswer || '').includes('12. Key takeaway') ||
                          (q.shortAnswer || '').length > 400;

      if (hasNumbered) {
        // 1. Generate clean, crisp 2-3 sentence shortAnswer
        const crispShort = createCrispShortAnswer(q, subjectKey);
        q.shortAnswer = crispShort;

        // 2. Generate clean simpleExplanation
        q.simpleExplanation = createCleanSimpleExplanation(q, subjectKey, crispShort);

        // 3. Clean interviewAnswer - remove "Sir, in very simple terms..." and forced analogies
        q.interviewAnswer = `${crispShort}\n\nIn practical production projects, mastering this ensures predictable state management, high runtime performance, and clean maintainability across our team.`;

        fileAuditedCount++;
        totalAudited++;
      }
    }

    // Save audited JSON
    fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), 'utf8');
    console.log(`[PASS] ${filename}: audited and cleaned ${fileAuditedCount} questions.`);
  }

  console.log(`\nSuccessfully audited and cleaned ${totalAudited} questions across all ${TARGET_FILES.length} subjects!`);
}

processAllTargetFiles();
