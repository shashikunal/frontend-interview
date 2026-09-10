// Batch 6: Questions 501 to 600
import type { FrontendJsQuestion } from '../frontendJsTypes';

export const fjpBatch6: FrontendJsQuestion[] = [
  {
    "id": "FJP-0501",
    "number": 501,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0501-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML501(str) {\n  // TODO\n}",
    "functionName": "escapeHTML501",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML501(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML501` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0502",
    "number": 502,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0502-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString502(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString502",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString502(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString502` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0503",
    "number": 503,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0503-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel503(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel503",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel503(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel503` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0504",
    "number": 504,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0504-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard504(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard504",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard504(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard504` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0505",
    "number": 505,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0505-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML505(str) {\n  // TODO\n}",
    "functionName": "escapeHTML505",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML505(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML505` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0506",
    "number": 506,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0506-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString506(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString506",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString506(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString506` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0507",
    "number": 507,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0507-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel507(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel507",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel507(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel507` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0508",
    "number": 508,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0508-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard508(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard508",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard508(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard508` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0509",
    "number": 509,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0509-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML509(str) {\n  // TODO\n}",
    "functionName": "escapeHTML509",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML509(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML509` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0510",
    "number": 510,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0510-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString510(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString510",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString510(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString510` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0511",
    "number": 511,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0511-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel511(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel511",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel511(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel511` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0512",
    "number": 512,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0512-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard512(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard512",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard512(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard512` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0513",
    "number": 513,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0513-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML513(str) {\n  // TODO\n}",
    "functionName": "escapeHTML513",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML513(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML513` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0514",
    "number": 514,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0514-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString514(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString514",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString514(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString514` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0515",
    "number": 515,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0515-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel515(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel515",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel515(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel515` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0516",
    "number": 516,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0516-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard516(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard516",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard516(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard516` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0517",
    "number": 517,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0517-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML517(str) {\n  // TODO\n}",
    "functionName": "escapeHTML517",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML517(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML517` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0518",
    "number": 518,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0518-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString518(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString518",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString518(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString518` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0519",
    "number": 519,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0519-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel519(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel519",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel519(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel519` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0520",
    "number": 520,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0520-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard520(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard520",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard520(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard520` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0521",
    "number": 521,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0521-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML521(str) {\n  // TODO\n}",
    "functionName": "escapeHTML521",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML521(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML521` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0522",
    "number": 522,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0522-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString522(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString522",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString522(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString522` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0523",
    "number": 523,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0523-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel523(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel523",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel523(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel523` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0524",
    "number": 524,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0524-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard524(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard524",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard524(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard524` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0525",
    "number": 525,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0525-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML525(str) {\n  // TODO\n}",
    "functionName": "escapeHTML525",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML525(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML525` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0526",
    "number": 526,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0526-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString526(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString526",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString526(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString526` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0527",
    "number": 527,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0527-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel527(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel527",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel527(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel527` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0528",
    "number": 528,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0528-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard528(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard528",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard528(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard528` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0529",
    "number": 529,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0529-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML529(str) {\n  // TODO\n}",
    "functionName": "escapeHTML529",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML529(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML529` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0530",
    "number": 530,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0530-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Easy",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString530(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString530",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString530(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString530` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0531",
    "number": 531,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0531-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel531(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel531",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel531(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel531` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0532",
    "number": 532,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0532-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard532(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard532",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard532(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard532` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0533",
    "number": 533,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0533-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML533(str) {\n  // TODO\n}",
    "functionName": "escapeHTML533",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML533(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML533` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0534",
    "number": 534,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0534-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString534(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString534",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString534(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString534` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0535",
    "number": 535,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0535-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel535(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel535",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel535(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel535` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0536",
    "number": 536,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0536-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard536(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard536",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard536(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard536` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0537",
    "number": 537,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0537-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML537(str) {\n  // TODO\n}",
    "functionName": "escapeHTML537",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML537(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML537` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0538",
    "number": 538,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0538-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString538(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString538",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString538(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString538` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0539",
    "number": 539,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0539-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel539(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel539",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel539(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel539` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0540",
    "number": 540,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0540-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard540(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard540",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard540(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard540` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0541",
    "number": 541,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0541-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML541(str) {\n  // TODO\n}",
    "functionName": "escapeHTML541",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML541(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML541` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0542",
    "number": 542,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0542-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString542(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString542",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString542(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString542` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0543",
    "number": 543,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0543-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel543(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel543",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel543(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel543` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0544",
    "number": 544,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0544-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard544(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard544",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard544(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard544` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0545",
    "number": 545,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0545-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML545(str) {\n  // TODO\n}",
    "functionName": "escapeHTML545",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML545(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML545` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0546",
    "number": 546,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0546-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString546(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString546",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString546(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString546` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0547",
    "number": 547,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0547-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel547(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel547",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel547(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel547` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0548",
    "number": 548,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0548-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard548(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard548",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard548(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard548` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0549",
    "number": 549,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0549-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML549(str) {\n  // TODO\n}",
    "functionName": "escapeHTML549",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML549(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML549` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0550",
    "number": 550,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0550-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString550(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString550",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString550(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString550` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0551",
    "number": 551,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0551-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel551(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel551",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel551(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel551` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0552",
    "number": 552,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0552-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard552(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard552",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard552(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard552` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0553",
    "number": 553,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0553-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML553(str) {\n  // TODO\n}",
    "functionName": "escapeHTML553",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML553(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML553` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.953Z",
    "updatedAt": "2026-09-10T04:07:54.953Z"
  },
  {
    "id": "FJP-0554",
    "number": 554,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0554-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString554(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString554",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString554(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString554` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0555",
    "number": 555,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0555-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel555(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel555",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel555(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel555` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0556",
    "number": 556,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0556-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard556(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard556",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard556(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard556` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0557",
    "number": 557,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0557-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML557(str) {\n  // TODO\n}",
    "functionName": "escapeHTML557",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML557(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML557` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0558",
    "number": 558,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0558-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString558(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString558",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString558(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString558` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0559",
    "number": 559,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0559-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel559(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel559",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel559(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel559` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0560",
    "number": 560,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0560-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard560(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard560",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard560(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard560` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0561",
    "number": 561,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0561-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML561(str) {\n  // TODO\n}",
    "functionName": "escapeHTML561",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML561(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML561` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0562",
    "number": 562,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0562-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString562(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString562",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString562(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString562` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0563",
    "number": 563,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0563-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel563(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel563",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel563(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel563` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0564",
    "number": 564,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0564-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard564(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard564",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard564(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard564` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0565",
    "number": 565,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0565-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML565(str) {\n  // TODO\n}",
    "functionName": "escapeHTML565",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML565(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML565` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0566",
    "number": 566,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0566-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString566(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString566",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString566(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString566` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0567",
    "number": 567,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0567-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel567(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel567",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel567(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel567` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0568",
    "number": 568,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0568-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard568(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard568",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard568(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard568` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0569",
    "number": 569,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0569-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML569(str) {\n  // TODO\n}",
    "functionName": "escapeHTML569",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML569(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML569` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0570",
    "number": 570,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0570-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString570(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString570",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString570(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString570` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0571",
    "number": 571,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0571-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel571(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel571",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel571(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel571` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0572",
    "number": 572,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0572-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard572(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard572",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard572(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard572` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0573",
    "number": 573,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0573-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML573(str) {\n  // TODO\n}",
    "functionName": "escapeHTML573",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML573(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML573` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0574",
    "number": 574,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0574-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString574(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString574",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString574(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString574` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0575",
    "number": 575,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0575-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Medium",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel575(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel575",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel575(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel575` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0576",
    "number": 576,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0576-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard576(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard576",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard576(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard576` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0577",
    "number": 577,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0577-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML577(str) {\n  // TODO\n}",
    "functionName": "escapeHTML577",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML577(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML577` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0578",
    "number": 578,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0578-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString578(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString578",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString578(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString578` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0579",
    "number": 579,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0579-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel579(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel579",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel579(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel579` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0580",
    "number": 580,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0580-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard580(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard580",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard580(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard580` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0581",
    "number": 581,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0581-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML581(str) {\n  // TODO\n}",
    "functionName": "escapeHTML581",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML581(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML581` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0582",
    "number": 582,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0582-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString582(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString582",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString582(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString582` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0583",
    "number": 583,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0583-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel583(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel583",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel583(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel583` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0584",
    "number": 584,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0584-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard584(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard584",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard584(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard584` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0585",
    "number": 585,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0585-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML585(str) {\n  // TODO\n}",
    "functionName": "escapeHTML585",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML585(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML585` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0586",
    "number": 586,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0586-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString586(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString586",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString586(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString586` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0587",
    "number": 587,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0587-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel587(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel587",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel587(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel587` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0588",
    "number": 588,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0588-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard588(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard588",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard588(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard588` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0589",
    "number": 589,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0589-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML589(str) {\n  // TODO\n}",
    "functionName": "escapeHTML589",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML589(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML589` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0590",
    "number": 590,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0590-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString590(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString590",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString590(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString590` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0591",
    "number": 591,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0591-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel591(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel591",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel591(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel591` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0592",
    "number": 592,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0592-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard592(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard592",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard592(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard592` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0593",
    "number": 593,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0593-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML593(str) {\n  // TODO\n}",
    "functionName": "escapeHTML593",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML593(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML593` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0594",
    "number": 594,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0594-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString594(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString594",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString594(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString594` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0595",
    "number": 595,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0595-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel595(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel595",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel595(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel595` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0596",
    "number": 596,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0596-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard596(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard596",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard596(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard596` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0597",
    "number": 597,
    "title": "XSS Safe HTML String Escaper",
    "slug": "fjp-0597-xss-safe-html-string-escaper",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "XSS Prevention",
      "HTML Entities",
      "Security"
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
    "problemStatement": "Replace characters `&`, `<`, `>`, `\"`, and `'` with their respective HTML entities.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"<script>alert(1)</script>\"",
        "output": "\"&lt;script&gt;alert(1)&lt;/script&gt;\""
      }
    ],
    "starterCode": "function escapeHTML597(str) {\n  // TODO\n}",
    "functionName": "escapeHTML597",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"<script>alert(1)</script>\"]",
        "expectedOutput": "\"&lt;script&gt;alert(1)&lt;/script&gt;\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"A & B 'quotes'\"]",
        "expectedOutput": "\"A &amp; B &#39;quotes&#39;\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function escapeHTML597(str) {\n  const map = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return String(str).replace(/[&<>\"']/g, (m) => map[m]);\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `escapeHTML597` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0598",
    "number": 598,
    "title": "URL Query String Parser to Object",
    "slug": "fjp-0598-url-query-string-parser-to-object",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "URLSearchParams",
      "Parsing",
      "Encoding"
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
    "problemStatement": "Parse URL query string (with or without leading `?`) into key-value object decoding URI components.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "qs = \"?name=John%20Doe&age=30\"",
        "output": "{\"name\": \"John Doe\", \"age\": \"30\"}"
      }
    ],
    "starterCode": "function parseQueryString598(qs) {\n  // TODO\n}",
    "functionName": "parseQueryString598",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"?name=John%20Doe&age=30\"]",
        "expectedOutput": "{\"name\":\"John Doe\",\"age\":\"30\"}",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"\"]",
        "expectedOutput": "{}",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function parseQueryString598(qs) {\n  if (!qs) return {};\n  const clean = qs.startsWith(\"?\") ? qs.slice(1) : qs;\n  const result = {};\n  for (const pair of clean.split(\"&\")) {\n    if (!pair) continue;\n    const [k, v = \"\"] = pair.split(\"=\").map(decodeURIComponent);\n    result[k] = v;\n  }\n  return result;\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `parseQueryString598` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0599",
    "number": 599,
    "title": "String Case Converter kebab-to-camel",
    "slug": "fjp-0599-string-case-converter-kebab-to-camel",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "RegExp",
      "Casing",
      "Strings"
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
    "problemStatement": "Convert kebab-case string into camelCase string.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "str = \"background-color-alpha\"",
        "output": "\"backgroundColorAlpha\""
      }
    ],
    "starterCode": "function kebabToCamel599(str) {\n  // TODO\n}",
    "functionName": "kebabToCamel599",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"background-color\"]",
        "expectedOutput": "\"backgroundColor\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"padding-left-large\"]",
        "expectedOutput": "\"paddingLeftLarge\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function kebabToCamel599(str) {\n  return str.replace(/-([a-z0-9])/gi, (_, letter) => letter.toUpperCase());\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `kebabToCamel599` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  },
  {
    "id": "FJP-0600",
    "number": 600,
    "title": "Mask Sensitive Credit Card / String",
    "slug": "fjp-0600-mask-sensitive-credit-card-string",
    "category": "Strings",
    "subcategory": "Parsing, Formatting, Tokenizing & Sanitization",
    "difficulty": "Hard",
    "frontendTopic": "String Parsing, Templating & Sanitization",
    "javascriptConcepts": [
      "Masking",
      "Strings",
      "Slice"
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
    "problemStatement": "Mask all digits of a credit card string except the last 4 characters with `*`. Keep non-digit spaces or hyphens.",
    "inputDescription": "Function arguments as specified in the signature.",
    "outputDescription": "Result matching the expected return value and specifications.",
    "examples": [
      {
        "input": "card = \"1234-5678-9012-3456\"",
        "output": "\"****-****-****-3456\""
      }
    ],
    "starterCode": "function maskCreditCard600(card) {\n  // TODO\n}",
    "functionName": "maskCreditCard600",
    "testCases": [
      {
        "id": "tc_1",
        "input": "[\"1234-5678-9012-3456\"]",
        "expectedOutput": "\"****-****-****-3456\"",
        "isHidden": false,
        "description": "Test case 1"
      }
    ],
    "hiddenTestCases": [
      {
        "id": "htc_1",
        "input": "[\"1111222233334444\"]",
        "expectedOutput": "\"************4444\"",
        "isHidden": true,
        "description": "Hidden test case 1"
      }
    ],
    "solution": "function maskCreditCard600(card) {\n  const digits = card.replace(/\\D/g, \"\");\n  const unmaskedLength = 4;\n  let maskedCount = digits.length - unmaskedLength;\n  return card.replace(/\\d/g, (match) => {\n    if (maskedCount > 0) {\n      maskedCount--;\n      return \"*\";\n    }\n    return match;\n  });\n}",
    "alternativeSolutions": [],
    "explanation": "### Solution Analysis\n\nImplement `maskCreditCard600` to fulfill the contract with standard JavaScript performance guarantees.",
    "edgeCases": [
      "Empty inputs",
      "Boundary conditions",
      "Undefined or null parameters"
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Carefully inspect input types, bounds, and edge values.",
      "Write down test inputs and expected outputs before starting.",
      "Optimize memory and execution time where possible."
    ],
    "followUps": [
      "Can this be streamlined further or adapted to streaming data?"
    ],
    "productionNotes": "Tested in live enterprise frontend candidate evaluations.",
    "version": 1,
    "status": "Published",
    "createdAt": "2026-09-10T04:07:54.954Z",
    "updatedAt": "2026-09-10T04:07:54.954Z"
  }
];
