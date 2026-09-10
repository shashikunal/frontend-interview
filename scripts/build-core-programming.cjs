// scripts/build-core-programming.cjs
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'src', 'components', 'coreprogramming', 'data', 'batches');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Category specs: category, count, startNum, endNum
const CATEGORIES = [
  { name: 'JavaScript Basics', count: 30, start: 1, end: 30 },
  { name: 'Strings', count: 40, start: 31, end: 70 },
  { name: 'Arrays', count: 80, start: 71, end: 150 },
  { name: 'Objects', count: 50, start: 151, end: 200 },
  { name: 'Functions', count: 40, start: 201, end: 240 },
  { name: 'Array Method Implementation', count: 40, start: 241, end: 280 },
  { name: 'Scope / Hoisting / Closures', count: 30, start: 281, end: 310 },
  { name: 'this / call / apply / bind / Prototype', count: 30, start: 311, end: 340 },
  { name: 'ES6+', count: 30, start: 341, end: 370 },
  { name: 'Recursion / Algorithms', count: 40, start: 371, end: 410 },
  { name: 'Functional JavaScript', count: 25, start: 411, end: 435 },
  { name: 'Async JavaScript Programming', count: 45, start: 436, end: 480 },
  { name: 'Advanced Core JavaScript', count: 20, start: 481, end: 500 }
];

console.log('Building 500 Core Programming Challenges across 10 modular batches...');

// Helper to determine category for question index 1..500
function getCategoryInfo(num) {
  for (const cat of CATEGORIES) {
    if (num >= cat.start && num <= cat.end) {
      return cat;
    }
  }
  return CATEGORIES[0];
}

// Target difficulties: 125 Easy, 250 Medium, 100 Hard, 25 Expert
// We assign difficulties systematically across the categories:
function getDifficulty(num) {
  // 1..125: Easy (125)
  // 126..375: Medium (250)
  // 376..475: Hard (100)
  // 476..500: Expert (25)
  if (num <= 125) return 'Easy';
  if (num <= 375) return 'Medium';
  if (num <= 475) return 'Hard';
  return 'Expert';
}

const QUESTION_TYPES = [
  'Coding',
  'Implementation',
  'Debugging',
  'Output Prediction',
  'Optimization',
  'Edge Cases',
  'Real-world programming'
];

function getQuestionType(num, category) {
  if (category.name === 'Array Method Implementation' || category.name.includes('Prototype')) {
    return 'Implementation';
  }
  if (num % 7 === 0) return 'Output Prediction';
  if (num % 6 === 0) return 'Debugging';
  if (num % 5 === 0) return 'Optimization';
  if (num % 4 === 0) return 'Edge Cases';
  if (num % 3 === 0) return 'Real-world programming';
  return 'Coding';
}

module.exports = {
  CATEGORIES,
  getCategoryInfo,
  getDifficulty,
  getQuestionType,
  outDir
};
