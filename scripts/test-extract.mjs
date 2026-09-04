import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read current machineCodingQuestions.ts
const currentQuestionsPath = path.join(__dirname, '../src/components/machinecoding/machineCodingQuestions.ts');
const sourceContent = fs.readFileSync(currentQuestionsPath, 'utf8');

// Extract Q001 to Q020 as literal source code so we don't alter any of the handcrafted 20 solutions
const q001_to_q020_match = sourceContent.match(/export const MACHINE_CODING_QUESTIONS: MCQuestion\[\] = \[([\s\S]*?)(\n\s*\{\s*"id":\s*"Q021"|\n\s*\{\s*id:\s*'Q021')/);

if (!q001_to_q020_match) {
  console.error("Could not locate boundary for Q001-Q020");
  process.exit(1);
}

const q001_to_q020_raw = q001_to_q020_match[1].trim();
console.log("Successfully extracted handcrafted Q001-Q020 block, length:", q001_to_q020_raw.length);
