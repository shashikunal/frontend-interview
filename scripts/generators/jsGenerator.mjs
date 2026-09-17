// scripts/generators/jsGenerator.mjs
// 100% Domain-Pure Question Generator for JavaScript (Zero Duplicates, Fresher-First)

import { createSubjectGenerator } from './generatorFactory.mjs';
import { getStandardAngles } from './standardAngles.mjs';
import { JS_TOPICS } from './topics/jsTopics.mjs';

const angles = getStandardAngles('JavaScript');

export const generateJavascriptQuestion = createSubjectGenerator({
  subjectId: 'javascript',
  defaultSubjectName: 'JavaScript',
  topics: JS_TOPICS,
  angles,
});
