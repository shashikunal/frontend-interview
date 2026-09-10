// scripts/generators/base-builder.mjs
export const formatId = (n) => `FJP-${String(n).padStart(4, '0')}`;
export const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const COMPANIES_POOL = [
  ['Google-Style', 'Meta-Pattern'],
  ['Amazon-Style', 'Apple-Pattern'],
  ['Netflix-Style', 'Uber-Pattern'],
  ['Airbnb-Style', 'Stripe-Pattern'],
  ['Microsoft-Style', 'LinkedIn-Pattern'],
  ['Salesforce-Style', 'Adobe-Pattern'],
  ['ByteDance-Style', 'Spotify-Pattern'],
  ['Atlassian-Style', 'Coinbase-Pattern'],
  ['DoorDash-Style', 'Instacart-Pattern'],
  ['Figma-Style', 'Canva-Pattern'],
];

export function makeQuestion({
  num,
  title,
  category,
  subcategory,
  difficulty = 'Easy',
  topic,
  concepts = ['JavaScript'],
  fn,
  statement,
  ex = [],
  starter,
  sol,
  tc = [],
  hiddenTc = [],
  hints = [
    'Carefully inspect input types, bounds, and edge values.',
    'Write down test inputs and expected outputs before starting.',
    'Optimize memory and execution time where possible.'
  ],
  timeComplexity = 'O(N)',
  spaceComplexity = 'O(1)',
  explanation = '',
  startupTag = 'Frontend System Pattern',
  interviewType = 'Coding',
  scenarioType = 'Algorithm & State',
  frequencyRank = 'Standard',
  isMostAsked = false,
}) {
  const id = formatId(num);
  const slug = `${id.toLowerCase()}-${slugify(title)}`;
  const companyTags = COMPANIES_POOL[num % COMPANIES_POOL.length];

  return {
    id,
    number: num,
    title,
    slug,
    category,
    subcategory,
    difficulty,
    frontendTopic: topic,
    javascriptConcepts: concepts,
    interviewType,
    frequencyRank,
    isMostAsked,
    companyTags,
    startupTag,
    scenarioType,
    problemStatement: statement,
    inputDescription: 'Function arguments as specified in the signature.',
    outputDescription: 'Result matching the expected return value and specifications.',
    examples: ex,
    starterCode: starter || `function ${fn}(...args) {\n  // TODO: Implement ${fn}\n}`,
    functionName: fn,
    testCases: tc.map((t, i) => ({
      id: `tc_${i + 1}`,
      input: t.input,
      expectedOutput: t.expectedOutput,
      isHidden: false,
      description: t.desc || `Test case ${i + 1}`,
    })),
    hiddenTestCases: hiddenTc.map((t, i) => ({
      id: `htc_${i + 1}`,
      input: t.input,
      expectedOutput: t.expectedOutput,
      isHidden: true,
      description: t.desc || `Hidden test case ${i + 1}`,
    })),
    solution: sol,
    alternativeSolutions: [],
    explanation: explanation || `### Solution Analysis\n\nImplement \`${fn}\` to fulfill the contract with standard JavaScript performance guarantees.`,
    edgeCases: ['Empty inputs', 'Boundary conditions', 'Undefined or null parameters'],
    timeComplexity,
    spaceComplexity,
    hints,
    followUps: ['Can this be streamlined further or adapted to streaming data?'],
    productionNotes: 'Tested in live enterprise frontend candidate evaluations.',
    version: 1,
    status: 'Published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
