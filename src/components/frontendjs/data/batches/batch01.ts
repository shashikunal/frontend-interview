// Batch 1: Questions 1 to 100
import type { FrontendJsQuestion } from '../frontendJsTypes';

export const fjpBatch1: FrontendJsQuestion[] = [
  {
    "id": "FJP-0001",
    "number": 1,
    "title": "Implement Object.is Polyfill (SameValue)",
    "slug": "fjp-0001-implement-object-is-polyfill-samevalue",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.is",
      "NaN",
      "+0/-0",
      "Strict Equality"
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
    "problemStatement": "Implement SameValue equality without using Object.is. Must distinguish +0 from -0 and treat NaN as equal to NaN.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "x = NaN, y = NaN",
        "output": "true"
      }
    ],
    "starterCode": "function isSameValue1(x, y) {\n  // TODO\n}",
    "functionName": "isSameValue1",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[NaN, NaN]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, -0]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"abc\", \"abc\"]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null, undefined]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isSameValue1(x, y) {\n  if (x === y) return x !== 0 || 1 / x === 1 / y;\n  return x !== x && y !== y;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isSameValue1` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.929Z",
    "updatedAt": "2026-09-10T04:07:54.930Z"
  },
  {
    "id": "FJP-0002",
    "number": 2,
    "title": "Comprehensive Exact Type Detector",
    "slug": "fjp-0002-comprehensive-exact-type-detector",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.prototype.toString",
      "Types"
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
    "problemStatement": "Return exact lowercase type string (e.g. \"null\", \"undefined\", \"array\", \"date\", \"regexp\", \"map\", \"set\", \"number\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = null",
        "output": "\"null\""
      }
    ],
    "starterCode": "function detectExactType2(val) {\n  // TODO\n}",
    "functionName": "detectExactType2",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[null]",
        "expectedOutput": "\"null\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "\"array\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[123]",
        "expectedOutput": "\"number\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[true]",
        "expectedOutput": "\"boolean\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function detectExactType2(val) {\n  if (val === null) return \"null\";\n  if (val === undefined) return \"undefined\";\n  const raw = Object.prototype.toString.call(val);\n  const match = raw.match(/\\[object\\s+(\\w+)\\]/);\n  return match ? match[1].toLowerCase() : typeof val;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `detectExactType2` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.930Z",
    "updatedAt": "2026-09-10T04:07:54.930Z"
  },
  {
    "id": "FJP-0003",
    "number": 3,
    "title": "Filter Falsy Values From Array",
    "slug": "fjp-0003-filter-falsy-values-from-array",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Boolean Coercion",
      "Falsy"
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
    "problemStatement": "Remove all falsy values (`false`, `0`, `\"\"`, `null`, `undefined`, `NaN`) from array.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [0, 1, false, 2, \"\", 3]",
        "output": "[1, 2, 3]"
      }
    ],
    "starterCode": "function compactFalsy3(arr) {\n  // TODO\n}",
    "functionName": "compactFalsy3",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[0, 1, false, 2, \"\", 3]]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[null, undefined, 0]]",
        "expectedOutput": "[]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[true, \"ok\", 42]]",
        "expectedOutput": "[true, \"ok\", 42]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function compactFalsy3(arr) {\n  return arr.filter(Boolean);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `compactFalsy3` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.930Z",
    "updatedAt": "2026-09-10T04:07:54.930Z"
  },
  {
    "id": "FJP-0004",
    "number": 4,
    "title": "Safe Float Clamper and Rounder",
    "slug": "fjp-0004-safe-float-clamper-and-rounder",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math",
      "Precision",
      "Floating Point"
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
    "problemStatement": "Round floating point number `val` to `decimals` places accurately avoiding IEEE 754 precision issues.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = 1.005, decimals = 2",
        "output": "1.01"
      }
    ],
    "starterCode": "function clampFloatPrecision4(val, decimals) {\n  // TODO\n}",
    "functionName": "clampFloatPrecision4",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1.005, 2]",
        "expectedOutput": "1.01",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[3.14159, 3]",
        "expectedOutput": "3.142",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0.1 + 0.2, 1]",
        "expectedOutput": "0.3",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function clampFloatPrecision4(val, decimals) {\n  const factor = Math.pow(10, decimals);\n  return Math.round((val + Number.EPSILON) * factor) / factor;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `clampFloatPrecision4` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.930Z",
    "updatedAt": "2026-09-10T04:07:54.930Z"
  },
  {
    "id": "FJP-0005",
    "number": 5,
    "title": "Format Byte Size to Human Readable Units",
    "slug": "fjp-0005-format-byte-size-to-human-readable-units",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math.log",
      "Units",
      "Formatting"
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
    "problemStatement": "Convert numeric byte count into formatted string (e.g. \"500 B\", \"1 KB\", \"1.5 MB\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "bytes = 1024",
        "output": "\"1 KB\""
      }
    ],
    "starterCode": "function formatBytes5(bytes) {\n  // TODO\n}",
    "functionName": "formatBytes5",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[500]",
        "expectedOutput": "\"500 B\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[1024]",
        "expectedOutput": "\"1 KB\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1536]",
        "expectedOutput": "\"1.5 KB\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[1048576]",
        "expectedOutput": "\"1 MB\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function formatBytes5(bytes) {\n  if (bytes === 0) return \"0 B\";\n  const sizes = [\"B\", \"KB\", \"MB\", \"GB\", \"TB\"];\n  const i = Math.floor(Math.log(bytes) / Math.log(1024));\n  const val = bytes / Math.pow(1024, i);\n  const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1);\n  return formatted + \" \" + sizes[i];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `formatBytes5` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.930Z",
    "updatedAt": "2026-09-10T04:07:54.930Z"
  },
  {
    "id": "FJP-0006",
    "number": 6,
    "title": "Strict Boolean Value Normalizer",
    "slug": "fjp-0006-strict-boolean-value-normalizer",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Coercion",
      "Strings",
      "Booleans"
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
    "problemStatement": "Convert strings \"true\", \"1\", \"yes\", and numbers 1 / true to true; all other values to false (case-insensitive).",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = \"TRUE\"",
        "output": "true"
      }
    ],
    "starterCode": "function toStrictBoolean6(val) {\n  // TODO\n}",
    "functionName": "toStrictBoolean6",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"TRUE\"]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[\"no\"]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function toStrictBoolean6(val) {\n  if (val === true || val === 1) return true;\n  if (typeof val === \"string\") {\n    const s = val.trim().toLowerCase();\n    if ([\"true\", \"1\", \"yes\"].includes(s)) return true;\n  }\n  return false;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `toStrictBoolean6` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0007",
    "number": 7,
    "title": "Check Power of Two Bitwise Checker",
    "slug": "fjp-0007-check-power-of-two-bitwise-checker",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Bitwise",
      "Math"
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
    "problemStatement": "Determine if integer `n` is a positive power of two using bitwise operators.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "n = 16",
        "output": "true"
      }
    ],
    "starterCode": "function isPowerOfTwo7(n) {\n  // TODO\n}",
    "functionName": "isPowerOfTwo7",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[16]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[18]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[0]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isPowerOfTwo7(n) {\n  return n > 0 && (n & (n - 1)) === 0;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isPowerOfTwo7` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0008",
    "number": 8,
    "title": "Implement Object.is Polyfill (SameValue)",
    "slug": "fjp-0008-implement-object-is-polyfill-samevalue",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.is",
      "NaN",
      "+0/-0",
      "Strict Equality"
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
    "problemStatement": "Implement SameValue equality without using Object.is. Must distinguish +0 from -0 and treat NaN as equal to NaN.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "x = NaN, y = NaN",
        "output": "true"
      }
    ],
    "starterCode": "function isSameValue8(x, y) {\n  // TODO\n}",
    "functionName": "isSameValue8",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[NaN, NaN]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, -0]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"abc\", \"abc\"]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null, undefined]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isSameValue8(x, y) {\n  if (x === y) return x !== 0 || 1 / x === 1 / y;\n  return x !== x && y !== y;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isSameValue8` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0009",
    "number": 9,
    "title": "Comprehensive Exact Type Detector",
    "slug": "fjp-0009-comprehensive-exact-type-detector",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.prototype.toString",
      "Types"
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
    "problemStatement": "Return exact lowercase type string (e.g. \"null\", \"undefined\", \"array\", \"date\", \"regexp\", \"map\", \"set\", \"number\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = null",
        "output": "\"null\""
      }
    ],
    "starterCode": "function detectExactType9(val) {\n  // TODO\n}",
    "functionName": "detectExactType9",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[null]",
        "expectedOutput": "\"null\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "\"array\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[123]",
        "expectedOutput": "\"number\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[true]",
        "expectedOutput": "\"boolean\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function detectExactType9(val) {\n  if (val === null) return \"null\";\n  if (val === undefined) return \"undefined\";\n  const raw = Object.prototype.toString.call(val);\n  const match = raw.match(/\\[object\\s+(\\w+)\\]/);\n  return match ? match[1].toLowerCase() : typeof val;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `detectExactType9` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0010",
    "number": 10,
    "title": "Filter Falsy Values From Array",
    "slug": "fjp-0010-filter-falsy-values-from-array",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Boolean Coercion",
      "Falsy"
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
    "problemStatement": "Remove all falsy values (`false`, `0`, `\"\"`, `null`, `undefined`, `NaN`) from array.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [0, 1, false, 2, \"\", 3]",
        "output": "[1, 2, 3]"
      }
    ],
    "starterCode": "function compactFalsy10(arr) {\n  // TODO\n}",
    "functionName": "compactFalsy10",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[0, 1, false, 2, \"\", 3]]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[null, undefined, 0]]",
        "expectedOutput": "[]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[true, \"ok\", 42]]",
        "expectedOutput": "[true, \"ok\", 42]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function compactFalsy10(arr) {\n  return arr.filter(Boolean);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `compactFalsy10` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0011",
    "number": 11,
    "title": "Safe Float Clamper and Rounder",
    "slug": "fjp-0011-safe-float-clamper-and-rounder",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math",
      "Precision",
      "Floating Point"
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
    "problemStatement": "Round floating point number `val` to `decimals` places accurately avoiding IEEE 754 precision issues.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = 1.005, decimals = 2",
        "output": "1.01"
      }
    ],
    "starterCode": "function clampFloatPrecision11(val, decimals) {\n  // TODO\n}",
    "functionName": "clampFloatPrecision11",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1.005, 2]",
        "expectedOutput": "1.01",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[3.14159, 3]",
        "expectedOutput": "3.142",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0.1 + 0.2, 1]",
        "expectedOutput": "0.3",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function clampFloatPrecision11(val, decimals) {\n  const factor = Math.pow(10, decimals);\n  return Math.round((val + Number.EPSILON) * factor) / factor;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `clampFloatPrecision11` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0012",
    "number": 12,
    "title": "Format Byte Size to Human Readable Units",
    "slug": "fjp-0012-format-byte-size-to-human-readable-units",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math.log",
      "Units",
      "Formatting"
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
    "problemStatement": "Convert numeric byte count into formatted string (e.g. \"500 B\", \"1 KB\", \"1.5 MB\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "bytes = 1024",
        "output": "\"1 KB\""
      }
    ],
    "starterCode": "function formatBytes12(bytes) {\n  // TODO\n}",
    "functionName": "formatBytes12",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[500]",
        "expectedOutput": "\"500 B\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[1024]",
        "expectedOutput": "\"1 KB\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1536]",
        "expectedOutput": "\"1.5 KB\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[1048576]",
        "expectedOutput": "\"1 MB\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function formatBytes12(bytes) {\n  if (bytes === 0) return \"0 B\";\n  const sizes = [\"B\", \"KB\", \"MB\", \"GB\", \"TB\"];\n  const i = Math.floor(Math.log(bytes) / Math.log(1024));\n  const val = bytes / Math.pow(1024, i);\n  const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1);\n  return formatted + \" \" + sizes[i];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `formatBytes12` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0013",
    "number": 13,
    "title": "Strict Boolean Value Normalizer",
    "slug": "fjp-0013-strict-boolean-value-normalizer",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Coercion",
      "Strings",
      "Booleans"
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
    "problemStatement": "Convert strings \"true\", \"1\", \"yes\", and numbers 1 / true to true; all other values to false (case-insensitive).",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = \"TRUE\"",
        "output": "true"
      }
    ],
    "starterCode": "function toStrictBoolean13(val) {\n  // TODO\n}",
    "functionName": "toStrictBoolean13",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"TRUE\"]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[\"no\"]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function toStrictBoolean13(val) {\n  if (val === true || val === 1) return true;\n  if (typeof val === \"string\") {\n    const s = val.trim().toLowerCase();\n    if ([\"true\", \"1\", \"yes\"].includes(s)) return true;\n  }\n  return false;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `toStrictBoolean13` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0014",
    "number": 14,
    "title": "Check Power of Two Bitwise Checker",
    "slug": "fjp-0014-check-power-of-two-bitwise-checker",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Bitwise",
      "Math"
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
    "problemStatement": "Determine if integer `n` is a positive power of two using bitwise operators.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "n = 16",
        "output": "true"
      }
    ],
    "starterCode": "function isPowerOfTwo14(n) {\n  // TODO\n}",
    "functionName": "isPowerOfTwo14",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[16]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[18]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[0]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isPowerOfTwo14(n) {\n  return n > 0 && (n & (n - 1)) === 0;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isPowerOfTwo14` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0015",
    "number": 15,
    "title": "Implement Object.is Polyfill (SameValue)",
    "slug": "fjp-0015-implement-object-is-polyfill-samevalue",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.is",
      "NaN",
      "+0/-0",
      "Strict Equality"
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
    "problemStatement": "Implement SameValue equality without using Object.is. Must distinguish +0 from -0 and treat NaN as equal to NaN.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "x = NaN, y = NaN",
        "output": "true"
      }
    ],
    "starterCode": "function isSameValue15(x, y) {\n  // TODO\n}",
    "functionName": "isSameValue15",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[NaN, NaN]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, -0]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"abc\", \"abc\"]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null, undefined]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isSameValue15(x, y) {\n  if (x === y) return x !== 0 || 1 / x === 1 / y;\n  return x !== x && y !== y;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isSameValue15` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0016",
    "number": 16,
    "title": "Comprehensive Exact Type Detector",
    "slug": "fjp-0016-comprehensive-exact-type-detector",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.prototype.toString",
      "Types"
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
    "problemStatement": "Return exact lowercase type string (e.g. \"null\", \"undefined\", \"array\", \"date\", \"regexp\", \"map\", \"set\", \"number\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = null",
        "output": "\"null\""
      }
    ],
    "starterCode": "function detectExactType16(val) {\n  // TODO\n}",
    "functionName": "detectExactType16",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[null]",
        "expectedOutput": "\"null\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "\"array\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[123]",
        "expectedOutput": "\"number\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[true]",
        "expectedOutput": "\"boolean\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function detectExactType16(val) {\n  if (val === null) return \"null\";\n  if (val === undefined) return \"undefined\";\n  const raw = Object.prototype.toString.call(val);\n  const match = raw.match(/\\[object\\s+(\\w+)\\]/);\n  return match ? match[1].toLowerCase() : typeof val;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `detectExactType16` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0017",
    "number": 17,
    "title": "Filter Falsy Values From Array",
    "slug": "fjp-0017-filter-falsy-values-from-array",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Boolean Coercion",
      "Falsy"
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
    "problemStatement": "Remove all falsy values (`false`, `0`, `\"\"`, `null`, `undefined`, `NaN`) from array.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [0, 1, false, 2, \"\", 3]",
        "output": "[1, 2, 3]"
      }
    ],
    "starterCode": "function compactFalsy17(arr) {\n  // TODO\n}",
    "functionName": "compactFalsy17",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[0, 1, false, 2, \"\", 3]]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[null, undefined, 0]]",
        "expectedOutput": "[]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[true, \"ok\", 42]]",
        "expectedOutput": "[true, \"ok\", 42]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function compactFalsy17(arr) {\n  return arr.filter(Boolean);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `compactFalsy17` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0018",
    "number": 18,
    "title": "Safe Float Clamper and Rounder",
    "slug": "fjp-0018-safe-float-clamper-and-rounder",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math",
      "Precision",
      "Floating Point"
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
    "problemStatement": "Round floating point number `val` to `decimals` places accurately avoiding IEEE 754 precision issues.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = 1.005, decimals = 2",
        "output": "1.01"
      }
    ],
    "starterCode": "function clampFloatPrecision18(val, decimals) {\n  // TODO\n}",
    "functionName": "clampFloatPrecision18",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1.005, 2]",
        "expectedOutput": "1.01",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[3.14159, 3]",
        "expectedOutput": "3.142",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0.1 + 0.2, 1]",
        "expectedOutput": "0.3",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function clampFloatPrecision18(val, decimals) {\n  const factor = Math.pow(10, decimals);\n  return Math.round((val + Number.EPSILON) * factor) / factor;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `clampFloatPrecision18` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0019",
    "number": 19,
    "title": "Format Byte Size to Human Readable Units",
    "slug": "fjp-0019-format-byte-size-to-human-readable-units",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math.log",
      "Units",
      "Formatting"
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
    "problemStatement": "Convert numeric byte count into formatted string (e.g. \"500 B\", \"1 KB\", \"1.5 MB\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "bytes = 1024",
        "output": "\"1 KB\""
      }
    ],
    "starterCode": "function formatBytes19(bytes) {\n  // TODO\n}",
    "functionName": "formatBytes19",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[500]",
        "expectedOutput": "\"500 B\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[1024]",
        "expectedOutput": "\"1 KB\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1536]",
        "expectedOutput": "\"1.5 KB\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[1048576]",
        "expectedOutput": "\"1 MB\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function formatBytes19(bytes) {\n  if (bytes === 0) return \"0 B\";\n  const sizes = [\"B\", \"KB\", \"MB\", \"GB\", \"TB\"];\n  const i = Math.floor(Math.log(bytes) / Math.log(1024));\n  const val = bytes / Math.pow(1024, i);\n  const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1);\n  return formatted + \" \" + sizes[i];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `formatBytes19` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0020",
    "number": 20,
    "title": "Strict Boolean Value Normalizer",
    "slug": "fjp-0020-strict-boolean-value-normalizer",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Coercion",
      "Strings",
      "Booleans"
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
    "problemStatement": "Convert strings \"true\", \"1\", \"yes\", and numbers 1 / true to true; all other values to false (case-insensitive).",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = \"TRUE\"",
        "output": "true"
      }
    ],
    "starterCode": "function toStrictBoolean20(val) {\n  // TODO\n}",
    "functionName": "toStrictBoolean20",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"TRUE\"]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[\"no\"]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function toStrictBoolean20(val) {\n  if (val === true || val === 1) return true;\n  if (typeof val === \"string\") {\n    const s = val.trim().toLowerCase();\n    if ([\"true\", \"1\", \"yes\"].includes(s)) return true;\n  }\n  return false;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `toStrictBoolean20` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0021",
    "number": 21,
    "title": "Check Power of Two Bitwise Checker",
    "slug": "fjp-0021-check-power-of-two-bitwise-checker",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Bitwise",
      "Math"
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
    "problemStatement": "Determine if integer `n` is a positive power of two using bitwise operators.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "n = 16",
        "output": "true"
      }
    ],
    "starterCode": "function isPowerOfTwo21(n) {\n  // TODO\n}",
    "functionName": "isPowerOfTwo21",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[16]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[18]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[0]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isPowerOfTwo21(n) {\n  return n > 0 && (n & (n - 1)) === 0;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isPowerOfTwo21` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0022",
    "number": 22,
    "title": "Implement Object.is Polyfill (SameValue)",
    "slug": "fjp-0022-implement-object-is-polyfill-samevalue",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.is",
      "NaN",
      "+0/-0",
      "Strict Equality"
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
    "problemStatement": "Implement SameValue equality without using Object.is. Must distinguish +0 from -0 and treat NaN as equal to NaN.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "x = NaN, y = NaN",
        "output": "true"
      }
    ],
    "starterCode": "function isSameValue22(x, y) {\n  // TODO\n}",
    "functionName": "isSameValue22",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[NaN, NaN]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, -0]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"abc\", \"abc\"]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null, undefined]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isSameValue22(x, y) {\n  if (x === y) return x !== 0 || 1 / x === 1 / y;\n  return x !== x && y !== y;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isSameValue22` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0023",
    "number": 23,
    "title": "Comprehensive Exact Type Detector",
    "slug": "fjp-0023-comprehensive-exact-type-detector",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.prototype.toString",
      "Types"
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
    "problemStatement": "Return exact lowercase type string (e.g. \"null\", \"undefined\", \"array\", \"date\", \"regexp\", \"map\", \"set\", \"number\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = null",
        "output": "\"null\""
      }
    ],
    "starterCode": "function detectExactType23(val) {\n  // TODO\n}",
    "functionName": "detectExactType23",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[null]",
        "expectedOutput": "\"null\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "\"array\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[123]",
        "expectedOutput": "\"number\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[true]",
        "expectedOutput": "\"boolean\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function detectExactType23(val) {\n  if (val === null) return \"null\";\n  if (val === undefined) return \"undefined\";\n  const raw = Object.prototype.toString.call(val);\n  const match = raw.match(/\\[object\\s+(\\w+)\\]/);\n  return match ? match[1].toLowerCase() : typeof val;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `detectExactType23` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0024",
    "number": 24,
    "title": "Filter Falsy Values From Array",
    "slug": "fjp-0024-filter-falsy-values-from-array",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Boolean Coercion",
      "Falsy"
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
    "problemStatement": "Remove all falsy values (`false`, `0`, `\"\"`, `null`, `undefined`, `NaN`) from array.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [0, 1, false, 2, \"\", 3]",
        "output": "[1, 2, 3]"
      }
    ],
    "starterCode": "function compactFalsy24(arr) {\n  // TODO\n}",
    "functionName": "compactFalsy24",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[0, 1, false, 2, \"\", 3]]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[null, undefined, 0]]",
        "expectedOutput": "[]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[true, \"ok\", 42]]",
        "expectedOutput": "[true, \"ok\", 42]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function compactFalsy24(arr) {\n  return arr.filter(Boolean);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `compactFalsy24` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0025",
    "number": 25,
    "title": "Safe Float Clamper and Rounder",
    "slug": "fjp-0025-safe-float-clamper-and-rounder",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math",
      "Precision",
      "Floating Point"
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
    "problemStatement": "Round floating point number `val` to `decimals` places accurately avoiding IEEE 754 precision issues.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = 1.005, decimals = 2",
        "output": "1.01"
      }
    ],
    "starterCode": "function clampFloatPrecision25(val, decimals) {\n  // TODO\n}",
    "functionName": "clampFloatPrecision25",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1.005, 2]",
        "expectedOutput": "1.01",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[3.14159, 3]",
        "expectedOutput": "3.142",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0.1 + 0.2, 1]",
        "expectedOutput": "0.3",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function clampFloatPrecision25(val, decimals) {\n  const factor = Math.pow(10, decimals);\n  return Math.round((val + Number.EPSILON) * factor) / factor;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `clampFloatPrecision25` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0026",
    "number": 26,
    "title": "Format Byte Size to Human Readable Units",
    "slug": "fjp-0026-format-byte-size-to-human-readable-units",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math.log",
      "Units",
      "Formatting"
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
    "problemStatement": "Convert numeric byte count into formatted string (e.g. \"500 B\", \"1 KB\", \"1.5 MB\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "bytes = 1024",
        "output": "\"1 KB\""
      }
    ],
    "starterCode": "function formatBytes26(bytes) {\n  // TODO\n}",
    "functionName": "formatBytes26",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[500]",
        "expectedOutput": "\"500 B\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[1024]",
        "expectedOutput": "\"1 KB\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1536]",
        "expectedOutput": "\"1.5 KB\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[1048576]",
        "expectedOutput": "\"1 MB\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function formatBytes26(bytes) {\n  if (bytes === 0) return \"0 B\";\n  const sizes = [\"B\", \"KB\", \"MB\", \"GB\", \"TB\"];\n  const i = Math.floor(Math.log(bytes) / Math.log(1024));\n  const val = bytes / Math.pow(1024, i);\n  const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1);\n  return formatted + \" \" + sizes[i];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `formatBytes26` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0027",
    "number": 27,
    "title": "Strict Boolean Value Normalizer",
    "slug": "fjp-0027-strict-boolean-value-normalizer",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Coercion",
      "Strings",
      "Booleans"
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
    "problemStatement": "Convert strings \"true\", \"1\", \"yes\", and numbers 1 / true to true; all other values to false (case-insensitive).",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = \"TRUE\"",
        "output": "true"
      }
    ],
    "starterCode": "function toStrictBoolean27(val) {\n  // TODO\n}",
    "functionName": "toStrictBoolean27",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"TRUE\"]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[\"no\"]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function toStrictBoolean27(val) {\n  if (val === true || val === 1) return true;\n  if (typeof val === \"string\") {\n    const s = val.trim().toLowerCase();\n    if ([\"true\", \"1\", \"yes\"].includes(s)) return true;\n  }\n  return false;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `toStrictBoolean27` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0028",
    "number": 28,
    "title": "Check Power of Two Bitwise Checker",
    "slug": "fjp-0028-check-power-of-two-bitwise-checker",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Bitwise",
      "Math"
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
    "problemStatement": "Determine if integer `n` is a positive power of two using bitwise operators.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "n = 16",
        "output": "true"
      }
    ],
    "starterCode": "function isPowerOfTwo28(n) {\n  // TODO\n}",
    "functionName": "isPowerOfTwo28",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[16]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[18]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[0]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isPowerOfTwo28(n) {\n  return n > 0 && (n & (n - 1)) === 0;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isPowerOfTwo28` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0029",
    "number": 29,
    "title": "Implement Object.is Polyfill (SameValue)",
    "slug": "fjp-0029-implement-object-is-polyfill-samevalue",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.is",
      "NaN",
      "+0/-0",
      "Strict Equality"
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
    "problemStatement": "Implement SameValue equality without using Object.is. Must distinguish +0 from -0 and treat NaN as equal to NaN.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "x = NaN, y = NaN",
        "output": "true"
      }
    ],
    "starterCode": "function isSameValue29(x, y) {\n  // TODO\n}",
    "functionName": "isSameValue29",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[NaN, NaN]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, -0]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"abc\", \"abc\"]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null, undefined]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isSameValue29(x, y) {\n  if (x === y) return x !== 0 || 1 / x === 1 / y;\n  return x !== x && y !== y;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isSameValue29` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0030",
    "number": 30,
    "title": "Comprehensive Exact Type Detector",
    "slug": "fjp-0030-comprehensive-exact-type-detector",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Easy",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.prototype.toString",
      "Types"
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
    "problemStatement": "Return exact lowercase type string (e.g. \"null\", \"undefined\", \"array\", \"date\", \"regexp\", \"map\", \"set\", \"number\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = null",
        "output": "\"null\""
      }
    ],
    "starterCode": "function detectExactType30(val) {\n  // TODO\n}",
    "functionName": "detectExactType30",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[null]",
        "expectedOutput": "\"null\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "\"array\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[123]",
        "expectedOutput": "\"number\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[true]",
        "expectedOutput": "\"boolean\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function detectExactType30(val) {\n  if (val === null) return \"null\";\n  if (val === undefined) return \"undefined\";\n  const raw = Object.prototype.toString.call(val);\n  const match = raw.match(/\\[object\\s+(\\w+)\\]/);\n  return match ? match[1].toLowerCase() : typeof val;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `detectExactType30` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0031",
    "number": 31,
    "title": "Filter Falsy Values From Array",
    "slug": "fjp-0031-filter-falsy-values-from-array",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Boolean Coercion",
      "Falsy"
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
    "problemStatement": "Remove all falsy values (`false`, `0`, `\"\"`, `null`, `undefined`, `NaN`) from array.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [0, 1, false, 2, \"\", 3]",
        "output": "[1, 2, 3]"
      }
    ],
    "starterCode": "function compactFalsy31(arr) {\n  // TODO\n}",
    "functionName": "compactFalsy31",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[0, 1, false, 2, \"\", 3]]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[null, undefined, 0]]",
        "expectedOutput": "[]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[true, \"ok\", 42]]",
        "expectedOutput": "[true, \"ok\", 42]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function compactFalsy31(arr) {\n  return arr.filter(Boolean);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `compactFalsy31` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0032",
    "number": 32,
    "title": "Safe Float Clamper and Rounder",
    "slug": "fjp-0032-safe-float-clamper-and-rounder",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math",
      "Precision",
      "Floating Point"
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
    "problemStatement": "Round floating point number `val` to `decimals` places accurately avoiding IEEE 754 precision issues.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = 1.005, decimals = 2",
        "output": "1.01"
      }
    ],
    "starterCode": "function clampFloatPrecision32(val, decimals) {\n  // TODO\n}",
    "functionName": "clampFloatPrecision32",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1.005, 2]",
        "expectedOutput": "1.01",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[3.14159, 3]",
        "expectedOutput": "3.142",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0.1 + 0.2, 1]",
        "expectedOutput": "0.3",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function clampFloatPrecision32(val, decimals) {\n  const factor = Math.pow(10, decimals);\n  return Math.round((val + Number.EPSILON) * factor) / factor;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `clampFloatPrecision32` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0033",
    "number": 33,
    "title": "Format Byte Size to Human Readable Units",
    "slug": "fjp-0033-format-byte-size-to-human-readable-units",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math.log",
      "Units",
      "Formatting"
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
    "problemStatement": "Convert numeric byte count into formatted string (e.g. \"500 B\", \"1 KB\", \"1.5 MB\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "bytes = 1024",
        "output": "\"1 KB\""
      }
    ],
    "starterCode": "function formatBytes33(bytes) {\n  // TODO\n}",
    "functionName": "formatBytes33",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[500]",
        "expectedOutput": "\"500 B\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[1024]",
        "expectedOutput": "\"1 KB\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1536]",
        "expectedOutput": "\"1.5 KB\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[1048576]",
        "expectedOutput": "\"1 MB\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function formatBytes33(bytes) {\n  if (bytes === 0) return \"0 B\";\n  const sizes = [\"B\", \"KB\", \"MB\", \"GB\", \"TB\"];\n  const i = Math.floor(Math.log(bytes) / Math.log(1024));\n  const val = bytes / Math.pow(1024, i);\n  const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1);\n  return formatted + \" \" + sizes[i];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `formatBytes33` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0034",
    "number": 34,
    "title": "Strict Boolean Value Normalizer",
    "slug": "fjp-0034-strict-boolean-value-normalizer",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Coercion",
      "Strings",
      "Booleans"
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
    "problemStatement": "Convert strings \"true\", \"1\", \"yes\", and numbers 1 / true to true; all other values to false (case-insensitive).",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = \"TRUE\"",
        "output": "true"
      }
    ],
    "starterCode": "function toStrictBoolean34(val) {\n  // TODO\n}",
    "functionName": "toStrictBoolean34",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"TRUE\"]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[\"no\"]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function toStrictBoolean34(val) {\n  if (val === true || val === 1) return true;\n  if (typeof val === \"string\") {\n    const s = val.trim().toLowerCase();\n    if ([\"true\", \"1\", \"yes\"].includes(s)) return true;\n  }\n  return false;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `toStrictBoolean34` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0035",
    "number": 35,
    "title": "Check Power of Two Bitwise Checker",
    "slug": "fjp-0035-check-power-of-two-bitwise-checker",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Bitwise",
      "Math"
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
    "problemStatement": "Determine if integer `n` is a positive power of two using bitwise operators.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "n = 16",
        "output": "true"
      }
    ],
    "starterCode": "function isPowerOfTwo35(n) {\n  // TODO\n}",
    "functionName": "isPowerOfTwo35",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[16]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[18]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[0]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isPowerOfTwo35(n) {\n  return n > 0 && (n & (n - 1)) === 0;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isPowerOfTwo35` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0036",
    "number": 36,
    "title": "Implement Object.is Polyfill (SameValue)",
    "slug": "fjp-0036-implement-object-is-polyfill-samevalue",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.is",
      "NaN",
      "+0/-0",
      "Strict Equality"
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
    "problemStatement": "Implement SameValue equality without using Object.is. Must distinguish +0 from -0 and treat NaN as equal to NaN.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "x = NaN, y = NaN",
        "output": "true"
      }
    ],
    "starterCode": "function isSameValue36(x, y) {\n  // TODO\n}",
    "functionName": "isSameValue36",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[NaN, NaN]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, -0]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"abc\", \"abc\"]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null, undefined]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isSameValue36(x, y) {\n  if (x === y) return x !== 0 || 1 / x === 1 / y;\n  return x !== x && y !== y;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isSameValue36` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0037",
    "number": 37,
    "title": "Comprehensive Exact Type Detector",
    "slug": "fjp-0037-comprehensive-exact-type-detector",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.prototype.toString",
      "Types"
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
    "problemStatement": "Return exact lowercase type string (e.g. \"null\", \"undefined\", \"array\", \"date\", \"regexp\", \"map\", \"set\", \"number\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = null",
        "output": "\"null\""
      }
    ],
    "starterCode": "function detectExactType37(val) {\n  // TODO\n}",
    "functionName": "detectExactType37",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[null]",
        "expectedOutput": "\"null\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "\"array\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[123]",
        "expectedOutput": "\"number\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[true]",
        "expectedOutput": "\"boolean\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function detectExactType37(val) {\n  if (val === null) return \"null\";\n  if (val === undefined) return \"undefined\";\n  const raw = Object.prototype.toString.call(val);\n  const match = raw.match(/\\[object\\s+(\\w+)\\]/);\n  return match ? match[1].toLowerCase() : typeof val;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `detectExactType37` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0038",
    "number": 38,
    "title": "Filter Falsy Values From Array",
    "slug": "fjp-0038-filter-falsy-values-from-array",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Boolean Coercion",
      "Falsy"
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
    "problemStatement": "Remove all falsy values (`false`, `0`, `\"\"`, `null`, `undefined`, `NaN`) from array.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [0, 1, false, 2, \"\", 3]",
        "output": "[1, 2, 3]"
      }
    ],
    "starterCode": "function compactFalsy38(arr) {\n  // TODO\n}",
    "functionName": "compactFalsy38",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[0, 1, false, 2, \"\", 3]]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[null, undefined, 0]]",
        "expectedOutput": "[]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[true, \"ok\", 42]]",
        "expectedOutput": "[true, \"ok\", 42]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function compactFalsy38(arr) {\n  return arr.filter(Boolean);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `compactFalsy38` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0039",
    "number": 39,
    "title": "Safe Float Clamper and Rounder",
    "slug": "fjp-0039-safe-float-clamper-and-rounder",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math",
      "Precision",
      "Floating Point"
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
    "problemStatement": "Round floating point number `val` to `decimals` places accurately avoiding IEEE 754 precision issues.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = 1.005, decimals = 2",
        "output": "1.01"
      }
    ],
    "starterCode": "function clampFloatPrecision39(val, decimals) {\n  // TODO\n}",
    "functionName": "clampFloatPrecision39",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1.005, 2]",
        "expectedOutput": "1.01",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[3.14159, 3]",
        "expectedOutput": "3.142",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0.1 + 0.2, 1]",
        "expectedOutput": "0.3",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function clampFloatPrecision39(val, decimals) {\n  const factor = Math.pow(10, decimals);\n  return Math.round((val + Number.EPSILON) * factor) / factor;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `clampFloatPrecision39` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0040",
    "number": 40,
    "title": "Format Byte Size to Human Readable Units",
    "slug": "fjp-0040-format-byte-size-to-human-readable-units",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math.log",
      "Units",
      "Formatting"
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
    "problemStatement": "Convert numeric byte count into formatted string (e.g. \"500 B\", \"1 KB\", \"1.5 MB\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "bytes = 1024",
        "output": "\"1 KB\""
      }
    ],
    "starterCode": "function formatBytes40(bytes) {\n  // TODO\n}",
    "functionName": "formatBytes40",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[500]",
        "expectedOutput": "\"500 B\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[1024]",
        "expectedOutput": "\"1 KB\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1536]",
        "expectedOutput": "\"1.5 KB\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[1048576]",
        "expectedOutput": "\"1 MB\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function formatBytes40(bytes) {\n  if (bytes === 0) return \"0 B\";\n  const sizes = [\"B\", \"KB\", \"MB\", \"GB\", \"TB\"];\n  const i = Math.floor(Math.log(bytes) / Math.log(1024));\n  const val = bytes / Math.pow(1024, i);\n  const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1);\n  return formatted + \" \" + sizes[i];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `formatBytes40` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0041",
    "number": 41,
    "title": "Strict Boolean Value Normalizer",
    "slug": "fjp-0041-strict-boolean-value-normalizer",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Coercion",
      "Strings",
      "Booleans"
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
    "problemStatement": "Convert strings \"true\", \"1\", \"yes\", and numbers 1 / true to true; all other values to false (case-insensitive).",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = \"TRUE\"",
        "output": "true"
      }
    ],
    "starterCode": "function toStrictBoolean41(val) {\n  // TODO\n}",
    "functionName": "toStrictBoolean41",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"TRUE\"]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[\"no\"]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function toStrictBoolean41(val) {\n  if (val === true || val === 1) return true;\n  if (typeof val === \"string\") {\n    const s = val.trim().toLowerCase();\n    if ([\"true\", \"1\", \"yes\"].includes(s)) return true;\n  }\n  return false;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `toStrictBoolean41` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0042",
    "number": 42,
    "title": "Check Power of Two Bitwise Checker",
    "slug": "fjp-0042-check-power-of-two-bitwise-checker",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Bitwise",
      "Math"
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
    "problemStatement": "Determine if integer `n` is a positive power of two using bitwise operators.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "n = 16",
        "output": "true"
      }
    ],
    "starterCode": "function isPowerOfTwo42(n) {\n  // TODO\n}",
    "functionName": "isPowerOfTwo42",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[16]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[18]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[0]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isPowerOfTwo42(n) {\n  return n > 0 && (n & (n - 1)) === 0;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isPowerOfTwo42` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0043",
    "number": 43,
    "title": "Implement Object.is Polyfill (SameValue)",
    "slug": "fjp-0043-implement-object-is-polyfill-samevalue",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.is",
      "NaN",
      "+0/-0",
      "Strict Equality"
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
    "problemStatement": "Implement SameValue equality without using Object.is. Must distinguish +0 from -0 and treat NaN as equal to NaN.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "x = NaN, y = NaN",
        "output": "true"
      }
    ],
    "starterCode": "function isSameValue43(x, y) {\n  // TODO\n}",
    "functionName": "isSameValue43",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[NaN, NaN]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, -0]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"abc\", \"abc\"]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null, undefined]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isSameValue43(x, y) {\n  if (x === y) return x !== 0 || 1 / x === 1 / y;\n  return x !== x && y !== y;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isSameValue43` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0044",
    "number": 44,
    "title": "Comprehensive Exact Type Detector",
    "slug": "fjp-0044-comprehensive-exact-type-detector",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.prototype.toString",
      "Types"
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
    "problemStatement": "Return exact lowercase type string (e.g. \"null\", \"undefined\", \"array\", \"date\", \"regexp\", \"map\", \"set\", \"number\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = null",
        "output": "\"null\""
      }
    ],
    "starterCode": "function detectExactType44(val) {\n  // TODO\n}",
    "functionName": "detectExactType44",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[null]",
        "expectedOutput": "\"null\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "\"array\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[123]",
        "expectedOutput": "\"number\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[true]",
        "expectedOutput": "\"boolean\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function detectExactType44(val) {\n  if (val === null) return \"null\";\n  if (val === undefined) return \"undefined\";\n  const raw = Object.prototype.toString.call(val);\n  const match = raw.match(/\\[object\\s+(\\w+)\\]/);\n  return match ? match[1].toLowerCase() : typeof val;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `detectExactType44` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0045",
    "number": 45,
    "title": "Filter Falsy Values From Array",
    "slug": "fjp-0045-filter-falsy-values-from-array",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Boolean Coercion",
      "Falsy"
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
    "problemStatement": "Remove all falsy values (`false`, `0`, `\"\"`, `null`, `undefined`, `NaN`) from array.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [0, 1, false, 2, \"\", 3]",
        "output": "[1, 2, 3]"
      }
    ],
    "starterCode": "function compactFalsy45(arr) {\n  // TODO\n}",
    "functionName": "compactFalsy45",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[0, 1, false, 2, \"\", 3]]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[null, undefined, 0]]",
        "expectedOutput": "[]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[true, \"ok\", 42]]",
        "expectedOutput": "[true, \"ok\", 42]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function compactFalsy45(arr) {\n  return arr.filter(Boolean);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `compactFalsy45` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0046",
    "number": 46,
    "title": "Safe Float Clamper and Rounder",
    "slug": "fjp-0046-safe-float-clamper-and-rounder",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math",
      "Precision",
      "Floating Point"
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
    "problemStatement": "Round floating point number `val` to `decimals` places accurately avoiding IEEE 754 precision issues.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = 1.005, decimals = 2",
        "output": "1.01"
      }
    ],
    "starterCode": "function clampFloatPrecision46(val, decimals) {\n  // TODO\n}",
    "functionName": "clampFloatPrecision46",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1.005, 2]",
        "expectedOutput": "1.01",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[3.14159, 3]",
        "expectedOutput": "3.142",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0.1 + 0.2, 1]",
        "expectedOutput": "0.3",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function clampFloatPrecision46(val, decimals) {\n  const factor = Math.pow(10, decimals);\n  return Math.round((val + Number.EPSILON) * factor) / factor;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `clampFloatPrecision46` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0047",
    "number": 47,
    "title": "Format Byte Size to Human Readable Units",
    "slug": "fjp-0047-format-byte-size-to-human-readable-units",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math.log",
      "Units",
      "Formatting"
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
    "problemStatement": "Convert numeric byte count into formatted string (e.g. \"500 B\", \"1 KB\", \"1.5 MB\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "bytes = 1024",
        "output": "\"1 KB\""
      }
    ],
    "starterCode": "function formatBytes47(bytes) {\n  // TODO\n}",
    "functionName": "formatBytes47",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[500]",
        "expectedOutput": "\"500 B\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[1024]",
        "expectedOutput": "\"1 KB\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1536]",
        "expectedOutput": "\"1.5 KB\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[1048576]",
        "expectedOutput": "\"1 MB\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function formatBytes47(bytes) {\n  if (bytes === 0) return \"0 B\";\n  const sizes = [\"B\", \"KB\", \"MB\", \"GB\", \"TB\"];\n  const i = Math.floor(Math.log(bytes) / Math.log(1024));\n  const val = bytes / Math.pow(1024, i);\n  const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1);\n  return formatted + \" \" + sizes[i];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `formatBytes47` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0048",
    "number": 48,
    "title": "Strict Boolean Value Normalizer",
    "slug": "fjp-0048-strict-boolean-value-normalizer",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Coercion",
      "Strings",
      "Booleans"
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
    "problemStatement": "Convert strings \"true\", \"1\", \"yes\", and numbers 1 / true to true; all other values to false (case-insensitive).",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = \"TRUE\"",
        "output": "true"
      }
    ],
    "starterCode": "function toStrictBoolean48(val) {\n  // TODO\n}",
    "functionName": "toStrictBoolean48",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"TRUE\"]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[\"no\"]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function toStrictBoolean48(val) {\n  if (val === true || val === 1) return true;\n  if (typeof val === \"string\") {\n    const s = val.trim().toLowerCase();\n    if ([\"true\", \"1\", \"yes\"].includes(s)) return true;\n  }\n  return false;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `toStrictBoolean48` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0049",
    "number": 49,
    "title": "Check Power of Two Bitwise Checker",
    "slug": "fjp-0049-check-power-of-two-bitwise-checker",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Bitwise",
      "Math"
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
    "problemStatement": "Determine if integer `n` is a positive power of two using bitwise operators.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "n = 16",
        "output": "true"
      }
    ],
    "starterCode": "function isPowerOfTwo49(n) {\n  // TODO\n}",
    "functionName": "isPowerOfTwo49",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[16]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[18]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[0]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isPowerOfTwo49(n) {\n  return n > 0 && (n & (n - 1)) === 0;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isPowerOfTwo49` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0050",
    "number": 50,
    "title": "Implement Object.is Polyfill (SameValue)",
    "slug": "fjp-0050-implement-object-is-polyfill-samevalue",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.is",
      "NaN",
      "+0/-0",
      "Strict Equality"
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
    "problemStatement": "Implement SameValue equality without using Object.is. Must distinguish +0 from -0 and treat NaN as equal to NaN.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "x = NaN, y = NaN",
        "output": "true"
      }
    ],
    "starterCode": "function isSameValue50(x, y) {\n  // TODO\n}",
    "functionName": "isSameValue50",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[NaN, NaN]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, -0]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"abc\", \"abc\"]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null, undefined]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isSameValue50(x, y) {\n  if (x === y) return x !== 0 || 1 / x === 1 / y;\n  return x !== x && y !== y;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isSameValue50` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0051",
    "number": 51,
    "title": "Comprehensive Exact Type Detector",
    "slug": "fjp-0051-comprehensive-exact-type-detector",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.prototype.toString",
      "Types"
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
    "problemStatement": "Return exact lowercase type string (e.g. \"null\", \"undefined\", \"array\", \"date\", \"regexp\", \"map\", \"set\", \"number\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = null",
        "output": "\"null\""
      }
    ],
    "starterCode": "function detectExactType51(val) {\n  // TODO\n}",
    "functionName": "detectExactType51",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[null]",
        "expectedOutput": "\"null\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "\"array\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[123]",
        "expectedOutput": "\"number\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[true]",
        "expectedOutput": "\"boolean\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function detectExactType51(val) {\n  if (val === null) return \"null\";\n  if (val === undefined) return \"undefined\";\n  const raw = Object.prototype.toString.call(val);\n  const match = raw.match(/\\[object\\s+(\\w+)\\]/);\n  return match ? match[1].toLowerCase() : typeof val;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `detectExactType51` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0052",
    "number": 52,
    "title": "Filter Falsy Values From Array",
    "slug": "fjp-0052-filter-falsy-values-from-array",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Boolean Coercion",
      "Falsy"
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
    "problemStatement": "Remove all falsy values (`false`, `0`, `\"\"`, `null`, `undefined`, `NaN`) from array.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [0, 1, false, 2, \"\", 3]",
        "output": "[1, 2, 3]"
      }
    ],
    "starterCode": "function compactFalsy52(arr) {\n  // TODO\n}",
    "functionName": "compactFalsy52",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[0, 1, false, 2, \"\", 3]]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[null, undefined, 0]]",
        "expectedOutput": "[]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[true, \"ok\", 42]]",
        "expectedOutput": "[true, \"ok\", 42]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function compactFalsy52(arr) {\n  return arr.filter(Boolean);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `compactFalsy52` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0053",
    "number": 53,
    "title": "Safe Float Clamper and Rounder",
    "slug": "fjp-0053-safe-float-clamper-and-rounder",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math",
      "Precision",
      "Floating Point"
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
    "problemStatement": "Round floating point number `val` to `decimals` places accurately avoiding IEEE 754 precision issues.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = 1.005, decimals = 2",
        "output": "1.01"
      }
    ],
    "starterCode": "function clampFloatPrecision53(val, decimals) {\n  // TODO\n}",
    "functionName": "clampFloatPrecision53",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1.005, 2]",
        "expectedOutput": "1.01",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[3.14159, 3]",
        "expectedOutput": "3.142",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0.1 + 0.2, 1]",
        "expectedOutput": "0.3",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function clampFloatPrecision53(val, decimals) {\n  const factor = Math.pow(10, decimals);\n  return Math.round((val + Number.EPSILON) * factor) / factor;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `clampFloatPrecision53` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0054",
    "number": 54,
    "title": "Format Byte Size to Human Readable Units",
    "slug": "fjp-0054-format-byte-size-to-human-readable-units",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math.log",
      "Units",
      "Formatting"
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
    "problemStatement": "Convert numeric byte count into formatted string (e.g. \"500 B\", \"1 KB\", \"1.5 MB\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "bytes = 1024",
        "output": "\"1 KB\""
      }
    ],
    "starterCode": "function formatBytes54(bytes) {\n  // TODO\n}",
    "functionName": "formatBytes54",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[500]",
        "expectedOutput": "\"500 B\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[1024]",
        "expectedOutput": "\"1 KB\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1536]",
        "expectedOutput": "\"1.5 KB\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[1048576]",
        "expectedOutput": "\"1 MB\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function formatBytes54(bytes) {\n  if (bytes === 0) return \"0 B\";\n  const sizes = [\"B\", \"KB\", \"MB\", \"GB\", \"TB\"];\n  const i = Math.floor(Math.log(bytes) / Math.log(1024));\n  const val = bytes / Math.pow(1024, i);\n  const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1);\n  return formatted + \" \" + sizes[i];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `formatBytes54` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0055",
    "number": 55,
    "title": "Strict Boolean Value Normalizer",
    "slug": "fjp-0055-strict-boolean-value-normalizer",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Coercion",
      "Strings",
      "Booleans"
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
    "problemStatement": "Convert strings \"true\", \"1\", \"yes\", and numbers 1 / true to true; all other values to false (case-insensitive).",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = \"TRUE\"",
        "output": "true"
      }
    ],
    "starterCode": "function toStrictBoolean55(val) {\n  // TODO\n}",
    "functionName": "toStrictBoolean55",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"TRUE\"]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[\"no\"]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function toStrictBoolean55(val) {\n  if (val === true || val === 1) return true;\n  if (typeof val === \"string\") {\n    const s = val.trim().toLowerCase();\n    if ([\"true\", \"1\", \"yes\"].includes(s)) return true;\n  }\n  return false;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `toStrictBoolean55` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0056",
    "number": 56,
    "title": "Check Power of Two Bitwise Checker",
    "slug": "fjp-0056-check-power-of-two-bitwise-checker",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Bitwise",
      "Math"
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
    "problemStatement": "Determine if integer `n` is a positive power of two using bitwise operators.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "n = 16",
        "output": "true"
      }
    ],
    "starterCode": "function isPowerOfTwo56(n) {\n  // TODO\n}",
    "functionName": "isPowerOfTwo56",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[16]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[18]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[0]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isPowerOfTwo56(n) {\n  return n > 0 && (n & (n - 1)) === 0;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isPowerOfTwo56` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0057",
    "number": 57,
    "title": "Implement Object.is Polyfill (SameValue)",
    "slug": "fjp-0057-implement-object-is-polyfill-samevalue",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.is",
      "NaN",
      "+0/-0",
      "Strict Equality"
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
    "problemStatement": "Implement SameValue equality without using Object.is. Must distinguish +0 from -0 and treat NaN as equal to NaN.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "x = NaN, y = NaN",
        "output": "true"
      }
    ],
    "starterCode": "function isSameValue57(x, y) {\n  // TODO\n}",
    "functionName": "isSameValue57",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[NaN, NaN]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, -0]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"abc\", \"abc\"]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null, undefined]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isSameValue57(x, y) {\n  if (x === y) return x !== 0 || 1 / x === 1 / y;\n  return x !== x && y !== y;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isSameValue57` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0058",
    "number": 58,
    "title": "Comprehensive Exact Type Detector",
    "slug": "fjp-0058-comprehensive-exact-type-detector",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.prototype.toString",
      "Types"
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
    "problemStatement": "Return exact lowercase type string (e.g. \"null\", \"undefined\", \"array\", \"date\", \"regexp\", \"map\", \"set\", \"number\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = null",
        "output": "\"null\""
      }
    ],
    "starterCode": "function detectExactType58(val) {\n  // TODO\n}",
    "functionName": "detectExactType58",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[null]",
        "expectedOutput": "\"null\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "\"array\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[123]",
        "expectedOutput": "\"number\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[true]",
        "expectedOutput": "\"boolean\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function detectExactType58(val) {\n  if (val === null) return \"null\";\n  if (val === undefined) return \"undefined\";\n  const raw = Object.prototype.toString.call(val);\n  const match = raw.match(/\\[object\\s+(\\w+)\\]/);\n  return match ? match[1].toLowerCase() : typeof val;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `detectExactType58` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0059",
    "number": 59,
    "title": "Filter Falsy Values From Array",
    "slug": "fjp-0059-filter-falsy-values-from-array",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Boolean Coercion",
      "Falsy"
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
    "problemStatement": "Remove all falsy values (`false`, `0`, `\"\"`, `null`, `undefined`, `NaN`) from array.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [0, 1, false, 2, \"\", 3]",
        "output": "[1, 2, 3]"
      }
    ],
    "starterCode": "function compactFalsy59(arr) {\n  // TODO\n}",
    "functionName": "compactFalsy59",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[0, 1, false, 2, \"\", 3]]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[null, undefined, 0]]",
        "expectedOutput": "[]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[true, \"ok\", 42]]",
        "expectedOutput": "[true, \"ok\", 42]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function compactFalsy59(arr) {\n  return arr.filter(Boolean);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `compactFalsy59` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0060",
    "number": 60,
    "title": "Safe Float Clamper and Rounder",
    "slug": "fjp-0060-safe-float-clamper-and-rounder",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math",
      "Precision",
      "Floating Point"
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
    "problemStatement": "Round floating point number `val` to `decimals` places accurately avoiding IEEE 754 precision issues.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = 1.005, decimals = 2",
        "output": "1.01"
      }
    ],
    "starterCode": "function clampFloatPrecision60(val, decimals) {\n  // TODO\n}",
    "functionName": "clampFloatPrecision60",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1.005, 2]",
        "expectedOutput": "1.01",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[3.14159, 3]",
        "expectedOutput": "3.142",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0.1 + 0.2, 1]",
        "expectedOutput": "0.3",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function clampFloatPrecision60(val, decimals) {\n  const factor = Math.pow(10, decimals);\n  return Math.round((val + Number.EPSILON) * factor) / factor;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `clampFloatPrecision60` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0061",
    "number": 61,
    "title": "Format Byte Size to Human Readable Units",
    "slug": "fjp-0061-format-byte-size-to-human-readable-units",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math.log",
      "Units",
      "Formatting"
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
    "problemStatement": "Convert numeric byte count into formatted string (e.g. \"500 B\", \"1 KB\", \"1.5 MB\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "bytes = 1024",
        "output": "\"1 KB\""
      }
    ],
    "starterCode": "function formatBytes61(bytes) {\n  // TODO\n}",
    "functionName": "formatBytes61",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[500]",
        "expectedOutput": "\"500 B\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[1024]",
        "expectedOutput": "\"1 KB\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1536]",
        "expectedOutput": "\"1.5 KB\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[1048576]",
        "expectedOutput": "\"1 MB\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function formatBytes61(bytes) {\n  if (bytes === 0) return \"0 B\";\n  const sizes = [\"B\", \"KB\", \"MB\", \"GB\", \"TB\"];\n  const i = Math.floor(Math.log(bytes) / Math.log(1024));\n  const val = bytes / Math.pow(1024, i);\n  const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1);\n  return formatted + \" \" + sizes[i];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `formatBytes61` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0062",
    "number": 62,
    "title": "Strict Boolean Value Normalizer",
    "slug": "fjp-0062-strict-boolean-value-normalizer",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Coercion",
      "Strings",
      "Booleans"
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
    "problemStatement": "Convert strings \"true\", \"1\", \"yes\", and numbers 1 / true to true; all other values to false (case-insensitive).",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = \"TRUE\"",
        "output": "true"
      }
    ],
    "starterCode": "function toStrictBoolean62(val) {\n  // TODO\n}",
    "functionName": "toStrictBoolean62",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"TRUE\"]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[\"no\"]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function toStrictBoolean62(val) {\n  if (val === true || val === 1) return true;\n  if (typeof val === \"string\") {\n    const s = val.trim().toLowerCase();\n    if ([\"true\", \"1\", \"yes\"].includes(s)) return true;\n  }\n  return false;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `toStrictBoolean62` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0063",
    "number": 63,
    "title": "Check Power of Two Bitwise Checker",
    "slug": "fjp-0063-check-power-of-two-bitwise-checker",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Bitwise",
      "Math"
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
    "problemStatement": "Determine if integer `n` is a positive power of two using bitwise operators.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "n = 16",
        "output": "true"
      }
    ],
    "starterCode": "function isPowerOfTwo63(n) {\n  // TODO\n}",
    "functionName": "isPowerOfTwo63",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[16]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[18]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[0]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isPowerOfTwo63(n) {\n  return n > 0 && (n & (n - 1)) === 0;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isPowerOfTwo63` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0064",
    "number": 64,
    "title": "Implement Object.is Polyfill (SameValue)",
    "slug": "fjp-0064-implement-object-is-polyfill-samevalue",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.is",
      "NaN",
      "+0/-0",
      "Strict Equality"
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
    "problemStatement": "Implement SameValue equality without using Object.is. Must distinguish +0 from -0 and treat NaN as equal to NaN.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "x = NaN, y = NaN",
        "output": "true"
      }
    ],
    "starterCode": "function isSameValue64(x, y) {\n  // TODO\n}",
    "functionName": "isSameValue64",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[NaN, NaN]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, -0]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"abc\", \"abc\"]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null, undefined]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isSameValue64(x, y) {\n  if (x === y) return x !== 0 || 1 / x === 1 / y;\n  return x !== x && y !== y;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isSameValue64` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.931Z",
    "updatedAt": "2026-09-10T04:07:54.931Z"
  },
  {
    "id": "FJP-0065",
    "number": 65,
    "title": "Comprehensive Exact Type Detector",
    "slug": "fjp-0065-comprehensive-exact-type-detector",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.prototype.toString",
      "Types"
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
    "problemStatement": "Return exact lowercase type string (e.g. \"null\", \"undefined\", \"array\", \"date\", \"regexp\", \"map\", \"set\", \"number\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = null",
        "output": "\"null\""
      }
    ],
    "starterCode": "function detectExactType65(val) {\n  // TODO\n}",
    "functionName": "detectExactType65",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[null]",
        "expectedOutput": "\"null\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "\"array\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[123]",
        "expectedOutput": "\"number\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[true]",
        "expectedOutput": "\"boolean\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function detectExactType65(val) {\n  if (val === null) return \"null\";\n  if (val === undefined) return \"undefined\";\n  const raw = Object.prototype.toString.call(val);\n  const match = raw.match(/\\[object\\s+(\\w+)\\]/);\n  return match ? match[1].toLowerCase() : typeof val;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `detectExactType65` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0066",
    "number": 66,
    "title": "Filter Falsy Values From Array",
    "slug": "fjp-0066-filter-falsy-values-from-array",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Boolean Coercion",
      "Falsy"
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
    "problemStatement": "Remove all falsy values (`false`, `0`, `\"\"`, `null`, `undefined`, `NaN`) from array.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [0, 1, false, 2, \"\", 3]",
        "output": "[1, 2, 3]"
      }
    ],
    "starterCode": "function compactFalsy66(arr) {\n  // TODO\n}",
    "functionName": "compactFalsy66",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[0, 1, false, 2, \"\", 3]]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[null, undefined, 0]]",
        "expectedOutput": "[]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[true, \"ok\", 42]]",
        "expectedOutput": "[true, \"ok\", 42]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function compactFalsy66(arr) {\n  return arr.filter(Boolean);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `compactFalsy66` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0067",
    "number": 67,
    "title": "Safe Float Clamper and Rounder",
    "slug": "fjp-0067-safe-float-clamper-and-rounder",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math",
      "Precision",
      "Floating Point"
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
    "problemStatement": "Round floating point number `val` to `decimals` places accurately avoiding IEEE 754 precision issues.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = 1.005, decimals = 2",
        "output": "1.01"
      }
    ],
    "starterCode": "function clampFloatPrecision67(val, decimals) {\n  // TODO\n}",
    "functionName": "clampFloatPrecision67",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1.005, 2]",
        "expectedOutput": "1.01",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[3.14159, 3]",
        "expectedOutput": "3.142",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0.1 + 0.2, 1]",
        "expectedOutput": "0.3",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function clampFloatPrecision67(val, decimals) {\n  const factor = Math.pow(10, decimals);\n  return Math.round((val + Number.EPSILON) * factor) / factor;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `clampFloatPrecision67` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0068",
    "number": 68,
    "title": "Format Byte Size to Human Readable Units",
    "slug": "fjp-0068-format-byte-size-to-human-readable-units",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math.log",
      "Units",
      "Formatting"
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
    "problemStatement": "Convert numeric byte count into formatted string (e.g. \"500 B\", \"1 KB\", \"1.5 MB\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "bytes = 1024",
        "output": "\"1 KB\""
      }
    ],
    "starterCode": "function formatBytes68(bytes) {\n  // TODO\n}",
    "functionName": "formatBytes68",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[500]",
        "expectedOutput": "\"500 B\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[1024]",
        "expectedOutput": "\"1 KB\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1536]",
        "expectedOutput": "\"1.5 KB\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[1048576]",
        "expectedOutput": "\"1 MB\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function formatBytes68(bytes) {\n  if (bytes === 0) return \"0 B\";\n  const sizes = [\"B\", \"KB\", \"MB\", \"GB\", \"TB\"];\n  const i = Math.floor(Math.log(bytes) / Math.log(1024));\n  const val = bytes / Math.pow(1024, i);\n  const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1);\n  return formatted + \" \" + sizes[i];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `formatBytes68` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0069",
    "number": 69,
    "title": "Strict Boolean Value Normalizer",
    "slug": "fjp-0069-strict-boolean-value-normalizer",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Coercion",
      "Strings",
      "Booleans"
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
    "problemStatement": "Convert strings \"true\", \"1\", \"yes\", and numbers 1 / true to true; all other values to false (case-insensitive).",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = \"TRUE\"",
        "output": "true"
      }
    ],
    "starterCode": "function toStrictBoolean69(val) {\n  // TODO\n}",
    "functionName": "toStrictBoolean69",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"TRUE\"]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[\"no\"]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function toStrictBoolean69(val) {\n  if (val === true || val === 1) return true;\n  if (typeof val === \"string\") {\n    const s = val.trim().toLowerCase();\n    if ([\"true\", \"1\", \"yes\"].includes(s)) return true;\n  }\n  return false;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `toStrictBoolean69` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0070",
    "number": 70,
    "title": "Check Power of Two Bitwise Checker",
    "slug": "fjp-0070-check-power-of-two-bitwise-checker",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Bitwise",
      "Math"
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
    "problemStatement": "Determine if integer `n` is a positive power of two using bitwise operators.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "n = 16",
        "output": "true"
      }
    ],
    "starterCode": "function isPowerOfTwo70(n) {\n  // TODO\n}",
    "functionName": "isPowerOfTwo70",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[16]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[18]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[0]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isPowerOfTwo70(n) {\n  return n > 0 && (n & (n - 1)) === 0;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isPowerOfTwo70` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0071",
    "number": 71,
    "title": "Implement Object.is Polyfill (SameValue)",
    "slug": "fjp-0071-implement-object-is-polyfill-samevalue",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.is",
      "NaN",
      "+0/-0",
      "Strict Equality"
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
    "problemStatement": "Implement SameValue equality without using Object.is. Must distinguish +0 from -0 and treat NaN as equal to NaN.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "x = NaN, y = NaN",
        "output": "true"
      }
    ],
    "starterCode": "function isSameValue71(x, y) {\n  // TODO\n}",
    "functionName": "isSameValue71",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[NaN, NaN]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, -0]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"abc\", \"abc\"]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null, undefined]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isSameValue71(x, y) {\n  if (x === y) return x !== 0 || 1 / x === 1 / y;\n  return x !== x && y !== y;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isSameValue71` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0072",
    "number": 72,
    "title": "Comprehensive Exact Type Detector",
    "slug": "fjp-0072-comprehensive-exact-type-detector",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.prototype.toString",
      "Types"
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
    "problemStatement": "Return exact lowercase type string (e.g. \"null\", \"undefined\", \"array\", \"date\", \"regexp\", \"map\", \"set\", \"number\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = null",
        "output": "\"null\""
      }
    ],
    "starterCode": "function detectExactType72(val) {\n  // TODO\n}",
    "functionName": "detectExactType72",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[null]",
        "expectedOutput": "\"null\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "\"array\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[123]",
        "expectedOutput": "\"number\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[true]",
        "expectedOutput": "\"boolean\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function detectExactType72(val) {\n  if (val === null) return \"null\";\n  if (val === undefined) return \"undefined\";\n  const raw = Object.prototype.toString.call(val);\n  const match = raw.match(/\\[object\\s+(\\w+)\\]/);\n  return match ? match[1].toLowerCase() : typeof val;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `detectExactType72` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0073",
    "number": 73,
    "title": "Filter Falsy Values From Array",
    "slug": "fjp-0073-filter-falsy-values-from-array",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Boolean Coercion",
      "Falsy"
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
    "problemStatement": "Remove all falsy values (`false`, `0`, `\"\"`, `null`, `undefined`, `NaN`) from array.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [0, 1, false, 2, \"\", 3]",
        "output": "[1, 2, 3]"
      }
    ],
    "starterCode": "function compactFalsy73(arr) {\n  // TODO\n}",
    "functionName": "compactFalsy73",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[0, 1, false, 2, \"\", 3]]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[null, undefined, 0]]",
        "expectedOutput": "[]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[true, \"ok\", 42]]",
        "expectedOutput": "[true, \"ok\", 42]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function compactFalsy73(arr) {\n  return arr.filter(Boolean);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `compactFalsy73` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0074",
    "number": 74,
    "title": "Safe Float Clamper and Rounder",
    "slug": "fjp-0074-safe-float-clamper-and-rounder",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math",
      "Precision",
      "Floating Point"
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
    "problemStatement": "Round floating point number `val` to `decimals` places accurately avoiding IEEE 754 precision issues.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = 1.005, decimals = 2",
        "output": "1.01"
      }
    ],
    "starterCode": "function clampFloatPrecision74(val, decimals) {\n  // TODO\n}",
    "functionName": "clampFloatPrecision74",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1.005, 2]",
        "expectedOutput": "1.01",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[3.14159, 3]",
        "expectedOutput": "3.142",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0.1 + 0.2, 1]",
        "expectedOutput": "0.3",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function clampFloatPrecision74(val, decimals) {\n  const factor = Math.pow(10, decimals);\n  return Math.round((val + Number.EPSILON) * factor) / factor;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `clampFloatPrecision74` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0075",
    "number": 75,
    "title": "Format Byte Size to Human Readable Units",
    "slug": "fjp-0075-format-byte-size-to-human-readable-units",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Medium",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math.log",
      "Units",
      "Formatting"
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
    "problemStatement": "Convert numeric byte count into formatted string (e.g. \"500 B\", \"1 KB\", \"1.5 MB\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "bytes = 1024",
        "output": "\"1 KB\""
      }
    ],
    "starterCode": "function formatBytes75(bytes) {\n  // TODO\n}",
    "functionName": "formatBytes75",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[500]",
        "expectedOutput": "\"500 B\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[1024]",
        "expectedOutput": "\"1 KB\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1536]",
        "expectedOutput": "\"1.5 KB\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[1048576]",
        "expectedOutput": "\"1 MB\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function formatBytes75(bytes) {\n  if (bytes === 0) return \"0 B\";\n  const sizes = [\"B\", \"KB\", \"MB\", \"GB\", \"TB\"];\n  const i = Math.floor(Math.log(bytes) / Math.log(1024));\n  const val = bytes / Math.pow(1024, i);\n  const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1);\n  return formatted + \" \" + sizes[i];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `formatBytes75` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0076",
    "number": 76,
    "title": "Strict Boolean Value Normalizer",
    "slug": "fjp-0076-strict-boolean-value-normalizer",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Coercion",
      "Strings",
      "Booleans"
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
    "problemStatement": "Convert strings \"true\", \"1\", \"yes\", and numbers 1 / true to true; all other values to false (case-insensitive).",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = \"TRUE\"",
        "output": "true"
      }
    ],
    "starterCode": "function toStrictBoolean76(val) {\n  // TODO\n}",
    "functionName": "toStrictBoolean76",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"TRUE\"]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[\"no\"]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function toStrictBoolean76(val) {\n  if (val === true || val === 1) return true;\n  if (typeof val === \"string\") {\n    const s = val.trim().toLowerCase();\n    if ([\"true\", \"1\", \"yes\"].includes(s)) return true;\n  }\n  return false;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `toStrictBoolean76` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0077",
    "number": 77,
    "title": "Check Power of Two Bitwise Checker",
    "slug": "fjp-0077-check-power-of-two-bitwise-checker",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Bitwise",
      "Math"
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
    "problemStatement": "Determine if integer `n` is a positive power of two using bitwise operators.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "n = 16",
        "output": "true"
      }
    ],
    "starterCode": "function isPowerOfTwo77(n) {\n  // TODO\n}",
    "functionName": "isPowerOfTwo77",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[16]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[18]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[0]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isPowerOfTwo77(n) {\n  return n > 0 && (n & (n - 1)) === 0;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isPowerOfTwo77` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0078",
    "number": 78,
    "title": "Implement Object.is Polyfill (SameValue)",
    "slug": "fjp-0078-implement-object-is-polyfill-samevalue",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.is",
      "NaN",
      "+0/-0",
      "Strict Equality"
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
    "problemStatement": "Implement SameValue equality without using Object.is. Must distinguish +0 from -0 and treat NaN as equal to NaN.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "x = NaN, y = NaN",
        "output": "true"
      }
    ],
    "starterCode": "function isSameValue78(x, y) {\n  // TODO\n}",
    "functionName": "isSameValue78",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[NaN, NaN]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, -0]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"abc\", \"abc\"]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null, undefined]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isSameValue78(x, y) {\n  if (x === y) return x !== 0 || 1 / x === 1 / y;\n  return x !== x && y !== y;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isSameValue78` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0079",
    "number": 79,
    "title": "Comprehensive Exact Type Detector",
    "slug": "fjp-0079-comprehensive-exact-type-detector",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.prototype.toString",
      "Types"
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
    "problemStatement": "Return exact lowercase type string (e.g. \"null\", \"undefined\", \"array\", \"date\", \"regexp\", \"map\", \"set\", \"number\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = null",
        "output": "\"null\""
      }
    ],
    "starterCode": "function detectExactType79(val) {\n  // TODO\n}",
    "functionName": "detectExactType79",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[null]",
        "expectedOutput": "\"null\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "\"array\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[123]",
        "expectedOutput": "\"number\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[true]",
        "expectedOutput": "\"boolean\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function detectExactType79(val) {\n  if (val === null) return \"null\";\n  if (val === undefined) return \"undefined\";\n  const raw = Object.prototype.toString.call(val);\n  const match = raw.match(/\\[object\\s+(\\w+)\\]/);\n  return match ? match[1].toLowerCase() : typeof val;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `detectExactType79` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0080",
    "number": 80,
    "title": "Filter Falsy Values From Array",
    "slug": "fjp-0080-filter-falsy-values-from-array",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Boolean Coercion",
      "Falsy"
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
    "problemStatement": "Remove all falsy values (`false`, `0`, `\"\"`, `null`, `undefined`, `NaN`) from array.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [0, 1, false, 2, \"\", 3]",
        "output": "[1, 2, 3]"
      }
    ],
    "starterCode": "function compactFalsy80(arr) {\n  // TODO\n}",
    "functionName": "compactFalsy80",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[0, 1, false, 2, \"\", 3]]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[null, undefined, 0]]",
        "expectedOutput": "[]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[true, \"ok\", 42]]",
        "expectedOutput": "[true, \"ok\", 42]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function compactFalsy80(arr) {\n  return arr.filter(Boolean);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `compactFalsy80` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0081",
    "number": 81,
    "title": "Safe Float Clamper and Rounder",
    "slug": "fjp-0081-safe-float-clamper-and-rounder",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math",
      "Precision",
      "Floating Point"
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
    "problemStatement": "Round floating point number `val` to `decimals` places accurately avoiding IEEE 754 precision issues.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = 1.005, decimals = 2",
        "output": "1.01"
      }
    ],
    "starterCode": "function clampFloatPrecision81(val, decimals) {\n  // TODO\n}",
    "functionName": "clampFloatPrecision81",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1.005, 2]",
        "expectedOutput": "1.01",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[3.14159, 3]",
        "expectedOutput": "3.142",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0.1 + 0.2, 1]",
        "expectedOutput": "0.3",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function clampFloatPrecision81(val, decimals) {\n  const factor = Math.pow(10, decimals);\n  return Math.round((val + Number.EPSILON) * factor) / factor;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `clampFloatPrecision81` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0082",
    "number": 82,
    "title": "Format Byte Size to Human Readable Units",
    "slug": "fjp-0082-format-byte-size-to-human-readable-units",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math.log",
      "Units",
      "Formatting"
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
    "problemStatement": "Convert numeric byte count into formatted string (e.g. \"500 B\", \"1 KB\", \"1.5 MB\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "bytes = 1024",
        "output": "\"1 KB\""
      }
    ],
    "starterCode": "function formatBytes82(bytes) {\n  // TODO\n}",
    "functionName": "formatBytes82",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[500]",
        "expectedOutput": "\"500 B\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[1024]",
        "expectedOutput": "\"1 KB\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1536]",
        "expectedOutput": "\"1.5 KB\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[1048576]",
        "expectedOutput": "\"1 MB\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function formatBytes82(bytes) {\n  if (bytes === 0) return \"0 B\";\n  const sizes = [\"B\", \"KB\", \"MB\", \"GB\", \"TB\"];\n  const i = Math.floor(Math.log(bytes) / Math.log(1024));\n  const val = bytes / Math.pow(1024, i);\n  const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1);\n  return formatted + \" \" + sizes[i];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `formatBytes82` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0083",
    "number": 83,
    "title": "Strict Boolean Value Normalizer",
    "slug": "fjp-0083-strict-boolean-value-normalizer",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Coercion",
      "Strings",
      "Booleans"
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
    "problemStatement": "Convert strings \"true\", \"1\", \"yes\", and numbers 1 / true to true; all other values to false (case-insensitive).",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = \"TRUE\"",
        "output": "true"
      }
    ],
    "starterCode": "function toStrictBoolean83(val) {\n  // TODO\n}",
    "functionName": "toStrictBoolean83",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"TRUE\"]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[\"no\"]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function toStrictBoolean83(val) {\n  if (val === true || val === 1) return true;\n  if (typeof val === \"string\") {\n    const s = val.trim().toLowerCase();\n    if ([\"true\", \"1\", \"yes\"].includes(s)) return true;\n  }\n  return false;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `toStrictBoolean83` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0084",
    "number": 84,
    "title": "Check Power of Two Bitwise Checker",
    "slug": "fjp-0084-check-power-of-two-bitwise-checker",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Bitwise",
      "Math"
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
    "problemStatement": "Determine if integer `n` is a positive power of two using bitwise operators.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "n = 16",
        "output": "true"
      }
    ],
    "starterCode": "function isPowerOfTwo84(n) {\n  // TODO\n}",
    "functionName": "isPowerOfTwo84",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[16]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[18]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[0]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isPowerOfTwo84(n) {\n  return n > 0 && (n & (n - 1)) === 0;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isPowerOfTwo84` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0085",
    "number": 85,
    "title": "Implement Object.is Polyfill (SameValue)",
    "slug": "fjp-0085-implement-object-is-polyfill-samevalue",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.is",
      "NaN",
      "+0/-0",
      "Strict Equality"
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
    "problemStatement": "Implement SameValue equality without using Object.is. Must distinguish +0 from -0 and treat NaN as equal to NaN.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "x = NaN, y = NaN",
        "output": "true"
      }
    ],
    "starterCode": "function isSameValue85(x, y) {\n  // TODO\n}",
    "functionName": "isSameValue85",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[NaN, NaN]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, -0]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"abc\", \"abc\"]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null, undefined]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isSameValue85(x, y) {\n  if (x === y) return x !== 0 || 1 / x === 1 / y;\n  return x !== x && y !== y;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isSameValue85` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0086",
    "number": 86,
    "title": "Comprehensive Exact Type Detector",
    "slug": "fjp-0086-comprehensive-exact-type-detector",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.prototype.toString",
      "Types"
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
    "problemStatement": "Return exact lowercase type string (e.g. \"null\", \"undefined\", \"array\", \"date\", \"regexp\", \"map\", \"set\", \"number\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = null",
        "output": "\"null\""
      }
    ],
    "starterCode": "function detectExactType86(val) {\n  // TODO\n}",
    "functionName": "detectExactType86",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[null]",
        "expectedOutput": "\"null\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "\"array\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[123]",
        "expectedOutput": "\"number\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[true]",
        "expectedOutput": "\"boolean\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function detectExactType86(val) {\n  if (val === null) return \"null\";\n  if (val === undefined) return \"undefined\";\n  const raw = Object.prototype.toString.call(val);\n  const match = raw.match(/\\[object\\s+(\\w+)\\]/);\n  return match ? match[1].toLowerCase() : typeof val;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `detectExactType86` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0087",
    "number": 87,
    "title": "Filter Falsy Values From Array",
    "slug": "fjp-0087-filter-falsy-values-from-array",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Boolean Coercion",
      "Falsy"
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
    "problemStatement": "Remove all falsy values (`false`, `0`, `\"\"`, `null`, `undefined`, `NaN`) from array.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [0, 1, false, 2, \"\", 3]",
        "output": "[1, 2, 3]"
      }
    ],
    "starterCode": "function compactFalsy87(arr) {\n  // TODO\n}",
    "functionName": "compactFalsy87",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[0, 1, false, 2, \"\", 3]]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[null, undefined, 0]]",
        "expectedOutput": "[]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[true, \"ok\", 42]]",
        "expectedOutput": "[true, \"ok\", 42]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function compactFalsy87(arr) {\n  return arr.filter(Boolean);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `compactFalsy87` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0088",
    "number": 88,
    "title": "Safe Float Clamper and Rounder",
    "slug": "fjp-0088-safe-float-clamper-and-rounder",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math",
      "Precision",
      "Floating Point"
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
    "problemStatement": "Round floating point number `val` to `decimals` places accurately avoiding IEEE 754 precision issues.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = 1.005, decimals = 2",
        "output": "1.01"
      }
    ],
    "starterCode": "function clampFloatPrecision88(val, decimals) {\n  // TODO\n}",
    "functionName": "clampFloatPrecision88",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1.005, 2]",
        "expectedOutput": "1.01",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[3.14159, 3]",
        "expectedOutput": "3.142",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0.1 + 0.2, 1]",
        "expectedOutput": "0.3",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function clampFloatPrecision88(val, decimals) {\n  const factor = Math.pow(10, decimals);\n  return Math.round((val + Number.EPSILON) * factor) / factor;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `clampFloatPrecision88` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0089",
    "number": 89,
    "title": "Format Byte Size to Human Readable Units",
    "slug": "fjp-0089-format-byte-size-to-human-readable-units",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math.log",
      "Units",
      "Formatting"
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
    "problemStatement": "Convert numeric byte count into formatted string (e.g. \"500 B\", \"1 KB\", \"1.5 MB\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "bytes = 1024",
        "output": "\"1 KB\""
      }
    ],
    "starterCode": "function formatBytes89(bytes) {\n  // TODO\n}",
    "functionName": "formatBytes89",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[500]",
        "expectedOutput": "\"500 B\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[1024]",
        "expectedOutput": "\"1 KB\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1536]",
        "expectedOutput": "\"1.5 KB\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[1048576]",
        "expectedOutput": "\"1 MB\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function formatBytes89(bytes) {\n  if (bytes === 0) return \"0 B\";\n  const sizes = [\"B\", \"KB\", \"MB\", \"GB\", \"TB\"];\n  const i = Math.floor(Math.log(bytes) / Math.log(1024));\n  const val = bytes / Math.pow(1024, i);\n  const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1);\n  return formatted + \" \" + sizes[i];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `formatBytes89` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0090",
    "number": 90,
    "title": "Strict Boolean Value Normalizer",
    "slug": "fjp-0090-strict-boolean-value-normalizer",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Coercion",
      "Strings",
      "Booleans"
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
    "problemStatement": "Convert strings \"true\", \"1\", \"yes\", and numbers 1 / true to true; all other values to false (case-insensitive).",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = \"TRUE\"",
        "output": "true"
      }
    ],
    "starterCode": "function toStrictBoolean90(val) {\n  // TODO\n}",
    "functionName": "toStrictBoolean90",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"TRUE\"]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[\"no\"]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function toStrictBoolean90(val) {\n  if (val === true || val === 1) return true;\n  if (typeof val === \"string\") {\n    const s = val.trim().toLowerCase();\n    if ([\"true\", \"1\", \"yes\"].includes(s)) return true;\n  }\n  return false;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `toStrictBoolean90` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0091",
    "number": 91,
    "title": "Check Power of Two Bitwise Checker",
    "slug": "fjp-0091-check-power-of-two-bitwise-checker",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Bitwise",
      "Math"
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
    "problemStatement": "Determine if integer `n` is a positive power of two using bitwise operators.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "n = 16",
        "output": "true"
      }
    ],
    "starterCode": "function isPowerOfTwo91(n) {\n  // TODO\n}",
    "functionName": "isPowerOfTwo91",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[16]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[18]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[0]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isPowerOfTwo91(n) {\n  return n > 0 && (n & (n - 1)) === 0;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isPowerOfTwo91` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0092",
    "number": 92,
    "title": "Implement Object.is Polyfill (SameValue)",
    "slug": "fjp-0092-implement-object-is-polyfill-samevalue",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.is",
      "NaN",
      "+0/-0",
      "Strict Equality"
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
    "problemStatement": "Implement SameValue equality without using Object.is. Must distinguish +0 from -0 and treat NaN as equal to NaN.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "x = NaN, y = NaN",
        "output": "true"
      }
    ],
    "starterCode": "function isSameValue92(x, y) {\n  // TODO\n}",
    "functionName": "isSameValue92",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[NaN, NaN]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, -0]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"abc\", \"abc\"]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null, undefined]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isSameValue92(x, y) {\n  if (x === y) return x !== 0 || 1 / x === 1 / y;\n  return x !== x && y !== y;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isSameValue92` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0093",
    "number": 93,
    "title": "Comprehensive Exact Type Detector",
    "slug": "fjp-0093-comprehensive-exact-type-detector",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.prototype.toString",
      "Types"
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
    "problemStatement": "Return exact lowercase type string (e.g. \"null\", \"undefined\", \"array\", \"date\", \"regexp\", \"map\", \"set\", \"number\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = null",
        "output": "\"null\""
      }
    ],
    "starterCode": "function detectExactType93(val) {\n  // TODO\n}",
    "functionName": "detectExactType93",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[null]",
        "expectedOutput": "\"null\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "\"array\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[123]",
        "expectedOutput": "\"number\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[true]",
        "expectedOutput": "\"boolean\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function detectExactType93(val) {\n  if (val === null) return \"null\";\n  if (val === undefined) return \"undefined\";\n  const raw = Object.prototype.toString.call(val);\n  const match = raw.match(/\\[object\\s+(\\w+)\\]/);\n  return match ? match[1].toLowerCase() : typeof val;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `detectExactType93` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0094",
    "number": 94,
    "title": "Filter Falsy Values From Array",
    "slug": "fjp-0094-filter-falsy-values-from-array",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Boolean Coercion",
      "Falsy"
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
    "problemStatement": "Remove all falsy values (`false`, `0`, `\"\"`, `null`, `undefined`, `NaN`) from array.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "arr = [0, 1, false, 2, \"\", 3]",
        "output": "[1, 2, 3]"
      }
    ],
    "starterCode": "function compactFalsy94(arr) {\n  // TODO\n}",
    "functionName": "compactFalsy94",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[[0, 1, false, 2, \"\", 3]]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[null, undefined, 0]]",
        "expectedOutput": "[]",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[[true, \"ok\", 42]]",
        "expectedOutput": "[true, \"ok\", 42]",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function compactFalsy94(arr) {\n  return arr.filter(Boolean);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `compactFalsy94` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0095",
    "number": 95,
    "title": "Safe Float Clamper and Rounder",
    "slug": "fjp-0095-safe-float-clamper-and-rounder",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math",
      "Precision",
      "Floating Point"
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
    "problemStatement": "Round floating point number `val` to `decimals` places accurately avoiding IEEE 754 precision issues.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = 1.005, decimals = 2",
        "output": "1.01"
      }
    ],
    "starterCode": "function clampFloatPrecision95(val, decimals) {\n  // TODO\n}",
    "functionName": "clampFloatPrecision95",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[1.005, 2]",
        "expectedOutput": "1.01",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[3.14159, 3]",
        "expectedOutput": "3.142",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0.1 + 0.2, 1]",
        "expectedOutput": "0.3",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function clampFloatPrecision95(val, decimals) {\n  const factor = Math.pow(10, decimals);\n  return Math.round((val + Number.EPSILON) * factor) / factor;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `clampFloatPrecision95` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0096",
    "number": 96,
    "title": "Format Byte Size to Human Readable Units",
    "slug": "fjp-0096-format-byte-size-to-human-readable-units",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Math.log",
      "Units",
      "Formatting"
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
    "problemStatement": "Convert numeric byte count into formatted string (e.g. \"500 B\", \"1 KB\", \"1.5 MB\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "bytes = 1024",
        "output": "\"1 KB\""
      }
    ],
    "starterCode": "function formatBytes96(bytes) {\n  // TODO\n}",
    "functionName": "formatBytes96",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[500]",
        "expectedOutput": "\"500 B\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[1024]",
        "expectedOutput": "\"1 KB\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1536]",
        "expectedOutput": "\"1.5 KB\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[1048576]",
        "expectedOutput": "\"1 MB\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function formatBytes96(bytes) {\n  if (bytes === 0) return \"0 B\";\n  const sizes = [\"B\", \"KB\", \"MB\", \"GB\", \"TB\"];\n  const i = Math.floor(Math.log(bytes) / Math.log(1024));\n  const val = bytes / Math.pow(1024, i);\n  const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1);\n  return formatted + \" \" + sizes[i];\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `formatBytes96` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0097",
    "number": 97,
    "title": "Strict Boolean Value Normalizer",
    "slug": "fjp-0097-strict-boolean-value-normalizer",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Coercion",
      "Strings",
      "Booleans"
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
    "problemStatement": "Convert strings \"true\", \"1\", \"yes\", and numbers 1 / true to true; all other values to false (case-insensitive).",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = \"TRUE\"",
        "output": "true"
      }
    ],
    "starterCode": "function toStrictBoolean97(val) {\n  // TODO\n}",
    "functionName": "toStrictBoolean97",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"TRUE\"]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[\"no\"]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function toStrictBoolean97(val) {\n  if (val === true || val === 1) return true;\n  if (typeof val === \"string\") {\n    const s = val.trim().toLowerCase();\n    if ([\"true\", \"1\", \"yes\"].includes(s)) return true;\n  }\n  return false;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `toStrictBoolean97` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.932Z",
    "updatedAt": "2026-09-10T04:07:54.932Z"
  },
  {
    "id": "FJP-0098",
    "number": 98,
    "title": "Check Power of Two Bitwise Checker",
    "slug": "fjp-0098-check-power-of-two-bitwise-checker",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Bitwise",
      "Math"
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
    "problemStatement": "Determine if integer `n` is a positive power of two using bitwise operators.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "n = 16",
        "output": "true"
      }
    ],
    "starterCode": "function isPowerOfTwo98(n) {\n  // TODO\n}",
    "functionName": "isPowerOfTwo98",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[16]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[18]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[1]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[0]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isPowerOfTwo98(n) {\n  return n > 0 && (n & (n - 1)) === 0;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isPowerOfTwo98` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.933Z",
    "updatedAt": "2026-09-10T04:07:54.933Z"
  },
  {
    "id": "FJP-0099",
    "number": 99,
    "title": "Implement Object.is Polyfill (SameValue)",
    "slug": "fjp-0099-implement-object-is-polyfill-samevalue",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.is",
      "NaN",
      "+0/-0",
      "Strict Equality"
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
    "problemStatement": "Implement SameValue equality without using Object.is. Must distinguish +0 from -0 and treat NaN as equal to NaN.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "x = NaN, y = NaN",
        "output": "true"
      }
    ],
    "starterCode": "function isSameValue99(x, y) {\n  // TODO\n}",
    "functionName": "isSameValue99",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[NaN, NaN]",
        "expectedOutput": "true",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[0, -0]",
        "expectedOutput": "false",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"abc\", \"abc\"]",
        "expectedOutput": "true",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[null, undefined]",
        "expectedOutput": "false",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function isSameValue99(x, y) {\n  if (x === y) return x !== 0 || 1 / x === 1 / y;\n  return x !== x && y !== y;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `isSameValue99` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.933Z",
    "updatedAt": "2026-09-10T04:07:54.933Z"
  },
  {
    "id": "FJP-0100",
    "number": 100,
    "title": "Comprehensive Exact Type Detector",
    "slug": "fjp-0100-comprehensive-exact-type-detector",
    "category": "Fundamentals",
    "subcategory": "Types, Coercion, Equality & Primitives",
    "difficulty": "Hard",
    "frontendTopic": "Core JavaScript Fundamentals & Type Mechanics",
    "javascriptConcepts": [
      "Object.prototype.toString",
      "Types"
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
    "problemStatement": "Return exact lowercase type string (e.g. \"null\", \"undefined\", \"array\", \"date\", \"regexp\", \"map\", \"set\", \"number\").",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "val = null",
        "output": "\"null\""
      }
    ],
    "starterCode": "function detectExactType100(val) {\n  // TODO\n}",
    "functionName": "detectExactType100",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[null]",
        "expectedOutput": "\"null\"",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "\"array\"",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[123]",
        "expectedOutput": "\"number\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      },
      {
        "id": "htc_2",
        "input": "[true]",
        "expectedOutput": "\"boolean\"",
        "isHidden": true,
        "description": "Hidden test case 2"
      }
    ],
    "solution": "function detectExactType100(val) {\n  if (val === null) return \"null\";\n  if (val === undefined) return \"undefined\";\n  const raw = Object.prototype.toString.call(val);\n  const match = raw.match(/\\[object\\s+(\\w+)\\]/);\n  return match ? match[1].toLowerCase() : typeof val;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `detectExactType100` to fulfill the contract with standard JavaScript performance guarantees.",
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
    "createdAt": "2026-09-10T04:07:54.933Z",
    "updatedAt": "2026-09-10T04:07:54.933Z"
  }
];
