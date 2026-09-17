// scripts/generators/cssGenerator.mjs
// 100% Domain-Pure Question Generator for CSS (Zero Duplicates, Fresher-First)

import { createSubjectGenerator } from './generatorFactory.mjs';
import { getStandardAngles } from './standardAngles.mjs';
import { CSS_TOPICS } from './topics/cssTopics.mjs';

const angles = getStandardAngles('CSS');

export const generateCssQuestion = createSubjectGenerator({
  subjectId: 'css',
  defaultSubjectName: 'CSS',
  topics: CSS_TOPICS,
  angles,
});
