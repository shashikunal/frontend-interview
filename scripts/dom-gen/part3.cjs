// scripts/dom-gen/part3.cjs
module.exports = [
  {
    "topic": "Node Removal & Replacement",
    "subtopic": "element.remove() Method",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "How do you remove an element directly from the DOM using modern JavaScript?",
    "shortAnswer": "Call `element.remove()` on the element instance to detach it directly from its parent node in the DOM tree.",
    "detailedExplanation": "- **Direct Removal**: Does not require finding or referencing the parent element first.\n- **Modern Standard**: Supported in all modern evergreen browsers.\n- **Detached State**: The removed element remains in JavaScript memory if a variable still holds a reference to it.",
    "codeExample": "const banner = document.querySelector('.promo-banner');\nif (banner) {\n  banner.remove();\n}",
    "interviewTips": [
      "Mention that `element.remove()` replaced the verbose `node.parentNode.removeChild(node)` pattern."
    ]
  },
  {
    "topic": "Node Removal & Replacement",
    "subtopic": "parentNode.removeChild()",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "How does parentNode.removeChild() work and what does it return?",
    "shortAnswer": "`parentNode.removeChild(child)` removes the specified child node from the DOM and returns a reference to that removed node.",
    "detailedExplanation": "- **Return Value**: Returns the removed node so you can re-insert it elsewhere or inspect it.\n- **Error Case**: Throws a `NotFoundError` (DOMException) if the node is not a direct child of the specified parent.\n- **Memory**: The node remains in memory as long as the returned reference is held.",
    "codeExample": "const list = document.querySelector('#tasks');\nconst firstTask = list.firstElementChild;\n\n// Removes and captures the removed node\nconst removedTask = list.removeChild(firstTask);\nconsole.log(removedTask.textContent); // Still accessible",
    "interviewTips": [
      "Highlight that `removeChild` returns the detached node, making it useful for moving elements between containers."
    ]
  },
  {
    "topic": "Node Removal & Replacement",
    "subtopic": "element.replaceWith()",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you replace an existing DOM element with another element or text using replaceWith()?",
    "shortAnswer": "Call `element.replaceWith(...nodesOrStrings)` to substitute the target element with one or more replacement nodes or string values.",
    "detailedExplanation": "- **Direct Replacement**: Operates directly on the element without needing parentNode references.\n- **Multi-Argument**: Accepts multiple elements and strings simultaneously.\n- **Automatic Text Nodes**: Strings passed to `replaceWith()` are automatically converted to DOM Text nodes.",
    "codeExample": "const placeholder = document.querySelector('#loading-spinner');\nconst content = document.createElement('div');\ncontent.className = 'dashboard-content';\ncontent.textContent = 'Welcome back!';\n\n// Replaces spinner with actual content in place\nplaceholder.replaceWith(content);",
    "interviewTips": [
      "Compare `replaceWith()` to `parentNode.replaceChild()`, explaining how `replaceWith()` is simpler and supports multiple nodes."
    ]
  },
  {
    "topic": "Node Removal & Replacement",
    "subtopic": "parentNode.replaceChild()",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How does parentNode.replaceChild() differ from element.replaceWith()?",
    "shortAnswer": "`replaceChild(newChild, oldChild)` is called on the parent node and takes exactly two nodes, returning the replaced node, whereas `replaceWith()` is called on the child itself and accepts multiple nodes or strings.",
    "detailedExplanation": "- **Caller**: `replaceChild()` must be invoked on the parent container; `replaceWith()` is called directly on the target element.\n- **Arguments**: `replaceChild` accepts `(newChild, oldChild)`; `replaceWith` accepts `(...nodesOrDOMStrings)`.\n- **Return Value**: `replaceChild` returns the old removed child node; `replaceWith` returns `undefined`.",
    "codeExample": "const container = document.querySelector('#wrapper');\nconst oldCard = document.querySelector('.card-v1');\nconst newCard = document.createElement('div');\nnewCard.className = 'card-v2';\n\nconst removed = container.replaceChild(newCard, oldCard);\nconsole.log(removed === oldCard); // true",
    "interviewTips": [
      "Remember parameter order in `replaceChild`: (newChild, oldChild). Confusing this order is a common mistake."
    ]
  },
  {
    "topic": "Node Removal & Replacement",
    "subtopic": "Clearing All Children with replaceChildren()",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "What is the cleanest and fastest way to empty all child nodes from an element?",
    "shortAnswer": "Call `element.replaceChildren()` with no arguments to remove all child nodes quickly without triggering the HTML parser.",
    "detailedExplanation": "- **Cleaner than innerHTML**: `element.replaceChildren()` avoids parsing HTML string syntax, making it safer and faster.\n- **Atomic Operation**: Clears all child nodes in a single engine operation without layout thrashing.\n- **Optional Replacements**: You can pass new children directly `element.replaceChildren(newChild1, newChild2)` to replace existing ones instantly.",
    "codeExample": "const resultsList = document.querySelector('#search-results');\n// Empties the container completely in one step:\nresultsList.replaceChildren();",
    "interviewTips": [
      "Point out that `replaceChildren()` is the modern web standard replacement for `el.innerHTML = ''` and `while(el.firstChild) el.removeChild(el.firstChild)`."
    ]
  },
  {
    "topic": "Node Removal & Replacement",
    "subtopic": "Clearing Children via innerHTML vs replaceChildren",
    "difficulty": "INTERMEDIATE",
    "questionType": "COMPARISON",
    "question": "What are the performance and security differences between element.innerHTML = '' and element.replaceChildren()?",
    "shortAnswer": "`element.replaceChildren()` directly removes nodes at the C++ browser engine level without invoking the HTML parser, making it faster and less error-prone than `element.innerHTML = ''`.",
    "detailedExplanation": "- **Parser Overhead**: Assigning to `innerHTML` invokes the browser's HTML parser even when passing an empty string in some engines.\n- **Type Safety**: `replaceChildren()` accepts DOM node references directly, avoiding string concatenation vulnerabilities.\n- **Browser Support**: `replaceChildren()` is supported across all major browsers since 2020.",
    "codeExample": "const list = document.querySelector('#user-list');\n\n// Fast & Modern:\nlist.replaceChildren();\n\n// Old idiom (invokes string coercion/parser):\n// list.innerHTML = '';",
    "interviewTips": [
      "Explain that `replaceChildren()` communicates DOM manipulation intent much more clearly to future maintainers."
    ]
  },
  {
    "topic": "Node Removal & Replacement",
    "subtopic": "Detached DOM Tree & Memory Leaks",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "What is a detached DOM node and how does it cause memory leaks in JavaScript applications?",
    "shortAnswer": "A detached DOM node is an element removed from the document tree but still referenced by a JavaScript variable, event listener, or closure, preventing garbage collection.",
    "detailedExplanation": "- **Tree Retention**: If you hold a reference to even one detached child node, the browser garbage collector cannot free that node OR any of its ancestor elements.\n- **Event Handlers**: Event listeners attached to detached elements keep callbacks, closures, and scoped variables pinned in memory.\n- **Detection**: Diagnosed using Chrome DevTools Memory tab by taking heap snapshots and filtering by 'Detached HTMLDivElement'.",
    "codeExample": "// Potential Memory Leak:\nlet cachedButton;\nfunction setup() {\n  const btn = document.querySelector('#action-btn');\n  cachedButton = btn; // Global reference held!\n  btn.remove();        // Removed from DOM, but still in heap\n}\n\n// Fix: Nullify reference when element is detached\nfunction cleanup() {\n  cachedButton = null;\n}",
    "interviewTips": [
      "Mention that single-page applications (SPAs) are especially vulnerable to detached DOM leaks during page/route transitions."
    ]
  },
  {
    "topic": "Node Removal & Replacement",
    "subtopic": "Garbage Collection of Event Listeners on Removed Elements",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "Does removing an element from the DOM automatically remove its registered event listeners?",
    "shortAnswer": "No, removing an element removes it from the display tree, but if JavaScript references to the element or its closures persist, event listeners remain in memory and are not garbage collected.",
    "detailedExplanation": "- **Clean Detachment**: If an element has zero JavaScript references pointing to it, the browser garbage collector will reclaim both the element and its listeners.\n- **Circular Closures**: If an event handler closes over variables that reference the element, or a global object stores the element reference, the entire closure tree leaks.\n- **Best Practice**: Always invoke `removeEventListener` or use an `AbortController` signal before removing elements with long-lived callbacks.",
    "codeExample": "const controller = new AbortController();\nconst btn = document.querySelector('#subscribe-btn');\n\nbtn.addEventListener('click', () => {\n  console.log('Subscribed');\n}, { signal: controller.signal });\n\n// When removing component:\ncontroller.abort(); // Automatically unbinds all associated listeners\nbtn.remove();",
    "interviewTips": [
      "Mention AbortController as the cleanest modern pattern for tearing down all event listeners when components unmount."
    ]
  },
  {
    "topic": "Node Removal & Replacement",
    "subtopic": "Removing Attributes vs Removing Elements",
    "difficulty": "EASY",
    "questionType": "CONCEPTUAL",
    "question": "What is the difference between element.removeAttribute() and element.remove()?",
    "shortAnswer": "`element.removeAttribute('name')` deletes an attribute from an element while keeping the element in the DOM, whereas `element.remove()` deletes the entire element node from the DOM tree.",
    "detailedExplanation": "- **Scope**: `removeAttribute` modifies element metadata (like `disabled`, `class`, `src`); `remove` removes the entire tag and all its children.\n- **DOM Presence**: After `removeAttribute`, the element remains visible and interactive; after `remove`, it vanishes from the layout.\n- **Return Value**: Both methods return `undefined`.",
    "codeExample": "const btn = document.querySelector('button');\n\n// Removes disabled state (element stays on screen):\nbtn.removeAttribute('disabled');\n\n// Removes the button completely from the page:\n// btn.remove();",
    "interviewTips": [
      "Emphasize that attributes are key-value properties of a node, while elements are actual tree structural nodes."
    ]
  },
  {
    "topic": "Node Removal & Replacement",
    "subtopic": "Replacing with Text Nodes",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How can you replace an HTML element with plain unstyled text without creating an extra wrapper element?",
    "shortAnswer": "Pass a string directly to `element.replaceWith('plain text')` or create a Text node with `document.createTextNode()` and pass it to `replaceWith()`.",
    "detailedExplanation": "- **Unwrapping**: Useful when converting an editable `<span>` or `<input>` back into flat text.\n- **No Extra Tags**: Avoids leaving useless `<div>` or `<span>` wrappers in the DOM.\n- **XSS Safe**: String arguments passed to `replaceWith()` are inserted as plain text, not parsed as HTML markup.",
    "codeExample": "const badge = document.querySelector('.badge');\n// Replaces <span class=\"badge\">Pending</span> with plain text \"Approved\":\nbadge.replaceWith('Approved');",
    "interviewTips": [
      "Highlight that string arguments to `replaceWith()` are treated as text nodes, meaning HTML tags inside strings are not executed."
    ]
  },
  {
    "topic": "Attributes & Dataset",
    "subtopic": "element.toggleAttribute()",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "What does element.toggleAttribute() do and how does its optional force parameter work?",
    "shortAnswer": "`element.toggleAttribute(name, force)` adds the attribute if absent and removes it if present; if `force` is provided, `true` adds it and `false` removes it.",
    "detailedExplanation": "- **Boolean Attributes**: Ideal for toggling `disabled`, `readonly`, `hidden`, or `checked` states.\n- **Force Parameter**: Passing `toggleAttribute('hidden', true)` guarantees the attribute is set; passing `false` guarantees removal.\n- **Return Value**: Returns `true` if attribute is now present, and `false` if it was removed.",
    "codeExample": "const modal = document.querySelector('#settings-modal');\n\n// Toggles modal visibility attribute:\nconst isNowHidden = modal.toggleAttribute('hidden');\n\n// Force enable/disable according to a state variable:\nconst shouldDisable = true;\nmodal.toggleAttribute('inert', shouldDisable);",
    "interviewTips": [
      "Mention that `toggleAttribute` mirrors the behavior of `classList.toggle`, providing a consistent API for attributes."
    ]
  },
  {
    "topic": "Attributes & Dataset",
    "subtopic": "hasAttribute vs getAttribute",
    "difficulty": "EASY",
    "questionType": "COMPARISON",
    "question": "Why is element.hasAttribute('attr') preferred over checking element.getAttribute('attr') !== null?",
    "shortAnswer": "`hasAttribute()` returns a clean boolean directly indicating attribute existence, without retrieving, parsing, or allocating the attribute's string value in memory.",
    "detailedExplanation": "- **Intent**: `hasAttribute` explicitly communicates an existence check to anyone reading the code.\n- **Empty Attributes**: An empty attribute like `<input required>` has value `''`. `hasAttribute('required')` correctly returns `true`.\n- **Micro-Optimization**: Avoids creating a JavaScript string primitive on the heap for the attribute value.",
    "codeExample": "const input = document.querySelector('input');\n\n// Best practice:\nif (input.hasAttribute('required')) {\n  console.log('Field is mandatory');\n}\n\n// Less idiomatic:\n// if (input.getAttribute('required') !== null) { ... }",
    "interviewTips": [
      "Point out that boolean HTML attributes often have no value (empty string), so checking existence with `hasAttribute()` is cleanest."
    ]
  },
  {
    "topic": "Attributes & Dataset",
    "subtopic": "Dataset Casing Transformation Rules",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What are the exact casing conversion rules between HTML data-* attributes and JavaScript dataset properties?",
    "shortAnswer": "HTML kebab-case data attributes (like `data-user-first-name`) convert to camelCase JavaScript properties (`dataset.userFirstName`), and vice versa.",
    "detailedExplanation": "- **HTML to JS**: Strip `data-` prefix, then capitalize any lowercase character immediately following a hyphen, removing the hyphen.\n- **JS to HTML**: Any uppercase character in `dataset.myCustomKey` is converted to a lowercase character preceded by a hyphen (`data-my-custom-key`).\n- **Digits and Symbols**: `data-123` maps to `dataset['123']`. Non-alphanumeric characters remain literal.",
    "codeExample": "const div = document.createElement('div');\n\n// Assign via camelCase:\ndiv.dataset.userId = '9821';\ndiv.dataset.rolePermissions = 'admin,editor';\n\n// Generates HTML attributes:\nconsole.log(div.outerHTML);\n// <div data-user-id=\"9821\" data-role-permissions=\"admin,editor\"></div>",
    "interviewTips": [
      "Remember: `data-` disappears, hyphens disappear, and letters following hyphens become uppercase camelCase."
    ]
  },
  {
    "topic": "Attributes & Dataset",
    "subtopic": "Dataset Performance Considerations",
    "difficulty": "INTERMEDIATE",
    "questionType": "PERFORMANCE",
    "question": "Why can accessing element.dataset repeatedly in high-frequency loops hurt performance?",
    "shortAnswer": "Accessing `element.dataset` instantiates a DOMStringMap proxy object and converts string attribute names to camelCase on each lookup, creating garbage and CPU overhead.",
    "detailedExplanation": "- **Proxy Overhead**: `dataset` is not a plain JavaScript object; it is a live DOMStringMap reflection.\n- **Kebab-to-Camel Conversion**: Each property read parses through the element's attribute list and applies regex transformations.\n- **Optimization**: For hot loops (e.g. 60fps animations or table renders), cache values in standard JavaScript variables or use `getAttribute('data-...')` directly.",
    "codeExample": "// Inefficient in a 10,000 row loop:\n// for (const row of rows) { const id = row.dataset.rowId; }\n\n// Faster in hot loops:\nfor (const row of rows) {\n  const id = row.getAttribute('data-row-id');\n}",
    "interviewTips": [
      "Use `dataset` for clean business logic, but mention `getAttribute` when optimizing performance-critical loops."
    ]
  },
  {
    "topic": "Attributes & Dataset",
    "subtopic": "classList.toggle Force Parameter",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "How do you conditionally add or remove a class using classList.toggle with a boolean expression?",
    "shortAnswer": "Pass a second boolean argument to `element.classList.toggle('class-name', booleanCondition)`. If condition is `true`, the class is added; if `false`, it is removed.",
    "detailedExplanation": "- **Replaces if/else**: Eliminates verbose `if (cond) el.classList.add(...) else el.classList.remove(...)` blocks.\n- **Predictable State**: Enforces an exact state rather than inverting the current DOM state blindly.\n- **Return Value**: Returns `true` if the class is present after the operation, `false` otherwise.",
    "codeExample": "const toggleTheme = (isDark) => {\n  document.body.classList.toggle('dark-theme', isDark);\n};\n\ntoggleTheme(true);  // Adds 'dark-theme'\ntoggleTheme(false); // Removes 'dark-theme'",
    "interviewTips": [
      "Always mention the second argument (`force`) when asked about `classList.toggle` to show senior-level API knowledge."
    ]
  },
  {
    "topic": "Attributes & Dataset",
    "subtopic": "classList.contains()",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "How do you check if an element has a specific CSS class applied without regular expressions?",
    "shortAnswer": "Call `element.classList.contains('className')`, which returns `true` if the class is present on the element and `false` otherwise.",
    "detailedExplanation": "- **Exact Matching**: Checks whole token matches, avoiding partial substring bugs that happen with `className.includes()`.\n- **Fast**: Native C++ token lookup over the DOMTokenList.\n- **Single Class**: Takes a single class string token without whitespace.",
    "codeExample": "const card = document.querySelector('.card');\n\nif (card.classList.contains('is-active')) {\n  console.log('Card is currently active');\n}",
    "interviewTips": [
      "Warn against using `element.className.includes('active')` because it matches false positives like `interactive` or `inactive`."
    ]
  },
  {
    "topic": "Attributes & Dataset",
    "subtopic": "Adding Multiple Classes with classList.add",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "Can classList.add() and classList.remove() accept multiple class names simultaneously?",
    "shortAnswer": "Yes, both `classList.add()` and `classList.remove()` accept multiple comma-separated class name strings as arguments.",
    "detailedExplanation": "- **Variadic Arguments**: Signature is `classList.add(...tokens)` and `classList.remove(...tokens)`.\n- **Spread Operator**: You can spread an array of class strings directly: `classList.add(...classesArray)`.\n- **Validation**: Throws a `SyntaxError` if any argument is an empty string or contains whitespace.",
    "codeExample": "const alertBox = document.querySelector('#alert');\n\n// Adding multiple classes in one statement:\nalertBox.classList.add('alert', 'alert-danger', 'fade-in');\n\n// Removing multiple classes in one statement:\nalertBox.classList.remove('loading', 'disabled');",
    "interviewTips": [
      "Mention that passing an empty string or whitespace token to `classList.add('')` throws an invalid character error."
    ]
  },
  {
    "topic": "Attributes & Dataset",
    "subtopic": "className Property vs classList API",
    "difficulty": "INTERMEDIATE",
    "questionType": "COMPARISON",
    "question": "What are the advantages of using classList over the older className property?",
    "shortAnswer": "`classList` provides granular helper methods (`add`, `remove`, `toggle`, `contains`) that safely modify individual classes without overwriting other classes or needing manual string parsing.",
    "detailedExplanation": "- **Safe Mutations**: `className = 'new'` overwrites all existing classes; `classList.add('new')` only adds the specified token.\n- **No String Manipulation**: Eliminates tricky regex or string splitting logic to find and replace individual classes.\n- **DOMTokenList**: `classList` returns a live, iterable `DOMTokenList` with built-in set-like semantics.",
    "codeExample": "const button = document.querySelector('button');\n\n// Dangerous with className (wipes out existing utility classes):\n// button.className = 'btn-primary';\n\n// Safe with classList:\nbutton.classList.add('btn-primary');",
    "interviewTips": [
      "Mention that `className` is still useful when you intentionally want to reset or replace all classes in a single assignment."
    ]
  },
  {
    "topic": "Styles, Classes & CSS OM",
    "subtopic": "window.getComputedStyle()",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What is window.getComputedStyle() and why must you use it instead of element.style to read styling?",
    "shortAnswer": "`window.getComputedStyle(element)` returns an object containing the resolved values of all CSS properties applied to an element by external stylesheets, cascades, and inheritance, whereas `element.style` only reads inline styles.",
    "detailedExplanation": "- **Read-Only**: Returns a live, read-only `CSSStyleDeclaration`.\n- **Resolved Values**: Colors are converted to `rgb(...)` / `rgba(...)` and lengths are converted to absolute pixels (`px`).\n- **Inline Style Limitation**: `element.style.color` returns empty string `\"\"` if color was declared in a `.css` file.",
    "codeExample": "const heading = document.querySelector('h1');\n\n// Reads resolved pixel fontSize even if defined in CSS as 2rem:\nconst computed = window.getComputedStyle(heading);\nconsole.log(computed.fontSize); // e.g. \"32px\"\nconsole.log(computed.color);    // e.g. \"rgb(33, 37, 41)\"",
    "interviewTips": [
      "Emphasize that `element.style` ONLY sees styles written directly in the element's `style=\"...\"` attribute."
    ]
  },
  {
    "topic": "Styles, Classes & CSS OM",
    "subtopic": "Reading Pseudo-Element Styles",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How can you read the computed styles of pseudo-elements like ::before or ::after in JavaScript?",
    "shortAnswer": "Pass the pseudo-element selector string as the second argument to `window.getComputedStyle(element, '::before')`.",
    "detailedExplanation": "- **Second Parameter**: Accepts strings like `'::before'`, `'::after'`, `'::placeholder'`, or `':hover'`.\n- **Content Extraction**: Useful for reading generated `content`, dimensions, or background colors of CSS icon decorations.\n- **Read-Only**: You can read pseudo-element styles but you cannot write directly to pseudo-elements with `element.style`.",
    "codeExample": "const button = document.querySelector('.icon-button');\nconst beforeStyle = window.getComputedStyle(button, '::before');\n\nconsole.log('Icon content:', beforeStyle.content); // '\"\\f00c\"'\nconsole.log('Icon color:', beforeStyle.color);",
    "interviewTips": [
      "This is a favorite senior trick question: you cannot select pseudo-elements with `querySelector`, but you CAN inspect their styles via `getComputedStyle(el, '::after')`."
    ]
  },
  {
    "topic": "Styles, Classes & CSS OM",
    "subtopic": "Manipulating CSS Custom Properties (CSS Variables)",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you read and update CSS Custom Properties (CSS variables) dynamically via JavaScript?",
    "shortAnswer": "Update CSS variables with `element.style.setProperty('--var-name', value)` and read them using `getComputedStyle(element).getPropertyValue('--var-name')`.",
    "detailedExplanation": "- **Dynamic Theming**: Enables instant runtime theme switching (light/dark mode, accent colors) without regenerating stylesheets.\n- **Inheritance**: Changing a variable on `document.documentElement` propagates through the entire DOM cascade.\n- **Trim Required**: `getPropertyValue` may return leading whitespace, so calling `.trim()` is recommended.",
    "codeExample": "// Writing a CSS variable:\ndocument.documentElement.style.setProperty('--primary-color', '#3b82f6');\n\n// Reading a CSS variable:\nconst rootStyles = window.getComputedStyle(document.documentElement);\nconst primaryColor = rootStyles.getPropertyValue('--primary-color').trim();\nconsole.log(primaryColor); // '#3b82f6'",
    "interviewTips": [
      "Mention CSS variables as the most performant way to implement dynamic themes because you mutate a single value rather than updating thousands of DOM nodes."
    ]
  },
  {
    "topic": "Styles, Classes & CSS OM",
    "subtopic": "element.style.cssText",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "What is element.style.cssText and when is it useful?",
    "shortAnswer": "`element.style.cssText` gets or sets the complete inline style declaration of an element as a single formatted string, replacing all current inline styles at once.",
    "detailedExplanation": "- **Batch Updates**: Sets multiple style properties in a single string assignment instead of setting multiple individual `element.style.property` values.\n- **Overwriting**: Assigning to `cssText` completely replaces existing inline styles; append with `+=` if you wish to keep previous ones.\n- **Format**: Takes standard CSS syntax with hyphens: `'color: red; background-color: black; font-size: 16px;'`.",
    "codeExample": "const card = document.querySelector('.card');\n\n// Applies multiple inline styles in one statement:\ncard.style.cssText = 'color: #fff; background-color: #1e293b; padding: 1.5rem; border-radius: 8px;';",
    "interviewTips": [
      "Remember that `cssText` overwrites prior inline styles unless you append with `+=`."
    ]
  },
  {
    "topic": "Styles, Classes & CSS OM",
    "subtopic": "setProperty with !important",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you set a style property with !important priority using JavaScript?",
    "shortAnswer": "Use `element.style.setProperty('property', 'value', 'important')`. Direct property assignment like `element.style.color = 'red !important'` is invalid and ignored by browsers.",
    "detailedExplanation": "- **Syntax**: Direct assignment fails because `!important` is a CSS declaration delimiter, not part of the property value.\n- **Third Parameter**: `setProperty` takes an optional third argument for priority: `'important'` or `''`.\n- **Resetting Priority**: Passing an empty string `''` sets normal priority.",
    "codeExample": "const alert = document.querySelector('#critical-alert');\n\n// FAILS (syntax ignored by browser engine):\n// alert.style.color = 'red !important';\n\n// CORRECT (sets !important priority):\nalert.style.setProperty('color', 'red', 'important');",
    "interviewTips": [
      "This is a classic interview gotcha: direct `style.prop = '... !important'` silently fails in modern browsers."
    ]
  },
  {
    "topic": "Styles, Classes & CSS OM",
    "subtopic": "element.style.removeProperty()",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "How do you remove a specific inline style property from an element?",
    "shortAnswer": "Call `element.style.removeProperty('property-name')` using the kebab-case CSS property name.",
    "detailedExplanation": "- **Kebab-Case**: Takes the standard CSS property name (e.g. `'background-color'`, `'font-size'`).\n- **Return Value**: Returns the value of the property that was removed.\n- **Cascade Fallback**: Once removed, the element falls back to whatever styles were declared in external stylesheets.",
    "codeExample": "const box = document.querySelector('.box');\nbox.style.backgroundColor = 'yellow';\n\n// Removes inline background-color:\nconst oldVal = box.style.removeProperty('background-color');\nconsole.log(oldVal); // 'yellow'",
    "interviewTips": [
      "Mention that setting `el.style.backgroundColor = ''` also removes the inline declaration, but `removeProperty` is the formal CSSOM method."
    ]
  },
  {
    "topic": "Styles, Classes & CSS OM",
    "subtopic": "document.styleSheets API",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "What is document.styleSheets and how can JavaScript access or insert CSS rules at runtime?",
    "shortAnswer": "`document.styleSheets` is a StyleSheetList representing all `<link rel=\"stylesheet\">` and `<style>` elements on the page, allowing programmatic rule insertion via `sheet.insertRule()`.",
    "detailedExplanation": "- **Runtime CSS**: Allows inserting rules into the browser CSSOM directly without adding HTML `<style>` tags to the DOM.\n- **insertRule**: `sheet.insertRule('.my-class { color: red; }', index)` inserts a rule at the given index.\n- **CORS Restriction**: Accessing `cssRules` on external cross-origin stylesheets throws a `SecurityError` unless served with proper CORS headers.",
    "codeExample": "const styleSheet = document.styleSheets[0];\n// Inserts rule dynamically at the top of the stylesheet:\nstyleSheet.insertRule('body.dark-mode { background: #121212; color: #fff; }', 0);\n\n// Deleting a rule:\n// styleSheet.deleteRule(0);",
    "interviewTips": [
      "Explain the CORS limitation when accessing `document.styleSheets`—browsers block reading rules from third-party CDN stylesheets for privacy."
    ]
  },
  {
    "topic": "Styles, Classes & CSS OM",
    "subtopic": "CSS Typed Object Model (CSS Typed OM)",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "What is the CSS Typed Object Model (CSS Typed OM) and how does element.attributeStyleMap improve on element.style?",
    "shortAnswer": "CSS Typed OM exposes CSS values as typed JavaScript objects (`CSSUnitValue`) instead of raw strings, eliminating string concatenation, parsing overhead, and precision loss.",
    "detailedExplanation": "- **Typed Objects**: Represents lengths as `CSS.px(10)`, `CSS.em(2)`, or `CSS.percent(50)`.\n- **Performance**: Skips parsing strings into numbers and converting back to strings, yielding significant performance gains in animations.\n- **Math Operations**: Supports arithmetic on CSS units: `CSS.px(10).add(CSS.px(20))`.\n- **API Access**: Used via `element.attributeStyleMap.set('opacity', 0.5)` and `element.computedStyleMap()`.",
    "codeExample": "const box = document.querySelector('.box');\n\n// Standard CSSOM (string parsing):\n// box.style.opacity = '0.5';\n\n// CSS Typed OM (type-safe & performant):\nif (box.attributeStyleMap) {\n  box.attributeStyleMap.set('opacity', 0.5);\n  box.attributeStyleMap.set('margin-top', CSS.px(24));\n}",
    "interviewTips": [
      "Mention CSS Typed OM as the modern performant alternative to string-based style manipulation for high-fps animations."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "addEventListener Options Object",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What configuration options can be passed in the third argument of addEventListener?",
    "shortAnswer": "The third argument can be an options object with: `capture` (boolean), `once` (boolean), `passive` (boolean), and `signal` (AbortSignal).",
    "detailedExplanation": "- **capture**: If `true`, listener fires during the capturing phase rather than the bubbling phase.\n- **once**: If `true`, listener is automatically removed after invoking once.\n- **passive**: If `true`, promises that the listener will never call `preventDefault()`, enabling smooth scroll performance.\n- **signal**: Accepts an `AbortSignal`, allowing programmatic unbinding via `abortController.abort()`.",
    "codeExample": "const btn = document.querySelector('#btn');\n\nbtn.addEventListener('click', (e) => {\n  console.log('Clicked only once!');\n}, {\n  once: true,\n  passive: true\n});",
    "interviewTips": [
      "List all four options: capture, once, passive, signal. This demonstrates complete modern DOM knowledge."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "Passive Event Listeners",
    "difficulty": "INTERMEDIATE",
    "questionType": "PERFORMANCE",
    "question": "Why are passive event listeners crucial for smooth scroll and touch performance?",
    "shortAnswer": "Passive listeners guarantee that `event.preventDefault()` will never be called, allowing the browser compositor thread to scroll immediately without waiting for JavaScript execution on the main thread.",
    "detailedExplanation": "- **Scroll Lag**: Normal touch and wheel listeners force the browser to wait until JavaScript finishes running before scrolling, creating perceptible stutter.\n- **Compositor Freedom**: Marking `{ passive: true }` lets the compositor scroll independently without blocking on the main JavaScript thread.\n- **PreventDefault Error**: Calling `event.preventDefault()` inside a passive listener generates a console warning and is ignored.",
    "codeExample": "window.addEventListener('wheel', (event) => {\n  // Tracking analytics without delaying scroll\n  recordScrollAnalytics(event.deltaY);\n}, { passive: true });",
    "interviewTips": [
      "Explain the difference between the browser main thread and compositor thread when discussing passive scroll listeners."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "AbortController with addEventListener",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you use AbortController to cancel multiple event listeners at once?",
    "shortAnswer": "Pass `{ signal: controller.signal }` to multiple `addEventListener` calls, then invoke `controller.abort()` to unbind all of them in a single call.",
    "detailedExplanation": "- **Group Unbinding**: Avoids storing references to individual handler functions or calling `removeEventListener` repeatedly.\n- **Anonymous Functions**: Works with inline anonymous functions and arrow functions.\n- **Component Teardown**: Standard pattern for cleaning up event listeners during component unmount in UI frameworks.",
    "codeExample": "const controller = new AbortController();\nconst { signal } = controller;\n\nwindow.addEventListener('resize', onResize, { signal });\nwindow.addEventListener('scroll', onScroll, { signal });\ndocument.addEventListener('keydown', onKeyDown, { signal });\n\n// Teardown everything in one step:\ncontroller.abort();",
    "interviewTips": [
      "AbortController eliminates the old pain point of having to keep named function references just to remove listeners."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "Arrow Functions and this in Event Handlers",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "Why does this not refer to the clicked element when using an arrow function as an event listener callback?",
    "shortAnswer": "Arrow functions do not bind their own this context; they lexically inherit this from the surrounding outer scope, whereas regular function callbacks bind this to event.currentTarget.",
    "detailedExplanation": "- **Lexical Scoping**: Arrow functions capture this from the enclosing execution context at the time of definition (often window or the enclosing class instance).\n- **Regular Functions**: When registered with function(e) {}, the DOM engine automatically binds this to e.currentTarget.\n- **Accessing Target**: If using arrow functions, always access the element explicitly via event.currentTarget or event.target.",
    "codeExample": "const btn = document.querySelector(\"button\");\n\n// Regular function (this === btn):\nbtn.addEventListener(\"click\", function(e) {\n  console.log(this === btn); // true\n});\n\n// Arrow function (this === window):\nbtn.addEventListener(\"click\", (e) => {\n  console.log(this === btn); // false!\n  console.log(e.currentTarget === btn); // true\n});",
    "interviewTips": [
      "Recommend using event.currentTarget inside arrow functions rather than relying on this."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "event.isTrusted Property",
    "difficulty": "INTERMEDIATE",
    "questionType": "SECURITY",
    "question": "What is the event.isTrusted property and how does it prevent automated script fraud?",
    "shortAnswer": "`event.isTrusted` is a boolean that is `true` when the event was generated by a genuine user interaction (e.g. mouse click, physical keystroke) and `false` when generated by scripts (e.g. `dispatchEvent` or `.click()`).",
    "detailedExplanation": "- **Read-Only**: Implemented at the browser engine level and cannot be modified or spoofed by client scripts.\n- **Click Fraud Prevention**: Protects sensitive actions (purchases, payments, permissions) from bot scripts triggering `.click()`.\n- **User Gesture Requirement**: Fullscreen API and clipboard access often require `isTrusted === true` to activate.",
    "codeExample": "button.addEventListener('click', (e) => {\n  if (!e.isTrusted) {\n    console.warn('Automated bot or script detected. Action blocked.');\n    return;\n  }\n  processPayment();\n});\n\n// Simulated click has isTrusted === false:\nbutton.click();",
    "interviewTips": [
      "Mention that `isTrusted` cannot be overwritten in JavaScript, making it a foundational security check against synthetic events."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "CustomEvent and dispatchEvent",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you create and trigger a custom DOM event with custom payload data?",
    "shortAnswer": "Create a `new CustomEvent('eventName', { detail: payload, bubbles: true })` and fire it using `element.dispatchEvent(customEvent)`.",
    "detailedExplanation": "- **CustomEvent Constructor**: Takes the event name string and an options object.\n- **detail Property**: Carries arbitrary payload data accessible on `event.detail` in listeners.\n- **bubbles**: Must explicitly set `bubbles: true` if you want the custom event to propagate up through parent ancestors.\n- **Return Value**: `dispatchEvent` returns `false` if any listener called `preventDefault()`, otherwise `true`.",
    "codeExample": "const userCard = document.querySelector('.user-card');\n\n// Listening for custom event:\nuserCard.addEventListener('user-follow', (e) => {\n  console.log('Followed user ID:', e.detail.userId);\n});\n\n// Dispatching custom event with payload:\nconst followEvent = new CustomEvent('user-follow', {\n  bubbles: true,\n  detail: { userId: 402, role: 'author' }\n});\nuserCard.dispatchEvent(followEvent);",
    "interviewTips": [
      "Highlight that `bubbles: false` by default on CustomEvents, so remember to set `bubbles: true` if parent delegation is needed."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "event.target vs event.currentTarget vs event.relatedTarget",
    "difficulty": "INTERMEDIATE",
    "questionType": "COMPARISON",
    "question": "What are the distinct differences between event.target, event.currentTarget, and event.relatedTarget?",
    "shortAnswer": "`target` is the innermost element where the interaction occurred, `currentTarget` is the element holding the listener, and `relatedTarget` is the secondary element involved in mouse/focus transitions.",
    "detailedExplanation": "- **event.target**: Does not change as the event bubbles up the DOM tree; always points to the source element.\n- **event.currentTarget**: Points to the element whose `addEventListener` callback is currently executing (`=== this`).\n- **event.relatedTarget**: Used in mouseenter/mouseleave/focusout to identify the element the pointer or focus moved to or from.",
    "codeExample": "const container = document.querySelector('#container');\n\ncontainer.addEventListener('click', function(e) {\n  console.log('Clicked element (target):', e.target);\n  console.log('Listener holder (currentTarget):', e.currentTarget);\n  console.log(this === e.currentTarget); // true\n});",
    "interviewTips": [
      "In event delegation, `currentTarget` is always the parent container, while `target` is the specific child that was clicked."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "Handling Events with Object Handler (handleEvent)",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "How can you pass an object with a handleEvent method to addEventListener and what are its benefits?",
    "shortAnswer": "Pass an object implementing the `EventListener` interface with a `handleEvent(event)` method; the browser calls that method automatically while preserving object context.",
    "detailedExplanation": "- **Preserves `this`**: Inside `handleEvent()`, `this` points directly to your object instance without needing `.bind(this)` or arrow function wrappers.\n- **Single Teardown**: Enables clean addition and removal of multiple listeners without tracking individual bound function references.\n- **State Encapsulation**: Groups component state and event handling logic cleanly into a cohesive unit.",
    "codeExample": "class DropdownController {\n  constructor(element) {\n    this.el = element;\n    this.isOpen = false;\n    // Passing 'this' directly to addEventListener:\n    this.el.addEventListener('click', this);\n  }\n\n  handleEvent(event) {\n    if (event.type === 'click') {\n      this.isOpen = !this.isOpen;\n      this.el.classList.toggle('open', this.isOpen);\n    }\n  }\n\n  destroy() {\n    this.el.removeEventListener('click', this);\n  }\n}",
    "interviewTips": [
      "Mentioning the `handleEvent` interface is an immediate signal of deep DOM specification expertise."
    ]
  },
  {
    "topic": "Node Creation & Insertion",
    "subtopic": "cloneNode Deep Parameter",
    "difficulty": "EASY",
    "questionType": "CONCEPTUAL",
    "question": "Does node.cloneNode(true) copy event listeners attached via addEventListener?",
    "shortAnswer": "No, cloneNode() copies HTML attributes and inline event handlers, but never copies event listeners attached using addEventListener() or assigned DOM properties.",
    "detailedExplanation": "- **What is Cloned**: HTML tag, attributes, inline listeners like `onclick=\"...\"`, and all descendant nodes (if deep is `true`).\n- **What is NOT Cloned**: Listeners attached via `addEventListener()`, dynamic JavaScript properties added to the DOM object, and form state like canvas drawings.\n- **Re-binding**: Any required event listeners must be manually re-attached to the cloned element.",
    "codeExample": "const btn = document.querySelector('#btn');\nbtn.addEventListener('click', () => console.log('Clicked!'));\n\n// Cloned button will NOT fire the click listener:\nconst clone = btn.cloneNode(true);\ndocument.body.appendChild(clone);",
    "interviewTips": [
      "This is a classic interview gotcha: `cloneNode(true)` never clones listeners registered with `addEventListener`."
    ]
  },
  {
    "topic": "DOM Traversal & Navigation",
    "subtopic": "node.contains() Method",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "How do you test if one DOM element is an ancestor of or contains another element?",
    "shortAnswer": "Call `parentElement.contains(childElement)`, which returns `true` if the node is a descendant or the node itself, and `false` otherwise.",
    "detailedExplanation": "- **Self-Inclusion**: `node.contains(node)` evaluates to `true` (a node contains itself).\n- **Descendant Check**: Works for direct children, grandchildren, and arbitrarily deep descendants.\n- **Common Use Case**: Detecting outside clicks when building modal dialogs or dropdowns.",
    "codeExample": "const dropdown = document.querySelector('.dropdown');\n\ndocument.addEventListener('click', (e) => {\n  const isInside = dropdown.contains(e.target);\n  if (!isInside) {\n    dropdown.classList.remove('open');\n  }\n});",
    "interviewTips": [
      "Highlight `node.contains()` as the foundation of 'click outside to dismiss' dropdown and modal implementations."
    ]
  },
  {
    "topic": "Styles, Classes & CSS OM",
    "subtopic": "element.matches()",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "How do you check if an element matches a specific CSS selector using JavaScript?",
    "shortAnswer": "Call `element.matches('css-selector')`, which returns `true` if the element matches the selector and `false` otherwise.",
    "detailedExplanation": "- **Selector Testing**: Accepts any valid CSS selector string (e.g. `.active`, `li:first-child`, `[disabled]`).\n- **No Traversal**: Tests only the current element, without looking up or down the DOM tree.\n- **Core for Delegation**: Crucial inside event delegation listeners to test `event.target.matches('.item-btn')`.",
    "codeExample": "const button = document.querySelector('button');\n\nif (button.matches('.btn-primary:not([disabled])')) {\n  console.log('Button is an active primary action');\n}",
    "interviewTips": [
      "Combine `matches()` with event delegation: test if `e.target.matches('.delete-btn')` to handle dynamic child actions."
    ]
  },
  {
    "topic": "DOM Traversal & Navigation",
    "subtopic": "element.closest()",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "What is element.closest() and how does it traverse the DOM tree?",
    "shortAnswer": "`element.closest(selector)` traverses up through the element and its ancestors toward the document root, returning the first matching element, or `null` if none match.",
    "detailedExplanation": "- **Starts at Current Element**: Checks the element itself first; if it matches, it returns the element immediately.\n- **Upward Search**: Ascends through parent nodes until reaching `<html>` or `document`.\n- **Nested Targets**: Solves the event delegation problem where users click an `<i>` or `<span>` inside a `<button>`.",
    "codeExample": "document.addEventListener('click', (e) => {\n  // Finds the parent row even if user clicked an icon inside a cell:\n  const tableRow = e.target.closest('tr[data-id]');\n  if (tableRow) {\n    console.log('Clicked row ID:', tableRow.dataset.id);\n  }\n});",
    "interviewTips": [
      "`element.closest()` is the modern standard solution for finding the meaningful component root from a clicked child node."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "Keyboard Enter Key Detection",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "What is the modern, recommended way to detect when a user presses the Enter key in an input field?",
    "shortAnswer": "Check `event.key === 'Enter'` in a `keydown` event listener. The older `event.keyCode === 13` is deprecated.",
    "detailedExplanation": "- **Modern Standard**: `event.key` returns a human-readable string (`'Enter'`, `'Escape'`, `'Tab'`, `'ArrowDown'`).\n- **Deprecated Properties**: Avoid `event.keyCode` and `event.which`, which are marked deprecated in the W3C specification.\n- **Case Sensitivity**: Key names are case-sensitive (`'Enter'`, `'Backspace'`).",
    "codeExample": "const searchInput = document.querySelector('#search');\n\nsearchInput.addEventListener('keydown', (e) => {\n  if (e.key === 'Enter') {\n    e.preventDefault();\n    performSearch(searchInput.value);\n  }\n});",
    "interviewTips": [
      "Always emphasize using `event.key === 'Enter'` rather than the legacy `keyCode === 13`."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "Programmatic Click Trigger",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "How do you trigger a click event on an element programmatically using JavaScript?",
    "shortAnswer": "Call `element.click()` on the DOM element instance to trigger its default click behavior and registered click handlers.",
    "detailedExplanation": "- **Default Actions**: Triggers both registered click listeners and native actions (such as opening a file picker on `<input type=\"file\">`).\n- **Synthetic vs Real**: Synthetic clicks have `event.isTrusted === false`.\n- **Common Pattern**: Hiding an ugly file input and triggering it when a styled custom button is clicked.",
    "codeExample": "const fileInput = document.querySelector('#avatar-upload');\nconst customBtn = document.querySelector('#custom-upload-btn');\n\ncustomBtn.addEventListener('click', () => {\n  fileInput.click(); // Triggers native OS file picker\n});",
    "interviewTips": [
      "Explain how triggering `.click()` on hidden file inputs is standard practice for custom file uploader UI designs."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "event.defaultPrevented",
    "difficulty": "EASY",
    "questionType": "CONCEPTUAL",
    "question": "What does the event.defaultPrevented property indicate?",
    "shortAnswer": "`event.defaultPrevented` is a boolean that returns `true` if `event.preventDefault()` was invoked during the event's dispatch, and `false` otherwise.",
    "detailedExplanation": "- **State Flag**: Allows subsequent event handlers in the bubbling chain to check if an earlier handler cancelled the default browser action.\n- **Read-Only**: Cannot be directly modified by script.\n- **Framework Use**: Widely used by routers and UI libraries to respect or override custom navigation behavior.",
    "codeExample": "document.body.addEventListener('click', (e) => {\n  if (e.defaultPrevented) {\n    console.log('Default browser action was cancelled by a child element');\n    return;\n  }\n  console.log('Proceeding with normal action');\n});",
    "interviewTips": [
      "Mention that `event.defaultPrevented` lets parent containers know whether child components already handled and cancelled an action."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "click vs dblclick Events",
    "difficulty": "EASY",
    "questionType": "CONCEPTUAL",
    "question": "What is the difference between click and dblclick events in the DOM?",
    "shortAnswer": "`click` fires after a single mouse press and release, while `dblclick` fires after two rapid clicks on the same element within a system-defined threshold.",
    "detailedExplanation": "- **Firing Sequence**: When a user double-clicks, the browser fires: `mousedown` -> `mouseup` -> `click` -> `mousedown` -> `mouseup` -> `click` -> `dblclick`.\n- **Coexistence Gotcha**: If you attach both `click` and `dblclick` to the same element, the single click handlers will fire twice before `dblclick` fires.\n- **Debounce Solution**: Distinguishing single vs double clicks requires setting a timer in the single click handler.",
    "codeExample": "const item = document.querySelector('.folder-item');\n\nitem.addEventListener('dblclick', () => {\n  console.log('Double clicked: Opening folder...');\n});",
    "interviewTips": [
      "Point out that `click` fires twice whenever `dblclick` occurs, which can lead to accidental double executions without debounce timers."
    ]
  },
  {
    "topic": "DOM Traversal & Navigation",
    "subtopic": "window.scrollTo with Smooth Behavior",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "How do you scroll the window to the top smoothly using modern DOM APIs?",
    "shortAnswer": "Call `window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })`.",
    "detailedExplanation": "- **ScrollOptions Object**: Accepts `top`, `left`, and `behavior` (`'smooth'` or `'instant'`).\n- **CSS Equivalent**: Mirrors the CSS rule `html { scroll-behavior: smooth; }`.\n- **Element Scrolling**: Also supported on individual scrollable container elements via `element.scrollTo()`.",
    "codeExample": "const backToTopBtn = document.querySelector('#back-to-top');\n\nbackToTopBtn.addEventListener('click', () => {\n  window.scrollTo({\n    top: 0,\n    behavior: 'smooth'\n  });\n});",
    "interviewTips": [
      "Mention `behavior: 'smooth'` as the standard native alternative to legacy jQuery `$('html, body').animate({ scrollTop: 0 })`."
    ]
  },
  {
    "topic": "Styles, Classes & CSS OM",
    "subtopic": "element.scrollIntoView()",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "How do you scroll a specific element into the visible viewport with scrollIntoView?",
    "shortAnswer": "Call `element.scrollIntoView({ behavior: 'smooth', block: 'start' })` to scroll the element smoothly into view.",
    "detailedExplanation": "- **Options**: `behavior` (`'smooth'` | `'instant'`), `block` (`'start'` | `'center'` | `'end'` | `'nearest'`), and `inline`.\n- **Targeting**: Automatically scrolls all scrollable parent containers needed to reveal the element.\n- **Focus Sync**: Often paired with `element.focus()` for keyboard accessibility.",
    "codeExample": "const errorBanner = document.querySelector('.form-error-banner');\nif (errorBanner) {\n  errorBanner.scrollIntoView({\n    behavior: 'smooth',\n    block: 'center'\n  });\n}",
    "interviewTips": [
      "Highlight `scrollIntoView({ block: 'center' })` as an excellent pattern for drawing user attention to form validation errors."
    ]
  },
  {
    "topic": "Node Creation & Insertion",
    "subtopic": "isEqualNode vs isSameNode vs ===",
    "difficulty": "INTERMEDIATE",
    "questionType": "COMPARISON",
    "question": "What is the difference between isEqualNode(), isSameNode(), and the === operator in DOM programming?",
    "shortAnswer": "`isEqualNode()` tests if two nodes have identical tag, attributes, and child structure, whereas `isSameNode()` and `===` test if both references point to the exact same object in memory.",
    "detailedExplanation": "- **isEqualNode()**: Structural deep equality test (like two cloned nodes with the same content).\n- **isSameNode()**: Identity test, identical in behavior to the JavaScript `===` identity operator.\n- **Usage**: Use `isEqualNode()` when checking if template output or API rendered elements match.",
    "codeExample": "const div1 = document.createElement('div');\ndiv1.className = 'card';\nconst div2 = div1.cloneNode(true);\n\nconsole.log(div1 === div2);          // false (distinct heap objects)\nconsole.log(div1.isSameNode(div2));  // false\nconsole.log(div1.isEqualNode(div2)); // true (structurally identical)",
    "interviewTips": [
      "Memorize: `isEqualNode` checks structural content equality; `===` checks memory reference identity."
    ]
  },
  {
    "topic": "DOM Traversal & Navigation",
    "subtopic": "compareDocumentPosition Bitmask",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What is node.compareDocumentPosition() and how do you interpret its bitmask return value?",
    "shortAnswer": "`node.compareDocumentPosition(otherNode)` returns a bitmask integer describing the relative position and hierarchy of two nodes in the document tree.",
    "detailedExplanation": "- **Bitmask Flags**: Returns combinations of 1 (disconnected), 2 (preceding), 4 (following), 8 (contains), 16 (contained by).\n- **Bitwise AND**: Check results using bitwise AND: `if (nodeA.compareDocumentPosition(nodeB) & Node.DOCUMENT_POSITION_FOLLOWING)`.\n- **DOM Order**: Used by libraries to sort collections of elements into document source order.",
    "codeExample": "const head = document.head;\nconst body = document.body;\n\nconst position = head.compareDocumentPosition(body);\nif (position & Node.DOCUMENT_POSITION_FOLLOWING) {\n  console.log('Body appears after Head in document order');\n}",
    "interviewTips": [
      "Mention that `compareDocumentPosition` returns a bitmask, so testing flags requires the bitwise `&` operator."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "focus/blur vs focusin/focusout Bubbling",
    "difficulty": "INTERMEDIATE",
    "questionType": "COMPARISON",
    "question": "Why do focusin and focusout bubble while focus and blur do not?",
    "shortAnswer": "The DOM Level 3 specification introduced `focusin` and `focusout` specifically to bubble up the DOM tree, enabling event delegation on parent form containers.",
    "detailedExplanation": "- **focus and blur**: Do not bubble up to parent containers (`bubbles: false`).\n- **focusin and focusout**: Bubble up to parents (`bubbles: true`), allowing a `<form>` listener to track focus across all child inputs.\n- **Capture Alternative**: You can still catch `focus` on parent containers by setting `capture: true` in `addEventListener`.",
    "codeExample": "const form = document.querySelector('form');\n\n// Works with delegation because focusin bubbles:\nform.addEventListener('focusin', (e) => {\n  e.target.classList.add('focused-field');\n});\nform.addEventListener('focusout', (e) => {\n  e.target.classList.remove('focused-field');\n});",
    "interviewTips": [
      "Remember: `focusin` and `focusout` bubble; `focus` and `blur` do not."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "mouseenter/mouseleave vs mouseover/mouseout",
    "difficulty": "INTERMEDIATE",
    "questionType": "COMPARISON",
    "question": "What is the difference between mouseenter/mouseleave and mouseover/mouseout?",
    "shortAnswer": "`mouseover` and `mouseout` bubble and fire whenever the pointer enters or leaves any child element inside the container, whereas `mouseenter` and `mouseleave` do not bubble and only fire when crossing the outer container boundary.",
    "detailedExplanation": "- **Bubbling**: `mouseover/mouseout` bubble (`bubbles: true`); `mouseenter/mouseleave` do not (`bubbles: false`).\n- **Child Elements**: Hovering over child elements inside a container triggers multiple unexpected `mouseout` and `mouseover` events.\n- **Clean UI Hover**: Use `mouseenter` and `mouseleave` for tooltips and drop-down menus to avoid flicker when hovering over inner children.",
    "codeExample": "const menu = document.querySelector('.dropdown-menu');\n\n// Smooth hover without flickering when cursor moves across menu links:\nmenu.addEventListener('mouseenter', () => menu.classList.add('visible'));\nmenu.addEventListener('mouseleave', () => menu.classList.remove('visible'));",
    "interviewTips": [
      "Explain hover flicker: `mouseover/mouseout` cause UI flickering on containers with children because they fire on every child boundary."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "event.eventPhase Values",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What does the event.eventPhase property represent and what are its four numerical constants?",
    "shortAnswer": "`event.eventPhase` indicates the current phase of event flow: 0 (NONE), 1 (CAPTURING_PHASE), 2 (AT_TARGET), and 3 (BUBBLING_PHASE).",
    "detailedExplanation": "- **Event.NONE (0)**: Event is not currently being dispatched.\n- **Event.CAPTURING_PHASE (1)**: Event is travelling down from window through ancestor tree to target.\n- **Event.AT_TARGET (2)**: Event has reached the actual target element where the user action occurred.\n- **Event.BUBBLING_PHASE (3)**: Event is bubbling back up through ancestor elements to window.",
    "codeExample": "button.addEventListener('click', (e) => {\n  console.log('Current Phase:', e.eventPhase); // 2 (Event.AT_TARGET)\n});",
    "interviewTips": [
      "Name the 3 active phases in order: 1 Capturing -> 2 At Target -> 3 Bubbling."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "Listener Execution Order At Target",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "In what order do capturing and bubbling event listeners execute when registered on the target element itself?",
    "shortAnswer": "On the target element itself (Phase 2: AT_TARGET), listeners execute in the exact order they were registered via addEventListener, regardless of the capture flag.",
    "detailedExplanation": "- **Modern Standard**: In DOM Level 4, at the target element, registration order takes precedence.\n- **Historic Quirk**: Older browsers ran capture listeners first at target; modern specs run them in registration order.\n- **Ancestors**: On ancestor elements, capturing listeners ALWAYS run before bubbling listeners.",
    "codeExample": "const btn = document.querySelector('button');\n\nbtn.addEventListener('click', () => console.log('1: Bubble'), false);\nbtn.addEventListener('click', () => console.log('2: Capture'), true);\n\n// Clicking the button logs:\n// 1: Bubble\n// 2: Capture (runs in order of registration at target!)",
    "interviewTips": [
      "Clarify that the capture flag strictly dictates order on ANCESTOR nodes, but on the target node itself, registration order rules."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "event.composedPath()",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you inspect the complete hierarchy of nodes an event will traverse using event.composedPath()?",
    "shortAnswer": "`event.composedPath()` returns an array of all DOM nodes (from the target element up through parents to `window`) that the event will pass through.",
    "detailedExplanation": "- **Complete Chain**: Returns `[targetElement, parent1, parent2, ..., body, html, document, window]`.\n- **Shadow DOM Resilient**: If shadow roots are open, `composedPath()` penetrates shadow boundaries to reveal original shadow nodes.\n- **Click Outside Helper**: Checking if `event.composedPath().includes(myModal)` is an elegant way to detect inside/outside clicks.",
    "codeExample": "document.addEventListener('click', (e) => {\n  const path = e.composedPath();\n  console.log('Event path nodes:', path.map(el => el.nodeName));\n\n  const clickedInsideModal = path.includes(document.querySelector('#modal'));\n  if (!clickedInsideModal) closeModal();\n});",
    "interviewTips": [
      "Mention `event.composedPath()` as a clean, array-based alternative to manually looping through `node.parentNode`."
    ]
  },
  {
    "topic": "Styles, Classes & CSS OM",
    "subtopic": "Constructable Stylesheets",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What are Constructable Stylesheets (new CSSStyleSheet()) and document.adoptedStyleSheets?",
    "shortAnswer": "Constructable Stylesheets allow creating and sharing reusable CSS stylesheets across multiple DOM trees and Shadow roots by pushing them into `document.adoptedStyleSheets`.",
    "detailedExplanation": "- **Memory Efficient**: A single compiled stylesheet instance can be shared across thousands of Web Components without duplicate DOM `<style>` tags.\n- **Synchronous or Async**: Created via `new CSSStyleSheet()` and loaded with `sheet.replaceSync(cssText)` or `sheet.replace(cssText)`.\n- **Dynamic Mutation**: Updating a shared stylesheet instantly updates every component adopting it.",
    "codeExample": "const sharedSheet = new CSSStyleSheet();\nsharedSheet.replaceSync('button { background: #3b82f6; color: white; padding: 8px 16px; }');\n\n// Adopting sheet in main document:\ndocument.adoptedStyleSheets = [...document.adoptedStyleSheets, sharedSheet];",
    "interviewTips": [
      "Highlight `adoptedStyleSheets` as a game-changer for Web Components and design system performance."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "event.cancelable Property",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What does event.cancelable signify and what happens if you call preventDefault() on a non-cancelable event?",
    "shortAnswer": "`event.cancelable` indicates whether `event.preventDefault()` can cancel the default browser action; calling `preventDefault()` on an event where `cancelable === false` does nothing.",
    "detailedExplanation": "- **Boolean Flag**: Events like `wheel`, `keydown`, and form `submit` have `cancelable: true`.\n- **Non-Cancelable Events**: Events like `scroll`, `load`, and `unload` have `cancelable: false` because the browser has already committed to the action.\n- **Passive Listeners**: In passive listeners, events report `defaultPrevented === false` and `preventDefault()` calls are ignored.",
    "codeExample": "window.addEventListener('scroll', (e) => {\n  console.log('Is scroll cancelable?', e.cancelable); // false\n  e.preventDefault(); // Silently ignored, page still scrolls!\n});",
    "interviewTips": [
      "Emphasize that `scroll` cannot be cancelled via `e.preventDefault()` because `cancelable === false`."
    ]
  },
  {
    "topic": "Styles, Classes & CSS OM",
    "subtopic": "getBoundingClientRect vs getClientRects",
    "difficulty": "INTERMEDIATE",
    "questionType": "COMPARISON",
    "question": "What is the difference between element.getBoundingClientRect() and element.getClientRects()?",
    "shortAnswer": "`getBoundingClientRect()` returns a single bounding rectangle enclosing the entire element, whereas `getClientRects()` returns a list of rectangles for each line box of an inline element.",
    "detailedExplanation": "- **Multiline Inlines**: When an inline `<a>` or `<span>` wraps across three lines, `getClientRects()` returns 3 separate DOMRect objects, while `getBoundingClientRect()` returns one large bounding box covering all lines.\n- **Block Elements**: For standard block elements, both methods describe the same boundary.\n- **Selection Highlighting**: `getClientRects()` is used to draw exact highlight boxes over multiline text selections.",
    "codeExample": "const inlineLink = document.querySelector('p a');\nconst lineBoxes = inlineLink.getClientRects();\nconsole.log(`Link spans across ${lineBoxes.length} visual lines.`);",
    "interviewTips": [
      "Use the inline multiline text wrapping example to explain why `getClientRects()` exists."
    ]
  },
  {
    "topic": "DOM Traversal & Navigation",
    "subtopic": "Reparenting Elements with appendChild",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What happens when you pass an element that already exists in the DOM to parent.appendChild()?",
    "shortAnswer": "The element is automatically moved (detached from its current parent and appended to the new parent) without needing a separate remove step, while retaining its state and event listeners.",
    "detailedExplanation": "- **Move, Not Copy**: A DOM node can exist in only one location in the document tree.\n- **Event Preservation**: Event listeners attached via `addEventListener` remain intact and functional.\n- **Form State**: Form inputs preserve typed values, focus state, and internal properties.",
    "codeExample": "const activeList = document.querySelector('#active-tasks');\nconst completedList = document.querySelector('#completed-tasks');\nconst task = activeList.firstElementChild;\n\n// Moves task to completed list instantly:\ncompletedList.appendChild(task);",
    "interviewTips": [
      "Clarify that `appendChild` inherently acts as a 'move' operation for nodes that are already in the DOM."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "Preventing Form Submission via Multiple Buttons",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "Why do standard <button> tags inside a <form> submit the form by default and how do you prevent this?",
    "shortAnswer": "The default `type` attribute of a `<button>` is `'submit'`. To prevent automatic submission, explicitly declare `<button type=\"button\">`.",
    "detailedExplanation": "- **HTML Default**: If `type` is omitted, `<button>` defaults to `type=\"submit\"`, triggering form validation and submit events on click.\n- **Preventing Submission**: Always specify `type=\"button\"` for secondary buttons (e.g. 'Cancel', 'Toggle Details').\n- **JavaScript Alternative**: Calling `e.preventDefault()` inside the button's click handler also halts submission.",
    "codeExample": "<!-- Triggers form submission unintentionally: -->\n<!-- <button>Cancel</button> -->\n\n<!-- Safe non-submitting button: -->\n<button type=\"button\" id=\"cancel-btn\">Cancel</button>",
    "interviewTips": [
      "This is a standard junior-to-mid trap: omitting `type=\"button\"` inside a `<form>` triggers accidental form submissions."
    ]
  },
  {
    "topic": "DOM Traversal & Navigation",
    "subtopic": "Detecting Click Outside an Element",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you implement a reusable 'click outside' handler to close a dropdown or modal?",
    "shortAnswer": "Attach a `click` listener to `document` and verify if the clicked `event.target` is contained within the component using `element.contains()`.",
    "detailedExplanation": "- **Check Target**: If `!component.contains(event.target)`, the user clicked outside the component boundary.\n- **Cleanup**: Always remove the document listener when the component closes to prevent memory leaks.\n- **Capture Phase Tip**: Using `{ capture: true }` helps intercept clicks before child stopPropagation calls.",
    "codeExample": "const menu = document.querySelector('.dropdown-menu');\n\nfunction onDocumentClick(e) {\n  if (!menu.contains(e.target)) {\n    menu.classList.remove('open');\n    document.removeEventListener('click', onDocumentClick);\n  }\n}\n\nfunction openMenu() {\n  menu.classList.add('open');\n  // Wait for current click to finish before listening\n  setTimeout(() => document.addEventListener('click', onDocumentClick), 0);\n}",
    "interviewTips": [
      "Mention wrapping the document listener attachment in `setTimeout(..., 0)` to avoid closing immediately on the opening click."
    ]
  },
  {
    "topic": "Node Creation & Insertion",
    "subtopic": "Cloning Form Controls & State",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What happens to user-entered text in an <input> when the element is cloned with cloneNode(true)?",
    "shortAnswer": "The cloned input retains the original HTML `value` attribute specified in markup, but does NOT inherit the dynamically typed user text in the `.value` property.",
    "detailedExplanation": "- **Attribute vs Property**: `cloneNode` copies HTML attributes (`value=\"initial\"`), but not runtime DOM object property mutations.\n- **Checkboxes & Radios**: The `.checked` property state is similarly lost unless specified as an attribute.\n- **Manual Sync**: You must manually copy `clone.value = original.value` after cloning if user state must be preserved.",
    "codeExample": "const input = document.querySelector('input');\ninput.value = 'User typed this';\n\nconst clone = input.cloneNode(true);\nconsole.log(clone.value); // Empty or initial HTML attribute, NOT 'User typed this'!",
    "interviewTips": [
      "Point out the difference between HTML markup attributes and runtime DOM properties during cloning."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "Input vs Change Events on Text Inputs",
    "difficulty": "INTERMEDIATE",
    "questionType": "COMPARISON",
    "question": "How do the input and change events differ on HTML input fields?",
    "shortAnswer": "`input` fires synchronously on every single keystroke or character alteration, while `change` fires only after the input loses focus (blur) and its value has been modified.",
    "detailedExplanation": "- **input Event**: Immediate response; perfect for live search suggestions, character counters, and real-time validation.\n- **change Event**: Deferred response; fires on commit (`Enter` key or field blur); ideal for form submission or heavier network validations.\n- **Select & Checkbox**: For checkboxes and `<select>` dropdowns, `change` fires immediately upon user selection.",
    "codeExample": "const liveSearch = document.querySelector('#search');\n\n// Fires on every single letter typed:\nliveSearch.addEventListener('input', (e) => updateSuggestions(e.target.value));\n\n// Fires only when user unfocuses the input:\nliveSearch.addEventListener('change', (e) => logSearchAnalytics(e.target.value));",
    "interviewTips": [
      "Summarize: `input` is real-time on every keystroke; `change` waits for commit or blur."
    ]
  },
  {
    "topic": "Styles, Classes & CSS OM",
    "subtopic": "Reading CSS Pseudo-classes via Matches",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How can you check if an element currently matches a pseudo-class like :focus-visible or :hover in JavaScript?",
    "shortAnswer": "Pass the pseudo-class directly to `element.matches(':focus-visible')` or `element.matches(':hover')`.",
    "detailedExplanation": "- **Direct Evaluation**: Evaluates whether the element currently satisfies the pseudo-class state according to the browser's style engine.\n- **Focus Rings**: `element.matches(':focus-visible')` lets you detect keyboard navigation focus vs mouse click focus.\n- **Form States**: Also works with `:valid`, `:invalid`, `:checked`, `:disabled`.",
    "codeExample": "const input = document.querySelector('input');\n\nif (input.matches(':focus-visible')) {\n  console.log('Element was focused using keyboard navigation');\n}",
    "interviewTips": [
      "Highlight `element.matches(':focus-visible')` as a great modern pattern for accessible UI testing."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "Event Retargeting in Shadow DOM",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "What is event retargeting when events bubble out of a Shadow DOM boundary?",
    "shortAnswer": "Event retargeting adjusts `event.target` to point to the host custom element once the event crosses outside the shadow root boundary, preserving shadow DOM encapsulation.",
    "detailedExplanation": "- **Encapsulation Protection**: Prevents outer document listeners from inspecting or coupling to private internal shadow DOM elements.\n- **composedPath() Exception**: Calling `event.composedPath()` outside the shadow root still reveals the original internal target if the shadow root is `mode: 'open'`.\n- **Retargeting Point**: As the event bubbles past the ShadowRoot boundary, the engine overwrites `target` with the host element.",
    "codeExample": "// Inside custom element shadow DOM: <button id=\"inner-btn\">Submit</button>\n// Host element: <custom-form>\n\ndocument.addEventListener('click', (e) => {\n  // In the outer document, target appears as the host element, not the inner button:\n  console.log(e.target.tagName); // 'CUSTOM-FORM'\n  console.log(e.composedPath()[0].tagName); // 'BUTTON' (if open shadow)\n});",
    "interviewTips": [
      "Explain that event retargeting is essential for component encapsulation so outer code doesn't break if internal component tags change."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "Piercing Shadow DOM with Composed Events",
    "difficulty": "DIFFICULT",
    "questionType": "CODE",
    "question": "How do you dispatch a CustomEvent from inside a Shadow DOM so that it bubbles out into the main document?",
    "shortAnswer": "Set both `bubbles: true` and `composed: true` in the CustomEvent options dictionary.",
    "detailedExplanation": "- **composed Flag**: Controls whether the event crosses the boundary between the shadow DOM and the regular DOM.\n- **Default Behavior**: By default, `composed` is `false`, trapping custom events strictly inside the shadow root.\n- **Standard UI Events**: Most built-in UI events (`click`, `keydown`) have `composed: true` by default, but custom events do not.",
    "codeExample": "class UserCard extends HTMLElement {\n  notifySelection() {\n    const event = new CustomEvent('user-selected', {\n      bubbles: true,\n      composed: true, // Allows event to escape the shadow DOM boundary\n      detail: { userId: this.getAttribute('user-id') }\n    });\n    this.shadowRoot.dispatchEvent(event);\n  }\n}",
    "interviewTips": [
      "Remember: Custom events need BOTH `bubbles: true` and `composed: true` to cross out of Shadow DOM roots."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "Capturing Phase Event Interception",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "How can capturing phase event listeners be leveraged to build security boundaries or global telemetry in a frontend app?",
    "shortAnswer": "Capturing listeners run from the top of the tree downward before child listeners execute, allowing them to inspect, alter, or cancel events before child component code runs.",
    "detailedExplanation": "- **Interception Priority**: A capturing listener on `window` runs before any listener on any nested child element on the page.\n- **Un-bypassable**: Even if a child element calls `event.stopPropagation()` in bubbling, the capturing listener has already completed.\n- **Security Enforcement**: Used to block unauthorized link clicks, inject CSRF tokens, or log global user telemetry reliably.",
    "codeExample": "// Global click security interceptor:\nwindow.addEventListener('click', (e) => {\n  const untrustedLink = e.target.closest('a[data-external]');\n  if (untrustedLink && !isAllowedDomain(untrustedLink.href)) {\n    e.preventDefault();\n    e.stopImmediatePropagation();\n    alert('External navigation blocked for safety.');\n  }\n}, { capture: true });",
    "interviewTips": [
      "Highlight that capturing phase listeners cannot be silenced by child elements calling `e.stopPropagation()`."
    ]
  },
  {
    "topic": "DOM Traversal & Navigation",
    "subtopic": "TreeWalker API & Filtering",
    "difficulty": "DIFFICULT",
    "questionType": "CODE",
    "question": "How do you use document.createTreeWalker() to traverse and filter specific nodes in a complex DOM hierarchy?",
    "shortAnswer": "Call `document.createTreeWalker(root, whatToShow, filter)` and navigate using methods like `.nextNode()`, `.previousNode()`, and `.firstChild()`.",
    "detailedExplanation": "- **Memory Efficient**: Navigates existing DOM pointers directly without constructing large arrays or allocating nodelists.\n- **whatToShow**: Bitmask filtering node types (e.g. `NodeFilter.SHOW_ELEMENT`, `NodeFilter.SHOW_TEXT`).\n- **NodeFilter Callback**: Returns `NodeFilter.FILTER_ACCEPT`, `NodeFilter.FILTER_SKIP` (skip node, keep children), or `NodeFilter.FILTER_REJECT` (skip node and its children).",
    "codeExample": "const walker = document.createTreeWalker(\n  document.body,\n  NodeFilter.SHOW_TEXT,\n  {\n    acceptNode(node) {\n      return node.textContent.trim().length > 0 \n        ? NodeFilter.FILTER_ACCEPT \n        : NodeFilter.FILTER_REJECT;\n    }\n  }\n);\n\nlet currentNode;\nwhile (currentNode = walker.nextNode()) {\n  console.log('Non-empty text node:', currentNode.textContent);\n}",
    "interviewTips": [
      "Mention `createTreeWalker` as the gold standard for high-performance DOM subtree traversal and text searching."
    ]
  },
  {
    "topic": "DOM Traversal & Navigation",
    "subtopic": "NodeIterator vs TreeWalker",
    "difficulty": "DIFFICULT",
    "questionType": "COMPARISON",
    "question": "What is the key architectural difference between NodeIterator and TreeWalker in DOM Level 2 Traversal?",
    "shortAnswer": "`NodeIterator` presents a flat, sequential list view of nodes traversed forward or backward, whereas `TreeWalker` preserves the tree structure with directional methods (firstChild, parentNode, nextSibling).",
    "detailedExplanation": "- **TreeWalker Flexibility**: Can move up (`parentNode`), down (`firstChild`, `lastChild`), and sideways (`nextSibling`, `previousSibling`).\n- **NodeIterator Simplicity**: Only supports two methods: `nextNode()` and `previousNode()` in document order.\n- **Filtering Options**: TreeWalker distinguishes `FILTER_SKIP` vs `FILTER_REJECT`; NodeIterator treats both identically as skipping the single node.",
    "codeExample": "const iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT);\nlet el;\nwhile (el = iterator.nextNode()) {\n  // Sequential flat traversal\n}",
    "interviewTips": [
      "Summarize: TreeWalker maintains 2D tree navigation; NodeIterator provides a 1D linear stream."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "Event Delegation with Nested Child Elements",
    "difficulty": "DIFFICULT",
    "questionType": "CODE",
    "question": "Why does event delegation fail if you check e.target.tagName === 'BUTTON' when the button contains an <i> icon, and how do you fix it?",
    "shortAnswer": "Clicking the icon makes `e.target` the `<i>` element, causing `e.target.tagName === 'BUTTON'` to fail. Fix this using `e.target.closest('button')` within the delegation container.",
    "detailedExplanation": "- **Nested Target Trap**: The innermost hit element is always `e.target`.\n- **Robust Resolution**: `const btn = e.target.closest('button')` ascends to find the containing button.\n- **Container Boundary**: Verify that the button is inside the delegating container: `if (btn && container.contains(btn))`.\n- **CSS Alternative**: Setting `pointer-events: none` on child icons in CSS also works, but JavaScript `closest()` is more resilient.",
    "codeExample": "const list = document.querySelector('#item-list');\n\nlist.addEventListener('click', (e) => {\n  // Resilient against clicking nested <i> or <span> tags:\n  const actionBtn = e.target.closest('button.action-btn');\n  if (actionBtn && list.contains(actionBtn)) {\n    handleAction(actionBtn.dataset.actionId);\n  }\n});",
    "interviewTips": [
      "Always write `e.target.closest(selector)` when coding event delegation in technical interviews."
    ]
  },
  {
    "topic": "Event System & Propagation",
    "subtopic": "Microtask Execution During DOM Events",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "When are microtasks executed when multiple DOM event listeners trigger sequentially?",
    "shortAnswer": "For genuine user clicks, microtasks (like Promise callbacks) run immediately after each event listener callback completes, before the next listener runs. For programmatic clicks (el.click()), all listeners run before microtasks drain.",
    "detailedExplanation": "- **User Clicks**: The JavaScript call stack clears between each event listener dispatch, allowing the microtask queue to drain after each listener.\n- **Programmatic Clicks (`el.click()`):** Dispatched synchronously; the calling function remains on the call stack, delaying microtask execution until after all listeners have finished.\n- **Classic Quiz**: Code relying on `Promise.resolve().then(...)` will log in different relative orders for real user clicks vs `.click()` calls!",
    "codeExample": "const btn = document.querySelector('button');\nbtn.addEventListener('click', () => {\n  Promise.resolve().then(() => console.log('Microtask 1'));\n  console.log('Listener 1');\n});\nbtn.addEventListener('click', () => {\n  Promise.resolve().then(() => console.log('Microtask 2'));\n  console.log('Listener 2');\n});\n\n// User Click logs: Listener 1 -> Microtask 1 -> Listener 2 -> Microtask 2\n// btn.click() logs: Listener 1 -> Listener 2 -> Microtask 1 -> Microtask 2",
    "interviewTips": [
      "This is one of the highest-rated JavaScript / DOM event loop interview questions at FAANG companies."
    ]
  },
  {
    "topic": "Styles, Classes & CSS OM",
    "subtopic": "Forced Synchronous Layout & DOM Mutations",
    "difficulty": "DIFFICULT",
    "questionType": "PERFORMANCE",
    "question": "What causes Forced Synchronous Layout (Layout Thrashing) when reading geometry immediately after DOM mutations?",
    "shortAnswer": "When JavaScript writes styles and then immediately reads geometric properties (like offsetHeight or getBoundingClientRect), the browser cannot defer layout and is forced to recalculate layout synchronously on the main thread.",
    "detailedExplanation": "- **Normal Pipeline**: The browser batches style calculations and layouts until the end of the current microtask/macro-frame.\n- **Forced Sync**: Reading `element.offsetHeight` forces an immediate synchronous reflow to compute up-to-date pixels.\n- **Thrashing Loop**: Repeating write-read cycles inside a loop turns an O(1) layout calculation into an O(N) blocking disaster.",
    "codeExample": "// BAD (Layout Thrashing - 100 forced reflows):\nfor (const box of boxes) {\n  box.style.width = '100px';\n  console.log(box.offsetHeight); // FORCES SYNCHRONOUS LAYOUT!\n}\n\n// GOOD (Batch Reads, then Batch Writes):\nconst heights = boxes.map(box => box.offsetHeight);\nboxes.forEach(box => box.style.width = '100px');",
    "interviewTips": [
      "Explain the 'read-first, write-second' rule to eliminate forced synchronous layouts."
    ]
  },
  {
    "topic": "Node Creation & Insertion",
    "subtopic": "cloneNode ID Duplication Hazards",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "What subtle bugs occur when cloning elements with id attributes and how must they be sanitized?",
    "shortAnswer": "Cloning elements with `id` attributes produces illegal duplicate IDs in the document, breaking `document.getElementById()`, label-input associations, and ARIA relationships.",
    "detailedExplanation": "- **Invalid HTML**: HTML specification requires `id` values to be unique within a document.\n- **getElementById Breakdown**: `document.getElementById('id')` will only return the first matching element, ignoring clones.\n- **Sanitization**: Before inserting cloned subtrees, loop through all elements with `[id]` and either strip the ID or assign a unique prefixed/counter ID.",
    "codeExample": "function cloneCardSafely(templateCard, uniqueId) {\n  const clone = templateCard.cloneNode(true);\n  \n  // Strip or update duplicate IDs on root and descendants:\n  clone.removeAttribute('id');\n  clone.querySelectorAll('[id]').forEach(el => {\n    el.id = `${el.id}_${uniqueId}`;\n  });\n  \n  return clone;\n}",
    "interviewTips": [
      "Always mention sanitizing `id` and `name` attributes when cloning DOM templates."
    ]
  },
  {
    "topic": "Styles, Classes & CSS OM",
    "subtopic": "CSSStyleDeclaration setProperty vs Inline Assignment",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "Why does element.style.setProperty() support CSS variables while direct property assignment (element.style['--var']) fails in standard browsers?",
    "shortAnswer": "DOM style property accessors are mapped to IDL attributes that only reflect standard camelCase CSS properties, while custom properties (starting with '--') are explicitly defined in the specification to only be accessible via getPropertyValue() and setProperty().",
    "detailedExplanation": "- **IDL Mapping**: The WebIDL specification maps properties like `element.style.color` or `element.style.fontSize` directly to CSS declarations.\n- **CSS Variable Exclusion**: Dashed custom property names are not exposed as direct IDL properties on `CSSStyleDeclaration`.\n- **Standards Compliance**: Always use `setProperty('--custom-var', value)` for CSS variables across all browsers.",
    "codeExample": "const card = document.querySelector('.card');\n\n// Invalid in standard CSSOM:\n// card.style['--card-bg'] = '#1e293b';\n\n// Valid across all modern browsers:\ncard.style.setProperty('--card-bg', '#1e293b');",
    "interviewTips": [
      "Direct assignment to `element.style['--var']` is a common mistake: remind the interviewer that `setProperty` is required for custom CSS properties."
    ]
  }
];
