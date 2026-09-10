// Batch 4: Questions 301 to 400
import type { FrontendJsQuestion } from '../frontendJsTypes';

export const fjpBatch4: FrontendJsQuestion[] = [
  {
    "id": "FJP-0301",
    "number": 301,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0301-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten301(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten301",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten301(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten301(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten301` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.943Z",
    "updatedAt": "2026-09-10T04:07:54.943Z"
  },
  {
    "id": "FJP-0302",
    "number": 302,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0302-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray302(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray302",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray302(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray302` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.943Z",
    "updatedAt": "2026-09-10T04:07:54.943Z"
  },
  {
    "id": "FJP-0303",
    "number": 303,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0303-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy303(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy303",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy303(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy303` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.943Z",
    "updatedAt": "2026-09-10T04:07:54.943Z"
  },
  {
    "id": "FJP-0304",
    "number": 304,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0304-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray304(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray304",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray304(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray304` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.943Z",
    "updatedAt": "2026-09-10T04:07:54.943Z"
  },
  {
    "id": "FJP-0305",
    "number": 305,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0305-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten305(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten305",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten305(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten305(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten305` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0306",
    "number": 306,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0306-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray306(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray306",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray306(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray306` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0307",
    "number": 307,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0307-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy307(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy307",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy307(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy307` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0308",
    "number": 308,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0308-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray308(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray308",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray308(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray308` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0309",
    "number": 309,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0309-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten309(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten309",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten309(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten309(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten309` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0310",
    "number": 310,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0310-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray310(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray310",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray310(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray310` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0311",
    "number": 311,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0311-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy311(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy311",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy311(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy311` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0312",
    "number": 312,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0312-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray312(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray312",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray312(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray312` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0313",
    "number": 313,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0313-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten313(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten313",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten313(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten313(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten313` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0314",
    "number": 314,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0314-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray314(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray314",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray314(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray314` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0315",
    "number": 315,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0315-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy315(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy315",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy315(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy315` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0316",
    "number": 316,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0316-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray316(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray316",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray316(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray316` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0317",
    "number": 317,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0317-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten317(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten317",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten317(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten317(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten317` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0318",
    "number": 318,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0318-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray318(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray318",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray318(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray318` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0319",
    "number": 319,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0319-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy319(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy319",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy319(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy319` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0320",
    "number": 320,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0320-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray320(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray320",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray320(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray320` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0321",
    "number": 321,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0321-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten321(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten321",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten321(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten321(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten321` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0322",
    "number": 322,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0322-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray322(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray322",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray322(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray322` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0323",
    "number": 323,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0323-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy323(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy323",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy323(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy323` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0324",
    "number": 324,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0324-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray324(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray324",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray324(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray324` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0325",
    "number": 325,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0325-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten325(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten325",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten325(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten325(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten325` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0326",
    "number": 326,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0326-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray326(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray326",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray326(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray326` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0327",
    "number": 327,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0327-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy327(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy327",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy327(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy327` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0328",
    "number": 328,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0328-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray328(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray328",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray328(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray328` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0329",
    "number": 329,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0329-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten329(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten329",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten329(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten329(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten329` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0330",
    "number": 330,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0330-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Easy",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray330(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray330",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray330(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray330` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0331",
    "number": 331,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0331-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy331(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy331",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy331(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy331` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0332",
    "number": 332,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0332-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray332(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray332",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray332(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray332` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0333",
    "number": 333,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0333-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten333(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten333",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten333(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten333(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten333` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0334",
    "number": 334,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0334-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray334(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray334",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray334(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray334` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0335",
    "number": 335,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0335-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy335(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy335",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy335(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy335` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0336",
    "number": 336,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0336-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray336(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray336",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray336(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray336` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0337",
    "number": 337,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0337-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten337(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten337",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten337(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten337(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten337` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0338",
    "number": 338,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0338-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray338(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray338",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray338(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray338` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0339",
    "number": 339,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0339-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy339(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy339",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy339(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy339` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0340",
    "number": 340,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0340-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray340(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray340",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray340(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray340` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0341",
    "number": 341,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0341-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten341(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten341",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten341(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten341(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten341` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0342",
    "number": 342,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0342-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray342(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray342",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray342(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray342` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0343",
    "number": 343,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0343-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy343(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy343",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy343(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy343` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0344",
    "number": 344,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0344-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray344(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray344",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray344(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray344` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0345",
    "number": 345,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0345-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten345(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten345",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten345(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten345(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten345` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0346",
    "number": 346,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0346-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray346(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray346",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray346(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray346` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0347",
    "number": 347,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0347-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy347(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy347",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy347(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy347` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0348",
    "number": 348,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0348-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray348(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray348",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray348(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray348` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0349",
    "number": 349,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0349-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten349(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten349",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten349(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten349(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten349` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0350",
    "number": 350,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0350-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray350(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray350",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray350(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray350` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0351",
    "number": 351,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0351-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy351(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy351",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy351(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy351` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0352",
    "number": 352,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0352-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray352(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray352",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray352(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray352` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0353",
    "number": 353,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0353-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten353(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten353",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten353(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten353(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten353` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0354",
    "number": 354,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0354-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray354(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray354",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray354(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray354` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0355",
    "number": 355,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0355-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy355(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy355",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy355(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy355` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0356",
    "number": 356,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0356-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray356(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray356",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray356(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray356` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0357",
    "number": 357,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0357-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten357(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten357",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten357(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten357(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten357` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0358",
    "number": 358,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0358-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray358(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray358",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray358(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray358` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0359",
    "number": 359,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0359-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy359(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy359",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy359(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy359` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0360",
    "number": 360,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0360-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray360(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray360",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray360(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray360` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0361",
    "number": 361,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0361-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten361(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten361",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten361(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten361(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten361` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0362",
    "number": 362,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0362-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray362(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray362",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray362(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray362` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0363",
    "number": 363,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0363-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy363(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy363",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy363(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy363` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0364",
    "number": 364,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0364-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray364(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray364",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray364(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray364` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0365",
    "number": 365,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0365-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten365(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten365",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten365(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten365(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten365` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0366",
    "number": 366,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0366-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray366(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray366",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray366(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray366` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0367",
    "number": 367,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0367-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy367(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy367",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy367(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy367` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0368",
    "number": 368,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0368-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray368(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray368",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray368(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray368` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0369",
    "number": 369,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0369-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten369(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten369",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten369(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten369(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten369` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0370",
    "number": 370,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0370-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray370(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray370",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray370(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray370` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0371",
    "number": 371,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0371-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy371(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy371",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy371(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy371` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0372",
    "number": 372,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0372-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray372(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray372",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray372(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray372` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0373",
    "number": 373,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0373-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten373(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten373",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten373(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten373(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten373` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0374",
    "number": 374,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0374-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray374(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray374",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray374(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray374` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0375",
    "number": 375,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0375-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Medium",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy375(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy375",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy375(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy375` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0376",
    "number": 376,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0376-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray376(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray376",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray376(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray376` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0377",
    "number": 377,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0377-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten377(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten377",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten377(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten377(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten377` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0378",
    "number": 378,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0378-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray378(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray378",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray378(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray378` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0379",
    "number": 379,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0379-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy379(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy379",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy379(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy379` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0380",
    "number": 380,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0380-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray380(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray380",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray380(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray380` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0381",
    "number": 381,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0381-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten381(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten381",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten381(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten381(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten381` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0382",
    "number": 382,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0382-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray382(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray382",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray382(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray382` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0383",
    "number": 383,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0383-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy383(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy383",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy383(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy383` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0384",
    "number": 384,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0384-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray384(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray384",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray384(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray384` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.944Z",
    "updatedAt": "2026-09-10T04:07:54.944Z"
  },
  {
    "id": "FJP-0385",
    "number": 385,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0385-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten385(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten385",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten385(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten385(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten385` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.945Z",
    "updatedAt": "2026-09-10T04:07:54.945Z"
  },
  {
    "id": "FJP-0386",
    "number": 386,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0386-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray386(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray386",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray386(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray386` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.945Z",
    "updatedAt": "2026-09-10T04:07:54.945Z"
  },
  {
    "id": "FJP-0387",
    "number": 387,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0387-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy387(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy387",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy387(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy387` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.945Z",
    "updatedAt": "2026-09-10T04:07:54.945Z"
  },
  {
    "id": "FJP-0388",
    "number": 388,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0388-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray388(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray388",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray388(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray388` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.945Z",
    "updatedAt": "2026-09-10T04:07:54.945Z"
  },
  {
    "id": "FJP-0389",
    "number": 389,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0389-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten389(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten389",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten389(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten389(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten389` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.945Z",
    "updatedAt": "2026-09-10T04:07:54.945Z"
  },
  {
    "id": "FJP-0390",
    "number": 390,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0390-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray390(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray390",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray390(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray390` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.945Z",
    "updatedAt": "2026-09-10T04:07:54.945Z"
  },
  {
    "id": "FJP-0391",
    "number": 391,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0391-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy391(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy391",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy391(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy391` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.945Z",
    "updatedAt": "2026-09-10T04:07:54.945Z"
  },
  {
    "id": "FJP-0392",
    "number": 392,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0392-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray392(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray392",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray392(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray392` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.945Z",
    "updatedAt": "2026-09-10T04:07:54.945Z"
  },
  {
    "id": "FJP-0393",
    "number": 393,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0393-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten393(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten393",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten393(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten393(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten393` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.945Z",
    "updatedAt": "2026-09-10T04:07:54.945Z"
  },
  {
    "id": "FJP-0394",
    "number": 394,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0394-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray394(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray394",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray394(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray394` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.945Z",
    "updatedAt": "2026-09-10T04:07:54.945Z"
  },
  {
    "id": "FJP-0395",
    "number": 395,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0395-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy395(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy395",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy395(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy395` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.945Z",
    "updatedAt": "2026-09-10T04:07:54.945Z"
  },
  {
    "id": "FJP-0396",
    "number": 396,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0396-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray396(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray396",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray396(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray396` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.945Z",
    "updatedAt": "2026-09-10T04:07:54.945Z"
  },
  {
    "id": "FJP-0397",
    "number": 397,
    "title": "Deep Flatten Array with Depth Limit",
    "slug": "fjp-0397-deep-flatten-array-with-depth-limit",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.prototype.flat",
      "Recursion",
      "Arrays"
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
    "problemStatement": "Recursively flatten nested array up to `depth` levels deep (default 1). If depth is Infinity, flatten all nested levels.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]]]], depth = 2",
        "output": "[1, 2, 3, [4]]"
      }
    ],
    "starterCode": "function deepFlatten397(arr, depth = 1) {\n  // TODO\n}",
    "functionName": "deepFlatten397",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, [2, [3]]], 1]",
        "expectedOutput": "[1, 2, [3]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, [2, [3]]], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[[1]], 0]",
        "expectedOutput": "[[1]]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function deepFlatten397(arr, depth = 1) {\n  if (depth <= 0) return arr.slice();\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...deepFlatten397(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `deepFlatten397` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.945Z",
    "updatedAt": "2026-09-10T04:07:54.945Z"
  },
  {
    "id": "FJP-0398",
    "number": 398,
    "title": "Array Chunking into Sub-arrays",
    "slug": "fjp-0398-array-chunking-into-sub-arrays",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Array.slice",
      "Pagination",
      "Batching"
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
    "problemStatement": "Split array `arr` into chunks of size `size`. The last chunk may contain fewer elements.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5], size = 2",
        "output": "[[1, 2], [3, 4], [5]]"
      }
    ],
    "starterCode": "function chunkArray398(arr, size) {\n  // TODO\n}",
    "functionName": "chunkArray398",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4, 5], 2]",
        "expectedOutput": "[[1, 2], [3, 4], [5]]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3], 3]",
        "expectedOutput": "[[1, 2, 3]]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], 2]",
        "expectedOutput": "[]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function chunkArray398(arr, size) {\n  if (!Array.isArray(arr) || size <= 0) return [];\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `chunkArray398` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.945Z",
    "updatedAt": "2026-09-10T04:07:54.945Z"
  },
  {
    "id": "FJP-0399",
    "number": 399,
    "title": "Group Array by Key or Selector",
    "slug": "fjp-0399-group-array-by-key-or-selector",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Object.groupBy",
      "Grouping",
      "Reduce"
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
    "problemStatement": "Group elements of array `arr` by property string or callback function `keySelector`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [\"one\", \"two\", \"three\"], key = \"length\"",
        "output": "{\"3\": [\"one\", \"two\"], \"5\": [\"three\"]}"
      }
    ],
    "starterCode": "function groupBy399(arr, keySelector) {\n  // TODO\n}",
    "functionName": "groupBy399",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[\"one\", \"two\", \"three\"], \"length\"]",
        "expectedOutput": "{\"3\":[\"one\",\"two\"],\"5\":[\"three\"]}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[1.2, 1.5, 2.3], Math.floor]",
        "expectedOutput": "{\"1\":[1.2,1.5],\"2\":[2.3]}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function groupBy399(arr, keySelector) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keySelector === \"function\" ? keySelector(item) : item[keySelector];\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(item);\n    return acc;\n  }, {});\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `groupBy399` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.945Z",
    "updatedAt": "2026-09-10T04:07:54.945Z"
  },
  {
    "id": "FJP-0400",
    "number": 400,
    "title": "Partition Array by Predicate",
    "slug": "fjp-0400-partition-array-by-predicate",
    "category": "Arrays",
    "subcategory": "Array Transformations, Chunking, Partitioning & Grouping",
    "difficulty": "Hard",
    "frontendTopic": "Array Algorithms & Structural Transformations",
    "javascriptConcepts": [
      "Filtering",
      "Tuples",
      "Predicate"
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
    "problemStatement": "Split array into two arrays `[pass, fail]` based on boolean predicate.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4], pred = x => x % 2 === 0",
        "output": "[[2, 4], [1, 3]]"
      }
    ],
    "starterCode": "function partitionArray400(arr, pred) {\n  // TODO\n}",
    "functionName": "partitionArray400",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[1, 2, 3, 4], function(x){ return x % 2 === 0; }]",
        "expectedOutput": "[[2, 4], [1, 3]]",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[], function(){ return true; }]",
        "expectedOutput": "[[], []]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function partitionArray400(arr, pred) {\n  const pass = [];\n  const fail = [];\n  for (const item of arr) {\n    if (pred(item)) pass.push(item);\n    else fail.push(item);\n  }\n  return [pass, fail];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `partitionArray400` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.945Z",
    "updatedAt": "2026-09-10T04:07:54.945Z"
  }
];
