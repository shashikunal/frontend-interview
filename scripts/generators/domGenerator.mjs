// scripts/generators/domGenerator.mjs
// 100% Domain-Pure Question Generator for DOM (Zero Duplicates, Fresher-First)

import { createSubjectGenerator } from './generatorFactory.mjs';
import { getStandardAngles } from './standardAngles.mjs';
import { DOM_TOPICS } from './topics/domTopics.mjs';

const angles = getStandardAngles('DOM');

export const generateDomQuestion = createSubjectGenerator({
  subjectId: 'dom',
  defaultSubjectName: 'DOM',
  topics: DOM_TOPICS,
  angles,
});
