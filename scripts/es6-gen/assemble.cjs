const fs = require('fs');
const path = require('path');

const mod1 = require('./topic-01-to-05.cjs');
const mod2 = require('./topic-06-to-10.cjs');
const mod3 = require('./topic-11-to-15.cjs');
const mod4 = require('./topic-16-to-20.cjs');
const mod5 = require('./topic-21-to-25.cjs');
const mod6 = require('./topic-26-to-30.cjs');

const allRawQuestions = [
  ...mod1,
  ...mod2,
  ...mod3,
  ...mod4,
  ...mod5,
  ...mod6
];

console.log(`Loaded ${allRawQuestions.length} raw questions.`);

// Duplicate check
const seenQuestions = new Set();
const seenConcepts = new Set();
const duplicates = [];

allRawQuestions.forEach((q, idx) => {
  if (!q.concept) {
    q.concept = q.question;
  }
  const normQ = (q.question || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const normConcept = (q.concept || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');

  if (seenQuestions.has(normQ)) {
    duplicates.push({ idx, type: 'question', val: q.question });
  }
  if (seenConcepts.has(normConcept)) {
    duplicates.push({ idx, type: 'concept', val: q.concept });
  }

  seenQuestions.add(normQ);
  seenConcepts.add(normConcept);
});

if (duplicates.length > 0) {
  console.warn('Duplicates detected:', duplicates);
} else {
  console.log('Zero duplicate questions or concepts detected.');
}

// Normalize difficulty, experience level, and question type
function normalizeDifficulty(diff) {
  const d = (diff || '').toUpperCase();
  if (d.includes('BEG') || d === 'EASY') return 'EASY';
  if (d.includes('ADV') || d.includes('HARD') || d === 'DIFFICULT') return 'DIFFICULT';
  return 'INTERMEDIATE';
}

function normalizeExperience(exp) {
  const e = (exp || '').toUpperCase();
  if (e.includes('JUN') || e.includes('FRESH')) return 'FRESHER';
  if (e.includes('SEN') || e.includes('5')) return '3_5_YEARS';
  return '1_3_YEARS';
}

function normalizeType(type) {
  const t = (type || '').toUpperCase();
  if (t.includes('DIFF') || t.includes('COMP')) return 'COMPARISON';
  if (t.includes('CODE') || t.includes('SHORT')) return 'CODE';
  if (t.includes('OUT')) return 'OUTPUT';
  if (t.includes('SCEN')) return 'SCENARIO';
  if (t.includes('DEBUG')) return 'DEBUGGING';
  return 'CONCEPTUAL';
}

// Assemble into final schema
const finalQuestions = allRawQuestions.map((q, idx) => {
  const num = idx + 1;
  const id = `iq-es6-${String(num).padStart(4, '0')}`;
  return {
    id,
    subject: 'es6',
    questionNumber: num,
    category: q.topic,
    topic: q.topic,
    subtopic: q.subtopic || q.topic,
    concept: q.concept,
    difficulty: normalizeDifficulty(q.difficulty),
    questionType: normalizeType(q.questionType),
    experienceLevel: normalizeExperience(q.experienceLevel),
    isHighFrequency: Boolean(q.isHighFrequency),
    companyTags: q.companyTags || ['Tech Companies'],
    tags: q.tags || ['es6', 'javascript'],
    question: q.question,
    shortAnswer: q.shortAnswer,
    detailedExplanation: q.detailedExplanation,
    codeExample: q.codeExample || ''
  };
});

// Topic Breakdown
const topicCount = {};
const diffCount = {};
const typeCount = {};

finalQuestions.forEach(q => {
  topicCount[q.topic] = (topicCount[q.topic] || 0) + 1;
  diffCount[q.difficulty] = (diffCount[q.difficulty] || 0) + 1;
  typeCount[q.questionType] = (typeCount[q.questionType] || 0) + 1;
});

console.log('\n--- TOPIC BREAKDOWN ---');
Object.entries(topicCount).forEach(([topic, count]) => {
  console.log(`- ${topic}: ${count}`);
});

console.log('\n--- DIFFICULTY BREAKDOWN ---');
Object.entries(diffCount).forEach(([diff, count]) => {
  console.log(`- ${diff}: ${count}`);
});

console.log('\n--- QUESTION TYPE BREAKDOWN ---');
Object.entries(typeCount).forEach(([type, count]) => {
  console.log(`- ${type}: ${count}`);
});

// Write to public/data/interview-questions/es6.json
const outputPath = path.resolve(__dirname, '../../public/data/interview-questions/es6.json');
fs.writeFileSync(outputPath, JSON.stringify(finalQuestions, null, 2), 'utf-8');
console.log(`\nSuccessfully wrote ${finalQuestions.length} questions to ${outputPath}`);
