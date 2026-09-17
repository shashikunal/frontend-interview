// scripts/generators/es6Generator.mjs
// 100% Domain-Pure Question Generator for ES6 (Zero Duplicates, Fresher-First)

import { createSubjectGenerator } from './generatorFactory.mjs';
import { getStandardAngles } from './standardAngles.mjs';
import { ES6_TOPICS } from './topics/es6Topics.mjs';

const angles = getStandardAngles('ES6');

export const generateEs6Question = createSubjectGenerator({
  subjectId: 'es6',
  defaultSubjectName: 'ES6',
  topics: ES6_TOPICS,
  angles,
});
