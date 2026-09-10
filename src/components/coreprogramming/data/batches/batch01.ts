// src/components/coreprogramming/data/batches/batch01.ts
import type { CoreProgrammingQuestion } from '../coreProgrammingTypes';

export const coreProgrammingBatch1: CoreProgrammingQuestion[] = [
  {
    "id": "JS-P001",
    "number": 1,
    "title": "Reverse a String",
    "slug": "js-p001-reverse-a-string",
    "category": "Strings",
    "subcategory": "String Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Strings",
      "String Manipulation"
    ],
    "tags": [
      "strings",
      "reverse",
      "basics"
    ],
    "expectedTime": "5 mins",
    "summary": "Reverse the characters of a given string and return the result.",
    "problemStatement": "Write a function `reverseString(str)` that takes a string `str` and returns a new string with all its characters in reverse order.\n\n### Requirements:\n- Must return the reversed string.\n- Should handle empty strings and single-character strings correctly.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['hello']",
        "output": "'olleh'",
        "explanation": "Reversing 'hello' produces 'olleh'."
      },
      {
        "title": "Example 2",
        "input": "['JavaScript']",
        "output": "'tpircSavaJ'",
        "explanation": "Preserves case while reversing."
      },
      {
        "title": "Example 3",
        "input": "['']",
        "output": "''",
        "explanation": "An empty string reversed is still an empty string."
      }
    ],
    "constraints": [
      "0 <= str.length <= 10^5",
      "Input consists of ASCII printable characters."
    ],
    "starterCode": "function reverseString(str) {\n  // Write your solution here\n}",
    "functionName": "reverseString",
    "testCases": [
      {
        "id": "tc_1_1",
        "input": "['hello']",
        "expectedOutput": "'olleh'",
        "isHidden": false
      },
      {
        "id": "tc_1_2",
        "input": "['world']",
        "expectedOutput": "'dlrow'",
        "isHidden": false
      },
      {
        "id": "tc_1_3",
        "input": "['']",
        "expectedOutput": "''",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_1_4",
        "input": "['a']",
        "expectedOutput": "'a'",
        "isHidden": true
      },
      {
        "id": "tc_1_5",
        "input": "['JavaScript']",
        "expectedOutput": "'tpircSavaJ'",
        "isHidden": true
      },
      {
        "id": "tc_1_6",
        "input": "['12345']",
        "expectedOutput": "'54321'",
        "isHidden": true
      }
    ],
    "solution": "function reverseString(str) {\n  return str.split('').reverse().join('');\n}",
    "explanation": "Splitting the string into an array of characters, reversing the array, and joining it back into a string reverses the sequence in O(n) time and O(n) space.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "You can split the string into an array of characters using split('').",
      "Use the built-in Array.prototype.reverse() method and join('') it back."
    ]
  },
  {
    "id": "JS-P002",
    "number": 2,
    "title": "Check if a String is a Palindrome",
    "slug": "js-p002-check-if-a-string-is-a-palindrome",
    "category": "Strings",
    "subcategory": "String Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Strings",
      "Two Pointers"
    ],
    "tags": [
      "strings",
      "palindrome",
      "basics"
    ],
    "expectedTime": "5 mins",
    "summary": "Determine if a string reads the same forwards and backwards.",
    "problemStatement": "Write a function `isPalindrome(str)` that checks whether the input string `str` is a palindrome.\n\nA string is a palindrome if it reads the same forward and backward (exact character match, case-sensitive).\n\n### Requirements:\n- Return `true` if `str` is a palindrome, otherwise return `false`.\n- Empty string and single-character strings should return `true`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['racecar']",
        "output": "true",
        "explanation": "'racecar' reads identically in reverse."
      },
      {
        "title": "Example 2",
        "input": "['hello']",
        "output": "false",
        "explanation": "'hello' reversed is 'olleh', not equal."
      },
      {
        "title": "Example 3",
        "input": "['madam']",
        "output": "true",
        "explanation": "'madam' is a palindrome."
      }
    ],
    "constraints": [
      "0 <= str.length <= 10^5"
    ],
    "starterCode": "function isPalindrome(str) {\n  // Write your solution here\n}",
    "functionName": "isPalindrome",
    "testCases": [
      {
        "id": "tc_2_1",
        "input": "['racecar']",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_2_2",
        "input": "['hello']",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "id": "tc_2_3",
        "input": "['madam']",
        "expectedOutput": "true",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_2_4",
        "input": "['']",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "id": "tc_2_5",
        "input": "['a']",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "id": "tc_2_6",
        "input": "['ab']",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "id": "tc_2_7",
        "input": "['noon']",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "solution": "function isPalindrome(str) {\n  let left = 0;\n  let right = str.length - 1;\n  while (left < right) {\n    if (str[left] !== str[right]) return false;\n    left++;\n    right--;\n  }\n  return true;\n}",
    "explanation": "Using two pointers moving from outside inward compares characters in O(n) time and O(1) auxiliary space.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Compare the character at index 0 with index length-1, index 1 with length-2, etc."
    ]
  },
  {
    "id": "JS-P003",
    "number": 3,
    "title": "Find the Largest Number",
    "slug": "js-p003-find-the-largest-number",
    "category": "JavaScript Basics",
    "subcategory": "Numbers & Math",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Numbers",
      "Conditionals"
    ],
    "tags": [
      "numbers",
      "comparison",
      "math"
    ],
    "expectedTime": "5 mins",
    "summary": "Return the largest of three given numbers.",
    "problemStatement": "Write a function `findLargest(a, b, c)` that takes three numbers and returns the greatest among them.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[1, 5, 3]",
        "output": "5",
        "explanation": "5 is the largest."
      },
      {
        "title": "Example 2",
        "input": "[-10, -5, -20]",
        "output": "-5",
        "explanation": "-5 is the greatest negative number."
      }
    ],
    "constraints": [
      "-10^9 <= a, b, c <= 10^9"
    ],
    "starterCode": "function findLargest(a, b, c) {\n  // Write your solution here\n}",
    "functionName": "findLargest",
    "testCases": [
      {
        "id": "tc_3_1",
        "input": "[1, 5, 3]",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "id": "tc_3_2",
        "input": "[10, 2, 8]",
        "expectedOutput": "10",
        "isHidden": false
      },
      {
        "id": "tc_3_3",
        "input": "[-1, -5, -2]",
        "expectedOutput": "-1",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_3_4",
        "input": "[4, 4, 4]",
        "expectedOutput": "4",
        "isHidden": true
      },
      {
        "id": "tc_3_5",
        "input": "[0, 0, 1]",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "id": "tc_3_6",
        "input": "[100, 250, 150]",
        "expectedOutput": "250",
        "isHidden": true
      }
    ],
    "solution": "function findLargest(a, b, c) {\n  return Math.max(a, b, c);\n}",
    "explanation": "Math.max evaluates the arguments and returns the greatest number in O(1) time.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "You can use Math.max(a, b, c) or simple if-else comparison."
    ]
  },
  {
    "id": "JS-P004",
    "number": 4,
    "title": "Find the Smallest Number",
    "slug": "js-p004-find-the-smallest-number",
    "category": "JavaScript Basics",
    "subcategory": "Numbers & Math",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Numbers",
      "Conditionals"
    ],
    "tags": [
      "numbers",
      "comparison",
      "math"
    ],
    "expectedTime": "5 mins",
    "summary": "Return the smallest of three given numbers.",
    "problemStatement": "Write a function `findSmallest(a, b, c)` that takes three numbers and returns the smallest among them.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[10, 5, 20]",
        "output": "5",
        "explanation": "5 is the smallest."
      },
      {
        "title": "Example 2",
        "input": "[-3, -1, -7]",
        "output": "-7",
        "explanation": "-7 is the minimum."
      }
    ],
    "constraints": [
      "-10^9 <= a, b, c <= 10^9"
    ],
    "starterCode": "function findSmallest(a, b, c) {\n  // Write your solution here\n}",
    "functionName": "findSmallest",
    "testCases": [
      {
        "id": "tc_4_1",
        "input": "[10, 5, 20]",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "id": "tc_4_2",
        "input": "[3, 7, 2]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc_4_3",
        "input": "[-3, -1, -7]",
        "expectedOutput": "-7",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_4_4",
        "input": "[0, 0, 0]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "id": "tc_4_5",
        "input": "[50, 100, 25]",
        "expectedOutput": "25",
        "isHidden": true
      }
    ],
    "solution": "function findSmallest(a, b, c) {\n  return Math.min(a, b, c);\n}",
    "explanation": "Math.min returns the minimum value among the arguments.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use Math.min(a, b, c) or ternary conditionals."
    ]
  },
  {
    "id": "JS-P005",
    "number": 5,
    "title": "Find the Sum of Numbers",
    "slug": "js-p005-find-the-sum-of-numbers",
    "category": "JavaScript Basics",
    "subcategory": "Numbers & Math",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Numbers",
      "Loops",
      "Math"
    ],
    "tags": [
      "numbers",
      "sum",
      "loops"
    ],
    "expectedTime": "5 mins",
    "summary": "Calculate the sum of all integers from 1 up to N.",
    "problemStatement": "Write a function `sumToN(n)` that calculates the sum of all natural numbers from `1` up to `n` inclusive.\n\nIf `n <= 0`, return `0`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[5]",
        "output": "15",
        "explanation": "1 + 2 + 3 + 4 + 5 = 15."
      },
      {
        "title": "Example 2",
        "input": "[1]",
        "output": "1",
        "explanation": "Sum of 1 is 1."
      },
      {
        "title": "Example 3",
        "input": "[0]",
        "output": "0",
        "explanation": "0 returns 0."
      }
    ],
    "constraints": [
      "0 <= n <= 10^7"
    ],
    "starterCode": "function sumToN(n) {\n  // Write your solution here\n}",
    "functionName": "sumToN",
    "testCases": [
      {
        "id": "tc_5_1",
        "input": "[5]",
        "expectedOutput": "15",
        "isHidden": false
      },
      {
        "id": "tc_5_2",
        "input": "[10]",
        "expectedOutput": "55",
        "isHidden": false
      },
      {
        "id": "tc_5_3",
        "input": "[1]",
        "expectedOutput": "1",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_5_4",
        "input": "[0]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "id": "tc_5_5",
        "input": "[100]",
        "expectedOutput": "5050",
        "isHidden": true
      }
    ],
    "solution": "function sumToN(n) {\n  if (n <= 0) return 0;\n  return (n * (n + 1)) / 2;\n}",
    "explanation": "Using Gauss's formula n * (n + 1) / 2 computes the sum in O(1) time.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "You can either loop from 1 to n, or use the mathematical formula n * (n + 1) / 2."
    ]
  },
  {
    "id": "JS-P006",
    "number": 6,
    "title": "Find Maximum in an Array",
    "slug": "js-p006-find-maximum-in-an-array",
    "category": "Arrays",
    "subcategory": "Array Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Arrays",
      "Iteration"
    ],
    "tags": [
      "arrays",
      "max",
      "iteration"
    ],
    "expectedTime": "5 mins",
    "summary": "Find the maximum numerical value in an array.",
    "problemStatement": "Write a function `findMax(arr)` that accepts an array of numbers `arr` and returns the maximum value.\n\nIf the array is empty, return `null`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[3, 7, 2, 9, 5]]",
        "output": "9",
        "explanation": "9 is the greatest value."
      },
      {
        "title": "Example 2",
        "input": "[[-5, -1, -10]]",
        "output": "-1",
        "explanation": "-1 is the maximum."
      }
    ],
    "constraints": [
      "0 <= arr.length <= 10^5"
    ],
    "starterCode": "function findMax(arr) {\n  // Write your solution here\n}",
    "functionName": "findMax",
    "testCases": [
      {
        "id": "tc_6_1",
        "input": "[[3, 7, 2, 9, 5]]",
        "expectedOutput": "9",
        "isHidden": false
      },
      {
        "id": "tc_6_2",
        "input": "[[-5, -1, -10]]",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "id": "tc_6_3",
        "input": "[[42]]",
        "expectedOutput": "42",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_6_4",
        "input": "[[]]",
        "expectedOutput": "null",
        "isHidden": true
      },
      {
        "id": "tc_6_5",
        "input": "[[10, 20, 30, 40, 50]]",
        "expectedOutput": "50",
        "isHidden": true
      }
    ],
    "solution": "function findMax(arr) {\n  if (!arr || arr.length === 0) return null;\n  let max = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] > max) max = arr[i];\n  }\n  return max;\n}",
    "explanation": "Iterating through the array once maintains the running maximum in O(n) time and O(1) space.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Initialize max to the first element and update it if any subsequent element is larger."
    ]
  },
  {
    "id": "JS-P007",
    "number": 7,
    "title": "Find Minimum in an Array",
    "slug": "js-p007-find-minimum-in-an-array",
    "category": "Arrays",
    "subcategory": "Array Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Arrays",
      "Iteration"
    ],
    "tags": [
      "arrays",
      "min",
      "iteration"
    ],
    "expectedTime": "5 mins",
    "summary": "Find the minimum numerical value in an array.",
    "problemStatement": "Write a function `findMin(arr)` that accepts an array of numbers `arr` and returns the minimum value.\n\nIf the array is empty, return `null`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[4, 2, 8, 1, 9]]",
        "output": "1",
        "explanation": "1 is the smallest."
      },
      {
        "title": "Example 2",
        "input": "[[100, 200, 50]]",
        "output": "50",
        "explanation": "50 is the minimum."
      }
    ],
    "constraints": [
      "0 <= arr.length <= 10^5"
    ],
    "starterCode": "function findMin(arr) {\n  // Write your solution here\n}",
    "functionName": "findMin",
    "testCases": [
      {
        "id": "tc_7_1",
        "input": "[[4, 2, 8, 1, 9]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc_7_2",
        "input": "[[100, 200, 50]]",
        "expectedOutput": "50",
        "isHidden": false
      },
      {
        "id": "tc_7_3",
        "input": "[[7]]",
        "expectedOutput": "7",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_7_4",
        "input": "[[]]",
        "expectedOutput": "null",
        "isHidden": true
      },
      {
        "id": "tc_7_5",
        "input": "[[-10, -2, -50]]",
        "expectedOutput": "-50",
        "isHidden": true
      }
    ],
    "solution": "function findMin(arr) {\n  if (!arr || arr.length === 0) return null;\n  let min = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] < min) min = arr[i];\n  }\n  return min;\n}",
    "explanation": "Iterate through the array and track the lowest encountered number.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Initialize min with the first item and compare each subsequent item."
    ]
  },
  {
    "id": "JS-P008",
    "number": 8,
    "title": "Count Digits",
    "slug": "js-p008-count-digits",
    "category": "JavaScript Basics",
    "subcategory": "Numbers & Math",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Numbers",
      "Math"
    ],
    "tags": [
      "numbers",
      "digits",
      "math"
    ],
    "expectedTime": "5 mins",
    "summary": "Count the total number of digits in an integer.",
    "problemStatement": "Write a function `countDigits(n)` that returns the number of digits in integer `n`.\n\nNegative numbers should count their numerical digits ignoring the minus sign. For example, `-456` has `3` digits.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[12345]",
        "output": "5",
        "explanation": "12345 has 5 digits."
      },
      {
        "title": "Example 2",
        "input": "[0]",
        "output": "1",
        "explanation": "0 has 1 digit."
      },
      {
        "title": "Example 3",
        "input": "[-987]",
        "output": "3",
        "explanation": "Ignoring the minus sign, 987 has 3 digits."
      }
    ],
    "constraints": [
      "-10^15 <= n <= 10^15"
    ],
    "starterCode": "function countDigits(n) {\n  // Write your solution here\n}",
    "functionName": "countDigits",
    "testCases": [
      {
        "id": "tc_8_1",
        "input": "[12345]",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "id": "tc_8_2",
        "input": "[0]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc_8_3",
        "input": "[-987]",
        "expectedOutput": "3",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_8_4",
        "input": "[7]",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "id": "tc_8_5",
        "input": "[1000000]",
        "expectedOutput": "7",
        "isHidden": true
      }
    ],
    "solution": "function countDigits(n) {\n  return Math.abs(n).toString().length;\n}",
    "explanation": "Taking Math.abs(n) removes any negative sign, and converting to a string gives the exact digit count.",
    "timeComplexity": "O(log10(n))",
    "spaceComplexity": "O(1)",
    "hints": [
      "Math.abs(n).toString().length is the most direct solution in JavaScript."
    ]
  },
  {
    "id": "JS-P009",
    "number": 9,
    "title": "Reverse a Number",
    "slug": "js-p009-reverse-a-number",
    "category": "JavaScript Basics",
    "subcategory": "Numbers & Math",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Numbers",
      "Math"
    ],
    "tags": [
      "numbers",
      "reverse",
      "math"
    ],
    "expectedTime": "5 mins",
    "summary": "Reverse the digits of an integer while preserving sign.",
    "problemStatement": "Write a function `reverseNumber(n)` that reverses the digits of an integer `n`.\n\nIf `n` is negative, the resulting reversed number should remain negative (e.g. `-123` becomes `-321`).",
    "examples": [
      {
        "title": "Example 1",
        "input": "[1234]",
        "output": "4321",
        "explanation": "Digits reversed is 4321."
      },
      {
        "title": "Example 2",
        "input": "[-567]",
        "output": "-765",
        "explanation": "Preserves negative sign."
      },
      {
        "title": "Example 3",
        "input": "[1200]",
        "output": "21",
        "explanation": "Leading zeros in reversed form are omitted in numbers."
      }
    ],
    "constraints": [
      "-10^9 <= n <= 10^9"
    ],
    "starterCode": "function reverseNumber(n) {\n  // Write your solution here\n}",
    "functionName": "reverseNumber",
    "testCases": [
      {
        "id": "tc_9_1",
        "input": "[1234]",
        "expectedOutput": "4321",
        "isHidden": false
      },
      {
        "id": "tc_9_2",
        "input": "[-567]",
        "expectedOutput": "-765",
        "isHidden": false
      },
      {
        "id": "tc_9_3",
        "input": "[1200]",
        "expectedOutput": "21",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_9_4",
        "input": "[0]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "id": "tc_9_5",
        "input": "[9]",
        "expectedOutput": "9",
        "isHidden": true
      }
    ],
    "solution": "function reverseNumber(n) {\n  const sign = Math.sign(n);\n  const reversed = parseInt(Math.abs(n).toString().split('').reverse().join(''), 10);\n  return sign === 0 ? 0 : sign * reversed;\n}",
    "explanation": "Extract the sign, reverse the string representation of the absolute value, and multiply back by sign.",
    "timeComplexity": "O(log10(n))",
    "spaceComplexity": "O(1)",
    "hints": [
      "Track the sign using Math.sign(n), reverse the absolute value digits, then restore the sign."
    ]
  },
  {
    "id": "JS-P010",
    "number": 10,
    "title": "Check Even or Odd",
    "slug": "js-p010-check-even-or-odd",
    "category": "JavaScript Basics",
    "subcategory": "Numbers & Math",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Numbers",
      "Modulo",
      "Conditionals"
    ],
    "tags": [
      "numbers",
      "even",
      "odd",
      "modulo"
    ],
    "expectedTime": "5 mins",
    "summary": "Determine if an integer is even or odd.",
    "problemStatement": "Write a function `isEven(n)` that returns `true` if `n` is an even number, and `false` if `n` is odd.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[4]",
        "output": "true",
        "explanation": "4 is divisible by 2."
      },
      {
        "title": "Example 2",
        "input": "[7]",
        "output": "false",
        "explanation": "7 has a remainder of 1."
      },
      {
        "title": "Example 3",
        "input": "[0]",
        "output": "true",
        "explanation": "0 is even."
      }
    ],
    "constraints": [
      "-10^9 <= n <= 10^9"
    ],
    "starterCode": "function isEven(n) {\n  // Write your solution here\n}",
    "functionName": "isEven",
    "testCases": [
      {
        "id": "tc_10_1",
        "input": "[4]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_10_2",
        "input": "[7]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "id": "tc_10_3",
        "input": "[0]",
        "expectedOutput": "true",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_10_4",
        "input": "[-2]",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "id": "tc_10_5",
        "input": "[-5]",
        "expectedOutput": "false",
        "isHidden": true
      }
    ],
    "solution": "function isEven(n) {\n  return n % 2 === 0;\n}",
    "explanation": "An integer is even if dividing by 2 leaves a remainder of 0.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use the modulo operator n % 2 === 0."
    ]
  },
  {
    "id": "JS-P011",
    "number": 11,
    "title": "Factorial of a Number",
    "slug": "js-p011-factorial-of-a-number",
    "category": "JavaScript Basics",
    "subcategory": "Numbers & Math",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Numbers",
      "Recursion",
      "Loops"
    ],
    "tags": [
      "numbers",
      "factorial",
      "math"
    ],
    "expectedTime": "5 mins",
    "summary": "Compute the factorial of a non-negative integer.",
    "problemStatement": "Write a function `factorial(n)` that computes n! (n factorial).\n\nBy definition, 0! = 1 and 1! = 1. If `n < 0`, return `null`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[5]",
        "output": "120",
        "explanation": "5 * 4 * 3 * 2 * 1 = 120."
      },
      {
        "title": "Example 2",
        "input": "[0]",
        "output": "1",
        "explanation": "0! is 1."
      }
    ],
    "constraints": [
      "0 <= n <= 18"
    ],
    "starterCode": "function factorial(n) {\n  // Write your solution here\n}",
    "functionName": "factorial",
    "testCases": [
      {
        "id": "tc_11_1",
        "input": "[5]",
        "expectedOutput": "120",
        "isHidden": false
      },
      {
        "id": "tc_11_2",
        "input": "[0]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc_11_3",
        "input": "[1]",
        "expectedOutput": "1",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_11_4",
        "input": "[3]",
        "expectedOutput": "6",
        "isHidden": true
      },
      {
        "id": "tc_11_5",
        "input": "[7]",
        "expectedOutput": "5040",
        "isHidden": true
      }
    ],
    "solution": "function factorial(n) {\n  if (n < 0) return null;\n  let res = 1;\n  for (let i = 2; i <= n; i++) res *= i;\n  return res;\n}",
    "explanation": "Iterate from 2 up to n multiplying into result.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use an iterative loop from 2 to n."
    ]
  },
  {
    "id": "JS-P012",
    "number": 12,
    "title": "N-th Fibonacci Number",
    "slug": "js-p012-n-th-fibonacci-number",
    "category": "JavaScript Basics",
    "subcategory": "Numbers & Math",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Numbers",
      "Dynamic Programming"
    ],
    "tags": [
      "numbers",
      "fibonacci",
      "dp"
    ],
    "expectedTime": "5 mins",
    "summary": "Calculate the n-th Fibonacci number where fib(0) = 0 and fib(1) = 1.",
    "problemStatement": "Write a function `fibonacci(n)` that returns the n-th Fibonacci number.\n\nF(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2) for n >= 2.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[4]",
        "output": "3",
        "explanation": "Sequence: 0, 1, 1, 2, 3."
      },
      {
        "title": "Example 2",
        "input": "[6]",
        "output": "8",
        "explanation": "Sequence up to 6: 0, 1, 1, 2, 3, 5, 8."
      }
    ],
    "constraints": [
      "0 <= n <= 40"
    ],
    "starterCode": "function fibonacci(n) {\n  // Write your solution here\n}",
    "functionName": "fibonacci",
    "testCases": [
      {
        "id": "tc_12_1",
        "input": "[0]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc_12_2",
        "input": "[1]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc_12_3",
        "input": "[4]",
        "expectedOutput": "3",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_12_4",
        "input": "[6]",
        "expectedOutput": "8",
        "isHidden": true
      },
      {
        "id": "tc_12_5",
        "input": "[10]",
        "expectedOutput": "55",
        "isHidden": true
      }
    ],
    "solution": "function fibonacci(n) {\n  if (n <= 0) return 0;\n  if (n === 1) return 1;\n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) {\n    const c = a + b;\n    a = b;\n    b = c;\n  }\n  return b;\n}",
    "explanation": "Iterate from 2 to n with two variables in O(n) time and O(1) space.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use two variables to track the previous two values rather than exponential recursion."
    ]
  },
  {
    "id": "JS-P013",
    "number": 13,
    "title": "Check if a Number is Prime",
    "slug": "js-p013-check-if-a-number-is-prime",
    "category": "JavaScript Basics",
    "subcategory": "Numbers & Math",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Numbers",
      "Math"
    ],
    "tags": [
      "numbers",
      "prime",
      "math"
    ],
    "expectedTime": "5 mins",
    "summary": "Determine whether a number is a prime number.",
    "problemStatement": "Write a function `isPrime(n)` that returns `true` if `n` is a prime number, and `false` otherwise.\n\nA prime number is a natural number strictly greater than 1 that has no positive divisors other than 1 and itself.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[7]",
        "output": "true",
        "explanation": "7 is prime."
      },
      {
        "title": "Example 2",
        "input": "[4]",
        "output": "false",
        "explanation": "4 is divisible by 2."
      },
      {
        "title": "Example 3",
        "input": "[1]",
        "output": "false",
        "explanation": "1 is not prime."
      }
    ],
    "constraints": [
      "0 <= n <= 10^7"
    ],
    "starterCode": "function isPrime(n) {\n  // Write your solution here\n}",
    "functionName": "isPrime",
    "testCases": [
      {
        "id": "tc_13_1",
        "input": "[7]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_13_2",
        "input": "[4]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "id": "tc_13_3",
        "input": "[1]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_13_4",
        "input": "[2]",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "id": "tc_13_5",
        "input": "[17]",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "id": "tc_13_6",
        "input": "[25]",
        "expectedOutput": "false",
        "isHidden": true
      }
    ],
    "solution": "function isPrime(n) {\n  if (n <= 1) return false;\n  if (n <= 3) return true;\n  if (n % 2 === 0 || n % 3 === 0) return false;\n  for (let i = 5; i * i <= n; i += 6) {\n    if (n % i === 0 || n % (i + 2) === 0) return false;\n  }\n  return true;\n}",
    "explanation": "Checking divisors up to sqrt(n) yields an efficient O(sqrt(n)) primality test.",
    "timeComplexity": "O(sqrt(n))",
    "spaceComplexity": "O(1)",
    "hints": [
      "Check divisibility only up to Math.sqrt(n)."
    ]
  },
  {
    "id": "JS-P014",
    "number": 14,
    "title": "Greatest Common Divisor (GCD)",
    "slug": "js-p014-greatest-common-divisor-gcd",
    "category": "JavaScript Basics",
    "subcategory": "Numbers & Math",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Numbers",
      "Math",
      "Euclidean Algorithm"
    ],
    "tags": [
      "numbers",
      "gcd",
      "math"
    ],
    "expectedTime": "5 mins",
    "summary": "Find the greatest common divisor of two integers using Euclid's algorithm.",
    "problemStatement": "Write a function `gcd(a, b)` that returns the greatest common divisor of two positive integers `a` and `b`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[12, 18]",
        "output": "6",
        "explanation": "Common factors: 1, 2, 3, 6. Greatest is 6."
      },
      {
        "title": "Example 2",
        "input": "[10, 5]",
        "output": "5",
        "explanation": "5 divides 10."
      }
    ],
    "constraints": [
      "1 <= a, b <= 10^9"
    ],
    "starterCode": "function gcd(a, b) {\n  // Write your solution here\n}",
    "functionName": "gcd",
    "testCases": [
      {
        "id": "tc_14_1",
        "input": "[12, 18]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "id": "tc_14_2",
        "input": "[10, 5]",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "id": "tc_14_3",
        "input": "[17, 13]",
        "expectedOutput": "1",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_14_4",
        "input": "[48, 18]",
        "expectedOutput": "6",
        "isHidden": true
      },
      {
        "id": "tc_14_5",
        "input": "[100, 25]",
        "expectedOutput": "25",
        "isHidden": true
      }
    ],
    "solution": "function gcd(a, b) {\n  while (b) {\n    const t = b;\n    b = a % b;\n    a = t;\n  }\n  return Math.abs(a);\n}",
    "explanation": "Euclid's algorithm replaces (a, b) with (b, a % b) until b is 0 in logarithmic time.",
    "timeComplexity": "O(log(min(a, b)))",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use Euclid's algorithm: gcd(a, b) = gcd(b, a % b)."
    ]
  },
  {
    "id": "JS-P015",
    "number": 15,
    "title": "Least Common Multiple (LCM)",
    "slug": "js-p015-least-common-multiple-lcm",
    "category": "JavaScript Basics",
    "subcategory": "Numbers & Math",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Numbers",
      "Math"
    ],
    "tags": [
      "numbers",
      "lcm",
      "math"
    ],
    "expectedTime": "5 mins",
    "summary": "Find the least common multiple of two integers.",
    "problemStatement": "Write a function `lcm(a, b)` that returns the least common multiple of two positive integers `a` and `b`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[4, 6]",
        "output": "12",
        "explanation": "Multiples of 4: 4,8,12; multiples of 6: 6,12. Least common is 12."
      },
      {
        "title": "Example 2",
        "input": "[5, 10]",
        "output": "10",
        "explanation": "10 is multiple of 5 and 10."
      }
    ],
    "constraints": [
      "1 <= a, b <= 10^5"
    ],
    "starterCode": "function lcm(a, b) {\n  // Write your solution here\n}",
    "functionName": "lcm",
    "testCases": [
      {
        "id": "tc_15_1",
        "input": "[4, 6]",
        "expectedOutput": "12",
        "isHidden": false
      },
      {
        "id": "tc_15_2",
        "input": "[5, 10]",
        "expectedOutput": "10",
        "isHidden": false
      },
      {
        "id": "tc_15_3",
        "input": "[3, 7]",
        "expectedOutput": "21",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_15_4",
        "input": "[12, 15]",
        "expectedOutput": "60",
        "isHidden": true
      },
      {
        "id": "tc_15_5",
        "input": "[8, 12]",
        "expectedOutput": "24",
        "isHidden": true
      }
    ],
    "solution": "function lcm(a, b) {\n  function gcd(x, y) {\n    while (y) {\n      const t = y;\n      y = x % y;\n      x = t;\n    }\n    return x;\n  }\n  return (a * b) / gcd(a, b);\n}",
    "explanation": "LCM(a, b) = (a * b) / GCD(a, b).",
    "timeComplexity": "O(log(min(a, b)))",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use the relation lcm(a, b) = (a * b) / gcd(a, b)."
    ]
  },
  {
    "id": "JS-P016",
    "number": 16,
    "title": "Sum of Digits of a Number",
    "slug": "js-p016-sum-of-digits-of-a-number",
    "category": "JavaScript Basics",
    "subcategory": "Numbers & Math",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Numbers",
      "Math"
    ],
    "tags": [
      "numbers",
      "digits",
      "sum"
    ],
    "expectedTime": "5 mins",
    "summary": "Compute the sum of all digits in an integer.",
    "problemStatement": "Write a function `sumDigits(n)` that returns the sum of the digits of integer `n`. Ignore sign for negative numbers.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[123]",
        "output": "6",
        "explanation": "1 + 2 + 3 = 6."
      },
      {
        "title": "Example 2",
        "input": "[905]",
        "output": "14",
        "explanation": "9 + 0 + 5 = 14."
      }
    ],
    "constraints": [
      "-10^15 <= n <= 10^15"
    ],
    "starterCode": "function sumDigits(n) {\n  // Write your solution here\n}",
    "functionName": "sumDigits",
    "testCases": [
      {
        "id": "tc_16_1",
        "input": "[123]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "id": "tc_16_2",
        "input": "[905]",
        "expectedOutput": "14",
        "isHidden": false
      },
      {
        "id": "tc_16_3",
        "input": "[0]",
        "expectedOutput": "0",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_16_4",
        "input": "[-456]",
        "expectedOutput": "15",
        "isHidden": true
      },
      {
        "id": "tc_16_5",
        "input": "[9999]",
        "expectedOutput": "36",
        "isHidden": true
      }
    ],
    "solution": "function sumDigits(n) {\n  return Math.abs(n).toString().split('').reduce((sum, d) => sum + parseInt(d, 10), 0);\n}",
    "explanation": "Convert absolute value to string and sum the parsed digits.",
    "timeComplexity": "O(log10(n))",
    "spaceComplexity": "O(log10(n))",
    "hints": [
      "Iterate through digits using modulo 10 or split string."
    ]
  },
  {
    "id": "JS-P017",
    "number": 17,
    "title": "Check if a Number is an Armstrong Number",
    "slug": "js-p017-check-if-a-number-is-an-armstrong-number",
    "category": "JavaScript Basics",
    "subcategory": "Numbers & Math",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Numbers",
      "Math"
    ],
    "tags": [
      "numbers",
      "armstrong",
      "math"
    ],
    "expectedTime": "5 mins",
    "summary": "Determine if a number equals the sum of its own digits each raised to the power of the number of digits.",
    "problemStatement": "Write a function `isArmstrong(n)` that returns `true` if `n` is an Armstrong (narcissistic) number, and `false` otherwise.\n\nAn Armstrong number of k digits is an integer such that the sum of its digits each raised to the k-th power equals the number itself.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[153]",
        "output": "true",
        "explanation": "1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153."
      },
      {
        "title": "Example 2",
        "input": "[370]",
        "output": "true",
        "explanation": "3^3 + 7^3 + 0^3 = 27 + 343 + 0 = 370."
      },
      {
        "title": "Example 3",
        "input": "[120]",
        "output": "false",
        "explanation": "1^3 + 2^3 + 0^3 = 9 != 120."
      }
    ],
    "constraints": [
      "0 <= n <= 10^9"
    ],
    "starterCode": "function isArmstrong(n) {\n  // Write your solution here\n}",
    "functionName": "isArmstrong",
    "testCases": [
      {
        "id": "tc_17_1",
        "input": "[153]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_17_2",
        "input": "[370]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_17_3",
        "input": "[120]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_17_4",
        "input": "[9]",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "id": "tc_17_5",
        "input": "[9474]",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "solution": "function isArmstrong(n) {\n  const str = n.toString();\n  const k = str.length;\n  const sum = str.split('').reduce((acc, d) => acc + Math.pow(parseInt(d, 10), k), 0);\n  return sum === n;\n}",
    "explanation": "Calculate the digit count k, raise each digit to the power k, and check equality with n.",
    "timeComplexity": "O(log10(n))",
    "spaceComplexity": "O(1)",
    "hints": [
      "Find the number of digits k, then sum d^k for each digit d."
    ]
  },
  {
    "id": "JS-P018",
    "number": 18,
    "title": "Power of a Number",
    "slug": "js-p018-power-of-a-number",
    "category": "JavaScript Basics",
    "subcategory": "Numbers & Math",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Numbers",
      "Math"
    ],
    "tags": [
      "numbers",
      "power",
      "exponent"
    ],
    "expectedTime": "5 mins",
    "summary": "Compute base raised to the exponent power.",
    "problemStatement": "Write a function `power(base, exp)` that computes base^exp for integer exponents.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[2, 3]",
        "output": "8",
        "explanation": "2 * 2 * 2 = 8."
      },
      {
        "title": "Example 2",
        "input": "[5, 0]",
        "output": "1",
        "explanation": "Any non-zero base to 0 is 1."
      }
    ],
    "constraints": [
      "-100 <= base <= 100",
      "0 <= exp <= 20"
    ],
    "starterCode": "function power(base, exp) {\n  // Write your solution here\n}",
    "functionName": "power",
    "testCases": [
      {
        "id": "tc_18_1",
        "input": "[2, 3]",
        "expectedOutput": "8",
        "isHidden": false
      },
      {
        "id": "tc_18_2",
        "input": "[5, 0]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc_18_3",
        "input": "[3, 4]",
        "expectedOutput": "81",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_18_4",
        "input": "[10, 5]",
        "expectedOutput": "100000",
        "isHidden": true
      },
      {
        "id": "tc_18_5",
        "input": "[0, 5]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "solution": "function power(base, exp) {\n  return Math.pow(base, exp);\n}",
    "explanation": "Math.pow handles exponentiation in O(1) time.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use Math.pow(base, exp) or the ** operator."
    ]
  },
  {
    "id": "JS-P019",
    "number": 19,
    "title": "Check if a Number is a Perfect Number",
    "slug": "js-p019-check-if-a-number-is-a-perfect-number",
    "category": "JavaScript Basics",
    "subcategory": "Numbers & Math",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Numbers",
      "Math"
    ],
    "tags": [
      "numbers",
      "perfect-number",
      "math"
    ],
    "expectedTime": "5 mins",
    "summary": "Determine if an integer is equal to the sum of its proper positive divisors.",
    "problemStatement": "Write a function `isPerfectNumber(n)` that returns `true` if `n` is a perfect number, and `false` otherwise.\n\nA perfect number is a positive integer that is equal to the sum of its positive proper divisors (excluding itself).",
    "examples": [
      {
        "title": "Example 1",
        "input": "[6]",
        "output": "true",
        "explanation": "1 + 2 + 3 = 6."
      },
      {
        "title": "Example 2",
        "input": "[28]",
        "output": "true",
        "explanation": "1 + 2 + 4 + 7 + 14 = 28."
      },
      {
        "title": "Example 3",
        "input": "[12]",
        "output": "false",
        "explanation": "1 + 2 + 3 + 4 + 6 = 16 != 12."
      }
    ],
    "constraints": [
      "1 <= n <= 10^8"
    ],
    "starterCode": "function isPerfectNumber(n) {\n  // Write your solution here\n}",
    "functionName": "isPerfectNumber",
    "testCases": [
      {
        "id": "tc_19_1",
        "input": "[6]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_19_2",
        "input": "[28]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_19_3",
        "input": "[12]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_19_4",
        "input": "[1]",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "id": "tc_19_5",
        "input": "[496]",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "solution": "function isPerfectNumber(n) {\n  if (n <= 1) return false;\n  let sum = 1;\n  for (let i = 2; i * i <= n; i++) {\n    if (n % i === 0) {\n      sum += i;\n      if (i * i !== n) sum += n / i;\n    }\n  }\n  return sum === n;\n}",
    "explanation": "Sum proper divisors up to sqrt(n) and compare to n.",
    "timeComplexity": "O(sqrt(n))",
    "spaceComplexity": "O(1)",
    "hints": [
      "Iterate up to sqrt(n) and add both divisor pairs."
    ]
  },
  {
    "id": "JS-P020",
    "number": 20,
    "title": "Count Vowels in a String",
    "slug": "js-p020-count-vowels-in-a-string",
    "category": "Strings",
    "subcategory": "String Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Strings",
      "Regex"
    ],
    "tags": [
      "strings",
      "vowels",
      "counting"
    ],
    "expectedTime": "5 mins",
    "summary": "Count the number of vowels (a, e, i, o, u) in a string.",
    "problemStatement": "Write a function `countVowels(str)` that counts the occurrences of vowels ('a', 'e', 'i', 'o', 'u', case-insensitive) in string `str`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['hello world']",
        "output": "3",
        "explanation": "'e', 'o', 'o' make 3 vowels."
      },
      {
        "title": "Example 2",
        "input": "['xyz']",
        "output": "0",
        "explanation": "No vowels."
      }
    ],
    "constraints": [
      "0 <= str.length <= 10^5"
    ],
    "starterCode": "function countVowels(str) {\n  // Write your solution here\n}",
    "functionName": "countVowels",
    "testCases": [
      {
        "id": "tc_20_1",
        "input": "['hello world']",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc_20_2",
        "input": "['xyz']",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc_20_3",
        "input": "['AEIOUaeiou']",
        "expectedOutput": "10",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_20_4",
        "input": "['']",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "id": "tc_20_5",
        "input": "['JavaScript']",
        "expectedOutput": "3",
        "isHidden": true
      }
    ],
    "solution": "function countVowels(str) {\n  const matches = str.match(/[aeiou]/gi);\n  return matches ? matches.length : 0;\n}",
    "explanation": "Use a regular expression matching [aeiou] case-insensitively.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use a regex with [aeiou] or iterate through characters checking against a Set of vowels."
    ]
  },
  {
    "id": "JS-P021",
    "number": 21,
    "title": "Count Consonants in a String",
    "slug": "js-p021-count-consonants-in-a-string",
    "category": "Strings",
    "subcategory": "String Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Strings",
      "Regex"
    ],
    "tags": [
      "strings",
      "consonants",
      "counting"
    ],
    "expectedTime": "5 mins",
    "summary": "Count the total number of alphabetic consonants in a string.",
    "problemStatement": "Write a function `countConsonants(str)` that counts all English consonant letters in `str`. Non-alphabetic characters are ignored.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['hello world']",
        "output": "7",
        "explanation": "h, l, l, w, r, l, d = 7."
      },
      {
        "title": "Example 2",
        "input": "['123!']",
        "output": "0",
        "explanation": "No letters."
      }
    ],
    "constraints": [
      "0 <= str.length <= 10^5"
    ],
    "starterCode": "function countConsonants(str) {\n  // Write your solution here\n}",
    "functionName": "countConsonants",
    "testCases": [
      {
        "id": "tc_21_1",
        "input": "['hello world']",
        "expectedOutput": "7",
        "isHidden": false
      },
      {
        "id": "tc_21_2",
        "input": "['abc']",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc_21_3",
        "input": "['123!']",
        "expectedOutput": "0",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_21_4",
        "input": "['aeiou']",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "id": "tc_21_5",
        "input": "['JavaScript']",
        "expectedOutput": "7",
        "isHidden": true
      }
    ],
    "solution": "function countConsonants(str) {\n  const matches = str.match(/[bcdfghjklmnpqrstvwxyz]/gi);\n  return matches ? matches.length : 0;\n}",
    "explanation": "Filter characters for alphabetic letters that are not vowels.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use regex /[bcdfghjklmnpqrstvwxyz]/gi."
    ]
  },
  {
    "id": "JS-P022",
    "number": 22,
    "title": "Remove All Vowels from a String",
    "slug": "js-p022-remove-all-vowels-from-a-string",
    "category": "Strings",
    "subcategory": "String Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Strings",
      "Regex"
    ],
    "tags": [
      "strings",
      "vowels",
      "replace"
    ],
    "expectedTime": "5 mins",
    "summary": "Delete every vowel from the input string and return the remaining text.",
    "problemStatement": "Write a function `removeVowels(str)` that strips out all vowels ('a', 'e', 'i', 'o', 'u', case-insensitive) from `str`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['hello world']",
        "output": "'hll wrld'",
        "explanation": "e, o, o are removed."
      },
      {
        "title": "Example 2",
        "input": "['apple']",
        "output": "'ppl'",
        "explanation": "a and e are removed."
      }
    ],
    "constraints": [
      "0 <= str.length <= 10^5"
    ],
    "starterCode": "function removeVowels(str) {\n  // Write your solution here\n}",
    "functionName": "removeVowels",
    "testCases": [
      {
        "id": "tc_22_1",
        "input": "['hello world']",
        "expectedOutput": "'hll wrld'",
        "isHidden": false
      },
      {
        "id": "tc_22_2",
        "input": "['apple']",
        "expectedOutput": "'ppl'",
        "isHidden": false
      },
      {
        "id": "tc_22_3",
        "input": "['aeiou']",
        "expectedOutput": "''",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_22_4",
        "input": "['xyz']",
        "expectedOutput": "'xyz'",
        "isHidden": true
      },
      {
        "id": "tc_22_5",
        "input": "['JavaScript']",
        "expectedOutput": "'JvScrpt'",
        "isHidden": true
      }
    ],
    "solution": "function removeVowels(str) {\n  return str.replace(/[aeiou]/gi, '');\n}",
    "explanation": "Use String.prototype.replace with a global case-insensitive regex.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use str.replace(/[aeiou]/gi, '')."
    ]
  },
  {
    "id": "JS-P023",
    "number": 23,
    "title": "Capitalize the First Letter of a String",
    "slug": "js-p023-capitalize-the-first-letter-of-a-string",
    "category": "Strings",
    "subcategory": "String Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Strings",
      "Formatting"
    ],
    "tags": [
      "strings",
      "capitalize",
      "format"
    ],
    "expectedTime": "5 mins",
    "summary": "Capitalize the initial character of a string while keeping the rest unchanged.",
    "problemStatement": "Write a function `capitalize(str)` that converts the first character of `str` to uppercase. If the string is empty, return empty string.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['hello']",
        "output": "'Hello'",
        "explanation": "'h' becomes 'H'."
      },
      {
        "title": "Example 2",
        "input": "['world']",
        "output": "'World'",
        "explanation": "'w' becomes 'W'."
      }
    ],
    "constraints": [
      "0 <= str.length <= 10^5"
    ],
    "starterCode": "function capitalize(str) {\n  // Write your solution here\n}",
    "functionName": "capitalize",
    "testCases": [
      {
        "id": "tc_23_1",
        "input": "['hello']",
        "expectedOutput": "'Hello'",
        "isHidden": false
      },
      {
        "id": "tc_23_2",
        "input": "['world']",
        "expectedOutput": "'World'",
        "isHidden": false
      },
      {
        "id": "tc_23_3",
        "input": "['']",
        "expectedOutput": "''",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_23_4",
        "input": "['a']",
        "expectedOutput": "'A'",
        "isHidden": true
      },
      {
        "id": "tc_23_5",
        "input": "['already']",
        "expectedOutput": "'Already'",
        "isHidden": true
      }
    ],
    "solution": "function capitalize(str) {\n  if (!str) return '';\n  return str.charAt(0).toUpperCase() + str.slice(1);\n}",
    "explanation": "Upper-case charAt(0) and concatenate with the slice from index 1.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use str.charAt(0).toUpperCase() + str.slice(1)."
    ]
  },
  {
    "id": "JS-P024",
    "number": 24,
    "title": "Check if Two Strings are Anagrams",
    "slug": "js-p024-check-if-two-strings-are-anagrams",
    "category": "Strings",
    "subcategory": "String Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Strings",
      "Hash Map"
    ],
    "tags": [
      "strings",
      "anagram",
      "hash-map"
    ],
    "expectedTime": "5 mins",
    "summary": "Determine if two strings contain the same characters with equal frequencies.",
    "problemStatement": "Write a function `areAnagrams(str1, str2)` that returns `true` if `str1` and `str2` are anagrams (case-sensitive exact character match), otherwise `false`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['listen', 'silent']",
        "output": "true",
        "explanation": "Both words contain the exact same letters."
      },
      {
        "title": "Example 2",
        "input": "['hello', 'world']",
        "output": "false",
        "explanation": "Different letters."
      }
    ],
    "constraints": [
      "0 <= str1.length, str2.length <= 10^5"
    ],
    "starterCode": "function areAnagrams(str1, str2) {\n  // Write your solution here\n}",
    "functionName": "areAnagrams",
    "testCases": [
      {
        "id": "tc_24_1",
        "input": "['listen', 'silent']",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_24_2",
        "input": "['hello', 'world']",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "id": "tc_24_3",
        "input": "['rat', 'car']",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_24_4",
        "input": "['', '']",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "id": "tc_24_5",
        "input": "['anagram', 'nagaram']",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "solution": "function areAnagrams(str1, str2) {\n  if (str1.length !== str2.length) return false;\n  const sorted1 = str1.split('').sort().join('');\n  const sorted2 = str2.split('').sort().join('');\n  return sorted1 === sorted2;\n}",
    "explanation": "Sort characters of both strings and check if they are identical.",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Check lengths first, then compare sorted character arrays or character frequency maps."
    ]
  },
  {
    "id": "JS-P025",
    "number": 25,
    "title": "Convert Celsius to Fahrenheit",
    "slug": "js-p025-convert-celsius-to-fahrenheit",
    "category": "JavaScript Basics",
    "subcategory": "Numbers & Math",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Numbers",
      "Math"
    ],
    "tags": [
      "math",
      "conversion",
      "temperature"
    ],
    "expectedTime": "5 mins",
    "summary": "Convert a temperature value from Celsius to Fahrenheit.",
    "problemStatement": "Write a function `celsiusToFahrenheit(c)` that converts Celsius temperature `c` to Fahrenheit using the formula: `F = (C * 9/5) + 32`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[0]",
        "output": "32",
        "explanation": "0°C is 32°F."
      },
      {
        "title": "Example 2",
        "input": "[100]",
        "output": "212",
        "explanation": "100°C is 212°F."
      }
    ],
    "constraints": [
      "-273.15 <= c <= 10^5"
    ],
    "starterCode": "function celsiusToFahrenheit(c) {\n  // Write your solution here\n}",
    "functionName": "celsiusToFahrenheit",
    "testCases": [
      {
        "id": "tc_25_1",
        "input": "[0]",
        "expectedOutput": "32",
        "isHidden": false
      },
      {
        "id": "tc_25_2",
        "input": "[100]",
        "expectedOutput": "212",
        "isHidden": false
      },
      {
        "id": "tc_25_3",
        "input": "[-40]",
        "expectedOutput": "-40",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_25_4",
        "input": "[25]",
        "expectedOutput": "77",
        "isHidden": true
      },
      {
        "id": "tc_25_5",
        "input": "[37]",
        "expectedOutput": "98.6",
        "isHidden": true
      }
    ],
    "solution": "function celsiusToFahrenheit(c) {\n  return (c * 9) / 5 + 32;\n}",
    "explanation": "Apply the linear formula (C * 9/5) + 32.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Formula: (c * 9/5) + 32."
    ]
  },
  {
    "id": "JS-P026",
    "number": 26,
    "title": "Convert Fahrenheit to Celsius",
    "slug": "js-p026-convert-fahrenheit-to-celsius",
    "category": "JavaScript Basics",
    "subcategory": "Numbers & Math",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Numbers",
      "Math"
    ],
    "tags": [
      "math",
      "conversion",
      "temperature"
    ],
    "expectedTime": "5 mins",
    "summary": "Convert a temperature value from Fahrenheit to Celsius.",
    "problemStatement": "Write a function `fahrenheitToCelsius(f)` that converts Fahrenheit `f` to Celsius using `C = (F - 32) * 5/9`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[32]",
        "output": "0",
        "explanation": "32°F is 0°C."
      },
      {
        "title": "Example 2",
        "input": "[212]",
        "output": "100",
        "explanation": "212°F is 100°C."
      }
    ],
    "constraints": [
      "-459.67 <= f <= 10^5"
    ],
    "starterCode": "function fahrenheitToCelsius(f) {\n  // Write your solution here\n}",
    "functionName": "fahrenheitToCelsius",
    "testCases": [
      {
        "id": "tc_26_1",
        "input": "[32]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc_26_2",
        "input": "[212]",
        "expectedOutput": "100",
        "isHidden": false
      },
      {
        "id": "tc_26_3",
        "input": "[-40]",
        "expectedOutput": "-40",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_26_4",
        "input": "[77]",
        "expectedOutput": "25",
        "isHidden": true
      }
    ],
    "solution": "function fahrenheitToCelsius(f) {\n  return ((f - 32) * 5) / 9;\n}",
    "explanation": "Subtract 32 and multiply by 5/9.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use (f - 32) * 5 / 9."
    ]
  },
  {
    "id": "JS-P027",
    "number": 27,
    "title": "Check Leap Year",
    "slug": "js-p027-check-leap-year",
    "category": "JavaScript Basics",
    "subcategory": "Conditionals & Logic",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Conditionals",
      "Modulo"
    ],
    "tags": [
      "logic",
      "dates",
      "modulo"
    ],
    "expectedTime": "5 mins",
    "summary": "Determine if a calendar year is a leap year.",
    "problemStatement": "Write a function `isLeapYear(year)` that returns `true` if `year` is a leap year, and `false` otherwise.\n\nA year is a leap year if it is divisible by 4, except end-of-century years which must be divisible by 400.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[2024]",
        "output": "true",
        "explanation": "2024 is divisible by 4 and not 100."
      },
      {
        "title": "Example 2",
        "input": "[1900]",
        "output": "false",
        "explanation": "1900 is divisible by 100 but not 400."
      },
      {
        "title": "Example 3",
        "input": "[2000]",
        "output": "true",
        "explanation": "2000 is divisible by 400."
      }
    ],
    "constraints": [
      "1 <= year <= 10^5"
    ],
    "starterCode": "function isLeapYear(year) {\n  // Write your solution here\n}",
    "functionName": "isLeapYear",
    "testCases": [
      {
        "id": "tc_27_1",
        "input": "[2024]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_27_2",
        "input": "[1900]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "id": "tc_27_3",
        "input": "[2000]",
        "expectedOutput": "true",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_27_4",
        "input": "[2023]",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "id": "tc_27_5",
        "input": "[1600]",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "solution": "function isLeapYear(year) {\n  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;\n}",
    "explanation": "Check (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0).",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Divisible by 4 and not 100, or divisible by 400."
    ]
  },
  {
    "id": "JS-P028",
    "number": 28,
    "title": "Check if a Character is a Vowel",
    "slug": "js-p028-check-if-a-character-is-a-vowel",
    "category": "Strings",
    "subcategory": "String Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Strings",
      "Conditionals"
    ],
    "tags": [
      "strings",
      "vowel",
      "logic"
    ],
    "expectedTime": "5 mins",
    "summary": "Determine if a single-character string is an English vowel.",
    "problemStatement": "Write a function `isVowel(char)` that takes a single character string and returns `true` if it is a vowel ('a', 'e', 'i', 'o', 'u' in lower or upper case), otherwise `false`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['a']",
        "output": "true",
        "explanation": "'a' is a vowel."
      },
      {
        "title": "Example 2",
        "input": "['B']",
        "output": "false",
        "explanation": "'B' is a consonant."
      }
    ],
    "constraints": [
      "char.length === 1"
    ],
    "starterCode": "function isVowel(char) {\n  // Write your solution here\n}",
    "functionName": "isVowel",
    "testCases": [
      {
        "id": "tc_28_1",
        "input": "['a']",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_28_2",
        "input": "['E']",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_28_3",
        "input": "['x']",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_28_4",
        "input": "['u']",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "id": "tc_28_5",
        "input": "['1']",
        "expectedOutput": "false",
        "isHidden": true
      }
    ],
    "solution": "function isVowel(char) {\n  return 'aeiouAEIOU'.includes(char);\n}",
    "explanation": "Check membership in 'aeiouAEIOU'.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use 'aeiouAEIOU'.includes(char)."
    ]
  },
  {
    "id": "JS-P029",
    "number": 29,
    "title": "Count Occurrences of a Character in a String",
    "slug": "js-p029-count-occurrences-of-a-character-in-a-string",
    "category": "Strings",
    "subcategory": "String Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Strings",
      "Iteration"
    ],
    "tags": [
      "strings",
      "counting",
      "search"
    ],
    "expectedTime": "5 mins",
    "summary": "Count the number of times a target character appears in a string.",
    "problemStatement": "Write a function `countChar(str, char)` that counts how many times `char` appears in `str` (exact case-sensitive match).",
    "examples": [
      {
        "title": "Example 1",
        "input": "['banana', 'a']",
        "output": "3",
        "explanation": "'a' appears 3 times in 'banana'."
      },
      {
        "title": "Example 2",
        "input": "['hello', 'z']",
        "output": "0",
        "explanation": "'z' is not present."
      }
    ],
    "constraints": [
      "0 <= str.length <= 10^5",
      "char.length === 1"
    ],
    "starterCode": "function countChar(str, char) {\n  // Write your solution here\n}",
    "functionName": "countChar",
    "testCases": [
      {
        "id": "tc_29_1",
        "input": "['banana', 'a']",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc_29_2",
        "input": "['hello', 'l']",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc_29_3",
        "input": "['hello', 'z']",
        "expectedOutput": "0",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_29_4",
        "input": "['', 'a']",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "id": "tc_29_5",
        "input": "['AAAAA', 'A']",
        "expectedOutput": "5",
        "isHidden": true
      }
    ],
    "solution": "function countChar(str, char) {\n  let count = 0;\n  for (let i = 0; i < str.length; i++) {\n    if (str[i] === char) count++;\n  }\n  return count;\n}",
    "explanation": "Loop through the string and increment count whenever character matches.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Iterate through each character and check if str[i] === char."
    ]
  },
  {
    "id": "JS-P030",
    "number": 30,
    "title": "Truncate a String with Ellipsis",
    "slug": "js-p030-truncate-a-string-with-ellipsis",
    "category": "Strings",
    "subcategory": "String Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Strings",
      "Slicing"
    ],
    "tags": [
      "strings",
      "truncate",
      "ui-utility"
    ],
    "expectedTime": "5 mins",
    "summary": "Truncate a string to a given maximum length and append '...' if truncated.",
    "problemStatement": "Write a function `truncate(str, maxLength)` that truncates `str` if its length exceeds `maxLength`, appending `'...'` to the truncated string.\n\nThe truncated portion before the ellipsis should be sliced so that total length including `'...'` equals `maxLength` if `maxLength >= 3`. If `str.length <= maxLength`, return `str` unchanged.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['Hello World', 8]",
        "output": "'Hello...'",
        "explanation": "5 characters + '...' = 8 characters."
      },
      {
        "title": "Example 2",
        "input": "['Hi', 5]",
        "output": "'Hi'",
        "explanation": "Length is within limit."
      }
    ],
    "constraints": [
      "0 <= str.length <= 10^5",
      "3 <= maxLength <= 10^5"
    ],
    "starterCode": "function truncate(str, maxLength) {\n  // Write your solution here\n}",
    "functionName": "truncate",
    "testCases": [
      {
        "id": "tc_30_1",
        "input": "['Hello World', 8]",
        "expectedOutput": "'Hello...'",
        "isHidden": false
      },
      {
        "id": "tc_30_2",
        "input": "['Hi', 5]",
        "expectedOutput": "'Hi'",
        "isHidden": false
      },
      {
        "id": "tc_30_3",
        "input": "['JavaScript', 10]",
        "expectedOutput": "'JavaScript'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_30_4",
        "input": "['Testing', 4]",
        "expectedOutput": "'T...'",
        "isHidden": true
      },
      {
        "id": "tc_30_5",
        "input": "['', 5]",
        "expectedOutput": "''",
        "isHidden": true
      }
    ],
    "solution": "function truncate(str, maxLength) {\n  if (str.length <= maxLength) return str;\n  return str.slice(0, maxLength - 3) + '...';\n}",
    "explanation": "If str.length > maxLength, slice the first maxLength - 3 characters and add '...'.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Check if str.length <= maxLength, otherwise return str.slice(0, maxLength - 3) + '...'."
    ]
  },
  {
    "id": "JS-P031",
    "number": 31,
    "title": "Repeat a String N Times",
    "slug": "js-p031-repeat-a-string-n-times",
    "category": "Strings",
    "subcategory": "String Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Strings",
      "Loops"
    ],
    "tags": [
      "strings",
      "repeat",
      "iteration"
    ],
    "expectedTime": "5 mins",
    "summary": "Return a string repeated N times.",
    "problemStatement": "Write a function `repeatString(str, n)` that repeats string `str` `n` times. If `n <= 0`, return `''`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['abc', 3]",
        "output": "'abcabcabc'",
        "explanation": "'abc' repeated 3 times."
      },
      {
        "title": "Example 2",
        "input": "['hi', 0]",
        "output": "''",
        "explanation": "0 repeats yields empty string."
      }
    ],
    "constraints": [
      "0 <= str.length <= 100",
      "0 <= n <= 1000"
    ],
    "starterCode": "function repeatString(str, n) {\n  // Write your solution here\n}",
    "functionName": "repeatString",
    "testCases": [
      {
        "id": "tc_31_1",
        "input": "['abc', 3]",
        "expectedOutput": "'abcabcabc'",
        "isHidden": false
      },
      {
        "id": "tc_31_2",
        "input": "['hi', 0]",
        "expectedOutput": "''",
        "isHidden": false
      },
      {
        "id": "tc_31_3",
        "input": "['!', 4]",
        "expectedOutput": "'!!!!'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_31_4",
        "input": "['', 5]",
        "expectedOutput": "''",
        "isHidden": true
      },
      {
        "id": "tc_31_5",
        "input": "['ab', 1]",
        "expectedOutput": "'ab'",
        "isHidden": true
      }
    ],
    "solution": "function repeatString(str, n) {\n  if (n <= 0) return '';\n  return str.repeat(n);\n}",
    "explanation": "Use String.prototype.repeat.",
    "timeComplexity": "O(n * length)",
    "spaceComplexity": "O(n * length)",
    "hints": [
      "Use str.repeat(n) or a loop."
    ]
  },
  {
    "id": "JS-P032",
    "number": 32,
    "title": "Check if String Starts With Substring",
    "slug": "js-p032-check-if-string-starts-with-substring",
    "category": "Strings",
    "subcategory": "String Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Strings",
      "Prefixes"
    ],
    "tags": [
      "strings",
      "prefix",
      "startsWith"
    ],
    "expectedTime": "5 mins",
    "summary": "Determine if a string starts with the specified prefix.",
    "problemStatement": "Write a function `startsWith(str, prefix)` that returns `true` if `str` begins with `prefix`, otherwise `false`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['hello world', 'hello']",
        "output": "true",
        "explanation": "'hello world' begins with 'hello'."
      },
      {
        "title": "Example 2",
        "input": "['javascript', 'java']",
        "output": "true",
        "explanation": "'javascript' starts with 'java'."
      },
      {
        "title": "Example 3",
        "input": "['react', 'vue']",
        "output": "false",
        "explanation": "Does not start with 'vue'."
      }
    ],
    "constraints": [
      "0 <= str.length, prefix.length <= 10^5"
    ],
    "starterCode": "function startsWith(str, prefix) {\n  // Write your solution here\n}",
    "functionName": "startsWith",
    "testCases": [
      {
        "id": "tc_32_1",
        "input": "['hello world', 'hello']",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_32_2",
        "input": "['javascript', 'java']",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_32_3",
        "input": "['react', 'vue']",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_32_4",
        "input": "['anything', '']",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "id": "tc_32_5",
        "input": "['short', 'longerPrefix']",
        "expectedOutput": "false",
        "isHidden": true
      }
    ],
    "solution": "function startsWith(str, prefix) {\n  return str.startsWith(prefix);\n}",
    "explanation": "String.prototype.startsWith checks the prefix in O(prefix.length) time.",
    "timeComplexity": "O(m)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use str.startsWith(prefix)."
    ]
  },
  {
    "id": "JS-P033",
    "number": 33,
    "title": "Check if String Ends With Substring",
    "slug": "js-p033-check-if-string-ends-with-substring",
    "category": "Strings",
    "subcategory": "String Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Strings",
      "Suffixes"
    ],
    "tags": [
      "strings",
      "suffix",
      "endsWith"
    ],
    "expectedTime": "5 mins",
    "summary": "Determine if a string ends with the specified suffix.",
    "problemStatement": "Write a function `endsWith(str, suffix)` that returns `true` if `str` ends with `suffix`, otherwise `false`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['picture.png', '.png']",
        "output": "true",
        "explanation": "Ends with '.png'."
      },
      {
        "title": "Example 2",
        "input": "['index.html', '.js']",
        "output": "false",
        "explanation": "Does not end with '.js'."
      }
    ],
    "constraints": [
      "0 <= str.length, suffix.length <= 10^5"
    ],
    "starterCode": "function endsWith(str, suffix) {\n  // Write your solution here\n}",
    "functionName": "endsWith",
    "testCases": [
      {
        "id": "tc_33_1",
        "input": "['picture.png', '.png']",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_33_2",
        "input": "['index.html', '.js']",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "id": "tc_33_3",
        "input": "['hello', 'o']",
        "expectedOutput": "true",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_33_4",
        "input": "['test', '']",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "id": "tc_33_5",
        "input": "['abc', 'abcd']",
        "expectedOutput": "false",
        "isHidden": true
      }
    ],
    "solution": "function endsWith(str, suffix) {\n  return str.endsWith(suffix);\n}",
    "explanation": "String.prototype.endsWith checks the suffix in O(suffix.length) time.",
    "timeComplexity": "O(m)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use str.endsWith(suffix)."
    ]
  },
  {
    "id": "JS-P034",
    "number": 34,
    "title": "Swap Two Numbers Without a Temporary Variable",
    "slug": "js-p034-swap-two-numbers-without-a-temporary-variable",
    "category": "JavaScript Basics",
    "subcategory": "Numbers & Math",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Numbers",
      "ES6 Destructuring"
    ],
    "tags": [
      "numbers",
      "swap",
      "destructuring"
    ],
    "expectedTime": "5 mins",
    "summary": "Return an array containing [b, a] given input numbers a and b.",
    "problemStatement": "Write a function `swapNumbers(a, b)` that swaps two numbers and returns them as a 2-element array `[b, a]`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[5, 10]",
        "output": "[10, 5]",
        "explanation": "5 and 10 are swapped to [10, 5]."
      },
      {
        "title": "Example 2",
        "input": "[1, 2]",
        "output": "[2, 1]",
        "explanation": "Swapped to [2, 1]."
      }
    ],
    "constraints": [
      "-10^9 <= a, b <= 10^9"
    ],
    "starterCode": "function swapNumbers(a, b) {\n  // Write your solution here\n}",
    "functionName": "swapNumbers",
    "testCases": [
      {
        "id": "tc_34_1",
        "input": "[5, 10]",
        "expectedOutput": "[10, 5]",
        "isHidden": false
      },
      {
        "id": "tc_34_2",
        "input": "[1, 2]",
        "expectedOutput": "[2, 1]",
        "isHidden": false
      },
      {
        "id": "tc_34_3",
        "input": "[-3, 7]",
        "expectedOutput": "[7, -3]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_34_4",
        "input": "[0, 0]",
        "expectedOutput": "[0, 0]",
        "isHidden": true
      },
      {
        "id": "tc_34_5",
        "input": "[42, -42]",
        "expectedOutput": "[-42, 42]",
        "isHidden": true
      }
    ],
    "solution": "function swapNumbers(a, b) {\n  return [b, a];\n}",
    "explanation": "Array destructuring/literal returns [b, a] directly.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Return [b, a] or use arithmetic addition/subtraction."
    ]
  },
  {
    "id": "JS-P035",
    "number": 35,
    "title": "Sum of Elements in an Array",
    "slug": "js-p035-sum-of-elements-in-an-array",
    "category": "Arrays",
    "subcategory": "Array Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Arrays",
      "Reduce"
    ],
    "tags": [
      "arrays",
      "sum",
      "reduce"
    ],
    "expectedTime": "5 mins",
    "summary": "Compute the total sum of all numbers in an array.",
    "problemStatement": "Write a function `sumArray(arr)` that sums all numbers in array `arr`. If the array is empty, return `0`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3, 4, 5]]",
        "output": "15",
        "explanation": "1+2+3+4+5 = 15."
      },
      {
        "title": "Example 2",
        "input": "[[]]",
        "output": "0",
        "explanation": "Empty array returns 0."
      }
    ],
    "constraints": [
      "0 <= arr.length <= 10^5"
    ],
    "starterCode": "function sumArray(arr) {\n  // Write your solution here\n}",
    "functionName": "sumArray",
    "testCases": [
      {
        "id": "tc_35_1",
        "input": "[[1, 2, 3, 4, 5]]",
        "expectedOutput": "15",
        "isHidden": false
      },
      {
        "id": "tc_35_2",
        "input": "[[]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc_35_3",
        "input": "[[-1, -2, 3]]",
        "expectedOutput": "0",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_35_4",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "60",
        "isHidden": true
      },
      {
        "id": "tc_35_5",
        "input": "[[100]]",
        "expectedOutput": "100",
        "isHidden": true
      }
    ],
    "solution": "function sumArray(arr) {\n  return arr.reduce((acc, x) => acc + x, 0);\n}",
    "explanation": "Reduce sums each element into the accumulator starting from 0.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use arr.reduce((sum, n) => sum + n, 0)."
    ]
  },
  {
    "id": "JS-P036",
    "number": 36,
    "title": "Calculate Average of an Array",
    "slug": "js-p036-calculate-average-of-an-array",
    "category": "Arrays",
    "subcategory": "Array Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Arrays",
      "Math"
    ],
    "tags": [
      "arrays",
      "average",
      "mean"
    ],
    "expectedTime": "5 mins",
    "summary": "Calculate the arithmetic mean of numbers in an array.",
    "problemStatement": "Write a function `averageArray(arr)` that returns the average of the numbers in `arr`. If `arr` is empty, return `0`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[2, 4, 6, 8]]",
        "output": "5",
        "explanation": "(2+4+6+8)/4 = 5."
      },
      {
        "title": "Example 2",
        "input": "[[10, 20]]",
        "output": "15",
        "explanation": "(10+20)/2 = 15."
      }
    ],
    "constraints": [
      "0 <= arr.length <= 10^5"
    ],
    "starterCode": "function averageArray(arr) {\n  // Write your solution here\n}",
    "functionName": "averageArray",
    "testCases": [
      {
        "id": "tc_36_1",
        "input": "[[2, 4, 6, 8]]",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "id": "tc_36_2",
        "input": "[[10, 20]]",
        "expectedOutput": "15",
        "isHidden": false
      },
      {
        "id": "tc_36_3",
        "input": "[[]]",
        "expectedOutput": "0",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_36_4",
        "input": "[[7]]",
        "expectedOutput": "7",
        "isHidden": true
      },
      {
        "id": "tc_36_5",
        "input": "[[1, 2, 3, 4, 5]]",
        "expectedOutput": "3",
        "isHidden": true
      }
    ],
    "solution": "function averageArray(arr) {\n  if (!arr || arr.length === 0) return 0;\n  const sum = arr.reduce((acc, x) => acc + x, 0);\n  return sum / arr.length;\n}",
    "explanation": "Sum elements and divide by array length.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Sum elements with reduce, then divide by arr.length."
    ]
  },
  {
    "id": "JS-P037",
    "number": 37,
    "title": "Check if Array Contains an Element",
    "slug": "js-p037-check-if-array-contains-an-element",
    "category": "Arrays",
    "subcategory": "Array Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Arrays",
      "Searching"
    ],
    "tags": [
      "arrays",
      "search",
      "includes"
    ],
    "expectedTime": "5 mins",
    "summary": "Determine whether a given value exists within an array.",
    "problemStatement": "Write a function `containsElement(arr, val)` that returns `true` if `val` is found in `arr`, and `false` otherwise.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3], 2]",
        "output": "true",
        "explanation": "2 is present."
      },
      {
        "title": "Example 2",
        "input": "[[1, 2, 3], 5]",
        "output": "false",
        "explanation": "5 is not present."
      }
    ],
    "constraints": [
      "0 <= arr.length <= 10^5"
    ],
    "starterCode": "function containsElement(arr, val) {\n  // Write your solution here\n}",
    "functionName": "containsElement",
    "testCases": [
      {
        "id": "tc_37_1",
        "input": "[[1, 2, 3], 2]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_37_2",
        "input": "[[1, 2, 3], 5]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "id": "tc_37_3",
        "input": "[['a', 'b', 'c'], 'c']",
        "expectedOutput": "true",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_37_4",
        "input": "[[], 1]",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "id": "tc_37_5",
        "input": "[[null, undefined], null]",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "solution": "function containsElement(arr, val) {\n  return arr.includes(val);\n}",
    "explanation": "Array.prototype.includes scans the array in O(n) time.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use arr.includes(val)."
    ]
  },
  {
    "id": "JS-P038",
    "number": 38,
    "title": "Find Index of an Element in Array",
    "slug": "js-p038-find-index-of-an-element-in-array",
    "category": "Arrays",
    "subcategory": "Array Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Arrays",
      "Searching"
    ],
    "tags": [
      "arrays",
      "indexOf",
      "search"
    ],
    "expectedTime": "5 mins",
    "summary": "Return the first zero-based index of an element in an array, or -1 if not found.",
    "problemStatement": "Write a function `indexOfElement(arr, val)` that returns the first index of `val` in `arr`, or `-1` if not found.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[10, 20, 30], 20]",
        "output": "1",
        "explanation": "20 is at index 1."
      },
      {
        "title": "Example 2",
        "input": "[[10, 20, 30], 99]",
        "output": "-1",
        "explanation": "Not found."
      }
    ],
    "constraints": [
      "0 <= arr.length <= 10^5"
    ],
    "starterCode": "function indexOfElement(arr, val) {\n  // Write your solution here\n}",
    "functionName": "indexOfElement",
    "testCases": [
      {
        "id": "tc_38_1",
        "input": "[[10, 20, 30], 20]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc_38_2",
        "input": "[[10, 20, 30], 99]",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "id": "tc_38_3",
        "input": "[[5, 5, 5], 5]",
        "expectedOutput": "0",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_38_4",
        "input": "[[], 1]",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "id": "tc_38_5",
        "input": "[['apple', 'banana'], 'banana']",
        "expectedOutput": "1",
        "isHidden": true
      }
    ],
    "solution": "function indexOfElement(arr, val) {\n  return arr.indexOf(val);\n}",
    "explanation": "Array.prototype.indexOf performs strict equality search and returns index or -1.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use arr.indexOf(val)."
    ]
  },
  {
    "id": "JS-P039",
    "number": 39,
    "title": "Check if a Number is Positive, Negative, or Zero",
    "slug": "js-p039-check-if-a-number-is-positive-negative-or-zero",
    "category": "JavaScript Basics",
    "subcategory": "Conditionals & Logic",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Conditionals",
      "Logic"
    ],
    "tags": [
      "numbers",
      "sign",
      "conditionals"
    ],
    "expectedTime": "5 mins",
    "summary": "Return 'positive', 'negative', or 'zero' for a given number.",
    "problemStatement": "Write a function `checkSign(n)` that returns `'positive'` if `n > 0`, `'negative'` if `n < 0`, and `'zero'` if `n === 0`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[5]",
        "output": "'positive'",
        "explanation": "5 is positive."
      },
      {
        "title": "Example 2",
        "input": "[-3]",
        "output": "'negative'",
        "explanation": "-3 is negative."
      },
      {
        "title": "Example 3",
        "input": "[0]",
        "output": "'zero'",
        "explanation": "0 is zero."
      }
    ],
    "constraints": [
      "-10^9 <= n <= 10^9"
    ],
    "starterCode": "function checkSign(n) {\n  // Write your solution here\n}",
    "functionName": "checkSign",
    "testCases": [
      {
        "id": "tc_39_1",
        "input": "[5]",
        "expectedOutput": "'positive'",
        "isHidden": false
      },
      {
        "id": "tc_39_2",
        "input": "[-3]",
        "expectedOutput": "'negative'",
        "isHidden": false
      },
      {
        "id": "tc_39_3",
        "input": "[0]",
        "expectedOutput": "'zero'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_39_4",
        "input": "[0.001]",
        "expectedOutput": "'positive'",
        "isHidden": true
      },
      {
        "id": "tc_39_5",
        "input": "[-0.001]",
        "expectedOutput": "'negative'",
        "isHidden": true
      }
    ],
    "solution": "function checkSign(n) {\n  if (n > 0) return 'positive';\n  if (n < 0) return 'negative';\n  return 'zero';\n}",
    "explanation": "Check standard if-else comparison against 0.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use if-else or Math.sign."
    ]
  },
  {
    "id": "JS-P040",
    "number": 40,
    "title": "Absolute Value of a Number",
    "slug": "js-p040-absolute-value-of-a-number",
    "category": "JavaScript Basics",
    "subcategory": "Numbers & Math",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Numbers",
      "Math"
    ],
    "tags": [
      "numbers",
      "abs",
      "math"
    ],
    "expectedTime": "5 mins",
    "summary": "Return the non-negative absolute magnitude of a number.",
    "problemStatement": "Write a function `absVal(n)` that returns the absolute value of `n` without using `Math.abs`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[-5]",
        "output": "5",
        "explanation": "Absolute of -5 is 5."
      },
      {
        "title": "Example 2",
        "input": "[10]",
        "output": "10",
        "explanation": "Absolute of 10 is 10."
      }
    ],
    "constraints": [
      "-10^9 <= n <= 10^9"
    ],
    "starterCode": "function absVal(n) {\n  // Write your solution here\n}",
    "functionName": "absVal",
    "testCases": [
      {
        "id": "tc_40_1",
        "input": "[-5]",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "id": "tc_40_2",
        "input": "[10]",
        "expectedOutput": "10",
        "isHidden": false
      },
      {
        "id": "tc_40_3",
        "input": "[0]",
        "expectedOutput": "0",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_40_4",
        "input": "[-999]",
        "expectedOutput": "999",
        "isHidden": true
      },
      {
        "id": "tc_40_5",
        "input": "[-0.5]",
        "expectedOutput": "0.5",
        "isHidden": true
      }
    ],
    "solution": "function absVal(n) {\n  return n < 0 ? -n : n;\n}",
    "explanation": "If n < 0, negate it; otherwise return n as is.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "If n < 0 return -n, else return n."
    ]
  },
  {
    "id": "JS-P041",
    "number": 41,
    "title": "Clamp a Number Between Min and Max",
    "slug": "js-p041-clamp-a-number-between-min-and-max",
    "category": "JavaScript Basics",
    "subcategory": "Numbers & Math",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Numbers",
      "Math"
    ],
    "tags": [
      "math",
      "clamp",
      "utility"
    ],
    "expectedTime": "5 mins",
    "summary": "Restrict a number to fall within the inclusive range [min, max].",
    "problemStatement": "Write a function `clamp(val, min, max)` that returns `min` if `val < min`, `max` if `val > max`, and `val` otherwise.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[15, 0, 10]",
        "output": "10",
        "explanation": "15 exceeds max 10."
      },
      {
        "title": "Example 2",
        "input": "[-5, 0, 10]",
        "output": "0",
        "explanation": "-5 is below min 0."
      },
      {
        "title": "Example 3",
        "input": "[5, 0, 10]",
        "output": "5",
        "explanation": "5 is within [0, 10]."
      }
    ],
    "constraints": [
      "min <= max"
    ],
    "starterCode": "function clamp(val, min, max) {\n  // Write your solution here\n}",
    "functionName": "clamp",
    "testCases": [
      {
        "id": "tc_41_1",
        "input": "[15, 0, 10]",
        "expectedOutput": "10",
        "isHidden": false
      },
      {
        "id": "tc_41_2",
        "input": "[-5, 0, 10]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc_41_3",
        "input": "[5, 0, 10]",
        "expectedOutput": "5",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_41_4",
        "input": "[0, 0, 0]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "id": "tc_41_5",
        "input": "[100, 50, 75]",
        "expectedOutput": "75",
        "isHidden": true
      }
    ],
    "solution": "function clamp(val, min, max) {\n  return Math.min(Math.max(val, min), max);\n}",
    "explanation": "Math.min(Math.max(val, min), max) clamps efficiently in O(1).",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Math.min(Math.max(val, min), max)."
    ]
  },
  {
    "id": "JS-P042",
    "number": 42,
    "title": "Check if Number is Power of Two",
    "slug": "js-p042-check-if-number-is-power-of-two",
    "category": "JavaScript Basics",
    "subcategory": "Bitwise & Math",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Bitwise",
      "Math"
    ],
    "tags": [
      "bitwise",
      "power-of-two",
      "math"
    ],
    "expectedTime": "5 mins",
    "summary": "Determine whether a positive integer is an exact power of two.",
    "problemStatement": "Write a function `isPowerOfTwo(n)` that returns `true` if `n` is a power of two (i.e. n = 2^k for integer k >= 0), and `false` otherwise.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[16]",
        "output": "true",
        "explanation": "16 = 2^4."
      },
      {
        "title": "Example 2",
        "input": "[18]",
        "output": "false",
        "explanation": "18 is not a power of 2."
      },
      {
        "title": "Example 3",
        "input": "[1]",
        "output": "true",
        "explanation": "1 = 2^0."
      }
    ],
    "constraints": [
      "n is any integer"
    ],
    "starterCode": "function isPowerOfTwo(n) {\n  // Write your solution here\n}",
    "functionName": "isPowerOfTwo",
    "testCases": [
      {
        "id": "tc_42_1",
        "input": "[16]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_42_2",
        "input": "[18]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "id": "tc_42_3",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_42_4",
        "input": "[0]",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "id": "tc_42_5",
        "input": "[-4]",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "id": "tc_42_6",
        "input": "[1024]",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "solution": "function isPowerOfTwo(n) {\n  if (n <= 0) return false;\n  return (n & (n - 1)) === 0;\n}",
    "explanation": "A positive number is a power of 2 if and only if (n & (n - 1)) === 0.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use bitwise trick n > 0 && (n & (n - 1)) === 0."
    ]
  },
  {
    "id": "JS-P043",
    "number": 43,
    "title": "Convert Decimal to Binary String",
    "slug": "js-p043-convert-decimal-to-binary-string",
    "category": "JavaScript Basics",
    "subcategory": "Bitwise & Math",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Numbers",
      "Binary"
    ],
    "tags": [
      "binary",
      "conversion",
      "math"
    ],
    "expectedTime": "5 mins",
    "summary": "Convert a non-negative decimal integer into its base-2 binary string representation.",
    "problemStatement": "Write a function `decimalToBinary(n)` that returns the binary representation of non-negative integer `n` as a string.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[10]",
        "output": "'1010'",
        "explanation": "10 in binary is 1010."
      },
      {
        "title": "Example 2",
        "input": "[0]",
        "output": "'0'",
        "explanation": "0 is '0'."
      }
    ],
    "constraints": [
      "0 <= n <= 10^9"
    ],
    "starterCode": "function decimalToBinary(n) {\n  // Write your solution here\n}",
    "functionName": "decimalToBinary",
    "testCases": [
      {
        "id": "tc_43_1",
        "input": "[10]",
        "expectedOutput": "'1010'",
        "isHidden": false
      },
      {
        "id": "tc_43_2",
        "input": "[0]",
        "expectedOutput": "'0'",
        "isHidden": false
      },
      {
        "id": "tc_43_3",
        "input": "[7]",
        "expectedOutput": "'111'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_43_4",
        "input": "[255]",
        "expectedOutput": "'11111111'",
        "isHidden": true
      },
      {
        "id": "tc_43_5",
        "input": "[1]",
        "expectedOutput": "'1'",
        "isHidden": true
      }
    ],
    "solution": "function decimalToBinary(n) {\n  return n.toString(2);\n}",
    "explanation": "n.toString(2) converts any integer to binary string in O(log n) time.",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(log n)",
    "hints": [
      "Use n.toString(2)."
    ]
  },
  {
    "id": "JS-P044",
    "number": 44,
    "title": "Convert Binary String to Decimal",
    "slug": "js-p044-convert-binary-string-to-decimal",
    "category": "JavaScript Basics",
    "subcategory": "Bitwise & Math",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Numbers",
      "Binary"
    ],
    "tags": [
      "binary",
      "conversion",
      "math"
    ],
    "expectedTime": "5 mins",
    "summary": "Convert a binary string representation into its base-10 decimal integer.",
    "problemStatement": "Write a function `binaryToDecimal(bin)` that takes a binary string `bin` and returns its decimal integer value.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['1010']",
        "output": "10",
        "explanation": "1010 base 2 is 10 base 10."
      },
      {
        "title": "Example 2",
        "input": "['111']",
        "output": "7",
        "explanation": "111 is 7."
      }
    ],
    "constraints": [
      "bin consists only of '0' and '1'."
    ],
    "starterCode": "function binaryToDecimal(bin) {\n  // Write your solution here\n}",
    "functionName": "binaryToDecimal",
    "testCases": [
      {
        "id": "tc_44_1",
        "input": "['1010']",
        "expectedOutput": "10",
        "isHidden": false
      },
      {
        "id": "tc_44_2",
        "input": "['111']",
        "expectedOutput": "7",
        "isHidden": false
      },
      {
        "id": "tc_44_3",
        "input": "['0']",
        "expectedOutput": "0",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_44_4",
        "input": "['11111111']",
        "expectedOutput": "255",
        "isHidden": true
      },
      {
        "id": "tc_44_5",
        "input": "['10000000000']",
        "expectedOutput": "1024",
        "isHidden": true
      }
    ],
    "solution": "function binaryToDecimal(bin) {\n  return parseInt(bin, 2);\n}",
    "explanation": "parseInt(bin, 2) parses base-2 into integer.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use parseInt(bin, 2)."
    ]
  },
  {
    "id": "JS-P045",
    "number": 45,
    "title": "Check if a String is Empty or Whitespace Only",
    "slug": "js-p045-check-if-a-string-is-empty-or-whitespace-only",
    "category": "Strings",
    "subcategory": "String Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Strings",
      "Trim"
    ],
    "tags": [
      "strings",
      "whitespace",
      "validation"
    ],
    "expectedTime": "5 mins",
    "summary": "Determine if a string is empty or contains exclusively whitespace characters.",
    "problemStatement": "Write a function `isBlank(str)` that returns `true` if `str` is empty or consists solely of whitespace characters, otherwise `false`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['   ']",
        "output": "true",
        "explanation": "Whitespace only."
      },
      {
        "title": "Example 2",
        "input": "['hello']",
        "output": "false",
        "explanation": "Contains non-whitespace."
      }
    ],
    "constraints": [
      "0 <= str.length <= 10^5"
    ],
    "starterCode": "function isBlank(str) {\n  // Write your solution here\n}",
    "functionName": "isBlank",
    "testCases": [
      {
        "id": "tc_45_1",
        "input": "['   ']",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_45_2",
        "input": "['hello']",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "id": "tc_45_3",
        "input": "['']",
        "expectedOutput": "true",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_45_4",
        "input": "['  a  ']",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "id": "tc_45_5",
        "input": "['\\t\\n\\r']",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "solution": "function isBlank(str) {\n  return str.trim().length === 0;\n}",
    "explanation": "Trimming whitespace and checking length === 0.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use str.trim().length === 0."
    ]
  },
  {
    "id": "JS-P046",
    "number": 46,
    "title": "Strip Leading and Trailing Whitespace",
    "slug": "js-p046-strip-leading-and-trailing-whitespace",
    "category": "Strings",
    "subcategory": "String Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Strings",
      "Trim"
    ],
    "tags": [
      "strings",
      "trim",
      "whitespace"
    ],
    "expectedTime": "5 mins",
    "summary": "Remove whitespace from both ends of a string.",
    "problemStatement": "Write a function `trimString(str)` that removes whitespace from both the beginning and the end of string `str`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['   hello world   ']",
        "output": "'hello world'",
        "explanation": "Leading and trailing spaces removed."
      },
      {
        "title": "Example 2",
        "input": "['\\n\\tcode\\n']",
        "output": "'code'",
        "explanation": "Tabs and newlines trimmed."
      }
    ],
    "constraints": [
      "0 <= str.length <= 10^5"
    ],
    "starterCode": "function trimString(str) {\n  // Write your solution here\n}",
    "functionName": "trimString",
    "testCases": [
      {
        "id": "tc_46_1",
        "input": "['   hello world   ']",
        "expectedOutput": "'hello world'",
        "isHidden": false
      },
      {
        "id": "tc_46_2",
        "input": "['\\n\\tcode\\n']",
        "expectedOutput": "'code'",
        "isHidden": false
      },
      {
        "id": "tc_46_3",
        "input": "['already trimmed']",
        "expectedOutput": "'already trimmed'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_46_4",
        "input": "['   ']",
        "expectedOutput": "''",
        "isHidden": true
      },
      {
        "id": "tc_46_5",
        "input": "['']",
        "expectedOutput": "''",
        "isHidden": true
      }
    ],
    "solution": "function trimString(str) {\n  return str.trim();\n}",
    "explanation": "String.prototype.trim trims whitespace from both ends.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use str.trim()."
    ]
  },
  {
    "id": "JS-P047",
    "number": 47,
    "title": "Title Case a Sentence",
    "slug": "js-p047-title-case-a-sentence",
    "category": "Strings",
    "subcategory": "String Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Strings",
      "Formatting"
    ],
    "tags": [
      "strings",
      "title-case",
      "words"
    ],
    "expectedTime": "5 mins",
    "summary": "Capitalize the first letter of every word in a sentence, lowercase the rest.",
    "problemStatement": "Write a function `toTitleCase(str)` that converts each word in `str` so that its first letter is uppercase and subsequent letters are lowercase.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['the quick brown fox']",
        "output": "'The Quick Brown Fox'",
        "explanation": "First letter of each word capitalized."
      },
      {
        "title": "Example 2",
        "input": "['JAVASCRIPT IS FUN']",
        "output": "'Javascript Is Fun'",
        "explanation": "Non-initial characters lowercased."
      }
    ],
    "constraints": [
      "0 <= str.length <= 10^5"
    ],
    "starterCode": "function toTitleCase(str) {\n  // Write your solution here\n}",
    "functionName": "toTitleCase",
    "testCases": [
      {
        "id": "tc_47_1",
        "input": "['the quick brown fox']",
        "expectedOutput": "'The Quick Brown Fox'",
        "isHidden": false
      },
      {
        "id": "tc_47_2",
        "input": "['JAVASCRIPT IS FUN']",
        "expectedOutput": "'Javascript Is Fun'",
        "isHidden": false
      },
      {
        "id": "tc_47_3",
        "input": "['hello']",
        "expectedOutput": "'Hello'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_47_4",
        "input": "['']",
        "expectedOutput": "''",
        "isHidden": true
      },
      {
        "id": "tc_47_5",
        "input": "['a b c']",
        "expectedOutput": "'A B C'",
        "isHidden": true
      }
    ],
    "solution": "function toTitleCase(str) {\n  if (!str) return '';\n  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');\n}",
    "explanation": "Split by spaces, transform each word to initial upper + slice lower, join back.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Split into words, capitalize charAt(0) and lowercase remainder, then join(' ')."
    ]
  },
  {
    "id": "JS-P048",
    "number": 48,
    "title": "Count Words in a String",
    "slug": "js-p048-count-words-in-a-string",
    "category": "Strings",
    "subcategory": "String Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Strings",
      "Regex"
    ],
    "tags": [
      "strings",
      "words",
      "counting"
    ],
    "expectedTime": "5 mins",
    "summary": "Count the number of non-empty words separated by whitespace in a string.",
    "problemStatement": "Write a function `countWords(str)` that counts words in `str`. Consecutive spaces should be treated as a single delimiter. Return `0` for empty/whitespace strings.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['hello world']",
        "output": "2",
        "explanation": "2 words."
      },
      {
        "title": "Example 2",
        "input": "['  one   two   three  ']",
        "output": "3",
        "explanation": "3 words despite multiple spaces."
      }
    ],
    "constraints": [
      "0 <= str.length <= 10^5"
    ],
    "starterCode": "function countWords(str) {\n  // Write your solution here\n}",
    "functionName": "countWords",
    "testCases": [
      {
        "id": "tc_48_1",
        "input": "['hello world']",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc_48_2",
        "input": "['  one   two   three  ']",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc_48_3",
        "input": "['']",
        "expectedOutput": "0",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_48_4",
        "input": "['   ']",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "id": "tc_48_5",
        "input": "['SingleWord']",
        "expectedOutput": "1",
        "isHidden": true
      }
    ],
    "solution": "function countWords(str) {\n  const trimmed = str.trim();\n  if (!trimmed) return 0;\n  return trimmed.split(/\\s+/).length;\n}",
    "explanation": "Trim string and split on /\\s+/ whitespace regex.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Trim first, check if empty, then split(/\\s+/).length."
    ]
  },
  {
    "id": "JS-P049",
    "number": 49,
    "title": "Product of Array Elements",
    "slug": "js-p049-product-of-array-elements",
    "category": "Arrays",
    "subcategory": "Array Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Arrays",
      "Reduce"
    ],
    "tags": [
      "arrays",
      "product",
      "reduce"
    ],
    "expectedTime": "5 mins",
    "summary": "Multiply all numbers in an array together.",
    "problemStatement": "Write a function `productArray(arr)` that computes the product of all elements in `arr`. If `arr` is empty, return `1`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3, 4]]",
        "output": "24",
        "explanation": "1 * 2 * 3 * 4 = 24."
      },
      {
        "title": "Example 2",
        "input": "[[5, 0, 10]]",
        "output": "0",
        "explanation": "Multiplying with 0 is 0."
      }
    ],
    "constraints": [
      "0 <= arr.length <= 10^5"
    ],
    "starterCode": "function productArray(arr) {\n  // Write your solution here\n}",
    "functionName": "productArray",
    "testCases": [
      {
        "id": "tc_49_1",
        "input": "[[1, 2, 3, 4]]",
        "expectedOutput": "24",
        "isHidden": false
      },
      {
        "id": "tc_49_2",
        "input": "[[5, 0, 10]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc_49_3",
        "input": "[[]]",
        "expectedOutput": "1",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_49_4",
        "input": "[[-2, 3, -4]]",
        "expectedOutput": "24",
        "isHidden": true
      },
      {
        "id": "tc_49_5",
        "input": "[[7]]",
        "expectedOutput": "7",
        "isHidden": true
      }
    ],
    "solution": "function productArray(arr) {\n  return arr.reduce((acc, x) => acc * x, 1);\n}",
    "explanation": "Reduce multiplying into accumulator starting at 1.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use arr.reduce((prod, x) => prod * x, 1)."
    ]
  },
  {
    "id": "JS-P050",
    "number": 50,
    "title": "Check if All Numbers in Array are Positive",
    "slug": "js-p050-check-if-all-numbers-in-array-are-positive",
    "category": "Arrays",
    "subcategory": "Array Basics",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Arrays",
      "Every"
    ],
    "tags": [
      "arrays",
      "every",
      "positivity"
    ],
    "expectedTime": "5 mins",
    "summary": "Determine if every number in an array is strictly greater than zero.",
    "problemStatement": "Write a function `allPositive(arr)` that returns `true` if every number in `arr` is > 0. If `arr` is empty, return `true`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3, 4]]",
        "output": "true",
        "explanation": "All elements are > 0."
      },
      {
        "title": "Example 2",
        "input": "[[1, -2, 3]]",
        "output": "false",
        "explanation": "-2 is not positive."
      }
    ],
    "constraints": [
      "0 <= arr.length <= 10^5"
    ],
    "starterCode": "function allPositive(arr) {\n  // Write your solution here\n}",
    "functionName": "allPositive",
    "testCases": [
      {
        "id": "tc_50_1",
        "input": "[[1, 2, 3, 4]]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_50_2",
        "input": "[[1, -2, 3]]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "id": "tc_50_3",
        "input": "[[]]",
        "expectedOutput": "true",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_50_4",
        "input": "[[0, 1, 2]]",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "id": "tc_50_5",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "solution": "function allPositive(arr) {\n  return arr.every(x => x > 0);\n}",
    "explanation": "Array.prototype.every tests whether all elements pass x > 0.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use arr.every(x => x > 0)."
    ]
  }
];
