// Topics 01 to 08
module.exports = [
  // ==========================================
  // TOPIC 01: CSS Basics
  // ==========================================
  {
    topic: "CSS Basics",
    subtopic: "What is CSS & CSS Syntax",
    concept: "What is CSS and what is the anatomy of a CSS rule set?",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Amazon", "TCS", "Infosys"],
    tags: ["css-basics", "syntax", "ruleset"],
    question: "What is CSS, and what are the primary components of a CSS ruleset?",
    shortAnswer: "CSS (Cascading Style Sheets) is a stylesheet language used to describe the presentation and formatting of an HTML document. A CSS ruleset consists of a selector and a declaration block containing property-value pairs.",
    detailedExplanation: "A CSS ruleset targets one or more HTML elements using a selector. Inside the curly braces `{ ... }` is the declaration block, which contains one or more declarations separated by semicolons. Each declaration consists of a CSS property and its corresponding value separated by a colon.",
    codeExample: `/* Anatomy of a CSS ruleset */
/* Selector */
.button-primary {
  /* Property: Value; -> Declaration */
  background-color: #2563eb;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
}`
  },
  {
    topic: "CSS Basics",
    subtopic: "Methods of Applying CSS",
    concept: "What are the three ways to apply CSS to HTML and how do they differ?",
    difficulty: "EASY",
    questionType: "COMPARISON",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Google", "Microsoft", "Accenture"],
    tags: ["css-basics", "inline-css", "external-css", "internal-css"],
    question: "What are the three methods of applying CSS to an HTML document, and when should each be used?",
    shortAnswer: "1. External CSS (`<link rel='stylesheet'>`) - Best practice for separation of concerns and caching. 2. Internal CSS (`<style>` in `<head>`) - Useful for single-page templates or critical CSS. 3. Inline CSS (`style` attribute) - Highest specificity, used for dynamic JS overrides or email HTML.",
    detailedExplanation: "External stylesheets are cached by the browser across multiple pages, reducing page load time and improving maintainability. Internal CSS avoids extra network requests on initial page load (ideal for Above-The-Fold critical CSS). Inline styles bypass the stylesheet cascade and make code difficult to maintain.",
    codeExample: `<!-- 1. External CSS (Recommended) -->
<link rel="stylesheet" href="styles.css">

<!-- 2. Internal CSS -->
<style>
  h1 { color: #1e293b; }
</style>

<!-- 3. Inline CSS -->
<p style="color: red; font-weight: bold;">Alert text</p>`
  },
  {
    topic: "CSS Basics",
    subtopic: "Browser CSS Handling",
    concept: "How does the browser parse and render CSS (CSSOM)?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Uber"],
    tags: ["css-basics", "cssom", "critical-rendering-path", "rendering"],
    question: "How does a browser process CSS during the Critical Rendering Path, and what is the CSSOM?",
    shortAnswer: "The browser downloads CSS and parses it into the CSS Object Model (CSSOM), a tree-like representation of styles. The CSSOM is combined with the DOM tree to construct the Render Tree, which is then used for layout and painting.",
    detailedExplanation: "CSS is render-blocking: the browser halts rendering until the CSSOM is fully built to prevent a Flash of Unstyled Content (FOUC). The browser evaluates selectors from right-to-left (key selector first) to determine element matching efficiently.",
    codeExample: `/* Critical Rendering Path:
   HTML -> DOM Tree  \\
                      --> Render Tree -> Layout (Reflow) -> Paint -> Composite
   CSS  -> CSSOM Tree /
*/

/* Selector evaluated right-to-left: matches all .link items first, then checks parents */
nav.main-menu ul li a.link {
  color: #3b82f6;
}`
  },
  {
    topic: "CSS Basics",
    subtopic: "CSS Comments and Reset vs Normalize",
    concept: "What is the difference between a CSS Reset and CSS Normalize?",
    difficulty: "EASY",
    questionType: "COMPARISON",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Amazon", "Flipkart"],
    tags: ["css-basics", "reset-css", "normalize-css"],
    question: "What is the difference between a CSS Reset (e.g. Eric Meyer's reset) and Normalize.css?",
    shortAnswer: "A CSS Reset aggressively strips away all browser default styles (setting margins, paddings, and font sizes to 0). Normalize.css preserves useful browser defaults (like headings and lists) while correcting cross-browser inconsistencies and bugs.",
    detailedExplanation: "Modern developers often prefer modern resets (like Andy Bell or Josh Comeau's reset) which set `box-sizing: border-box`, remove default margins on `body`, and improve media defaults without stripping away semantic styling entirely.",
    codeExample: `/* Modern CSS Reset snippet */
*, *::before, *::after {
  box-sizing: border-box;
}

body, h1, h2, h3, p, figure {
  margin: 0;
}

img, picture {
  max-width: 100%;
  display: block;
}`
  },

  // ==========================================
  // TOPIC 02: Selectors
  // ==========================================
  {
    topic: "Selectors",
    subtopic: "Combinators",
    concept: "What is the difference between descendant (space) and direct child (>) selectors?",
    difficulty: "EASY",
    questionType: "COMPARISON",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Amazon", "Microsoft", "Paytm"],
    tags: ["selectors", "combinators", "child-selector"],
    question: "What is the difference between the descendant selector (`A B`) and the direct child selector (`A > B`)?",
    shortAnswer: "The descendant selector (`A B`) matches all `B` elements nested anywhere inside `A` (children, grandchildren, etc.). The direct child selector (`A > B`) matches only immediate first-level children of `A`.",
    detailedExplanation: "Using child combinators (`>`) makes styles more predictable and avoids unintended style leakage into deeply nested child components. It also slightly improves selector matching performance.",
    codeExample: `/* Matches EVERY paragraph inside .card, regardless of nesting depth */
.card p {
  color: #64748b;
}

/* Matches ONLY paragraphs that are direct children of .card */
.card > p {
  font-size: 1.125rem;
}`
  },
  {
    topic: "Selectors",
    subtopic: "Sibling Selectors",
    concept: "What is the difference between adjacent sibling (+) and general sibling (~) selectors?",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Adobe"],
    tags: ["selectors", "sibling-selectors", "adjacent-sibling"],
    question: "Explain the difference between the adjacent sibling selector (`+`) and the general sibling selector (`~`).",
    shortAnswer: "The adjacent sibling selector (`A + B`) selects the single `B` element that immediately follows `A` on the same hierarchical level. The general sibling selector (`A ~ B`) selects all `B` elements that appear after `A` within the same parent.",
    detailedExplanation: "Adjacent sibling selectors are commonly used in typography for margin spacing between consecutive paragraphs or labeling custom checkboxes.",
    codeExample: `/* Adjacent: Only the first p immediately after h2 gets a top margin */
h2 + p {
  margin-top: 1rem;
}

/* General: All p elements that follow an h2 under the same parent */
h2 ~ p {
  line-height: 1.6;
}`
  },
  {
    topic: "Selectors",
    subtopic: "Attribute Selectors",
    concept: "How do attribute selectors work and what are their variations (^=, $=, *=)?",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Apple", "Netflix"],
    tags: ["selectors", "attribute-selectors"],
    question: "How do CSS attribute selectors work, and what do `^=`, `$=`, and `*=` mean?",
    shortAnswer: "`[attr]` checks existence; `[attr=\"val\"]` checks exact match; `[attr^=\"val\"]` matches values starting with `val`; `[attr$=\"val\"]` matches values ending with `val`; `[attr*=\"val\"]` matches values containing `val` anywhere.",
    detailedExplanation: "Attribute selectors are heavily used for styling form inputs without extra classes, styling external links, or targeting downloadable file types.",
    codeExample: `/* 1. Starts with "https" */
a[href^="https://"] {
  color: #2563eb;
}

/* 2. Ends with ".pdf" */
a[href$=".pdf"]::after {
  content: " (PDF)";
}

/* 3. Contains "login" anywhere in class attribute */
button[class*="login"] {
  cursor: pointer;
}`
  },
  {
    topic: "Selectors",
    subtopic: "Universal and Grouping Selectors",
    concept: "How do the universal selector (*) and grouping selector (,) work?",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    experienceLevel: "FRESHER",
    isHighFrequency: false,
    companyTags: ["Infosys", "Wipro"],
    tags: ["selectors", "universal-selector", "grouping"],
    question: "What is the purpose of the universal selector (`*`) and how does selector grouping with commas work?",
    shortAnswer: "The universal selector (`*`) targets all elements on the page with a specificity of (0,0,0). Grouping selectors with commas (`h1, h2, h3`) applies the same style declarations to multiple selectors simultaneously.",
    detailedExplanation: "In a grouped selector, if one selector is invalid in standard CSS, the entire rule block is invalidated (unless using modern `:is()` or `:where()`).",
    codeExample: `/* Universal selector: targets all elements */
* {
  margin: 0;
}

/* Grouping selector: applies styles to h1, h2, and h3 */
h1, h2, h3 {
  font-family: 'Inter', sans-serif;
  color: #0f172a;
}`
  },

  // ==========================================
  // TOPIC 03: Specificity
  // ==========================================
  {
    topic: "Specificity",
    subtopic: "Specificity Calculation",
    concept: "How is CSS specificity calculated and what is the specificity hierarchy?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Amazon", "Meta", "Microsoft"],
    tags: ["specificity", "cascade", "interview-favorite"],
    question: "How does the browser calculate CSS specificity, and what is the 4-part weight system?",
    shortAnswer: "Specificity is calculated as a 4-part tuple `(Inline, ID, Class/Attribute/Pseudo-class, Element/Pseudo-element)`: 1. Inline styles: (1,0,0,0). 2. IDs: (0,1,0,0). 3. Classes, attributes, pseudo-classes: (0,0,1,0). 4. Type elements, pseudo-elements: (0,0,0,1).",
    detailedExplanation: "Specificity is evaluated left-to-right. A single ID `(0,1,0,0)` beats any number of classes (e.g. 100 classes `(0,0,100,0)` cannot beat 1 ID in modern browsers). The universal selector `*` and combinators have (0,0,0,0) specificity.",
    codeExample: `/* (0, 0, 0, 1) - Element */
p { color: black; }

/* (0, 0, 1, 0) - Class */
.lead { color: blue; }

/* (0, 1, 1, 1) - 1 ID, 1 Class, 1 Element */
#header .nav li { color: green; }

<!-- Inline style: (1, 0, 0, 0) beats all above -->
<p style="color: purple;">Inline wins</p>`
  },
  {
    topic: "Specificity",
    subtopic: "!important and Specificity Conflicts",
    concept: "How does !important work and what are its risks?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Meta", "Amazon", "Salesforce"],
    tags: ["specificity", "important", "anti-patterns"],
    question: "What does `!important` do, how does it alter the cascade, and why should it be avoided in normal author styles?",
    shortAnswer: "`!important` overrides standard specificity and places the declaration into the highest-priority declaration group. It should be avoided because it breaks the natural cascade, making future overrides extremely difficult without adding even more `!important` rules.",
    detailedExplanation: "If two competing rules both have `!important`, normal specificity applies between them. The only valid use cases for `!important` are utility classes (like `.hidden { display: none !important; }`) or user accessibility overrides.",
    codeExample: `/* Standard class */
.text-red {
  color: red;
}

/* ID cannot override this !important class! */
#profile-card .text-red {
  color: blue; /* Fails: text remains red */
}

.text-red {
  color: red !important;
}`
  },
  {
    topic: "Specificity",
    subtopic: "Inheritance vs Specificity",
    concept: "Does inherited CSS carry specificity?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Apple"],
    tags: ["specificity", "inheritance"],
    question: "Does an inherited style rule carry specificity when competing against a directly targeted element selector?",
    shortAnswer: "No. Inherited styles have NO specificity (effectively less than 0). Any directly targeted selector (even a universal selector `*` or element selector `p`) will always beat an inherited property from a parent element.",
    detailedExplanation: "A common beginner mistake is wondering why `#container { color: blue; }` does not color an anchor tag inside it: browsers have default user-agent rules like `a { color: -webkit-link; }` that directly target `a`, beating the inherited `#container` color.",
    codeExample: `/* Parent has high specificity (0, 1, 0, 0) */
#main-content {
  color: blue;
}

/* Child has lowest direct specificity (0, 0, 0, 1) */
p {
  color: red; /* Direct selector wins over inherited style! */
}`
  },

  // ==========================================
  // TOPIC 04: Cascade and Inheritance
  // ==========================================
  {
    topic: "Cascade and Inheritance",
    subtopic: "Cascade Algorithm & Origins",
    concept: "What is the CSS Cascade and what are the cascade origins?",
    difficulty: "ADVANCED",
    questionType: "CONCEPTUAL",
    experienceLevel: "3_5_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Stripe"],
    tags: ["cascade", "origins", "user-agent"],
    question: "What is the CSS Cascade, and in what order does the browser resolve conflicting styles?",
    shortAnswer: "The Cascade resolves conflicts by evaluating declarations in this exact order: 1. Origin and Importance (Transition > UA !important > User !important > Author !important > Animation > Author normal > User normal > UA normal), 2. Scope / Context, 3. Specificity, 4. Order of Appearance (source order).",
    detailedExplanation: "When specificity is equal between competing author declarations, the declaration that appears last in the stylesheet source order wins. Origin defines where the style comes from: User Agent (browser defaults), User (user settings), or Author (developer).",
    codeExample: `/* Source order resolution when specificity is identical */
.alert {
  background-color: yellow; /* Ignored */
}

.alert {
  background-color: red; /* WINS: appears later in source */
}`
  },
  {
    topic: "Cascade and Inheritance",
    subtopic: "CSS Global Values",
    concept: "What do the global values inherit, initial, unset, and revert do?",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Microsoft", "Amazon", "Uber"],
    tags: ["cascade", "inherit", "initial", "unset", "revert"],
    question: "What is the difference between `inherit`, `initial`, `unset`, and `revert`?",
    shortAnswer: "`inherit`: forces the property to take the computed value from its parent. `initial`: resets the property to the official CSS specification default. `unset`: acts as `inherit` for inherited properties, and `initial` for non-inherited properties. `revert`: rolls back to the browser's User Agent default stylesheet.",
    detailedExplanation: "`initial` can surprise developers: for example, setting `display: initial` resets to `inline` (the spec default for `display`), not `block`. `revert` restores browser defaults (e.g. `display: revert` on a `<div>` restores `block`).",
    codeExample: `/* Global keyword examples */
.child {
  /* Takes parent's border */
  border: inherit;
  
  /* Resets color to CSS spec default (black), NOT browser default */
  color: initial;
  
  /* Resets font to user-agent default styling */
  all: revert;
}`
  },

  // ==========================================
  // TOPIC 05: Box Model
  // ==========================================
  {
    topic: "Box Model",
    subtopic: "Box-Sizing: content-box vs border-box",
    concept: "What is the CSS Box Model and how does box-sizing: border-box work?",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Google", "Amazon", "Meta", "Microsoft"],
    tags: ["box-model", "box-sizing", "border-box", "interview-must-know"],
    question: "Explain the CSS Box Model and contrast `box-sizing: content-box` with `box-sizing: border-box`.",
    shortAnswer: "The Box Model consists of Content, Padding, Border, and Margin. In `content-box` (browser default), `width` sets only the content area; padding and border add to the total element width. In `border-box`, `width` includes content, padding, and border, keeping sizing fixed and predictable.",
    detailedExplanation: "With `content-box`, `width: 200px; padding: 20px; border: 5px solid;` renders with a total rendered width of `200 + 40 + 10 = 250px`. With `border-box`, total width remains exactly `200px` (content shrinks to `150px`).",
    codeExample: `/* Industry Best Practice: Reset box-sizing everywhere */
*, *::before, *::after {
  box-sizing: border-box;
}

.box {
  width: 200px;
  padding: 20px;
  border: 5px solid #000;
  /* Total rendered width is 200px with border-box! */
}`
  },
  {
    topic: "Box Model",
    subtopic: "Margin Collapsing",
    concept: "What is margin collapsing and under what conditions does it occur?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Uber", "Apple"],
    tags: ["box-model", "margin-collapse", "gotcha"],
    question: "What is margin collapsing in CSS, and what are three scenarios where it occurs?",
    shortAnswer: "Margin collapsing occurs when the top and bottom margins of adjacent block boxes combine into a single margin equal to the largest margin. Scenarios: 1. Adjacent siblings, 2. Parent and first/last child with no border/padding between them, 3. Empty block elements with no height.",
    detailedExplanation: "Margin collapsing ONLY applies to vertical margins of block-level elements in normal flow. It does NOT occur on horizontal margins, flex items, grid items, floats, or elements with `display: flow-root`.",
    codeExample: `/* Sibling margin collapse:
   Total space between p1 and p2 is 30px (NOT 50px!) */
.p1 {
  margin-bottom: 30px;
}
.p2 {
  margin-top: 20px;
}

/* How to prevent parent-child collapse:
   1. Add padding/border to parent
   2. Use display: flow-root on parent (creates BFC) */
.parent {
  display: flow-root;
}`
  },
  {
    topic: "Box Model",
    subtopic: "min-width, max-width, min-height, max-height",
    concept: "How do min/max dimension constraints interact with width and height?",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    experienceLevel: "FRESHER",
    isHighFrequency: false,
    companyTags: ["Amazon", "Salesforce"],
    tags: ["box-model", "min-width", "max-width"],
    question: "How do `min-width` and `max-width` resolve when conflicting with an explicit `width`?",
    shortAnswer: "`min-width` always overrides `max-width`, and both `min-width` and `max-width` override `width`. If `width: 300px; max-width: 200px;`, the computed width is 200px. If `min-width: 400px; max-width: 200px;`, computed width is 400px.",
    detailedExplanation: "`max-width: 100%` on images is the cornerstone of responsive design, preventing oversized assets from breaking page containers while allowing them to shrink.",
    codeExample: `/* Responsive card container */
.container {
  width: 90%;
  max-width: 1200px; /* Won't grow past 1200px on ultra-wide screens */
  min-width: 320px;  /* Won't shrink below 320px on tiny screens */
  margin: 0 auto;
}`
  },

  // ==========================================
  // TOPIC 06: Display
  // ==========================================
  {
    topic: "Display",
    subtopic: "block vs inline vs inline-block",
    concept: "Compare display: block, inline, and inline-block.",
    difficulty: "EASY",
    questionType: "COMPARISON",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Amazon", "Google", "Microsoft"],
    tags: ["display", "block", "inline", "inline-block"],
    question: "What are the core differences between `display: block`, `display: inline`, and `display: inline-block`?",
    shortAnswer: "`block`: Starts on a new line, occupies 100% parent width, respects all width/height and vertical margins/paddings. `inline`: Flows within text, ignores width/height, respects only horizontal margins/padding. `inline-block`: Flows inline like text but respects explicit width, height, and all margins/paddings.",
    detailedExplanation: "Examples: `<div>`, `<p>`, `<h1>` default to `block`. `<span>`, `<a>`, `<strong>` default to `inline`. Buttons and inputs often behave as `inline-block`.",
    codeExample: `/* block: takes full row */
.block-element {
  display: block;
  width: 100%;
}

/* inline: ignores width & top/bottom margin */
.inline-element {
  display: inline;
  width: 100px; /* Ignored! */
  margin-top: 20px; /* Ignored! */
}

/* inline-block: sits next to others, respects dimensions */
.inline-block-btn {
  display: inline-block;
  width: 120px;
  height: 40px;
  margin: 10px;
}`
  },
  {
    topic: "Display",
    subtopic: "display: none vs visibility: hidden",
    concept: "What is the difference between display: none and visibility: hidden?",
    difficulty: "EASY",
    questionType: "COMPARISON",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Meta", "Google", "Amazon", "Netflix"],
    tags: ["display", "visibility", "interview-favorite", "dom"],
    question: "What is the difference between `display: none` and `visibility: hidden` in terms of DOM layout, event handling, and transitions?",
    shortAnswer: "`display: none` removes the element completely from layout geometry (no space allocated; triggers reflow). `visibility: hidden` hides the element visually but preserves its physical layout space (triggers repaint only). `visibility` can be transitioned; `display: none` cannot.",
    detailedExplanation: "Additionally, children of `visibility: hidden` can be made visible again with `visibility: visible`, whereas children of `display: none` cannot be displayed if their parent has `display: none`.",
    codeExample: `/* Completely removed from document flow */
.hidden-none {
  display: none; /* Space collapses */
}

/* Invisible but preserves physical space */
.hidden-visibility {
  visibility: hidden; /* Empty blank space remains */
}

/* Child override works with visibility! */
.hidden-visibility .show-child {
  visibility: visible;
}`
  },
  {
    topic: "Display",
    subtopic: "display: contents and display: flow-root",
    concept: "What do display: contents and display: flow-root do?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Stripe", "Shopify"],
    tags: ["display", "display-contents", "flow-root", "bfc"],
    question: "What are `display: contents` and `display: flow-root` used for?",
    shortAnswer: "`display: contents` makes the container itself vanish from the layout tree, exposing its direct children as if they were children of the grandparent (great for Flex/Grid wrappers). `display: flow-root` creates a new Block Formatting Context (BFC) without unintended side effects, containing floats and preventing margin collapse.",
    detailedExplanation: "Prior to `display: flow-root`, developers used hacky `overflow: hidden` or clearfix to contain internal floats. `flow-root` cleanly achieves this natively.",
    codeExample: `/* 1. display: contents - wrapper disappears from grid flow */
<div class="grid-container">
  <div class="wrapper" style="display: contents;">
    <div class="item1">1</div>
    <div class="item2">2</div>
  </div>
</div>

/* 2. display: flow-root - cleanly contains floats without overflow clips */
.float-container {
  display: flow-root;
}`
  },

  // ==========================================
  // TOPIC 07: Positioning
  // ==========================================
  {
    topic: "Positioning",
    subtopic: "CSS Position Values Overview",
    concept: "Compare static, relative, absolute, fixed, and sticky positioning.",
    difficulty: "EASY",
    questionType: "COMPARISON",
    experienceLevel: "FRESHER",
    isHighFrequency: true,
    companyTags: ["Google", "Amazon", "Microsoft", "Meta"],
    tags: ["positioning", "relative", "absolute", "fixed", "sticky"],
    question: "Explain the differences between `static`, `relative`, `absolute`, `fixed`, and `sticky` positioning.",
    shortAnswer: "`static`: Normal document flow (top/left have no effect). `relative`: In document flow, offset from its own normal position without affecting siblings. `absolute`: Removed from flow, positioned relative to closest non-static ancestor. `fixed`: Removed from flow, positioned relative to viewport. `sticky`: Toggles between relative and fixed based on scroll position.",
    detailedExplanation: "A positioned element is any element whose computed `position` is NOT `static`. Positioned elements unlock the `top`, `right`, `bottom`, `left`, and `z-index` properties.",
    codeExample: `/* Parent anchor for absolute child */
.parent {
  position: relative;
}

/* Child placed in top-right corner of parent */
.badge {
  position: absolute;
  top: 0;
  right: 0;
}

/* Fixed navbar staying pinned to viewport */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
}`
  },
  {
    topic: "Positioning",
    subtopic: "Position: sticky & Gotchas",
    concept: "How does position: sticky work and why does it sometimes fail?",
    difficulty: "INTERMEDIATE",
    questionType: "DEBUGGING",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Amazon", "Uber", "Flipkart"],
    tags: ["positioning", "sticky", "debugging"],
    question: "How does `position: sticky` work, and why does it frequently fail to stick?",
    shortAnswer: "`position: sticky` acts as `relative` until its threshold (e.g. `top: 0`) crosses the scrolling container boundary, at which point it sticks until its parent container ends. It fails if: 1. No threshold (`top`, `bottom`) is set. 2. Any ancestor has `overflow: hidden`, `auto`, or `scroll`. 3. Its parent height is equal to the sticky item's height.",
    detailedExplanation: "Sticky elements can only stick inside their direct parent container. Once the user scrolls past the bottom edge of the parent container, the sticky element is pushed off-screen along with the parent.",
    codeExample: `/* Working sticky header */
.sticky-header {
  position: sticky;
  top: 0; /* REQUIRED: sticky threshold */
  z-index: 10;
  background: white;
}

/* Common bug: parent has overflow: hidden */
.parent-container {
  /* overflow: hidden; -> THIS BREAKS STICKY ON ALL CHILDREN! */
}`
  },
  {
    topic: "Positioning",
    subtopic: "Containing Block Resolution",
    concept: "What establishes the containing block for an absolutely positioned element?",
    difficulty: "ADVANCED",
    questionType: "CONCEPTUAL",
    experienceLevel: "3_5_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Airbnb"],
    tags: ["positioning", "containing-block", "transforms"],
    question: "What determines the containing block of an element with `position: absolute`?",
    shortAnswer: "An `absolute` element's containing block is formed by the padding box of its nearest ancestor with a `position` other than `static`, OR an ancestor with `transform`, `perspective`, `filter`, or `contain: paint` set. If none exist, it falls back to the Initial Containing Block (viewport dimensions).",
    detailedExplanation: "Senior interview trap: Setting `transform: translate(0, 0)` on a static ancestor turns it into a containing block for descendant absolute/fixed elements.",
    codeExample: `/* Ancestor is NOT position: relative, BUT has transform */
.static-parent {
  transform: translate(0, 0); /* Acts as containing block! */
}

.child {
  position: absolute;
  top: 10px; /* Positions relative to .static-parent! */
}`
  },

  // ==========================================
  // TOPIC 08: z-index and Stacking
  // ==========================================
  {
    topic: "z-index and Stacking",
    subtopic: "Stacking Context Creation",
    concept: "What is a Stacking Context and what triggers its creation?",
    difficulty: "ADVANCED",
    questionType: "CONCEPTUAL",
    experienceLevel: "3_5_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Amazon", "Netflix"],
    tags: ["z-index", "stacking-context", "interview-must-know"],
    question: "What is a Stacking Context in CSS, and what CSS properties trigger the creation of a new stacking context?",
    shortAnswer: "A Stacking Context is a 3D conceptual layering of HTML elements along the z-axis. Triggers: 1. Root element `<html>`, 2. Positioned element (`relative`/`absolute`) with `z-index` other than `auto`, 3. `position: fixed` or `sticky`, 4. `opacity` less than 1, 5. `transform`, `filter`, `perspective`, or `clip-path` not `none`, 6. `isolation: isolate`.",
    detailedExplanation: "A child element inside a lower stacking context can NEVER appear in front of an element in a higher stacking context, no matter how high the child's `z-index` is set (e.g. `z-index: 999999` fails if parent stacking context is below).",
    codeExample: `/* Creates a self-contained stacking context */
.modal-layer {
  position: relative;
  z-index: 10;
}

/* Modern, clean way to create stacking context without positioning hacks */
.card {
  isolation: isolate; /* Safe stacking context boundary */
}`
  },
  {
    topic: "z-index and Stacking",
    subtopic: "Why z-index Fails & Debugging",
    concept: "Why does z-index sometimes not work as expected?",
    difficulty: "INTERMEDIATE",
    questionType: "DEBUGGING",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Amazon", "Uber", "Microsoft"],
    tags: ["z-index", "debugging", "gotchas"],
    question: "Why does setting `z-index: 9999` on an element sometimes fail to bring it above another element?",
    shortAnswer: "Common reasons: 1. The element has default `position: static` (`z-index` is ignored on static elements outside flex/grid). 2. The element's parent has formed a lower stacking context than the competing element. 3. Sibling source order overrides identical stacking levels.",
    detailedExplanation: "To fix stacking trap issues, inspect parent elements for `opacity`, `transform`, or `z-index`, or move the overlay to `document.body` (e.g. React Portals).",
    codeExample: `/* FIX 1: Ensure element is positioned */
.button {
  position: relative; /* Unlocks z-index */
  z-index: 2;
}

/* Trap: Parent A (z-index: 1) vs Parent B (z-index: 2) */
/* Child in Parent A with z-index: 99999 STILL renders behind Parent B! */`
  },
  {
    topic: "z-index and Stacking",
    subtopic: "Default Stacking Order",
    concept: "What is the natural stacking order of elements within a single stacking context?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: false,
    companyTags: ["Apple", "Adobe"],
    tags: ["z-index", "stacking-order"],
    question: "What is the 7-level natural stacking order within a single stacking context (from back to front)?",
    shortAnswer: "From bottom to top: 1. Background and borders of the context root, 2. Descendants with negative `z-index`, 3. Non-positioned block-level descendants, 4. Non-positioned floats, 5. Non-positioned inline descendants, 6. Positioned descendants with `z-index: auto` or `0`, 7. Positioned descendants with positive `z-index`.",
    detailedExplanation: "Note that inline elements (text, links) naturally render in front of non-positioned block backgrounds and floats within the same stacking context.",
    codeExample: `/* Natural order (back to front):
   1. Root background
   2. Positioned with z-index: -1
   3. Normal block <div>
   4. Floating elements
   5. Inline <span> / text
   6. Positioned with z-index: 0 / auto
   7. Positioned with z-index: 1+
*/`
  },
  {
    topic: "Display",
    subtopic: "visibility: collapse",
    concept: "What does visibility: collapse do on table rows vs regular elements?",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: false,
    companyTags: ["Oracle", "Salesforce"],
    tags: ["display", "visibility", "tables"],
    question: "What is the unique behavior of `visibility: collapse` when applied to table rows/columns compared to regular elements?",
    shortAnswer: "On table rows (`<tr>`), table columns (`<col>`), and row groups, `visibility: collapse` removes the row and collapses its space without recalculating column widths for the rest of the table. On non-table elements, it behaves identically to `visibility: hidden`.",
    detailedExplanation: "This allows dynamically hiding rows without triggering full table layout recalibrations.",
    codeExample: `/* Table row collapsing without breaking table column calculations */
tr.hidden-row {
  visibility: collapse;
}`
  },
  {
    topic: "Positioning",
    subtopic: "inset: 0 & margin: auto Centering",
    concept: "How does absolute positioning with inset: 0 and margin: auto work?",
    difficulty: "INTERMEDIATE",
    questionType: "SHORT CODE",
    experienceLevel: "1_3_YEARS",
    isHighFrequency: true,
    companyTags: ["Google", "Amazon"],
    tags: ["positioning", "inset", "centering", "margin-auto"],
    question: "How does combining `position: absolute; inset: 0; margin: auto;` center an element with explicit dimensions?",
    shortAnswer: "Setting `inset: 0` (or `top: 0; right: 0; bottom: 0; left: 0`) creates an over-constrained layout spanning the entire containing block. When explicit `width` and `height` are provided, `margin: auto` distributes all leftover horizontal and vertical space equally on all four sides, centering the element perfectly.",
    detailedExplanation: "Unlike `transform: translate(-50%, -50%)`, this technique does not cause blurry subpixel text rendering on non-retina displays.",
    codeExample: `/* Crisp absolute centering without transform fuzziness */
.modal {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 400px;
  height: 300px;
}`
  }
];
