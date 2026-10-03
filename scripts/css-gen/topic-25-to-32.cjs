// Topics 25 to 32
module.exports = [
  // ==========================================
  // TOPIC 25: CSS Variables
  // ==========================================
  {
    topic: "CSS Variables",
    subtopic: "CSS Variables vs SASS Variables",
    concept: "How do CSS Custom Properties differ from preprocessor (SASS/SCSS) variables?",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Amazon", "Microsoft"],
    tags: ["css-variables", "custom-properties", "sass", "interview-favorite"],
    question: "What is the difference between CSS Custom Properties (`--var`) and preprocessor variables (like SASS `$var`)?",
    shortAnswer: "SASS variables are static, compiled away at build time, and have no presence in the browser runtime. CSS Custom Properties exist dynamically in the browser DOM/CSSOM, inherit through the cascade, can be updated at runtime via JavaScript, and respond to media/container queries.",
    detailedExplanation: "Because CSS variables live in the DOM tree, changing `--primary-color` on a parent element or via `document.documentElement.style.setProperty()` instantly updates all children without recompiling stylesheets.",
    codeExample: `/* Dynamic runtime scoping */
:root {
  --brand-color: #2563eb;
}

.theme-dark {
  --brand-color: #60a5fa; /* Seamless component theming */
}

/* Modifying via JavaScript */
document.documentElement.style.setProperty('--brand-color', '#10b981');`
  },
  {
    topic: "CSS Variables",
    subtopic: "var() and Fallback Values",
    concept: "How do fallback values work in var()?",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    experienceLevel: "FRESHER",
    isHighFrequency: false,
    companyTags: ["Shopify", "Paypal"],
    tags: ["css-variables", "var-fallbacks"],
    question: "How do fallback values work in the `var()` function, and can fallbacks be nested?",
    shortAnswer: "The second argument in `var(--property, fallback)` specifies a fallback value used if the custom property is undefined or invalid. Fallbacks can be nested: `var(--accent, var(--primary, #000))`.",
    detailedExplanation: "If an inherited custom property evaluates to an invalid value (e.g. `var(--color)` where `--color: 20px`), it does NOT fall back to earlier author rules; it resets to `unset` (or `inherit`).",
    codeExample: `/* Nested fallback: uses --accent, then --primary, then red */
.badge {
  background-color: var(--accent, var(--primary, #ef4444));
  padding: var(--padding, 0.5rem 1rem);
}`
  },

  // ==========================================
  // TOPIC 26: Functions
  // ==========================================
  {
    topic: "Functions",
    subtopic: "clamp() for Fluid Typography",
    concept: "How does CSS clamp() work and how is it used for fluid typography?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Stripe", "Apple"],
    tags: ["functions", "clamp", "fluid-typography", "responsive"],
    question: "Explain the syntax and purpose of `clamp(min, preferred, max)` and how it is used for fluid responsive typography.",
    shortAnswer: "`clamp(min, preferred, max)` clamps a value between an absolute minimum and maximum boundary, using the preferred value in between. For typography: `font-size: clamp(1.5rem, 2.5vw + 1rem, 3rem);` scales smoothly with the viewport without needing abrupt media query breakpoints.",
    detailedExplanation: "The formula ensures font sizes never shrink below readable levels on mobile (`1.5rem`) nor explode to unreadable proportions on ultra-wide desktop displays (`3rem`).",
    codeExample: `/* Fluid heading that scales smoothly across all devices */
h1 {
  font-size: clamp(2rem, 5vw + 1rem, 4.5rem);
  line-height: 1.1;
}`
  },
  {
    topic: "Functions",
    subtopic: "calc(), min(), and max()",
    concept: "How do calc(), min(), and max() work in CSS?",
    difficulty: "EASY",
    questionType: "CODE",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Amazon", "Microsoft"],
    tags: ["functions", "calc", "min", "max"],
    question: "How do `calc()`, `min()`, and `max()` work, and what is a syntax gotcha with `calc()`?",
    shortAnswer: "`calc()` performs mathematical calculations combining different units (e.g. `100% - 40px`). `min(a, b)` picks the smallest value; `max(a, b)` picks the largest. Gotcha: In `calc()`, operators `+` and `-` MUST be surrounded by whitespace (`calc(100% - 20px)` works, `calc(100%-20px)` fails).",
    detailedExplanation: "Operators `*` and `/` do not strictly require spaces per specification, but best practice is to always put spaces around all operators.",
    codeExample: `/* calc gotcha */
.sidebar {
  /* ❌ Invalid syntax: fails to parse! */
  /* width: calc(100%-50px); */

  /* ✅ Valid: space around minus sign */
  width: calc(100% - 50px);
}

/* min() provides responsive ceiling */
.modal {
  width: min(90vw, 600px); /* 90% of screen on mobile, capped at 600px on desktop */
}`
  },

  // ==========================================
  // TOPIC 27: Layout
  // ==========================================
  {
    topic: "Layout",
    subtopic: "Modern Centering Techniques",
    concept: "What are the three most modern and reliable ways to center a div horizontally and vertically?",
    difficulty: "EASY",
    questionType: "SHORT CODE",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Google", "Amazon", "Meta", "Microsoft", "Uber"],
    tags: ["layout", "centering", "flexbox", "grid", "interview-must-know"],
    question: "What are the top three modern CSS methods to center an element horizontally and vertically?",
    shortAnswer: "1. CSS Grid: `display: grid; place-items: center;` (shortest, 2 lines on parent). 2. Flexbox: `display: flex; justify-content: center; align-items: center;`. 3. Flex + Auto Margin: `display: flex;` on parent, `margin: auto;` on child.",
    detailedExplanation: "The old absolute positioning technique (`top: 50%; left: 50%; transform: translate(-50%, -50%)`) is now only needed when the child element MUST be out of flow (e.g. modals, tooltips).",
    codeExample: `/* Method 1: Grid (cleanest) */
.center-grid {
  display: grid;
  place-items: center;
}

/* Method 2: Flexbox */
.center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Method 3: Flex + margin: auto */
.parent { display: flex; }
.child  { margin: auto; }`
  },

  // ==========================================
  // TOPIC 28: Float
  // ==========================================
  {
    topic: "Float",
    subtopic: "Clearfix & Modern Role of Float",
    concept: "What was the clearfix hack and what is the legitimate role of CSS float today?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Yahoo", "Adobe", "eBay"],
    tags: ["float", "clearfix", "legacy-css"],
    question: "What was the `clearfix` hack, why did parent containers collapse, and when should `float` be used today?",
    shortAnswer: "Floated elements are taken out of normal flow, causing their parent container to collapse to 0 height. The clearfix hack injected a `::after` pseudo-element with `content: ''; display: table; clear: both;` to force the parent to encompass the floats. Today, `float` should ONLY be used for its original typographic purpose: wrapping text around an image.",
    detailedExplanation: "Modern layouts use Flexbox or Grid. Float should never be used for multi-column grid layouts anymore.",
    codeExample: `/* Modern sole use case for float: Magazine text wrap */
.article-img {
  float: left;
  margin-right: 1.5rem;
  margin-bottom: 1rem;
}

/* Modern replacement for clearfix: */
.container {
  display: flow-root; /* Cleanly establishes a BFC containing floats */
}`
  },

  // ==========================================
  // TOPIC 29: Forms
  // ==========================================
  {
    topic: "Forms",
    subtopic: "accent-color and appearance: none",
    concept: "How do accent-color and appearance: none help with form styling?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Shopify"],
    tags: ["forms", "accent-color", "appearance", "inputs"],
    question: "What does `accent-color` do, and when do you use `appearance: none`?",
    shortAnswer: "`accent-color` changes the brand accent color of native browser form controls (checkboxes, radio buttons, range sliders, progress bars) with a single CSS line. `appearance: none` strips all default OS/browser chrome styling, allowing custom styling from scratch.",
    detailedExplanation: "Before `accent-color`, tinting a native checkbox required hiding the input and building a faux checkbox with `::before`/`::after` SVGs. `accent-color` automatically manages accessible contrast for checkmarks.",
    codeExample: `/* Rebranding all form inputs with 1 line */
:root {
  accent-color: #2563eb;
}

/* Custom styled search input */
input[type="search"] {
  appearance: none;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
}`
  },

  // ==========================================
  // TOPIC 30: Tables
  // ==========================================
  {
    topic: "Tables",
    subtopic: "table-layout: fixed vs auto",
    concept: "What is the difference between table-layout: fixed and table-layout: auto?",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: false,
    companyTags: ["Salesforce", "Oracle"],
    tags: ["tables", "table-layout", "performance"],
    question: "What is the difference between `table-layout: auto` and `table-layout: fixed` in terms of rendering speed and column sizing?",
    shortAnswer: "`table-layout: auto` (default) calculates column widths by analyzing ALL rows in the table, which is slow for large datasets. `table-layout: fixed` calculates column widths solely based on the first row's cells or explicit widths, rendering much faster and respecting exact widths.",
    detailedExplanation: "For tables with thousands of rows or when you need strict column widths and `text-overflow: ellipsis` on table cells, `table-layout: fixed; width: 100%;` is required.",
    codeExample: `/* Fast rendering table with strict column boundaries */
table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
}

td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}`
  },

  // ==========================================
  // TOPIC 31: Images
  // ==========================================
  {
    topic: "Images",
    subtopic: "object-fit and aspect-ratio",
    concept: "How do object-fit and aspect-ratio prevent layout shifts (CLS)?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Netflix", "Amazon"],
    tags: ["images", "object-fit", "aspect-ratio", "cls", "cwv"],
    question: "How do `aspect-ratio` and `object-fit: cover` work together to prevent Cumulative Layout Shift (CLS)?",
    shortAnswer: "`aspect-ratio` reserves the physical dimensions of the image container before the image asset downloads over the network, completely preventing layout shifts (CLS). `object-fit: cover` ensures the downloaded image fills that container proportionally without distortion.",
    detailedExplanation: "Prior to `aspect-ratio`, developers relied on the awkward 'padding-top percentage hack'. Modern CSS makes this native: `aspect-ratio: 16 / 9; width: 100%;`.",
    codeExample: `/* Perfect modern responsive card image */
.card-img {
  width: 100%;
  aspect-ratio: 16 / 9; /* Reserves space immediately: 0 CLS */
  object-fit: cover;    /* Prevents stretching or squishing */
  object-position: center;
  display: block;
}`
  },

  // ==========================================
  // TOPIC 32: CSS Shapes and Clipping
  // ==========================================
  {
    topic: "CSS Shapes and Clipping",
    subtopic: "clip-path",
    concept: "What does clip-path do and how does it compare to border-radius?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: false,
    companyTags: ["Apple", "Adobe"],
    tags: ["clipping", "clip-path", "shapes"],
    question: "What is `clip-path` in CSS, and what shapes can it create?",
    shortAnswer: "`clip-path` creates a clipping region that determines which parts of an element are visible. Anything outside the path is clipped (invisible) and cannot receive pointer clicks. It supports `circle()`, `ellipse()`, `polygon()`, `inset()`, and SVG paths.",
    detailedExplanation: "Unlike `border-radius` which only rounds corners, `clip-path: polygon(...)` can create triangles, stars, chevron banners, and diagonal split sections.",
    codeExample: `/* Circle avatar */
.avatar {
  clip-path: circle(50% at 50% 50%);
}

/* Triangle shape */
.triangle {
  width: 100px;
  height: 100px;
  background: #2563eb;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}`
  },
  {
    topic: "Functions",
    subtopic: "color-mix() and OKLCH",
    concept: "How does color-mix() work and why is OKLCH preferred over sRGB?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Apple", "Shopify"],
    tags: ["functions", "color-mix", "oklch", "modern-css"],
    question: "What is `color-mix()` in modern CSS, and why is the OKLCH color space preferred for programmatic color manipulation?",
    shortAnswer: "`color-mix(in <colorspace>, color1 percentage, color2 percentage)` blends two colors natively in CSS without preprocessors. OKLCH is preferred because it is perceptually uniform: increasing lightness or mixing hues in OKLCH avoids the muddy grayish dead zones found in traditional sRGB/HSL blending.",
    detailedExplanation: "Creating hover tints or transparent tints with `color-mix(in srgb, var(--primary) 80%, white)` is now supported in all modern browsers.",
    codeExample: `/* Create a 20% transparent tint natively */
.button-tint {
  background: color-mix(in srgb, #2563eb 80%, transparent);
}

/* Mixing brand color with black for hover state */
.button:hover {
  background: color-mix(in oklch, var(--brand) 85%, black);
}`
  },
  {
    topic: "Forms",
    subtopic: "Floating Labels with :placeholder-shown",
    concept: "How do you build a pure CSS floating label using :placeholder-shown?",
    difficulty: "INTERMEDIATE",
    questionType: "SHORT CODE",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Stripe", "Material Design"],
    tags: ["forms", "floating-label", "placeholder-shown", "pseudo-classes"],
    question: "How do you implement a pure CSS floating label effect using `:placeholder-shown` without JavaScript?",
    shortAnswer: "Set an invisible placeholder on the input (`placeholder=' '`). Position the `<label>` over the input text area. Use `input:not(:placeholder-shown) + label` and `input:focus + label` to animate the label to a smaller font size above the input when text is entered or focus is gained.",
    detailedExplanation: "This pattern powers Material Design inputs natively in CSS.",
    codeExample: `/* Pure CSS Floating Label */
.input-group {
  position: relative;
}

.input-group input {
  padding: 1.25rem 0.75rem 0.5rem;
}

.input-group label {
  position: absolute;
  top: 1rem;
  left: 0.75rem;
  transition: all 0.2s ease;
  pointer-events: none;
}

/* Float label up when focused OR text is typed */
.input-group input:focus + label,
.input-group input:not(:placeholder-shown) + label {
  top: 0.25rem;
  font-size: 0.75rem;
  color: #2563eb;
}`
  },
  {
    topic: "Images",
    subtopic: "img Tag vs background-image",
    concept: "When should you use an img tag versus background-image?",
    difficulty: "EASY",
    questionType: "COMPARISON",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Google", "Amazon", "SEO Audits"],
    tags: ["images", "img-tag", "background-image", "seo", "accessibility"],
    question: "When should you use an HTML `<img>` tag versus a CSS `background-image`?",
    shortAnswer: "Use `<img>` for content-critical images (product photos, author avatars, diagrams) because it supports `alt` text for screen readers, is indexed by Google Images for SEO, supports `loading='lazy'`, and prints by default. Use `background-image` strictly for decorative patterns, visual gradients, or banners where absence of the image does not diminish comprehension.",
    detailedExplanation: "Screen readers skip CSS background images entirely. If an image conveys essential information, using `background-image` violates WCAG 1.1.1 (Non-text Content).",
    codeExample: `<!-- ✅ Semantic & Accessible for critical content -->
<img src="product.jpg" alt="Ergonomic mechanical keyboard" loading="lazy">

<!-- ✅ Decorative visual texture -->
<div class="hero-section" style="background-image: url('subtle-grid.svg');">
  <h1>Welcome</h1>
</div>`
  }
];
