import type { SubjectId, DocPage, InterviewQuestion, DocPageSection } from '../types/docs.types';
import { ALL_SUBJECTS_CATALOG, TOPICS_BY_SUBJECT } from './subjectsCatalog';
import { resolveTopicVideos } from './videoRegistry';

/**
 * Simple, W3Schools / MDN Web Docs-style documentation and interview question synthesizer.
 * Generates clear, beginner-friendly explanations ("What is it?", "Key Features", syntax, code examples,
 * common mistakes, and practical interview questions) with authentic, runnable code snippets across all 21 tracks.
 */
export function getSynthesizedDocPage(subjectId: SubjectId, topicId: string): DocPage | undefined {
  const subject = ALL_SUBJECTS_CATALOG.find(s => s.id === subjectId);
  const topicsList = TOPICS_BY_SUBJECT[subjectId] || [];
  const topicMeta = topicsList.find(t => t.id === topicId);

  if (!subject || !topicMeta) return undefined;

  // Resolve authentic, highly-relevant video tutorials & curated playlist
  const { primaryVideo, videoList } = resolveTopicVideos(
    subjectId,
    topicId,
    topicMeta.title,
    topicMeta.subtopics
  );

  // Generate subtopic sections in W3Schools / MDN simple style
  const sections: DocPageSection[] = topicMeta.subtopics.map((sub, index) => {
    return {
      id: sub.id,
      heading: `${index + 1}. ${sub.title}`,
      content: generateSubtopicContent(subjectId, topicMeta.title, sub.title, topicMeta.description),
      codeSnippet: generateSubtopicCodeSnippet(subjectId, topicMeta.title, sub.title, topicMeta.id),
    };
  });

  // Generate 3 tiered interview questions (Easy, Intermediate, Difficult)
  const questions: InterviewQuestion[] = generateInterviewQuestions(subjectId, topicMeta);

  return {
    subjectId,
    topicId,
    title: topicMeta.title,
    description: topicMeta.description,
    overview: generateTopicOverview(subject.title, subject.category, topicMeta.title, topicMeta.description),
    whyItMatters: generateWhyItMatters(subject.title, topicMeta.title),
    howItWorks: generateHowItWorks(subjectId, topicMeta.title),
    syntaxReference: generateSyntaxReference(subjectId, topicMeta.title),
    sections,
    commonMistakes: generateCommonMistakes(subjectId, topicMeta.title),
    video: primaryVideo,
    videoList,
    questions,
    relatedTopics: topicsList
      .filter(t => t.id !== topicId)
      .slice(0, 3)
      .map(t => ({
        subjectId,
        topicId: t.id,
        title: t.title,
      })),
  };
}

function generateTopicOverview(subjectTitle: string, category: string, topicTitle: string, description: string): string {
  return `### What is ${topicTitle}?
**${topicTitle}** is a core topic in **${subjectTitle}** (${category}).

${description}

### Key Features & Why Web Developers Use It
- **Industry Standard**: Essential topic frequently asked in technical interviews and used in real-world development.
- **Clean & Maintainable**: Helps write clean, predictable code that is easy to read, test, and debug.
- **Optimized Execution**: Follows standard platform best practices for fast runtime performance and responsive UIs.
- **Reliable Architecture**: Prevents common runtime bugs, state inconsistencies, and memory leaks.`;
}

function generateWhyItMatters(subjectTitle: string, topicTitle: string): string {
  return `### Why Does ${topicTitle} Matter in ${subjectTitle}?

- **Easy to Understand**: Provides simple, standard conventions to solve practical development challenges.
- **Cleaner Codebase**: Eliminates redundant workarounds, making components and modules straightforward for teams to collaborate on.
- **Great User Experience**: Ensures smooth rendering, low latency, and consistent behavior across mobile and desktop browsers.
- **High-Yield Interview Signal**: Demonstrating practical mastery of ${topicTitle} signals strong technical foundations to interviewers.`;
}

