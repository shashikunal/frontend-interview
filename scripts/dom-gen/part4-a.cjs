// scripts/dom-gen/part4-a.cjs
// 40 Unique Questions on Event Types & User Interactions
// Distribution: 10 EASY, 20 INTERMEDIATE, 10 DIFFICULT

module.exports = [
  // --- 10 EASY Questions ---
  {
    topic: "Event Types & Interactions",
    subtopic: "Keyboard event.key vs event.code",
    difficulty: "EASY",
    questionType: "COMPARISON",
    question: "What is the difference between event.key and event.code in keyboard events?",
    shortAnswer: "`event.key` represents the printed character produced by the key press (considering language layout and Shift state), whereas `event.code` represents the physical physical hardware key on the keyboard.",
    detailedExplanation: "- **event.key**: Value changes based on Shift, CapsLock, and keyboard language (e.g. `'a'` vs `'A'`).\n- **event.code**: Fixed string identifying the physical key location (e.g. `'KeyQ'`, `'Digit1'`, `'Space'`).\n- **Gaming vs Text**: Use `event.code` for game controls (WASD physical layout) and `event.key` for text input and hotkeys.",
    codeExample: "window.addEventListener('keydown', (e) => {\n  console.log('Character typed (key):', e.key);\n  console.log('Physical button (code):', e.code);\n});",
    interviewTips: ["Use this rule of thumb: `event.code` for physical keyboard position (like WASD game navigation), `event.key` for typed text."]
  },
  {
    topic: "Event Types & Interactions",
    subtopic: "Detecting Modifier Keys",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you detect if Shift, Alt, Ctrl, or Meta keys were held down during an event?",
    shortAnswer: "Inspect the boolean properties `event.shiftKey`, `event.altKey`, `event.ctrlKey`, and `event.metaKey` on the event object.",
    detailedExplanation: "- **Cross-Platform Meta**: `event.metaKey` corresponds to the Command (Cmd) key on macOS and the Windows key on PC.\n- **Keyboard Shortcuts**: Detect combinations like Ctrl+S or Cmd+K for app search triggers.\n- **Mouse Clicks**: Modifier properties are also available on mouse events (e.g. Shift+Click multi-select).",
    codeExample: "window.addEventListener('keydown', (e) => {\n  // Detects Cmd+K (Mac) or Ctrl+K (Windows/Linux):\n  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {\n    e.preventDefault();\n    openCommandPalette();\n  }\n});",
    interviewTips: ["Always check `e.metaKey || e.ctrlKey` to support both macOS Cmd and Windows/Linux Ctrl shortcuts."]
  },
  {
    topic: "Event Types & Interactions",
    subtopic: "Mouse Button Property",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you determine which mouse button was pressed during a mousedown or mouseup event?",
    shortAnswer: "Read `event.button`: `0` indicates the main/left button, `1` indicates the auxiliary/middle wheel button, and `2` indicates the secondary/right button.",
    detailedExplanation: "- **Values**: 0 = Left click, 1 = Middle click (scroll wheel), 2 = Right click, 3 = Back browser button, 4 = Forward browser button.\n- **event.buttons**: In contrast, `event.buttons` returns a bitmask of all buttons currently being held down simultaneously.\n- **Left Click Check**: Always check `if (e.button === 0)` when building custom drag-and-drop handles.",
    codeExample: "document.addEventListener('mousedown', (e) => {\n  if (e.button === 0) console.log('Left click');\n  else if (e.button === 1) console.log('Middle wheel click');\n  else if (e.button === 2) console.log('Right click');\n});",
    interviewTips: ["Remember: `event.button` is a single integer for the button that changed state; `event.buttons` is a bitmask of all held buttons."]
  },
  {
    topic: "Event Types & Interactions",
    subtopic: "Preventing Right-Click Context Menu",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you disable or replace the default browser right-click context menu with a custom menu?",
    shortAnswer: "Listen for the `contextmenu` event and invoke `event.preventDefault()` to suppress the default OS menu.",
    detailedExplanation: "- **contextmenu Event**: Fires immediately before the browser context menu displays.\n- **Custom UI**: After calling `preventDefault()`, position your custom menu element at `(event.clientX, event.clientY)`.\n- **Accessibility**: Provide keyboard alternatives so keyboard users can still access the actions.",
    codeExample: "const canvasArea = document.querySelector('#canvas-board');\n\ncanvasArea.addEventListener('contextmenu', (e) => {\n  e.preventDefault(); // Suppresses default browser menu\n  showCustomContextMenu(e.clientX, e.clientY);\n});",
    interviewTips: ["Warn that blanket disabling of right-click across an entire website degrades user experience and accessibility."]
  },
  {
    topic: "Event Types & Interactions",
    subtopic: "Mouse Coordinates: clientX/Y vs pageX/Y",
    difficulty: "EASY",
    questionType: "COMPARISON",
    question: "What is the difference between clientX/Y and pageX/Y in mouse events?",
    shortAnswer: "`clientX/Y` coordinates are relative to the currently visible browser viewport, while `pageX/Y` coordinates are relative to the entire HTML document including scrolled-out areas.",
    detailedExplanation: "- **No Scroll**: When the page is at scroll position 0, `clientX === pageX` and `clientY === pageY`.\n- **With Scroll**: `pageY = clientY + window.scrollY`.\n- **Fixed vs Absolute Positioning**: Use `clientX/Y` for elements with `position: fixed` and `pageX/Y` for `position: absolute`.",
    codeExample: "document.addEventListener('click', (e) => {\n  console.log(`Viewport: (${e.clientX}, ${e.clientY})`);\n  console.log(`Document: (${e.pageX}, ${e.pageY})`);\n});",
    interviewTips: ["Explain the scroll formula clearly: `pageY = clientY + window.scrollY`."]
  },
  {
    topic: "Event Types & Interactions",
    subtopic: "document.activeElement",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you find out which element currently has keyboard focus on the page?",
    shortAnswer: "Read `document.activeElement`, which returns the DOM element that currently holds focus, or `document.body` if no element has focus.",
    detailedExplanation: "- **Focus Tracking**: Essential for accessibility audits, keyboard focus traps, and modal management.\n- **Focus Restoration**: Save `const prevFocused = document.activeElement` before opening a modal, then call `prevFocused.focus()` when closing.\n- **Shadow DOM**: If the focused element is inside a Shadow Root, `document.activeElement` returns the host element.",
    codeExample: "const currentFocus = document.activeElement;\nconsole.log('Currently focused tag:', currentFocus.tagName);\n\n// Check if user is typing in any text field:\nconst isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);",
    interviewTips: ["Demonstrate how `document.activeElement` is used to restore focus when closing dialog modals."]
  },
  {
    topic: "Event Types & Interactions",
    subtopic: "tabindex Attribute Usage",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What do tabindex='0', tabindex='-1', and positive tabindex values mean?",
    shortAnswer: "`tabindex='0'` includes the element in natural keyboard tab order; `tabindex='-1'` makes it programmatically focusable via JavaScript without putting it in tab order; positive numbers force an explicit tab order.",
    detailedExplanation: "- **tabindex='0'**: Makes non-interactive elements (like custom `<div>` buttons) reachable via keyboard Tab key.\n- **tabindex='-1'**: Used for dropdown containers, modal dialogs, and errors so `element.focus()` can focus them via script.\n- **Positive values (>0)**: Strongly discouraged as an accessibility anti-pattern because they disrupt natural document reading order.",
    codeExample: "<!-- Custom button made keyboard reachable: -->\n<div role=\"button\" tabindex=\"0\" id=\"custom-btn\">Click Me</div>\n\n<!-- Modal made programmatically focusable for screen readers: -->\n<div role=\"dialog\" tabindex=\"-1\" id=\"modal-popup\">...</div>",
    interviewTips: ["Always advise against positive `tabindex` values (>0) because they break natural accessibility flow."]
  },
  {
    topic: "Event Types & Interactions",
    subtopic: "Clipboard API: navigator.clipboard.writeText",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What is the modern standard way to copy text to the user's clipboard using JavaScript?",
    shortAnswer: "Call `navigator.clipboard.writeText('text to copy')`, which returns a Promise that resolves when the text is successfully copied.",
    detailedExplanation: "- **Asynchronous API**: Non-blocking Promise-based API replacing the legacy `document.execCommand('copy')`.\n- **Secure Context**: Requires HTTPS (or localhost) and must be triggered by an active user gesture (`isTrusted === true`).\n- **Error Handling**: Always catch rejected promises in case permission is denied by the user's browser policy.",
    codeExample: "async function copyShareLink(url) {\n  try {\n    await navigator.clipboard.writeText(url);\n    showToast('Link copied to clipboard!');\n  } catch (err) {\n    console.error('Failed to copy text: ', err);\n  }\n}",
    interviewTips: ["Mention that `navigator.clipboard.writeText` replaced the deprecated `document.execCommand('copy')`."]
  },
  {
    topic: "Event Types & Interactions",
    subtopic: "Wheel Event deltaY Direction",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you detect whether the user is scrolling up or down using the wheel event?",
    shortAnswer: "Check `event.deltaY`: a positive value (`> 0`) indicates scrolling down, while a negative value (`< 0`) indicates scrolling up.",
    detailedExplanation: "- **deltaY > 0**: Scrolling down (away from the user).\n- **deltaY < 0**: Scrolling up (toward the user).\n- **Horizontal Scroll**: `event.deltaX` reports horizontal scroll trackpad movements.\n- **deltaMode**: Indicates units: 0 (pixels), 1 (lines), or 2 (pages).",
    codeExample: "window.addEventListener('wheel', (e) => {\n  if (e.deltaY > 0) {\n    console.log('Scrolling down');\n  } else if (e.deltaY < 0) {\n    console.log('Scrolling up');\n  }\n}, { passive: true });",
    interviewTips: ["Delta values: positive is down, negative is up. Always attach wheel listeners with `{ passive: true }`."]
  },
  {
    topic: "Event Types & Interactions",
    subtopic: "Form reset Event",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What triggers the form reset event and how can you cancel it?",
    shortAnswer: "The `reset` event fires when a `<button type=\"reset\">` is clicked or `form.reset()` is invoked; calling `event.preventDefault()` cancels the reset action.",
    detailedExplanation: "- **Restores Initial Values**: Reverts all form inputs to their original default values from HTML markup (not necessarily empty).\n- **Confirmation Prompt**: Commonly used to show a 'Discard changes?' confirmation dialog before wiping user input.\n- **Bubbling**: The `reset` event bubbles up through parent containers.",
    codeExample: "const form = document.querySelector('#edit-profile');\n\nform.addEventListener('reset', (e) => {\n  const confirmed = confirm('Are you sure you want to discard unsaved edits?');\n  if (!confirmed) {\n    e.preventDefault(); // Prevents form fields from resetting\n  }\n});",
    interviewTips: ["Clarify that resetting a form restores HTML default values, which is different from clearing fields completely."]
  },

  // --- 20 INTERMEDIATE Questions ---
  {
    topic: "Event Types & Interactions",
    subtopic: "Drag and Drop: Required Event Sequence",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "Why must you call event.preventDefault() inside a dragover event listener to allow dropping?",
    shortAnswer: "By default, browsers reject drop operations on DOM elements. Calling `event.preventDefault()` inside the `dragover` handler signals to the browser engine that the target is a valid drop destination.",
    detailedExplanation: "- **Browser Default**: Default behavior shows the 'not-allowed' cursor and cancels the drop.\n- **dragover Requirement**: Without `e.preventDefault()` on `dragover`, the subsequent `drop` event will never fire.\n- **Data Transfer**: Access payloads transferred via `e.dataTransfer.getData('text/plain')` in the `drop` handler.",
    codeExample: "const dropZone = document.querySelector('#drop-zone');\n\ndropZone.addEventListener('dragover', (e) => {\n  e.preventDefault(); // MANDATORY: Allows the drop event to occur\n  dropZone.classList.add('drag-active');\n});\n\ndropZone.addEventListener('drop', (e) => {\n  e.preventDefault();\n  const data = e.dataTransfer.getData('text/plain');\n  console.log('Dropped item data:', data);\n});",
    interviewTips: ["This is a classic question: dropping fails 100% of the time if `e.preventDefault()` is omitted on `dragover`."]
  },
  {
    topic: "Event Types & Interactions",
    subtopic: "Pointer Events vs Mouse/Touch Events",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    question: "What is the advantage of using Pointer Events over separate Mouse and Touch events?",
    shortAnswer: "Pointer Events unify all input devices (mouse, touchscreen, digital stylus/pen) into a single hardware-agnostic API, eliminating duplicated mouse/touch code and synthetic click delays.",
    detailedExplanation: "- **Unified Model**: Handles `pointerdown`, `pointerup`, `pointermove` across all input modalities.\n- **Device Metadata**: Exposes hardware details like `pointerType` ('mouse', 'touch', 'pen'), `pressure` (0.0 to 1.0 for styluses), and `tiltX/tiltY`.\n- **Pointer Capture**: Supports capturing all pointer movements to a single element even when dragging outside browser boundaries.",
    codeExample: "canvas.addEventListener('pointerdown', (e) => {\n  console.log(`Input from: ${e.pointerType}, Pressure: ${e.pressure}`);\n});",
    interviewTips: ["Highlight Pointer Events as modern web standard best practice over maintaining separate touch and mouse handlers."]
  },
  {
    topic: "Event Types & Interactions",
    subtopic: "element.setPointerCapture()",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "What is element.setPointerCapture() and why is it essential for custom slider and drag handles?",
    shortAnswer: "`element.setPointerCapture(pointerId)` redirects all subsequent pointer events to that element, even if the cursor moves outside the element or browser window during a drag.",
    detailedExplanation: "- **No Missed Events**: Prevents losing track of fast mouse movements that escape the slider thumb boundary.\n- **Automatic Release**: Automatically releases capture on `pointerup` or `pointercancel`, or manually via `releasePointerCapture()`.\n- **Clean Code**: Eliminates the fragile old pattern of attaching `mousemove` to `window` on mousedown and unbinding on mouseup.",
    codeExample: "const thumb = document.querySelector('.slider-thumb');\n\nthumb.addEventListener('pointerdown', (e) => {\n  thumb.setPointerCapture(e.pointerId); // Captures all pointer movements\n});\n\nthumb.addEventListener('pointermove', (e) => {\n  if (thumb.hasPointerCapture(e.pointerId)) {\n    updateSliderPosition(e.clientX);\n  }\n});",
    interviewTips: ["Contrast `setPointerCapture` with the messy old practice of attaching temporary `mousemove` listeners to `window`."]
  },
  {
    topic: "Event Types & Interactions",
    subtopic: "Touch Events: touches vs targetTouches vs changedTouches",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    question: "What are the differences between event.touches, event.targetTouches, and event.changedTouches in touch events?",
    shortAnswer: "`touches` lists all fingers currently touching the screen; `targetTouches` lists fingers touching the target element; `changedTouches` lists fingers whose state changed in this event.",
    detailedExplanation: "- **touches**: Global list of every finger currently in contact with the surface.\n- **targetTouches**: Filtered subset of fingers touching the element that received the event.\n- **changedTouches**: Only the touches that triggered this specific event (e.g. for `touchend`, `touches` is empty, but `changedTouches` contains the finger that lifted).",
    codeExample: "element.addEventListener('touchend', (e) => {\n  // e.touches may be empty (0 fingers left)!\n  // Read the finger that just lifted from changedTouches:\n  const liftedFinger = e.changedTouches[0];\n  console.log('Finger lifted at:', liftedFinger.clientX, liftedFinger.clientY);\n});",
    interviewTips: ["Always remember: in `touchend`, `e.touches` has already lost the lifted finger, so you must use `e.changedTouches`!"]
  },
  {
    topic: "Event Types & Interactions",
    subtopic: "Handling Composition Events (IME Input)",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What are compositionstart and compositionend events and why are they critical for international text input?",
    shortAnswer: "Composition events manage Input Method Editors (IME) for languages like Chinese, Japanese, and Korean, allowing scripts to pause live search or validation until character composition is confirmed.",
    detailedExplanation: "- **IME Process**: Users type phonetic syllables, select candidate characters from a popup, and press Enter to finalize the word.\n- **Input Event Trap**: `input` fires on every unconfirmed keystroke during composition, sending broken phonetic fragments to search APIs.\n- **Solution**: Flag `isComposing = true` on `compositionstart` and `false` on `compositionend` to defer actions.",
    codeExample: "let isComposing = false;\nconst searchInput = document.querySelector('#search');\n\nsearchInput.addEventListener('compositionstart', () => isComposing = true);\nsearchInput.addEventListener('compositionend', () => {\n  isComposing = false;\n  triggerSearch(searchInput.value); // Trigger once finalized\n});\n\nsearchInput.addEventListener('input', () => {\n  if (!isComposing) triggerSearch(searchInput.value);\n});",
    interviewTips: ["Mentioning IME composition handling shows seniority and global-readiness in frontend engineering interviews."]
  },
  {
    topic: "Event Types & Interactions",
    subtopic: "scrollend Event",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is the native scrollend event and how does it improve on scroll debounce timeouts?",
    shortAnswer: "`scrollend` fires natively when a scrolling operation has completely finished, including inertial smooth scrolls and fling animations, without needing guess-based setTimeout debounce timers.",
    detailedExplanation: "- **Precise Completion**: Fires only when the viewport or container has fully settled at its final pixel position.\n- **No Timer Guessing**: Eliminates fragile patterns like `clearTimeout(timer); timer = setTimeout(..., 150)`.\n- **Browser Support**: Native in modern Chromium, Firefox, and Safari.",
    codeExample: "window.addEventListener('scrollend', () => {\n  console.log('Scroll completely stopped. Safe to fetch next batch of items.');\n  loadNextPage();\n});",
    interviewTips: ["Contrast `scrollend` with legacy scroll debounce timers that often fire prematurely during inertial touchpad scrolling."]
  },
  {
    topic: "Event Types & Interactions",
    subtopic: "Preventing Paste in Security Inputs",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you intercept or modify pasted data in a text input using the paste event?",
    shortAnswer: "Listen for the `paste` event, extract clipboard contents via `event.clipboardData.getData('text/plain')`, and invoke `event.preventDefault()` to customize insertion.",
    detailedExplanation: "- **Clipboard Data Access**: `event.clipboardData` provides access to text, HTML, and file blobs from the OS clipboard.\n- **Sanitization**: Allows stripping non-digits when users paste account or credit card numbers.\n- **Multi-Box OTP**: Automatically splits a pasted 6-digit OTP across 6 separate single-digit input boxes.",
    codeExample: "const otpInput = document.querySelector('.otp-first');\n\notpInput.addEventListener('paste', (e) => {\n  e.preventDefault();\n  const pastedText = e.clipboardData.getData('text/plain').trim();\n  if (/^\\d{6}$/.test(pastedText)) {\n    distributeOtpAcrossBoxes(pastedText);\n  }\n});",
    interviewTips: ["Use the 6-digit OTP paste distribution use case as a real-world example of handling the `paste` event."]
  },
  {
    topic: "Forms & Interactive Components",
    subtopic: "FormData API Usage",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you use the FormData API to extract all values from an HTML form in JavaScript?",
    shortAnswer: "Pass the form element to `new FormData(formElement)`, which automatically collects all named input, select, and textarea values.",
    detailedExplanation: "- **Named Fields Only**: Only form controls with a valid `name` attribute are collected.\n- **File Uploads**: Automatically handles `<input type=\"file\">` attachments as File blobs.\n- **Fetch Integration**: Pass `formData` directly as the `body` in `fetch(url, { method: 'POST', body: formData })`—the browser sets the `multipart/form-data` header with proper boundaries automatically.",
    codeExample: "const form = document.querySelector('#contact-form');\n\nform.addEventListener('submit', async (e) => {\n  e.preventDefault();\n  const data = new FormData(form);\n  \n  // Convert to plain object if sending JSON:\n  const jsonPayload = Object.fromEntries(data.entries());\n  console.log('Submitting payload:', jsonPayload);\n});",
    interviewTips: ["Never manually set `Content-Type: multipart/form-data` header when sending `FormData` via `fetch()`; the browser must generate the boundary string automatically."]
  },
  {
    topic: "Forms & Interactive Components",
    subtopic: "HTML5 Constraint Validation: checkValidity vs reportValidity",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    question: "What is the difference between element.checkValidity() and element.reportValidity()?",
    shortAnswer: "`checkValidity()` returns a boolean indicating whether the input passes validation without altering the UI, while `reportValidity()` returns the boolean AND triggers the native browser error popup balloon.",
    detailedExplanation: "- **checkValidity()**: Silent check; returns `true`/`false` and fires an `invalid` event on failure if unhandled.\n- **reportValidity()**: Active check; returns `true`/`false`, highlights the failing field, focuses it, and shows the browser error tooltip.\n- **Container Level**: Both methods can be called on individual `<input>` fields or on the entire `<form>` element.",
    codeExample: "const form = document.querySelector('form');\nconst submitBtn = document.querySelector('#custom-submit');\n\nsubmitBtn.addEventListener('click', () => {\n  // Checks validation and displays native browser error tooltips:\n  if (!form.reportValidity()) {\n    console.log('Form has validation errors');\n  }\n});",
    interviewTips: ["Remember: `checkValidity` is silent; `reportValidity` shows the native browser validation bubble."]
  },
  {
    topic: "Forms & Interactive Components",
    subtopic: "Custom Validation with setCustomValidity",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you set a custom validation error message on an input using the DOM Constraint Validation API?",
    shortAnswer: "Call `input.setCustomValidity('Custom message')` to mark the field invalid; call `input.setCustomValidity('')` (empty string) to clear the error and restore valid status.",
    detailedExplanation: "- **Empty String Clears**: Passing an empty string `''` marks the field as valid again.\n- **blocks Submission**: As long as `customError` is active, form submission is blocked.\n- **validity.customError**: Sets `input.validity.customError = true` while a non-empty message is set.",
    codeExample: "const password = document.querySelector('#password');\nconst confirmPassword = document.querySelector('#confirm');\n\nconfirmPassword.addEventListener('input', () => {\n  if (confirmPassword.value !== password.value) {\n    confirmPassword.setCustomValidity('Passwords do not match.');\n  } else {\n    confirmPassword.setCustomValidity(''); // Resets to valid state\n  }\n});",
    interviewTips: ["Always stress that passing `''` (empty string) to `setCustomValidity` is required to make the input valid again."]
  },
  {
    topic: "Forms & Interactive Components",
    subtopic: "Checkbox Indeterminate State",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "What is the indeterminate state of an HTML checkbox and how is it controlled via JavaScript?",
    shortAnswer: "The `indeterminate` state displays a dash/horizontal bar indicating a partially selected state (e.g. some subtasks selected) and can ONLY be set via the JavaScript property `checkbox.indeterminate = true`.",
    detailedExplanation: "- **No HTML Attribute**: There is no `<input type=\"checkbox\" indeterminate>` attribute; it exists strictly as a JavaScript property.\n- **Value Independence**: Does not affect the `checked` property value submitted with forms.\n- **CSS Pseudo-class**: Matches the `:indeterminate` CSS pseudo-class for custom visual styling.",
    codeExample: "const parentCheckbox = document.querySelector('#select-all');\nconst childCheckboxes = document.querySelectorAll('.child-check');\n\nfunction updateParentState() {\n  const checkedCount = [...childCheckboxes].filter(c => c.checked).length;\n  if (checkedCount === 0) {\n    parentCheckbox.checked = false;\n    parentCheckbox.indeterminate = false;\n  } else if (checkedCount === childCheckboxes.length) {\n    parentCheckbox.checked = true;\n    parentCheckbox.indeterminate = false;\n  } else {\n    parentCheckbox.checked = false;\n    parentCheckbox.indeterminate = true; // Partially selected!\n  }\n}",
    interviewTips: ["Key interview fact: `indeterminate` has no HTML attribute representation; it can only be set via DOM property."]
  },
  {
    topic: "Forms & Interactive Components",
    subtopic: "HTML5 Dialog Element: show() vs showModal()",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    question: "What is the difference between dialog.show() and dialog.showModal() in the HTML5 Dialog API?",
    shortAnswer: "`dialog.show()` opens a modeless dialog without backdrop or focus trap, whereas `dialog.showModal()` opens a modal dialog in the browser Top Layer, renders a ::backdrop, and traps keyboard focus.",
    detailedExplanation: "- **Top Layer**: `showModal()` places the dialog above all `z-index` stacks in the browser engine's Top Layer.\n- **Backdrop Styling**: Enables styling via the `dialog::backdrop` CSS pseudo-element.\n- **Accessibility**: Automatically handles focus trapping and closes when the user presses `Escape`.\n- **Modal Blocking**: Disables interaction with the rest of the document (`inert` background).",
    codeExample: "const dialog = document.querySelector('dialog');\nconst openBtn = document.querySelector('#open-dialog');\nconst closeBtn = document.querySelector('#close-dialog');\n\nopenBtn.addEventListener('click', () => dialog.showModal());\ncloseBtn.addEventListener('click', () => dialog.close());",
    interviewTips: ["Highlight `dialog.showModal()` as the native standard for modals that eliminates custom focus traps and z-index fighting."]
  },
  {
    topic: "Forms & Interactive Components",
    subtopic: "HTML Popover API",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is the native HTML Popover API and how does it simplify tooltips and popups without JavaScript?",
    shortAnswer: "The Popover API provides native declarative popup behaviors using the `popover` attribute on the target and `popovertarget` on the trigger button, automatically handling top-layer rendering, light dismiss, and Esc key dismissal.",
    detailedExplanation: "- **Declarative UI**: Works without JavaScript using `<button popovertarget=\"menu\">` and `<div id=\"menu\" popover>`.\n- **Light Dismiss**: Automatically closes when clicking outside the popover without custom document click handlers.\n- **Programmatic Control**: Methods `element.showPopover()`, `element.hidePopover()`, and `element.togglePopover()`.\n- **Top Layer**: Renders above all other elements without `z-index` conflicts.",
    codeExample: "<!-- Declarative HTML Popover without custom JS: -->\n<button popovertarget=\"user-menu\">Menu</button>\n<div id=\"user-menu\" popover>\n  <p>Profile Details</p>\n  <button>Sign Out</button>\n</div>",
    interviewTips: ["Mention the Popover API as a modern web standard replacing heavy tooltip and dropdown libraries."]
  },
  {
    topic: "Forms & Interactive Components",
    subtopic: "HTML inert Attribute",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What does the HTML inert attribute do and how does it assist in building accessible modals?",
    shortAnswer: "The `inert` boolean attribute tells the browser engine to ignore user input, click events, and assistive technology for an entire DOM subtree, effectively removing it from tab navigation and screen readers.",
    detailedExplanation: "- **Accessible Focus Trapping**: Applying `inert` to the background main container when a modal is open prevents screen readers and Tab key from escaping the modal.\n- **Pointer Events**: Automatically sets `pointer-events: none` and `user-select: none` behavior internally.\n- **Native Replacement**: Replaces cumbersome manual tabindex manipulations on all page elements.",
    codeExample: "const mainApp = document.querySelector('#main-content');\nconst modal = document.querySelector('#modal');\n\nfunction openModal() {\n  modal.classList.add('open');\n  mainApp.setAttribute('inert', ''); // Traps focus in modal by disabling main content\n}\n\nfunction closeModal() {\n  modal.classList.remove('open');\n  mainApp.removeAttribute('inert');\n}",
    interviewTips: ["Mention `inert` as the modern web standard way to create foolproof accessible modal focus traps."]
  },
  {
    topic: "Event Types & Interactions",
    subtopic: "Handling File Uploads via FileReader API",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you preview an image selected in an <input type=\"file\"> before uploading it to a server?",
    shortAnswer: "Read the `fileInput.files[0]` using `URL.createObjectURL(file)` or `FileReader.readAsDataURL(file)` and assign the result to an `<img>` tag's `src`.",
    detailedExplanation: "- **URL.createObjectURL**: Synchronous, fast, and memory-efficient; generates a temporary `blob:` URL referencing the file in browser memory.\n- **Revoking URL**: Call `URL.revokeObjectURL(url)` when the image finishes loading to release memory.\n- **FileReader**: Converts to a base64 Data URL string; better if you need to store or serialize the string directly.",
    codeExample: "const fileInput = document.querySelector('#avatar');\nconst previewImg = document.querySelector('#preview');\n\nfileInput.addEventListener('change', () => {\n  const file = fileInput.files[0];\n  if (file) {\n    // Fast, modern blob URL preview:\n    previewImg.src = URL.createObjectURL(file);\n    previewImg.onload = () => URL.revokeObjectURL(previewImg.src);\n  }\n});",
    interviewTips: ["Recommend `URL.createObjectURL()` over `FileReader` for image previews due to lower memory overhead and instant execution."]
  },
  {
    topic: "Event Types & Interactions",
    subtopic: "Keyboard Event repeat Property",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is the event.repeat property in keyboard events and how does it prevent unwanted repeated action dispatches?",
    shortAnswer: "`event.repeat` is a boolean that is `true` if the key is being held down and auto-repeating, and `false` for the initial keystroke.",
    detailedExplanation: "- **Key Hold Behavior**: Operating systems repeatedly fire `keydown` when a user holds down a key.\n- **Single Trigger Actions**: For actions that should only execute once per press (e.g. opening a modal, firing a weapon in a game, submitting a form), check `if (e.repeat) return;`.\n- **Performance**: Prevents flooding your application with hundreds of redundant event loops.",
    codeExample: "window.addEventListener('keydown', (e) => {\n  if (e.repeat) return; // Ignores held-down repeated keydown events\n  if (e.key === ' ') {\n    toggleAudioPlayback();\n  }\n});",
    interviewTips: ["Mention `e.repeat` when discussing game controls or single-trigger shortcuts like opening search dialogs."]
  },
  {
    topic: "Forms & Interactive Components",
    subtopic: "Reading Radio Button Group Selection",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you retrieve the selected value of a radio button group using modern query selectors?",
    shortAnswer: "Use `document.querySelector('input[name=\"groupName\"]:checked')?.value`.",
    detailedExplanation: "- **CSS Pseudo-Selector**: `:checked` filters for only the active radio button in the specified group.\n- **Optional Chaining**: Safe navigation with `?.` prevents errors if the user hasn't made a selection yet.\n- **No Loop Required**: Eliminates iterating over a NodeList of radio inputs with `for...of`.",
    codeExample: "function getSelectedShippingMethod() {\n  const selectedRadio = document.querySelector('input[name=\"shipping\"]:checked');\n  return selectedRadio ? selectedRadio.value : 'standard';\n}",
    interviewTips: ["Highlight `querySelector('input[name=\"...\"]:checked')` as the cleanest single-line idiom for reading radio groups."]
  },
  {
    topic: "Event Types & Interactions",
    subtopic: "beforeunload Event Warnings",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you prompt the user with a confirmation warning before they navigate away with unsaved form changes?",
    shortAnswer: "Attach a listener to `window.addEventListener('beforeunload', ...)` and call `event.preventDefault()` while setting `event.returnValue = ''`.",
    detailedExplanation: "- **Standard Requirements**: Both `event.preventDefault()` and `event.returnValue = ''` are required across different browser engines.\n- **Generic Browser Dialog**: Modern browsers display a standardized security warning; custom string messages are ignored to prevent phishing.\n- **Dynamic Guard**: Only attach the listener when changes are dirty; remove it once saved.",
    codeExample: "let isFormDirty = false;\n\nwindow.addEventListener('beforeunload', (e) => {\n  if (isFormDirty) {\n    e.preventDefault();\n    e.returnValue = ''; // Prompts native 'Leave site? Changes you made may not be saved.'\n  }\n});",
    interviewTips: ["Note that browsers no longer display custom string messages in `beforeunload` to prevent deceptive phishing messages."]
  },
  {
    topic: "Forms & Interactive Components",
    subtopic: "HTML5 Details & Summary toggle Event",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you detect when a native <details> accordion element is expanded or collapsed?",
    shortAnswer: "Listen for the `toggle` event on the `<details>` element and check the `details.open` boolean property.",
    detailedExplanation: "- **toggle Event**: Fires whenever the open/closed disclosure state changes.\n- **Boolean Property**: `details.open === true` when expanded, and `false` when collapsed.\n- **Lazy Loading**: Perfect for fetching accordion content over the network only when the user expands the section.",
    codeExample: "const accordion = document.querySelector('details');\n\naccordion.addEventListener('toggle', () => {\n  if (accordion.open) {\n    console.log('Accordion opened: fetching contents...');\n    loadSectionData();\n  } else {\n    console.log('Accordion closed');\n  }\n});",
    interviewTips: ["Mention the native `<details>` and `<summary>` tags as zero-JS accordions that support the `toggle` event."]
  },
  {
    topic: "Forms & Interactive Components",
    subtopic: "Handling select Multiple Selections",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you retrieve an array of all selected values from a multi-select dropdown (<select multiple>)?",
    shortAnswer: "Use `Array.from(selectElement.selectedOptions).map(option => option.value)`.",
    detailedExplanation: "- **selectedOptions**: An HTMLCollection containing only the `<option>` elements currently selected by the user.\n- **Array.from()**: Converts the collection into an array to use functional array methods like `.map()`.\n- **select.value Limitation**: Reading `select.value` directly only returns the first selected option.",
    codeExample: "const multiSelect = document.querySelector('#skills-select');\n\nfunction getSelectedSkills() {\n  return Array.from(multiSelect.selectedOptions, opt => opt.value);\n}",
    interviewTips: ["Never use `select.value` on a multi-select; always use `select.selectedOptions`."]
  },

  // --- 10 DIFFICULT Questions ---
  {
    topic: "Event Types & Interactions",
    subtopic: "Synthetic Click 300ms Delay & FastClick",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "What was the 300ms click delay on mobile browsers, what caused it, and how was it eliminated?",
    shortAnswer: "Mobile browsers waited 300ms after a tap to distinguish a single click from a double-tap to zoom. It was eliminated by adding `<meta name=\"viewport\" content=\"width=device-width\">` or CSS `touch-action: manipulation`.",
    detailedExplanation: "- **Historical Cause**: Mobile Safari introduced double-tap to zoom on desktop pages, needing 300ms to see if a second tap followed.\n- **Modern Fix**: Responsive viewport tag tells mobile engines that the page is mobile-optimized, disabling double-tap zoom and removing the delay.\n- **CSS Fix**: Setting `touch-action: manipulation` tells the engine to only listen for pan and pinch gestures, dropping the click delay immediately.",
    codeExample: "/* Disables double-tap zoom delay on interactive elements: */\nbutton, a, input {\n  touch-action: manipulation;\n}",
    interviewTips: ["Explain both solutions: `<meta name=\"viewport\" content=\"width=device-width\">` and `touch-action: manipulation`."]
  },
  {
    topic: "Event Types & Interactions",
    subtopic: "Drag and Drop DataTransfer API Types",
    difficulty: "DIFFICULT",
    questionType: "CODE",
    question: "How do you securely pass both plain text and structured JSON data across Drag and Drop operations using dataTransfer?",
    shortAnswer: "Set custom MIME types like `dataTransfer.setData('application/json', JSON.stringify(data))` alongside standard `'text/plain'` fallbacks.",
    detailedExplanation: "- **Multi-MIME Types**: `dataTransfer` allows registering multiple data formats for the same drag action.\n- **External Apps**: External desktop apps only understand `'text/plain'` or `'text/uri-list'`.\n- **Internal App State**: Use `'application/json'` to pass complex entity IDs and metadata to drop zones inside your web app.",
    codeExample: "draggableCard.addEventListener('dragstart', (e) => {\n  const payload = { id: 42, type: 'task', column: 'in-progress' };\n  e.dataTransfer.setData('application/json', JSON.stringify(payload));\n  e.dataTransfer.setData('text/plain', `Task #42`);\n  e.dataTransfer.effectAllowed = 'move';\n});\n\ndropColumn.addEventListener('drop', (e) => {\n  e.preventDefault();\n  const raw = e.dataTransfer.getData('application/json');\n  if (raw) {\n    const task = JSON.parse(raw);\n    moveTask(task.id);\n  }\n});",
    interviewTips: ["Mention setting both a structured format (`application/json`) and a fallback (`text/plain`) for resilient DnD."]
  },
  {
    topic: "Event Types & Interactions",
    subtopic: "Virtual Keyboard API",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "What is the Virtual Keyboard API and how does it prevent mobile on-screen keyboards from obscuring fixed UI elements?",
    shortAnswer: "The Virtual Keyboard API (`navigator.virtualKeyboard`) allows JavaScript and CSS env variables (`env(keyboard-inset-height)`) to track on-screen keyboard overlays without resizing the visual viewport.",
    detailedExplanation: "- **overlaysContent**: Setting `navigator.virtualKeyboard.overlaysContent = true` stops the browser from resizing the page layout abruptly.\n- **geometrychange Event**: Fires when the virtual keyboard opens or closes.\n- **CSS Env Variables**: Use `padding-bottom: env(keyboard-inset-height, 0px)` on fixed bottom action bars to keep inputs visible.",
    codeExample: "if ('virtualKeyboard' in navigator) {\n  navigator.virtualKeyboard.overlaysContent = true;\n  navigator.virtualKeyboard.addEventListener('geometrychange', (e) => {\n    const { height } = e.target.boundingRect;\n    adjustFloatingActionBar(height);\n  });\n}",
    interviewTips: ["Discuss the Virtual Keyboard API when asked about advanced mobile web UX and keyboard obscuring problems."]
  },
  {
    topic: "Event Types & Interactions",
    subtopic: "Pointer Lock API",
    difficulty: "DIFFICULT",
    questionType: "CODE",
    question: "What is the Pointer Lock API (element.requestPointerLock()) and how does it differ from setPointerCapture?",
    shortAnswer: "`requestPointerLock()` hides the mouse cursor and provides continuous relative mouse coordinate deltas (`movementX`, `movementY`) without cursor bounds, designed for 3D games and canvas panning.",
    detailedExplanation: "- **Infinite Movement**: The cursor cannot leave the window; movements fire indefinitely with `movementX` and `movementY`.\n- **Pointer Capture vs Lock**: `setPointerCapture` keeps normal cursor tracking during drags; Pointer Lock completely eliminates cursor boundaries and hides the pointer.\n- **User Permission**: Requires a user gesture and shows an OS notification (press Esc to exit).",
    codeExample: "const 3dCanvas = document.querySelector('#viewport');\n\n3dCanvas.addEventListener('click', () => {\n  3dCanvas.requestPointerLock();\n});\n\ndocument.addEventListener('mousemove', (e) => {\n  if (document.pointerLockElement === 3dCanvas) {\n    rotateCamera(e.movementX, e.movementY);\n  }\n});",
    interviewTips: ["Use 3D WebGL games and panoramic image viewers as typical use cases for the Pointer Lock API."]
  },
  {
    topic: "Forms & Interactive Components",
    subtopic: "Custom Form-Associated Elements with ElementInternals",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "How does the ElementInternals API allow custom Web Components to participate in native HTML form submission and validation?",
    shortAnswer: "Calling `this.attachInternals()` inside an autonomous custom element grants access to an `ElementInternals` instance with `setFormValue()`, `setValidity()`, and `form` properties.",
    detailedExplanation: "- **static formAssociated = true**: Must declare this static flag on the Web Component class.\n- **setFormValue(value)**: Sets the value submitted with the parent `<form>` when submitted.\n- **setValidity(flags, message)**: Integrates directly with the browser's native Constraint Validation API.\n- **Zero Wrappers**: Allows building rich custom input components that work identically to native `<input>` tags.",
    codeExample: "class CustomRating extends HTMLElement {\n  static formAssociated = true;\n  constructor() {\n    super();\n    this.internals_ = this.attachInternals();\n  }\n  set rating(val) {\n    this.internals_.setFormValue(val); // Injected into FormData!\n  }\n}\ncustomElements.define('custom-rating', CustomRating);",
    interviewTips: ["Mention `ElementInternals` and `static formAssociated = true` as the modern standard for custom form controls."]
  },
  {
    topic: "Forms & Interactive Components",
    subtopic: "ValidityState Object Flags",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "What specific validation error states are exposed on the input.validity (ValidityState) object?",
    shortAnswer: "`input.validity` exposes granular boolean properties including `valueMissing`, `typeMismatch`, `patternMismatch`, `tooLong`, `tooShort`, `rangeUnderflow`, `rangeOverflow`, `stepMismatch`, `badInput`, `customError`, and `valid`.",
    detailedExplanation: "- **valueMissing**: Triggered when a `required` input is empty.\n- **typeMismatch**: E.g. email or URL syntax is invalid.\n- **patternMismatch**: Fails regex specified in the `pattern` attribute.\n- **customError**: `true` if `setCustomValidity()` was called with a non-empty message.\n- **valid**: True only when all other failure flags are `false`.",
    codeExample: "const email = document.querySelector('input[type=\"email\"]');\n\nif (email.validity.valueMissing) {\n  showError('Email is required.');\n} else if (email.validity.typeMismatch) {\n  showError('Please enter a valid email address.');\n}",
    interviewTips: ["Listing multiple `validity` flags (valueMissing, typeMismatch, patternMismatch) demonstrates thorough form API mastery."]
  },
  {
    topic: "Event Types & Interactions",
    subtopic: "ClipboardItem & Copying Rich Media",
    difficulty: "DIFFICULT",
    questionType: "CODE",
    question: "How do you copy binary image data or rich HTML to the clipboard using navigator.clipboard.write()?",
    shortAnswer: "Create a `new ClipboardItem({ 'image/png': blob })` and pass an array of ClipboardItem objects to `navigator.clipboard.write([item])`.",
    detailedExplanation: "- **navigator.clipboard.write vs writeText**: `writeText` only handles strings; `write()` handles arbitrary binary blobs and rich MIME types.\n- **Supported Types**: PNG images, text/html, and text/plain.\n- **User Gesture**: Must be invoked from an active user interaction; rejected otherwise.",
    codeExample: "async function copyCanvasImage(canvas) {\n  canvas.toBlob(async (blob) => {\n    const item = new ClipboardItem({ 'image/png': blob });\n    await navigator.clipboard.write([item]);\n    console.log('Image copied to clipboard!');\n  }, 'image/png');\n}",
    interviewTips: ["Contrast `navigator.clipboard.write()` for binary blobs (images) with `writeText()` for plain strings."]
  },
  {
    topic: "Forms & Interactive Components",
    subtopic: "FormData Event (formdata)",
    difficulty: "DIFFICULT",
    questionType: "CODE",
    question: "What is the formdata event and how does it allow components to inject custom fields into form submissions?",
    shortAnswer: "The `formdata` event fires on a `<form>` when its data is being gathered (via `new FormData(form)` or submit), allowing listeners to append or modify entries via `event.formData.append()`.",
    detailedExplanation: "- **Decoupled Injection**: Lets independent UI widgets inject their state without having hidden `<input>` elements in the DOM.\n- **Event Object**: Provides `event.formData` directly for manipulation.\n- **Lifecycle**: Fires synchronously right before the form payload is serialized.",
    codeExample: "const form = document.querySelector('#order-form');\n\nform.addEventListener('formdata', (e) => {\n  // Injects client tracking and session data dynamically:\n  e.formData.append('clientTimestamp', Date.now());\n  e.formData.append('themePreference', localStorage.getItem('theme'));\n});",
    interviewTips: ["Mention the `formdata` event as the modern, clean replacement for injecting hidden `<input>` tags into forms."]
  },
  {
    topic: "Event Types & Interactions",
    subtopic: "TouchEvent Cancellation and CSS touch-action",
    difficulty: "DIFFICULT",
    questionType: "PERFORMANCE",
    question: "Why does calling event.preventDefault() in touchstart break mobile scrolling and how does CSS touch-action solve it?",
    shortAnswer: "`preventDefault()` on `touchstart` stops native browser gestures (scrolling and pinch-zoom). Declaring CSS `touch-action: pan-y` allows native vertical scrolling without JavaScript main-thread delays.",
    detailedExplanation: "- **Scroll Stutter**: If JavaScript attaches non-passive touch listeners, the browser compositor must halt scrolling until JavaScript finishes.\n- **Declarative Scrolling**: `touch-action: pan-y` tells the browser compositor to immediately handle vertical scrolling natively without waiting for JS.\n- **Horizontal Swipes**: Ideal for carousel carousels where horizontal swipes are captured by JS while vertical page scrolling remains buttery smooth.",
    codeExample: "/* Allows native vertical page scroll, but routes horizontal swipes to JavaScript: */\n.carousel-track {\n  touch-action: pan-y;\n}",
    interviewTips: ["Always propose CSS `touch-action: pan-y` or `pan-x` over calling `e.preventDefault()` inside touch listeners."]
  },
  {
    topic: "Forms & Interactive Components",
    subtopic: "Handling File Drag and Drop via dataTransfer.files",
    difficulty: "DIFFICULT",
    questionType: "CODE",
    question: "How do you implement a drag-and-drop file upload zone that reads dropped files?",
    shortAnswer: "Inspect `event.dataTransfer.files` in the `drop` event listener after preventing default on both `dragover` and `drop`.",
    detailedExplanation: "- **dataTransfer.files**: Returns a standard `FileList` identical to `fileInput.files`.\n- **Directory Uploads**: Modern browsers support `item.webkitGetAsEntry()` to recursively read folders dropped into the drop zone.\n- **Validation**: Filter dropped files by MIME type (`file.type`) and byte size (`file.size`) before uploading.",
    codeExample: "const dropArea = document.querySelector('#file-drop-zone');\n\n['dragenter', 'dragover'].forEach(name => {\n  dropArea.addEventListener(name, (e) => e.preventDefault());\n});\n\ndropArea.addEventListener('drop', (e) => {\n  e.preventDefault();\n  const files = e.dataTransfer.files;\n  if (files.length > 0) {\n    uploadFiles(files);\n  }\n});",
    interviewTips: ["Emphasize preventing default on BOTH `dragover` and `drop` events to allow file drops."]
  }
];
