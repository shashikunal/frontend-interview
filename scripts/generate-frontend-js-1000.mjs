import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../src/components/frontendjs/data');
const BATCHES_DIR = path.join(DATA_DIR, 'batches');

if (!fs.existsSync(BATCHES_DIR)) {
  fs.mkdirSync(BATCHES_DIR, { recursive: true });
}

console.log('🚀 Starting generation of 1,000 Frontend JavaScript Questions across 10 Batches...');

// Helper to format 4-digit ID
const formatId = (n) => `FJP-${String(n).padStart(4, '0')}`;
const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const COMPANIES_POOL = [
  ['Google-Style', 'Meta-Pattern'],
  ['Amazon-Style', 'Apple-Pattern'],
  ['Netflix-Style', 'Uber-Pattern'],
  ['Airbnb-Style', 'Stripe-Pattern'],
  ['Microsoft-Style', 'LinkedIn-Pattern'],
  ['Salesforce-Style', 'Adobe-Pattern'],
  ['ByteDance-Style', 'Spotify-Pattern'],
  ['Atlassian-Style', 'Coinbase-Pattern'],
  ['DoorDash-Style', 'Instacart-Pattern'],
  ['Figma-Style', 'Canva-Pattern'],
];

const STARTUP_TAGS = [
  'Fintech High-Throughput',
  'E-Commerce Checkout',
  'Design Tool Canvas',
  'SaaS Realtime Collaboration',
  'DevTools & Observability',
  'Streaming Video Platform',
  'Social Feed Concurrency',
  'Workflow Automation Engine',
];

// Definition of Archetypes for each batch of 100 questions
// Each batch has specific topic blueprints that generate 100 distinct questions
const BATCH_SPECS = [
  {
    batchNum: 1,
    name: 'batch01',
    category: 'Fundamentals',
    subcategory: 'Types, Coercion, Equality & Primitives',
    idStart: 1,
    idEnd: 100,
    theme: 'Core JavaScript Fundamentals & Type Mechanics'
  },
  {
    batchNum: 2,
    name: 'batch02',
    category: 'Functions',
    subcategory: 'Closures, Scope, Currying & Composition',
    idStart: 101,
    idEnd: 200,
    theme: 'Higher-Order Functions, Closures & Execution Context'
  },
  {
    batchNum: 3,
    name: 'batch03',
    category: 'Modern JavaScript',
    subcategory: 'ES6+, Iterators, Generators, Map, Set & Proxies',
    idStart: 201,
    idEnd: 300,
    theme: 'Modern ES6+ Syntax, Iteration Protocols & Metaprogramming'
  },
  {
    batchNum: 4,
    name: 'batch04',
    category: 'Arrays',
    subcategory: 'Array Transformations, Chunking, Partitioning & Grouping',
    idStart: 301,
    idEnd: 400,
    theme: 'High-Performance Array Manipulation & Polyfills'
  },
  {
    batchNum: 5,
    name: 'batch05',
    category: 'Objects',
    subcategory: 'Deep Operations, Immutability & Structural Transformations',
    idStart: 401,
    idEnd: 500,
    theme: 'Immutable State Operations, Path Access & Object Diffing'
  },
  {
    batchNum: 6,
    name: 'batch06',
    category: 'Strings',
    subcategory: 'Parsing, Formatting, Tokenizing & Sanitization',
    idStart: 501,
    idEnd: 600,
    theme: 'String Template Engines, Query String Parsers & Masks'
  },
  {
    batchNum: 7,
    name: 'batch07',
    category: 'Async JavaScript',
    subcategory: 'Promises, Concurrency, Pools, Retries & Queues',
    idStart: 601,
    idEnd: 700,
    theme: 'Asynchronous Orchestration, Rate Limiters & Promise Polyfills'
  },
  {
    batchNum: 8,
    name: 'batch08',
    category: 'DOM & Events',
    subcategory: 'Event Delegation, Pub-Sub, Observers & Storage with TTL',
    idStart: 701,
    idEnd: 800,
    theme: 'DOM Traversal, Event Pipelines & Browser Storage Management'
  },
  {
    batchNum: 9,
    name: 'batch09',
    category: 'Performance',
    subcategory: 'Virtualization, RAF, RequestIdleCallback & Caching',
    idStart: 801,
    idEnd: 900,
    theme: 'Frontend Render Pipelines, Schedulers & Resource Profiling'
  },
  {
    batchNum: 10,
    name: 'batch10',
    category: 'Production Scenarios',
    subcategory: 'Real-World Architectural Problems & Bug Scenarios',
    idStart: 901,
    idEnd: 1000,
    theme: 'Production Systems, Race Condition Solvers & State Sync'
  },
];

// Core generator function to produce 100 questions per batch
import { generateBatchQuestions } from './generate-batch-helpers.mjs';

for (const spec of BATCH_SPECS) {
  console.log(`Generating ${spec.name} (IDs ${formatId(spec.idStart)} to ${formatId(spec.idEnd)})...`);
  const questions = generateBatchQuestions(spec);

  const fileContent = `import type { FrontendJsQuestion } from '../frontendJsTypes';

export const fjpBatch${spec.batchNum}: FrontendJsQuestion[] = ${JSON.stringify(questions, null, 2)};
`;

  const targetFile = path.join(BATCHES_DIR, `${spec.name}.ts`);
  fs.writeFileSync(targetFile, fileContent, 'utf-8');
  console.log(`✅ Wrote ${questions.length} questions to ${spec.name}.ts`);
}

console.log('🎉 All 10 Batches (1,000 questions) successfully generated!');