function generateHowItWorks(subjectId: SubjectId, _topicTitle: string): string {
  switch (subjectId) {
    case 'react':
    case 'advanced-react':
      return `### How It Works in React (Step-by-Step)
1. **Component Initialization**: React mounts the component and executes the component function with initial props and state.
2. **Virtual DOM & Fiber**: React constructs a Virtual DOM tree node representing the current UI declaration.
3. **Reconciliation & Diffing**: When state or props change, React diffs the new element tree against the previous Fiber tree.
4. **Commit Phase**: React commits minimal DOM mutations to the browser DOM, ensuring smooth 60fps rendering.`;

    case 'css':
    case 'advanced-css':
    case 'tailwind':
      return `### How the Browser Renders It (Step-by-Step)
1. **Parsing & CSSOM**: The browser parses stylesheets and compiles the CSS Object Model (CSSOM).
2. **Cascade & Specificity Calculation**: Specificity weights and cascade layers determine which style declaration wins.
3. **Layout Calculation (Reflow)**: The browser calculates exact geometry (box dimensions, flex/grid positions) for each element.
4. **Painting & Compositing**: Pixels are rasterized and pushed to GPU layers for smooth rendering without layout shifts.`;

    case 'javascript':
    case 'es6':
      return `### How the JavaScript Engine Executes It (Step-by-Step)
1. **Creation Phase**: The V8/JavaScript engine sets up the execution context, binds lexical scopes, and hoists declarations.
2. **Execution Phase**: Code executes sequentially on the single main thread, allocating memory on the heap and tracking call frames on the stack.
3. **Event Loop & Microtask Queue**: Synchronous code completes first, followed by microtasks (Promises, queueMicrotask), then macrotasks (setTimeout, DOM events).
4. **Garbage Collection**: Unreferenced memory allocations are automatically reclaimed by mark-and-sweep garbage collection.`;

    case 'typescript':
      return `### How TypeScript Processes It (Step-by-Step)
1. **Static Analysis & Type Checking**: The TypeScript compiler (\`tsc\`) checks types, interfaces, and generic constraints at build time.
2. **Type Inference**: TypeScript infers return types and variable signatures without requiring redundant boilerplate.
3. **Type Erasure**: All type annotations, interfaces, and type aliases are erased during compilation.
4. **Clean JavaScript Output**: Standard, clean ECMAScript is emitted for execution in Node.js or any browser engine.`;

    case 'http':
    case 'restful-apis':
    case 'websockets':
    case 'webhooks':
      return `### How the Network Protocol Works (Step-by-Step)
1. **Connection & Handshake**: The client initiates a TCP/TLS handshake to the server endpoint.
2. **Request Packaging**: Headers, HTTP method, authentication tokens, and request body are serialized.
3. **Server Processing**: The server routes the request, performs authentication and validation, and queries the database.
4. **Response Delivery**: The server returns an HTTP status code, response headers (caching, CORS), and JSON payload.`;

    default:
      return `### Step-by-Step Mechanics
1. **Declaration**: You declare clean, standard-compliant code in your application.
2. **Parsing & Initialization**: The runtime parses instructions and configures internal state.
3. **Execution**: Logic runs deterministically, handling user inputs, network requests, or UI updates.
4. **Output & Teardown**: Resources update cleanly and any listeners or subscriptions are disposed on teardown.`;
  }
}

function generateSubtopicContent(
  _subjectId: SubjectId,
  topicTitle: string,
  subtopicTitle: string,
  topicDesc: string
): string {
  return `### What is ${subtopicTitle}?
**${subtopicTitle}** is an essential subtopic of **${topicTitle}**.

${topicDesc}

#### Core Principles & How to Use It
1. **Clear Purpose**: Solves common web development requirements using standard, modern syntax.
2. **Practical Implementation**: Easy to integrate into modern web projects without unnecessary boilerplate or overhead.
3. **Production Best Practice**: Always write clean, self-documenting code with clear variable names and proper error handling.

> 💡 **Interview Tip**: In interviews, explain *what problem* this solves, walk the interviewer through a clean working code snippet, and highlight potential pitfalls you actively avoid.`;
}

