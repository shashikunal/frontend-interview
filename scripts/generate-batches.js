// scripts/generate-batches.js
const fs = require('fs');
const path = require('path');
const { CATEGORIES, getCategoryInfo, getDifficulty, getQuestionType, outDir } = require('./build-core-programming');

// Core topics catalog generator
function buildQuestionData(num) {
  const catInfo = getCategoryInfo(num);
  const difficulty = getDifficulty(num);
  const qType = getQuestionType(num, catInfo);
  const id = `JS-P${String(num).padStart(3, '0')}`;
  const funcName = `coreProgSolve${num}`;

  // Unique topics per category range
  let title = '';
  let subcat = '';
  let statement = '';
  let starterCode = '';
  let solutionCode = '';
  let testCases = [];
  let hints = [];
  let explanation = '';
  let timeComp = 'O(n)';
  let spaceComp = 'O(1)';
  let tags = ['javascript', 'core-programming', catInfo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')];

  switch (catInfo.name) {
    case 'JavaScript Basics': {
      subcat = 'Types & Primitives';
      const topics = [
        'Strict Equality vs Loose Equality Comparator', 'Safe Nullish Value Extractor', 'Falsy Value Checker',
        'Coercion Safe String To Number Parser', 'Primitive vs Reference Type Validator', 'NaN Safe Comparator (Object.is simulation)',
        'Bitwise Odd/Even Detector', 'Safe Division with Zero & Infinity Check', 'Floating Point Precision Adder (0.1 + 0.2 fix)',
        'Boolean Inverter with String Coercion', 'Explicit Type Cast Suite', 'Negative Zero (-0) Identifier',
        'Integer Boundary Guard (MAX_SAFE_INTEGER)', 'Safe BigInt Converter', 'Coerced String Truncator',
        'Unary Plus Number Parser', 'Compound Assignment Accumulator', 'Bitwise NOT Double Flip (~ ~) Floor Polyfill',
        'Ternary Conditional Fallback Evaluator', 'Short-Circuiting Logical AND Evaluator', 'Short-Circuiting Logical OR Evaluator',
        'Nullish Coalescing Operator Simulator', 'Symbol Description Getter', 'Global NaN vs Number.isNaN Polyfill',
        'Finite Number Validator', 'Hexadecimal & Binary String Parser', 'Safe JSON Stringify Primitive Formatter',
        'Typeof Operator Multi-Type Categorizer', 'Void 0 Undefined Generator', 'Coercion Precedence Calculator'
      ];
      const idx = num - catInfo.start;
      title = topics[idx] || `JavaScript Basics Concept #${idx + 1}`;
      statement = `Implement a robust JavaScript utility function for: ${title}.\nProperly account for primitive edge cases, type coercion rules, and invalid parameter types.`;
      starterCode = `function ${funcName}(val1, val2) {\n  // Write your solution here\n}`;
      solutionCode = `function ${funcName}(val1, val2) {\n  if (val1 === undefined) return val2 !== undefined ? val2 : null;\n  if (Number.isNaN(val1)) return Number.isNaN(val2);\n  return Object.is(val1, val2) || val1 === val2;\n}`;
      testCases = [
        { id: `tc_${num}_1`, input: `[0, -0]`, expectedOutput: `false`, isHidden: false },
        { id: `tc_${num}_2`, input: `[42, 42]`, expectedOutput: `true`, isHidden: false },
        { id: `tc_${num}_3`, input: `[null, undefined]`, expectedOutput: `false`, isHidden: true }
      ];
      timeComp = 'O(1)';
      spaceComp = 'O(1)';
      hints = ['Consider how JavaScript handles special numbers like NaN and -0.', 'Pay close attention to type coercion difference between == and ===.'];
      explanation = `Evaluates primitive values while adhering strictly to ECMAScript standard specifications for equality, precision, and type casting.`;
      break;
    }

    case 'Strings': {
      subcat = 'String Manipulation & Regex';
      const topics = [
        'Palindrome String Checker', 'Reverse Words in a Sentence', 'First Non-Repeating Character',
        'String Anagram Validator', 'Count Vowels and Consonants', 'Truncate String with Ellipsis',
        'Kebab-Case to CamelCase Converter', 'CamelCase to Snake_Case Converter', 'Title Case Sentence Formatter',
        'Compress Repeated Characters (Run-Length)', 'Check Substring Rotation', 'Strip HTML Tags from String',
        'Extract URLs from Text', 'Mask Sensitive Credit Card / Phone Digits', 'Parse Query String to Object',
        'Generate Random Alphanumeric Slug', 'Levenshtein Distance String Metric', 'Longest Common Prefix Finder',
        'Check Valid Parentheses In String', 'Caesar Cipher String Encryptor', 'Count Word Frequencies',
        'Z-Algorithm Pattern Matching Simulator', 'Strip Extra Consecutive Whitespaces', 'Format Numbers with Metric Suffixes (K, M, B)',
        'Check If String Is Valid JSON', 'Template Literal Interpolation Parser', 'Remove Duplicate Characters Preserving Order',
        'Check Isomorphic Strings', 'Generate Substrings of Length K', 'Capitalize First Letter of Each Word',
        'String Character Frequency Map', 'Check Valid Palindrome Ignoring Non-Alphanumeric', 'Decode URI Query Parameters',
        'Pad Start & Pad End Polyfill', 'Word Wrap with Line Length Limit', 'Find All Permutations of a String',
        'Extract Domain from Email Address', 'Slugify Title String for URL', 'Check Wildcard Pattern Match (*, ?)',
        'Check Balanced Bracket Expressions'
      ];
      const idx = num - catInfo.start;
      title = topics[idx] || `String Operation #${idx + 1}`;
      statement = `Write a production-ready string processing function: ${title}.\nOptimize for character scanning performance and handle empty strings or spaces cleanly.`;
      starterCode = `function ${funcName}(str) {\n  // Write your solution here\n}`;
      solutionCode = `function ${funcName}(str) {\n  if (typeof str !== 'string') return '';\n  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return clean === clean.split('').reverse().join('');\n}`;
      testCases = [
        { id: `tc_${num}_1`, input: `["racecar"]`, expectedOutput: `true`, isHidden: false },
        { id: `tc_${num}_2`, input: `["A man a plan a canal panama"]`, expectedOutput: `true`, isHidden: false },
        { id: `tc_${num}_3`, input: `["frontend"]`, expectedOutput: `false`, isHidden: true }
      ];
      timeComp = 'O(n)';
      spaceComp = 'O(n)';
      hints = ['Filter out non-alphanumeric characters first.', 'A two-pointer approach avoids allocating additional string arrays.'];
      explanation = `Analyzes string characters using clean array transformations or pointers with O(n) linear complexity.`;
      break;
    }

    case 'Arrays': {
      subcat = 'Array Algorithms & Slicing';
      const topics = [
        'Array Chunking into Subarrays of Size K', 'Remove Duplicate Primitives from Array', 'Flatten Nested Array (1 Level)',
        'Deep Flatten Nested Array Recursively', 'Array Intersection of Two Arrays', 'Array Difference (Elements in A not B)',
        'Array Union with Unique Elements', 'Rotate Array Left by K Positions', 'Rotate Array Right by K Positions',
        'Find Min and Max in a Single Pass', 'Two Sum Array Index Finder', 'Move Zeroes to End of Array',
        'Zip Two Arrays into Pairs', 'Unzip Array of Pairs into Two Arrays', 'Shuffle Array Elements (Fisher-Yates)',
        'Partition Array into Evens and Odds', 'Find Missing Number in Sequential Array (1 to N)', 'Find Duplicate Number in Array',
        'Group Array Elements by Frequency', 'Sliding Window Maximum Finder', 'Merge Two Sorted Arrays in O(n)',
        'Find Continuous Subarray with Target Sum', 'Array Deduplication by Custom Property', 'Sample N Random Items from Array',
        'Binary Search in Sorted Array', 'Quick Select K-th Smallest Element', 'Product of Array Except Self',
        'Longest Consecutive Sequence in Array', 'Container with Most Water Area', 'Trapping Rain Water Calculator',
        'Subarray with Maximum Sum (Kadane)', 'Count Inversions in Array', 'Find Median of Two Sorted Arrays',
        'Sort Array by Parity II', 'Array Compact (Remove Falsy Values)', 'Calculate Array Moving Average',
        'Transpose 2D Matrix Array', 'Rotate 2D Matrix 90 Degrees Clockwise', 'Spiral Matrix Traversal Generator',
        'Generate Pascal Triangle Rows', 'Find Peak Element in Array', 'Majority Element Finder (> N/2)',
        'Search in Rotated Sorted Array', 'Merge Overlapping Interval Arrays', 'Insert Interval into Sorted Intervals',
        'Non-Decreasing Array Single Modification Check', 'Summary Ranges Array Formatter', 'Monotonic Array Detector',
        'Intersection of Multiple Arrays', 'Find All Triplets with Zero Sum', 'Sort Colors (Dutch National Flag 0,1,2)',
        'Next Permutation Lexicographical Order', 'Plus One Array Number Incrementer', 'Remove Element In-Place',
        'Remove Duplicates from Sorted Array II', 'Set Matrix Zeroes In-Place', 'Game of Life Matrix State Updater',
        'Maximum Product Subarray', 'Find Minimum in Rotated Sorted Array', 'Contains Duplicate with Distance K',
        'Contains Duplicate III (Value Difference)', 'Shortest Unsorted Continuous Subarray', 'Degree of an Array',
        'Toeplitz Matrix Verifier', 'Reshape the Matrix to Dimensions R x C', 'Can Place Flowers Array Checker',
        'Maximum Average Subarray I', 'Maximum Length of Repeated Subarray', 'Find Pivot Index where Left Sum Equals Right Sum',
        'Daily Temperatures Wait Days Finder', 'Asteroid Collision Array Simulator', 'Subarray Product Less Than K',
        'Largest Number Formed from Array Digits', 'Wiggle Sort Array Elements', 'Increasing Triplet Subsequence Detector',
        'Longest Increasing Subsequence Length', 'Find Duplicate Subtrees Array Identifier', 'Continuous Subarray Sum Divisible by K',
        'Diagonal Traverse of 2D Matrix', 'Circular Array Loop Detector'
      ];
      const idx = num - catInfo.start;
      title = topics[idx] || `Array Transformation #${idx + 1}`;
      statement = `Implement the algorithm: ${title}.\nDesign the function to handle boundary edge cases such as empty arrays, negative lengths, and duplicate values.`;
      starterCode = `function ${funcName}(arr, k) {\n  // Write your solution here\n}`;
      solutionCode = `function ${funcName}(arr, k) {\n  if (!Array.isArray(arr)) return [];\n  const size = Math.max(1, k || 1);\n  const res = [];\n  for (let i = 0; i < arr.length; i += size) {\n    res.push(arr.slice(i, i + size));\n  }\n  return res;\n}`;
      testCases = [
        { id: `tc_${num}_1`, input: `[[1, 2, 3, 4, 5], 2]`, expectedOutput: `[[1,2],[3,4],[5]]`, isHidden: false },
        { id: `tc_${num}_2`, input: `[[1, 2, 3], 1]`, expectedOutput: `[[1],[2],[3]]`, isHidden: false },
        { id: `tc_${num}_3`, input: `[[], 3]`, expectedOutput: `[]`, isHidden: true }
      ];
      timeComp = 'O(n)';
      spaceComp = 'O(n)';
      hints = ['Use array slicing or indices loops rather than destructive mutations.', 'Check for empty array inputs upfront.'];
      explanation = `Transforms array data using linear scanning and chunked memory partitions.`;
      break;
    }

    case 'Objects': {
      subcat = 'Object Modeling & Inspection';
      const topics = [
        'Deep Clone Object with Nested Structures', 'Object Deep Equal Value Comparator', 'Deep Merge Two Objects',
        'Safe Property Getter by Dot-Path ("a.b.c")', 'Safe Property Setter by Dot-Path', 'Omit Keys from Object',
        'Pick Specific Keys from Object', 'Invert Object Keys and Values', 'Deep Freeze Object Immutably',
        'Check Object Has Nested Property', 'Flatten Nested Object to Dot-Notation Keys', 'Unflatten Dot-Notation Object into Tree',
        'Compute Deep Difference between Two Objects', 'Filter Object Keys by Value Predicate', 'Transform Object Values with Mapping Function',
        'Check If Value Is Plain Object', 'Clone Object Preserving Prototype Chain', 'Create Object with Dynamic Computed Keys',
        'Map Object Keys to New Format', 'Serialize Object into URL Query String', 'Parse URL Query String to Nested Object',
        'Get Nested Object Size / Property Count', 'Sanitize Object Removing Null & Undefined', 'Seal Object Recursively',
        'Watch Object Property Changes via Proxy', 'Object Key Sorting Alphabetically', 'Find Circular References in Object',
        'Convert Key-Value Pairs Array to Object', 'Convert Object to Key-Value Pairs Array', 'Object Schema Validator against Rules',
        'Default Props Deep Merge', 'Namespace Hierarchy Object Builder', 'Extract All Leaf Values from Object',
        'Compare Object Shapes / Schemas', 'Lookup Object Value by Case-Insensitive Key', 'Group Array of Objects by Multiple Keys',
        'Mask Confidential Object Keys', 'Deep Rename Object Keys', 'Create Immutable Dictionary with Freeze',
        'Detect Cyclic Prototype Chaining', 'Object Property Descriptor Inspector', 'Custom Object Inspect / ToString Formatter',
        'Object Patch Applier (RFC 6902 style)', 'Clean Empty Objects and Arrays from Tree', 'Compute Shallow Diff of Two Objects',
        'Object Value Extractor with Fallbacks', 'Create Enum-Like Frozen Object', 'Merge Objects with Custom Conflict Resolver',
        'Check If Object Implements Interface', 'Deep Filter Object Properties'
      ];
      const idx = num - catInfo.start;
      title = topics[idx] || `Object Pattern #${idx + 1}`;
      statement = `Implement the object manipulation utility: ${title}.\nEnsure robust handling of nested structures, null/undefined properties, and circular references where appropriate.`;
      starterCode = `function ${funcName}(obj, path, fallback) {\n  // Write your solution here\n}`;
      solutionCode = `function ${funcName}(obj, path, fallback) {\n  if (!obj || typeof obj !== 'object') return fallback;\n  const keys = Array.isArray(path) ? path : String(path).split('.');\n  let cur = obj;\n  for (const k of keys) {\n    if (cur === null || cur === undefined || !(k in Object(cur))) return fallback;\n    cur = cur[k];\n  }\n  return cur !== undefined ? cur : fallback;\n}`;
      testCases = [
        { id: `tc_${num}_1`, input: `[{"a": {"b": {"c": 42}}}, "a.b.c", null]`, expectedOutput: `42`, isHidden: false },
        { id: `tc_${num}_2`, input: `[{"a": 1}, "a.b", "fallback"]`, expectedOutput: `"fallback"`, isHidden: false },
        { id: `tc_${num}_3`, input: `[null, "x.y", 0]`, expectedOutput: `0`, isHidden: true }
      ];
      timeComp = 'O(d)';
      spaceComp = 'O(1)';
      hints = ['Split path on dot notation and traverse down sequentially.', 'Check null/undefined guards before indexing keys.'];
      explanation = `Navigates object hierarchies safely without throwing TypeError exceptions on missing intermediary keys.`;
      break;
    }

    case 'Functions': {
      subcat = 'Higher-Order Functions & Currying';
      const topics = [
        'Curry Function Supporting Arbitrary Arity', 'Compose Functions Right-to-Left', 'Pipe Functions Left-to-Right',
        'Memoize Function with Argument Serialization', 'Debounce Function with Immediate Flag', 'Throttle Function with Leading & Trailing Options',
        'Once Function (Run Only On First Call)', 'After Function (Run After N Invocations)', 'Before Function (Run Up to N Times)',
        'Partial Application of Function Arguments', 'Flip Function Arguments Order', 'Negate Function Returning Inverted Boolean',
        'Unary Function Wrapper (Force Single Argument)', 'Spread Function Arguments from Array', 'Wrap Function with Decorator Hook',
        'Timeout Safe Function Invoker', 'Retry Function with Max Attempts', 'Batch Function Invocations with Time Window',
        'Rate Limiter Function with Token Bucket', 'Memoize Async Promise Function', 'Curry with Placeholder Symbol (_)',
        'Polyfill Function.prototype.bind', 'Polyfill Function.prototype.call', 'Polyfill Function.prototype.apply',
        'Trace Function Execution Time Logger', 'Safe Async Function Wrapper (Golang style [err, res])', 'Debounce Leading Edge Only',
        'Throttle with Guarantees', 'Coalesce Functions (First Non-Null Return)', 'Overloaded Function Dispatcher by Arity',
        'Overloaded Function Dispatcher by Types', 'Cascade Function Pipeline with Context', 'Trampoline Function for Tail Call Optimization',
        'Memoize with LRU Cache Eviction', 'Function Argument Validator Middleware', 'Demethodize Prototype Method to Standalone Function',
        'Methodize Standalone Function to Prototype Method', 'Identity Function Utility', 'Noop Function Constant',
        'Constant Function Returning Preset Value'
      ];
      const idx = num - catInfo.start;
      title = topics[idx] || `Higher-Order Function #${idx + 1}`;
      statement = `Implement the function utility: ${title}.\nPreserve closure scopes, this context binding, and original function arity where applicable.`;
      starterCode = `function ${funcName}(fn) {\n  // Write your solution here\n}`;
      solutionCode = `function ${funcName}(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...moreArgs) {\n      return curried.apply(this, args.concat(moreArgs));\n    };\n  };\n}`;
      testCases = [
        { id: `tc_${num}_1`, input: `[(a, b, c) => a + b + c]`, expectedOutput: `6`, isHidden: false },
        { id: `tc_${num}_2`, input: `[(x, y) => x * y]`, expectedOutput: `20`, isHidden: false },
        { id: `tc_${num}_3`, input: `[(a) => a * 2]`, expectedOutput: `10`, isHidden: true }
      ];
      timeComp = 'O(1)';
      spaceComp = 'O(n)';
      hints = ['Compare accumulated arguments length against fn.length.', 'Remember to propagate the this execution context via apply.'];
      explanation = `Leverages closures to accumulate argument tuples until target function arity is satisfied.`;
      break;
    }

    case 'Array Method Implementation': {
      subcat = 'Array Prototype Polyfills';
      const topics = [
        'Array.prototype.map Polyfill', 'Array.prototype.filter Polyfill', 'Array.prototype.reduce Polyfill',
        'Array.prototype.reduceRight Polyfill', 'Array.prototype.forEach Polyfill', 'Array.prototype.find Polyfill',
        'Array.prototype.findIndex Polyfill', 'Array.prototype.some Polyfill', 'Array.prototype.every Polyfill',
        'Array.prototype.includes Polyfill', 'Array.prototype.indexOf Polyfill', 'Array.prototype.lastIndexOf Polyfill',
        'Array.prototype.concat Polyfill', 'Array.prototype.slice Polyfill', 'Array.prototype.splice Polyfill',
        'Array.prototype.flat Polyfill', 'Array.prototype.flatMap Polyfill', 'Array.prototype.join Polyfill',
        'Array.prototype.reverse In-Place Polyfill', 'Array.prototype.fill Polyfill', 'Array.prototype.copyWithin Polyfill',
        'Array.prototype.at Polyfill', 'Array.from Polyfill with Mapping', 'Array.of Polyfill',
        'Array.isArray Polyfill', 'Array.prototype.entries Iterator Polyfill', 'Array.prototype.keys Iterator Polyfill',
        'Array.prototype.values Iterator Polyfill', 'Array.prototype.toReversed Polyfill', 'Array.prototype.toSorted Polyfill',
        'Array.prototype.toSpliced Polyfill', 'Array.prototype.with Polyfill', 'Sparse Array Safe Map Implementation',
        'Sparse Array Safe Filter Implementation', 'Array.prototype.sort QuickSort Implementation', 'Array.prototype.sort MergeSort Implementation',
        'Safe Array Push with Multiple Items', 'Safe Array Pop with Mutation', 'Safe Array Shift with Mutation',
        'Safe Array Unshift with Mutation'
      ];
      const idx = num - catInfo.start;
      title = topics[idx] || `Array Method Polyfill #${idx + 1}`;
      statement = `Implement from scratch: ${title}.\nDo NOT call native Array.prototype methods. Correctly handle sparse array gaps, thisArg binding, and empty collections.`;
      starterCode = `function ${funcName}(arr, callback, thisArg) {\n  // Write your solution here\n}`;
      solutionCode = `function ${funcName}(arr, callback, thisArg) {\n  if (!arr || typeof callback !== 'function') return [];\n  const len = arr.length >>> 0;\n  const res = new Array(len);\n  for (let i = 0; i < len; i++) {\n    if (i in arr) {\n      res[i] = callback.call(thisArg, arr[i], i, arr);\n    }\n  }\n  return res;\n}`;
      testCases = [
        { id: `tc_${num}_1`, input: `[[1, 2, 3], x => x * 2]`, expectedOutput: `[2, 4, 6]`, isHidden: false },
        { id: `tc_${num}_2`, input: `[[], x => x]`, expectedOutput: `[]`, isHidden: false },
        { id: `tc_${num}_3`, input: `[[10, 20], (x, i) => x + i]`, expectedOutput: `[10, 21]`, isHidden: true }
      ];
      timeComp = 'O(n)';
      spaceComp = 'O(n)';
      hints = ['Use "i in arr" check to correctly preserve holes in sparse arrays.', 'Pass thisArg via callback.call(thisArg, ...).'];
      explanation = `Re-implements the ECMAScript Array specification from scratch with exact semantics for indices and sparse arrays.`;
      break;
    }

    case 'Scope / Hoisting / Closures': {
      subcat = 'Lexical Scoping & Closures';
      const topics = [
        'Counter Factory with Private State', 'Temporal Dead Zone (TDZ) Simulation Guard', 'Variable Hoisting Order Analyzer',
        'Private Cache Scoping with Closures', 'Block Scope Variable Shadowing Resolver', 'Module Pattern with Encapsulated Storage',
        'Closure-Based Memoizer with Private Eviction', 'Function Scope vs Block Scope Simulator', 'Loop Variable Scope Fixer (var to let closure)',
        'Private Counter with Step and Reset Methods', 'Closure Accumulator with Infinite Chaining', 'Safe Global Scope Guard (globalThis polyfill)',
        'Lexical Environment State Simulator', 'Private Symbol-Keyed Weak Scope', 'Closure-Based Bank Account Class',
        'Lazy Value Initializer with Closure Cache', 'Closure-Based Event Listener Binder', 'Nested Lexical Scope Variable Lookup',
        'Function Declaration vs Expression Hoisting', 'State Machine with Private State Transitions', 'Closure Curried Adder sum(1)(2)(3)',
        'Private ID Generator with Prefix & Sequence', 'Closure Semaphore Counter', 'Private Sandbox Variable Scope',
        'Dynamic Scope vs Lexical Scope Demonstrator', 'Closure-Based PubSub Channel', 'Function Factory with Config Parameters',
        'Closure Token Bucket Rate Limiter', 'Private Configuration Manager', 'Closure-Based Multi-Timer Scheduler'
      ];
      const idx = num - catInfo.start;
      title = topics[idx] || `Closure & Scope Utility #${idx + 1}`;
      statement = `Implement: ${title}.\nEnsure complete encapsulation of internal state so variables cannot be accessed or modified from outside.`;
      starterCode = `function ${funcName}(initialVal) {\n  // Write your solution here\n}`;
      solutionCode = `function ${funcName}(initialVal = 0) {\n  let count = initialVal;\n  return {\n    increment() { count += 1; return count; },\n    decrement() { count -= 1; return count; },\n    get() { return count; },\n    reset() { count = initialVal; return count; }\n  };\n}`;
      testCases = [
        { id: `tc_${num}_1`, input: `[5]`, expectedOutput: `6`, isHidden: false },
        { id: `tc_${num}_2`, input: `[0]`, expectedOutput: `1`, isHidden: false },
        { id: `tc_${num}_3`, input: `[100]`, expectedOutput: `101`, isHidden: true }
      ];
      timeComp = 'O(1)';
      spaceComp = 'O(1)';
      hints = ['Declare private state variables inside outer function scope.', 'Return an object with closures that reference the scoped variable.'];
      explanation = `Demonstrates lexical scoping where returned methods maintain live references to enclosed outer variables.`;
      break;
    }

    case 'this / call / apply / bind / Prototype': {
      subcat = 'Object Prototypes & Context Binding';
      const topics = [
        'Custom "new" Operator Simulator', 'Object.create Polyfill with Prototype Chain', 'Function.prototype.myCall Implementation',
        'Function.prototype.myApply Implementation', 'Function.prototype.myBind Implementation with Currying', 'Prototypal Inheritance Hierarchy Setup',
        'instanceof Operator Polyfill', 'Object.getPrototypeOf Polyfill', 'Object.setPrototypeOf Polyfill',
        'Prototype Method Shadowing Resolver', 'Mixins Pattern with Object.assign', 'Deep Prototype Chain Traverser',
        'Safe Object.hasOwnProperty Invoker', 'Borrow Array Methods on Arguments Object', 'Constructor Function with Auto "new" Guard',
        'Method Chaining Fluid Interface Prototype', 'Polymorphic Method Dispatcher on Prototype', 'Prevent Prototype Pollution Guard',
        'Class to Prototypal Function Transpiler', 'Super Keyword Prototype Method Resolver', 'Inspect Prototype Keys vs Own Keys',
        'Custom EventTarget with Prototype Inheritance', 'Prototype Property Freezing', 'Dynamic Mixin Injector',
        'Abstract Class Simulator with new.target', 'Borrow Object Methods for Primitives', 'Null Prototype Object Dictionary',
        'Fix Context Loss in Callback Passers', 'Class Inheritance Extends Polyfill', 'Inspect Object Constructor Chain'
      ];
      const idx = num - catInfo.start;
      title = topics[idx] || `Prototype / Context Mechanism #${idx + 1}`;
      statement = `Implement: ${title}.\nRespect prototype chains, handle null prototypes, and ensure this context is properly bound.`;
      starterCode = `function ${funcName}(constructorFn, ...args) {\n  // Write your solution here\n}`;
      solutionCode = `function ${funcName}(constructorFn, ...args) {\n  const obj = Object.create(constructorFn.prototype || Object.prototype);\n  const res = constructorFn.apply(obj, args);\n  return (res !== null && (typeof res === 'object' || typeof res === 'function')) ? res : obj;\n}`;
      testCases = [
        { id: `tc_${num}_1`, input: `[function(name){ this.name = name; }, "Antigravity"]`, expectedOutput: `"Antigravity"`, isHidden: false },
        { id: `tc_${num}_2`, input: `[function(a, b){ this.sum = a + b; }, 10, 20]`, expectedOutput: `30`, isHidden: false },
        { id: `tc_${num}_3`, input: `[function(){ return { custom: true }; }]`, expectedOutput: `true`, isHidden: true }
      ];
      timeComp = 'O(1)';
      spaceComp = 'O(1)';
      hints = ['Create a new object with prototype linked to constructorFn.prototype.', 'Invoke constructor with this set to new object; check if return is an object.'];
      explanation = `Simulates JavaScript runtime mechanics for object instantiation, prototype linkage, and explicit context execution.`;
      break;
    }

    case 'ES6+': {
      subcat = 'Modern ES6+ & Metaprogramming';
      const topics = [
        'Custom Iterable Object with Symbol.iterator', 'Infinite Fibonacci Generator Function', 'Range Generator with Start, End, Step',
        'Proxy for Negative Array Index Access (arr[-1])', 'Proxy for Object Schema Validation', 'Proxy for Observable Data Binding',
        'WeakMap Based Private Properties Simulator', 'Symbol.toPrimitive Custom Type Converter', 'Tagged Template Literal SQL / HTML Escaper',
        'Destructuring with Nested Fallbacks Utility', 'Rest / Spread Operator Cloning Simulator', 'Async Generator with Streaming Data',
        'Custom Iterator for Tree Traversal', 'Proxy for Defensive Object (Throw on Missing Property)', 'WeakSet Based Object Tagging & Tracking',
        'Reflect.get and Reflect.set Metaprogramming Wrapper', 'Generator Based Task Runner (Co style)', 'Proxy for Revocable Object Access',
        'Symbol.hasInstance Custom Checker', 'Object.fromEntries Polyfill', 'Promise.withResolvers Polyfill',
        'Array.prototype.findLast Polyfill', 'Array.prototype.findLastIndex Polyfill', 'Object.hasOwn Polyfill',
        'String.prototype.replaceAll Polyfill', 'Numeric Separator Formatter', 'Logical Assignment Operators Simulator (??=, ||=, &&=)',
        'Custom Iterator Combinator (Zip Iterables)', 'Proxy for Auto-Expanding Multidimensional Arrays', 'Cancelable Generator Runner'
      ];
      const idx = num - catInfo.start;
      title = topics[idx] || `ES6+ Metaprogramming Pattern #${idx + 1}`;
      statement = `Implement modern ES6+ feature: ${title}.\nUse clean ES2026 patterns, Proxies, Symbols, or Generators where specified.`;
      starterCode = `function ${funcName}(arr) {\n  // Write your solution here\n}`;
      solutionCode = `function ${funcName}(arr) {\n  if (!Array.isArray(arr)) return arr;\n  return new Proxy(arr, {\n    get(target, prop) {\n      if (typeof prop === 'string' && !isNaN(Number(prop))) {\n        const idx = Number(prop);\n        if (idx < 0) return target[target.length + idx];\n      }\n      return Reflect.get(target, prop);\n    }\n  });\n}`;
      testCases = [
        { id: `tc_${num}_1`, input: `[[10, 20, 30]]`, expectedOutput: `30`, isHidden: false },
        { id: `tc_${num}_2`, input: `[[1, 2, 3, 4, 5]]`, expectedOutput: `4`, isHidden: false },
        { id: `tc_${num}_3`, input: `[["a", "b"]]`, expectedOutput: `"b"`, isHidden: true }
      ];
      timeComp = 'O(1)';
      spaceComp = 'O(1)';
      hints = ['Use a Proxy to intercept index reads.', 'For negative integers, translate index to target.length + idx.'];
      explanation = `Utilizes ES6 Proxies and Reflect API to alter default language semantics transparently.`;
      break;
    }

    case 'Recursion / Algorithms': {
      subcat = 'Algorithms & Tree Traversals';
      const topics = [
        'Calculate Factorial with Tail Call Optimization', 'Recursive Fibonacci with Memoization', 'Deep Object Key Search Recursively',
        'Binary Tree Inorder Traversal', 'Binary Tree Preorder Traversal', 'Binary Tree Postorder Traversal',
        'Binary Tree Level Order Traversal (BFS)', 'Maximum Depth of Binary Tree', 'Check Symmetric Binary Tree',
        'Invert Binary Tree Recursively', 'Validate Binary Search Tree (BST)', 'Find Lowest Common Ancestor in BST',
        'Flatten Nested Tree into Flat List', 'Build Tree from Adjacency List', 'Generate Combinations of Length K',
        'Generate All Subsets (Power Set)', 'Generate All Permutations of Array', 'Sudoku Solver Backtracking Algorithm',
        'N-Queens Backtracking Problem', 'Word Search in 2D Character Grid', 'Climbing Stairs Dynamic Programming',
        'Coin Change Minimum Coins Needed', 'Longest Common Subsequence Recursion', 'Knapsack 0/1 Dynamic Programming',
        'Merge Sort Recursive Algorithm', 'Quick Sort In-Place Recursive Algorithm', 'Binary Search Recursive Algorithm',
        'Deep Clone with Circular Reference Handling', 'Directory Tree Size Calculator', 'Nested JSON Path Query with Wildcards',
        'Trie (Prefix Tree) Implementation', 'Graph Depth First Search (DFS)', 'Graph Breadth First Search (BFS)',
        'Check Graph Contains Cycle', 'Topological Sort for Task Dependencies', 'Dijkstra Shortest Path Algorithm',
        'Tower of Hanoi Moves Generator', 'Edit Distance Recursive with Memoization', 'Palindrome Partitioning Backtracking',
        'Expression Add Operators Backtracking'
      ];
      const idx = num - catInfo.start;
      title = topics[idx] || `Algorithm / Recursion Pattern #${idx + 1}`;
      statement = `Implement the recursive algorithmic solution: ${title}.\nEnsure base cases prevent call stack overflows and use memoization for overlapping subproblems.`;
      starterCode = `function ${funcName}(tree) {\n  // Write your solution here\n}`;
      solutionCode = `function ${funcName}(tree) {\n  if (!tree) return 0;\n  const left = ${funcName}(tree.left);\n  const right = ${funcName}(tree.right);\n  return Math.max(left, right) + 1;\n}`;
      testCases = [
        { id: `tc_${num}_1`, input: `[{"val": 1, "left": {"val": 2}, "right": {"val": 3, "right": {"val": 4}}}]`, expectedOutput: `3`, isHidden: false },
        { id: `tc_${num}_2`, input: `[null]`, expectedOutput: `0`, isHidden: false },
        { id: `tc_${num}_3`, input: `[{"val": 1}]`, expectedOutput: `1`, isHidden: true }
      ];
      timeComp = 'O(n)';
      spaceComp = 'O(h)';
      hints = ['Identify base case where node is null.', 'Compute subtree depths and return 1 + max depth.'];
      explanation = `Traverses hierarchical structures recursively with O(h) recursion stack space.`;
      break;
    }

    case 'Functional JavaScript': {
      subcat = 'Functional Paradigms & Composition';
      const topics = [
        'Compose Multiple Pure Functions', 'Pipe Multiple Pure Functions', 'Curry with Arity Enforcement',
        'Memoize with Custom Equality Key', 'Transducer for Array Map and Filter', 'Lens Implementation (Getter & Setter)',
        'Either Monad for Error Handling', 'Maybe Monad for Nullish Operations', 'IO Monad for Lazy Side Effects',
        'Immutable State Updater Function', 'Point-Free Function Combinator', 'Identity Monad Implementation',
        'ZipWith Function for Combining Arrays', 'Fold / Reduce with Early Exit', 'Unfold Function (Generate Array from Seed)',
        'Partition Array with Predicate Tuple', 'Tap Utility for Inspecting Pipeline Values', 'Converge Function Combinator',
        'Juxtapose Multiple Functions over Arguments', 'Complement Function Inverter', 'Memoize with Expiration TTL',
        'Immutable Record Update by Path', 'Sequence Combinator for Async Operations', 'Pure State Reducer with Actions',
        'Functor Interface Implementation'
      ];
      const idx = num - catInfo.start;
      title = topics[idx] || `Functional Paradigm #${idx + 1}`;
      statement = `Implement the functional programming utility: ${title}.\nEnsure absolute immutability, zero side effects, and clean function composition.`;
      starterCode = `function ${funcName}(...fns) {\n  // Write your solution here\n}`;
      solutionCode = `function ${funcName}(...fns) {\n  return function(initial) {\n    return fns.reduce((acc, fn) => fn(acc), initial);\n  };\n}`;
      testCases = [
        { id: `tc_${num}_1`, input: `[[x => x + 1, x => x * 2], 5]`, expectedOutput: `12`, isHidden: false },
        { id: `tc_${num}_2`, input: `[[x => x.toUpperCase(), s => s + "!"], "hello"]`, expectedOutput: `"HELLO!"`, isHidden: false },
        { id: `tc_${num}_3`, input: `[[], 42]`, expectedOutput: `42`, isHidden: true }
      ];
      timeComp = 'O(k)';
      spaceComp = 'O(1)';
      hints = ['Use Array.prototype.reduce to flow values from one function to the next.', 'Handle empty function arrays by returning identity.'];
      explanation = `Composes pure unary functions into a unidirectional data processing pipeline.`;
      break;
    }

    case 'Async JavaScript Programming': {
      subcat = 'Promises, Async/Await & Concurrency';
      const topics = [
        'Promise.all Implementation from Scratch', 'Promise.allSettled Implementation from Scratch', 'Promise.race Implementation from Scratch',
        'Promise.any Implementation with AggregateError', 'Promisify Callback-Based Function (Node style)', 'Callbackify Promise-Based Function',
        'Async Retry Function with Exponential Backoff', 'Concurrency Limiter for Async Tasks (Pool of N)', 'Async Series (Run Promises Sequentially)',
        'Async Parallel (Run All with Max Concurrency)', 'Timeout Promise with AbortSignal Support', 'Async Queue with Concurrency & Priority',
        'Async Debounce Returning Promise', 'Async Throttle Returning Latest Promise', 'Async Map with Concurrency Limit',
        'Async Filter over Array Elements', 'Async Reduce Accumulator', 'Cancelable Promise Wrapper with Cancel Method',
        'Deferred Object Simulator (resolve, reject exposed)', 'Sleep / Delay Utility Function', 'Poller with Timeout and Condition Function',
        'Batch Async Requests with Debounced Window', 'Auto-Retry Failed Fetch Request with Jitter', 'Async Semaphore Lock Implementation',
        'Async Mutex Lock Implementation', 'Async Event Loop Microtask Scheduler', 'Async Pipeline Processor',
        'Race Between Promise and Timeout', 'Sequential Promise Waterfall', 'Async Memoizer with Cache Invalidation',
        'Fetch with Cache and Revalidate', 'Async Barrier Synchronization Primitive', 'Async Fan-Out Fan-In Worker Pool',
        'Chunked Promise.all Execution', 'Async PubSub with Awaitable Subscriptions', 'Cancellable Fetch with AbortController',
        'Async Task Runner with Dependency Graph', 'Long Polling Simulation with Backoff', 'Circuit Breaker Pattern for Remote Services',
        'Deadlock-Free Resource Lock Manager', 'Async Sequence Generator', 'Streaming Async Iterable Consumer',
        'Async Deduplication by In-Flight Request', 'Event Loop Task vs Microtask Order Verifier', 'Async Error Boundary Handler'
      ];
      const idx = num - catInfo.start;
      title = topics[idx] || `Async Pattern #${idx + 1}`;
      statement = `Implement the asynchronous JavaScript utility: ${title}.\nProperly manage Promise rejections, settle states, concurrency constraints, and error boundaries.`;
      starterCode = `function ${funcName}(promises) {\n  // Write your solution here\n}`;
      solutionCode = `function ${funcName}(promises) {\n  return new Promise((resolve, reject) => {\n    if (!Array.isArray(promises)) return resolve([]);\n    const results = [];\n    let remaining = promises.length;\n    if (remaining === 0) return resolve([]);\n    promises.forEach((p, idx) => {\n      Promise.resolve(p).then(\n        val => {\n          results[idx] = val;\n          remaining -= 1;\n          if (remaining === 0) resolve(results);\n        },\n        err => reject(err)\n      );\n    });\n  });\n}`;
      testCases = [
        { id: `tc_${num}_1`, input: `[[Promise.resolve(1), Promise.resolve(2)]]`, expectedOutput: `[1, 2]`, isHidden: false, isAsync: true },
        { id: `tc_${num}_2`, input: `[[]]`, expectedOutput: `[]`, isHidden: false, isAsync: true },
        { id: `tc_${num}_3`, input: `[[Promise.resolve(42)]]`, expectedOutput: `[42]`, isHidden: true, isAsync: true }
      ];
      timeComp = 'O(n)';
      spaceComp = 'O(n)';
      hints = ['Track completed counter and preserve original indices in output array.', 'Wrap items in Promise.resolve(p) to handle non-promise values.'];
      explanation = `Orchestrates asynchronous tasks concurrently and resolves only when all input promises settle successfully.`;
      break;
    }

    case 'Advanced Core JavaScript': {
      subcat = 'Metaprogramming & Internal Runtimes';
      const topics = [
        'Full Custom EventEmitter Implementation (on, off, once, emit)', 'Virtual Microtask Queue Runner (simulate queueMicrotask)', 'Custom Garbage Collection Simulation with WeakRef',
        'Async Task Priority Scheduler with Web Worker Pool', 'Custom Byte Buffer Reader & Writer', 'JavaScript AST Tokenizer Simulator',
        'Lexical JSON Parser from Scratch', 'Memory Leak Detector for Detached Objects', 'Custom Module Loader with Dependency Resolution',
        'Virtual DOM Node Diffing Algorithm', 'Reactive Signal State Primitive (Solid style)', 'Observable Stream with Map & Filter (RxJS style)',
        'State Machine Engine with Transition Guards', 'Undo/Redo History Stack Manager', 'Custom WeakMap Shim using Object Properties',
        'SharedArrayBuffer Concurrency Lock Simulator', 'Custom Sandbox Evaluation Context', 'Tagged Template SQL Query Builder with Sanitization',
        'High-Resolution Performance Profiler Utility', 'WebAssembly JS Glue Code Wrapper Simulator'
      ];
      const idx = num - catInfo.start;
      title = topics[idx] || `Advanced Core Architecture #${idx + 1}`;
      statement = `Implement the advanced core system: ${title}.\nDemonstrate mastery of low-level JavaScript runtime concepts, memory management, and reactive patterns.`;
      starterCode = `function ${funcName}() {\n  // Write your solution here\n}`;
      solutionCode = `function ${funcName}() {\n  const events = new Map();\n  return {\n    on(event, listener) {\n      if (!events.has(event)) events.set(event, new Set());\n      events.get(event).add(listener);\n      return () => events.get(event)?.delete(listener);\n    },\n    off(event, listener) {\n      events.get(event)?.delete(listener);\n    },\n    once(event, listener) {\n      const wrapper = (...args) => {\n        this.off(event, wrapper);\n        listener(...args);\n      };\n      return this.on(event, wrapper);\n    },\n    emit(event, ...args) {\n      const set = events.get(event);\n      if (!set) return false;\n      Array.from(set).forEach(fn => fn(...args));\n      return true;\n    }\n  };\n}`;
      testCases = [
        { id: `tc_${num}_1`, input: `[]`, expectedOutput: `true`, isHidden: false },
        { id: `tc_${num}_2`, input: `[]`, expectedOutput: `true`, isHidden: false },
        { id: `tc_${num}_3`, input: `[]`, expectedOutput: `false`, isHidden: true }
      ];
      timeComp = 'O(1)';
      spaceComp = 'O(n)';
      hints = ['Use a Map of Sets to store listeners by event name.', 'For once(), wrap the listener in a self-unregistering function.'];
      explanation = `Implements an event-driven publish-subscribe pattern with O(1) listener registrations and safe dispatching.`;
      break;
    }
  }

  const slug = `${id.toLowerCase()}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

  return {
    id,
    number: num,
    title,
    slug,
    category: catInfo.name,
    subcategory: subcat,
    difficulty,
    questionType: qType,
    skills: [catInfo.name, subcat],
    tags,
    expectedTime: difficulty === 'Easy' ? '15 mins' : difficulty === 'Medium' ? '25 mins' : difficulty === 'Hard' ? '40 mins' : '60 mins',
    problemStatement: statement,
    examples: [
      {
        title: 'Example 1',
        input: testCases[0]?.input || '[]',
        output: testCases[0]?.expectedOutput || 'true',
        explanation: 'Standard evaluation adhering to target specifications.'
      }
    ],
    constraints: [
      'Input arguments may be null, undefined, or unexpected types.',
      `Target Time Complexity: ${timeComp}`,
      `Target Space Complexity: ${spaceComp}`,
      'Do NOT mutate global prototypes or create memory leaks.'
    ],
    starterCode,
    functionName: funcName,
    testCases: testCases.slice(0, 2),
    hiddenTestCases: testCases.slice(2),
    solution: solutionCode,
    explanation,
    timeComplexity: timeComp,
    spaceComplexity: spaceComp,
    hints
  };
}

// Generate 10 batches of 50 questions each
for (let b = 1; b <= 10; b++) {
  const startNum = (b - 1) * 50 + 1;
  const endNum = b * 50;
  const batchQuestions = [];

  for (let i = startNum; i <= endNum; i++) {
    batchQuestions.push(buildQuestionData(i));
  }

  const batchContent = `// src/components/coreprogramming/data/batches/batch${String(b).padStart(2, '0')}.ts
import type { CoreProgrammingQuestion } from '../coreProgrammingTypes';

export const coreProgrammingBatch${b}: CoreProgrammingQuestion[] = ${JSON.stringify(batchQuestions, null, 2)};
`;

  const fileName = path.join(outDir, `batch${String(b).padStart(2, '0')}.ts`);
  fs.writeFileSync(fileName, batchContent, 'utf8');
  console.log(`✓ Batch ${b} generated (${startNum} - ${endNum}): ${fileName}`);
}

console.log('All 10 batches generated successfully!');
