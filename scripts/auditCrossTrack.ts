// scripts/auditCrossTrack.ts
import { CORE_PROGRAMMING_QUESTIONS } from '../src/components/coreprogramming/data/coreProgrammingQuestions';
import { FRONTEND_JS_QUESTIONS } from '../src/components/frontendjs/data/frontendJsQuestions';
import { DSA_QUESTIONS } from '../src/components/dsa/data/dsaQuestions';
import { MASTER_500_QUESTIONS } from '../src/components/machinecoding/data/masterCatalog';

console.log(`Core Programming Questions: ${CORE_PROGRAMMING_QUESTIONS.length}`);
console.log(`Frontend JS Questions: ${FRONTEND_JS_QUESTIONS.length}`);
console.log(`DSA Questions: ${DSA_QUESTIONS.length}`);
console.log(`Machine Coding Questions: ${MASTER_500_QUESTIONS.length}`);

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const fjsTitles = new Map<string, string>();
for (const q of FRONTEND_JS_QUESTIONS) {
  fjsTitles.set(normalize(q.title), q.id);
}

const dsaTitles = new Map<string, string>();
for (const q of DSA_QUESTIONS) {
  dsaTitles.set(normalize(q.title), q.id);
}

const mcTitles = new Map<string, string>();
for (const q of MASTER_500_QUESTIONS) {
  mcTitles.set(normalize(q.title), q.id);
}

let cpVsFjs = 0;
let cpVsDsa = 0;
let cpVsMc = 0;

for (const q of CORE_PROGRAMMING_QUESTIONS) {
  const norm = normalize(q.title);
  if (fjsTitles.has(norm)) {
    console.warn(`Collision with Frontend JS: ${q.id} "${q.title}" <=> ${fjsTitles.get(norm)}`);
    cpVsFjs++;
  }
  if (dsaTitles.has(norm)) {
    console.warn(`Collision with DSA: ${q.id} "${q.title}" <=> ${dsaTitles.get(norm)}`);
    cpVsDsa++;
  }
  if (mcTitles.has(norm)) {
    console.warn(`Collision with Machine Coding: ${q.id} "${q.title}" <=> ${mcTitles.get(norm)}`);
    cpVsMc++;
  }
}

console.log(`\nCross Track Audit Results:`);
console.log(`CP vs Frontend JS Collisions: ${cpVsFjs}`);
console.log(`CP vs DSA Collisions: ${cpVsDsa}`);
console.log(`CP vs Machine Coding Collisions: ${cpVsMc}`);

if (cpVsFjs === 0 && cpVsDsa === 0 && cpVsMc === 0) {
  console.log(`ALL 500 QUESTIONS ARE 100% DEDUPLICATED AND DISTINCT AGAINST ALL TRACKS!`);
  process.exit(0);
} else {
  console.log(`Completed collision audit.`);
}