function generateSyntaxReference(subjectId: SubjectId, topicTitle: string): string {
  switch (subjectId) {
    case 'react':
    case 'advanced-react':
      return `// React Syntax Example: ${topicTitle}
import React, { useState, useEffect } from 'react';

interface ComponentProps {
  title: string;
  initialCount?: number;
}

export function CounterCard({ title, initialCount = 0 }: ComponentProps) {
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    document.title = \`\${title}: \${count}\`;
  }, [title, count]);

  return (
    <div className="card">
      <h3>{title}</h3>
      <p>Current count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}`;

    case 'css':
    case 'advanced-css':
      return `/* CSS Syntax Example: ${topicTitle} */
.container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--surface, #ffffff);
  border-radius: 8px;
  border: 1px solid var(--border, #e2e8f0);
}

@media (min-width: 768px) {
  .container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}`;

    case 'tailwind':
      return `<!-- Tailwind CSS Syntax: ${topicTitle} -->
<div class="flex flex-col md:grid md:grid-cols-2 gap-6 p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
  <div class="space-y-2">
    <h3 class="text-lg font-semibold text-slate-900 dark:text-white">${topicTitle}</h3>
    <p class="text-sm text-slate-600 dark:text-slate-400">Utility-first styling with responsive modifiers.</p>
  </div>
</div>`;

    case 'javascript':
    case 'es6':
      return `// JavaScript / ES6 Syntax Example: ${topicTitle}
export async function fetchData(endpoint) {
  try {
    const response = await fetch(endpoint, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Fetch failed:', error.message);
    return { success: false, error: error.message };
  }
}`;

    case 'typescript':
      return `// TypeScript Syntax Example: ${topicTitle}
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

export function formatUser<T extends UserProfile>(user: T): string {
  return \`[\${user.role.toUpperCase()}] \${user.name} (\${user.email})\`;
}`;

    case 'nextjs':
      return `// Next.js App Router Syntax: ${topicTitle}
// app/dashboard/page.tsx (Server Component by default)
import React from 'react';

interface PageProps {
  searchParams: Promise<{ query?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { query } = await searchParams;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">${topicTitle}</h1>
      <p>Search query: {query || 'All items'}</p>
    </main>
  );
}`;

    case 'redux':
    case 'redux-toolkit':
      return `// Redux Toolkit Syntax: ${topicTitle}
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface State {
  items: string[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: State = { items: [], status: 'idle' };

export const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<string>) => {
      // Immer allows direct mutations safely
      state.items.push(action.payload);
    },
    clearItems: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, clearItems } = exampleSlice.actions;
export default exampleSlice.reducer;`;

    case 'tanstack-query':
      return `// TanStack Query (React Query) Syntax: ${topicTitle}
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useItemsData() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const res = await fetch('/api/items');
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
  });

  const mutation = useMutation({
    mutationFn: (newItem: { name: string }) =>
      fetch('/api/items', { method: 'POST', body: JSON.stringify(newItem) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  return { ...query, addItem: mutation.mutate };
}`;

    case 'react-router':
      return `// React Router DOM Data API Syntax: ${topicTitle}
import { createBrowserRouter, RouterProvider, Outlet, Link, useParams } from 'react-router-dom';

function RootLayout() {
  return (
    <div>
      <nav><Link to="/">Home</Link> | <Link to="/items">Items</Link></nav>
      <Outlet />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { path: 'items/:id', element: <ItemDetail /> },
    ],
  },
]);`;

    case 'http':
    case 'restful-apis':
      return `// RESTful API Request Example: ${topicTitle}
export async function makeApiCall(url: string, payload: Record<string, unknown>) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN_HERE',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || \`Request failed with status \${response.status}\`);
  }

  return response.json();
}`;

    case 'websockets':
      return `// WebSocket Client Syntax: ${topicTitle}
export class RealtimeClient {
  private ws: WebSocket | null = null;

  connect(url: string) {
    this.ws = new WebSocket(url);

    this.ws.onopen = () => console.log('WebSocket connection opened');
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received:', message);
    };
    this.ws.onclose = () => console.log('WebSocket closed');
    this.ws.onerror = (err) => console.error('WebSocket error:', err);
  }

  send(data: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}`;

    default:
      return `// Syntax Example: ${topicTitle}
export interface StandardConfig {
  title: string;
  enabled: boolean;
  options?: Record<string, unknown>;
}

export function executeStandardPattern(config: StandardConfig): boolean {
  if (!config.enabled) return false;
  console.log('Initialized:', config.title);
  return true;
}`;
  }
}

