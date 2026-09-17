// scripts/generators/typescriptGenerator.mjs
// 100% Domain-Pure Question Generator for TypeScript (Zero Duplicates, Fresher-First)

import { createSubjectGenerator } from './generatorFactory.mjs';
import { getStandardAngles } from './standardAngles.mjs';
import { TYPESCRIPT_TOPICS } from './topics/typescriptTopics.mjs';

const angles = getStandardAngles('TypeScript');

export const generateTypescriptQuestion = createSubjectGenerator({
  subjectId: 'typescript',
  defaultSubjectName: 'TypeScript',
  topics: TYPESCRIPT_TOPICS,
  angles,
});
