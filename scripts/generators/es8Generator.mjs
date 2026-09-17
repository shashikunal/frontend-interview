// scripts/generators/es8Generator.mjs
// 100% Domain-Pure Question Generator for ES8 (Zero Duplicates, Fresher-First)

import { createSubjectGenerator } from './generatorFactory.mjs';
import { getStandardAngles } from './standardAngles.mjs';
import { ES8_TOPICS } from './topics/es8Topics.mjs';

const angles = getStandardAngles('ES8');

export const generateEs8Question = createSubjectGenerator({
  subjectId: 'es8',
  defaultSubjectName: 'ES8',
  topics: ES8_TOPICS,
  angles,
});