function getTopicSpecificSnippet(
  _subjectId: SubjectId,
  topicId: string,
  _topicTitle: string,
  subtopicTitle: string
): { language: string; code: string; filename?: string; caption?: string } | null {
  const tid = topicId.toLowerCase();

  // JavaScript: Closures & Lexical Scope
  if (tid.includes('closure') || tid.includes('lexical')) {
    return {
      language: 'javascript',
      filename: 'closures-demo.js',
      code: `// JavaScript Closures & Lexical Scope: ${subtopicTitle}
// A closure is a function bundled together with references to its surrounding state.

export function createSecureVault(initialSecret) {
  let secretKey = initialSecret; // Encapsulated in private lexical scope

  return {
    validateKey(candidate) {
      return candidate === secretKey;
    },
    updateKey(oldKey, newKey) {
      if (oldKey === secretKey) {
        secretKey = newKey;
        return true;
      }
      return false;
    },
  };
}

// Example usage:
const vault = createSecureVault('super-secret-token');
console.log(vault.validateKey('wrong-token')); // false
console.log(vault.validateKey('super-secret-token')); // true
// secretKey is completely inaccessible directly from outside:
console.log(vault.secretKey); // undefined`,
      caption: `Demonstrates lexical scoping and private state encapsulation via closures.`,
    };
  }

  // JavaScript: Event Loop, Microtasks & Macrotasks
  if (tid.includes('event-loop') || tid.includes('microtask') || tid.includes('macrotask')) {
    return {
      language: 'javascript',
      filename: 'event-loop-order.js',
      code: `// Event Loop & Concurrency Model: ${subtopicTitle}
// Execution priority: Synchronous Code -> Microtask Queue -> Macrotask Queue

console.log('1. Synchronous Execution Starts');

// Macrotask (scheduled by browser timer API)
setTimeout(() => {
  console.log('5. Macrotask (setTimeout 0ms callback executed)');
}, 0);

// Microtask 1 (scheduled via Promise resolution)
Promise.resolve().then(() => {
  console.log('3. Microtask (Promise .then resolution)');
}).then(() => {
  console.log('4. Chained Microtask (runs before any macrotask)');
});

// Microtask 2 (scheduled via queueMicrotask)
queueMicrotask(() => {
  console.log('3b. Microtask (queueMicrotask callback)');
});

console.log('2. Synchronous Execution Ends');

// Expected Output Order:
// 1. Synchronous Execution Starts
// 2. Synchronous Execution Ends
// 3. Microtask (Promise .then resolution)
// 3b. Microtask (queueMicrotask callback)
// 4. Chained Microtask
// 5. Macrotask (setTimeout 0ms)`,
      caption: `Demonstrates exact microtask vs macrotask execution order in the V8 engine.`,
    };
  }

  // JavaScript: Prototypal Inheritance
  if (tid.includes('prototype') || tid.includes('inheritance')) {
    return {
      language: 'javascript',
      filename: 'prototypal-chain.js',
      code: `// Prototypal Inheritance & Prototype Delegation: ${subtopicTitle}

function Employee(name, department) {
  this.name = name;
  this.department = department;
}

// Method shared via prototype object (O(1) memory footprint across all instances)
Employee.prototype.getDetails = function() {
  return \`\${this.name} works in \${this.department}\`;
};

function SeniorEngineer(name, department, techStack) {
  Employee.call(this, name, department); // Call parent constructor
  this.techStack = techStack;
}

// Establish prototype delegation link: SeniorEngineer.prototype.__proto__ === Employee.prototype
SeniorEngineer.prototype = Object.create(Employee.prototype);
SeniorEngineer.prototype.constructor = SeniorEngineer;

SeniorEngineer.prototype.leadSystemDesign = function() {
  return \`\${this.name} is leading architecture in \${this.techStack.join(', ')}\`;
};

const staffLead = new SeniorEngineer('Jordan', 'Infrastructure', ['React', 'TypeScript', 'Node']);
console.log(staffLead.getDetails()); // Delegated up to Employee.prototype
console.log(staffLead.leadSystemDesign()); // Found directly on SeniorEngineer.prototype
console.log(staffLead instanceof Employee); // true`,
      caption: `Prototype chain delegation and constructor linking pattern.`,
    };
  }

  // TypeScript: Advanced Types & Generics
  if (tid.includes('conditional') || tid.includes('infer') || tid.includes('mapped') || tid.includes('utility') || tid.includes('generic')) {
    return {
      language: 'typescript',
      filename: 'type-system.ts',
      code: `// TypeScript Advanced Type System: ${subtopicTitle}

// 1. Recursive Deep Readonly using Mapped Types
export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Function
    ? T[K]
    : T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};

// 2. Conditional Type with "infer" keyword to unwrap nested Promises
export type AwaitNested<T> = T extends Promise<infer Inner> ? AwaitNested<Inner> : T;

// 3. Template Literal Types for URL Route Parameter Extraction
export type ExtractParams<Path extends string> =
  Path extends \`\${string}:\${infer Param}/\${infer Rest}\`
    ? Param | ExtractParams<\`/\${Rest}\`>
    : Path extends \`\${string}:\${infer Param}\`
    ? Param
    : never;

// Test type evaluation:
type RouteParams = ExtractParams<'/api/v1/tracks/:trackId/topics/:topicId'>;
// Evaluates at compile time to: "trackId" | "topicId"`,
      caption: `Production conditional types and template literal utilities.`,
    };
  }

  // React: useEffect & Lifecycle
  if (tid.includes('useeffect') || tid.includes('lifecycle')) {
    return {
      language: 'typescript',
      filename: 'useCandidateProfile.ts',
      code: `// React useEffect Lifecycle & Cleanup: ${subtopicTitle}
import { useState, useEffect } from 'react';

export function useCandidateProfile(candidateId: string) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // AbortController pattern to eliminate race conditions on parameter changes
    const controller = new AbortController();
    setLoading(true);

    async function loadData() {
      try {
        const res = await fetch(\`/api/candidates/\${candidateId}\`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(\`Server returned \${res.status}\`);
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unknown network error');
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();

    // Critical: Cleanup function runs when candidateId changes or component unmounts
    return () => {
      controller.abort();
    };
  }, [candidateId]); // Exhaustive dependencies rule

  return { data, error, loading };
}`,
      caption: `Demonstrates AbortController cleanup in useEffect to prevent race conditions.`,
    };
  }

  // React: Virtual DOM & Reconciliation
  if (tid.includes('virtual-dom') || tid.includes('reconciliation')) {
    return {
      language: 'typescript',
      filename: 'FiberReconciliation.tsx',
      code: `// React Virtual DOM Reconciliation: ${subtopicTitle}
import React, { useState } from 'react';

interface CandidateMetric {
  id: string; // Unique stable key
  label: string;
  score: number;
}

export function MetricReconciliationList() {
  const [metrics, setMetrics] = useState<CandidateMetric[]>([
    { id: 'm1', label: 'Algorithms & DSA', score: 94 },
    { id: 'm2', label: 'System Design', score: 88 },
  ]);

  const prependMetric = () => {
    // Prepending an item demonstrates why stable keys (not array indexes) are required
    const newItem: CandidateMetric = {
      id: \`m_\${Date.now()}\`,
      label: 'Core JavaScript V8',
      score: 96,
    };
    setMetrics(prev => [newItem, ...prev]);
  };

  return (
    <div className="p-4 bg-slate-900 text-white rounded-xl">
      <button
        onClick={prependMetric}
        className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-500 mb-4"
      >
        Prepend Metric (Tests Key Reconciliation)
      </button>

      <ul className="space-y-2">
        {metrics.map(metric => (
          // Invariant: Never use array index as key when list order can change
          <li key={metric.id} className="p-3 bg-slate-800 rounded-lg flex justify-between">
            <span>{metric.label}</span>
            <span className="font-bold text-emerald-400">{metric.score}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
      caption: `Demonstrates stable keys during Virtual DOM diffing and Fiber reconciliation.`,
    };
  }

  return null;
}

function generateSubtopicCodeSnippet(
  subjectId: SubjectId,
  topicTitle: string,
  subtopicTitle: string,
  topicId: string
): { language: string; code: string; filename?: string; caption?: string } {
  // Topic-specific tailored production patterns
  const tailored = getTopicSpecificSnippet(subjectId, topicId, topicTitle, subtopicTitle);
  if (tailored) return tailored;

  switch (subjectId) {
    case 'react':
    case 'advanced-react':
      return {
        language: 'typescript',
        filename: `${topicId}-example.tsx`,
        code: `// React Practical Example: ${subtopicTitle}
import React, { useState, useCallback } from 'react';

export function ExampleComponent() {
  const [value, setValue] = useState<string>('');
  const [items, setItems] = useState<string[]>([]);

  const handleAdd = useCallback(() => {
    if (!value.trim()) return;
    setItems(prev => [...prev, value.trim()]);
    setValue('');
  }, [value]);

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h4 className="font-semibold text-lg mb-2">${subtopicTitle}</h4>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Enter item name..."
          className="border px-3 py-1.5 rounded flex-1"
        />
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-700"
        >
          Add
        </button>
      </div>
      <ul className="list-disc pl-5 space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-gray-700">{item}</li>
        ))}
      </ul>
    </div>
  );
}`,
        caption: `Practical React component implementation demonstrating ${subtopicTitle}`,
      };

    case 'css':
    case 'advanced-css':
      return {
        language: 'css',
        filename: 'styles.css',
        code: `/* Practical CSS: ${subtopicTitle} */
