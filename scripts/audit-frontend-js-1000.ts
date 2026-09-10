// scripts/audit-frontend-js-1000.ts
// Comprehensive quality audit verifying all 1,000 Frontend JavaScript questions
import { FRONTEND_JS_QUESTIONS } from '../src/components/frontendjs/data/frontendJsQuestions';

console.log('🔍 Running comprehensive audit on 1,000 Frontend JavaScript Questions...\n');

let errors = 0;

// 1. Total count
if (FRONTEND_JS_QUESTIONS.length !== 1000) {
  console.error(`❌ Total question count mismatch: got ${FRONTEND_JS_QUESTIONS.length}, expected 1000`);
  errors++;
} else {
  console.log('✅ Question count is EXACTLY 1,000');
}

// 2. Unique IDs and Slugs
const ids = new Set<string>();
const slugs = new Set<string>();
const duplicateIds: string[] = [];
const duplicateSlugs: string[] = [];

for (let i = 0; i < FRONTEND_JS_QUESTIONS.length; i++) {
  const q = FRONTEND_JS_QUESTIONS[i];
  const expectedId = `FJP-${String(i + 1).padStart(4, '0')}`;

  if (q.id !== expectedId) {
    console.error(`❌ Question ID sequence error at index ${i}: got ${q.id}, expected ${expectedId}`);
    errors++;
  }

  if (ids.has(q.id)) {
    duplicateIds.push(q.id);
  } else {
    ids.add(q.id);
  }

  if (slugs.has(q.slug)) {
    duplicateSlugs.push(q.slug);
  } else {
    slugs.add(q.slug);
  }

  if (!q.title || q.title.trim().length === 0) {
    console.error(`❌ Empty title in question ${q.id}`);
    errors++;
  }

  if (!q.starterCode || q.starterCode.trim().length === 0) {
    console.error(`❌ Missing starter code in question ${q.id}`);
    errors++;
  }

  if (!q.solution || q.solution.trim().length === 0) {
    console.error(`❌ Missing solution in question ${q.id}`);
    errors++;
  }

  if (!q.testCases || q.testCases.length < 1) {
    console.error(`❌ Insufficient test cases in question ${q.id}`);
    errors++;
  }

  if (!q.difficulty || !['Easy', 'Medium', 'Hard'].includes(q.difficulty)) {
    console.error(`❌ Invalid difficulty "${q.difficulty}" in question ${q.id}`);
    errors++;
  }
}

if (duplicateIds.length > 0) {
  console.error(`❌ Duplicate IDs detected:`, duplicateIds);
  errors++;
} else {
  console.log('✅ All 1,000 Question IDs are strictly unique (FJP-0001 to FJP-1000)');
}

if (duplicateSlugs.length > 0) {
  console.error(`❌ Duplicate Slugs detected:`, duplicateSlugs);
  errors++;
} else {
  console.log('✅ All 1,000 Question Slugs are strictly unique');
}

// 3. Category distribution
const categoryCounts: Record<string, number> = {};
for (const q of FRONTEND_JS_QUESTIONS) {
  categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
}

console.log('\n📊 Category Distribution:');
for (const [cat, count] of Object.entries(categoryCounts)) {
  console.log(`  - ${cat}: ${count} questions`);
}

// 4. Difficulty distribution
const diffCounts: Record<string, number> = {};
for (const q of FRONTEND_JS_QUESTIONS) {
  diffCounts[q.difficulty] = (diffCounts[q.difficulty] || 0) + 1;
}

console.log('\n📈 Difficulty Distribution:');
for (const [diff, count] of Object.entries(diffCounts)) {
  console.log(`  - ${diff}: ${count} questions`);
}

if (errors === 0) {
  console.log('\n🎉 ALL QUALITY GATES PASSED! The 1,000 question dataset is 100% compliant and production-ready.');
} else {
  console.error(`\n❌ Quality gate audit failed with ${errors} error(s).`);
  process.exit(1);
}
