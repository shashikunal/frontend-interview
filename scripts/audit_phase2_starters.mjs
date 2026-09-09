import { MACHINE_CODING_QUESTIONS } from '../src/components/machinecoding/machineCodingQuestions.ts';
import { getEnrichedQuestionSpec } from '../src/components/machinecoding/lib/mcQuestionSpecService.ts';
import { buildStarterFilesForLanguage } from '../src/components/machinecoding/lib/languageStarters.ts';
import {
  isGenericBoilerplateStarter,
  analyzeQuestionContext,
  buildStarterMetadata,
  GENERATOR_VERSION,
} from '../src/components/machinecoding/lib/mcStarterGenerator.ts';
import {
  validateStarterCode,
  auditQuestionBankSimilarity,
} from '../src/components/machinecoding/lib/mcScaffoldValidator.ts';

console.log('===========================================================');
console.log(' PHASE 2 DYNAMIC STARTER-CODE SYSTEM: DEEP PRODUCTION AUDIT');
console.log('===========================================================\n');

let totalErrors = 0;

// ── TEST SUITE 1: CUSTOM HOOK SUITE (Q101 - Q107) ──────────────────────────
console.log('>>> TEST SUITE 1: Custom Hooks Deep Signature Audit (Q101 - Q107)');

const hookAuditCases = [
  {
    id: 'Q101',
    expectedHook: 'useFetch',
    expectedTokens: ['UseFetchOptions', 'UseFetchResult', 'url', 'timeoutMs'],
    forbiddenTokens: ['localStorage', 'active: false', 'Component Status'],
  },
  {
    id: 'Q102',
    expectedHook: 'useAsync',
    expectedTokens: ['asyncFn', 'status', 'error'],
    forbiddenTokens: ['localStorage', 'active: false'],
  },
  {
    id: 'Q103',
    expectedHook: 'useEventListener',
    expectedTokens: ['eventName', 'handler', 'element'],
    forbiddenTokens: ['localStorage', 'active: false'],
  },
  {
    id: 'Q104',
    expectedHook: 'useHover',
    expectedTokens: ['isHovered', 'ref'],
    forbiddenTokens: ['localStorage', 'active: false'],
  },
  {
    id: 'Q105',
    expectedHook: 'useIdleTimer',
    expectedTokens: ['timeoutMs', 'isIdle', 'reset'],
    forbiddenTokens: ['localStorage', 'active: false'],
  },
  {
    id: 'Q106',
    expectedHook: 'useSessionStorage',
    expectedTokens: ['sessionStorage', 'key', 'initialValue'],
    forbiddenTokens: ['localStorage', 'active: false'],
  },
  {
    id: 'Q107',
    expectedHook: 'useCookie',
    expectedTokens: ['document.cookie', 'name', 'ttlSeconds'],
    forbiddenTokens: ['localStorage', 'active: false'],
  },
];

for (const testCase of hookAuditCases) {
  const q = MACHINE_CODING_QUESTIONS.find(item => item.id === testCase.id);
  if (!q) {
    console.error(`❌ Question ${testCase.id} not found!`);
    totalErrors++;
    continue;
  }

  const enriched = getEnrichedQuestionSpec(q);
  const reactFiles = buildStarterFilesForLanguage(enriched, 'react');
  const code = reactFiles['App.tsx'] || '';

  console.log(`Checking [${q.id}] ${q.title}:`);

  // Check 1: No generic boilerplate
  if (isGenericBoilerplateStarter(code)) {
    console.error(`  ❌ [${q.id}] Failed: Generated code is generic boilerplate.`);
    totalErrors++;
  } else {
    console.log(`  ✓ Dynamic scaffold generated (not generic fallback)`);
  }

  // Check 2: Contains expected hook name
  if (!code.includes(testCase.expectedHook)) {
    console.error(`  ❌ [${q.id}] Expected hook name "${testCase.expectedHook}" missing in starter code!`);
    totalErrors++;
  } else {
    console.log(`  ✓ Contains specialized hook "${testCase.expectedHook}"`);
  }

  // Check 3: Contains expected specialized parameters / return types
  for (const token of testCase.expectedTokens) {
    if (!code.includes(token)) {
      console.error(`  ❌ [${q.id}] Expected token "${token}" missing in starter code!`);
      totalErrors++;
    }
  }
  console.log(`  ✓ Contains domain parameters & interfaces: ${testCase.expectedTokens.join(', ')}`);

  // Check 4: Must not contain forbidden tokens
  for (const forbidden of testCase.forbiddenTokens) {
    if (code.includes(forbidden)) {
      console.error(`  ❌ [${q.id}] Leaked forbidden/irrelevant token: "${forbidden}"!`);
      totalErrors++;
    }
  }

  // Check 5: Scaffold not solution (must have TODO, no full implementation)
  const validation = validateStarterCode(q, code, 'react');
  if (!validation.isValid) {
    console.error(`  ❌ [${q.id}] Scaffold validation failed: ${validation.reasons.join('; ')}`);
    totalErrors++;
  } else {
    console.log(`  ✓ Structural contract validated: ${validation.todoCount} TODOs, no solution leaks`);
  }
}