.feature-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem;
  border-radius: 12px;
  background-color: var(--surface-bg, #ffffff);
  border: 1px solid var(--border-color, #e2e8f0);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
}`,
        caption: `Clean, modern CSS rules demonstrating ${subtopicTitle}`,
      };

    case 'tailwind':
      return {
        language: 'html',
        filename: 'Card.html',
        code: `<!-- Tailwind CSS: ${subtopicTitle} -->
<div class="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-md overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300">
  <div class="p-6">
    <div class="uppercase tracking-wide text-xs text-indigo-500 font-bold mb-1">${topicTitle}</div>
    <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">${subtopicTitle}</h3>
    <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
      Tailwind provides instant utility classes for responsive, dark-mode ready interfaces.
    </p>
    <button class="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition">
      Explore Subtopic
    </button>
  </div>
</div>`,
        caption: `Responsive Tailwind utility component for ${subtopicTitle}`,
      };

    case 'javascript':
    case 'es6':
      return {
        language: 'javascript',
        filename: 'solution.js',
        code: `// JavaScript / ES6: ${subtopicTitle}
export function processDataList(items, options = {}) {
  const { minLength = 3, transform = str => str.trim() } = options;

  // Filter, transform, and deduplicate using modern ES6+ features
  const cleaned = items
    .filter(item => typeof item === 'string' && item.length >= minLength)
    .map(item => transform(item));

  const uniqueSet = new Set(cleaned);
  return Array.from(uniqueSet);
}

// Example usage:
const rawInput = ['  react  ', 'vue', '  react  ', 'angular', 'ts'];
const result = processDataList(rawInput);
console.log('Result:', result); // ['react', 'angular']`,
        caption: `Clean ES6+ function demonstrating ${subtopicTitle}`,
      };

    case 'typescript':
      return {
        language: 'typescript',
        filename: 'types.ts',
        code: `// TypeScript: ${subtopicTitle}
export interface BaseEntity {
  id: string;
  createdAt: Date;
}

export interface ProductItem extends BaseEntity {
  name: string;
  price: number;
  tags: string[];
}

// Generic repository type with clean constraints
export class EntityStore<T extends BaseEntity> {
  private items = new Map<string, T>();

  add(item: T): void {
    this.items.set(item.id, item);
  }

  getById(id: string): T | undefined {
    return this.items.get(id);
  }

  getAll(): T[] {
    return Array.from(this.items.values());
  }
}`,
        caption: `Type-safe TypeScript generics and interfaces for ${subtopicTitle}`,
      };

    case 'nextjs':
      return {
        language: 'typescript',
        filename: 'action.ts',
        code: `// Next.js Server Action / Server Component: ${subtopicTitle}
'use server';

import { revalidatePath } from 'next/cache';

export async function submitUserFeedback(formData: FormData) {
  const feedback = formData.get('feedback')?.toString();

  if (!feedback || feedback.length < 5) {
    return { success: false, error: 'Feedback must be at least 5 characters long.' };
  }

  // Perform database write securely on the server
  console.log('Saving feedback on server:', feedback);

  // Revalidate the cached page route instantly
  revalidatePath('/dashboard');
  return { success: true };
}`,
        caption: `Next.js App Router Server Action pattern for ${subtopicTitle}`,
      };

    case 'redux':
    case 'redux-toolkit':
      return {
        language: 'typescript',
        filename: 'slice.ts',
        code: `// Redux Toolkit: ${subtopicTitle}
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
  return (await response.json()) as { id: number; title: string }[];
});

export const postsSlice = createSlice({
  name: 'posts',
  initialState: { list: [] as { id: number; title: string }[], loading: false },
  reducers: {
    removePost(state, action: PayloadAction<number>) {
      state.list = state.list.filter(p => p.id !== action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPosts.pending, state => { state.loading = true; })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      });
  },
});`,
        caption: `Redux Toolkit slice with async thunk for ${subtopicTitle}`,
      };

    case 'tanstack-query':
      return {
        language: 'typescript',
        filename: 'useUserQuery.ts',
        code: `// TanStack Query: ${subtopicTitle}
import { useQuery } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
  email: string;
}

export function useUserProfile(userId: number) {
  return useQuery<User>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const res = await fetch(\`/api/users/\${userId}\`);
      if (!res.ok) throw new Error('User not found');
      return res.json();
    },
    staleTime: 1000 * 60 * 10, // 10 minutes cache freshness
    retry: 2,
  });
}`,
        caption: `TanStack Query hook with custom queryKey and caching for ${subtopicTitle}`,
      };

    case 'http':
    case 'restful-apis':
      return {
        language: 'javascript',
        filename: 'apiClient.js',
        code: `// REST / HTTP Request: ${subtopicTitle}
export async function apiRequest(endpoint, { method = 'GET', body = null } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('auth_token');
  if (token) headers['Authorization'] = \`Bearer \${token}\`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const response = await fetch(endpoint, config);

  if (response.status === 401) {
    // Handle unauthorized session expiration
    window.location.href = '/login';
    return null;
  }

  if (!response.ok) {
    throw new Error(\`Request to \${endpoint} failed with HTTP \${response.status}\`);
  }

  return response.json();
}`,
        caption: `Production-ready HTTP fetch client for ${subtopicTitle}`,
      };

    case 'websockets':
    case 'webhooks':
      return {
        language: 'typescript',
        filename: 'realtimeHandler.ts',
        code: `// Real-Time & Webhooks: ${subtopicTitle}
export function createWebSocketConnection(endpointUrl: string, onMessage: (data: unknown) => void) {
  let socket: WebSocket;
  let heartbeatTimer: any;

  function init() {
    socket = new WebSocket(endpointUrl);

    socket.onopen = () => {
      console.log('Real-time connection established');
      // Keep alive heartbeat ping every 30 seconds
      heartbeatTimer = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'ping' }));
        }
      }, 30000);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type !== 'pong') {
        onMessage(data);
      }
    };

    socket.onclose = () => {
      clearInterval(heartbeatTimer);
      // Auto-reconnect with 3s backoff
      setTimeout(init, 3000);
    };
  }

  init();
}`,
        caption: `Robust WebSocket client with keepalive heartbeat for ${subtopicTitle}`,
      };

    case 'web-performance':
      return {
        language: 'typescript',
        filename: 'performanceObserver.ts',
        code: `// Web Performance Optimization: ${subtopicTitle}
export function observeLargestContentfulPaint(onReport: (metric: number) => void) {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  const observer = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    if (lastEntry) {
      onReport(lastEntry.startTime);
    }
  });

  observer.observe({ type: 'largest-contentful-paint', buffered: true });
}`,
        caption: `Core Web Vitals monitoring implementation for ${subtopicTitle}`,
      };

    default:
      return {
        language: 'typescript',
        filename: 'implementation.ts',
        code: `// Practical Example: ${subtopicTitle}
export interface UserActionConfig {
  id: string;
  name: string;
  enabled: boolean;
}

export function executeAction(config: UserActionConfig): string {
  if (!config.enabled) {
    return \`Action \${config.name} is disabled.\`;
  }
  return \`Action \${config.name} executed successfully.\`;
}`,
        caption: `Working code implementation for ${subtopicTitle}`,
      };
  }
}

