// scripts/generators/reduxGenerator.mjs
// 100% Domain-Pure Question Generator for Redux (Zero Duplicates, Fresher-First)

import { createSubjectGenerator } from './generatorFactory.mjs';
import { getStandardAngles } from './standardAngles.mjs';
import { REDUX_TOPICS } from './topics/reduxTopics.mjs';

const angles = getStandardAngles('Redux');

export const generateReduxQuestion = createSubjectGenerator({
  subjectId: 'redux',
  defaultSubjectName: 'Redux',
  topics: REDUX_TOPICS,
  angles,
});
