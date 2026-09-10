// src/components/coreprogramming/data/batches/batch06.ts
import type { CoreProgrammingQuestion } from '../coreProgrammingTypes';

export const batch06: CoreProgrammingQuestion[] = [
  {
    "id": "JS-P251",
    "number": 251,
    "title": "Implement Curry Function",
    "slug": "js-p251-implement-curry-function",
    "category": "Functional JavaScript",
    "subcategory": "Currying",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Currying",
      "Recursion"
    ],
    "tags": [
      "curry",
      "functions",
      "functional"
    ],
    "expectedTime": "10 mins",
    "summary": "Convert a function of multiple arguments into a sequence of functions.",
    "problemStatement": "Write a function `curry(fn)` that translates a function callable as `f(a, b, c)` into callable as `f(a)(b)(c)` or `f(a, b)(c)`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(a, b, c) => a + b + c, [[1], [2], [3]]]",
        "output": "6",
        "explanation": "curried(1)(2)(3) => 6"
      }
    ],
    "constraints": [
      "fn.length specifies the expected number of arguments."
    ],
    "starterCode": "function curry(fn) {\n  // Write your solution here\n}",
    "functionName": "curry",
    "testCases": [
      {
        "id": "tc_251_1",
        "input": "[(a, b, c) => a + b + c, [[1], [2], [3]]]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "id": "tc_251_2",
        "input": "[(a, b, c) => a + b + c, [[1, 2], [3]]]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "id": "tc_251_3",
        "input": "[(a, b, c) => a + b + c, [[1, 2, 3]]]",
        "expectedOutput": "6",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_251_4",
        "input": "[(a, b) => a * b, [[3], [4]]]",
        "expectedOutput": "12",
        "isHidden": true
      }
    ],
    "solution": "function curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...moreArgs) {\n      return curried.apply(this, args.concat(moreArgs));\n    };\n  };\n}",
    "explanation": "Compare collected args.length to fn.length. When sufficient, invoke fn; otherwise return a function collecting more arguments.",
    "timeComplexity": "O(1) per invocation",
    "spaceComplexity": "O(n) where n is arity",
    "hints": [
      "Check if args.length >= fn.length. If so, return fn(...args)."
    ]
  },
  {
    "id": "JS-P252",
    "number": 252,
    "title": "Implement Curry with Fixed Arity",
    "slug": "js-p252-implement-curry-with-fixed-arity",
    "category": "Functional JavaScript",
    "subcategory": "Currying",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Currying"
    ],
    "tags": [
      "curry",
      "arity",
      "functions"
    ],
    "expectedTime": "10 mins",
    "summary": "Curry a function with an explicit arity parameter rather than fn.length.",
    "problemStatement": "Write a function `curryN(arity, fn)` that curries `fn` until `arity` arguments have been provided.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[2, (...args) => args.reduce((a, b) => a + b, 0), [[10], [20]]]",
        "output": "30",
        "explanation": "Collects 2 arguments then evaluates."
      }
    ],
    "constraints": [
      "arity is a positive integer."
    ],
    "starterCode": "function curryN(arity, fn) {\n  // Write your solution here\n}",
    "functionName": "curryN",
    "testCases": [
      {
        "id": "tc_252_1",
        "input": "[2, (...args) => args.reduce((a, b) => a + b, 0), [[10], [20]]]",
        "expectedOutput": "30",
        "isHidden": false
      },
      {
        "id": "tc_252_2",
        "input": "[3, (...args) => args.join('-'), [[ 'a' ], [ 'b', 'c' ]]]",
        "expectedOutput": "'a-b-c'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_252_3",
        "input": "[1, x => x * 2, [[5]]]",
        "expectedOutput": "10",
        "isHidden": true
      }
    ],
    "solution": "function curryN(arity, fn) {\n  return function curried(...args) {\n    if (args.length >= arity) {\n      return fn.apply(this, args);\n    }\n    return function(...moreArgs) {\n      return curried.apply(this, args.concat(moreArgs));\n    };\n  };\n}",
    "explanation": "Curry until args.length >= arity parameter.",
    "timeComplexity": "O(1) per invocation",
    "spaceComplexity": "O(arity)",
    "hints": [
      "Use arity instead of fn.length to test completion."
    ]
  },
  {
    "id": "JS-P253",
    "number": 253,
    "title": "Implement Function Pipe",
    "slug": "js-p253-implement-function-pipe",
    "category": "Functional JavaScript",
    "subcategory": "Composition",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Composition",
      "Higher-Order Functions"
    ],
    "tags": [
      "pipe",
      "composition",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Perform left-to-right function composition.",
    "problemStatement": "Write a function `pipe(...fns)` that takes multiple functions and returns a new function that evaluates functions left-to-right on its input.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[x => x + 1, x => x * 2], [[5]]]",
        "output": "12",
        "explanation": "(5 + 1) * 2 = 12"
      }
    ],
    "constraints": [
      "Empty pipe returns identity."
    ],
    "starterCode": "function pipe(...fns) {\n  // Write your solution here\n}",
    "functionName": "pipe",
    "testCases": [
      {
        "id": "tc_253_1",
        "input": "[[x => x + 1, x => x * 2], [[5]]]",
        "expectedOutput": "12",
        "isHidden": false
      },
      {
        "id": "tc_253_2",
        "input": "[[s => s.trim(), s => s.toUpperCase(), s => `!${s}!`], [['  hello  ']]]",
        "expectedOutput": "'!HELLO!'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_253_3",
        "input": "[[], [[42]]]",
        "expectedOutput": "42",
        "isHidden": true
      }
    ],
    "solution": "function pipe(...fns) {\n  return function(initial) {\n    return fns.reduce((acc, fn) => fn(acc), initial);\n  };\n}",
    "explanation": "Reduce functions from left to right passing accumulator.",
    "timeComplexity": "O(k) where k is number of functions",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use fns.reduce with initial value."
    ]
  },
  {
    "id": "JS-P254",
    "number": 254,
    "title": "Implement Function Compose",
    "slug": "js-p254-implement-function-compose",
    "category": "Functional JavaScript",
    "subcategory": "Composition",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Composition",
      "Higher-Order Functions"
    ],
    "tags": [
      "compose",
      "composition",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Perform right-to-left function composition.",
    "problemStatement": "Write a function `compose(...fns)` that takes multiple functions and returns a new function that evaluates functions right-to-left.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[x => x * 2, x => x + 1], [[5]]]",
        "output": "12",
        "explanation": "(5 + 1) * 2 = 12"
      }
    ],
    "constraints": [
      "Empty compose returns identity."
    ],
    "starterCode": "function compose(...fns) {\n  // Write your solution here\n}",
    "functionName": "compose",
    "testCases": [
      {
        "id": "tc_254_1",
        "input": "[[x => x * 2, x => x + 1], [[5]]]",
        "expectedOutput": "12",
        "isHidden": false
      },
      {
        "id": "tc_254_2",
        "input": "[[x => x + '!', x => x.toUpperCase()], [['world']]]",
        "expectedOutput": "'WORLD!'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_254_3",
        "input": "[[], [[99]]]",
        "expectedOutput": "99",
        "isHidden": true
      }
    ],
    "solution": "function compose(...fns) {\n  return function(initial) {\n    return fns.reduceRight((acc, fn) => fn(acc), initial);\n  };\n}",
    "explanation": "Reduce functions from right to left using reduceRight.",
    "timeComplexity": "O(k)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use fns.reduceRight."
    ]
  },
  {
    "id": "JS-P255",
    "number": 255,
    "title": "Implement Memoize",
    "slug": "js-p255-implement-memoize",
    "category": "Functional JavaScript",
    "subcategory": "Optimization",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Caching",
      "Memoization"
    ],
    "tags": [
      "memoize",
      "cache",
      "performance"
    ],
    "expectedTime": "10 mins",
    "summary": "Cache the results of function calls based on arguments.",
    "problemStatement": "Write a function `memoize(fn)` that caches return values based on stringified arguments so repeated calls return the cached result.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[x => x * 2, [[3], [3], [4]]]",
        "output": "[6, 6, 8]",
        "explanation": "Repeated call with 3 uses cached 6."
      }
    ],
    "constraints": [
      "Use JSON.stringify as default cache key."
    ],
    "starterCode": "function memoize(fn) {\n  // Write your solution here\n}",
    "functionName": "memoize",
    "testCases": [
      {
        "id": "tc_255_1",
        "input": "[x => x * 2, [[3], [3], [4]]]",
        "expectedOutput": "[6, 6, 8]",
        "isHidden": false
      },
      {
        "id": "tc_255_2",
        "input": "[(a, b) => a + b, [[1, 2], [1, 2], [2, 3]]]",
        "expectedOutput": "[3, 3, 5]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_255_3",
        "input": "[s => s.length, [['cat'], ['cat']]]",
        "expectedOutput": "[3, 3]",
        "isHidden": true
      }
    ],
    "solution": "function memoize(fn) {\n  const cache = new Map();\n  return function(...args) {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn.apply(this, args);\n    cache.set(key, result);\n    return result;\n  };\n}",
    "explanation": "Store results in Map keyed by JSON.stringify(args).",
    "timeComplexity": "O(1) amortized cache lookup",
    "spaceComplexity": "O(m) entries",
    "hints": [
      "Store computed results in a Map keyed by JSON.stringify(args)."
    ]
  },
  {
    "id": "JS-P256",
    "number": 256,
    "title": "Implement Memoize with Custom Key Resolver",
    "slug": "js-p256-implement-memoize-with-custom-key-resolver",
    "category": "Functional JavaScript",
    "subcategory": "Optimization",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Caching",
      "Resolver"
    ],
    "tags": [
      "memoize",
      "resolver",
      "functional"
    ],
    "expectedTime": "10 mins",
    "summary": "Memoize a function accepting an optional custom key resolver function.",
    "problemStatement": "Write a function `memoizeWithResolver(fn, resolver)` that caches results using the key returned by `resolver(...args)`. If `resolver` is omitted, use `JSON.stringify(args)`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(obj) => obj.val * 2, (obj) => obj.id, [[{id: 1, val: 5}], [{id: 1, val: 99}]]]",
        "output": "[10, 10]",
        "explanation": "Second call reuses cache for id 1."
      }
    ],
    "constraints": [
      "Support optional resolver."
    ],
    "starterCode": "function memoizeWithResolver(fn, resolver) {\n  // Write your solution here\n}",
    "functionName": "memoizeWithResolver",
    "testCases": [
      {
        "id": "tc_256_1",
        "input": "[(obj) => obj.val * 2, (obj) => obj.id, [[{id: 1, val: 5}], [{id: 1, val: 99}]]]",
        "expectedOutput": "[10, 10]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_256_2",
        "input": "[(a, b) => a * b, undefined, [[2, 3], [2, 3]]]",
        "expectedOutput": "[6, 6]",
        "isHidden": true
      }
    ],
    "solution": "function memoizeWithResolver(fn, resolver) {\n  const cache = new Map();\n  return function(...args) {\n    const key = resolver ? resolver(...args) : JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const res = fn.apply(this, args);\n    cache.set(key, res);\n    return res;\n  };\n}",
    "explanation": "Compute key using resolver(...args) when provided, otherwise JSON.stringify(args).",
    "timeComplexity": "O(1) on cache hit",
    "spaceComplexity": "O(m)",
    "hints": [
      "Use resolver ? resolver(...args) : JSON.stringify(args)."
    ]
  },
  {
    "id": "JS-P257",
    "number": 257,
    "title": "Implement Once Function",
    "slug": "js-p257-implement-once-function",
    "category": "Functional JavaScript",
    "subcategory": "Closures",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Higher-Order Functions"
    ],
    "tags": [
      "once",
      "closures",
      "functions"
    ],
    "expectedTime": "5 mins",
    "summary": "Ensure a function is only executed on its very first call.",
    "problemStatement": "Write a function `once(fn)` that restricts `fn` to only run once. Subsequent calls return the result of the first invocation.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[x => x * 2, [[5], [10], [20]]]",
        "output": "[10, 10, 10]",
        "explanation": "Subsequent invocations return initial result 10."
      }
    ],
    "constraints": [
      "Remember first result and return it indefinitely."
    ],
    "starterCode": "function once(fn) {\n  // Write your solution here\n}",
    "functionName": "once",
    "testCases": [
      {
        "id": "tc_257_1",
        "input": "[x => x * 2, [[5], [10], [20]]]",
        "expectedOutput": "[10, 10, 10]",
        "isHidden": false
      },
      {
        "id": "tc_257_2",
        "input": "[() => Math.PI, [[], []]]",
        "expectedOutput": "[3.141592653589793, 3.141592653589793]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_257_3",
        "input": "[(a, b) => a + b, [[1, 2], [99, 1]]]",
        "expectedOutput": "[3, 3]",
        "isHidden": true
      }
    ],
    "solution": "function once(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) {\n      called = true;\n      result = fn.apply(this, args);\n    }\n    return result;\n  };\n}",
    "explanation": "Store called flag and cached result in closure.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Store called flag and result variable in closure."
    ]
  },
  {
    "id": "JS-P258",
    "number": 258,
    "title": "Implement Partial Application",
    "slug": "js-p258-implement-partial-application",
    "category": "Functional JavaScript",
    "subcategory": "Partial Application",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Partial Application"
    ],
    "tags": [
      "partial",
      "currying",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Pre-bind leading arguments to a function.",
    "problemStatement": "Write a function `partial(fn, ...partials)` that creates a function that invokes `fn` with `partials` prepended to the arguments it receives.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(a, b, c) => a + b + c, 1, 2, [[3]]]",
        "output": "6",
        "explanation": "Pre-binds 1, 2 and invokes with 3 -> 6."
      }
    ],
    "constraints": [
      "Prepend partials in left-to-right order."
    ],
    "starterCode": "function partial(fn, ...partials) {\n  // Write your solution here\n}",
    "functionName": "partial",
    "testCases": [
      {
        "id": "tc_258_1",
        "input": "[(a, b, c) => a + b + c, 1, 2, [[3]]]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "id": "tc_258_2",
        "input": "[(greet, name) => `${greet}, ${name}!`, 'Hello', [['World']]]",
        "expectedOutput": "'Hello, World!'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_258_3",
        "input": "[x => x * 10, [[5]]]",
        "expectedOutput": "50",
        "isHidden": true
      }
    ],
    "solution": "function partial(fn, ...partials) {\n  return function(...args) {\n    return fn.apply(this, partials.concat(args));\n  };\n}",
    "explanation": "Concatenate partials with newly supplied args upon invocation.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(p) where p is partials length",
    "hints": [
      "Return a function that invokes fn with [...partials, ...args]."
    ]
  },
  {
    "id": "JS-P259",
    "number": 259,
    "title": "Implement Partial Right Application",
    "slug": "js-p259-implement-partial-right-application",
    "category": "Functional JavaScript",
    "subcategory": "Partial Application",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Partial Application"
    ],
    "tags": [
      "partialRight",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Pre-bind trailing arguments to a function.",
    "problemStatement": "Write a function `partialRight(fn, ...partials)` that creates a function that invokes `fn` with `partials` appended to the arguments it receives.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(a, b, c) => `${a}-${b}-${c}`, 'tail', [['head', 'mid']]]",
        "output": "'head-mid-tail'",
        "explanation": "'tail' is appended to end."
      }
    ],
    "constraints": [
      "Append partials after arguments."
    ],
    "starterCode": "function partialRight(fn, ...partials) {\n  // Write your solution here\n}",
    "functionName": "partialRight",
    "testCases": [
      {
        "id": "tc_259_1",
        "input": "[(a, b, c) => `${a}-${b}-${c}`, 'tail', [['head', 'mid']]]",
        "expectedOutput": "'head-mid-tail'",
        "isHidden": false
      },
      {
        "id": "tc_259_2",
        "input": "[(a, b) => a / b, 2, [[10]]]",
        "expectedOutput": "5",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_259_3",
        "input": "[(a, b) => a - b, 5, [[20]]]",
        "expectedOutput": "15",
        "isHidden": true
      }
    ],
    "solution": "function partialRight(fn, ...partials) {\n  return function(...args) {\n    return fn.apply(this, args.concat(partials));\n  };\n}",
    "explanation": "Concatenate newly supplied args with partials.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(p)",
    "hints": [
      "Return a function that invokes fn with [...args, ...partials]."
    ]
  },
  {
    "id": "JS-P260",
    "number": 260,
    "title": "Implement Tap Utility",
    "slug": "js-p260-implement-tap-utility",
    "category": "Functional JavaScript",
    "subcategory": "Utilities",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Functional Utilities",
      "Side Effects"
    ],
    "tags": [
      "tap",
      "interceptor",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Invoke an interceptor function with a value and return the value.",
    "problemStatement": "Write a function `tap(value, interceptor)` that invokes `interceptor(value)` and returns `value`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[42, x => x * 2]",
        "output": "42",
        "explanation": "Returns the original value 42 regardless of interceptor return."
      }
    ],
    "constraints": [
      "Always return original value."
    ],
    "starterCode": "function tap(value, interceptor) {\n  // Write your solution here\n}",
    "functionName": "tap",
    "testCases": [
      {
        "id": "tc_260_1",
        "input": "[42, x => x * 2]",
        "expectedOutput": "42",
        "isHidden": false
      },
      {
        "id": "tc_260_2",
        "input": "[[1, 2, 3], arr => arr.push(4)]",
        "expectedOutput": "[1, 2, 3, 4]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_260_3",
        "input": "['test', s => s.toUpperCase()]",
        "expectedOutput": "'test'",
        "isHidden": true
      }
    ],
    "solution": "function tap(value, interceptor) {\n  interceptor(value);\n  return value;\n}",
    "explanation": "Call interceptor with value, then return original value.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Call interceptor(value) and return value."
    ]
  },
  {
    "id": "JS-P261",
    "number": 261,
    "title": "Implement Negate Predicate",
    "slug": "js-p261-implement-negate-predicate",
    "category": "Functional JavaScript",
    "subcategory": "Predicates",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Predicates",
      "Higher-Order Functions"
    ],
    "tags": [
      "negate",
      "predicate",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Create a function that negates the result of the predicate function.",
    "problemStatement": "Write a function `negate(predicate)` that returns a new predicate function which returns `!predicate(...args)`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[x => x % 2 === 0, [[4], [5]]]",
        "output": "[false, true]",
        "explanation": "Inverts isEven result."
      }
    ],
    "constraints": [
      "Return strict boolean negation."
    ],
    "starterCode": "function negate(predicate) {\n  // Write your solution here\n}",
    "functionName": "negate",
    "testCases": [
      {
        "id": "tc_261_1",
        "input": "[x => x % 2 === 0, [[4], [5]]]",
        "expectedOutput": "[false, true]",
        "isHidden": false
      },
      {
        "id": "tc_261_2",
        "input": "[s => s.length > 3, [['hi'], ['hello']]]",
        "expectedOutput": "[true, false]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_261_3",
        "input": "[() => true, [[]]]",
        "expectedOutput": "[false]",
        "isHidden": true
      }
    ],
    "solution": "function negate(predicate) {\n  return function(...args) {\n    return !predicate.apply(this, args);\n  };\n}",
    "explanation": "Apply predicate and negate with ! operator.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Return (...args) => !predicate(...args)."
    ]
  },
  {
    "id": "JS-P262",
    "number": 262,
    "title": "Implement Flip Arguments",
    "slug": "js-p262-implement-flip-arguments",
    "category": "Functional JavaScript",
    "subcategory": "Transformation",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Higher-Order Functions",
      "Arguments"
    ],
    "tags": [
      "flip",
      "arguments",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Create a function that invokes fn with arguments in reversed order.",
    "problemStatement": "Write a function `flip(fn)` that creates a function that invokes `fn` with arguments reversed.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(a, b) => `${a}/${b}`, [['top', 'bottom']]]",
        "output": "'bottom/top'",
        "explanation": "Arguments 'top' and 'bottom' are flipped."
      }
    ],
    "constraints": [
      "Reverse all incoming arguments."
    ],
    "starterCode": "function flip(fn) {\n  // Write your solution here\n}",
    "functionName": "flip",
    "testCases": [
      {
        "id": "tc_262_1",
        "input": "[(a, b) => `${a}/${b}`, [['top', 'bottom']]]",
        "expectedOutput": "'bottom/top'",
        "isHidden": false
      },
      {
        "id": "tc_262_2",
        "input": "[(a, b, c) => [a, b, c], [[1, 2, 3]]]",
        "expectedOutput": "[3, 2, 1]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_262_3",
        "input": "[(a, b) => a - b, [[5, 20]]]",
        "expectedOutput": "15",
        "isHidden": true
      }
    ],
    "solution": "function flip(fn) {\n  return function(...args) {\n    return fn.apply(this, args.reverse());\n  };\n}",
    "explanation": "Reverse arguments before applying fn.",
    "timeComplexity": "O(k) where k is arg count",
    "spaceComplexity": "O(k)",
    "hints": [
      "Reverse args with args.reverse() and apply fn."
    ]
  },
  {
    "id": "JS-P263",
    "number": 263,
    "title": "Implement Unary Function Wrapper",
    "slug": "js-p263-implement-unary-function-wrapper",
    "category": "Functional JavaScript",
    "subcategory": "Arity",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Arity",
      "Higher-Order Functions"
    ],
    "tags": [
      "unary",
      "arity",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Wrap a function to accept only exactly 1 argument.",
    "problemStatement": "Write a function `unary(fn)` that creates a function that accepts only one argument, ignoring any additional arguments.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[parseInt, [['10', 2], ['20', 8]]]",
        "output": "[10, 20]",
        "explanation": "Ignores the radix argument in map/calls."
      }
    ],
    "constraints": [
      "Only pass the first argument to fn."
    ],
    "starterCode": "function unary(fn) {\n  // Write your solution here\n}",
    "functionName": "unary",
    "testCases": [
      {
        "id": "tc_263_1",
        "input": "[parseInt, [['10', 2], ['20', 8]]]",
        "expectedOutput": "[10, 20]",
        "isHidden": false
      },
      {
        "id": "tc_263_2",
        "input": "[(a, b) => a + (b || 0), [[5, 100]]]",
        "expectedOutput": "[5]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_263_3",
        "input": "[x => x, [['hello', 'world']]]",
        "expectedOutput": "['hello']",
        "isHidden": true
      }
    ],
    "solution": "function unary(fn) {\n  return function(arg) {\n    return fn.call(this, arg);\n  };\n}",
    "explanation": "Pass only arg to fn.call(this, arg).",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Return function(arg) { return fn.call(this, arg); }."
    ]
  },
  {
    "id": "JS-P264",
    "number": 264,
    "title": "Implement Binary Function Wrapper",
    "slug": "js-p264-implement-binary-function-wrapper",
    "category": "Functional JavaScript",
    "subcategory": "Arity",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Arity",
      "Higher-Order Functions"
    ],
    "tags": [
      "binary",
      "arity",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Wrap a function to accept only exactly 2 arguments.",
    "problemStatement": "Write a function `binary(fn)` that creates a function that accepts up to two arguments, ignoring any additional arguments.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(...args) => args.length, [[1, 2, 3, 4]]]",
        "output": "2",
        "explanation": "Only passes first 2 arguments."
      }
    ],
    "constraints": [
      "Pass exactly the first two arguments."
    ],
    "starterCode": "function binary(fn) {\n  // Write your solution here\n}",
    "functionName": "binary",
    "testCases": [
      {
        "id": "tc_264_1",
        "input": "[(...args) => args.length, [[1, 2, 3, 4]]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc_264_2",
        "input": "[(a, b, c) => [a, b, c], [[10, 20, 30]]]",
        "expectedOutput": "[10, 20, null]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_264_3",
        "input": "[(a, b) => a + b, [[2, 3, 99]]]",
        "expectedOutput": "5",
        "isHidden": true
      }
    ],
    "solution": "function binary(fn) {\n  return function(a, b) {\n    return fn.call(this, a, b);\n  };\n}",
    "explanation": "Invoke fn with exactly two arguments.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Return function(a, b) { return fn.call(this, a, b); }."
    ]
  },
  {
    "id": "JS-P265",
    "number": 265,
    "title": "Implement Ary Function Wrapper",
    "slug": "js-p265-implement-ary-function-wrapper",
    "category": "Functional JavaScript",
    "subcategory": "Arity",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Arity",
      "Higher-Order Functions"
    ],
    "tags": [
      "ary",
      "arity",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Create a function that accepts up to n arguments, ignoring any further arguments.",
    "problemStatement": "Write a function `ary(fn, n)` that returns a function that invokes `fn` with at most `n` arguments.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(...args) => args, 2, [[1, 2, 3, 4, 5]]]",
        "output": "[1, 2]",
        "explanation": "Only keeps first 2 args."
      }
    ],
    "constraints": [
      "n >= 0."
    ],
    "starterCode": "function ary(fn, n) {\n  // Write your solution here\n}",
    "functionName": "ary",
    "testCases": [
      {
        "id": "tc_265_1",
        "input": "[(...args) => args, 2, [[1, 2, 3, 4, 5]]]",
        "expectedOutput": "[1, 2]",
        "isHidden": false
      },
      {
        "id": "tc_265_2",
        "input": "[(...args) => args.reduce((a, b) => a + b, 0), 3, [[1, 2, 3, 4, 5]]]",
        "expectedOutput": "6",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_265_3",
        "input": "[(...args) => args.length, 0, [[1, 2, 3]]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "solution": "function ary(fn, n) {\n  return function(...args) {\n    return fn.apply(this, args.slice(0, n));\n  };\n}",
    "explanation": "Slice arguments from 0 to n before passing to fn.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use args.slice(0, n) to trim arguments."
    ]
  },
  {
    "id": "JS-P266",
    "number": 266,
    "title": "Implement Spread Arguments",
    "slug": "js-p266-implement-spread-arguments",
    "category": "Functional JavaScript",
    "subcategory": "Transformation",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Higher-Order Functions",
      "Spread"
    ],
    "tags": [
      "spread",
      "arguments",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Create a function that invokes fn with array elements spread as separate arguments.",
    "problemStatement": "Write a function `spread(fn)` that creates a function that accepts an array of arguments and passes them spread as individual arguments to `fn`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(a, b, c) => a + b + c, [[[1, 2, 3]]]]",
        "output": "6",
        "explanation": "Array [1, 2, 3] spread into fn(1, 2, 3)."
      }
    ],
    "constraints": [
      "Accept single array argument and spread."
    ],
    "starterCode": "function spread(fn) {\n  // Write your solution here\n}",
    "functionName": "spread",
    "testCases": [
      {
        "id": "tc_266_1",
        "input": "[(a, b, c) => a + b + c, [[[1, 2, 3]]]]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "id": "tc_266_2",
        "input": "[Math.max, [[[10, 50, 30]]]]",
        "expectedOutput": "50",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_266_3",
        "input": "[(...args) => args.length, [[[1, 2]]]]",
        "expectedOutput": "2",
        "isHidden": true
      }
    ],
    "solution": "function spread(fn) {\n  return function(argsArr) {\n    return fn.apply(this, argsArr);\n  };\n}",
    "explanation": "Pass argsArr as arguments list using fn.apply(this, argsArr).",
    "timeComplexity": "O(k)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use fn.apply(this, argsArr) or fn(...argsArr)."
    ]
  },
  {
    "id": "JS-P267",
    "number": 267,
    "title": "Implement After N Calls",
    "slug": "js-p267-implement-after-n-calls",
    "category": "Functional JavaScript",
    "subcategory": "Flow Control",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Counters"
    ],
    "tags": [
      "after",
      "closures",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Create a function that only invokes fn after it has been called n times.",
    "problemStatement": "Write a function `after(n, fn)` that returns a function that invokes `fn` once it has been called `n` or more times. Before `n` calls, it returns `undefined`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[3, () => 'done', [[], [], []]]",
        "output": "[null, null, 'done']",
        "explanation": "Third call triggers fn."
      }
    ],
    "constraints": [
      "n is non-negative integer."
    ],
    "starterCode": "function after(n, fn) {\n  // Write your solution here\n}",
    "functionName": "after",
    "testCases": [
      {
        "id": "tc_267_1",
        "input": "[3, () => 'done', [[], [], []]]",
        "expectedOutput": "[null, null, 'done']",
        "isHidden": false
      },
      {
        "id": "tc_267_2",
        "input": "[1, x => x * 2, [[5]]]",
        "expectedOutput": "[10]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_267_3",
        "input": "[2, x => x, [[1], [2], [3]]]",
        "expectedOutput": "[null, 2, 3]",
        "isHidden": true
      }
    ],
    "solution": "function after(n, fn) {\n  let count = 0;\n  return function(...args) {\n    count++;\n    if (count >= n) {\n      return fn.apply(this, args);\n    }\n    return undefined;\n  };\n}",
    "explanation": "Increment counter and invoke fn once count reaches n.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Increment counter on each call and invoke fn when count >= n."
    ]
  },
  {
    "id": "JS-P268",
    "number": 268,
    "title": "Implement Before N Calls",
    "slug": "js-p268-implement-before-n-calls",
    "category": "Functional JavaScript",
    "subcategory": "Flow Control",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Counters"
    ],
    "tags": [
      "before",
      "closures",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Create a function that invokes fn while it has been called less than n times.",
    "problemStatement": "Write a function `before(n, fn)` that creates a function that invokes `fn` while it has been called fewer than `n` times. Subsequent calls return the result of the last invocation.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[3, x => x * 2, [[1], [2], [3]]]",
        "output": "[2, 4, 4]",
        "explanation": "Third call returns last cached result 4."
      }
    ],
    "constraints": [
      "n is a positive integer."
    ],
    "starterCode": "function before(n, fn) {\n  // Write your solution here\n}",
    "functionName": "before",
    "testCases": [
      {
        "id": "tc_268_1",
        "input": "[3, x => x * 2, [[1], [2], [3]]]",
        "expectedOutput": "[2, 4, 4]",
        "isHidden": false
      },
      {
        "id": "tc_268_2",
        "input": "[2, (a, b) => a + b, [[1, 2], [10, 20]]]",
        "expectedOutput": "[3, 3]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_268_3",
        "input": "[1, () => 42, [[], []]]",
        "expectedOutput": "[null, null]",
        "isHidden": true
      }
    ],
    "solution": "function before(n, fn) {\n  let count = 0;\n  let lastResult;\n  return function(...args) {\n    if (count < n - 1) {\n      count++;\n      lastResult = fn.apply(this, args);\n    }\n    return lastResult;\n  };\n}",
    "explanation": "Allow execution while count < n - 1, and return cached lastResult once limit is met.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Execute when count < n - 1, then reuse lastResult."
    ]
  },
  {
    "id": "JS-P269",
    "number": 269,
    "title": "Implement Identity Function",
    "slug": "js-p269-implement-identity-function",
    "category": "Functional JavaScript",
    "subcategory": "Core Combinators",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Combinators",
      "Functional"
    ],
    "tags": [
      "identity",
      "functional"
    ],
    "expectedTime": "2 mins",
    "summary": "Return the first argument passed into it.",
    "problemStatement": "Write a function `identity(val)` that returns the first argument it receives.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[42]",
        "output": "42",
        "explanation": "Returns 42 unchanged."
      }
    ],
    "constraints": [
      "Return argument exactly as passed."
    ],
    "starterCode": "function identity(val) {\n  // Write your solution here\n}",
    "functionName": "identity",
    "testCases": [
      {
        "id": "tc_269_1",
        "input": "[42]",
        "expectedOutput": "42",
        "isHidden": false
      },
      {
        "id": "tc_269_2",
        "input": "['hello']",
        "expectedOutput": "'hello'",
        "isHidden": false
      },
      {
        "id": "tc_269_3",
        "input": "[{ a: 1 }]",
        "expectedOutput": "{ a: 1 }",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_269_4",
        "input": "[null]",
        "expectedOutput": "null",
        "isHidden": true
      }
    ],
    "solution": "function identity(val) {\n  return val;\n}",
    "explanation": "Simply return val.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Return val."
    ]
  },
  {
    "id": "JS-P270",
    "number": 270,
    "title": "Implement Constant Function Generator",
    "slug": "js-p270-implement-constant-function-generator",
    "category": "Functional JavaScript",
    "subcategory": "Core Combinators",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Combinators",
      "Closures"
    ],
    "tags": [
      "constant",
      "closures",
      "functional"
    ],
    "expectedTime": "2 mins",
    "summary": "Create a function that always returns the same value.",
    "problemStatement": "Write a function `constant(val)` that returns a function that always returns `val`, regardless of arguments passed.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[42, [[], [1, 2]]]",
        "output": "[42, 42]",
        "explanation": "Always returns 42."
      }
    ],
    "constraints": [
      "Always return original val."
    ],
    "starterCode": "function constant(val) {\n  // Write your solution here\n}",
    "functionName": "constant",
    "testCases": [
      {
        "id": "tc_270_1",
        "input": "[42, [[], [1, 2]]]",
        "expectedOutput": "[42, 42]",
        "isHidden": false
      },
      {
        "id": "tc_270_2",
        "input": "['fixed', [['any'], ['args']]]",
        "expectedOutput": "['fixed', 'fixed']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_270_3",
        "input": "[false, [[]]]",
        "expectedOutput": "[false]",
        "isHidden": true
      }
    ],
    "solution": "function constant(val) {\n  return function() {\n    return val;\n  };\n}",
    "explanation": "Return closure returning val.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Return () => val."
    ]
  },
  {
    "id": "JS-P271",
    "number": 271,
    "title": "Implement Noop Function",
    "slug": "js-p271-implement-noop-function",
    "category": "Functional JavaScript",
    "subcategory": "Core Combinators",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Combinators"
    ],
    "tags": [
      "noop",
      "functional"
    ],
    "expectedTime": "2 mins",
    "summary": "Return undefined and do nothing.",
    "problemStatement": "Write a function `noop()` that does nothing and returns `undefined`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[]",
        "output": "undefined",
        "explanation": "Returns undefined."
      }
    ],
    "constraints": [
      "Perform no action."
    ],
    "starterCode": "function noop() {\n  // Write your solution here\n}",
    "functionName": "noop",
    "testCases": [
      {
        "id": "tc_271_1",
        "input": "[]",
        "expectedOutput": "undefined",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_271_2",
        "input": "[1, 2, 3]",
        "expectedOutput": "undefined",
        "isHidden": true
      }
    ],
    "solution": "function noop() {\n  return undefined;\n}",
    "explanation": "A no-operation function returning undefined.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Return undefined."
    ]
  },
  {
    "id": "JS-P272",
    "number": 272,
    "title": "Implement Times Iteration Helper",
    "slug": "js-p272-implement-times-iteration-helper",
    "category": "Functional JavaScript",
    "subcategory": "Iteration",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Higher-Order Functions",
      "Iteration"
    ],
    "tags": [
      "times",
      "iteration",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Invoke an iteratee n times and return an array of results.",
    "problemStatement": "Write a function `times(n, iteratee)` that invokes `iteratee(i)` `n` times (from `i = 0` to `n - 1`) and returns an array of the results.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[3, i => i * 2]",
        "output": "[0, 2, 4]",
        "explanation": "Calls for i = 0, 1, 2."
      }
    ],
    "constraints": [
      "n >= 0."
    ],
    "starterCode": "function times(n, iteratee) {\n  // Write your solution here\n}",
    "functionName": "times",
    "testCases": [
      {
        "id": "tc_272_1",
        "input": "[3, i => i * 2]",
        "expectedOutput": "[0, 2, 4]",
        "isHidden": false
      },
      {
        "id": "tc_272_2",
        "input": "[4, String]",
        "expectedOutput": "['0', '1', '2', '3']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_272_3",
        "input": "[0, x => x]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "solution": "function times(n, iteratee) {\n  const res = [];\n  for (let i = 0; i < n; i++) {\n    res.push(iteratee(i));\n  }\n  return res;\n}",
    "explanation": "Loop from 0 to n - 1, push iteratee(i) to results array.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Run for loop from 0 to n - 1."
    ]
  },
  {
    "id": "JS-P273",
    "number": 273,
    "title": "Implement Over Args Transformer",
    "slug": "js-p273-implement-over-args-transformer",
    "category": "Functional JavaScript",
    "subcategory": "Transformation",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Higher-Order Functions",
      "Transform"
    ],
    "tags": [
      "overArgs",
      "transforms",
      "functional"
    ],
    "expectedTime": "10 mins",
    "summary": "Transform arguments before passing them to the target function.",
    "problemStatement": "Write a function `overArgs(fn, transforms)` that creates a function that invokes `fn` with its arguments transformed by the corresponding function in `transforms`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(x, y) => [x, y], [x => x * 2, x => x + 10], [[3, 5]]]",
        "output": "[6, 15]",
        "explanation": "x transformed by x*2, y by y+10."
      }
    ],
    "constraints": [
      "If an argument has no corresponding transform, pass it unchanged."
    ],
    "starterCode": "function overArgs(fn, transforms) {\n  // Write your solution here\n}",
    "functionName": "overArgs",
    "testCases": [
      {
        "id": "tc_273_1",
        "input": "[(x, y) => [x, y], [x => x * 2, x => x + 10], [[3, 5]]]",
        "expectedOutput": "[6, 15]",
        "isHidden": false
      },
      {
        "id": "tc_273_2",
        "input": "[(a, b, c) => [a, b, c], [s => s.toUpperCase()], [['foo', 'bar', 'baz']]]",
        "expectedOutput": "['FOO', 'bar', 'baz']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_273_3",
        "input": "[(a) => a, [], [[42]]]",
        "expectedOutput": "42",
        "isHidden": true
      }
    ],
    "solution": "function overArgs(fn, transforms) {\n  return function(...args) {\n    const transformed = args.map((arg, i) => (transforms[i] ? transforms[i](arg) : arg));\n    return fn.apply(this, transformed);\n  };\n}",
    "explanation": "Map each incoming arg to transforms[i] ? transforms[i](arg) : arg, then apply fn.",
    "timeComplexity": "O(k)",
    "spaceComplexity": "O(k)",
    "hints": [
      "Map args using transforms[i]."
    ]
  },
  {
    "id": "JS-P274",
    "number": 274,
    "title": "Implement Cond Conditional Dispatcher",
    "slug": "js-p274-implement-cond-conditional-dispatcher",
    "category": "Functional JavaScript",
    "subcategory": "Conditional",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Higher-Order Functions",
      "Pattern Matching"
    ],
    "tags": [
      "cond",
      "dispatch",
      "functional"
    ],
    "expectedTime": "10 mins",
    "summary": "Return a function that iterates through [predicate, transformer] pairs.",
    "problemStatement": "Write a function `cond(pairs)` that accepts an array of `[predicate, fn]` pairs and returns a function. Upon invocation, it calls the `fn` of the first predicate returning truthy. If none match, return `undefined`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[ [x => x === 0, () => 'zero'], [x => x > 0, () => 'positive'], [() => true, () => 'negative'] ], [[5], [0], [-3]]]",
        "output": "['positive', 'zero', 'negative']",
        "explanation": "Matches first condition."
      }
    ],
    "constraints": [
      "Pairs are evaluated in order."
    ],
    "starterCode": "function cond(pairs) {\n  // Write your solution here\n}",
    "functionName": "cond",
    "testCases": [
      {
        "id": "tc_274_1",
        "input": "[[ [x => x === 0, () => 'zero'], [x => x > 0, () => 'positive'], [() => true, () => 'negative'] ], [[5], [0], [-3]]]",
        "expectedOutput": "['positive', 'zero', 'negative']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_274_2",
        "input": "[[ [x => x > 100, x => x] ], [[10]]]",
        "expectedOutput": "[null]",
        "isHidden": true
      }
    ],
    "solution": "function cond(pairs) {\n  return function(...args) {\n    for (const [predicate, fn] of pairs) {\n      if (predicate.apply(this, args)) {\n        return fn.apply(this, args);\n      }\n    }\n    return undefined;\n  };\n}",
    "explanation": "Iterate over pairs and return fn(...args) for first predicate returning truthy.",
    "timeComplexity": "O(p) where p is pairs count",
    "spaceComplexity": "O(1)",
    "hints": [
      "Find first pair where predicate(...args) is true."
    ]
  },
  {
    "id": "JS-P275",
    "number": 275,
    "title": "Implement Nth Arg Selector",
    "slug": "js-p275-implement-nth-arg-selector",
    "category": "Functional JavaScript",
    "subcategory": "Combinators",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Higher-Order Functions",
      "Indexing"
    ],
    "tags": [
      "nthArg",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Create a function that returns its nth argument.",
    "problemStatement": "Write a function `nthArg(n)` that returns a function which returns its `n`th argument. If `n < 0`, count from the end.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[1, [['a', 'b', 'c']]]",
        "output": "'b'",
        "explanation": "Returns argument at index 1."
      }
    ],
    "constraints": [
      "Supports negative index (e.g. -1 for last argument)."
    ],
    "starterCode": "function nthArg(n) {\n  // Write your solution here\n}",
    "functionName": "nthArg",
    "testCases": [
      {
        "id": "tc_275_1",
        "input": "[1, [['a', 'b', 'c']]]",
        "expectedOutput": "'b'",
        "isHidden": false
      },
      {
        "id": "tc_275_2",
        "input": "[-1, [[10, 20, 30]]]",
        "expectedOutput": "30",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_275_3",
        "input": "[0, [[42]]]",
        "expectedOutput": "42",
        "isHidden": true
      }
    ],
    "solution": "function nthArg(n) {\n  return function(...args) {\n    const idx = n < 0 ? args.length + n : n;\n    return args[idx];\n  };\n}",
    "explanation": "Handle negative indices with args.length + n.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Compute index considering negative offsets."
    ]
  },
  {
    "id": "JS-P276",
    "number": 276,
    "title": "Implement Rearg Argument Reordering",
    "slug": "js-p276-implement-rearg-argument-reordering",
    "category": "Functional JavaScript",
    "subcategory": "Transformation",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Higher-Order Functions",
      "Argument Manipulation"
    ],
    "tags": [
      "rearg",
      "functional"
    ],
    "expectedTime": "10 mins",
    "summary": "Reorder arguments passed to a function based on specified indexes.",
    "problemStatement": "Write a function `rearg(fn, indexes)` that creates a function that invokes `fn` with arguments rearranged according to `indexes`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(a, b, c) => [a, b, c], [2, 0, 1], [['first', 'second', 'third']]]",
        "output": "['third', 'first', 'second']",
        "explanation": "arg[0] becomes third, arg[1] becomes first, arg[2] becomes second."
      }
    ],
    "constraints": [
      "Indexes specify the source position for each destination parameter."
    ],
    "starterCode": "function rearg(fn, indexes) {\n  // Write your solution here\n}",
    "functionName": "rearg",
    "testCases": [
      {
        "id": "tc_276_1",
        "input": "[(a, b, c) => [a, b, c], [2, 0, 1], [['first', 'second', 'third']]]",
        "expectedOutput": "['third', 'first', 'second']",
        "isHidden": false
      },
      {
        "id": "tc_276_2",
        "input": "[(a, b) => `${a}-${b}`, [1, 0], [['x', 'y']]]",
        "expectedOutput": "'y-x'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_276_3",
        "input": "[(a) => a * 2, [0], [[5]]]",
        "expectedOutput": "10",
        "isHidden": true
      }
    ],
    "solution": "function rearg(fn, indexes) {\n  return function(...args) {\n    const reordered = indexes.map(i => args[i]);\n    return fn.apply(this, reordered);\n  };\n}",
    "explanation": "Map indexes to args[i] and invoke fn with reordered array.",
    "timeComplexity": "O(k)",
    "spaceComplexity": "O(k)",
    "hints": [
      "Use indexes.map(i => args[i])."
    ]
  },
  {
    "id": "JS-P277",
    "number": 277,
    "title": "Implement Rest Function",
    "slug": "js-p277-implement-rest-function",
    "category": "Functional JavaScript",
    "subcategory": "Transformation",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Higher-Order Functions",
      "Rest"
    ],
    "tags": [
      "rest",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Collect arguments from a start index into a single array parameter.",
    "problemStatement": "Write a function `rest(fn, start = fn.length - 1)` that creates a function that applies a rest parameter to `fn` starting from index `start`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(a, b, restArr) => [a, b, restArr], 2, [[1, 2, 3, 4, 5]]]",
        "output": "[1, 2, [3, 4, 5]]",
        "explanation": "Elements from index 2 gathered into array."
      }
    ],
    "constraints": [
      "start defaults to Math.max(0, fn.length - 1)."
    ],
    "starterCode": "function rest(fn, start) {\n  // Write your solution here\n}",
    "functionName": "rest",
    "testCases": [
      {
        "id": "tc_277_1",
        "input": "[(a, b, restArr) => [a, b, restArr], 2, [[1, 2, 3, 4, 5]]]",
        "expectedOutput": "[1, 2, [3, 4, 5]]",
        "isHidden": false
      },
      {
        "id": "tc_277_2",
        "input": "[(first, restItems) => [first, restItems], 1, [['a', 'b', 'c']]]",
        "expectedOutput": "['a', ['b', 'c']]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_277_3",
        "input": "[(all) => all, 0, [[1, 2]]]",
        "expectedOutput": "[[1, 2]]",
        "isHidden": true
      }
    ],
    "solution": "function rest(fn, start) {\n  const s = typeof start === 'number' ? start : Math.max(0, fn.length - 1);\n  return function(...args) {\n    const normal = args.slice(0, s);\n    const restArgs = args.slice(s);\n    return fn.apply(this, normal.concat([restArgs]));\n  };\n}",
    "explanation": "Slice args up to s, and package args.slice(s) as the rest array.",
    "timeComplexity": "O(k)",
    "spaceComplexity": "O(k)",
    "hints": [
      "Slice normal args up to s and concat [args.slice(s)]."
    ]
  },
  {
    "id": "JS-P278",
    "number": 278,
    "title": "Implement Wrap Function Decorator",
    "slug": "js-p278-implement-wrap-function-decorator",
    "category": "Functional JavaScript",
    "subcategory": "Decorators",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Decorators",
      "Higher-Order Functions"
    ],
    "tags": [
      "wrap",
      "decorator",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Wrap a value inside a wrapper function as its first argument.",
    "problemStatement": "Write a function `wrap(value, wrapper)` that creates a function that provides `value` as the first argument to `wrapper`, followed by any additional arguments.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['hello', (val, tag) => `<${tag}>${val}</${tag}>`, [['p']]]",
        "output": "'<p>hello</p>'",
        "explanation": "Passes 'hello' as first arg to wrapper."
      }
    ],
    "constraints": [
      "Preserve caller arguments after value."
    ],
    "starterCode": "function wrap(value, wrapper) {\n  // Write your solution here\n}",
    "functionName": "wrap",
    "testCases": [
      {
        "id": "tc_278_1",
        "input": "['hello', (val, tag) => `<${tag}>${val}</${tag}>`, [['p']]]",
        "expectedOutput": "'<p>hello</p>'",
        "isHidden": false
      },
      {
        "id": "tc_278_2",
        "input": "[10, (val, add, mult) => (val + add) * mult, [[5, 2]]]",
        "expectedOutput": "30",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_278_3",
        "input": "[42, (val) => val, [[]]]",
        "expectedOutput": "42",
        "isHidden": true
      }
    ],
    "solution": "function wrap(value, wrapper) {\n  return function(...args) {\n    return wrapper.apply(this, [value].concat(args));\n  };\n}",
    "explanation": "Prepend value to args and invoke wrapper.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Return (...args) => wrapper(value, ...args)."
    ]
  },
  {
    "id": "JS-P279",
    "number": 279,
    "title": "Implement Try-Catch Safe Invoker",
    "slug": "js-p279-implement-try-catch-safe-invoker",
    "category": "Functional JavaScript",
    "subcategory": "Error Handling",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Error Handling",
      "Higher-Order Functions"
    ],
    "tags": [
      "tryCatch",
      "functional",
      "error"
    ],
    "expectedTime": "5 mins",
    "summary": "Safely invoke a function, catching any exceptions with a catcher function.",
    "problemStatement": "Write a function `tryCatch(tryer, catcher)` that returns a function. When invoked, it executes `tryer(...args)`. If `tryer` throws an error, it invokes `catcher(error, ...args)` and returns its result.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[s => JSON.parse(s), (err) => 'invalid json', [['{bad}']] ]",
        "output": "'invalid json'",
        "explanation": "Catches parse error and returns fallback string."
      }
    ],
    "constraints": [
      "Pass the thrown error as first arg to catcher."
    ],
    "starterCode": "function tryCatch(tryer, catcher) {\n  // Write your solution here\n}",
    "functionName": "tryCatch",
    "testCases": [
      {
        "id": "tc_279_1",
        "input": "[s => JSON.parse(s), (err) => 'invalid json', [['{bad}']]]",
        "expectedOutput": "'invalid json'",
        "isHidden": false
      },
      {
        "id": "tc_279_2",
        "input": "[s => JSON.parse(s), (err) => 'error', [['{\"ok\":true}']]]",
        "expectedOutput": "{\"ok\":true}",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_279_3",
        "input": "[() => { throw new Error('boom'); }, (err) => err.message, [[]]]",
        "expectedOutput": "'boom'",
        "isHidden": true
      }
    ],
    "solution": "function tryCatch(tryer, catcher) {\n  return function(...args) {\n    try {\n      return tryer.apply(this, args);\n    } catch (err) {\n      return catcher.apply(this, [err].concat(args));\n    }\n  };\n}",
    "explanation": "Wrap tryer in try/catch block, forwarding error to catcher.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use try/catch inside the returned wrapper."
    ]
  },
  {
    "id": "JS-P280",
    "number": 280,
    "title": "Implement DefaultTo Fallback Helper",
    "slug": "js-p280-implement-default-to-fallback-helper",
    "category": "Functional JavaScript",
    "subcategory": "Nullish Handling",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Nullish",
      "Functional"
    ],
    "tags": [
      "defaultTo",
      "fallback",
      "functional"
    ],
    "expectedTime": "3 mins",
    "summary": "Return value if not null, undefined, or NaN, else return default.",
    "problemStatement": "Write a function `defaultTo(value, defaultValue)` that returns `value` if it is not `null`, `undefined`, or `NaN`. Otherwise, returns `defaultValue`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[null, 10]",
        "output": "10",
        "explanation": "Null falls back to 10."
      },
      {
        "title": "Example 2",
        "input": "[0, 10]",
        "output": "0",
        "explanation": "0 is a valid number, returns 0."
      }
    ],
    "constraints": [
      "0 and false are valid values."
    ],
    "starterCode": "function defaultTo(value, defaultValue) {\n  // Write your solution here\n}",
    "functionName": "defaultTo",
    "testCases": [
      {
        "id": "tc_280_1",
        "input": "[null, 10]",
        "expectedOutput": "10",
        "isHidden": false
      },
      {
        "id": "tc_280_2",
        "input": "[0, 10]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc_280_3",
        "input": "[false, true]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_280_4",
        "input": "[NaN, 42]",
        "expectedOutput": "42",
        "isHidden": true
      }
    ],
    "solution": "function defaultTo(value, defaultValue) {\n  if (value === null || value === undefined || Number.isNaN(value)) {\n    return defaultValue;\n  }\n  return value;\n}",
    "explanation": "Check for null, undefined, and Number.isNaN(value).",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Check value === null || value === undefined || Number.isNaN(value)."
    ]
  },
  {
    "id": "JS-P281",
    "number": 281,
    "title": "Implement Both Logical AND Predicate Combiner",
    "slug": "js-p281-implement-both-logical-and-predicate-combiner",
    "category": "Functional JavaScript",
    "subcategory": "Predicates",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Predicates",
      "Combinators"
    ],
    "tags": [
      "both",
      "predicate",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Return true if both predicates return true for the arguments.",
    "problemStatement": "Write a function `both(f, g)` that takes two predicate functions and returns a new function that returns `true` if and only if both `f` and `g` return truthy.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[x => x > 0, x => x % 2 === 0, [[4], [-2], [3]]]",
        "output": "[true, false, false]",
        "explanation": "Only 4 is both positive and even."
      }
    ],
    "constraints": [
      "Short-circuit: do not call g if f returns falsy."
    ],
    "starterCode": "function both(f, g) {\n  // Write your solution here\n}",
    "functionName": "both",
    "testCases": [
      {
        "id": "tc_281_1",
        "input": "[x => x > 0, x => x % 2 === 0, [[4], [-2], [3]]]",
        "expectedOutput": "[true, false, false]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_281_2",
        "input": "[() => true, () => true, [[]]]",
        "expectedOutput": "[true]",
        "isHidden": true
      }
    ],
    "solution": "function both(f, g) {\n  return function(...args) {\n    return Boolean(f.apply(this, args) && g.apply(this, args));\n  };\n}",
    "explanation": "Use && operator to combine predicate evaluations with short-circuiting.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Boolean(f(...args) && g(...args))."
    ]
  },
  {
    "id": "JS-P282",
    "number": 282,
    "title": "Implement Either Logical OR Predicate Combiner",
    "slug": "js-p282-implement-either-logical-or-predicate-combiner",
    "category": "Functional JavaScript",
    "subcategory": "Predicates",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Predicates",
      "Combinators"
    ],
    "tags": [
      "either",
      "predicate",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Return true if either predicate returns true for the arguments.",
    "problemStatement": "Write a function `either(f, g)` that takes two predicate functions and returns a new function that returns `true` if either `f` or `g` returns truthy.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[x => x < 0, x => x > 10, [[-5], [15], [5]]]",
        "output": "[true, true, false]",
        "explanation": "-5 and 15 satisfy one of the conditions."
      }
    ],
    "constraints": [
      "Short-circuit: do not call g if f returns truthy."
    ],
    "starterCode": "function either(f, g) {\n  // Write your solution here\n}",
    "functionName": "either",
    "testCases": [
      {
        "id": "tc_282_1",
        "input": "[x => x < 0, x => x > 10, [[-5], [15], [5]]]",
        "expectedOutput": "[true, true, false]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_282_2",
        "input": "[() => false, () => false, [[]]]",
        "expectedOutput": "[false]",
        "isHidden": true
      }
    ],
    "solution": "function either(f, g) {\n  return function(...args) {\n    return Boolean(f.apply(this, args) || g.apply(this, args));\n  };\n}",
    "explanation": "Use || operator to combine predicate evaluations.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Boolean(f(...args) || g(...args))."
    ]
  },
  {
    "id": "JS-P283",
    "number": 283,
    "title": "Implement AllPass Predicate Array Checker",
    "slug": "js-p283-implement-all-pass-predicate-array-checker",
    "category": "Functional JavaScript",
    "subcategory": "Predicates",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Predicates",
      "Array Methods"
    ],
    "tags": [
      "allPass",
      "predicates",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Return true if all predicates in an array pass for the arguments.",
    "problemStatement": "Write a function `allPass(predicates)` that takes an array of predicates and returns a function. It returns `true` if every predicate passes, or `false` otherwise.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[x => x > 0, x => x < 100, x => x % 2 === 0], [[50], [150], [-2]]]",
        "output": "[true, false, false]",
        "explanation": "50 satisfies all 3 predicates."
      }
    ],
    "constraints": [
      "Empty array returns true."
    ],
    "starterCode": "function allPass(predicates) {\n  // Write your solution here\n}",
    "functionName": "allPass",
    "testCases": [
      {
        "id": "tc_283_1",
        "input": "[[x => x > 0, x => x < 100, x => x % 2 === 0], [[50], [150], [-2]]]",
        "expectedOutput": "[true, false, false]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_283_2",
        "input": "[[], [[42]]]",
        "expectedOutput": "[true]",
        "isHidden": true
      }
    ],
    "solution": "function allPass(predicates) {\n  return function(...args) {\n    return predicates.every(p => p.apply(this, args));\n  };\n}",
    "explanation": "Use predicates.every(p => p(...args)).",
    "timeComplexity": "O(p)",
    "spaceComplexity": "O(1)",
    "hints": [
      "predicates.every(p => p(...args))."
    ]
  },
  {
    "id": "JS-P284",
    "number": 284,
    "title": "Implement AnyPass Predicate Array Checker",
    "slug": "js-p284-implement-any-pass-predicate-array-checker",
    "category": "Functional JavaScript",
    "subcategory": "Predicates",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Predicates",
      "Array Methods"
    ],
    "tags": [
      "anyPass",
      "predicates",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Return true if at least one predicate in an array passes.",
    "problemStatement": "Write a function `anyPass(predicates)` that returns a function returning `true` if at least one predicate passes, or `false` otherwise.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[x => x === 0, x => x === 42], [[0], [42], [99]]]",
        "output": "[true, true, false]",
        "explanation": "0 and 42 match at least one predicate."
      }
    ],
    "constraints": [
      "Empty array returns false."
    ],
    "starterCode": "function anyPass(predicates) {\n  // Write your solution here\n}",
    "functionName": "anyPass",
    "testCases": [
      {
        "id": "tc_284_1",
        "input": "[[x => x === 0, x => x === 42], [[0], [42], [99]]]",
        "expectedOutput": "[true, true, false]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_284_2",
        "input": "[[], [[10]]]",
        "expectedOutput": "[false]",
        "isHidden": true
      }
    ],
    "solution": "function anyPass(predicates) {\n  return function(...args) {\n    return predicates.some(p => p.apply(this, args));\n  };\n}",
    "explanation": "Use predicates.some(p => p(...args)).",
    "timeComplexity": "O(p)",
    "spaceComplexity": "O(1)",
    "hints": [
      "predicates.some(p => p(...args))."
    ]
  },
  {
    "id": "JS-P285",
    "number": 285,
    "title": "Implement Complement Predicate Inverter",
    "slug": "js-p285-implement-complement-predicate-inverter",
    "category": "Functional JavaScript",
    "subcategory": "Predicates",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Predicates",
      "Higher-Order Functions"
    ],
    "tags": [
      "complement",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Invert a boolean-returning function.",
    "problemStatement": "Write a function `complement(predicate)` that returns a new predicate function that returns `true` when `predicate` returns falsy, and `false` when truthy.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[x => x === null, [[null], [10]]]",
        "output": "[false, true]",
        "explanation": "Inverts null check."
      }
    ],
    "constraints": [
      "Return strict boolean."
    ],
    "starterCode": "function complement(predicate) {\n  // Write your solution here\n}",
    "functionName": "complement",
    "testCases": [
      {
        "id": "tc_285_1",
        "input": "[x => x === null, [[null], [10]]]",
        "expectedOutput": "[false, true]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_285_2",
        "input": "[Boolean, [[0], [1]]]",
        "expectedOutput": "[true, false]",
        "isHidden": true
      }
    ],
    "solution": "function complement(predicate) {\n  return function(...args) {\n    return !predicate.apply(this, args);\n  };\n}",
    "explanation": "Return !predicate(...args).",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Return !predicate(...args)."
    ]
  },
  {
    "id": "JS-P286",
    "number": 286,
    "title": "Implement Converge Functional Branching",
    "slug": "js-p286-implement-converge-functional-branching",
    "category": "Functional JavaScript",
    "subcategory": "Combinators",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Combinators",
      "Branching"
    ],
    "tags": [
      "converge",
      "functional"
    ],
    "expectedTime": "10 mins",
    "summary": "Apply arguments to an array of branching functions and pass results to an after function.",
    "problemStatement": "Write a function `converge(afterFn, fns)` that accepts an `afterFn` and an array of branch `fns`. It returns a function that applies each branch function to the arguments, then passes all branch results to `afterFn`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(a, b) => a / b, [arr => arr.reduce((x, y) => x + y, 0), arr => arr.length], [[[2, 4, 6, 8]]]]",
        "output": "5",
        "explanation": "Average: sum=20, length=4 -> 20 / 4 = 5."
      }
    ],
    "constraints": [
      "Pass identical arguments to every branch function."
    ],
    "starterCode": "function converge(afterFn, fns) {\n  // Write your solution here\n}",
    "functionName": "converge",
    "testCases": [
      {
        "id": "tc_286_1",
        "input": "[(a, b) => a / b, [arr => arr.reduce((x, y) => x + y, 0), arr => arr.length], [[[2, 4, 6, 8]]]]",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "id": "tc_286_2",
        "input": "[(first, last) => `${first} ${last}`, [arr => arr[0], arr => arr[arr.length - 1]], [[['John', 'M', 'Doe']]]]",
        "expectedOutput": "'John Doe'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_286_3",
        "input": "[() => 100, [], [[1, 2, 3]]]",
        "expectedOutput": "100",
        "isHidden": true
      }
    ],
    "solution": "function converge(afterFn, fns) {\n  return function(...args) {\n    const branchResults = fns.map(fn => fn.apply(this, args));\n    return afterFn.apply(this, branchResults);\n  };\n}",
    "explanation": "Map each branch function to its return value, then apply afterFn with those values.",
    "timeComplexity": "O(b) where b is branches",
    "spaceComplexity": "O(b)",
    "hints": [
      "Map each branch function and call afterFn with the results."
    ]
  },
  {
    "id": "JS-P287",
    "number": 287,
    "title": "Implement Juxt Multi-Function Invoker",
    "slug": "js-p287-implement-juxt-multi-function-invoker",
    "category": "Functional JavaScript",
    "subcategory": "Combinators",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Combinators",
      "Multi-invoker"
    ],
    "tags": [
      "juxt",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Return a function that calls multiple functions on arguments and returns array of results.",
    "problemStatement": "Write a function `juxt(...fns)` that takes several functions and returns a function. When called, it applies each function to the arguments and returns an array of the results.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[Math.min, Math.max], [[3, 1, 4, 1, 5, 9]]]",
        "output": "[1, 9]",
        "explanation": "Calls min and max on the arguments."
      }
    ],
    "constraints": [
      "Maintain order of functions in results array."
    ],
    "starterCode": "function juxt(...fns) {\n  // Write your solution here\n}",
    "functionName": "juxt",
    "testCases": [
      {
        "id": "tc_287_1",
        "input": "[[Math.min, Math.max], [[3, 1, 4, 1, 5, 9]]]",
        "expectedOutput": "[1, 9]",
        "isHidden": false
      },
      {
        "id": "tc_287_2",
        "input": "[[s => s.toLowerCase(), s => s.toUpperCase()], [['Hello']]]",
        "expectedOutput": "['hello', 'HELLO']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_287_3",
        "input": "[[], [[42]]]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "solution": "function juxt(...fns) {\n  return function(...args) {\n    return fns.map(fn => fn.apply(this, args));\n  };\n}",
    "explanation": "Map fns using fn.apply(this, args).",
    "timeComplexity": "O(k)",
    "spaceComplexity": "O(k)",
    "hints": [
      "Use fns.map(fn => fn(...args))."
    ]
  },
  {
    "id": "JS-P288",
    "number": 288,
    "title": "Implement Trace Debugger Utility",
    "slug": "js-p288-implement-trace-debugger-utility",
    "category": "Functional JavaScript",
    "subcategory": "Debugging",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Debugging",
      "Higher-Order Functions"
    ],
    "tags": [
      "trace",
      "logging",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Return a function that logs a tag and value, then returns the value unchanged.",
    "problemStatement": "Write a function `trace(tag)` that returns a curried function `(val) => val` which logs `[tag, val]` to `console.log` and returns `val`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['debug', [[42]]]",
        "output": "42",
        "explanation": "Returns value unchanged."
      }
    ],
    "constraints": [
      "Always return val unchanged."
    ],
    "starterCode": "function trace(tag) {\n  // Write your solution here\n}",
    "functionName": "trace",
    "testCases": [
      {
        "id": "tc_288_1",
        "input": "['debug', [[42]]]",
        "expectedOutput": "42",
        "isHidden": false
      },
      {
        "id": "tc_288_2",
        "input": "['label', [['hello']]]",
        "expectedOutput": "'hello'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_288_3",
        "input": "['test', [[null]]]",
        "expectedOutput": "null",
        "isHidden": true
      }
    ],
    "solution": "function trace(tag) {\n  return function(val) {\n    console.log(tag, val);\n    return val;\n  };\n}",
    "explanation": "Log tag and val, then return val.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Log with console.log and return val."
    ]
  },
  {
    "id": "JS-P289",
    "number": 289,
    "title": "Implement Trampoline for Tail Call Optimization",
    "slug": "js-p289-implement-trampoline-for-tail-call-optimization",
    "category": "Functional JavaScript",
    "subcategory": "Recursion Optimization",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "Recursion",
      "Tail Calls",
      "Trampoline"
    ],
    "tags": [
      "trampoline",
      "recursion",
      "functional"
    ],
    "expectedTime": "15 mins",
    "summary": "Execute thunk-returning recursive functions in a loop to avoid stack overflow.",
    "problemStatement": "Write a function `trampoline(fn)` that returns a function. While the returned value of `fn` is a function (a thunk), continue calling it in a loop until a non-function result is reached.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(n, acc = 0) => n === 0 ? acc : () => (n - 1, acc + n), [[10]]]",
        "output": "55",
        "explanation": "Evaluates recursively in loop without growing call stack."
      }
    ],
    "constraints": [
      "Loop while typeof result === 'function'."
    ],
    "starterCode": "function trampoline(fn) {\n  // Write your solution here\n}",
    "functionName": "trampoline",
    "testCases": [
      {
        "id": "tc_289_1",
        "input": "[function sum(n, acc = 0) { return n === 0 ? acc : () => sum(n - 1, acc + n); }, [[10]]]",
        "expectedOutput": "55",
        "isHidden": false
      },
      {
        "id": "tc_289_2",
        "input": "[function fact(n, acc = 1) { return n <= 1 ? acc : () => fact(n - 1, acc * n); }, [[5]]]",
        "expectedOutput": "120",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_289_3",
        "input": "[function isEven(n) { return n === 0 ? true : n === 1 ? false : () => isEven(n - 2); }, [[4]]]",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "solution": "function trampoline(fn) {\n  return function(...args) {\n    let result = fn.apply(this, args);\n    while (typeof result === 'function') {\n      result = result();\n    }\n    return result;\n  };\n}",
    "explanation": "Repeatedly invoke thunks in while loop until a concrete value is returned.",
    "timeComplexity": "O(steps)",
    "spaceComplexity": "O(1) stack space",
    "hints": [
      "Run a while loop: while (typeof result === 'function') result = result();"
    ]
  },
  {
    "id": "JS-P290",
    "number": 290,
    "title": "Implement Curry with Placeholder Support",
    "slug": "js-p290-implement-curry-with-placeholder-support",
    "category": "Functional JavaScript",
    "subcategory": "Currying",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "Currying",
      "Placeholders",
      "Advanced Functional"
    ],
    "tags": [
      "curry",
      "placeholder",
      "functional"
    ],
    "expectedTime": "15 mins",
    "summary": "Curry a function allowing placeholder tokens to skip arguments for later filling.",
    "problemStatement": "Write a function `curryPlaceholder(fn, placeholder = '_')` that curries `fn` and replaces placeholders when future non-placeholder arguments arrive.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(a, b, c) => [a, b, c], '_', [['_', 2], [1], [3]]]",
        "output": "[1, 2, 3]",
        "explanation": "Placeholder at index 0 filled by subsequent 1."
      }
    ],
    "constraints": [
      "A call is complete when fn.length non-placeholder arguments are filled."
    ],
    "starterCode": "function curryPlaceholder(fn, placeholder = '_') {\n  // Write your solution here\n}",
    "functionName": "curryPlaceholder",
    "testCases": [
      {
        "id": "tc_290_1",
        "input": "[(a, b, c) => [a, b, c], '_', [['_', 2], [1], [3]]]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false
      },
      {
        "id": "tc_290_2",
        "input": "[(a, b) => a - b, '_', [['_', 5], [20]]]",
        "expectedOutput": "15",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_290_3",
        "input": "[(a, b, c) => a + b + c, '_', [[1, 2, 3]]]",
        "expectedOutput": "6",
        "isHidden": true
      }
    ],
    "solution": "function curryPlaceholder(fn, placeholder = '_') {\n  return function curried(...args) {\n    const complete = args.length >= fn.length && args.slice(0, fn.length).every(arg => arg !== placeholder);\n    if (complete) {\n      return fn.apply(this, args);\n    }\n    return function(...nextArgs) {\n      const merged = [];\n      let nextIdx = 0;\n      for (let i = 0; i < args.length; i++) {\n        if (args[i] === placeholder && nextIdx < nextArgs.length) {\n          merged.push(nextArgs[nextIdx++]);\n        } else {\n          merged.push(args[i]);\n        }\n      }\n      while (nextIdx < nextArgs.length) {\n        merged.push(nextArgs[nextIdx++]);\n      }\n      return curried.apply(this, merged);\n    };\n  };\n}",
    "explanation": "Merge previous placeholders with subsequent arguments before recursing.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Iterate through existing args, replacing placeholders with nextArgs."
    ]
  },
  {
    "id": "JS-P291",
    "number": 291,
    "title": "Implement Flow Composition",
    "slug": "js-p291-implement-flow-composition",
    "category": "Functional JavaScript",
    "subcategory": "Composition",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Composition",
      "Flow"
    ],
    "tags": [
      "flow",
      "composition",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Creates a function that returns the result of invoking given functions from left to right.",
    "problemStatement": "Write a function `flow(...fns)` that creates a function that invokes the provided functions from left to right, passing the return value of each function to the next.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[x => x + 2, x => x * 3], [[4]]]",
        "output": "18",
        "explanation": "(4 + 2) * 3 = 18"
      }
    ],
    "constraints": [
      "First function can take multiple arguments."
    ],
    "starterCode": "function flow(...fns) {\n  // Write your solution here\n}",
    "functionName": "flow",
    "testCases": [
      {
        "id": "tc_291_1",
        "input": "[[x => x + 2, x => x * 3], [[4]]]",
        "expectedOutput": "18",
        "isHidden": false
      },
      {
        "id": "tc_291_2",
        "input": "[[(a, b) => a + b, x => x * 2], [[3, 4]]]",
        "expectedOutput": "14",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_291_3",
        "input": "[[], [[100]]]",
        "expectedOutput": "100",
        "isHidden": true
      }
    ],
    "solution": "function flow(...fns) {\n  return function(...args) {\n    if (fns.length === 0) return args[0];\n    let res = fns[0].apply(this, args);\n    for (let i = 1; i < fns.length; i++) {\n      res = fns[i].call(this, res);\n    }\n    return res;\n  };\n}",
    "explanation": "Call first function with initial args, then pipe result through subsequent functions.",
    "timeComplexity": "O(k)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Apply first function with initial args, loop over remaining."
    ]
  },
  {
    "id": "JS-P292",
    "number": 292,
    "title": "Implement FlowRight Composition",
    "slug": "js-p292-implement-flow-right-composition",
    "category": "Functional JavaScript",
    "subcategory": "Composition",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Composition",
      "FlowRight"
    ],
    "tags": [
      "flowRight",
      "composition",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Creates a function that invokes given functions from right to left.",
    "problemStatement": "Write a function `flowRight(...fns)` that creates a function that invokes the provided functions from right to left.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[x => x * 3, x => x + 2], [[4]]]",
        "output": "18",
        "explanation": "(4 + 2) * 3 = 18"
      }
    ],
    "constraints": [
      "Last function can accept multiple arguments."
    ],
    "starterCode": "function flowRight(...fns) {\n  // Write your solution here\n}",
    "functionName": "flowRight",
    "testCases": [
      {
        "id": "tc_292_1",
        "input": "[[x => x * 3, x => x + 2], [[4]]]",
        "expectedOutput": "18",
        "isHidden": false
      },
      {
        "id": "tc_292_2",
        "input": "[[x => x * 2, (a, b) => a + b], [[3, 4]]]",
        "expectedOutput": "14",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_292_3",
        "input": "[[], [[42]]]",
        "expectedOutput": "42",
        "isHidden": true
      }
    ],
    "solution": "function flowRight(...fns) {\n  return function(...args) {\n    if (fns.length === 0) return args[0];\n    const reversed = fns.slice().reverse();\n    let res = reversed[0].apply(this, args);\n    for (let i = 1; i < reversed.length; i++) {\n      res = reversed[i].call(this, res);\n    }\n    return res;\n  };\n}",
    "explanation": "Reverse fns array and execute left to right.",
    "timeComplexity": "O(k)",
    "spaceComplexity": "O(k)",
    "hints": [
      "Reverse fns array and call in sequence."
    ]
  },
  {
    "id": "JS-P293",
    "number": 293,
    "title": "Implement Over Every Predicate Reducer",
    "slug": "js-p293-implement-over-every-predicate-reducer",
    "category": "Functional JavaScript",
    "subcategory": "Predicates",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Predicates",
      "Array Methods"
    ],
    "tags": [
      "overEvery",
      "predicates",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Return true if all predicates return truthy for arguments.",
    "problemStatement": "Write a function `overEvery(predicates)` that checks if all predicates return truthy when invoked with the provided arguments.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[Boolean, isFinite], [[1], [0], [Infinity]]]",
        "output": "[true, false, false]",
        "explanation": "1 is truthy and finite, 0 is falsy, Infinity is not finite."
      }
    ],
    "constraints": [
      "Return boolean."
    ],
    "starterCode": "function overEvery(predicates) {\n  // Write your solution here\n}",
    "functionName": "overEvery",
    "testCases": [
      {
        "id": "tc_293_1",
        "input": "[[Boolean, isFinite], [[1], [0], [Infinity]]]",
        "expectedOutput": "[true, false, false]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_293_2",
        "input": "[[], [[42]]]",
        "expectedOutput": "[true]",
        "isHidden": true
      }
    ],
    "solution": "function overEvery(predicates) {\n  return function(...args) {\n    return predicates.every(fn => Boolean(fn.apply(this, args)));\n  };\n}",
    "explanation": "Use predicates.every() with boolean cast.",
    "timeComplexity": "O(p)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use predicates.every()."
    ]
  },
  {
    "id": "JS-P294",
    "number": 294,
    "title": "Implement Over Some Predicate Reducer",
    "slug": "js-p294-implement-over-some-predicate-reducer",
    "category": "Functional JavaScript",
    "subcategory": "Predicates",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Predicates",
      "Array Methods"
    ],
    "tags": [
      "overSome",
      "predicates",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Return true if any predicate returns truthy for arguments.",
    "problemStatement": "Write a function `overSome(predicates)` that checks if any predicate returns truthy when invoked with the provided arguments.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[x => x > 0, x => x < -10], [[5], [-20], [-5]]]",
        "output": "[true, true, false]",
        "explanation": "5 is > 0, -20 is < -10, -5 satisfies neither."
      }
    ],
    "constraints": [
      "Return boolean."
    ],
    "starterCode": "function overSome(predicates) {\n  // Write your solution here\n}",
    "functionName": "overSome",
    "testCases": [
      {
        "id": "tc_294_1",
        "input": "[[x => x > 0, x => x < -10], [[5], [-20], [-5]]]",
        "expectedOutput": "[true, true, false]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_294_2",
        "input": "[[], [[10]]]",
        "expectedOutput": "[false]",
        "isHidden": true
      }
    ],
    "solution": "function overSome(predicates) {\n  return function(...args) {\n    return predicates.some(fn => Boolean(fn.apply(this, args)));\n  };\n}",
    "explanation": "Use predicates.some() with boolean cast.",
    "timeComplexity": "O(p)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use predicates.some()."
    ]
  },
  {
    "id": "JS-P295",
    "number": 295,
    "title": "Implement When Conditional Transformer",
    "slug": "js-p295-implement-when-conditional-transformer",
    "category": "Functional JavaScript",
    "subcategory": "Conditional",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Higher-Order Functions",
      "Conditional"
    ],
    "tags": [
      "when",
      "conditional",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Apply transformer if predicate returns true, otherwise return value unchanged.",
    "problemStatement": "Write a function `when(predicate, transformer)` that returns a function. If `predicate(...args)` is truthy, it returns `transformer(...args)`. Otherwise, it returns the first argument unchanged.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[x => x < 0, Math.abs, [[-5], [10]]]",
        "output": "[5, 10]",
        "explanation": "Applies Math.abs only when negative."
      }
    ],
    "constraints": [
      "Return args[0] if predicate is false."
    ],
    "starterCode": "function when(predicate, transformer) {\n  // Write your solution here\n}",
    "functionName": "when",
    "testCases": [
      {
        "id": "tc_295_1",
        "input": "[x => x < 0, Math.abs, [[-5], [10]]]",
        "expectedOutput": "[5, 10]",
        "isHidden": false
      },
      {
        "id": "tc_295_2",
        "input": "[s => typeof s === 'string', s => s.toUpperCase(), [['hello'], [42]]]",
        "expectedOutput": "['HELLO', 42]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_295_3",
        "input": "[() => false, x => x * 2, [[100]]]",
        "expectedOutput": "[100]",
        "isHidden": true
      }
    ],
    "solution": "function when(predicate, transformer) {\n  return function(...args) {\n    if (predicate.apply(this, args)) {\n      return transformer.apply(this, args);\n    }\n    return args[0];\n  };\n}",
    "explanation": "Check predicate, execute transformer or return args[0].",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "If predicate(...args) is truthy return transformer(...args) else args[0]."
    ]
  },
  {
    "id": "JS-P296",
    "number": 296,
    "title": "Implement Unless Conditional Transformer",
    "slug": "js-p296-implement-unless-conditional-transformer",
    "category": "Functional JavaScript",
    "subcategory": "Conditional",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Higher-Order Functions",
      "Conditional"
    ],
    "tags": [
      "unless",
      "conditional",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Apply transformer if predicate returns false, otherwise return value unchanged.",
    "problemStatement": "Write a function `unless(predicate, transformer)` that returns a function. If `predicate(...args)` is false, it returns `transformer(...args)`. Otherwise, it returns `args[0]` unchanged.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[Array.isArray, x => [x], [[[1, 2]], [3]]]",
        "output": "[[1, 2], [3]]",
        "explanation": "Wraps in array only if not already an array."
      }
    ],
    "constraints": [
      "Return args[0] if predicate is true."
    ],
    "starterCode": "function unless(predicate, transformer) {\n  // Write your solution here\n}",
    "functionName": "unless",
    "testCases": [
      {
        "id": "tc_296_1",
        "input": "[Array.isArray, x => [x], [[[1, 2]], [3]]]",
        "expectedOutput": "[[1, 2], [3]]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_296_2",
        "input": "[() => true, x => x * 2, [[50]]]",
        "expectedOutput": "[50]",
        "isHidden": true
      }
    ],
    "solution": "function unless(predicate, transformer) {\n  return function(...args) {\n    if (!predicate.apply(this, args)) {\n      return transformer.apply(this, args);\n    }\n    return args[0];\n  };\n}",
    "explanation": "Invert condition: when !predicate(...args) apply transformer.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "If !predicate(...args) return transformer(...args) else args[0]."
    ]
  },
  {
    "id": "JS-P297",
    "number": 297,
    "title": "Implement IfElse Functional Branching",
    "slug": "js-p297-implement-if-else-functional-branching",
    "category": "Functional JavaScript",
    "subcategory": "Branching",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Higher-Order Functions",
      "Branching"
    ],
    "tags": [
      "ifElse",
      "branching",
      "functional"
    ],
    "expectedTime": "5 mins",
    "summary": "Return onTrue(...args) or onFalse(...args) based on condition(...args).",
    "problemStatement": "Write a function `ifElse(condition, onTrue, onFalse)` that returns a function that invokes `onTrue(...args)` if `condition(...args)` is truthy, otherwise `onFalse(...args)`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[x => x >= 0, x => `+${x}`, x => `-${Math.abs(x)}`, [[5], [-3]]]",
        "output": "['+5', '-3']",
        "explanation": "Branches based on non-negative check."
      }
    ],
    "constraints": [
      "Evaluate condition once per invocation."
    ],
    "starterCode": "function ifElse(condition, onTrue, onFalse) {\n  // Write your solution here\n}",
    "functionName": "ifElse",
    "testCases": [
      {
        "id": "tc_297_1",
        "input": "[x => x >= 0, x => `+${x}`, x => `-${Math.abs(x)}`, [[5], [-3]]]",
        "expectedOutput": "['+5', '-3']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_297_2",
        "input": "[() => true, () => 1, () => 2, [[]]]",
        "expectedOutput": "[1]",
        "isHidden": true
      }
    ],
    "solution": "function ifElse(condition, onTrue, onFalse) {\n  return function(...args) {\n    return condition.apply(this, args) ? onTrue.apply(this, args) : onFalse.apply(this, args);\n  };\n}",
    "explanation": "Ternary evaluation between onTrue and onFalse.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Ternary condition(...args) ? onTrue(...args) : onFalse(...args)."
    ]
  },
  {
    "id": "JS-P298",
    "number": 298,
    "title": "Implement Thunkify Utility",
    "slug": "js-p298-implement-thunkify-utility",
    "category": "Functional JavaScript",
    "subcategory": "Thunks",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Thunks",
      "Closures"
    ],
    "tags": [
      "thunkify",
      "thunk",
      "functional"
    ],
    "expectedTime": "10 mins",
    "summary": "Convert a regular function into a thunk-returning function.",
    "problemStatement": "Write a function `thunkify(fn)` that creates a function that accepts arguments and returns a 0-argument function (a thunk) which evaluates `fn` when called.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(a, b) => a + b, [2, 3], [[]]]",
        "output": "5",
        "explanation": "thunkify(fn)(2, 3)() returns 5."
      }
    ],
    "constraints": [
      "The returned thunk accepts zero arguments."
    ],
    "starterCode": "function thunkify(fn) {\n  // Write your solution here\n}",
    "functionName": "thunkify",
    "testCases": [
      {
        "id": "tc_298_1",
        "input": "[(a, b) => a + b, [[2, 3], []]]",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "id": "tc_298_2",
        "input": "[s => s.toUpperCase(), [['thunk'], []]]",
        "expectedOutput": "'THUNK'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_298_3",
        "input": "[() => 42, [[], []]]",
        "expectedOutput": "42",
        "isHidden": true
      }
    ],
    "solution": "function thunkify(fn) {\n  return function(...args) {\n    return function() {\n      return fn.apply(this, args);\n    };\n  };\n}",
    "explanation": "Return a function capturing args in closure, which returns a zero-argument function.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(k)",
    "hints": [
      "Return (...args) => () => fn(...args)."
    ]
  },
  {
    "id": "JS-P299",
    "number": 299,
    "title": "Implement PipeAsync for Promise Chains",
    "slug": "js-p299-implement-pipe-async-for-promise-chains",
    "category": "Functional JavaScript",
    "subcategory": "Async Composition",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Async",
      "Composition",
      "Promises"
    ],
    "tags": [
      "pipeAsync",
      "async",
      "functional"
    ],
    "expectedTime": "10 mins",
    "summary": "Perform sequential asynchronous function composition left to right.",
    "problemStatement": "Write a function `pipeAsync(...fns)` that chains asynchronous and synchronous functions from left to right, returning a Promise resolving to the final value.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[async x => x + 1, async x => x * 2], [[5]]]",
        "output": "12",
        "explanation": "(5 + 1) * 2 = 12"
      }
    ],
    "constraints": [
      "Support mix of sync and async functions."
    ],
    "starterCode": "function pipeAsync(...fns) {\n  // Write your solution here\n}",
    "functionName": "pipeAsync",
    "testCases": [
      {
        "id": "tc_299_1",
        "input": "[[async x => x + 1, async x => x * 2], [[5]]]",
        "expectedOutput": "12",
        "isHidden": false
      },
      {
        "id": "tc_299_2",
        "input": "[[x => Promise.resolve(x + '!'), s => s.toUpperCase()], [['async']]]",
        "expectedOutput": "'ASYNC!'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_299_3",
        "input": "[[], [[99]]]",
        "expectedOutput": "99",
        "isHidden": true
      }
    ],
    "solution": "function pipeAsync(...fns) {\n  return function(initial) {\n    return fns.reduce(async (accPromise, fn) => {\n      const acc = await accPromise;\n      return fn(acc);\n    }, Promise.resolve(initial));\n  };\n}",
    "explanation": "Reduce over fns awaiting each accumulator promise.",
    "timeComplexity": "O(k)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use fns.reduce with await inside async callback."
    ]
  },
  {
    "id": "JS-P300",
    "number": 300,
    "title": "Implement ComposeAsync for Promise Chains",
    "slug": "js-p300-implement-compose-async-for-promise-chains",
    "category": "Functional JavaScript",
    "subcategory": "Async Composition",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Async",
      "Composition",
      "Promises"
    ],
    "tags": [
      "composeAsync",
      "async",
      "functional"
    ],
    "expectedTime": "10 mins",
    "summary": "Perform right-to-left async function composition.",
    "problemStatement": "Write a function `composeAsync(...fns)` that chains asynchronous and synchronous functions right to left, returning a Promise.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[async x => x * 2, async x => x + 1], [[5]]]",
        "output": "12",
        "explanation": "(5 + 1) * 2 = 12"
      }
    ],
    "constraints": [
      "Support mix of sync and async functions."
    ],
    "starterCode": "function composeAsync(...fns) {\n  // Write your solution here\n}",
    "functionName": "composeAsync",
    "testCases": [
      {
        "id": "tc_300_1",
        "input": "[[async x => x * 2, async x => x + 1], [[5]]]",
        "expectedOutput": "12",
        "isHidden": false
      },
      {
        "id": "tc_300_2",
        "input": "[[s => s.toUpperCase(), async x => x + '!'], [['test']]]",
        "expectedOutput": "'TEST!'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_300_3",
        "input": "[[], [[42]]]",
        "expectedOutput": "42",
        "isHidden": true
      }
    ],
    "solution": "function composeAsync(...fns) {\n  return function(initial) {\n    return fns.reduceRight(async (accPromise, fn) => {\n      const acc = await accPromise;\n      return fn(acc);\n    }, Promise.resolve(initial));\n  };\n}",
    "explanation": "Use reduceRight awaiting each step.",
    "timeComplexity": "O(k)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use fns.reduceRight with await."
    ]
  }
];
