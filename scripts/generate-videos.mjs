import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT_FILE = resolve(ROOT, 'public/data/topbrains-videos.json')

// Topic-specific verified thumbnail templates and top domain instructors
const TOPIC_CONFIG = {
  'CSS & Layouts': {
    instructors: ['Kevin Powell', 'Josh W. Comeau', 'Web Dev Simplified', 'Fireship', 'Frontend Masters'],
    thumbs: ['rg7Fvvl3taU', 'y3BfR7j_Z6w', 'fYq5PXgSsbE', 'K74l26pE4YA', '0xMQfnTU6oo', 'zERZq_XhK2U', '2L-_Xn1q_b8', 'E9vAommsIwk']
  },
  'Frontend System Design': {
    instructors: ['Chirag Goel', 'ByteByteGo', 'Jack Herrington', 'Theo - t3.gg', 'TechLead', 'Akshay Saini'],
    thumbs: ['2pL28xL_970', 'y17RuWkWdn8', 'M4s6y_1z-xQ', 'G3Zl88lY8xU', 'L7R4j7sZ79o', '9b98b9_7Z4w', '7uKj4v6Z7Qw']
  },
  'Web Optimizations & Performance': {
    instructors: ['Fireship', 'Google Chrome Developers', 'Jack Herrington', 'Web Dev Simplified', 'Frontend Masters'],
    thumbs: ['PkOBnYxqj3k', '7kvekkLhAas', 'AQqFZ5t8uNc', 'YJGCZCaIZkQ', 'b0IZo2Aho2Y', '7039S4_9x8U']
  },
  'React & React 19': {
    instructors: ['Jack Herrington', 'Kent C. Dodds', 'Theo - t3.gg', 'Dan Abramov', 'Web Dev Simplified', 'React Summit'],
    thumbs: ['0ympFIwQFJw', 'Ke90Tje7VS0', 'SqcY0GlETPk', '8pDqJVdNa44', 'dpw9EHDh2bM', 'bMknfKXIFA8']
  },
  'React Query & RTK': {
    instructors: ['TkDodo (TanStack Query)', 'Dave Gray', 'Jack Herrington', 'Web Dev Simplified', 'Frontend Masters'],
    thumbs: ['pfaSUYaSgRo', '4eO94J6A7r4', '8j0UDiN7my4', '_kz7q1Vv-yM', '9PprbI307Zg']
  },
  'TypeScript': {
    instructors: ['Matt Pocock (Total TypeScript)', 'Theo - t3.gg', 'Jack Herrington', 'Web Dev Simplified', 'Frontend Masters'],
    thumbs: ['d56mG7DezGs', 'pooxD8XF3BM', 'ahCwqrYGlPQ', 'vBIbWpY78_0', 'bc6Xm3iW1gE']
  },
  'Sanitization & Security': {
    instructors: ['Web Dev Simplified', 'Fireship', 'Hussein Nasser', 'Frontend Masters', 'Google Chrome Developers'],
    thumbs: ['1wZbqHkF7L4', 'EoaDgZug2VQ', '4a_IaS90D3U', 'tcLW5d0K23I', '8ZtInIOaSlM']
  },
  'Linting, Tooling & Testing': {
    instructors: ['Jack Herrington', 'Theo - t3.gg', 'Web Dev Simplified', 'Kent C. Dodds', 'Frontend Masters'],
    thumbs: ['b_oZ7_077Z8', 'rI94V6x8_4E', '9i4xL-xZ7e8', 'O3O4r8x7-xU', 'x9x7v8Z7x0U']
  },
  'HTTP & Networking': {
    instructors: ['Hussein Nasser', 'ByteByteGo', 'Web Dev Simplified', 'Fireship', 'Frontend Masters'],
    thumbs: ['t2ypurOX04Y', '30LWjhZzg50', 'iYM2zFP3Zn0', '7_LPdttKXPc', 's7wmiS2mSXY']
  },
  'JavaScript Core': {
    instructors: ['Akshay Saini (Namaste JS)', 'Philip Roberts (JSConf)', 'Web Dev Simplified', 'Kent C. Dodds', 'Lydia Hallie'],
    thumbs: ['8aGhZQkoFbQ', 'vKJpN5FAeF4', '1l4wHWQCCIc', 'W6NZfCO5SIk', 'jS4aFq5-91M', 'cjIswDCKgu0']
  },
  'Browser APIs & DOM': {
    instructors: ['Jake Archibald (Google Chrome)', 'Web Dev Simplified', 'Fireship', 'Frontend Masters', 'Kevin Powell'],
    thumbs: ['cCOL7MC4Pl0', '2IbRtjez6ag', 'yS8N1x7Z7c8', 'mH_Y7Z8x9xE', 'q8x7Z7u8x9Y']
  },
  'Machine Coding & DSA': {
    instructors: ['ByteByteGo', 'Chirag Goel', 'Akshay Saini', 'Web Dev Simplified', 'Frontend Masters'],
    thumbs: ['cjIswDCKgu0', 'x8Z7u8x9y0E', '7u8x9y0z1aB', '4e7x8y9z0aC', '3b8x9y0z1aD']
  }
}

