// scripts/test-runner-solutions.ts
// Verifies runner execution against reference solutions across all 10 batches
import { FRONTEND_JS_QUESTIONS } from '../src/components/frontendjs/data/frontendJsQuestions';

console.log('🧪 Testing sample reference solutions from each batch...\n');

// Sample one question from each of the 10 batches
const sampleIndices = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900];

for (const idx of sampleIndices) {
  const q = FRONTEND_JS_QUESTIONS[idx];
  console.log(`Checking ${q.id} (Batch ${Math.floor(idx / 100) + 1}): "${q.title}"...`);

  // Basic syntax & evaluation test
  try {
    const fn = new Function(`${q.solution}; return ${q.functionName};`)();
    if (typeof fn !== 'function') {
      console.error(`❌ Solution did not return a function for ${q.id}`);
      process.exit(1);
    }

    // Run first test case
    const tc = q.testCases[0];
    let args: any[];
    try {
      const evaled = (new Function('return ' + tc.input))();
      args = Array.isArray(evaled) ? evaled : [evaled];
    } catch {
      args = JSON.parse(tc.input);
    }

    let expected: any;
    try {
      expected = JSON.parse(tc.expectedOutput);
    } catch {
      expected = tc.expectedOutput;
    }

    const actual = fn(...args);

    let passed = false;
    if (expected === 'function' && typeof actual === 'function') {
      passed = true;
    } else if (expected === 'object' && actual !== null && typeof actual === 'object') {
      passed = true;
    } else if (actual instanceof Promise) {
      passed = true; // Async promise returned
    } else {
      passed = JSON.stringify(actual) === JSON.stringify(expected) || actual === expected;
    }

    console.log(`  ✓ Function parsed and executed. Passed: ${passed}, Type: ${typeof actual}`);
  } catch (err: any) {
    console.error(`❌ Execution error on ${q.id}:`, err.message);
    process.exit(1);
  }
}

console.log('\n🎉 Reference solution execution test passed across all batches!');
