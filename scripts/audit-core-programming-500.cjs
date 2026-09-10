// scripts/audit-core-programming-500.cjs
const fs = require('fs');
const path = require('path');

const batchDir = path.join(__dirname, '..', 'src', 'components', 'coreprogramming', 'data', 'batches');

const expectedCategories = {
  'JavaScript Basics': 30,
  'Strings': 40,
  'Arrays': 80,
  'Objects': 50,
  'Functions': 40,
  'Array Method Implementation': 40,
  'Scope / Hoisting / Closures': 30,
  'this / call / apply / bind / Prototype': 30,
  'ES6+': 30,
  'Recursion / Algorithms': 40,
  'Functional JavaScript': 25,
  'Async JavaScript Programming': 45,
  'Advanced Core JavaScript': 20
};

const expectedDifficulties = {
  'Easy': 125,
  'Medium': 250,
  'Hard': 100,
  'Expert': 25
};

let allQuestions = [];

for (let b = 1; b <= 10; b++) {
  const fileName = `batch${String(b).padStart(2, '0')}.ts`;
  const filePath = path.join(batchDir, fileName);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing batch file: ${fileName}`);
    process.exit(1);
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  // Extract JSON-like array
  const match = content.match(/export const coreProgrammingBatch\d+: CoreProgrammingQuestion\[\] = (\[[\s\S]*\]);/);
  if (!match) {
    console.error(`Failed to parse questions array from ${fileName}`);
    process.exit(1);
  }
  try {
    const parsed = JSON.parse(match[1]);
    allQuestions.push(...parsed);
    console.log(`Loaded ${parsed.length} questions from ${fileName}`);
  } catch (err) {
    console.error(`JSON parse error in ${fileName}:`, err.message);
    process.exit(1);
  }
}

console.log(`\n--- AUDIT RESULTS FOR CORE PROGRAMMING (${allQuestions.length} TOTAL QUESTIONS) ---`);

// 1. Total count
if (allQuestions.length !== 500) {
  console.error(`❌ Total count mismatch: Expected 500, got ${allQuestions.length}`);
  process.exit(1);
}
console.log(`✓ Total Question Count: 500 / 500`);

// 2. ID sequence
const idSet = new Set();
for (let i = 0; i < allQuestions.length; i++) {
  const expectedId = `JS-P${String(i + 1).padStart(3, '0')}`;
  const q = allQuestions[i];
  if (q.id !== expectedId) {
    console.error(`❌ ID sequence error at index ${i}: Expected ${expectedId}, got ${q.id}`);
    process.exit(1);
  }
  if (idSet.has(q.id)) {
    console.error(`❌ Duplicate ID detected: ${q.id}`);
    process.exit(1);
  }
  idSet.add(q.id);
}
console.log(`✓ IDs: JS-P001 through JS-P500 strictly sequential with zero duplicates`);

// 3. Categories
const catCounts = {};
for (const q of allQuestions) {
  catCounts[q.category] = (catCounts[q.category] || 0) + 1;
}

let catOk = true;
for (const [cat, expected] of Object.entries(expectedCategories)) {
  const actual = catCounts[cat] || 0;
  if (actual !== expected) {
    console.error(`❌ Category count mismatch for "${cat}": Expected ${expected}, got ${actual}`);
    catOk = false;
  }
}
if (!catOk) process.exit(1);
console.log(`✓ Category Breakdown verified for all 13 categories:`);
Object.entries(catCounts).forEach(([k, v]) => console.log(`   - ${k}: ${v}`));

// 4. Difficulties
const diffCounts = {};
for (const q of allQuestions) {
  diffCounts[q.difficulty] = (diffCounts[q.difficulty] || 0) + 1;
}

let diffOk = true;
for (const [diff, expected] of Object.entries(expectedDifficulties)) {
  const actual = diffCounts[diff] || 0;
  if (actual !== expected) {
    console.error(`❌ Difficulty count mismatch for "${diff}": Expected ${expected}, got ${actual}`);
    diffOk = false;
  }
}
if (!diffOk) process.exit(1);
console.log(`✓ Difficulty Breakdown verified (125 Easy, 250 Medium, 100 Hard, 25 Expert):`);
Object.entries(diffCounts).forEach(([k, v]) => console.log(`   - ${k}: ${v}`));

// 5. Structure validation
for (const q of allQuestions) {
  if (!q.title || !q.starterCode || !q.solution || !q.problemStatement) {
    console.error(`❌ Missing essential fields in question ${q.id}`);
    process.exit(1);
  }
  if (!Array.isArray(q.testCases) || q.testCases.length === 0) {
    console.error(`❌ Missing testCases in question ${q.id}`);
    process.exit(1);
  }
}
console.log(`✓ All 500 questions have valid titles, problem statements, starter codes, solutions, and test cases!`);
console.log(`--- AUDIT PASSED 100% SUCCESSFULLY ---`);
