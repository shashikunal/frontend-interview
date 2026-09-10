// scripts/blueprints/blueprint-utils.mjs
// Utility helpers to standardize blueprint definitions across all 10 batches

export function createProblem({
  title,
  fn,
  statement,
  ex,
  starter,
  sol,
  tc,
  hiddenTc,
  topic = 'Fundamentals',
  concepts = ['JavaScript'],
  hints = [
    'Analyze the expected inputs and return types carefully.',
    'Consider boundary conditions such as empty values and type coercion.',
    'Formulate the step-by-step logic before writing code.'
  ],
  timeComplexity = 'O(N)',
  spaceComplexity = 'O(1)',
  explanation = '',
  startupTag = 'Frontend Platform Pattern',
  interviewType = 'Coding'
}) {
  return {
    title,
    functionName: fn,
    frontendTopic: topic,
    concepts,
    interviewType,
    startupTag,
    problemStatement: statement,
    examples: ex,
    starterCode: starter || `function ${fn}(...args) {\n  // TODO: Implement your solution here\n}`,
    solution: sol,
    testCases: tc.map((t, i) => ({
      id: `tc_${i + 1}`,
      input: t.input,
      expectedOutput: t.expectedOutput,
      isHidden: false,
      description: t.desc || `Test case ${i + 1}`
    })),
    hiddenTestCases: (hiddenTc || []).map((t, i) => ({
      id: `htc_${i + 1}`,
      input: t.input,
      expectedOutput: t.expectedOutput,
      isHidden: true,
      description: t.desc || `Hidden test case ${i + 1}`
    })),
    hints,
    timeComplexity,
    spaceComplexity,
    explanation: explanation || `### Approach\n\nImplement \`${fn}\` to satisfy the requirements efficiently with proper edge-case handling.`
  };
}