function generateCommonMistakes(subjectId: SubjectId, _topicTitle: string): string[] {
  switch (subjectId) {
    case 'react':
    case 'advanced-react':
      return [
        `Mutating state variables directly instead of using the state updater function.`,
        `Omitting dependencies from useEffect or useCallback dependency arrays, causing stale closures.`,
        `Using array indexes as the key prop on dynamically filtered or reordered lists.`,
        `Triggering side effects directly in the component render phase instead of in useEffect or event handlers.`,
      ];
    case 'css':
    case 'advanced-css':
      return [
        `Overusing !important to override styles instead of relying on proper CSS specificity and cascade layers.`,
        `Forgetting box-sizing: border-box, causing padding to unexpectedly increase element widths.`,
        `Using fixed pixel widths on mobile viewports instead of responsive units (rem, %, flex, fr).`,
        `Animating properties that trigger layout reflow (width, height, top) instead of GPU-accelerated transform and opacity.`,
      ];
    case 'javascript':
    case 'es6':
      return [
        `Forgetting that arrow functions do not bind their own 'this' or 'arguments' object.`,
        `Neglecting to handle Promise rejections with try/catch or .catch(), leading to unhandled rejection crashes.`,
        `Assuming == performs strict comparison; always use === to avoid unexpected type coercion.`,
        `Creating unintentional memory leaks by leaving uncleared setInterval or global event listeners active.`,
      ];
    case 'typescript':
      return [
        `Overusing 'any' instead of 'unknown' or proper generic parameters, defeating the purpose of type checking.`,
        `Confusing 'type' and 'interface' when designing extensible object contracts.`,
        `Failing to use type guards (typeof, instanceof, 'key' in obj) before accessing properties on union types.`,
      ];
    default:
      return [
        `Assuming default configurations without verifying environment or browser support.`,
        `Failing to clean up subscriptions, event handlers, or timers when components or pages unmount.`,
        `Skipping error boundaries and graceful fallback states for unexpected network or runtime failures.`,
        `Neglecting mobile responsiveness and accessible keyboard navigation.`,
      ];
  }
}

