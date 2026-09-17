// scripts/generators/bomGenerator.mjs
// 100% Domain-Pure Question Generator for BOM (Zero Duplicates, Fresher-First)

import { createSubjectGenerator } from './generatorFactory.mjs';
import { getStandardAngles } from './standardAngles.mjs';
import { BOM_TOPICS } from './topics/bomTopics.mjs';

const angles = getStandardAngles('BOM');

export const generateBomQuestion = createSubjectGenerator({
  subjectId: 'bom',
  defaultSubjectName: 'BOM',
  topics: BOM_TOPICS,
  angles,
});
