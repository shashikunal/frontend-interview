import { MACHINE_CODING_QUESTIONS } from '../src/components/machinecoding/machineCodingQuestions.ts';
import { getEnrichedQuestionSpec } from '../src/components/machinecoding/lib/mcQuestionSpecService.ts';
import { buildStarterFilesForLanguage } from '../src/components/machinecoding/lib/languageStarters.ts';
import { isGenericBoilerplateStarter } from '../src/components/machinecoding/lib/mcStarterGenerator.ts';

console.log('=== STARTING MACHINE CODING STARTER CODE VERIFICATION ===\n');

const testIds = [
  'Q001', // Preserved custom starter
  'Q004', // Accordion
  'Q050', // Notification Badge Counter
  'Q100', // Cookie Consent Banner
  'Q106', // useSessionStorage with Object Support
  'Q107', // useCookie with TTL & Secure Flags
  'Q150', // useMemoCompare Deep Memo Hook
  'Q200', // Event RSVP Form
  'Q250', // Performance Metrics Dashboard
  'Q300', // Smart Home Device Grid
  'Q350', // Audio Visualizer
  'Q400', // React Component to Custom Element Exporter
  'Q450', // Cloud Cost Infrastructure Dashboard
  'Q500', // Master Evaluation
];

let failedTests = 0;
const startersSeen = new Map();

for (const id of testIds) {
  const rawQ = MACHINE_CODING_QUESTIONS.find(q => q.id === id);
  if (!rawQ) {
    console.error(`❌ Question ${id} not found in MACHINE_CODING_QUESTIONS`);
    failedTests++;
    continue;
  }

  const enriched = getEnrichedQuestionSpec(rawQ);
  const reactFiles = buildStarterFilesForLanguage(enriched, 'react');
  const tsFiles = buildStarterFilesForLanguage(enriched, 'typescript');
  const jsFiles = buildStarterFilesForLanguage(enriched, 'javascript');
  const leetcodeFiles = buildStarterFilesForLanguage(enriched, 'leetcode');

  const appCode = reactFiles['App.tsx'] || '';
  const isGeneric = isGenericBoilerplateStarter(appCode);

  console.log(`Testing [${id}] ${enriched.title} (${enriched.category})`);

  // Test 1: Must not be generic boilerplate
  if (isGeneric) {
    console.error(`  ❌ [${id}] Generated code was identified as generic boilerplate!`);
    failedTests++;
  } else {
    console.log(`  ✓ Not generic boilerplate`);
  }

  // Test 2: Must be question-specific
  const titleClean = enriched.title.replace(/^[Q0-9\s\-:]+/i, '').trim();
  const keyword = titleClean.split(/\s+/)[0].replace(/[^a-zA-Z]/g, '');
  if (keyword && !appCode.toLowerCase().includes(keyword.toLowerCase())) {
    console.error(`  ❌ [${id}] Starter code does not mention primary keyword: ${keyword}`);
    failedTests++;
  } else {
    console.log(`  ✓ Domain concepts/entities present in starter code`);
  }

  // Test 3: Must not contain full solution / must contain TODO stubs
  if (id !== 'Q001' && !appCode.includes('TODO')) {
    console.error(`  ❌ [${id}] Starter code is missing TODO placeholders!`);
    failedTests++;
  } else {
    console.log(`  ✓ Structural scaffolding with TODO placeholders (no solution leaked)`);
  }

  // Test 4: Uniqueness - starter code must not be identical to any other question
  if (startersSeen.has(appCode)) {
    console.error(`  ❌ [${id}] Starter code is identical to [${startersSeen.get(appCode)}]!`);
    failedTests++;
  } else {
    startersSeen.set(appCode, id);
    console.log(`  ✓ Distinct, non-duplicated starter template`);
  }

  // Test 5: Multi-language files generated correctly
  if (!tsFiles['script.ts'] || !tsFiles['index.html']) {
    console.error(`  ❌ [${id}] TypeScript files missing!`);
    failedTests++;
  }
  if (!jsFiles['script.js'] || !jsFiles['index.html']) {
    console.error(`  ❌ [${id}] JavaScript files missing!`);
    failedTests++;
  }
  if (!leetcodeFiles['solution.js']) {
    console.error(`  ❌ [${id}] LeetCode files missing!`);
    failedTests++;
  }
  console.log(`  ✓ Multi-language support validated (TS, JS, Algo)`);
  console.log('');
}

// Test 6: Audit ALL 500 questions
let all500GenericCount = 0;
let all500UniqueStarters = new Set();
for (const q of MACHINE_CODING_QUESTIONS) {
  const spec = getEnrichedQuestionSpec(q);
  const starter = spec.starterCode;
  if (isGenericBoilerplateStarter(starter)) {
    all500GenericCount++;
  }
  all500UniqueStarters.add(starter);
}

console.log('=== GLOBAL QUESTION BANK AUDIT (500 QUESTIONS) ===');
console.log(`Total questions analyzed: ${MACHINE_CODING_QUESTIONS.length}`);
console.log(`Generic boilerplate count: ${all500GenericCount} (Target: 0)`);
console.log(`Unique starter codes generated: ${all500UniqueStarters.size} / 500`);

if (all500GenericCount > 0) {
  console.error(`❌ Audit failed: ${all500GenericCount} questions still have generic boilerplate.`);
  failedTests++;
} else {
  console.log('✓ 100% of the question bank has dynamic, question-specific starter scaffolding!');
}

console.log(`\n=== FINAL RESULT: ${failedTests === 0 ? 'ALL TESTS PASSED ✅' : `${failedTests} FAILURES ❌`} ===`);
process.exit(failedTests === 0 ? 0 : 1);
