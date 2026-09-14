import type { SubjectId, SubjectMetadata, TopicMetadata } from '../types/docs.types';

export const ALL_SUBJECTS_CATALOG: SubjectMetadata[] = [
  {
    id: 'html',
    title: 'HTML & Semantic Web',
    category: 'Core Web',
    icon: '🌐',
    badge: 'Core',
    tagline: 'Document semantics, accessibility, browser parsing, and modern HTML5 APIs.',
    description: 'Master semantic layout, form validations, accessibility (ARIA), metadata for SEO, web components, and DOM lifecycles.',
    estimatedHours: 14,
    totalTopicsCount: 100,
    tags: ['Semantics', 'A11y', 'ARIA', 'SEO', 'DOM', 'Forms'],
  },
  {
    id: 'css',
    title: 'Modern CSS & Layouts',
    category: 'Core Web',
    icon: '🎨',
    badge: 'Core',
    tagline: 'Selectors, cascade, specificity, Flexbox, Grid, animations, and responsive architecture.',
    description: 'Comprehensive CSS foundations: Box Model, Stacking Context, z-index, Flexbox, Grid, custom properties, and modern responsive layouts.',
    estimatedHours: 20,
    totalTopicsCount: 60,
    tags: ['Flexbox', 'Grid', 'Cascade', 'Specificity', 'Responsive', 'Animations'],
  },
  {
    id: 'advanced-css',
    title: 'Advanced CSS & Architecture',
    category: 'Core Web',
    icon: '✨',
    badge: 'Advanced',
    tagline: 'Cascade layers, subgrid, container queries, compositing, paint cycles, and design tokens.',
    description: 'Deep-dive into browser rendering engines, paint/reflow optimization, cascade layers (@layer), container queries, and enterprise CSS patterns.',
    estimatedHours: 18,
    totalTopicsCount: 35,
    tags: ['Cascade Layers', 'Container Queries', 'Subgrid', 'Compositing', 'Reflow', 'Performance'],
  },
  {
    id: 'javascript',
    title: 'Core JavaScript & V8 Engine',
    category: 'Languages',
    icon: '⚡',
    badge: 'Core',
    tagline: 'Execution contexts, closures, prototypes, event loop, memory management, and garbage collection.',
    description: 'Deep dive into the JavaScript language specification: closures, prototype inheritance, event loop microtasks/macrotasks, memory leaks, and DOM APIs.',
    estimatedHours: 32,
    totalTopicsCount: 65,
    tags: ['Closures', 'Prototypes', 'Event Loop', 'Garbage Collection', 'Async', 'V8'],
  },
  {
    id: 'es6',
    title: 'ES6+ & Modern Evolution',
    category: 'Languages',
    icon: '🚀',
    badge: 'Modern',
    tagline: 'What is new, why it exists, before vs after, and production interview differentiators.',
    description: 'From ES2015 to ESNext: destructuring, symbols, generators, iterators, optional chaining, WeakMap/WeakSet, private fields, and modern JavaScript patterns.',
    estimatedHours: 16,
    totalTopicsCount: 35,
    tags: ['ES6', 'Promises', 'Generators', 'Iterators', 'Symbols', 'WeakMap'],
  },
  {
    id: 'typescript',
    title: 'TypeScript & Type Systems',
    category: 'Languages',
    icon: '🔷',
    badge: 'Essential',
    tagline: 'Generics, conditional types, mapped types, utility types, and enterprise type safety.',
    description: 'Master strict typing in TypeScript: conditional types (infer), mapped types, template literal types, generic constraints, and discriminated unions.',
    estimatedHours: 24,
    totalTopicsCount: 45,
    tags: ['Generics', 'Conditional Types', 'Utility Types', 'Narrowing', 'Type Guards'],
  },
  {
    id: 'react',
    title: 'ReactJS Fundamentals',
    category: 'React Ecosystem',
    icon: '⚛️',
    badge: 'Core',
    tagline: 'Component model, JSX, reconciliation, virtual DOM, and fundamental hooks.',
    description: 'The core foundations of React: useState, useEffect, useCallback, useMemo, useRef, custom hooks, context, keys, and reconciliation mechanics.',
    estimatedHours: 28,
    totalTopicsCount: 50,
    tags: ['Hooks', 'Virtual DOM', 'Reconciliation', 'State', 'Props', 'Components'],
  },
  {
    id: 'advanced-react',
    title: 'Advanced React & Concurrency',
    category: 'React Ecosystem',
    icon: '🧬',
    badge: 'Advanced',
    tagline: 'Fiber architecture, concurrent rendering, batching, transitions, and performance profiling.',
    description: 'Deep internals of React: Fiber trees, work loops, concurrent mode, useTransition, useDeferredValue, Server/Client components, and profiling memory/re-renders.',
    estimatedHours: 25,
    totalTopicsCount: 30,
    tags: ['Fiber', 'Concurrent Mode', 'useTransition', 'Suspense', 'Profiling', 'Architecture'],
  },
  {
    id: 'redux',
    title: 'Redux Core & State Immutability',
    category: 'React Ecosystem',
    icon: '🟣',
    badge: 'State',
    tagline: 'Unidirectional data flow, store, reducers, middleware, and state normalization.',
    description: 'Architectural state management: pure reducers, action creators, middleware pipeline, thunk mechanics, state normalization, and immutable updates.',
    estimatedHours: 16,
    totalTopicsCount: 20,
    tags: ['Store', 'Reducers', 'Middleware', 'Immutability', 'DevTools', 'Selectors'],
  },
  {
    id: 'redux-toolkit',
    title: 'Redux Toolkit & RTK Query',
    category: 'React Ecosystem',
    icon: '📦',
    badge: 'Modern',
    tagline: 'createSlice, createAsyncThunk, RTK Query caching, tags, and optimistic updates.',
    description: 'Modern standard Redux: simplify boilerplate with createSlice, Immer integration, auto-generated action types, and automated caching with RTK Query.',
    estimatedHours: 18,
    totalTopicsCount: 20,
    tags: ['createSlice', 'RTK Query', 'createAsyncThunk', 'Immer', 'Cache Invalidation'],
  },
  {
    id: 'tanstack-query',
    title: 'TanStack Query (React Query v5)',
    category: 'React Ecosystem',
    icon: '🔄',
    badge: 'Modern',
    tagline: 'Server state management, staleTime vs gcTime, cache invalidation, and mutations.',
    description: 'Master server-state synchronization: query keys, automatic refetching, pagination, infinite scroll, optimistic updates, and offline persistence.',
    estimatedHours: 20,
    totalTopicsCount: 25,
    tags: ['staleTime', 'gcTime', 'Mutations', 'Optimistic Updates', 'Pagination', 'Cache'],
  },
  {
    id: 'react-router',
    title: 'React Router DOM (Data Routing)',
    category: 'React Ecosystem',
    icon: '🧭',
    badge: 'Essential',
    tagline: 'Nested routes, loaders, actions, error boundaries, and data router architecture.',
    description: 'Comprehensive routing: createBrowserRouter, nested layouts with Outlet, loaders/actions data prefetching, authentication guards, and lazy routes.',
    estimatedHours: 15,
    totalTopicsCount: 20,
    tags: ['Loaders', 'Actions', 'Outlet', 'Data Router', 'Guards', 'Nested Routes'],
  },
  {
    id: 'tailwind',
    title: 'Tailwind CSS & Design Tokens',
    category: 'Core Web',
    icon: '🌊',
    badge: 'Styling',
    tagline: 'Utility-first styling, arbitrary values, dark mode, responsive prefixes, and JIT.',
    description: 'Design system engineering with Tailwind: utility composition, custom theme extensions, dark mode strategies, performance optimization, and components.',
    estimatedHours: 14,
    totalTopicsCount: 25,
    tags: ['Utility Classes', 'JIT', 'Dark Mode', 'Design Tokens', 'Responsive', 'Theme'],
  },
  {
    id: 'nextjs',
    title: 'Next.js & Server Components',
    category: 'Architecture & Fullstack',
    icon: '▲',
    badge: 'Fullstack',
    tagline: 'App Router, React Server Components (RSC), Server Actions, SSR, SSG, and streaming.',
    description: 'Production Next.js: Server Components vs Client Components, streaming with Suspense, routing metadata, Server Actions, Route Handlers, and SEO optimization.',
    estimatedHours: 26,
    totalTopicsCount: 35,
    tags: ['App Router', 'RSC', 'Server Actions', 'SSR', 'Streaming', 'Middleware'],
  },
  {
    id: 'microfrontends',
    title: 'Microfrontends & Module Federation',
    category: 'Architecture & Fullstack',
    icon: '🧩',
    badge: 'Enterprise',
    tagline: 'Webpack Module Federation, runtime vs build-time integration, and shared state.',
    description: 'Large-scale enterprise frontend architecture: independent deployments, domain-driven decomposition, shared dependency deduplication, and failure isolation.',
    estimatedHours: 22,
    totalTopicsCount: 18,
    tags: ['Module Federation', 'Microfrontends', 'Isolation', 'Shared Deps', 'Routing'],
  },
  {
    id: 'restful-apis',
    title: 'RESTful API Design & Best Practices',
    category: 'Networking & APIs',
    icon: '🔌',
    badge: 'Networking',
    tagline: 'HTTP verbs, idempotent operations, pagination, status codes, and rate limiting.',
    description: 'Architecting frontend-backend communication: REST maturity models, resource URI design, status codes, idempotency keys, filtering, and error handling.',
    estimatedHours: 16,
    totalTopicsCount: 25,
    tags: ['REST', 'Idempotency', 'Status Codes', 'Pagination', 'Headers', 'API Design'],
  },
  {
    id: 'http',
    title: 'HTTP, Protocols & Browser Networking',
    category: 'Networking & APIs',
    icon: '🌐',
    badge: 'Protocols',
    tagline: 'HTTP/1.1 vs HTTP/2 vs HTTP/3, TLS handshake, CORS preflight, and Cache-Control.',
    description: 'Deep networking fundamentals: TCP/TLS handshakes, multiplexing in HTTP/2, QUIC in HTTP/3, CORS headers, preflight requests, ETags, and browser caching.',
    estimatedHours: 20,
    totalTopicsCount: 25,
    tags: ['HTTP/2', 'HTTP/3', 'CORS', 'Cache-Control', 'TLS', 'ETags', 'CDN'],
  },
  {
    id: 'postman',
    title: 'Postman & Enterprise API Testing',
    category: 'Networking & APIs',
    icon: '📮',
    badge: 'Tooling',
    tagline: 'Collections, environments, pre-request scripts, tests, and Newman in CI/CD.',
    description: 'Complete API workflow: environment variables, automated contract validation test scripts, collection runners, mock servers, and Newman automation in CI/CD.',
    estimatedHours: 12,
    totalTopicsCount: 18,
    tags: ['Collections', 'Environments', 'Test Scripts', 'Newman', 'Mock Servers', 'CI/CD'],
  },
  {
    id: 'websockets',
    title: 'WebSockets & Real-Time Architecture',
    category: 'Networking & APIs',
    icon: '📡',
    badge: 'Real-time',
    tagline: 'Full-duplex connections, protocol handshake, heartbeats, reconnection, and scaling.',
    description: 'Building resilient real-time web applications: WS upgrade handshake, binary/text frames, heartbeat ping/pong, auto-reconnection with exponential backoff, and pub/sub.',
    estimatedHours: 18,
    totalTopicsCount: 20,
    tags: ['WebSockets', 'Heartbeats', 'Full-Duplex', 'Reconnection', 'Pub/Sub', 'Scale'],
  },
  {
    id: 'webhooks',
    title: 'Webhooks & Event Architectures',
    category: 'Architecture & Fullstack',
    icon: '🪝',
    badge: 'Events',
    tagline: 'HMAC signature verification, retry policies, idempotent processing, and replay protection.',
    description: 'Event-driven architectures: webhook publishing & consumption, SHA-256 HMAC cryptographic verification, replay attack prevention with timestamp verification, and dead-letter queues.',
    estimatedHours: 15,
    totalTopicsCount: 15,
    tags: ['HMAC', 'Signatures', 'Idempotency', 'Retries', 'Queues', 'Security'],
  },
  {
    id: 'web-performance',
    title: 'Web Performance & Core Web Vitals',
    category: 'Performance & Tooling',
    icon: '⚡',
    badge: 'Performance',
    tagline: 'Core Web Vitals (LCP, INP, CLS), bundle optimization, memory profiling, and rendering.',
    description: 'Staff-level optimization: measuring and optimizing Largest Contentful Paint (LCP), Interaction to Next Paint (INP), Cumulative Layout Shift (CLS), tree-shaking, and memory profiling.',
    estimatedHours: 24,
    totalTopicsCount: 22,
    tags: ['Core Web Vitals', 'LCP', 'INP', 'CLS', 'Memory Profiler', 'Bundle Splitting'],
  },
];

export const TOPICS_BY_SUBJECT: Record<SubjectId, TopicMetadata[]> = {
  "html": [
  {
    "id": "html-introduction",
    "subjectId": "html",
    "title": "HTML Introduction: What is HTML & Features of HTML",
    "order": 1,
    "description": "What HTML is, how it works, history, key features, and why it is the backbone of the web.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Introduction?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-editors",
    "subjectId": "html",
    "title": "HTML Editors: Setting Up Your Environment",
    "order": 2,
    "description": "How to write HTML using modern code editors like VS Code, notepad, and browser developer tools.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Editors?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-basic-structure",
    "subjectId": "html",
    "title": "HTML Basic Structure & Boilerplate",
    "order": 3,
    "description": "Anatomy of an HTML document: DOCTYPE, html, head, title, and body elements.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Basic Structure & Boilerplate?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-elements",
    "subjectId": "html",
    "title": "HTML Elements: Opening Tag, Content & Closing Tag",
    "order": 4,
    "description": "Understanding HTML tags vs elements, nested elements, empty (void) elements, and case sensitivity.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Elements?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-attributes",
    "subjectId": "html",
    "title": "HTML Attributes: Modifying Elements with Extra Data",
    "order": 5,
    "description": "How attributes work, syntax (name=\"value\"), core attributes (href, src, alt, width, height, title, id, class).",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Attributes?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-headings",
    "subjectId": "html",
    "title": "HTML Headings: <h1> to <h6> & Heading Hierarchy",
    "order": 6,
    "description": "Defining titles and subtitles with h1 through h6, SEO importance, accessibility, and visual size.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Headings?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-paragraphs",
    "subjectId": "html",
    "title": "HTML Paragraphs: <p>, Line Breaks <br> & Rules <hr>",
    "order": 7,
    "description": "Writing text content with paragraphs, automatic margins, white space collapsing, line breaks, and thematic dividers.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Paragraphs?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-styles",
    "subjectId": "html",
    "title": "HTML Styles: The style Attribute (Inline CSS)",
    "order": 8,
    "description": "Adding colors, fonts, sizes, and backgrounds directly to elements using the style attribute.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Styles?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-text-formatting",
    "subjectId": "html",
    "title": "HTML Text Formatting: <b>, <strong>, <i>, <em> & More",
    "order": 9,
    "description": "Formatting text for bold, italic, highlighted, small, deleted, inserted, subscript, and superscript.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Text Formatting?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-quotations",
    "subjectId": "html",
    "title": "HTML Quotations & Citations: <blockquote>, <q>, <abbr>",
    "order": 10,
    "description": "Quoting long sections, short inline quotes, abbreviations with tooltips, addresses, and book/movie citations.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Quotations & Citations?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-comments",
    "subjectId": "html",
    "title": "HTML Comments: <!-- Comment Goes Here -->",
    "order": 11,
    "description": "Writing explanatory notes in code, temporarily hiding elements, and debugging layout issues.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Comments?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-colors",
    "subjectId": "html",
    "title": "HTML Colors: Names, RGB, HEX & HSL",
    "order": 12,
    "description": "Color values in HTML: 140 standard color names, RGB numbers, HEX codes, and HSL values.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Colors?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-css",
    "subjectId": "html",
    "title": "HTML with CSS: Inline, Internal & External Styles",
    "order": 13,
    "description": "The three ways to insert CSS into HTML: inline style attributes, internal <style> tags, and external <link> stylesheets.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML with CSS?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-links",
    "subjectId": "html",
    "title": "HTML Links: The <a> Anchor Tag & href Attribute",
    "order": 14,
    "description": "Creating hyperlinks, target attribute (_blank, _self), mailto links, tel links, and page bookmarks with #id.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Links?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-images",
    "subjectId": "html",
    "title": "HTML Images: <img>, src, alt, width & loading=\"lazy\"",
    "order": 15,
    "description": "Embedding images, providing accessibility with alt text, width and height dimensions, and native lazy loading.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Images?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-favicons",
    "subjectId": "html",
    "title": "HTML Favicons: Browser Tab Icons",
    "order": 16,
    "description": "Adding a custom icon to the browser tab next to the page title using <link rel=\"icon\">.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Favicons?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-tables",
    "subjectId": "html",
    "title": "HTML Tables: <table>, <tr>, <th>, <td> & <caption>",
    "order": 17,
    "description": "Organizing data in rows and columns, table headers, borders, cell padding, spanning rows (rowspan), and cols (colspan).",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Tables?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-lists-unordered",
    "subjectId": "html",
    "title": "HTML Unordered Lists: <ul> & <li> (Bullet Points)",
    "order": 18,
    "description": "Creating bulleted lists with ul and li, customizing bullet markers, and nesting lists.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Unordered Lists?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-lists-ordered",
    "subjectId": "html",
    "title": "HTML Ordered Lists: <ol> & <li> (Numbered Lists)",
    "order": 19,
    "description": "Creating numbered lists, changing numbering type (1, A, a, I, i), starting numbers, and reversed lists.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Ordered Lists?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-lists-description",
    "subjectId": "html",
    "title": "HTML Description Lists: <dl>, <dt> & <dd>",
    "order": 20,
    "description": "Creating term-description glossaries, key-value metadata pairs, and FAQ lists with dl, dt, and dd.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Description Lists?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-block-inline",
    "subjectId": "html",
    "title": "HTML Block vs Inline Elements: Key Differences",
    "order": 21,
    "description": "Block-level elements (start on new line, full width) vs Inline elements (flow with text, width of content).",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Block vs Inline Elements?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-div-container",
    "subjectId": "html",
    "title": "The <div> Element: Generic Block Container",
    "order": 22,
    "description": "Using div elements as generic containers for grouping, layout wrappers, and styling with CSS classes.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <div> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-span-container",
    "subjectId": "html",
    "title": "The <span> Element: Generic Inline Text Container",
    "order": 23,
    "description": "Targeting specific words or phrases inside text to apply custom colors, fonts, or JavaScript triggers.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <span> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-classes",
    "subjectId": "html",
    "title": "HTML Classes: The class Attribute",
    "order": 24,
    "description": "Naming and styling multiple elements with classes, multiple class names, and JavaScript getElementsByClassName.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Classes?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-id",
    "subjectId": "html",
    "title": "HTML Id: The id Attribute (Unique Identifiers)",
    "order": 25,
    "description": "Unique element identification, CSS #id selector, bookmark jump links, and document.getElementById.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Id?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-iframes",
    "subjectId": "html",
    "title": "HTML Iframes: <iframe> Embedded Web Pages",
    "order": 26,
    "description": "Embedding external web pages, Google Maps, YouTube videos, sandbox attribute, and security.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Iframes?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-javascript",
    "subjectId": "html",
    "title": "HTML with JavaScript: <script> & <noscript>",
    "order": 27,
    "description": "Adding interactivity to HTML with script tags, external .js files, inline event handlers, and noscript fallbacks.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML with JavaScript?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-file-paths",
    "subjectId": "html",
    "title": "HTML File Paths: Relative vs Absolute URLs",
    "order": 28,
    "description": "Understanding file paths for images, links, and stylesheets: root (/), same folder, parent folder (../), and full web URLs.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML File Paths?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-head",
    "subjectId": "html",
    "title": "The HTML <head> Element: Document Metadata Hub",
    "order": 29,
    "description": "Everything inside head: title, style, meta, link, script, and base elements.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The HTML <head> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-layout-semantics",
    "subjectId": "html",
    "title": "HTML Semantic Layout: <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>",
    "order": 30,
    "description": "Structuring modern web pages with semantic layout tags instead of generic <div> tags.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Semantic Layout?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-responsive",
    "subjectId": "html",
    "title": "HTML Responsive Web Design: The Viewport Meta Tag",
    "order": 31,
    "description": "Making web pages look great on all devices: smartphones, tablets, laptops, and wide desktops.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Responsive Web Design?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-computercode",
    "subjectId": "html",
    "title": "HTML Computer Code: <code>, <kbd>, <samp> & <var>",
    "order": 32,
    "description": "Displaying programming code snippets, keyboard shortcuts, computer terminal output, and math variables.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Computer Code?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-entities",
    "subjectId": "html",
    "title": "HTML Entities: Special Characters (&lt;, &gt;, &amp;, &copy;)",
    "order": 33,
    "description": "Displaying reserved HTML characters (<, >, &, \"), non-breaking spaces (&nbsp;), and copyright symbols.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Entities?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-symbols-emojis",
    "subjectId": "html",
    "title": "HTML Symbols & Emojis: UTF-8 Special Characters",
    "order": 34,
    "description": "Adding math symbols (±, ∞), Greek letters (π, α), currency symbols (€, £, ¥), and native emojis (😀, 🚀).",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Symbols & Emojis?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-forms-intro",
    "subjectId": "html",
    "title": "HTML Forms Introduction: The <form> Element",
    "order": 35,
    "description": "What an HTML form is, how user data is collected and sent to a server, action, and method (GET vs POST).",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Forms Introduction?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-form-elements",
    "subjectId": "html",
    "title": "HTML Form Elements: <label>, <select>, <textarea>, <button>",
    "order": 36,
    "description": "Core controls beyond basic text: dropdown menus, multi-line textareas, fieldsets, legends, and button types.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Form Elements?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-input-text-password",
    "subjectId": "html",
    "title": "HTML Inputs: type=\"text\" & type=\"password\"",
    "order": 37,
    "description": "Collecting single-line text and masked passwords, placeholder, maxlength, minlength, and autocomplete.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Inputs?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-input-radio-checkbox",
    "subjectId": "html",
    "title": "HTML Inputs: type=\"radio\" & type=\"checkbox\"",
    "order": 38,
    "description": "Radio buttons for picking ONE option from a group vs checkboxes for picking MULTIPLE options.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Inputs?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-input-numeric-range",
    "subjectId": "html",
    "title": "HTML Inputs: type=\"number\" & type=\"range\"",
    "order": 39,
    "description": "Accepting numeric quantities with min, max, step, and creating visual sliding range controls.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Inputs?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-input-date-time",
    "subjectId": "html",
    "title": "HTML Inputs: Date & Time Pickers (date, time, datetime-local)",
    "order": 40,
    "description": "Native browser date and time calendar pickers without needing third-party JavaScript plugins.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Inputs?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-input-specialized",
    "subjectId": "html",
    "title": "HTML Inputs: email, url, tel, color & file",
    "order": 41,
    "description": "Specialized input types: email with validation, url, telephone, color pickers, and file uploads.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Inputs?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-form-validation",
    "subjectId": "html",
    "title": "HTML Form Validation: Native Client-Side Validation",
    "order": 42,
    "description": "Validating forms without JavaScript: required, pattern regex, min, max, minlength, and custom tooltips.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Form Validation?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-datalist",
    "subjectId": "html",
    "title": "HTML <datalist>: Native Autocomplete Suggestions",
    "order": 43,
    "description": "Providing auto-suggest search options to input fields while still letting users type custom values.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML <datalist>?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-video",
    "subjectId": "html",
    "title": "HTML Video: The <video> Element & Playback Controls",
    "order": 44,
    "description": "Embedding video files natively, controls, autoplay, loop, muted, poster image, and multiple source formats.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Video?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-audio",
    "subjectId": "html",
    "title": "HTML Audio: The <audio> Element & Sound Playback",
    "order": 45,
    "description": "Playing podcasts, music, and sound effects natively with controls, autoplay, and audio formats (MP3, WAV, OGG).",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Audio?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-canvas",
    "subjectId": "html",
    "title": "HTML Canvas: The <canvas> Scripted 2D Graphics API",
    "order": 46,
    "description": "Drawing shapes, lines, circles, text, and games using JavaScript on the HTML canvas element.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Canvas?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-svg",
    "subjectId": "html",
    "title": "HTML SVG: Scalable Vector Graphics (<svg>)",
    "order": 47,
    "description": "Drawing sharp resolution-independent shapes, icons, paths, and charts with XML vector markup.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML SVG?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-dialog",
    "subjectId": "html",
    "title": "HTML <dialog>: Native Interactive Modal Dialogs",
    "order": 48,
    "description": "Building accessible popup modals with native showModal(), backdrop styling, and Esc key closing.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML <dialog>?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-details-summary",
    "subjectId": "html",
    "title": "HTML <details> & <summary>: Native FAQ Accordions",
    "order": 49,
    "description": "Creating disclosure widgets and accordion collapsible sections with pure HTML and zero JavaScript.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML <details> & <summary>?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-web-storage",
    "subjectId": "html",
    "title": "HTML Web Storage: localStorage & sessionStorage",
    "order": 50,
    "description": "Storing key-value data in the user browser safely: persistent localStorage vs tab-bound sessionStorage.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Web Storage?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-accessibility-aria",
    "subjectId": "html",
    "title": "HTML Accessibility (A11y) & WAI-ARIA Basics",
    "order": 51,
    "description": "Making websites accessible to people with disabilities, WCAG principles, ARIA roles, and aria-label.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is HTML Accessibility (A11y) & WAI-ARIA Basics?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-html",
    "subjectId": "html",
    "title": "The <html> Element: HTML Definition & Usage",
    "order": 52,
    "description": "Represents the root (top-level element) of an HTML document, so it is also referred to as the root element. All other elements must be descendants of this element.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <html> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-base",
    "subjectId": "html",
    "title": "The <base> Element: BASE Definition & Usage",
    "order": 53,
    "description": "Specifies the base URL to use for all relative URLs in a document. There can be only one such element in a document.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <base> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-head",
    "subjectId": "html",
    "title": "The <head> Element: HEAD Definition & Usage",
    "order": 54,
    "description": "Contains machine-readable information (metadata) about the document, like its title, scripts, and style sheets.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <head> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-link",
    "subjectId": "html",
    "title": "The <link> Element: LINK Definition & Usage",
    "order": 55,
    "description": "Specifies relationships between the current document and an external resource. This element is most commonly used to link to CSS but is also used to establish site icons (both \"favicon\" style icons and icons for the home screen and apps on mobile devices) among other things.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <link> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-meta",
    "subjectId": "html",
    "title": "The <meta> Element: META Definition & Usage",
    "order": 56,
    "description": "Represents metadata that cannot be represented by other HTML meta-related elements, like &lt;base&gt;, &lt;link&gt;, &lt;script&gt;, &lt;style&gt; and &lt;title&gt;.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <meta> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-style",
    "subjectId": "html",
    "title": "The <style> Element: STYLE Definition & Usage",
    "order": 57,
    "description": "Contains style information for a document or part of a document. It contains CSS, which is applied to the contents of the document containing this element.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <style> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-title",
    "subjectId": "html",
    "title": "The <title> Element: TITLE Definition & Usage",
    "order": 58,
    "description": "Defines the document's title that is shown in a browser's title bar or a page's tab. It only contains text; HTML tags within the element, if any, are also treated as plain text.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <title> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-body",
    "subjectId": "html",
    "title": "The <body> Element: BODY Definition & Usage",
    "order": 59,
    "description": "Represents the content of an HTML document. There can be only one such element in a document.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <body> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-address",
    "subjectId": "html",
    "title": "The <address> Element: ADDRESS Definition & Usage",
    "order": 60,
    "description": "Indicates that the enclosed HTML provides contact information for a person or people, or for an organization.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <address> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-article",
    "subjectId": "html",
    "title": "The <article> Element: ARTICLE Definition & Usage",
    "order": 61,
    "description": "Represents a self-contained composition in a document, page, application, or site, which is intended to be independently distributable or reusable (e.g., in syndication). Examples include a forum post, a magazine or newspaper article, a blog entry, a product card, a user-submitted comment, an interactive widget or gadget, or any other independent item of content.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <article> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-aside",
    "subjectId": "html",
    "title": "The <aside> Element: ASIDE Definition & Usage",
    "order": 62,
    "description": "Represents a portion of a document whose content is only indirectly related to the document's main content. Asides are frequently presented as sidebars or call-out boxes.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <aside> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-footer",
    "subjectId": "html",
    "title": "The <footer> Element: FOOTER Definition & Usage",
    "order": 63,
    "description": "Represents a footer for its nearest ancestor sectioning content or sectioning root element. A &lt;footer&gt; typically contains information about the author of the section, copyright data, or links to related documents.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <footer> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-header",
    "subjectId": "html",
    "title": "The <header> Element: HEADER Definition & Usage",
    "order": 64,
    "description": "Represents introductory content, typically a group of introductory or navigational aids. It may contain some heading elements but also a logo, a search form, an author name, and other elements.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <header> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-hgroup",
    "subjectId": "html",
    "title": "The <hgroup> Element: HGROUP Definition & Usage",
    "order": 65,
    "description": "Represents a heading grouped with any secondary content, such as subheadings, an alternative title, or a tagline.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <hgroup> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-main",
    "subjectId": "html",
    "title": "The <main> Element: MAIN Definition & Usage",
    "order": 66,
    "description": "Represents the dominant content of the body of a document. The main content area consists of content that is directly related to or expands upon the central topic of a document, or the central functionality of an application.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <main> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-nav",
    "subjectId": "html",
    "title": "The <nav> Element: NAV Definition & Usage",
    "order": 67,
    "description": "Represents a section of a page whose purpose is to provide navigation links, either within the current document or to other documents. Common examples of navigation sections are menus, tables of contents, and indexes.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <nav> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-section",
    "subjectId": "html",
    "title": "The <section> Element: SECTION Definition & Usage",
    "order": 68,
    "description": "Represents a generic standalone section of a document, which doesn't have a more specific semantic element to represent it. Sections should always have a heading, with very few exceptions.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <section> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-search",
    "subjectId": "html",
    "title": "The <search> Element: SEARCH Definition & Usage",
    "order": 69,
    "description": "Represents a part that contains a set of form controls or other content related to performing a search or filtering operation.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <search> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-blockquote",
    "subjectId": "html",
    "title": "The <blockquote> Element: BLOCKQUOTE Definition & Usage",
    "order": 70,
    "description": "Indicates that the enclosed text is an extended quotation. Usually, this is rendered visually by indentation. A URL for the source of the quotation may be given using the cite attribute, while a text representation of the source can be given using the &lt;cite&gt; element.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <blockquote> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-dd",
    "subjectId": "html",
    "title": "The <dd> Element: DD Definition & Usage",
    "order": 71,
    "description": "Provides the description, definition, or value for the preceding term (&lt;dt&gt;) in a description list (&lt;dl&gt;).",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <dd> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-div",
    "subjectId": "html",
    "title": "The <div> Element: DIV Definition & Usage",
    "order": 72,
    "description": "The generic container for flow content. It has no effect on the content or layout until styled in some way using CSS (e.g., styling is directly applied to it, or some kind of layout model like flexbox is applied to its parent element).",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <div> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-dl",
    "subjectId": "html",
    "title": "The <dl> Element: DL Definition & Usage",
    "order": 73,
    "description": "Represents a description list. The element encloses a list of groups of terms (specified using the &lt;dt&gt; element) and descriptions (provided by &lt;dd&gt; elements). Common uses for this element are to implement a glossary or to display metadata (a list of key-value pairs).",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <dl> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-dt",
    "subjectId": "html",
    "title": "The <dt> Element: DT Definition & Usage",
    "order": 74,
    "description": "Specifies a term in a description or definition list, and as such must be used inside a &lt;dl&gt; element. It is usually followed by a &lt;dd&gt; element; however, multiple &lt;dt&gt; elements in a row indicate several terms that are all defined by the immediate next &lt;dd&gt; element.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <dt> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-figcaption",
    "subjectId": "html",
    "title": "The <figcaption> Element: FIGCAPTION Definition & Usage",
    "order": 75,
    "description": "Represents a caption or legend describing the rest of the contents of its parent &lt;figure&gt; element.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <figcaption> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-figure",
    "subjectId": "html",
    "title": "The <figure> Element: FIGURE Definition & Usage",
    "order": 76,
    "description": "Represents self-contained content, potentially with an optional caption, which is specified using the &lt;figcaption&gt; element. The figure, its caption, and its contents are referenced as a single unit.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <figure> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-hr",
    "subjectId": "html",
    "title": "The <hr> Element: HR Definition & Usage",
    "order": 77,
    "description": "Represents a thematic break between paragraph-level elements: for example, a change of scene in a story, or a shift of topic within a section.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <hr> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-li",
    "subjectId": "html",
    "title": "The <li> Element: LI Definition & Usage",
    "order": 78,
    "description": "Represents an item in a list. It must be contained in a parent element: an ordered list (&lt;ol&gt;), an unordered list (&lt;ul&gt;), or a menu (&lt;menu&gt;). In menus and unordered lists, list items are usually displayed using bullet points. In ordered lists, they are usually displayed with an ascending counter on the left, such as a number or letter.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <li> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-menu",
    "subjectId": "html",
    "title": "The <menu> Element: MENU Definition & Usage",
    "order": 79,
    "description": "A semantic alternative to &lt;ul&gt;, but treated by browsers (and exposed through the accessibility tree) as no different than &lt;ul&gt;. It represents an unordered list of items (which are represented by &lt;li&gt; elements).",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <menu> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-ol",
    "subjectId": "html",
    "title": "The <ol> Element: OL Definition & Usage",
    "order": 80,
    "description": "Represents an ordered list of items — typically rendered as a numbered list.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <ol> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-p",
    "subjectId": "html",
    "title": "The <p> Element: P Definition & Usage",
    "order": 81,
    "description": "Represents a paragraph. Paragraphs are usually represented in visual media as blocks of text separated from adjacent blocks by blank lines and/or first-line indentation, but HTML paragraphs can be any structural grouping of related content, such as images or form fields.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <p> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-pre",
    "subjectId": "html",
    "title": "The <pre> Element: PRE Definition & Usage",
    "order": 82,
    "description": "Represents preformatted text which is to be presented exactly as written in the HTML file. The text is typically rendered using a non-proportional, or monospaced, font. Whitespace inside this element is displayed as written.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <pre> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-ul",
    "subjectId": "html",
    "title": "The <ul> Element: UL Definition & Usage",
    "order": 83,
    "description": "Represents an unordered list of items, typically rendered as a bulleted list.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <ul> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-a",
    "subjectId": "html",
    "title": "The <a> Element: A Definition & Usage",
    "order": 84,
    "description": "Together with its href attribute, creates a hyperlink to web pages, files, email addresses, locations within the current page, or anything else a URL can address.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <a> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-abbr",
    "subjectId": "html",
    "title": "The <abbr> Element: ABBR Definition & Usage",
    "order": 85,
    "description": "Represents an abbreviation or acronym.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <abbr> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-b",
    "subjectId": "html",
    "title": "The <b> Element: B Definition & Usage",
    "order": 86,
    "description": "Used to draw the reader's attention to the element's contents, which are not otherwise granted special importance. This was formerly known as the Boldface element, and most browsers still draw the text in boldface. However, you should not use &lt;b&gt; for styling text or granting importance. If you wish to create boldface text, you should use the CSS font-weight property. If you wish to indicate an element is of special importance, you should use the &lt;strong&gt; element.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <b> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-bdi",
    "subjectId": "html",
    "title": "The <bdi> Element: BDI Definition & Usage",
    "order": 87,
    "description": "Tells the browser's bidirectional algorithm to treat the text it contains in isolation from its surrounding text. It's particularly useful when a website dynamically inserts some text and doesn't know the directionality of the text being inserted.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <bdi> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-bdo",
    "subjectId": "html",
    "title": "The <bdo> Element: BDO Definition & Usage",
    "order": 88,
    "description": "Overrides the current directionality of text, so that the text within is rendered in a different direction.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <bdo> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-br",
    "subjectId": "html",
    "title": "The <br> Element: BR Definition & Usage",
    "order": 89,
    "description": "Produces a line break in text (carriage-return). It is useful for writing a poem or an address, where the division of lines is significant.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <br> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-cite",
    "subjectId": "html",
    "title": "The <cite> Element: CITE Definition & Usage",
    "order": 90,
    "description": "Used to mark up the title of a creative work. The reference may be in an abbreviated form according to context-appropriate conventions related to citation metadata.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <cite> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-code",
    "subjectId": "html",
    "title": "The <code> Element: CODE Definition & Usage",
    "order": 91,
    "description": "Displays its contents styled in a fashion intended to indicate that the text is a short fragment of computer code. By default, the content text is displayed using the user agent's default monospace font.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <code> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-data",
    "subjectId": "html",
    "title": "The <data> Element: DATA Definition & Usage",
    "order": 92,
    "description": "Links a given piece of content with a machine-readable translation. If the content is time- or date-related, the &lt;time&gt; element must be used.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <data> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-dfn",
    "subjectId": "html",
    "title": "The <dfn> Element: DFN Definition & Usage",
    "order": 93,
    "description": "Used to indicate the term being defined within the context of a definition phrase or sentence. The ancestor &lt;p&gt; element, the &lt;dt&gt;/&lt;dd&gt; pairing, or the nearest section ancestor of the &lt;dfn&gt; element, is considered to be the definition of the term.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <dfn> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-em",
    "subjectId": "html",
    "title": "The <em> Element: EM Definition & Usage",
    "order": 94,
    "description": "Marks text that has stress emphasis. The &lt;em&gt; element can be nested, with each nesting level indicating a greater degree of emphasis.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <em> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-i",
    "subjectId": "html",
    "title": "The <i> Element: I Definition & Usage",
    "order": 95,
    "description": "Represents a range of text that is set off from the normal text for some reason, such as idiomatic text, technical terms, and taxonomical designations, among others. Historically, these have been presented using italicized type, which is the original source of the &lt;i&gt; naming of this element.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <i> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-kbd",
    "subjectId": "html",
    "title": "The <kbd> Element: KBD Definition & Usage",
    "order": 96,
    "description": "Represents a span of inline text denoting textual user input from a keyboard, voice input, or any other text entry device. By convention, the user agent defaults to rendering the contents of a &lt;kbd&gt; element using its default monospace font, although this is not mandated by the HTML standard.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <kbd> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-mark",
    "subjectId": "html",
    "title": "The <mark> Element: MARK Definition & Usage",
    "order": 97,
    "description": "Represents text which is marked or highlighted for reference or notation purposes due to the marked passage's relevance in the enclosing context.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <mark> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-q",
    "subjectId": "html",
    "title": "The <q> Element: Q Definition & Usage",
    "order": 98,
    "description": "Indicates that the enclosed text is a short inline quotation. Most modern browsers implement this by surrounding the text in quotation marks. This element is intended for short quotations that don't require paragraph breaks; for long quotations use the &lt;blockquote&gt; element.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <q> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-rp",
    "subjectId": "html",
    "title": "The <rp> Element: RP Definition & Usage",
    "order": 99,
    "description": "Used to provide fall-back parentheses for browsers that do not support the display of ruby annotations using the &lt;ruby&gt; element. One &lt;rp&gt; element should enclose each of the opening and closing parentheses that wrap the &lt;rt&gt; element that contains the annotation's text.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <rp> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  },
  {
    "id": "html-element-rt",
    "subjectId": "html",
    "title": "The <rt> Element: RT Definition & Usage",
    "order": 100,
    "description": "Specifies the ruby text component of a ruby annotation, which is used to provide pronunciation, translation, or transliteration information for East Asian typography. The &lt;rt&gt; element must always be contained within a &lt;ruby&gt; element.",
    "subtopics": [
      {
        "id": "what-is-and-features",
        "title": "1. What is The <rt> Element?",
        "conceptId": "html_what_is_and_features"
      },
      {
        "id": "how-it-works-step-by-step",
        "title": "2. How It Works (Step-by-Step)",
        "conceptId": "html_how_it_works_step_by_step"
      },
      {
        "id": "common-mistakes-tips",
        "title": "3. Common Beginner Mistakes & Best Practices",
        "conceptId": "html_common_mistakes_tips"
      }
    ]
  }
],

  "css": [
  {
    "id": "css-intro-syntax",
    "subjectId": "css",
    "title": "CSS Introduction & Syntax",
    "order": 1,
    "description": "What is CSS, rule structure (selector, property, value), and browser rendering.",
    "subtopics": [
      {
        "id": "css-intro-syntax-basics",
        "title": "What is CSS Introduction & Syntax?",
        "conceptId": "css_css_intro_syntax_whatis"
      },
      {
        "id": "css-intro-syntax-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_intro_syntax_usage"
      },
      {
        "id": "css-intro-syntax-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_intro_syntax_bestpractices"
      }
    ]
  },
  {
    "id": "css-how-to-add",
    "subjectId": "css",
    "title": "How to Add CSS: External, Internal & Inline",
    "order": 2,
    "description": "Three ways to insert CSS and when to use each.",
    "subtopics": [
      {
        "id": "css-how-to-add-basics",
        "title": "What is How to Add CSS?",
        "conceptId": "css_css_how_to_add_whatis"
      },
      {
        "id": "css-how-to-add-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_how_to_add_usage"
      },
      {
        "id": "css-how-to-add-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_how_to_add_bestpractices"
      }
    ]
  },
  {
    "id": "css-selectors-basic",
    "subjectId": "css",
    "title": "Basic CSS Selectors",
    "order": 3,
    "description": "Element, class, ID, universal, and grouping selectors.",
    "subtopics": [
      {
        "id": "css-selectors-basic-basics",
        "title": "What is Basic CSS Selectors?",
        "conceptId": "css_css_selectors_basic_whatis"
      },
      {
        "id": "css-selectors-basic-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_selectors_basic_usage"
      },
      {
        "id": "css-selectors-basic-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_selectors_basic_bestpractices"
      }
    ]
  },
  {
    "id": "css-comments",
    "subjectId": "css",
    "title": "CSS Comments & Code Organization",
    "order": 4,
    "description": "Writing readable CSS comments and section organization.",
    "subtopics": [
      {
        "id": "css-comments-basics",
        "title": "What is CSS Comments & Code Organization?",
        "conceptId": "css_css_comments_whatis"
      },
      {
        "id": "css-comments-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_comments_usage"
      },
      {
        "id": "css-comments-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_comments_bestpractices"
      }
    ]
  },
  {
    "id": "css-colors",
    "subjectId": "css",
    "title": "CSS Colors: Hex, RGB, RGBA, HSL & HSLA",
    "order": 5,
    "description": "Color formats, opacity, and color names.",
    "subtopics": [
      {
        "id": "css-colors-basics",
        "title": "What is CSS Colors?",
        "conceptId": "css_css_colors_whatis"
      },
      {
        "id": "css-colors-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_colors_usage"
      },
      {
        "id": "css-colors-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_colors_bestpractices"
      }
    ]
  },
  {
    "id": "css-backgrounds",
    "subjectId": "css",
    "title": "CSS Backgrounds: Color, Image, Repeat & Attachment",
    "order": 6,
    "description": "Managing background colors, images, repeat, and attachment.",
    "subtopics": [
      {
        "id": "css-backgrounds-basics",
        "title": "What is CSS Backgrounds?",
        "conceptId": "css_css_backgrounds_whatis"
      },
      {
        "id": "css-backgrounds-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_backgrounds_usage"
      },
      {
        "id": "css-backgrounds-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_backgrounds_bestpractices"
      }
    ]
  },
  {
    "id": "css-background-size",
    "subjectId": "css",
    "title": "CSS Background Size: Cover, Contain & Position",
    "order": 7,
    "description": "Scaling and positioning background images cleanly.",
    "subtopics": [
      {
        "id": "css-background-size-basics",
        "title": "What is CSS Background Size?",
        "conceptId": "css_css_background_size_whatis"
      },
      {
        "id": "css-background-size-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_background_size_usage"
      },
      {
        "id": "css-background-size-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_background_size_bestpractices"
      }
    ]
  },
  {
    "id": "css-borders",
    "subjectId": "css",
    "title": "CSS Borders: Width, Style & Color",
    "order": 8,
    "description": "Solid, dashed, dotted, double borders and border shorthand.",
    "subtopics": [
      {
        "id": "css-borders-basics",
        "title": "What is CSS Borders?",
        "conceptId": "css_css_borders_whatis"
      },
      {
        "id": "css-borders-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_borders_usage"
      },
      {
        "id": "css-borders-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_borders_bestpractices"
      }
    ]
  },
  {
    "id": "css-border-radius",
    "subjectId": "css",
    "title": "CSS Rounded Corners: border-radius",
    "order": 9,
    "description": "Circular, pill, and custom corner radius techniques.",
    "subtopics": [
      {
        "id": "css-border-radius-basics",
        "title": "What is CSS Rounded Corners?",
        "conceptId": "css_css_border_radius_whatis"
      },
      {
        "id": "css-border-radius-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_border_radius_usage"
      },
      {
        "id": "css-border-radius-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_border_radius_bestpractices"
      }
    ]
  },
  {
    "id": "css-margins",
    "subjectId": "css",
    "title": "CSS Margins & Margin Collapsing",
    "order": 10,
    "description": "Spacing outside elements and vertical margin collapse rules.",
    "subtopics": [
      {
        "id": "css-margins-basics",
        "title": "What is CSS Margins & Margin Collapsing?",
        "conceptId": "css_css_margins_whatis"
      },
      {
        "id": "css-margins-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_margins_usage"
      },
      {
        "id": "css-margins-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_margins_bestpractices"
      }
    ]
  },
  {
    "id": "css-padding",
    "subjectId": "css",
    "title": "CSS Padding",
    "order": 11,
    "description": "Internal spacing between border and content.",
    "subtopics": [
      {
        "id": "css-padding-basics",
        "title": "What is CSS Padding?",
        "conceptId": "css_css_padding_whatis"
      },
      {
        "id": "css-padding-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_padding_usage"
      },
      {
        "id": "css-padding-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_padding_bestpractices"
      }
    ]
  },
  {
    "id": "css-height-width",
    "subjectId": "css",
    "title": "CSS Height & Width: Min & Max Constraints",
    "order": 12,
    "description": "Controlling element dimensions and preventing overflow.",
    "subtopics": [
      {
        "id": "css-height-width-basics",
        "title": "What is CSS Height & Width?",
        "conceptId": "css_css_height_width_whatis"
      },
      {
        "id": "css-height-width-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_height_width_usage"
      },
      {
        "id": "css-height-width-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_height_width_bestpractices"
      }
    ]
  },
  {
    "id": "css-box-model",
    "subjectId": "css",
    "title": "CSS Box Model: content-box vs border-box",
    "order": 13,
    "description": "Anatomy of the box model and why box-sizing: border-box is standard.",
    "subtopics": [
      {
        "id": "css-box-model-basics",
        "title": "What is CSS Box Model?",
        "conceptId": "css_css_box_model_whatis"
      },
      {
        "id": "css-box-model-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_box_model_usage"
      },
      {
        "id": "css-box-model-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_box_model_bestpractices"
      }
    ]
  },
  {
    "id": "css-outline",
    "subjectId": "css",
    "title": "CSS Outline vs Border",
    "order": 14,
    "description": "Outlines for accessibility focus indicators without shifting layout.",
    "subtopics": [
      {
        "id": "css-outline-basics",
        "title": "What is CSS Outline vs Border?",
        "conceptId": "css_css_outline_whatis"
      },
      {
        "id": "css-outline-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_outline_usage"
      },
      {
        "id": "css-outline-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_outline_bestpractices"
      }
    ]
  },
  {
    "id": "css-text-styling",
    "subjectId": "css",
    "title": "CSS Text: Color, Alignment, Decoration & Transform",
    "order": 15,
    "description": "Text formatting, uppercase, capitalize, underline, and alignment.",
    "subtopics": [
      {
        "id": "css-text-styling-basics",
        "title": "What is CSS Text?",
        "conceptId": "css_css_text_styling_whatis"
      },
      {
        "id": "css-text-styling-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_text_styling_usage"
      },
      {
        "id": "css-text-styling-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_text_styling_bestpractices"
      }
    ]
  },
  {
    "id": "css-text-spacing",
    "subjectId": "css",
    "title": "CSS Text Spacing: line-height & letter-spacing",
    "order": 16,
    "description": "Improving readability with line-height and letter-spacing.",
    "subtopics": [
      {
        "id": "css-text-spacing-basics",
        "title": "What is CSS Text Spacing?",
        "conceptId": "css_css_text_spacing_whatis"
      },
      {
        "id": "css-text-spacing-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_text_spacing_usage"
      },
      {
        "id": "css-text-spacing-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_text_spacing_bestpractices"
      }
    ]
  },
  {
    "id": "css-fonts-family",
    "subjectId": "css",
    "title": "CSS Font Families & Web Safe Fonts",
    "order": 17,
    "description": "Serif, sans-serif, monospace, and font fallbacks.",
    "subtopics": [
      {
        "id": "css-fonts-family-basics",
        "title": "What is CSS Font Families & Web Safe Fonts?",
        "conceptId": "css_css_fonts_family_whatis"
      },
      {
        "id": "css-fonts-family-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_fonts_family_usage"
      },
      {
        "id": "css-fonts-family-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_fonts_family_bestpractices"
      }
    ]
  },
  {
    "id": "css-google-fonts",
    "subjectId": "css",
    "title": "Using Google Fonts & @font-face",
    "order": 18,
    "description": "Importing modern typography from Google Fonts and local files.",
    "subtopics": [
      {
        "id": "css-google-fonts-basics",
        "title": "What is Using Google Fonts & @font-face?",
        "conceptId": "css_css_google_fonts_whatis"
      },
      {
        "id": "css-google-fonts-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_google_fonts_usage"
      },
      {
        "id": "css-google-fonts-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_google_fonts_bestpractices"
      }
    ]
  },
  {
    "id": "css-icons",
    "subjectId": "css",
    "title": "CSS Icons: FontAwesome, Material & SVG",
    "order": 19,
    "description": "Embedding and styling vector icons.",
    "subtopics": [
      {
        "id": "css-icons-basics",
        "title": "What is CSS Icons?",
        "conceptId": "css_css_icons_whatis"
      },
      {
        "id": "css-icons-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_icons_usage"
      },
      {
        "id": "css-icons-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_icons_bestpractices"
      }
    ]
  },
  {
    "id": "css-links-styling",
    "subjectId": "css",
    "title": "CSS Links: :link, :visited, :hover & :active",
    "order": 20,
    "description": "The LVHA order and styling interactive links.",
    "subtopics": [
      {
        "id": "css-links-styling-basics",
        "title": "What is CSS Links?",
        "conceptId": "css_css_links_styling_whatis"
      },
      {
        "id": "css-links-styling-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_links_styling_usage"
      },
      {
        "id": "css-links-styling-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_links_styling_bestpractices"
      }
    ]
  },
  {
    "id": "css-lists-styling",
    "subjectId": "css",
    "title": "CSS Lists: list-style-type & Custom Bullets",
    "order": 21,
    "description": "Removing bullets, custom markers, and horizontal list menus.",
    "subtopics": [
      {
        "id": "css-lists-styling-basics",
        "title": "What is CSS Lists?",
        "conceptId": "css_css_lists_styling_whatis"
      },
      {
        "id": "css-lists-styling-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_lists_styling_usage"
      },
      {
        "id": "css-lists-styling-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_lists_styling_bestpractices"
      }
    ]
  },
  {
    "id": "css-tables-styling",
    "subjectId": "css",
    "title": "CSS Tables: Borders, Padding & Zebra Striping",
    "order": 22,
    "description": "Styling readable tables and responsive table wrappers.",
    "subtopics": [
      {
        "id": "css-tables-styling-basics",
        "title": "What is CSS Tables?",
        "conceptId": "css_css_tables_styling_whatis"
      },
      {
        "id": "css-tables-styling-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_tables_styling_usage"
      },
      {
        "id": "css-tables-styling-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_tables_styling_bestpractices"
      }
    ]
  },
  {
    "id": "css-display-property",
    "subjectId": "css",
    "title": "CSS Display: block, inline, inline-block & none",
    "order": 23,
    "description": "Understanding element flow and visibility.",
    "subtopics": [
      {
        "id": "css-display-property-basics",
        "title": "What is CSS Display?",
        "conceptId": "css_css_display_property_whatis"
      },
      {
        "id": "css-display-property-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_display_property_usage"
      },
      {
        "id": "css-display-property-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_display_property_bestpractices"
      }
    ]
  },
  {
    "id": "css-max-width",
    "subjectId": "css",
    "title": "CSS max-width vs width in Responsive Design",
    "order": 24,
    "description": "Preventing horizontal scrollbars on mobile screens.",
    "subtopics": [
      {
        "id": "css-max-width-basics",
        "title": "What is CSS max-width vs width in Responsive Design?",
        "conceptId": "css_css_max_width_whatis"
      },
      {
        "id": "css-max-width-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_max_width_usage"
      },
      {
        "id": "css-max-width-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_max_width_bestpractices"
      }
    ]
  },
  {
    "id": "css-position-static-relative",
    "subjectId": "css",
    "title": "CSS Position: static & relative",
    "order": 25,
    "description": "Normal flow vs relative offset positioning.",
    "subtopics": [
      {
        "id": "css-position-static-relative-basics",
        "title": "What is CSS Position?",
        "conceptId": "css_css_position_static_relative_whatis"
      },
      {
        "id": "css-position-static-relative-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_position_static_relative_usage"
      },
      {
        "id": "css-position-static-relative-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_position_static_relative_bestpractices"
      }
    ]
  },
  {
    "id": "css-position-absolute",
    "subjectId": "css",
    "title": "CSS Position: absolute",
    "order": 26,
    "description": "Positioning elements relative to nearest positioned ancestor.",
    "subtopics": [
      {
        "id": "css-position-absolute-basics",
        "title": "What is CSS Position?",
        "conceptId": "css_css_position_absolute_whatis"
      },
      {
        "id": "css-position-absolute-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_position_absolute_usage"
      },
      {
        "id": "css-position-absolute-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_position_absolute_bestpractices"
      }
    ]
  },
  {
    "id": "css-position-fixed",
    "subjectId": "css",
    "title": "CSS Position: fixed",
    "order": 27,
    "description": "Locking headers, footers, and modal overlays to the viewport.",
    "subtopics": [
      {
        "id": "css-position-fixed-basics",
        "title": "What is CSS Position?",
        "conceptId": "css_css_position_fixed_whatis"
      },
      {
        "id": "css-position-fixed-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_position_fixed_usage"
      },
      {
        "id": "css-position-fixed-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_position_fixed_bestpractices"
      }
    ]
  },
  {
    "id": "css-position-sticky",
    "subjectId": "css",
    "title": "CSS Position: sticky",
    "order": 28,
    "description": "Creating sticky table headers and navigation bars.",
    "subtopics": [
      {
        "id": "css-position-sticky-basics",
        "title": "What is CSS Position?",
        "conceptId": "css_css_position_sticky_whatis"
      },
      {
        "id": "css-position-sticky-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_position_sticky_usage"
      },
      {
        "id": "css-position-sticky-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_position_sticky_bestpractices"
      }
    ]
  },
  {
    "id": "css-z-index",
    "subjectId": "css",
    "title": "CSS z-index & Stacking Context",
    "order": 29,
    "description": "Controlling 3D layer depth and stacking order.",
    "subtopics": [
      {
        "id": "css-z-index-basics",
        "title": "What is CSS z-index & Stacking Context?",
        "conceptId": "css_css_z_index_whatis"
      },
      {
        "id": "css-z-index-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_z_index_usage"
      },
      {
        "id": "css-z-index-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_z_index_bestpractices"
      }
    ]
  },
  {
    "id": "css-overflow",
    "subjectId": "css",
    "title": "CSS Overflow: visible, hidden, scroll & auto",
    "order": 30,
    "description": "Handling clipped content and scroll containers.",
    "subtopics": [
      {
        "id": "css-overflow-basics",
        "title": "What is CSS Overflow?",
        "conceptId": "css_css_overflow_whatis"
      },
      {
        "id": "css-overflow-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_overflow_usage"
      },
      {
        "id": "css-overflow-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_overflow_bestpractices"
      }
    ]
  },
  {
    "id": "css-float-clear",
    "subjectId": "css",
    "title": "CSS Float & Clear: Understanding Clearfix",
    "order": 31,
    "description": "Historical layout float mechanics and modern alternatives.",
    "subtopics": [
      {
        "id": "css-float-clear-basics",
        "title": "What is CSS Float & Clear?",
        "conceptId": "css_css_float_clear_whatis"
      },
      {
        "id": "css-float-clear-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_float_clear_usage"
      },
      {
        "id": "css-float-clear-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_float_clear_bestpractices"
      }
    ]
  },
  {
    "id": "css-align-techniques",
    "subjectId": "css",
    "title": "CSS Centering Techniques: Text & Divs",
    "order": 32,
    "description": "Centering vertically and horizontally across modern CSS.",
    "subtopics": [
      {
        "id": "css-align-techniques-basics",
        "title": "What is CSS Centering Techniques?",
        "conceptId": "css_css_align_techniques_whatis"
      },
      {
        "id": "css-align-techniques-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_align_techniques_usage"
      },
      {
        "id": "css-align-techniques-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_align_techniques_bestpractices"
      }
    ]
  },
  {
    "id": "css-combinators",
    "subjectId": "css",
    "title": "CSS Combinators: Descendant, Child, Adjacent & General Sibling",
    "order": 33,
    "description": "Targeting elements based on DOM tree relationships.",
    "subtopics": [
      {
        "id": "css-combinators-basics",
        "title": "What is CSS Combinators?",
        "conceptId": "css_css_combinators_whatis"
      },
      {
        "id": "css-combinators-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_combinators_usage"
      },
      {
        "id": "css-combinators-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_combinators_bestpractices"
      }
    ]
  },
  {
    "id": "css-pseudo-classes",
    "subjectId": "css",
    "title": "CSS Pseudo-classes: :hover, :focus, :focus-visible",
    "order": 34,
    "description": "Styling user states and accessible focus rings.",
    "subtopics": [
      {
        "id": "css-pseudo-classes-basics",
        "title": "What is CSS Pseudo-classes?",
        "conceptId": "css_css_pseudo_classes_whatis"
      },
      {
        "id": "css-pseudo-classes-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_pseudo_classes_usage"
      },
      {
        "id": "css-pseudo-classes-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_pseudo_classes_bestpractices"
      }
    ]
  },
  {
    "id": "css-pseudo-structural",
    "subjectId": "css",
    "title": "Structural Pseudo-classes: :first-child, :last-child, :nth-child",
    "order": 35,
    "description": "Targeting alternating rows and specific element positions.",
    "subtopics": [
      {
        "id": "css-pseudo-structural-basics",
        "title": "What is Structural Pseudo-classes?",
        "conceptId": "css_css_pseudo_structural_whatis"
      },
      {
        "id": "css-pseudo-structural-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_pseudo_structural_usage"
      },
      {
        "id": "css-pseudo-structural-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_pseudo_structural_bestpractices"
      }
    ]
  },
  {
    "id": "css-pseudo-elements",
    "subjectId": "css",
    "title": "CSS Pseudo-elements: ::before & ::after",
    "order": 36,
    "description": "Inserting cosmetic content and icons without extra HTML.",
    "subtopics": [
      {
        "id": "css-pseudo-elements-basics",
        "title": "What is CSS Pseudo-elements?",
        "conceptId": "css_css_pseudo_elements_whatis"
      },
      {
        "id": "css-pseudo-elements-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_pseudo_elements_usage"
      },
      {
        "id": "css-pseudo-elements-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_pseudo_elements_bestpractices"
      }
    ]
  },
  {
    "id": "css-opacity",
    "subjectId": "css",
    "title": "CSS Opacity & Transparency",
    "order": 37,
    "description": "Element transparency vs rgba/hsla background transparency.",
    "subtopics": [
      {
        "id": "css-opacity-basics",
        "title": "What is CSS Opacity & Transparency?",
        "conceptId": "css_css_opacity_whatis"
      },
      {
        "id": "css-opacity-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_opacity_usage"
      },
      {
        "id": "css-opacity-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_opacity_bestpractices"
      }
    ]
  },
  {
    "id": "css-navbar",
    "subjectId": "css",
    "title": "Building Responsive Navigation Bars with CSS",
    "order": 38,
    "description": "Creating horizontal, vertical, and mobile navigation menus.",
    "subtopics": [
      {
        "id": "css-navbar-basics",
        "title": "What is Building Responsive Navigation Bars with CSS?",
        "conceptId": "css_css_navbar_whatis"
      },
      {
        "id": "css-navbar-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_navbar_usage"
      },
      {
        "id": "css-navbar-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_navbar_bestpractices"
      }
    ]
  },
  {
    "id": "css-dropdowns",
    "subjectId": "css",
    "title": "CSS Dropdown Menus",
    "order": 39,
    "description": "Hover and click-triggered dropdown navigation.",
    "subtopics": [
      {
        "id": "css-dropdowns-basics",
        "title": "What is CSS Dropdown Menus?",
        "conceptId": "css_css_dropdowns_whatis"
      },
      {
        "id": "css-dropdowns-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_dropdowns_usage"
      },
      {
        "id": "css-dropdowns-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_dropdowns_bestpractices"
      }
    ]
  },
  {
    "id": "css-forms-styling",
    "subjectId": "css",
    "title": "CSS Form Input & Button Styling",
    "order": 40,
    "description": "Customizing inputs, textareas, checkboxes, and buttons.",
    "subtopics": [
      {
        "id": "css-forms-styling-basics",
        "title": "What is CSS Form Input & Button Styling?",
        "conceptId": "css_css_forms_styling_whatis"
      },
      {
        "id": "css-forms-styling-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_forms_styling_usage"
      },
      {
        "id": "css-forms-styling-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_forms_styling_bestpractices"
      }
    ]
  },
  {
    "id": "css-units-rem-em",
    "subjectId": "css",
    "title": "CSS Units: px, rem, em, %, vh, vw",
    "order": 41,
    "description": "Absolute vs relative units and scalable typography.",
    "subtopics": [
      {
        "id": "css-units-rem-em-basics",
        "title": "What is CSS Units?",
        "conceptId": "css_css_units_rem_em_whatis"
      },
      {
        "id": "css-units-rem-em-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_units_rem_em_usage"
      },
      {
        "id": "css-units-rem-em-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_units_rem_em_bestpractices"
      }
    ]
  },
  {
    "id": "css-math-functions",
    "subjectId": "css",
    "title": "CSS Math Functions: calc(), min(), max(), clamp()",
    "order": 42,
    "description": "Fluid responsive sizing without JavaScript.",
    "subtopics": [
      {
        "id": "css-math-functions-basics",
        "title": "What is CSS Math Functions?",
        "conceptId": "css_css_math_functions_whatis"
      },
      {
        "id": "css-math-functions-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_math_functions_usage"
      },
      {
        "id": "css-math-functions-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_math_functions_bestpractices"
      }
    ]
  },
  {
    "id": "css-specificity",
    "subjectId": "css",
    "title": "CSS Specificity Rules & Calculation",
    "order": 43,
    "description": "Understanding how browsers resolve conflicting style rules.",
    "subtopics": [
      {
        "id": "css-specificity-basics",
        "title": "What is CSS Specificity Rules & Calculation?",
        "conceptId": "css_css_specificity_whatis"
      },
      {
        "id": "css-specificity-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_specificity_usage"
      },
      {
        "id": "css-specificity-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_specificity_bestpractices"
      }
    ]
  },
  {
    "id": "css-important",
    "subjectId": "css",
    "title": "The !important Declaration & Why to Avoid It",
    "order": 44,
    "description": "When !important is justified and why it causes maintainability debt.",
    "subtopics": [
      {
        "id": "css-important-basics",
        "title": "What is The !important Declaration & Why to Avoid It?",
        "conceptId": "css_css_important_whatis"
      },
      {
        "id": "css-important-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_important_usage"
      },
      {
        "id": "css-important-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_important_bestpractices"
      }
    ]
  },
  {
    "id": "css-gradients",
    "subjectId": "css",
    "title": "CSS Gradients: Linear, Radial & Conic",
    "order": 45,
    "description": "Creating rich background transitions and effects.",
    "subtopics": [
      {
        "id": "css-gradients-basics",
        "title": "What is CSS Gradients?",
        "conceptId": "css_css_gradients_whatis"
      },
      {
        "id": "css-gradients-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_gradients_usage"
      },
      {
        "id": "css-gradients-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_gradients_bestpractices"
      }
    ]
  },
  {
    "id": "css-shadows",
    "subjectId": "css",
    "title": "CSS Shadows: box-shadow & text-shadow",
    "order": 46,
    "description": "Creating depth, elevation, and glowing text.",
    "subtopics": [
      {
        "id": "css-shadows-basics",
        "title": "What is CSS Shadows?",
        "conceptId": "css_css_shadows_whatis"
      },
      {
        "id": "css-shadows-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_shadows_usage"
      },
      {
        "id": "css-shadows-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_shadows_bestpractices"
      }
    ]
  },
  {
    "id": "css-2d-transforms",
    "subjectId": "css",
    "title": "CSS 2D Transforms: translate, rotate, scale, skew",
    "order": 47,
    "description": "Manipulating element position and dimensions.",
    "subtopics": [
      {
        "id": "css-2d-transforms-basics",
        "title": "What is CSS 2D Transforms?",
        "conceptId": "css_css_2d_transforms_whatis"
      },
      {
        "id": "css-2d-transforms-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_2d_transforms_usage"
      },
      {
        "id": "css-2d-transforms-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_2d_transforms_bestpractices"
      }
    ]
  },
  {
    "id": "css-3d-transforms",
    "subjectId": "css",
    "title": "CSS 3D Transforms & Perspective",
    "order": 48,
    "description": "Card flip effects and 3D space rendering.",
    "subtopics": [
      {
        "id": "css-3d-transforms-basics",
        "title": "What is CSS 3D Transforms & Perspective?",
        "conceptId": "css_css_3d_transforms_whatis"
      },
      {
        "id": "css-3d-transforms-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_3d_transforms_usage"
      },
      {
        "id": "css-3d-transforms-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_3d_transforms_bestpractices"
      }
    ]
  },
  {
    "id": "css-transitions",
    "subjectId": "css",
    "title": "CSS Transitions: property, duration, timing-function, delay",
    "order": 49,
    "description": "Smooth state transitions on hover and focus.",
    "subtopics": [
      {
        "id": "css-transitions-basics",
        "title": "What is CSS Transitions?",
        "conceptId": "css_css_transitions_whatis"
      },
      {
        "id": "css-transitions-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_transitions_usage"
      },
      {
        "id": "css-transitions-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_transitions_bestpractices"
      }
    ]
  },
  {
    "id": "css-animations",
    "subjectId": "css",
    "title": "CSS Animations: @keyframes & animation shorthand",
    "order": 50,
    "description": "Continuous looping and keyframe animations.",
    "subtopics": [
      {
        "id": "css-animations-basics",
        "title": "What is CSS Animations?",
        "conceptId": "css_css_animations_whatis"
      },
      {
        "id": "css-animations-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_animations_usage"
      },
      {
        "id": "css-animations-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_animations_bestpractices"
      }
    ]
  },
  {
    "id": "css-tooltips",
    "subjectId": "css",
    "title": "Building Pure CSS Tooltips",
    "order": 51,
    "description": "Using pseudo-elements and data attributes for tooltips.",
    "subtopics": [
      {
        "id": "css-tooltips-basics",
        "title": "What is Building Pure CSS Tooltips?",
        "conceptId": "css_css_tooltips_whatis"
      },
      {
        "id": "css-tooltips-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_tooltips_usage"
      },
      {
        "id": "css-tooltips-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_tooltips_bestpractices"
      }
    ]
  },
  {
    "id": "css-object-fit",
    "subjectId": "css",
    "title": "CSS object-fit & object-position",
    "order": 52,
    "description": "Preventing stretched images in cards and banners.",
    "subtopics": [
      {
        "id": "css-object-fit-basics",
        "title": "What is CSS object-fit & object-position?",
        "conceptId": "css_css_object_fit_whatis"
      },
      {
        "id": "css-object-fit-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_object_fit_usage"
      },
      {
        "id": "css-object-fit-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_object_fit_bestpractices"
      }
    ]
  },
  {
    "id": "css-flexbox-intro",
    "subjectId": "css",
    "title": "Flexbox Introduction: One-Dimensional Layouts",
    "order": 53,
    "description": "Why Flexbox replaced floats and tables.",
    "subtopics": [
      {
        "id": "css-flexbox-intro-basics",
        "title": "What is Flexbox Introduction?",
        "conceptId": "css_css_flexbox_intro_whatis"
      },
      {
        "id": "css-flexbox-intro-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_flexbox_intro_usage"
      },
      {
        "id": "css-flexbox-intro-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_flexbox_intro_bestpractices"
      }
    ]
  },
  {
    "id": "css-flexbox-container",
    "subjectId": "css",
    "title": "Flexbox Container: justify-content, align-items, flex-direction",
    "order": 54,
    "description": "Aligning and distributing items along main and cross axes.",
    "subtopics": [
      {
        "id": "css-flexbox-container-basics",
        "title": "What is Flexbox Container?",
        "conceptId": "css_css_flexbox_container_whatis"
      },
      {
        "id": "css-flexbox-container-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_flexbox_container_usage"
      },
      {
        "id": "css-flexbox-container-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_flexbox_container_bestpractices"
      }
    ]
  },
  {
    "id": "css-flexbox-items",
    "subjectId": "css",
    "title": "Flexbox Items: flex-grow, flex-shrink, flex-basis, order",
    "order": 55,
    "description": "Controlling individual item sizing and responsiveness.",
    "subtopics": [
      {
        "id": "css-flexbox-items-basics",
        "title": "What is Flexbox Items?",
        "conceptId": "css_css_flexbox_items_whatis"
      },
      {
        "id": "css-flexbox-items-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_flexbox_items_usage"
      },
      {
        "id": "css-flexbox-items-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_flexbox_items_bestpractices"
      }
    ]
  },
  {
    "id": "css-grid-intro",
    "subjectId": "css",
    "title": "CSS Grid Introduction: Two-Dimensional Layouts",
    "order": 56,
    "description": "Rows, columns, and grid tracks.",
    "subtopics": [
      {
        "id": "css-grid-intro-basics",
        "title": "What is CSS Grid Introduction?",
        "conceptId": "css_css_grid_intro_whatis"
      },
      {
        "id": "css-grid-intro-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_grid_intro_usage"
      },
      {
        "id": "css-grid-intro-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_grid_intro_bestpractices"
      }
    ]
  },
  {
    "id": "css-grid-template",
    "subjectId": "css",
    "title": "CSS Grid: grid-template-columns, fr unit & minmax()",
    "order": 57,
    "description": "Building responsive multi-column layouts.",
    "subtopics": [
      {
        "id": "css-grid-template-basics",
        "title": "What is CSS Grid?",
        "conceptId": "css_css_grid_template_whatis"
      },
      {
        "id": "css-grid-template-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_grid_template_usage"
      },
      {
        "id": "css-grid-template-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_grid_template_bestpractices"
      }
    ]
  },
  {
    "id": "css-grid-areas",
    "subjectId": "css",
    "title": "CSS Grid: grid-template-areas & Named Lines",
    "order": 58,
    "description": "Visual page layout structure.",
    "subtopics": [
      {
        "id": "css-grid-areas-basics",
        "title": "What is CSS Grid?",
        "conceptId": "css_css_grid_areas_whatis"
      },
      {
        "id": "css-grid-areas-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_grid_areas_usage"
      },
      {
        "id": "css-grid-areas-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_grid_areas_bestpractices"
      }
    ]
  },
  {
    "id": "css-variables",
    "subjectId": "css",
    "title": "CSS Custom Properties (Variables): --name & var()",
    "order": 59,
    "description": "Theming, dynamic updates, and scoping.",
    "subtopics": [
      {
        "id": "css-variables-basics",
        "title": "What is CSS Custom Properties (Variables)?",
        "conceptId": "css_css_variables_whatis"
      },
      {
        "id": "css-variables-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_variables_usage"
      },
      {
        "id": "css-variables-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_variables_bestpractices"
      }
    ]
  },
  {
    "id": "css-media-queries",
    "subjectId": "css",
    "title": "Responsive Web Design: Media Queries & Breakpoints",
    "order": 60,
    "description": "Adapting layouts to mobile, tablet, and desktop screens.",
    "subtopics": [
      {
        "id": "css-media-queries-basics",
        "title": "What is Responsive Web Design?",
        "conceptId": "css_css_media_queries_whatis"
      },
      {
        "id": "css-media-queries-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "css_css_media_queries_usage"
      },
      {
        "id": "css-media-queries-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "css_css_media_queries_bestpractices"
      }
    ]
  }
],

  "advanced-css": [
  {
    "id": "acss-cascade-layers",
    "subjectId": "advanced-css",
    "title": "Cascade Layers (@layer) Fundamentals",
    "order": 1,
    "description": "Managing style priority and framework overrides.",
    "subtopics": [
      {
        "id": "acss-cascade-layers-basics",
        "title": "What is Cascade Layers (@layer) Fundamentals?",
        "conceptId": "advanced-css_acss_cascade_layers_whatis"
      },
      {
        "id": "acss-cascade-layers-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_cascade_layers_usage"
      },
      {
        "id": "acss-cascade-layers-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_cascade_layers_bestpractices"
      }
    ]
  },
  {
    "id": "acss-layer-ordering",
    "subjectId": "advanced-css",
    "title": "Layer Ordering & Unlayered Styles Priority",
    "order": 2,
    "description": "How unlayered styles take precedence over layered rules.",
    "subtopics": [
      {
        "id": "acss-layer-ordering-basics",
        "title": "What is Layer Ordering & Unlayered Styles Priority?",
        "conceptId": "advanced-css_acss_layer_ordering_whatis"
      },
      {
        "id": "acss-layer-ordering-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_layer_ordering_usage"
      },
      {
        "id": "acss-layer-ordering-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_layer_ordering_bestpractices"
      }
    ]
  },
  {
    "id": "acss-container-queries",
    "subjectId": "advanced-css",
    "title": "Container Queries (@container): Component-Driven Design",
    "order": 3,
    "description": "Adapting component styles to parent width instead of viewport.",
    "subtopics": [
      {
        "id": "acss-container-queries-basics",
        "title": "What is Container Queries (@container)?",
        "conceptId": "advanced-css_acss_container_queries_whatis"
      },
      {
        "id": "acss-container-queries-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_container_queries_usage"
      },
      {
        "id": "acss-container-queries-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_container_queries_bestpractices"
      }
    ]
  },
  {
    "id": "acss-container-units",
    "subjectId": "advanced-css",
    "title": "Container Query Units: cqi, cqw, cqb, cqh",
    "order": 4,
    "description": "Responsive typography based on container dimensions.",
    "subtopics": [
      {
        "id": "acss-container-units-basics",
        "title": "What is Container Query Units?",
        "conceptId": "advanced-css_acss_container_units_whatis"
      },
      {
        "id": "acss-container-units-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_container_units_usage"
      },
      {
        "id": "acss-container-units-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_container_units_bestpractices"
      }
    ]
  },
  {
    "id": "acss-style-queries",
    "subjectId": "advanced-css",
    "title": "Container Style Queries (@container style)",
    "order": 5,
    "description": "Applying CSS based on parent computed style properties.",
    "subtopics": [
      {
        "id": "acss-style-queries-basics",
        "title": "What is Container Style Queries (@container style)?",
        "conceptId": "advanced-css_acss_style_queries_whatis"
      },
      {
        "id": "acss-style-queries-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_style_queries_usage"
      },
      {
        "id": "acss-style-queries-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_style_queries_bestpractices"
      }
    ]
  },
  {
    "id": "acss-subgrid",
    "subjectId": "advanced-css",
    "title": "CSS Subgrid: Nested Grid Alignment",
    "order": 6,
    "description": "Inheriting row and column tracks from parent grids.",
    "subtopics": [
      {
        "id": "acss-subgrid-basics",
        "title": "What is CSS Subgrid?",
        "conceptId": "advanced-css_acss_subgrid_whatis"
      },
      {
        "id": "acss-subgrid-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_subgrid_usage"
      },
      {
        "id": "acss-subgrid-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_subgrid_bestpractices"
      }
    ]
  },
  {
    "id": "acss-native-nesting",
    "subjectId": "advanced-css",
    "title": "Native CSS Nesting Specification",
    "order": 7,
    "description": "Writing nested CSS directly in browsers without SASS.",
    "subtopics": [
      {
        "id": "acss-native-nesting-basics",
        "title": "What is Native CSS Nesting Specification?",
        "conceptId": "advanced-css_acss_native_nesting_whatis"
      },
      {
        "id": "acss-native-nesting-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_native_nesting_usage"
      },
      {
        "id": "acss-native-nesting-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_native_nesting_bestpractices"
      }
    ]
  },
  {
    "id": "acss-scope-rule",
    "subjectId": "advanced-css",
    "title": "The @scope At-Rule & Donut Scoping",
    "order": 8,
    "description": "Scoping styles with upper and lower DOM boundaries.",
    "subtopics": [
      {
        "id": "acss-scope-rule-basics",
        "title": "What is The @scope At-Rule & Donut Scoping?",
        "conceptId": "advanced-css_acss_scope_rule_whatis"
      },
      {
        "id": "acss-scope-rule-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_scope_rule_usage"
      },
      {
        "id": "acss-scope-rule-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_scope_rule_bestpractices"
      }
    ]
  },
  {
    "id": "acss-anchor-positioning",
    "subjectId": "advanced-css",
    "title": "Anchor Positioning API",
    "order": 9,
    "description": "Tethering tooltips, popovers, and menus to target anchors.",
    "subtopics": [
      {
        "id": "acss-anchor-positioning-basics",
        "title": "What is Anchor Positioning API?",
        "conceptId": "advanced-css_acss_anchor_positioning_whatis"
      },
      {
        "id": "acss-anchor-positioning-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_anchor_positioning_usage"
      },
      {
        "id": "acss-anchor-positioning-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_anchor_positioning_bestpractices"
      }
    ]
  },
  {
    "id": "acss-popover-styling",
    "subjectId": "advanced-css",
    "title": "Styling the Native HTML Popover API",
    "order": 10,
    "description": "Backdrop styling and top-layer management.",
    "subtopics": [
      {
        "id": "acss-popover-styling-basics",
        "title": "What is Styling the Native HTML Popover API?",
        "conceptId": "advanced-css_acss_popover_styling_whatis"
      },
      {
        "id": "acss-popover-styling-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_popover_styling_usage"
      },
      {
        "id": "acss-popover-styling-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_popover_styling_bestpractices"
      }
    ]
  },
  {
    "id": "acss-houdini-paint",
    "subjectId": "advanced-css",
    "title": "CSS Houdini: Paint API & Custom Canvas Backgrounds",
    "order": 11,
    "description": "Writing JavaScript worklets to render custom CSS graphics.",
    "subtopics": [
      {
        "id": "acss-houdini-paint-basics",
        "title": "What is CSS Houdini?",
        "conceptId": "advanced-css_acss_houdini_paint_whatis"
      },
      {
        "id": "acss-houdini-paint-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_houdini_paint_usage"
      },
      {
        "id": "acss-houdini-paint-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_houdini_paint_bestpractices"
      }
    ]
  },
  {
    "id": "acss-property-rule",
    "subjectId": "advanced-css",
    "title": "CSS Properties & Values API (@property)",
    "order": 12,
    "description": "Custom property type checking, default values, and animation.",
    "subtopics": [
      {
        "id": "acss-property-rule-basics",
        "title": "What is CSS Properties & Values API (@property)?",
        "conceptId": "advanced-css_acss_property_rule_whatis"
      },
      {
        "id": "acss-property-rule-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_property_rule_usage"
      },
      {
        "id": "acss-property-rule-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_property_rule_bestpractices"
      }
    ]
  },
  {
    "id": "acss-stacking-contexts",
    "subjectId": "advanced-css",
    "title": "Stacking Contexts Deep-Dive & Root Layers",
    "order": 13,
    "description": "How opacity, transforms, and filters create new stacking contexts.",
    "subtopics": [
      {
        "id": "acss-stacking-contexts-basics",
        "title": "What is Stacking Contexts Deep-Dive & Root Layers?",
        "conceptId": "advanced-css_acss_stacking_contexts_whatis"
      },
      {
        "id": "acss-stacking-contexts-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_stacking_contexts_usage"
      },
      {
        "id": "acss-stacking-contexts-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_stacking_contexts_bestpractices"
      }
    ]
  },
  {
    "id": "acss-compositing-gpu",
    "subjectId": "advanced-css",
    "title": "GPU Compositing Layers & will-change",
    "order": 14,
    "description": "Promoting elements to GPU layers for 60fps animations.",
    "subtopics": [
      {
        "id": "acss-compositing-gpu-basics",
        "title": "What is GPU Compositing Layers & will-change?",
        "conceptId": "advanced-css_acss_compositing_gpu_whatis"
      },
      {
        "id": "acss-compositing-gpu-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_compositing_gpu_usage"
      },
      {
        "id": "acss-compositing-gpu-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_compositing_gpu_bestpractices"
      }
    ]
  },
  {
    "id": "acss-contain-property",
    "subjectId": "advanced-css",
    "title": "CSS Containment: contain property",
    "order": 15,
    "description": "Isolating subtrees for layout, paint, and size performance.",
    "subtopics": [
      {
        "id": "acss-contain-property-basics",
        "title": "What is CSS Containment?",
        "conceptId": "advanced-css_acss_contain_property_whatis"
      },
      {
        "id": "acss-contain-property-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_contain_property_usage"
      },
      {
        "id": "acss-contain-property-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_contain_property_bestpractices"
      }
    ]
  },
  {
    "id": "acss-content-visibility",
    "subjectId": "advanced-css",
    "title": "CSS content-visibility: auto & Performance",
    "order": 16,
    "description": "Skipping off-screen rendering for massive page speed gains.",
    "subtopics": [
      {
        "id": "acss-content-visibility-basics",
        "title": "What is CSS content-visibility?",
        "conceptId": "advanced-css_acss_content_visibility_whatis"
      },
      {
        "id": "acss-content-visibility-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_content_visibility_usage"
      },
      {
        "id": "acss-content-visibility-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_content_visibility_bestpractices"
      }
    ]
  },
  {
    "id": "acss-view-transitions-spa",
    "subjectId": "advanced-css",
    "title": "View Transitions API: Single-Page Applications",
    "order": 17,
    "description": "Animating DOM state changes smoothly with document.startViewTransition.",
    "subtopics": [
      {
        "id": "acss-view-transitions-spa-basics",
        "title": "What is View Transitions API?",
        "conceptId": "advanced-css_acss_view_transitions_spa_whatis"
      },
      {
        "id": "acss-view-transitions-spa-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_view_transitions_spa_usage"
      },
      {
        "id": "acss-view-transitions-spa-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_view_transitions_spa_bestpractices"
      }
    ]
  },
  {
    "id": "acss-view-transitions-mpa",
    "subjectId": "advanced-css",
    "title": "View Transitions API: Multi-Page Navigation",
    "order": 18,
    "description": "Cross-document view transitions across server-rendered pages.",
    "subtopics": [
      {
        "id": "acss-view-transitions-mpa-basics",
        "title": "What is View Transitions API?",
        "conceptId": "advanced-css_acss_view_transitions_mpa_whatis"
      },
      {
        "id": "acss-view-transitions-mpa-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_view_transitions_mpa_usage"
      },
      {
        "id": "acss-view-transitions-mpa-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_view_transitions_mpa_bestpractices"
      }
    ]
  },
  {
    "id": "acss-scroll-animations",
    "subjectId": "advanced-css",
    "title": "Scroll-Driven Animations: animation-timeline",
    "order": 19,
    "description": "Linking keyframe animations to page or element scroll position.",
    "subtopics": [
      {
        "id": "acss-scroll-animations-basics",
        "title": "What is Scroll-Driven Animations?",
        "conceptId": "advanced-css_acss_scroll_animations_whatis"
      },
      {
        "id": "acss-scroll-animations-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_scroll_animations_usage"
      },
      {
        "id": "acss-scroll-animations-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_scroll_animations_bestpractices"
      }
    ]
  },
  {
    "id": "acss-motion-path",
    "subjectId": "advanced-css",
    "title": "CSS Motion Path: offset-path & offset-distance",
    "order": 20,
    "description": "Animating elements along custom SVG curves and paths.",
    "subtopics": [
      {
        "id": "acss-motion-path-basics",
        "title": "What is CSS Motion Path?",
        "conceptId": "advanced-css_acss_motion_path_whatis"
      },
      {
        "id": "acss-motion-path-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_motion_path_usage"
      },
      {
        "id": "acss-motion-path-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_motion_path_bestpractices"
      }
    ]
  },
  {
    "id": "acss-color-mix",
    "subjectId": "advanced-css",
    "title": "Modern Color Functions: color-mix() & Relative Colors",
    "order": 21,
    "description": "Blending colors dynamically in CSS.",
    "subtopics": [
      {
        "id": "acss-color-mix-basics",
        "title": "What is Modern Color Functions?",
        "conceptId": "advanced-css_acss_color_mix_whatis"
      },
      {
        "id": "acss-color-mix-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_color_mix_usage"
      },
      {
        "id": "acss-color-mix-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_color_mix_bestpractices"
      }
    ]
  },
  {
    "id": "acss-oklch-colors",
    "subjectId": "advanced-css",
    "title": "OKLCH Color Space & Wide-Gamut Displays (P3)",
    "order": 22,
    "description": "Perceptually uniform colors and brighter screen palettes.",
    "subtopics": [
      {
        "id": "acss-oklch-colors-basics",
        "title": "What is OKLCH Color Space & Wide-Gamut Displays (P3)?",
        "conceptId": "advanced-css_acss_oklch_colors_whatis"
      },
      {
        "id": "acss-oklch-colors-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_oklch_colors_usage"
      },
      {
        "id": "acss-oklch-colors-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_oklch_colors_bestpractices"
      }
    ]
  },
  {
    "id": "acss-variable-fonts",
    "subjectId": "advanced-css",
    "title": "Variable Fonts & Font-Variation-Settings",
    "order": 23,
    "description": "Controlling weight, width, and slant from a single font file.",
    "subtopics": [
      {
        "id": "acss-variable-fonts-basics",
        "title": "What is Variable Fonts & Font-Variation-Settings?",
        "conceptId": "advanced-css_acss_variable_fonts_whatis"
      },
      {
        "id": "acss-variable-fonts-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_variable_fonts_usage"
      },
      {
        "id": "acss-variable-fonts-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_variable_fonts_bestpractices"
      }
    ]
  },
  {
    "id": "acss-logical-properties",
    "subjectId": "advanced-css",
    "title": "CSS Logical Properties & Internationalization (RTL)",
    "order": 24,
    "description": "margin-inline, padding-block, and multilingual layouts.",
    "subtopics": [
      {
        "id": "acss-logical-properties-basics",
        "title": "What is CSS Logical Properties & Internationalization (RTL)?",
        "conceptId": "advanced-css_acss_logical_properties_whatis"
      },
      {
        "id": "acss-logical-properties-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_logical_properties_usage"
      },
      {
        "id": "acss-logical-properties-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_logical_properties_bestpractices"
      }
    ]
  },
  {
    "id": "acss-bem-methodology",
    "subjectId": "advanced-css",
    "title": "BEM (Block Element Modifier) at Scale",
    "order": 25,
    "description": "Structuring enterprise CSS class names to prevent conflicts.",
    "subtopics": [
      {
        "id": "acss-bem-methodology-basics",
        "title": "What is BEM (Block Element Modifier) at Scale?",
        "conceptId": "advanced-css_acss_bem_methodology_whatis"
      },
      {
        "id": "acss-bem-methodology-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_bem_methodology_usage"
      },
      {
        "id": "acss-bem-methodology-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_bem_methodology_bestpractices"
      }
    ]
  },
  {
    "id": "acss-itcss-architecture",
    "subjectId": "advanced-css",
    "title": "ITCSS (Inverted Triangle CSS) Structure",
    "order": 26,
    "description": "Organizing CSS layers from generic to high-specificity.",
    "subtopics": [
      {
        "id": "acss-itcss-architecture-basics",
        "title": "What is ITCSS (Inverted Triangle CSS) Structure?",
        "conceptId": "advanced-css_acss_itcss_architecture_whatis"
      },
      {
        "id": "acss-itcss-architecture-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_itcss_architecture_usage"
      },
      {
        "id": "acss-itcss-architecture-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_itcss_architecture_bestpractices"
      }
    ]
  },
  {
    "id": "acss-css-modules",
    "subjectId": "advanced-css",
    "title": "CSS Modules: Scoped Class Names & Hashes",
    "order": 27,
    "description": "Automated local scoping in modern frontend bundlers.",
    "subtopics": [
      {
        "id": "acss-css-modules-basics",
        "title": "What is CSS Modules?",
        "conceptId": "advanced-css_acss_css_modules_whatis"
      },
      {
        "id": "acss-css-modules-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_css_modules_usage"
      },
      {
        "id": "acss-css-modules-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_css_modules_bestpractices"
      }
    ]
  },
  {
    "id": "acss-css-in-js-vs-zero-runtime",
    "subjectId": "advanced-css",
    "title": "CSS-in-JS vs Zero-Runtime CSS (Tailwind, Vanilla Extract)",
    "order": 28,
    "description": "Runtime cost tradeoffs and build-time stylesheet generation.",
    "subtopics": [
      {
        "id": "acss-css-in-js-vs-zero-runtime-basics",
        "title": "What is CSS-in-JS vs Zero-Runtime CSS (Tailwind, Vanilla Extract)?",
        "conceptId": "advanced-css_acss_css_in_js_vs_zero_runtime_whatis"
      },
      {
        "id": "acss-css-in-js-vs-zero-runtime-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_css_in_js_vs_zero_runtime_usage"
      },
      {
        "id": "acss-css-in-js-vs-zero-runtime-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_css_in_js_vs_zero_runtime_bestpractices"
      }
    ]
  },
  {
    "id": "acss-design-tokens",
    "subjectId": "advanced-css",
    "title": "Design Tokens Architecture with CSS Variables",
    "order": 29,
    "description": "Managing multi-brand themes, dark mode, and design systems.",
    "subtopics": [
      {
        "id": "acss-design-tokens-basics",
        "title": "What is Design Tokens Architecture with CSS Variables?",
        "conceptId": "advanced-css_acss_design_tokens_whatis"
      },
      {
        "id": "acss-design-tokens-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_design_tokens_usage"
      },
      {
        "id": "acss-design-tokens-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_design_tokens_bestpractices"
      }
    ]
  },
  {
    "id": "acss-critical-css",
    "subjectId": "advanced-css",
    "title": "Critical CSS & Above-the-Fold Optimization",
    "order": 30,
    "description": "Inlining vital styles to eliminate render-blocking CSS.",
    "subtopics": [
      {
        "id": "acss-critical-css-basics",
        "title": "What is Critical CSS & Above-the-Fold Optimization?",
        "conceptId": "advanced-css_acss_critical_css_whatis"
      },
      {
        "id": "acss-critical-css-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_critical_css_usage"
      },
      {
        "id": "acss-critical-css-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_critical_css_bestpractices"
      }
    ]
  },
  {
    "id": "acss-layout-thrashing",
    "subjectId": "advanced-css",
    "title": "Preventing Layout Thrashing & Forced Reflows",
    "order": 31,
    "description": "How bad CSS/JS interactions destroy frame rates.",
    "subtopics": [
      {
        "id": "acss-layout-thrashing-basics",
        "title": "What is Preventing Layout Thrashing & Forced Reflows?",
        "conceptId": "advanced-css_acss_layout_thrashing_whatis"
      },
      {
        "id": "acss-layout-thrashing-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_layout_thrashing_usage"
      },
      {
        "id": "acss-layout-thrashing-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_layout_thrashing_bestpractices"
      }
    ]
  },
  {
    "id": "acss-media-features-v5",
    "subjectId": "advanced-css",
    "title": "Modern Media Features: prefers-reduced-motion & prefers-color-scheme",
    "order": 32,
    "description": "Respecting user OS preferences for animations and themes.",
    "subtopics": [
      {
        "id": "acss-media-features-v5-basics",
        "title": "What is Modern Media Features?",
        "conceptId": "advanced-css_acss_media_features_v5_whatis"
      },
      {
        "id": "acss-media-features-v5-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_media_features_v5_usage"
      },
      {
        "id": "acss-media-features-v5-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_media_features_v5_bestpractices"
      }
    ]
  },
  {
    "id": "acss-aspect-ratio",
    "subjectId": "advanced-css",
    "title": "The aspect-ratio Property & Responsive Sizing",
    "order": 33,
    "description": "Preventing layout shifts for images and video containers.",
    "subtopics": [
      {
        "id": "acss-aspect-ratio-basics",
        "title": "What is The aspect-ratio Property & Responsive Sizing?",
        "conceptId": "advanced-css_acss_aspect_ratio_whatis"
      },
      {
        "id": "acss-aspect-ratio-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_aspect_ratio_usage"
      },
      {
        "id": "acss-aspect-ratio-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_aspect_ratio_bestpractices"
      }
    ]
  },
  {
    "id": "acss-dialog-backdrop",
    "subjectId": "advanced-css",
    "title": "Styling the ::backdrop Pseudo-Element",
    "order": 34,
    "description": "Customizing modal overlays and popups.",
    "subtopics": [
      {
        "id": "acss-dialog-backdrop-basics",
        "title": "What is Styling the ?",
        "conceptId": "advanced-css_acss_dialog_backdrop_whatis"
      },
      {
        "id": "acss-dialog-backdrop-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_dialog_backdrop_usage"
      },
      {
        "id": "acss-dialog-backdrop-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_dialog_backdrop_bestpractices"
      }
    ]
  },
  {
    "id": "acss-print-optimization",
    "subjectId": "advanced-css",
    "title": "CSS Print Styles (@media print)",
    "order": 35,
    "description": "Preparing clean, printable stylesheets without website clutter.",
    "subtopics": [
      {
        "id": "acss-print-optimization-basics",
        "title": "What is CSS Print Styles (@media print)?",
        "conceptId": "advanced-css_acss_print_optimization_whatis"
      },
      {
        "id": "acss-print-optimization-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-css_acss_print_optimization_usage"
      },
      {
        "id": "acss-print-optimization-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-css_acss_print_optimization_bestpractices"
      }
    ]
  }
],

  "javascript": [
  {
    "id": "js-intro",
    "subjectId": "javascript",
    "title": "JavaScript Introduction & What is JS",
    "order": 1,
    "description": "What is JavaScript, client-side execution, and V8 engine basics.",
    "subtopics": [
      {
        "id": "js-intro-basics",
        "title": "What is JavaScript Introduction & What is JS?",
        "conceptId": "javascript_js_intro_whatis"
      },
      {
        "id": "js-intro-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_intro_usage"
      },
      {
        "id": "js-intro-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_intro_bestpractices"
      }
    ]
  },
  {
    "id": "js-where-to",
    "subjectId": "javascript",
    "title": "Where to Put JavaScript: Head, Body & External Scripts",
    "order": 2,
    "description": "Script tag placement, async, and defer attributes.",
    "subtopics": [
      {
        "id": "js-where-to-basics",
        "title": "What is Where to Put JavaScript?",
        "conceptId": "javascript_js_where_to_whatis"
      },
      {
        "id": "js-where-to-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_where_to_usage"
      },
      {
        "id": "js-where-to-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_where_to_bestpractices"
      }
    ]
  },
  {
    "id": "js-output",
    "subjectId": "javascript",
    "title": "JavaScript Output: console.log, innerHTML & alert",
    "order": 3,
    "description": "Printing data and inspecting variables in the browser.",
    "subtopics": [
      {
        "id": "js-output-basics",
        "title": "What is JavaScript Output?",
        "conceptId": "javascript_js_output_whatis"
      },
      {
        "id": "js-output-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_output_usage"
      },
      {
        "id": "js-output-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_output_bestpractices"
      }
    ]
  },
  {
    "id": "js-syntax-statements",
    "subjectId": "javascript",
    "title": "JavaScript Syntax, Statements & Semicolons",
    "order": 4,
    "description": "Statements, case sensitivity, camelCase, and automatic semicolon insertion.",
    "subtopics": [
      {
        "id": "js-syntax-statements-basics",
        "title": "What is JavaScript Syntax, Statements & Semicolons?",
        "conceptId": "javascript_js_syntax_statements_whatis"
      },
      {
        "id": "js-syntax-statements-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_syntax_statements_usage"
      },
      {
        "id": "js-syntax-statements-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_syntax_statements_bestpractices"
      }
    ]
  },
  {
    "id": "js-comments",
    "subjectId": "javascript",
    "title": "JavaScript Comments & JSDoc Basics",
    "order": 5,
    "description": "Single-line, multi-line comments, and type documentation.",
    "subtopics": [
      {
        "id": "js-comments-basics",
        "title": "What is JavaScript Comments & JSDoc Basics?",
        "conceptId": "javascript_js_comments_whatis"
      },
      {
        "id": "js-comments-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_comments_usage"
      },
      {
        "id": "js-comments-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_comments_bestpractices"
      }
    ]
  },
  {
    "id": "js-variables-var-let-const",
    "subjectId": "javascript",
    "title": "Variables: var vs let vs const",
    "order": 6,
    "description": "Scope differences, re-declaration, and reassignment rules.",
    "subtopics": [
      {
        "id": "js-variables-var-let-const-basics",
        "title": "What is Variables?",
        "conceptId": "javascript_js_variables_var_let_const_whatis"
      },
      {
        "id": "js-variables-var-let-const-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_variables_var_let_const_usage"
      },
      {
        "id": "js-variables-var-let-const-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_variables_var_let_const_bestpractices"
      }
    ]
  },
  {
    "id": "js-operators-arithmetic",
    "subjectId": "javascript",
    "title": "Arithmetic & Assignment Operators",
    "order": 7,
    "description": "Addition, subtraction, modulus, exponentiation, and assignment shortcuts.",
    "subtopics": [
      {
        "id": "js-operators-arithmetic-basics",
        "title": "What is Arithmetic & Assignment Operators?",
        "conceptId": "javascript_js_operators_arithmetic_whatis"
      },
      {
        "id": "js-operators-arithmetic-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_operators_arithmetic_usage"
      },
      {
        "id": "js-operators-arithmetic-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_operators_arithmetic_bestpractices"
      }
    ]
  },
  {
    "id": "js-operators-comparison",
    "subjectId": "javascript",
    "title": "Comparison & Logical Operators: == vs ===",
    "order": 8,
    "description": "Equality, strict equality, truthy/falsy, and logical AND/OR.",
    "subtopics": [
      {
        "id": "js-operators-comparison-basics",
        "title": "What is Comparison & Logical Operators?",
        "conceptId": "javascript_js_operators_comparison_whatis"
      },
      {
        "id": "js-operators-comparison-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_operators_comparison_usage"
      },
      {
        "id": "js-operators-comparison-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_operators_comparison_bestpractices"
      }
    ]
  },
  {
    "id": "js-data-types",
    "subjectId": "javascript",
    "title": "JavaScript Data Types: Primitives vs Objects",
    "order": 9,
    "description": "String, Number, Boolean, BigInt, Symbol, Null, Undefined, and Object.",
    "subtopics": [
      {
        "id": "js-data-types-basics",
        "title": "What is JavaScript Data Types?",
        "conceptId": "javascript_js_data_types_whatis"
      },
      {
        "id": "js-data-types-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_data_types_usage"
      },
      {
        "id": "js-data-types-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_data_types_bestpractices"
      }
    ]
  },
  {
    "id": "js-functions-basics",
    "subjectId": "javascript",
    "title": "Functions: Declarations, Parameters & Return",
    "order": 10,
    "description": "Declaring functions, calling them, and returning values.",
    "subtopics": [
      {
        "id": "js-functions-basics-basics",
        "title": "What is Functions?",
        "conceptId": "javascript_js_functions_basics_whatis"
      },
      {
        "id": "js-functions-basics-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_functions_basics_usage"
      },
      {
        "id": "js-functions-basics-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_functions_basics_bestpractices"
      }
    ]
  },
  {
    "id": "js-functions-expressions",
    "subjectId": "javascript",
    "title": "Function Expressions & Anonymous Functions",
    "order": 11,
    "description": "Functions as first-class citizens stored in variables.",
    "subtopics": [
      {
        "id": "js-functions-expressions-basics",
        "title": "What is Function Expressions & Anonymous Functions?",
        "conceptId": "javascript_js_functions_expressions_whatis"
      },
      {
        "id": "js-functions-expressions-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_functions_expressions_usage"
      },
      {
        "id": "js-functions-expressions-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_functions_expressions_bestpractices"
      }
    ]
  },
  {
    "id": "js-objects-basics",
    "subjectId": "javascript",
    "title": "JavaScript Objects: Properties & Values",
    "order": 12,
    "description": "Creating object literals, dot notation, and bracket notation.",
    "subtopics": [
      {
        "id": "js-objects-basics-basics",
        "title": "What is JavaScript Objects?",
        "conceptId": "javascript_js_objects_basics_whatis"
      },
      {
        "id": "js-objects-basics-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_objects_basics_usage"
      },
      {
        "id": "js-objects-basics-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_objects_basics_bestpractices"
      }
    ]
  },
  {
    "id": "js-object-methods",
    "subjectId": "javascript",
    "title": "Object Methods & The this Keyword Basics",
    "order": 13,
    "description": "Adding functions to objects and accessing object state.",
    "subtopics": [
      {
        "id": "js-object-methods-basics",
        "title": "What is Object Methods & The this Keyword Basics?",
        "conceptId": "javascript_js_object_methods_whatis"
      },
      {
        "id": "js-object-methods-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_object_methods_usage"
      },
      {
        "id": "js-object-methods-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_object_methods_bestpractices"
      }
    ]
  },
  {
    "id": "js-events-basics",
    "subjectId": "javascript",
    "title": "Browser Events: onclick, onchange & onload",
    "order": 14,
    "description": "Connecting user actions to JavaScript functions.",
    "subtopics": [
      {
        "id": "js-events-basics-basics",
        "title": "What is Browser Events?",
        "conceptId": "javascript_js_events_basics_whatis"
      },
      {
        "id": "js-events-basics-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_events_basics_usage"
      },
      {
        "id": "js-events-basics-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_events_basics_bestpractices"
      }
    ]
  },
  {
    "id": "js-strings-basics",
    "subjectId": "javascript",
    "title": "Strings & Escape Characters",
    "order": 15,
    "description": "Single quotes, double quotes, length property, and special characters.",
    "subtopics": [
      {
        "id": "js-strings-basics-basics",
        "title": "What is Strings & Escape Characters?",
        "conceptId": "javascript_js_strings_basics_whatis"
      },
      {
        "id": "js-strings-basics-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_strings_basics_usage"
      },
      {
        "id": "js-strings-basics-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_strings_basics_bestpractices"
      }
    ]
  },
  {
    "id": "js-strings-methods",
    "subjectId": "javascript",
    "title": "String Methods: slice, substring, replace, trim",
    "order": 16,
    "description": "Manipulating, searching, and trimming strings.",
    "subtopics": [
      {
        "id": "js-strings-methods-basics",
        "title": "What is String Methods?",
        "conceptId": "javascript_js_strings_methods_whatis"
      },
      {
        "id": "js-strings-methods-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_strings_methods_usage"
      },
      {
        "id": "js-strings-methods-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_strings_methods_bestpractices"
      }
    ]
  },
  {
    "id": "js-template-literals",
    "subjectId": "javascript",
    "title": "Template Literals: Backticks & String Interpolation",
    "order": 17,
    "description": "Embedding variables (${var}) and multi-line strings.",
    "subtopics": [
      {
        "id": "js-template-literals-basics",
        "title": "What is Template Literals?",
        "conceptId": "javascript_js_template_literals_whatis"
      },
      {
        "id": "js-template-literals-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_template_literals_usage"
      },
      {
        "id": "js-template-literals-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_template_literals_bestpractices"
      }
    ]
  },
  {
    "id": "js-numbers-methods",
    "subjectId": "javascript",
    "title": "Numbers & Number Methods: toFixed, parseInt, parseFloat",
    "order": 18,
    "description": "Floating point precision, NaN, and string-to-number conversion.",
    "subtopics": [
      {
        "id": "js-numbers-methods-basics",
        "title": "What is Numbers & Number Methods?",
        "conceptId": "javascript_js_numbers_methods_whatis"
      },
      {
        "id": "js-numbers-methods-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_numbers_methods_usage"
      },
      {
        "id": "js-numbers-methods-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_numbers_methods_bestpractices"
      }
    ]
  },
  {
    "id": "js-arrays-basics",
    "subjectId": "javascript",
    "title": "Arrays: Creating, Indexing & Length",
    "order": 19,
    "description": "Array literals, accessing items by index, and array length.",
    "subtopics": [
      {
        "id": "js-arrays-basics-basics",
        "title": "What is Arrays?",
        "conceptId": "javascript_js_arrays_basics_whatis"
      },
      {
        "id": "js-arrays-basics-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_arrays_basics_usage"
      },
      {
        "id": "js-arrays-basics-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_arrays_basics_bestpractices"
      }
    ]
  },
  {
    "id": "js-arrays-mutating-methods",
    "subjectId": "javascript",
    "title": "Array Mutating Methods: push, pop, shift, unshift, splice",
    "order": 20,
    "description": "Adding, removing, and replacing elements in arrays.",
    "subtopics": [
      {
        "id": "js-arrays-mutating-methods-basics",
        "title": "What is Array Mutating Methods?",
        "conceptId": "javascript_js_arrays_mutating_methods_whatis"
      },
      {
        "id": "js-arrays-mutating-methods-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_arrays_mutating_methods_usage"
      },
      {
        "id": "js-arrays-mutating-methods-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_arrays_mutating_methods_bestpractices"
      }
    ]
  },
  {
    "id": "js-arrays-search",
    "subjectId": "javascript",
    "title": "Array Searching: indexOf, includes, find, findIndex",
    "order": 21,
    "description": "Locating items and matching conditions in arrays.",
    "subtopics": [
      {
        "id": "js-arrays-search-basics",
        "title": "What is Array Searching?",
        "conceptId": "javascript_js_arrays_search_whatis"
      },
      {
        "id": "js-arrays-search-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_arrays_search_usage"
      },
      {
        "id": "js-arrays-search-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_arrays_search_bestpractices"
      }
    ]
  },
  {
    "id": "js-arrays-sort",
    "subjectId": "javascript",
    "title": "Array Sorting: sort() & reverse()",
    "order": 22,
    "description": "Numeric sorting, alphabetical sorting, and comparator functions.",
    "subtopics": [
      {
        "id": "js-arrays-sort-basics",
        "title": "What is Array Sorting?",
        "conceptId": "javascript_js_arrays_sort_whatis"
      },
      {
        "id": "js-arrays-sort-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_arrays_sort_usage"
      },
      {
        "id": "js-arrays-sort-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_arrays_sort_bestpractices"
      }
    ]
  },
  {
    "id": "js-arrays-iteration",
    "subjectId": "javascript",
    "title": "Array Iteration: forEach, map, filter, reduce",
    "order": 23,
    "description": "Functional programming methods for transforming and filtering lists.",
    "subtopics": [
      {
        "id": "js-arrays-iteration-basics",
        "title": "What is Array Iteration?",
        "conceptId": "javascript_js_arrays_iteration_whatis"
      },
      {
        "id": "js-arrays-iteration-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_arrays_iteration_usage"
      },
      {
        "id": "js-arrays-iteration-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_arrays_iteration_bestpractices"
      }
    ]
  },
  {
    "id": "js-dates",
    "subjectId": "javascript",
    "title": "JavaScript Date Object & Formatting",
    "order": 24,
    "description": "Creating dates, timestamps, getters, setters, and ISO strings.",
    "subtopics": [
      {
        "id": "js-dates-basics",
        "title": "What is JavaScript Date Object & Formatting?",
        "conceptId": "javascript_js_dates_whatis"
      },
      {
        "id": "js-dates-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_dates_usage"
      },
      {
        "id": "js-dates-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_dates_bestpractices"
      }
    ]
  },
  {
    "id": "js-math-object",
    "subjectId": "javascript",
    "title": "JavaScript Math Object: round, ceil, floor, random",
    "order": 25,
    "description": "Mathematical constants and generating random numbers.",
    "subtopics": [
      {
        "id": "js-math-object-basics",
        "title": "What is JavaScript Math Object?",
        "conceptId": "javascript_js_math_object_whatis"
      },
      {
        "id": "js-math-object-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_math_object_usage"
      },
      {
        "id": "js-math-object-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_math_object_bestpractices"
      }
    ]
  },
  {
    "id": "js-booleans-truthy-falsy",
    "subjectId": "javascript",
    "title": "Booleans & Truthy vs Falsy Values",
    "order": 26,
    "description": "The 7 falsy values in JavaScript and Boolean coercion.",
    "subtopics": [
      {
        "id": "js-booleans-truthy-falsy-basics",
        "title": "What is Booleans & Truthy vs Falsy Values?",
        "conceptId": "javascript_js_booleans_truthy_falsy_whatis"
      },
      {
        "id": "js-booleans-truthy-falsy-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_booleans_truthy_falsy_usage"
      },
      {
        "id": "js-booleans-truthy-falsy-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_booleans_truthy_falsy_bestpractices"
      }
    ]
  },
  {
    "id": "js-if-else",
    "subjectId": "javascript",
    "title": "Conditional Statements: if, else if, else & Ternary",
    "order": 27,
    "description": "Branching logic and ternary operator (? :).",
    "subtopics": [
      {
        "id": "js-if-else-basics",
        "title": "What is Conditional Statements?",
        "conceptId": "javascript_js_if_else_whatis"
      },
      {
        "id": "js-if-else-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_if_else_usage"
      },
      {
        "id": "js-if-else-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_if_else_bestpractices"
      }
    ]
  },
  {
    "id": "js-switch",
    "subjectId": "javascript",
    "title": "The Switch Statement & break Keyword",
    "order": 28,
    "description": "Multi-case matching and default fallbacks.",
    "subtopics": [
      {
        "id": "js-switch-basics",
        "title": "What is The Switch Statement & break Keyword?",
        "conceptId": "javascript_js_switch_whatis"
      },
      {
        "id": "js-switch-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_switch_usage"
      },
      {
        "id": "js-switch-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_switch_bestpractices"
      }
    ]
  },
  {
    "id": "js-loops-for",
    "subjectId": "javascript",
    "title": "The for Loop: Iterating Over Numbers and Lists",
    "order": 29,
    "description": "Loop syntax: initialization, condition, increment.",
    "subtopics": [
      {
        "id": "js-loops-for-basics",
        "title": "What is The for Loop?",
        "conceptId": "javascript_js_loops_for_whatis"
      },
      {
        "id": "js-loops-for-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_loops_for_usage"
      },
      {
        "id": "js-loops-for-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_loops_for_bestpractices"
      }
    ]
  },
  {
    "id": "js-loops-while",
    "subjectId": "javascript",
    "title": "The while & do...while Loops",
    "order": 30,
    "description": "Repeating code while a condition is true.",
    "subtopics": [
      {
        "id": "js-loops-while-basics",
        "title": "What is The while & do...while Loops?",
        "conceptId": "javascript_js_loops_while_whatis"
      },
      {
        "id": "js-loops-while-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_loops_while_usage"
      },
      {
        "id": "js-loops-while-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_loops_while_bestpractices"
      }
    ]
  },
  {
    "id": "js-loops-for-in-for-of",
    "subjectId": "javascript",
    "title": "for...in vs for...of Loops",
    "order": 31,
    "description": "Iterating over object keys vs iterable values.",
    "subtopics": [
      {
        "id": "js-loops-for-in-for-of-basics",
        "title": "What is for...in vs for...of Loops?",
        "conceptId": "javascript_js_loops_for_in_for_of_whatis"
      },
      {
        "id": "js-loops-for-in-for-of-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_loops_for_in_for_of_usage"
      },
      {
        "id": "js-loops-for-in-for-of-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_loops_for_in_for_of_bestpractices"
      }
    ]
  },
  {
    "id": "js-break-continue",
    "subjectId": "javascript",
    "title": "Break and Continue Statements in Loops",
    "order": 32,
    "description": "Exiting early or skipping iterations.",
    "subtopics": [
      {
        "id": "js-break-continue-basics",
        "title": "What is Break and Continue Statements in Loops?",
        "conceptId": "javascript_js_break_continue_whatis"
      },
      {
        "id": "js-break-continue-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_break_continue_usage"
      },
      {
        "id": "js-break-continue-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_break_continue_bestpractices"
      }
    ]
  },
  {
    "id": "js-sets",
    "subjectId": "javascript",
    "title": "JavaScript Set Object: Unique Values",
    "order": 33,
    "description": "Adding, checking (has), deleting, and deduplicating arrays.",
    "subtopics": [
      {
        "id": "js-sets-basics",
        "title": "What is JavaScript Set Object?",
        "conceptId": "javascript_js_sets_whatis"
      },
      {
        "id": "js-sets-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_sets_usage"
      },
      {
        "id": "js-sets-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_sets_bestpractices"
      }
    ]
  },
  {
    "id": "js-maps",
    "subjectId": "javascript",
    "title": "JavaScript Map Object: Key-Value Pairs",
    "order": 34,
    "description": "Map vs Object: arbitrary keys, size property, and ordering.",
    "subtopics": [
      {
        "id": "js-maps-basics",
        "title": "What is JavaScript Map Object?",
        "conceptId": "javascript_js_maps_whatis"
      },
      {
        "id": "js-maps-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_maps_usage"
      },
      {
        "id": "js-maps-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_maps_bestpractices"
      }
    ]
  },
  {
    "id": "js-typeof-type-conversion",
    "subjectId": "javascript",
    "title": "Typeof Operator & Explicit Type Conversion",
    "order": 35,
    "description": "String(), Number(), Boolean() conversion and typeof quirks.",
    "subtopics": [
      {
        "id": "js-typeof-type-conversion-basics",
        "title": "What is Typeof Operator & Explicit Type Conversion?",
        "conceptId": "javascript_js_typeof_type_conversion_whatis"
      },
      {
        "id": "js-typeof-type-conversion-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_typeof_type_conversion_usage"
      },
      {
        "id": "js-typeof-type-conversion-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_typeof_type_conversion_bestpractices"
      }
    ]
  },
  {
    "id": "js-regex-basics",
    "subjectId": "javascript",
    "title": "Regular Expressions (RegExp): test & match",
    "order": 36,
    "description": "Pattern matching, flags (g, i, m), and email validation.",
    "subtopics": [
      {
        "id": "js-regex-basics-basics",
        "title": "What is Regular Expressions (RegExp)?",
        "conceptId": "javascript_js_regex_basics_whatis"
      },
      {
        "id": "js-regex-basics-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_regex_basics_usage"
      },
      {
        "id": "js-regex-basics-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_regex_basics_bestpractices"
      }
    ]
  },
  {
    "id": "js-errors-try-catch",
    "subjectId": "javascript",
    "title": "Error Handling: try, catch, finally & throw",
    "order": 37,
    "description": "Catching runtime exceptions and creating custom Error objects.",
    "subtopics": [
      {
        "id": "js-errors-try-catch-basics",
        "title": "What is Error Handling?",
        "conceptId": "javascript_js_errors_try_catch_whatis"
      },
      {
        "id": "js-errors-try-catch-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_errors_try_catch_usage"
      },
      {
        "id": "js-errors-try-catch-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_errors_try_catch_bestpractices"
      }
    ]
  },
  {
    "id": "js-scope-global-local-block",
    "subjectId": "javascript",
    "title": "Scope: Global, Function & Block Scope",
    "order": 38,
    "description": "Where variables are accessible and lexical nesting.",
    "subtopics": [
      {
        "id": "js-scope-global-local-block-basics",
        "title": "What is Scope?",
        "conceptId": "javascript_js_scope_global_local_block_whatis"
      },
      {
        "id": "js-scope-global-local-block-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_scope_global_local_block_usage"
      },
      {
        "id": "js-scope-global-local-block-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_scope_global_local_block_bestpractices"
      }
    ]
  },
  {
    "id": "js-hoisting",
    "subjectId": "javascript",
    "title": "Hoisting: Variable & Function Hoisting",
    "order": 39,
    "description": "How JavaScript moves declarations to top of scope during parsing.",
    "subtopics": [
      {
        "id": "js-hoisting-basics",
        "title": "What is Hoisting?",
        "conceptId": "javascript_js_hoisting_whatis"
      },
      {
        "id": "js-hoisting-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_hoisting_usage"
      },
      {
        "id": "js-hoisting-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_hoisting_bestpractices"
      }
    ]
  },
  {
    "id": "js-strict-mode",
    "subjectId": "javascript",
    "title": "Strict Mode (\"use strict\")",
    "order": 40,
    "description": "Eliminating silent errors and preventing accidental globals.",
    "subtopics": [
      {
        "id": "js-strict-mode-basics",
        "title": "What is Strict Mode (\"use strict\")?",
        "conceptId": "javascript_js_strict_mode_whatis"
      },
      {
        "id": "js-strict-mode-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_strict_mode_usage"
      },
      {
        "id": "js-strict-mode-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_strict_mode_bestpractices"
      }
    ]
  },
  {
    "id": "js-this-keyword",
    "subjectId": "javascript",
    "title": "The this Keyword: 4 Binding Rules",
    "order": 41,
    "description": "Default, implicit, explicit (call/apply/bind), and new binding.",
    "subtopics": [
      {
        "id": "js-this-keyword-basics",
        "title": "What is The this Keyword?",
        "conceptId": "javascript_js_this_keyword_whatis"
      },
      {
        "id": "js-this-keyword-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_this_keyword_usage"
      },
      {
        "id": "js-this-keyword-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_this_keyword_bestpractices"
      }
    ]
  },
  {
    "id": "js-arrow-functions",
    "subjectId": "javascript",
    "title": "Arrow Functions & Lexical this",
    "order": 42,
    "description": "Concise syntax and inheriting this from surrounding scope.",
    "subtopics": [
      {
        "id": "js-arrow-functions-basics",
        "title": "What is Arrow Functions & Lexical this?",
        "conceptId": "javascript_js_arrow_functions_whatis"
      },
      {
        "id": "js-arrow-functions-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_arrow_functions_usage"
      },
      {
        "id": "js-arrow-functions-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_arrow_functions_bestpractices"
      }
    ]
  },
  {
    "id": "js-classes",
    "subjectId": "javascript",
    "title": "JavaScript Classes & Constructors",
    "order": 43,
    "description": "Class syntax, constructor methods, and instance properties.",
    "subtopics": [
      {
        "id": "js-classes-basics",
        "title": "What is JavaScript Classes & Constructors?",
        "conceptId": "javascript_js_classes_whatis"
      },
      {
        "id": "js-classes-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_classes_usage"
      },
      {
        "id": "js-classes-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_classes_bestpractices"
      }
    ]
  },
  {
    "id": "js-class-inheritance",
    "subjectId": "javascript",
    "title": "Class Inheritance: extends & super",
    "order": 44,
    "description": "Subclassing, overriding methods, and calling super().",
    "subtopics": [
      {
        "id": "js-class-inheritance-basics",
        "title": "What is Class Inheritance?",
        "conceptId": "javascript_js_class_inheritance_whatis"
      },
      {
        "id": "js-class-inheritance-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_class_inheritance_usage"
      },
      {
        "id": "js-class-inheritance-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_class_inheritance_bestpractices"
      }
    ]
  },
  {
    "id": "js-callbacks",
    "subjectId": "javascript",
    "title": "Callbacks & Callback Hell",
    "order": 45,
    "description": "Passing functions as arguments and handling asynchronous events.",
    "subtopics": [
      {
        "id": "js-callbacks-basics",
        "title": "What is Callbacks & Callback Hell?",
        "conceptId": "javascript_js_callbacks_whatis"
      },
      {
        "id": "js-callbacks-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_callbacks_usage"
      },
      {
        "id": "js-callbacks-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_callbacks_bestpractices"
      }
    ]
  },
  {
    "id": "js-promises-basics",
    "subjectId": "javascript",
    "title": "JavaScript Promises: resolve, reject & .then()",
    "order": 46,
    "description": "Pending, fulfilled, and rejected states in modern async JS.",
    "subtopics": [
      {
        "id": "js-promises-basics-basics",
        "title": "What is JavaScript Promises?",
        "conceptId": "javascript_js_promises_basics_whatis"
      },
      {
        "id": "js-promises-basics-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_promises_basics_usage"
      },
      {
        "id": "js-promises-basics-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_promises_basics_bestpractices"
      }
    ]
  },
  {
    "id": "js-async-await",
    "subjectId": "javascript",
    "title": "Async/Await Syntax",
    "order": 47,
    "description": "Writing asynchronous code that looks and reads like synchronous code.",
    "subtopics": [
      {
        "id": "js-async-await-basics",
        "title": "What is Async/Await Syntax?",
        "conceptId": "javascript_js_async_await_whatis"
      },
      {
        "id": "js-async-await-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_async_await_usage"
      },
      {
        "id": "js-async-await-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_async_await_bestpractices"
      }
    ]
  },
  {
    "id": "js-json",
    "subjectId": "javascript",
    "title": "JSON: JSON.parse & JSON.stringify",
    "order": 48,
    "description": "Serializing and deserializing data for web APIs.",
    "subtopics": [
      {
        "id": "js-json-basics",
        "title": "What is JSON?",
        "conceptId": "javascript_js_json_whatis"
      },
      {
        "id": "js-json-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_json_usage"
      },
      {
        "id": "js-json-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_json_bestpractices"
      }
    ]
  },
  {
    "id": "js-debugging-devtools",
    "subjectId": "javascript",
    "title": "Debugging with Browser DevTools & debugger",
    "order": 49,
    "description": "Breakpoints, stepping through code, and call stack inspection.",
    "subtopics": [
      {
        "id": "js-debugging-devtools-basics",
        "title": "What is Debugging with Browser DevTools & debugger?",
        "conceptId": "javascript_js_debugging_devtools_whatis"
      },
      {
        "id": "js-debugging-devtools-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_debugging_devtools_usage"
      },
      {
        "id": "js-debugging-devtools-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_debugging_devtools_bestpractices"
      }
    ]
  },
  {
    "id": "js-execution-context",
    "subjectId": "javascript",
    "title": "Execution Context & The Call Stack",
    "order": 50,
    "description": "Creation phase, execution phase, and stack frames in V8.",
    "subtopics": [
      {
        "id": "js-execution-context-basics",
        "title": "What is Execution Context & The Call Stack?",
        "conceptId": "javascript_js_execution_context_whatis"
      },
      {
        "id": "js-execution-context-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_execution_context_usage"
      },
      {
        "id": "js-execution-context-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_execution_context_bestpractices"
      }
    ]
  },
  {
    "id": "js-scope-chain-lexical",
    "subjectId": "javascript",
    "title": "Scope Chain & Lexical Environment",
    "order": 51,
    "description": "How JavaScript resolves variables across parent scopes.",
    "subtopics": [
      {
        "id": "js-scope-chain-lexical-basics",
        "title": "What is Scope Chain & Lexical Environment?",
        "conceptId": "javascript_js_scope_chain_lexical_whatis"
      },
      {
        "id": "js-scope-chain-lexical-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_scope_chain_lexical_usage"
      },
      {
        "id": "js-scope-chain-lexical-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_scope_chain_lexical_bestpractices"
      }
    ]
  },
  {
    "id": "js-closures",
    "subjectId": "javascript",
    "title": "Closures & Data Privacy",
    "order": 52,
    "description": "Functions retaining access to outer lexical scope variables.",
    "subtopics": [
      {
        "id": "js-closures-basics",
        "title": "What is Closures & Data Privacy?",
        "conceptId": "javascript_js_closures_whatis"
      },
      {
        "id": "js-closures-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_closures_usage"
      },
      {
        "id": "js-closures-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_closures_bestpractices"
      }
    ]
  },
  {
    "id": "js-prototypal-inheritance",
    "subjectId": "javascript",
    "title": "Prototypes & Prototypal Inheritance (__proto__)",
    "order": 53,
    "description": "How objects inherit properties through the prototype chain.",
    "subtopics": [
      {
        "id": "js-prototypal-inheritance-basics",
        "title": "What is Prototypes & Prototypal Inheritance (__proto__)?",
        "conceptId": "javascript_js_prototypal_inheritance_whatis"
      },
      {
        "id": "js-prototypal-inheritance-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_prototypal_inheritance_usage"
      },
      {
        "id": "js-prototypal-inheritance-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_prototypal_inheritance_bestpractices"
      }
    ]
  },
  {
    "id": "js-event-loop",
    "subjectId": "javascript",
    "title": "The JavaScript Event Loop & Concurrency Model",
    "order": 54,
    "description": "Call Stack, Web APIs, Task Queue, and Microtask Queue.",
    "subtopics": [
      {
        "id": "js-event-loop-basics",
        "title": "What is The JavaScript Event Loop & Concurrency Model?",
        "conceptId": "javascript_js_event_loop_whatis"
      },
      {
        "id": "js-event-loop-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_event_loop_usage"
      },
      {
        "id": "js-event-loop-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_event_loop_bestpractices"
      }
    ]
  },
  {
    "id": "js-microtasks-macrotasks",
    "subjectId": "javascript",
    "title": "Microtasks vs Macrotasks (Promises vs setTimeout)",
    "order": 55,
    "description": "Priority order in the event loop execution cycle.",
    "subtopics": [
      {
        "id": "js-microtasks-macrotasks-basics",
        "title": "What is Microtasks vs Macrotasks (Promises vs setTimeout)?",
        "conceptId": "javascript_js_microtasks_macrotasks_whatis"
      },
      {
        "id": "js-microtasks-macrotasks-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_microtasks_macrotasks_usage"
      },
      {
        "id": "js-microtasks-macrotasks-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_microtasks_macrotasks_bestpractices"
      }
    ]
  },
  {
    "id": "js-memory-gc",
    "subjectId": "javascript",
    "title": "V8 Memory Management & Garbage Collection",
    "order": 56,
    "description": "Stack vs Heap allocation, Mark-and-Sweep, and Scavenge.",
    "subtopics": [
      {
        "id": "js-memory-gc-basics",
        "title": "What is V8 Memory Management & Garbage Collection?",
        "conceptId": "javascript_js_memory_gc_whatis"
      },
      {
        "id": "js-memory-gc-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_memory_gc_usage"
      },
      {
        "id": "js-memory-gc-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_memory_gc_bestpractices"
      }
    ]
  },
  {
    "id": "js-memory-leaks",
    "subjectId": "javascript",
    "title": "Common Memory Leaks in JavaScript",
    "order": 57,
    "description": "Accidental globals, forgotten timers, and detached DOM nodes.",
    "subtopics": [
      {
        "id": "js-memory-leaks-basics",
        "title": "What is Common Memory Leaks in JavaScript?",
        "conceptId": "javascript_js_memory_leaks_whatis"
      },
      {
        "id": "js-memory-leaks-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_memory_leaks_usage"
      },
      {
        "id": "js-memory-leaks-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_memory_leaks_bestpractices"
      }
    ]
  },
  {
    "id": "js-dom-intro",
    "subjectId": "javascript",
    "title": "DOM Introduction & The DOM Tree",
    "order": 58,
    "description": "What is the Document Object Model and node hierarchy.",
    "subtopics": [
      {
        "id": "js-dom-intro-basics",
        "title": "What is DOM Introduction & The DOM Tree?",
        "conceptId": "javascript_js_dom_intro_whatis"
      },
      {
        "id": "js-dom-intro-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_dom_intro_usage"
      },
      {
        "id": "js-dom-intro-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_dom_intro_bestpractices"
      }
    ]
  },
  {
    "id": "js-dom-finding",
    "subjectId": "javascript",
    "title": "Finding DOM Elements: getElementById & querySelector",
    "order": 59,
    "description": "Selecting elements by ID, class, tag, and CSS selector.",
    "subtopics": [
      {
        "id": "js-dom-finding-basics",
        "title": "What is Finding DOM Elements?",
        "conceptId": "javascript_js_dom_finding_whatis"
      },
      {
        "id": "js-dom-finding-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_dom_finding_usage"
      },
      {
        "id": "js-dom-finding-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_dom_finding_bestpractices"
      }
    ]
  },
  {
    "id": "js-dom-modifying",
    "subjectId": "javascript",
    "title": "Modifying DOM Elements: innerHTML, textContent, setAttribute",
    "order": 60,
    "description": "Updating text, HTML content, attributes, and styles.",
    "subtopics": [
      {
        "id": "js-dom-modifying-basics",
        "title": "What is Modifying DOM Elements?",
        "conceptId": "javascript_js_dom_modifying_whatis"
      },
      {
        "id": "js-dom-modifying-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_dom_modifying_usage"
      },
      {
        "id": "js-dom-modifying-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_dom_modifying_bestpractices"
      }
    ]
  },
  {
    "id": "js-dom-events-listener",
    "subjectId": "javascript",
    "title": "Event Listeners: addEventListener & Event Object",
    "order": 61,
    "description": "Attaching events, event properties (target, type), and preventDefault.",
    "subtopics": [
      {
        "id": "js-dom-events-listener-basics",
        "title": "What is Event Listeners?",
        "conceptId": "javascript_js_dom_events_listener_whatis"
      },
      {
        "id": "js-dom-events-listener-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_dom_events_listener_usage"
      },
      {
        "id": "js-dom-events-listener-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_dom_events_listener_bestpractices"
      }
    ]
  },
  {
    "id": "js-dom-event-propagation",
    "subjectId": "javascript",
    "title": "Event Bubbling, Capturing & Event Delegation",
    "order": 62,
    "description": "How events propagate through the DOM and memory-efficient delegation.",
    "subtopics": [
      {
        "id": "js-dom-event-propagation-basics",
        "title": "What is Event Bubbling, Capturing & Event Delegation?",
        "conceptId": "javascript_js_dom_event_propagation_whatis"
      },
      {
        "id": "js-dom-event-propagation-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_dom_event_propagation_usage"
      },
      {
        "id": "js-dom-event-propagation-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_dom_event_propagation_bestpractices"
      }
    ]
  },
  {
    "id": "js-dom-traversal",
    "subjectId": "javascript",
    "title": "DOM Traversal: parentNode, children, nextSibling",
    "order": 63,
    "description": "Navigating relationships up and down the DOM tree.",
    "subtopics": [
      {
        "id": "js-dom-traversal-basics",
        "title": "What is DOM Traversal?",
        "conceptId": "javascript_js_dom_traversal_whatis"
      },
      {
        "id": "js-dom-traversal-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_dom_traversal_usage"
      },
      {
        "id": "js-dom-traversal-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_dom_traversal_bestpractices"
      }
    ]
  },
  {
    "id": "js-dom-creating-nodes",
    "subjectId": "javascript",
    "title": "Creating & Removing DOM Nodes: createElement & appendChild",
    "order": 64,
    "description": "Building dynamic elements and removing them from the page.",
    "subtopics": [
      {
        "id": "js-dom-creating-nodes-basics",
        "title": "What is Creating & Removing DOM Nodes?",
        "conceptId": "javascript_js_dom_creating_nodes_whatis"
      },
      {
        "id": "js-dom-creating-nodes-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_dom_creating_nodes_usage"
      },
      {
        "id": "js-dom-creating-nodes-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_dom_creating_nodes_bestpractices"
      }
    ]
  },
  {
    "id": "js-bom-basics",
    "subjectId": "javascript",
    "title": "Browser Object Model (BOM): window, location, navigator",
    "order": 65,
    "description": "Accessing browser URL, screen size, user agent, and history.",
    "subtopics": [
      {
        "id": "js-bom-basics-basics",
        "title": "What is Browser Object Model (BOM)?",
        "conceptId": "javascript_js_bom_basics_whatis"
      },
      {
        "id": "js-bom-basics-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "javascript_js_bom_basics_usage"
      },
      {
        "id": "js-bom-basics-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "javascript_js_bom_basics_bestpractices"
      }
    ]
  }
],

  "es6": [
  {
    "id": "es6-intro-history",
    "subjectId": "es6",
    "title": "ES6+ Introduction & ECMAScript Evolution",
    "order": 1,
    "description": "History of ES2015 (ES6) and the annual TC39 release process.",
    "subtopics": [
      {
        "id": "es6-intro-history-basics",
        "title": "What is ES6+ Introduction & ECMAScript Evolution?",
        "conceptId": "es6_es6_intro_history_whatis"
      },
      {
        "id": "es6-intro-history-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_intro_history_usage"
      },
      {
        "id": "es6-intro-history-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_intro_history_bestpractices"
      }
    ]
  },
  {
    "id": "es6-let-const-tdz",
    "subjectId": "es6",
    "title": "Let, Const & The Temporal Dead Zone (TDZ)",
    "order": 2,
    "description": "Block scoping and accessing variables before declaration.",
    "subtopics": [
      {
        "id": "es6-let-const-tdz-basics",
        "title": "What is Let, Const & The Temporal Dead Zone (TDZ)?",
        "conceptId": "es6_es6_let_const_tdz_whatis"
      },
      {
        "id": "es6-let-const-tdz-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_let_const_tdz_usage"
      },
      {
        "id": "es6-let-const-tdz-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_let_const_tdz_bestpractices"
      }
    ]
  },
  {
    "id": "es6-arrow-functions-deep",
    "subjectId": "es6",
    "title": "Arrow Functions vs Normal Functions Deep-Dive",
    "order": 3,
    "description": "Lexical this, arguments object absence, and constructor restrictions.",
    "subtopics": [
      {
        "id": "es6-arrow-functions-deep-basics",
        "title": "What is Arrow Functions vs Normal Functions Deep-Dive?",
        "conceptId": "es6_es6_arrow_functions_deep_whatis"
      },
      {
        "id": "es6-arrow-functions-deep-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_arrow_functions_deep_usage"
      },
      {
        "id": "es6-arrow-functions-deep-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_arrow_functions_deep_bestpractices"
      }
    ]
  },
  {
    "id": "es6-default-parameters",
    "subjectId": "es6",
    "title": "Default Function Parameters",
    "order": 4,
    "description": "Setting fallback values for missing arguments.",
    "subtopics": [
      {
        "id": "es6-default-parameters-basics",
        "title": "What is Default Function Parameters?",
        "conceptId": "es6_es6_default_parameters_whatis"
      },
      {
        "id": "es6-default-parameters-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_default_parameters_usage"
      },
      {
        "id": "es6-default-parameters-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_default_parameters_bestpractices"
      }
    ]
  },
  {
    "id": "es6-rest-parameters",
    "subjectId": "es6",
    "title": "Rest Parameters (...args)",
    "order": 5,
    "description": "Capturing variable numbers of function arguments into an array.",
    "subtopics": [
      {
        "id": "es6-rest-parameters-basics",
        "title": "What is Rest Parameters (...args)?",
        "conceptId": "es6_es6_rest_parameters_whatis"
      },
      {
        "id": "es6-rest-parameters-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_rest_parameters_usage"
      },
      {
        "id": "es6-rest-parameters-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_rest_parameters_bestpractices"
      }
    ]
  },
  {
    "id": "es6-spread-operator",
    "subjectId": "es6",
    "title": "Spread Operator (...arr) for Arrays & Objects",
    "order": 6,
    "description": "Shallow copying, merging objects, and spreading elements.",
    "subtopics": [
      {
        "id": "es6-spread-operator-basics",
        "title": "What is Spread Operator (...arr) for Arrays & Objects?",
        "conceptId": "es6_es6_spread_operator_whatis"
      },
      {
        "id": "es6-spread-operator-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_spread_operator_usage"
      },
      {
        "id": "es6-spread-operator-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_spread_operator_bestpractices"
      }
    ]
  },
  {
    "id": "es6-destructuring-arrays",
    "subjectId": "es6",
    "title": "Array Destructuring: Swapping & Skipping Items",
    "order": 7,
    "description": "Unpacking values from arrays into distinct variables.",
    "subtopics": [
      {
        "id": "es6-destructuring-arrays-basics",
        "title": "What is Array Destructuring?",
        "conceptId": "es6_es6_destructuring_arrays_whatis"
      },
      {
        "id": "es6-destructuring-arrays-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_destructuring_arrays_usage"
      },
      {
        "id": "es6-destructuring-arrays-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_destructuring_arrays_bestpractices"
      }
    ]
  },
  {
    "id": "es6-destructuring-objects",
    "subjectId": "es6",
    "title": "Object Destructuring: Aliasing & Default Values",
    "order": 8,
    "description": "Extracting properties, renaming variables, and nested destructuring.",
    "subtopics": [
      {
        "id": "es6-destructuring-objects-basics",
        "title": "What is Object Destructuring?",
        "conceptId": "es6_es6_destructuring_objects_whatis"
      },
      {
        "id": "es6-destructuring-objects-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_destructuring_objects_usage"
      },
      {
        "id": "es6-destructuring-objects-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_destructuring_objects_bestpractices"
      }
    ]
  },
  {
    "id": "es6-object-enhancements",
    "subjectId": "es6",
    "title": "Enhanced Object Literals & Computed Property Names",
    "order": 9,
    "description": "Property shorthand, method shorthand, and dynamic keys [key].",
    "subtopics": [
      {
        "id": "es6-object-enhancements-basics",
        "title": "What is Enhanced Object Literals & Computed Property Names?",
        "conceptId": "es6_es6_object_enhancements_whatis"
      },
      {
        "id": "es6-object-enhancements-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_object_enhancements_usage"
      },
      {
        "id": "es6-object-enhancements-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_object_enhancements_bestpractices"
      }
    ]
  },
  {
    "id": "es6-for-of-loop",
    "subjectId": "es6",
    "title": "The for...of Loop & Iterable Protocol",
    "order": 10,
    "description": "Iterating over arrays, strings, sets, and maps cleanly.",
    "subtopics": [
      {
        "id": "es6-for-of-loop-basics",
        "title": "What is The for...of Loop & Iterable Protocol?",
        "conceptId": "es6_es6_for_of_loop_whatis"
      },
      {
        "id": "es6-for-of-loop-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_for_of_loop_usage"
      },
      {
        "id": "es6-for-of-loop-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_for_of_loop_bestpractices"
      }
    ]
  },
  {
    "id": "es6-modules-import-export",
    "subjectId": "es6",
    "title": "ES Modules: import & export",
    "order": 11,
    "description": "Modular JavaScript, named exports, and default exports.",
    "subtopics": [
      {
        "id": "es6-modules-import-export-basics",
        "title": "What is ES Modules?",
        "conceptId": "es6_es6_modules_import_export_whatis"
      },
      {
        "id": "es6-modules-import-export-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_modules_import_export_usage"
      },
      {
        "id": "es6-modules-import-export-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_modules_import_export_bestpractices"
      }
    ]
  },
  {
    "id": "es6-dynamic-imports",
    "subjectId": "es6",
    "title": "Dynamic Imports: import() for Code Splitting",
    "order": 12,
    "description": "Loading modules on-demand for performance optimization.",
    "subtopics": [
      {
        "id": "es6-dynamic-imports-basics",
        "title": "What is Dynamic Imports?",
        "conceptId": "es6_es6_dynamic_imports_whatis"
      },
      {
        "id": "es6-dynamic-imports-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_dynamic_imports_usage"
      },
      {
        "id": "es6-dynamic-imports-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_dynamic_imports_bestpractices"
      }
    ]
  },
  {
    "id": "es6-promise-all",
    "subjectId": "es6",
    "title": "Promise.all & Parallel Async Operations",
    "order": 13,
    "description": "Waiting for multiple promises to fulfill and fail-fast behavior.",
    "subtopics": [
      {
        "id": "es6-promise-all-basics",
        "title": "What is Promise.all & Parallel Async Operations?",
        "conceptId": "es6_es6_promise_all_whatis"
      },
      {
        "id": "es6-promise-all-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_promise_all_usage"
      },
      {
        "id": "es6-promise-all-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_promise_all_bestpractices"
      }
    ]
  },
  {
    "id": "es6-promise-race",
    "subjectId": "es6",
    "title": "Promise.race & Request Timeouts",
    "order": 14,
    "description": "Resolving or rejecting as soon as the first promise settles.",
    "subtopics": [
      {
        "id": "es6-promise-race-basics",
        "title": "What is Promise.race & Request Timeouts?",
        "conceptId": "es6_es6_promise_race_whatis"
      },
      {
        "id": "es6-promise-race-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_promise_race_usage"
      },
      {
        "id": "es6-promise-race-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_promise_race_bestpractices"
      }
    ]
  },
  {
    "id": "es6-promise-allsettled",
    "subjectId": "es6",
    "title": "Promise.allSettled: Handling Partial Failures",
    "order": 15,
    "description": "Waiting for all promises regardless of rejection status.",
    "subtopics": [
      {
        "id": "es6-promise-allsettled-basics",
        "title": "What is Promise.allSettled?",
        "conceptId": "es6_es6_promise_allsettled_whatis"
      },
      {
        "id": "es6-promise-allsettled-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_promise_allsettled_usage"
      },
      {
        "id": "es6-promise-allsettled-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_promise_allsettled_bestpractices"
      }
    ]
  },
  {
    "id": "es6-promise-any",
    "subjectId": "es6",
    "title": "Promise.any & AggregateError",
    "order": 16,
    "description": "Resolving as soon as any promise succeeds.",
    "subtopics": [
      {
        "id": "es6-promise-any-basics",
        "title": "What is Promise.any & AggregateError?",
        "conceptId": "es6_es6_promise_any_whatis"
      },
      {
        "id": "es6-promise-any-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_promise_any_usage"
      },
      {
        "id": "es6-promise-any-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_promise_any_bestpractices"
      }
    ]
  },
  {
    "id": "es6-classes-syntax",
    "subjectId": "es6",
    "title": "Classes & Static Methods in ES6",
    "order": 17,
    "description": "Class declarations, constructors, and static utility functions.",
    "subtopics": [
      {
        "id": "es6-classes-syntax-basics",
        "title": "What is Classes & Static Methods in ES6?",
        "conceptId": "es6_es6_classes_syntax_whatis"
      },
      {
        "id": "es6-classes-syntax-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_classes_syntax_usage"
      },
      {
        "id": "es6-classes-syntax-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_classes_syntax_bestpractices"
      }
    ]
  },
  {
    "id": "es6-class-getters-setters",
    "subjectId": "es6",
    "title": "Class Getters and Setters",
    "order": 18,
    "description": "Encapsulating validation and computed properties.",
    "subtopics": [
      {
        "id": "es6-class-getters-setters-basics",
        "title": "What is Class Getters and Setters?",
        "conceptId": "es6_es6_class_getters_setters_whatis"
      },
      {
        "id": "es6-class-getters-setters-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_class_getters_setters_usage"
      },
      {
        "id": "es6-class-getters-setters-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_class_getters_setters_bestpractices"
      }
    ]
  },
  {
    "id": "es6-private-fields",
    "subjectId": "es6",
    "title": "Private Class Fields & Methods (#field)",
    "order": 19,
    "description": "True private encapsulation in modern JavaScript classes.",
    "subtopics": [
      {
        "id": "es6-private-fields-basics",
        "title": "What is Private Class Fields & Methods (#field)?",
        "conceptId": "es6_es6_private_fields_whatis"
      },
      {
        "id": "es6-private-fields-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_private_fields_usage"
      },
      {
        "id": "es6-private-fields-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_private_fields_bestpractices"
      }
    ]
  },
  {
    "id": "es6-symbols-basics",
    "subjectId": "es6",
    "title": "JavaScript Symbols: Unique Identifiers",
    "order": 20,
    "description": "Creating unique property keys that do not collide.",
    "subtopics": [
      {
        "id": "es6-symbols-basics-basics",
        "title": "What is JavaScript Symbols?",
        "conceptId": "es6_es6_symbols_basics_whatis"
      },
      {
        "id": "es6-symbols-basics-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_symbols_basics_usage"
      },
      {
        "id": "es6-symbols-basics-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_symbols_basics_bestpractices"
      }
    ]
  },
  {
    "id": "es6-well-known-symbols",
    "subjectId": "es6",
    "title": "Well-Known Symbols: Symbol.iterator & Symbol.toPrimitive",
    "order": 21,
    "description": "Customizing standard language behavior on objects.",
    "subtopics": [
      {
        "id": "es6-well-known-symbols-basics",
        "title": "What is Well-Known Symbols?",
        "conceptId": "es6_es6_well_known_symbols_whatis"
      },
      {
        "id": "es6-well-known-symbols-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_well_known_symbols_usage"
      },
      {
        "id": "es6-well-known-symbols-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_well_known_symbols_bestpractices"
      }
    ]
  },
  {
    "id": "es6-iterators-protocol",
    "subjectId": "es6",
    "title": "Iterators & The Iteration Protocol: next() & done",
    "order": 22,
    "description": "Making custom objects iterable with [Symbol.iterator].",
    "subtopics": [
      {
        "id": "es6-iterators-protocol-basics",
        "title": "What is Iterators & The Iteration Protocol?",
        "conceptId": "es6_es6_iterators_protocol_whatis"
      },
      {
        "id": "es6-iterators-protocol-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_iterators_protocol_usage"
      },
      {
        "id": "es6-iterators-protocol-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_iterators_protocol_bestpractices"
      }
    ]
  },
  {
    "id": "es6-generator-functions",
    "subjectId": "es6",
    "title": "Generator Functions (function*) & The yield Keyword",
    "order": 23,
    "description": "Pausable and resumable functions in JavaScript.",
    "subtopics": [
      {
        "id": "es6-generator-functions-basics",
        "title": "What is Generator Functions (function*) & The yield Keyword?",
        "conceptId": "es6_es6_generator_functions_whatis"
      },
      {
        "id": "es6-generator-functions-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_generator_functions_usage"
      },
      {
        "id": "es6-generator-functions-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_generator_functions_bestpractices"
      }
    ]
  },
  {
    "id": "es6-async-generators",
    "subjectId": "es6",
    "title": "Async Generators & for await...of",
    "order": 24,
    "description": "Streaming asynchronous data chunks one by one.",
    "subtopics": [
      {
        "id": "es6-async-generators-basics",
        "title": "What is Async Generators & for await...of?",
        "conceptId": "es6_es6_async_generators_whatis"
      },
      {
        "id": "es6-async-generators-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_async_generators_usage"
      },
      {
        "id": "es6-async-generators-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_async_generators_bestpractices"
      }
    ]
  },
  {
    "id": "es6-map-set-collections",
    "subjectId": "es6",
    "title": "Modern Collections: Map & Set",
    "order": 25,
    "description": "High-performance key-value lookups and unique sets.",
    "subtopics": [
      {
        "id": "es6-map-set-collections-basics",
        "title": "What is Modern Collections?",
        "conceptId": "es6_es6_map_set_collections_whatis"
      },
      {
        "id": "es6-map-set-collections-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_map_set_collections_usage"
      },
      {
        "id": "es6-map-set-collections-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_map_set_collections_bestpractices"
      }
    ]
  },
  {
    "id": "es6-weakmap-weakset",
    "subjectId": "es6",
    "title": "WeakMap & WeakSet: Garbage Collectible References",
    "order": 26,
    "description": "Storing metadata on objects without preventing garbage collection.",
    "subtopics": [
      {
        "id": "es6-weakmap-weakset-basics",
        "title": "What is WeakMap & WeakSet?",
        "conceptId": "es6_es6_weakmap_weakset_whatis"
      },
      {
        "id": "es6-weakmap-weakset-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_weakmap_weakset_usage"
      },
      {
        "id": "es6-weakmap-weakset-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_weakmap_weakset_bestpractices"
      }
    ]
  },
  {
    "id": "es6-proxy-object",
    "subjectId": "es6",
    "title": "The Proxy Object: Intercepting Object Operations",
    "order": 27,
    "description": "Getters, setters, traps, and reactive state systems.",
    "subtopics": [
      {
        "id": "es6-proxy-object-basics",
        "title": "What is The Proxy Object?",
        "conceptId": "es6_es6_proxy_object_whatis"
      },
      {
        "id": "es6-proxy-object-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_proxy_object_usage"
      },
      {
        "id": "es6-proxy-object-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_proxy_object_bestpractices"
      }
    ]
  },
  {
    "id": "es6-reflect-api",
    "subjectId": "es6",
    "title": "The Reflect API & Default Forwarding",
    "order": 28,
    "description": "Standardized metaprogramming methods paired with Proxy.",
    "subtopics": [
      {
        "id": "es6-reflect-api-basics",
        "title": "What is The Reflect API & Default Forwarding?",
        "conceptId": "es6_es6_reflect_api_whatis"
      },
      {
        "id": "es6-reflect-api-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_reflect_api_usage"
      },
      {
        "id": "es6-reflect-api-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_reflect_api_bestpractices"
      }
    ]
  },
  {
    "id": "es6-optional-chaining",
    "subjectId": "es6",
    "title": "Optional Chaining (?.) for Safe Property Access",
    "order": 29,
    "description": "Preventing \"Cannot read properties of undefined\" runtime errors.",
    "subtopics": [
      {
        "id": "es6-optional-chaining-basics",
        "title": "What is Optional Chaining (?.) for Safe Property Access?",
        "conceptId": "es6_es6_optional_chaining_whatis"
      },
      {
        "id": "es6-optional-chaining-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_optional_chaining_usage"
      },
      {
        "id": "es6-optional-chaining-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_optional_chaining_bestpractices"
      }
    ]
  },
  {
    "id": "es6-nullish-coalescing",
    "subjectId": "es6",
    "title": "Nullish Coalescing (??) vs OR (||)",
    "order": 30,
    "description": "Defaulting only on null or undefined, preserving 0 and false.",
    "subtopics": [
      {
        "id": "es6-nullish-coalescing-basics",
        "title": "What is Nullish Coalescing (??) vs OR (||)?",
        "conceptId": "es6_es6_nullish_coalescing_whatis"
      },
      {
        "id": "es6-nullish-coalescing-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_nullish_coalescing_usage"
      },
      {
        "id": "es6-nullish-coalescing-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_nullish_coalescing_bestpractices"
      }
    ]
  },
  {
    "id": "es6-logical-assignment",
    "subjectId": "es6",
    "title": "Logical Assignment Operators: &&=, ||=, ??=",
    "order": 31,
    "description": "Short-circuit assignment operators in modern JS.",
    "subtopics": [
      {
        "id": "es6-logical-assignment-basics",
        "title": "What is Logical Assignment Operators?",
        "conceptId": "es6_es6_logical_assignment_whatis"
      },
      {
        "id": "es6-logical-assignment-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_logical_assignment_usage"
      },
      {
        "id": "es6-logical-assignment-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_logical_assignment_bestpractices"
      }
    ]
  },
  {
    "id": "es6-numeric-separators",
    "subjectId": "es6",
    "title": "Numeric Separators (1_000_000)",
    "order": 32,
    "description": "Improving number readability in code.",
    "subtopics": [
      {
        "id": "es6-numeric-separators-basics",
        "title": "What is Numeric Separators (1_000_000)?",
        "conceptId": "es6_es6_numeric_separators_whatis"
      },
      {
        "id": "es6-numeric-separators-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_numeric_separators_usage"
      },
      {
        "id": "es6-numeric-separators-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_numeric_separators_bestpractices"
      }
    ]
  },
  {
    "id": "es6-object-entries-values",
    "subjectId": "es6",
    "title": "Object.entries, Object.values & Object.fromEntries",
    "order": 33,
    "description": "Converting objects to arrays and back seamlessly.",
    "subtopics": [
      {
        "id": "es6-object-entries-values-basics",
        "title": "What is Object.entries, Object.values & Object.fromEntries?",
        "conceptId": "es6_es6_object_entries_values_whatis"
      },
      {
        "id": "es6-object-entries-values-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_object_entries_values_usage"
      },
      {
        "id": "es6-object-entries-values-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_object_entries_values_bestpractices"
      }
    ]
  },
  {
    "id": "es6-array-flat-flatmap",
    "subjectId": "es6",
    "title": "Array.prototype.flat & flatMap",
    "order": 34,
    "description": "Flattening nested arrays and mapping concurrently.",
    "subtopics": [
      {
        "id": "es6-array-flat-flatmap-basics",
        "title": "What is Array.prototype.flat & flatMap?",
        "conceptId": "es6_es6_array_flat_flatmap_whatis"
      },
      {
        "id": "es6-array-flat-flatmap-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_array_flat_flatmap_usage"
      },
      {
        "id": "es6-array-flat-flatmap-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_array_flat_flatmap_bestpractices"
      }
    ]
  },
  {
    "id": "es6-top-level-await",
    "subjectId": "es6",
    "title": "Top-Level await in ES Modules",
    "order": 35,
    "description": "Using await outside of async functions at the module root.",
    "subtopics": [
      {
        "id": "es6-top-level-await-basics",
        "title": "What is Top-Level await in ES Modules?",
        "conceptId": "es6_es6_top_level_await_whatis"
      },
      {
        "id": "es6-top-level-await-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "es6_es6_top_level_await_usage"
      },
      {
        "id": "es6-top-level-await-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "es6_es6_top_level_await_bestpractices"
      }
    ]
  }
],

  "typescript": [
  {
    "id": "ts-intro-benefits",
    "subjectId": "typescript",
    "title": "TypeScript Introduction: Static Typing for JS",
    "order": 1,
    "description": "Why TypeScript was created and how it catches bugs at compile-time.",
    "subtopics": [
      {
        "id": "ts-intro-benefits-basics",
        "title": "What is TypeScript Introduction?",
        "conceptId": "typescript_ts_intro_benefits_whatis"
      },
      {
        "id": "ts-intro-benefits-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_intro_benefits_usage"
      },
      {
        "id": "ts-intro-benefits-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_intro_benefits_bestpractices"
      }
    ]
  },
  {
    "id": "ts-setup-compiler",
    "subjectId": "typescript",
    "title": "TypeScript Setup & Compiler (tsc)",
    "order": 2,
    "description": "Installing typescript, running tsc, and compilation targets.",
    "subtopics": [
      {
        "id": "ts-setup-compiler-basics",
        "title": "What is TypeScript Setup & Compiler (tsc)?",
        "conceptId": "typescript_ts_setup_compiler_whatis"
      },
      {
        "id": "ts-setup-compiler-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_setup_compiler_usage"
      },
      {
        "id": "ts-setup-compiler-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_setup_compiler_bestpractices"
      }
    ]
  },
  {
    "id": "ts-config-json",
    "subjectId": "typescript",
    "title": "tsconfig.json Explained: strict, target, module",
    "order": 3,
    "description": "Understanding crucial compiler flags and configuration options.",
    "subtopics": [
      {
        "id": "ts-config-json-basics",
        "title": "What is tsconfig.json Explained?",
        "conceptId": "typescript_ts_config_json_whatis"
      },
      {
        "id": "ts-config-json-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_config_json_usage"
      },
      {
        "id": "ts-config-json-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_config_json_bestpractices"
      }
    ]
  },
  {
    "id": "ts-primitives",
    "subjectId": "typescript",
    "title": "Primitive Types: number, string, boolean",
    "order": 4,
    "description": "Basic type annotations and type inference.",
    "subtopics": [
      {
        "id": "ts-primitives-basics",
        "title": "What is Primitive Types?",
        "conceptId": "typescript_ts_primitives_whatis"
      },
      {
        "id": "ts-primitives-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_primitives_usage"
      },
      {
        "id": "ts-primitives-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_primitives_bestpractices"
      }
    ]
  },
  {
    "id": "ts-arrays-tuples",
    "subjectId": "typescript",
    "title": "Arrays & Tuples in TypeScript",
    "order": 5,
    "description": "Typed arrays (string[]) and fixed-length typed tuples ([number, string]).",
    "subtopics": [
      {
        "id": "ts-arrays-tuples-basics",
        "title": "What is Arrays & Tuples in TypeScript?",
        "conceptId": "typescript_ts_arrays_tuples_whatis"
      },
      {
        "id": "ts-arrays-tuples-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_arrays_tuples_usage"
      },
      {
        "id": "ts-arrays-tuples-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_arrays_tuples_bestpractices"
      }
    ]
  },
  {
    "id": "ts-object-types",
    "subjectId": "typescript",
    "title": "Object Types & Type Annotations",
    "order": 6,
    "description": "Typing objects, optional properties (?), and readonly keys.",
    "subtopics": [
      {
        "id": "ts-object-types-basics",
        "title": "What is Object Types & Type Annotations?",
        "conceptId": "typescript_ts_object_types_whatis"
      },
      {
        "id": "ts-object-types-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_object_types_usage"
      },
      {
        "id": "ts-object-types-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_object_types_bestpractices"
      }
    ]
  },
  {
    "id": "ts-any-unknown-never",
    "subjectId": "typescript",
    "title": "Any vs Unknown vs Never Types",
    "order": 7,
    "description": "Type safety spectrum: dangerous any, safe unknown, and unreachable never.",
    "subtopics": [
      {
        "id": "ts-any-unknown-never-basics",
        "title": "What is Any vs Unknown vs Never Types?",
        "conceptId": "typescript_ts_any_unknown_never_whatis"
      },
      {
        "id": "ts-any-unknown-never-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_any_unknown_never_usage"
      },
      {
        "id": "ts-any-unknown-never-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_any_unknown_never_bestpractices"
      }
    ]
  },
  {
    "id": "ts-void-null-undefined",
    "subjectId": "typescript",
    "title": "Void, Null, and Undefined Types",
    "order": 8,
    "description": "Typing functions that return nothing and strictNullChecks.",
    "subtopics": [
      {
        "id": "ts-void-null-undefined-basics",
        "title": "What is Void, Null, and Undefined Types?",
        "conceptId": "typescript_ts_void_null_undefined_whatis"
      },
      {
        "id": "ts-void-null-undefined-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_void_null_undefined_usage"
      },
      {
        "id": "ts-void-null-undefined-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_void_null_undefined_bestpractices"
      }
    ]
  },
  {
    "id": "ts-union-types",
    "subjectId": "typescript",
    "title": "Union Types (|): Accepting Multiple Types",
    "order": 9,
    "description": "Creating flexible APIs that accept multiple types.",
    "subtopics": [
      {
        "id": "ts-union-types-basics",
        "title": "What is Union Types (|)?",
        "conceptId": "typescript_ts_union_types_whatis"
      },
      {
        "id": "ts-union-types-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_union_types_usage"
      },
      {
        "id": "ts-union-types-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_union_types_bestpractices"
      }
    ]
  },
  {
    "id": "ts-intersection-types",
    "subjectId": "typescript",
    "title": "Intersection Types (&): Combining Types",
    "order": 10,
    "description": "Merging multiple object types into a single compound type.",
    "subtopics": [
      {
        "id": "ts-intersection-types-basics",
        "title": "What is Intersection Types (&)?",
        "conceptId": "typescript_ts_intersection_types_whatis"
      },
      {
        "id": "ts-intersection-types-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_intersection_types_usage"
      },
      {
        "id": "ts-intersection-types-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_intersection_types_bestpractices"
      }
    ]
  },
  {
    "id": "ts-type-aliases",
    "subjectId": "typescript",
    "title": "Type Aliases (type Keyword)",
    "order": 11,
    "description": "Creating custom reusable type names.",
    "subtopics": [
      {
        "id": "ts-type-aliases-basics",
        "title": "What is Type Aliases (type Keyword)?",
        "conceptId": "typescript_ts_type_aliases_whatis"
      },
      {
        "id": "ts-type-aliases-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_type_aliases_usage"
      },
      {
        "id": "ts-type-aliases-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_type_aliases_bestpractices"
      }
    ]
  },
  {
    "id": "ts-literal-types",
    "subjectId": "typescript",
    "title": "Literal Types: String, Numeric & Boolean Literals",
    "order": 12,
    "description": "Constraining variables to exact specific values.",
    "subtopics": [
      {
        "id": "ts-literal-types-basics",
        "title": "What is Literal Types?",
        "conceptId": "typescript_ts_literal_types_whatis"
      },
      {
        "id": "ts-literal-types-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_literal_types_usage"
      },
      {
        "id": "ts-literal-types-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_literal_types_bestpractices"
      }
    ]
  },
  {
    "id": "ts-enums",
    "subjectId": "typescript",
    "title": "Enums: Numeric, String & Const Enums",
    "order": 13,
    "description": "Named constants and runtime enum representation.",
    "subtopics": [
      {
        "id": "ts-enums-basics",
        "title": "What is Enums?",
        "conceptId": "typescript_ts_enums_whatis"
      },
      {
        "id": "ts-enums-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_enums_usage"
      },
      {
        "id": "ts-enums-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_enums_bestpractices"
      }
    ]
  },
  {
    "id": "ts-functions-typing",
    "subjectId": "typescript",
    "title": "Typing Functions: Parameters & Return Types",
    "order": 14,
    "description": "Explicit function signatures and typing callbacks.",
    "subtopics": [
      {
        "id": "ts-functions-typing-basics",
        "title": "What is Typing Functions?",
        "conceptId": "typescript_ts_functions_typing_whatis"
      },
      {
        "id": "ts-functions-typing-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_functions_typing_usage"
      },
      {
        "id": "ts-functions-typing-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_functions_typing_bestpractices"
      }
    ]
  },
  {
    "id": "ts-optional-default-params",
    "subjectId": "typescript",
    "title": "Optional & Default Parameters in Functions",
    "order": 15,
    "description": "Handling optional arguments and default values in TS.",
    "subtopics": [
      {
        "id": "ts-optional-default-params-basics",
        "title": "What is Optional & Default Parameters in Functions?",
        "conceptId": "typescript_ts_optional_default_params_whatis"
      },
      {
        "id": "ts-optional-default-params-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_optional_default_params_usage"
      },
      {
        "id": "ts-optional-default-params-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_optional_default_params_bestpractices"
      }
    ]
  },
  {
    "id": "ts-interfaces-basics",
    "subjectId": "typescript",
    "title": "Interfaces: Defining Object Contracts",
    "order": 16,
    "description": "Interface syntax, properties, and methods.",
    "subtopics": [
      {
        "id": "ts-interfaces-basics-basics",
        "title": "What is Interfaces?",
        "conceptId": "typescript_ts_interfaces_basics_whatis"
      },
      {
        "id": "ts-interfaces-basics-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_interfaces_basics_usage"
      },
      {
        "id": "ts-interfaces-basics-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_interfaces_basics_bestpractices"
      }
    ]
  },
  {
    "id": "ts-interfaces-vs-types",
    "subjectId": "typescript",
    "title": "Interfaces vs Type Aliases: When to Use Which",
    "order": 17,
    "description": "Declaration merging, union capabilities, and best practices.",
    "subtopics": [
      {
        "id": "ts-interfaces-vs-types-basics",
        "title": "What is Interfaces vs Type Aliases?",
        "conceptId": "typescript_ts_interfaces_vs_types_whatis"
      },
      {
        "id": "ts-interfaces-vs-types-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_interfaces_vs_types_usage"
      },
      {
        "id": "ts-interfaces-vs-types-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_interfaces_vs_types_bestpractices"
      }
    ]
  },
  {
    "id": "ts-extending-interfaces",
    "subjectId": "typescript",
    "title": "Extending Interfaces (extends)",
    "order": 18,
    "description": "Inheriting properties from multiple parent interfaces.",
    "subtopics": [
      {
        "id": "ts-extending-interfaces-basics",
        "title": "What is Extending Interfaces (extends)?",
        "conceptId": "typescript_ts_extending_interfaces_whatis"
      },
      {
        "id": "ts-extending-interfaces-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_extending_interfaces_usage"
      },
      {
        "id": "ts-extending-interfaces-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_extending_interfaces_bestpractices"
      }
    ]
  },
  {
    "id": "ts-classes",
    "subjectId": "typescript",
    "title": "Classes in TypeScript: Fields & Constructors",
    "order": 19,
    "description": "Class syntax with type annotations and parameter properties.",
    "subtopics": [
      {
        "id": "ts-classes-basics",
        "title": "What is Classes in TypeScript?",
        "conceptId": "typescript_ts_classes_whatis"
      },
      {
        "id": "ts-classes-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_classes_usage"
      },
      {
        "id": "ts-classes-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_classes_bestpractices"
      }
    ]
  },
  {
    "id": "ts-access-modifiers",
    "subjectId": "typescript",
    "title": "Access Modifiers: public, private, protected",
    "order": 20,
    "description": "Compile-time encapsulation in TypeScript classes.",
    "subtopics": [
      {
        "id": "ts-access-modifiers-basics",
        "title": "What is Access Modifiers?",
        "conceptId": "typescript_ts_access_modifiers_whatis"
      },
      {
        "id": "ts-access-modifiers-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_access_modifiers_usage"
      },
      {
        "id": "ts-access-modifiers-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_access_modifiers_bestpractices"
      }
    ]
  },
  {
    "id": "ts-readonly-properties",
    "subjectId": "typescript",
    "title": "Readonly Properties & Immutability",
    "order": 21,
    "description": "Preventing property reassignment after initialization.",
    "subtopics": [
      {
        "id": "ts-readonly-properties-basics",
        "title": "What is Readonly Properties & Immutability?",
        "conceptId": "typescript_ts_readonly_properties_whatis"
      },
      {
        "id": "ts-readonly-properties-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_readonly_properties_usage"
      },
      {
        "id": "ts-readonly-properties-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_readonly_properties_bestpractices"
      }
    ]
  },
  {
    "id": "ts-abstract-classes",
    "subjectId": "typescript",
    "title": "Abstract Classes & Abstract Methods",
    "order": 22,
    "description": "Base classes that cannot be instantiated directly.",
    "subtopics": [
      {
        "id": "ts-abstract-classes-basics",
        "title": "What is Abstract Classes & Abstract Methods?",
        "conceptId": "typescript_ts_abstract_classes_whatis"
      },
      {
        "id": "ts-abstract-classes-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_abstract_classes_usage"
      },
      {
        "id": "ts-abstract-classes-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_abstract_classes_bestpractices"
      }
    ]
  },
  {
    "id": "ts-generics-basics",
    "subjectId": "typescript",
    "title": "Generics Introduction: Reusable Type Logic",
    "order": 23,
    "description": "What are type variables (<T>) and why they matter.",
    "subtopics": [
      {
        "id": "ts-generics-basics-basics",
        "title": "What is Generics Introduction?",
        "conceptId": "typescript_ts_generics_basics_whatis"
      },
      {
        "id": "ts-generics-basics-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_generics_basics_usage"
      },
      {
        "id": "ts-generics-basics-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_generics_basics_bestpractices"
      }
    ]
  },
  {
    "id": "ts-generic-functions",
    "subjectId": "typescript",
    "title": "Generic Functions",
    "order": 24,
    "description": "Writing functions that work across multiple types safely.",
    "subtopics": [
      {
        "id": "ts-generic-functions-basics",
        "title": "What is Generic Functions?",
        "conceptId": "typescript_ts_generic_functions_whatis"
      },
      {
        "id": "ts-generic-functions-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_generic_functions_usage"
      },
      {
        "id": "ts-generic-functions-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_generic_functions_bestpractices"
      }
    ]
  },
  {
    "id": "ts-generic-interfaces",
    "subjectId": "typescript",
    "title": "Generic Interfaces & Type Aliases",
    "order": 25,
    "description": "Building reusable data contracts like ApiResponse<T>.",
    "subtopics": [
      {
        "id": "ts-generic-interfaces-basics",
        "title": "What is Generic Interfaces & Type Aliases?",
        "conceptId": "typescript_ts_generic_interfaces_whatis"
      },
      {
        "id": "ts-generic-interfaces-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_generic_interfaces_usage"
      },
      {
        "id": "ts-generic-interfaces-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_generic_interfaces_bestpractices"
      }
    ]
  },
  {
    "id": "ts-generic-constraints",
    "subjectId": "typescript",
    "title": "Generic Constraints (T extends object)",
    "order": 26,
    "description": "Constraining generic types to specific shapes.",
    "subtopics": [
      {
        "id": "ts-generic-constraints-basics",
        "title": "What is Generic Constraints (T extends object)?",
        "conceptId": "typescript_ts_generic_constraints_whatis"
      },
      {
        "id": "ts-generic-constraints-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_generic_constraints_usage"
      },
      {
        "id": "ts-generic-constraints-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_generic_constraints_bestpractices"
      }
    ]
  },
  {
    "id": "ts-keyof-operator",
    "subjectId": "typescript",
    "title": "The keyof Type Operator",
    "order": 27,
    "description": "Extracting the keys of an object type as a union of strings.",
    "subtopics": [
      {
        "id": "ts-keyof-operator-basics",
        "title": "What is The keyof Type Operator?",
        "conceptId": "typescript_ts_keyof_operator_whatis"
      },
      {
        "id": "ts-keyof-operator-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_keyof_operator_usage"
      },
      {
        "id": "ts-keyof-operator-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_keyof_operator_bestpractices"
      }
    ]
  },
  {
    "id": "ts-typeof-operator",
    "subjectId": "typescript",
    "title": "The typeof Type Operator",
    "order": 28,
    "description": "Querying the type of an existing JavaScript variable.",
    "subtopics": [
      {
        "id": "ts-typeof-operator-basics",
        "title": "What is The typeof Type Operator?",
        "conceptId": "typescript_ts_typeof_operator_whatis"
      },
      {
        "id": "ts-typeof-operator-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_typeof_operator_usage"
      },
      {
        "id": "ts-typeof-operator-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_typeof_operator_bestpractices"
      }
    ]
  },
  {
    "id": "ts-type-narrowing-typeof",
    "subjectId": "typescript",
    "title": "Type Narrowing: typeof & Truthiness Guards",
    "order": 29,
    "description": "Refining broad types inside conditional if blocks.",
    "subtopics": [
      {
        "id": "ts-type-narrowing-typeof-basics",
        "title": "What is Type Narrowing?",
        "conceptId": "typescript_ts_type_narrowing_typeof_whatis"
      },
      {
        "id": "ts-type-narrowing-typeof-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_type_narrowing_typeof_usage"
      },
      {
        "id": "ts-type-narrowing-typeof-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_type_narrowing_typeof_bestpractices"
      }
    ]
  },
  {
    "id": "ts-instanceof-guard",
    "subjectId": "typescript",
    "title": "The instanceof Type Guard",
    "order": 30,
    "description": "Narrowing class instances and error types.",
    "subtopics": [
      {
        "id": "ts-instanceof-guard-basics",
        "title": "What is The instanceof Type Guard?",
        "conceptId": "typescript_ts_instanceof_guard_whatis"
      },
      {
        "id": "ts-instanceof-guard-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_instanceof_guard_usage"
      },
      {
        "id": "ts-instanceof-guard-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_instanceof_guard_bestpractices"
      }
    ]
  },
  {
    "id": "ts-user-defined-guards",
    "subjectId": "typescript",
    "title": "User-Defined Type Guards: is Keyword",
    "order": 31,
    "description": "Writing custom type predicate functions (val is User).",
    "subtopics": [
      {
        "id": "ts-user-defined-guards-basics",
        "title": "What is User-Defined Type Guards?",
        "conceptId": "typescript_ts_user_defined_guards_whatis"
      },
      {
        "id": "ts-user-defined-guards-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_user_defined_guards_usage"
      },
      {
        "id": "ts-user-defined-guards-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_user_defined_guards_bestpractices"
      }
    ]
  },
  {
    "id": "ts-discriminated-unions",
    "subjectId": "typescript",
    "title": "Discriminated Unions: Tagged Type Patterns",
    "order": 32,
    "description": "Using common literal property (type/kind) for safe switching.",
    "subtopics": [
      {
        "id": "ts-discriminated-unions-basics",
        "title": "What is Discriminated Unions?",
        "conceptId": "typescript_ts_discriminated_unions_whatis"
      },
      {
        "id": "ts-discriminated-unions-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_discriminated_unions_usage"
      },
      {
        "id": "ts-discriminated-unions-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_discriminated_unions_bestpractices"
      }
    ]
  },
  {
    "id": "ts-type-assertions",
    "subjectId": "typescript",
    "title": "Type Assertions: as Keyword & Non-Null (!)",
    "order": 33,
    "description": "Overriding compiler inference when the developer knows best.",
    "subtopics": [
      {
        "id": "ts-type-assertions-basics",
        "title": "What is Type Assertions?",
        "conceptId": "typescript_ts_type_assertions_whatis"
      },
      {
        "id": "ts-type-assertions-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_type_assertions_usage"
      },
      {
        "id": "ts-type-assertions-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_type_assertions_bestpractices"
      }
    ]
  },
  {
    "id": "ts-indexed-access",
    "subjectId": "typescript",
    "title": "Indexed Access Types (T[K])",
    "order": 34,
    "description": "Looking up the type of a specific property on another type.",
    "subtopics": [
      {
        "id": "ts-indexed-access-basics",
        "title": "What is Indexed Access Types (T[K])?",
        "conceptId": "typescript_ts_indexed_access_whatis"
      },
      {
        "id": "ts-indexed-access-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_indexed_access_usage"
      },
      {
        "id": "ts-indexed-access-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_indexed_access_bestpractices"
      }
    ]
  },
  {
    "id": "ts-conditional-types",
    "subjectId": "typescript",
    "title": "Conditional Types (T extends U ? X : Y)",
    "order": 35,
    "description": "Ternary logic applied to the TypeScript type system.",
    "subtopics": [
      {
        "id": "ts-conditional-types-basics",
        "title": "What is Conditional Types (T extends U ? X ?",
        "conceptId": "typescript_ts_conditional_types_whatis"
      },
      {
        "id": "ts-conditional-types-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_conditional_types_usage"
      },
      {
        "id": "ts-conditional-types-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_conditional_types_bestpractices"
      }
    ]
  },
  {
    "id": "ts-infer-keyword",
    "subjectId": "typescript",
    "title": "The infer Keyword in Conditional Types",
    "order": 36,
    "description": "Deducing types inside conditional branches dynamically.",
    "subtopics": [
      {
        "id": "ts-infer-keyword-basics",
        "title": "What is The infer Keyword in Conditional Types?",
        "conceptId": "typescript_ts_infer_keyword_whatis"
      },
      {
        "id": "ts-infer-keyword-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_infer_keyword_usage"
      },
      {
        "id": "ts-infer-keyword-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_infer_keyword_bestpractices"
      }
    ]
  },
  {
    "id": "ts-mapped-types",
    "subjectId": "typescript",
    "title": "Mapped Types ([K in keyof T])",
    "order": 37,
    "description": "Creating new types by transforming existing object keys.",
    "subtopics": [
      {
        "id": "ts-mapped-types-basics",
        "title": "What is Mapped Types ([K in keyof T])?",
        "conceptId": "typescript_ts_mapped_types_whatis"
      },
      {
        "id": "ts-mapped-types-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_mapped_types_usage"
      },
      {
        "id": "ts-mapped-types-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_mapped_types_bestpractices"
      }
    ]
  },
  {
    "id": "ts-template-literal-types",
    "subjectId": "typescript",
    "title": "Template Literal Types (`prefix_${T}`)",
    "order": 38,
    "description": "String pattern matching and combination in types.",
    "subtopics": [
      {
        "id": "ts-template-literal-types-basics",
        "title": "What is Template Literal Types (`prefix_${T}`)?",
        "conceptId": "typescript_ts_template_literal_types_whatis"
      },
      {
        "id": "ts-template-literal-types-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_template_literal_types_usage"
      },
      {
        "id": "ts-template-literal-types-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_template_literal_types_bestpractices"
      }
    ]
  },
  {
    "id": "ts-utility-partial-required",
    "subjectId": "typescript",
    "title": "Utility Types: Partial<T> & Required<T>",
    "order": 39,
    "description": "Making all properties optional or required.",
    "subtopics": [
      {
        "id": "ts-utility-partial-required-basics",
        "title": "What is Utility Types?",
        "conceptId": "typescript_ts_utility_partial_required_whatis"
      },
      {
        "id": "ts-utility-partial-required-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_utility_partial_required_usage"
      },
      {
        "id": "ts-utility-partial-required-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_utility_partial_required_bestpractices"
      }
    ]
  },
  {
    "id": "ts-utility-readonly-record",
    "subjectId": "typescript",
    "title": "Utility Types: Readonly<T> & Record<K, V>",
    "order": 40,
    "description": "Deep read-only types and dynamic dictionary maps.",
    "subtopics": [
      {
        "id": "ts-utility-readonly-record-basics",
        "title": "What is Utility Types?",
        "conceptId": "typescript_ts_utility_readonly_record_whatis"
      },
      {
        "id": "ts-utility-readonly-record-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_utility_readonly_record_usage"
      },
      {
        "id": "ts-utility-readonly-record-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_utility_readonly_record_bestpractices"
      }
    ]
  },
  {
    "id": "ts-utility-pick-omit",
    "subjectId": "typescript",
    "title": "Utility Types: Pick<T, K> & Omit<T, K>",
    "order": 41,
    "description": "Selecting or excluding specific keys from an object type.",
    "subtopics": [
      {
        "id": "ts-utility-pick-omit-basics",
        "title": "What is Utility Types?",
        "conceptId": "typescript_ts_utility_pick_omit_whatis"
      },
      {
        "id": "ts-utility-pick-omit-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_utility_pick_omit_usage"
      },
      {
        "id": "ts-utility-pick-omit-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_utility_pick_omit_bestpractices"
      }
    ]
  },
  {
    "id": "ts-utility-exclude-extract",
    "subjectId": "typescript",
    "title": "Utility Types: Exclude<T, U> & Extract<T, U>",
    "order": 42,
    "description": "Filtering union types.",
    "subtopics": [
      {
        "id": "ts-utility-exclude-extract-basics",
        "title": "What is Utility Types?",
        "conceptId": "typescript_ts_utility_exclude_extract_whatis"
      },
      {
        "id": "ts-utility-exclude-extract-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_utility_exclude_extract_usage"
      },
      {
        "id": "ts-utility-exclude-extract-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_utility_exclude_extract_bestpractices"
      }
    ]
  },
  {
    "id": "ts-utility-return-parameters",
    "subjectId": "typescript",
    "title": "Utility Types: ReturnType<T> & Parameters<T>",
    "order": 43,
    "description": "Extracting function return types and argument tuple types.",
    "subtopics": [
      {
        "id": "ts-utility-return-parameters-basics",
        "title": "What is Utility Types?",
        "conceptId": "typescript_ts_utility_return_parameters_whatis"
      },
      {
        "id": "ts-utility-return-parameters-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_utility_return_parameters_usage"
      },
      {
        "id": "ts-utility-return-parameters-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_utility_return_parameters_bestpractices"
      }
    ]
  },
  {
    "id": "ts-satisfies-operator",
    "subjectId": "typescript",
    "title": "The satisfies Operator in TypeScript 4.9+",
    "order": 44,
    "description": "Validating an expression matches a type without widening.",
    "subtopics": [
      {
        "id": "ts-satisfies-operator-basics",
        "title": "What is The satisfies Operator in TypeScript 4.9+?",
        "conceptId": "typescript_ts_satisfies_operator_whatis"
      },
      {
        "id": "ts-satisfies-operator-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_satisfies_operator_usage"
      },
      {
        "id": "ts-satisfies-operator-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_satisfies_operator_bestpractices"
      }
    ]
  },
  {
    "id": "ts-declaration-files",
    "subjectId": "typescript",
    "title": "Declaration Files (.d.ts) & Ambient Types",
    "order": 45,
    "description": "Writing typings for external JavaScript packages.",
    "subtopics": [
      {
        "id": "ts-declaration-files-basics",
        "title": "What is Declaration Files (.d.ts) & Ambient Types?",
        "conceptId": "typescript_ts_declaration_files_whatis"
      },
      {
        "id": "ts-declaration-files-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "typescript_ts_declaration_files_usage"
      },
      {
        "id": "ts-declaration-files-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "typescript_ts_declaration_files_bestpractices"
      }
    ]
  }
],

  "react": [
  {
    "id": "react-intro",
    "subjectId": "react",
    "title": "React Introduction: Why Component Architecture?",
    "order": 1,
    "description": "Declarative UI, component-driven development, and SPA benefits.",
    "subtopics": [
      {
        "id": "react-intro-basics",
        "title": "What is React Introduction?",
        "conceptId": "react_react_intro_whatis"
      },
      {
        "id": "react-intro-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_intro_usage"
      },
      {
        "id": "react-intro-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_intro_bestpractices"
      }
    ]
  },
  {
    "id": "react-virtual-dom",
    "subjectId": "react",
    "title": "Virtual DOM & How React Renders UI",
    "order": 2,
    "description": "In-memory DOM tree representation and reconciliation diffing.",
    "subtopics": [
      {
        "id": "react-virtual-dom-basics",
        "title": "What is Virtual DOM & How React Renders UI?",
        "conceptId": "react_react_virtual_dom_whatis"
      },
      {
        "id": "react-virtual-dom-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_virtual_dom_usage"
      },
      {
        "id": "react-virtual-dom-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_virtual_dom_bestpractices"
      }
    ]
  },
  {
    "id": "react-setup-vite",
    "subjectId": "react",
    "title": "Setting Up a React Project with Vite",
    "order": 3,
    "description": "Fast modern React tooling, project structure, and npm scripts.",
    "subtopics": [
      {
        "id": "react-setup-vite-basics",
        "title": "What is Setting Up a React Project with Vite?",
        "conceptId": "react_react_setup_vite_whatis"
      },
      {
        "id": "react-setup-vite-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_setup_vite_usage"
      },
      {
        "id": "react-setup-vite-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_setup_vite_bestpractices"
      }
    ]
  },
  {
    "id": "react-jsx-basics",
    "subjectId": "react",
    "title": "JSX Syntax & Rules",
    "order": 4,
    "description": "Writing HTML inside JavaScript, single root rule, and closing tags.",
    "subtopics": [
      {
        "id": "react-jsx-basics-basics",
        "title": "What is JSX Syntax & Rules?",
        "conceptId": "react_react_jsx_basics_whatis"
      },
      {
        "id": "react-jsx-basics-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_jsx_basics_usage"
      },
      {
        "id": "react-jsx-basics-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_jsx_basics_bestpractices"
      }
    ]
  },
  {
    "id": "react-jsx-expressions",
    "subjectId": "react",
    "title": "Embedding Expressions in JSX ({value})",
    "order": 5,
    "description": "Evaluating variables, calculations, and ternary logic inside JSX.",
    "subtopics": [
      {
        "id": "react-jsx-expressions-basics",
        "title": "What is Embedding Expressions in JSX ({value})?",
        "conceptId": "react_react_jsx_expressions_whatis"
      },
      {
        "id": "react-jsx-expressions-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_jsx_expressions_usage"
      },
      {
        "id": "react-jsx-expressions-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_jsx_expressions_bestpractices"
      }
    ]
  },
  {
    "id": "react-components-functional",
    "subjectId": "react",
    "title": "Functional Components: Building Blocks of UI",
    "order": 6,
    "description": "Writing and composing reusable React functional components.",
    "subtopics": [
      {
        "id": "react-components-functional-basics",
        "title": "What is Functional Components?",
        "conceptId": "react_react_components_functional_whatis"
      },
      {
        "id": "react-components-functional-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_components_functional_usage"
      },
      {
        "id": "react-components-functional-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_components_functional_bestpractices"
      }
    ]
  },
  {
    "id": "react-props-basics",
    "subjectId": "react",
    "title": "Component Props: Passing Data Downwards",
    "order": 7,
    "description": "One-way data flow, reading props, and read-only props rule.",
    "subtopics": [
      {
        "id": "react-props-basics-basics",
        "title": "What is Component Props?",
        "conceptId": "react_react_props_basics_whatis"
      },
      {
        "id": "react-props-basics-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_props_basics_usage"
      },
      {
        "id": "react-props-basics-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_props_basics_bestpractices"
      }
    ]
  },
  {
    "id": "react-props-children",
    "subjectId": "react",
    "title": "The children Prop & Component Composition",
    "order": 8,
    "description": "Building flexible card containers, modals, and layouts.",
    "subtopics": [
      {
        "id": "react-props-children-basics",
        "title": "What is The children Prop & Component Composition?",
        "conceptId": "react_react_props_children_whatis"
      },
      {
        "id": "react-props-children-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_props_children_usage"
      },
      {
        "id": "react-props-children-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_props_children_bestpractices"
      }
    ]
  },
  {
    "id": "react-conditional-rendering",
    "subjectId": "react",
    "title": "Conditional Rendering: if, ternary & logical &&",
    "order": 9,
    "description": "Rendering elements based on state conditions.",
    "subtopics": [
      {
        "id": "react-conditional-rendering-basics",
        "title": "What is Conditional Rendering?",
        "conceptId": "react_react_conditional_rendering_whatis"
      },
      {
        "id": "react-conditional-rendering-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_conditional_rendering_usage"
      },
      {
        "id": "react-conditional-rendering-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_conditional_rendering_bestpractices"
      }
    ]
  },
  {
    "id": "react-lists-keys",
    "subjectId": "react",
    "title": "Rendering Lists & The Importance of Keys",
    "order": 10,
    "description": "Mapping over arrays in JSX and why unique keys are critical.",
    "subtopics": [
      {
        "id": "react-lists-keys-basics",
        "title": "What is Rendering Lists & The Importance of Keys?",
        "conceptId": "react_react_lists_keys_whatis"
      },
      {
        "id": "react-lists-keys-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_lists_keys_usage"
      },
      {
        "id": "react-lists-keys-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_lists_keys_bestpractices"
      }
    ]
  },
  {
    "id": "react-events-handling",
    "subjectId": "react",
    "title": "Handling Events in React: onClick & SyntheticEvent",
    "order": 11,
    "description": "React cross-browser SyntheticEvent system and camelCase handlers.",
    "subtopics": [
      {
        "id": "react-events-handling-basics",
        "title": "What is Handling Events in React?",
        "conceptId": "react_react_events_handling_whatis"
      },
      {
        "id": "react-events-handling-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_events_handling_usage"
      },
      {
        "id": "react-events-handling-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_events_handling_bestpractices"
      }
    ]
  },
  {
    "id": "react-events-passing-args",
    "subjectId": "react",
    "title": "Passing Arguments to Event Handlers",
    "order": 12,
    "description": "Inline arrow functions vs currying event handlers.",
    "subtopics": [
      {
        "id": "react-events-passing-args-basics",
        "title": "What is Passing Arguments to Event Handlers?",
        "conceptId": "react_react_events_passing_args_whatis"
      },
      {
        "id": "react-events-passing-args-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_events_passing_args_usage"
      },
      {
        "id": "react-events-passing-args-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_events_passing_args_bestpractices"
      }
    ]
  },
  {
    "id": "react-state-intro",
    "subjectId": "react",
    "title": "State in React: What is State?",
    "order": 13,
    "description": "Component memory, triggering re-renders, and state vs props.",
    "subtopics": [
      {
        "id": "react-state-intro-basics",
        "title": "What is State in React?",
        "conceptId": "react_react_state_intro_whatis"
      },
      {
        "id": "react-state-intro-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_state_intro_usage"
      },
      {
        "id": "react-state-intro-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_state_intro_bestpractices"
      }
    ]
  },
  {
    "id": "react-hook-usestate",
    "subjectId": "react",
    "title": "The useState Hook Deep-Dive",
    "order": 14,
    "description": "Declaring state, setter functions, and initial values.",
    "subtopics": [
      {
        "id": "react-hook-usestate-basics",
        "title": "What is The useState Hook Deep-Dive?",
        "conceptId": "react_react_hook_usestate_whatis"
      },
      {
        "id": "react-hook-usestate-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_hook_usestate_usage"
      },
      {
        "id": "react-hook-usestate-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_hook_usestate_bestpractices"
      }
    ]
  },
  {
    "id": "react-state-immutability",
    "subjectId": "react",
    "title": "State Immutability: Updating Objects & Arrays",
    "order": 15,
    "description": "Never mutate state directly: using spread operators and copy patterns.",
    "subtopics": [
      {
        "id": "react-state-immutability-basics",
        "title": "What is State Immutability?",
        "conceptId": "react_react_state_immutability_whatis"
      },
      {
        "id": "react-state-immutability-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_state_immutability_usage"
      },
      {
        "id": "react-state-immutability-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_state_immutability_bestpractices"
      }
    ]
  },
  {
    "id": "react-state-updater-function",
    "subjectId": "react",
    "title": "Functional State Updates: prev => prev + 1",
    "order": 16,
    "description": "Handling asynchronous batched state updates safely.",
    "subtopics": [
      {
        "id": "react-state-updater-function-basics",
        "title": "What is Functional State Updates?",
        "conceptId": "react_react_state_updater_function_whatis"
      },
      {
        "id": "react-state-updater-function-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_state_updater_function_usage"
      },
      {
        "id": "react-state-updater-function-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_state_updater_function_bestpractices"
      }
    ]
  },
  {
    "id": "react-forms-controlled",
    "subjectId": "react",
    "title": "Controlled Components & Form Inputs",
    "order": 17,
    "description": "Binding input value to state and handling onChange events.",
    "subtopics": [
      {
        "id": "react-forms-controlled-basics",
        "title": "What is Controlled Components & Form Inputs?",
        "conceptId": "react_react_forms_controlled_whatis"
      },
      {
        "id": "react-forms-controlled-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_forms_controlled_usage"
      },
      {
        "id": "react-forms-controlled-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_forms_controlled_bestpractices"
      }
    ]
  },
  {
    "id": "react-forms-multiple-inputs",
    "subjectId": "react",
    "title": "Handling Multiple Form Inputs with One Handler",
    "order": 18,
    "description": "Dynamic object key updates using e.target.name.",
    "subtopics": [
      {
        "id": "react-forms-multiple-inputs-basics",
        "title": "What is Handling Multiple Form Inputs with One Handler?",
        "conceptId": "react_react_forms_multiple_inputs_whatis"
      },
      {
        "id": "react-forms-multiple-inputs-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_forms_multiple_inputs_usage"
      },
      {
        "id": "react-forms-multiple-inputs-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_forms_multiple_inputs_bestpractices"
      }
    ]
  },
  {
    "id": "react-uncontrolled-useref",
    "subjectId": "react",
    "title": "Uncontrolled Components & The useRef Hook",
    "order": 19,
    "description": "Reading form values directly from DOM nodes without re-renders.",
    "subtopics": [
      {
        "id": "react-uncontrolled-useref-basics",
        "title": "What is Uncontrolled Components & The useRef Hook?",
        "conceptId": "react_react_uncontrolled_useref_whatis"
      },
      {
        "id": "react-uncontrolled-useref-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_uncontrolled_useref_usage"
      },
      {
        "id": "react-uncontrolled-useref-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_uncontrolled_useref_bestpractices"
      }
    ]
  },
  {
    "id": "react-useref-mutable-values",
    "subjectId": "react",
    "title": "useRef for Mutable Values & Timers",
    "order": 20,
    "description": "Persisting values across renders without triggering a re-render.",
    "subtopics": [
      {
        "id": "react-useref-mutable-values-basics",
        "title": "What is useRef for Mutable Values & Timers?",
        "conceptId": "react_react_useref_mutable_values_whatis"
      },
      {
        "id": "react-useref-mutable-values-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_useref_mutable_values_usage"
      },
      {
        "id": "react-useref-mutable-values-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_useref_mutable_values_bestpractices"
      }
    ]
  },
  {
    "id": "react-component-lifecycle",
    "subjectId": "react",
    "title": "Component Lifecycle: Mount, Update & Unmount",
    "order": 21,
    "description": "Understanding the 3 phases of a component lifespan.",
    "subtopics": [
      {
        "id": "react-component-lifecycle-basics",
        "title": "What is Component Lifecycle?",
        "conceptId": "react_react_component_lifecycle_whatis"
      },
      {
        "id": "react-component-lifecycle-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_component_lifecycle_usage"
      },
      {
        "id": "react-component-lifecycle-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_component_lifecycle_bestpractices"
      }
    ]
  },
  {
    "id": "react-hook-useeffect",
    "subjectId": "react",
    "title": "The useEffect Hook Basics",
    "order": 22,
    "description": "Running side effects after render (DOM, APIs, document.title).",
    "subtopics": [
      {
        "id": "react-hook-useeffect-basics",
        "title": "What is The useEffect Hook Basics?",
        "conceptId": "react_react_hook_useeffect_whatis"
      },
      {
        "id": "react-hook-useeffect-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_hook_useeffect_usage"
      },
      {
        "id": "react-hook-useeffect-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_hook_useeffect_bestpractices"
      }
    ]
  },
  {
    "id": "react-useeffect-dependencies",
    "subjectId": "react",
    "title": "useEffect Dependency Array Rules",
    "order": 23,
    "description": "No dependencies, empty array [], and specific state/prop dependencies.",
    "subtopics": [
      {
        "id": "react-useeffect-dependencies-basics",
        "title": "What is useEffect Dependency Array Rules?",
        "conceptId": "react_react_useeffect_dependencies_whatis"
      },
      {
        "id": "react-useeffect-dependencies-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_useeffect_dependencies_usage"
      },
      {
        "id": "react-useeffect-dependencies-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_useeffect_dependencies_bestpractices"
      }
    ]
  },
  {
    "id": "react-useeffect-cleanup",
    "subjectId": "react",
    "title": "useEffect Cleanup Functions",
    "order": 24,
    "description": "Cleaning up event listeners, intervals, and aborting fetch calls on unmount.",
    "subtopics": [
      {
        "id": "react-useeffect-cleanup-basics",
        "title": "What is useEffect Cleanup Functions?",
        "conceptId": "react_react_useeffect_cleanup_whatis"
      },
      {
        "id": "react-useeffect-cleanup-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_useeffect_cleanup_usage"
      },
      {
        "id": "react-useeffect-cleanup-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_useeffect_cleanup_bestpractices"
      }
    ]
  },
  {
    "id": "react-fetching-data",
    "subjectId": "react",
    "title": "Fetching Data in React: Loading & Error States",
    "order": 25,
    "description": "Handling async fetch requests with loading spinners and error screens.",
    "subtopics": [
      {
        "id": "react-fetching-data-basics",
        "title": "What is Fetching Data in React?",
        "conceptId": "react_react_fetching_data_whatis"
      },
      {
        "id": "react-fetching-data-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_fetching_data_usage"
      },
      {
        "id": "react-fetching-data-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_fetching_data_bestpractices"
      }
    ]
  },
  {
    "id": "react-custom-hooks",
    "subjectId": "react",
    "title": "Custom Hooks: Reusable Component Logic",
    "order": 26,
    "description": "Extracting stateful logic into custom use... functions.",
    "subtopics": [
      {
        "id": "react-custom-hooks-basics",
        "title": "What is Custom Hooks?",
        "conceptId": "react_react_custom_hooks_whatis"
      },
      {
        "id": "react-custom-hooks-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_custom_hooks_usage"
      },
      {
        "id": "react-custom-hooks-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_custom_hooks_bestpractices"
      }
    ]
  },
  {
    "id": "react-hook-usememo",
    "subjectId": "react",
    "title": "The useMemo Hook for Expensive Calculations",
    "order": 27,
    "description": "Memoizing computed values and preventing recalculations.",
    "subtopics": [
      {
        "id": "react-hook-usememo-basics",
        "title": "What is The useMemo Hook for Expensive Calculations?",
        "conceptId": "react_react_hook_usememo_whatis"
      },
      {
        "id": "react-hook-usememo-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_hook_usememo_usage"
      },
      {
        "id": "react-hook-usememo-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_hook_usememo_bestpractices"
      }
    ]
  },
  {
    "id": "react-hook-usecallback",
    "subjectId": "react",
    "title": "The useCallback Hook: Memoizing Functions",
    "order": 28,
    "description": "Preventing unnecessary child re-renders caused by function reference changes.",
    "subtopics": [
      {
        "id": "react-hook-usecallback-basics",
        "title": "What is The useCallback Hook?",
        "conceptId": "react_react_hook_usecallback_whatis"
      },
      {
        "id": "react-hook-usecallback-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_hook_usecallback_usage"
      },
      {
        "id": "react-hook-usecallback-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_hook_usecallback_bestpractices"
      }
    ]
  },
  {
    "id": "react-memo",
    "subjectId": "react",
    "title": "React.memo: Higher-Order Component Memoization",
    "order": 29,
    "description": "Skipping component re-renders when props have not changed.",
    "subtopics": [
      {
        "id": "react-memo-basics",
        "title": "What is React.memo?",
        "conceptId": "react_react_memo_whatis"
      },
      {
        "id": "react-memo-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_memo_usage"
      },
      {
        "id": "react-memo-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_memo_bestpractices"
      }
    ]
  },
  {
    "id": "react-context-api-intro",
    "subjectId": "react",
    "title": "Context API: Avoiding Prop Drilling",
    "order": 30,
    "description": "createContext, Provider, and passing global data down the tree.",
    "subtopics": [
      {
        "id": "react-context-api-intro-basics",
        "title": "What is Context API?",
        "conceptId": "react_react_context_api_intro_whatis"
      },
      {
        "id": "react-context-api-intro-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_context_api_intro_usage"
      },
      {
        "id": "react-context-api-intro-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_context_api_intro_bestpractices"
      }
    ]
  },
  {
    "id": "react-hook-usecontext",
    "subjectId": "react",
    "title": "The useContext Hook",
    "order": 31,
    "description": "Consuming context cleanly inside functional components.",
    "subtopics": [
      {
        "id": "react-hook-usecontext-basics",
        "title": "What is The useContext Hook?",
        "conceptId": "react_react_hook_usecontext_whatis"
      },
      {
        "id": "react-hook-usecontext-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_hook_usecontext_usage"
      },
      {
        "id": "react-hook-usecontext-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_hook_usecontext_bestpractices"
      }
    ]
  },
  {
    "id": "react-lifting-state-up",
    "subjectId": "react",
    "title": "Lifting State Up: Sharing State Between Siblings",
    "order": 32,
    "description": "Moving shared state to nearest common parent component.",
    "subtopics": [
      {
        "id": "react-lifting-state-up-basics",
        "title": "What is Lifting State Up?",
        "conceptId": "react_react_lifting_state_up_whatis"
      },
      {
        "id": "react-lifting-state-up-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_lifting_state_up_usage"
      },
      {
        "id": "react-lifting-state-up-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_lifting_state_up_bestpractices"
      }
    ]
  },
  {
    "id": "react-fragments",
    "subjectId": "react",
    "title": "React Fragments (<>...</>)",
    "order": 33,
    "description": "Grouping lists of children without adding extra DOM nodes.",
    "subtopics": [
      {
        "id": "react-fragments-basics",
        "title": "What is React Fragments (<>...</>)?",
        "conceptId": "react_react_fragments_whatis"
      },
      {
        "id": "react-fragments-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_fragments_usage"
      },
      {
        "id": "react-fragments-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_fragments_bestpractices"
      }
    ]
  },
  {
    "id": "react-portals",
    "subjectId": "react",
    "title": "React Portals (createPortal)",
    "order": 34,
    "description": "Rendering modals and tooltips outside the parent DOM hierarchy.",
    "subtopics": [
      {
        "id": "react-portals-basics",
        "title": "What is React Portals (createPortal)?",
        "conceptId": "react_react_portals_whatis"
      },
      {
        "id": "react-portals-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_portals_usage"
      },
      {
        "id": "react-portals-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_portals_bestpractices"
      }
    ]
  },
  {
    "id": "react-error-boundaries",
    "subjectId": "react",
    "title": "Error Boundaries: Catching UI Crashes",
    "order": 35,
    "description": "Class-based error boundaries and fallback UI.",
    "subtopics": [
      {
        "id": "react-error-boundaries-basics",
        "title": "What is Error Boundaries?",
        "conceptId": "react_react_error_boundaries_whatis"
      },
      {
        "id": "react-error-boundaries-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_error_boundaries_usage"
      },
      {
        "id": "react-error-boundaries-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_error_boundaries_bestpractices"
      }
    ]
  },
  {
    "id": "react-lazy-suspense",
    "subjectId": "react",
    "title": "Code Splitting with React.lazy & Suspense",
    "order": 36,
    "description": "Loading components on-demand to reduce initial bundle size.",
    "subtopics": [
      {
        "id": "react-lazy-suspense-basics",
        "title": "What is Code Splitting with React.lazy & Suspense?",
        "conceptId": "react_react_lazy_suspense_whatis"
      },
      {
        "id": "react-lazy-suspense-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_lazy_suspense_usage"
      },
      {
        "id": "react-lazy-suspense-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_lazy_suspense_bestpractices"
      }
    ]
  },
  {
    "id": "react-pure-components",
    "subjectId": "react",
    "title": "Pure Components & Why Re-Renders Happen",
    "order": 37,
    "description": "Identifying root causes of unnecessary re-renders in React.",
    "subtopics": [
      {
        "id": "react-pure-components-basics",
        "title": "What is Pure Components & Why Re-Renders Happen?",
        "conceptId": "react_react_pure_components_whatis"
      },
      {
        "id": "react-pure-components-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_pure_components_usage"
      },
      {
        "id": "react-pure-components-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_pure_components_bestpractices"
      }
    ]
  },
  {
    "id": "react-devtools",
    "subjectId": "react",
    "title": "React Developer Tools: Profiler & Component Tree",
    "order": 38,
    "description": "Inspecting props, state, hooks, and render performance.",
    "subtopics": [
      {
        "id": "react-devtools-basics",
        "title": "What is React Developer Tools?",
        "conceptId": "react_react_devtools_whatis"
      },
      {
        "id": "react-devtools-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_devtools_usage"
      },
      {
        "id": "react-devtools-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_devtools_bestpractices"
      }
    ]
  },
  {
    "id": "react-strict-mode",
    "subjectId": "react",
    "title": "React Strict Mode: Double Rendering in Development",
    "order": 39,
    "description": "Why React renders twice in dev to find impure effects.",
    "subtopics": [
      {
        "id": "react-strict-mode-basics",
        "title": "What is React Strict Mode?",
        "conceptId": "react_react_strict_mode_whatis"
      },
      {
        "id": "react-strict-mode-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_strict_mode_usage"
      },
      {
        "id": "react-strict-mode-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_strict_mode_bestpractices"
      }
    ]
  },
  {
    "id": "react-styling-css-modules",
    "subjectId": "react",
    "title": "CSS Modules in React",
    "order": 40,
    "description": "Scoped component styling with [name].module.css.",
    "subtopics": [
      {
        "id": "react-styling-css-modules-basics",
        "title": "What is CSS Modules in React?",
        "conceptId": "react_react_styling_css_modules_whatis"
      },
      {
        "id": "react-styling-css-modules-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_styling_css_modules_usage"
      },
      {
        "id": "react-styling-css-modules-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_styling_css_modules_bestpractices"
      }
    ]
  },
  {
    "id": "react-synthetic-events",
    "subjectId": "react",
    "title": "React SyntheticEvent vs Native DOM Events",
    "order": 41,
    "description": "Cross-browser wrapper and event delegation on root.",
    "subtopics": [
      {
        "id": "react-synthetic-events-basics",
        "title": "What is React SyntheticEvent vs Native DOM Events?",
        "conceptId": "react_react_synthetic_events_whatis"
      },
      {
        "id": "react-synthetic-events-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_synthetic_events_usage"
      },
      {
        "id": "react-synthetic-events-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_synthetic_events_bestpractices"
      }
    ]
  },
  {
    "id": "react-forward-ref",
    "subjectId": "react",
    "title": "Forwarding Refs with forwardRef",
    "order": 42,
    "description": "Passing refs down through child components to underlying DOM elements.",
    "subtopics": [
      {
        "id": "react-forward-ref-basics",
        "title": "What is Forwarding Refs with forwardRef?",
        "conceptId": "react_react_forward_ref_whatis"
      },
      {
        "id": "react-forward-ref-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_forward_ref_usage"
      },
      {
        "id": "react-forward-ref-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_forward_ref_bestpractices"
      }
    ]
  },
  {
    "id": "react-hoc-pattern",
    "subjectId": "react",
    "title": "Higher-Order Components (HOC) Pattern",
    "order": 43,
    "description": "Wrapping components to inject props and capabilities.",
    "subtopics": [
      {
        "id": "react-hoc-pattern-basics",
        "title": "What is Higher-Order Components (HOC) Pattern?",
        "conceptId": "react_react_hoc_pattern_whatis"
      },
      {
        "id": "react-hoc-pattern-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_hoc_pattern_usage"
      },
      {
        "id": "react-hoc-pattern-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_hoc_pattern_bestpractices"
      }
    ]
  },
  {
    "id": "react-render-props",
    "subjectId": "react",
    "title": "Render Props Pattern",
    "order": 44,
    "description": "Sharing code using a prop whose value is a function.",
    "subtopics": [
      {
        "id": "react-render-props-basics",
        "title": "What is Render Props Pattern?",
        "conceptId": "react_react_render_props_whatis"
      },
      {
        "id": "react-render-props-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_render_props_usage"
      },
      {
        "id": "react-render-props-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_render_props_bestpractices"
      }
    ]
  },
  {
    "id": "react-compound-components",
    "subjectId": "react",
    "title": "Compound Components Pattern (Tabs, Accordions)",
    "order": 45,
    "description": "Building flexible component families that share implicit state.",
    "subtopics": [
      {
        "id": "react-compound-components-basics",
        "title": "What is Compound Components Pattern (Tabs, Accordions)?",
        "conceptId": "react_react_compound_components_whatis"
      },
      {
        "id": "react-compound-components-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_compound_components_usage"
      },
      {
        "id": "react-compound-components-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_compound_components_bestpractices"
      }
    ]
  },
  {
    "id": "react-anti-patterns",
    "subjectId": "react",
    "title": "Common React Anti-Patterns & Pitfalls",
    "order": 46,
    "description": "Modifying props, stale closures, and resetting state during render.",
    "subtopics": [
      {
        "id": "react-anti-patterns-basics",
        "title": "What is Common React Anti-Patterns & Pitfalls?",
        "conceptId": "react_react_anti_patterns_whatis"
      },
      {
        "id": "react-anti-patterns-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_anti_patterns_usage"
      },
      {
        "id": "react-anti-patterns-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_anti_patterns_bestpractices"
      }
    ]
  },
  {
    "id": "react-optimizing-bundle",
    "subjectId": "react",
    "title": "Optimizing React Production Bundles",
    "order": 47,
    "description": "Tree-shaking, lazy loading routes, and minification.",
    "subtopics": [
      {
        "id": "react-optimizing-bundle-basics",
        "title": "What is Optimizing React Production Bundles?",
        "conceptId": "react_react_optimizing_bundle_whatis"
      },
      {
        "id": "react-optimizing-bundle-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_optimizing_bundle_usage"
      },
      {
        "id": "react-optimizing-bundle-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_optimizing_bundle_bestpractices"
      }
    ]
  },
  {
    "id": "react-state-management-choices",
    "subjectId": "react",
    "title": "Choosing State Management: Context vs Redux vs Zustand",
    "order": 48,
    "description": "Deciding when local state, context, or external stores are required.",
    "subtopics": [
      {
        "id": "react-state-management-choices-basics",
        "title": "What is Choosing State Management?",
        "conceptId": "react_react_state_management_choices_whatis"
      },
      {
        "id": "react-state-management-choices-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_state_management_choices_usage"
      },
      {
        "id": "react-state-management-choices-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_state_management_choices_bestpractices"
      }
    ]
  },
  {
    "id": "react-testing-basics",
    "subjectId": "react",
    "title": "Testing React Components with Vitest & Testing Library",
    "order": 49,
    "description": "Testing user interactions, button clicks, and rendered text.",
    "subtopics": [
      {
        "id": "react-testing-basics-basics",
        "title": "What is Testing React Components with Vitest & Testing Library?",
        "conceptId": "react_react_testing_basics_whatis"
      },
      {
        "id": "react-testing-basics-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_testing_basics_usage"
      },
      {
        "id": "react-testing-basics-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_testing_basics_bestpractices"
      }
    ]
  },
  {
    "id": "react-production-deploy",
    "subjectId": "react",
    "title": "Deploying React Apps: Vercel, Netlify & Static Hosts",
    "order": 50,
    "description": "Building dist/ and configuring single-page application redirects.",
    "subtopics": [
      {
        "id": "react-production-deploy-basics",
        "title": "What is Deploying React Apps?",
        "conceptId": "react_react_production_deploy_whatis"
      },
      {
        "id": "react-production-deploy-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react_react_production_deploy_usage"
      },
      {
        "id": "react-production-deploy-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react_react_production_deploy_bestpractices"
      }
    ]
  }
],

  "advanced-react": [
  {
    "id": "ar-react-18-19-overview",
    "subjectId": "advanced-react",
    "title": "React 18 & 19 Architecture Overview",
    "order": 1,
    "description": "Concurrent rendering, automatic batching, and modern React paradigm.",
    "subtopics": [
      {
        "id": "ar-react-18-19-overview-basics",
        "title": "What is React 18 & 19 Architecture Overview?",
        "conceptId": "advanced-react_ar_react_18_19_overview_whatis"
      },
      {
        "id": "ar-react-18-19-overview-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_react_18_19_overview_usage"
      },
      {
        "id": "ar-react-18-19-overview-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_react_18_19_overview_bestpractices"
      }
    ]
  },
  {
    "id": "ar-fiber-architecture",
    "subjectId": "advanced-react",
    "title": "React Fiber Architecture: Fiber Nodes & Trees",
    "order": 2,
    "description": "How React Fiber enables pausable and priority-based rendering.",
    "subtopics": [
      {
        "id": "ar-fiber-architecture-basics",
        "title": "What is React Fiber Architecture?",
        "conceptId": "advanced-react_ar_fiber_architecture_whatis"
      },
      {
        "id": "ar-fiber-architecture-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_fiber_architecture_usage"
      },
      {
        "id": "ar-fiber-architecture-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_fiber_architecture_bestpractices"
      }
    ]
  },
  {
    "id": "ar-render-vs-commit",
    "subjectId": "advanced-react",
    "title": "Render Phase vs Commit Phase Mechanics",
    "order": 3,
    "description": "Pure calculation phase vs DOM mutation phase.",
    "subtopics": [
      {
        "id": "ar-render-vs-commit-basics",
        "title": "What is Render Phase vs Commit Phase Mechanics?",
        "conceptId": "advanced-react_ar_render_vs_commit_whatis"
      },
      {
        "id": "ar-render-vs-commit-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_render_vs_commit_usage"
      },
      {
        "id": "ar-render-vs-commit-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_render_vs_commit_bestpractices"
      }
    ]
  },
  {
    "id": "ar-concurrent-rendering",
    "subjectId": "advanced-react",
    "title": "Concurrent React Explained",
    "order": 4,
    "description": "Interruptible rendering and multi-priority task scheduling.",
    "subtopics": [
      {
        "id": "ar-concurrent-rendering-basics",
        "title": "What is Concurrent React Explained?",
        "conceptId": "advanced-react_ar_concurrent_rendering_whatis"
      },
      {
        "id": "ar-concurrent-rendering-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_concurrent_rendering_usage"
      },
      {
        "id": "ar-concurrent-rendering-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_concurrent_rendering_bestpractices"
      }
    ]
  },
  {
    "id": "ar-hook-usetransition",
    "subjectId": "advanced-react",
    "title": "The useTransition Hook for Non-Urgent Updates",
    "order": 5,
    "description": "Keeping UI responsive by marking heavy state updates as transitions.",
    "subtopics": [
      {
        "id": "ar-hook-usetransition-basics",
        "title": "What is The useTransition Hook for Non-Urgent Updates?",
        "conceptId": "advanced-react_ar_hook_usetransition_whatis"
      },
      {
        "id": "ar-hook-usetransition-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_hook_usetransition_usage"
      },
      {
        "id": "ar-hook-usetransition-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_hook_usetransition_bestpractices"
      }
    ]
  },
  {
    "id": "ar-hook-usedeferredvalue",
    "subjectId": "advanced-react",
    "title": "The useDeferredValue Hook",
    "order": 6,
    "description": "Deferring re-renders of expensive child components.",
    "subtopics": [
      {
        "id": "ar-hook-usedeferredvalue-basics",
        "title": "What is The useDeferredValue Hook?",
        "conceptId": "advanced-react_ar_hook_usedeferredvalue_whatis"
      },
      {
        "id": "ar-hook-usedeferredvalue-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_hook_usedeferredvalue_usage"
      },
      {
        "id": "ar-hook-usedeferredvalue-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_hook_usedeferredvalue_bestpractices"
      }
    ]
  },
  {
    "id": "ar-automatic-batching",
    "subjectId": "advanced-react",
    "title": "Automatic Batching in React 18+",
    "order": 7,
    "description": "How state updates inside promises and timeouts are grouped together.",
    "subtopics": [
      {
        "id": "ar-automatic-batching-basics",
        "title": "What is Automatic Batching in React 18+?",
        "conceptId": "advanced-react_ar_automatic_batching_whatis"
      },
      {
        "id": "ar-automatic-batching-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_automatic_batching_usage"
      },
      {
        "id": "ar-automatic-batching-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_automatic_batching_bestpractices"
      }
    ]
  },
  {
    "id": "ar-suspense-data-fetching",
    "subjectId": "advanced-react",
    "title": "Suspense for Data Fetching",
    "order": 8,
    "description": "Declarative loading states and coordination across components.",
    "subtopics": [
      {
        "id": "ar-suspense-data-fetching-basics",
        "title": "What is Suspense for Data Fetching?",
        "conceptId": "advanced-react_ar_suspense_data_fetching_whatis"
      },
      {
        "id": "ar-suspense-data-fetching-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_suspense_data_fetching_usage"
      },
      {
        "id": "ar-suspense-data-fetching-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_suspense_data_fetching_bestpractices"
      }
    ]
  },
  {
    "id": "ar-streaming-ssr",
    "subjectId": "advanced-react",
    "title": "Streaming Server-Side Rendering (SSR)",
    "order": 9,
    "description": "Streaming HTML chunks to the browser before data fetching completes.",
    "subtopics": [
      {
        "id": "ar-streaming-ssr-basics",
        "title": "What is Streaming Server-Side Rendering (SSR)?",
        "conceptId": "advanced-react_ar_streaming_ssr_whatis"
      },
      {
        "id": "ar-streaming-ssr-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_streaming_ssr_usage"
      },
      {
        "id": "ar-streaming-ssr-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_streaming_ssr_bestpractices"
      }
    ]
  },
  {
    "id": "ar-server-components-rsc",
    "subjectId": "advanced-react",
    "title": "React Server Components (RSC) Paradigm",
    "order": 10,
    "description": "Zero-bundle-size server execution and direct database access.",
    "subtopics": [
      {
        "id": "ar-server-components-rsc-basics",
        "title": "What is React Server Components (RSC) Paradigm?",
        "conceptId": "advanced-react_ar_server_components_rsc_whatis"
      },
      {
        "id": "ar-server-components-rsc-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_server_components_rsc_usage"
      },
      {
        "id": "ar-server-components-rsc-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_server_components_rsc_bestpractices"
      }
    ]
  },
  {
    "id": "ar-server-vs-client-components",
    "subjectId": "advanced-react",
    "title": "Server Components vs Client Components (\"use client\")",
    "order": 11,
    "description": "When and where to place the boundary between server and client.",
    "subtopics": [
      {
        "id": "ar-server-vs-client-components-basics",
        "title": "What is Server Components vs Client Components (\"use client\")?",
        "conceptId": "advanced-react_ar_server_vs_client_components_whatis"
      },
      {
        "id": "ar-server-vs-client-components-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_server_vs_client_components_usage"
      },
      {
        "id": "ar-server-vs-client-components-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_server_vs_client_components_bestpractices"
      }
    ]
  },
  {
    "id": "ar-server-actions",
    "subjectId": "advanced-react",
    "title": "Server Actions (\"use server\") in Modern React",
    "order": 12,
    "description": "Mutating server data directly from client forms without REST APIs.",
    "subtopics": [
      {
        "id": "ar-server-actions-basics",
        "title": "What is Server Actions (\"use server\") in Modern React?",
        "conceptId": "advanced-react_ar_server_actions_whatis"
      },
      {
        "id": "ar-server-actions-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_server_actions_usage"
      },
      {
        "id": "ar-server-actions-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_server_actions_bestpractices"
      }
    ]
  },
  {
    "id": "ar-hook-useoptimistic",
    "subjectId": "advanced-react",
    "title": "The useOptimistic Hook in React 19",
    "order": 13,
    "description": "Showing instant UI feedback before server confirmation arrives.",
    "subtopics": [
      {
        "id": "ar-hook-useoptimistic-basics",
        "title": "What is The useOptimistic Hook in React 19?",
        "conceptId": "advanced-react_ar_hook_useoptimistic_whatis"
      },
      {
        "id": "ar-hook-useoptimistic-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_hook_useoptimistic_usage"
      },
      {
        "id": "ar-hook-useoptimistic-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_hook_useoptimistic_bestpractices"
      }
    ]
  },
  {
    "id": "ar-hook-useactionstate",
    "subjectId": "advanced-react",
    "title": "The useActionState & useFormStatus Hooks",
    "order": 14,
    "description": "Handling pending status and form action results seamlessly.",
    "subtopics": [
      {
        "id": "ar-hook-useactionstate-basics",
        "title": "What is The useActionState & useFormStatus Hooks?",
        "conceptId": "advanced-react_ar_hook_useactionstate_whatis"
      },
      {
        "id": "ar-hook-useactionstate-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_hook_useactionstate_usage"
      },
      {
        "id": "ar-hook-useactionstate-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_hook_useactionstate_bestpractices"
      }
    ]
  },
  {
    "id": "ar-hook-use",
    "subjectId": "advanced-react",
    "title": "The use Hook for Promises & Context",
    "order": 15,
    "description": "Unwrapping promises and reading context conditionally.",
    "subtopics": [
      {
        "id": "ar-hook-use-basics",
        "title": "What is The use Hook for Promises & Context?",
        "conceptId": "advanced-react_ar_hook_use_whatis"
      },
      {
        "id": "ar-hook-use-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_hook_use_usage"
      },
      {
        "id": "ar-hook-use-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_hook_use_bestpractices"
      }
    ]
  },
  {
    "id": "ar-flushsync",
    "subjectId": "advanced-react",
    "title": "flushSync: Forcing Synchronous DOM Updates",
    "order": 16,
    "description": "When synchronous DOM measurements require bypassing batching.",
    "subtopics": [
      {
        "id": "ar-flushsync-basics",
        "title": "What is flushSync?",
        "conceptId": "advanced-react_ar_flushsync_whatis"
      },
      {
        "id": "ar-flushsync-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_flushsync_usage"
      },
      {
        "id": "ar-flushsync-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_flushsync_bestpractices"
      }
    ]
  },
  {
    "id": "ar-hook-useid",
    "subjectId": "advanced-react",
    "title": "The useId Hook for Accessible Forms",
    "order": 17,
    "description": "Generating unique, hydration-safe IDs for labels and inputs.",
    "subtopics": [
      {
        "id": "ar-hook-useid-basics",
        "title": "What is The useId Hook for Accessible Forms?",
        "conceptId": "advanced-react_ar_hook_useid_whatis"
      },
      {
        "id": "ar-hook-useid-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_hook_useid_usage"
      },
      {
        "id": "ar-hook-useid-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_hook_useid_bestpractices"
      }
    ]
  },
  {
    "id": "ar-hook-useinsertioneffect",
    "subjectId": "advanced-react",
    "title": "The useInsertionEffect Hook for CSS-in-JS",
    "order": 18,
    "description": "Injecting styles before DOM mutations occur.",
    "subtopics": [
      {
        "id": "ar-hook-useinsertioneffect-basics",
        "title": "What is The useInsertionEffect Hook for CSS-in-JS?",
        "conceptId": "advanced-react_ar_hook_useinsertioneffect_whatis"
      },
      {
        "id": "ar-hook-useinsertioneffect-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_hook_useinsertioneffect_usage"
      },
      {
        "id": "ar-hook-useinsertioneffect-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_hook_useinsertioneffect_bestpractices"
      }
    ]
  },
  {
    "id": "ar-hook-useimperativehandle",
    "subjectId": "advanced-react",
    "title": "The useImperativeHandle Hook",
    "order": 19,
    "description": "Exposing custom imperative methods on child components.",
    "subtopics": [
      {
        "id": "ar-hook-useimperativehandle-basics",
        "title": "What is The useImperativeHandle Hook?",
        "conceptId": "advanced-react_ar_hook_useimperativehandle_whatis"
      },
      {
        "id": "ar-hook-useimperativehandle-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_hook_useimperativehandle_usage"
      },
      {
        "id": "ar-hook-useimperativehandle-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_hook_useimperativehandle_bestpractices"
      }
    ]
  },
  {
    "id": "ar-hook-usesyncexternalstore",
    "subjectId": "advanced-react",
    "title": "The useSyncExternalStore Hook",
    "order": 20,
    "description": "Subscribing to external stores without tearing under concurrency.",
    "subtopics": [
      {
        "id": "ar-hook-usesyncexternalstore-basics",
        "title": "What is The useSyncExternalStore Hook?",
        "conceptId": "advanced-react_ar_hook_usesyncexternalstore_whatis"
      },
      {
        "id": "ar-hook-usesyncexternalstore-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_hook_usesyncexternalstore_usage"
      },
      {
        "id": "ar-hook-usesyncexternalstore-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_hook_usesyncexternalstore_bestpractices"
      }
    ]
  },
  {
    "id": "ar-virtualization-windowing",
    "subjectId": "advanced-react",
    "title": "List Virtualization with react-window",
    "order": 21,
    "description": "Rendering only visible rows in lists with 10,000+ items.",
    "subtopics": [
      {
        "id": "ar-virtualization-windowing-basics",
        "title": "What is List Virtualization with react-window?",
        "conceptId": "advanced-react_ar_virtualization_windowing_whatis"
      },
      {
        "id": "ar-virtualization-windowing-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_virtualization_windowing_usage"
      },
      {
        "id": "ar-virtualization-windowing-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_virtualization_windowing_bestpractices"
      }
    ]
  },
  {
    "id": "ar-profiler-api",
    "subjectId": "advanced-react",
    "title": "React Profiler API & Performance Metrics",
    "order": 22,
    "description": "Measuring component render duration and identifying bottlenecks.",
    "subtopics": [
      {
        "id": "ar-profiler-api-basics",
        "title": "What is React Profiler API & Performance Metrics?",
        "conceptId": "advanced-react_ar_profiler_api_whatis"
      },
      {
        "id": "ar-profiler-api-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_profiler_api_usage"
      },
      {
        "id": "ar-profiler-api-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_profiler_api_bestpractices"
      }
    ]
  },
  {
    "id": "ar-state-machines",
    "subjectId": "advanced-react",
    "title": "State Machines in React (XState)",
    "order": 23,
    "description": "Modeling complex user workflows without boolean flags.",
    "subtopics": [
      {
        "id": "ar-state-machines-basics",
        "title": "What is State Machines in React (XState)?",
        "conceptId": "advanced-react_ar_state_machines_whatis"
      },
      {
        "id": "ar-state-machines-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_state_machines_usage"
      },
      {
        "id": "ar-state-machines-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_state_machines_bestpractices"
      }
    ]
  },
  {
    "id": "ar-enterprise-patterns",
    "subjectId": "advanced-react",
    "title": "Architectural Design Patterns in Enterprise React",
    "order": 24,
    "description": "Layered architecture: presentation, domain, and data layers.",
    "subtopics": [
      {
        "id": "ar-enterprise-patterns-basics",
        "title": "What is Architectural Design Patterns in Enterprise React?",
        "conceptId": "advanced-react_ar_enterprise_patterns_whatis"
      },
      {
        "id": "ar-enterprise-patterns-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_enterprise_patterns_usage"
      },
      {
        "id": "ar-enterprise-patterns-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_enterprise_patterns_bestpractices"
      }
    ]
  },
  {
    "id": "ar-monorepo-setup",
    "subjectId": "advanced-react",
    "title": "Monorepo Architecture for React Apps (Turborepo)",
    "order": 25,
    "description": "Sharing UI component libraries and packages across apps.",
    "subtopics": [
      {
        "id": "ar-monorepo-setup-basics",
        "title": "What is Monorepo Architecture for React Apps (Turborepo)?",
        "conceptId": "advanced-react_ar_monorepo_setup_whatis"
      },
      {
        "id": "ar-monorepo-setup-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_monorepo_setup_usage"
      },
      {
        "id": "ar-monorepo-setup-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_monorepo_setup_bestpractices"
      }
    ]
  },
  {
    "id": "ar-error-telemetry",
    "subjectId": "advanced-react",
    "title": "Error Logging & Telemetry Integration",
    "order": 26,
    "description": "Capturing production frontend exceptions with context.",
    "subtopics": [
      {
        "id": "ar-error-telemetry-basics",
        "title": "What is Error Logging & Telemetry Integration?",
        "conceptId": "advanced-react_ar_error_telemetry_whatis"
      },
      {
        "id": "ar-error-telemetry-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_error_telemetry_usage"
      },
      {
        "id": "ar-error-telemetry-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_error_telemetry_bestpractices"
      }
    ]
  },
  {
    "id": "ar-hydration-errors",
    "subjectId": "advanced-react",
    "title": "Fixing Hydration Errors in SSR React",
    "order": 27,
    "description": "Causes of server/client HTML mismatches and resolution.",
    "subtopics": [
      {
        "id": "ar-hydration-errors-basics",
        "title": "What is Fixing Hydration Errors in SSR React?",
        "conceptId": "advanced-react_ar_hydration_errors_whatis"
      },
      {
        "id": "ar-hydration-errors-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_hydration_errors_usage"
      },
      {
        "id": "ar-hydration-errors-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_hydration_errors_bestpractices"
      }
    ]
  },
  {
    "id": "ar-testing-strategies",
    "subjectId": "advanced-react",
    "title": "Testing Strategies: Unit, Integration & E2E",
    "order": 28,
    "description": "Balancing unit tests with Playwright end-to-end tests.",
    "subtopics": [
      {
        "id": "ar-testing-strategies-basics",
        "title": "What is Testing Strategies?",
        "conceptId": "advanced-react_ar_testing_strategies_whatis"
      },
      {
        "id": "ar-testing-strategies-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_testing_strategies_usage"
      },
      {
        "id": "ar-testing-strategies-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_testing_strategies_bestpractices"
      }
    ]
  },
  {
    "id": "ar-clean-code-refactoring",
    "subjectId": "advanced-react",
    "title": "Refactoring Large Legacy React Codebases",
    "order": 29,
    "description": "Migrating class components, splitting god-components, and types.",
    "subtopics": [
      {
        "id": "ar-clean-code-refactoring-basics",
        "title": "What is Refactoring Large Legacy React Codebases?",
        "conceptId": "advanced-react_ar_clean_code_refactoring_whatis"
      },
      {
        "id": "ar-clean-code-refactoring-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_clean_code_refactoring_usage"
      },
      {
        "id": "ar-clean-code-refactoring-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_clean_code_refactoring_bestpractices"
      }
    ]
  },
  {
    "id": "ar-react-future",
    "subjectId": "advanced-react",
    "title": "The Future of React: Compiler (React Forget)",
    "order": 30,
    "description": "Automatic memoization and the evolution of the React ecosystem.",
    "subtopics": [
      {
        "id": "ar-react-future-basics",
        "title": "What is The Future of React?",
        "conceptId": "advanced-react_ar_react_future_whatis"
      },
      {
        "id": "ar-react-future-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "advanced-react_ar_react_future_usage"
      },
      {
        "id": "ar-react-future-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "advanced-react_ar_react_future_bestpractices"
      }
    ]
  }
],

  "redux": [
  {
    "id": "redux-intro-flux",
    "subjectId": "redux",
    "title": "Redux Introduction & Flux Architecture",
    "order": 1,
    "description": "Why Redux was created and the problems of multi-directional data flow.",
    "subtopics": [
      {
        "id": "redux-intro-flux-basics",
        "title": "What is Redux Introduction & Flux Architecture?",
        "conceptId": "redux_redux_intro_flux_whatis"
      },
      {
        "id": "redux-intro-flux-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux_redux_intro_flux_usage"
      },
      {
        "id": "redux-intro-flux-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux_redux_intro_flux_bestpractices"
      }
    ]
  },
  {
    "id": "redux-three-principles",
    "subjectId": "redux",
    "title": "The Three Core Principles of Redux",
    "order": 2,
    "description": "Single source of truth, state is read-only, changes with pure functions.",
    "subtopics": [
      {
        "id": "redux-three-principles-basics",
        "title": "What is The Three Core Principles of Redux?",
        "conceptId": "redux_redux_three_principles_whatis"
      },
      {
        "id": "redux-three-principles-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux_redux_three_principles_usage"
      },
      {
        "id": "redux-three-principles-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux_redux_three_principles_bestpractices"
      }
    ]
  },
  {
    "id": "redux-store-actions",
    "subjectId": "redux",
    "title": "Store, Actions & Action Types",
    "order": 3,
    "description": "Action objects with type and payload properties.",
    "subtopics": [
      {
        "id": "redux-store-actions-basics",
        "title": "What is Store, Actions & Action Types?",
        "conceptId": "redux_redux_store_actions_whatis"
      },
      {
        "id": "redux-store-actions-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux_redux_store_actions_usage"
      },
      {
        "id": "redux-store-actions-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux_redux_store_actions_bestpractices"
      }
    ]
  },
  {
    "id": "redux-action-creators",
    "subjectId": "redux",
    "title": "Action Creators & Dispatching Actions",
    "order": 4,
    "description": "Writing functions that return action objects and store.dispatch().",
    "subtopics": [
      {
        "id": "redux-action-creators-basics",
        "title": "What is Action Creators & Dispatching Actions?",
        "conceptId": "redux_redux_action_creators_whatis"
      },
      {
        "id": "redux-action-creators-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux_redux_action_creators_usage"
      },
      {
        "id": "redux-action-creators-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux_redux_action_creators_bestpractices"
      }
    ]
  },
  {
    "id": "redux-reducers-pure-functions",
    "subjectId": "redux",
    "title": "Reducers: Pure Functions for State Transitions",
    "order": 5,
    "description": "Why reducers must be pure without side effects or mutations.",
    "subtopics": [
      {
        "id": "redux-reducers-pure-functions-basics",
        "title": "What is Reducers?",
        "conceptId": "redux_redux_reducers_pure_functions_whatis"
      },
      {
        "id": "redux-reducers-pure-functions-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux_redux_reducers_pure_functions_usage"
      },
      {
        "id": "redux-reducers-pure-functions-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux_redux_reducers_pure_functions_bestpractices"
      }
    ]
  },
  {
    "id": "redux-state-immutability",
    "subjectId": "redux",
    "title": "State Immutability: Object & Array Patterns",
    "order": 6,
    "description": "Copying state with spread operators and updating nested properties.",
    "subtopics": [
      {
        "id": "redux-state-immutability-basics",
        "title": "What is State Immutability?",
        "conceptId": "redux_redux_state_immutability_whatis"
      },
      {
        "id": "redux-state-immutability-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux_redux_state_immutability_usage"
      },
      {
        "id": "redux-state-immutability-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux_redux_state_immutability_bestpractices"
      }
    ]
  },
  {
    "id": "redux-combinereducers",
    "subjectId": "redux",
    "title": "combineReducers: Splitting State Slices",
    "order": 7,
    "description": "Organizing complex application state into isolated slice reducers.",
    "subtopics": [
      {
        "id": "redux-combinereducers-basics",
        "title": "What is combineReducers?",
        "conceptId": "redux_redux_combinereducers_whatis"
      },
      {
        "id": "redux-combinereducers-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux_redux_combinereducers_usage"
      },
      {
        "id": "redux-combinereducers-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux_redux_combinereducers_bestpractices"
      }
    ]
  },
  {
    "id": "redux-store-subscribe",
    "subjectId": "redux",
    "title": "Subscribing to Store Changes: store.subscribe",
    "order": 8,
    "description": "Listening to state updates and reading store.getState().",
    "subtopics": [
      {
        "id": "redux-store-subscribe-basics",
        "title": "What is Subscribing to Store Changes?",
        "conceptId": "redux_redux_store_subscribe_whatis"
      },
      {
        "id": "redux-store-subscribe-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux_redux_store_subscribe_usage"
      },
      {
        "id": "redux-store-subscribe-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux_redux_store_subscribe_bestpractices"
      }
    ]
  },
  {
    "id": "redux-middleware-architecture",
    "subjectId": "redux",
    "title": "Redux Middleware Architecture",
    "order": 9,
    "description": "How middleware intercepts dispatched actions between dispatch and reducer.",
    "subtopics": [
      {
        "id": "redux-middleware-architecture-basics",
        "title": "What is Redux Middleware Architecture?",
        "conceptId": "redux_redux_middleware_architecture_whatis"
      },
      {
        "id": "redux-middleware-architecture-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux_redux_middleware_architecture_usage"
      },
      {
        "id": "redux-middleware-architecture-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux_redux_middleware_architecture_bestpractices"
      }
    ]
  },
  {
    "id": "redux-custom-middleware",
    "subjectId": "redux",
    "title": "Writing Custom Redux Middleware (currying pattern)",
    "order": 10,
    "description": "store => next => action logging and telemetry middleware.",
    "subtopics": [
      {
        "id": "redux-custom-middleware-basics",
        "title": "What is Writing Custom Redux Middleware (currying pattern)?",
        "conceptId": "redux_redux_custom_middleware_whatis"
      },
      {
        "id": "redux-custom-middleware-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux_redux_custom_middleware_usage"
      },
      {
        "id": "redux-custom-middleware-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux_redux_custom_middleware_bestpractices"
      }
    ]
  },
  {
    "id": "redux-thunk-basics",
    "subjectId": "redux",
    "title": "Redux Thunk for Asynchronous Logic",
    "order": 11,
    "description": "Dispatching functions instead of plain objects for API calls.",
    "subtopics": [
      {
        "id": "redux-thunk-basics-basics",
        "title": "What is Redux Thunk for Asynchronous Logic?",
        "conceptId": "redux_redux_thunk_basics_whatis"
      },
      {
        "id": "redux-thunk-basics-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux_redux_thunk_basics_usage"
      },
      {
        "id": "redux-thunk-basics-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux_redux_thunk_basics_bestpractices"
      }
    ]
  },
  {
    "id": "redux-devtools-extension",
    "subjectId": "redux",
    "title": "Redux DevTools Extension Setup",
    "order": 12,
    "description": "Time-travel debugging, action inspection, and state history.",
    "subtopics": [
      {
        "id": "redux-devtools-extension-basics",
        "title": "What is Redux DevTools Extension Setup?",
        "conceptId": "redux_redux_devtools_extension_whatis"
      },
      {
        "id": "redux-devtools-extension-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux_redux_devtools_extension_usage"
      },
      {
        "id": "redux-devtools-extension-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux_redux_devtools_extension_bestpractices"
      }
    ]
  },
  {
    "id": "redux-reselect-memoization",
    "subjectId": "redux",
    "title": "Selectors & Memoization with Reselect",
    "order": 13,
    "description": "createSelector for computing derived state efficiently.",
    "subtopics": [
      {
        "id": "redux-reselect-memoization-basics",
        "title": "What is Selectors & Memoization with Reselect?",
        "conceptId": "redux_redux_reselect_memoization_whatis"
      },
      {
        "id": "redux-reselect-memoization-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux_redux_reselect_memoization_usage"
      },
      {
        "id": "redux-reselect-memoization-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux_redux_reselect_memoization_bestpractices"
      }
    ]
  },
  {
    "id": "redux-normalizing-state",
    "subjectId": "redux",
    "title": "Normalizing State Shapes (byId & allIds)",
    "order": 14,
    "description": "Avoiding nested duplicates and treating state like a database table.",
    "subtopics": [
      {
        "id": "redux-normalizing-state-basics",
        "title": "What is Normalizing State Shapes (byId & allIds)?",
        "conceptId": "redux_redux_normalizing_state_whatis"
      },
      {
        "id": "redux-normalizing-state-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux_redux_normalizing_state_usage"
      },
      {
        "id": "redux-normalizing-state-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux_redux_normalizing_state_bestpractices"
      }
    ]
  },
  {
    "id": "redux-react-redux-provider",
    "subjectId": "redux",
    "title": "React-Redux: The <Provider> Component",
    "order": 15,
    "description": "Making the Redux store available to any React component.",
    "subtopics": [
      {
        "id": "redux-react-redux-provider-basics",
        "title": "What is React-Redux?",
        "conceptId": "redux_redux_react_redux_provider_whatis"
      },
      {
        "id": "redux-react-redux-provider-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux_redux_react_redux_provider_usage"
      },
      {
        "id": "redux-react-redux-provider-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux_redux_react_redux_provider_bestpractices"
      }
    ]
  },
  {
    "id": "redux-hook-useselector",
    "subjectId": "redux",
    "title": "The useSelector Hook",
    "order": 16,
    "description": "Extracting state data from the store with automatic subscriptions.",
    "subtopics": [
      {
        "id": "redux-hook-useselector-basics",
        "title": "What is The useSelector Hook?",
        "conceptId": "redux_redux_hook_useselector_whatis"
      },
      {
        "id": "redux-hook-useselector-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux_redux_hook_useselector_usage"
      },
      {
        "id": "redux-hook-useselector-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux_redux_hook_useselector_bestpractices"
      }
    ]
  },
  {
    "id": "redux-hook-usedispatch",
    "subjectId": "redux",
    "title": "The useDispatch Hook",
    "order": 17,
    "description": "Obtaining dispatch function reference inside components.",
    "subtopics": [
      {
        "id": "redux-hook-usedispatch-basics",
        "title": "What is The useDispatch Hook?",
        "conceptId": "redux_redux_hook_usedispatch_whatis"
      },
      {
        "id": "redux-hook-usedispatch-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux_redux_hook_usedispatch_usage"
      },
      {
        "id": "redux-hook-usedispatch-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux_redux_hook_usedispatch_bestpractices"
      }
    ]
  },
  {
    "id": "redux-vs-context-vs-zustand",
    "subjectId": "redux",
    "title": "Redux vs Context API vs Zustand",
    "order": 18,
    "description": "Comparing performance, complexity, and boilerplates.",
    "subtopics": [
      {
        "id": "redux-vs-context-vs-zustand-basics",
        "title": "What is Redux vs Context API vs Zustand?",
        "conceptId": "redux_redux_vs_context_vs_zustand_whatis"
      },
      {
        "id": "redux-vs-context-vs-zustand-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux_redux_vs_context_vs_zustand_usage"
      },
      {
        "id": "redux-vs-context-vs-zustand-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux_redux_vs_context_vs_zustand_bestpractices"
      }
    ]
  },
  {
    "id": "redux-anti-patterns",
    "subjectId": "redux",
    "title": "Common Redux Anti-Patterns",
    "order": 19,
    "description": "Putting non-serializable data in state, mutating state in reducers.",
    "subtopics": [
      {
        "id": "redux-anti-patterns-basics",
        "title": "What is Common Redux Anti-Patterns?",
        "conceptId": "redux_redux_anti_patterns_whatis"
      },
      {
        "id": "redux-anti-patterns-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux_redux_anti_patterns_usage"
      },
      {
        "id": "redux-anti-patterns-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux_redux_anti_patterns_bestpractices"
      }
    ]
  },
  {
    "id": "redux-migration-readiness",
    "subjectId": "redux",
    "title": "Preparing Legacy Redux for Redux Toolkit",
    "order": 20,
    "description": "Steps to modernize legacy boilerplate into clean modern RTK.",
    "subtopics": [
      {
        "id": "redux-migration-readiness-basics",
        "title": "What is Preparing Legacy Redux for Redux Toolkit?",
        "conceptId": "redux_redux_migration_readiness_whatis"
      },
      {
        "id": "redux-migration-readiness-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux_redux_migration_readiness_usage"
      },
      {
        "id": "redux-migration-readiness-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux_redux_migration_readiness_bestpractices"
      }
    ]
  }
],

  "redux-toolkit": [
  {
    "id": "rtk-intro-why",
    "subjectId": "redux-toolkit",
    "title": "Why Redux Toolkit (RTK)? The Official Standard",
    "order": 1,
    "description": "Solving Redux boilerplate, complicated store setup, and missing packages.",
    "subtopics": [
      {
        "id": "rtk-intro-why-basics",
        "title": "What is Why Redux Toolkit (RTK)? The Official Standard?",
        "conceptId": "redux-toolkit_rtk_intro_why_whatis"
      },
      {
        "id": "rtk-intro-why-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux-toolkit_rtk_intro_why_usage"
      },
      {
        "id": "rtk-intro-why-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux-toolkit_rtk_intro_why_bestpractices"
      }
    ]
  },
  {
    "id": "rtk-configurestore",
    "subjectId": "redux-toolkit",
    "title": "configureStore Setup & Built-in Middleware",
    "order": 2,
    "description": "Single-call store configuration with Thunk and DevTools enabled.",
    "subtopics": [
      {
        "id": "rtk-configurestore-basics",
        "title": "What is configureStore Setup & Built-in Middleware?",
        "conceptId": "redux-toolkit_rtk_configurestore_whatis"
      },
      {
        "id": "rtk-configurestore-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux-toolkit_rtk_configurestore_usage"
      },
      {
        "id": "rtk-configurestore-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux-toolkit_rtk_configurestore_bestpractices"
      }
    ]
  },
  {
    "id": "rtk-createslice",
    "subjectId": "redux-toolkit",
    "title": "createSlice: Actions and Reducers in One Place",
    "order": 3,
    "description": "Auto-generating action creators and types from reducer function names.",
    "subtopics": [
      {
        "id": "rtk-createslice-basics",
        "title": "What is createSlice?",
        "conceptId": "redux-toolkit_rtk_createslice_whatis"
      },
      {
        "id": "rtk-createslice-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux-toolkit_rtk_createslice_usage"
      },
      {
        "id": "rtk-createslice-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux-toolkit_rtk_createslice_bestpractices"
      }
    ]
  },
  {
    "id": "rtk-immer-integration",
    "subjectId": "redux-toolkit",
    "title": "Immer Integration: Writing \"Mutative\" Logic Safely",
    "order": 4,
    "description": "How Immer produces immutable state copies under the hood.",
    "subtopics": [
      {
        "id": "rtk-immer-integration-basics",
        "title": "What is Immer Integration?",
        "conceptId": "redux-toolkit_rtk_immer_integration_whatis"
      },
      {
        "id": "rtk-immer-integration-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux-toolkit_rtk_immer_integration_usage"
      },
      {
        "id": "rtk-immer-integration-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux-toolkit_rtk_immer_integration_bestpractices"
      }
    ]
  },
  {
    "id": "rtk-createaction-createreducer",
    "subjectId": "redux-toolkit",
    "title": "createAction & createReducer Standalone Utilities",
    "order": 5,
    "description": "Lower-level building blocks for non-slice use cases.",
    "subtopics": [
      {
        "id": "rtk-createaction-createreducer-basics",
        "title": "What is createAction & createReducer Standalone Utilities?",
        "conceptId": "redux-toolkit_rtk_createaction_createreducer_whatis"
      },
      {
        "id": "rtk-createaction-createreducer-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux-toolkit_rtk_createaction_createreducer_usage"
      },
      {
        "id": "rtk-createaction-createreducer-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux-toolkit_rtk_createaction_createreducer_bestpractices"
      }
    ]
  },
  {
    "id": "rtk-createasyncthunk",
    "subjectId": "redux-toolkit",
    "title": "createAsyncThunk for API Requests",
    "order": 6,
    "description": "Dispatched lifecycle actions: pending, fulfilled, and rejected.",
    "subtopics": [
      {
        "id": "rtk-createasyncthunk-basics",
        "title": "What is createAsyncThunk for API Requests?",
        "conceptId": "redux-toolkit_rtk_createasyncthunk_whatis"
      },
      {
        "id": "rtk-createasyncthunk-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux-toolkit_rtk_createasyncthunk_usage"
      },
      {
        "id": "rtk-createasyncthunk-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux-toolkit_rtk_createasyncthunk_bestpractices"
      }
    ]
  },
  {
    "id": "rtk-extrareducers-builder",
    "subjectId": "redux-toolkit",
    "title": "extraReducers & The Builder Callback Syntax",
    "order": 7,
    "description": "Responding to external actions and async thunks cleanly.",
    "subtopics": [
      {
        "id": "rtk-extrareducers-builder-basics",
        "title": "What is extraReducers & The Builder Callback Syntax?",
        "conceptId": "redux-toolkit_rtk_extrareducers_builder_whatis"
      },
      {
        "id": "rtk-extrareducers-builder-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux-toolkit_rtk_extrareducers_builder_usage"
      },
      {
        "id": "rtk-extrareducers-builder-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux-toolkit_rtk_extrareducers_builder_bestpractices"
      }
    ]
  },
  {
    "id": "rtk-query-intro",
    "subjectId": "redux-toolkit",
    "title": "RTK Query Introduction: Data Fetching & Caching",
    "order": 8,
    "description": "Eliminating manual async thunks, loading states, and cache management.",
    "subtopics": [
      {
        "id": "rtk-query-intro-basics",
        "title": "What is RTK Query Introduction?",
        "conceptId": "redux-toolkit_rtk_query_intro_whatis"
      },
      {
        "id": "rtk-query-intro-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux-toolkit_rtk_query_intro_usage"
      },
      {
        "id": "rtk-query-intro-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux-toolkit_rtk_query_intro_bestpractices"
      }
    ]
  },
  {
    "id": "rtk-query-createapi",
    "subjectId": "redux-toolkit",
    "title": "createApi & fetchBaseQuery Setup",
    "order": 9,
    "description": "Defining base URLs, endpoints, and generated React hooks.",
    "subtopics": [
      {
        "id": "rtk-query-createapi-basics",
        "title": "What is createApi & fetchBaseQuery Setup?",
        "conceptId": "redux-toolkit_rtk_query_createapi_whatis"
      },
      {
        "id": "rtk-query-createapi-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux-toolkit_rtk_query_createapi_usage"
      },
      {
        "id": "rtk-query-createapi-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux-toolkit_rtk_query_createapi_bestpractices"
      }
    ]
  },
  {
    "id": "rtk-query-endpoints",
    "subjectId": "redux-toolkit",
    "title": "Query Endpoints vs Mutation Endpoints",
    "order": 10,
    "description": "Reading data (queries) vs modifying data (mutations).",
    "subtopics": [
      {
        "id": "rtk-query-endpoints-basics",
        "title": "What is Query Endpoints vs Mutation Endpoints?",
        "conceptId": "redux-toolkit_rtk_query_endpoints_whatis"
      },
      {
        "id": "rtk-query-endpoints-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux-toolkit_rtk_query_endpoints_usage"
      },
      {
        "id": "rtk-query-endpoints-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux-toolkit_rtk_query_endpoints_bestpractices"
      }
    ]
  },
  {
    "id": "rtk-query-cache-tags",
    "subjectId": "redux-toolkit",
    "title": "Automated Cache Invalidation with Tag Types",
    "order": 11,
    "description": "providesTags and invalidatesTags for instant UI refresh.",
    "subtopics": [
      {
        "id": "rtk-query-cache-tags-basics",
        "title": "What is Automated Cache Invalidation with Tag Types?",
        "conceptId": "redux-toolkit_rtk_query_cache_tags_whatis"
      },
      {
        "id": "rtk-query-cache-tags-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux-toolkit_rtk_query_cache_tags_usage"
      },
      {
        "id": "rtk-query-cache-tags-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux-toolkit_rtk_query_cache_tags_bestpractices"
      }
    ]
  },
  {
    "id": "rtk-query-optimistic-updates",
    "subjectId": "redux-toolkit",
    "title": "Optimistic Updates in RTK Query",
    "order": 12,
    "description": "onQueryStarted with pessimistic rollback on server errors.",
    "subtopics": [
      {
        "id": "rtk-query-optimistic-updates-basics",
        "title": "What is Optimistic Updates in RTK Query?",
        "conceptId": "redux-toolkit_rtk_query_optimistic_updates_whatis"
      },
      {
        "id": "rtk-query-optimistic-updates-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux-toolkit_rtk_query_optimistic_updates_usage"
      },
      {
        "id": "rtk-query-optimistic-updates-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux-toolkit_rtk_query_optimistic_updates_bestpractices"
      }
    ]
  },
  {
    "id": "rtk-query-polling-refetch",
    "subjectId": "redux-toolkit",
    "title": "Polling & Refetching Strategies in RTK Query",
    "order": 13,
    "description": "pollingInterval, refetchOnFocus, and refetchOnReconnect.",
    "subtopics": [
      {
        "id": "rtk-query-polling-refetch-basics",
        "title": "What is Polling & Refetching Strategies in RTK Query?",
        "conceptId": "redux-toolkit_rtk_query_polling_refetch_whatis"
      },
      {
        "id": "rtk-query-polling-refetch-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux-toolkit_rtk_query_polling_refetch_usage"
      },
      {
        "id": "rtk-query-polling-refetch-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux-toolkit_rtk_query_polling_refetch_bestpractices"
      }
    ]
  },
  {
    "id": "rtk-query-prefetching",
    "subjectId": "redux-toolkit",
    "title": "RTK Query Prefetching Data",
    "order": 14,
    "description": "Prefetching data on button hover before the user navigates.",
    "subtopics": [
      {
        "id": "rtk-query-prefetching-basics",
        "title": "What is RTK Query Prefetching Data?",
        "conceptId": "redux-toolkit_rtk_query_prefetching_whatis"
      },
      {
        "id": "rtk-query-prefetching-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux-toolkit_rtk_query_prefetching_usage"
      },
      {
        "id": "rtk-query-prefetching-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux-toolkit_rtk_query_prefetching_bestpractices"
      }
    ]
  },
  {
    "id": "rtk-query-custom-basequery",
    "subjectId": "redux-toolkit",
    "title": "Custom Base Query: Auth Tokens & Refresh Handlers",
    "order": 15,
    "description": "Injecting Bearer tokens and intercepting 401 refresh flows.",
    "subtopics": [
      {
        "id": "rtk-query-custom-basequery-basics",
        "title": "What is Custom Base Query?",
        "conceptId": "redux-toolkit_rtk_query_custom_basequery_whatis"
      },
      {
        "id": "rtk-query-custom-basequery-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux-toolkit_rtk_query_custom_basequery_usage"
      },
      {
        "id": "rtk-query-custom-basequery-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux-toolkit_rtk_query_custom_basequery_bestpractices"
      }
    ]
  },
  {
    "id": "rtk-listener-middleware",
    "subjectId": "redux-toolkit",
    "title": "RTK Listener Middleware (createListenerMiddleware)",
    "order": 16,
    "description": "Lightweight alternative to Redux Saga for side effects and logging.",
    "subtopics": [
      {
        "id": "rtk-listener-middleware-basics",
        "title": "What is RTK Listener Middleware (createListenerMiddleware)?",
        "conceptId": "redux-toolkit_rtk_listener_middleware_whatis"
      },
      {
        "id": "rtk-listener-middleware-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux-toolkit_rtk_listener_middleware_usage"
      },
      {
        "id": "rtk-listener-middleware-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux-toolkit_rtk_listener_middleware_bestpractices"
      }
    ]
  },
  {
    "id": "rtk-typescript-typing",
    "subjectId": "redux-toolkit",
    "title": "TypeScript Integration with Redux Toolkit",
    "order": 17,
    "description": "RootState, AppDispatch, and typed useAppSelector / useAppDispatch.",
    "subtopics": [
      {
        "id": "rtk-typescript-typing-basics",
        "title": "What is TypeScript Integration with Redux Toolkit?",
        "conceptId": "redux-toolkit_rtk_typescript_typing_whatis"
      },
      {
        "id": "rtk-typescript-typing-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux-toolkit_rtk_typescript_typing_usage"
      },
      {
        "id": "rtk-typescript-typing-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux-toolkit_rtk_typescript_typing_bestpractices"
      }
    ]
  },
  {
    "id": "rtk-entity-adapter",
    "subjectId": "redux-toolkit",
    "title": "createEntityAdapter for Normalized CRUD",
    "order": 18,
    "description": "Managing normalized collections with getSelectors and adapter methods.",
    "subtopics": [
      {
        "id": "rtk-entity-adapter-basics",
        "title": "What is createEntityAdapter for Normalized CRUD?",
        "conceptId": "redux-toolkit_rtk_entity_adapter_whatis"
      },
      {
        "id": "rtk-entity-adapter-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux-toolkit_rtk_entity_adapter_usage"
      },
      {
        "id": "rtk-entity-adapter-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux-toolkit_rtk_entity_adapter_bestpractices"
      }
    ]
  },
  {
    "id": "rtk-pagination-infinite",
    "subjectId": "redux-toolkit",
    "title": "Handling Pagination & Infinite Scroll in RTK Query",
    "order": 19,
    "description": "Page numbers, cursor tokens, and merging cache pages.",
    "subtopics": [
      {
        "id": "rtk-pagination-infinite-basics",
        "title": "What is Handling Pagination & Infinite Scroll in RTK Query?",
        "conceptId": "redux-toolkit_rtk_pagination_infinite_whatis"
      },
      {
        "id": "rtk-pagination-infinite-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux-toolkit_rtk_pagination_infinite_usage"
      },
      {
        "id": "rtk-pagination-infinite-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux-toolkit_rtk_pagination_infinite_bestpractices"
      }
    ]
  },
  {
    "id": "rtk-best-practices",
    "subjectId": "redux-toolkit",
    "title": "Production Best Practices with Redux Toolkit",
    "order": 20,
    "description": "Folder structure, co-locating slices, and avoiding common pitfalls.",
    "subtopics": [
      {
        "id": "rtk-best-practices-basics",
        "title": "What is Production Best Practices with Redux Toolkit?",
        "conceptId": "redux-toolkit_rtk_best_practices_whatis"
      },
      {
        "id": "rtk-best-practices-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "redux-toolkit_rtk_best_practices_usage"
      },
      {
        "id": "rtk-best-practices-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "redux-toolkit_rtk_best_practices_bestpractices"
      }
    ]
  }
],

  "tanstack-query": [
  {
    "id": "tq-intro-philosophy",
    "subjectId": "tanstack-query",
    "title": "TanStack Query Introduction & Philosophy",
    "order": 1,
    "description": "Server state vs client state and why fetching is not state management.",
    "subtopics": [
      {
        "id": "tq-intro-philosophy-basics",
        "title": "What is TanStack Query Introduction & Philosophy?",
        "conceptId": "tanstack-query_tq_intro_philosophy_whatis"
      },
      {
        "id": "tq-intro-philosophy-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_intro_philosophy_usage"
      },
      {
        "id": "tq-intro-philosophy-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_intro_philosophy_bestpractices"
      }
    ]
  },
  {
    "id": "tq-queryclient-setup",
    "subjectId": "tanstack-query",
    "title": "QueryClient & QueryClientProvider Setup",
    "order": 2,
    "description": "Wrapping the app and default query configuration options.",
    "subtopics": [
      {
        "id": "tq-queryclient-setup-basics",
        "title": "What is QueryClient & QueryClientProvider Setup?",
        "conceptId": "tanstack-query_tq_queryclient_setup_whatis"
      },
      {
        "id": "tq-queryclient-setup-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_queryclient_setup_usage"
      },
      {
        "id": "tq-queryclient-setup-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_queryclient_setup_bestpractices"
      }
    ]
  },
  {
    "id": "tq-hook-usequery",
    "subjectId": "tanstack-query",
    "title": "The useQuery Hook Basics",
    "order": 3,
    "description": "Passing queryKey and queryFn to fetch and cache data.",
    "subtopics": [
      {
        "id": "tq-hook-usequery-basics",
        "title": "What is The useQuery Hook Basics?",
        "conceptId": "tanstack-query_tq_hook_usequery_whatis"
      },
      {
        "id": "tq-hook-usequery-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_hook_usequery_usage"
      },
      {
        "id": "tq-hook-usequery-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_hook_usequery_bestpractices"
      }
    ]
  },
  {
    "id": "tq-query-keys",
    "subjectId": "tanstack-query",
    "title": "Query Keys & Query Key Arrays",
    "order": 4,
    "description": "Hierarchical query keys ([\"todos\", id]) and automatic cache separation.",
    "subtopics": [
      {
        "id": "tq-query-keys-basics",
        "title": "What is Query Keys & Query Key Arrays?",
        "conceptId": "tanstack-query_tq_query_keys_whatis"
      },
      {
        "id": "tq-query-keys-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_query_keys_usage"
      },
      {
        "id": "tq-query-keys-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_query_keys_bestpractices"
      }
    ]
  },
  {
    "id": "tq-query-functions",
    "subjectId": "tanstack-query",
    "title": "Query Functions: Fetch, Axios & Error Throwing",
    "order": 5,
    "description": "Writing clean query functions and handling HTTP rejection.",
    "subtopics": [
      {
        "id": "tq-query-functions-basics",
        "title": "What is Query Functions?",
        "conceptId": "tanstack-query_tq_query_functions_whatis"
      },
      {
        "id": "tq-query-functions-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_query_functions_usage"
      },
      {
        "id": "tq-query-functions-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_query_functions_bestpractices"
      }
    ]
  },
  {
    "id": "tq-query-statuses",
    "subjectId": "tanstack-query",
    "title": "Query Statuses: isPending, isError, isSuccess, isFetching",
    "order": 6,
    "description": "Distinguishing hard loading states from background refreshes.",
    "subtopics": [
      {
        "id": "tq-query-statuses-basics",
        "title": "What is Query Statuses?",
        "conceptId": "tanstack-query_tq_query_statuses_whatis"
      },
      {
        "id": "tq-query-statuses-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_query_statuses_usage"
      },
      {
        "id": "tq-query-statuses-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_query_statuses_bestpractices"
      }
    ]
  },
  {
    "id": "tq-stale-vs-gc-time",
    "subjectId": "tanstack-query",
    "title": "staleTime vs gcTime (Garbage Collection Time)",
    "order": 7,
    "description": "When data is considered fresh vs when inactive cache is deleted.",
    "subtopics": [
      {
        "id": "tq-stale-vs-gc-time-basics",
        "title": "What is staleTime vs gcTime (Garbage Collection Time)?",
        "conceptId": "tanstack-query_tq_stale_vs_gc_time_whatis"
      },
      {
        "id": "tq-stale-vs-gc-time-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_stale_vs_gc_time_usage"
      },
      {
        "id": "tq-stale-vs-gc-time-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_stale_vs_gc_time_bestpractices"
      }
    ]
  },
  {
    "id": "tq-window-focus-refetch",
    "subjectId": "tanstack-query",
    "title": "Window Focus & Network Reconnect Refetching",
    "order": 8,
    "description": "Automatic background synchronization when users return to tab.",
    "subtopics": [
      {
        "id": "tq-window-focus-refetch-basics",
        "title": "What is Window Focus & Network Reconnect Refetching?",
        "conceptId": "tanstack-query_tq_window_focus_refetch_whatis"
      },
      {
        "id": "tq-window-focus-refetch-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_window_focus_refetch_usage"
      },
      {
        "id": "tq-window-focus-refetch-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_window_focus_refetch_bestpractices"
      }
    ]
  },
  {
    "id": "tq-retries-delay",
    "subjectId": "tanstack-query",
    "title": "Query Retries & Exponential Retry Delays",
    "order": 9,
    "description": "Configuring automatic failure retries and retry conditions.",
    "subtopics": [
      {
        "id": "tq-retries-delay-basics",
        "title": "What is Query Retries & Exponential Retry Delays?",
        "conceptId": "tanstack-query_tq_retries_delay_whatis"
      },
      {
        "id": "tq-retries-delay-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_retries_delay_usage"
      },
      {
        "id": "tq-retries-delay-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_retries_delay_bestpractices"
      }
    ]
  },
  {
    "id": "tq-dependent-queries",
    "subjectId": "tanstack-query",
    "title": "Dependent & Sequential Queries (enabled option)",
    "order": 10,
    "description": "Running queries only after another query finishes.",
    "subtopics": [
      {
        "id": "tq-dependent-queries-basics",
        "title": "What is Dependent & Sequential Queries (enabled option)?",
        "conceptId": "tanstack-query_tq_dependent_queries_whatis"
      },
      {
        "id": "tq-dependent-queries-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_dependent_queries_usage"
      },
      {
        "id": "tq-dependent-queries-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_dependent_queries_bestpractices"
      }
    ]
  },
  {
    "id": "tq-parallel-queries",
    "subjectId": "tanstack-query",
    "title": "Parallel Queries & useQueries Hook",
    "order": 11,
    "description": "Fetching variable numbers of queries concurrently.",
    "subtopics": [
      {
        "id": "tq-parallel-queries-basics",
        "title": "What is Parallel Queries & useQueries Hook?",
        "conceptId": "tanstack-query_tq_parallel_queries_whatis"
      },
      {
        "id": "tq-parallel-queries-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_parallel_queries_usage"
      },
      {
        "id": "tq-parallel-queries-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_parallel_queries_bestpractices"
      }
    ]
  },
  {
    "id": "tq-hook-usemutation",
    "subjectId": "tanstack-query",
    "title": "The useMutation Hook for POST, PUT & DELETE",
    "order": 12,
    "description": "Triggering data mutations and handling server responses.",
    "subtopics": [
      {
        "id": "tq-hook-usemutation-basics",
        "title": "What is The useMutation Hook for POST, PUT & DELETE?",
        "conceptId": "tanstack-query_tq_hook_usemutation_whatis"
      },
      {
        "id": "tq-hook-usemutation-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_hook_usemutation_usage"
      },
      {
        "id": "tq-hook-usemutation-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_hook_usemutation_bestpractices"
      }
    ]
  },
  {
    "id": "tq-mutation-lifecycle",
    "subjectId": "tanstack-query",
    "title": "Mutation Lifecycle Callbacks: onSuccess, onError, onSettled",
    "order": 13,
    "description": "Running side effects and invalidating queries after mutations.",
    "subtopics": [
      {
        "id": "tq-mutation-lifecycle-basics",
        "title": "What is Mutation Lifecycle Callbacks?",
        "conceptId": "tanstack-query_tq_mutation_lifecycle_whatis"
      },
      {
        "id": "tq-mutation-lifecycle-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_mutation_lifecycle_usage"
      },
      {
        "id": "tq-mutation-lifecycle-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_mutation_lifecycle_bestpractices"
      }
    ]
  },
  {
    "id": "tq-optimistic-updates",
    "subjectId": "tanstack-query",
    "title": "Optimistic Updates: onMutate & Cache Rollback",
    "order": 14,
    "description": "Updating cache instantly before mutation and rolling back on error.",
    "subtopics": [
      {
        "id": "tq-optimistic-updates-basics",
        "title": "What is Optimistic Updates?",
        "conceptId": "tanstack-query_tq_optimistic_updates_whatis"
      },
      {
        "id": "tq-optimistic-updates-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_optimistic_updates_usage"
      },
      {
        "id": "tq-optimistic-updates-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_optimistic_updates_bestpractices"
      }
    ]
  },
  {
    "id": "tq-cache-invalidation",
    "subjectId": "tanstack-query",
    "title": "Cache Invalidation with queryClient.invalidateQueries",
    "order": 15,
    "description": "Targeting specific query keys to trigger automatic refetches.",
    "subtopics": [
      {
        "id": "tq-cache-invalidation-basics",
        "title": "What is Cache Invalidation with queryClient.invalidateQueries?",
        "conceptId": "tanstack-query_tq_cache_invalidation_whatis"
      },
      {
        "id": "tq-cache-invalidation-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_cache_invalidation_usage"
      },
      {
        "id": "tq-cache-invalidation-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_cache_invalidation_bestpractices"
      }
    ]
  },
  {
    "id": "tq-setquerydata",
    "subjectId": "tanstack-query",
    "title": "Manual Cache Updates with queryClient.setQueryData",
    "order": 16,
    "description": "Directly modifying cached data without refetching from server.",
    "subtopics": [
      {
        "id": "tq-setquerydata-basics",
        "title": "What is Manual Cache Updates with queryClient.setQueryData?",
        "conceptId": "tanstack-query_tq_setquerydata_whatis"
      },
      {
        "id": "tq-setquerydata-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_setquerydata_usage"
      },
      {
        "id": "tq-setquerydata-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_setquerydata_bestpractices"
      }
    ]
  },
  {
    "id": "tq-paginated-queries",
    "subjectId": "tanstack-query",
    "title": "Paginated Queries & placeholderData: keepPreviousData",
    "order": 17,
    "description": "Preventing UI flicker during page transitions.",
    "subtopics": [
      {
        "id": "tq-paginated-queries-basics",
        "title": "What is Paginated Queries & placeholderData?",
        "conceptId": "tanstack-query_tq_paginated_queries_whatis"
      },
      {
        "id": "tq-paginated-queries-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_paginated_queries_usage"
      },
      {
        "id": "tq-paginated-queries-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_paginated_queries_bestpractices"
      }
    ]
  },
  {
    "id": "tq-infinite-queries",
    "subjectId": "tanstack-query",
    "title": "Infinite Queries: useInfiniteQuery & getNextPageParam",
    "order": 18,
    "description": "Building infinite scroll and \"Load More\" feeds.",
    "subtopics": [
      {
        "id": "tq-infinite-queries-basics",
        "title": "What is Infinite Queries?",
        "conceptId": "tanstack-query_tq_infinite_queries_whatis"
      },
      {
        "id": "tq-infinite-queries-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_infinite_queries_usage"
      },
      {
        "id": "tq-infinite-queries-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_infinite_queries_bestpractices"
      }
    ]
  },
  {
    "id": "tq-prefetching",
    "subjectId": "tanstack-query",
    "title": "Prefetching Queries with queryClient.prefetchQuery",
    "order": 19,
    "description": "Loading data ahead of time on link hover.",
    "subtopics": [
      {
        "id": "tq-prefetching-basics",
        "title": "What is Prefetching Queries with queryClient.prefetchQuery?",
        "conceptId": "tanstack-query_tq_prefetching_whatis"
      },
      {
        "id": "tq-prefetching-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_prefetching_usage"
      },
      {
        "id": "tq-prefetching-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_prefetching_bestpractices"
      }
    ]
  },
  {
    "id": "tq-initial-vs-placeholder",
    "subjectId": "tanstack-query",
    "title": "initialData vs placeholderData",
    "order": 20,
    "description": "Cached data vs temporary placeholder preview.",
    "subtopics": [
      {
        "id": "tq-initial-vs-placeholder-basics",
        "title": "What is initialData vs placeholderData?",
        "conceptId": "tanstack-query_tq_initial_vs_placeholder_whatis"
      },
      {
        "id": "tq-initial-vs-placeholder-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_initial_vs_placeholder_usage"
      },
      {
        "id": "tq-initial-vs-placeholder-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_initial_vs_placeholder_bestpractices"
      }
    ]
  },
  {
    "id": "tq-suspense-mode",
    "subjectId": "tanstack-query",
    "title": "Suspense Mode & useSuspenseQuery in TanStack v5",
    "order": 21,
    "description": "Integrating TanStack Query with React Suspense and Error Boundaries.",
    "subtopics": [
      {
        "id": "tq-suspense-mode-basics",
        "title": "What is Suspense Mode & useSuspenseQuery in TanStack v5?",
        "conceptId": "tanstack-query_tq_suspense_mode_whatis"
      },
      {
        "id": "tq-suspense-mode-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_suspense_mode_usage"
      },
      {
        "id": "tq-suspense-mode-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_suspense_mode_bestpractices"
      }
    ]
  },
  {
    "id": "tq-devtools",
    "subjectId": "tanstack-query",
    "title": "TanStack Query DevTools",
    "order": 22,
    "description": "Visualizing query states, cache inspection, and manual triggers.",
    "subtopics": [
      {
        "id": "tq-devtools-basics",
        "title": "What is TanStack Query DevTools?",
        "conceptId": "tanstack-query_tq_devtools_whatis"
      },
      {
        "id": "tq-devtools-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_devtools_usage"
      },
      {
        "id": "tq-devtools-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_devtools_bestpractices"
      }
    ]
  },
  {
    "id": "tq-persisting-cache",
    "subjectId": "tanstack-query",
    "title": "Persisting Query Cache to LocalStorage",
    "order": 23,
    "description": "persistQueryClient plugin for offline web applications.",
    "subtopics": [
      {
        "id": "tq-persisting-cache-basics",
        "title": "What is Persisting Query Cache to LocalStorage?",
        "conceptId": "tanstack-query_tq_persisting_cache_whatis"
      },
      {
        "id": "tq-persisting-cache-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_persisting_cache_usage"
      },
      {
        "id": "tq-persisting-cache-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_persisting_cache_bestpractices"
      }
    ]
  },
  {
    "id": "tq-custom-hooks-pattern",
    "subjectId": "tanstack-query",
    "title": "Best Practices: Custom Query Hooks Architecture",
    "order": 24,
    "description": "Encapsulating useQuery inside dedicated useUsers, useProducts hooks.",
    "subtopics": [
      {
        "id": "tq-custom-hooks-pattern-basics",
        "title": "What is Best Practices?",
        "conceptId": "tanstack-query_tq_custom_hooks_pattern_whatis"
      },
      {
        "id": "tq-custom-hooks-pattern-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_custom_hooks_pattern_usage"
      },
      {
        "id": "tq-custom-hooks-pattern-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_custom_hooks_pattern_bestpractices"
      }
    ]
  },
  {
    "id": "tq-migrating-v5",
    "subjectId": "tanstack-query",
    "title": "TanStack Query v5 Upgrades & New Features",
    "order": 25,
    "description": "Single-object syntax, gcTime rename, and simplified API.",
    "subtopics": [
      {
        "id": "tq-migrating-v5-basics",
        "title": "What is TanStack Query v5 Upgrades & New Features?",
        "conceptId": "tanstack-query_tq_migrating_v5_whatis"
      },
      {
        "id": "tq-migrating-v5-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tanstack-query_tq_migrating_v5_usage"
      },
      {
        "id": "tq-migrating-v5-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tanstack-query_tq_migrating_v5_bestpractices"
      }
    ]
  }
],

  "react-router": [
  {
    "id": "rr-intro-evolution",
    "subjectId": "react-router",
    "title": "React Router Introduction & Version Evolution",
    "order": 1,
    "description": "Client-side routing concepts and modern React Router features.",
    "subtopics": [
      {
        "id": "rr-intro-evolution-basics",
        "title": "What is React Router Introduction & Version Evolution?",
        "conceptId": "react-router_rr_intro_evolution_whatis"
      },
      {
        "id": "rr-intro-evolution-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react-router_rr_intro_evolution_usage"
      },
      {
        "id": "rr-intro-evolution-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react-router_rr_intro_evolution_bestpractices"
      }
    ]
  },
  {
    "id": "rr-router-types",
    "subjectId": "react-router",
    "title": "Router Types: BrowserRouter vs HashRouter vs MemoryRouter",
    "order": 2,
    "description": "History API routing, hash routing for static hosts, and memory routing.",
    "subtopics": [
      {
        "id": "rr-router-types-basics",
        "title": "What is Router Types?",
        "conceptId": "react-router_rr_router_types_whatis"
      },
      {
        "id": "rr-router-types-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react-router_rr_router_types_usage"
      },
      {
        "id": "rr-router-types-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react-router_rr_router_types_bestpractices"
      }
    ]
  },
  {
    "id": "rr-routes-route",
    "subjectId": "react-router",
    "title": "Routes & Route Components: Defining Page Paths",
    "order": 3,
    "description": "Path matching, element prop, and component rendering.",
    "subtopics": [
      {
        "id": "rr-routes-route-basics",
        "title": "What is Routes & Route Components?",
        "conceptId": "react-router_rr_routes_route_whatis"
      },
      {
        "id": "rr-routes-route-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react-router_rr_routes_route_usage"
      },
      {
        "id": "rr-routes-route-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react-router_rr_routes_route_bestpractices"
      }
    ]
  },
  {
    "id": "rr-link-navlink",
    "subjectId": "react-router",
    "title": "Link vs NavLink: Active Styling & Navigation",
    "order": 4,
    "description": "Preventing full page reloads and applying active CSS classes.",
    "subtopics": [
      {
        "id": "rr-link-navlink-basics",
        "title": "What is Link vs NavLink?",
        "conceptId": "react-router_rr_link_navlink_whatis"
      },
      {
        "id": "rr-link-navlink-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react-router_rr_link_navlink_usage"
      },
      {
        "id": "rr-link-navlink-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react-router_rr_link_navlink_bestpractices"
      }
    ]
  },
  {
    "id": "rr-nested-routes-outlet",
    "subjectId": "react-router",
    "title": "Nested Routes & The <Outlet> Component",
    "order": 5,
    "description": "Building multi-level layouts with persistent sidebars and headers.",
    "subtopics": [
      {
        "id": "rr-nested-routes-outlet-basics",
        "title": "What is Nested Routes & The <Outlet> Component?",
        "conceptId": "react-router_rr_nested_routes_outlet_whatis"
      },
      {
        "id": "rr-nested-routes-outlet-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react-router_rr_nested_routes_outlet_usage"
      },
      {
        "id": "rr-nested-routes-outlet-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react-router_rr_nested_routes_outlet_bestpractices"
      }
    ]
  },
  {
    "id": "rr-useparams",
    "subjectId": "react-router",
    "title": "Dynamic Route Segments & The useParams Hook",
    "order": 6,
    "description": "Extracting route parameters like /users/:id.",
    "subtopics": [
      {
        "id": "rr-useparams-basics",
        "title": "What is Dynamic Route Segments & The useParams Hook?",
        "conceptId": "react-router_rr_useparams_whatis"
      },
      {
        "id": "rr-useparams-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react-router_rr_useparams_usage"
      },
      {
        "id": "rr-useparams-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react-router_rr_useparams_bestpractices"
      }
    ]
  },
  {
    "id": "rr-usesearchparams",
    "subjectId": "react-router",
    "title": "Query Parameters & The useSearchParams Hook",
    "order": 7,
    "description": "Reading and writing URL search params (?query=test&page=2).",
    "subtopics": [
      {
        "id": "rr-usesearchparams-basics",
        "title": "What is Query Parameters & The useSearchParams Hook?",
        "conceptId": "react-router_rr_usesearchparams_whatis"
      },
      {
        "id": "rr-usesearchparams-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react-router_rr_usesearchparams_usage"
      },
      {
        "id": "rr-usesearchparams-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react-router_rr_usesearchparams_bestpractices"
      }
    ]
  },
  {
    "id": "rr-usenavigate",
    "subjectId": "react-router",
    "title": "Programmatic Navigation: The useNavigate Hook",
    "order": 8,
    "description": "Redirecting users after login or form submission.",
    "subtopics": [
      {
        "id": "rr-usenavigate-basics",
        "title": "What is Programmatic Navigation?",
        "conceptId": "react-router_rr_usenavigate_whatis"
      },
      {
        "id": "rr-usenavigate-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react-router_rr_usenavigate_usage"
      },
      {
        "id": "rr-usenavigate-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react-router_rr_usenavigate_bestpractices"
      }
    ]
  },
  {
    "id": "rr-navigate-redirects",
    "subjectId": "react-router",
    "title": "The <Navigate> Component & Declarative Redirects",
    "order": 9,
    "description": "Redirecting routes directly within JSX.",
    "subtopics": [
      {
        "id": "rr-navigate-redirects-basics",
        "title": "What is The <Navigate> Component & Declarative Redirects?",
        "conceptId": "react-router_rr_navigate_redirects_whatis"
      },
      {
        "id": "rr-navigate-redirects-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react-router_rr_navigate_redirects_usage"
      },
      {
        "id": "rr-navigate-redirects-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react-router_rr_navigate_redirects_bestpractices"
      }
    ]
  },
  {
    "id": "rr-404-catchall",
    "subjectId": "react-router",
    "title": "404 Not Found Pages: Catch-All Routes (*)",
    "order": 10,
    "description": "Handling unknown URLs and showing friendly 404 screens.",
    "subtopics": [
      {
        "id": "rr-404-catchall-basics",
        "title": "What is 404 Not Found Pages?",
        "conceptId": "react-router_rr_404_catchall_whatis"
      },
      {
        "id": "rr-404-catchall-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react-router_rr_404_catchall_usage"
      },
      {
        "id": "rr-404-catchall-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react-router_rr_404_catchall_bestpractices"
      }
    ]
  },
  {
    "id": "rr-protected-routes",
    "subjectId": "react-router",
    "title": "Protected Routes & Authentication Flows",
    "order": 11,
    "description": "Restricting access to private routes based on user auth token.",
    "subtopics": [
      {
        "id": "rr-protected-routes-basics",
        "title": "What is Protected Routes & Authentication Flows?",
        "conceptId": "react-router_rr_protected_routes_whatis"
      },
      {
        "id": "rr-protected-routes-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react-router_rr_protected_routes_usage"
      },
      {
        "id": "rr-protected-routes-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react-router_rr_protected_routes_bestpractices"
      }
    ]
  },
  {
    "id": "rr-data-routers",
    "subjectId": "react-router",
    "title": "Data Routers: createBrowserRouter Setup",
    "order": 12,
    "description": "The modern data routing architecture introduced in React Router 6.4+.",
    "subtopics": [
      {
        "id": "rr-data-routers-basics",
        "title": "What is Data Routers?",
        "conceptId": "react-router_rr_data_routers_whatis"
      },
      {
        "id": "rr-data-routers-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react-router_rr_data_routers_usage"
      },
      {
        "id": "rr-data-routers-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react-router_rr_data_routers_bestpractices"
      }
    ]
  },
  {
    "id": "rr-loader-functions",
    "subjectId": "react-router",
    "title": "Loader Functions: Route Data Fetching",
    "order": 13,
    "description": "Fetching data before components render to eliminate loading spinners.",
    "subtopics": [
      {
        "id": "rr-loader-functions-basics",
        "title": "What is Loader Functions?",
        "conceptId": "react-router_rr_loader_functions_whatis"
      },
      {
        "id": "rr-loader-functions-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react-router_rr_loader_functions_usage"
      },
      {
        "id": "rr-loader-functions-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react-router_rr_loader_functions_bestpractices"
      }
    ]
  },
  {
    "id": "rr-action-functions",
    "subjectId": "react-router",
    "title": "Action Functions: Handling Form Submissions",
    "order": 14,
    "description": "Handling POST, PUT, DELETE form submissions at route level.",
    "subtopics": [
      {
        "id": "rr-action-functions-basics",
        "title": "What is Action Functions?",
        "conceptId": "react-router_rr_action_functions_whatis"
      },
      {
        "id": "rr-action-functions-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react-router_rr_action_functions_usage"
      },
      {
        "id": "rr-action-functions-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react-router_rr_action_functions_bestpractices"
      }
    ]
  },
  {
    "id": "rr-form-component",
    "subjectId": "react-router",
    "title": "The <Form> Component & useNavigation State",
    "order": 15,
    "description": "Declarative forms with pending indicators (navigation.state === \"submitting\").",
    "subtopics": [
      {
        "id": "rr-form-component-basics",
        "title": "What is The <Form> Component & useNavigation State?",
        "conceptId": "react-router_rr_form_component_whatis"
      },
      {
        "id": "rr-form-component-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react-router_rr_form_component_usage"
      },
      {
        "id": "rr-form-component-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react-router_rr_form_component_bestpractices"
      }
    ]
  },
  {
    "id": "rr-errorelement",
    "subjectId": "react-router",
    "title": "Route Error Handling: errorElement & useRouteError",
    "order": 16,
    "description": "Catching 404s and runtime errors without crashing the whole app.",
    "subtopics": [
      {
        "id": "rr-errorelement-basics",
        "title": "What is Route Error Handling?",
        "conceptId": "react-router_rr_errorelement_whatis"
      },
      {
        "id": "rr-errorelement-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react-router_rr_errorelement_usage"
      },
      {
        "id": "rr-errorelement-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react-router_rr_errorelement_bestpractices"
      }
    ]
  },
  {
    "id": "rr-defer-await",
    "subjectId": "react-router",
    "title": "Deferred Data with defer() & <Await> Component",
    "order": 17,
    "description": "Streaming critical data immediately and streaming slow data later.",
    "subtopics": [
      {
        "id": "rr-defer-await-basics",
        "title": "What is Deferred Data with defer() & <Await> Component?",
        "conceptId": "react-router_rr_defer_await_whatis"
      },
      {
        "id": "rr-defer-await-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react-router_rr_defer_await_usage"
      },
      {
        "id": "rr-defer-await-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react-router_rr_defer_await_bestpractices"
      }
    ]
  },
  {
    "id": "rr-scroll-restoration",
    "subjectId": "react-router",
    "title": "The <ScrollRestoration> Component",
    "order": 18,
    "description": "Restoring scroll position accurately across back/forward navigation.",
    "subtopics": [
      {
        "id": "rr-scroll-restoration-basics",
        "title": "What is The <ScrollRestoration> Component?",
        "conceptId": "react-router_rr_scroll_restoration_whatis"
      },
      {
        "id": "rr-scroll-restoration-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react-router_rr_scroll_restoration_usage"
      },
      {
        "id": "rr-scroll-restoration-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react-router_rr_scroll_restoration_bestpractices"
      }
    ]
  },
  {
    "id": "rr-view-transitions",
    "subjectId": "react-router",
    "title": "View Transitions API in React Router",
    "order": 19,
    "description": "Enabling seamless page transitions using the viewTransition prop.",
    "subtopics": [
      {
        "id": "rr-view-transitions-basics",
        "title": "What is View Transitions API in React Router?",
        "conceptId": "react-router_rr_view_transitions_whatis"
      },
      {
        "id": "rr-view-transitions-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react-router_rr_view_transitions_usage"
      },
      {
        "id": "rr-view-transitions-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react-router_rr_view_transitions_bestpractices"
      }
    ]
  },
  {
    "id": "rr-v7-evolution",
    "subjectId": "react-router",
    "title": "React Router v7 & Merging with Remix",
    "order": 20,
    "description": "Framework mode, full-stack capabilities, and migration guide.",
    "subtopics": [
      {
        "id": "rr-v7-evolution-basics",
        "title": "What is React Router v7 & Merging with Remix?",
        "conceptId": "react-router_rr_v7_evolution_whatis"
      },
      {
        "id": "rr-v7-evolution-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "react-router_rr_v7_evolution_usage"
      },
      {
        "id": "rr-v7-evolution-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "react-router_rr_v7_evolution_bestpractices"
      }
    ]
  }
],

  "tailwind": [
  {
    "id": "tw-intro-utility",
    "subjectId": "tailwind",
    "title": "Tailwind CSS Introduction & Utility-First Concept",
    "order": 1,
    "description": "Why utility classes increase speed and prevent CSS bloat.",
    "subtopics": [
      {
        "id": "tw-intro-utility-basics",
        "title": "What is Tailwind CSS Introduction & Utility-First Concept?",
        "conceptId": "tailwind_tw_intro_utility_whatis"
      },
      {
        "id": "tw-intro-utility-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_intro_utility_usage"
      },
      {
        "id": "tw-intro-utility-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_intro_utility_bestpractices"
      }
    ]
  },
  {
    "id": "tw-setup-vite",
    "subjectId": "tailwind",
    "title": "Setting Up Tailwind CSS with Vite",
    "order": 2,
    "description": "Installing packages, postcss setup, and @tailwind directives.",
    "subtopics": [
      {
        "id": "tw-setup-vite-basics",
        "title": "What is Setting Up Tailwind CSS with Vite?",
        "conceptId": "tailwind_tw_setup_vite_whatis"
      },
      {
        "id": "tw-setup-vite-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_setup_vite_usage"
      },
      {
        "id": "tw-setup-vite-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_setup_vite_bestpractices"
      }
    ]
  },
  {
    "id": "tw-config-file",
    "subjectId": "tailwind",
    "title": "tailwind.config.js Explained",
    "order": 3,
    "description": "Content paths, theme extensions, colors, and plugins.",
    "subtopics": [
      {
        "id": "tw-config-file-basics",
        "title": "What is tailwind.config.js Explained?",
        "conceptId": "tailwind_tw_config_file_whatis"
      },
      {
        "id": "tw-config-file-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_config_file_usage"
      },
      {
        "id": "tw-config-file-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_config_file_bestpractices"
      }
    ]
  },
  {
    "id": "tw-spacing-padding-margin",
    "subjectId": "tailwind",
    "title": "Spacing Utilities: Padding (p-), Margin (m-), Space",
    "order": 4,
    "description": "Tailwind spacing scale and directional spacing.",
    "subtopics": [
      {
        "id": "tw-spacing-padding-margin-basics",
        "title": "What is Spacing Utilities?",
        "conceptId": "tailwind_tw_spacing_padding_margin_whatis"
      },
      {
        "id": "tw-spacing-padding-margin-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_spacing_padding_margin_usage"
      },
      {
        "id": "tw-spacing-padding-margin-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_spacing_padding_margin_bestpractices"
      }
    ]
  },
  {
    "id": "tw-typography-text",
    "subjectId": "tailwind",
    "title": "Typography Utilities: Font Size, Weight, Alignment",
    "order": 5,
    "description": "text-sm, text-xl, font-bold, text-center, and tracking.",
    "subtopics": [
      {
        "id": "tw-typography-text-basics",
        "title": "What is Typography Utilities?",
        "conceptId": "tailwind_tw_typography_text_whatis"
      },
      {
        "id": "tw-typography-text-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_typography_text_usage"
      },
      {
        "id": "tw-typography-text-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_typography_text_bestpractices"
      }
    ]
  },
  {
    "id": "tw-colors-palette",
    "subjectId": "tailwind",
    "title": "Color Palette & Custom Color Definitions",
    "order": 6,
    "description": "Default color scales (slate, zinc, red, blue) and theme.colors.",
    "subtopics": [
      {
        "id": "tw-colors-palette-basics",
        "title": "What is Color Palette & Custom Color Definitions?",
        "conceptId": "tailwind_tw_colors_palette_whatis"
      },
      {
        "id": "tw-colors-palette-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_colors_palette_usage"
      },
      {
        "id": "tw-colors-palette-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_colors_palette_bestpractices"
      }
    ]
  },
  {
    "id": "tw-sizing-width-height",
    "subjectId": "tailwind",
    "title": "Sizing Utilities: Width, Height, Min/Max",
    "order": 7,
    "description": "w-full, h-screen, max-w-md, and min-h-screen.",
    "subtopics": [
      {
        "id": "tw-sizing-width-height-basics",
        "title": "What is Sizing Utilities?",
        "conceptId": "tailwind_tw_sizing_width_height_whatis"
      },
      {
        "id": "tw-sizing-width-height-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_sizing_width_height_usage"
      },
      {
        "id": "tw-sizing-width-height-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_sizing_width_height_bestpractices"
      }
    ]
  },
  {
    "id": "tw-flexbox",
    "subjectId": "tailwind",
    "title": "Flexbox in Tailwind: flex, justify-, items-",
    "order": 8,
    "description": "Building responsive flex containers and centering items.",
    "subtopics": [
      {
        "id": "tw-flexbox-basics",
        "title": "What is Flexbox in Tailwind?",
        "conceptId": "tailwind_tw_flexbox_whatis"
      },
      {
        "id": "tw-flexbox-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_flexbox_usage"
      },
      {
        "id": "tw-flexbox-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_flexbox_bestpractices"
      }
    ]
  },
  {
    "id": "tw-grid",
    "subjectId": "tailwind",
    "title": "CSS Grid in Tailwind: grid-cols-, gap-, col-span-",
    "order": 9,
    "description": "Multi-column grid systems and responsive column spans.",
    "subtopics": [
      {
        "id": "tw-grid-basics",
        "title": "What is CSS Grid in Tailwind?",
        "conceptId": "tailwind_tw_grid_whatis"
      },
      {
        "id": "tw-grid-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_grid_usage"
      },
      {
        "id": "tw-grid-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_grid_bestpractices"
      }
    ]
  },
  {
    "id": "tw-box-model-borders",
    "subjectId": "tailwind",
    "title": "Borders & Rounded Corners: rounded-, border-",
    "order": 10,
    "description": "border-2, border-gray-300, and rounded-xl.",
    "subtopics": [
      {
        "id": "tw-box-model-borders-basics",
        "title": "What is Borders & Rounded Corners?",
        "conceptId": "tailwind_tw_box_model_borders_whatis"
      },
      {
        "id": "tw-box-model-borders-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_box_model_borders_usage"
      },
      {
        "id": "tw-box-model-borders-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_box_model_borders_bestpractices"
      }
    ]
  },
  {
    "id": "tw-backgrounds-gradients",
    "subjectId": "tailwind",
    "title": "Backgrounds & Gradients: bg-gradient-to-r",
    "order": 11,
    "description": "Gradient stops (from-, via-, to-) and background opacity.",
    "subtopics": [
      {
        "id": "tw-backgrounds-gradients-basics",
        "title": "What is Backgrounds & Gradients?",
        "conceptId": "tailwind_tw_backgrounds_gradients_whatis"
      },
      {
        "id": "tw-backgrounds-gradients-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_backgrounds_gradients_usage"
      },
      {
        "id": "tw-backgrounds-gradients-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_backgrounds_gradients_bestpractices"
      }
    ]
  },
  {
    "id": "tw-positioning",
    "subjectId": "tailwind",
    "title": "Positioning: relative, absolute, fixed, z-",
    "order": 12,
    "description": "Controlling element placement and stacking order.",
    "subtopics": [
      {
        "id": "tw-positioning-basics",
        "title": "What is Positioning?",
        "conceptId": "tailwind_tw_positioning_whatis"
      },
      {
        "id": "tw-positioning-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_positioning_usage"
      },
      {
        "id": "tw-positioning-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_positioning_bestpractices"
      }
    ]
  },
  {
    "id": "tw-hover-focus-states",
    "subjectId": "tailwind",
    "title": "Interactive States: hover:, focus:, active:, disabled:",
    "order": 13,
    "description": "Styling user states and accessible focus rings.",
    "subtopics": [
      {
        "id": "tw-hover-focus-states-basics",
        "title": "What is Interactive States?",
        "conceptId": "tailwind_tw_hover_focus_states_whatis"
      },
      {
        "id": "tw-hover-focus-states-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_hover_focus_states_usage"
      },
      {
        "id": "tw-hover-focus-states-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_hover_focus_states_bestpractices"
      }
    ]
  },
  {
    "id": "tw-responsive-breakpoints",
    "subjectId": "tailwind",
    "title": "Responsive Breakpoints: sm, md, lg, xl, 2xl",
    "order": 14,
    "description": "Mobile-first responsive design using prefix classes (md:flex).",
    "subtopics": [
      {
        "id": "tw-responsive-breakpoints-basics",
        "title": "What is Responsive Breakpoints?",
        "conceptId": "tailwind_tw_responsive_breakpoints_whatis"
      },
      {
        "id": "tw-responsive-breakpoints-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_responsive_breakpoints_usage"
      },
      {
        "id": "tw-responsive-breakpoints-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_responsive_breakpoints_bestpractices"
      }
    ]
  },
  {
    "id": "tw-dark-mode",
    "subjectId": "tailwind",
    "title": "Dark Mode Strategy: class vs media",
    "order": 15,
    "description": "dark: prefix and toggling dark mode with HTML class.",
    "subtopics": [
      {
        "id": "tw-dark-mode-basics",
        "title": "What is Dark Mode Strategy?",
        "conceptId": "tailwind_tw_dark_mode_whatis"
      },
      {
        "id": "tw-dark-mode-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_dark_mode_usage"
      },
      {
        "id": "tw-dark-mode-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_dark_mode_bestpractices"
      }
    ]
  },
  {
    "id": "tw-transitions-animation",
    "subjectId": "tailwind",
    "title": "Transitions & Animation: transition, duration-, animate-",
    "order": 16,
    "description": "Smooth hover transitions and built-in animations (spin, pulse, bounce).",
    "subtopics": [
      {
        "id": "tw-transitions-animation-basics",
        "title": "What is Transitions & Animation?",
        "conceptId": "tailwind_tw_transitions_animation_whatis"
      },
      {
        "id": "tw-transitions-animation-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_transitions_animation_usage"
      },
      {
        "id": "tw-transitions-animation-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_transitions_animation_bestpractices"
      }
    ]
  },
  {
    "id": "tw-filters-backdrop",
    "subjectId": "tailwind",
    "title": "Filters & Backdrop Blur: backdrop-blur-",
    "order": 17,
    "description": "Glassmorphism and image filter utilities.",
    "subtopics": [
      {
        "id": "tw-filters-backdrop-basics",
        "title": "What is Filters & Backdrop Blur?",
        "conceptId": "tailwind_tw_filters_backdrop_whatis"
      },
      {
        "id": "tw-filters-backdrop-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_filters_backdrop_usage"
      },
      {
        "id": "tw-filters-backdrop-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_filters_backdrop_bestpractices"
      }
    ]
  },
  {
    "id": "tw-transforms",
    "subjectId": "tailwind",
    "title": "Transforms: scale-, rotate-, -translate-",
    "order": 18,
    "description": "Hardware-accelerated CSS transforms using utility classes.",
    "subtopics": [
      {
        "id": "tw-transforms-basics",
        "title": "What is Transforms?",
        "conceptId": "tailwind_tw_transforms_whatis"
      },
      {
        "id": "tw-transforms-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_transforms_usage"
      },
      {
        "id": "tw-transforms-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_transforms_bestpractices"
      }
    ]
  },
  {
    "id": "tw-apply-directive",
    "subjectId": "tailwind",
    "title": "The @apply Directive & Why to Use It Sparingly",
    "order": 19,
    "description": "Extracting repeated utility groups and best practices.",
    "subtopics": [
      {
        "id": "tw-apply-directive-basics",
        "title": "What is The @apply Directive & Why to Use It Sparingly?",
        "conceptId": "tailwind_tw_apply_directive_whatis"
      },
      {
        "id": "tw-apply-directive-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_apply_directive_usage"
      },
      {
        "id": "tw-apply-directive-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_apply_directive_bestpractices"
      }
    ]
  },
  {
    "id": "tw-arbitrary-values",
    "subjectId": "tailwind",
    "title": "Arbitrary Values [value] & The JIT Engine",
    "order": 20,
    "description": "On-demand compilation of custom values (w-[350px]).",
    "subtopics": [
      {
        "id": "tw-arbitrary-values-basics",
        "title": "What is Arbitrary Values [value] & The JIT Engine?",
        "conceptId": "tailwind_tw_arbitrary_values_whatis"
      },
      {
        "id": "tw-arbitrary-values-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_arbitrary_values_usage"
      },
      {
        "id": "tw-arbitrary-values-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_arbitrary_values_bestpractices"
      }
    ]
  },
  {
    "id": "tw-plugins",
    "subjectId": "tailwind",
    "title": "Official Plugins: Forms, Typography, Aspect Ratio",
    "order": 21,
    "description": "Extending Tailwind with @tailwindcss/typography and forms.",
    "subtopics": [
      {
        "id": "tw-plugins-basics",
        "title": "What is Official Plugins?",
        "conceptId": "tailwind_tw_plugins_whatis"
      },
      {
        "id": "tw-plugins-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_plugins_usage"
      },
      {
        "id": "tw-plugins-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_plugins_bestpractices"
      }
    ]
  },
  {
    "id": "tw-custom-fonts",
    "subjectId": "tailwind",
    "title": "Custom Fonts & Theme Extensions",
    "order": 22,
    "description": "Adding Google Fonts to font-family definitions in Tailwind.",
    "subtopics": [
      {
        "id": "tw-custom-fonts-basics",
        "title": "What is Custom Fonts & Theme Extensions?",
        "conceptId": "tailwind_tw_custom_fonts_whatis"
      },
      {
        "id": "tw-custom-fonts-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_custom_fonts_usage"
      },
      {
        "id": "tw-custom-fonts-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_custom_fonts_bestpractices"
      }
    ]
  },
  {
    "id": "tw-tailwind-v4",
    "subjectId": "tailwind",
    "title": "Tailwind CSS v4 Engine & Changes",
    "order": 23,
    "description": "New high-speed Rust-based engine (Oxide) and zero-config CSS.",
    "subtopics": [
      {
        "id": "tw-tailwind-v4-basics",
        "title": "What is Tailwind CSS v4 Engine & Changes?",
        "conceptId": "tailwind_tw_tailwind_v4_whatis"
      },
      {
        "id": "tw-tailwind-v4-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_tailwind_v4_usage"
      },
      {
        "id": "tw-tailwind-v4-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_tailwind_v4_bestpractices"
      }
    ]
  },
  {
    "id": "tw-purging-production",
    "subjectId": "tailwind",
    "title": "Production Optimization & CSS Purging",
    "order": 24,
    "description": "How Tailwind creates ultra-small production CSS bundles (<15KB).",
    "subtopics": [
      {
        "id": "tw-purging-production-basics",
        "title": "What is Production Optimization & CSS Purging?",
        "conceptId": "tailwind_tw_purging_production_whatis"
      },
      {
        "id": "tw-purging-production-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_purging_production_usage"
      },
      {
        "id": "tw-purging-production-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_purging_production_bestpractices"
      }
    ]
  },
  {
    "id": "tw-best-practices",
    "subjectId": "tailwind",
    "title": "Tailwind Best Practices & Component Libraries",
    "order": 25,
    "description": "Organizing classes, using prettier-plugin-tailwindcss, and component libraries.",
    "subtopics": [
      {
        "id": "tw-best-practices-basics",
        "title": "What is Tailwind Best Practices & Component Libraries?",
        "conceptId": "tailwind_tw_best_practices_whatis"
      },
      {
        "id": "tw-best-practices-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "tailwind_tw_best_practices_usage"
      },
      {
        "id": "tw-best-practices-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "tailwind_tw_best_practices_bestpractices"
      }
    ]
  }
],

  "nextjs": [
  {
    "id": "next-intro-why",
    "subjectId": "nextjs",
    "title": "Next.js Introduction: The Full-Stack React Framework",
    "order": 1,
    "description": "Server-side rendering, static site generation, and file-based routing.",
    "subtopics": [
      {
        "id": "next-intro-why-basics",
        "title": "What is Next.js Introduction?",
        "conceptId": "nextjs_next_intro_why_whatis"
      },
      {
        "id": "next-intro-why-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_intro_why_usage"
      },
      {
        "id": "next-intro-why-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_intro_why_bestpractices"
      }
    ]
  },
  {
    "id": "next-app-vs-pages",
    "subjectId": "nextjs",
    "title": "App Router vs Pages Router Architecture",
    "order": 2,
    "description": "Key differences, migration path, and why App Router is the standard.",
    "subtopics": [
      {
        "id": "next-app-vs-pages-basics",
        "title": "What is App Router vs Pages Router Architecture?",
        "conceptId": "nextjs_next_app_vs_pages_whatis"
      },
      {
        "id": "next-app-vs-pages-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_app_vs_pages_usage"
      },
      {
        "id": "next-app-vs-pages-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_app_vs_pages_bestpractices"
      }
    ]
  },
  {
    "id": "next-project-structure",
    "subjectId": "nextjs",
    "title": "Project Structure in Next.js: The app Folder",
    "order": 3,
    "description": "Special files: layout.tsx, page.tsx, loading.tsx, error.tsx.",
    "subtopics": [
      {
        "id": "next-project-structure-basics",
        "title": "What is Project Structure in Next.js?",
        "conceptId": "nextjs_next_project_structure_whatis"
      },
      {
        "id": "next-project-structure-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_project_structure_usage"
      },
      {
        "id": "next-project-structure-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_project_structure_bestpractices"
      }
    ]
  },
  {
    "id": "next-layouts-templates",
    "subjectId": "nextjs",
    "title": "Layouts vs Templates (layout.tsx vs template.tsx)",
    "order": 4,
    "description": "Persistent state in layouts vs remounting on navigation in templates.",
    "subtopics": [
      {
        "id": "next-layouts-templates-basics",
        "title": "What is Layouts vs Templates (layout.tsx vs template.tsx)?",
        "conceptId": "nextjs_next_layouts_templates_whatis"
      },
      {
        "id": "next-layouts-templates-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_layouts_templates_usage"
      },
      {
        "id": "next-layouts-templates-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_layouts_templates_bestpractices"
      }
    ]
  },
  {
    "id": "next-pages-routes",
    "subjectId": "nextjs",
    "title": "Pages & Nested Routes (page.tsx)",
    "order": 5,
    "description": "Folder-based route hierarchy and index pages.",
    "subtopics": [
      {
        "id": "next-pages-routes-basics",
        "title": "What is Pages & Nested Routes (page.tsx)?",
        "conceptId": "nextjs_next_pages_routes_whatis"
      },
      {
        "id": "next-pages-routes-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_pages_routes_usage"
      },
      {
        "id": "next-pages-routes-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_pages_routes_bestpractices"
      }
    ]
  },
  {
    "id": "next-dynamic-routes",
    "subjectId": "nextjs",
    "title": "Dynamic Routes [id] & Catch-All [...slug]",
    "order": 6,
    "description": "Reading params, optional catch-all [[...slug]], and slug matching.",
    "subtopics": [
      {
        "id": "next-dynamic-routes-basics",
        "title": "What is Dynamic Routes [id] & Catch-All [...slug]?",
        "conceptId": "nextjs_next_dynamic_routes_whatis"
      },
      {
        "id": "next-dynamic-routes-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_dynamic_routes_usage"
      },
      {
        "id": "next-dynamic-routes-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_dynamic_routes_bestpractices"
      }
    ]
  },
  {
    "id": "next-linking-navigation",
    "subjectId": "nextjs",
    "title": "Navigation: <Link> Component & useRouter Hook",
    "order": 7,
    "description": "Client-side navigation, prefetching, and programmatic pushes.",
    "subtopics": [
      {
        "id": "next-linking-navigation-basics",
        "title": "What is Navigation?",
        "conceptId": "nextjs_next_linking_navigation_whatis"
      },
      {
        "id": "next-linking-navigation-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_linking_navigation_usage"
      },
      {
        "id": "next-linking-navigation-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_linking_navigation_bestpractices"
      }
    ]
  },
  {
    "id": "next-server-components-default",
    "subjectId": "nextjs",
    "title": "Server Components by Default in App Router",
    "order": 8,
    "description": "Zero bundle size, direct backend access, and security advantages.",
    "subtopics": [
      {
        "id": "next-server-components-default-basics",
        "title": "What is Server Components by Default in App Router?",
        "conceptId": "nextjs_next_server_components_default_whatis"
      },
      {
        "id": "next-server-components-default-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_server_components_default_usage"
      },
      {
        "id": "next-server-components-default-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_server_components_default_bestpractices"
      }
    ]
  },
  {
    "id": "next-client-components",
    "subjectId": "nextjs",
    "title": "Client Components & The \"use client\" Directive",
    "order": 9,
    "description": "When to add \"use client\" for interactivity, hooks, and browser APIs.",
    "subtopics": [
      {
        "id": "next-client-components-basics",
        "title": "What is Client Components & The \"use client\" Directive?",
        "conceptId": "nextjs_next_client_components_whatis"
      },
      {
        "id": "next-client-components-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_client_components_usage"
      },
      {
        "id": "next-client-components-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_client_components_bestpractices"
      }
    ]
  },
  {
    "id": "next-server-client-composition",
    "subjectId": "nextjs",
    "title": "Server & Client Component Composition Patterns",
    "order": 10,
    "description": "Passing Server Components as children to Client Components.",
    "subtopics": [
      {
        "id": "next-server-client-composition-basics",
        "title": "What is Server & Client Component Composition Patterns?",
        "conceptId": "nextjs_next_server_client_composition_whatis"
      },
      {
        "id": "next-server-client-composition-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_server_client_composition_usage"
      },
      {
        "id": "next-server-client-composition-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_server_client_composition_bestpractices"
      }
    ]
  },
  {
    "id": "next-data-fetching-server",
    "subjectId": "nextjs",
    "title": "Data Fetching in Server Components",
    "order": 11,
    "description": "Using async/await directly in component bodies without useEffect.",
    "subtopics": [
      {
        "id": "next-data-fetching-server-basics",
        "title": "What is Data Fetching in Server Components?",
        "conceptId": "nextjs_next_data_fetching_server_whatis"
      },
      {
        "id": "next-data-fetching-server-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_data_fetching_server_usage"
      },
      {
        "id": "next-data-fetching-server-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_data_fetching_server_bestpractices"
      }
    ]
  },
  {
    "id": "next-fetch-caching",
    "subjectId": "nextjs",
    "title": "Extended fetch() & Caching Options",
    "order": 12,
    "description": "force-cache, no-store, and time-based revalidation.",
    "subtopics": [
      {
        "id": "next-fetch-caching-basics",
        "title": "What is Extended fetch() & Caching Options?",
        "conceptId": "nextjs_next_fetch_caching_whatis"
      },
      {
        "id": "next-fetch-caching-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_fetch_caching_usage"
      },
      {
        "id": "next-fetch-caching-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_fetch_caching_bestpractices"
      }
    ]
  },
  {
    "id": "next-isr-revalidation",
    "subjectId": "nextjs",
    "title": "Incremental Static Regeneration (ISR) with revalidate",
    "order": 13,
    "description": "Updating static pages in the background without rebuilding.",
    "subtopics": [
      {
        "id": "next-isr-revalidation-basics",
        "title": "What is Incremental Static Regeneration (ISR) with revalidate?",
        "conceptId": "nextjs_next_isr_revalidation_whatis"
      },
      {
        "id": "next-isr-revalidation-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_isr_revalidation_usage"
      },
      {
        "id": "next-isr-revalidation-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_isr_revalidation_bestpractices"
      }
    ]
  },
  {
    "id": "next-route-handlers",
    "subjectId": "nextjs",
    "title": "Route Handlers (route.ts): Custom API Endpoints",
    "order": 14,
    "description": "Writing GET, POST, PUT, DELETE endpoints in the app directory.",
    "subtopics": [
      {
        "id": "next-route-handlers-basics",
        "title": "What is Route Handlers (route.ts)?",
        "conceptId": "nextjs_next_route_handlers_whatis"
      },
      {
        "id": "next-route-handlers-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_route_handlers_usage"
      },
      {
        "id": "next-route-handlers-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_route_handlers_bestpractices"
      }
    ]
  },
  {
    "id": "next-server-actions",
    "subjectId": "nextjs",
    "title": "Server Actions (\"use server\"): Form Mutations",
    "order": 15,
    "description": "Executing server-side mutations directly from forms without API routes.",
    "subtopics": [
      {
        "id": "next-server-actions-basics",
        "title": "What is Server Actions (\"use server\")?",
        "conceptId": "nextjs_next_server_actions_whatis"
      },
      {
        "id": "next-server-actions-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_server_actions_usage"
      },
      {
        "id": "next-server-actions-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_server_actions_bestpractices"
      }
    ]
  },
  {
    "id": "next-loading-streaming",
    "subjectId": "nextjs",
    "title": "Loading UI & Instant Streaming (loading.tsx)",
    "order": 16,
    "description": "Automatic React Suspense boundaries during route transitions.",
    "subtopics": [
      {
        "id": "next-loading-streaming-basics",
        "title": "What is Loading UI & Instant Streaming (loading.tsx)?",
        "conceptId": "nextjs_next_loading_streaming_whatis"
      },
      {
        "id": "next-loading-streaming-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_loading_streaming_usage"
      },
      {
        "id": "next-loading-streaming-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_loading_streaming_bestpractices"
      }
    ]
  },
  {
    "id": "next-error-handling",
    "subjectId": "nextjs",
    "title": "Error Handling: error.tsx & global-error.tsx",
    "order": 17,
    "description": "Isolating errors to route segments and retry handlers.",
    "subtopics": [
      {
        "id": "next-error-handling-basics",
        "title": "What is Error Handling?",
        "conceptId": "nextjs_next_error_handling_whatis"
      },
      {
        "id": "next-error-handling-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_error_handling_usage"
      },
      {
        "id": "next-error-handling-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_error_handling_bestpractices"
      }
    ]
  },
  {
    "id": "next-not-found",
    "subjectId": "nextjs",
    "title": "Not Found Pages with not-found.tsx & notFound()",
    "order": 18,
    "description": "Rendering custom 404 views and triggering them programmatically.",
    "subtopics": [
      {
        "id": "next-not-found-basics",
        "title": "What is Not Found Pages with not-found.tsx & notFound()?",
        "conceptId": "nextjs_next_not_found_whatis"
      },
      {
        "id": "next-not-found-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_not_found_usage"
      },
      {
        "id": "next-not-found-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_not_found_bestpractices"
      }
    ]
  },
  {
    "id": "next-route-groups",
    "subjectId": "nextjs",
    "title": "Route Groups (folder): Organizing Without URL Impact",
    "order": 19,
    "description": "Organizing routes and sharing layouts across specific subsections.",
    "subtopics": [
      {
        "id": "next-route-groups-basics",
        "title": "What is Route Groups (folder)?",
        "conceptId": "nextjs_next_route_groups_whatis"
      },
      {
        "id": "next-route-groups-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_route_groups_usage"
      },
      {
        "id": "next-route-groups-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_route_groups_bestpractices"
      }
    ]
  },
  {
    "id": "next-parallel-routes",
    "subjectId": "nextjs",
    "title": "Parallel Routes (@slot): Multi-Pane Dashboards",
    "order": 20,
    "description": "Rendering multiple pages simultaneously in the same layout.",
    "subtopics": [
      {
        "id": "next-parallel-routes-basics",
        "title": "What is Parallel Routes (@slot)?",
        "conceptId": "nextjs_next_parallel_routes_whatis"
      },
      {
        "id": "next-parallel-routes-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_parallel_routes_usage"
      },
      {
        "id": "next-parallel-routes-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_parallel_routes_bestpractices"
      }
    ]
  },
  {
    "id": "next-intercepting-routes",
    "subjectId": "nextjs",
    "title": "Intercepting Routes (..): Modals with Shareable URLs",
    "order": 21,
    "description": "Displaying modals on client navigation while preserving full-page direct load.",
    "subtopics": [
      {
        "id": "next-intercepting-routes-basics",
        "title": "What is Intercepting Routes (..)?",
        "conceptId": "nextjs_next_intercepting_routes_whatis"
      },
      {
        "id": "next-intercepting-routes-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_intercepting_routes_usage"
      },
      {
        "id": "next-intercepting-routes-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_intercepting_routes_bestpractices"
      }
    ]
  },
  {
    "id": "next-middleware",
    "subjectId": "nextjs",
    "title": "Next.js Middleware (middleware.ts)",
    "order": 22,
    "description": "Running edge logic before requests complete: auth, redirects, geo-blocking.",
    "subtopics": [
      {
        "id": "next-middleware-basics",
        "title": "What is Next.js Middleware (middleware.ts)?",
        "conceptId": "nextjs_next_middleware_whatis"
      },
      {
        "id": "next-middleware-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_middleware_usage"
      },
      {
        "id": "next-middleware-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_middleware_bestpractices"
      }
    ]
  },
  {
    "id": "next-image-optimization",
    "subjectId": "nextjs",
    "title": "Image Optimization with the <Image> Component",
    "order": 23,
    "description": "Automatic WebP conversion, responsive sizes, and preventing layout shift.",
    "subtopics": [
      {
        "id": "next-image-optimization-basics",
        "title": "What is Image Optimization with the <Image> Component?",
        "conceptId": "nextjs_next_image_optimization_whatis"
      },
      {
        "id": "next-image-optimization-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_image_optimization_usage"
      },
      {
        "id": "next-image-optimization-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_image_optimization_bestpractices"
      }
    ]
  },
  {
    "id": "next-font-optimization",
    "subjectId": "nextjs",
    "title": "Font Optimization with next/font",
    "order": 24,
    "description": "Zero layout shift self-hosted Google Fonts and local font files.",
    "subtopics": [
      {
        "id": "next-font-optimization-basics",
        "title": "What is Font Optimization with next/font?",
        "conceptId": "nextjs_next_font_optimization_whatis"
      },
      {
        "id": "next-font-optimization-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_font_optimization_usage"
      },
      {
        "id": "next-font-optimization-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_font_optimization_bestpractices"
      }
    ]
  },
  {
    "id": "next-metadata-seo",
    "subjectId": "nextjs",
    "title": "Metadata & Dynamic SEO (generateMetadata)",
    "order": 25,
    "description": "Title, description, OpenGraph, and Twitter cards per route.",
    "subtopics": [
      {
        "id": "next-metadata-seo-basics",
        "title": "What is Metadata & Dynamic SEO (generateMetadata)?",
        "conceptId": "nextjs_next_metadata_seo_whatis"
      },
      {
        "id": "next-metadata-seo-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_metadata_seo_usage"
      },
      {
        "id": "next-metadata-seo-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_metadata_seo_bestpractices"
      }
    ]
  },
  {
    "id": "next-generate-static-params",
    "subjectId": "nextjs",
    "title": "Static Site Generation with generateStaticParams",
    "order": 26,
    "description": "Pre-rendering dynamic routes at build time for speed.",
    "subtopics": [
      {
        "id": "next-generate-static-params-basics",
        "title": "What is Static Site Generation with generateStaticParams?",
        "conceptId": "nextjs_next_generate_static_params_whatis"
      },
      {
        "id": "next-generate-static-params-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_generate_static_params_usage"
      },
      {
        "id": "next-generate-static-params-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_generate_static_params_bestpractices"
      }
    ]
  },
  {
    "id": "next-auth-patterns",
    "subjectId": "nextjs",
    "title": "Authentication Patterns in Next.js (Auth.js / NextAuth)",
    "order": 27,
    "description": "Session management, JWT tokens, and protecting server routes.",
    "subtopics": [
      {
        "id": "next-auth-patterns-basics",
        "title": "What is Authentication Patterns in Next.js (Auth.js / NextAuth)?",
        "conceptId": "nextjs_next_auth_patterns_whatis"
      },
      {
        "id": "next-auth-patterns-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_auth_patterns_usage"
      },
      {
        "id": "next-auth-patterns-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_auth_patterns_bestpractices"
      }
    ]
  },
  {
    "id": "next-env-variables",
    "subjectId": "nextjs",
    "title": "Environment Variables: Server vs NEXT_PUBLIC_",
    "order": 28,
    "description": "Keeping API keys private and exposing public variables safely.",
    "subtopics": [
      {
        "id": "next-env-variables-basics",
        "title": "What is Environment Variables?",
        "conceptId": "nextjs_next_env_variables_whatis"
      },
      {
        "id": "next-env-variables-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_env_variables_usage"
      },
      {
        "id": "next-env-variables-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_env_variables_bestpractices"
      }
    ]
  },
  {
    "id": "next-i18n",
    "subjectId": "nextjs",
    "title": "Internationalization (i18n) in App Router",
    "order": 29,
    "description": "Locale detection, routing prefixes, and translated dictionary files.",
    "subtopics": [
      {
        "id": "next-i18n-basics",
        "title": "What is Internationalization (i18n) in App Router?",
        "conceptId": "nextjs_next_i18n_whatis"
      },
      {
        "id": "next-i18n-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_i18n_usage"
      },
      {
        "id": "next-i18n-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_i18n_bestpractices"
      }
    ]
  },
  {
    "id": "next-security-headers",
    "subjectId": "nextjs",
    "title": "Security Headers & Content Security Policy (CSP)",
    "order": 30,
    "description": "Configuring headers in next.config.js to prevent XSS and clickjacking.",
    "subtopics": [
      {
        "id": "next-security-headers-basics",
        "title": "What is Security Headers & Content Security Policy (CSP)?",
        "conceptId": "nextjs_next_security_headers_whatis"
      },
      {
        "id": "next-security-headers-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_security_headers_usage"
      },
      {
        "id": "next-security-headers-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_security_headers_bestpractices"
      }
    ]
  },
  {
    "id": "next-docker-standalone",
    "subjectId": "nextjs",
    "title": "Standalone Output & Docker Deployment",
    "order": 31,
    "description": "output: \"standalone\" for lightweight production container images.",
    "subtopics": [
      {
        "id": "next-docker-standalone-basics",
        "title": "What is Standalone Output & Docker Deployment?",
        "conceptId": "nextjs_next_docker_standalone_whatis"
      },
      {
        "id": "next-docker-standalone-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_docker_standalone_usage"
      },
      {
        "id": "next-docker-standalone-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_docker_standalone_bestpractices"
      }
    ]
  },
  {
    "id": "next-optimizing-cwv",
    "subjectId": "nextjs",
    "title": "Optimizing Core Web Vitals in Next.js",
    "order": 32,
    "description": "LCP, INP, and CLS tuning with built-in Next.js analytics.",
    "subtopics": [
      {
        "id": "next-optimizing-cwv-basics",
        "title": "What is Optimizing Core Web Vitals in Next.js?",
        "conceptId": "nextjs_next_optimizing_cwv_whatis"
      },
      {
        "id": "next-optimizing-cwv-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_optimizing_cwv_usage"
      },
      {
        "id": "next-optimizing-cwv-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_optimizing_cwv_bestpractices"
      }
    ]
  },
  {
    "id": "next-v15-features",
    "subjectId": "nextjs",
    "title": "Next.js 15 New Features & Async Request APIs",
    "order": 33,
    "description": "Async cookies(), headers(), params, and un-cached fetch by default.",
    "subtopics": [
      {
        "id": "next-v15-features-basics",
        "title": "What is Next.js 15 New Features & Async Request APIs?",
        "conceptId": "nextjs_next_v15_features_whatis"
      },
      {
        "id": "next-v15-features-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_v15_features_usage"
      },
      {
        "id": "next-v15-features-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_v15_features_bestpractices"
      }
    ]
  },
  {
    "id": "next-edge-runtime",
    "subjectId": "nextjs",
    "title": "Edge Runtime vs Node.js Runtime",
    "order": 34,
    "description": "Lightweight V8 isolates at CDN edge vs full Node.js server capabilities.",
    "subtopics": [
      {
        "id": "next-edge-runtime-basics",
        "title": "What is Edge Runtime vs Node.js Runtime?",
        "conceptId": "nextjs_next_edge_runtime_whatis"
      },
      {
        "id": "next-edge-runtime-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_edge_runtime_usage"
      },
      {
        "id": "next-edge-runtime-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_edge_runtime_bestpractices"
      }
    ]
  },
  {
    "id": "next-enterprise-architecture",
    "subjectId": "nextjs",
    "title": "Enterprise Next.js Architecture",
    "order": 35,
    "description": "Structuring large-scale production codebases with clean architectural boundaries.",
    "subtopics": [
      {
        "id": "next-enterprise-architecture-basics",
        "title": "What is Enterprise Next.js Architecture?",
        "conceptId": "nextjs_next_enterprise_architecture_whatis"
      },
      {
        "id": "next-enterprise-architecture-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "nextjs_next_enterprise_architecture_usage"
      },
      {
        "id": "next-enterprise-architecture-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "nextjs_next_enterprise_architecture_bestpractices"
      }
    ]
  }
],

  "microfrontends": [
  {
    "id": "mfe-intro-motivations",
    "subjectId": "microfrontends",
    "title": "Micro-Frontends Introduction & Business Motivations",
    "order": 1,
    "description": "Why organizations split monolithic frontends across independent teams.",
    "subtopics": [
      {
        "id": "mfe-intro-motivations-basics",
        "title": "What is Micro-Frontends Introduction & Business Motivations?",
        "conceptId": "microfrontends_mfe_intro_motivations_whatis"
      },
      {
        "id": "mfe-intro-motivations-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "microfrontends_mfe_intro_motivations_usage"
      },
      {
        "id": "mfe-intro-motivations-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "microfrontends_mfe_intro_motivations_bestpractices"
      }
    ]
  },
  {
    "id": "mfe-architectural-approaches",
    "subjectId": "microfrontends",
    "title": "Architectural Approaches: Iframes vs Web Components vs Bundlers",
    "order": 2,
    "description": "Comparing runtime integration, build-time integration, and iframes.",
    "subtopics": [
      {
        "id": "mfe-architectural-approaches-basics",
        "title": "What is Architectural Approaches?",
        "conceptId": "microfrontends_mfe_architectural_approaches_whatis"
      },
      {
        "id": "mfe-architectural-approaches-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "microfrontends_mfe_architectural_approaches_usage"
      },
      {
        "id": "mfe-architectural-approaches-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "microfrontends_mfe_architectural_approaches_bestpractices"
      }
    ]
  },
  {
    "id": "mfe-webpack-module-federation",
    "subjectId": "microfrontends",
    "title": "Webpack 5 Module Federation Fundamentals",
    "order": 3,
    "description": "Sharing compiled code across independent builds dynamically at runtime.",
    "subtopics": [
      {
        "id": "mfe-webpack-module-federation-basics",
        "title": "What is Webpack 5 Module Federation Fundamentals?",
        "conceptId": "microfrontends_mfe_webpack_module_federation_whatis"
      },
      {
        "id": "mfe-webpack-module-federation-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "microfrontends_mfe_webpack_module_federation_usage"
      },
      {
        "id": "mfe-webpack-module-federation-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "microfrontends_mfe_webpack_module_federation_bestpractices"
      }
    ]
  },
  {
    "id": "mfe-host-vs-remote",
    "subjectId": "microfrontends",
    "title": "Host Applications (Consumers) vs Remote Applications (Providers)",
    "order": 4,
    "description": "Configuring remotes, exposes, and remotes entry points.",
    "subtopics": [
      {
        "id": "mfe-host-vs-remote-basics",
        "title": "What is Host Applications (Consumers) vs Remote Applications (Providers)?",
        "conceptId": "microfrontends_mfe_host_vs_remote_whatis"
      },
      {
        "id": "mfe-host-vs-remote-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "microfrontends_mfe_host_vs_remote_usage"
      },
      {
        "id": "mfe-host-vs-remote-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "microfrontends_mfe_host_vs_remote_bestpractices"
      }
    ]
  },
  {
    "id": "mfe-shared-dependencies",
    "subjectId": "microfrontends",
    "title": "Shared Dependencies & Singleton Packages",
    "order": 5,
    "description": "Preventing duplicate downloads of React and Redux via shared configuration.",
    "subtopics": [
      {
        "id": "mfe-shared-dependencies-basics",
        "title": "What is Shared Dependencies & Singleton Packages?",
        "conceptId": "microfrontends_mfe_shared_dependencies_whatis"
      },
      {
        "id": "mfe-shared-dependencies-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "microfrontends_mfe_shared_dependencies_usage"
      },
      {
        "id": "mfe-shared-dependencies-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "microfrontends_mfe_shared_dependencies_bestpractices"
      }
    ]
  },
  {
    "id": "mfe-version-skew",
    "subjectId": "microfrontends",
    "title": "Version Skew & Semver Resolution in Federation",
    "order": 6,
    "description": "Handling conflicting package versions across micro-frontend apps.",
    "subtopics": [
      {
        "id": "mfe-version-skew-basics",
        "title": "What is Version Skew & Semver Resolution in Federation?",
        "conceptId": "microfrontends_mfe_version_skew_whatis"
      },
      {
        "id": "mfe-version-skew-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "microfrontends_mfe_version_skew_usage"
      },
      {
        "id": "mfe-version-skew-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "microfrontends_mfe_version_skew_bestpractices"
      }
    ]
  },
  {
    "id": "mfe-single-spa",
    "subjectId": "microfrontends",
    "title": "The single-spa Framework Architecture",
    "order": 7,
    "description": "Lifecycle methods (bootstrap, mount, unmount) for multi-framework routing.",
    "subtopics": [
      {
        "id": "mfe-single-spa-basics",
        "title": "What is The single-spa Framework Architecture?",
        "conceptId": "microfrontends_mfe_single_spa_whatis"
      },
      {
        "id": "mfe-single-spa-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "microfrontends_mfe_single_spa_usage"
      },
      {
        "id": "mfe-single-spa-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "microfrontends_mfe_single_spa_bestpractices"
      }
    ]
  },
  {
    "id": "mfe-dynamic-remotes",
    "subjectId": "microfrontends",
    "title": "Dynamic Remote Loading at Runtime",
    "order": 8,
    "description": "Loading remote micro-frontends from runtime URLs or service registries.",
    "subtopics": [
      {
        "id": "mfe-dynamic-remotes-basics",
        "title": "What is Dynamic Remote Loading at Runtime?",
        "conceptId": "microfrontends_mfe_dynamic_remotes_whatis"
      },
      {
        "id": "mfe-dynamic-remotes-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "microfrontends_mfe_dynamic_remotes_usage"
      },
      {
        "id": "mfe-dynamic-remotes-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "microfrontends_mfe_dynamic_remotes_bestpractices"
      }
    ]
  },
  {
    "id": "mfe-routing-coordination",
    "subjectId": "microfrontends",
    "title": "Routing Coordination Across Micro-Frontends",
    "order": 9,
    "description": "Synchronizing browser history and routing boundaries between apps.",
    "subtopics": [
      {
        "id": "mfe-routing-coordination-basics",
        "title": "What is Routing Coordination Across Micro-Frontends?",
        "conceptId": "microfrontends_mfe_routing_coordination_whatis"
      },
      {
        "id": "mfe-routing-coordination-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "microfrontends_mfe_routing_coordination_usage"
      },
      {
        "id": "mfe-routing-coordination-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "microfrontends_mfe_routing_coordination_bestpractices"
      }
    ]
  },
  {
    "id": "mfe-inter-app-communication",
    "subjectId": "microfrontends",
    "title": "Inter-App Communication: Custom Events & Event Bus",
    "order": 10,
    "description": "Loosely coupled messaging between micro-frontends without tight coupling.",
    "subtopics": [
      {
        "id": "mfe-inter-app-communication-basics",
        "title": "What is Inter-App Communication?",
        "conceptId": "microfrontends_mfe_inter_app_communication_whatis"
      },
      {
        "id": "mfe-inter-app-communication-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "microfrontends_mfe_inter_app_communication_usage"
      },
      {
        "id": "mfe-inter-app-communication-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "microfrontends_mfe_inter_app_communication_bestpractices"
      }
    ]
  },
  {
    "id": "mfe-state-sharing-boundaries",
    "subjectId": "microfrontends",
    "title": "State Sharing Dilemma: Local vs Global State",
    "order": 11,
    "description": "Why micro-frontends should avoid monolithic shared stores.",
    "subtopics": [
      {
        "id": "mfe-state-sharing-boundaries-basics",
        "title": "What is State Sharing Dilemma?",
        "conceptId": "microfrontends_mfe_state_sharing_boundaries_whatis"
      },
      {
        "id": "mfe-state-sharing-boundaries-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "microfrontends_mfe_state_sharing_boundaries_usage"
      },
      {
        "id": "mfe-state-sharing-boundaries-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "microfrontends_mfe_state_sharing_boundaries_bestpractices"
      }
    ]
  },
  {
    "id": "mfe-css-isolation",
    "subjectId": "microfrontends",
    "title": "CSS Isolation: Shadow DOM & Scoped Styling",
    "order": 12,
    "description": "Preventing CSS leaks across apps with Shadow DOM, CSS Modules, or BEM.",
    "subtopics": [
      {
        "id": "mfe-css-isolation-basics",
        "title": "What is CSS Isolation?",
        "conceptId": "microfrontends_mfe_css_isolation_whatis"
      },
      {
        "id": "mfe-css-isolation-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "microfrontends_mfe_css_isolation_usage"
      },
      {
        "id": "mfe-css-isolation-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "microfrontends_mfe_css_isolation_bestpractices"
      }
    ]
  },
  {
    "id": "mfe-cicd-deployment",
    "subjectId": "microfrontends",
    "title": "Independent CI/CD Pipelines & Deployments",
    "order": 13,
    "description": "Deploying individual micro-frontends without redeploying the host.",
    "subtopics": [
      {
        "id": "mfe-cicd-deployment-basics",
        "title": "What is Independent CI/CD Pipelines & Deployments?",
        "conceptId": "microfrontends_mfe_cicd_deployment_whatis"
      },
      {
        "id": "mfe-cicd-deployment-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "microfrontends_mfe_cicd_deployment_usage"
      },
      {
        "id": "mfe-cicd-deployment-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "microfrontends_mfe_cicd_deployment_bestpractices"
      }
    ]
  },
  {
    "id": "mfe-asset-caching",
    "subjectId": "microfrontends",
    "title": "Asset Caching & Performance Optimization",
    "order": 14,
    "description": "Cache headers for remoteEntry.js and preloading vital remote chunks.",
    "subtopics": [
      {
        "id": "mfe-asset-caching-basics",
        "title": "What is Asset Caching & Performance Optimization?",
        "conceptId": "microfrontends_mfe_asset_caching_whatis"
      },
      {
        "id": "mfe-asset-caching-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "microfrontends_mfe_asset_caching_usage"
      },
      {
        "id": "mfe-asset-caching-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "microfrontends_mfe_asset_caching_bestpractices"
      }
    ]
  },
  {
    "id": "mfe-fallback-resilience",
    "subjectId": "microfrontends",
    "title": "Fallback Mechanisms & Error Resilience",
    "order": 15,
    "description": "Handling remote downtime gracefully with React Error Boundaries.",
    "subtopics": [
      {
        "id": "mfe-fallback-resilience-basics",
        "title": "What is Fallback Mechanisms & Error Resilience?",
        "conceptId": "microfrontends_mfe_fallback_resilience_whatis"
      },
      {
        "id": "mfe-fallback-resilience-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "microfrontends_mfe_fallback_resilience_usage"
      },
      {
        "id": "mfe-fallback-resilience-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "microfrontends_mfe_fallback_resilience_bestpractices"
      }
    ]
  },
  {
    "id": "mfe-testing-strategies",
    "subjectId": "microfrontends",
    "title": "Testing Strategies for Micro-Frontends",
    "order": 16,
    "description": "Contract testing, isolated unit tests, and cross-app integration tests.",
    "subtopics": [
      {
        "id": "mfe-testing-strategies-basics",
        "title": "What is Testing Strategies for Micro-Frontends?",
        "conceptId": "microfrontends_mfe_testing_strategies_whatis"
      },
      {
        "id": "mfe-testing-strategies-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "microfrontends_mfe_testing_strategies_usage"
      },
      {
        "id": "mfe-testing-strategies-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "microfrontends_mfe_testing_strategies_bestpractices"
      }
    ]
  },
  {
    "id": "mfe-security-isolation",
    "subjectId": "microfrontends",
    "title": "Security & Cross-Site Scripting (XSS) Isolation",
    "order": 17,
    "description": "Permissions, Content Security Policies, and iframe sandboxing.",
    "subtopics": [
      {
        "id": "mfe-security-isolation-basics",
        "title": "What is Security & Cross-Site Scripting (XSS) Isolation?",
        "conceptId": "microfrontends_mfe_security_isolation_whatis"
      },
      {
        "id": "mfe-security-isolation-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "microfrontends_mfe_security_isolation_usage"
      },
      {
        "id": "mfe-security-isolation-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "microfrontends_mfe_security_isolation_bestpractices"
      }
    ]
  },
  {
    "id": "mfe-enterprise-governance",
    "subjectId": "microfrontends",
    "title": "Enterprise Governance & Team Organization",
    "order": 18,
    "description": "Conway's Law, design systems, and cross-team interface contracts.",
    "subtopics": [
      {
        "id": "mfe-enterprise-governance-basics",
        "title": "What is Enterprise Governance & Team Organization?",
        "conceptId": "microfrontends_mfe_enterprise_governance_whatis"
      },
      {
        "id": "mfe-enterprise-governance-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "microfrontends_mfe_enterprise_governance_usage"
      },
      {
        "id": "mfe-enterprise-governance-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "microfrontends_mfe_enterprise_governance_bestpractices"
      }
    ]
  }
],

  "restful-apis": [
  {
    "id": "rest-principles-constraints",
    "subjectId": "restful-apis",
    "title": "REST Architectural Principles & Constraints",
    "order": 1,
    "description": "Client-server separation, statelessness, cacheability, and uniform interface.",
    "subtopics": [
      {
        "id": "rest-principles-constraints-basics",
        "title": "What is REST Architectural Principles & Constraints?",
        "conceptId": "restful-apis_rest_principles_constraints_whatis"
      },
      {
        "id": "rest-principles-constraints-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_principles_constraints_usage"
      },
      {
        "id": "rest-principles-constraints-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_principles_constraints_bestpractices"
      }
    ]
  },
  {
    "id": "rest-http-methods",
    "subjectId": "restful-apis",
    "title": "HTTP Request Methods: GET, POST, PUT, PATCH, DELETE",
    "order": 2,
    "description": "Standard semantic purposes of each HTTP request method.",
    "subtopics": [
      {
        "id": "rest-http-methods-basics",
        "title": "What is HTTP Request Methods?",
        "conceptId": "restful-apis_rest_http_methods_whatis"
      },
      {
        "id": "rest-http-methods-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_http_methods_usage"
      },
      {
        "id": "rest-http-methods-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_http_methods_bestpractices"
      }
    ]
  },
  {
    "id": "rest-idempotency",
    "subjectId": "restful-apis",
    "title": "Idempotency & Safety in REST APIs",
    "order": 3,
    "description": "Which methods are safe, which are idempotent, and why it matters for retries.",
    "subtopics": [
      {
        "id": "rest-idempotency-basics",
        "title": "What is Idempotency & Safety in REST APIs?",
        "conceptId": "restful-apis_rest_idempotency_whatis"
      },
      {
        "id": "rest-idempotency-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_idempotency_usage"
      },
      {
        "id": "rest-idempotency-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_idempotency_bestpractices"
      }
    ]
  },
  {
    "id": "rest-put-vs-patch",
    "subjectId": "restful-apis",
    "title": "PUT vs PATCH: Full Replacement vs Partial Update",
    "order": 4,
    "description": "Deep dive into payload expectations and idempotent state updates.",
    "subtopics": [
      {
        "id": "rest-put-vs-patch-basics",
        "title": "What is PUT vs PATCH?",
        "conceptId": "restful-apis_rest_put_vs_patch_whatis"
      },
      {
        "id": "rest-put-vs-patch-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_put_vs_patch_usage"
      },
      {
        "id": "rest-put-vs-patch-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_put_vs_patch_bestpractices"
      }
    ]
  },
  {
    "id": "rest-url-design",
    "subjectId": "restful-apis",
    "title": "URL Design & Resource Naming Conventions",
    "order": 5,
    "description": "Plural nouns (/users), lowercase, hyphens, and avoiding verbs in URLs.",
    "subtopics": [
      {
        "id": "rest-url-design-basics",
        "title": "What is URL Design & Resource Naming Conventions?",
        "conceptId": "restful-apis_rest_url_design_whatis"
      },
      {
        "id": "rest-url-design-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_url_design_usage"
      },
      {
        "id": "rest-url-design-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_url_design_bestpractices"
      }
    ]
  },
  {
    "id": "rest-resource-hierarchies",
    "subjectId": "restful-apis",
    "title": "Nested Resource Hierarchies (/users/123/orders)",
    "order": 6,
    "description": "When to nest URLs and when to keep endpoints flat.",
    "subtopics": [
      {
        "id": "rest-resource-hierarchies-basics",
        "title": "What is Nested Resource Hierarchies (/users/123/orders)?",
        "conceptId": "restful-apis_rest_resource_hierarchies_whatis"
      },
      {
        "id": "rest-resource-hierarchies-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_resource_hierarchies_usage"
      },
      {
        "id": "rest-resource-hierarchies-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_resource_hierarchies_bestpractices"
      }
    ]
  },
  {
    "id": "rest-status-codes-overview",
    "subjectId": "restful-apis",
    "title": "HTTP Status Code Taxonomy",
    "order": 7,
    "description": "1xx Informational, 2xx Success, 3xx Redirection, 4xx Client Error, 5xx Server Error.",
    "subtopics": [
      {
        "id": "rest-status-codes-overview-basics",
        "title": "What is HTTP Status Code Taxonomy?",
        "conceptId": "restful-apis_rest_status_codes_overview_whatis"
      },
      {
        "id": "rest-status-codes-overview-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_status_codes_overview_usage"
      },
      {
        "id": "rest-status-codes-overview-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_status_codes_overview_bestpractices"
      }
    ]
  },
  {
    "id": "rest-status-2xx-success",
    "subjectId": "restful-apis",
    "title": "2xx Success Codes: 200 OK, 201 Created, 204 No Content",
    "order": 8,
    "description": "Choosing the correct success status code for API responses.",
    "subtopics": [
      {
        "id": "rest-status-2xx-success-basics",
        "title": "What is 2xx Success Codes?",
        "conceptId": "restful-apis_rest_status_2xx_success_whatis"
      },
      {
        "id": "rest-status-2xx-success-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_status_2xx_success_usage"
      },
      {
        "id": "rest-status-2xx-success-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_status_2xx_success_bestpractices"
      }
    ]
  },
  {
    "id": "rest-status-3xx-redirection",
    "subjectId": "restful-apis",
    "title": "3xx Redirection Codes: 301, 302 & 304 Not Modified",
    "order": 9,
    "description": "Permanent redirects, temporary redirects, and conditional caching.",
    "subtopics": [
      {
        "id": "rest-status-3xx-redirection-basics",
        "title": "What is 3xx Redirection Codes?",
        "conceptId": "restful-apis_rest_status_3xx_redirection_whatis"
      },
      {
        "id": "rest-status-3xx-redirection-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_status_3xx_redirection_usage"
      },
      {
        "id": "rest-status-3xx-redirection-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_status_3xx_redirection_bestpractices"
      }
    ]
  },
  {
    "id": "rest-status-4xx-client-errors",
    "subjectId": "restful-apis",
    "title": "4xx Client Errors: 400, 401, 403, 404, 409, 422",
    "order": 10,
    "description": "Bad requests, authentication vs authorization, not found, and conflicts.",
    "subtopics": [
      {
        "id": "rest-status-4xx-client-errors-basics",
        "title": "What is 4xx Client Errors?",
        "conceptId": "restful-apis_rest_status_4xx_client_errors_whatis"
      },
      {
        "id": "rest-status-4xx-client-errors-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_status_4xx_client_errors_usage"
      },
      {
        "id": "rest-status-4xx-client-errors-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_status_4xx_client_errors_bestpractices"
      }
    ]
  },
  {
    "id": "rest-status-5xx-server-errors",
    "subjectId": "restful-apis",
    "title": "5xx Server Errors: 500, 502, 503, 504",
    "order": 11,
    "description": "Internal errors, bad gateways, service unavailable, and gateway timeouts.",
    "subtopics": [
      {
        "id": "rest-status-5xx-server-errors-basics",
        "title": "What is 5xx Server Errors?",
        "conceptId": "restful-apis_rest_status_5xx_server_errors_whatis"
      },
      {
        "id": "rest-status-5xx-server-errors-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_status_5xx_server_errors_usage"
      },
      {
        "id": "rest-status-5xx-server-errors-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_status_5xx_server_errors_bestpractices"
      }
    ]
  },
  {
    "id": "rest-auth-401-vs-403",
    "subjectId": "restful-apis",
    "title": "Authentication vs Authorization (401 vs 403)",
    "order": 12,
    "description": "Who you are (401 Unauthorized) vs What you can do (403 Forbidden).",
    "subtopics": [
      {
        "id": "rest-auth-401-vs-403-basics",
        "title": "What is Authentication vs Authorization (401 vs 403)?",
        "conceptId": "restful-apis_rest_auth_401_vs_403_whatis"
      },
      {
        "id": "rest-auth-401-vs-403-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_auth_401_vs_403_usage"
      },
      {
        "id": "rest-auth-401-vs-403-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_auth_401_vs_403_bestpractices"
      }
    ]
  },
  {
    "id": "rest-query-filtering-sorting",
    "subjectId": "restful-apis",
    "title": "Query Parameters: Filtering, Searching & Sorting",
    "order": 13,
    "description": "?status=active&sort=-created_at&search=john conventions.",
    "subtopics": [
      {
        "id": "rest-query-filtering-sorting-basics",
        "title": "What is Query Parameters?",
        "conceptId": "restful-apis_rest_query_filtering_sorting_whatis"
      },
      {
        "id": "rest-query-filtering-sorting-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_query_filtering_sorting_usage"
      },
      {
        "id": "rest-query-filtering-sorting-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_query_filtering_sorting_bestpractices"
      }
    ]
  },
  {
    "id": "rest-pagination-offset",
    "subjectId": "restful-apis",
    "title": "Offset/Limit Pagination (?page=1&limit=20)",
    "order": 14,
    "description": "Simple pagination mechanics, SQL OFFSET performance cost.",
    "subtopics": [
      {
        "id": "rest-pagination-offset-basics",
        "title": "What is Offset/Limit Pagination (?page=1&limit=20)?",
        "conceptId": "restful-apis_rest_pagination_offset_whatis"
      },
      {
        "id": "rest-pagination-offset-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_pagination_offset_usage"
      },
      {
        "id": "rest-pagination-offset-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_pagination_offset_bestpractices"
      }
    ]
  },
  {
    "id": "rest-pagination-cursor",
    "subjectId": "restful-apis",
    "title": "Cursor-Based (Keyset) Pagination",
    "order": 15,
    "description": "High-performance pagination for large datasets using cursor tokens.",
    "subtopics": [
      {
        "id": "rest-pagination-cursor-basics",
        "title": "What is Cursor-Based (Keyset) Pagination?",
        "conceptId": "restful-apis_rest_pagination_cursor_whatis"
      },
      {
        "id": "rest-pagination-cursor-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_pagination_cursor_usage"
      },
      {
        "id": "rest-pagination-cursor-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_pagination_cursor_bestpractices"
      }
    ]
  },
  {
    "id": "rest-payload-standards",
    "subjectId": "restful-apis",
    "title": "Request & Response Payloads (JSON & Headers)",
    "order": 16,
    "description": "Content-Type, Accept headers, and consistent JSON envelope formats.",
    "subtopics": [
      {
        "id": "rest-payload-standards-basics",
        "title": "What is Request & Response Payloads (JSON & Headers)?",
        "conceptId": "restful-apis_rest_payload_standards_whatis"
      },
      {
        "id": "rest-payload-standards-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_payload_standards_usage"
      },
      {
        "id": "rest-payload-standards-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_payload_standards_bestpractices"
      }
    ]
  },
  {
    "id": "rest-error-standards",
    "subjectId": "restful-apis",
    "title": "Standardized Error Responses (RFC 7807 Problem Details)",
    "order": 17,
    "description": "type, title, status, detail, and instance error format.",
    "subtopics": [
      {
        "id": "rest-error-standards-basics",
        "title": "What is Standardized Error Responses (RFC 7807 Problem Details)?",
        "conceptId": "restful-apis_rest_error_standards_whatis"
      },
      {
        "id": "rest-error-standards-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_error_standards_usage"
      },
      {
        "id": "rest-error-standards-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_error_standards_bestpractices"
      }
    ]
  },
  {
    "id": "rest-api-versioning",
    "subjectId": "restful-apis",
    "title": "API Versioning Strategies: URI, Header, Query Parameter",
    "order": 18,
    "description": "Pros and cons of /v1/users vs Accept: application/vnd.api.v1+json.",
    "subtopics": [
      {
        "id": "rest-api-versioning-basics",
        "title": "What is API Versioning Strategies?",
        "conceptId": "restful-apis_rest_api_versioning_whatis"
      },
      {
        "id": "rest-api-versioning-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_api_versioning_usage"
      },
      {
        "id": "rest-api-versioning-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_api_versioning_bestpractices"
      }
    ]
  },
  {
    "id": "rest-rate-limiting",
    "subjectId": "restful-apis",
    "title": "Rate Limiting & Throttling (Status 429)",
    "order": 19,
    "description": "X-RateLimit-Limit, Remaining, Reset headers, and Token Bucket algorithm.",
    "subtopics": [
      {
        "id": "rest-rate-limiting-basics",
        "title": "What is Rate Limiting & Throttling (Status 429)?",
        "conceptId": "restful-apis_rest_rate_limiting_whatis"
      },
      {
        "id": "rest-rate-limiting-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_rate_limiting_usage"
      },
      {
        "id": "rest-rate-limiting-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_rate_limiting_bestpractices"
      }
    ]
  },
  {
    "id": "rest-caching-etag",
    "subjectId": "restful-apis",
    "title": "API Caching with ETags & Cache-Control",
    "order": 20,
    "description": "Validation caching using If-None-Match and 304 Not Modified.",
    "subtopics": [
      {
        "id": "rest-caching-etag-basics",
        "title": "What is API Caching with ETags & Cache-Control?",
        "conceptId": "restful-apis_rest_caching_etag_whatis"
      },
      {
        "id": "rest-caching-etag-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_caching_etag_usage"
      },
      {
        "id": "rest-caching-etag-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_caching_etag_bestpractices"
      }
    ]
  },
  {
    "id": "rest-hateoas",
    "subjectId": "restful-apis",
    "title": "HATEOAS & Hypermedia-Driven APIs",
    "order": 21,
    "description": "Embedding navigational hypermedia links inside resource responses.",
    "subtopics": [
      {
        "id": "rest-hateoas-basics",
        "title": "What is HATEOAS & Hypermedia-Driven APIs?",
        "conceptId": "restful-apis_rest_hateoas_whatis"
      },
      {
        "id": "rest-hateoas-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_hateoas_usage"
      },
      {
        "id": "rest-hateoas-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_hateoas_bestpractices"
      }
    ]
  },
  {
    "id": "rest-cors-fundamentals",
    "subjectId": "restful-apis",
    "title": "CORS (Cross-Origin Resource Sharing) Fundamentals",
    "order": 22,
    "description": "Origin headers, Access-Control-Allow-Origin, and browser security.",
    "subtopics": [
      {
        "id": "rest-cors-fundamentals-basics",
        "title": "What is CORS (Cross-Origin Resource Sharing) Fundamentals?",
        "conceptId": "restful-apis_rest_cors_fundamentals_whatis"
      },
      {
        "id": "rest-cors-fundamentals-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_cors_fundamentals_usage"
      },
      {
        "id": "rest-cors-fundamentals-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_cors_fundamentals_bestpractices"
      }
    ]
  },
  {
    "id": "rest-security-input-validation",
    "subjectId": "restful-apis",
    "title": "Security: Input Validation & Sanitization",
    "order": 23,
    "description": "Defending against SQL injection, XSS, and parameter pollution.",
    "subtopics": [
      {
        "id": "rest-security-input-validation-basics",
        "title": "What is Security?",
        "conceptId": "restful-apis_rest_security_input_validation_whatis"
      },
      {
        "id": "rest-security-input-validation-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_security_input_validation_usage"
      },
      {
        "id": "rest-security-input-validation-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_security_input_validation_bestpractices"
      }
    ]
  },
  {
    "id": "rest-openapi-swagger",
    "subjectId": "restful-apis",
    "title": "API Documentation with OpenAPI / Swagger",
    "order": 24,
    "description": "Writing machine-readable specifications and generating client SDKs.",
    "subtopics": [
      {
        "id": "rest-openapi-swagger-basics",
        "title": "What is API Documentation with OpenAPI / Swagger?",
        "conceptId": "restful-apis_rest_openapi_swagger_whatis"
      },
      {
        "id": "rest-openapi-swagger-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_openapi_swagger_usage"
      },
      {
        "id": "rest-openapi-swagger-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_openapi_swagger_bestpractices"
      }
    ]
  },
  {
    "id": "rest-vs-graphql-grpc",
    "subjectId": "restful-apis",
    "title": "REST vs GraphQL vs gRPC: Architectural Comparison",
    "order": 25,
    "description": "Tradeoffs between over/under-fetching, HTTP/2 binary protocols, and REST.",
    "subtopics": [
      {
        "id": "rest-vs-graphql-grpc-basics",
        "title": "What is REST vs GraphQL vs gRPC?",
        "conceptId": "restful-apis_rest_vs_graphql_grpc_whatis"
      },
      {
        "id": "rest-vs-graphql-grpc-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "restful-apis_rest_vs_graphql_grpc_usage"
      },
      {
        "id": "rest-vs-graphql-grpc-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "restful-apis_rest_vs_graphql_grpc_bestpractices"
      }
    ]
  }
],

  "http": [
  {
    "id": "http-intro-client-server",
    "subjectId": "http",
    "title": "What is HTTP? Architecture & Client-Server Model",
    "order": 1,
    "description": "Stateless request-response cycle and role of the transport layer.",
    "subtopics": [
      {
        "id": "http-intro-client-server-basics",
        "title": "What is What is HTTP? Architecture & Client-Server Model?",
        "conceptId": "http_http_intro_client_server_whatis"
      },
      {
        "id": "http-intro-client-server-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_intro_client_server_usage"
      },
      {
        "id": "http-intro-client-server-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_intro_client_server_bestpractices"
      }
    ]
  },
  {
    "id": "http-request-structure",
    "subjectId": "http",
    "title": "HTTP Request Anatomy: Method, URI, Headers & Body",
    "order": 2,
    "description": "Deconstructing raw HTTP request wire format.",
    "subtopics": [
      {
        "id": "http-request-structure-basics",
        "title": "What is HTTP Request Anatomy?",
        "conceptId": "http_http_request_structure_whatis"
      },
      {
        "id": "http-request-structure-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_request_structure_usage"
      },
      {
        "id": "http-request-structure-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_request_structure_bestpractices"
      }
    ]
  },
  {
    "id": "http-response-structure",
    "subjectId": "http",
    "title": "HTTP Response Anatomy: Status, Headers & Payload",
    "order": 3,
    "description": "Deconstructing raw HTTP response wire format.",
    "subtopics": [
      {
        "id": "http-response-structure-basics",
        "title": "What is HTTP Response Anatomy?",
        "conceptId": "http_http_response_structure_whatis"
      },
      {
        "id": "http-response-structure-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_response_structure_usage"
      },
      {
        "id": "http-response-structure-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_response_structure_bestpractices"
      }
    ]
  },
  {
    "id": "http-request-headers",
    "subjectId": "http",
    "title": "Standard Request Headers: User-Agent, Accept, Auth",
    "order": 4,
    "description": "Client capabilities, requested media types, and authorization tokens.",
    "subtopics": [
      {
        "id": "http-request-headers-basics",
        "title": "What is Standard Request Headers?",
        "conceptId": "http_http_request_headers_whatis"
      },
      {
        "id": "http-request-headers-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_request_headers_usage"
      },
      {
        "id": "http-request-headers-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_request_headers_bestpractices"
      }
    ]
  },
  {
    "id": "http-response-headers",
    "subjectId": "http",
    "title": "Standard Response Headers: Content-Type, Server, Date",
    "order": 5,
    "description": "Server instructions, encoding definitions, and metadata.",
    "subtopics": [
      {
        "id": "http-response-headers-basics",
        "title": "What is Standard Response Headers?",
        "conceptId": "http_http_response_headers_whatis"
      },
      {
        "id": "http-response-headers-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_response_headers_usage"
      },
      {
        "id": "http-response-headers-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_response_headers_bestpractices"
      }
    ]
  },
  {
    "id": "http-1-0-vs-1-1",
    "subjectId": "http",
    "title": "HTTP/1.0 vs HTTP/1.1: Persistent Connections & Keep-Alive",
    "order": 6,
    "description": "Eliminating the TCP 3-way handshake on every single file request.",
    "subtopics": [
      {
        "id": "http-1-0-vs-1-1-basics",
        "title": "What is HTTP/1.0 vs HTTP/1.1?",
        "conceptId": "http_http_1_0_vs_1_1_whatis"
      },
      {
        "id": "http-1-0-vs-1-1-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_1_0_vs_1_1_usage"
      },
      {
        "id": "http-1-0-vs-1-1-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_1_0_vs_1_1_bestpractices"
      }
    ]
  },
  {
    "id": "http-head-of-line-blocking",
    "subjectId": "http",
    "title": "Head-of-Line (HoL) Blocking in HTTP/1.1",
    "order": 7,
    "description": "Why browsers limit connections to 6 per domain and sprite sheets.",
    "subtopics": [
      {
        "id": "http-head-of-line-blocking-basics",
        "title": "What is Head-of-Line (HoL) Blocking in HTTP/1.1?",
        "conceptId": "http_http_head_of_line_blocking_whatis"
      },
      {
        "id": "http-head-of-line-blocking-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_head_of_line_blocking_usage"
      },
      {
        "id": "http-head-of-line-blocking-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_head_of_line_blocking_bestpractices"
      }
    ]
  },
  {
    "id": "http-2-binary-framing",
    "subjectId": "http",
    "title": "HTTP/2 Architecture: Binary Framing Layer",
    "order": 8,
    "description": "Transition from plain text ASCII to binary frames (HEADERS, DATA).",
    "subtopics": [
      {
        "id": "http-2-binary-framing-basics",
        "title": "What is HTTP/2 Architecture?",
        "conceptId": "http_http_2_binary_framing_whatis"
      },
      {
        "id": "http-2-binary-framing-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_2_binary_framing_usage"
      },
      {
        "id": "http-2-binary-framing-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_2_binary_framing_bestpractices"
      }
    ]
  },
  {
    "id": "http-2-multiplexing",
    "subjectId": "http",
    "title": "HTTP/2 Multiplexing & Streams",
    "order": 9,
    "description": "Sending multiple concurrent requests and responses over a single TCP connection.",
    "subtopics": [
      {
        "id": "http-2-multiplexing-basics",
        "title": "What is HTTP/2 Multiplexing & Streams?",
        "conceptId": "http_http_2_multiplexing_whatis"
      },
      {
        "id": "http-2-multiplexing-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_2_multiplexing_usage"
      },
      {
        "id": "http-2-multiplexing-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_2_multiplexing_bestpractices"
      }
    ]
  },
  {
    "id": "http-2-hpack",
    "subjectId": "http",
    "title": "HTTP/2 Header Compression (HPACK)",
    "order": 10,
    "description": "Compressing repetitive request and response headers with static/dynamic tables.",
    "subtopics": [
      {
        "id": "http-2-hpack-basics",
        "title": "What is HTTP/2 Header Compression (HPACK)?",
        "conceptId": "http_http_2_hpack_whatis"
      },
      {
        "id": "http-2-hpack-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_2_hpack_usage"
      },
      {
        "id": "http-2-hpack-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_2_hpack_bestpractices"
      }
    ]
  },
  {
    "id": "http-2-server-push",
    "subjectId": "http",
    "title": "HTTP/2 Server Push & Why It Was Deprecated",
    "order": 11,
    "description": "Pushing assets before HTML parsed and why it proved impractical.",
    "subtopics": [
      {
        "id": "http-2-server-push-basics",
        "title": "What is HTTP/2 Server Push & Why It Was Deprecated?",
        "conceptId": "http_http_2_server_push_whatis"
      },
      {
        "id": "http-2-server-push-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_2_server_push_usage"
      },
      {
        "id": "http-2-server-push-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_2_server_push_bestpractices"
      }
    ]
  },
  {
    "id": "http-3-quic-protocol",
    "subjectId": "http",
    "title": "HTTP/3 & QUIC: Replacing TCP with UDP",
    "order": 12,
    "description": "Solving transport layer head-of-line blocking using UDP.",
    "subtopics": [
      {
        "id": "http-3-quic-protocol-basics",
        "title": "What is HTTP/3 & QUIC?",
        "conceptId": "http_http_3_quic_protocol_whatis"
      },
      {
        "id": "http-3-quic-protocol-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_3_quic_protocol_usage"
      },
      {
        "id": "http-3-quic-protocol-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_3_quic_protocol_bestpractices"
      }
    ]
  },
  {
    "id": "http-3-0-rtt",
    "subjectId": "http",
    "title": "0-RTT Connection Handshakes in QUIC",
    "order": 13,
    "description": "Near-instantaneous encrypted reconnection without round-trips.",
    "subtopics": [
      {
        "id": "http-3-0-rtt-basics",
        "title": "What is 0-RTT Connection Handshakes in QUIC?",
        "conceptId": "http_http_3_0_rtt_whatis"
      },
      {
        "id": "http-3-0-rtt-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_3_0_rtt_usage"
      },
      {
        "id": "http-3-0-rtt-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_3_0_rtt_bestpractices"
      }
    ]
  },
  {
    "id": "http-tls-https",
    "subjectId": "http",
    "title": "TLS / SSL Handshake & HTTPS Encryption (TLS 1.2 vs 1.3)",
    "order": 14,
    "description": "Asymmetric vs symmetric encryption, certificates, and cipher suites.",
    "subtopics": [
      {
        "id": "http-tls-https-basics",
        "title": "What is TLS / SSL Handshake & HTTPS Encryption (TLS 1.2 vs 1.3)?",
        "conceptId": "http_http_tls_https_whatis"
      },
      {
        "id": "http-tls-https-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_tls_https_usage"
      },
      {
        "id": "http-tls-https-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_tls_https_bestpractices"
      }
    ]
  },
  {
    "id": "http-caching-directives",
    "subjectId": "http",
    "title": "HTTP Caching: Cache-Control, max-age, no-cache, no-store",
    "order": 15,
    "description": "Controlling browser and CDN caching behavior.",
    "subtopics": [
      {
        "id": "http-caching-directives-basics",
        "title": "What is HTTP Caching?",
        "conceptId": "http_http_caching_directives_whatis"
      },
      {
        "id": "http-caching-directives-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_caching_directives_usage"
      },
      {
        "id": "http-caching-directives-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_caching_directives_bestpractices"
      }
    ]
  },
  {
    "id": "http-conditional-requests",
    "subjectId": "http",
    "title": "Conditional Requests: ETags & If-Modified-Since",
    "order": 16,
    "description": "Revalidating stale assets and avoiding bandwidth waste with 304s.",
    "subtopics": [
      {
        "id": "http-conditional-requests-basics",
        "title": "What is Conditional Requests?",
        "conceptId": "http_http_conditional_requests_whatis"
      },
      {
        "id": "http-conditional-requests-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_conditional_requests_usage"
      },
      {
        "id": "http-conditional-requests-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_conditional_requests_bestpractices"
      }
    ]
  },
  {
    "id": "http-proxies-cdns",
    "subjectId": "http",
    "title": "Proxies, Reverse Proxies & CDNs in HTTP",
    "order": 17,
    "description": "Edge caching, load balancing, and request routing.",
    "subtopics": [
      {
        "id": "http-proxies-cdns-basics",
        "title": "What is Proxies, Reverse Proxies & CDNs in HTTP?",
        "conceptId": "http_http_proxies_cdns_whatis"
      },
      {
        "id": "http-proxies-cdns-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_proxies_cdns_usage"
      },
      {
        "id": "http-proxies-cdns-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_proxies_cdns_bestpractices"
      }
    ]
  },
  {
    "id": "http-cors-preflight",
    "subjectId": "http",
    "title": "CORS Preflight Requests (OPTIONS) & Allowed Headers",
    "order": 18,
    "description": "When browsers trigger OPTIONS preflights and how to respond.",
    "subtopics": [
      {
        "id": "http-cors-preflight-basics",
        "title": "What is CORS Preflight Requests (OPTIONS) & Allowed Headers?",
        "conceptId": "http_http_cors_preflight_whatis"
      },
      {
        "id": "http-cors-preflight-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_cors_preflight_usage"
      },
      {
        "id": "http-cors-preflight-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_cors_preflight_bestpractices"
      }
    ]
  },
  {
    "id": "http-cookies-security",
    "subjectId": "http",
    "title": "HTTP Cookies: Set-Cookie, HttpOnly, Secure, SameSite",
    "order": 19,
    "description": "Session cookies, XSS defense (HttpOnly), and CSRF defense (SameSite=Strict).",
    "subtopics": [
      {
        "id": "http-cookies-security-basics",
        "title": "What is HTTP Cookies?",
        "conceptId": "http_http_cookies_security_whatis"
      },
      {
        "id": "http-cookies-security-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_cookies_security_usage"
      },
      {
        "id": "http-cookies-security-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_cookies_security_bestpractices"
      }
    ]
  },
  {
    "id": "http-csp-headers",
    "subjectId": "http",
    "title": "Content Security Policy (CSP) Headers",
    "order": 20,
    "description": "Restricting script origins, image sources, and preventing inline XSS.",
    "subtopics": [
      {
        "id": "http-csp-headers-basics",
        "title": "What is Content Security Policy (CSP) Headers?",
        "conceptId": "http_http_csp_headers_whatis"
      },
      {
        "id": "http-csp-headers-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_csp_headers_usage"
      },
      {
        "id": "http-csp-headers-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_csp_headers_bestpractices"
      }
    ]
  },
  {
    "id": "http-hsts",
    "subjectId": "http",
    "title": "Strict-Transport-Security (HSTS)",
    "order": 21,
    "description": "Forcing browsers to communicate exclusively over HTTPS.",
    "subtopics": [
      {
        "id": "http-hsts-basics",
        "title": "What is Strict-Transport-Security (HSTS)?",
        "conceptId": "http_http_hsts_whatis"
      },
      {
        "id": "http-hsts-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_hsts_usage"
      },
      {
        "id": "http-hsts-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_hsts_bestpractices"
      }
    ]
  },
  {
    "id": "http-mime-types",
    "subjectId": "http",
    "title": "MIME Types & Content Negotiation",
    "order": 22,
    "description": "application/json, text/html, image/webp, and Accept-Encoding gzip/br.",
    "subtopics": [
      {
        "id": "http-mime-types-basics",
        "title": "What is MIME Types & Content Negotiation?",
        "conceptId": "http_http_mime_types_whatis"
      },
      {
        "id": "http-mime-types-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_mime_types_usage"
      },
      {
        "id": "http-mime-types-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_mime_types_bestpractices"
      }
    ]
  },
  {
    "id": "http-chunked-transfer",
    "subjectId": "http",
    "title": "Transfer-Encoding: chunked & Streaming Data",
    "order": 23,
    "description": "Streaming payloads of unknown total length in real-time.",
    "subtopics": [
      {
        "id": "http-chunked-transfer-basics",
        "title": "What is Transfer-Encoding?",
        "conceptId": "http_http_chunked_transfer_whatis"
      },
      {
        "id": "http-chunked-transfer-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_chunked_transfer_usage"
      },
      {
        "id": "http-chunked-transfer-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_chunked_transfer_bestpractices"
      }
    ]
  },
  {
    "id": "http-range-requests",
    "subjectId": "http",
    "title": "Range Requests & Resumable Downloads",
    "order": 24,
    "description": "Range: bytes=0-1024 and 206 Partial Content for video streaming.",
    "subtopics": [
      {
        "id": "http-range-requests-basics",
        "title": "What is Range Requests & Resumable Downloads?",
        "conceptId": "http_http_range_requests_whatis"
      },
      {
        "id": "http-range-requests-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_range_requests_usage"
      },
      {
        "id": "http-range-requests-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_range_requests_bestpractices"
      }
    ]
  },
  {
    "id": "http-inspecting-devtools",
    "subjectId": "http",
    "title": "Inspecting HTTP Traffic in Chrome Network DevTools",
    "order": 25,
    "description": "Waterfall analysis, timing breakdown (DNS, TTFB, Content Download).",
    "subtopics": [
      {
        "id": "http-inspecting-devtools-basics",
        "title": "What is Inspecting HTTP Traffic in Chrome Network DevTools?",
        "conceptId": "http_http_inspecting_devtools_whatis"
      },
      {
        "id": "http-inspecting-devtools-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "http_http_inspecting_devtools_usage"
      },
      {
        "id": "http-inspecting-devtools-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "http_http_inspecting_devtools_bestpractices"
      }
    ]
  }
],

  "postman": [
  {
    "id": "postman-intro-gui",
    "subjectId": "postman",
    "title": "Postman Introduction & Interface Walkthrough",
    "order": 1,
    "description": "Workspaces, collections, tabs, and sending your first API request.",
    "subtopics": [
      {
        "id": "postman-intro-gui-basics",
        "title": "What is Postman Introduction & Interface Walkthrough?",
        "conceptId": "postman_postman_intro_gui_whatis"
      },
      {
        "id": "postman-intro-gui-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "postman_postman_intro_gui_usage"
      },
      {
        "id": "postman-intro-gui-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "postman_postman_intro_gui_bestpractices"
      }
    ]
  },
  {
    "id": "postman-http-methods",
    "subjectId": "postman",
    "title": "Sending GET, POST, PUT, DELETE Requests in Postman",
    "order": 2,
    "description": "Configuring headers, URL params, and request bodies.",
    "subtopics": [
      {
        "id": "postman-http-methods-basics",
        "title": "What is Sending GET, POST, PUT, DELETE Requests in Postman?",
        "conceptId": "postman_postman_http_methods_whatis"
      },
      {
        "id": "postman-http-methods-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "postman_postman_http_methods_usage"
      },
      {
        "id": "postman-http-methods-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "postman_postman_http_methods_bestpractices"
      }
    ]
  },
  {
    "id": "postman-request-bodies",
    "subjectId": "postman",
    "title": "Request Bodies: raw JSON, form-data & x-www-form-urlencoded",
    "order": 3,
    "description": "Selecting the correct body format for different endpoints.",
    "subtopics": [
      {
        "id": "postman-request-bodies-basics",
        "title": "What is Request Bodies?",
        "conceptId": "postman_postman_request_bodies_whatis"
      },
      {
        "id": "postman-request-bodies-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "postman_postman_request_bodies_usage"
      },
      {
        "id": "postman-request-bodies-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "postman_postman_request_bodies_bestpractices"
      }
    ]
  },
  {
    "id": "postman-environments",
    "subjectId": "postman",
    "title": "Environment Variables vs Global Variables vs Collection Variables",
    "order": 4,
    "description": "Scoping variables across Dev, Staging, and Production environments.",
    "subtopics": [
      {
        "id": "postman-environments-basics",
        "title": "What is Environment Variables vs Global Variables vs Collection Variables?",
        "conceptId": "postman_postman_environments_whatis"
      },
      {
        "id": "postman-environments-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "postman_postman_environments_usage"
      },
      {
        "id": "postman-environments-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "postman_postman_environments_bestpractices"
      }
    ]
  },
  {
    "id": "postman-dynamic-variables",
    "subjectId": "postman",
    "title": "Dynamic Variables: {{$guid}}, {{$timestamp}}, {{$randomEmail}}",
    "order": 5,
    "description": "Auto-generating mock test data on the fly.",
    "subtopics": [
      {
        "id": "postman-dynamic-variables-basics",
        "title": "What is Dynamic Variables?",
        "conceptId": "postman_postman_dynamic_variables_whatis"
      },
      {
        "id": "postman-dynamic-variables-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "postman_postman_dynamic_variables_usage"
      },
      {
        "id": "postman-dynamic-variables-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "postman_postman_dynamic_variables_bestpractices"
      }
    ]
  },
  {
    "id": "postman-prerequest-scripts",
    "subjectId": "postman",
    "title": "Pre-Request Scripts: Preparing State & Hashing",
    "order": 6,
    "description": "Executing JavaScript before requests send: timestamps, HMAC generation.",
    "subtopics": [
      {
        "id": "postman-prerequest-scripts-basics",
        "title": "What is Pre-Request Scripts?",
        "conceptId": "postman_postman_prerequest_scripts_whatis"
      },
      {
        "id": "postman-prerequest-scripts-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "postman_postman_prerequest_scripts_usage"
      },
      {
        "id": "postman-prerequest-scripts-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "postman_postman_prerequest_scripts_bestpractices"
      }
    ]
  },
  {
    "id": "postman-test-scripts-sandbox",
    "subjectId": "postman",
    "title": "Postman Tests Sandbox & Chai Assertion Library",
    "order": 7,
    "description": "pm.test(), pm.expect(), and writing test assertions.",
    "subtopics": [
      {
        "id": "postman-test-scripts-sandbox-basics",
        "title": "What is Postman Tests Sandbox & Chai Assertion Library?",
        "conceptId": "postman_postman_test_scripts_sandbox_whatis"
      },
      {
        "id": "postman-test-scripts-sandbox-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "postman_postman_test_scripts_sandbox_usage"
      },
      {
        "id": "postman-test-scripts-sandbox-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "postman_postman_test_scripts_sandbox_bestpractices"
      }
    ]
  },
  {
    "id": "postman-status-body-tests",
    "subjectId": "postman",
    "title": "Writing Status Code & Response Body Tests",
    "order": 8,
    "description": "Testing 200 status, response time < 500ms, and JSON structure.",
    "subtopics": [
      {
        "id": "postman-status-body-tests-basics",
        "title": "What is Writing Status Code & Response Body Tests?",
        "conceptId": "postman_postman_status_body_tests_whatis"
      },
      {
        "id": "postman-status-body-tests-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "postman_postman_status_body_tests_usage"
      },
      {
        "id": "postman-status-body-tests-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "postman_postman_status_body_tests_bestpractices"
      }
    ]
  },
  {
    "id": "postman-extracting-tokens",
    "subjectId": "postman",
    "title": "Extracting Auth Tokens & Chaining Requests",
    "order": 9,
    "description": "Storing response tokens into environment variables for subsequent calls.",
    "subtopics": [
      {
        "id": "postman-extracting-tokens-basics",
        "title": "What is Extracting Auth Tokens & Chaining Requests?",
        "conceptId": "postman_postman_extracting_tokens_whatis"
      },
      {
        "id": "postman-extracting-tokens-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "postman_postman_extracting_tokens_usage"
      },
      {
        "id": "postman-extracting-tokens-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "postman_postman_extracting_tokens_bestpractices"
      }
    ]
  },
  {
    "id": "postman-collection-runner",
    "subjectId": "postman",
    "title": "Postman Collection Runner for Batch Execution",
    "order": 10,
    "description": "Running hundreds of requests in sequence with automated results.",
    "subtopics": [
      {
        "id": "postman-collection-runner-basics",
        "title": "What is Postman Collection Runner for Batch Execution?",
        "conceptId": "postman_postman_collection_runner_whatis"
      },
      {
        "id": "postman-collection-runner-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "postman_postman_collection_runner_usage"
      },
      {
        "id": "postman-collection-runner-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "postman_postman_collection_runner_bestpractices"
      }
    ]
  },
  {
    "id": "postman-data-driven-testing",
    "subjectId": "postman",
    "title": "Data-Driven Testing with CSV and JSON Data Files",
    "order": 11,
    "description": "Feeding test datasets through the Collection Runner.",
    "subtopics": [
      {
        "id": "postman-data-driven-testing-basics",
        "title": "What is Data-Driven Testing with CSV and JSON Data Files?",
        "conceptId": "postman_postman_data_driven_testing_whatis"
      },
      {
        "id": "postman-data-driven-testing-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "postman_postman_data_driven_testing_usage"
      },
      {
        "id": "postman-data-driven-testing-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "postman_postman_data_driven_testing_bestpractices"
      }
    ]
  },
  {
    "id": "postman-mock-servers",
    "subjectId": "postman",
    "title": "Mock Servers: Simulating APIs Before Backend is Ready",
    "order": 12,
    "description": "Creating mock endpoints and matching example responses.",
    "subtopics": [
      {
        "id": "postman-mock-servers-basics",
        "title": "What is Mock Servers?",
        "conceptId": "postman_postman_mock_servers_whatis"
      },
      {
        "id": "postman-mock-servers-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "postman_postman_mock_servers_usage"
      },
      {
        "id": "postman-mock-servers-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "postman_postman_mock_servers_bestpractices"
      }
    ]
  },
  {
    "id": "postman-monitors",
    "subjectId": "postman",
    "title": "Postman Monitors: Automated Uptime & Health Checks",
    "order": 13,
    "description": "Running scheduled collections in the cloud to monitor API health.",
    "subtopics": [
      {
        "id": "postman-monitors-basics",
        "title": "What is Postman Monitors?",
        "conceptId": "postman_postman_monitors_whatis"
      },
      {
        "id": "postman-monitors-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "postman_postman_monitors_usage"
      },
      {
        "id": "postman-monitors-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "postman_postman_monitors_bestpractices"
      }
    ]
  },
  {
    "id": "postman-api-documentation",
    "subjectId": "postman",
    "title": "Generating Interactive API Documentation in Postman",
    "order": 14,
    "description": "Publishing web documentation with live code snippets.",
    "subtopics": [
      {
        "id": "postman-api-documentation-basics",
        "title": "What is Generating Interactive API Documentation in Postman?",
        "conceptId": "postman_postman_api_documentation_whatis"
      },
      {
        "id": "postman-api-documentation-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "postman_postman_api_documentation_usage"
      },
      {
        "id": "postman-api-documentation-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "postman_postman_api_documentation_bestpractices"
      }
    ]
  },
  {
    "id": "postman-newman-cli",
    "subjectId": "postman",
    "title": "Newman CLI: Running Postman Collections in Terminal",
    "order": 15,
    "description": "Installing newman and running collections headlessly.",
    "subtopics": [
      {
        "id": "postman-newman-cli-basics",
        "title": "What is Newman CLI?",
        "conceptId": "postman_postman_newman_cli_whatis"
      },
      {
        "id": "postman-newman-cli-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "postman_postman_newman_cli_usage"
      },
      {
        "id": "postman-newman-cli-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "postman_postman_newman_cli_bestpractices"
      }
    ]
  },
  {
    "id": "postman-cicd-github-actions",
    "subjectId": "postman",
    "title": "Integrating Newman in GitHub Actions & CI/CD Pipelines",
    "order": 16,
    "description": "Automating regression tests on every pull request.",
    "subtopics": [
      {
        "id": "postman-cicd-github-actions-basics",
        "title": "What is Integrating Newman in GitHub Actions & CI/CD Pipelines?",
        "conceptId": "postman_postman_cicd_github_actions_whatis"
      },
      {
        "id": "postman-cicd-github-actions-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "postman_postman_cicd_github_actions_usage"
      },
      {
        "id": "postman-cicd-github-actions-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "postman_postman_cicd_github_actions_bestpractices"
      }
    ]
  },
  {
    "id": "postman-best-practices",
    "subjectId": "postman",
    "title": "Postman API Testing Best Practices",
    "order": 17,
    "description": "Modular folder organization, avoiding hardcoded secrets, and cleanup scripts.",
    "subtopics": [
      {
        "id": "postman-best-practices-basics",
        "title": "What is Postman API Testing Best Practices?",
        "conceptId": "postman_postman_best_practices_whatis"
      },
      {
        "id": "postman-best-practices-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "postman_postman_best_practices_usage"
      },
      {
        "id": "postman-best-practices-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "postman_postman_best_practices_bestpractices"
      }
    ]
  },
  {
    "id": "postman-team-collaboration",
    "subjectId": "postman",
    "title": "Team Collaboration: Workspaces, Forks & Pull Requests",
    "order": 18,
    "description": "Version-controlling collections and collaborating in team workspaces.",
    "subtopics": [
      {
        "id": "postman-team-collaboration-basics",
        "title": "What is Team Collaboration?",
        "conceptId": "postman_postman_team_collaboration_whatis"
      },
      {
        "id": "postman-team-collaboration-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "postman_postman_team_collaboration_usage"
      },
      {
        "id": "postman-team-collaboration-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "postman_postman_team_collaboration_bestpractices"
      }
    ]
  }
],

  "websockets": [
  {
    "id": "ws-intro-realtime",
    "subjectId": "websockets",
    "title": "WebSockets Introduction & Why Real-Time Matters",
    "order": 1,
    "description": "Full-duplex bidirectional communication vs HTTP polling.",
    "subtopics": [
      {
        "id": "ws-intro-realtime-basics",
        "title": "What is WebSockets Introduction & Why Real-Time Matters?",
        "conceptId": "websockets_ws_intro_realtime_whatis"
      },
      {
        "id": "ws-intro-realtime-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "websockets_ws_intro_realtime_usage"
      },
      {
        "id": "ws-intro-realtime-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "websockets_ws_intro_realtime_bestpractices"
      }
    ]
  },
  {
    "id": "ws-polling-vs-sse-vs-ws",
    "subjectId": "websockets",
    "title": "HTTP Polling vs Long Polling vs SSE vs WebSockets",
    "order": 2,
    "description": "Architectural comparison, overhead, and choosing the right protocol.",
    "subtopics": [
      {
        "id": "ws-polling-vs-sse-vs-ws-basics",
        "title": "What is HTTP Polling vs Long Polling vs SSE vs WebSockets?",
        "conceptId": "websockets_ws_polling_vs_sse_vs_ws_whatis"
      },
      {
        "id": "ws-polling-vs-sse-vs-ws-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "websockets_ws_polling_vs_sse_vs_ws_usage"
      },
      {
        "id": "ws-polling-vs-sse-vs-ws-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "websockets_ws_polling_vs_sse_vs_ws_bestpractices"
      }
    ]
  },
  {
    "id": "ws-handshake-protocol",
    "subjectId": "websockets",
    "title": "The WebSocket Handshake (HTTP Upgrade 101)",
    "order": 3,
    "description": "Sec-WebSocket-Key, Sec-WebSocket-Accept, and switching protocols.",
    "subtopics": [
      {
        "id": "ws-handshake-protocol-basics",
        "title": "What is The WebSocket Handshake (HTTP Upgrade 101)?",
        "conceptId": "websockets_ws_handshake_protocol_whatis"
      },
      {
        "id": "ws-handshake-protocol-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "websockets_ws_handshake_protocol_usage"
      },
      {
        "id": "ws-handshake-protocol-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "websockets_ws_handshake_protocol_bestpractices"
      }
    ]
  },
  {
    "id": "ws-framing-binary",
    "subjectId": "websockets",
    "title": "WebSocket Framing: Opcodes, Masking & FIN Bit",
    "order": 4,
    "description": "Client-to-server masking, text frames, binary frames, and control frames.",
    "subtopics": [
      {
        "id": "ws-framing-binary-basics",
        "title": "What is WebSocket Framing?",
        "conceptId": "websockets_ws_framing_binary_whatis"
      },
      {
        "id": "ws-framing-binary-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "websockets_ws_framing_binary_usage"
      },
      {
        "id": "ws-framing-binary-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "websockets_ws_framing_binary_bestpractices"
      }
    ]
  },
  {
    "id": "ws-browser-api",
    "subjectId": "websockets",
    "title": "Browser WebSocket API: new WebSocket()",
    "order": 5,
    "description": "onopen, onmessage, onerror, onclose event listeners.",
    "subtopics": [
      {
        "id": "ws-browser-api-basics",
        "title": "What is Browser WebSocket API?",
        "conceptId": "websockets_ws_browser_api_whatis"
      },
      {
        "id": "ws-browser-api-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "websockets_ws_browser_api_usage"
      },
      {
        "id": "ws-browser-api-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "websockets_ws_browser_api_bestpractices"
      }
    ]
  },
  {
    "id": "ws-sending-data",
    "subjectId": "websockets",
    "title": "Sending and Receiving Data: Text, JSON & Binary (Blob)",
    "order": 6,
    "description": "ws.send() with strings, ArrayBuffers, and Blobs.",
    "subtopics": [
      {
        "id": "ws-sending-data-basics",
        "title": "What is Sending and Receiving Data?",
        "conceptId": "websockets_ws_sending_data_whatis"
      },
      {
        "id": "ws-sending-data-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "websockets_ws_sending_data_usage"
      },
      {
        "id": "ws-sending-data-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "websockets_ws_sending_data_bestpractices"
      }
    ]
  },
  {
    "id": "ws-heartbeats-ping-pong",
    "subjectId": "websockets",
    "title": "Heartbeats & Ping/Pong Frames",
    "order": 7,
    "description": "Detecting dead connections and preventing router timeout drops.",
    "subtopics": [
      {
        "id": "ws-heartbeats-ping-pong-basics",
        "title": "What is Heartbeats & Ping/Pong Frames?",
        "conceptId": "websockets_ws_heartbeats_ping_pong_whatis"
      },
      {
        "id": "ws-heartbeats-ping-pong-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "websockets_ws_heartbeats_ping_pong_usage"
      },
      {
        "id": "ws-heartbeats-ping-pong-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "websockets_ws_heartbeats_ping_pong_bestpractices"
      }
    ]
  },
  {
    "id": "ws-reconnection-strategies",
    "subjectId": "websockets",
    "title": "Reconnection Strategies with Exponential Backoff & Jitter",
    "order": 8,
    "description": "Re-establishing dropped connections without hammering the server.",
    "subtopics": [
      {
        "id": "ws-reconnection-strategies-basics",
        "title": "What is Reconnection Strategies with Exponential Backoff & Jitter?",
        "conceptId": "websockets_ws_reconnection_strategies_whatis"
      },
      {
        "id": "ws-reconnection-strategies-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "websockets_ws_reconnection_strategies_usage"
      },
      {
        "id": "ws-reconnection-strategies-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "websockets_ws_reconnection_strategies_bestpractices"
      }
    ]
  },
  {
    "id": "ws-security-wss",
    "subjectId": "websockets",
    "title": "Security: WSS (WebSocket Secure) & Origin Validation",
    "order": 9,
    "description": "TLS encryption and preventing Cross-Site WebSocket Hijacking (CSWSH).",
    "subtopics": [
      {
        "id": "ws-security-wss-basics",
        "title": "What is Security?",
        "conceptId": "websockets_ws_security_wss_whatis"
      },
      {
        "id": "ws-security-wss-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "websockets_ws_security_wss_usage"
      },
      {
        "id": "ws-security-wss-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "websockets_ws_security_wss_bestpractices"
      }
    ]
  },
  {
    "id": "ws-auth-handshake",
    "subjectId": "websockets",
    "title": "Authentication & Passing Tokens During Handshake",
    "order": 10,
    "description": "Passing JWTs via query params or sub-protocols securely.",
    "subtopics": [
      {
        "id": "ws-auth-handshake-basics",
        "title": "What is Authentication & Passing Tokens During Handshake?",
        "conceptId": "websockets_ws_auth_handshake_whatis"
      },
      {
        "id": "ws-auth-handshake-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "websockets_ws_auth_handshake_usage"
      },
      {
        "id": "ws-auth-handshake-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "websockets_ws_auth_handshake_bestpractices"
      }
    ]
  },
  {
    "id": "ws-horizontal-scaling",
    "subjectId": "websockets",
    "title": "Scaling WebSockets: Sticky Sessions & Load Balancers",
    "order": 11,
    "description": "Maintaining persistent connections across multi-node server clusters.",
    "subtopics": [
      {
        "id": "ws-horizontal-scaling-basics",
        "title": "What is Scaling WebSockets?",
        "conceptId": "websockets_ws_horizontal_scaling_whatis"
      },
      {
        "id": "ws-horizontal-scaling-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "websockets_ws_horizontal_scaling_usage"
      },
      {
        "id": "ws-horizontal-scaling-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "websockets_ws_horizontal_scaling_bestpractices"
      }
    ]
  },
  {
    "id": "ws-pubsub-redis",
    "subjectId": "websockets",
    "title": "Pub/Sub Message Brokers with Redis",
    "order": 12,
    "description": "Broadcasting messages across multiple WebSocket server instances.",
    "subtopics": [
      {
        "id": "ws-pubsub-redis-basics",
        "title": "What is Pub/Sub Message Brokers with Redis?",
        "conceptId": "websockets_ws_pubsub_redis_whatis"
      },
      {
        "id": "ws-pubsub-redis-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "websockets_ws_pubsub_redis_usage"
      },
      {
        "id": "ws-pubsub-redis-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "websockets_ws_pubsub_redis_bestpractices"
      }
    ]
  },
  {
    "id": "ws-state-management-react",
    "subjectId": "websockets",
    "title": "Managing WebSocket State in React (Custom Hooks)",
    "order": 13,
    "description": "useWebSocket hook pattern, connection status, and event dispatching.",
    "subtopics": [
      {
        "id": "ws-state-management-react-basics",
        "title": "What is Managing WebSocket State in React (Custom Hooks)?",
        "conceptId": "websockets_ws_state_management_react_whatis"
      },
      {
        "id": "ws-state-management-react-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "websockets_ws_state_management_react_usage"
      },
      {
        "id": "ws-state-management-react-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "websockets_ws_state_management_react_bestpractices"
      }
    ]
  },
  {
    "id": "ws-socket-io-overview",
    "subjectId": "websockets",
    "title": "Socket.io Overview: Rooms, Namespaces & Fallbacks",
    "order": 14,
    "description": "Higher-level abstraction with automated reconnection and HTTP polling fallback.",
    "subtopics": [
      {
        "id": "ws-socket-io-overview-basics",
        "title": "What is Socket.io Overview?",
        "conceptId": "websockets_ws_socket_io_overview_whatis"
      },
      {
        "id": "ws-socket-io-overview-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "websockets_ws_socket_io_overview_usage"
      },
      {
        "id": "ws-socket-io-overview-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "websockets_ws_socket_io_overview_bestpractices"
      }
    ]
  },
  {
    "id": "ws-broadcasting-patterns",
    "subjectId": "websockets",
    "title": "Broadcasting & Targeted Messaging Patterns",
    "order": 15,
    "description": "One-to-many broadcasting, direct messaging, and room segregation.",
    "subtopics": [
      {
        "id": "ws-broadcasting-patterns-basics",
        "title": "What is Broadcasting & Targeted Messaging Patterns?",
        "conceptId": "websockets_ws_broadcasting_patterns_whatis"
      },
      {
        "id": "ws-broadcasting-patterns-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "websockets_ws_broadcasting_patterns_usage"
      },
      {
        "id": "ws-broadcasting-patterns-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "websockets_ws_broadcasting_patterns_bestpractices"
      }
    ]
  },
  {
    "id": "ws-throttling-updates",
    "subjectId": "websockets",
    "title": "High-Frequency Updates & UI Throttling",
    "order": 16,
    "description": "Batching 60fps WebSocket data feeds to prevent DOM freezing.",
    "subtopics": [
      {
        "id": "ws-throttling-updates-basics",
        "title": "What is High-Frequency Updates & UI Throttling?",
        "conceptId": "websockets_ws_throttling_updates_whatis"
      },
      {
        "id": "ws-throttling-updates-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "websockets_ws_throttling_updates_usage"
      },
      {
        "id": "ws-throttling-updates-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "websockets_ws_throttling_updates_bestpractices"
      }
    ]
  },
  {
    "id": "ws-memory-cleanup",
    "subjectId": "websockets",
    "title": "Memory Management & Teardown on Component Unmount",
    "order": 17,
    "description": "Closing sockets cleanly and clearing heartbeat intervals.",
    "subtopics": [
      {
        "id": "ws-memory-cleanup-basics",
        "title": "What is Memory Management & Teardown on Component Unmount?",
        "conceptId": "websockets_ws_memory_cleanup_whatis"
      },
      {
        "id": "ws-memory-cleanup-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "websockets_ws_memory_cleanup_usage"
      },
      {
        "id": "ws-memory-cleanup-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "websockets_ws_memory_cleanup_bestpractices"
      }
    ]
  },
  {
    "id": "ws-load-balancing-nginx",
    "subjectId": "websockets",
    "title": "Load Balancing WebSockets with NGINX",
    "order": 18,
    "description": "proxy_set_header Upgrade and Connection directives.",
    "subtopics": [
      {
        "id": "ws-load-balancing-nginx-basics",
        "title": "What is Load Balancing WebSockets with NGINX?",
        "conceptId": "websockets_ws_load_balancing_nginx_whatis"
      },
      {
        "id": "ws-load-balancing-nginx-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "websockets_ws_load_balancing_nginx_usage"
      },
      {
        "id": "ws-load-balancing-nginx-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "websockets_ws_load_balancing_nginx_bestpractices"
      }
    ]
  },
  {
    "id": "ws-vs-webrtc",
    "subjectId": "websockets",
    "title": "WebSockets vs WebRTC Data Channels",
    "order": 19,
    "description": "Client-server messaging vs peer-to-peer ultra-low latency streaming.",
    "subtopics": [
      {
        "id": "ws-vs-webrtc-basics",
        "title": "What is WebSockets vs WebRTC Data Channels?",
        "conceptId": "websockets_ws_vs_webrtc_whatis"
      },
      {
        "id": "ws-vs-webrtc-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "websockets_ws_vs_webrtc_usage"
      },
      {
        "id": "ws-vs-webrtc-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "websockets_ws_vs_webrtc_bestpractices"
      }
    ]
  },
  {
    "id": "ws-debugging-devtools",
    "subjectId": "websockets",
    "title": "Debugging WebSockets in Chrome Network Tab",
    "order": 20,
    "description": "Viewing frames, filter by opcode, and inspecting payload messages.",
    "subtopics": [
      {
        "id": "ws-debugging-devtools-basics",
        "title": "What is Debugging WebSockets in Chrome Network Tab?",
        "conceptId": "websockets_ws_debugging_devtools_whatis"
      },
      {
        "id": "ws-debugging-devtools-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "websockets_ws_debugging_devtools_usage"
      },
      {
        "id": "ws-debugging-devtools-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "websockets_ws_debugging_devtools_bestpractices"
      }
    ]
  }
],

  "webhooks": [
  {
    "id": "wh-intro-push",
    "subjectId": "webhooks",
    "title": "What are Webhooks? Push Architecture vs Polling",
    "order": 1,
    "description": "Event-driven HTTP callbacks from providers to consumer servers.",
    "subtopics": [
      {
        "id": "wh-intro-push-basics",
        "title": "What is What are Webhooks? Push Architecture vs Polling?",
        "conceptId": "webhooks_wh_intro_push_whatis"
      },
      {
        "id": "wh-intro-push-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "webhooks_wh_intro_push_usage"
      },
      {
        "id": "wh-intro-push-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "webhooks_wh_intro_push_bestpractices"
      }
    ]
  },
  {
    "id": "wh-lifecycle",
    "subjectId": "webhooks",
    "title": "Webhook Lifecycle: Event Trigger, Payload & Dispatch",
    "order": 2,
    "description": "How events are captured, serialized, and sent over HTTP POST.",
    "subtopics": [
      {
        "id": "wh-lifecycle-basics",
        "title": "What is Webhook Lifecycle?",
        "conceptId": "webhooks_wh_lifecycle_whatis"
      },
      {
        "id": "wh-lifecycle-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "webhooks_wh_lifecycle_usage"
      },
      {
        "id": "wh-lifecycle-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "webhooks_wh_lifecycle_bestpractices"
      }
    ]
  },
  {
    "id": "wh-delivery-guarantees",
    "subjectId": "webhooks",
    "title": "Delivery Guarantees: At-Least-Once Delivery",
    "order": 3,
    "description": "Why webhooks can deliver duplicates and designing for eventual consistency.",
    "subtopics": [
      {
        "id": "wh-delivery-guarantees-basics",
        "title": "What is Delivery Guarantees?",
        "conceptId": "webhooks_wh_delivery_guarantees_whatis"
      },
      {
        "id": "wh-delivery-guarantees-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "webhooks_wh_delivery_guarantees_usage"
      },
      {
        "id": "wh-delivery-guarantees-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "webhooks_wh_delivery_guarantees_bestpractices"
      }
    ]
  },
  {
    "id": "wh-idempotent-consumers",
    "subjectId": "webhooks",
    "title": "Designing Idempotent Webhook Consumers",
    "order": 4,
    "description": "Preventing double charging or duplicate actions upon repeated webhooks.",
    "subtopics": [
      {
        "id": "wh-idempotent-consumers-basics",
        "title": "What is Designing Idempotent Webhook Consumers?",
        "conceptId": "webhooks_wh_idempotent_consumers_whatis"
      },
      {
        "id": "wh-idempotent-consumers-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "webhooks_wh_idempotent_consumers_usage"
      },
      {
        "id": "wh-idempotent-consumers-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "webhooks_wh_idempotent_consumers_bestpractices"
      }
    ]
  },
  {
    "id": "wh-idempotency-keys",
    "subjectId": "webhooks",
    "title": "Idempotency Keys & Deduplication Tables",
    "order": 5,
    "description": "Storing event IDs in database unique constraints or Redis caches.",
    "subtopics": [
      {
        "id": "wh-idempotency-keys-basics",
        "title": "What is Idempotency Keys & Deduplication Tables?",
        "conceptId": "webhooks_wh_idempotency_keys_whatis"
      },
      {
        "id": "wh-idempotency-keys-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "webhooks_wh_idempotency_keys_usage"
      },
      {
        "id": "wh-idempotency-keys-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "webhooks_wh_idempotency_keys_bestpractices"
      }
    ]
  },
  {
    "id": "wh-security-hmac",
    "subjectId": "webhooks",
    "title": "Securing Webhooks with HMAC SHA-256 Signatures",
    "order": 6,
    "description": "How providers sign payloads with shared secrets.",
    "subtopics": [
      {
        "id": "wh-security-hmac-basics",
        "title": "What is Securing Webhooks with HMAC SHA-256 Signatures?",
        "conceptId": "webhooks_wh_security_hmac_whatis"
      },
      {
        "id": "wh-security-hmac-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "webhooks_wh_security_hmac_usage"
      },
      {
        "id": "wh-security-hmac-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "webhooks_wh_security_hmac_bestpractices"
      }
    ]
  },
  {
    "id": "wh-verifying-signatures",
    "subjectId": "webhooks",
    "title": "Validating Webhook Signatures in Node.js",
    "order": 7,
    "description": "Computing crypto.createHmac and comparing with timingSafeEqual.",
    "subtopics": [
      {
        "id": "wh-verifying-signatures-basics",
        "title": "What is Validating Webhook Signatures in Node.js?",
        "conceptId": "webhooks_wh_verifying_signatures_whatis"
      },
      {
        "id": "wh-verifying-signatures-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "webhooks_wh_verifying_signatures_usage"
      },
      {
        "id": "wh-verifying-signatures-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "webhooks_wh_verifying_signatures_bestpractices"
      }
    ]
  },
  {
    "id": "wh-replay-attacks",
    "subjectId": "webhooks",
    "title": "Preventing Replay Attacks with Timestamps",
    "order": 8,
    "description": "Validating timestamp tolerances (e.g. within 5 minutes) to reject old captures.",
    "subtopics": [
      {
        "id": "wh-replay-attacks-basics",
        "title": "What is Preventing Replay Attacks with Timestamps?",
        "conceptId": "webhooks_wh_replay_attacks_whatis"
      },
      {
        "id": "wh-replay-attacks-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "webhooks_wh_replay_attacks_usage"
      },
      {
        "id": "wh-replay-attacks-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "webhooks_wh_replay_attacks_bestpractices"
      }
    ]
  },
  {
    "id": "wh-async-processing",
    "subjectId": "webhooks",
    "title": "Asynchronous Webhook Processing with Queues",
    "order": 9,
    "description": "Responding 200 OK immediately and pushing payloads to BullMQ / SQS.",
    "subtopics": [
      {
        "id": "wh-async-processing-basics",
        "title": "What is Asynchronous Webhook Processing with Queues?",
        "conceptId": "webhooks_wh_async_processing_whatis"
      },
      {
        "id": "wh-async-processing-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "webhooks_wh_async_processing_usage"
      },
      {
        "id": "wh-async-processing-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "webhooks_wh_async_processing_bestpractices"
      }
    ]
  },
  {
    "id": "wh-retries-backoff",
    "subjectId": "webhooks",
    "title": "Handling Webhook Failures: Retries & Exponential Backoff",
    "order": 10,
    "description": "Standard retry schedules (1m, 5m, 1h, 24h) when consumer endpoints fail.",
    "subtopics": [
      {
        "id": "wh-retries-backoff-basics",
        "title": "What is Handling Webhook Failures?",
        "conceptId": "webhooks_wh_retries_backoff_whatis"
      },
      {
        "id": "wh-retries-backoff-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "webhooks_wh_retries_backoff_usage"
      },
      {
        "id": "wh-retries-backoff-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "webhooks_wh_retries_backoff_bestpractices"
      }
    ]
  },
  {
    "id": "wh-dead-letter-queues",
    "subjectId": "webhooks",
    "title": "Dead Letter Queues (DLQ) for Failed Webhooks",
    "order": 11,
    "description": "Isolating permanently failed webhooks for manual inspection and replay.",
    "subtopics": [
      {
        "id": "wh-dead-letter-queues-basics",
        "title": "What is Dead Letter Queues (DLQ) for Failed Webhooks?",
        "conceptId": "webhooks_wh_dead_letter_queues_whatis"
      },
      {
        "id": "wh-dead-letter-queues-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "webhooks_wh_dead_letter_queues_usage"
      },
      {
        "id": "wh-dead-letter-queues-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "webhooks_wh_dead_letter_queues_bestpractices"
      }
    ]
  },
  {
    "id": "wh-rate-limiting",
    "subjectId": "webhooks",
    "title": "Consumer Rate Limiting & Concurrency Control",
    "order": 12,
    "description": "Protecting your backend from webhook floods during traffic spikes.",
    "subtopics": [
      {
        "id": "wh-rate-limiting-basics",
        "title": "What is Consumer Rate Limiting & Concurrency Control?",
        "conceptId": "webhooks_wh_rate_limiting_whatis"
      },
      {
        "id": "wh-rate-limiting-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "webhooks_wh_rate_limiting_usage"
      },
      {
        "id": "wh-rate-limiting-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "webhooks_wh_rate_limiting_bestpractices"
      }
    ]
  },
  {
    "id": "wh-local-testing-ngrok",
    "subjectId": "webhooks",
    "title": "Testing Webhooks Locally with ngrok & Webhook.site",
    "order": 13,
    "description": "Exposing localhost ports securely to receive provider test events.",
    "subtopics": [
      {
        "id": "wh-local-testing-ngrok-basics",
        "title": "What is Testing Webhooks Locally with ngrok & Webhook.site?",
        "conceptId": "webhooks_wh_local_testing_ngrok_whatis"
      },
      {
        "id": "wh-local-testing-ngrok-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "webhooks_wh_local_testing_ngrok_usage"
      },
      {
        "id": "wh-local-testing-ngrok-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "webhooks_wh_local_testing_ngrok_bestpractices"
      }
    ]
  },
  {
    "id": "wh-monitoring-alerting",
    "subjectId": "webhooks",
    "title": "Monitoring & Alerting on Webhook Failures",
    "order": 14,
    "description": "Tracking success rates, latency percentiles, and failure notifications.",
    "subtopics": [
      {
        "id": "wh-monitoring-alerting-basics",
        "title": "What is Monitoring & Alerting on Webhook Failures?",
        "conceptId": "webhooks_wh_monitoring_alerting_whatis"
      },
      {
        "id": "wh-monitoring-alerting-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "webhooks_wh_monitoring_alerting_usage"
      },
      {
        "id": "wh-monitoring-alerting-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "webhooks_wh_monitoring_alerting_bestpractices"
      }
    ]
  },
  {
    "id": "wh-enterprise-case-studies",
    "subjectId": "webhooks",
    "title": "Enterprise Webhook Case Studies (Stripe, GitHub)",
    "order": 15,
    "description": "How industry leaders design developer-friendly webhook architectures.",
    "subtopics": [
      {
        "id": "wh-enterprise-case-studies-basics",
        "title": "What is Enterprise Webhook Case Studies (Stripe, GitHub)?",
        "conceptId": "webhooks_wh_enterprise_case_studies_whatis"
      },
      {
        "id": "wh-enterprise-case-studies-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "webhooks_wh_enterprise_case_studies_usage"
      },
      {
        "id": "wh-enterprise-case-studies-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "webhooks_wh_enterprise_case_studies_bestpractices"
      }
    ]
  }
],

  "web-performance": [
  {
    "id": "wp-intro-business",
    "subjectId": "web-performance",
    "title": "Web Performance Introduction & Business Impact",
    "order": 1,
    "description": "How page speed directly correlates with conversion rates, SEO, and bounce rates.",
    "subtopics": [
      {
        "id": "wp-intro-business-basics",
        "title": "What is Web Performance Introduction & Business Impact?",
        "conceptId": "web-performance_wp_intro_business_whatis"
      },
      {
        "id": "wp-intro-business-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "web-performance_wp_intro_business_usage"
      },
      {
        "id": "wp-intro-business-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "web-performance_wp_intro_business_bestpractices"
      }
    ]
  },
  {
    "id": "wp-cwv-overview",
    "subjectId": "web-performance",
    "title": "Core Web Vitals (CWV) Overview & 75th Percentile Metric",
    "order": 2,
    "description": "Google search ranking signals and user experience thresholds.",
    "subtopics": [
      {
        "id": "wp-cwv-overview-basics",
        "title": "What is Core Web Vitals (CWV) Overview & 75th Percentile Metric?",
        "conceptId": "web-performance_wp_cwv_overview_whatis"
      },
      {
        "id": "wp-cwv-overview-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "web-performance_wp_cwv_overview_usage"
      },
      {
        "id": "wp-cwv-overview-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "web-performance_wp_cwv_overview_bestpractices"
      }
    ]
  },
  {
    "id": "wp-lcp-optimization",
    "subjectId": "web-performance",
    "title": "Largest Contentful Paint (LCP): Breakdown & Optimization",
    "order": 3,
    "description": "Measuring and speeding up the render of the main visual hero element (<2.5s).",
    "subtopics": [
      {
        "id": "wp-lcp-optimization-basics",
        "title": "What is Largest Contentful Paint (LCP)?",
        "conceptId": "web-performance_wp_lcp_optimization_whatis"
      },
      {
        "id": "wp-lcp-optimization-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "web-performance_wp_lcp_optimization_usage"
      },
      {
        "id": "wp-lcp-optimization-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "web-performance_wp_lcp_optimization_bestpractices"
      }
    ]
  },
  {
    "id": "wp-inp-optimization",
    "subjectId": "web-performance",
    "title": "Interaction to Next Paint (INP): Responsiveness",
    "order": 4,
    "description": "Replacing FID: measuring user input delay and main thread stalls (<200ms).",
    "subtopics": [
      {
        "id": "wp-inp-optimization-basics",
        "title": "What is Interaction to Next Paint (INP)?",
        "conceptId": "web-performance_wp_inp_optimization_whatis"
      },
      {
        "id": "wp-inp-optimization-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "web-performance_wp_inp_optimization_usage"
      },
      {
        "id": "wp-inp-optimization-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "web-performance_wp_inp_optimization_bestpractices"
      }
    ]
  },
  {
    "id": "wp-cls-optimization",
    "subjectId": "web-performance",
    "title": "Cumulative Layout Shift (CLS): Causes & Prevention",
    "order": 5,
    "description": "Preventing unexpected page jumping (<0.1 score) with reserved dimensions.",
    "subtopics": [
      {
        "id": "wp-cls-optimization-basics",
        "title": "What is Cumulative Layout Shift (CLS)?",
        "conceptId": "web-performance_wp_cls_optimization_whatis"
      },
      {
        "id": "wp-cls-optimization-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "web-performance_wp_cls_optimization_usage"
      },
      {
        "id": "wp-cls-optimization-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "web-performance_wp_cls_optimization_bestpractices"
      }
    ]
  },
  {
    "id": "wp-fcp-ttfb",
    "subjectId": "web-performance",
    "title": "First Contentful Paint (FCP) and Time to First Byte (TTFB)",
    "order": 6,
    "description": "Server response times, edge caching, and initial DOM visual painting.",
    "subtopics": [
      {
        "id": "wp-fcp-ttfb-basics",
        "title": "What is First Contentful Paint (FCP) and Time to First Byte (TTFB)?",
        "conceptId": "web-performance_wp_fcp_ttfb_whatis"
      },
      {
        "id": "wp-fcp-ttfb-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "web-performance_wp_fcp_ttfb_usage"
      },
      {
        "id": "wp-fcp-ttfb-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "web-performance_wp_fcp_ttfb_bestpractices"
      }
    ]
  },
  {
    "id": "wp-resource-hints",
    "subjectId": "web-performance",
    "title": "Resource Hints: preload, prefetch, preconnect, dns-prefetch",
    "order": 7,
    "description": "Instructing browsers to download critical resources ahead of time.",
    "subtopics": [
      {
        "id": "wp-resource-hints-basics",
        "title": "What is Resource Hints?",
        "conceptId": "web-performance_wp_resource_hints_whatis"
      },
      {
        "id": "wp-resource-hints-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "web-performance_wp_resource_hints_usage"
      },
      {
        "id": "wp-resource-hints-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "web-performance_wp_resource_hints_bestpractices"
      }
    ]
  },
  {
    "id": "wp-critical-rendering-path",
    "subjectId": "web-performance",
    "title": "Critical Rendering Path: DOM, CSSOM & Render Tree",
    "order": 8,
    "description": "How HTML and CSS parse into render trees and trigger layout and paint.",
    "subtopics": [
      {
        "id": "wp-critical-rendering-path-basics",
        "title": "What is Critical Rendering Path?",
        "conceptId": "web-performance_wp_critical_rendering_path_whatis"
      },
      {
        "id": "wp-critical-rendering-path-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "web-performance_wp_critical_rendering_path_usage"
      },
      {
        "id": "wp-critical-rendering-path-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "web-performance_wp_critical_rendering_path_bestpractices"
      }
    ]
  },
  {
    "id": "wp-tbt-main-thread",
    "subjectId": "web-performance",
    "title": "Total Blocking Time (TBT) & Long Tasks (>50ms)",
    "order": 9,
    "description": "Breaking up heavy JavaScript execution with scheduler.yield() or timeouts.",
    "subtopics": [
      {
        "id": "wp-tbt-main-thread-basics",
        "title": "What is Total Blocking Time (TBT) & Long Tasks (>50ms)?",
        "conceptId": "web-performance_wp_tbt_main_thread_whatis"
      },
      {
        "id": "wp-tbt-main-thread-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "web-performance_wp_tbt_main_thread_usage"
      },
      {
        "id": "wp-tbt-main-thread-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "web-performance_wp_tbt_main_thread_bestpractices"
      }
    ]
  },
  {
    "id": "wp-code-splitting-lazy",
    "subjectId": "web-performance",
    "title": "Code Splitting, Dynamic Imports & Route Lazy Loading",
    "order": 10,
    "description": "Reducing initial bundle payload by serving only code needed for active page.",
    "subtopics": [
      {
        "id": "wp-code-splitting-lazy-basics",
        "title": "What is Code Splitting, Dynamic Imports & Route Lazy Loading?",
        "conceptId": "web-performance_wp_code_splitting_lazy_whatis"
      },
      {
        "id": "wp-code-splitting-lazy-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "web-performance_wp_code_splitting_lazy_usage"
      },
      {
        "id": "wp-code-splitting-lazy-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "web-performance_wp_code_splitting_lazy_bestpractices"
      }
    ]
  },
  {
    "id": "wp-image-formats-responsive",
    "subjectId": "web-performance",
    "title": "Image Optimization: WebP, AVIF & Responsive <picture>",
    "order": 11,
    "description": "Serving modern high-compression image formats with srcset.",
    "subtopics": [
      {
        "id": "wp-image-formats-responsive-basics",
        "title": "What is Image Optimization?",
        "conceptId": "web-performance_wp_image_formats_responsive_whatis"
      },
      {
        "id": "wp-image-formats-responsive-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "web-performance_wp_image_formats_responsive_usage"
      },
      {
        "id": "wp-image-formats-responsive-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "web-performance_wp_image_formats_responsive_bestpractices"
      }
    ]
  },
  {
    "id": "wp-font-optimization",
    "subjectId": "web-performance",
    "title": "Font Optimization: font-display: swap & Subsetting",
    "order": 12,
    "description": "Eliminating Flash of Invisible Text (FOIT) and reducing font payload.",
    "subtopics": [
      {
        "id": "wp-font-optimization-basics",
        "title": "What is Font Optimization?",
        "conceptId": "web-performance_wp_font_optimization_whatis"
      },
      {
        "id": "wp-font-optimization-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "web-performance_wp_font_optimization_usage"
      },
      {
        "id": "wp-font-optimization-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "web-performance_wp_font_optimization_bestpractices"
      }
    ]
  },
  {
    "id": "wp-tree-shaking",
    "subjectId": "web-performance",
    "title": "Tree-Shaking & Dead Code Elimination in Bundlers",
    "order": 13,
    "description": "How ES modules enable bundlers to discard unused functions.",
    "subtopics": [
      {
        "id": "wp-tree-shaking-basics",
        "title": "What is Tree-Shaking & Dead Code Elimination in Bundlers?",
        "conceptId": "web-performance_wp_tree_shaking_whatis"
      },
      {
        "id": "wp-tree-shaking-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "web-performance_wp_tree_shaking_usage"
      },
      {
        "id": "wp-tree-shaking-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "web-performance_wp_tree_shaking_bestpractices"
      }
    ]
  },
  {
    "id": "wp-bundle-analysis",
    "subjectId": "web-performance",
    "title": "Bundle Analysis & Identifying Bloat (Visualizer)",
    "order": 14,
    "description": "Inspecting chunk sizes and replacing heavy third-party packages.",
    "subtopics": [
      {
        "id": "wp-bundle-analysis-basics",
        "title": "What is Bundle Analysis & Identifying Bloat (Visualizer)?",
        "conceptId": "web-performance_wp_bundle_analysis_whatis"
      },
      {
        "id": "wp-bundle-analysis-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "web-performance_wp_bundle_analysis_usage"
      },
      {
        "id": "wp-bundle-analysis-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "web-performance_wp_bundle_analysis_bestpractices"
      }
    ]
  },
  {
    "id": "wp-compression-gzip-brotli",
    "subjectId": "web-performance",
    "title": "Compression: Gzip vs Brotli on Server / CDN",
    "order": 15,
    "description": "Shrinking text assets by up to 80% with modern compression algorithms.",
    "subtopics": [
      {
        "id": "wp-compression-gzip-brotli-basics",
        "title": "What is Compression?",
        "conceptId": "web-performance_wp_compression_gzip_brotli_whatis"
      },
      {
        "id": "wp-compression-gzip-brotli-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "web-performance_wp_compression_gzip_brotli_usage"
      },
      {
        "id": "wp-compression-gzip-brotli-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "web-performance_wp_compression_gzip_brotli_bestpractices"
      }
    ]
  },
  {
    "id": "wp-browser-caching",
    "subjectId": "web-performance",
    "title": "Browser Caching Strategies: Immutable Content Hashes",
    "order": 16,
    "description": "Cache-Control: max-age=31536000, immutable with chunk hash filenames.",
    "subtopics": [
      {
        "id": "wp-browser-caching-basics",
        "title": "What is Browser Caching Strategies?",
        "conceptId": "web-performance_wp_browser_caching_whatis"
      },
      {
        "id": "wp-browser-caching-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "web-performance_wp_browser_caching_usage"
      },
      {
        "id": "wp-browser-caching-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "web-performance_wp_browser_caching_bestpractices"
      }
    ]
  },
  {
    "id": "wp-memory-profiling",
    "subjectId": "web-performance",
    "title": "Memory Profiling & Heap Snapshots in Chrome DevTools",
    "order": 17,
    "description": "Finding detached DOM elements, memory retainers, and memory leaks.",
    "subtopics": [
      {
        "id": "wp-memory-profiling-basics",
        "title": "What is Memory Profiling & Heap Snapshots in Chrome DevTools?",
        "conceptId": "web-performance_wp_memory_profiling_whatis"
      },
      {
        "id": "wp-memory-profiling-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "web-performance_wp_memory_profiling_usage"
      },
      {
        "id": "wp-memory-profiling-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "web-performance_wp_memory_profiling_bestpractices"
      }
    ]
  },
  {
    "id": "wp-avoiding-layout-thrashing",
    "subjectId": "web-performance",
    "title": "Avoiding Forced Synchronous Layouts (Layout Thrashing)",
    "order": 18,
    "description": "Separating DOM reads from DOM writes in JavaScript animation loops.",
    "subtopics": [
      {
        "id": "wp-avoiding-layout-thrashing-basics",
        "title": "What is Avoiding Forced Synchronous Layouts (Layout Thrashing)?",
        "conceptId": "web-performance_wp_avoiding_layout_thrashing_whatis"
      },
      {
        "id": "wp-avoiding-layout-thrashing-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "web-performance_wp_avoiding_layout_thrashing_usage"
      },
      {
        "id": "wp-avoiding-layout-thrashing-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "web-performance_wp_avoiding_layout_thrashing_bestpractices"
      }
    ]
  },
  {
    "id": "wp-web-workers",
    "subjectId": "web-performance",
    "title": "Web Workers: Offloading Heavy Computations from Main Thread",
    "order": 19,
    "description": "Running CPU-intensive tasks on background threads without stuttering UI.",
    "subtopics": [
      {
        "id": "wp-web-workers-basics",
        "title": "What is Web Workers?",
        "conceptId": "web-performance_wp_web_workers_whatis"
      },
      {
        "id": "wp-web-workers-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "web-performance_wp_web_workers_usage"
      },
      {
        "id": "wp-web-workers-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "web-performance_wp_web_workers_bestpractices"
      }
    ]
  },
  {
    "id": "wp-performance-observer",
    "subjectId": "web-performance",
    "title": "PerformanceObserver API & Real User Monitoring (RUM)",
    "order": 20,
    "description": "Measuring real user timings and Web Vitals programmatically in production.",
    "subtopics": [
      {
        "id": "wp-performance-observer-basics",
        "title": "What is PerformanceObserver API & Real User Monitoring (RUM)?",
        "conceptId": "web-performance_wp_performance_observer_whatis"
      },
      {
        "id": "wp-performance-observer-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "web-performance_wp_performance_observer_usage"
      },
      {
        "id": "wp-performance-observer-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "web-performance_wp_performance_observer_bestpractices"
      }
    ]
  },
  {
    "id": "wp-lighthouse-audits",
    "subjectId": "web-performance",
    "title": "Automating Lighthouse Audits & Performance Budgets",
    "order": 21,
    "description": "Integrating Lighthouse CI in GitHub Actions to block regressions.",
    "subtopics": [
      {
        "id": "wp-lighthouse-audits-basics",
        "title": "What is Automating Lighthouse Audits & Performance Budgets?",
        "conceptId": "web-performance_wp_lighthouse_audits_whatis"
      },
      {
        "id": "wp-lighthouse-audits-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "web-performance_wp_lighthouse_audits_usage"
      },
      {
        "id": "wp-lighthouse-audits-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "web-performance_wp_lighthouse_audits_bestpractices"
      }
    ]
  },
  {
    "id": "wp-enterprise-performance-culture",
    "subjectId": "web-performance",
    "title": "Building an Enterprise Performance Culture",
    "order": 22,
    "description": "Setting performance SLOs, real user telemetry dashboards, and governance.",
    "subtopics": [
      {
        "id": "wp-enterprise-performance-culture-basics",
        "title": "What is Building an Enterprise Performance Culture?",
        "conceptId": "web-performance_wp_enterprise_performance_culture_whatis"
      },
      {
        "id": "wp-enterprise-performance-culture-usage",
        "title": "Practical Usage & Code Examples",
        "conceptId": "web-performance_wp_enterprise_performance_culture_usage"
      },
      {
        "id": "wp-enterprise-performance-culture-best-practices",
        "title": "Best Practices & Common Mistakes",
        "conceptId": "web-performance_wp_enterprise_performance_culture_bestpractices"
      }
    ]
  }
]
};
