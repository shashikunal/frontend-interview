// scripts/cross-track-audit.cjs
const fs = require('fs');
const path = require('path');

// 1. Load Core Programming (500)
const cpDir = path.join(__dirname, '..', 'src', 'components', 'coreprogramming', 'data', 'batches');
const cpQuestions = [];
for (let b = 1; b <= 10; b++) {
  const f = path.join(cpDir, `batch${String(b).padStart(2, '0')}.ts`);
  const content = fs.readFileSync(f, 'utf-8');
  const match = content.match(/export const coreProgrammingBatch\d+: CoreProgrammingQuestion\[\] = (\[[\s\S]*\]);/);
  if (match) {
    cpQuestions.push(...JSON.parse(match[1]));
  }
}

console.log(`Loaded ${cpQuestions.length} Core Programming questions.`);

// 2. Load Frontend JS (1000)
const fjsDir = path.join(__dirname, '..', 'src', 'components', 'frontendjs', 'data', 'batches');
const fjsQuestions = [];
for (let b = 1; b <= 10; b++) {
  const f = path.join(fjsDir, `batch${String(b).padStart(2, '0')}.ts`);
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf-8');
    const match = content.match(/export const fjpBatch\d+: FrontendJsQuestion\[\] = (\[[\s\S]*\]);/);
    if (match) {
      fjsQuestions.push(...JSON.parse(match[1]));
    }
  }
}
console.log(`Loaded ${fjsQuestions.length} Frontend JS questions.`);

// 3. Load Machine Coding
const mcCatalogFile = path.join(__dirname, '..', 'src', 'components', 'machinecoding', 'data', 'masterCatalog.ts');
let mcQuestions = [];
if (fs.existsSync(mcCatalogFile)) {
  const content = fs.readFileSync(mcCatalogFile, 'utf-8');
  const match = content.match(/export const MASTER_CATALOG_500: MachineCodingQuestion\[\] = (\[[\s\S]*\]);/);
  if (match) {
    try {
      mcQuestions = JSON.parse(match[1]);
    } catch {
      // rough regex
      const titles = [...content.matchAll(/"title":\s*"([^"]+)"/g)].map(m => m[1]);
      mcQuestions = titles.map((t, idx) => ({ id: `MC-${idx}`, title: t }));
    }
  } else {
    const titles = [...content.matchAll(/"title":\s*"([^"]+)"/g)].map(m => m[1]);
    mcQuestions = titles.map((t, idx) => ({ id: `MC-${idx}`, title: t }));
  }
}
console.log(`Loaded ${mcQuestions.length} Machine Coding questions.`);

// 4. Load DSA
const dsaDir = path.join(__dirname, '..', 'src', 'components', 'dsa', 'data', 'batches');
const dsaQuestions = [];
if (fs.existsSync(dsaDir)) {
  for (let b = 1; b <= 10; b++) {
    const f = path.join(dsaDir, `batch${String(b).padStart(2, '0')}.ts`);
    if (fs.existsSync(f)) {
      const content = fs.readFileSync(f, 'utf-8');
      const match = content.match(/export const dsaBatch\d+: DSAQuestion\[\] = (\[[\s\S]*\]);/);
      if (match) {
        try {
          dsaQuestions.push(...JSON.parse(match[1]));
        } catch {
          const titles = [...content.matchAll(/"title":\s*"([^"]+)"/g)].map(m => m[1]);
          dsaQuestions.push(...titles.map((t, idx) => ({ id: `DSA-B${b}-${idx}`, title: t })));
        }
      }
    }
  }
}
console.log(`Loaded ${dsaQuestions.length} DSA questions.`);

// Deduplication checks
function normalizeTitle(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const fjsMap = new Map();
fjsQuestions.forEach(q => fjsMap.set(normalizeTitle(q.title), q));

const mcMap = new Map();
mcQuestions.forEach(q => mcMap.set(normalizeTitle(q.title), q));

const dsaMap = new Map();
dsaQuestions.forEach(q => dsaMap.set(normalizeTitle(q.title), q));

console.log('\n--- Cross-Track Collision Analysis ---');
let cpVsFjsCollisions = [];
let cpVsMcCollisions = [];
let cpVsDsaCollisions = [];

cpQuestions.forEach(cp => {
  const norm = normalizeTitle(cp.title);
  if (fjsMap.has(norm)) {
    cpVsFjsCollisions.push({ cpId: cp.id, cpTitle: cp.title, matchId: fjsMap.get(norm).id, matchTitle: fjsMap.get(norm).title });
  }
  if (mcMap.has(norm)) {
    cpVsMcCollisions.push({ cpId: cp.id, cpTitle: cp.title, matchId: mcMap.get(norm).id, matchTitle: mcMap.get(norm).title });
  }
  if (dsaMap.has(norm)) {
    cpVsDsaCollisions.push({ cpId: cp.id, cpTitle: cp.title, matchId: dsaMap.get(norm).id, matchTitle: dsaMap.get(norm).title });
  }
});

console.log(`Core Programming vs Frontend JS exact title matches: ${cpVsFjsCollisions.length}`);
if (cpVsFjsCollisions.length > 0) {
  console.log('Sample collisions:', cpVsFjsCollisions.slice(0, 10));
}

console.log(`Core Programming vs Machine Coding exact title matches: ${cpVsMcCollisions.length}`);
if (cpVsMcCollisions.length > 0) {
  console.log('Sample collisions:', cpVsMcCollisions.slice(0, 10));
}

console.log(`Core Programming vs DSA exact title matches: ${cpVsDsaCollisions.length}`);
if (cpVsDsaCollisions.length > 0) {
  console.log('Sample collisions:', cpVsDsaCollisions.slice(0, 10));
}

// Internal duplicate check in Core Programming
const cpTitleSet = new Set();
const internalCpDups = [];
cpQuestions.forEach(q => {
  const norm = normalizeTitle(q.title);
  if (cpTitleSet.has(norm)) {
    internalCpDups.push({ id: q.id, title: q.title });
  }
  cpTitleSet.add(norm);
});
console.log(`Internal duplicate titles in Core Programming: ${internalCpDups.length}`);
if (internalCpDups.length > 0) {
  console.log('Sample internal dups:', internalCpDups.slice(0, 10));
}
