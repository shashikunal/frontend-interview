// scripts/dom-gen/data-part1.cjs
// Questions 1 to 100: DOM Basics, Tree Structure, and Element Selection

module.exports = [
  // --- DOM Basics (1 - 25: EASY) ---
  {
    topic: "DOM Basics & Architecture",
    subtopic: "DOM Tree & Hierarchy",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What is the Document Object Model (DOM) in web browsers?",
    shortAnswer: "The DOM is a tree-like object representation of an HTML document created by the browser that allows JavaScript to inspect and modify page structure, style, and content.",
    detailedExplanation: "- **Object Tree**: The browser parses HTML text into an in-memory hierarchy of JavaScript objects.\n- **Dynamic API**: Provides standardized methods to add, modify, or remove elements and styles at runtime.\n- **Standardized**: Defined by WHATWG and W3C, making it consistent across Chrome, Firefox, Safari, and Edge.",
    codeExample: "// Accessing document node and updating page title dynamically:\nconsole.log(document.nodeType); // 9 (DOCUMENT_NODE)\ndocument.title = 'Updated Dashboard';",
    interviewTips: ["Clarify that the DOM is not the raw HTML text file, but an in-memory object tree parsed from it."]
  },
  {
    topic: "DOM Basics & Architecture",
    subtopic: "DOM vs HTML",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What is the difference between raw HTML source text and the live DOM?",
    shortAnswer: "HTML is static source text sent from a server, while the DOM is the live in-memory object tree constructed by the browser parser that JavaScript interacts with.",
    detailedExplanation: "- **Static vs Live**: HTML is an inert string; the DOM is an active hierarchy of JavaScript objects.\n- **Error Correction**: Browser parsers automatically fix malformed HTML (e.g., adding missing `<tbody>` tags).\n- **Runtime Mutations**: JavaScript alters the live DOM in memory without modifying the original HTML file on the server.",
    codeExample: "// HTML: <table><tr><td>Cell</td></tr></table>\n// The browser DOM automatically inserts a <tbody> wrapper:\nconst table = document.querySelector('table');\nconsole.log(table.firstElementChild.tagName); // 'TBODY'",
    interviewTips: ["Highlight browser error-correction during parsing as a key reason DOM differs from raw HTML."]
  },
  {
    topic: "DOM Basics & Architecture",
    subtopic: "Window vs Document",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What is the difference between window and document in browser JavaScript?",
    shortAnswer: "`window` represents the browser tab and global execution context, while `document` is a property of `window` representing the loaded HTML document.",
    detailedExplanation: "- **`window`**: Global execution object owning timers (`setTimeout`), storage, navigation (`location`), and viewport sizes.\n- **`document`**: The root entry point to the DOM tree (`window.document`) containing elements and query methods.\n- **Relationship**: `document` is a property on `window` (`window.document === document`).",
    codeExample: "console.log(window.document === document); // true\nconsole.log(window.innerWidth);           // Viewport width\nconsole.log(document.body.clientWidth);   // Body content width",
    interviewTips: ["Mention that in browser JavaScript, global variables without qualifiers attach to `window`."]
  },
  {
    topic: "DOM Basics & Architecture",
    subtopic: "Node vs Element",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What is the difference between a Node and an Element in the DOM?",
    shortAnswer: "A Node is any point in the DOM tree (including text, comments, and document), whereas an Element is specifically a Node of type `ELEMENT_NODE` (nodeType 1) representing an HTML tag.",
    detailedExplanation: "- **`Node`**: Generic base interface. Includes Elements (1), Text nodes (3), Comments (8), and Documents (9).\n- **`Element`**: Subclass of Node. Has HTML attributes, `classList`, innerHTML, and CSS styling.\n- **Relationship**: All Elements are Nodes, but whitespace text nodes and comments are Nodes that are not Elements.",
    codeExample: "const el = document.createElement('div');\nel.innerHTML = 'Text <!-- comment -->';\n\nconsole.log(el.childNodes.length); // 2 (Text node and Comment node)\nconsole.log(el.children.length);   // 0 (No Element children)",
    interviewTips: ["Use `childNodes` vs `children` to clearly demonstrate the difference between Nodes and Elements."]
  },
  {
    topic: "DOM Basics & Architecture",
    subtopic: "Node Types",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "How do you identify the type of a DOM node using the nodeType property?",
    shortAnswer: "Inspect `node.nodeType`, which returns an integer from 1 to 12 matching constants on the `Node` interface such as `Node.ELEMENT_NODE` (1) and `Node.TEXT_NODE` (3).",
    detailedExplanation: "- **`Node.ELEMENT_NODE` (1)**: HTML element tags like `<div>`, `<p>`, `<span>`.\n- **`Node.TEXT_NODE` (3)**: Plain text content including newline whitespace.\n- **`Node.COMMENT_NODE` (8)**: HTML comment blocks (`<!-- note -->`).\n- **`Node.DOCUMENT_NODE` (9)**: The root `document` object.",
    codeExample: "function classifyNode(node) {\n  switch (node.nodeType) {\n    case Node.ELEMENT_NODE: return 'Element Node';\n    case Node.TEXT_NODE: return 'Text Node';\n    case Node.COMMENT_NODE: return 'Comment Node';\n    default: return 'Other Node';\n  }\n}",
    interviewTips: ["Memorize the two most common node types: 1 for Element and 3 for Text."]
  },
  {
    topic: "DOM Basics & Architecture",
    subtopic: "Document Root Element",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What is document.documentElement and how does it differ from document.body?",
    shortAnswer: "`document.documentElement` returns the root `<html>` element, while `document.body` returns the `<body>` element.",
    detailedExplanation: "- **`document.documentElement`**: Top-most element of the document tree (`<html>`). Owns root CSS variables (`:root`).\n- **`document.body`**: The `<body>` container holding visible page content.\n- **Root Distinction**: `document` is the document node (type 9); `document.documentElement` is the root element (type 1).",
    codeExample: "console.log(document.documentElement.tagName); // 'HTML'\nconsole.log(document.body.tagName);            // 'BODY'\nconsole.log(document.body.parentElement === document.documentElement); // true",
    interviewTips: ["Remember that CSS `:root` selector targets `document.documentElement`."]
  },
  {
    topic: "DOM Basics & Architecture",
    subtopic: "Document Ready States",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What are the three possible values of document.readyState?",
    shortAnswer: "`document.readyState` returns `'loading'`, `'interactive'`, or `'complete'`, indicating the current stage of document parsing and subresource loading.",
    detailedExplanation: "- **`'loading'`**: The browser is still downloading and parsing HTML bytes.\n- **`'interactive'`**: HTML parsing is complete and DOM tree is constructed, but images and stylesheets are still downloading.\n- **`'complete'`**: The page and all subresources (images, stylesheets, frames) have finished loading.\n- **Event**: The `readystatechange` event fires when this value transitions.",
    codeExample: "document.addEventListener('readystatechange', () => {\n  if (document.readyState === 'interactive') {\n    console.log('DOM is ready for queries.');\n  } else if (document.readyState === 'complete') {\n    console.log('All images and styles loaded.');\n  }\n});",
    interviewTips: ["Connect `interactive` to `DOMContentLoaded` and `complete` to `window.onload`."]
  },
  {
    topic: "DOM Basics & Architecture",
    subtopic: "DOMContentLoaded vs Load",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What is the difference between the DOMContentLoaded and load events in web pages?",
    shortAnswer: "`DOMContentLoaded` fires as soon as the HTML document is parsed into a DOM tree, while `load` fires only after all external assets (images, stylesheets) have finished downloading.",
    detailedExplanation: "- **`DOMContentLoaded`**: Fired on `document`. UI logic and button bindings can initialize immediately.\n- **`load`**: Fired on `window`. Required when calculations depend on downloaded image dimensions or font metrics.\n- **Performance**: Initializing apps on `DOMContentLoaded` prevents interaction lag for users.",
    codeExample: "document.addEventListener('DOMContentLoaded', () => {\n  console.log('DOM ready: interactive widgets can bind now.');\n});\n\nwindow.addEventListener('load', () => {\n  console.log('Window load: images and stylesheets downloaded.');\n});",
    interviewTips: ["Always prefer `DOMContentLoaded` over `window.load` for attaching click listeners."]
  },
  {
    topic: "DOM Basics & Architecture",
    subtopic: "Script Loading Attributes",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "How do defer and async script attributes differ in how they interact with DOM parsing?",
    shortAnswer: "`defer` downloads scripts asynchronously and runs them in order after HTML parsing completes, while `async` executes scripts immediately upon download, interrupting HTML parsing.",
    detailedExplanation: "- **Standard `<script>`**: Halts HTML parsing completely while fetching and executing.\n- **`defer`**: Fetches in background, preserves script execution order, and runs right before `DOMContentLoaded`.\n- **`async`**: Fetches in background and runs immediately whenever ready, with no guaranteed order.\n- **Best Practice**: Use `defer` for application code that interacts with the DOM; use `async` for independent analytics.",
    codeExample: "<!-- Runs in order after DOM parsing: -->\n<script defer src=\"main.js\"></script>\n\n<!-- Runs as soon as downloaded: -->\n<script async src=\"tracker.js\"></script>",
    interviewTips: ["Summary: `defer` guarantees document order and DOM readiness; `async` has no order guarantee."]
  },
  {
    topic: "DOM Basics & Architecture",
    subtopic: "Document Properties",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What does document.title do and how do you update it dynamically?",
    shortAnswer: "`document.title` gets or sets the text string displayed in the browser tab and bookmark title.",
    detailedExplanation: "- **Getter**: Returns the inner text of the `<title>` tag inside `<head>`.\n- **Setter**: Modifying `document.title = 'New Title'` updates the browser tab label immediately without reloading.\n- **Single Page Apps**: Frequently updated during client-side route transitions to reflect current view context.",
    codeExample: "// Reading and updating tab title:\nconsole.log('Old title:', document.title);\ndocument.title = 'Profile Settings - MyApp';",
    interviewTips: ["Useful for accessibility and SEO in Single Page Applications (SPAs)."]
  },
  {
    topic: "DOM Basics & Architecture",
    subtopic: "Document URI",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What is the difference between document.URL and window.location.href?",
    shortAnswer: "`document.URL` is a read-only string returning the document's URL, whereas `window.location.href` is read-write and can trigger page navigation when reassigned.",
    detailedExplanation: "- **`document.URL`**: Static read-only string property on the document node.\n- **`window.location.href`**: Property of the `Location` object. Assigning a new URL navigates the browser to that page.\n- **Location Methods**: `window.location` provides navigation methods like `.replace()`, `.assign()`, and `.reload()`.",
    codeExample: "console.log(document.URL); // Read-only URL string\n\n// Navigating to a new page requires location:\n// window.location.href = 'https://example.com';",
    interviewTips: ["Remember: `document.URL` cannot be assigned to navigate; assign to `location.href` instead."]
  },
  {
    topic: "DOM Basics & Architecture",
    subtopic: "Document Domain",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What is document.domain and why has its setter been deprecated in modern browsers?",
    shortAnswer: "`document.domain` historically allowed relaxed same-origin policies between subdomains, but modifying it has been deprecated and disabled due to critical cross-origin security risks.",
    detailedExplanation: "- **Historical Role**: Allowed `app.example.com` and `api.example.com` to communicate by setting `document.domain = 'example.com'`.\n- **Security Deprecation**: Relaxing domain checks undermined port and subdomain isolation, exposing apps to cross-site scripting vulnerabilities.\n- **Modern Standard**: Use `window.postMessage()` for secure cross-origin communication between windows and iframes.",
    codeExample: "// Reading domain is safe:\nconsole.log(document.domain);\n\n// Setter is deprecated and blocked in modern browsers:\n// document.domain = 'example.com'; // Throws warning or error",
    interviewTips: ["Recommend `window.postMessage()` as the modern secure alternative for cross-frame messaging."]
  },
  {
    topic: "DOM Basics & Architecture",
    subtopic: "Character Encoding",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "How do you read the character encoding of the current document via the DOM?",
    shortAnswer: "Read `document.characterSet`, which returns the active character encoding string (such as `'UTF-8'`).",
    detailedExplanation: "- **`document.characterSet`**: Standard read-only property returning the canonical encoding name (e.g. `'UTF-8'`).\n- **Historical Alias**: Previously known as `document.inputEncoding` or `document.charset`, but `characterSet` is the standard.\n- **Declaration**: Determined by HTTP Content-Type headers or the `<meta charset=\"UTF-8\">` tag.",
    codeExample: "console.log('Document encoding:', document.characterSet); // 'UTF-8'",
    interviewTips: ["Mention that UTF-8 is the universal standard encoding for modern web documents."]
  },
  {
    topic: "DOM Basics & Architecture",
    subtopic: "Document Referrer",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What is document.referrer and when does it return an empty string?",
    shortAnswer: "`document.referrer` returns the URI of the page that linked to the current page, or an empty string if navigated directly, via bookmarks, or blocked by Referrer-Policy headers.",
    detailedExplanation: "- **Usage**: Tracks incoming navigation sources without third-party tracking scripts.\n- **Empty Scenarios**: Direct address bar typing, bookmark clicks, HTTPS-to-HTTP navigation, or strict `Referrer-Policy: no-referrer`.\n- **Read-Only**: Stored as a read-only string on the `document` object.",
    codeExample: "if (document.referrer) {\n  console.log('Visitor arrived from:', document.referrer);\n} else {\n  console.log('Direct visit or referrer suppressed.');\n}",
    interviewTips: ["Explain how modern Referrer-Policy headers can strip referrer strings for privacy."]
  },
  {
    topic: "DOM Basics & Architecture",
    subtopic: "Document Cookie",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "How does document.cookie work for reading and setting HTTP cookies in the DOM?",
    shortAnswer: "`document.cookie` acts as a getter/setter string of semicolon-separated key-value pairs, but cannot access cookies marked with the `HttpOnly` flag.",
    detailedExplanation: "- **Reading**: Returns all accessible non-HttpOnly cookies for the current document as `'key1=val1; key2=val2'`.\n- **Writing**: Assigning a string (`document.cookie = 'user=John; max-age=3600; path=/'`) appends or updates a single cookie.\n- **Security**: Cookies marked with `HttpOnly` are hidden from JavaScript to prevent cookie theft via XSS.",
    codeExample: "// Setting a cookie with 1-hour expiry:\ndocument.cookie = 'theme=dark; max-age=3600; path=/; SameSite=Lax';\n\n// Reading cookies:\nconsole.log(document.cookie);",
    interviewTips: ["Emphasize that sensitive session tokens should always have the `HttpOnly` flag set by the server."]
  },
  {
    topic: "DOM Basics & Architecture",
    subtopic: "Document LastModified",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What is document.lastModified and where does its value originate?",
    shortAnswer: "`document.lastModified` returns a string containing the date and time when the current document was last modified, according to the server's `Last-Modified` HTTP header.",
    detailedExplanation: "- **Source**: Populated directly from the web server's HTTP `Last-Modified` response header.\n- **Fallback**: If the server omits the header, the browser returns the client's current date and time.\n- **Format**: Returns a localized date-time string.",
    codeExample: "console.log('Page last modified on:', document.lastModified);",
    interviewTips: ["State that its accuracy depends entirely on server response headers."]
  },
  {
    topic: "DOM Basics & Architecture",
    subtopic: "Head & Body Access",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What are document.head and document.body shortcuts in the DOM?",
    shortAnswer: "`document.head` and `document.body` are direct references to the `<head>` and `<body>` HTML element nodes of the current document.",
    detailedExplanation: "- **Direct Access**: Eliminates the need to call `document.querySelector('body')` or `document.querySelector('head')`.\n- **Timing**: `document.body` evaluates to `null` if accessed by a synchronous script running in `<head>` before `<body>` is parsed.\n- **Document Root**: `document.documentElement` gives `<html\>`, `document.head` gives `<head>`, `document.body` gives `<body>`.",
    codeExample: "// Direct access to head and body:\nconst headEl = document.head;\nconst bodyEl = document.body;\n\nconsole.log(headEl.nodeName); // 'HEAD'\nconsole.log(bodyEl.nodeName); // 'BODY'",
    interviewTips: ["Remind interviewers that `document.body` is `null` if queried inside `<head>` before `<body>` parses."]
  },
  {
    topic: "DOM Basics & Architecture",
    subtopic: "Document Built-in Collections",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What are document.images, document.links, and document.forms in the DOM?",
    shortAnswer: "They are live `HTMLCollection` objects on `document` providing immediate access to all `<img>`, `<a>` (with href), and `<form>` elements on the page.",
    detailedExplanation: "- **`document.forms`**: Live collection of all `<form>` elements in document order.\n- **`document.images`**: Live collection of all `<img>` elements.\n- **`document.links`**: Live collection of all `<a>` and `<area>` elements having an `href` attribute.\n- **Named Access**: Form elements can be accessed by their `name` or `id` attributes: `document.forms['loginForm']`.",
    codeExample: "console.log('Total forms on page:', document.forms.length);\nconsole.log('Total images on page:', document.images.length);\n\n// Accessing first form:\nconst firstForm = document.forms[0];",
    interviewTips: ["Mention that these collections are live and update automatically when elements are added or removed."]
  },
  {
    topic: "DOM Basics & Architecture",
    subtopic: "Document Scripts Collection",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What is document.scripts and document.currentScript?",
    shortAnswer: "`document.scripts` is a live collection of all `<script>` elements in the page, while `document.currentScript` returns the specific `<script>` element currently being executed.",
    detailedExplanation: "- **`document.scripts`**: Returns an `HTMLCollection` of all `<script>` tags.\n- **`document.currentScript`**: Returns the `<script>` node currently executing. Useful for scripts reading their own `data-*` config attributes.\n- **Module Scripts**: `document.currentScript` returns `null` inside ES module scripts (`<script type=\"module\">`); use `import.meta.url` instead.",
    codeExample: "// Inside an executing script tag:\nconst current = document.currentScript;\nif (current) {\n  console.log('Executing script src:', current.src);\n}",
    interviewTips: ["Highlight that `currentScript` is `null` in ES modules, where `import.meta.url` must be used instead."]
  },
  {
    topic: "DOM Basics & Architecture",
    subtopic: "Node Value vs Text Content",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What does nodeValue return when called on an element node versus a text node?",
    shortAnswer: "`nodeValue` returns `null` for element nodes, but returns the raw text string for text nodes and comments.",
    detailedExplanation: "- **Element Nodes**: Calling `element.nodeValue` always returns `null` because elements hold child nodes, not direct text values.\n- **Text Nodes**: Returns the editable text string stored inside that specific text node.\n- **Comment Nodes**: Returns the comment text string.",
    codeExample: "const p = document.createElement('p');\np.textContent = 'Hello World';\n\nconsole.log(p.nodeValue);                 // null (Element node)\nconsole.log(p.firstChild.nodeValue);       // 'Hello World' (Text node)",
    interviewTips: ["This is a classic tricky question: `nodeValue` on an element node is always `null`."]
  },
  {
    topic: "DOM Basics & Architecture",
    subtopic: "Node Name vs Tag Name",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What is the difference between nodeName and tagName in the DOM?",
    shortAnswer: "`tagName` is available only on Element nodes and returns the tag name in uppercase, while `nodeName` is available on all Node types (returning uppercase tag names for elements, and strings like '#text' or '#document' for other nodes).",
    detailedExplanation: "- **`element.tagName`**: Defined on `Element`. Returns tag name in uppercase (e.g. `'DIV'`, `'BUTTON'`). Undefined on non-element nodes.\n- **`node.nodeName`**: Defined on `Node`. Returns uppercase tag name for elements, `'#text'` for text nodes, `'#comment'` for comments, and `'#document'` for document root.",
    codeExample: "const div = document.createElement('div');\nconst text = document.createTextNode('sample');\n\nconsole.log(div.tagName);   // 'DIV'\nconsole.log(div.nodeName);  // 'DIV'\nconsole.log(text.tagName);  // undefined\nconsole.log(text.nodeName); // '#text'",
    interviewTips: ["State that `tagName` exists only on Elements, while `nodeName` exists on all Nodes."]
  },
  {
    topic: "DOM Basics & Architecture",
    subtopic: "DOM Tree Checking",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "How do you check if a DOM node has any child nodes?",
    shortAnswer: "Call `node.hasChildNodes()`, which returns `true` if the node contains any child nodes (elements, text, or comments), or check `node.childNodes.length > 0`.",
    detailedExplanation: "- **`node.hasChildNodes()`**: Fast boolean method checking if any child nodes exist.\n- **Includes Whitespace**: Returns `true` even if the only child is a whitespace text node.\n- **Element Children Only**: To check for element children specifically, check `node.childElementCount > 0` or `node.children.length > 0`.",
    codeExample: "const box = document.createElement('div');\nconsole.log(box.hasChildNodes()); // false\n\nbox.textContent = ' ';\nconsole.log(box.hasChildNodes());       // true (whitespace text node)\nconsole.log(box.childElementCount > 0); // false (no Element children)",
    interviewTips: ["Contrast `hasChildNodes()` (checks all nodes) with `childElementCount > 0` (checks element nodes only)."]
  },
  {
    topic: "DOM Basics & Architecture",
    subtopic: "Document Fragment Basics",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What is a DocumentFragment and what is its primary use in DOM programming?",
    shortAnswer: "A `DocumentFragment` is a lightweight, minimal document object in memory with no parent node, used to build batches of elements off-screen before inserting them all at once into the DOM.",
    detailedExplanation: "- **Off-Screen Memory**: Elements appended to a fragment do not trigger browser reflow or repaint.\n- **Clean Transfer**: Appending a fragment to the DOM appends all of its child nodes, leaving the fragment itself empty.\n- **Performance**: Prevents multiple layout reflows when appending large numbers of items to a list.",
    codeExample: "const fragment = document.createDocumentFragment();\nfor (let i = 0; i < 100; i++) {\n  const li = document.createElement('li');\n  li.textContent = `Item ${i}`;\n  fragment.appendChild(li);\n}\ndocument.querySelector('ul').appendChild(fragment); // Single reflow!",
    interviewTips: ["Highlight that appending a fragment inserts its children and empties the fragment automatically."]
  },
  {
    topic: "DOM Basics & Architecture",
    subtopic: "DOM Node Removal Basics",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "How do you remove an element from the DOM using modern JavaScript?",
    shortAnswer: "Call `element.remove()`, which removes the element from its parent container in the DOM tree.",
    detailedExplanation: "- **Modern Method**: `element.remove()` can be called directly on the target element.\n- **Historical Method**: `element.parentNode.removeChild(element)` required accessing the parent node first.\n- **In-Memory Retention**: The removed element remains accessible in JavaScript memory if a variable reference to it is maintained.",
    codeExample: "const alertBanner = document.querySelector('#alert');\nif (alertBanner) {\n  alertBanner.remove(); // Removed from DOM immediately\n}",
    interviewTips: ["Contrast modern `el.remove()` with legacy `el.parentNode.removeChild(el)`."]
  },
  {
    topic: "DOM Basics & Architecture",
    subtopic: "DOM Cloning Basics",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What does cloneNode() do and what is the significance of its boolean argument?",
    shortAnswer: "`cloneNode(deep)` duplicates a DOM node. Passing `true` creates a deep clone copying all child nodes, while `false` (default) creates a shallow clone copying only the node itself.",
    detailedExplanation: "- **`cloneNode(false)` (Shallow)**: Copies only the tag and its attributes; child text and elements are excluded.\n- **`cloneNode(true)` (Deep)**: Recursively copies the element, its attributes, and all descendant nodes.\n- **Event Listeners**: Neither deep nor shallow clone copies event listeners attached via `addEventListener()`.\n- **Duplicate IDs**: Ensure you update `id` attributes on cloned elements to prevent invalid duplicate IDs in the document.",
    codeExample: "const card = document.querySelector('.card');\nconst clone = card.cloneNode(true); // Deep clone with all contents\nclone.id = 'card-2'; // Avoid duplicate ID\ndocument.body.appendChild(clone);",
    interviewTips: ["Always remember to mention that `cloneNode` does NOT copy event listeners added via `addEventListener`."]
  },

  // --- Element Selection & Collections (26 - 50: EASY) ---
  {
    topic: "Element Selection",
    subtopic: "getElementById",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "How does document.getElementById() work and what does it return if no element matches?",
    shortAnswer: "`document.getElementById('id')` searches the document for an element matching the specified ID and returns the `Element` object, or `null` if no match exists.",
    detailedExplanation: "- **Fastest Query**: Highly optimized by browser engines using internal ID hash lookup tables.\n- **No Hash Symbol**: Pass the raw ID name without `#`: `getElementById('user')`, not `getElementById('#user')`.\n- **Uniqueness**: If multiple elements share the same ID (invalid HTML), it returns only the first matching element.\n- **Return Value**: Returns an `Element` or `null`.",
    codeExample: "const btn = document.getElementById('submit-btn');\nif (btn) {\n  btn.disabled = true;\n} else {\n  console.warn('Button not found in DOM.');\n}",
    interviewTips: ["State that `getElementById` is the fastest DOM selection method because browsers index IDs internally."]
  },
  {
    topic: "Element Selection",
    subtopic: "querySelector",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What does document.querySelector() do and what does it return if no element matches?",
    shortAnswer: "`document.querySelector(selector)` returns the first `Element` matching the specified CSS selector string, or `null` if no matching elements are found.",
    detailedExplanation: "- **First Match Only**: Evaluates selectors using standard CSS syntax and returns only the first matching element in document order.\n- **Any CSS Selector**: Supports tag names (`'div'`), classes (`'.active'`), IDs (`'#main'`), attributes (`'[type=\"text\"]'`), and complex combinations (`'ul > li:first-child'`).\n- **Subtree Scoping**: Can be called on any element (`parentElement.querySelector('.child')`) to restrict search to that subtree.",
    codeExample: "const activeItem = document.querySelector('.nav-list > li.active');\nif (activeItem) {\n  console.log('Active item text:', activeItem.textContent);\n}",
    interviewTips: ["Highlight that `querySelector` returns only the first matched element, whereas `querySelectorAll` returns all matches."]
  },
  {
    topic: "Element Selection",
    subtopic: "querySelectorAll",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What does document.querySelectorAll() return?",
    shortAnswer: "`document.querySelectorAll(selector)` returns a static (non-live) `NodeList` containing all element nodes matching the specified CSS selector in document tree order.",
    detailedExplanation: "- **Static Collection**: The returned `NodeList` is a snapshot. If elements matching the selector are later added or removed from the DOM, the NodeList does not update.\n- **Empty Result**: If no elements match, it returns an empty `NodeList` with `.length === 0` (never `null`).\n- **Built-in `forEach`**: Modern browsers provide a native `.forEach()` method directly on NodeList.",
    codeExample: "const buttons = document.querySelectorAll('button.action-btn');\nconsole.log(`Found ${buttons.length} buttons.`);\n\nbuttons.forEach(btn => {\n  btn.classList.add('ready');\n});",
    interviewTips: ["Emphasize that `querySelectorAll` returns a static snapshot, unlike `getElementsByClassName` which is live."]
  },
  {
    topic: "Element Selection",
    subtopic: "getElementsByClassName",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "How does getElementsByClassName() differ from querySelectorAll()?",
    shortAnswer: "`getElementsByClassName` returns a live `HTMLCollection` that automatically updates when elements are added or removed, whereas `querySelectorAll` returns a static `NodeList` snapshot.",
    detailedExplanation: "- **Live vs Static**: `HTMLCollection` reflects DOM changes dynamically; static `NodeList` remains frozen at the moment of query.\n- **Method Arguments**: `getElementsByClassName('alert')` takes raw class names without dots; `querySelectorAll('.alert')` accepts complete CSS selector strings.\n- **Iteration**: `NodeList` has built-in `.forEach()`; `HTMLCollection` does not have `.forEach()` and must be converted to an array or looped with a standard `for` loop.",
    codeExample: "// HTMLCollection updates dynamically:\nconst liveList = document.getElementsByClassName('item');\nconsole.log(liveList.length); // 2\n\nconst newItem = document.createElement('div');\nnewItem.className = 'item';\ndocument.body.appendChild(newItem);\n\nconsole.log(liveList.length); // 3 (Live update!)",
    interviewTips: ["Contrast live updating vs static snapshots when comparing `getElementsByClassName` with `querySelectorAll`."]
  },
  {
    topic: "Element Selection",
    subtopic: "getElementsByTagName",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What does document.getElementsByTagName() return and how do you select all elements in the document?",
    shortAnswer: "It returns a live `HTMLCollection` of elements with the given tag name; passing `'*'` (`document.getElementsByTagName('*')`) returns all elements in the entire document.",
    detailedExplanation: "- **Tag Name Matching**: `document.getElementsByTagName('p')` selects all paragraph elements.\n- **Case Insensitive**: In HTML documents, matching is case-insensitive.\n- **Wildcard Selection**: `document.getElementsByTagName('*')` returns an `HTMLCollection` containing every single element in document order.",
    codeExample: "const paragraphs = document.getElementsByTagName('p');\nconsole.log(`Total paragraphs: ${paragraphs.length}`);\n\n// All elements on the page:\nconst allElements = document.getElementsByTagName('*');\nconsole.log(`Total elements: ${allElements.length}`);",
    interviewTips: ["Mention that `getElementsByTagName('*')` returns all element nodes in the DOM tree."]
  },
  {
    topic: "Element Selection",
    subtopic: "getElementsByName",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What does document.getElementsByName() do and when is it primarily used?",
    shortAnswer: "`document.getElementsByName('name')` returns a live `NodeList` of elements matching the specified `name` attribute, primarily used for grouping radio buttons and form inputs.",
    detailedExplanation: "- **Target Attribute**: Targets elements with a matching `name=\"...\"` attribute.\n- **Primary Use Case**: Radio button groups that share identical `name` values.\n- **Return Type**: Returns a `NodeList` of elements.\n- **Document-Only**: Defined on `document`, not individual element subtrees.",
    codeExample: "// Getting all radio options for a question:\nconst genderRadios = document.getElementsByName('gender');\ngenderRadios.forEach(radio => {\n  if (radio.checked) console.log('Selected:', radio.value);\n});",
    interviewTips: ["Highlight radio button groups as the primary real-world use case for `getElementsByName`."]
  },
  {
    topic: "Element Selection",
    subtopic: "NodeList vs HTMLCollection",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What is the difference between a NodeList and an HTMLCollection in the DOM?",
    shortAnswer: "An `HTMLCollection` contains only element nodes and is always live, while a `NodeList` can contain any node type (including text nodes) and is typically static when created by `querySelectorAll`.",
    detailedExplanation: "- **Content**: `HTMLCollection` only holds Element nodes; `NodeList` can hold text, comment, and element nodes.\n- **Liveness**: `HTMLCollection` is always live; `NodeList` is static from `querySelectorAll` (though live when returned by `childNodes`).\n- **Methods**: `NodeList` supports `.forEach()`, `entries()`, `keys()`, and `values()`; `HTMLCollection` offers item index access and `.namedItem()`.",
    codeExample: "const collection = document.getElementsByTagName('div'); // HTMLCollection\nconst nodeList = document.querySelectorAll('div');         // NodeList\n\nconsole.log(typeof nodeList.forEach === 'function');    // true\nconsole.log(typeof collection.forEach === 'function');  // false (in standard HTMLCollection)",
    interviewTips: ["Point out that `NodeList` has `.forEach()`, whereas `HTMLCollection` does not."]
  },
  {
    topic: "Element Selection",
    subtopic: "Converting Collections to Arrays",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you convert a NodeList or HTMLCollection into a standard JavaScript array?",
    shortAnswer: "Use `Array.from(collection)` or the spread operator `[...collection]` to convert array-like DOM collections into standard JavaScript arrays.",
    detailedExplanation: "- **`Array.from(collection)`**: Converts any array-like or iterable object into a true JavaScript Array instance.\n- **Spread Operator `[...collection]`**: Modern ES6 syntax that spreads iterable DOM nodes into a new array.\n- **Benefits**: Enables standard array methods like `.map()`, `.filter()`, `.reduce()`, and `.find()`.",
    codeExample: "const divElements = document.getElementsByTagName('div');\n\n// Method 1: Spread operator\nconst divArray1 = [...divElements];\n\n// Method 2: Array.from\nconst divArray2 = Array.from(divElements);\n\n// Now you can use map and filter:\nconst ids = divArray1.map(el => el.id);",
    interviewTips: ["Recommend `Array.from` or `[...items]` for unlocking `.filter()` and `.map()` on DOM collections."]
  },
  {
    topic: "Element Selection",
    subtopic: "Iterating NodeLists",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you loop through all elements selected by document.querySelectorAll()?",
    shortAnswer: "Loop through them using the built-in `NodeList.prototype.forEach()` method or a standard `for...of` loop.",
    detailedExplanation: "- **`NodeList.prototype.forEach()`**: Built directly into all modern browser NodeList implementations.\n- **`for...of` Loop**: Supports `break` and `continue` statements to exit loops early.\n- **Spread to Array**: Spread to an array if you need `.filter()` or `.map()` chaining.",
    codeExample: "const items = document.querySelectorAll('.todo-item');\n\n// Approach 1: forEach\nitems.forEach((item, index) => {\n  item.textContent = `${index + 1}. ${item.textContent}`;\n});\n\n// Approach 2: for...of (allows early break)\nfor (const item of items) {\n  if (item.classList.contains('active')) break;\n}",
    interviewTips: ["Mention that `for...of` is ideal when you need to `break` out of a DOM loop early."]
  },
  {
    topic: "Element Selection",
    subtopic: "Subtree Selection",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "Can querySelector and querySelectorAll be called on an element instead of document?",
    shortAnswer: "Yes, calling `element.querySelector(selector)` scopes the search exclusively to descendant elements within that specific element's DOM subtree.",
    detailedExplanation: "- **Scoped Query**: `container.querySelectorAll('.item')` searches only descendants of `container`.\n- **Performance**: Dramatically faster than searching the entire document tree for large pages.\n- **Self-Exclusion**: The element itself is never returned, only its descendants matching the selector.",
    codeExample: "const card = document.querySelector('#profile-card');\n// Queries only inside #profile-card:\nconst avatar = card.querySelector('.avatar-img');\nconst bio = card.querySelector('.bio-text');",
    interviewTips: ["Explain that scoping queries to a container element improves query performance significantly."]
  },
  {
    topic: "Element Selection",
    subtopic: "Attribute Selectors",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you select elements by attribute name and value using querySelector?",
    shortAnswer: "Use CSS attribute selector brackets `[attribute=\"value\"]` inside `querySelector` or `querySelectorAll`.",
    detailedExplanation: "- **Exact Match**: `[name=\"email\"]` matches elements with that exact attribute value.\n- **Attribute Presence**: `[disabled]` matches any element having the attribute regardless of value.\n- **Prefix Match**: `[href^=\"https\"]` matches values starting with 'https'.\n- **Substring Match**: `[class*=\"active\"]` matches values containing 'active'.",
    codeExample: "// Selecting submit buttons:\nconst submitBtn = document.querySelector('button[type=\"submit\"]');\n\n// Selecting all external links:\nconst externalLinks = document.querySelectorAll('a[href^=\"https://\"]');",
    interviewTips: ["Explain prefix (`^=`), suffix (`$=`), and substring (`*=`) attribute matching in CSS queries."]
  },
  {
    topic: "Element Selection",
    subtopic: "matches Method",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What does the element.matches() method do in the DOM?",
    shortAnswer: "`element.matches(selector)` checks whether an element would be selected by the given CSS selector string, returning `true` or `false`.",
    detailedExplanation: "- **Boolean Test**: Tests an existing element against a CSS selector without performing a DOM search.\n- **Event Delegation**: Heavily used inside delegated event handlers to check if `event.target.matches('.item-button')`.\n- **Syntax**: `element.matches('div.card.active')`.",
    codeExample: "const el = document.querySelector('#button-1');\n\nif (el.matches('button[disabled]')) {\n  console.log('Button is disabled');\n}\n\nif (el.matches('.primary, .btn-action')) {\n  console.log('Element matches primary button styles');\n}",
    interviewTips: ["Highlight `matches()` as the foundational check used in event delegation handlers."]
  },
  {
    topic: "Element Selection",
    subtopic: "closest Method",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What does the element.closest() method do in the DOM?",
    shortAnswer: "`element.closest(selector)` traverses up the DOM tree starting from the element itself, returning the closest ancestor matching the selector, or `null` if none match.",
    detailedExplanation: "- **Starts at Self**: Evaluates the element itself first; if it matches, it returns the element immediately.\n- **Ascending Traversal**: Moves upward through parent elements until a match is found or document root is reached.\n- **Event Delegation**: Essential for finding parent rows, cards, or forms when a child icon or text inside a button is clicked.",
    codeExample: "document.addEventListener('click', (event) => {\n  // Finds the nearest enclosing table row even if an inner icon was clicked:\n  const row = event.target.closest('tr');\n  if (row) {\n    console.log('Row ID:', row.dataset.id);\n  }\n});",
    interviewTips: ["Differentiate `closest()` (checks self then ancestors) from `parentElement` (direct parent only)."]
  },
  {
    topic: "Element Selection",
    subtopic: "Empty Query Results",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What does querySelector return versus querySelectorAll when no matching elements exist?",
    shortAnswer: "`querySelector()` returns `null`, while `querySelectorAll()` returns an empty `NodeList` with a `length` of 0.",
    detailedExplanation: "- **`querySelector`**: Returns a single `Element` object or `null`. Calling methods on it without a null check throws a `TypeError`.\n- **`querySelectorAll`**: Always returns a valid `NodeList` object. If no items match, `nodeList.length` is 0.\n- **Safe Iteration**: Iterating over `querySelectorAll` with `.forEach()` is safe even when 0 matches exist, as it simply executes zero times.",
    codeExample: "const item = document.querySelector('.non-existent');\nconsole.log(item); // null\n\nconst items = document.querySelectorAll('.non-existent');\nconsole.log(items.length); // 0\nitems.forEach(el => console.log(el)); // Safe: does nothing",
    interviewTips: ["Remind candidates that calling methods on `querySelector` without a null check causes 'Cannot read properties of null'."]
  },
  {
    topic: "Element Selection",
    subtopic: "Special Characters in Selectors",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you select an element whose ID or class contains special characters like dots or colons using querySelector?",
    shortAnswer: "Escape the special characters using `CSS.escape()` or double backslashes in the selector string.",
    detailedExplanation: "- **CSS Syntax Issue**: Characters like `.` (class indicator) or `:` (pseudo-class indicator) confuse the CSS selector engine if present in IDs.\n- **`CSS.escape()`**: Standard utility that automatically escapes CSS identifiers safely: `querySelector('#' + CSS.escape('user:name'))`.\n- **Manual Escaping**: Double backslashes in JavaScript string literals: `document.querySelector('#user\\\\.name')`.",
    codeExample: "// HTML: <div id=\"user:profile.name\">User Info</div>\n\n// Using CSS.escape (standard and safe):\nconst id = 'user:profile.name';\nconst el = document.querySelector('#' + CSS.escape(id));\nconsole.log(el.textContent); // 'User Info'",
    interviewTips: ["Recommend `CSS.escape(id)` as the standard API for handling tricky dynamic IDs."]
  }
];
