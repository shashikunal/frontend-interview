// scripts/dom-gen/part6.cjs
// 75 High-Value, Unique DOM Interview Questions
// Distribution: 6 EASY, 39 INTERMEDIATE, 30 DIFFICULT

module.exports = [
  {
    "topic": "Range and Selection APIs",
    "subtopic": "window.getSelection() Basic Usage",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "How do you get the text currently highlighted or selected by the user on a web page?",
    "shortAnswer": "Call `window.getSelection().toString()`, which returns the plain text string of the user's active highlight.",
    "detailedExplanation": "- **Global Selection**: `window.getSelection()` returns a `Selection` object representing the user's caret or highlighted text range.\n- **String Conversion**: Calling `.toString()` extracts the highlighted text without HTML tags.\n- **Empty Selection**: Returns an empty string `\"\"` if nothing is highlighted.",
    "codeExample": "document.addEventListener('mouseup', () => {\n  const selectedText = window.getSelection().toString().trim();\n  if (selectedText.length > 0) {\n    console.log('User selected text:', selectedText);\n    showTooltipNearSelection(selectedText);\n  }\n});",
    "interviewTips": [
      "Mention that `window.getSelection().toString()` is the foundation for Medium-style highlight tooltip bars."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "DOMContentLoaded vs window.onload",
    "difficulty": "EASY",
    "questionType": "COMPARISON",
    "question": "What is the difference between DOMContentLoaded and the window load event?",
    "shortAnswer": "`DOMContentLoaded` fires as soon as the HTML is fully parsed and the DOM tree is built (without waiting for images or stylesheets), while `load` fires only after all resources (images, stylesheets, iframes) have completely finished downloading.",
    "detailedExplanation": "- **DOMContentLoaded**: Fires on `document`. Scripts manipulating DOM nodes can run immediately.\n- **load**: Fires on `window`. Indicates full page readiness including all external assets.\n- **Timing**: `DOMContentLoaded` fires much earlier than `load`, making it the preferred trigger for UI initialization.",
    "codeExample": "// Fires early: DOM tree ready (images still downloading):\ndocument.addEventListener('DOMContentLoaded', () => {\n  console.log('DOM parsed and interactive');\n  initializeUiComponents();\n});\n\n// Fires late: All images, stylesheets, and iframes completely downloaded:\nwindow.addEventListener('load', () => {\n  console.log('Everything fully loaded');\n  hideGlobalPreloader();\n});",
    "interviewTips": [
      "Structure answer clearly: 'DOMContentLoaded waits for the DOM tree only; window.onload waits for all external assets (images, frames, CSS).'"
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "document.readyState States",
    "difficulty": "EASY",
    "questionType": "CONCEPTUAL",
    "question": "What are the three possible values of document.readyState and what does each signify?",
    "shortAnswer": "`'loading'` (document still parsing), `'interactive'` (DOM finished parsing, sub-resources loading), and `'complete'` (all resources and images finished loading).",
    "detailedExplanation": "- **loading**: The initial state while the browser is downloading and parsing raw HTML markup.\n- **interactive**: Corresponds to `DOMContentLoaded`; DOM elements can be queried and modified.\n- **complete**: Corresponds to `window.onload`; all images, stylesheets, and frames are loaded.\n- **readystatechange Event**: Fires on `document` whenever `document.readyState` changes.",
    "codeExample": "function runWhenReady(callback) {\n  if (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', callback);\n  } else {\n    callback(); // Already interactive or complete!\n  }\n}",
    "interviewTips": [
      "Show this safe initialization pattern: checking if `document.readyState === 'loading'` avoids missing the `DOMContentLoaded` event."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "document.visibilityState and Page Visibility API",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "How do you detect when the user switches away from your browser tab using the Page Visibility API?",
    "shortAnswer": "Listen for the `visibilitychange` event on `document` and inspect `document.visibilityState` (`'visible'` or `'hidden'`).",
    "detailedExplanation": "- **Values**: `'visible'` (tab active), `'hidden'` (tab minimized or switched), or `'prerender'`.\n- **Performance**: Pause video streaming, WebGL loops, audio, and high-frequency polling when `document.hidden === true` to save CPU and battery.\n- **Unload Replacement**: Prefer `visibilitychange` over `unload` or `beforeunload` for saving draft states on mobile.",
    "codeExample": "document.addEventListener('visibilitychange', () => {\n  if (document.hidden) {\n    pauseVideoPlayback();\n    stopTelemetryPolling();\n  } else {\n    resumeVideoPlayback();\n    startTelemetryPolling();\n  }\n});",
    "interviewTips": [
      "State that `visibilitychange` is the modern standard for pausing background activities and auto-saving drafts."
    ]
  },
  {
    "topic": "Range and Selection APIs",
    "subtopic": "document.createRange() Basic Manipulation",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "What is a DOM Range object and how do you create one to select content between two points in the document?",
    "shortAnswer": "A `Range` represents a contiguous fragment of a document; create one using `document.createRange()`, set boundaries via `setStart()` and `setEnd()`, and manipulate content directly.",
    "detailedExplanation": "- **Boundary Points**: Boundary is defined by a node and an offset (`range.setStart(node, offset)`).\n- **Cross-Node Boundaries**: Can span across different HTML tags and text nodes.\n- **Selection Sync**: Add the range to the user's active visual selection via `window.getSelection().addRange(range)`.",
    "codeExample": "const range = document.createRange();\nconst startNode = document.querySelector('#p1').firstChild;\nconst endNode = document.querySelector('#p2').firstChild;\n\nrange.setStart(startNode, 5);\nrange.setEnd(endNode, 10);\n\n// Highlights this range visually for the user:\nconst selection = window.getSelection();\nselection.removeAllRanges();\nselection.addRange(range);",
    "interviewTips": [
      "Explain that a Range is a programmatic representation of a slice of the DOM tree that can cross multiple elements."
    ]
  },
  {
    "topic": "Range and Selection APIs",
    "subtopic": "range.extractContents() vs cloneContents()",
    "difficulty": "INTERMEDIATE",
    "questionType": "COMPARISON",
    "question": "What is the difference between range.extractContents(), range.cloneContents(), and range.deleteContents()?",
    "shortAnswer": "`extractContents()` removes the nodes from the DOM and returns them in a DocumentFragment; `cloneContents()` copies the nodes into a DocumentFragment without removing them; `deleteContents()` deletes them from the DOM without returning anything.",
    "detailedExplanation": "- **extractContents()**: Cut operation; original DOM nodes are detached and returned in a reusable `DocumentFragment`.\n- **cloneContents()**: Copy operation; original DOM remains untouched, returns clone in a `DocumentFragment`.\n- **deleteContents()**: Delete operation; removes selected nodes from the document tree, returns `undefined`.",
    "codeExample": "const selection = window.getSelection();\nif (selection.rangeCount > 0) {\n  const range = selection.getRangeAt(0);\n  \n  // Extracts highlighted content and returns it in a DocumentFragment:\n  const extractedFragment = range.extractContents();\n  document.querySelector('#clipboard-box').appendChild(extractedFragment);\n}",
    "interviewTips": [
      "Use the clipboard analogy: `cloneContents` is Copy, `extractContents` is Cut, `deleteContents` is Delete."
    ]
  },
  {
    "topic": "Range and Selection APIs",
    "subtopic": "range.surroundContents()",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you wrap the user's highlighted text selection inside a <mark> or <span> element using surroundContents()?",
    "shortAnswer": "Call `range.surroundContents(wrapperElement)` to move the contents of the range into the wrapper and insert the wrapper in place of the range.",
    "detailedExplanation": "- **Inline Wrapping**: Perfect for building rich-text editor features (highlight, bold, mark).\n- **Partial Node Splitting Error**: Throws a `BadBoundaryPointsError` if the range splits a non-Text node partially (e.g. start inside one `<div>` and end inside another).\n- **Safe Usage**: Works reliably on pure text selections within a single block element.",
    "codeExample": "function highlightSelection() {\n  const selection = window.getSelection();\n  if (selection.rangeCount > 0) {\n    const range = selection.getRangeAt(0);\n    const mark = document.createElement('mark');\n    mark.className = 'yellow-highlight';\n    \n    // Wraps the selected text with <mark>:\n    range.surroundContents(mark);\n    selection.removeAllRanges(); // Clears highlight cursor\n  }\n}",
    "interviewTips": [
      "Mention that `surroundContents()` throws an error if the range partially intersects non-Text boundary nodes."
    ]
  },
  {
    "topic": "Range and Selection APIs",
    "subtopic": "Selecting Entire Element with selectNodeContents",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you programmatically select the entire contents of a code block or table so the user can copy it in one click?",
    "shortAnswer": "Create a range, call `range.selectNodeContents(element)`, and apply it with `selection.addRange(range)`.",
    "detailedExplanation": "- **selectNodeContents**: Sets the range start at offset 0 and end at the end of the element's child nodes.\n- **selectNode vs selectNodeContents**: `selectNode` includes the element tag itself; `selectNodeContents` selects only the children inside the tag.\n- **One-Click Copy**: Commonly used in 'Copy Code' or 'Select All' utility buttons.",
    "codeExample": "function selectAllCode(codeElement) {\n  const range = document.createRange();\n  range.selectNodeContents(codeElement);\n  \n  const selection = window.getSelection();\n  selection.removeAllRanges();\n  selection.addRange(range);\n}",
    "interviewTips": [
      "Contrast `selectNode` (includes the tag) with `selectNodeContents` (selects only the inner contents)."
    ]
  },
  {
    "topic": "Range and Selection APIs",
    "subtopic": "contenteditable and input Events",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "How does the input event work on contenteditable elements compared to standard form inputs?",
    "shortAnswer": "On a `contenteditable` container, the `input` event fires on every keystroke, paste, or styling command, exposing an `InputEvent` with properties like `inputType` ('insertText', 'deleteContentBackward', 'formatBold').",
    "detailedExplanation": "- **inputType Property**: Identifies the exact user action (e.g. `'insertParagraph'`, `'historyUndo'`).\n- **beforeinput Event**: Fires before the DOM is mutated, allowing `event.preventDefault()` to intercept or customize formatting.\n- **getTargetRanges()**: `beforeinput` exposes `event.getTargetRanges()` indicating which DOM nodes will be modified.",
    "codeExample": "const editor = document.querySelector('#rich-editor');\n\neditor.addEventListener('beforeinput', (e) => {\n  if (e.inputType === 'formatBold') {\n    e.preventDefault();\n    applyCustomMarkdownBold();\n  }\n});",
    "interviewTips": [
      "Highlight `beforeinput` and `e.inputType` as the modern foundation for rich-text editors without deprecated execCommand."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "Back/Forward Cache (bfcache) and pageshow Event",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What is the Back/Forward Cache (bfcache) and why does window.onload not fire when returning via browser back button?",
    "shortAnswer": "The bfcache freezes the entire in-memory snapshot of a page (including JavaScript heap and DOM state) so back/forward navigation is instantaneous. Because the page is restored from memory, `DOMContentLoaded` and `onload` do not re-run; listen for `pageshow` instead.",
    "detailedExplanation": "- **Instant Navigation**: Page state is paused and resumed without re-downloading or re-parsing HTML.\n- **pageshow Event**: Fires whenever a page is shown. Check `event.persisted === true` to know if restored from bfcache.\n- **bfcache Blockers**: Attaching `unload` listeners or leaving open `WebSocket` connections prevents the browser from using bfcache.",
    "codeExample": "window.addEventListener('pageshow', (event) => {\n  if (event.persisted) {\n    console.log('Page was restored from bfcache! Refreshing dynamic auth state...');\n    verifyUserSession();\n  }\n});",
    "interviewTips": [
      "State that `event.persisted` in the `pageshow` listener is how you detect bfcache restoration."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "HTML5 Fullscreen API",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you request and exit fullscreen mode on a DOM element using the Fullscreen API?",
    "shortAnswer": "Call `element.requestFullscreen()` to enter fullscreen; call `document.exitFullscreen()` to return to normal view.",
    "detailedExplanation": "- **User Gesture Mandatory**: Must be called within a transient user interaction (click, keypress); rejected otherwise.\n- **document.fullscreenElement**: Returns the element currently in fullscreen, or `null` if not active.\n- **fullscreenchange Event**: Fires on `document` when fullscreen state changes.\n- **CSS Pseudo-class**: Style fullscreen elements using the `:fullscreen` CSS pseudo-class.",
    "codeExample": "const videoPlayer = document.querySelector('#video-container');\nconst toggleBtn = document.querySelector('#fullscreen-btn');\n\ntoggleBtn.addEventListener('click', async () => {\n  if (!document.fullscreenElement) {\n    await videoPlayer.requestFullscreen();\n  } else {\n    await document.exitFullscreen();\n  }\n});",
    "interviewTips": [
      "Point out that entering fullscreen is called on the ELEMENT (`el.requestFullscreen()`), but exiting is called on the DOCUMENT (`document.exitFullscreen()`)."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "BroadcastChannel API for Cross-Tab DOM Synchronization",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you use the BroadcastChannel API to synchronize DOM UI state across multiple browser tabs in real-time?",
    "shortAnswer": "Instantiate `new BroadcastChannel('channel-name')` across tabs; broadcast messages with `channel.postMessage(data)` and listen via `channel.onmessage`.",
    "detailedExplanation": "- **Same-Origin Only**: Broadcasts exclusively to all browsing contexts (tabs, windows, iframes) on the same origin.\n- **Simpler than Storage Events**: Cleaner and more performant than listening for `window.addEventListener('storage')`.\n- **Clean Teardown**: Call `channel.close()` when components unmount.",
    "codeExample": "const authChannel = new BroadcastChannel('auth_state');\n\n// When user logs out in tab 1:\nauthChannel.postMessage({ action: 'LOGOUT' });\n\n// Tab 2 listens and updates DOM UI immediately:\nauthChannel.onmessage = (event) => {\n  if (event.data.action === 'LOGOUT') {\n    document.querySelector('#user-status').textContent = 'Signed Out';\n    showLoginModal();\n  }\n};",
    "interviewTips": [
      "Mention BroadcastChannel as the modern alternative to hacking localStorage `storage` events for cross-tab synchronization."
    ]
  },
  {
    "topic": "Range and Selection APIs",
    "subtopic": "Selection collapse() and Caret Positioning",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you programmatically collapse a selection to place the blinking cursor at the very end of a text node?",
    "shortAnswer": "Call `selection.collapse(targetNode, targetNode.length)` to position the caret at the end of the text node.",
    "detailedExplanation": "- **collapse() Method**: Collapses the selection to a single insertion point (caret) without selecting text.\n- **collapseToEnd()**: Collapses the active range to its end point.\n- **Focus Sync**: Often paired with `element.focus()` when programmatically setting focus inside an editor.",
    "codeExample": "function placeCaretAtEnd(element) {\n  element.focus();\n  const range = document.createRange();\n  range.selectNodeContents(element);\n  range.collapse(false); // false = collapse to end, true = collapse to start\n  \n  const sel = window.getSelection();\n  sel.removeAllRanges();\n  sel.addRange(range);\n}",
    "interviewTips": [
      "Highlight this function: setting caret at the end of a `contenteditable` element is a very common interview question."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "View Transitions API document.startViewTransition",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "What is the View Transitions API and how does document.startViewTransition() enable animated page state transitions?",
    "shortAnswer": "`document.startViewTransition(updateCallback)` captures snapshots of the current DOM, applies your DOM update callback, and automatically cross-fades or morphs between the old and new DOM states with smooth CSS transitions.",
    "detailedExplanation": "- **Eliminates Animation Complexity**: Eliminates measuring old/new coordinates manually with FLIP animations.\n- **Pseudo-Elements**: Creates temporary pseudo-elements (`::view-transition-old(root)` and `::view-transition-new(root)`) that can be styled with CSS.\n- **Progressive Enhancement**: Fallback is straightforward: `if (!document.startViewTransition) { updateDom(); return; }`.",
    "codeExample": "function switchTheme(isDark) {\n  if (!document.startViewTransition) {\n    document.body.classList.toggle('dark-theme', isDark);\n    return;\n  }\n  \n  // Smoothly morphs the entire DOM layout transition:\n  document.startViewTransition(() => {\n    document.body.classList.toggle('dark-theme', isDark);\n  });\n}",
    "interviewTips": [
      "Mention the View Transitions API as the cutting-edge native web standard replacing complex FLIP animation libraries."
    ]
  },
  {
    "topic": "Range and Selection APIs",
    "subtopic": "Range compareBoundaryPoints",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What is range.compareBoundaryPoints() and how is it used to check if two selections overlap?",
    "shortAnswer": "`rangeA.compareBoundaryPoints(how, rangeB)` compares the start and end boundary positions of two ranges, returning `-1`, `0`, or `1`.",
    "detailedExplanation": "- **Comparison Constants**: `Range.START_TO_START`, `START_TO_END`, `END_TO_END`, `END_TO_START`.\n- **Overlap Detection**: Comparing `END_TO_START` and `START_TO_END` determines whether two text annotations or comment ranges collide.\n- **Annotation Engines**: Used by Google Docs / collaborative editor engines to resolve simultaneous multi-user text ranges.",
    "codeExample": "const isOverlapping = (\n  rangeA.compareBoundaryPoints(Range.END_TO_START, rangeB) > 0 &&\n  rangeA.compareBoundaryPoints(Range.START_TO_END, rangeB) < 0\n);",
    "interviewTips": [
      "Mention `compareBoundaryPoints` when discussing collaborative text editor or annotation tool implementations."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "DocumentFragment Performance vs InnerHTML in High Frequency",
    "difficulty": "INTERMEDIATE",
    "questionType": "PERFORMANCE",
    "question": "Why does appending a DocumentFragment outperform repeated innerHTML assignments in real-time streaming feeds?",
    "shortAnswer": "Assigning to `innerHTML` destroys and reconstructs the entire DOM subtree, discarding event listeners and state, whereas `DocumentFragment.appendChild` only adds new nodes without re-parsing existing elements.",
    "detailedExplanation": "- **Subtree Destruction**: `list.innerHTML += newHtml` re-parses the ENTIRE list from string, destroying all existing DOM nodes and active event handlers.\n- **DocumentFragment Preservation**: Appending a fragment keeps existing nodes intact in memory without recreating them.\n- **Garbage Collection**: Fragment appending generates far less heap garbage for the browser GC.",
    "codeExample": "// BAD (Re-creates entire list on every message):\n// list.innerHTML += `<li>${message}</li>`;\n\n// GOOD (Appends only new node, preserving existing elements):\nconst frag = document.createDocumentFragment();\nconst li = document.createElement('li');\nli.textContent = message;\nfrag.appendChild(li);\nlist.appendChild(frag);",
    "interviewTips": [
      "Emphasize that `element.innerHTML += '...'` is an anti-pattern because it destroys and re-creates all previous child nodes."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "CSS Anchor Positioning API in Modern DOM",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What is the CSS Anchor Positioning API and how does it eliminate JavaScript positioning math for tooltips and popovers?",
    "shortAnswer": "CSS Anchor Positioning links a floating element directly to an 'anchor' element via `anchor-name: --my-anchor` and `position-anchor: --my-anchor`, allowing pure CSS to position tooltips without `getBoundingClientRect()` calculations.",
    "detailedExplanation": "- **Zero JS Coordinates**: Replaces heavy libraries like Popper.js and Floating UI.\n- **Automatic Flip Fallbacks**: Uses `@position-try` to automatically flip tooltips from top to bottom if screen space is tight.\n- **Scroll Resilient**: Floating elements track anchors natively across scrolling and layout changes without scroll event listeners.",
    "codeExample": "/* Defining the anchor button: */\n#anchor-btn {\n  anchor-name: --my-anchor;\n}\n\n/* Anchored floating tooltip in pure CSS: */\n.tooltip {\n  position: fixed;\n  position-anchor: --my-anchor;\n  bottom: anchor(top);\n  left: anchor(center);\n}",
    "interviewTips": [
      "Highlight CSS Anchor Positioning as a major breakthrough eliminating JavaScript coordinate calculation libraries like Floating UI."
    ]
  },
  {
    "topic": "Range and Selection APIs",
    "subtopic": "document.execCommand Deprecation and Alternatives",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "Why was document.execCommand() deprecated and what is the modern replacement for building rich text editors?",
    "shortAnswer": "`document.execCommand()` was deprecated due to inconsistent HTML output across browsers and lack of flexibility; modern editors use the `beforeinput` event, `InputEvent.inputType`, and direct DOM Range manipulation.",
    "detailedExplanation": "- **Inconsistent HTML**: One browser output `<span style=\"font-weight:bold\">`, another output `<b>`, and another output `<strong>`.\n- **beforeinput API**: Provides fine-grained control: intercepts user intentions (`e.inputType === 'formatBold'`) before mutations happen.\n- **Modern Frameworks**: Prosemirror, Lexical, and Slate manage their own document models and render directly to the DOM without `execCommand`.",
    "codeExample": "// DEPRECATED (Avoid in modern code):\n// document.execCommand('bold', false, null);\n\n// MODERN STANDARD (Intercept beforeinput and mutate Range):\neditor.addEventListener('beforeinput', (e) => {\n  if (e.inputType === 'formatBold') {\n    e.preventDefault();\n    toggleBoldOnActiveRange();\n  }\n});",
    "interviewTips": [
      "State clearly that `document.execCommand` is deprecated and modern editors use `beforeinput` and `Range` manipulation."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "window.devicePixelRatio and High-DPI Displays",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you use window.devicePixelRatio to prevent blurry canvas elements on Retina and high-DPI displays?",
    "shortAnswer": "Multiply the canvas internal `width` and `height` pixel dimensions by `window.devicePixelRatio`, while keeping CSS style dimensions at the logical pixel size, then scale the context via `ctx.scale(dpr, dpr)`.",
    "detailedExplanation": "- **Physical vs Logical Pixels**: Retina screens have 2 or 3 physical device pixels per 1 CSS pixel (`devicePixelRatio === 2` or `3`).\n- **Blur Cause**: A 300x150 canvas scaled up by the browser looks fuzzy on 2x screens unless internal pixels match physical pixels.\n- **matchMedia Watcher**: Listen for screen resolution changes when users drag windows across different monitors.",
    "codeExample": "function setupSharpCanvas(canvas, cssWidth, cssHeight) {\n  const dpr = window.devicePixelRatio || 1;\n  // Set display size (CSS pixels):\n  canvas.style.width = `${cssWidth}px`;\n  canvas.style.height = `${cssHeight}px`;\n  // Set actual resolution in memory (physical pixels):\n  canvas.width = Math.floor(cssWidth * dpr);\n  canvas.height = Math.floor(cssHeight * dpr);\n  // Scale drawing context to match logical units:\n  const ctx = canvas.getContext('2d');\n  ctx.scale(dpr, dpr);\n  return ctx;\n}",
    "interviewTips": [
      "Demonstrate this formula for sharp canvas rendering on high-DPI / Retina displays."
    ]
  },
  {
    "topic": "Range and Selection APIs",
    "subtopic": "CSS Custom Highlight API",
    "difficulty": "DIFFICULT",
    "questionType": "CODE",
    "question": "What is the CSS Custom Highlight API (CSS.highlights) and how does it style text search highlights without modifying the DOM tree?",
    "shortAnswer": "The Custom Highlight API allows registering DOM `Range` objects directly into `CSS.highlights`, styling them via the `::highlight(custom-name)` pseudo-element without injecting any `<mark>` or `<span>` wrapper tags.",
    "detailedExplanation": "- **Zero DOM Mutations**: Eliminates wrapping text in `<span>` tags, avoiding broken text node splits and preserving original DOM structure.\n- **Performance**: Dramatically faster for in-page search highlighting across thousands of results.\n- **CSS Integration**: Style with `::highlight(search-result) { background-color: #fef08a; color: #000; }`.",
    "codeExample": "// Create Range objects for search matches:\nconst range1 = document.createRange();\nrange1.setStart(textNode, 0);\nrange1.setEnd(textNode, 5);\n\n// Register custom highlight:\nconst searchHighlight = new Highlight(range1);\nCSS.highlights.set('search-match', searchHighlight);\n\n/* In CSS: */\n/* ::highlight(search-match) { background-color: yellow; color: black; } */",
    "interviewTips": [
      "Mention the CSS Custom Highlight API as the modern zero-DOM-mutation solution for text search highlighting."
    ]
  },
  {
    "topic": "Range and Selection APIs",
    "subtopic": "Handling Caret Coordinates with Range getBoundingClientRect",
    "difficulty": "DIFFICULT",
    "questionType": "CODE",
    "question": "How do you calculate the exact pixel screen coordinates of the blinking cursor (caret) inside a contenteditable element?",
    "shortAnswer": "Extract the active collapsed `Range` from `window.getSelection().getRangeAt(0)` and call `range.getBoundingClientRect()` to retrieve its exact screen pixel coordinates.",
    "detailedExplanation": "- **Collapsed Range Bounds**: Even when collapsed to a 0-width caret, `range.getBoundingClientRect()` returns valid `top`, `bottom`, `left`, and `height`.\n- **Fallback Trick**: If the range is at the end of an empty line, inserting an invisible zero-width space Text node (`'\\u200b'`), measuring, and removing it provides accurate coordinates.\n- **Floating Menu Placement**: Enables positioning @mention or emoji autocomplete popup menus directly above the typing cursor.",
    "codeExample": "function getCaretCoordinates() {\n  const sel = window.getSelection();\n  if (sel.rangeCount === 0) return null;\n  const range = sel.getRangeAt(0).cloneRange();\n  range.collapse(true);\n  const rect = range.getBoundingClientRect();\n  return { top: rect.top, left: rect.left, height: rect.height };\n}",
    "interviewTips": [
      "Use `range.getBoundingClientRect()` as the standard solution for positioning @mention popups right at the blinking cursor."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "Navigation API vs Legacy History API",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "How does the modern Navigation API (window.navigation) resolve the fundamental flaws of window.history?",
    "shortAnswer": "The Navigation API provides a centralized `navigate` event that intercepts all navigations (clicks, back/forward buttons, programmatic jumps), supports asynchronous transition promises, and provides complete state history inspection.",
    "detailedExplanation": "- **Flaw of history.pushState**: Calling `pushState` did not fire `popstate`, forcing SPA routers to monkey-patch history methods.\n- **Unified navigate Event**: Intercepts all internal link clicks and back button triggers in one place via `event.intercept({ handler })`.\n- **Async Transitions**: The `navigate` handler accepts an async function, keeping navigation state in sync with network loading.\n- **History Entries**: `navigation.entries()` returns the full stack of history entries.",
    "codeExample": "if ('navigation' in window) {\n  window.navigation.addEventListener('navigate', (e) => {\n    if (shouldHandleClientSide(e)) {\n      e.intercept({\n        async handler() {\n          const html = await fetchPageContent(e.destination.url);\n          document.querySelector('#app').innerHTML = html;\n        }\n      });\n    }\n  });\n}",
    "interviewTips": [
      "Contrast `window.navigation` with `window.history`: the Navigation API fires for BOTH pushState and back/forward navigations."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "DOMMatrix and CSS Matrix Transforms",
    "difficulty": "DIFFICULT",
    "questionType": "CODE",
    "question": "How do you decompose and calculate the actual rendered rotation and scale of a DOM element using DOMMatrix?",
    "shortAnswer": "Read the computed `transform` matrix string using `getComputedStyle(element).transform`, pass it to `new DOMMatrix(matrixString)`, and extract math properties like `matrix.a`, `matrix.b`, scale, and angle.",
    "detailedExplanation": "- **Standard Object**: `DOMMatrix` is a native Web API for 2D and 3D affine transformation matrices.\n- **Scale Extraction**: `scaleX = Math.hypot(matrix.a, matrix.b)`.\n- **Angle Extraction**: `rotationAngle = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI)`.\n- **Avoids Regex**: Completely replaces messy manual regex parsing of matrix strings.",
    "codeExample": "function getElementScaleAndRotation(element) {\n  const transform = window.getComputedStyle(element).transform;\n  if (transform === 'none') return { scaleX: 1, scaleY: 1, angle: 0 };\n  \n  const matrix = new DOMMatrix(transform);\n  const scaleX = Math.hypot(matrix.a, matrix.b);\n  const angle = Math.round(Math.atan2(matrix.b, matrix.a) * (180 / Math.PI));\n  return { scaleX, angle };\n}",
    "interviewTips": [
      "Use `new DOMMatrix(computedTransform)` as the modern, math-accurate way to decompose CSS transforms."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "structuredClone Limitations with DOM Nodes",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "Why does structuredClone(element) throw a DataCloneError when passed a DOM node, and what is the proper cloning method?",
    "shortAnswer": "DOM nodes are host platform objects tied to C++ engine memory and window contexts; the structured clone algorithm explicitly forbids cloning DOM nodes, throwing a `DataCloneError`. You must use `node.cloneNode(deep)` instead.",
    "detailedExplanation": "- **Structured Clone Spec**: Only clones serializable JavaScript primitives, plain objects, Maps, Sets, and ArrayBuffers.\n- **DOM Node Exception**: DOM nodes, functions, and symbols cannot be cloned with `structuredClone()`.\n- **Deep Cloning**: Always use `element.cloneNode(true)` to create a deep duplicate of a DOM element.",
    "codeExample": "const btn = document.querySelector('button');\n\ntry {\n  // THROWS: DOMException: DataCloneError\n  const badCopy = structuredClone(btn);\n} catch (err) {\n  console.log('DOM nodes cannot be structured-cloned!');\n}\n\n// CORRECT:\nconst safeCopy = btn.cloneNode(true);",
    "interviewTips": [
      "Remember: `structuredClone` rejects DOM nodes, functions, and symbols with a `DataCloneError`."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "Event-Loop Starvation via Microtask Flooding vs DOM Updates",
    "difficulty": "DIFFICULT",
    "questionType": "PERFORMANCE",
    "question": "Why does an infinite Promise.resolve() loop freeze the browser UI and block DOM rendering completely, while an infinite setTimeout loop does not?",
    "shortAnswer": "The browser event loop drains the entire microtask queue before it can proceed to rendering (style/layout/paint) or the next macrotask. Recursive microtasks starve the event loop, freezing the UI completely.",
    "detailedExplanation": "- **Microtask Drain Rule**: The engine will NOT yield to the rendering pipeline or process user inputs until the microtask queue is 100% empty.\n- **Macrotasks (setTimeout)**: The browser runs at most one macrotask per turn, yielding to layout, painting, and user inputs between iterations.\n- **UI Lockup**: Infinite `queueMicrotask` or `Promise.resolve().then(...)` causes an unrecoverable browser tab freeze.",
    "codeExample": "// FREEZES TAB COMPLETELY (DOM rendering blocked):\n// function freeze() { Promise.resolve().then(freeze); }\n// freeze();\n\n// DOES NOT FREEZE TAB (Yields to browser renderer between ticks):\nfunction safeLoop() { setTimeout(safeLoop, 0); }\nsafeLoop();",
    "interviewTips": [
      "Explain the microtask drain rule: the engine refuses to render pixels until the microtask queue is completely empty."
    ]
  },
  {
    "topic": "Range and Selection APIs",
    "subtopic": "selection.isCollapsed Property",
    "difficulty": "EASY",
    "questionType": "CONCEPTUAL",
    "question": "What does the selection.isCollapsed property tell you about the user's active highlight?",
    "shortAnswer": "`selection.isCollapsed` is a boolean that is `true` when the selection's start and end points are identical (meaning it is a single blinking cursor caret with no text highlighted), and `false` when text is actively selected.",
    "detailedExplanation": "- **Caret vs Highlight**: `isCollapsed === true` means the user just clicked without dragging or highlighting text.\n- **UI State**: Used to hide or show floating formatting toolbars (e.g. bold, italic popups).\n- **Performance**: Quickest way to check if any text is highlighted without extracting strings.",
    "codeExample": "document.addEventListener('selectionchange', () => {\n  const selection = window.getSelection();\n  if (selection.isCollapsed) {\n    hideFloatingToolbar();\n  } else {\n    showFloatingToolbar();\n  }\n});",
    "interviewTips": [
      "Mention that `isCollapsed === true` means a single blinking caret, while `false` means highlighted text."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "CSS.supports() Feature Detection",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "How do you detect if the user's browser supports a specific CSS property or value using JavaScript?",
    "shortAnswer": "Call `CSS.supports('property', 'value')` or `CSS.supports('condition')`, which returns `true` if supported by the browser engine and `false` otherwise.",
    "detailedExplanation": "- **Safe Feature Detection**: Checks browser support before applying experimental or modern CSS properties.\n- **Matches @supports**: Exact programmatic equivalent of CSS `@supports (...)` at-rules.\n- **Syntax Varieties**: Supports two-argument `CSS.supports('display', 'grid')` or full strings `CSS.supports('selector(:has(a))')`.",
    "codeExample": "// Checks if browser supports CSS Grid:\nif (CSS.supports('display', 'grid')) {\n  console.log('CSS Grid is supported');\n}\n\n// Checks modern selector support:\nif (CSS.supports('selector(:has(a))')) {\n  console.log(':has() selector supported');\n}",
    "interviewTips": [
      "Highlight `CSS.supports` as the native standard replacing modernizr libraries for CSS feature detection."
    ]
  },
  {
    "topic": "Range and Selection APIs",
    "subtopic": "selection.anchorNode vs focusNode",
    "difficulty": "INTERMEDIATE",
    "questionType": "COMPARISON",
    "question": "What is the difference between anchorNode and focusNode in the DOM Selection API?",
    "shortAnswer": "`anchorNode` is where the user started making the selection (mousedown), while `focusNode` is where the user finished the selection (mouseup).",
    "detailedExplanation": "- **Selection Direction**: If user dragged left-to-right, `anchorNode` precedes `focusNode`. If dragged right-to-left (backward), `focusNode` precedes `anchorNode`.\n- **Offsets**: Paired with `anchorOffset` and `focusOffset`.\n- **Directional Detection**: Comparing them reveals whether the user highlighted forward or backward in the document.",
    "codeExample": "const sel = window.getSelection();\nconsole.log('Selection started at:', sel.anchorNode);\nconsole.log('Selection ended at:', sel.focusNode);",
    "interviewTips": [
      "Use the mouse drag analogy: Anchor is where you pressed down; Focus is where you released."
    ]
  },
  {
    "topic": "Range and Selection APIs",
    "subtopic": "selectionchange Event",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "What is the selectionchange event and where must its listener be attached?",
    "shortAnswer": "The `selectionchange` event fires whenever the active text selection or caret position changes in the document, and it must be attached directly to the `document` object.",
    "detailedExplanation": "- **Document Scoped**: Does not fire on individual elements (except in some newer input specs); standard usage is `document.addEventListener('selectionchange', ...)`.\n- **High Frequency**: Fires on every cursor movement, arrow key press, and text drag.\n- **Debounce Recommended**: Debounce listeners if calculating heavy layout geometries on selection.",
    "codeExample": "document.addEventListener('selectionchange', () => {\n  const selection = window.getSelection();\n  const hasHighlight = !selection.isCollapsed && selection.toString().trim().length > 0;\n  updateToolbarVisibility(hasHighlight);\n});",
    "interviewTips": [
      "Remember that `selectionchange` is registered on `document`, not on `window` or individual input elements."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "Visual Viewport API (window.visualViewport)",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What is the difference between the Layout Viewport and the Visual Viewport on mobile browsers?",
    "shortAnswer": "The Layout Viewport is the full page area rendered by the browser; the Visual Viewport is the specific portion currently visible on the physical screen (which shrinks when the on-screen keyboard opens or when the user pinch-zooms).",
    "detailedExplanation": "- **Mobile Pinch Zoom**: Pinch-zooming doesn't change `window.innerWidth` (layout viewport), but shrinks `window.visualViewport.width`.\n- **Virtual Keyboard**: When the mobile keyboard opens, `visualViewport.height` shrinks dramatically.\n- **VisualViewport Events**: Listen to `window.visualViewport.addEventListener('resize', ...)` and `'scroll'` to position floating keyboards or toolbars accurately.",
    "codeExample": "if (window.visualViewport) {\n  window.visualViewport.addEventListener('resize', () => {\n    const currentHeight = window.visualViewport.height;\n    adjustChatInputBottom(window.innerHeight - currentHeight);\n  });\n}",
    "interviewTips": [
      "Explain the mobile keyboard scenario: layout viewport stays constant, but visual viewport height shrinks."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "element.checkVisibility() Method",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "What is the modern element.checkVisibility() method and how does it replace manual offsetParent checks?",
    "shortAnswer": "`element.checkVisibility(options)` checks whether an element is genuinely visible to the user, evaluating CSS `display: none`, `visibility: hidden`, `content-visibility`, and CSS opacity.",
    "detailedExplanation": "- **Replaces offsetParent**: Legacy code used `el.offsetParent !== null` to test visibility, but that failed for `position: fixed` elements.\n- **Configurable Options**: `{ checkOpacity: true, checkVisibilityCSS: true }`.\n- **content-visibility Aware**: Automatically detects if an element is hidden by `content-visibility: hidden`.",
    "codeExample": "const submitButton = document.querySelector('#submit-btn');\n\n// Checks if button is genuinely visible to user:\nif (submitButton.checkVisibility({ checkOpacity: true })) {\n  console.log('Button is visible and interactive');\n}",
    "interviewTips": [
      "Highlight `checkVisibility()` as the modern web standard replacing the fragile `el.offsetParent !== null` trick."
    ]
  },
  {
    "topic": "DOM Edge Cases & Quirks",
    "subtopic": "SVG Creation with createElementNS",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "Why does document.createElement('svg') fail to render visual SVG shapes, and what must be used instead?",
    "shortAnswer": "Standard HTML tags live in the HTML namespace, while SVGs belong to the XML SVG namespace (`http://www.w3.org/2000/svg`). You must create SVG elements using `document.createElementNS()`. ",
    "detailedExplanation": "- **Namespace Separation**: Elements created with `document.createElement('svg')` are treated as generic unknown HTML elements and lack SVG graphic interfaces.\n- **SVG Namespace URI**: `'http://www.w3.org/2000/svg'`.\n- **Child Nodes**: `<path>`, `<circle>`, `<rect>` must all be created with `createElementNS` using the SVG namespace.",
    "codeExample": "const SVG_NS = 'http://www.w3.org/2000/svg';\n\n// CORRECT (renders properly in SVG engine):\nconst svg = document.createElementNS(SVG_NS, 'svg');\nsvg.setAttribute('viewBox', '0 0 100 100');\n\nconst circle = document.createElementNS(SVG_NS, 'circle');\ncircle.setAttribute('cx', '50');\ncircle.setAttribute('cy', '50');\ncircle.setAttribute('r', '40');\ncircle.setAttribute('fill', '#3b82f6');\n\nsvg.appendChild(circle);\ndocument.body.appendChild(svg);",
    "interviewTips": [
      "This is a classic senior frontend interview trap: `document.createElement('svg')` will NOT render graphics; `createElementNS` is mandatory."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "window.matchMedia and Media Query Listeners",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you detect and listen for CSS media query changes (like dark mode or screen width) in JavaScript?",
    "shortAnswer": "Use `window.matchMedia('(prefers-color-scheme: dark)')` and attach a listener with `.addEventListener('change', callback)`.",
    "detailedExplanation": "- **MediaQueryList Object**: `matchMedia()` returns a `MediaQueryList` object with a `.matches` boolean property.\n- **Reactive Updates**: Fires the `change` listener whenever the user's OS toggles dark mode or resizes past the breakpoint.\n- **Clean Architecture**: Keeps responsive styling state synchronized between CSS and JavaScript without resize polling.",
    "codeExample": "const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');\n\nfunction applyTheme(e) {\n  const isDark = e.matches;\n  document.body.classList.toggle('dark-theme', isDark);\n}\n\n// Initial check:\napplyTheme(darkModeQuery);\n\n// Listen for OS theme toggles:\ndarkModeQuery.addEventListener('change', applyTheme);",
    "interviewTips": [
      "Always use `matchMedia.addEventListener('change', ...)` rather than the deprecated `addListener()`."
    ]
  },
  {
    "topic": "DOM Edge Cases & Quirks",
    "subtopic": "Table DOM APIs (insertRow, insertCell)",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "What are the native HTMLTableElement APIs (insertRow, insertCell) and why are they useful?",
    "shortAnswer": "They provide fast, structured table manipulation methods on `HTMLTableElement` and `HTMLTableRowElement`, creating and inserting `<tr>` and `<td>` elements in valid tree order without manual createElement calls.",
    "detailedExplanation": "- **Automatic Sections**: Calling `table.insertRow()` automatically creates a `<tbody>` if one is missing.\n- **Index Insertion**: `table.insertRow(0)` inserts at the top; `table.insertRow(-1)` appends at the bottom.\n- **Direct Cell Creation**: `row.insertCell(-1)` creates and appends a `<td>` in one step.",
    "codeExample": "const table = document.querySelector('#data-table');\n\n// Appends a new row at the end of the table:\nconst newRow = table.insertRow(-1);\n\n// Appends two cells to the new row:\nconst cell1 = newRow.insertCell(0);\nconst cell2 = newRow.insertCell(1);\n\ncell1.textContent = 'Alice';\ncell2.textContent = 'Engineer';",
    "interviewTips": [
      "Mention `table.insertRow(-1)` as the clean built-in API for table row appending."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "document.compatMode Standards vs Quirks Mode",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What does document.compatMode indicate and why does omitting <!DOCTYPE html> break modern DOM layouts?",
    "shortAnswer": "`document.compatMode` returns `'CSS1Compat'` (Standards mode) or `'BackCompat'` (Quirks mode). Omitting `<!DOCTYPE html>` triggers Quirks mode, causing browsers to emulate 1990s Netscape/IE box model bugs.",
    "detailedExplanation": "- **Quirks Mode (`BackCompat`)**: Box-sizing, font-size inheritance in tables, and percentage height calculations behave according to ancient buggy browser behaviors.\n- **Standards Mode (`CSS1Compat`)**: Complies fully with W3C CSS specifications.\n- **HTML5 Doctype**: `<!DOCTYPE html>` ensures modern browsers always render in Standards mode (`CSS1Compat`).",
    "codeExample": "if (document.compatMode === 'BackCompat') {\n  console.warn('Page is rendering in Quirks Mode! Missing <!DOCTYPE html>.');\n}",
    "interviewTips": [
      "State that `document.compatMode === 'CSS1Compat'` indicates standards mode and `'BackCompat'` indicates quirks mode."
    ]
  },
  {
    "topic": "DOM Edge Cases & Quirks",
    "subtopic": "Form elements Collection vs querySelector",
    "difficulty": "INTERMEDIATE",
    "questionType": "COMPARISON",
    "question": "Why is form.elements collection preferred over form.querySelectorAll('input, select, textarea')?",
    "shortAnswer": "`form.elements` is a dedicated live HTMLFormControlsCollection containing only valid submittable controls, accessible instantly by name (`form.elements['username']`), without running CSS selector engine queries.",
    "detailedExplanation": "- **Direct Name Access**: Access any form control via its `name` attribute: `form.elements.email`.\n- **Radio Groups**: Multiple radios sharing the same name return a `RadioNodeList` collection directly.\n- **Excludes Non-Controls**: Automatically ignores unrelated container elements, buttons with `type=\"button\"`, or custom icons inside the form.",
    "codeExample": "const form = document.querySelector('#checkout');\n\n// Fast named property lookup:\nconst userEmail = form.elements['email'].value;\nconst deliveryOption = form.elements['delivery'].value; // RadioNodeList value!",
    "interviewTips": [
      "Showcase `form.elements['name'].value` as the most idiomatic way to read form fields in vanilla JavaScript."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "document.doctype Property",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What is document.doctype and what kind of DOM node does it represent?",
    "shortAnswer": "`document.doctype` is a read-only `DocumentType` node representing the document's `<!DOCTYPE html>` declaration, having `nodeType === 10`.",
    "detailedExplanation": "- **Document Child**: It is a direct child of `document` (alongside `document.documentElement`).\n- **Properties**: `doctype.name` returns `'html'` for standard HTML5 pages.\n- **nodeType**: Value is `10` (`Node.DOCUMENT_TYPE_NODE`).",
    "codeExample": "console.log(document.doctype.name);     // 'html'\nconsole.log(document.doctype.nodeType); // 10 (DOCUMENT_TYPE_NODE)",
    "interviewTips": [
      "Note that `document.doctype` has `nodeType === 10` and is an actual node in the DOM tree."
    ]
  },
  {
    "topic": "Range and Selection APIs",
    "subtopic": "Selection removeAllRanges and addRange",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "Why must you call selection.removeAllRanges() before calling selection.addRange(range)?",
    "shortAnswer": "Most browsers enforce single-range selections; calling `addRange()` when an existing range is already present can fail or generate warnings unless previous ranges are cleared first.",
    "detailedExplanation": "- **Multi-Selection History**: The spec permits multiple ranges (supported historically in Firefox via Ctrl+select), but most browsers only support one active range.\n- **Safe Pattern**: Always call `sel.removeAllRanges()` first to ensure clean single-range application.\n- **Modern Alternative**: `selection.empty()` is an alias supported in some engines.",
    "codeExample": "const sel = window.getSelection();\nconst range = document.createRange();\nrange.selectNode(document.querySelector('#highlight-me'));\n\n// Mandatory clean reset before adding new range:\nsel.removeAllRanges();\nsel.addRange(range);",
    "interviewTips": [
      "Always write `sel.removeAllRanges()` immediately before `sel.addRange(range)`."
    ]
  },
  {
    "topic": "DOM Edge Cases & Quirks",
    "subtopic": "HTML Option Collection & selectedIndex",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you programmatically select the first option of a <select> dropdown and access its text?",
    "shortAnswer": "Set `select.selectedIndex = 0`, and access the displayed text via `select.options[select.selectedIndex].text`.",
    "detailedExplanation": "- **selectedIndex Property**: Integer index of the currently selected `<option>` (returns `-1` if nothing selected).\n- **options Collection**: An `HTMLOptionsCollection` of all `<option>` elements in the dropdown.\n- **Value vs Text**: `option.value` is the data submitted with forms; `option.text` is the label visible to the user.",
    "codeExample": "const countrySelect = document.querySelector('#country');\n\n// Selects first option:\ncountrySelect.selectedIndex = 0;\n\n// Reads visible label:\nconst visibleLabel = countrySelect.options[countrySelect.selectedIndex].text;\nconsole.log('Selected label:', visibleLabel);",
    "interviewTips": [
      "Explain the difference between `option.value` (internal ID) and `option.text` (visible user label)."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "XMLSerializer for DOM to String Serialization",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you serialize a complete DOM subtree (including XML/SVG nodes) into an XML string using XMLSerializer?",
    "shortAnswer": "Instantiate `new XMLSerializer()` and call `serializer.serializeToString(node)`.",
    "detailedExplanation": "- **XML & SVG Resilient**: Unlike `innerHTML`, `XMLSerializer` correctly preserves XML namespaces and self-closing tags (`<circle />`).\n- **Complete Trees**: Can serialize entire documents or individual element subtrees.\n- **Use Case**: Exporting an in-memory generated SVG chart to a downloadable SVG file.",
    "codeExample": "const svgElement = document.querySelector('svg');\n\nconst serializer = new XMLSerializer();\nconst svgXmlString = serializer.serializeToString(svgElement);\n\n// Create downloadable SVG file blob:\nconst blob = new Blob([svgXmlString], { type: 'image/svg+xml' });\nconst downloadUrl = URL.createObjectURL(blob);",
    "interviewTips": [
      "Recommend `XMLSerializer` for exporting client-side SVGs or XML documents into strings."
    ]
  },
  {
    "topic": "DOM Edge Cases & Quirks",
    "subtopic": "Node.isConnected Property",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What is the node.isConnected property and how does it replace document.body.contains(node)?",
    "shortAnswer": "`node.isConnected` is a native boolean that is `true` if the node is connected to an active document or Shadow Root, and `false` if it is detached in memory.",
    "detailedExplanation": "- **Modern Standard**: Much faster than `document.contains(node)` because it reads an internal C++ connection bit directly.\n- **Shadow DOM Support**: Correctly returns `true` for elements connected inside Shadow Roots.\n- **Detached Node Check**: Used by cleanup routines and observers to avoid updating detached elements.",
    "codeExample": "const div = document.createElement('div');\nconsole.log(div.isConnected); // false (in memory)\n\ndocument.body.appendChild(div);\nconsole.log(div.isConnected); // true (connected to document)\n\ndiv.remove();\nconsole.log(div.isConnected); // false (detached again)",
    "interviewTips": [
      "Always recommend `node.isConnected` over `document.body.contains(node)` for checking DOM connection."
    ]
  },
  {
    "topic": "Range and Selection APIs",
    "subtopic": "range.intersectsNode()",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you check if a specific element or node intersects with a DOM Range using intersectsNode()?",
    "shortAnswer": "Call `range.intersectsNode(node)`, which returns `true` if any part of the node falls within the range boundaries.",
    "detailedExplanation": "- **Intersection Check**: Returns `true` if the node is partially or completely inside the range.\n- **Highlighting Use Case**: Useful for checking whether an image, link, or table row is included in the user's active highlight.\n- **Throws Exception**: Throws `NotFoundError` if the node's root document doesn't match the range's document.",
    "codeExample": "const selection = window.getSelection();\nif (selection.rangeCount > 0) {\n  const range = selection.getRangeAt(0);\n  const warningBox = document.querySelector('.warning-box');\n  \n  if (range.intersectsNode(warningBox)) {\n    console.log('User highlighted part of the warning box');\n  }\n}",
    "interviewTips": [
      "Mention `range.intersectsNode(node)` as a clean method to check if a specific component is inside the user's selection."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "CSS Scroll-Driven Animations API in DOM",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What are CSS Scroll-Driven Animations and how do they eliminate scroll event listener performance bottlenecks?",
    "shortAnswer": "Scroll-Driven Animations link animation timelines directly to scroll offsets via `animation-timeline: scroll()` or `view()`, executing entirely on the compositor thread with zero JavaScript main-thread involvement.",
    "detailedExplanation": "- **Compositor Execution**: Animates scroll progress indicators and parallax effects without dropped frames or lag.\n- **Zero JS Event Listeners**: Completely eliminates `window.addEventListener('scroll')` for animation triggers.\n- **View Timeline**: `animation-timeline: view()` tracks when elements enter and exit the viewport (scroll-driven entrance effects).",
    "codeExample": "/* Pure CSS Scroll Progress Bar (Compositor thread, zero JavaScript!): */\n.scroll-progress-bar {\n  animation: fillProgress linear;\n  animation-timeline: scroll();\n}\n\n@keyframes fillProgress {\n  from { transform: scaleX(0); }\n  to { transform: scaleX(1); }\n}",
    "interviewTips": [
      "Highlight Scroll-Driven Animations as the modern CSS feature replacing scroll listeners for reading progress bars."
    ]
  },
  {
    "topic": "DOM Edge Cases & Quirks",
    "subtopic": "RadioNodeList Interface",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What is a RadioNodeList and how does its .value property work?",
    "shortAnswer": "When multiple radio inputs share the same `name` attribute in a form, `form.elements[name]` returns a `RadioNodeList`. Reading its `.value` property directly returns the value of the currently checked radio button.",
    "detailedExplanation": "- **Automatic Resolution**: Avoids looping through all radios with `for...of` to find which one has `checked === true`.\n- **Setting Value**: Setting `radioList.value = 'credit'` automatically checks the matching radio button and unchecks others.\n- **Returns Empty String**: Returns `\"\"` if no radio button in the group is checked.",
    "codeExample": "const form = document.querySelector('#billing-form');\nconst paymentMethod = form.elements['payment']; // RadioNodeList\n\n// Reads selected value instantly:\nconsole.log('Selected payment:', paymentMethod.value);\n\n// Programmatically selects a radio button:\npaymentMethod.value = 'paypal';",
    "interviewTips": [
      "Mention `RadioNodeList` and its convenient `.value` getter/setter."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "window.requestVideoFrameCallback",
    "difficulty": "INTERMEDIATE",
    "questionType": "PERFORMANCE",
    "question": "What is requestVideoFrameCallback() and why is it superior to requestAnimationFrame for canvas video processing?",
    "shortAnswer": "`video.requestVideoFrameCallback(callback)` executes right when a new video frame is decoded and presented to the compositor, ensuring canvas filters and frame extraction stay 100% synchronized with video framerates.",
    "detailedExplanation": "- **Prevents Dropped/Duplicated Frames**: `requestAnimationFrame` runs at 60Hz/120Hz display rate, while video might run at 24Hz or 30Hz, causing redundant canvas draws.\n- **Frame Metadata**: Passes video frame presentation time, expected display time, and decoded frame count.\n- **Battery Savings**: Only executes when new video frames actually arrive.",
    "codeExample": "const video = document.querySelector('video');\nconst canvas = document.querySelector('canvas');\nconst ctx = canvas.getContext('2d');\n\nfunction processFrame(now, metadata) {\n  ctx.drawImage(video, 0, 0);\n  applyGreenScreenShader(ctx);\n  // Re-registers for next decoded video frame:\n  video.requestVideoFrameCallback(processFrame);\n}\nvideo.requestVideoFrameCallback(processFrame);",
    "interviewTips": [
      "Cite `requestVideoFrameCallback` as the standard API for synchronizing canvas rendering with HTML5 video frames."
    ]
  },
  {
    "topic": "DOM Edge Cases & Quirks",
    "subtopic": "HTML Option Constructor",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you create and add a new <option> to a <select> element using the Option constructor?",
    "shortAnswer": "Use `new Option(text, value, defaultSelected, selected)` and add it to the select element with `select.add(option)`.",
    "detailedExplanation": "- **Option Constructor**: Signature is `new Option(text, value, defaultSelected, selected)`.\n- **select.add()**: Native helper method on `HTMLSelectElement`.\n- **Clean Idiom**: Much more concise than multiple `createElement`, `setAttribute`, and `textContent` calls.",
    "codeExample": "const select = document.querySelector('#role-select');\n\n// Creates: <option value=\"admin\" selected>Administrator</option>\nconst adminOption = new Option('Administrator', 'admin', false, true);\nselect.add(adminOption);",
    "interviewTips": [
      "Show the `new Option(text, value, defaultSelected, selected)` constructor as an elegant one-line pattern."
    ]
  },
  {
    "topic": "Range and Selection APIs",
    "subtopic": "range.collapse() Directional Parameter",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "What does the boolean parameter in range.collapse(toStart) control?",
    "shortAnswer": "If `toStart` is `true`, the range collapses to its start boundary; if `false`, it collapses to its end boundary.",
    "detailedExplanation": "- **Default Value**: `toStart` defaults to `false` in standard specifications (collapsing to end).\n- **Caret Placement**: Useful for placing the cursor immediately before or after an inserted node.\n- **isCollapsed**: After calling `collapse()`, `range.collapsed` becomes `true`.",
    "codeExample": "const range = document.createRange();\nrange.selectNode(document.querySelector('#target-span'));\n\n// Collapses range to the start (before the span):\nrange.collapse(true);\n\n// Collapses range to the end (after the span):\nrange.collapse(false);",
    "interviewTips": [
      "Remember: `true` collapses to start, `false` collapses to end."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "document.characterSet Property",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What is document.characterSet and how is it determined by the browser?",
    "shortAnswer": "`document.characterSet` returns the character encoding used to render the document (typically `'UTF-8'`), determined by the `<meta charset=\"UTF-8\">` tag or the HTTP `Content-Type: text/html; charset=utf-8` header.",
    "detailedExplanation": "- **Read-Only**: Reflects the parsed encoding of the document.\n- **Encoding Precedence**: HTTP header takes precedence over the HTML `<meta charset>` tag.\n- **Security**: UTF-8 is required across modern applications to prevent UTF-7 charset switching XSS attacks.",
    "codeExample": "console.log('Active document encoding:', document.characterSet); // 'UTF-8'",
    "interviewTips": [
      "Mention that UTF-8 is universal and prevents historic charset-switching XSS attacks."
    ]
  },
  {
    "topic": "DOM Edge Cases & Quirks",
    "subtopic": "Node.normalize() Method",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "What does node.normalize() do and when is it required after DOM text node manipulations?",
    "shortAnswer": "`node.normalize()` puts the DOM subtree into a 'normalized' form by merging adjacent Text nodes into a single Text node and removing empty Text nodes.",
    "detailedExplanation": "- **Fragmentation Fix**: Manual operations like `node.splitText()` or multiple `appendChild(textNode)` leave fragmented adjacent text nodes.\n- **XPath & Query Resilient**: Fragmented text nodes break XPath queries and regex text matching.\n- **Single Node**: Restores the clean state where there are no adjacent Text nodes in the tree.",
    "codeExample": "const p = document.createElement('p');\np.appendChild(document.createTextNode('Hello '));\np.appendChild(document.createTextNode('World!'));\n\nconsole.log(p.childNodes.length); // 2\n\np.normalize(); // Merges adjacent text nodes!\nconsole.log(p.childNodes.length); // 1\nconsole.log(p.firstChild.textContent); // 'Hello World!'",
    "interviewTips": [
      "Explain that `node.normalize()` merges adjacent Text nodes and strips empty ones."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "window.open with Noopener in JavaScript",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you securely open a new window or tab in JavaScript without leaking the window.opener reference?",
    "shortAnswer": "Pass `'noopener,noreferrer'` in the third features argument: `window.open(url, '_blank', 'noopener,noreferrer')`.",
    "detailedExplanation": "- **Protects Opener**: Setting `noopener` guarantees that `window.opener` is `null` in the opened child window.\n- **Independent Process**: Allows modern browsers to run the child tab in a completely separate OS rendering process, boosting security and performance.\n- **Safety**: Prevents the opened tab from navigating the parent window via `window.opener.location`.",
    "codeExample": "function openSecurePopup(url) {\n  // Guarantees child tab cannot access opener:\n  window.open(url, '_blank', 'noopener,noreferrer');\n}",
    "interviewTips": [
      "Always specify `'noopener,noreferrer'` when calling `window.open()`."
    ]
  },
  {
    "topic": "DOM Edge Cases & Quirks",
    "subtopic": "Text.splitText() Method",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "What is textNode.splitText(offset) and how does it split a single Text node into two siblings?",
    "shortAnswer": "`textNode.splitText(offset)` splits the Text node at the specified character offset into two adjacent sibling Text nodes, returning the newly created second Text node.",
    "detailedExplanation": "- **In-Place Split**: The original node keeps text up to `offset`; the new node gets text from `offset` onward.\n- **Inline Formatting**: Essential for wrapping a specific word in `<b>` or `<span>` without rebuilding the entire paragraph.\n- **Reversible**: Call `parent.normalize()` to merge the split nodes back together.",
    "codeExample": "const p = document.querySelector('p'); // Contains text 'Frontend Developer'\nconst textNode = p.firstChild;\n\n// Splits after 'Frontend ' (offset 9):\nconst secondTextNode = textNode.splitText(9);\n\n// Inserts a badge between the two split text nodes:\nconst badge = document.createElement('span');\nbadge.className = 'highlight';\nbadge.textContent = 'SENIOR ';\np.insertBefore(badge, secondTextNode);\n// Result: Frontend <span class=\"highlight\">SENIOR </span>Developer",
    "interviewTips": [
      "Highlight `textNode.splitText(offset)` as the exact API used to insert inline DOM tags right into the middle of text nodes."
    ]
  },
  {
    "topic": "Range and Selection APIs",
    "subtopic": "Shadow DOM Selection Boundary Piercing",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "How does window.getSelection() behave when text is highlighted inside a Shadow Root, and how do you access the shadow selection?",
    "shortAnswer": "`window.getSelection()` returns `null` or the host element when text is selected inside a Shadow Root. You must call `shadowRoot.getSelection()` (where supported) to inspect selections inside shadow DOM boundaries.",
    "detailedExplanation": "- **Encapsulation Protection**: `window.getSelection()` treats the shadow root as an opaque boundary.\n- **shadowRoot.getSelection()**: Returns the specific selection range inside that shadow tree.\n- **Selection API Spec**: Working Group continues refining cross-root selection standards for web components.",
    "codeExample": "const customEditor = document.querySelector('custom-editor');\nconst shadow = customEditor.shadowRoot;\n\nif (shadow && shadow.getSelection) {\n  const shadowSel = shadow.getSelection();\n  console.log('Text selected inside shadow DOM:', shadowSel.toString());\n}",
    "interviewTips": [
      "Point out that standard `window.getSelection()` cannot inspect text highlights inside Shadow Roots."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "WeakRef and FinalizationRegistry with DOM Nodes",
    "difficulty": "DIFFICULT",
    "questionType": "CODE",
    "question": "How can you use WeakRef and FinalizationRegistry to manage caches of DOM elements without causing memory leaks?",
    "shortAnswer": "Wrap cached DOM node references in `new WeakRef(element)` and register cleanup hooks with `FinalizationRegistry`, allowing the browser garbage collector to reclaim detached DOM nodes freely.",
    "detailedExplanation": "- **Weak References**: A `WeakRef` allows referencing a DOM element without preventing garbage collection if it is detached from the DOM and has no other strong references.\n- **FinalizationRegistry**: Runs a callback when the garbage collector reclaims the element, letting you clean up associated map keys.\n- **Cache Safety**: Prevents memory leaks in long-running SPA caches.",
    "codeExample": "const elementCache = new Map();\nconst registry = new FinalizationRegistry((key) => {\n  console.log(`Element for key ${key} was garbage collected!`);\n  elementCache.delete(key);\n});\n\nfunction cacheElement(key, element) {\n  elementCache.set(key, new WeakRef(element));\n  registry.register(element, key);\n}\n\nfunction getElement(key) {\n  const ref = elementCache.get(key);\n  return ref ? ref.deref() : null;\n}",
    "interviewTips": [
      "Demonstrate `WeakRef` and `FinalizationRegistry` as senior architecture patterns for leak-proof DOM element caches."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "Service Worker and DOM Interaction Boundaries",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "Can a Service Worker access or manipulate the DOM directly? If not, how does it update the user interface?",
    "shortAnswer": "No, Service Workers run on a background thread in a worker context where `window`, `document`, and the DOM do not exist. To update the UI, the Service Worker sends messages via `postMessage` to active clients, which update the DOM.",
    "detailedExplanation": "- **No DOM Access**: Workers have no `document` object to prevent thread concurrency race conditions.\n- **Client Communication**: Service Worker calls `client.postMessage({ type: 'SYNC_COMPLETE' })` on matching `clients.matchAll()`.\n- **Client-Side Listener**: `navigator.serviceWorker.addEventListener('message', ...)` receives the event and updates the DOM on the main thread.",
    "codeExample": "// Inside Service Worker (sw.js):\nself.clients.matchAll().then(clients => {\n  clients.forEach(client => {\n    client.postMessage({ type: 'CACHE_UPDATED' });\n  });\n});\n\n// Inside main thread DOM script:\nnavigator.serviceWorker.addEventListener('message', (event) => {\n  if (event.data.type === 'CACHE_UPDATED') {\n    document.querySelector('#update-toast').classList.add('visible');\n  }\n});",
    "interviewTips": [
      "Emphasize that workers NEVER have direct DOM access to prevent multi-threaded race conditions in the rendering tree."
    ]
  },
  {
    "topic": "Range and Selection APIs",
    "subtopic": "Multi-Range Selections in DOM Level 2",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "What is a multi-range selection, which browsers support it, and how does selection.rangeCount reflect it?",
    "shortAnswer": "A multi-range selection allows selecting multiple disjoint blocks of text simultaneously (e.g. multiple table cells using Ctrl+Click). `selection.rangeCount` indicates how many ranges exist (almost always 1 in Chromium/WebKit, but >1 in Gecko Firefox).",
    "detailedExplanation": "- **Gecko / Firefox History**: Firefox historically supported non-contiguous multi-selections via Ctrl+click in tables.\n- **Chromium / Safari**: Enforces `rangeCount <= 1`. Calling `addRange()` replaces the existing range instead of appending.\n- **Defensive Coding**: Always loop through `rangeCount` or check `if (sel.rangeCount > 0)` before calling `sel.getRangeAt(0)`.",
    "codeExample": "const sel = window.getSelection();\nfor (let i = 0; i < sel.rangeCount; i++) {\n  const range = sel.getRangeAt(i);\n  console.log(`Range #${i + 1} text:`, range.toString());\n}",
    "interviewTips": [
      "State that `selection.rangeCount` can theoretically be >1 in Firefox, but Chromium and WebKit strictly limit it to 1."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "BFCache Invalidation Causes",
    "difficulty": "DIFFICULT",
    "questionType": "PERFORMANCE",
    "question": "What specific DOM APIs and network patterns disqualify a web page from being stored in the browser's BFCache?",
    "shortAnswer": "Pages are disqualified from BFCache by: attaching `unload` event listeners, having active `WebSocket` or `WebRTC` connections, using `Cache-Control: no-store`, or holding unclosed IndexedDB transactions.",
    "detailedExplanation": "- **unload Listener**: The #1 cause of BFCache disqualification; replace all `unload` listeners with `pagehide` or `visibilitychange`.\n- **Open Sockets**: Active WebSockets or open Web Locks prevent the browser from freezing the JavaScript heap.\n- **no-store Header**: HTTP `Cache-Control: no-store` tells browsers the content is sensitive and must not be cached.\n- **Testing**: Test in Chrome DevTools -> Application -> Back/forward cache.",
    "codeExample": "// DISQUALIFIES PAGE FROM BFCACHE (Do NOT use):\n// window.addEventListener('unload', cleanup);\n\n// BFCACHE COMPATIBLE (Safe replacement):\nwindow.addEventListener('pagehide', (e) => {\n  cleanupState();\n});",
    "interviewTips": [
      "Warn that `window.addEventListener('unload')` kills BFCache performance across the entire application."
    ]
  },
  {
    "topic": "DOM Edge Cases & Quirks",
    "subtopic": "Case Sensitivity Across HTML vs XML/SVG DOM",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "How does case sensitivity differ between HTML and XML/SVG DOM methods (e.g. tagName, getAttribute)?",
    "shortAnswer": "In HTML documents, tag and attribute names are normalized to uppercase for `tagName` (`'DIV'`) and lowercase for attributes, whereas in XML/SVG documents, tag and attribute names are strictly case-sensitive.",
    "detailedExplanation": "- **HTML tagName**: `div.tagName` returns `'DIV'` (uppercase).\n- **SVG/XML tagName**: `path.tagName` returns `'path'` (case-sensitive exact casing).\n- **camelCase SVG Attributes**: `viewBox`, `preserveAspectRatio` require exact casing in `setAttribute('viewBox', '...')`.\n- **Selectors**: CSS selectors in HTML are case-insensitive for tags; in XML they are case-sensitive.",
    "codeExample": "const htmlDiv = document.createElement('div');\nconsole.log(htmlDiv.tagName); // 'DIV' (HTML normalizes to uppercase)\n\nconst svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');\nconsole.log(svgPath.tagName); // 'path' (SVG/XML preserves exact lowercase)",
    "interviewTips": [
      "Point out that HTML `tagName` returns uppercase, but SVG/XML `tagName` preserves exact author casing."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "Web Locks API for Cross-Tab DOM Coordination",
    "difficulty": "DIFFICULT",
    "questionType": "CODE",
    "question": "How does the Web Locks API (navigator.locks) prevent race conditions when multiple tabs write to shared DOM or IndexedDB storage?",
    "shortAnswer": "Call `navigator.locks.request('lock_name', async (lock) => { ... })` to acquire an exclusive lock, ensuring only one browser tab can execute the critical section at a time.",
    "detailedExplanation": "- **Exclusive vs Shared**: Default is exclusive (one tab at a time); `{ mode: 'shared' }` allows multiple concurrent readers.\n- **Automatic Release**: Lock is automatically released as soon as the async callback Promise resolves or rejects.\n- **Tab Crash Resilient**: If a tab crashes or is closed, the browser engine automatically releases the lock.",
    "codeExample": "async function syncCartAcrossTabs() {\n  if ('locks' in navigator) {\n    await navigator.locks.request('cart_sync_lock', async (lock) => {\n      console.log('Acquired exclusive lock! Updating shared cart...');\n      await performCriticalCartMutation();\n      console.log('Lock released automatically');\n    });\n  }\n}",
    "interviewTips": [
      "Mention the Web Locks API as the native cross-tab mutex preventing write collisions in storage and DOM synchronizations."
    ]
  },
  {
    "topic": "Range and Selection APIs",
    "subtopic": "Cloning Range and Boundary Integrity",
    "difficulty": "DIFFICULT",
    "questionType": "CODE",
    "question": "Why should you call range.cloneRange() before performing DOM mutations that depend on selection coordinates?",
    "shortAnswer": "DOM Range objects are 'live': mutating the DOM tree shifts range boundary offsets automatically. Calling `range.cloneRange()` snapshots the boundary points at that specific moment.",
    "detailedExplanation": "- **Live Boundary Drift**: Inserting an element before the range start pushes the range's start offset forward.\n- **Snapshotting**: `const frozenRange = activeRange.cloneRange()` freezes the coordinates in memory.\n- **Safe Inspection**: Allows inspecting dimensions or text without worrying about concurrent DOM mutations shifting the range.",
    "codeExample": "const sel = window.getSelection();\nif (sel.rangeCount > 0) {\n  const originalRange = sel.getRangeAt(0);\n  const savedRange = originalRange.cloneRange(); // Frozen snapshot\n  \n  // Mutate DOM safely:\n  insertInlineAdBanner();\n  \n  // Restore original selection:\n  sel.removeAllRanges();\n  sel.addRange(savedRange);\n}",
    "interviewTips": [
      "Explain that Range objects are live, so `cloneRange()` is necessary to take an immutable snapshot before mutations."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "DOM Tree Depth Limits & Maximum Call Stack Hazards",
    "difficulty": "DIFFICULT",
    "questionType": "PERFORMANCE",
    "question": "What performance hazards and browser limits exist regarding excessively deep DOM tree nesting (>32 levels)?",
    "shortAnswer": "Excessively deep DOM nesting causes stack overflow during recursive style calculations, severely degrades selector matching speed, triggers layout invalidation cascades, and increases memory footprint.",
    "detailedExplanation": "- **Lighthouse Penalty**: Google Lighthouse flags DOM trees deeper than 32 levels or containing more than 1,500 total nodes.\n- **Selector Complexity**: Deep nesting magnifies the cost of child combinators and `:has()` queries.\n- **Flatter Architecture**: Refactoring deep wrapper trees into flat CSS Grid or Flexbox layouts restores high 60fps rendering speeds.",
    "codeExample": "function getDomDepth(node) {\n  let depth = 1;\n  while (node.parentElement) {\n    depth++;\n    node = node.parentElement;\n  }\n  return depth;\n}\nconsole.log('Deepest element depth:', getDomDepth(document.querySelector('.nested-leaf')));",
    "interviewTips": [
      "Mention Google Lighthouse's threshold: max DOM depth of 32 levels and maximum of 1,500 nodes."
    ]
  },
  {
    "topic": "DOM Edge Cases & Quirks",
    "subtopic": "Custom Element Upgrading (customElements.upgrade)",
    "difficulty": "DIFFICULT",
    "questionType": "CODE",
    "question": "What does customElements.upgrade(root) do and when is it necessary?",
    "shortAnswer": "`customElements.upgrade(root)` manually triggers the upgrade lifecycle on all custom elements inside an off-screen or detached DOM subtree before it is inserted into the main document.",
    "detailedExplanation": "- **Automatic Timing**: Normally, elements upgrade when `customElements.define()` is called or when inserted into the document.\n- **Detached Trees**: If you build a large DocumentFragment or template offscreen containing custom elements, they remain un-upgraded until inserted.\n- **Immediate Access**: Calling `customElements.upgrade(fragment)` initializes constructors and methods so you can configure custom properties before mounting.",
    "codeExample": "const fragment = document.createDocumentFragment();\nconst card = document.createElement('user-card');\nfragment.appendChild(card);\n\n// Manually upgrades the off-screen subtree:\ncustomElements.upgrade(fragment);\n\n// Now custom class methods and properties are active immediately:\ncard.setUserData({ name: 'Alice' });\ndocument.body.appendChild(fragment);",
    "interviewTips": [
      "Explain that `customElements.upgrade()` lets you initialize custom element methods on detached subtrees before mounting."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "Speculative HTML Parsing and Preload Scanner",
    "difficulty": "DIFFICULT",
    "questionType": "PERFORMANCE",
    "question": "What is the browser's Speculative HTML Parser (Preload Scanner) and how does dynamically injecting <script> tags bypass it?",
    "shortAnswer": "The Preload Scanner scans upcoming HTML in a background thread to discover and prefetch external resources (scripts, CSS, images) ahead of the main parser. Dynamically creating script tags with `document.createElement('script')` is invisible to the Preload Scanner, delaying downloads.",
    "detailedExplanation": "- **Parallel Scanning**: While the main thread is blocked executing a synchronous script, the Preload Scanner downloads external CSS and images in the background.\n- **Dynamic Script Penalty**: Scripts inserted via `document.createElement('script')` are discovered late, after the parent script finishes.\n- **Solution**: Use static HTML tags `<script src=\"...\" defer>` or `<link rel=\"preload\">` for critical bundles.",
    "codeExample": "<!-- DISCOVERED EARLY by Preload Scanner (Fast, parallel download): -->\n<link rel=\"preload\" href=\"/critical-bundle.js\" as=\"script\">\n\n<!-- DISCOVERED LATE (Hidden from Preload Scanner until JS executes): -->\n<!-- const s = document.createElement('script'); s.src = '/critical-bundle.js'; document.head.appendChild(s); -->",
    "interviewTips": [
      "Highlight the Preload Scanner as the reason why static tags and `rel=\"preload\"` outperform dynamic script injection."
    ]
  },
  {
    "topic": "Range and Selection APIs",
    "subtopic": "Range.createContextualFragment() vs innerHTML",
    "difficulty": "DIFFICULT",
    "questionType": "PERFORMANCE",
    "question": "What is range.createContextualFragment() and why is it superior to innerHTML when parsing HTML strings inside specific contexts?",
    "shortAnswer": "`range.createContextualFragment(htmlString)` parses an HTML string within the exact parsing context of the range's container element, returning a DocumentFragment without creating temporary wrapper elements.",
    "detailedExplanation": "- **Context-Aware Parsing**: Parsing `<tr><td>Data</td></tr>` directly in a `<div>` fails because `<tr>` cannot be a child of `<div>`. A range inside a `<tbody>` parses `<tr>` properly.\n- **Direct Fragment**: Returns a `DocumentFragment` ready for atomic DOM insertion.\n- **High Performance**: Native C++ parsing avoiding dummy wrapper allocation.",
    "codeExample": "const tableBody = document.querySelector('tbody');\nconst range = document.createRange();\nrange.selectNodeContents(tableBody);\n\n// Parses <tr> correctly in context of tbody without wrapper div:\nconst fragment = range.createContextualFragment('<tr><td>Row 1</td><td>$100</td></tr>');\ntableBody.appendChild(fragment);",
    "interviewTips": [
      "Use the `<tr>` parsing example: `createContextualFragment` parses table rows correctly because it respects the `<tbody>` context."
    ]
  },
  {
    "topic": "DOM Edge Cases & Quirks",
    "subtopic": "Document.adoptNode vs importNode",
    "difficulty": "DIFFICULT",
    "questionType": "COMPARISON",
    "question": "What is the difference between document.adoptNode() and document.importNode() when moving nodes between documents or iframes?",
    "shortAnswer": "`adoptNode(node)` moves the original node from its current document into the target document (detaching it from the source); `importNode(node, deep)` creates a clone of the node in the target document while leaving the original untouched.",
    "detailedExplanation": "- **adoptNode**: Changes the `ownerDocument` of the node to the target document. Re-parents the exact instance.\n- **importNode**: Creates a copy in the new document. Takes a boolean `deep` parameter.\n- **iframe Usage**: Moving nodes across iframes without `adoptNode` or `importNode` can cause bizarre memory and context bugs in some engines.",
    "codeExample": "const iframeDoc = document.querySelector('iframe').contentDocument;\nconst iframeNode = iframeDoc.querySelector('.badge');\n\n// Moves original node into main document (detaches from iframe):\nconst adopted = document.adoptNode(iframeNode);\ndocument.body.appendChild(adopted);\n\n// Or copies node into main document (preserves in iframe):\n// const imported = document.importNode(iframeNode, true);\n// document.body.appendChild(imported);",
    "interviewTips": [
      "Contrast `adoptNode` (moves the original node) with `importNode` (creates a clone)."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "window.open Sandboxing with Cross-Origin-Opener-Policy (COOP)",
    "difficulty": "DIFFICULT",
    "questionType": "SECURITY",
    "question": "What is Cross-Origin-Opener-Policy (COOP) and how does it isolate DOM browsing contexts?",
    "shortAnswer": "COOP (`Cross-Origin-Opener-Policy: same-origin`) isolates your top-level window from other windows opened via `window.open()`, placing them in separate browsing context groups and setting `window.opener` to `null`.",
    "detailedExplanation": "- **Spectre Mitigation**: Required alongside Cross-Origin-Embedder-Policy (COEP) to enable high-resolution timers (`performance.now()`) and `SharedArrayBuffer`.\n- **Process Isolation**: Forces browsers to place cross-origin documents in completely separate operating system processes.\n- **Neutralizes Tabnabbing**: Automatically prevents child tabs from communicating with or redirecting the opening tab.",
    "codeExample": "<!-- HTTP Header enabling Cross-Origin-Opener-Policy: -->\n<!-- Cross-Origin-Opener-Policy: same-origin -->\n<!-- Cross-Origin-Embedder-Policy: require-corp -->",
    "interviewTips": [
      "Explain that COOP and COEP are mandatory prerequisites for enabling `SharedArrayBuffer` post-Spectre."
    ]
  },
  {
    "topic": "Range and Selection APIs",
    "subtopic": "selection.modify() Traversal",
    "difficulty": "DIFFICULT",
    "questionType": "CODE",
    "question": "What does selection.modify(alter, direction, granularity) do and how is it used in custom editors?",
    "shortAnswer": "`selection.modify()` programmatically moves or extends the selection caret by units of characters, words, sentences, or lines in forward or backward directions.",
    "detailedExplanation": "- **alter**: `'move'` (moves cursor) or `'extend'` (extends highlighted selection like Shift+Arrow).\n- **direction**: `'forward'`, `'backward'`, `'left'`, `'right'`.\n- **granularity**: `'character'`, `'word'`, `'sentence'`, `'line'`, `'paragraph'`.\n- **Custom Shortcuts**: Used to implement custom Ctrl+Left or Option+Right word jumping in code editors.",
    "codeExample": "const sel = window.getSelection();\n\n// Programmatically moves the caret forward by one word:\nsel.modify('move', 'forward', 'word');\n\n// Programmatically extends selection to the end of the line (like Shift+End):\nsel.modify('extend', 'forward', 'line');",
    "interviewTips": [
      "Mention `selection.modify()` when discussing custom code editor keyboard navigation implementations."
    ]
  },
  {
    "topic": "DOM Edge Cases & Quirks",
    "subtopic": "NodeFilter and TreeWalker Performance Optimization",
    "difficulty": "DIFFICULT",
    "questionType": "PERFORMANCE",
    "question": "Why is a TreeWalker significantly faster than querySelectorAll when traversing 50,000 DOM nodes?",
    "shortAnswer": "`querySelectorAll` allocates a full static `NodeList` array of all matching nodes in memory, whereas `TreeWalker` maintains a single active pointer, streaming nodes on-demand without memory allocation.",
    "detailedExplanation": "- **Zero Array Overhead**: Does not construct large collections on the heap.\n- **Fast C++ Traversal**: Advances internal engine node pointers directly.\n- **Early Exit**: You can stop traversing immediately once a target node is found, unlike `querySelectorAll` which must scan the entire document.",
    "codeExample": "const walker = document.createTreeWalker(\n  document.body,\n  NodeFilter.SHOW_ELEMENT,\n  node => node.hasAttribute('data-target') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP\n);\n\nlet target;\nwhile (target = walker.nextNode()) {\n  console.log('Found target:', target);\n  break; // Instant early exit without scanning 50,000 nodes!\n}",
    "interviewTips": [
      "Highlight early exit and zero memory allocation as the two key advantages of `TreeWalker` over `querySelectorAll`."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "Event Loop Task Macrotask Starvation via requestAnimationFrame",
    "difficulty": "DIFFICULT",
    "questionType": "PERFORMANCE",
    "question": "Can an infinite requestAnimationFrame loop starve normal setTimeout macrotasks or user click events?",
    "shortAnswer": "No, the browser event loop runs rendering (including rAF callbacks) only once per display refresh frame, yielding to macrotasks and user input events during the remaining frame budget.",
    "detailedExplanation": "- **Frame Pacing**: An infinite rAF loop executes at most once per 16.6ms (60Hz) or 8.3ms (120Hz).\n- **Input Processing**: High-priority user inputs (clicks, keypresses) are processed before or between frame rendering steps.\n- **Contrast with Microtasks**: Unlike microtasks which drain exhaustively and freeze the tab, rAF inherently yields to the event loop.",
    "codeExample": "function animateForever() {\n  // Runs 60 times a second, never freezes the tab or blocks clicks:\n  requestAnimationFrame(animateForever);\n}\nrequestAnimationFrame(animateForever);",
    "interviewTips": [
      "Contrast rAF with microtasks: rAF is rate-limited by screen refresh rate, so it does NOT starve the event loop."
    ]
  },
  {
    "topic": "DOM Edge Cases & Quirks",
    "subtopic": "HTML Option Selected Attribute vs Selected Property",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "Why does option.setAttribute('selected', '') fail to update the dropdown selection after user interaction?",
    "shortAnswer": "The `selected` attribute represents the initial default state defined in HTML markup (`defaultSelected`), whereas user interaction updates the live runtime property `option.selected`. Mutate `option.selected = true` to update the selection.",
    "detailedExplanation": "- **Attribute vs Property**: Once the user changes a select dropdown, the live property is decoupled from the initial attribute.\n- **Form Reset**: Calling `form.reset()` restores selection back to the state defined by the `selected` attribute.\n- **Golden Rule**: Always mutate properties (`el.selected = true`), never attributes, for form control state.",
    "codeExample": "const secondOption = select.options[1];\n\n// FAILS if user has already interacted with select:\n// secondOption.setAttribute('selected', '');\n\n// 100% RELIABLE (mutates live DOM property):\nsecondOption.selected = true;",
    "interviewTips": [
      "Repeat the fundamental DOM rule: Attributes represent initial markup; Properties represent live runtime state."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "PerformanceNavigationTiming for Precise DOM Loading Metrics",
    "difficulty": "DIFFICULT",
    "questionType": "CODE",
    "question": "How do you calculate exact DOM parsing duration and DOM Interactive time using the Navigation Timing API Level 2?",
    "shortAnswer": "Read `performance.getEntriesByType('navigation')[0]` and calculate `domInteractive - domLoading` and `domContentLoadedEventEnd - domContentLoadedEventStart`.",
    "detailedExplanation": "- **Navigation Timing Level 2**: Replaces legacy `performance.timing` with high-resolution timestamps (`DOMHighResTimeStamp`).\n- **DOM Parsing Time**: `domInteractive - responseEnd`.\n- **Script Execution Time**: `domContentLoadedEventEnd - domContentLoadedEventStart`.",
    "codeExample": "const [navTiming] = performance.getEntriesByType('navigation');\nif (navTiming) {\n  const domParsingMs = navTiming.domInteractive - navTiming.responseEnd;\n  const domReadyMs = navTiming.domContentLoadedEventEnd - navTiming.startTime;\n  console.log(`DOM parsed in: ${domParsingMs.toFixed(2)}ms`);\n  console.log(`DOM Content Loaded at: ${domReadyMs.toFixed(2)}ms`);\n}",
    "interviewTips": [
      "Use `performance.getEntriesByType('navigation')[0]` as the modern Level 2 Navigation Timing API."
    ]
  },
  {
    "topic": "DOM Edge Cases & Quirks",
    "subtopic": "Sanitizing Disconnected Subtrees Before Attachment",
    "difficulty": "DIFFICULT",
    "questionType": "SECURITY",
    "question": "Why is sanitizing a detached DOM fragment in memory safer than assigning to element.innerHTML on an attached element?",
    "shortAnswer": "Detached fragments do not trigger browser reflows, do not execute image onerror scripts until attached to an active document, and allow removing malicious nodes before layout or paint can occur.",
    "detailedExplanation": "- **No Main-Thread Layout**: Operations in memory have zero layout impact on the user's viewport.\n- **Clean Verification**: You can run validation checks (`querySelectorAll('[href^=\"javascript:\"]')`) safely in memory.\n- **Atomic Insertion**: Once verified clean, attach the entire fragment in a single reflow.",
    "codeExample": "function sanitizeAndMount(rawHtml, container) {\n  const template = document.createElement('template');\n  template.innerHTML = rawHtml; // Inert template content\n  \n  // Strip any inline handlers in memory:\n  template.content.querySelectorAll('*').forEach(el => {\n    for (const attr of el.getAttributeNames()) {\n      if (attr.startsWith('on')) el.removeAttribute(attr);\n    }\n  });\n  \n  container.replaceChildren(template.content.cloneNode(true));\n}",
    "interviewTips": [
      "Highlight `<template>` as the ideal inert container for in-memory DOM sanitization before mounting."
    ]
  },
  {
    "topic": "Range and Selection APIs",
    "subtopic": "Range cloneContents and Event Listener Strip",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "When a user highlights an interactive card and you call range.cloneContents(), what happens to event listeners on the cloned nodes?",
    "shortAnswer": "`range.cloneContents()` returns a DocumentFragment containing cloned DOM nodes; all event listeners attached via `addEventListener()` are stripped and NOT copied.",
    "detailedExplanation": "- **Engine Behavior**: Follows the same rules as `node.cloneNode(true)`: only inline HTML attribute handlers (`onclick=\"...\"`) survive.\n- **Detached State**: Cloned elements must be re-bound with event handlers if they are mounted elsewhere.\n- **Security**: Prevents unintentional execution of event handlers when cloning user content.",
    "codeExample": "const sel = window.getSelection();\nif (sel.rangeCount > 0) {\n  const frag = sel.getRangeAt(0).cloneContents();\n  // Any <button> inside frag has LOST its addEventListener click handlers!\n  rebindEventHandlers(frag);\n}",
    "interviewTips": [
      "Remember: Neither `cloneNode` nor `range.cloneContents()` ever copies listeners attached via `addEventListener`."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "Page Lifecycle API Freeze and Resume States",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "What are the 'frozen' and 'terminated' lifecycle states in the Page Lifecycle API?",
    "shortAnswer": "The browser freezes inactive background tabs to conserve CPU and RAM (suspending timers and callbacks), and terminates them if system memory runs low. The `freeze` and `resume` events allow apps to save and restore state.",
    "detailedExplanation": "- **Mobile Memory Management**: Operating systems pause background tabs without killing them.\n- **freeze Event**: Fires on `document` when the browser suspends the CPU execution of the tab.\n- **resume Event**: Fires when the user switches back to the frozen tab, allowing re-syncing of clocks and WebSocket connections.",
    "codeExample": "document.addEventListener('freeze', () => {\n  console.log('Tab frozen by OS: flushing state to storage...');\n  saveStateToLocalStorage();\n});\n\ndocument.addEventListener('resume', () => {\n  console.log('Tab resumed: checking for missed updates...');\n  refreshStaleData();\n});",
    "interviewTips": [
      "Mention the Page Lifecycle API's `freeze` and `resume` events for enterprise web apps."
    ]
  },
  {
    "topic": "DOM Edge Cases & Quirks",
    "subtopic": "Named Access on the Window Object Security Risks",
    "difficulty": "DIFFICULT",
    "questionType": "SECURITY",
    "question": "Why is the browser's legacy 'Named access on the Window object' considered a major security and reliability risk?",
    "shortAnswer": "Any element with an `id` or `name` attribute is automatically exposed as a global variable on `window`, allowing user-injected HTML to shadow built-in JavaScript functions, libraries, and global configs.",
    "detailedExplanation": "- **Global Shadowing**: An `<input id=\"alert\">` will shadow the global `window.alert` function in that scope.\n- **Silent Breakages**: Code expecting `typeof config === 'object'` gets an `HTMLDivElement`.\n- **Defense**: Always use explicit variable declarations (`const`, `let`), verify types with `typeof` and `instanceof`, and use closures.",
    "codeExample": "<!-- Malicious or accidental markup: -->\n<div id=\"fetch\"></div>\n\n<script>\n// In sloppy scope without 'const fetch':\n// window.fetch is now pointing to the <div> instead of the native fetch API!\nconsole.log(window.fetch instanceof HTMLDivElement); // true\n</script>",
    "interviewTips": [
      "Use the `<div id=\"fetch\">` example to vividly illustrate how named access on `window` shadows native APIs."
    ]
  },
  {
    "topic": "Document Lifecycle & Window APIs",
    "subtopic": "Long Tasks API & PerformanceObserver",
    "difficulty": "DIFFICULT",
    "questionType": "PERFORMANCE",
    "question": "How do you detect JavaScript operations that block the DOM main thread for more than 50ms using the Long Tasks API?",
    "shortAnswer": "Observe `'longtask'` entries using `new PerformanceObserver()`, reporting any task exceeding the 50ms threshold that causes input lag and dropped frames.",
    "detailedExplanation": "- **Long Task Definition**: Any task executing on the main thread that takes longer than 50ms (causing UI jank and poor Interaction to Next Paint - INP).\n- **entry.duration**: Reports duration in milliseconds.\n- **entry.attribution**: Identifies whether the bottleneck was caused by an iframe, script file, or DOM mutation.",
    "codeExample": "const observer = new PerformanceObserver((list) => {\n  for (const entry of list.getEntries()) {\n    console.warn(`Long task detected! Duration: ${entry.duration.toFixed(2)}ms`);\n    console.log('Task attribution:', entry.attribution[0]?.name);\n  }\n});\n\nobserver.observe({ entryTypes: ['longtask'] });",
    "interviewTips": [
      "Connect the Long Tasks API (tasks > 50ms) directly to Google's Core Web Vitals metric: INP (Interaction to Next Paint)."
    ]
  }
];
