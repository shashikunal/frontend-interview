// scripts/buildBatch02.ts
import * as fs from 'fs';
import * as path from 'path';
import type { CoreProgrammingQuestion } from '../src/components/coreprogramming/data/coreProgrammingTypes';
import { testBatch } from './verifyCoreBatch';

const b02: CoreProgrammingQuestion[] = [
  {
    id: "JS-P051",
    number: 51,
    title: "Chunk an Array into Subarrays of Size K",
    slug: "js-p051-chunk-an-array-into-subarrays-of-size-k",
    category: "Arrays",
    subcategory: "Array Transformations",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Slicing"],
    tags: ["arrays", "chunk", "transformation"],
    expectedTime: "10 mins",
    summary: "Split an array into smaller chunks of specified size.",
    problemStatement: "Write a function `chunkArray(arr, size)` that splits `arr` into chunks where each chunk has at most `size` elements.\n\nThe final chunk may contain fewer elements if `arr.length` is not evenly divisible by `size`.\nIf `arr` is empty or `size <= 0`, return `[]`.",
    examples: [
      { title: "Example 1", input: "[[1, 2, 3, 4, 5], 2]", output: "[[1, 2], [3, 4], [5]]", explanation: "Chunks of size 2, with the remaining element in the last chunk." },
      { title: "Example 2", input: "[[1, 2, 3], 1]", output: "[[1], [2], [3]]", explanation: "Each chunk has size 1." }
    ],
    constraints: ["0 <= arr.length <= 10^5", "size >= 1"],
    starterCode: "function chunkArray(arr, size) {\n  // Write your solution here\n}",
    functionName: "chunkArray",
    testCases: [
      { id: "tc_51_1", input: "[[1, 2, 3, 4, 5], 2]", expectedOutput: "[[1, 2], [3, 4], [5]]", isHidden: false },
      { id: "tc_51_2", input: "[[1, 2, 3], 1]", expectedOutput: "[[1], [2], [3]]", isHidden: false },
      { id: "tc_51_3", input: "[[], 3]", expectedOutput: "[]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_51_4", input: "[[1, 2], 5]", expectedOutput: "[[1, 2]]", isHidden: true },
      { id: "tc_51_5", input: "[[1, 2, 3, 4], 2]", expectedOutput: "[[1, 2], [3, 4]]", isHidden: true }
    ],
    solution: "function chunkArray(arr, size) {\n  if (!arr || size <= 0) return [];\n  const res = [];\n  for (let i = 0; i < arr.length; i += size) {\n    res.push(arr.slice(i, i + size));\n  }\n  return res;\n}",
    explanation: "Iterate with step size, slicing subarrays of length size.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use a for loop incrementing i by size and push arr.slice(i, i + size)."]
  },
  {
    id: "JS-P052",
    number: 52,
    title: "Remove Duplicates from an Array",
    slug: "js-p052-remove-duplicates-from-an-array",
    category: "Arrays",
    subcategory: "Array Basics",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Set"],
    tags: ["arrays", "duplicates", "set"],
    expectedTime: "5 mins",
    summary: "Return a new array containing unique elements in their original first-occurrence order.",
    problemStatement: "Write a function `removeDuplicates(arr)` that returns a new array with all duplicate values removed, preserving original order.",
    examples: [
      { title: "Example 1", input: "[[1, 2, 2, 3, 4, 4, 5]]", output: "[1, 2, 3, 4, 5]", explanation: "Duplicates 2 and 4 removed." },
      { title: "Example 2", input: "[['a', 'b', 'a', 'c']]", output: "['a', 'b', 'c']", explanation: "Duplicate 'a' removed." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function removeDuplicates(arr) {\n  // Write your solution here\n}",
    functionName: "removeDuplicates",
    testCases: [
      { id: "tc_52_1", input: "[[1, 2, 2, 3, 4, 4, 5]]", expectedOutput: "[1, 2, 3, 4, 5]", isHidden: false },
      { id: "tc_52_2", input: "[['a', 'b', 'a', 'c']]", expectedOutput: "['a', 'b', 'c']", isHidden: false },
      { id: "tc_52_3", input: "[[]]", expectedOutput: "[]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_52_4", input: "[[1, 1, 1, 1]]", expectedOutput: "[1]", isHidden: true },
      { id: "tc_52_5", input: "[[5, 4, 3, 2, 1]]", expectedOutput: "[5, 4, 3, 2, 1]", isHidden: true }
    ],
    solution: "function removeDuplicates(arr) {\n  return Array.from(new Set(arr));\n}",
    explanation: "A Set preserves insertion order while guaranteeing element uniqueness in O(n) time.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use Array.from(new Set(arr))."]
  },
  {
    id: "JS-P053",
    number: 53,
    title: "Find Second Largest Number in an Array",
    slug: "js-p053-find-second-largest-number-in-an-array",
    category: "Arrays",
    subcategory: "Array Basics",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Iteration"],
    tags: ["arrays", "comparison", "two-pass"],
    expectedTime: "5 mins",
    summary: "Return the second distinct greatest number in an array.",
    problemStatement: "Write a function `secondLargest(arr)` that returns the second largest distinct number in array `arr`.\n\nIf the array contains fewer than 2 distinct numbers, return `null`.",
    examples: [
      { title: "Example 1", input: "[[10, 5, 20, 20, 8]]", output: "10", explanation: "Largest is 20, second largest distinct is 10." },
      { title: "Example 2", input: "[[5, 5, 5]]", output: "null", explanation: "No second distinct value exists." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function secondLargest(arr) {\n  // Write your solution here\n}",
    functionName: "secondLargest",
    testCases: [
      { id: "tc_53_1", input: "[[10, 5, 20, 20, 8]]", expectedOutput: "10", isHidden: false },
      { id: "tc_53_2", input: "[[5, 5, 5]]", expectedOutput: "null", isHidden: false },
      { id: "tc_53_3", input: "[[1, 2]]", expectedOutput: "1", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_53_4", input: "[[]]", expectedOutput: "null", isHidden: true },
      { id: "tc_53_5", input: "[[-10, -5, -2, -1]]", expectedOutput: "-2", isHidden: true }
    ],
    solution: "function secondLargest(arr) {\n  let first = -Infinity;\n  let second = -Infinity;\n  for (const n of arr) {\n    if (n > first) {\n      second = first;\n      first = n;\n    } else if (n > second && n < first) {\n      second = n;\n    }\n  }\n  return second === -Infinity ? null : second;\n}",
    explanation: "Track largest and second largest in a single pass in O(n) time and O(1) space.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Maintain two variables first and second initialized to -Infinity."]
  },
  {
    id: "JS-P054",
    number: 54,
    title: "Find Second Smallest Number in an Array",
    slug: "js-p054-find-second-smallest-number-in-an-array",
    category: "Arrays",
    subcategory: "Array Basics",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Iteration"],
    tags: ["arrays", "comparison"],
    expectedTime: "5 mins",
    summary: "Return the second distinct smallest number in an array.",
    problemStatement: "Write a function `secondSmallest(arr)` that returns the second smallest distinct number in `arr`.\n\nIf fewer than 2 distinct numbers exist, return `null`.",
    examples: [
      { title: "Example 1", input: "[[12, 3, 1, 5, 1]]", output: "3", explanation: "Smallest is 1, second smallest is 3." },
      { title: "Example 2", input: "[[4, 4]]", output: "null", explanation: "Only one distinct value." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function secondSmallest(arr) {\n  // Write your solution here\n}",
    functionName: "secondSmallest",
    testCases: [
      { id: "tc_54_1", input: "[[12, 3, 1, 5, 1]]", expectedOutput: "3", isHidden: false },
      { id: "tc_54_2", input: "[[4, 4]]", expectedOutput: "null", isHidden: false },
      { id: "tc_54_3", input: "[[10, 20, 30]]", expectedOutput: "20", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_54_4", input: "[[]]", expectedOutput: "null", isHidden: true },
      { id: "tc_54_5", input: "[[-5, -1, -10]]", expectedOutput: "-5", isHidden: true }
    ],
    solution: "function secondSmallest(arr) {\n  let first = Infinity;\n  let second = Infinity;\n  for (const n of arr) {\n    if (n < first) {\n      second = first;\n      first = n;\n    } else if (n < second && n > first) {\n      second = n;\n    }\n  }\n  return second === Infinity ? null : second;\n}",
    explanation: "Track first and second smallest in single pass.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Track first and second initialized to Infinity."]
  },
  {
    id: "JS-P055",
    number: 55,
    title: "Move All Zeros to the End of Array",
    slug: "js-p055-move-all-zeros-to-the-end-of-array",
    category: "Arrays",
    subcategory: "Two Pointers",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Two Pointers"],
    tags: ["arrays", "two-pointers", "in-place"],
    expectedTime: "5 mins",
    summary: "Move all zero values to the end of the array while maintaining the relative order of non-zero elements.",
    problemStatement: "Write a function `moveZeros(arr)` that returns a new array with all zeros moved to the end, while preserving the relative order of non-zero elements.",
    examples: [
      { title: "Example 1", input: "[[0, 1, 0, 3, 12]]", output: "[1, 3, 12, 0, 0]", explanation: "1, 3, 12 keep order, 0s move to back." },
      { title: "Example 2", input: "[[0, 0]]", output: "[0, 0]", explanation: "All zeros." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function moveZeros(arr) {\n  // Write your solution here\n}",
    functionName: "moveZeros",
    testCases: [
      { id: "tc_55_1", input: "[[0, 1, 0, 3, 12]]", expectedOutput: "[1, 3, 12, 0, 0]", isHidden: false },
      { id: "tc_55_2", input: "[[0, 0]]", expectedOutput: "[0, 0]", isHidden: false },
      { id: "tc_55_3", input: "[[1, 2, 3]]", expectedOutput: "[1, 2, 3]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_55_4", input: "[[]]", expectedOutput: "[]", isHidden: true },
      { id: "tc_55_5", input: "[[0, 5, 0, 0, 2]]", expectedOutput: "[5, 2, 0, 0, 0]", isHidden: true }
    ],
    solution: "function moveZeros(arr) {\n  const nonZeros = arr.filter(x => x !== 0);\n  const zerosCount = arr.length - nonZeros.length;\n  return nonZeros.concat(new Array(zerosCount).fill(0));\n}",
    explanation: "Filter out non-zeros and append zeros for remaining count.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Filter non-zero elements and append an array of zeros of the remaining length."]
  },
  {
    id: "JS-P056",
    number: 56,
    title: "Rotate Array to the Right by K Steps",
    slug: "js-p056-rotate-array-to-the-right-by-k-steps",
    category: "Arrays",
    subcategory: "Array Transformations",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Modulo"],
    tags: ["arrays", "rotation", "slicing"],
    expectedTime: "5 mins",
    summary: "Rotate the array elements to the right by k positions.",
    problemStatement: "Write a function `rotateArray(arr, k)` that returns a new array rotated to the right by `k` steps.\n\nFor example, with `[1, 2, 3, 4, 5]` and `k = 2`, the result is `[4, 5, 1, 2, 3]`.",
    examples: [
      { title: "Example 1", input: "[[1, 2, 3, 4, 5], 2]", output: "[4, 5, 1, 2, 3]", explanation: "Elements rotated right 2 positions." },
      { title: "Example 2", input: "[[1, 2], 3]", output: "[2, 1]", explanation: "3 % 2 = 1 position rotation." }
    ],
    constraints: ["0 <= arr.length <= 10^5", "k >= 0"],
    starterCode: "function rotateArray(arr, k) {\n  // Write your solution here\n}",
    functionName: "rotateArray",
    testCases: [
      { id: "tc_56_1", input: "[[1, 2, 3, 4, 5], 2]", expectedOutput: "[4, 5, 1, 2, 3]", isHidden: false },
      { id: "tc_56_2", input: "[[1, 2], 3]", expectedOutput: "[2, 1]", isHidden: false },
      { id: "tc_56_3", input: "[[], 5]", expectedOutput: "[]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_56_4", input: "[[1, 2, 3], 0]", expectedOutput: "[1, 2, 3]", isHidden: true },
      { id: "tc_56_5", input: "[[10, 20, 30, 40], 4]", expectedOutput: "[10, 20, 30, 40]", isHidden: true }
    ],
    solution: "function rotateArray(arr, k) {\n  if (!arr || arr.length === 0) return [];\n  const shift = k % arr.length;\n  if (shift === 0) return [...arr];\n  return arr.slice(-shift).concat(arr.slice(0, arr.length - shift));\n}",
    explanation: "Compute shift = k % n, then concatenate the last shift elements with the first n - shift elements.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use k % arr.length, then slice the last k elements and prefix them."]
  },
  {
    id: "JS-P057",
    number: 57,
    title: "Find the Intersection of Two Arrays",
    slug: "js-p057-find-the-intersection-of-two-arrays",
    category: "Arrays",
    subcategory: "Set Operations",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Set"],
    tags: ["arrays", "intersection", "set"],
    expectedTime: "5 mins",
    summary: "Return unique elements present in both input arrays.",
    problemStatement: "Write a function `arrayIntersection(arr1, arr2)` that returns a new array with elements common to both `arr1` and `arr2` without duplicates.",
    examples: [
      { title: "Example 1", input: "[[1, 2, 2, 1], [2, 2]]", output: "[2]", explanation: "2 is in both." },
      { title: "Example 2", input: "[[4, 9, 5], [9, 4, 9, 8, 4]]", output: "[4, 9]", explanation: "Both 4 and 9 are common." }
    ],
    constraints: ["0 <= arr1.length, arr2.length <= 10^5"],
    starterCode: "function arrayIntersection(arr1, arr2) {\n  // Write your solution here\n}",
    functionName: "arrayIntersection",
    testCases: [
      { id: "tc_57_1", input: "[[1, 2, 2, 1], [2, 2]]", expectedOutput: "[2]", isHidden: false },
      { id: "tc_57_2", input: "[[4, 9, 5], [9, 4, 9, 8, 4]]", expectedOutput: "[4, 9]", isHidden: false },
      { id: "tc_57_3", input: "[[1, 2, 3], [4, 5, 6]]", expectedOutput: "[]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_57_4", input: "[[], [1, 2]]", expectedOutput: "[]", isHidden: true },
      { id: "tc_57_5", input: "[[1, 1], [1, 1]]", expectedOutput: "[1]", isHidden: true }
    ],
    solution: "function arrayIntersection(arr1, arr2) {\n  const s2 = new Set(arr2);\n  const res = new Set();\n  for (const item of arr1) {\n    if (s2.has(item)) res.add(item);\n  }\n  return Array.from(res);\n}",
    explanation: "Store arr2 in a Set for O(1) lookups, filtering elements from arr1.",
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(n + m)",
    hints: ["Use a Set for the second array and filter distinct elements from the first array."]
  },
  {
    id: "JS-P058",
    number: 58,
    title: "Find the Union of Two Arrays",
    slug: "js-p058-find-the-union-of-two-arrays",
    category: "Arrays",
    subcategory: "Set Operations",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Set"],
    tags: ["arrays", "union", "set"],
    expectedTime: "5 mins",
    summary: "Return all unique elements occurring in either of two arrays.",
    problemStatement: "Write a function `arrayUnion(arr1, arr2)` that returns a new array with all distinct elements from both arrays.",
    examples: [
      { title: "Example 1", input: "[[1, 2, 3], [2, 3, 4]]", output: "[1, 2, 3, 4]", explanation: "Combined unique elements." },
      { title: "Example 2", input: "[[1, 1], [2, 2]]", output: "[1, 2]", explanation: "Uniques are 1 and 2." }
    ],
    constraints: ["0 <= arr1.length, arr2.length <= 10^5"],
    starterCode: "function arrayUnion(arr1, arr2) {\n  // Write your solution here\n}",
    functionName: "arrayUnion",
    testCases: [
      { id: "tc_58_1", input: "[[1, 2, 3], [2, 3, 4]]", expectedOutput: "[1, 2, 3, 4]", isHidden: false },
      { id: "tc_58_2", input: "[[1, 1], [2, 2]]", expectedOutput: "[1, 2]", isHidden: false },
      { id: "tc_58_3", input: "[[], [5]]", expectedOutput: "[5]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_58_4", input: "[[], []]", expectedOutput: "[]", isHidden: true },
      { id: "tc_58_5", input: "[[10, 20], [30, 40]]", expectedOutput: "[10, 20, 30, 40]", isHidden: true }
    ],
    solution: "function arrayUnion(arr1, arr2) {\n  return Array.from(new Set([...arr1, ...arr2]));\n}",
    explanation: "Spread both arrays into a Set to collect unique values.",
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(n + m)",
    hints: ["Use Array.from(new Set([...arr1, ...arr2]))."]
  },
  {
    id: "JS-P059",
    number: 59,
    title: "Find the Difference Between Two Arrays",
    slug: "js-p059-find-the-difference-between-two-arrays",
    category: "Arrays",
    subcategory: "Set Operations",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Set"],
    tags: ["arrays", "difference", "set"],
    expectedTime: "5 mins",
    summary: "Return unique elements present in the first array but not in the second.",
    problemStatement: "Write a function `arrayDifference(arr1, arr2)` that returns an array of unique elements that appear in `arr1` but not in `arr2`.",
    examples: [
      { title: "Example 1", input: "[[1, 2, 3, 4], [2, 4]]", output: "[1, 3]", explanation: "1 and 3 are only in arr1." },
      { title: "Example 2", input: "[[1, 2], [1, 2]]", output: "[]", explanation: "All elements exist in arr2." }
    ],
    constraints: ["0 <= arr1.length, arr2.length <= 10^5"],
    starterCode: "function arrayDifference(arr1, arr2) {\n  // Write your solution here\n}",
    functionName: "arrayDifference",
    testCases: [
      { id: "tc_59_1", input: "[[1, 2, 3, 4], [2, 4]]", expectedOutput: "[1, 3]", isHidden: false },
      { id: "tc_59_2", input: "[[1, 2], [1, 2]]", expectedOutput: "[]", isHidden: false },
      { id: "tc_59_3", input: "[[5, 6, 7], []]", expectedOutput: "[5, 6, 7]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_59_4", input: "[[], [1, 2]]", expectedOutput: "[]", isHidden: true },
      { id: "tc_59_5", input: "[[1, 1, 2, 2], [3]]", expectedOutput: "[1, 2]", isHidden: true }
    ],
    solution: "function arrayDifference(arr1, arr2) {\n  const s2 = new Set(arr2);\n  const res = new Set();\n  for (const x of arr1) {\n    if (!s2.has(x)) res.add(x);\n  }\n  return Array.from(res);\n}",
    explanation: "Filter items of arr1 that are not in a Set of arr2.",
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(n + m)",
    hints: ["Check if !new Set(arr2).has(x)."]
  },
  {
    id: "JS-P060",
    number: 60,
    title: "Find Symmetric Difference of Two Arrays",
    slug: "js-p060-find-symmetric-difference-of-two-arrays",
    category: "Arrays",
    subcategory: "Set Operations",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Set"],
    tags: ["arrays", "symmetric-difference", "set"],
    expectedTime: "5 mins",
    summary: "Return unique elements present in either array, but not in both.",
    problemStatement: "Write a function `symmetricDifference(arr1, arr2)` that returns an array of unique values that belong to either `arr1` or `arr2`, but not both.",
    examples: [
      { title: "Example 1", input: "[[1, 2, 3], [3, 4, 5]]", output: "[1, 2, 4, 5]", explanation: "3 is common and excluded." },
      { title: "Example 2", input: "[[1, 2], [1, 2]]", output: "[]", explanation: "All elements shared." }
    ],
    constraints: ["0 <= arr1.length, arr2.length <= 10^5"],
    starterCode: "function symmetricDifference(arr1, arr2) {\n  // Write your solution here\n}",
    functionName: "symmetricDifference",
    testCases: [
      { id: "tc_60_1", input: "[[1, 2, 3], [3, 4, 5]]", expectedOutput: "[1, 2, 4, 5]", isHidden: false },
      { id: "tc_60_2", input: "[[1, 2], [1, 2]]", expectedOutput: "[]", isHidden: false },
      { id: "tc_60_3", input: "[[], [1, 2]]", expectedOutput: "[1, 2]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_60_4", input: "[[1, 1, 2], [2, 3, 3]]", expectedOutput: "[1, 3]", isHidden: true },
      { id: "tc_60_5", input: "[[], []]", expectedOutput: "[]", isHidden: true }
    ],
    solution: "function symmetricDifference(arr1, arr2) {\n  const s1 = new Set(arr1);\n  const s2 = new Set(arr2);\n  const res = [];\n  for (const x of s1) if (!s2.has(x)) res.push(x);\n  for (const x of s2) if (!s1.has(x)) res.push(x);\n  return res;\n}",
    explanation: "Collect distinct elements in s1 not in s2, and in s2 not in s1.",
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(n + m)",
    hints: ["Find elements in s1 not in s2, plus elements in s2 not in s1."]
  },
  {
    id: "JS-P061",
    number: 61,
    title: "Partition Array into Even and Odd Numbers",
    slug: "js-p061-partition-array-into-even-and-odd-numbers",
    category: "Arrays",
    subcategory: "Array Transformations",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Partition"],
    tags: ["arrays", "partition", "modulo"],
    expectedTime: "5 mins",
    summary: "Return an object `{ evens: [...], odds: [...] }` grouping numbers by parity.",
    problemStatement: "Write a function `partitionEvenOdd(arr)` that separates numbers into `{ evens: number[], odds: number[] }`, preserving original order.",
    examples: [
      { title: "Example 1", input: "[[1, 2, 3, 4, 5, 6]]", output: "{ evens: [2, 4, 6], odds: [1, 3, 5] }", explanation: "Evens and odds partitioned." },
      { title: "Example 2", input: "[[2, 4]]", output: "{ evens: [2, 4], odds: [] }", explanation: "All even." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function partitionEvenOdd(arr) {\n  // Write your solution here\n}",
    functionName: "partitionEvenOdd",
    testCases: [
      { id: "tc_61_1", input: "[[1, 2, 3, 4, 5, 6]]", expectedOutput: "{ evens: [2, 4, 6], odds: [1, 3, 5] }", isHidden: false },
      { id: "tc_61_2", input: "[[2, 4]]", expectedOutput: "{ evens: [2, 4], odds: [] }", isHidden: false },
      { id: "tc_61_3", input: "[[]]", expectedOutput: "{ evens: [], odds: [] }", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_61_4", input: "[[1, 3, 5]]", expectedOutput: "{ evens: [], odds: [1, 3, 5] }", isHidden: true },
      { id: "tc_61_5", input: "[[-2, -1, 0]]", expectedOutput: "{ evens: [-2, 0], odds: [-1] }", isHidden: true }
    ],
    solution: "function partitionEvenOdd(arr) {\n  const evens = [];\n  const odds = [];\n  for (const n of arr) {\n    if (n % 2 === 0) evens.push(n);\n    else odds.push(n);\n  }\n  return { evens, odds };\n}",
    explanation: "Iterate once and push each number to evens or odds based on modulo 2.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Iterate through the array checking n % 2 === 0."]
  },
  {
    id: "JS-P062",
    number: 62,
    title: "Find the Missing Number in 1 to N",
    slug: "js-p062-find-the-missing-number-in-1-to-n",
    category: "Arrays",
    subcategory: "Array Math",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Math"],
    tags: ["arrays", "missing-number", "math"],
    expectedTime: "5 mins",
    summary: "Find the single integer missing from an array containing numbers from 1 to N.",
    problemStatement: "Write a function `findMissingNumber(arr, n)` where `arr` contains distinct integers in the range `1` to `n` with exactly one number missing. Return the missing integer.",
    examples: [
      { title: "Example 1", input: "[[1, 2, 4, 5], 5]", output: "3", explanation: "3 is missing from 1..5." },
      { title: "Example 2", input: "[[2, 3, 4], 4]", output: "1", explanation: "1 is missing." }
    ],
    constraints: ["1 <= n <= 10^5", "arr.length === n - 1"],
    starterCode: "function findMissingNumber(arr, n) {\n  // Write your solution here\n}",
    functionName: "findMissingNumber",
    testCases: [
      { id: "tc_62_1", input: "[[1, 2, 4, 5], 5]", expectedOutput: "3", isHidden: false },
      { id: "tc_62_2", input: "[[2, 3, 4], 4]", expectedOutput: "1", isHidden: false },
      { id: "tc_62_3", input: "[[1], 2]", expectedOutput: "2", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_62_4", input: "[[1, 2, 3, 4, 5, 6, 7, 8, 10], 10]", expectedOutput: "9", isHidden: true },
      { id: "tc_62_5", input: "[[], 1]", expectedOutput: "1", isHidden: true }
    ],
    solution: "function findMissingNumber(arr, n) {\n  const expectedSum = (n * (n + 1)) / 2;\n  const actualSum = arr.reduce((s, x) => s + x, 0);\n  return expectedSum - actualSum;\n}",
    explanation: "Sum of 1 to n is n*(n+1)/2. Subtract actual sum to get missing number in O(n) time and O(1) space.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Use Gauss sum formula: (n * (n + 1)) / 2 minus the array sum."]
  },
  {
    id: "JS-P063",
    number: 63,
    title: "Find Single Duplicate in Array",
    slug: "js-p063-find-single-duplicate-in-array",
    category: "Arrays",
    subcategory: "Searching",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Set"],
    tags: ["arrays", "duplicate", "set"],
    expectedTime: "5 mins",
    summary: "Find the first element that appears more than once.",
    problemStatement: "Write a function `findDuplicate(arr)` that returns the first element that occurs more than once in `arr`. If no duplicate exists, return `null`.",
    examples: [
      { title: "Example 1", input: "[[1, 3, 4, 2, 2]]", output: "2", explanation: "2 is duplicated." },
      { title: "Example 2", input: "[[1, 2, 3]]", output: "null", explanation: "All distinct." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function findDuplicate(arr) {\n  // Write your solution here\n}",
    functionName: "findDuplicate",
    testCases: [
      { id: "tc_63_1", input: "[[1, 3, 4, 2, 2]]", expectedOutput: "2", isHidden: false },
      { id: "tc_63_2", input: "[[1, 2, 3]]", expectedOutput: "null", isHidden: false },
      { id: "tc_63_3", input: "[['a', 'b', 'c', 'a']]", expectedOutput: "'a'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_63_4", input: "[[]]", expectedOutput: "null", isHidden: true },
      { id: "tc_63_5", input: "[[10, 20, 10, 30]]", expectedOutput: "10", isHidden: true }
    ],
    solution: "function findDuplicate(arr) {\n  const seen = new Set();\n  for (const x of arr) {\n    if (seen.has(x)) return x;\n    seen.add(x);\n  }\n  return null;\n}",
    explanation: "Check membership in a seen Set while iterating.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use a Set to keep track of seen elements."]
  },
  {
    id: "JS-P064",
    number: 64,
    title: "Maximum Subarray Sum (Kadane's Algorithm)",
    slug: "js-p064-maximum-subarray-sum-kadanes-algorithm",
    category: "Arrays",
    subcategory: "Dynamic Programming",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Arrays", "Kadane's Algorithm"],
    tags: ["arrays", "kadane", "dp"],
    expectedTime: "10 mins",
    summary: "Find the maximum possible sum of a contiguous non-empty subarray.",
    problemStatement: "Write a function `maxSubarraySum(arr)` that finds the contiguous subarray with the largest sum and returns its sum.",
    examples: [
      { title: "Example 1", input: "[[-2, 1, -3, 4, -1, 2, 1, -5, 4]]", output: "6", explanation: "Subarray [4, -1, 2, 1] has largest sum 6." },
      { title: "Example 2", input: "[[1]]", output: "1", explanation: "Single element." },
      { title: "Example 3", input: "[[5, 4, -1, 7, 8]]", output: "23", explanation: "Entire array sum is 23." }
    ],
    constraints: ["1 <= arr.length <= 10^5"],
    starterCode: "function maxSubarraySum(arr) {\n  // Write your solution here\n}",
    functionName: "maxSubarraySum",
    testCases: [
      { id: "tc_64_1", input: "[[-2, 1, -3, 4, -1, 2, 1, -5, 4]]", expectedOutput: "6", isHidden: false },
      { id: "tc_64_2", input: "[[1]]", expectedOutput: "1", isHidden: false },
      { id: "tc_64_3", input: "[[5, 4, -1, 7, 8]]", expectedOutput: "23", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_64_4", input: "[[-5, -2, -8]]", expectedOutput: "-2", isHidden: true },
      { id: "tc_64_5", input: "[[-1, -2]]", expectedOutput: "-1", isHidden: true }
    ],
    solution: "function maxSubarraySum(arr) {\n  let maxSoFar = arr[0];\n  let currMax = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    currMax = Math.max(arr[i], currMax + arr[i]);\n    maxSoFar = Math.max(maxSoFar, currMax);\n  }\n  return maxSoFar;\n}",
    explanation: "Kadane's algorithm computes the maximum subarray sum ending at each position in O(n) time and O(1) space.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Use Kadane's algorithm: currMax = Math.max(x, currMax + x)."]
  },
  {
    id: "JS-P065",
    number: 65,
    title: "Compute Running Sum of 1D Array",
    slug: "js-p065-compute-running-sum-of-1d-array",
    category: "Arrays",
    subcategory: "Prefix Sums",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Accumulation"],
    tags: ["arrays", "running-sum", "prefix-sum"],
    expectedTime: "5 mins",
    summary: "Return an array where each element i is the sum of elements from index 0 to i.",
    problemStatement: "Write a function `runningSum(arr)` that returns the running sum array where `res[i] = sum(arr[0]..arr[i])`.",
    examples: [
      { title: "Example 1", input: "[[1, 2, 3, 4]]", output: "[1, 3, 6, 10]", explanation: "[1, 1+2, 1+2+3, 1+2+3+4]." },
      { title: "Example 2", input: "[[1, 1, 1, 1]]", output: "[1, 2, 3, 4]", explanation: "Running count." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function runningSum(arr) {\n  // Write your solution here\n}",
    functionName: "runningSum",
    testCases: [
      { id: "tc_65_1", input: "[[1, 2, 3, 4]]", expectedOutput: "[1, 3, 6, 10]", isHidden: false },
      { id: "tc_65_2", input: "[[1, 1, 1, 1]]", expectedOutput: "[1, 2, 3, 4]", isHidden: false },
      { id: "tc_65_3", input: "[[]]", expectedOutput: "[]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_65_4", input: "[[3, 1, 2, 10, 1]]", expectedOutput: "[3, 4, 6, 16, 17]", isHidden: true },
      { id: "tc_65_5", input: "[[5]]", expectedOutput: "[5]", isHidden: true }
    ],
    solution: "function runningSum(arr) {\n  let total = 0;\n  return arr.map(x => (total += x));\n}",
    explanation: "Maintain a running total inside map in O(n) time.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use arr.map with a cumulative accumulator variable."]
  },
  {
    id: "JS-P066",
    number: 66,
    title: "Compute Prefix Sum Array",
    slug: "js-p066-compute-prefix-sum-array",
    category: "Arrays",
    subcategory: "Prefix Sums",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Prefix Sum"],
    tags: ["arrays", "prefix-sum", "math"],
    expectedTime: "5 mins",
    summary: "Compute a prefix sum array starting with 0 at index 0.",
    problemStatement: "Write a function `prefixSum(arr)` that returns an array of length `arr.length + 1` starting with `0`, where `prefix[i + 1] = prefix[i] + arr[i]`.",
    examples: [
      { title: "Example 1", input: "[[1, 2, 3]]", output: "[0, 1, 3, 6]", explanation: "Index 0 is 0, then 1, 3, 6." },
      { title: "Example 2", input: "[[]]", output: "[0]", explanation: "Prefix of empty array is [0]." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function prefixSum(arr) {\n  // Write your solution here\n}",
    functionName: "prefixSum",
    testCases: [
      { id: "tc_66_1", input: "[[1, 2, 3]]", expectedOutput: "[0, 1, 3, 6]", isHidden: false },
      { id: "tc_66_2", input: "[[]]", expectedOutput: "[0]", isHidden: false },
      { id: "tc_66_3", input: "[[5]]", expectedOutput: "[0, 5]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_66_4", input: "[[2, 4, 6, 8]]", expectedOutput: "[0, 2, 6, 12, 20]", isHidden: true },
      { id: "tc_66_5", input: "[[-1, 1]]", expectedOutput: "[0, -1, 0]", isHidden: true }
    ],
    solution: "function prefixSum(arr) {\n  const res = [0];\n  for (let i = 0; i < arr.length; i++) {\n    res.push(res[i] + arr[i]);\n  }\n  return res;\n}",
    explanation: "Push res[i] + arr[i] starting with initial [0].",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Start with [0] and iteratively append res[i] + arr[i]."]
  },
  {
    id: "JS-P067",
    number: 67,
    title: "Flatten a 1-Level Deep Nested Array",
    slug: "js-p067-flatten-a-1-level-deep-nested-array",
    category: "Arrays",
    subcategory: "Array Flattening",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Flatten"],
    tags: ["arrays", "flat", "concat"],
    expectedTime: "5 mins",
    summary: "Flatten an array up to a single depth level.",
    problemStatement: "Write a function `flattenOneLevel(arr)` that flattens `arr` by 1 level of nesting.",
    examples: [
      { title: "Example 1", input: "[[[1, 2], [3, 4], [5]]]", output: "[1, 2, 3, 4, 5]", explanation: "1 level flattened." },
      { title: "Example 2", input: "[[1, [2, [3]]]]", output: "[1, 2, [3]]", explanation: "Only depth 1 flattened." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function flattenOneLevel(arr) {\n  // Write your solution here\n}",
    functionName: "flattenOneLevel",
    testCases: [
      { id: "tc_67_1", input: "[[[1, 2], [3, 4], [5]]]", expectedOutput: "[1, 2, 3, 4, 5]", isHidden: false },
      { id: "tc_67_2", input: "[[1, [2, [3]]]]", expectedOutput: "[1, 2, [3]]", isHidden: false },
      { id: "tc_67_3", input: "[[]]", expectedOutput: "[]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_67_4", input: "[[1, 2, 3]]", expectedOutput: "[1, 2, 3]", isHidden: true },
      { id: "tc_67_5", input: "[[[], [1], []]]", expectedOutput: "[1]", isHidden: true }
    ],
    solution: "function flattenOneLevel(arr) {\n  return arr.flat(1);\n}",
    explanation: "Array.prototype.flat(1) flattens 1 level.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use arr.flat(1)."]
  },
  {
    id: "JS-P068",
    number: 68,
    title: "Zip Two Arrays into Pairs",
    slug: "js-p068-zip-two-arrays-into-pairs",
    category: "Arrays",
    subcategory: "Array Transformations",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Zip"],
    tags: ["arrays", "zip", "pairs"],
    expectedTime: "5 mins",
    summary: "Combine two arrays element-wise into pairs up to the shorter array's length.",
    problemStatement: "Write a function `zipArrays(arr1, arr2)` that returns an array of pairs `[arr1[i], arr2[i]]` up to the minimum length of `arr1` and `arr2`.",
    examples: [
      { title: "Example 1", input: "[['a', 'b', 'c'], [1, 2, 3]]", output: "[['a', 1], ['b', 2], ['c', 3]]", explanation: "Paired element by element." },
      { title: "Example 2", input: "[[1, 2], ['x']]", output: "[[1, 'x']]", explanation: "Length bounded by shorter array." }
    ],
    constraints: ["0 <= arr1.length, arr2.length <= 10^5"],
    starterCode: "function zipArrays(arr1, arr2) {\n  // Write your solution here\n}",
    functionName: "zipArrays",
    testCases: [
      { id: "tc_68_1", input: "[['a', 'b', 'c'], [1, 2, 3]]", expectedOutput: "[['a', 1], ['b', 2], ['c', 3]]", isHidden: false },
      { id: "tc_68_2", input: "[[1, 2], ['x']]", expectedOutput: "[[1, 'x']]", isHidden: false },
      { id: "tc_68_3", input: "[[], [1, 2]]", expectedOutput: "[]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_68_4", input: "[[true, false], [0, 1]]", expectedOutput: "[[true, 0], [false, 1]]", isHidden: true },
      { id: "tc_68_5", input: "[[], []]", expectedOutput: "[]", isHidden: true }
    ],
    solution: "function zipArrays(arr1, arr2) {\n  const len = Math.min(arr1.length, arr2.length);\n  const res = [];\n  for (let i = 0; i < len; i++) res.push([arr1[i], arr2[i]]);\n  return res;\n}",
    explanation: "Iterate up to Math.min length and create 2-element tuples.",
    timeComplexity: "O(min(n, m))",
    spaceComplexity: "O(min(n, m))",
    hints: ["Iterate from 0 to Math.min(arr1.length, arr2.length)."]
  },
  {
    id: "JS-P069",
    number: 69,
    title: "Unzip Array of Pairs into Two Arrays",
    slug: "js-p069-unzip-array-of-pairs-into-two-arrays",
    category: "Arrays",
    subcategory: "Array Transformations",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Unzip"],
    tags: ["arrays", "unzip", "pairs"],
    expectedTime: "5 mins",
    summary: "Deconstruct an array of 2-tuples into a tuple of two arrays `[firsts, seconds]`.",
    problemStatement: "Write a function `unzipArrays(pairs)` that takes an array of pairs `[[a0, b0], [a1, b1], ...]` and returns `[[a0, a1, ...], [b0, b1, ...]]`.",
    examples: [
      { title: "Example 1", input: "[[['a', 1], ['b', 2], ['c', 3]]]", output: "[['a', 'b', 'c'], [1, 2, 3]]", explanation: "Deconstructed into two arrays." },
      { title: "Example 2", input: "[[]]", output: "[[], []]", explanation: "Empty input returns two empty arrays." }
    ],
    constraints: ["0 <= pairs.length <= 10^5"],
    starterCode: "function unzipArrays(pairs) {\n  // Write your solution here\n}",
    functionName: "unzipArrays",
    testCases: [
      { id: "tc_69_1", input: "[[['a', 1], ['b', 2], ['c', 3]]]", expectedOutput: "[['a', 'b', 'c'], [1, 2, 3]]", isHidden: false },
      { id: "tc_69_2", input: "[[]]", expectedOutput: "[[], []]", isHidden: false },
      { id: "tc_69_3", input: "[[[10, 20]]]", expectedOutput: "[[10], [20]]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_69_4", input: "[[[true, 1], [false, 0]]]", expectedOutput: "[[true, false], [1, 0]]", isHidden: true }
    ],
    solution: "function unzipArrays(pairs) {\n  const firsts = [];\n  const seconds = [];\n  for (const [a, b] of pairs) {\n    firsts.push(a);\n    seconds.push(b);\n  }\n  return [firsts, seconds];\n}",
    explanation: "Iterate over pairs and push a to firsts and b to seconds.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Iterate through pairs, destructuring [a, b] into separate arrays."]
  },
  {
    id: "JS-P070",
    number: 70,
    title: "Generate Range of Numbers [start, end, step]",
    slug: "js-p070-generate-range-of-numbers-start-end-step",
    category: "Arrays",
    subcategory: "Generators & Utilities",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Range"],
    tags: ["arrays", "range", "generator"],
    expectedTime: "5 mins",
    summary: "Generate an array of numbers from start to end (inclusive) with a given step.",
    problemStatement: "Write a function `generateRange(start, end, step = 1)` that returns an array of numbers starting at `start` and incrementing by `step` while `<= end`. If `start > end`, return `[]`.",
    examples: [
      { title: "Example 1", input: "[1, 5, 1]", output: "[1, 2, 3, 4, 5]", explanation: "Numbers 1 through 5." },
      { title: "Example 2", input: "[0, 10, 2]", output: "[0, 2, 4, 6, 8, 10]", explanation: "Step by 2." }
    ],
    constraints: ["step >= 1"],
    starterCode: "function generateRange(start, end, step = 1) {\n  // Write your solution here\n}",
    functionName: "generateRange",
    testCases: [
      { id: "tc_70_1", input: "[1, 5, 1]", expectedOutput: "[1, 2, 3, 4, 5]", isHidden: false },
      { id: "tc_70_2", input: "[0, 10, 2]", expectedOutput: "[0, 2, 4, 6, 8, 10]", isHidden: false },
      { id: "tc_70_3", input: "[5, 1, 1]", expectedOutput: "[]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_70_4", input: "[3, 3, 1]", expectedOutput: "[3]", isHidden: true },
      { id: "tc_70_5", input: "[1, 9, 3]", expectedOutput: "[1, 4, 7]", isHidden: true }
    ],
    solution: "function generateRange(start, end, step = 1) {\n  const res = [];\n  for (let i = start; i <= end; i += step) res.push(i);\n  return res;\n}",
    explanation: "Iterate from start to end incrementing by step.",
    timeComplexity: "O((end - start)/step)",
    spaceComplexity: "O((end - start)/step)",
    hints: ["Use a for loop: for (let i = start; i <= end; i += step)."]
  },
  {
    id: "JS-P071",
    number: 71,
    title: "Count Frequency of Elements in Array",
    slug: "js-p071-count-frequency-of-elements-in-array",
    category: "Arrays",
    subcategory: "Hash Map",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Hash Map"],
    tags: ["arrays", "frequency", "map"],
    expectedTime: "5 mins",
    summary: "Return an object mapping each element to its count of appearances.",
    problemStatement: "Write a function `countFrequency(arr)` that returns an object where keys are elements (converted to string) and values are their occurrence count.",
    examples: [
      { title: "Example 1", input: "[['apple', 'banana', 'apple', 'orange', 'banana', 'apple']]", output: "{ apple: 3, banana: 2, orange: 1 }", explanation: "Counts for each fruit." },
      { title: "Example 2", input: "[[1, 2, 2, 3]]", output: "{ '1': 1, '2': 2, '3': 1 }", explanation: "Integer keys converted to object property strings." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function countFrequency(arr) {\n  // Write your solution here\n}",
    functionName: "countFrequency",
    testCases: [
      { id: "tc_71_1", input: "[['apple', 'banana', 'apple', 'orange', 'banana', 'apple']]", expectedOutput: "{ apple: 3, banana: 2, orange: 1 }", isHidden: false },
      { id: "tc_71_2", input: "[[1, 2, 2, 3]]", expectedOutput: "{ '1': 1, '2': 2, '3': 1 }", isHidden: false },
      { id: "tc_71_3", input: "[[]]", expectedOutput: "{}", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_71_4", input: "[['x']]", expectedOutput: "{ x: 1 }", isHidden: true },
      { id: "tc_71_5", input: "[[true, true, false]]", expectedOutput: "{ true: 2, false: 1 }", isHidden: true }
    ],
    solution: "function countFrequency(arr) {\n  const freq = {};\n  for (const item of arr) {\n    freq[item] = (freq[item] || 0) + 1;\n  }\n  return freq;\n}",
    explanation: "Use an object as a hash map and increment freq[item].",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Iterate through array and update map: map[x] = (map[x] || 0) + 1."]
  },
  {
    id: "JS-P072",
    number: 72,
    title: "Find the Most Frequent Element in Array",
    slug: "js-p072-find-the-most-frequent-element-in-array",
    category: "Arrays",
    subcategory: "Hash Map",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Hash Map"],
    tags: ["arrays", "mode", "frequency"],
    expectedTime: "5 mins",
    summary: "Return the element with the highest frequency in an array.",
    problemStatement: "Write a function `mostFrequent(arr)` that returns the element that appears most often in `arr`. If the array is empty, return `null`. If there is a tie, return any of the top elements.",
    examples: [
      { title: "Example 1", input: "[[1, 3, 2, 1, 4, 1]]", output: "1", explanation: "1 appears 3 times." },
      { title: "Example 2", input: "[['a', 'b', 'b', 'c']]", output: "'b'", explanation: "'b' appears 2 times." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function mostFrequent(arr) {\n  // Write your solution here\n}",
    functionName: "mostFrequent",
    testCases: [
      { id: "tc_72_1", input: "[[1, 3, 2, 1, 4, 1]]", expectedOutput: "1", isHidden: false },
      { id: "tc_72_2", input: "[['a', 'b', 'b', 'c']]", expectedOutput: "'b'", isHidden: false },
      { id: "tc_72_3", input: "[[]]", expectedOutput: "null", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_72_4", input: "[[42]]", expectedOutput: "42", isHidden: true },
      { id: "tc_72_5", input: "[[5, 5, 2, 2, 5]]", expectedOutput: "5", isHidden: true }
    ],
    solution: "function mostFrequent(arr) {\n  if (!arr || arr.length === 0) return null;\n  const map = new Map();\n  let best = arr[0];\n  let maxCount = 0;\n  for (const x of arr) {\n    const count = (map.get(x) || 0) + 1;\n    map.set(x, count);\n    if (count > maxCount) {\n      maxCount = count;\n      best = x;\n    }\n  }\n  return best;\n}",
    explanation: "Use a Map to track frequencies and update the maximum seen element.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use Map to record frequencies and track the element with the maximum count."]
  },
  {
    id: "JS-P073",
    number: 73,
    title: "Check if Array is Monotonically Increasing",
    slug: "js-p073-check-if-array-is-monotonically-increasing",
    category: "Arrays",
    subcategory: "Array Inspection",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Iteration"],
    tags: ["arrays", "monotonic", "inspection"],
    expectedTime: "5 mins",
    summary: "Determine if every element in the array is greater than or equal to its predecessor.",
    problemStatement: "Write a function `isMonotonicIncreasing(arr)` that returns `true` if `arr[i] <= arr[i+1]` for all `0 <= i < arr.length - 1`, and `false` otherwise.",
    examples: [
      { title: "Example 1", input: "[[1, 2, 2, 4]]", output: "true", explanation: "Monotonically increasing." },
      { title: "Example 2", input: "[[1, 3, 2]]", output: "false", explanation: "3 > 2 violates monotonicity." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function isMonotonicIncreasing(arr) {\n  // Write your solution here\n}",
    functionName: "isMonotonicIncreasing",
    testCases: [
      { id: "tc_73_1", input: "[[1, 2, 2, 4]]", expectedOutput: "true", isHidden: false },
      { id: "tc_73_2", input: "[[1, 3, 2]]", expectedOutput: "false", isHidden: false },
      { id: "tc_73_3", input: "[[]]", expectedOutput: "true", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_73_4", input: "[[5]]", expectedOutput: "true", isHidden: true },
      { id: "tc_73_5", input: "[[10, 9, 8]]", expectedOutput: "false", isHidden: true }
    ],
    solution: "function isMonotonicIncreasing(arr) {\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] < arr[i - 1]) return false;\n  }\n  return true;\n}",
    explanation: "Scan adjacent elements; return false immediately if any inversion occurs.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Check if any arr[i] < arr[i - 1]."]
  },
  {
    id: "JS-P074",
    number: 74,
    title: "Check if Array is Sorted",
    slug: "js-p074-check-if-array-is-sorted",
    category: "Arrays",
    subcategory: "Array Inspection",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Sorting"],
    tags: ["arrays", "sorted", "inspection"],
    expectedTime: "5 mins",
    summary: "Determine if array is sorted in non-decreasing order.",
    problemStatement: "Write a function `isSorted(arr)` that checks if array `arr` is sorted in ascending (non-decreasing) order.",
    examples: [
      { title: "Example 1", input: "[[10, 20, 30]]", output: "true", explanation: "Sorted." },
      { title: "Example 2", input: "[[30, 20, 10]]", output: "false", explanation: "Descending, not ascending." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function isSorted(arr) {\n  // Write your solution here\n}",
    functionName: "isSorted",
    testCases: [
      { id: "tc_74_1", input: "[[10, 20, 30]]", expectedOutput: "true", isHidden: false },
      { id: "tc_74_2", input: "[[30, 20, 10]]", expectedOutput: "false", isHidden: false },
      { id: "tc_74_3", input: "[[5]]", expectedOutput: "true", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_74_4", input: "[[]]", expectedOutput: "true", isHidden: true },
      { id: "tc_74_5", input: "[[1, 2, 2, 3]]", expectedOutput: "true", isHidden: true }
    ],
    solution: "function isSorted(arr) {\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] < arr[i - 1]) return false;\n  }\n  return true;\n}",
    explanation: "Iterate from 1 to arr.length-1 checking arr[i] >= arr[i - 1].",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Check if any element is smaller than the previous one."]
  },
  {
    id: "JS-P075",
    number: 75,
    title: "Remove Falsy Values from Array",
    slug: "js-p075-remove-falsy-values-from-array",
    category: "Arrays",
    subcategory: "Array Filtering",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Boolean"],
    tags: ["arrays", "compact", "filter"],
    expectedTime: "5 mins",
    summary: "Filter out all falsy values (false, null, 0, '', undefined, NaN) from an array.",
    problemStatement: "Write a function `compactArray(arr)` that returns a new array with all falsy values removed.",
    examples: [
      { title: "Example 1", input: "[[0, 1, false, 2, '', 3, 'a', NaN]]", output: "[1, 2, 3, 'a']", explanation: "0, false, '', and NaN removed." },
      { title: "Example 2", input: "[[null, undefined]]", output: "[]", explanation: "All falsy." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function compactArray(arr) {\n  // Write your solution here\n}",
    functionName: "compactArray",
    testCases: [
      { id: "tc_75_1", input: "[[0, 1, false, 2, '', 3, 'a', NaN]]", expectedOutput: "[1, 2, 3, 'a']", isHidden: false },
      { id: "tc_75_2", input: "[[null, undefined]]", expectedOutput: "[]", isHidden: false },
      { id: "tc_75_3", input: "[[true, 'hello', 42]]", expectedOutput: "[true, 'hello', 42]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_75_4", input: "[[]]", expectedOutput: "[]", isHidden: true },
      { id: "tc_75_5", input: "[[0, '', false]]", expectedOutput: "[]", isHidden: true }
    ],
    solution: "function compactArray(arr) {\n  return arr.filter(Boolean);\n}",
    explanation: "arr.filter(Boolean) casts each item to a boolean and retains truthy values.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use arr.filter(Boolean)."]
  },
  {
    id: "JS-P076",
    number: 76,
    title: "Two Sum Indices",
    slug: "js-p076-two-sum-indices",
    category: "Arrays",
    subcategory: "Hash Map",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Hash Map"],
    tags: ["arrays", "two-sum", "hash-map"],
    expectedTime: "10 mins",
    summary: "Find indices of the two numbers that add up to a specific target.",
    problemStatement: "Write a function `twoSum(nums, target)` that returns the indices `[i, j]` of the two numbers such that `nums[i] + nums[j] === target` and `i < j`. Return `null` if no such pair exists.",
    examples: [
      { title: "Example 1", input: "[[2, 7, 11, 15], 9]", output: "[0, 1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9." },
      { title: "Example 2", input: "[[3, 2, 4], 6]", output: "[1, 2]", explanation: "nums[1] + nums[2] = 2 + 4 = 6." }
    ],
    constraints: ["2 <= nums.length <= 10^5"],
    starterCode: "function twoSum(nums, target) {\n  // Write your solution here\n}",
    functionName: "twoSum",
    testCases: [
      { id: "tc_76_1", input: "[[2, 7, 11, 15], 9]", expectedOutput: "[0, 1]", isHidden: false },
      { id: "tc_76_2", input: "[[3, 2, 4], 6]", expectedOutput: "[1, 2]", isHidden: false },
      { id: "tc_76_3", input: "[[3, 3], 6]", expectedOutput: "[0, 1]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_76_4", input: "[[1, 2, 3], 10]", expectedOutput: "null", isHidden: true },
      { id: "tc_76_5", input: "[[-1, -2, -3, -4, -5], -8]", expectedOutput: "[2, 4]", isHidden: true }
    ],
    solution: "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return null;\n}",
    explanation: "Store visited numbers and their indices in a Map for O(1) complement lookup.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use a Map to store complement value to index."]
  },
  {
    id: "JS-P077",
    number: 77,
    title: "Find All Pairs with Given Sum",
    slug: "js-p077-find-all-pairs-with-given-sum",
    category: "Arrays",
    subcategory: "Searching",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Arrays", "Set"],
    tags: ["arrays", "pairs", "sum"],
    expectedTime: "10 mins",
    summary: "Return unique pairs [a, b] (with a <= b) that add up to target.",
    problemStatement: "Write a function `findAllPairs(arr, target)` that returns all distinct pairs `[a, b]` (where `a <= b`) such that `a + b === target`. Result pairs should be sorted by first element.",
    examples: [
      { title: "Example 1", input: "[[1, 5, 7, -1, 5], 6]", output: "[[-1, 7], [1, 5]]", explanation: "-1+7=6 and 1+5=6." },
      { title: "Example 2", input: "[[2, 2, 2], 4]", output: "[[2, 2]]", explanation: "Distinct pair is [2, 2]." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function findAllPairs(arr, target) {\n  // Write your solution here\n}",
    functionName: "findAllPairs",
    testCases: [
      { id: "tc_77_1", input: "[[1, 5, 7, -1, 5], 6]", expectedOutput: "[[-1, 7], [1, 5]]", isHidden: false },
      { id: "tc_77_2", input: "[[2, 2, 2], 4]", expectedOutput: "[[2, 2]]", isHidden: false },
      { id: "tc_77_3", input: "[[1, 2, 3], 10]", expectedOutput: "[]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_77_4", input: "[[], 5]", expectedOutput: "[]", isHidden: true },
      { id: "tc_77_5", input: "[[0, 4, 2, 2, -2, 6], 4]", expectedOutput: "[[-2, 6], [0, 4], [2, 2]]", isHidden: true }
    ],
    solution: "function findAllPairs(arr, target) {\n  const seen = new Set();\n  const pairs = new Map();\n  for (const n of arr) {\n    const comp = target - n;\n    if (seen.has(comp)) {\n      const a = Math.min(n, comp);\n      const b = Math.max(n, comp);\n      pairs.set(a, [a, b]);\n    }\n    seen.add(n);\n  }\n  return Array.from(pairs.values()).sort((p1, p2) => p1[0] - p2[0]);\n}",
    explanation: "Use a Set to locate complements, store canonical [min, max] pairs in a Map, and sort.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    hints: ["Normalize pairs as [Math.min(a, b), Math.max(a, b)] to deduplicate."]
  },
  {
    id: "JS-P078",
    number: 78,
    title: "Reverse an Array Without Mutating Input",
    slug: "js-p078-reverse-an-array-without-mutating-input",
    category: "Arrays",
    subcategory: "Array Basics",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Immutability"],
    tags: ["arrays", "reverse", "immutable"],
    expectedTime: "5 mins",
    summary: "Return a new array containing the reversed elements of input array.",
    problemStatement: "Write a function `reverseArrayCopy(arr)` that returns a reversed copy of `arr` without mutating the original array.",
    examples: [
      { title: "Example 1", input: "[[1, 2, 3]]", output: "[3, 2, 1]", explanation: "Copy reversed." },
      { title: "Example 2", input: "[['a', 'b']]", output: "['b', 'a']", explanation: "Original preserved." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function reverseArrayCopy(arr) {\n  // Write your solution here\n}",
    functionName: "reverseArrayCopy",
    testCases: [
      { id: "tc_78_1", input: "[[1, 2, 3]]", expectedOutput: "[3, 2, 1]", isHidden: false },
      { id: "tc_78_2", input: "[['a', 'b']]", expectedOutput: "['b', 'a']", isHidden: false },
      { id: "tc_78_3", input: "[[]]", expectedOutput: "[]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_78_4", input: "[[42]]", expectedOutput: "[42]", isHidden: true },
      { id: "tc_78_5", input: "[[5, 4, 3, 2, 1]]", expectedOutput: "[1, 2, 3, 4, 5]", isHidden: true }
    ],
    solution: "function reverseArrayCopy(arr) {\n  return [...arr].reverse();\n}",
    explanation: "Slice or spread into a new array before calling reverse.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use [...arr].reverse() or slice().reverse()."]
  },
  {
    id: "JS-P079",
    number: 79,
    title: "Remove Element by Value",
    slug: "js-p079-remove-element-by-value",
    category: "Arrays",
    subcategory: "Array Filtering",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Filter"],
    tags: ["arrays", "filter", "removal"],
    expectedTime: "5 mins",
    summary: "Return a new array with all occurrences of a target value excluded.",
    problemStatement: "Write a function `removeElement(arr, val)` that returns a new array excluding all instances of `val`.",
    examples: [
      { title: "Example 1", input: "[[1, 2, 3, 2, 4], 2]", output: "[1, 3, 4]", explanation: "Both 2s removed." },
      { title: "Example 2", input: "[['apple', 'banana'], 'banana']", output: "['apple']", explanation: "'banana' removed." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function removeElement(arr, val) {\n  // Write your solution here\n}",
    functionName: "removeElement",
    testCases: [
      { id: "tc_79_1", input: "[[1, 2, 3, 2, 4], 2]", expectedOutput: "[1, 3, 4]", isHidden: false },
      { id: "tc_79_2", input: "[['apple', 'banana'], 'banana']", expectedOutput: "['apple']", isHidden: false },
      { id: "tc_79_3", input: "[[], 1]", expectedOutput: "[]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_79_4", input: "[[2, 2, 2], 2]", expectedOutput: "[]", isHidden: true },
      { id: "tc_79_5", input: "[[1, 2, 3], 99]", expectedOutput: "[1, 2, 3]", isHidden: true }
    ],
    solution: "function removeElement(arr, val) {\n  return arr.filter(x => x !== val);\n}",
    explanation: "arr.filter filters out matching values.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use arr.filter(x => x !== val)."]
  },
  {
    id: "JS-P080",
    number: 80,
    title: "Find All Duplicates in an Array",
    slug: "js-p080-find-all-duplicates-in-an-array",
    category: "Arrays",
    subcategory: "Hash Map",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Set"],
    tags: ["arrays", "duplicates", "set"],
    expectedTime: "5 mins",
    summary: "Return an array of all distinct elements that appear more than once.",
    problemStatement: "Write a function `findAllDuplicates(arr)` that returns all values that appear at least twice in `arr`, in order of first duplication.",
    examples: [
      { title: "Example 1", input: "[[4, 3, 2, 7, 8, 2, 3, 1]]", output: "[2, 3]", explanation: "2 and 3 appear twice." },
      { title: "Example 2", input: "[[1, 1, 2]]", output: "[1]", explanation: "1 is duplicated." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function findAllDuplicates(arr) {\n  // Write your solution here\n}",
    functionName: "findAllDuplicates",
    testCases: [
      { id: "tc_80_1", input: "[[4, 3, 2, 7, 8, 2, 3, 1]]", expectedOutput: "[2, 3]", isHidden: false },
      { id: "tc_80_2", input: "[[1, 1, 2]]", expectedOutput: "[1]", isHidden: false },
      { id: "tc_80_3", input: "[[1, 2, 3]]", expectedOutput: "[]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_80_4", input: "[[]]", expectedOutput: "[]", isHidden: true },
      { id: "tc_80_5", input: "[[1, 1, 1, 1]]", expectedOutput: "[1]", isHidden: true }
    ],
    solution: "function findAllDuplicates(arr) {\n  const seen = new Set();\n  const dups = new Set();\n  for (const x of arr) {\n    if (seen.has(x)) dups.add(x);\n    else seen.add(x);\n  }\n  return Array.from(dups);\n}",
    explanation: "Two sets: seen tracks elements, dups tracks repeated elements.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use one set for seen items and another set for duplicated items."]
  },
  {
    id: "JS-P081",
    number: 81,
    title: "Find Elements Greater Than All Elements to Their Right (Leaders)",
    slug: "js-p081-find-elements-greater-than-all-elements-to-their-right-leaders",
    category: "Arrays",
    subcategory: "Array Scanning",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Arrays", "Scanning"],
    tags: ["arrays", "leaders", "scan"],
    expectedTime: "10 mins",
    summary: "Find all leader elements that are strictly greater than all elements to their right.",
    problemStatement: "Write a function `findLeaders(arr)` that returns all leaders in `arr` in their original left-to-right order.\n\nAn element is a leader if it is strictly greater than all elements to its right. The rightmost element is always a leader if the array is non-empty.",
    examples: [
      { title: "Example 1", input: "[[16, 17, 4, 3, 5, 2]]", output: "[17, 5, 2]", explanation: "17 > 4,3,5,2; 5 > 2; 2 is rightmost." },
      { title: "Example 2", input: "[[1, 2, 3, 4, 0]]", output: "[4, 0]", explanation: "4 and 0 are leaders." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function findLeaders(arr) {\n  // Write your solution here\n}",
    functionName: "findLeaders",
    testCases: [
      { id: "tc_81_1", input: "[[16, 17, 4, 3, 5, 2]]", expectedOutput: "[17, 5, 2]", isHidden: false },
      { id: "tc_81_2", input: "[[1, 2, 3, 4, 0]]", expectedOutput: "[4, 0]", isHidden: false },
      { id: "tc_81_3", input: "[[]]", expectedOutput: "[]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_81_4", input: "[[5]]", expectedOutput: "[5]", isHidden: true },
      { id: "tc_81_5", input: "[[5, 4, 3, 2, 1]]", expectedOutput: "[5, 4, 3, 2, 1]", isHidden: true }
    ],
    solution: "function findLeaders(arr) {\n  if (!arr || arr.length === 0) return [];\n  const leaders = [];\n  let maxFromRight = -Infinity;\n  for (let i = arr.length - 1; i >= 0; i--) {\n    if (arr[i] > maxFromRight) {\n      leaders.push(arr[i]);\n      maxFromRight = arr[i];\n    }\n  }\n  return leaders.reverse();\n}",
    explanation: "Scan right-to-left keeping track of max element seen, then reverse the collected leaders.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Iterate backwards from right to left tracking the maximum value seen so far."]
  },
  {
    id: "JS-P082",
    number: 82,
    title: "Find First Peak Element in Array",
    slug: "js-p082-find-first-peak-element-in-array",
    category: "Arrays",
    subcategory: "Searching",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Searching"],
    tags: ["arrays", "peak", "search"],
    expectedTime: "5 mins",
    summary: "Find the index of the first peak element that is greater than its neighbors.",
    problemStatement: "Write a function `findPeakElement(arr)` that returns the index of the first peak element in `arr`. A peak element is greater than its existing neighbors.\n\nIf the array is empty, return `-1`. An element at an end only needs to be greater than its single neighbor.",
    examples: [
      { title: "Example 1", input: "[[1, 2, 3, 1]]", output: "2", explanation: "3 is peak at index 2." },
      { title: "Example 2", input: "[[1, 2, 1, 3, 5, 6, 4]]", output: "1", explanation: "First peak is 2 at index 1." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function findPeakElement(arr) {\n  // Write your solution here\n}",
    functionName: "findPeakElement",
    testCases: [
      { id: "tc_82_1", input: "[[1, 2, 3, 1]]", expectedOutput: "2", isHidden: false },
      { id: "tc_82_2", input: "[[1, 2, 1, 3, 5, 6, 4]]", expectedOutput: "1", isHidden: false },
      { id: "tc_82_3", input: "[[5]]", expectedOutput: "0", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_82_4", input: "[[]]", expectedOutput: "-1", isHidden: true },
      { id: "tc_82_5", input: "[[1, 2, 3]]", expectedOutput: "2", isHidden: true }
    ],
    solution: "function findPeakElement(arr) {\n  if (!arr || arr.length === 0) return -1;\n  if (arr.length === 1) return 0;\n  for (let i = 0; i < arr.length; i++) {\n    const leftOk = (i === 0) || arr[i] > arr[i - 1];\n    const rightOk = (i === arr.length - 1) || arr[i] > arr[i + 1];\n    if (leftOk && rightOk) return i;\n  }\n  return 0;\n}",
    explanation: "Check each index against left and right neighbors.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Compare arr[i] to arr[i - 1] and arr[i + 1], treating out-of-bound neighbors as -Infinity."]
  },
  {
    id: "JS-P083",
    number: 83,
    title: "Maximum Product of Two Numbers in Array",
    slug: "js-p083-maximum-product-of-two-numbers-in-array",
    category: "Arrays",
    subcategory: "Array Math",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Math"],
    tags: ["arrays", "product", "math"],
    expectedTime: "5 mins",
    summary: "Find the maximum product of any two distinct elements in an array.",
    problemStatement: "Write a function `maxProductOfTwo(arr)` that returns the maximum product of two distinct elements in `arr`. The array has at least 2 numbers.",
    examples: [
      { title: "Example 1", input: "[[3, 4, 5, 2]]", output: "20", explanation: "4 * 5 = 20." },
      { title: "Example 2", input: "[[-10, -10, 5, 2]]", output: "100", explanation: "(-10) * (-10) = 100." }
    ],
    constraints: ["arr.length >= 2"],
    starterCode: "function maxProductOfTwo(arr) {\n  // Write your solution here\n}",
    functionName: "maxProductOfTwo",
    testCases: [
      { id: "tc_83_1", input: "[[3, 4, 5, 2]]", expectedOutput: "20", isHidden: false },
      { id: "tc_83_2", input: "[[-10, -10, 5, 2]]", expectedOutput: "100", isHidden: false },
      { id: "tc_83_3", input: "[[1, 2]]", expectedOutput: "2", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_83_4", input: "[[-5, -2, -1]]", expectedOutput: "10", isHidden: true },
      { id: "tc_83_5", input: "[[0, 10]]", expectedOutput: "0", isHidden: true }
    ],
    solution: "function maxProductOfTwo(arr) {\n  const sorted = [...arr].sort((a, b) => a - b);\n  const n = sorted.length;\n  const p1 = sorted[n - 1] * sorted[n - 2];\n  const p2 = sorted[0] * sorted[1];\n  return Math.max(p1, p2);\n}",
    explanation: "Product of top two positive numbers or bottom two negative numbers.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    hints: ["Check both the two largest positive numbers and two most negative numbers."]
  },
  {
    id: "JS-P084",
    number: 84,
    title: "Check if Two Arrays are Equal (Elements & Order)",
    slug: "js-p084-check-if-two-arrays-are-equal-elements-order",
    category: "Arrays",
    subcategory: "Comparison",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Equality"],
    tags: ["arrays", "comparison", "equality"],
    expectedTime: "5 mins",
    summary: "Determine if two arrays have the identical length and elements in the exact same order.",
    problemStatement: "Write a function `arraysEqual(arr1, arr2)` that returns `true` if `arr1` and `arr2` contain equal elements at every index, otherwise `false`.",
    examples: [
      { title: "Example 1", input: "[[1, 2, 3], [1, 2, 3]]", output: "true", explanation: "Identical elements and order." },
      { title: "Example 2", input: "[[1, 2], [2, 1]]", output: "false", explanation: "Different order." }
    ],
    constraints: ["0 <= arr1.length, arr2.length <= 10^5"],
    starterCode: "function arraysEqual(arr1, arr2) {\n  // Write your solution here\n}",
    functionName: "arraysEqual",
    testCases: [
      { id: "tc_84_1", input: "[[1, 2, 3], [1, 2, 3]]", expectedOutput: "true", isHidden: false },
      { id: "tc_84_2", input: "[[1, 2], [2, 1]]", expectedOutput: "false", isHidden: false },
      { id: "tc_84_3", input: "[[], []]", expectedOutput: "true", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_84_4", input: "[[1], [1, 2]]", expectedOutput: "false", isHidden: true },
      { id: "tc_84_5", input: "[['a'], ['a']]", expectedOutput: "true", isHidden: true }
    ],
    solution: "function arraysEqual(arr1, arr2) {\n  if (arr1.length !== arr2.length) return false;\n  for (let i = 0; i < arr1.length; i++) {\n    if (arr1[i] !== arr2[i]) return false;\n  }\n  return true;\n}",
    explanation: "Check length match, then verify index-by-index equality.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Compare lengths first, then check arr1[i] === arr2[i]."]
  },
  {
    id: "JS-P085",
    number: 85,
    title: "Best Time to Buy and Sell Stock Single Transaction",
    slug: "js-p085-best-time-to-buy-and-sell-stock-single-transaction",
    category: "Arrays",
    subcategory: "Dynamic Programming",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Greedy"],
    tags: ["arrays", "stock", "profit"],
    expectedTime: "10 mins",
    summary: "Calculate the maximum profit from buying and selling a stock once.",
    problemStatement: "Write a function `maxProfit(prices)` that returns the maximum profit you can achieve by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. If no profit is possible, return `0`.",
    examples: [
      { title: "Example 1", input: "[[7, 1, 5, 3, 6, 4]]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5." },
      { title: "Example 2", input: "[[7, 6, 4, 3, 1]]", output: "0", explanation: "No profit possible." }
    ],
    constraints: ["0 <= prices.length <= 10^5"],
    starterCode: "function maxProfit(prices) {\n  // Write your solution here\n}",
    functionName: "maxProfit",
    testCases: [
      { id: "tc_85_1", input: "[[7, 1, 5, 3, 6, 4]]", expectedOutput: "5", isHidden: false },
      { id: "tc_85_2", input: "[[7, 6, 4, 3, 1]]", expectedOutput: "0", isHidden: false },
      { id: "tc_85_3", input: "[[2, 4, 1]]", expectedOutput: "2", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_85_4", input: "[[]]", expectedOutput: "0", isHidden: true },
      { id: "tc_85_5", input: "[[1, 2]]", expectedOutput: "1", isHidden: true }
    ],
    solution: "function maxProfit(prices) {\n  let minPrice = Infinity;\n  let maxProfitVal = 0;\n  for (const price of prices) {\n    if (price < minPrice) minPrice = price;\n    else if (price - minPrice > maxProfitVal) maxProfitVal = price - minPrice;\n  }\n  return maxProfitVal;\n}",
    explanation: "Track the minimum price seen so far and update maximum profit in O(n) time.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Track minPrice seen so far and calculate profit price - minPrice."]
  },
  {
    id: "JS-P086",
    number: 86,
    title: "Count Inversions in Small Array",
    slug: "js-p086-count-inversions-in-small-array",
    category: "Arrays",
    subcategory: "Sorting & Searching",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Arrays", "Inversions"],
    tags: ["arrays", "inversions", "algorithm"],
    expectedTime: "10 mins",
    summary: "Count the number of pairs (i, j) such that i < j and arr[i] > arr[j].",
    problemStatement: "Write a function `countInversions(arr)` that returns the count of inversions in `arr`.\n\nTwo elements `arr[i]` and `arr[j]` form an inversion if `arr[i] > arr[j]` and `i < j`.",
    examples: [
      { title: "Example 1", input: "[[2, 4, 1, 3, 5]]", output: "3", explanation: "Pairs: (2, 1), (4, 1), (4, 3) = 3 inversions." },
      { title: "Example 2", input: "[[1, 2, 3]]", output: "0", explanation: "Already sorted, 0 inversions." }
    ],
    constraints: ["0 <= arr.length <= 1000"],
    starterCode: "function countInversions(arr) {\n  // Write your solution here\n}",
    functionName: "countInversions",
    testCases: [
      { id: "tc_86_1", input: "[[2, 4, 1, 3, 5]]", expectedOutput: "3", isHidden: false },
      { id: "tc_86_2", input: "[[1, 2, 3]]", expectedOutput: "0", isHidden: false },
      { id: "tc_86_3", input: "[[3, 2, 1]]", expectedOutput: "3", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_86_4", input: "[[]]", expectedOutput: "0", isHidden: true },
      { id: "tc_86_5", input: "[[5, 4, 3, 2, 1]]", expectedOutput: "10", isHidden: true }
    ],
    solution: "function countInversions(arr) {\n  let count = 0;\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = i + 1; j < arr.length; j++) {\n      if (arr[i] > arr[j]) count++;\n    }\n  }\n  return count;\n}",
    explanation: "Check each pair (i, j) with i < j and increment count if arr[i] > arr[j].",
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(1)",
    hints: ["Loop through all pairs (i, j) where i < j and check if arr[i] > arr[j]."]
  },
  {
    id: "JS-P087",
    number: 87,
    title: "Merge Two Sorted Arrays into One Sorted Array",
    slug: "js-p087-merge-two-sorted-arrays-into-one-sorted-array",
    category: "Arrays",
    subcategory: "Two Pointers",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Two Pointers"],
    tags: ["arrays", "merge", "sorted"],
    expectedTime: "10 mins",
    summary: "Merge two pre-sorted arrays into a single sorted array in linear time.",
    problemStatement: "Write a function `mergeSortedArrays(arr1, arr2)` that takes two sorted arrays and merges them into one sorted array in O(n + m) time without calling Array.prototype.sort.",
    examples: [
      { title: "Example 1", input: "[[1, 3, 5], [2, 4, 6]]", output: "[1, 2, 3, 4, 5, 6]", explanation: "Merged in sorted order." },
      { title: "Example 2", input: "[[1, 2], [3, 4]]", output: "[1, 2, 3, 4]", explanation: "All elements from arr1 precede arr2." }
    ],
    constraints: ["0 <= arr1.length, arr2.length <= 10^5"],
    starterCode: "function mergeSortedArrays(arr1, arr2) {\n  // Write your solution here\n}",
    functionName: "mergeSortedArrays",
    testCases: [
      { id: "tc_87_1", input: "[[1, 3, 5], [2, 4, 6]]", expectedOutput: "[1, 2, 3, 4, 5, 6]", isHidden: false },
      { id: "tc_87_2", input: "[[1, 2], [3, 4]]", expectedOutput: "[1, 2, 3, 4]", isHidden: false },
      { id: "tc_87_3", input: "[[], [1]]", expectedOutput: "[1]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_87_4", input: "[[], []]", expectedOutput: "[]", isHidden: true },
      { id: "tc_87_5", input: "[[2, 2], [2, 2]]", expectedOutput: "[2, 2, 2, 2]", isHidden: true }
    ],
    solution: "function mergeSortedArrays(arr1, arr2) {\n  const res = [];\n  let i = 0, j = 0;\n  while (i < arr1.length && j < arr2.length) {\n    if (arr1[i] <= arr2[j]) res.push(arr1[i++]);\n    else res.push(arr2[j++]);\n  }\n  while (i < arr1.length) res.push(arr1[i++]);\n  while (j < arr2.length) res.push(arr2[j++]);\n  return res;\n}",
    explanation: "Two pointers step through arr1 and arr2 comparing elements in O(n + m) time.",
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(n + m)",
    hints: ["Use two pointers i and j comparing arr1[i] and arr2[j]."]
  },
  {
    id: "JS-P088",
    number: 88,
    title: "Find Single Non-Repeated Number in Array",
    slug: "js-p088-find-single-non-repeated-number-in-array",
    category: "Arrays",
    subcategory: "Bitwise Operations",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Bitwise", "XOR"],
    tags: ["arrays", "bitwise", "xor"],
    expectedTime: "5 mins",
    summary: "Find the single element that appears only once where all other elements appear twice.",
    problemStatement: "Write a function `singleNumber(arr)` that finds the element that appears once in an array where every other element appears twice.",
    examples: [
      { title: "Example 1", input: "[[2, 2, 1]]", output: "1", explanation: "1 appears once." },
      { title: "Example 2", input: "[[4, 1, 2, 1, 2]]", output: "4", explanation: "4 appears once." }
    ],
    constraints: ["arr.length >= 1"],
    starterCode: "function singleNumber(arr) {\n  // Write your solution here\n}",
    functionName: "singleNumber",
    testCases: [
      { id: "tc_88_1", input: "[[2, 2, 1]]", expectedOutput: "1", isHidden: false },
      { id: "tc_88_2", input: "[[4, 1, 2, 1, 2]]", expectedOutput: "4", isHidden: false },
      { id: "tc_88_3", input: "[[1]]", expectedOutput: "1", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_88_4", input: "[[7, 3, 5, 3, 7]]", expectedOutput: "5", isHidden: true },
      { id: "tc_88_5", input: "[[0, 1, 0]]", expectedOutput: "1", isHidden: true }
    ],
    solution: "function singleNumber(arr) {\n  return arr.reduce((acc, x) => acc ^ x, 0);\n}",
    explanation: "XOR of any number with itself is 0, and x ^ 0 = x. Reducing with XOR cancels all duplicates.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Use the XOR bitwise operator (^). x ^ x === 0 and x ^ 0 === x."]
  },
  {
    id: "JS-P089",
    number: 89,
    title: "Group Array Elements by Property Length",
    slug: "js-p089-group-array-elements-by-property-length",
    category: "Arrays",
    subcategory: "Grouping",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Grouping"],
    tags: ["arrays", "groupBy", "strings"],
    expectedTime: "5 mins",
    summary: "Group an array of strings by their string length.",
    problemStatement: "Write a function `groupByLength(arr)` that groups strings in `arr` by their `.length` property into an object whose keys are lengths and values are arrays of strings.",
    examples: [
      { title: "Example 1", input: "[['one', 'two', 'three', 'four', 'five']]", output: "{ '3': ['one', 'two'], '4': ['four', 'five'], '5': ['three'] }", explanation: "Grouped by length." },
      { title: "Example 2", input: "[['a', 'b', 'c']]", output: "{ '1': ['a', 'b', 'c'] }", explanation: "All length 1." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function groupByLength(arr) {\n  // Write your solution here\n}",
    functionName: "groupByLength",
    testCases: [
      { id: "tc_89_1", input: "[['one', 'two', 'three', 'four', 'five']]", expectedOutput: "{ '3': ['one', 'two'], '4': ['four', 'five'], '5': ['three'] }", isHidden: false },
      { id: "tc_89_2", input: "[['a', 'b', 'c']]", expectedOutput: "{ '1': ['a', 'b', 'c'] }", isHidden: false },
      { id: "tc_89_3", input: "[[]]", expectedOutput: "{}", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_89_4", input: "[['']]", expectedOutput: "{ '0': [''] }", isHidden: true },
      { id: "tc_89_5", input: "[['apple', 'peach']]", expectedOutput: "{ '5': ['apple', 'peach'] }", isHidden: true }
    ],
    solution: "function groupByLength(arr) {\n  const res = {};\n  for (const s of arr) {\n    const len = s.length;\n    if (!res[len]) res[len] = [];\n    res[len].push(s);\n  }\n  return res;\n}",
    explanation: "Iterate through strings and push into res[s.length].",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use an object with keys s.length."]
  },
  {
    id: "JS-P090",
    number: 90,
    title: "Count Greater Elements to the Right",
    slug: "js-p090-count-greater-elements-to-the-right",
    category: "Arrays",
    subcategory: "Scanning",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Arrays", "Iteration"],
    tags: ["arrays", "counting", "scanning"],
    expectedTime: "10 mins",
    summary: "Return an array where each position has the count of strictly greater elements appearing to its right.",
    problemStatement: "Write a function `countGreaterRight(arr)` that returns a new array `res` where `res[i]` is the number of elements `arr[j]` such that `j > i` and `arr[j] > arr[i]`.",
    examples: [
      { title: "Example 1", input: "[[3, 4, 9, 6, 1]]", output: "[3, 2, 0, 0, 0]", explanation: "For 3: 4, 9, 6 are greater (3). For 4: 9, 6 are greater (2)." },
      { title: "Example 2", input: "[[1, 2, 3]]", output: "[2, 1, 0]", explanation: "1 has 2, 2 has 1, 3 has 0." }
    ],
    constraints: ["0 <= arr.length <= 1000"],
    starterCode: "function countGreaterRight(arr) {\n  // Write your solution here\n}",
    functionName: "countGreaterRight",
    testCases: [
      { id: "tc_90_1", input: "[[3, 4, 9, 6, 1]]", expectedOutput: "[3, 2, 0, 0, 0]", isHidden: false },
      { id: "tc_90_2", input: "[[1, 2, 3]]", expectedOutput: "[2, 1, 0]", isHidden: false },
      { id: "tc_90_3", input: "[[]]", expectedOutput: "[]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_90_4", input: "[[5]]", expectedOutput: "[0]", isHidden: true },
      { id: "tc_90_5", input: "[[3, 2, 1]]", expectedOutput: "[0, 0, 0]", isHidden: true }
    ],
    solution: "function countGreaterRight(arr) {\n  const res = [];\n  for (let i = 0; i < arr.length; i++) {\n    let count = 0;\n    for (let j = i + 1; j < arr.length; j++) {\n      if (arr[j] > arr[i]) count++;\n    }\n    res.push(count);\n  }\n  return res;\n}",
    explanation: "For each index i, count how many elements j > i satisfy arr[j] > arr[i].",
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(n)",
    hints: ["For each element at i, count items to the right greater than arr[i]."]
  },
  {
    id: "JS-P091",
    number: 91,
    title: "Calculate Cumulative Product of Array",
    slug: "js-p091-calculate-cumulative-product-of-array",
    category: "Arrays",
    subcategory: "Accumulation",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Accumulation"],
    tags: ["arrays", "product", "cumulative"],
    expectedTime: "5 mins",
    summary: "Return an array where element i is the product of all elements from 0 to i.",
    problemStatement: "Write a function `cumulativeProduct(arr)` that returns the cumulative product array. If `arr` is empty, return `[]`.",
    examples: [
      { title: "Example 1", input: "[[1, 2, 3, 4]]", output: "[1, 2, 6, 24]", explanation: "[1, 1*2, 1*2*3, 1*2*3*4]." },
      { title: "Example 2", input: "[[2, 0, 5]]", output: "[2, 0, 0]", explanation: "Zero makes subsequent products 0." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function cumulativeProduct(arr) {\n  // Write your solution here\n}",
    functionName: "cumulativeProduct",
    testCases: [
      { id: "tc_91_1", input: "[[1, 2, 3, 4]]", expectedOutput: "[1, 2, 6, 24]", isHidden: false },
      { id: "tc_91_2", input: "[[2, 0, 5]]", expectedOutput: "[2, 0, 0]", isHidden: false },
      { id: "tc_91_3", input: "[[]]", expectedOutput: "[]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_91_4", input: "[[5]]", expectedOutput: "[5]", isHidden: true },
      { id: "tc_91_5", input: "[[-1, -2, -3]]", expectedOutput: "[-1, 2, -6]", isHidden: true }
    ],
    solution: "function cumulativeProduct(arr) {\n  let prod = 1;\n  return arr.map(x => (prod *= x));\n}",
    explanation: "Iterate with map multiplying running product.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use arr.map maintaining running product variable."]
  },
  {
    id: "JS-P092",
    number: 92,
    title: "Find Common Elements Among Three Arrays",
    slug: "js-p092-find-common-elements-among-three-arrays",
    category: "Arrays",
    subcategory: "Set Operations",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Set"],
    tags: ["arrays", "intersection", "set"],
    expectedTime: "5 mins",
    summary: "Return unique elements present in all three arrays.",
    problemStatement: "Write a function `commonElementsInThree(arr1, arr2, arr3)` that returns an array of unique values that are present in all three arrays.",
    examples: [
      { title: "Example 1", input: "[[1, 5, 10, 20], [5, 6, 7, 20], [5, 20, 30]]", output: "[5, 20]", explanation: "5 and 20 are present in all three." },
      { title: "Example 2", input: "[[1, 2], [3, 4], [5, 6]]", output: "[]", explanation: "No common elements." }
    ],
    constraints: ["0 <= arr1.length, arr2.length, arr3.length <= 10^5"],
    starterCode: "function commonElementsInThree(arr1, arr2, arr3) {\n  // Write your solution here\n}",
    functionName: "commonElementsInThree",
    testCases: [
      { id: "tc_92_1", input: "[[1, 5, 10, 20], [5, 6, 7, 20], [5, 20, 30]]", expectedOutput: "[5, 20]", isHidden: false },
      { id: "tc_92_2", input: "[[1, 2], [3, 4], [5, 6]]", expectedOutput: "[]", isHidden: false },
      { id: "tc_92_3", input: "[[1, 1], [1, 1], [1, 1]]", expectedOutput: "[1]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_92_4", input: "[[], [1], [1]]", expectedOutput: "[]", isHidden: true },
      { id: "tc_92_5", input: "[[2, 3], [3, 4], [4, 3]]", expectedOutput: "[3]", isHidden: true }
    ],
    solution: "function commonElementsInThree(arr1, arr2, arr3) {\n  const s2 = new Set(arr2);\n  const s3 = new Set(arr3);\n  const res = new Set();\n  for (const x of arr1) {\n    if (s2.has(x) && s3.has(x)) res.add(x);\n  }\n  return Array.from(res);\n}",
    explanation: "Store arr2 and arr3 in Sets and filter arr1 into a result Set.",
    timeComplexity: "O(n + m + k)",
    spaceComplexity: "O(m + k)",
    hints: ["Use Sets for arr2 and arr3, then check if both sets have element from arr1."]
  },
  {
    id: "JS-P093",
    number: 93,
    title: "Interleave Two Arrays",
    slug: "js-p093-interleave-two-arrays",
    category: "Arrays",
    subcategory: "Array Transformations",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Iteration"],
    tags: ["arrays", "interleave", "merge"],
    expectedTime: "5 mins",
    summary: "Interleave elements of two arrays alternately.",
    problemStatement: "Write a function `interleaveArrays(arr1, arr2)` that alternates elements from `arr1` and `arr2`. If one array is longer, append its remaining elements at the end.",
    examples: [
      { title: "Example 1", input: "[[1, 2, 3], ['a', 'b', 'c']]", output: "[1, 'a', 2, 'b', 3, 'c']", explanation: "Alternating elements." },
      { title: "Example 2", input: "[[1, 2, 3, 4], ['a']]", output: "[1, 'a', 2, 3, 4]", explanation: "Remainder of arr1 appended." }
    ],
    constraints: ["0 <= arr1.length, arr2.length <= 10^5"],
    starterCode: "function interleaveArrays(arr1, arr2) {\n  // Write your solution here\n}",
    functionName: "interleaveArrays",
    testCases: [
      { id: "tc_93_1", input: "[[1, 2, 3], ['a', 'b', 'c']]", expectedOutput: "[1, 'a', 2, 'b', 3, 'c']", isHidden: false },
      { id: "tc_93_2", input: "[[1, 2, 3, 4], ['a']]", expectedOutput: "[1, 'a', 2, 3, 4]", isHidden: false },
      { id: "tc_93_3", input: "[[], ['x', 'y']]", expectedOutput: "['x', 'y']", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_93_4", input: "[[], []]", expectedOutput: "[]", isHidden: true },
      { id: "tc_93_5", input: "[['a', 'b'], [1, 2, 3, 4]]", expectedOutput: "['a', 1, 'b', 2, 3, 4]", isHidden: true }
    ],
    solution: "function interleaveArrays(arr1, arr2) {\n  const res = [];\n  const maxLen = Math.max(arr1.length, arr2.length);\n  for (let i = 0; i < maxLen; i++) {\n    if (i < arr1.length) res.push(arr1[i]);\n    if (i < arr2.length) res.push(arr2[i]);\n  }\n  return res;\n}",
    explanation: "Loop up to max length, pushing elements when within bounds.",
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(n + m)",
    hints: ["Loop up to Math.max(arr1.length, arr2.length) and check indices."]
  },
  {
    id: "JS-P094",
    number: 94,
    title: "Split Array into Halves",
    slug: "js-p094-split-array-into-halves",
    category: "Arrays",
    subcategory: "Array Slicing",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Slicing"],
    tags: ["arrays", "split", "halves"],
    expectedTime: "5 mins",
    summary: "Split an array into two equal or near-equal halves [left, right].",
    problemStatement: "Write a function `splitHalves(arr)` that splits `arr` into `[firstHalf, secondHalf]`. If `arr.length` is odd, `firstHalf` should have `Math.ceil(length / 2)` elements.",
    examples: [
      { title: "Example 1", input: "[[1, 2, 3, 4]]", output: "[[1, 2], [3, 4]]", explanation: "Even length split equally." },
      { title: "Example 2", input: "[[1, 2, 3, 4, 5]]", output: "[[1, 2, 3], [4, 5]]", explanation: "Odd length puts extra item in first half." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function splitHalves(arr) {\n  // Write your solution here\n}",
    functionName: "splitHalves",
    testCases: [
      { id: "tc_94_1", input: "[[1, 2, 3, 4]]", expectedOutput: "[[1, 2], [3, 4]]", isHidden: false },
      { id: "tc_94_2", input: "[[1, 2, 3, 4, 5]]", expectedOutput: "[[1, 2, 3], [4, 5]]", isHidden: false },
      { id: "tc_94_3", input: "[[]]", expectedOutput: "[[], []]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_94_4", input: "[[1]]", expectedOutput: "[[1], []]", isHidden: true },
      { id: "tc_94_5", input: "[[10, 20]]", expectedOutput: "[[10], [20]]", isHidden: true }
    ],
    solution: "function splitHalves(arr) {\n  const mid = Math.ceil(arr.length / 2);\n  return [arr.slice(0, mid), arr.slice(mid)];\n}",
    explanation: "Slice from 0 to mid and from mid to end.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["mid = Math.ceil(arr.length / 2). Slice 0 to mid and mid to end."]
  },
  {
    id: "JS-P095",
    number: 95,
    title: "Count Subarrays with Positive Sum",
    slug: "js-p095-count-subarrays-with-positive-sum",
    category: "Arrays",
    subcategory: "Subarrays",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Arrays", "Subarrays"],
    tags: ["arrays", "subarrays", "counting"],
    expectedTime: "10 mins",
    summary: "Count the number of non-empty contiguous subarrays whose elements sum to > 0.",
    problemStatement: "Write a function `countPositiveSubarrays(arr)` that returns the number of contiguous subarrays with a sum strictly greater than 0.",
    examples: [
      { title: "Example 1", input: "[[1, -1, 2]]", output: "4", explanation: "[1], [2], [1, -1, 2], [-1, 2] have positive sums." },
      { title: "Example 2", input: "[[-1, -2]]", output: "0", explanation: "No positive sums." }
    ],
    constraints: ["0 <= arr.length <= 1000"],
    starterCode: "function countPositiveSubarrays(arr) {\n  // Write your solution here\n}",
    functionName: "countPositiveSubarrays",
    testCases: [
      { id: "tc_95_1", input: "[[1, -1, 2]]", expectedOutput: "4", isHidden: false },
      { id: "tc_95_2", input: "[[-1, -2]]", expectedOutput: "0", isHidden: false },
      { id: "tc_95_3", input: "[[3]]", expectedOutput: "1", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_95_4", input: "[[]]", expectedOutput: "0", isHidden: true },
      { id: "tc_95_5", input: "[[1, 2, 3]]", expectedOutput: "6", isHidden: true }
    ],
    solution: "function countPositiveSubarrays(arr) {\n  let count = 0;\n  for (let i = 0; i < arr.length; i++) {\n    let sum = 0;\n    for (let j = i; j < arr.length; j++) {\n      sum += arr[j];\n      if (sum > 0) count++;\n    }\n  }\n  return count;\n}",
    explanation: "Compute sum of each subarray starting at i and ending at j.",
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(1)",
    hints: ["Use nested loops with a running sum for each start index."]
  },
  {
    id: "JS-P096",
    number: 96,
    title: "Product of Array Except Self",
    slug: "js-p096-product-of-array-except-self",
    category: "Arrays",
    subcategory: "Prefix & Suffix",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Arrays", "Prefix Products"],
    tags: ["arrays", "product", "prefix-suffix"],
    expectedTime: "10 mins",
    summary: "Return an array output where output[i] is the product of all elements in arr except arr[i].",
    problemStatement: "Write a function `productExceptSelf(arr)` that returns an array `output` such that `output[i]` equals the product of all elements of `arr` except `arr[i]`. Do not use division.",
    examples: [
      { title: "Example 1", input: "[[1, 2, 3, 4]]", output: "[24, 12, 8, 6]", explanation: "24/1=24, 24/2=12, 24/3=8, 24/4=6." },
      { title: "Example 2", input: "[[-1, 1, 0, -3, 3]]", output: "[0, 0, 9, 0, 0]", explanation: "Only index 2 omits 0." }
    ],
    constraints: ["2 <= arr.length <= 10^5"],
    starterCode: "function productExceptSelf(arr) {\n  // Write your solution here\n}",
    functionName: "productExceptSelf",
    testCases: [
      { id: "tc_96_1", input: "[[1, 2, 3, 4]]", expectedOutput: "[24, 12, 8, 6]", isHidden: false },
      { id: "tc_96_2", input: "[[-1, 1, 0, -3, 3]]", expectedOutput: "[0, 0, 9, 0, 0]", isHidden: false },
      { id: "tc_96_3", input: "[[2, 3]]", expectedOutput: "[3, 2]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_96_4", input: "[[1, 1, 1]]", expectedOutput: "[1, 1, 1]", isHidden: true },
      { id: "tc_96_5", input: "[[0, 0]]", expectedOutput: "[0, 0]", isHidden: true }
    ],
    solution: "function productExceptSelf(arr) {\n  const n = arr.length;\n  const res = new Array(n).fill(1);\n  let left = 1;\n  for (let i = 0; i < n; i++) {\n    res[i] = left;\n    left *= arr[i];\n  }\n  let right = 1;\n  for (let i = n - 1; i >= 0; i--) {\n    res[i] *= right;\n    right *= arr[i];\n  }\n  return res;\n}",
    explanation: "Two passes: left prefix product pass followed by right suffix product pass in O(n) time.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Pass left-to-right computing prefix products, then right-to-left multiplying suffix products."]
  },
  {
    id: "JS-P097",
    number: 97,
    title: "Majority Element in Array (> N/2)",
    slug: "js-p097-majority-element-in-array-n-2",
    category: "Arrays",
    subcategory: "Boyer-Moore",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Boyer-Moore"],
    tags: ["arrays", "majority", "boyer-moore"],
    expectedTime: "5 mins",
    summary: "Find the majority element that appears strictly more than n/2 times.",
    problemStatement: "Write a function `majorityElement(arr)` that finds the majority element in `arr` (assumed to exist). Return the element.",
    examples: [
      { title: "Example 1", input: "[[3, 2, 3]]", output: "3", explanation: "3 appears 2 times, > 3/2." },
      { title: "Example 2", input: "[[2, 2, 1, 1, 1, 2, 2]]", output: "2", explanation: "2 appears 4 times, > 7/2." }
    ],
    constraints: ["arr.length >= 1"],
    starterCode: "function majorityElement(arr) {\n  // Write your solution here\n}",
    functionName: "majorityElement",
    testCases: [
      { id: "tc_97_1", input: "[[3, 2, 3]]", expectedOutput: "3", isHidden: false },
      { id: "tc_97_2", input: "[[2, 2, 1, 1, 1, 2, 2]]", expectedOutput: "2", isHidden: false },
      { id: "tc_97_3", input: "[[1]]", expectedOutput: "1", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_97_4", input: "[[6, 6, 6, 7, 7]]", expectedOutput: "6", isHidden: true },
      { id: "tc_97_5", input: "[[5, 1, 5, 5, 2]]", expectedOutput: "5", isHidden: true }
    ],
    solution: "function majorityElement(arr) {\n  let candidate = arr[0];\n  let count = 0;\n  for (const n of arr) {\n    if (count === 0) candidate = n;\n    count += (n === candidate) ? 1 : -1;\n  }\n  return candidate;\n}",
    explanation: "Boyer-Moore voting algorithm finds the majority element in O(n) time and O(1) space.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Use Boyer-Moore Voting Algorithm."]
  },
  {
    id: "JS-P098",
    number: 98,
    title: "Count Consecutive Identical Elements",
    slug: "js-p098-count-consecutive-identical-elements",
    category: "Arrays",
    subcategory: "Scanning",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Arrays", "Run Length"],
    tags: ["arrays", "consecutive", "pairs"],
    expectedTime: "5 mins",
    summary: "Count instances where an element is immediately equal to its adjacent predecessor.",
    problemStatement: "Write a function `consecutiveDuplicatesCount(arr)` that counts how many times `arr[i] === arr[i - 1]` for `1 <= i < arr.length`.",
    examples: [
      { title: "Example 1", input: "[[1, 1, 2, 3, 3, 3]]", output: "3", explanation: "(1, 1) once, (3, 3) twice. Total 3." },
      { title: "Example 2", input: "[[1, 2, 3]]", output: "0", explanation: "No adjacent duplicates." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function consecutiveDuplicatesCount(arr) {\n  // Write your solution here\n}",
    functionName: "consecutiveDuplicatesCount",
    testCases: [
      { id: "tc_98_1", input: "[[1, 1, 2, 3, 3, 3]]", expectedOutput: "3", isHidden: false },
      { id: "tc_98_2", input: "[[1, 2, 3]]", expectedOutput: "0", isHidden: false },
      { id: "tc_98_3", input: "[[]]", expectedOutput: "0", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_98_4", input: "[[4, 4, 4, 4]]", expectedOutput: "3", isHidden: true },
      { id: "tc_98_5", input: "[['a', 'b', 'b', 'c']]", expectedOutput: "1", isHidden: true }
    ],
    solution: "function consecutiveDuplicatesCount(arr) {\n  let count = 0;\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] === arr[i - 1]) count++;\n  }\n  return count;\n}",
    explanation: "Check each adjacent pair arr[i] === arr[i - 1].",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Check if arr[i] === arr[i - 1]."]
  },
  {
    id: "JS-P099",
    number: 99,
    title: "Find Longest Consecutive Sequence Length",
    slug: "js-p099-find-longest-consecutive-sequence-length",
    category: "Arrays",
    subcategory: "Hash Set",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Arrays", "Set"],
    tags: ["arrays", "consecutive-sequence", "set"],
    expectedTime: "10 mins",
    summary: "Find the length of the longest consecutive elements sequence in an unsorted array.",
    problemStatement: "Write a function `longestConsecutive(arr)` that returns the length of the longest consecutive elements sequence in an unsorted array in O(n) time.",
    examples: [
      { title: "Example 1", input: "[[100, 4, 200, 1, 3, 2]]", output: "4", explanation: "Sequence [1, 2, 3, 4] has length 4." },
      { title: "Example 2", input: "[[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]]", output: "9", explanation: "0 through 8 sequence has length 9." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function longestConsecutive(arr) {\n  // Write your solution here\n}",
    functionName: "longestConsecutive",
    testCases: [
      { id: "tc_99_1", input: "[[100, 4, 200, 1, 3, 2]]", expectedOutput: "4", isHidden: false },
      { id: "tc_99_2", input: "[[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]]", expectedOutput: "9", isHidden: false },
      { id: "tc_99_3", input: "[[]]", expectedOutput: "0", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_99_4", input: "[[9]]", expectedOutput: "1", isHidden: true },
      { id: "tc_99_5", input: "[[1, 2, 0, 1]]", expectedOutput: "3", isHidden: true }
    ],
    solution: "function longestConsecutive(arr) {\n  if (!arr || arr.length === 0) return 0;\n  const set = new Set(arr);\n  let maxLen = 0;\n  for (const n of set) {\n    if (!set.has(n - 1)) {\n      let curr = n;\n      let len = 1;\n      while (set.has(curr + 1)) {\n        curr++;\n        len++;\n      }\n      if (len > maxLen) maxLen = len;\n    }\n  }\n  return maxLen;\n}",
    explanation: "Store in Set, only start counting when n - 1 is absent, giving linear O(n) complexity.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Insert into Set and only start counting when n - 1 is not in the set."]
  },
  {
    id: "JS-P100",
    number: 100,
    title: "Sort Array of 0s, 1s, and 2s",
    slug: "js-p100-sort-array-of-0s-1s-and-2s",
    category: "Arrays",
    subcategory: "Dutch National Flag",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Arrays", "Dutch National Flag"],
    tags: ["arrays", "sort", "three-pointers"],
    expectedTime: "10 mins",
    summary: "Sort an array containing only 0, 1, and 2 in-place or linear time.",
    problemStatement: "Write a function `sort012(arr)` that returns a sorted array containing only numbers 0, 1, and 2 in non-decreasing order.",
    examples: [
      { title: "Example 1", input: "[[2, 0, 2, 1, 1, 0]]", output: "[0, 0, 1, 1, 2, 2]", explanation: "Sorted 0s, then 1s, then 2s." },
      { title: "Example 2", input: "[[2, 0, 1]]", output: "[0, 1, 2]", explanation: "Sorted." }
    ],
    constraints: ["0 <= arr.length <= 10^5"],
    starterCode: "function sort012(arr) {\n  // Write your solution here\n}",
    functionName: "sort012",
    testCases: [
      { id: "tc_100_1", input: "[[2, 0, 2, 1, 1, 0]]", expectedOutput: "[0, 0, 1, 1, 2, 2]", isHidden: false },
      { id: "tc_100_2", input: "[[2, 0, 1]]", expectedOutput: "[0, 1, 2]", isHidden: false },
      { id: "tc_100_3", input: "[[0]]", expectedOutput: "[0]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_100_4", input: "[[]]", expectedOutput: "[]", isHidden: true },
      { id: "tc_100_5", input: "[[1, 0, 2, 1, 0]]", expectedOutput: "[0, 0, 1, 1, 2]", isHidden: true }
    ],
    solution: "function sort012(arr) {\n  const res = [...arr];\n  let low = 0, mid = 0, high = res.length - 1;\n  while (mid <= high) {\n    if (res[mid] === 0) {\n      [res[low], res[mid]] = [res[mid], res[low]];\n      low++;\n      mid++;\n    } else if (res[mid] === 1) {\n      mid++;\n    } else {\n      [res[mid], res[high]] = [res[high], res[mid]];\n      high--;\n    }\n  }\n  return res;\n}",
    explanation: "Dutch National Flag three-pointer algorithm partitions 0, 1, 2 in O(n) time.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use Dutch National Flag algorithm with three pointers: low, mid, high."]
  }
];

export async function buildAndTestBatch02() {
  console.log('Testing Batch 02 (50 questions)...');
  const passed = await testBatch(b02);
  if (!passed) {
    throw new Error('Batch 02 verification failed!');
  }
  const targetFile = path.resolve('src/components/coreprogramming/data/batches/batch02.ts');
  const fileContent = `// src/components/coreprogramming/data/batches/batch02.ts\nimport type { CoreProgrammingQuestion } from '../coreProgrammingTypes';\n\nexport const coreProgrammingBatch2: CoreProgrammingQuestion[] = ${JSON.stringify(b02, null, 2)};\n`;
  fs.writeFileSync(targetFile, fileContent, 'utf-8');
  console.log(`Successfully wrote ${b02.length} verified questions to batch02.ts!`);
}

buildAndTestBatch02();
