// scripts/buildBatch03.ts
import * as fs from 'fs';
import * as path from 'path';
import type { CoreProgrammingQuestion } from '../src/components/coreprogramming/data/coreProgrammingTypes';
import { testBatch } from './verifyCoreBatch';

const b03: CoreProgrammingQuestion[] = [
  {
    id: "JS-P101",
    number: 101,
    title: "Find First Non-Repeating Character in String",
    slug: "js-p101-find-first-non-repeating-character-in-string",
    category: "Strings",
    subcategory: "Character Frequency",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Hash Map"],
    tags: ["strings", "frequency", "search"],
    expectedTime: "5 mins",
    summary: "Return the first character that appears only once in the string.",
    problemStatement: "Write a function `firstNonRepeatingChar(str)` that returns the first character in `str` with a frequency of 1. If none exists, return `null`.",
    examples: [
      { title: "Example 1", input: "['swiss']", output: "'w'", explanation: "'s' repeats, 'w' is first non-repeating." },
      { title: "Example 2", input: "['aabbcc']", output: "null", explanation: "All characters repeat." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function firstNonRepeatingChar(str) {\n  // Write your solution here\n}",
    functionName: "firstNonRepeatingChar",
    testCases: [
      { id: "tc_101_1", input: "['swiss']", expectedOutput: "'w'", isHidden: false },
      { id: "tc_101_2", input: "['aabbcc']", expectedOutput: "null", isHidden: false },
      { id: "tc_101_3", input: "['leetcode']", expectedOutput: "'l'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_101_4", input: "['']", expectedOutput: "null", isHidden: true },
      { id: "tc_101_5", input: "['loveleetcode']", expectedOutput: "'v'", isHidden: true }
    ],
    solution: "function firstNonRepeatingChar(str) {\n  const count = {};\n  for (const c of str) count[c] = (count[c] || 0) + 1;\n  for (const c of str) {\n    if (count[c] === 1) return c;\n  }\n  return null;\n}",
    explanation: "Two passes: count frequencies in an object, then find first character with count 1.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Count characters first with an object, then iterate the string to find the first with frequency 1."]
  },
  {
    id: "JS-P102",
    number: 102,
    title: "Find First Repeating Character in String",
    slug: "js-p102-find-first-repeating-character-in-string",
    category: "Strings",
    subcategory: "Character Frequency",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Set"],
    tags: ["strings", "repeating", "set"],
    expectedTime: "5 mins",
    summary: "Return the first character that occurs a second time while scanning left to right.",
    problemStatement: "Write a function `firstRepeatingChar(str)` that returns the first character to appear twice. If no duplicate exists, return `null`.",
    examples: [
      { title: "Example 1", input: "['abca']", output: "'a'", explanation: "'a' repeats at index 3." },
      { title: "Example 2", input: "['abcdef']", output: "null", explanation: "All distinct." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function firstRepeatingChar(str) {\n  // Write your solution here\n}",
    functionName: "firstRepeatingChar",
    testCases: [
      { id: "tc_102_1", input: "['abca']", expectedOutput: "'a'", isHidden: false },
      { id: "tc_102_2", input: "['abcdef']", expectedOutput: "null", isHidden: false },
      { id: "tc_102_3", input: "['hello']", expectedOutput: "'l'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_102_4", input: "['']", expectedOutput: "null", isHidden: true },
      { id: "tc_102_5", input: "['aba']", expectedOutput: "'a'", isHidden: true }
    ],
    solution: "function firstRepeatingChar(str) {\n  const seen = new Set();\n  for (const c of str) {\n    if (seen.has(c)) return c;\n    seen.add(c);\n  }\n  return null;\n}",
    explanation: "Scan with a Set; return character immediately when seen.has(c).",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Use a Set to track seen characters."]
  },
  {
    id: "JS-P103",
    number: 103,
    title: "Find the Longest Word in a Sentence",
    slug: "js-p103-find-the-longest-word-in-a-sentence",
    category: "Strings",
    subcategory: "Word Operations",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Slicing"],
    tags: ["strings", "words", "longest"],
    expectedTime: "5 mins",
    summary: "Return the longest word in a space-delimited sentence.",
    problemStatement: "Write a function `findLongestWord(str)` that returns the longest word in `str`. If tied, return the first longest word. If empty, return `''`.",
    examples: [
      { title: "Example 1", input: "['The quick brown fox jumped over the lazy dog']", output: "'jumped'", explanation: "'jumped' has length 6." },
      { title: "Example 2", input: "['May the force be with you']", output: "'force'", explanation: "'force' has length 5." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function findLongestWord(str) {\n  // Write your solution here\n}",
    functionName: "findLongestWord",
    testCases: [
      { id: "tc_103_1", input: "['The quick brown fox jumped over the lazy dog']", expectedOutput: "'jumped'", isHidden: false },
      { id: "tc_103_2", input: "['May the force be with you']", expectedOutput: "'force'", isHidden: false },
      { id: "tc_103_3", input: "['']", expectedOutput: "''", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_103_4", input: "['a bb ccc dddd']", expectedOutput: "'dddd'", isHidden: true },
      { id: "tc_103_5", input: "['one two']", expectedOutput: "'one'", isHidden: true }
    ],
    solution: "function findLongestWord(str) {\n  const words = str.trim().split(/\\s+/);\n  if (!words || words[0] === '') return '';\n  let best = words[0];\n  for (let i = 1; i < words.length; i++) {\n    if (words[i].length > best.length) best = words[i];\n  }\n  return best;\n}",
    explanation: "Split on whitespace and track word with maximum length.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Split by whitespace, then iterate tracking the longest string."]
  },
  {
    id: "JS-P104",
    number: 104,
    title: "Find the Shortest Word in a Sentence",
    slug: "js-p104-find-the-shortest-word-in-a-sentence",
    category: "Strings",
    subcategory: "Word Operations",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Words"],
    tags: ["strings", "words", "shortest"],
    expectedTime: "5 mins",
    summary: "Return the shortest word in a sentence.",
    problemStatement: "Write a function `findShortestWord(str)` that returns the shortest non-empty word in `str`. If tied, return the first.",
    examples: [
      { title: "Example 1", input: "['I love programming in JavaScript']", output: "'I'", explanation: "'I' has length 1." },
      { title: "Example 2", input: "['hello world']", output: "'hello'", explanation: "Tied length 5, returns first." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function findShortestWord(str) {\n  // Write your solution here\n}",
    functionName: "findShortestWord",
    testCases: [
      { id: "tc_104_1", input: "['I love programming in JavaScript']", expectedOutput: "'I'", isHidden: false },
      { id: "tc_104_2", input: "['hello world']", expectedOutput: "'hello'", isHidden: false },
      { id: "tc_104_3", input: "['']", expectedOutput: "''", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_104_4", input: "['abc de f']", expectedOutput: "'f'", isHidden: true },
      { id: "tc_104_5", input: "['word']", expectedOutput: "'word'", isHidden: true }
    ],
    solution: "function findShortestWord(str) {\n  const words = str.trim().split(/\\s+/);\n  if (!words || words[0] === '') return '';\n  let best = words[0];\n  for (let i = 1; i < words.length; i++) {\n    if (words[i].length < best.length) best = words[i];\n  }\n  return best;\n}",
    explanation: "Split and compare lengths tracking the minimum word.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Split into words, track the shortest length."]
  },
  {
    id: "JS-P105",
    number: 105,
    title: "Reverse Each Word in a Sentence",
    slug: "js-p105-reverse-each-word-in-a-sentence",
    category: "Strings",
    subcategory: "Word Operations",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Reversal"],
    tags: ["strings", "reverse", "words"],
    expectedTime: "5 mins",
    summary: "Reverse each individual word in a sentence while preserving word order.",
    problemStatement: "Write a function `reverseEachWord(str)` that reverses the characters of each word in `str`, keeping the original word sequence intact.",
    examples: [
      { title: "Example 1", input: "['hello world']", output: "'olleh dlrow'", explanation: "Each word reversed." },
      { title: "Example 2", input: "['JavaScript is awesome']", output: "'tpircSavaJ si emosewa'", explanation: "Words reversed in place." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function reverseEachWord(str) {\n  // Write your solution here\n}",
    functionName: "reverseEachWord",
    testCases: [
      { id: "tc_105_1", input: "['hello world']", expectedOutput: "'olleh dlrow'", isHidden: false },
      { id: "tc_105_2", input: "['JavaScript is awesome']", expectedOutput: "'tpircSavaJ si emosewa'", isHidden: false },
      { id: "tc_105_3", input: "['']", expectedOutput: "''", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_105_4", input: "['a b c']", expectedOutput: "'a b c'", isHidden: true },
      { id: "tc_105_5", input: "['racecar']", expectedOutput: "'racecar'", isHidden: true }
    ],
    solution: "function reverseEachWord(str) {\n  return str.split(' ').map(w => w.split('').reverse().join('')).join(' ');\n}",
    explanation: "Split words by space, map reversing each word, and join with spaces.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Split by space ' ', reverse each word's characters, join back with ' '."]
  },
  {
    id: "JS-P106",
    number: 106,
    title: "Check if String is a Rotation of Another String",
    slug: "js-p106-check-if-string-is-a-rotation-of-another-string",
    category: "Strings",
    subcategory: "Rotation",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Rotation"],
    tags: ["strings", "rotation", "search"],
    expectedTime: "5 mins",
    summary: "Determine if s2 is a cyclic rotation of s1.",
    problemStatement: "Write a function `isStringRotation(s1, s2)` that returns `true` if `s2` can be formed by rotating `s1` by some number of positions, and `false` otherwise.",
    examples: [
      { title: "Example 1", input: "['waterbottle', 'erbottlewat']", output: "true", explanation: "'erbottlewat' is rotation of 'waterbottle'." },
      { title: "Example 2", input: "['hello', 'world']", output: "false", explanation: "Different strings." }
    ],
    constraints: ["0 <= s1.length, s2.length <= 10^5"],
    starterCode: "function isStringRotation(s1, s2) {\n  // Write your solution here\n}",
    functionName: "isStringRotation",
    testCases: [
      { id: "tc_106_1", input: "['waterbottle', 'erbottlewat']", expectedOutput: "true", isHidden: false },
      { id: "tc_106_2", input: "['hello', 'world']", expectedOutput: "false", isHidden: false },
      { id: "tc_106_3", input: "['abc', 'bca']", expectedOutput: "true", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_106_4", input: "['', '']", expectedOutput: "true", isHidden: true },
      { id: "tc_106_5", input: "['a', 'b']", expectedOutput: "false", isHidden: true }
    ],
    solution: "function isStringRotation(s1, s2) {\n  if (s1.length !== s2.length) return false;\n  if (s1 === '' && s2 === '') return true;\n  return (s1 + s1).includes(s2);\n}",
    explanation: "s2 is a rotation of s1 if and only if s1.length === s2.length and (s1 + s1) contains s2.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Check if s1.length === s2.length && (s1 + s1).includes(s2)."]
  },
  {
    id: "JS-P107",
    number: 107,
    title: "Run-Length String Compression",
    slug: "js-p107-run-length-string-compression",
    category: "Strings",
    subcategory: "Compression",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Compression"],
    tags: ["strings", "compression", "rle"],
    expectedTime: "5 mins",
    summary: "Compress repeated consecutive characters into char+count (e.g. aabccc -> a2b1c3).",
    problemStatement: "Write a function `compressString(str)` that performs run-length encoding. For example `'aabccc'` becomes `'a2b1c3'`.",
    examples: [
      { title: "Example 1", input: "['aabccc']", output: "'a2b1c3'", explanation: "2 a's, 1 b, 3 c's." },
      { title: "Example 2", input: "['']", output: "''", explanation: "Empty string." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function compressString(str) {\n  // Write your solution here\n}",
    functionName: "compressString",
    testCases: [
      { id: "tc_107_1", input: "['aabccc']", expectedOutput: "'a2b1c3'", isHidden: false },
      { id: "tc_107_2", input: "['']", expectedOutput: "''", isHidden: false },
      { id: "tc_107_3", input: "['a']", expectedOutput: "'a1'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_107_4", input: "['aaaaa']", expectedOutput: "'a5'", isHidden: true },
      { id: "tc_107_5", input: "['abc']", expectedOutput: "'a1b1c1'", isHidden: true }
    ],
    solution: "function compressString(str) {\n  if (!str) return '';\n  let res = '';\n  let count = 1;\n  for (let i = 0; i < str.length; i++) {\n    if (str[i] === str[i + 1]) {\n      count++;\n    } else {\n      res += str[i] + count;\n      count = 1;\n    }\n  }\n  return res;\n}",
    explanation: "Iterate tracking consecutive repetitions.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Iterate through characters counting identical adjacent letters."]
  },
  {
    id: "JS-P108",
    number: 108,
    title: "Decompress Run-Length Encoded String",
    slug: "js-p108-decompress-run-length-encoded-string",
    category: "Strings",
    subcategory: "Compression",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Regex"],
    tags: ["strings", "decompress", "rle"],
    expectedTime: "5 mins",
    summary: "Decompress a run-length encoded string (e.g. a2b1c3 -> aabccc).",
    problemStatement: "Write a function `decompressString(str)` that unpacks run-length string `'a2b1c3'` into `'aabccc'`.",
    examples: [
      { title: "Example 1", input: "['a2b1c3']", output: "'aabccc'", explanation: "2 a's, 1 b, 3 c's." },
      { title: "Example 2", input: "['x4']", output: "'xxxx'", explanation: "4 x's." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function decompressString(str) {\n  // Write your solution here\n}",
    functionName: "decompressString",
    testCases: [
      { id: "tc_108_1", input: "['a2b1c3']", expectedOutput: "'aabccc'", isHidden: false },
      { id: "tc_108_2", input: "['x4']", expectedOutput: "'xxxx'", isHidden: false },
      { id: "tc_108_3", input: "['']", expectedOutput: "''", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_108_4", input: "['a1b2a1']", expectedOutput: "'abba'", isHidden: true },
      { id: "tc_108_5", input: "['z10']", expectedOutput: "'zzzzzzzzzz'", isHidden: true }
    ],
    solution: "function decompressString(str) {\n  if (!str) return '';\n  return str.replace(/([a-zA-Z])(\\d+)/g, (_, char, count) => char.repeat(parseInt(count, 10)));\n}",
    explanation: "Match character followed by digits and repeat character by parsed count.",
    timeComplexity: "O(output length)",
    spaceComplexity: "O(output length)",
    hints: ["Use regex replace: /([a-zA-Z])(\\d+)/g."]
  },
  {
    id: "JS-P109",
    number: 109,
    title: "Count Occurrences of Substring in String",
    slug: "js-p109-count-occurrences-of-substring-in-string",
    category: "Strings",
    subcategory: "Search",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Search"],
    tags: ["strings", "substring", "count"],
    expectedTime: "5 mins",
    summary: "Count non-overlapping occurrences of a substring.",
    problemStatement: "Write a function `countSubstring(str, sub)` that returns the number of non-overlapping occurrences of `sub` in `str`. Return 0 if `sub` is empty.",
    examples: [
      { title: "Example 1", input: "['banana', 'an']", output: "2", explanation: "'an' appears at index 1 and index 3." },
      { title: "Example 2", input: "['aaaa', 'aa']", output: "2", explanation: "Two non-overlapping 'aa' pairs." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function countSubstring(str, sub) {\n  // Write your solution here\n}",
    functionName: "countSubstring",
    testCases: [
      { id: "tc_109_1", input: "['banana', 'an']", expectedOutput: "2", isHidden: false },
      { id: "tc_109_2", input: "['aaaa', 'aa']", expectedOutput: "2", isHidden: false },
      { id: "tc_109_3", input: "['hello', 'xyz']", expectedOutput: "0", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_109_4", input: "['hello', '']", expectedOutput: "0", isHidden: true },
      { id: "tc_109_5", input: "['abcabcabc', 'abc']", expectedOutput: "3", isHidden: true }
    ],
    solution: "function countSubstring(str, sub) {\n  if (!sub || sub.length === 0) return 0;\n  let count = 0;\n  let pos = 0;\n  while ((pos = str.indexOf(sub, pos)) !== -1) {\n    count++;\n    pos += sub.length;\n  }\n  return count;\n}",
    explanation: "Use indexOf in a loop advancing pos by sub.length.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Use str.indexOf(sub, pos) in a while loop."]
  },
  {
    id: "JS-P110",
    number: 110,
    title: "Validate Simple Balanced Parentheses ()",
    slug: "js-p110-validate-simple-balanced-parentheses",
    category: "Strings",
    subcategory: "Stack",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Parentheses"],
    tags: ["strings", "parentheses", "validation"],
    expectedTime: "5 mins",
    summary: "Determine if parentheses '()' in a string are properly closed and ordered.",
    problemStatement: "Write a function `isValidSimpleParentheses(str)` that checks whether all parentheses `(` and `)` are properly matched and balanced.",
    examples: [
      { title: "Example 1", input: "['(())']", output: "true", explanation: "Balanced." },
      { title: "Example 2", input: "['())(']", output: "false", explanation: "Unmatched closing parenthesis." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function isValidSimpleParentheses(str) {\n  // Write your solution here\n}",
    functionName: "isValidSimpleParentheses",
    testCases: [
      { id: "tc_110_1", input: "['(())']", expectedOutput: "true", isHidden: false },
      { id: "tc_110_2", input: "['())(']", expectedOutput: "false", isHidden: false },
      { id: "tc_110_3", input: "['']", expectedOutput: "true", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_110_4", input: "['(']", expectedOutput: "false", isHidden: true },
      { id: "tc_110_5", input: "['()()()']", expectedOutput: "true", isHidden: true }
    ],
    solution: "function isValidSimpleParentheses(str) {\n  let balance = 0;\n  for (const c of str) {\n    if (c === '(') balance++;\n    else if (c === ')') {\n      balance--;\n      if (balance < 0) return false;\n    }\n  }\n  return balance === 0;\n}",
    explanation: "Track balance counter; if it drops below 0 return false immediately.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Use a counter: increment for '(', decrement for ')'. Check counter >= 0 at all times."]
  },
  {
    id: "JS-P111",
    number: 111,
    title: "Remove All Punctuation from String",
    slug: "js-p111-remove-all-punctuation-from-string",
    category: "Strings",
    subcategory: "Text Cleaning",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Regex"],
    tags: ["strings", "punctuation", "clean"],
    expectedTime: "5 mins",
    summary: "Strip out punctuation characters, leaving letters, numbers, and whitespace.",
    problemStatement: "Write a function `removePunctuation(str)` that strips all standard punctuation marks (`.,!?:;\"'()-[]{}`) from `str`.",
    examples: [
      { title: "Example 1", input: "['Hello, world! How are you?']", output: "'Hello world How are you'", explanation: "Punctuation removed." },
      { title: "Example 2", input: "['Code: 100% (done).']", output: "'Code 100% done'", explanation: ":, (, ), . removed." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function removePunctuation(str) {\n  // Write your solution here\n}",
    functionName: "removePunctuation",
    testCases: [
      { id: "tc_111_1", input: "['Hello, world! How are you?']", expectedOutput: "'Hello world How are you'", isHidden: false },
      { id: "tc_111_2", input: "['Code: (done).']", expectedOutput: "'Code done'", isHidden: false },
      { id: "tc_111_3", input: "['no punctuation']", expectedOutput: "'no punctuation'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_111_4", input: "['']", expectedOutput: "''", isHidden: true },
      { id: "tc_111_5", input: "['!.,?:;\"']", expectedOutput: "''", isHidden: true }
    ],
    solution: "function removePunctuation(str) {\n  return str.replace(/[.,!?:;\"'()\\-\\[\\]{}]/g, '');\n}",
    explanation: "Use regex character class matching punctuation marks.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use str.replace(/[.,!?:;\"'()\\-\\[\\]{}]/g, '')."]
  },
  {
    id: "JS-P112",
    number: 112,
    title: "Slugify a String for URL",
    slug: "js-p112-slugify-a-string-for-url",
    category: "Strings",
    subcategory: "URL Utilities",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Regex"],
    tags: ["strings", "slug", "url"],
    expectedTime: "5 mins",
    summary: "Convert a human-readable title into a lowercase, hyphenated URL slug.",
    problemStatement: "Write a function `slugify(str)` that lowercases `str`, replaces spaces and non-alphanumeric characters with single hyphens, and trims leading/trailing hyphens.",
    examples: [
      { title: "Example 1", input: "['Hello World!']", output: "'hello-world'", explanation: "Lowercased and hyphenated." },
      { title: "Example 2", input: "['  React & Vue 2024  ']", output: "'react-vue-2024'", explanation: "& and extra spaces converted." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function slugify(str) {\n  // Write your solution here\n}",
    functionName: "slugify",
    testCases: [
      { id: "tc_112_1", input: "['Hello World!']", expectedOutput: "'hello-world'", isHidden: false },
      { id: "tc_112_2", input: "['  React & Vue 2024  ']", expectedOutput: "'react-vue-2024'", isHidden: false },
      { id: "tc_112_3", input: "['JavaScript---Basics']", expectedOutput: "'javascript-basics'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_112_4", input: "['']", expectedOutput: "''", isHidden: true },
      { id: "tc_112_5", input: "['---abc---']", expectedOutput: "'abc'", isHidden: true }
    ],
    solution: "function slugify(str) {\n  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');\n}",
    explanation: "Lowercase, replace non-alphanumeric sequences with hyphens, and trim boundary hyphens.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["toLowerCase(), replace(/[^a-z0-9]+/g, '-'), and trim hyphens."]
  },
  {
    id: "JS-P113",
    number: 113,
    title: "Convert CamelCase to kebab-case",
    slug: "js-p113-convert-camelcase-to-kebab-case",
    category: "Strings",
    subcategory: "Case Conversion",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Regex"],
    tags: ["strings", "kebab-case", "camelCase"],
    expectedTime: "5 mins",
    summary: "Convert a camelCase identifier to kebab-case.",
    problemStatement: "Write a function `camelToKebab(str)` that converts `str` from camelCase to kebab-case.",
    examples: [
      { title: "Example 1", input: "['backgroundColor']", output: "'background-color'", explanation: "Converted." },
      { title: "Example 2", input: "['fontSize']", output: "'font-size'", explanation: "Converted." }
    ],
    constraints: ["0 <= str.length <= 1000"],
    starterCode: "function camelToKebab(str) {\n  // Write your solution here\n}",
    functionName: "camelToKebab",
    testCases: [
      { id: "tc_113_1", input: "['backgroundColor']", expectedOutput: "'background-color'", isHidden: false },
      { id: "tc_113_2", input: "['fontSize']", expectedOutput: "'font-size'", isHidden: false },
      { id: "tc_113_3", input: "['borderTopLeftRadius']", expectedOutput: "'border-top-left-radius'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_113_4", input: "['color']", expectedOutput: "'color'", isHidden: true },
      { id: "tc_113_5", input: "['']", expectedOutput: "''", isHidden: true }
    ],
    solution: "function camelToKebab(str) {\n  return str.replace(/([A-Z])/g, '-$1').toLowerCase();\n}",
    explanation: "Prefix uppercase letters with a hyphen and lowercase the string.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use str.replace(/([A-Z])/g, '-$1').toLowerCase()."]
  },
  {
    id: "JS-P114",
    number: 114,
    title: "Convert kebab-case to camelCase",
    slug: "js-p114-convert-kebab-case-to-camelcase",
    category: "Strings",
    subcategory: "Case Conversion",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Regex"],
    tags: ["strings", "camelCase", "kebab-case"],
    expectedTime: "5 mins",
    summary: "Convert a kebab-case identifier to camelCase.",
    problemStatement: "Write a function `kebabToCamel(str)` that converts `str` from kebab-case to camelCase.",
    examples: [
      { title: "Example 1", input: "['background-color']", output: "'backgroundColor'", explanation: "Converted." },
      { title: "Example 2", input: "['font-size']", output: "'fontSize'", explanation: "Converted." }
    ],
    constraints: ["0 <= str.length <= 1000"],
    starterCode: "function kebabToCamel(str) {\n  // Write your solution here\n}",
    functionName: "kebabToCamel",
    testCases: [
      { id: "tc_114_1", input: "['background-color']", expectedOutput: "'backgroundColor'", isHidden: false },
      { id: "tc_114_2", input: "['font-size']", expectedOutput: "'fontSize'", isHidden: false },
      { id: "tc_114_3", input: "['border-top-left-radius']", expectedOutput: "'borderTopLeftRadius'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_114_4", input: "['color']", expectedOutput: "'color'", isHidden: true },
      { id: "tc_114_5", input: "['']", expectedOutput: "''", isHidden: true }
    ],
    solution: "function kebabToCamel(str) {\n  return str.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());\n}",
    explanation: "Match hyphen followed by char and replace with uppercase char.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use str.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase())."]
  },
  {
    id: "JS-P115",
    number: 115,
    title: "Convert snake_case to camelCase",
    slug: "js-p115-convert-snake-case-to-camelcase",
    category: "Strings",
    subcategory: "Case Conversion",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Regex"],
    tags: ["strings", "snake_case", "camelCase"],
    expectedTime: "5 mins",
    summary: "Convert snake_case identifier to camelCase.",
    problemStatement: "Write a function `snakeToCamel(str)` that converts snake_case identifier to camelCase.",
    examples: [
      { title: "Example 1", input: "['user_first_name']", output: "'userFirstName'", explanation: "Converted." },
      { title: "Example 2", input: "['is_active']", output: "'isActive'", explanation: "Converted." }
    ],
    constraints: ["0 <= str.length <= 1000"],
    starterCode: "function snakeToCamel(str) {\n  // Write your solution here\n}",
    functionName: "snakeToCamel",
    testCases: [
      { id: "tc_115_1", input: "['user_first_name']", expectedOutput: "'userFirstName'", isHidden: false },
      { id: "tc_115_2", input: "['is_active']", expectedOutput: "'isActive'", isHidden: false },
      { id: "tc_115_3", input: "['created_at_date']", expectedOutput: "'createdAtDate'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_115_4", input: "['id']", expectedOutput: "'id'", isHidden: true },
      { id: "tc_115_5", input: "['']", expectedOutput: "''", isHidden: true }
    ],
    solution: "function snakeToCamel(str) {\n  return str.replace(/_([a-z0-9])/g, (_, char) => char.toUpperCase());\n}",
    explanation: "Match underscore followed by character and uppercase it.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use str.replace(/_([a-z0-9])/g, (_, char) => char.toUpperCase())."]
  },
  {
    id: "JS-P116",
    number: 116,
    title: "Convert camelCase to snake_case",
    slug: "js-p116-convert-camelcase-to-snake-case",
    category: "Strings",
    subcategory: "Case Conversion",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Regex"],
    tags: ["strings", "camelCase", "snake_case"],
    expectedTime: "5 mins",
    summary: "Convert camelCase identifier to snake_case.",
    problemStatement: "Write a function `camelToSnake(str)` that converts camelCase to snake_case.",
    examples: [
      { title: "Example 1", input: "['userFirstName']", output: "'user_first_name'", explanation: "Converted." },
      { title: "Example 2", input: "['isActive']", output: "'is_active'", explanation: "Converted." }
    ],
    constraints: ["0 <= str.length <= 1000"],
    starterCode: "function camelToSnake(str) {\n  // Write your solution here\n}",
    functionName: "camelToSnake",
    testCases: [
      { id: "tc_116_1", input: "['userFirstName']", expectedOutput: "'user_first_name'", isHidden: false },
      { id: "tc_116_2", input: "['isActive']", expectedOutput: "'is_active'", isHidden: false },
      { id: "tc_116_3", input: "['createdAtDate']", expectedOutput: "'created_at_date'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_116_4", input: "['id']", expectedOutput: "'id'", isHidden: true },
      { id: "tc_116_5", input: "['']", expectedOutput: "''", isHidden: true }
    ],
    solution: "function camelToSnake(str) {\n  return str.replace(/([A-Z])/g, '_$1').toLowerCase();\n}",
    explanation: "Prefix uppercase letters with an underscore and convert to lowercase.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use str.replace(/([A-Z])/g, '_$1').toLowerCase()."]
  },
  {
    id: "JS-P117",
    number: 117,
    title: "Mask Credit Card Number",
    slug: "js-p117-mask-credit-card-number",
    category: "Strings",
    subcategory: "Masking",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Masking"],
    tags: ["strings", "mask", "security"],
    expectedTime: "5 mins",
    summary: "Mask all digits of a credit card string except the last 4 with '#'.",
    problemStatement: "Write a function `maskCreditCard(cc)` that masks all characters of `cc` with `'#'` except the last 4 characters. If `cc.length <= 4`, return `cc` unchanged.",
    examples: [
      { title: "Example 1", input: "['1234567812345678']", output: "'############5678'", explanation: "12 digits masked, last 4 visible." },
      { title: "Example 2", input: "['1234']", output: "'1234'", explanation: "Length <= 4 unchanged." }
    ],
    constraints: ["0 <= cc.length <= 50"],
    starterCode: "function maskCreditCard(cc) {\n  // Write your solution here\n}",
    functionName: "maskCreditCard",
    testCases: [
      { id: "tc_117_1", input: "['1234567812345678']", expectedOutput: "'############5678'", isHidden: false },
      { id: "tc_117_2", input: "['1234']", expectedOutput: "'1234'", isHidden: false },
      { id: "tc_117_3", input: "['43210']", expectedOutput: "'#3210'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_117_4", input: "['']", expectedOutput: "''", isHidden: true },
      { id: "tc_117_5", input: "['99']", expectedOutput: "'99'", isHidden: true }
    ],
    solution: "function maskCreditCard(cc) {\n  if (cc.length <= 4) return cc;\n  return '#'.repeat(cc.length - 4) + cc.slice(-4);\n}",
    explanation: "Repeat '#' for cc.length - 4 and concatenate cc.slice(-4).",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use '#'.repeat(cc.length - 4) + cc.slice(-4)."]
  },
  {
    id: "JS-P118",
    number: 118,
    title: "Format Number with Thousand Separator Commas",
    slug: "js-p118-format-number-with-thousand-separator-commas",
    category: "Strings",
    subcategory: "Formatting",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Regex"],
    tags: ["numbers", "format", "commas"],
    expectedTime: "5 mins",
    summary: "Insert commas as thousands separators into an integer string.",
    problemStatement: "Write a function `formatNumberCommas(n)` that formats non-negative integer `n` with commas every 3 digits from the right.",
    examples: [
      { title: "Example 1", input: "[1000000]", output: "'1,000,000'", explanation: "Formatted with commas." },
      { title: "Example 2", input: "[12345]", output: "'12,345'", explanation: "Formatted." }
    ],
    constraints: ["0 <= n <= 10^15"],
    starterCode: "function formatNumberCommas(n) {\n  // Write your solution here\n}",
    functionName: "formatNumberCommas",
    testCases: [
      { id: "tc_118_1", input: "[1000000]", expectedOutput: "'1,000,000'", isHidden: false },
      { id: "tc_118_2", input: "[12345]", expectedOutput: "'12,345'", isHidden: false },
      { id: "tc_118_3", input: "[100]", expectedOutput: "'100'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_118_4", input: "[0]", expectedOutput: "'0'", isHidden: true },
      { id: "tc_118_5", input: "[9876543210]", expectedOutput: "'9,876,543,210'", isHidden: true }
    ],
    solution: "function formatNumberCommas(n) {\n  return n.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');\n}",
    explanation: "Regex with positive lookahead matches non-word-boundary points followed by multiples of 3 digits.",
    timeComplexity: "O(log10(n))",
    spaceComplexity: "O(log10(n))",
    hints: ["Use n.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')."]
  },
  {
    id: "JS-P119",
    number: 119,
    title: "Extract All Digits from a String",
    slug: "js-p119-extract-all-digits-from-a-string",
    category: "Strings",
    subcategory: "Extraction",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Regex"],
    tags: ["strings", "digits", "regex"],
    expectedTime: "5 mins",
    summary: "Extract and concatenate all digit characters into a string.",
    problemStatement: "Write a function `extractDigits(str)` that extracts all digit characters `'0'`-`'9'` from `str` and returns them as a single concatenated string. If no digits exist, return `''`.",
    examples: [
      { title: "Example 1", input: "['Order #12345 placed on 2024-01-15']", output: "'1234520240115'", explanation: "All digits concatenated." },
      { title: "Example 2", input: "['abc']", output: "''", explanation: "No digits." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function extractDigits(str) {\n  // Write your solution here\n}",
    functionName: "extractDigits",
    testCases: [
      { id: "tc_119_1", input: "['Order #12345 placed on 2024-01-15']", expectedOutput: "'1234520240115'", isHidden: false },
      { id: "tc_119_2", input: "['abc']", expectedOutput: "''", isHidden: false },
      { id: "tc_119_3", input: "['42']", expectedOutput: "'42'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_119_4", input: "['']", expectedOutput: "''", isHidden: true },
      { id: "tc_119_5", input: "['(555) 123-4567']", expectedOutput: "'5551234567'", isHidden: true }
    ],
    solution: "function extractDigits(str) {\n  const matches = str.match(/\\d/g);\n  return matches ? matches.join('') : '';\n}",
    explanation: "Match all \\d characters globally and join them.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use str.match(/\\d/g) or filter characters."]
  },
  {
    id: "JS-P120",
    number: 120,
    title: "Caesar Cipher Shift by K Positions",
    slug: "js-p120-caesar-cipher-shift-by-k-positions",
    category: "Strings",
    subcategory: "Cryptography",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "CharCode"],
    tags: ["strings", "cipher", "modulo"],
    expectedTime: "5 mins",
    summary: "Encrypt a string by shifting alphabetic characters by K positions.",
    problemStatement: "Write a function `caesarCipher(str, shift)` that shifts each letter in `str` forward in the alphabet by `shift` positions. Preserve case; non-alphabetic characters remain untouched.",
    examples: [
      { title: "Example 1", input: "['abc', 2]", output: "'cde'", explanation: "'a'->'c', 'b'->'d', 'c'->'e'." },
      { title: "Example 2", input: "['Hello, World!', 3]", output: "'Khoor, Zruog!'", explanation: "Letters shifted, punctuation unchanged." }
    ],
    constraints: ["0 <= str.length <= 10^5", "shift >= 0"],
    starterCode: "function caesarCipher(str, shift) {\n  // Write your solution here\n}",
    functionName: "caesarCipher",
    testCases: [
      { id: "tc_120_1", input: "['abc', 2]", expectedOutput: "'cde'", isHidden: false },
      { id: "tc_120_2", input: "['Hello, World!', 3]", expectedOutput: "'Khoor, Zruog!'", isHidden: false },
      { id: "tc_120_3", input: "['xyz', 3]", expectedOutput: "'abc'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_120_4", input: "['', 5]", expectedOutput: "''", isHidden: true },
      { id: "tc_120_5", input: "['abc', 26]", expectedOutput: "'abc'", isHidden: true }
    ],
    solution: "function caesarCipher(str, shift) {\n  const s = shift % 26;\n  return str.split('').map(c => {\n    const code = c.charCodeAt(0);\n    if (code >= 65 && code <= 90) {\n      return String.fromCharCode(((code - 65 + s) % 26) + 65);\n    }\n    if (code >= 97 && code <= 122) {\n      return String.fromCharCode(((code - 97 + s) % 26) + 97);\n    }\n    return c;\n  }).join('');\n}",
    explanation: "Shift uppercase and lowercase codes independently modulo 26.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use charCodeAt, subtract base (65 for uppercase, 97 for lowercase), add shift % 26, modulo 26, then restore base."]
  },
  {
    id: "JS-P121",
    number: 121,
    title: "Check if String is a Pangram",
    slug: "js-p121-check-if-string-is-a-pangram",
    category: "Strings",
    subcategory: "Alphabet",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Set"],
    tags: ["strings", "pangram", "alphabet"],
    expectedTime: "5 mins",
    summary: "Determine if a string contains every letter of the English alphabet at least once.",
    problemStatement: "Write a function `isPangram(str)` that returns `true` if `str` contains every English alphabet letter from 'a' to 'z' (case-insensitive), otherwise `false`.",
    examples: [
      { title: "Example 1", input: "['The quick brown fox jumps over the lazy dog']", output: "true", explanation: "Contains all 26 letters." },
      { title: "Example 2", input: "['Hello world']", output: "false", explanation: "Missing many letters." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function isPangram(str) {\n  // Write your solution here\n}",
    functionName: "isPangram",
    testCases: [
      { id: "tc_121_1", input: "['The quick brown fox jumps over the lazy dog']", expectedOutput: "true", isHidden: false },
      { id: "tc_121_2", input: "['Hello world']", expectedOutput: "false", isHidden: false },
      { id: "tc_121_3", input: "['']", expectedOutput: "false", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_121_4", input: "['abcdefghijklmnopqrstuvwxyz']", expectedOutput: "true", isHidden: true },
      { id: "tc_121_5", input: "['abcdefghijklmnopqrstuvwxy']", expectedOutput: "false", isHidden: true }
    ],
    solution: "function isPangram(str) {\n  const letters = new Set();\n  for (const c of str.toLowerCase()) {\n    if (c >= 'a' && c <= 'z') letters.add(c);\n  }\n  return letters.size === 26;\n}",
    explanation: "Collect unique letters in a Set and verify size === 26.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Add all lowercase alphabetic characters to a Set and check if set.size === 26."]
  },
  {
    id: "JS-P122",
    number: 122,
    title: "Check if Two Strings are Isomorphic",
    slug: "js-p122-check-if-two-strings-are-isomorphic",
    category: "Strings",
    subcategory: "Bijection",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Hash Map"],
    tags: ["strings", "isomorphic", "hash-map"],
    expectedTime: "5 mins",
    summary: "Determine if characters in s can be replaced to yield t with a one-to-one mapping.",
    problemStatement: "Write a function `isIsomorphic(s, t)` that checks if `s` and `t` are isomorphic. No two characters may map to the same character, but a character may map to itself.",
    examples: [
      { title: "Example 1", input: "['egg', 'add']", output: "true", explanation: "e->a, g->d." },
      { title: "Example 2", input: "['foo', 'bar']", output: "false", explanation: "o cannot map to both a and r." }
    ],
    constraints: ["s.length === t.length"],
    starterCode: "function isIsomorphic(s, t) {\n  // Write your solution here\n}",
    functionName: "isIsomorphic",
    testCases: [
      { id: "tc_122_1", input: "['egg', 'add']", expectedOutput: "true", isHidden: false },
      { id: "tc_122_2", input: "['foo', 'bar']", expectedOutput: "false", isHidden: false },
      { id: "tc_122_3", input: "['paper', 'title']", expectedOutput: "true", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_122_4", input: "['badc', 'baba']", expectedOutput: "false", isHidden: true },
      { id: "tc_122_5", input: "['', '']", expectedOutput: "true", isHidden: true }
    ],
    solution: "function isIsomorphic(s, t) {\n  if (s.length !== t.length) return false;\n  const mapST = new Map();\n  const mapTS = new Map();\n  for (let i = 0; i < s.length; i++) {\n    const c1 = s[i], c2 = t[i];\n    if ((mapST.has(c1) && mapST.get(c1) !== c2) || (mapTS.has(c2) && mapTS.get(c2) !== c1)) {\n      return false;\n    }\n    mapST.set(c1, c2);\n    mapTS.set(c2, c1);\n  }\n  return true;\n}",
    explanation: "Maintain two bidirectional maps ensuring a one-to-one correspondence.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Use two maps to check bidirectional character mapping consistency."]
  },
  {
    id: "JS-P123",
    number: 123,
    title: "Longest Common Prefix of an Array of Strings",
    slug: "js-p123-longest-common-prefix-of-an-array-of-strings",
    category: "Strings",
    subcategory: "Prefixes",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Prefixes"],
    tags: ["strings", "prefix", "comparison"],
    expectedTime: "5 mins",
    summary: "Find the longest common prefix string amongst an array of strings.",
    problemStatement: "Write a function `longestCommonPrefix(strs)` that returns the longest common prefix shared by all strings in `strs`. If no common prefix exists, return `''`.",
    examples: [
      { title: "Example 1", input: "[['flower', 'flow', 'flight']]", output: "'fl'", explanation: "'fl' is common prefix." },
      { title: "Example 2", input: "[['dog', 'racecar', 'car']]", output: "''", explanation: "No common prefix." }
    ],
    constraints: ["0 <= strs.length <= 1000"],
    starterCode: "function longestCommonPrefix(strs) {\n  // Write your solution here\n}",
    functionName: "longestCommonPrefix",
    testCases: [
      { id: "tc_123_1", input: "[['flower', 'flow', 'flight']]", expectedOutput: "'fl'", isHidden: false },
      { id: "tc_123_2", input: "[['dog', 'racecar', 'car']]", expectedOutput: "''", isHidden: false },
      { id: "tc_123_3", input: "[['interspecies', 'interstellar', 'interstate']]", expectedOutput: "'inters'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_123_4", input: "[[]]", expectedOutput: "''", isHidden: true },
      { id: "tc_123_5", input: "[['single']]", expectedOutput: "'single'", isHidden: true }
    ],
    solution: "function longestCommonPrefix(strs) {\n  if (!strs || strs.length === 0) return '';\n  let prefix = strs[0];\n  for (let i = 1; i < strs.length; i++) {\n    while (!strs[i].startsWith(prefix)) {\n      prefix = prefix.slice(0, prefix.length - 1);\n      if (!prefix) return '';\n    }\n  }\n  return prefix;\n}",
    explanation: "Shorten the prefix until every subsequent string begins with it.",
    timeComplexity: "O(S)",
    spaceComplexity: "O(1)",
    hints: ["Start with prefix = strs[0], then trim it while !strs[i].startsWith(prefix)."]
  },
  {
    id: "JS-P124",
    number: 124,
    title: "Reverse Only Letters in String",
    slug: "js-p124-reverse-only-letters-in-string",
    category: "Strings",
    subcategory: "Two Pointers",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Two Pointers"],
    tags: ["strings", "reverse", "two-pointers"],
    expectedTime: "5 mins",
    summary: "Reverse only alphabetic letters in a string, preserving all punctuation and symbols in place.",
    problemStatement: "Write a function `reverseOnlyLetters(str)` that reverses all English letters while keeping non-letters in their original locations.",
    examples: [
      { title: "Example 1", input: "['ab-cd']", output: "'dc-ba'", explanation: "Letters reversed, hyphen preserved." },
      { title: "Example 2", input: "['a-bC-dEf-ghIj']", output: "'j-Ih-gfE-dCba'", explanation: "Preserves case and non-letters." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function reverseOnlyLetters(str) {\n  // Write your solution here\n}",
    functionName: "reverseOnlyLetters",
    testCases: [
      { id: "tc_124_1", input: "['ab-cd']", expectedOutput: "'dc-ba'", isHidden: false },
      { id: "tc_124_2", input: "['a-bC-dEf-ghIj']", expectedOutput: "'j-Ih-gfE-dCba'", isHidden: false },
      { id: "tc_124_3", input: "['123!']", expectedOutput: "'123!'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_124_4", input: "['']", expectedOutput: "''", isHidden: true },
      { id: "tc_124_5", input: "['Test1ng-Leet=code-Q!']", expectedOutput: "'Qedo1ct-eeLg=ntse-T!'", isHidden: true }
    ],
    solution: "function reverseOnlyLetters(str) {\n  const chars = str.split('');\n  let left = 0, right = chars.length - 1;\n  const isLetter = c => /[a-zA-Z]/.test(c);\n  while (left < right) {\n    if (!isLetter(chars[left])) left++;\n    else if (!isLetter(chars[right])) right--;\n    else {\n      [chars[left], chars[right]] = [chars[right], chars[left]];\n      left++;\n      right--;\n    }\n  }\n  return chars.join('');\n}",
    explanation: "Two pointers swap letters and skip non-letter characters in O(n) time.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Two pointers: advance left if non-letter, decrement right if non-letter, swap when both are letters."]
  },
  {
    id: "JS-P125",
    number: 125,
    title: "Check Palindrome Ignoring Non-Alphanumeric Characters",
    slug: "js-p125-check-palindrome-ignoring-non-alphanumeric-characters",
    category: "Strings",
    subcategory: "Palindrome",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Two Pointers"],
    tags: ["strings", "palindrome", "two-pointers"],
    expectedTime: "5 mins",
    summary: "Determine if a string is a palindrome considering only alphanumeric characters and ignoring case.",
    problemStatement: "Write a function `isPalindromeAlphanumeric(str)` that checks whether `str` is a palindrome after converting all letters to lowercase and removing all non-alphanumeric characters.",
    examples: [
      { title: "Example 1", input: "['A man, a plan, a canal: Panama']", output: "true", explanation: "'amanaplanacanalpanama' is a palindrome." },
      { title: "Example 2", input: "['race a car']", output: "false", explanation: "'raceacar' is not a palindrome." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function isPalindromeAlphanumeric(str) {\n  // Write your solution here\n}",
    functionName: "isPalindromeAlphanumeric",
    testCases: [
      { id: "tc_125_1", input: "['A man, a plan, a canal: Panama']", expectedOutput: "true", isHidden: false },
      { id: "tc_125_2", input: "['race a car']", expectedOutput: "false", isHidden: false },
      { id: "tc_125_3", input: "[' ']", expectedOutput: "true", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_125_4", input: "['0P']", expectedOutput: "false", isHidden: true },
      { id: "tc_125_5", input: "['Madam, I\\'m Adam']", expectedOutput: "true", isHidden: true }
    ],
    solution: "function isPalindromeAlphanumeric(str) {\n  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');\n  let left = 0, right = clean.length - 1;\n  while (left < right) {\n    if (clean[left] !== clean[right]) return false;\n    left++;\n    right--;\n  }\n  return true;\n}",
    explanation: "Clean non-alphanumeric characters with regex and test with two pointers.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Clean with str.toLowerCase().replace(/[^a-z0-9]/g, '') then compare ends."]
  },
  {
    id: "JS-P126",
    number: 126,
    title: "Count Frequency of Every Character in String",
    slug: "js-p126-count-frequency-of-every-character-in-string",
    category: "Strings",
    subcategory: "Hash Map",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Hash Map"],
    tags: ["strings", "frequency", "map"],
    expectedTime: "5 mins",
    summary: "Return an object mapping each character in the string to its occurrence count.",
    problemStatement: "Write a function `charFrequency(str)` that counts character frequencies in `str` and returns `{ [char: string]: number }`.",
    examples: [
      { title: "Example 1", input: "['hello']", output: "{ h: 1, e: 1, l: 2, o: 1 }", explanation: "Character counts." },
      { title: "Example 2", input: "['']", output: "{}", explanation: "Empty string." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function charFrequency(str) {\n  // Write your solution here\n}",
    functionName: "charFrequency",
    testCases: [
      { id: "tc_126_1", input: "['hello']", expectedOutput: "{ h: 1, e: 1, l: 2, o: 1 }", isHidden: false },
      { id: "tc_126_2", input: "['']", expectedOutput: "{}", isHidden: false },
      { id: "tc_126_3", input: "['aba']", expectedOutput: "{ a: 2, b: 1 }", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_126_4", input: "['zzzz']", expectedOutput: "{ z: 4 }", isHidden: true },
      { id: "tc_126_5", input: "['!?!']", expectedOutput: "{ '!': 2, '?': 1 }", isHidden: true }
    ],
    solution: "function charFrequency(str) {\n  const freq = {};\n  for (const c of str) freq[c] = (freq[c] || 0) + 1;\n  return freq;\n}",
    explanation: "Accumulate character frequencies in a plain object.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Iterate through characters and update freq[c] = (freq[c] || 0) + 1."]
  },
  {
    id: "JS-P127",
    number: 127,
    title: "Remove All Duplicate Characters from String",
    slug: "js-p127-remove-all-duplicate-characters-from-string",
    category: "Strings",
    subcategory: "Set Operations",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Set"],
    tags: ["strings", "duplicates", "set"],
    expectedTime: "5 mins",
    summary: "Return a string with only the first occurrence of each character preserved.",
    problemStatement: "Write a function `removeDuplicateChars(str)` that strips out duplicate characters, keeping each character's first appearance in original order.",
    examples: [
      { title: "Example 1", input: "['programming']", output: "'progami'", explanation: "Duplicates r, m, g removed." },
      { title: "Example 2", input: "['banana']", output: "'ban'", explanation: "'ban' first occurrences." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function removeDuplicateChars(str) {\n  // Write your solution here\n}",
    functionName: "removeDuplicateChars",
    testCases: [
      { id: "tc_127_1", input: "['programming']", expectedOutput: "'progamin'", isHidden: false },
      { id: "tc_127_2", input: "['banana']", expectedOutput: "'ban'", isHidden: false },
      { id: "tc_127_3", input: "['']", expectedOutput: "''", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_127_4", input: "['aaaaa']", expectedOutput: "'a'", isHidden: true },
      { id: "tc_127_5", input: "['abcdef']", expectedOutput: "'abcdef'", isHidden: true }
    ],
    solution: "function removeDuplicateChars(str) {\n  return Array.from(new Set(str)).join('');\n}",
    explanation: "A Set retains unique characters in encounter order; join back into string.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Use Array.from(new Set(str)).join('')."]
  },
  {
    id: "JS-P128",
    number: 128,
    title: "Find All Permutations of a Short String",
    slug: "js-p128-find-all-permutations-of-a-short-string",
    category: "Strings",
    subcategory: "Recursion & Backtracking",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Strings", "Backtracking"],
    tags: ["strings", "permutations", "backtracking"],
    expectedTime: "10 mins",
    summary: "Return all unique character permutations of a string.",
    problemStatement: "Write a function `stringPermutations(str)` that returns an array of all unique permutations of `str` in sorted order.",
    examples: [
      { title: "Example 1", input: "['ab']", output: "['ab', 'ba']", explanation: "All permutations of 'ab'." },
      { title: "Example 2", input: "['a']", output: "['a']", explanation: "Single character." }
    ],
    constraints: ["0 <= str.length <= 8"],
    starterCode: "function stringPermutations(str) {\n  // Write your solution here\n}",
    functionName: "stringPermutations",
    testCases: [
      { id: "tc_128_1", input: "['ab']", expectedOutput: "['ab', 'ba']", isHidden: false },
      { id: "tc_128_2", input: "['a']", expectedOutput: "['a']", isHidden: false },
      { id: "tc_128_3", input: "['']", expectedOutput: "['']", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_128_4", input: "['abc']", expectedOutput: "['abc', 'acb', 'bac', 'bca', 'cab', 'cba']", isHidden: true },
      { id: "tc_128_5", input: "['aa']", expectedOutput: "['aa']", isHidden: true }
    ],
    solution: "function stringPermutations(str) {\n  if (str.length <= 1) return [str];\n  const results = new Set();\n  function backtrack(curr, remaining) {\n    if (remaining.length === 0) {\n      results.add(curr);\n      return;\n    }\n    for (let i = 0; i < remaining.length; i++) {\n      backtrack(curr + remaining[i], remaining.slice(0, i) + remaining.slice(i + 1));\n    }\n  }\n  backtrack('', str);\n  return Array.from(results).sort();\n}",
    explanation: "Recursive backtracking with a Set to eliminate duplicates, returning sorted permutations.",
    timeComplexity: "O(n! * n)",
    spaceComplexity: "O(n!)",
    hints: ["Use recursion: pick a character, permute the remainder, collect in a Set."]
  },
  {
    id: "JS-P129",
    number: 129,
    title: "Check if String Contains Only Digits",
    slug: "js-p129-check-if-string-contains-only-digits",
    category: "Strings",
    subcategory: "Validation",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Regex"],
    tags: ["strings", "digits", "validation"],
    expectedTime: "5 mins",
    summary: "Determine if a non-empty string consists exclusively of digit characters '0'-'9'.",
    problemStatement: "Write a function `isNumericString(str)` that returns `true` if `str` is non-empty and contains only digits `'0'`-`'9'`, otherwise `false`.",
    examples: [
      { title: "Example 1", input: "['12345']", output: "true", explanation: "Only digits." },
      { title: "Example 2", input: "['123a45']", output: "false", explanation: "'a' is not a digit." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function isNumericString(str) {\n  // Write your solution here\n}",
    functionName: "isNumericString",
    testCases: [
      { id: "tc_129_1", input: "['12345']", expectedOutput: "true", isHidden: false },
      { id: "tc_129_2", input: "['123a45']", expectedOutput: "false", isHidden: false },
      { id: "tc_129_3", input: "['']", expectedOutput: "false", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_129_4", input: "['0']", expectedOutput: "true", isHidden: true },
      { id: "tc_129_5", input: "[' 123 ']", expectedOutput: "false", isHidden: true }
    ],
    solution: "function isNumericString(str) {\n  return /^\\d+$/.test(str);\n}",
    explanation: "Regex /^\\d+$/ verifies that the string consists solely of 1 or more digits.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Use /^\\d+$/.test(str)."]
  },
  {
    id: "JS-P130",
    number: 130,
    title: "Pad String on Left (padStart Implementation)",
    slug: "js-p130-pad-string-on-left-padstart-implementation",
    category: "Strings",
    subcategory: "Padding",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Padding"],
    tags: ["strings", "pad", "padStart"],
    expectedTime: "5 mins",
    summary: "Pad the start of a string with a pad string until target length is reached.",
    problemStatement: "Write a function `padLeft(str, targetLen, padChar = ' ')` that pads `str` from the start until it reaches `targetLen`. If `str.length >= targetLen`, return `str`.",
    examples: [
      { title: "Example 1", input: "['5', 3, '0']", output: "'005'", explanation: "'5' padded to length 3 with '0'." },
      { title: "Example 2", input: "['hello', 5, ' ']", output: "'hello'", explanation: "Already length 5." }
    ],
    constraints: ["0 <= str.length <= 1000", "0 <= targetLen <= 1000"],
    starterCode: "function padLeft(str, targetLen, padChar = ' ') {\n  // Write your solution here\n}",
    functionName: "padLeft",
    testCases: [
      { id: "tc_130_1", input: "['5', 3, '0']", expectedOutput: "'005'", isHidden: false },
      { id: "tc_130_2", input: "['hello', 5, ' ']", expectedOutput: "'hello'", isHidden: false },
      { id: "tc_130_3", input: "['42', 4, '*']", expectedOutput: "'**42'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_130_4", input: "['test', 2, 'x']", expectedOutput: "'test'", isHidden: true },
      { id: "tc_130_5", input: "['', 3, 'a']", expectedOutput: "'aaa'", isHidden: true }
    ],
    solution: "function padLeft(str, targetLen, padChar = ' ') {\n  return str.padStart(targetLen, padChar);\n}",
    explanation: "String.prototype.padStart pads to the target length on left.",
    timeComplexity: "O(targetLen)",
    spaceComplexity: "O(targetLen)",
    hints: ["Use str.padStart(targetLen, padChar)."]
  },
  {
    id: "JS-P131",
    number: 131,
    title: "Pad String on Right (padEnd Implementation)",
    slug: "js-p131-pad-string-on-right-padend-implementation",
    category: "Strings",
    subcategory: "Padding",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Padding"],
    tags: ["strings", "pad", "padEnd"],
    expectedTime: "5 mins",
    summary: "Pad the end of a string until it reaches the specified length.",
    problemStatement: "Write a function `padRight(str, targetLen, padChar = ' ')` that pads `str` from the end until it reaches `targetLen`.",
    examples: [
      { title: "Example 1", input: "['5', 3, '0']", output: "'500'", explanation: "'5' padded on right to length 3." },
      { title: "Example 2", input: "['abc', 6, '.']", output: "'abc...'", explanation: "Padded with dots." }
    ],
    constraints: ["0 <= str.length <= 1000"],
    starterCode: "function padRight(str, targetLen, padChar = ' ') {\n  // Write your solution here\n}",
    functionName: "padRight",
    testCases: [
      { id: "tc_131_1", input: "['5', 3, '0']", expectedOutput: "'500'", isHidden: false },
      { id: "tc_131_2", input: "['abc', 6, '.']", expectedOutput: "'abc...'", isHidden: false },
      { id: "tc_131_3", input: "['longstring', 4, ' ']", expectedOutput: "'longstring'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_131_4", input: "['', 2, '!']", expectedOutput: "'!!'", isHidden: true },
      { id: "tc_131_5", input: "['a', 1, 'x']", expectedOutput: "'a'", isHidden: true }
    ],
    solution: "function padRight(str, targetLen, padChar = ' ') {\n  return str.padEnd(targetLen, padChar);\n}",
    explanation: "String.prototype.padEnd pads to the target length on right.",
    timeComplexity: "O(targetLen)",
    spaceComplexity: "O(targetLen)",
    hints: ["Use str.padEnd(targetLen, padChar)."]
  },
  {
    id: "JS-P132",
    number: 132,
    title: "Check if One String is Subsequence of Another",
    slug: "js-p132-check-if-one-string-is-subsequence-of-another",
    category: "Strings",
    subcategory: "Subsequence",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Two Pointers"],
    tags: ["strings", "subsequence", "two-pointers"],
    expectedTime: "5 mins",
    summary: "Determine if string s is a subsequence of string t.",
    problemStatement: "Write a function `isSubsequence(s, t)` that returns `true` if `s` is a subsequence of `t` (can be derived by deleting some or no characters from `t` without changing relative order).",
    examples: [
      { title: "Example 1", input: "['abc', 'ahbgdc']", output: "true", explanation: "'a', 'b', 'c' appear in order." },
      { title: "Example 2", input: "['axc', 'ahbgdc']", output: "false", explanation: "'x' not found." }
    ],
    constraints: ["0 <= s.length, t.length <= 10^5"],
    starterCode: "function isSubsequence(s, t) {\n  // Write your solution here\n}",
    functionName: "isSubsequence",
    testCases: [
      { id: "tc_132_1", input: "['abc', 'ahbgdc']", expectedOutput: "true", isHidden: false },
      { id: "tc_132_2", input: "['axc', 'ahbgdc']", expectedOutput: "false", isHidden: false },
      { id: "tc_132_3", input: "['', 'anything']", expectedOutput: "true", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_132_4", input: "['abc', '']", expectedOutput: "false", isHidden: true },
      { id: "tc_132_5", input: "['ace', 'abcde']", expectedOutput: "true", isHidden: true }
    ],
    solution: "function isSubsequence(s, t) {\n  let i = 0, j = 0;\n  while (i < s.length && j < t.length) {\n    if (s[i] === t[j]) i++;\n    j++;\n  }\n  return i === s.length;\n}",
    explanation: "Advance two pointers; i increments only when characters match.",
    timeComplexity: "O(t.length)",
    spaceComplexity: "O(1)",
    hints: ["Use two pointers; advance pointer for s only on matching characters."]
  },
  {
    id: "JS-P133",
    number: 133,
    title: "Find Length of Longest Substring Without Repeating Characters",
    slug: "js-p133-find-length-of-longest-substring-without-repeating-characters",
    category: "Strings",
    subcategory: "Sliding Window",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Strings", "Sliding Window"],
    tags: ["strings", "sliding-window", "substring"],
    expectedTime: "10 mins",
    summary: "Find the length of the longest substring with all distinct characters.",
    problemStatement: "Write a function `lengthOfLongestSubstring(str)` that returns the length of the longest substring without repeating characters.",
    examples: [
      { title: "Example 1", input: "['abcabcbb']", output: "3", explanation: "'abc' has length 3." },
      { title: "Example 2", input: "['bbbbb']", output: "1", explanation: "'b' has length 1." },
      { title: "Example 3", input: "['pwwkew']", output: "3", explanation: "'wke' has length 3." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function lengthOfLongestSubstring(str) {\n  // Write your solution here\n}",
    functionName: "lengthOfLongestSubstring",
    testCases: [
      { id: "tc_133_1", input: "['abcabcbb']", expectedOutput: "3", isHidden: false },
      { id: "tc_133_2", input: "['bbbbb']", expectedOutput: "1", isHidden: false },
      { id: "tc_133_3", input: "['pwwkew']", expectedOutput: "3", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_133_4", input: "['']", expectedOutput: "0", isHidden: true },
      { id: "tc_133_5", input: "['au']", expectedOutput: "2", isHidden: true }
    ],
    solution: "function lengthOfLongestSubstring(str) {\n  const map = new Map();\n  let maxLen = 0;\n  let left = 0;\n  for (let right = 0; right < str.length; right++) {\n    if (map.has(str[right])) {\n      left = Math.max(left, map.get(str[right]) + 1);\n    }\n    map.set(str[right], right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}",
    explanation: "Sliding window with Map tracking last-seen index of characters.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(n, m))",
    hints: ["Use a sliding window [left, right] with a map storing the last seen index."]
  },
  {
    id: "JS-P134",
    number: 134,
    title: "Capitalize Every Alternate Character",
    slug: "js-p134-capitalize-every-alternate-character",
    category: "Strings",
    subcategory: "Formatting",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Iteration"],
    tags: ["strings", "alternate-case", "transform"],
    expectedTime: "5 mins",
    summary: "Alternate uppercase and lowercase character formatting (even index uppercase, odd lowercase).",
    problemStatement: "Write a function `alternateCase(str)` that returns `str` with even-indexed characters in uppercase and odd-indexed characters in lowercase.",
    examples: [
      { title: "Example 1", input: "['hello world']", output: "'HeLlO WoRlD'", explanation: "Alternating cases." },
      { title: "Example 2", input: "['abc']", output: "'AbC'", explanation: "0: 'A', 1: 'b', 2: 'C'." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function alternateCase(str) {\n  // Write your solution here\n}",
    functionName: "alternateCase",
    testCases: [
      { id: "tc_134_1", input: "['hello world']", expectedOutput: "'HeLlO WoRlD'", isHidden: false },
      { id: "tc_134_2", input: "['abc']", expectedOutput: "'AbC'", isHidden: false },
      { id: "tc_134_3", input: "['']", expectedOutput: "''", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_134_4", input: "['A']", expectedOutput: "'A'", isHidden: true },
      { id: "tc_134_5", input: "['javascript']", expectedOutput: "'JaVaScRiPt'", isHidden: true }
    ],
    solution: "function alternateCase(str) {\n  return str.split('').map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join('');\n}",
    explanation: "Map each character using i % 2 === 0 condition.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Check index i % 2 === 0 for toUpperCase() else toLowerCase()."]
  },
  {
    id: "JS-P135",
    number: 135,
    title: "Count Number of Sentences in Text",
    slug: "js-p135-count-number-of-sentences-in-text",
    category: "Strings",
    subcategory: "Text Analysis",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Regex"],
    tags: ["strings", "sentences", "counting"],
    expectedTime: "5 mins",
    summary: "Count the number of sentences ending in '.', '!', or '?'.",
    problemStatement: "Write a function `countSentences(str)` that counts sentences terminated by '.', '!', or '?'. Consecutive punctuation marks are treated as a single boundary.",
    examples: [
      { title: "Example 1", input: "['Hello! How are you? I am fine.']", output: "3", explanation: "Three sentences." },
      { title: "Example 2", input: "['Wait... Really?! Yes.']", output: "3", explanation: "Three punctuation clusters." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function countSentences(str) {\n  // Write your solution here\n}",
    functionName: "countSentences",
    testCases: [
      { id: "tc_135_1", input: "['Hello! How are you? I am fine.']", expectedOutput: "3", isHidden: false },
      { id: "tc_135_2", input: "['Wait... Really?! Yes.']", expectedOutput: "3", isHidden: false },
      { id: "tc_135_3", input: "['No terminal punctuation']", expectedOutput: "0", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_135_4", input: "['']", expectedOutput: "0", isHidden: true },
      { id: "tc_135_5", input: "['Just one.']", expectedOutput: "1", isHidden: true }
    ],
    solution: "function countSentences(str) {\n  const matches = str.match(/[.!?]+/g);\n  return matches ? matches.length : 0;\n}",
    explanation: "Match consecutive punctuation clusters [.!?]+.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use str.match(/[.!?]+/g).length."]
  },
  {
    id: "JS-P136",
    number: 136,
    title: "Check if String is Valid IPv4 Address",
    slug: "js-p136-check-if-string-is-valid-ipv4-address",
    category: "Strings",
    subcategory: "Validation",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Validation"],
    tags: ["strings", "ipv4", "validation"],
    expectedTime: "5 mins",
    summary: "Verify whether a string is a valid dot-decimal IPv4 address.",
    problemStatement: "Write a function `isValidIPv4(ip)` that returns `true` if `ip` is a valid IPv4 address (4 octets, 0-255 each, no leading zeros unless single '0'), otherwise `false`.",
    examples: [
      { title: "Example 1", input: "['192.168.1.1']", output: "true", explanation: "Valid IPv4." },
      { title: "Example 2", input: "['256.100.0.1']", output: "false", explanation: "256 exceeds 255." },
      { title: "Example 3", input: "['192.168.01.1']", output: "false", explanation: "'01' has invalid leading zero." }
    ],
    constraints: ["0 <= ip.length <= 50"],
    starterCode: "function isValidIPv4(ip) {\n  // Write your solution here\n}",
    functionName: "isValidIPv4",
    testCases: [
      { id: "tc_136_1", input: "['192.168.1.1']", expectedOutput: "true", isHidden: false },
      { id: "tc_136_2", input: "['256.100.0.1']", expectedOutput: "false", isHidden: false },
      { id: "tc_136_3", input: "['192.168.01.1']", expectedOutput: "false", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_136_4", input: "['0.0.0.0']", expectedOutput: "true", isHidden: true },
      { id: "tc_136_5", input: "['1.2.3']", expectedOutput: "false", isHidden: true }
    ],
    solution: "function isValidIPv4(ip) {\n  const parts = ip.split('.');\n  if (parts.length !== 4) return false;\n  for (const p of parts) {\n    if (!/^(0|[1-9]\\d*)$/.test(p)) return false;\n    const num = parseInt(p, 10);\n    if (num < 0 || num > 255) return false;\n  }\n  return true;\n}",
    explanation: "Check 4 parts, verify each is a valid integer without leading zeros in [0, 255].",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    hints: ["Split by '.', check parts.length === 4, check leading zeros and range 0-255."]
  },
  {
    id: "JS-P137",
    number: 137,
    title: "Strip HTML Tags from String",
    slug: "js-p137-strip-html-tags-from-string",
    category: "Strings",
    subcategory: "HTML Utilities",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Regex"],
    tags: ["strings", "html", "sanitize"],
    expectedTime: "5 mins",
    summary: "Remove all HTML tags from a markup string.",
    problemStatement: "Write a function `stripHtmlTags(str)` that strips out all HTML tags `<...>` from `str`.",
    examples: [
      { title: "Example 1", input: "['<p>Hello <b>World</b></p>']", output: "'Hello World'", explanation: "Tags stripped." },
      { title: "Example 2", input: "['<div><span>Text</span></div>']", output: "'Text'", explanation: "Nested tags stripped." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function stripHtmlTags(str) {\n  // Write your solution here\n}",
    functionName: "stripHtmlTags",
    testCases: [
      { id: "tc_137_1", input: "['<p>Hello <b>World</b></p>']", expectedOutput: "'Hello World'", isHidden: false },
      { id: "tc_137_2", input: "['<div><span>Text</span></div>']", expectedOutput: "'Text'", isHidden: false },
      { id: "tc_137_3", input: "['Plain text']", expectedOutput: "'Plain text'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_137_4", input: "['']", expectedOutput: "''", isHidden: true },
      { id: "tc_137_5", input: "['<a href=\"#\">Link</a>']", expectedOutput: "'Link'", isHidden: true }
    ],
    solution: "function stripHtmlTags(str) {\n  return str.replace(/<[^>]*>/g, '');\n}",
    explanation: "Replace /<[^>]*>/g with empty string.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use str.replace(/<[^>]*>/g, '')."]
  },
  {
    id: "JS-P138",
    number: 138,
    title: "Escape HTML Special Characters",
    slug: "js-p138-escape-html-special-characters",
    category: "Strings",
    subcategory: "HTML Utilities",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Security"],
    tags: ["strings", "html", "escape"],
    expectedTime: "5 mins",
    summary: "Escape &, <, >, \", and ' into their respective HTML entities.",
    problemStatement: "Write a function `escapeHtml(str)` that escapes `&` to `&amp;`, `<` to `&lt;`, `>` to `&gt;`, `\"` to `&quot;`, and `'` to `&#39;`.",
    examples: [
      { title: "Example 1", input: "['<script>alert(\"xss\")</script>']", output: "'&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'", explanation: "All HTML specials escaped." },
      { title: "Example 2", input: "['Tom & Jerry']", output: "'Tom &amp; Jerry'", explanation: "& escaped." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function escapeHtml(str) {\n  // Write your solution here\n}",
    functionName: "escapeHtml",
    testCases: [
      { id: "tc_138_1", input: "['<script>alert(\"xss\")</script>']", expectedOutput: "'&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'", isHidden: false },
      { id: "tc_138_2", input: "['Tom & Jerry']", expectedOutput: "'Tom &amp; Jerry'", isHidden: false },
      { id: "tc_138_3", input: "['It\\'s fine']", expectedOutput: "'It&#39;s fine'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_138_4", input: "['']", expectedOutput: "''", isHidden: true },
      { id: "tc_138_5", input: "['>>>']", expectedOutput: "'&gt;&gt;&gt;'", isHidden: true }
    ],
    solution: "function escapeHtml(str) {\n  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', \"'\": '&#39;' };\n  return str.replace(/[&<>\"']/g, m => map[m]);\n}",
    explanation: "Replace matches from [&<>\"'] using a lookup map.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use a character map and regex replace /[&<>\"']/g."]
  },
  {
    id: "JS-P139",
    number: 139,
    title: "Unescape HTML Entities",
    slug: "js-p139-unescape-html-entities",
    category: "Strings",
    subcategory: "HTML Utilities",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Parsing"],
    tags: ["strings", "html", "unescape"],
    expectedTime: "5 mins",
    summary: "Convert &amp;, &lt;, &gt;, &quot;, and &#39; back to their literal characters.",
    problemStatement: "Write a function `unescapeHtml(str)` that translates HTML entities `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;` back to characters.",
    examples: [
      { title: "Example 1", input: "['&lt;div&gt;&amp;&lt;/div&gt;']", output: "'<div>&</div>'", explanation: "Unescaped." },
      { title: "Example 2", input: "['&quot;hello&#39;']", output: "'\"hello\\''", explanation: "Quotes restored." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function unescapeHtml(str) {\n  // Write your solution here\n}",
    functionName: "unescapeHtml",
    testCases: [
      { id: "tc_139_1", input: "['&lt;div&gt;&amp;&lt;/div&gt;']", expectedOutput: "'<div>&</div>'", isHidden: false },
      { id: "tc_139_2", input: "['&quot;hello&#39;']", expectedOutput: "'\"hello\\''", isHidden: false },
      { id: "tc_139_3", input: "['plain']", expectedOutput: "'plain'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_139_4", input: "['']", expectedOutput: "''", isHidden: true },
      { id: "tc_139_5", input: "['&amp;&amp;']", expectedOutput: "'&&'", isHidden: true }
    ],
    solution: "function unescapeHtml(str) {\n  const map = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '\"', '&#39;': \"'\" };\n  return str.replace(/&(amp|lt|gt|quot|#39);/g, m => map[m]);\n}",
    explanation: "Replace entity matches using inverse dictionary map.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use regex /&(amp|lt|gt|quot|#39);/g with a replacement dictionary."]
  },
  {
    id: "JS-P140",
    number: 140,
    title: "Check Balanced Brackets (), [], {}",
    slug: "js-p140-check-balanced-brackets",
    category: "Strings",
    subcategory: "Stack",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Strings", "Stack"],
    tags: ["strings", "brackets", "stack"],
    expectedTime: "10 mins",
    summary: "Determine if all types of brackets in a string are properly nested and balanced.",
    problemStatement: "Write a function `areBracketsBalanced(str)` that validates matching pairs of `()`, `[]`, and `{}`.",
    examples: [
      { title: "Example 1", input: "['{[()]}']", output: "true", explanation: "Properly balanced." },
      { title: "Example 2", input: "['{[(])}']", output: "false", explanation: "Improperly nested." }
    ],
    constraints: ["0 <= str.length <= 10^5"],
    starterCode: "function areBracketsBalanced(str) {\n  // Write your solution here\n}",
    functionName: "areBracketsBalanced",
    testCases: [
      { id: "tc_140_1", input: "['{[()]}']", expectedOutput: "true", isHidden: false },
      { id: "tc_140_2", input: "['{[(])}']", expectedOutput: "false", isHidden: false },
      { id: "tc_140_3", input: "['']", expectedOutput: "true", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_140_4", input: "['[']", expectedOutput: "false", isHidden: true },
      { id: "tc_140_5", input: "['()[]{}']", expectedOutput: "true", isHidden: true }
    ],
    solution: "function areBracketsBalanced(str) {\n  const stack = [];\n  const pairs = { ')': '(', ']': '[', '}': '{' };\n  for (const c of str) {\n    if (c === '(' || c === '[' || c === '{') {\n      stack.push(c);\n    } else if (c === ')' || c === ']' || c === '}') {\n      if (stack.pop() !== pairs[c]) return false;\n    }\n  }\n  return stack.length === 0;\n}",
    explanation: "Push opening brackets to stack; on closing bracket verify top matches.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use a stack: push opening brackets, pop and verify on closing brackets."]
  },
  {
    id: "JS-P141",
    number: 141,
    title: "Convert Roman Numeral to Integer",
    slug: "js-p141-convert-roman-numeral-to-integer",
    category: "Strings",
    subcategory: "Numerals",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Math"],
    tags: ["strings", "roman", "math"],
    expectedTime: "5 mins",
    summary: "Convert a Roman numeral string to its decimal integer value.",
    problemStatement: "Write a function `romanToInt(s)` that converts Roman numeral `s` (I, V, X, L, C, D, M) to an integer.",
    examples: [
      { title: "Example 1", input: "['III']", output: "3", explanation: "1 + 1 + 1 = 3." },
      { title: "Example 2", input: "['LVIII']", output: "58", explanation: "50 + 5 + 3 = 58." },
      { title: "Example 3", input: "['MCMXCIV']", output: "1994", explanation: "1000 + 900 + 90 + 4 = 1994." }
    ],
    constraints: ["1 <= s.length <= 15"],
    starterCode: "function romanToInt(s) {\n  // Write your solution here\n}",
    functionName: "romanToInt",
    testCases: [
      { id: "tc_141_1", input: "['III']", expectedOutput: "3", isHidden: false },
      { id: "tc_141_2", input: "['LVIII']", expectedOutput: "58", isHidden: false },
      { id: "tc_141_3", input: "['MCMXCIV']", expectedOutput: "1994", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_141_4", input: "['IV']", expectedOutput: "4", isHidden: true },
      { id: "tc_141_5", input: "['IX']", expectedOutput: "9", isHidden: true }
    ],
    solution: "function romanToInt(s) {\n  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };\n  let total = 0;\n  for (let i = 0; i < s.length; i++) {\n    const curr = map[s[i]];\n    const next = map[s[i + 1]];\n    if (next > curr) {\n      total += (next - curr);\n      i++;\n    } else {\n      total += curr;\n    }\n  }\n  return total;\n}",
    explanation: "If current value is less than next value, subtract current from next; otherwise add current.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Compare map[s[i]] with map[s[i+1]]."]
  },
  {
    id: "JS-P142",
    number: 142,
    title: "Convert Integer to Roman Numeral",
    slug: "js-p142-convert-integer-to-roman-numeral",
    category: "Strings",
    subcategory: "Numerals",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Strings", "Math"],
    tags: ["strings", "roman", "greedy"],
    expectedTime: "10 mins",
    summary: "Convert an integer (1 to 3999) to its Roman numeral string representation.",
    problemStatement: "Write a function `intToRoman(num)` that converts an integer between 1 and 3999 into a Roman numeral.",
    examples: [
      { title: "Example 1", input: "[3]", output: "'III'", explanation: "3 is III." },
      { title: "Example 2", input: "[58]", output: "'LVIII'", explanation: "58 is LVIII." },
      { title: "Example 3", input: "[1994]", output: "'MCMXCIV'", explanation: "1994 is MCMXCIV." }
    ],
    constraints: ["1 <= num <= 3999"],
    starterCode: "function intToRoman(num) {\n  // Write your solution here\n}",
    functionName: "intToRoman",
    testCases: [
      { id: "tc_142_1", input: "[3]", expectedOutput: "'III'", isHidden: false },
      { id: "tc_142_2", input: "[58]", expectedOutput: "'LVIII'", isHidden: false },
      { id: "tc_142_3", input: "[1994]", expectedOutput: "'MCMXCIV'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_142_4", input: "[4]", expectedOutput: "'IV'", isHidden: true },
      { id: "tc_142_5", input: "[9]", expectedOutput: "'IX'", isHidden: true }
    ],
    solution: "function intToRoman(num) {\n  const values = [\n    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],\n    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],\n    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']\n  ];\n  let res = '';\n  for (const [v, sym] of values) {\n    while (num >= v) {\n      res += sym;\n      num -= v;\n    }\n  }\n  return res;\n}",
    explanation: "Greedy subtraction of largest possible Roman values.",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    hints: ["Use a greedy table of values and subtract in descending order."]
  },
  {
    id: "JS-P143",
    number: 143,
    title: "Generate Initials from Full Name",
    slug: "js-p143-generate-initials-from-full-name",
    category: "Strings",
    subcategory: "Formatting",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Words"],
    tags: ["strings", "initials", "format"],
    expectedTime: "5 mins",
    summary: "Extract uppercase first letters of each word in a person's name.",
    problemStatement: "Write a function `getInitials(name)` that extracts the uppercase first letter of each word in `name` and joins them without spaces.",
    examples: [
      { title: "Example 1", input: "['John Fitzgerald Kennedy']", output: "'JFK'", explanation: "J, F, K initials." },
      { title: "Example 2", input: "['alan turing']", output: "'AT'", explanation: "Uppercase initials." }
    ],
    constraints: ["0 <= name.length <= 1000"],
    starterCode: "function getInitials(name) {\n  // Write your solution here\n}",
    functionName: "getInitials",
    testCases: [
      { id: "tc_143_1", input: "['John Fitzgerald Kennedy']", expectedOutput: "'JFK'", isHidden: false },
      { id: "tc_143_2", input: "['alan turing']", expectedOutput: "'AT'", isHidden: false },
      { id: "tc_143_3", input: "['Cher']", expectedOutput: "'C'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_143_4", input: "['']", expectedOutput: "''", isHidden: true },
      { id: "tc_143_5", input: "['  grace   hopper  ']", expectedOutput: "'GH'", isHidden: true }
    ],
    solution: "function getInitials(name) {\n  const words = name.trim().split(/\\s+/).filter(Boolean);\n  return words.map(w => w[0].toUpperCase()).join('');\n}",
    explanation: "Split into words, map to first character in uppercase, join.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Trim, split by /\\s+/, map first char to uppercase, join."]
  },
  {
    id: "JS-P144",
    number: 144,
    title: "Mask Email Address",
    slug: "js-p144-mask-email-address",
    category: "Strings",
    subcategory: "Masking",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Masking"],
    tags: ["strings", "email", "privacy"],
    expectedTime: "5 mins",
    summary: "Mask an email username showing only the first and last characters with 5 asterisks.",
    problemStatement: "Write a function `maskEmail(email)` that masks the local part (before @) such that the first and last character remain visible and the middle is replaced with `'*****'`. Domain part remains untouched.",
    examples: [
      { title: "Example 1", input: "['user@example.com']", output: "'u*****r@example.com'", explanation: "'user' masked to 'u*****r'." },
      { title: "Example 2", input: "['alexander@gmail.com']", output: "'a*****r@gmail.com'", explanation: "'alexander' masked." }
    ],
    constraints: ["email contains exactly one '@' with local part of length >= 2."],
    starterCode: "function maskEmail(email) {\n  // Write your solution here\n}",
    functionName: "maskEmail",
    testCases: [
      { id: "tc_144_1", input: "['user@example.com']", expectedOutput: "'u*****r@example.com'", isHidden: false },
      { id: "tc_144_2", input: "['alexander@gmail.com']", expectedOutput: "'a*****r@gmail.com'", isHidden: false },
      { id: "tc_144_3", input: "['ab@test.org']", expectedOutput: "'a*****b@test.org'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_144_4", input: "['developer@company.io']", expectedOutput: "'d*****r@company.io'", isHidden: true }
    ],
    solution: "function maskEmail(email) {\n  const [user, domain] = email.split('@');\n  return user[0] + '*****' + user[user.length - 1] + '@' + domain;\n}",
    explanation: "Split at @, take user[0] + '*****' + user[last] + '@' + domain.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Split at '@', format user[0] + '*****' + user[user.length - 1] + '@' + domain."]
  },
  {
    id: "JS-P145",
    number: 145,
    title: "Check if Two Strings Differ by Exactly One Character Edit",
    slug: "js-p145-check-if-two-strings-differ-by-exactly-one-character-edit",
    category: "Strings",
    subcategory: "Edit Distance",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Strings", "Two Pointers"],
    tags: ["strings", "edit-distance", "two-pointers"],
    expectedTime: "10 mins",
    summary: "Determine if two strings have an edit distance of exactly 1.",
    problemStatement: "Write a function `isOneEditDistance(s1, s2)` that returns `true` if `s1` and `s2` are exactly 1 edit (insert, delete, or replace) apart.",
    examples: [
      { title: "Example 1", input: "['pale', 'ple']", output: "true", explanation: "1 deletion." },
      { title: "Example 2", input: "['pales', 'pale']", output: "true", explanation: "1 insertion." },
      { title: "Example 3", input: "['pale', 'bale']", output: "true", explanation: "1 replacement." },
      { title: "Example 4", input: "['pale', 'bake']", output: "false", explanation: "2 edits." }
    ],
    constraints: ["0 <= s1.length, s2.length <= 10^5"],
    starterCode: "function isOneEditDistance(s1, s2) {\n  // Write your solution here\n}",
    functionName: "isOneEditDistance",
    testCases: [
      { id: "tc_145_1", input: "['pale', 'ple']", expectedOutput: "true", isHidden: false },
      { id: "tc_145_2", input: "['pales', 'pale']", expectedOutput: "true", isHidden: false },
      { id: "tc_145_3", input: "['pale', 'bale']", expectedOutput: "true", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_145_4", input: "['pale', 'bake']", expectedOutput: "false", isHidden: true },
      { id: "tc_145_5", input: "['same', 'same']", expectedOutput: "false", isHidden: true }
    ],
    solution: "function isOneEditDistance(s1, s2) {\n  const m = s1.length, n = s2.length;\n  if (Math.abs(m - n) > 1) return false;\n  for (let i = 0; i < Math.min(m, n); i++) {\n    if (s1[i] !== s2[i]) {\n      if (m === n) return s1.slice(i + 1) === s2.slice(i + 1);\n      if (m < n) return s1.slice(i) === s2.slice(i + 1);\n      return s1.slice(i + 1) === s2.slice(i);\n    }\n  }\n  return Math.abs(m - n) === 1;\n}",
    explanation: "Find the first mismatched character and compare the remaining suffixes depending on lengths.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Find first mismatch index. If lengths equal, suffixes from i+1 must match. If length difference is 1, test insertion."]
  },
  {
    id: "JS-P146",
    number: 146,
    title: "Find All Start Indices of Anagrams in String",
    slug: "js-p146-find-all-start-indices-of-anagrams-in-string",
    category: "Strings",
    subcategory: "Sliding Window",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Strings", "Sliding Window"],
    tags: ["strings", "anagrams", "sliding-window"],
    expectedTime: "10 mins",
    summary: "Find all starting indices of pattern's anagrams in string s.",
    problemStatement: "Write a function `findAnagrams(s, p)` that returns an array of all start indices in `s` where an anagram of `p` begins.",
    examples: [
      { title: "Example 1", input: "['cbaebabacd', 'abc']", output: "[0, 6]", explanation: "'cba' at 0 and 'bac' at 6 are anagrams of 'abc'." },
      { title: "Example 2", input: "['abab', 'ab']", output: "[0, 1, 2]", explanation: "Anagrams at indices 0, 1, 2." }
    ],
    constraints: ["0 <= s.length, p.length <= 10^5"],
    starterCode: "function findAnagrams(s, p) {\n  // Write your solution here\n}",
    functionName: "findAnagrams",
    testCases: [
      { id: "tc_146_1", input: "['cbaebabacd', 'abc']", expectedOutput: "[0, 6]", isHidden: false },
      { id: "tc_146_2", input: "['abab', 'ab']", expectedOutput: "[0, 1, 2]", isHidden: false },
      { id: "tc_146_3", input: "['hello', 'xyz']", expectedOutput: "[]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_146_4", input: "['', 'a']", expectedOutput: "[]", isHidden: true },
      { id: "tc_146_5", input: "['baa', 'aa']", expectedOutput: "[1]", isHidden: true }
    ],
    solution: "function findAnagrams(s, p) {\n  const res = [];\n  if (s.length < p.length) return res;\n  const pCount = new Array(26).fill(0);\n  const sCount = new Array(26).fill(0);\n  const code = c => c.charCodeAt(0) - 97;\n  for (const c of p) pCount[code(c)]++;\n  const k = p.length;\n  for (let i = 0; i < s.length; i++) {\n    sCount[code(s[i])]++;\n    if (i >= k) sCount[code(s[i - k])]--;\n    if (i >= k - 1) {\n      if (pCount.every((val, idx) => val === sCount[idx])) {\n        res.push(i - k + 1);\n      }\n    }\n  }\n  return res;\n}",
    explanation: "Fixed-size sliding window of length p.length comparing 26-element character counts in O(n) time.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Use a sliding window of length p.length and compare letter count frequencies."]
  },
  {
    id: "JS-P147",
    number: 147,
    title: "Group Array of Strings by Anagram",
    slug: "js-p147-group-array-of-strings-by-anagram",
    category: "Strings",
    subcategory: "Hash Map",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Strings", "Hash Map"],
    tags: ["strings", "anagrams", "grouping"],
    expectedTime: "10 mins",
    summary: "Group anagram words together into an array of arrays.",
    problemStatement: "Write a function `groupAnagrams(strs)` that groups an array of strings into anagram clusters. The groups may appear in any order.",
    examples: [
      { title: "Example 1", input: "[['eat', 'tea', 'tan', 'ate', 'nat', 'bat']]", output: "[['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]", explanation: "Words with same letters grouped together." },
      { title: "Example 2", input: "[['']]", output: "[['']]", explanation: "Empty string." }
    ],
    constraints: ["0 <= strs.length <= 10^5"],
    starterCode: "function groupAnagrams(strs) {\n  // Write your solution here\n}",
    functionName: "groupAnagrams",
    testCases: [
      { id: "tc_147_1", input: "[['eat', 'tea', 'tan', 'ate', 'nat', 'bat']]", expectedOutput: "[['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]", isHidden: false },
      { id: "tc_147_2", input: "[['']]", expectedOutput: "[['']]", isHidden: false },
      { id: "tc_147_3", input: "[['a']]", expectedOutput: "[['a']]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_147_4", input: "[[]]", expectedOutput: "[]", isHidden: true },
      { id: "tc_147_5", input: "[['abc', 'cba', 'bca']]", expectedOutput: "[['abc', 'cba', 'bca']]", isHidden: true }
    ],
    solution: "function groupAnagrams(strs) {\n  const map = new Map();\n  for (const s of strs) {\n    const key = s.split('').sort().join('');\n    if (!map.has(key)) map.set(key, []);\n    map.get(key).push(s);\n  }\n  return Array.from(map.values());\n}",
    explanation: "Sort each word to create a canonical key and append words to Map[key].",
    timeComplexity: "O(n * k log k)",
    spaceComplexity: "O(n * k)",
    hints: ["Use sorted characters of each word as the Map key."]
  },
  {
    id: "JS-P148",
    number: 148,
    title: "Multiply Two Large Numbers as Strings",
    slug: "js-p148-multiply-two-large-numbers-as-strings",
    category: "Strings",
    subcategory: "Arbitrary Precision",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Strings", "BigInt"],
    tags: ["strings", "multiplication", "math"],
    expectedTime: "10 mins",
    summary: "Multiply two arbitrarily large numbers represented as strings without precision loss.",
    problemStatement: "Write a function `multiplyStrings(num1, num2)` that computes the product of non-negative integer strings `num1` and `num2` as a string.",
    examples: [
      { title: "Example 1", input: "['2', '3']", output: "'6'", explanation: "2 * 3 = 6." },
      { title: "Example 2", input: "['123', '456']", output: "'56088'", explanation: "123 * 456 = 56088." }
    ],
    constraints: ["num1 and num2 consist only of digits."],
    starterCode: "function multiplyStrings(num1, num2) {\n  // Write your solution here\n}",
    functionName: "multiplyStrings",
    testCases: [
      { id: "tc_148_1", input: "['2', '3']", expectedOutput: "'6'", isHidden: false },
      { id: "tc_148_2", input: "['123', '456']", expectedOutput: "'56088'", isHidden: false },
      { id: "tc_148_3", input: "['0', '12345']", expectedOutput: "'0'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_148_4", input: "['999', '999']", expectedOutput: "'998001'", isHidden: true },
      { id: "tc_148_5", input: "['1000000000', '1000000000']", expectedOutput: "'1000000000000000000'", isHidden: true }
    ],
    solution: "function multiplyStrings(num1, num2) {\n  return (BigInt(num1) * BigInt(num2)).toString();\n}",
    explanation: "JavaScript BigInt effortlessly supports arbitrary precision integer arithmetic.",
    timeComplexity: "O(n * m)",
    spaceComplexity: "O(n + m)",
    hints: ["Use BigInt(num1) * BigInt(num2)."]
  },
  {
    id: "JS-P149",
    number: 149,
    title: "Add Two Large Numbers as Strings",
    slug: "js-p149-add-two-large-numbers-as-strings",
    category: "Strings",
    subcategory: "Arbitrary Precision",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "BigInt"],
    tags: ["strings", "addition", "math"],
    expectedTime: "5 mins",
    summary: "Add two arbitrarily large integer strings together.",
    problemStatement: "Write a function `addStrings(num1, num2)` that computes the sum of non-negative integer strings `num1` and `num2` as a string.",
    examples: [
      { title: "Example 1", input: "['11', '123']", output: "'134'", explanation: "11 + 123 = 134." },
      { title: "Example 2", input: "['456', '77']", output: "'533'", explanation: "456 + 77 = 533." }
    ],
    constraints: ["num1, num2 consist of digits."],
    starterCode: "function addStrings(num1, num2) {\n  // Write your solution here\n}",
    functionName: "addStrings",
    testCases: [
      { id: "tc_149_1", input: "['11', '123']", expectedOutput: "'134'", isHidden: false },
      { id: "tc_149_2", input: "['456', '77']", expectedOutput: "'533'", isHidden: false },
      { id: "tc_149_3", input: "['0', '0']", expectedOutput: "'0'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_149_4", input: "['999999999999999999', '1']", expectedOutput: "'1000000000000000000'", isHidden: true }
    ],
    solution: "function addStrings(num1, num2) {\n  return (BigInt(num1) + BigInt(num2)).toString();\n}",
    explanation: "BigInt handles arbitrary precision addition without 64-bit float precision loss.",
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(max(n, m))",
    hints: ["Use BigInt(num1) + BigInt(num2)."]
  },
  {
    id: "JS-P150",
    number: 150,
    title: "Validate Simple Email Format",
    slug: "js-p150-validate-simple-email-format",
    category: "Strings",
    subcategory: "Validation",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Strings", "Regex"],
    tags: ["strings", "email", "validation"],
    expectedTime: "5 mins",
    summary: "Check if a string matches basic valid email format name@domain.tld.",
    problemStatement: "Write a function `isValidEmail(email)` that returns `true` if `email` conforms to the basic format: non-empty alphanumeric/dots before '@', followed by domain and top-level domain of at least 2 letters.",
    examples: [
      { title: "Example 1", input: "['user@example.com']", output: "true", explanation: "Valid email." },
      { title: "Example 2", input: "['plainaddress']", output: "false", explanation: "Missing @." }
    ],
    constraints: ["0 <= email.length <= 100"],
    starterCode: "function isValidEmail(email) {\n  // Write your solution here\n}",
    functionName: "isValidEmail",
    testCases: [
      { id: "tc_150_1", input: "['user@example.com']", expectedOutput: "true", isHidden: false },
      { id: "tc_150_2", input: "['plainaddress']", expectedOutput: "false", isHidden: false },
      { id: "tc_150_3", input: "['@missinguser.com']", expectedOutput: "false", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_150_4", input: "['user@domain']", expectedOutput: "false", isHidden: true },
      { id: "tc_150_5", input: "['john.doe@sub.company.org']", expectedOutput: "true", isHidden: true }
    ],
    solution: "function isValidEmail(email) {\n  return /^[^\\s@]+@[^\\s@]+\\.[a-zA-Z]{2,}$/.test(email);\n}",
    explanation: "Verify user part without spaces or @, followed by @, domain name, and at least 2-letter extension.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Use regex: /^[^\\s@]+@[^\\s@]+\\.[a-zA-Z]{2,}$/."]
  }
];

export async function buildAndTestBatch03() {
  console.log('Testing Batch 03 (50 questions)...');
  const passed = await testBatch(b03);
  if (!passed) {
    throw new Error('Batch 03 verification failed!');
  }
  const targetFile = path.resolve('src/components/coreprogramming/data/batches/batch03.ts');
  const fileContent = `// src/components/coreprogramming/data/batches/batch03.ts\nimport type { CoreProgrammingQuestion } from '../coreProgrammingTypes';\n\nexport const coreProgrammingBatch3: CoreProgrammingQuestion[] = ${JSON.stringify(b03, null, 2)};\n`;
  fs.writeFileSync(targetFile, fileContent, 'utf-8');
  console.log(`Successfully wrote ${b03.length} verified questions to batch03.ts!`);
}

buildAndTestBatch03();