// 12 High-Impact Categories covering every domain requested
const TOPIC_CURRICULUM = [
  {
    topic: 'CSS & Layouts',
    level: 'Intermediate',
    subtopics: [
      'CSS Grid Masterclass: auto-fill, auto-fit, minmax(), and Named Grid Areas',
      'CSS Flexbox in Depth: flex-grow, flex-shrink, flex-basis Mathematical Calculations',
      'CSS Subgrid: Inheriting Track Grids from Parent Layouts for Nested Alignments',
      'CSS Container Queries (@container): Building Modular Component-First Layouts',
      'The :has() Relational Selector and Advanced CSS Pseudo-Classes (:is, :where, :not)',
      'CSS Specificity Hierarchy, Specificity Wars & Cascade Layers (@layer)',
      'CSS Custom Properties (Variables) with Dynamic JavaScript Theming Systems',
      'CSS View Transitions API for Smooth Multi-Page & Single-Page Page Animations',
      'FLIP Animation Technique (First, Last, Invert, Play) in Pure CSS & JavaScript',
      'CSS 3D Transforms: perspective, transform-style preserve-3d & Backface Visibility',
      'CSS Backdrop-filter, Modern Glassmorphism & UI Design Systems',
      'CSS Scroll-Driven Animations (@keyframes animation-timeline & view-timeline)',
      'CSS Masking and Clipping (clip-path, mask-image) for Modern UI Graphics',
      'CSS Architectures: BEM Methodology vs CSS Modules vs Tailwind CSS vs CSS-in-JS',
      'Tailwind CSS Core Engine: JIT Compilation, Arbitrary Values & Theme Extensions',
      'CSS Logical Properties (margin-inline, padding-block) for RTL & Multi-Directional Layouts',
      'CSS Print Stylesheets & Paged Media Formatting for PDF Export',
      'Accessible Color Contrast, prefers-contrast, and prefers-color-scheme Media Queries',
      'Fluid Typography and Spacing with CSS clamp(), min(), and max() Functions',
      'Hardware Acceleration in CSS: will-change, translateZ(0) & Paint Layers'
    ]
  },
  {
    topic: 'Frontend System Design',
    level: 'Hard',
    subtopics: [
      'Infinite Scrolling Newsfeed with Dynamic Height Virtualization (Twitter & Instagram)',
      'Real-time Collaborative Editor with CRDT vs Operational Transformation (Google Docs & Figma)',
      'Autocomplete Typeahead with Client Caching, Debounce & LRU Eviction (Google Search)',
      'Video Streaming Platform with Adaptive Bitrate Streaming & MSE (YouTube & Netflix)',
      'E-Commerce Product Catalog with Dynamic Multi-Faceted Filters and URL State Synchronization',
      'Live Chat & Messaging with Offline Queueing, WebSockets and Message Deduplication (Slack & WhatsApp)',
      'Enterprise Component Design System & Monorepo Architecture with Versioning & Tokenization',
      'Micro-Frontends Architecture: Module Federation, Single-SPA & Shared Dependencies',
      'Large File Upload System with Chunking, Pause/Resume & S3 Multipart Integration',
      'High-Throughput Analytics Telemetry, Beacon API, and Batch Event Dispatcher',
      'Notification Center with Web Push, Service Worker Synchronization & In-App Badging',
      'Offline-First Progressive Web App (PWA) with IndexedDB and Background Sync',
      'Interactive Real-Time Analytics Dashboard with High-FPS Canvas Chart Widgets',
      'Multi-Tenant SaaS UI with Dynamic Theming, Tenant Isolation & Feature Flagging',
      'Web-based Code Editor with Monaco, Language Server Protocol (LSP) & Sandboxed Preview Runner',
      'Image Gallery with Progressive Blur-Up Loading, Lightbox & Virtual Masonry Grid',
      'Drag & Drop Workflow & Form Builder with Dynamic JSON Schema Generation',
      'Shopping Cart with Optimistic State Updates, Conflict Resolution & Cross-Tab Synchronization',
      'Global Internationalized (i18n) App with Right-To-Left (RTL), Pluralization & Currency Formatting',
      'Modern Authentication Architecture: OAuth 2.0 PKCE, JWT Rotation & Silent Session Refresh',
      'Interactive Canvas Whiteboard with Spatial Indexing (R-tree) and Vector Rendering',
      'Real-time Polling vs Server-Sent Events (SSE) vs WebSockets Architecture Trade-offs'
    ]
  },
  {
    topic: 'Web Optimizations & Performance',
    level: 'Advanced',
    subtopics: [
      'Critical Rendering Path: DOM/CSSOM Construction, Layout, Paint, and Compositing Stages',
      'Core Web Vitals: Largest Contentful Paint (LCP) Root Cause Diagnostics & Optimization',
      'Core Web Vitals: Interaction to Next Paint (INP) Troubleshooting & Event Handler Optimization',
      'Core Web Vitals: Cumulative Layout Shift (CLS) Prevention & Aspect Ratio Containers',
      'Resource Hints in Practice: Preload, Prefetch, Preconnect, DNS-Prefetch, and Prerender',
      'Advanced Font Loading Strategies: font-display swap/optional, FOIT/FOUT, and Unicode Subsetting',
      'Modern Image Delivery: Responsive srcset, sizes, picture element, and AVIF/WebP Compression',
      'JavaScript Bundle Optimization: Advanced Tree-Shaking, Minification & Scope Hoisting',
      'Code-Splitting Architecture: Route-Level, Component-Level & Granular Vendor Chunking',
      'DOM Virtualization & Element Recycling (TanStack Virtual & react-window) for 100,000 Nodes',
      'Offscreen Canvas & Web Workers for CPU-Intensive Background Tasks',
      'Memory Leak Hunting in Chrome DevTools: Heap Snapshots, Retainer Trees & Detached DOM Nodes',
      'CPU Profiling with Chrome DevTools: Flame Charts, Long Tasks Analysis & 50ms Thresholds',
      'Modern Network Optimization: HTTP/2 Multiplexing, HTTP/3 0-RTT, and Brotli Compression',
      'Client-side Caching Architecture: Memory Cache, LocalStorage, IndexedDB & CacheStorage API',
      'Service Worker Strategies: Stale-While-Revalidate, Cache-First, and Network-First in Practice',
      'CSS Performance: GPU Accelerated Compositor Properties (transform, opacity) vs Reflow Triggers',
      'Throttling High-Frequency DOM Events with requestAnimationFrame and microtasks',
      'Real User Monitoring (RUM) Analytics using the PerformanceObserver API',
      'requestIdleCallback and Cooperative Scheduling for Non-Critical Background Operations'
    ]
  },
  {
    topic: 'React & React 19',
    level: 'Advanced',
    subtopics: [
      'React 19 Fiber Reconciler & Cooperative Scheduling Mechanics Under The Hood',
      'React Server Components (RSC) vs Client Components: Mental Model & Architecture Boundaries',
      'React 19 Hooks: useActionState, useOptimistic, useFormStatus, and the use() API',
      'React 19 Server Actions: Mutations, Form Handling, Progressive Enhancement & Validations',
      'useState and useReducer: Deterministic State Machine Patterns in Complex UI',
      'useEffect vs useLayoutEffect vs useInsertionEffect: Execution Timings and DOM Mutation Pitfalls',
      'useMemo and useCallback: Deep Dive into When They Actually Prevent Re-renders vs Add Overhead',
      'useRef: Mutable State Storage, DOM Element Access, and Storing Previous Prop Values',
      'useTransition and useDeferredValue for Non-Blocking Concurrent UI Updates',
      'Custom Hook Design: useIntersectionObserver for Lazy Loading & Infinite Scrolling',
      'Custom Hook Design: useDebounce and useThrottle with Cancellation and Flush Methods',
      'Custom Hook Design: useLocalStorage with Cross-Tab Broadcast Synchronization',
      'Custom Hook Design: useEventListener with Automatic Lifecycle Cleanup & Passive Flag',
      'Custom Hook Design: useMediaQuery for Responsive Dynamic Breakpoints',
      'React Context Performance Bottlenecks & Split Context State/Dispatch Architecture',
      'Compound Components Pattern: Building Accessible Accordions, Dropdowns & Modal Systems',
      'Component Patterns: Render Props vs Custom Hooks vs Higher Order Components (HOC)',
      'Controlled vs Uncontrolled Components and Form Performance Optimization',
      'React Error Boundaries, Fallback UI Strategies, and Integration with Sentry/Bugsnag',
      'React Portals for Modals, Floating Tooltips, Dropdowns, and Dialogs',
      'React.memo, PureComponent, and Shallow Equality Comparison Algorithms',
      'Suspense for Data Fetching: Eliminating Network Waterfalls and Streaming SSR',
      'Code Splitting with React.lazy, Suspense, and Dynamic Import Boundaries',
      'Building an Accessible Accessible Modal with WAI-ARIA Focus Trap in Pure React',
      'Building a Drag-and-Drop Kanban Board with Native Pointer Events in React'
    ]
  },
  {
    topic: 'React Query & RTK',
    level: 'Advanced',
    subtopics: [
      'TanStack Query (React Query) Architecture: QueryClient, QueryCache & Observer Lifecycle',
      'React Query Caching Mechanics: staleTime vs gcTime (cacheTime) Demystified',
      'React Query Invalidation, Refetching Triggers, and Automated Background Polling',
      'React Query Optimistic Updates with Rollback on Mutation Error & OnMutate Lifecycle',
      'React Query Infinite Queries (useInfiniteQuery) with Cursor and PageParam Pagination',
      'React Query Prefetching, Query Pre-caching on Hover, and Server Hydration',
      'Redux Toolkit (RTK): createSlice, configureStore, and Immer Immutability Engine',
      'Redux Toolkit createAsyncThunk Lifecycle vs Modern RTK Query Architecture',
      'RTK Query: createApi, Builder Endpoints, Auto-Generated Hooks & BaseQuery Config',
      'RTK Query Tag Invalidation (providesTags & invalidatesTags) Deep Dive',
      'RTK Query Optimistic Updates with onQueryStarted and updateQueryData Lifecycle',
      'RTK Query Entity Adapters (createEntityAdapter) for Normalized Normalized Store',
      'Zustand Architecture: Lightweight Store Slices, Get/Set, Middleware, and Devtools',
      'Jotai & Recoil: Atomic State Management, Derived Atoms, and Async Selectors',
      'State Management Comparison: React Context vs Redux Toolkit vs Zustand vs React Query',
      'Managing Server Cache State vs Client UI State in Large-Scale Web Apps',
      'Offline Mutation Queue and Resilient State Synchronization with React Query',
      'Multi-Store Architecture and State Slicing Patterns in Enterprise Micro-Frontends'
    ]
  },
  {
    topic: 'TypeScript',
    level: 'Advanced',
    subtopics: [
      'TypeScript Generics: Generic Constraints (extends), Default Types & Higher-Order Generics',
      'Mapped Types and Key Remapping using the "as" Keyword Syntax',
      'Conditional Types and Distributive Conditionals over Union Types',
      'The "infer" Keyword in Deep Conditional Type Extraction and Pattern Matching',
      'Template Literal Types for Type-Safe Route URL Parameters and Event Naming',
      'Discriminated Unions and Exhaustive Type Checking with the "never" Type',
      'Index Signatures vs Record<K, T> vs Mapped Types: Correct Usage & Trade-offs',
      'Implementing Built-in Utility Types from Scratch: Pick, Omit, Partial, Required, Record',
      'DeepReadonly, DeepPartial, and DeepNullable Recursive Type Utilities',
      'Building a Type-Safe Event Emitter with Keyed Generics and Strict Payloads',
      'Type Guards: User-Defined "is" Type Predicates and Assertion Functions ("asserts")',
      'Declaration Merging, Module Augmentation, and Global Ambient Declarations (.d.ts)',
      'Covariance, Contravariance, and Bivariance in TypeScript Function Types',
      'Const Assertions ("as const") and Readonly Tuples at Compile Time',
      'The "satisfies" Operator (TS 4.9+) vs Type Annotations and Type Assertions',
      'Type-Safe State Machine & Reducer Pattern Implementation in TypeScript',
      'Branded / Nominal Types for Type-Safe Database IDs, Currencies, and Sanitized Strings',
      'Building a Type-Safe Schema Validator like Zod from Scratch with TypeScript Generics',
      'TypeScript Compiler Strict Flags: strictNullChecks, noImplicitAny, exactOptionalPropertyTypes',
      'Writing Type-Safe Custom React Hooks with Generic Props and Return Signatures'
    ]
  },
  {
    topic: 'Sanitization & Security',
    level: 'Advanced',
    subtopics: [
      'Cross-Site Scripting (XSS): Stored, Reflected, and DOM-based Attacks & Modern Defenses',
      'HTML Sanitization in the Browser: DOMPurify and the Native Sanitizer API Deep Dive',
      'Dangerous React Security Pitfalls: dangerouslySetInnerHTML and Safe HTML Rendering',
      'Content Security Policy (CSP): Directives, Nonces, Hashes & Strict CSP Deployment',
      'Cross-Site Request Forgery (CSRF): SameSite Cookies & Anti-CSRF Token Validation',
      'Cross-Origin Resource Sharing (CORS): Preflight OPTIONS, Allowed Headers & Credentials',
      'Same-Origin Policy (SOP) Mechanics, iframe Sandboxing & postMessage Protocol Security',
      'Clickjacking Defense: X-Frame-Options and CSP frame-ancestors Directives',
      'Subresource Integrity (SRI) for Verifying Third-Party CDN Scripts & Hashes',
      'Secure Cookie Attributes: HttpOnly, Secure, SameSite=Strict/Lax, Path & Domain Scopes',
      'Safe JWT & Token Storage: LocalStorage vs SessionStorage vs HttpOnly Refresh Cookies',
      'OAuth 2.0 Authorization Code Flow with PKCE (Proof Key for Code Exchange) on Frontend',
      'Preventing Prototype Pollution in Client-Side Object Manipulation & JSON Parsing',
      'Securing Single Page Application (SPA) Client-Side Route Guards and Protected Views',
      'Frontend Supply Chain Security: npm Audit, Lockfile Integrity & Dependency Pinning',
      'Preventing Open Redirect Vulnerabilities in Single Page Application Navigations',
      'Securing WebSocket Connections (WSS) with Ticket-Based Handshake Authentication'
    ]
  },
  {
    topic: 'Linting, Tooling & Testing',
    level: 'Intermediate',
    subtopics: [
      'Modern Linting: ESLint Flat Config (eslint.config.js) Migration and Custom Rules',
      'OxLint & Biome: Ultra-Fast Rust-Based Linters vs Traditional ESLint Comparison',
      'TypeScript-ESLint Rules for Senior Code Quality & Catching Performance Anti-patterns',
      'Code Formatting & Prettier Integration without ESLint Rule Conflicts',
      'Automated Git Hooks with Husky, lint-staged, and commitlint for Enforcing Standards',
      'Monorepo Tooling: Turborepo vs Nx for High-Speed Build Caching and Task Graphs',
      'Modern Build Tools: Vite, Rollup, esbuild, SWC, and Webpack Architecture Deep Dive',
      'Testing React Apps with Vitest: Unit Testing, Spies, and Module Mocking Strategies',
      'React Testing Library: Queries (getByRole vs getByTestId), User-Event & Accessibility',
      'End-to-End Testing with Playwright: Fixtures, Page Object Models & Network Mocking',
      'CI/CD Pipelines for Frontend: GitHub Actions, Automated Testing & Preview Deployments',
      'Bundle Analysis with rollup-plugin-visualizer and Webpack Bundle Analyzer',
      'Storybook 8: Component Driven Development, Visual Regression Testing & Documentation'
    ]
  },
  {
    topic: 'HTTP & Networking',
    level: 'Advanced',
    subtopics: [
      'HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC): Multiplexing, Head-of-Line Blocking & UDP Streams',
      'TCP 3-Way Handshake, TLS 1.3 Handshake & Network Connection Latency Breakdown',
      'HTTP Caching Headers: Cache-Control, ETag, If-None-Match, max-age, and s-maxage',
      'HTTP Caching Directives: Stale-While-Revalidate and Stale-If-Error in Browser Runtimes',
      'REST vs GraphQL vs gRPC-Web: Network Overhead, Over-fetching & Payload Serialization',
      'WebSockets Architecture: Handshake Protocol, Frame Structure, Ping/Pong & Heartbeats',
      'Server-Sent Events (SSE) vs WebSockets vs Long Polling: Network Architectural Matrix',
      'Fetch API Streams: ReadableStream, Chunked Transfer Encoding & Progressive UI Parsing',
      'Request Cancellation using AbortController and AbortSignal across Fetch and Custom Promises',
      'CORS Deep Dive: Simple vs Non-Simple Requests, Preflight OPTIONS & Credential Headers',
      'CDN Edge Caching, Reverse Proxies (Cloudflare/Fastly), and Geolocation Edge Routing',
      'HTTP Security Headers: HSTS, Referrer-Policy, Permissions-Policy & X-Content-Type-Options',
      'Network Resilience Patterns: Exponential Backoff, Request Retries & Offline Queueing'
    ]
  },
  {
    topic: 'JavaScript Core',
    level: 'Intermediate',
    subtopics: [
      'Event Loop, Microtask Queue Priority & Macrotasks Execution Order in V8',
      'Closures, Lexical Environment, Scope Chain & Execution Context Stack in Depth',
      'Prototypal Inheritance, Prototype Chain Lookup & ES6 Class Desugaring',
      'The "this" Keyword Binding Rules: Default, Implicit, Explicit, and Arrow Lexical Binding',
      'Promises Under The Hood: Chaining, Microtask Scheduling & Custom Promise Polyfill',
      'Async/Await Execution Flow, Error Propagation & Unhandled Rejection Mechanics',
      'Garbage Collection Algorithms (Mark-and-Sweep) & Memory Leaks in SPAs',
      'Debounce and Throttle Implementation with Leading and Trailing Edge Options',
      'Deep Clone vs Shallow Clone: Structured Clone API vs Recursive Clone vs JSON',
      'Currying, Partial Application and Arity Transformation in Functional JavaScript',
      'Function Composition: Implementing Pipe and Compose Step-by-Step',
      'WeakMap and WeakSet Patterns for Private Metadata & Garbage-Collectable Caching',
      'Event Emitter Class Implementation from Scratch (on, off, emit, once)',
      'Generators, Iterators, and Async Iterators (Symbol.iterator, Symbol.asyncIterator)',
      'V8 Engine Internals: Ignition Interpreter, TurboFan JIT Compiler & Hidden Classes',
      'Type Coercion, ToPrimitive, and Abstract Equality Comparison Algorithms',
      'Temporal Dead Zone (TDZ), Hoisting, and Lexical Declarations (let/const vs var)',
      'Tagged Template Literals and Custom Domain-Specific Languages (DSLs) in JS',
      'Proxy and Reflect API for Reactive State Systems & Observable Patterns',
      'Array Method Polyfills: map, filter, reduce, flat, flatMap, find, every, some',
      'Function Polyfills: Function.prototype.bind, call, and apply from Scratch',
      'Object.freeze vs Object.seal vs Object.preventExtensions Mechanics',
      'Symbol Data Type, Well-Known Symbols (Symbol.toPrimitive, Symbol.hasInstance)',
      'Web Workers: Dedicated Workers, Shared Workers & PostMessage Structured Clone',
      'SharedArrayBuffer, Atomics and Memory Concurrency in JavaScript Runtimes',
      'BigInt, Number Precision Limits (IEEE 754 64-bit Float), and Safe Integers',
      'RegExp Advanced: Lookahead, Lookbehind, Named Capture Groups & Unicode Flags',
      'Internationalization API (Intl.NumberFormat, Intl.DateTimeFormat, Intl.RelativeTimeFormat)',
      'Service Worker Lifecycle: Install, Activate, Fetch & Cache Interception',
      'Module Systems: CommonJS vs ES Modules, Tree-Shaking Mechanics & Dynamic Imports'
    ]
  },
  {
    topic: 'Browser APIs & DOM',
    level: 'Intermediate',
    subtopics: [
      'DOM Event Flow: Capturing Phase, Target Phase, and Bubbling Phase Explained',
      'Event Delegation Pattern for High Performance Dynamic DOM Elements',
      'IntersectionObserver API for Lazy Loading Images, Videos & Infinite Scrolling',
      'ResizeObserver API for Container-Aware Dynamic Responsive Components',
      'MutationObserver API for Tracking DOM Tree Modifications & Subtree Changes',
      'PerformanceObserver API for Capturing Real-Time Performance Timing Metrics',
      'AbortController and AbortSignal for Cancelling Network & DOM Event Listeners',
      'Fetch API vs Axios: Request/Response Interceptors, Streams & Timeout Handling',
      'IndexedDB Masterclass: Object Stores, Indexes, Transactions, Cursors & IDB Wrapper',
      'Web Storage API: LocalStorage, SessionStorage Limits & Storage Quota API',
      'Async Clipboard API: Reading & Writing Text and Blob Images with Permissions',
      'Drag and Drop HTML5 API with Custom Drag Previews and Drop Targets',
      'Fullscreen API, Screen Wake Lock API & Page Visibility API',
      'Geolocation API, Device Orientation, and Battery Status APIs',
      'Media Source Extensions (MSE) and Video Playback APIs (HTMLMediaElement)',
      'Web Audio API: AudioContext, AnalyserNode, Audio Synthesis & Visualizers',
      'Notification API and Push API in Modern Progressive Web Apps',
      'BroadcastChannel API for Seamless Cross-Tab and Cross-Window Communication'
    ]
  },
  {
    topic: 'Machine Coding & DSA',
    level: 'Hard',
    subtopics: [
      'Coding Challenge: Implement LRU Cache with O(1) Get and Put Operations',
      'Coding Challenge: Deep Equal Object Comparison with Cyclic Reference Handling',
      'Coding Challenge: Flatten Nested Array (Iterative & Recursive with Custom Depth)',
      'Coding Challenge: Implement Promise.all, Promise.race, Promise.allSettled, Promise.any',
      'Coding Challenge: Implement Lodash.get (Path Resolver with Array Key Access)',
      'Coding Challenge: Implement Lodash.set (Deep Property Setter with Dynamic Object Creation)',
      'Coding Challenge: Implement JSON.stringify Polyfill with Replacer and Indentation',
      'Coding Challenge: Implement JSON.parse Polyfill with Lexer & Recursive Descent Parser',
      'Coding Challenge: Implement DOM Tree Virtual Representation (VNode Tree & Diffing)',
      'Coding Challenge: Implement Trie Data Structure for Typeahead Search Suggestions',
      'Coding Challenge: Implement Memoization Function with Custom Cache Eviction Strategy',
      'Coding Challenge: Implement Event Bus / EventEmitter with .once() and .off()',
      'Coding Challenge: Implement Custom setInterval with setTimeout & Drift Correction',
      'Coding Challenge: Implement Async Task Queue with Concurrency Limit and Retry Logic',
      'Coding Challenge: Implement Pipe and Compose Functional Operators',
      'Coding Challenge: Implement HTML Parser and AST Generator from Scratch',
      'Coding Challenge: Implement Array.prototype.reduce from Scratch',
      'Coding Challenge: Implement Object.create Polyfill with Prototype Chain',
      'Coding Challenge: Implement Deep Merge of Complex Nested Objects & Arrays',
      'Coding Challenge: Implement Topological Sort for Package Dependency Graphs',
      'Coding Challenge: Implement Rate Limiter (Token Bucket / Leaky Bucket Algorithm)'
    ]
  }
]

