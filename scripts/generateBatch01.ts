// scripts/generateBatch01.ts
import * as fs from 'fs';
import * as path from 'path';
import type { CoreProgrammingQuestion } from '../src/components/coreprogramming/data/coreProgrammingTypes';
import { testBatch } from './verifyCoreBatch';

export const batch01Questions: CoreProgrammingQuestion[] = [
  {
    id: "JS-P001",
    number: 1,
    title: "Reverse a String",
    slug: "js-p001-reverse-a-string",
    category: "Strings",
    subcategory: "String Basics",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "String Manipulation"],
    tags: ["strings", "reverse", "basics"],
    expectedTime: "5 mins",
    summary: "Reverse the characters of a given string and return the result.",
    problemStatement: "Write a function `reverseString(str)` that takes a string `str` and returns a new string with all its characters in reverse order.\n\n### Requirements:\n- Must return the reversed string.\n- Should handle empty strings and single-character strings correctly.",
    examples: [
      { title: "Example 1", input: "['hello']", output: "'olleh'", explanation: "Reversing 'hello' produces 'olleh'." },
      { title: "Example 2", input: "['JavaScript']", output: "'tpircSavaJ'", explanation: "Preserves case while reversing." },
      { title: "Example 3", input: "['']", output: "''", explanation: "An empty string reversed is still an empty string." }
    ],
    constraints: ["0 <= str.length <= 10^5", "Input consists of ASCII printable characters."],
    starterCode: "function reverseString(str) {\n  // Write your solution here\n}",
    functionName: "reverseString",
    testCases: [
      { id: "tc_1_1", input: "['hello']", expectedOutput: "'olleh'", isHidden: false },
      { id: "tc_1_2", input: "['world']", expectedOutput: "'dlrow'", isHidden: false },
      { id: "tc_1_3", input: "['']", expectedOutput: "''", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_1_4", input: "['a']", expectedOutput: "'a'", isHidden: true },
      { id: "tc_1_5", input: "['JavaScript']", expectedOutput: "'tpircSavaJ'", isHidden: true },
      { id: "tc_1_6", input: "['12345']", expectedOutput: "'54321'", isHidden: true }
    ],
    solution: "function reverseString(str) {\n  return str.split('').reverse().join('');\n}",
    explanation: "Splitting the string into an array of characters, reversing the array, and joining it back into a string reverses the sequence in O(n) time and O(n) space.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["You can split the string into an array of characters using split('').", "Use the built-in Array.prototype.reverse() method and join('') it back."]
  },
  {
    id: "JS-P002",
    number: 2,
    title: "Check if a String is a Palindrome",
    slug: "js-p002-check-if-a-string-is-a-palindrome",
    category: "Strings",
    subcategory: "String Basics",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Two Pointers"],
    tags: ["strings", "palindrome", "basics"],
    expectedTime: "5 mins",
    summary: "Determine if a string reads the same forwards and backwards.",
    problemStatement: "Write a function `isPalindrome(str)` that checks whether the input string `str` is a palindrome.\n\nA string is a palindrome if it reads the same forward and backward (exact character match, case-sensitive).\n\n### Requirements:\n- Return `true` if `str` is a palindrome, otherwise return `false`.\n- Empty string and single-character strings should return `true`.",
    examples: [
      { title: "Example 1", input: "['racecar']", output: "true", explanation: "'racecar' reads identically in reverse." },
      { title: "Example 2", input: "['hello']", output: "false", explanation: "'hello' reversed is 'olleh', not equal." },
      { title: "Example 3", input: "['madam']", output: "true", explanation: "'madam' is a palindrome." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function isPalindrome(str) {\n  // Write your solution here\n}",
    functionName: "isPalindrome",
    testCases: [
      { id: "tc_2_1", input: "['racecar']", expectedOutput: "true", isHidden: false },
      { id: "tc_2_2", input: "['hello']", expectedOutput: "false", isHidden: false },
      { id: "tc_2_3", input: "['madam']", expectedOutput: "true", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_2_4", input: "['']", expectedOutput: "true", isHidden: true },
      { id: "tc_2_5", input: "['a']", expectedOutput: "true", isHidden: true },
      { id: "tc_2_6", input: "['ab']", expectedOutput: "false", isHidden: true },
      { id: "tc_2_7", input: "['noon']", expectedOutput: "true", isHidden: true }
    ],
    solution: "function isPalindrome(str) {\n  let left = 0;\n  let right = str.length - 1;\n  while (left < right) {\n    if (str[left] !== str[right]) return false;\n    left++;\n    right--;\n  }\n  return true;\n}",
    explanation: "Using two pointers moving from outside inward compares characters in O(n) time and O(1) auxiliary space.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Compare the character at index 0 with index length-1, index 1 with length-2, etc."]
  },
  {
    id: "JS-P003",
    number: 3,
    title: "Find the Largest Number",
    slug: "js-p003-find-the-largest-number",
    category: "JavaScript Basics",
    subcategory: "Numbers & Math",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Numbers", "Conditionals"],
    tags: ["numbers", "comparison", "math"],
    expectedTime: "5 mins",
    summary: "Return the largest of three given numbers.",
    problemStatement: "Write a function `findLargest(a, b, c)` that takes three numbers and returns the greatest among them.\n\n### Requirements:\n- Compare `a`, `b`, and `c`.\n- Return the numerical maximum.",
    examples: [
      { title: "Example 1", input: "[1, 5, 3]", output: "5", explanation: "5 is the largest among 1, 5, 3." },
      { title: "Example 2", input: "[-10, -5, -20]", output: "-5", explanation: "-5 is the greatest negative number." }
    ],
    constraints: ["-10^9 <= a, b, c <= 10^9"],
    starterCode: "function findLargest(a, b, c) {\n  // Write your solution here\n}",
    functionName: "findLargest",
    testCases: [
      { id: "tc_3_1", input: "[1, 5, 3]", expectedOutput: "5", isHidden: false },
      { id: "tc_3_2", input: "[10, 2, 8]", expectedOutput: "10", isHidden: false },
      { id: "tc_3_3", input: "[-1, -5, -2]", expectedOutput: "-1", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_3_4", input: "[4, 4, 4]", expectedOutput: "4", isHidden: true },
      { id: "tc_3_5", input: "[0, 0, 1]", expectedOutput: "1", isHidden: true },
      { id: "tc_3_6", input: "[100, 250, 150]", expectedOutput: "250", isHidden: true }
    ],
    solution: "function findLargest(a, b, c) {\n  return Math.max(a, b, c);\n}",
    explanation: "Math.max evaluates the arguments and returns the greatest number in O(1) time.",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    hints: ["You can use Math.max(a, b, c) or simple if-else comparison."]
  },
  {
    id: "JS-P004",
    number: 4,
    title: "Find the Smallest Number",
    slug: "js-p004-find-the-smallest-number",
    category: "JavaScript Basics",
    subcategory: "Numbers & Math",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Numbers", "Conditionals"],
    tags: ["numbers", "comparison", "math"],
    expectedTime: "5 mins",
    summary: "Return the smallest of three given numbers.",
    problemStatement: "Write a function `findSmallest(a, b, c)` that takes three numbers and returns the smallest among them.",
    examples: [
      { title: "Example 1", input: "[10, 5, 20]", output: "5", explanation: "5 is the smallest." },
      { title: "Example 2", input: "[-3, -1, -7]", output: "-7", explanation: "-7 is the minimum." }
    ],
    constraints: ["-10^9 <= a, b, c <= 10^9"],
    starterCode: "function findSmallest(a, b, c) {\n  // Write your solution here\n}",
    functionName: "findSmallest",
    testCases: [
      { id: "tc_4_1", input: "[10, 5, 20]", expectedOutput: "5", isHidden: false },
      { id: "tc_4_2", input: "[3, 7, 2]", expectedOutput: "2", isHidden: false },
      { id: "tc_4_3", input: "[-3, -1, -7]", expectedOutput: "-7", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_4_4", input: "[0, 0, 0]", expectedOutput: "0", isHidden: true },
      { id: "tc_4_5", input: "[50, 100, 25]", expectedOutput: "25", isHidden: true }
    ],
    solution: "function findSmallest(a, b, c) {\n  return Math.min(a, b, c);\n}",
    explanation: "Math.min returns the minimum value among the arguments.",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    hints: ["Use Math.min(a, b, c) or ternary conditionals."]
  },
  {
    id: "JS-P005",
    number: 5,
    title: "Find the Sum of Numbers",
    slug: "js-p005-find-the-sum-of-numbers",
    category: "JavaScript Basics",
    subcategory: "Numbers & Math",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Numbers", "Loops", "Math"],
    tags: ["numbers", "sum", "loops"],
    expectedTime: "5 mins",
    summary: "Calculate the sum of all integers from 1 up to N.",
    problemStatement: "Write a function `sumToN(n)` that calculates the sum of all natural numbers from `1` up to `n` inclusive.\n\nIf `n <= 0`, return `0`.",
    examples: [
      { title: "Example 1", input: "[5]", output: "15", explanation: "1 + 2 + 3 + 4 + 5 = 15." },
      { title: "Example 2", input: "[1]", output: "1", explanation: "Sum of 1 is 1." },
      { title: "Example 3", input: "[0]", output: "0", explanation: "0 returns 0." }
    ],
    constraints: ["0 <= n <= 10^7"],
    starterCode: "function sumToN(n) {\n  // Write your solution here\n}",
    functionName: "sumToN",
    testCases: [
      { id: "tc_5_1", input: "[5]", expectedOutput: "15", isHidden: false },
      { id: "tc_5_2", input: "[10]", expectedOutput: "55", isHidden: false },
      { id: "tc_5_3", input: "[1]", expectedOutput: "1", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_5_4", input: "[0]", expectedOutput: "0", isHidden: true },
      { id: "tc_5_5", input: "[100]", expectedOutput: "5050", isHidden: true }
    ],
    solution: "function sumToN(n) {\n  if (n <= 0) return 0;\n  return (n * (n + 1)) / 2;\n}",
    explanation: "Using Gauss's formula n * (n + 1) / 2 computes the sum in O(1) time.",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    hints: ["You can either loop from 1 to n, or use the mathematical formula n * (n + 1) / 2."]
  },
  {
    id: "JS-P006",
    number: 6,
    title: "Find Maximum in an Array",
    slug: "js-p006-find-maximum-in-an-array",
    category: "Arrays",
    subcategory: "Array Basics",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Iteration"],
    tags: ["arrays", "max", "iteration"],
    expectedTime: "5 mins",
    summary: "Find the maximum numerical value in an array.",
    problemStatement: "Write a function `findMax(arr)` that accepts an array of numbers `arr` and returns the maximum value.\n\nIf the array is empty, return `null`.",
    examples: [
      { title: "Example 1", input: "[[3, 7, 2, 9, 5]]", output: "9", explanation: "9 is the greatest value." },
      { title: "Example 2", input: "[[-5, -1, -10]]", output: "-1", explanation: "-1 is the maximum." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function findMax(arr) {\n  // Write your solution here\n}",
    functionName: "findMax",
    testCases: [
      { id: "tc_6_1", input: "[[3, 7, 2, 9, 5]]", expectedOutput: "9", isHidden: false },
      { id: "tc_6_2", input: "[[-5, -1, -10]]", expectedOutput: "-1", isHidden: false },
      { id: "tc_6_3", input: "[[42]]", expectedOutput: "42", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_6_4", input: "[[]]", expectedOutput: "null", isHidden: true },
      { id: "tc_6_5", input: "[[10, 20, 30, 40, 50]]", expectedOutput: "50", isHidden: true }
    ],
    solution: "function findMax(arr) {\n  if (!arr || arr.length === 0) return null;\n  let max = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] > max) max = arr[i];\n  }\n  return max;\n}",
    explanation: "Iterating through the array once maintains the running maximum in O(n) time and O(1) space.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Initialize max to the first element and update it if any subsequent element is larger."]
  },
  {
    id: "JS-P007",
    number: 7,
    title: "Find Minimum in an Array",
    slug: "js-p007-find-minimum-in-an-array",
    category: "Arrays",
    subcategory: "Array Basics",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Iteration"],
    tags: ["arrays", "min", "iteration"],
    expectedTime: "5 mins",
    summary: "Find the minimum numerical value in an array.",
    problemStatement: "Write a function `findMin(arr)` that accepts an array of numbers `arr` and returns the minimum value.\n\nIf the array is empty, return `null`.",
    examples: [
      { title: "Example 1", input: "[[4, 2, 8, 1, 9]]", output: "1", explanation: "1 is the smallest." },
      { title: "Example 2", input: "[[100, 200, 50]]", output: "50", explanation: "50 is the minimum." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function findMin(arr) {\n  // Write your solution here\n}",
    functionName: "findMin",
    testCases: [
      { id: "tc_7_1", input: "[[4, 2, 8, 1, 9]]", expectedOutput: "1", isHidden: false },
      { id: "tc_7_2", input: "[[100, 200, 50]]", expectedOutput: "50", isHidden: false },
      { id: "tc_7_3", input: "[[7]]", expectedOutput: "7", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_7_4", input: "[[]]", expectedOutput: "null", isHidden: true },
      { id: "tc_7_5", input: "[[-10, -2, -50]]", expectedOutput: "-50", isHidden: true }
    ],
    solution: "function findMin(arr) {\n  if (!arr || arr.length === 0) return null;\n  let min = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] < min) min = arr[i];\n  }\n  return min;\n}",
    explanation: "Iterate through the array and track the lowest encountered number.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Initialize min with the first item and compare each subsequent item."]
  },
  {
    id: "JS-P008",
    number: 8,
    title: "Count Digits",
    slug: "js-p008-count-digits",
    category: "JavaScript Basics",
    subcategory: "Numbers & Math",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Numbers", "Math"],
    tags: ["numbers", "digits", "math"],
    expectedTime: "5 mins",
    summary: "Count the total number of digits in an integer.",
    problemStatement: "Write a function `countDigits(n)` that returns the number of digits in integer `n`.\n\nNegative numbers should count their numerical digits ignoring the minus sign. For example, `-456` has `3` digits.",
    examples: [
      { title: "Example 1", input: "[12345]", output: "5", explanation: "12345 has 5 digits." },
      { title: "Example 2", input: "[0]", output: "1", explanation: "0 has 1 digit." },
      { title: "Example 3", input: "[-987]", output: "3", explanation: "Ignoring the minus sign, 987 has 3 digits." }
    ],
    constraints: ["-10^15 <= n <= 10^15"],
    starterCode: "function countDigits(n) {\n  // Write your solution here\n}",
    functionName: "countDigits",
    testCases: [
      { id: "tc_8_1", input: "[12345]", expectedOutput: "5", isHidden: false },
      { id: "tc_8_2", input: "[0]", expectedOutput: "1", isHidden: false },
      { id: "tc_8_3", input: "[-987]", expectedOutput: "3", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_8_4", input: "[7]", expectedOutput: "1", isHidden: true },
      { id: "tc_8_5", input: "[1000000]", expectedOutput: "7", isHidden: true }
    ],
    solution: "function countDigits(n) {\n  return Math.abs(n).toString().length;\n}",
    explanation: "Taking Math.abs(n) removes any negative sign, and converting to a string gives the exact digit count.",
    timeComplexity: "O(log10(n))",
    spaceComplexity: "O(1)",
    hints: ["Math.abs(n).toString().length is the most direct solution in JavaScript."]
  },
  {
    id: "JS-P009",
    number: 9,
    title: "Reverse a Number",
    slug: "js-p009-reverse-a-number",
    category: "JavaScript Basics",
    subcategory: "Numbers & Math",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Numbers", "Math"],
    tags: ["numbers", "reverse", "math"],
    expectedTime: "5 mins",
    summary: "Reverse the digits of an integer while preserving sign.",
    problemStatement: "Write a function `reverseNumber(n)` that reverses the digits of an integer `n`.\n\nIf `n` is negative, the resulting reversed number should remain negative (e.g. `-123` becomes `-321`).",
    examples: [
      { title: "Example 1", input: "[1234]", output: "4321", explanation: "Digits reversed is 4321." },
      { title: "Example 2", input: "[-567]", output: "-765", explanation: "Preserves negative sign." },
      { title: "Example 3", input: "[1200]", output: "21", explanation: "Leading zeros in reversed form are omitted in numbers." }
    ],
    constraints: ["-10^9 <= n <= 10^9"],
    starterCode: "function reverseNumber(n) {\n  // Write your solution here\n}",
    functionName: "reverseNumber",
    testCases: [
      { id: "tc_9_1", input: "[1234]", expectedOutput: "4321", isHidden: false },
      { id: "tc_9_2", input: "[-567]", expectedOutput: "-765", isHidden: false },
      { id: "tc_9_3", input: "[1200]", expectedOutput: "21", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_9_4", input: "[0]", expectedOutput: "0", isHidden: true },
      { id: "tc_9_5", input: "[9]", expectedOutput: "9", isHidden: true }
    ],
    solution: "function reverseNumber(n) {\n  const sign = Math.sign(n);\n  const reversed = parseInt(Math.abs(n).toString().split('').reverse().join(''), 10);\n  return sign === 0 ? 0 : sign * reversed;\n}",
    explanation: "Extract the sign, reverse the string representation of the absolute value, and multiply back by sign.",
    timeComplexity: "O(log10(n))",
    spaceComplexity: "O(1)",
    hints: ["Track the sign using Math.sign(n), reverse the absolute value digits, then restore the sign."]
  },
  {
    id: "JS-P010",
    number: 10,
    title: "Check Even or Odd",
    slug: "js-p010-check-even-or-odd",
    category: "JavaScript Basics",
    subcategory: "Numbers & Math",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Numbers", "Modulo", "Conditionals"],
    tags: ["numbers", "even", "odd", "modulo"],
    expectedTime: "5 mins",
    summary: "Determine if an integer is even or odd.",
    problemStatement: "Write a function `isEven(n)` that returns `true` if `n` is an even number, and `false` if `n` is odd.",
    examples: [
      { title: "Example 1", input: "[4]", output: "true", explanation: "4 is divisible by 2." },
      { title: "Example 2", input: "[7]", output: "false", explanation: "7 has a remainder of 1." },
      { title: "Example 3", input: "[0]", output: "true", explanation: "0 is even." }
    ],
    constraints: ["-10^9 <= n <= 10^9"],
    starterCode: "function isEven(n) {\n  // Write your solution here\n}",
    functionName: "isEven",
    testCases: [
      { id: "tc_10_1", input: "[4]", expectedOutput: "true", isHidden: false },
      { id: "tc_10_2", input: "[7]", expectedOutput: "false", isHidden: false },
      { id: "tc_10_3", input: "[0]", expectedOutput: "true", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_10_4", input: "[-2]", expectedOutput: "true", isHidden: true },
      { id: "tc_10_5", input: "[-5]", expectedOutput: "false", isHidden: true }
    ],
    solution: "function isEven(n) {\n  return n % 2 === 0;\n}",
    explanation: "An integer is even if dividing by 2 leaves a remainder of 0.",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    hints: ["Use the modulo operator n % 2 === 0."]
  }
];
