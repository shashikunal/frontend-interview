import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../public/data/interview-questions');

// Curated video resources for high-impact topics
const VIDEO_REGISTRY = [
  {
    keywords: ['box-sizing', 'box model', 'content-box', 'border-box'],
    url: 'https://www.youtube-nocookie.com/embed/WlGQdgy-6T4',
    title: 'CSS Box Sizing Explained Simply (Kevin Powell)'
  },
  {
    keywords: ['flexbox', 'flex-direction', 'justify-content', 'align-items'],
    url: 'https://www.youtube-nocookie.com/embed/u044iM9xsWU',
    title: 'Learn Flexbox in 20 Minutes (Kevin Powell)'
  },
  {
    keywords: ['grid', 'grid-template', 'css grid'],
    url: 'https://www.youtube-nocookie.com/embed/rg7Fvvl3taU',
    title: 'Learn CSS Grid the Easy Way (Kevin Powell)'
  },
  {
    keywords: ['promise', 'promises/a+', 'pending', 'fulfilled'],
    url: 'https://www.youtube-nocookie.com/embed/DHvZLI7Db8E',
    title: 'JavaScript Promises in 10 Minutes (Web Dev Simplified)'
  },
  {
    keywords: ['event loop', 'call stack', 'microtask', 'macrotask'],
    url: 'https://www.youtube-nocookie.com/embed/8aGhZQkoFbQ',
    title: 'What the heck is the event loop anyway? (Philip Roberts)'
  },
  {
    keywords: ['closure', 'lexical scope'],
    url: 'https://www.youtube-nocookie.com/embed/qikxEIxsXco',
    title: 'Namaste JavaScript - Closures in JS (Akshay Saini)'
  },
  {
    keywords: ['hoisting', 'temporal dead zone', 'tdz'],
    url: 'https://www.youtube-nocookie.com/embed/Fnlnw8uY6jo',
    title: 'Namaste JavaScript - Hoisting & TDZ (Akshay Saini)'
  },
  {
    keywords: ['usestate', 'state in react'],
    url: 'https://www.youtube-nocookie.com/embed/O6P86uwfdR0',
    title: 'Learn useState in 15 Minutes (Web Dev Simplified)'
  },
  {
    keywords: ['useeffect', 'react lifecycle'],
    url: 'https://www.youtube-nocookie.com/embed/0ZJgIjIuY7U',
    title: 'Learn useEffect in 13 Minutes (Web Dev Simplified)'
  },
  {
    keywords: ['redux', 'reducer', 'store', 'dispatch'],
    url: 'https://www.youtube-nocookie.com/embed/9boMnm5X9ak',
    title: 'Redux Toolkit Tutorial for Beginners (Codevolution)'
  },
  {
    keywords: ['semantic', 'header', 'nav', 'main', 'footer'],
    url: 'https://www.youtube-nocookie.com/embed/kGW8Al_cga4',
    title: 'HTML5 Semantic Elements Tutorial (Traversy Media)'
  },
  {
    keywords: ['typescript', 'type', 'interface', 'generics'],
    url: 'https://www.youtube-nocookie.com/embed/BwuLxPH8IDs',
    title: 'TypeScript Course for Beginners (freeCodeCamp)'
  },
  {
    keywords: ['async', 'await'],
    url: 'https://www.youtube-nocookie.com/embed/V_Kr9OSfDeU',
    title: 'JavaScript Async Await Tutorial (Web Dev Simplified)'
  },
  {
    keywords: ['event delegation', 'bubbling', 'capturing'],
    url: 'https://www.youtube-nocookie.com/embed/aVS4W7GZsq0',
    title: 'Event Bubbling, Capturing & Delegation in JS (Akshay Saini)'
  }
];

function findVideo(text) {
  const lower = text.toLowerCase();
  for (const v of VIDEO_REGISTRY) {
    if (v.keywords.some(k => lower.includes(k))) {
      return { url: v.url, title: v.title };
    }
  }
  return null;
}

