export interface ComparisonItem {
  id: string;
  title: string;
  subject: string;
  category: string;
  badge: string;
  summary: string;
  leftTitle: string;
  rightTitle: string;
  tableData: Array<{
    dimension: string;
    leftValue: string;
    rightValue: string;
    verdict: string;
  }>;
  mentalModel: string;
  keyDifferences: string[];
  whenToUseLeft: string[];
  whenToUseRight: string[];
  performanceConsiderations: string;
  seniorInterviewInsight: string;
  leftCode: { language: string; snippet: string };
  rightCode: { language: string; snippet: string };
  interviewQuestions: Array<{
    question: string;
    quickAnswer: string;
    seniorAnswer: string;
  }>;
}

export const COMPARISONS_CATALOG: ComparisonItem[] = [
  {
    id: 'usememo-vs-usecallback',
    title: 'useMemo vs useCallback',
    subject: 'ReactJS',
    category: 'React Hooks',
    badge: '🔥 Must Know',
    summary: 'Master the distinction between caching computed values vs caching function references, referential stability, and when memoization actually harms performance.',
    leftTitle: 'useMemo',
    rightTitle: 'useCallback',
    tableData: [
      {
        dimension: 'Return Value',
        leftValue: 'Caches the result of calling fn() (a computed value, object, or array)',
        rightValue: 'Caches the fn function definition itself without executing it',
        verdict: 'Different return types',
      },
      {
        dimension: 'Primary Purpose',
        leftValue: 'Avoid expensive recalculations on every render',
        rightValue: 'Maintain referential equality for callbacks passed to memoized children',
        verdict: 'Complementary use cases',
      },
      {
        dimension: 'Syntax Equivalency',
        leftValue: 'useMemo(() => computeValue(a, b), [a, b])',
        rightValue: 'Equivalent to useMemo(() => fn, [deps])',
        verdict: 'useCallback is syntactic sugar over useMemo',
      },
      {
        dimension: 'Common Anti-pattern',
        leftValue: 'Wrapping cheap O(1) operations (e.g. a + b)',
        rightValue: 'Wrapping handlers passed to non-memoized standard HTML elements (e.g. <button onClick={...}>)',
        verdict: 'Adds memory overhead without benefits',
      },
    ],
    mentalModel: 'useMemo caches a value so you don\'t re-run a calculation. useCallback caches a function instance so downstream components wrapped in React.memo don\'t trigger unnecessary re-renders due to broken referential equality.',
    keyDifferences: [
      'useMemo executes the passed function during render and returns the computed result.',
      'useCallback returns the passed function as-is, preserving its reference identity until dependencies change.',
      'useCallback(fn, deps) is functionally identical to useMemo(() => fn, deps).',
      'Neither hook guarantees memory retention: React may clear its cache during concurrent rendering or memory pressure.',
    ],
    whenToUseLeft: [
      'Filtering, sorting, or transforming a dataset of > 1,000 items.',
      'Generating complex configuration or chart option objects passed to memoized child components.',
      'Creating regular expressions or heavy data structures inside component render.',
    ],
    whenToUseRight: [
      'Passing callback functions to child components wrapped in React.memo (e.g. <MemoizedItem onDelete={handleDelete} />).',
      'Passing functions into custom hooks dependency arrays (e.g. useEffect(..., [fetchData])).',
      'Debounced or throttled callback handlers where a new function instance would reset the timer.',
    ],
    performanceConsiderations: 'Every useMemo and useCallback call incurs memory allocation (closures, dependency array array-diffing). For cheap calculations (e.g. string formatting, simple array mapping under 50 items), the hook allocation cost exceeds the re-calculation cost.',
    seniorInterviewInsight: 'Senior candidates explain that useCallback is useless if the receiving child component is NOT wrapped in React.memo. If <Child /> is not memoized, it will re-render anyway regardless of whether the callback reference changed.',
    leftCode: {
      language: 'tsx',
      snippet: `// useMemo: Caches the filtered array result
const visibleTodos = useMemo(() => {
  return todos.filter(t => t.priority === priority);
}, [todos, priority]);`,
    },
    rightCode: {
      language: 'tsx',
      snippet: `// useCallback: Preserves function reference for React.memo child
const handleDelete = useCallback((id: string) => {
  setTodos(prev => prev.filter(t => t.id !== id));
}, []); // Stable identity across renders`,
    },
    interviewQuestions: [
      {
        question: 'Why does passing an inline function to a standard <button onClick={() => ...}> not require useCallback?',
        quickAnswer: 'Native DOM elements do not perform shallow prop comparisons; they re-render whenever their parent re-renders. Wrapping the handler in useCallback adds hook overhead without preventing any renders.',
        seniorAnswer: 'Native elements (div, button, input) are updated by React through direct DOM mutation, not React.memo shallow comparisons. useCallback only delivers value when referential equality is checked by a memoized component or listed in a dependency array.',
      },
      {
        question: 'How are useMemo and useCallback related under the hood in React Fiber?',
        quickAnswer: 'useCallback(fn, deps) is simply syntactic sugar for useMemo(() => fn, deps). Both hooks store their memoized state in a MemoizedState cell on the component fiber.',
        seniorAnswer: 'In React Fiber internals, mountCallback stores [callback, nextDeps] on the hook object, while updateCallback checks areHookInputsEqual(nextDeps, prevDeps). If equal, it returns prevDeps[0]; otherwise, it stores and returns the new callback.',
      },
    ],
  },
  {
    id: 'useeffect-vs-uselayouteffect',
    title: 'useEffect vs useLayoutEffect',
    subject: 'ReactJS',
    category: 'React Lifecycle & DOM',
    badge: '⭐ Frequently Asked',
    summary: 'Understand asynchronous post-paint execution vs synchronous pre-paint DOM mutation, layout thrashing, and visual flicker prevention.',
    leftTitle: 'useEffect',
    rightTitle: 'useLayoutEffect',
    tableData: [
      {
        dimension: 'Execution Timing',
        leftValue: 'Asynchronous, fires AFTER the browser paints the frame',
        rightValue: 'Synchronous, fires AFTER DOM mutation but BEFORE the browser paints',
        verdict: 'useLayoutEffect blocks painting',
      },
      {
        dimension: 'Visual Flicker',
        leftValue: 'Can cause a visible flash if you measure and mutate the DOM',
        rightValue: 'Completely eliminates visual flicker (DOM mutations apply before paint)',
        verdict: 'useLayoutEffect is flicker-free',
      },
      {
        dimension: 'Performance Impact',
        leftValue: 'Non-blocking; keeps the main thread responsive for user interactions',
        rightValue: 'Blocks visual paint; long tasks will cause visible lag and poor INP',
        verdict: 'useEffect is safer for performance',
      },
      {
        dimension: 'Server-Side Rendering (SSR)',
        leftValue: 'Safe; runs strictly in browser after hydration',
        rightValue: 'Emits a console warning on server because the server has no DOM layout',
        verdict: 'useEffect is 100% SSR-friendly',
      },
    ],
    mentalModel: 'useEffect is for code that doesn\'t need to block visual updates (fetching data, analytics, subscriptions). useLayoutEffect is for code that MUST run before the user sees the screen (measuring element size/position, adjusting tooltip coordinates to avoid jumping).',
    keyDifferences: [
      'useEffect runs after React has flushed changes to the DOM AND the browser has painted the screen.',
      'useLayoutEffect runs after DOM mutation but before the browser performs layout and paint.',
      'A slow task in useLayoutEffect freezes the entire UI render pass.',
      'useLayoutEffect causes Next.js/SSR warnings unless guarded with typeof window !== "undefined".',
    ],
    whenToUseLeft: [
      'Data fetching (fetch/Axios/GraphQL).',
      'Event listeners on window or document (resize, scroll, keydown).',
      'Setting up WebSockets, timers (setInterval), or analytics beacons.',
      '99% of all standard application side-effects.',
    ],
    whenToUseRight: [
      'Calculating tooltips, dropdowns, or popover positions relative to parent bounds.',
      'Synchronous scroll restoration or measuring scrollHeight/offsetWidth.',
      'Canvas animations or SVG layout transforms where initial positioning would cause a visual jump.',
    ],
    performanceConsiderations: 'Never put heavy computations, network calls, or non-DOM side effects inside useLayoutEffect. Because it blocks the browser paint cycle, expensive operations directly inflate Interaction to Next Paint (INP) and Total Blocking Time (TBT).',
    seniorInterviewInsight: 'Senior engineers explain the paint pipeline: React Render -> Commit to DOM -> useLayoutEffect -> Browser Paint -> useEffect. If useLayoutEffect updates state, React re-renders immediately before the user ever sees the intermediate frame.',
    leftCode: {
      language: 'tsx',
      snippet: `// useEffect: Non-blocking data fetch after paint
useEffect(() => {
  fetchCandidateMetrics(candidateId).then(setData);
}, [candidateId]);`,
    },
    rightCode: {
      language: 'tsx',
      snippet: `// useLayoutEffect: Measure DOM & adjust position before paint
useLayoutEffect(() => {
  const rect = ref.current.getBoundingClientRect();
  setTooltipPos({ x: rect.left, y: rect.top - 40 });
}, []); // User never sees tooltip at wrong location!`,
    },
    interviewQuestions: [
      {
        question: 'Why does useLayoutEffect prevent screen flickering when positioning tooltips?',
        quickAnswer: 'Because it runs synchronously before the browser paints. The initial measurement and resulting state adjustment are grouped into a single visual frame.',
        seniorAnswer: 'In useEffect, the browser paints the element at (0,0), then useEffect measures it and triggers a second render at (100, 200), creating a visible 1-frame flash. In useLayoutEffect, React runs the layout effect, catches the state update, and renders the adjusted position before releasing the thread to the browser compositor.',
      },
    ],
  },
  {
    id: 'redux-vs-context',
    title: 'Redux Toolkit vs React Context API',
    subject: 'State Management',
    category: 'Architecture',
    badge: '🏗️ Senior Architecture',
    summary: 'Compare prop drilling solutions against centralized state stores, selector memoization, re-render cascading, and devtool observability.',
    leftTitle: 'React Context API',
    rightTitle: 'Redux Toolkit (RTK)',
    tableData: [
      {
        dimension: 'Core Identity',
        leftValue: 'Dependency injection mechanism to avoid prop drilling',
        rightValue: 'Predictable, centralized state container with middleware',
        verdict: 'Different problem scopes',
      },
      {
        dimension: 'Re-render Behavior',
        leftValue: 'EVERY consumer re-renders whenever provider value reference changes',
        rightValue: 'Granular: components re-render ONLY when their specific selector returns a new value',
        verdict: 'RTK avoids wasted renders',
      },
      {
        dimension: 'Side Effects & Async',
        leftValue: 'Must be manually handled in useEffect or custom hook wrappers',
        rightValue: 'Built-in async pipeline with createAsyncThunk and RTK Query',
        verdict: 'RTK is purpose-built for async',
      },
      {
        dimension: 'DevTools & Time Travel',
        leftValue: 'Basic React DevTools component tree inspection',
        rightValue: 'Redux DevTools action log, time-travel debugging, state snapshots',
        verdict: 'RTK offers superior enterprise observability',
      },
    ],
    mentalModel: 'Context is a transport pipeline: it takes a value and makes it accessible deep in the tree. Redux is a state management system: it decides HOW and WHEN state changes, manages caching, handles async flows, and minimizes component re-renders.',
    keyDifferences: [
      'Context API has no built-in selector mechanism. If context value is { user, theme }, updating theme re-renders components that only care about user.',
      'Redux uses useSelector with reference equality checks to bail out of rendering unconcerned components.',
      'Context requires 0 extra dependencies and is built into React core.',
      'Redux Toolkit includes Immer for mutable syntax and RTK Query for automated server state caching.',
    ],
    whenToUseLeft: [
      'Low-frequency updates: Theme (dark/light mode), Current Locale (i18n), Current Authenticated User profile.',
      'Compound component patterns (e.g. Tabs/TabList/TabPanel state sharing).',
      'Small-to-mid applications with minimal complex cross-slice state mutations.',
    ],
    whenToUseRight: [
      'High-frequency state changes: Canvas coordinates, trading feeds, complex e-commerce carts.',
      'Large collaborative teams requiring strict action contracts and state normalization.',
      'Applications requiring time-travel debugging, audit logs, or offline action queuing.',
    ],
    performanceConsiderations: 'The classic Context performance trap is creating a single monolithic AppContext ({ user, cart, theme, notifications, settings }). A single notification update triggers re-renders across the entire app tree. To optimize Context, split states into separate contexts (ThemeContext, CartContext).',
    seniorInterviewInsight: 'Senior engineers never answer "Redux is dead because of Context". They point out that Context is a dependency injection tool, not a state manager, and cite selector-based subscription architecture as the key differentiator.',
    leftCode: {
      language: 'tsx',
      snippet: `// Context: Low-frequency theme sharing
export const ThemeContext = createContext<'dark' | 'light'>('dark');

export function useTheme() {
  return useContext(ThemeContext);
}`,
    },
    rightCode: {
      language: 'tsx',
      snippet: `// Redux Toolkit: Granular selector subscription
const candidateName = useSelector((state: RootState) => 
  state.candidates.byId[id]?.name
); // Re-renders ONLY if this candidate's name changes!`,
    },
    interviewQuestions: [
      {
        question: 'Why does React Context often cause performance issues in large-scale applications?',
        quickAnswer: 'Because React Context lacks selector-based subscription. When any property in the context value changes, every component calling useContext(MyContext) must re-render.',
        seniorAnswer: 'React Context uses Object.is() shallow comparison on the Provider value prop. When it changes, React marks all consuming fibers as dirty, bypassing React.memo on intermediate children. Without splitting contexts or wrapping in custom subscription stores (useSyncExternalStore), massive tree re-renders occur.',
      },
    ],
  },
  {
    id: 'let-vs-const-vs-var',
    title: 'let vs const vs var',
    subject: 'JavaScript',
    category: 'Language Core',
    badge: '🔥 Must Know',
    summary: 'Examine lexical block scope vs function scope, variable hoisting, the Temporal Dead Zone (TDZ), and V8 engine optimization.',
    leftTitle: 'let & const',
    rightTitle: 'var',
    tableData: [
      {
        dimension: 'Scope',
        leftValue: 'Block scoped ({ ... }, if, for, while)',
        rightValue: 'Function scoped or globally scoped',
        verdict: 'Block scoping prevents variable leaks',
      },
      {
        dimension: 'Hoisting & TDZ',
        leftValue: 'Hoisted to top of block, but uninitialized (Temporal Dead Zone triggers ReferenceError)',
        rightValue: 'Hoisted and initialized to undefined (returns undefined before declaration)',
        verdict: 'TDZ catches bugs early',
      },
      {
        dimension: 'Re-declaration',
        leftValue: 'SyntaxError if re-declared in the same scope',
        rightValue: 'Silently allows re-declaration, overwriting previous value',
        verdict: 'let/const enforces safety',
      },
      {
        dimension: 'Global Object Attachment',
        leftValue: 'Does NOT attach to window in the browser',
        rightValue: 'Attaches to window.varName in global scope',
        verdict: 'Prevents window namespace pollution',
      },
    ],
    mentalModel: 'var belongs to ES5 and earlier, hoisting to the top of the enclosing function and ignoring blocks. let and const belong to modern ES6+, strictly respecting curly brace blocks and enforcing the Temporal Dead Zone to eliminate access before declaration.',
    keyDifferences: [
      'const prevents re-assignment of the variable identifier; it does NOT make object properties immutable (use Object.freeze for shallow immutability).',
      'var declared inside a for loop leaks outside the loop; let creates a new binding for every loop iteration.',
      'Accessing a let/const variable before its declaration line throws ReferenceError (Temporal Dead Zone).',
      'Accessing a var variable before declaration returns undefined.',
    ],
    whenToUseLeft: [
      'const: By default for all variable declarations unless re-assignment is explicitly required.',
      'let: When variable values must be reassigned (loop counters, accumulator variables, flag toggles).',
    ],
    whenToUseRight: [
      'Virtually never in modern TypeScript/ES2024 production code. Preserved strictly for legacy backward compatibility.',
    ],
    performanceConsiderations: 'Modern JavaScript engines (V8, SpiderMonkey) optimize const declarations heavily. When the compiler knows a reference cannot be reassigned, it can inline values and perform aggressive type feedback optimizations.',
    seniorInterviewInsight: 'Candidates often state that let and const are not hoisted. Senior candidates clarify: "let and const ARE hoisted, but they remain in an uninitialized state called the Temporal Dead Zone until the declaration line is executed."',
    leftCode: {
      language: 'javascript',
      snippet: `// Block-scoped in for loop:
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Outputs: 0, 1, 2 (each iteration has its own 'i')`,
    },
    rightCode: {
      language: 'javascript',
      snippet: `// Function-scoped in for loop:
for (var j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 100);
}
// Outputs: 3, 3, 3 (all closures reference same 'j')`,
    },
    interviewQuestions: [
      {
        question: 'Prove that "let" and "const" are actually hoisted in JavaScript.',
        quickAnswer: 'If they were not hoisted, a let variable inside a block would resolve to the outer scope variable. Instead, it throws a ReferenceError due to the Temporal Dead Zone, proving it was hoisted to the block.',
        seniorAnswer: 'Consider: let x = "outer"; { console.log(x); let x = "inner"; }. If let were not hoisted, console.log(x) would print "outer". Instead, it throws "ReferenceError: Cannot access \'x\' before initialization", demonstrating that the engine hoisted the inner declaration and entered the TDZ.',
      },
    ],
  },
  {
    id: 'ssr-vs-ssg-vs-isr',
    title: 'SSR vs SSG vs ISR vs CSR',
    subject: 'Next.js & Architecture',
    category: 'Rendering Modes',
    badge: '🏗️ Enterprise Architecture',
    summary: 'Compare Static Site Generation, Server-Side Rendering, Incremental Static Regeneration, and Client-Side Rendering trade-offs for SEO, TTFB, and scalability.',
    leftTitle: 'SSG & ISR (Static)',
    rightTitle: 'SSR (Dynamic)',
    tableData: [
      {
        dimension: 'HTML Generation Time',
        leftValue: 'SSG: At build time. ISR: At build time + background revalidation on demand',
        rightValue: 'On every incoming HTTP request on the server (Node/Edge)',
        verdict: 'Static delivers lower TTFB',
      },
      {
        dimension: 'Time to First Byte (TTFB)',
        leftValue: 'Ultra-fast (< 50ms) served directly from global CDN edge caches',
        rightValue: 'Variable (200ms - 1500ms) dependent on server compute and DB latency',
        verdict: 'SSG/ISR wins for CDN distribution',
      },
      {
        dimension: 'Data Freshness',
        leftValue: 'Stale-while-revalidate; fresh according to timer or webhook tag purge',
        rightValue: '100% fresh real-time data on every single request',
        verdict: 'SSR wins for real-time consistency',
      },
      {
        dimension: 'Server Cost & Scaling',
        leftValue: 'Nearly zero server compute; absorbs massive traffic spikes on CDN',
        rightValue: 'High server load; every request executes server code and DB queries',
        verdict: 'Static is significantly cheaper',
      },
    ],
    mentalModel: 'SSG is pre-baking cookies at the factory. ISR is baking cookies in advance and replacing a batch when a timer expires or a bell rings. SSR is cooking each meal on-demand when the customer places an order.',
    keyDifferences: [
      'SSG generates static HTML once during "next build". Excellent for marketing pages, documentation, and blog posts.',
      'ISR allows updating static pages without rebuilding the entire website via revalidate: seconds or revalidateTag().',
      'SSR executes server-side code per request. Essential for authenticated dashboards, stock trade views, and search query pages.',
      'CSR (Client-Side Rendering) ships an empty HTML shell and relies on browser JavaScript to fetch and render.',
    ],
    whenToUseLeft: [
      'Marketing websites, public developer documentation, e-commerce product detail pages (via ISR).',
      'Content managed via headless CMS (Contentful, Strapi, Sanity) paired with on-demand webhook revalidation.',
      'High-traffic public web applications needing sub-100ms global response times.',
    ],
    whenToUseRight: [
      'Personalized user account portals reading request cookies or authorization headers.',
      'Real-time financial tickers or inventory tracking where showing a 10-second stale value causes financial loss.',
      'Pages with dynamic URL search parameters that change rendering completely.',
    ],
    performanceConsiderations: 'Never default to SSR for every page in a high-traffic app. SSR creates direct database load on every page view. Using ISR with on-demand tag revalidation (revalidateTag) achieves 100% data correctness with 99% CDN edge cache hit ratios.',
    seniorInterviewInsight: 'Senior architects articulate the trade-off: "If you have 500,000 products, SSG at build time takes 4 hours to build. With ISR, you build the top 1,000 products at build time, and generate the remaining 499,000 statically on-demand when users first request them."',
    leftCode: {
      language: 'tsx',
      snippet: `// ISR: 1-hour background cache + tag invalidation
export async function ProductPage({ params }: { params: { id: string } }) {
  const res = await fetch(\`https://api.com/products/\${params.id}\`, {
    next: { revalidate: 3600, tags: [\`product-\${params.id}\`] }
  });
  const product = await res.json();
  return <ProductView product={product} />;
}`,
    },
    rightCode: {
      language: 'tsx',
      snippet: `// SSR: Always dynamic per request
export const dynamic = 'force-dynamic';

export async function DashboardPage() {
  const cookieStore = cookies();
  const session = await auth(cookieStore.get('token'));
  return <UserDashboard user={session.user} />;
}`,
    },
    interviewQuestions: [
      {
        question: 'What happens when a user visits an expired ISR page in Next.js?',
        quickAnswer: 'Next.js serves the stale cached page immediately (stale-while-revalidate), while triggering a background re-generation. Once regenerated, subsequent visitors receive the new page.',
        seniorAnswer: 'Next.js implements the RFC 5861 stale-while-revalidate HTTP standard. The visitor experiences zero latency penalty. If the background regeneration fails, Next.js continues serving the stale version safely without crashing.',
      },
    ],
  },
  {
    id: 'rest-vs-websocket-vs-sse',
    title: 'REST APIs vs WebSockets vs Server-Sent Events',
    subject: 'Networking & Realtime',
    category: 'Communication Protocols',
    badge: '⭐ Frequently Asked',
    summary: 'Compare stateless request-response HTTP with full-duplex persistent TCP WebSockets and lightweight unidirectional Server-Sent Events (SSE).',
    leftTitle: 'REST APIs (HTTP/1.1 & 2)',
    rightTitle: 'WebSockets & SSE',
    tableData: [
      {
        dimension: 'Connection Model',
        leftValue: 'Stateless, short-lived request-response cycles',
        rightValue: 'WebSockets: Full-duplex persistent TCP connection. SSE: Persistent unidirectional HTTP stream',
        verdict: 'Different connection lifecycles',
      },
      {
        dimension: 'Directionality',
        leftValue: 'Unidirectional (Client sends request, Server sends response)',
        rightValue: 'WebSockets: Bidirectional. SSE: Server-to-Client only',
        verdict: 'WebSockets for chat/gaming; SSE for AI streaming/feeds',
      },
      {
        dimension: 'Protocol & Handshake',
        leftValue: 'Standard HTTP/1.1 or HTTP/2 GET/POST/PUT/DELETE',
        rightValue: 'WebSockets: HTTP 101 Switching Protocols. SSE: text/event-stream over HTTP',
        verdict: 'SSE runs over standard HTTP without custom protocols',
      },
      {
        dimension: 'Reconnection & Heartbeats',
        leftValue: 'Handled per request; no persistent state',
        rightValue: 'WebSockets: Requires custom ping/pong. SSE: Browser native auto-reconnect with Last-Event-ID',
        verdict: 'SSE has built-in reconnection',
      },
    ],
    mentalModel: 'REST is sending a letter and waiting for a reply. WebSockets is a continuous two-way phone call. Server-Sent Events (SSE) is tuning into a radio broadcast where you listen to real-time audio from the station.',
    keyDifferences: [
      'WebSockets maintain a long-lived TCP connection, bypassing HTTP header overhead on every frame.',
      'SSE works over standard HTTP/2 and HTTP/3, meaning it effortlessly navigates enterprise firewalls and corporate proxies.',
      'SSE is text-only (UTF-8) and unidirectional (server to client). Ideal for LLM AI token streaming (ChatGPT-style).',
      'WebSockets support binary formats (ArrayBuffer, Blob) in both directions. Ideal for multiplayer games and collaborative whiteboards.',
    ],
    whenToUseLeft: [
      'CRUD operations, resource mutations, user management, standard web forms.',
      'High-caching environments where CDN HTTP edge caching delivers instant responses.',
      'Mobile client applications where maintaining open TCP connections drains battery life.',
    ],
    whenToUseRight: [
      'WebSockets: Multiplayer games, trading terminals, live collaborative drawing (Figma-style), peer chat apps.',
      'Server-Sent Events: AI LLM response streaming, live sports ticker updates, stock price tickers, push notification alerts.',
    ],
    performanceConsiderations: 'WebSockets tie up server connection sockets (file descriptors). Maintaining 100,000 concurrent WebSockets requires distributed connection brokers (Redis PubSub, Socket.io clustering). For unidirectional feeds, SSE over HTTP/2 multiplexes multiple streams across a single TCP socket.',
    seniorInterviewInsight: 'When asked how to stream ChatGPT responses, junior developers propose WebSockets. Senior engineers recommend Server-Sent Events (SSE) because token generation is strictly server-to-client, supports built-in browser EventSource reconnection, and works through HTTP/2 multiplexing with zero custom protocol overhead.',
    leftCode: {
      language: 'javascript',
      snippet: `// REST: Client polls or fetches explicitly
const response = await fetch('/api/notifications');
const data = await response.json();`,
    },
    rightCode: {
      language: 'javascript',
      snippet: `// Server-Sent Events (SSE): Native browser auto-streaming
const eventSource = new EventSource('/api/ai/stream');
eventSource.onmessage = (event) => {
  appendTokenToUi(event.data);
};`,
    },
    interviewQuestions: [
      {
        question: 'Why is Server-Sent Events (SSE) preferred over WebSockets for AI LLM streaming (like ChatGPT)?',
        quickAnswer: 'Because LLM text generation is strictly unidirectional (server-to-client). SSE uses standard HTTP without custom connection protocols, supports native browser automatic reconnection, and bypasses proxy/firewall blockages.',
        seniorAnswer: 'WebSockets introduce operational complexity: sticky sessions, custom ping/pong heartbeats, and non-HTTP protocol traversal. SSE runs over existing HTTP/2 infrastructure, benefits from HTTP compression and auth headers, and includes built-in retry handling with Last-Event-ID.',
      },
    ],
  },
];