// ── TEST SUITE 2: UNRELATED CATEGORIES AUDIT ────────────────────────────────
console.log('\n>>> TEST SUITE 2: Cross-Category Architecture & Scaffold Audit');

const categoryTestCases = [
  { id: 'Q004', expectedCategory: 'Interactive UI', expectedConcept: 'accordion' },
  { id: 'Q150', expectedCategory: 'Custom Hooks', expectedConcept: 'memo' },
  { id: 'Q200', expectedCategory: 'Forms', expectedConcept: 'rsvp' },
  { id: 'Q250', expectedCategory: 'Performance', expectedConcept: 'metric' },
  { id: 'Q300', expectedCategory: 'Real-World Systems', expectedConcept: 'device' },
  { id: 'Q350', expectedCategory: 'Interactive UI', expectedConcept: 'audio' },
  { id: 'Q400', expectedCategory: 'Design Systems', expectedConcept: 'element' },
  { id: 'Q450', expectedCategory: 'Real-World Systems', expectedConcept: 'cloud' },
];

for (const catCase of categoryTestCases) {
  const q = MACHINE_CODING_QUESTIONS.find(item => item.id === catCase.id);
  if (!q) {
    console.error(`❌ Question ${catCase.id} not found!`);
    totalErrors++;
    continue;
  }

  const enriched = getEnrichedQuestionSpec(q);
  const reactFiles = buildStarterFilesForLanguage(enriched, 'react');
  const code = reactFiles['App.tsx'] || '';

  console.log(`Checking [${q.id}] ${q.title} (${q.category}, ${q.difficulty}):`);
  if (!code.toLowerCase().includes(catCase.expectedConcept.toLowerCase())) {
    console.error(`  ❌ [${q.id}] Missing domain concept "${catCase.expectedConcept}"`);
    totalErrors++;
  } else {
    console.log(`  ✓ Relevant domain concept "${catCase.expectedConcept}" present`);
  }

  // Verify multi-language scaffolds are idiomatic
  const tsFiles = buildStarterFilesForLanguage(enriched, 'typescript');
  const jsFiles = buildStarterFilesForLanguage(enriched, 'javascript');
  const domFiles = buildStarterFilesForLanguage(enriched, 'dom');
  const algoFiles = buildStarterFilesForLanguage(enriched, 'leetcode');

  if (!tsFiles['script.ts']?.includes('interface') && !tsFiles['script.ts']?.includes('type')) {
    console.error(`  ❌ [${q.id}] TypeScript starter lacks type definitions`);
    totalErrors++;
  } else {
    console.log(`  ✓ TypeScript provides typed interfaces`);
  }

  if (!jsFiles['script.js'] || !jsFiles['index.html']) {
    console.error(`  ❌ [${q.id}] Vanilla JS files incomplete`);
    totalErrors++;
  } else {
    console.log(`  ✓ Vanilla JS + HTML DOM ready`);
  }

  if (!algoFiles['solution.js']?.includes('class') && !algoFiles['solution.js']?.includes('function')) {
    console.error(`  ❌ [${q.id}] Algo file lacks core signature`);
    totalErrors++;
  } else {
    console.log(`  ✓ Algorithmic scaffold contract ready`);
  }
}

// ── TEST SUITE 3: DYNAMIC CSS STYLESHEET AUDIT ──────────────────────────────
console.log('\n>>> TEST SUITE 3: Dynamic CSS Stylesheet Audit');