// Authentic diagrams only where they genuinely make sense!
function getAuthenticDiagram(subject, text) {
  const lower = text.toLowerCase();

  // CSS Box Model
  if (lower.includes('box-sizing') || lower.includes('box model') || lower.includes('border-box') || lower.includes('content-box')) {
    return {
      diagram: `flowchart TD
    subgraph ContentBox["❌ content-box (Default: Layout Breaks!)"]
        direction TB
        CB1["Content Width: 300px"]
        CB2["+ Left & Right Padding: 40px (20px each)"]
        CB3["+ Left & Right Border: 10px (5px each)"]
        CB_Total["Total Width on Screen = 350px (Too Wide!)"]
        CB1 --> CB2 --> CB3 --> CB_Total
    end

    subgraph BorderBox["✅ border-box (Universal Reset: Rock Solid!)"]
        direction TB
        BB1["Declared Width: Strictly 300px"]
        BB2["Padding (20px) sits INSIDE the box"]
        BB3["Border (5px) sits INSIDE the box"]
        BB_Total["Total Rendered Width = Exactly 300px!"]
        BB1 --> BB2 --> BB3 --> BB_Total
    end`,
      caption: "Visual Comparison: content-box vs border-box Layout Calculation"
    };
  }

  // CSS Flexbox
  if (lower.includes('flexbox') || lower.includes('flex-direction') || lower.includes('align-items')) {
    return {
      diagram: `flowchart LR
    subgraph FlexContainer["Flex Container (display: flex)"]
        direction LR
        MainAxis["➡️ Main Axis (justify-content: flex-start / center / space-between)"]
        subgraph Items["Flex Items"]
            I1["Item 1"]
            I2["Item 2"]
            I3["Item 3"]
        end
        CrossAxis["⬇️ Cross Axis (align-items: stretch / center / flex-start)"]
    end`,
      caption: "CSS Flexbox Axis Orientation: Main Axis vs Cross Axis"
    };
  }

  // CSS Grid
  if (lower.includes('grid') || lower.includes('grid-template')) {
    return {
      diagram: `flowchart TD
    subgraph CSSGrid["2D CSS Grid Layout (Columns x Rows)"]
        R1C1["Header (Row 1 / Col 1 to 3)"]
        R2C1["Sidebar (Col 1)"]
        R2C2["Main Content (Col 2 & 3)"]
        R3C1["Footer (Row 3 / Col 1 to 3)"]
    end`,
      caption: "CSS Grid 2D Blueprint: Multi-Column & Multi-Row Architecture"
    };
  }

  // HTML5 Semantic Layout
  if (subject === 'html' && (lower.includes('semantic') || lower.includes('header') || lower.includes('nav') || lower.includes('article'))) {
    return {
      diagram: `flowchart TD
    subgraph HTML5Page["Semantic Page Layout"]
        H["&lt;header&gt; Logo, Brand &amp; Primary Banner"]
        N["&lt;nav&gt; Accessible Navigation Links"]
        subgraph MainSection["&lt;main&gt; Unique Central Page Content"]
            A["&lt;article&gt; Self-Contained Blog Post / News Card"]
            S["&lt;section&gt; Thematic Chapter or Category"]
            AS["&lt;aside&gt; Sidebar, Related Links &amp; Ads"]
        end
        F["&lt;footer&gt; Copyright, Contact &amp; Terms"]
    end
    H --> N --> MainSection --> F`,
      caption: "HTML5 Semantic Web Layout: Accessible Landmarks"
    };
  }

  // JavaScript Event Loop
  if (lower.includes('event loop') || lower.includes('call stack') || lower.includes('microtask') || lower.includes('macrotask')) {
    return {
      diagram: `flowchart TD
    Stack["1. Call Stack (Synchronous Code Runs Here First)"]
    Stack -->|Stack Becomes Empty| Micro["2. Microtask Queue (VIP: Promises & queueMicrotask)"]
    Micro -->|All Microtasks Drained| Macro["3. Macrotask Queue (setTimeout, setInterval, I/O)"]
    Macro -->|Next Iteration| Stack`,
      caption: "JavaScript Event Loop Priority Pipeline: Stack -> Microtasks -> Macrotasks"
    };
  }

  // JavaScript Closure
  if (lower.includes('closure') || lower.includes('lexical scope')) {
    return {
      diagram: `flowchart TD
    subgraph Outer["Outer Function Scope: counter()"]
        VarCount["let count = 0 (Preserved in Heap Memory)"]
        subgraph Inner["Inner Function: increment()"]
            Access["Reads and Updates count via [[Scopes]] Reference"]
        end
    end
    Outer -->|Returns Inner Function| Backpack["🎒 Closure Backpack: Keeps count alive even after outer() returns!"]`,
      caption: "JavaScript Closure Mechanism: Retaining Outer Scope in Memory"
    };
  }

  // JavaScript Prototypal Inheritance
  if (lower.includes('prototype') || lower.includes('inheritance')) {
    return {
      diagram: `flowchart TD
    Child["userObj (Instance)"] -->|__proto__| Proto["User.prototype (Shared Methods e.g. login)"]
    Proto -->|__proto__| ObjProto["Object.prototype (toString, hasOwnProperty)"]
    ObjProto -->|__proto__| NullEnd["null (End of Prototype Chain)"]`,
      caption: "JavaScript Prototype Lookup Chain"
    };
  }

  // React Virtual DOM Diffing
  if (lower.includes('virtual dom') || lower.includes('reconciliation') || lower.includes('fiber')) {
    return {
      diagram: `flowchart TD
    StateChange["State Update in Component"] --> NewVDOM["Generate New Virtual DOM Tree"]
    NewVDOM --> Diff["Diffing Algorithm (Compare with Previous Virtual DOM)"]
    Diff --> Calc["Calculate Minimal DOM Patches"]
    Calc --> RealDOM["Apply Batched Updates to Real Browser DOM (Fast!)"]`,
      caption: "React Virtual DOM Reconciliation & Diffing Pipeline"
    };
  }

  // React State vs Props
  if (lower.includes('state') || lower.includes('props') || lower.includes('usestate')) {
    return {
      diagram: `flowchart TD
    Parent["Parent Component"] -->|Passes Props (Read-Only 🔒)| Child["Child Component"]
    Child -->|Manages Local State (useState ⚡)| Internal["Local UI Re-render upon setState()"]`,
      caption: "React Unidirectional Data Flow: Props Down, Local State Inside"
    };
  }

  // Redux Unidirectional Data Flow
  if (subject === 'redux' || lower.includes('redux') || lower.includes('store') || lower.includes('reducer')) {
    return {
      diagram: `flowchart TD
    UI["🖥️ React UI Component"] -->|User Clicks: dispatch(action)| Dispatcher["Action Object: { type: 'ADD_ITEM', payload }"]
    Dispatcher --> Reducer["⚙️ Pure Reducer (Calculates (state, action) => newState)"]
    Reducer --> Store["🏦 Redux Central Store (Immutable State Updated)"]
    Store -->|useSelector notifies subscriber| UI`,
      caption: "Redux Unidirectional Data Flow Cycle"
    };
  }

  // If no authentic diagram applies, DO NOT SHOW A FAKE DIAGRAM!
  return null;
}

