import { MACHINE_CODING_QUESTIONS, type MCQuestion } from '../src/components/machinecoding/machineCodingQuestions.ts';
import { getEnrichedQuestionSpec } from '../src/components/machinecoding/lib/mcQuestionSpecService.ts';
import { getQuestionTestCases } from '../src/components/machinecoding/data/machineCodingTests.ts';
import * as babelParser from '@babel/parser';

console.log('==============================================');
console.log('PHASE 8 — MACHINE CODING 500 QUESTIONS DEEP AUDIT');
console.log('==============================================\n');

// 1. DATASET COUNT & NUMBERING
const total = MACHINE_CODING_QUESTIONS.length;
console.log(`1. Total Questions: ${total}`);

const ids = new Set<string>();
const numbers = new Set<number>();
const titles = new Map<string, string[]>();
const duplicateIds: string[] = [];
const missingNumbers: number[] = [];
const duplicateNumbers: number[] = [];

for (let i = 1; i <= 500; i++) {
  const expectedId = `Q${String(i).padStart(3, '0')}`;
  const found = MACHINE_CODING_QUESTIONS.find(q => q.id === expectedId);
  if (!found) {
    missingNumbers.push(i);
  }
}

MACHINE_CODING_QUESTIONS.forEach(q => {
  if (ids.has(q.id)) {
    duplicateIds.push(q.id);
  }
  ids.add(q.id);

  const num = parseInt(q.id.replace(/\D/g, ''), 10);
  if (numbers.has(num)) {
    duplicateNumbers.push(num);
  }
  numbers.add(num);

  const cleanTitle = q.title.trim().toLowerCase();
  const existing = titles.get(cleanTitle) || [];
  existing.push(q.id);
  titles.set(cleanTitle, existing);
});

console.log(`- Expected Range: Q001 to Q500`);
console.log(`- Missing Numbers Count: ${missingNumbers.length} ${missingNumbers.length > 0 ? JSON.stringify(missingNumbers) : '(None)'}`);
console.log(`- Duplicate IDs Count: ${duplicateIds.length} ${duplicateIds.length > 0 ? JSON.stringify(duplicateIds) : '(None)'}`);
console.log(`- Duplicate Numbers Count: ${duplicateNumbers.length} ${duplicateNumbers.length > 0 ? JSON.stringify(duplicateNumbers) : '(None)'}`);

const duplicateTitlesList = Array.from(titles.entries()).filter(([_, qids]) => qids.length > 1);
console.log(`- Duplicate Titles Count: ${duplicateTitlesList.length} ${duplicateTitlesList.length > 0 ? JSON.stringify(duplicateTitlesList) : '(None)'}`);

// 2. FIELD COMPLETENESS & CONTENT AUDIT
console.log('\n2. FIELD COMPLETENESS AUDIT:');
let missingTitle = 0;
let missingSummary = 0;
let missingDesc = 0;
let missingReqs = 0;
let emptyReqs = 0;
let missingTips = 0;
let missingMistakes = 0;
let missingStarter = 0;
let missingSolution = 0;
let invalidDifficulty = 0;
let invalidCategory = 0;

const validDifficulties = new Set(['Easy', 'Medium', 'Hard', 'Senior']);
const validCategories = new Set([
  'JavaScript',
  'TypeScript',
  'ReactJS',
  'React Redux Toolkit',
  'React Query',
  'DOM',
  'LeetCode',
  'State Management',
  'Interactive UI',
  'Custom Hooks',
  'Async & Performance',
  'Architecture'
]);

MACHINE_CODING_QUESTIONS.forEach(q => {
  if (!q.title || !q.title.trim()) missingTitle++;
  if (!q.summary || !q.summary.trim()) missingSummary++;
  if (!q.description || !q.description.trim()) missingDesc++;
  if (!q.requirements || !Array.isArray(q.requirements)) missingReqs++;
  else if (q.requirements.length === 0) emptyReqs++;
  if (!q.interviewTips || q.interviewTips.length === 0) missingTips++;
  if (!q.commonMistakes || q.commonMistakes.length === 0) missingMistakes++;
  if (!q.starterCode || !q.starterCode.trim()) missingStarter++;
  if (!q.solutionCode || !q.solutionCode.trim()) missingSolution++;
  if (!validDifficulties.has(q.difficulty)) invalidDifficulty++;
  if (!validCategories.has(q.category)) invalidCategory++;
});

console.log(`- Missing/empty Title: ${missingTitle}`);
console.log(`- Missing/empty Summary: ${missingSummary}`);
console.log(`- Missing/empty Description: ${missingDesc}`);
console.log(`- Missing/empty Requirements: ${missingReqs + emptyReqs}`);
console.log(`- Missing/empty Interview Tips: ${missingTips}`);
console.log(`- Missing/empty Common Mistakes: ${missingMistakes}`);
console.log(`- Missing/empty Starter Code: ${missingStarter}`);
console.log(`- Missing/empty Solution Code: ${missingSolution}`);
console.log(`- Invalid Difficulty values: ${invalidDifficulty}`);
console.log(`- Invalid Category values: ${invalidCategory}`);

