import type { DocPage, SubjectMetadata } from '../types/docs.types';

export interface TopicQuizQuestion {
  id: string;
  prompt: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'intermediate' | 'difficult';
  conceptTag: string;
}

// Curated specialized questions for popular subjects & topics
const CURATED_QUIZZES: Record<string, TopicQuizQuestion[]> = {
  'react:react-intro': [
    {
      id: 'q_react_intro_1',
      prompt: 'What is the primary architectural advantage of React’s Virtual DOM and Fiber reconciler?',
      options: [
        'It directly manipulates browser layout engines faster than native C++ bindings',
        'It computes minimal diffs in memory and batches updates to prevent layout thrashing',
        'It converts JSX directly into WebAssembly binary instructions',
        'It eliminates the need for JavaScript closures in state handlers'
      ],
      correctIndex: 1,
      explanation: 'The Virtual DOM acts as an in-memory representation of UI state. The Fiber reconciler breaks reconciliation into interruptible chunks and commits changes in batch to minimize expensive browser layout calculations and repaints.',
      difficulty: 'easy',
      conceptTag: 'Reconciliation & Fiber'
    },
    {
      id: 'q_react_intro_2',
      prompt: 'Consider the code below. What is the fundamental requirement for React component functions?',
      codeSnippet: {
        language: 'jsx',
        code: `function PriceDisplay({ amount }) {\n  // What makes this a valid pure component?\n  return <span>\${amount.toFixed(2)}</span>;\n}`
      },
      options: [
        'They must return an instance of a JavaScript class',
        'They must be pure functions with respect to their props (no mutation of inputs)',
        'They must register a global event listener in window',
        'They must mutate external cache objects directly during render'
      ],
      correctIndex: 1,
      explanation: 'React expects component functions to be pure: given the same inputs (props and state), they must return the same JSX output without mutating incoming arguments or causing unpredictable side effects during the render phase.',
      difficulty: 'intermediate',
      conceptTag: 'Component Purity'
    },
    {
      id: 'q_react_intro_3',
      prompt: 'In React 19, how are Server Components (RSC) fundamentally distinguished from Client Components?',
      options: [
        'Server Components execute on server/build time, send zero JavaScript bundle to the client, and cannot use state hooks (useState)',
        'Server Components run inside a Service Worker on the browser',
        'Server Components use DOM manipulation whereas Client Components use canvas',
        'Client Components cannot receive props from Server Components'
      ],
      correctIndex: 0,
      explanation: 'React Server Components (RSC) execute exclusively on the server, have direct access to back-end resources (databases, file systems), emit a streamable JSON-like UI representation with zero JS bundle overhead, and do not support interactive state hooks.',
      difficulty: 'difficult',
      conceptTag: 'React 19 & RSC'
    }
  ],
  'css:css-intro-syntax': [
    {
      id: 'q_css_intro_1',
      prompt: 'Given the selector `#main .card > p:first-child`, what is its CSS specificity calculation?',
      options: [
        '(0, 1, 1, 2) - 1 ID, 1 class, 2 elements',
        '(0, 1, 2, 1) - 1 ID, 1 class, 1 pseudo-class, 1 element',
        '(0, 2, 0, 1) - 2 IDs, 1 element',
        '(1, 0, 0, 0) - ID always overrides everything without counting'
      ],
      correctIndex: 1,
      explanation: 'The specificity breakdown is: `#main` (1 ID = 0,1,0,0), `.card` and `:first-child` (1 class + 1 pseudo-class = 0,0,2,0), and `p` (1 element = 0,0,0,1), yielding a total specificity tuple of (0, 1, 2, 1).',
      difficulty: 'intermediate',
      conceptTag: 'CSS Specificity'
    },
    {
      id: 'q_css_intro_2',
      prompt: 'Which CSS Box Model property controls whether padding and borders are included in an element’s specified width and height?',
      options: [
        'box-sizing: border-box',
        'display: flow-root',
        'contain: layout size',
        'overflow: clip'
      ],
      correctIndex: 0,
      explanation: 'With `box-sizing: border-box`, padding and borders are absorbed inside the specified width and height, preventing layout breakage and unexpected overflow.',
      difficulty: 'easy',
      conceptTag: 'Box Model'
    },
    {
      id: 'q_css_intro_3',
      prompt: 'In modern CSS architecture, what is the role of `@layer` (Cascade Layers)?',
      options: [
        'It compresses SVG graphics into raster PNG layers',
        'It allows explicit ordering of stylesheet specificity regardless of selector weight',
        'It replaces Flexbox with native GPU shader matrices',
        'It restricts CSS execution to Safari only'
      ],
      correctIndex: 1,
      explanation: 'Cascade Layers (`@layer`) allow developers to control cascade priority independently of selector specificity. A rule in a later-declared layer always beats an earlier layer, ending selector specificity wars.',
      difficulty: 'difficult',
      conceptTag: 'Cascade Layers'
    }
  ],
  'javascript:js-closures': [
    {
      id: 'q_js_closures_1',
      prompt: 'What constitutes a JavaScript closure?',
      options: [
        'A function bundled with references to its surrounding lexical environment',
        'An anonymous function that executes immediately (IIFE) and clears all memory',
        'A syntax error thrown when a block scope lacks a closing curly brace',
        'A class method declared with the private hash prefix (#)'
      ],
      correctIndex: 0,
      explanation: 'A closure is the combination of a function bundled together with references to its lexical environment. This gives an inner function access to an outer function’s scope even after the outer function has returned.',
      difficulty: 'easy',
      conceptTag: 'Lexical Environment'
    },
    {
      id: 'q_js_closures_2',
      prompt: 'What will be output to the console when the following code runs?',
      codeSnippet: {
        language: 'javascript',
        code: `for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 10);\n}`
      },
      options: [
        '0, 1, 2',
        '3, 3, 3',
        'undefined, undefined, undefined',
        '0, 0, 0'
      ],
      correctIndex: 1,
      explanation: 'Because `var` is function-scoped (or globally scoped), all three timer callbacks close over the exact same variable `i`. By the time the event loop executes the timer callbacks, the loop has completed and `i` equals 3.',
      difficulty: 'intermediate',
      conceptTag: 'Event Loop & Scope'
    },
    {
      id: 'q_js_closures_3',
      prompt: 'How do you fix the timer loop above to print `0, 1, 2` using modern ECMAScript without an IIFE?',
      options: [
        'Replace `var i = 0` with `let i = 0` so each loop iteration creates a fresh block binding',
        'Add `await` directly before `var i = 0`',
        'Wrap the loop in `try / catch`',
        'Convert the callback into a Generator function'
      ],
      correctIndex: 0,
      explanation: '`let` creates a new lexical binding for each iteration of the `for` loop. Each setTimeout callback closes over its own distinct instance of `i`, printing 0, 1, and 2 as intended.',
      difficulty: 'easy',
      conceptTag: 'Block Scope'
    }
  ],
  'react:react-hooks': [
    {
      id: 'q_react_hooks_1',
      prompt: 'What is the primary architectural justification for the "Rules of Hooks" (calling hooks only at top-level)?',
      options: [
        'React relies on an internal linked-list / array call order across renders to match hook state to components',
        'Calling hooks in loops crashes the JavaScript V8 parser due to recursive AST generation',
        'React hooks require compile-time inline caching supported only at module scope',
        'Browser security sandbox restricts conditional execution of closures'
      ],
      correctIndex: 0,
      explanation: 'React tracks hook states as an ordered linked list attached to the Fiber node. A consistent top-level calling order guarantees React pairs state cells to the exact same hooks between consecutive render passes.',
      difficulty: 'intermediate',
      conceptTag: 'Rules of Hooks & Fiber'
    },
    {
      id: 'q_react_hooks_2',
      prompt: 'Consider the code below. Why can a stale closure occur inside the effect callback?',
      codeSnippet: {
        language: 'jsx',
        code: `useEffect(() => {\n  const id = setInterval(() => {\n    setCount(count + 1); // Bug: always increments from initial count\n  }, 1000);\n  return () => clearInterval(id);\n}, []); // Empty dependency array`
      },
      options: [
        'The closure captured `count` from the initial mount render because it was omitted from the dependency array',
        'The browser garbage collector deletes the count variable before the interval fires',
        'React Fiber executes `setInterval` inside a background Web Worker',
        'JavaScript arrow functions cannot retain access to outer function variables'
      ],
      correctIndex: 0,
      explanation: 'With an empty dependency array `[]`, the effect callback is never re-created. It permanently closes over `count` from the initial mount render (0), continuously setting `count` to 0 + 1.',
      difficulty: 'difficult',
      conceptTag: 'Stale Closures'
    },
    {
      id: 'q_react_hooks_3',
      prompt: 'When do cleanup functions returned from `useEffect` execute during the component lifecycle?',
      options: [
        'Before the effect runs again on subsequent re-renders, and immediately before the component unmounts',
        'Only once when the browser tab is closed or reloaded',
        'Synchronously before the DOM mutation phase of every render',
        'After all child component paint events and idle callbacks have completed'
      ],
      correctIndex: 0,
      explanation: 'React executes the previous effect’s cleanup before executing the effect on subsequent renders, as well as during unmounting to clean up subscriptions, timers, and abort controllers.',
      difficulty: 'easy',
      conceptTag: 'Effect Cleanup Lifecycle'
    }
  ],
  'javascript:js-event-loop': [
    {
      id: 'q_js_event_loop_1',
      prompt: 'In what exact sequence does the V8 / Browser Event Loop process task queues after the call stack clears?',
      options: [
        'Microtask Queue (Promises, queueMicrotask) completely drained -> Render/Paint -> Next single Macrotask (setTimeout, I/O) -> Microtasks drained again',
        'Macrotask Queue -> Synchronous Call Stack -> Microtask Queue',
        'Microtasks and Macrotasks run concurrently on alternating CPU threads',
        'requestAnimationFrame -> setTimeout -> Promise.then -> microtasks'
      ],
      correctIndex: 0,
      explanation: 'The call stack executes synchronously. Once cleared, the runtime drains all microtasks (including microtasks queued by other microtasks) before executing rendering steps or picking the next macrotask.',
      difficulty: 'difficult',
      conceptTag: 'Event Loop Task Phases'
    },
    {
      id: 'q_js_event_loop_2',
      prompt: 'What will be output to the console when the following snippet executes?',
      codeSnippet: {
        language: 'javascript',
        code: `console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');`
      },
      options: [
        '1, 4, 3, 2',
        '1, 2, 3, 4',
        '1, 4, 2, 3',
        '1, 3, 4, 2'
      ],
      correctIndex: 0,
      explanation: 'Synchronous code runs first (1, 4). The microtask queue is then drained before macrotasks (Promise -> 3). Finally, the timer macrotask is dequeued and executed (2).',
      difficulty: 'easy',
      conceptTag: 'Microtask vs Macrotask'
    },
    {
      id: 'q_js_event_loop_3',
      prompt: 'What architectural hazard arises if a microtask recursively queues another microtask indefinitely (`function loop() { Promise.resolve().then(loop); }`)?',
      options: [
        'Event loop starvation: macrotasks (timers, UI clicks, keyboard events) and layout rendering can never execute, freezing the UI',
        'The browser converts the microtasks into background Web Workers automatically',
        'The Call Stack throws an immediate `RangeError: Maximum call stack size exceeded`',
        'The event loop switches to round-robin execution after 50 iterations'
      ],
      correctIndex: 0,
      explanation: 'Because the event loop must completely empty the microtask queue before yielding to the rendering pipeline or macrotask queue, recursive microtasks starve the event loop, freezing the browser tab.',
      difficulty: 'intermediate',
      conceptTag: 'Event Loop Starvation'
    }
  ],
  'typescript:ts-generics': [
    {
      id: 'q_ts_generics_1',
      prompt: 'In TypeScript, what does the `infer` keyword achieve inside conditional types?',
      options: [
        'It introduces a type variable within a conditional clause to be deduced dynamically from the examined type',
        'It forces TypeScript to infer runtime JavaScript variable types without compilation',
        'It disables strict null checks for the enclosed interface',
        'It casts `any` into `never` at runtime'
      ],
      correctIndex: 0,
      explanation: '`infer R` allows TypeScript to extract and introduce a type parameter from another composite type within the `extends` clause of a conditional type (e.g. `T extends Promise<infer U> ? U : T`).',
      difficulty: 'difficult',
      conceptTag: 'Conditional Types & Infer'
    },
    {
      id: 'q_ts_generics_2',
      prompt: 'How do you constrain a generic type parameter `T` to ensure it possesses an `id: string` property?',
      options: [
        '<T extends { id: string }>',
        '<T implements { id: string }>',
        '<T typeof { id: string }>',
        '<T instanceOf { id: string }>'
      ],
      correctIndex: 0,
      explanation: 'The `extends` keyword on generic type parameters acts as a type constraint, enforcing that any type passed as `T` must satisfy the structural contract `{ id: string }`.',
      difficulty: 'easy',
      conceptTag: 'Generic Constraints'
    }
  ],
  'system-design:sd-architecture': [
    {
      id: 'q_sd_arch_1',
      prompt: 'What is the fundamental difference between Latency and Throughput in system architecture?',
      options: [
        'Latency is the time taken to process a single request; Throughput is the number of requests processed per unit time',
        'Latency measures network bandwidth; Throughput measures CPU clock speed',
        'Latency only applies to client-side rendering; Throughput only applies to databases',
        'Latency and Throughput are identical metrics measured in milliseconds'
      ],
      correctIndex: 0,
      explanation: 'Latency measures response delay for an individual unit of work (e.g., 45ms per request), whereas Throughput measures system capacity over time (e.g., 10,000 requests per second).',
      difficulty: 'easy',
      conceptTag: 'System Metrics'
    },
    {
      id: 'q_sd_arch_2',
      prompt: 'According to the CAP Theorem, what tradeoff must a distributed system make when a network partition (P) occurs?',
      options: [
        'It must choose between Consistency (C) or Availability (A); it cannot guarantee both during a partition',
        'It can guarantee both Consistency and Availability by enabling cloud replication',
        'It must sacrifice Partition Tolerance in order to preserve Performance',
        'It must shut down all server nodes immediately'
      ],
      correctIndex: 0,
      explanation: 'When network partitions occur between nodes, a distributed system must either reject writes (sacrificing Availability) or allow nodes to become temporarily divergent (sacrificing Consistency).',
      difficulty: 'intermediate',
      conceptTag: 'CAP Theorem'
    }
  ]
};

