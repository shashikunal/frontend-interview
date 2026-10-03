// scripts/dom-gen/part2.cjs
// Questions 81 to 180: Node Creation, Insertion, Removal, Content & Text Manipulation
// 40 Easy, 45 Intermediate, 15 Difficult (100 total)

const questions = [
  // --- Node Creation & Insertion: EASY (81 - 105: 25 questions) ---
  {
    topic: "Node Creation & Insertion",
    subtopic: "createElement",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you create a new HTML element node in JavaScript?",
    shortAnswer: "Call `document.createElement('tagName')`, which creates and returns a new detached `Element` node of the specified HTML tag type.",
    detailedExplanation: "- **Detached Memory**: The element exists only in JavaScript memory until appended to the DOM.\n- **Tag Name**: Pass the HTML tag name string (e.g. `'div'`, `'button'`, `'li'`).\n- **Case Insensitive**: In HTML documents, tag names are case-insensitive.",
    codeExample: "const newCard = document.createElement('div');\nnewCard.className = 'card';\nnewCard.textContent = 'Newly created card';\ndocument.body.appendChild(newCard);",
    interviewTips: ["Mention that the created element is detached from the document tree until inserted."]
  },
  {
    topic: "Node Creation & Insertion",
    subtopic: "createTextNode",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you create a standalone text node in the DOM?",
    shortAnswer: "Call `document.createTextNode(textString)`, which returns a new `TextNode` (nodeType 3) holding the specified plain text.",
    detailedExplanation: "- **Safe from XSS**: Does not parse HTML tags; renders any markup literally as plain text.\n- **Node Type 3**: Creates a `Node.TEXT_NODE`.\n- **Modern Alternative**: `element.textContent = text` is generally preferred over manually appending text nodes.",
    codeExample: "const heading = document.createElement('h2');\nconst text = document.createTextNode('Safe <b>unparsed</b> text');\nheading.appendChild(text);\n// Renders literal <b> characters, not bold text",
    interviewTips: ["Highlight that `createTextNode` never executes or parses HTML entities."]
  },
  {
    topic: "Node Creation & Insertion",
    subtopic: "appendChild",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How does parentNode.appendChild() work and what does it return?",
    shortAnswer: "`parentNode.appendChild(childNode)` adds `childNode` as the last child of `parentNode` and returns the appended child node.",
    detailedExplanation: "- **Last Child Insertion**: Appends to the end of the parent's children.\n- **Movement**: If `childNode` is already in the document, it moves the node rather than creating a duplicate copy.\n- **Returns Appended Node**: Returns the exact node that was just appended.",
    codeExample: "const list = document.querySelector('#todo-list');\nconst item = document.createElement('li');\nitem.textContent = 'New task';\nconst returnedNode = list.appendChild(item);\nconsole.log(returnedNode === item); // true",
    interviewTips: ["Explain that appending an existing DOM node moves it from its old location automatically."]
  },
  {
    topic: "Node Creation & Insertion",
    subtopic: "append Method",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What are the advantages of element.append() over element.appendChild()?",
    shortAnswer: "`element.append()` can append multiple items simultaneously, accepts plain strings directly as text nodes, and does not require manual `createTextNode()` calls.",
    detailedExplanation: "- **Multiple Arguments**: `el.append(item1, item2, item3)` appends all arguments in one call.\n- **Direct String Support**: Automatically converts strings into text nodes (`el.append('Hello')`).\n- **Return Value**: Returns `undefined`, whereas `appendChild` returns the appended node.",
    codeExample: "const container = document.querySelector('#box');\nconst span = document.createElement('span');\nspan.textContent = 'Label: ';\n\n// Appends an element and plain text together in one call:\ncontainer.append(span, 'Dynamic Value');",
    interviewTips: ["Contrast `append()` (multiple args, accepts strings) with `appendChild()` (single node only)."]
  },
  {
    topic: "Node Creation & Insertion",
    subtopic: "prepend Method",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How does element.prepend() insert nodes into the DOM?",
    shortAnswer: "`element.prepend()` inserts nodes or strings at the very beginning of the element, before its existing first child.",
    detailedExplanation: "- **First Child Insertion**: Places arguments before `element.firstChild`.\n- **Multiple Arguments**: Accepts multiple elements and strings: `el.prepend(a, b, 'Text')`.\n- **Legacy Equivalent**: Previously required `parent.insertBefore(newNode, parent.firstChild)`.",
    codeExample: "const list = document.querySelector('ul');\nconst priorityItem = document.createElement('li');\npriorityItem.textContent = 'Urgent Task';\nlist.prepend(priorityItem); // Inserted at top of list",
    interviewTips: ["Point out that `prepend()` replaces verbose `insertBefore(newNode, firstChild)` calls."]
  },
  {
    topic: "Node Creation & Insertion",
    subtopic: "before and after Methods",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What do element.before() and element.after() do in the DOM?",
    shortAnswer: "`element.before()` inserts nodes as siblings directly before the element, while `element.after()` inserts nodes as siblings directly after it.",
    detailedExplanation: "- **Sibling Insertion**: Inserts outside the element, sharing the same parent.\n- **Multiple Arguments**: Accepts both Node objects and strings.\n- **No Parent Error**: If the element has no parent (detached), calling `.before()` or `.after()` does nothing.",
    codeExample: "const paragraph = document.querySelector('#target-p');\nconst alertBox = document.createElement('div');\nalertBox.className = 'alert';\nalertBox.textContent = 'Notice: Read below';\n\nparagraph.before(alertBox); // Inserted as preceding sibling",
    interviewTips: ["Remember: `before` and `after` insert siblings outside, whereas `prepend` and `append` insert children inside."]
  },
  {
    topic: "Node Creation & Insertion",
    subtopic: "insertBefore Method",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How does parentNode.insertBefore(newNode, referenceNode) work?",
    shortAnswer: "`insertBefore()` inserts `newNode` directly before `referenceNode` as a child of `parentNode`, or appends to the end if `referenceNode` is `null`.",
    detailedExplanation: "- **Syntax**: `parent.insertBefore(newNode, existingNode)`.\n- **Append Fallback**: If `referenceNode` is `null`, it acts identically to `appendChild(newNode)`.\n- **Throws Error**: Throws `NotFoundError` if `referenceNode` is not a child of `parentNode`.",
    codeExample: "const list = document.querySelector('ul');\nconst secondItem = list.children[1];\nconst newItem = document.createElement('li');\nnewItem.textContent = 'Inserted Item';\n\nlist.insertBefore(newItem, secondItem);",
    interviewTips: ["Mention that passing `null` as the second argument appends the node to the end."]
  },
  {
    topic: "Node Creation & Insertion",
    subtopic: "insertAdjacentHTML Positions",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What are the four position values accepted by element.insertAdjacentHTML()?",
    shortAnswer: "The four positions are `'beforebegin'` (before element), `'afterbegin'` (inside at start), `'beforeend'` (inside at end), and `'afterend'` (after element).",
    detailedExplanation: "- **`'beforebegin'`**: Before the element itself as a sibling.\n- **`'afterbegin'`**: Inside the element, before its first child.\n- **`'beforeend'`**: Inside the element, after its last child.\n- **`'afterend'`**: After the element itself as a sibling.\n- **Performance**: Parses HTML into the DOM without destroying existing child elements or event listeners.",
    codeExample: "const box = document.querySelector('#container');\nbox.insertAdjacentHTML('beforeend', '<p>Appended child</p>');\nbox.insertAdjacentHTML('beforebegin', '<hr />');",
    interviewTips: ["Highlight that `insertAdjacentHTML` preserves existing event listeners inside the target element."]
  },
  {
    topic: "Node Creation & Insertion",
    subtopic: "insertAdjacentElement",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How does element.insertAdjacentElement() differ from element.insertAdjacentHTML()?",
    shortAnswer: "`insertAdjacentElement` inserts an existing `Element` node object, whereas `insertAdjacentHTML` parses and inserts a raw HTML text string.",
    detailedExplanation: "- **Input Type**: `insertAdjacentElement(position, elementNode)` accepts a live Element.\n- **Return Value**: Returns the inserted element node.\n- **No HTML Parsing**: Avoids HTML parsing overhead since the element already exists.",
    codeExample: "const heading = document.createElement('h3');\nheading.textContent = 'Section Header';\nconst article = document.querySelector('article');\n\narticle.insertAdjacentElement('beforebegin', heading);",
    interviewTips: ["Use `insertAdjacentElement` when inserting existing element instances."]
  },
  {
    topic: "Node Creation & Insertion",
    subtopic: "insertAdjacentText",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What does element.insertAdjacentText() do in the DOM?",
    shortAnswer: "`element.insertAdjacentText(position, textString)` inserts a plain text node at one of the four insertion positions without parsing HTML tags.",
    detailedExplanation: "- **Plain Text Safety**: Treats input as raw characters, preventing XSS injection.\n- **Four Positions**: Supports `'beforebegin'`, `'afterbegin'`, `'beforeend'`, and `'afterend'`.\n- **Merges**: Adjacent text nodes can later be normalized with `element.normalize()`.",
    codeExample: "const btn = document.querySelector('#save-btn');\nbtn.insertAdjacentText('beforeend', ' (Draft)');",
    interviewTips: ["Mention `insertAdjacentText` for safely adding dynamic text without HTML parsing."]
  },
  {
    topic: "Node Creation & Insertion",
    subtopic: "createComment",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you create an HTML comment node programmatically in the DOM?",
    shortAnswer: "Call `document.createComment(commentText)`, which returns a `Comment` node (nodeType 8).",
    detailedExplanation: "- **Comment Node**: Creates a `Node.COMMENT_NODE` (type 8).\n- **Serialization**: Appears as `<!-- text -->` when serialized into HTML.\n- **Use Case**: Used by frontend template engines (like Vue and Knockout) as virtual DOM placeholders.",
    codeExample: "const comment = document.createComment('Start of dynamic widget section');\ndocument.body.appendChild(comment);",
    interviewTips: ["Frameworks like Angular and Vue use comment nodes as component anchor markers."]
  },
  {
    topic: "Node Creation & Insertion",
    subtopic: "DocumentFragment Insertion",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What happens to the DocumentFragment itself when it is appended to a DOM element?",
    shortAnswer: "All child nodes of the `DocumentFragment` are transferred into the target element, leaving the fragment completely empty.",
    detailedExplanation: "- **Automatic Unloading**: Appending a fragment moves its children, not the fragment container itself.\n- **Fragment Persistence**: The fragment variable remains in memory as an empty container ready to be reused.\n- **Performance Win**: The browser repaints once for all child nodes transferred.",
    codeExample: "const frag = document.createDocumentFragment();\nfrag.appendChild(document.createElement('p'));\nfrag.appendChild(document.createElement('p'));\n\nconsole.log(frag.childNodes.length); // 2\ndocument.body.appendChild(frag);\nconsole.log(frag.childNodes.length); // 0 (Transferred completely!)",
    interviewTips: ["Emphasize that the fragment empties itself during insertion."]
  },
  {
    topic: "Node Creation & Insertion",
    subtopic: "replaceWith Method",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you replace an element with a new element using modern JavaScript?",
    shortAnswer: "Call `oldElement.replaceWith(newElement)`, which replaces the element in the DOM tree with one or more new nodes or strings.",
    detailedExplanation: "- **Direct Replacement**: Called directly on the element to be replaced.\n- **Multiple Nodes**: Accepts multiple replacement nodes: `el.replaceWith(span1, span2)`.\n- **Legacy Alternative**: Supersedes the verbose `parent.replaceChild(newChild, oldChild)`.",
    codeExample: "const placeholder = document.querySelector('#loading-placeholder');\nconst realContent = document.createElement('div');\nrealContent.textContent = 'Data loaded!';\n\nplaceholder.replaceWith(realContent);",
    interviewTips: ["Contrast `replaceWith()` with legacy `parent.replaceChild()`."]
  },
  {
    topic: "Node Creation & Insertion",
    subtopic: "replaceChild Method",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How does parentNode.replaceChild(newChild, oldChild) work?",
    shortAnswer: "`parentNode.replaceChild(newChild, oldChild)` replaces `oldChild` with `newChild` and returns the replaced `oldChild` node.",
    detailedExplanation: "- **Return Value**: Returns the `oldChild` node that was removed.\n- **Throws Error**: Throws `NotFoundError` if `oldChild` is not a child of `parentNode`.\n- **In-Memory**: The removed `oldChild` remains available in memory if stored in a variable.",
    codeExample: "const list = document.querySelector('ul');\nconst oldFirst = list.firstElementChild;\nconst newFirst = document.createElement('li');\nnewFirst.textContent = 'Updated First Item';\n\nconst removedNode = list.replaceChild(newFirst, oldFirst);",
    interviewTips: ["Remember: `replaceChild` returns the removed old child node."]
  },
  {
    topic: "Node Creation & Insertion",
    subtopic: "removeChild Method",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What is the difference between element.remove() and parent.removeChild(child)?",
    shortAnswer: "`element.remove()` is called directly on the element and returns `undefined`, while `parent.removeChild(child)` is called on the parent and returns the removed child node.",
    detailedExplanation: "- **Target**: `el.remove()` does not require accessing `parentElement`.\n- **Return**: `removeChild` returns the detached node reference; `remove()` returns `undefined`.\n- **Browser Support**: `removeChild` is legacy DOM Level 1; `remove()` is modern DOM Living Standard.",
    codeExample: "const card = document.querySelector('.card');\n// Modern:\ncard.remove();\n\n// Legacy equivalent:\n// card.parentNode.removeChild(card);",
    interviewTips: ["Use `element.remove()` in modern code unless you explicitly need the returned node reference."]
  },
  {
    topic: "Node Creation & Insertion",
    subtopic: "Clearing Children",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What are the common ways to remove all child elements from a container in the DOM?",
    shortAnswer: "Set `container.replaceChildren()`, `container.textContent = ''`, or loop with `while (container.firstChild) container.removeChild(container.firstChild)`.",
    detailedExplanation: "- **`container.replaceChildren()`**: Modern, cleanest, and fastest standard method to empty a node.\n- **`container.textContent = ''`**: Fast and standard; clears all text and element children.\n- **`container.innerHTML = ''`**: Widely used but invokes the HTML parser engine.\n- **Loop Removal**: `while (el.firstChild) el.removeChild(el.firstChild)` preserves detached references if needed.",
    codeExample: "const container = document.querySelector('#feed');\n// Modern best practice to clear all children:\ncontainer.replaceChildren();",
    interviewTips: ["Recommend `container.replaceChildren()` as the modern best practice for emptying an element."]
  },
  {
    topic: "Node Creation & Insertion",
    subtopic: "replaceChildren Method",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What does element.replaceChildren() do when called with arguments versus without arguments?",
    shortAnswer: "Without arguments it clears all children, and with arguments it replaces all existing children with the newly provided nodes or strings in one operation.",
    detailedExplanation: "- **Empty Call**: `el.replaceChildren()` empties the element.\n- **Populated Call**: `el.replaceChildren(header, body, footer)` clears existing children and inserts the new nodes in one atomic operation.\n- **Performance**: Eliminates the layout reflow caused by first clearing and then sequentially appending.",
    codeExample: "const list = document.querySelector('#item-list');\nconst newItems = ['Apple', 'Banana', 'Cherry'].map(name => {\n  const li = document.createElement('li');\n  li.textContent = name;\n  return li;\n});\n\n// Replaces entire list contents atomically:\nlist.replaceChildren(...newItems);",
    interviewTips: ["Highlight `replaceChildren()` as an atomic clear-and-fill operation that prevents intermediate reflows."]
  },
  {
    topic: "Node Creation & Insertion",
    subtopic: "Moving Existing Nodes",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What happens if you call appendChild() on an element that is already attached elsewhere in the document?",
    shortAnswer: "The element is automatically moved from its original parent to the new parent; DOM elements can only exist in one place at a time.",
    detailedExplanation: "- **Single Parent Invariant**: A DOM node cannot have two parents simultaneously.\n- **Implicit Detach**: `appendChild()` detaches the element from its existing parent before appending to the new one.\n- **No Clone**: No new node is created; the exact same node instance is transferred.",
    codeExample: "const item = document.querySelector('#item-1');\nconst targetList = document.querySelector('#completed-tasks');\n\n// Moves #item-1 from its current list to targetList automatically:\ntargetList.appendChild(item);",
    interviewTips: ["Explain that DOM nodes cannot have multiple parents, so insertion always moves existing nodes."]
  },
  {
    topic: "Node Creation & Insertion",
    subtopic: "Document Normalization",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What does element.normalize() do to adjacent text nodes in the DOM?",
    shortAnswer: "`element.normalize()` merges adjacent text nodes into a single text node and removes empty text nodes throughout the subtree.",
    detailedExplanation: "- **Adjacent Text Nodes**: Multiple insertions or deletions can leave separate contiguous text nodes under one parent.\n- **`normalize()`**: Collapses them into a single contiguous text node.\n- **DOM Cleanup**: Standardizes DOM tree structure for consistent serialization and queries.",
    codeExample: "const p = document.createElement('p');\np.appendChild(document.createTextNode('Part 1 '));\np.appendChild(document.createTextNode('Part 2'));\nconsole.log(p.childNodes.length); // 2\n\np.normalize();\nconsole.log(p.childNodes.length); // 1 (Merged into 'Part 1 Part 2')",
    interviewTips: ["Explain that `normalize()` merges consecutive text nodes and deletes empty ones."]
  },
  {
    topic: "Node Creation & Insertion",
    subtopic: "Handling Script Tags in innerHTML",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "Do <script> tags execute when inserted into the DOM via innerHTML?",
    shortAnswer: "No, HTML5 specifies that `<script>` tags inserted via `innerHTML` must NOT execute.",
    detailedExplanation: "- **HTML5 Security Rule**: Browsers block `<script>` tags inserted via `innerHTML` to reduce XSS risks.\n- **XSS Loophole**: Inline event handlers (like `<img src=\"x\" onerror=\"alert(1)\">`) STILL execute, making `innerHTML` insecure for untrusted content.\n- **Executing Scripts**: To execute a dynamic script, create it with `document.createElement('script')` and append it.",
    codeExample: "const div = document.createElement('div');\n// The script tag below will NOT execute:\ndiv.innerHTML = '<script>alert(\"Will not run\");</script>';\ndocument.body.appendChild(div);",
    interviewTips: ["Warn that while `<script>` tags don't run in `innerHTML`, `<img onerror>` handlers DO run."]
  },

  // --- Content & Text Manipulation: EASY & INTERMEDIATE (106 - 140: 35 questions) ---
  {
    topic: "Content & Text Manipulation",
    subtopic: "innerHTML vs textContent",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What is the primary difference between innerHTML and textContent?",
    shortAnswer: "`innerHTML` parses and renders HTML tags, while `textContent` treats all input as plain literal text, safely escaping markup.",
    detailedExplanation: "- **`innerHTML`**: Parses strings through the HTML parser. Renders markup tags but exposes apps to XSS vulnerabilities.\n- **`textContent`**: Returns or sets raw unparsed text content. Safely encodes `<` and `>` into plain text.\n- **Performance**: `textContent` is significantly faster because it skips the HTML parser engine.",
    codeExample: "const box1 = document.createElement('div');\nbox1.innerHTML = '<b>Bold</b>';\nconsole.log(box1.firstElementChild.tagName); // 'B'\n\nconst box2 = document.createElement('div');\nbox2.textContent = '<b>Bold</b>';\nconsole.log(box2.children.length); // 0 (Renders literal '<b>Bold</b>')",
    interviewTips: ["Always advocate for `textContent` when displaying user input to prevent XSS injection."]
  },
  {
    topic: "Content & Text Manipulation",
    subtopic: "textContent vs innerText",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What is the difference between textContent and innerText in the DOM?",
    shortAnswer: "`textContent` returns all text including hidden elements and script/style tags, while `innerText` is aware of CSS layout and returns only visible, rendered text.",
    detailedExplanation: "- **Layout Awareness**: `innerText` triggers a reflow to determine visibility; hidden elements (`display: none`) are excluded.\n- **`textContent`**: Reads raw text nodes directly from memory without triggering reflows, including `<style>` and hidden text.\n- **Formatting**: `innerText` respects visual line breaks and uppercase text-transform; `textContent` preserves raw source whitespace.",
    codeExample: "<!-- <div id=\"box\">Hello <span style=\"display:none\">Hidden</span></div> -->\nconst box = document.querySelector('#box');\nconsole.log(box.textContent); // 'Hello Hidden'\nconsole.log(box.innerText);   // 'Hello'",
    interviewTips: ["Remember: `innerText` triggers a layout reflow to inspect CSS visibility; `textContent` does not."]
  },
  {
    topic: "Content & Text Manipulation",
    subtopic: "outerHTML Property",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What does element.outerHTML return and what happens when you assign a new string to it?",
    shortAnswer: "`outerHTML` returns the HTML string of the element including its own opening and closing tags, and assigning to it replaces the element with the parsed HTML in the DOM.",
    detailedExplanation: "- **Reading**: Returns `<div id=\"box\"><p>Text</p></div>`.\n- **Writing**: `el.outerHTML = '<section>New</section>'` replaces `el` in the DOM tree.\n- **Variable Gotcha**: The original JavaScript variable still points to the old detached element in memory.",
    codeExample: "const btn = document.querySelector('#legacy-btn');\nbtn.outerHTML = '<button id=\"new-btn\">Updated</button>';\n// The DOM now contains #new-btn, but 'btn' variable still holds the detached #legacy-btn node",
    interviewTips: ["Mention the gotcha: assigning `outerHTML` replaces the node in DOM, but the JS variable still references the old node."]
  },
  {
    topic: "Content & Text Manipulation",
    subtopic: "outerText Property",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What does outerText do when assigned to an element?",
    shortAnswer: "Assigning to `element.outerText` replaces the entire element in the DOM with a plain text node containing the assigned string.",
    detailedExplanation: "- **Reading**: Returns the exact same visible text as `innerText`.\n- **Writing**: Unlike `innerText` (which replaces child content), `outerText` replaces the element itself with a text node.\n- **Rarely Used**: Rarely used in modern code; `replaceWith(text)` is preferred.",
    codeExample: "const span = document.querySelector('span.badge');\nspan.outerText = 'Plain label'; // Replaces the <span> with a plain text node in the DOM",
    interviewTips: ["State that `outerText` replaces the element node itself with a text node."]
  },
  {
    topic: "Content & Text Manipulation",
    subtopic: "Attributes: getAttribute",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you read an HTML attribute value using getAttribute()?",
    shortAnswer: "Call `element.getAttribute('attributeName')`, which returns the attribute string value or `null` if not present.",
    detailedExplanation: "- **HTML String Value**: Returns the exact string written in the HTML tag.\n- **Case Insensitive**: Attribute names are case-insensitive in HTML.\n- **Custom Attributes**: Works for standard and non-standard custom attributes (`el.getAttribute('data-id')`).",
    codeExample: "const link = document.querySelector('a');\nconst href = link.getAttribute('href');\nconsole.log('Target href:', href);",
    interviewTips: ["Note that `getAttribute` returns the literal attribute string, which may differ from the DOM property."]
  },
  {
    topic: "Content & Text Manipulation",
    subtopic: "Attributes: setAttribute",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you set or update an HTML attribute using setAttribute()?",
    shortAnswer: "Call `element.setAttribute('attributeName', 'value')`, which sets or updates the specified attribute on the element.",
    detailedExplanation: "- **String Conversion**: Values are automatically converted to strings (e.g., boolean `true` becomes `'true'`).\n- **Reflects in DOM**: The attribute appears in `element.outerHTML` and browser DevTools element inspector.\n- **Valid Attribute Names**: Must be valid XML/HTML attribute names without spaces.",
    codeExample: "const input = document.querySelector('input');\ninput.setAttribute('placeholder', 'Enter email address');\ninput.setAttribute('autocomplete', 'off');",
    interviewTips: ["Remember that `setAttribute` always converts the second argument to a string."]
  },
  {
    topic: "Content & Text Manipulation",
    subtopic: "Attributes: hasAttribute",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you verify whether an element has a specific attribute in the DOM?",
    shortAnswer: "Call `element.hasAttribute('attributeName')`, which returns `true` if the attribute exists or `false` otherwise.",
    detailedExplanation: "- **Presence Check**: Returns `true` even if the attribute value is empty (`<input required>`).\n- **Boolean Result**: Safe, clean boolean check without comparing against `null`.\n- **Case Insensitive**: In HTML, attribute names are checked case-insensitively.",
    codeExample: "const input = document.querySelector('#email-input');\nif (input.hasAttribute('required')) {\n  console.log('Field is required for form submission.');\n}",
    interviewTips: ["Highlight `hasAttribute` as cleaner than `getAttribute(name) !== null`."]
  },
  {
    topic: "Content & Text Manipulation",
    subtopic: "Attributes: removeAttribute",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you remove an attribute from an HTML element in the DOM?",
    shortAnswer: "Call `element.removeAttribute('attributeName')` to delete the attribute from the element.",
    detailedExplanation: "- **Complete Removal**: Deletes the attribute entirely from the element's attribute map.\n- **Boolean Attributes**: Required for removing boolean attributes like `disabled`, `readonly`, or `checked`.\n- **No Error if Missing**: Calling `removeAttribute` on an attribute that does not exist does not throw an error.",
    codeExample: "const submitBtn = document.querySelector('#submit-btn');\nsubmitBtn.removeAttribute('disabled'); // Re-enables the button",
    interviewTips: ["Mention that setting `setAttribute('disabled', 'false')` still disables the element; `removeAttribute` is required."]
  },
  {
    topic: "Content & Text Manipulation",
    subtopic: "toggleAttribute Method",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What does element.toggleAttribute() do in modern JavaScript?",
    shortAnswer: "`element.toggleAttribute('attributeName', [force])` toggles the presence of a boolean attribute, removing it if present or adding it if absent.",
    detailedExplanation: "- **Toggle Behavior**: If the attribute exists, it is removed; if it does not exist, it is added with an empty string value.\n- **Force Parameter**: Passing a boolean second argument (`force`) adds it if `true` and removes it if `false`.\n- **Clean Code**: Eliminates manual `if (hasAttribute) removeAttribute else setAttribute` blocks.",
    codeExample: "const input = document.querySelector('#terms-checkbox');\n// Toggles 'disabled' state based on validation flag:\ninput.toggleAttribute('disabled', isFormSubmitting);",
    interviewTips: ["Highlight `toggleAttribute(name, force)` as the cleanest standard way to manage boolean attributes."]
  },
  {
    topic: "Content & Text Manipulation",
    subtopic: "Attribute vs Property Sync",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is the difference between an HTML attribute and a DOM property?",
    shortAnswer: "An HTML attribute is the initial state defined in the HTML markup, while a DOM property is a live JavaScript property on the DOM element object representing current runtime state.",
    detailedExplanation: "- **Attribute**: Static initial value in HTML text (`input.getAttribute('value')`).\n- **Property**: Live current state in JavaScript (`input.value`). When a user types into an input, `input.value` updates live, but `getAttribute('value')` remains the original default.\n- **Type Differences**: Attributes are always strings; properties can be booleans, numbers, or objects.",
    codeExample: "// HTML: <input id=\"user\" value=\"Initial\">\nconst input = document.getElementById('user');\ninput.value = 'User typed this';\n\nconsole.log(input.value);                  // 'User typed this' (Live property)\nconsole.log(input.getAttribute('value'));  // 'Initial' (Original HTML attribute)",
    interviewTips: ["Use the `<input>` value demonstration to prove that properties reflect live user input while attributes reflect initial markup."]
  },
  {
    topic: "Content & Text Manipulation",
    subtopic: "Boolean Attributes: checked",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "Why does setting setAttribute('checked', 'false') on a checkbox still check it?",
    shortAnswer: "Because in HTML, the mere presence of a boolean attribute means `true` regardless of its string value; setting `setAttribute('checked', 'false')` adds the attribute, thus checking the box.",
    detailedExplanation: "- **HTML Boolean Rule**: If the attribute name is present on the tag, it evaluates to true. `<input type=\"checkbox\" checked=\"false\">` is checked!\n- **Correct DOM Way**: Use the boolean property: `checkbox.checked = false`.\n- **Correct Attribute Way**: Use `checkbox.removeAttribute('checked')`.",
    codeExample: "const chk = document.querySelector('#terms');\n// Bug: This still CHECKS the checkbox!\n// chk.setAttribute('checked', 'false');\n\n// Correct:\nchk.checked = false;",
    interviewTips: ["This is a classic senior interview trap: boolean attributes are active whenever present, even if value is 'false'."]
  },
  {
    topic: "Content & Text Manipulation",
    subtopic: "Attributes Collection",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is element.attributes and what data structure does it use?",
    shortAnswer: "`element.attributes` is a live `NamedNodeMap` collection holding all `Attr` objects defined on that element.",
    detailedExplanation: "- **`NamedNodeMap`**: Array-like collection accessible by index (`attributes[0]`) or by name (`attributes['id']`).\n- **`Attr` Node**: Each attribute is an Attr object with `.name` and `.value` properties.\n- **Live Updates**: Reflects runtime additions or removals via `setAttribute()`.",
    codeExample: "const img = document.querySelector('img');\nfor (const attr of img.attributes) {\n  console.log(`${attr.name} = ${attr.value}`);\n}",
    interviewTips: ["Mention that `element.attributes` returns a `NamedNodeMap` of `Attr` nodes."]
  },
  {
    topic: "Content & Text Manipulation",
    subtopic: "Dataset API",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How does the element.dataset API convert kebab-case data-* attributes into camelCase properties?",
    shortAnswer: "`element.dataset` strips the `data-` prefix and converts remaining lowercase hyphenated words into camelCase property names (e.g. `data-user-id` becomes `dataset.userId`).",
    detailedExplanation: "- **Conversion Rule**: `data-order-item-id` maps to `dataset.orderItemId`.\n- **Reverse Conversion**: Assigning `dataset.userStatus = 'active'` sets `data-user-status=\"active\"` on the HTML element.\n- **String Values**: All values stored in dataset are coerced to strings.",
    codeExample: "const btn = document.querySelector('#btn');\n// HTML: <button data-item-id=\"42\" data-is-admin=\"true\"></button>\nconsole.log(btn.dataset.itemId);  // '42'\nconsole.log(btn.dataset.isAdmin); // 'true' (string!)\n\n// Updating dataset writes back to HTML attribute:\nbtn.dataset.newSetting = 'enabled';\nconsole.log(btn.getAttribute('data-new-setting')); // 'enabled'",
    interviewTips: ["Remember that values read from `dataset` are always strings, so `'true'` is truthy and `'false'` is also truthy!"]
  },
  {
    topic: "Content & Text Manipulation",
    subtopic: "Dataset Deletion",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you delete a custom data attribute using the dataset property?",
    shortAnswer: "Use the `delete` operator: `delete element.dataset.myAttribute`, which removes the underlying `data-my-attribute` from the HTML element.",
    detailedExplanation: "- **`delete` Operator**: Calling `delete el.dataset.foo` removes the `data-foo` attribute from the DOM.\n- **Equivalent**: Exactly equivalent to `el.removeAttribute('data-foo')`.\n- **Clean Syntax**: Offers natural object property deletion syntax.",
    codeExample: "const card = document.querySelector('.card');\ncard.dataset.pendingStatus = 'true';\n\n// Deleting removes the attribute completely:\ndelete card.dataset.pendingStatus;\nconsole.log(card.hasAttribute('data-pending-status')); // false",
    interviewTips: ["Mention using the `delete` operator on `dataset` properties to delete data attributes."]
  },
  {
    topic: "Content & Text Manipulation",
    subtopic: "classList API Overview",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What is element.classList and what methods does it provide for managing CSS classes?",
    shortAnswer: "`element.classList` is a live `DOMTokenList` of an element's classes providing `.add()`, `.remove()`, `.toggle()`, `.contains()`, and `.replace()` methods.",
    detailedExplanation: "- **`add(...classes)`**: Adds one or more classes, ignoring duplicates.\n- **`remove(...classes)`**: Removes one or more specified classes.\n- **`toggle(class, [force])`**: Toggles class presence, with optional boolean force argument.\n- **`contains(class)`**: Returns a boolean indicating if the class exists on the element.\n- **`replace(oldClass, newClass)`**: Atomically replaces an existing class with a new one.",
    codeExample: "const modal = document.querySelector('#modal');\nmodal.classList.add('visible', 'fade-in');\nmodal.classList.remove('hidden');\nconsole.log(modal.classList.contains('visible')); // true\nmodal.classList.replace('fade-in', 'fade-out');",
    interviewTips: ["Always prefer `classList` methods over raw `className` string manipulation."]
  },
  {
    topic: "Content & Text Manipulation",
    subtopic: "classList.toggle with Force",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How does the optional second boolean parameter of classList.toggle() work?",
    shortAnswer: "If the second parameter is `true`, the class is added regardless of current presence; if `false`, the class is removed.",
    detailedExplanation: "- **Conditional Class Assignment**: `el.classList.toggle('active', isActive)` adds if `isActive` is true, removes if false.\n- **Eliminates If/Else**: Replaces verbose `if (condition) add else remove` statements.\n- **Return Value**: Returns a boolean indicating whether the class is present after the operation.",
    codeExample: "const button = document.querySelector('#theme-toggle');\nconst isDarkMode = true;\n\n// Adds 'dark-theme' if true, removes if false:\ndocument.body.classList.toggle('dark-theme', isDarkMode);",
    interviewTips: ["Highlight `classList.toggle(className, boolean)` as clean, concise conditional class code."]
  },
  {
    topic: "Content & Text Manipulation",
    subtopic: "className vs classList",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What is the difference between element.className and element.classList?",
    shortAnswer: "`className` gets or sets the entire class attribute as a single plain string, while `classList` provides a structured `DOMTokenList` object with helper methods.",
    detailedExplanation: "- **`className`**: String property. Setting `el.className = 'btn'` completely overwrites all existing classes.\n- **`classList`**: Object with safe methods (`add`, `remove`, `toggle`) that avoid clobbering existing classes.\n- **Error Prevention**: `classList.add()` automatically prevents duplicate class entries; `className += ' foo'` can introduce spacing bugs.",
    codeExample: "const el = document.querySelector('div');\n// Risky: overwrites everything\n// el.className = 'new-class';\n\n// Safe: adds without touching existing classes\nel.classList.add('new-class');",
    interviewTips: ["State that `className` overwrites all classes, while `classList` allows targeted class updates."]
  },
  {
    topic: "Content & Text Manipulation",
    subtopic: "Inline Styles: style Property",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you modify an element's inline CSS styles using the style property?",
    shortAnswer: "Access `element.style.propertyName` using camelCase property names (e.g. `element.style.backgroundColor = 'blue'`).",
    detailedExplanation: "- **CamelCase Mapping**: Hyphenated CSS properties map to camelCase: `background-color` becomes `backgroundColor`, `font-size` becomes `fontSize`.\n- **Inline Only**: `element.style` only reads and writes inline styles on that specific tag, NOT rules from external CSS stylesheets.\n- **Units Required**: CSS length properties require unit suffixes: `el.style.width = '100px'`, not `100`.",
    codeExample: "const box = document.querySelector('.box');\nbox.style.backgroundColor = '#007acc';\nbox.style.marginTop = '24px';\nbox.style.display = 'flex';",
    interviewTips: ["Remind candidates that CSS properties in JavaScript use camelCase and require explicit units ('px', '%')."]
  },
  {
    topic: "Content & Text Manipulation",
    subtopic: "style.cssText Property",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What does element.style.cssText do and when is it useful?",
    shortAnswer: "`element.style.cssText` gets or sets the element's entire inline style attribute as a raw CSS string, allowing multiple styles to be set at once.",
    detailedExplanation: "- **Batch Styling**: Sets multiple inline styles simultaneously: `el.style.cssText = 'color: red; font-size: 16px;'`.\n- **Overwrites Existing**: Assigning to `cssText` completely replaces all existing inline styles on that element.\n- **Appending**: Use `el.style.cssText += '; border: 1px solid black;'` to append without overwriting.",
    codeExample: "const card = document.querySelector('.card');\n// Setting multiple styles in a single statement:\ncard.style.cssText = 'background: #f0f0f0; border-radius: 8px; padding: 16px;';",
    interviewTips: ["Mention that `style.cssText` overwrites existing inline styles unless appended with `+=`."]
  },
  {
    topic: "Content & Text Manipulation",
    subtopic: "getComputedStyle API",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "How do you read the final computed CSS style of an element including stylesheet rules?",
    shortAnswer: "Call `window.getComputedStyle(element)`, which returns a live `CSSStyleDeclaration` containing all resolved, active CSS properties.",
    detailedExplanation: "- **Includes All Styles**: Resolves external CSS stylesheets, `<style>` tags, inline styles, and browser user-agent defaults.\n- **Resolved Values**: Colors are converted to `rgb(...)` / `rgba(...)`, and relative units (`rem`, `em`, `%`) are resolved to exact pixel values (`'16px'`).\n- **Read-Only**: The returned object is strictly read-only; assign to `element.style` to modify styles.\n- **Pseudo-Elements**: Accepts a second argument to inspect pseudo-elements: `getComputedStyle(el, '::after')`.",
    codeExample: "const header = document.querySelector('h1');\nconst computed = window.getComputedStyle(header);\nconsole.log('Active font size in px:', computed.fontSize);\nconsole.log('Active color:', computed.color);",
    interviewTips: ["Contrast `element.style` (inline styles only, read/write) with `window.getComputedStyle` (all applied styles, read-only)."]
  },
  {
    topic: "Content & Text Manipulation",
    subtopic: "getComputedStyle Pseudo Elements",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you read the computed styles of a pseudo-element like ::before or ::after using JavaScript?",
    shortAnswer: "Pass the pseudo-element string as the second argument to `window.getComputedStyle(element, '::before')`.",
    detailedExplanation: "- **Second Argument**: Pass `'::before'`, `'::after'`, `'::placeholder'`, or `null`.\n- **DOM Absence**: Pseudo-elements do not exist as independent DOM nodes, so this is the only way to inspect their styles via JavaScript.\n- **Reading Content**: You can read pseudo-element generated text: `computed.getPropertyValue('content')`.",
    codeExample: "const button = document.querySelector('.tooltip-btn');\nconst afterStyle = window.getComputedStyle(button, '::after');\nconsole.log('Tooltip text content:', afterStyle.content);",
    interviewTips: ["Mention that pseudo-elements don't exist in the DOM tree, so `getComputedStyle(el, '::after')` is the only way to inspect them."]
  },
  {
    topic: "Content & Text Manipulation",
    subtopic: "CSS Custom Properties (Variables)",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you read and update CSS Custom Properties (CSS variables) dynamically via the DOM?",
    shortAnswer: "Read using `getComputedStyle(element).getPropertyValue('--var-name')`, and update using `element.style.setProperty('--var-name', 'value')`.",
    detailedExplanation: "- **Reading**: `window.getComputedStyle(el).getPropertyValue('--primary-color').trim()`.\n- **Writing**: `el.style.setProperty('--primary-color', '#ff5722')`.\n- **Root Variables**: Update global variables on `document.documentElement.style.setProperty(...)` to trigger theme updates application-wide.",
    codeExample: "// Setting a global CSS theme variable:\ndocument.documentElement.style.setProperty('--brand-color', '#4f46e5');\n\n// Reading active variable value:\nconst activeColor = getComputedStyle(document.documentElement).getPropertyValue('--brand-color').trim();\nconsole.log('Active brand color:', activeColor);",
    interviewTips: ["Explain updating `--custom-var` on `document.documentElement` as the standard technique for theme switching."]
  },
  {
    topic: "Content & Text Manipulation",
    subtopic: "setProperty and removeProperty",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you set an inline style with '!important' priority using JavaScript?",
    shortAnswer: "Call `element.style.setProperty('property', 'value', 'important')`.",
    detailedExplanation: "- **Direct Assignment Fails**: `element.style.color = 'red !important'` is invalid syntax and fails silently.\n- **`setProperty` Method**: Accepts property name, value, and priority: `el.style.setProperty('color', 'red', 'important')`.\n- **`removeProperty`**: `el.style.removeProperty('color')` removes an inline style property cleanly.",
    codeExample: "const banner = document.querySelector('#banner');\n// Setting a style with !important:\nbanner.style.setProperty('display', 'block', 'important');\n\n// Removing an inline style:\nbanner.style.removeProperty('display');",
    interviewTips: ["Point out that standard property assignment (`el.style.color = 'red !important'`) fails; `setProperty()` must be used."]
  },
  {
    topic: "Content & Text Manipulation",
    subtopic: "HTML Sanitizer API",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is the new native HTML Sanitizer API and how does it secure DOM insertions?",
    shortAnswer: "The native Sanitizer API automatically removes executable scripts and dangerous attributes from HTML strings before inserting them into elements via `element.setHTML()`.",
    detailedExplanation: "- **Native XSS Defense**: Sanitizes untrusted user markup natively inside browser C++ engines.\n- **`element.setHTML(untrustedString, { sanitizer })`**: Safely parses and strips `<script>`, inline event handlers, and javascript: URLs.\n- **Configuration**: Allows configuring allowed elements, blocked tags, and allowed attributes.",
    codeExample: "// Modern Native Sanitization:\nconst userMarkup = '<p>Hello <script>malicious()</script></p>';\nconst target = document.querySelector('#output');\n// target.setHTML(userMarkup); // Automatically strips dangerous script tag!",
    interviewTips: ["Highlight `element.setHTML()` and the Sanitizer API as the modern browser-native replacement for third-party libraries like DOMPurify."]
  },
  {
    topic: "Content & Text Manipulation",
    subtopic: "innerHTML XSS Vulnerability",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "Why is setting element.innerHTML with unsanitized user input considered a major security vulnerability?",
    shortAnswer: "Unsanitized user input can inject malicious HTML payloads containing inline event handlers (like `<img src=x onerror=... >`) that execute attacker JavaScript in the victim's session.",
    detailedExplanation: "- **Cross-Site Scripting (XSS)**: Attackers steal session cookies, hijack credentials, or perform unauthorized actions.\n- **Inline Handlers**: Although `<script>` tags don't run in `innerHTML`, `onerror`, `onload`, and `autofocus` handlers execute immediately.\n- **Prevention**: Use `textContent` for plain text, or sanitize HTML using trusted sanitizers before assigning to `innerHTML`.",
    codeExample: "const userInput = '<img src=\"invalid\" onerror=\"stealCookies()\">';\n// Vulnerable to XSS:\n// document.querySelector('#bio').innerHTML = userInput;\n\n// Secure:\ndocument.querySelector('#bio').textContent = userInput;",
    interviewTips: ["Emphasize that `textContent` renders inputs as inert text strings, making it immune to HTML injection."]
  }
];

module.exports = questions;
