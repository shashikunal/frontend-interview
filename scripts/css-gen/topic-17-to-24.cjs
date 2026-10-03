// Topics 17 to 24
module.exports = [
  // ==========================================
  // TOPIC 17: Pseudo-classes
  // ==========================================
  {
    topic: "Pseudo-classes",
    subtopic: ":nth-child vs :nth-of-type",
    concept: "What is the difference between :nth-child and :nth-of-type?",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Amazon", "Meta", "Microsoft"],
    tags: ["pseudo-classes", "nth-child", "nth-of-type", "interview-favorite"],
    question: "What is the difference between `:nth-child()` and `:nth-of-type()` in CSS?",
    shortAnswer: "`:nth-child(n)` counts ALL sibling elements regardless of tag type and matches ONLY if the nth element matches the selector. `:nth-of-type(n)` filters siblings to only those sharing the SAME tag type first, then counts and matches the nth element among them.",
    detailedExplanation: "Classic gotcha: In a container with `<h1>Title</h1><p>First paragraph</p>`, `p:first-child` matches NOTHING because the very first child is an `h1`. But `p:first-of-type` correctly matches the `<p>`.",
    codeExample: `/* HTML:
   <div>
     <h1>Heading</h1>
     <p>First paragraph</p>
   </div>
*/

/* Matches NOTHING! The 1st child is <h1>, not <p> */
p:first-child {
  color: red;
}

/* WINS: Matches the first <p> element */
p:first-of-type {
  color: green;
}`
  },
  {
    topic: "Pseudo-classes",
    subtopic: ":is() vs :where()",
    concept: "What is the difference between the :is() and :where() pseudo-classes?",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Stripe", "Apple"],
    tags: ["pseudo-classes", "is-selector", "where-selector", "specificity"],
    question: "What is the difference between `:is()` and `:where()` in modern CSS?",
    shortAnswer: "Both take a list of selectors and match any element matched by one of them, but they handle specificity completely differently: `:is()` takes the specificity of its MOST specific selector in the argument list. `:where()` ALWAYS has zero specificity `(0, 0, 0, 0)`.",
    detailedExplanation: "Because `:where()` has 0 specificity, it is ideal for CSS resets, UI component libraries, and design systems where consumers should easily be able to override default styles without specificity wars.",
    codeExample: `/* Specificity of :is() is (0, 1, 0, 0) because of #nav */
:is(header, #nav, footer) p {
  color: red;
}

/* Specificity of :where() is always ZERO (0, 0, 0, 1 for 'p' only) */
:where(header, #nav, footer) p {
  color: blue; /* Easily overridden by ANY class or element selector */
}`
  },
  {
    topic: "Pseudo-classes",
    subtopic: ":has() - The CSS Parent Selector",
    concept: "How does the :has() pseudo-class work and why is it a game-changer?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Amazon", "Netflix"],
    tags: ["pseudo-classes", "has-selector", "modern-css", "parent-selector"],
    question: "What is the `:has()` pseudo-class in modern CSS, and how does it act as a 'parent selector'?",
    shortAnswer: "`:has()` is a relational pseudo-class that allows you to style a parent or ancestor element based on its descendants or subsequent siblings. Previously, this required JavaScript DOM querying.",
    detailedExplanation: "Browser engines historically avoided parent selectors due to performance cycles during style recalculations. Modern engines optimized this, making `:has()` one of the most powerful features in CSS.",
    codeExample: `/* 1. Style a card parent ONLY if it contains an image */
.card:has(img) {
  grid-template-columns: 200px 1fr;
}

/* 2. Style a form label when its input is invalid */
label:has(+ input:invalid) {
  color: red;
}

/* 3. Style <body> when a modal dialog is open */
body:has(dialog[open]) {
  overflow: hidden; /* Lock scroll natively without JS! */
}`
  },
  {
    topic: "Pseudo-classes",
    subtopic: ":focus vs :focus-visible vs :focus-within",
    concept: "Compare :focus, :focus-visible, and :focus-within.",
    difficulty: "EASY",
    questionType: "COMPARISON",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Google", "Microsoft", "Salesforce"],
    tags: ["pseudo-classes", "focus", "focus-visible", "focus-within", "accessibility"],
    question: "Explain the difference between `:focus`, `:focus-visible`, and `:focus-within`.",
    shortAnswer: "`:focus`: Triggers on ANY focus event (mouse click or keyboard tab). `:focus-visible`: Triggers ONLY when the browser heuristics determine focus should be visibly indicated (typically keyboard navigation, suppressing rings on mouse clicks). `:focus-within`: Triggers on a parent container when ANY of its descendants receive focus.",
    detailedExplanation: "Replacing `:focus { outline: none }` with `:focus:not(:focus-visible) { outline: none }` and styling `:focus-visible` ensures mouse users don't see ugly rings while keyboard accessibility is fully preserved.",
    codeExample: `/* Accessible button focus */
button:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* Highlight entire form row when input inside it has focus */
.form-group:focus-within {
  border-color: #2563eb;
  background-color: #f8fafc;
}`
  },

  // ==========================================
  // TOPIC 18: Pseudo-elements
  // ==========================================
  {
    topic: "Pseudo-elements",
    subtopic: "::before and ::after & content Property",
    concept: "How do ::before and ::after work and what is mandatory for them to render?",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Amazon", "Google", "Meta"],
    tags: ["pseudo-elements", "before", "after", "content"],
    question: "How do `::before` and `::after` work, where are they injected in the DOM, and what property is required for them to appear?",
    shortAnswer: "`::before` and `::after` create inline pseudo-elements that are injected as the FIRST and LAST child of the targeted element, respectively. They will NOT render at all unless the `content` property is defined (even if empty `content: ''`).",
    detailedExplanation: "Because pseudo-elements exist in the CSS render tree rather than the HTML source, screen readers can sometimes struggle if meaningful content is placed in `content: ''`. They should primarily be used for visual decorations, icons, and tooltips.",
    codeExample: `/* Custom tooltip using pseudo-elements */
.tooltip {
  position: relative;
}

.tooltip::after {
  content: attr(data-tooltip); /* Injects tooltip text from HTML attribute */
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background: #0f172a;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
}`
  },
  {
    topic: "Pseudo-elements",
    subtopic: "Single Colon (:) vs Double Colon (::)",
    concept: "What is the difference between :before and ::before?",
    difficulty: "EASY",
    questionType: "COMPARISON",
    experienceLevel: "FRESHER",
    isHighFrequency: false,
    companyTags: ["Apple", "TCS"],
    tags: ["pseudo-elements", "syntax", "css3"],
    question: "What is the difference between single colon (`:after`) and double colon (`::after`) syntax?",
    shortAnswer: "CSS3 introduced the double-colon syntax (`::`) to explicitly distinguish pseudo-elements (which create virtual DOM nodes like `::before`, `::placeholder`) from pseudo-classes (which match element states like `:hover`, `:checked`). Browsers support single colons on older pseudo-elements for backwards compatibility.",
    detailedExplanation: "Modern code should always use double colons `::` for pseudo-elements and single colon `:` for pseudo-classes.",
    codeExample: `/* Pseudo-class (state) -> single colon */
a:hover { color: blue; }

/* Pseudo-element (virtual node) -> double colon */
p::first-line { font-weight: bold; }
input::placeholder { color: #94a3b8; }`
  },

  // ==========================================
  // TOPIC 19: Transitions
  // ==========================================
  {
    topic: "Transitions",
    subtopic: "Transition Shorthand and GPU Acceleration",
    concept: "How does the transition shorthand work and what properties should be transitioned for 60fps performance?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Amazon", "Uber"],
    tags: ["transitions", "performance", "transform", "opacity", "60fps"],
    question: "What properties should you animate or transition to guarantee smooth 60fps performance, and why?",
    shortAnswer: "Only transition `transform` and `opacity`. These two properties can be handled directly by the GPU on the Compositor Thread without triggering expensive Layout (reflow) or Paint cycles on the main JavaScript thread.",
    detailedExplanation: "Transitioning `width`, `height`, `top`, or `margin` forces the browser to recalculate element geometries (reflow) and repaint every single pixel on every animation frame, causing visible stutter (jank) and battery drain.",
    codeExample: `/* ❌ Slow / Jank: triggers Layout reflow on every frame */
.card-slow {
  transition: top 0.3s ease, width 0.3s ease;
}
.card-slow:hover {
  top: -10px;
}

/* ✅ Fast / 60fps: GPU composite-only */
.card-fast {
  transition: transform 0.3s ease;
}
.card-fast:hover {
  transform: translateY(-10px);
}`
  },
  {
    topic: "Transitions",
    subtopic: "Transitioning Height to Auto",
    concept: "Why can't you transition height: 0 to height: auto in classic CSS, and how do you achieve an accordion animation?",
    difficulty: "INTERMEDIATE",
    questionType: "DEBUGGING",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Amazon", "Uber", "Flipkart"],
    tags: ["transitions", "accordion", "height-auto", "grid"],
    question: "Why does transitioning from `height: 0` to `height: auto` fail in CSS, and what is the modern pure-CSS solution?",
    shortAnswer: "CSS transitions require interpolable numerical values; `auto` is a keyword computed dynamically by layout, so the browser cannot calculate intermediate transition frames. The modern pure-CSS solution uses CSS Grid transitioning `grid-template-rows: 0fr` to `1fr`.",
    detailedExplanation: "With `grid-template-rows: 0fr` on a container with `overflow: hidden` on its inner wrapper, setting `grid-template-rows: 1fr` smoothly expands the accordion to its natural content height.",
    codeExample: `/* Pure CSS accordion animation without fixed height! */
.accordion-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease-out;
}

.accordion-content.is-open {
  grid-template-rows: 1fr;
}

.accordion-inner {
  overflow: hidden; /* Crucial for 0fr collapsing */
}`
  },

  // ==========================================
  // TOPIC 20: Transforms
  // ==========================================
  {
    topic: "Transforms",
    subtopic: "2D and 3D Transforms",
    concept: "What do CSS transforms do and how does transform-origin affect rotation?",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Adobe", "Apple", "Google"],
    tags: ["transforms", "transform-origin", "translate", "rotate"],
    question: "How do `translate()`, `scale()`, `rotate()`, and `skew()` work, and what is `transform-origin`?",
    shortAnswer: "`translate(x, y)` moves an element without altering layout flow; `scale(x, y)` resizes; `rotate(deg)` rotates; `skew(x, y)` slants. `transform-origin` defines the anchor point around which transformations (especially rotation and scaling) occur (defaults to `50% 50%` center).",
    detailedExplanation: "Changing `transform-origin: top left` rotates an element around its top-left corner instead of its center point.",
    codeExample: `/* Centering an absolutely positioned element perfectly */
.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Shifts by 50% of its OWN dimensions */
}

/* Door swing rotation */
.door {
  transform-origin: left center; /* Swings from left hinge */
  transition: transform 0.5s;
}
.door.open {
  transform: rotateY(-90deg);
}`
  },

  // ==========================================
  // TOPIC 21: Animations
  // ==========================================
  {
    topic: "Animations",
    subtopic: "@keyframes & animation-fill-mode",
    concept: "What does animation-fill-mode do and what is the difference between forwards and backwards?",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Netflix"],
    tags: ["animations", "keyframes", "animation-fill-mode"],
    question: "What is `animation-fill-mode`, and what is the difference between `forwards`, `backwards`, and `both`?",
    shortAnswer: "`animation-fill-mode` defines how styles are applied before an animation starts and after it finishes. `forwards`: Element retains styles from the last keyframe (100%) after finishing. `backwards`: Element applies styles from the first keyframe (0%) immediately during `animation-delay`. `both`: Applies both forwards and backwards.",
    detailedExplanation: "By default (`none`), when an animation finishes, the element abruptly jumps back to its original non-animated CSS state. `forwards` prevents this jump.",
    codeExample: `@keyframes slideInFade {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.toast {
  animation: slideInFade 0.4s ease forwards; /* Stays at 100% state after animation ends */
}`
  },

  // ==========================================
  // TOPIC 22: Responsive Design
  // ==========================================
  {
    topic: "Responsive Design",
    subtopic: "Mobile-First vs Desktop-First",
    concept: "What is mobile-first design and why is min-width preferred over max-width?",
    difficulty: "EASY",
    questionType: "COMPARISON",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Google", "Amazon", "Meta", "Shopify"],
    tags: ["responsive", "mobile-first", "media-queries"],
    question: "What is the mobile-first responsive approach, and why is `min-width` preferred over `max-width`?",
    shortAnswer: "Mobile-first means writing baseline CSS for mobile screens first without media queries, then progressively layering on styles for larger screens using `min-width` queries. It is preferred because it ensures lighter CSS for resource-constrained mobile devices and produces clean, additive styles.",
    detailedExplanation: "Desktop-first with `max-width` requires writing complex desktop styles first and then writing overriding rules to cancel them on mobile (e.g. undoing multi-column floats or margins).",
    codeExample: `/* ✅ Mobile-first approach */
/* Base mobile styles: single column */
.container {
  display: flex;
  flex-direction: column;
}

/* Tablet & desktop: progressive enhancement */
@media (min-width: 768px) {
  .container {
    flex-direction: row;
  }
}`
  },

  // ==========================================
  // TOPIC 23: Media Queries
  // ==========================================
  {
    topic: "Media Queries",
    subtopic: "prefers-reduced-motion and Accessibility",
    concept: "What is prefers-reduced-motion and why is it essential?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Apple", "BBC", "Microsoft"],
    tags: ["media-queries", "prefers-reduced-motion", "accessibility", "a11y"],
    question: "What is the `prefers-reduced-motion` media query, and why is it critical for accessibility?",
    shortAnswer: "It detects if the user has requested the operating system to minimize non-essential animations and parallax effects. People with vestibular disorders can experience nausea, dizziness, or motion sickness from rapid website movements.",
    detailedExplanation: "Providing reduced motion is a WCAG 2.1 Success Criterion (2.3.3). You can disable animations or replace parallax swooshes with subtle, instantaneous fades.",
    codeExample: `/* Respect user motion preferences */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`
  },
  {
    topic: "Media Queries",
    subtopic: "prefers-color-scheme (Dark Mode)",
    concept: "How do you implement Dark Mode using CSS custom properties and prefers-color-scheme?",
    difficulty: "EASY",
    questionType: "CODE",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "GitHub"],
    tags: ["media-queries", "prefers-color-scheme", "dark-mode", "css-variables"],
    question: "How do you build a native dark mode system using CSS variables and `prefers-color-scheme`?",
    shortAnswer: "Define CSS variables on `:root` for light theme defaults, then override those variable values inside `@media (prefers-color-scheme: dark)`. All components referencing the variables automatically adapt.",
    detailedExplanation: "You can also allow manual toggles by binding the dark variables to a `[data-theme='dark']` attribute on the `<html>` element.",
    codeExample: `:root {
  --bg-color: #ffffff;
  --text-color: #0f172a;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #0f172a;
    --text-color: #f8fafc;
  }
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
}`
  },

  // ==========================================
  // TOPIC 24: Container Queries
  // ==========================================
  {
    topic: "Container Queries",
    subtopic: "Container Queries vs Media Queries",
    concept: "What are CSS Container Queries and how do they differ from Media Queries?",
    difficulty: "ADVANCED",
    questionType: "COMPARISON",
    experienceLevel: "3_5_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Shopify", "Stripe"],
    tags: ["container-queries", "modern-css", "responsive", "media-queries"],
    question: "What are CSS Container Queries (`@container`), and what fundamental limitation of Media Queries do they solve?",
    shortAnswer: "Media Queries evaluate the entire viewport width, meaning a component cannot know how much space its immediate parent container provides. Container Queries allow a component to adapt its styling based on the size of its parent container, making components truly reusable anywhere.",
    detailedExplanation: "A card in a narrow sidebar needs to look stacked, while the exact same card in a wide main section should look horizontal—even on the same viewport width. Container queries make this possible.",
    codeExample: `/* 1. Declare the parent as a container */
.card-wrapper {
  container-type: inline-size;
  container-name: cardContainer;
}

/* 2. Style the card based on container width */
.card {
  display: flex;
  flex-direction: column; /* Default: stacked */
}

@container cardContainer (min-width: 450px) {
  .card {
    flex-direction: row; /* Horizontal when container has >= 450px */
  }
}`
  },
  {
    topic: "Pseudo-classes",
    subtopic: ":not() Pseudo-class & Specificity",
    concept: "How does the :not() pseudo-class work and how is its specificity calculated?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Amazon"],
    tags: ["pseudo-classes", "not-selector", "specificity"],
    question: "How does the `:not()` negation pseudo-class work, and how does it calculate specificity?",
    shortAnswer: "`:not(selector)` matches any element that does NOT match the argument selector. Crucially, the `:not()` pseudo-class itself adds NO specificity, but the argument passed inside it contributes its full specificity to the selector.",
    detailedExplanation: "In Selectors Level 4, `:not()` can take a comma-separated list of arguments (e.g. `:not(.active, #hero)`), in which case it takes the specificity of the most specific selector in the list.",
    codeExample: `/* Specificity is (0, 0, 1, 1): 'p' (0,0,0,1) + '.lead' (0,0,1,0) */
p:not(.lead) {
  color: #334155;
}

/* Strip border from all list items except the last */
li:not(:last-child) {
  border-bottom: 1px solid #e2e8f0;
}`
  },
  {
    topic: "Animations",
    subtopic: "CSS Animations vs requestAnimationFrame",
    concept: "Compare CSS Animations with JavaScript requestAnimationFrame.",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Apple"],
    tags: ["animations", "requestanimationframe", "performance"],
    question: "When should you use CSS Animations versus JavaScript `requestAnimationFrame`?",
    shortAnswer: "Use CSS Animations for UI transitions, micro-interactions, loading spinners, and state changes because they run off the main JavaScript thread on the GPU compositor. Use `requestAnimationFrame` (or the Web Animations API) when animation logic requires physics calculations, dynamic user drag/gesture tracking, or complex synchronization with application state.",
    detailedExplanation: "If the main JavaScript thread freezes due to heavy data processing, CSS animations continue running smoothly at 60fps on the GPU, while `requestAnimationFrame` will stutter.",
    codeExample: `/* GPU-driven CSS animation (unaffected by JS thread lockup) */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.spinner {
  animation: spin 1s linear infinite;
}`
  },
  {
    topic: "Media Queries",
    subtopic: "Media Query Range Syntax",
    concept: "How does modern Media Query Range syntax improve on min-width / max-width?",
    difficulty: "EASY",
    questionType: "CODE",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Google", "Shopify"],
    tags: ["media-queries", "range-syntax", "modern-css"],
    question: "What is the Media Query Range Syntax (e.g. `width >= 768px`), and why is it cleaner than `min-width` and `max-width`?",
    shortAnswer: "Media Queries Level 4 introduced mathematical comparison operators (`>`, `<`, `>=`, `<=`), replacing the counterintuitive `min-width` and `max-width`. It eliminates ambiguity at exact pixel boundaries (e.g. 767.98px vs 768px) and enables clean range intervals like `@media (768px <= width <= 1024px)`.",
    detailedExplanation: "All modern evergreen browsers now support this syntax natively.",
    codeExample: `/* ❌ Old verbose syntax: */
@media (min-width: 768px) and (max-width: 1024px) {
  .tablet-layout { display: block; }
}

/* ✅ Modern Range Syntax: */
@media (768px <= width <= 1024px) {
  .tablet-layout { display: block; }
}

/* Single boundary: */
@media (width >= 1200px) {
  .desktop-layout { display: block; }
}`
  }
];
