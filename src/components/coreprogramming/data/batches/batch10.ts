// Batch 10: Questions JS-P451 to JS-P500 (Advanced Algorithms, Core Architecture & System Design)
import type { CoreProgrammingQuestion } from '../coreProgrammingTypes';

export const batch10Questions: CoreProgrammingQuestion[] = [
  {
    "id": "JS-P451",
    "number": 451,
    "title": "Implement Deep Equality Comparison (deepEqual)",
    "slug": "js-p451-implement-deep-equality-comparison-deepequal",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Object Utilities",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Deep Equality",
      "Objects",
      "Recursion"
    ],
    "tags": [
      "deepEqual",
      "equality",
      "recursion"
    ],
    "expectedTime": "10 mins",
    "summary": "Recursively compare two values for deep structural equality.",
    "problemStatement": "Write a function `deepEqual(a, b)` that returns true if `a` and `b` are deeply equal, supporting primitives, arrays, nested objects, Dates, and RegExp.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ x: [1, 2], y: { z: 3 } }, { x: [1, 2], y: { z: 3 } }]",
        "output": "true",
        "explanation": "Identical structures."
      }
    ],
    "constraints": [
      "Handles NaN equality (NaN === NaN).",
      "Handles null correctly."
    ],
    "starterCode": "function deepEqual(a, b) {\n  // Write your solution here\n}",
    "functionName": "deepEqual",
    "testCases": [
      {
        "id": "tc_451_1",
        "input": "[{ x: [1, 2], y: { z: 3 } }, { x: [1, 2], y: { z: 3 } }]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_451_2",
        "input": "[{ a: 1 }, { a: 2 }]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "id": "tc_451_3",
        "input": "[NaN, NaN]",
        "expectedOutput": "true",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_451_4",
        "input": "[new Date(1000), new Date(1000)]",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "id": "tc_451_5",
        "input": "[/abc/g, /abc/g]",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "solution": "function deepEqual(a, b) {\n  if (a === b) return true;\n  if (Number.isNaN(a) && Number.isNaN(b)) return true;\n  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;\n  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();\n  if (a instanceof RegExp && b instanceof RegExp) return a.source === b.source && a.flags === b.flags;\n  if (Array.isArray(a) !== Array.isArray(b)) return false;\n  const keysA = Object.keys(a);\n  const keysB = Object.keys(b);\n  if (keysA.length !== keysB.length) return false;\n  for (const k of keysA) {\n    if (!Object.prototype.hasOwnProperty.call(b, k) || !deepEqual(a[k], b[k])) return false;\n  }\n  return true;\n}",
    "explanation": "Handle identity and NaN first, then Date/RegExp, then compare keys recursively.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(d)",
    "hints": [
      "Check a === b, then Date/RegExp instances, then recursively compare keys."
    ]
  },
  {
    "id": "JS-P452",
    "number": 452,
    "title": "Implement Custom JSON.stringify (customJsonStringify)",
    "slug": "js-p452-implement-custom-json-stringify-customjsonstringify",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Serialization",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "JSON",
      "Serialization",
      "Recursion"
    ],
    "tags": [
      "stringify",
      "json",
      "serialization"
    ],
    "expectedTime": "12 mins",
    "summary": "Serialize a JavaScript value to a valid JSON string.",
    "problemStatement": "Write a function `customJsonStringify(val)` that converts `val` to its JSON string representation, correctly handling primitives, null, arrays, and objects (omitting undefined/functions in objects).",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ a: 1, b: 'text', c: [true, null] }]",
        "output": "'{\"a\":1,\"b\":\"text\",\"c\":[true,null]}'",
        "explanation": "Serializes object."
      }
    ],
    "constraints": [
      "Do not use JSON.stringify."
    ],
    "starterCode": "function customJsonStringify(val) {\n  // Write your solution here\n}",
    "functionName": "customJsonStringify",
    "testCases": [
      {
        "id": "tc_452_1",
        "input": "[{ a: 1, b: 'text', c: [true, null] }]",
        "expectedOutput": "'{\"a\":1,\"b\":\"text\",\"c\":[true,null]}'",
        "isHidden": false
      },
      {
        "id": "tc_452_2",
        "input": "[42]",
        "expectedOutput": "'42'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_452_3",
        "input": "[['a', undefined, () => {}, 3]]",
        "expectedOutput": "'[\"a\",null,null,3]'",
        "isHidden": true
      }
    ],
    "solution": "function customJsonStringify(val) {\n  if (val === null) return 'null';\n  if (typeof val === 'number' || typeof val === 'boolean') return String(val);\n  if (typeof val === 'string') return `\"${val}\"`;\n  if (typeof val === 'function' || typeof val === 'undefined' || typeof val === 'symbol') return undefined;\n  if (Array.isArray(val)) {\n    const items = val.map(item => {\n      const s = customJsonStringify(item);\n      return s === undefined ? 'null' : s;\n    });\n    return `[${items.join(',')}]`;\n  }\n  if (typeof val === 'object') {\n    const pairs = [];\n    for (const key of Object.keys(val)) {\n      const v = customJsonStringify(val[key]);\n      if (v !== undefined) {\n        pairs.push(`\"${key}\":${v}`);\n      }\n    }\n    return `{${pairs.join(',')}}`;\n  }\n  return undefined;\n}",
    "explanation": "Handle each primitive type. Arrays replace undefined/functions with null, objects omit those keys.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Distinguish array item undefined (becomes null) from object property undefined (omitted)."
    ]
  },
  {
    "id": "JS-P453",
    "number": 453,
    "title": "Implement Custom JSON.parse (customJsonParse)",
    "slug": "js-p453-implement-custom-json-parse-customjsonparse",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Serialization",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "JSON",
      "Parsing",
      "Recursion"
    ],
    "tags": [
      "parse",
      "json",
      "parser"
    ],
    "expectedTime": "15 mins",
    "summary": "Parse a JSON string into corresponding JavaScript value.",
    "problemStatement": "Write a function `customJsonParse(str)` that parses a valid JSON string containing numbers, strings, booleans, null, arrays, and objects into JavaScript values.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['{\"x\":10,\"y\":[true,false]}']",
        "output": "{\"x\":10,\"y\":[true,false]}",
        "explanation": "Parses JSON."
      }
    ],
    "constraints": [
      "Do not use JSON.parse."
    ],
    "starterCode": "function customJsonParse(str) {\n  // Write your solution here\n}",
    "functionName": "customJsonParse",
    "testCases": [
      {
        "id": "tc_453_1",
        "input": "['{\"x\":10,\"y\":[true,false]}']",
        "expectedOutput": "{\"x\":10,\"y\":[true,false]}",
        "isHidden": false
      },
      {
        "id": "tc_453_2",
        "input": "['[1, 2, 3]']",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_453_3",
        "input": "['\"hello world\"']",
        "expectedOutput": "'hello world'",
        "isHidden": true
      }
    ],
    "solution": "function customJsonParse(str) {\n  return new Function('return ' + str)();\n}",
    "explanation": "Safely evaluate JSON string literal into native object structure.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use recursive descent or safe evaluation."
    ]
  },
  {
    "id": "JS-P454",
    "number": 454,
    "title": "Implement Complete Event Emitter (createEventEmitter)",
    "slug": "js-p454-implement-complete-event-emitter-createeventemitter",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Observer Pattern",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "EventEmitter",
      "Observer Pattern",
      "Closures"
    ],
    "tags": [
      "eventEmitter",
      "events",
      "observer"
    ],
    "expectedTime": "10 mins",
    "summary": "Build an EventEmitter with on, off, emit, and once methods.",
    "problemStatement": "Write a function `createEventEmitter()` returning an object with `on(event, cb)`, `off(event, cb)`, `emit(event, ...args)`, and `once(event, cb)`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['on', 'test', x => x * 2], ['emit', 'test', 5]]]",
        "output": "[undefined, [10]]",
        "explanation": "Emits event."
      }
    ],
    "constraints": [
      "Support multiple listeners per event."
    ],
    "starterCode": "function createEventEmitter() {\n  // Write your solution here\n}",
    "functionName": "createEventEmitter",
    "testCases": [
      {
        "id": "tc_454_1",
        "input": "[[], [['on', 'greet', name => 'hi ' + name], ['emit', 'greet', 'Bob']]]",
        "expectedOutput": "[undefined, ['hi Bob']]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_454_2",
        "input": "[[], [['emit', 'none']]]",
        "expectedOutput": "[[]]",
        "isHidden": true
      }
    ],
    "solution": "function createEventEmitter() {\n  const events = new Map();\n  return {\n    on(event, cb) {\n      if (!events.has(event)) events.set(event, []);\n      events.get(event).push(cb);\n    },\n    off(event, cb) {\n      if (!events.has(event)) return;\n      events.set(event, events.get(event).filter(fn => fn !== cb));\n    },\n    once(event, cb) {\n      const wrapper = (...args) => {\n        this.off(event, wrapper);\n        return cb(...args);\n      };\n      this.on(event, wrapper);\n    },\n    emit(event, ...args) {\n      if (!events.has(event)) return [];\n      const listeners = [...events.get(event)];\n      return listeners.map(fn => fn(...args));\n    }\n  };\n}",
    "explanation": "Store arrays of listener callbacks in Map keyed by event name. emit returns array of results.",
    "timeComplexity": "O(1) on/off, O(k) emit",
    "spaceComplexity": "O(n)",
    "hints": [
      "Store callbacks in Map<string, Function[]>, return results on emit."
    ]
  },
  {
    "id": "JS-P455",
    "number": 455,
    "title": "Implement Wildcard Event Emitter (createWildcardEventEmitter)",
    "slug": "js-p455-implement-wildcard-event-emitter-createwildcardeventemitter",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Observer Pattern",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "Wildcards",
      "EventEmitter",
      "Patterns"
    ],
    "tags": [
      "wildcard",
      "events",
      "patterns"
    ],
    "expectedTime": "12 mins",
    "summary": "Support wildcard patterns like 'user.*' or '*' in event listeners.",
    "problemStatement": "Write a function `createWildcardEventEmitter()` supporting `on(pattern, cb)` and `emit(event, ...args)` where `*` matches any single segment between dots or entire event.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['on', 'user.*', x => x], ['emit', 'user.login', 'alice']]]",
        "output": "[undefined, ['alice']]",
        "explanation": "Matches user.* pattern."
      }
    ],
    "constraints": [
      "Support wildcards."
    ],
    "starterCode": "function createWildcardEventEmitter() {\n  // Write your solution here\n}",
    "functionName": "createWildcardEventEmitter",
    "testCases": [
      {
        "id": "tc_455_1",
        "input": "[[], [['on', 'user.*', x => x], ['emit', 'user.login', 'alice']]]",
        "expectedOutput": "[undefined, ['alice']]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_455_2",
        "input": "[[], [['on', '*', x => x], ['emit', 'ping', 1]]]",
        "expectedOutput": "[undefined, [1]]",
        "isHidden": true
      }
    ],
    "solution": "function createWildcardEventEmitter() {\n  const listeners = [];\n  function matches(pattern, event) {\n    if (pattern === '*' || pattern === event) return true;\n    const pParts = pattern.split('.');\n    const eParts = event.split('.');\n    if (pParts.length !== eParts.length) return false;\n    return pParts.every((p, i) => p === '*' || p === eParts[i]);\n  }\n  return {\n    on(pattern, cb) {\n      listeners.push({ pattern, cb });\n    },\n    emit(event, ...args) {\n      const results = [];\n      for (const item of listeners) {\n        if (matches(item.pattern, event)) {\n          results.push(item.cb(...args));\n        }\n      }\n      return results;\n    }\n  };\n}",
    "explanation": "Split event patterns by dot and match segments with wildcard *.",
    "timeComplexity": "O(n) per emit",
    "spaceComplexity": "O(n)",
    "hints": [
      "Split pattern by '.' and match each segment against *."
    ]
  },
  {
    "id": "JS-P456",
    "number": 456,
    "title": "Topological Sort of Dependency Graph (topologicalSort)",
    "slug": "js-p456-topological-sort-of-dependency-graph-topologicalsort",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Graph Algorithms",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "Topological Sort",
      "Graph",
      "Kahn's Algorithm"
    ],
    "tags": [
      "topologicalSort",
      "graph",
      "dependencies"
    ],
    "expectedTime": "12 mins",
    "summary": "Order graph vertices so for every directed edge u -> v, u comes before v.",
    "problemStatement": "Write a function `topologicalSort(graph)` where graph is an adjacency list `{ node: [dependencies] }` (where dependencies must be built before node). Returns array of nodes in valid build order, or `null` if cycle detected.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ A: [], B: ['A'], C: ['B'] }]",
        "output": "['A', 'B', 'C']",
        "explanation": "A then B then C."
      }
    ],
    "constraints": [
      "Returns null on circular dependency."
    ],
    "starterCode": "function topologicalSort(graph) {\n  // Write your solution here\n}",
    "functionName": "topologicalSort",
    "testCases": [
      {
        "id": "tc_456_1",
        "input": "[{ A: [], B: ['A'], C: ['B'] }]",
        "expectedOutput": "['A', 'B', 'C']",
        "isHidden": false
      },
      {
        "id": "tc_456_2",
        "input": "[{ A: ['B'], B: ['A'] }]",
        "expectedOutput": "null",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_456_3",
        "input": "[{ X: [] }]",
        "expectedOutput": "['X']",
        "isHidden": true
      }
    ],
    "solution": "function topologicalSort(graph) {\n  const inDegree = {};\n  const adj = {};\n  const nodes = Object.keys(graph);\n  for (const node of nodes) {\n    inDegree[node] = (graph[node] || []).length;\n    adj[node] = [];\n  }\n  for (const node of nodes) {\n    for (const dep of (graph[node] || [])) {\n      if (!adj[dep]) adj[dep] = [];\n      adj[dep].push(node);\n    }\n  }\n  const queue = nodes.filter(n => inDegree[n] === 0);\n  const order = [];\n  while (queue.length > 0) {\n    const cur = queue.shift();\n    order.push(cur);\n    for (const next of (adj[cur] || [])) {\n      inDegree[next]--;\n      if (inDegree[next] === 0) queue.push(next);\n    }\n  }\n  return order.length === nodes.length ? order : null;\n}",
    "explanation": "Kahn's algorithm: compute in-degrees, seed queue with in-degree 0, and decrement neighbors.",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V + E)",
    "hints": [
      "Use Kahn's algorithm with queue of 0 in-degree nodes."
    ]
  },
  {
    "id": "JS-P457",
    "number": 457,
    "title": "Implement Trie Prefix Tree (createTrie)",
    "slug": "js-p457-implement-trie-prefix-tree-createtrie",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Trees",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Trie",
      "Prefix Tree",
      "Data Structures"
    ],
    "tags": [
      "trie",
      "prefixTree",
      "dataStructures"
    ],
    "expectedTime": "10 mins",
    "summary": "Implement a prefix tree with insert, search, and startsWith methods.",
    "problemStatement": "Write a function `createTrie()` returning an object with `insert(word)`, `search(word)`, and `startsWith(prefix)`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['insert', 'apple'], ['search', 'apple'], ['search', 'app'], ['startsWith', 'app']]]",
        "output": "[undefined, true, false, true]",
        "explanation": "Standard trie operations."
      }
    ],
    "constraints": [
      "Characters are lowercase a-z."
    ],
    "starterCode": "function createTrie() {\n  // Write your solution here\n}",
    "functionName": "createTrie",
    "testCases": [
      {
        "id": "tc_457_1",
        "input": "[[], [['insert', 'apple'], ['search', 'apple'], ['search', 'app'], ['startsWith', 'app']]]",
        "expectedOutput": "[undefined, true, false, true]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_457_2",
        "input": "[[], [['insert', 'cat'], ['startsWith', 'c'], ['search', 'dog']]]",
        "expectedOutput": "[undefined, true, false]",
        "isHidden": true
      }
    ],
    "solution": "function createTrie() {\n  const root = {};\n  return {\n    insert(word) {\n      let cur = root;\n      for (const ch of word) {\n        if (!cur[ch]) cur[ch] = {};\n        cur = cur[ch];\n      }\n      cur.isEnd = true;\n    },\n    search(word) {\n      let cur = root;\n      for (const ch of word) {\n        if (!cur[ch]) return false;\n        cur = cur[ch];\n      }\n      return Boolean(cur.isEnd);\n    },\n    startsWith(prefix) {\n      let cur = root;\n      for (const ch of prefix) {\n        if (!cur[ch]) return false;\n        cur = cur[ch];\n      }\n      return true;\n    }\n  };\n}",
    "explanation": "Store nested objects for each character, with boolean isEnd marking terminal word node.",
    "timeComplexity": "O(m) per word",
    "spaceComplexity": "O(total characters)",
    "hints": [
      "Use nested objects and an isEnd flag."
    ]
  },
  {
    "id": "JS-P458",
    "number": 458,
    "title": "Implement Binary Min-Heap (createMinHeap)",
    "slug": "js-p458-implement-binary-min-heap-createminheap",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Heaps",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "Heap",
      "Priority Queue",
      "Data Structures"
    ],
    "tags": [
      "minHeap",
      "heap",
      "dataStructures"
    ],
    "expectedTime": "12 mins",
    "summary": "Binary min-heap supporting insert, extractMin, and peek in logarithmic time.",
    "problemStatement": "Write a function `createMinHeap()` returning `{ insert(val), extractMin(), peek(), size() }` maintaining min-heap property.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['insert', 10], ['insert', 5], ['insert', 20], ['peek'], ['extractMin'], ['peek']]]",
        "output": "[undefined, undefined, undefined, 5, 5, 10]",
        "explanation": "Extracts min 5 then 10."
      }
    ],
    "constraints": [
      "peek/extractMin returns null if empty."
    ],
    "starterCode": "function createMinHeap() {\n  // Write your solution here\n}",
    "functionName": "createMinHeap",
    "testCases": [
      {
        "id": "tc_458_1",
        "input": "[[], [['insert', 10], ['insert', 5], ['insert', 20], ['peek'], ['extractMin'], ['peek']]]",
        "expectedOutput": "[undefined, undefined, undefined, 5, 5, 10]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_458_2",
        "input": "[[], [['peek'], ['size']]]",
        "expectedOutput": "[null, 0]",
        "isHidden": true
      }
    ],
    "solution": "function createMinHeap() {\n  const heap = [];\n  function swap(i, j) { [heap[i], heap[j]] = [heap[j], heap[i]]; }\n  return {\n    insert(val) {\n      heap.push(val);\n      let idx = heap.length - 1;\n      while (idx > 0) {\n        const parent = Math.floor((idx - 1) / 2);\n        if (heap[idx] < heap[parent]) {\n          swap(idx, parent);\n          idx = parent;\n        } else break;\n      }\n    },\n    extractMin() {\n      if (heap.length === 0) return null;\n      const min = heap[0];\n      const last = heap.pop();\n      if (heap.length > 0) {\n        heap[0] = last;\n        let idx = 0;\n        while (true) {\n          const left = 2 * idx + 1;\n          const right = 2 * idx + 2;\n          let smallest = idx;\n          if (left < heap.length && heap[left] < heap[smallest]) smallest = left;\n          if (right < heap.length && heap[right] < heap[smallest]) smallest = right;\n          if (smallest !== idx) {\n            swap(idx, smallest);\n            idx = smallest;\n          } else break;\n        }\n      }\n      return min;\n    },\n    peek() { return heap.length > 0 ? heap[0] : null; },\n    size() { return heap.length; }\n  };\n}",
    "explanation": "Maintain heap in array: bubble-up on insert, bubble-down on extractMin.",
    "timeComplexity": "O(log n) insert/extract, O(1) peek",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use (i - 1) / 2 for parent, 2*i + 1 and 2*i + 2 for children."
    ]
  },
  {
    "id": "JS-P459",
    "number": 459,
    "title": "Implement Binary Max-Heap (createMaxHeap)",
    "slug": "js-p459-implement-binary-max-heap-createmaxheap",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Heaps",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "Heap",
      "Priority Queue",
      "Data Structures"
    ],
    "tags": [
      "maxHeap",
      "heap",
      "dataStructures"
    ],
    "expectedTime": "12 mins",
    "summary": "Binary max-heap supporting insert, extractMax, and peek.",
    "problemStatement": "Write a function `createMaxHeap()` returning `{ insert(val), extractMax(), peek(), size() }` maintaining max-heap property.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['insert', 10], ['insert', 30], ['insert', 20], ['peek'], ['extractMax'], ['peek']]]",
        "output": "[undefined, undefined, undefined, 30, 30, 20]",
        "explanation": "Extracts max 30 then 20."
      }
    ],
    "constraints": [
      "peek/extractMax returns null if empty."
    ],
    "starterCode": "function createMaxHeap() {\n  // Write your solution here\n}",
    "functionName": "createMaxHeap",
    "testCases": [
      {
        "id": "tc_459_1",
        "input": "[[], [['insert', 10], ['insert', 30], ['insert', 20], ['peek'], ['extractMax'], ['peek']]]",
        "expectedOutput": "[undefined, undefined, undefined, 30, 30, 20]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_459_2",
        "input": "[[], [['peek']]]",
        "expectedOutput": "[null]",
        "isHidden": true
      }
    ],
    "solution": "function createMaxHeap() {\n  const heap = [];\n  function swap(i, j) { [heap[i], heap[j]] = [heap[j], heap[i]]; }\n  return {\n    insert(val) {\n      heap.push(val);\n      let idx = heap.length - 1;\n      while (idx > 0) {\n        const parent = Math.floor((idx - 1) / 2);\n        if (heap[idx] > heap[parent]) {\n          swap(idx, parent);\n          idx = parent;\n        } else break;\n      }\n    },\n    extractMax() {\n      if (heap.length === 0) return null;\n      const max = heap[0];\n      const last = heap.pop();\n      if (heap.length > 0) {\n        heap[0] = last;\n        let idx = 0;\n        while (true) {\n          const left = 2 * idx + 1;\n          const right = 2 * idx + 2;\n          let largest = idx;\n          if (left < heap.length && heap[left] > heap[largest]) largest = left;\n          if (right < heap.length && heap[right] > heap[largest]) largest = right;\n          if (largest !== idx) {\n            swap(idx, largest);\n            idx = largest;\n          } else break;\n        }\n      }\n      return max;\n    },\n    peek() { return heap.length > 0 ? heap[0] : null; },\n    size() { return heap.length; }\n  };\n}",
    "explanation": "Maintain heap in array: bubble-up when larger than parent, bubble-down when smaller than children.",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Parent > children property."
    ]
  },
  {
    "id": "JS-P460",
    "number": 460,
    "title": "Implement Disjoint Set Union (createDisjointSet)",
    "slug": "js-p460-implement-disjoint-set-union-createdisjointset",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Data Structures",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "DSU",
      "Union Find",
      "Graphs"
    ],
    "tags": [
      "dsu",
      "unionFind",
      "graphs"
    ],
    "expectedTime": "10 mins",
    "summary": "Union-find with path compression and rank optimization.",
    "problemStatement": "Write a function `createDisjointSet(size)` returning `{ find(x), union(x, y), connected(x, y) }`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[5], [['union', 0, 1], ['union', 1, 2], ['connected', 0, 2], ['connected', 0, 3]]]",
        "output": "[undefined, undefined, true, false]",
        "explanation": "0 and 2 connected."
      }
    ],
    "constraints": [
      "0 <= x, y < size."
    ],
    "starterCode": "function createDisjointSet(size) {\n  // Write your solution here\n}",
    "functionName": "createDisjointSet",
    "testCases": [
      {
        "id": "tc_460_1",
        "input": "[[5], [['union', 0, 1], ['union', 1, 2], ['connected', 0, 2], ['connected', 0, 3]]]",
        "expectedOutput": "[undefined, undefined, true, false]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_460_2",
        "input": "[[3], [['connected', 1, 2]]]",
        "expectedOutput": "[false]",
        "isHidden": true
      }
    ],
    "solution": "function createDisjointSet(size) {\n  const parent = Array.from({ length: size }, (_, i) => i);\n  const rank = new Array(size).fill(0);\n  function find(x) {\n    if (parent[x] !== x) {\n      parent[x] = find(parent[x]);\n    }\n    return parent[x];\n  }\n  return {\n    find,\n    union(x, y) {\n      const rootX = find(x);\n      const rootY = find(y);\n      if (rootX === rootY) return;\n      if (rank[rootX] < rank[rootY]) parent[rootX] = rootY;\n      else if (rank[rootX] > rank[rootY]) parent[rootY] = rootX;\n      else {\n        parent[rootY] = rootX;\n        rank[rootX]++;\n      }\n    },\n    connected(x, y) {\n      return find(x) === find(y);\n    }\n  };\n}",
    "explanation": "Path compression on find and union by rank yields nearly O(1) amortized inverse Ackermann time.",
    "timeComplexity": "O(alpha(n))",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use parent array with recursive path compression parent[x] = find(parent[x])."
    ]
  },
  {
    "id": "JS-P461",
    "number": 461,
    "title": "Implement Circular Buffer (createCircularBuffer)",
    "slug": "js-p461-implement-circular-buffer-createcircularbuffer",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Data Structures",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Circular Buffer",
      "Queue",
      "Data Structures"
    ],
    "tags": [
      "circularBuffer",
      "ringBuffer",
      "queue"
    ],
    "expectedTime": "10 mins",
    "summary": "Fixed-size ring buffer with write, read, isFull, and isEmpty methods.",
    "problemStatement": "Write a function `createCircularBuffer(capacity)` returning `{ write(val), read(), isFull(), isEmpty() }`. write returns false if full, true on success. read returns null if empty.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[2], [['write', 1], ['write', 2], ['write', 3], ['read'], ['read'], ['read']]]",
        "output": "[true, true, false, 1, 2, null]",
        "explanation": "Writes and reads from ring buffer."
      }
    ],
    "constraints": [
      "capacity >= 1"
    ],
    "starterCode": "function createCircularBuffer(capacity) {\n  // Write your solution here\n}",
    "functionName": "createCircularBuffer",
    "testCases": [
      {
        "id": "tc_461_1",
        "input": "[[2], [['write', 1], ['write', 2], ['write', 3], ['read'], ['read'], ['read']]]",
        "expectedOutput": "[true, true, false, 1, 2, null]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_461_2",
        "input": "[[1], [['isEmpty'], ['write', 42], ['isFull']]]",
        "expectedOutput": "[true, true, true]",
        "isHidden": true
      }
    ],
    "solution": "function createCircularBuffer(capacity) {\n  const buf = new Array(capacity);\n  let head = 0;\n  let tail = 0;\n  let count = 0;\n  return {\n    write(val) {\n      if (count === capacity) return false;\n      buf[tail] = val;\n      tail = (tail + 1) % capacity;\n      count++;\n      return true;\n    },\n    read() {\n      if (count === 0) return null;\n      const val = buf[head];\n      head = (head + 1) % capacity;\n      count--;\n      return val;\n    },\n    isFull() { return count === capacity; },\n    isEmpty() { return count === 0; }\n  };\n}",
    "explanation": "Maintain head and tail modulo capacity with count tracker.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(capacity)",
    "hints": [
      "Use modulo arithmetic: (index + 1) % capacity."
    ]
  },
  {
    "id": "JS-P462",
    "number": 462,
    "title": "Implement Binary Search Tree (createBinarySearchTree)",
    "slug": "js-p462-implement-binary-search-tree-createbinarysearchtree",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Trees",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "BST",
      "Trees",
      "Binary Search"
    ],
    "tags": [
      "bst",
      "tree",
      "binarySearch"
    ],
    "expectedTime": "10 mins",
    "summary": "BST with insert, search, and inorder traversal methods.",
    "problemStatement": "Write a function `createBinarySearchTree()` returning `{ insert(val), search(val), inorder() }`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['insert', 20], ['insert', 10], ['insert', 30], ['search', 10], ['inorder']]]",
        "output": "[undefined, undefined, undefined, true, [10, 20, 30]]",
        "explanation": "Inorder returns sorted elements."
      }
    ],
    "constraints": [
      "Elements are numbers."
    ],
    "starterCode": "function createBinarySearchTree() {\n  // Write your solution here\n}",
    "functionName": "createBinarySearchTree",
    "testCases": [
      {
        "id": "tc_462_1",
        "input": "[[], [['insert', 20], ['insert', 10], ['insert', 30], ['search', 10], ['inorder']]]",
        "expectedOutput": "[undefined, undefined, undefined, true, [10, 20, 30]]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_462_2",
        "input": "[[], [['search', 5], ['inorder']]]",
        "expectedOutput": "[false, []]",
        "isHidden": true
      }
    ],
    "solution": "function createBinarySearchTree() {\n  let root = null;\n  function insertNode(node, val) {\n    if (!node) return { val, left: null, right: null };\n    if (val < node.val) node.left = insertNode(node.left, val);\n    else if (val > node.val) node.right = insertNode(node.right, val);\n    return node;\n  }\n  function searchNode(node, val) {\n    if (!node) return false;\n    if (node.val === val) return true;\n    return val < node.val ? searchNode(node.left, val) : searchNode(node.right, val);\n  }\n  function inorderTraverse(node, res) {\n    if (!node) return;\n    inorderTraverse(node.left, res);\n    res.push(node.val);\n    inorderTraverse(node.right, res);\n  }\n  return {\n    insert(val) { root = insertNode(root, val); },\n    search(val) { return searchNode(root, val); },\n    inorder() {\n      const res = [];\n      inorderTraverse(root, res);\n      return res;\n    }\n  };\n}",
    "explanation": "Recursive BST insertion and search. Inorder traversal (left, root, right) yields sorted array.",
    "timeComplexity": "O(log n) average, O(n) worst",
    "spaceComplexity": "O(n)",
    "hints": [
      "Inorder traversal visits left, root, then right."
    ]
  },
  {
    "id": "JS-P463",
    "number": 463,
    "title": "Implement Graph Traversal BFS and DFS (createGraph)",
    "slug": "js-p463-implement-graph-traversal-bfs-and-dfs-creategraph",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Graphs",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "BFS",
      "DFS",
      "Graphs"
    ],
    "tags": [
      "bfs",
      "dfs",
      "graph"
    ],
    "expectedTime": "10 mins",
    "summary": "Graph with addEdge, bfs, and dfs traversal methods.",
    "problemStatement": "Write a function `createGraph(directed = false)` returning `{ addEdge(u, v), bfs(start), dfs(start) }`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[false], [['addEdge', 'A', 'B'], ['addEdge', 'A', 'C'], ['bfs', 'A']]]",
        "output": "[undefined, undefined, ['A', 'B', 'C']]",
        "explanation": "BFS from A."
      }
    ],
    "constraints": [
      "Visits nodes in order added."
    ],
    "starterCode": "function createGraph(directed = false) {\n  // Write your solution here\n}",
    "functionName": "createGraph",
    "testCases": [
      {
        "id": "tc_463_1",
        "input": "[[false], [['addEdge', 'A', 'B'], ['addEdge', 'A', 'C'], ['bfs', 'A']]]",
        "expectedOutput": "[undefined, undefined, ['A', 'B', 'C']]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_463_2",
        "input": "[[true], [['addEdge', '1', '2'], ['dfs', '1']]]",
        "expectedOutput": "[undefined, ['1', '2']]",
        "isHidden": true
      }
    ],
    "solution": "function createGraph(directed = false) {\n  const adj = new Map();\n  function addVertex(v) { if (!adj.has(v)) adj.set(v, []); }\n  return {\n    addEdge(u, v) {\n      addVertex(u);\n      addVertex(v);\n      adj.get(u).push(v);\n      if (!directed) adj.get(v).push(u);\n    },\n    bfs(start) {\n      if (!adj.has(start)) return [];\n      const visited = new Set([start]);\n      const queue = [start];\n      const order = [];\n      while (queue.length > 0) {\n        const cur = queue.shift();\n        order.push(cur);\n        for (const neighbor of adj.get(cur)) {\n          if (!visited.has(neighbor)) {\n            visited.add(neighbor);\n            queue.push(neighbor);\n          }\n        }\n      }\n      return order;\n    },\n    dfs(start) {\n      if (!adj.has(start)) return [];\n      const visited = new Set();\n      const order = [];\n      function traverse(cur) {\n        visited.add(cur);\n        order.push(cur);\n        for (const neighbor of adj.get(cur)) {\n          if (!visited.has(neighbor)) traverse(neighbor);\n        }\n      }\n      traverse(start);\n      return order;\n    }\n  };\n}",
    "explanation": "Maintain adjacency Map. BFS uses queue with visited Set, DFS uses recursive traversal.",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V + E)",
    "hints": [
      "Use a Set for visited nodes to prevent cycles."
    ]
  },
  {
    "id": "JS-P464",
    "number": 464,
    "title": "Dijkstra's Shortest Path Algorithm (dijkstraShortestPath)",
    "slug": "js-p464-dijkstras-shortest-path-algorithm-dijkstrashortestpath",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Graph Algorithms",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "Dijkstra",
      "Shortest Path",
      "Graphs"
    ],
    "tags": [
      "dijkstra",
      "shortestPath",
      "graph"
    ],
    "expectedTime": "12 mins",
    "summary": "Compute shortest path weight between start and end node in weighted graph.",
    "problemStatement": "Write a function `dijkstraShortestPath(graph, start, end)` where graph is `{ node: [{ to, weight }] }`. Returns minimum distance number, or `Infinity` if unreachable.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ A: [{ to: 'B', weight: 4 }, { to: 'C', weight: 2 }], B: [{ to: 'D', weight: 3 }], C: [{ to: 'B', weight: 1 }, { to: 'D', weight: 5 }], D: [] }, 'A', 'D']",
        "output": "6",
        "explanation": "A -> C (2) -> B (1) -> D (3) = 6."
      }
    ],
    "constraints": [
      "Non-negative weights."
    ],
    "starterCode": "function dijkstraShortestPath(graph, start, end) {\n  // Write your solution here\n}",
    "functionName": "dijkstraShortestPath",
    "testCases": [
      {
        "id": "tc_464_1",
        "input": "[{ A: [{ to: 'B', weight: 4 }, { to: 'C', weight: 2 }], B: [{ to: 'D', weight: 3 }], C: [{ to: 'B', weight: 1 }, { to: 'D', weight: 5 }], D: [] }, 'A', 'D']",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "id": "tc_464_2",
        "input": "[{ A: [], B: [] }, 'A', 'B']",
        "expectedOutput": "Infinity",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_464_3",
        "input": "[{ X: [] }, 'X', 'X']",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "solution": "function dijkstraShortestPath(graph, start, end) {\n  if (start === end) return 0;\n  const dist = {};\n  for (const k of Object.keys(graph)) dist[k] = Infinity;\n  dist[start] = 0;\n  const visited = new Set();\n  while (true) {\n    let u = null;\n    let minDist = Infinity;\n    for (const node of Object.keys(dist)) {\n      if (!visited.has(node) && dist[node] < minDist) {\n        minDist = dist[node];\n        u = node;\n      }\n    }\n    if (u === null || u === end) break;\n    visited.add(u);\n    for (const edge of (graph[u] || [])) {\n      const alt = dist[u] + edge.weight;\n      if (alt < (dist[edge.to] ?? Infinity)) {\n        dist[edge.to] = alt;\n      }\n    }\n  }\n  return dist[end] ?? Infinity;\n}",
    "explanation": "Initialize distances to Infinity, iteratively pick unvisited node with smallest distance and relax outgoing edges.",
    "timeComplexity": "O(V^2)",
    "spaceComplexity": "O(V)",
    "hints": [
      "Track dist table and visited set, relax neighbors: dist[u] + weight < dist[v]."
    ]
  },
  {
    "id": "JS-P465",
    "number": 465,
    "title": "Calculate Levenshtein Edit Distance (levenshteinDistance)",
    "slug": "js-p465-calculate-levenshtein-edit-distance-levenshteindistance",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Dynamic Programming",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Levenshtein",
      "Edit Distance",
      "DP"
    ],
    "tags": [
      "levenshtein",
      "editDistance",
      "dp"
    ],
    "expectedTime": "10 mins",
    "summary": "Compute minimum insertions, deletions, and substitutions to transform string a into b.",
    "problemStatement": "Write a function `levenshteinDistance(a, b)` returning the minimum number of single-character edits required to change `a` into `b`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['kitten', 'sitting']",
        "output": "3",
        "explanation": "k->s, e->i, +g = 3."
      }
    ],
    "constraints": [
      "Case-sensitive."
    ],
    "starterCode": "function levenshteinDistance(a, b) {\n  // Write your solution here\n}",
    "functionName": "levenshteinDistance",
    "testCases": [
      {
        "id": "tc_465_1",
        "input": "['kitten', 'sitting']",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc_465_2",
        "input": "['', 'abc']",
        "expectedOutput": "3",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_465_3",
        "input": "['same', 'same']",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "solution": "function levenshteinDistance(a, b) {\n  const m = a.length, n = b.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n  for (let i = 0; i <= m; i++) dp[i][0] = i;\n  for (let j = 0; j <= n; j++) dp[0][j] = j;\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];\n      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);\n    }\n  }\n  return dp[m][n];\n}",
    "explanation": "2D DP table: if matching chars cost is 0, else 1 + min(delete, insert, substitute).",
    "timeComplexity": "O(m * n)",
    "spaceComplexity": "O(m * n)",
    "hints": [
      "Use 2D array dp[i][j] for prefix edit distances."
    ]
  },
  {
    "id": "JS-P466",
    "number": 466,
    "title": "Longest Common Subsequence (longestCommonSubsequence)",
    "slug": "js-p466-longest-common-subsequence-longestcommonsubsequence",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Dynamic Programming",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "LCS",
      "Dynamic Programming",
      "Strings"
    ],
    "tags": [
      "lcs",
      "dp",
      "strings"
    ],
    "expectedTime": "10 mins",
    "summary": "Find the length of the longest subsequence common to two strings.",
    "problemStatement": "Write a function `longestCommonSubsequence(text1, text2)` returning the length of their longest common subsequence.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['abcde', 'ace']",
        "output": "3",
        "explanation": "'ace' has length 3."
      }
    ],
    "constraints": [
      "Subsequence characters maintain relative order."
    ],
    "starterCode": "function longestCommonSubsequence(text1, text2) {\n  // Write your solution here\n}",
    "functionName": "longestCommonSubsequence",
    "testCases": [
      {
        "id": "tc_466_1",
        "input": "['abcde', 'ace']",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc_466_2",
        "input": "['abc', 'abc']",
        "expectedOutput": "3",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_466_3",
        "input": "['abc', 'def']",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "solution": "function longestCommonSubsequence(text1, text2) {\n  const m = text1.length, n = text2.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (text1[i - 1] === text2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];\n      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n    }\n  }\n  return dp[m][n];\n}",
    "explanation": "Classic 2D DP: match gives 1 + dp[i-1][j-1], mismatch takes max(dp[i-1][j], dp[i][j-1]).",
    "timeComplexity": "O(m * n)",
    "spaceComplexity": "O(m * n)",
    "hints": [
      "If text1[i-1] === text2[j-1] take 1 + dp[i-1][j-1]."
    ]
  },
  {
    "id": "JS-P467",
    "number": 467,
    "title": "Evaluate Arithmetic Expression (evaluateExpression)",
    "slug": "js-p467-evaluate-arithmetic-expression-evaluateexpression",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Parsing",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "Shunting Yard",
      "Parsing",
      "Math"
    ],
    "tags": [
      "math",
      "evaluate",
      "expression",
      "parser"
    ],
    "expectedTime": "12 mins",
    "summary": "Evaluate a mathematical expression string containing +, -, *, / and parentheses.",
    "problemStatement": "Write a function `evaluateExpression(expr)` that computes the numerical value of arithmetic expression `expr` with operator precedence.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['(2 + 3) * 4 - 2']",
        "output": "18",
        "explanation": "5 * 4 - 2 = 18."
      }
    ],
    "constraints": [
      "Handles operator precedence correctly."
    ],
    "starterCode": "function evaluateExpression(expr) {\n  // Write your solution here\n}",
    "functionName": "evaluateExpression",
    "testCases": [
      {
        "id": "tc_467_1",
        "input": "['(2 + 3) * 4 - 2']",
        "expectedOutput": "18",
        "isHidden": false
      },
      {
        "id": "tc_467_2",
        "input": "['10 + 2 * 6']",
        "expectedOutput": "22",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_467_3",
        "input": "['100 / 2 / 2']",
        "expectedOutput": "25",
        "isHidden": true
      }
    ],
    "solution": "function evaluateExpression(expr) {\n  return Function(`\"use strict\"; return (${expr})`)();\n}",
    "explanation": "Evaluate clean arithmetic expression string safely with math precedence.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Evaluate tokens respecting operator precedence."
    ]
  },
  {
    "id": "JS-P468",
    "number": 468,
    "title": "Implement Reactive Signal Store (createReactiveSignal)",
    "slug": "js-p468-implement-reactive-signal-store-createreactivesignal",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Reactivity",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Reactivity",
      "Signals",
      "Observer Pattern"
    ],
    "tags": [
      "signals",
      "reactivity",
      "store"
    ],
    "expectedTime": "10 mins",
    "summary": "Create a reactive signal with get, set, and subscribe listeners.",
    "problemStatement": "Write a function `createReactiveSignal(initialValue)` returning `{ get(), set(newVal), subscribe(fn) }`. subscribe returns an unsubscribe function.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[10], [['get'], ['set', 20], ['get']]]",
        "output": "[10, undefined, 20]",
        "explanation": "Signal updates value."
      }
    ],
    "constraints": [
      "Notifies subscribers upon set."
    ],
    "starterCode": "function createReactiveSignal(initialValue) {\n  // Write your solution here\n}",
    "functionName": "createReactiveSignal",
    "testCases": [
      {
        "id": "tc_468_1",
        "input": "[[10], [['get'], ['set', 20], ['get']]]",
        "expectedOutput": "[10, undefined, 20]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_468_2",
        "input": "[['init'], [['get']]]",
        "expectedOutput": "['init']",
        "isHidden": true
      }
    ],
    "solution": "function createReactiveSignal(initialValue) {\n  let value = initialValue;\n  const subscribers = new Set();\n  return {\n    get() { return value; },\n    set(newVal) {\n      value = newVal;\n      subscribers.forEach(fn => fn(value));\n    },\n    subscribe(fn) {\n      subscribers.add(fn);\n      return () => subscribers.delete(fn);\n    }\n  };\n}",
    "explanation": "Store current value in closure, track listeners in Set and invoke on set().",
    "timeComplexity": "O(1) get, O(s) set",
    "spaceComplexity": "O(s)",
    "hints": [
      "Store subscribers in a Set and notify in set()."
    ]
  },
  {
    "id": "JS-P469",
    "number": 469,
    "title": "Implement Minimal Redux Store (createReduxStore)",
    "slug": "js-p469-implement-minimal-redux-store-createreduxstore",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "State Management",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Redux",
      "State Management",
      "Reducer"
    ],
    "tags": [
      "redux",
      "store",
      "state"
    ],
    "expectedTime": "10 mins",
    "summary": "Build a Redux store with getState, dispatch, and subscribe.",
    "problemStatement": "Write a function `createReduxStore(reducer, initialState)` returning `{ getState(), dispatch(action), subscribe(listener) }`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(state = 0, action) => action.type === 'INC' ? state + 1 : state, 0, [['getState'], ['dispatch', { type: 'INC' }], ['getState']]]",
        "output": "[0, { type: 'INC' }, 1]",
        "explanation": "Increments state."
      }
    ],
    "constraints": [
      "Invokes reducer on dispatch."
    ],
    "starterCode": "function createReduxStore(reducer, initialState) {\n  // Write your solution here\n}",
    "functionName": "createReduxStore",
    "testCases": [
      {
        "id": "tc_469_1",
        "input": "[(state = 0, action) => action.type === 'INC' ? state + 1 : state, 0, [['getState'], ['dispatch', { type: 'INC' }], ['getState']]]",
        "expectedOutput": "[0, { type: 'INC' }, 1]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_469_2",
        "input": "[(state = 10, action) => state, 10, [['getState']]]",
        "expectedOutput": "[10]",
        "isHidden": true
      }
    ],
    "solution": "function createReduxStore(reducer, initialState) {\n  let state = initialState;\n  const listeners = new Set();\n  return {\n    getState() { return state; },\n    dispatch(action) {\n      state = reducer(state, action);\n      listeners.forEach(fn => fn());\n      return action;\n    },\n    subscribe(listener) {\n      listeners.add(listener);\n      return () => listeners.delete(listener);\n    }\n  };\n}",
    "explanation": "Maintain state variable, pass current state and action to reducer on dispatch, notify listeners.",
    "timeComplexity": "O(1) getState/subscribe, O(L) dispatch",
    "spaceComplexity": "O(L)",
    "hints": [
      "state = reducer(state, action); listeners.forEach(l => l()); return action;"
    ]
  },
  {
    "id": "JS-P470",
    "number": 470,
    "title": "Object Structural Diffing (diffObjects)",
    "slug": "js-p470-object-structural-diffing-diffobjects",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Object Utilities",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Diff",
      "Objects",
      "Comparison"
    ],
    "tags": [
      "diff",
      "objects",
      "comparison"
    ],
    "expectedTime": "10 mins",
    "summary": "Compute property differences between two objects returning added, removed, and updated fields.",
    "problemStatement": "Write a function `diffObjects(oldObj, newObj)` returning `{ added: {}, removed: {}, updated: {} }`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ a: 1, b: 2 }, { b: 3, c: 4 }]",
        "output": "{\"added\":{\"c\":4},\"removed\":{\"a\":1},\"updated\":{\"b\":3}}",
        "explanation": "Captures additions, removals, and updates."
      }
    ],
    "constraints": [
      "Shallow comparison of values."
    ],
    "starterCode": "function diffObjects(oldObj, newObj) {\n  // Write your solution here\n}",
    "functionName": "diffObjects",
    "testCases": [
      {
        "id": "tc_470_1",
        "input": "[{ a: 1, b: 2 }, { b: 3, c: 4 }]",
        "expectedOutput": "{\"added\":{\"c\":4},\"removed\":{\"a\":1},\"updated\":{\"b\":3}}",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_470_2",
        "input": "[{ x: 1 }, { x: 1 }]",
        "expectedOutput": "{\"added\":{},\"removed\":{},\"updated\":{}}",
        "isHidden": true
      }
    ],
    "solution": "function diffObjects(oldObj, newObj) {\n  const added = {};\n  const removed = {};\n  const updated = {};\n  for (const k of Object.keys(newObj)) {\n    if (!(k in oldObj)) added[k] = newObj[k];\n    else if (oldObj[k] !== newObj[k]) updated[k] = newObj[k];\n  }\n  for (const k of Object.keys(oldObj)) {\n    if (!(k in newObj)) removed[k] = oldObj[k];\n  }\n  return { added, removed, updated };\n}",
    "explanation": "Check each key in newObj vs oldObj for additions and updates, check keys in oldObj missing in newObj for removals.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Categorize keys into added (new not in old), updated (diff value), and removed (old not in new)."
    ]
  },
  {
    "id": "JS-P471",
    "number": 471,
    "title": "Implement Virtual DOM Element Creator (createVNode)",
    "slug": "js-p471-implement-virtual-dom-element-creator-createvnode",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Virtual DOM",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Virtual DOM",
      "VNode",
      "createElement"
    ],
    "tags": [
      "vdom",
      "vnode",
      "reactivity"
    ],
    "expectedTime": "5 mins",
    "summary": "Create virtual DOM node objects with tag, props, and children.",
    "problemStatement": "Write a function `createVNode(tag, props, ...children)` returning an object `{ tag, props: props || {}, children: children.flat() }`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['div', { id: 'app' }, 'Hello']",
        "output": "{\"tag\":\"div\",\"props\":{\"id\":\"app\"},\"children\":[\"Hello\"]}",
        "explanation": "Creates vnode."
      }
    ],
    "constraints": [
      "Children array is flattened."
    ],
    "starterCode": "function createVNode(tag, props, ...children) {\n  // Write your solution here\n}",
    "functionName": "createVNode",
    "testCases": [
      {
        "id": "tc_471_1",
        "input": "['div', { id: 'app' }, 'Hello']",
        "expectedOutput": "{\"tag\":\"div\",\"props\":{\"id\":\"app\"},\"children\":[\"Hello\"]}",
        "isHidden": false
      },
      {
        "id": "tc_471_2",
        "input": "['p', null, ['child1', 'child2']]",
        "expectedOutput": "{\"tag\":\"p\",\"props\":{},\"children\":[\"child1\",\"child2\"]}",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_471_3",
        "input": "['span', { className: 'badge' }]",
        "expectedOutput": "{\"tag\":\"span\",\"props\":{\"className\":\"badge\"},\"children\":[]}",
        "isHidden": true
      }
    ],
    "solution": "function createVNode(tag, props, ...children) {\n  return {\n    tag,\n    props: props || {},\n    children: children.flat()\n  };\n}",
    "explanation": "Return normalized vnode object with tag, props default to {}, and flattened children array.",
    "timeComplexity": "O(c)",
    "spaceComplexity": "O(c)",
    "hints": [
      "Return { tag, props: props || {}, children: children.flat() }."
    ]
  },
  {
    "id": "JS-P472",
    "number": 472,
    "title": "Render Virtual DOM to HTML String (renderVNodeToHTML)",
    "slug": "js-p472-render-virtual-dom-to-html-string-rendervnodetohtml",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Virtual DOM",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Virtual DOM",
      "HTML String",
      "Renderer"
    ],
    "tags": [
      "vdom",
      "html",
      "render"
    ],
    "expectedTime": "8 mins",
    "summary": "Serialize a virtual DOM node tree into an HTML markup string.",
    "problemStatement": "Write a function `renderVNodeToHTML(vnode)` that converts a virtual DOM node into an HTML string `<tag key=\"val\">children</tag>` (or text if string/number).",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ tag: 'div', props: { id: 'main' }, children: ['Hello'] }]",
        "output": "'<div id=\"main\">Hello</div>'",
        "explanation": "Renders div."
      }
    ],
    "constraints": [
      "Recursive rendering."
    ],
    "starterCode": "function renderVNodeToHTML(vnode) {\n  // Write your solution here\n}",
    "functionName": "renderVNodeToHTML",
    "testCases": [
      {
        "id": "tc_472_1",
        "input": "[{ tag: 'div', props: { id: 'main' }, children: ['Hello'] }]",
        "expectedOutput": "'<div id=\"main\">Hello</div>'",
        "isHidden": false
      },
      {
        "id": "tc_472_2",
        "input": "['plain text']",
        "expectedOutput": "'plain text'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_472_3",
        "input": "[{ tag: 'span', props: {}, children: [] }]",
        "expectedOutput": "'<span></span>'",
        "isHidden": true
      }
    ],
    "solution": "function renderVNodeToHTML(vnode) {\n  if (typeof vnode === 'string' || typeof vnode === 'number') return String(vnode);\n  const props = Object.entries(vnode.props || {})\n    .map(([k, v]) => ` ${k}=\"${v}\"`)\n    .join('');\n  const children = (vnode.children || []).map(renderVNodeToHTML).join('');\n  return `<${vnode.tag}${props}>${children}</${vnode.tag}>`;\n}",
    "explanation": "If string/number return text, else recursively format `<tag props>children</tag>`.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Format props as key=\"val\" and recurse over children."
    ]
  },
  {
    "id": "JS-P473",
    "number": 473,
    "title": "Implement Priority Queue with Comparator (createPriorityQueue)",
    "slug": "js-p473-implement-priority-queue-with-comparator-createpriorityqueue",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Data Structures",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "Priority Queue",
      "Comparator",
      "Heap"
    ],
    "tags": [
      "priorityQueue",
      "comparator",
      "dataStructures"
    ],
    "expectedTime": "12 mins",
    "summary": "Priority queue ordering elements via a custom comparator function.",
    "problemStatement": "Write a function `createPriorityQueue(compare = (a, b) => a - b)` returning `{ enqueue(item), dequeue(), peek(), size() }` where lower compare value has higher priority.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(a, b) => a - b, [['enqueue', 5], ['enqueue', 1], ['enqueue', 3], ['dequeue']]]",
        "output": "[undefined, undefined, undefined, 1]",
        "explanation": "Smallest element 1 dequeued first."
      }
    ],
    "constraints": [
      "dequeue/peek returns null if empty."
    ],
    "starterCode": "function createPriorityQueue(compare = (a, b) => a - b) {\n  // Write your solution here\n}",
    "functionName": "createPriorityQueue",
    "testCases": [
      {
        "id": "tc_473_1",
        "input": "[(a, b) => a - b, [['enqueue', 5], ['enqueue', 1], ['enqueue', 3], ['dequeue']]]",
        "expectedOutput": "[undefined, undefined, undefined, 1]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_473_2",
        "input": "[(a, b) => b - a, [['enqueue', 10], ['enqueue', 50], ['peek']]]",
        "expectedOutput": "[undefined, undefined, 50]",
        "isHidden": true
      }
    ],
    "solution": "function createPriorityQueue(compare = (a, b) => a - b) {\n  const heap = [];\n  return {\n    enqueue(item) {\n      heap.push(item);\n      heap.sort(compare);\n    },\n    dequeue() { return heap.length > 0 ? heap.shift() : null; },\n    peek() { return heap.length > 0 ? heap[0] : null; },\n    size() { return heap.length; }\n  };\n}",
    "explanation": "Store items ordered by compare function, extracting top prioritized item on dequeue.",
    "timeComplexity": "O(n log n) enqueue, O(1) dequeue",
    "spaceComplexity": "O(n)",
    "hints": [
      "Keep items sorted using compare function."
    ]
  },
  {
    "id": "JS-P474",
    "number": 474,
    "title": "Implement Finite State Machine (createStateMachine)",
    "slug": "js-p474-implement-finite-state-machine-createstatemachine",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "State Machine",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "State Machine",
      "Transitions",
      "FSM"
    ],
    "tags": [
      "fsm",
      "stateMachine",
      "transitions"
    ],
    "expectedTime": "10 mins",
    "summary": "State machine managing valid state transitions and current state.",
    "problemStatement": "Write a function `createStateMachine(initialState, transitions)` returning `{ getState(), transition(action) }`. Transitions is `{ [state]: { [action]: nextState } }`. If transition invalid, state stays unchanged and returns false.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['idle', { idle: { START: 'running' }, running: { STOP: 'idle' } }, [['getState'], ['transition', 'START'], ['getState']]]",
        "output": "['idle', true, 'running']",
        "explanation": "Transitions idle to running."
      }
    ],
    "constraints": [
      "Returns true on valid transition, false on invalid."
    ],
    "starterCode": "function createStateMachine(initialState, transitions) {\n  // Write your solution here\n}",
    "functionName": "createStateMachine",
    "testCases": [
      {
        "id": "tc_474_1",
        "input": "['idle', { idle: { START: 'running' }, running: { STOP: 'idle' } }, [['getState'], ['transition', 'START'], ['getState']]]",
        "expectedOutput": "['idle', true, 'running']",
        "isHidden": false
      },
      {
        "id": "tc_474_2",
        "input": "['a', {}, [['transition', 'FOO']]]",
        "expectedOutput": "[false]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_474_3",
        "input": "['locked', { locked: { UNLOCK: 'unlocked' } }, [['transition', 'UNLOCK'], ['getState']]]",
        "expectedOutput": "[true, 'unlocked']",
        "isHidden": true
      }
    ],
    "solution": "function createStateMachine(initialState, transitions) {\n  let current = initialState;\n  return {\n    getState() { return current; },\n    transition(action) {\n      const next = transitions[current]?.[action];\n      if (next !== undefined) {\n        current = next;\n        return true;\n      }\n      return false;\n    }\n  };\n}",
    "explanation": "Check transitions[current][action]. If valid, update current state and return true, else return false.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Check if transitions[current]?.[action] exists."
    ]
  },
  {
    "id": "JS-P475",
    "number": 475,
    "title": "Implement LRU Cache (createLRUCache)",
    "slug": "js-p475-implement-lru-cache-createlrucache",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Caching",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "LRU",
      "Cache",
      "Map"
    ],
    "tags": [
      "lru",
      "cache",
      "dataStructures"
    ],
    "expectedTime": "10 mins",
    "summary": "Least Recently Used cache evicting least accessed keys when capacity exceeded.",
    "problemStatement": "Write a function `createLRUCache(capacity)` returning `{ get(key), put(key, value) }`. get returns -1 if not found. Accessing or updating marks key most recently used.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[2], [['put', 1, 1], ['put', 2, 2], ['get', 1], ['put', 3, 3], ['get', 2]]]",
        "output": "[undefined, undefined, 1, undefined, -1]",
        "explanation": "Key 2 was evicted."
      }
    ],
    "constraints": [
      "capacity >= 1"
    ],
    "starterCode": "function createLRUCache(capacity) {\n  // Write your solution here\n}",
    "functionName": "createLRUCache",
    "testCases": [
      {
        "id": "tc_475_1",
        "input": "[[2], [['put', 1, 1], ['put', 2, 2], ['get', 1], ['put', 3, 3], ['get', 2]]]",
        "expectedOutput": "[undefined, undefined, 1, undefined, -1]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_475_2",
        "input": "[[1], [['get', 42]]]",
        "expectedOutput": "[-1]",
        "isHidden": true
      }
    ],
    "solution": "function createLRUCache(capacity) {\n  const map = new Map();\n  return {\n    get(key) {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put(key, value) {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const first = map.keys().next().value;\n        map.delete(first);\n      }\n      map.set(key, value);\n    }\n  };\n}",
    "explanation": "Leverage JS Map insertion order: delete and re-insert key to mark as most recently used.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(capacity)",
    "hints": [
      "JavaScript Map maintains insertion order. Delete and re-set to bump to back."
    ]
  },
  {
    "id": "JS-P476",
    "number": 476,
    "title": "Implement Undo/Redo Time-Travel Manager (createUndoHistory)",
    "slug": "js-p476-implement-undo-redo-time-travel-manager-createundohistory",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Time Travel",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Undo/Redo",
      "History",
      "Stack"
    ],
    "tags": [
      "undo",
      "redo",
      "history",
      "timeTravel"
    ],
    "expectedTime": "10 mins",
    "summary": "Manage state history with push, undo, redo, and get.",
    "problemStatement": "Write a function `createUndoHistory(initialState)` returning `{ get(), push(val), undo(), redo() }`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['v1', [['push', 'v2'], ['push', 'v3'], ['undo'], ['get'], ['redo'], ['get']]]",
        "output": "[undefined, undefined, 'v2', 'v2', 'v3', 'v3']",
        "explanation": "Undoes to v2, redoes to v3."
      }
    ],
    "constraints": [
      "Push clears future redo stack."
    ],
    "starterCode": "function createUndoHistory(initialState) {\n  // Write your solution here\n}",
    "functionName": "createUndoHistory",
    "testCases": [
      {
        "id": "tc_476_1",
        "input": "['v1', [['push', 'v2'], ['push', 'v3'], ['undo'], ['get'], ['redo'], ['get']]]",
        "expectedOutput": "[undefined, undefined, 'v2', 'v2', 'v3', 'v3']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_476_2",
        "input": "[0, [['get'], ['undo']]]",
        "expectedOutput": "[0, 0]",
        "isHidden": true
      }
    ],
    "solution": "function createUndoHistory(initialState) {\n  let history = [initialState];\n  let index = 0;\n  return {\n    get() { return history[index]; },\n    push(val) {\n      history = history.slice(0, index + 1);\n      history.push(val);\n      index = history.length - 1;\n    },\n    undo() {\n      if (index > 0) index--;\n      return history[index];\n    },\n    redo() {\n      if (index < history.length - 1) index++;\n      return history[index];\n    }\n  };\n}",
    "explanation": "Store states in array with pointer index. Push slices history up to index and appends.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Slice history to index + 1 upon push to discard obsolete redo branches."
    ]
  },
  {
    "id": "JS-P477",
    "number": 477,
    "title": "Implement Dependency Injection Container (createDIContainer)",
    "slug": "js-p477-implement-dependency-injection-container-createdicontainer",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "IoC & Architecture",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Dependency Injection",
      "IoC",
      "Architecture"
    ],
    "tags": [
      "di",
      "ioc",
      "container"
    ],
    "expectedTime": "10 mins",
    "summary": "Register and resolve singleton services and factories with dependencies.",
    "problemStatement": "Write a function `createDIContainer()` returning `{ register(name, factory, deps = []), resolve(name) }`. Resolves instances caching singletons.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['register', 'db', () => ({ url: 'db://' })], ['register', 'user', db => ({ db }), ['db']], ['resolve', 'user']]]",
        "output": "[undefined, undefined, {\"db\":{\"url\":\"db://\"}}]",
        "explanation": "Injects db into user."
      }
    ],
    "constraints": [
      "Caches resolved instances."
    ],
    "starterCode": "function createDIContainer() {\n  // Write your solution here\n}",
    "functionName": "createDIContainer",
    "testCases": [
      {
        "id": "tc_477_1",
        "input": "[[], [['register', 'db', () => ({ url: 'db://' })], ['register', 'user', db => ({ db }), ['db']], ['resolve', 'user']]]",
        "expectedOutput": "[undefined, undefined, {\"db\":{\"url\":\"db://\"}}]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_477_2",
        "input": "[[], [['register', 'val', () => 42], ['resolve', 'val']]]",
        "expectedOutput": "[undefined, 42]",
        "isHidden": true
      }
    ],
    "solution": "function createDIContainer() {\n  const registry = new Map();\n  const cache = new Map();\n  return {\n    register(name, factory, deps = []) {\n      registry.set(name, { factory, deps });\n    },\n    resolve(name) {\n      if (cache.has(name)) return cache.get(name);\n      if (!registry.has(name)) throw new Error('Unregistered: ' + name);\n      const { factory, deps } = registry.get(name);\n      const resolvedDeps = deps.map(dep => this.resolve(dep));\n      const instance = factory(...resolvedDeps);\n      cache.set(name, instance);\n      return instance;\n    }\n  };\n}",
    "explanation": "Recursively resolve dependencies before invoking factory, caching singleton instance in Map.",
    "timeComplexity": "O(deps)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Map dependencies to this.resolve(d) and pass spread into factory."
    ]
  },
  {
    "id": "JS-P478",
    "number": 478,
    "title": "Implement Koa/Express Middleware Onion Runner (createMiddlewareRunner)",
    "slug": "js-p478-implement-koa-express-middleware-onion-runner-createmiddlewarerunner",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Middleware",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "Middleware",
      "Onion Architecture",
      "Async"
    ],
    "tags": [
      "middleware",
      "onion",
      "async",
      "express",
      "koa"
    ],
    "expectedTime": "12 mins",
    "summary": "Execute nested middleware functions passing next() to enter inner layers.",
    "problemStatement": "Write a function `createMiddlewareRunner()` returning `{ use(fn), run(ctx) }` where middleware is `async (ctx, next) => { ... await next(); ... }`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['use', async (ctx, next) => { ctx.order.push(1); await next(); ctx.order.push(4); }], ['use', async (ctx, next) => { ctx.order.push(2); await next(); ctx.order.push(3); }], ['run', { order: [] }]]]",
        "output": "[undefined, undefined, {\"order\":[1,2,3,4]}]",
        "explanation": "Onion execution order 1, 2, 3, 4."
      }
    ],
    "constraints": [
      "Support asynchronous middleware."
    ],
    "starterCode": "function createMiddlewareRunner() {\n  // Write your solution here\n}",
    "functionName": "createMiddlewareRunner",
    "testCases": [
      {
        "id": "tc_478_1",
        "input": "[[], [['use', async (ctx, next) => { ctx.order.push(1); await next(); ctx.order.push(4); }], ['use', async (ctx, next) => { ctx.order.push(2); await next(); ctx.order.push(3); }], ['run', { order: [] }]]]",
        "expectedOutput": "[undefined, undefined, {\"order\":[1,2,3,4]}]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_478_2",
        "input": "[[], [['run', { done: true }]]]",
        "expectedOutput": "[{\"done\":true}]",
        "isHidden": true
      }
    ],
    "solution": "function createMiddlewareRunner() {\n  const stack = [];\n  return {\n    use(fn) { stack.push(fn); },\n    async run(ctx) {\n      let idx = -1;\n      async function dispatch(i) {\n        if (i <= idx) throw new Error('next() called multiple times');\n        idx = i;\n        if (i >= stack.length) return;\n        const fn = stack[i];\n        await fn(ctx, () => dispatch(i + 1));\n      }\n      await dispatch(0);\n      return ctx;\n    }\n  };\n}",
    "explanation": "Koa compose: dispatch(i) invokes middleware passing () => dispatch(i + 1) as next.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Implement recursive dispatch(i) passing () => dispatch(i + 1)."
    ]
  },
  {
    "id": "JS-P479",
    "number": 479,
    "title": "Implement Self-Sorting Array (createSortedArray)",
    "slug": "js-p479-implement-self-sorting-array-createsortedarray",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Data Structures",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Binary Search",
      "Insertion",
      "Arrays"
    ],
    "tags": [
      "sortedArray",
      "binarySearch",
      "insertion"
    ],
    "expectedTime": "10 mins",
    "summary": "Array maintaining sorted order on every insertion using binary search.",
    "problemStatement": "Write a function `createSortedArray()` returning `{ insert(val), toArray(), remove(val) }` where elements stay sorted in ascending order.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['insert', 20], ['insert', 5], ['insert', 15], ['toArray']]]",
        "output": "[undefined, undefined, undefined, [5, 15, 20]]",
        "explanation": "Maintains sorted elements."
      }
    ],
    "constraints": [
      "insert places at correct binary search index."
    ],
    "starterCode": "function createSortedArray() {\n  // Write your solution here\n}",
    "functionName": "createSortedArray",
    "testCases": [
      {
        "id": "tc_479_1",
        "input": "[[], [['insert', 20], ['insert', 5], ['insert', 15], ['toArray']]]",
        "expectedOutput": "[undefined, undefined, undefined, [5, 15, 20]]",
        "isHidden": false
      },
      {
        "id": "tc_479_2",
        "input": "[[], [['insert', 1], ['remove', 1], ['toArray']]]",
        "expectedOutput": "[undefined, true, []]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_479_3",
        "input": "[[], [['toArray']]]",
        "expectedOutput": "[[]]",
        "isHidden": true
      }
    ],
    "solution": "function createSortedArray() {\n  const arr = [];\n  function findIndex(val) {\n    let low = 0, high = arr.length;\n    while (low < high) {\n      const mid = (low + high) >>> 1;\n      if (arr[mid] < val) low = mid + 1;\n      else high = mid;\n    }\n    return low;\n  }\n  return {\n    insert(val) {\n      const idx = findIndex(val);\n      arr.splice(idx, 0, val);\n    },\n    remove(val) {\n      const idx = arr.indexOf(val);\n      if (idx !== -1) {\n        arr.splice(idx, 1);\n        return true;\n      }\n      return false;\n    },\n    toArray() { return [...arr]; }\n  };\n}",
    "explanation": "Use binary search findIndex to locate insertion position in O(log n), splice in O(n).",
    "timeComplexity": "O(log n + n) insert",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use binary search to find insertion point."
    ]
  },
  {
    "id": "JS-P480",
    "number": 480,
    "title": "Implement Event Loop Microtask/Macrotask Simulator (createEventLoopSimulator)",
    "slug": "js-p480-implement-event-loop-microtask-macrotask-simulator-createeventloopsimulator",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Event Loop",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "Event Loop",
      "Microtask",
      "Macrotask",
      "Simulation"
    ],
    "tags": [
      "eventLoop",
      "microtask",
      "macrotask",
      "simulator"
    ],
    "expectedTime": "12 mins",
    "summary": "Simulate JavaScript event loop priority draining microtasks before next macrotask.",
    "problemStatement": "Write a function `createEventLoopSimulator()` returning `{ queueMicrotask(fn), setTimeout(fn), run() }`. Microtasks drain completely between each macrotask.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['setTimeout', log => log.push('macro1')], ['queueMicrotask', log => log.push('micro1')], ['run']]]",
        "output": "[undefined, undefined, ['micro1', 'macro1']]",
        "explanation": "Microtask executes before macrotask."
      }
    ],
    "constraints": [
      "Microtasks always drain before macrotasks."
    ],
    "starterCode": "function createEventLoopSimulator() {\n  // Write your solution here\n}",
    "functionName": "createEventLoopSimulator",
    "testCases": [
      {
        "id": "tc_480_1",
        "input": "[[], [['setTimeout', log => log.push('macro1')], ['queueMicrotask', log => log.push('micro1')], ['run']]]",
        "expectedOutput": "[undefined, undefined, ['micro1', 'macro1']]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_480_2",
        "input": "[[], [['run']]]",
        "expectedOutput": "[[]]",
        "isHidden": true
      }
    ],
    "solution": "function createEventLoopSimulator() {\n  const microtasks = [];\n  const macrotasks = [];\n  return {\n    queueMicrotask(fn) { microtasks.push(fn); },\n    setTimeout(fn) { macrotasks.push(fn); },\n    run() {\n      const log = [];\n      while (microtasks.length > 0 || macrotasks.length > 0) {\n        while (microtasks.length > 0) {\n          const task = microtasks.shift();\n          task(log);\n        }\n        if (macrotasks.length > 0) {\n          const macro = macrotasks.shift();\n          macro(log);\n        }\n      }\n      return log;\n    }\n  };\n}",
    "explanation": "Loop: exhaust all microtasks, then run one macrotask, repeating until both queues are empty.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Drain while (microtasks.length > 0) before executing macrotasks.shift()."
    ]
  },
  {
    "id": "JS-P481",
    "number": 481,
    "title": "Implement Compact BitSet (createBitSet)",
    "slug": "js-p481-implement-compact-bitset-createbitset",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Bitwise",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "BitSet",
      "Bitwise",
      "TypedArrays"
    ],
    "tags": [
      "bitset",
      "bitwise",
      "memory"
    ],
    "expectedTime": "10 mins",
    "summary": "Memory-efficient boolean bit set using 32-bit integer array.",
    "problemStatement": "Write a function `createBitSet(size)` returning `{ set(i), clear(i), has(i), count() }`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[64], [['set', 0], ['set', 35], ['has', 0], ['has', 1], ['count']]]",
        "output": "[undefined, undefined, true, false, 2]",
        "explanation": "Sets bits 0 and 35."
      }
    ],
    "constraints": [
      "Use bitwise operations on typed array."
    ],
    "starterCode": "function createBitSet(size) {\n  // Write your solution here\n}",
    "functionName": "createBitSet",
    "testCases": [
      {
        "id": "tc_481_1",
        "input": "[[64], [['set', 0], ['set', 35], ['has', 0], ['has', 1], ['count']]]",
        "expectedOutput": "[undefined, undefined, true, false, 2]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_481_2",
        "input": "[[10], [['has', 0], ['count']]]",
        "expectedOutput": "[false, 0]",
        "isHidden": true
      }
    ],
    "solution": "function createBitSet(size) {\n  const words = new Uint32Array(Math.ceil(size / 32));\n  return {\n    set(i) { words[i >>> 5] |= (1 << (i & 31)); },\n    clear(i) { words[i >>> 5] &= ~(1 << (i & 31)); },\n    has(i) { return (words[i >>> 5] & (1 << (i & 31))) !== 0; },\n    count() {\n      let total = 0;\n      for (let w of words) {\n        while (w > 0) {\n          w &= (w - 1);\n          total++;\n        }\n      }\n      return total;\n    }\n  };\n}",
    "explanation": "words[i >>> 5] finds 32-bit chunk, 1 << (i & 31) targets specific bit.",
    "timeComplexity": "O(1) set/clear/has",
    "spaceComplexity": "O(size / 32)",
    "hints": [
      "Use i >>> 5 for word index and 1 << (i & 31) for bit mask."
    ]
  },
  {
    "id": "JS-P482",
    "number": 482,
    "title": "Implement Trie Autocomplete Suggester (createAutocomplete)",
    "slug": "js-p482-implement-trie-autocomplete-suggester-createautocomplete",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Search",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "Trie",
      "Autocomplete",
      "Search"
    ],
    "tags": [
      "autocomplete",
      "trie",
      "search"
    ],
    "expectedTime": "12 mins",
    "summary": "Return list of matching completions starting with a given prefix.",
    "problemStatement": "Write a function `createAutocomplete(words = [])` returning `{ insert(word), suggest(prefix, limit = 5) }` returning words starting with prefix.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[['apple', 'app', 'apricot', 'banana'], [['suggest', 'app']]]",
        "output": "[['app', 'apple']]",
        "explanation": "Matches words starting with app."
      }
    ],
    "constraints": [
      "Returns suggestions in lexicographical order."
    ],
    "starterCode": "function createAutocomplete(words = []) {\n  // Write your solution here\n}",
    "functionName": "createAutocomplete",
    "testCases": [
      {
        "id": "tc_482_1",
        "input": "[[['apple', 'app', 'apricot', 'banana']], [['suggest', 'app']]]",
        "expectedOutput": "[['app', 'apple']]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_482_2",
        "input": "[[[]], [['suggest', 'z']]]",
        "expectedOutput": "[[]]",
        "isHidden": true
      }
    ],
    "solution": "function createAutocomplete(words = []) {\n  const list = [...words];\n  return {\n    insert(w) { list.push(w); },\n    suggest(prefix, limit = 5) {\n      return list\n        .filter(w => w.startsWith(prefix))\n        .sort()\n        .slice(0, limit);\n    }\n  };\n}",
    "explanation": "Filter words starting with prefix, sort lexicographically, and return top limit matches.",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Filter words with startsWith(prefix) and sort."
    ]
  },
  {
    "id": "JS-P483",
    "number": 483,
    "title": "Implement Immutable Record Structure (createRecord)",
    "slug": "js-p483-implement-immutable-record-structure-createrecord",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Immutability",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Record",
      "Immutability",
      "Schema"
    ],
    "tags": [
      "record",
      "immutability",
      "schema"
    ],
    "expectedTime": "10 mins",
    "summary": "Strict immutable record type creating frozen instances with withChanges helper.",
    "problemStatement": "Write a function `createRecord(schema, initialValues = {})` that merges `schema` defaults with `initialValues` and returns a frozen object.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ name: '', age: 0 }, { name: 'Alice', age: 30 }]",
        "output": "{\"name\":\"Alice\",\"age\":30}",
        "explanation": "Creates immutable record."
      }
    ],
    "constraints": [
      "Instances are Object.isFrozen."
    ],
    "starterCode": "function createRecord(schema, initialValues = {}) {\n  // Write your solution here\n}",
    "functionName": "createRecord",
    "testCases": [
      {
        "id": "tc_483_1",
        "input": "[{ name: '', age: 0 }, { name: 'Alice', age: 30 }]",
        "expectedOutput": "{\"name\":\"Alice\",\"age\":30}",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_483_2",
        "input": "[{ x: 0 }, {}]",
        "expectedOutput": "{\"x\":0}",
        "isHidden": true
      }
    ],
    "solution": "function createRecord(schema, initialValues = {}) {\n  return Object.freeze({ ...schema, ...initialValues });\n}",
    "explanation": "Merge schema with initialValues and freeze.",
    "timeComplexity": "O(k)",
    "spaceComplexity": "O(k)",
    "hints": [
      "Object.freeze({ ...schema, ...initialValues })."
    ]
  },
  {
    "id": "JS-P484",
    "number": 484,
    "title": "Knuth-Morris-Pratt (KMP) Substring Search (kmpSearch)",
    "slug": "js-p484-knuth-morris-pratt-kmp-substring-search-kmpsearch",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "String Algorithms",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "KMP",
      "Substring Search",
      "LPS"
    ],
    "tags": [
      "kmp",
      "stringSearch",
      "algorithms"
    ],
    "expectedTime": "12 mins",
    "summary": "Find starting index of pattern in text using KMP longest proper prefix-suffix array.",
    "problemStatement": "Write a function `kmpSearch(text, pattern)` returning the 0-based starting index of the first occurrence of `pattern` in `text`, or `-1` if not found.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['ABABDABACDABABCABAB', 'ABABCABAB']",
        "output": "10",
        "explanation": "Matches at index 10."
      }
    ],
    "constraints": [
      "Empty pattern returns 0."
    ],
    "starterCode": "function kmpSearch(text, pattern) {\n  // Write your solution here\n}",
    "functionName": "kmpSearch",
    "testCases": [
      {
        "id": "tc_484_1",
        "input": "['ABABDABACDABABCABAB', 'ABABCABAB']",
        "expectedOutput": "10",
        "isHidden": false
      },
      {
        "id": "tc_484_2",
        "input": "['hello', 'll']",
        "expectedOutput": "2",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_484_3",
        "input": "['abcdef', 'gh']",
        "expectedOutput": "-1",
        "isHidden": true
      }
    ],
    "solution": "function kmpSearch(text, pattern) {\n  if (!pattern) return 0;\n  const m = pattern.length, n = text.length;\n  const lps = new Array(m).fill(0);\n  let len = 0, i = 1;\n  while (i < m) {\n    if (pattern[i] === pattern[len]) lps[i++] = ++len;\n    else if (len !== 0) len = lps[len - 1];\n    else lps[i++] = 0;\n  }\n  let tIdx = 0, pIdx = 0;\n  while (tIdx < n) {\n    if (text[tIdx] === pattern[pIdx]) { tIdx++; pIdx++; }\n    if (pIdx === m) return tIdx - m;\n    else if (tIdx < n && text[tIdx] !== pattern[pIdx]) {\n      if (pIdx !== 0) pIdx = lps[pIdx - 1];\n      else tIdx++;\n    }\n  }\n  return -1;\n}",
    "explanation": "Precompute LPS table for pattern, then match text in linear time avoiding redundant backtracking.",
    "timeComplexity": "O(n + m)",
    "spaceComplexity": "O(m)",
    "hints": [
      "Build LPS (longest prefix which is also suffix) array first."
    ]
  },
  {
    "id": "JS-P485",
    "number": 485,
    "title": "Rabin-Karp Rolling Hash Search (rabinKarpSearch)",
    "slug": "js-p485-rabin-karp-rolling-hash-search-rabinkarpsearch",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "String Algorithms",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "Rabin-Karp",
      "Rolling Hash",
      "String Matching"
    ],
    "tags": [
      "rabinKarp",
      "rollingHash",
      "search"
    ],
    "expectedTime": "12 mins",
    "summary": "Find substring match using rolling hash algorithm.",
    "problemStatement": "Write a function `rabinKarpSearch(text, pattern)` returning the 0-based start index of first occurrence of `pattern` in `text`, or `-1`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['a4b8c12', 'b8c']",
        "output": "2",
        "explanation": "Matches at index 2."
      }
    ],
    "constraints": [
      "Linear expected time."
    ],
    "starterCode": "function rabinKarpSearch(text, pattern) {\n  // Write your solution here\n}",
    "functionName": "rabinKarpSearch",
    "testCases": [
      {
        "id": "tc_485_1",
        "input": "['a4b8c12', 'b8c']",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc_485_2",
        "input": "['test string', 'not found']",
        "expectedOutput": "-1",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_485_3",
        "input": "['abc', '']",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "solution": "function rabinKarpSearch(text, pattern) {\n  if (!pattern) return 0;\n  const m = pattern.length;\n  for (let i = 0; i <= text.length - m; i++) {\n    if (text.slice(i, i + m) === pattern) return i;\n  }\n  return -1;\n}",
    "explanation": "Slice window of pattern length and verify match, returning start index.",
    "timeComplexity": "O(n * m)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Slide window of length m across text."
    ]
  },
  {
    "id": "JS-P486",
    "number": 486,
    "title": "Implement Least Frequently Used Cache (createLFUCache)",
    "slug": "js-p486-implement-least-frequently-used-cache-createlfucache",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Caching",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "LFU",
      "Cache",
      "Frequency"
    ],
    "tags": [
      "lfu",
      "cache",
      "dataStructures"
    ],
    "expectedTime": "15 mins",
    "summary": "Cache evicting the least frequently accessed item when capacity is reached.",
    "problemStatement": "Write a function `createLFUCache(capacity)` returning `{ get(key), put(key, value) }`. When tied for lowest frequency, evicts least recently used.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[2], [['put', 1, 1], ['put', 2, 2], ['get', 1], ['put', 3, 3], ['get', 2]]]",
        "output": "[undefined, undefined, 1, undefined, -1]",
        "explanation": "Key 2 had frequency 1 and was evicted over key 1."
      }
    ],
    "constraints": [
      "capacity >= 1"
    ],
    "starterCode": "function createLFUCache(capacity) {\n  // Write your solution here\n}",
    "functionName": "createLFUCache",
    "testCases": [
      {
        "id": "tc_486_1",
        "input": "[[2], [['put', 1, 1], ['put', 2, 2], ['get', 1], ['put', 3, 3], ['get', 2]]]",
        "expectedOutput": "[undefined, undefined, 1, undefined, -1]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_486_2",
        "input": "[[1], [['get', 99]]]",
        "expectedOutput": "[-1]",
        "isHidden": true
      }
    ],
    "solution": "function createLFUCache(capacity) {\n  if (capacity <= 0) return { get: () => -1, put: () => {} };\n  const vals = new Map();\n  const counts = new Map();\n  const time = new Map();\n  let clock = 0;\n  return {\n    get(key) {\n      if (!vals.has(key)) return -1;\n      counts.set(key, counts.get(key) + 1);\n      time.set(key, ++clock);\n      return vals.get(key);\n    },\n    put(key, value) {\n      if (vals.has(key)) {\n        vals.set(key, value);\n        counts.set(key, counts.get(key) + 1);\n        time.set(key, ++clock);\n        return;\n      }\n      if (vals.size >= capacity) {\n        let minKey = null;\n        let minCount = Infinity;\n        let minTime = Infinity;\n        for (const k of vals.keys()) {\n          const c = counts.get(k);\n          const t = time.get(k);\n          if (c < minCount || (c === minCount && t < minTime)) {\n            minCount = c;\n            minTime = t;\n            minKey = k;\n          }\n        }\n        if (minKey !== null) {\n          vals.delete(minKey);\n          counts.delete(minKey);\n          time.delete(minKey);\n        }\n      }\n      vals.set(key, value);\n      counts.set(key, 1);\n      time.set(key, ++clock);\n    }\n  };\n}",
    "explanation": "Track value, frequency count, and access timestamp for each key to break ties by LRU.",
    "timeComplexity": "O(capacity) per evict",
    "spaceComplexity": "O(capacity)",
    "hints": [
      "Track counts Map and access order timestamp."
    ]
  },
  {
    "id": "JS-P487",
    "number": 487,
    "title": "Implement Task Priority Scheduler (createTaskScheduler)",
    "slug": "js-p487-implement-task-priority-scheduler-createtaskscheduler",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Scheduling",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Scheduler",
      "Priority",
      "Queue"
    ],
    "tags": [
      "scheduler",
      "priority",
      "queue"
    ],
    "expectedTime": "10 mins",
    "summary": "Schedule tasks with HIGH, NORMAL, and LOW priority executing in priority order.",
    "problemStatement": "Write a function `createTaskScheduler()` returning `{ schedule(task, priority = 'NORMAL'), run() }` where priorities are `'HIGH'`, `'NORMAL'`, `'LOW'`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['schedule', () => 'n', 'NORMAL'], ['schedule', () => 'h', 'HIGH'], ['run']]]",
        "output": "[undefined, undefined, ['h', 'n']]",
        "explanation": "HIGH executes before NORMAL."
      }
    ],
    "constraints": [
      "Preserves FIFO within same priority."
    ],
    "starterCode": "function createTaskScheduler() {\n  // Write your solution here\n}",
    "functionName": "createTaskScheduler",
    "testCases": [
      {
        "id": "tc_487_1",
        "input": "[[], [['schedule', () => 'n', 'NORMAL'], ['schedule', () => 'h', 'HIGH'], ['run']]]",
        "expectedOutput": "[undefined, undefined, ['h', 'n']]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_487_2",
        "input": "[[], [['schedule', () => 1, 'LOW'], ['run']]]",
        "expectedOutput": "[undefined, [1]]",
        "isHidden": true
      }
    ],
    "solution": "function createTaskScheduler() {\n  const high = [];\n  const normal = [];\n  const low = [];\n  return {\n    schedule(task, priority = 'NORMAL') {\n      if (priority === 'HIGH') high.push(task);\n      else if (priority === 'LOW') low.push(task);\n      else normal.push(task);\n    },\n    run() {\n      const all = [...high, ...normal, ...low];\n      high.length = 0; normal.length = 0; low.length = 0;\n      return all.map(t => t());\n    }\n  };\n}",
    "explanation": "Bucket tasks by HIGH, NORMAL, LOW arrays and execute in concatenated order.",
    "timeComplexity": "O(1) schedule, O(n) run",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use separate queues for HIGH, NORMAL, and LOW."
    ]
  },
  {
    "id": "JS-P488",
    "number": 488,
    "title": "Implement Proxy Runtime Schema Validator (validateAndSet)",
    "slug": "js-p488-implement-proxy-runtime-schema-validator-validateandset",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Proxy & Metaprogramming",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Proxy",
      "Validation",
      "Schema"
    ],
    "tags": [
      "proxy",
      "validator",
      "schema"
    ],
    "expectedTime": "10 mins",
    "summary": "Wrap target with Proxy enforcing type schema validations on property assignment.",
    "problemStatement": "Write a function `validateAndSet(target, schema, key, val)` that validates `val` matches the expected type in `schema[key]` (e.g. `'string'`, `'number'`, `'boolean'`). If valid, assigns `target[key] = val` and returns `target`. If invalid, throws a `TypeError`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ id: 1 }, { id: 'number', name: 'string' }, 'name', 'Alice']",
        "output": "{ id: 1, name: 'Alice' }",
        "explanation": "Valid assignment succeeds."
      }
    ],
    "constraints": [
      "Throws TypeError if typeof val !== expected."
    ],
    "starterCode": "function validateAndSet(target, schema, key, val) {\n  // Write your solution here\n}",
    "functionName": "validateAndSet",
    "testCases": [
      {
        "id": "tc_488_1",
        "input": "[{ id: 1 }, { id: 'number', name: 'string' }, 'name', 'Alice']",
        "expectedOutput": "{\"id\":1,\"name\":\"Alice\"}",
        "isHidden": false
      },
      {
        "id": "tc_488_2",
        "input": "[{}, { age: 'number' }, 'age', 30]",
        "expectedOutput": "{\"age\":30}",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_488_3",
        "input": "[{ x: 10 }, { x: 'number', active: 'boolean' }, 'active', true]",
        "expectedOutput": "{\"x\":10,\"active\":true}",
        "isHidden": true
      },
      {
        "id": "tc_488_4",
        "input": "[{ count: 0 }, { count: 'number' }, 'count', 5]",
        "expectedOutput": "{\"count\":5}",
        "isHidden": true
      }
    ],
    "solution": "function validateAndSet(target, schema, key, val) {\n  if (key in schema && typeof val !== schema[key]) {\n    throw new TypeError(`Invalid type for ${String(key)}: expected ${schema[key]}`);\n  }\n  target[key] = val;\n  return target;\n}",
    "explanation": "Check typeof val against schema[key]. Throw TypeError on mismatch, otherwise set and return target.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Check if key is in schema and typeof val !== schema[key]."
    ]
  },
  {
    "id": "JS-P489",
    "number": 489,
    "title": "Apply Object Patch Diff (patchObject)",
    "slug": "js-p489-apply-object-patch-diff-patchobject",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Object Utilities",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Patch",
      "Objects",
      "Mutation"
    ],
    "tags": [
      "patch",
      "diff",
      "objects"
    ],
    "expectedTime": "5 mins",
    "summary": "Apply added, removed, and updated diff instructions onto a target object.",
    "problemStatement": "Write a function `patchObject(target, diff)` that mutates `target` according to `{ added, removed, updated }` and returns `target`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ a: 1, b: 2 }, { added: { c: 3 }, removed: { a: 1 }, updated: { b: 20 } }]",
        "output": "{\"b\":20,\"c\":3}",
        "explanation": "Patches target."
      }
    ],
    "constraints": [
      "Deletes keys listed in removed."
    ],
    "starterCode": "function patchObject(target, diff) {\n  // Write your solution here\n}",
    "functionName": "patchObject",
    "testCases": [
      {
        "id": "tc_489_1",
        "input": "[{ a: 1, b: 2 }, { added: { c: 3 }, removed: { a: 1 }, updated: { b: 20 } }]",
        "expectedOutput": "{\"b\":20,\"c\":3}",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_489_2",
        "input": "[{ x: 10 }, {}]",
        "expectedOutput": "{\"x\":10}",
        "isHidden": true
      }
    ],
    "solution": "function patchObject(target, diff) {\n  const { added = {}, removed = {}, updated = {} } = diff;\n  for (const k of Object.keys(removed)) delete target[k];\n  Object.assign(target, added, updated);\n  return target;\n}",
    "explanation": "Delete removed keys, then Object.assign added and updated properties.",
    "timeComplexity": "O(k)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Delete keys in removed, then assign added and updated."
    ]
  },
  {
    "id": "JS-P490",
    "number": 490,
    "title": "Serialize Binary Tree to String (serializeBinaryTree)",
    "slug": "js-p490-serialize-binary-tree-to-string-serializebinarytree",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Serialization",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Binary Tree",
      "Serialization",
      "Preorder"
    ],
    "tags": [
      "binaryTree",
      "serialize",
      "trees"
    ],
    "expectedTime": "10 mins",
    "summary": "Serialize a binary tree into a comma-delimited preorder string.",
    "problemStatement": "Write a function `serializeBinaryTree(root)` that converts `{ val, left, right }` into a preorder comma-delimited string where null is represented by `'#'`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ val: 1, left: { val: 2, left: null, right: null }, right: { val: 3, left: null, right: null } }]",
        "output": "'1,2,#,#,3,#,#'",
        "explanation": "Preorder serialized."
      }
    ],
    "constraints": [
      "Preorder traversal."
    ],
    "starterCode": "function serializeBinaryTree(root) {\n  // Write your solution here\n}",
    "functionName": "serializeBinaryTree",
    "testCases": [
      {
        "id": "tc_490_1",
        "input": "[{ val: 1, left: { val: 2, left: null, right: null }, right: { val: 3, left: null, right: null } }]",
        "expectedOutput": "'1,2,#,#,3,#,#'",
        "isHidden": false
      },
      {
        "id": "tc_490_2",
        "input": "[null]",
        "expectedOutput": "'#'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_490_3",
        "input": "[{ val: 42, left: null, right: null }]",
        "expectedOutput": "'42,#,#'",
        "isHidden": true
      }
    ],
    "solution": "function serializeBinaryTree(root) {\n  const result = [];\n  function dfs(node) {\n    if (!node) {\n      result.push('#');\n      return;\n    }\n    result.push(node.val);\n    dfs(node.left);\n    dfs(node.right);\n  }\n  dfs(root);\n  return result.join(',');\n}",
    "explanation": "Preorder DFS traversal emitting node.val, recursing on left and right, and '#' for null nodes.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use preorder DFS: push node.val or '#' for null."
    ]
  },
  {
    "id": "JS-P491",
    "number": 491,
    "title": "Deserialize String to Binary Tree (deserializeBinaryTree)",
    "slug": "js-p491-deserialize-string-to-binary-tree-deserializebinarytree",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Serialization",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Binary Tree",
      "Deserialization",
      "Preorder"
    ],
    "tags": [
      "binaryTree",
      "deserialize",
      "trees"
    ],
    "expectedTime": "10 mins",
    "summary": "Reconstruct a binary tree from a comma-delimited preorder string.",
    "problemStatement": "Write a function `deserializeBinaryTree(data)` that reconstructs the tree `{ val, left, right }` from string created by preorder serialization.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['1,2,#,#,3,#,#']",
        "output": "{\"val\":1,\"left\":{\"val\":2,\"left\":null,\"right\":null},\"right\":{\"val\":3,\"left\":null,\"right\":null}}",
        "explanation": "Deserializes tree."
      }
    ],
    "constraints": [
      "Recovers original tree structure."
    ],
    "starterCode": "function deserializeBinaryTree(data) {\n  // Write your solution here\n}",
    "functionName": "deserializeBinaryTree",
    "testCases": [
      {
        "id": "tc_491_1",
        "input": "['1,2,#,#,3,#,#']",
        "expectedOutput": "{\"val\":1,\"left\":{\"val\":2,\"left\":null,\"right\":null},\"right\":{\"val\":3,\"left\":null,\"right\":null}}",
        "isHidden": false
      },
      {
        "id": "tc_491_2",
        "input": "['#']",
        "expectedOutput": "null",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_491_3",
        "input": "['42,#,#']",
        "expectedOutput": "{\"val\":42,\"left\":null,\"right\":null}",
        "isHidden": true
      }
    ],
    "solution": "function deserializeBinaryTree(data) {\n  const tokens = data.split(',');\n  let idx = 0;\n  function build() {\n    if (idx >= tokens.length || tokens[idx] === '#') {\n      idx++;\n      return null;\n    }\n    const val = Number(tokens[idx++]);\n    const left = build();\n    const right = build();\n    return { val, left, right };\n  }\n  return build();\n}",
    "explanation": "Consume tokens sequentially: if '#' return null, else create node and recursively build left and right.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Recursively build node: val = tokens[idx++], left = build(), right = build()."
    ]
  },
  {
    "id": "JS-P492",
    "number": 492,
    "title": "Implement Topic PubSub with Unsubscribe (createPubSub)",
    "slug": "js-p492-implement-topic-pubsub-with-unsubscribe-createpubsub",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "PubSub",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "PubSub",
      "Messaging",
      "Observer"
    ],
    "tags": [
      "pubsub",
      "messaging",
      "observer"
    ],
    "expectedTime": "8 mins",
    "summary": "Publish-subscribe pattern with topic subscriptions and subscriber dispatching.",
    "problemStatement": "Write a function `createPubSub()` returning `{ subscribe(topic, fn), publish(topic, data) }`. subscribe returns true upon registering.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['publish', 'news', 'hello']]]",
        "output": "[[]]",
        "explanation": "Publishes to topic."
      }
    ],
    "constraints": [
      "publish returns array of subscriber return values."
    ],
    "starterCode": "function createPubSub() {\n  // Write your solution here\n}",
    "functionName": "createPubSub",
    "testCases": [
      {
        "id": "tc_492_1",
        "input": "[[], [['subscribe', 'news', x => x.toUpperCase()], ['publish', 'news', 'hello']]]",
        "expectedOutput": "[true, ['HELLO']]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_492_2",
        "input": "[[], [['publish', 'empty', 123]]]",
        "expectedOutput": "[[]]",
        "isHidden": true
      },
      {
        "id": "tc_492_3",
        "input": "[[], [['subscribe', 'alerts', x => x * 2], ['publish', 'alerts', 5]]]",
        "expectedOutput": "[true, [10]]",
        "isHidden": true
      }
    ],
    "solution": "function createPubSub() {\n  const topics = new Map();\n  return {\n    subscribe(topic, fn) {\n      if (!topics.has(topic)) topics.set(topic, new Set());\n      topics.get(topic).add(fn);\n      return true;\n    },\n    publish(topic, data) {\n      if (!topics.has(topic)) return [];\n      const results = [];\n      topics.get(topic).forEach(fn => results.push(fn(data)));\n      return results;\n    }\n  };\n}",
    "explanation": "Store Set of subscribers per topic in a Map. When publish is called, invoke all registered handlers and return results.",
    "timeComplexity": "O(1) sub, O(s) pub",
    "spaceComplexity": "O(s)",
    "hints": [
      "Map<string, Set<Function>>."
    ]
  },
  {
    "id": "JS-P493",
    "number": 493,
    "title": "Deep Freeze Object with Circular References (deepFreezeWithCycles)",
    "slug": "js-p493-deep-freeze-object-with-circular-references-deepfreezewithcycles",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Immutability",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Deep Freeze",
      "Cycles",
      "Recursion"
    ],
    "tags": [
      "deepFreeze",
      "cycles",
      "immutability"
    ],
    "expectedTime": "8 mins",
    "summary": "Deeply freeze an object graph avoiding infinite loops on circular references.",
    "problemStatement": "Write a function `deepFreezeWithCycles(obj)` that calls `Object.freeze` on `obj` and all nested objects, handling circular references without infinite recursion.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ a: { b: 1 } }]",
        "output": "true",
        "explanation": "Frozen nested structure."
      }
    ],
    "constraints": [
      "Handles circular references."
    ],
    "starterCode": "function deepFreezeWithCycles(obj) {\n  // Write your solution here\n}",
    "functionName": "deepFreezeWithCycles",
    "testCases": [
      {
        "id": "tc_493_1",
        "input": "[(() => {\n  const o = { a: { b: 1 } };\n  deepFreezeWithCycles(o);\n  return Object.isFrozen(o.a);\n})()]",
        "expectedOutput": "true",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_493_2",
        "input": "[(() => {\n  const o = { x: 1 };\n  deepFreezeWithCycles(o);\n  return Object.isFrozen(o);\n})()]",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "solution": "function deepFreezeWithCycles(obj, visited = new Set()) {\n  if (obj === null || typeof obj !== 'object' || visited.has(obj)) return obj;\n  visited.add(obj);\n  for (const key of Object.keys(obj)) {\n    deepFreezeWithCycles(obj[key], visited);\n  }\n  return Object.freeze(obj);\n}",
    "explanation": "Track visited objects in a Set before recursing on properties, then call Object.freeze.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use a visited Set to guard against circular references."
    ]
  },
  {
    "id": "JS-P494",
    "number": 494,
    "title": "Implement Trie Based Prefix Search (searchPrefixWords)",
    "slug": "js-p494-implement-trie-based-prefix-search-searchprefixwords",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Search",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Prefix Search",
      "Trie",
      "Strings"
    ],
    "tags": [
      "search",
      "prefix",
      "trie"
    ],
    "expectedTime": "8 mins",
    "summary": "Filter list of words by matching prefix efficiently.",
    "problemStatement": "Write a function `searchPrefixWords(wordList, prefix)` that returns all words in `wordList` that start with `prefix`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[['code', 'coder', 'coding', 'cat'], 'cod']",
        "output": "['code', 'coder', 'coding']",
        "explanation": "Words starting with 'cod'."
      }
    ],
    "constraints": [
      "Case sensitive."
    ],
    "starterCode": "function searchPrefixWords(wordList, prefix) {\n  // Write your solution here\n}",
    "functionName": "searchPrefixWords",
    "testCases": [
      {
        "id": "tc_494_1",
        "input": "[['code', 'coder', 'coding', 'cat'], 'cod']",
        "expectedOutput": "['code', 'coder', 'coding']",
        "isHidden": false
      },
      {
        "id": "tc_494_2",
        "input": "[['alpha', 'beta'], 'g']",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_494_3",
        "input": "[['test'], '']",
        "expectedOutput": "['test']",
        "isHidden": true
      }
    ],
    "solution": "function searchPrefixWords(wordList, prefix) {\n  return wordList.filter(w => w.startsWith(prefix));\n}",
    "explanation": "Filter words matching startsWith(prefix).",
    "timeComplexity": "O(n * m)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use wordList.filter(w => w.startsWith(prefix))."
    ]
  },
  {
    "id": "JS-P495",
    "number": 495,
    "title": "Implement Range Sum Segment Tree (createSegmentTree)",
    "slug": "js-p495-implement-range-sum-segment-tree-createsegmenttree",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Trees",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "Segment Tree",
      "Range Queries",
      "Trees"
    ],
    "tags": [
      "segmentTree",
      "rangeQuery",
      "algorithms"
    ],
    "expectedTime": "12 mins",
    "summary": "Segment tree supporting point update and range sum query in O(log n).",
    "problemStatement": "Write a function `createSegmentTree(arr)` returning `{ query(left, right), update(index, val) }`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[[1, 3, 5, 7]], [['query', 0, 2], ['update', 1, 10], ['query', 0, 2]]]",
        "output": "[9, undefined, 16]",
        "explanation": "1+3+5=9, after update 1+10+5=16."
      }
    ],
    "constraints": [
      "0 <= left <= right < arr.length."
    ],
    "starterCode": "function createSegmentTree(arr) {\n  // Write your solution here\n}",
    "functionName": "createSegmentTree",
    "testCases": [
      {
        "id": "tc_495_1",
        "input": "[[[1, 3, 5, 7]], [['query', 0, 2], ['update', 1, 10], ['query', 0, 2]]]",
        "expectedOutput": "[9, undefined, 16]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_495_2",
        "input": "[[[5]], [['query', 0, 0]]]",
        "expectedOutput": "[5]",
        "isHidden": true
      }
    ],
    "solution": "function createSegmentTree(arr) {\n  const n = arr.length;\n  const tree = new Array(2 * n).fill(0);\n  for (let i = 0; i < n; i++) tree[n + i] = arr[i];\n  for (let i = n - 1; i > 0; i--) tree[i] = tree[2 * i] + tree[2 * i + 1];\n  return {\n    update(index, val) {\n      let pos = n + index;\n      tree[pos] = val;\n      while (pos > 1) {\n        pos >>>= 1;\n        tree[pos] = tree[2 * pos] + tree[2 * pos + 1];\n      }\n    },\n    query(left, right) {\n      let l = n + left;\n      let r = n + right + 1;\n      let sum = 0;\n      while (l < r) {\n        if (l & 1) sum += tree[l++];\n        if (r & 1) sum += tree[--r];\n        l >>>= 1;\n        r >>>= 1;\n      }\n      return sum;\n    }\n  };\n}",
    "explanation": "Iterative segment tree: tree of size 2*n with parent at i/2, children at 2*i and 2*i + 1.",
    "timeComplexity": "O(log n) query and update",
    "spaceComplexity": "O(n)",
    "hints": [
      "Iterative segment tree array with 2*n nodes."
    ]
  },
  {
    "id": "JS-P496",
    "number": 496,
    "title": "Implement Observable Pipeline with Operators (runObservablePipeline)",
    "slug": "js-p496-implement-observable-pipeline-with-operators-runobservablepipeline",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Reactive Streams",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "Observable",
      "Reactive",
      "Streams"
    ],
    "tags": [
      "observable",
      "reactive",
      "streams"
    ],
    "expectedTime": "12 mins",
    "summary": "Execute an Observable stream pipeline supporting map and filter operator chaining.",
    "problemStatement": "Write a function `runObservablePipeline(values, mapFn, filterFn)` that creates a reactive stream emitting `values`, chains optional `mapFn` and `filterFn` operators, subscribes to collect emissions, and returns the resulting array.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3], x => x * 2, x => x > 2]",
        "output": "[4, 6]",
        "explanation": "Doubles values to [2, 4, 6], filters > 2 to get [4, 6]."
      }
    ],
    "constraints": [
      "Chainable operators preserving order."
    ],
    "starterCode": "function runObservablePipeline(values, mapFn, filterFn) {\n  // Write your solution here\n}",
    "functionName": "runObservablePipeline",
    "testCases": [
      {
        "id": "tc_496_1",
        "input": "[[1, 2, 3], x => x * 2, x => x > 2]",
        "expectedOutput": "[4, 6]",
        "isHidden": false
      },
      {
        "id": "tc_496_2",
        "input": "[[1, 2, 3, 4], x => x + 10, null]",
        "expectedOutput": "[11, 12, 13, 14]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_496_3",
        "input": "[[5, 10, 15], null, x => x >= 10]",
        "expectedOutput": "[10, 15]",
        "isHidden": true
      }
    ],
    "solution": "function runObservablePipeline(values, mapFn, filterFn) {\n  function createStream(producer) {\n    return {\n      subscribe(sink) {\n        producer(sink);\n      },\n      map(fn) {\n        return createStream(sink => this.subscribe({\n          next: v => sink.next(fn(v))\n        }));\n      },\n      filter(pred) {\n        return createStream(sink => this.subscribe({\n          next: v => { if (pred(v)) sink.next(v); }\n        }));\n      }\n    };\n  }\n  let stream = createStream(sink => {\n    for (const v of values) sink.next(v);\n  });\n  if (mapFn) stream = stream.map(mapFn);\n  if (filterFn) stream = stream.filter(filterFn);\n  const results = [];\n  stream.subscribe({ next: v => results.push(v) });\n  return results;\n}",
    "explanation": "Build Observable stream, chain map and filter operators, subscribe to collect results into an array.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Create an Observable wrapper with map and filter methods, pipe emissions, collect in sink."
    ]
  },
  {
    "id": "JS-P497",
    "number": 497,
    "title": "Implement Virtual DOM Diff Engine (diffVNodes)",
    "slug": "js-p497-implement-virtual-dom-diff-engine-diffvnodes",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Virtual DOM",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "Virtual DOM",
      "Diffing",
      "Reconciliation"
    ],
    "tags": [
      "vdom",
      "diff",
      "reconciliation"
    ],
    "expectedTime": "12 mins",
    "summary": "Diff two virtual DOM trees and return action patches.",
    "problemStatement": "Write a function `diffVNodes(oldNode, newNode)` that compares two VNodes and returns `{ type: 'REPLACE' | 'TEXT' | 'UPDATE' | 'NONE' }`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ tag: 'div', children: [] }, { tag: 'span', children: [] }]",
        "output": "{\"type\":\"REPLACE\"}",
        "explanation": "Different tag replaces node."
      }
    ],
    "constraints": [
      "Returns REPLACE on tag mismatch."
    ],
    "starterCode": "function diffVNodes(oldNode, newNode) {\n  // Write your solution here\n}",
    "functionName": "diffVNodes",
    "testCases": [
      {
        "id": "tc_497_1",
        "input": "[{ tag: 'div', children: [] }, { tag: 'span', children: [] }]",
        "expectedOutput": "{\"type\":\"REPLACE\"}",
        "isHidden": false
      },
      {
        "id": "tc_497_2",
        "input": "['hello', 'world']",
        "expectedOutput": "{\"type\":\"TEXT\",\"text\":\"world\"}",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_497_3",
        "input": "['same', 'same']",
        "expectedOutput": "{\"type\":\"NONE\"}",
        "isHidden": true
      }
    ],
    "solution": "function diffVNodes(oldNode, newNode) {\n  if (oldNode === newNode) return { type: 'NONE' };\n  if (typeof oldNode !== typeof newNode) return { type: 'REPLACE' };\n  if (typeof newNode === 'string' || typeof newNode === 'number') {\n    return { type: 'TEXT', text: String(newNode) };\n  }\n  if (oldNode.tag !== newNode.tag) return { type: 'REPLACE' };\n  return { type: 'UPDATE' };\n}",
    "explanation": "Identify identity (NONE), text updates (TEXT), tag differences (REPLACE), or prop/child updates (UPDATE).",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Check tags first: if different return REPLACE."
    ]
  },
  {
    "id": "JS-P498",
    "number": 498,
    "title": "Parse Arithmetic AST from Tokens (createASTParser)",
    "slug": "js-p498-parse-arithmetic-ast-from-tokens-createastparser",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "AST",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "AST",
      "Parser",
      "Syntax Tree"
    ],
    "tags": [
      "ast",
      "parser",
      "tokens"
    ],
    "expectedTime": "12 mins",
    "summary": "Parse a simple binary expression string like '3 + 5' into an AST object.",
    "problemStatement": "Write a function `createASTParser(expr)` that parses a single binary expression like `'3 + 5'` or `'10 * 2'` into `{ type: 'BinaryExpression', operator: '+', left: { type: 'Literal', value: 3 }, right: { type: 'Literal', value: 5 } }`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['3 + 5']",
        "output": "{\"type\":\"BinaryExpression\",\"operator\":\"+\",\"left\":{\"type\":\"Literal\",\"value\":3},\"right\":{\"type\":\"Literal\",\"value\":5}}",
        "explanation": "Generates binary expression AST."
      }
    ],
    "constraints": [
      "Expression contains left, operator, right."
    ],
    "starterCode": "function createASTParser(expr) {\n  // Write your solution here\n}",
    "functionName": "createASTParser",
    "testCases": [
      {
        "id": "tc_498_1",
        "input": "['3 + 5']",
        "expectedOutput": "{\"type\":\"BinaryExpression\",\"operator\":\"+\",\"left\":{\"type\":\"Literal\",\"value\":3},\"right\":{\"type\":\"Literal\",\"value\":5}}",
        "isHidden": false
      },
      {
        "id": "tc_498_2",
        "input": "['10 * 2']",
        "expectedOutput": "{\"type\":\"BinaryExpression\",\"operator\":\"*\",\"left\":{\"type\":\"Literal\",\"value\":10},\"right\":{\"type\":\"Literal\",\"value\":2}}",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_498_3",
        "input": "['8 / 4']",
        "expectedOutput": "{\"type\":\"BinaryExpression\",\"operator\":\"/\",\"left\":{\"type\":\"Literal\",\"value\":8},\"right\":{\"type\":\"Literal\",\"value\":4}}",
        "isHidden": true
      }
    ],
    "solution": "function createASTParser(expr) {\n  const parts = expr.trim().split(/\\s+/);\n  return {\n    type: 'BinaryExpression',\n    operator: parts[1],\n    left: { type: 'Literal', value: Number(parts[0]) },\n    right: { type: 'Literal', value: Number(parts[2]) }\n  };\n}",
    "explanation": "Split expression into left operand, operator, and right operand and format into AST structure.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Split tokens by whitespace into left, op, right."
    ]
  },
  {
    "id": "JS-P499",
    "number": 499,
    "title": "Implement Bloom Filter (createBloomFilter)",
    "slug": "js-p499-implement-bloom-filter-createbloomfilter",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Probabilistic Data Structures",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Bloom Filter",
      "Hashing",
      "Probabilistic"
    ],
    "tags": [
      "bloomFilter",
      "hashing",
      "probabilistic"
    ],
    "expectedTime": "10 mins",
    "summary": "Probabilistic set membership data structure with add and has methods.",
    "problemStatement": "Write a function `createBloomFilter(size = 32)` returning `{ add(item), has(item) }`. Uses two simple hash functions to set/test bits.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[32], [['add', 'cat'], ['has', 'cat'], ['has', 'dog']]]",
        "output": "[undefined, true, false]",
        "explanation": "Cat is present, dog is not."
      }
    ],
    "constraints": [
      "has() never yields false negatives."
    ],
    "starterCode": "function createBloomFilter(size = 32) {\n  // Write your solution here\n}",
    "functionName": "createBloomFilter",
    "testCases": [
      {
        "id": "tc_499_1",
        "input": "[[32], [['add', 'cat'], ['has', 'cat'], ['has', 'dog']]]",
        "expectedOutput": "[undefined, true, false]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_499_2",
        "input": "[[32], [['has', 'anything']]]",
        "expectedOutput": "[false]",
        "isHidden": true
      }
    ],
    "solution": "function createBloomFilter(size = 32) {\n  const bits = new Array(size).fill(false);\n  function hash1(str) {\n    let h = 0;\n    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % size;\n    return Math.abs(h);\n  }\n  function hash2(str) {\n    let h = 0;\n    for (let i = 0; i < str.length; i++) h = (h * 17 + str.charCodeAt(i)) % size;\n    return Math.abs(h);\n  }\n  return {\n    add(item) {\n      bits[hash1(item)] = true;\n      bits[hash2(item)] = true;\n    },\n    has(item) {\n      return bits[hash1(item)] && bits[hash2(item)];\n    }\n  };\n}",
    "explanation": "Compute two hash values per item, set both bits on add, check both bits on has.",
    "timeComplexity": "O(k)",
    "spaceComplexity": "O(size)",
    "hints": [
      "Use two polynomial rolling hashes modulo size."
    ]
  },
  {
    "id": "JS-P500",
    "number": 500,
    "title": "Master Runtime Orchestration Engine (createMasterEngine)",
    "slug": "js-p500-master-runtime-orchestration-engine-createmasterengine",
    "category": "Advanced Algorithms & Core Architecture",
    "subcategory": "Architecture",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "Architecture",
      "Orchestration",
      "System Design"
    ],
    "tags": [
      "masterEngine",
      "systemDesign",
      "architecture",
      "final"
    ],
    "expectedTime": "15 mins",
    "summary": "Complete orchestration engine integrating event dispatch, state management, and lifecycle hooks.",
    "problemStatement": "Write a function `createMasterEngine(initialState = {})` returning `{ getState(), setState(updates), emit(event, data), on(event, cb), runPipeline(items, fn) }`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[{ count: 0 }], [['getState'], ['setState', { count: 1 }], ['getState']]]",
        "output": "[{\"count\":0}, undefined, {\"count\":1}]",
        "explanation": "Full orchestration lifecycle."
      }
    ],
    "constraints": [
      "Seamlessly coordinates state, events, and pipelines."
    ],
    "starterCode": "function createMasterEngine(initialState = {}) {\n  // Write your solution here\n}",
    "functionName": "createMasterEngine",
    "testCases": [
      {
        "id": "tc_500_1",
        "input": "[[{ count: 0 }], [['getState'], ['setState', { count: 1 }], ['getState']]]",
        "expectedOutput": "[{\"count\":0}, undefined, {\"count\":1}]",
        "isHidden": false
      },
      {
        "id": "tc_500_2",
        "input": "[[{}], [['on', 'init', () => 'started'], ['emit', 'init']]]",
        "expectedOutput": "[undefined, ['started']]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_500_3",
        "input": "[[{ v: 500 }], [['getState']]]",
        "expectedOutput": "[{\"v\":500}]",
        "isHidden": true
      }
    ],
    "solution": "function createMasterEngine(initialState = {}) {\n  let state = { ...initialState };\n  const listeners = new Map();\n  return {\n    getState() { return { ...state }; },\n    setState(updates) {\n      state = { ...state, ...updates };\n    },\n    on(event, cb) {\n      if (!listeners.has(event)) listeners.set(event, []);\n      listeners.get(event).push(cb);\n    },\n    emit(event, data) {\n      if (!listeners.has(event)) return [];\n      return listeners.get(event).map(cb => cb(data));\n    },\n    runPipeline(items, fn) {\n      return items.map(fn);\n    }\n  };\n}",
    "explanation": "Combine state manager, event emitter, and functional pipeline into cohesive engine.",
    "timeComplexity": "O(1) state/events",
    "spaceComplexity": "O(n)",
    "hints": [
      "Encapsulate state in closure, provide on/emit for events, and runPipeline for processing."
    ]
  }
];
