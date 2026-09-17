// scripts/generators/reactGenerator.mjs
// 100% Domain-Pure Question Generator for React (Zero Duplicates, Fresher-First)

import { createSubjectGenerator } from './generatorFactory.mjs';
import { getStandardAngles } from './standardAngles.mjs';
import { REACT_TOPICS } from './topics/reactTopics.mjs';

const angles = getStandardAngles('React');

export const generateReactQuestion = createSubjectGenerator({
  subjectId: 'react',
  defaultSubjectName: 'React',
  topics: REACT_TOPICS,
  angles,
});
