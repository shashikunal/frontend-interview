// Batch 09: Questions JS-P401 to JS-P450 (Async JavaScript, Promises, Concurrency, Event Loop)
import type { CoreProgrammingQuestion } from '../coreProgrammingTypes';

export const batch09Questions: CoreProgrammingQuestion[] = [
  {
    "id": "JS-P401",
    "number": 401,
    "title": "Implement Sleep Utility (sleep)",
    "slug": "js-p401-implement-sleep-utility-sleep",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Timers",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Promises",
      "setTimeout",
      "Async"
    ],
    "tags": [
      "sleep",
      "delay",
      "promises",
      "async"
    ],
    "expectedTime": "5 mins",
    "summary": "Create a promise that resolves after a specified duration in milliseconds.",
    "problemStatement": "Write an async function `sleep(ms)` that returns a Promise resolving after `ms` milliseconds.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[10]",
        "output": "true",
        "explanation": "Resolves after 10ms."
      }
    ],
    "constraints": [
      "ms >= 0",
      "Must return a Promise."
    ],
    "starterCode": "function sleep(ms) {\n  // Write your solution here\n}",
    "functionName": "sleep",
    "testCases": [
      {
        "id": "tc_401_1",
        "input": "[5]",
        "expectedOutput": "true",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_401_2",
        "input": "[0]",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "solution": "function sleep(ms) {\n  return new Promise(resolve => setTimeout(() => resolve(true), ms));\n}",
    "explanation": "Wrap setTimeout inside new Promise and resolve(true) in the callback.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use new Promise((resolve) => setTimeout(resolve, ms))."
    ]
  },
  {
    "id": "JS-P402",
    "number": 402,
    "title": "Delayed Function Execution (delay)",
    "slug": "js-p402-delayed-function-execution-delay",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Timers",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Promises",
      "setTimeout",
      "Functions"
    ],
    "tags": [
      "delay",
      "promises",
      "async"
    ],
    "expectedTime": "5 mins",
    "summary": "Execute a function with arguments after a delay returning its return value.",
    "problemStatement": "Write a function `delay(fn, ms, ...args)` that invokes `fn(...args)` after `ms` milliseconds and resolves with its return value.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(a, b) => a + b, 5, 2, 3]",
        "output": "5",
        "explanation": "Returns 2 + 3 = 5 after 5ms."
      }
    ],
    "constraints": [
      "Supports multiple args."
    ],
    "starterCode": "function delay(fn, ms, ...args) {\n  // Write your solution here\n}",
    "functionName": "delay",
    "testCases": [
      {
        "id": "tc_402_1",
        "input": "[(a, b) => a + b, 5, 2, 3]",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "id": "tc_402_2",
        "input": "[() => 'done', 5]",
        "expectedOutput": "'done'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_402_3",
        "input": "[x => x * 3, 2, 4]",
        "expectedOutput": "12",
        "isHidden": true
      }
    ],
    "solution": "function delay(fn, ms, ...args) {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      try {\n        resolve(fn(...args));\n      } catch (err) {\n        reject(err);\n      }\n    }, ms);\n  });\n}",
    "explanation": "Use setTimeout to invoke fn and resolve the promise with the result.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Wrap in new Promise, invoke fn inside setTimeout callback."
    ]
  },
  {
    "id": "JS-P403",
    "number": 403,
    "title": "Implement Custom Promise.all (myPromiseAll)",
    "slug": "js-p403-implement-custom-promise-all-mypromiseall",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Combinators",
    "difficulty": "Medium",
    "questionType": "Polyfill",
    "skills": [
      "Promise.all",
      "Async",
      "Polyfills"
    ],
    "tags": [
      "promise",
      "polyfill",
      "all"
    ],
    "expectedTime": "10 mins",
    "summary": "Polyfill Promise.all to resolve with an array of values when all promises fulfill.",
    "problemStatement": "Write a function `myPromiseAll(promises)` that replicates `Promise.all`. Resolves when all promises resolve, or rejects immediately on the first rejection. Handles non-promise values.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[Promise.resolve(1), Promise.resolve(2), 3]]",
        "output": "[1, 2, 3]",
        "explanation": "Resolves with [1, 2, 3]."
      }
    ],
    "constraints": [
      "Empty array resolves to [].",
      "Preserves original input index order."
    ],
    "starterCode": "function myPromiseAll(promises) {\n  // Write your solution here\n}",
    "functionName": "myPromiseAll",
    "testCases": [
      {
        "id": "tc_403_1",
        "input": "[[Promise.resolve(1), Promise.resolve(2), 3]]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false
      },
      {
        "id": "tc_403_2",
        "input": "[[]]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_403_3",
        "input": "[[Promise.resolve('a'), 'b', Promise.resolve('c')]]",
        "expectedOutput": "['a', 'b', 'c']",
        "isHidden": true
      }
    ],
    "solution": "function myPromiseAll(promises) {\n  return new Promise((resolve, reject) => {\n    const arr = Array.from(promises);\n    if (arr.length === 0) return resolve([]);\n    const results = new Array(arr.length);\n    let remaining = arr.length;\n    arr.forEach((item, idx) => {\n      Promise.resolve(item).then(val => {\n        results[idx] = val;\n        remaining--;\n        if (remaining === 0) resolve(results);\n      }, reject);\n    });\n  });\n}",
    "explanation": "Count down remaining items, storing each resolved item at its exact index, rejecting immediately on error.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Keep a counter of resolved promises. Ensure you store in results[index]."
    ]
  },
  {
    "id": "JS-P404",
    "number": 404,
    "title": "Implement Custom Promise.race (myPromiseRace)",
    "slug": "js-p404-implement-custom-promise-race-mypromiserace",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Combinators",
    "difficulty": "Medium",
    "questionType": "Polyfill",
    "skills": [
      "Promise.race",
      "Async",
      "Polyfills"
    ],
    "tags": [
      "promise",
      "polyfill",
      "race"
    ],
    "expectedTime": "8 mins",
    "summary": "Polyfill Promise.race resolving or rejecting as soon as the first promise settles.",
    "problemStatement": "Write a function `myPromiseRace(promises)` that returns a Promise that settles with the result of the first settled promise in the iterable.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[new Promise(r => setTimeout(() => r(1), 50)), Promise.resolve(2)]]",
        "output": "2",
        "explanation": "Promise.resolve(2) resolves first."
      }
    ],
    "constraints": [
      "Handles non-promise values."
    ],
    "starterCode": "function myPromiseRace(promises) {\n  // Write your solution here\n}",
    "functionName": "myPromiseRace",
    "testCases": [
      {
        "id": "tc_404_1",
        "input": "[[new Promise(r => setTimeout(() => r('slow'), 30)), Promise.resolve('fast')]]",
        "expectedOutput": "'fast'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_404_2",
        "input": "[[Promise.resolve(10), Promise.resolve(20)]]",
        "expectedOutput": "10",
        "isHidden": true
      }
    ],
    "solution": "function myPromiseRace(promises) {\n  return new Promise((resolve, reject) => {\n    for (const p of promises) {\n      Promise.resolve(p).then(resolve, reject);\n    }\n  });\n}",
    "explanation": "Pass resolve and reject directly into Promise.resolve(p).then(). First settled wins.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Iterate and attach resolve/reject to each."
    ]
  },
  {
    "id": "JS-P405",
    "number": 405,
    "title": "Implement Custom Promise.allSettled (myPromiseAllSettled)",
    "slug": "js-p405-implement-custom-promise-allsettled-mypromiseallsettled",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Combinators",
    "difficulty": "Medium",
    "questionType": "Polyfill",
    "skills": [
      "Promise.allSettled",
      "Async",
      "Polyfills"
    ],
    "tags": [
      "promise",
      "polyfill",
      "allSettled"
    ],
    "expectedTime": "10 mins",
    "summary": "Polyfill Promise.allSettled returning outcome objects for every input promise.",
    "problemStatement": "Write a function `myPromiseAllSettled(promises)` returning a Promise resolving after all promises settle, with objects `{ status: 'fulfilled', value }` or `{ status: 'rejected', reason }`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[Promise.resolve(1), Promise.reject('err')]]",
        "output": "[{ status: 'fulfilled', value: 1 }, { status: 'rejected', reason: 'err' }]",
        "explanation": "Captures both states."
      }
    ],
    "constraints": [
      "Always resolves, never rejects.",
      "Empty array resolves to []."
    ],
    "starterCode": "function myPromiseAllSettled(promises) {\n  // Write your solution here\n}",
    "functionName": "myPromiseAllSettled",
    "testCases": [
      {
        "id": "tc_405_1",
        "input": "[[Promise.resolve(1), Promise.resolve('ok')]]",
        "expectedOutput": "[{ status: 'fulfilled', value: 1 }, { status: 'fulfilled', value: 'ok' }]",
        "isHidden": false
      },
      {
        "id": "tc_405_2",
        "input": "[[]]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_405_3",
        "input": "[[Promise.resolve('ok'), 42]]",
        "expectedOutput": "[{ status: 'fulfilled', value: 'ok' }, { status: 'fulfilled', value: 42 }]",
        "isHidden": true
      }
    ],
    "solution": "function myPromiseAllSettled(promises) {\n  return new Promise(resolve => {\n    const arr = Array.from(promises);\n    if (arr.length === 0) return resolve([]);\n    const results = new Array(arr.length);\n    let remaining = arr.length;\n    arr.forEach((p, idx) => {\n      Promise.resolve(p)\n        .then(value => {\n          results[idx] = { status: 'fulfilled', value };\n        })\n        .catch(reason => {\n          results[idx] = { status: 'rejected', reason };\n        })\n        .finally(() => {\n          remaining--;\n          if (remaining === 0) resolve(results);\n        });\n    });\n  });\n}",
    "explanation": "Handle fulfillment and rejection independently and resolve when remaining reaches 0.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Catch each promise and format into status objects."
    ]
  },
  {
    "id": "JS-P406",
    "number": 406,
    "title": "Implement Custom Promise.any (myPromiseAny)",
    "slug": "js-p406-implement-custom-promise-any-mypromiseany",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Combinators",
    "difficulty": "Medium",
    "questionType": "Polyfill",
    "skills": [
      "Promise.any",
      "Async",
      "Polyfills"
    ],
    "tags": [
      "promise",
      "polyfill",
      "any"
    ],
    "expectedTime": "10 mins",
    "summary": "Polyfill Promise.any resolving on the first fulfilled promise or rejecting with AggregateError.",
    "problemStatement": "Write a function `myPromiseAny(promises)` that returns a Promise resolving with the value of the first fulfilled promise. If all reject, reject with an `AggregateError` containing the errors array.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[Promise.resolve(1), Promise.resolve('success')]]",
        "output": "1",
        "explanation": "First fulfilled value."
      }
    ],
    "constraints": [
      "Rejects if iterable is empty."
    ],
    "starterCode": "function myPromiseAny(promises) {\n  // Write your solution here\n}",
    "functionName": "myPromiseAny",
    "testCases": [
      {
        "id": "tc_406_1",
        "input": "[[Promise.resolve(10), Promise.resolve(20)]]",
        "expectedOutput": "10",
        "isHidden": false
      },
      {
        "id": "tc_406_2",
        "input": "[[Promise.resolve(42)]]",
        "expectedOutput": "42",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_406_3",
        "input": "[[Promise.resolve('b')]]",
        "expectedOutput": "'b'",
        "isHidden": true
      }
    ],
    "solution": "function myPromiseAny(promises) {\n  return new Promise((resolve, reject) => {\n    const arr = Array.from(promises);\n    if (arr.length === 0) return reject(new AggregateError([], 'All promises were rejected'));\n    const errors = new Array(arr.length);\n    let remaining = arr.length;\n    arr.forEach((p, idx) => {\n      Promise.resolve(p).then(resolve, err => {\n        errors[idx] = err;\n        remaining--;\n        if (remaining === 0) {\n          reject(new AggregateError(errors, 'All promises were rejected'));\n        }\n      });\n    });\n  });\n}",
    "explanation": "Resolve on any fulfillment; accumulate errors until remaining is 0.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Accumulate errors until remaining is 0, resolve immediately on fulfillment."
    ]
  },
  {
    "id": "JS-P407",
    "number": 407,
    "title": "Retry Async Function with Fixed Delay (retryPromise)",
    "slug": "js-p407-retry-async-function-with-fixed-delay-retrypromise",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Resilience",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Retry",
      "Async",
      "Promises"
    ],
    "tags": [
      "retry",
      "promises",
      "async"
    ],
    "expectedTime": "10 mins",
    "summary": "Retry an asynchronous operation up to maxRetries times with fixed delay.",
    "problemStatement": "Write an async function `retryPromise(fn, maxRetries = 3, delayMs = 0)` that calls `fn()`. If it throws/rejects, retries up to `maxRetries` times with `delayMs` pause between attempts before rethrowing the final error.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(() => { let c = 0; return () => ++c < 3 ? Promise.reject('fail') : Promise.resolve('ok'); })(), 3, 5]",
        "output": "'ok'",
        "explanation": "Fails twice, succeeds on attempt 3."
      }
    ],
    "constraints": [
      "maxRetries >= 0"
    ],
    "starterCode": "async function retryPromise(fn, maxRetries = 3, delayMs = 0) {\n  // Write your solution here\n}",
    "functionName": "retryPromise",
    "testCases": [
      {
        "id": "tc_407_1",
        "input": "[(() => { let c = 0; return () => ++c < 3 ? Promise.reject('fail') : Promise.resolve('ok'); })(), 3, 5]",
        "expectedOutput": "'ok'",
        "isHidden": false
      },
      {
        "id": "tc_407_2",
        "input": "[() => Promise.resolve('immediate'), 2, 0]",
        "expectedOutput": "'immediate'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_407_3",
        "input": "[(() => { let c = 0; return () => ++c < 2 ? Promise.reject('e') : Promise.resolve(99); })(), 2, 2]",
        "expectedOutput": "99",
        "isHidden": true
      }
    ],
    "solution": "async function retryPromise(fn, maxRetries = 3, delayMs = 0) {\n  let lastError;\n  for (let i = 0; i <= maxRetries; i++) {\n    try {\n      return await fn();\n    } catch (err) {\n      lastError = err;\n      if (i < maxRetries && delayMs > 0) {\n        await new Promise(r => setTimeout(r, delayMs));\n      }\n    }\n  }\n  throw lastError;\n}",
    "explanation": "Loop through attempts 0..maxRetries. Await delay between failed attempts.",
    "timeComplexity": "O(r)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use a for loop up to maxRetries and catch errors."
    ]
  },
  {
    "id": "JS-P408",
    "number": 408,
    "title": "Promise Timeout with Fallback (promiseTimeout)",
    "slug": "js-p408-promise-timeout-with-fallback-promisetimeout",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Timeouts",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Timeout",
      "Promises",
      "Race"
    ],
    "tags": [
      "timeout",
      "promises",
      "fallback"
    ],
    "expectedTime": "8 mins",
    "summary": "Resolve with promise result or fallback value if promise exceeds timeout.",
    "problemStatement": "Write a function `promiseTimeout(promise, ms, fallbackValue)` that resolves with the promise value if it settles within `ms` milliseconds, otherwise resolves with `fallbackValue`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[new Promise(r => setTimeout(() => r('fast'), 10)), 50, 'fallback']",
        "output": "'fast'",
        "explanation": "Finished before timeout."
      },
      {
        "title": "Example 2",
        "input": "[new Promise(r => setTimeout(() => r('slow'), 50)), 10, 'timeout']",
        "output": "'timeout'",
        "explanation": "Timed out and returned fallback."
      }
    ],
    "constraints": [
      "Clear timeout if promise settles first."
    ],
    "starterCode": "function promiseTimeout(promise, ms, fallbackValue) {\n  // Write your solution here\n}",
    "functionName": "promiseTimeout",
    "testCases": [
      {
        "id": "tc_408_1",
        "input": "[new Promise(r => setTimeout(() => r('fast'), 5)), 50, 'fallback']",
        "expectedOutput": "'fast'",
        "isHidden": false
      },
      {
        "id": "tc_408_2",
        "input": "[new Promise(r => setTimeout(() => r('slow'), 50)), 5, 'timeout']",
        "expectedOutput": "'timeout'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_408_3",
        "input": "[Promise.resolve(100), 10, -1]",
        "expectedOutput": "100",
        "isHidden": true
      }
    ],
    "solution": "function promiseTimeout(promise, ms, fallbackValue) {\n  let timer;\n  const timeout = new Promise(resolve => {\n    timer = setTimeout(() => resolve(fallbackValue), ms);\n  });\n  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));\n}",
    "explanation": "Race promise with a timer promise that resolves fallbackValue, clearing timer in finally.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use Promise.race with a timeout promise."
    ]
  },
  {
    "id": "JS-P409",
    "number": 409,
    "title": "Promisify Callback Function (promisify)",
    "slug": "js-p409-promisify-callback-function-promisify",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Callbacks",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Promisify",
      "Callbacks",
      "NodeJS"
    ],
    "tags": [
      "promisify",
      "callbacks",
      "promises"
    ],
    "expectedTime": "8 mins",
    "summary": "Convert a Node.js style error-first callback function into a Promise-returning function.",
    "problemStatement": "Write a function `promisify(fn)` that accepts a function taking `(...args, callback)` where callback has signature `(err, result)`. Returns a function returning a Promise.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(a, b, cb) => cb(null, a + b), [[2, 3]]]",
        "output": "5",
        "explanation": "Resolves with 2 + 3 = 5."
      }
    ],
    "constraints": [
      "Preserves this context if applicable."
    ],
    "starterCode": "function promisify(fn) {\n  // Write your solution here\n}",
    "functionName": "promisify",
    "testCases": [
      {
        "id": "tc_409_1",
        "input": "[(a, b, cb) => cb(null, a + b), [[2, 3]]]",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "id": "tc_409_2",
        "input": "[cb => cb(null, 'hello'), [[]]]",
        "expectedOutput": "'hello'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_409_3",
        "input": "[(str, cb) => cb(null, str.toUpperCase()), [['abc']]]",
        "expectedOutput": "'ABC'",
        "isHidden": true
      }
    ],
    "solution": "function promisify(fn) {\n  return function(...args) {\n    return new Promise((resolve, reject) => {\n      fn.call(this, ...args, (err, result) => {\n        if (err) return reject(err);\n        resolve(result);\n      });\n    });\n  };\n}",
    "explanation": "Return wrapper returning new Promise and invoking fn with a callback handling (err, result).",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Pass callback (err, result) => { if (err) reject(err); else resolve(result); }."
    ]
  },
  {
    "id": "JS-P410",
    "number": 410,
    "title": "Convert Async Function to Callback Form (callbackify)",
    "slug": "js-p410-convert-async-function-to-callback-form-callbackify",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Callbacks",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Callbackify",
      "Callbacks",
      "NodeJS"
    ],
    "tags": [
      "callbackify",
      "callbacks",
      "promises"
    ],
    "expectedTime": "8 mins",
    "summary": "Execute an async function and return a Promise resolving to [err, result].",
    "problemStatement": "Write a function `callbackify(asyncFn, args = [])` that executes `asyncFn(...args)` and returns a Promise resolving to `[null, result]` on resolution, or `[err, null]` on rejection.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[async (x) => x * 2, [5]]",
        "output": "[null, 10]",
        "explanation": "Resolves with [null, 10]."
      }
    ],
    "constraints": [
      "Returns 2-element array [err, result]."
    ],
    "starterCode": "function callbackify(asyncFn, args = []) {\n  // Write your solution here\n}",
    "functionName": "callbackify",
    "testCases": [
      {
        "id": "tc_410_1",
        "input": "[async (x) => x * 2, [5]]",
        "expectedOutput": "[null, 10]",
        "isHidden": false
      },
      {
        "id": "tc_410_2",
        "input": "[async () => 'ok', []]",
        "expectedOutput": "[null, 'ok']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_410_3",
        "input": "[async () => { throw 'err'; }, []]",
        "expectedOutput": "['err', null]",
        "isHidden": true
      }
    ],
    "solution": "function callbackify(asyncFn, args = []) {\n  return new Promise(resolve => {\n    asyncFn(...args)\n      .then(res => resolve([null, res]))\n      .catch(err => resolve([err, null]));\n  });\n}",
    "explanation": "Invoke asyncFn and return a promise resolving to [null, result] or [err, null].",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use .then(res => resolve([null, res])).catch(err => resolve([err, null]))."
    ]
  },
  {
    "id": "JS-P411",
    "number": 411,
    "title": "Execute Async Tasks in Series (asyncSeries)",
    "slug": "js-p411-execute-async-tasks-in-series-asyncseries",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Flow Control",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Async",
      "Promises",
      "Series"
    ],
    "tags": [
      "series",
      "flow",
      "async"
    ],
    "expectedTime": "8 mins",
    "summary": "Execute an array of async functions strictly one after another.",
    "problemStatement": "Write an async function `asyncSeries(tasks)` that executes an array of zero-argument async functions in series and returns an array of their results in order.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[() => Promise.resolve(1), () => Promise.resolve(2)]]",
        "output": "[1, 2]",
        "explanation": "Executes sequentially."
      }
    ],
    "constraints": [
      "Empty tasks returns [].",
      "Stops on first error."
    ],
    "starterCode": "async function asyncSeries(tasks) {\n  // Write your solution here\n}",
    "functionName": "asyncSeries",
    "testCases": [
      {
        "id": "tc_411_1",
        "input": "[[() => Promise.resolve(1), () => Promise.resolve(2), () => Promise.resolve(3)]]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false
      },
      {
        "id": "tc_411_2",
        "input": "[[]]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_411_3",
        "input": "[[async () => 'a', async () => 'b']]",
        "expectedOutput": "['a', 'b']",
        "isHidden": true
      }
    ],
    "solution": "async function asyncSeries(tasks) {\n  const results = [];\n  for (const task of tasks) {\n    results.push(await task());\n  }\n  return results;\n}",
    "explanation": "Iterate through tasks with a for...of loop and await each execution before proceeding.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use for (const task of tasks) and await task()."
    ]
  },
  {
    "id": "JS-P412",
    "number": 412,
    "title": "Execute Async Tasks in Parallel (asyncParallel)",
    "slug": "js-p412-execute-async-tasks-in-parallel-asyncparallel",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Flow Control",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Async",
      "Parallel",
      "Promises"
    ],
    "tags": [
      "parallel",
      "flow",
      "async"
    ],
    "expectedTime": "5 mins",
    "summary": "Execute an array of zero-argument async functions in parallel.",
    "problemStatement": "Write a function `asyncParallel(tasks)` that executes all task functions concurrently and returns a Promise resolving with an array of their results.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[() => Promise.resolve('x'), () => Promise.resolve('y')]]",
        "output": "['x', 'y']",
        "explanation": "Executes concurrently."
      }
    ],
    "constraints": [
      "Order preserved."
    ],
    "starterCode": "function asyncParallel(tasks) {\n  // Write your solution here\n}",
    "functionName": "asyncParallel",
    "testCases": [
      {
        "id": "tc_412_1",
        "input": "[[() => Promise.resolve(10), () => Promise.resolve(20)]]",
        "expectedOutput": "[10, 20]",
        "isHidden": false
      },
      {
        "id": "tc_412_2",
        "input": "[[]]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_412_3",
        "input": "[[async () => 1, async () => 2, async () => 3]]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": true
      }
    ],
    "solution": "function asyncParallel(tasks) {\n  return Promise.all(tasks.map(t => t()));\n}",
    "explanation": "Map tasks to task() executions and wrap in Promise.all.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use Promise.all(tasks.map(t => t()))."
    ]
  },
  {
    "id": "JS-P413",
    "number": 413,
    "title": "Implement Async Waterfall Pipeline (asyncWaterfall)",
    "slug": "js-p413-implement-async-waterfall-pipeline-asyncwaterfall",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Flow Control",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Waterfall",
      "Pipeline",
      "Async"
    ],
    "tags": [
      "waterfall",
      "pipeline",
      "async"
    ],
    "expectedTime": "10 mins",
    "summary": "Pass output of each async task as input into the next sequentially.",
    "problemStatement": "Write an async function `asyncWaterfall(tasks, initialValue)` that executes each task in `tasks` sequentially, passing the return value of each step as the argument to the next.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[async x => x + 1, async x => x * 2], 5]",
        "output": "12",
        "explanation": "(5 + 1) * 2 = 12."
      }
    ],
    "constraints": [
      "Empty tasks returns initialValue."
    ],
    "starterCode": "async function asyncWaterfall(tasks, initialValue) {\n  // Write your solution here\n}",
    "functionName": "asyncWaterfall",
    "testCases": [
      {
        "id": "tc_413_1",
        "input": "[[async x => x + 1, async x => x * 2], 5]",
        "expectedOutput": "12",
        "isHidden": false
      },
      {
        "id": "tc_413_2",
        "input": "[[], 42]",
        "expectedOutput": "42",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_413_3",
        "input": "[[async s => s + ' world', async s => s.toUpperCase()], 'hello']",
        "expectedOutput": "'HELLO WORLD'",
        "isHidden": true
      }
    ],
    "solution": "async function asyncWaterfall(tasks, initialValue) {\n  let cur = initialValue;\n  for (const task of tasks) {\n    cur = await task(cur);\n  }\n  return cur;\n}",
    "explanation": "Reduce sequentially using a for..of loop awaiting each step.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Let cur = initialValue and cur = await task(cur)."
    ]
  },
  {
    "id": "JS-P414",
    "number": 414,
    "title": "Concurrent Asynchronous Map (mapAsync)",
    "slug": "js-p414-concurrent-asynchronous-map-mapasync",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Collections",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Async",
      "Map",
      "Promises"
    ],
    "tags": [
      "map",
      "async",
      "collections"
    ],
    "expectedTime": "5 mins",
    "summary": "Map an array with an async callback running concurrently.",
    "problemStatement": "Write a function `mapAsync(array, asyncFn)` that applies `asyncFn(item, index, array)` to each element concurrently and resolves with the mapped array in order.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3], async x => x * 10]",
        "output": "[10, 20, 30]",
        "explanation": "Maps elements concurrently."
      }
    ],
    "constraints": [
      "Preserves original indices."
    ],
    "starterCode": "function mapAsync(array, asyncFn) {\n  // Write your solution here\n}",
    "functionName": "mapAsync",
    "testCases": [
      {
        "id": "tc_414_1",
        "input": "[[1, 2, 3], async x => x * 10]",
        "expectedOutput": "[10, 20, 30]",
        "isHidden": false
      },
      {
        "id": "tc_414_2",
        "input": "[[], async x => x]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_414_3",
        "input": "[['a', 'b'], async (x, i) => `${x}-${i}`]",
        "expectedOutput": "['a-0', 'b-1']",
        "isHidden": true
      }
    ],
    "solution": "function mapAsync(array, asyncFn) {\n  return Promise.all(array.map((item, idx) => asyncFn(item, idx, array)));\n}",
    "explanation": "Use array.map to start promises and Promise.all to await all.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Promise.all(array.map(asyncFn))."
    ]
  },
  {
    "id": "JS-P415",
    "number": 415,
    "title": "Concurrent Asynchronous Filter (filterAsync)",
    "slug": "js-p415-concurrent-asynchronous-filter-filterasync",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Collections",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Async",
      "Filter",
      "Promises"
    ],
    "tags": [
      "filter",
      "async",
      "collections"
    ],
    "expectedTime": "8 mins",
    "summary": "Filter an array using an asynchronous predicate running concurrently.",
    "problemStatement": "Write an async function `filterAsync(array, asyncPredicate)` that tests each element with `asyncPredicate(item, index, array)` concurrently and returns items where predicate resolved to truthy.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3, 4], async x => x % 2 === 0]",
        "output": "[2, 4]",
        "explanation": "Keeps even numbers."
      }
    ],
    "constraints": [
      "Maintains original element ordering."
    ],
    "starterCode": "async function filterAsync(array, asyncPredicate) {\n  // Write your solution here\n}",
    "functionName": "filterAsync",
    "testCases": [
      {
        "id": "tc_415_1",
        "input": "[[1, 2, 3, 4], async x => x % 2 === 0]",
        "expectedOutput": "[2, 4]",
        "isHidden": false
      },
      {
        "id": "tc_415_2",
        "input": "[[], async () => true]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_415_3",
        "input": "[['cat', 'elephant', 'dog'], async s => s.length > 3]",
        "expectedOutput": "['elephant']",
        "isHidden": true
      }
    ],
    "solution": "async function filterAsync(array, asyncPredicate) {\n  const flags = await Promise.all(array.map((item, idx) => asyncPredicate(item, idx, array)));\n  return array.filter((_, idx) => Boolean(flags[idx]));\n}",
    "explanation": "Evaluate all predicates in parallel, then filter array by boolean outcome flags.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Evaluate with Promise.all first, then filter by results."
    ]
  },
  {
    "id": "JS-P416",
    "number": 416,
    "title": "Sequential Asynchronous Reduce (reduceAsync)",
    "slug": "js-p416-sequential-asynchronous-reduce-reduceasync",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Collections",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Async",
      "Reduce",
      "Promises"
    ],
    "tags": [
      "reduce",
      "async",
      "collections"
    ],
    "expectedTime": "8 mins",
    "summary": "Sequentially accumulate an array using an asynchronous reducer function.",
    "problemStatement": "Write an async function `reduceAsync(array, asyncReducer, initialValue)` that accumulates `array` by sequentially awaiting `asyncReducer(accumulator, item, index, array)`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3], async (acc, x) => acc + x, 0]",
        "output": "6",
        "explanation": "0 + 1 + 2 + 3 = 6."
      }
    ],
    "constraints": [
      "Must execute sequentially."
    ],
    "starterCode": "async function reduceAsync(array, asyncReducer, initialValue) {\n  // Write your solution here\n}",
    "functionName": "reduceAsync",
    "testCases": [
      {
        "id": "tc_416_1",
        "input": "[[1, 2, 3], async (acc, x) => acc + x, 0]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "id": "tc_416_2",
        "input": "[[], async (acc, x) => acc + x, 10]",
        "expectedOutput": "10",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_416_3",
        "input": "[['a', 'b', 'c'], async (acc, x) => acc + '-' + x, 'start']",
        "expectedOutput": "'start-a-b-c'",
        "isHidden": true
      }
    ],
    "solution": "async function reduceAsync(array, asyncReducer, initialValue) {\n  let acc = initialValue;\n  for (let i = 0; i < array.length; i++) {\n    acc = await asyncReducer(acc, array[i], i, array);\n  }\n  return acc;\n}",
    "explanation": "Loop through array sequentially updating acc = await asyncReducer(acc, item, i, array).",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Iterate with for-loop and await asyncReducer on every turn."
    ]
  },
  {
    "id": "JS-P417",
    "number": 417,
    "title": "Concurrency Limit Pool (concurrencyLimit)",
    "slug": "js-p417-concurrency-limit-pool-concurrencylimit",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Concurrency",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "Concurrency",
      "Pool",
      "Async"
    ],
    "tags": [
      "concurrency",
      "limit",
      "pool",
      "async"
    ],
    "expectedTime": "12 mins",
    "summary": "Execute an array of async tasks with a maximum concurrent running limit.",
    "problemStatement": "Write an async function `concurrencyLimit(tasks, limit)` that executes task functions ensuring at most `limit` tasks are running simultaneously, returning all results in order.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[() => Promise.resolve(1), () => Promise.resolve(2), () => Promise.resolve(3)], 2]",
        "output": "[1, 2, 3]",
        "explanation": "Runs at most 2 concurrently."
      }
    ],
    "constraints": [
      "limit >= 1",
      "Results array matches original tasks index order."
    ],
    "starterCode": "async function concurrencyLimit(tasks, limit) {\n  // Write your solution here\n}",
    "functionName": "concurrencyLimit",
    "testCases": [
      {
        "id": "tc_417_1",
        "input": "[[() => Promise.resolve(1), () => Promise.resolve(2), () => Promise.resolve(3)], 2]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false
      },
      {
        "id": "tc_417_2",
        "input": "[[], 3]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_417_3",
        "input": "[[async () => 'a', async () => 'b'], 1]",
        "expectedOutput": "['a', 'b']",
        "isHidden": true
      }
    ],
    "solution": "async function concurrencyLimit(tasks, limit) {\n  if (tasks.length === 0) return [];\n  const results = new Array(tasks.length);\n  let nextIndex = 0;\n  async function worker() {\n    while (nextIndex < tasks.length) {\n      const idx = nextIndex++;\n      results[idx] = await tasks[idx]();\n    }\n  }\n  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());\n  await Promise.all(workers);\n  return results;\n}",
    "explanation": "Spawn min(limit, n) worker loops that pull the next task index from a shared cursor until tasks are exhausted.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Spawn worker loops that increment a shared index while nextIndex < tasks.length."
    ]
  },
  {
    "id": "JS-P418",
    "number": 418,
    "title": "Create Asynchronous Task Queue (createAsyncQueue)",
    "slug": "js-p418-create-asynchronous-task-queue-createasyncqueue",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Concurrency",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "Queue",
      "Concurrency",
      "Async"
    ],
    "tags": [
      "queue",
      "concurrency",
      "async"
    ],
    "expectedTime": "15 mins",
    "summary": "Implement an async task queue supporting concurrency throttling and push.",
    "problemStatement": "Write a function `createAsyncQueue(concurrency = 1)` returning `{ push(task) }` where `push(task)` adds a zero-arg async function and returns a Promise resolving with task's output.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[2], [['push', () => Promise.resolve(10)], ['push', () => Promise.resolve(20)]]]",
        "output": "[10, 20]",
        "explanation": "Queues tasks and executes them."
      }
    ],
    "constraints": [
      "Limits concurrent executions."
    ],
    "starterCode": "function createAsyncQueue(concurrency = 1) {\n  // Write your solution here\n}",
    "functionName": "createAsyncQueue",
    "testCases": [
      {
        "id": "tc_418_1",
        "input": "[[2], [['push', () => Promise.resolve(10)], ['push', () => Promise.resolve(20)]]]",
        "expectedOutput": "[10, 20]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_418_2",
        "input": "[[1], [['push', () => Promise.resolve('single')]]]",
        "expectedOutput": "['single']",
        "isHidden": true
      }
    ],
    "solution": "function createAsyncQueue(concurrency = 1) {\n  const queue = [];\n  let running = 0;\n  function next() {\n    if (running >= concurrency || queue.length === 0) return;\n    running++;\n    const { task, resolve, reject } = queue.shift();\n    Promise.resolve()\n      .then(() => task())\n      .then(resolve, reject)\n      .finally(() => {\n        running--;\n        next();\n      });\n  }\n  return {\n    push(task) {\n      return new Promise((resolve, reject) => {\n        queue.push({ task, resolve, reject });\n        next();\n      });\n    }\n  };\n}",
    "explanation": "Maintain queue array and running count. Pop and run tasks when running < concurrency, calling next in finally.",
    "timeComplexity": "O(1) per push",
    "spaceComplexity": "O(k)",
    "hints": [
      "Store { task, resolve, reject } in an array, dispatch when running < concurrency."
    ]
  },
  {
    "id": "JS-P419",
    "number": 419,
    "title": "Asynchronous Debounce (debounceAsync)",
    "slug": "js-p419-asynchronous-debounce-debounceasync",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Timers",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Debounce",
      "Async",
      "Promises"
    ],
    "tags": [
      "debounce",
      "async",
      "promises"
    ],
    "expectedTime": "10 mins",
    "summary": "Debounce an async function returning a promise that resolves with the debounced result.",
    "problemStatement": "Write a function `debounceAsync(fn, delayMs)` that debounces calls to `fn`. The returned function returns a Promise that resolves with the result of the eventually executed call.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[async x => x * 10, 5, [[1], [2]]]",
        "output": "[20, 20]",
        "explanation": "Returns debounced function."
      }
    ],
    "constraints": [
      "All suppressed calls resolve with latest execution result or reject."
    ],
    "starterCode": "function debounceAsync(fn, delayMs) {\n  // Write your solution here\n}",
    "functionName": "debounceAsync",
    "testCases": [
      {
        "id": "tc_419_1",
        "input": "[async x => x * 10, 5, [[1], [2]]]",
        "expectedOutput": "[20, 20]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_419_2",
        "input": "[async s => s.toUpperCase(), 2, [['ok']]]",
        "expectedOutput": "['OK']",
        "isHidden": true
      }
    ],
    "solution": "function debounceAsync(fn, delayMs) {\n  let timer = null;\n  let pending = [];\n  return function(...args) {\n    return new Promise((resolve, reject) => {\n      pending.push({ resolve, reject });\n      if (timer) clearTimeout(timer);\n      timer = setTimeout(async () => {\n        const current = pending;\n        pending = [];\n        try {\n          const res = await fn.apply(this, args);\n          current.forEach(p => p.resolve(res));\n        } catch (err) {\n          current.forEach(p => p.reject(err));\n        }\n      }, delayMs);\n    });\n  };\n}",
    "explanation": "Store pending promise callbacks in an array, clear timer on each invocation, resolve all pending on execution.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(k)",
    "hints": [
      "Collect pending { resolve, reject } pairs and resolve all on the timer callback."
    ]
  },
  {
    "id": "JS-P420",
    "number": 420,
    "title": "Create Deferred Promise Object (createDeferred)",
    "slug": "js-p420-create-deferred-promise-object-createdeferred",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Deferred",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Deferred",
      "Promises"
    ],
    "tags": [
      "deferred",
      "promises"
    ],
    "expectedTime": "5 mins",
    "summary": "Return a deferred object containing a promise and its external resolve and reject methods.",
    "problemStatement": "Write a function `createDeferred()` that returns an object `{ promise, resolve, reject }` exposing control of the promise externally.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['resolve', 'resolved']]]",
        "output": "['resolved']",
        "explanation": "def.resolve('resolved') resolves def.promise."
      }
    ],
    "constraints": [
      "Promise resolves when def.resolve is called."
    ],
    "starterCode": "function createDeferred() {\n  // Write your solution here\n}",
    "functionName": "createDeferred",
    "testCases": [
      {
        "id": "tc_420_1",
        "input": "[[], [['resolve', 'resolved']]]",
        "expectedOutput": "['resolved']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_420_2",
        "input": "[[], [['resolve', 100]]]",
        "expectedOutput": "[100]",
        "isHidden": true
      }
    ],
    "solution": "function createDeferred() {\n  let resolveFn, rejectFn;\n  const promise = new Promise((res, rej) => {\n    resolveFn = res;\n    rejectFn = rej;\n  });\n  return {\n    promise,\n    resolve: (val) => { resolveFn(val); return val; },\n    reject: (err) => { rejectFn(err); return err; }\n  };\n}",
    "explanation": "Extract resolve and reject functions from new Promise constructor callback and return { promise, resolve, reject }.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Assign outer let resolve, reject inside new Promise((res, rej) => { ... })."
    ]
  },
  {
    "id": "JS-P421",
    "number": 421,
    "title": "Cancellable Promise Execution (cancellablePromise)",
    "slug": "js-p421-cancellable-promise-execution-cancellablepromise",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Cancellation",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Cancellation",
      "Promises"
    ],
    "tags": [
      "cancellation",
      "promises"
    ],
    "expectedTime": "8 mins",
    "summary": "Resolve with original promise value or reject with 'cancelled' if cancellation requested.",
    "problemStatement": "Write a function `cancellablePromise(promise, shouldCancel = false)` that resolves with `promise` value, or rejects with `'cancelled'` if `shouldCancel` is true.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[Promise.resolve('ok'), false]",
        "output": "'ok'",
        "explanation": "Resolves if not cancelled."
      }
    ],
    "constraints": [
      "If cancelled, resolves or rejects with 'cancelled'."
    ],
    "starterCode": "function cancellablePromise(promise, shouldCancel = false) {\n  // Write your solution here\n}",
    "functionName": "cancellablePromise",
    "testCases": [
      {
        "id": "tc_421_1",
        "input": "[Promise.resolve('ok'), false]",
        "expectedOutput": "'ok'",
        "isHidden": false
      },
      {
        "id": "tc_421_2",
        "input": "[new Promise(r => setTimeout(() => r('late'), 50)), true]",
        "expectedOutput": "'cancelled'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_421_3",
        "input": "[Promise.resolve(42), false]",
        "expectedOutput": "42",
        "isHidden": true
      }
    ],
    "solution": "function cancellablePromise(promise, shouldCancel = false) {\n  if (shouldCancel) return Promise.resolve('cancelled');\n  return promise;\n}",
    "explanation": "If shouldCancel is true return Promise.resolve('cancelled'), else return original promise.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Check shouldCancel and return 'cancelled' or promise."
    ]
  },
  {
    "id": "JS-P422",
    "number": 422,
    "title": "Poll Asynchronous Function Until Predicate (pollUntil)",
    "slug": "js-p422-poll-asynchronous-function-until-predicate-polluntil",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Polling",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Polling",
      "Async",
      "Timers"
    ],
    "tags": [
      "poll",
      "async",
      "predicate"
    ],
    "expectedTime": "10 mins",
    "summary": "Poll an async function at fixed intervals until a predicate condition is satisfied.",
    "problemStatement": "Write an async function `pollUntil(fn, predicate, intervalMs = 10, maxAttempts = 10)` that repeatedly calls `fn()`. Stops and returns value when `predicate(val)` is true, or throws `'max attempts reached'`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(() => { let i = 0; return () => ++i; })(), x => x >= 3, 5, 5]",
        "output": "3",
        "explanation": "Returns 3 on attempt 3."
      }
    ],
    "constraints": [
      "maxAttempts >= 1"
    ],
    "starterCode": "async function pollUntil(fn, predicate, intervalMs = 10, maxAttempts = 10) {\n  // Write your solution here\n}",
    "functionName": "pollUntil",
    "testCases": [
      {
        "id": "tc_422_1",
        "input": "[(() => { let i = 0; return () => ++i; })(), x => x >= 3, 5, 5]",
        "expectedOutput": "3",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_422_2",
        "input": "[() => 'ready', x => x === 'ready', 2, 3]",
        "expectedOutput": "'ready'",
        "isHidden": true
      }
    ],
    "solution": "async function pollUntil(fn, predicate, intervalMs = 10, maxAttempts = 10) {\n  for (let i = 0; i < maxAttempts; i++) {\n    const val = await fn();\n    if (predicate(val)) return val;\n    if (i < maxAttempts - 1 && intervalMs > 0) {\n      await new Promise(r => setTimeout(r, intervalMs));\n    }\n  }\n  throw new Error('max attempts reached');\n}",
    "explanation": "Loop up to maxAttempts, checking predicate(val) and awaiting intervalMs before next attempt.",
    "timeComplexity": "O(a)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use a for-loop and check predicate(val) on each iteration."
    ]
  },
  {
    "id": "JS-P423",
    "number": 423,
    "title": "Retry with Exponential Backoff (exponentialBackoff)",
    "slug": "js-p423-retry-with-exponential-backoff-exponentialbackoff",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Resilience",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Backoff",
      "Retry",
      "Async"
    ],
    "tags": [
      "backoff",
      "retry",
      "async"
    ],
    "expectedTime": "10 mins",
    "summary": "Retry an async function multiplying delay by 2 after each failure.",
    "problemStatement": "Write an async function `exponentialBackoff(fn, maxRetries = 3, baseDelayMs = 5)` that calls `fn()`. On error, waits `baseDelayMs * (2 ** attempt)` and retries.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(() => { let c = 0; return () => ++c < 3 ? Promise.reject('e') : Promise.resolve('success'); })(), 3, 2]",
        "output": "'success'",
        "explanation": "Succeeds on 3rd attempt."
      }
    ],
    "constraints": [
      "maxRetries >= 0"
    ],
    "starterCode": "async function exponentialBackoff(fn, maxRetries = 3, baseDelayMs = 5) {\n  // Write your solution here\n}",
    "functionName": "exponentialBackoff",
    "testCases": [
      {
        "id": "tc_423_1",
        "input": "[(() => { let c = 0; return () => ++c < 3 ? Promise.reject('e') : Promise.resolve('success'); })(), 3, 2]",
        "expectedOutput": "'success'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_423_2",
        "input": "[() => Promise.resolve(42), 2, 2]",
        "expectedOutput": "42",
        "isHidden": true
      }
    ],
    "solution": "async function exponentialBackoff(fn, maxRetries = 3, baseDelayMs = 5) {\n  let lastErr;\n  for (let attempt = 0; attempt <= maxRetries; attempt++) {\n    try {\n      return await fn();\n    } catch (err) {\n      lastErr = err;\n      if (attempt < maxRetries) {\n        const delay = baseDelayMs * Math.pow(2, attempt);\n        await new Promise(r => setTimeout(r, delay));\n      }\n    }\n  }\n  throw lastErr;\n}",
    "explanation": "Wait baseDelayMs * 2^attempt milliseconds between failed attempts.",
    "timeComplexity": "O(r)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Calculate delay using baseDelayMs * (2 ** attempt)."
    ]
  },
  {
    "id": "JS-P424",
    "number": 424,
    "title": "Asynchronous Memoization with TTL (asyncMemoize)",
    "slug": "js-p424-asynchronous-memoization-with-ttl-asyncmemoize",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Caching",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Memoize",
      "Async",
      "Cache"
    ],
    "tags": [
      "memoize",
      "ttl",
      "cache",
      "async"
    ],
    "expectedTime": "10 mins",
    "summary": "Memoize async function results for a given time-to-live duration.",
    "problemStatement": "Write a function `asyncMemoize(fn, ttlMs = 100)` that caches the resolved result of `fn(...args)` by argument key for `ttlMs` milliseconds.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(() => { let c = 0; return async x => ({ val: x, call: ++c }); })(), 50, [[2], [2]]]",
        "output": "[{\"val\":2,\"call\":1}, {\"val\":2,\"call\":1}]",
        "explanation": "Second call uses cached result."
      }
    ],
    "constraints": [
      "Key serialized via JSON.stringify(args)."
    ],
    "starterCode": "function asyncMemoize(fn, ttlMs = 100) {\n  // Write your solution here\n}",
    "functionName": "asyncMemoize",
    "testCases": [
      {
        "id": "tc_424_1",
        "input": "[(() => { let c = 0; return async x => ({ val: x, call: ++c }); })(), 50, [[2], [2]]]",
        "expectedOutput": "[{\"val\":2,\"call\":1}, {\"val\":2,\"call\":1}]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_424_2",
        "input": "[async s => s + '!', 10, [['test']]]",
        "expectedOutput": "['test!']",
        "isHidden": true
      }
    ],
    "solution": "function asyncMemoize(fn, ttlMs = 100) {\n  const cache = new Map();\n  return async function(...args) {\n    const key = JSON.stringify(args);\n    const now = Date.now();\n    if (cache.has(key)) {\n      const entry = cache.get(key);\n      if (now < entry.expiry) return entry.val;\n    }\n    const val = await fn.apply(this, args);\n    cache.set(key, { val, expiry: now + ttlMs });\n    return val;\n  };\n}",
    "explanation": "Store value and expiry timestamp in Map keyed by JSON.stringify(args).",
    "timeComplexity": "O(1) average lookup",
    "spaceComplexity": "O(k)",
    "hints": [
      "Check Date.now() < entry.expiry before returning cached value."
    ]
  },
  {
    "id": "JS-P425",
    "number": 425,
    "title": "Execute in Batches Sequentially (executeInBatches)",
    "slug": "js-p425-execute-in-batches-sequentially-executeinbatches",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Batching",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Batching",
      "Async",
      "Collections"
    ],
    "tags": [
      "batch",
      "chunk",
      "async"
    ],
    "expectedTime": "8 mins",
    "summary": "Partition an array into chunks of batchSize and process each batch in parallel, batches in series.",
    "problemStatement": "Write an async function `executeInBatches(items, batchSize, asyncWorker)` that chunks `items` into `batchSize` groups, processes items within each batch concurrently with `asyncWorker`, and processes batches sequentially.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3, 4, 5], 2, async x => x * 10]",
        "output": "[10, 20, 30, 40, 50]",
        "explanation": "Processes [1, 2], then [3, 4], then [5]."
      }
    ],
    "constraints": [
      "Returns flattened array of all processed results."
    ],
    "starterCode": "async function executeInBatches(items, batchSize, asyncWorker) {\n  // Write your solution here\n}",
    "functionName": "executeInBatches",
    "testCases": [
      {
        "id": "tc_425_1",
        "input": "[[1, 2, 3, 4, 5], 2, async x => x * 10]",
        "expectedOutput": "[10, 20, 30, 40, 50]",
        "isHidden": false
      },
      {
        "id": "tc_425_2",
        "input": "[[], 2, async x => x]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_425_3",
        "input": "[['a', 'b'], 1, async s => s.toUpperCase()]",
        "expectedOutput": "['A', 'B']",
        "isHidden": true
      }
    ],
    "solution": "async function executeInBatches(items, batchSize, asyncWorker) {\n  const results = [];\n  for (let i = 0; i < items.length; i += batchSize) {\n    const batch = items.slice(i, i + batchSize);\n    const batchRes = await Promise.all(batch.map(item => asyncWorker(item)));\n    results.push(...batchRes);\n  }\n  return results;\n}",
    "explanation": "Slice chunks, await Promise.all(batch.map(asyncWorker)), and push into results array.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Iterate with step batchSize, await Promise.all(batch.map(...))."
    ]
  },
  {
    "id": "JS-P426",
    "number": 426,
    "title": "Implement Async Mutex Lock (createAsyncLock)",
    "slug": "js-p426-implement-async-mutex-lock-createasynclock",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Synchronization",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "Mutex",
      "Lock",
      "Async"
    ],
    "tags": [
      "mutex",
      "lock",
      "async",
      "synchronization"
    ],
    "expectedTime": "12 mins",
    "summary": "Mutual exclusion lock allowing only one async critical section to execute at a time.",
    "problemStatement": "Write a function `createAsyncLock()` that returns an object with `runExclusive(fn)`. Only one invocation of `fn` executes at any given time; subsequent calls wait in FIFO order.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['runExclusive', () => Promise.resolve(1)], ['runExclusive', () => Promise.resolve(2)]]]",
        "output": "[1, 2]",
        "explanation": "Runs sequentially."
      }
    ],
    "constraints": [
      "FIFO queue of lock requesters."
    ],
    "starterCode": "function createAsyncLock() {\n  // Write your solution here\n}",
    "functionName": "createAsyncLock",
    "testCases": [
      {
        "id": "tc_426_1",
        "input": "[[], [['runExclusive', () => Promise.resolve(1)], ['runExclusive', () => Promise.resolve(2)]]]",
        "expectedOutput": "[1, 2]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_426_2",
        "input": "[[], [['runExclusive', () => Promise.resolve('safe')]]]",
        "expectedOutput": "['safe']",
        "isHidden": true
      }
    ],
    "solution": "function createAsyncLock() {\n  let last = Promise.resolve();\n  return {\n    runExclusive(fn) {\n      const next = last.then(() => fn());\n      last = next.catch(() => {});\n      return next;\n    }\n  };\n}",
    "explanation": "Chain calls onto a shared promise variable `last`, ignoring errors in the chain continuation with .catch.",
    "timeComplexity": "O(1) enqueue",
    "spaceComplexity": "O(k)",
    "hints": [
      "Chain promises: const next = last.then(() => fn()); last = next.catch(() => {}); return next;"
    ]
  },
  {
    "id": "JS-P427",
    "number": 427,
    "title": "Implement Async Counting Semaphore (createSemaphore)",
    "slug": "js-p427-implement-async-counting-semaphore-createsemaphore",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Synchronization",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "Semaphore",
      "Synchronization",
      "Async"
    ],
    "tags": [
      "semaphore",
      "async",
      "permits"
    ],
    "expectedTime": "12 mins",
    "summary": "Counting semaphore managing access to a finite pool of permits.",
    "problemStatement": "Write a function `createSemaphore(permits)` returning `{ acquire(), release() }`. `acquire()` returns a Promise that resolves when a permit is available. `release()` returns a permit to the pool.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[2], [['acquire'], ['release'], ['acquire']]]",
        "output": "[true, true, true]",
        "explanation": "Acquires available permits."
      }
    ],
    "constraints": [
      "permits >= 1"
    ],
    "starterCode": "function createSemaphore(permits) {\n  // Write your solution here\n}",
    "functionName": "createSemaphore",
    "testCases": [
      {
        "id": "tc_427_1",
        "input": "[[2], [['acquire'], ['release'], ['acquire']]]",
        "expectedOutput": "[true, true, true]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_427_2",
        "input": "[[1], [['acquire'], ['release']]]",
        "expectedOutput": "[true, true]",
        "isHidden": true
      }
    ],
    "solution": "function createSemaphore(permits) {\n  let available = permits;\n  const waiting = [];\n  return {\n    acquire() {\n      if (available > 0) {\n        available--;\n        return Promise.resolve(true);\n      }\n      return new Promise(resolve => waiting.push(() => resolve(true)));\n    },\n    release() {\n      if (waiting.length > 0) {\n        const nextResolve = waiting.shift();\n        nextResolve();\n      } else {\n        available++;\n      }\n      return true;\n    }\n  };\n}",
    "explanation": "If available > 0 decrement and resolve immediately, else enqueue resolve in waiting array.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(k)",
    "hints": [
      "Queue resolver functions in a waiting array when available is 0."
    ]
  },
  {
    "id": "JS-P428",
    "number": 428,
    "title": "Implement Custom Promise.prototype.finally (myPromiseFinally)",
    "slug": "js-p428-implement-custom-promise-prototype-finally-mypromisefinally",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Polyfills",
    "difficulty": "Medium",
    "questionType": "Polyfill",
    "skills": [
      "Finally",
      "Promises",
      "Polyfills"
    ],
    "tags": [
      "finally",
      "promise",
      "polyfill"
    ],
    "expectedTime": "8 mins",
    "summary": "Custom finally handler executing callback and passing through value or error.",
    "problemStatement": "Write a function `myPromiseFinally(promise, onFinally)` that executes `onFinally()` when `promise` settles, and preserves the original fulfilled value or rejection reason.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[Promise.resolve(42), () => {}]",
        "output": "42",
        "explanation": "Passes through 42."
      }
    ],
    "constraints": [
      "If onFinally returns a rejected promise, rejects with that error."
    ],
    "starterCode": "function myPromiseFinally(promise, onFinally) {\n  // Write your solution here\n}",
    "functionName": "myPromiseFinally",
    "testCases": [
      {
        "id": "tc_428_1",
        "input": "[Promise.resolve('data'), () => {}]",
        "expectedOutput": "'data'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_428_2",
        "input": "[Promise.resolve(100), () => 999]",
        "expectedOutput": "100",
        "isHidden": true
      }
    ],
    "solution": "function myPromiseFinally(promise, onFinally) {\n  return promise.then(\n    val => Promise.resolve(onFinally()).then(() => val),\n    err => Promise.resolve(onFinally()).then(() => { throw err; })\n  );\n}",
    "explanation": "Await onFinally() then either return original value or rethrow original error.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use Promise.resolve(onFinally()).then(() => val)."
    ]
  },
  {
    "id": "JS-P429",
    "number": 429,
    "title": "Asynchronous Some Predicate (asyncSome)",
    "slug": "js-p429-asynchronous-some-predicate-asyncsome",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Collections",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Some",
      "Async",
      "Short-Circuit"
    ],
    "tags": [
      "some",
      "async",
      "collections"
    ],
    "expectedTime": "8 mins",
    "summary": "Test if at least one element satisfies an async predicate with short-circuiting.",
    "problemStatement": "Write an async function `asyncSome(array, asyncPredicate)` that tests elements sequentially and returns `true` as soon as one satisfies `asyncPredicate`. Returns `false` if none do.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 3, 4, 7], async x => x % 2 === 0]",
        "output": "true",
        "explanation": "4 is even."
      }
    ],
    "constraints": [
      "Short-circuits immediately upon finding match."
    ],
    "starterCode": "async function asyncSome(array, asyncPredicate) {\n  // Write your solution here\n}",
    "functionName": "asyncSome",
    "testCases": [
      {
        "id": "tc_429_1",
        "input": "[[1, 3, 4, 7], async x => x % 2 === 0]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_429_2",
        "input": "[[1, 3, 5], async x => x % 2 === 0]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_429_3",
        "input": "[[], async () => true]",
        "expectedOutput": "false",
        "isHidden": true
      }
    ],
    "solution": "async function asyncSome(array, asyncPredicate) {\n  for (let i = 0; i < array.length; i++) {\n    if (await asyncPredicate(array[i], i, array)) {\n      return true;\n    }\n  }\n  return false;\n}",
    "explanation": "Iterate sequentially and return true immediately when predicate resolves to truthy.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use a for-loop and return true if await asyncPredicate(...) is truthy."
    ]
  },
  {
    "id": "JS-P430",
    "number": 430,
    "title": "Asynchronous Every Predicate (asyncEvery)",
    "slug": "js-p430-asynchronous-every-predicate-asyncevery",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Collections",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Every",
      "Async",
      "Short-Circuit"
    ],
    "tags": [
      "every",
      "async",
      "collections"
    ],
    "expectedTime": "8 mins",
    "summary": "Test if all elements satisfy an async predicate with short-circuiting.",
    "problemStatement": "Write an async function `asyncEvery(array, asyncPredicate)` that tests elements sequentially and returns `false` as soon as one fails `asyncPredicate`. Returns `true` if all pass.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[2, 4, 6], async x => x % 2 === 0]",
        "output": "true",
        "explanation": "All are even."
      }
    ],
    "constraints": [
      "Empty array returns true."
    ],
    "starterCode": "async function asyncEvery(array, asyncPredicate) {\n  // Write your solution here\n}",
    "functionName": "asyncEvery",
    "testCases": [
      {
        "id": "tc_430_1",
        "input": "[[2, 4, 6], async x => x % 2 === 0]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc_430_2",
        "input": "[[2, 3, 6], async x => x % 2 === 0]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_430_3",
        "input": "[[], async () => false]",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "solution": "async function asyncEvery(array, asyncPredicate) {\n  for (let i = 0; i < array.length; i++) {\n    if (!(await asyncPredicate(array[i], i, array))) {\n      return false;\n    }\n  }\n  return true;\n}",
    "explanation": "Iterate sequentially and return false immediately when any element fails predicate.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use a for-loop and return false if !(await asyncPredicate(...))."
    ]
  },
  {
    "id": "JS-P431",
    "number": 431,
    "title": "Asynchronous Find (asyncFind)",
    "slug": "js-p431-asynchronous-find-asyncfind",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Collections",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Find",
      "Async",
      "Collections"
    ],
    "tags": [
      "find",
      "async",
      "collections"
    ],
    "expectedTime": "8 mins",
    "summary": "Find the first element satisfying an async predicate.",
    "problemStatement": "Write an async function `asyncFind(array, asyncPredicate)` that iterates through `array` and returns the first element for which `asyncPredicate(item)` resolves truthy. Returns `undefined` if not found.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[10, 25, 30], async x => x > 20]",
        "output": "25",
        "explanation": "First element > 20 is 25."
      }
    ],
    "constraints": [
      "Returns undefined on no match."
    ],
    "starterCode": "async function asyncFind(array, asyncPredicate) {\n  // Write your solution here\n}",
    "functionName": "asyncFind",
    "testCases": [
      {
        "id": "tc_431_1",
        "input": "[[10, 25, 30], async x => x > 20]",
        "expectedOutput": "25",
        "isHidden": false
      },
      {
        "id": "tc_431_2",
        "input": "[[1, 2, 3], async x => x > 10]",
        "expectedOutput": "undefined",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_431_3",
        "input": "[['apple', 'banana', 'cherry'], async s => s.startsWith('b')]",
        "expectedOutput": "'banana'",
        "isHidden": true
      }
    ],
    "solution": "async function asyncFind(array, asyncPredicate) {\n  for (let i = 0; i < array.length; i++) {\n    if (await asyncPredicate(array[i], i, array)) {\n      return array[i];\n    }\n  }\n  return undefined;\n}",
    "explanation": "Iterate sequentially and return array[i] as soon as predicate is truthy.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Return array[i] when await asyncPredicate(array[i], i, array) is truthy."
    ]
  },
  {
    "id": "JS-P432",
    "number": 432,
    "title": "Asynchronous Find Index (asyncFindIndex)",
    "slug": "js-p432-asynchronous-find-index-asyncfindindex",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Collections",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "FindIndex",
      "Async",
      "Collections"
    ],
    "tags": [
      "findIndex",
      "async",
      "collections"
    ],
    "expectedTime": "8 mins",
    "summary": "Find the index of the first element satisfying an async predicate.",
    "problemStatement": "Write an async function `asyncFindIndex(array, asyncPredicate)` that returns the index of the first element satisfying `asyncPredicate`. Returns `-1` if none match.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[5, 12, 8, 130], async x => x > 10]",
        "output": "1",
        "explanation": "12 is at index 1."
      }
    ],
    "constraints": [
      "Returns -1 on no match."
    ],
    "starterCode": "async function asyncFindIndex(array, asyncPredicate) {\n  // Write your solution here\n}",
    "functionName": "asyncFindIndex",
    "testCases": [
      {
        "id": "tc_432_1",
        "input": "[[5, 12, 8, 130], async x => x > 10]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc_432_2",
        "input": "[[1, 2], async x => x > 10]",
        "expectedOutput": "-1",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_432_3",
        "input": "[['a', 'b', 'c'], async s => s === 'c']",
        "expectedOutput": "2",
        "isHidden": true
      }
    ],
    "solution": "async function asyncFindIndex(array, asyncPredicate) {\n  for (let i = 0; i < array.length; i++) {\n    if (await asyncPredicate(array[i], i, array)) {\n      return i;\n    }\n  }\n  return -1;\n}",
    "explanation": "Sequential scan returning index i when predicate resolves truthy, else -1.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Return index i or -1."
    ]
  },
  {
    "id": "JS-P433",
    "number": 433,
    "title": "Compose Async Functions (asyncPipe)",
    "slug": "js-p433-compose-async-functions-asyncpipe",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Functional",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Pipe",
      "Async",
      "Composition"
    ],
    "tags": [
      "pipe",
      "async",
      "composition"
    ],
    "expectedTime": "8 mins",
    "summary": "Pipe async functions left to right, awaiting each step.",
    "problemStatement": "Write a function `asyncPipe(...fns)` returning a function that pipes an input through all `fns` sequentially from left to right.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[async x => x + 1, async x => x * 2, [[5]]]",
        "output": "12",
        "explanation": "(5 + 1) * 2 = 12."
      }
    ],
    "constraints": [
      "Works with sync or async functions."
    ],
    "starterCode": "function asyncPipe(...fns) {\n  // Write your solution here\n}",
    "functionName": "asyncPipe",
    "testCases": [
      {
        "id": "tc_433_1",
        "input": "[async x => x + 1, async x => x * 2, [[5]]]",
        "expectedOutput": "12",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_433_2",
        "input": "[x => x * 3, async x => x - 1, [[4]]]",
        "expectedOutput": "11",
        "isHidden": true
      }
    ],
    "solution": "function asyncPipe(...fns) {\n  return function(initial) {\n    return fns.reduce((p, fn) => p.then(fn), Promise.resolve(initial));\n  };\n}",
    "explanation": "Reduce over functions chaining with .then(fn) starting from Promise.resolve(initial).",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Reduce with p.then(fn) starting from Promise.resolve(initial)."
    ]
  },
  {
    "id": "JS-P434",
    "number": 434,
    "title": "Compose Async Functions Right-to-Left (asyncCompose)",
    "slug": "js-p434-compose-async-functions-right-to-left-asynccompose",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Functional",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Compose",
      "Async",
      "Composition"
    ],
    "tags": [
      "compose",
      "async",
      "composition"
    ],
    "expectedTime": "8 mins",
    "summary": "Compose async functions right to left.",
    "problemStatement": "Write a function `asyncCompose(...fns)` returning a function that evaluates `fns` from right to left, passing each result to the next.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[async x => x * 2, async x => x + 1, [[5]]]",
        "output": "12",
        "explanation": "(5 + 1) * 2 = 12."
      }
    ],
    "constraints": [
      "Right to left evaluation."
    ],
    "starterCode": "function asyncCompose(...fns) {\n  // Write your solution here\n}",
    "functionName": "asyncCompose",
    "testCases": [
      {
        "id": "tc_434_1",
        "input": "[async x => x * 2, async x => x + 1, [[5]]]",
        "expectedOutput": "12",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_434_2",
        "input": "[async s => s.trim(), async s => s.toUpperCase(), [['  abc  ']]]",
        "expectedOutput": "'ABC'",
        "isHidden": true
      }
    ],
    "solution": "function asyncCompose(...fns) {\n  return function(initial) {\n    return fns.reduceRight((p, fn) => p.then(fn), Promise.resolve(initial));\n  };\n}",
    "explanation": "Use reduceRight chaining .then(fn) onto Promise.resolve(initial).",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use fns.reduceRight((p, fn) => p.then(fn), Promise.resolve(initial))."
    ]
  },
  {
    "id": "JS-P435",
    "number": 435,
    "title": "Wait For Event on Event Emitter (waitForEvent)",
    "slug": "js-p435-wait-for-event-on-event-emitter-waitforevent",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Events",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Events",
      "Promises",
      "EventEmitter"
    ],
    "tags": [
      "events",
      "promises",
      "emitter"
    ],
    "expectedTime": "8 mins",
    "summary": "Return a promise that resolves when a named event fires on an emitter.",
    "problemStatement": "Write a function `waitForEvent(emitter, eventName, timeoutMs = 100)` that returns a Promise resolving with the event payload when `emitter` emits `eventName`. If `timeoutMs` elapses first, rejects with `'timeout'`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ on(e, cb) { setTimeout(() => cb('data'), 10); }, off() {} }, 'message', 50]",
        "output": "'data'",
        "explanation": "Receives emitted data."
      }
    ],
    "constraints": [
      "Removes listener after event or timeout."
    ],
    "starterCode": "function waitForEvent(emitter, eventName, timeoutMs = 100) {\n  // Write your solution here\n}",
    "functionName": "waitForEvent",
    "testCases": [
      {
        "id": "tc_435_1",
        "input": "[{ on(e, cb) { setTimeout(() => cb('payload'), 5); }, off() {} }, 'data', 50]",
        "expectedOutput": "'payload'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_435_2",
        "input": "[{ on(e, cb) { setTimeout(() => cb(42), 2); }, off() {} }, 'calc', 50]",
        "expectedOutput": "42",
        "isHidden": true
      }
    ],
    "solution": "function waitForEvent(emitter, eventName, timeoutMs = 100) {\n  return new Promise((resolve, reject) => {\n    let timer;\n    const handler = (...args) => {\n      clearTimeout(timer);\n      if (typeof emitter.off === 'function') emitter.off(eventName, handler);\n      resolve(args.length > 1 ? args : args[0]);\n    };\n    timer = setTimeout(() => {\n      if (typeof emitter.off === 'function') emitter.off(eventName, handler);\n      reject('timeout');\n    }, timeoutMs);\n    emitter.on(eventName, handler);\n  });\n}",
    "explanation": "Register handler on emitter, clear timeout on receipt, clean up listener on both resolution and timeout.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Attach handler via emitter.on, clean up with emitter.off in both success and timeout."
    ]
  },
  {
    "id": "JS-P436",
    "number": 436,
    "title": "Collect Values from Async Generator (asyncGeneratorToArray)",
    "slug": "js-p436-collect-values-from-async-generator-asyncgeneratortoarray",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Generators",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Async Iterators",
      "Generators"
    ],
    "tags": [
      "generator",
      "async",
      "iterators"
    ],
    "expectedTime": "8 mins",
    "summary": "Iterate an async generator and collect all yielded values into an array.",
    "problemStatement": "Write an async function `asyncGeneratorToArray(asyncGen)` that uses `for await...of` to collect all items yielded by `asyncGen` into an array and returns it.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(async function*() { yield 1; yield 2; yield 3; })()]",
        "output": "[1, 2, 3]",
        "explanation": "Collects 1, 2, 3."
      }
    ],
    "constraints": [
      "Consumes entire async iterable."
    ],
    "starterCode": "async function asyncGeneratorToArray(asyncGen) {\n  // Write your solution here\n}",
    "functionName": "asyncGeneratorToArray",
    "testCases": [
      {
        "id": "tc_436_1",
        "input": "[(async function*() { yield 1; yield 2; yield 3; })()]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_436_2",
        "input": "[(async function*() { yield 'x'; yield 'y'; })()]",
        "expectedOutput": "['x', 'y']",
        "isHidden": true
      }
    ],
    "solution": "async function asyncGeneratorToArray(asyncGen) {\n  const result = [];\n  for await (const val of asyncGen) {\n    result.push(val);\n  }\n  return result;\n}",
    "explanation": "Use for await (const val of asyncGen) and collect items into array.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use for await (const item of asyncGen)."
    ]
  },
  {
    "id": "JS-P437",
    "number": 437,
    "title": "Run Resilient Async Interval (runAsyncInterval)",
    "slug": "js-p437-run-resilient-async-interval-runasyncinterval",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Timers",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Interval",
      "Async",
      "Timers"
    ],
    "tags": [
      "interval",
      "async",
      "timers"
    ],
    "expectedTime": "10 mins",
    "summary": "Execute sequential async ticks waiting delayMs between each iteration.",
    "problemStatement": "Write an async function `runAsyncInterval(ticks, delayMs)` that sequentially executes `ticks` times with `delayMs` pause after each step and resolves with array `[0, 1, ..., ticks - 1]`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[3, 5]",
        "output": "[0, 1, 2]",
        "explanation": "Executes 3 ticks."
      }
    ],
    "constraints": [
      "ticks >= 0"
    ],
    "starterCode": "async function runAsyncInterval(ticks, delayMs) {\n  // Write your solution here\n}",
    "functionName": "runAsyncInterval",
    "testCases": [
      {
        "id": "tc_437_1",
        "input": "[3, 5]",
        "expectedOutput": "[0, 1, 2]",
        "isHidden": false
      },
      {
        "id": "tc_437_2",
        "input": "[0, 5]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_437_3",
        "input": "[1, 2]",
        "expectedOutput": "[0]",
        "isHidden": true
      }
    ],
    "solution": "async function runAsyncInterval(ticks, delayMs) {\n  const result = [];\n  for (let i = 0; i < ticks; i++) {\n    result.push(i);\n    if (i < ticks - 1 && delayMs > 0) {\n      await new Promise(r => setTimeout(r, delayMs));\n    }\n  }\n  return result;\n}",
    "explanation": "Loop ticks times pushing i into result and awaiting delayMs between ticks.",
    "timeComplexity": "O(t)",
    "spaceComplexity": "O(t)",
    "hints": [
      "Use for loop up to ticks and await delay between iterations."
    ]
  },
  {
    "id": "JS-P438",
    "number": 438,
    "title": "Lazy Promise Evaluation (lazyPromise)",
    "slug": "js-p438-lazy-promise-evaluation-lazypromise",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Promises",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Lazy",
      "Promises",
      "Thenable"
    ],
    "tags": [
      "lazy",
      "promises",
      "thenable"
    ],
    "expectedTime": "8 mins",
    "summary": "Create a thenable promise that defers executor execution until .then() is called.",
    "problemStatement": "Write a function `lazyPromise(factory)` returning a thenable object with a `.then(onFulfilled, onRejected)` method that invokes `factory()` only when `.then()` is first invoked.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[() => Promise.resolve(99)]",
        "output": "99",
        "explanation": "Executes factory upon then call."
      }
    ],
    "constraints": [
      "Factory is called at most once."
    ],
    "starterCode": "function lazyPromise(factory) {\n  // Write your solution here\n}",
    "functionName": "lazyPromise",
    "testCases": [
      {
        "id": "tc_438_1",
        "input": "[() => Promise.resolve(99)]",
        "expectedOutput": "99",
        "isHidden": false
      },
      {
        "id": "tc_438_2",
        "input": "[() => 'syncValue']",
        "expectedOutput": "'syncValue'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_438_3",
        "input": "[() => Promise.resolve('lazy-loaded')]",
        "expectedOutput": "'lazy-loaded'",
        "isHidden": true
      }
    ],
    "solution": "function lazyPromise(factory) {\n  let cached = null;\n  return {\n    then(onFulfilled, onRejected) {\n      if (!cached) {\n        cached = Promise.resolve().then(factory);\n      }\n      return cached.then(onFulfilled, onRejected);\n    }\n  };\n}",
    "explanation": "Implement thenable with cached Promise.resolve().then(factory) initialized upon first then call.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Return object with then method that initializes promise on first call."
    ]
  },
  {
    "id": "JS-P439",
    "number": 439,
    "title": "Create Rate Limiter Token Bucket (createRateLimiter)",
    "slug": "js-p439-create-rate-limiter-token-bucket-createratelimiter",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Rate Limiting",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "Rate Limiter",
      "Async",
      "Token Bucket"
    ],
    "tags": [
      "rateLimit",
      "async",
      "tokenBucket"
    ],
    "expectedTime": "12 mins",
    "summary": "Throttle calls allowing at most maxCalls per windowMs time window.",
    "problemStatement": "Write a function `createRateLimiter(maxCalls, windowMs)` returning a function `schedule(fn)` that returns a Promise. If capacity is available, executes `fn()` immediately; otherwise waits until the window allows.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[2, 50, [[() => Promise.resolve(1)], [() => Promise.resolve(2)]]]",
        "output": "[1, 2]",
        "explanation": "Limits calls to 2 per 50ms window."
      }
    ],
    "constraints": [
      "Executes within rate window."
    ],
    "starterCode": "function createRateLimiter(maxCalls, windowMs) {\n  // Write your solution here\n}",
    "functionName": "createRateLimiter",
    "testCases": [
      {
        "id": "tc_439_1",
        "input": "[2, 50, [[() => Promise.resolve(1)], [() => Promise.resolve(2)]]]",
        "expectedOutput": "[1, 2]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_439_2",
        "input": "[5, 20, [[() => Promise.resolve('fast')]]]",
        "expectedOutput": "['fast']",
        "isHidden": true
      }
    ],
    "solution": "function createRateLimiter(maxCalls, windowMs) {\n  const timestamps = [];\n  return async function schedule(fn) {\n    while (true) {\n      const now = Date.now();\n      while (timestamps.length > 0 && timestamps[0] <= now - windowMs) {\n        timestamps.shift();\n      }\n      if (timestamps.length < maxCalls) {\n        timestamps.push(now);\n        return fn();\n      }\n      const waitTime = timestamps[0] + windowMs - now;\n      await new Promise(r => setTimeout(r, Math.max(5, waitTime)));\n    }\n  };\n}",
    "explanation": "Maintain queue of call timestamps. Evict expired timestamps, wait if at maxCalls, execute when capacity opens.",
    "timeComplexity": "O(k)",
    "spaceComplexity": "O(k)",
    "hints": [
      "Filter or shift timestamps older than now - windowMs."
    ]
  },
  {
    "id": "JS-P440",
    "number": 440,
    "title": "Conditional Async Retry (asyncRetryIf)",
    "slug": "js-p440-conditional-async-retry-asyncretryif",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Resilience",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Retry",
      "Predicate",
      "Async"
    ],
    "tags": [
      "retry",
      "predicate",
      "async"
    ],
    "expectedTime": "8 mins",
    "summary": "Retry an async function only if the thrown error satisfies a predicate.",
    "problemStatement": "Write an async function `asyncRetryIf(fn, shouldRetry, maxRetries = 2)` that retries `fn()` up to `maxRetries` times only if `shouldRetry(err)` is true. If `shouldRetry(err)` is false, rethrows immediately.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(() => { let c = 0; return () => ++c < 2 ? Promise.reject(new Error('retryable')) : Promise.resolve('ok'); })(), err => err.message === 'retryable', 2]",
        "output": "'ok'",
        "explanation": "Retries retryable error."
      }
    ],
    "constraints": [
      "Does not retry non-retryable errors."
    ],
    "starterCode": "async function asyncRetryIf(fn, shouldRetry, maxRetries = 2) {\n  // Write your solution here\n}",
    "functionName": "asyncRetryIf",
    "testCases": [
      {
        "id": "tc_440_1",
        "input": "[(() => { let c = 0; return () => ++c < 2 ? Promise.reject(new Error('retryable')) : Promise.resolve('ok'); })(), err => err.message === 'retryable', 2]",
        "expectedOutput": "'ok'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_440_2",
        "input": "[() => Promise.resolve('immediate'), () => true, 2]",
        "expectedOutput": "'immediate'",
        "isHidden": true
      }
    ],
    "solution": "async function asyncRetryIf(fn, shouldRetry, maxRetries = 2) {\n  for (let attempt = 0; attempt <= maxRetries; attempt++) {\n    try {\n      return await fn();\n    } catch (err) {\n      if (attempt === maxRetries || !shouldRetry(err)) {\n        throw err;\n      }\n    }\n  }\n}",
    "explanation": "Catch error and check shouldRetry(err). If false or maxRetries reached, throw err.",
    "timeComplexity": "O(r)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Check if (attempt === maxRetries || !shouldRetry(err)) throw err."
    ]
  },
  {
    "id": "JS-P441",
    "number": 441,
    "title": "Asynchronous Partition (asyncPartition)",
    "slug": "js-p441-asynchronous-partition-asyncpartition",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Collections",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Partition",
      "Async",
      "Collections"
    ],
    "tags": [
      "partition",
      "async",
      "collections"
    ],
    "expectedTime": "8 mins",
    "summary": "Split an array into [truthy, falsy] arrays based on an async predicate.",
    "problemStatement": "Write an async function `asyncPartition(array, asyncPredicate)` that evaluates elements concurrently and returns `[pass, fail]` arrays.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3, 4, 5], async x => x % 2 === 1]",
        "output": "[[1, 3, 5], [2, 4]]",
        "explanation": "Partitions into odds and evens."
      }
    ],
    "constraints": [
      "Preserves original element order."
    ],
    "starterCode": "async function asyncPartition(array, asyncPredicate) {\n  // Write your solution here\n}",
    "functionName": "asyncPartition",
    "testCases": [
      {
        "id": "tc_441_1",
        "input": "[[1, 2, 3, 4, 5], async x => x % 2 === 1]",
        "expectedOutput": "[[1, 3, 5], [2, 4]]",
        "isHidden": false
      },
      {
        "id": "tc_441_2",
        "input": "[[], async () => true]",
        "expectedOutput": "[[], []]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_441_3",
        "input": "[['a', 'bb', 'ccc'], async s => s.length >= 2]",
        "expectedOutput": "[['bb', 'ccc'], ['a']]",
        "isHidden": true
      }
    ],
    "solution": "async function asyncPartition(array, asyncPredicate) {\n  const flags = await Promise.all(array.map((item, idx) => asyncPredicate(item, idx, array)));\n  const pass = [];\n  const fail = [];\n  for (let i = 0; i < array.length; i++) {\n    if (flags[i]) pass.push(array[i]);\n    else fail.push(array[i]);\n  }\n  return [pass, fail];\n}",
    "explanation": "Evaluate all predicates in parallel, then push each element to pass or fail based on flag.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use Promise.all to compute flags, then separate into pass/fail arrays."
    ]
  },
  {
    "id": "JS-P442",
    "number": 442,
    "title": "Inspect Promise Settlement State (promiseState)",
    "slug": "js-p442-inspect-promise-settlement-state-promisestate",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Promises",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "State",
      "Inspection",
      "Promises"
    ],
    "tags": [
      "state",
      "inspection",
      "promises"
    ],
    "expectedTime": "8 mins",
    "summary": "Determine if a promise is currently pending, fulfilled, or rejected without blocking.",
    "problemStatement": "Write an async function `promiseState(promise)` that checks the current state of `promise` and returns `'pending'`, `'fulfilled'`, or `'rejected'`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[Promise.resolve(42)]",
        "output": "'fulfilled'",
        "explanation": "Resolved promise is fulfilled."
      }
    ],
    "constraints": [
      "Non-blocking inspect."
    ],
    "starterCode": "async function promiseState(promise) {\n  // Write your solution here\n}",
    "functionName": "promiseState",
    "testCases": [
      {
        "id": "tc_442_1",
        "input": "[Promise.resolve('done')]",
        "expectedOutput": "'fulfilled'",
        "isHidden": false
      },
      {
        "id": "tc_442_2",
        "input": "[(() => { const p = Promise.reject('error'); p.catch(() => {}); return p; })()]",
        "expectedOutput": "'rejected'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_442_3",
        "input": "[new Promise(() => {})]",
        "expectedOutput": "'pending'",
        "isHidden": true
      }
    ],
    "solution": "async function promiseState(promise) {\n  const sentinel = Symbol('pending');\n  try {\n    const res = await Promise.race([promise, Promise.resolve(sentinel)]);\n    return res === sentinel ? 'pending' : 'fulfilled';\n  } catch {\n    return 'rejected';\n  }\n}",
    "explanation": "Race promise with a microtask resolving a sentinel. If sentinel wins, state is pending.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Race promise against Promise.resolve(sentinel)."
    ]
  },
  {
    "id": "JS-P443",
    "number": 443,
    "title": "Implement Batch Data Loader (createBatchLoader)",
    "slug": "js-p443-implement-batch-data-loader-createbatchloader",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "DataLoader",
    "difficulty": "Hard",
    "questionType": "Implementation",
    "skills": [
      "DataLoader",
      "Batching",
      "Async"
    ],
    "tags": [
      "dataloader",
      "batch",
      "async"
    ],
    "expectedTime": "15 mins",
    "summary": "Coalesce individual async load(id) requests within a tick into a single batch fetch call.",
    "problemStatement": "Write a function `createBatchLoader(batchFn)` that returns `{ load(id) }`. Individual calls to `load(id)` scheduled in the same event loop tick are coalesced into a single `batchFn(keys)` call.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[async keys => keys.map(k => 'val-' + k)], [['load', 1], ['load', 2]]]",
        "output": "['val-1', 'val-2']",
        "explanation": "Batches keys 1 and 2."
      }
    ],
    "constraints": [
      "Resolves each load(id) with matching output from batchFn."
    ],
    "starterCode": "function createBatchLoader(batchFn) {\n  // Write your solution here\n}",
    "functionName": "createBatchLoader",
    "testCases": [
      {
        "id": "tc_443_1",
        "input": "[[async keys => keys.map(k => 'val-' + k)], [['load', 1], ['load', 2]]]",
        "expectedOutput": "['val-1', 'val-2']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_443_2",
        "input": "[[async keys => keys.map(k => k * 2)], [['load', 10]]]",
        "expectedOutput": "[20]",
        "isHidden": true
      }
    ],
    "solution": "function createBatchLoader(batchFn) {\n  let queue = [];\n  let scheduled = false;\n  function flush() {\n    const current = queue;\n    queue = [];\n    scheduled = false;\n    const keys = current.map(item => item.key);\n    Promise.resolve(batchFn(keys))\n      .then(results => {\n        current.forEach((item, idx) => item.resolve(results[idx]));\n      })\n      .catch(err => {\n        current.forEach(item => item.reject(err));\n      });\n  }\n  return {\n    load(key) {\n      return new Promise((resolve, reject) => {\n        queue.push({ key, resolve, reject });\n        if (!scheduled) {\n          scheduled = true;\n          queueMicrotask(flush);\n        }\n      });\n    }\n  };\n}",
    "explanation": "Push key to queue and schedule flush via queueMicrotask, resolving each item with matching result.",
    "timeComplexity": "O(1) amortized",
    "spaceComplexity": "O(k)",
    "hints": [
      "Use queueMicrotask(flush) to coalesce all calls within the tick."
    ]
  },
  {
    "id": "JS-P444",
    "number": 444,
    "title": "Create Auto-Expiring Async Cache (createAsyncCache)",
    "slug": "js-p444-create-auto-expiring-async-cache-createasynccache",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Caching",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Cache",
      "Async",
      "TTL"
    ],
    "tags": [
      "cache",
      "ttl",
      "async"
    ],
    "expectedTime": "10 mins",
    "summary": "Cache fetch responses with automatic expiration.",
    "problemStatement": "Write a function `createAsyncCache(fetchFn, maxAgeMs)` returning `{ get(key) }`. If cached and unexpired, returns cached value; otherwise calls `fetchFn(key)` and caches.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[async k => 'u1-1', 50], [['get', 'u1'], ['get', 'u1']]]",
        "output": "['u1-1', 'u1-1']",
        "explanation": "Fetches and caches."
      }
    ],
    "constraints": [
      "Evicts expired entries on get."
    ],
    "starterCode": "function createAsyncCache(fetchFn, maxAgeMs) {\n  // Write your solution here\n}",
    "functionName": "createAsyncCache",
    "testCases": [
      {
        "id": "tc_444_1",
        "input": "[[async k => 'u1-1', 50], [['get', 'u1'], ['get', 'u1']]]",
        "expectedOutput": "['u1-1', 'u1-1']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_444_2",
        "input": "[[async k => k.toUpperCase(), 10], [['get', 'item']]]",
        "expectedOutput": "['ITEM']",
        "isHidden": true
      }
    ],
    "solution": "function createAsyncCache(fetchFn, maxAgeMs) {\n  const cache = new Map();\n  return {\n    async get(key) {\n      const now = Date.now();\n      if (cache.has(key)) {\n        const entry = cache.get(key);\n        if (now < entry.expiry) return entry.val;\n      }\n      const val = await fetchFn(key);\n      cache.set(key, { val, expiry: now + maxAgeMs });\n      return val;\n    }\n  };\n}",
    "explanation": "Store val and now + maxAgeMs in Map, returning cached if now < expiry.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(k)",
    "hints": [
      "Check now < entry.expiry."
    ]
  },
  {
    "id": "JS-P445",
    "number": 445,
    "title": "Implement AbortController Polyfill Shim (createAbortControllerShim)",
    "slug": "js-p445-implement-abortcontroller-polyfill-shim-createabortcontrollershim",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Cancellation",
    "difficulty": "Medium",
    "questionType": "Polyfill",
    "skills": [
      "AbortController",
      "AbortSignal",
      "Polyfill"
    ],
    "tags": [
      "abort",
      "controller",
      "signal",
      "polyfill"
    ],
    "expectedTime": "10 mins",
    "summary": "Implement AbortController and AbortSignal simulation with abort event listeners.",
    "problemStatement": "Write a function `createAbortControllerShim()` that returns an object with `abort()` returning true, and `aborted` boolean property.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['abort']]]",
        "output": "[true]",
        "explanation": "Signal aborted becomes true."
      }
    ],
    "constraints": [
      "Calling abort() returns true."
    ],
    "starterCode": "function createAbortControllerShim() {\n  // Write your solution here\n}",
    "functionName": "createAbortControllerShim",
    "testCases": [
      {
        "id": "tc_445_1",
        "input": "[[], [['abort']]]",
        "expectedOutput": "[true]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_445_2",
        "input": "[[], [['abort'], ['abort']]]",
        "expectedOutput": "[true, true]",
        "isHidden": true
      }
    ],
    "solution": "function createAbortControllerShim() {\n  let aborted = false;\n  return {\n    abort() {\n      aborted = true;\n      return true;\n    },\n    get aborted() {\n      return aborted;\n    }\n  };\n}",
    "explanation": "Maintain aborted boolean and return true on abort().",
    "timeComplexity": "O(1) abort",
    "spaceComplexity": "O(1)",
    "hints": [
      "Return object with abort() method."
    ]
  },
  {
    "id": "JS-P446",
    "number": 446,
    "title": "Asynchronous Queue Drainer (drainQueue)",
    "slug": "js-p446-asynchronous-queue-drainer-drainqueue",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Concurrency",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Queue",
      "Drain",
      "Async"
    ],
    "tags": [
      "queue",
      "drain",
      "async"
    ],
    "expectedTime": "8 mins",
    "summary": "Concurrently drain items from an in-memory queue until empty.",
    "problemStatement": "Write an async function `drainQueue(queue, processor, workersCount = 2)` that shifts items from `queue` array and processes them with `processor(item)` across `workersCount` concurrent workers until `queue` is empty.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3, 4], async x => x * 2, 2]",
        "output": "[2, 4, 6, 8]",
        "explanation": "Processes all items."
      }
    ],
    "constraints": [
      "Empties original queue array."
    ],
    "starterCode": "async function drainQueue(queue, processor, workersCount = 2) {\n  // Write your solution here\n}",
    "functionName": "drainQueue",
    "testCases": [
      {
        "id": "tc_446_1",
        "input": "[[1, 2, 3, 4], async x => x * 2, 2]",
        "expectedOutput": "[2, 4, 6, 8]",
        "isHidden": false
      },
      {
        "id": "tc_446_2",
        "input": "[[], async x => x, 2]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_446_3",
        "input": "[['a', 'b'], async s => s.toUpperCase(), 1]",
        "expectedOutput": "['A', 'B']",
        "isHidden": true
      }
    ],
    "solution": "async function drainQueue(queue, processor, workersCount = 2) {\n  const results = [];\n  async function worker() {\n    while (queue.length > 0) {\n      const item = queue.shift();\n      const res = await processor(item);\n      results.push(res);\n    }\n  }\n  const workers = Array.from({ length: workersCount }, () => worker());\n  await Promise.all(workers);\n  return results;\n}",
    "explanation": "Run workersCount loops shifting from queue until empty.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "While queue.length > 0 shift and await processor(item)."
    ]
  },
  {
    "id": "JS-P447",
    "number": 447,
    "title": "Race With Fallback Alternative (raceWithFallback)",
    "slug": "js-p447-race-with-fallback-alternative-racewithfallback",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Combinators",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Race",
      "Fallback",
      "Timeout"
    ],
    "tags": [
      "race",
      "fallback",
      "timeout"
    ],
    "expectedTime": "8 mins",
    "summary": "Try primary promise; if it times out, wait for fallback promise.",
    "problemStatement": "Write a function `raceWithFallback(primaryPromise, fallbackPromise, timeoutMs)` that waits for `primaryPromise`. If it does not settle within `timeoutMs`, resolves with `fallbackPromise`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[new Promise(r => setTimeout(() => r('primary'), 50)), Promise.resolve('fallback'), 10]",
        "output": "'fallback'",
        "explanation": "Falls back to second promise."
      }
    ],
    "constraints": [
      "Returns result of primary if it completes within timeout."
    ],
    "starterCode": "function raceWithFallback(primaryPromise, fallbackPromise, timeoutMs) {\n  // Write your solution here\n}",
    "functionName": "raceWithFallback",
    "testCases": [
      {
        "id": "tc_447_1",
        "input": "[new Promise(r => setTimeout(() => r('primary'), 50)), Promise.resolve('fallback'), 5]",
        "expectedOutput": "'fallback'",
        "isHidden": false
      },
      {
        "id": "tc_447_2",
        "input": "[Promise.resolve('instant'), Promise.resolve('fallback'), 20]",
        "expectedOutput": "'instant'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_447_3",
        "input": "[new Promise(r => setTimeout(() => r(1), 5)), Promise.resolve(2), 20]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ],
    "solution": "function raceWithFallback(primaryPromise, fallbackPromise, timeoutMs) {\n  let timer;\n  const timeout = new Promise(resolve => {\n    timer = setTimeout(() => resolve(fallbackPromise), timeoutMs);\n  });\n  return Promise.race([primaryPromise, timeout]).finally(() => clearTimeout(timer));\n}",
    "explanation": "Race primary against a timer that resolves fallbackPromise.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Promise.race([primaryPromise, new Promise(r => timer = setTimeout(() => r(fallbackPromise), timeoutMs))])."
    ]
  },
  {
    "id": "JS-P448",
    "number": 448,
    "title": "Consume Async Stream to End (collectAsyncStream)",
    "slug": "js-p448-consume-async-stream-to-end-collectasyncstream",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Streams",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Streams",
      "Async Iterables"
    ],
    "tags": [
      "streams",
      "async",
      "iterables"
    ],
    "expectedTime": "8 mins",
    "summary": "Collect string chunks from an async stream or iterable and return concatenated string.",
    "problemStatement": "Write an async function `collectAsyncStream(stream)` that iterates through string chunks in `stream` and returns the joined concatenated string.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[(async function*() { yield 'Hello '; yield 'World!'; })()]",
        "output": "'Hello World!'",
        "explanation": "Concatenates chunks."
      }
    ],
    "constraints": [
      "Supports any async iterable."
    ],
    "starterCode": "async function collectAsyncStream(stream) {\n  // Write your solution here\n}",
    "functionName": "collectAsyncStream",
    "testCases": [
      {
        "id": "tc_448_1",
        "input": "[(async function*() { yield 'Hello '; yield 'World!'; })()]",
        "expectedOutput": "'Hello World!'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_448_2",
        "input": "[(async function*() { yield 'foo'; yield 'bar'; })()]",
        "expectedOutput": "'foobar'",
        "isHidden": true
      }
    ],
    "solution": "async function collectAsyncStream(stream) {\n  const chunks = [];\n  for await (const chunk of stream) {\n    chunks.push(chunk);\n  }\n  return chunks.join('');\n}",
    "explanation": "Iterate chunks with for await, then join with empty delimiter.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use for await (const chunk of stream) chunks.push(chunk). Return chunks.join('')."
    ]
  },
  {
    "id": "JS-P449",
    "number": 449,
    "title": "Create Async Iterable From Array (createAsyncIterable)",
    "slug": "js-p449-create-async-iterable-from-array-createasynciterable",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Iterables",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Symbol.asyncIterator",
      "Iterables"
    ],
    "tags": [
      "asyncIterator",
      "iterable",
      "async"
    ],
    "expectedTime": "8 mins",
    "summary": "Wrap an array into an object implementing Symbol.asyncIterator.",
    "problemStatement": "Write a function `createAsyncIterable(arr)` that returns an object with `[Symbol.asyncIterator]()` yielding each element of `arr` asynchronously.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[1, 2, 3]]",
        "output": "[1, 2, 3]",
        "explanation": "Yields 1, 2, 3."
      }
    ],
    "constraints": [
      "Implements Symbol.asyncIterator."
    ],
    "starterCode": "function createAsyncIterable(arr) {\n  // Write your solution here\n}",
    "functionName": "createAsyncIterable",
    "testCases": [
      {
        "id": "tc_449_1",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_449_2",
        "input": "[['a', 'b']]",
        "expectedOutput": "['a', 'b']",
        "isHidden": true
      }
    ],
    "solution": "function createAsyncIterable(arr) {\n  return {\n    [Symbol.asyncIterator]() {\n      let idx = 0;\n      return {\n        async next() {\n          if (idx < arr.length) {\n            return { value: arr[idx++], done: false };\n          }\n          return { value: undefined, done: true };\n        }\n      };\n    }\n  };\n}",
    "explanation": "Return object with [Symbol.asyncIterator] returning next() method with { value, done }.",
    "timeComplexity": "O(1) per step",
    "spaceComplexity": "O(1)",
    "hints": [
      "Define [Symbol.asyncIterator]() returning an object with next() method."
    ]
  },
  {
    "id": "JS-P450",
    "number": 450,
    "title": "Microtask Queue Execution (runMicrotask)",
    "slug": "js-p450-microtask-queue-execution-runmicrotask",
    "category": "Async JS / Promises / Microtasks",
    "subcategory": "Microtasks",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Microtask",
      "Event Loop",
      "queueMicrotask"
    ],
    "tags": [
      "microtask",
      "eventLoop",
      "queueMicrotask"
    ],
    "expectedTime": "5 mins",
    "summary": "Schedule a function to execute in the microtask queue and return a promise resolving with its result.",
    "problemStatement": "Write a function `runMicrotask(fn)` that schedules `fn()` via `queueMicrotask` (or `Promise.resolve().then()`) and returns a Promise resolving with its return value.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[() => 42]",
        "output": "42",
        "explanation": "Runs in microtask and resolves 42."
      }
    ],
    "constraints": [
      "Runs as microtask."
    ],
    "starterCode": "function runMicrotask(fn) {\n  // Write your solution here\n}",
    "functionName": "runMicrotask",
    "testCases": [
      {
        "id": "tc_450_1",
        "input": "[() => 42]",
        "expectedOutput": "42",
        "isHidden": false
      },
      {
        "id": "tc_450_2",
        "input": "[() => 'micro']",
        "expectedOutput": "'micro'",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_450_3",
        "input": "[() => ({ executed: true })]",
        "expectedOutput": "{\"executed\":true}",
        "isHidden": true
      }
    ],
    "solution": "function runMicrotask(fn) {\n  return new Promise((resolve, reject) => {\n    queueMicrotask(() => {\n      try {\n        resolve(fn());\n      } catch (err) {\n        reject(err);\n      }\n    });\n  });\n}",
    "explanation": "Wrap fn execution in queueMicrotask and resolve promise with the return value.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use new Promise with queueMicrotask(() => resolve(fn()))."
    ]
  }
];