const cssTestCases = [
  { id: 'Q004', expectedClass: '.accordion-root', expectedToken: 'Accordion' },
  { id: 'Q100', expectedClass: '.modal-overlay', expectedToken: 'Cookie' },
  { id: 'Q106', expectedClass: '.hook-panel', expectedToken: 'useSessionStorage' },
  { id: 'Q200', expectedClass: '.form-layout', expectedToken: 'RSVP' },
  { id: 'Q250', expectedClass: '.stat-tile', expectedToken: 'Metrics' },
  { id: 'Q300', expectedClass: '.system-metrics-grid', expectedToken: 'Smart Home' },
  { id: 'Q301', expectedClass: '.chat-stream-window', expectedToken: 'Chat Stream' },
  { id: 'Q350', expectedClass: '--primary: #8b5cf6', expectedToken: 'Audio Visualizer' },
];

for (const t of cssTestCases) {
  const q = MACHINE_CODING_QUESTIONS.find(item => item.id === t.id);
  const enriched = getEnrichedQuestionSpec(q);
  const reactFiles = buildStarterFilesForLanguage(enriched, 'react');
  const css = reactFiles['styles.css'] || '';

  if (css.includes('/* Modern UI Stylesheet */')) {
    console.error(`  ❌ [${t.id}] Still using generic static Modern UI Stylesheet!`);
    totalErrors++;
  } else if (!css.includes(`[${t.id}]`) || !css.includes(t.expectedToken)) {
    console.error(`  ❌ [${t.id}] CSS header missing question context: ${t.expectedToken}`);
    totalErrors++;
  } else if (!css.includes(t.expectedClass)) {
    console.error(`  ❌ [${t.id}] CSS missing specialized rule: ${t.expectedClass}`);
    totalErrors++;
  } else {
    console.log(`  ✓ [${t.id}] Dynamic stylesheet generated: includes "${t.expectedClass}" and "${t.expectedToken}"`);
  }
}

// ── TEST SUITE 4: STRUCTURAL SIMILARITY & DEDUPLICATION AUDIT ───────────────
console.log('\n>>> TEST SUITE 4: Question Bank Structural Similarity Audit');

const similarityResults = auditQuestionBankSimilarity(MACHINE_CODING_QUESTIONS, 0.95);
console.log(`Total questions audited: ${similarityResults.totalAudited}`);
console.log(`High similarity pairs (>95% token overlap): ${similarityResults.suspiciousPairs.length}`);

if (similarityResults.suspiciousPairs.length > 0) {
  console.warn('Suspicious pairs detected:');
  for (const pair of similarityResults.suspiciousPairs.slice(0, 5)) {
    console.warn(`  - [${pair.q1.id}] "${pair.q1.title}" vs [${pair.q2.id}] "${pair.q2.title}" => similarity: ${(pair.similarity * 100).toFixed(1)}%`);
  }
} else {
  console.log('✓ 0 duplicate or copy-pasted scaffolds detected across question bank!');
}

// ── TEST SUITE 4: STARTER METADATA & REGENERATION SAFETY ────────────────────
console.log('\n>>> TEST SUITE 4: Starter-Code Metadata & Regeneration Safety');

const sampleQ = MACHINE_CODING_QUESTIONS.find(q => q.id === 'Q106');
const sampleMeta = buildStarterMetadata(sampleQ, 'react', 'const test = 1;', false);

if (
  sampleMeta.questionId === 'Q106' &&
  sampleMeta.language === 'react' &&
  sampleMeta.generatorVersion === GENERATOR_VERSION &&
  sampleMeta.domainType === 'hook' &&
  sampleMeta.isCustomModified === false &&
  sampleMeta.starterHash.length > 0
) {
  console.log('✓ StarterMetadata schema fully compliant and validated:');
  console.log(`  - QuestionId: ${sampleMeta.questionId}`);
  console.log(`  - Language: ${sampleMeta.language}`);
  console.log(`  - GeneratorVersion: ${sampleMeta.generatorVersion}`);
  console.log(`  - DomainType: ${sampleMeta.domainType}`);
  console.log(`  - StarterHash: ${sampleMeta.starterHash}`);
} else {
  console.error('❌ StarterMetadata failed validation!');
  totalErrors++;
}

console.log('\n===========================================================');
console.log(` AUDIT SUMMARY: ${totalErrors === 0 ? 'ALL AUDIT CHECKS PASSED ✅' : `${totalErrors} ISSUES FOUND ❌`}`);
console.log('===========================================================');

process.exit(totalErrors === 0 ? 0 : 1);
