import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve('public/data/interview-questions');

// Known tailored execution flows for core topics
const TAILORED_HOW_IT_WORKS = {
  // CSS
  'CSS Box Model': `1. **Content Edge**: The innermost rectangular area where text, images, or child elements render; governed by \`width\` and \`height\`.
2. **Padding Edge**: Clears space immediately surrounding the content; inherits the element's background styling.
3. **Border Edge**: Renders styled border lines (solid, dashed, etc.) wrapping padding and content; marks the visual perimeter.
4. **Margin Edge**: Transparent outer buffer creating separation between this element and adjacent sibling or parent elements.
5. **Box-Sizing Resolution**: In \`content-box\`, padding and borders add to specified width (\`total = width + padding + border\`). In \`border-box\`, padding and borders are absorbed within the specified width (\`total = width\`).`,

  'Universal Box-Sizing Reset': `1. **Universal Matching**: The \`*\`, \`*::before\`, and \`*::after\` selectors target every current and future DOM node and pseudo-element.
2. **Inherited Box-Sizing**: Sets \`box-sizing: border-box\` across the entire document tree.
3. **Internal Absorption**: Padding and borders are calculated inside specified dimensions rather than expanding outward.
4. **Layout Stability**: Prevents container overflow and eliminates tedious layout arithmetic when styling responsive columns.`,

  'content-box vs border-box': `1. **content-box (W3C Default)**: Specified \`width\` applies strictly to the content box. Rendered width = \`width + padding-left + padding-right + border-left + border-right\`.
2. **border-box (IE / Modern Standard)**: Specified \`width\` encompasses content, padding, and border. Rendered width = specified \`width\`.
3. **Content Shrinking**: When \`border-box\` is set on an element with \`width: 200px\` and \`padding: 20px\`, the inner content area shrinks to \`160px\`.
4. **Grid & Flex Resiliency**: Guarantees percentages like \`width: 50%\` with padding never exceed parent container bounds.`,

  'Margin Collapsing': `1. **Adjacency Check**: Two vertical margins touch with no intervening border, padding, or inline content in normal flow.
2. **Value Comparison**: If both margins are positive, the browser applies the maximum of the two (\`max(m1, m2)\`).
3. **Negative Handling**: If one is negative, it is subtracted from the positive margin. If both are negative, the most negative is applied.
4. **Collapsing Prevention**: Margins do not collapse across elements with \`overflow\` other than \`visible\`, flex/grid items, or elements with \`display: inline-block\`.`,

  'Negative Margins': `1. **Coordinate Adjustment**: Negative \`top\` or \`left\` margins pull the element upward or leftward from its static position.
2. **Flow Reduction**: Negative \`bottom\` or \`right\` margins pull subsequent sibling elements closer into this element's bounding box.
3. **Layout vs Transform**: Unlike \`transform: translate()\`, negative margins physically affect adjacent document layout flow.`,

  'Specificity': `1. **Inline Level (1,0,0,0)**: Directly applied in the HTML \`style\` attribute; overrides external and embedded stylesheets.
2. **ID Level (0,1,0,0)**: Each \`#id\` selector adds 1 to the second column.
3. **Class / Attribute / Pseudo-class (0,0,1,0)**: Each \`.class\`, \`[attr]\`, or \`:pseudo-class\` adds 1 to the third column.
4. **Element / Pseudo-element (0,0,0,1)**: Each tag name (\`div\`, \`p\`) or \`::pseudo-element\` adds 1 to the fourth column.
5. **Cascade Tie-Breaker**: When specificity scores match, the last declared rule in the stylesheet wins.`,

  'Flexbox': `1. **Formatting Context**: Setting \`display: flex\` establishes a flex container and formats immediate children as flex items.
2. **Axis Determination**: \`flex-direction\` (row or column) establishes the primary main axis and orthogonal cross axis.
3. **Main Axis Distribution**: \`justify-content\` distributes free space along the main axis.
4. **Cross Axis Alignment**: \`align-items\` aligns items across individual lines; \`align-content\` distributes lines when multi-line wrapping occurs.
5. **Item Flexibility**: \`flex-grow\`, \`flex-shrink\`, and \`flex-basis\` compute actual item dimensions based on available container space.`,

  'Grid': `1. **Grid Container**: \`display: grid\` creates a two-dimensional grid formatting context.
2. **Track Definition**: \`grid-template-columns\` and \`grid-template-rows\` establish explicit tracks using fixed, fractional (\`fr\`), or auto sizing.
3. **Cell Placement**: Children are auto-placed into available cells or explicitly positioned via \`grid-column\` and \`grid-row\` line indices.
4. **Alignment & Gutters**: \`gap\` creates gutters between tracks, while \`justify-items\` and \`align-items\` align content within individual cells.`,

  'Stacking Context': `1. **Context Creation**: Triggered by root element, \`position\` with non-auto \`z-index\`, \`opacity < 1\`, \`transform\`, \`filter\`, or \`isolation: isolate\`.
2. **Layer Hierarchy**: Background and borders render first, followed by negative z-index descendants, block-level flow, floating boxes, inline elements, and positive z-index layers.
3. **Atomic Isolation**: Children of a stacking context cannot escape their parent's stacking level relative to other stacking contexts.`,

  'Transitions': `1. **State Trigger**: A pseudo-class (e.g. \`:hover\`, \`:focus\`) or JavaScript class mutation alters a CSS property.
2. **Interpolation**: The rendering engine interpolates intermediate property values over the specified \`transition-duration\`.
3. **Timing Function**: Computes velocity curve (\`ease\`, \`linear\`, \`cubic-bezier\`) over the animation timeline.
4. **Compositing**: Transitions on \`transform\` and \`opacity\` bypass layout and paint phases, running smoothly on the GPU thread.`,

  'Media Queries': `1. **Viewport Evaluation**: Browser continuously tracks viewport dimensions, device pixel ratio, and system preferences (e.g. \`prefers-color-scheme\`).
2. **Rule Matching**: Conditionally activates CSS rules wrapped inside \`@media (min-width: ...)\` when viewport criteria are met.
3. **Live Cascade Re-Evaluation**: When viewport resizes across a breakpoint, matched rules are merged into the active CSSOM.`,

  // JS
  'Execution Context': `1. **Creation Phase**: Global Object and \`this\` binding established; memory space allocated for variable and function declarations.
2. **Hoisting Mechanics**: \`var\` initialized with \`undefined\`; \`let\` and \`const\` remain uninitialized in Temporal Dead Zone (TDZ); functions stored with full body.
3. **Execution Phase**: Code executes sequentially line-by-line; variables assigned values, expressions evaluated.
4. **Context Switching**: Function calls push new execution contexts onto Call Stack; returns pop context off and resume caller.`,

  'Event Loop': `1. **Call Stack Execution**: Synchronous JavaScript operations execute sequentially on the single main thread.
2. **Web API Delegation**: Asynchronous operations (\`setTimeout\`, \`fetch\`, DOM events) are handed off to browser background threads.
3. **Queue Enqueuing**: When tasks complete, callbacks enter either the high-priority Microtask Queue (Promises, \`queueMicrotask\`) or Macrotask Queue (\`setTimeout\`, \`setInterval\`).
4. **Turn Execution**: After Call Stack empties, the Event Loop drains all pending microtasks before picking the next macrotask.`,

  'Hoisting': `1. **Compile Phase Scanning**: Engine scans the scope for declarations before any line of code runs.
2. **Memory Allocation**: Identifiers are registered in the Lexical Environment record.
3. **Initialization State**: \`var\` is initialized to \`undefined\`; \`let\`/\`const\` are declared but marked uninitialized (TDZ); function declarations are fully instantiated.
4. **Runtime Access**: Accessing \`let\`/\`const\` before declaration throws \`ReferenceError\`; accessing \`var\` returns \`undefined\`.`,

  'Closures': `1. **Lexical Scope Creation**: Functions remember the outer scope where they were declared via an internal \`[[Environment]]\` slot.
2. **Outer Return**: Outer function finishes execution and its execution context is popped off the Call Stack.
3. **Reference Retention**: The inner function maintains a persistent reference to outer scope variables.
4. **Variable Access**: When the inner function is invoked later, it accesses and modifies the retained lexical variables.`,

  'Prototypal Inheritance': `1. **Property Lookup**: Engine looks for the property directly on the target object's own properties.
2. **Prototype Traversal**: If not found, follows the \`__proto__\` internal link to \`Object.getPrototypeOf(obj)\`.
3. **Chain Ascent**: Continues checking prototype chain until property is found or \`null\` is reached (end of chain).
4. **Resolution**: Returns property value or \`undefined\` if reaching end of prototype chain without a match.`,

  'Promises': `1. **Promise Instantiation**: Executor function runs synchronously; sets internal \`[[PromiseState]]\` to \`pending\`.
2. **Settlement**: Calling \`resolve(val)\` or \`reject(err)\` transitions state to \`fulfilled\` or \`rejected\` immutably.
3. **Reaction Queuing**: Attached \`.then()\` / \`.catch()\` callbacks are enqueued to the Microtask Queue.
4. **Async/Await Unwrapping**: \`await\` pauses async function execution, yields to caller, and resumes on microtask resolution.`,

  // React
  'Reconciliation': `1. **Render Trigger**: State change (\`setState\`, \`useState\`) or props update marks component as dirty.
2. **Virtual DOM Tree Generation**: React executes component function, generating a new immutable JSX element tree.
3. **Fiber Diffing**: Compares new tree against current Fiber tree using heuristic rules (element type check, \`key\` attribute stability).
4. **Commit Phase**: Computes minimal DOM operations (insertions, updates, deletions) and synchronously applies them to real DOM.`,

  'useState': `1. **Hook Dispatch**: Calling state setter schedules a re-render and queues the update payload in Fiber memoizedState.
2. **Batching**: Multiple synchronous state updates are batched together into a single render pass.
3. **Next Render**: Component function re-executes; \`useState\` retrieves the updated value from the Fiber queue.
4. **Bailout Optimization**: If new state equals previous state via \`Object.is()\`, React bails out of re-rendering child components.`,

  'useEffect': `1. **Effect Registration**: Effect callback and dependency array are captured during component render.
2. **DOM Paint**: React completes the commit phase and browser paints updated pixels to screen.
3. **Dependency Comparison**: React compares current dependencies against previous render via \`Object.is()\`.
4. **Execution & Cleanup**: If dependencies changed, runs cleanup function from previous render, then executes current effect.`,
};

