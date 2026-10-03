// Topics 33 to 40
module.exports = [
  // ==========================================
  // TOPIC 33: Filters and Effects
  // ==========================================
  {
    topic: "Filters and Effects",
    subtopic: "drop-shadow() vs box-shadow",
    concept: "What is the difference between filter: drop-shadow() and box-shadow?",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Apple", "Google", "Adobe"],
    tags: ["filters", "drop-shadow", "box-shadow"],
    question: "What is the difference between `filter: drop-shadow()` and `box-shadow` in CSS?",
    shortAnswer: "`box-shadow` casts a shadow around the rectangular bounding box of the element, ignoring transparency. `filter: drop-shadow()` evaluates the actual alpha mask of transparent PNGs, SVG icons, and clipped elements (`clip-path`), casting an organic shadow conforming to the graphic's exact contour.",
    detailedExplanation: "For transparent PNG logos, speech bubble triangles (made with borders or pseudo-elements), or SVGs, `box-shadow` looks ugly (casts a rectangular box shadow), whereas `drop-shadow` shadows the actual non-transparent pixels.",
    codeExample: `/* ❌ Casts a square shadow around transparent PNG icon */
.icon-box {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

/* ✅ Casts shadow around the actual silhouette of the PNG/SVG */
.icon-filter {
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3));
}`
  },
  {
    topic: "Filters and Effects",
    subtopic: "backdrop-filter (Glassmorphism)",
    concept: "What does backdrop-filter do and how is glassmorphism created?",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Apple", "Microsoft"],
    tags: ["filters", "backdrop-filter", "glassmorphism"],
    question: "What does `backdrop-filter` do, and how do you implement a modern glassmorphism effect?",
    shortAnswer: "`backdrop-filter` applies graphic effects (such as blur, brightness, or saturation) to the area DIRECTLY BEHIND an element, rather than the element itself. For glassmorphism: combine a semi-transparent background (`rgba(...)`), a subtle border, and `backdrop-filter: blur(12px)`.",
    detailedExplanation: "The element itself must have a semi-transparent background for the blurred backdrop underneath to be visible.",
    codeExample: `/* Modern Glassmorphism Card */
.glass-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%); /* Safari support */
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}`
  },

  // ==========================================
  // TOPIC 34: Gradients
  // ==========================================
  {
    topic: "Gradients",
    subtopic: "Linear, Radial, and Conic Gradients",
    concept: "Explain the differences between linear-gradient, radial-gradient, and conic-gradient.",
    difficulty: "EASY",
    questionType: "COMPARISON",
    experienceLevel: "FRESHER",
    isHighFrequency: false,
    companyTags: ["Adobe", "Canva"],
    tags: ["gradients", "linear-gradient", "radial-gradient", "conic-gradient"],
    question: "What are `linear-gradient`, `radial-gradient`, and `conic-gradient`?",
    shortAnswer: "`linear-gradient`: Transitions colors along a straight directional line. `radial-gradient`: Radiates colors outwards from a central focal origin in circles or ellipses. `conic-gradient`: Rotates colors around a center pivot point like a clock hand or color wheel (ideal for pie charts).",
    detailedExplanation: "Gradients in CSS are treated as `background-image`, NOT `background-color`.",
    codeExample: `/* 1. Linear: Angle direction */
.linear {
  background-image: linear-gradient(135deg, #2563eb, #9333ea);
}

/* 2. Conic: Pure CSS Pie Chart (70% blue, 30% gray) */
.pie-chart {
  border-radius: 50%;
  background-image: conic-gradient(#2563eb 0% 70%, #e2e8f0 70% 100%);
}`
  },

  // ==========================================
  // TOPIC 35: Logical Properties
  // ==========================================
  {
    topic: "Logical Properties",
    subtopic: "Physical vs Logical Properties",
    concept: "Why are CSS logical properties preferred over physical properties for internationalization?",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Amazon", "Shopify"],
    tags: ["logical-properties", "i18n", "rtl", "writing-modes"],
    question: "What is the difference between physical CSS properties (`margin-left`) and logical properties (`margin-inline-start`), and why are logical properties best practice?",
    shortAnswer: "Physical properties are tied to the physical display screen (`left`, `right`, `top`, `bottom`). Logical properties are tied to the text direction and writing mode (`inline-start`, `inline-end`, `block-start`, `block-end`). In Right-to-Left (RTL) languages like Arabic or Hebrew, logical properties automatically flip without needing manual CSS overrides.",
    detailedExplanation: "`margin-inline-start` is on the left in English (LTR) and on the right in Arabic (RTL). `inline-size` replaces `width`; `block-size` replaces `height`.",
    codeExample: `/* ❌ Old physical approach (requires duplicate RTL overrides) */
.icon {
  margin-right: 12px;
}
[dir="rtl"] .icon {
  margin-right: 0;
  margin-left: 12px; /* Tedious maintenance */
}

/* ✅ Modern logical property (adapts automatically to LTR and RTL!) */
.icon {
  margin-inline-end: 12px; /* Flips direction automatically */
}`
  },

  // ==========================================
  // TOPIC 36: Writing Modes
  // ==========================================
  {
    topic: "Writing Modes",
    subtopic: "writing-mode & direction",
    concept: "How does writing-mode work and what values does it accept?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: false,
    companyTags: ["Google", "Meta"],
    tags: ["writing-modes", "direction", "typography"],
    question: "What does the `writing-mode` property control in CSS, and what are its common values?",
    shortAnswer: "`writing-mode` controls whether text runs horizontally or vertically, and the direction in which lines progress. Values: `horizontal-tb` (standard top-to-bottom), `vertical-rl` (vertical lines, right-to-left progression, used in East Asian scripts), and `vertical-lr`.",
    detailedExplanation: "It is widely used in modern web design for decorative vertical rotated headers and table side labels.",
    codeExample: `/* Vertical sidebar tab label */
.vertical-tab {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  padding: 1rem 0.5rem;
}`
  },

  // ==========================================
  // TOPIC 37: Accessibility
  // ==========================================
  {
    topic: "Accessibility",
    subtopic: "Hiding Content for Screen Readers (.sr-only)",
    concept: "Why is display: none wrong for accessibility and what is the proper sr-only pattern?",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Microsoft", "BBC", "Apple"],
    tags: ["accessibility", "sr-only", "screen-readers", "a11y", "interview-must-know"],
    question: "Why is `display: none` unacceptable for accessible screen-reader-only text, and what is the standard `.sr-only` CSS pattern?",
    shortAnswer: "`display: none` and `visibility: hidden` remove elements completely from the Accessibility Tree, meaning assistive screen readers cannot read them. The standard `.sr-only` class clips the element to a 1x1 pixel area off-screen without removing it from the accessibility tree.",
    detailedExplanation: "This is crucial for icon buttons (like an 'X' close button or hamburger menu) that need descriptive auditory labels without visual text clutter.",
    codeExample: `/* Industry standard Screen Reader Only utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}`
  },
  {
    topic: "Accessibility",
    subtopic: "WCAG Color Contrast Ratios",
    concept: "What are the minimum WCAG AA contrast ratio requirements for web text?",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Google", "Salesforce", "Government Projects"],
    tags: ["accessibility", "contrast-ratio", "wcag"],
    question: "What are the WCAG 2.1 Level AA color contrast ratio requirements for text and UI components?",
    shortAnswer: "1. Normal text: At least 4.5:1 contrast ratio against its background. 2. Large text (at least 18pt / 24px regular, or 14pt / 18.5px bold): At least 3:1. 3. UI components & graphical elements (button borders, form input boundaries): At least 3:1.",
    detailedExplanation: "Level AAA requires higher standards: 7:1 for normal text and 4.5:1 for large text. Modern browser DevTools provide real-time contrast auditors in the color picker.",
    codeExample: `/* Compliant high-contrast palette */
:root {
  --bg: #ffffff;
  --text-normal: #1e293b; /* Ratio ~14:1 (Passes AAA) */
  --text-muted: #64748b;  /* Ratio ~4.6:1 (Passes AA) */
}`
  },

  // ==========================================
  // TOPIC 38: CSS Performance
  // ==========================================
  {
    topic: "CSS Performance",
    subtopic: "Reflow vs Repaint vs Composite",
    concept: "What is the difference between Reflow (Layout), Repaint, and Composite in browser rendering?",
    difficulty: "ADVANCED",
    questionType: "CONCEPTUAL",
    experienceLevel: "3_5_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Amazon", "Netflix", "Uber"],
    tags: ["performance", "reflow", "repaint", "composite", "interview-must-know"],
    question: "Explain the three stages of the rendering pipeline: Layout (Reflow), Paint, and Composite. Which CSS properties trigger each?",
    shortAnswer: "1. Layout (Reflow): Browser recalculates physical geometries of elements (triggered by `width`, `height`, `margin`, `top`, `font-size`). 2. Paint: Browser fills in pixels (triggered by `color`, `background-color`, `box-shadow`). 3. Composite: Browser draws GPU layers together (triggered by `transform` and `opacity`). Compositing is by far the fastest.",
    detailedExplanation: "Triggering a reflow forces the browser to re-execute Layout, Paint, AND Composite across the element and potentially its entire descendant/ancestor tree. Animating only composited properties runs entirely on the GPU without freezing the main JS thread.",
    codeExample: `/* ❌ Causes Layout Reflow + Repaint + Composite on every frame */
.box {
  transition: width 0.3s;
}

/* ✅ Causes ONLY Compositing on GPU */
.box {
  transition: transform 0.3s;
}`
  },
  {
    topic: "CSS Performance",
    subtopic: "will-change and content-visibility",
    concept: "What do will-change and content-visibility: auto do?",
    difficulty: "ADVANCED",
    questionType: "CONCEPTUAL",
    experienceLevel: "3_5_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Shopify"],
    tags: ["performance", "will-change", "content-visibility", "gpu"],
    question: "What are `will-change` and `content-visibility: auto`, and how do they boost rendering performance?",
    shortAnswer: "`will-change` hints to the browser engine to promote an element to its own GPU compositor layer in advance of an animation. `content-visibility: auto` skips rendering (layout and paint) for off-screen elements entirely until they scroll near the viewport, drastically reducing initial page load time.",
    detailedExplanation: "Gotcha: Overusing `will-change` on many elements creates excessive GPU memory layers, crashing mobile browsers. It should only be applied immediately before an animation or removed via JS after animation ends.",
    codeExample: `/* 1. will-change: GPU promotion hint */
.animated-card {
  will-change: transform;
}

/* 2. content-visibility: Skip off-screen rendering for long pages */
.blog-post-card {
  content-visibility: auto;
  contain-intrinsic-size: 0 400px; /* Estimated height to prevent scrollbar jumping */
}`
  },

  // ==========================================
  // TOPIC 39: CSS Architecture
  // ==========================================
  {
    topic: "CSS Architecture",
    subtopic: "BEM Methodology",
    concept: "What is the BEM naming methodology and why is it used?",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Google", "Amazon", "Meta", "Booking.com"],
    tags: ["css-architecture", "bem", "naming-conventions"],
    question: "What is BEM (Block Element Modifier), and what problem does it solve in large codebases?",
    shortAnswer: "BEM is a modular CSS naming methodology: `block__element--modifier`. Block: standalone entity (e.g. `btn`). Element: tied part of a block (e.g. `btn__icon`). Modifier: flag for state or theme (e.g. `btn--primary`). It keeps selector specificity flat at (0, 0, 1, 0) and eliminates specificity conflicts in large teams.",
    detailedExplanation: "Because every BEM selector is a single class, nested styles like `.nav ul li a` are replaced by `.nav__link`, preventing fragile selector dependencies.",
    codeExample: `/* Block */
.card {}

/* Element (double underscore) */
.card__title {}
.card__image {}

/* Modifier (double hyphen) */
.card--featured {}
.card__button--disabled {}`
  },

  // ==========================================
  // TOPIC 40: Modern CSS
  // ==========================================
  {
    topic: "Modern CSS",
    subtopic: "Native CSS Nesting",
    concept: "How does native CSS nesting work without preprocessors?",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Shopify"],
    tags: ["modern-css", "css-nesting", "native-css"],
    question: "How does native CSS nesting work in modern browsers, and how is the `&` symbol used?",
    shortAnswer: "Native CSS allows nesting child rules directly inside parent rules without SASS or build tools. Child selectors can be nested directly, and the `&` ampersand selector is used to append pseudo-classes (`&:hover`), modifiers (`&--active`), or reverse ancestor relationships (`.dark-theme &`).",
    detailedExplanation: "Native CSS nesting is now supported across all major evergreen browsers (Chrome, Safari, Firefox).",
    codeExample: `/* Native CSS Nesting */
.card {
  padding: 1.5rem;
  background: white;

  /* Direct child nesting */
  h2 {
    color: #1e293b;
  }

  /* Ampersand for pseudo-classes */
  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  /* Modifier */
  &.is-selected {
    border-color: #2563eb;
  }
}`
  },
  {
    topic: "Modern CSS",
    subtopic: "Cascade Layers (@layer)",
    concept: "What are CSS Cascade Layers (@layer) and how do they resolve specificity battles?",
    difficulty: "ADVANCED",
    questionType: "CONCEPTUAL",
    experienceLevel: "3_5_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Stripe"],
    tags: ["modern-css", "cascade-layers", "at-layer", "specificity"],
    question: "What are Cascade Layers (`@layer`) in modern CSS, and how do they solve specificity conflicts with third-party libraries?",
    shortAnswer: "`@layer` allows developers to define explicit priority orders for stylesheets. Styles in a higher-priority layer ALWAYS beat styles in a lower-priority layer, REGARDLESS of the selector specificity within those layers. This lets your single-class application style beat a complex third-party library selector like `#lib .btn.primary` without using `!important`.",
    detailedExplanation: "The layer order is defined at the top of your CSS: `@layer reset, framework, components, utilities;`. Unlayered styles have the highest priority of all normal author declarations.",
    codeExample: `/* Explicit layer priority order (last layer wins) */
@layer reset, framework, components;

@layer framework {
  /* High specificity library rule */
  #header .nav-item.active {
    background-color: blue;
  }
}

@layer components {
  /* Simple class WINS because 'components' layer is defined after 'framework'! */
  .nav-item {
    background-color: green;
  }
}`
  },
  {
    topic: "Modern CSS",
    subtopic: "Modern Viewport Units (dvh, svh, lvh)",
    concept: "What are dvh, svh, and lvh viewport units?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Apple", "Shopify"],
    tags: ["modern-css", "dvh", "svh", "lvh", "viewport-units"],
    question: "What are `svh`, `lvh`, and `dvh` viewport units, and how do they resolve the mobile address bar 100vh bug?",
    shortAnswer: "On mobile browsers, the address bar dynamically expands and collapses. `100vh` uses a static height that causes bottoms of modals/footers to be hidden under the URL bar. `svh` (Small Viewport Height) assumes the address bar is EXPANDED. `lvh` (Large Viewport Height) assumes it is COLLAPSED. `dvh` (Dynamic Viewport Height) dynamically recalculates as the address bar animates.",
    detailedExplanation: "For mobile full-height modals or hero banners, `min-height: 100dvh` ensures the element always fits the visible viewport perfectly.",
    codeExample: `/* Perfect mobile fullscreen modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  height: 100dvh; /* Adapts dynamically to browser chrome on mobile */
}`
  },
  {
    topic: "Modern CSS",
    subtopic: "CSS Subgrid",
    concept: "What is CSS Subgrid and what problem does it solve?",
    difficulty: "ADVANCED",
    questionType: "CONCEPTUAL",
    experienceLevel: "3_5_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Mozilla"],
    tags: ["modern-css", "subgrid", "grid"],
    question: "What is CSS Subgrid (`grid-template-columns: subgrid`), and what problem does it solve in card layouts?",
    shortAnswer: "Standard nested grids establish their own independent tracks, meaning cards with varying title or description lengths cannot align their internal headers and buttons with neighboring cards. Subgrid allows a nested grid item to inherit and participate directly in the row and column tracks of its parent grid.",
    detailedExplanation: "Setting `grid-template-rows: subgrid` on cards spanning multiple parent rows makes all card headers, bodies, and footers line up horizontally across the entire row.",
    codeExample: `/* Parent Grid */
.cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: auto 1fr auto; /* Row 1: Header, Row 2: Body, Row 3: Button */
  gap: 1.5rem;
}

/* Child Card adopts parent's row tracks! */
.card {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid; /* Aligns all headers & buttons across cards */
}`
  },
  {
    topic: "CSS Performance",
    subtopic: "Right-to-Left Selector Evaluation",
    concept: "Why do browsers evaluate CSS selectors from right to left?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Mozilla"],
    tags: ["performance", "selectors", "browser-internals", "key-selector"],
    question: "Why do browser rendering engines evaluate CSS selectors from right to left (RTL)?",
    shortAnswer: "Browsers evaluate from right to left starting with the 'Key Selector' (the rightmost part). This allows the engine to immediately filter out elements that don't match the key selector without having to traverse upwards through deep DOM ancestor trees. Starting from the left would require traversing millions of irrelevant DOM paths.",
    detailedExplanation: "For example, in `.sidebar ul li a`, the browser first checks if an element is an `<a>`. If not, it bails out immediately in O(1) time without inspecting parents. Overly generic key selectors like `.nav *` hurt performance because every element must be checked.",
    codeExample: `/* Key selector is 'span' (checks all <span> elements in the DOM) */
.user-profile .stats span {
  font-weight: bold;
}

/* Much faster key selector: targets a specific unique class */
.user-profile-stat-value {
  font-weight: bold;
}`
  },
  {
    topic: "CSS Architecture",
    subtopic: "Utility-First vs Component-Scoped CSS",
    concept: "Compare Utility-First CSS (Tailwind) with Component-Scoped CSS (CSS Modules / CSS-in-JS).",
    difficulty: "ADVANCED",
    questionType: "COMPARISON",
    experienceLevel: "3_5_YEARS",
    isHighFrequency: true,
    companyTags: ["Meta", "Vercel", "Shopify", "Airbnb"],
    tags: ["css-architecture", "tailwind", "css-modules", "css-in-js", "trade-offs"],
    question: "What are the architectural trade-offs between Utility-First CSS (e.g. Tailwind) and Component-Scoped CSS (e.g. CSS Modules)?",
    shortAnswer: "Utility-First (Tailwind) achieves minimal bundle size growth over time (CSS plateaus as utilities are reused), avoids naming fatigue, and prevents dead CSS. The trade-off is crowded HTML/JSX markup. Component-Scoped CSS (CSS Modules) cleanly separates markup from style logic and encapsulates styles locally with hashed classnames, but CSS bundle size grows linearly with every new component.",
    detailedExplanation: "In high-scale enterprise frontend apps, team conventions and design token enforcement dictate the choice: Tailwind enforces consistent design tokens via utility constraints, while CSS Modules allow complex custom CSS layouts and animations.",
    codeExample: `/* 1. Utility-First (Tailwind in JSX) */
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
  Submit
</button>

/* 2. Component-Scoped (CSS Modules) */
import styles from './Button.module.css';
<button className={styles.primaryButton}>Submit</button>`
  },
  {
    topic: "Accessibility",
    subtopic: "The Danger of outline: none on Focus",
    concept: "Why is outline: none without a replacement an accessibility failure?",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Google", "Microsoft", "Salesforce", "Government Audits"],
    tags: ["accessibility", "outline", "focus", "a11y", "wcag"],
    question: "Why does `:focus { outline: none; }` without an immediate visual replacement violate WCAG accessibility guidelines?",
    shortAnswer: "Removing the focus outline completely blinds keyboard-only users and switch-device users, making it impossible to see which interactive button, link, or form field is currently selected. WCAG 2.1 Success Criterion 2.4.7 (Focus Visible) strictly mandates that any keyboard operable element must have a visibly distinguishable focus indicator.",
    detailedExplanation: "Instead of stripping outlines globally, style `:focus-visible` with a custom ring (`outline: 2px solid <color>; outline-offset: 2px;`) so keyboard users see a distinct ring while mouse clickers aren't disturbed.",
    codeExample: `/* ❌ Severe Accessibility Violation: */
button:focus {
  outline: none; /* Never do this without a replacement! */
}

/* ✅ Accessible Best Practice: */
button:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 3px;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
}`
  }
];
