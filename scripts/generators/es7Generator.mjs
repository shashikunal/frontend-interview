// scripts/generators/es7Generator.mjs
// 100% Domain-Pure Question Generator for ES7 (Zero Duplicates, Fresher-First)

import { createSubjectGenerator } from './generatorFactory.mjs';
import { getStandardAngles } from './standardAngles.mjs';
import { ES7_TOPICS } from './topics/es7Topics.mjs';

const angles = getStandardAngles('ES7');

export const generateEs7Question = createSubjectGenerator({
  subjectId: 'es7',
  defaultSubjectName: 'ES7',
  topics: ES7_TOPICS,
  angles,
});
