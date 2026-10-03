// scripts/dom-gen/part4.cjs
// 80 High-Value, Unique DOM Interview Questions
// Distribution: 20 EASY, 40 INTERMEDIATE, 20 DIFFICULT

module.exports = [
  {
    "topic": "Event Types & Interactions",
    "subtopic": "Keyboard event.key vs event.code",
    "difficulty": "EASY",
    "questionType": "COMPARISON",
    "question": "What is the difference between event.key and event.code in keyboard events?",
    "shortAnswer": "`event.key` represents the printed character produced by the key press (considering language layout and Shift state), whereas `event.code` represents the physical physical hardware key on the keyboard.",
    "detailedExplanation": "- **event.key**: Value changes based on Shift, CapsLock, and keyboard language (e.g. `'a'` vs `'A'`).\n- **event.code**: Fixed string identifying the physical key location (e.g. `'KeyQ'`, `'Digit1'`, `'Space'`).\n- **Gaming vs Text**: Use `event.code` for game controls (WASD physical layout) and `event.key` for text input and hotkeys.",
    "codeExample": "window.addEventListener('keydown', (e) => {\n  console.log('Character typed (key):', e.key);\n  console.log('Physical button (code):', e.code);\n});",
    "interviewTips": [
      "Use this rule of thumb: `event.code` for physical keyboard position (like WASD game navigation), `event.key` for typed text."
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "Detecting Modifier Keys",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "How do you detect if Shift, Alt, Ctrl, or Meta keys were held down during an event?",
    "shortAnswer": "Inspect the boolean properties `event.shiftKey`, `event.altKey`, `event.ctrlKey`, and `event.metaKey` on the event object.",
    "detailedExplanation": "- **Cross-Platform Meta**: `event.metaKey` corresponds to the Command (Cmd) key on macOS and the Windows key on PC.\n- **Keyboard Shortcuts**: Detect combinations like Ctrl+S or Cmd+K for app search triggers.\n- **Mouse Clicks**: Modifier properties are also available on mouse events (e.g. Shift+Click multi-select).",
    "codeExample": "window.addEventListener('keydown', (e) => {\n  // Detects Cmd+K (Mac) or Ctrl+K (Windows/Linux):\n  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {\n    e.preventDefault();\n    openCommandPalette();\n  }\n});",
    "interviewTips": [
      "Always check `e.metaKey || e.ctrlKey` to support both macOS Cmd and Windows/Linux Ctrl shortcuts."
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "Mouse Button Property",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "How do you determine which mouse button was pressed during a mousedown or mouseup event?",
    "shortAnswer": "Read `event.button`: `0` indicates the main/left button, `1` indicates the auxiliary/middle wheel button, and `2` indicates the secondary/right button.",
    "detailedExplanation": "- **Values**: 0 = Left click, 1 = Middle click (scroll wheel), 2 = Right click, 3 = Back browser button, 4 = Forward browser button.\n- **event.buttons**: In contrast, `event.buttons` returns a bitmask of all buttons currently being held down simultaneously.\n- **Left Click Check**: Always check `if (e.button === 0)` when building custom drag-and-drop handles.",
    "codeExample": "document.addEventListener('mousedown', (e) => {\n  if (e.button === 0) console.log('Left click');\n  else if (e.button === 1) console.log('Middle wheel click');\n  else if (e.button === 2) console.log('Right click');\n});",
    "interviewTips": [
      "Remember: `event.button` is a single integer for the button that changed state; `event.buttons` is a bitmask of all held buttons."
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "Preventing Right-Click Context Menu",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "How do you disable or replace the default browser right-click context menu with a custom menu?",
    "shortAnswer": "Listen for the `contextmenu` event and invoke `event.preventDefault()` to suppress the default OS menu.",
    "detailedExplanation": "- **contextmenu Event**: Fires immediately before the browser context menu displays.\n- **Custom UI**: After calling `preventDefault()`, position your custom menu element at `(event.clientX, event.clientY)`.\n- **Accessibility**: Provide keyboard alternatives so keyboard users can still access the actions.",
    "codeExample": "const canvasArea = document.querySelector('#canvas-board');\n\ncanvasArea.addEventListener('contextmenu', (e) => {\n  e.preventDefault(); // Suppresses default browser menu\n  showCustomContextMenu(e.clientX, e.clientY);\n});",
    "interviewTips": [
      "Warn that blanket disabling of right-click across an entire website degrades user experience and accessibility."
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "Mouse Coordinates: clientX/Y vs pageX/Y",
    "difficulty": "EASY",
    "questionType": "COMPARISON",
    "question": "What is the difference between clientX/Y and pageX/Y in mouse events?",
    "shortAnswer": "`clientX/Y` coordinates are relative to the currently visible browser viewport, while `pageX/Y` coordinates are relative to the entire HTML document including scrolled-out areas.",
    "detailedExplanation": "- **No Scroll**: When the page is at scroll position 0, `clientX === pageX` and `clientY === pageY`.\n- **With Scroll**: `pageY = clientY + window.scrollY`.\n- **Fixed vs Absolute Positioning**: Use `clientX/Y` for elements with `position: fixed` and `pageX/Y` for `position: absolute`.",
    "codeExample": "document.addEventListener('click', (e) => {\n  console.log(`Viewport: (${e.clientX}, ${e.clientY})`);\n  console.log(`Document: (${e.pageX}, ${e.pageY})`);\n});",
    "interviewTips": [
      "Explain the scroll formula clearly: `pageY = clientY + window.scrollY`."
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "document.activeElement",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "How do you find out which element currently has keyboard focus on the page?",
    "shortAnswer": "Read `document.activeElement`, which returns the DOM element that currently holds focus, or `document.body` if no element has focus.",
    "detailedExplanation": "- **Focus Tracking**: Essential for accessibility audits, keyboard focus traps, and modal management.\n- **Focus Restoration**: Save `const prevFocused = document.activeElement` before opening a modal, then call `prevFocused.focus()` when closing.\n- **Shadow DOM**: If the focused element is inside a Shadow Root, `document.activeElement` returns the host element.",
    "codeExample": "const currentFocus = document.activeElement;\nconsole.log('Currently focused tag:', currentFocus.tagName);\n\n// Check if user is typing in any text field:\nconst isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);",
    "interviewTips": [
      "Demonstrate how `document.activeElement` is used to restore focus when closing dialog modals."
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "tabindex Attribute Usage",
    "difficulty": "EASY",
    "questionType": "CONCEPTUAL",
    "question": "What do tabindex='0', tabindex='-1', and positive tabindex values mean?",
    "shortAnswer": "`tabindex='0'` includes the element in natural keyboard tab order; `tabindex='-1'` makes it programmatically focusable via JavaScript without putting it in tab order; positive numbers force an explicit tab order.",
    "detailedExplanation": "- **tabindex='0'**: Makes non-interactive elements (like custom `<div>` buttons) reachable via keyboard Tab key.\n- **tabindex='-1'**: Used for dropdown containers, modal dialogs, and errors so `element.focus()` can focus them via script.\n- **Positive values (>0)**: Strongly discouraged as an accessibility anti-pattern because they disrupt natural document reading order.",
    "codeExample": "<!-- Custom button made keyboard reachable: -->\n<div role=\"button\" tabindex=\"0\" id=\"custom-btn\">Click Me</div>\n\n<!-- Modal made programmatically focusable for screen readers: -->\n<div role=\"dialog\" tabindex=\"-1\" id=\"modal-popup\">...</div>",
    "interviewTips": [
      "Always advise against positive `tabindex` values (>0) because they break natural accessibility flow."
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "Clipboard API: navigator.clipboard.writeText",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "What is the modern standard way to copy text to the user's clipboard using JavaScript?",
    "shortAnswer": "Call `navigator.clipboard.writeText('text to copy')`, which returns a Promise that resolves when the text is successfully copied.",
    "detailedExplanation": "- **Asynchronous API**: Non-blocking Promise-based API replacing the legacy `document.execCommand('copy')`.\n- **Secure Context**: Requires HTTPS (or localhost) and must be triggered by an active user gesture (`isTrusted === true`).\n- **Error Handling**: Always catch rejected promises in case permission is denied by the user's browser policy.",
    "codeExample": "async function copyShareLink(url) {\n  try {\n    await navigator.clipboard.writeText(url);\n    showToast('Link copied to clipboard!');\n  } catch (err) {\n    console.error('Failed to copy text: ', err);\n  }\n}",
    "interviewTips": [
      "Mention that `navigator.clipboard.writeText` replaced the deprecated `document.execCommand('copy')`."
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "Wheel Event deltaY Direction",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "How do you detect whether the user is scrolling up or down using the wheel event?",
    "shortAnswer": "Check `event.deltaY`: a positive value (`> 0`) indicates scrolling down, while a negative value (`< 0`) indicates scrolling up.",
    "detailedExplanation": "- **deltaY > 0**: Scrolling down (away from the user).\n- **deltaY < 0**: Scrolling up (toward the user).\n- **Horizontal Scroll**: `event.deltaX` reports horizontal scroll trackpad movements.\n- **deltaMode**: Indicates units: 0 (pixels), 1 (lines), or 2 (pages).",
    "codeExample": "window.addEventListener('wheel', (e) => {\n  if (e.deltaY > 0) {\n    console.log('Scrolling down');\n  } else if (e.deltaY < 0) {\n    console.log('Scrolling up');\n  }\n}, { passive: true });",
    "interviewTips": [
      "Delta values: positive is down, negative is up. Always attach wheel listeners with `{ passive: true }`."
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "Form reset Event",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "What triggers the form reset event and how can you cancel it?",
    "shortAnswer": "The `reset` event fires when a `<button type=\"reset\">` is clicked or `form.reset()` is invoked; calling `event.preventDefault()` cancels the reset action.",
    "detailedExplanation": "- **Restores Initial Values**: Reverts all form inputs to their original default values from HTML markup (not necessarily empty).\n- **Confirmation Prompt**: Commonly used to show a 'Discard changes?' confirmation dialog before wiping user input.\n- **Bubbling**: The `reset` event bubbles up through parent containers.",
    "codeExample": "const form = document.querySelector('#edit-profile');\n\nform.addEventListener('reset', (e) => {\n  const confirmed = confirm('Are you sure you want to discard unsaved edits?');\n  if (!confirmed) {\n    e.preventDefault(); // Prevents form fields from resetting\n  }\n});",
    "interviewTips": [
      "Clarify that resetting a form restores HTML default values, which is different from clearing fields completely."
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "Drag and Drop: Required Event Sequence",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "Why must you call event.preventDefault() inside a dragover event listener to allow dropping?",
    "shortAnswer": "By default, browsers reject drop operations on DOM elements. Calling `event.preventDefault()` inside the `dragover` handler signals to the browser engine that the target is a valid drop destination.",
    "detailedExplanation": "- **Browser Default**: Default behavior shows the 'not-allowed' cursor and cancels the drop.\n- **dragover Requirement**: Without `e.preventDefault()` on `dragover`, the subsequent `drop` event will never fire.\n- **Data Transfer**: Access payloads transferred via `e.dataTransfer.getData('text/plain')` in the `drop` handler.",
    "codeExample": "const dropZone = document.querySelector('#drop-zone');\n\ndropZone.addEventListener('dragover', (e) => {\n  e.preventDefault(); // MANDATORY: Allows the drop event to occur\n  dropZone.classList.add('drag-active');\n});\n\ndropZone.addEventListener('drop', (e) => {\n  e.preventDefault();\n  const data = e.dataTransfer.getData('text/plain');\n  console.log('Dropped item data:', data);\n});",
    "interviewTips": [
      "This is a classic question: dropping fails 100% of the time if `e.preventDefault()` is omitted on `dragover`."
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "Pointer Events vs Mouse/Touch Events",
    "difficulty": "INTERMEDIATE",
    "questionType": "COMPARISON",
    "question": "What is the advantage of using Pointer Events over separate Mouse and Touch events?",
    "shortAnswer": "Pointer Events unify all input devices (mouse, touchscreen, digital stylus/pen) into a single hardware-agnostic API, eliminating duplicated mouse/touch code and synthetic click delays.",
    "detailedExplanation": "- **Unified Model**: Handles `pointerdown`, `pointerup`, `pointermove` across all input modalities.\n- **Device Metadata**: Exposes hardware details like `pointerType` ('mouse', 'touch', 'pen'), `pressure` (0.0 to 1.0 for styluses), and `tiltX/tiltY`.\n- **Pointer Capture**: Supports capturing all pointer movements to a single element even when dragging outside browser boundaries.",
    "codeExample": "canvas.addEventListener('pointerdown', (e) => {\n  console.log(`Input from: ${e.pointerType}, Pressure: ${e.pressure}`);\n});",
    "interviewTips": [
      "Highlight Pointer Events as modern web standard best practice over maintaining separate touch and mouse handlers."
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "element.setPointerCapture()",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "What is element.setPointerCapture() and why is it essential for custom slider and drag handles?",
    "shortAnswer": "`element.setPointerCapture(pointerId)` redirects all subsequent pointer events to that element, even if the cursor moves outside the element or browser window during a drag.",
    "detailedExplanation": "- **No Missed Events**: Prevents losing track of fast mouse movements that escape the slider thumb boundary.\n- **Automatic Release**: Automatically releases capture on `pointerup` or `pointercancel`, or manually via `releasePointerCapture()`.\n- **Clean Code**: Eliminates the fragile old pattern of attaching `mousemove` to `window` on mousedown and unbinding on mouseup.",
    "codeExample": "const thumb = document.querySelector('.slider-thumb');\n\nthumb.addEventListener('pointerdown', (e) => {\n  thumb.setPointerCapture(e.pointerId); // Captures all pointer movements\n});\n\nthumb.addEventListener('pointermove', (e) => {\n  if (thumb.hasPointerCapture(e.pointerId)) {\n    updateSliderPosition(e.clientX);\n  }\n});",
    "interviewTips": [
      "Contrast `setPointerCapture` with the messy old practice of attaching temporary `mousemove` listeners to `window`."
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "Touch Events: touches vs targetTouches vs changedTouches",
    "difficulty": "INTERMEDIATE",
    "questionType": "COMPARISON",
    "question": "What are the differences between event.touches, event.targetTouches, and event.changedTouches in touch events?",
    "shortAnswer": "`touches` lists all fingers currently touching the screen; `targetTouches` lists fingers touching the target element; `changedTouches` lists fingers whose state changed in this event.",
    "detailedExplanation": "- **touches**: Global list of every finger currently in contact with the surface.\n- **targetTouches**: Filtered subset of fingers touching the element that received the event.\n- **changedTouches**: Only the touches that triggered this specific event (e.g. for `touchend`, `touches` is empty, but `changedTouches` contains the finger that lifted).",
    "codeExample": "element.addEventListener('touchend', (e) => {\n  // e.touches may be empty (0 fingers left)!\n  // Read the finger that just lifted from changedTouches:\n  const liftedFinger = e.changedTouches[0];\n  console.log('Finger lifted at:', liftedFinger.clientX, liftedFinger.clientY);\n});",
    "interviewTips": [
      "Always remember: in `touchend`, `e.touches` has already lost the lifted finger, so you must use `e.changedTouches`!"
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "Handling Composition Events (IME Input)",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What are compositionstart and compositionend events and why are they critical for international text input?",
    "shortAnswer": "Composition events manage Input Method Editors (IME) for languages like Chinese, Japanese, and Korean, allowing scripts to pause live search or validation until character composition is confirmed.",
    "detailedExplanation": "- **IME Process**: Users type phonetic syllables, select candidate characters from a popup, and press Enter to finalize the word.\n- **Input Event Trap**: `input` fires on every unconfirmed keystroke during composition, sending broken phonetic fragments to search APIs.\n- **Solution**: Flag `isComposing = true` on `compositionstart` and `false` on `compositionend` to defer actions.",
    "codeExample": "let isComposing = false;\nconst searchInput = document.querySelector('#search');\n\nsearchInput.addEventListener('compositionstart', () => isComposing = true);\nsearchInput.addEventListener('compositionend', () => {\n  isComposing = false;\n  triggerSearch(searchInput.value); // Trigger once finalized\n});\n\nsearchInput.addEventListener('input', () => {\n  if (!isComposing) triggerSearch(searchInput.value);\n});",
    "interviewTips": [
      "Mentioning IME composition handling shows seniority and global-readiness in frontend engineering interviews."
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "scrollend Event",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What is the native scrollend event and how does it improve on scroll debounce timeouts?",
    "shortAnswer": "`scrollend` fires natively when a scrolling operation has completely finished, including inertial smooth scrolls and fling animations, without needing guess-based setTimeout debounce timers.",
    "detailedExplanation": "- **Precise Completion**: Fires only when the viewport or container has fully settled at its final pixel position.\n- **No Timer Guessing**: Eliminates fragile patterns like `clearTimeout(timer); timer = setTimeout(..., 150)`.\n- **Browser Support**: Native in modern Chromium, Firefox, and Safari.",
    "codeExample": "window.addEventListener('scrollend', () => {\n  console.log('Scroll completely stopped. Safe to fetch next batch of items.');\n  loadNextPage();\n});",
    "interviewTips": [
      "Contrast `scrollend` with legacy scroll debounce timers that often fire prematurely during inertial touchpad scrolling."
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "Preventing Paste in Security Inputs",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you intercept or modify pasted data in a text input using the paste event?",
    "shortAnswer": "Listen for the `paste` event, extract clipboard contents via `event.clipboardData.getData('text/plain')`, and invoke `event.preventDefault()` to customize insertion.",
    "detailedExplanation": "- **Clipboard Data Access**: `event.clipboardData` provides access to text, HTML, and file blobs from the OS clipboard.\n- **Sanitization**: Allows stripping non-digits when users paste account or credit card numbers.\n- **Multi-Box OTP**: Automatically splits a pasted 6-digit OTP across 6 separate single-digit input boxes.",
    "codeExample": "const otpInput = document.querySelector('.otp-first');\n\notpInput.addEventListener('paste', (e) => {\n  e.preventDefault();\n  const pastedText = e.clipboardData.getData('text/plain').trim();\n  if (/^\\d{6}$/.test(pastedText)) {\n    distributeOtpAcrossBoxes(pastedText);\n  }\n});",
    "interviewTips": [
      "Use the 6-digit OTP paste distribution use case as a real-world example of handling the `paste` event."
    ]
  },
  {
    "topic": "Forms & Interactive Components",
    "subtopic": "FormData API Usage",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you use the FormData API to extract all values from an HTML form in JavaScript?",
    "shortAnswer": "Pass the form element to `new FormData(formElement)`, which automatically collects all named input, select, and textarea values.",
    "detailedExplanation": "- **Named Fields Only**: Only form controls with a valid `name` attribute are collected.\n- **File Uploads**: Automatically handles `<input type=\"file\">` attachments as File blobs.\n- **Fetch Integration**: Pass `formData` directly as the `body` in `fetch(url, { method: 'POST', body: formData })`—the browser sets the `multipart/form-data` header with proper boundaries automatically.",
    "codeExample": "const form = document.querySelector('#contact-form');\n\nform.addEventListener('submit', async (e) => {\n  e.preventDefault();\n  const data = new FormData(form);\n  \n  // Convert to plain object if sending JSON:\n  const jsonPayload = Object.fromEntries(data.entries());\n  console.log('Submitting payload:', jsonPayload);\n});",
    "interviewTips": [
      "Never manually set `Content-Type: multipart/form-data` header when sending `FormData` via `fetch()`; the browser must generate the boundary string automatically."
    ]
  },
  {
    "topic": "Forms & Interactive Components",
    "subtopic": "HTML5 Constraint Validation: checkValidity vs reportValidity",
    "difficulty": "INTERMEDIATE",
    "questionType": "COMPARISON",
    "question": "What is the difference between element.checkValidity() and element.reportValidity()?",
    "shortAnswer": "`checkValidity()` returns a boolean indicating whether the input passes validation without altering the UI, while `reportValidity()` returns the boolean AND triggers the native browser error popup balloon.",
    "detailedExplanation": "- **checkValidity()**: Silent check; returns `true`/`false` and fires an `invalid` event on failure if unhandled.\n- **reportValidity()**: Active check; returns `true`/`false`, highlights the failing field, focuses it, and shows the browser error tooltip.\n- **Container Level**: Both methods can be called on individual `<input>` fields or on the entire `<form>` element.",
    "codeExample": "const form = document.querySelector('form');\nconst submitBtn = document.querySelector('#custom-submit');\n\nsubmitBtn.addEventListener('click', () => {\n  // Checks validation and displays native browser error tooltips:\n  if (!form.reportValidity()) {\n    console.log('Form has validation errors');\n  }\n});",
    "interviewTips": [
      "Remember: `checkValidity` is silent; `reportValidity` shows the native browser validation bubble."
    ]
  },
  {
    "topic": "Forms & Interactive Components",
    "subtopic": "Custom Validation with setCustomValidity",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you set a custom validation error message on an input using the DOM Constraint Validation API?",
    "shortAnswer": "Call `input.setCustomValidity('Custom message')` to mark the field invalid; call `input.setCustomValidity('')` (empty string) to clear the error and restore valid status.",
    "detailedExplanation": "- **Empty String Clears**: Passing an empty string `''` marks the field as valid again.\n- **blocks Submission**: As long as `customError` is active, form submission is blocked.\n- **validity.customError**: Sets `input.validity.customError = true` while a non-empty message is set.",
    "codeExample": "const password = document.querySelector('#password');\nconst confirmPassword = document.querySelector('#confirm');\n\nconfirmPassword.addEventListener('input', () => {\n  if (confirmPassword.value !== password.value) {\n    confirmPassword.setCustomValidity('Passwords do not match.');\n  } else {\n    confirmPassword.setCustomValidity(''); // Resets to valid state\n  }\n});",
    "interviewTips": [
      "Always stress that passing `''` (empty string) to `setCustomValidity` is required to make the input valid again."
    ]
  },
  {
    "topic": "Forms & Interactive Components",
    "subtopic": "Checkbox Indeterminate State",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "What is the indeterminate state of an HTML checkbox and how is it controlled via JavaScript?",
    "shortAnswer": "The `indeterminate` state displays a dash/horizontal bar indicating a partially selected state (e.g. some subtasks selected) and can ONLY be set via the JavaScript property `checkbox.indeterminate = true`.",
    "detailedExplanation": "- **No HTML Attribute**: There is no `<input type=\"checkbox\" indeterminate>` attribute; it exists strictly as a JavaScript property.\n- **Value Independence**: Does not affect the `checked` property value submitted with forms.\n- **CSS Pseudo-class**: Matches the `:indeterminate` CSS pseudo-class for custom visual styling.",
    "codeExample": "const parentCheckbox = document.querySelector('#select-all');\nconst childCheckboxes = document.querySelectorAll('.child-check');\n\nfunction updateParentState() {\n  const checkedCount = [...childCheckboxes].filter(c => c.checked).length;\n  if (checkedCount === 0) {\n    parentCheckbox.checked = false;\n    parentCheckbox.indeterminate = false;\n  } else if (checkedCount === childCheckboxes.length) {\n    parentCheckbox.checked = true;\n    parentCheckbox.indeterminate = false;\n  } else {\n    parentCheckbox.checked = false;\n    parentCheckbox.indeterminate = true; // Partially selected!\n  }\n}",
    "interviewTips": [
      "Key interview fact: `indeterminate` has no HTML attribute representation; it can only be set via DOM property."
    ]
  },
  {
    "topic": "Forms & Interactive Components",
    "subtopic": "HTML5 Dialog Element: show() vs showModal()",
    "difficulty": "INTERMEDIATE",
    "questionType": "COMPARISON",
    "question": "What is the difference between dialog.show() and dialog.showModal() in the HTML5 Dialog API?",
    "shortAnswer": "`dialog.show()` opens a modeless dialog without backdrop or focus trap, whereas `dialog.showModal()` opens a modal dialog in the browser Top Layer, renders a ::backdrop, and traps keyboard focus.",
    "detailedExplanation": "- **Top Layer**: `showModal()` places the dialog above all `z-index` stacks in the browser engine's Top Layer.\n- **Backdrop Styling**: Enables styling via the `dialog::backdrop` CSS pseudo-element.\n- **Accessibility**: Automatically handles focus trapping and closes when the user presses `Escape`.\n- **Modal Blocking**: Disables interaction with the rest of the document (`inert` background).",
    "codeExample": "const dialog = document.querySelector('dialog');\nconst openBtn = document.querySelector('#open-dialog');\nconst closeBtn = document.querySelector('#close-dialog');\n\nopenBtn.addEventListener('click', () => dialog.showModal());\ncloseBtn.addEventListener('click', () => dialog.close());",
    "interviewTips": [
      "Highlight `dialog.showModal()` as the native standard for modals that eliminates custom focus traps and z-index fighting."
    ]
  },
  {
    "topic": "Forms & Interactive Components",
    "subtopic": "HTML Popover API",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What is the native HTML Popover API and how does it simplify tooltips and popups without JavaScript?",
    "shortAnswer": "The Popover API provides native declarative popup behaviors using the `popover` attribute on the target and `popovertarget` on the trigger button, automatically handling top-layer rendering, light dismiss, and Esc key dismissal.",
    "detailedExplanation": "- **Declarative UI**: Works without JavaScript using `<button popovertarget=\"menu\">` and `<div id=\"menu\" popover>`.\n- **Light Dismiss**: Automatically closes when clicking outside the popover without custom document click handlers.\n- **Programmatic Control**: Methods `element.showPopover()`, `element.hidePopover()`, and `element.togglePopover()`.\n- **Top Layer**: Renders above all other elements without `z-index` conflicts.",
    "codeExample": "<!-- Declarative HTML Popover without custom JS: -->\n<button popovertarget=\"user-menu\">Menu</button>\n<div id=\"user-menu\" popover>\n  <p>Profile Details</p>\n  <button>Sign Out</button>\n</div>",
    "interviewTips": [
      "Mention the Popover API as a modern web standard replacing heavy tooltip and dropdown libraries."
    ]
  },
  {
    "topic": "Forms & Interactive Components",
    "subtopic": "HTML inert Attribute",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What does the HTML inert attribute do and how does it assist in building accessible modals?",
    "shortAnswer": "The `inert` boolean attribute tells the browser engine to ignore user input, click events, and assistive technology for an entire DOM subtree, effectively removing it from tab navigation and screen readers.",
    "detailedExplanation": "- **Accessible Focus Trapping**: Applying `inert` to the background main container when a modal is open prevents screen readers and Tab key from escaping the modal.\n- **Pointer Events**: Automatically sets `pointer-events: none` and `user-select: none` behavior internally.\n- **Native Replacement**: Replaces cumbersome manual tabindex manipulations on all page elements.",
    "codeExample": "const mainApp = document.querySelector('#main-content');\nconst modal = document.querySelector('#modal');\n\nfunction openModal() {\n  modal.classList.add('open');\n  mainApp.setAttribute('inert', ''); // Traps focus in modal by disabling main content\n}\n\nfunction closeModal() {\n  modal.classList.remove('open');\n  mainApp.removeAttribute('inert');\n}",
    "interviewTips": [
      "Mention `inert` as the modern web standard way to create foolproof accessible modal focus traps."
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "Handling File Uploads via FileReader API",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you preview an image selected in an <input type=\"file\"> before uploading it to a server?",
    "shortAnswer": "Read the `fileInput.files[0]` using `URL.createObjectURL(file)` or `FileReader.readAsDataURL(file)` and assign the result to an `<img>` tag's `src`.",
    "detailedExplanation": "- **URL.createObjectURL**: Synchronous, fast, and memory-efficient; generates a temporary `blob:` URL referencing the file in browser memory.\n- **Revoking URL**: Call `URL.revokeObjectURL(url)` when the image finishes loading to release memory.\n- **FileReader**: Converts to a base64 Data URL string; better if you need to store or serialize the string directly.",
    "codeExample": "const fileInput = document.querySelector('#avatar');\nconst previewImg = document.querySelector('#preview');\n\nfileInput.addEventListener('change', () => {\n  const file = fileInput.files[0];\n  if (file) {\n    // Fast, modern blob URL preview:\n    previewImg.src = URL.createObjectURL(file);\n    previewImg.onload = () => URL.revokeObjectURL(previewImg.src);\n  }\n});",
    "interviewTips": [
      "Recommend `URL.createObjectURL()` over `FileReader` for image previews due to lower memory overhead and instant execution."
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "Keyboard Event repeat Property",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What is the event.repeat property in keyboard events and how does it prevent unwanted repeated action dispatches?",
    "shortAnswer": "`event.repeat` is a boolean that is `true` if the key is being held down and auto-repeating, and `false` for the initial keystroke.",
    "detailedExplanation": "- **Key Hold Behavior**: Operating systems repeatedly fire `keydown` when a user holds down a key.\n- **Single Trigger Actions**: For actions that should only execute once per press (e.g. opening a modal, firing a weapon in a game, submitting a form), check `if (e.repeat) return;`.\n- **Performance**: Prevents flooding your application with hundreds of redundant event loops.",
    "codeExample": "window.addEventListener('keydown', (e) => {\n  if (e.repeat) return; // Ignores held-down repeated keydown events\n  if (e.key === ' ') {\n    toggleAudioPlayback();\n  }\n});",
    "interviewTips": [
      "Mention `e.repeat` when discussing game controls or single-trigger shortcuts like opening search dialogs."
    ]
  },
  {
    "topic": "Forms & Interactive Components",
    "subtopic": "Reading Radio Button Group Selection",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you retrieve the selected value of a radio button group using modern query selectors?",
    "shortAnswer": "Use `document.querySelector('input[name=\"groupName\"]:checked')?.value`.",
    "detailedExplanation": "- **CSS Pseudo-Selector**: `:checked` filters for only the active radio button in the specified group.\n- **Optional Chaining**: Safe navigation with `?.` prevents errors if the user hasn't made a selection yet.\n- **No Loop Required**: Eliminates iterating over a NodeList of radio inputs with `for...of`.",
    "codeExample": "function getSelectedShippingMethod() {\n  const selectedRadio = document.querySelector('input[name=\"shipping\"]:checked');\n  return selectedRadio ? selectedRadio.value : 'standard';\n}",
    "interviewTips": [
      "Highlight `querySelector('input[name=\"...\"]:checked')` as the cleanest single-line idiom for reading radio groups."
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "beforeunload Event Warnings",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you prompt the user with a confirmation warning before they navigate away with unsaved form changes?",
    "shortAnswer": "Attach a listener to `window.addEventListener('beforeunload', ...)` and call `event.preventDefault()` while setting `event.returnValue = ''`.",
    "detailedExplanation": "- **Standard Requirements**: Both `event.preventDefault()` and `event.returnValue = ''` are required across different browser engines.\n- **Generic Browser Dialog**: Modern browsers display a standardized security warning; custom string messages are ignored to prevent phishing.\n- **Dynamic Guard**: Only attach the listener when changes are dirty; remove it once saved.",
    "codeExample": "let isFormDirty = false;\n\nwindow.addEventListener('beforeunload', (e) => {\n  if (isFormDirty) {\n    e.preventDefault();\n    e.returnValue = ''; // Prompts native 'Leave site? Changes you made may not be saved.'\n  }\n});",
    "interviewTips": [
      "Note that browsers no longer display custom string messages in `beforeunload` to prevent deceptive phishing messages."
    ]
  },
  {
    "topic": "Forms & Interactive Components",
    "subtopic": "HTML5 Details & Summary toggle Event",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you detect when a native <details> accordion element is expanded or collapsed?",
    "shortAnswer": "Listen for the `toggle` event on the `<details>` element and check the `details.open` boolean property.",
    "detailedExplanation": "- **toggle Event**: Fires whenever the open/closed disclosure state changes.\n- **Boolean Property**: `details.open === true` when expanded, and `false` when collapsed.\n- **Lazy Loading**: Perfect for fetching accordion content over the network only when the user expands the section.",
    "codeExample": "const accordion = document.querySelector('details');\n\naccordion.addEventListener('toggle', () => {\n  if (accordion.open) {\n    console.log('Accordion opened: fetching contents...');\n    loadSectionData();\n  } else {\n    console.log('Accordion closed');\n  }\n});",
    "interviewTips": [
      "Mention the native `<details>` and `<summary>` tags as zero-JS accordions that support the `toggle` event."
    ]
  },
  {
    "topic": "Forms & Interactive Components",
    "subtopic": "Handling select Multiple Selections",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you retrieve an array of all selected values from a multi-select dropdown (<select multiple>)?",
    "shortAnswer": "Use `Array.from(selectElement.selectedOptions).map(option => option.value)`.",
    "detailedExplanation": "- **selectedOptions**: An HTMLCollection containing only the `<option>` elements currently selected by the user.\n- **Array.from()**: Converts the collection into an array to use functional array methods like `.map()`.\n- **select.value Limitation**: Reading `select.value` directly only returns the first selected option.",
    "codeExample": "const multiSelect = document.querySelector('#skills-select');\n\nfunction getSelectedSkills() {\n  return Array.from(multiSelect.selectedOptions, opt => opt.value);\n}",
    "interviewTips": [
      "Never use `select.value` on a multi-select; always use `select.selectedOptions`."
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "Synthetic Click 300ms Delay & FastClick",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "What was the 300ms click delay on mobile browsers, what caused it, and how was it eliminated?",
    "shortAnswer": "Mobile browsers waited 300ms after a tap to distinguish a single click from a double-tap to zoom. It was eliminated by adding `<meta name=\"viewport\" content=\"width=device-width\">` or CSS `touch-action: manipulation`.",
    "detailedExplanation": "- **Historical Cause**: Mobile Safari introduced double-tap to zoom on desktop pages, needing 300ms to see if a second tap followed.\n- **Modern Fix**: Responsive viewport tag tells mobile engines that the page is mobile-optimized, disabling double-tap zoom and removing the delay.\n- **CSS Fix**: Setting `touch-action: manipulation` tells the engine to only listen for pan and pinch gestures, dropping the click delay immediately.",
    "codeExample": "/* Disables double-tap zoom delay on interactive elements: */\nbutton, a, input {\n  touch-action: manipulation;\n}",
    "interviewTips": [
      "Explain both solutions: `<meta name=\"viewport\" content=\"width=device-width\">` and `touch-action: manipulation`."
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "Drag and Drop DataTransfer API Types",
    "difficulty": "DIFFICULT",
    "questionType": "CODE",
    "question": "How do you securely pass both plain text and structured JSON data across Drag and Drop operations using dataTransfer?",
    "shortAnswer": "Set custom MIME types like `dataTransfer.setData('application/json', JSON.stringify(data))` alongside standard `'text/plain'` fallbacks.",
    "detailedExplanation": "- **Multi-MIME Types**: `dataTransfer` allows registering multiple data formats for the same drag action.\n- **External Apps**: External desktop apps only understand `'text/plain'` or `'text/uri-list'`.\n- **Internal App State**: Use `'application/json'` to pass complex entity IDs and metadata to drop zones inside your web app.",
    "codeExample": "draggableCard.addEventListener('dragstart', (e) => {\n  const payload = { id: 42, type: 'task', column: 'in-progress' };\n  e.dataTransfer.setData('application/json', JSON.stringify(payload));\n  e.dataTransfer.setData('text/plain', `Task #42`);\n  e.dataTransfer.effectAllowed = 'move';\n});\n\ndropColumn.addEventListener('drop', (e) => {\n  e.preventDefault();\n  const raw = e.dataTransfer.getData('application/json');\n  if (raw) {\n    const task = JSON.parse(raw);\n    moveTask(task.id);\n  }\n});",
    "interviewTips": [
      "Mention setting both a structured format (`application/json`) and a fallback (`text/plain`) for resilient DnD."
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "Virtual Keyboard API",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "What is the Virtual Keyboard API and how does it prevent mobile on-screen keyboards from obscuring fixed UI elements?",
    "shortAnswer": "The Virtual Keyboard API (`navigator.virtualKeyboard`) allows JavaScript and CSS env variables (`env(keyboard-inset-height)`) to track on-screen keyboard overlays without resizing the visual viewport.",
    "detailedExplanation": "- **overlaysContent**: Setting `navigator.virtualKeyboard.overlaysContent = true` stops the browser from resizing the page layout abruptly.\n- **geometrychange Event**: Fires when the virtual keyboard opens or closes.\n- **CSS Env Variables**: Use `padding-bottom: env(keyboard-inset-height, 0px)` on fixed bottom action bars to keep inputs visible.",
    "codeExample": "if ('virtualKeyboard' in navigator) {\n  navigator.virtualKeyboard.overlaysContent = true;\n  navigator.virtualKeyboard.addEventListener('geometrychange', (e) => {\n    const { height } = e.target.boundingRect;\n    adjustFloatingActionBar(height);\n  });\n}",
    "interviewTips": [
      "Discuss the Virtual Keyboard API when asked about advanced mobile web UX and keyboard obscuring problems."
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "Pointer Lock API",
    "difficulty": "DIFFICULT",
    "questionType": "CODE",
    "question": "What is the Pointer Lock API (element.requestPointerLock()) and how does it differ from setPointerCapture?",
    "shortAnswer": "`requestPointerLock()` hides the mouse cursor and provides continuous relative mouse coordinate deltas (`movementX`, `movementY`) without cursor bounds, designed for 3D games and canvas panning.",
    "detailedExplanation": "- **Infinite Movement**: The cursor cannot leave the window; movements fire indefinitely with `movementX` and `movementY`.\n- **Pointer Capture vs Lock**: `setPointerCapture` keeps normal cursor tracking during drags; Pointer Lock completely eliminates cursor boundaries and hides the pointer.\n- **User Permission**: Requires a user gesture and shows an OS notification (press Esc to exit).",
    "codeExample": "const 3dCanvas = document.querySelector('#viewport');\n\n3dCanvas.addEventListener('click', () => {\n  3dCanvas.requestPointerLock();\n});\n\ndocument.addEventListener('mousemove', (e) => {\n  if (document.pointerLockElement === 3dCanvas) {\n    rotateCamera(e.movementX, e.movementY);\n  }\n});",
    "interviewTips": [
      "Use 3D WebGL games and panoramic image viewers as typical use cases for the Pointer Lock API."
    ]
  },
  {
    "topic": "Forms & Interactive Components",
    "subtopic": "Custom Form-Associated Elements with ElementInternals",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "How does the ElementInternals API allow custom Web Components to participate in native HTML form submission and validation?",
    "shortAnswer": "Calling `this.attachInternals()` inside an autonomous custom element grants access to an `ElementInternals` instance with `setFormValue()`, `setValidity()`, and `form` properties.",
    "detailedExplanation": "- **static formAssociated = true**: Must declare this static flag on the Web Component class.\n- **setFormValue(value)**: Sets the value submitted with the parent `<form>` when submitted.\n- **setValidity(flags, message)**: Integrates directly with the browser's native Constraint Validation API.\n- **Zero Wrappers**: Allows building rich custom input components that work identically to native `<input>` tags.",
    "codeExample": "class CustomRating extends HTMLElement {\n  static formAssociated = true;\n  constructor() {\n    super();\n    this.internals_ = this.attachInternals();\n  }\n  set rating(val) {\n    this.internals_.setFormValue(val); // Injected into FormData!\n  }\n}\ncustomElements.define('custom-rating', CustomRating);",
    "interviewTips": [
      "Mention `ElementInternals` and `static formAssociated = true` as the modern standard for custom form controls."
    ]
  },
  {
    "topic": "Forms & Interactive Components",
    "subtopic": "ValidityState Object Flags",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "What specific validation error states are exposed on the input.validity (ValidityState) object?",
    "shortAnswer": "`input.validity` exposes granular boolean properties including `valueMissing`, `typeMismatch`, `patternMismatch`, `tooLong`, `tooShort`, `rangeUnderflow`, `rangeOverflow`, `stepMismatch`, `badInput`, `customError`, and `valid`.",
    "detailedExplanation": "- **valueMissing**: Triggered when a `required` input is empty.\n- **typeMismatch**: E.g. email or URL syntax is invalid.\n- **patternMismatch**: Fails regex specified in the `pattern` attribute.\n- **customError**: `true` if `setCustomValidity()` was called with a non-empty message.\n- **valid**: True only when all other failure flags are `false`.",
    "codeExample": "const email = document.querySelector('input[type=\"email\"]');\n\nif (email.validity.valueMissing) {\n  showError('Email is required.');\n} else if (email.validity.typeMismatch) {\n  showError('Please enter a valid email address.');\n}",
    "interviewTips": [
      "Listing multiple `validity` flags (valueMissing, typeMismatch, patternMismatch) demonstrates thorough form API mastery."
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "ClipboardItem & Copying Rich Media",
    "difficulty": "DIFFICULT",
    "questionType": "CODE",
    "question": "How do you copy binary image data or rich HTML to the clipboard using navigator.clipboard.write()?",
    "shortAnswer": "Create a `new ClipboardItem({ 'image/png': blob })` and pass an array of ClipboardItem objects to `navigator.clipboard.write([item])`.",
    "detailedExplanation": "- **navigator.clipboard.write vs writeText**: `writeText` only handles strings; `write()` handles arbitrary binary blobs and rich MIME types.\n- **Supported Types**: PNG images, text/html, and text/plain.\n- **User Gesture**: Must be invoked from an active user interaction; rejected otherwise.",
    "codeExample": "async function copyCanvasImage(canvas) {\n  canvas.toBlob(async (blob) => {\n    const item = new ClipboardItem({ 'image/png': blob });\n    await navigator.clipboard.write([item]);\n    console.log('Image copied to clipboard!');\n  }, 'image/png');\n}",
    "interviewTips": [
      "Contrast `navigator.clipboard.write()` for binary blobs (images) with `writeText()` for plain strings."
    ]
  },
  {
    "topic": "Forms & Interactive Components",
    "subtopic": "FormData Event (formdata)",
    "difficulty": "DIFFICULT",
    "questionType": "CODE",
    "question": "What is the formdata event and how does it allow components to inject custom fields into form submissions?",
    "shortAnswer": "The `formdata` event fires on a `<form>` when its data is being gathered (via `new FormData(form)` or submit), allowing listeners to append or modify entries via `event.formData.append()`.",
    "detailedExplanation": "- **Decoupled Injection**: Lets independent UI widgets inject their state without having hidden `<input>` elements in the DOM.\n- **Event Object**: Provides `event.formData` directly for manipulation.\n- **Lifecycle**: Fires synchronously right before the form payload is serialized.",
    "codeExample": "const form = document.querySelector('#order-form');\n\nform.addEventListener('formdata', (e) => {\n  // Injects client tracking and session data dynamically:\n  e.formData.append('clientTimestamp', Date.now());\n  e.formData.append('themePreference', localStorage.getItem('theme'));\n});",
    "interviewTips": [
      "Mention the `formdata` event as the modern, clean replacement for injecting hidden `<input>` tags into forms."
    ]
  },
  {
    "topic": "Event Types & Interactions",
    "subtopic": "TouchEvent Cancellation and CSS touch-action",
    "difficulty": "DIFFICULT",
    "questionType": "PERFORMANCE",
    "question": "Why does calling event.preventDefault() in touchstart break mobile scrolling and how does CSS touch-action solve it?",
    "shortAnswer": "`preventDefault()` on `touchstart` stops native browser gestures (scrolling and pinch-zoom). Declaring CSS `touch-action: pan-y` allows native vertical scrolling without JavaScript main-thread delays.",
    "detailedExplanation": "- **Scroll Stutter**: If JavaScript attaches non-passive touch listeners, the browser compositor must halt scrolling until JavaScript finishes.\n- **Declarative Scrolling**: `touch-action: pan-y` tells the browser compositor to immediately handle vertical scrolling natively without waiting for JS.\n- **Horizontal Swipes**: Ideal for carousel carousels where horizontal swipes are captured by JS while vertical page scrolling remains buttery smooth.",
    "codeExample": "/* Allows native vertical page scroll, but routes horizontal swipes to JavaScript: */\n.carousel-track {\n  touch-action: pan-y;\n}",
    "interviewTips": [
      "Always propose CSS `touch-action: pan-y` or `pan-x` over calling `e.preventDefault()` inside touch listeners."
    ]
  },
  {
    "topic": "Forms & Interactive Components",
    "subtopic": "Handling File Drag and Drop via dataTransfer.files",
    "difficulty": "DIFFICULT",
    "questionType": "CODE",
    "question": "How do you implement a drag-and-drop file upload zone that reads dropped files?",
    "shortAnswer": "Inspect `event.dataTransfer.files` in the `drop` event listener after preventing default on both `dragover` and `drop`.",
    "detailedExplanation": "- **dataTransfer.files**: Returns a standard `FileList` identical to `fileInput.files`.\n- **Directory Uploads**: Modern browsers support `item.webkitGetAsEntry()` to recursively read folders dropped into the drop zone.\n- **Validation**: Filter dropped files by MIME type (`file.type`) and byte size (`file.size`) before uploading.",
    "codeExample": "const dropArea = document.querySelector('#file-drop-zone');\n\n['dragenter', 'dragover'].forEach(name => {\n  dropArea.addEventListener(name, (e) => e.preventDefault());\n});\n\ndropArea.addEventListener('drop', (e) => {\n  e.preventDefault();\n  const files = e.dataTransfer.files;\n  if (files.length > 0) {\n    uploadFiles(files);\n  }\n});",
    "interviewTips": [
      "Emphasize preventing default on BOTH `dragover` and `drop` events to allow file drops."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "Reflow vs Repaint Definition",
    "difficulty": "EASY",
    "questionType": "COMPARISON",
    "question": "What is the difference between a Reflow (Layout) and a Repaint in the browser rendering pipeline?",
    "shortAnswer": "Reflow recalculates the geometric dimensions and positions of elements on the page, while Repaint redraws visual pixels (colors, shadows, visibility) without changing layout geometry.",
    "detailedExplanation": "- **Reflow (Layout)**: Expensive computational process. Changing `width`, `height`, `margin`, or adding DOM nodes forces reflow of the element and its ancestors.\n- **Repaint**: Cheaper process. Changing `color`, `background-color`, or `box-shadow` repaints pixels without moving elements.\n- **Dependency**: A reflow always triggers a repaint, but a repaint does NOT trigger a reflow.",
    "codeExample": "// Triggers Reflow + Repaint (expensive):\ncard.style.width = '300px';\n\n// Triggers Repaint ONLY (cheaper):\ncard.style.backgroundColor = '#10b981';",
    "interviewTips": [
      "Key sentence: 'Reflow is about geometry and position; Repaint is about visual surface pixels. Reflow always triggers Repaint.'"
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "DocumentFragment for Batching",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "How do you use a DocumentFragment to insert 100 new elements without triggering 100 separate reflows?",
    "shortAnswer": "Create a fragment with `document.createDocumentFragment()`, append all 100 elements to the fragment in memory, and then append the fragment to the DOM in a single operation.",
    "detailedExplanation": "- **Lightweight Container**: A DocumentFragment exists purely in memory and has no parent in the active DOM tree.\n- **Single Reflow**: When appended to the DOM, only the fragment's children are inserted, causing exactly one reflow.\n- **Self-Emptying**: Appending the fragment empties its contents automatically.",
    "codeExample": "const list = document.querySelector('#item-list');\nconst fragment = document.createDocumentFragment();\n\nfor (let i = 0; i < 100; i++) {\n  const li = document.createElement('li');\n  li.textContent = `Item #${i + 1}`;\n  fragment.appendChild(li);\n}\n\n// Causes only 1 reflow instead of 100:\nlist.appendChild(fragment);",
    "interviewTips": [
      "Mention DocumentFragment as the standard native DOM solution for batch-inserting elements."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "requestAnimationFrame vs setTimeout",
    "difficulty": "EASY",
    "questionType": "COMPARISON",
    "question": "Why should requestAnimationFrame be used instead of setTimeout or setInterval for DOM animations?",
    "shortAnswer": "`requestAnimationFrame` synchronizes execution with the browser's display refresh rate (typically 60Hz or 120Hz) and pauses automatically when the tab is in the background, saving CPU and battery.",
    "detailedExplanation": "- **Display Sync**: Runs right before the browser renders the next frame, avoiding dropped frames and visual tearing.\n- **Battery Efficiency**: Automatically throttles or stops when the user switches tabs or minimizes the window.\n- **Precise Timing**: Passes a high-resolution timestamp (`DOMHighResTimeStamp`) as an argument.",
    "codeExample": "const box = document.querySelector('.box');\nlet pos = 0;\n\nfunction animate() {\n  pos += 2;\n  box.style.transform = `translateX(${pos}px)`;\n  if (pos < 400) {\n    requestAnimationFrame(animate); // Smooth 60fps sync\n  }\n}\n\nrequestAnimationFrame(animate);",
    "interviewTips": [
      "Emphasize tab-pausing and display refresh rate synchronization as the two main advantages of `requestAnimationFrame`."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "CSS Transform and Opacity Performance",
    "difficulty": "EASY",
    "questionType": "PERFORMANCE",
    "question": "Why are CSS transform and opacity properties significantly faster to animate than top/left or width/height?",
    "shortAnswer": "`transform` and `opacity` are handled directly by the GPU compositor thread, skipping both the Reflow (Layout) and Repaint phases of the rendering pipeline.",
    "detailedExplanation": "- **Compositor Only**: Animating `transform: translateX(...)` creates a GPU composite layer, moving pixels without touching the main thread.\n- **Skipping Reflow**: Changing `left` or `top` forces the browser main thread to recalculate layout geometry on every frame, causing dropped frames.\n- **60fps / 120fps**: Compositor animations remain smooth even when the JavaScript main thread is busy.",
    "codeExample": "// BAD (Triggers main thread Reflow on every frame):\n// element.style.left = `${posX}px`;\n\n// GOOD (GPU Compositor only, 60fps smooth):\nelement.style.transform = `translate3d(${posX}px, 0, 0)`;",
    "interviewTips": [
      "Memorize the 4 stages of rendering: Layout -> Paint -> Composite. `transform` and `opacity` bypass Layout and Paint."
    ]
  },
  {
    "topic": "Forms & Interactive Components",
    "subtopic": "HTML5 Form novalidate Attribute",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "How do you disable native browser validation popups so you can handle validation entirely in custom JavaScript?",
    "shortAnswer": "Add the `novalidate` boolean attribute to the `<form>` element, or set `form.noValidate = true` in JavaScript.",
    "detailedExplanation": "- **Suppresses Browser Tooltips**: Prevents native browser speech bubble error tooltips from popping up.\n- **Preserves API**: The Constraint Validation API (`input.validity`, `checkValidity()`) remains fully accessible in JavaScript.\n- **Consistent UI**: Essential for design systems that provide custom brand-aligned error messages and banners.",
    "codeExample": "<!-- Suppresses default browser validation balloons: -->\n<form id=\"signup-form\" novalidate>\n  <input type=\"email\" required>\n  <button type=\"submit\">Sign Up</button>\n</form>",
    "interviewTips": [
      "Clarify that `novalidate` only disables the native browser error popup bubbles; it does not disable your custom JS validation."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "Hiding Elements: display: none vs visibility: hidden",
    "difficulty": "EASY",
    "questionType": "COMPARISON",
    "question": "What is the difference between display: none and visibility: hidden in DOM layout and rendering?",
    "shortAnswer": "`display: none` completely removes the element from the layout render tree (taking zero space and triggering reflow), while `visibility: hidden` hides the element visually while preserving its layout space.",
    "detailedExplanation": "- **display: none**: Triggers reflow and repaint. Descendant elements cannot be made visible.\n- **visibility: hidden**: Triggers repaint only (geometry is unchanged). A child can be made visible via `visibility: visible`.\n- **Accessibility**: Both properties hide content from screen readers.",
    "codeExample": "const card = document.querySelector('.card');\n\n// Takes zero space in layout (triggers reflow):\ncard.style.display = 'none';\n\n// Retains space, invisible (triggers repaint only):\ncard.style.visibility = 'hidden';",
    "interviewTips": [
      "Remember: `display: none` affects layout geometry; `visibility: hidden` preserves dimensions and only affects pixels."
    ]
  },
  {
    "topic": "Forms & Interactive Components",
    "subtopic": "Input pattern Attribute & Regex Validation",
    "difficulty": "EASY",
    "questionType": "CODE",
    "question": "How does the HTML pattern attribute enforce regex validation on text inputs?",
    "shortAnswer": "The `pattern` attribute takes a regular expression string that the user input must match entirely, setting `input.validity.patternMismatch = true` if it fails.",
    "detailedExplanation": "- **Whole String Match**: Browsers automatically anchor the pattern (`^(?:pattern)$`), requiring the entire value to match.\n- **title Attribute**: Used to provide a helpful hint displayed in the browser's default validation popup.\n- **CSS Pseudo-class**: Matches `:valid` and `:invalid` CSS selectors automatically as the user types.",
    "codeExample": "<!-- Enforces 5-digit ZIP code: -->\n<input \n  type=\"text\" \n  name=\"zipcode\" \n  pattern=\"[0-9]{5}\" \n  title=\"Please enter a 5-digit postal code\"\n  required\n>",
    "interviewTips": [
      "Mention that the browser implicitly anchors the pattern with `^` and `$`, so you don't need to write them manually."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "CSS will-change Property",
    "difficulty": "EASY",
    "questionType": "PERFORMANCE",
    "question": "What does the CSS will-change property do and why must it be used sparingly?",
    "shortAnswer": "`will-change` informs the browser engine ahead of time which properties will be animated, allowing it to promote the element to its own GPU compositor layer before animation begins.",
    "detailedExplanation": "- **Prevents Stutter**: Eliminates the slight stutter that happens when an element is suddenly promoted to a GPU layer mid-animation.\n- **Memory Consumption**: Promoting an element to a GPU compositor layer consumes significant video RAM (VRAM).\n- **Best Practice**: Apply `will-change` just before an animation starts (e.g. on hover) and remove it when the animation ends.",
    "codeExample": ".modal-animated {\n  /* Pre-allocates GPU layer for smooth animation: */\n  will-change: transform, opacity;\n}",
    "interviewTips": [
      "Never put `will-change` on hundreds of elements at once; excessive GPU layers exhaust mobile device memory."
    ]
  },
  {
    "topic": "Forms & Interactive Components",
    "subtopic": "Form Submission via submit() vs requestSubmit()",
    "difficulty": "EASY",
    "questionType": "COMPARISON",
    "question": "Why is form.requestSubmit() preferred over form.submit() in modern JavaScript?",
    "shortAnswer": "`form.requestSubmit()` triggers HTML5 constraint validation, fires the `submit` event listeners, and respects submit button attributes, while `form.submit()` bypasses validation and event listeners entirely.",
    "detailedExplanation": "- **form.submit()**: Legacy method that bypasses the `submit` event handler and skips HTML5 validation, sending data immediately.\n- **form.requestSubmit()**: Simulates clicking the form's submit button, running validation checks and executing `onsubmit` listeners.\n- **Submitter Identification**: Accepts an optional submitter button: `form.requestSubmit(specificButton)`.",
    "codeExample": "const form = document.querySelector('#checkout-form');\n\n// Recommended (runs validation and onsubmit listeners):\nform.requestSubmit();\n\n// Avoid (skips validation completely):\n// form.submit();",
    "interviewTips": [
      "Always recommend `requestSubmit()` over `submit()` to ensure client-side form validation rules are respected."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "Measuring Scroll Height: scrollHeight vs clientHeight",
    "difficulty": "EASY",
    "questionType": "COMPARISON",
    "question": "What is the difference between element.scrollHeight and element.clientHeight?",
    "shortAnswer": "`clientHeight` is the inner visible height of the element including padding, while `scrollHeight` is the total height of all content inside the element, including content hidden behind scrollbars.",
    "detailedExplanation": "- **clientHeight**: `padding-top` + `height` + `padding-bottom` (visible viewable area).\n- **scrollHeight**: Total scrollable height required to view all child content.\n- **Scroll Detection**: An element is scrolled to the bottom when `element.scrollTop + element.clientHeight >= element.scrollHeight - 1`.",
    "codeExample": "const chatBox = document.querySelector('#chat');\n\n// Checks if user has scrolled to the very bottom:\nconst isAtBottom = chatBox.scrollTop + chatBox.clientHeight >= chatBox.scrollHeight - 5;\nif (isAtBottom) {\n  scrollToNewMessage();\n}",
    "interviewTips": [
      "Explain how `scrollHeight` and `clientHeight` work together to detect when a user reaches the bottom of a scrollable container."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "Layout Thrashing Explained",
    "difficulty": "INTERMEDIATE",
    "questionType": "PERFORMANCE",
    "question": "What is Layout Thrashing and how do you write code to prevent it?",
    "shortAnswer": "Layout Thrashing occurs when JavaScript repeatedly alternates between writing DOM styles and reading layout dimensions in a tight loop, forcing the browser to recalculate layout on every single iteration.",
    "detailedExplanation": "- **Interleaved Operations**: Write -> Read -> Write -> Read prevents the browser from batching layout updates.\n- **Batching Solution**: Perform all layout reads first, store values in variables, and then perform all style writes together.\n- **Libraries**: Tools like FastDOM automate batching reads and writes into scheduled animation frames.",
    "codeExample": "// BAD (Causes layout thrashing - forced reflow on each loop iteration):\nitems.forEach(item => {\n  const width = container.offsetWidth; // READ (Forces layout calculation)\n  item.style.width = `${width}px`;     // WRITE (Invalidates layout)\n});\n\n// GOOD (Batched reads, followed by batched writes):\nconst targetWidth = container.offsetWidth; // 1 READ\nitems.forEach(item => {\n  item.style.width = `${targetWidth}px`;   // BATCHED WRITES\n});",
    "interviewTips": [
      "Structure your answer around the golden rule: 'Separate Reads from Writes; Batch Reads First, Writes Second.'"
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "Reflow Triggers List",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "Which specific DOM and CSS properties force a synchronous layout recalculation when read?",
    "shortAnswer": "Reading layout geometry properties forces synchronous reflow: `offsetWidth/Height`, `clientWidth/Height`, `scrollWidth/Height`, `offsetTop/Left`, `clientTop/Left`, `scrollTop/Left`, `getComputedStyle()`, and `getBoundingClientRect()`.",
    "detailedExplanation": "- **Pending Changes**: If any DOM or style mutations occurred earlier in the frame, the browser must flush pending layouts immediately to return accurate numbers.\n- **Methods**: `element.focus()`, `element.scrollIntoView()`, and `window.scrollTo()` also trigger reflow flushes.\n- **Caching**: Always cache these read values in local variables instead of repeatedly querying them.",
    "codeExample": "const el = document.querySelector('#sidebar');\n\n// Reading any of these forces an immediate synchronous layout calculation:\nconst h = el.offsetHeight;\nconst rect = el.getBoundingClientRect();\nconst styles = window.getComputedStyle(el).fontSize;",
    "interviewTips": [
      "List at least four layout read properties: `offsetHeight`, `clientWidth`, `getBoundingClientRect`, and `getComputedStyle`."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "content-visibility: auto",
    "difficulty": "INTERMEDIATE",
    "questionType": "PERFORMANCE",
    "question": "How does CSS content-visibility: auto dramatically accelerate initial DOM render times?",
    "shortAnswer": "`content-visibility: auto` instructs the browser to skip layout and painting for elements that are currently off-screen until the user scrolls near them, speeding up initial rendering by up to 10x.",
    "detailedExplanation": "- **Off-Screen Skipping**: The browser treats offscreen subtrees like empty boxes until they enter the viewport.\n- **contain-intrinsic-size**: Must be paired with `contain-intrinsic-size` to give off-screen elements an estimated placeholder height, preventing scrollbar jumping.\n- **Native Virtualization**: Provides near-native virtual scrolling benefits with pure CSS and zero JavaScript overhead.",
    "codeExample": ".long-feed-article {\n  content-visibility: auto;\n  contain-intrinsic-size: 0 500px; /* Estimated height to keep scrollbar stable */\n}",
    "interviewTips": [
      "Always mention pairing `content-visibility: auto` with `contain-intrinsic-size` to prevent scrollbar jumping."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "CSS Containment Property",
    "difficulty": "INTERMEDIATE",
    "questionType": "PERFORMANCE",
    "question": "What is CSS containment (the contain property) and how does it optimize browser layout recalculations?",
    "shortAnswer": "The `contain` property isolates an element's DOM subtree from the rest of the document, ensuring that layout or paint changes inside the element never trigger reflows in the outer document.",
    "detailedExplanation": "- **contain: layout**: Guarantees that internal layout mutations don't affect elements outside its boundary.\n- **contain: paint**: Guarantees that child elements never visually overflow the boundary box, allowing the browser to skip painting if offscreen.\n- **contain: strict**: Combines `layout`, `paint`, and `size` containment for maximum optimization.",
    "codeExample": ".widget-card {\n  /* Prevents changes inside card from causing reflow in parent page: */\n  contain: content;\n}",
    "interviewTips": [
      "Mention CSS `contain` as a powerful tool for isolating high-frequency dashboard widgets from triggering page-wide reflows."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "Virtual DOM vs Real DOM Performance Realities",
    "difficulty": "INTERMEDIATE",
    "questionType": "COMPARISON",
    "question": "Is the Virtual DOM fundamentally faster than the Real DOM?",
    "shortAnswer": "No, direct Real DOM manipulation is inherently faster because the Virtual DOM is an abstraction layer that incurs memory overhead and diffing CPU cycles. The Virtual DOM provides declarative developer ergonomics, not raw speed.",
    "detailedExplanation": "- **Overhead**: VDOM requires creating lightweight JavaScript objects on every render and running tree diffing algorithms.\n- **Optimal Manual DOM**: Hand-crafted DOM mutations targeting exact nodes are always faster than generic VDOM diffing.\n- **Why Frameworks Use VDOM**: VDOM offers consistent 'good enough' performance while providing a declarative, component-driven programming model.\n- **Modern Compilers**: Modern libraries like Svelte and SolidJS bypass VDOM completely, compiling directly to surgical Real DOM mutations.",
    "codeExample": "// Hand-optimized Real DOM (Fastest - zero diffing overhead):\npriceSpan.textContent = `$${newPrice}`;\n\n// VDOM: Re-renders JSX tree -> creates new VNode -> diffs against old VNode -> updates DOM",
    "interviewTips": [
      "Seniors stand out by acknowledging that VDOM is an ergonomic developer abstraction that adds diffing overhead, not magic speed."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "Mutating Off-Screen DOM Trees",
    "difficulty": "INTERMEDIATE",
    "questionType": "PERFORMANCE",
    "question": "How does detaching an element from the DOM before performing hundreds of mutations improve performance?",
    "shortAnswer": "Detaching an element (or cloning it offscreen) allows you to perform extensive DOM restructuring without triggering any reflows on the active document, re-inserting it once all operations are complete.",
    "detailedExplanation": "- **Zero Document Reflows**: Changes made to detached elements never invalidate the active document layout tree.\n- **Pattern**: Detach element via `const parent = el.parentNode; parent.removeChild(el);`, apply complex mutations, then `parent.appendChild(el);`.\n- **Alternative**: Set `el.style.display = 'none'`, apply modifications (causes only 1 reflow to hide, 1 to show), then restore display.",
    "codeExample": "const table = document.querySelector('#huge-table');\nconst parent = table.parentNode;\n\n// Detach from DOM:\nparent.removeChild(table);\n\n// Perform heavy mutations without document reflow:\nsortTableRows(table);\nreformatCells(table);\n\n// Re-insert into DOM:\nparent.appendChild(table);",
    "interviewTips": [
      "Explain detaching the parent node or using `display: none` as classic techniques for complex multi-step table updates."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "HTML5 template Element Performance",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "Why is the HTML <template> element superior to hidden <div> tags for storing reusable DOM structures?",
    "shortAnswer": "Content inside a `<template>` is inactive: scripts do not execute, images and audio do not load, and nodes are not rendered in the active DOM tree until cloned with `content.cloneNode(true)`.",
    "detailedExplanation": "- **Resource Savings**: `<img src=\"large.jpg\">` inside `<div style=\"display:none\">` will still download the image over the network, whereas `<template>` will not download until instantiated.\n- **DocumentFragment**: The `.content` property of a `<template>` is a native `DocumentFragment`.\n- **XSS Protection**: Markup inside `<template>` is inert until explicitly activated.",
    "codeExample": "<template id=\"row-template\">\n  <tr class=\"data-row\">\n    <td class=\"id\"></td>\n    <td class=\"name\"></td>\n  </tr>\n</template>\n\n<script>\nconst template = document.querySelector('#row-template');\nconst clone = template.content.cloneNode(true); // Fast clone!\nclone.querySelector('.name').textContent = 'Alice';\ndocument.querySelector('tbody').appendChild(clone);\n</script>",
    "interviewTips": [
      "Key benefit: `<template>` prevents images, media, and scripts from executing until explicitly cloned."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "Pixel Pipeline: Composite Layers and z-index",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What causes the browser to create a new Compositing Layer for a DOM element?",
    "shortAnswer": "Browsers create separate compositing layers for elements with 3D transforms (`translate3d`), CSS `will-change`, active CSS animations, `<video>` or `<canvas>` elements, or elements stacked above composite layers via `z-index`.",
    "detailedExplanation": "- **Compositor Promotion**: Uploads element bitmap data to the GPU as an independent texture.\n- **Layer Squashing**: Browsers try to merge layers to conserve GPU memory, but excessive layers create overhead.\n- **Layer Explosion Bug**: High `z-index` elements on top of animated layers are also forced into separate GPU layers, exhausting mobile memory.",
    "codeExample": "/* Forces browser to allocate a separate GPU compositing layer: */\n.floating-action-button {\n  transform: translateZ(0);\n  will-change: transform;\n}",
    "interviewTips": [
      "Mention the 'Layer Explosion' phenomenon: overlapping elements inherit layer promotion, consuming massive GPU RAM."
    ]
  },
  {
    "topic": "Forms & Interactive Components",
    "subtopic": "Simulating Custom Form Submissions with URLSearchParams",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you serialize an HTML form into a URL-encoded query string for GET requests or application/x-www-form-urlencoded endpoints?",
    "shortAnswer": "Pass the `FormData` instance directly into the `URLSearchParams` constructor: `new URLSearchParams(new FormData(form)).toString()`.",
    "detailedExplanation": "- **Clean Serialization**: Automatically handles percent-encoding for spaces, symbols, and special characters.\n- **No Loop Required**: Replaces manual string concatenation and `encodeURIComponent` loops.\n- **URL Query Updates**: Easily appended to URL objects for shareable search filter links.",
    "codeExample": "const filterForm = document.querySelector('#filter-form');\n\nfunction getEncodedQueryString() {\n  const formData = new FormData(filterForm);\n  const params = new URLSearchParams(formData);\n  return params.toString(); // e.g. 'category=books&sort=price_asc&in_stock=true'\n}",
    "interviewTips": [
      "Highlight `new URLSearchParams(new FormData(form)).toString()` as the cleanest modern one-liner for form serialization."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "requestIdleCallback for Non-Essential DOM Tasks",
    "difficulty": "INTERMEDIATE",
    "questionType": "PERFORMANCE",
    "question": "What is window.requestIdleCallback() and when should it be used for DOM operations?",
    "shortAnswer": "`window.requestIdleCallback(callback)` schedules background tasks to execute only during periods when the browser main thread is completely idle between frame renderings.",
    "detailedExplanation": "- **Idle Period Budget**: Passes an `IdleDeadline` object exposing `deadline.timeRemaining()` indicating milliseconds left in the current idle frame.\n- **Use Cases**: Logging analytics, pre-rendering offscreen templates, and caching DOM elements without degrading input responsiveness.\n- **timeout Option**: Can specify `{ timeout: 2000 }` to force execution if the browser remains busy.",
    "codeExample": "window.requestIdleCallback((deadline) => {\n  while (deadline.timeRemaining() > 0 && tasksQueue.length > 0) {\n    processNextAnalyticsEntry(tasksQueue.shift());\n  }\n}, { timeout: 2000 });",
    "interviewTips": [
      "Distinguish: `requestAnimationFrame` runs before the next frame paint; `requestIdleCallback` runs during downtime after paints."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "Debouncing High-Frequency DOM Events",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you implement a debounce function to limit DOM re-renders during window resize or input typing?",
    "shortAnswer": "Wrap the handler in a closure that resets a `setTimeout` timer on every trigger, executing the actual DOM update only after events have ceased for the specified delay.",
    "detailedExplanation": "- **Event Flooding**: `resize` and `scroll` can fire dozens of times per second, overloading DOM layouts.\n- **Debounce Mechanism**: Defers execution until user activity pauses for a cooldown window (e.g. 250ms).\n- **Contrast with Throttle**: Debounce waits for silence; throttle guarantees execution at fixed intervals.",
    "codeExample": "function debounce(func, delay = 250) {\n  let timeoutId;\n  return (...args) => {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => func(...args), delay);\n  };\n}\n\nwindow.addEventListener('resize', debounce(() => {\n  console.log('Window resized: updating layout');\n  recalculateLayout();\n}, 300));",
    "interviewTips": [
      "Be ready to code a debounce function from scratch on a whiteboard during frontend interviews."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "Throttling DOM Scroll Events",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How does a throttle function work and why is it preferred over debounce for scroll progress indicators?",
    "shortAnswer": "A throttle function guarantees that the callback is executed at most once every specified time interval, providing continuous feedback while preventing event handler saturation.",
    "detailedExplanation": "- **Continuous Updates**: Progress bars and infinite scroll require continuous updates during scrolling, which debounce fails to provide.\n- **Execution Frequency**: E.g. Throttling at 100ms guarantees at most 10 executions per second.\n- **rAF Alternative**: Using `requestAnimationFrame` flags is often even cleaner than time-based throttling for visual updates.",
    "codeExample": "function throttle(func, limit = 100) {\n  let inThrottle = false;\n  return (...args) => {\n    if (!inThrottle) {\n      func(...args);\n      inThrottle = true;\n      setTimeout(() => inThrottle = false, limit);\n    }\n  };\n}\n\nwindow.addEventListener('scroll', throttle(() => {\n  updateScrollProgressBar();\n}, 50));",
    "interviewTips": [
      "Remember: Debounce executes after activity stops; Throttle executes regularly at capped intervals."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "requestAnimationFrame Scroll Throttling Pattern",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do you throttle scroll or mousemove DOM updates using requestAnimationFrame?",
    "shortAnswer": "Set a boolean flag `let ticking = false` in the event handler, schedule a `requestAnimationFrame` on the first event, and reset the flag inside the rAF callback.",
    "detailedExplanation": "- **Frame Rate Alignment**: Locks DOM updates directly to screen refresh rate (60fps/120fps).\n- **Zero Wasted Cycles**: Eliminates timer drift associated with `setTimeout` throttles.\n- **Native Efficiency**: Browser skips rAF automatically if the tab is inactive.",
    "codeExample": "let isTicking = false;\n\nwindow.addEventListener('scroll', () => {\n  if (!isTicking) {\n    window.requestAnimationFrame(() => {\n      updateScrollIndicator(window.scrollY);\n      isTicking = false;\n    });\n    isTicking = true;\n  }\n}, { passive: true });",
    "interviewTips": [
      "Highlight this 'rAF ticking flag' pattern as the cleanest way to throttle scroll/resize handlers without utility libraries."
    ]
  },
  {
    "topic": "Forms & Interactive Components",
    "subtopic": "Handling Form Input Types (date, number, color)",
    "difficulty": "INTERMEDIATE",
    "questionType": "CODE",
    "question": "How do valueAsNumber and valueAsDate properties work on HTML5 inputs?",
    "shortAnswer": "`valueAsNumber` returns the input's value as a JavaScript `number` (or `NaN`), while `valueAsDate` returns a JavaScript `Date` object (or `null`), avoiding manual string parsing.",
    "detailedExplanation": "- **Avoids parseFloat**: Calling `input.valueAsNumber` on `<input type=\"number\">` directly yields a number primitive.\n- **Date Object**: `input.valueAsDate` on `<input type=\"date\">` returns a UTC `Date` instance.\n- **Type Safety**: Avoids string concatenation bugs like `'10' + 5 = '105'`.",
    "codeExample": "const ageInput = document.querySelector('input[type=\"number\"]');\nconst birthdayInput = document.querySelector('input[type=\"date\"]');\n\n// Direct number primitive (no parseInt required):\nconsole.log(typeof ageInput.valueAsNumber); // 'number'\n\n// Direct Date object:\nconsole.log(birthdayInput.valueAsDate instanceof Date); // true",
    "interviewTips": [
      "Mention `valueAsNumber` and `valueAsDate` as modern type-safe alternatives to parsing strings."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "Optimizing Large Lists with DOM Recycling",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "What is DOM recycling in virtualized lists (virtual scrolling) and why is it necessary for 100,000 items?",
    "shortAnswer": "DOM recycling renders only the small subset of elements visible in the viewport (~20 items), repositioning and reusing the same DOM nodes with new data as the user scrolls rather than creating 100,000 nodes.",
    "detailedExplanation": "- **Memory Protection**: 100,000 DOM nodes consume hundreds of megabytes of RAM and bog down browser tree traversals.\n- **Constant Node Count**: Total DOM nodes remain constant regardless of data set size.\n- **Transform Positioning**: Uses `transform: translateY(...)` on recycled row containers to place them at correct virtual scroll offsets.",
    "codeExample": "// Virtual list concept:\nconst TOTAL_ITEMS = 100000;\nconst VISIBLE_COUNT = 20;\nconst ROW_HEIGHT = 40;\n\n// Only 20 <tr> elements ever exist in the DOM!\nfunction renderWindow(scrollTop) {\n  const startIndex = Math.floor(scrollTop / ROW_HEIGHT);\n  // Populate the 20 pooled elements with items[startIndex ... startIndex + 20]\n}",
    "interviewTips": [
      "Explain that DOM node creation is memory-heavy, so recycling a pool of 20 elements is key to handling massive data sets."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "FastDOM Read/Write Batching Architecture",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "How does the FastDOM library eliminate layout thrashing under the hood?",
    "shortAnswer": "FastDOM maintains separate internal queues for DOM reads (`fastdom.measure`) and DOM writes (`fastdom.mutate`), executing all reads together before executing all writes in the next animation frame.",
    "detailedExplanation": "- **Measure Phase**: All tasks scheduled via `measure()` run sequentially during a clean read-only phase.\n- **Mutate Phase**: All tasks scheduled via `mutate()` run immediately after, batching all writes together.\n- **Single Reflow**: Enforces a single layout calculation per animation frame, regardless of how many components request reads and writes.",
    "codeExample": "// FastDOM ensures reads run first, writes run second:\nfastdom.measure(() => {\n  const height = card.offsetHeight; // Read queued\n  fastdom.mutate(() => {\n    card.style.height = `${height * 2}px`; // Write queued for next phase\n  });\n});",
    "interviewTips": [
      "Mention FastDOM's separation of 'measure' and 'mutate' queues as the architectural model for layout batching."
    ]
  },
  {
    "topic": "Forms & Interactive Components",
    "subtopic": "Custom Select Component Accessibility Essentials",
    "difficulty": "INTERMEDIATE",
    "questionType": "ACCESSIBILITY",
    "question": "What ARIA attributes and keyboard events are mandatory when replacing a native <select> with a custom DOM dropdown?",
    "shortAnswer": "The trigger needs `role=\"combobox\"`, `aria-haspopup=\"listbox\"`, and `aria-expanded`; the options container needs `role=\"listbox\"`; options need `role=\"option\"` and `aria-selected`; and keyboard navigation must support Arrow keys, Enter, and Escape.",
    "detailedExplanation": "- **aria-expanded**: Must toggle between `'true'` and `'false'` as the menu opens/closes.\n- **aria-activedescendant**: Points to the ID of the currently focused option to avoid shifting real DOM focus.\n- **Keyboard Support**: Up/Down arrows to navigate, Enter/Space to select, Esc to close and return focus to trigger.",
    "codeExample": "<!-- Accessible Custom Combobox Structure: -->\n<div role=\"combobox\" aria-expanded=\"false\" aria-haspopup=\"listbox\" tabindex=\"0\" id=\"combo\">\n  Select option\n</div>\n<ul role=\"listbox\" id=\"list\" hidden>\n  <li role=\"option\" aria-selected=\"false\" id=\"opt-1\">Option 1</li>\n  <li role=\"option\" aria-selected=\"false\" id=\"opt-2\">Option 2</li>\n</ul>",
    "interviewTips": [
      "Always list the ARIA roles (`combobox`, `listbox`, `option`) and keyboard arrow navigation when asked about custom dropdowns."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "Preventing Layout Shift (CLS) on Dynamic Elements",
    "difficulty": "INTERMEDIATE",
    "questionType": "PERFORMANCE",
    "question": "How do you prevent Cumulative Layout Shift (CLS) when loading dynamic DOM content and images?",
    "shortAnswer": "Reserve layout space in advance by specifying explicit `width` and `height` attributes or CSS `aspect-ratio` on containers and skeleton placeholders before dynamic content loads.",
    "detailedExplanation": "- **Explicit Aspect Ratio**: Setting `aspect-ratio: 16 / 9` on image wrappers holds the exact space before image bytes arrive.\n- **Skeleton Placeholders**: Render sized placeholder skeletons instead of inserting elements from 0px height.\n- **Web Fonts**: Use `font-display: swap` paired with font metric overrides (`size-adjust`) to avoid layout jumps when fonts load.",
    "codeExample": "/* Prevents layout shift while hero image downloads: */\n.hero-banner-container {\n  width: 100%;\n  aspect-ratio: 16 / 9;\n  background-color: #f1f5f9; /* Skeleton background placeholder */\n}",
    "interviewTips": [
      "Tie layout shifts directly to Google's Core Web Vitals metric: CLS (Cumulative Layout Shift)."
    ]
  },
  {
    "topic": "Forms & Interactive Components",
    "subtopic": "Handling Form Enter Key in Single vs Multi-Input Forms",
    "difficulty": "INTERMEDIATE",
    "questionType": "CONCEPTUAL",
    "question": "Why does pressing Enter in a single text input submit the form automatically, and how do you customize this behavior?",
    "shortAnswer": "The HTML specification mandates 'implicit submission': if a form contains exactly one text field, pressing Enter submits it automatically even without a submit button. Intercept this by calling `event.preventDefault()` in `keydown`.",
    "detailedExplanation": "- **Implicit Submission Spec**: Designed so simple single-field search forms work with Enter without needing visible submit buttons.\n- **Multi-Input Forms**: In forms with multiple inputs, pressing Enter activates the first button with `type=\"submit\"` in tree order.\n- **Preventing Accidental Submissions**: In multi-step wizards, prevent Enter keydown on inputs unless on the final step.",
    "codeExample": "form.addEventListener('keydown', (e) => {\n  if (e.key === 'Enter' && e.target.tagName === 'INPUT') {\n    // Prevents accidental form submission on Enter:\n    e.preventDefault();\n    moveToNextStep();\n  }\n});",
    "interviewTips": [
      "Mention HTML's 'implicit submission' rule for single-input forms as a key browser specification detail."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "insertAdjacentElement vs appendChild Performance",
    "difficulty": "INTERMEDIATE",
    "questionType": "PERFORMANCE",
    "question": "How does insertAdjacentElement compare to appendChild in versatility and speed?",
    "shortAnswer": "`insertAdjacentElement()` provides four precise insertion targets (`beforebegin`, `afterbegin`, `beforeend`, `afterend`) directly on the target element, performing at comparable high speeds to `appendChild`.",
    "detailedExplanation": "- **Target Flexibility**: `appendChild()` can only insert at the end of children. `insertAdjacentElement('beforebegin', el)` inserts as a previous sibling without accessing `parentNode`.\n- **No HTML Parsing**: Takes an existing DOM element directly (unlike `insertAdjacentHTML`, which parses string markup).\n- **High Performance**: Native C++ node insertion without string tokenization.",
    "codeExample": "const card = document.querySelector('.card');\nconst badge = document.createElement('span');\nbadge.className = 'badge';\nbadge.textContent = 'New';\n\n// Inserts badge immediately BEFORE the card in the DOM tree:\ncard.insertAdjacentElement('beforebegin', badge);",
    "interviewTips": [
      "List the 4 positions for `insertAdjacentElement`: `beforebegin`, `afterbegin`, `beforeend`, `afterend`."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "Painting Profiler & Chrome DevTools Rendering Tab",
    "difficulty": "DIFFICULT",
    "questionType": "PERFORMANCE",
    "question": "How do you identify unnecessary repaints and reflows using Chrome DevTools?",
    "shortAnswer": "Open Chrome DevTools -> More Tools -> Rendering, and enable 'Paint Flashing' (highlights repainted areas in green) and 'Layout Shift Regions' (highlights reflow shifts in blue).",
    "detailedExplanation": "- **Paint Flashing**: Green flashes reveal which rectangular regions of the screen are repainting. Ideal UI should only flash modified elements, not entire pages.\n- **Layer Borders**: Visualizes GPU compositing layers with orange/cyan outlines to spot layer explosion.\n- **Performance Tab**: Records frame-by-frame breakdowns of Recalculate Style, Layout, Paint, and Composite Layers.",
    "codeExample": "// Diagnosing layout cost in console:\nconsole.time('heavy-dom-operation');\nperformBulkDomUpdate();\nconsole.timeEnd('heavy-dom-operation');",
    "interviewTips": [
      "Demonstrate senior troubleshooting expertise by referencing DevTools 'Paint Flashing' and 'Layer Borders'."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "CSS Subtree Containment & Style Invalidation",
    "difficulty": "DIFFICULT",
    "questionType": "PERFORMANCE",
    "question": "How does the browser engine determine the scope of style invalidation when a CSS class is toggled on a DOM node?",
    "shortAnswer": "The browser invalidates the computed styles of the mutated element and any descendant elements matching selector rules; if the selector affects siblings or ancestors (e.g. `+`, `~`, or `:has()`), wider invalidation cascades across the tree.",
    "detailedExplanation": "- **Selector Complexity**: Complex combinators (e.g. `.dark-mode *` or `:has(.invalid)`) force the engine to re-evaluate styles across vast portions of the DOM.\n- **BEM Benefits**: Flat, single-class selectors (like `.btn--active`) limit style invalidation to the single element and its immediate children.\n- **Modern :has() Engine**: Browsers use bloom filters and dependency graphs to optimize `:has()`, but deeply nested ancestor checks still carry invalidation costs.",
    "codeExample": "/* High invalidation cost (affects thousands of descendant nodes): */\nbody.theme-dark * { color: #fff; }\n\n/* Low invalidation cost (targeted class mutation): */\n.theme-dark { color: #fff; }",
    "interviewTips": [
      "Explain why flat class architectures like BEM are performance optimizations for the browser's style invalidation engine."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "CSS Houdini Paint API and DOM Rendering",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "What is the CSS Houdini Paint API and how does it hook directly into the browser's render pipeline?",
    "shortAnswer": "The CSS Paint API allows developers to write JavaScript PaintWorklets that draw custom vector graphics directly into an element's background or border during the browser's native Paint phase.",
    "detailedExplanation": "- **Direct Pipeline Hook**: Runs in a Worklet thread off the main thread, bypassing DOM tree node creation entirely.\n- **No Extra Nodes**: Renders custom shapes, patterns, and dynamic ripples without injecting extra wrapper `<div>` or `<canvas>` elements into the DOM.\n- **CSS Integration**: Invoked via `background-image: paint(myPainterName)` in standard CSS.",
    "codeExample": "// Registered in a paint worklet file (paint-worklet.js):\nclass BubblePainter {\n  paint(ctx, geometry, properties) {\n    ctx.fillStyle = '#3b82f6';\n    ctx.fillRect(0, 0, geometry.width, geometry.height);\n  }\n}\nregisterPaint('bubble-bg', BubblePainter);",
    "interviewTips": [
      "Highlight Houdini as an API that hooks directly into the browser's C++ rendering engine without touching DOM nodes."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "OffscreenCanvas and DOM Decoupling",
    "difficulty": "DIFFICULT",
    "questionType": "PERFORMANCE",
    "question": "How does OffscreenCanvas allow heavy rendering to occur off the main DOM thread?",
    "shortAnswer": "`OffscreenCanvas` allows canvas rendering contexts to be transferred to a Web Worker via `canvas.transferControlToOffscreen()`, executing heavy graphic rendering without blocking the main DOM thread.",
    "detailedExplanation": "- **Main Thread Protection**: Keeps 60fps UI responsiveness, scrolling, and clicks lag-free while rendering complex charts or 3D scenes in a background worker.\n- **Zero DOM Access in Worker**: Workers have no DOM access, but `OffscreenCanvas` renders pixels directly to the canvas element's buffer.\n- **Synchronization**: Browser synchronizes the worker's rendered frames automatically with the display refresh rate.",
    "codeExample": "const canvas = document.querySelector('#heavy-chart');\nconst offscreen = canvas.transferControlToOffscreen();\n\nconst worker = new Worker('chart-worker.js');\n// Sends canvas control to worker thread:\nworker.postMessage({ canvas: offscreen }, [offscreen]);",
    "interviewTips": [
      "Mention `OffscreenCanvas` as the ultimate architecture for high-concurrency data visualization on the web."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "Document Timeline & Web Animations API (WAAPI)",
    "difficulty": "DIFFICULT",
    "questionType": "CODE",
    "question": "How does the Web Animations API (element.animate()) compare to CSS transitions and requestAnimationFrame in performance?",
    "shortAnswer": "The Web Animations API executes directly on the browser's compositor thread (for transform and opacity), providing JavaScript programmatic control (play, pause, reverse, finish) without running rAF loops on the main thread.",
    "detailedExplanation": "- **Native Threading**: Runs on the compositor thread just like pure CSS animations.\n- **Promise Integration**: Returns an `Animation` object with an `animation.finished` Promise.\n- **Dynamic Values**: Unlike CSS keyframes which are static, WAAPI allows injecting dynamic runtime coordinate values directly into keyframe arrays.",
    "codeExample": "const card = document.querySelector('.card');\n\nconst animation = card.animate([\n  { transform: 'translateY(0px)', opacity: 1 },\n  { transform: `translateY(${targetY}px)`, opacity: 0 }\n], {\n  duration: 400,\n  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',\n  fill: 'forwards'\n});\n\n// Await animation completion:\nanimation.finished.then(() => card.remove());",
    "interviewTips": [
      "Highlight `element.animate()` as having the performance of CSS animations combined with the programmatic control of JavaScript."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "Fine-Grained DOM Reactivity without Virtual DOM",
    "difficulty": "DIFFICULT",
    "questionType": "CONCEPTUAL",
    "question": "How do modern signals-based reactivity engines (SolidJS, Svelte 5, Angular Signals) update the DOM without Virtual DOM diffing?",
    "shortAnswer": "They compile reactive expressions into granular subscriber functions that bind directly to exact DOM Text nodes or element properties; when a signal mutates, only the single affected DOM node is updated surgically.",
    "detailedExplanation": "- **Direct Pointer Binding**: The compiler links a reactive signal directly to `textNode.data = newText`.\n- **Zero Component Re-renders**: Components run once to set up the DOM graph and never re-execute.\n- **No Diffing**: Skips creating virtual tree objects and comparing snapshots, yielding faster updates and lower memory footprint.",
    "codeExample": "// Compiled Signal update under the hood:\nconst textNode = document.createTextNode(count());\ncreateEffect(() => {\n  // Surgical update: Only this single text node is touched!\n  textNode.data = count();\n});",
    "interviewTips": [
      "Explain the shift in modern frontend architecture from VDOM diffing to fine-grained signals with direct DOM node updates."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "Memory Leak from Retained Detached Event Closures",
    "difficulty": "DIFFICULT",
    "questionType": "PERFORMANCE",
    "question": "Explain how a closure inside an addEventListener callback can accidentally retain an entire large dataset in memory even after the DOM element is removed.",
    "shortAnswer": "If an event listener callback references a variable in its enclosing lexical scope, the entire scope object (and all variables within it, including large arrays) is retained in memory as long as the listener or element reference survives.",
    "detailedExplanation": "- **Lexical Environment Retention**: JavaScript engines retain the shared scope context for closures.\n- **Global/Window Listeners**: If `window.addEventListener('resize', () => { el.doSomething(hugeData); })` is created, `hugeData` and `el` are permanently pinned in memory.\n- **Resolution**: Clear closures, unregister listeners with `removeEventListener` or `AbortSignal`, and set references to `null`.",
    "codeExample": "function setupTelemetry(element) {\n  const hugeDataset = new Array(1000000).fill('sensor-data');\n  \n  // LEAK: Listener attached to window retains hugeDataset forever!\n  window.addEventListener('scroll', () => {\n    if (element.isConnected) {\n      console.log('Active sensor:', hugeDataset[0]);\n    }\n  });\n}",
    "interviewTips": [
      "Point out that the closure retains ALL variables in the scope, not just the single variable you meant to read."
    ]
  },
  {
    "topic": "Forms & Interactive Components",
    "subtopic": "Custom Form Controls and Accesskeys/Shortcut Collisions",
    "difficulty": "DIFFICULT",
    "questionType": "ACCESSIBILITY",
    "question": "Why is the HTML accesskey attribute generally avoided in modern web applications?",
    "shortAnswer": "The `accesskey` attribute frequently conflicts with operating system shortcuts, browser menu hotkeys, and assistive screen reader key commands, causing unpredictable behavior across platforms.",
    "detailedExplanation": "- **Platform Discrepancies**: Accesskey triggers differently on Chrome (Alt+Key on Windows, Ctrl+Alt+Key on Mac) vs Firefox.\n- **Screen Reader Clashes**: Directly overwrites screen reader navigation commands (e.g. JAWS, NVDA table reading shortcuts).\n- **Modern Alternative**: Custom keyboard listeners with clear visual indicators (e.g. `Cmd+K` command bars) with explicit collision checks.",
    "codeExample": "<!-- Problematic (conflicts with browser and screen reader keys): -->\n<!-- <button accesskey=\"s\">Save</button> -->\n\n<!-- Recommended: Explicit documented keyboard shortcut with modifier check: -->\nwindow.addEventListener('keydown', (e) => {\n  if ((e.ctrlKey || e.metaKey) && e.key === 's') {\n    e.preventDefault();\n    saveDocument();\n  }\n});",
    "interviewTips": [
      "Cite screen reader hotkey collisions as the primary reason why accessibility experts avoid `accesskey`."
    ]
  },
  {
    "topic": "DOM Performance, Reflow & Repaint",
    "subtopic": "Layout Instability API and CLS Calculation",
    "difficulty": "DIFFICULT",
    "questionType": "PERFORMANCE",
    "question": "How does the Layout Instability API measure layout shifts programmatically in the browser?",
    "shortAnswer": "Using a `PerformanceObserver` observing `'layout-shift'` entries, which report `entry.value`, `entry.hadRecentInput`, and `entry.sources` identifying which DOM nodes moved unexpectedly.",
    "detailedExplanation": "- **hadRecentInput**: Layout shifts occurring within 500ms of user input (click, keystroke) are excluded from CLS penalties.\n- **entry.sources**: Returns an array of `LayoutShiftAttribution` objects showing the affected DOM nodes and previous/current bounding rects.\n- **Core Web Vitals**: Powers Google's CLS monitoring in production monitoring scripts.",
    "codeExample": "const observer = new PerformanceObserver((list) => {\n  for (const entry of list.getEntries()) {\n    if (!entry.hadRecentInput) {\n      console.log('Layout shift detected! Score:', entry.value);\n      console.log('Shifting DOM node:', entry.sources[0]?.node);\n    }\n  }\n});\nobserver.observe({ type: 'layout-shift', buffered: true });",
    "interviewTips": [
      "Highlight `hadRecentInput`—shifts caused by deliberate user clicks are ignored by the CLS scoring algorithm."
    ]
  },
  {
    "topic": "Forms & Interactive Components",
    "subtopic": "File API Stream Processing with ReadableStream",
    "difficulty": "DIFFICULT",
    "questionType": "CODE",
    "question": "How do you process a multi-gigabyte file selected via <input type=\"file\"> without crashing browser memory?",
    "shortAnswer": "Read the file as a stream via `file.stream()`, processing data chunks incrementally using a `ReadableStreamDefaultReader` rather than loading the entire file into memory with `file.text()`.",
    "detailedExplanation": "- **Memory Overload**: Calling `file.text()` or `file.arrayBuffer()` on a 2GB file will crash the browser tab with an Out-Of-Memory error.\n- **Streaming Architecture**: `file.stream()` streams chunks (Uint8Arrays) into memory one buffer at a time.\n- **Progressive Upload**: Allows streaming chunks over HTTP using fetch streams or computing SHA-256 hashes incrementally.",
    "codeExample": "const fileInput = document.querySelector('input[type=\"file\"]');\n\nfileInput.addEventListener('change', async () => {\n  const file = fileInput.files[0];\n  const stream = file.stream();\n  const reader = stream.getReader();\n  \n  let bytesRead = 0;\n  while (true) {\n    const { done, value } = await reader.read();\n    if (done) break;\n    bytesRead += value.length;\n    console.log(`Streamed ${bytesRead} of ${file.size} bytes`);\n  }\n});",
    "interviewTips": [
      "Contrast `file.stream()` with `file.text()` to explain how to handle gigabyte-sized files safely in frontend code."
    ]
  }
];