function isGeneric(text) {
  if (!text || typeof text !== 'string') return true;
  const trimmed = text.trim();
  if (!trimmed) return true;
  const lower = trimmed.toLowerCase();
  return (
    lower.includes('under the hood in the browser rendering engine') ||
    lower.includes('the browser css parser tokenizes rules') ||
    lower.includes('under the hood in the javascript engine') ||
    lower.includes('under the hood in the browser:') ||
    lower.includes('under the hood in react fiber') ||
    lower.includes('under the hood in redux') ||
    lower.includes('under the hood in the typescript compiler') ||
    lower.includes('the jquery collection targets matching dom nodes') ||
    lower.includes('the browser requests and receives the raw html bytes') ||
    lower.includes('the browser engine parses the html markup') ||
    lower.includes('as the parser reads an opening tag, it identifies attribute') ||
    /^1\.\s*the .* runtime initializes/i.test(trimmed)
  );
}

function findTailoredHowItWorks(q) {
  const searchable = `${q.subtopic || ''} ${q.question || ''} ${q.concept || ''}`.toLowerCase();
  for (const [key, flow] of Object.entries(TAILORED_HOW_IT_WORKS)) {
    if (searchable.includes(key.toLowerCase())) {
      return flow;
    }
  }
  return null;
}

function isGenericExecutionFlow(flow) {
  if (!flow || !Array.isArray(flow) || flow.length === 0) return true;
  const first = (flow[0] || '').toLowerCase();
  return (
    first.includes('abstract syntax tree') ||
    first.includes('browser hardware event') ||
    first.includes('css object model') ||
    first.includes('cssom') ||
    first.includes('state setter function triggers re-render') ||
    first.includes('store.dispatch(action)') ||
    first.includes('scanner tokenizes raw source text')
  );
}

const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json') && !f.includes('meta') && !f.includes('index'));

let totalCleaned = 0;
let totalTailored = 0;
let totalCleared = 0;
let totalExecutionFlowCleared = 0;

for (const file of files) {
  const filePath = path.join(DATA_DIR, file);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const isArray = Array.isArray(content);
  const questions = isArray ? content : (content.questions || []);

  let fileModified = false;

  for (const q of questions) {
    // Check howItWorks
    if (isGeneric(q.howItWorks)) {
      const tailored = findTailoredHowItWorks(q);
      if (tailored) {
        q.howItWorks = tailored;
        totalTailored++;
      } else {
        q.howItWorks = '';
        totalCleared++;
      }
      totalCleaned++;
      fileModified = true;
    }

    // Check executionFlow
    if (q.executionFlow && isGenericExecutionFlow(q.executionFlow)) {
      q.executionFlow = [];
      totalExecutionFlowCleared++;
      fileModified = true;
    }
  }

  if (fileModified) {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
    console.log(`Updated ${file}`);
  }
}

console.log({
  totalCleaned,
  totalTailored,
  totalCleared,
  totalExecutionFlowCleared,
});