// 3. DUPLICATE CONTENT ANALYSIS
console.log('\n3. DUPLICATE CONTENT ANALYSIS:');
const starterMap = new Map<string, string[]>();
const solutionMap = new Map<string, string[]>();

MACHINE_CODING_QUESTIONS.forEach(q => {
  const sKey = q.starterCode.trim();
  const solKey = q.solutionCode.trim();
  const sList = starterMap.get(sKey) || [];
  sList.push(q.id);
  starterMap.set(sKey, sList);

  const solList = solutionMap.get(solKey) || [];
  solList.push(q.id);
  solutionMap.set(solKey, solList);
});

const duplicateStarters = Array.from(starterMap.entries()).filter(([_, qids]) => qids.length > 1);
const duplicateSolutions = Array.from(solutionMap.entries()).filter(([_, qids]) => qids.length > 1);

console.log(`- Unique Starter Codes: ${starterMap.size} / ${total}`);
console.log(`- Duplicate Starter Code Groups: ${duplicateStarters.length}`);
if (duplicateStarters.length > 0) {
  console.log(`  (Sample duplicate starter: ${duplicateStarters[0][1].slice(0, 5).join(', ')} shares same starter)`);
}

console.log(`- Unique Solution Codes: ${solutionMap.size} / ${total}`);
console.log(`- Duplicate Solution Code Groups: ${duplicateSolutions.length}`);

// 4. CODE SYNTAX VALIDATION (Babel parse)
console.log('\n4. CODE SYNTAX VALIDATION (JSX/TSX Babel Parse):');
let starterSyntaxErrors: Array<{ id: string; error: string }> = [];
let solutionSyntaxErrors: Array<{ id: string; error: string }> = [];

MACHINE_CODING_QUESTIONS.forEach(q => {
  try {
    babelParser.parse(q.starterCode, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });
  } catch (err: any) {
    starterSyntaxErrors.push({ id: q.id, error: err.message });
  }

  try {
    babelParser.parse(q.solutionCode, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });
  } catch (err: any) {
    solutionSyntaxErrors.push({ id: q.id, error: err.message });
  }
});

console.log(`- Starter Code Syntax Errors: ${starterSyntaxErrors.length}`);
if (starterSyntaxErrors.length > 0) {
  console.log('  Details:', starterSyntaxErrors.slice(0, 5));
}
console.log(`- Solution Code Syntax Errors: ${solutionSyntaxErrors.length}`);
if (solutionSyntaxErrors.length > 0) {
  console.log('  Details:', solutionSyntaxErrors.slice(0, 5));
}

// 5. TEST CASE & SPEC ENRICHMENT AUDIT
console.log('\n5. TEST CASE & SPEC ENRICHMENT AUDIT:');
let totalTestCases = 0;
let questionsWithoutTests = 0;
let questionsWithZeroExamples = 0;
let questionsWithZeroConstraints = 0;
let questionsWithMissingPreview = 0;

MACHINE_CODING_QUESTIONS.forEach(q => {
  const tests = getQuestionTestCases(q);
  totalTestCases += tests.length;
  if (tests.length === 0) questionsWithoutTests++;

  const spec = getEnrichedQuestionSpec(q);
  if (!spec.examples || spec.examples.length === 0) questionsWithZeroExamples++;
  if (!spec.constraints || spec.constraints.length === 0) questionsWithZeroConstraints++;
  if (!spec.previewInfo || !spec.previewInfo.summary) questionsWithMissingPreview++;
});

console.log(`- Total Automated Test Cases across 500 questions: ${totalTestCases}`);
console.log(`- Average Tests per Question: ${(totalTestCases / total).toFixed(1)}`);
console.log(`- Questions with 0 tests: ${questionsWithoutTests}`);
console.log(`- Questions with 0 examples: ${questionsWithZeroExamples}`);
console.log(`- Questions with 0 constraints: ${questionsWithZeroConstraints}`);
console.log(`- Questions with missing preview info: ${questionsWithMissingPreview}`);

// 6. QUESTION -> STARTER CODE SPOT CHECK
console.log('\n6. QUESTION -> STARTER CODE SPOT CHECK:');
const checkIds = ['Q001', 'Q002', 'Q010', 'Q025', 'Q050', 'Q100', 'Q200', 'Q300', 'Q400', 'Q500'];
checkIds.forEach(id => {
  const q = MACHINE_CODING_QUESTIONS.find(x => x.id === id);
  if (q) {
    const starterPreview = q.starterCode.split('\n').filter(l => !l.startsWith('import')).slice(0, 2).join(' ').trim();
    console.log(`[${q.id}] ${q.title} (${q.category} | ${q.difficulty})`);
    console.log(`      Starter snippet: ${starterPreview.substring(0, 90)}...`);
  } else {
    console.log(`[${id}] NOT FOUND`);
  }
});
