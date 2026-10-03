const fs = require('fs');
const path = require('path');

// Master Generator for 500 DOM Interview Questions
// Target:
// 150 Beginner (EASY)
// 200 Intermediate (INTERMEDIATE)
// 100 Advanced (DIFFICULT)
// 50 Practical/Scenario (SCENARIO)
// Total = 500

const outputFile = path.join(__dirname, '..', '..', 'public', 'data', 'interview-questions', 'dom.json');
console.log('Target output file:', outputFile);
