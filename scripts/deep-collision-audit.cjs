// scripts/deep-collision-audit.cjs
const fs = require('fs');
const path = require('path');

// 1. Load Core Programming (500)
const cpDir = path.join(__dirname, '..', 'src', 'components', 'coreprogramming', 'data', 'batches');
const cpQuestions = [];
for (let b = 1; b <= 10; b++) {
  const f = path.join(cpDir, `batch${String(b).padStart(2, '0')}.ts`);
  const content = fs.readFileSync(f, 'utf-8');
  const match = content.match(/export const coreProgrammingBatch\d+: CoreProgrammingQuestion\[\] = (\[[\s\S]*\]);/);
  if (match) cpQuestions.push(...JSON.parse(match[1]));
}

// 2. Load Frontend JS (1000)
const fjsDir = path.join(__dirname, '..', 'src', 'components', 'frontendjs', 'data', 'batches');
const fjsQuestions = [];
for (let b = 1; b <= 10; b++) {
  const f = path.join(fjsDir, `batch${String(b).padStart(2, '0')}.ts`);
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf-8');
    const match = content.match(/export const fjpBatch\d+: FrontendJsQuestion\[\] = (\[[\s\S]*\]);/);
    if (match) fjsQuestions.push(...JSON.parse(match[1]));
  }
}

// 3. Load Machine Coding
const mcCatalogFile = path.join(__dirname, '..', 'src', 'components', 'machinecoding', 'data', 'masterCatalog.ts');
const mcContent = fs.readFileSync(mcCatalogFile, 'utf-8');
const mcTitles = [...mcContent.matchAll(/"title":\s*"([^"]+)"/g)].map(m => m[1]);

// 4. Load DSA
const dsaDir = path.join(__dirname, '..', 'src', 'components', 'dsa', 'data', 'batches');
const dsaTitles = [];
for (let b = 1; b <= 10; b++) {
  const f = path.join(dsaDir, `batch${String(b).padStart(2, '0')}.ts`);
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf-8');
    const titles = [...content.matchAll(/"title":\s*"([^"]+)"/g)].map(m => m[1]);
    dsaTitles.push(...titles);
  }
}

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

console.log(`Core Programming: ${cpQuestions.length}`);
console.log(`Frontend JS: ${fjsQuestions.length}`);
console.log(`Machine Coding: ${mcTitles.length}`);
console.log(`DSA: ${dsaTitles.length}`);

const dsaNorm = new Map(dsaTitles.map(t => [normalize(t), t]));
const fjsNorm = new Map(fjsQuestions.map(q => [normalize(q.title), q.title]));
const mcNorm = new Map(mcTitles.map(t => [normalize(t), t]));

const matchesWithDSA = [];
const matchesWithFJS = [];
const matchesWithMC = [];

cpQuestions.forEach(cp => {
  const n = normalize(cp.title);
  if (dsaNorm.has(n)) matchesWithDSA.push({ cpId: cp.id, cpTitle: cp.title, dsaTitle: dsaNorm.get(n) });
  if (fjsNorm.has(n)) matchesWithFJS.push({ cpId: cp.id, cpTitle: cp.title, fjsTitle: fjsNorm.get(n) });
  if (mcNorm.has(n)) matchesWithMC.push({ cpId: cp.id, cpTitle: cp.title, mcTitle: mcNorm.get(n) });
});

console.log('\nExact matches with DSA:', matchesWithDSA);
console.log('Exact matches with FJS:', matchesWithFJS);
console.log('Exact matches with MC:', matchesWithMC);

// Also check partial / substring matches that might be direct duplicates
const commonAlgoNames = [
  'two sum', 'three sum', 'trapping rain water', 'container with most water', 'sliding window maximum',
  'merge intervals', 'insert interval', 'search in rotated', 'find minimum in rotated', 'product of array except self',
  'valid parentheses', 'longest palindromic substring', 'coin change', 'word break', 'course schedule',
  'median of two sorted arrays', 'longest increasing subsequence', 'maximum subarray', 'climbing stairs'
];

const questionableInCP = [];
cpQuestions.forEach(cp => {
  const t = cp.title.toLowerCase();
  for (const name of commonAlgoNames) {
    if (t.includes(name)) {
      questionableInCP.push({ id: cp.id, title: cp.title, matchedKeyword: name, category: cp.category });
      break;
    }
  }
});

console.log('\nAlgorithmic DSA questions in Core Programming that should be pure JS programming instead:');
console.log(JSON.stringify(questionableInCP, null, 2));