function generateInterviewQuestions(
  subjectId: SubjectId,
  topicMeta: { id: string; title: string; description: string; subtopics: { id: string; title: string; conceptId: string }[] }
): InterviewQuestion[] {
  const sub1 = topicMeta.subtopics[0];
  const sub2 = topicMeta.subtopics[1] || sub1;
  const sub3 = topicMeta.subtopics[2] || sub1;

  return [
    {
      id: `${subjectId}-${topicMeta.id}-q1`,
      subjectId,
      topicId: topicMeta.id,
      subtopicId: sub1?.id,
      conceptId: sub1?.conceptId || `${subjectId}_basics`,
      difficulty: 'easy',
      experience: 'junior',
      type: 'conceptual',
      question: `What is ${topicMeta.title}, and what problem does it solve in web development?`,
      shortAnswer: `${topicMeta.title} provides standardized capabilities for ${topicMeta.description.toLowerCase()}. It allows developers to build maintainable, responsive, and performant web applications.`,
      detailedAnswer: `### Core Concept
In **${subjectId.toUpperCase()}**, **${topicMeta.title}** is used to address:
- ${topicMeta.description}

### Key Benefits
- **Clean Structure**: Enforces predictable syntax that is straightforward for engineering teams to maintain.
- **Cross-Platform Compatibility**: Supported natively across all modern evergreen web browsers.
- **Performance**: Prevents unnecessary overhead and maintains smooth UI rendering.`,
      seniorAnswer: `From an architectural viewpoint, ${topicMeta.title} establishes clean component boundaries and prevents state fragmentation across distributed modules.`,
      whyAsked: {
        testingObjective: `Verifies whether the candidate understands the fundamental purpose and core benefits of ${topicMeta.title}.`,
        expectedSignal: `Clear explanation in plain English, understanding of why developers use it, and practical syntax familiarity.`,
        commonWeakAnswer: `Reciting memorized jargon without explaining what real problem it solves.`,
        strongSeniorAnswer: `Explaining the problem, syntax, common edge cases, and how it fits into modern web architecture.`,
      },
      explanation: `Mastering ${topicMeta.title} is essential for technical frontend interview rounds.`,
      commonMistakes: [
        `Confusing the concept with legacy workarounds.`,
        `Not knowing standard syntax conventions.`,
      ],
      tags: [subjectId, topicMeta.id, 'fundamentals', 'interview-prep'],
    },
    {
      id: `${subjectId}-${topicMeta.id}-q2`,
      subjectId,
      topicId: topicMeta.id,
      subtopicId: sub2?.id,
      conceptId: sub2?.conceptId || `${subjectId}_practice`,
      difficulty: 'intermediate',
      experience: 'mid-level',
      type: 'scenario',
      question: `How do you implement ${topicMeta.title} in a production application, and what pitfalls must be avoided?`,
      shortAnswer: `Use clean, declarative patterns, validate input parameters, handle edge cases (loading, empty, error states), and ensure proper cleanup on unmount.`,
      detailedAnswer: `### Production Implementation Guide
When using **${topicMeta.title}** in production:
1. **Defensive Programming**: Validate incoming props or parameters before execution.
2. **Clean Teardown**: Remove event listeners, observers, or timers during unmount.
3. **State Integrity**: Keep state updates immutable and avoid unnecessary re-computations.`,
      seniorAnswer: `I profile runtime performance in Chrome DevTools, enforce automated unit test coverage, and use TypeScript strict mode to catch regression bugs at compile time.`,
      whyAsked: {
        testingObjective: `Evaluates real-world coding ability, debugging skills, and awareness of edge cases.`,
        expectedSignal: `Mentions practical scenarios, defensive coding patterns, and performance considerations.`,
        commonWeakAnswer: `Showing a textbook example with no error handling or cleanup logic.`,
        strongSeniorAnswer: `Discussing edge-case handling, test strategies, memory management, and browser compatibility.`,
      },
      explanation: `Interviewers look for candidates who write defensive, bug-free production code.`,
      commonMistakes: [
        `Neglecting to handle null or undefined data values.`,
        `Leaving uncleaned timers or listeners that cause memory leaks.`,
      ],
      tags: [subjectId, topicMeta.id, 'practice', 'debugging'],
    },
    {
      id: `${subjectId}-${topicMeta.id}-q3`,
      subjectId,
      topicId: topicMeta.id,
      subtopicId: sub3?.id,
      conceptId: sub3?.conceptId || `${subjectId}_architecture`,
      difficulty: 'difficult',
      experience: 'senior',
      type: 'architecture',
      question: `How do you architect and scale ${topicMeta.title} across a large enterprise codebase?`,
      shortAnswer: `Enforce modular encapsulation, strict type contracts, centralized telemetry, and comprehensive automated testing.`,
      detailedAnswer: `### Enterprise Scaling Principles
- **Encapsulation**: Expose clean, minimal public APIs while keeping implementation details private.
- **Contract Enforcement**: Use TypeScript interfaces or validation schemas to prevent subtle integration bugs.
- **Observability**: Track errors, user timing metrics, and performance indicators in production.
- **Backward Compatibility**: Plan non-breaking deprecation strategies when upgrading architectures.`,
      seniorAnswer: `At enterprise scale, I design reusable, self-contained abstractions with automated regression suites, telemetry dashboards, and clear documentation so multi-team organizations can move fast safely.`,
      whyAsked: {
        testingObjective: `Assesses senior architectural mindset, scalability trade-offs, and team leadership.`,
        expectedSignal: `Focus on developer velocity, maintainability, system resilience, and backward compatibility.`,
        commonWeakAnswer: `Focusing solely on micro-benchmarks without addressing team scalability.`,
        strongSeniorAnswer: `Holistic perspective covering testing, error boundaries, telemetry, and developer ergonomics.`,
      },
      explanation: `Senior interviews emphasize maintainability, architecture, and team scalability.`,
      commonMistakes: [
        `Over-engineering simple features before requirements are fully understood.`,
        `Coupling UI presentation code directly to network or persistence logic.`,
      ],
      tags: [subjectId, topicMeta.id, 'senior', 'architecture'],
    },
  ];
}


