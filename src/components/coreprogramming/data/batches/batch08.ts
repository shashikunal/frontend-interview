// src/components/coreprogramming/data/batches/batch08.ts
import type { CoreProgrammingQuestion } from '../coreProgrammingTypes';

export const batch08: CoreProgrammingQuestion[] = [
  {
    "id": "JS-P351",
    "number": 351,
    "title": "Implement Custom Call Function (myCall)",
    "slug": "js-p351-implement-custom-call-function-mycall",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Invocation",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "this",
      "Functions",
      "Call"
    ],
    "tags": [
      "call",
      "this",
      "functions"
    ],
    "expectedTime": "10 mins",
    "summary": "Simulate Function.prototype.call invoking fn with custom this context.",
    "problemStatement": "Write a function `myCall(fn, context, ...args)` that invokes `fn` with `context` as its `this` value and `args` as positional arguments. If `context` is null or undefined, default to the global `globalThis`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[function(greet) { return `${greet}, ${this.name}`; }, { name: 'Alice' }, 'Hello']",
        "output": "'Hello, Alice'",
        "explanation": "Invokes with { name: 'Alice' } as this."
      }
    ],
    "constraints": [
      "Do not use built-in .call() or .apply()."
    ],
    "starterCode": "function myCall(fn, context, ...args) {\n  // Write your solution here\n}",
    "functionName": "myCall",
    "testCases": [
      {
        "id": "tc_351_1",
        "input": "[function(greet) { return `${greet}, ${this.name}`; }, { name: 'Alice' }, 'Hello']",
        "expectedOutput": "'Hello, Alice'",
        "isHidden": false
      },
      {
        "id": "tc_351_2",
        "input": "[function(a, b) { return (this.base || 0) + a + b; }, { base: 10 }, 5, 3]",
        "expectedOutput": "18",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_351_3",
        "input": "[function() { return 42; }, null]",
        "expectedOutput": "42",
        "isHidden": true
      }
    ],
    "solution": "function myCall(fn, context, ...args) {\n  const ctx = context !== null && context !== undefined ? Object(context) : globalThis;\n  const key = Symbol('fn');\n  ctx[key] = fn;\n  try {\n    return ctx[key](...args);\n  } finally {\n    delete ctx[key];\n  }\n}",
    "explanation": "Attach fn to context with a unique Symbol, invoke via method syntax ctx[sym](...args), and delete symbol.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use a Symbol property to attach fn to context."
    ]
  },
  {
    "id": "JS-P352",
    "number": 352,
    "title": "Implement Custom Apply Function (myApply)",
    "slug": "js-p352-implement-custom-apply-function-myapply",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Invocation",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "this",
      "Functions",
      "Apply"
    ],
    "tags": [
      "apply",
      "this",
      "functions"
    ],
    "expectedTime": "10 mins",
    "summary": "Simulate Function.prototype.apply invoking fn with context and args array.",
    "problemStatement": "Write a function `myApply(fn, context, argsArray = [])` that invokes `fn` with `context` as `this` and elements of `argsArray` spread as arguments.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[function(a, b) { return this.mult * (a + b); }, { mult: 2 }, [3, 4]]",
        "output": "14",
        "explanation": "2 * (3 + 4) = 14"
      }
    ],
    "constraints": [
      "Do not use built-in .call() or .apply()."
    ],
    "starterCode": "function myApply(fn, context, argsArray = []) {\n  // Write your solution here\n}",
    "functionName": "myApply",
    "testCases": [
      {
        "id": "tc_352_1",
        "input": "[function(a, b) { return this.mult * (a + b); }, { mult: 2 }, [3, 4]]",
        "expectedOutput": "14",
        "isHidden": false
      },
      {
        "id": "tc_352_2",
        "input": "[function() { return this.val; }, { val: 'test' }, []]",
        "expectedOutput": "'test'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_352_3",
        "input": "[function(x) { return x; }, null, [99]]",
        "expectedOutput": "99",
        "isHidden": true
      }
    ],
    "solution": "function myApply(fn, context, argsArray = []) {\n  const ctx = context !== null && context !== undefined ? Object(context) : globalThis;\n  const key = Symbol('fn');\n  ctx[key] = fn;\n  try {\n    return ctx[key](...(argsArray || []));\n  } finally {\n    delete ctx[key];\n  }\n}",
    "explanation": "Attach fn via Symbol property on context and spread argsArray.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "ctx[sym](...argsArray)."
    ]
  },
  {
    "id": "JS-P353",
    "number": 353,
    "title": "Implement Custom Bind Function (myBind)",
    "slug": "js-p353-implement-custom-bind-function-mybind",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Binding",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "this",
      "Functions",
      "Bind",
      "Closures"
    ],
    "tags": [
      "bind",
      "this",
      "functions"
    ],
    "expectedTime": "10 mins",
    "summary": "Simulate Function.prototype.bind returning a bound function with partial arguments.",
    "problemStatement": "Write a function `myBind(fn, context, ...boundArgs)` that returns a new function. When called, it invokes `fn` with `context` as `this` and `boundArgs` prepended to new arguments.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[function(a, b) { return `${this.prefix}: ${a + b}`; }, { prefix: 'Sum' }, 5, [[10]]]",
        "output": "'Sum: 15'",
        "explanation": "Binds this and first argument 5."
      }
    ],
    "constraints": [
      "Do not use built-in .bind()."
    ],
    "starterCode": "function myBind(fn, context, ...boundArgs) {\n  // Write your solution here\n}",
    "functionName": "myBind",
    "testCases": [
      {
        "id": "tc_353_1",
        "input": "[function(a, b) { return `${this.prefix}: ${a + b}`; }, { prefix: 'Sum' }, 5, [[10]]]",
        "expectedOutput": "'Sum: 15'",
        "isHidden": false
      },
      {
        "id": "tc_353_2",
        "input": "[function() { return this.x; }, { x: 42 }, [[]]]",
        "expectedOutput": "42",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_353_3",
        "input": "[function(a, b, c) { return a + b + c; }, null, 1, 2, [[3]]]",
        "expectedOutput": "6",
        "isHidden": true
      }
    ],
    "solution": "function myBind(fn, context, ...boundArgs) {\n  return function(...newArgs) {\n    const ctx = context !== null && context !== undefined ? Object(context) : globalThis;\n    const key = Symbol('fn');\n    ctx[key] = fn;\n    try {\n      return ctx[key](...boundArgs, ...newArgs);\n    } finally {\n      delete ctx[key];\n    }\n  };\n}",
    "explanation": "Return closure executing fn with prepended boundArgs on bound context.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(b)",
    "hints": [
      "Return (...newArgs) => invoke with [...boundArgs, ...newArgs]."
    ]
  },
  {
    "id": "JS-P354",
    "number": 354,
    "title": "Implement Custom 'new' Operator (myNew)",
    "slug": "js-p354-implement-custom-new-operator-mynew",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Instantiation",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "new",
      "Prototypes",
      "Instantiation"
    ],
    "tags": [
      "new",
      "prototype",
      "constructors"
    ],
    "expectedTime": "10 mins",
    "summary": "Simulate the new operator instantiating an object with prototype link.",
    "problemStatement": "Write a function `myNew(constructor, ...args)` that simulates `new constructor(...args)`:\n1. Creates a new object inheriting from `constructor.prototype`\n2. Invokes `constructor` with the new object as `this`\n3. If constructor returns a non-null object, return that object; otherwise return the new object.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[function Person(name) { this.name = name; }, 'Alice']",
        "output": "{\"name\":\"Alice\"}",
        "explanation": "Creates Person instance."
      }
    ],
    "constraints": [
      "Correctly link prototype to constructor.prototype."
    ],
    "starterCode": "function myNew(constructor, ...args) {\n  // Write your solution here\n}",
    "functionName": "myNew",
    "testCases": [
      {
        "id": "tc_354_1",
        "input": "[function Person(name) { this.name = name; }, 'Alice']",
        "expectedOutput": "{\"name\":\"Alice\"}",
        "isHidden": false
      },
      {
        "id": "tc_354_2",
        "input": "[function Overwrite() { return { custom: true }; }]",
        "expectedOutput": "{\"custom\":true}",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_354_3",
        "input": "[function Primitive() { this.x = 1; return 42; }]",
        "expectedOutput": "{\"x\":1}",
        "isHidden": true
      }
    ],
    "solution": "function myNew(constructor, ...args) {\n  const obj = Object.create(constructor.prototype);\n  const key = Symbol('fn');\n  obj[key] = constructor;\n  let res;\n  try {\n    res = obj[key](...args);\n  } finally {\n    delete obj[key];\n  }\n  return (res !== null && (typeof res === 'object' || typeof res === 'function')) ? res : obj;\n}",
    "explanation": "Object.create(constructor.prototype), invoke constructor as method on obj, return res if object else obj.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use Object.create(constructor.prototype) and check if return value is an object."
    ]
  },
  {
    "id": "JS-P355",
    "number": 355,
    "title": "Implement Custom 'instanceof' (myInstanceof)",
    "slug": "js-p355-implement-custom-instanceof-myinstanceof",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Prototypes",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Prototypes",
      "instanceof",
      "Prototype Chain"
    ],
    "tags": [
      "instanceof",
      "prototype",
      "chain"
    ],
    "expectedTime": "10 mins",
    "summary": "Walk the prototype chain to check if constructor.prototype exists.",
    "problemStatement": "Write a function `myInstanceof(obj, constructor)` that returns `true` if `constructor.prototype` is in the prototype chain of `obj`, otherwise `false`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], Array]",
        "output": "true",
        "explanation": "[] inherits from Array.prototype."
      },
      {
        "title": "Example 2",
        "input": "[{}, Array]",
        "output": "false",
        "explanation": "{} does not inherit from Array.prototype."
      }
    ],
    "constraints": [
      "Return false for primitives."
    ],
    "starterCode": "function myInstanceof(obj, constructor) {\n  // Write your solution here\n}",
    "functionName": "myInstanceof",
    "testCases": [
      {
        "id": "tc_355_1",
        "input": "[[], Array]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_355_2",
        "input": "[{}, Array]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "id": "tc_355_3",
        "input": "[new Date(), Object]",
        "expectedOutput": "true",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_355_4",
        "input": "[null, Object]",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "id": "tc_355_5",
        "input": "['hello', String]",
        "expectedOutput": "false",
        "isHidden": true
      }
    ],
    "solution": "function myInstanceof(obj, constructor) {\n  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) return false;\n  const targetProto = constructor.prototype;\n  let current = Object.getPrototypeOf(obj);\n  while (current !== null) {\n    if (current === targetProto) return true;\n    current = Object.getPrototypeOf(current);\n  }\n  return false;\n}",
    "explanation": "Traverse prototype chain using Object.getPrototypeOf until finding targetProto or reaching null.",
    "timeComplexity": "O(d) where d is prototype depth",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use a while loop with Object.getPrototypeOf(current)."
    ]
  },
  {
    "id": "JS-P356",
    "number": 356,
    "title": "Implement Custom Object.create (myObjectCreate)",
    "slug": "js-p356-implement-custom-object-create-myobjectcreate",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Prototypes",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Object.create",
      "Prototypes"
    ],
    "tags": [
      "objectCreate",
      "prototype"
    ],
    "expectedTime": "5 mins",
    "summary": "Create a new object with specified prototype object.",
    "problemStatement": "Write a function `myObjectCreate(proto)` that creates and returns a new object whose prototype is `proto`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ a: 1 }]",
        "output": "{}",
        "explanation": "New object with empty own properties, inheriting a: 1."
      }
    ],
    "constraints": [
      "proto must be an object or null."
    ],
    "starterCode": "function myObjectCreate(proto) {\n  // Write your solution here\n}",
    "functionName": "myObjectCreate",
    "testCases": [
      {
        "id": "tc_356_1",
        "input": "[{ a: 1 }]",
        "expectedOutput": "{}",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_356_2",
        "input": "[{ answer: 42 }]",
        "expectedOutput": "{}",
        "isHidden": true
      }
    ],
    "solution": "function myObjectCreate(proto) {\n  if (typeof proto !== 'object' && typeof proto !== 'function') {\n    throw new TypeError('Object prototype may only be an Object or null');\n  }\n  function F() {}\n  F.prototype = proto;\n  const obj = new F();\n  if (proto === null) Object.setPrototypeOf(obj, null);\n  return obj;\n}",
    "explanation": "Use prototype assignment on temporary constructor F.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use F.prototype = proto and new F()."
    ]
  },
  {
    "id": "JS-P357",
    "number": 357,
    "title": "Implement Custom Object.assign (myAssign)",
    "slug": "js-p357-implement-custom-object-assign-myassign",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Object Methods",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Objects",
      "Object.assign"
    ],
    "tags": [
      "assign",
      "objects",
      "shallowCopy"
    ],
    "expectedTime": "5 mins",
    "summary": "Copy all own enumerable properties from sources to target.",
    "problemStatement": "Write a function `myAssign(target, ...sources)` that copies all own enumerable properties from one or more source objects to `target` and returns `target`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ a: 1 }, { b: 2 }, { c: 3 }]",
        "output": "{\"a\":1,\"b\":2,\"c\":3}",
        "explanation": "Merges sources into target."
      }
    ],
    "constraints": [
      "Do not use Object.assign."
    ],
    "starterCode": "function myAssign(target, ...sources) {\n  // Write your solution here\n}",
    "functionName": "myAssign",
    "testCases": [
      {
        "id": "tc_357_1",
        "input": "[{ a: 1 }, { b: 2 }, { c: 3 }]",
        "expectedOutput": "{\"a\":1,\"b\":2,\"c\":3}",
        "isHidden": false
      },
      {
        "id": "tc_357_2",
        "input": "[{ x: 10 }, { x: 20 }]",
        "expectedOutput": "{\"x\":20}",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_357_3",
        "input": "[{}, null, undefined, { ok: true }]",
        "expectedOutput": "{\"ok\":true}",
        "isHidden": true
      }
    ],
    "solution": "function myAssign(target, ...sources) {\n  if (target === null || target === undefined) throw new TypeError('Cannot convert undefined or null to object');\n  const to = Object(target);\n  for (const src of sources) {\n    if (src !== null && src !== undefined) {\n      for (const key of Object.keys(src)) {\n        to[key] = src[key];\n      }\n    }\n  }\n  return to;\n}",
    "explanation": "Iterate over sources and Object.keys(src) assigning to target.",
    "timeComplexity": "O(total keys)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Iterate sources, skipping null/undefined, and assign keys."
    ]
  },
  {
    "id": "JS-P358",
    "number": 358,
    "title": "Implement Custom Object.entries (myObjectEntries)",
    "slug": "js-p358-implement-custom-object-entries-myobjectentries",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Object Methods",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Objects",
      "Object.entries"
    ],
    "tags": [
      "entries",
      "objects"
    ],
    "expectedTime": "5 mins",
    "summary": "Return array of [key, value] pairs for an object's own enumerable properties.",
    "problemStatement": "Write a function `myObjectEntries(obj)` that returns an array of `[key, value]` pairs for `obj`'s own enumerable string-keyed properties.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ a: 1, b: 2 }]",
        "output": "[['a', 1], ['b', 2]]",
        "explanation": "Returns key-value pairs."
      }
    ],
    "constraints": [
      "Only include own properties."
    ],
    "starterCode": "function myObjectEntries(obj) {\n  // Write your solution here\n}",
    "functionName": "myObjectEntries",
    "testCases": [
      {
        "id": "tc_358_1",
        "input": "[{ a: 1, b: 2 }]",
        "expectedOutput": "[['a', 1], ['b', 2]]",
        "isHidden": false
      },
      {
        "id": "tc_358_2",
        "input": "[{}]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_358_3",
        "input": "[{ x: 'test' }]",
        "expectedOutput": "[['x', 'test']]",
        "isHidden": true
      }
    ],
    "solution": "function myObjectEntries(obj) {\n  const res = [];\n  for (const key in obj) {\n    if (Object.prototype.hasOwnProperty.call(obj, key)) {\n      res.push([key, obj[key]]);\n    }\n  }\n  return res;\n}",
    "explanation": "for...in with hasOwnProperty check.",
    "timeComplexity": "O(k)",
    "spaceComplexity": "O(k)",
    "hints": [
      "Check Object.prototype.hasOwnProperty.call(obj, key)."
    ]
  },
  {
    "id": "JS-P359",
    "number": 359,
    "title": "Implement Custom Object.fromEntries (myObjectFromEntries)",
    "slug": "js-p359-implement-custom-object-from-entries-myobjectfromentries",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Object Methods",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Objects",
      "Object.fromEntries"
    ],
    "tags": [
      "fromEntries",
      "objects"
    ],
    "expectedTime": "5 mins",
    "summary": "Transform an array of key-value pairs into an object.",
    "problemStatement": "Write a function `myObjectFromEntries(entries)` that takes an iterable of `[key, value]` pairs and returns an object.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[['a', 1], ['b', 2]]]",
        "output": "{\"a\":1,\"b\":2}",
        "explanation": "Converts pairs to object."
      }
    ],
    "constraints": [
      "Do not use Object.fromEntries."
    ],
    "starterCode": "function myObjectFromEntries(entries) {\n  // Write your solution here\n}",
    "functionName": "myObjectFromEntries",
    "testCases": [
      {
        "id": "tc_359_1",
        "input": "[[['a', 1], ['b', 2]]]",
        "expectedOutput": "{\"a\":1,\"b\":2}",
        "isHidden": false
      },
      {
        "id": "tc_359_2",
        "input": "[[]]",
        "expectedOutput": "{}",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_359_3",
        "input": "[[['x', 'val']]]",
        "expectedOutput": "{\"x\":\"val\"}",
        "isHidden": true
      }
    ],
    "solution": "function myObjectFromEntries(entries) {\n  const obj = {};\n  for (const [key, val] of entries) {\n    obj[key] = val;\n  }\n  return obj;\n}",
    "explanation": "Iterate over entries and assign obj[key] = val.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Iterate with for (const [k, v] of entries) obj[k] = v."
    ]
  },
  {
    "id": "JS-P360",
    "number": 360,
    "title": "Implement Custom Object.is (myObjectIs)",
    "slug": "js-p360-implement-custom-object-is-myobjectis",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Equality",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Equality",
      "Object.is",
      "NaN",
      "Signed Zeros"
    ],
    "tags": [
      "objectIs",
      "equality",
      "sameValue"
    ],
    "expectedTime": "5 mins",
    "summary": "Determine if two values are the SameValue (handles NaN and +0 vs -0).",
    "problemStatement": "Write a function `myObjectIs(a, b)` that implements SameValue equality:\n- `myObjectIs(NaN, NaN)` is `true`\n- `myObjectIs(+0, -0)` is `false`\n- All other comparisons behave like `===`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[NaN, NaN]",
        "output": "true",
        "explanation": "NaN equals NaN."
      },
      {
        "title": "Example 2",
        "input": "[0, -0]",
        "output": "false",
        "explanation": "+0 does not equal -0."
      }
    ],
    "constraints": [
      "Do not use Object.is."
    ],
    "starterCode": "function myObjectIs(a, b) {\n  // Write your solution here\n}",
    "functionName": "myObjectIs",
    "testCases": [
      {
        "id": "tc_360_1",
        "input": "[NaN, NaN]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_360_2",
        "input": "[0, -0]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "id": "tc_360_3",
        "input": "[1, 1]",
        "expectedOutput": "true",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_360_4",
        "input": "['a', 'b']",
        "expectedOutput": "false",
        "isHidden": true
      }
    ],
    "solution": "function myObjectIs(a, b) {\n  if (a === b) {\n    return a !== 0 || 1 / a === 1 / b;\n  }\n  return a !== a && b !== b;\n}",
    "explanation": "Check 1 / a === 1 / b to distinguish +0 from -0, and a !== a && b !== b for NaN.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Check 1 / a === 1 / b for signed zero and a !== a for NaN."
    ]
  },
  {
    "id": "JS-P361",
    "number": 361,
    "title": "Implement Prototypal Inheritance Helper",
    "slug": "js-p361-implement-prototypal-inheritance-helper",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Prototypes",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Prototypes",
      "Inheritance"
    ],
    "tags": [
      "inheritance",
      "prototype",
      "subclass"
    ],
    "expectedTime": "10 mins",
    "summary": "Establish prototype chain between Child and Parent constructors.",
    "problemStatement": "Write a function `inherits(Child, Parent)` that sets up `Child.prototype` to inherit from `Parent.prototype`, restoring `Child.prototype.constructor = Child`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[function Parent() {}, function Child() {}]",
        "output": "true",
        "explanation": "Child.prototype.__proto__ === Parent.prototype."
      }
    ],
    "constraints": [
      "Maintain constructor reference."
    ],
    "starterCode": "function inherits(Child, Parent) {\n  // Write your solution here\n}",
    "functionName": "inherits",
    "testCases": [
      {
        "id": "tc_361_1",
        "input": "[function Animal() { this.isAnimal = true; }, function Dog() { Animal.call(this); this.bark = true; }]",
        "expectedOutput": "true",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_361_2",
        "input": "[function Base() {}, function Derived() {}]",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "solution": "function inherits(Child, Parent) {\n  Child.prototype = Object.create(Parent.prototype);\n  Child.prototype.constructor = Child;\n  return Child.prototype.constructor === Child && Object.getPrototypeOf(Child.prototype) === Parent.prototype;\n}",
    "explanation": "Child.prototype = Object.create(Parent.prototype) and restore constructor.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Object.create(Parent.prototype) and restore constructor."
    ]
  },
  {
    "id": "JS-P362",
    "number": 362,
    "title": "Get Full Prototype Chain",
    "slug": "js-p362-get-full-prototype-chain",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Prototypes",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Prototypes",
      "Prototype Chain"
    ],
    "tags": [
      "prototypeChain",
      "prototypes"
    ],
    "expectedTime": "5 mins",
    "summary": "Return array of prototype constructor names up to Object.",
    "problemStatement": "Write a function `getPrototypeChain(obj)` that returns an array of prototype constructor names starting from `obj`'s immediate prototype up to `Object`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[]]",
        "output": "['Array', 'Object']",
        "explanation": "Array -> Object."
      }
    ],
    "constraints": [
      "If obj is null or undefined, return []."
    ],
    "starterCode": "function getPrototypeChain(obj) {\n  // Write your solution here\n}",
    "functionName": "getPrototypeChain",
    "testCases": [
      {
        "id": "tc_362_1",
        "input": "[[]]",
        "expectedOutput": "['Array', 'Object']",
        "isHidden": false
      },
      {
        "id": "tc_362_2",
        "input": "[{}]",
        "expectedOutput": "['Object']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_362_3",
        "input": "[null]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "solution": "function getPrototypeChain(obj) {\n  if (obj === null || obj === undefined) return [];\n  const names = [];\n  let cur = Object.getPrototypeOf(obj);\n  while (cur !== null) {\n    if (cur.constructor && cur.constructor.name) {\n      names.push(cur.constructor.name);\n    }\n    cur = Object.getPrototypeOf(cur);\n  }\n  return names;\n}",
    "explanation": "Walk prototype chain with Object.getPrototypeOf collecting constructor names.",
    "timeComplexity": "O(d)",
    "spaceComplexity": "O(d)",
    "hints": [
      "Collect cur.constructor.name while cur is not null."
    ]
  },
  {
    "id": "JS-P363",
    "number": 363,
    "title": "Auto-bind All Instance Methods",
    "slug": "js-p363-auto-bind-all-instance-methods",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Binding",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "this",
      "AutoBind",
      "Prototypes"
    ],
    "tags": [
      "autoBind",
      "this",
      "methods"
    ],
    "expectedTime": "10 mins",
    "summary": "Bind all methods on an instance to this so extracting methods maintains context.",
    "problemStatement": "Write a function `autoBind(instance)` that automatically binds all methods of `instance` to `instance` so calling them in detached context retains `this`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ val: 10, getVal() { return this.val; } }]",
        "output": "10",
        "explanation": "Calling detached getVal retains this.val."
      }
    ],
    "constraints": [
      "Mutates instance in place and returns instance."
    ],
    "starterCode": "function autoBind(instance) {\n  // Write your solution here\n}",
    "functionName": "autoBind",
    "testCases": [
      {
        "id": "tc_363_1",
        "input": "[{ val: 10, getVal() { return this.val; } }]",
        "expectedOutput": "{\"val\":10}",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_363_2",
        "input": "[{ name: 'Alice', getName() { return this.name; } }]",
        "expectedOutput": "{\"name\":\"Alice\"}",
        "isHidden": true
      }
    ],
    "solution": "function autoBind(instance) {\n  if (!instance) return instance;\n  const proto = Object.getPrototypeOf(instance);\n  const protoProps = proto ? Object.getOwnPropertyNames(proto) : [];\n  const ownProps = Object.getOwnPropertyNames(instance);\n  const allProps = Array.from(new Set([...protoProps, ...ownProps]));\n  for (const prop of allProps) {\n    if (prop !== 'constructor' && typeof instance[prop] === 'function') {\n      instance[prop] = instance[prop].bind(instance);\n    }\n  }\n  return instance;\n}",
    "explanation": "Bind each method found on prototype or own properties to instance.",
    "timeComplexity": "O(m) where m is method count",
    "spaceComplexity": "O(1)",
    "hints": [
      "Find methods with Object.getOwnPropertyNames and call .bind(instance)."
    ]
  },
  {
    "id": "JS-P364",
    "number": 364,
    "title": "Implement Fluent Method Chaining Calculator",
    "slug": "js-p364-implement-fluent-method-chaining-calculator",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Method Chaining",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "this",
      "Method Chaining",
      "Fluent Interface"
    ],
    "tags": [
      "fluent",
      "chaining",
      "this"
    ],
    "expectedTime": "5 mins",
    "summary": "Builder pattern calculator supporting .add(), .subtract(), .multiply(), .divide(), .value().",
    "problemStatement": "Write a function `fluentCalculator(init = 0)` returning an object with methods:\n- `add(n)`: adds n, returns this\n- `subtract(n)`: subtracts n, returns this\n- `multiply(n)`: multiplies by n, returns this\n- `divide(n)`: divides by n, returns this\n- `value()`: returns current numeric value",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[2], [['add', 3], ['multiply', 4], ['value']]]",
        "output": "20",
        "explanation": "(2 + 3) * 4 = 20."
      }
    ],
    "constraints": [
      "Methods must return this to allow chaining."
    ],
    "starterCode": "function fluentCalculator(init = 0) {\n  // Write your solution here\n}",
    "functionName": "fluentCalculator",
    "testCases": [
      {
        "id": "tc_364_1",
        "input": "[[2], [['add', 3], ['multiply', 4], ['value']]]",
        "expectedOutput": "20",
        "isHidden": false
      },
      {
        "id": "tc_364_2",
        "input": "[[10], [['divide', 2], ['subtract', 1], ['value']]]",
        "expectedOutput": "4",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_364_3",
        "input": "[[0], [['value']]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "solution": "function fluentCalculator(init = 0) {\n  let v = init;\n  const calc = {\n    add(n) { v += n; return this; },\n    subtract(n) { v -= n; return this; },\n    multiply(n) { v *= n; return this; },\n    divide(n) { v /= n; return this; },\n    value() { return v; }\n  };\n  return calc;\n}",
    "explanation": "Return this from each arithmetic method, value() returns final number.",
    "timeComplexity": "O(1) per method",
    "spaceComplexity": "O(1)",
    "hints": [
      "Return this from mutating methods."
    ]
  },
  {
    "id": "JS-P365",
    "number": 365,
    "title": "Implement Fluent String Builder",
    "slug": "js-p365-implement-fluent-string-builder",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Method Chaining",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "this",
      "Method Chaining",
      "Strings"
    ],
    "tags": [
      "stringBuilder",
      "chaining",
      "this"
    ],
    "expectedTime": "5 mins",
    "summary": "Fluent string builder supporting append, appendLine, and toString.",
    "problemStatement": "Write a function `createStringBuilder(initial = '')` returning an object with:\n- `append(str)`: appends str, returns this\n- `appendLine(str)`: appends str followed by '\\n', returns this\n- `toString()`: returns accumulated string\n- `clear()`: resets buffer, returns this",
    "examples": [
      {
        "title": "Example 1",
        "input": "['Hello', [['append', ' '], ['append', 'World'], ['toString']]]",
        "output": "'Hello World'",
        "explanation": "Builds 'Hello World'."
      }
    ],
    "constraints": [
      "Return this from append and clear."
    ],
    "starterCode": "function createStringBuilder(initial = '') {\n  // Write your solution here\n}",
    "functionName": "createStringBuilder",
    "testCases": [
      {
        "id": "tc_365_1",
        "input": "['Hello', [['append', ' '], ['append', 'World'], ['toString']]]",
        "expectedOutput": "'Hello World'",
        "isHidden": false
      },
      {
        "id": "tc_365_2",
        "input": "['', [['appendLine', 'Line 1'], ['append', 'Line 2'], ['toString']]]",
        "expectedOutput": "'Line 1\\nLine 2'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_365_3",
        "input": "['a', [['clear'], ['toString']]]",
        "expectedOutput": "''",
        "isHidden": true
      }
    ],
    "solution": "function createStringBuilder(initial = '') {\n  let buffer = initial;\n  return {\n    append(str) { buffer += str; return this; },\n    appendLine(str = '') { buffer += str + '\\n'; return this; },\n    toString() { return buffer; },\n    clear() { buffer = ''; return this; }\n  };\n}",
    "explanation": "Append strings to internal buffer variable, returning this.",
    "timeComplexity": "O(1) amortized",
    "spaceComplexity": "O(n)",
    "hints": [
      "Return this from append/clear."
    ]
  },
  {
    "id": "JS-P366",
    "number": 366,
    "title": "Implement Method Spy Tracker",
    "slug": "js-p366-implement-method-spy-tracker",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Testing Spies",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "this",
      "Monkey Patching",
      "Testing Spies"
    ],
    "tags": [
      "spy",
      "monkeyPatch",
      "methods"
    ],
    "expectedTime": "10 mins",
    "summary": "Spy on an existing object method, tracking call count and arguments.",
    "problemStatement": "Write a function `createMethodSpy(obj, methodName)` that wraps `obj[methodName]`:\n- Tracks calls in `calls` array\n- Provides `calls()` method returning recorded call argument lists\n- Preserves `this` context and original return values.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ add(a, b) { return a + b; } }, 'add', [['call', 2, 3], ['calls']]]",
        "output": "[5, [[2, 3]]]",
        "explanation": "Tracks arguments of call."
      }
    ],
    "constraints": [
      "Preserve original method execution."
    ],
    "starterCode": "function createMethodSpy(obj, methodName) {\n  // Write your solution here\n}",
    "functionName": "createMethodSpy",
    "testCases": [
      {
        "id": "tc_366_1",
        "input": "[{ add(a, b) { return a + b; } }, 'add', [['call', 2, 3], ['calls']]]",
        "expectedOutput": "[5, [[2, 3]]]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_366_2",
        "input": "[{ getVal() { return 42; } }, 'getVal', [['call'], ['calls']]]",
        "expectedOutput": "[42, [[]]]",
        "isHidden": true
      }
    ],
    "solution": "function createMethodSpy(obj, methodName) {\n  const original = obj[methodName];\n  const recorded = [];\n  return {\n    call: (...args) => {\n      recorded.push(args);\n      return original.apply(obj, args);\n    },\n    calls: () => recorded.slice()\n  };\n}",
    "explanation": "Save original function reference, track calls upon invocation.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(c) calls",
    "hints": [
      "Save original = obj[methodName] and record arguments."
    ]
  },
  {
    "id": "JS-P367",
    "number": 367,
    "title": "Check if Object is a Plain Object",
    "slug": "js-p367-check-if-object-is-a-plain-object",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Type Checking",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Prototypes",
      "Type Checking"
    ],
    "tags": [
      "isPlainObject",
      "prototype",
      "type"
    ],
    "expectedTime": "5 mins",
    "summary": "Determine if a value was created by {} or Object.create(null).",
    "problemStatement": "Write a function `isPlainObject(val)` that returns `true` if `val` is an object created by the `Object` constructor or with `Object.create(null)`, otherwise `false`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ a: 1 }]",
        "output": "true",
        "explanation": "Plain object literal."
      },
      {
        "title": "Example 2",
        "input": "[new Date()]",
        "output": "false",
        "explanation": "Instance of Date class is not a plain object."
      }
    ],
    "constraints": [
      "Arrays, RegExps, Dates, and Class instances return false."
    ],
    "starterCode": "function isPlainObject(val) {\n  // Write your solution here\n}",
    "functionName": "isPlainObject",
    "testCases": [
      {
        "id": "tc_367_1",
        "input": "[{ a: 1 }]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_367_2",
        "input": "[new Date()]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "id": "tc_367_3",
        "input": "[[]]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_367_4",
        "input": "[null]",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "id": "tc_367_5",
        "input": "[Object.create(null)]",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "solution": "function isPlainObject(val) {\n  if (val === null || typeof val !== 'object') return false;\n  const proto = Object.getPrototypeOf(val);\n  return proto === null || proto === Object.prototype;\n}",
    "explanation": "Check if prototype is null or Object.prototype.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Check Object.getPrototypeOf(val) === null || Object.getPrototypeOf(val) === Object.prototype."
    ]
  },
  {
    "id": "JS-P368",
    "number": 368,
    "title": "Safe hasOwnProperty Check",
    "slug": "js-p368-safe-has-own-property-check",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Security",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Prototypes",
      "Security",
      "hasOwnProperty"
    ],
    "tags": [
      "hasOwnProperty",
      "security",
      "prototype"
    ],
    "expectedTime": "3 mins",
    "summary": "Check own property safely even on Object.create(null) objects.",
    "problemStatement": "Write a function `safeHasOwnProperty(obj, prop)` that returns `true` if `obj` has `prop` as its own property, even if `obj` has no prototype or has overridden `hasOwnProperty`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ a: 1 }, 'a']",
        "output": "true",
        "explanation": "'a' is an own property."
      }
    ],
    "constraints": [
      "Do not call obj.hasOwnProperty directly."
    ],
    "starterCode": "function safeHasOwnProperty(obj, prop) {\n  // Write your solution here\n}",
    "functionName": "safeHasOwnProperty",
    "testCases": [
      {
        "id": "tc_368_1",
        "input": "[{ a: 1 }, 'a']",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_368_2",
        "input": "[{ a: 1 }, 'toString']",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_368_3",
        "input": "[null, 'x']",
        "expectedOutput": "false",
        "isHidden": true
      }
    ],
    "solution": "function safeHasOwnProperty(obj, prop) {\n  if (obj === null || obj === undefined) return false;\n  return Object.prototype.hasOwnProperty.call(obj, prop);\n}",
    "explanation": "Call Object.prototype.hasOwnProperty.call(obj, prop).",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use Object.prototype.hasOwnProperty.call(obj, prop)."
    ]
  },
  {
    "id": "JS-P369",
    "number": 369,
    "title": "Implement Method Delegator",
    "slug": "js-p369-implement-method-delegator",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Delegation",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "this",
      "Delegation",
      "Composition"
    ],
    "tags": [
      "delegate",
      "composition",
      "methods"
    ],
    "expectedTime": "10 mins",
    "summary": "Create an object delegating specific methods to a target object.",
    "problemStatement": "Write a function `createDelegator(target, methods)` that returns an object where each name in `methods` forwards calls to `target`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ greet(n) { return `Hi ${n}`; } }, ['greet'], [['greet', 'Bob']]]",
        "output": "['Hi Bob']",
        "explanation": "Delegates greet call to target."
      }
    ],
    "constraints": [
      "Preserve return value and arguments."
    ],
    "starterCode": "function createDelegator(target, methods) {\n  // Write your solution here\n}",
    "functionName": "createDelegator",
    "testCases": [
      {
        "id": "tc_369_1",
        "input": "[{ greet(n) { return `Hi ${n}`; } }, ['greet'], [['greet', 'Bob']]]",
        "expectedOutput": "['Hi Bob']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_369_2",
        "input": "[{ sum(a, b) { return a + b; } }, ['sum'], [['sum', 10, 20]]]",
        "expectedOutput": "[30]",
        "isHidden": true
      }
    ],
    "solution": "function createDelegator(target, methods) {\n  const source = {};\n  for (const m of methods) {\n    source[m] = function(...args) {\n      return target[m].apply(target, args);\n    };\n  }\n  return source;\n}",
    "explanation": "Define functions on source calling target[m].apply(target, args).",
    "timeComplexity": "O(m)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Assign source[m] = (...args) => target[m](...args)."
    ]
  },
  {
    "id": "JS-P370",
    "number": 370,
    "title": "Implement Singleton Pattern Factory",
    "slug": "js-p370-implement-singleton-pattern-factory",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Design Patterns",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Singleton",
      "Prototypes",
      "Classes"
    ],
    "tags": [
      "singleton",
      "pattern",
      "classes"
    ],
    "expectedTime": "10 mins",
    "summary": "Wrap a constructor/factory so repeated calls return the same single instance.",
    "problemStatement": "Write a function `createSingleton(factory)` that returns a function returning the same cached instance created on its first call.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[() => ({ id: 42 }), [[], []]]",
        "output": "[{\"id\":42}, {\"id\":42}]",
        "explanation": "Returns identical cached instance."
      }
    ],
    "constraints": [
      "Factory is called at most once."
    ],
    "starterCode": "function createSingleton(factory) {\n  // Write your solution here\n}",
    "functionName": "createSingleton",
    "testCases": [
      {
        "id": "tc_370_1",
        "input": "[() => ({ id: 42 }), [[], []]]",
        "expectedOutput": "[{\"id\":42}, {\"id\":42}]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_370_2",
        "input": "[() => ({ connected: true }), [[]]]",
        "expectedOutput": "[{\"connected\":true}]",
        "isHidden": true
      }
    ],
    "solution": "function createSingleton(factory) {\n  let instance;\n  return function(...args) {\n    if (!instance) {\n      instance = factory(...args);\n    }\n    return instance;\n  };\n}",
    "explanation": "Cache instance in closure, instantiate only if instance is undefined.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Cache instance variable in closure."
    ]
  },
  {
    "id": "JS-P371",
    "number": 371,
    "title": "Simulate Object.seal (sealObject)",
    "slug": "js-p371-simulate-object-seal-sealobject",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Object Integrity",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Object.seal",
      "Integrity"
    ],
    "tags": [
      "seal",
      "integrity",
      "objects"
    ],
    "expectedTime": "5 mins",
    "summary": "Seal an object preventing new property additions while allowing modification of existing.",
    "problemStatement": "Write a function `sealObject(obj)` that seals `obj` using `Object.seal` and returns `obj`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ a: 1 }]",
        "output": "{\"a\":1}",
        "explanation": "Prevents adding new properties."
      }
    ],
    "constraints": [
      "Returns obj."
    ],
    "starterCode": "function sealObject(obj) {\n  // Write your solution here\n}",
    "functionName": "sealObject",
    "testCases": [
      {
        "id": "tc_371_1",
        "input": "[{ a: 1 }]",
        "expectedOutput": "{\"a\":1}",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_371_2",
        "input": "[{ x: 5 }]",
        "expectedOutput": "{\"x\":5}",
        "isHidden": true
      }
    ],
    "solution": "function sealObject(obj) {\n  return Object.seal(obj);\n}",
    "explanation": "Apply Object.seal to object.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use Object.seal(obj)."
    ]
  },
  {
    "id": "JS-P372",
    "number": 372,
    "title": "Simulate Object.freeze (freezeObject)",
    "slug": "js-p372-simulate-object-freeze-freezeobject",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Object Integrity",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Object.freeze",
      "Immutability"
    ],
    "tags": [
      "freeze",
      "immutability",
      "objects"
    ],
    "expectedTime": "5 mins",
    "summary": "Freeze an object preventing any modifications, additions, or deletions.",
    "problemStatement": "Write a function `freezeObject(obj)` that freezes `obj` using `Object.freeze` and returns `obj`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ a: 1 }]",
        "output": "{\"a\":1}",
        "explanation": "Object is frozen."
      }
    ],
    "constraints": [
      "Returns obj."
    ],
    "starterCode": "function freezeObject(obj) {\n  // Write your solution here\n}",
    "functionName": "freezeObject",
    "testCases": [
      {
        "id": "tc_372_1",
        "input": "[{ a: 1 }]",
        "expectedOutput": "{\"a\":1}",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_372_2",
        "input": "[{ val: 42 }]",
        "expectedOutput": "{\"val\":42}",
        "isHidden": true
      }
    ],
    "solution": "function freezeObject(obj) {\n  return Object.freeze(obj);\n}",
    "explanation": "Apply Object.freeze(obj).",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use Object.freeze(obj)."
    ]
  },
  {
    "id": "JS-P373",
    "number": 373,
    "title": "Create Negative Array Index Accessor",
    "slug": "js-p373-create-negative-array-index-accessor",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Arrays",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Arrays",
      "Negative Indices"
    ],
    "tags": [
      "arrays",
      "negativeIndex"
    ],
    "expectedTime": "5 mins",
    "summary": "Access elements supporting python-style negative indices like -1 for last.",
    "problemStatement": "Write a function `createNegativeArray(arr)` returning an object with `get(index)` that returns element at `arr.length + index` when `index < 0`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[[10, 20, 30]], [['get', -1], ['get', -2], ['get', 0]]]",
        "output": "[30, 20, 10]",
        "explanation": "-1 returns last element 30."
      }
    ],
    "constraints": [
      "Support negative indices."
    ],
    "starterCode": "function createNegativeArray(arr) {\n  // Write your solution here\n}",
    "functionName": "createNegativeArray",
    "testCases": [
      {
        "id": "tc_373_1",
        "input": "[[[10, 20, 30]], [['get', -1], ['get', -2], ['get', 0]]]",
        "expectedOutput": "[30, 20, 10]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_373_2",
        "input": "[[['a', 'b']], [['get', -1]]]",
        "expectedOutput": "['b']",
        "isHidden": true
      }
    ],
    "solution": "function createNegativeArray(arr) {\n  return {\n    get: (idx) => {\n      const actual = idx < 0 ? arr.length + idx : idx;\n      return arr[actual];\n    }\n  };\n}",
    "explanation": "Compute idx < 0 ? arr.length + idx : idx.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "idx < 0 ? arr.length + idx : idx."
    ]
  },
  {
    "id": "JS-P374",
    "number": 374,
    "title": "Create Default Value Object Wrapper",
    "slug": "js-p374-create-default-value-object-wrapper",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Defaults",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Objects",
      "Defaults"
    ],
    "tags": [
      "defaults",
      "objects"
    ],
    "expectedTime": "5 mins",
    "summary": "Wrap an object to return fallback default value for any missing property.",
    "problemStatement": "Write a function `createDefaultObject(target, defaultValue)` returning an object with `get(key)` returning `target[key]` if key exists in `target`, else `defaultValue`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ a: 1 }, 0, [['get', 'a'], ['get', 'b']]]",
        "output": "[1, 0]",
        "explanation": "'b' falls back to 0."
      }
    ],
    "constraints": [
      "Check key in target."
    ],
    "starterCode": "function createDefaultObject(target, defaultValue) {\n  // Write your solution here\n}",
    "functionName": "createDefaultObject",
    "testCases": [
      {
        "id": "tc_374_1",
        "input": "[{ a: 1 }, 0, [['get', 'a'], ['get', 'b']]]",
        "expectedOutput": "[1, 0]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_374_2",
        "input": "[{}, 'missing', [['get', 'x']]]",
        "expectedOutput": "['missing']",
        "isHidden": true
      }
    ],
    "solution": "function createDefaultObject(target, defaultValue) {\n  return {\n    get: (key) => (key in target ? target[key] : defaultValue)\n  };\n}",
    "explanation": "Check key in target.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "key in target ? target[key] : defaultValue."
    ]
  },
  {
    "id": "JS-P375",
    "number": 375,
    "title": "Create Read-Only Object Wrapper",
    "slug": "js-p375-create-read-only-object-wrapper",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Immutability",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Objects",
      "Immutability"
    ],
    "tags": [
      "readOnly",
      "immutability"
    ],
    "expectedTime": "5 mins",
    "summary": "Wrap object allowing reads while blocking writes with 'Read only'.",
    "problemStatement": "Write a function `createReadOnlyObject(target)` returning an object with:\n- `get(k)`: returns `target[k]`\n- `set(k, v)`: returns string `'Read only'` without modifying target.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ a: 1 }, [['get', 'a'], ['set', 'a', 2]]]",
        "output": "[1, 'Read only']",
        "explanation": "Blocks writes."
      }
    ],
    "constraints": [
      "Never modify target."
    ],
    "starterCode": "function createReadOnlyObject(target) {\n  // Write your solution here\n}",
    "functionName": "createReadOnlyObject",
    "testCases": [
      {
        "id": "tc_375_1",
        "input": "[{ a: 1 }, [['get', 'a'], ['set', 'a', 2]]]",
        "expectedOutput": "[1, 'Read only']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_375_2",
        "input": "[{ x: 10 }, [['get', 'x']]]",
        "expectedOutput": "[10]",
        "isHidden": true
      }
    ],
    "solution": "function createReadOnlyObject(target) {\n  return {\n    get: (k) => target[k],\n    set: () => 'Read only'\n  };\n}",
    "explanation": "Return target[k] on get, return 'Read only' on set.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Return target[k] on get, 'Read only' on set."
    ]
  },
  {
    "id": "JS-P376",
    "number": 376,
    "title": "Create Property Access Tracker",
    "slug": "js-p376-create-property-access-tracker",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Telemetry",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Telemetry",
      "Objects"
    ],
    "tags": [
      "tracker",
      "telemetry",
      "objects"
    ],
    "expectedTime": "5 mins",
    "summary": "Track which properties were read from an object.",
    "problemStatement": "Write a function `createPropertyTracker(target)` returning an object with:\n- `get(k)`: returns `target[k]` and logs `k`\n- `getAccessed()`: returns array of accessed property names in order.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ a: 1, b: 2 }, [['get', 'a'], ['get', 'b'], ['getAccessed']]]",
        "output": "[1, 2, ['a', 'b']]",
        "explanation": "Tracks 'a' and 'b'."
      }
    ],
    "constraints": [
      "Record each get access."
    ],
    "starterCode": "function createPropertyTracker(target) {\n  // Write your solution here\n}",
    "functionName": "createPropertyTracker",
    "testCases": [
      {
        "id": "tc_376_1",
        "input": "[{ a: 1, b: 2 }, [['get', 'a'], ['get', 'b'], ['getAccessed']]]",
        "expectedOutput": "[1, 2, ['a', 'b']]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_376_2",
        "input": "[{}, [['getAccessed']]]",
        "expectedOutput": "[[]]",
        "isHidden": true
      }
    ],
    "solution": "function createPropertyTracker(target) {\n  const accessed = [];\n  return {\n    get: (k) => {\n      accessed.push(k);\n      return target[k];\n    },\n    getAccessed: () => accessed.slice()\n  };\n}",
    "explanation": "Push k to accessed array on get.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(a)",
    "hints": [
      "Record k in accessed array."
    ]
  },
  {
    "id": "JS-P377",
    "number": 377,
    "title": "Create Observable State Object",
    "slug": "js-p377-create-observable-state-object",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Observer",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Observer",
      "State"
    ],
    "tags": [
      "observable",
      "state",
      "closures"
    ],
    "expectedTime": "5 mins",
    "summary": "Track property mutations with oldValue and newValue history.",
    "problemStatement": "Write a function `createObservableObject(target)` returning an object with:\n- `set(k, v)`: updates `k` to `v` and records `{ prop: k, n: v, o: oldVal }`\n- `get(k)`: returns current `target[k]`\n- `getHistory()`: returns array of recorded change objects.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ x: 1 }, [['set', 'x', 10], ['get', 'x'], ['getHistory']]]",
        "output": "[10, 10, [{\"prop\":\"x\",\"n\":10,\"o\":1}]]",
        "explanation": "Logs property mutation."
      }
    ],
    "constraints": [
      "Record old and new values."
    ],
    "starterCode": "function createObservableObject(target) {\n  // Write your solution here\n}",
    "functionName": "createObservableObject",
    "testCases": [
      {
        "id": "tc_377_1",
        "input": "[{ x: 1 }, [['set', 'x', 10], ['get', 'x'], ['getHistory']]]",
        "expectedOutput": "[10, 10, [{\"prop\":\"x\",\"n\":10,\"o\":1}]]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_377_2",
        "input": "[{}, [['getHistory']]]",
        "expectedOutput": "[[]]",
        "isHidden": true
      }
    ],
    "solution": "function createObservableObject(target) {\n  const history = [];\n  const state = { ...target };\n  return {\n    set: (k, v) => {\n      const old = state[k];\n      state[k] = v;\n      history.push({ prop: k, n: v, o: old });\n      return v;\n    },\n    get: (k) => state[k],\n    getHistory: () => history.slice()\n  };\n}",
    "explanation": "Save old value, update state, log change object.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(h)",
    "hints": [
      "Record { prop: k, n: v, o: old }."
    ]
  },
  {
    "id": "JS-P378",
    "number": 378,
    "title": "Implement Deep Clone with Prototype Preservation",
    "slug": "js-p378-implement-deep-clone-with-prototype-preservation",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Prototypes",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Prototypes",
      "Deep Clone"
    ],
    "tags": [
      "deepClone",
      "prototype",
      "objects"
    ],
    "expectedTime": "10 mins",
    "summary": "Deep clone an object while preserving prototype chains of custom classes.",
    "problemStatement": "Write a function `deepCloneWithProto(obj)` that deep copies nested objects while setting `Object.getPrototypeOf(copy)` to match the source prototype.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ a: 1, b: { c: 2 } }]",
        "output": "{\"a\":1,\"b\":{\"c\":2}}",
        "explanation": "Deep clones nested objects."
      }
    ],
    "constraints": [
      "Preserve prototypes recursively."
    ],
    "starterCode": "function deepCloneWithProto(obj) {\n  // Write your solution here\n}",
    "functionName": "deepCloneWithProto",
    "testCases": [
      {
        "id": "tc_378_1",
        "input": "[{ a: 1, b: { c: 2 } }]",
        "expectedOutput": "{\"a\":1,\"b\":{\"c\":2}}",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_378_2",
        "input": "[{ x: 10 }]",
        "expectedOutput": "{\"x\":10}",
        "isHidden": true
      }
    ],
    "solution": "function deepCloneWithProto(obj) {\n  if (obj === null || typeof obj !== 'object') return obj;\n  if (Array.isArray(obj)) return obj.map(deepCloneWithProto);\n  const proto = Object.getPrototypeOf(obj);\n  const copy = Object.create(proto);\n  for (const key of Object.keys(obj)) {\n    copy[key] = deepCloneWithProto(obj[key]);\n  }\n  return copy;\n}",
    "explanation": "Use Object.create(Object.getPrototypeOf(obj)) to create copy before cloning keys.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use Object.create(Object.getPrototypeOf(obj))."
    ]
  },
  {
    "id": "JS-P379",
    "number": 379,
    "title": "Check Has Prototype Helper",
    "slug": "js-p379-check-has-prototype-helper",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Prototypes",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Prototypes",
      "Prototype Chain"
    ],
    "tags": [
      "prototype",
      "isPrototypeOf"
    ],
    "expectedTime": "5 mins",
    "summary": "Check if proto exists anywhere in the prototype chain of target.",
    "problemStatement": "Write a function `hasPrototype(target, proto)` that returns `true` if `proto` is in the prototype chain of `target`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], Array.prototype]",
        "output": "true",
        "explanation": "Array.prototype is in []'s prototype chain."
      }
    ],
    "constraints": [
      "Return false if target is null."
    ],
    "starterCode": "function hasPrototype(target, proto) {\n  // Write your solution here\n}",
    "functionName": "hasPrototype",
    "testCases": [
      {
        "id": "tc_379_1",
        "input": "[[], Array.prototype]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_379_2",
        "input": "[{}, Array.prototype]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_379_3",
        "input": "[null, Object.prototype]",
        "expectedOutput": "false",
        "isHidden": true
      }
    ],
    "solution": "function hasPrototype(target, proto) {\n  if (target === null || target === undefined) return false;\n  let cur = Object.getPrototypeOf(target);\n  while (cur !== null) {\n    if (cur === proto) return true;\n    cur = Object.getPrototypeOf(cur);\n  }\n  return false;\n}",
    "explanation": "Walk prototype chain until match found or reaching null.",
    "timeComplexity": "O(d)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Traverse Object.getPrototypeOf."
    ]
  },
  {
    "id": "JS-P380",
    "number": 380,
    "title": "Implement Mixin Composition Helper",
    "slug": "js-p380-implement-mixin-composition-helper",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Composition",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Prototypes",
      "Mixins",
      "Composition"
    ],
    "tags": [
      "mixin",
      "prototypes",
      "composition"
    ],
    "expectedTime": "5 mins",
    "summary": "Copy methods from multiple mixins into a target object.",
    "problemStatement": "Write a function `applyMixins(target, ...mixins)` that copies all properties from each mixin into `target` and returns `target`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ a: 1 }, { b: 2 }]",
        "output": "{\"a\":1,\"b\":2}",
        "explanation": "Merges mixins into target."
      }
    ],
    "constraints": [
      "Returns target."
    ],
    "starterCode": "function applyMixins(target, ...mixins) {\n  // Write your solution here\n}",
    "functionName": "applyMixins",
    "testCases": [
      {
        "id": "tc_380_1",
        "input": "[{ a: 1 }, { b: 2 }]",
        "expectedOutput": "{\"a\":1,\"b\":2}",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_380_2",
        "input": "[{}, { x: 10 }]",
        "expectedOutput": "{\"x\":10}",
        "isHidden": true
      }
    ],
    "solution": "function applyMixins(target, ...mixins) {\n  return Object.assign(target, ...mixins);\n}",
    "explanation": "Object.assign(target, ...mixins).",
    "timeComplexity": "O(k)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use Object.assign(target, ...mixins)."
    ]
  },
  {
    "id": "JS-P381",
    "number": 381,
    "title": "Implement Symbol Property Helper",
    "slug": "js-p381-implement-symbol-property-helper",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Symbols",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Symbols",
      "Objects"
    ],
    "tags": [
      "symbol",
      "objects",
      "hidden"
    ],
    "expectedTime": "5 mins",
    "summary": "Define a hidden symbol property on an object and return the stored value.",
    "problemStatement": "Write a function `setSymbolProp(obj, desc, val)` that creates a new `Symbol(desc)`, sets `obj[symbol] = val`, and returns `val`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{}, 'id', 123]",
        "output": "123",
        "explanation": "Stored under unique symbol."
      }
    ],
    "constraints": [
      "Sets property via Symbol."
    ],
    "starterCode": "function setSymbolProp(obj, desc, val) {\n  // Write your solution here\n}",
    "functionName": "setSymbolProp",
    "testCases": [
      {
        "id": "tc_381_1",
        "input": "[{}, 'id', 123]",
        "expectedOutput": "123",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_381_2",
        "input": "[{}, 'tag', 'test']",
        "expectedOutput": "'test'",
        "isHidden": true
      }
    ],
    "solution": "function setSymbolProp(obj, desc, val) {\n  const sym = Symbol(desc);\n  obj[sym] = val;\n  return obj[sym];\n}",
    "explanation": "Create Symbol(desc), assign to obj, and return it.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "const sym = Symbol(desc); obj[sym] = val; return obj[sym];"
    ]
  },
  {
    "id": "JS-P382",
    "number": 382,
    "title": "Implement Clone RegExp Helper",
    "slug": "js-p382-implement-clone-regexp-helper",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Objects",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "RegExp",
      "Objects"
    ],
    "tags": [
      "regexp",
      "clone"
    ],
    "expectedTime": "5 mins",
    "summary": "Clone a regular expression instance preserving source and flags.",
    "problemStatement": "Write a function `cloneRegExp(regex)` that creates a new RegExp object with the same source pattern, flags, and `lastIndex`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[/test/gi]",
        "output": "/test/gi",
        "explanation": "Clones pattern and flags."
      }
    ],
    "constraints": [
      "Preserve lastIndex."
    ],
    "starterCode": "function cloneRegExp(regex) {\n  // Write your solution here\n}",
    "functionName": "cloneRegExp",
    "testCases": [
      {
        "id": "tc_382_1",
        "input": "[/test/gi]",
        "expectedOutput": "/test/gi",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_382_2",
        "input": "[/abc/]",
        "expectedOutput": "/abc/",
        "isHidden": true
      }
    ],
    "solution": "function cloneRegExp(regex) {\n  const copy = new RegExp(regex.source, regex.flags);\n  copy.lastIndex = regex.lastIndex;\n  return copy;\n}",
    "explanation": "new RegExp(regex.source, regex.flags) and copy lastIndex.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "new RegExp(regex.source, regex.flags)."
    ]
  },
  {
    "id": "JS-P383",
    "number": 383,
    "title": "Implement Clone Date Helper",
    "slug": "js-p383-implement-clone-date-helper",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Objects",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Date",
      "Objects"
    ],
    "tags": [
      "date",
      "clone"
    ],
    "expectedTime": "3 mins",
    "summary": "Clone a Date object preserving timestamp.",
    "problemStatement": "Write a function `cloneDate(date)` that returns a new Date instance with the same timestamp as `date`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[new Date(1600000000000)]",
        "output": "new Date(1600000000000)",
        "explanation": "Same epoch time."
      }
    ],
    "constraints": [
      "Returns a distinct Date instance."
    ],
    "starterCode": "function cloneDate(date) {\n  // Write your solution here\n}",
    "functionName": "cloneDate",
    "testCases": [
      {
        "id": "tc_383_1",
        "input": "[new Date(1600000000000)]",
        "expectedOutput": "new Date(1600000000000)",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_383_2",
        "input": "[new Date(0)]",
        "expectedOutput": "new Date(0)",
        "isHidden": true
      }
    ],
    "solution": "function cloneDate(date) {\n  return new Date(date.getTime());\n}",
    "explanation": "new Date(date.getTime()).",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "new Date(date.getTime())."
    ]
  },
  {
    "id": "JS-P384",
    "number": 384,
    "title": "Implement Method Chaining Pipeline Executor",
    "slug": "js-p384-implement-method-chaining-pipeline-executor",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Chaining",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "this",
      "Method Chaining"
    ],
    "tags": [
      "chaining",
      "pipeline",
      "methods"
    ],
    "expectedTime": "10 mins",
    "summary": "Execute an array of method calls sequentially on an object supporting fluent return.",
    "problemStatement": "Write a function `pipeMethods(instance, methodCalls)` that executes an array of `[methodName, ...args]` sequentially on `instance` and returns the final method result.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ n: 0, add(x) { this.n += x; return this; }, get() { return this.n; } }, [['add', 5], ['add', 10], ['get']]]",
        "output": "15",
        "explanation": "Applies calls sequentially."
      }
    ],
    "constraints": [
      "Support methods returning this or values."
    ],
    "starterCode": "function pipeMethods(instance, methodCalls) {\n  // Write your solution here\n}",
    "functionName": "pipeMethods",
    "testCases": [
      {
        "id": "tc_384_1",
        "input": "[{ n: 0, add(x) { this.n += x; return this; }, get() { return this.n; } }, [['add', 5], ['add', 10], ['get']]]",
        "expectedOutput": "15",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_384_2",
        "input": "[{ echo(x) { return x; } }, [['echo', 42]]]",
        "expectedOutput": "42",
        "isHidden": true
      }
    ],
    "solution": "function pipeMethods(instance, methodCalls) {\n  let cur = instance;\n  for (const [method, ...args] of methodCalls) {\n    cur = cur[method](...args);\n  }\n  return cur;\n}",
    "explanation": "Loop over method calls updating cur = cur[method](...args).",
    "timeComplexity": "O(k)",
    "spaceComplexity": "O(1)",
    "hints": [
      "cur = cur[method](...args)."
    ]
  },
  {
    "id": "JS-P385",
    "number": 385,
    "title": "Implement Callable Object",
    "slug": "js-p385-implement-callable-object",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Functions as Objects",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Functions as Objects",
      "Prototypes"
    ],
    "tags": [
      "callable",
      "objects",
      "functions"
    ],
    "expectedTime": "10 mins",
    "summary": "Create a callable function that also exposes custom object properties and methods.",
    "problemStatement": "Write a function `callableObject(fn, properties)` that attaches all keys of `properties` to `fn` and returns `fn` so it can be called as a function or accessed like an object.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[x => x * 2, { desc: 'doubler' }]",
        "output": "function with properties",
        "explanation": "fn(5) === 10 and fn.desc === 'doubler'."
      }
    ],
    "constraints": [
      "Mutates or assigns properties onto fn."
    ],
    "starterCode": "function callableObject(fn, properties) {\n  // Write your solution here\n}",
    "functionName": "callableObject",
    "testCases": [
      {
        "id": "tc_385_1",
        "input": "[x => x * 2, { desc: 'doubler' }]",
        "expectedOutput": "function",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_385_2",
        "input": "[() => 1, { val: 42 }]",
        "expectedOutput": "function",
        "isHidden": true
      }
    ],
    "solution": "function callableObject(fn, properties) {\n  return Object.assign(fn, properties);\n}",
    "explanation": "Use Object.assign to merge properties onto the function object.",
    "timeComplexity": "O(p)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use Object.assign(fn, properties)."
    ]
  },
  {
    "id": "JS-P386",
    "number": 386,
    "title": "Override Method with Wrapper",
    "slug": "js-p386-override-method-with-wrapper",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Monkey Patching",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "this",
      "Monkey Patching"
    ],
    "tags": [
      "override",
      "methods",
      "wrapper"
    ],
    "expectedTime": "10 mins",
    "summary": "Replace an object's method with a wrapper that receives the original method as first argument.",
    "problemStatement": "Write a function `overrideMethod(obj, methodName, wrapper)` that replaces `obj[methodName]` with a function invoking `wrapper(originalMethod, ...args)` with correct `this`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ greet(name) { return `Hi ${name}`; } }, 'greet', (orig, name) => orig(name).toUpperCase()]",
        "output": "object with overridden greet",
        "explanation": "Wraps and transforms result."
      }
    ],
    "constraints": [
      "Preserve context this inside originalMethod."
    ],
    "starterCode": "function overrideMethod(obj, methodName, wrapper) {\n  // Write your solution here\n}",
    "functionName": "overrideMethod",
    "testCases": [
      {
        "id": "tc_386_1",
        "input": "[{ greet(name) { return `Hi ${name}`; } }, 'greet', function(orig, name) { return orig.call(this, name).toUpperCase(); }]",
        "expectedOutput": "object",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_386_2",
        "input": "[{ get() { return 10; } }, 'get', function(orig) { return orig.call(this) * 2; }]",
        "expectedOutput": "object",
        "isHidden": true
      }
    ],
    "solution": "function overrideMethod(obj, methodName, wrapper) {\n  const orig = obj[methodName];\n  obj[methodName] = function(...args) {\n    return wrapper.call(this, orig.bind(this), ...args);\n  };\n  return obj;\n}",
    "explanation": "Pass orig.bind(this) to wrapper.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Pass orig.bind(this) as first argument to wrapper."
    ]
  },
  {
    "id": "JS-P387",
    "number": 387,
    "title": "Get Own Property Descriptors Map",
    "slug": "js-p387-get-own-property-descriptors-map",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Object Descriptors",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Descriptors",
      "Object Reflection"
    ],
    "tags": [
      "descriptors",
      "properties",
      "reflection"
    ],
    "expectedTime": "5 mins",
    "summary": "Return map of all own property descriptors for an object.",
    "problemStatement": "Write a function `getOwnPropertyDescriptors(obj)` that returns an object containing all own property descriptors for `obj`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ a: 1 }]",
        "output": "descriptors map",
        "explanation": "Contains descriptor for 'a'."
      }
    ],
    "constraints": [
      "Include non-enumerable properties."
    ],
    "starterCode": "function getOwnPropertyDescriptors(obj) {\n  // Write your solution here\n}",
    "functionName": "getOwnPropertyDescriptors",
    "testCases": [
      {
        "id": "tc_387_1",
        "input": "[{ a: 1 }]",
        "expectedOutput": "{\"a\":{\"value\":1,\"writable\":true,\"enumerable\":true,\"configurable\":true}}",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_387_2",
        "input": "[{}]",
        "expectedOutput": "{}",
        "isHidden": true
      }
    ],
    "solution": "function getOwnPropertyDescriptors(obj) {\n  const res = {};\n  for (const key of Object.getOwnPropertyNames(obj)) {\n    res[key] = Object.getOwnPropertyDescriptor(obj, key);\n  }\n  return res;\n}",
    "explanation": "Iterate Object.getOwnPropertyNames and get descriptor for each.",
    "timeComplexity": "O(k)",
    "spaceComplexity": "O(k)",
    "hints": [
      "Use Object.getOwnPropertyDescriptor(obj, key)."
    ]
  },
  {
    "id": "JS-P388",
    "number": 388,
    "title": "Define Read-Only Property Helper",
    "slug": "js-p388-define-read-only-property-helper",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Object Descriptors",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Object.defineProperty",
      "Descriptors"
    ],
    "tags": [
      "defineProperty",
      "readOnly",
      "descriptors"
    ],
    "expectedTime": "5 mins",
    "summary": "Define a non-writable, non-configurable property on an object.",
    "problemStatement": "Write a function `defineReadOnly(obj, prop, val)` that defines `prop` on `obj` with `writable: false`, `enumerable: true`, `configurable: false`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{}, 'id', 100]",
        "output": "{\"id\":100}",
        "explanation": "Property is read-only."
      }
    ],
    "constraints": [
      "Returns obj."
    ],
    "starterCode": "function defineReadOnly(obj, prop, val) {\n  // Write your solution here\n}",
    "functionName": "defineReadOnly",
    "testCases": [
      {
        "id": "tc_388_1",
        "input": "[{}, 'id', 100]",
        "expectedOutput": "{\"id\":100}",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_388_2",
        "input": "[{}, 'k', 'v']",
        "expectedOutput": "{\"k\":\"v\"}",
        "isHidden": true
      }
    ],
    "solution": "function defineReadOnly(obj, prop, val) {\n  Object.defineProperty(obj, prop, {\n    value: val,\n    writable: false,\n    enumerable: true,\n    configurable: false\n  });\n  return obj;\n}",
    "explanation": "Call Object.defineProperty with writable: false.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Object.defineProperty with writable: false."
    ]
  },
  {
    "id": "JS-P389",
    "number": 389,
    "title": "Define Getter/Setter Property Pair",
    "slug": "js-p389-define-getter-setter-property-pair",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Object Descriptors",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Object.defineProperty",
      "Getters",
      "Setters"
    ],
    "tags": [
      "getter",
      "setter",
      "defineProperty"
    ],
    "expectedTime": "5 mins",
    "summary": "Define accessor property with custom getter and setter functions.",
    "problemStatement": "Write a function `defineAccessor(obj, prop, getter, setter)` that sets up accessor property `prop` on `obj` using the provided `getter` and `setter`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{}, 'val', () => 42, () => {}]",
        "output": "{\"val\":42}",
        "explanation": "Accessor returns 42."
      }
    ],
    "constraints": [
      "Returns obj."
    ],
    "starterCode": "function defineAccessor(obj, prop, getter, setter) {\n  // Write your solution here\n}",
    "functionName": "defineAccessor",
    "testCases": [
      {
        "id": "tc_389_1",
        "input": "[{}, 'val', () => 42, () => {}]",
        "expectedOutput": "{\"val\":42}",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_389_2",
        "input": "[{}, 'fixed', () => 100, () => {}]",
        "expectedOutput": "{\"fixed\":100}",
        "isHidden": true
      }
    ],
    "solution": "function defineAccessor(obj, prop, getter, setter) {\n  Object.defineProperty(obj, prop, {\n    get: getter,\n    set: setter,\n    enumerable: true,\n    configurable: true\n  });\n  return obj;\n}",
    "explanation": "Call Object.defineProperty with get and set options.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use get and set in property descriptor."
    ]
  },
  {
    "id": "JS-P390",
    "number": 390,
    "title": "Simulate Object.preventExtensions",
    "slug": "js-p390-simulate-object-preventextensions",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Object Integrity",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Object.preventExtensions",
      "Integrity"
    ],
    "tags": [
      "preventExtensions",
      "integrity",
      "objects"
    ],
    "expectedTime": "3 mins",
    "summary": "Prevent new properties from being added to an object.",
    "problemStatement": "Write a function `preventExtensions(obj)` that prevents new properties from being added using `Object.preventExtensions(obj)` and returns `obj`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ a: 1 }]",
        "output": "{\"a\":1}",
        "explanation": "Object is no longer extensible."
      }
    ],
    "constraints": [
      "Returns obj."
    ],
    "starterCode": "function preventExtensions(obj) {\n  // Write your solution here\n}",
    "functionName": "preventExtensions",
    "testCases": [
      {
        "id": "tc_390_1",
        "input": "[{ a: 1 }]",
        "expectedOutput": "{\"a\":1}",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_390_2",
        "input": "[{ x: 10 }]",
        "expectedOutput": "{\"x\":10}",
        "isHidden": true
      }
    ],
    "solution": "function preventExtensions(obj) {\n  return Object.preventExtensions(obj);\n}",
    "explanation": "Apply Object.preventExtensions.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use Object.preventExtensions(obj)."
    ]
  },
  {
    "id": "JS-P391",
    "number": 391,
    "title": "Dynamic Factory for Subclasses",
    "slug": "js-p391-dynamic-factory-for-subclasses",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Classes",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Classes",
      "Inheritance",
      "Factory"
    ],
    "tags": [
      "subclass",
      "classes",
      "inheritance"
    ],
    "expectedTime": "10 mins",
    "summary": "Dynamically generate a subclass instance with custom methods.",
    "problemStatement": "Write a function `createSubclassInstance(initial, methods)` that returns an instance initialized with `initial` and assigned `methods`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ x: 5 }, { double() { return this.x * 2; } }, [['double']]]",
        "output": "[10]",
        "explanation": "Calls double()."
      }
    ],
    "constraints": [
      "methods attached to instance."
    ],
    "starterCode": "function createSubclassInstance(initial, methods) {\n  // Write your solution here\n}",
    "functionName": "createSubclassInstance",
    "testCases": [
      {
        "id": "tc_391_1",
        "input": "[{ x: 5 }, { double() { return this.x * 2; } }, [['double']]]",
        "expectedOutput": "[10]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_391_2",
        "input": "[{ v: 100 }, { get() { return this.v; } }, [['get']]]",
        "expectedOutput": "[100]",
        "isHidden": true
      }
    ],
    "solution": "function createSubclassInstance(initial, methods) {\n  const inst = Object.create(methods);\n  Object.assign(inst, initial);\n  return inst;\n}",
    "explanation": "Object.create(methods) with initial properties.",
    "timeComplexity": "O(m)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use Object.create(methods) and assign initial."
    ]
  },
  {
    "id": "JS-P392",
    "number": 392,
    "title": "Implement Polymorphic Shape Hierarchy",
    "slug": "js-p392-implement-polymorphic-shape-hierarchy",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Polymorphism",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "OOP",
      "Polymorphism",
      "Classes"
    ],
    "tags": [
      "polymorphism",
      "oop",
      "shapes"
    ],
    "expectedTime": "10 mins",
    "summary": "Factory returning polymorphic Shape instances with area() and perimeter().",
    "problemStatement": "Write a function `createShape(type, ...dimensions)` that returns a shape object with `area()` and `perimeter()` methods:\n- `'circle'`: dimensions `[radius]` (`area = Math.PI * r^2`, `perimeter = 2 * Math.PI * r`)\n- `'rectangle'`: dimensions `[width, height]` (`area = w * h`, `perimeter = 2 * (w + h)`)\n- `'square'`: dimensions `[side]` (`area = s^2`, `perimeter = 4 * s`)",
    "examples": [
      {
        "title": "Example 1",
        "input": "['rectangle', 4, 5, [['area'], ['perimeter']]]",
        "output": "[20, 18]",
        "explanation": "Rectangle methods."
      }
    ],
    "constraints": [
      "Returns object with area() and perimeter()."
    ],
    "starterCode": "function createShape(type, ...dimensions) {\n  // Write your solution here\n}",
    "functionName": "createShape",
    "testCases": [
      {
        "id": "tc_392_1",
        "input": "['rectangle', 4, 5, [['area'], ['perimeter']]]",
        "expectedOutput": "[20, 18]",
        "isHidden": false
      },
      {
        "id": "tc_392_2",
        "input": "['square', 6, [['area'], ['perimeter']]]",
        "expectedOutput": "[36, 24]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_392_3",
        "input": "['circle', 1, [['area']]]",
        "expectedOutput": "[3.141592653589793]",
        "isHidden": true
      }
    ],
    "solution": "function createShape(type, ...dimensions) {\n  if (type === 'circle') {\n    const [r] = dimensions;\n    return {\n      area: () => Math.PI * r * r,\n      perimeter: () => 2 * Math.PI * r\n    };\n  } else if (type === 'rectangle') {\n    const [w, h] = dimensions;\n    return {\n      area: () => w * h,\n      perimeter: () => 2 * (w + h)\n    };\n  } else if (type === 'square') {\n    const [s] = dimensions;\n    return {\n      area: () => s * s,\n      perimeter: () => 4 * s\n    };\n  }\n  throw new Error('Unknown shape type');\n}",
    "explanation": "Return shape object with area and perimeter calculations.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Implement branch for circle, rectangle, square."
    ]
  },
  {
    "id": "JS-P393",
    "number": 393,
    "title": "Check isPrototypeOf Compatibility",
    "slug": "js-p393-check-isprototypeof-compatibility",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Prototypes",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Prototypes",
      "isPrototypeOf"
    ],
    "tags": [
      "isPrototypeOf",
      "prototype"
    ],
    "expectedTime": "5 mins",
    "summary": "Simulate Object.prototype.isPrototypeOf checking prototype ancestry.",
    "problemStatement": "Write a function `isPrototypeOf(proto, obj)` that returns `true` if `proto` appears in `obj`'s prototype chain.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[Array.prototype, []]",
        "output": "true",
        "explanation": "Array.prototype is in [] chain."
      }
    ],
    "constraints": [
      "Return false if obj is null or undefined."
    ],
    "starterCode": "function isPrototypeOf(proto, obj) {\n  // Write your solution here\n}",
    "functionName": "isPrototypeOf",
    "testCases": [
      {
        "id": "tc_393_1",
        "input": "[Array.prototype, []]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_393_2",
        "input": "[Object.prototype, Object.create(null)]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_393_3",
        "input": "[Function.prototype, () => {}]",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "solution": "function isPrototypeOf(proto, obj) {\n  if (obj === null || obj === undefined) return false;\n  let cur = Object.getPrototypeOf(obj);\n  while (cur !== null) {\n    if (cur === proto) return true;\n    cur = Object.getPrototypeOf(cur);\n  }\n  return false;\n}",
    "explanation": "Traverse prototype chain comparing cur to proto.",
    "timeComplexity": "O(d)",
    "spaceComplexity": "O(1)",
    "hints": [
      "While loop with Object.getPrototypeOf."
    ]
  },
  {
    "id": "JS-P394",
    "number": 394,
    "title": "Implement Safe setPrototypeOf Helper",
    "slug": "js-p394-implement-safe-setprototypeof-helper",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Prototypes",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Object.setPrototypeOf",
      "Prototypes"
    ],
    "tags": [
      "setPrototypeOf",
      "prototype"
    ],
    "expectedTime": "5 mins",
    "summary": "Safely set prototype of an object, returning the mutated object.",
    "problemStatement": "Write a function `setPrototypeOf(obj, proto)` that sets `proto` as prototype of `obj` using `Object.setPrototypeOf` and returns `obj`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{}, { test: 123 }]",
        "output": "{}",
        "explanation": "obj inherits from proto."
      }
    ],
    "constraints": [
      "Returns obj."
    ],
    "starterCode": "function setPrototypeOf(obj, proto) {\n  // Write your solution here\n}",
    "functionName": "setPrototypeOf",
    "testCases": [
      {
        "id": "tc_394_1",
        "input": "[{}, { test: 123 }]",
        "expectedOutput": "{}",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_394_2",
        "input": "[{}, null]",
        "expectedOutput": "{}",
        "isHidden": true
      }
    ],
    "solution": "function setPrototypeOf(obj, proto) {\n  return Object.setPrototypeOf(obj, proto);\n}",
    "explanation": "Use Object.setPrototypeOf.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use Object.setPrototypeOf(obj, proto)."
    ]
  },
  {
    "id": "JS-P395",
    "number": 395,
    "title": "Implement Method Memoization Helper",
    "slug": "js-p395-implement-method-memoization-helper",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Decorators",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Decorators",
      "Memoization",
      "this"
    ],
    "tags": [
      "decorator",
      "memoize",
      "methods"
    ],
    "expectedTime": "10 mins",
    "summary": "Memoize a method on an object per-instance using a Map.",
    "problemStatement": "Write a function `memoizeMethod(obj, methodName)` that replaces `obj[methodName]` with a memoized version caching results by arguments for that specific instance.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ calc(x) { return x * 2; } }, 'calc']",
        "output": "object with memoized calc",
        "explanation": "Caches calls."
      }
    ],
    "constraints": [
      "Preserve this context."
    ],
    "starterCode": "function memoizeMethod(obj, methodName) {\n  // Write your solution here\n}",
    "functionName": "memoizeMethod",
    "testCases": [
      {
        "id": "tc_395_1",
        "input": "[{ calc(x) { return x * 2; } }, 'calc']",
        "expectedOutput": "object",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_395_2",
        "input": "[{ square(n) { return n * n; } }, 'square']",
        "expectedOutput": "object",
        "isHidden": true
      }
    ],
    "solution": "function memoizeMethod(obj, methodName) {\n  const orig = obj[methodName];\n  const cache = new Map();\n  obj[methodName] = function(...args) {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const res = orig.apply(this, args);\n    cache.set(key, res);\n    return res;\n  };\n  return obj;\n}",
    "explanation": "Store cache Map in closure and replace method.",
    "timeComplexity": "O(1) on cache hit",
    "spaceComplexity": "O(m)",
    "hints": [
      "Replace method with wrapper querying cache Map."
    ]
  },
  {
    "id": "JS-P396",
    "number": 396,
    "title": "Implement Method Before/After Hooks",
    "slug": "js-p396-implement-method-before-after-hooks",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Aspect-Oriented",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "AOP",
      "this",
      "Hooks"
    ],
    "tags": [
      "hooks",
      "aop",
      "methods"
    ],
    "expectedTime": "10 mins",
    "summary": "Attach before and after lifecycle hooks around an object's method.",
    "problemStatement": "Write a function `attachHooks(obj, methodName, { before, after })` that wraps `obj[methodName]`:\n- Calls `before(args)` before method\n- Executes method\n- Calls `after(result, args)` after method\n- Returns method result",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ fn(x) { return x * 2; } }, 'fn', { before: () => {}, after: () => {} }]",
        "output": "object with hooked fn",
        "explanation": "Hooks trigger around method."
      }
    ],
    "constraints": [
      "Preserve return value and this."
    ],
    "starterCode": "function attachHooks(obj, methodName, { before, after }) {\n  // Write your solution here\n}",
    "functionName": "attachHooks",
    "testCases": [
      {
        "id": "tc_396_1",
        "input": "[{ fn(x) { return x * 2; } }, 'fn', { before: () => {}, after: () => {} }]",
        "expectedOutput": "object",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_396_2",
        "input": "[{ add(a, b) { return a + b; } }, 'add', {}]",
        "expectedOutput": "object",
        "isHidden": true
      }
    ],
    "solution": "function attachHooks(obj, methodName, { before, after } = {}) {\n  const orig = obj[methodName];\n  obj[methodName] = function(...args) {\n    if (typeof before === 'function') before.call(this, args);\n    const res = orig.apply(this, args);\n    if (typeof after === 'function') after.call(this, res, args);\n    return res;\n  };\n  return obj;\n}",
    "explanation": "Call before hook, execute orig, call after hook, return res.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Call before, invoke orig, call after."
    ]
  },
  {
    "id": "JS-P397",
    "number": 397,
    "title": "Implement Polymorphic Area Calculator",
    "slug": "js-p397-implement-polymorphic-area-calculator",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Polymorphism",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "OOP",
      "Polymorphism"
    ],
    "tags": [
      "polymorphism",
      "area",
      "shapes"
    ],
    "expectedTime": "5 mins",
    "summary": "Compute sum of areas for an array of polymorphic shape instances.",
    "problemStatement": "Write a function `totalArea(shapes)` that calculates the sum of `shape.area()` across all items in `shapes` array.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[{ area: () => 10 }, { area: () => 20 }]]",
        "output": "30",
        "explanation": "10 + 20 = 30."
      }
    ],
    "constraints": [
      "Each item in shapes implements area()."
    ],
    "starterCode": "function totalArea(shapes) {\n  // Write your solution here\n}",
    "functionName": "totalArea",
    "testCases": [
      {
        "id": "tc_397_1",
        "input": "[[{ area: () => 10 }, { area: () => 20 }]]",
        "expectedOutput": "30",
        "isHidden": false
      },
      {
        "id": "tc_397_2",
        "input": "[[]]",
        "expectedOutput": "0",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_397_3",
        "input": "[[{ area: () => 42 }]]",
        "expectedOutput": "42",
        "isHidden": true
      }
    ],
    "solution": "function totalArea(shapes) {\n  return shapes.reduce((sum, shape) => sum + shape.area(), 0);\n}",
    "explanation": "Reduce over shapes invoking shape.area().",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "shapes.reduce((sum, s) => sum + s.area(), 0)."
    ]
  },
  {
    "id": "JS-P398",
    "number": 398,
    "title": "Implement Prototype Method Extender",
    "slug": "js-p398-implement-prototype-method-extender",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Prototypes",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Prototypes",
      "Extension"
    ],
    "tags": [
      "prototype",
      "methods",
      "extend"
    ],
    "expectedTime": "5 mins",
    "summary": "Add multiple methods to a constructor's prototype.",
    "problemStatement": "Write a function `extendPrototype(Constructor, methods)` that copies each method from `methods` onto `Constructor.prototype`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[function Greeter() {}, { hi() { return 'hi'; } }]",
        "output": "function",
        "explanation": "Adds hi to prototype."
      }
    ],
    "constraints": [
      "Mutates Constructor.prototype."
    ],
    "starterCode": "function extendPrototype(Constructor, methods) {\n  // Write your solution here\n}",
    "functionName": "extendPrototype",
    "testCases": [
      {
        "id": "tc_398_1",
        "input": "[function G() {}, { hi() { return 'hi'; } }]",
        "expectedOutput": "function",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_398_2",
        "input": "[function C() {}, { val: 42 }]",
        "expectedOutput": "function",
        "isHidden": true
      }
    ],
    "solution": "function extendPrototype(Constructor, methods) {\n  Object.assign(Constructor.prototype, methods);\n  return Constructor;\n}",
    "explanation": "Object.assign(Constructor.prototype, methods).",
    "timeComplexity": "O(m)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Object.assign(Constructor.prototype, methods)."
    ]
  },
  {
    "id": "JS-P399",
    "number": 399,
    "title": "Implement Object Property Flattener",
    "slug": "js-p399-implement-object-property-flattener",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Prototypes",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Prototypes",
      "Inherited Properties"
    ],
    "tags": [
      "flatten",
      "prototypes",
      "properties"
    ],
    "expectedTime": "10 mins",
    "summary": "Collect all enumerable own and inherited properties into a single plain object.",
    "problemStatement": "Write a function `flattenPrototypeChain(obj)` that returns a plain object containing all enumerable properties from `obj` and its entire prototype chain (own properties take precedence over inherited).",
    "examples": [
      {
        "title": "Example 1",
        "input": "[Object.assign(Object.create({ a: 1 }), { b: 2 })]",
        "output": "{\"a\":1,\"b\":2}",
        "explanation": "Includes inherited a and own b."
      }
    ],
    "constraints": [
      "Returns a new plain object."
    ],
    "starterCode": "function flattenPrototypeChain(obj) {\n  // Write your solution here\n}",
    "functionName": "flattenPrototypeChain",
    "testCases": [
      {
        "id": "tc_399_1",
        "input": "[Object.assign(Object.create({ a: 1 }), { b: 2 })]",
        "expectedOutput": "{\"a\":1,\"b\":2}",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_399_2",
        "input": "[{ x: 10 }]",
        "expectedOutput": "{\"x\":10}",
        "isHidden": true
      }
    ],
    "solution": "function flattenPrototypeChain(obj) {\n  if (obj === null || obj === undefined) return {};\n  const result = {};\n  for (const key in obj) {\n    result[key] = obj[key];\n  }\n  return result;\n}",
    "explanation": "for...in iterates over own and inherited enumerable properties.",
    "timeComplexity": "O(p)",
    "spaceComplexity": "O(p)",
    "hints": [
      "A for...in loop naturally traverses inherited enumerable properties."
    ]
  },
  {
    "id": "JS-P400",
    "number": 400,
    "title": "Implement Custom Class Builder",
    "slug": "js-p400-implement-custom-class-builder",
    "category": "this / call / apply / bind / Prototype",
    "subcategory": "Classes",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Classes",
      "Prototypes",
      "Constructors"
    ],
    "tags": [
      "classBuilder",
      "oop",
      "prototypes"
    ],
    "expectedTime": "10 mins",
    "summary": "Construct a class with constructor, prototype methods, and static methods without class keyword.",
    "problemStatement": "Write a function `createClass(initFn, methods = {}, staticMethods = {})` returning a constructor function:\n- Instances invoke `initFn` during construction\n- `methods` are added to its prototype\n- `staticMethods` are attached directly to the constructor function.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[function(name) { this.name = name; }, { greet() { return `Hi ${this.name}`; } }, { version: '1.0' }]",
        "output": "function",
        "explanation": "Returns constructor function."
      }
    ],
    "constraints": [
      "Support 'new' invocation."
    ],
    "starterCode": "function createClass(initFn, methods, staticMethods) {\n  // Write your solution here\n}",
    "functionName": "createClass",
    "testCases": [
      {
        "id": "tc_400_1",
        "input": "[function(n) { this.n = n; }, { double() { return this.n * 2; } }, { ver: '1.0' }]",
        "expectedOutput": "function",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_400_2",
        "input": "[function() { this.ok = true; }, {}, {}]",
        "expectedOutput": "function",
        "isHidden": true
      }
    ],
    "solution": "function createClass(initFn, methods = {}, staticMethods = {}) {\n  function Cls(...args) {\n    if (typeof initFn === 'function') initFn.apply(this, args);\n  }\n  Object.assign(Cls.prototype, methods);\n  Cls.prototype.constructor = Cls;\n  Object.assign(Cls, staticMethods);\n  return Cls;\n}",
    "explanation": "Define Cls function invoking initFn, assign methods to Cls.prototype, and staticMethods to Cls.",
    "timeComplexity": "O(m + s)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Assign methods to Cls.prototype and staticMethods to Cls."
    ]
  }
];
