// scripts/dom-gen/questions-part-a.cjs
// Questions covering:
// - Content & Text Manipulation (continued)
// - Attributes & Dataset (continued)
// - Styles, Classes & CSS OM
// - Event System & Propagation (addEventListener, bubbling, capturing, stopPropagation, preventDefault, event delegation)
// - Event Types: Mouse, Keyboard, Input, Change, Focus, Blur

module.exports = [
  // --- Attributes & Dataset (Continued) ---
  {
    topic: "Attributes & Dataset",
    subtopic: "getAttributeNames",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you retrieve an array of all attribute names present on an element?",
    shortAnswer: "Call `element.getAttributeNames()`, which returns an array of strings representing all attribute names on the element.",
    detailedExplanation: "- **Modern API**: Cleaner alternative to iterating over `element.attributes`.\n- **Array Return**: Returns a true JavaScript `Array`, so `.map()` and `.filter()` work immediately.\n- **Case Sensitivity**: In HTML, returned attribute names are in lowercase.",
    codeExample: "const btn = document.querySelector('button');\nconst names = btn.getAttributeNames();\nconsole.log('Attributes present:', names); // ['id', 'class', 'disabled', 'data-action']",
    interviewTips: ["Mention `getAttributeNames()` as the cleanest modern method for listing attribute names."]
  },
  {
    topic: "Attributes & Dataset",
    subtopic: "Boolean Attributes: disabled",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What is the proper way to disable and enable an HTML button using JavaScript?",
    shortAnswer: "Set the boolean property `button.disabled = true` to disable it, and `button.disabled = false` to enable it.",
    detailedExplanation: "- **Boolean Property**: Modifying the `.disabled` property is direct, fast, and type-safe.\n- **Attribute Sync**: Setting `.disabled = true` automatically reflects in the DOM as the `disabled` attribute.\n- **Form Submission**: Disabled buttons and form fields are skipped during native form submission.",
    codeExample: "const submitBtn = document.querySelector('#submit-btn');\n// Disabling:\nsubmitBtn.disabled = true;\nsubmitBtn.textContent = 'Submitting...';\n\n// Re-enabling:\nsubmitBtn.disabled = false;\nsubmitBtn.textContent = 'Submit';",
    interviewTips: ["Always use `.disabled = true/false` rather than `setAttribute('disabled', '...')`."]
  },
  {
    topic: "Attributes & Dataset",
    subtopic: "Custom Non-Data Attributes",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "Why should custom element attributes always be prefixed with 'data-' instead of arbitrary names?",
    shortAnswer: "Using the `data-*` prefix conforms to HTML5 standards, avoids name collisions with future HTML specifications, and provides programmatic access via the `element.dataset` API.",
    detailedExplanation: "- **Standards Conformance**: Arbitrary non-standard attributes make HTML invalid according to W3C validators.\n- **Collision Avoidance**: If you invent `element.state`, future browser updates introducing a native `state` attribute will break your site.\n- **Native API**: Only attributes starting with `data-` are mapped automatically into `element.dataset`.",
    codeExample: "<!-- Bad (non-standard): <div user-role=\"editor\"> -->\n<!-- Good (valid HTML5): <div data-user-role=\"editor\"> -->\nconst div = document.querySelector('div');\nconsole.log(div.dataset.userRole); // 'editor'",
    interviewTips: ["Mention avoiding collision with future HTML standards and automatic `dataset` mapping as the two core reasons."]
  },
  {
    topic: "Attributes & Dataset",
    subtopic: "Dataset Coercion",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "How does dataset handle boolean and numeric values assigned in JavaScript?",
    shortAnswer: "All values assigned to `dataset` are automatically coerced to strings, meaning `dataset.count = 42` becomes string `'42'` and `dataset.active = false` becomes string `'false'`.",
    detailedExplanation: "- **String Coercion**: HTML attributes can only store strings in DOM storage.\n- **Truthiness Trap**: `dataset.active = false` creates `data-active=\"false\"`. In JavaScript, `if (el.dataset.active)` evaluates to `true` because the non-empty string `'false'` is truthy!\n- **Parsing Required**: Always parse values: `Number(el.dataset.count)` or `el.dataset.active === 'true'`.",
    codeExample: "const card = document.querySelector('.card');\ncard.dataset.active = false;\n\n// TRAP: 'false' is truthy in JavaScript!\nif (card.dataset.active) {\n  console.log('This runs because \"false\" is a non-empty string!');\n}\n\n// Correct check:\nconst isActive = card.dataset.active === 'true';",
    interviewTips: ["This is a classic senior interview gotcha: `dataset.active = false` produces the string `'false'`, which is truthy!"]
  },
  {
    topic: "Attributes & Dataset",
    subtopic: "classList.replace Method",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you replace an existing CSS class with a new class using classList.replace()?",
    shortAnswer: "Call `element.classList.replace(oldClass, newClass)`, which replaces `oldClass` with `newClass` and returns `true` if `oldClass` was found, or `false` otherwise.",
    detailedExplanation: "- **Atomic Replacement**: Swaps classes in a single step without intermediate layout flashes.\n- **Boolean Return**: Returns `true` if `oldClass` existed and was replaced; returns `false` if `oldClass` was not present.\n- **Safe**: If `oldClass` is absent, the element's class list remains untouched (newClass is not added).",
    codeExample: "const banner = document.querySelector('.banner');\n// Replaces 'banner-warning' with 'banner-success':\nconst replaced = banner.classList.replace('banner-warning', 'banner-success');\nconsole.log('Was replaced:', replaced);",
    interviewTips: ["Highlight that `replace()` returns a boolean indicating whether the replacement actually occurred."]
  },
  {
    topic: "Attributes & Dataset",
    subtopic: "classList.entries and Iteration",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you iterate through all classes on an element using classList?",
    shortAnswer: "Iterate directly over `element.classList` using a `for...of` loop or the built-in `.forEach()` method.",
    detailedExplanation: "- **Iterable DOMTokenList**: `classList` implements the Iterable protocol.\n- **`for...of`**: Natural syntax for looping over individual class name strings.\n- **Spread Operator**: `[...element.classList]` creates an array of class name strings.",
    codeExample: "const box = document.querySelector('#modal');\nfor (const className of box.classList) {\n  console.log('Class:', className);\n}\n\n// Spread to array:\nconst classesArray = [...box.classList];",
    interviewTips: ["State that `DOMTokenList` is iterable, enabling `for...of` and `forEach`."]
  },
  {
    topic: "Styles, Classes & CSS OM",
    subtopic: "style.cssText vs individual styles",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "When should you use element.style.cssText instead of setting individual style properties?",
    shortAnswer: "Use `element.style.cssText` when setting multiple inline styles simultaneously to trigger a single CSS OM mutation instead of multiple individual property updates.",
    detailedExplanation: "- **Batch Update**: Replaces all inline styles in one statement: `el.style.cssText = 'color: red; opacity: 0.5;'`.\n- **Overwrites Existing**: Warning: Completely wipes out existing inline styles unless appended with `+=`.\n- **Cleaner Alternative**: Modern web design generally prefers adding a predefined CSS class via `classList.add()` instead of heavy inline styling.",
    codeExample: "const tooltip = document.querySelector('.tooltip');\n// Set multiple styles at once:\ntooltip.style.cssText = 'position: absolute; top: 100px; left: 50px; z-index: 1000;';",
    interviewTips: ["Point out that while `cssText` is good for batching, adding a CSS class is usually even better architecture."]
  },
  {
    topic: "Styles, Classes & CSS OM",
    subtopic: "Units in style property",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What happens if you assign a numeric value without unit string to a CSS length property like element.style.width?",
    shortAnswer: "In standard mode, assigning a unitless number (e.g. `el.style.width = 100`) is invalid CSS and is ignored by the browser, failing silently.",
    detailedExplanation: "- **Unit Required**: CSS length properties require explicit units: `'100px'`, `'50%'`, `'2rem'`.\n- **Silent Failure**: The browser's CSS parser drops invalid declarations without throwing a JavaScript error.\n- **Exceptions**: Unitless CSS properties like `zIndex`, `opacity`, `flexGrow`, and `lineHeight` accept raw numbers.",
    codeExample: "const box = document.querySelector('.box');\n// Bad (ignored in Standards mode):\nbox.style.width = 200;\n\n// Good:\nbox.style.width = '200px';\n\n// Unitless property (valid):\nbox.style.opacity = 0.8;",
    interviewTips: ["Clarify that length properties require units ('px'), while unitless properties (`opacity`, `zIndex`) accept numbers."]
  },
  {
    topic: "Styles, Classes & CSS OM",
    subtopic: "getBoundingClientRect API",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What does element.getBoundingClientRect() return and what viewport coordinate system does it use?",
    shortAnswer: "It returns a `DOMRect` object providing the element's size and its position relative to the top-left corner of the current viewport.",
    detailedExplanation: "- **Properties**: Returns `top`, `right`, `bottom`, `left`, `width`, `height`, `x`, and `y`.\n- **Viewport Relative**: Values change as the user scrolls because coordinates are measured relative to the visible screen viewport.\n- **Page Offset**: To find position relative to the entire document, add scroll offsets: `rect.top + window.scrollY`.\n- **Reflow Trigger**: Reading `getBoundingClientRect()` forces a synchronous browser layout reflow.",
    codeExample: "const btn = document.querySelector('#buy-btn');\nconst rect = btn.getBoundingClientRect();\n\nconsole.log('Button width:', rect.width);\nconsole.log('Distance from viewport top:', rect.top);\nconsole.log('Absolute page top:', rect.top + window.scrollY);",
    interviewTips: ["Emphasize that coordinates are viewport-relative, so add `window.scrollY` and `window.scrollX` for document-relative coordinates."]
  },
  {
    topic: "Styles, Classes & CSS OM",
    subtopic: "offsetWidth vs clientWidth vs scrollWidth",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is the difference between clientWidth, offsetWidth, and scrollWidth?",
    shortAnswer: "`clientWidth` includes content and padding excluding scrollbars; `offsetWidth` includes content, padding, borders, and scrollbars; and `scrollWidth` includes the total scrollable content width.",
    detailedExplanation: "- **`clientWidth`**: Content + padding (excludes scrollbar and borders).\n- **`offsetWidth`**: Content + padding + borders + vertical scrollbar (visual footprint).\n- **`scrollWidth`**: Total width of element content including overflow content hidden off-screen.\n- **Scrollable Check**: If `element.scrollWidth > element.clientWidth`, the element has horizontal overflow.",
    codeExample: "const panel = document.querySelector('.scrollable-panel');\nconsole.log('Visible inner width:', panel.clientWidth);\nconsole.log('Full box width (with border):', panel.offsetWidth);\nconsole.log('Total scrollable content width:', panel.scrollWidth);",
    interviewTips: ["Remember: `clientWidth` = padding + content; `offsetWidth` = padding + content + borders + scrollbar."]
  },

  // --- Event System & Propagation (Core) ---
  {
    topic: "Event System & Propagation",
    subtopic: "addEventListener Basics",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you attach an event listener to an element in JavaScript?",
    shortAnswer: "Call `element.addEventListener('eventType', handlerFunction, [options])`.",
    detailedExplanation: "- **Event Type**: Name of the event string without 'on' prefix (`'click'`, `'keydown'`, `'submit'`).\n- **Callback**: Function invoked when the event occurs, receiving an `Event` object as its first parameter.\n- **Multiple Listeners**: Multiple distinct functions can be attached to the same event on the same element.\n- **Options**: Optional third argument can configure `{ capture, once, passive, signal }`.",
    codeExample: "const btn = document.querySelector('#action-btn');\nbtn.addEventListener('click', (event) => {\n  console.log('Clicked element:', event.target);\n});",
    interviewTips: ["Never prefix event names with 'on' inside `addEventListener` (use `'click'`, not `'onclick'`)."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "addEventListener Options Object",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What configuration properties can be passed in the options object of addEventListener?",
    shortAnswer: "The options object accepts `capture` (boolean), `once` (boolean), `passive` (boolean), and `signal` (AbortSignal).",
    detailedExplanation: "- **`capture`**: If `true`, the handler fires during the capturing phase instead of bubbling.\n- **`once`**: If `true`, the listener is automatically removed after invoking once.\n- **`passive`**: If `true`, guarantees `preventDefault()` will never be called, allowing browsers to optimize smooth scrolling.\n- **`signal`**: An `AbortSignal` allowing bulk removal of listeners via `AbortController.abort()`.",
    codeExample: "const list = document.querySelector('ul');\nlist.addEventListener('scroll', handleScroll, { passive: true });\n\nconst btn = document.querySelector('#one-time-btn');\nbtn.addEventListener('click', handleOneClick, { once: true });",
    interviewTips: ["Highlight `passive: true` for scroll performance and `signal: controller.signal` for bulk cleanup."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "removeEventListener Matching",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What are the rules for successfully removing an event listener using removeEventListener()?",
    shortAnswer: "You must pass the exact same event type, identical function reference, and matching capture phase flag that were used during `addEventListener()`.",
    detailedExplanation: "- **Identical Reference**: An anonymous inline arrow function cannot be removed because its reference is lost.\n- **Capture Flag Match**: If attached with `capture: true`, `removeEventListener` must also specify `capture: true`.\n- **Other Options Ignored**: Other options like `passive` or `once` do not affect removal matching.",
    codeExample: "function handleClick(e) {\n  console.log('Handled');\n}\n\n// Adding named reference:\nbtn.addEventListener('click', handleClick);\n\n// Successfully removing:\nbtn.removeEventListener('click', handleClick);",
    interviewTips: ["Warn candidates that anonymous arrow functions (`() => {}`) cannot be removed with `removeEventListener`."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "Anonymous Function Trap",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "Why does calling removeEventListener('click', () => {}) fail to remove the event listener?",
    shortAnswer: "Each arrow function or function expression creates a completely new function object in memory; because the references do not match, the browser cannot find the listener to remove.",
    detailedExplanation: "- **Reference Equality**: JavaScript functions are compared by memory reference (`fn1 === fn2`).\n- **Separate Instances**: `() => {} !== () => {}`. Passing a new function creates a new memory pointer.\n- **Solution**: Store the function in a named variable or constant so the exact reference can be supplied to `removeEventListener`.",
    codeExample: "// BUG: Fails silently because references differ\nbtn.addEventListener('click', () => console.log('Hi'));\nbtn.removeEventListener('click', () => console.log('Hi')); // Does NOT remove!",
    interviewTips: ["This is one of the most common event listener memory leak bugs in frontend codebases."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "AbortController for Event Cleanup",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you use AbortController to clean up multiple event listeners simultaneously?",
    shortAnswer: "Pass `{ signal: controller.signal }` to each `addEventListener()`, then call `controller.abort()` to detach all of them in a single call.",
    detailedExplanation: "- **`AbortController`**: Standard Web API for cancelling asynchronous operations.\n- **Bulk Teardown**: Eliminates the need to call `removeEventListener` individually for dozens of handlers.\n- **Component Unmounting**: Extremely popular pattern in modern UI frameworks when tearing down components.",
    codeExample: "const controller = new AbortController();\nconst { signal } = controller;\n\nwindow.addEventListener('resize', onResize, { signal });\nwindow.addEventListener('scroll', onScroll, { signal });\nwindow.addEventListener('keydown', onKey, { signal });\n\n// When unmounting component or closing view:\ncontroller.abort(); // Removes all three listeners immediately!",
    interviewTips: ["Highlight `AbortController` as the modern best practice for bulk event listener cleanup."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "Event Propagation: Three Phases",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What are the three phases of DOM event propagation in order?",
    shortAnswer: "The three phases in chronological order are: 1. Capturing Phase (window down to target), 2. Target Phase (on target itself), and 3. Bubbling Phase (target back up to window).",
    detailedExplanation: "- **Phase 1: Capturing (Trickling)**: Event travels down the tree from `window` -> `document` -> `<html>` -> `<body>` down to the target's parent.\n- **Phase 2: Target**: Event reaches the originating target element.\n- **Phase 3: Bubbling**: Event bubbles back upward from target's parent through all ancestors up to `window`.\n- **Inspection**: `event.eventPhase` returns integers `1` (CAPTURING), `2` (AT_TARGET), or `3` (BUBBLING).",
    codeExample: "parent.addEventListener('click', (e) => {\n  console.log('Current phase:', e.eventPhase); // 1 = Capture, 2 = Target, 3 = Bubble\n}, true); // true = capture phase",
    interviewTips: ["Use the mnemonic: Down (Capture), Target, Up (Bubble)."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "target vs currentTarget",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is the difference between event.target and event.currentTarget?",
    shortAnswer: "`event.target` is the actual innermost element that triggered the event, while `event.currentTarget` is the element to which the event listener is currently attached.",
    detailedExplanation: "- **`event.target`**: The actual origin of the event (e.g. an icon inside a button).\n- **`event.currentTarget`**: The element currently executing the listener (identical to `this` in regular functions).\n- **Event Delegation**: In delegated handlers, `currentTarget` is the parent container, while `target` is the specific child clicked.",
    codeExample: "document.querySelector('#nav').addEventListener('click', function(e) {\n  console.log('Origin element clicked:', e.target);\n  console.log('Listener attached to:', e.currentTarget);\n  console.log(e.currentTarget === this); // true\n});",
    interviewTips: ["This is asked in almost every senior frontend interview: target is the origin; currentTarget is the listener host."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "preventDefault Method",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What does event.preventDefault() do and does it stop event bubbling?",
    shortAnswer: "`event.preventDefault()` cancels the browser's default behavior for the event, but does NOT stop event bubbling or propagation.",
    detailedExplanation: "- **Default Actions**: Examples include following link URLs, submitting forms, or checking checkboxes.\n- **Does NOT Stop Bubbling**: Ancestor listeners continue to receive the event normally.\n- **Inspection**: Check `event.defaultPrevented` (returns `true` if cancelled).\n- **Cancelable Property**: Only works if `event.cancelable === true`.",
    codeExample: "document.querySelector('a').addEventListener('click', (e) => {\n  e.preventDefault(); // Prevents URL navigation\n  console.log('Navigation prevented, running SPA routing...');\n});",
    interviewTips: ["Emphasize that `preventDefault()` stops browser native actions, NOT event propagation."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "stopPropagation vs stopImmediatePropagation",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is the difference between event.stopPropagation() and event.stopImmediatePropagation()?",
    shortAnswer: "`stopPropagation()` prevents the event from travelling to ancestor elements, while `stopImmediatePropagation()` also prevents any other listeners attached to the current element from executing.",
    detailedExplanation: "- **`event.stopPropagation()`**: Halts traversal up (bubbling) or down (capturing) the DOM tree. Other listeners on the CURRENT element still execute.\n- **`event.stopImmediatePropagation()`**: Halts traversal to other elements AND stops remaining listeners attached to the SAME element.\n- **Use Case**: Used by plugins or validation guards to preemptively abort subsequent handlers.",
    codeExample: "btn.addEventListener('click', (e) => {\n  e.stopImmediatePropagation();\n  console.log('First listener runs.');\n});\n\nbtn.addEventListener('click', () => {\n  console.log('This will NOT run due to stopImmediatePropagation!');\n});",
    interviewTips: ["Explain that `stopImmediatePropagation` kills execution for remaining listeners on the same element."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "Event Delegation Concept",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is event delegation and how does event bubbling make it possible?",
    shortAnswer: "Event delegation is a design pattern where a single event listener is attached to a parent container to manage events for multiple child elements via event bubbling.",
    detailedExplanation: "- **How It Works**: When a child is clicked, the event bubbles up to the parent container, which inspects `event.target`.\n- **Memory Efficiency**: Attaches 1 event listener instead of 1,000 listeners to every list item.\n- **Dynamic Elements**: Automatically handles newly created elements added to the list in the future without re-binding.\n- **Cleanup**: Simplifies memory management when items are deleted from the DOM.",
    codeExample: "const table = document.querySelector('#data-table');\ntable.addEventListener('click', (e) => {\n  const deleteBtn = e.target.closest('.delete-btn');\n  if (deleteBtn && table.contains(deleteBtn)) {\n    const row = deleteBtn.closest('tr');\n    row.remove();\n  }\n});",
    interviewTips: ["Highlight memory efficiency and automatic support for dynamic items as the two primary benefits of delegation."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "Events that do not bubble",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "Which common DOM events do NOT bubble up the DOM tree?",
    shortAnswer: "Common non-bubbling events include `focus`, `blur`, `mouseenter`, `mouseleave`, `load`, `unload`, and media events like `play` and `pause`.",
    detailedExplanation: "- **`focus` and `blur`**: Do not bubble. Use their bubbling counterparts `focusin` and `focusout` for delegation.\n- **`mouseenter` and `mouseleave`**: Do not bubble and do not fire on descendants. Use `mouseover` and `mouseout` if bubbling is required.\n- **`bubbles` Flag**: Inspect `event.bubbles` (returns boolean `true`/`false`).",
    codeExample: "// focus does not bubble, but focusin DOES bubble for delegation:\nconst form = document.querySelector('form');\nform.addEventListener('focusin', (e) => {\n  e.target.classList.add('focused-field');\n});",
    interviewTips: ["Mention using `focusin` / `focusout` when you need to delegate `focus` / `blur` events."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "CustomEvent API",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you create, dispatch, and listen to custom events in the DOM?",
    shortAnswer: "Create with `new CustomEvent('name', { detail, bubbles: true })`, dispatch via `element.dispatchEvent(event)`, and listen with `addEventListener('name', handler)`.",
    detailedExplanation: "- **`CustomEvent` Constructor**: Accepts event name and options dictionary.\n- **`detail` Property**: Custom payload object passed to listeners: `{ detail: { userId: 42 } }`.\n- **`bubbles: true`**: Must be explicitly set if you want the custom event to bubble up the DOM tree.\n- **`dispatchEvent()`**: Returns `false` if `preventDefault()` was called by a listener, or `true` otherwise.",
    codeExample: "const widget = document.querySelector('#widget');\n\n// Listener:\nwidget.addEventListener('userLogin', (e) => {\n  console.log('Logged in user ID:', e.detail.userId);\n});\n\n// Dispatcher:\nconst event = new CustomEvent('userLogin', {\n  detail: { userId: 42, role: 'admin' },\n  bubbles: true\n});\nwidget.dispatchEvent(event);",
    interviewTips: ["Remember to specify `bubbles: true` if you want custom events to propagate up to parent containers."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "Passive Event Listeners",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What are passive event listeners and why are they critical for mobile scrolling performance?",
    shortAnswer: "Passive listeners promise never to call `preventDefault()`, allowing the browser's compositor thread to scroll immediately without waiting for JavaScript execution on the main thread.",
    detailedExplanation: "- **Scroll Jitter**: Normally, the browser waits for touch/wheel handlers to finish to check if `preventDefault()` was called.\n- **`{ passive: true }`**: Tells the browser scrolling can proceed immediately in parallel on the compositor thread.\n- **Enforcement**: Calling `e.preventDefault()` inside a passive listener is ignored and logs a console warning.\n- **Modern Defaults**: Modern browsers default `touchstart` and `wheel` listeners on `document` to passive.",
    codeExample: "// Enables ultra-smooth 60fps scrolling on touch devices:\nwindow.addEventListener('touchstart', onTouchStart, { passive: true });",
    interviewTips: ["Explain that passive listeners unblock the compositor thread from waiting for main-thread JavaScript."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "isTrusted Property",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is event.isTrusted and can it be spoofed by JavaScript code?",
    shortAnswer: "`event.isTrusted` is a read-only boolean property that returns `true` if the event was generated by genuine user action (mouse, keyboard) and `false` if dispatched via script.",
    detailedExplanation: "- **True User Action**: Returns `true` for physical clicks, keypresses, and touch interactions.\n- **Synthetic Events**: Returns `false` when dispatched via `element.click()` or `element.dispatchEvent()`.\n- **Cannot Be Spoofed**: Enforced at browser engine level to protect against clickjacking and automated input forgery.",
    codeExample: "button.addEventListener('click', (e) => {\n  if (e.isTrusted) {\n    console.log('Real physical user click.');\n  } else {\n    console.log('Synthetic click generated by JavaScript.');\n  }\n});",
    interviewTips: ["Mention `event.isTrusted` as a vital browser security feature against automated script spoofing."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "event.composed and composedPath",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "What is event.composedPath() and how does event.composed govern Shadow DOM event propagation?",
    shortAnswer: "`event.composedPath()` returns an array of all nodes traversed by the event, while `event.composed: true` permits the event to cross through Shadow DOM boundaries into the outer Light DOM.",
    detailedExplanation: "- **`composed: true`**: Allows events fired inside a shadow root to bubble out past the shadow boundary into the main document.\n- **Event Retargeting**: In the main document, `event.target` is retargeted to the shadow host to preserve encapsulation.\n- **`composedPath()`**: Returns the full un-retargeted array of nodes from the deepest shadow child up to `Window`.",
    codeExample: "document.addEventListener('click', (e) => {\n  // Full array of elements in event propagation path:\n  console.log('Event path:', e.composedPath());\n});",
    interviewTips: ["Explain event retargeting: `composedPath()` reveals internal nodes, while `event.target` shows the shadow host."]
  }
];
