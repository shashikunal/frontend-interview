// scripts/dom-gen/part5-a.cjs
// 38 Unique Questions on Observers & Shadow DOM / Web Components
// Distribution: 5 EASY, 20 INTERMEDIATE, 13 DIFFICULT

module.exports = [
  // --- 5 EASY Questions ---
  {
    topic: "Observers (Mutation, Intersection, Resize)",
    subtopic: "IntersectionObserver Definition & Purpose",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What is the IntersectionObserver API and why is it superior to scroll event listeners for lazy loading?",
    shortAnswer: "IntersectionObserver asynchronously observes when a target element enters or exits the visible viewport or a specified container, executing off the main thread without scroll listener lag or layout thrashing.",
    detailedExplanation: "- **Off Main Thread**: Browser calculates visibility intersections asynchronously during its internal rendering pipeline.\n- **No Event Flooding**: Unlike `window.addEventListener('scroll')`, it does not fire dozens of times per second or require debounce/throttle wrappers.\n- **Zero getBoundingClientRect**: Eliminates forced synchronous layouts caused by reading coordinates during scroll.",
    codeExample: "const observer = new IntersectionObserver((entries) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      console.log('Element is now visible in viewport!');\n    }\n  });\n});\n\nobserver.observe(document.querySelector('#lazy-image'));",
    interviewTips: ["Cite eliminating `getBoundingClientRect()` inside scroll listeners as the primary performance win of IntersectionObserver."]
  },
  {
    topic: "Observers (Mutation, Intersection, Resize)",
    subtopic: "ResizeObserver Purpose",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What is ResizeObserver and how does it differ from window.onresize?",
    shortAnswer: "ResizeObserver monitors dimension changes on individual DOM elements, whereas `window.onresize` only fires when the entire browser window is resized.",
    detailedExplanation: "- **Component-Level Observability**: Essential for responsive components (like sidebars collapsing, tabs wrapping, or charts resizing) that resize independent of window width.\n- **Zero Polling**: Replaces costly `setInterval` layout polling loops.\n- **Direct Dimensions**: Exposes `contentRect`, `borderBoxSize`, and `contentBoxSize` directly in the callback.",
    codeExample: "const chartContainer = document.querySelector('#chart');\n\nconst resizeObserver = new ResizeObserver((entries) => {\n  for (const entry of entries) {\n    const { width, height } = entry.contentRect;\n    redrawChart(width, height);\n  }\n});\n\nresizeObserver.observe(chartContainer);",
    interviewTips: ["Clarify that `window.onresize` misses element dimension changes triggered by CSS transitions, collapsible sidebars, or DOM insertions."]
  },
  {
    topic: "Observers (Mutation, Intersection, Resize)",
    subtopic: "Disconnecting Observers to Prevent Memory Leaks",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you stop an observer from watching elements when they are unmounted or no longer needed?",
    shortAnswer: "Call `observer.unobserve(targetElement)` to stop watching a single element, or `observer.disconnect()` to stop watching all observed elements and release memory.",
    detailedExplanation: "- **observer.unobserve(target)**: Selectively stops watching a specific DOM node.\n- **observer.disconnect()**: Completely shuts down the observer, clearing all internal references.\n- **SPA Cleanups**: Mandatory in `useEffect` or component destroy hooks to avoid memory leaks from detached elements.",
    codeExample: "const observer = new IntersectionObserver(callback);\nobserver.observe(img1);\nobserver.observe(img2);\n\n// Stop observing only img1:\nobserver.unobserve(img1);\n\n// Stop observing everything and tear down observer:\nobserver.disconnect();",
    interviewTips: ["Always mention `observer.disconnect()` as a critical cleanup step during single-page app component teardowns."]
  },
  {
    topic: "Shadow DOM & Web Components",
    subtopic: "Custom Elements customElements.define",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you define and register a custom HTML tag using the Custom Elements API?",
    shortAnswer: "Create a class extending `HTMLElement` and register it with `customElements.define('my-tag', MyTagClass)`.",
    detailedExplanation: "- **Hyphen Requirement**: Custom element tag names MUST contain at least one hyphen (e.g. `<user-card>`, `<app-header>`) to avoid naming collisions with future standard HTML tags.\n- **Extends HTMLElement**: Autonomous custom elements must inherit from `HTMLElement`.\n- **Constructor Requirement**: The constructor must call `super()` first.",
    codeExample: "class AppHeader extends HTMLElement {\n  constructor() {\n    super();\n    this.innerHTML = '<h1>My Awesome Application</h1>';\n  }\n}\n\n// Must contain a hyphen:\ncustomElements.define('app-header', AppHeader);",
    interviewTips: ["Highlight the hyphen rule: browsers reject tag names without hyphens to preserve HTML namespace compatibility."]
  },
  {
    topic: "Shadow DOM & Web Components",
    subtopic: "Shadow Root Open vs Closed Mode",
    difficulty: "EASY",
    questionType: "COMPARISON",
    question: "What is the difference between element.attachShadow({ mode: 'open' }) and { mode: 'closed' }?",
    shortAnswer: "`mode: 'open'` allows outer JavaScript to inspect the shadow tree via `element.shadowRoot`, while `mode: 'closed'` hides the shadow root, making `element.shadowRoot` return `null`.",
    detailedExplanation: "- **open Mode**: `element.shadowRoot` returns the ShadowRoot instance. This is the community standard for testability and developer ergonomics.\n- **closed Mode**: `element.shadowRoot` returns `null`. JavaScript outside the class cannot access the shadow tree directly.\n- **Security Myth**: Closed mode does NOT provide real cryptographic security; outer code can still monkey-patch `Element.prototype.attachShadow`.",
    codeExample: "class MyWidget extends HTMLElement {\n  constructor() {\n    super();\n    // Open mode (recommended):\n    this.attachShadow({ mode: 'open' });\n    this.shadowRoot.innerHTML = '<p>Encapsulated widget</p>';\n  }\n}\ncustomElements.define('my-widget', MyWidget);\n\nconst widget = document.querySelector('my-widget');\nconsole.log(widget.shadowRoot); // ShadowRoot object (accessible)",
    interviewTips: ["State clearly that `mode: 'closed'` is almost never recommended because it breaks testing tools and provides false security."]
  },

  // --- 20 INTERMEDIATE Questions ---
  {
    topic: "Observers (Mutation, Intersection, Resize)",
    subtopic: "IntersectionObserver Options (root, rootMargin, threshold)",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What are root, rootMargin, and threshold options in the IntersectionObserver constructor?",
    shortAnswer: "`root` specifies the scrolling viewport container (default is browser viewport); `rootMargin` expands or shrinks the intersection bounding box; `threshold` defines what percentage of visibility triggers the callback.",
    detailedExplanation: "- **root**: A specific ancestor element whose bounds act as the viewport. Must be an ancestor of target.\n- **rootMargin**: CSS-style margin (e.g. `'200px 0px'`) used to pre-load images 200px before they become visible on screen.\n- **threshold**: Single number (`0.5`) or array (`[0, 0.25, 0.5, 0.75, 1.0]`) indicating at what visibility percentages to fire.",
    codeExample: "const observer = new IntersectionObserver((entries) => {\n  // Pre-loads images 200px BEFORE entering viewport:\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      entry.target.src = entry.target.dataset.src;\n      observer.unobserve(entry.target);\n    }\n  });\n}, {\n  root: null, // browser viewport\n  rootMargin: '200px 0px', // 200px pre-fetch buffer\n  threshold: 0.1 // triggers when 10% visible\n});",
    interviewTips: ["Use the '200px rootMargin pre-fetch' pattern to explain how seamless infinite scroll and image loading work."]
  },
  {
    topic: "Observers (Mutation, Intersection, Resize)",
    subtopic: "MutationObserver Configuration Options",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What mutation types can MutationObserver track and what are the key options in MutationObserverInit?",
    shortAnswer: "MutationObserver tracks DOM changes via options: `childList` (added/removed nodes), `attributes` (attribute changes), `characterData` (text content changes), `subtree` (watch all descendants), and `attributeOldValue`.",
    detailedExplanation: "- **childList**: Notifies when child elements or text nodes are inserted or removed.\n- **attributes**: Notifies when attributes like `class` or `disabled` change. Can filter with `attributeFilter: ['class', 'data-state']`.\n- **characterData**: Notifies when text inside text nodes changes.\n- **subtree**: Must be `true` if you want to observe descendants beyond direct children.\n- **Asynchronous Batching**: Mutations are batched and delivered as microtasks.",
    codeExample: "const observer = new MutationObserver((mutations) => {\n  for (const m of mutations) {\n    if (m.type === 'childList') console.log('Nodes added/removed');\n    if (m.type === 'attributes') console.log(`Attribute ${m.attributeName} changed`);\n  }\n});\n\nobserver.observe(document.body, {\n  childList: true,\n  subtree: true,\n  attributes: true,\n  attributeFilter: ['data-theme']\n});",
    interviewTips: ["Highlight `attributeFilter` as an essential performance practice to prevent handling irrelevant attribute mutations."]
  },
  {
    topic: "Observers (Mutation, Intersection, Resize)",
    subtopic: "MutationObserver vs Deprecated Mutation Events",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    question: "Why were legacy Mutation Events (DOMSubtreeModified, DOMNodeInserted) deprecated and replaced by MutationObserver?",
    shortAnswer: "Mutation Events fired synchronously on every single node mutation, severely degrading browser performance, causing layout thrashing, and triggering recursive infinite loops. MutationObserver batches changes asynchronously.",
    detailedExplanation: "- **Synchronous Penalty**: Removing 1,000 nodes fired 1,000 synchronous event dispatches on the main thread.\n- **Browser Removal**: Chrome, Firefox, and Safari have completely deprecated and removed Mutation Events in 2024.\n- **Batch Delivery**: MutationObserver delivers a list of `MutationRecord` objects asynchronously via microtasks, keeping UI fluid.",
    codeExample: "// OBSOLETE & REMOVED (Do not use):\n// document.addEventListener('DOMNodeInserted', handleNode);\n\n// MODERN STANDARD (Asynchronous & batched):\nconst observer = new MutationObserver(records => handleMutations(records));\nobserver.observe(container, { childList: true });",
    interviewTips: ["Emphasize that Mutation Events were synchronous and caused catastrophic slowdowns, while MutationObserver is asynchronous and batched."]
  },
  {
    topic: "Shadow DOM & Web Components",
    subtopic: "Custom Element Lifecycle Callbacks",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What are the four primary lifecycle callbacks of an autonomous Custom Element?",
    shortAnswer: "1. `connectedCallback`: Element inserted into document DOM. 2. `disconnectedCallback`: Element removed from DOM. 3. `adoptedCallback`: Element moved to a new document. 4. `attributeChangedCallback`: Observed attribute mutated.",
    detailedExplanation: "- **connectedCallback**: Set up event listeners, fetch data, render initial DOM.\n- **disconnectedCallback**: Teardown timers, unbind global event listeners, disconnect observers.\n- **attributeChangedCallback**: Responds to attribute changes. Requires static `observedAttributes` getter.\n- **adoptedCallback**: Rare; triggers when `document.adoptNode()` moves element across iframes.",
    codeExample: "class UserBadge extends HTMLElement {\n  static get observedAttributes() { return ['status']; }\n  \n  connectedCallback() {\n    console.log('Element attached to document DOM');\n  }\n  disconnectedCallback() {\n    console.log('Element removed from document DOM');\n  }\n  attributeChangedCallback(name, oldVal, newVal) {\n    console.log(`Attribute ${name} changed from ${oldVal} to ${newVal}`);\n  }\n}",
    interviewTips: ["List all four callbacks: `connectedCallback`, `disconnectedCallback`, `adoptedCallback`, `attributeChangedCallback`."]
  },
  {
    topic: "Shadow DOM & Web Components",
    subtopic: "Custom Elements observedAttributes and attributeChangedCallback",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you monitor and react to attribute changes in a custom Web Component?",
    shortAnswer: "Define a static getter `static get observedAttributes() { return ['attr1']; }` and implement `attributeChangedCallback(name, oldValue, newValue)`.",
    detailedExplanation: "- **Opt-in Performance**: Browsers only trigger the callback for attributes explicitly declared in `observedAttributes`.\n- **Initial Call**: `attributeChangedCallback` runs on initial element construction if attributes are present in markup.\n- **Attribute-Property Sync**: Best practice is to reflect property changes to attributes and vice versa.",
    codeExample: "class CounterTag extends HTMLElement {\n  static get observedAttributes() { return ['count']; }\n\n  attributeChangedCallback(name, oldVal, newVal) {\n    if (name === 'count' && oldVal !== newVal) {\n      this.textContent = `Current Count: ${newVal}`;\n    }\n  }\n}\ncustomElements.define('counter-tag', CounterTag);",
    interviewTips: ["Always emphasize that without the `static get observedAttributes()` getter, `attributeChangedCallback` will never fire."]
  },
  {
    topic: "Shadow DOM & Web Components",
    subtopic: "HTML <slot> and Named Slots",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is an HTML <slot> element and how do named slots work in Shadow DOM?",
    shortAnswer: "A `<slot>` is a placeholder inside a Shadow DOM where markup from the light DOM is projected and rendered, supporting default (unnamed) slots and named slots (`<slot name=\"header\">`).",
    detailedExplanation: "- **Composition**: Enables component templating while allowing users to inject custom content.\n- **Named Slots**: Matches light DOM children using `slot=\"slotName\"` attribute: `<h1 slot=\"header\">`.\n- **Fallback Content**: Content placed inside `<slot>Default text</slot>` displays when no child is projected.",
    codeExample: "// Shadow DOM Template:\nthis.shadowRoot.innerHTML = `\n  <header><slot name=\"title\">Default Title</slot></header>\n  <main><slot></slot></main>\n`;\n\n// Usage in HTML:\n// <my-card><span slot=\"title\">Custom Title</span><p>Body content</p></my-card>",
    interviewTips: ["Explain slot projection: light DOM nodes are visually rendered in the slot without physically moving in the DOM tree."]
  },
  {
    topic: "Shadow DOM & Web Components",
    subtopic: "CSS Scoping with :host and :host()",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "How do the CSS :host and :host(selector) pseudo-classes style custom Web Components?",
    shortAnswer: "`:host` styles the custom element container from inside its own shadow DOM; `:host(selector)` applies styles only when the host matches a specific class or attribute state.",
    detailedExplanation: "- **Encapsulated Host Styling**: Directly targets the outer custom tag (e.g. `<my-button>`) from the inner shadow stylesheet.\n- **State Matching**: `:host(.active)`, `:host([disabled])`, or `:host(:hover)` allows styling based on host attributes.\n- **Default Display**: Custom elements are `display: inline` by default; `:host { display: block; }` is standard practice.",
    codeExample: ":host {\n  display: block;\n  padding: 1rem;\n  border-radius: 8px;\n  background: #f8fafc;\n}\n\n:host([disabled]) {\n  opacity: 0.5;\n  pointer-events: none;\n}",
    interviewTips: ["Remember that custom elements default to `display: inline`; using `:host { display: block; }` is almost always needed."]
  },
  {
    topic: "Shadow DOM & Web Components",
    subtopic: "CSS ::slotted() Pseudo-Element",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is the CSS ::slotted() pseudo-element and what styling limitations does it have?",
    shortAnswer: "`::slotted(selector)` styles elements projected into a `<slot>` from inside the shadow DOM, but it can only target top-level slotted elements, not their nested descendants.",
    detailedExplanation: "- **Direct Children Only**: `::slotted(p)` works for direct slotted `<p>` tags; `::slotted(p span)` is invalid and ignored by browsers.\n- **Specificity**: Outer document styles always override `::slotted()` styles.\n- **Compound Selectors**: Must use compound single element selectors like `::slotted(.highlight)`.",
    codeExample: "/* Inside Shadow DOM styles: */\n::slotted(h2) {\n  color: #2563eb;\n  margin-top: 0;\n}\n\n/* FAILS (Cannot style nested descendants of slotted elements): */\n/* ::slotted(div) span { color: red; } */",
    interviewTips: ["Point out the single-level limitation: `::slotted()` cannot reach into nested descendants of slotted nodes."]
  },
  {
    topic: "Shadow DOM & Web Components",
    subtopic: "CSS ::part() and CSS Shadow Parts",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "How does the CSS part attribute and ::part() selector enable theme styling of shadow DOM internals?",
    shortAnswer: "An element inside a shadow DOM exposes a styling hook using `part=\"part-name\"`, allowing external page stylesheets to style it safely using `my-element::part(part-name)` without piercing encapsulation.",
    detailedExplanation: "- **Controlled Theming**: Exposes specific internal elements for external styling without leaking the entire shadow tree.\n- **No Arbitrary Selectors**: Outer CSS cannot style elements lacking a `part` attribute.\n- **Design Systems**: Standardized method for theming third-party Web Component libraries.",
    codeExample: "// Inside Shadow DOM:\n// <button part=\"action-btn\">Click Me</button>\n\n/* In global page CSS (styles internal button safely): */\nmy-dialog::part(action-btn) {\n  background-color: #6366f1;\n  border-radius: 9999px;\n}",
    interviewTips: ["Mention `::part()` as the official CSS specification replacement for the deprecated `/deep/` and `::shadow` combinators."]
  },
  {
    topic: "Shadow DOM & Web Components",
    subtopic: "slotchange Event",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you detect when child nodes assigned to a <slot> are added, removed, or changed?",
    shortAnswer: "Listen for the `slotchange` event on the `<slot>` element, then inspect assigned nodes using `slot.assignedNodes()` or `slot.assignedElements()`.",
    detailedExplanation: "- **Event Target**: Fires directly on the `<slot>` element when its assigned content changes.\n- **assignedElements()**: Returns an array of element nodes assigned to the slot (skipping text/whitespace nodes).\n- **Use Case**: Automatically recalculating tab counts or carousel slide counts when users inject new children into a component.",
    codeExample: "const slot = this.shadowRoot.querySelector('slot');\n\nslot.addEventListener('slotchange', () => {\n  const assignedElements = slot.assignedElements();\n  console.log(`Slot content updated! Total elements: ${assignedElements.length}`);\n  updateSlideIndicators(assignedElements.length);\n});",
    interviewTips: ["Use `slot.assignedElements()` to easily filter out empty whitespace text nodes from assigned children."]
  },
  {
    topic: "Observers (Mutation, Intersection, Resize)",
    subtopic: "ResizeObserver borderBoxSize vs contentBoxSize",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    question: "What is the difference between borderBoxSize, contentBoxSize, and contentRect in a ResizeObserverEntry?",
    shortAnswer: "`contentRect` is a legacy DOMRectReadOnly; `borderBoxSize` provides the dimension including padding and border; `contentBoxSize` provides the dimension of content only. Both box sizes return arrays for CSS fragmentation.",
    detailedExplanation: "- **contentRect**: Left/top are padding offsets; width/height represent content box.\n- **borderBoxSize**: Preferred for canvas and chart wrappers to match the actual visual border-box size.\n- **devicePixelContentBoxSize**: Modern addition reporting size in physical device pixels, eliminating blurry lines on high-DPI canvas screens.",
    codeExample: "const observer = new ResizeObserver(([entry]) => {\n  if (entry.borderBoxSize) {\n    const { inlineSize, blockSize } = entry.borderBoxSize[0];\n    console.log(`Border box: ${inlineSize}px wide, ${blockSize}px high`);\n  }\n});\nobserver.observe(canvasWrapper);",
    interviewTips: ["Mention that `inlineSize` and `blockSize` are logical dimensions (horizontal writing mode: inlineSize = width, blockSize = height)."]
  },
  {
    topic: "Observers (Mutation, Intersection, Resize)",
    subtopic: "PerformanceObserver for Web Vitals",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you use PerformanceObserver to measure Largest Contentful Paint (LCP) in the DOM?",
    shortAnswer: "Create a `new PerformanceObserver()` observing `'largest-contentful-paint'` entries with `{ buffered: true }`.",
    detailedExplanation: "- **buffered: true**: Retrieves entries that occurred prior to observer initialization during page load.\n- **entry.element**: Points directly to the DOM element (hero image, heading) that triggered the LCP event.\n- **Core Web Vitals**: Standard method for tracking real-user performance metrics in production monitoring.",
    codeExample: "const lcpObserver = new PerformanceObserver((entryList) => {\n  const entries = entryList.getEntries();\n  const lastEntry = entries[entries.length - 1];\n  console.log('LCP Render Time (ms):', lastEntry.renderTime || lastEntry.loadTime);\n  console.log('LCP DOM Element:', lastEntry.element);\n});\n\nlcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });",
    interviewTips: ["Always include `{ buffered: true }` when observing performance entries so you don't miss events from early page load."]
  },
  {
    topic: "Shadow DOM & Web Components",
    subtopic: "Custom Elements customElements.whenDefined()",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you wait for a custom element tag to be registered before interacting with its methods?",
    shortAnswer: "Call `customElements.whenDefined('my-tag')`, which returns a Promise that resolves when the tag has been registered.",
    detailedExplanation: "- **Async Loading**: Custom element scripts are often bundled in separate asynchronous chunks.\n- **Prevents Undefined Errors**: Awaiting `whenDefined` guarantees that calling custom methods on the element will not throw `TypeError: el.someMethod is not a function`.\n- **CSS :defined**: Pairs with the CSS `:not(:defined)` pseudo-class to hide elements until registered.",
    codeExample: "async function initializeDashboard() {\n  // Waits until <user-profile> script is loaded and defined:\n  await customElements.whenDefined('user-profile');\n  \n  const profile = document.querySelector('user-profile');\n  profile.loadUserData(42);\n}",
    interviewTips: ["Combine `customElements.whenDefined` with CSS `:not(:defined) { display: none; }` to eliminate FOUC (flash of unstyled content)."]
  },
  {
    topic: "Shadow DOM & Web Components",
    subtopic: "CSS :defined Pseudo-Class and FOUC Prevention",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you prevent a Flash of Unstyled Content (FOUC) while custom elements are downloading?",
    shortAnswer: "Use the `:not(:defined)` CSS selector to hide or show placeholders on custom elements until `customElements.define()` executes.",
    detailedExplanation: "- **Native Browser State**: Any element matching an unregistered custom tag matches `:not(:defined)`.\n- **Instant Upgrade**: Once `customElements.define()` is called, the element matches `:defined` and browser styles update automatically.\n- **Skeleton UI**: You can render skeleton animations on `:not(:defined)` elements.",
    codeExample: "/* Hides custom elements until their JavaScript definition loads: */\ncustom-carousel:not(:defined) {\n  opacity: 0;\n  min-height: 300px;\n  background: #f1f5f9; /* Skeleton placeholder */\n}\n\ncustom-carousel:defined {\n  opacity: 1;\n  transition: opacity 0.3s ease-in;\n}",
    interviewTips: ["Mention `:not(:defined)` as the standard web platform pattern for preventing FOUC with Web Components."]
  },
  {
    topic: "Observers (Mutation, Intersection, Resize)",
    subtopic: "IntersectionObserver Threshold Array",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you track granular scroll progress of an article using an IntersectionObserver threshold array?",
    shortAnswer: "Pass an array of numbers between 0.0 and 1.0 (e.g. `[0, 0.25, 0.5, 0.75, 1.0]`) to `options.threshold` to receive updates at each milestone.",
    detailedExplanation: "- **Multi-Threshold**: Fires every time the target's visibility crosses any value in the threshold array.\n- **Reading Ratio**: Inspect `entry.intersectionRatio` to determine the current percentage visible.\n- **Progress Bars**: Used to drive reading progress bars or video playback volume as users scroll through articles.",
    codeExample: "const observer = new IntersectionObserver((entries) => {\n  for (const entry of entries) {\n    const pct = Math.round(entry.intersectionRatio * 100);\n    console.log(`Article is ${pct}% visible`);\n  }\n}, {\n  threshold: [0, 0.25, 0.5, 0.75, 1.0] // Triggers at 0%, 25%, 50%, 75%, 100%\n});",
    interviewTips: ["Explain that passing an array to `threshold` enables multi-step scroll progress tracking without scroll listeners."]
  },

  // --- 13 DIFFICULT Questions ---
  {
    topic: "Observers (Mutation, Intersection, Resize)",
    subtopic: "ResizeObserver Loop Limit Exceeded Error",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "What causes the 'ResizeObserver loop limit exceeded' error in browser consoles and how do you resolve it?",
    shortAnswer: "It occurs when a ResizeObserver callback resizes an observed element, triggering another resize notification in the same animation frame, threatening an infinite loop.",
    detailedExplanation: "- **Depth Safeguard**: The browser monitors the depth of elements being resized; if a deeper element modifies a shallower ancestor in the same frame, the browser defers delivery and logs this warning.\n- **Harmless Notification**: In most cases, it is a benign notification indicating that a delivery was deferred to the next frame.\n- **Resolution**: Avoid modifying elements that change the dimensions of observed containers inside the callback, or defer updates with `requestAnimationFrame()`.",
    codeExample: "// Pattern to prevent loop limit exceeded:\nconst observer = new ResizeObserver((entries) => {\n  window.requestAnimationFrame(() => {\n    // Defer layout updates to the next frame:\n    updateComponentDimensions(entries[0].contentRect);\n  });\n});",
    interviewTips: ["Clarify that 'ResizeObserver loop limit exceeded' is a safeguard warning, and deferring layout mutations with rAF resolves it."]
  },
  {
    topic: "Shadow DOM & Web Components",
    subtopic: "Customized Built-In Elements (is Attribute)",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "What is the difference between an Autonomous Custom Element and a Customized Built-In Element?",
    shortAnswer: "Autonomous elements inherit from `HTMLElement` and use custom tags (`<my-button>`), while Customized Built-In elements inherit from specific HTML classes (like `HTMLButtonElement`) and use the `is` attribute (`<button is=\"my-button\">`).",
    detailedExplanation: "- **Built-In Accessibility**: Customized built-in elements retain native semantics, keyboard interactions, and accessibility of the original tag.\n- **Registration Syntax**: `customElements.define('my-btn', MyBtn, { extends: 'button' })`.\n- **Safari Limitation**: Apple Safari has famously refused to implement customized built-in elements, making autonomous custom elements the cross-browser standard.",
    codeExample: "class ConfirmButton extends HTMLButtonElement {\n  connectedCallback() {\n    this.addEventListener('click', (e) => {\n      if (!confirm('Are you sure?')) e.preventDefault();\n    });\n  }\n}\n// Registering customized built-in:\ncustomElements.define('confirm-button', ConfirmButton, { extends: 'button' });\n\n// Usage in HTML:\n// <button is=\"confirm-button\">Delete Account</button>",
    interviewTips: ["Mention Safari's lack of support for customized built-in elements (`is=\"...\"`) to demonstrate deep platform knowledge."]
  },
  {
    topic: "Shadow DOM & Web Components",
    subtopic: "Form-Associated Custom Elements Lifecycle",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "What lifecycle callbacks are unique to Form-Associated Custom Elements (FACE)?",
    shortAnswer: "`formAssociatedCallback(form)`, `formDisabledCallback(disabled)`, `formResetCallback()`, and `formStateRestoreCallback(state, mode)`.",
    detailedExplanation: "- **formAssociatedCallback(form)**: Called when the element is associated with or disassociated from a `<form>`.\n- **formDisabledCallback(disabled)**: Called when the parent `<fieldset disabled>` is toggled.\n- **formResetCallback()**: Called when the parent form is reset, allowing custom inputs to revert to default values.\n- **formStateRestoreCallback()**: Called by the browser to restore input state after history navigation or form autofill.",
    codeExample: "class CustomToggle extends HTMLElement {\n  static formAssociated = true;\n  constructor() {\n    super();\n    this.internals = this.attachInternals();\n  }\n  formResetCallback() {\n    this.checked = false; // Reset custom control state\n    this.internals.setFormValue('off');\n  }\n}",
    interviewTips: ["Listing FACE lifecycle callbacks (`formResetCallback`, `formDisabledCallback`) proves advanced Web Components mastery."]
  },
  {
    topic: "Observers (Mutation, Intersection, Resize)",
    subtopic: "MutationObserver Microtask Delivery Semantics",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "When exactly do MutationObserver callbacks execute relative to JavaScript code execution and screen rendering?",
    shortAnswer: "MutationObserver callbacks execute as microtasks immediately when the current JavaScript call stack empties, before the browser renders the next frame and before macrotasks (like setTimeout) run.",
    detailedExplanation: "- **Microtask Priority**: Queued in the microtask checkpoint alongside `Promise.then()` callbacks.\n- **Pre-Render Execution**: Executes before browser style recalculations and layout paints, allowing scripts to adjust the DOM before pixels hit the screen.\n- **takeRecords()**: Calling `observer.takeRecords()` synchronously drains and returns any pending mutation records immediately.",
    codeExample: "const observer = new MutationObserver(() => console.log('Mutation microtask'));\nobserver.observe(document.body, { childList: true });\n\nsetTimeout(() => console.log('Macrotask (setTimeout)'), 0);\nPromise.resolve().then(() => console.log('Promise microtask'));\n\ndocument.body.appendChild(document.createElement('div'));\nconsole.log('Call stack complete');\n\n// Output order:\n// 1. Call stack complete\n// 2. Promise microtask\n// 3. Mutation microtask\n// 4. Macrotask (setTimeout)",
    interviewTips: ["Clarify that MutationObservers run as microtasks before rendering, meaning visual changes can be corrected before users see them."]
  },
  {
    topic: "Shadow DOM & Web Components",
    subtopic: "Declarative Shadow DOM (<template shadowrootmode>)",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "What is Declarative Shadow DOM (DSD) and how does it enable Server-Side Rendering (SSR) for Web Components?",
    shortAnswer: "Declarative Shadow DOM allows attaching shadow roots directly in HTML markup using `<template shadowrootmode=\"open\">`, enabling server-rendered HTML to display encapsulated Shadow DOM without waiting for JavaScript.",
    detailedExplanation: "- **SSR Support**: Solves the historic limitation that Web Components required client-side JS `attachShadow()` to render shadow trees.\n- **Zero JS Initial Render**: Browsers parse and instantiate the shadow root immediately during initial HTML parsing.\n- **Cross-Browser Standard**: Standardized in HTML specifications and implemented across all evergreen browsers.",
    codeExample: "<!-- Server-Rendered HTML with Declarative Shadow DOM: -->\n<user-card>\n  <template shadowrootmode=\"open\">\n    <style>p { color: #10b981; font-weight: bold; }</style>\n    <p>Server-rendered encapsulated user card!</p>\n  </template>\n</user-card>",
    interviewTips: ["Highlight Declarative Shadow DOM (`<template shadowrootmode=\"open\">`) as the breakthrough that made SSR Web Components viable."]
  },
  {
    topic: "Shadow DOM & Web Components",
    subtopic: "CSS Cascading Inside vs Outside Shadow DOM",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "How do inherited CSS properties (like color and font-family) interact with Shadow DOM boundaries?",
    shortAnswer: "Inherited CSS properties (such as color, font-family, line-height) naturally pierce through shadow boundaries and inherit from the host element, whereas non-inherited properties (background, border, padding) do not.",
    detailedExplanation: "- **Natural Inheritance**: Text styles set on `body` (e.g. `font-family: Inter`) cascade into shadow roots automatically.\n- **CSS Variables**: CSS Custom Properties (`--my-theme-color`) also cascade seamlessly into shadow trees.\n- **Resetting Styles**: To prevent outer inherited styles from bleeding in, use `:host { all: initial; }` inside the shadow stylesheet.",
    codeExample: "/* Inside Shadow DOM styles to isolate from outer typography leaks: */\n:host {\n  all: initial; /* Resets all inherited CSS properties to defaults */\n  display: block;\n  font-family: system-ui, sans-serif;\n}",
    interviewTips: ["Explain how CSS variables and inherited properties pierce shadow boundaries, while `:host { all: initial; }` blocks them."]
  },
  {
    topic: "Observers (Mutation, Intersection, Resize)",
    subtopic: "MutationObserver takeRecords() Method",
    difficulty: "DIFFICULT",
    questionType: "CODE",
    question: "What does observer.takeRecords() do in MutationObserver and when must it be called before disconnect()?",
    shortAnswer: "`observer.takeRecords()` synchronously empties the observer's internal queue and returns any pending `MutationRecord` objects before the asynchronous callback has fired.",
    detailedExplanation: "- **Immediate Flush**: Drains mutations that occurred but haven't been dispatched to the callback yet.\n- **Teardown Trap**: Calling `observer.disconnect()` immediately discards pending mutations in the queue.\n- **Safe Teardown Pattern**: Call `const pending = observer.takeRecords(); process(pending); observer.disconnect();` to ensure no changes are lost.",
    codeExample: "const observer = new MutationObserver(handleMutations);\nobserver.observe(container, { childList: true });\n\nfunction teardown() {\n  // Drains and processes any unhandled mutations before disconnecting:\n  const pendingMutations = observer.takeRecords();\n  if (pendingMutations.length > 0) {\n    handleMutations(pendingMutations);\n  }\n  observer.disconnect();\n}",
    interviewTips: ["Mention that `disconnect()` discards pending records unless you retrieve them first with `takeRecords()`."]
  },
  {
    topic: "Shadow DOM & Web Components",
    subtopic: "Shadow DOM and Accessibility (ARIA ID references across roots)",
    difficulty: "DIFFICULT",
    questionType: "ACCESSIBILITY",
    question: "Why do aria-labelledby and aria-describedby fail when referencing an ID inside a different Shadow Root, and how is this resolved?",
    shortAnswer: "ARIA ID references are scoped strictly within the same DOM root; an ID inside a shadow root is invisible to an element in the light DOM. This is resolved using Cross-Root ARIA or ARIA Element Reflection.",
    detailedExplanation: "- **Tree Isolation**: `document.getElementById()` cannot find elements in shadow roots; ARIA ID resolution follows the exact same scope boundary.\n- **ARIA Element Reflection**: Modern browsers support assigning element references directly: `input.ariaLabelledByElements = [headerElement]`.\n- **Slot Pattern**: Project the label through a slot so both elements exist within the same shadow context.",
    codeExample: "// ARIA Element Reflection (bypasses string ID boundaries):\nconst customInput = document.querySelector('custom-input');\nconst outerLabel = document.querySelector('#external-label');\n\n// Direct node reference across boundaries:\ncustomInput.ariaLabelledByElements = [outerLabel];",
    interviewTips: ["Cite ARIA Element Reflection (`ariaLabelledByElements`) as the modern solution for cross-boundary accessibility."]
  }
];
