// src/components/coreprogramming/data/coreProgrammingQuestions.ts
import type { CoreProgrammingQuestion, CoreProgrammingCategory, CoreProgrammingDifficulty } from './coreProgrammingTypes';
import { coreProgrammingBatch1 } from './batches/batch01';
import { coreProgrammingBatch2 } from './batches/batch02';
import { coreProgrammingBatch3 } from './batches/batch03';
import { coreProgrammingBatch4 } from './batches/batch04';
import { coreProgrammingBatch5 } from './batches/batch05';
import { batch06 } from './batches/batch06';
import { batch07 } from './batches/batch07';
import { batch08 } from './batches/batch08';
import { batch09Questions } from './batches/batch09';
import { batch10Questions } from './batches/batch10';

export {
  coreProgrammingBatch1,
  coreProgrammingBatch2,
  coreProgrammingBatch3,
  coreProgrammingBatch4,
  coreProgrammingBatch5,
  batch06 as coreProgrammingBatch6,
  batch07 as coreProgrammingBatch7,
  batch08 as coreProgrammingBatch8,
  batch09Questions as coreProgrammingBatch9,
  batch10Questions as coreProgrammingBatch10
};

export const CORE_PROGRAMMING_QUESTIONS: CoreProgrammingQuestion[] = [
  ...coreProgrammingBatch1,
  ...coreProgrammingBatch2,
  ...coreProgrammingBatch3,
  ...coreProgrammingBatch4,
  ...coreProgrammingBatch5,
  ...batch06,
  ...batch07,
  ...batch08,
  ...batch09Questions,
  ...batch10Questions
];

export const questionByIdMap = new Map<string, CoreProgrammingQuestion>();
export const questionBySlugMap = new Map<string, CoreProgrammingQuestion>();

for (const q of CORE_PROGRAMMING_QUESTIONS) {
  questionByIdMap.set(q.id, q);
  if (q.slug) {
    questionBySlugMap.set(q.slug, q);
  }
}

export function getCoreProgrammingQuestion(idOrSlug: string): CoreProgrammingQuestion | undefined {
  if (!idOrSlug) return undefined;
  return questionByIdMap.get(idOrSlug) || questionBySlugMap.get(idOrSlug) || questionByIdMap.get(idOrSlug.toUpperCase());
}

export const CORE_PROGRAMMING_CATEGORIES: CoreProgrammingCategory[] = [
  'JavaScript Basics',
  'Strings',
  'Arrays',
  'Objects',
  'Functions',
  'Array Method Implementation',
  'Scope / Hoisting / Closures',
  'this / call / apply / bind / Prototype',
  'ES6+',
  'Recursion / Algorithms',
  'Functional JavaScript',
  'Async JavaScript Programming',
  'Advanced Core JavaScript'
];

export const CORE_PROGRAMMING_DIFFICULTIES: CoreProgrammingDifficulty[] = [
  'Easy',
  'Medium',
  'Hard',
  'Expert'
];
