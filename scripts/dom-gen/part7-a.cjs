// scripts/dom-gen/part7-a.cjs
// 25 Practical DOM Scenario & Architecture Questions (Scenarios 1 - 25)
// Difficulty: SCENARIO, QuestionType: SCENARIO

module.exports = [
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "Accessible Modal Dialog with Keyboard Focus Trap",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Build an accessible modal dialog in vanilla JavaScript that traps keyboard Tab focus inside the modal, closes on Escape, and restores focus to the trigger button when closed.",
    shortAnswer: "Save `document.activeElement` before opening, query all focusable elements inside the modal, intercept Tab/Shift+Tab to loop focus between first and last elements, listen for Escape to close, and return focus to the trigger on close.",
    detailedExplanation: "- **Focus Preservation**: Storing `previouslyFocusedElement = document.activeElement` ensures keyboard users return to their exact location in the DOM.\n- **Focus Trap Loop**: When Tab is pressed on the last focusable element, redirect focus to the first element; on Shift+Tab on the first element, redirect to the last.\n- **Keyboard Escape**: Listen for `e.key === 'Escape'` to dismiss the modal.\n- **Native Alternative**: Can also be achieved natively using `<dialog>` with `showModal()`.",
    codeExample: "function openModal(modalEl) {\n  const prevFocus = document.activeElement;\n  const focusables = modalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])');\n  const first = focusables[0];\n  const last = focusables[focusables.length - 1];\n\n  modalEl.classList.add('open');\n  first?.focus();\n\n  function handleKeyDown(e) {\n    if (e.key === 'Escape') closeModal();\n    if (e.key === 'Tab') {\n      if (e.shiftKey && document.activeElement === first) {\n        e.preventDefault();\n        last.focus();\n      } else if (!e.shiftKey && document.activeElement === last) {\n        e.preventDefault();\n        first.focus();\n      }\n    }\n  }\n\n  function closeModal() {\n    modalEl.classList.remove('open');\n    modalEl.removeEventListener('keydown', handleKeyDown);\n    prevFocus?.focus(); // Restores focus to trigger\n  }\n\n  modalEl.addEventListener('keydown', handleKeyDown);\n}",
    interviewTips: ["Always explain: 1) Save previous focus, 2) Trap Tab and Shift+Tab, 3) Listen for Escape, 4) Restore previous focus."]
  },
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "Infinite Scroll Feed with IntersectionObserver",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Implement an infinite scrolling product feed that loads the next batch of items when a bottom sentinel element enters the viewport, avoiding duplicate network requests.",
    shortAnswer: "Place an empty `<div id=\"sentinel\">` at the bottom of the list and watch it with an `IntersectionObserver`. When intersecting and not currently loading, set a `loading` lock flag, fetch data, append cards, and reset the flag.",
    detailedExplanation: "- **Sentinel Node**: A zero-height marker positioned immediately after the list items.\n- **Concurrency Guard**: A boolean `isLoading` flag prevents duplicate simultaneous fetches if the user triggers multiple observer entries.\n- **rootMargin Buffer**: Setting `rootMargin: '300px'` fetches content 300px before the user hits the bottom for seamless UX.",
    codeExample: "let isLoading = false;\nlet page = 1;\nconst container = document.querySelector('#feed');\nconst sentinel = document.querySelector('#sentinel');\n\nconst observer = new IntersectionObserver(async ([entry]) => {\n  if (entry.isIntersecting && !isLoading) {\n    isLoading = true;\n    sentinel.textContent = 'Loading more items...';\n    try {\n      const items = await fetchItems(page++);\n      const frag = document.createDocumentFragment();\n      items.forEach(item => frag.appendChild(renderCard(item)));\n      container.insertBefore(frag, sentinel);\n    } finally {\n      isLoading = false;\n      sentinel.textContent = '';\n    }\n  }\n}, { rootMargin: '300px' });\n\nobserver.observe(sentinel);",
    interviewTips: ["Highlight the `isLoading` lock flag and the `rootMargin` pre-fetch buffer as crucial production details."]
  },
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "Live Search with Debounce and AbortController",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Build a search autocomplete dropdown that debounces user keystrokes by 300ms, cancels in-flight fetch requests if a new keystroke occurs, and renders suggestions safely.",
    shortAnswer: "Use a debounce timer to wait 300ms after the last `input` event, abort the previous request via `abortController.abort()`, create a new controller, fetch suggestions, and render using `replaceChildren()`.",
    detailedExplanation: "- **Race Condition Defense**: Fast typing can cause slow earlier network requests to resolve after faster newer ones; cancelling in-flight requests with `AbortController` guarantees latest data wins.\n- **Debouncing**: Avoids spamming the backend API with requests for every single character.\n- **XSS Prevention**: Use `textContent` for suggestion labels to prevent script execution.",
    codeExample: "let currentController = null;\nlet debounceTimer = null;\nconst input = document.querySelector('#search');\nconst resultsList = document.querySelector('#results');\n\ninput.addEventListener('input', (e) => {\n  const query = e.target.value.trim();\n  clearTimeout(debounceTimer);\n  if (!query) { resultsList.replaceChildren(); return; }\n\n  debounceTimer = setTimeout(async () => {\n    // Cancel previous ongoing fetch:\n    currentController?.abort();\n    currentController = new AbortController();\n\n    try {\n      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {\n        signal: currentController.signal\n      });\n      const data = await res.json();\n      renderSuggestions(data);\n    } catch (err) {\n      if (err.name !== 'AbortError') console.error(err);\n    }\n  }, 300);\n});",
    interviewTips: ["Mentioning `AbortController` alongside debounce immediately elevates your answer to senior level."]
  },
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "Drag and Drop Sortable List",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Implement a reorderable sortable list using the native HTML5 Drag and Drop API with visual dragging states.",
    shortAnswer: "Set `draggable=\"true\"` on list items, track the dragged element on `dragstart`, calculate insertion positions in `dragover` using element vertical midpoints, and re-insert with `list.insertBefore()`.",
    detailedExplanation: "- **dragstart**: Store reference `draggedItem = e.target` and add a CSS `.dragging` opacity class.\n- **dragover**: Call `e.preventDefault()` to enable dropping; calculate whether the cursor is above or below the hovered sibling's midpoint to insert before or after.\n- **dragend**: Remove `.dragging` styling and persist the new order.",
    codeExample: "const list = document.querySelector('#sortable-list');\nlet draggedItem = null;\n\nlist.addEventListener('dragstart', (e) => {\n  draggedItem = e.target.closest('li');\n  e.dataTransfer.effectAllowed = 'move';\n  setTimeout(() => draggedItem.classList.add('is-dragging'), 0);\n});\n\nlist.addEventListener('dragover', (e) => {\n  e.preventDefault();\n  const target = e.target.closest('li');\n  if (target && target !== draggedItem) {\n    const rect = target.getBoundingClientRect();\n    const midpoint = rect.top + rect.height / 2;\n    if (e.clientY < midpoint) {\n      list.insertBefore(draggedItem, target);\n    } else {\n      list.insertBefore(draggedItem, target.nextSibling);\n    }\n  }\n});\n\nlist.addEventListener('dragend', () => draggedItem?.classList.remove('is-dragging'));",
    interviewTips: ["Explain the vertical midpoint calculation: `e.clientY < (rect.top + rect.height / 2)` determines insert-before vs insert-after."]
  },
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "Click Outside to Dismiss Custom Dropdown",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Build a reusable dropdown menu that toggles open on button click and automatically closes when the user clicks anywhere outside the menu or presses Escape.",
    shortAnswer: "Toggle the `'open'` class on trigger click; attach a `click` listener to `document` that closes the menu if `!menu.contains(event.target)`, and handle `Escape` via `keydown`.",
    detailedExplanation: "- **node.contains()**: Elegantly determines whether the clicked target is inside the dropdown container.\n- **Clean Unbinding**: Only listen to document click while the menu is open, or use a persistent delegated document handler.\n- **Event Timing**: Attach document click in `setTimeout(..., 0)` or check `e.target !== triggerBtn` so the opening click doesn't close it instantly.",
    codeExample: "const dropdown = document.querySelector('.dropdown');\nconst trigger = dropdown.querySelector('.dropdown-trigger');\n\nfunction closeMenu() {\n  dropdown.classList.remove('is-open');\n  document.removeEventListener('click', onDocClick);\n  document.removeEventListener('keydown', onKeyDown);\n}\n\nfunction onDocClick(e) {\n  if (!dropdown.contains(e.target)) closeMenu();\n}\n\nfunction onKeyDown(e) {\n  if (e.key === 'Escape') closeMenu();\n}\n\ntrigger.addEventListener('click', (e) => {\n  const isOpen = dropdown.classList.toggle('is-open');\n  if (isOpen) {\n    document.addEventListener('click', onDocClick);\n    document.addEventListener('keydown', onKeyDown);\n  } else {\n    closeMenu();\n  }\n});",
    interviewTips: ["Always demonstrate unbinding the document listeners when the dropdown closes to prevent memory leaks."]
  },
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "Single-Open Accordion with Details and Summary",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Create an FAQ accordion using native <details> tags where expanding one item automatically collapses all other open items (exclusive accordion).",
    shortAnswer: "Listen for the `toggle` event on all `<details>` elements; when an item opens (`item.open === true`), iterate over sibling items and set `otherItem.open = false`.",
    detailedExplanation: "- **Native Semantic HTML**: Uses `<details>` and `<summary>` for built-in keyboard accessibility and screen reader support.\n- **toggle Event**: Fires when open status changes.\n- **Modern HTML `name` Attribute**: Modern browsers now support `<details name=\"faq\">` natively for exclusive accordions without any JavaScript!",
    codeExample: "// Modern Zero-JS solution in modern HTML:\n// <details name=\"faq-group\"><summary>Q1</summary><p>A1</p></details>\n// <details name=\"faq-group\"><summary>Q2</summary><p>A2</p></details>\n\n// Resilient JavaScript Fallback:\nconst accordions = document.querySelectorAll('details.faq-item');\naccordions.forEach(target => {\n  target.addEventListener('toggle', () => {\n    if (target.open) {\n      accordions.forEach(other => {\n        if (other !== target && other.open) other.open = false;\n      });\n    }\n  });\n});",
    interviewTips: ["Mention the new HTML5 `<details name=\"group\">` attribute as the modern native exclusive accordion standard."]
  },
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "Virtual Scrolling List for 50,000 Items",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Design a virtual scrolling list capable of smoothly rendering 50,000 rows without browser lag or memory exhaustion.",
    shortAnswer: "Create a tall container matching the total virtual height (`50000 * rowHeight`), listen for scroll events throttled by rAF, compute visible start and end indices based on `scrollTop`, and render only the ~20 visible rows positioned via `transform: translateY()`.",
    detailedExplanation: "- **Virtual Spacer**: An empty container with height `totalItems * rowHeight` keeps the scrollbar proportionate.\n- **Visible Window**: `startIndex = Math.floor(scrollTop / rowHeight)`, `endIndex = startIndex + visibleCount + buffer`.\n- **Pool Rendering**: Only ~20-30 DOM elements ever exist, repositioned using GPU-accelerated CSS `transform`.",
    codeExample: "const ROW_HEIGHT = 40;\nconst VISIBLE_COUNT = 25;\nconst BUFFER = 5;\nconst totalItems = 50000;\n\nconst viewport = document.querySelector('#viewport');\nconst spacer = document.querySelector('#spacer');\nconst content = document.querySelector('#content');\n\nspacer.style.height = `${totalItems * ROW_HEIGHT}px`;\n\nfunction renderWindow() {\n  const scrollTop = viewport.scrollTop;\n  const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);\n  const end = Math.min(totalItems, start + VISIBLE_COUNT + (BUFFER * 2));\n\n  content.style.transform = `translateY(${start * ROW_HEIGHT}px)`;\n  content.replaceChildren();\n  for (let i = start; i < end; i++) {\n    const row = document.createElement('div');\n    row.className = 'virtual-row';\n    row.textContent = `Row #${i + 1}: Data item`;\n    content.appendChild(row);\n  }\n}\nviewport.addEventListener('scroll', () => requestAnimationFrame(renderWindow));\nrenderWindow();",
    interviewTips: ["Clearly outline the 3 parts: 1) Total height spacer, 2) Visible slice computation, 3) Transform offset."]
  },
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "Interactive Star Rating Widget",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Build a 5-star rating widget in vanilla JavaScript supporting hover preview, click selection, keyboard Arrow navigation, and form value submission.",
    shortAnswer: "Render 5 buttons with `role=\"radio\"`, track `currentRating` and `hoverRating`, update visual star fills on `mouseenter`/`mouseleave`, and update state and hidden form input on click/keydown.",
    detailedExplanation: "- **Accessibility**: Container has `role=\"radiogroup\"`, stars have `role=\"radio\"` and `aria-checked`.\n- **Hover State**: Highlights stars up to the hovered index without committing the rating.\n- **Form Integration**: Updates a hidden `<input name=\"rating\" type=\"hidden\">` for native form submissions.",
    codeExample: "const container = document.querySelector('#star-rating');\nconst hiddenInput = document.querySelector('#rating-val');\nconst stars = container.querySelectorAll('.star-btn');\nlet selectedRating = 0;\n\nfunction renderStars(rating) {\n  stars.forEach((star, idx) => {\n    star.classList.toggle('filled', idx < rating);\n    star.setAttribute('aria-checked', idx < rating ? 'true' : 'false');\n  });\n}\n\ncontainer.addEventListener('mouseover', (e) => {\n  const star = e.target.closest('.star-btn');\n  if (star) renderStars(Number(star.dataset.value));\n});\n\ncontainer.addEventListener('mouseleave', () => renderStars(selectedRating));\n\ncontainer.addEventListener('click', (e) => {\n  const star = e.target.closest('.star-btn');\n  if (star) {\n    selectedRating = Number(star.dataset.value);\n    hiddenInput.value = selectedRating;\n    renderStars(selectedRating);\n  }\n});",
    interviewTips: ["Include keyboard accessibility (Arrow keys) and hidden input syncing when writing this widget."]
  },
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "Auto-Resizing Textarea",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Implement an auto-growing <textarea> that expands its height smoothly as the user types multiple lines and shrinks when content is deleted.",
    shortAnswer: "On every `input` event, temporarily set `textarea.style.height = 'auto'`, then set `textarea.style.height = textarea.scrollHeight + 'px'`.",
    detailedExplanation: "- **The Shrink Trap**: Setting height to `scrollHeight` directly allows growing, but prevents shrinking when text is deleted.\n- **Resetting to Auto**: Setting `height = 'auto'` forces the browser to recalculate the minimum required `scrollHeight` accurately.\n- **CSS Box-Sizing**: Ensure `box-sizing: border-box` is set in CSS to account for padding correctly.",
    codeExample: "const textarea = document.querySelector('#auto-grow-textarea');\n\nfunction autoResize() {\n  // 1. Reset height to auto to calculate true scrollHeight after deletions:\n  textarea.style.height = 'auto';\n  // 2. Set height to match new content scrollHeight:\n  textarea.style.height = `${textarea.scrollHeight}px`;\n}\n\ntextarea.addEventListener('input', autoResize);\nautoResize(); // Initial sizing on page load",
    interviewTips: ["Remember step 1: Setting `height = 'auto'` is the secret to allowing the textarea to shrink when text is deleted."]
  },
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "Multi-Step Form Wizard with Validation",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Build a multi-step checkout wizard (Step 1 -> Step 2 -> Step 3) that validates fields in the active step before allowing the user to proceed to the next step.",
    shortAnswer: "Group steps into separate `<fieldset>` containers; on 'Next' click, run `stepFieldset.querySelectorAll(':invalid')` or `input.checkValidity()`. If valid, increment the step index and toggle step visibility.",
    detailedExplanation: "- **Step Validation**: Validate only inputs within the current active step using `input.reportValidity()`.\n- **Progress Bar**: Update visual progress indicators and aria attributes (`aria-current=\"step\"`).\n- **Preventing Premature Submission**: Disable Enter key submissions until on the final step.",
    codeExample: "let currentStep = 0;\nconst steps = document.querySelectorAll('.wizard-step');\nconst nextBtn = document.querySelector('#next-step-btn');\n\nfunction validateCurrentStep() {\n  const activeInputs = steps[currentStep].querySelectorAll('input, select, textarea');\n  for (const input of activeInputs) {\n    if (!input.checkValidity()) {\n      input.reportValidity(); // Shows native error tooltip\n      return false;\n    }\n  }\n  return true;\n}\n\nnextBtn.addEventListener('click', () => {\n  if (!validateCurrentStep()) return;\n  \n  steps[currentStep].classList.remove('active');\n  currentStep++;\n  steps[currentStep].classList.add('active');\n});",
    interviewTips: ["Explain validating only inputs in the current step using `stepElement.querySelectorAll('input')`."]
  },
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "Image Zoom Lens on Mouse Hover",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Build an e-commerce product image zoom lens that shows a magnified preview window following the user's cursor.",
    shortAnswer: "Track cursor offset relative to the image using `getBoundingClientRect()`, clamp coordinates within boundaries, move a visual lens `<div>`, and offset the high-resolution background image in a zoom preview pane by the zoom ratio.",
    detailedExplanation: "- **Cursor Calculation**: `x = e.clientX - imgRect.left`, `y = e.clientY - imgRect.top`.\n- **Boundary Clamping**: Clamp lens coordinates so it doesn't extend beyond the product image edges.\n- **Background Offset**: Move preview background by `-x * zoomRatio` and `-y * zoomRatio`.",
    codeExample: "const img = document.querySelector('#product-img');\nconst preview = document.querySelector('#zoom-preview');\nconst ZOOM = 2.5;\n\nimg.addEventListener('mousemove', (e) => {\n  const rect = img.getBoundingClientRect();\n  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));\n  const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));\n\n  preview.style.backgroundPosition = `-${x * ZOOM}px -${y * ZOOM}px`;\n});",
    interviewTips: ["Mention clamping coordinates `Math.max(0, Math.min(pos, max))` to keep the zoom lens inside image boundaries."]
  },
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "Copy to Clipboard Button with Feedback",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Implement a 'Copy Code' button with animated 'Copied!' checkmark feedback and error handling.",
    shortAnswer: "Read text from the code block, invoke `await navigator.clipboard.writeText(text)`, toggle a `'copied'` CSS class with a checkmark icon, and revert after a 2-second timeout.",
    detailedExplanation: "- **Clipboard API**: Modern `navigator.clipboard.writeText()`.\n- **Timeout Reset**: Clear previous timers to handle rapid repeated clicks cleanly.\n- **Fallback Support**: Gracefully alert the user if clipboard permissions are denied.",
    codeExample: "function attachCopyHandler(button, codeBlock) {\n  let resetTimer;\n  button.addEventListener('click', async () => {\n    try {\n      await navigator.clipboard.writeText(codeBlock.textContent);\n      button.textContent = 'Copied!';\n      button.classList.add('copied');\n      \n      clearTimeout(resetTimer);\n      resetTimer = setTimeout(() => {\n        button.textContent = 'Copy';\n        button.classList.remove('copied');\n      }, 2000);\n    } catch (err) {\n      button.textContent = 'Failed';\n    }\n  });\n}",
    interviewTips: ["Remember to call `clearTimeout(resetTimer)` to handle rapid double-clicks without animation glitches."]
  },
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "Reading Progress Bar",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Build a top-pinned reading progress bar that smoothly reflects how far the user has scrolled through an article.",
    shortAnswer: "Calculate progress percentage as `window.scrollY / (article.scrollHeight - window.innerHeight)` and update `progressBar.style.width` or `transform: scaleX(progress)` using requestAnimationFrame.",
    detailedExplanation: "- **Calculation Formula**: `progress = currentScroll / totalScrollableDistance`.\n- **Transform over Width**: Animating `transform: scaleX(ratio)` is GPU-accelerated and avoids reflows.\n- **rAF Throttling**: Locks updates to the display refresh rate for smooth 60fps rendering.",
    codeExample: "const progressBar = document.querySelector('#reading-progress');\nlet ticking = false;\n\nfunction updateProgress() {\n  const total = document.documentElement.scrollHeight - window.innerHeight;\n  const progress = total > 0 ? window.scrollY / total : 0;\n  progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;\n  ticking = false;\n}\n\nwindow.addEventListener('scroll', () => {\n  if (!ticking) {\n    requestAnimationFrame(updateProgress);\n    ticking = true;\n  }\n}, { passive: true });",
    interviewTips: ["Use `transform: scaleX(progress)` with `transform-origin: left` instead of `style.width` for GPU performance."]
  },
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "Toast Notification Stack Manager",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Build a toast notification manager that queues, displays, stacks, and automatically dismisses notifications after 4 seconds.",
    shortAnswer: "Maintain a fixed container, create toast elements with icon, message, and close button, append them to the container, and remove them with an exit fade animation after a 4-second timeout.",
    detailedExplanation: "- **Dismiss Animation**: Add a `'fade-out'` class, then call `toast.remove()` on `transitionend` or `animationend`.\n- **Manual Close**: Allow users to dismiss early by clicking an 'x' button.\n- **Stacking**: CSS Flexbox column with gap stacks toasts neatly.",
    codeExample: "const toastContainer = document.querySelector('#toast-container');\n\nfunction showToast(message, type = 'info') {\n  const toast = document.createElement('div');\n  toast.className = `toast toast-${type}`;\n  toast.textContent = message;\n\n  const closeBtn = document.createElement('button');\n  closeBtn.textContent = '×';\n  closeBtn.onclick = () => dismiss(toast);\n  toast.appendChild(closeBtn);\n\n  toastContainer.appendChild(toast);\n  const timer = setTimeout(() => dismiss(toast), 4000);\n\n  function dismiss(el) {\n    clearTimeout(timer);\n    el.classList.add('dismissing');\n    el.addEventListener('transitionend', () => el.remove());\n  }\n}",
    interviewTips: ["Wait for `transitionend` before removing the node with `el.remove()` to allow exit animations to complete."]
  },
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "OTP 6-Digit Verification Inputs",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Build a 6-digit OTP verification component that automatically advances focus on character entry, jumps back on Backspace, and distributes pasted 6-digit codes across all boxes.",
    shortAnswer: "Render 6 single-character text inputs, advance focus to `nextElementSibling` on `input`, reverse focus to `previousElementSibling` on `Backspace`, and distribute characters from the `paste` event across all 6 inputs.",
    detailedExplanation: "- **Auto-Advance**: When a digit is entered, call `input.nextElementSibling?.focus()`.\n- **Backspace Reversal**: If Backspace is pressed and current input is empty, focus `previousElementSibling`.\n- **Paste Handling**: Intercept `paste`, validate 6 digits, and populate `inputs[i].value = chars[i]`.",
    codeExample: "const inputs = document.querySelectorAll('.otp-box');\n\ninputs.forEach((input, index) => {\n  input.addEventListener('input', (e) => {\n    if (input.value && index < inputs.length - 1) {\n      inputs[index + 1].focus();\n    }\n  });\n\n  input.addEventListener('keydown', (e) => {\n    if (e.key === 'Backspace' && !input.value && index > 0) {\n      inputs[index - 1].focus();\n    }\n  });\n\n  input.addEventListener('paste', (e) => {\n    e.preventDefault();\n    const pasteData = e.clipboardData.getData('text').trim();\n    if (/^\\d{6}$/.test(pasteData)) {\n      inputs.forEach((box, i) => box.value = pasteData[i]);\n      inputs[5].focus();\n    }\n  });\n});",
    interviewTips: ["Make sure to demonstrate all three features: 1) auto-advance, 2) backspace reversal, 3) 6-digit paste handler."]
  },
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "Color Theme Picker Updating CSS Variables",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Build an interactive color palette picker that dynamically updates theme CSS variables across the entire application and saves preferences to localStorage.",
    shortAnswer: "Listen for color swatch clicks, set CSS variables via `document.documentElement.style.setProperty('--primary-color', color)`, and persist to `localStorage.setItem('theme_color', color)`.",
    detailedExplanation: "- **document.documentElement**: Modifying properties on `:root` cascades variables through the entire DOM tree.\n- **Persistence**: Restore saved theme color from `localStorage` on initial page load.\n- **No Re-render**: Changes colors instantly without recalculating DOM structure or reloading sheets.",
    codeExample: "function applyThemeColor(color) {\n  document.documentElement.style.setProperty('--brand-primary', color);\n  localStorage.setItem('user_theme_color', color);\n}\n\ndocument.querySelectorAll('.color-swatch').forEach(swatch => {\n  swatch.addEventListener('click', () => applyThemeColor(swatch.dataset.color));\n});\n\n// Restore on load:\nconst savedColor = localStorage.getItem('user_theme_color');\nif (savedColor) applyThemeColor(savedColor);",
    interviewTips: ["Point out that updating CSS variables on `document.documentElement` is instant and requires zero DOM node mutations."]
  },
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "Dark Mode Toggle with View Transitions",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Implement a Dark Mode toggle that checks system preference, stores user choice, and uses the View Transitions API for a circular animated screen wipe effect.",
    shortAnswer: "Toggle the `'dark'` class inside `document.startViewTransition()`, update `localStorage`, and style `::view-transition-old(root)` and `::view-transition-new(root)`.",
    detailedExplanation: "- **System Preference**: Check `window.matchMedia('(prefers-color-scheme: dark)').matches` as default.\n- **View Transition**: Wrapping DOM mutations in `document.startViewTransition()` lets CSS smoothly morph between themes.\n- **Storage Sync**: Save user override to `localStorage`.",
    codeExample: "function toggleTheme() {\n  const isDark = document.documentElement.classList.toggle('dark');\n  localStorage.setItem('theme', isDark ? 'dark' : 'light');\n}\n\nfunction handleThemeClick() {\n  if (!document.startViewTransition) {\n    toggleTheme();\n    return;\n  }\n  document.startViewTransition(toggleTheme);\n}",
    interviewTips: ["Highlight `document.startViewTransition` as the modern standard for theme switching animations."]
  },
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "Resizable Two-Pane Splitter with Pointer Capture",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Build a draggable horizontal split-pane (left sidebar, right content) where users drag a vertical divider bar to resize panes smoothly.",
    shortAnswer: "Attach pointer listeners to the divider handle, call `setPointerCapture(e.pointerId)` on pointerdown, and adjust pane widths based on `e.clientX` during pointermove.",
    detailedExplanation: "- **setPointerCapture**: Guarantees drag tracking continues even if the mouse moves over iframes or outside the window.\n- **Min/Max Constraints**: Clamp pane widths (e.g. min 150px, max 80% of container).\n- **Clean Release**: Capture releases automatically on `pointerup`.",
    codeExample: "const divider = document.querySelector('#pane-divider');\nconst leftPane = document.querySelector('#left-pane');\nconst container = document.querySelector('#split-container');\n\ndivider.addEventListener('pointerdown', (e) => {\n  divider.setPointerCapture(e.pointerId);\n  \n  function onPointerMove(moveEvent) {\n    const containerRect = container.getBoundingClientRect();\n    const newWidth = moveEvent.clientX - containerRect.left;\n    if (newWidth > 150 && newWidth < containerRect.width - 150) {\n      leftPane.style.width = `${newWidth}px`;\n    }\n  }\n  \n  function onPointerUp() {\n    divider.removeEventListener('pointermove', onPointerMove);\n    divider.removeEventListener('pointerup', onPointerUp);\n  }\n  \n  divider.addEventListener('pointermove', onPointerMove);\n  divider.addEventListener('pointerup', onPointerUp);\n});",
    interviewTips: ["Mention `setPointerCapture` as the clean modern alternative to listening to `window.onmousemove`."]
  },
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "Real-time Character Counter with Limit Warning",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Build a Twitter-style character counter that displays remaining characters, turns orange at 80%, turns red at 100%, and disables the submit button if exceeded.",
    shortAnswer: "Listen to `input` on textarea, calculate `remaining = MAX - textarea.value.length`, update counter text, toggle warning CSS classes, and set `submitBtn.disabled = remaining < 0`.",
    detailedExplanation: "- **input Event**: Updates in real-time on typing and pasting.\n- **Color Thresholds**: Apply warning class when remaining is less than 20% of limit.\n- **Submit Button State**: Set `submitBtn.disabled = true` if over limit or empty.",
    codeExample: "const textarea = document.querySelector('#post-text');\nconst counter = document.querySelector('#char-count');\nconst submitBtn = document.querySelector('#submit-post');\nconst MAX_CHARS = 280;\n\ntextarea.addEventListener('input', () => {\n  const len = textarea.value.length;\n  const remaining = MAX_CHARS - len;\n  \n  counter.textContent = `${remaining} characters left`;\n  counter.classList.toggle('warning', remaining <= 28 && remaining > 0);\n  counter.classList.toggle('danger', remaining <= 0);\n  \n  submitBtn.disabled = len === 0 || remaining < 0;\n});",
    interviewTips: ["Remember to disable submission for BOTH conditions: empty input (`len === 0`) and exceeding limit (`remaining < 0`)."]
  },
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "Accessible Tabbed Navigation Interface",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Implement an accessible Tab component conforming to WAI-ARIA tab pattern with Left/Right Arrow keyboard switching.",
    shortAnswer: "Set `role=\"tablist\"` on container, `role=\"tab\"` on tabs, and `role=\"tabpanel\"` on panels. Support ArrowLeft and ArrowRight to shift focus and activate tabs automatically.",
    detailedExplanation: "- **ARIA Attributes**: `aria-selected=\"true/false\"`, `aria-controls=\"panel-id\"`, `tabindex=\"0\"` on active tab, `tabindex=\"-1\"` on inactive tabs.\n- **Keyboard Navigation**: Left/Right arrows navigate tabs; Home/End jump to first/last tab.\n- **Panel Display**: Show matching panel and hide others with `hidden` attribute.",
    codeExample: "const tabList = document.querySelector('[role=\"tablist\"]');\nconst tabs = [...tabList.querySelectorAll('[role=\"tab\"]')];\nconst panels = [...document.querySelectorAll('[role=\"tabpanel\"]')];\n\nfunction switchTab(newTab) {\n  tabs.forEach(tab => {\n    const isTarget = tab === newTab;\n    tab.setAttribute('aria-selected', isTarget);\n    tab.tabIndex = isTarget ? 0 : -1;\n  });\n  panels.forEach(p => p.hidden = p.id !== newTab.getAttribute('aria-controls'));\n  newTab.focus();\n}\n\ntabList.addEventListener('keydown', (e) => {\n  let index = tabs.indexOf(document.activeElement);\n  if (index === -1) return;\n  if (e.key === 'ArrowRight') switchTab(tabs[(index + 1) % tabs.length]);\n  if (e.key === 'ArrowLeft') switchTab(tabs[(index - 1 + tabs.length) % tabs.length]);\n});",
    interviewTips: ["Highlight roving tabindex (`tabindex=\"0\"` on active tab, `-1` on others) as the WAI-ARIA standard for tablists."]
  },
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "File Drag and Drop Zone with Image Preview",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Build a drag-and-drop file upload container with visual drop highlight, file type verification (images only), and instantaneous thumbnail preview.",
    shortAnswer: "Prevent default on `dragover`/`drop`, extract `e.dataTransfer.files[0]`, verify `file.type.startsWith('image/')`, generate an object URL via `URL.createObjectURL(file)`, and display the thumbnail.",
    detailedExplanation: "- **Drag Highlights**: Add `.dragover` CSS class on `dragenter` and remove on `dragleave`/`drop`.\n- **File Validation**: Check MIME type and file size (<5MB) before processing.\n- **Blob URL Cleanup**: Call `URL.revokeObjectURL(img.src)` after image loads to prevent memory leaks.",
    codeExample: "const dropZone = document.querySelector('#upload-zone');\nconst previewImg = document.querySelector('#thumbnail');\n\n['dragenter', 'dragover'].forEach(name => {\n  dropZone.addEventListener(name, (e) => {\n    e.preventDefault();\n    dropZone.classList.add('hovering');\n  });\n});\n\n['dragleave', 'drop'].forEach(name => {\n  dropZone.addEventListener(name, () => dropZone.classList.remove('hovering'));\n});\n\ndropZone.addEventListener('drop', (e) => {\n  e.preventDefault();\n  const file = e.dataTransfer.files[0];\n  if (file && file.type.startsWith('image/')) {\n    const url = URL.createObjectURL(file);\n    previewImg.src = url;\n    previewImg.onload = () => URL.revokeObjectURL(url);\n  }\n});",
    interviewTips: ["Mention calling `URL.revokeObjectURL()` once the image loads to free browser memory."]
  },
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "Sticky Smart Header (Hide on Scroll Down, Show on Scroll Up)",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Build a sticky navbar that slides up out of view when scrolling down and slides back down into view when scrolling up.",
    shortAnswer: "Track `lastScrollY`; on scroll, compare `currentScrollY > lastScrollY` to toggle a `.header-hidden` transform class, updating `lastScrollY` within a rAF tick.",
    detailedExplanation: "- **Direction Detection**: `currentScrollY > lastScrollY` indicates downward scrolling (hide header); upward scroll reveals header.\n- **Tolerance Threshold**: Require scrolling at least 10px before triggering to avoid jitter on small trackpad movements.\n- **Transform Performance**: Use `transform: translateY(-100%)` for smooth GPU-accelerated hide animation.",
    codeExample: "const header = document.querySelector('header');\nlet lastScrollY = window.scrollY;\nlet ticking = false;\n\nfunction updateHeader() {\n  const currentScrollY = window.scrollY;\n  if (currentScrollY > lastScrollY && currentScrollY > 100) {\n    header.classList.add('is-hidden'); // Scrolling down\n  } else {\n    header.classList.remove('is-hidden'); // Scrolling up\n  }\n  lastScrollY = currentScrollY;\n  ticking = false;\n}\n\nwindow.addEventListener('scroll', () => {\n  if (!ticking) {\n    requestAnimationFrame(updateHeader);\n    ticking = true;\n  }\n}, { passive: true });",
    interviewTips: ["Include a threshold check (`currentScrollY > 100`) so the header doesn't hide at the very top of the page."]
  },
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "Sortable Filterable Paginated Table",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Implement client-side sorting and search filtering on a dynamic HTML table in vanilla JavaScript.",
    shortAnswer: "Filter data array by search query, sort array by clicked column key and direction, slice for current page (`page * pageSize`), and render rows using DocumentFragment or `replaceChildren()`.",
    detailedExplanation: "- **Data-First Rendering**: Maintain state in a JavaScript array rather than parsing strings out of DOM cells.\n- **Sort Direction**: Toggle between ascending (`'asc'`) and descending (`'desc'`).\n- **Fast Render**: Re-render tbody using `tableBody.replaceChildren(fragment)`.",
    codeExample: "let state = { data: allUsers, query: '', sortCol: 'name', sortAsc: true, page: 1, perPage: 10 };\n\nfunction getFilteredData() {\n  return state.data\n    .filter(u => u.name.toLowerCase().includes(state.query.toLowerCase()))\n    .sort((a, b) => {\n      const valA = a[state.sortCol], valB = b[state.sortCol];\n      return (valA < valB ? -1 : 1) * (state.sortAsc ? 1 : -1);\n    });\n}\n\nfunction renderTable() {\n  const filtered = getFilteredData();\n  const pageData = filtered.slice((state.page - 1) * state.perPage, state.page * state.perPage);\n  const frag = document.createDocumentFragment();\n  pageData.forEach(row => {\n    const tr = document.createElement('tr');\n    tr.innerHTML = `<td>${row.id}</td><td>${row.name}</td><td>${row.role}</td>`;\n    frag.appendChild(tr);\n  });\n  document.querySelector('#table-body').replaceChildren(frag);\n}",
    interviewTips: ["Emphasize keeping data in JavaScript state and re-rendering rather than scraping text from HTML table cells."]
  },
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "Custom Tooltip with Viewport Edge Flipping",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Build a custom tooltip system that positions tooltips above target elements, automatically flipping to below if the tooltip would overflow the top of the viewport.",
    shortAnswer: "Read target coordinates via `target.getBoundingClientRect()`, place tooltip above, and if `targetRect.top - tooltipHeight < 0`, flip placement below the target element.",
    detailedExplanation: "- **Edge Collision Detection**: If `top - tooltipHeight < 0`, viewport overflows at top; flip to `bottom = targetRect.bottom + 8`.\n- **Horizontal Centering**: `left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2)`.\n- **Fixed Positioning**: Set `position: fixed` on tooltip so scroll offsets don't require manual math.",
    codeExample: "function positionTooltip(target, tooltip) {\n  const targetRect = target.getBoundingClientRect();\n  const tooltipRect = tooltip.getBoundingClientRect();\n  \n  let top = targetRect.top - tooltipRect.height - 8; // Default above\n  if (top < 8) {\n    top = targetRect.bottom + 8; // Flip below if offscreen at top!\n  }\n  \n  let left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);\n  left = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8));\n  \n  tooltip.style.top = `${top}px`;\n  tooltip.style.left = `${left}px`;\n}",
    interviewTips: ["Demonstrate boundary checking for both vertical (flipping) and horizontal (clamping) collisions."]
  },
  {
    topic: "Practical Scenarios & Production Patterns",
    subtopic: "Inline Editable Field (Click to Edit)",
    difficulty: "SCENARIO",
    questionType: "SCENARIO",
    question: "Scenario: Build an inline editable text element that swaps to an <input> when clicked, saves on Enter or blur, and reverts to the original value on Escape.",
    shortAnswer: "Replace the text element with an `<input>` populated with the current text, focus and select it; on Enter/blur commit the new value, and on Escape restore the original text.",
    detailedExplanation: "- **Seamless Swap**: Swap display `<span>` with an `<input class=\"inline-edit\">`.\n- **Enter to Commit**: Keydown listener checks `e.key === 'Enter'` to blur and commit.\n- **Escape to Cancel**: Set a flag `cancelled = true` on Escape so blur does not commit unwanted text.",
    codeExample: "function makeInlineEditable(element, onSave) {\n  element.addEventListener('click', () => {\n    const originalVal = element.textContent;\n    const input = document.createElement('input');\n    input.type = 'text';\n    input.value = originalVal;\n    let isCancelled = false;\n\n    input.addEventListener('keydown', (e) => {\n      if (e.key === 'Enter') input.blur();\n      if (e.key === 'Escape') { isCancelled = true; input.blur(); }\n    });\n\n    input.addEventListener('blur', () => {\n      const finalVal = isCancelled ? originalVal : input.value.trim() || originalVal;\n      element.textContent = finalVal;\n      input.replaceWith(element);\n      if (!isCancelled && finalVal !== originalVal) onSave(finalVal);\n    });\n\n    element.replaceWith(input);\n    input.focus();\n    input.select();\n  });\n}",
    interviewTips: ["Highlight the `isCancelled` flag on Escape so the subsequent `blur` event doesn't accidentally save cancelled edits."]
  }
];
