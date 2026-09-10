import type { FrontendJsQuestion, FrontendJsRoadmap } from './frontendJsTypes';
import { fjpBatch1 } from './batches/batch01';
import { fjpBatch2 } from './batches/batch02';
import { fjpBatch3 } from './batches/batch03';
import { fjpBatch4 } from './batches/batch04';
import { fjpBatch5 } from './batches/batch05';
import { fjpBatch6 } from './batches/batch06';
import { fjpBatch7 } from './batches/batch07';
import { fjpBatch8 } from './batches/batch08';
import { fjpBatch9 } from './batches/batch09';
import { fjpBatch10 } from './batches/batch10';

export const SEED_FRONTEND_JS_QUESTIONS: FrontendJsQuestion[] = [
  ...fjpBatch1,
  ...fjpBatch2,
  ...fjpBatch3,
  ...fjpBatch4,
  ...fjpBatch5,
  ...fjpBatch6,
  ...fjpBatch7,
  ...fjpBatch8,
  ...fjpBatch9,
  ...fjpBatch10,
];

export const FRONTEND_JS_QUESTIONS: FrontendJsQuestion[] = SEED_FRONTEND_JS_QUESTIONS;

// Fast lookup maps
export const questionByIdMap = new Map<string, FrontendJsQuestion>(
  FRONTEND_JS_QUESTIONS.map(q => [q.id, q])
);

export const questionBySlugMap = new Map<string, FrontendJsQuestion>(
  FRONTEND_JS_QUESTIONS.map(q => [q.slug, q])
);

export function getFrontendJsQuestionById(id: string): FrontendJsQuestion | undefined {
  return questionByIdMap.get(id);
}

export function getFrontendJsQuestionBySlug(slug: string): FrontendJsQuestion | undefined {
  return questionBySlugMap.get(slug);
}

export const FRONTEND_JS_ROADMAPS: FrontendJsRoadmap[] = [
  {
    id: 'top-50-essentials',
    title: 'Top 50 Frontend JavaScript Essentials',
    description: 'The highest-frequency JavaScript problems asked across Google, Meta, and top product companies.',
    badge: '🔥 Top 50',
    questionIds: FRONTEND_JS_QUESTIONS.filter(q => q.frequencyRank === 'Top 25' || q.frequencyRank === 'Top 50')
      .slice(0, 50)
      .map(q => q.id),
  },
  {
    id: 'async-concurrency',
    title: 'Async JavaScript & Promise Concurrency Sprint',
    description: 'Master Promise polyfills, retries with backoff, concurrency limiters, and race resolvers.',
    badge: '⚡ Async Sprint',
    questionIds: FRONTEND_JS_QUESTIONS.filter(q => q.category === 'Async JavaScript')
      .slice(0, 50)
      .map(q => q.id),
  },
  {
    id: 'dom-performance',
    title: 'DOM, Events & 60fps Performance Track',
    description: 'Deep dive into virtualized lists, RAF throttling, custom event emitters, and TTL caching.',
    badge: '🚀 Performance Track',
    questionIds: FRONTEND_JS_QUESTIONS.filter(q => q.category === 'DOM & Events' || q.category === 'Performance')
      .slice(0, 50)
      .map(q => q.id),
  },
  {
    id: 'production-scenarios',
    title: 'Production Scenario & Real-World Interview Track',
    description: 'Solve autocomplete race conditions, request deduplication, optimistic state updates, and token refresh.',
    badge: '🏗️ Production Scenarios',
    questionIds: FRONTEND_JS_QUESTIONS.filter(q => q.category === 'Production Scenarios')
      .slice(0, 50)
      .map(q => q.id),
  },
];
