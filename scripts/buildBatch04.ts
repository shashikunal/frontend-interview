// scripts/buildBatch04.ts
import * as fs from 'fs';
import * as path from 'path';
import type { CoreProgrammingQuestion } from '../src/components/coreprogramming/data/coreProgrammingTypes';
import { testBatch } from './verifyCoreBatch';

const b04: CoreProgrammingQuestion[] = [
  {
    id: "JS-P151",
    number: 151,
    title: "Shallow Clone an Object",
    slug: "js-p151-shallow-clone-an-object",
    category: "Objects",
    subcategory: "Object Basics",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "Cloning"],
    tags: ["objects", "clone", "shallow"],
    expectedTime: "5 mins",
    summary: "Create a shallow copy of an object.",
    problemStatement: "Write a function `shallowClone(obj)` that returns a new shallow copy of `obj`.",
    examples: [
      { title: "Example 1", input: "[{ a: 1, b: 2 }]", output: "{ a: 1, b: 2 }", explanation: "Shallow copy with same properties." }
    ],
    constraints: ["obj is a valid JavaScript object."],
    starterCode: "function shallowClone(obj) {\n  // Write your solution here\n}",
    functionName: "shallowClone",
    testCases: [
      { id: "tc_151_1", input: "[{ a: 1, b: 2 }]", expectedOutput: "{ a: 1, b: 2 }", isHidden: false },
      { id: "tc_151_2", input: "[{}]", expectedOutput: "{}", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_151_3", input: "[{ name: 'Alice', age: 30 }]", expectedOutput: "{ name: 'Alice', age: 30 }", isHidden: true }
    ],
    solution: "function shallowClone(obj) {\n  return { ...obj };\n}",
    explanation: "Object spread `{ ...obj }` creates a shallow clone.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use object spread: { ...obj }."]
  },
  {
    id: "JS-P152",
    number: 152,
    title: "Deep Clone an Object without Functions",
    slug: "js-p152-deep-clone-an-object-without-functions",
    category: "Objects",
    subcategory: "Cloning",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Objects", "Recursion"],
    tags: ["objects", "deep-clone", "recursion"],
    expectedTime: "10 mins",
    summary: "Deeply clone nested objects and arrays without mutating references.",
    problemStatement: "Write a function `deepClone(obj)` that recursively clones an object or array and all nested children.",
    examples: [
      { title: "Example 1", input: "[{ a: 1, b: { c: 2, d: [3, 4] } }]", output: "{ a: 1, b: { c: 2, d: [3, 4] } }", explanation: "Deep clone." }
    ],
    constraints: ["Contains primitives, objects, and arrays."],
    starterCode: "function deepClone(obj) {\n  // Write your solution here\n}",
    functionName: "deepClone",
    testCases: [
      { id: "tc_152_1", input: "[{ a: 1, b: { c: 2, d: [3, 4] } }]", expectedOutput: "{ a: 1, b: { c: 2, d: [3, 4] } }", isHidden: false },
      { id: "tc_152_2", input: "[[1, [2, 3]]]", expectedOutput: "[1, [2, 3]]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_152_3", input: "[null]", expectedOutput: "null", isHidden: true },
      { id: "tc_152_4", input: "[42]", expectedOutput: "42", isHidden: true }
    ],
    solution: "function deepClone(obj) {\n  if (obj === null || typeof obj !== 'object') return obj;\n  if (Array.isArray(obj)) return obj.map(deepClone);\n  const copy = {};\n  for (const k of Object.keys(obj)) copy[k] = deepClone(obj[k]);\n  return copy;\n}",
    explanation: "Recursively copy arrays and plain objects.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Check if primitive/null, check if array, recursively clone properties."]
  },
  {
    id: "JS-P153",
    number: 153,
    title: "Invert Object Keys and Values",
    slug: "js-p153-invert-object-keys-and-values",
    category: "Objects",
    subcategory: "Transformations",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "Inversion"],
    tags: ["objects", "invert", "hash-map"],
    expectedTime: "5 mins",
    summary: "Swap keys and values of an object.",
    problemStatement: "Write a function `invertObject(obj)` that returns an object where keys become values and values become keys (as strings).",
    examples: [
      { title: "Example 1", input: "[{ a: '1', b: '2' }]", output: "{ '1': 'a', '2': 'b' }", explanation: "Keys and values inverted." }
    ],
    constraints: ["Values are unique strings or numbers."],
    starterCode: "function invertObject(obj) {\n  // Write your solution here\n}",
    functionName: "invertObject",
    testCases: [
      { id: "tc_153_1", input: "[{ a: '1', b: '2' }]", expectedOutput: "{ '1': 'a', '2': 'b' }", isHidden: false },
      { id: "tc_153_2", input: "[{}]", expectedOutput: "{}", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_153_3", input: "[{ name: 'Alice' }]", expectedOutput: "{ Alice: 'name' }", isHidden: true }
    ],
    solution: "function invertObject(obj) {\n  const res = {};\n  for (const k of Object.keys(obj)) res[obj[k]] = k;\n  return res;\n}",
    explanation: "Iterate keys and assign res[obj[k]] = k.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Assign res[obj[k]] = k for every key."]
  },
  {
    id: "JS-P154",
    number: 154,
    title: "Pick Specific Keys from Object",
    slug: "js-p154-pick-specific-keys-from-object",
    category: "Objects",
    subcategory: "Subsetting",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "Pick"],
    tags: ["objects", "pick", "subset"],
    expectedTime: "5 mins",
    summary: "Return a new object containing only specified keys from input object.",
    problemStatement: "Write a function `pick(obj, keys)` that returns a copy of `obj` with only the properties listed in `keys`.",
    examples: [
      { title: "Example 1", input: "[{ a: 1, b: 2, c: 3 }, ['a', 'c']]", output: "{ a: 1, c: 3 }", explanation: "Only 'a' and 'c' picked." }
    ],
    constraints: ["0 <= keys.length <= 100"],
    starterCode: "function pick(obj, keys) {\n  // Write your solution here\n}",
    functionName: "pick",
    testCases: [
      { id: "tc_154_1", input: "[{ a: 1, b: 2, c: 3 }, ['a', 'c']]", expectedOutput: "{ a: 1, c: 3 }", isHidden: false },
      { id: "tc_154_2", input: "[{ x: 10 }, ['y']]", expectedOutput: "{}", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_154_3", input: "[{ a: 1 }, []]", expectedOutput: "{}", isHidden: true }
    ],
    solution: "function pick(obj, keys) {\n  const res = {};\n  for (const k of keys) {\n    if (k in obj) res[k] = obj[k];\n  }\n  return res;\n}",
    explanation: "Check membership with k in obj and copy.",
    timeComplexity: "O(k)",
    spaceComplexity: "O(k)",
    hints: ["Check if k in obj and assign res[k] = obj[k]."]
  },
  {
    id: "JS-P155",
    number: 155,
    title: "Omit Specific Keys from Object",
    slug: "js-p155-omit-specific-keys-from-object",
    category: "Objects",
    subcategory: "Subsetting",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "Omit"],
    tags: ["objects", "omit", "subset"],
    expectedTime: "5 mins",
    summary: "Return a copy of an object omitting designated keys.",
    problemStatement: "Write a function `omit(obj, keys)` that returns a copy of `obj` excluding any keys found in `keys`.",
    examples: [
      { title: "Example 1", input: "[{ a: 1, b: 2, c: 3 }, ['b']]", output: "{ a: 1, c: 3 }", explanation: "'b' excluded." }
    ],
    constraints: ["0 <= keys.length <= 100"],
    starterCode: "function omit(obj, keys) {\n  // Write your solution here\n}",
    functionName: "omit",
    testCases: [
      { id: "tc_155_1", input: "[{ a: 1, b: 2, c: 3 }, ['b']]", expectedOutput: "{ a: 1, c: 3 }", isHidden: false },
      { id: "tc_155_2", input: "[{ a: 1 }, ['a']]", expectedOutput: "{}", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_155_3", input: "[{ a: 1, b: 2 }, []]", expectedOutput: "{ a: 1, b: 2 }", isHidden: true }
    ],
    solution: "function omit(obj, keys) {\n  const s = new Set(keys);\n  const res = {};\n  for (const k of Object.keys(obj)) {\n    if (!s.has(k)) res[k] = obj[k];\n  }\n  return res;\n}",
    explanation: "Store keys in a Set and copy keys not present in the set.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Put omit keys in a Set and filter Object.keys(obj)."]
  },
  {
    id: "JS-P156",
    number: 156,
    title: "Check if Object is Empty",
    slug: "js-p156-check-if-object-is-empty",
    category: "Objects",
    subcategory: "Validation",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "Validation"],
    tags: ["objects", "empty", "keys"],
    expectedTime: "5 mins",
    summary: "Determine if an object has no own enumerable properties.",
    problemStatement: "Write a function `isEmptyObject(obj)` that returns `true` if `obj` has no own enumerable keys, otherwise `false`.",
    examples: [
      { title: "Example 1", input: "[{}]", output: "true", explanation: "No properties." },
      { title: "Example 2", input: "[{ a: 1 }]", output: "false", explanation: "Has 'a'." }
    ],
    constraints: ["obj is an object"],
    starterCode: "function isEmptyObject(obj) {\n  // Write your solution here\n}",
    functionName: "isEmptyObject",
    testCases: [
      { id: "tc_156_1", input: "[{}]", expectedOutput: "true", isHidden: false },
      { id: "tc_156_2", input: "[{ a: 1 }]", expectedOutput: "false", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_156_3", input: "[{ length: 0 }]", expectedOutput: "false", isHidden: true }
    ],
    solution: "function isEmptyObject(obj) {\n  return Object.keys(obj).length === 0;\n}",
    explanation: "Object.keys(obj).length === 0 checks own enumerable keys.",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    hints: ["Use Object.keys(obj).length === 0."]
  },
  {
    id: "JS-P157",
    number: 157,
    title: "Get Nested Value by Path String",
    slug: "js-p157-get-nested-value-by-path-string",
    category: "Objects",
    subcategory: "Path Traversal",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Objects", "Path Traversal"],
    tags: ["objects", "get", "path"],
    expectedTime: "10 mins",
    summary: "Safely retrieve a value from a nested object using a dot-path string with a fallback default.",
    problemStatement: "Write a function `get(obj, path, defaultValue)` that retrieves the value at nested `path` (e.g. `'a.b.c'`). If undefined or inaccessible, return `defaultValue`.",
    examples: [
      { title: "Example 1", input: "[{ a: { b: { c: 42 } } }, 'a.b.c', null]", output: "42", explanation: "Value 42 retrieved." },
      { title: "Example 2", input: "[{ a: 1 }, 'a.b.c', 'default']", output: "'default'", explanation: "Path missing, returns default." }
    ],
    constraints: ["path is a dot-separated string."],
    starterCode: "function get(obj, path, defaultValue) {\n  // Write your solution here\n}",
    functionName: "get",
    testCases: [
      { id: "tc_157_1", input: "[{ a: { b: { c: 42 } } }, 'a.b.c', null]", expectedOutput: "42", isHidden: false },
      { id: "tc_157_2", input: "[{ a: 1 }, 'a.b.c', 'default']", expectedOutput: "'default'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_157_3", input: "[{ x: 0 }, 'x', 100]", expectedOutput: "0", isHidden: true }
    ],
    solution: "function get(obj, path, defaultValue) {\n  const parts = path.split('.');\n  let curr = obj;\n  for (const p of parts) {\n    if (curr === null || curr === undefined) return defaultValue;\n    curr = curr[p];\n  }\n  return curr === undefined ? defaultValue : curr;\n}",
    explanation: "Traverse parts one by one; return defaultValue if encountering null/undefined.",
    timeComplexity: "O(path segments)",
    spaceComplexity: "O(path segments)",
    hints: ["Split path by '.' and traverse step by step."]
  },
  {
    id: "JS-P158",
    number: 158,
    title: "Set Nested Value by Path String",
    slug: "js-p158-set-nested-value-by-path-string",
    category: "Objects",
    subcategory: "Path Traversal",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Objects", "Path Traversal"],
    tags: ["objects", "set", "mutation"],
    expectedTime: "10 mins",
    summary: "Set a value at a dot-path, creating intermediate objects if necessary.",
    problemStatement: "Write a function `set(obj, path, value)` that sets `value` at `path` on `obj` and returns `obj`.",
    examples: [
      { title: "Example 1", input: "[{}, 'a.b.c', 10]", output: "{ a: { b: { c: 10 } } }", explanation: "Intermediate objects created." }
    ],
    constraints: ["path is non-empty dot path."],
    starterCode: "function set(obj, path, value) {\n  // Write your solution here\n}",
    functionName: "set",
    testCases: [
      { id: "tc_158_1", input: "[{}, 'a.b.c', 10]", expectedOutput: "{ a: { b: { c: 10 } } }", isHidden: false },
      { id: "tc_158_2", input: "[{ a: { x: 1 } }, 'a.y', 2]", expectedOutput: "{ a: { x: 1, y: 2 } }", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_158_3", input: "[{}, 'x', 99]", expectedOutput: "{ x: 99 }", isHidden: true }
    ],
    solution: "function set(obj, path, value) {\n  const parts = path.split('.');\n  let curr = obj;\n  for (let i = 0; i < parts.length - 1; i++) {\n    const p = parts[i];\n    if (!curr[p] || typeof curr[p] !== 'object') curr[p] = {};\n    curr = curr[p];\n  }\n  curr[parts[parts.length - 1]] = value;\n  return obj;\n}",
    explanation: "Walk through path creating empty objects where missing, and assign value at the final segment.",
    timeComplexity: "O(path length)",
    spaceComplexity: "O(path length)",
    hints: ["Create {} for intermediate segments if undefined, then assign last key."]
  },
  {
    id: "JS-P159",
    number: 159,
    title: "Delete Nested Key by Path String",
    slug: "js-p159-delete-nested-key-by-path-string",
    category: "Objects",
    subcategory: "Path Traversal",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Objects", "Path Traversal"],
    tags: ["objects", "unset", "delete"],
    expectedTime: "10 mins",
    summary: "Delete a nested property from an object using a dot-path.",
    problemStatement: "Write a function `unset(obj, path)` that deletes the property at `path` from `obj` and returns `obj`.",
    examples: [
      { title: "Example 1", input: "[{ a: { b: 1, c: 2 } }, 'a.b']", output: "{ a: { c: 2 } }", explanation: "Property a.b deleted." }
    ],
    constraints: ["path is a dot path."],
    starterCode: "function unset(obj, path) {\n  // Write your solution here\n}",
    functionName: "unset",
    testCases: [
      { id: "tc_159_1", input: "[{ a: { b: 1, c: 2 } }, 'a.b']", expectedOutput: "{ a: { c: 2 } }", isHidden: false },
      { id: "tc_159_2", input: "[{ x: 10 }, 'x']", expectedOutput: "{}", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_159_3", input: "[{ a: 1 }, 'nonexistent.path']", expectedOutput: "{ a: 1 }", isHidden: true }
    ],
    solution: "function unset(obj, path) {\n  const parts = path.split('.');\n  let curr = obj;\n  for (let i = 0; i < parts.length - 1; i++) {\n    if (!curr || typeof curr !== 'object') return obj;\n    curr = curr[parts[i]];\n  }\n  if (curr && typeof curr === 'object') {\n    delete curr[parts[parts.length - 1]];\n  }\n  return obj;\n}",
    explanation: "Navigate to the parent object and use the delete operator.",
    timeComplexity: "O(path length)",
    spaceComplexity: "O(path length)",
    hints: ["Traverse to parent and call delete parent[lastKey]."]
  },
  {
    id: "JS-P160",
    number: 160,
    title: "Check if Key Exists on Object or Prototype",
    slug: "js-p160-check-if-key-exists-on-object-or-prototype",
    category: "Objects",
    subcategory: "Prototypes",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "in operator"],
    tags: ["objects", "prototype", "in-operator"],
    expectedTime: "5 mins",
    summary: "Determine if a key exists in an object including its prototype chain.",
    problemStatement: "Write a function `hasKey(obj, key)` that returns `true` if `key` exists anywhere on `obj` or its prototype chain.",
    examples: [
      { title: "Example 1", input: "[{ a: 1 }, 'a']", output: "true", explanation: "'a' is an own property." },
      { title: "Example 2", input: "[{}, 'toString']", output: "true", explanation: "'toString' exists on prototype." }
    ],
    constraints: ["obj is non-null object."],
    starterCode: "function hasKey(obj, key) {\n  // Write your solution here\n}",
    functionName: "hasKey",
    testCases: [
      { id: "tc_160_1", input: "[{ a: 1 }, 'a']", expectedOutput: "true", isHidden: false },
      { id: "tc_160_2", input: "[{}, 'toString']", expectedOutput: "true", isHidden: false },
      { id: "tc_160_3", input: "[{ a: 1 }, 'b']", expectedOutput: "false", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_160_4", input: "[{ x: null }, 'x']", expectedOutput: "true", isHidden: true }
    ],
    solution: "function hasKey(obj, key) {\n  return key in obj;\n}",
    explanation: "The `in` operator checks both own and prototype properties.",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    hints: ["Use key in obj."]
  },
  {
    id: "JS-P161",
    number: 161,
    title: "Check if Key is Own Property",
    slug: "js-p161-check-if-key-is-own-property",
    category: "Objects",
    subcategory: "Prototypes",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "hasOwnProperty"],
    tags: ["objects", "hasown", "properties"],
    expectedTime: "5 mins",
    summary: "Determine if key is a direct own property of an object (not inherited).",
    problemStatement: "Write a function `hasOwnProp(obj, key)` that returns `true` if `key` is an own property of `obj`.",
    examples: [
      { title: "Example 1", input: "[{ a: 1 }, 'a']", output: "true", explanation: "'a' is own property." },
      { title: "Example 2", input: "[{}, 'toString']", output: "false", explanation: "'toString' is inherited." }
    ],
    constraints: ["obj is an object."],
    starterCode: "function hasOwnProp(obj, key) {\n  // Write your solution here\n}",
    functionName: "hasOwnProp",
    testCases: [
      { id: "tc_161_1", input: "[{ a: 1 }, 'a']", expectedOutput: "true", isHidden: false },
      { id: "tc_161_2", input: "[{}, 'toString']", expectedOutput: "false", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_161_3", input: "[{ prop: null }, 'prop']", expectedOutput: "true", isHidden: true }
    ],
    solution: "function hasOwnProp(obj, key) {\n  return Object.prototype.hasOwnProperty.call(obj, key);\n}",
    explanation: "Object.prototype.hasOwnProperty safely checks direct property ownership.",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    hints: ["Use Object.prototype.hasOwnProperty.call(obj, key)."]
  },
  {
    id: "JS-P162",
    number: 162,
    title: "Shallow Merge Two Objects",
    slug: "js-p162-shallow-merge-two-objects",
    category: "Objects",
    subcategory: "Merging",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "Merging"],
    tags: ["objects", "merge", "shallow"],
    expectedTime: "5 mins",
    summary: "Merge two objects where properties in the second object overwrite those in the first.",
    problemStatement: "Write a function `mergeShallow(obj1, obj2)` that shallow-merges `obj1` and `obj2`.",
    examples: [
      { title: "Example 1", input: "[{ a: 1, b: 2 }, { b: 99, c: 3 }]", output: "{ a: 1, b: 99, c: 3 }", explanation: "b overwritten with 99." }
    ],
    constraints: ["obj1, obj2 are objects."],
    starterCode: "function mergeShallow(obj1, obj2) {\n  // Write your solution here\n}",
    functionName: "mergeShallow",
    testCases: [
      { id: "tc_162_1", input: "[{ a: 1, b: 2 }, { b: 99, c: 3 }]", expectedOutput: "{ a: 1, b: 99, c: 3 }", isHidden: false },
      { id: "tc_162_2", input: "[{}, { a: 1 }]", expectedOutput: "{ a: 1 }", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_162_3", input: "[{ a: 1 }, {}]", expectedOutput: "{ a: 1 }", isHidden: true }
    ],
    solution: "function mergeShallow(obj1, obj2) {\n  return { ...obj1, ...obj2 };\n}",
    explanation: "Object spread `{ ...obj1, ...obj2 }` performs shallow merge.",
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(n + m)",
    hints: ["Use { ...obj1, ...obj2 }."]
  },
  {
    id: "JS-P163",
    number: 163,
    title: "Deep Merge Two Objects",
    slug: "js-p163-deep-merge-two-objects",
    category: "Objects",
    subcategory: "Merging",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Objects", "Recursion"],
    tags: ["objects", "deep-merge", "recursion"],
    expectedTime: "10 mins",
    summary: "Deeply merge nested objects recursively.",
    problemStatement: "Write a function `deepMerge(target, source)` that returns a new object combining `target` and `source` deeply.",
    examples: [
      { title: "Example 1", input: "[{ a: { b: 1, c: 2 } }, { a: { c: 99, d: 4 } }]", output: "{ a: { b: 1, c: 99, d: 4 } }", explanation: "Nested objects merged." }
    ],
    constraints: ["Plain objects without circular references."],
    starterCode: "function deepMerge(target, source) {\n  // Write your solution here\n}",
    functionName: "deepMerge",
    testCases: [
      { id: "tc_163_1", input: "[{ a: { b: 1, c: 2 } }, { a: { c: 99, d: 4 } }]", expectedOutput: "{ a: { b: 1, c: 99, d: 4 } }", isHidden: false },
      { id: "tc_163_2", input: "[{ a: 1 }, { b: 2 }]", expectedOutput: "{ a: 1, b: 2 }", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_163_3", input: "[{}, {}]", expectedOutput: "{}", isHidden: true }
    ],
    solution: "function deepMerge(target, source) {\n  const res = { ...target };\n  for (const k of Object.keys(source)) {\n    if (source[k] && typeof source[k] === 'object' && !Array.isArray(source[k]) && res[k] && typeof res[k] === 'object' && !Array.isArray(res[k])) {\n      res[k] = deepMerge(res[k], source[k]);\n    } else {\n      res[k] = source[k];\n    }\n  }\n  return res;\n}",
    explanation: "Recursively merge object properties while overwriting primitives.",
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(n + m)",
    hints: ["If both keys hold plain objects, recursively deepMerge them."]
  },
  {
    id: "JS-P164",
    number: 164,
    title: "Flatten Nested Object to Dot Notation",
    slug: "js-p164-flatten-nested-object-to-dot-notation",
    category: "Objects",
    subcategory: "Transformations",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Objects", "Recursion"],
    tags: ["objects", "flatten", "dot-notation"],
    expectedTime: "10 mins",
    summary: "Flatten a nested object into a single-level object with dot-delimited keys.",
    problemStatement: "Write a function `flattenObject(obj)` that flattens a nested object into dot paths (e.g. `{ a: { b: 1 } }` becomes `{ 'a.b': 1 }`).",
    examples: [
      { title: "Example 1", input: "[{ a: { b: 1, c: { d: 2 } }, e: 3 }]", output: "{ 'a.b': 1, 'a.c.d': 2, e: 3 }", explanation: "Flattened to dot notation." }
    ],
    constraints: ["Nested plain objects."],
    starterCode: "function flattenObject(obj) {\n  // Write your solution here\n}",
    functionName: "flattenObject",
    testCases: [
      { id: "tc_164_1", input: "[{ a: { b: 1, c: { d: 2 } }, e: 3 }]", expectedOutput: "{ 'a.b': 1, 'a.c.d': 2, e: 3 }", isHidden: false },
      { id: "tc_164_2", input: "[{ x: 10 }]", expectedOutput: "{ x: 10 }", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_164_3", input: "[{}]", expectedOutput: "{}", isHidden: true }
    ],
    solution: "function flattenObject(obj) {\n  const res = {};\n  function recurse(curr, prefix) {\n    for (const k of Object.keys(curr)) {\n      const val = curr[k];\n      const newKey = prefix ? prefix + '.' + k : k;\n      if (val && typeof val === 'object' && !Array.isArray(val) && Object.keys(val).length > 0) {\n        recurse(val, newKey);\n      } else {\n        res[newKey] = val;\n      }\n    }\n  }\n  recurse(obj, '');\n  return res;\n}",
    explanation: "Recursively build dot-prefixed keys and store leaf values.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use a helper function that passes the accumulated prefix string."]
  },
  {
    id: "JS-P165",
    number: 165,
    title: "Unflatten Object from Dot Notation",
    slug: "js-p165-unflatten-object-from-dot-notation",
    category: "Objects",
    subcategory: "Transformations",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Objects", "Path Traversal"],
    tags: ["objects", "unflatten", "dot-notation"],
    expectedTime: "10 mins",
    summary: "Reconstruct a nested object from a flattened dot-notation dictionary.",
    problemStatement: "Write a function `unflattenObject(obj)` that transforms a single-level dot-notated object back into its nested object hierarchy.",
    examples: [
      { title: "Example 1", input: "[{ 'a.b': 1, 'a.c.d': 2, e: 3 }]", output: "{ a: { b: 1, c: { d: 2 } }, e: 3 }", explanation: "Restored to hierarchy." }
    ],
    constraints: ["Keys are valid dot-notation paths."],
    starterCode: "function unflattenObject(obj) {\n  // Write your solution here\n}",
    functionName: "unflattenObject",
    testCases: [
      { id: "tc_165_1", input: "[{ 'a.b': 1, 'a.c.d': 2, e: 3 }]", expectedOutput: "{ a: { b: 1, c: { d: 2 } }, e: 3 }", isHidden: false },
      { id: "tc_165_2", input: "[{ x: 10 }]", expectedOutput: "{ x: 10 }", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_165_3", input: "[{}]", expectedOutput: "{}", isHidden: true }
    ],
    solution: "function unflattenObject(obj) {\n  const res = {};\n  for (const path of Object.keys(obj)) {\n    const parts = path.split('.');\n    let curr = res;\n    for (let i = 0; i < parts.length - 1; i++) {\n      const p = parts[i];\n      if (!curr[p]) curr[p] = {};\n      curr = curr[p];\n    }\n    curr[parts[parts.length - 1]] = obj[path];\n  }\n  return res;\n}",
    explanation: "Split each dot-path and populate nested objects.",
    timeComplexity: "O(n * path depth)",
    spaceComplexity: "O(n)",
    hints: ["Split each key on '.' and traverse/create intermediate objects."]
  },
  {
    id: "JS-P166",
    number: 166,
    title: "Deep Freeze an Object",
    slug: "js-p166-deep-freeze-an-object",
    category: "Objects",
    subcategory: "Immutability",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Objects", "Object.freeze"],
    tags: ["objects", "freeze", "immutability"],
    expectedTime: "5 mins",
    summary: "Recursively freeze an object and all nested object properties.",
    problemStatement: "Write a function `deepFreeze(obj)` that calls `Object.freeze` on `obj` and all nested objects recursively, returning `obj`.",
    examples: [
      { title: "Example 1", input: "[{ a: { b: 1 } }]", output: "{ a: { b: 1 } }", explanation: "Frozen deeply." }
    ],
    constraints: ["No circular references."],
    starterCode: "function deepFreeze(obj) {\n  // Write your solution here\n}",
    functionName: "deepFreeze",
    testCases: [
      { id: "tc_166_1", input: "[{ a: { b: 1 } }]", expectedOutput: "{ a: { b: 1 } }", isHidden: false },
      { id: "tc_166_2", input: "[{ x: 10 }]", expectedOutput: "{ x: 10 }", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_166_3", input: "[{}]", expectedOutput: "{}", isHidden: true }
    ],
    solution: "function deepFreeze(obj) {\n  if (obj && typeof obj === 'object') {\n    Object.freeze(obj);\n    for (const k of Object.keys(obj)) deepFreeze(obj[k]);\n  }\n  return obj;\n}",
    explanation: "Call Object.freeze(obj) and recurse on all nested properties.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(depth)",
    hints: ["Call Object.freeze on obj, then recurse on child object values."]
  },
  {
    id: "JS-P167",
    number: 167,
    title: "Convert Object to Query String",
    slug: "js-p167-convert-object-to-query-string",
    category: "Objects",
    subcategory: "URL Utilities",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "URL"],
    tags: ["objects", "querystring", "encode"],
    expectedTime: "5 mins",
    summary: "Format a key-value object into a URL query parameter string.",
    problemStatement: "Write a function `toQueryString(params)` that serializes flat object `params` into a query string prefixed with `'?'` (or `''` if empty). Keys and values should be URI encoded.",
    examples: [
      { title: "Example 1", input: "[{ search: 'js books', page: 1 }]", output: "'?search=js%20books&page=1'", explanation: "Encoded parameters." },
      { title: "Example 2", input: "[{}]", output: "''", explanation: "Empty params produce empty string." }
    ],
    constraints: ["Flat object with primitive values."],
    starterCode: "function toQueryString(params) {\n  // Write your solution here\n}",
    functionName: "toQueryString",
    testCases: [
      { id: "tc_167_1", input: "[{ search: 'js books', page: 1 }]", expectedOutput: "'?search=js%20books&page=1'", isHidden: false },
      { id: "tc_167_2", input: "[{}]", expectedOutput: "''", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_167_3", input: "[{ q: 'test' }]", expectedOutput: "'?q=test'", isHidden: true }
    ],
    solution: "function toQueryString(params) {\n  const keys = Object.keys(params);\n  if (keys.length === 0) return '';\n  return '?' + keys.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');\n}",
    explanation: "Encode key and value with encodeURIComponent and join with '&'.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use encodeURIComponent for both keys and values and join with '&'."]
  },
  {
    id: "JS-P168",
    number: 168,
    title: "Parse Query String into Object",
    slug: "js-p168-parse-query-string-into-object",
    category: "Objects",
    subcategory: "URL Utilities",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "URL"],
    tags: ["objects", "querystring", "decode"],
    expectedTime: "5 mins",
    summary: "Parse a URL query string into an object dictionary.",
    problemStatement: "Write a function `fromQueryString(queryString)` that parses a query string (with or without leading `'?'`) into an object.",
    examples: [
      { title: "Example 1", input: "['?name=Alice&age=25']", output: "{ name: 'Alice', age: '25' }", explanation: "Parsed into object." },
      { title: "Example 2", input: "['']", output: "{}", explanation: "Empty string gives {}." }
    ],
    constraints: ["0 <= queryString.length <= 1000"],
    starterCode: "function fromQueryString(queryString) {\n  // Write your solution here\n}",
    functionName: "fromQueryString",
    testCases: [
      { id: "tc_168_1", input: "['?name=Alice&age=25']", expectedOutput: "{ name: 'Alice', age: '25' }", isHidden: false },
      { id: "tc_168_2", input: "['']", expectedOutput: "{}", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_168_3", input: "['search=js%20books']", expectedOutput: "{ search: 'js books' }", isHidden: true }
    ],
    solution: "function fromQueryString(queryString) {\n  const str = queryString.replace(/^\\?/, '');\n  if (!str) return {};\n  const res = {};\n  for (const pair of str.split('&')) {\n    const [k, v] = pair.split('=');\n    if (k) res[decodeURIComponent(k)] = v !== undefined ? decodeURIComponent(v) : '';\n  }\n  return res;\n}",
    explanation: "Strip leading '?', split on '&', decodeURIComponent both key and value.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Strip '?', split on '&', then split on '=' and decodeURIComponent."]
  },
  {
    id: "JS-P169",
    number: 169,
    title: "Transform Object Keys to Uppercase",
    slug: "js-p169-transform-object-keys-to-uppercase",
    category: "Objects",
    subcategory: "Transformations",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "Keys"],
    tags: ["objects", "uppercase", "transform"],
    expectedTime: "5 mins",
    summary: "Return a new object with all keys converted to uppercase.",
    problemStatement: "Write a function `uppercaseKeys(obj)` that transforms all own keys in `obj` to uppercase.",
    examples: [
      { title: "Example 1", input: "[{ name: 'John', age: 30 }]", output: "{ NAME: 'John', AGE: 30 }", explanation: "Keys uppercased." }
    ],
    constraints: ["Flat object."],
    starterCode: "function uppercaseKeys(obj) {\n  // Write your solution here\n}",
    functionName: "uppercaseKeys",
    testCases: [
      { id: "tc_169_1", input: "[{ name: 'John', age: 30 }]", expectedOutput: "{ NAME: 'John', AGE: 30 }", isHidden: false },
      { id: "tc_169_2", input: "[{}]", expectedOutput: "{}", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_169_3", input: "[{ a: 1, b: 2 }]", expectedOutput: "{ A: 1, B: 2 }", isHidden: true }
    ],
    solution: "function uppercaseKeys(obj) {\n  const res = {};\n  for (const k of Object.keys(obj)) res[k.toUpperCase()] = obj[k];\n  return res;\n}",
    explanation: "Iterate Object.keys and assign to res[k.toUpperCase()].",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Assign res[k.toUpperCase()] = obj[k]."]
  },
  {
    id: "JS-P170",
    number: 170,
    title: "Transform Object Values by Doubling",
    slug: "js-p170-transform-object-values-by-doubling",
    category: "Objects",
    subcategory: "Transformations",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "Mapping"],
    tags: ["objects", "values", "map"],
    expectedTime: "5 mins",
    summary: "Return a new object with every numeric value multiplied by 2.",
    problemStatement: "Write a function `doubleObjectValues(obj)` that returns a new object where all numeric values in `obj` are doubled.",
    examples: [
      { title: "Example 1", input: "[{ a: 1, b: 2, c: 3 }]", output: "{ a: 2, b: 4, c: 6 }", explanation: "Values doubled." }
    ],
    constraints: ["Values are numbers."],
    starterCode: "function doubleObjectValues(obj) {\n  // Write your solution here\n}",
    functionName: "doubleObjectValues",
    testCases: [
      { id: "tc_170_1", input: "[{ a: 1, b: 2, c: 3 }]", expectedOutput: "{ a: 2, b: 4, c: 6 }", isHidden: false },
      { id: "tc_170_2", input: "[{}]", expectedOutput: "{}", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_170_3", input: "[{ x: 10 }]", expectedOutput: "{ x: 20 }", isHidden: true }
    ],
    solution: "function doubleObjectValues(obj) {\n  const res = {};\n  for (const k of Object.keys(obj)) res[k] = obj[k] * 2;\n  return res;\n}",
    explanation: "Multiply each value by 2.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Assign res[k] = obj[k] * 2."]
  },
  {
    id: "JS-P171",
    number: 171,
    title: "Filter Object to Positive Numerical Values",
    slug: "js-p171-filter-object-to-positive-numerical-values",
    category: "Objects",
    subcategory: "Filtering",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "Filtering"],
    tags: ["objects", "filter", "values"],
    expectedTime: "5 mins",
    summary: "Return a new object retaining only entries where value is a number > 0.",
    problemStatement: "Write a function `filterPositiveValues(obj)` that returns a new object containing only properties whose value is strictly greater than 0.",
    examples: [
      { title: "Example 1", input: "[{ a: 5, b: -2, c: 0, d: 10 }]", output: "{ a: 5, d: 10 }", explanation: "Only 5 and 10 are positive." }
    ],
    constraints: ["Flat object with numbers."],
    starterCode: "function filterPositiveValues(obj) {\n  // Write your solution here\n}",
    functionName: "filterPositiveValues",
    testCases: [
      { id: "tc_171_1", input: "[{ a: 5, b: -2, c: 0, d: 10 }]", expectedOutput: "{ a: 5, d: 10 }", isHidden: false },
      { id: "tc_171_2", input: "[{ x: -1 }]", expectedOutput: "{}", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_171_3", input: "[{}]", expectedOutput: "{}", isHidden: true }
    ],
    solution: "function filterPositiveValues(obj) {\n  const res = {};\n  for (const k of Object.keys(obj)) {\n    if (obj[k] > 0) res[k] = obj[k];\n  }\n  return res;\n}",
    explanation: "Filter entries with obj[k] > 0.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Check if obj[k] > 0."]
  },
  {
    id: "JS-P172",
    number: 172,
    title: "Count Total Number of Keys in Nested Object",
    slug: "js-p172-count-total-number-of-keys-in-nested-object",
    category: "Objects",
    subcategory: "Recursion",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Objects", "Recursion"],
    tags: ["objects", "keys", "counting"],
    expectedTime: "10 mins",
    summary: "Recursively count all property keys at every level of a nested object.",
    problemStatement: "Write a function `countKeysDeep(obj)` that counts every property key across all levels of nesting in `obj`.",
    examples: [
      { title: "Example 1", input: "[{ a: 1, b: { c: 2, d: { e: 3 } } }]", output: "5", explanation: "Keys: a, b, c, d, e = 5 keys." }
    ],
    constraints: ["Nested plain objects."],
    starterCode: "function countKeysDeep(obj) {\n  // Write your solution here\n}",
    functionName: "countKeysDeep",
    testCases: [
      { id: "tc_172_1", input: "[{ a: 1, b: { c: 2, d: { e: 3 } } }]", expectedOutput: "5", isHidden: false },
      { id: "tc_172_2", input: "[{}]", expectedOutput: "0", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_172_3", input: "[{ x: 1, y: 2 }]", expectedOutput: "2", isHidden: true }
    ],
    solution: "function countKeysDeep(obj) {\n  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return 0;\n  let count = 0;\n  for (const k of Object.keys(obj)) {\n    count++;\n    count += countKeysDeep(obj[k]);\n  }\n  return count;\n}",
    explanation: "Increment count for each own key and recursively add nested keys.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(depth)",
    hints: ["Count keys of current object + recurse on each value if it's an object."]
  },
  {
    id: "JS-P173",
    number: 173,
    title: "Check if Two Objects Have Identical Shallow Keys",
    slug: "js-p173-check-if-two-objects-have-identical-shallow-keys",
    category: "Objects",
    subcategory: "Comparison",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "Keys"],
    tags: ["objects", "keys", "comparison"],
    expectedTime: "5 mins",
    summary: "Determine if two objects possess the exact same set of own keys regardless of values.",
    problemStatement: "Write a function `sameKeys(obj1, obj2)` that returns `true` if `obj1` and `obj2` have the exact same own enumerable keys, otherwise `false`.",
    examples: [
      { title: "Example 1", input: "[{ a: 1, b: 2 }, { b: 99, a: 'test' }]", output: "true", explanation: "Same keys 'a' and 'b'." },
      { title: "Example 2", input: "[{ a: 1 }, { a: 1, b: 2 }]", output: "false", explanation: "Different keys." }
    ],
    constraints: ["obj1, obj2 are objects."],
    starterCode: "function sameKeys(obj1, obj2) {\n  // Write your solution here\n}",
    functionName: "sameKeys",
    testCases: [
      { id: "tc_173_1", input: "[{ a: 1, b: 2 }, { b: 99, a: 'test' }]", expectedOutput: "true", isHidden: false },
      { id: "tc_173_2", input: "[{ a: 1 }, { a: 1, b: 2 }]", expectedOutput: "false", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_173_3", input: "[{}, {}]", expectedOutput: "true", isHidden: true }
    ],
    solution: "function sameKeys(obj1, obj2) {\n  const k1 = Object.keys(obj1).sort();\n  const k2 = Object.keys(obj2).sort();\n  if (k1.length !== k2.length) return false;\n  return k1.every((k, i) => k === k2[i]);\n}",
    explanation: "Compare sorted keys arrays for exact equality.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    hints: ["Compare sorted Object.keys arrays."]
  },
  {
    id: "JS-P174",
    number: 174,
    title: "Find Keys with Differing Values Between Two Flat Objects",
    slug: "js-p174-find-keys-with-differing-values-between-two-flat-objects",
    category: "Objects",
    subcategory: "Comparison",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "Comparison"],
    tags: ["objects", "diff", "keys"],
    expectedTime: "5 mins",
    summary: "Return sorted array of keys whose values differ or which only exist in one of the objects.",
    problemStatement: "Write a function `diffKeys(obj1, obj2)` that returns a sorted array of keys where `obj1[k] !== obj2[k]` or where `k` only exists in one object.",
    examples: [
      { title: "Example 1", input: "[{ a: 1, b: 2, c: 3 }, { a: 1, b: 99, d: 4 }]", output: "['b', 'c', 'd']", explanation: "b differs, c only in obj1, d only in obj2." }
    ],
    constraints: ["Flat objects."],
    starterCode: "function diffKeys(obj1, obj2) {\n  // Write your solution here\n}",
    functionName: "diffKeys",
    testCases: [
      { id: "tc_174_1", input: "[{ a: 1, b: 2, c: 3 }, { a: 1, b: 99, d: 4 }]", expectedOutput: "['b', 'c', 'd']", isHidden: false },
      { id: "tc_174_2", input: "[{ a: 1 }, { a: 1 }]", expectedOutput: "[]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_174_3", input: "[{}, { x: 1 }]", expectedOutput: "['x']", isHidden: true }
    ],
    solution: "function diffKeys(obj1, obj2) {\n  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);\n  const diff = [];\n  for (const k of allKeys) {\n    if (obj1[k] !== obj2[k]) diff.push(k);\n  }\n  return diff.sort();\n}",
    explanation: "Union all keys in a Set and find those where obj1[k] !== obj2[k].",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    hints: ["Collect unique keys in a Set, filter those where values differ, then sort."]
  },
  {
    id: "JS-P175",
    number: 175,
    title: "Convert Array of Objects to Lookup Map by Key",
    slug: "js-p175-convert-array-of-objects-to-lookup-map-by-key",
    category: "Objects",
    subcategory: "Lookup Table",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "keyBy"],
    tags: ["objects", "keyBy", "lookup"],
    expectedTime: "5 mins",
    summary: "Index an array of objects by a designated property value.",
    problemStatement: "Write a function `keyBy(arr, key)` that transforms an array of objects into an object indexed by each item's `[key]` value.",
    examples: [
      { title: "Example 1", input: "[[{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }], 'id']", output: "{ '1': { id: 1, name: 'Alice' }, '2': { id: 2, name: 'Bob' } }", explanation: "Indexed by id." }
    ],
    constraints: ["Items are objects with specified key."],
    starterCode: "function keyBy(arr, key) {\n  // Write your solution here\n}",
    functionName: "keyBy",
    testCases: [
      { id: "tc_175_1", input: "[[{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }], 'id']", expectedOutput: "{ '1': { id: 1, name: 'Alice' }, '2': { id: 2, name: 'Bob' } }", isHidden: false },
      { id: "tc_175_2", input: "[[], 'id']", expectedOutput: "{}", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_175_3", input: "[[{ code: 'US' }], 'code']", expectedOutput: "{ US: { code: 'US' } }", isHidden: true }
    ],
    solution: "function keyBy(arr, key) {\n  const res = {};\n  for (const item of arr) {\n    res[item[key]] = item;\n  }\n  return res;\n}",
    explanation: "Iterate array and assign res[item[key]] = item.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Assign res[item[key]] = item for each object."]
  },
  {
    id: "JS-P176",
    number: 176,
    title: "Group Array of Objects by Property",
    slug: "js-p176-group-array-of-objects-by-property",
    category: "Objects",
    subcategory: "Grouping",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "groupBy"],
    tags: ["objects", "groupBy", "grouping"],
    expectedTime: "5 mins",
    summary: "Group array items into an object of arrays based on a property value.",
    problemStatement: "Write a function `groupByProp(arr, prop)` that groups objects by their value for property `prop`.",
    examples: [
      { title: "Example 1", input: "[[{ role: 'admin', name: 'A' }, { role: 'user', name: 'B' }, { role: 'admin', name: 'C' }], 'role']", output: "{ admin: [{ role: 'admin', name: 'A' }, { role: 'admin', name: 'C' }], user: [{ role: 'user', name: 'B' }] }", explanation: "Grouped by role." }
    ],
    constraints: ["Array of objects."],
    starterCode: "function groupByProp(arr, prop) {\n  // Write your solution here\n}",
    functionName: "groupByProp",
    testCases: [
      { id: "tc_176_1", input: "[[{ role: 'admin', name: 'A' }, { role: 'user', name: 'B' }, { role: 'admin', name: 'C' }], 'role']", expectedOutput: "{ admin: [{ role: 'admin', name: 'A' }, { role: 'admin', name: 'C' }], user: [{ role: 'user', name: 'B' }] }", isHidden: false },
      { id: "tc_176_2", input: "[[], 'role']", expectedOutput: "{}", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_176_3", input: "[[{ type: 'x' }], 'type']", expectedOutput: "{ x: [{ type: 'x' }] }", isHidden: true }
    ],
    solution: "function groupByProp(arr, prop) {\n  const res = {};\n  for (const item of arr) {\n    const val = item[prop];\n    if (!res[val]) res[val] = [];\n    res[val].push(item);\n  }\n  return res;\n}",
    explanation: "Initialize array at res[val] if not present and push item.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Check if !res[val] initialize to [], then push item."]
  },
  {
    id: "JS-P177",
    number: 177,
    title: "Sort Array of Objects by Numeric Property",
    slug: "js-p177-sort-array-of-objects-by-numeric-property",
    category: "Objects",
    subcategory: "Sorting",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "Sorting"],
    tags: ["objects", "sort", "comparator"],
    expectedTime: "5 mins",
    summary: "Sort an array of objects in ascending order by a numeric property.",
    problemStatement: "Write a function `sortByProp(arr, prop)` that returns a new array sorted in ascending order by numeric property `prop`.",
    examples: [
      { title: "Example 1", input: "[[{ name: 'B', age: 25 }, { name: 'A', age: 20 }], 'age']", output: "[{ name: 'A', age: 20 }, { name: 'B', age: 25 }]", explanation: "Sorted by age." }
    ],
    constraints: ["Property holds numeric values."],
    starterCode: "function sortByProp(arr, prop) {\n  // Write your solution here\n}",
    functionName: "sortByProp",
    testCases: [
      { id: "tc_177_1", input: "[[{ name: 'B', age: 25 }, { name: 'A', age: 20 }], 'age']", expectedOutput: "[{ name: 'A', age: 20 }, { name: 'B', age: 25 }]", isHidden: false },
      { id: "tc_177_2", input: "[[], 'age']", expectedOutput: "[]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_177_3", input: "[[{ score: 100 }, { score: 50 }, { score: 75 }], 'score']", expectedOutput: "[{ score: 50 }, { score: 75 }, { score: 100 }]", isHidden: true }
    ],
    solution: "function sortByProp(arr, prop) {\n  return [...arr].sort((a, b) => a[prop] - b[prop]);\n}",
    explanation: "Spread and sort with comparator (a, b) => a[prop] - b[prop].",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    hints: ["Use [...arr].sort((a, b) => a[prop] - b[prop])."]
  },
  {
    id: "JS-P178",
    number: 178,
    title: "Extract Unique Values of Property from Array of Objects",
    slug: "js-p178-extract-unique-values-of-property-from-array-of-objects",
    category: "Objects",
    subcategory: "Pluck",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "Set"],
    tags: ["objects", "pluck", "unique"],
    expectedTime: "5 mins",
    summary: "Return an array of distinct values for a given property across all objects in an array.",
    problemStatement: "Write a function `pluckUnique(arr, prop)` that extracts all unique values of `prop` from `arr`, in order of appearance.",
    examples: [
      { title: "Example 1", input: "[[{ cat: 'tech' }, { cat: 'health' }, { cat: 'tech' }], 'cat']", output: "['tech', 'health']", explanation: "Unique categories." }
    ],
    constraints: ["Array of objects."],
    starterCode: "function pluckUnique(arr, prop) {\n  // Write your solution here\n}",
    functionName: "pluckUnique",
    testCases: [
      { id: "tc_178_1", input: "[[{ cat: 'tech' }, { cat: 'health' }, { cat: 'tech' }], 'cat']", expectedOutput: "['tech', 'health']", isHidden: false },
      { id: "tc_178_2", input: "[[], 'prop']", expectedOutput: "[]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_178_3", input: "[[{ id: 1 }, { id: 2 }, { id: 1 }], 'id']", expectedOutput: "[1, 2]", isHidden: true }
    ],
    solution: "function pluckUnique(arr, prop) {\n  return Array.from(new Set(arr.map(x => x[prop])));\n}",
    explanation: "Map to property and wrap in a Set.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use Array.from(new Set(arr.map(x => x[prop])))."]
  },
  {
    id: "JS-P179",
    number: 179,
    title: "Sum Numeric Property Across Array of Objects",
    slug: "js-p179-sum-numeric-property-across-array-of-objects",
    category: "Objects",
    subcategory: "Aggregation",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "Reduce"],
    tags: ["objects", "sum", "reduce"],
    expectedTime: "5 mins",
    summary: "Calculate the sum of a specific numeric property across an array of objects.",
    problemStatement: "Write a function `sumByProp(arr, prop)` that sums all numbers found in `item[prop]` for objects in `arr`.",
    examples: [
      { title: "Example 1", input: "[[{ amount: 10 }, { amount: 25 }, { amount: 15 }], 'amount']", output: "50", explanation: "10 + 25 + 15 = 50." }
    ],
    constraints: ["Amounts are numbers."],
    starterCode: "function sumByProp(arr, prop) {\n  // Write your solution here\n}",
    functionName: "sumByProp",
    testCases: [
      { id: "tc_179_1", input: "[[{ amount: 10 }, { amount: 25 }, { amount: 15 }], 'amount']", expectedOutput: "50", isHidden: false },
      { id: "tc_179_2", input: "[[], 'amount']", expectedOutput: "0", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_179_3", input: "[[{ val: 100 }], 'val']", expectedOutput: "100", isHidden: true }
    ],
    solution: "function sumByProp(arr, prop) {\n  return arr.reduce((acc, item) => acc + (item[prop] || 0), 0);\n}",
    explanation: "Reduce summing item[prop] starting from 0.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hints: ["Use arr.reduce((acc, item) => acc + (item[prop] || 0), 0)."]
  },
  {
    id: "JS-P180",
    number: 180,
    title: "Swap Keys and Values for Multi-Value Mapping",
    slug: "js-p180-swap-keys-and-values-for-multi-value-mapping",
    category: "Objects",
    subcategory: "Inversion",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Objects", "Inversion"],
    tags: ["objects", "invert", "multi-value"],
    expectedTime: "10 mins",
    summary: "Invert an object where duplicate values are grouped into arrays of keys.",
    problemStatement: "Write a function `invertMultiValue(obj)` that inverts `obj` such that each value maps to an array of keys that shared that value.",
    examples: [
      { title: "Example 1", input: "[{ a: 1, b: 2, c: 1 }]", output: "{ '1': ['a', 'c'], '2': ['b'] }", explanation: "1 maps to ['a', 'c']." }
    ],
    constraints: ["Values can be converted to string keys."],
    starterCode: "function invertMultiValue(obj) {\n  // Write your solution here\n}",
    functionName: "invertMultiValue",
    testCases: [
      { id: "tc_180_1", input: "[{ a: 1, b: 2, c: 1 }]", expectedOutput: "{ '1': ['a', 'c'], '2': ['b'] }", isHidden: false },
      { id: "tc_180_2", input: "[{}]", expectedOutput: "{}", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_180_3", input: "[{ x: 'test', y: 'test' }]", expectedOutput: "{ test: ['x', 'y'] }", isHidden: true }
    ],
    solution: "function invertMultiValue(obj) {\n  const res = {};\n  for (const k of Object.keys(obj)) {\n    const val = obj[k];\n    if (!res[val]) res[val] = [];\n    res[val].push(k);\n  }\n  return res;\n}",
    explanation: "Group keys by their mapped value into arrays.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["For each key k, push k into res[obj[k]]."]
  },
  {
    id: "JS-P181",
    number: 181,
    title: "Check if Object Contains Circular Reference",
    slug: "js-p181-check-if-object-contains-circular-reference",
    category: "Objects",
    subcategory: "Graph Traversal",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Objects", "WeakSet"],
    tags: ["objects", "circular", "reference"],
    expectedTime: "10 mins",
    summary: "Detect whether an object tree contains a circular loop reference.",
    problemStatement: "Write a function `hasCircularReference(obj)` that returns `true` if `obj` references an ancestor in its traversal tree, otherwise `false`.",
    examples: [
      { title: "Example 1", input: "[{ a: 1, b: { c: 2 } }]", output: "false", explanation: "No circular references." }
    ],
    constraints: ["Object graph with arbitrary nesting."],
    starterCode: "function hasCircularReference(obj) {\n  // Write your solution here\n}",
    functionName: "hasCircularReference",
    testCases: [
      { id: "tc_181_1", input: "[{ a: 1, b: { c: 2 } }]", expectedOutput: "false", isHidden: false },
      { id: "tc_181_2", input: "[{ x: 10 }]", expectedOutput: "false", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_181_3", input: "[{}]", expectedOutput: "false", isHidden: true }
    ],
    solution: "function hasCircularReference(obj) {\n  const seen = new Set();\n  function check(curr) {\n    if (curr && typeof curr === 'object') {\n      if (seen.has(curr)) return true;\n      seen.add(curr);\n      for (const k of Object.keys(curr)) {\n        if (check(curr[k])) return true;\n      }\n      seen.delete(curr);\n    }\n    return false;\n  }\n  return check(obj);\n}",
    explanation: "Use DFS with a visited Set tracking ancestors on the current recursion path.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(depth)",
    hints: ["Use DFS and add/remove objects from a Set representing the current traversal stack."]
  },
  {
    id: "JS-P182",
    number: 182,
    title: "Create Object with Prototype from Scratch",
    slug: "js-p182-create-object-with-prototype-from-scratch",
    category: "Objects",
    subcategory: "Prototypes",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "Object.create"],
    tags: ["objects", "prototype", "create"],
    expectedTime: "5 mins",
    summary: "Create an object linked to a given prototype and assign own properties.",
    problemStatement: "Write a function `createWithProto(proto, props)` that returns a new object with prototype `proto` and own properties from `props`.",
    examples: [
      { title: "Example 1", input: "[{ greet: 'hello' }, { name: 'Alice' }]", output: "{ name: 'Alice' }", explanation: "Own property is name, prototype is greet." }
    ],
    constraints: ["proto is object or null."],
    starterCode: "function createWithProto(proto, props) {\n  // Write your solution here\n}",
    functionName: "createWithProto",
    testCases: [
      { id: "tc_182_1", input: "[{ greet: 'hello' }, { name: 'Alice' }]", expectedOutput: "{ name: 'Alice' }", isHidden: false },
      { id: "tc_182_2", input: "[null, { a: 1 }]", expectedOutput: "{ a: 1 }", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_182_3", input: "[{}, {}]", expectedOutput: "{}", isHidden: true }
    ],
    solution: "function createWithProto(proto, props) {\n  return Object.assign(Object.create(proto), props);\n}",
    explanation: "Object.create(proto) establishes the prototype chain and Object.assign adds own properties.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use Object.assign(Object.create(proto), props)."]
  },
  {
    id: "JS-P183",
    number: 183,
    title: "Rename Specific Keys in Object",
    slug: "js-p183-rename-specific-keys-in-object",
    category: "Objects",
    subcategory: "Transformations",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "Keys"],
    tags: ["objects", "rename", "keys"],
    expectedTime: "5 mins",
    summary: "Rename specified keys according to a key mapping dictionary.",
    problemStatement: "Write a function `renameKeys(obj, keyMap)` that returns a new object where keys present in `keyMap` are renamed to `keyMap[key]`.",
    examples: [
      { title: "Example 1", input: "[{ oldA: 1, oldB: 2, c: 3 }, { oldA: 'newA', oldB: 'newB' }]", output: "{ newA: 1, newB: 2, c: 3 }", explanation: "oldA and oldB renamed." }
    ],
    constraints: ["Flat object."],
    starterCode: "function renameKeys(obj, keyMap) {\n  // Write your solution here\n}",
    functionName: "renameKeys",
    testCases: [
      { id: "tc_183_1", input: "[{ oldA: 1, oldB: 2, c: 3 }, { oldA: 'newA', oldB: 'newB' }]", expectedOutput: "{ newA: 1, newB: 2, c: 3 }", isHidden: false },
      { id: "tc_183_2", input: "[{ a: 1 }, {}]", expectedOutput: "{ a: 1 }", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_183_3", input: "[{}, { x: 'y' }]", expectedOutput: "{}", isHidden: true }
    ],
    solution: "function renameKeys(obj, keyMap) {\n  const res = {};\n  for (const k of Object.keys(obj)) {\n    const targetKey = keyMap[k] !== undefined ? keyMap[k] : k;\n    res[targetKey] = obj[k];\n  }\n  return res;\n}",
    explanation: "Map each key through keyMap or keep original if not in map.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use keyMap[k] || k as the destination key."]
  },
  {
    id: "JS-P184",
    number: 184,
    title: "Clean Object by Removing Null and Undefined Properties",
    slug: "js-p184-clean-object-by-removing-null-and-undefined-properties",
    category: "Objects",
    subcategory: "Sanitization",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "Sanitization"],
    tags: ["objects", "clean", "null-check"],
    expectedTime: "5 mins",
    summary: "Remove all properties that have null or undefined values.",
    problemStatement: "Write a function `compactObject(obj)` that returns a shallow copy of `obj` omitting keys whose values are `null` or `undefined`.",
    examples: [
      { title: "Example 1", input: "[{ a: 1, b: null, c: undefined, d: 0, e: false }]", output: "{ a: 1, d: 0, e: false }", explanation: "Only null and undefined are removed; 0 and false are kept." }
    ],
    constraints: ["Flat object."],
    starterCode: "function compactObject(obj) {\n  // Write your solution here\n}",
    functionName: "compactObject",
    testCases: [
      { id: "tc_184_1", input: "[{ a: 1, b: null, c: undefined, d: 0, e: false }]", expectedOutput: "{ a: 1, d: 0, e: false }", isHidden: false },
      { id: "tc_184_2", input: "[{ a: null }]", expectedOutput: "{}", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_184_3", input: "[{ a: 'valid' }]", expectedOutput: "{ a: 'valid' }", isHidden: true }
    ],
    solution: "function compactObject(obj) {\n  const res = {};\n  for (const k of Object.keys(obj)) {\n    if (obj[k] !== null && obj[k] !== undefined) res[k] = obj[k];\n  }\n  return res;\n}",
    explanation: "Check obj[k] !== null && obj[k] !== undefined.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Filter out keys where value == null."]
  },
  {
    id: "JS-P185",
    number: 185,
    title: "Convert Key-Value Pairs Array to Object (fromEntries)",
    slug: "js-p185-convert-key-value-pairs-array-to-object-fromentries",
    category: "Objects",
    subcategory: "Transformations",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "fromEntries"],
    tags: ["objects", "entries", "pairs"],
    expectedTime: "5 mins",
    summary: "Reconstruct an object from an array of [key, value] pairs.",
    problemStatement: "Write a function `objectFromPairs(pairs)` that converts an array of `[key, value]` pairs into an object.",
    examples: [
      { title: "Example 1", input: "[[['a', 1], ['b', 2]]]", output: "{ a: 1, b: 2 }", explanation: "Constructed object." }
    ],
    constraints: ["pairs is an array of 2-element tuples."],
    starterCode: "function objectFromPairs(pairs) {\n  // Write your solution here\n}",
    functionName: "objectFromPairs",
    testCases: [
      { id: "tc_185_1", input: "[[['a', 1], ['b', 2]]]", expectedOutput: "{ a: 1, b: 2 }", isHidden: false },
      { id: "tc_185_2", input: "[[]]", expectedOutput: "{}", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_185_3", input: "[[['name', 'Alice']]]", expectedOutput: "{ name: 'Alice' }", isHidden: true }
    ],
    solution: "function objectFromPairs(pairs) {\n  return Object.fromEntries(pairs);\n}",
    explanation: "Object.fromEntries transforms iterable pairs to an object.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use Object.fromEntries(pairs)."]
  },
  {
    id: "JS-P186",
    number: 186,
    title: "Convert Object to Key-Value Pairs Array (entries)",
    slug: "js-p186-convert-object-to-key-value-pairs-array-entries",
    category: "Objects",
    subcategory: "Transformations",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "entries"],
    tags: ["objects", "entries", "pairs"],
    expectedTime: "5 mins",
    summary: "Return an array of an object's own enumerable string-keyed [key, value] pairs.",
    problemStatement: "Write a function `objectToPairs(obj)` that returns an array of `[key, value]` pairs from `obj`.",
    examples: [
      { title: "Example 1", input: "[{ a: 1, b: 2 }]", output: "[['a', 1], ['b', 2]]", explanation: "Pairs array." }
    ],
    constraints: ["obj is an object."],
    starterCode: "function objectToPairs(obj) {\n  // Write your solution here\n}",
    functionName: "objectToPairs",
    testCases: [
      { id: "tc_186_1", input: "[{ a: 1, b: 2 }]", expectedOutput: "[['a', 1], ['b', 2]]", isHidden: false },
      { id: "tc_186_2", input: "[{}]", expectedOutput: "[]", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_186_3", input: "[{ x: 'test' }]", expectedOutput: "[['x', 'test']]", isHidden: true }
    ],
    solution: "function objectToPairs(obj) {\n  return Object.entries(obj);\n}",
    explanation: "Object.entries returns [key, value] pairs.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use Object.entries(obj)."]
  },
  {
    id: "JS-P187",
    number: 187,
    title: "Get All Primitive Leaf Values from Nested Object",
    slug: "js-p187-get-all-primitive-leaf-values-from-nested-object",
    category: "Objects",
    subcategory: "Recursion",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Objects", "Recursion"],
    tags: ["objects", "leaf-values", "recursion"],
    expectedTime: "10 mins",
    summary: "Traverse a nested object structure and collect all primitive values in an array.",
    problemStatement: "Write a function `collectAllValues(obj)` that traverses nested objects/arrays and returns an array of all primitive leaf values.",
    examples: [
      { title: "Example 1", input: "[{ a: 1, b: { c: 2, d: [3, 4] } }]", output: "[1, 2, 3, 4]", explanation: "All leaf values collected." }
    ],
    constraints: ["Nested structure with primitives."],
    starterCode: "function collectAllValues(obj) {\n  // Write your solution here\n}",
    functionName: "collectAllValues",
    testCases: [
      { id: "tc_187_1", input: "[{ a: 1, b: { c: 2, d: [3, 4] } }]", expectedOutput: "[1, 2, 3, 4]", isHidden: false },
      { id: "tc_187_2", input: "[{ x: 'hello' }]", expectedOutput: "['hello']", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_187_3", input: "[{}]", expectedOutput: "[]", isHidden: true }
    ],
    solution: "function collectAllValues(obj) {\n  const res = [];\n  function recurse(curr) {\n    if (curr === null || typeof curr !== 'object') {\n      res.push(curr);\n      return;\n    }\n    for (const k of Object.keys(curr)) recurse(curr[k]);\n  }\n  recurse(obj);\n  return res;\n}",
    explanation: "DFS through keys, pushing non-objects to result.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["DFS: if typeof curr !== 'object' or null, push to array."]
  },
  {
    id: "JS-P188",
    number: 188,
    title: "Mask Sensitive Keys in Object",
    slug: "js-p188-mask-sensitive-keys-in-object",
    category: "Objects",
    subcategory: "Sanitization",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "Security"],
    tags: ["objects", "mask", "security"],
    expectedTime: "5 mins",
    summary: "Replace values of designated sensitive keys with '*****'.",
    problemStatement: "Write a function `maskSensitiveKeys(obj, keysToMask)` that returns a shallow copy of `obj` with values of keys in `keysToMask` replaced with `'*****'`.",
    examples: [
      { title: "Example 1", input: "[{ username: 'john', password: 'secret123', token: 'xyz' }, ['password', 'token']]", output: "{ username: 'john', password: '*****', token: '*****' }", explanation: "Password and token masked." }
    ],
    constraints: ["Flat object."],
    starterCode: "function maskSensitiveKeys(obj, keysToMask) {\n  // Write your solution here\n}",
    functionName: "maskSensitiveKeys",
    testCases: [
      { id: "tc_188_1", input: "[{ username: 'john', password: 'secret123', token: 'xyz' }, ['password', 'token']]", expectedOutput: "{ username: 'john', password: '*****', token: '*****' }", isHidden: false },
      { id: "tc_188_2", input: "[{ a: 1 }, []]", expectedOutput: "{ a: 1 }", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_188_3", input: "[{}, ['pwd']]", expectedOutput: "{}", isHidden: true }
    ],
    solution: "function maskSensitiveKeys(obj, keysToMask) {\n  const maskSet = new Set(keysToMask);\n  const res = {};\n  for (const k of Object.keys(obj)) {\n    res[k] = maskSet.has(k) ? '*****' : obj[k];\n  }\n  return res;\n}",
    explanation: "Check membership in maskSet; assign '*****' if present.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Check if keysToMask has k, then assign '*****'."]
  },
  {
    id: "JS-P189",
    number: 189,
    title: "Deep Compare Two Objects for Structural Equality",
    slug: "js-p189-deep-compare-two-objects-for-structural-equality",
    category: "Objects",
    subcategory: "Equality",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Objects", "Deep Equality"],
    tags: ["objects", "isEqual", "comparison"],
    expectedTime: "10 mins",
    summary: "Determine if two objects or values are deeply structurally equal.",
    problemStatement: "Write a function `isEqual(a, b)` that performs a deep comparison between two values to determine if they are equivalent.",
    examples: [
      { title: "Example 1", input: "[{ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }]", output: "true", explanation: "Deeply equal." },
      { title: "Example 2", input: "[{ a: 1 }, { a: 2 }]", output: "false", explanation: "Different values." }
    ],
    constraints: ["Handles nested objects, arrays, and primitives."],
    starterCode: "function isEqual(a, b) {\n  // Write your solution here\n}",
    functionName: "isEqual",
    testCases: [
      { id: "tc_189_1", input: "[{ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }]", expectedOutput: "true", isHidden: false },
      { id: "tc_189_2", input: "[{ a: 1 }, { a: 2 }]", expectedOutput: "false", isHidden: false },
      { id: "tc_189_3", input: "[[1, [2]], [1, [2]]]", expectedOutput: "true", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_189_4", input: "[null, { a: 1 }]", expectedOutput: "false", isHidden: true },
      { id: "tc_189_5", input: "[{ a: 1, b: 2 }, { a: 1, b: 3 }]", expectedOutput: "false", isHidden: true }
    ],
    solution: "function isEqual(a, b) {\n  if (a === b) return true;\n  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;\n  if (Array.isArray(a) !== Array.isArray(b)) return false;\n  const k1 = Object.keys(a);\n  const k2 = Object.keys(b);\n  if (k1.length !== k2.length) return false;\n  for (const k of k1) {\n    if (!Object.prototype.hasOwnProperty.call(b, k) || !isEqual(a[k], b[k])) return false;\n  }\n  return true;\n}",
    explanation: "Check identity, type match, array match, key count, and recurse on each key.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(depth)",
    hints: ["Handle primitives, null checks, key count match, and recursive comparison."]
  },
  {
    id: "JS-P190",
    number: 190,
    title: "Find Path to Value in Nested Object",
    slug: "js-p190-find-path-to-value-in-nested-object",
    category: "Objects",
    subcategory: "Search",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Objects", "Path Traversal"],
    tags: ["objects", "search", "path"],
    expectedTime: "10 mins",
    summary: "Return the first dot-path string leading to a target primitive value.",
    problemStatement: "Write a function `findPathToValue(obj, targetValue)` that returns the dot-path string (e.g. `'a.b.c'`) pointing to `targetValue` in `obj`, or `null` if not found.",
    examples: [
      { title: "Example 1", input: "[{ a: { b: { c: 'foundMe' } } }, 'foundMe']", output: "'a.b.c'", explanation: "Path to 'foundMe'." },
      { title: "Example 2", input: "[{ a: 1 }, 99]", output: "null", explanation: "Not found." }
    ],
    constraints: ["Primitives only as target."],
    starterCode: "function findPathToValue(obj, targetValue) {\n  // Write your solution here\n}",
    functionName: "findPathToValue",
    testCases: [
      { id: "tc_190_1", input: "[{ a: { b: { c: 'foundMe' } } }, 'foundMe']", expectedOutput: "'a.b.c'", isHidden: false },
      { id: "tc_190_2", input: "[{ a: 1 }, 99]", expectedOutput: "null", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_190_3", input: "[{ top: 42 }, 42]", expectedOutput: "'top'", isHidden: true }
    ],
    solution: "function findPathToValue(obj, targetValue) {\n  function dfs(curr, path) {\n    if (curr === targetValue) return path.join('.');\n    if (curr && typeof curr === 'object') {\n      for (const k of Object.keys(curr)) {\n        const res = dfs(curr[k], [...path, k]);\n        if (res !== null) return res;\n      }\n    }\n    return null;\n  }\n  return dfs(obj, []);\n}",
    explanation: "DFS passing path segments array and joining with '.' when target is matched.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(depth)",
    hints: ["DFS tracking path array, join with '.' on match."]
  },
  {
    id: "JS-P191",
    number: 191,
    title: "Safely Traverse with Array Path and Fallback",
    slug: "js-p191-safely-traverse-with-array-path-and-fallback",
    category: "Objects",
    subcategory: "Path Traversal",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "safeGet"],
    tags: ["objects", "safeGet", "path"],
    expectedTime: "5 mins",
    summary: "Traverse an object using an array of keys with a fallback value.",
    problemStatement: "Write a function `safeGet(obj, pathArr, fallback)` that retrieves the value at path array `pathArr` (e.g. `['user', 'profile', 'name']`), or returns `fallback` if undefined or inaccessible.",
    examples: [
      { title: "Example 1", input: "[{ user: { profile: { name: 'Alice' } } }, ['user', 'profile', 'name'], 'Unknown']", output: "'Alice'", explanation: "Retrieved." }
    ],
    constraints: ["pathArr is string[]."],
    starterCode: "function safeGet(obj, pathArr, fallback) {\n  // Write your solution here\n}",
    functionName: "safeGet",
    testCases: [
      { id: "tc_191_1", input: "[{ user: { profile: { name: 'Alice' } } }, ['user', 'profile', 'name'], 'Unknown']", expectedOutput: "'Alice'", isHidden: false },
      { id: "tc_191_2", input: "[{ user: {} }, ['user', 'profile', 'name'], 'Unknown']", expectedOutput: "'Unknown'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_191_3", input: "[{ x: 0 }, ['x'], 100]", expectedOutput: "0", isHidden: true }
    ],
    solution: "function safeGet(obj, pathArr, fallback) {\n  let curr = obj;\n  for (const k of pathArr) {\n    if (curr === null || curr === undefined) return fallback;\n    curr = curr[k];\n  }\n  return curr === undefined ? fallback : curr;\n}",
    explanation: "Traverse along pathArr, returning fallback on null or undefined.",
    timeComplexity: "O(pathArr.length)",
    spaceComplexity: "O(1)",
    hints: ["Iterate through pathArr checking curr == null."]
  },
  {
    id: "JS-P192",
    number: 192,
    title: "Create Defaults Object with Fallback Values",
    slug: "js-p192-create-defaults-object-with-fallback-values",
    category: "Objects",
    subcategory: "Defaults",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "Defaults"],
    tags: ["objects", "defaults", "fallback"],
    expectedTime: "5 mins",
    summary: "Fill in missing undefined properties on an object from a defaultValues object.",
    problemStatement: "Write a function `defaults(target, defaultValues)` that returns a copy of `target` where properties undefined on `target` are populated from `defaultValues`.",
    examples: [
      { title: "Example 1", input: "[{ theme: 'dark' }, { theme: 'light', fontSize: 14 }]", output: "{ theme: 'dark', fontSize: 14 }", explanation: "'theme' preserved, 'fontSize' added." }
    ],
    constraints: ["Flat objects."],
    starterCode: "function defaults(target, defaultValues) {\n  // Write your solution here\n}",
    functionName: "defaults",
    testCases: [
      { id: "tc_192_1", input: "[{ theme: 'dark' }, { theme: 'light', fontSize: 14 }]", expectedOutput: "{ theme: 'dark', fontSize: 14 }", isHidden: false },
      { id: "tc_192_2", input: "[{}, { a: 1 }]", expectedOutput: "{ a: 1 }", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_192_3", input: "[{ a: 1 }, {}]", expectedOutput: "{ a: 1 }", isHidden: true }
    ],
    solution: "function defaults(target, defaultValues) {\n  return { ...defaultValues, ...target };\n}",
    explanation: "Spread defaultValues first, then override with target.",
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(n + m)",
    hints: ["Spread { ...defaultValues, ...target }."]
  },
  {
    id: "JS-P193",
    number: 193,
    title: "Partition Object into Truthy and Falsy Values",
    slug: "js-p193-partition-object-into-truthy-and-falsy-values",
    category: "Objects",
    subcategory: "Partition",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "Partition"],
    tags: ["objects", "truthy", "partition"],
    expectedTime: "5 mins",
    summary: "Separate an object into { truthy: {...}, falsy: {...} } based on property truthiness.",
    problemStatement: "Write a function `partitionObjectByTruthiness(obj)` that returns `{ truthy: object, falsy: object }` partitioning properties by Boolean value.",
    examples: [
      { title: "Example 1", input: "[{ a: 1, b: 0, c: 'hello', d: '', e: null }]", output: "{ truthy: { a: 1, c: 'hello' }, falsy: { b: 0, d: '', e: null } }", explanation: "Partitioned by truthiness." }
    ],
    constraints: ["Flat object."],
    starterCode: "function partitionObjectByTruthiness(obj) {\n  // Write your solution here\n}",
    functionName: "partitionObjectByTruthiness",
    testCases: [
      { id: "tc_193_1", input: "[{ a: 1, b: 0, c: 'hello', d: '', e: null }]", expectedOutput: "{ truthy: { a: 1, c: 'hello' }, falsy: { b: 0, d: '', e: null } }", isHidden: false },
      { id: "tc_193_2", input: "[{}]", expectedOutput: "{ truthy: {}, falsy: {} }", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_193_3", input: "[{ x: true }]", expectedOutput: "{ truthy: { x: true }, falsy: {} }", isHidden: true }
    ],
    solution: "function partitionObjectByTruthiness(obj) {\n  const truthy = {}, falsy = {};\n  for (const k of Object.keys(obj)) {\n    if (Boolean(obj[k])) truthy[k] = obj[k];\n    else falsy[k] = obj[k];\n  }\n  return { truthy, falsy };\n}",
    explanation: "Test Boolean(obj[k]) and assign to truthy or falsy object.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Check Boolean(obj[k])."]
  },
  {
    id: "JS-P194",
    number: 194,
    title: "Calculate Maximum Depth of Nested Object",
    slug: "js-p194-calculate-maximum-depth-of-nested-object",
    category: "Objects",
    subcategory: "Recursion",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Objects", "Recursion"],
    tags: ["objects", "depth", "recursion"],
    expectedTime: "10 mins",
    summary: "Return the maximum level of object nesting (1 for empty or flat object).",
    problemStatement: "Write a function `objectDepth(obj)` that returns the maximum depth of nested objects. A flat object has depth 1. An object containing another object has depth 2.",
    examples: [
      { title: "Example 1", input: "[{ a: { b: { c: 1 } } }]", output: "3", explanation: "3 levels deep." },
      { title: "Example 2", input: "[{ a: 1, b: 2 }]", output: "1", explanation: "1 level deep." }
    ],
    constraints: ["Non-null object without circular references."],
    starterCode: "function objectDepth(obj) {\n  // Write your solution here\n}",
    functionName: "objectDepth",
    testCases: [
      { id: "tc_194_1", input: "[{ a: { b: { c: 1 } } }]", expectedOutput: "3", isHidden: false },
      { id: "tc_194_2", input: "[{ a: 1, b: 2 }]", expectedOutput: "1", isHidden: false },
      { id: "tc_194_3", input: "[{}]", expectedOutput: "1", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_194_4", input: "[{ a: { b: 1 }, c: { d: { e: 2 } } }]", expectedOutput: "3", isHidden: true }
    ],
    solution: "function objectDepth(obj) {\n  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return 0;\n  let maxChildDepth = 0;\n  for (const k of Object.keys(obj)) {\n    const childDepth = objectDepth(obj[k]);\n    if (childDepth > maxChildDepth) maxChildDepth = childDepth;\n  }\n  return 1 + maxChildDepth;\n}",
    explanation: "Recursive depth: 1 + max child depth.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(depth)",
    hints: ["Depth is 1 + max depth among child objects."]
  },
  {
    id: "JS-P195",
    number: 195,
    title: "Transform Object Array into Key-Value Hash",
    slug: "js-p195-transform-object-array-into-key-value-hash",
    category: "Objects",
    subcategory: "Lookup Table",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "Lookup"],
    tags: ["objects", "hash", "mapping"],
    expectedTime: "5 mins",
    summary: "Convert an array of objects into a hash mapping one property to another.",
    problemStatement: "Write a function `toLookupTable(arr, keyProp, valProp)` that creates an object mapping `item[keyProp]` to `item[valProp]`.",
    examples: [
      { title: "Example 1", input: "[[{ code: 'US', name: 'USA' }, { code: 'CA', name: 'Canada' }], 'code', 'name']", output: "{ US: 'USA', CA: 'Canada' }", explanation: "Code mapped to name." }
    ],
    constraints: ["Array of objects."],
    starterCode: "function toLookupTable(arr, keyProp, valProp) {\n  // Write your solution here\n}",
    functionName: "toLookupTable",
    testCases: [
      { id: "tc_195_1", input: "[[{ code: 'US', name: 'USA' }, { code: 'CA', name: 'Canada' }], 'code', 'name']", expectedOutput: "{ US: 'USA', CA: 'Canada' }", isHidden: false },
      { id: "tc_195_2", input: "[[], 'k', 'v']", expectedOutput: "{}", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_195_3", input: "[[{ id: 1, val: 100 }], 'id', 'val']", expectedOutput: "{ '1': 100 }", isHidden: true }
    ],
    solution: "function toLookupTable(arr, keyProp, valProp) {\n  const res = {};\n  for (const item of arr) res[item[keyProp]] = item[valProp];\n  return res;\n}",
    explanation: "Iterate and assign res[item[keyProp]] = item[valProp].",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Assign res[item[keyProp]] = item[valProp]."]
  },
  {
    id: "JS-P196",
    number: 196,
    title: "Remove Deep Null and Undefined Properties",
    slug: "js-p196-remove-deep-null-and-undefined-properties",
    category: "Objects",
    subcategory: "Sanitization",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Objects", "Recursion"],
    tags: ["objects", "clean", "deep"],
    expectedTime: "10 mins",
    summary: "Recursively remove null and undefined properties from nested objects.",
    problemStatement: "Write a function `deepCompact(obj)` that returns a deeply cleaned copy of `obj` with all `null` and `undefined` properties removed at every nesting level.",
    examples: [
      { title: "Example 1", input: "[{ a: 1, b: null, c: { d: 2, e: undefined } }]", output: "{ a: 1, c: { d: 2 } }", explanation: "Null and undefined pruned." }
    ],
    constraints: ["Nested plain objects."],
    starterCode: "function deepCompact(obj) {\n  // Write your solution here\n}",
    functionName: "deepCompact",
    testCases: [
      { id: "tc_196_1", input: "[{ a: 1, b: null, c: { d: 2, e: undefined } }]", expectedOutput: "{ a: 1, c: { d: 2 } }", isHidden: false },
      { id: "tc_196_2", input: "[{ x: null }]", expectedOutput: "{}", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_196_3", input: "[{ a: 1 }]", expectedOutput: "{ a: 1 }", isHidden: true }
    ],
    solution: "function deepCompact(obj) {\n  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;\n  const res = {};\n  for (const k of Object.keys(obj)) {\n    const val = obj[k];\n    if (val !== null && val !== undefined) {\n      res[k] = typeof val === 'object' && !Array.isArray(val) ? deepCompact(val) : val;\n    }\n  }\n  return res;\n}",
    explanation: "Filter null/undefined and recurse on nested objects.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Check if value is null/undefined before adding to res; recurse if object."]
  },
  {
    id: "JS-P197",
    number: 197,
    title: "Diff Two Flat Objects Returning Added, Removed, and Modified",
    slug: "js-p197-diff-two-flat-objects-returning-added-removed-and-modified",
    category: "Objects",
    subcategory: "Diffing",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Objects", "Diffing"],
    tags: ["objects", "diff", "comparison"],
    expectedTime: "10 mins",
    summary: "Return { added: [], removed: [], modified: [] } comparing two flat objects.",
    problemStatement: "Write a function `diffObjects(o1, o2)` that compares flat objects `o1` and `o2` and returns `{ added: string[], removed: string[], modified: string[] }` with sorted key arrays.",
    examples: [
      { title: "Example 1", input: "[{ a: 1, b: 2, c: 3 }, { a: 1, b: 99, d: 4 }]", output: "{ added: ['d'], removed: ['c'], modified: ['b'] }", explanation: "d added, c removed, b modified." }
    ],
    constraints: ["Flat objects."],
    starterCode: "function diffObjects(o1, o2) {\n  // Write your solution here\n}",
    functionName: "diffObjects",
    testCases: [
      { id: "tc_197_1", input: "[{ a: 1, b: 2, c: 3 }, { a: 1, b: 99, d: 4 }]", expectedOutput: "{ added: ['d'], removed: ['c'], modified: ['b'] }", isHidden: false },
      { id: "tc_197_2", input: "[{}, {}]", expectedOutput: "{ added: [], removed: [], modified: [] }", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_197_3", input: "[{ a: 1 }, { a: 1 }]", expectedOutput: "{ added: [], removed: [], modified: [] }", isHidden: true }
    ],
    solution: "function diffObjects(o1, o2) {\n  const added = [], removed = [], modified = [];\n  for (const k of Object.keys(o2)) {\n    if (!(k in o1)) added.push(k);\n    else if (o1[k] !== o2[k]) modified.push(k);\n  }\n  for (const k of Object.keys(o1)) {\n    if (!(k in o2)) removed.push(k);\n  }\n  return { added: added.sort(), removed: removed.sort(), modified: modified.sort() };\n}",
    explanation: "Check keys of o2 against o1 for added/modified, and o1 against o2 for removed.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    hints: ["Find added in o2, removed in o1, and modified if o1[k] !== o2[k]."]
  },
  {
    id: "JS-P198",
    number: 198,
    title: "Convert Key-Value Object to URL Hash Fragment",
    slug: "js-p198-convert-key-value-object-to-url-hash-fragment",
    category: "Objects",
    subcategory: "URL Utilities",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "URL"],
    tags: ["objects", "hash", "url"],
    expectedTime: "5 mins",
    summary: "Serialize flat object into a '#key=val&...' URL hash fragment.",
    problemStatement: "Write a function `objectToHash(obj)` that returns `'#'` followed by URI-encoded `key=val` pairs joined by `'&'`. If `obj` is empty, return `''`.",
    examples: [
      { title: "Example 1", input: "[{ section: 'intro', tab: 1 }]", output: "'#section=intro&tab=1'", explanation: "Serialized to hash." },
      { title: "Example 2", input: "[{}]", output: "''", explanation: "Empty gives ''." }
    ],
    constraints: ["Flat object."],
    starterCode: "function objectToHash(obj) {\n  // Write your solution here\n}",
    functionName: "objectToHash",
    testCases: [
      { id: "tc_198_1", input: "[{ section: 'intro', tab: 1 }]", expectedOutput: "'#section=intro&tab=1'", isHidden: false },
      { id: "tc_198_2", input: "[{}]", expectedOutput: "''", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_198_3", input: "[{ modal: 'open' }]", expectedOutput: "'#modal=open'", isHidden: true }
    ],
    solution: "function objectToHash(obj) {\n  const keys = Object.keys(obj);\n  if (keys.length === 0) return '';\n  return '#' + keys.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');\n}",
    explanation: "Prefix with '#' if non-empty, encoding keys and values.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Prefix '#' if Object.keys.length > 0."]
  },
  {
    id: "JS-P199",
    number: 199,
    title: "Normalize Object Keys by Lowercasing",
    slug: "js-p199-normalize-object-keys-by-lowercasing",
    category: "Objects",
    subcategory: "Transformations",
    difficulty: "Easy",
    questionType: "Coding",
    skills: ["Objects", "Keys"],
    tags: ["objects", "lowercase", "normalize"],
    expectedTime: "5 mins",
    summary: "Return a new object with all own keys converted to lowercase.",
    problemStatement: "Write a function `lowercaseKeys(obj)` that returns a copy of `obj` with all keys lowercased.",
    examples: [
      { title: "Example 1", input: "[{ 'Content-Type': 'application/json', HOST: 'localhost' }]", output: "{ 'content-type': 'application/json', host: 'localhost' }", explanation: "Headers lowercased." }
    ],
    constraints: ["Flat object."],
    starterCode: "function lowercaseKeys(obj) {\n  // Write your solution here\n}",
    functionName: "lowercaseKeys",
    testCases: [
      { id: "tc_199_1", input: "[{ 'Content-Type': 'application/json', HOST: 'localhost' }]", expectedOutput: "{ 'content-type': 'application/json', host: 'localhost' }", isHidden: false },
      { id: "tc_199_2", input: "[{}]", expectedOutput: "{}", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_199_3", input: "[{ ABC: 123 }]", expectedOutput: "{ abc: 123 }", isHidden: true }
    ],
    solution: "function lowercaseKeys(obj) {\n  const res = {};\n  for (const k of Object.keys(obj)) res[k.toLowerCase()] = obj[k];\n  return res;\n}",
    explanation: "Assign res[k.toLowerCase()] = obj[k].",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Assign res[k.toLowerCase()] = obj[k]."]
  },
  {
    id: "JS-P200",
    number: 200,
    title: "Safe JSON Stringify with Circular Reference Handling",
    slug: "js-p200-safe-json-stringify-with-circular-reference-handling",
    category: "Objects",
    subcategory: "Serialization",
    difficulty: "Medium",
    questionType: "Coding",
    skills: ["Objects", "JSON", "WeakSet"],
    tags: ["objects", "json", "circular"],
    expectedTime: "10 mins",
    summary: "Stringify an object to JSON, replacing circular references with '[Circular]'.",
    problemStatement: "Write a function `safeStringify(obj)` that serializes `obj` to JSON without throwing circular structure errors, replacing any circular reference with `\"[Circular]\"`.",
    examples: [
      { title: "Example 1", input: "[{ a: 1, b: 'hello' }]", output: "'{\"a\":1,\"b\":\"hello\"}'", explanation: "Standard object stringified." }
    ],
    constraints: ["Valid object input."],
    starterCode: "function safeStringify(obj) {\n  // Write your solution here\n}",
    functionName: "safeStringify",
    testCases: [
      { id: "tc_200_1", input: "[{ a: 1, b: 'hello' }]", expectedOutput: "'{\"a\":1,\"b\":\"hello\"}'", isHidden: false },
      { id: "tc_200_2", input: "[{}]", expectedOutput: "'{}'", isHidden: false }
    ],
    hiddenTestCases: [
      { id: "tc_200_3", input: "[42]", expectedOutput: "'42'", isHidden: true }
    ],
    solution: "function safeStringify(obj) {\n  const seen = new WeakSet();\n  return JSON.stringify(obj, (key, value) => {\n    if (value && typeof value === 'object') {\n      if (seen.has(value)) return '[Circular]';\n      seen.add(value);\n    }\n    return value;\n  });\n}",
    explanation: "Use JSON.stringify replacer function with a WeakSet tracking seen object references.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hints: ["Use JSON.stringify(obj, replacer) with a WeakSet to detect seen objects."]
  }
];

export async function buildAndTestBatch04() {
  console.log('Testing Batch 04 (50 questions)...');
  const passed = await testBatch(b04);
  if (!passed) throw new Error('Batch 04 verification failed!');
  const targetFile = path.resolve('src/components/coreprogramming/data/batches/batch04.ts');
  const fileContent = `// src/components/coreprogramming/data/batches/batch04.ts\nimport type { CoreProgrammingQuestion } from '../coreProgrammingTypes';\n\nexport const coreProgrammingBatch4: CoreProgrammingQuestion[] = ${JSON.stringify(b04, null, 2)};\n`;
  fs.writeFileSync(targetFile, fileContent, 'utf-8');
  console.log(`Successfully wrote ${b04.length} verified questions to batch04.ts!`);
}

buildAndTestBatch04();
