// scripts/generators/htmlGenerator.mjs
// 100% Domain-Pure Question Generator for HTML (Zero Duplicates, Fresher-First)

import { createSubjectGenerator } from './generatorFactory.mjs';
import { getStandardAngles } from './standardAngles.mjs';
import { HTML_TOPICS } from './topics/htmlTopics.mjs';

const angles = getStandardAngles('HTML');

export const generateHtmlQuestion = createSubjectGenerator({
  subjectId: 'html',
  defaultSubjectName: 'HTML',
  topics: HTML_TOPICS,
  angles,
});