class DocsTopicQuizService {
  /**
   * Generates a 3-4 question mastery assessment for any documentation page.
   * If curated questions exist, returns those; otherwise, derives high-signal
   * questions from the page's questions, sections, and common mistakes.
   */
  getQuizForTopic(doc: DocPage, _subject?: SubjectMetadata): TopicQuizQuestion[] {
    const key = `${doc.subjectId}:${doc.topicId}`;
    if (CURATED_QUIZZES[key]) {
      return CURATED_QUIZZES[key];
    }

    // Dynamic generation from DocPage content & questions
    const generated: TopicQuizQuestion[] = [];

    // 1. Generate from interview questions if available
    if (doc.questions && doc.questions.length > 0) {
      doc.questions.slice(0, 2).forEach((q, idx) => {
        // Create plausible distractor answers from other questions or context
        const distractors = this.generateDistractors(q.shortAnswer, doc.title);
        const options = [q.shortAnswer, ...distractors].sort(() => 0.5 - Math.random());
        const correctIndex = options.indexOf(q.shortAnswer);

        generated.push({
          id: `dyn_q_${idx}_${doc.topicId}`,
          prompt: q.question,
          codeSnippet: q.code ? {
            language: q.code.language,
            code: q.code.snippet,
          } : undefined,
          options,
          correctIndex,
          explanation: q.detailedAnswer || q.explanation,
          difficulty: q.difficulty,
          conceptTag: q.tags[0] || doc.title,
        });
      });
    }

    // 2. Generate from Why It Matters or Overview
    if (doc.whyItMatters && generated.length < 3) {
      const prompt = `Why is understanding ${doc.title} critical in high-scale frontend engineering?`;
      const correctAnswer = doc.whyItMatters.split('. ')[0] + '.';
      const distractors = [
        `It is purely legacy syntax and should be avoided in modern build systems.`,
        `It only impacts CSS animations and has zero effect on JavaScript execution or memory.`,
        `It is an optional experimental flag in Chrome and unsupported in production.`
      ];
      const options = [correctAnswer, ...distractors].sort(() => 0.5 - Math.random());

      generated.push({
        id: `dyn_matters_${doc.topicId}`,
        prompt,
        options,
        correctIndex: options.indexOf(correctAnswer),
        explanation: doc.whyItMatters,
        difficulty: 'intermediate',
        conceptTag: 'Architecture & Trade-offs',
      });
    }

    // 3. Generate from Common Mistakes if available
    if (doc.commonMistakes && doc.commonMistakes.length > 0 && generated.length < 3) {
      const mistake = doc.commonMistakes[0];
      const prompt = `Which of the following is a common architectural pitfall when working with ${doc.title}?`;
      const correctAnswer = mistake;
      const distractors = [
        `Writing TypeScript interfaces with explicit return types`,
        `Using semantic HTML elements instead of unstyled generic divs`,
        `Employing memoization on expensive derived computations`
      ];
      const options = [correctAnswer, ...distractors].sort(() => 0.5 - Math.random());

      generated.push({
        id: `dyn_mistake_${doc.topicId}`,
        prompt,
        options,
        correctIndex: options.indexOf(correctAnswer),
        explanation: `Watch out for: ${mistake}. Always verify specifications and edge-case behavior during technical interviews.`,
        difficulty: 'difficult',
        conceptTag: 'Gotchas & Edge Cases',
      });
    }

    // Fallback if needed
    if (generated.length === 0) {
      generated.push({
        id: `fallback_${doc.topicId}`,
        prompt: `What is the core takeaway regarding ${doc.title}?`,
        options: [
          doc.overview.slice(0, 100) + '...',
          'It has been completely superseded and deprecated in modern web standards.',
          'It should only be used inside backend Node.js microservices.',
          'It requires jQuery to function properly in modern browsers.'
        ],
        correctIndex: 0,
        explanation: doc.overview,
        difficulty: 'easy',
        conceptTag: doc.title,
      });
    }

    return generated;
  }

  private generateDistractors(_answer: string, _topicTitle: string): string[] {
    return [
      `It bypasses the browser JavaScript runtime and operates exclusively on native operating system threads.`,
      `It automatically reloads the entire HTML document whenever any local variable is updated.`,
      `It requires disabling all strict mode linting and TypeScript compiler checks to operate properly.`
    ];
  }
}

export const docsTopicQuizService = new DocsTopicQuizService();