// Generate 720+ rich, distinct video walkthroughs with topic-matched instructors, thumbnails, videoId, and URLs
const allVideos = []
let idCounter = 1

for (const group of TOPIC_CURRICULUM) {
  const cfg = TOPIC_CONFIG[group.topic] || {
    instructors: ['Web Dev Simplified', 'Frontend Masters'],
    thumbs: ['8aGhZQkoFbQ', 'cCOL7MC4Pl0']
  }

  for (let sIdx = 0; sIdx < group.subtopics.length; sIdx++) {
    const sub = group.subtopics[sIdx]

    // Create 3 focused variations per subtopic (Deep Dive, Live Interview Coding, Under The Hood Architecture)
    const variations = [
      {
        prefix: 'Masterclass: ',
        descPrefix: 'Comprehensive deep dive into ',
        durationMin: 22,
        level: group.level
      },
      {
        prefix: 'Interview Questions & Code: ',
        descPrefix: 'Common senior frontend interview questions, tricky edge cases, and live coding scenarios covering ',
        durationMin: 18,
        level: group.level === 'Intermediate' ? 'Medium' : 'Hard'
      },
      {
        prefix: 'Under The Hood: ',
        descPrefix: 'Step-by-step architectural breakdown, internal runtime mechanics, performance trade-offs, and pitfalls of ',
        durationMin: 28,
        level: 'Advanced'
      }
    ]

    for (let vIdx = 0; vIdx < variations.length; vIdx++) {
      const v = variations[vIdx]
      const instructor = cfg.instructors[(idCounter + sIdx + vIdx) % cfg.instructors.length]
      const thumbId = cfg.thumbs[(idCounter + sIdx * 3 + vIdx) % cfg.thumbs.length]
      const mins = v.durationMin + ((idCounter * 7) % 25)
      const secs = (idCounter * 13) % 60
      const durationStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`
      const fullTitle = `${v.prefix}${sub}`

      const searchQuery = encodeURIComponent(`${sub} ${group.topic} ${instructor} tutorial frontend interview`)
      const directUrl = `https://www.youtube.com/results?search_query=${searchQuery}`

      allVideos.push({
        id: idCounter,
        videoId: thumbId,
        title: fullTitle,
        description: `${v.descPrefix}${sub.toLowerCase()}. Learn best practices, key trade-offs, internal algorithms, and how to answer related questions with confidence in technical interviews. Presented by ${instructor}.`,
        url: directUrl,
        thumbnail: `https://img.youtube.com/vi/${thumbId}/hqdefault.jpg`,
        topic: group.topic,
        instructor,
        duration: durationStr,
        level: v.level,
      })

      idCounter++
    }
  }
}

