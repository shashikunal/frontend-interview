import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read current machineCodingQuestions.ts
const origContent = fs.readFileSync(
  path.join(__dirname, '../src/components/machinecoding/machineCodingQuestions.ts'),
  'utf8'
);

// Read masterCatalog.ts
const masterContent = fs.readFileSync(
  path.join(__dirname, '../src/components/machinecoding/data/masterCatalog.ts'),
  'utf8'
);

// Extract the 500 array
const jsonStart = masterContent.indexOf('MASTER_500_QUESTIONS: MCQuestion[] = ') + 'MASTER_500_QUESTIONS: MCQuestion[] = '.length;
const jsonStr = masterContent.slice(jsonStart, masterContent.lastIndexOf(';'));
const all500 = JSON.parse(jsonStr);

// Create the unified machineCodingQuestions.ts
// We keep the first 20 original questions, and append the remaining 480 questions (Q021 to Q500)
const remaining480 = all500.slice(20);

// We replace the end of machineCodingQuestions.ts
const lastBraceIndex = origContent.lastIndexOf('}');
const truncatedOrig = origContent.slice(0, lastBraceIndex + 1);

const output = `${truncatedOrig},
  // ==========================================
  // BATCH 2 TO BATCH 10 (Q021 TO Q500)
  // ==========================================
${remaining480.map(q => `  ${JSON.stringify(q, null, 2)}`).join(',\n')}
];
`;

fs.writeFileSync(
  path.join(__dirname, '../src/components/machinecoding/machineCodingQuestions.ts'),
  output,
  'utf8'
);

console.log('Successfully updated machineCodingQuestions.ts with all 500 questions!');
