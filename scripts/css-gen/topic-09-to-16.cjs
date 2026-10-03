// Topics 09 to 16
module.exports = [
  // ==========================================
  // TOPIC 09: Flexbox
  // ==========================================
  {
    topic: "Flexbox",
    subtopic: "Main Axis vs Cross Axis & Flex Direction",
    concept: "What are the main axis and cross axis in Flexbox?",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Google", "Amazon", "Meta", "Microsoft"],
    tags: ["flexbox", "main-axis", "cross-axis", "flex-direction"],
    question: "What are the main axis and cross axis in Flexbox, and how does `flex-direction` control them?",
    shortAnswer: "The main axis is the primary direction along which flex items are laid out, defined by `flex-direction` (row = horizontal, column = vertical). The cross axis runs perpendicular to the main axis. `justify-content` always aligns along the main axis; `align-items` aligns along the cross axis.",
    detailedExplanation: "When `flex-direction: column`, the main axis becomes vertical (so `justify-content` controls vertical alignment) and the cross axis becomes horizontal (so `align-items` controls horizontal alignment).",
    codeExample: `/* Horizontal flow: main axis is X, cross axis is Y */
.row-container {
  display: flex;
  flex-direction: row;
  justify-content: center; /* Centers horizontally */
  align-items: center;     /* Centers vertically */
}

/* Vertical flow: main axis is Y, cross axis is X */
.col-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Spaces vertically */
  align-items: stretch;           /* Stretches horizontally */
}`
  },
  {
    topic: "Flexbox",
    subtopic: "justify-content, align-items, and align-content",
    concept: "What is the difference between align-items and align-content in Flexbox?",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Uber", "Apple"],
    tags: ["flexbox", "align-items", "align-content"],
    question: "What is the difference between `align-items` and `align-content` in Flexbox?",
    shortAnswer: "`align-items` aligns individual flex items within their respective flex line along the cross axis (works on single-line and multi-line). `align-content` aligns the flex lines themselves when there is extra space on the cross axis, and ONLY takes effect when `flex-wrap: wrap` causes multiple lines.",
    detailedExplanation: "If your flex container only has a single row (`flex-wrap: nowrap`), `align-content` has zero visual effect.",
    codeExample: `/* Multi-line flex container */
.multi-line {
  display: flex;
  flex-wrap: wrap;
  height: 400px;
  align-items: center;   /* Centers items within their line */
  align-content: center; /* Packs all lines together in the center */
}`
  },
  {
    topic: "Flexbox",
    subtopic: "flex-grow, flex-shrink, and flex-basis",
    concept: "How does the flex shorthand (flex-grow, flex-shrink, flex-basis) calculate sizing?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Meta", "Amazon", "Microsoft", "Stripe"],
    tags: ["flexbox", "flex-grow", "flex-shrink", "flex-basis"],
    question: "Explain how `flex-grow`, `flex-shrink`, and `flex-basis` work together in the `flex` shorthand.",
    shortAnswer: "`flex-basis` sets the initial main-size of an item before remaining space is distributed. `flex-grow` determines the proportion of positive remaining space the item absorbs. `flex-shrink` determines the proportion of negative overflow space the item surrenders when space is tight.",
    detailedExplanation: "`flex: 1` expands to `flex: 1 1 0%` (absorbs available space aggressively). `flex: auto` expands to `flex: 1 1 auto` (sizes based on content first, then grows). `flex: initial` expands to `flex: 0 1 auto`.",
    codeExample: `/* Equal-width 3-column layout regardless of content length */
.col {
  flex: 1 1 0; /* flex-grow: 1, flex-shrink: 1, flex-basis: 0 */
}

/* Sidebar fixed at 250px, main content fills remaining space */
.sidebar {
  flex: 0 0 250px; /* Cannot grow, cannot shrink */
}
.main {
  flex: 1 1 0;     /* Fills all leftover width */
}`
  },
  {
    topic: "Flexbox",
    subtopic: "Flexbox Gotchas (min-width: auto & text-overflow)",
    concept: "Why does text-overflow: ellipsis fail inside a flex item and how is it fixed?",
    difficulty: "INTERMEDIATE",
    questionType: "DEBUGGING",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "LinkedIn"],
    tags: ["flexbox", "debugging", "text-overflow", "min-width"],
    question: "Why does `text-overflow: ellipsis` fail to work inside a flex child by default, and how do you fix it?",
    shortAnswer: "Flex items have an initial default of `min-width: auto` (instead of 0). This prevents flex items from shrinking smaller than their inner content. To fix it and allow text truncation, set `min-width: 0` on the flex item.",
    detailedExplanation: "This is one of the most common real-world frontend debugging bugs. Without `min-width: 0`, the flex item refuses to shrink and overflows its parent container.",
    codeExample: `/* Buggy flex item */
.flex-item {
  flex: 1;
  /* min-width defaults to auto! */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* Does NOT truncate without min-width: 0! */
}

/* Fixed flex item */
.flex-item {
  flex: 1;
  min-width: 0; /* CRITICAL FIX: allows item to shrink below content size */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}`
  },

  // ==========================================
  // TOPIC 10: CSS Grid
  // ==========================================
  {
    topic: "CSS Grid",
    subtopic: "Grid vs Flexbox",
    concept: "When should you use CSS Grid versus Flexbox?",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Amazon", "Meta", "Apple"],
    tags: ["grid", "flexbox", "layout-comparison", "interview-favorite"],
    question: "What is the primary difference between CSS Grid and Flexbox, and when should you choose one over the other?",
    shortAnswer: "Flexbox is 1-dimensional (arranges items along either a row OR a column). CSS Grid is 2-dimensional (arranges items simultaneously across rows AND columns). Use Flexbox for component-level linear layouts (navbars, button groups); use Grid for page-level structural layouts and 2D cards/matrices.",
    detailedExplanation: "Flexbox layout is content-out (items define their size and flex). Grid layout is container-in (container defines tracks and items slot into cells).",
    codeExample: `/* 1D Flexbox for navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 2D Grid for page layout */
.dashboard {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 60px 1fr 40px;
  gap: 1.5rem;
}`
  },
  {
    topic: "CSS Grid",
    subtopic: "auto-fit vs auto-fill",
    concept: "What is the difference between auto-fit and auto-fill in CSS Grid?",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Amazon", "Uber", "Spotify"],
    tags: ["grid", "auto-fit", "auto-fill", "responsive"],
    question: "What is the difference between `repeat(auto-fill, minmax(...))` and `repeat(auto-fit, minmax(...))` in responsive grids?",
    shortAnswer: "`auto-fill` creates as many column tracks as can physically fit in the container, even if some tracks remain empty. `auto-fit` collapses any empty tracks to 0px, expanding the filled items to stretch across the full width of the container.",
    detailedExplanation: "For responsive card layouts where you want cards to expand and fill the entire row when there are only 1 or 2 items, `auto-fit` is virtually always the desired behavior.",
    codeExample: `/* Responsive card grid with no media queries needed! */
.card-grid {
  display: grid;
  /* Auto-fits items, collapsing empty tracks and stretching items */
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}`
  },
  {
    topic: "CSS Grid",
    subtopic: "Grid Areas and Template",
    concept: "How do grid-template-areas work and how are empty cells defined?",
    difficulty: "EASY",
    questionType: "CODE",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Microsoft", "Adobe"],
    tags: ["grid", "grid-template-areas"],
    question: "How do `grid-template-areas` work, and how do you leave an empty cell?",
    shortAnswer: "`grid-template-areas` provides an ASCII-art visual map of the layout in CSS strings. Items assign themselves to areas using `grid-area: <name>`. A period (`.`) or series of periods denotes an empty, unoccupied cell.",
    detailedExplanation: "Every row must have the exact same number of cell columns, and named areas must form contiguous rectangles (L-shapes or irregular shapes are invalid).",
    codeExample: `/* ASCII-art grid definition */
.layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "sidebar content"
    "footer  ."; /* '.' is an empty cell */
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer  { grid-area: footer; }`
  },
  {
    topic: "CSS Grid",
    subtopic: "The 'fr' Unit & minmax()",
    concept: "What is the fr unit in CSS Grid and how does it prevent overflow?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta"],
    tags: ["grid", "fr-unit", "minmax"],
    question: "What is the `fr` unit in CSS Grid, and why is `minmax(0, 1fr)` often used instead of plain `1fr`?",
    shortAnswer: "The `fr` (fractional) unit represents a fraction of the leftover free space in the grid container. By default, `1fr` is shorthand for `minmax(auto, 1fr)`, meaning large content can prevent the track from shrinking. Using `minmax(0, 1fr)` allows the track to shrink below content size.",
    detailedExplanation: "Just like `min-width: 0` in Flexbox, `minmax(0, 1fr)` prevents wide tables, images, or preformatted code blocks from blowing out the grid track width.",
    codeExample: `/* Safe grid tracks that won't overflow with wide content */
.container {
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  gap: 20px;
}`
  },

  // ==========================================
  // TOPIC 11: Units
  // ==========================================
  {
    topic: "Units",
    subtopic: "px vs em vs rem",
    concept: "What is the difference between px, em, and rem?",
    difficulty: "EASY",
    questionType: "COMPARISON",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Google", "Amazon", "Meta", "Microsoft"],
    tags: ["units", "px", "em", "rem", "interview-must-know"],
    question: "What is the difference between `px`, `em`, and `rem`, and why is `rem` preferred for accessible typography?",
    shortAnswer: "`px` is an absolute fixed physical unit that ignores user browser font settings. `em` is relative to its immediate parent element's font size (compounding when nested). `rem` is relative to the root (`<html>`) element's font size (consistent and non-compounding). `rem` respects browser zoom and user accessibility settings.",
    detailedExplanation: "If a visually impaired user increases their browser font size from 16px to 24px, `px` values stay rigid (breaking accessibility), while `rem` values scale proportionally across the entire interface.",
    codeExample: `/* If root font-size is 16px: */
html { font-size: 16px; }

/* 1.5rem = 16 * 1.5 = 24px everywhere */
h2 { font-size: 1.5rem; }

/* em compounds when nested: */
.parent { font-size: 1.5em; } /* 24px */
.parent .child { font-size: 1.5em; } /* 24 * 1.5 = 36px! (compounded) */`
  },
  {
    topic: "Units",
    subtopic: "Viewport Units (vw, vh, vmin, vmax)",
    concept: "How do viewport units (vw, vh, vmin, vmax) work?",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Apple", "Netflix"],
    tags: ["units", "viewport-units", "responsive"],
    question: "Explain `vw`, `vh`, `vmin`, and `vmax`.",
    shortAnswer: "`1vw` = 1% of viewport width; `1vh` = 1% of viewport height; `1vmin` = 1% of the smaller dimension (width or height); `1vmax` = 1% of the larger dimension. `vmin` is ideal for square hero elements on both mobile (portrait) and desktop (landscape).",
    detailedExplanation: "On mobile devices with collapsible address bars, traditional `100vh` causes content jumping. Modern CSS introduced `dvh` (dynamic), `svh` (small), and `lvh` (large) viewport units to solve this.",
    codeExample: `/* Fullscreen hero section */
.hero {
  min-height: 100vh; /* Or 100dvh in modern CSS */
  width: 100vw;
}

/* Square box that fits comfortably on both mobile & desktop */
.responsive-square {
  width: 50vmin;
  height: 50vmin;
}`
  },
  {
    topic: "Units",
    subtopic: "The 'ch' Unit",
    concept: "What is the ch unit and when should it be used?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: false,
    companyTags: ["Medium", "Substack", "New York Times"],
    tags: ["units", "ch-unit", "typography"],
    question: "What does the `ch` unit represent, and why is it useful for typography?",
    shortAnswer: "`1ch` represents the width of the character `0` (zero) in the element's current font. It is the gold standard for setting optimal editorial line lengths (measure), typically constraining paragraphs to 60–75ch for comfortable reading.",
    detailedExplanation: "WCAG accessibility guidelines recommend line lengths not exceeding 80 characters for optimal cognitive legibility.",
    codeExample: `/* Optimal typographic reading measure */
article p {
  max-width: 65ch; /* Never spans wider than ~65 characters */
  line-height: 1.6;
}`
  },

  // ==========================================
  // TOPIC 12: Colors
  // ==========================================
  {
    topic: "Colors",
    subtopic: "Hex, RGB, HSL, and Alpha",
    concept: "Compare Hex, RGB, and HSL color formats in CSS.",
    difficulty: "EASY",
    questionType: "COMPARISON",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Google", "Adobe"],
    tags: ["colors", "hex", "rgb", "hsl"],
    question: "Compare Hexadecimal, RGB/RGBA, and HSL/HSLA color formats. Why is HSL considered more intuitive?",
    shortAnswer: "Hex (`#RRGGBB`) is compact machine notation. RGB (`rgb(r, g, b)`) defines red, green, and blue light intensity (0–255). HSL (`hsl(hue, saturation, lightness)`) models human color perception. HSL is more intuitive because you can easily adjust lightness/saturation (e.g. for hover states) without recalculating primary color channels.",
    detailedExplanation: "In HSL, Hue is an angle on the color wheel (0=red, 120=green, 240=blue), Saturation is vividness (0% gray to 100% full color), and Lightness is brightness (0% black, 50% normal, 100% white).",
    codeExample: `/* Primary color in HSL */
:root {
  --primary-h: 220;
  --primary-s: 90%;
  --primary-l: 50%;
  --primary: hsl(var(--primary-h), var(--primary-s), var(--primary-l));
}

/* Trivial hover state: just decrease lightness! */
.button:hover {
  background: hsl(var(--primary-h), var(--primary-s), 40%);
}`
  },
  {
    topic: "Colors",
    subtopic: "Opacity vs Alpha Channel (RGBA / HSLA)",
    concept: "What is the difference between opacity: 0.5 and rgba(..., 0.5)?",
    difficulty: "EASY",
    questionType: "COMPARISON",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Amazon", "Uber", "Flipkart"],
    tags: ["colors", "opacity", "rgba", "interview-must-know"],
    question: "What is the difference between setting `opacity: 0.5` and using `rgba(...)` or `hsla(...)` with 0.5 alpha?",
    shortAnswer: "`opacity: 0.5` makes the element AND ALL OF ITS CHILDREN semi-transparent. Using `rgba()` or `hsla()` on `background-color` makes ONLY the background semi-transparent, leaving text and nested child elements 100% opaque.",
    detailedExplanation: "A classic beginner bug is setting `opacity: 0.8` on a card and trying to override the child with `opacity: 1` (impossible because opacity compounds down the subtree).",
    codeExample: `/* ❌ Opacity fades background AND text/children */
.bad-overlay {
  background-color: #000;
  opacity: 0.7; /* Text inside is also washed out! */
}

/* ✅ Alpha channel fades ONLY the background color */
.good-overlay {
  background-color: rgba(0, 0, 0, 0.7); /* Text inside stays crisp white */
  color: #fff;
}`
  },

  // ==========================================
  // TOPIC 13: Backgrounds
  // ==========================================
  {
    topic: "Backgrounds",
    subtopic: "background-size: cover vs contain",
    concept: "What is the difference between background-size: cover and contain?",
    difficulty: "EASY",
    questionType: "COMPARISON",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Amazon", "Meta", "Airbnb"],
    tags: ["backgrounds", "cover", "contain", "background-size"],
    question: "Explain the difference between `background-size: cover` and `background-size: contain`.",
    shortAnswer: "`cover` scales the background image to completely cover the container, cropping parts of the image if aspect ratios differ. `contain` scales the image to fit entirely inside the container without cropping, leaving empty letterboxing space if aspect ratios differ.",
    detailedExplanation: "For full-bleed hero banners, `background-size: cover; background-position: center;` is standard. For displaying product logos or icons without clipping, `contain` is preferred.",
    codeExample: `/* Fullscreen hero image with no empty space */
.hero-banner {
  background-image: url('hero.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover; /* Crops edges to fill container */
}

/* Product logo always fully visible */
.logo-container {
  background-image: url('logo.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain; /* Never cropped */
}`
  },
  {
    topic: "Backgrounds",
    subtopic: "Multiple Backgrounds",
    concept: "How do multiple background images layer in CSS?",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: false,
    companyTags: ["Adobe", "Apple"],
    tags: ["backgrounds", "multiple-backgrounds"],
    question: "How do multiple backgrounds work in CSS, and which background image appears on top?",
    shortAnswer: "Multiple backgrounds are comma-separated in `background-image`. The FIRST background listed in the comma-separated list renders on the TOP-most layer; subsequent backgrounds layer beneath it, with `background-color` rendering at the very bottom.",
    detailedExplanation: "This is widely used to place a semi-transparent gradient overlay directly on top of a background photograph.",
    codeExample: `/* Gradient overlay on top of photo */
.hero {
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), /* TOP layer */
    url('scenery.jpg');                                        /* BOTTOM layer */
  background-size: cover;
  background-position: center;
}`
  },

  // ==========================================
  // TOPIC 14: Borders
  // ==========================================
  {
    topic: "Borders",
    subtopic: "Outline vs Border",
    concept: "What is the difference between outline and border?",
    difficulty: "EASY",
    questionType: "COMPARISON",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Google", "Microsoft", "Salesforce"],
    tags: ["borders", "outline", "box-model", "accessibility"],
    question: "What is the difference between `outline` and `border` in CSS?",
    shortAnswer: "1. `border` occupies space in the CSS box model and triggers layout reflow when toggled. `outline` is drawn outside the element, occupies NO layout space, and triggers only repaint. 2. `outline` cannot have individual per-side widths/colors. 3. `outline` supports `outline-offset`.",
    detailedExplanation: "Crucial accessibility rule: Never set `outline: none` on interactive elements without providing an equally visible custom `:focus-visible` ring.",
    codeExample: `/* Accessible focus ring using outline-offset */
button:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 4px; /* Leaves clean gap between button and ring */
}`
  },

  // ==========================================
  // TOPIC 15: Typography
  // ==========================================
  {
    topic: "Typography",
    subtopic: "text-overflow: ellipsis",
    concept: "What CSS properties are required to truncate single-line text with an ellipsis?",
    difficulty: "EASY",
    questionType: "CODE",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Google", "Amazon", "Meta", "LinkedIn"],
    tags: ["typography", "text-overflow", "ellipsis", "interview-must-know"],
    question: "What three CSS properties are required to achieve single-line text truncation with an ellipsis (`...`)?",
    shortAnswer: "1. `white-space: nowrap;` (prevents text wrapping to the next line), 2. `overflow: hidden;` (clips overflowing content), 3. `text-overflow: ellipsis;` (renders the `...` symbol at the clip boundary).",
    detailedExplanation: "If any of these three properties is missing (or if the container does not have a bounded or constrained width), the ellipsis will fail to render.",
    codeExample: `/* Single-line text truncation utility */
.truncate-text {
  width: 100%;
  max-width: 250px;
  white-space: nowrap;   /* 1. Prevent wrap */
  overflow: hidden;       /* 2. Clip excess */
  text-overflow: ellipsis;/* 3. Render '...' */
}`
  },
  {
    topic: "Typography",
    subtopic: "word-break vs overflow-wrap (word-wrap)",
    concept: "What is the difference between word-break and overflow-wrap?",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Amazon", "Uber", "Apple"],
    tags: ["typography", "word-break", "overflow-wrap"],
    question: "What is the difference between `overflow-wrap: break-word` and `word-break: break-all`?",
    shortAnswer: "`overflow-wrap: break-word` only breaks an unbreakable word (like a long URL) if it would otherwise overflow its container; normal words wrap cleanly at whitespace. `word-break: break-all` aggressively breaks ANY word at the exact boundary edge, even standard English words.",
    detailedExplanation: "`overflow-wrap: break-word` preserves typographic beauty and readability. `word-break: break-all` disrupts standard sentence hyphenation and should generally be avoided for normal prose.",
    codeExample: `/* Recommended for user comments & chat messages: */
.chat-bubble {
  overflow-wrap: break-word; /* Breaks giant URLs without breaking regular words */
}`
  },
  {
    topic: "Typography",
    subtopic: "web fonts & font-display",
    concept: "What does font-display: swap do and why is it important for Core Web Vitals?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Shopify"],
    tags: ["typography", "font-display", "web-fonts", "performance", "cwv"],
    question: "What does `font-display: swap` do, and how does it prevent Flash of Invisible Text (FOIT)?",
    shortAnswer: "`font-display: swap` instructs the browser to immediately render text using a fallback system font while the custom web font is downloading, and then swap in the custom font once loaded. This prevents FOIT (blank text) and improves First Contentful Paint (FCP).",
    detailedExplanation: "The trade-off is Flash of Unstyled Text (FOUT) and potential Cumulative Layout Shift (CLS) if fallback font dimensions are not matched using modern font metrics (`size-adjust`).",
    codeExample: `@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap; /* Immediate fallback display -> swap on load */
}`
  },

  // ==========================================
  // TOPIC 16: Overflow
  // ==========================================
  {
    topic: "Overflow",
    subtopic: "overflow: hidden, auto, scroll, and clip",
    concept: "Compare overflow: hidden, scroll, auto, and clip.",
    difficulty: "EASY",
    questionType: "COMPARISON",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Google", "Microsoft"],
    tags: ["overflow", "scroll", "auto", "clip"],
    question: "Explain the differences between `overflow: visible`, `hidden`, `scroll`, `auto`, and `clip`.",
    shortAnswer: "`visible`: Content bleeds outside container. `hidden`: Clips excess content and disables programmatic user scrolling, but creates a scroll container. `scroll`: Always renders scrollbars regardless of whether content overflows. `auto`: Renders scrollbars ONLY when content exceeds bounds. `clip`: Clips content without creating a scroll container.",
    detailedExplanation: "`overflow: clip` is a modern addition that prevents programmatic scrolling entirely and works with `overflow-clip-margin`.",
    codeExample: `/* Responsive scrolling container */
.table-wrapper {
  overflow-x: auto; /* Horizontal scrollbar appears only if table is wide */
  overflow-y: hidden;
  max-width: 100%;
}`
  },
  {
    topic: "Flexbox",
    subtopic: "order Property & Accessibility",
    concept: "How does the Flexbox order property work and what accessibility issue does it introduce?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Microsoft", "Accessibility Audits"],
    tags: ["flexbox", "order", "accessibility", "a11y"],
    question: "How does the Flexbox `order` property work, and why does changing visual order create an accessibility hazard?",
    shortAnswer: "The `order` property takes an integer (default 0) to rearrange the visual sequence of flex items without touching the HTML source. Accessibility hazard: It disconnects the visual presentation from the underlying DOM tree, causing keyboard tab navigation and screen readers to follow the original HTML source, confusing keyboard users.",
    detailedExplanation: "WCAG 2.1 Success Criterion 1.3.2 requires meaningful reading and focus sequence. If a visual layout reorders elements, the DOM source should match.",
    codeExample: `/* Visual reordering */
.item-last-in-html {
  order: -1; /* Appears first visually, but tab focus hits it last! */
}`
  },
  {
    topic: "CSS Grid",
    subtopic: "Implicit vs Explicit Grid & grid-auto-flow",
    concept: "What is the difference between an explicit grid and an implicit grid?",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Amazon"],
    tags: ["grid", "explicit-grid", "implicit-grid", "grid-auto-flow"],
    question: "What is the difference between an explicit grid and an implicit grid, and how does `grid-auto-flow: dense` pack empty gaps?",
    shortAnswer: "The explicit grid consists of the rows and columns explicitly defined by `grid-template-rows` and `grid-template-columns`. The implicit grid is created automatically by the browser when items are placed outside the explicit bounds, styled via `grid-auto-rows` and `grid-auto-columns`. `grid-auto-flow: dense` backfills empty holes in the grid with later smaller items.",
    detailedExplanation: "`dense` packing prevents awkward visual holes when larger spanning items cannot fit sequentially on a row.",
    codeExample: `/* Dense packing grid */
.gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 200px;
  grid-auto-flow: dense; /* Backfills gaps left by spanning items */
}`
  },
  {
    topic: "Borders",
    subtopic: "Pure CSS Triangles",
    concept: "How are pure CSS triangles created using borders?",
    difficulty: "EASY",
    questionType: "SHORT CODE",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Amazon", "Uber", "Flipkart"],
    tags: ["borders", "css-triangles", "pseudo-elements"],
    question: "How do you construct a pure CSS triangle using borders on an element with zero width and height?",
    shortAnswer: "Set `width: 0; height: 0;`. Set three borders to `transparent` and the opposite border to a solid color. For a triangle pointing up: set `border-bottom: 20px solid blue;` and `border-left: 10px solid transparent; border-right: 10px solid transparent;`.",
    detailedExplanation: "Because opposing border edges meet at 45-degree mitered angles, collapsing element width and height to 0 leaves only the angled border wedges.",
    codeExample: `/* Upward pointing CSS triangle (tooltip arrow) */
.triangle-up {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 15px solid #2563eb;
}`
  }
];