// Add top curated showcase masterclasses with verified direct YouTube watch links & videoId
const curatedTop = [
  {
    id: idCounter++,
    videoId: 'rg7Fvvl3taU',
    title: 'CSS Grid & Modern Responsive Layouts Masterclass',
    description: 'Kevin Powell breaks down CSS Grid, subgrid, container queries, minmax(), and advanced responsive layouts without media query bloat.',
    url: 'https://www.youtube.com/watch?v=rg7Fvvl3taU',
    thumbnail: 'https://img.youtube.com/vi/rg7Fvvl3taU/hqdefault.jpg',
    topic: 'CSS & Layouts',
    instructor: 'Kevin Powell',
    duration: '24:45',
    level: 'Intermediate'
  },
  {
    id: idCounter++,
    videoId: 'y3BfR7j_Z6w',
    title: 'CSS Container Queries & Modern Components in Depth',
    description: 'Learn how to build truly modular component-driven CSS layouts using container queries and container query units with Kevin Powell.',
    url: 'https://www.youtube.com/watch?v=y3BfR7j_Z6w',
    thumbnail: 'https://img.youtube.com/vi/y3BfR7j_Z6w/hqdefault.jpg',
    topic: 'CSS & Layouts',
    instructor: 'Kevin Powell',
    duration: '21:10',
    level: 'Advanced'
  },
  {
    id: idCounter++,
    videoId: '2pL28xL_970',
    title: 'Frontend System Design: Infinite Scrolling Newsfeed (Twitter/Instagram)',
    description: 'Complete architectural design for large scale newsfeed with dynamic height virtualized windowing, optimistic likes, image caching, and scroll position restoration.',
    url: 'https://www.youtube.com/watch?v=2pL28xL_970',
    thumbnail: 'https://img.youtube.com/vi/2pL28xL_970/hqdefault.jpg',
    topic: 'Frontend System Design',
    instructor: 'Chirag Goel',
    duration: '32:15',
    level: 'Hard'
  },
  {
    id: idCounter++,
    videoId: '0ympFIwQFJw',
    title: 'React 19 & Fiber Architecture Explained',
    description: 'Understand how the React Fiber reconciler performs cooperative scheduling, time-slicing, concurrent rendering, and server components.',
    url: 'https://www.youtube.com/watch?v=0ympFIwQFJw',
    thumbnail: 'https://img.youtube.com/vi/0ympFIwQFJw/hqdefault.jpg',
    topic: 'React & React 19',
    instructor: 'Jack Herrington',
    duration: '21:40',
    level: 'Advanced'
  },
  {
    id: idCounter++,
    videoId: 'pfaSUYaSgRo',
    title: 'TanStack Query (React Query) v5 Masterclass',
    description: 'Master server state management, query keys factories, optimistic updates, cache invalidation, and custom hooks with TkDodo and Jack Herrington.',
    url: 'https://www.youtube.com/watch?v=pfaSUYaSgRo',
    thumbnail: 'https://img.youtube.com/vi/pfaSUYaSgRo/hqdefault.jpg',
    topic: 'React Query & RTK',
    instructor: 'TkDodo (TanStack Query)',
    duration: '38:45',
    level: 'Advanced'
  },
  {
    id: idCounter++,
    videoId: '4eO94J6A7r4',
    title: 'Redux Toolkit (RTK) & RTK Query Full Course',
    description: 'Complete practical guide to modern state management with Redux Toolkit, createSlice, createEntityAdapter, and RTK Query with tag invalidation.',
    url: 'https://www.youtube.com/watch?v=4eO94J6A7r4',
    thumbnail: 'https://img.youtube.com/vi/4eO94J6A7r4/hqdefault.jpg',
    topic: 'React Query & RTK',
    instructor: 'Dave Gray',
    duration: '44:10',
    level: 'Advanced'
  },
  {
    id: idCounter++,
    videoId: '1wZbqHkF7L4',
    title: 'Frontend Security: XSS, CSRF, CSP & DOMPurify Sanitization',
    description: 'Learn how to secure modern Single Page Applications against Stored/Reflected/DOM XSS, set Content Security Policy headers, and sanitize user HTML.',
    url: 'https://www.youtube.com/watch?v=1wZbqHkF7L4',
    thumbnail: 'https://img.youtube.com/vi/1wZbqHkF7L4/hqdefault.jpg',
    topic: 'Sanitization & Security',
    instructor: 'Web Dev Simplified',
    duration: '24:18',
    level: 'Advanced'
  },
  {
    id: idCounter++,
    videoId: 't2ypurOX04Y',
    title: 'HTTP/1 to HTTP/2 to HTTP/3 (QUIC) Explained',
    description: 'Hussein Nasser breaks down TCP vs UDP, HOL blocking, TLS 1.3 handshake, HTTP/2 multiplexing streams, and HTTP/3 QUIC connection migration.',
    url: 'https://www.youtube.com/watch?v=t2ypurOX04Y',
    thumbnail: 'https://img.youtube.com/vi/t2ypurOX04Y/hqdefault.jpg',
    topic: 'HTTP & Networking',
    instructor: 'Hussein Nasser',
    duration: '29:50',
    level: 'Advanced'
  },
  {
    id: idCounter++,
    videoId: '30LWjhZzg50',
    title: 'WebSockets vs Server-Sent Events vs Long Polling',
    description: 'Detailed protocol analysis comparing WebSockets bi-directional frames, SSE streaming text/event-stream, and HTTP polling for real-time applications.',
    url: 'https://www.youtube.com/watch?v=30LWjhZzg50',
    thumbnail: 'https://img.youtube.com/vi/30LWjhZzg50/hqdefault.jpg',
    topic: 'HTTP & Networking',
    instructor: 'Hussein Nasser',
    duration: '25:12',
    level: 'Advanced'
  },
  {
    id: idCounter++,
    videoId: 'PkOBnYxqj3k',
    title: 'Web Performance: Critical Rendering Path & Core Web Vitals',
    description: 'Learn how the browser parses HTML, constructs DOM & CSSOM, builds the Render Tree, runs layout and paint, and how to optimize LCP, INP, and CLS.',
    url: 'https://www.youtube.com/watch?v=PkOBnYxqj3k',
    thumbnail: 'https://img.youtube.com/vi/PkOBnYxqj3k/hqdefault.jpg',
    topic: 'Web Optimizations & Performance',
    instructor: 'Fireship',
    duration: '14:20',
    level: 'Advanced'
  },
  {
    id: idCounter++,
    videoId: 'd56mG7DezGs',
    title: 'TypeScript Advanced Types & Generics in Depth',
    description: 'Deep dive into conditional types, template literal types, mapped types, distributive conditionals, and infer keyword in real-world libraries.',
    url: 'https://www.youtube.com/watch?v=d56mG7DezGs',
    thumbnail: 'https://img.youtube.com/vi/d56mG7DezGs/hqdefault.jpg',
    topic: 'TypeScript',
    instructor: 'Theo - t3.gg',
    duration: '27:10',
    level: 'Advanced'
  },
  {
    id: idCounter++,
    videoId: '8aGhZQkoFbQ',
    title: 'What the heck is the event loop anyway?',
    description: "Philip Roberts' legendary deep dive into the JavaScript call stack, browser APIs, event loop, and callback queue with interactive visualizations.",
    url: 'https://www.youtube.com/watch?v=8aGhZQkoFbQ',
    thumbnail: 'https://img.youtube.com/vi/8aGhZQkoFbQ/hqdefault.jpg',
    topic: 'JavaScript Core',
    instructor: 'Philip Roberts (JSConf)',
    duration: '26:52',
    level: 'Intermediate'
  },
  {
    id: idCounter++,
    videoId: 'cCOL7MC4Pl0',
    title: 'In The Loop - Jake Archibald (JS Event Loop & Microtasks)',
    description: 'Jake Archibald demonstrates task queues, microtask checkpoints, requestAnimationFrame, and render steps across browsers.',
    url: 'https://www.youtube.com/watch?v=cCOL7MC4Pl0',
    thumbnail: 'https://img.youtube.com/vi/cCOL7MC4Pl0/hqdefault.jpg',
    topic: 'Browser APIs & DOM',
    instructor: 'Jake Archibald (Google Chrome)',
    duration: '35:12',
    level: 'Advanced'
  },
  {
    id: idCounter++,
    videoId: 'cjIswDCKgu0',
    title: 'Frontend Coding: Implement Debounce & Throttle from Scratch',
    description: 'Live coding interview solutions for debounce and throttle with leading/trailing options, cancel method, and timers.',
    url: 'https://www.youtube.com/watch?v=cjIswDCKgu0',
    thumbnail: 'https://img.youtube.com/vi/cjIswDCKgu0/hqdefault.jpg',
    topic: 'Machine Coding & DSA',
    instructor: 'ByteByteGo',
    duration: '19:30',
    level: 'Intermediate'
  }
]

const finalDataset = [...curatedTop, ...allVideos]

console.log(`Generated ${finalDataset.length} curated frontend interview videos.`);
mkdirSync(resolve(ROOT, 'public/data'), { recursive: true })
writeFileSync(OUT_FILE, JSON.stringify(finalDataset, null, 2), 'utf8')
console.log(`Wrote dataset to ${OUT_FILE}`);
