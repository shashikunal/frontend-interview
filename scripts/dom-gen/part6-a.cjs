// scripts/dom-gen/part6-a.cjs
// 38 Unique Questions on Range & Selection APIs, Document Lifecycle & Modern DOM APIs
// Distribution: 4 EASY, 20 INTERMEDIATE, 14 DIFFICULT

module.exports = [
  // --- 4 EASY Questions ---
  {
    topic: "Range and Selection APIs",
    subtopic: "window.getSelection() Basic Usage",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you get the text currently highlighted or selected by the user on a web page?",
    shortAnswer: "Call `window.getSelection().toString()`, which returns the plain text string of the user's active highlight.",
    detailedExplanation: "- **Global Selection**: `window.getSelection()` returns a `Selection` object representing the user's caret or highlighted text range.\n- **String Conversion**: Calling `.toString()` extracts the highlighted text without HTML tags.\n- **Empty Selection**: Returns an empty string `\"\"` if nothing is highlighted.",
    codeExample: "document.addEventListener('mouseup', () => {\n  const selectedText = window.getSelection().toString().trim();\n  if (selectedText.length > 0) {\n    console.log('User selected text:', selectedText);\n    showTooltipNearSelection(selectedText);\n  }\n});",
    interviewTips: ["Mention that `window.getSelection().toString()` is the foundation for Medium-style highlight tooltip bars."]
  },
  {
    topic: "Document Lifecycle & Window APIs",
    subtopic: "DOMContentLoaded vs window.onload",
    difficulty: "EASY",
    questionType: "COMPARISON",
    question: "What is the difference between DOMContentLoaded and the window load event?",
    shortAnswer: "`DOMContentLoaded` fires as soon as the HTML is fully parsed and the DOM tree is built (without waiting for images or stylesheets), while `load` fires only after all resources (images, stylesheets, iframes) have completely finished downloading.",
    detailedExplanation: "- **DOMContentLoaded**: Fires on `document`. Scripts manipulating DOM nodes can run immediately.\n- **load**: Fires on `window`. Indicates full page readiness including all external assets.\n- **Timing**: `DOMContentLoaded` fires much earlier than `load`, making it the preferred trigger for UI initialization.",
    codeExample: "// Fires early: DOM tree ready (images still downloading):\ndocument.addEventListener('DOMContentLoaded', () => {\n  console.log('DOM parsed and interactive');\n  initializeUiComponents();\n});\n\n// Fires late: All images, stylesheets, and iframes completely downloaded:\nwindow.addEventListener('load', () => {\n  console.log('Everything fully loaded');\n  hideGlobalPreloader();\n});",
    interviewTips: ["Structure answer clearly: 'DOMContentLoaded waits for the DOM tree only; window.onload waits for all external assets (images, frames, CSS).'"]
  },
  {
    topic: "Document Lifecycle & Window APIs",
    subtopic: "document.readyState States",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What are the three possible values of document.readyState and what does each signify?",
    shortAnswer: "`'loading'` (document still parsing), `'interactive'` (DOM finished parsing, sub-resources loading), and `'complete'` (all resources and images finished loading).",
    detailedExplanation: "- **loading**: The initial state while the browser is downloading and parsing raw HTML markup.\n- **interactive**: Corresponds to `DOMContentLoaded`; DOM elements can be queried and modified.\n- **complete**: Corresponds to `window.onload`; all images, stylesheets, and frames are loaded.\n- **readystatechange Event**: Fires on `document` whenever `document.readyState` changes.",
    codeExample: "function runWhenReady(callback) {\n  if (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', callback);\n  } else {\n    callback(); // Already interactive or complete!\n  }\n}",
    interviewTips: ["Show this safe initialization pattern: checking if `document.readyState === 'loading'` avoids missing the `DOMContentLoaded` event."]
  },
  {
    topic: "Document Lifecycle & Window APIs",
    subtopic: "document.visibilityState and Page Visibility API",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you detect when the user switches away from your browser tab using the Page Visibility API?",
    shortAnswer: "Listen for the `visibilitychange` event on `document` and inspect `document.visibilityState` (`'visible'` or `'hidden'`).",
    detailedExplanation: "- **Values**: `'visible'` (tab active), `'hidden'` (tab minimized or switched), or `'prerender'`.\n- **Performance**: Pause video streaming, WebGL loops, audio, and high-frequency polling when `document.hidden === true` to save CPU and battery.\n- **Unload Replacement**: Prefer `visibilitychange` over `unload` or `beforeunload` for saving draft states on mobile.",
    codeExample: "document.addEventListener('visibilitychange', () => {\n  if (document.hidden) {\n    pauseVideoPlayback();\n    stopTelemetryPolling();\n  } else {\n    resumeVideoPlayback();\n    startTelemetryPolling();\n  }\n});",
    interviewTips: ["State that `visibilitychange` is the modern standard for pausing background activities and auto-saving drafts."]
  },

  // --- 20 INTERMEDIATE Questions ---
  {
    topic: "Range and Selection APIs",
    subtopic: "document.createRange() Basic Manipulation",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "What is a DOM Range object and how do you create one to select content between two points in the document?",
    shortAnswer: "A `Range` represents a contiguous fragment of a document; create one using `document.createRange()`, set boundaries via `setStart()` and `setEnd()`, and manipulate content directly.",
    detailedExplanation: "- **Boundary Points**: Boundary is defined by a node and an offset (`range.setStart(node, offset)`).\n- **Cross-Node Boundaries**: Can span across different HTML tags and text nodes.\n- **Selection Sync**: Add the range to the user's active visual selection via `window.getSelection().addRange(range)`.",
    codeExample: "const range = document.createRange();\nconst startNode = document.querySelector('#p1').firstChild;\nconst endNode = document.querySelector('#p2').firstChild;\n\nrange.setStart(startNode, 5);\nrange.setEnd(endNode, 10);\n\n// Highlights this range visually for the user:\nconst selection = window.getSelection();\nselection.removeAllRanges();\nselection.addRange(range);",
    interviewTips: ["Explain that a Range is a programmatic representation of a slice of the DOM tree that can cross multiple elements."]
  },
  {
    topic: "Range and Selection APIs",
    subtopic: "range.extractContents() vs cloneContents()",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    question: "What is the difference between range.extractContents(), range.cloneContents(), and range.deleteContents()?",
    shortAnswer: "`extractContents()` removes the nodes from the DOM and returns them in a DocumentFragment; `cloneContents()` copies the nodes into a DocumentFragment without removing them; `deleteContents()` deletes them from the DOM without returning anything.",
    detailedExplanation: "- **extractContents()**: Cut operation; original DOM nodes are detached and returned in a reusable `DocumentFragment`.\n- **cloneContents()**: Copy operation; original DOM remains untouched, returns clone in a `DocumentFragment`.\n- **deleteContents()**: Delete operation; removes selected nodes from the document tree, returns `undefined`.",
    codeExample: "const selection = window.getSelection();\nif (selection.rangeCount > 0) {\n  const range = selection.getRangeAt(0);\n  \n  // Extracts highlighted content and returns it in a DocumentFragment:\n  const extractedFragment = range.extractContents();\n  document.querySelector('#clipboard-box').appendChild(extractedFragment);\n}",
    interviewTips: ["Use the clipboard analogy: `cloneContents` is Copy, `extractContents` is Cut, `deleteContents` is Delete."]
  },
  {
    topic: "Range and Selection APIs",
    subtopic: "range.surroundContents()",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you wrap the user's highlighted text selection inside a <mark> or <span> element using surroundContents()?",
    shortAnswer: "Call `range.surroundContents(wrapperElement)` to move the contents of the range into the wrapper and insert the wrapper in place of the range.",
    detailedExplanation: "- **Inline Wrapping**: Perfect for building rich-text editor features (highlight, bold, mark).\n- **Partial Node Splitting Error**: Throws a `BadBoundaryPointsError` if the range splits a non-Text node partially (e.g. start inside one `<div>` and end inside another).\n- **Safe Usage**: Works reliably on pure text selections within a single block element.",
    codeExample: "function highlightSelection() {\n  const selection = window.getSelection();\n  if (selection.rangeCount > 0) {\n    const range = selection.getRangeAt(0);\n    const mark = document.createElement('mark');\n    mark.className = 'yellow-highlight';\n    \n    // Wraps the selected text with <mark>:\n    range.surroundContents(mark);\n    selection.removeAllRanges(); // Clears highlight cursor\n  }\n}",
    interviewTips: ["Mention that `surroundContents()` throws an error if the range partially intersects non-Text boundary nodes."]
  },
  {
    topic: "Range and Selection APIs",
    subtopic: "Selecting Entire Element with selectNodeContents",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you programmatically select the entire contents of a code block or table so the user can copy it in one click?",
    shortAnswer: "Create a range, call `range.selectNodeContents(element)`, and apply it with `selection.addRange(range)`.",
    detailedExplanation: "- **selectNodeContents**: Sets the range start at offset 0 and end at the end of the element's child nodes.\n- **selectNode vs selectNodeContents**: `selectNode` includes the element tag itself; `selectNodeContents` selects only the children inside the tag.\n- **One-Click Copy**: Commonly used in 'Copy Code' or 'Select All' utility buttons.",
    codeExample: "function selectAllCode(codeElement) {\n  const range = document.createRange();\n  range.selectNodeContents(codeElement);\n  \n  const selection = window.getSelection();\n  selection.removeAllRanges();\n  selection.addRange(range);\n}",
    interviewTips: ["Contrast `selectNode` (includes the tag) with `selectNodeContents` (selects only the inner contents)."]
  },
  {
    topic: "Range and Selection APIs",
    subtopic: "contenteditable and input Events",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "How does the input event work on contenteditable elements compared to standard form inputs?",
    shortAnswer: "On a `contenteditable` container, the `input` event fires on every keystroke, paste, or styling command, exposing an `InputEvent` with properties like `inputType` ('insertText', 'deleteContentBackward', 'formatBold').",
    detailedExplanation: "- **inputType Property**: Identifies the exact user action (e.g. `'insertParagraph'`, `'historyUndo'`).\n- **beforeinput Event**: Fires before the DOM is mutated, allowing `event.preventDefault()` to intercept or customize formatting.\n- **getTargetRanges()**: `beforeinput` exposes `event.getTargetRanges()` indicating which DOM nodes will be modified.",
    codeExample: "const editor = document.querySelector('#rich-editor');\n\neditor.addEventListener('beforeinput', (e) => {\n  if (e.inputType === 'formatBold') {\n    e.preventDefault();\n    applyCustomMarkdownBold();\n  }\n});",
    interviewTips: ["Highlight `beforeinput` and `e.inputType` as the modern foundation for rich-text editors without deprecated execCommand."]
  },
  {
    topic: "Document Lifecycle & Window APIs",
    subtopic: "Back/Forward Cache (bfcache) and pageshow Event",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is the Back/Forward Cache (bfcache) and why does window.onload not fire when returning via browser back button?",
    shortAnswer: "The bfcache freezes the entire in-memory snapshot of a page (including JavaScript heap and DOM state) so back/forward navigation is instantaneous. Because the page is restored from memory, `DOMContentLoaded` and `onload` do not re-run; listen for `pageshow` instead.",
    detailedExplanation: "- **Instant Navigation**: Page state is paused and resumed without re-downloading or re-parsing HTML.\n- **pageshow Event**: Fires whenever a page is shown. Check `event.persisted === true` to know if restored from bfcache.\n- **bfcache Blockers**: Attaching `unload` listeners or leaving open `WebSocket` connections prevents the browser from using bfcache.",
    codeExample: "window.addEventListener('pageshow', (event) => {\n  if (event.persisted) {\n    console.log('Page was restored from bfcache! Refreshing dynamic auth state...');\n    verifyUserSession();\n  }\n});",
    interviewTips: ["State that `event.persisted` in the `pageshow` listener is how you detect bfcache restoration."]
  },
  {
    topic: "Document Lifecycle & Window APIs",
    subtopic: "HTML5 Fullscreen API",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you request and exit fullscreen mode on a DOM element using the Fullscreen API?",
    shortAnswer: "Call `element.requestFullscreen()` to enter fullscreen; call `document.exitFullscreen()` to return to normal view.",
    detailedExplanation: "- **User Gesture Mandatory**: Must be called within a transient user interaction (click, keypress); rejected otherwise.\n- **document.fullscreenElement**: Returns the element currently in fullscreen, or `null` if not active.\n- **fullscreenchange Event**: Fires on `document` when fullscreen state changes.\n- **CSS Pseudo-class**: Style fullscreen elements using the `:fullscreen` CSS pseudo-class.",
    codeExample: "const videoPlayer = document.querySelector('#video-container');\nconst toggleBtn = document.querySelector('#fullscreen-btn');\n\ntoggleBtn.addEventListener('click', async () => {\n  if (!document.fullscreenElement) {\n    await videoPlayer.requestFullscreen();\n  } else {\n    await document.exitFullscreen();\n  }\n});",
    interviewTips: ["Point out that entering fullscreen is called on the ELEMENT (`el.requestFullscreen()`), but exiting is called on the DOCUMENT (`document.exitFullscreen()`)."]
  },
  {
    topic: "Document Lifecycle & Window APIs",
    subtopic: "BroadcastChannel API for Cross-Tab DOM Synchronization",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you use the BroadcastChannel API to synchronize DOM UI state across multiple browser tabs in real-time?",
    shortAnswer: "Instantiate `new BroadcastChannel('channel-name')` across tabs; broadcast messages with `channel.postMessage(data)` and listen via `channel.onmessage`.",
    detailedExplanation: "- **Same-Origin Only**: Broadcasts exclusively to all browsing contexts (tabs, windows, iframes) on the same origin.\n- **Simpler than Storage Events**: Cleaner and more performant than listening for `window.addEventListener('storage')`.\n- **Clean Teardown**: Call `channel.close()` when components unmount.",
    codeExample: "const authChannel = new BroadcastChannel('auth_state');\n\n// When user logs out in tab 1:\nauthChannel.postMessage({ action: 'LOGOUT' });\n\n// Tab 2 listens and updates DOM UI immediately:\nauthChannel.onmessage = (event) => {\n  if (event.data.action === 'LOGOUT') {\n    document.querySelector('#user-status').textContent = 'Signed Out';\n    showLoginModal();\n  }\n};",
    interviewTips: ["Mention BroadcastChannel as the modern alternative to hacking localStorage `storage` events for cross-tab synchronization."]
  },
  {
    topic: "Range and Selection APIs",
    subtopic: "Selection collapse() and Caret Positioning",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you programmatically collapse a selection to place the blinking cursor at the very end of a text node?",
    shortAnswer: "Call `selection.collapse(targetNode, targetNode.length)` to position the caret at the end of the text node.",
    detailedExplanation: "- **collapse() Method**: Collapses the selection to a single insertion point (caret) without selecting text.\n- **collapseToEnd()**: Collapses the active range to its end point.\n- **Focus Sync**: Often paired with `element.focus()` when programmatically setting focus inside an editor.",
    codeExample: "function placeCaretAtEnd(element) {\n  element.focus();\n  const range = document.createRange();\n  range.selectNodeContents(element);\n  range.collapse(false); // false = collapse to end, true = collapse to start\n  \n  const sel = window.getSelection();\n  sel.removeAllRanges();\n  sel.addRange(range);\n}",
    interviewTips: ["Highlight this function: setting caret at the end of a `contenteditable` element is a very common interview question."]
  },
  {
    topic: "Document Lifecycle & Window APIs",
    subtopic: "View Transitions API document.startViewTransition",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "What is the View Transitions API and how does document.startViewTransition() enable animated page state transitions?",
    shortAnswer: "`document.startViewTransition(updateCallback)` captures snapshots of the current DOM, applies your DOM update callback, and automatically cross-fades or morphs between the old and new DOM states with smooth CSS transitions.",
    detailedExplanation: "- **Eliminates Animation Complexity**: Eliminates measuring old/new coordinates manually with FLIP animations.\n- **Pseudo-Elements**: Creates temporary pseudo-elements (`::view-transition-old(root)` and `::view-transition-new(root)`) that can be styled with CSS.\n- **Progressive Enhancement**: Fallback is straightforward: `if (!document.startViewTransition) { updateDom(); return; }`.",
    codeExample: "function switchTheme(isDark) {\n  if (!document.startViewTransition) {\n    document.body.classList.toggle('dark-theme', isDark);\n    return;\n  }\n  \n  // Smoothly morphs the entire DOM layout transition:\n  document.startViewTransition(() => {\n    document.body.classList.toggle('dark-theme', isDark);\n  });\n}",
    interviewTips: ["Mention the View Transitions API as the cutting-edge native web standard replacing complex FLIP animation libraries."]
  },
  {
    topic: "Range and Selection APIs",
    subtopic: "Range compareBoundaryPoints",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is range.compareBoundaryPoints() and how is it used to check if two selections overlap?",
    shortAnswer: "`rangeA.compareBoundaryPoints(how, rangeB)` compares the start and end boundary positions of two ranges, returning `-1`, `0`, or `1`.",
    detailedExplanation: "- **Comparison Constants**: `Range.START_TO_START`, `START_TO_END`, `END_TO_END`, `END_TO_START`.\n- **Overlap Detection**: Comparing `END_TO_START` and `START_TO_END` determines whether two text annotations or comment ranges collide.\n- **Annotation Engines**: Used by Google Docs / collaborative editor engines to resolve simultaneous multi-user text ranges.",
    codeExample: "const isOverlapping = (\n  rangeA.compareBoundaryPoints(Range.END_TO_START, rangeB) > 0 &&\n  rangeA.compareBoundaryPoints(Range.START_TO_END, rangeB) < 0\n);",
    interviewTips: ["Mention `compareBoundaryPoints` when discussing collaborative text editor or annotation tool implementations."]
  },
  {
    topic: "Document Lifecycle & Window APIs",
    subtopic: "DocumentFragment Performance vs InnerHTML in High Frequency",
    difficulty: "INTERMEDIATE",
    questionType: "PERFORMANCE",
    question: "Why does appending a DocumentFragment outperform repeated innerHTML assignments in real-time streaming feeds?",
    shortAnswer: "Assigning to `innerHTML` destroys and reconstructs the entire DOM subtree, discarding event listeners and state, whereas `DocumentFragment.appendChild` only adds new nodes without re-parsing existing elements.",
    detailedExplanation: "- **Subtree Destruction**: `list.innerHTML += newHtml` re-parses the ENTIRE list from string, destroying all existing DOM nodes and active event handlers.\n- **DocumentFragment Preservation**: Appending a fragment keeps existing nodes intact in memory without recreating them.\n- **Garbage Collection**: Fragment appending generates far less heap garbage for the browser GC.",
    codeExample: "// BAD (Re-creates entire list on every message):\n// list.innerHTML += `<li>${message}</li>`;\n\n// GOOD (Appends only new node, preserving existing elements):\nconst frag = document.createDocumentFragment();\nconst li = document.createElement('li');\nli.textContent = message;\nfrag.appendChild(li);\nlist.appendChild(frag);",
    interviewTips: ["Emphasize that `element.innerHTML += '...'` is an anti-pattern because it destroys and re-creates all previous child nodes."]
  },
  {
    topic: "Document Lifecycle & Window APIs",
    subtopic: "CSS Anchor Positioning API in Modern DOM",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is the CSS Anchor Positioning API and how does it eliminate JavaScript positioning math for tooltips and popovers?",
    shortAnswer: "CSS Anchor Positioning links a floating element directly to an 'anchor' element via `anchor-name: --my-anchor` and `position-anchor: --my-anchor`, allowing pure CSS to position tooltips without `getBoundingClientRect()` calculations.",
    detailedExplanation: "- **Zero JS Coordinates**: Replaces heavy libraries like Popper.js and Floating UI.\n- **Automatic Flip Fallbacks**: Uses `@position-try` to automatically flip tooltips from top to bottom if screen space is tight.\n- **Scroll Resilient**: Floating elements track anchors natively across scrolling and layout changes without scroll event listeners.",
    codeExample: "/* Defining the anchor button: */\n#anchor-btn {\n  anchor-name: --my-anchor;\n}\n\n/* Anchored floating tooltip in pure CSS: */\n.tooltip {\n  position: fixed;\n  position-anchor: --my-anchor;\n  bottom: anchor(top);\n  left: anchor(center);\n}",
    interviewTips: ["Highlight CSS Anchor Positioning as a major breakthrough eliminating JavaScript coordinate calculation libraries like Floating UI."]
  },
  {
    topic: "Range and Selection APIs",
    subtopic: "document.execCommand Deprecation and Alternatives",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "Why was document.execCommand() deprecated and what is the modern replacement for building rich text editors?",
    shortAnswer: "`document.execCommand()` was deprecated due to inconsistent HTML output across browsers and lack of flexibility; modern editors use the `beforeinput` event, `InputEvent.inputType`, and direct DOM Range manipulation.",
    detailedExplanation: "- **Inconsistent HTML**: One browser output `<span style=\"font-weight:bold\">`, another output `<b>`, and another output `<strong>`.\n- **beforeinput API**: Provides fine-grained control: intercepts user intentions (`e.inputType === 'formatBold'`) before mutations happen.\n- **Modern Frameworks**: Prosemirror, Lexical, and Slate manage their own document models and render directly to the DOM without `execCommand`.",
    codeExample: "// DEPRECATED (Avoid in modern code):\n// document.execCommand('bold', false, null);\n\n// MODERN STANDARD (Intercept beforeinput and mutate Range):\neditor.addEventListener('beforeinput', (e) => {\n  if (e.inputType === 'formatBold') {\n    e.preventDefault();\n    toggleBoldOnActiveRange();\n  }\n});",
    interviewTips: ["State clearly that `document.execCommand` is deprecated and modern editors use `beforeinput` and `Range` manipulation."]
  },
  {
    topic: "Document Lifecycle & Window APIs",
    subtopic: "window.devicePixelRatio and High-DPI Displays",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you use window.devicePixelRatio to prevent blurry canvas elements on Retina and high-DPI displays?",
    shortAnswer: "Multiply the canvas internal `width` and `height` pixel dimensions by `window.devicePixelRatio`, while keeping CSS style dimensions at the logical pixel size, then scale the context via `ctx.scale(dpr, dpr)`.",
    detailedExplanation: "- **Physical vs Logical Pixels**: Retina screens have 2 or 3 physical device pixels per 1 CSS pixel (`devicePixelRatio === 2` or `3`).\n- **Blur Cause**: A 300x150 canvas scaled up by the browser looks fuzzy on 2x screens unless internal pixels match physical pixels.\n- **matchMedia Watcher**: Listen for screen resolution changes when users drag windows across different monitors.",
    codeExample: "function setupSharpCanvas(canvas, cssWidth, cssHeight) {\n  const dpr = window.devicePixelRatio || 1;\n  // Set display size (CSS pixels):\n  canvas.style.width = `${cssWidth}px`;\n  canvas.style.height = `${cssHeight}px`;\n  // Set actual resolution in memory (physical pixels):\n  canvas.width = Math.floor(cssWidth * dpr);\n  canvas.height = Math.floor(cssHeight * dpr);\n  // Scale drawing context to match logical units:\n  const ctx = canvas.getContext('2d');\n  ctx.scale(dpr, dpr);\n  return ctx;\n}",
    interviewTips: ["Demonstrate this formula for sharp canvas rendering on high-DPI / Retina displays."]
  },

  // --- 14 DIFFICULT Questions ---
  {
    topic: "Range and Selection APIs",
    subtopic: "CSS Custom Highlight API",
    difficulty: "DIFFICULT",
    questionType: "CODE",
    question: "What is the CSS Custom Highlight API (CSS.highlights) and how does it style text search highlights without modifying the DOM tree?",
    shortAnswer: "The Custom Highlight API allows registering DOM `Range` objects directly into `CSS.highlights`, styling them via the `::highlight(custom-name)` pseudo-element without injecting any `<mark>` or `<span>` wrapper tags.",
    detailedExplanation: "- **Zero DOM Mutations**: Eliminates wrapping text in `<span>` tags, avoiding broken text node splits and preserving original DOM structure.\n- **Performance**: Dramatically faster for in-page search highlighting across thousands of results.\n- **CSS Integration**: Style with `::highlight(search-result) { background-color: #fef08a; color: #000; }`.",
    codeExample: "// Create Range objects for search matches:\nconst range1 = document.createRange();\nrange1.setStart(textNode, 0);\nrange1.setEnd(textNode, 5);\n\n// Register custom highlight:\nconst searchHighlight = new Highlight(range1);\nCSS.highlights.set('search-match', searchHighlight);\n\n/* In CSS: */\n/* ::highlight(search-match) { background-color: yellow; color: black; } */",
    interviewTips: ["Mention the CSS Custom Highlight API as the modern zero-DOM-mutation solution for text search highlighting."]
  },
  {
    topic: "Range and Selection APIs",
    subtopic: "Handling Caret Coordinates with Range getBoundingClientRect",
    difficulty: "DIFFICULT",
    questionType: "CODE",
    question: "How do you calculate the exact pixel screen coordinates of the blinking cursor (caret) inside a contenteditable element?",
    shortAnswer: "Extract the active collapsed `Range` from `window.getSelection().getRangeAt(0)` and call `range.getBoundingClientRect()` to retrieve its exact screen pixel coordinates.",
    detailedExplanation: "- **Collapsed Range Bounds**: Even when collapsed to a 0-width caret, `range.getBoundingClientRect()` returns valid `top`, `bottom`, `left`, and `height`.\n- **Fallback Trick**: If the range is at the end of an empty line, inserting an invisible zero-width space Text node (`'\\u200b'`), measuring, and removing it provides accurate coordinates.\n- **Floating Menu Placement**: Enables positioning @mention or emoji autocomplete popup menus directly above the typing cursor.",
    codeExample: "function getCaretCoordinates() {\n  const sel = window.getSelection();\n  if (sel.rangeCount === 0) return null;\n  const range = sel.getRangeAt(0).cloneRange();\n  range.collapse(true);\n  const rect = range.getBoundingClientRect();\n  return { top: rect.top, left: rect.left, height: rect.height };\n}",
    interviewTips: ["Use `range.getBoundingClientRect()` as the standard solution for positioning @mention popups right at the blinking cursor."]
  },
  {
    topic: "Document Lifecycle & Window APIs",
    subtopic: "Navigation API vs Legacy History API",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "How does the modern Navigation API (window.navigation) resolve the fundamental flaws of window.history?",
    shortAnswer: "The Navigation API provides a centralized `navigate` event that intercepts all navigations (clicks, back/forward buttons, programmatic jumps), supports asynchronous transition promises, and provides complete state history inspection.",
    detailedExplanation: "- **Flaw of history.pushState**: Calling `pushState` did not fire `popstate`, forcing SPA routers to monkey-patch history methods.\n- **Unified navigate Event**: Intercepts all internal link clicks and back button triggers in one place via `event.intercept({ handler })`.\n- **Async Transitions**: The `navigate` handler accepts an async function, keeping navigation state in sync with network loading.\n- **History Entries**: `navigation.entries()` returns the full stack of history entries.",
    codeExample: "if ('navigation' in window) {\n  window.navigation.addEventListener('navigate', (e) => {\n    if (shouldHandleClientSide(e)) {\n      e.intercept({\n        async handler() {\n          const html = await fetchPageContent(e.destination.url);\n          document.querySelector('#app').innerHTML = html;\n        }\n      });\n    }\n  });\n}",
    interviewTips: ["Contrast `window.navigation` with `window.history`: the Navigation API fires for BOTH pushState and back/forward navigations."]
  },
  {
    topic: "Document Lifecycle & Window APIs",
    subtopic: "DOMMatrix and CSS Matrix Transforms",
    difficulty: "DIFFICULT",
    questionType: "CODE",
    question: "How do you decompose and calculate the actual rendered rotation and scale of a DOM element using DOMMatrix?",
    shortAnswer: "Read the computed `transform` matrix string using `getComputedStyle(element).transform`, pass it to `new DOMMatrix(matrixString)`, and extract math properties like `matrix.a`, `matrix.b`, scale, and angle.",
    detailedExplanation: "- **Standard Object**: `DOMMatrix` is a native Web API for 2D and 3D affine transformation matrices.\n- **Scale Extraction**: `scaleX = Math.hypot(matrix.a, matrix.b)`.\n- **Angle Extraction**: `rotationAngle = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI)`.\n- **Avoids Regex**: Completely replaces messy manual regex parsing of matrix strings.",
    codeExample: "function getElementScaleAndRotation(element) {\n  const transform = window.getComputedStyle(element).transform;\n  if (transform === 'none') return { scaleX: 1, scaleY: 1, angle: 0 };\n  \n  const matrix = new DOMMatrix(transform);\n  const scaleX = Math.hypot(matrix.a, matrix.b);\n  const angle = Math.round(Math.atan2(matrix.b, matrix.a) * (180 / Math.PI));\n  return { scaleX, angle };\n}",
    interviewTips: ["Use `new DOMMatrix(computedTransform)` as the modern, math-accurate way to decompose CSS transforms."]
  },
  {
    topic: "Document Lifecycle & Window APIs",
    subtopic: "structuredClone Limitations with DOM Nodes",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "Why does structuredClone(element) throw a DataCloneError when passed a DOM node, and what is the proper cloning method?",
    shortAnswer: "DOM nodes are host platform objects tied to C++ engine memory and window contexts; the structured clone algorithm explicitly forbids cloning DOM nodes, throwing a `DataCloneError`. You must use `node.cloneNode(deep)` instead.",
    detailedExplanation: "- **Structured Clone Spec**: Only clones serializable JavaScript primitives, plain objects, Maps, Sets, and ArrayBuffers.\n- **DOM Node Exception**: DOM nodes, functions, and symbols cannot be cloned with `structuredClone()`.\n- **Deep Cloning**: Always use `element.cloneNode(true)` to create a deep duplicate of a DOM element.",
    codeExample: "const btn = document.querySelector('button');\n\ntry {\n  // THROWS: DOMException: DataCloneError\n  const badCopy = structuredClone(btn);\n} catch (err) {\n  console.log('DOM nodes cannot be structured-cloned!');\n}\n\n// CORRECT:\nconst safeCopy = btn.cloneNode(true);",
    interviewTips: ["Remember: `structuredClone` rejects DOM nodes, functions, and symbols with a `DataCloneError`."]
  },
  {
    topic: "Document Lifecycle & Window APIs",
    subtopic: "Event-Loop Starvation via Microtask Flooding vs DOM Updates",
    difficulty: "DIFFICULT",
    questionType: "PERFORMANCE",
    question: "Why does an infinite Promise.resolve() loop freeze the browser UI and block DOM rendering completely, while an infinite setTimeout loop does not?",
    shortAnswer: "The browser event loop drains the entire microtask queue before it can proceed to rendering (style/layout/paint) or the next macrotask. Recursive microtasks starve the event loop, freezing the UI completely.",
    detailedExplanation: "- **Microtask Drain Rule**: The engine will NOT yield to the rendering pipeline or process user inputs until the microtask queue is 100% empty.\n- **Macrotasks (setTimeout)**: The browser runs at most one macrotask per turn, yielding to layout, painting, and user inputs between iterations.\n- **UI Lockup**: Infinite `queueMicrotask` or `Promise.resolve().then(...)` causes an unrecoverable browser tab freeze.",
    codeExample: "// FREEZES TAB COMPLETELY (DOM rendering blocked):\n// function freeze() { Promise.resolve().then(freeze); }\n// freeze();\n\n// DOES NOT FREEZE TAB (Yields to browser renderer between ticks):\nfunction safeLoop() { setTimeout(safeLoop, 0); }\nsafeLoop();",
    interviewTips: ["Explain the microtask drain rule: the engine refuses to render pixels until the microtask queue is completely empty."]
  }
];
