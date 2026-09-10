// scripts/generate-core-programming-500.ts
import * as fs from 'fs';
import * as path from 'path';

interface Spec {
  num: number;
  category: string;
  subcategory: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  questionType: 'Coding' | 'Implementation' | 'Debugging' | 'Output Prediction' | 'Optimization' | 'Edge Cases' | 'Real-world programming';
  title: string;
  func: string;
  prompt: string;
  starter: string;
  solution: string;
  tests: { input: string; expected: string; isHidden?: boolean }[];
  timeComp: string;
  spaceComp: string;
  tags: string[];
  hints: string[];
  explanation: string;
}

// Generate the 500 questions accurately according to the exact category breakdown:
// 1. JavaScript Basics: 30 (1-30)
// 2. Strings: 40 (31-70)
// 3. Arrays: 80 (71-150)
// 4. Objects: 50 (151-200)
// 5. Functions: 40 (201-240)
// 6. Array Method Implementation: 40 (241-280)
// 7. Scope / Hoisting / Closures: 30 (281-310)
// 8. this / call / apply / bind / Prototype: 30 (311-340)
// 9. ES6+: 30 (341-370)
// 10. Recursion / Algorithms: 40 (371-410)
// 11. Functional JavaScript: 25 (411-435)
// 12. Async JavaScript Programming: 45 (436-480)
// 13. Advanced Core JavaScript: 20 (481-500)

console.log('Generating 500 Core JavaScript Programming Questions...');
