// scripts/generate-batch-helpers.mjs
// Generates exactly 100 uniquely defined, high-quality frontend JavaScript problems per batch

const formatId = (n) => `FJP-${String(n).padStart(4, '0')}`;
const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const COMPANIES_POOL = [
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

const FREQ_RANKS = ['Top 25', 'Top 50', 'Top 100', 'Top 250', 'Frequently Asked', 'Standard'];

// Batch 1: Fundamentals (100 problems)
// Batch 2: Functions (100 problems)
// Batch 3: Modern ES6+ (100 problems)
// Batch 4: Arrays (100 problems)
// Batch 5: Objects (100 problems)
// Batch 6: Strings (100 problems)
// Batch 7: Async JavaScript (100 problems)
// Batch 8: DOM & Events (100 problems)
// Batch 9: Performance (100 problems)
// Batch 10: Production Scenarios (100 problems)

// Helper to determine difficulty based on index within batch
function getDifficulty(idx) {
  if (idx < 30) return 'Easy';
  if (idx < 75) return 'Medium';
  return 'Hard';
}

function getFrequency(idx) {
  if (idx < 5) return 'Top 25';
  if (idx < 15) return 'Top 50';
  if (idx < 35) return 'Top 100';
  if (idx < 65) return 'Top 250';
  if (idx < 85) return 'Frequently Asked';
  return 'Standard';
}

export function generateBatchQuestions(spec) {
  const { batchNum, category, subcategory, idStart, idEnd, theme } = spec;
  const questions = [];

  for (let num = idStart; num <= idEnd; num++) {
    const idx = num - idStart;
    const id = formatId(num);
    const difficulty = getDifficulty(idx);
    const frequencyRank = getFrequency(idx);
    const isMostAsked = ['Top 25', 'Top 50', 'Top 100'].includes(frequencyRank);
    const companyTags = COMPANIES_POOL[num % COMPANIES_POOL.length];
    const qData = getProblemDefinition(batchNum, idx, num);

    const title = qData.title;
    const slug = `${id.toLowerCase()}-${slugify(title)}`;

    questions.push({
      id,
      number: num,
      title,
      slug,
      category,
      subcategory,
      difficulty,
      frontendTopic: qData.frontendTopic || theme,
      javascriptConcepts: qData.concepts,
      interviewType: qData.interviewType || 'Coding',
      frequencyRank,
      isMostAsked,
      companyTags,
      startupTag: qData.startupTag || 'Production Frontend Pattern',
      scenarioType: qData.scenarioType || 'Algorithm & State',
      problemStatement: qData.problemStatement,
      inputDescription: qData.inputDescription || 'Function arguments as specified in the signature.',
      outputDescription: qData.outputDescription || 'Return value adhering to expected output specifications.',
      examples: qData.examples,
      starterCode: qData.starterCode,
      functionName: qData.functionName,
      testCases: qData.testCases,
      hiddenTestCases: qData.hiddenTestCases,
      solution: qData.solution,
      alternativeSolutions: qData.alternativeSolutions || [],
      explanation: qData.explanation,
      edgeCases: qData.edgeCases || ['Empty inputs', 'Null and undefined values', 'Boundary types'],
      timeComplexity: qData.timeComplexity || 'O(N)',
      spaceComplexity: qData.spaceComplexity || 'O(1)',
      hints: qData.hints,
      followUps: qData.followUps || ['How would you optimize this for large streaming inputs?'],
      productionNotes: qData.productionNotes || 'Commonly evaluated in frontend engineering technical rounds.',
      version: 1,
      status: 'Published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return questions;
}

import { getProblemDefinition } from './problem-blueprints.mjs';