// Student-friendly subject explanations
function generateSimplifiedContent(subject, q) {
  const title = q.subtopic || q.concept || q.question;

  // 1. CSS Box Sizing
  if (subject === 'css' && (title.toLowerCase().includes('box-sizing') || title.toLowerCase().includes('box model'))) {
    return {
      shortAnswer: [
        '1. In simple words, the CSS box-sizing reset (* { box-sizing: border-box; }) makes all boxes behave predictably on your screen.',
        '2. Real-life analogy: Imagine buying an airplane cabin suitcase of size 24 inches. If packing clothes inside made the outside metal expand to 28 inches, it would not fit into the airplane overhead bin! With border-box, the suitcase stays strictly 24 inches.',
        '3. By default in CSS (content-box), when you set width: 300px and add 20px padding + 5px border, the total width expands to 350px (300 + 40 + 10). This breaks layouts and causes cards to overflow.',
        '4. When you set box-sizing: border-box, padding and borders are kept comfortably INSIDE the 300px width.',
        '5. The universal selector (*, *::before, *::after) applies this rule to every single element and pseudo-element across your entire website.',
        '6. It prevents unexpected horizontal scrollbars on mobile phones and desktop screens.',
        '7. It makes building responsive multi-column layouts (like 50% / 50% grids) simple and math-free because padding will never push elements onto a new line.',
        '8. Every major CSS library and modern company (Bootstrap, Tailwind CSS, Google, Amazon) uses this exact reset on line 1 of their stylesheets.',
        '9. Margin is the only value that remains outside the box, providing space between neighboring elements.',
        '10. In interviews, explain this by drawing the box: Content in the center, surrounded by Padding, Border, and outer Margin.',
        '11. Remember: It has 100% browser support across all mobile and desktop browsers.',
        '12. Key takeaway: Always include *, *::before, *::after { box-sizing: border-box; } at the very top of every project to avoid hours of layout debugging.'
      ].join('\n'),
      interviewAnswer: `Sir, in very simple terms, the universal box-sizing reset is one of the most important rules we write in CSS.

By default, browsers use 'content-box'. That means if you give a card a width of 300px, and then add 20px padding and 5px border, the browser adds those numbers together. The actual rendered width becomes 350px! This often breaks grid columns and pushes buttons off the screen.

A simple real-world analogy is packing an Amazon courier shipping box:
With border-box, the outer box size stays fixed at 300px, and all the bubble wrap and cushioning stay safely inside.

So by writing:
*, *::before, *::after { box-sizing: border-box; }
we ensure that whenever we say width: 300px, the total width stays strictly 300px. Every modern frontend project and design system relies on this rule.`,
      example: `/* Universal Box-Sizing Reset */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Demonstration: The 300px Card Stays Strictly 300px! */
.product-card {
  width: 300px;
  padding: 24px;         /* Sits safely INSIDE the 300px */
  border: 4px solid #6366f1; /* Sits safely INSIDE the 300px */
  background-color: #0f172a;
  color: #ffffff;
  border-radius: 12px;
}`
    };
  }

  // 2. Generic Student-Friendly Builder for other CSS questions
  if (subject === 'css') {
    return {
      shortAnswer: [
        `1. In simple words, "${title}" controls how elements are styled, aligned, and positioned on the web page.`,
        `2. Real-life analogy: Think of CSS like painting and furnishing a new house: HTML builds the concrete walls, and CSS chooses the paint colors, furniture spacing, and lighting.`,
        `3. This property gives you direct control over responsive layout behavior across mobile, tablet, and desktop screens.`,
        `4. It eliminates messy hacky CSS workarounds from older web development days.`,
        `5. Using clean modern CSS rules ensures your website renders smoothly at 60 frames per second without stuttering.`,
        `6. It respects the CSS Cascade and specificity rules, making your stylesheets predictable and easy to maintain.`,
        `7. Proper spacing and alignment make the user interface intuitive and comfortable for users to read and navigate.`,
        `8. Modern CSS features work natively in all modern browsers without requiring heavy JavaScript libraries.`,
        `9. Avoid using inline styles or !important flags; instead, structure your CSS classes with clean naming conventions.`,
        `10. In interviews, interviewers love when you explain how this property affects the browser layout, reflow, and repaint cycles.`,
        `11. Always test your CSS across different viewport sizes and dark/light mode themes.`,
        `12. Key takeaway: Master this styling rule to create clean, responsive, and beautiful user interfaces effortlessly.`
      ].join('\n'),
      interviewAnswer: `Sir, in very simple terms, ${title} is a core CSS technique used to control styling and layout responsiveness.

When building web applications, our goal is to make interfaces look beautiful on both small mobile screens and large desktop monitors.

By using ${title} properly:
First, we achieve pixel-perfect alignment without relying on brittle pixel hacks.
Second, the browser engine renders the layout efficiently without unnecessary reflows or repaints.
Third, our stylesheets remain modular, clean, and easy for the team to scale.

In interviews, I always explain the cascade behavior, browser compatibility, and how it fits into modern responsive design.`,
      example: `/* Practical CSS Example: ${title} */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  background: #1e293b;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}`
    };
  }

  // 3. HTML Questions
  if (subject === 'html') {
    return {
      shortAnswer: [
        `1. In simple words, "${title}" defines the semantic structure and meaning of content on a web page.`,
        `2. Real-life analogy: Imagine a newspaper front page: it has a clear main headline, section headers, paragraphs, and a footer. Without semantic tags, a website is like a book printed without any chapters or paragraphs—just a wall of text.`,
        `3. Using semantic HTML tags (like <header>, <nav>, <main>, <article>, and <footer>) tells both the browser and search engines exactly what each part of your page represents.`,
        `4. It dramatically improves Accessibility (a11y) so screen readers used by visually impaired users can navigate your website smoothly.`,
        `5. It provides huge SEO (Search Engine Optimization) benefits because Google crawlers understand your primary content easily.`,
        `6. It makes your code cleaner and much easier for teammates to read compared to confusing "div soup" (<div> inside <div> inside <div>).`,
        `7. Built-in HTML elements give you free keyboard navigation (like Tab and Enter key support) without writing complex JavaScript.`,
        `8. It ensures proper mobile browser behavior, like opening the numeric keypad for number inputs or email keyboard for email fields.`,
        `9. Never use a <div> where a semantic tag like <button>, <a>, or <article> already exists.`,
        `10. In interviews, candidates who emphasize accessibility and semantic meaning stand out immediately from freshers who only use <div>.`,
        `11. Always validate your HTML markup using standard W3C validation tools.`,
        `12. Key takeaway: Clean HTML is the solid foundation of every successful web application.`
      ].join('\n'),
      interviewAnswer: `Sir, in very simple terms, ${title} is all about writing meaningful and accessible HTML markup.

Rather than wrapping everything inside generic <div> tags, semantic HTML provides dedicated tags that explain their purpose to both humans and machines.

A simple real-world analogy is labeling spice jars in a kitchen:
When jars are clearly labeled as Salt, Sugar, and Turmeric, anyone can cook easily without guessing. Similarly, tags like <header>, <main>, and <nav> allow screen readers and search engine bots to instantly navigate the website.

By using ${title}:
First, our website achieves high accessibility scores (WCAG compliance).
Second, our SEO ranking improves naturally because search engines understand our key content.
Third, our code is clean, lightweight, and easy to maintain.`,
      example: `<!-- Practical Semantic HTML5 Layout -->
<header class="site-header">
  <nav aria-label="Main Navigation">
    <a href="#home">Home</a>
    <a href="#courses">Courses</a>
    <a href="#contact">Contact</a>
  </nav>
</header>

<main id="main-content">
  <article class="featured-post">
    <h1>${title}</h1>
    <p>Semantic HTML improves accessibility and search engine ranking.</p>
  </article>
</main>

<footer class="site-footer">
  <p>&copy; 2026 Student Prep Portal. All rights reserved.</p>
</footer>`
    };
  }

  // 4. JavaScript Core Questions
  if (subject === 'javascript') {
    return {
      shortAnswer: [
        `1. In simple words, "${title}" is a foundational concept in JavaScript that dictates how code runs and stores data in memory.`,
        `2. Real-life analogy: Imagine a doctor’s clinic with an appointment token system. Patients enter one by one into the doctor’s room (the Call Stack). If an emergency arises (Microtask), the doctor handles it before calling the next regular patient (Macrotask).`,
        `3. JavaScript executes code inside an Execution Context consisting of a Memory component (Variable Environment) and a Code component (Thread of Execution).`,
        `4. It operates as a single-threaded language, meaning it can only execute one command at a time in sequence.`,
        `5. Understanding this concept prevents common interview bugs like unexpected undefined values, closure memory leaks, or scope shadowing.`,
        `6. It explains why synchronous code always finishes before asynchronous callbacks (like setTimeout or fetch) can run.`,
        `7. It forms the backbone of modern frameworks like React, Node.js, and Vue.`,
        `8. Mastering this allows you to write high-performance code that avoids blocking the main thread.`,
        `9. Common mistake: Assuming JavaScript does multiple things at the exact same time; in reality, the Event Loop coordinates tasks seamlessly.`,
        `10. In interviews, explain this step-by-step: Creation Phase (memory allocation) followed by Execution Phase (running code line by line).`,
        `11. Always keep functions small and pure to avoid unwanted side effects.`,
        `12. Key takeaway: Master JavaScript runtime fundamentals, and cracking frontend coding rounds becomes easy.`
      ].join('\n'),
      interviewAnswer: `Sir, in very simple terms, ${title} is a core JavaScript engine concept that governs how our code is parsed, stored, and executed.

Because JavaScript is single-threaded, it uses an Execution Context with two clear phases:
1. The Creation Phase: where memory is allocated for variables and functions.
2. The Execution Phase: where code runs line-by-line and values are assigned.

A helpful analogy is a busy restaurant kitchen with one head chef:
The chef prepares their ingredients first (memory creation phase), and then cooks the orders one by one on the single stove (call stack).

Understanding ${title} helps us avoid tricky bugs with scope, hoisting, and async timing, ensuring our web apps remain fast and responsive.`,
      example: `// Practical JavaScript Example: ${title}
function demonstrateCoreConcept() {
  console.log("Step 1: Function Execution Context created.");

  let activeUser = "Kunal";
  const userRole = "Frontend Architect";

  function displayDetails() {
    // Accesses outer lexical scope
    console.log(\`Step 2: Authenticated \${activeUser} as \${userRole}.\`);
  }

  displayDetails();
  console.log("Step 3: Execution Context completed and popped from Call Stack.");
}

demonstrateCoreConcept();`
    };
  }

  // 5. React Questions
  if (subject === 'react') {
    return {
      shortAnswer: [
        `1. In simple words, "${title}" in React helps you build dynamic, reactive user interfaces with minimal effort.`,
        `2. Real-life analogy: Think of an electronic scoreboard at a sports match: whenever the score changes, you do not rebuild the entire stadium! You only change the digital number on the screen. That is exactly how React updates the UI.`,
        `3. React uses a Virtual DOM (a lightweight JavaScript representation of the real DOM) to calculate the fastest way to update the screen.`,
        `4. When state or props change, React runs its Diffing Algorithm to find the exact elements that changed and updates only those in the real browser DOM.`,
        `5. This component-based architecture lets you break complex pages into small, reusable, and testable building blocks.`,
        `6. Unidirectional data flow (Props down, Events up) ensures data moves in a predictable single direction, making debugging straightforward.`,
        `7. Hooks (like useState, useEffect, useMemo) let you use state and lifecycle features inside clean functional components.`,
        `8. It avoids slow direct DOM manipulations, keeping your web app smooth and responsive even under heavy user interactions.`,
        `9. Common mistake: Mutating state directly (like state.count = 5) instead of using the setter function (setCount(5)), which prevents re-renders.`,
        `10. In interviews, always emphasize the difference between the Render Phase (pure calculation) and Commit Phase (writing to DOM).`,
        `11. Keep component state local where possible and lift state up only when siblings need to share data.`,
        `12. Key takeaway: React makes building interactive web applications fun, fast, and maintainable.`
      ].join('\n'),
      interviewAnswer: `Sir, in very simple terms, ${title} is a fundamental pattern in React that allows us to build declarative, state-driven user interfaces.

Instead of writing tedious document.getElementById and innerHTML code, we describe what the UI should look like for a given state, and React handles the updates automatically.

A simple real-world analogy is a car dashboard:
When you step on the accelerator, the speedometer needle moves automatically to show your speed. You don't have to manually repaint the dashboard dials!

By leveraging ${title}:
First, our application UI stays 100% in sync with our state data.
Second, React batches DOM updates for maximum rendering performance.
Third, our code is modular, reusable, and easy to test.`,
      example: `// Practical React Component Example: ${title}
import React, { useState } from 'react';

export function InteractiveCounter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '1.5rem', background: '#0f172a', borderRadius: '12px', color: '#fff' }}>
      <h3>Current Count: {count}</h3>
      <button 
        onClick={() => setCount(prev => prev + 1)}
        style={{ padding: '0.5rem 1rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
      >
        Increment (+1)
      </button>
    </div>
  );
}`
    };
  }

  // 6. Redux Questions
  if (subject === 'redux') {
    return {
      shortAnswer: [
        `1. In simple words, "${title}" in Redux provides a central, predictable state container for JavaScript applications.`,
        `2. Real-life analogy: Imagine a bank vault and a bank teller. Customers cannot walk into the vault to change their bank balance. You must fill out a deposit slip (Action), hand it to the cashier (Dispatch), and the cashier updates the central register (Reducer).`,
        `3. Principle 1: Single Source of Truth — the entire state of your application is stored in one single central Store.`,
        `4. Principle 2: State is Read-Only — you can never change state directly; you can only express an intent by dispatching an Action object.`,
        `5. Principle 3: Changes are Made with Pure Functions — Reducers take the previous state and an action, and return a brand new state object without mutating the old one.`,
        `6. It solves the nightmare of "Prop Drilling" where data had to be passed through 10 intermediate components that did not need it.`,
        `7. Any component in your app can easily read state using useSelector() and trigger changes using useDispatch().`,
        `8. Redux DevTools provides "Time-Travel Debugging" allowing you to inspect every single state change and rewind history step-by-step.`,
        `9. Modern applications use Redux Toolkit (RTK) with createSlice, which eliminates 90% of old Redux boilerplate.`,
        `10. In interviews, explain the unidirectional flow: Component -> Dispatch Action -> Reducer -> Store -> Updated Component.`,
        `11. Only put shared, global state in Redux; keep form inputs and temporary UI toggles in local component state.`,
        `12. Key takeaway: Redux brings absolute order and predictability to large-scale frontend applications.`
      ].join('\n'),
      interviewAnswer: `Sir, in very simple terms, Redux is a predictable state management library designed to manage shared state across complex web applications.

A classic real-world analogy is a bank branch:
Customers cannot walk inside the vault and change their bank balance directly. You have to fill out a deposit slip (an Action), give it to the bank teller (Dispatch), and the official teller updates the master ledger (the Reducer).

The three core principles of Redux are:
1. Single Source of Truth: All app state lives in one central Store.
2. State is Read-Only: Changes only happen by dispatching an Action.
3. Pure Reducer Functions: Reducers calculate the next state immutably without side effects.

This completely eliminates prop drilling and makes tracking state changes effortless with Redux DevTools.`,
      example: `// Practical Redux Toolkit (RTK) Slice Example
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], totalAmount: 0 },
  reducers: {
    addItem: (state, action) => {
      // RTK uses Immer under the hood for safe immutability
      state.items.push(action.payload);
      state.totalAmount += action.payload.price;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    }
  }
});

export const { addItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;`
    };
  }

  // 7. TypeScript Questions
  if (subject === 'typescript') {
    return {
      shortAnswer: [
        `1. In simple words, "${title}" in TypeScript adds static type safety to JavaScript, catching errors before your code runs in the browser.`,
        `2. Real-life analogy: Think of airport baggage security: before your suitcase is loaded onto the airplane, the security scanner inspects it. If there is a prohibited item, it stops you at the airport gate (Compile Time) rather than having an emergency mid-flight (Runtime crash)!`,
        `3. TypeScript is a superset of JavaScript, meaning all valid JavaScript code is automatically valid TypeScript code.`,
        `4. It catches common bugs (like typo in variable names, passing wrong arguments, or accessing undefined properties) directly in your code editor as you type.`,
        `5. Interfaces and Type Aliases allow you to define clear contracts for your data models and API responses.`,
        `6. It provides world-class autocomplete (IntelliSense) in VS Code, making developers 2x to 3x faster and more confident.`,
        `7. Generics (<T>) allow you to write flexible, reusable functions and components that work with multiple data types while preserving type safety.`,
        `8. At build time, the TypeScript compiler strips away all type annotations and emits clean, standard JavaScript that runs in any browser.`,
        `9. Avoid using "any" type as a shortcut; using "any" turns off type checking and defeats the entire purpose of TypeScript.`,
        `10. In interviews, explain how TypeScript improves team productivity, eliminates runtime errors, and acts as living self-updating documentation.`,
        `11. Use "unknown" instead of "any" when handling untrusted data, and narrow types with type guards.`,
        `12. Key takeaway: TypeScript is the industry standard for production frontend engineering today.`
      ].join('\n'),
      interviewAnswer: `Sir, in very simple terms, TypeScript is JavaScript with superpowers—specifically, static typing and compile-time error checking.

In plain JavaScript, if you make a spelling mistake in a property name or pass a string instead of a number, you only find out when your website crashes in the user's browser.

A great real-world analogy is building a puzzle with color-coded pieces:
TypeScript ensures that only matching puzzle pieces fit together. If you try to fit a square peg into a round hole, your editor warns you with a red squiggly line immediately!

With ${title}:
First, we catch 80% of common bugs while writing code in our editor before deploying.
Second, we get instant autocomplete and self-documenting code.
Third, refactoring large codebases becomes safe and fearless.`,
      example: `// Practical TypeScript Example: ${title}
interface UserAccount {
  readonly id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'MENTOR' | 'ADMIN';
}

function sendWelcomeNotification(user: UserAccount): string {
  console.log(\`Sending welcome email to \${user.email}...\`);
  return \`Welcome, \${user.name}! Your account role is \${user.role}.\`;
}

const candidate: UserAccount = {
  id: "USR-401",
  name: "Sneha",
  email: "sneha@prep.in",
  role: "STUDENT"
};

console.log(sendWelcomeNotification(candidate));`
    };
  }

  // 8. Fallback for ES6, ES7, ES8, DOM, BOM, Web APIs
  return {
    shortAnswer: [
      `1. In simple words, "${title}" is a key feature designed to make frontend web applications faster, cleaner, and easier to build.`,
      `2. Real-life analogy: Imagine a smartphone operating system update: older phones required manual cables and tricky steps, but new updates give you smooth one-tap gestures that save time and eliminate headaches.`,
      `3. It provides modern standard syntax that replaces older verbose workarounds.`,
      `4. It executes efficiently inside browser engines with predictable memory usage.`,
      `5. Using this feature improves code readability so any teammate or junior developer can understand your logic quickly.`,
      `6. It handles edge cases safely, preventing unexpected application crashes.`,
      `7. It integrates seamlessly with modern build tools and JavaScript frameworks.`,
      `8. It helps keep your codebase lightweight without needing external third-party utility libraries.`,
      `9. In interviews, clearly state why this feature was introduced and what specific problem it solved over older approaches.`,
      `10. Always write defensive code and verify that data exists before accessing nested properties.`,
      `11. Highlight performance and browser compatibility when discussing this topic in technical rounds.`,
      `12. Key takeaway: Strong command of this feature proves you understand modern frontend engineering thoroughly.`
    ].join('\n'),
    interviewAnswer: `Sir, in very simple terms, ${title} is a core frontend feature that modernizes how we write web applications.

Before this feature, developers had to write lengthy, repetitive code and often encountered subtle runtime bugs.

A simple real-world analogy is using a smart UPI QR code instead of counting paper cash and coins:
It is direct, instantaneous, and eliminates human calculation errors.

In production code:
First, it makes our code concise, clean, and self-documenting.
Second, modern JavaScript engines optimize this construct for fast runtime execution.
Third, it allows our team to build scalable, production-grade applications with confidence.`,
    example: `// Practical Demonstration: ${title}
function executeFeature() {
  console.log("Step 1: Initializing demonstration for ${title}...");

  const data = {
    title: "${title}",
    status: "ACTIVE",
    timestamp: new Date().toLocaleTimeString()
  };

  console.log("Step 2: Processing data:", data);
  return { success: true, payload: data };
}

const outcome = executeFeature();
console.log("Step 3: Execution completed successfully:", outcome);`
  };
}

