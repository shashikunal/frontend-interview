// scripts/generators/webApisGenerator.mjs
// 100% Domain-Pure Question Generator for Web APIs (Zero Duplicates, Fresher-First)

import { createSubjectGenerator } from './generatorFactory.mjs';
import { getStandardAngles } from './standardAngles.mjs';
import { WEB_APIS_TOPICS } from './topics/webApisTopics.mjs';

const angles = getStandardAngles('Web APIs');

export const generateWebApisQuestion = createSubjectGenerator({
  subjectId: 'web-apis',
  defaultSubjectName: 'Web APIs',
  topics: WEB_APIS_TOPICS,
  angles,
});
