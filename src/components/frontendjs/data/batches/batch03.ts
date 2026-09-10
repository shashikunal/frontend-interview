// Batch 3: Questions 201 to 300
import type { FrontendJsQuestion } from '../frontendJsTypes';

export const fjpBatch3: FrontendJsQuestion[] = [
  {
    "id": "FJP-0201",
    "number": 201,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0201-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 25",
    "isMostAsked": true,
    "companyTags": [
      "Amazon-Style",
      "Apple-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator201(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator201",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator201(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator201` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0202",
    "number": 202,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0202-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 25",
    "isMostAsked": true,
    "companyTags": [
      "Netflix-Style",
      "Uber-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray202(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray202",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray202(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray202` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0203",
    "number": 203,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0203-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 25",
    "isMostAsked": true,
    "companyTags": [
      "Airbnb-Style",
      "Stripe-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap203(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap203",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap203(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap203` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0204",
    "number": 204,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0204-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 25",
    "isMostAsked": true,
    "companyTags": [
      "Microsoft-Style",
      "LinkedIn-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache204(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache204",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache204(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache204` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0205",
    "number": 205,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0205-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 25",
    "isMostAsked": true,
    "companyTags": [
      "Salesforce-Style",
      "Adobe-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator205(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator205",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator205(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator205` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0206",
    "number": 206,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0206-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 50",
    "isMostAsked": true,
    "companyTags": [
      "ByteDance-Style",
      "Spotify-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray206(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray206",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray206(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray206` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0207",
    "number": 207,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0207-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 50",
    "isMostAsked": true,
    "companyTags": [
      "Atlassian-Style",
      "Coinbase-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap207(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap207",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap207(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap207` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0208",
    "number": 208,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0208-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 50",
    "isMostAsked": true,
    "companyTags": [
      "DoorDash-Style",
      "Instacart-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache208(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache208",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache208(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache208` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0209",
    "number": 209,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0209-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 50",
    "isMostAsked": true,
    "companyTags": [
      "Figma-Style",
      "Canva-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator209(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator209",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator209(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator209` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0210",
    "number": 210,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0210-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 50",
    "isMostAsked": true,
    "companyTags": [
      "Google-Style",
      "Meta-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray210(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray210",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray210(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray210` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0211",
    "number": 211,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0211-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 50",
    "isMostAsked": true,
    "companyTags": [
      "Amazon-Style",
      "Apple-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap211(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap211",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap211(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap211` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0212",
    "number": 212,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0212-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 50",
    "isMostAsked": true,
    "companyTags": [
      "Netflix-Style",
      "Uber-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache212(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache212",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache212(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache212` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0213",
    "number": 213,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0213-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 50",
    "isMostAsked": true,
    "companyTags": [
      "Airbnb-Style",
      "Stripe-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator213(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator213",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator213(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator213` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0214",
    "number": 214,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0214-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 50",
    "isMostAsked": true,
    "companyTags": [
      "Microsoft-Style",
      "LinkedIn-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray214(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray214",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray214(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray214` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0215",
    "number": 215,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0215-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 50",
    "isMostAsked": true,
    "companyTags": [
      "Salesforce-Style",
      "Adobe-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap215(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap215",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap215(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap215` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0216",
    "number": 216,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0216-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 100",
    "isMostAsked": true,
    "companyTags": [
      "ByteDance-Style",
      "Spotify-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache216(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache216",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache216(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache216` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0217",
    "number": 217,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0217-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 100",
    "isMostAsked": true,
    "companyTags": [
      "Atlassian-Style",
      "Coinbase-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator217(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator217",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator217(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator217` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0218",
    "number": 218,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0218-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 100",
    "isMostAsked": true,
    "companyTags": [
      "DoorDash-Style",
      "Instacart-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray218(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray218",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray218(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray218` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0219",
    "number": 219,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0219-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 100",
    "isMostAsked": true,
    "companyTags": [
      "Figma-Style",
      "Canva-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap219(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap219",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap219(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap219` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0220",
    "number": 220,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0220-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 100",
    "isMostAsked": true,
    "companyTags": [
      "Google-Style",
      "Meta-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache220(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache220",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache220(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache220` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0221",
    "number": 221,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0221-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 100",
    "isMostAsked": true,
    "companyTags": [
      "Amazon-Style",
      "Apple-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator221(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator221",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator221(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator221` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0222",
    "number": 222,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0222-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 100",
    "isMostAsked": true,
    "companyTags": [
      "Netflix-Style",
      "Uber-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray222(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray222",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray222(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray222` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0223",
    "number": 223,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0223-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 100",
    "isMostAsked": true,
    "companyTags": [
      "Airbnb-Style",
      "Stripe-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap223(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap223",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap223(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap223` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0224",
    "number": 224,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0224-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 100",
    "isMostAsked": true,
    "companyTags": [
      "Microsoft-Style",
      "LinkedIn-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache224(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache224",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache224(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache224` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0225",
    "number": 225,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0225-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 100",
    "isMostAsked": true,
    "companyTags": [
      "Salesforce-Style",
      "Adobe-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator225(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator225",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator225(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator225` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0226",
    "number": 226,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0226-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 100",
    "isMostAsked": true,
    "companyTags": [
      "ByteDance-Style",
      "Spotify-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray226(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray226",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray226(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray226` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0227",
    "number": 227,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0227-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 100",
    "isMostAsked": true,
    "companyTags": [
      "Atlassian-Style",
      "Coinbase-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap227(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap227",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap227(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap227` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0228",
    "number": 228,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0228-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 100",
    "isMostAsked": true,
    "companyTags": [
      "DoorDash-Style",
      "Instacart-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache228(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache228",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache228(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache228` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0229",
    "number": 229,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0229-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 100",
    "isMostAsked": true,
    "companyTags": [
      "Figma-Style",
      "Canva-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator229(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator229",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator229(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator229` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0230",
    "number": 230,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0230-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Easy",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 100",
    "isMostAsked": true,
    "companyTags": [
      "Google-Style",
      "Meta-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray230(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray230",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray230(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray230` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0231",
    "number": 231,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0231-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 100",
    "isMostAsked": true,
    "companyTags": [
      "Amazon-Style",
      "Apple-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap231(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap231",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap231(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap231` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0232",
    "number": 232,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0232-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 100",
    "isMostAsked": true,
    "companyTags": [
      "Netflix-Style",
      "Uber-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache232(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache232",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache232(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache232` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.940Z",
    "updatedAt": "2026-09-10T04:07:54.940Z"
  },
  {
    "id": "FJP-0233",
    "number": 233,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0233-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 100",
    "isMostAsked": true,
    "companyTags": [
      "Airbnb-Style",
      "Stripe-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator233(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator233",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator233(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator233` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0234",
    "number": 234,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0234-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 100",
    "isMostAsked": true,
    "companyTags": [
      "Microsoft-Style",
      "LinkedIn-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray234(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray234",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray234(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray234` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0235",
    "number": 235,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0235-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 100",
    "isMostAsked": true,
    "companyTags": [
      "Salesforce-Style",
      "Adobe-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap235(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap235",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap235(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap235` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0236",
    "number": 236,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0236-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "ByteDance-Style",
      "Spotify-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache236(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache236",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache236(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache236` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0237",
    "number": 237,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0237-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "Atlassian-Style",
      "Coinbase-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator237(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator237",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator237(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator237` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0238",
    "number": 238,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0238-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "DoorDash-Style",
      "Instacart-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray238(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray238",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray238(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray238` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0239",
    "number": 239,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0239-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "Figma-Style",
      "Canva-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap239(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap239",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap239(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap239` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0240",
    "number": 240,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0240-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "Google-Style",
      "Meta-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache240(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache240",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache240(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache240` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0241",
    "number": 241,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0241-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "Amazon-Style",
      "Apple-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator241(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator241",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator241(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator241` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0242",
    "number": 242,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0242-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "Netflix-Style",
      "Uber-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray242(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray242",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray242(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray242` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0243",
    "number": 243,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0243-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "Airbnb-Style",
      "Stripe-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap243(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap243",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap243(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap243` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0244",
    "number": 244,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0244-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "Microsoft-Style",
      "LinkedIn-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache244(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache244",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache244(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache244` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0245",
    "number": 245,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0245-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "Salesforce-Style",
      "Adobe-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator245(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator245",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator245(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator245` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0246",
    "number": 246,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0246-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "ByteDance-Style",
      "Spotify-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray246(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray246",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray246(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray246` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0247",
    "number": 247,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0247-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "Atlassian-Style",
      "Coinbase-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap247(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap247",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap247(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap247` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0248",
    "number": 248,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0248-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "DoorDash-Style",
      "Instacart-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache248(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache248",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache248(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache248` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0249",
    "number": 249,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0249-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "Figma-Style",
      "Canva-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator249(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator249",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator249(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator249` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0250",
    "number": 250,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0250-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "Google-Style",
      "Meta-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray250(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray250",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray250(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray250` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0251",
    "number": 251,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0251-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "Amazon-Style",
      "Apple-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap251(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap251",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap251(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap251` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0252",
    "number": 252,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0252-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "Netflix-Style",
      "Uber-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache252(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache252",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache252(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache252` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0253",
    "number": 253,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0253-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "Airbnb-Style",
      "Stripe-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator253(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator253",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator253(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator253` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0254",
    "number": 254,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0254-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "Microsoft-Style",
      "LinkedIn-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray254(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray254",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray254(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray254` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0255",
    "number": 255,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0255-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "Salesforce-Style",
      "Adobe-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap255(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap255",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap255(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap255` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0256",
    "number": 256,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0256-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "ByteDance-Style",
      "Spotify-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache256(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache256",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache256(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache256` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0257",
    "number": 257,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0257-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "Atlassian-Style",
      "Coinbase-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator257(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator257",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator257(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator257` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0258",
    "number": 258,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0258-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "DoorDash-Style",
      "Instacart-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray258(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray258",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray258(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray258` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0259",
    "number": 259,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0259-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "Figma-Style",
      "Canva-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap259(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap259",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap259(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap259` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0260",
    "number": 260,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0260-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "Google-Style",
      "Meta-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache260(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache260",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache260(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache260` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0261",
    "number": 261,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0261-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "Amazon-Style",
      "Apple-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator261(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator261",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator261(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator261` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0262",
    "number": 262,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0262-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "Netflix-Style",
      "Uber-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray262(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray262",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray262(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray262` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0263",
    "number": 263,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0263-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "Airbnb-Style",
      "Stripe-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap263(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap263",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap263(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap263` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0264",
    "number": 264,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0264-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "Microsoft-Style",
      "LinkedIn-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache264(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache264",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache264(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache264` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0265",
    "number": 265,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0265-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Top 250",
    "isMostAsked": false,
    "companyTags": [
      "Salesforce-Style",
      "Adobe-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator265(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator265",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator265(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator265` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0266",
    "number": 266,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0266-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Frequently Asked",
    "isMostAsked": false,
    "companyTags": [
      "ByteDance-Style",
      "Spotify-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray266(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray266",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray266(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray266` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0267",
    "number": 267,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0267-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Frequently Asked",
    "isMostAsked": false,
    "companyTags": [
      "Atlassian-Style",
      "Coinbase-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap267(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap267",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap267(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap267` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0268",
    "number": 268,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0268-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Frequently Asked",
    "isMostAsked": false,
    "companyTags": [
      "DoorDash-Style",
      "Instacart-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache268(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache268",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache268(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache268` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0269",
    "number": 269,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0269-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Frequently Asked",
    "isMostAsked": false,
    "companyTags": [
      "Figma-Style",
      "Canva-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator269(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator269",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator269(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator269` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0270",
    "number": 270,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0270-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Frequently Asked",
    "isMostAsked": false,
    "companyTags": [
      "Google-Style",
      "Meta-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray270(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray270",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray270(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray270` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0271",
    "number": 271,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0271-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Frequently Asked",
    "isMostAsked": false,
    "companyTags": [
      "Amazon-Style",
      "Apple-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap271(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap271",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap271(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap271` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0272",
    "number": 272,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0272-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Frequently Asked",
    "isMostAsked": false,
    "companyTags": [
      "Netflix-Style",
      "Uber-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache272(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache272",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache272(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache272` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0273",
    "number": 273,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0273-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Frequently Asked",
    "isMostAsked": false,
    "companyTags": [
      "Airbnb-Style",
      "Stripe-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator273(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator273",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator273(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator273` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0274",
    "number": 274,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0274-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Frequently Asked",
    "isMostAsked": false,
    "companyTags": [
      "Microsoft-Style",
      "LinkedIn-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray274(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray274",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray274(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray274` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0275",
    "number": 275,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0275-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Medium",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Frequently Asked",
    "isMostAsked": false,
    "companyTags": [
      "Salesforce-Style",
      "Adobe-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap275(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap275",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap275(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap275` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0276",
    "number": 276,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0276-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Frequently Asked",
    "isMostAsked": false,
    "companyTags": [
      "ByteDance-Style",
      "Spotify-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache276(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache276",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache276(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache276` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0277",
    "number": 277,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0277-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Frequently Asked",
    "isMostAsked": false,
    "companyTags": [
      "Atlassian-Style",
      "Coinbase-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator277(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator277",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator277(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator277` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0278",
    "number": 278,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0278-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Frequently Asked",
    "isMostAsked": false,
    "companyTags": [
      "DoorDash-Style",
      "Instacart-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray278(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray278",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray278(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray278` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0279",
    "number": 279,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0279-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Frequently Asked",
    "isMostAsked": false,
    "companyTags": [
      "Figma-Style",
      "Canva-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap279(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap279",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap279(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap279` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0280",
    "number": 280,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0280-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Frequently Asked",
    "isMostAsked": false,
    "companyTags": [
      "Google-Style",
      "Meta-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache280(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache280",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache280(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache280` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0281",
    "number": 281,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0281-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Frequently Asked",
    "isMostAsked": false,
    "companyTags": [
      "Amazon-Style",
      "Apple-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator281(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator281",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator281(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator281` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0282",
    "number": 282,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0282-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Frequently Asked",
    "isMostAsked": false,
    "companyTags": [
      "Netflix-Style",
      "Uber-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray282(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray282",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray282(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray282` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0283",
    "number": 283,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0283-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Frequently Asked",
    "isMostAsked": false,
    "companyTags": [
      "Airbnb-Style",
      "Stripe-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap283(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap283",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap283(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap283` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0284",
    "number": 284,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0284-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Frequently Asked",
    "isMostAsked": false,
    "companyTags": [
      "Microsoft-Style",
      "LinkedIn-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache284(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache284",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache284(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache284` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0285",
    "number": 285,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0285-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Frequently Asked",
    "isMostAsked": false,
    "companyTags": [
      "Salesforce-Style",
      "Adobe-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator285(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator285",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator285(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator285` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0286",
    "number": 286,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0286-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Standard",
    "isMostAsked": false,
    "companyTags": [
      "ByteDance-Style",
      "Spotify-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray286(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray286",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray286(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray286` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0287",
    "number": 287,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0287-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Standard",
    "isMostAsked": false,
    "companyTags": [
      "Atlassian-Style",
      "Coinbase-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap287(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap287",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap287(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap287` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0288",
    "number": 288,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0288-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Standard",
    "isMostAsked": false,
    "companyTags": [
      "DoorDash-Style",
      "Instacart-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache288(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache288",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache288(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache288` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0289",
    "number": 289,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0289-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Standard",
    "isMostAsked": false,
    "companyTags": [
      "Figma-Style",
      "Canva-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator289(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator289",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator289(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator289` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0290",
    "number": 290,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0290-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Standard",
    "isMostAsked": false,
    "companyTags": [
      "Google-Style",
      "Meta-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray290(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray290",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray290(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray290` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0291",
    "number": 291,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0291-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Standard",
    "isMostAsked": false,
    "companyTags": [
      "Amazon-Style",
      "Apple-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap291(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap291",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap291(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap291` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0292",
    "number": 292,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0292-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Standard",
    "isMostAsked": false,
    "companyTags": [
      "Netflix-Style",
      "Uber-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache292(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache292",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache292(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache292` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0293",
    "number": 293,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0293-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Standard",
    "isMostAsked": false,
    "companyTags": [
      "Airbnb-Style",
      "Stripe-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator293(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator293",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator293(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator293` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0294",
    "number": 294,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0294-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Standard",
    "isMostAsked": false,
    "companyTags": [
      "Microsoft-Style",
      "LinkedIn-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray294(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray294",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray294(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray294` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0295",
    "number": 295,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0295-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Standard",
    "isMostAsked": false,
    "companyTags": [
      "Salesforce-Style",
      "Adobe-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap295(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap295",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap295(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap295` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0296",
    "number": 296,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0296-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Standard",
    "isMostAsked": false,
    "companyTags": [
      "ByteDance-Style",
      "Spotify-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache296(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache296",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache296(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache296` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0297",
    "number": 297,
    "title": "Custom Range Iterator Protocol",
    "slug": "fjp-0297-custom-range-iterator-protocol",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "[Symbol.iterator]",
      "Generators",
      "Protocols"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Standard",
    "isMostAsked": false,
    "companyTags": [
      "Atlassian-Style",
      "Coinbase-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an iterable object that yields numbers from `start` to `end` (inclusive) with a given `step`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "start = 1, end = 5, step = 2",
        "output": "[1, 3, 5]"
      }
    ],
    "starterCode": "function createRangeIterator297(start, end, step = 1) {\n  // TODO\n}",
    "functionName": "createRangeIterator297",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1, 5, 2]",
        "expectedOutput": "[1, 3, 5]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, 10, 5]",
        "expectedOutput": "[0, 5, 10]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5, 5, 1]",
        "expectedOutput": "[5]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createRangeIterator297(start, end, step = 1) {\n  const result = [];\n  for (let i = start; i <= end; i += step) {\n    result.push(i);\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createRangeIterator297` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0298",
    "number": 298,
    "title": "Array Negative Indexing Proxy",
    "slug": "fjp-0298-array-negative-indexing-proxy",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Proxy",
      "Traps",
      "Metaprogramming"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Standard",
    "isMostAsked": false,
    "companyTags": [
      "DoorDash-Style",
      "Instacart-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Wrap an array with a Proxy so negative indices (e.g. `arr[-1]`) access elements from the end, matching Python indexing.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [10, 20, 30], access -1",
        "output": "30"
      }
    ],
    "starterCode": "function createNegativeIndexArray298(arr) {\n  // TODO\n}",
    "functionName": "createNegativeIndexArray298",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[10, 20, 30]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[\"a\", \"b\", \"c\"]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createNegativeIndexArray298(arr) {\n  return new Proxy(arr, {\n    get(target, prop, receiver) {\n      if (typeof prop === \"string\" && !isNaN(Number(prop))) {\n        let index = Number(prop);\n        if (index < 0) index = target.length + index;\n        return target[index];\n      }\n      return Reflect.get(target, prop, receiver);\n    }\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createNegativeIndexArray298` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0299",
    "number": 299,
    "title": "Bi-Directional Map Store",
    "slug": "fjp-0299-bi-directional-map-store",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map",
      "Key-Value",
      "Bi-directional"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Standard",
    "isMostAsked": false,
    "companyTags": [
      "Figma-Style",
      "Canva-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Create an object or class that allows lookup by both key->value and value->key in O(1) time.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "set(\"a\", 1)",
        "output": "get(\"a\") === 1, getKey(1) === \"a\""
      }
    ],
    "starterCode": "function createBiDirectionalMap299(entries) {\n  // TODO\n}",
    "functionName": "createBiDirectionalMap299",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[[\"a\", 1], [\"b\", 2]]]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[]]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createBiDirectionalMap299(entries) {\n  const forward = new Map();\n  const backward = new Map();\n  for (const [k, v] of (entries || [])) {\n    forward.set(k, v);\n    backward.set(v, k);\n  }\n  return {\n    get: (k) => forward.get(k),\n    getKey: (v) => backward.get(v),\n    size: () => forward.size\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createBiDirectionalMap299` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  },
  {
    "id": "FJP-0300",
    "number": 300,
    "title": "LRU Cache Store Using Map",
    "slug": "fjp-0300-lru-cache-store-using-map",
    "category": "Modern JavaScript",
    "subcategory": "ES6+, Iterators, Generators, Map, Set & Proxies",
    "difficulty": "Hard",
    "frontendTopic": "Modern ES6+ Syntax, Iteration & Proxies",
    "javascriptConcepts": [
      "Map Keys Order",
      "LRU",
      "Data Structures"
    ],
    "interviewType": "Coding",
    "frequencyRank": "Standard",
    "isMostAsked": false,
    "companyTags": [
      "Google-Style",
      "Meta-Pattern"
    ],
    "startupTag": "Frontend Engineering Pattern",
    "scenarioType": "Algorithm & State",
    "problemStatement": "Implement an LRU Cache with capacity `capacity`. Must support `get(key)` and `put(key, value)` with O(1) access order eviction.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "capacity = 2",
        "output": "Evicts least recently used"
      }
    ],
    "starterCode": "function createLRUCache300(capacity) {\n  // TODO\n}",
    "functionName": "createLRUCache300",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[2]",
        "expectedOutput": "object",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[5]",
        "expectedOutput": "object",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function createLRUCache300(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, val) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n      map.set(key, val);\n    },\n    size() { return map.size; }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `createLRUCache300` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.941Z",
    "updatedAt": "2026-09-10T04:07:54.941Z"
  }
];
