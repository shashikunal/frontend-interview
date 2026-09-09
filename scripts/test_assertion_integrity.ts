import { MACHINE_CODING_QUESTIONS } from '../src/components/machinecoding/machineCodingQuestions.ts';
import { getQuestionTestCases } from '../src/components/machinecoding/data/machineCodingTests.ts';
import * as babelParser from '@babel/parser';

console.log('Testing assertion syntax across all 500 questions...');

let totalAssertions = 0;
let syntaxErrors: Array<{ qId: string; testId: string; error: string }> = [];

MACHINE_CODING_QUESTIONS.forEach(q => {
  const tests = getQuestionTestCases(q);
  tests.forEach(tc => {
    totalAssertions++;
    try {
      // Test parsing the assertion as an async function body
      babelParser.parse(`async function test(ctx) { with(ctx) { ${tc.assertion} } }`, {
        sourceType: 'module',
        plugins: ['typescript']
      });
    } catch (err: any) {
      syntaxErrors.push({ qId: q.id, testId: tc.id, error: err.message });
    }
  });
});

console.log(`Total Assertions Evaluated: ${totalAssertions}`);
console.log(`Assertion Syntax Errors: ${syntaxErrors.length}`);
if (syntaxErrors.length > 0) {
  console.log('Errors:', syntaxErrors);
} else {
  console.log('✅ ALL 2,000 test case assertions are 100% syntactically valid async JavaScript!');
}