async function runUpgradedGenerator() {
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json') && f !== 'catalog.json');
  console.log(`Upgrading ${files.length} subject files in ${DATA_DIR}...`);

  let totalQuestions = 0;
  let diagramsAdded = 0;
  let videosAdded = 0;

  for (const file of files) {
    const subject = file.replace('.json', '');
    const filePath = path.join(DATA_DIR, file);
    const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      totalQuestions++;

      // PRESERVE iq-es6-0010 (already handcrafted with custom Swiggy/Zomato state machine)
      if (q.id === 'iq-es6-0010') {
        const video = findVideo(q.question);
        if (video) {
          q.videoUrl = video.url;
          q.videoTitle = video.title;
          videosAdded++;
        }
        continue;
      }

      const content = generateSimplifiedContent(subject, q);
      q.shortAnswer = content.shortAnswer;
      q.interviewAnswer = content.interviewAnswer;
      q.example = content.example;
      q.codeSnippet = content.example;

      // Authentic Diagram ONLY if truly relevant! Omit otherwise (no fake diagrams!)
      const authDiagram = getAuthenticDiagram(subject, `${q.question} ${q.subtopic || ''} ${q.concept || ''}`);
      if (authDiagram) {
        q.diagram = authDiagram.diagram;
        q.diagramCaption = authDiagram.caption;
        diagramsAdded++;
      } else {
        delete q.diagram;
        delete q.diagramCaption;
      }

      // Check for curated video tutorial embed
      const video = findVideo(`${q.question} ${q.subtopic || ''} ${q.concept || ''}`);
      if (video) {
        q.videoUrl = video.url;
        q.videoTitle = video.title;
        videosAdded++;
      } else {
        delete q.videoUrl;
        delete q.videoTitle;
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), 'utf8');
    console.log(`✅ Cleaned & upgraded ${questions.length} questions in ${file}`);
  }

  console.log(`\n🎉 Complete! Upgraded ${totalQuestions} questions. Added ${diagramsAdded} authentic diagrams and ${videosAdded} curated video tutorials.`);
}

runUpgradedGenerator().catch(err => {
  console.error("Generator failed:", err);
  process.exit(1);
});
