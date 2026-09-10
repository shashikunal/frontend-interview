// Batch 2: Questions 101 to 200
import type { FrontendJsQuestion } from '../frontendJsTypes';

export const fjpBatch2: FrontendJsQuestion[] = [
  {
    "id": "FJP-0101",
    "number": 101,
    "title": "Implement Debounce with Immediate Flag",
    "slug": "fjp-0101-implement-debounce-with-immediate-flag",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Timers",
      "Debounce"
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
    "problemStatement": "Implement a debounce function returning a wrapped function that delays execution until after `wait` milliseconds. If `immediate` is true, invoke on the leading edge.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "wait = 100",
        "output": "Function"
      }
    ],
    "starterCode": "function debounce101(fn, wait, immediate) {\n  // TODO\n}",
    "functionName": "debounce101",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){ return x * 2; }, 50, false]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(){ return 42; }, 10, true]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(){}, 100]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function debounce101(fn, wait, immediate) {\n  let timer = null;\n  return function(...args) {\n    const callNow = immediate && !timer;\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      timer = null;\n      if (!immediate) fn.apply(this, args);\n    }, wait);\n    if (callNow) fn.apply(this, args);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `debounce101` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0102",
    "number": 102,
    "title": "Curry Function with Arity Support",
    "slug": "fjp-0102-curry-function-with-arity-support",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Currying",
      "Closures",
      "Function.length"
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
    "problemStatement": "Implement a `curry` function that transforms a multi-argument function into a curried series of unary/partial applications based on `fn.length`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b, c) => a + b + c",
        "output": "curried(1)(2)(3) === 6"
      }
    ],
    "starterCode": "function curry102(fn) {\n  // TODO\n}",
    "functionName": "curry102",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(a, b, c){ return a * b * c; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function curry102(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...args2) {\n      return curried.apply(this, args.concat(args2));\n    };\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `curry102` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0103",
    "number": 103,
    "title": "Function Pipeline Compose and Pipe",
    "slug": "fjp-0103-function-pipeline-compose-and-pipe",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Higher-Order Functions",
      "Composition",
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
    "problemStatement": "Implement `pipe` which performs left-to-right function composition, passing the output of each function as input to the next.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fns = [x => x + 1, x => x * 2], val = 5",
        "output": "12"
      }
    ],
    "starterCode": "function pipe103(...fns) {\n  // TODO\n}",
    "functionName": "pipe103",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){return x + 1;}, function(x){return x * 2;}]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function pipe103(...fns) {\n  return function(initial) {\n    return fns.reduce((acc, fn) => fn(acc), initial);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `pipe103` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0104",
    "number": 104,
    "title": "Memoize Function with Resolver",
    "slug": "fjp-0104-memoize-function-with-resolver",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Memoization",
      "Caching",
      "Closures"
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
    "problemStatement": "Implement a memoize utility that caches function results. Accepts an optional custom `resolver` function to derive cache keys.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b) => a + b",
        "output": "Memoized function"
      }
    ],
    "starterCode": "function memoize104(fn, resolver) {\n  // TODO\n}",
    "functionName": "memoize104",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x * x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function memoize104(fn, resolver) {\n  const cache = new Map();\n  return function(...args) {\n    const key = resolver ? resolver(...args) : JSON.stringify(args);\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    const res = fn.apply(this, args);\n    cache.set(key, res);\n    return res;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `memoize104` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0105",
    "number": 105,
    "title": "Invoke Function Once",
    "slug": "fjp-0105-invoke-function-once",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Once Pattern"
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
    "problemStatement": "Create a function that is restricted to invoking `fn` once. Subsequent calls return the result of the first invocation.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => 42",
        "output": "First: 42, Second: 42"
      }
    ],
    "starterCode": "function once105(fn) {\n  // TODO\n}",
    "functionName": "once105",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return 100; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x + 5; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function once105(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) {\n      called = true;\n      result = fn.apply(this, args);\n    }\n    return result;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `once105` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0106",
    "number": 106,
    "title": "Implement Debounce with Immediate Flag",
    "slug": "fjp-0106-implement-debounce-with-immediate-flag",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Timers",
      "Debounce"
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
    "problemStatement": "Implement a debounce function returning a wrapped function that delays execution until after `wait` milliseconds. If `immediate` is true, invoke on the leading edge.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "wait = 100",
        "output": "Function"
      }
    ],
    "starterCode": "function debounce106(fn, wait, immediate) {\n  // TODO\n}",
    "functionName": "debounce106",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){ return x * 2; }, 50, false]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(){ return 42; }, 10, true]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(){}, 100]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function debounce106(fn, wait, immediate) {\n  let timer = null;\n  return function(...args) {\n    const callNow = immediate && !timer;\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      timer = null;\n      if (!immediate) fn.apply(this, args);\n    }, wait);\n    if (callNow) fn.apply(this, args);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `debounce106` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0107",
    "number": 107,
    "title": "Curry Function with Arity Support",
    "slug": "fjp-0107-curry-function-with-arity-support",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Currying",
      "Closures",
      "Function.length"
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
    "problemStatement": "Implement a `curry` function that transforms a multi-argument function into a curried series of unary/partial applications based on `fn.length`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b, c) => a + b + c",
        "output": "curried(1)(2)(3) === 6"
      }
    ],
    "starterCode": "function curry107(fn) {\n  // TODO\n}",
    "functionName": "curry107",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(a, b, c){ return a * b * c; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function curry107(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...args2) {\n      return curried.apply(this, args.concat(args2));\n    };\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `curry107` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0108",
    "number": 108,
    "title": "Function Pipeline Compose and Pipe",
    "slug": "fjp-0108-function-pipeline-compose-and-pipe",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Higher-Order Functions",
      "Composition",
      "Reduce"
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
    "problemStatement": "Implement `pipe` which performs left-to-right function composition, passing the output of each function as input to the next.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fns = [x => x + 1, x => x * 2], val = 5",
        "output": "12"
      }
    ],
    "starterCode": "function pipe108(...fns) {\n  // TODO\n}",
    "functionName": "pipe108",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){return x + 1;}, function(x){return x * 2;}]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function pipe108(...fns) {\n  return function(initial) {\n    return fns.reduce((acc, fn) => fn(acc), initial);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `pipe108` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0109",
    "number": 109,
    "title": "Memoize Function with Resolver",
    "slug": "fjp-0109-memoize-function-with-resolver",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Memoization",
      "Caching",
      "Closures"
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
    "problemStatement": "Implement a memoize utility that caches function results. Accepts an optional custom `resolver` function to derive cache keys.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b) => a + b",
        "output": "Memoized function"
      }
    ],
    "starterCode": "function memoize109(fn, resolver) {\n  // TODO\n}",
    "functionName": "memoize109",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x * x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function memoize109(fn, resolver) {\n  const cache = new Map();\n  return function(...args) {\n    const key = resolver ? resolver(...args) : JSON.stringify(args);\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    const res = fn.apply(this, args);\n    cache.set(key, res);\n    return res;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `memoize109` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0110",
    "number": 110,
    "title": "Invoke Function Once",
    "slug": "fjp-0110-invoke-function-once",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Once Pattern"
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
    "problemStatement": "Create a function that is restricted to invoking `fn` once. Subsequent calls return the result of the first invocation.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => 42",
        "output": "First: 42, Second: 42"
      }
    ],
    "starterCode": "function once110(fn) {\n  // TODO\n}",
    "functionName": "once110",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return 100; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x + 5; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function once110(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) {\n      called = true;\n      result = fn.apply(this, args);\n    }\n    return result;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `once110` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0111",
    "number": 111,
    "title": "Implement Debounce with Immediate Flag",
    "slug": "fjp-0111-implement-debounce-with-immediate-flag",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Timers",
      "Debounce"
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
    "problemStatement": "Implement a debounce function returning a wrapped function that delays execution until after `wait` milliseconds. If `immediate` is true, invoke on the leading edge.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "wait = 100",
        "output": "Function"
      }
    ],
    "starterCode": "function debounce111(fn, wait, immediate) {\n  // TODO\n}",
    "functionName": "debounce111",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){ return x * 2; }, 50, false]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(){ return 42; }, 10, true]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(){}, 100]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function debounce111(fn, wait, immediate) {\n  let timer = null;\n  return function(...args) {\n    const callNow = immediate && !timer;\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      timer = null;\n      if (!immediate) fn.apply(this, args);\n    }, wait);\n    if (callNow) fn.apply(this, args);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `debounce111` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0112",
    "number": 112,
    "title": "Curry Function with Arity Support",
    "slug": "fjp-0112-curry-function-with-arity-support",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Currying",
      "Closures",
      "Function.length"
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
    "problemStatement": "Implement a `curry` function that transforms a multi-argument function into a curried series of unary/partial applications based on `fn.length`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b, c) => a + b + c",
        "output": "curried(1)(2)(3) === 6"
      }
    ],
    "starterCode": "function curry112(fn) {\n  // TODO\n}",
    "functionName": "curry112",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(a, b, c){ return a * b * c; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function curry112(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...args2) {\n      return curried.apply(this, args.concat(args2));\n    };\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `curry112` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0113",
    "number": 113,
    "title": "Function Pipeline Compose and Pipe",
    "slug": "fjp-0113-function-pipeline-compose-and-pipe",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Higher-Order Functions",
      "Composition",
      "Reduce"
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
    "problemStatement": "Implement `pipe` which performs left-to-right function composition, passing the output of each function as input to the next.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fns = [x => x + 1, x => x * 2], val = 5",
        "output": "12"
      }
    ],
    "starterCode": "function pipe113(...fns) {\n  // TODO\n}",
    "functionName": "pipe113",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){return x + 1;}, function(x){return x * 2;}]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function pipe113(...fns) {\n  return function(initial) {\n    return fns.reduce((acc, fn) => fn(acc), initial);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `pipe113` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0114",
    "number": 114,
    "title": "Memoize Function with Resolver",
    "slug": "fjp-0114-memoize-function-with-resolver",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Memoization",
      "Caching",
      "Closures"
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
    "problemStatement": "Implement a memoize utility that caches function results. Accepts an optional custom `resolver` function to derive cache keys.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b) => a + b",
        "output": "Memoized function"
      }
    ],
    "starterCode": "function memoize114(fn, resolver) {\n  // TODO\n}",
    "functionName": "memoize114",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x * x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function memoize114(fn, resolver) {\n  const cache = new Map();\n  return function(...args) {\n    const key = resolver ? resolver(...args) : JSON.stringify(args);\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    const res = fn.apply(this, args);\n    cache.set(key, res);\n    return res;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `memoize114` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0115",
    "number": 115,
    "title": "Invoke Function Once",
    "slug": "fjp-0115-invoke-function-once",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Once Pattern"
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
    "problemStatement": "Create a function that is restricted to invoking `fn` once. Subsequent calls return the result of the first invocation.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => 42",
        "output": "First: 42, Second: 42"
      }
    ],
    "starterCode": "function once115(fn) {\n  // TODO\n}",
    "functionName": "once115",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return 100; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x + 5; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function once115(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) {\n      called = true;\n      result = fn.apply(this, args);\n    }\n    return result;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `once115` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0116",
    "number": 116,
    "title": "Implement Debounce with Immediate Flag",
    "slug": "fjp-0116-implement-debounce-with-immediate-flag",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Timers",
      "Debounce"
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
    "problemStatement": "Implement a debounce function returning a wrapped function that delays execution until after `wait` milliseconds. If `immediate` is true, invoke on the leading edge.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "wait = 100",
        "output": "Function"
      }
    ],
    "starterCode": "function debounce116(fn, wait, immediate) {\n  // TODO\n}",
    "functionName": "debounce116",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){ return x * 2; }, 50, false]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(){ return 42; }, 10, true]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(){}, 100]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function debounce116(fn, wait, immediate) {\n  let timer = null;\n  return function(...args) {\n    const callNow = immediate && !timer;\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      timer = null;\n      if (!immediate) fn.apply(this, args);\n    }, wait);\n    if (callNow) fn.apply(this, args);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `debounce116` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0117",
    "number": 117,
    "title": "Curry Function with Arity Support",
    "slug": "fjp-0117-curry-function-with-arity-support",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Currying",
      "Closures",
      "Function.length"
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
    "problemStatement": "Implement a `curry` function that transforms a multi-argument function into a curried series of unary/partial applications based on `fn.length`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b, c) => a + b + c",
        "output": "curried(1)(2)(3) === 6"
      }
    ],
    "starterCode": "function curry117(fn) {\n  // TODO\n}",
    "functionName": "curry117",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(a, b, c){ return a * b * c; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function curry117(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...args2) {\n      return curried.apply(this, args.concat(args2));\n    };\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `curry117` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0118",
    "number": 118,
    "title": "Function Pipeline Compose and Pipe",
    "slug": "fjp-0118-function-pipeline-compose-and-pipe",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Higher-Order Functions",
      "Composition",
      "Reduce"
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
    "problemStatement": "Implement `pipe` which performs left-to-right function composition, passing the output of each function as input to the next.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fns = [x => x + 1, x => x * 2], val = 5",
        "output": "12"
      }
    ],
    "starterCode": "function pipe118(...fns) {\n  // TODO\n}",
    "functionName": "pipe118",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){return x + 1;}, function(x){return x * 2;}]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function pipe118(...fns) {\n  return function(initial) {\n    return fns.reduce((acc, fn) => fn(acc), initial);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `pipe118` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0119",
    "number": 119,
    "title": "Memoize Function with Resolver",
    "slug": "fjp-0119-memoize-function-with-resolver",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Memoization",
      "Caching",
      "Closures"
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
    "problemStatement": "Implement a memoize utility that caches function results. Accepts an optional custom `resolver` function to derive cache keys.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b) => a + b",
        "output": "Memoized function"
      }
    ],
    "starterCode": "function memoize119(fn, resolver) {\n  // TODO\n}",
    "functionName": "memoize119",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x * x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function memoize119(fn, resolver) {\n  const cache = new Map();\n  return function(...args) {\n    const key = resolver ? resolver(...args) : JSON.stringify(args);\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    const res = fn.apply(this, args);\n    cache.set(key, res);\n    return res;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `memoize119` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0120",
    "number": 120,
    "title": "Invoke Function Once",
    "slug": "fjp-0120-invoke-function-once",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Once Pattern"
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
    "problemStatement": "Create a function that is restricted to invoking `fn` once. Subsequent calls return the result of the first invocation.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => 42",
        "output": "First: 42, Second: 42"
      }
    ],
    "starterCode": "function once120(fn) {\n  // TODO\n}",
    "functionName": "once120",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return 100; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x + 5; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function once120(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) {\n      called = true;\n      result = fn.apply(this, args);\n    }\n    return result;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `once120` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0121",
    "number": 121,
    "title": "Implement Debounce with Immediate Flag",
    "slug": "fjp-0121-implement-debounce-with-immediate-flag",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Timers",
      "Debounce"
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
    "problemStatement": "Implement a debounce function returning a wrapped function that delays execution until after `wait` milliseconds. If `immediate` is true, invoke on the leading edge.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "wait = 100",
        "output": "Function"
      }
    ],
    "starterCode": "function debounce121(fn, wait, immediate) {\n  // TODO\n}",
    "functionName": "debounce121",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){ return x * 2; }, 50, false]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(){ return 42; }, 10, true]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(){}, 100]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function debounce121(fn, wait, immediate) {\n  let timer = null;\n  return function(...args) {\n    const callNow = immediate && !timer;\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      timer = null;\n      if (!immediate) fn.apply(this, args);\n    }, wait);\n    if (callNow) fn.apply(this, args);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `debounce121` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0122",
    "number": 122,
    "title": "Curry Function with Arity Support",
    "slug": "fjp-0122-curry-function-with-arity-support",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Currying",
      "Closures",
      "Function.length"
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
    "problemStatement": "Implement a `curry` function that transforms a multi-argument function into a curried series of unary/partial applications based on `fn.length`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b, c) => a + b + c",
        "output": "curried(1)(2)(3) === 6"
      }
    ],
    "starterCode": "function curry122(fn) {\n  // TODO\n}",
    "functionName": "curry122",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(a, b, c){ return a * b * c; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function curry122(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...args2) {\n      return curried.apply(this, args.concat(args2));\n    };\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `curry122` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0123",
    "number": 123,
    "title": "Function Pipeline Compose and Pipe",
    "slug": "fjp-0123-function-pipeline-compose-and-pipe",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Higher-Order Functions",
      "Composition",
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
    "problemStatement": "Implement `pipe` which performs left-to-right function composition, passing the output of each function as input to the next.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fns = [x => x + 1, x => x * 2], val = 5",
        "output": "12"
      }
    ],
    "starterCode": "function pipe123(...fns) {\n  // TODO\n}",
    "functionName": "pipe123",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){return x + 1;}, function(x){return x * 2;}]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function pipe123(...fns) {\n  return function(initial) {\n    return fns.reduce((acc, fn) => fn(acc), initial);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `pipe123` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0124",
    "number": 124,
    "title": "Memoize Function with Resolver",
    "slug": "fjp-0124-memoize-function-with-resolver",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Memoization",
      "Caching",
      "Closures"
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
    "problemStatement": "Implement a memoize utility that caches function results. Accepts an optional custom `resolver` function to derive cache keys.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b) => a + b",
        "output": "Memoized function"
      }
    ],
    "starterCode": "function memoize124(fn, resolver) {\n  // TODO\n}",
    "functionName": "memoize124",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x * x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function memoize124(fn, resolver) {\n  const cache = new Map();\n  return function(...args) {\n    const key = resolver ? resolver(...args) : JSON.stringify(args);\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    const res = fn.apply(this, args);\n    cache.set(key, res);\n    return res;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `memoize124` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0125",
    "number": 125,
    "title": "Invoke Function Once",
    "slug": "fjp-0125-invoke-function-once",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Once Pattern"
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
    "problemStatement": "Create a function that is restricted to invoking `fn` once. Subsequent calls return the result of the first invocation.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => 42",
        "output": "First: 42, Second: 42"
      }
    ],
    "starterCode": "function once125(fn) {\n  // TODO\n}",
    "functionName": "once125",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return 100; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x + 5; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function once125(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) {\n      called = true;\n      result = fn.apply(this, args);\n    }\n    return result;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `once125` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0126",
    "number": 126,
    "title": "Implement Debounce with Immediate Flag",
    "slug": "fjp-0126-implement-debounce-with-immediate-flag",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Timers",
      "Debounce"
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
    "problemStatement": "Implement a debounce function returning a wrapped function that delays execution until after `wait` milliseconds. If `immediate` is true, invoke on the leading edge.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "wait = 100",
        "output": "Function"
      }
    ],
    "starterCode": "function debounce126(fn, wait, immediate) {\n  // TODO\n}",
    "functionName": "debounce126",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){ return x * 2; }, 50, false]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(){ return 42; }, 10, true]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(){}, 100]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function debounce126(fn, wait, immediate) {\n  let timer = null;\n  return function(...args) {\n    const callNow = immediate && !timer;\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      timer = null;\n      if (!immediate) fn.apply(this, args);\n    }, wait);\n    if (callNow) fn.apply(this, args);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `debounce126` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0127",
    "number": 127,
    "title": "Curry Function with Arity Support",
    "slug": "fjp-0127-curry-function-with-arity-support",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Currying",
      "Closures",
      "Function.length"
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
    "problemStatement": "Implement a `curry` function that transforms a multi-argument function into a curried series of unary/partial applications based on `fn.length`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b, c) => a + b + c",
        "output": "curried(1)(2)(3) === 6"
      }
    ],
    "starterCode": "function curry127(fn) {\n  // TODO\n}",
    "functionName": "curry127",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(a, b, c){ return a * b * c; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function curry127(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...args2) {\n      return curried.apply(this, args.concat(args2));\n    };\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `curry127` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0128",
    "number": 128,
    "title": "Function Pipeline Compose and Pipe",
    "slug": "fjp-0128-function-pipeline-compose-and-pipe",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Higher-Order Functions",
      "Composition",
      "Reduce"
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
    "problemStatement": "Implement `pipe` which performs left-to-right function composition, passing the output of each function as input to the next.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fns = [x => x + 1, x => x * 2], val = 5",
        "output": "12"
      }
    ],
    "starterCode": "function pipe128(...fns) {\n  // TODO\n}",
    "functionName": "pipe128",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){return x + 1;}, function(x){return x * 2;}]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function pipe128(...fns) {\n  return function(initial) {\n    return fns.reduce((acc, fn) => fn(acc), initial);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `pipe128` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0129",
    "number": 129,
    "title": "Memoize Function with Resolver",
    "slug": "fjp-0129-memoize-function-with-resolver",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Memoization",
      "Caching",
      "Closures"
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
    "problemStatement": "Implement a memoize utility that caches function results. Accepts an optional custom `resolver` function to derive cache keys.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b) => a + b",
        "output": "Memoized function"
      }
    ],
    "starterCode": "function memoize129(fn, resolver) {\n  // TODO\n}",
    "functionName": "memoize129",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x * x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function memoize129(fn, resolver) {\n  const cache = new Map();\n  return function(...args) {\n    const key = resolver ? resolver(...args) : JSON.stringify(args);\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    const res = fn.apply(this, args);\n    cache.set(key, res);\n    return res;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `memoize129` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0130",
    "number": 130,
    "title": "Invoke Function Once",
    "slug": "fjp-0130-invoke-function-once",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Easy",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Once Pattern"
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
    "problemStatement": "Create a function that is restricted to invoking `fn` once. Subsequent calls return the result of the first invocation.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => 42",
        "output": "First: 42, Second: 42"
      }
    ],
    "starterCode": "function once130(fn) {\n  // TODO\n}",
    "functionName": "once130",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return 100; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x + 5; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function once130(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) {\n      called = true;\n      result = fn.apply(this, args);\n    }\n    return result;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `once130` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0131",
    "number": 131,
    "title": "Implement Debounce with Immediate Flag",
    "slug": "fjp-0131-implement-debounce-with-immediate-flag",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Timers",
      "Debounce"
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
    "problemStatement": "Implement a debounce function returning a wrapped function that delays execution until after `wait` milliseconds. If `immediate` is true, invoke on the leading edge.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "wait = 100",
        "output": "Function"
      }
    ],
    "starterCode": "function debounce131(fn, wait, immediate) {\n  // TODO\n}",
    "functionName": "debounce131",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){ return x * 2; }, 50, false]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(){ return 42; }, 10, true]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(){}, 100]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function debounce131(fn, wait, immediate) {\n  let timer = null;\n  return function(...args) {\n    const callNow = immediate && !timer;\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      timer = null;\n      if (!immediate) fn.apply(this, args);\n    }, wait);\n    if (callNow) fn.apply(this, args);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `debounce131` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0132",
    "number": 132,
    "title": "Curry Function with Arity Support",
    "slug": "fjp-0132-curry-function-with-arity-support",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Currying",
      "Closures",
      "Function.length"
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
    "problemStatement": "Implement a `curry` function that transforms a multi-argument function into a curried series of unary/partial applications based on `fn.length`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b, c) => a + b + c",
        "output": "curried(1)(2)(3) === 6"
      }
    ],
    "starterCode": "function curry132(fn) {\n  // TODO\n}",
    "functionName": "curry132",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(a, b, c){ return a * b * c; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function curry132(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...args2) {\n      return curried.apply(this, args.concat(args2));\n    };\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `curry132` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0133",
    "number": 133,
    "title": "Function Pipeline Compose and Pipe",
    "slug": "fjp-0133-function-pipeline-compose-and-pipe",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Higher-Order Functions",
      "Composition",
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
    "problemStatement": "Implement `pipe` which performs left-to-right function composition, passing the output of each function as input to the next.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fns = [x => x + 1, x => x * 2], val = 5",
        "output": "12"
      }
    ],
    "starterCode": "function pipe133(...fns) {\n  // TODO\n}",
    "functionName": "pipe133",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){return x + 1;}, function(x){return x * 2;}]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function pipe133(...fns) {\n  return function(initial) {\n    return fns.reduce((acc, fn) => fn(acc), initial);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `pipe133` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0134",
    "number": 134,
    "title": "Memoize Function with Resolver",
    "slug": "fjp-0134-memoize-function-with-resolver",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Memoization",
      "Caching",
      "Closures"
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
    "problemStatement": "Implement a memoize utility that caches function results. Accepts an optional custom `resolver` function to derive cache keys.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b) => a + b",
        "output": "Memoized function"
      }
    ],
    "starterCode": "function memoize134(fn, resolver) {\n  // TODO\n}",
    "functionName": "memoize134",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x * x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function memoize134(fn, resolver) {\n  const cache = new Map();\n  return function(...args) {\n    const key = resolver ? resolver(...args) : JSON.stringify(args);\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    const res = fn.apply(this, args);\n    cache.set(key, res);\n    return res;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `memoize134` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0135",
    "number": 135,
    "title": "Invoke Function Once",
    "slug": "fjp-0135-invoke-function-once",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Once Pattern"
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
    "problemStatement": "Create a function that is restricted to invoking `fn` once. Subsequent calls return the result of the first invocation.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => 42",
        "output": "First: 42, Second: 42"
      }
    ],
    "starterCode": "function once135(fn) {\n  // TODO\n}",
    "functionName": "once135",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return 100; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x + 5; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function once135(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) {\n      called = true;\n      result = fn.apply(this, args);\n    }\n    return result;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `once135` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0136",
    "number": 136,
    "title": "Implement Debounce with Immediate Flag",
    "slug": "fjp-0136-implement-debounce-with-immediate-flag",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Timers",
      "Debounce"
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
    "problemStatement": "Implement a debounce function returning a wrapped function that delays execution until after `wait` milliseconds. If `immediate` is true, invoke on the leading edge.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "wait = 100",
        "output": "Function"
      }
    ],
    "starterCode": "function debounce136(fn, wait, immediate) {\n  // TODO\n}",
    "functionName": "debounce136",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){ return x * 2; }, 50, false]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(){ return 42; }, 10, true]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(){}, 100]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function debounce136(fn, wait, immediate) {\n  let timer = null;\n  return function(...args) {\n    const callNow = immediate && !timer;\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      timer = null;\n      if (!immediate) fn.apply(this, args);\n    }, wait);\n    if (callNow) fn.apply(this, args);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `debounce136` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.936Z",
    "updatedAt": "2026-09-10T04:07:54.936Z"
  },
  {
    "id": "FJP-0137",
    "number": 137,
    "title": "Curry Function with Arity Support",
    "slug": "fjp-0137-curry-function-with-arity-support",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Currying",
      "Closures",
      "Function.length"
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
    "problemStatement": "Implement a `curry` function that transforms a multi-argument function into a curried series of unary/partial applications based on `fn.length`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b, c) => a + b + c",
        "output": "curried(1)(2)(3) === 6"
      }
    ],
    "starterCode": "function curry137(fn) {\n  // TODO\n}",
    "functionName": "curry137",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(a, b, c){ return a * b * c; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function curry137(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...args2) {\n      return curried.apply(this, args.concat(args2));\n    };\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `curry137` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0138",
    "number": 138,
    "title": "Function Pipeline Compose and Pipe",
    "slug": "fjp-0138-function-pipeline-compose-and-pipe",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Higher-Order Functions",
      "Composition",
      "Reduce"
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
    "problemStatement": "Implement `pipe` which performs left-to-right function composition, passing the output of each function as input to the next.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fns = [x => x + 1, x => x * 2], val = 5",
        "output": "12"
      }
    ],
    "starterCode": "function pipe138(...fns) {\n  // TODO\n}",
    "functionName": "pipe138",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){return x + 1;}, function(x){return x * 2;}]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function pipe138(...fns) {\n  return function(initial) {\n    return fns.reduce((acc, fn) => fn(acc), initial);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `pipe138` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0139",
    "number": 139,
    "title": "Memoize Function with Resolver",
    "slug": "fjp-0139-memoize-function-with-resolver",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Memoization",
      "Caching",
      "Closures"
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
    "problemStatement": "Implement a memoize utility that caches function results. Accepts an optional custom `resolver` function to derive cache keys.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b) => a + b",
        "output": "Memoized function"
      }
    ],
    "starterCode": "function memoize139(fn, resolver) {\n  // TODO\n}",
    "functionName": "memoize139",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x * x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function memoize139(fn, resolver) {\n  const cache = new Map();\n  return function(...args) {\n    const key = resolver ? resolver(...args) : JSON.stringify(args);\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    const res = fn.apply(this, args);\n    cache.set(key, res);\n    return res;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `memoize139` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0140",
    "number": 140,
    "title": "Invoke Function Once",
    "slug": "fjp-0140-invoke-function-once",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Once Pattern"
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
    "problemStatement": "Create a function that is restricted to invoking `fn` once. Subsequent calls return the result of the first invocation.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => 42",
        "output": "First: 42, Second: 42"
      }
    ],
    "starterCode": "function once140(fn) {\n  // TODO\n}",
    "functionName": "once140",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return 100; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x + 5; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function once140(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) {\n      called = true;\n      result = fn.apply(this, args);\n    }\n    return result;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `once140` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0141",
    "number": 141,
    "title": "Implement Debounce with Immediate Flag",
    "slug": "fjp-0141-implement-debounce-with-immediate-flag",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Timers",
      "Debounce"
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
    "problemStatement": "Implement a debounce function returning a wrapped function that delays execution until after `wait` milliseconds. If `immediate` is true, invoke on the leading edge.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "wait = 100",
        "output": "Function"
      }
    ],
    "starterCode": "function debounce141(fn, wait, immediate) {\n  // TODO\n}",
    "functionName": "debounce141",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){ return x * 2; }, 50, false]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(){ return 42; }, 10, true]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(){}, 100]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function debounce141(fn, wait, immediate) {\n  let timer = null;\n  return function(...args) {\n    const callNow = immediate && !timer;\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      timer = null;\n      if (!immediate) fn.apply(this, args);\n    }, wait);\n    if (callNow) fn.apply(this, args);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `debounce141` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0142",
    "number": 142,
    "title": "Curry Function with Arity Support",
    "slug": "fjp-0142-curry-function-with-arity-support",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Currying",
      "Closures",
      "Function.length"
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
    "problemStatement": "Implement a `curry` function that transforms a multi-argument function into a curried series of unary/partial applications based on `fn.length`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b, c) => a + b + c",
        "output": "curried(1)(2)(3) === 6"
      }
    ],
    "starterCode": "function curry142(fn) {\n  // TODO\n}",
    "functionName": "curry142",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(a, b, c){ return a * b * c; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function curry142(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...args2) {\n      return curried.apply(this, args.concat(args2));\n    };\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `curry142` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0143",
    "number": 143,
    "title": "Function Pipeline Compose and Pipe",
    "slug": "fjp-0143-function-pipeline-compose-and-pipe",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Higher-Order Functions",
      "Composition",
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
    "problemStatement": "Implement `pipe` which performs left-to-right function composition, passing the output of each function as input to the next.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fns = [x => x + 1, x => x * 2], val = 5",
        "output": "12"
      }
    ],
    "starterCode": "function pipe143(...fns) {\n  // TODO\n}",
    "functionName": "pipe143",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){return x + 1;}, function(x){return x * 2;}]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function pipe143(...fns) {\n  return function(initial) {\n    return fns.reduce((acc, fn) => fn(acc), initial);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `pipe143` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0144",
    "number": 144,
    "title": "Memoize Function with Resolver",
    "slug": "fjp-0144-memoize-function-with-resolver",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Memoization",
      "Caching",
      "Closures"
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
    "problemStatement": "Implement a memoize utility that caches function results. Accepts an optional custom `resolver` function to derive cache keys.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b) => a + b",
        "output": "Memoized function"
      }
    ],
    "starterCode": "function memoize144(fn, resolver) {\n  // TODO\n}",
    "functionName": "memoize144",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x * x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function memoize144(fn, resolver) {\n  const cache = new Map();\n  return function(...args) {\n    const key = resolver ? resolver(...args) : JSON.stringify(args);\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    const res = fn.apply(this, args);\n    cache.set(key, res);\n    return res;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `memoize144` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0145",
    "number": 145,
    "title": "Invoke Function Once",
    "slug": "fjp-0145-invoke-function-once",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Once Pattern"
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
    "problemStatement": "Create a function that is restricted to invoking `fn` once. Subsequent calls return the result of the first invocation.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => 42",
        "output": "First: 42, Second: 42"
      }
    ],
    "starterCode": "function once145(fn) {\n  // TODO\n}",
    "functionName": "once145",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return 100; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x + 5; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function once145(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) {\n      called = true;\n      result = fn.apply(this, args);\n    }\n    return result;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `once145` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0146",
    "number": 146,
    "title": "Implement Debounce with Immediate Flag",
    "slug": "fjp-0146-implement-debounce-with-immediate-flag",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Timers",
      "Debounce"
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
    "problemStatement": "Implement a debounce function returning a wrapped function that delays execution until after `wait` milliseconds. If `immediate` is true, invoke on the leading edge.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "wait = 100",
        "output": "Function"
      }
    ],
    "starterCode": "function debounce146(fn, wait, immediate) {\n  // TODO\n}",
    "functionName": "debounce146",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){ return x * 2; }, 50, false]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(){ return 42; }, 10, true]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(){}, 100]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function debounce146(fn, wait, immediate) {\n  let timer = null;\n  return function(...args) {\n    const callNow = immediate && !timer;\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      timer = null;\n      if (!immediate) fn.apply(this, args);\n    }, wait);\n    if (callNow) fn.apply(this, args);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `debounce146` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0147",
    "number": 147,
    "title": "Curry Function with Arity Support",
    "slug": "fjp-0147-curry-function-with-arity-support",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Currying",
      "Closures",
      "Function.length"
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
    "problemStatement": "Implement a `curry` function that transforms a multi-argument function into a curried series of unary/partial applications based on `fn.length`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b, c) => a + b + c",
        "output": "curried(1)(2)(3) === 6"
      }
    ],
    "starterCode": "function curry147(fn) {\n  // TODO\n}",
    "functionName": "curry147",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(a, b, c){ return a * b * c; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function curry147(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...args2) {\n      return curried.apply(this, args.concat(args2));\n    };\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `curry147` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0148",
    "number": 148,
    "title": "Function Pipeline Compose and Pipe",
    "slug": "fjp-0148-function-pipeline-compose-and-pipe",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Higher-Order Functions",
      "Composition",
      "Reduce"
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
    "problemStatement": "Implement `pipe` which performs left-to-right function composition, passing the output of each function as input to the next.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fns = [x => x + 1, x => x * 2], val = 5",
        "output": "12"
      }
    ],
    "starterCode": "function pipe148(...fns) {\n  // TODO\n}",
    "functionName": "pipe148",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){return x + 1;}, function(x){return x * 2;}]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function pipe148(...fns) {\n  return function(initial) {\n    return fns.reduce((acc, fn) => fn(acc), initial);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `pipe148` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0149",
    "number": 149,
    "title": "Memoize Function with Resolver",
    "slug": "fjp-0149-memoize-function-with-resolver",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Memoization",
      "Caching",
      "Closures"
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
    "problemStatement": "Implement a memoize utility that caches function results. Accepts an optional custom `resolver` function to derive cache keys.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b) => a + b",
        "output": "Memoized function"
      }
    ],
    "starterCode": "function memoize149(fn, resolver) {\n  // TODO\n}",
    "functionName": "memoize149",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x * x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function memoize149(fn, resolver) {\n  const cache = new Map();\n  return function(...args) {\n    const key = resolver ? resolver(...args) : JSON.stringify(args);\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    const res = fn.apply(this, args);\n    cache.set(key, res);\n    return res;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `memoize149` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0150",
    "number": 150,
    "title": "Invoke Function Once",
    "slug": "fjp-0150-invoke-function-once",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Once Pattern"
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
    "problemStatement": "Create a function that is restricted to invoking `fn` once. Subsequent calls return the result of the first invocation.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => 42",
        "output": "First: 42, Second: 42"
      }
    ],
    "starterCode": "function once150(fn) {\n  // TODO\n}",
    "functionName": "once150",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return 100; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x + 5; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function once150(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) {\n      called = true;\n      result = fn.apply(this, args);\n    }\n    return result;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `once150` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0151",
    "number": 151,
    "title": "Implement Debounce with Immediate Flag",
    "slug": "fjp-0151-implement-debounce-with-immediate-flag",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Timers",
      "Debounce"
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
    "problemStatement": "Implement a debounce function returning a wrapped function that delays execution until after `wait` milliseconds. If `immediate` is true, invoke on the leading edge.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "wait = 100",
        "output": "Function"
      }
    ],
    "starterCode": "function debounce151(fn, wait, immediate) {\n  // TODO\n}",
    "functionName": "debounce151",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){ return x * 2; }, 50, false]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(){ return 42; }, 10, true]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(){}, 100]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function debounce151(fn, wait, immediate) {\n  let timer = null;\n  return function(...args) {\n    const callNow = immediate && !timer;\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      timer = null;\n      if (!immediate) fn.apply(this, args);\n    }, wait);\n    if (callNow) fn.apply(this, args);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `debounce151` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0152",
    "number": 152,
    "title": "Curry Function with Arity Support",
    "slug": "fjp-0152-curry-function-with-arity-support",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Currying",
      "Closures",
      "Function.length"
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
    "problemStatement": "Implement a `curry` function that transforms a multi-argument function into a curried series of unary/partial applications based on `fn.length`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b, c) => a + b + c",
        "output": "curried(1)(2)(3) === 6"
      }
    ],
    "starterCode": "function curry152(fn) {\n  // TODO\n}",
    "functionName": "curry152",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(a, b, c){ return a * b * c; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function curry152(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...args2) {\n      return curried.apply(this, args.concat(args2));\n    };\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `curry152` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0153",
    "number": 153,
    "title": "Function Pipeline Compose and Pipe",
    "slug": "fjp-0153-function-pipeline-compose-and-pipe",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Higher-Order Functions",
      "Composition",
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
    "problemStatement": "Implement `pipe` which performs left-to-right function composition, passing the output of each function as input to the next.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fns = [x => x + 1, x => x * 2], val = 5",
        "output": "12"
      }
    ],
    "starterCode": "function pipe153(...fns) {\n  // TODO\n}",
    "functionName": "pipe153",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){return x + 1;}, function(x){return x * 2;}]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function pipe153(...fns) {\n  return function(initial) {\n    return fns.reduce((acc, fn) => fn(acc), initial);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `pipe153` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0154",
    "number": 154,
    "title": "Memoize Function with Resolver",
    "slug": "fjp-0154-memoize-function-with-resolver",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Memoization",
      "Caching",
      "Closures"
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
    "problemStatement": "Implement a memoize utility that caches function results. Accepts an optional custom `resolver` function to derive cache keys.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b) => a + b",
        "output": "Memoized function"
      }
    ],
    "starterCode": "function memoize154(fn, resolver) {\n  // TODO\n}",
    "functionName": "memoize154",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x * x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function memoize154(fn, resolver) {\n  const cache = new Map();\n  return function(...args) {\n    const key = resolver ? resolver(...args) : JSON.stringify(args);\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    const res = fn.apply(this, args);\n    cache.set(key, res);\n    return res;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `memoize154` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0155",
    "number": 155,
    "title": "Invoke Function Once",
    "slug": "fjp-0155-invoke-function-once",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Once Pattern"
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
    "problemStatement": "Create a function that is restricted to invoking `fn` once. Subsequent calls return the result of the first invocation.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => 42",
        "output": "First: 42, Second: 42"
      }
    ],
    "starterCode": "function once155(fn) {\n  // TODO\n}",
    "functionName": "once155",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return 100; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x + 5; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function once155(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) {\n      called = true;\n      result = fn.apply(this, args);\n    }\n    return result;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `once155` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0156",
    "number": 156,
    "title": "Implement Debounce with Immediate Flag",
    "slug": "fjp-0156-implement-debounce-with-immediate-flag",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Timers",
      "Debounce"
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
    "problemStatement": "Implement a debounce function returning a wrapped function that delays execution until after `wait` milliseconds. If `immediate` is true, invoke on the leading edge.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "wait = 100",
        "output": "Function"
      }
    ],
    "starterCode": "function debounce156(fn, wait, immediate) {\n  // TODO\n}",
    "functionName": "debounce156",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){ return x * 2; }, 50, false]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(){ return 42; }, 10, true]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(){}, 100]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function debounce156(fn, wait, immediate) {\n  let timer = null;\n  return function(...args) {\n    const callNow = immediate && !timer;\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      timer = null;\n      if (!immediate) fn.apply(this, args);\n    }, wait);\n    if (callNow) fn.apply(this, args);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `debounce156` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0157",
    "number": 157,
    "title": "Curry Function with Arity Support",
    "slug": "fjp-0157-curry-function-with-arity-support",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Currying",
      "Closures",
      "Function.length"
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
    "problemStatement": "Implement a `curry` function that transforms a multi-argument function into a curried series of unary/partial applications based on `fn.length`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b, c) => a + b + c",
        "output": "curried(1)(2)(3) === 6"
      }
    ],
    "starterCode": "function curry157(fn) {\n  // TODO\n}",
    "functionName": "curry157",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(a, b, c){ return a * b * c; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function curry157(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...args2) {\n      return curried.apply(this, args.concat(args2));\n    };\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `curry157` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0158",
    "number": 158,
    "title": "Function Pipeline Compose and Pipe",
    "slug": "fjp-0158-function-pipeline-compose-and-pipe",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Higher-Order Functions",
      "Composition",
      "Reduce"
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
    "problemStatement": "Implement `pipe` which performs left-to-right function composition, passing the output of each function as input to the next.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fns = [x => x + 1, x => x * 2], val = 5",
        "output": "12"
      }
    ],
    "starterCode": "function pipe158(...fns) {\n  // TODO\n}",
    "functionName": "pipe158",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){return x + 1;}, function(x){return x * 2;}]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function pipe158(...fns) {\n  return function(initial) {\n    return fns.reduce((acc, fn) => fn(acc), initial);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `pipe158` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0159",
    "number": 159,
    "title": "Memoize Function with Resolver",
    "slug": "fjp-0159-memoize-function-with-resolver",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Memoization",
      "Caching",
      "Closures"
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
    "problemStatement": "Implement a memoize utility that caches function results. Accepts an optional custom `resolver` function to derive cache keys.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b) => a + b",
        "output": "Memoized function"
      }
    ],
    "starterCode": "function memoize159(fn, resolver) {\n  // TODO\n}",
    "functionName": "memoize159",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x * x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function memoize159(fn, resolver) {\n  const cache = new Map();\n  return function(...args) {\n    const key = resolver ? resolver(...args) : JSON.stringify(args);\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    const res = fn.apply(this, args);\n    cache.set(key, res);\n    return res;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `memoize159` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0160",
    "number": 160,
    "title": "Invoke Function Once",
    "slug": "fjp-0160-invoke-function-once",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Once Pattern"
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
    "problemStatement": "Create a function that is restricted to invoking `fn` once. Subsequent calls return the result of the first invocation.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => 42",
        "output": "First: 42, Second: 42"
      }
    ],
    "starterCode": "function once160(fn) {\n  // TODO\n}",
    "functionName": "once160",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return 100; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x + 5; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function once160(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) {\n      called = true;\n      result = fn.apply(this, args);\n    }\n    return result;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `once160` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0161",
    "number": 161,
    "title": "Implement Debounce with Immediate Flag",
    "slug": "fjp-0161-implement-debounce-with-immediate-flag",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Timers",
      "Debounce"
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
    "problemStatement": "Implement a debounce function returning a wrapped function that delays execution until after `wait` milliseconds. If `immediate` is true, invoke on the leading edge.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "wait = 100",
        "output": "Function"
      }
    ],
    "starterCode": "function debounce161(fn, wait, immediate) {\n  // TODO\n}",
    "functionName": "debounce161",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){ return x * 2; }, 50, false]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(){ return 42; }, 10, true]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(){}, 100]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function debounce161(fn, wait, immediate) {\n  let timer = null;\n  return function(...args) {\n    const callNow = immediate && !timer;\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      timer = null;\n      if (!immediate) fn.apply(this, args);\n    }, wait);\n    if (callNow) fn.apply(this, args);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `debounce161` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0162",
    "number": 162,
    "title": "Curry Function with Arity Support",
    "slug": "fjp-0162-curry-function-with-arity-support",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Currying",
      "Closures",
      "Function.length"
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
    "problemStatement": "Implement a `curry` function that transforms a multi-argument function into a curried series of unary/partial applications based on `fn.length`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b, c) => a + b + c",
        "output": "curried(1)(2)(3) === 6"
      }
    ],
    "starterCode": "function curry162(fn) {\n  // TODO\n}",
    "functionName": "curry162",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(a, b, c){ return a * b * c; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function curry162(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...args2) {\n      return curried.apply(this, args.concat(args2));\n    };\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `curry162` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0163",
    "number": 163,
    "title": "Function Pipeline Compose and Pipe",
    "slug": "fjp-0163-function-pipeline-compose-and-pipe",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Higher-Order Functions",
      "Composition",
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
    "problemStatement": "Implement `pipe` which performs left-to-right function composition, passing the output of each function as input to the next.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fns = [x => x + 1, x => x * 2], val = 5",
        "output": "12"
      }
    ],
    "starterCode": "function pipe163(...fns) {\n  // TODO\n}",
    "functionName": "pipe163",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){return x + 1;}, function(x){return x * 2;}]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function pipe163(...fns) {\n  return function(initial) {\n    return fns.reduce((acc, fn) => fn(acc), initial);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `pipe163` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0164",
    "number": 164,
    "title": "Memoize Function with Resolver",
    "slug": "fjp-0164-memoize-function-with-resolver",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Memoization",
      "Caching",
      "Closures"
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
    "problemStatement": "Implement a memoize utility that caches function results. Accepts an optional custom `resolver` function to derive cache keys.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b) => a + b",
        "output": "Memoized function"
      }
    ],
    "starterCode": "function memoize164(fn, resolver) {\n  // TODO\n}",
    "functionName": "memoize164",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x * x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function memoize164(fn, resolver) {\n  const cache = new Map();\n  return function(...args) {\n    const key = resolver ? resolver(...args) : JSON.stringify(args);\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    const res = fn.apply(this, args);\n    cache.set(key, res);\n    return res;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `memoize164` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0165",
    "number": 165,
    "title": "Invoke Function Once",
    "slug": "fjp-0165-invoke-function-once",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Once Pattern"
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
    "problemStatement": "Create a function that is restricted to invoking `fn` once. Subsequent calls return the result of the first invocation.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => 42",
        "output": "First: 42, Second: 42"
      }
    ],
    "starterCode": "function once165(fn) {\n  // TODO\n}",
    "functionName": "once165",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return 100; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x + 5; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function once165(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) {\n      called = true;\n      result = fn.apply(this, args);\n    }\n    return result;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `once165` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0166",
    "number": 166,
    "title": "Implement Debounce with Immediate Flag",
    "slug": "fjp-0166-implement-debounce-with-immediate-flag",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Timers",
      "Debounce"
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
    "problemStatement": "Implement a debounce function returning a wrapped function that delays execution until after `wait` milliseconds. If `immediate` is true, invoke on the leading edge.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "wait = 100",
        "output": "Function"
      }
    ],
    "starterCode": "function debounce166(fn, wait, immediate) {\n  // TODO\n}",
    "functionName": "debounce166",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){ return x * 2; }, 50, false]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(){ return 42; }, 10, true]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(){}, 100]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function debounce166(fn, wait, immediate) {\n  let timer = null;\n  return function(...args) {\n    const callNow = immediate && !timer;\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      timer = null;\n      if (!immediate) fn.apply(this, args);\n    }, wait);\n    if (callNow) fn.apply(this, args);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `debounce166` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0167",
    "number": 167,
    "title": "Curry Function with Arity Support",
    "slug": "fjp-0167-curry-function-with-arity-support",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Currying",
      "Closures",
      "Function.length"
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
    "problemStatement": "Implement a `curry` function that transforms a multi-argument function into a curried series of unary/partial applications based on `fn.length`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b, c) => a + b + c",
        "output": "curried(1)(2)(3) === 6"
      }
    ],
    "starterCode": "function curry167(fn) {\n  // TODO\n}",
    "functionName": "curry167",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(a, b, c){ return a * b * c; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function curry167(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...args2) {\n      return curried.apply(this, args.concat(args2));\n    };\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `curry167` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0168",
    "number": 168,
    "title": "Function Pipeline Compose and Pipe",
    "slug": "fjp-0168-function-pipeline-compose-and-pipe",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Higher-Order Functions",
      "Composition",
      "Reduce"
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
    "problemStatement": "Implement `pipe` which performs left-to-right function composition, passing the output of each function as input to the next.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fns = [x => x + 1, x => x * 2], val = 5",
        "output": "12"
      }
    ],
    "starterCode": "function pipe168(...fns) {\n  // TODO\n}",
    "functionName": "pipe168",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){return x + 1;}, function(x){return x * 2;}]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function pipe168(...fns) {\n  return function(initial) {\n    return fns.reduce((acc, fn) => fn(acc), initial);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `pipe168` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0169",
    "number": 169,
    "title": "Memoize Function with Resolver",
    "slug": "fjp-0169-memoize-function-with-resolver",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Memoization",
      "Caching",
      "Closures"
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
    "problemStatement": "Implement a memoize utility that caches function results. Accepts an optional custom `resolver` function to derive cache keys.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b) => a + b",
        "output": "Memoized function"
      }
    ],
    "starterCode": "function memoize169(fn, resolver) {\n  // TODO\n}",
    "functionName": "memoize169",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x * x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function memoize169(fn, resolver) {\n  const cache = new Map();\n  return function(...args) {\n    const key = resolver ? resolver(...args) : JSON.stringify(args);\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    const res = fn.apply(this, args);\n    cache.set(key, res);\n    return res;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `memoize169` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0170",
    "number": 170,
    "title": "Invoke Function Once",
    "slug": "fjp-0170-invoke-function-once",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Once Pattern"
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
    "problemStatement": "Create a function that is restricted to invoking `fn` once. Subsequent calls return the result of the first invocation.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => 42",
        "output": "First: 42, Second: 42"
      }
    ],
    "starterCode": "function once170(fn) {\n  // TODO\n}",
    "functionName": "once170",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return 100; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x + 5; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function once170(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) {\n      called = true;\n      result = fn.apply(this, args);\n    }\n    return result;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `once170` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0171",
    "number": 171,
    "title": "Implement Debounce with Immediate Flag",
    "slug": "fjp-0171-implement-debounce-with-immediate-flag",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Timers",
      "Debounce"
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
    "problemStatement": "Implement a debounce function returning a wrapped function that delays execution until after `wait` milliseconds. If `immediate` is true, invoke on the leading edge.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "wait = 100",
        "output": "Function"
      }
    ],
    "starterCode": "function debounce171(fn, wait, immediate) {\n  // TODO\n}",
    "functionName": "debounce171",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){ return x * 2; }, 50, false]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(){ return 42; }, 10, true]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(){}, 100]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function debounce171(fn, wait, immediate) {\n  let timer = null;\n  return function(...args) {\n    const callNow = immediate && !timer;\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      timer = null;\n      if (!immediate) fn.apply(this, args);\n    }, wait);\n    if (callNow) fn.apply(this, args);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `debounce171` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0172",
    "number": 172,
    "title": "Curry Function with Arity Support",
    "slug": "fjp-0172-curry-function-with-arity-support",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Currying",
      "Closures",
      "Function.length"
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
    "problemStatement": "Implement a `curry` function that transforms a multi-argument function into a curried series of unary/partial applications based on `fn.length`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b, c) => a + b + c",
        "output": "curried(1)(2)(3) === 6"
      }
    ],
    "starterCode": "function curry172(fn) {\n  // TODO\n}",
    "functionName": "curry172",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(a, b, c){ return a * b * c; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function curry172(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...args2) {\n      return curried.apply(this, args.concat(args2));\n    };\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `curry172` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0173",
    "number": 173,
    "title": "Function Pipeline Compose and Pipe",
    "slug": "fjp-0173-function-pipeline-compose-and-pipe",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Higher-Order Functions",
      "Composition",
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
    "problemStatement": "Implement `pipe` which performs left-to-right function composition, passing the output of each function as input to the next.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fns = [x => x + 1, x => x * 2], val = 5",
        "output": "12"
      }
    ],
    "starterCode": "function pipe173(...fns) {\n  // TODO\n}",
    "functionName": "pipe173",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){return x + 1;}, function(x){return x * 2;}]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function pipe173(...fns) {\n  return function(initial) {\n    return fns.reduce((acc, fn) => fn(acc), initial);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `pipe173` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0174",
    "number": 174,
    "title": "Memoize Function with Resolver",
    "slug": "fjp-0174-memoize-function-with-resolver",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Memoization",
      "Caching",
      "Closures"
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
    "problemStatement": "Implement a memoize utility that caches function results. Accepts an optional custom `resolver` function to derive cache keys.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b) => a + b",
        "output": "Memoized function"
      }
    ],
    "starterCode": "function memoize174(fn, resolver) {\n  // TODO\n}",
    "functionName": "memoize174",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x * x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function memoize174(fn, resolver) {\n  const cache = new Map();\n  return function(...args) {\n    const key = resolver ? resolver(...args) : JSON.stringify(args);\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    const res = fn.apply(this, args);\n    cache.set(key, res);\n    return res;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `memoize174` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0175",
    "number": 175,
    "title": "Invoke Function Once",
    "slug": "fjp-0175-invoke-function-once",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Medium",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Once Pattern"
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
    "problemStatement": "Create a function that is restricted to invoking `fn` once. Subsequent calls return the result of the first invocation.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => 42",
        "output": "First: 42, Second: 42"
      }
    ],
    "starterCode": "function once175(fn) {\n  // TODO\n}",
    "functionName": "once175",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return 100; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x + 5; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function once175(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) {\n      called = true;\n      result = fn.apply(this, args);\n    }\n    return result;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `once175` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0176",
    "number": 176,
    "title": "Implement Debounce with Immediate Flag",
    "slug": "fjp-0176-implement-debounce-with-immediate-flag",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Timers",
      "Debounce"
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
    "problemStatement": "Implement a debounce function returning a wrapped function that delays execution until after `wait` milliseconds. If `immediate` is true, invoke on the leading edge.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "wait = 100",
        "output": "Function"
      }
    ],
    "starterCode": "function debounce176(fn, wait, immediate) {\n  // TODO\n}",
    "functionName": "debounce176",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){ return x * 2; }, 50, false]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(){ return 42; }, 10, true]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(){}, 100]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function debounce176(fn, wait, immediate) {\n  let timer = null;\n  return function(...args) {\n    const callNow = immediate && !timer;\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      timer = null;\n      if (!immediate) fn.apply(this, args);\n    }, wait);\n    if (callNow) fn.apply(this, args);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `debounce176` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0177",
    "number": 177,
    "title": "Curry Function with Arity Support",
    "slug": "fjp-0177-curry-function-with-arity-support",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Currying",
      "Closures",
      "Function.length"
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
    "problemStatement": "Implement a `curry` function that transforms a multi-argument function into a curried series of unary/partial applications based on `fn.length`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b, c) => a + b + c",
        "output": "curried(1)(2)(3) === 6"
      }
    ],
    "starterCode": "function curry177(fn) {\n  // TODO\n}",
    "functionName": "curry177",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(a, b, c){ return a * b * c; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function curry177(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...args2) {\n      return curried.apply(this, args.concat(args2));\n    };\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `curry177` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0178",
    "number": 178,
    "title": "Function Pipeline Compose and Pipe",
    "slug": "fjp-0178-function-pipeline-compose-and-pipe",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Higher-Order Functions",
      "Composition",
      "Reduce"
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
    "problemStatement": "Implement `pipe` which performs left-to-right function composition, passing the output of each function as input to the next.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fns = [x => x + 1, x => x * 2], val = 5",
        "output": "12"
      }
    ],
    "starterCode": "function pipe178(...fns) {\n  // TODO\n}",
    "functionName": "pipe178",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){return x + 1;}, function(x){return x * 2;}]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function pipe178(...fns) {\n  return function(initial) {\n    return fns.reduce((acc, fn) => fn(acc), initial);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `pipe178` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0179",
    "number": 179,
    "title": "Memoize Function with Resolver",
    "slug": "fjp-0179-memoize-function-with-resolver",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Memoization",
      "Caching",
      "Closures"
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
    "problemStatement": "Implement a memoize utility that caches function results. Accepts an optional custom `resolver` function to derive cache keys.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b) => a + b",
        "output": "Memoized function"
      }
    ],
    "starterCode": "function memoize179(fn, resolver) {\n  // TODO\n}",
    "functionName": "memoize179",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x * x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function memoize179(fn, resolver) {\n  const cache = new Map();\n  return function(...args) {\n    const key = resolver ? resolver(...args) : JSON.stringify(args);\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    const res = fn.apply(this, args);\n    cache.set(key, res);\n    return res;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `memoize179` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0180",
    "number": 180,
    "title": "Invoke Function Once",
    "slug": "fjp-0180-invoke-function-once",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Once Pattern"
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
    "problemStatement": "Create a function that is restricted to invoking `fn` once. Subsequent calls return the result of the first invocation.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => 42",
        "output": "First: 42, Second: 42"
      }
    ],
    "starterCode": "function once180(fn) {\n  // TODO\n}",
    "functionName": "once180",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return 100; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x + 5; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function once180(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) {\n      called = true;\n      result = fn.apply(this, args);\n    }\n    return result;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `once180` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0181",
    "number": 181,
    "title": "Implement Debounce with Immediate Flag",
    "slug": "fjp-0181-implement-debounce-with-immediate-flag",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Timers",
      "Debounce"
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
    "problemStatement": "Implement a debounce function returning a wrapped function that delays execution until after `wait` milliseconds. If `immediate` is true, invoke on the leading edge.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "wait = 100",
        "output": "Function"
      }
    ],
    "starterCode": "function debounce181(fn, wait, immediate) {\n  // TODO\n}",
    "functionName": "debounce181",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){ return x * 2; }, 50, false]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(){ return 42; }, 10, true]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(){}, 100]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function debounce181(fn, wait, immediate) {\n  let timer = null;\n  return function(...args) {\n    const callNow = immediate && !timer;\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      timer = null;\n      if (!immediate) fn.apply(this, args);\n    }, wait);\n    if (callNow) fn.apply(this, args);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `debounce181` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0182",
    "number": 182,
    "title": "Curry Function with Arity Support",
    "slug": "fjp-0182-curry-function-with-arity-support",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Currying",
      "Closures",
      "Function.length"
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
    "problemStatement": "Implement a `curry` function that transforms a multi-argument function into a curried series of unary/partial applications based on `fn.length`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b, c) => a + b + c",
        "output": "curried(1)(2)(3) === 6"
      }
    ],
    "starterCode": "function curry182(fn) {\n  // TODO\n}",
    "functionName": "curry182",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(a, b, c){ return a * b * c; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function curry182(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...args2) {\n      return curried.apply(this, args.concat(args2));\n    };\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `curry182` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0183",
    "number": 183,
    "title": "Function Pipeline Compose and Pipe",
    "slug": "fjp-0183-function-pipeline-compose-and-pipe",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Higher-Order Functions",
      "Composition",
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
    "problemStatement": "Implement `pipe` which performs left-to-right function composition, passing the output of each function as input to the next.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fns = [x => x + 1, x => x * 2], val = 5",
        "output": "12"
      }
    ],
    "starterCode": "function pipe183(...fns) {\n  // TODO\n}",
    "functionName": "pipe183",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){return x + 1;}, function(x){return x * 2;}]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function pipe183(...fns) {\n  return function(initial) {\n    return fns.reduce((acc, fn) => fn(acc), initial);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `pipe183` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0184",
    "number": 184,
    "title": "Memoize Function with Resolver",
    "slug": "fjp-0184-memoize-function-with-resolver",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Memoization",
      "Caching",
      "Closures"
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
    "problemStatement": "Implement a memoize utility that caches function results. Accepts an optional custom `resolver` function to derive cache keys.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b) => a + b",
        "output": "Memoized function"
      }
    ],
    "starterCode": "function memoize184(fn, resolver) {\n  // TODO\n}",
    "functionName": "memoize184",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x * x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function memoize184(fn, resolver) {\n  const cache = new Map();\n  return function(...args) {\n    const key = resolver ? resolver(...args) : JSON.stringify(args);\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    const res = fn.apply(this, args);\n    cache.set(key, res);\n    return res;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `memoize184` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0185",
    "number": 185,
    "title": "Invoke Function Once",
    "slug": "fjp-0185-invoke-function-once",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Once Pattern"
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
    "problemStatement": "Create a function that is restricted to invoking `fn` once. Subsequent calls return the result of the first invocation.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => 42",
        "output": "First: 42, Second: 42"
      }
    ],
    "starterCode": "function once185(fn) {\n  // TODO\n}",
    "functionName": "once185",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return 100; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x + 5; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function once185(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) {\n      called = true;\n      result = fn.apply(this, args);\n    }\n    return result;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `once185` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0186",
    "number": 186,
    "title": "Implement Debounce with Immediate Flag",
    "slug": "fjp-0186-implement-debounce-with-immediate-flag",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Timers",
      "Debounce"
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
    "problemStatement": "Implement a debounce function returning a wrapped function that delays execution until after `wait` milliseconds. If `immediate` is true, invoke on the leading edge.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "wait = 100",
        "output": "Function"
      }
    ],
    "starterCode": "function debounce186(fn, wait, immediate) {\n  // TODO\n}",
    "functionName": "debounce186",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){ return x * 2; }, 50, false]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(){ return 42; }, 10, true]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(){}, 100]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function debounce186(fn, wait, immediate) {\n  let timer = null;\n  return function(...args) {\n    const callNow = immediate && !timer;\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      timer = null;\n      if (!immediate) fn.apply(this, args);\n    }, wait);\n    if (callNow) fn.apply(this, args);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `debounce186` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0187",
    "number": 187,
    "title": "Curry Function with Arity Support",
    "slug": "fjp-0187-curry-function-with-arity-support",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Currying",
      "Closures",
      "Function.length"
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
    "problemStatement": "Implement a `curry` function that transforms a multi-argument function into a curried series of unary/partial applications based on `fn.length`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b, c) => a + b + c",
        "output": "curried(1)(2)(3) === 6"
      }
    ],
    "starterCode": "function curry187(fn) {\n  // TODO\n}",
    "functionName": "curry187",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(a, b, c){ return a * b * c; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function curry187(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...args2) {\n      return curried.apply(this, args.concat(args2));\n    };\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `curry187` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0188",
    "number": 188,
    "title": "Function Pipeline Compose and Pipe",
    "slug": "fjp-0188-function-pipeline-compose-and-pipe",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Higher-Order Functions",
      "Composition",
      "Reduce"
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
    "problemStatement": "Implement `pipe` which performs left-to-right function composition, passing the output of each function as input to the next.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fns = [x => x + 1, x => x * 2], val = 5",
        "output": "12"
      }
    ],
    "starterCode": "function pipe188(...fns) {\n  // TODO\n}",
    "functionName": "pipe188",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){return x + 1;}, function(x){return x * 2;}]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function pipe188(...fns) {\n  return function(initial) {\n    return fns.reduce((acc, fn) => fn(acc), initial);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `pipe188` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0189",
    "number": 189,
    "title": "Memoize Function with Resolver",
    "slug": "fjp-0189-memoize-function-with-resolver",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Memoization",
      "Caching",
      "Closures"
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
    "problemStatement": "Implement a memoize utility that caches function results. Accepts an optional custom `resolver` function to derive cache keys.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b) => a + b",
        "output": "Memoized function"
      }
    ],
    "starterCode": "function memoize189(fn, resolver) {\n  // TODO\n}",
    "functionName": "memoize189",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x * x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function memoize189(fn, resolver) {\n  const cache = new Map();\n  return function(...args) {\n    const key = resolver ? resolver(...args) : JSON.stringify(args);\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    const res = fn.apply(this, args);\n    cache.set(key, res);\n    return res;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `memoize189` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0190",
    "number": 190,
    "title": "Invoke Function Once",
    "slug": "fjp-0190-invoke-function-once",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Once Pattern"
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
    "problemStatement": "Create a function that is restricted to invoking `fn` once. Subsequent calls return the result of the first invocation.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => 42",
        "output": "First: 42, Second: 42"
      }
    ],
    "starterCode": "function once190(fn) {\n  // TODO\n}",
    "functionName": "once190",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return 100; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x + 5; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function once190(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) {\n      called = true;\n      result = fn.apply(this, args);\n    }\n    return result;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `once190` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0191",
    "number": 191,
    "title": "Implement Debounce with Immediate Flag",
    "slug": "fjp-0191-implement-debounce-with-immediate-flag",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Timers",
      "Debounce"
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
    "problemStatement": "Implement a debounce function returning a wrapped function that delays execution until after `wait` milliseconds. If `immediate` is true, invoke on the leading edge.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "wait = 100",
        "output": "Function"
      }
    ],
    "starterCode": "function debounce191(fn, wait, immediate) {\n  // TODO\n}",
    "functionName": "debounce191",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){ return x * 2; }, 50, false]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(){ return 42; }, 10, true]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(){}, 100]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function debounce191(fn, wait, immediate) {\n  let timer = null;\n  return function(...args) {\n    const callNow = immediate && !timer;\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      timer = null;\n      if (!immediate) fn.apply(this, args);\n    }, wait);\n    if (callNow) fn.apply(this, args);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `debounce191` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0192",
    "number": 192,
    "title": "Curry Function with Arity Support",
    "slug": "fjp-0192-curry-function-with-arity-support",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Currying",
      "Closures",
      "Function.length"
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
    "problemStatement": "Implement a `curry` function that transforms a multi-argument function into a curried series of unary/partial applications based on `fn.length`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b, c) => a + b + c",
        "output": "curried(1)(2)(3) === 6"
      }
    ],
    "starterCode": "function curry192(fn) {\n  // TODO\n}",
    "functionName": "curry192",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(a, b, c){ return a * b * c; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function curry192(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...args2) {\n      return curried.apply(this, args.concat(args2));\n    };\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `curry192` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0193",
    "number": 193,
    "title": "Function Pipeline Compose and Pipe",
    "slug": "fjp-0193-function-pipeline-compose-and-pipe",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Higher-Order Functions",
      "Composition",
      "Reduce"
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
    "problemStatement": "Implement `pipe` which performs left-to-right function composition, passing the output of each function as input to the next.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fns = [x => x + 1, x => x * 2], val = 5",
        "output": "12"
      }
    ],
    "starterCode": "function pipe193(...fns) {\n  // TODO\n}",
    "functionName": "pipe193",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){return x + 1;}, function(x){return x * 2;}]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function pipe193(...fns) {\n  return function(initial) {\n    return fns.reduce((acc, fn) => fn(acc), initial);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `pipe193` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0194",
    "number": 194,
    "title": "Memoize Function with Resolver",
    "slug": "fjp-0194-memoize-function-with-resolver",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Memoization",
      "Caching",
      "Closures"
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
    "problemStatement": "Implement a memoize utility that caches function results. Accepts an optional custom `resolver` function to derive cache keys.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b) => a + b",
        "output": "Memoized function"
      }
    ],
    "starterCode": "function memoize194(fn, resolver) {\n  // TODO\n}",
    "functionName": "memoize194",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x * x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function memoize194(fn, resolver) {\n  const cache = new Map();\n  return function(...args) {\n    const key = resolver ? resolver(...args) : JSON.stringify(args);\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    const res = fn.apply(this, args);\n    cache.set(key, res);\n    return res;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `memoize194` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0195",
    "number": 195,
    "title": "Invoke Function Once",
    "slug": "fjp-0195-invoke-function-once",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Once Pattern"
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
    "problemStatement": "Create a function that is restricted to invoking `fn` once. Subsequent calls return the result of the first invocation.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => 42",
        "output": "First: 42, Second: 42"
      }
    ],
    "starterCode": "function once195(fn) {\n  // TODO\n}",
    "functionName": "once195",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return 100; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x + 5; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function once195(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) {\n      called = true;\n      result = fn.apply(this, args);\n    }\n    return result;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `once195` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0196",
    "number": 196,
    "title": "Implement Debounce with Immediate Flag",
    "slug": "fjp-0196-implement-debounce-with-immediate-flag",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Timers",
      "Debounce"
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
    "problemStatement": "Implement a debounce function returning a wrapped function that delays execution until after `wait` milliseconds. If `immediate` is true, invoke on the leading edge.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "wait = 100",
        "output": "Function"
      }
    ],
    "starterCode": "function debounce196(fn, wait, immediate) {\n  // TODO\n}",
    "functionName": "debounce196",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){ return x * 2; }, 50, false]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(){ return 42; }, 10, true]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(){}, 100]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function debounce196(fn, wait, immediate) {\n  let timer = null;\n  return function(...args) {\n    const callNow = immediate && !timer;\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      timer = null;\n      if (!immediate) fn.apply(this, args);\n    }, wait);\n    if (callNow) fn.apply(this, args);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `debounce196` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0197",
    "number": 197,
    "title": "Curry Function with Arity Support",
    "slug": "fjp-0197-curry-function-with-arity-support",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Currying",
      "Closures",
      "Function.length"
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
    "problemStatement": "Implement a `curry` function that transforms a multi-argument function into a curried series of unary/partial applications based on `fn.length`.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b, c) => a + b + c",
        "output": "curried(1)(2)(3) === 6"
      }
    ],
    "starterCode": "function curry197(fn) {\n  // TODO\n}",
    "functionName": "curry197",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      },
      {
        "id": "tc_2",
        "input": "[function(a, b, c){ return a * b * c; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 2"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function curry197(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...args2) {\n      return curried.apply(this, args.concat(args2));\n    };\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `curry197` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0198",
    "number": 198,
    "title": "Function Pipeline Compose and Pipe",
    "slug": "fjp-0198-function-pipeline-compose-and-pipe",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Higher-Order Functions",
      "Composition",
      "Reduce"
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
    "problemStatement": "Implement `pipe` which performs left-to-right function composition, passing the output of each function as input to the next.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fns = [x => x + 1, x => x * 2], val = 5",
        "output": "12"
      }
    ],
    "starterCode": "function pipe198(...fns) {\n  // TODO\n}",
    "functionName": "pipe198",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(x){return x + 1;}, function(x){return x * 2;}]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function pipe198(...fns) {\n  return function(initial) {\n    return fns.reduce((acc, fn) => fn(acc), initial);\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `pipe198` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0199",
    "number": 199,
    "title": "Memoize Function with Resolver",
    "slug": "fjp-0199-memoize-function-with-resolver",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Memoization",
      "Caching",
      "Closures"
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
    "problemStatement": "Implement a memoize utility that caches function results. Accepts an optional custom `resolver` function to derive cache keys.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = (a, b) => a + b",
        "output": "Memoized function"
      }
    ],
    "starterCode": "function memoize199(fn, resolver) {\n  // TODO\n}",
    "functionName": "memoize199",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(a, b){ return a + b; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x * x; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function memoize199(fn, resolver) {\n  const cache = new Map();\n  return function(...args) {\n    const key = resolver ? resolver(...args) : JSON.stringify(args);\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    const res = fn.apply(this, args);\n    cache.set(key, res);\n    return res;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `memoize199` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  },
  {
    "id": "FJP-0200",
    "number": 200,
    "title": "Invoke Function Once",
    "slug": "fjp-0200-invoke-function-once",
    "category": "Functions",
    "subcategory": "Closures, Scope, Currying & Composition",
    "difficulty": "Hard",
    "frontendTopic": "Higher-Order Functions & Execution Context",
    "javascriptConcepts": [
      "Closures",
      "Once Pattern"
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
    "problemStatement": "Create a function that is restricted to invoking `fn` once. Subsequent calls return the result of the first invocation.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => 42",
        "output": "First: 42, Second: 42"
      }
    ],
    "starterCode": "function once200(fn) {\n  // TODO\n}",
    "functionName": "once200",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return 100; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[function(x){ return x + 5; }]",
        "expectedOutput": "function",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function once200(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) {\n      called = true;\n      result = fn.apply(this, args);\n    }\n    return result;\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `once200` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.937Z",
    "updatedAt": "2026-09-10T04:07:54.937Z"
  }
];
