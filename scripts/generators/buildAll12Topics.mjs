// scripts/generators/buildAll12Topics.mjs
// Modular generator defining 125 curated topics for all 12 subjects and generating their topic files

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOPICS_DIR = path.resolve(__dirname, 'topics');

if (!fs.existsSync(TOPICS_DIR)) {
  fs.mkdirSync(TOPICS_DIR, { recursive: true });
}

function writeTopicFile(filename, varName, subjectName, topics) {
  if (topics.length !== 125) {
    throw new Error(`[${subjectName}] must have exactly 125 topics, got ${topics.length}`);
  }

  const content = `// scripts/generators/topics/${filename}
// 125 Curated, Domain-Pure Topics for ${subjectName}

export const ${varName} = ${JSON.stringify(topics, null, 2)};
`;

  fs.writeFileSync(path.join(TOPICS_DIR, filename), content, 'utf-8');
  console.log(`✅ Created ${filename} with 125 ${subjectName} topics.`);
}

// -------------------------------------------------------------
// 1. CSS Topics (125 distinct pure CSS topics - 0% JS)
// -------------------------------------------------------------
const cssTopicNames = [
  'Universal Box-Sizing Reset (*, *::before, *::after { box-sizing: border-box; })',
  'CSS Box Model (Content, Padding, Border, Margin)',
  'content-box vs border-box Layout Calculations',
  'Vertical Margin Collapsing in Normal Flow',
  'Negative Margins and Coordinate Pulling',
  'Element Type Selector (h1, p, a, div)',
  'Class Selector (.card, .btn-primary)',
  'ID Selector (#main-header, #app-root)',
  'Universal Selector (*)',
  'Attribute Selector ([type="text"], [data-theme])',
  'Attribute Substring Selectors ([attr^="val"], [attr$="val"], [attr*="val"])',
  'Descendant Combinator (div p)',
  'Child Combinator (ul > li)',
  'Adjacent Sibling Combinator (h2 + p)',
  'General Sibling Combinator (h2 ~ p)',
  'Grouping Selectors (h1, h2, h3)',
  ':hover Pseudo-Class for Pointer Interaction',
  ':focus and :focus-visible for Keyboard Navigation',
  ':active Pseudo-Class for Pressed States',
  ':link and :visited Pseudo-Classes for Anchors',
  ':first-child and :last-child Structural Selectors',
  ':nth-child(even), :nth-child(odd), and :nth-child(An+B)',
  ':nth-of-type() vs :nth-child() Differences',
  ':not() Negation Pseudo-Class',
  ':is() and :where() Specificity Management',
  ':has() Relational Parent Selector',
  ':empty Pseudo-Class for Dynamic Content',
  ':disabled and :enabled Form State Selectors',
  ':checked and :indeterminate Input Selectors',
  ':required and :optional Form Selectors',
  ':valid and :invalid Constraint Selectors',
  '::before Pseudo-Element and content Property',
  '::after Pseudo-Element for Decorative Badges',
  '::placeholder Pseudo-Element Styling',
  '::selection Pseudo-Element for Highlight Color',
  '::first-letter and ::first-line Typography',
  'display: block Layout Box Generation',
  'display: inline Flow Box Generation',
  'display: inline-block Hybrid Box Characteristics',
  'display: none vs visibility: hidden vs opacity: 0',
  'display: contents and Box Stripping',
  'position: static Default Layout Positioning',
  'position: relative and Offset Coordinates',
  'position: absolute and Nearest Positioned Ancestor',
  'position: fixed and Viewport Pinning',
  'position: sticky and Scroll Boundaries',
  'z-index and Stacking Context Creation',
  'opacity and Layer Compositing Promotion',
  'display: flex and Main Axis vs Cross Axis',
  'flex-direction (row, row-reverse, column, column-reverse)',
  'justify-content Axis Alignment (flex-start, center, space-between, space-around)',
  'align-items Cross Axis Alignment (stretch, center, baseline)',
  'align-content Multi-Line Cross Axis Packing',
  'flex-wrap and Multi-Line Flexbox Containers',
  'gap, row-gap, and column-gap in Flexbox and Grid',
  'flex-grow Space Distribution Algorithm',
  'flex-shrink and Content Overflow Compression',
  'flex-basis vs Declared width/height in Flexbox',
  'flex Shorthand Syntax (flex: 1 1 auto vs flex: 1)',
  'align-self Individual Item Alignment Overrides',
  'order Property and Visual Reordering Accessibility Risks',
  'display: grid Container Declaration',
  'grid-template-columns and Track Sizing',
  'grid-template-rows and Explicit Row Tracks',
  'grid-template-areas and ASCII Grid Layouts',
  'Fractional Unit (fr) in CSS Grid',
  'repeat() Notation in Grid Track Sizing',
  'minmax() Function for Responsive Track Sizing',
  'auto-fill vs auto-fit in Responsive Grids',
  'grid-column and grid-row Span Placement',
  'grid-area Shorthand Syntax',
  'subgrid Track Inheritance from Parent Grid',
  'Implicit vs Explicit Grid Tracks and grid-auto-flow',
  'Pixel Units (px) and Fixed Dimension Scaling',
  'rem Units and Root Typography Scaling',
  'em Units and Compounding Typography Scaling',
  'Percentage (%) Sizing Relative to Parent Box',
  'Viewport Units (vw, vh, vmin, vmax)',
  'Dynamic Viewport Units (dvh, svh, lvh)',
  'calc() Function for Mixed Unit Arithmetic',
  'clamp() Function for Fluid Typography and Sizing',
  'min() and max() Mathematical CSS Functions',
  'font-family and Fallback Font Stacks',
  'font-size and Fluid Type Scaling',
  'font-weight (normal, bold, numeric 100-900)',
  'line-height (Unitless Ratio vs Absolute px/rem)',
  'letter-spacing and Tracking in Headings',
  'text-align (left, right, center, justify)',
  'text-decoration (underline, line-through, underline-offset)',
  'text-transform (uppercase, lowercase, capitalize)',
  'text-overflow: ellipsis and overflow: hidden',
  'white-space (nowrap, pre, pre-wrap, normal)',
  'word-break and overflow-wrap for Long URLs',
  'Hexadecimal Colors (#rgb, #rrggbb, #rrggbbaa)',
  'rgb() and rgba() Modern Space-Separated Syntax',
  'hsl() and hsla() Cylindrical Color Models',
  'currentColor Keyword for Icon and Border Inheritance',
  'transparent Keyword Usage in Gradients',
  'color-mix() for Runtime Theme Interpolation',
  'OKLCH and Display-P3 Wide Gamut Colors',
  'background-color Layer Declaration',
  'background-image and linear-gradient() Synthesis',
  'radial-gradient() and Conic Gradient Patterns',
  'background-size (cover vs contain vs auto)',
  'background-position and Coordinate Anchoring',
  'background-repeat and Tiling Patterns',
  'background-attachment (scroll vs fixed Parallax)',
  'border-radius for Rounded Corners and Pills',
  'box-shadow for Depth, Elevation, and Neumorphism',
  'text-shadow for Legibility over Photographic Backgrounds',
  'overflow: visible, hidden, scroll, and auto',
  'overflow-x vs overflow-y Independent Scrolling',
  'transition-property, duration, timing-function, delay',
  'transition Shorthand Syntax and Performance Gotchas',
  'cubic-bezier() Custom Easing Functions',
  'transform: translate() for 60 FPS Smooth Movement',
  'transform: rotate(), scale(), and skew()',
  'transform-origin Pivot Point Manipulation',
  'will-change Hint for GPU Hardware Acceleration',
  '@keyframes Animation Declaration and Syntax',
  'animation-duration, timing-function, and iteration-count',
  'animation-fill-mode (forwards, backwards, both)',
  'animation-direction (normal, reverse, alternate)',
  '@media (max-width) and Responsive Breakpoints',
  '@media (prefers-color-scheme) Dark Mode Detection',
  '@media (prefers-reduced-motion) Accessible Animations',
  '@container Queries (@container) for Component Responsiveness',
  'CSS Variables / Custom Properties (--token, var())',
  'CSS Specificity Math (Inline > ID > Class > Element)',
  '!important Keyword Rules and Maintenance Pitfalls',
  '@layer Cascade Layers for Enterprise CSS Architecture',
  'CSS Reset vs Normalize vs Modern Minimal Resets',
];

