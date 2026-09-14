import type { SubjectId } from '../types/docs.types';

export type DiagramCategory = 'event-loop' | 'react-fiber' | 'critical-rendering-path' | 'state-data-flow';

export interface DiagramStep {
  stepNumber: number;
  title: string;
  description: string;
  callStack?: string[];
  microtasks?: string[];
  macrotasks?: string[];
  webApis?: string[];
  renderQueue?: string[];
  consoleLogs?: string[];
  activePhase?: string;
  activeNodes?: string[];
  highlightData?: Record<string, any>;
}

export interface ArchitectureDiagram {
  id: DiagramCategory;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  relatedSubjectId: SubjectId;
  relatedTopicId: string;
  summary: string;
  codeSnippet?: string;
  seniorExplanation: {
    in60Seconds: string;
    interviewWatchouts: string[];
    staffTakeaways: string[];
  };
  steps: DiagramStep[];
}

export const ARCHITECTURE_DIAGRAMS: Record<DiagramCategory, ArchitectureDiagram> = {
  'event-loop': {
    id: 'event-loop',
    title: 'V8 Event Loop & Concurrency Model',
    subtitle: 'Call Stack, Microtasks, Macrotasks, Web APIs, and Render Steps',
    icon: '⚡',
    badge: 'Core JavaScript Engine',
    relatedSubjectId: 'javascript',
    relatedTopicId: 'js-event-loop',
    summary: 'The JavaScript runtime is single-threaded, using an event loop to coordinate synchronous call stack frames, asynchronous Web API callbacks, high-priority microtasks (Promises), macrotasks (Timers), and the browser rendering pipeline.',
    codeSnippet: `console.log('1: Sync Start');

setTimeout(() => {
  console.log('2: Macrotask (setTimeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Microtask (Promise)');
});

queueMicrotask(() => {
  console.log('4: queueMicrotask');
});

requestAnimationFrame(() => {
  console.log('5: Render (rAF)');
});

console.log('6: Sync End');`,
    seniorExplanation: {
      in60Seconds: 'JavaScript executes on a single main thread. Synchronous code executes immediately on the Call Stack. When an async API like setTimeout or fetch is invoked, work is delegated to browser background threads (Web APIs). When completed, callbacks enter queues. The Event Loop prioritizes the Call Stack first: once empty, it drains the ENTIRE Microtask queue (Promises, queueMicrotask, MutationObserver) to exhaustion before executing exactly ONE Macrotask from the task queue. Between macrotasks, the browser can execute the Render pipeline (requestAnimationFrame, style recalc, layout, paint).',
      interviewWatchouts: [
        'A microtask that recursively queues other microtasks will completely starve the Event Loop, freezing UI rendering and macrotasks.',
        'setTimeout(..., 0) has a minimum HTML spec clamp of ~4ms after 5 nested calls, whereas Promise.then resolves in the immediate next microtask turn.',
        'requestAnimationFrame runs right BEFORE the browser style calculation and layout pass, not on the standard macrotask queue.',
      ],
      staffTakeaways: [
        'Use queueMicrotask for high-priority state batches that must settle before UI paint without yielding to timer queues.',
        'Heavy computational loops must be chunked with scheduler.yield() or offloaded to Web Workers to keep INP (Interaction to Next Paint) under 200ms.',
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Initial Script Enters Call Stack',
        description: 'Global execution context is created and pushed onto the Call Stack. console.log("1: Sync Start") executes synchronously.',
        callStack: ['global()', 'console.log("1: Sync Start")'],
        microtasks: [],
        macrotasks: [],
        webApis: [],
        renderQueue: [],
        consoleLogs: ['1: Sync Start'],
        activePhase: 'Synchronous Execution',
      },
      {
        stepNumber: 2,
        title: 'setTimeout Dispatched to Web APIs',
        description: 'setTimeout is called with a 0ms delay. The V8 engine hands the timer off to the browser Web API thread pool.',
        callStack: ['global()', 'setTimeout(cb, 0)'],
        microtasks: [],
        macrotasks: [],
        webApis: ['Timer Thread (0ms)'],
        renderQueue: [],
        consoleLogs: ['1: Sync Start'],
        activePhase: 'Web API Delegation',
      },
      {
        stepNumber: 3,
        title: 'Promise.resolve Queues Microtask',
        description: 'Promise is immediately resolved. Its .then() callback is enqueued directly into the high-priority Microtask Queue.',
        callStack: ['global()', 'Promise.resolve().then()'],
        microtasks: ['Promise.then() callback'],
        macrotasks: ['setTimeout callback (Timer elapsed)'],
        webApis: [],
        renderQueue: [],
        consoleLogs: ['1: Sync Start'],
        activePhase: 'Microtask Enqueuing',
      },
      {
        stepNumber: 4,
        title: 'queueMicrotask Appends to Microtasks',
        description: 'queueMicrotask callback is scheduled at the tail of the current microtask turn. requestAnimationFrame is registered with the Compositor.',
        callStack: ['global()', 'queueMicrotask()', 'requestAnimationFrame()'],
        microtasks: ['Promise.then() callback', 'queueMicrotask callback'],
        macrotasks: ['setTimeout callback'],
        webApis: [],
        renderQueue: ['rAF animation callback'],
        consoleLogs: ['1: Sync Start'],
        activePhase: 'Queue Scheduling',
      },
      {
        stepNumber: 5,
        title: 'Sync Execution Finishes',
        description: 'console.log("6: Sync End") runs and the global() script frame pops off the Call Stack. The stack is now empty!',
        callStack: ['console.log("6: Sync End")'],
        microtasks: ['Promise.then() callback', 'queueMicrotask callback'],
        macrotasks: ['setTimeout callback'],
        webApis: [],
        renderQueue: ['rAF animation callback'],
        consoleLogs: ['1: Sync Start', '6: Sync End'],
        activePhase: 'Stack Emptied',
      },
      {
        stepNumber: 6,
        title: 'Event Loop Drains Microtasks',
        description: 'Because the stack is empty, the Event Loop drains ALL microtasks before touching macrotasks: "3: Microtask" then "4: queueMicrotask" execute.',
        callStack: ['microtask: Promise.then', 'microtask: queueMicrotask'],
        microtasks: [],
        macrotasks: ['setTimeout callback'],
        webApis: [],
        renderQueue: ['rAF animation callback'],
        consoleLogs: ['1: Sync Start', '6: Sync End', '3: Microtask (Promise)', '4: queueMicrotask'],
        activePhase: 'Microtask Drain',
      },
      {
        stepNumber: 7,
        title: 'Render Phase Executes rAF',
        description: 'Before the next macrotask, the browser checks if a frame is due (60Hz/120Hz). requestAnimationFrame runs right before style recalc and layout.',
        callStack: ['rAF callback'],
        microtasks: [],
        macrotasks: ['setTimeout callback'],
        webApis: [],
        renderQueue: [],
        consoleLogs: ['1: Sync Start', '6: Sync End', '3: Microtask (Promise)', '4: queueMicrotask', '5: Render (rAF)'],
        activePhase: 'Browser Render Pass',
      },
      {
        stepNumber: 8,
        title: 'Event Loop Pops Macrotask',
        description: 'The Event Loop finally pulls one macrotask from the Task Queue: setTimeout callback executes, logging "2: Macrotask". Complete!',
        callStack: ['setTimeout callback', 'console.log("2: Macrotask")'],
        microtasks: [],
        macrotasks: [],
        webApis: [],
        renderQueue: [],
        consoleLogs: ['1: Sync Start', '6: Sync End', '3: Microtask (Promise)', '4: queueMicrotask', '5: Render (rAF)', '2: Macrotask (setTimeout)'],
        activePhase: 'Macrotask Execution',
      },
    ],
  },

  'react-fiber': {
    id: 'react-fiber',
    title: 'React 19 Fiber & Double Buffering Engine',
    subtitle: 'Current Tree vs. Work-In-Progress (WIP) Tree, Concurrency Lanes, and Commit Phase',
    icon: '⚛️',
    badge: 'React Internal Architecture',
    relatedSubjectId: 'react',
    relatedTopicId: 'react-fiber-reconciliation',
    summary: 'React 19 uses a double-buffered singly linked tree of Fiber nodes. Work is split into an interruptible, concurrent Render Phase that builds a Work-In-Progress tree, and a synchronous Commit Phase that mutates the real DOM in one atomic operation.',
    codeSnippet: `// Fiber Node Structure Representation
interface Fiber {
  tag: WorkTag;              // FunctionComponent, HostRoot, etc.
  key: null | string;
  elementType: any;
  type: any;
  stateNode: any;            // Real DOM element reference
  return: Fiber | null;      // Parent pointer
  child: Fiber | null;       // First child pointer
  sibling: Fiber | null;     // Next sibling pointer
  memoizedProps: any;
  memoizedState: any;        // Hooks linked list
  lanes: Lanes;              // Concurrent priority bitmask
  alternate: Fiber | null;   // Double-buffering mirror pointer
  flags: Flags;              // Placement, Update, Deletion
}`,
    seniorExplanation: {
      in60Seconds: 'React Fiber replaced the old recursive Stack Reconciler with an asynchronous, linked-list tree. Each React Element maps to a Fiber node containing child, sibling, and return pointers. React maintains two trees simultaneously: the "Current Tree" (what is currently rendered on screen) and the "Work-in-Progress (WIP) Tree" (what is being computed in memory). During the Render Phase, React walks the tree in a cooperative work loop, yielding to the browser via MessageChannel if time expires. If higher-priority input arrives, React discards or pauses the WIP tree. Once complete, the Commit Phase runs synchronously, applying all DOM mutations and swapping the root pointer (current = wip).',
      interviewWatchouts: [
        'The Render Phase can run multiple times or be discarded in Concurrent Mode; never place side effects in render bodies!',
        'The Commit Phase is always synchronous and uninterruptible to prevent visual tearing or inconsistent UI states.',
        'The "alternate" pointer links each Current fiber to its WIP counterpart, eliminating garbage collection churn by recycling node instances.',
      ],
      staffTakeaways: [
        'Double buffering enables zero-flicker transitions and allows React 19 Actions/Suspense to prepare entire subtrees in memory before showing them.',
        'Fiber lane priority uses 31-bit bitmasks to prioritize Urgent Lanes (clicks, typing) over Transition Lanes (tab switching, data queries).',
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Idle State: Current Tree Active',
        description: 'The browser displays the Current Fiber tree: Root -> App -> Navigation & Content. The alternate pointers are idle.',
        activePhase: 'Idle (Screen Rendered)',
        activeNodes: ['Root (Current)', 'App', 'Nav', 'Content'],
        highlightData: {
          currentTree: ['Root', 'App', 'Nav', 'Content'],
          wipTree: [],
          fiberPointers: 'alternate: null',
        },
      },
      {
        stepNumber: 2,
        title: 'State Update Dispatched (Transition Lane)',
        description: 'A state change is triggered in Content (e.g. tab switch). React marks lanes on the Content fiber and schedules work.',
        activePhase: 'Work Scheduled',
        activeNodes: ['Content (Dirty - Lane: Transition)'],
        highlightData: {
          currentTree: ['Root', 'App', 'Nav', 'Content [Update Pending]'],
          wipTree: [],
          fiberPointers: 'lanes: 0b0000000000000000000000010000000 (Transition)',
        },
      },
      {
        stepNumber: 3,
        title: 'Render Phase Begins: Clone Root to WIP Tree',
        description: 'React creates the Work-in-Progress (WIP) tree starting at HostRoot, setting root.alternate = wipRoot. Double buffering initiated.',
        activePhase: 'Render Phase (Concurrent / Interruptible)',
        activeNodes: ['Root (Current) ↔ Root (WIP)'],
        highlightData: {
          currentTree: ['Root', 'App', 'Nav', 'Content'],
          wipTree: ['Root (WIP)'],
          fiberPointers: 'alternate links Current and WIP',
        },
      },
      {
        stepNumber: 4,
        title: 'Reconciliation Work Loop Descends Child Pointers',
        description: 'performUnitOfWork reconciles App and Nav. Because Nav props did not change, React reuses its current fiber without re-rendering.',
        activePhase: 'Bailout Optimization',
        activeNodes: ['App (WIP)', 'Nav (Bailed out - Clone reused)'],
        highlightData: {
          currentTree: ['Root', 'App', 'Nav', 'Content'],
          wipTree: ['Root (WIP)', 'App (WIP)', 'Nav (Reused)'],
          fiberPointers: 'child pointer traversal',
        },
      },
      {
        stepNumber: 5,
        title: 'Content Fiber Computes New Hooks & Effects',
        description: 'Content component executes. New state is calculated. React flags Content (WIP) with "Update | Placement" effect flags.',
        activePhase: 'Diffing & Flagging',
        activeNodes: ['Content (WIP) [flags: Update]'],
        highlightData: {
          currentTree: ['Root', 'App', 'Nav', 'Content (Old State)'],
          wipTree: ['Root (WIP)', 'App (WIP)', 'Nav (Reused)', 'Content (New State, flags: 0x04)'],
          fiberPointers: 'sibling and return pointers linked',
        },
      },
      {
        stepNumber: 6,
        title: 'Commit Phase (Before Mutation & Mutation)',
        description: 'Render phase completes. Commit Phase starts synchronously: DOM mutations applied atomically. No visual tearing!',
        activePhase: 'Commit Phase (Synchronous & Atomic)',
        activeNodes: ['DOM Mutation: update text & classes on DOMNode'],
        highlightData: {
          currentTree: ['Old DOM Tree on Screen'],
          wipTree: ['Applying DOM mutations...'],
          fiberPointers: 'Mutation pass executing',
        },
      },
      {
        stepNumber: 7,
        title: 'Double Buffering Pointer Swap',
        description: 'React swaps the root pointer: hostRoot.current = wipRoot. The WIP tree is now the Current Tree! The old tree becomes the next buffer.',
        activePhase: 'Complete (Tree Swapped)',
        activeNodes: ['Root (Current = New State)'],
        highlightData: {
          currentTree: ['Root', 'App', 'Nav', 'Content (Updated)'],
          wipTree: ['Recycled for next update'],
          fiberPointers: 'Pointer swap: O(1) instantaneous swap',
        },
      },
    ],
  },

  'critical-rendering-path': {
    id: 'critical-rendering-path',
    title: 'Browser Critical Rendering Path (CRP) & Paint Engine',
    subtitle: 'From Network Bytes to Pixels on Screen: DOM, CSSOM, Render Tree, Layout, Paint, and GPU Compositing',
    icon: '🎨',
    badge: 'Browser Performance & Vitals',
    relatedSubjectId: 'web-performance',
    relatedTopicId: 'critical-rendering-path',
    summary: 'The Critical Rendering Path is the exact sequence of steps the browser executes to convert HTML, CSS, and JavaScript into pixels on screen. Understanding this pipeline is the foundation of optimizing Core Web Vitals (LCP, INP, CLS).',
    codeSnippet: `/* CSS Properties That Bypass Layout & Paint */
.gpu-accelerated-modal {
  /* Fast: Compositor Thread only (No Reflow, No Repaint) */
  transform: translate3d(0, 0, 0) scale(1);
  opacity: 1;
  will-change: transform, opacity;
}

.slow-layout-thrashing {
  /* Slow: Triggers full Layout / Reflow cascade down subtree */
  top: 100px;
  width: 50%;
  padding: 20px;
}`,
    seniorExplanation: {
      in60Seconds: 'The browser Critical Rendering Path has 6 core stages: 1) HTML Parsing: Bytes -> Characters -> Tokens -> Nodes -> DOM Tree. 2) CSS Parsing: CSS Bytes -> Tokens -> Nodes -> CSSOM Tree. CSS is render-blocking. 3) Render Tree: The browser combines DOM and CSSOM, ignoring non-visual nodes like <head>, <script>, and display:none. 4) Layout (Reflow): Calculates the exact geometry, dimensions, and viewport coordinates of every box. 5) Paint (Repaint): Converts boxes into visual pixels across multiple layers (borders, colors, text, shadows). 6) Compositing: The GPU composites multiple layers together onto the screen. Animating transform or opacity runs purely on the Compositor thread, bypassing Layout and Paint entirely!',
      interviewWatchouts: [
        'Reading a layout property (e.g. offsetTop, getComputedStyle) immediately after writing a style forces Synchronous Layout Thrashing.',
        'CSS is render-blocking by default; large external stylesheets delay First Contentful Paint (FCP).',
        'visibility: hidden still participates in the Layout phase (takes up space), whereas display: none is omitted from the Render Tree completely.',
      ],
      staffTakeaways: [
        'To optimize Interaction to Next Paint (INP), ensure user interaction handlers do not trigger forced synchronous reflows or long paint queues.',
        'Reserve width/height on images and dynamic ads to prevent Cumulative Layout Shift (CLS) when assets finish loading.',
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: '1. Network Byte Stream & Tokenization',
        description: 'Browser receives raw HTML bytes over TCP socket. The tokenizer converts raw bytes into HTML tokens (StartTag, EndTag, Characters).',
        activePhase: 'HTML Parsing',
        activeNodes: ['Bytes: 3c 68 74 6d 6c 3e', 'Tokens: <html>, <body>, <div>'],
        highlightData: { stage: 'Tokenization', metric: 'TTFB (Time to First Byte)' },
      },
      {
        stepNumber: 2,
        title: '2. DOM & CSSOM Construction',
        description: 'HTML parser builds the DOM tree. Simultaneously, external <link rel="stylesheet"> files are downloaded and parsed into the CSSOM tree (render-blocking).',
        activePhase: 'Tree Construction',
        activeNodes: ['DOM Tree: document -> html -> body -> main', 'CSSOM Tree: body { margin: 0 } -> main { display: flex }'],
        highlightData: { stage: 'DOM + CSSOM', metric: 'FCP (First Contentful Paint preparation)' },
      },
      {
        stepNumber: 3,
        title: '3. Render Tree Assembly',
        description: 'Browser combines DOM and CSSOM. Nodes with display: none and <head> are filtered out. Computed styles are assigned to each visible node.',
        activePhase: 'Render Tree',
        activeNodes: ['RenderObject: body', 'RenderObject: header', 'RenderObject: card (display: none omitted)'],
        highlightData: { stage: 'Visual Filtering', metric: 'Render Tree Complete' },
      },
      {
        stepNumber: 4,
        title: '4. Layout (Reflow) Phase',
        description: 'Browser calculates box geometry: width, height, margin, padding, flex coordinates, and viewport positions for every box.',
        activePhase: 'Layout / Reflow',
        activeNodes: ['card: x=24px, y=120px, w=320px, h=180px'],
        highlightData: { stage: 'Geometry Calculation', metric: 'CLS (Cumulative Layout Shift prevention)' },
      },
      {
        stepNumber: 5,
        title: '5. Paint (Rasterization) Phase',
        description: 'RenderObjects are converted into actual screen pixels. Background colors, borders, drop shadows, and text glyphs are painted into drawing records.',
        activePhase: 'Paint & Raster',
        activeNodes: ['Draw command: fillRect(#0f172a)', 'Draw command: drawText("Welcome")'],
        highlightData: { stage: 'Rasterization', metric: 'LCP (Largest Contentful Paint triggered)' },
      },
      {
        stepNumber: 6,
        title: '6. GPU Layer Compositing',
        description: 'The browser divides the page into GPU layers. The GPU compositor arranges and draws the layers onto the display. transform and opacity animations run at 120fps!',
        activePhase: 'GPU Compositing (Hardware Accelerated)',
        activeNodes: ['GPU Layer: Root Tile', 'GPU Layer: Floating Modal (Hardware Layer)'],
        highlightData: { stage: 'Screen Display', metric: 'INP (Sub-50ms smooth responsiveness)' },
      },
    ],
  },

  'state-data-flow': {
    id: 'state-data-flow',
    title: 'Unidirectional State & Subscription Architecture',
    subtitle: 'Action Dispatch -> Middleware -> Store Mutation -> Selector Subscriptions -> Re-render',
    icon: '🔄',
    badge: 'Enterprise State Management',
    relatedSubjectId: 'redux-toolkit',
    relatedTopicId: 'rtk-data-flow',
    summary: 'Modern frontend state architecture enforces a strict unidirectional data flow. Understanding how actions propagate through middleware, update immutable store slices, and notify fine-grained selector subscribers prevents performance bottlenecks and cascading re-renders.',
    codeSnippet: `// Unidirectional Flow Contract
// 1. Component triggers Action
dispatch(cartSlice.actions.addItem({ id: 'prod_1', price: 49 }));

// 2. Middleware intercepts (logging, analytics, async side-effects)
const analyticsMiddleware: Middleware = store => next => action => {
  trackEvent(action.type);
  return next(action);
};

// 3. Reducer produces immutable next state via Immer proxy
// 4. Selector memoized with createSelector triggers ONLY affected subscriber
const selectCartTotal = createSelector(
  (state: RootState) => state.cart.items,
  items => items.reduce((sum, item) => sum + item.price, 0)
);`,
    seniorExplanation: {
      in60Seconds: 'In modern unidirectional state architectures (Redux Toolkit, Zustand), UI components never mutate state directly. Instead, components dispatch typed Actions. Actions travel through a chain of Middlewares (intercepting for logging, error tracking, or asynchronous API calls like RTK Query / Thunks). The root Reducer computes the next immutable state tree (powered by Immer in modern setups). Once the store state updates, the Store notifies subscriber listeners. Components connected via memoized Selectors (e.g. useSelector or useStore) perform equality checks (Object.is); if and only if their selected derived data changed, that specific component re-renders, preventing subtree re-render cascades.',
      interviewWatchouts: [
        'Returning a new object reference in a selector (e.g. state.items.filter(...)) on every tick bypasses equality checks and causes infinite/unwanted re-renders.',
        'React Context triggers re-renders on ALL consumers when any property changes, whereas fine-grained store selectors subscribe only to specific atomic state slices.',
        'Middleware wraps the dispatch function in an onion-like pipeline, executing before and after the reducer runs.',
      ],
      staffTakeaways: [
        'Keep server cache state (TanStack Query, RTK Query) completely decoupled from client interactive state (Zustand, Redux).',
        'Use selector composition (createSelector) to prevent expensive derived computations (sorting, filtering 10,000 items) from running on irrelevant actions.',
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: '1. UI Interaction & Action Dispatch',
        description: 'User clicks "Add to Cart" in ProductCard. Component calls dispatch(addItem({ id: "prod_1", price: 49 })). Action payload is created.',
        activePhase: 'Action Dispatched',
        activeNodes: ['ProductCard Component', 'Action: cart/addItem'],
        highlightData: { stage: 'Dispatch', payload: '{ id: "prod_1", price: 49 }' },
      },
      {
        stepNumber: 2,
        title: '2. Middleware Pipeline Interception',
        description: 'The Action passes through middleware chain (Crash Reporter -> Analytics -> Thunk/Async Handler). Middleware can inspect or delay the action.',
        activePhase: 'Middleware Processing',
        activeNodes: ['Analytics Middleware (Logged Event)', 'Thunk Middleware'],
        highlightData: { stage: 'Middleware', status: 'Passed to next(action)' },
      },
      {
        stepNumber: 3,
        title: '3. Reducer Computes Immutable Next State',
        description: 'cartReducer receives current state and action. Using Immer proxies, it drafts the update and produces an immutable new state snapshot.',
        activePhase: 'Reducer Pure Function',
        activeNodes: ['cartReducer', 'Previous State: { count: 0 }', 'Next State: { count: 1 }'],
        highlightData: { stage: 'Immutable Mutation', status: 'State Tree Updated' },
      },
      {
        stepNumber: 4,
        title: '4. Store Notifies Selector Subscribers',
        description: 'The Redux/Zustand Store calls subscriber listeners. Each component with a selector runs its equality check.',
        activePhase: 'Subscription Notification',
        activeNodes: ['CartBadge Selector (Changed: 0 -> 1)', 'UserProfile Selector (Unchanged -> Bailed out)'],
        highlightData: { stage: 'Memoized Equality Check', status: 'CartBadge matched dirty' },
      },
      {
        stepNumber: 5,
        title: '5. Targeted Component Re-render',
        description: 'Only CartBadge re-renders with the new count. The rest of the page (Catalog, Navigation, Feed) avoids re-rendering entirely!',
        activePhase: 'Surgical Re-render Complete',
        activeNodes: ['CartBadge (Re-rendered: Badge: "1")', 'Other 50 components (Skipped)'],
        highlightData: { stage: 'Zero Overhead', status: 'Clean Unidirectional Cycle Complete' },
      },
    ],
  },
};
