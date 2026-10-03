// scripts/dom-gen/part3-extra.cjs
// 36 Additional questions for Part 3 (Total in part3 becomes 70: 20 EASY, 35 INTERMEDIATE, 15 DIFFICULT)

module.exports = [
  // --- 10 EASY Questions ---
  {
    topic: "Node Creation & Insertion",
    subtopic: "cloneNode Deep Parameter",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "Does node.cloneNode(true) copy event listeners attached via addEventListener?",
    shortAnswer: "No, cloneNode() copies HTML attributes and inline event handlers, but never copies event listeners attached using addEventListener() or assigned DOM properties.",
    detailedExplanation: "- **What is Cloned**: HTML tag, attributes, inline listeners like `onclick=\"...\"`, and all descendant nodes (if deep is `true`).\n- **What is NOT Cloned**: Listeners attached via `addEventListener()`, dynamic JavaScript properties added to the DOM object, and form state like canvas drawings.\n- **Re-binding**: Any required event listeners must be manually re-attached to the cloned element.",
    codeExample: "const btn = document.querySelector('#btn');\nbtn.addEventListener('click', () => console.log('Clicked!'));\n\n// Cloned button will NOT fire the click listener:\nconst clone = btn.cloneNode(true);\ndocument.body.appendChild(clone);",
    interviewTips: ["This is a classic interview gotcha: `cloneNode(true)` never clones listeners registered with `addEventListener`."]
  },
  {
    topic: "DOM Traversal & Navigation",
    subtopic: "node.contains() Method",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you test if one DOM element is an ancestor of or contains another element?",
    shortAnswer: "Call `parentElement.contains(childElement)`, which returns `true` if the node is a descendant or the node itself, and `false` otherwise.",
    detailedExplanation: "- **Self-Inclusion**: `node.contains(node)` evaluates to `true` (a node contains itself).\n- **Descendant Check**: Works for direct children, grandchildren, and arbitrarily deep descendants.\n- **Common Use Case**: Detecting outside clicks when building modal dialogs or dropdowns.",
    codeExample: "const dropdown = document.querySelector('.dropdown');\n\ndocument.addEventListener('click', (e) => {\n  const isInside = dropdown.contains(e.target);\n  if (!isInside) {\n    dropdown.classList.remove('open');\n  }\n});",
    interviewTips: ["Highlight `node.contains()` as the foundation of 'click outside to dismiss' dropdown and modal implementations."]
  },
  {
    topic: "Styles, Classes & CSS OM",
    subtopic: "element.matches()",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you check if an element matches a specific CSS selector using JavaScript?",
    shortAnswer: "Call `element.matches('css-selector')`, which returns `true` if the element matches the selector and `false` otherwise.",
    detailedExplanation: "- **Selector Testing**: Accepts any valid CSS selector string (e.g. `.active`, `li:first-child`, `[disabled]`).\n- **No Traversal**: Tests only the current element, without looking up or down the DOM tree.\n- **Core for Delegation**: Crucial inside event delegation listeners to test `event.target.matches('.item-btn')`.",
    codeExample: "const button = document.querySelector('button');\n\nif (button.matches('.btn-primary:not([disabled])')) {\n  console.log('Button is an active primary action');\n}",
    interviewTips: ["Combine `matches()` with event delegation: test if `e.target.matches('.delete-btn')` to handle dynamic child actions."]
  },
  {
    topic: "DOM Traversal & Navigation",
    subtopic: "element.closest()",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What is element.closest() and how does it traverse the DOM tree?",
    shortAnswer: "`element.closest(selector)` traverses up through the element and its ancestors toward the document root, returning the first matching element, or `null` if none match.",
    detailedExplanation: "- **Starts at Current Element**: Checks the element itself first; if it matches, it returns the element immediately.\n- **Upward Search**: Ascends through parent nodes until reaching `<html>` or `document`.\n- **Nested Targets**: Solves the event delegation problem where users click an `<i>` or `<span>` inside a `<button>`.",
    codeExample: "document.addEventListener('click', (e) => {\n  // Finds the parent row even if user clicked an icon inside a cell:\n  const tableRow = e.target.closest('tr[data-id]');\n  if (tableRow) {\n    console.log('Clicked row ID:', tableRow.dataset.id);\n  }\n});",
    interviewTips: ["`element.closest()` is the modern standard solution for finding the meaningful component root from a clicked child node."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "Keyboard Enter Key Detection",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What is the modern, recommended way to detect when a user presses the Enter key in an input field?",
    shortAnswer: "Check `event.key === 'Enter'` in a `keydown` event listener. The older `event.keyCode === 13` is deprecated.",
    detailedExplanation: "- **Modern Standard**: `event.key` returns a human-readable string (`'Enter'`, `'Escape'`, `'Tab'`, `'ArrowDown'`).\n- **Deprecated Properties**: Avoid `event.keyCode` and `event.which`, which are marked deprecated in the W3C specification.\n- **Case Sensitivity**: Key names are case-sensitive (`'Enter'`, `'Backspace'`).",
    codeExample: "const searchInput = document.querySelector('#search');\n\nsearchInput.addEventListener('keydown', (e) => {\n  if (e.key === 'Enter') {\n    e.preventDefault();\n    performSearch(searchInput.value);\n  }\n});",
    interviewTips: ["Always emphasize using `event.key === 'Enter'` rather than the legacy `keyCode === 13`."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "Programmatic Click Trigger",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you trigger a click event on an element programmatically using JavaScript?",
    shortAnswer: "Call `element.click()` on the DOM element instance to trigger its default click behavior and registered click handlers.",
    detailedExplanation: "- **Default Actions**: Triggers both registered click listeners and native actions (such as opening a file picker on `<input type=\"file\">`).\n- **Synthetic vs Real**: Synthetic clicks have `event.isTrusted === false`.\n- **Common Pattern**: Hiding an ugly file input and triggering it when a styled custom button is clicked.",
    codeExample: "const fileInput = document.querySelector('#avatar-upload');\nconst customBtn = document.querySelector('#custom-upload-btn');\n\ncustomBtn.addEventListener('click', () => {\n  fileInput.click(); // Triggers native OS file picker\n});",
    interviewTips: ["Explain how triggering `.click()` on hidden file inputs is standard practice for custom file uploader UI designs."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "event.defaultPrevented",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What does the event.defaultPrevented property indicate?",
    shortAnswer: "`event.defaultPrevented` is a boolean that returns `true` if `event.preventDefault()` was invoked during the event's dispatch, and `false` otherwise.",
    detailedExplanation: "- **State Flag**: Allows subsequent event handlers in the bubbling chain to check if an earlier handler cancelled the default browser action.\n- **Read-Only**: Cannot be directly modified by script.\n- **Framework Use**: Widely used by routers and UI libraries to respect or override custom navigation behavior.",
    codeExample: "document.body.addEventListener('click', (e) => {\n  if (e.defaultPrevented) {\n    console.log('Default browser action was cancelled by a child element');\n    return;\n  }\n  console.log('Proceeding with normal action');\n});",
    interviewTips: ["Mention that `event.defaultPrevented` lets parent containers know whether child components already handled and cancelled an action."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "click vs dblclick Events",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What is the difference between click and dblclick events in the DOM?",
    shortAnswer: "`click` fires after a single mouse press and release, while `dblclick` fires after two rapid clicks on the same element within a system-defined threshold.",
    detailedExplanation: "- **Firing Sequence**: When a user double-clicks, the browser fires: `mousedown` -> `mouseup` -> `click` -> `mousedown` -> `mouseup` -> `click` -> `dblclick`.\n- **Coexistence Gotcha**: If you attach both `click` and `dblclick` to the same element, the single click handlers will fire twice before `dblclick` fires.\n- **Debounce Solution**: Distinguishing single vs double clicks requires setting a timer in the single click handler.",
    codeExample: "const item = document.querySelector('.folder-item');\n\nitem.addEventListener('dblclick', () => {\n  console.log('Double clicked: Opening folder...');\n});",
    interviewTips: ["Point out that `click` fires twice whenever `dblclick` occurs, which can lead to accidental double executions without debounce timers."]
  },
  {
    topic: "DOM Traversal & Navigation",
    subtopic: "window.scrollTo with Smooth Behavior",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you scroll the window to the top smoothly using modern DOM APIs?",
    shortAnswer: "Call `window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })`.",
    detailedExplanation: "- **ScrollOptions Object**: Accepts `top`, `left`, and `behavior` (`'smooth'` or `'instant'`).\n- **CSS Equivalent**: Mirrors the CSS rule `html { scroll-behavior: smooth; }`.\n- **Element Scrolling**: Also supported on individual scrollable container elements via `element.scrollTo()`.",
    codeExample: "const backToTopBtn = document.querySelector('#back-to-top');\n\nbackToTopBtn.addEventListener('click', () => {\n  window.scrollTo({\n    top: 0,\n    behavior: 'smooth'\n  });\n});",
    interviewTips: ["Mention `behavior: 'smooth'` as the standard native alternative to legacy jQuery `$('html, body').animate({ scrollTop: 0 })`."]
  },
  {
    topic: "Styles, Classes & CSS OM",
    subtopic: "element.scrollIntoView()",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you scroll a specific element into the visible viewport with scrollIntoView?",
    shortAnswer: "Call `element.scrollIntoView({ behavior: 'smooth', block: 'start' })` to scroll the element smoothly into view.",
    detailedExplanation: "- **Options**: `behavior` (`'smooth'` | `'instant'`), `block` (`'start'` | `'center'` | `'end'` | `'nearest'`), and `inline`.\n- **Targeting**: Automatically scrolls all scrollable parent containers needed to reveal the element.\n- **Focus Sync**: Often paired with `element.focus()` for keyboard accessibility.",
    codeExample: "const errorBanner = document.querySelector('.form-error-banner');\nif (errorBanner) {\n  errorBanner.scrollIntoView({\n    behavior: 'smooth',\n    block: 'center'\n  });\n}",
    interviewTips: ["Highlight `scrollIntoView({ block: 'center' })` as an excellent pattern for drawing user attention to form validation errors."]
  },

  // --- 16 INTERMEDIATE Questions ---
  {
    topic: "Node Creation & Insertion",
    subtopic: "isEqualNode vs isSameNode vs ===",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    question: "What is the difference between isEqualNode(), isSameNode(), and the === operator in DOM programming?",
    shortAnswer: "`isEqualNode()` tests if two nodes have identical tag, attributes, and child structure, whereas `isSameNode()` and `===` test if both references point to the exact same object in memory.",
    detailedExplanation: "- **isEqualNode()**: Structural deep equality test (like two cloned nodes with the same content).\n- **isSameNode()**: Identity test, identical in behavior to the JavaScript `===` identity operator.\n- **Usage**: Use `isEqualNode()` when checking if template output or API rendered elements match.",
    codeExample: "const div1 = document.createElement('div');\ndiv1.className = 'card';\nconst div2 = div1.cloneNode(true);\n\nconsole.log(div1 === div2);          // false (distinct heap objects)\nconsole.log(div1.isSameNode(div2));  // false\nconsole.log(div1.isEqualNode(div2)); // true (structurally identical)",
    interviewTips: ["Memorize: `isEqualNode` checks structural content equality; `===` checks memory reference identity."]
  },
  {
    topic: "DOM Traversal & Navigation",
    subtopic: "compareDocumentPosition Bitmask",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is node.compareDocumentPosition() and how do you interpret its bitmask return value?",
    shortAnswer: "`node.compareDocumentPosition(otherNode)` returns a bitmask integer describing the relative position and hierarchy of two nodes in the document tree.",
    detailedExplanation: "- **Bitmask Flags**: Returns combinations of 1 (disconnected), 2 (preceding), 4 (following), 8 (contains), 16 (contained by).\n- **Bitwise AND**: Check results using bitwise AND: `if (nodeA.compareDocumentPosition(nodeB) & Node.DOCUMENT_POSITION_FOLLOWING)`.\n- **DOM Order**: Used by libraries to sort collections of elements into document source order.",
    codeExample: "const head = document.head;\nconst body = document.body;\n\nconst position = head.compareDocumentPosition(body);\nif (position & Node.DOCUMENT_POSITION_FOLLOWING) {\n  console.log('Body appears after Head in document order');\n}",
    interviewTips: ["Mention that `compareDocumentPosition` returns a bitmask, so testing flags requires the bitwise `&` operator."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "focus/blur vs focusin/focusout Bubbling",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    question: "Why do focusin and focusout bubble while focus and blur do not?",
    shortAnswer: "The DOM Level 3 specification introduced `focusin` and `focusout` specifically to bubble up the DOM tree, enabling event delegation on parent form containers.",
    detailedExplanation: "- **focus and blur**: Do not bubble up to parent containers (`bubbles: false`).\n- **focusin and focusout**: Bubble up to parents (`bubbles: true`), allowing a `<form>` listener to track focus across all child inputs.\n- **Capture Alternative**: You can still catch `focus` on parent containers by setting `capture: true` in `addEventListener`.",
    codeExample: "const form = document.querySelector('form');\n\n// Works with delegation because focusin bubbles:\nform.addEventListener('focusin', (e) => {\n  e.target.classList.add('focused-field');\n});\nform.addEventListener('focusout', (e) => {\n  e.target.classList.remove('focused-field');\n});",
    interviewTips: ["Remember: `focusin` and `focusout` bubble; `focus` and `blur` do not."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "mouseenter/mouseleave vs mouseover/mouseout",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    question: "What is the difference between mouseenter/mouseleave and mouseover/mouseout?",
    shortAnswer: "`mouseover` and `mouseout` bubble and fire whenever the pointer enters or leaves any child element inside the container, whereas `mouseenter` and `mouseleave` do not bubble and only fire when crossing the outer container boundary.",
    detailedExplanation: "- **Bubbling**: `mouseover/mouseout` bubble (`bubbles: true`); `mouseenter/mouseleave` do not (`bubbles: false`).\n- **Child Elements**: Hovering over child elements inside a container triggers multiple unexpected `mouseout` and `mouseover` events.\n- **Clean UI Hover**: Use `mouseenter` and `mouseleave` for tooltips and drop-down menus to avoid flicker when hovering over inner children.",
    codeExample: "const menu = document.querySelector('.dropdown-menu');\n\n// Smooth hover without flickering when cursor moves across menu links:\nmenu.addEventListener('mouseenter', () => menu.classList.add('visible'));\nmenu.addEventListener('mouseleave', () => menu.classList.remove('visible'));",
    interviewTips: ["Explain hover flicker: `mouseover/mouseout` cause UI flickering on containers with children because they fire on every child boundary."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "event.eventPhase Values",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What does the event.eventPhase property represent and what are its four numerical constants?",
    shortAnswer: "`event.eventPhase` indicates the current phase of event flow: 0 (NONE), 1 (CAPTURING_PHASE), 2 (AT_TARGET), and 3 (BUBBLING_PHASE).",
    detailedExplanation: "- **Event.NONE (0)**: Event is not currently being dispatched.\n- **Event.CAPTURING_PHASE (1)**: Event is travelling down from window through ancestor tree to target.\n- **Event.AT_TARGET (2)**: Event has reached the actual target element where the user action occurred.\n- **Event.BUBBLING_PHASE (3)**: Event is bubbling back up through ancestor elements to window.",
    codeExample: "button.addEventListener('click', (e) => {\n  console.log('Current Phase:', e.eventPhase); // 2 (Event.AT_TARGET)\n});",
    interviewTips: ["Name the 3 active phases in order: 1 Capturing -> 2 At Target -> 3 Bubbling."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "Listener Execution Order At Target",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "In what order do capturing and bubbling event listeners execute when registered on the target element itself?",
    shortAnswer: "On the target element itself (Phase 2: AT_TARGET), listeners execute in the exact order they were registered via addEventListener, regardless of the capture flag.",
    detailedExplanation: "- **Modern Standard**: In DOM Level 4, at the target element, registration order takes precedence.\n- **Historic Quirk**: Older browsers ran capture listeners first at target; modern specs run them in registration order.\n- **Ancestors**: On ancestor elements, capturing listeners ALWAYS run before bubbling listeners.",
    codeExample: "const btn = document.querySelector('button');\n\nbtn.addEventListener('click', () => console.log('1: Bubble'), false);\nbtn.addEventListener('click', () => console.log('2: Capture'), true);\n\n// Clicking the button logs:\n// 1: Bubble\n// 2: Capture (runs in order of registration at target!)",
    interviewTips: ["Clarify that the capture flag strictly dictates order on ANCESTOR nodes, but on the target node itself, registration order rules."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "event.composedPath()",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you inspect the complete hierarchy of nodes an event will traverse using event.composedPath()?",
    shortAnswer: "`event.composedPath()` returns an array of all DOM nodes (from the target element up through parents to `window`) that the event will pass through.",
    detailedExplanation: "- **Complete Chain**: Returns `[targetElement, parent1, parent2, ..., body, html, document, window]`.\n- **Shadow DOM Resilient**: If shadow roots are open, `composedPath()` penetrates shadow boundaries to reveal original shadow nodes.\n- **Click Outside Helper**: Checking if `event.composedPath().includes(myModal)` is an elegant way to detect inside/outside clicks.",
    codeExample: "document.addEventListener('click', (e) => {\n  const path = e.composedPath();\n  console.log('Event path nodes:', path.map(el => el.nodeName));\n\n  const clickedInsideModal = path.includes(document.querySelector('#modal'));\n  if (!clickedInsideModal) closeModal();\n});",
    interviewTips: ["Mention `event.composedPath()` as a clean, array-based alternative to manually looping through `node.parentNode`."]
  },
  {
    topic: "Styles, Classes & CSS OM",
    subtopic: "Constructable Stylesheets",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What are Constructable Stylesheets (new CSSStyleSheet()) and document.adoptedStyleSheets?",
    shortAnswer: "Constructable Stylesheets allow creating and sharing reusable CSS stylesheets across multiple DOM trees and Shadow roots by pushing them into `document.adoptedStyleSheets`.",
    detailedExplanation: "- **Memory Efficient**: A single compiled stylesheet instance can be shared across thousands of Web Components without duplicate DOM `<style>` tags.\n- **Synchronous or Async**: Created via `new CSSStyleSheet()` and loaded with `sheet.replaceSync(cssText)` or `sheet.replace(cssText)`.\n- **Dynamic Mutation**: Updating a shared stylesheet instantly updates every component adopting it.",
    codeExample: "const sharedSheet = new CSSStyleSheet();\nsharedSheet.replaceSync('button { background: #3b82f6; color: white; padding: 8px 16px; }');\n\n// Adopting sheet in main document:\ndocument.adoptedStyleSheets = [...document.adoptedStyleSheets, sharedSheet];",
    interviewTips: ["Highlight `adoptedStyleSheets` as a game-changer for Web Components and design system performance."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "event.cancelable Property",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What does event.cancelable signify and what happens if you call preventDefault() on a non-cancelable event?",
    shortAnswer: "`event.cancelable` indicates whether `event.preventDefault()` can cancel the default browser action; calling `preventDefault()` on an event where `cancelable === false` does nothing.",
    detailedExplanation: "- **Boolean Flag**: Events like `wheel`, `keydown`, and form `submit` have `cancelable: true`.\n- **Non-Cancelable Events**: Events like `scroll`, `load`, and `unload` have `cancelable: false` because the browser has already committed to the action.\n- **Passive Listeners**: In passive listeners, events report `defaultPrevented === false` and `preventDefault()` calls are ignored.",
    codeExample: "window.addEventListener('scroll', (e) => {\n  console.log('Is scroll cancelable?', e.cancelable); // false\n  e.preventDefault(); // Silently ignored, page still scrolls!\n});",
    interviewTips: ["Emphasize that `scroll` cannot be cancelled via `e.preventDefault()` because `cancelable === false`."]
  },
  {
    topic: "Styles, Classes & CSS OM",
    subtopic: "getBoundingClientRect vs getClientRects",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    question: "What is the difference between element.getBoundingClientRect() and element.getClientRects()?",
    shortAnswer: "`getBoundingClientRect()` returns a single bounding rectangle enclosing the entire element, whereas `getClientRects()` returns a list of rectangles for each line box of an inline element.",
    detailedExplanation: "- **Multiline Inlines**: When an inline `<a>` or `<span>` wraps across three lines, `getClientRects()` returns 3 separate DOMRect objects, while `getBoundingClientRect()` returns one large bounding box covering all lines.\n- **Block Elements**: For standard block elements, both methods describe the same boundary.\n- **Selection Highlighting**: `getClientRects()` is used to draw exact highlight boxes over multiline text selections.",
    codeExample: "const inlineLink = document.querySelector('p a');\nconst lineBoxes = inlineLink.getClientRects();\nconsole.log(`Link spans across ${lineBoxes.length} visual lines.`);",
    interviewTips: ["Use the inline multiline text wrapping example to explain why `getClientRects()` exists."]
  },
  {
    topic: "DOM Traversal & Navigation",
    subtopic: "Reparenting Elements with appendChild",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What happens when you pass an element that already exists in the DOM to parent.appendChild()?",
    shortAnswer: "The element is automatically moved (detached from its current parent and appended to the new parent) without needing a separate remove step, while retaining its state and event listeners.",
    detailedExplanation: "- **Move, Not Copy**: A DOM node can exist in only one location in the document tree.\n- **Event Preservation**: Event listeners attached via `addEventListener` remain intact and functional.\n- **Form State**: Form inputs preserve typed values, focus state, and internal properties.",
    codeExample: "const activeList = document.querySelector('#active-tasks');\nconst completedList = document.querySelector('#completed-tasks');\nconst task = activeList.firstElementChild;\n\n// Moves task to completed list instantly:\ncompletedList.appendChild(task);",
    interviewTips: ["Clarify that `appendChild` inherently acts as a 'move' operation for nodes that are already in the DOM."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "Preventing Form Submission via Multiple Buttons",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "Why do standard <button> tags inside a <form> submit the form by default and how do you prevent this?",
    shortAnswer: "The default `type` attribute of a `<button>` is `'submit'`. To prevent automatic submission, explicitly declare `<button type=\"button\">`.",
    detailedExplanation: "- **HTML Default**: If `type` is omitted, `<button>` defaults to `type=\"submit\"`, triggering form validation and submit events on click.\n- **Preventing Submission**: Always specify `type=\"button\"` for secondary buttons (e.g. 'Cancel', 'Toggle Details').\n- **JavaScript Alternative**: Calling `e.preventDefault()` inside the button's click handler also halts submission.",
    codeExample: "<!-- Triggers form submission unintentionally: -->\n<!-- <button>Cancel</button> -->\n\n<!-- Safe non-submitting button: -->\n<button type=\"button\" id=\"cancel-btn\">Cancel</button>",
    interviewTips: ["This is a standard junior-to-mid trap: omitting `type=\"button\"` inside a `<form>` triggers accidental form submissions."]
  },
  {
    topic: "DOM Traversal & Navigation",
    subtopic: "Detecting Click Outside an Element",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you implement a reusable 'click outside' handler to close a dropdown or modal?",
    shortAnswer: "Attach a `click` listener to `document` and verify if the clicked `event.target` is contained within the component using `element.contains()`.",
    detailedExplanation: "- **Check Target**: If `!component.contains(event.target)`, the user clicked outside the component boundary.\n- **Cleanup**: Always remove the document listener when the component closes to prevent memory leaks.\n- **Capture Phase Tip**: Using `{ capture: true }` helps intercept clicks before child stopPropagation calls.",
    codeExample: "const menu = document.querySelector('.dropdown-menu');\n\nfunction onDocumentClick(e) {\n  if (!menu.contains(e.target)) {\n    menu.classList.remove('open');\n    document.removeEventListener('click', onDocumentClick);\n  }\n}\n\nfunction openMenu() {\n  menu.classList.add('open');\n  // Wait for current click to finish before listening\n  setTimeout(() => document.addEventListener('click', onDocumentClick), 0);\n}",
    interviewTips: ["Mention wrapping the document listener attachment in `setTimeout(..., 0)` to avoid closing immediately on the opening click."]
  },
  {
    topic: "Node Creation & Insertion",
    subtopic: "Cloning Form Controls & State",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What happens to user-entered text in an <input> when the element is cloned with cloneNode(true)?",
    shortAnswer: "The cloned input retains the original HTML `value` attribute specified in markup, but does NOT inherit the dynamically typed user text in the `.value` property.",
    detailedExplanation: "- **Attribute vs Property**: `cloneNode` copies HTML attributes (`value=\"initial\"`), but not runtime DOM object property mutations.\n- **Checkboxes & Radios**: The `.checked` property state is similarly lost unless specified as an attribute.\n- **Manual Sync**: You must manually copy `clone.value = original.value` after cloning if user state must be preserved.",
    codeExample: "const input = document.querySelector('input');\ninput.value = 'User typed this';\n\nconst clone = input.cloneNode(true);\nconsole.log(clone.value); // Empty or initial HTML attribute, NOT 'User typed this'!",
    interviewTips: ["Point out the difference between HTML markup attributes and runtime DOM properties during cloning."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "Input vs Change Events on Text Inputs",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    question: "How do the input and change events differ on HTML input fields?",
    shortAnswer: "`input` fires synchronously on every single keystroke or character alteration, while `change` fires only after the input loses focus (blur) and its value has been modified.",
    detailedExplanation: "- **input Event**: Immediate response; perfect for live search suggestions, character counters, and real-time validation.\n- **change Event**: Deferred response; fires on commit (`Enter` key or field blur); ideal for form submission or heavier network validations.\n- **Select & Checkbox**: For checkboxes and `<select>` dropdowns, `change` fires immediately upon user selection.",
    codeExample: "const liveSearch = document.querySelector('#search');\n\n// Fires on every single letter typed:\nliveSearch.addEventListener('input', (e) => updateSuggestions(e.target.value));\n\n// Fires only when user unfocuses the input:\nliveSearch.addEventListener('change', (e) => logSearchAnalytics(e.target.value));",
    interviewTips: ["Summarize: `input` is real-time on every keystroke; `change` waits for commit or blur."]
  },
  {
    topic: "Styles, Classes & CSS OM",
    subtopic: "Reading CSS Pseudo-classes via Matches",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How can you check if an element currently matches a pseudo-class like :focus-visible or :hover in JavaScript?",
    shortAnswer: "Pass the pseudo-class directly to `element.matches(':focus-visible')` or `element.matches(':hover')`.",
    detailedExplanation: "- **Direct Evaluation**: Evaluates whether the element currently satisfies the pseudo-class state according to the browser's style engine.\n- **Focus Rings**: `element.matches(':focus-visible')` lets you detect keyboard navigation focus vs mouse click focus.\n- **Form States**: Also works with `:valid`, `:invalid`, `:checked`, `:disabled`.",
    codeExample: "const input = document.querySelector('input');\n\nif (input.matches(':focus-visible')) {\n  console.log('Element was focused using keyboard navigation');\n}",
    interviewTips: ["Highlight `element.matches(':focus-visible')` as a great modern pattern for accessible UI testing."]
  },

  // --- 10 DIFFICULT Questions ---
  {
    topic: "Event System & Propagation",
    subtopic: "Event Retargeting in Shadow DOM",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "What is event retargeting when events bubble out of a Shadow DOM boundary?",
    shortAnswer: "Event retargeting adjusts `event.target` to point to the host custom element once the event crosses outside the shadow root boundary, preserving shadow DOM encapsulation.",
    detailedExplanation: "- **Encapsulation Protection**: Prevents outer document listeners from inspecting or coupling to private internal shadow DOM elements.\n- **composedPath() Exception**: Calling `event.composedPath()` outside the shadow root still reveals the original internal target if the shadow root is `mode: 'open'`.\n- **Retargeting Point**: As the event bubbles past the ShadowRoot boundary, the engine overwrites `target` with the host element.",
    codeExample: "// Inside custom element shadow DOM: <button id=\"inner-btn\">Submit</button>\n// Host element: <custom-form>\n\ndocument.addEventListener('click', (e) => {\n  // In the outer document, target appears as the host element, not the inner button:\n  console.log(e.target.tagName); // 'CUSTOM-FORM'\n  console.log(e.composedPath()[0].tagName); // 'BUTTON' (if open shadow)\n});",
    interviewTips: ["Explain that event retargeting is essential for component encapsulation so outer code doesn't break if internal component tags change."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "Piercing Shadow DOM with Composed Events",
    difficulty: "DIFFICULT",
    questionType: "CODE",
    question: "How do you dispatch a CustomEvent from inside a Shadow DOM so that it bubbles out into the main document?",
    shortAnswer: "Set both `bubbles: true` and `composed: true` in the CustomEvent options dictionary.",
    detailedExplanation: "- **composed Flag**: Controls whether the event crosses the boundary between the shadow DOM and the regular DOM.\n- **Default Behavior**: By default, `composed` is `false`, trapping custom events strictly inside the shadow root.\n- **Standard UI Events**: Most built-in UI events (`click`, `keydown`) have `composed: true` by default, but custom events do not.",
    codeExample: "class UserCard extends HTMLElement {\n  notifySelection() {\n    const event = new CustomEvent('user-selected', {\n      bubbles: true,\n      composed: true, // Allows event to escape the shadow DOM boundary\n      detail: { userId: this.getAttribute('user-id') }\n    });\n    this.shadowRoot.dispatchEvent(event);\n  }\n}",
    interviewTips: ["Remember: Custom events need BOTH `bubbles: true` and `composed: true` to cross out of Shadow DOM roots."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "Capturing Phase Event Interception",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "How can capturing phase event listeners be leveraged to build security boundaries or global telemetry in a frontend app?",
    shortAnswer: "Capturing listeners run from the top of the tree downward before child listeners execute, allowing them to inspect, alter, or cancel events before child component code runs.",
    detailedExplanation: "- **Interception Priority**: A capturing listener on `window` runs before any listener on any nested child element on the page.\n- **Un-bypassable**: Even if a child element calls `event.stopPropagation()` in bubbling, the capturing listener has already completed.\n- **Security Enforcement**: Used to block unauthorized link clicks, inject CSRF tokens, or log global user telemetry reliably.",
    codeExample: "// Global click security interceptor:\nwindow.addEventListener('click', (e) => {\n  const untrustedLink = e.target.closest('a[data-external]');\n  if (untrustedLink && !isAllowedDomain(untrustedLink.href)) {\n    e.preventDefault();\n    e.stopImmediatePropagation();\n    alert('External navigation blocked for safety.');\n  }\n}, { capture: true });",
    interviewTips: ["Highlight that capturing phase listeners cannot be silenced by child elements calling `e.stopPropagation()`."]
  },
  {
    topic: "DOM Traversal & Navigation",
    subtopic: "TreeWalker API & Filtering",
    difficulty: "DIFFICULT",
    questionType: "CODE",
    question: "How do you use document.createTreeWalker() to traverse and filter specific nodes in a complex DOM hierarchy?",
    shortAnswer: "Call `document.createTreeWalker(root, whatToShow, filter)` and navigate using methods like `.nextNode()`, `.previousNode()`, and `.firstChild()`.",
    detailedExplanation: "- **Memory Efficient**: Navigates existing DOM pointers directly without constructing large arrays or allocating nodelists.\n- **whatToShow**: Bitmask filtering node types (e.g. `NodeFilter.SHOW_ELEMENT`, `NodeFilter.SHOW_TEXT`).\n- **NodeFilter Callback**: Returns `NodeFilter.FILTER_ACCEPT`, `NodeFilter.FILTER_SKIP` (skip node, keep children), or `NodeFilter.FILTER_REJECT` (skip node and its children).",
    codeExample: "const walker = document.createTreeWalker(\n  document.body,\n  NodeFilter.SHOW_TEXT,\n  {\n    acceptNode(node) {\n      return node.textContent.trim().length > 0 \n        ? NodeFilter.FILTER_ACCEPT \n        : NodeFilter.FILTER_REJECT;\n    }\n  }\n);\n\nlet currentNode;\nwhile (currentNode = walker.nextNode()) {\n  console.log('Non-empty text node:', currentNode.textContent);\n}",
    interviewTips: ["Mention `createTreeWalker` as the gold standard for high-performance DOM subtree traversal and text searching."]
  },
  {
    topic: "DOM Traversal & Navigation",
    subtopic: "NodeIterator vs TreeWalker",
    difficulty: "DIFFICULT",
    questionType: "COMPARISON",
    question: "What is the key architectural difference between NodeIterator and TreeWalker in DOM Level 2 Traversal?",
    shortAnswer: "`NodeIterator` presents a flat, sequential list view of nodes traversed forward or backward, whereas `TreeWalker` preserves the tree structure with directional methods (firstChild, parentNode, nextSibling).",
    detailedExplanation: "- **TreeWalker Flexibility**: Can move up (`parentNode`), down (`firstChild`, `lastChild`), and sideways (`nextSibling`, `previousSibling`).\n- **NodeIterator Simplicity**: Only supports two methods: `nextNode()` and `previousNode()` in document order.\n- **Filtering Options**: TreeWalker distinguishes `FILTER_SKIP` vs `FILTER_REJECT`; NodeIterator treats both identically as skipping the single node.",
    codeExample: "const iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT);\nlet el;\nwhile (el = iterator.nextNode()) {\n  // Sequential flat traversal\n}",
    interviewTips: ["Summarize: TreeWalker maintains 2D tree navigation; NodeIterator provides a 1D linear stream."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "Event Delegation with Nested Child Elements",
    difficulty: "DIFFICULT",
    questionType: "CODE",
    question: "Why does event delegation fail if you check e.target.tagName === 'BUTTON' when the button contains an <i> icon, and how do you fix it?",
    shortAnswer: "Clicking the icon makes `e.target` the `<i>` element, causing `e.target.tagName === 'BUTTON'` to fail. Fix this using `e.target.closest('button')` within the delegation container.",
    detailedExplanation: "- **Nested Target Trap**: The innermost hit element is always `e.target`.\n- **Robust Resolution**: `const btn = e.target.closest('button')` ascends to find the containing button.\n- **Container Boundary**: Verify that the button is inside the delegating container: `if (btn && container.contains(btn))`.\n- **CSS Alternative**: Setting `pointer-events: none` on child icons in CSS also works, but JavaScript `closest()` is more resilient.",
    codeExample: "const list = document.querySelector('#item-list');\n\nlist.addEventListener('click', (e) => {\n  // Resilient against clicking nested <i> or <span> tags:\n  const actionBtn = e.target.closest('button.action-btn');\n  if (actionBtn && list.contains(actionBtn)) {\n    handleAction(actionBtn.dataset.actionId);\n  }\n});",
    interviewTips: ["Always write `e.target.closest(selector)` when coding event delegation in technical interviews."]
  },
  {
    topic: "Event System & Propagation",
    subtopic: "Microtask Execution During DOM Events",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "When are microtasks executed when multiple DOM event listeners trigger sequentially?",
    shortAnswer: "For genuine user clicks, microtasks (like Promise callbacks) run immediately after each event listener callback completes, before the next listener runs. For programmatic clicks (el.click()), all listeners run before microtasks drain.",
    detailedExplanation: "- **User Clicks**: The JavaScript call stack clears between each event listener dispatch, allowing the microtask queue to drain after each listener.\n- **Programmatic Clicks (`el.click()`):** Dispatched synchronously; the calling function remains on the call stack, delaying microtask execution until after all listeners have finished.\n- **Classic Quiz**: Code relying on `Promise.resolve().then(...)` will log in different relative orders for real user clicks vs `.click()` calls!",
    codeExample: "const btn = document.querySelector('button');\nbtn.addEventListener('click', () => {\n  Promise.resolve().then(() => console.log('Microtask 1'));\n  console.log('Listener 1');\n});\nbtn.addEventListener('click', () => {\n  Promise.resolve().then(() => console.log('Microtask 2'));\n  console.log('Listener 2');\n});\n\n// User Click logs: Listener 1 -> Microtask 1 -> Listener 2 -> Microtask 2\n// btn.click() logs: Listener 1 -> Listener 2 -> Microtask 1 -> Microtask 2",
    interviewTips: ["This is one of the highest-rated JavaScript / DOM event loop interview questions at FAANG companies."]
  },
  {
    topic: "Styles, Classes & CSS OM",
    subtopic: "Forced Synchronous Layout & DOM Mutations",
    difficulty: "DIFFICULT",
    questionType: "PERFORMANCE",
    question: "What causes Forced Synchronous Layout (Layout Thrashing) when reading geometry immediately after DOM mutations?",
    shortAnswer: "When JavaScript writes styles and then immediately reads geometric properties (like offsetHeight or getBoundingClientRect), the browser cannot defer layout and is forced to recalculate layout synchronously on the main thread.",
    detailedExplanation: "- **Normal Pipeline**: The browser batches style calculations and layouts until the end of the current microtask/macro-frame.\n- **Forced Sync**: Reading `element.offsetHeight` forces an immediate synchronous reflow to compute up-to-date pixels.\n- **Thrashing Loop**: Repeating write-read cycles inside a loop turns an O(1) layout calculation into an O(N) blocking disaster.",
    codeExample: "// BAD (Layout Thrashing - 100 forced reflows):\nfor (const box of boxes) {\n  box.style.width = '100px';\n  console.log(box.offsetHeight); // FORCES SYNCHRONOUS LAYOUT!\n}\n\n// GOOD (Batch Reads, then Batch Writes):\nconst heights = boxes.map(box => box.offsetHeight);\nboxes.forEach(box => box.style.width = '100px');",
    interviewTips: ["Explain the 'read-first, write-second' rule to eliminate forced synchronous layouts."]
  },
  {
    topic: "Node Creation & Insertion",
    subtopic: "cloneNode ID Duplication Hazards",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "What subtle bugs occur when cloning elements with id attributes and how must they be sanitized?",
    shortAnswer: "Cloning elements with `id` attributes produces illegal duplicate IDs in the document, breaking `document.getElementById()`, label-input associations, and ARIA relationships.",
    detailedExplanation: "- **Invalid HTML**: HTML specification requires `id` values to be unique within a document.\n- **getElementById Breakdown**: `document.getElementById('id')` will only return the first matching element, ignoring clones.\n- **Sanitization**: Before inserting cloned subtrees, loop through all elements with `[id]` and either strip the ID or assign a unique prefixed/counter ID.",
    codeExample: "function cloneCardSafely(templateCard, uniqueId) {\n  const clone = templateCard.cloneNode(true);\n  \n  // Strip or update duplicate IDs on root and descendants:\n  clone.removeAttribute('id');\n  clone.querySelectorAll('[id]').forEach(el => {\n    el.id = `${el.id}_${uniqueId}`;\n  });\n  \n  return clone;\n}",
    interviewTips: ["Always mention sanitizing `id` and `name` attributes when cloning DOM templates."]
  },
  {
    topic: "Styles, Classes & CSS OM",
    subtopic: "CSSStyleDeclaration setProperty vs Inline Assignment",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "Why does element.style.setProperty() support CSS variables while direct property assignment (element.style['--var']) fails in standard browsers?",
    shortAnswer: "DOM style property accessors are mapped to IDL attributes that only reflect standard camelCase CSS properties, while custom properties (starting with '--') are explicitly defined in the specification to only be accessible via getPropertyValue() and setProperty().",
    detailedExplanation: "- **IDL Mapping**: The WebIDL specification maps properties like `element.style.color` or `element.style.fontSize` directly to CSS declarations.\n- **CSS Variable Exclusion**: Dashed custom property names are not exposed as direct IDL properties on `CSSStyleDeclaration`.\n- **Standards Compliance**: Always use `setProperty('--custom-var', value)` for CSS variables across all browsers.",
    codeExample: "const card = document.querySelector('.card');\n\n// Invalid in standard CSSOM:\n// card.style['--card-bg'] = '#1e293b';\n\n// Valid across all modern browsers:\ncard.style.setProperty('--card-bg', '#1e293b');",
    interviewTips: ["Direct assignment to `element.style['--var']` is a common mistake: remind the interviewer that `setProperty` is required for custom CSS properties."]
  }
];