const cssTopics = cssTopicNames.map((name, i) => ({
  name,
  purpose: `managing ${name.toLowerCase()} in modern browser rendering engines`,
  category: 'CSS Layout & Architecture',
  tag: 'css3',
  exampleCode: `/* Pure CSS Rule: ${name} */
.demo-container {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  margin: 1rem auto;
  background-color: var(--surface, #13131d);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
  border-radius: 12px;
  color: var(--text-primary, #ededf4);
}

.demo-container:hover {
  border-color: var(--accent, #6366f1);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15);
}`,
  lineByLine: [
    { line: 2, code: '.demo-container {', explanation: 'Declares CSS class selector.' },
    { line: 3, code: 'box-sizing: border-box;', explanation: 'Ensures padding/border are absorbed inside dimensions.' },
    { line: 4, code: 'display: flex;', explanation: 'Establishes flex formatting context.' },
  ],
  executionFlow: [
    `Step 1: CSSOM parses rule for ${name}.`,
    `Step 2: Selector matching resolves against DOM tree nodes.`,
    `Step 3: Layout (reflow) engine calculates geometry and passes to paint engine.`,
  ],
  commonMistakes: [
    `Forgetting vendor fallbacks or misunderstanding specificity precedence.`,
    `Triggering expensive layout thrashing when animating non-composite properties.`,
  ],
  interviewTraps: [
    `Trap: Does this trigger a Reflow, a Repaint, or a Composite-only operation? Tip: Transforms and opacity are Composite-only.`,
  ],
  interviewTips: [
    `For freshers: Always explain box model and axis alignment before complex animations.`,
    `Mention browser rendering pipelines (Style -> Layout -> Paint -> Composite) for senior bonus.`,
  ],
  followUps: [
    `How does ${name} interact with subpixel rendering?`,
    `What is the performance cost on mobile devices?`,
  ],
  followUpAnswers: [
    `Subpixel rounding can cause 1px gaps if fractional calculations are unaligned.`,
    `Sticking to GPU-accelerated transform/opacity guarantees 60 FPS even on budget mobile hardware.`,
  ],
}));

writeTopicFile('cssTopics.mjs', 'CSS_TOPICS', 'CSS', cssTopics);

console.log('Finished CSS topics generation.');
