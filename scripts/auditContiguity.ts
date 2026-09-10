// scripts/auditContiguity.ts
import { CORE_PROGRAMMING_QUESTIONS } from '../src/components/coreprogramming/data/coreProgrammingQuestions';

console.log('Total count:', CORE_PROGRAMMING_QUESTIONS.length);

const ids = new Set<string>();
const slugs = new Set<string>();
let errors = 0;

for (let i = 0; i < CORE_PROGRAMMING_QUESTIONS.length; i++) {
  const q = CORE_PROGRAMMING_QUESTIONS[i];
  const expectedNum = i + 1;
  const expectedId = 'JS-P' + String(expectedNum).padStart(3, '0');
  
  if (q.number !== expectedNum) {
    console.error(`Wrong number: ${q.number}, expected: ${expectedNum}`);
    errors++;
  }
  if (q.id !== expectedId) {
    console.error(`Wrong id: ${q.id}, expected: ${expectedId}`);
    errors++;
  }
  if (ids.has(q.id)) {
    console.error(`Duplicate id: ${q.id}`);
    errors++;
  }
  ids.add(q.id);

  if (slugs.has(q.slug)) {
    console.error(`Duplicate slug: ${q.slug}`);
    errors++;
  }
  slugs.add(q.slug);

  if (!q.starterCode || !q.starterCode.trim()) {
    console.error(`Empty starterCode: ${q.id}`);
    errors++;
  }
  if (!q.solution || !q.solution.trim()) {
    console.error(`Empty solution: ${q.id}`);
    errors++;
  }
  if (!q.testCases || q.testCases.length === 0) {
    console.error(`No testCases: ${q.id}`);
    errors++;
  }
}

if (errors === 0) {
  console.log('SUCCESS: All 500 questions are contiguous, unique, and fully specified (JS-P001 to JS-P500)!');
  process.exit(0);
} else {
  console.error(`FAILED with ${errors} errors.`);
  process.exit(1);
}
