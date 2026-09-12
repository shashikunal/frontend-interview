/**
 * scripts/ai-video-mock/auditQuestionBank.cjs
 *
 * Runs full automated audit on all 16 technology question banks.
 */

const fs = require('fs');
const path = require('path');

const BANK_DIR = path.resolve(__dirname, '../../src/features/ai-video-mock/data/questionBank');

const TRACKS = [
  'javascript', 'typescript', 'html', 'css', 'react', 'nextjs', 'angular', 'vue',
  'redux-state', 'web-performance', 'browser-web-apis', 'frontend-security',
  'accessibility', 'testing', 'frontend-architecture', 'communication'
];

console.log('🔍 Running 300-Question Bank Audit across all 16 Technology Tracks...\n');

let grandTotal = 0;
let allPassed = true;

for (const track of TRACKS) {
  const filePath = path.join(BANK_DIR, `${track}.ts`);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing file: ${filePath}`);
    allPassed = false;
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  // Extract JSON array from export const xxx = [...]
  const equalsBracket = content.indexOf('= [');
  const jsonStart = equalsBracket !== -1 ? equalsBracket + 2 : content.indexOf('[');
  const jsonEnd = content.lastIndexOf(']');
  if (jsonStart === -1 || jsonEnd === -1) {
    console.error(`❌ Could not parse questions in ${track}.ts`);
    allPassed = false;
    continue;
  }

  const questions = JSON.parse(content.slice(jsonStart, jsonEnd + 1));
  grandTotal += questions.length;

  const seen = new Set();
  let exactDups = 0;
  let basic = 0;
  let inter = 0;
  let adv = 0;
  let exp = 0;
  let valid = 0;

  for (const q of questions) {
    if (q.id && q.question && q.expectedConcepts && q.rubric) {
      valid++;
    }
    const norm = q.question.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seen.has(norm)) {
      exactDups++;
    } else {
      seen.add(norm);
    }

    if (q.difficulty === 'Basic') basic++;
    else if (q.difficulty === 'Intermediate') inter++;
    else if (q.difficulty === 'Advanced') adv++;
    else if (q.difficulty === 'Expert') exp++;
  }

  const isPass = questions.length >= 300 && exactDups === 0 && valid === questions.length;
  if (!isPass) allPassed = false;

  console.log(`${isPass ? '✅' : '❌'} Track: ${track.toUpperCase()}`);
  console.log(`   Total Questions: ${questions.length} / 300 required`);
  console.log(`   Distribution: Basic: ${basic} | Inter: ${inter} | Adv: ${adv} | Expert: ${exp}`);
  console.log(`   Duplicates: ${exactDups} | Valid: ${valid}/${questions.length}`);
  console.log(`   Status: ${isPass ? 'PASS' : 'FAIL'}\n`);
}

console.log('===============================================================');
console.log(`Total questions across all tracks: ${grandTotal}`);
console.log(`Final Question Bank Requirement: ${allPassed ? 'ALL 16 TRACKS PASSED (300+ EACH)' : 'FAILED'}`);
console.log('===============================================================');

if (!allPassed) {
  process.exit(1);
}
