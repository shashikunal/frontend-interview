// scripts/dom-gen/part7-scenarios.cjs
// 50 High-Value, Unique DOM Scenario Interview Questions
// Distribution: 50 SCENARIO

module.exports = [
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Accessible Modal Dialog with Keyboard Focus Trap",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build an accessible modal dialog in vanilla JavaScript that traps keyboard Tab focus inside the modal, closes on Escape, and restores focus to the trigger button when closed.",
    "shortAnswer": "Save `document.activeElement` before opening, query all focusable elements inside the modal, intercept Tab/Shift+Tab to loop focus between first and last elements, listen for Escape to close, and return focus to the trigger on close.",
    "detailedExplanation": "- **Focus Preservation**: Storing `previouslyFocusedElement = document.activeElement` ensures keyboard users return to their exact location in the DOM.\n- **Focus Trap Loop**: When Tab is pressed on the last focusable element, redirect focus to the first element; on Shift+Tab on the first element, redirect to the last.\n- **Keyboard Escape**: Listen for `e.key === 'Escape'` to dismiss the modal.\n- **Native Alternative**: Can also be achieved natively using `<dialog>` with `showModal()`.",
    "codeExample": "function openModal(modalEl) {\n  const prevFocus = document.activeElement;\n  const focusables = modalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])');\n  const first = focusables[0];\n  const last = focusables[focusables.length - 1];\n\n  modalEl.classList.add('open');\n  first?.focus();\n\n  function handleKeyDown(e) {\n    if (e.key === 'Escape') closeModal();\n    if (e.key === 'Tab') {\n      if (e.shiftKey && document.activeElement === first) {\n        e.preventDefault();\n        last.focus();\n      } else if (!e.shiftKey && document.activeElement === last) {\n        e.preventDefault();\n        first.focus();\n      }\n    }\n  }\n\n  function closeModal() {\n    modalEl.classList.remove('open');\n    modalEl.removeEventListener('keydown', handleKeyDown);\n    prevFocus?.focus(); // Restores focus to trigger\n  }\n\n  modalEl.addEventListener('keydown', handleKeyDown);\n}",
    "interviewTips": [
      "Always explain: 1) Save previous focus, 2) Trap Tab and Shift+Tab, 3) Listen for Escape, 4) Restore previous focus."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Infinite Scroll Feed with IntersectionObserver",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Implement an infinite scrolling product feed that loads the next batch of items when a bottom sentinel element enters the viewport, avoiding duplicate network requests.",
    "shortAnswer": "Place an empty `<div id=\"sentinel\">` at the bottom of the list and watch it with an `IntersectionObserver`. When intersecting and not currently loading, set a `loading` lock flag, fetch data, append cards, and reset the flag.",
    "detailedExplanation": "- **Sentinel Node**: A zero-height marker positioned immediately after the list items.\n- **Concurrency Guard**: A boolean `isLoading` flag prevents duplicate simultaneous fetches if the user triggers multiple observer entries.\n- **rootMargin Buffer**: Setting `rootMargin: '300px'` fetches content 300px before the user hits the bottom for seamless UX.",
    "codeExample": "let isLoading = false;\nlet page = 1;\nconst container = document.querySelector('#feed');\nconst sentinel = document.querySelector('#sentinel');\n\nconst observer = new IntersectionObserver(async ([entry]) => {\n  if (entry.isIntersecting && !isLoading) {\n    isLoading = true;\n    sentinel.textContent = 'Loading more items...';\n    try {\n      const items = await fetchItems(page++);\n      const frag = document.createDocumentFragment();\n      items.forEach(item => frag.appendChild(renderCard(item)));\n      container.insertBefore(frag, sentinel);\n    } finally {\n      isLoading = false;\n      sentinel.textContent = '';\n    }\n  }\n}, { rootMargin: '300px' });\n\nobserver.observe(sentinel);",
    "interviewTips": [
      "Highlight the `isLoading` lock flag and the `rootMargin` pre-fetch buffer as crucial production details."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Live Search with Debounce and AbortController",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a search autocomplete dropdown that debounces user keystrokes by 300ms, cancels in-flight fetch requests if a new keystroke occurs, and renders suggestions safely.",
    "shortAnswer": "Use a debounce timer to wait 300ms after the last `input` event, abort the previous request via `abortController.abort()`, create a new controller, fetch suggestions, and render using `replaceChildren()`.",
    "detailedExplanation": "- **Race Condition Defense**: Fast typing can cause slow earlier network requests to resolve after faster newer ones; cancelling in-flight requests with `AbortController` guarantees latest data wins.\n- **Debouncing**: Avoids spamming the backend API with requests for every single character.\n- **XSS Prevention**: Use `textContent` for suggestion labels to prevent script execution.",
    "codeExample": "let currentController = null;\nlet debounceTimer = null;\nconst input = document.querySelector('#search');\nconst resultsList = document.querySelector('#results');\n\ninput.addEventListener('input', (e) => {\n  const query = e.target.value.trim();\n  clearTimeout(debounceTimer);\n  if (!query) { resultsList.replaceChildren(); return; }\n\n  debounceTimer = setTimeout(async () => {\n    // Cancel previous ongoing fetch:\n    currentController?.abort();\n    currentController = new AbortController();\n\n    try {\n      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {\n        signal: currentController.signal\n      });\n      const data = await res.json();\n      renderSuggestions(data);\n    } catch (err) {\n      if (err.name !== 'AbortError') console.error(err);\n    }\n  }, 300);\n});",
    "interviewTips": [
      "Mentioning `AbortController` alongside debounce immediately elevates your answer to senior level."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Drag and Drop Sortable List",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Implement a reorderable sortable list using the native HTML5 Drag and Drop API with visual dragging states.",
    "shortAnswer": "Set `draggable=\"true\"` on list items, track the dragged element on `dragstart`, calculate insertion positions in `dragover` using element vertical midpoints, and re-insert with `list.insertBefore()`.",
    "detailedExplanation": "- **dragstart**: Store reference `draggedItem = e.target` and add a CSS `.dragging` opacity class.\n- **dragover**: Call `e.preventDefault()` to enable dropping; calculate whether the cursor is above or below the hovered sibling's midpoint to insert before or after.\n- **dragend**: Remove `.dragging` styling and persist the new order.",
    "codeExample": "const list = document.querySelector('#sortable-list');\nlet draggedItem = null;\n\nlist.addEventListener('dragstart', (e) => {\n  draggedItem = e.target.closest('li');\n  e.dataTransfer.effectAllowed = 'move';\n  setTimeout(() => draggedItem.classList.add('is-dragging'), 0);\n});\n\nlist.addEventListener('dragover', (e) => {\n  e.preventDefault();\n  const target = e.target.closest('li');\n  if (target && target !== draggedItem) {\n    const rect = target.getBoundingClientRect();\n    const midpoint = rect.top + rect.height / 2;\n    if (e.clientY < midpoint) {\n      list.insertBefore(draggedItem, target);\n    } else {\n      list.insertBefore(draggedItem, target.nextSibling);\n    }\n  }\n});\n\nlist.addEventListener('dragend', () => draggedItem?.classList.remove('is-dragging'));",
    "interviewTips": [
      "Explain the vertical midpoint calculation: `e.clientY < (rect.top + rect.height / 2)` determines insert-before vs insert-after."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Click Outside to Dismiss Custom Dropdown",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a reusable dropdown menu that toggles open on button click and automatically closes when the user clicks anywhere outside the menu or presses Escape.",
    "shortAnswer": "Toggle the `'open'` class on trigger click; attach a `click` listener to `document` that closes the menu if `!menu.contains(event.target)`, and handle `Escape` via `keydown`.",
    "detailedExplanation": "- **node.contains()**: Elegantly determines whether the clicked target is inside the dropdown container.\n- **Clean Unbinding**: Only listen to document click while the menu is open, or use a persistent delegated document handler.\n- **Event Timing**: Attach document click in `setTimeout(..., 0)` or check `e.target !== triggerBtn` so the opening click doesn't close it instantly.",
    "codeExample": "const dropdown = document.querySelector('.dropdown');\nconst trigger = dropdown.querySelector('.dropdown-trigger');\n\nfunction closeMenu() {\n  dropdown.classList.remove('is-open');\n  document.removeEventListener('click', onDocClick);\n  document.removeEventListener('keydown', onKeyDown);\n}\n\nfunction onDocClick(e) {\n  if (!dropdown.contains(e.target)) closeMenu();\n}\n\nfunction onKeyDown(e) {\n  if (e.key === 'Escape') closeMenu();\n}\n\ntrigger.addEventListener('click', (e) => {\n  const isOpen = dropdown.classList.toggle('is-open');\n  if (isOpen) {\n    document.addEventListener('click', onDocClick);\n    document.addEventListener('keydown', onKeyDown);\n  } else {\n    closeMenu();\n  }\n});",
    "interviewTips": [
      "Always demonstrate unbinding the document listeners when the dropdown closes to prevent memory leaks."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Single-Open Accordion with Details and Summary",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Create an FAQ accordion using native <details> tags where expanding one item automatically collapses all other open items (exclusive accordion).",
    "shortAnswer": "Listen for the `toggle` event on all `<details>` elements; when an item opens (`item.open === true`), iterate over sibling items and set `otherItem.open = false`.",
    "detailedExplanation": "- **Native Semantic HTML**: Uses `<details>` and `<summary>` for built-in keyboard accessibility and screen reader support.\n- **toggle Event**: Fires when open status changes.\n- **Modern HTML `name` Attribute**: Modern browsers now support `<details name=\"faq\">` natively for exclusive accordions without any JavaScript!",
    "codeExample": "// Modern Zero-JS solution in modern HTML:\n// <details name=\"faq-group\"><summary>Q1</summary><p>A1</p></details>\n// <details name=\"faq-group\"><summary>Q2</summary><p>A2</p></details>\n\n// Resilient JavaScript Fallback:\nconst accordions = document.querySelectorAll('details.faq-item');\naccordions.forEach(target => {\n  target.addEventListener('toggle', () => {\n    if (target.open) {\n      accordions.forEach(other => {\n        if (other !== target && other.open) other.open = false;\n      });\n    }\n  });\n});",
    "interviewTips": [
      "Mention the new HTML5 `<details name=\"group\">` attribute as the modern native exclusive accordion standard."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Virtual Scrolling List for 50,000 Items",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Design a virtual scrolling list capable of smoothly rendering 50,000 rows without browser lag or memory exhaustion.",
    "shortAnswer": "Create a tall container matching the total virtual height (`50000 * rowHeight`), listen for scroll events throttled by rAF, compute visible start and end indices based on `scrollTop`, and render only the ~20 visible rows positioned via `transform: translateY()`.",
    "detailedExplanation": "- **Virtual Spacer**: An empty container with height `totalItems * rowHeight` keeps the scrollbar proportionate.\n- **Visible Window**: `startIndex = Math.floor(scrollTop / rowHeight)`, `endIndex = startIndex + visibleCount + buffer`.\n- **Pool Rendering**: Only ~20-30 DOM elements ever exist, repositioned using GPU-accelerated CSS `transform`.",
    "codeExample": "const ROW_HEIGHT = 40;\nconst VISIBLE_COUNT = 25;\nconst BUFFER = 5;\nconst totalItems = 50000;\n\nconst viewport = document.querySelector('#viewport');\nconst spacer = document.querySelector('#spacer');\nconst content = document.querySelector('#content');\n\nspacer.style.height = `${totalItems * ROW_HEIGHT}px`;\n\nfunction renderWindow() {\n  const scrollTop = viewport.scrollTop;\n  const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);\n  const end = Math.min(totalItems, start + VISIBLE_COUNT + (BUFFER * 2));\n\n  content.style.transform = `translateY(${start * ROW_HEIGHT}px)`;\n  content.replaceChildren();\n  for (let i = start; i < end; i++) {\n    const row = document.createElement('div');\n    row.className = 'virtual-row';\n    row.textContent = `Row #${i + 1}: Data item`;\n    content.appendChild(row);\n  }\n}\nviewport.addEventListener('scroll', () => requestAnimationFrame(renderWindow));\nrenderWindow();",
    "interviewTips": [
      "Clearly outline the 3 parts: 1) Total height spacer, 2) Visible slice computation, 3) Transform offset."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Interactive Star Rating Widget",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a 5-star rating widget in vanilla JavaScript supporting hover preview, click selection, keyboard Arrow navigation, and form value submission.",
    "shortAnswer": "Render 5 buttons with `role=\"radio\"`, track `currentRating` and `hoverRating`, update visual star fills on `mouseenter`/`mouseleave`, and update state and hidden form input on click/keydown.",
    "detailedExplanation": "- **Accessibility**: Container has `role=\"radiogroup\"`, stars have `role=\"radio\"` and `aria-checked`.\n- **Hover State**: Highlights stars up to the hovered index without committing the rating.\n- **Form Integration**: Updates a hidden `<input name=\"rating\" type=\"hidden\">` for native form submissions.",
    "codeExample": "const container = document.querySelector('#star-rating');\nconst hiddenInput = document.querySelector('#rating-val');\nconst stars = container.querySelectorAll('.star-btn');\nlet selectedRating = 0;\n\nfunction renderStars(rating) {\n  stars.forEach((star, idx) => {\n    star.classList.toggle('filled', idx < rating);\n    star.setAttribute('aria-checked', idx < rating ? 'true' : 'false');\n  });\n}\n\ncontainer.addEventListener('mouseover', (e) => {\n  const star = e.target.closest('.star-btn');\n  if (star) renderStars(Number(star.dataset.value));\n});\n\ncontainer.addEventListener('mouseleave', () => renderStars(selectedRating));\n\ncontainer.addEventListener('click', (e) => {\n  const star = e.target.closest('.star-btn');\n  if (star) {\n    selectedRating = Number(star.dataset.value);\n    hiddenInput.value = selectedRating;\n    renderStars(selectedRating);\n  }\n});",
    "interviewTips": [
      "Include keyboard accessibility (Arrow keys) and hidden input syncing when writing this widget."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Auto-Resizing Textarea",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Implement an auto-growing <textarea> that expands its height smoothly as the user types multiple lines and shrinks when content is deleted.",
    "shortAnswer": "On every `input` event, temporarily set `textarea.style.height = 'auto'`, then set `textarea.style.height = textarea.scrollHeight + 'px'`.",
    "detailedExplanation": "- **The Shrink Trap**: Setting height to `scrollHeight` directly allows growing, but prevents shrinking when text is deleted.\n- **Resetting to Auto**: Setting `height = 'auto'` forces the browser to recalculate the minimum required `scrollHeight` accurately.\n- **CSS Box-Sizing**: Ensure `box-sizing: border-box` is set in CSS to account for padding correctly.",
    "codeExample": "const textarea = document.querySelector('#auto-grow-textarea');\n\nfunction autoResize() {\n  // 1. Reset height to auto to calculate true scrollHeight after deletions:\n  textarea.style.height = 'auto';\n  // 2. Set height to match new content scrollHeight:\n  textarea.style.height = `${textarea.scrollHeight}px`;\n}\n\ntextarea.addEventListener('input', autoResize);\nautoResize(); // Initial sizing on page load",
    "interviewTips": [
      "Remember step 1: Setting `height = 'auto'` is the secret to allowing the textarea to shrink when text is deleted."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Multi-Step Form Wizard with Validation",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a multi-step checkout wizard (Step 1 -> Step 2 -> Step 3) that validates fields in the active step before allowing the user to proceed to the next step.",
    "shortAnswer": "Group steps into separate `<fieldset>` containers; on 'Next' click, run `stepFieldset.querySelectorAll(':invalid')` or `input.checkValidity()`. If valid, increment the step index and toggle step visibility.",
    "detailedExplanation": "- **Step Validation**: Validate only inputs within the current active step using `input.reportValidity()`.\n- **Progress Bar**: Update visual progress indicators and aria attributes (`aria-current=\"step\"`).\n- **Preventing Premature Submission**: Disable Enter key submissions until on the final step.",
    "codeExample": "let currentStep = 0;\nconst steps = document.querySelectorAll('.wizard-step');\nconst nextBtn = document.querySelector('#next-step-btn');\n\nfunction validateCurrentStep() {\n  const activeInputs = steps[currentStep].querySelectorAll('input, select, textarea');\n  for (const input of activeInputs) {\n    if (!input.checkValidity()) {\n      input.reportValidity(); // Shows native error tooltip\n      return false;\n    }\n  }\n  return true;\n}\n\nnextBtn.addEventListener('click', () => {\n  if (!validateCurrentStep()) return;\n  \n  steps[currentStep].classList.remove('active');\n  currentStep++;\n  steps[currentStep].classList.add('active');\n});",
    "interviewTips": [
      "Explain validating only inputs in the current step using `stepElement.querySelectorAll('input')`."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Image Zoom Lens on Mouse Hover",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build an e-commerce product image zoom lens that shows a magnified preview window following the user's cursor.",
    "shortAnswer": "Track cursor offset relative to the image using `getBoundingClientRect()`, clamp coordinates within boundaries, move a visual lens `<div>`, and offset the high-resolution background image in a zoom preview pane by the zoom ratio.",
    "detailedExplanation": "- **Cursor Calculation**: `x = e.clientX - imgRect.left`, `y = e.clientY - imgRect.top`.\n- **Boundary Clamping**: Clamp lens coordinates so it doesn't extend beyond the product image edges.\n- **Background Offset**: Move preview background by `-x * zoomRatio` and `-y * zoomRatio`.",
    "codeExample": "const img = document.querySelector('#product-img');\nconst preview = document.querySelector('#zoom-preview');\nconst ZOOM = 2.5;\n\nimg.addEventListener('mousemove', (e) => {\n  const rect = img.getBoundingClientRect();\n  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));\n  const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));\n\n  preview.style.backgroundPosition = `-${x * ZOOM}px -${y * ZOOM}px`;\n});",
    "interviewTips": [
      "Mention clamping coordinates `Math.max(0, Math.min(pos, max))` to keep the zoom lens inside image boundaries."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Copy to Clipboard Button with Feedback",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Implement a 'Copy Code' button with animated 'Copied!' checkmark feedback and error handling.",
    "shortAnswer": "Read text from the code block, invoke `await navigator.clipboard.writeText(text)`, toggle a `'copied'` CSS class with a checkmark icon, and revert after a 2-second timeout.",
    "detailedExplanation": "- **Clipboard API**: Modern `navigator.clipboard.writeText()`.\n- **Timeout Reset**: Clear previous timers to handle rapid repeated clicks cleanly.\n- **Fallback Support**: Gracefully alert the user if clipboard permissions are denied.",
    "codeExample": "function attachCopyHandler(button, codeBlock) {\n  let resetTimer;\n  button.addEventListener('click', async () => {\n    try {\n      await navigator.clipboard.writeText(codeBlock.textContent);\n      button.textContent = 'Copied!';\n      button.classList.add('copied');\n      \n      clearTimeout(resetTimer);\n      resetTimer = setTimeout(() => {\n        button.textContent = 'Copy';\n        button.classList.remove('copied');\n      }, 2000);\n    } catch (err) {\n      button.textContent = 'Failed';\n    }\n  });\n}",
    "interviewTips": [
      "Remember to call `clearTimeout(resetTimer)` to handle rapid double-clicks without animation glitches."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Reading Progress Bar",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a top-pinned reading progress bar that smoothly reflects how far the user has scrolled through an article.",
    "shortAnswer": "Calculate progress percentage as `window.scrollY / (article.scrollHeight - window.innerHeight)` and update `progressBar.style.width` or `transform: scaleX(progress)` using requestAnimationFrame.",
    "detailedExplanation": "- **Calculation Formula**: `progress = currentScroll / totalScrollableDistance`.\n- **Transform over Width**: Animating `transform: scaleX(ratio)` is GPU-accelerated and avoids reflows.\n- **rAF Throttling**: Locks updates to the display refresh rate for smooth 60fps rendering.",
    "codeExample": "const progressBar = document.querySelector('#reading-progress');\nlet ticking = false;\n\nfunction updateProgress() {\n  const total = document.documentElement.scrollHeight - window.innerHeight;\n  const progress = total > 0 ? window.scrollY / total : 0;\n  progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;\n  ticking = false;\n}\n\nwindow.addEventListener('scroll', () => {\n  if (!ticking) {\n    requestAnimationFrame(updateProgress);\n    ticking = true;\n  }\n}, { passive: true });",
    "interviewTips": [
      "Use `transform: scaleX(progress)` with `transform-origin: left` instead of `style.width` for GPU performance."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Toast Notification Stack Manager",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a toast notification manager that queues, displays, stacks, and automatically dismisses notifications after 4 seconds.",
    "shortAnswer": "Maintain a fixed container, create toast elements with icon, message, and close button, append them to the container, and remove them with an exit fade animation after a 4-second timeout.",
    "detailedExplanation": "- **Dismiss Animation**: Add a `'fade-out'` class, then call `toast.remove()` on `transitionend` or `animationend`.\n- **Manual Close**: Allow users to dismiss early by clicking an 'x' button.\n- **Stacking**: CSS Flexbox column with gap stacks toasts neatly.",
    "codeExample": "const toastContainer = document.querySelector('#toast-container');\n\nfunction showToast(message, type = 'info') {\n  const toast = document.createElement('div');\n  toast.className = `toast toast-${type}`;\n  toast.textContent = message;\n\n  const closeBtn = document.createElement('button');\n  closeBtn.textContent = '×';\n  closeBtn.onclick = () => dismiss(toast);\n  toast.appendChild(closeBtn);\n\n  toastContainer.appendChild(toast);\n  const timer = setTimeout(() => dismiss(toast), 4000);\n\n  function dismiss(el) {\n    clearTimeout(timer);\n    el.classList.add('dismissing');\n    el.addEventListener('transitionend', () => el.remove());\n  }\n}",
    "interviewTips": [
      "Wait for `transitionend` before removing the node with `el.remove()` to allow exit animations to complete."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "OTP 6-Digit Verification Inputs",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a 6-digit OTP verification component that automatically advances focus on character entry, jumps back on Backspace, and distributes pasted 6-digit codes across all boxes.",
    "shortAnswer": "Render 6 single-character text inputs, advance focus to `nextElementSibling` on `input`, reverse focus to `previousElementSibling` on `Backspace`, and distribute characters from the `paste` event across all 6 inputs.",
    "detailedExplanation": "- **Auto-Advance**: When a digit is entered, call `input.nextElementSibling?.focus()`.\n- **Backspace Reversal**: If Backspace is pressed and current input is empty, focus `previousElementSibling`.\n- **Paste Handling**: Intercept `paste`, validate 6 digits, and populate `inputs[i].value = chars[i]`.",
    "codeExample": "const inputs = document.querySelectorAll('.otp-box');\n\ninputs.forEach((input, index) => {\n  input.addEventListener('input', (e) => {\n    if (input.value && index < inputs.length - 1) {\n      inputs[index + 1].focus();\n    }\n  });\n\n  input.addEventListener('keydown', (e) => {\n    if (e.key === 'Backspace' && !input.value && index > 0) {\n      inputs[index - 1].focus();\n    }\n  });\n\n  input.addEventListener('paste', (e) => {\n    e.preventDefault();\n    const pasteData = e.clipboardData.getData('text').trim();\n    if (/^\\d{6}$/.test(pasteData)) {\n      inputs.forEach((box, i) => box.value = pasteData[i]);\n      inputs[5].focus();\n    }\n  });\n});",
    "interviewTips": [
      "Make sure to demonstrate all three features: 1) auto-advance, 2) backspace reversal, 3) 6-digit paste handler."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Color Theme Picker Updating CSS Variables",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build an interactive color palette picker that dynamically updates theme CSS variables across the entire application and saves preferences to localStorage.",
    "shortAnswer": "Listen for color swatch clicks, set CSS variables via `document.documentElement.style.setProperty('--primary-color', color)`, and persist to `localStorage.setItem('theme_color', color)`.",
    "detailedExplanation": "- **document.documentElement**: Modifying properties on `:root` cascades variables through the entire DOM tree.\n- **Persistence**: Restore saved theme color from `localStorage` on initial page load.\n- **No Re-render**: Changes colors instantly without recalculating DOM structure or reloading sheets.",
    "codeExample": "function applyThemeColor(color) {\n  document.documentElement.style.setProperty('--brand-primary', color);\n  localStorage.setItem('user_theme_color', color);\n}\n\ndocument.querySelectorAll('.color-swatch').forEach(swatch => {\n  swatch.addEventListener('click', () => applyThemeColor(swatch.dataset.color));\n});\n\n// Restore on load:\nconst savedColor = localStorage.getItem('user_theme_color');\nif (savedColor) applyThemeColor(savedColor);",
    "interviewTips": [
      "Point out that updating CSS variables on `document.documentElement` is instant and requires zero DOM node mutations."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Dark Mode Toggle with View Transitions",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Implement a Dark Mode toggle that checks system preference, stores user choice, and uses the View Transitions API for a circular animated screen wipe effect.",
    "shortAnswer": "Toggle the `'dark'` class inside `document.startViewTransition()`, update `localStorage`, and style `::view-transition-old(root)` and `::view-transition-new(root)`.",
    "detailedExplanation": "- **System Preference**: Check `window.matchMedia('(prefers-color-scheme: dark)').matches` as default.\n- **View Transition**: Wrapping DOM mutations in `document.startViewTransition()` lets CSS smoothly morph between themes.\n- **Storage Sync**: Save user override to `localStorage`.",
    "codeExample": "function toggleTheme() {\n  const isDark = document.documentElement.classList.toggle('dark');\n  localStorage.setItem('theme', isDark ? 'dark' : 'light');\n}\n\nfunction handleThemeClick() {\n  if (!document.startViewTransition) {\n    toggleTheme();\n    return;\n  }\n  document.startViewTransition(toggleTheme);\n}",
    "interviewTips": [
      "Highlight `document.startViewTransition` as the modern standard for theme switching animations."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Resizable Two-Pane Splitter with Pointer Capture",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a draggable horizontal split-pane (left sidebar, right content) where users drag a vertical divider bar to resize panes smoothly.",
    "shortAnswer": "Attach pointer listeners to the divider handle, call `setPointerCapture(e.pointerId)` on pointerdown, and adjust pane widths based on `e.clientX` during pointermove.",
    "detailedExplanation": "- **setPointerCapture**: Guarantees drag tracking continues even if the mouse moves over iframes or outside the window.\n- **Min/Max Constraints**: Clamp pane widths (e.g. min 150px, max 80% of container).\n- **Clean Release**: Capture releases automatically on `pointerup`.",
    "codeExample": "const divider = document.querySelector('#pane-divider');\nconst leftPane = document.querySelector('#left-pane');\nconst container = document.querySelector('#split-container');\n\ndivider.addEventListener('pointerdown', (e) => {\n  divider.setPointerCapture(e.pointerId);\n  \n  function onPointerMove(moveEvent) {\n    const containerRect = container.getBoundingClientRect();\n    const newWidth = moveEvent.clientX - containerRect.left;\n    if (newWidth > 150 && newWidth < containerRect.width - 150) {\n      leftPane.style.width = `${newWidth}px`;\n    }\n  }\n  \n  function onPointerUp() {\n    divider.removeEventListener('pointermove', onPointerMove);\n    divider.removeEventListener('pointerup', onPointerUp);\n  }\n  \n  divider.addEventListener('pointermove', onPointerMove);\n  divider.addEventListener('pointerup', onPointerUp);\n});",
    "interviewTips": [
      "Mention `setPointerCapture` as the clean modern alternative to listening to `window.onmousemove`."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Real-time Character Counter with Limit Warning",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a Twitter-style character counter that displays remaining characters, turns orange at 80%, turns red at 100%, and disables the submit button if exceeded.",
    "shortAnswer": "Listen to `input` on textarea, calculate `remaining = MAX - textarea.value.length`, update counter text, toggle warning CSS classes, and set `submitBtn.disabled = remaining < 0`.",
    "detailedExplanation": "- **input Event**: Updates in real-time on typing and pasting.\n- **Color Thresholds**: Apply warning class when remaining is less than 20% of limit.\n- **Submit Button State**: Set `submitBtn.disabled = true` if over limit or empty.",
    "codeExample": "const textarea = document.querySelector('#post-text');\nconst counter = document.querySelector('#char-count');\nconst submitBtn = document.querySelector('#submit-post');\nconst MAX_CHARS = 280;\n\ntextarea.addEventListener('input', () => {\n  const len = textarea.value.length;\n  const remaining = MAX_CHARS - len;\n  \n  counter.textContent = `${remaining} characters left`;\n  counter.classList.toggle('warning', remaining <= 28 && remaining > 0);\n  counter.classList.toggle('danger', remaining <= 0);\n  \n  submitBtn.disabled = len === 0 || remaining < 0;\n});",
    "interviewTips": [
      "Remember to disable submission for BOTH conditions: empty input (`len === 0`) and exceeding limit (`remaining < 0`)."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Accessible Tabbed Navigation Interface",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Implement an accessible Tab component conforming to WAI-ARIA tab pattern with Left/Right Arrow keyboard switching.",
    "shortAnswer": "Set `role=\"tablist\"` on container, `role=\"tab\"` on tabs, and `role=\"tabpanel\"` on panels. Support ArrowLeft and ArrowRight to shift focus and activate tabs automatically.",
    "detailedExplanation": "- **ARIA Attributes**: `aria-selected=\"true/false\"`, `aria-controls=\"panel-id\"`, `tabindex=\"0\"` on active tab, `tabindex=\"-1\"` on inactive tabs.\n- **Keyboard Navigation**: Left/Right arrows navigate tabs; Home/End jump to first/last tab.\n- **Panel Display**: Show matching panel and hide others with `hidden` attribute.",
    "codeExample": "const tabList = document.querySelector('[role=\"tablist\"]');\nconst tabs = [...tabList.querySelectorAll('[role=\"tab\"]')];\nconst panels = [...document.querySelectorAll('[role=\"tabpanel\"]')];\n\nfunction switchTab(newTab) {\n  tabs.forEach(tab => {\n    const isTarget = tab === newTab;\n    tab.setAttribute('aria-selected', isTarget);\n    tab.tabIndex = isTarget ? 0 : -1;\n  });\n  panels.forEach(p => p.hidden = p.id !== newTab.getAttribute('aria-controls'));\n  newTab.focus();\n}\n\ntabList.addEventListener('keydown', (e) => {\n  let index = tabs.indexOf(document.activeElement);\n  if (index === -1) return;\n  if (e.key === 'ArrowRight') switchTab(tabs[(index + 1) % tabs.length]);\n  if (e.key === 'ArrowLeft') switchTab(tabs[(index - 1 + tabs.length) % tabs.length]);\n});",
    "interviewTips": [
      "Highlight roving tabindex (`tabindex=\"0\"` on active tab, `-1` on others) as the WAI-ARIA standard for tablists."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "File Drag and Drop Zone with Image Preview",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a drag-and-drop file upload container with visual drop highlight, file type verification (images only), and instantaneous thumbnail preview.",
    "shortAnswer": "Prevent default on `dragover`/`drop`, extract `e.dataTransfer.files[0]`, verify `file.type.startsWith('image/')`, generate an object URL via `URL.createObjectURL(file)`, and display the thumbnail.",
    "detailedExplanation": "- **Drag Highlights**: Add `.dragover` CSS class on `dragenter` and remove on `dragleave`/`drop`.\n- **File Validation**: Check MIME type and file size (<5MB) before processing.\n- **Blob URL Cleanup**: Call `URL.revokeObjectURL(img.src)` after image loads to prevent memory leaks.",
    "codeExample": "const dropZone = document.querySelector('#upload-zone');\nconst previewImg = document.querySelector('#thumbnail');\n\n['dragenter', 'dragover'].forEach(name => {\n  dropZone.addEventListener(name, (e) => {\n    e.preventDefault();\n    dropZone.classList.add('hovering');\n  });\n});\n\n['dragleave', 'drop'].forEach(name => {\n  dropZone.addEventListener(name, () => dropZone.classList.remove('hovering'));\n});\n\ndropZone.addEventListener('drop', (e) => {\n  e.preventDefault();\n  const file = e.dataTransfer.files[0];\n  if (file && file.type.startsWith('image/')) {\n    const url = URL.createObjectURL(file);\n    previewImg.src = url;\n    previewImg.onload = () => URL.revokeObjectURL(url);\n  }\n});",
    "interviewTips": [
      "Mention calling `URL.revokeObjectURL()` once the image loads to free browser memory."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Sticky Smart Header (Hide on Scroll Down, Show on Scroll Up)",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a sticky navbar that slides up out of view when scrolling down and slides back down into view when scrolling up.",
    "shortAnswer": "Track `lastScrollY`; on scroll, compare `currentScrollY > lastScrollY` to toggle a `.header-hidden` transform class, updating `lastScrollY` within a rAF tick.",
    "detailedExplanation": "- **Direction Detection**: `currentScrollY > lastScrollY` indicates downward scrolling (hide header); upward scroll reveals header.\n- **Tolerance Threshold**: Require scrolling at least 10px before triggering to avoid jitter on small trackpad movements.\n- **Transform Performance**: Use `transform: translateY(-100%)` for smooth GPU-accelerated hide animation.",
    "codeExample": "const header = document.querySelector('header');\nlet lastScrollY = window.scrollY;\nlet ticking = false;\n\nfunction updateHeader() {\n  const currentScrollY = window.scrollY;\n  if (currentScrollY > lastScrollY && currentScrollY > 100) {\n    header.classList.add('is-hidden'); // Scrolling down\n  } else {\n    header.classList.remove('is-hidden'); // Scrolling up\n  }\n  lastScrollY = currentScrollY;\n  ticking = false;\n}\n\nwindow.addEventListener('scroll', () => {\n  if (!ticking) {\n    requestAnimationFrame(updateHeader);\n    ticking = true;\n  }\n}, { passive: true });",
    "interviewTips": [
      "Include a threshold check (`currentScrollY > 100`) so the header doesn't hide at the very top of the page."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Sortable Filterable Paginated Table",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Implement client-side sorting and search filtering on a dynamic HTML table in vanilla JavaScript.",
    "shortAnswer": "Filter data array by search query, sort array by clicked column key and direction, slice for current page (`page * pageSize`), and render rows using DocumentFragment or `replaceChildren()`.",
    "detailedExplanation": "- **Data-First Rendering**: Maintain state in a JavaScript array rather than parsing strings out of DOM cells.\n- **Sort Direction**: Toggle between ascending (`'asc'`) and descending (`'desc'`).\n- **Fast Render**: Re-render tbody using `tableBody.replaceChildren(fragment)`.",
    "codeExample": "let state = { data: allUsers, query: '', sortCol: 'name', sortAsc: true, page: 1, perPage: 10 };\n\nfunction getFilteredData() {\n  return state.data\n    .filter(u => u.name.toLowerCase().includes(state.query.toLowerCase()))\n    .sort((a, b) => {\n      const valA = a[state.sortCol], valB = b[state.sortCol];\n      return (valA < valB ? -1 : 1) * (state.sortAsc ? 1 : -1);\n    });\n}\n\nfunction renderTable() {\n  const filtered = getFilteredData();\n  const pageData = filtered.slice((state.page - 1) * state.perPage, state.page * state.perPage);\n  const frag = document.createDocumentFragment();\n  pageData.forEach(row => {\n    const tr = document.createElement('tr');\n    tr.innerHTML = `<td>${row.id}</td><td>${row.name}</td><td>${row.role}</td>`;\n    frag.appendChild(tr);\n  });\n  document.querySelector('#table-body').replaceChildren(frag);\n}",
    "interviewTips": [
      "Emphasize keeping data in JavaScript state and re-rendering rather than scraping text from HTML table cells."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Custom Tooltip with Viewport Edge Flipping",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a custom tooltip system that positions tooltips above target elements, automatically flipping to below if the tooltip would overflow the top of the viewport.",
    "shortAnswer": "Read target coordinates via `target.getBoundingClientRect()`, place tooltip above, and if `targetRect.top - tooltipHeight < 0`, flip placement below the target element.",
    "detailedExplanation": "- **Edge Collision Detection**: If `top - tooltipHeight < 0`, viewport overflows at top; flip to `bottom = targetRect.bottom + 8`.\n- **Horizontal Centering**: `left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2)`.\n- **Fixed Positioning**: Set `position: fixed` on tooltip so scroll offsets don't require manual math.",
    "codeExample": "function positionTooltip(target, tooltip) {\n  const targetRect = target.getBoundingClientRect();\n  const tooltipRect = tooltip.getBoundingClientRect();\n  \n  let top = targetRect.top - tooltipRect.height - 8; // Default above\n  if (top < 8) {\n    top = targetRect.bottom + 8; // Flip below if offscreen at top!\n  }\n  \n  let left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);\n  left = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8));\n  \n  tooltip.style.top = `${top}px`;\n  tooltip.style.left = `${left}px`;\n}",
    "interviewTips": [
      "Demonstrate boundary checking for both vertical (flipping) and horizontal (clamping) collisions."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Inline Editable Field (Click to Edit)",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build an inline editable text element that swaps to an <input> when clicked, saves on Enter or blur, and reverts to the original value on Escape.",
    "shortAnswer": "Replace the text element with an `<input>` populated with the current text, focus and select it; on Enter/blur commit the new value, and on Escape restore the original text.",
    "detailedExplanation": "- **Seamless Swap**: Swap display `<span>` with an `<input class=\"inline-edit\">`.\n- **Enter to Commit**: Keydown listener checks `e.key === 'Enter'` to blur and commit.\n- **Escape to Cancel**: Set a flag `cancelled = true` on Escape so blur does not commit unwanted text.",
    "codeExample": "function makeInlineEditable(element, onSave) {\n  element.addEventListener('click', () => {\n    const originalVal = element.textContent;\n    const input = document.createElement('input');\n    input.type = 'text';\n    input.value = originalVal;\n    let isCancelled = false;\n\n    input.addEventListener('keydown', (e) => {\n      if (e.key === 'Enter') input.blur();\n      if (e.key === 'Escape') { isCancelled = true; input.blur(); }\n    });\n\n    input.addEventListener('blur', () => {\n      const finalVal = isCancelled ? originalVal : input.value.trim() || originalVal;\n      element.textContent = finalVal;\n      input.replaceWith(element);\n      if (!isCancelled && finalVal !== originalVal) onSave(finalVal);\n    });\n\n    element.replaceWith(input);\n    input.focus();\n    input.select();\n  });\n}",
    "interviewTips": [
      "Highlight the `isCancelled` flag on Escape so the subsequent `blur` event doesn't accidentally save cancelled edits."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Custom Video Player Controls",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a custom video player control bar (Play/Pause, time progress track, volume slider, fullscreen) controlling an HTML5 <video> element.",
    "shortAnswer": "Wire buttons to `video.play()`/`pause()`, update progress track via `timeupdate` event (`currentTime / duration`), seek by clicking the track, adjust volume via `video.volume`, and toggle fullscreen with `requestFullscreen()`.",
    "detailedExplanation": "- **Play/Pause**: Toggle based on `video.paused` property.\n- **Progress Bar**: Update visual bar on `timeupdate` event: `pct = (video.currentTime / video.duration) * 100`.\n- **Seeking**: On track click, calculate `pct = clickX / trackWidth` and set `video.currentTime = pct * video.duration`.\n- **Fullscreen**: Use `playerContainer.requestFullscreen()`.",
    "codeExample": "const video = document.querySelector('video');\nconst playBtn = document.querySelector('#play-btn');\nconst progressBar = document.querySelector('#progress-bar');\n\nplayBtn.addEventListener('click', () => {\n  if (video.paused) { video.play(); playBtn.textContent = 'Pause'; }\n  else { video.pause(); playBtn.textContent = 'Play'; }\n});\n\nvideo.addEventListener('timeupdate', () => {\n  const pct = (video.currentTime / video.duration) * 100;\n  progressBar.style.width = `${pct}%`;\n});",
    "interviewTips": [
      "Mention updating the progress bar on the `timeupdate` event rather than using a setInterval timer."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Infinite Carousel Slider with Touch Swipe",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build an infinite looping image carousel with previous/next buttons and mobile touch swipe gestures.",
    "shortAnswer": "Track active index, translate track container via `transform: translateX(-index * 100%)`, listen to `touchstart` and `touchend` to measure swipe distance (`diffX > 50`), and loop cleanly from first to last slide.",
    "detailedExplanation": "- **GPU Animation**: Slide transitions are animated using CSS `transform` and `transition` for 60fps performance.\n- **Touch Swipe**: Record `startX = e.changedTouches[0].clientX` on `touchstart`; compare with end coordinate on `touchend`.\n- **Seamless Looping**: Clone first and last slides as buffer duplicates to reset position without visual jump.",
    "codeExample": "const track = document.querySelector('.carousel-track');\nlet currentIndex = 0;\nlet startX = 0;\nconst totalSlides = document.querySelectorAll('.carousel-slide').length;\n\nfunction goToSlide(index) {\n  currentIndex = (index + totalSlides) % totalSlides;\n  track.style.transform = `translateX(-${currentIndex * 100}%)`;\n}\n\ntrack.addEventListener('touchstart', (e) => startX = e.touches[0].clientX);\ntrack.addEventListener('touchend', (e) => {\n  const diff = e.changedTouches[0].clientX - startX;\n  if (diff > 50) goToSlide(currentIndex - 1); // Swipe right -> prev\n  else if (diff < -50) goToSlide(currentIndex + 1); // Swipe left -> next\n});",
    "interviewTips": [
      "Use the modulo formula `(index + total) % total` to handle clean circular wrapping."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Undo/Redo History Stack with Command Pattern",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Implement an Undo and Redo manager for DOM actions (e.g. deleting or modifying items) using the Command Pattern.",
    "shortAnswer": "Maintain `undoStack` and `redoStack` arrays of command objects having `execute()` and `undo()` methods; pushing a new command clears the redo stack.",
    "detailedExplanation": "- **Command Object**: Encapsulates the forward operation and its exact reversal operation.\n- **Undo Action**: Pops command from `undoStack`, invokes `command.undo()`, and pushes to `redoStack`.\n- **Redo Action**: Pops from `redoStack`, invokes `command.execute()`, and pushes to `undoStack`.\n- **Keyboard Hotkeys**: Bind to `Ctrl+Z` (Undo) and `Ctrl+Y` / `Ctrl+Shift+Z` (Redo).",
    "codeExample": "class HistoryManager {\n  constructor() {\n    this.undoStack = [];\n    this.redoStack = [];\n  }\n  execute(command) {\n    command.execute();\n    this.undoStack.push(command);\n    this.redoStack = []; // Clear redo on new action\n  }\n  undo() {\n    const cmd = this.undoStack.pop();\n    if (cmd) {\n      cmd.undo();\n      this.redoStack.push(cmd);\n    }\n  }\n  redo() {\n    const cmd = this.redoStack.pop();\n    if (cmd) {\n      cmd.execute();\n      this.undoStack.push(cmd);\n    }\n  }\n}",
    "interviewTips": [
      "Always remember: performing a new command MUST clear the `redoStack`."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Nested Tree View (File Explorer)",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Implement a hierarchical file explorer tree view where clicking folders toggles expand/collapse and clicking files selects them.",
    "shortAnswer": "Use event delegation on the tree container, check `e.target.closest('.folder')` to toggle expanded state on the folder's child `<ul>`, and update `aria-expanded` and selection classes.",
    "detailedExplanation": "- **Event Delegation**: Single click listener on root container handles thousands of nested folders efficiently.\n- **Semantic ARIA**: Container has `role=\"tree\"`, items have `role=\"treeitem\"`, folders have `aria-expanded=\"true/false\"`.\n- **Toggle Logic**: Toggle the `hidden` attribute or an `.is-expanded` class on the child `<ul>` list.",
    "codeExample": "const treeRoot = document.querySelector('#file-tree');\n\ntreeRoot.addEventListener('click', (e) => {\n  const folderToggle = e.target.closest('.folder-header');\n  if (folderToggle) {\n    const folderItem = folderToggle.closest('.folder-item');\n    const subTree = folderItem.querySelector('.sub-tree');\n    const isExpanded = folderItem.getAttribute('aria-expanded') === 'true';\n    \n    folderItem.setAttribute('aria-expanded', !isExpanded);\n    subTree.hidden = isExpanded;\n  }\n});",
    "interviewTips": [
      "Use event delegation on the root tree element so dynamic folder additions work automatically."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Kanban Board Drag and Drop Columns",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a Trello-style Kanban board allowing users to drag task cards between 'Todo', 'In Progress', and 'Done' columns.",
    "shortAnswer": "Make cards `draggable=\"true\"`, track dragged card in `dragstart`, allow drops by calling `e.preventDefault()` in `dragover` on columns, and append the card to the target column's list in `drop`.",
    "detailedExplanation": "- **Column Drop Zones**: Listen for `dragover` and `drop` on all column card-containers.\n- **Event Prevention**: Calling `e.preventDefault()` on `dragover` is required to enable dropping.\n- **Atomic Transfer**: `targetColumn.appendChild(draggedCard)` moves the card without recreation.",
    "codeExample": "let activeCard = null;\n\ndocument.addEventListener('dragstart', (e) => {\n  const card = e.target.closest('.kanban-card');\n  if (card) {\n    activeCard = card;\n    e.dataTransfer.setData('text/plain', card.id);\n  }\n});\n\ndocument.querySelectorAll('.kanban-column-cards').forEach(column => {\n  column.addEventListener('dragover', (e) => e.preventDefault());\n  column.addEventListener('drop', (e) => {\n    e.preventDefault();\n    if (activeCard) {\n      column.appendChild(activeCard);\n      updateCardStatus(activeCard.id, column.dataset.status);\n    }\n  });\n});",
    "interviewTips": [
      "Explain that `appendChild` moves the card node directly from its previous column to the new column."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Canvas Circular Countdown Timer",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build an animated countdown timer (e.g. 60 seconds) that renders a smooth circular SVG or canvas stroke depleting as time elapses.",
    "shortAnswer": "Calculate the stroke offset of an SVG circle via `strokeDashoffset = totalCircumference * (1 - timeLeft / totalTime)` updated on each second or rAF frame.",
    "detailedExplanation": "- **SVG stroke-dasharray**: Set to circle circumference `2 * Math.PI * radius`.\n- **stroke-dashoffset**: Depleting offset animates the ring draining smoothly.\n- **Interval / rAF**: Update timer text and stroke offset in tandem until reaching 0.",
    "codeExample": "const circle = document.querySelector('#progress-ring');\nconst radius = circle.r.baseVal.value;\nconst circumference = 2 * Math.PI * radius;\n\ncircle.style.strokeDasharray = `${circumference} ${circumference}`;\n\nfunction setProgress(percent) {\n  const offset = circumference - (percent / 100) * circumference;\n  circle.style.strokeDashoffset = offset;\n}\n\n// Usage: countdown from 100% to 0%\nsetProgress(75); // 75% remaining",
    "interviewTips": [
      "Cite the `strokeDasharray` and `strokeDashoffset` formula as the standard method for circular SVG progress rings."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Shopping Cart Quantity Stepper with Debounced Auto-Save",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build an e-commerce quantity stepper (+ / - buttons) that updates local UI instantly while debouncing API persistence calls to prevent request flooding.",
    "shortAnswer": "Mutate local input value and subtotal instantly on click, clear existing debounce timer, and schedule backend `fetch('/api/cart')` after 500ms of user inactivity.",
    "detailedExplanation": "- **Optimistic UI**: Update on-screen quantity and line total immediately so the user feels zero lag.\n- **Debounced Network**: If a user clicks '+' 5 times rapidly, only 1 network request is dispatched with the final quantity (5).\n- **Rollback on Error**: Cache previous quantity and revert if network request fails.",
    "codeExample": "function setupQuantityStepper(container, itemId) {\n  const input = container.querySelector('.qty-input');\n  let debounceTimer;\n  let previousValue = Number(input.value);\n\n  function updateQuantity(newQty) {\n    if (newQty < 1) return;\n    input.value = newQty;\n    updateSubtotalLocally(itemId, newQty);\n\n    clearTimeout(debounceTimer);\n    debounceTimer = setTimeout(async () => {\n      try {\n        await fetch(`/api/cart/${itemId}`, {\n          method: 'PATCH',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({ quantity: newQty })\n        });\n        previousValue = newQty;\n      } catch (err) {\n        input.value = previousValue; // Rollback on failure\n        alert('Failed to update cart.');\n      }\n    }, 500);\n  }\n}",
    "interviewTips": [
      "Mention optimistic UI updates with error rollback: update screen immediately, but revert if the API call fails."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Multi-Select Tag Chips Input",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a tag input component where pressing Enter or comma creates a removable tag chip, and pressing Backspace on an empty input deletes the previous tag.",
    "shortAnswer": "Listen for `keydown` on input; on 'Enter' or ',' create a tag chip element `<span class=\"tag\">...</span>`, clear input, and on 'Backspace' when input is empty, delete the last tag chip.",
    "detailedExplanation": "- **Backspace Deletion**: If `input.value === '' && e.key === 'Backspace'`, remove `container.lastElementChild`.\n- **Tag Removal**: Attach click listeners to tag remove 'x' buttons via event delegation.\n- **Deduplication**: Prevent duplicate tags by maintaining a JavaScript `Set`.",
    "codeExample": "const tagContainer = document.querySelector('#tags-wrapper');\nconst input = document.querySelector('#tag-input');\nconst tags = new Set();\n\nfunction addTag(text) {\n  const clean = text.trim().toLowerCase();\n  if (!clean || tags.has(clean)) return;\n  tags.add(clean);\n  const chip = document.createElement('span');\n  chip.className = 'tag-chip';\n  chip.innerHTML = `${clean} <button type=\"button\" class=\"remove-tag\">&times;</button>`;\n  tagContainer.insertBefore(chip, input);\n  input.value = '';\n}\n\ninput.addEventListener('keydown', (e) => {\n  if (e.key === 'Enter' || e.key === ',') {\n    e.preventDefault();\n    addTag(input.value);\n  } else if (e.key === 'Backspace' && !input.value) {\n    const lastTag = input.previousElementSibling;\n    if (lastTag) { tags.delete(lastTag.textContent.slice(0, -1).trim()); lastTag.remove(); }\n  }\n});",
    "interviewTips": [
      "Always include Backspace deletion of the last tag when input is empty."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "GDPR Cookie Consent Banner with Script Blocking",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a GDPR-compliant cookie consent banner that blocks third-party analytics scripts until the user clicks 'Accept All'.",
    "shortAnswer": "Set analytics script tags with `type=\"text/plain\"` or `data-src=\"...\"` so the browser ignores them; upon consent, read `data-src`, dynamically create active `<script>` tags, and store consent in `localStorage`.",
    "detailedExplanation": "- **Preventing Auto-Execution**: Browsers ignore script tags with non-executable types like `<script type=\"text/plain\" data-category=\"analytics\">`.\n- **Dynamic Activation**: On consent, change `type` to `'text/javascript'` and append to `document.head`.\n- **Consent Persistence**: Store consent choice in `localStorage.setItem('cookie_consent', 'accepted')`.",
    "codeExample": "function activateAnalytics() {\n  document.querySelectorAll('script[type=\"text/plain\"][data-consent=\"analytics\"]').forEach(inertScript => {\n    const activeScript = document.createElement('script');\n    activeScript.src = inertScript.dataset.src;\n    document.head.appendChild(activeScript);\n    inertScript.remove();\n  });\n}\n\ndocument.querySelector('#accept-cookies').addEventListener('click', () => {\n  localStorage.setItem('cookie_consent', 'all');\n  activateAnalytics();\n  document.querySelector('#cookie-banner').remove();\n});",
    "interviewTips": [
      "Explain the `<script type=\"text/plain\" data-src=\"...\">` technique as standard practice for GDPR tag blocking."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Offline Detection and Toast Notification",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Implement a real-time network connectivity alert that displays an 'Offline - Changes will sync when reconnected' banner when internet is lost and auto-dismisses on reconnection.",
    "shortAnswer": "Listen for `window.addEventListener('offline', ...)` and `window.addEventListener('online', ...)`, toggle a fixed status banner, and trigger pending data sync on reconnect.",
    "detailedExplanation": "- **navigator.onLine**: Boolean property indicating initial network connection.\n- **online/offline Events**: Fire reliably on `window` when connection drops or resumes.\n- **Auto-Sync Queue**: Queue failed API mutations in IndexedDB while offline and flush upon `online` event.",
    "codeExample": "const banner = document.querySelector('#offline-banner');\n\nfunction updateOnlineStatus() {\n  if (!navigator.onLine) {\n    banner.textContent = 'You are currently offline. Changes will sync automatically.';\n    banner.classList.add('is-offline');\n  } else {\n    banner.textContent = 'Back online! Syncing updates...';\n    banner.classList.remove('is-offline');\n    syncPendingQueue();\n    setTimeout(() => banner.classList.remove('visible'), 2500);\n  }\n}\n\nwindow.addEventListener('online', updateOnlineStatus);\nwindow.addEventListener('offline', updateOnlineStatus);",
    "interviewTips": [
      "Pair the `online`/`offline` listeners with `navigator.onLine` for initial load verification."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Long Press Action Button with Circular Progress",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a 'Hold to Confirm' destructive action button (e.g. Delete Account) requiring the user to press and hold for 2 seconds to trigger.",
    "shortAnswer": "Start a timer on `pointerdown`, animate a progress ring using CSS or rAF; if the user lifts or moves (`pointerup`, `pointerleave`) before 2 seconds, cancel the timer and reset the progress ring.",
    "detailedExplanation": "- **Hold Timer**: `setTimeout(action, 2000)` initialized on `pointerdown`.\n- **Cancellation Handlers**: Listen for `pointerup`, `pointerleave`, and `pointercancel` to clear the timeout.\n- **Visual Feedback**: Transition a progress background fill over 2s to indicate hold progress.",
    "codeExample": "const button = document.querySelector('#hold-delete-btn');\nlet holdTimer;\n\nbutton.addEventListener('pointerdown', (e) => {\n  button.classList.add('holding'); // Starts 2s CSS transition\n  holdTimer = setTimeout(() => {\n    button.classList.remove('holding');\n    performAccountDeletion();\n  }, 2000);\n});\n\nfunction cancelHold() {\n  clearTimeout(holdTimer);\n  button.classList.remove('holding');\n}\n\n['pointerup', 'pointerleave', 'pointercancel'].forEach(evt => {\n  button.addEventListener(evt, cancelHold);\n});",
    "interviewTips": [
      "Always listen for all cancellation events: `pointerup`, `pointerleave`, and `pointercancel`."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Password Strength Meter with Real-time Rules",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a real-time password strength meter that checks length, uppercase, lowercase, numbers, and special characters, updating a colored bar and checklist.",
    "shortAnswer": "Listen to `input` on password field, evaluate regex rules, calculate passed score (0-4), update width and color of strength meter bar, and toggle checkmark icons on rule list items.",
    "detailedExplanation": "- **Rule Evaluation**: Test against `/length >= 8/`, `/[A-Z]/`, `/[0-9]/`, and `/[!@#$%^&*]/`.\n- **Score Mapping**: 0-1 (Weak/Red), 2-3 (Medium/Orange), 4 (Strong/Green).\n- **Accessibility**: Update `aria-valuenow` on progress bar and announce status to screen readers via `aria-live=\"polite\"`.",
    "codeExample": "const input = document.querySelector('#password');\nconst bar = document.querySelector('#strength-bar');\nconst rules = {\n  length: p => p.length >= 8,\n  number: p => /\\d/.test(p),\n  upper: p => /[A-Z]/.test(p),\n  special: p => /[^A-Za-z0-9]/.test(p)\n};\n\ninput.addEventListener('input', () => {\n  const val = input.value;\n  let score = 0;\n  for (const [key, test] of Object.entries(rules)) {\n    const passed = test(val);\n    document.querySelector(`#rule-${key}`).classList.toggle('passed', passed);\n    if (passed) score++;\n  }\n  bar.style.width = `${(score / 4) * 100}%`;\n  bar.className = `strength-bar score-${score}`;\n});",
    "interviewTips": [
      "Structure rule evaluations cleanly using an object dictionary of regex tests."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Document Zoom and Pan Viewer",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a zoomable, pannable document viewer canvas where users can zoom in/out with buttons and drag to pan the viewport.",
    "shortAnswer": "Maintain `scale`, `panX`, and `panY` state variables, apply `transform: translate(panX, panY) scale(scale)` on the document wrapper, and update coordinates during pointer drag.",
    "detailedExplanation": "- **Zoom Controls**: Multiply or divide `scale` by 1.25 on zoom buttons, clamping between 0.5x and 5x.\n- **Panning**: Track pointer movement deltas on `pointerdown`/`pointermove` using `setPointerCapture`.\n- **GPU Performance**: Using `transform` ensures buttery smooth 60fps zooming without reflows.",
    "codeExample": "let scale = 1, panX = 0, panY = 0;\nconst viewer = document.querySelector('#doc-container');\n\nfunction updateTransform() {\n  viewer.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;\n}\n\ndocument.querySelector('#zoom-in').onclick = () => {\n  scale = Math.min(4, scale * 1.2);\n  updateTransform();\n};\n\ndocument.querySelector('#zoom-out').onclick = () => {\n  scale = Math.max(0.5, scale / 1.2);\n  updateTransform();\n};",
    "interviewTips": [
      "Emphasize that updating `transform: translate() scale()` avoids triggering reflows during zoom and pan."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Audio Visualizer Canvas",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a real-time audio visualizer displaying animated frequency bars on an HTML5 <canvas> from an <audio> element using Web Audio API.",
    "shortAnswer": "Connect the `<audio>` element to an `AudioContext` and `AnalyserNode`, extract frequency byte data via `analyser.getByteFrequencyData()`, and render bars in a `requestAnimationFrame` loop.",
    "detailedExplanation": "- **AudioContext**: Create via `new AudioContext()` on user gesture.\n- **MediaElementSource**: `ctx.createMediaElementSource(audioElement)`.\n- **AnalyserNode**: Configures FFT size (e.g. 128) and frequency bin counts.\n- **Canvas Draw**: Draw bars on `<canvas>` using `ctx.fillRect()` inside rAF.",
    "codeExample": "let audioCtx, analyser, dataArray;\nconst audio = document.querySelector('audio');\nconst canvas = document.querySelector('canvas');\nconst ctx = canvas.getContext('2d');\n\naudio.addEventListener('play', () => {\n  if (!audioCtx) {\n    audioCtx = new AudioContext();\n    const src = audioCtx.createMediaElementSource(audio);\n    analyser = audioCtx.createAnalyser();\n    analyser.fftSize = 64;\n    src.connect(analyser);\n    analyser.connect(audioCtx.destination);\n    dataArray = new Uint8Array(analyser.frequencyBinCount);\n  }\n  renderVisualizer();\n});\n\nfunction renderVisualizer() {\n  requestAnimationFrame(renderVisualizer);\n  analyser.getByteFrequencyData(dataArray);\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\n  const barWidth = canvas.width / dataArray.length;\n  dataArray.forEach((val, i) => {\n    const barHeight = (val / 255) * canvas.height;\n    ctx.fillStyle = '#3b82f6';\n    ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);\n  });\n}",
    "interviewTips": [
      "Note that `AudioContext` must be created or resumed on user gesture to comply with browser autoplay policies."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Masonry Pinterest-Style Grid Layout",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Implement a Pinterest-style multi-column Masonry grid in vanilla JavaScript where items with varying heights are packed without vertical gaps.",
    "shortAnswer": "Maintain an array tracking current column heights `[col0Height, col1Height, ...]`, position each item into the shortest column using `position: absolute; transform: translate(colX, colY)`, and update that column's height.",
    "detailedExplanation": "- **Shortest Column Algorithm**: For each item, find `min(columnHeights)` and place the card at that column's current offset.\n- **Absolute Positioning**: Position elements with `transform: translate3d(left, top, 0)` for hardware acceleration.\n- **Resize Handling**: Re-calculate on window resize using debounced handler.",
    "codeExample": "function layoutMasonry(container, items, colCount = 3, gap = 16) {\n  const colWidth = (container.clientWidth - gap * (colCount - 1)) / colCount;\n  const colHeights = new Array(colCount).fill(0);\n\n  items.forEach(item => {\n    // Find shortest column:\n    const minCol = colHeights.indexOf(Math.min(...colHeights));\n    const x = minCol * (colWidth + gap);\n    const y = colHeights[minCol];\n\n    item.style.position = 'absolute';\n    item.style.width = `${colWidth}px`;\n    item.style.transform = `translate3d(${x}px, ${y}px, 0)`;\n\n    colHeights[minCol] += item.offsetHeight + gap;\n  });\n  container.style.height = `${Math.max(...colHeights)}px`;\n}",
    "interviewTips": [
      "Explain the 'shortest column greedy algorithm' for placing cards into Masonry grids."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Scratch-Off Lottery Card Reveal",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build an interactive scratch card using HTML5 Canvas where user cursor drags scratch away an opaque silver coating to reveal a hidden prize beneath.",
    "shortAnswer": "Fill canvas with silver overlay, listen for pointer movement while holding mouse down, set `ctx.globalCompositeOperation = 'destination-out'`, and draw circles to erase the canvas and reveal underlying markup.",
    "detailedExplanation": "- **destination-out**: Tells the canvas 2D context that new drawing erases existing pixels instead of adding to them.\n- **Pointer Tracking**: Track cursor coordinates and draw filled circles with a radius of ~20px.\n- **Completion Threshold**: Sample canvas pixel alpha data periodically to auto-reveal when 70% is scratched.",
    "codeExample": "const canvas = document.querySelector('#scratch-canvas');\nconst ctx = canvas.getContext('2d');\nlet isDrawing = false;\n\n// Fill with opaque silver coating:\nctx.fillStyle = '#94a3b8';\nctx.fillRect(0, 0, canvas.width, canvas.height);\nctx.globalCompositeOperation = 'destination-out'; // Erase mode!\n\nfunction scratch(e) {\n  if (!isDrawing) return;\n  const rect = canvas.getBoundingClientRect();\n  const x = e.clientX - rect.left, y = e.clientY - rect.top;\n  ctx.beginPath();\n  ctx.arc(x, y, 24, 0, Math.PI * 2);\n  ctx.fill();\n}\n\ncanvas.addEventListener('pointerdown', () => isDrawing = true);\ncanvas.addEventListener('pointermove', scratch);\nwindow.addEventListener('pointerup', () => isDrawing = false);",
    "interviewTips": [
      "Key API: `ctx.globalCompositeOperation = 'destination-out'` turns drawing brushes into pixel erasers."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Floating Action Button Speed Dial",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a Material Design Floating Action Button (FAB) that expands a radial speed dial menu of secondary action buttons on click.",
    "shortAnswer": "Toggle an `'expanded'` class on the main FAB; use CSS transforms to animate child action buttons expanding upward with staggered transition delays and rotate the main '+' icon 45 degrees into an 'x'.",
    "detailedExplanation": "- **Icon Rotation**: `transform: rotate(45deg)` transitions '+' into '×'.\n- **Staggered Animations**: CSS `transition-delay` on child buttons creates a smooth cascading burst effect.\n- **Keyboard Accessibility**: Support Escape key to collapse the dial.",
    "codeExample": "const fab = document.querySelector('#fab-main');\nconst speedDial = document.querySelector('.speed-dial');\n\nfab.addEventListener('click', () => {\n  const isOpen = speedDial.classList.toggle('is-open');\n  fab.setAttribute('aria-expanded', isOpen);\n});\n\ndocument.addEventListener('keydown', (e) => {\n  if (e.key === 'Escape' && speedDial.classList.contains('is-open')) {\n    speedDial.classList.remove('is-open');\n    fab.setAttribute('aria-expanded', 'false');\n    fab.focus();\n  }\n});",
    "interviewTips": [
      "Mention updating `aria-expanded` and returning keyboard focus to the main FAB on Escape."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Interactive SVG Seat Map Reservation",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build an interactive theater seat map using inline SVG where users can click available seats to select/deselect them, updating a live price summary.",
    "shortAnswer": "Use event delegation on the `<svg>` container, verify `e.target.matches('.seat:not(.occupied)')`, toggle a `.selected` class, and update selected seat count and total price in real time.",
    "detailedExplanation": "- **Event Delegation on SVG**: Single listener on the root `<svg>` tag handles hundreds of seat `<rect>` elements.\n- **Seat Status**: Distinguish status via classes: `.available`, `.selected`, `.occupied`.\n- **Data Attributes**: Store seat metadata on elements: `data-seat-id=\"A12\" data-price=\"15\"`.",
    "codeExample": "const svgMap = document.querySelector('#seat-map');\nconst totalEl = document.querySelector('#total-price');\nlet selectedSeats = new Map();\n\nsvgMap.addEventListener('click', (e) => {\n  const seat = e.target.closest('.seat:not(.occupied)');\n  if (!seat) return;\n  \n  const seatId = seat.dataset.seatId;\n  const price = Number(seat.dataset.price);\n\n  if (selectedSeats.has(seatId)) {\n    selectedSeats.delete(seatId);\n    seat.classList.remove('selected');\n  } else {\n    selectedSeats.set(seatId, price);\n    seat.classList.add('selected');\n  }\n  \n  const total = [...selectedSeats.values()].reduce((sum, p) => sum + p, 0);\n  totalEl.textContent = `$${total}`;\n});",
    "interviewTips": [
      "Use event delegation on the `<svg>` container with `.closest('.seat:not(.occupied)')`."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Mobile Pull-to-Refresh Gesture",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Implement a mobile Pull-to-Refresh gesture in vanilla JavaScript that triggers a refresh when the user pulls down at the top of the page.",
    "shortAnswer": "On `touchstart`, record starting Y if `window.scrollY === 0`; on `touchmove`, apply resistance to calculate pull distance and animate a spinner `translateY`; on `touchend`, if pulled past 80px, trigger data refresh.",
    "detailedExplanation": "- **Top-Only Activation**: Only activate if page is at `window.scrollY === 0`.\n- **Logarithmic Resistance**: Apply physics resistance: `pullDistance = Math.pow(rawDiff, 0.85)` so pulling feels natural.\n- **Refresh Spinner**: Show spinner icon rotating as pull distance increases.",
    "codeExample": "let startY = 0, isPulling = false;\nconst loader = document.querySelector('#pull-loader');\n\nwindow.addEventListener('touchstart', (e) => {\n  if (window.scrollY === 0) {\n    startY = e.touches[0].clientY;\n    isPulling = true;\n  }\n});\n\nwindow.addEventListener('touchmove', (e) => {\n  if (!isPulling) return;\n  const diff = e.touches[0].clientY - startY;\n  if (diff > 0) {\n    const distance = Math.min(100, diff * 0.4); // Resistance\n    loader.style.transform = `translateY(${distance}px)`;\n  }\n});\n\nwindow.addEventListener('touchend', async () => {\n  if (!isPulling) return;\n  isPulling = false;\n  loader.style.transform = 'translateY(0px)';\n  await refreshPageData();\n});",
    "interviewTips": [
      "Mention the resistance formula (`diff * 0.4` or logarithmic dampening) to make pull-to-refresh feel native."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Mobile Bottom Sheet with Snap Points",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a mobile Bottom Sheet modal that users can drag up to expand or drag down to dismiss, snapping to half-height or full-height points.",
    "shortAnswer": "Track touch drag on the sheet handle, update `translateY` offset during movement, and on release, calculate whether sheet is closest to 0% (closed), 50% (half-open), or 100% (fullscreen) and snap smoothly.",
    "detailedExplanation": "- **Snap Points**: Define heights like `0` (closed), `50vh` (peek/half), `90vh` (expanded).\n- **Velocity Checking**: Fast downward flick dismisses the sheet even if released above the halfway threshold.\n- **Backdrop Dimming**: Fade backdrop opacity in proportion to sheet height.",
    "codeExample": "const sheet = document.querySelector('#bottom-sheet');\nlet sheetStartY, currentTranslate = 0;\n\nsheet.addEventListener('touchstart', (e) => {\n  sheetStartY = e.touches[0].clientY;\n});\n\nsheet.addEventListener('touchmove', (e) => {\n  const delta = e.touches[0].clientY - sheetStartY;\n  if (delta > 0) {\n    sheet.style.transform = `translateY(${delta}px)`;\n    currentTranslate = delta;\n  }\n});\n\nsheet.addEventListener('touchend', () => {\n  sheet.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';\n  if (currentTranslate > 150) {\n    sheet.style.transform = 'translateY(100%)'; // Dismiss\n  } else {\n    sheet.style.transform = 'translateY(0%)'; // Snap back open\n  }\n});",
    "interviewTips": [
      "Explain the snap threshold: if dragged down >150px dismiss, otherwise snap back to open."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Dynamic Form Schema Builder",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a dynamic form builder where users can click buttons to add new form fields (text, number, checkbox), reorder them, and serialize the layout into a JSON schema.",
    "shortAnswer": "Maintain a fields state array, append field row elements to the DOM on 'Add Field', allow removal via delete buttons, and serialize fields by iterating rows and reading field type, name, and validation attributes.",
    "detailedExplanation": "- **Component Construction**: Create row containers containing label, input type selector, required toggle, and delete button.\n- **Export to JSON**: Query all field rows and map them into a schema object: `{ id, label, type, required }`.\n- **Clean Delegation**: Handle field deletion via single container event delegation.",
    "codeExample": "const builder = document.querySelector('#form-builder');\nconst fieldsList = document.querySelector('#fields-list');\n\nfunction addField(type = 'text') {\n  const row = document.createElement('div');\n  row.className = 'field-row';\n  row.innerHTML = `\n    <input type=\"text\" class=\"f-label\" placeholder=\"Field Label\">\n    <span class=\"f-type\">${type}</span>\n    <label><input type=\"checkbox\" class=\"f-req\"> Required</label>\n    <button type=\"button\" class=\"f-del\">Delete</button>\n  `;\n  fieldsList.appendChild(row);\n}\n\nfunction serializeSchema() {\n  return [...fieldsList.querySelectorAll('.field-row')].map(row => ({\n    label: row.querySelector('.f-label').value,\n    type: row.querySelector('.f-type').textContent,\n    required: row.querySelector('.f-req').checked\n  }));\n}",
    "interviewTips": [
      "Demonstrate how to build both the builder UI and the schema serialization export function."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Live Markdown Previewer with Sanitization",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a split-screen live Markdown previewer that parses markdown as the user types, sanitizes output to prevent XSS, and keeps scroll positions synchronized.",
    "shortAnswer": "Listen to `input` on the markdown textarea, convert markdown to HTML using a parser, pass the result through DOMPurify, assign to preview container via `replaceChildren()` or safe innerHTML, and synchronize scroll ratios.",
    "detailedExplanation": "- **Sanitization Mandatory**: Untrusted user markdown can contain raw HTML `<script>` tags; passing output through `DOMPurify.sanitize()` is non-negotiable.\n- **Scroll Synchronization**: Sync preview scroll: `preview.scrollTop = (textarea.scrollTop / maxScrollText) * maxScrollPreview`.\n- **Debounce Parsing**: Debounce markdown parsing by 100ms for large documents.",
    "codeExample": "const editor = document.querySelector('#md-input');\nconst preview = document.querySelector('#md-preview');\n\neditor.addEventListener('input', () => {\n  const rawMarkdown = editor.value;\n  const rawHtml = marked.parse(rawMarkdown); // Parse markdown\n  const safeHtml = DOMPurify.sanitize(rawHtml); // 100% XSS safe\n  preview.innerHTML = safeHtml;\n});\n\neditor.addEventListener('scroll', () => {\n  const scrollPct = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);\n  preview.scrollTop = scrollPct * (preview.scrollHeight - preview.clientHeight);\n});",
    "interviewTips": [
      "Never show a markdown previewer without mentioning HTML sanitization with DOMPurify."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Form Auto-Save Draft to LocalStorage",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a form auto-save feature that saves draft inputs to localStorage on every change, restores them if the user refreshes, and clears the draft on successful submission.",
    "shortAnswer": "Listen for `input` events on the form, serialize form fields to JSON via `FormData`, store in `localStorage`, restore on initial page load, and delete the key in the `submit` handler.",
    "detailedExplanation": "- **Event Delegation**: Single `input` listener on `<form>` catches all typing across all child fields.\n- **Restoration**: On page load, read JSON and iterate over `form.elements` to populate matching fields.\n- **Clear on Submit**: Remove the draft key from `localStorage` once the form is successfully submitted.",
    "codeExample": "const form = document.querySelector('#draft-form');\nconst DRAFT_KEY = 'form_draft_v1';\n\n// Auto-save on every input change:\nform.addEventListener('input', () => {\n  const data = Object.fromEntries(new FormData(form).entries());\n  localStorage.setItem(DRAFT_KEY, JSON.stringify(data));\n});\n\n// Restore on load:\nconst savedDraft = localStorage.getItem(DRAFT_KEY);\nif (savedDraft) {\n  const data = JSON.parse(savedDraft);\n  for (const [key, val] of Object.entries(data)) {\n    if (form.elements[key]) form.elements[key].value = val;\n  }\n}\n\n// Clear on submit:\nform.addEventListener('submit', () => localStorage.removeItem(DRAFT_KEY));",
    "interviewTips": [
      "Use `new FormData(form)` and `Object.fromEntries()` for clean, elegant form serialization."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "Inactivity Session Timeout Dialog",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Implement an automatic user inactivity session timeout (e.g. 15 minutes) that displays a warning modal after 14 minutes and logs the user out if no action occurs.",
    "shortAnswer": "Reset an inactivity timer on user interactions (`mousemove`, `keydown`, `click`), show a warning modal at 14 minutes with a countdown, and trigger logout at 15 minutes if unextended.",
    "detailedExplanation": "- **User Activity Reset**: Reset timers whenever pointer or keyboard events occur.\n- **Throttling Reset**: Throttle activity listener by 1 second to avoid CPU churn on mousemove.\n- **Warning Dialog**: Show modal allowing user to click 'Keep me signed in' to reset session.",
    "codeExample": "let warningTimer, logoutTimer;\nconst WARNING_MS = 14 * 60 * 1000;\nconst LOGOUT_MS = 15 * 60 * 1000;\n\nfunction resetInactivity() {\n  clearTimeout(warningTimer);\n  clearTimeout(logoutTimer);\n  hideWarningModal();\n\n  warningTimer = setTimeout(showWarningModal, WARNING_MS);\n  logoutTimer = setTimeout(performLogout, LOGOUT_MS);\n}\n\n['mousemove', 'keydown', 'click', 'scroll'].forEach(evt => {\n  window.addEventListener(evt, throttle(resetInactivity, 1000), { passive: true });\n});\nresetInactivity();",
    "interviewTips": [
      "Mention throttling the activity listener so high-frequency `mousemove` events don't degrade performance."
    ]
  },
  {
    "topic": "Practical Scenarios & Production Patterns",
    "subtopic": "High-Performance Data Grid with Frozen Columns",
    "difficulty": "SCENARIO",
    "questionType": "SCENARIO",
    "question": "Scenario: Build a financial data table with a frozen sticky header and frozen first column using pure CSS and DOM positioning.",
    "shortAnswer": "Set `position: sticky` on the `<th>` elements with `top: 0`, and `position: sticky` on the first column cells with `left: 0`, giving the intersection corner cell `z-index: 3`.",
    "detailedExplanation": "- **Sticky Top**: `thead th { position: sticky; top: 0; z-index: 2; }`.\n- **Sticky Left**: `tbody td:first-child, thead th:first-child { position: sticky; left: 0; z-index: 1; }`.\n- **Corner Stacking**: The top-left corner cell must have `z-index: 3` so it stays on top of both row and column headers.\n- **Zero JS Math**: Completely eliminates complex JavaScript scroll positioning calculations.",
    "codeExample": "/* Pure CSS Sticky Header and Sticky First Column: */\n.grid-container {\n  overflow: auto;\n  max-height: 500px;\n}\n\nthead th {\n  position: sticky;\n  top: 0;\n  background: #f8fafc;\n  z-index: 2;\n}\n\ntd:first-child, th:first-child {\n  position: sticky;\n  left: 0;\n  background: #f8fafc;\n  z-index: 1;\n}\n\n/* Top-left corner cell stays above both: */\nthead th:first-child {\n  z-index: 3;\n}",
    "interviewTips": [
      "Remember the `z-index` stacking hierarchy: top header = 2, left column = 1, top-left corner = 3."
    ]
  }
];
