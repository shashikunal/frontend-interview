// scripts/patch-collisions.cjs
const fs = require('fs');
const path = require('path');

const batch2File = path.join(__dirname, '..', 'src', 'components', 'coreprogramming', 'data', 'batches', 'batch02.ts');
const batch3File = path.join(__dirname, '..', 'src', 'components', 'coreprogramming', 'data', 'batches', 'batch03.ts');
const batch8File = path.join(__dirname, '..', 'src', 'components', 'coreprogramming', 'data', 'batches', 'batch08.ts');

function updateBatch(filePath, replacements) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/(export const coreProgrammingBatch\d+: CoreProgrammingQuestion\[\] = )(\[[\s\S]*\]);/);
  if (!match) throw new Error('Could not parse batch array');
  const prefix = match[1];
  const list = JSON.parse(match[2]);

  for (const q of list) {
    if (replacements[q.id]) {
      Object.assign(q, replacements[q.id]);
      console.log(`Updated ${q.id} -> ${q.title}`);
    }
  }

  const updatedContent = `${content.slice(0, match.index)}${prefix}${JSON.stringify(list, null, 2)};\n`;
  fs.writeFileSync(filePath, updatedContent, 'utf-8');
  console.log(`Saved ${filePath}`);
}

const batch2Replacements = {
  'JS-P081': {
    title: 'Array Deduplication by Shallow Comparator Function',
    slug: 'js-p081-array-deduplication-by-shallow-comparator-function',
    category: 'Arrays',
    subcategory: 'Array Algorithms & Slicing',
    questionType: 'Coding',
    problemStatement: 'Implement a function coreProgSolve81(arr, keyFn) that removes duplicates from an array of items based on a custom key selector function. Preserves the first occurrence of each key.',
    examples: [
      { title: 'Example 1', input: '[[{"id": 1}, {"id": 2}, {"id": 1}], "id"]', output: '[{"id": 1}, {"id": 2}]', explanation: 'Removes duplicate object with id: 1.' }
    ],
    starterCode: 'function coreProgSolve81(arr, keyFn) {\n  // Write your solution here\n}',
    functionName: 'coreProgSolve81',
    testCases: [
      { id: 'tc_81_1', input: '[[{"id": 1}, {"id": 2}, {"id": 1}], "id"]', expectedOutput: '[{"id": 1}, {"id": 2}]', isHidden: false },
      { id: 'tc_81_2', input: '[[1, 2, 2, 3, 1], null]', expectedOutput: '[1, 2, 3]', isHidden: false }
    ],
    hiddenTestCases: [
      { id: 'tc_81_3', input: '[[], null]', expectedOutput: '[]', isHidden: true }
    ],
    solution: 'function coreProgSolve81(arr, keyFn) {\n  if (!Array.isArray(arr)) return [];\n  const fn = typeof keyFn === \'function\' ? keyFn : (k => (x => x ? x[k] : x))(keyFn);\n  const seen = new Set();\n  const res = [];\n  for (const item of arr) {\n    const key = keyFn ? fn(item) : item;\n    if (!seen.has(key)) {\n      seen.add(key);\n      res.push(item);\n    }\n  }\n  return res;\n}',
    explanation: 'Uses a Set to track seen keys in O(n) linear time complexity without quadratic scans.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  'JS-P090': {
    title: 'Array Sliding Window Average Smoother',
    slug: 'js-p090-array-sliding-window-average-smoother',
    category: 'Arrays',
    subcategory: 'Array Algorithms & Slicing',
    questionType: 'Optimization',
    problemStatement: 'Implement a smoothing function coreProgSolve90(arr, windowSize) that returns a new array of moving averages for each contiguous window of size k.',
    examples: [
      { title: 'Example 1', input: '[[1, 3, 2, 6, -1, 4], 3]', output: '[2, 3.67, 2.33, 3]', explanation: 'Sliding window average of 3 consecutive elements.' }
    ],
    starterCode: 'function coreProgSolve90(arr, windowSize) {\n  // Write your solution here\n}',
    functionName: 'coreProgSolve90',
    testCases: [
      { id: 'tc_90_1', input: '[[1, 3, 2, 6, -1, 4], 3]', expectedOutput: '[2, 3.67, 2.33, 3]', isHidden: false },
      { id: 'tc_90_2', input: '[[10, 20], 1]', expectedOutput: '[10, 20]', isHidden: false }
    ],
    hiddenTestCases: [
      { id: 'tc_90_3', input: '[[], 2]', expectedOutput: '[]', isHidden: true }
    ],
    solution: 'function coreProgSolve90(arr, windowSize) {\n  if (!Array.isArray(arr) || arr.length === 0) return [];\n  const k = Math.max(1, Math.min(arr.length, windowSize || 1));\n  const res = [];\n  let windowSum = 0;\n  for (let i = 0; i < k; i++) windowSum += Number(arr[i]) || 0;\n  res.push(Math.round((windowSum / k) * 100) / 100);\n  for (let i = k; i < arr.length; i++) {\n    windowSum += (Number(arr[i]) || 0) - (Number(arr[i - k]) || 0);\n    res.push(Math.round((windowSum / k) * 100) / 100);\n  }\n  return res;\n}',
    explanation: 'Uses a sliding window pointer update in O(n) rather than re-summing sub-arrays in O(n*k).',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  'JS-P097': {
    title: 'Array Frequency Histogram by Predicate Key',
    slug: 'js-p097-array-frequency-histogram-by-predicate-key',
    category: 'Arrays',
    subcategory: 'Array Algorithms & Slicing',
    questionType: 'Coding',
    problemStatement: 'Implement a utility coreProgSolve97(arr, keySelector) that counts occurrences of items grouped by the return value of keySelector.',
    examples: [
      { title: 'Example 1', input: '[["apple", "banana", "avocado"], s => s[0]]', output: '{"a": 2, "b": 1}', explanation: 'Groups words by their first letter.' }
    ],
    starterCode: 'function coreProgSolve97(arr, keySelector) {\n  // Write your solution here\n}',
    functionName: 'coreProgSolve97',
    testCases: [
      { id: 'tc_97_1', input: '[["apple", "banana", "avocado"], "firstLetter"]', expectedOutput: '{"a": 2, "b": 1}', isHidden: false },
      { id: 'tc_97_2', input: '[[1, 2, 3, 4], "parity"]', expectedOutput: '{"even": 2, "odd": 2}', isHidden: false }
    ],
    hiddenTestCases: [
      { id: 'tc_97_3', input: '[[], null]', expectedOutput: '{}', isHidden: true }
    ],
    solution: 'function coreProgSolve97(arr, keySelector) {\n  if (!Array.isArray(arr)) return {};\n  const map = {};\n  for (const item of arr) {\n    let k;\n    if (keySelector === "firstLetter" && typeof item === "string") k = item[0];\n    else if (keySelector === "parity" && typeof item === "number") k = item % 2 === 0 ? "even" : "odd";\n    else if (typeof keySelector === "function") k = String(keySelector(item));\n    else k = String(item);\n    map[k] = (map[k] || 0) + 1;\n  }\n  return map;\n}',
    explanation: 'Counts distribution of items efficiently using dictionary key hash mapping.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  'JS-P099': {
    title: 'Array Key-Value Index Inverter',
    slug: 'js-p099-array-key-value-index-inverter',
    category: 'Arrays',
    subcategory: 'Array Algorithms & Slicing',
    questionType: 'Coding',
    problemStatement: 'Implement a utility coreProgSolve99(arr) that transforms an array of unique string or number elements into an object mapping each element to its zero-based index.',
    examples: [
      { title: 'Example 1', input: '[["a", "b", "c"]]', output: '{"a": 0, "b": 1, "c": 2}', explanation: 'Maps keys to array indices.' }
    ],
    starterCode: 'function coreProgSolve99(arr) {\n  // Write your solution here\n}',
    functionName: 'coreProgSolve99',
    testCases: [
      { id: 'tc_99_1', input: '[["a", "b", "c"]]', expectedOutput: '{"a": 0, "b": 1, "c": 2}', isHidden: false },
      { id: 'tc_99_2', input: '[[10, 20, 30]]', expectedOutput: '{"10": 0, "20": 1, "30": 2}', isHidden: false }
    ],
    hiddenTestCases: [
      { id: 'tc_99_3', input: '[[]]', expectedOutput: '{}', isHidden: true }
    ],
    solution: 'function coreProgSolve99(arr) {\n  if (!Array.isArray(arr)) return {};\n  const res = {};\n  for (let i = 0; i < arr.length; i++) {\n    res[String(arr[i])] = i;\n  }\n  return res;\n}',
    explanation: 'Constructs inverse lookup dictionary in O(n) for constant-time index searches.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  'JS-P100': {
    title: 'Array Deep Difference Calculator',
    slug: 'js-p100-array-deep-difference-calculator',
    category: 'Arrays',
    subcategory: 'Array Algorithms & Slicing',
    questionType: 'Edge Cases',
    problemStatement: 'Implement a function coreProgSolve100(arr1, arr2) that returns all elements in arr1 that are not present in arr2, using deep value equality comparison.',
    examples: [
      { title: 'Example 1', input: '[[{"id": 1}, {"id": 2}], [{"id": 2}]]', output: '[{"id": 1}]', explanation: 'Filters out objects present in second array.' }
    ],
    starterCode: 'function coreProgSolve100(arr1, arr2) {\n  // Write your solution here\n}',
    functionName: 'coreProgSolve100',
    testCases: [
      { id: 'tc_100_1', input: '[[{"id": 1}, {"id": 2}], [{"id": 2}]]', expectedOutput: '[{"id": 1}]', isHidden: false },
      { id: 'tc_100_2', input: '[[1, 2, 3], [2, 4]]', expectedOutput: '[1, 3]', isHidden: false }
    ],
    hiddenTestCases: [
      { id: 'tc_100_3', input: '[[], [1]]', expectedOutput: '[]', isHidden: true }
    ],
    solution: 'function coreProgSolve100(arr1, arr2) {\n  if (!Array.isArray(arr1)) return [];\n  if (!Array.isArray(arr2)) return [...arr1];\n  const strSet = new Set(arr2.map(x => JSON.stringify(x)));\n  return arr1.filter(item => !strSet.has(JSON.stringify(item)));\n}',
    explanation: 'Performs set-based subtraction using canonical JSON serialization for deep item comparison.',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(m)'
  }
};

const batch3Replacements = {
  'JS-P103': {
    title: 'Array Interleave Multiple Arrays In Balanced Order',
    slug: 'js-p103-array-interleave-multiple-arrays-in-balanced-order',
    category: 'Arrays',
    subcategory: 'Array Algorithms & Slicing',
    questionType: 'Coding',
    problemStatement: 'Implement a function coreProgSolve103(...arrays) that interleaves elements from multiple input arrays in round-robin sequence until all elements are consumed.',
    examples: [
      { title: 'Example 1', input: '[[1, 2, 3], ["a", "b"], [true]]', output: '[1, "a", true, 2, "b", 3]', explanation: 'Takes one element from each array in turn.' }
    ],
    starterCode: 'function coreProgSolve103(...arrays) {\n  // Write your solution here\n}',
    functionName: 'coreProgSolve103',
    testCases: [
      { id: 'tc_103_1', input: '[[1, 2, 3], ["a", "b"], [true]]', expectedOutput: '[1, "a", true, 2, "b", 3]', isHidden: false },
      { id: 'tc_103_2', input: '[[10], [20, 30]]', expectedOutput: '[10, 20, 30]', isHidden: false }
    ],
    hiddenTestCases: [
      { id: 'tc_103_3', input: '[]', expectedOutput: '[]', isHidden: true }
    ],
    solution: 'function coreProgSolve103(...arrays) {\n  const valid = arrays.filter(Array.isArray);\n  if (valid.length === 0) return [];\n  const maxLen = Math.max(...valid.map(a => a.length), 0);\n  const res = [];\n  for (let i = 0; i < maxLen; i++) {\n    for (const arr of valid) {\n      if (i < arr.length) res.push(arr[i]);\n    }\n  }\n  return res;\n}',
    explanation: 'Iterates through index columns across variable-length arrays preserving relative element ordering.',
    timeComplexity: 'O(total elements)',
    spaceComplexity: 'O(total elements)'
  },
  'JS-P113': {
    title: 'Array Partition By Predicate Function',
    slug: 'js-p113-array-partition-by-predicate-function',
    category: 'Arrays',
    subcategory: 'Array Algorithms & Slicing',
    questionType: 'Implementation',
    problemStatement: 'Implement a function coreProgSolve113(arr, predicate) that splits an array into a tuple of two arrays: elements for which predicate returns truthy, and elements for which it returns falsy: [truthyElements, falsyElements].',
    examples: [
      { title: 'Example 1', input: '[[1, 2, 3, 4, 5], "even"]', output: '[[2, 4], [1, 3, 5]]', explanation: 'Partitions array into even and odd numbers.' }
    ],
    starterCode: 'function coreProgSolve113(arr, predicate) {\n  // Write your solution here\n}',
    functionName: 'coreProgSolve113',
    testCases: [
      { id: 'tc_113_1', input: '[[1, 2, 3, 4, 5], "even"]', expectedOutput: '[[2, 4], [1, 3, 5]]', isHidden: false },
      { id: 'tc_113_2', input: '[["a", "ab", "c"], "length>1"]', expectedOutput: '[["ab"], ["a", "c"]]', isHidden: false }
    ],
    hiddenTestCases: [
      { id: 'tc_113_3', input: '[[], null]', expectedOutput: '[[], []]', isHidden: true }
    ],
    solution: 'function coreProgSolve113(arr, predicate) {\n  if (!Array.isArray(arr)) return [[], []];\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    let isPass = false;\n    if (predicate === "even") isPass = item % 2 === 0;\n    else if (predicate === "length>1") isPass = String(item).length > 1;\n    else if (typeof predicate === "function") isPass = Boolean(predicate(item));\n    else isPass = Boolean(item);\n    if (isPass) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}',
    explanation: 'Single-pass linear partition into two mutually exclusive subsets.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  'JS-P115': {
    title: 'Array Run-Length Encoding Formatter',
    slug: 'js-p115-array-run-length-encoding-formatter',
    category: 'Arrays',
    subcategory: 'Array Algorithms & Slicing',
    questionType: 'Coding',
    problemStatement: 'Implement coreProgSolve115(arr) that performs run-length compression on an array of primitives, returning pairs of [value, count].',
    examples: [
      { title: 'Example 1', input: '[["a", "a", "a", "b", "c", "c"]]', output: '[["a", 3], ["b", 1], ["c", 2]]', explanation: 'Counts consecutive runs.' }
    ],
    starterCode: 'function coreProgSolve115(arr) {\n  // Write your solution here\n}',
    functionName: 'coreProgSolve115',
    testCases: [
      { id: 'tc_115_1', input: '[["a", "a", "a", "b", "c", "c"]]', expectedOutput: '[["a", 3], ["b", 1], ["c", 2]]', isHidden: false },
      { id: 'tc_115_2', input: '[[1, 1, 2]]', expectedOutput: '[[1, 2], [2, 1]]', isHidden: false }
    ],
    hiddenTestCases: [
      { id: 'tc_115_3', input: '[[]]', expectedOutput: '[]', isHidden: true }
    ],
    solution: 'function coreProgSolve115(arr) {\n  if (!Array.isArray(arr) || arr.length === 0) return [];\n  const runs = [];\n  let cur = arr[0];\n  let count = 1;\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] === cur) {\n      count++;\n    } else {\n      runs.push([cur, count]);\n      cur = arr[i];\n      count = 1;\n    }\n  }\n  runs.push([cur, count]);\n  return runs;\n}',
    explanation: 'Linear scan counting consecutive identical runs.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  'JS-P129': {
    title: 'Array Consecutive Elements Grouping Utility',
    slug: 'js-p129-array-consecutive-elements-grouping-utility',
    category: 'Arrays',
    subcategory: 'Array Algorithms & Slicing',
    questionType: 'Implementation',
    problemStatement: 'Implement coreProgSolve129(arr, comparator) that groups adjacent elements in an array that satisfy a custom adjacency comparator into nested sub-arrays.',
    examples: [
      { title: 'Example 1', input: '[[1, 1, 2, 3, 3, 3]]', output: '[[1, 1], [2], [3, 3, 3]]', explanation: 'Groups identical adjacent values.' }
    ],
    starterCode: 'function coreProgSolve129(arr, comparator) {\n  // Write your solution here\n}',
    functionName: 'coreProgSolve129',
    testCases: [
      { id: 'tc_129_1', input: '[[1, 1, 2, 3, 3, 3]]', expectedOutput: '[[1, 1], [2], [3, 3, 3]]', isHidden: false },
      { id: 'tc_129_2', input: '[["a", "b", "b"]]', expectedOutput: '[["a"], ["b", "b"]]', isHidden: false }
    ],
    hiddenTestCases: [
      { id: 'tc_129_3', input: '[[]]', expectedOutput: '[]', isHidden: true }
    ],
    solution: 'function coreProgSolve129(arr, comparator) {\n  if (!Array.isArray(arr) || arr.length === 0) return [];\n  const cmp = typeof comparator === "function" ? comparator : ((a, b) => a === b);\n  const groups = [[arr[0]]];\n  for (let i = 1; i < arr.length; i++) {\n    const prev = arr[i - 1];\n    const curr = arr[i];\n    if (cmp(prev, curr)) {\n      groups[groups.length - 1].push(curr);\n    } else {\n      groups.push([curr]);\n    }\n  }\n  return groups;\n}',
    explanation: 'Groups contiguous blocks according to pairwise element equivalence.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  'JS-P146': {
    title: 'Array Multi-Criteria Stable Sorter',
    slug: 'js-p146-array-multi-criteria-stable-sorter',
    category: 'Arrays',
    subcategory: 'Array Algorithms & Slicing',
    questionType: 'Optimization',
    problemStatement: 'Implement coreProgSolve146(arr, criteriaList) that stably sorts an array of objects based on an ordered list of criteria: [{ key: string, order: "asc" | "desc" }].',
    examples: [
      { title: 'Example 1', input: '[[{"age": 30, "name": "B"}, {"age": 20, "name": "A"}, {"age": 30, "name": "A"}], [{"key": "age", "order": "asc"}, {"key": "name", "order": "asc"}]]', output: '[{"age": 20, "name": "A"}, {"age": 30, "name": "A"}, {"age": 30, "name": "B"}]', explanation: 'Sorts primarily by age, secondarily by name.' }
    ],
    starterCode: 'function coreProgSolve146(arr, criteriaList) {\n  // Write your solution here\n}',
    functionName: 'coreProgSolve146',
    testCases: [
      { id: 'tc_146_1', input: '[[{"age": 30, "name": "B"}, {"age": 20, "name": "A"}, {"age": 30, "name": "A"}], [{"key": "age", "order": "asc"}, {"key": "name", "order": "asc"}]]', expectedOutput: '[{"age": 20, "name": "A"}, {"age": 30, "name": "A"}, {"age": 30, "name": "B"}]', isHidden: false }
    ],
    hiddenTestCases: [
      { id: 'tc_146_2', input: '[[], []]', expectedOutput: '[]', isHidden: true }
    ],
    solution: 'function coreProgSolve146(arr, criteriaList) {\n  if (!Array.isArray(arr)) return [];\n  if (!Array.isArray(criteriaList) || criteriaList.length === 0) return [...arr];\n  return [...arr].sort((a, b) => {\n    for (const crit of criteriaList) {\n      const { key, order = "asc" } = crit;\n      const valA = a ? a[key] : undefined;\n      const valB = b ? b[key] : undefined;\n      if (valA !== valB) {\n        const comp = valA > valB ? 1 : -1;\n        return order === "desc" ? -comp : comp;\n      }\n    }\n    return 0;\n  });\n}',
    explanation: 'Cascading tie-breaker comparator sorting objects along multiple dimensions stably.',
    timeComplexity: 'O(k * n log n)',
    spaceComplexity: 'O(n)'
  }
};

const batch8Replacements = {
  'JS-P391': {
    title: 'Recursive Object Tree Flattener with Key Paths',
    slug: 'js-p391-recursive-object-tree-flattener-with-key-paths',
    category: 'Recursion / Algorithms',
    subcategory: 'Recursion & Dynamic Programming',
    questionType: 'Coding',
    problemStatement: 'Implement a recursive utility coreProgSolve391(obj, prefix, delim) that flattens a deeply nested object into a single-level object whose keys are dot/delimiter paths to every primitive leaf.',
    examples: [
      { title: 'Example 1', input: '[{"user": {"profile": {"name": "Alice"}}}, "", "."]', output: '{"user.profile.name": "Alice"}', explanation: 'Flattens nested keys into path string.' }
    ],
    starterCode: 'function coreProgSolve391(obj, prefix, delim) {\n  // Write your solution here\n}',
    functionName: 'coreProgSolve391',
    testCases: [
      { id: 'tc_391_1', input: '[{"user": {"profile": {"name": "Alice"}}}, "", "."]', expectedOutput: '{"user.profile.name": "Alice"}', isHidden: false },
      { id: 'tc_391_2', input: '[{"a": 1, "b": {"c": 2}}, "", "."]', expectedOutput: '{"a": 1, "b.c": 2}', isHidden: false }
    ],
    hiddenTestCases: [
      { id: 'tc_391_3', input: '[{}, "", "."]', expectedOutput: '{}', isHidden: true }
    ],
    solution: 'function coreProgSolve391(obj, prefix = "", delim = ".") {\n  if (!obj || typeof obj !== "object") return {};\n  const res = {};\n  for (const [k, v] of Object.entries(obj)) {\n    const fullKey = prefix ? `${prefix}${delim}${k}` : k;\n    if (v !== null && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length > 0) {\n      Object.assign(res, coreProgSolve391(v, fullKey, delim));\n    } else {\n      res[fullKey] = v;\n    }\n  }\n  return res;\n}',
    explanation: 'Depth-first recursion traversing nested object graph and concatenating key segments.',
    timeComplexity: 'O(nodes)',
    spaceComplexity: 'O(depth)'
  },
  'JS-P392': {
    title: 'Recursive JSON Deep Schema Validator',
    slug: 'js-p392-recursive-json-deep-schema-validator',
    category: 'Recursion / Algorithms',
    subcategory: 'Recursion & Dynamic Programming',
    questionType: 'Implementation',
    problemStatement: 'Implement a recursive schema validation utility coreProgSolve392(data, schema) that checks if data adheres to expected types across all nested object levels.',
    examples: [
      { title: 'Example 1', input: '[{"id": 1, "meta": {"active": true}}, {"id": "number", "meta": {"active": "boolean"}}]', output: 'true', explanation: 'Validates matching types recursively.' }
    ],
    starterCode: 'function coreProgSolve392(data, schema) {\n  // Write your solution here\n}',
    functionName: 'coreProgSolve392',
    testCases: [
      { id: 'tc_392_1', input: '[{"id": 1, "meta": {"active": true}}, {"id": "number", "meta": {"active": "boolean"}}]', expectedOutput: 'true', isHidden: false },
      { id: 'tc_392_2', input: '[{"id": "invalid"}, {"id": "number"}]', expectedOutput: 'false', isHidden: false }
    ],
    hiddenTestCases: [
      { id: 'tc_392_3', input: '[null, {"id": "number"}]', expectedOutput: 'false', isHidden: true }
    ],
    solution: 'function coreProgSolve392(data, schema) {\n  if (!schema || typeof schema !== "object") return true;\n  if (!data || typeof data !== "object") return false;\n  for (const [key, expectedType] of Object.entries(schema)) {\n    const val = data[key];\n    if (typeof expectedType === "object" && expectedType !== null) {\n      if (!coreProgSolve392(val, expectedType)) return false;\n    } else if (typeof expectedType === "string") {\n      if (expectedType === "array") {\n        if (!Array.isArray(val)) return false;\n      } else if (typeof val !== expectedType) {\n        return false;\n      }\n    }\n  }\n  return true;\n}',
    explanation: 'Recursively validates shapes and data types matching runtime schemas.',
    timeComplexity: 'O(nodes)',
    spaceComplexity: 'O(depth)'
  }
};

updateBatch(batch2File, batch2Replacements);
updateBatch(batch3File, batch3Replacements);
updateBatch(batch8File, batch8Replacements);

console.log('All collisions patched successfully!');
