// Batch 9: Questions 801 to 900
import type { FrontendJsQuestion } from '../frontendJsTypes';

export const fjpBatch9: FrontendJsQuestion[] = [
  {
    "id": "FJP-0801",
    "number": 801,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0801-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow801(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow801",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow801(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow801` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0802",
    "number": 802,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0802-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle802(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle802",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle802(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle802` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0803",
    "number": 803,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0803-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow803(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow803",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow803(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow803` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0804",
    "number": 804,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0804-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle804(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle804",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle804(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle804` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0805",
    "number": 805,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0805-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow805(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow805",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow805(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow805` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0806",
    "number": 806,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0806-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle806(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle806",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle806(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle806` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0807",
    "number": 807,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0807-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow807(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow807",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow807(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow807` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0808",
    "number": 808,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0808-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle808(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle808",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle808(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle808` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0809",
    "number": 809,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0809-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow809(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow809",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow809(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow809` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0810",
    "number": 810,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0810-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle810(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle810",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle810(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle810` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0811",
    "number": 811,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0811-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow811(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow811",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow811(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow811` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0812",
    "number": 812,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0812-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle812(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle812",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle812(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle812` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0813",
    "number": 813,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0813-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow813(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow813",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow813(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow813` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0814",
    "number": 814,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0814-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle814(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle814",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle814(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle814` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0815",
    "number": 815,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0815-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow815(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow815",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow815(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow815` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0816",
    "number": 816,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0816-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle816(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle816",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle816(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle816` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0817",
    "number": 817,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0817-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow817(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow817",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow817(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow817` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0818",
    "number": 818,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0818-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle818(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle818",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle818(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle818` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0819",
    "number": 819,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0819-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow819(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow819",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow819(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow819` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0820",
    "number": 820,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0820-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle820(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle820",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle820(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle820` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0821",
    "number": 821,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0821-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow821(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow821",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow821(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow821` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0822",
    "number": 822,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0822-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle822(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle822",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle822(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle822` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0823",
    "number": 823,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0823-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow823(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow823",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow823(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow823` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0824",
    "number": 824,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0824-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle824(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle824",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle824(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle824` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0825",
    "number": 825,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0825-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow825(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow825",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow825(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow825` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0826",
    "number": 826,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0826-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle826(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle826",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle826(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle826` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0827",
    "number": 827,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0827-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow827(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow827",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow827(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow827` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0828",
    "number": 828,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0828-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle828(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle828",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle828(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle828` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0829",
    "number": 829,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0829-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow829(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow829",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow829(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow829` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0830",
    "number": 830,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0830-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Easy",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle830(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle830",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle830(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle830` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0831",
    "number": 831,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0831-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow831(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow831",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow831(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow831` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0832",
    "number": 832,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0832-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle832(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle832",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle832(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle832` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0833",
    "number": 833,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0833-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow833(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow833",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow833(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow833` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0834",
    "number": 834,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0834-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle834(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle834",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle834(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle834` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0835",
    "number": 835,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0835-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow835(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow835",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow835(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow835` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0836",
    "number": 836,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0836-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle836(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle836",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle836(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle836` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0837",
    "number": 837,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0837-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow837(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow837",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow837(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow837` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0838",
    "number": 838,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0838-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle838(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle838",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle838(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle838` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0839",
    "number": 839,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0839-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow839(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow839",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow839(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow839` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0840",
    "number": 840,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0840-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle840(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle840",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle840(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle840` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0841",
    "number": 841,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0841-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow841(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow841",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow841(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow841` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0842",
    "number": 842,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0842-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle842(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle842",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle842(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle842` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0843",
    "number": 843,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0843-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow843(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow843",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow843(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow843` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0844",
    "number": 844,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0844-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle844(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle844",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle844(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle844` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0845",
    "number": 845,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0845-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow845(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow845",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow845(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow845` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0846",
    "number": 846,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0846-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle846(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle846",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle846(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle846` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0847",
    "number": 847,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0847-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow847(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow847",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow847(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow847` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0848",
    "number": 848,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0848-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle848(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle848",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle848(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle848` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0849",
    "number": 849,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0849-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow849(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow849",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow849(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow849` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0850",
    "number": 850,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0850-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle850(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle850",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle850(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle850` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0851",
    "number": 851,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0851-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow851(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow851",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow851(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow851` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0852",
    "number": 852,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0852-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle852(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle852",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle852(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle852` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0853",
    "number": 853,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0853-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow853(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow853",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow853(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow853` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0854",
    "number": 854,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0854-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle854(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle854",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle854(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle854` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0855",
    "number": 855,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0855-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow855(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow855",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow855(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow855` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0856",
    "number": 856,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0856-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle856(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle856",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle856(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle856` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0857",
    "number": 857,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0857-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow857(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow857",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow857(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow857` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0858",
    "number": 858,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0858-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle858(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle858",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle858(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle858` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0859",
    "number": 859,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0859-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow859(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow859",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow859(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow859` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0860",
    "number": 860,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0860-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle860(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle860",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle860(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle860` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0861",
    "number": 861,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0861-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow861(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow861",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow861(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow861` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0862",
    "number": 862,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0862-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle862(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle862",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle862(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle862` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0863",
    "number": 863,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0863-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow863(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow863",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow863(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow863` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0864",
    "number": 864,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0864-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle864(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle864",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle864(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle864` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0865",
    "number": 865,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0865-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow865(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow865",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow865(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow865` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0866",
    "number": 866,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0866-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle866(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle866",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle866(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle866` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0867",
    "number": 867,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0867-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow867(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow867",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow867(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow867` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0868",
    "number": 868,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0868-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle868(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle868",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle868(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle868` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0869",
    "number": 869,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0869-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow869(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow869",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow869(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow869` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0870",
    "number": 870,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0870-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle870(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle870",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle870(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle870` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0871",
    "number": 871,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0871-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow871(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow871",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow871(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow871` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0872",
    "number": 872,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0872-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle872(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle872",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle872(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle872` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0873",
    "number": 873,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0873-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow873(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow873",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow873(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow873` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0874",
    "number": 874,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0874-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle874(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle874",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle874(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle874` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0875",
    "number": 875,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0875-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Medium",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow875(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow875",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow875(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow875` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0876",
    "number": 876,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0876-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle876(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle876",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle876(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle876` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0877",
    "number": 877,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0877-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow877(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow877",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow877(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow877` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0878",
    "number": 878,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0878-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle878(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle878",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle878(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle878` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0879",
    "number": 879,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0879-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow879(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow879",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow879(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow879` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0880",
    "number": 880,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0880-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle880(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle880",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle880(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle880` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0881",
    "number": 881,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0881-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow881(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow881",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow881(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow881` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0882",
    "number": 882,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0882-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle882(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle882",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle882(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle882` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0883",
    "number": 883,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0883-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow883(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow883",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow883(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow883` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0884",
    "number": 884,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0884-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle884(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle884",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle884(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle884` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0885",
    "number": 885,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0885-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow885(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow885",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow885(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow885` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0886",
    "number": 886,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0886-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle886(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle886",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle886(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle886` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0887",
    "number": 887,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0887-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow887(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow887",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow887(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow887` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0888",
    "number": 888,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0888-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle888(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle888",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle888(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle888` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0889",
    "number": 889,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0889-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow889(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow889",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow889(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow889` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0890",
    "number": 890,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0890-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle890(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle890",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle890(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle890` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0891",
    "number": 891,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0891-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow891(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow891",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow891(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow891` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0892",
    "number": 892,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0892-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle892(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle892",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle892(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle892` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0893",
    "number": 893,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0893-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow893(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow893",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow893(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow893` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0894",
    "number": 894,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0894-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle894(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle894",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle894(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle894` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0895",
    "number": 895,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0895-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow895(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow895",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow895(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow895` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0896",
    "number": 896,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0896-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle896(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle896",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle896(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle896` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0897",
    "number": 897,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0897-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow897(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow897",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow897(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow897` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0898",
    "number": 898,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0898-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle898(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle898",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle898(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle898` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0899",
    "number": 899,
    "title": "Virtual List Visible Window Calculator",
    "slug": "fjp-0899-virtual-list-visible-window-calculator",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "Virtualization",
      "Performance",
      "DOM"
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
    "problemStatement": "Given `scrollTop`, `viewportHeight`, `itemHeight`, and `totalItems`, return `{ startIndex, endIndex, offsetTop }` with overscan buffer.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "scrollTop = 200, viewportHeight = 400, itemHeight = 50, total = 1000",
        "output": "Window indices"
      }
    ],
    "starterCode": "function calculateVirtualWindow899(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  // TODO\n}",
    "functionName": "calculateVirtualWindow899",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[200, 400, 50, 1000, 2]",
        "expectedOutput": "{\"startIndex\":2,\"endIndex\":14,\"offsetTop\":100}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[0, 300, 30, 100, 1]",
        "expectedOutput": "{\"startIndex\":0,\"endIndex\":11,\"offsetTop\":0}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function calculateVirtualWindow899(scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2) {\n  const startNode = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(viewportHeight / itemHeight);\n  const startIndex = Math.max(0, startNode - overscan);\n  const endIndex = Math.min(totalItems - 1, startNode + visibleCount + overscan);\n  const offsetTop = startIndex * itemHeight;\n  return { startIndex, endIndex, offsetTop };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `calculateVirtualWindow899` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  },
  {
    "id": "FJP-0900",
    "number": 900,
    "title": "RAF Throttle for 60fps Animations",
    "slug": "fjp-0900-raf-throttle-for-60fps-animations",
    "category": "Performance",
    "subcategory": "Virtualization, RAF, RequestIdleCallback & Caching",
    "difficulty": "Hard",
    "frontendTopic": "Frontend Optimization, Virtualization & Schedulers",
    "javascriptConcepts": [
      "requestAnimationFrame",
      "Throttle",
      "Rendering"
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
    "problemStatement": "Create RAF throttle wrapping a callback to execute at most once per animation frame tick.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "fn = () => {}",
        "output": "Throttled RAF function"
      }
    ],
    "starterCode": "function rafThrottle900(fn) {\n  // TODO\n}",
    "functionName": "rafThrottle900",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[function(){ return \"render\"; }]",
        "expectedOutput": "function",
        "isHidden": false,
        "description": "Test case 1"
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
    "solution": "function rafThrottle900(fn) {\n  let queued = false;\n  let lastArgs;\n  return function(...args) {\n    lastArgs = args;\n    if (!queued) {\n      queued = true;\n      setTimeout(() => {\n        queued = false;\n        fn.apply(this, lastArgs);\n      }, 16);\n    }\n  };\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `rafThrottle900` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.967Z",
    "updatedAt": "2026-09-10T04:07:54.967Z"
  }
];
