// scripts/auditGlobalQuestionDuplicates.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../public/data/interview-questions');

function normalizeQuestion(text) {
  if (!text) return '';
  return text.toLowerCase()
    .replace(/[`*_\-#<>]/g, ' ')
    .replace(/[?.,!;:()[\]{}"'\\\/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const catalog = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'catalog.json'), 'utf8'));
console.log(`Auditing ${catalog.subjects.length} subjects from catalog...`);

const allQuestions = [];
const seenIds = new Set();
const seenHashes = new Set();
let exactDupes = 0;
let hashDupes = 0;
let totalMCQs = 0;

for (const sub of catalog.subjects) {
  const filePath = path.join(DATA_DIR, `${sub.id}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`MISSING JSON FOR ${sub.id}`);
    continue;
  }
  const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let subMCQs = 0;

  for (const q of questions) {
    if (seenIds.has(q.id)) {
      console.error(`DUPLICATE ID: ${q.id} in subject ${sub.id}`);
      exactDupes++;
    }
    seenIds.add(q.id);

    const norm = normalizeQuestion(q.question);
    if (seenHashes.has(norm)) {
      console.warn(`POTENTIAL DUPLICATE TEXT: "${q.question}" in ${sub.id}`);
      hashDupes++;
    }
    seenHashes.add(norm);

    const isMCQ = (Array.isArray(q.options) && q.options.length > 0) || q.questionType === 'MCQ' || q.question_type === 'mcq';
    if (isMCQ) {
      subMCQs++;
      totalMCQs++;
    }

    allQuestions.push(q);
  }

  console.log(`Subject ${sub.id.padEnd(22)}: ${questions.length} Qs, ${subMCQs} MCQs (${Math.round((subMCQs / questions.length) * 100)}% MCQs)`);
}

console.log('\n=======================================');
console.log(`TOTAL QUESTIONS AUDITED: ${allQuestions.length}`);
console.log(`TOTAL INTERACTIVE MCQs: ${totalMCQs}`);
console.log(`EXACT DUPLICATE IDS:     ${exactDupes}`);
console.log(`DUPLICATE QUESTION HASH: ${hashDupes}`);
console.log('=======================================');

if (exactDupes === 0 && hashDupes === 0) {
  console.log('🎉 AUDIT PASSED: ZERO DUPLICATES ACROSS ALL SUBJECTS!');
} else {
  console.error('Audit failed with duplicates.');
}
