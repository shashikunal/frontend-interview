// src/components/coreprogramming/data/batches/batch05.ts
import type { CoreProgrammingQuestion } from '../coreProgrammingTypes';

export const coreProgrammingBatch5: CoreProgrammingQuestion[] = [
  {
    "id": "JS-P201",
    "number": 201,
    "title": "Polyfill Array.prototype.map",
    "slug": "js-p201-polyfill-array-prototype-map",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills",
      "Higher-Order Functions"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "map"
    ],
    "expectedTime": "10 mins",
    "summary": "Implement Array.prototype.map from scratch without using built-in map.",
    "problemStatement": "Write a function `myMap(arr, fn)` that calls `fn(element, index, arr)` for each element in `arr` and returns a new array with the results.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3], x => x * 2]",
        "output": "[2, 4, 6]",
        "explanation": "Doubled elements."
      }
    ],
    "constraints": [
      "Do not use Array.prototype.map."
    ],
    "starterCode": "function myMap(arr, fn) {\n  // Write your solution here\n}",
    "functionName": "myMap",
    "testCases": [
      {
        "id": "tc_201_1",
        "input": "[[1, 2, 3], x => x * 2]",
        "expectedOutput": "[2, 4, 6]",
        "isHidden": false
      },
      {
        "id": "tc_201_2",
        "input": "[['a', 'b'], (x, i) => x + i]",
        "expectedOutput": "['a0', 'b1']",
        "isHidden": false
      },
      {
        "id": "tc_201_3",
        "input": "[[], x => x]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_201_4",
        "input": "[[10, 20], x => x + 5]",
        "expectedOutput": "[15, 25]",
        "isHidden": true
      }
    ],
    "solution": "function myMap(arr, fn) {\n  const res = [];\n  for (let i = 0; i < arr.length; i++) {\n    res.push(fn(arr[i], i, arr));\n  }\n  return res;\n}",
    "explanation": "Iterate from 0 to arr.length - 1, call fn(arr[i], i, arr) and push to results array.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Loop with a for loop and invoke fn(arr[i], i, arr)."
    ]
  },
  {
    "id": "JS-P202",
    "number": 202,
    "title": "Polyfill Array.prototype.filter",
    "slug": "js-p202-polyfill-array-prototype-filter",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills",
      "Higher-Order Functions"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "filter"
    ],
    "expectedTime": "10 mins",
    "summary": "Implement Array.prototype.filter from scratch without using built-in filter.",
    "problemStatement": "Write a function `myFilter(arr, fn)` that returns a new array with all elements that pass the predicate `fn(element, index, arr)`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3, 4], x => x % 2 === 0]",
        "output": "[2, 4]",
        "explanation": "Even numbers kept."
      }
    ],
    "constraints": [
      "Do not use Array.prototype.filter."
    ],
    "starterCode": "function myFilter(arr, fn) {\n  // Write your solution here\n}",
    "functionName": "myFilter",
    "testCases": [
      {
        "id": "tc_202_1",
        "input": "[[1, 2, 3, 4], x => x % 2 === 0]",
        "expectedOutput": "[2, 4]",
        "isHidden": false
      },
      {
        "id": "tc_202_2",
        "input": "[['apple', 'banana', 'avocado'], w => w.startsWith('a')]",
        "expectedOutput": "['apple', 'avocado']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_202_3",
        "input": "[[], x => true]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "solution": "function myFilter(arr, fn) {\n  const res = [];\n  for (let i = 0; i < arr.length; i++) {\n    if (fn(arr[i], i, arr)) res.push(arr[i]);\n  }\n  return res;\n}",
    "explanation": "Iterate and push elements where fn(arr[i], i, arr) evaluates to truthy.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Check if fn(arr[i], i, arr) returns truthy."
    ]
  },
  {
    "id": "JS-P203",
    "number": 203,
    "title": "Polyfill Array.prototype.reduce",
    "slug": "js-p203-polyfill-array-prototype-reduce",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills",
      "Higher-Order Functions"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "reduce"
    ],
    "expectedTime": "10 mins",
    "summary": "Implement Array.prototype.reduce from scratch without using built-in reduce.",
    "problemStatement": "Write a function `myReduce(arr, fn, initialValue)` that executes a reducer function on each element of `arr`, returning a single accumulated result. If `initialValue` is undefined and array is empty, throw Error.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3, 4], (acc, x) => acc + x, 0]",
        "output": "10",
        "explanation": "Sum of elements."
      },
      {
        "title": "Example 2",
        "input": "[[1, 2, 3, 4], (acc, x) => acc * x]",
        "output": "24",
        "explanation": "Uses first element as accumulator."
      }
    ],
    "constraints": [
      "Do not use Array.prototype.reduce."
    ],
    "starterCode": "function myReduce(arr, fn, initialValue) {\n  // Write your solution here\n}",
    "functionName": "myReduce",
    "testCases": [
      {
        "id": "tc_203_1",
        "input": "[[1, 2, 3, 4], (acc, x) => acc + x, 0]",
        "expectedOutput": "10",
        "isHidden": false
      },
      {
        "id": "tc_203_2",
        "input": "[[1, 2, 3, 4], (acc, x) => acc * x]",
        "expectedOutput": "24",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_203_3",
        "input": "[['a', 'b', 'c'], (acc, x) => acc + x, '']",
        "expectedOutput": "'abc'",
        "isHidden": true
      }
    ],
    "solution": "function myReduce(arr, fn, initialValue) {\n  let startIndex = 0;\n  let acc;\n  if (initialValue !== undefined) {\n    acc = initialValue;\n  } else {\n    if (!arr || arr.length === 0) throw new TypeError('Reduce of empty array with no initial value');\n    acc = arr[0];\n    startIndex = 1;\n  }\n  for (let i = startIndex; i < arr.length; i++) {\n    acc = fn(acc, arr[i], i, arr);\n  }\n  return acc;\n}",
    "explanation": "Handle optional initialValue; if omitted, initialize accumulator with first element.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Check if initialValue !== undefined; if not, use arr[0] and start loop at 1."
    ]
  },
  {
    "id": "JS-P204",
    "number": 204,
    "title": "Polyfill Array.prototype.reduceRight",
    "slug": "js-p204-polyfill-array-prototype-reduceright",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "reduceRight"
    ],
    "expectedTime": "10 mins",
    "summary": "Implement Array.prototype.reduceRight from scratch.",
    "problemStatement": "Write a function `myReduceRight(arr, fn, initialValue)` that reduces `arr` from right to left.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[['1', '2', '3'], (acc, x) => acc + x, '']",
        "output": "'321'",
        "explanation": "Reduced from right to left."
      }
    ],
    "constraints": [
      "Do not use built-in reduceRight."
    ],
    "starterCode": "function myReduceRight(arr, fn, initialValue) {\n  // Write your solution here\n}",
    "functionName": "myReduceRight",
    "testCases": [
      {
        "id": "tc_204_1",
        "input": "[['1', '2', '3'], (acc, x) => acc + x, '']",
        "expectedOutput": "'321'",
        "isHidden": false
      },
      {
        "id": "tc_204_2",
        "input": "[[1, 2, 3], (acc, x) => acc - x, 0]",
        "expectedOutput": "-6",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_204_3",
        "input": "[[1, 2], (acc, x) => acc.concat(x), []]",
        "expectedOutput": "[2, 1]",
        "isHidden": true
      }
    ],
    "solution": "function myReduceRight(arr, fn, initialValue) {\n  let startIndex = arr.length - 1;\n  let acc;\n  if (initialValue !== undefined) {\n    acc = initialValue;\n  } else {\n    if (!arr || arr.length === 0) throw new TypeError();\n    acc = arr[arr.length - 1];\n    startIndex = arr.length - 2;\n  }\n  for (let i = startIndex; i >= 0; i--) {\n    acc = fn(acc, arr[i], i, arr);\n  }\n  return acc;\n}",
    "explanation": "Iterate backwards from arr.length - 1 down to 0.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Iterate backwards: for (let i = arr.length - 1; i >= 0; i--)."
    ]
  },
  {
    "id": "JS-P205",
    "number": 205,
    "title": "Polyfill Array.prototype.forEach",
    "slug": "js-p205-polyfill-array-prototype-foreach",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "forEach"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement Array.prototype.forEach from scratch.",
    "problemStatement": "Write a function `myForEach(arr, fn)` that executes `fn(item, index, arr)` on each element and returns undefined.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2], () => {}]",
        "output": "undefined",
        "explanation": "Iterates and returns undefined."
      }
    ],
    "constraints": [
      "Do not use Array.prototype.forEach."
    ],
    "starterCode": "function myForEach(arr, fn) {\n  // Write your solution here\n}",
    "functionName": "myForEach",
    "testCases": [
      {
        "id": "tc_205_1",
        "input": "[[1, 2], () => {}]",
        "expectedOutput": "undefined",
        "isHidden": false
      },
      {
        "id": "tc_205_2",
        "input": "[[], () => {}]",
        "expectedOutput": "undefined",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_205_3",
        "input": "[['a'], () => {}]",
        "expectedOutput": "undefined",
        "isHidden": true
      }
    ],
    "solution": "function myForEach(arr, fn) {\n  for (let i = 0; i < arr.length; i++) {\n    fn(arr[i], i, arr);\n  }\n  return undefined;\n}",
    "explanation": "Loop and invoke fn(arr[i], i, arr).",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Call fn(arr[i], i, arr) in a loop and return undefined."
    ]
  },
  {
    "id": "JS-P206",
    "number": 206,
    "title": "Polyfill Array.prototype.find",
    "slug": "js-p206-polyfill-array-prototype-find",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "find"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement Array.prototype.find returning the first element that satisfies a testing predicate.",
    "problemStatement": "Write a function `myFind(arr, fn)` that returns the first element in `arr` that satisfies `fn(item, index, arr)`. If none satisfies, return `undefined`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[5, 12, 8, 130, 44], x => x > 10]",
        "output": "12",
        "explanation": "12 is first element > 10."
      }
    ],
    "constraints": [
      "Do not use Array.prototype.find."
    ],
    "starterCode": "function myFind(arr, fn) {\n  // Write your solution here\n}",
    "functionName": "myFind",
    "testCases": [
      {
        "id": "tc_206_1",
        "input": "[[5, 12, 8, 130, 44], x => x > 10]",
        "expectedOutput": "12",
        "isHidden": false
      },
      {
        "id": "tc_206_2",
        "input": "[[1, 2, 3], x => x > 10]",
        "expectedOutput": "undefined",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_206_3",
        "input": "[[], x => true]",
        "expectedOutput": "undefined",
        "isHidden": true
      }
    ],
    "solution": "function myFind(arr, fn) {\n  for (let i = 0; i < arr.length; i++) {\n    if (fn(arr[i], i, arr)) return arr[i];\n  }\n  return undefined;\n}",
    "explanation": "Return arr[i] immediately when fn returns truthy.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Return arr[i] when fn returns true."
    ]
  },
  {
    "id": "JS-P207",
    "number": 207,
    "title": "Polyfill Array.prototype.findIndex",
    "slug": "js-p207-polyfill-array-prototype-findindex",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "findIndex"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement Array.prototype.findIndex returning index of first element matching predicate.",
    "problemStatement": "Write a function `myFindIndex(arr, fn)` that returns the index of the first element satisfying `fn(item, index, arr)`, or `-1`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[5, 12, 8], x => x > 10]",
        "output": "1",
        "explanation": "Index of 12 is 1."
      }
    ],
    "constraints": [
      "Do not use built-in findIndex."
    ],
    "starterCode": "function myFindIndex(arr, fn) {\n  // Write your solution here\n}",
    "functionName": "myFindIndex",
    "testCases": [
      {
        "id": "tc_207_1",
        "input": "[[5, 12, 8], x => x > 10]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc_207_2",
        "input": "[[1, 2], x => x > 10]",
        "expectedOutput": "-1",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_207_3",
        "input": "[[], x => true]",
        "expectedOutput": "-1",
        "isHidden": true
      }
    ],
    "solution": "function myFindIndex(arr, fn) {\n  for (let i = 0; i < arr.length; i++) {\n    if (fn(arr[i], i, arr)) return i;\n  }\n  return -1;\n}",
    "explanation": "Return index i if fn returns truthy, else -1.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Return index i when predicate passes, else -1."
    ]
  },
  {
    "id": "JS-P208",
    "number": 208,
    "title": "Polyfill Array.prototype.findLast",
    "slug": "js-p208-polyfill-array-prototype-findlast",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "findLast"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement Array.prototype.findLast returning the last element matching predicate.",
    "problemStatement": "Write a function `myFindLast(arr, fn)` that iterates from right to left and returns the last element satisfying `fn(item, index, arr)`, or `undefined`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[5, 12, 50, 130, 44], x => x > 45]",
        "output": "130",
        "explanation": "130 is the last element > 45."
      }
    ],
    "constraints": [
      "Do not use built-in findLast."
    ],
    "starterCode": "function myFindLast(arr, fn) {\n  // Write your solution here\n}",
    "functionName": "myFindLast",
    "testCases": [
      {
        "id": "tc_208_1",
        "input": "[[5, 12, 50, 130, 44], x => x > 45]",
        "expectedOutput": "130",
        "isHidden": false
      },
      {
        "id": "tc_208_2",
        "input": "[[1, 2], x => x > 10]",
        "expectedOutput": "undefined",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_208_3",
        "input": "[[], x => true]",
        "expectedOutput": "undefined",
        "isHidden": true
      }
    ],
    "solution": "function myFindLast(arr, fn) {\n  for (let i = arr.length - 1; i >= 0; i--) {\n    if (fn(arr[i], i, arr)) return arr[i];\n  }\n  return undefined;\n}",
    "explanation": "Loop backwards and return first matching item encountered.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Iterate backwards from arr.length - 1 to 0."
    ]
  },
  {
    "id": "JS-P209",
    "number": 209,
    "title": "Polyfill Array.prototype.findLastIndex",
    "slug": "js-p209-polyfill-array-prototype-findlastindex",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "findLastIndex"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement Array.prototype.findLastIndex returning index of last element matching predicate.",
    "problemStatement": "Write a function `myFindLastIndex(arr, fn)` that returns the index of the last element in `arr` that satisfies `fn(item, index, arr)`, or `-1`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[5, 12, 50, 130, 44], x => x > 45]",
        "output": "3",
        "explanation": "130 is at index 3."
      }
    ],
    "constraints": [
      "Do not use built-in findLastIndex."
    ],
    "starterCode": "function myFindLastIndex(arr, fn) {\n  // Write your solution here\n}",
    "functionName": "myFindLastIndex",
    "testCases": [
      {
        "id": "tc_209_1",
        "input": "[[5, 12, 50, 130, 44], x => x > 45]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc_209_2",
        "input": "[[1, 2], x => x > 10]",
        "expectedOutput": "-1",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_209_3",
        "input": "[[], x => true]",
        "expectedOutput": "-1",
        "isHidden": true
      }
    ],
    "solution": "function myFindLastIndex(arr, fn) {\n  for (let i = arr.length - 1; i >= 0; i--) {\n    if (fn(arr[i], i, arr)) return i;\n  }\n  return -1;\n}",
    "explanation": "Loop backwards returning i if match found.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Loop backwards from arr.length - 1."
    ]
  },
  {
    "id": "JS-P210",
    "number": 210,
    "title": "Polyfill Array.prototype.some",
    "slug": "js-p210-polyfill-array-prototype-some",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "some"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement Array.prototype.some testing whether at least one element passes predicate.",
    "problemStatement": "Write a function `mySome(arr, fn)` that returns `true` if at least one element satisfies `fn(item, index, arr)`, otherwise `false`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3, 4, 5], x => x % 2 === 0]",
        "output": "true",
        "explanation": "Contains even numbers."
      }
    ],
    "constraints": [
      "Do not use built-in some."
    ],
    "starterCode": "function mySome(arr, fn) {\n  // Write your solution here\n}",
    "functionName": "mySome",
    "testCases": [
      {
        "id": "tc_210_1",
        "input": "[[1, 2, 3, 4, 5], x => x % 2 === 0]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_210_2",
        "input": "[[1, 3, 5], x => x % 2 === 0]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "id": "tc_210_3",
        "input": "[[], x => true]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_210_4",
        "input": "[[10], x => x === 10]",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "solution": "function mySome(arr, fn) {\n  for (let i = 0; i < arr.length; i++) {\n    if (fn(arr[i], i, arr)) return true;\n  }\n  return false;\n}",
    "explanation": "Return true immediately if any element satisfies fn.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Return true as soon as fn returns truthy."
    ]
  },
  {
    "id": "JS-P211",
    "number": 211,
    "title": "Polyfill Array.prototype.every",
    "slug": "js-p211-polyfill-array-prototype-every",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "every"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement Array.prototype.every testing whether all elements pass predicate.",
    "problemStatement": "Write a function `myEvery(arr, fn)` that returns `true` if all elements satisfy `fn(item, index, arr)`, otherwise `false`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[2, 4, 6], x => x % 2 === 0]",
        "output": "true",
        "explanation": "All elements are even."
      }
    ],
    "constraints": [
      "Do not use built-in every."
    ],
    "starterCode": "function myEvery(arr, fn) {\n  // Write your solution here\n}",
    "functionName": "myEvery",
    "testCases": [
      {
        "id": "tc_211_1",
        "input": "[[2, 4, 6], x => x % 2 === 0]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_211_2",
        "input": "[[2, 4, 5], x => x % 2 === 0]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "id": "tc_211_3",
        "input": "[[], x => false]",
        "expectedOutput": "true",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_211_4",
        "input": "[[1], x => x > 0]",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "solution": "function myEvery(arr, fn) {\n  for (let i = 0; i < arr.length; i++) {\n    if (!fn(arr[i], i, arr)) return false;\n  }\n  return true;\n}",
    "explanation": "Return false immediately if any element fails.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Return false as soon as !fn(arr[i], i, arr)."
    ]
  },
  {
    "id": "JS-P212",
    "number": 212,
    "title": "Polyfill Array.prototype.includes",
    "slug": "js-p212-polyfill-array-prototype-includes",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "includes"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement Array.prototype.includes supporting fromIndex and NaN handling.",
    "problemStatement": "Write a function `myIncludes(arr, value, fromIndex = 0)` that checks if `value` exists in `arr`. NaN should equal NaN.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3], 2]",
        "output": "true",
        "explanation": "2 is in array."
      },
      {
        "title": "Example 2",
        "input": "[[1, NaN, 3], NaN]",
        "output": "true",
        "explanation": "NaN equals NaN."
      }
    ],
    "constraints": [
      "Do not use built-in includes."
    ],
    "starterCode": "function myIncludes(arr, value, fromIndex = 0) {\n  // Write your solution here\n}",
    "functionName": "myIncludes",
    "testCases": [
      {
        "id": "tc_212_1",
        "input": "[[1, 2, 3], 2]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_212_2",
        "input": "[[1, NaN, 3], NaN]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_212_3",
        "input": "[[1, 2, 3], 4]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_212_4",
        "input": "[[1, 2, 3], 2, 2]",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "id": "tc_212_5",
        "input": "[[], 1]",
        "expectedOutput": "false",
        "isHidden": true
      }
    ],
    "solution": "function myIncludes(arr, value, fromIndex = 0) {\n  let start = fromIndex < 0 ? Math.max(0, arr.length + fromIndex) : fromIndex;\n  const isTargetNaN = Number.isNaN(value);\n  for (let i = start; i < arr.length; i++) {\n    if (isTargetNaN && Number.isNaN(arr[i])) return true;\n    if (arr[i] === value) return true;\n  }\n  return false;\n}",
    "explanation": "Handle negative fromIndex and Number.isNaN(value) matching.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Check Number.isNaN(value) and Number.isNaN(arr[i])."
    ]
  },
  {
    "id": "JS-P213",
    "number": 213,
    "title": "Polyfill Array.prototype.indexOf",
    "slug": "js-p213-polyfill-array-prototype-indexof",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "indexOf"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement Array.prototype.indexOf with optional fromIndex.",
    "problemStatement": "Write a function `myIndexOf(arr, value, fromIndex = 0)` that returns the first index of `value` in `arr`, or `-1`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[2, 9, 9], 9]",
        "output": "1",
        "explanation": "First index is 1."
      }
    ],
    "constraints": [
      "Do not use built-in indexOf."
    ],
    "starterCode": "function myIndexOf(arr, value, fromIndex = 0) {\n  // Write your solution here\n}",
    "functionName": "myIndexOf",
    "testCases": [
      {
        "id": "tc_213_1",
        "input": "[[2, 9, 9], 9]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc_213_2",
        "input": "[[2, 9, 9], 7]",
        "expectedOutput": "-1",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_213_3",
        "input": "[[1, 2, 3], 2, 2]",
        "expectedOutput": "-1",
        "isHidden": true
      }
    ],
    "solution": "function myIndexOf(arr, value, fromIndex = 0) {\n  let start = fromIndex < 0 ? Math.max(0, arr.length + fromIndex) : fromIndex;\n  for (let i = start; i < arr.length; i++) {\n    if (arr[i] === value) return i;\n  }\n  return -1;\n}",
    "explanation": "Strict comparison starting from start index.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Strict equality === loop."
    ]
  },
  {
    "id": "JS-P214",
    "number": 214,
    "title": "Polyfill Array.prototype.lastIndexOf",
    "slug": "js-p214-polyfill-array-prototype-lastindexof",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "lastIndexOf"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement Array.prototype.lastIndexOf.",
    "problemStatement": "Write a function `myLastIndexOf(arr, value, fromIndex = arr.length - 1)` that returns the last index of `value` in `arr`, or `-1`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[2, 5, 9, 2], 2]",
        "output": "3",
        "explanation": "Last index of 2 is 3."
      }
    ],
    "constraints": [
      "Do not use built-in lastIndexOf."
    ],
    "starterCode": "function myLastIndexOf(arr, value, fromIndex) {\n  // Write your solution here\n}",
    "functionName": "myLastIndexOf",
    "testCases": [
      {
        "id": "tc_214_1",
        "input": "[[2, 5, 9, 2], 2]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc_214_2",
        "input": "[[2, 5, 9, 2], 7]",
        "expectedOutput": "-1",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_214_3",
        "input": "[[1, 2, 1], 1, 1]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "solution": "function myLastIndexOf(arr, value, fromIndex) {\n  let start = fromIndex !== undefined ? fromIndex : arr.length - 1;\n  if (start < 0) start = arr.length + start;\n  for (let i = Math.min(start, arr.length - 1); i >= 0; i--) {\n    if (arr[i] === value) return i;\n  }\n  return -1;\n}",
    "explanation": "Loop backwards from start index.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Loop backwards comparing elements."
    ]
  },
  {
    "id": "JS-P215",
    "number": 215,
    "title": "Polyfill Array.prototype.slice",
    "slug": "js-p215-polyfill-array-prototype-slice",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "slice"
    ],
    "expectedTime": "10 mins",
    "summary": "Implement Array.prototype.slice supporting negative indices.",
    "problemStatement": "Write a function `mySlice(arr, start = 0, end = arr.length)` that returns a shallow copy of a portion of `arr`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3, 4, 5], 1, 3]",
        "output": "[2, 3]",
        "explanation": "Indices 1 and 2."
      },
      {
        "title": "Example 2",
        "input": "[[1, 2, 3, 4, 5], -2]",
        "output": "[4, 5]",
        "explanation": "Last 2 elements."
      }
    ],
    "constraints": [
      "Do not use built-in slice."
    ],
    "starterCode": "function mySlice(arr, start, end) {\n  // Write your solution here\n}",
    "functionName": "mySlice",
    "testCases": [
      {
        "id": "tc_215_1",
        "input": "[[1, 2, 3, 4, 5], 1, 3]",
        "expectedOutput": "[2, 3]",
        "isHidden": false
      },
      {
        "id": "tc_215_2",
        "input": "[[1, 2, 3, 4, 5], -2]",
        "expectedOutput": "[4, 5]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_215_3",
        "input": "[[1, 2, 3], 0, 10]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": true
      }
    ],
    "solution": "function mySlice(arr, start = 0, end = arr.length) {\n  let s = start < 0 ? Math.max(0, arr.length + start) : Math.min(start, arr.length);\n  let e = end < 0 ? Math.max(0, arr.length + end) : Math.min(end, arr.length);\n  const res = [];\n  for (let i = s; i < e; i++) res.push(arr[i]);\n  return res;\n}",
    "explanation": "Normalize negative start and end indices and extract subarray.",
    "timeComplexity": "O(k)",
    "spaceComplexity": "O(k)",
    "hints": [
      "Normalize negative indices with arr.length + index."
    ]
  },
  {
    "id": "JS-P216",
    "number": 216,
    "title": "Polyfill Array.prototype.splice",
    "slug": "js-p216-polyfill-array-prototype-splice",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "splice"
    ],
    "expectedTime": "10 mins",
    "summary": "Implement Array.prototype.splice in-place modifying array and returning removed items.",
    "problemStatement": "Write a function `mySplice(arr, start, deleteCount, items = [])` that mutates `arr` removing `deleteCount` elements and inserting `items`. Returns the removed elements.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3, 4, 5], 1, 2, [99]]",
        "output": "[2, 3]",
        "explanation": "2 and 3 removed."
      }
    ],
    "constraints": [
      "Do not use built-in splice."
    ],
    "starterCode": "function mySplice(arr, start, deleteCount, items = []) {\n  // Write your solution here\n}",
    "functionName": "mySplice",
    "testCases": [
      {
        "id": "tc_216_1",
        "input": "[[1, 2, 3, 4, 5], 1, 2, [99]]",
        "expectedOutput": "[2, 3]",
        "isHidden": false
      },
      {
        "id": "tc_216_2",
        "input": "[[1, 2, 3], 0, 1, []]",
        "expectedOutput": "[1]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_216_3",
        "input": "[[10, 20], 1, 0, [15]]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "solution": "function mySplice(arr, start, deleteCount, items = []) {\n  let s = start < 0 ? Math.max(0, arr.length + start) : Math.min(start, arr.length);\n  let d = Math.min(Math.max(0, deleteCount), arr.length - s);\n  const removed = [];\n  for (let i = 0; i < d; i++) removed.push(arr[s + i]);\n  const rest = arr.slice(s + d);\n  arr.length = s;\n  for (const item of items) arr.push(item);\n  for (const item of rest) arr.push(item);\n  return removed;\n}",
    "explanation": "Save removed items, truncate at s, append new items, and restore remainder.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Save removed items, truncate array, insert new items, then append tail."
    ]
  },
  {
    "id": "JS-P217",
    "number": 217,
    "title": "Polyfill Array.prototype.concat",
    "slug": "js-p217-polyfill-array-prototype-concat",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "concat"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement Array.prototype.concat merging arrays or values.",
    "problemStatement": "Write a function `myConcat(arr, items)` that merges `arr` with an array of values/arrays in `items`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2], [[3, 4], 5]]",
        "output": "[1, 2, 3, 4, 5]",
        "explanation": "Merged."
      }
    ],
    "constraints": [
      "Do not use built-in concat."
    ],
    "starterCode": "function myConcat(arr, items) {\n  // Write your solution here\n}",
    "functionName": "myConcat",
    "testCases": [
      {
        "id": "tc_217_1",
        "input": "[[1, 2], [[3, 4], 5]]",
        "expectedOutput": "[1, 2, 3, 4, 5]",
        "isHidden": false
      },
      {
        "id": "tc_217_2",
        "input": "[['a'], ['b', 'c']]",
        "expectedOutput": "['a', 'b', 'c']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_217_3",
        "input": "[[], []]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "solution": "function myConcat(arr, items) {\n  const res = [...arr];\n  for (const item of items) {\n    if (Array.isArray(item)) for (const x of item) res.push(x);\n    else res.push(item);\n  }\n  return res;\n}",
    "explanation": "Spread arr and unpack 1 level of nested arrays in items.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Check Array.isArray for each item."
    ]
  },
  {
    "id": "JS-P218",
    "number": 218,
    "title": "Polyfill Array.prototype.flat with Depth",
    "slug": "js-p218-polyfill-array-prototype-flat-with-depth",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills",
      "Recursion"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "flat"
    ],
    "expectedTime": "10 mins",
    "summary": "Implement Array.prototype.flat supporting arbitrary recursion depth.",
    "problemStatement": "Write a function `myFlat(arr, depth = 1)` that flattens `arr` up to `depth` levels.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, [2, [3, [4]]]], 2]",
        "output": "[1, 2, 3, [4]]",
        "explanation": "Flattened 2 levels."
      }
    ],
    "constraints": [
      "depth >= 0"
    ],
    "starterCode": "function myFlat(arr, depth = 1) {\n  // Write your solution here\n}",
    "functionName": "myFlat",
    "testCases": [
      {
        "id": "tc_218_1",
        "input": "[[1, [2, [3, [4]]]], 2]",
        "expectedOutput": "[1, 2, 3, [4]]",
        "isHidden": false
      },
      {
        "id": "tc_218_2",
        "input": "[[1, [2]], 0]",
        "expectedOutput": "[1, [2]]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_218_3",
        "input": "[[[1], [[2]]], 1]",
        "expectedOutput": "[1, [2]]",
        "isHidden": true
      }
    ],
    "solution": "function myFlat(arr, depth = 1) {\n  const res = [];\n  function recurse(curr, d) {\n    for (const x of curr) {\n      if (Array.isArray(x) && d > 0) recurse(x, d - 1);\n      else res.push(x);\n    }\n  }\n  recurse(arr, depth);\n  return res;\n}",
    "explanation": "Recursively flatten when element is Array and d > 0.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "If Array.isArray(x) and depth > 0, recurse with depth - 1."
    ]
  },
  {
    "id": "JS-P219",
    "number": 219,
    "title": "Polyfill Array.prototype.flatMap",
    "slug": "js-p219-polyfill-array-prototype-flatmap",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "flatMap"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement Array.prototype.flatMap (map followed by 1-level flat).",
    "problemStatement": "Write a function `myFlatMap(arr, fn)` that maps each element and flattens the result by 1 level.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3], x => [x, x * 2]]",
        "output": "[1, 2, 2, 4, 3, 6]",
        "explanation": "Mapped and flattened."
      }
    ],
    "constraints": [
      "Do not use built-in flatMap."
    ],
    "starterCode": "function myFlatMap(arr, fn) {\n  // Write your solution here\n}",
    "functionName": "myFlatMap",
    "testCases": [
      {
        "id": "tc_219_1",
        "input": "[[1, 2, 3], x => [x, x * 2]]",
        "expectedOutput": "[1, 2, 2, 4, 3, 6]",
        "isHidden": false
      },
      {
        "id": "tc_219_2",
        "input": "[['hello world', 'goodbye'], s => s.split(' ')]",
        "expectedOutput": "['hello', 'world', 'goodbye']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_219_3",
        "input": "[[], x => [x]]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "solution": "function myFlatMap(arr, fn) {\n  const res = [];\n  for (let i = 0; i < arr.length; i++) {\n    const mapped = fn(arr[i], i, arr);\n    if (Array.isArray(mapped)) for (const x of mapped) res.push(x);\n    else res.push(mapped);\n  }\n  return res;\n}",
    "explanation": "Map each item and unpack if array.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Map with fn then push elements directly or unpack if array."
    ]
  },
  {
    "id": "JS-P220",
    "number": 220,
    "title": "Polyfill Array.prototype.join",
    "slug": "js-p220-polyfill-array-prototype-join",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "join"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement Array.prototype.join concatenating array elements with a delimiter.",
    "problemStatement": "Write a function `myJoin(arr, separator = ',')` that returns a string of elements joined by `separator`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[['Fire', 'Air', 'Water'], ' - ']",
        "output": "'Fire - Air - Water'",
        "explanation": "Joined with ' - '."
      }
    ],
    "constraints": [
      "Do not use built-in join."
    ],
    "starterCode": "function myJoin(arr, separator = ',') {\n  // Write your solution here\n}",
    "functionName": "myJoin",
    "testCases": [
      {
        "id": "tc_220_1",
        "input": "[['Fire', 'Air', 'Water'], ' - ']",
        "expectedOutput": "'Fire - Air - Water'",
        "isHidden": false
      },
      {
        "id": "tc_220_2",
        "input": "[[1, 2, 3], '']",
        "expectedOutput": "'123'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_220_3",
        "input": "[[], ',']",
        "expectedOutput": "''",
        "isHidden": true
      }
    ],
    "solution": "function myJoin(arr, separator = ',') {\n  if (!arr || arr.length === 0) return '';\n  let res = '';\n  for (let i = 0; i < arr.length; i++) {\n    const val = arr[i] === null || arr[i] === undefined ? '' : String(arr[i]);\n    res += (i === 0 ? '' : separator) + val;\n  }\n  return res;\n}",
    "explanation": "Iterate and concatenate string values with separator.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(total string length)",
    "hints": [
      "Concatenate each item, prefixing separator for index > 0."
    ]
  },
  {
    "id": "JS-P221",
    "number": 221,
    "title": "Polyfill Array.prototype.fill",
    "slug": "js-p221-polyfill-array-prototype-fill",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "fill"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement Array.prototype.fill mutably filling an array with a static value.",
    "problemStatement": "Write a function `myFill(arr, value, start = 0, end = arr.length)` that fills `arr` with `value` from index `start` up to `end`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3, 4], 0, 1, 3]",
        "output": "[1, 0, 0, 4]",
        "explanation": "Indices 1 and 2 filled with 0."
      }
    ],
    "constraints": [
      "Do not use built-in fill."
    ],
    "starterCode": "function myFill(arr, value, start, end) {\n  // Write your solution here\n}",
    "functionName": "myFill",
    "testCases": [
      {
        "id": "tc_221_1",
        "input": "[[1, 2, 3, 4], 0, 1, 3]",
        "expectedOutput": "[1, 0, 0, 4]",
        "isHidden": false
      },
      {
        "id": "tc_221_2",
        "input": "[[1, 2, 3], 9]",
        "expectedOutput": "[9, 9, 9]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_221_3",
        "input": "[[], 0]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "solution": "function myFill(arr, value, start = 0, end = arr.length) {\n  let s = start < 0 ? Math.max(0, arr.length + start) : Math.min(start, arr.length);\n  let e = end < 0 ? Math.max(0, arr.length + end) : Math.min(end, arr.length);\n  for (let i = s; i < e; i++) arr[i] = value;\n  return arr;\n}",
    "explanation": "Assign value to indices from s to e.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Normalize indices and loop assigning arr[i] = value."
    ]
  },
  {
    "id": "JS-P222",
    "number": 222,
    "title": "Polyfill Array.prototype.reverse (In-Place)",
    "slug": "js-p222-polyfill-array-prototype-reverse-in-place",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "reverse"
    ],
    "expectedTime": "5 mins",
    "summary": "Reverse an array in-place without using Array.prototype.reverse.",
    "problemStatement": "Write a function `myReverse(arr)` that reverses `arr` in place using two pointers and returns `arr`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3, 4]]",
        "output": "[4, 3, 2, 1]",
        "explanation": "In-place reversed."
      }
    ],
    "constraints": [
      "Do not use built-in reverse."
    ],
    "starterCode": "function myReverse(arr) {\n  // Write your solution here\n}",
    "functionName": "myReverse",
    "testCases": [
      {
        "id": "tc_222_1",
        "input": "[[1, 2, 3, 4]]",
        "expectedOutput": "[4, 3, 2, 1]",
        "isHidden": false
      },
      {
        "id": "tc_222_2",
        "input": "[[]]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_222_3",
        "input": "[[42]]",
        "expectedOutput": "[42]",
        "isHidden": true
      }
    ],
    "solution": "function myReverse(arr) {\n  let i = 0, j = arr.length - 1;\n  while (i < j) {\n    const t = arr[i];\n    arr[i] = arr[j];\n    arr[j] = t;\n    i++;\n    j--;\n  }\n  return arr;\n}",
    "explanation": "Swap ends moving towards center in O(n) time and O(1) space.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use two pointers i = 0 and j = arr.length - 1 and swap."
    ]
  },
  {
    "id": "JS-P223",
    "number": 223,
    "title": "Polyfill Array.prototype.at",
    "slug": "js-p223-polyfill-array-prototype-at",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "at"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement Array.prototype.at supporting negative index wrapping.",
    "problemStatement": "Write a function `myAt(arr, index)` that takes an integer `index` and returns the item at that index. Negative integers count back from the last item.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[10, 20, 30], -1]",
        "output": "30",
        "explanation": "-1 is last element."
      },
      {
        "title": "Example 2",
        "input": "[[10, 20, 30], 0]",
        "output": "10",
        "explanation": "0 is first element."
      }
    ],
    "constraints": [
      "Do not use built-in at."
    ],
    "starterCode": "function myAt(arr, index) {\n  // Write your solution here\n}",
    "functionName": "myAt",
    "testCases": [
      {
        "id": "tc_223_1",
        "input": "[[10, 20, 30], -1]",
        "expectedOutput": "30",
        "isHidden": false
      },
      {
        "id": "tc_223_2",
        "input": "[[10, 20, 30], 0]",
        "expectedOutput": "10",
        "isHidden": false
      },
      {
        "id": "tc_223_3",
        "input": "[[10, 20, 30], 5]",
        "expectedOutput": "undefined",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_223_4",
        "input": "[[10, 20, 30], -3]",
        "expectedOutput": "10",
        "isHidden": true
      }
    ],
    "solution": "function myAt(arr, index) {\n  const k = index < 0 ? arr.length + index : index;\n  if (k < 0 || k >= arr.length) return undefined;\n  return arr[k];\n}",
    "explanation": "Compute k = index < 0 ? length + index : index.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Check if index < 0, add arr.length."
    ]
  },
  {
    "id": "JS-P224",
    "number": 224,
    "title": "Polyfill Array.prototype.toReversed",
    "slug": "js-p224-polyfill-array-prototype-toreversed",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "toReversed"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement toReversed returning a reversed copy without mutating original array.",
    "problemStatement": "Write a function `myToReversed(arr)` that returns a reversed copy of `arr`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3]]",
        "output": "[3, 2, 1]",
        "explanation": "Reversed copy."
      }
    ],
    "constraints": [
      "Do not mutate arr."
    ],
    "starterCode": "function myToReversed(arr) {\n  // Write your solution here\n}",
    "functionName": "myToReversed",
    "testCases": [
      {
        "id": "tc_224_1",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "[3, 2, 1]",
        "isHidden": false
      },
      {
        "id": "tc_224_2",
        "input": "[[]]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_224_3",
        "input": "[[5, 4]]",
        "expectedOutput": "[4, 5]",
        "isHidden": true
      }
    ],
    "solution": "function myToReversed(arr) {\n  const res = new Array(arr.length);\n  for (let i = 0; i < arr.length; i++) {\n    res[arr.length - 1 - i] = arr[i];\n  }\n  return res;\n}",
    "explanation": "Populate new array in reverse index order.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Copy elements in reverse."
    ]
  },
  {
    "id": "JS-P225",
    "number": 225,
    "title": "Polyfill Array.prototype.toSorted",
    "slug": "js-p225-polyfill-array-prototype-tosorted",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "toSorted"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement toSorted returning a sorted copy of array without mutating input.",
    "problemStatement": "Write a function `myToSorted(arr, compareFn)` that returns a sorted copy of `arr` without mutating `arr`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[3, 1, 2], (a, b) => a - b]",
        "output": "[1, 2, 3]",
        "explanation": "Sorted copy."
      }
    ],
    "constraints": [
      "Do not mutate arr."
    ],
    "starterCode": "function myToSorted(arr, compareFn) {\n  // Write your solution here\n}",
    "functionName": "myToSorted",
    "testCases": [
      {
        "id": "tc_225_1",
        "input": "[[3, 1, 2], (a, b) => a - b]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false
      },
      {
        "id": "tc_225_2",
        "input": "[[], (a, b) => a - b]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_225_3",
        "input": "[[10, 5], (a, b) => a - b]",
        "expectedOutput": "[5, 10]",
        "isHidden": true
      }
    ],
    "solution": "function myToSorted(arr, compareFn) {\n  return [...arr].sort(compareFn);\n}",
    "explanation": "Spread and sort.",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use [...arr].sort(compareFn)."
    ]
  },
  {
    "id": "JS-P226",
    "number": 226,
    "title": "Polyfill Array.prototype.toSpliced",
    "slug": "js-p226-polyfill-array-prototype-tospliced",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "toSpliced"
    ],
    "expectedTime": "10 mins",
    "summary": "Implement toSpliced returning a spliced copy of array without mutating original.",
    "problemStatement": "Write a function `myToSpliced(arr, start, deleteCount, items = [])` that returns a copy of `arr` with `deleteCount` elements removed and `items` inserted.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3, 4], 1, 2, [99]]",
        "output": "[1, 99, 4]",
        "explanation": "2 and 3 replaced by 99 in copy."
      }
    ],
    "constraints": [
      "Do not mutate arr."
    ],
    "starterCode": "function myToSpliced(arr, start, deleteCount, items = []) {\n  // Write your solution here\n}",
    "functionName": "myToSpliced",
    "testCases": [
      {
        "id": "tc_226_1",
        "input": "[[1, 2, 3, 4], 1, 2, [99]]",
        "expectedOutput": "[1, 99, 4]",
        "isHidden": false
      },
      {
        "id": "tc_226_2",
        "input": "[[1, 2], 0, 1, []]",
        "expectedOutput": "[2]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_226_3",
        "input": "[[], 0, 0, [5]]",
        "expectedOutput": "[5]",
        "isHidden": true
      }
    ],
    "solution": "function myToSpliced(arr, start, deleteCount, items = []) {\n  const copy = [...arr];\n  let s = start < 0 ? Math.max(0, copy.length + start) : Math.min(start, copy.length);\n  let d = Math.min(Math.max(0, deleteCount), copy.length - s);\n  const tail = copy.slice(s + d);\n  copy.length = s;\n  for (const item of items) copy.push(item);\n  for (const item of tail) copy.push(item);\n  return copy;\n}",
    "explanation": "Perform splice logic on a cloned array and return it.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Clone arr first, then apply splice logic."
    ]
  },
  {
    "id": "JS-P227",
    "number": 227,
    "title": "Polyfill Array.prototype.with",
    "slug": "js-p227-polyfill-array-prototype-with",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "with"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement Array.prototype.with replacing an element at index in a new array copy.",
    "problemStatement": "Write a function `myWith(arr, index, value)` that returns a copy of `arr` with the element at `index` replaced by `value`. Negative index counts from end.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3], 1, 10]",
        "output": "[1, 10, 3]",
        "explanation": "Index 1 replaced with 10."
      },
      {
        "title": "Example 2",
        "input": "[[1, 2, 3], -1, 99]",
        "output": "[1, 2, 99]",
        "explanation": "Last index replaced."
      }
    ],
    "constraints": [
      "index in valid bounds."
    ],
    "starterCode": "function myWith(arr, index, value) {\n  // Write your solution here\n}",
    "functionName": "myWith",
    "testCases": [
      {
        "id": "tc_227_1",
        "input": "[[1, 2, 3], 1, 10]",
        "expectedOutput": "[1, 10, 3]",
        "isHidden": false
      },
      {
        "id": "tc_227_2",
        "input": "[[1, 2, 3], -1, 99]",
        "expectedOutput": "[1, 2, 99]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_227_3",
        "input": "[[42], 0, 100]",
        "expectedOutput": "[100]",
        "isHidden": true
      }
    ],
    "solution": "function myWith(arr, index, value) {\n  const res = [...arr];\n  const k = index < 0 ? arr.length + index : index;\n  res[k] = value;\n  return res;\n}",
    "explanation": "Clone array and assign value at normalized index k.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Normalize index k and set copy[k] = value."
    ]
  },
  {
    "id": "JS-P228",
    "number": 228,
    "title": "Polyfill Array.from",
    "slug": "js-p228-polyfill-array-from",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "from"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement Array.from converting an array-like or iterable to array.",
    "problemStatement": "Write a function `myArrayFrom(arrayLike, mapFn)` that converts `arrayLike` (object with length or iterable) into an array, optionally mapping with `mapFn`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['foo', x => x.toUpperCase()]",
        "output": "['F', 'O', 'O']",
        "explanation": "String converted and mapped."
      }
    ],
    "constraints": [
      "arrayLike has length or is iterable."
    ],
    "starterCode": "function myArrayFrom(arrayLike, mapFn) {\n  // Write your solution here\n}",
    "functionName": "myArrayFrom",
    "testCases": [
      {
        "id": "tc_228_1",
        "input": "['foo', x => x.toUpperCase()]",
        "expectedOutput": "['F', 'O', 'O']",
        "isHidden": false
      },
      {
        "id": "tc_228_2",
        "input": "[{ length: 2, 0: 'a', 1: 'b' }]",
        "expectedOutput": "['a', 'b']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_228_3",
        "input": "[[]]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "solution": "function myArrayFrom(arrayLike, mapFn) {\n  const res = [];\n  const len = arrayLike.length || 0;\n  for (let i = 0; i < len; i++) {\n    const val = arrayLike[i];\n    res.push(mapFn ? mapFn(val, i) : val);\n  }\n  return res;\n}",
    "explanation": "Loop through length property and apply optional mapFn.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Iterate from 0 to arrayLike.length."
    ]
  },
  {
    "id": "JS-P229",
    "number": 229,
    "title": "Polyfill Array.isArray",
    "slug": "js-p229-polyfill-array-isarray",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills",
      "Type Checking"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "isArray"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement Array.isArray from scratch using Object.prototype.toString.",
    "problemStatement": "Write a function `myIsArray(val)` that returns `true` if `val` is an Array, otherwise `false`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3]]",
        "output": "true",
        "explanation": "Array is true."
      },
      {
        "title": "Example 2",
        "input": "[{ length: 0 }]",
        "output": "false",
        "explanation": "Array-like is false."
      }
    ],
    "constraints": [
      "Do not use built-in Array.isArray."
    ],
    "starterCode": "function myIsArray(val) {\n  // Write your solution here\n}",
    "functionName": "myIsArray",
    "testCases": [
      {
        "id": "tc_229_1",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_229_2",
        "input": "[{ length: 0 }]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "id": "tc_229_3",
        "input": "['hello']",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_229_4",
        "input": "[null]",
        "expectedOutput": "false",
        "isHidden": true
      }
    ],
    "solution": "function myIsArray(val) {\n  return Object.prototype.toString.call(val) === '[object Array]';\n}",
    "explanation": "Object.prototype.toString.call(val) reliably returns '[object Array]'.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use Object.prototype.toString.call(val) === '[object Array]'."
    ]
  },
  {
    "id": "JS-P230",
    "number": 230,
    "title": "Polyfill Array.of",
    "slug": "js-p230-polyfill-array-of",
    "category": "Array Method Implementation",
    "subcategory": "Polyfill",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Array Polyfills"
    ],
    "tags": [
      "arrays",
      "polyfill",
      "of"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement Array.of creating an array from variable arguments.",
    "problemStatement": "Write a function `myArrayOf(...items)` that returns a new array composed of the arguments passed.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[1, 2, 3]",
        "output": "[1, 2, 3]",
        "explanation": "Array created."
      },
      {
        "title": "Example 2",
        "input": "[7]",
        "output": "[7]",
        "explanation": "Single element array."
      }
    ],
    "constraints": [
      "Do not use built-in Array.of."
    ],
    "starterCode": "function myArrayOf(...items) {\n  // Write your solution here\n}",
    "functionName": "myArrayOf",
    "testCases": [
      {
        "id": "tc_230_1",
        "input": "[1, 2, 3]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false
      },
      {
        "id": "tc_230_2",
        "input": "[7]",
        "expectedOutput": "[7]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_230_3",
        "input": "['a', 'b']",
        "expectedOutput": "['a', 'b']",
        "isHidden": true
      }
    ],
    "solution": "function myArrayOf(...items) {\n  return items;\n}",
    "explanation": "Rest parameter directly captures arguments as an array.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Return items rest parameter."
    ]
  },
  {
    "id": "JS-P231",
    "number": 231,
    "title": "Custom Array Bubble Sort",
    "slug": "js-p231-custom-array-bubble-sort",
    "category": "Recursion / Algorithms",
    "subcategory": "Sorting",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Sorting",
      "Algorithms"
    ],
    "tags": [
      "sorting",
      "bubble-sort",
      "algorithms"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement the classic Bubble Sort algorithm.",
    "problemStatement": "Write a function `bubbleSort(arr)` that sorts `arr` in ascending order using Bubble Sort.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[5, 1, 4, 2, 8]]",
        "output": "[1, 2, 4, 5, 8]",
        "explanation": "Sorted."
      }
    ],
    "constraints": [
      "0 <= arr.length <= 1000"
    ],
    "starterCode": "function bubbleSort(arr) {\n  // Write your solution here\n}",
    "functionName": "bubbleSort",
    "testCases": [
      {
        "id": "tc_231_1",
        "input": "[[5, 1, 4, 2, 8]]",
        "expectedOutput": "[1, 2, 4, 5, 8]",
        "isHidden": false
      },
      {
        "id": "tc_231_2",
        "input": "[[]]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_231_3",
        "input": "[[3, 2, 1]]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": true
      }
    ],
    "solution": "function bubbleSort(arr) {\n  const res = [...arr];\n  for (let i = 0; i < res.length; i++) {\n    for (let j = 0; j < res.length - 1 - i; j++) {\n      if (res[j] > res[j + 1]) {\n        const t = res[j];\n        res[j] = res[j + 1];\n        res[j + 1] = t;\n      }\n    }\n  }\n  return res;\n}",
    "explanation": "Repeatedly swap adjacent elements that are out of order.",
    "timeComplexity": "O(n^2)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Compare adjacent elements and swap if res[j] > res[j + 1]."
    ]
  },
  {
    "id": "JS-P232",
    "number": 232,
    "title": "Custom Array Selection Sort",
    "slug": "js-p232-custom-array-selection-sort",
    "category": "Recursion / Algorithms",
    "subcategory": "Sorting",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Sorting",
      "Algorithms"
    ],
    "tags": [
      "sorting",
      "selection-sort",
      "algorithms"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement the Selection Sort algorithm.",
    "problemStatement": "Write a function `selectionSort(arr)` that sorts `arr` in ascending order using Selection Sort.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[64, 25, 12, 22, 11]]",
        "output": "[11, 12, 22, 25, 64]",
        "explanation": "Sorted."
      }
    ],
    "constraints": [
      "0 <= arr.length <= 1000"
    ],
    "starterCode": "function selectionSort(arr) {\n  // Write your solution here\n}",
    "functionName": "selectionSort",
    "testCases": [
      {
        "id": "tc_232_1",
        "input": "[[64, 25, 12, 22, 11]]",
        "expectedOutput": "[11, 12, 22, 25, 64]",
        "isHidden": false
      },
      {
        "id": "tc_232_2",
        "input": "[[]]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_232_3",
        "input": "[[2, 1]]",
        "expectedOutput": "[1, 2]",
        "isHidden": true
      }
    ],
    "solution": "function selectionSort(arr) {\n  const res = [...arr];\n  for (let i = 0; i < res.length; i++) {\n    let minIdx = i;\n    for (let j = i + 1; j < res.length; j++) {\n      if (res[j] < res[minIdx]) minIdx = j;\n    }\n    if (minIdx !== i) {\n      const t = res[i];\n      res[i] = res[minIdx];\n      res[minIdx] = t;\n    }\n  }\n  return res;\n}",
    "explanation": "Find the minimum element in unsorted portion and swap to position i.",
    "timeComplexity": "O(n^2)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Find min index in remaining slice and swap with i."
    ]
  },
  {
    "id": "JS-P233",
    "number": 233,
    "title": "Custom Array Insertion Sort",
    "slug": "js-p233-custom-array-insertion-sort",
    "category": "Recursion / Algorithms",
    "subcategory": "Sorting",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Sorting",
      "Algorithms"
    ],
    "tags": [
      "sorting",
      "insertion-sort",
      "algorithms"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement the Insertion Sort algorithm.",
    "problemStatement": "Write a function `insertionSort(arr)` that sorts `arr` in ascending order using Insertion Sort.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[12, 11, 13, 5, 6]]",
        "output": "[5, 6, 11, 12, 13]",
        "explanation": "Sorted."
      }
    ],
    "constraints": [
      "0 <= arr.length <= 1000"
    ],
    "starterCode": "function insertionSort(arr) {\n  // Write your solution here\n}",
    "functionName": "insertionSort",
    "testCases": [
      {
        "id": "tc_233_1",
        "input": "[[12, 11, 13, 5, 6]]",
        "expectedOutput": "[5, 6, 11, 12, 13]",
        "isHidden": false
      },
      {
        "id": "tc_233_2",
        "input": "[[]]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_233_3",
        "input": "[[3, 1]]",
        "expectedOutput": "[1, 3]",
        "isHidden": true
      }
    ],
    "solution": "function insertionSort(arr) {\n  const res = [...arr];\n  for (let i = 1; i < res.length; i++) {\n    const key = res[i];\n    let j = i - 1;\n    while (j >= 0 && res[j] > key) {\n      res[j + 1] = res[j];\n      j--;\n    }\n    res[j + 1] = key;\n  }\n  return res;\n}",
    "explanation": "Shift elements greater than key to the right and insert key.",
    "timeComplexity": "O(n^2)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Insert each element into its sorted position in the prefix."
    ]
  },
  {
    "id": "JS-P234",
    "number": 234,
    "title": "Custom Array Merge Sort",
    "slug": "js-p234-custom-array-merge-sort",
    "category": "Recursion / Algorithms",
    "subcategory": "Sorting",
    "difficulty": "Medium",
    "questionType": "Coding",
    "skills": [
      "Sorting",
      "Divide and Conquer"
    ],
    "tags": [
      "sorting",
      "merge-sort",
      "divide-and-conquer"
    ],
    "expectedTime": "10 mins",
    "summary": "Implement Merge Sort divide-and-conquer algorithm.",
    "problemStatement": "Write a function `mergeSort(arr)` that sorts `arr` in ascending order using Merge Sort in O(n log n) time.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[38, 27, 43, 3, 9, 82, 10]]",
        "output": "[3, 9, 10, 27, 38, 43, 82]",
        "explanation": "Sorted."
      }
    ],
    "constraints": [
      "0 <= arr.length <= 10^5"
    ],
    "starterCode": "function mergeSort(arr) {\n  // Write your solution here\n}",
    "functionName": "mergeSort",
    "testCases": [
      {
        "id": "tc_234_1",
        "input": "[[38, 27, 43, 3, 9, 82, 10]]",
        "expectedOutput": "[3, 9, 10, 27, 38, 43, 82]",
        "isHidden": false
      },
      {
        "id": "tc_234_2",
        "input": "[[]]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_234_3",
        "input": "[[2, 1]]",
        "expectedOutput": "[1, 2]",
        "isHidden": true
      }
    ],
    "solution": "function mergeSort(arr) {\n  if (arr.length <= 1) return [...arr];\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  const res = [];\n  let i = 0, j = 0;\n  while (i < left.length && j < right.length) {\n    if (left[i] <= right[j]) res.push(left[i++]);\n    else res.push(right[j++]);\n  }\n  while (i < left.length) res.push(left[i++]);\n  while (j < right.length) res.push(right[j++]);\n  return res;\n}",
    "explanation": "Split into halves, sort recursively, and merge two sorted arrays.",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Divide array into halves, sort recursively, then merge."
    ]
  },
  {
    "id": "JS-P235",
    "number": 235,
    "title": "Custom Array Quick Sort",
    "slug": "js-p235-custom-array-quick-sort",
    "category": "Recursion / Algorithms",
    "subcategory": "Sorting",
    "difficulty": "Medium",
    "questionType": "Coding",
    "skills": [
      "Sorting",
      "Divide and Conquer"
    ],
    "tags": [
      "sorting",
      "quick-sort",
      "algorithms"
    ],
    "expectedTime": "10 mins",
    "summary": "Implement the Quick Sort algorithm.",
    "problemStatement": "Write a function `quickSort(arr)` that sorts `arr` in ascending order using Quick Sort.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[10, 80, 30, 90, 40, 50, 70]]",
        "output": "[10, 30, 40, 50, 70, 80, 90]",
        "explanation": "Sorted."
      }
    ],
    "constraints": [
      "0 <= arr.length <= 10^5"
    ],
    "starterCode": "function quickSort(arr) {\n  // Write your solution here\n}",
    "functionName": "quickSort",
    "testCases": [
      {
        "id": "tc_235_1",
        "input": "[[10, 80, 30, 90, 40, 50, 70]]",
        "expectedOutput": "[10, 30, 40, 50, 70, 80, 90]",
        "isHidden": false
      },
      {
        "id": "tc_235_2",
        "input": "[[]]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_235_3",
        "input": "[[5, 2, 3, 1]]",
        "expectedOutput": "[1, 2, 3, 5]",
        "isHidden": true
      }
    ],
    "solution": "function quickSort(arr) {\n  if (arr.length <= 1) return [...arr];\n  const pivot = arr[Math.floor(arr.length / 2)];\n  const left = [], middle = [], right = [];\n  for (const x of arr) {\n    if (x < pivot) left.push(x);\n    else if (x === pivot) middle.push(x);\n    else right.push(x);\n  }\n  return [...quickSort(left), ...middle, ...quickSort(right)];\n}",
    "explanation": "Partition into elements less than, equal to, and greater than pivot.",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Partition array around pivot into left, middle, right."
    ]
  },
  {
    "id": "JS-P236",
    "number": 236,
    "title": "Binary Search on Sorted Array",
    "slug": "js-p236-binary-search-on-sorted-array",
    "category": "Recursion / Algorithms",
    "subcategory": "Binary Search",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Binary Search"
    ],
    "tags": [
      "search",
      "binary-search",
      "algorithms"
    ],
    "expectedTime": "5 mins",
    "summary": "Find target in sorted array in O(log n) time.",
    "problemStatement": "Write a function `binarySearch(arr, target)` that returns the index of `target` in sorted array `arr`, or `-1` if not found.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[-1, 0, 3, 5, 9, 12], 9]",
        "output": "4",
        "explanation": "9 is at index 4."
      }
    ],
    "constraints": [
      "arr is sorted in ascending order."
    ],
    "starterCode": "function binarySearch(arr, target) {\n  // Write your solution here\n}",
    "functionName": "binarySearch",
    "testCases": [
      {
        "id": "tc_236_1",
        "input": "[[-1, 0, 3, 5, 9, 12], 9]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "id": "tc_236_2",
        "input": "[[-1, 0, 3, 5, 9, 12], 2]",
        "expectedOutput": "-1",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_236_3",
        "input": "[[5], 5]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "solution": "function binarySearch(arr, target) {\n  let low = 0, high = arr.length - 1;\n  while (low <= high) {\n    const mid = Math.floor((low + high) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}",
    "explanation": "Halve search space each iteration in O(log n) time.",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "While low <= high, check mid = Math.floor((low + high) / 2)."
    ]
  },
  {
    "id": "JS-P237",
    "number": 237,
    "title": "Implement Array Drop While",
    "slug": "js-p237-implement-array-drop-while",
    "category": "Array Method Implementation",
    "subcategory": "Utility",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Arrays",
      "dropWhile"
    ],
    "tags": [
      "arrays",
      "dropWhile",
      "utility"
    ],
    "expectedTime": "5 mins",
    "summary": "Drop elements from array while predicate returns true.",
    "problemStatement": "Write a function `dropWhile(arr, predicate)` that returns a slice of `arr` excluding elements dropped from the beginning as long as `predicate(item)` returns true.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3, 4, 5], x => x < 3]",
        "output": "[3, 4, 5]",
        "explanation": "1 and 2 dropped."
      }
    ],
    "constraints": [
      "Array with predicate."
    ],
    "starterCode": "function dropWhile(arr, predicate) {\n  // Write your solution here\n}",
    "functionName": "dropWhile",
    "testCases": [
      {
        "id": "tc_237_1",
        "input": "[[1, 2, 3, 4, 5], x => x < 3]",
        "expectedOutput": "[3, 4, 5]",
        "isHidden": false
      },
      {
        "id": "tc_237_2",
        "input": "[[1, 2], x => x > 5]",
        "expectedOutput": "[1, 2]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_237_3",
        "input": "[[], x => true]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "solution": "function dropWhile(arr, predicate) {\n  let i = 0;\n  while (i < arr.length && predicate(arr[i])) i++;\n  return arr.slice(i);\n}",
    "explanation": "Advance index until predicate fails, return slice from that index.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Advance i while i < arr.length && predicate(arr[i]), return arr.slice(i)."
    ]
  },
  {
    "id": "JS-P238",
    "number": 238,
    "title": "Implement Array Take While",
    "slug": "js-p238-implement-array-take-while",
    "category": "Array Method Implementation",
    "subcategory": "Utility",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Arrays",
      "takeWhile"
    ],
    "tags": [
      "arrays",
      "takeWhile",
      "utility"
    ],
    "expectedTime": "5 mins",
    "summary": "Take elements from beginning of array while predicate returns true.",
    "problemStatement": "Write a function `takeWhile(arr, predicate)` that returns elements from `arr` starting from the beginning as long as `predicate(item)` returns true.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3, 4, 5], x => x < 3]",
        "output": "[1, 2]",
        "explanation": "Takes 1 and 2."
      }
    ],
    "constraints": [
      "Array with predicate."
    ],
    "starterCode": "function takeWhile(arr, predicate) {\n  // Write your solution here\n}",
    "functionName": "takeWhile",
    "testCases": [
      {
        "id": "tc_238_1",
        "input": "[[1, 2, 3, 4, 5], x => x < 3]",
        "expectedOutput": "[1, 2]",
        "isHidden": false
      },
      {
        "id": "tc_238_2",
        "input": "[[1, 2], x => x > 5]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_238_3",
        "input": "[[], x => true]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "solution": "function takeWhile(arr, predicate) {\n  const res = [];\n  for (let i = 0; i < arr.length; i++) {\n    if (!predicate(arr[i])) break;\n    res.push(arr[i]);\n  }\n  return res;\n}",
    "explanation": "Push elements until predicate returns falsy.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Break out of loop as soon as !predicate(arr[i])."
    ]
  },
  {
    "id": "JS-P239",
    "number": 239,
    "title": "Implement Array Partition by Predicate",
    "slug": "js-p239-implement-array-partition-by-predicate",
    "category": "Array Method Implementation",
    "subcategory": "Utility",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Arrays",
      "partition"
    ],
    "tags": [
      "arrays",
      "partition",
      "utility"
    ],
    "expectedTime": "5 mins",
    "summary": "Split an array into [passed, failed] based on predicate result.",
    "problemStatement": "Write a function `partitionArray(arr, predicate)` that returns `[passed, failed]` where `passed` contains elements satisfying `predicate` and `failed` contains the rest.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3, 4], x => x % 2 === 0]",
        "output": "[[2, 4], [1, 3]]",
        "explanation": "Even and odd split."
      }
    ],
    "constraints": [
      "Array with predicate."
    ],
    "starterCode": "function partitionArray(arr, predicate) {\n  // Write your solution here\n}",
    "functionName": "partitionArray",
    "testCases": [
      {
        "id": "tc_239_1",
        "input": "[[1, 2, 3, 4], x => x % 2 === 0]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false
      },
      {
        "id": "tc_239_2",
        "input": "[[], x => true]",
        "expectedOutput": "[[], []]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_239_3",
        "input": "[[5], x => x > 10]",
        "expectedOutput": "[[], [5]]",
        "isHidden": true
      }
    ],
    "solution": "function partitionArray(arr, predicate) {\n  const pass = [], fail = [];\n  for (let i = 0; i < arr.length; i++) {\n    if (predicate(arr[i], i)) pass.push(arr[i]);\n    else fail.push(arr[i]);\n  }\n  return [pass, fail];\n}",
    "explanation": "Sort items into pass and fail arrays based on predicate.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Separate into two arrays pass and fail."
    ]
  },
  {
    "id": "JS-P240",
    "number": 240,
    "title": "Implement Array Compact Map",
    "slug": "js-p240-implement-array-compact-map",
    "category": "Array Method Implementation",
    "subcategory": "Utility",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Arrays",
      "compactMap"
    ],
    "tags": [
      "arrays",
      "compactMap",
      "utility"
    ],
    "expectedTime": "5 mins",
    "summary": "Map elements and filter out null and undefined results.",
    "problemStatement": "Write a function `compactMap(arr, fn)` that applies `fn` to each item and returns non-null/non-undefined results.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[['1', 'two', '3'], x => isNaN(parseInt(x, 10)) ? null : parseInt(x, 10)]",
        "output": "[1, 3]",
        "explanation": "'two' mapped to null and filtered out."
      }
    ],
    "constraints": [
      "Array with mapping function."
    ],
    "starterCode": "function compactMap(arr, fn) {\n  // Write your solution here\n}",
    "functionName": "compactMap",
    "testCases": [
      {
        "id": "tc_240_1",
        "input": "[['1', 'two', '3'], x => isNaN(parseInt(x, 10)) ? null : parseInt(x, 10)]",
        "expectedOutput": "[1, 3]",
        "isHidden": false
      },
      {
        "id": "tc_240_2",
        "input": "[[], x => x]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_240_3",
        "input": "[[1, 2], x => x === 1 ? undefined : x]",
        "expectedOutput": "[2]",
        "isHidden": true
      }
    ],
    "solution": "function compactMap(arr, fn) {\n  const res = [];\n  for (let i = 0; i < arr.length; i++) {\n    const val = fn(arr[i], i, arr);\n    if (val !== null && val !== undefined) res.push(val);\n  }\n  return res;\n}",
    "explanation": "Map with fn and only push values that are not null or undefined.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Check if fn(x) !== null && fn(x) !== undefined."
    ]
  },
  {
    "id": "JS-P241",
    "number": 241,
    "title": "Count Elements by Predicate",
    "slug": "js-p241-count-elements-by-predicate",
    "category": "Array Method Implementation",
    "subcategory": "Counting",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Arrays",
      "Counting"
    ],
    "tags": [
      "arrays",
      "count",
      "predicate"
    ],
    "expectedTime": "5 mins",
    "summary": "Count how many elements in an array satisfy a given predicate function.",
    "problemStatement": "Write a function `countByPredicate(arr, predicate)` that returns the number of elements in `arr` for which `predicate(item)` returns true.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3, 4, 5], x => x > 2]",
        "output": "3",
        "explanation": "3 elements (3, 4, 5) > 2."
      }
    ],
    "constraints": [
      "Array with predicate."
    ],
    "starterCode": "function countByPredicate(arr, predicate) {\n  // Write your solution here\n}",
    "functionName": "countByPredicate",
    "testCases": [
      {
        "id": "tc_241_1",
        "input": "[[1, 2, 3, 4, 5], x => x > 2]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc_241_2",
        "input": "[[], x => true]",
        "expectedOutput": "0",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_241_3",
        "input": "[[1, 3], x => x % 2 === 0]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "solution": "function countByPredicate(arr, predicate) {\n  let count = 0;\n  for (let i = 0; i < arr.length; i++) {\n    if (predicate(arr[i], i)) count++;\n  }\n  return count;\n}",
    "explanation": "Loop and increment counter when predicate holds.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Increment count if predicate(arr[i]) === true."
    ]
  },
  {
    "id": "JS-P242",
    "number": 242,
    "title": "Find Index of All Occurrences of Target",
    "slug": "js-p242-find-index-of-all-occurrences-of-target",
    "category": "Array Method Implementation",
    "subcategory": "Searching",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Arrays",
      "Searching"
    ],
    "tags": [
      "arrays",
      "indices",
      "search"
    ],
    "expectedTime": "5 mins",
    "summary": "Return an array of all indices where target value appears.",
    "problemStatement": "Write a function `allIndicesOf(arr, target)` that returns an array of all zero-based indices where `arr[i] === target`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3, 2, 4, 2], 2]",
        "output": "[1, 3, 5]",
        "explanation": "2 appears at indices 1, 3, 5."
      }
    ],
    "constraints": [
      "0 <= arr.length <= 10^5"
    ],
    "starterCode": "function allIndicesOf(arr, target) {\n  // Write your solution here\n}",
    "functionName": "allIndicesOf",
    "testCases": [
      {
        "id": "tc_242_1",
        "input": "[[1, 2, 3, 2, 4, 2], 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false
      },
      {
        "id": "tc_242_2",
        "input": "[[1, 2, 3], 99]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_242_3",
        "input": "[[], 1]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "solution": "function allIndicesOf(arr, target) {\n  const res = [];\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) res.push(i);\n  }\n  return res;\n}",
    "explanation": "Loop and collect matching indices.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Push index i whenever arr[i] === target."
    ]
  },
  {
    "id": "JS-P243",
    "number": 243,
    "title": "Deterministic Sample N Elements from Array",
    "slug": "js-p243-deterministic-sample-n-elements-from-array",
    "category": "Array Method Implementation",
    "subcategory": "Sampling",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Arrays",
      "Sampling"
    ],
    "tags": [
      "arrays",
      "sample",
      "modulo"
    ],
    "expectedTime": "5 mins",
    "summary": "Take N evenly spaced sample elements across an array.",
    "problemStatement": "Write a function `sampleSize(arr, n)` that returns the first `n` elements from `arr` (or all elements if `n >= arr.length`).",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3, 4, 5], 3]",
        "output": "[1, 2, 3]",
        "explanation": "First 3 elements."
      }
    ],
    "constraints": [
      "n >= 0"
    ],
    "starterCode": "function sampleSize(arr, n) {\n  // Write your solution here\n}",
    "functionName": "sampleSize",
    "testCases": [
      {
        "id": "tc_243_1",
        "input": "[[1, 2, 3, 4, 5], 3]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false
      },
      {
        "id": "tc_243_2",
        "input": "[[1, 2], 5]",
        "expectedOutput": "[1, 2]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_243_3",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "solution": "function sampleSize(arr, n) {\n  return arr.slice(0, n);\n}",
    "explanation": "Return slice from 0 to n.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use arr.slice(0, n)."
    ]
  },
  {
    "id": "JS-P244",
    "number": 244,
    "title": "Cyclic Permutation Shuffle of Array",
    "slug": "js-p244-cyclic-permutation-shuffle-of-array",
    "category": "Array Method Implementation",
    "subcategory": "Permutations",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Arrays",
      "Permutations"
    ],
    "tags": [
      "arrays",
      "shuffle",
      "cyclic"
    ],
    "expectedTime": "5 mins",
    "summary": "Shift each element to (i * 2 + 1) % length in a new array.",
    "problemStatement": "Write a function `cyclicShuffle(arr)` that returns a new array where item at index `i` is placed at `(i * 2 + 1) % arr.length`. If `arr.length <= 1`, return `[...arr]`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3]]",
        "output": "[2, 1, 3]",
        "explanation": "arr[0] goes to idx 1, arr[1] goes to idx 0, arr[2] goes to idx 2 -> [2, 1, 3]."
      }
    ],
    "constraints": [
      "0 <= arr.length <= 1000"
    ],
    "starterCode": "function cyclicShuffle(arr) {\n  // Write your solution here\n}",
    "functionName": "cyclicShuffle",
    "testCases": [
      {
        "id": "tc_244_1",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "[2, 1, 3]",
        "isHidden": false
      },
      {
        "id": "tc_244_2",
        "input": "[[]]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_244_3",
        "input": "[[42]]",
        "expectedOutput": "[42]",
        "isHidden": true
      }
    ],
    "solution": "function cyclicShuffle(arr) {\n  if (arr.length <= 1) return [...arr];\n  const res = new Array(arr.length);\n  for (let i = 0; i < arr.length; i++) {\n    res[(i * 2 + 1) % arr.length] = arr[i];\n  }\n  return res;\n}",
    "explanation": "Compute target position (i * 2 + 1) % arr.length.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Assign res[(i * 2 + 1) % arr.length] = arr[i]."
    ]
  },
  {
    "id": "JS-P245",
    "number": 245,
    "title": "Deep Flatten Array to Any Depth",
    "slug": "js-p245-deep-flatten-array-to-any-depth",
    "category": "Array Method Implementation",
    "subcategory": "Flattening",
    "difficulty": "Medium",
    "questionType": "Coding",
    "skills": [
      "Arrays",
      "Recursion"
    ],
    "tags": [
      "arrays",
      "flat",
      "deep"
    ],
    "expectedTime": "10 mins",
    "summary": "Recursively flatten arbitrarily nested arrays completely into a 1D array.",
    "problemStatement": "Write a function `deepFlat(arr)` that recursively flattens `arr` regardless of nesting depth.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, [2, [3, [4, [5]]]]]]",
        "output": "[1, 2, 3, 4, 5]",
        "explanation": "Deeply flattened."
      }
    ],
    "constraints": [
      "Arbitrary nesting depth."
    ],
    "starterCode": "function deepFlat(arr) {\n  // Write your solution here\n}",
    "functionName": "deepFlat",
    "testCases": [
      {
        "id": "tc_245_1",
        "input": "[[1, [2, [3, [4, [5]]]]]]",
        "expectedOutput": "[1, 2, 3, 4, 5]",
        "isHidden": false
      },
      {
        "id": "tc_245_2",
        "input": "[[[[]]]]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_245_3",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": true
      }
    ],
    "solution": "function deepFlat(arr) {\n  const res = [];\n  function recurse(curr) {\n    for (const x of curr) {\n      if (Array.isArray(x)) recurse(x);\n      else res.push(x);\n    }\n  }\n  recurse(arr);\n  return res;\n}",
    "explanation": "Recursive traversal flattening every array encounter.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Recurse on Array.isArray(x) else push(x)."
    ]
  },
  {
    "id": "JS-P246",
    "number": 246,
    "title": "Count Subarray Occurrences Within Parent Array",
    "slug": "js-p246-count-subarray-occurrences-within-parent-array",
    "category": "Array Method Implementation",
    "subcategory": "Subarrays",
    "difficulty": "Easy",
    "questionType": "Coding",
    "skills": [
      "Arrays",
      "Subarrays"
    ],
    "tags": [
      "arrays",
      "subarrays",
      "counting"
    ],
    "expectedTime": "5 mins",
    "summary": "Count the number of times a sequence of elements appears contiguously.",
    "problemStatement": "Write a function `countSubarrays(arr, sub)` that counts non-overlapping contiguous occurrences of sequence `sub` in `arr`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3, 1, 2, 4], [1, 2]]",
        "output": "2",
        "explanation": "[1, 2] appears twice."
      }
    ],
    "constraints": [
      "0 <= arr.length <= 10^5"
    ],
    "starterCode": "function countSubarrays(arr, sub) {\n  // Write your solution here\n}",
    "functionName": "countSubarrays",
    "testCases": [
      {
        "id": "tc_246_1",
        "input": "[[1, 2, 3, 1, 2, 4], [1, 2]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc_246_2",
        "input": "[[1, 2, 3], [4]]",
        "expectedOutput": "0",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_246_3",
        "input": "[[], [1]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "solution": "function countSubarrays(arr, sub) {\n  if (!sub || sub.length === 0) return 0;\n  let count = 0;\n  let i = 0;\n  while (i <= arr.length - sub.length) {\n    let match = true;\n    for (let j = 0; j < sub.length; j++) {\n      if (arr[i + j] !== sub[j]) {\n        match = false;\n        break;\n      }\n    }\n    if (match) {\n      count++;\n      i += sub.length;\n    } else {\n      i++;\n    }\n  }\n  return count;\n}",
    "explanation": "Slide window of length sub.length and step by sub.length on match.",
    "timeComplexity": "O(n * m)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Check element-by-element match and advance by sub.length on success."
    ]
  },
  {
    "id": "JS-P247",
    "number": 247,
    "title": "Array Difference with Custom Comparator",
    "slug": "js-p247-array-difference-with-custom-comparator",
    "category": "Array Method Implementation",
    "subcategory": "Comparator",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Arrays",
      "differenceWith"
    ],
    "tags": [
      "arrays",
      "difference",
      "comparator"
    ],
    "expectedTime": "10 mins",
    "summary": "Exclude elements from arr1 that match any element in arr2 based on comparator.",
    "problemStatement": "Write a function `differenceWith(arr1, arr2, comparator)` that returns elements from `arr1` that do not match any item in `arr2` according to `comparator(a, b)`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[{ x: 1 }, { x: 2 }], [{ x: 1 }], (a, b) => a.x === b.x]",
        "output": "[{ x: 2 }]",
        "explanation": "Matches on .x property."
      }
    ],
    "constraints": [
      "Array of objects/values."
    ],
    "starterCode": "function differenceWith(arr1, arr2, comparator) {\n  // Write your solution here\n}",
    "functionName": "differenceWith",
    "testCases": [
      {
        "id": "tc_247_1",
        "input": "[[{ x: 1 }, { x: 2 }], [{ x: 1 }], (a, b) => a.x === b.x]",
        "expectedOutput": "[{ x: 2 }]",
        "isHidden": false
      },
      {
        "id": "tc_247_2",
        "input": "[[1, 2], [1, 2], (a, b) => a === b]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_247_3",
        "input": "[[], [1], (a, b) => a === b]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "solution": "function differenceWith(arr1, arr2, comparator) {\n  return arr1.filter(a => !arr2.some(b => comparator(a, b)));\n}",
    "explanation": "Filter elements from arr1 where no element in arr2 satisfies comparator.",
    "timeComplexity": "O(n * m)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Filter arr1 with !arr2.some(b => comparator(a, b))."
    ]
  },
  {
    "id": "JS-P248",
    "number": 248,
    "title": "Array Intersection with Custom Comparator",
    "slug": "js-p248-array-intersection-with-custom-comparator",
    "category": "Array Method Implementation",
    "subcategory": "Comparator",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Arrays",
      "intersectionWith"
    ],
    "tags": [
      "arrays",
      "intersection",
      "comparator"
    ],
    "expectedTime": "10 mins",
    "summary": "Return unique elements in arr1 that match an element in arr2 by comparator.",
    "problemStatement": "Write a function `intersectionWith(arr1, arr2, comparator)` that returns elements from `arr1` that match an element in `arr2` according to `comparator(a, b)`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[{ x: 1 }, { x: 2 }], [{ x: 2 }], (a, b) => a.x === b.x]",
        "output": "[{ x: 2 }]",
        "explanation": "Matches on .x."
      }
    ],
    "constraints": [
      "Array of values."
    ],
    "starterCode": "function intersectionWith(arr1, arr2, comparator) {\n  // Write your solution here\n}",
    "functionName": "intersectionWith",
    "testCases": [
      {
        "id": "tc_248_1",
        "input": "[[{ x: 1 }, { x: 2 }], [{ x: 2 }], (a, b) => a.x === b.x]",
        "expectedOutput": "[{ x: 2 }]",
        "isHidden": false
      },
      {
        "id": "tc_248_2",
        "input": "[[1, 2], [3], (a, b) => a === b]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_248_3",
        "input": "[[], [], (a, b) => a === b]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "solution": "function intersectionWith(arr1, arr2, comparator) {\n  return arr1.filter(a => arr2.some(b => comparator(a, b)));\n}",
    "explanation": "Filter elements where some element in arr2 satisfies comparator.",
    "timeComplexity": "O(n * m)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Filter arr1 with arr2.some(b => comparator(a, b))."
    ]
  },
  {
    "id": "JS-P249",
    "number": 249,
    "title": "Array Union with Custom Comparator",
    "slug": "js-p249-array-union-with-custom-comparator",
    "category": "Array Method Implementation",
    "subcategory": "Comparator",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Arrays",
      "unionWith"
    ],
    "tags": [
      "arrays",
      "union",
      "comparator"
    ],
    "expectedTime": "10 mins",
    "summary": "Combine two arrays deduplicating elements according to a comparator function.",
    "problemStatement": "Write a function `unionWith(arr1, arr2, comparator)` that returns all elements from `arr1` followed by non-duplicate elements from `arr2` based on `comparator(a, b)`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[{ x: 1 }], [{ x: 1 }, { x: 2 }], (a, b) => a.x === b.x]",
        "output": "[{ x: 1 }, { x: 2 }]",
        "explanation": "Deduplicated union."
      }
    ],
    "constraints": [
      "Array of values."
    ],
    "starterCode": "function unionWith(arr1, arr2, comparator) {\n  // Write your solution here\n}",
    "functionName": "unionWith",
    "testCases": [
      {
        "id": "tc_249_1",
        "input": "[[{ x: 1 }], [{ x: 1 }, { x: 2 }], (a, b) => a.x === b.x]",
        "expectedOutput": "[{ x: 1 }, { x: 2 }]",
        "isHidden": false
      },
      {
        "id": "tc_249_2",
        "input": "[[1], [2], (a, b) => a === b]",
        "expectedOutput": "[1, 2]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_249_3",
        "input": "[[], [], (a, b) => a === b]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "solution": "function unionWith(arr1, arr2, comparator) {\n  const res = [];\n  for (const item of [...arr1, ...arr2]) {\n    if (!res.some(existing => comparator(existing, item))) {\n      res.push(item);\n    }\n  }\n  return res;\n}",
    "explanation": "Iterate combined items and only append if no existing item matches comparator.",
    "timeComplexity": "O(n^2)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Check !res.some(existing => comparator(existing, item)) before pushing."
    ]
  },
  {
    "id": "JS-P250",
    "number": 250,
    "title": "Deduplicate Array by Selector Function (uniqBy)",
    "slug": "js-p250-deduplicate-array-by-selector-function-uniqby",
    "category": "Array Method Implementation",
    "subcategory": "Deduplication",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Arrays",
      "uniqBy"
    ],
    "tags": [
      "arrays",
      "uniqBy",
      "set"
    ],
    "expectedTime": "5 mins",
    "summary": "Deduplicate an array based on the value returned by a selector function.",
    "problemStatement": "Write a function `uniqBy(arr, selector)` that returns an array with only the first occurrence of each element based on `selector(item)`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[2.1, 1.2, 2.3], Math.floor]",
        "output": "[2.1, 1.2]",
        "explanation": "2.1 and 2.3 both have floor 2, keeps 2.1."
      }
    ],
    "constraints": [
      "Array of items."
    ],
    "starterCode": "function uniqBy(arr, selector) {\n  // Write your solution here\n}",
    "functionName": "uniqBy",
    "testCases": [
      {
        "id": "tc_250_1",
        "input": "[[2.1, 1.2, 2.3], Math.floor]",
        "expectedOutput": "[2.1, 1.2]",
        "isHidden": false
      },
      {
        "id": "tc_250_2",
        "input": "[[{ id: 1 }, { id: 2 }, { id: 1 }], x => x.id]",
        "expectedOutput": "[{ id: 1 }, { id: 2 }]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_250_3",
        "input": "[[], x => x]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "solution": "function uniqBy(arr, selector) {\n  const seen = new Set();\n  const res = [];\n  for (const item of arr) {\n    const key = selector(item);\n    if (!seen.has(key)) {\n      seen.add(key);\n      res.push(item);\n    }\n  }\n  return res;\n}",
    "explanation": "Store selected key in a Set and keep first encountering item.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use a Set to track seen keys produced by selector(item)."
    ]
  }
];
