// scripts/dom-gen/part4-b.cjs
// 40 Unique Questions on DOM Performance, Reflow, Repaint & Interactive Forms
// Distribution: 10 EASY, 20 INTERMEDIATE, 10 DIFFICULT

module.exports = [
  // --- 10 EASY Questions ---
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "Reflow vs Repaint Definition",
    difficulty: "EASY",
    questionType: "COMPARISON",
    question: "What is the difference between a Reflow (Layout) and a Repaint in the browser rendering pipeline?",
    shortAnswer: "Reflow recalculates the geometric dimensions and positions of elements on the page, while Repaint redraws visual pixels (colors, shadows, visibility) without changing layout geometry.",
    detailedExplanation: "- **Reflow (Layout)**: Expensive computational process. Changing `width`, `height`, `margin`, or adding DOM nodes forces reflow of the element and its ancestors.\n- **Repaint**: Cheaper process. Changing `color`, `background-color`, or `box-shadow` repaints pixels without moving elements.\n- **Dependency**: A reflow always triggers a repaint, but a repaint does NOT trigger a reflow.",
    codeExample: "// Triggers Reflow + Repaint (expensive):\ncard.style.width = '300px';\n\n// Triggers Repaint ONLY (cheaper):\ncard.style.backgroundColor = '#10b981';",
    interviewTips: ["Key sentence: 'Reflow is about geometry and position; Repaint is about visual surface pixels. Reflow always triggers Repaint.'"]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "DocumentFragment for Batching",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you use a DocumentFragment to insert 100 new elements without triggering 100 separate reflows?",
    shortAnswer: "Create a fragment with `document.createDocumentFragment()`, append all 100 elements to the fragment in memory, and then append the fragment to the DOM in a single operation.",
    detailedExplanation: "- **Lightweight Container**: A DocumentFragment exists purely in memory and has no parent in the active DOM tree.\n- **Single Reflow**: When appended to the DOM, only the fragment's children are inserted, causing exactly one reflow.\n- **Self-Emptying**: Appending the fragment empties its contents automatically.",
    codeExample: "const list = document.querySelector('#item-list');\nconst fragment = document.createDocumentFragment();\n\nfor (let i = 0; i < 100; i++) {\n  const li = document.createElement('li');\n  li.textContent = `Item #${i + 1}`;\n  fragment.appendChild(li);\n}\n\n// Causes only 1 reflow instead of 100:\nlist.appendChild(fragment);",
    interviewTips: ["Mention DocumentFragment as the standard native DOM solution for batch-inserting elements."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "requestAnimationFrame vs setTimeout",
    difficulty: "EASY",
    questionType: "COMPARISON",
    question: "Why should requestAnimationFrame be used instead of setTimeout or setInterval for DOM animations?",
    shortAnswer: "`requestAnimationFrame` synchronizes execution with the browser's display refresh rate (typically 60Hz or 120Hz) and pauses automatically when the tab is in the background, saving CPU and battery.",
    detailedExplanation: "- **Display Sync**: Runs right before the browser renders the next frame, avoiding dropped frames and visual tearing.\n- **Battery Efficiency**: Automatically throttles or stops when the user switches tabs or minimizes the window.\n- **Precise Timing**: Passes a high-resolution timestamp (`DOMHighResTimeStamp`) as an argument.",
    codeExample: "const box = document.querySelector('.box');\nlet pos = 0;\n\nfunction animate() {\n  pos += 2;\n  box.style.transform = `translateX(${pos}px)`;\n  if (pos < 400) {\n    requestAnimationFrame(animate); // Smooth 60fps sync\n  }\n}\n\nrequestAnimationFrame(animate);",
    interviewTips: ["Emphasize tab-pausing and display refresh rate synchronization as the two main advantages of `requestAnimationFrame`."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "CSS Transform and Opacity Performance",
    difficulty: "EASY",
    questionType: "PERFORMANCE",
    question: "Why are CSS transform and opacity properties significantly faster to animate than top/left or width/height?",
    shortAnswer: "`transform` and `opacity` are handled directly by the GPU compositor thread, skipping both the Reflow (Layout) and Repaint phases of the rendering pipeline.",
    detailedExplanation: "- **Compositor Only**: Animating `transform: translateX(...)` creates a GPU composite layer, moving pixels without touching the main thread.\n- **Skipping Reflow**: Changing `left` or `top` forces the browser main thread to recalculate layout geometry on every frame, causing dropped frames.\n- **60fps / 120fps**: Compositor animations remain smooth even when the JavaScript main thread is busy.",
    codeExample: "// BAD (Triggers main thread Reflow on every frame):\n// element.style.left = `${posX}px`;\n\n// GOOD (GPU Compositor only, 60fps smooth):\nelement.style.transform = `translate3d(${posX}px, 0, 0)`;",
    interviewTips: ["Memorize the 4 stages of rendering: Layout -> Paint -> Composite. `transform` and `opacity` bypass Layout and Paint."]
  },
  {
    topic: "Forms & Interactive Components",
    subtopic: "HTML5 Form novalidate Attribute",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you disable native browser validation popups so you can handle validation entirely in custom JavaScript?",
    shortAnswer: "Add the `novalidate` boolean attribute to the `<form>` element, or set `form.noValidate = true` in JavaScript.",
    detailedExplanation: "- **Suppresses Browser Tooltips**: Prevents native browser speech bubble error tooltips from popping up.\n- **Preserves API**: The Constraint Validation API (`input.validity`, `checkValidity()`) remains fully accessible in JavaScript.\n- **Consistent UI**: Essential for design systems that provide custom brand-aligned error messages and banners.",
    codeExample: "<!-- Suppresses default browser validation balloons: -->\n<form id=\"signup-form\" novalidate>\n  <input type=\"email\" required>\n  <button type=\"submit\">Sign Up</button>\n</form>",
    interviewTips: ["Clarify that `novalidate` only disables the native browser error popup bubbles; it does not disable your custom JS validation."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "Hiding Elements: display: none vs visibility: hidden",
    difficulty: "EASY",
    questionType: "COMPARISON",
    question: "What is the difference between display: none and visibility: hidden in DOM layout and rendering?",
    shortAnswer: "`display: none` completely removes the element from the layout render tree (taking zero space and triggering reflow), while `visibility: hidden` hides the element visually while preserving its layout space.",
    detailedExplanation: "- **display: none**: Triggers reflow and repaint. Descendant elements cannot be made visible.\n- **visibility: hidden**: Triggers repaint only (geometry is unchanged). A child can be made visible via `visibility: visible`.\n- **Accessibility**: Both properties hide content from screen readers.",
    codeExample: "const card = document.querySelector('.card');\n\n// Takes zero space in layout (triggers reflow):\ncard.style.display = 'none';\n\n// Retains space, invisible (triggers repaint only):\ncard.style.visibility = 'hidden';",
    interviewTips: ["Remember: `display: none` affects layout geometry; `visibility: hidden` preserves dimensions and only affects pixels."]
  },
  {
    topic: "Forms & Interactive Components",
    subtopic: "Input pattern Attribute & Regex Validation",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How does the HTML pattern attribute enforce regex validation on text inputs?",
    shortAnswer: "The `pattern` attribute takes a regular expression string that the user input must match entirely, setting `input.validity.patternMismatch = true` if it fails.",
    detailedExplanation: "- **Whole String Match**: Browsers automatically anchor the pattern (`^(?:pattern)$`), requiring the entire value to match.\n- **title Attribute**: Used to provide a helpful hint displayed in the browser's default validation popup.\n- **CSS Pseudo-class**: Matches `:valid` and `:invalid` CSS selectors automatically as the user types.",
    codeExample: "<!-- Enforces 5-digit ZIP code: -->\n<input \n  type=\"text\" \n  name=\"zipcode\" \n  pattern=\"[0-9]{5}\" \n  title=\"Please enter a 5-digit postal code\"\n  required\n>",
    interviewTips: ["Mention that the browser implicitly anchors the pattern with `^` and `$`, so you don't need to write them manually."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "CSS will-change Property",
    difficulty: "EASY",
    questionType: "PERFORMANCE",
    question: "What does the CSS will-change property do and why must it be used sparingly?",
    shortAnswer: "`will-change` informs the browser engine ahead of time which properties will be animated, allowing it to promote the element to its own GPU compositor layer before animation begins.",
    detailedExplanation: "- **Prevents Stutter**: Eliminates the slight stutter that happens when an element is suddenly promoted to a GPU layer mid-animation.\n- **Memory Consumption**: Promoting an element to a GPU compositor layer consumes significant video RAM (VRAM).\n- **Best Practice**: Apply `will-change` just before an animation starts (e.g. on hover) and remove it when the animation ends.",
    codeExample: ".modal-animated {\n  /* Pre-allocates GPU layer for smooth animation: */\n  will-change: transform, opacity;\n}",
    interviewTips: ["Never put `will-change` on hundreds of elements at once; excessive GPU layers exhaust mobile device memory."]
  },
  {
    topic: "Forms & Interactive Components",
    subtopic: "Form Submission via submit() vs requestSubmit()",
    difficulty: "EASY",
    questionType: "COMPARISON",
    question: "Why is form.requestSubmit() preferred over form.submit() in modern JavaScript?",
    shortAnswer: "`form.requestSubmit()` triggers HTML5 constraint validation, fires the `submit` event listeners, and respects submit button attributes, while `form.submit()` bypasses validation and event listeners entirely.",
    detailedExplanation: "- **form.submit()**: Legacy method that bypasses the `submit` event handler and skips HTML5 validation, sending data immediately.\n- **form.requestSubmit()**: Simulates clicking the form's submit button, running validation checks and executing `onsubmit` listeners.\n- **Submitter Identification**: Accepts an optional submitter button: `form.requestSubmit(specificButton)`.",
    codeExample: "const form = document.querySelector('#checkout-form');\n\n// Recommended (runs validation and onsubmit listeners):\nform.requestSubmit();\n\n// Avoid (skips validation completely):\n// form.submit();",
    interviewTips: ["Always recommend `requestSubmit()` over `submit()` to ensure client-side form validation rules are respected."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "Measuring Scroll Height: scrollHeight vs clientHeight",
    difficulty: "EASY",
    questionType: "COMPARISON",
    question: "What is the difference between element.scrollHeight and element.clientHeight?",
    shortAnswer: "`clientHeight` is the inner visible height of the element including padding, while `scrollHeight` is the total height of all content inside the element, including content hidden behind scrollbars.",
    detailedExplanation: "- **clientHeight**: `padding-top` + `height` + `padding-bottom` (visible viewable area).\n- **scrollHeight**: Total scrollable height required to view all child content.\n- **Scroll Detection**: An element is scrolled to the bottom when `element.scrollTop + element.clientHeight >= element.scrollHeight - 1`.",
    codeExample: "const chatBox = document.querySelector('#chat');\n\n// Checks if user has scrolled to the very bottom:\nconst isAtBottom = chatBox.scrollTop + chatBox.clientHeight >= chatBox.scrollHeight - 5;\nif (isAtBottom) {\n  scrollToNewMessage();\n}",
    interviewTips: ["Explain how `scrollHeight` and `clientHeight` work together to detect when a user reaches the bottom of a scrollable container."]
  },

  // --- 20 INTERMEDIATE Questions ---
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "Layout Thrashing Explained",
    difficulty: "INTERMEDIATE",
    questionType: "PERFORMANCE",
    question: "What is Layout Thrashing and how do you write code to prevent it?",
    shortAnswer: "Layout Thrashing occurs when JavaScript repeatedly alternates between writing DOM styles and reading layout dimensions in a tight loop, forcing the browser to recalculate layout on every single iteration.",
    detailedExplanation: "- **Interleaved Operations**: Write -> Read -> Write -> Read prevents the browser from batching layout updates.\n- **Batching Solution**: Perform all layout reads first, store values in variables, and then perform all style writes together.\n- **Libraries**: Tools like FastDOM automate batching reads and writes into scheduled animation frames.",
    codeExample: "// BAD (Causes layout thrashing - forced reflow on each loop iteration):\nitems.forEach(item => {\n  const width = container.offsetWidth; // READ (Forces layout calculation)\n  item.style.width = `${width}px`;     // WRITE (Invalidates layout)\n});\n\n// GOOD (Batched reads, followed by batched writes):\nconst targetWidth = container.offsetWidth; // 1 READ\nitems.forEach(item => {\n  item.style.width = `${targetWidth}px`;   // BATCHED WRITES\n});",
    interviewTips: ["Structure your answer around the golden rule: 'Separate Reads from Writes; Batch Reads First, Writes Second.'"]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "Reflow Triggers List",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "Which specific DOM and CSS properties force a synchronous layout recalculation when read?",
    shortAnswer: "Reading layout geometry properties forces synchronous reflow: `offsetWidth/Height`, `clientWidth/Height`, `scrollWidth/Height`, `offsetTop/Left`, `clientTop/Left`, `scrollTop/Left`, `getComputedStyle()`, and `getBoundingClientRect()`.",
    detailedExplanation: "- **Pending Changes**: If any DOM or style mutations occurred earlier in the frame, the browser must flush pending layouts immediately to return accurate numbers.\n- **Methods**: `element.focus()`, `element.scrollIntoView()`, and `window.scrollTo()` also trigger reflow flushes.\n- **Caching**: Always cache these read values in local variables instead of repeatedly querying them.",
    codeExample: "const el = document.querySelector('#sidebar');\n\n// Reading any of these forces an immediate synchronous layout calculation:\nconst h = el.offsetHeight;\nconst rect = el.getBoundingClientRect();\nconst styles = window.getComputedStyle(el).fontSize;",
    interviewTips: ["List at least four layout read properties: `offsetHeight`, `clientWidth`, `getBoundingClientRect`, and `getComputedStyle`."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "content-visibility: auto",
    difficulty: "INTERMEDIATE",
    questionType: "PERFORMANCE",
    question: "How does CSS content-visibility: auto dramatically accelerate initial DOM render times?",
    shortAnswer: "`content-visibility: auto` instructs the browser to skip layout and painting for elements that are currently off-screen until the user scrolls near them, speeding up initial rendering by up to 10x.",
    detailedExplanation: "- **Off-Screen Skipping**: The browser treats offscreen subtrees like empty boxes until they enter the viewport.\n- **contain-intrinsic-size**: Must be paired with `contain-intrinsic-size` to give off-screen elements an estimated placeholder height, preventing scrollbar jumping.\n- **Native Virtualization**: Provides near-native virtual scrolling benefits with pure CSS and zero JavaScript overhead.",
    codeExample: ".long-feed-article {\n  content-visibility: auto;\n  contain-intrinsic-size: 0 500px; /* Estimated height to keep scrollbar stable */\n}",
    interviewTips: ["Always mention pairing `content-visibility: auto` with `contain-intrinsic-size` to prevent scrollbar jumping."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "CSS Containment Property",
    difficulty: "INTERMEDIATE",
    questionType: "PERFORMANCE",
    question: "What is CSS containment (the contain property) and how does it optimize browser layout recalculations?",
    shortAnswer: "The `contain` property isolates an element's DOM subtree from the rest of the document, ensuring that layout or paint changes inside the element never trigger reflows in the outer document.",
    detailedExplanation: "- **contain: layout**: Guarantees that internal layout mutations don't affect elements outside its boundary.\n- **contain: paint**: Guarantees that child elements never visually overflow the boundary box, allowing the browser to skip painting if offscreen.\n- **contain: strict**: Combines `layout`, `paint`, and `size` containment for maximum optimization.",
    codeExample: ".widget-card {\n  /* Prevents changes inside card from causing reflow in parent page: */\n  contain: content;\n}",
    interviewTips: ["Mention CSS `contain` as a powerful tool for isolating high-frequency dashboard widgets from triggering page-wide reflows."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "Virtual DOM vs Real DOM Performance Realities",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    question: "Is the Virtual DOM fundamentally faster than the Real DOM?",
    shortAnswer: "No, direct Real DOM manipulation is inherently faster because the Virtual DOM is an abstraction layer that incurs memory overhead and diffing CPU cycles. The Virtual DOM provides declarative developer ergonomics, not raw speed.",
    detailedExplanation: "- **Overhead**: VDOM requires creating lightweight JavaScript objects on every render and running tree diffing algorithms.\n- **Optimal Manual DOM**: Hand-crafted DOM mutations targeting exact nodes are always faster than generic VDOM diffing.\n- **Why Frameworks Use VDOM**: VDOM offers consistent 'good enough' performance while providing a declarative, component-driven programming model.\n- **Modern Compilers**: Modern libraries like Svelte and SolidJS bypass VDOM completely, compiling directly to surgical Real DOM mutations.",
    codeExample: "// Hand-optimized Real DOM (Fastest - zero diffing overhead):\npriceSpan.textContent = `$${newPrice}`;\n\n// VDOM: Re-renders JSX tree -> creates new VNode -> diffs against old VNode -> updates DOM",
    interviewTips: ["Seniors stand out by acknowledging that VDOM is an ergonomic developer abstraction that adds diffing overhead, not magic speed."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "Mutating Off-Screen DOM Trees",
    difficulty: "INTERMEDIATE",
    questionType: "PERFORMANCE",
    question: "How does detaching an element from the DOM before performing hundreds of mutations improve performance?",
    shortAnswer: "Detaching an element (or cloning it offscreen) allows you to perform extensive DOM restructuring without triggering any reflows on the active document, re-inserting it once all operations are complete.",
    detailedExplanation: "- **Zero Document Reflows**: Changes made to detached elements never invalidate the active document layout tree.\n- **Pattern**: Detach element via `const parent = el.parentNode; parent.removeChild(el);`, apply complex mutations, then `parent.appendChild(el);`.\n- **Alternative**: Set `el.style.display = 'none'`, apply modifications (causes only 1 reflow to hide, 1 to show), then restore display.",
    codeExample: "const table = document.querySelector('#huge-table');\nconst parent = table.parentNode;\n\n// Detach from DOM:\nparent.removeChild(table);\n\n// Perform heavy mutations without document reflow:\nsortTableRows(table);\nreformatCells(table);\n\n// Re-insert into DOM:\nparent.appendChild(table);",
    interviewTips: ["Explain detaching the parent node or using `display: none` as classic techniques for complex multi-step table updates."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "HTML5 template Element Performance",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "Why is the HTML <template> element superior to hidden <div> tags for storing reusable DOM structures?",
    shortAnswer: "Content inside a `<template>` is inactive: scripts do not execute, images and audio do not load, and nodes are not rendered in the active DOM tree until cloned with `content.cloneNode(true)`.",
    detailedExplanation: "- **Resource Savings**: `<img src=\"large.jpg\">` inside `<div style=\"display:none\">` will still download the image over the network, whereas `<template>` will not download until instantiated.\n- **DocumentFragment**: The `.content` property of a `<template>` is a native `DocumentFragment`.\n- **XSS Protection**: Markup inside `<template>` is inert until explicitly activated.",
    codeExample: "<template id=\"row-template\">\n  <tr class=\"data-row\">\n    <td class=\"id\"></td>\n    <td class=\"name\"></td>\n  </tr>\n</template>\n\n<script>\nconst template = document.querySelector('#row-template');\nconst clone = template.content.cloneNode(true); // Fast clone!\nclone.querySelector('.name').textContent = 'Alice';\ndocument.querySelector('tbody').appendChild(clone);\n</script>",
    interviewTips: ["Key benefit: `<template>` prevents images, media, and scripts from executing until explicitly cloned."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "Pixel Pipeline: Composite Layers and z-index",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What causes the browser to create a new Compositing Layer for a DOM element?",
    shortAnswer: "Browsers create separate compositing layers for elements with 3D transforms (`translate3d`), CSS `will-change`, active CSS animations, `<video>` or `<canvas>` elements, or elements stacked above composite layers via `z-index`.",
    detailedExplanation: "- **Compositor Promotion**: Uploads element bitmap data to the GPU as an independent texture.\n- **Layer Squashing**: Browsers try to merge layers to conserve GPU memory, but excessive layers create overhead.\n- **Layer Explosion Bug**: High `z-index` elements on top of animated layers are also forced into separate GPU layers, exhausting mobile memory.",
    codeExample: "/* Forces browser to allocate a separate GPU compositing layer: */\n.floating-action-button {\n  transform: translateZ(0);\n  will-change: transform;\n}",
    interviewTips: ["Mention the 'Layer Explosion' phenomenon: overlapping elements inherit layer promotion, consuming massive GPU RAM."]
  },
  {
    topic: "Forms & Interactive Components",
    subtopic: "Simulating Custom Form Submissions with URLSearchParams",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you serialize an HTML form into a URL-encoded query string for GET requests or application/x-www-form-urlencoded endpoints?",
    shortAnswer: "Pass the `FormData` instance directly into the `URLSearchParams` constructor: `new URLSearchParams(new FormData(form)).toString()`.",
    detailedExplanation: "- **Clean Serialization**: Automatically handles percent-encoding for spaces, symbols, and special characters.\n- **No Loop Required**: Replaces manual string concatenation and `encodeURIComponent` loops.\n- **URL Query Updates**: Easily appended to URL objects for shareable search filter links.",
    codeExample: "const filterForm = document.querySelector('#filter-form');\n\nfunction getEncodedQueryString() {\n  const formData = new FormData(filterForm);\n  const params = new URLSearchParams(formData);\n  return params.toString(); // e.g. 'category=books&sort=price_asc&in_stock=true'\n}",
    interviewTips: ["Highlight `new URLSearchParams(new FormData(form)).toString()` as the cleanest modern one-liner for form serialization."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "requestIdleCallback for Non-Essential DOM Tasks",
    difficulty: "INTERMEDIATE",
    questionType: "PERFORMANCE",
    question: "What is window.requestIdleCallback() and when should it be used for DOM operations?",
    shortAnswer: "`window.requestIdleCallback(callback)` schedules background tasks to execute only during periods when the browser main thread is completely idle between frame renderings.",
    detailedExplanation: "- **Idle Period Budget**: Passes an `IdleDeadline` object exposing `deadline.timeRemaining()` indicating milliseconds left in the current idle frame.\n- **Use Cases**: Logging analytics, pre-rendering offscreen templates, and caching DOM elements without degrading input responsiveness.\n- **timeout Option**: Can specify `{ timeout: 2000 }` to force execution if the browser remains busy.",
    codeExample: "window.requestIdleCallback((deadline) => {\n  while (deadline.timeRemaining() > 0 && tasksQueue.length > 0) {\n    processNextAnalyticsEntry(tasksQueue.shift());\n  }\n}, { timeout: 2000 });",
    interviewTips: ["Distinguish: `requestAnimationFrame` runs before the next frame paint; `requestIdleCallback` runs during downtime after paints."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "Debouncing High-Frequency DOM Events",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you implement a debounce function to limit DOM re-renders during window resize or input typing?",
    shortAnswer: "Wrap the handler in a closure that resets a `setTimeout` timer on every trigger, executing the actual DOM update only after events have ceased for the specified delay.",
    detailedExplanation: "- **Event Flooding**: `resize` and `scroll` can fire dozens of times per second, overloading DOM layouts.\n- **Debounce Mechanism**: Defers execution until user activity pauses for a cooldown window (e.g. 250ms).\n- **Contrast with Throttle**: Debounce waits for silence; throttle guarantees execution at fixed intervals.",
    codeExample: "function debounce(func, delay = 250) {\n  let timeoutId;\n  return (...args) => {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => func(...args), delay);\n  };\n}\n\nwindow.addEventListener('resize', debounce(() => {\n  console.log('Window resized: updating layout');\n  recalculateLayout();\n}, 300));",
    interviewTips: ["Be ready to code a debounce function from scratch on a whiteboard during frontend interviews."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "Throttling DOM Scroll Events",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How does a throttle function work and why is it preferred over debounce for scroll progress indicators?",
    shortAnswer: "A throttle function guarantees that the callback is executed at most once every specified time interval, providing continuous feedback while preventing event handler saturation.",
    detailedExplanation: "- **Continuous Updates**: Progress bars and infinite scroll require continuous updates during scrolling, which debounce fails to provide.\n- **Execution Frequency**: E.g. Throttling at 100ms guarantees at most 10 executions per second.\n- **rAF Alternative**: Using `requestAnimationFrame` flags is often even cleaner than time-based throttling for visual updates.",
    codeExample: "function throttle(func, limit = 100) {\n  let inThrottle = false;\n  return (...args) => {\n    if (!inThrottle) {\n      func(...args);\n      inThrottle = true;\n      setTimeout(() => inThrottle = false, limit);\n    }\n  };\n}\n\nwindow.addEventListener('scroll', throttle(() => {\n  updateScrollProgressBar();\n}, 50));",
    interviewTips: ["Remember: Debounce executes after activity stops; Throttle executes regularly at capped intervals."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "requestAnimationFrame Scroll Throttling Pattern",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you throttle scroll or mousemove DOM updates using requestAnimationFrame?",
    shortAnswer: "Set a boolean flag `let ticking = false` in the event handler, schedule a `requestAnimationFrame` on the first event, and reset the flag inside the rAF callback.",
    detailedExplanation: "- **Frame Rate Alignment**: Locks DOM updates directly to screen refresh rate (60fps/120fps).\n- **Zero Wasted Cycles**: Eliminates timer drift associated with `setTimeout` throttles.\n- **Native Efficiency**: Browser skips rAF automatically if the tab is inactive.",
    codeExample: "let isTicking = false;\n\nwindow.addEventListener('scroll', () => {\n  if (!isTicking) {\n    window.requestAnimationFrame(() => {\n      updateScrollIndicator(window.scrollY);\n      isTicking = false;\n    });\n    isTicking = true;\n  }\n}, { passive: true });",
    interviewTips: ["Highlight this 'rAF ticking flag' pattern as the cleanest way to throttle scroll/resize handlers without utility libraries."]
  },
  {
    topic: "Forms & Interactive Components",
    subtopic: "Handling Form Input Types (date, number, color)",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do valueAsNumber and valueAsDate properties work on HTML5 inputs?",
    shortAnswer: "`valueAsNumber` returns the input's value as a JavaScript `number` (or `NaN`), while `valueAsDate` returns a JavaScript `Date` object (or `null`), avoiding manual string parsing.",
    detailedExplanation: "- **Avoids parseFloat**: Calling `input.valueAsNumber` on `<input type=\"number\">` directly yields a number primitive.\n- **Date Object**: `input.valueAsDate` on `<input type=\"date\">` returns a UTC `Date` instance.\n- **Type Safety**: Avoids string concatenation bugs like `'10' + 5 = '105'`.",
    codeExample: "const ageInput = document.querySelector('input[type=\"number\"]');\nconst birthdayInput = document.querySelector('input[type=\"date\"]');\n\n// Direct number primitive (no parseInt required):\nconsole.log(typeof ageInput.valueAsNumber); // 'number'\n\n// Direct Date object:\nconsole.log(birthdayInput.valueAsDate instanceof Date); // true",
    interviewTips: ["Mention `valueAsNumber` and `valueAsDate` as modern type-safe alternatives to parsing strings."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "Optimizing Large Lists with DOM Recycling",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is DOM recycling in virtualized lists (virtual scrolling) and why is it necessary for 100,000 items?",
    shortAnswer: "DOM recycling renders only the small subset of elements visible in the viewport (~20 items), repositioning and reusing the same DOM nodes with new data as the user scrolls rather than creating 100,000 nodes.",
    detailedExplanation: "- **Memory Protection**: 100,000 DOM nodes consume hundreds of megabytes of RAM and bog down browser tree traversals.\n- **Constant Node Count**: Total DOM nodes remain constant regardless of data set size.\n- **Transform Positioning**: Uses `transform: translateY(...)` on recycled row containers to place them at correct virtual scroll offsets.",
    codeExample: "// Virtual list concept:\nconst TOTAL_ITEMS = 100000;\nconst VISIBLE_COUNT = 20;\nconst ROW_HEIGHT = 40;\n\n// Only 20 <tr> elements ever exist in the DOM!\nfunction renderWindow(scrollTop) {\n  const startIndex = Math.floor(scrollTop / ROW_HEIGHT);\n  // Populate the 20 pooled elements with items[startIndex ... startIndex + 20]\n}",
    interviewTips: ["Explain that DOM node creation is memory-heavy, so recycling a pool of 20 elements is key to handling massive data sets."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "FastDOM Read/Write Batching Architecture",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "How does the FastDOM library eliminate layout thrashing under the hood?",
    shortAnswer: "FastDOM maintains separate internal queues for DOM reads (`fastdom.measure`) and DOM writes (`fastdom.mutate`), executing all reads together before executing all writes in the next animation frame.",
    detailedExplanation: "- **Measure Phase**: All tasks scheduled via `measure()` run sequentially during a clean read-only phase.\n- **Mutate Phase**: All tasks scheduled via `mutate()` run immediately after, batching all writes together.\n- **Single Reflow**: Enforces a single layout calculation per animation frame, regardless of how many components request reads and writes.",
    codeExample: "// FastDOM ensures reads run first, writes run second:\nfastdom.measure(() => {\n  const height = card.offsetHeight; // Read queued\n  fastdom.mutate(() => {\n    card.style.height = `${height * 2}px`; // Write queued for next phase\n  });\n});",
    interviewTips: ["Mention FastDOM's separation of 'measure' and 'mutate' queues as the architectural model for layout batching."]
  },
  {
    topic: "Forms & Interactive Components",
    subtopic: "Custom Select Component Accessibility Essentials",
    difficulty: "INTERMEDIATE",
    questionType: "ACCESSIBILITY",
    question: "What ARIA attributes and keyboard events are mandatory when replacing a native <select> with a custom DOM dropdown?",
    shortAnswer: "The trigger needs `role=\"combobox\"`, `aria-haspopup=\"listbox\"`, and `aria-expanded`; the options container needs `role=\"listbox\"`; options need `role=\"option\"` and `aria-selected`; and keyboard navigation must support Arrow keys, Enter, and Escape.",
    detailedExplanation: "- **aria-expanded**: Must toggle between `'true'` and `'false'` as the menu opens/closes.\n- **aria-activedescendant**: Points to the ID of the currently focused option to avoid shifting real DOM focus.\n- **Keyboard Support**: Up/Down arrows to navigate, Enter/Space to select, Esc to close and return focus to trigger.",
    codeExample: "<!-- Accessible Custom Combobox Structure: -->\n<div role=\"combobox\" aria-expanded=\"false\" aria-haspopup=\"listbox\" tabindex=\"0\" id=\"combo\">\n  Select option\n</div>\n<ul role=\"listbox\" id=\"list\" hidden>\n  <li role=\"option\" aria-selected=\"false\" id=\"opt-1\">Option 1</li>\n  <li role=\"option\" aria-selected=\"false\" id=\"opt-2\">Option 2</li>\n</ul>",
    interviewTips: ["Always list the ARIA roles (`combobox`, `listbox`, `option`) and keyboard arrow navigation when asked about custom dropdowns."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "Preventing Layout Shift (CLS) on Dynamic Elements",
    difficulty: "INTERMEDIATE",
    questionType: "PERFORMANCE",
    question: "How do you prevent Cumulative Layout Shift (CLS) when loading dynamic DOM content and images?",
    shortAnswer: "Reserve layout space in advance by specifying explicit `width` and `height` attributes or CSS `aspect-ratio` on containers and skeleton placeholders before dynamic content loads.",
    detailedExplanation: "- **Explicit Aspect Ratio**: Setting `aspect-ratio: 16 / 9` on image wrappers holds the exact space before image bytes arrive.\n- **Skeleton Placeholders**: Render sized placeholder skeletons instead of inserting elements from 0px height.\n- **Web Fonts**: Use `font-display: swap` paired with font metric overrides (`size-adjust`) to avoid layout jumps when fonts load.",
    codeExample: "/* Prevents layout shift while hero image downloads: */\n.hero-banner-container {\n  width: 100%;\n  aspect-ratio: 16 / 9;\n  background-color: #f1f5f9; /* Skeleton background placeholder */\n}",
    interviewTips: ["Tie layout shifts directly to Google's Core Web Vitals metric: CLS (Cumulative Layout Shift)."]
  },
  {
    topic: "Forms & Interactive Components",
    subtopic: "Handling Form Enter Key in Single vs Multi-Input Forms",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "Why does pressing Enter in a single text input submit the form automatically, and how do you customize this behavior?",
    shortAnswer: "The HTML specification mandates 'implicit submission': if a form contains exactly one text field, pressing Enter submits it automatically even without a submit button. Intercept this by calling `event.preventDefault()` in `keydown`.",
    detailedExplanation: "- **Implicit Submission Spec**: Designed so simple single-field search forms work with Enter without needing visible submit buttons.\n- **Multi-Input Forms**: In forms with multiple inputs, pressing Enter activates the first button with `type=\"submit\"` in tree order.\n- **Preventing Accidental Submissions**: In multi-step wizards, prevent Enter keydown on inputs unless on the final step.",
    codeExample: "form.addEventListener('keydown', (e) => {\n  if (e.key === 'Enter' && e.target.tagName === 'INPUT') {\n    // Prevents accidental form submission on Enter:\n    e.preventDefault();\n    moveToNextStep();\n  }\n});",
    interviewTips: ["Mention HTML's 'implicit submission' rule for single-input forms as a key browser specification detail."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "insertAdjacentElement vs appendChild Performance",
    difficulty: "INTERMEDIATE",
    questionType: "PERFORMANCE",
    question: "How does insertAdjacentElement compare to appendChild in versatility and speed?",
    shortAnswer: "`insertAdjacentElement()` provides four precise insertion targets (`beforebegin`, `afterbegin`, `beforeend`, `afterend`) directly on the target element, performing at comparable high speeds to `appendChild`.",
    detailedExplanation: "- **Target Flexibility**: `appendChild()` can only insert at the end of children. `insertAdjacentElement('beforebegin', el)` inserts as a previous sibling without accessing `parentNode`.\n- **No HTML Parsing**: Takes an existing DOM element directly (unlike `insertAdjacentHTML`, which parses string markup).\n- **High Performance**: Native C++ node insertion without string tokenization.",
    codeExample: "const card = document.querySelector('.card');\nconst badge = document.createElement('span');\nbadge.className = 'badge';\nbadge.textContent = 'New';\n\n// Inserts badge immediately BEFORE the card in the DOM tree:\ncard.insertAdjacentElement('beforebegin', badge);",
    interviewTips: ["List the 4 positions for `insertAdjacentElement`: `beforebegin`, `afterbegin`, `beforeend`, `afterend`."]
  },

  // --- 10 DIFFICULT Questions ---
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "Painting Profiler & Chrome DevTools Rendering Tab",
    difficulty: "DIFFICULT",
    questionType: "PERFORMANCE",
    question: "How do you identify unnecessary repaints and reflows using Chrome DevTools?",
    shortAnswer: "Open Chrome DevTools -> More Tools -> Rendering, and enable 'Paint Flashing' (highlights repainted areas in green) and 'Layout Shift Regions' (highlights reflow shifts in blue).",
    detailedExplanation: "- **Paint Flashing**: Green flashes reveal which rectangular regions of the screen are repainting. Ideal UI should only flash modified elements, not entire pages.\n- **Layer Borders**: Visualizes GPU compositing layers with orange/cyan outlines to spot layer explosion.\n- **Performance Tab**: Records frame-by-frame breakdowns of Recalculate Style, Layout, Paint, and Composite Layers.",
    codeExample: "// Diagnosing layout cost in console:\nconsole.time('heavy-dom-operation');\nperformBulkDomUpdate();\nconsole.timeEnd('heavy-dom-operation');",
    interviewTips: ["Demonstrate senior troubleshooting expertise by referencing DevTools 'Paint Flashing' and 'Layer Borders'."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "CSS Subtree Containment & Style Invalidation",
    difficulty: "DIFFICULT",
    questionType: "PERFORMANCE",
    question: "How does the browser engine determine the scope of style invalidation when a CSS class is toggled on a DOM node?",
    shortAnswer: "The browser invalidates the computed styles of the mutated element and any descendant elements matching selector rules; if the selector affects siblings or ancestors (e.g. `+`, `~`, or `:has()`), wider invalidation cascades across the tree.",
    detailedExplanation: "- **Selector Complexity**: Complex combinators (e.g. `.dark-mode *` or `:has(.invalid)`) force the engine to re-evaluate styles across vast portions of the DOM.\n- **BEM Benefits**: Flat, single-class selectors (like `.btn--active`) limit style invalidation to the single element and its immediate children.\n- **Modern :has() Engine**: Browsers use bloom filters and dependency graphs to optimize `:has()`, but deeply nested ancestor checks still carry invalidation costs.",
    codeExample: "/* High invalidation cost (affects thousands of descendant nodes): */\nbody.theme-dark * { color: #fff; }\n\n/* Low invalidation cost (targeted class mutation): */\n.theme-dark { color: #fff; }",
    interviewTips: ["Explain why flat class architectures like BEM are performance optimizations for the browser's style invalidation engine."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "CSS Houdini Paint API and DOM Rendering",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "What is the CSS Houdini Paint API and how does it hook directly into the browser's render pipeline?",
    shortAnswer: "The CSS Paint API allows developers to write JavaScript PaintWorklets that draw custom vector graphics directly into an element's background or border during the browser's native Paint phase.",
    detailedExplanation: "- **Direct Pipeline Hook**: Runs in a Worklet thread off the main thread, bypassing DOM tree node creation entirely.\n- **No Extra Nodes**: Renders custom shapes, patterns, and dynamic ripples without injecting extra wrapper `<div>` or `<canvas>` elements into the DOM.\n- **CSS Integration**: Invoked via `background-image: paint(myPainterName)` in standard CSS.",
    codeExample: "// Registered in a paint worklet file (paint-worklet.js):\nclass BubblePainter {\n  paint(ctx, geometry, properties) {\n    ctx.fillStyle = '#3b82f6';\n    ctx.fillRect(0, 0, geometry.width, geometry.height);\n  }\n}\nregisterPaint('bubble-bg', BubblePainter);",
    interviewTips: ["Highlight Houdini as an API that hooks directly into the browser's C++ rendering engine without touching DOM nodes."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "OffscreenCanvas and DOM Decoupling",
    difficulty: "DIFFICULT",
    questionType: "PERFORMANCE",
    question: "How does OffscreenCanvas allow heavy rendering to occur off the main DOM thread?",
    shortAnswer: "`OffscreenCanvas` allows canvas rendering contexts to be transferred to a Web Worker via `canvas.transferControlToOffscreen()`, executing heavy graphic rendering without blocking the main DOM thread.",
    detailedExplanation: "- **Main Thread Protection**: Keeps 60fps UI responsiveness, scrolling, and clicks lag-free while rendering complex charts or 3D scenes in a background worker.\n- **Zero DOM Access in Worker**: Workers have no DOM access, but `OffscreenCanvas` renders pixels directly to the canvas element's buffer.\n- **Synchronization**: Browser synchronizes the worker's rendered frames automatically with the display refresh rate.",
    codeExample: "const canvas = document.querySelector('#heavy-chart');\nconst offscreen = canvas.transferControlToOffscreen();\n\nconst worker = new Worker('chart-worker.js');\n// Sends canvas control to worker thread:\nworker.postMessage({ canvas: offscreen }, [offscreen]);",
    interviewTips: ["Mention `OffscreenCanvas` as the ultimate architecture for high-concurrency data visualization on the web."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "Document Timeline & Web Animations API (WAAPI)",
    difficulty: "DIFFICULT",
    questionType: "CODE",
    question: "How does the Web Animations API (element.animate()) compare to CSS transitions and requestAnimationFrame in performance?",
    shortAnswer: "The Web Animations API executes directly on the browser's compositor thread (for transform and opacity), providing JavaScript programmatic control (play, pause, reverse, finish) without running rAF loops on the main thread.",
    detailedExplanation: "- **Native Threading**: Runs on the compositor thread just like pure CSS animations.\n- **Promise Integration**: Returns an `Animation` object with an `animation.finished` Promise.\n- **Dynamic Values**: Unlike CSS keyframes which are static, WAAPI allows injecting dynamic runtime coordinate values directly into keyframe arrays.",
    codeExample: "const card = document.querySelector('.card');\n\nconst animation = card.animate([\n  { transform: 'translateY(0px)', opacity: 1 },\n  { transform: `translateY(${targetY}px)`, opacity: 0 }\n], {\n  duration: 400,\n  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',\n  fill: 'forwards'\n});\n\n// Await animation completion:\nanimation.finished.then(() => card.remove());",
    interviewTips: ["Highlight `element.animate()` as having the performance of CSS animations combined with the programmatic control of JavaScript."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "Fine-Grained DOM Reactivity without Virtual DOM",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "How do modern signals-based reactivity engines (SolidJS, Svelte 5, Angular Signals) update the DOM without Virtual DOM diffing?",
    shortAnswer: "They compile reactive expressions into granular subscriber functions that bind directly to exact DOM Text nodes or element properties; when a signal mutates, only the single affected DOM node is updated surgically.",
    detailedExplanation: "- **Direct Pointer Binding**: The compiler links a reactive signal directly to `textNode.data = newText`.\n- **Zero Component Re-renders**: Components run once to set up the DOM graph and never re-execute.\n- **No Diffing**: Skips creating virtual tree objects and comparing snapshots, yielding faster updates and lower memory footprint.",
    codeExample: "// Compiled Signal update under the hood:\nconst textNode = document.createTextNode(count());\ncreateEffect(() => {\n  // Surgical update: Only this single text node is touched!\n  textNode.data = count();\n});",
    interviewTips: ["Explain the shift in modern frontend architecture from VDOM diffing to fine-grained signals with direct DOM node updates."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "Memory Leak from Retained Detached Event Closures",
    difficulty: "DIFFICULT",
    questionType: "PERFORMANCE",
    question: "Explain how a closure inside an addEventListener callback can accidentally retain an entire large dataset in memory even after the DOM element is removed.",
    shortAnswer: "If an event listener callback references a variable in its enclosing lexical scope, the entire scope object (and all variables within it, including large arrays) is retained in memory as long as the listener or element reference survives.",
    detailedExplanation: "- **Lexical Environment Retention**: JavaScript engines retain the shared scope context for closures.\n- **Global/Window Listeners**: If `window.addEventListener('resize', () => { el.doSomething(hugeData); })` is created, `hugeData` and `el` are permanently pinned in memory.\n- **Resolution**: Clear closures, unregister listeners with `removeEventListener` or `AbortSignal`, and set references to `null`.",
    codeExample: "function setupTelemetry(element) {\n  const hugeDataset = new Array(1000000).fill('sensor-data');\n  \n  // LEAK: Listener attached to window retains hugeDataset forever!\n  window.addEventListener('scroll', () => {\n    if (element.isConnected) {\n      console.log('Active sensor:', hugeDataset[0]);\n    }\n  });\n}",
    interviewTips: ["Point out that the closure retains ALL variables in the scope, not just the single variable you meant to read."]
  },
  {
    topic: "Forms & Interactive Components",
    subtopic: "Custom Form Controls and Accesskeys/Shortcut Collisions",
    difficulty: "DIFFICULT",
    questionType: "ACCESSIBILITY",
    question: "Why is the HTML accesskey attribute generally avoided in modern web applications?",
    shortAnswer: "The `accesskey` attribute frequently conflicts with operating system shortcuts, browser menu hotkeys, and assistive screen reader key commands, causing unpredictable behavior across platforms.",
    detailedExplanation: "- **Platform Discrepancies**: Accesskey triggers differently on Chrome (Alt+Key on Windows, Ctrl+Alt+Key on Mac) vs Firefox.\n- **Screen Reader Clashes**: Directly overwrites screen reader navigation commands (e.g. JAWS, NVDA table reading shortcuts).\n- **Modern Alternative**: Custom keyboard listeners with clear visual indicators (e.g. `Cmd+K` command bars) with explicit collision checks.",
    codeExample: "<!-- Problematic (conflicts with browser and screen reader keys): -->\n<!-- <button accesskey=\"s\">Save</button> -->\n\n<!-- Recommended: Explicit documented keyboard shortcut with modifier check: -->\nwindow.addEventListener('keydown', (e) => {\n  if ((e.ctrlKey || e.metaKey) && e.key === 's') {\n    e.preventDefault();\n    saveDocument();\n  }\n});",
    interviewTips: ["Cite screen reader hotkey collisions as the primary reason why accessibility experts avoid `accesskey`."]
  },
  {
    topic: "DOM Performance, Reflow & Repaint",
    subtopic: "Layout Instability API and CLS Calculation",
    difficulty: "DIFFICULT",
    questionType: "PERFORMANCE",
    question: "How does the Layout Instability API measure layout shifts programmatically in the browser?",
    shortAnswer: "Using a `PerformanceObserver` observing `'layout-shift'` entries, which report `entry.value`, `entry.hadRecentInput`, and `entry.sources` identifying which DOM nodes moved unexpectedly.",
    detailedExplanation: "- **hadRecentInput**: Layout shifts occurring within 500ms of user input (click, keystroke) are excluded from CLS penalties.\n- **entry.sources**: Returns an array of `LayoutShiftAttribution` objects showing the affected DOM nodes and previous/current bounding rects.\n- **Core Web Vitals**: Powers Google's CLS monitoring in production monitoring scripts.",
    codeExample: "const observer = new PerformanceObserver((list) => {\n  for (const entry of list.getEntries()) {\n    if (!entry.hadRecentInput) {\n      console.log('Layout shift detected! Score:', entry.value);\n      console.log('Shifting DOM node:', entry.sources[0]?.node);\n    }\n  }\n});\nobserver.observe({ type: 'layout-shift', buffered: true });",
    interviewTips: ["Highlight `hadRecentInput`—shifts caused by deliberate user clicks are ignored by the CLS scoring algorithm."]
  },
  {
    topic: "Forms & Interactive Components",
    subtopic: "File API Stream Processing with ReadableStream",
    difficulty: "DIFFICULT",
    questionType: "CODE",
    question: "How do you process a multi-gigabyte file selected via <input type=\"file\"> without crashing browser memory?",
    shortAnswer: "Read the file as a stream via `file.stream()`, processing data chunks incrementally using a `ReadableStreamDefaultReader` rather than loading the entire file into memory with `file.text()`.",
    detailedExplanation: "- **Memory Overload**: Calling `file.text()` or `file.arrayBuffer()` on a 2GB file will crash the browser tab with an Out-Of-Memory error.\n- **Streaming Architecture**: `file.stream()` streams chunks (Uint8Arrays) into memory one buffer at a time.\n- **Progressive Upload**: Allows streaming chunks over HTTP using fetch streams or computing SHA-256 hashes incrementally.",
    codeExample: "const fileInput = document.querySelector('input[type=\"file\"]');\n\nfileInput.addEventListener('change', async () => {\n  const file = fileInput.files[0];\n  const stream = file.stream();\n  const reader = stream.getReader();\n  \n  let bytesRead = 0;\n  while (true) {\n    const { done, value } = await reader.read();\n    if (done) break;\n    bytesRead += value.length;\n    console.log(`Streamed ${bytesRead} of ${file.size} bytes`);\n  }\n});",
    interviewTips: ["Contrast `file.stream()` with `file.text()` to explain how to handle gigabyte-sized files safely in frontend code."]
  }
];
