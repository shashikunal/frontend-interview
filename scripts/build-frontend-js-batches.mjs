// scripts/build-frontend-js-batches.mjs
// Generates all 10 batches (exactly 1,000 unique questions) for Frontend JavaScript Programming
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BATCHES_DIR = path.resolve(__dirname, '../src/components/frontendjs/data/batches');
if (!fs.existsSync(BATCHES_DIR)) {
  fs.mkdirSync(BATCHES_DIR, { recursive: true });
}

console.log('🚀 Generating 1,000 Frontend JavaScript Programming Questions...');

import {
  generateBatch1,
  generateBatch2,
  generateBatch3,
  generateBatch4,
  generateBatch5,
  generateBatch6,
  generateBatch7,
  generateBatch8,
  generateBatch9,
  generateBatch10,
} from './generators/unified-batches.mjs';

const batchGenerators = [
  { num: 1, fn: generateBatch1, name: 'batch01' },
  { num: 2, fn: generateBatch2, name: 'batch02' },
  { num: 3, fn: generateBatch3, name: 'batch03' },
  { num: 4, fn: generateBatch4, name: 'batch04' },
  { num: 5, fn: generateBatch5, name: 'batch05' },
  { num: 6, fn: generateBatch6, name: 'batch06' },
  { num: 7, fn: generateBatch7, name: 'batch07' },
  { num: 8, fn: generateBatch8, name: 'batch08' },
  { num: 9, fn: generateBatch9, name: 'batch09' },
  { num: 10, fn: generateBatch10, name: 'batch10' },
];

let totalQuestions = 0;

for (const { num, fn, name } of batchGenerators) {
  console.log(`Building Batch ${num}...`);
  const questions = fn();
  if (questions.length !== 100) {
    throw new Error(`Batch ${num} has ${questions.length} questions, expected 100!`);
  }
  totalQuestions += questions.length;

  const content = `// Batch ${num}: Questions ${questions[0].number} to ${questions[questions.length - 1].number}
import type { FrontendJsQuestion } from '../frontendJsTypes';

export const fjpBatch${num}: FrontendJsQuestion[] = ${JSON.stringify(questions, null, 2)};
`;

  fs.writeFileSync(path.join(BATCHES_DIR, `${name}.ts`), content, 'utf-8');
  console.log(`✅ ${name}.ts generated with ${questions.length} questions (${questions[0].id} to ${questions[questions.length - 1].id})`);
}

console.log(`\n🎉 Generated all ${totalQuestions} questions successfully across 10 batches!`);
