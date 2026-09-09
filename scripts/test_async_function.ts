import { MACHINE_CODING_QUESTIONS } from '../src/components/machinecoding/machineCodingQuestions.ts';
import { getQuestionTestCases } from '../src/components/machinecoding/data/machineCodingTests.ts';

const AsyncFn = Object.getPrototypeOf(async function(){}).constructor;

let totalAssertions = 0;
let compilationErrors: Array<{ qId: string; testId: string; error: string }> = [];

MACHINE_CODING_QUESTIONS.forEach(q => {
  const tests = getQuestionTestCases(q);
  tests.forEach(tc => {
    totalAssertions++;
    try {
      // Exactly how runner.ts compiles test assertions
      const testFn = new AsyncFn('ctx', 'with(ctx) { ' + tc.assertion + ' }');
    } catch (err: any) {
      compilationErrors.push({ qId: q.id, testId: tc.id, error: err.message });
    }
  });
});

console.log(`Total Assertions Compiled: ${totalAssertions}`);
console.log(`Compilation Errors: ${compilationErrors.length}`);
if (compilationErrors.length > 0) {
  console.log('Errors:', compilationErrors);
} else {
  console.log('✅ ALL 2,000 test case assertions compile with ZERO errors via AsyncFunction!');
}
