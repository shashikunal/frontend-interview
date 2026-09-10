// src/components/coreprogramming/data/batches/batch07.ts
import type { CoreProgrammingQuestion } from '../coreProgrammingTypes';

export const batch07: CoreProgrammingQuestion[] = [
  {
    "id": "JS-P301",
    "number": 301,
    "title": "Create Counter with Step",
    "slug": "js-p301-create-counter-with-step",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Closures",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "State"
    ],
    "tags": [
      "counter",
      "closures",
      "state"
    ],
    "expectedTime": "5 mins",
    "summary": "Create a closure function that increments by step each time it is called.",
    "problemStatement": "Write a function `createCounter(initial = 0, step = 1)` that returns a function. Each invocation of the returned function returns the next value starting from `initial`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[0, 2, [[], [], []]]",
        "output": "[0, 2, 4]",
        "explanation": "Increments by 2 each call."
      }
    ],
    "constraints": [
      "step defaults to 1."
    ],
    "starterCode": "function createCounter(initial = 0, step = 1) {\n  // Write your solution here\n}",
    "functionName": "createCounter",
    "testCases": [
      {
        "id": "tc_301_1",
        "input": "[0, 2, [[], [], []]]",
        "expectedOutput": "[0, 2, 4]",
        "isHidden": false
      },
      {
        "id": "tc_301_2",
        "input": "[10, 5, [[], []]]",
        "expectedOutput": "[10, 15]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_301_3",
        "input": "[-5, 1, [[], []]]",
        "expectedOutput": "[-5, -4]",
        "isHidden": true
      }
    ],
    "solution": "function createCounter(initial = 0, step = 1) {\n  let count = initial;\n  return function() {\n    const current = count;\n    count += step;\n    return current;\n  };\n}",
    "explanation": "Store count in closure. Return current value then increment by step.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Store count in closure variable and increment by step."
    ]
  },
  {
    "id": "JS-P302",
    "number": 302,
    "title": "Create Counter Object with Methods",
    "slug": "js-p302-create-counter-object-with-methods",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Encapsulation",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Encapsulation",
      "Object Methods"
    ],
    "tags": [
      "counter",
      "encapsulation",
      "methods"
    ],
    "expectedTime": "5 mins",
    "summary": "Encapsulate private count with increment, decrement, reset, and getValue methods.",
    "problemStatement": "Write a function `createCounterObject(init = 0)` that returns an object with methods:\n- `increment()`: increases count by 1 and returns count\n- `decrement()`: decreases count by 1 and returns count\n- `reset()`: resets count to init and returns count\n- `getValue()`: returns current count",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[5], [['increment'], ['increment'], ['decrement'], ['reset']]]",
        "output": "[6, 7, 6, 5]",
        "explanation": "Methods manipulate private count."
      }
    ],
    "constraints": [
      "Count variable must be private."
    ],
    "starterCode": "function createCounterObject(init = 0) {\n  // Write your solution here\n}",
    "functionName": "createCounterObject",
    "testCases": [
      {
        "id": "tc_302_1",
        "input": "[[5], [['increment'], ['increment'], ['decrement'], ['reset']]]",
        "expectedOutput": "[6, 7, 6, 5]",
        "isHidden": false
      },
      {
        "id": "tc_302_2",
        "input": "[[0], [['getValue'], ['increment'], ['getValue']]]",
        "expectedOutput": "[0, 1, 1]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_302_3",
        "input": "[[-10], [['decrement'], ['getValue']]]",
        "expectedOutput": "[-11, -11]",
        "isHidden": true
      }
    ],
    "solution": "function createCounterObject(init = 0) {\n  let count = init;\n  return {\n    increment: () => ++count,\n    decrement: () => --count,\n    reset: () => (count = init),\n    getValue: () => count\n  };\n}",
    "explanation": "Keep count inside closure, expose manipulation methods.",
    "timeComplexity": "O(1) per operation",
    "spaceComplexity": "O(1)",
    "hints": [
      "Return an object containing increment, decrement, reset, getValue."
    ]
  },
  {
    "id": "JS-P303",
    "number": 303,
    "title": "Create Boolean Toggle",
    "slug": "js-p303-create-boolean-toggle",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Closures",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "State"
    ],
    "tags": [
      "toggle",
      "boolean",
      "state"
    ],
    "expectedTime": "3 mins",
    "summary": "Create a function that flips boolean state on each call.",
    "problemStatement": "Write a function `createToggle(initialState = false)` that returns a function. Calling the returned function toggles the state and returns the new state.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[false, [[], [], []]]",
        "output": "[true, false, true]",
        "explanation": "Flips on each call."
      }
    ],
    "constraints": [
      "Initial state defaults to false."
    ],
    "starterCode": "function createToggle(initialState = false) {\n  // Write your solution here\n}",
    "functionName": "createToggle",
    "testCases": [
      {
        "id": "tc_303_1",
        "input": "[false, [[], [], []]]",
        "expectedOutput": "[true, false, true]",
        "isHidden": false
      },
      {
        "id": "tc_303_2",
        "input": "[true, [[], []]]",
        "expectedOutput": "[false, true]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_303_3",
        "input": "[false, [[]]]",
        "expectedOutput": "[true]",
        "isHidden": true
      }
    ],
    "solution": "function createToggle(initialState = false) {\n  let state = initialState;\n  return function() {\n    state = !state;\n    return state;\n  };\n}",
    "explanation": "Invert boolean state and return it.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "state = !state; return state;"
    ]
  },
  {
    "id": "JS-P304",
    "number": 304,
    "title": "Create Arithmetic Sequence Generator",
    "slug": "js-p304-create-arithmetic-sequence-generator",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Generators",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Generators"
    ],
    "tags": [
      "sequence",
      "generator",
      "closures"
    ],
    "expectedTime": "5 mins",
    "summary": "Return consecutive numbers in an arithmetic progression.",
    "problemStatement": "Write a function `createSequence(start = 0, step = 1)` that returns a function. Each call yields the next number in the arithmetic progression `start + k * step`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[10, 3, [[], [], []]]",
        "output": "[10, 13, 16]",
        "explanation": "10, 13, 16..."
      }
    ],
    "constraints": [
      "start and step can be negative or float."
    ],
    "starterCode": "function createSequence(start = 0, step = 1) {\n  // Write your solution here\n}",
    "functionName": "createSequence",
    "testCases": [
      {
        "id": "tc_304_1",
        "input": "[10, 3, [[], [], []]]",
        "expectedOutput": "[10, 13, 16]",
        "isHidden": false
      },
      {
        "id": "tc_304_2",
        "input": "[0, -2, [[], [], []]]",
        "expectedOutput": "[0, -2, -4]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_304_3",
        "input": "[100, 0, [[], []]]",
        "expectedOutput": "[100, 100]",
        "isHidden": true
      }
    ],
    "solution": "function createSequence(start = 0, step = 1) {\n  let cur = start;\n  return function() {\n    const val = cur;\n    cur += step;\n    return val;\n  };\n}",
    "explanation": "Store cur in closure, advance by step after reading.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Return current value then add step."
    ]
  },
  {
    "id": "JS-P305",
    "number": 305,
    "title": "Create Unique ID Generator",
    "slug": "js-p305-create-unique-id-generator",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Generators",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "String Formatting"
    ],
    "tags": [
      "id",
      "generator",
      "unique"
    ],
    "expectedTime": "5 mins",
    "summary": "Generate sequential prefixed IDs like 'item_1', 'item_2'.",
    "problemStatement": "Write a function `createIdGenerator(prefix = 'id_', start = 1)` that returns a function generating sequential prefixed IDs.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['user_', 1, [[], [], []]]",
        "output": "['user_1', 'user_2', 'user_3']",
        "explanation": "Generates user_1, user_2, user_3."
      }
    ],
    "constraints": [
      "start defaults to 1."
    ],
    "starterCode": "function createIdGenerator(prefix = 'id_', start = 1) {\n  // Write your solution here\n}",
    "functionName": "createIdGenerator",
    "testCases": [
      {
        "id": "tc_305_1",
        "input": "['user_', 1, [[], [], []]]",
        "expectedOutput": "['user_1', 'user_2', 'user_3']",
        "isHidden": false
      },
      {
        "id": "tc_305_2",
        "input": "['task-', 10, [[], []]]",
        "expectedOutput": "['task-10', 'task-11']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_305_3",
        "input": "['', 0, [[], []]]",
        "expectedOutput": "['0', '1']",
        "isHidden": true
      }
    ],
    "solution": "function createIdGenerator(prefix = 'id_', start = 1) {\n  let id = start;\n  return function() {\n    return `${prefix}${id++}`;\n  };\n}",
    "explanation": "Format `${prefix}${id++}` inside closure.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use `${prefix}${id++}`."
    ]
  },
  {
    "id": "JS-P306",
    "number": 306,
    "title": "Infinite Currying Accumulator",
    "slug": "js-p306-infinite-currying-accumulator",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Currying",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Recursion",
      "Accumulator"
    ],
    "tags": [
      "currying",
      "infinite",
      "sum"
    ],
    "expectedTime": "10 mins",
    "summary": "Accumulate sum across chained calls until called with no arguments: sum(1)(2)(3)().",
    "problemStatement": "Write a function `curriedSum(a)` that returns a function which can be chained indefinitely with numbers. When called with no arguments `()`, it returns the accumulated sum.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[1, [[2], [3], []]]",
        "output": "6",
        "explanation": "curriedSum(1)(2)(3)() = 6"
      }
    ],
    "constraints": [
      "Terminates when invoked with zero arguments."
    ],
    "starterCode": "function curriedSum(a) {\n  // Write your solution here\n}",
    "functionName": "curriedSum",
    "testCases": [
      {
        "id": "tc_306_1",
        "input": "[1, [[2], [3], []]]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "id": "tc_306_2",
        "input": "[10, [[20], []]]",
        "expectedOutput": "30",
        "isHidden": false
      },
      {
        "id": "tc_306_3",
        "input": "[5, [[]]]",
        "expectedOutput": "5",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_306_4",
        "input": "[0, [[-5], [5], []]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "solution": "function curriedSum(a) {\n  return function next(b) {\n    if (b === undefined) return a;\n    return curriedSum(a + b);\n  };\n}",
    "explanation": "If b === undefined return a; else recurse with curriedSum(a + b).",
    "timeComplexity": "O(1) per invocation",
    "spaceComplexity": "O(n) recursion stack",
    "hints": [
      "Check if argument is undefined. If so, return sum; otherwise recurse."
    ]
  },
  {
    "id": "JS-P307",
    "number": 307,
    "title": "Create Private Vault",
    "slug": "js-p307-create-private-vault",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Security",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Data Privacy"
    ],
    "tags": [
      "vault",
      "security",
      "privacy"
    ],
    "expectedTime": "5 mins",
    "summary": "Protect a secret behind a password check in a closure.",
    "problemStatement": "Write a function `createVault(key, secret)` that returns an object with methods:\n- `unlock(enteredKey)`: returns `secret` if `enteredKey === key`, otherwise `null`\n- `changeKey(oldKey, newKey)`: changes key to `newKey` if `oldKey === key` and returns `true`, otherwise returns `false`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[['pass123', 'treasure'], [['unlock', 'wrong'], ['unlock', 'pass123']]]",
        "output": "[null, 'treasure']",
        "explanation": "Only unlocks with correct key."
      }
    ],
    "constraints": [
      "Secret cannot be accessed directly without unlock."
    ],
    "starterCode": "function createVault(key, secret) {\n  // Write your solution here\n}",
    "functionName": "createVault",
    "testCases": [
      {
        "id": "tc_307_1",
        "input": "[['pass123', 'treasure'], [['unlock', 'wrong'], ['unlock', 'pass123']]]",
        "expectedOutput": "[null, 'treasure']",
        "isHidden": false
      },
      {
        "id": "tc_307_2",
        "input": "[['k', 'data'], [['changeKey', 'wrong', 'k2'], ['changeKey', 'k', 'k2'], ['unlock', 'k2']]]",
        "expectedOutput": "[false, true, 'data']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_307_3",
        "input": "[['abc', 42], [['unlock', 'abc']]]",
        "expectedOutput": "[42]",
        "isHidden": true
      }
    ],
    "solution": "function createVault(key, secret) {\n  let currentKey = key;\n  return {\n    unlock: (enteredKey) => (enteredKey === currentKey ? secret : null),\n    changeKey: (oldKey, newKey) => {\n      if (oldKey === currentKey) {\n        currentKey = newKey;\n        return true;\n      }\n      return false;\n    }\n  };\n}",
    "explanation": "Keep key and secret locked inside the closure.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Check enteredKey === currentKey."
    ]
  },
  {
    "id": "JS-P308",
    "number": 308,
    "title": "Create Bank Account",
    "slug": "js-p308-create-bank-account",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Encapsulation",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Encapsulation",
      "Finance"
    ],
    "tags": [
      "bank",
      "account",
      "encapsulation"
    ],
    "expectedTime": "10 mins",
    "summary": "Simulate a bank account with deposit, withdraw, and transaction history in closure.",
    "problemStatement": "Write a function `createBankAccount(initialBalance = 0)` returning an object with methods:\n- `deposit(amt)`: adds `amt` to balance, returns new balance\n- `withdraw(amt)`: if `amt <= balance`, subtracts `amt` and returns new balance; otherwise returns `'Insufficient funds'`\n- `getBalance()`: returns current balance\n- `getTransactions()`: returns an array of transaction records `{ type: 'deposit'|'withdraw', amount: number }`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[100], [['deposit', 50], ['withdraw', 30], ['getBalance']]]",
        "output": "[150, 120, 120]",
        "explanation": "Maintains private balance."
      }
    ],
    "constraints": [
      "amt must be > 0."
    ],
    "starterCode": "function createBankAccount(initialBalance = 0) {\n  // Write your solution here\n}",
    "functionName": "createBankAccount",
    "testCases": [
      {
        "id": "tc_308_1",
        "input": "[[100], [['deposit', 50], ['withdraw', 30], ['getBalance']]]",
        "expectedOutput": "[150, 120, 120]",
        "isHidden": false
      },
      {
        "id": "tc_308_2",
        "input": "[[50], [['withdraw', 100], ['getBalance']]]",
        "expectedOutput": "['Insufficient funds', 50]",
        "isHidden": false
      },
      {
        "id": "tc_308_3",
        "input": "[[0], [['deposit', 20], ['getTransactions']]]",
        "expectedOutput": "[20, [{\"type\":\"deposit\",\"amount\":20}]]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_308_4",
        "input": "[[200], [['withdraw', 200], ['getBalance']]]",
        "expectedOutput": "[0, 0]",
        "isHidden": true
      }
    ],
    "solution": "function createBankAccount(initialBalance = 0) {\n  let balance = initialBalance;\n  const transactions = [];\n  return {\n    deposit: (amt) => {\n      balance += amt;\n      transactions.push({ type: 'deposit', amount: amt });\n      return balance;\n    },\n    withdraw: (amt) => {\n      if (amt > balance) return 'Insufficient funds';\n      balance -= amt;\n      transactions.push({ type: 'withdraw', amount: amt });\n      return balance;\n    },\n    getBalance: () => balance,\n    getTransactions: () => transactions.slice()\n  };\n}",
    "explanation": "Store balance and transactions array in closure. Return shallow copy for getTransactions.",
    "timeComplexity": "O(1) per operation",
    "spaceComplexity": "O(t) transactions",
    "hints": [
      "Store transactions in an array in closure."
    ]
  },
  {
    "id": "JS-P309",
    "number": 309,
    "title": "Create Rate Limiter",
    "slug": "js-p309-create-rate-limiter",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Flow Control",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Rate Limiting"
    ],
    "tags": [
      "rateLimit",
      "closures",
      "flow"
    ],
    "expectedTime": "5 mins",
    "summary": "Allow up to N calls, rejecting further calls.",
    "problemStatement": "Write a function `createRateLimiter(limit)` that returns a function. The returned function returns `true` for the first `limit` calls, and `false` for any subsequent calls.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[2, [[], [], []]]",
        "output": "[true, true, false]",
        "explanation": "Limit 2 allows first two calls."
      }
    ],
    "constraints": [
      "limit >= 0."
    ],
    "starterCode": "function createRateLimiter(limit) {\n  // Write your solution here\n}",
    "functionName": "createRateLimiter",
    "testCases": [
      {
        "id": "tc_309_1",
        "input": "[2, [[], [], []]]",
        "expectedOutput": "[true, true, false]",
        "isHidden": false
      },
      {
        "id": "tc_309_2",
        "input": "[0, [[]]]",
        "expectedOutput": "[false]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_309_3",
        "input": "[1, [[], []]]",
        "expectedOutput": "[true, false]",
        "isHidden": true
      }
    ],
    "solution": "function createRateLimiter(limit) {\n  let calls = 0;\n  return function() {\n    if (calls < limit) {\n      calls++;\n      return true;\n    }\n    return false;\n  };\n}",
    "explanation": "Increment calls while calls < limit.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Maintain calls counter in closure."
    ]
  },
  {
    "id": "JS-P310",
    "number": 310,
    "title": "Create Undo/Redo Manager",
    "slug": "js-p310-create-undo-redo-manager",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "State Management",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Undo/Redo",
      "Data Structures"
    ],
    "tags": [
      "undo",
      "redo",
      "state"
    ],
    "expectedTime": "10 mins",
    "summary": "Manage history state supporting set, undo, redo, and get.",
    "problemStatement": "Write a function `createUndoRedo(initial)` returning an object with methods:\n- `set(val)`: sets current value, pushes previous to undo stack, and clears redo stack\n- `undo()`: reverts to previous value if available, pushing current to redo stack. Returns current value.\n- `redo()`: re-applies undone value if available. Returns current value.\n- `get()`: returns current value.",
    "examples": [
      {
        "title": "Example 1",
        "input": "['A', [['set', 'B'], ['set', 'C'], ['undo'], ['get']]]",
        "output": "[undefined, undefined, 'B', 'B']",
        "explanation": "Undoes C back to B."
      }
    ],
    "constraints": [
      "If cannot undo/redo, keep current value unchanged."
    ],
    "starterCode": "function createUndoRedo(initial) {\n  // Write your solution here\n}",
    "functionName": "createUndoRedo",
    "testCases": [
      {
        "id": "tc_310_1",
        "input": "['A', [['set', 'B'], ['set', 'C'], ['undo'], ['get']]]",
        "expectedOutput": "[null, null, 'B', 'B']",
        "isHidden": false
      },
      {
        "id": "tc_310_2",
        "input": "[1, [['undo'], ['get'], ['set', 2], ['undo'], ['redo'], ['get']]]",
        "expectedOutput": "[1, 1, null, 1, 2, 2]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_310_3",
        "input": "['x', [['set', 'y'], ['set', 'z'], ['undo'], ['undo'], ['get']]]",
        "expectedOutput": "[null, null, 'y', 'x', 'x']",
        "isHidden": true
      }
    ],
    "solution": "function createUndoRedo(initial) {\n  let current = initial;\n  const undoStack = [];\n  let redoStack = [];\n  return {\n    set: (val) => {\n      undoStack.push(current);\n      current = val;\n      redoStack = [];\n    },\n    undo: () => {\n      if (undoStack.length > 0) {\n        redoStack.push(current);\n        current = undoStack.pop();\n      }\n      return current;\n    },\n    redo: () => {\n      if (redoStack.length > 0) {\n        undoStack.push(current);\n        current = redoStack.pop();\n      }\n      return current;\n    },\n    get: () => current\n  };\n}",
    "explanation": "Two stacks (undoStack and redoStack) managing history transitions.",
    "timeComplexity": "O(1) per operation",
    "spaceComplexity": "O(n) history",
    "hints": [
      "Maintain undoStack and redoStack in closure."
    ]
  },
  {
    "id": "JS-P311",
    "number": 311,
    "title": "Create State History",
    "slug": "js-p311-create-state-history",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "State Management",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "History"
    ],
    "tags": [
      "history",
      "state",
      "closures"
    ],
    "expectedTime": "5 mins",
    "summary": "Track full chronological history of values.",
    "problemStatement": "Write a function `createStateHistory(initial)` returning an object with:\n- `push(val)`: appends `val` to history and sets it as current\n- `getHistory()`: returns a shallow copy array of all values desde `initial`\n- `current()`: returns current value",
    "examples": [
      {
        "title": "Example 1",
        "input": "[1, [['push', 2], ['push', 3], ['getHistory'], ['current']]]",
        "output": "[null, null, [1, 2, 3], 3]",
        "explanation": "Tracks [1, 2, 3]."
      }
    ],
    "constraints": [
      "Never mutate external history."
    ],
    "starterCode": "function createStateHistory(initial) {\n  // Write your solution here\n}",
    "functionName": "createStateHistory",
    "testCases": [
      {
        "id": "tc_311_1",
        "input": "[1, [['push', 2], ['push', 3], ['getHistory'], ['current']]]",
        "expectedOutput": "[null, null, [1, 2, 3], 3]",
        "isHidden": false
      },
      {
        "id": "tc_311_2",
        "input": "['start', [['current'], ['getHistory']]]",
        "expectedOutput": "['start', ['start']]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_311_3",
        "input": "[0, [['push', 10], ['current']]]",
        "expectedOutput": "[null, 10]",
        "isHidden": true
      }
    ],
    "solution": "function createStateHistory(initial) {\n  const history = [initial];\n  return {\n    push: (val) => { history.push(val); },\n    getHistory: () => history.slice(),\n    current: () => history[history.length - 1]\n  };\n}",
    "explanation": "Store history array, return history.slice() and history[history.length - 1].",
    "timeComplexity": "O(1) push/current, O(n) getHistory",
    "spaceComplexity": "O(n)",
    "hints": [
      "Store values in an array initialized with [initial]."
    ]
  },
  {
    "id": "JS-P312",
    "number": 312,
    "title": "Create Multi-Counter",
    "slug": "js-p312-create-multi-counter",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "State Management",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Map/Object"
    ],
    "tags": [
      "multiCounter",
      "counters",
      "state"
    ],
    "expectedTime": "5 mins",
    "summary": "Manage multiple named counters independently.",
    "problemStatement": "Write a function `createMultiCounter()` returning an object with:\n- `increment(key)`: adds 1 to key counter (starts at 0 if uninitialized), returns new count\n- `decrement(key)`: subtracts 1 from key counter, returns new count\n- `get(key)`: returns current count of key (0 if unset)\n- `reset(key)`: resets key counter to 0",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['increment', 'a'], ['increment', 'a'], ['increment', 'b'], ['get', 'a'], ['get', 'b']]]",
        "output": "[1, 2, 1, 2, 1]",
        "explanation": "Manages 'a' and 'b' separately."
      }
    ],
    "constraints": [
      "Keys can be any string."
    ],
    "starterCode": "function createMultiCounter() {\n  // Write your solution here\n}",
    "functionName": "createMultiCounter",
    "testCases": [
      {
        "id": "tc_312_1",
        "input": "[[], [['increment', 'a'], ['increment', 'a'], ['increment', 'b'], ['get', 'a'], ['get', 'b']]]",
        "expectedOutput": "[1, 2, 1, 2, 1]",
        "isHidden": false
      },
      {
        "id": "tc_312_2",
        "input": "[[], [['get', 'unknown'], ['decrement', 'c'], ['reset', 'c'], ['get', 'c']]]",
        "expectedOutput": "[0, -1, 0, 0]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_312_3",
        "input": "[[], [['increment', 'x'], ['reset', 'x']]]",
        "expectedOutput": "[1, 0]",
        "isHidden": true
      }
    ],
    "solution": "function createMultiCounter() {\n  const counts = new Map();\n  return {\n    increment: (key) => {\n      const val = (counts.get(key) || 0) + 1;\n      counts.set(key, val);\n      return val;\n    },\n    decrement: (key) => {\n      const val = (counts.get(key) || 0) - 1;\n      counts.set(key, val);\n      return val;\n    },\n    get: (key) => counts.get(key) || 0,\n    reset: (key) => {\n      counts.set(key, 0);\n      return 0;\n    }\n  };\n}",
    "explanation": "Use a Map inside the closure to store counts per key.",
    "timeComplexity": "O(1) average per operation",
    "spaceComplexity": "O(k) keys",
    "hints": [
      "Use Map or plain object in closure."
    ]
  },
  {
    "id": "JS-P313",
    "number": 313,
    "title": "Create Cycle Iterator",
    "slug": "js-p313-create-cycle-iterator",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Iterators",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Iterators"
    ],
    "tags": [
      "cycle",
      "iterator",
      "closures"
    ],
    "expectedTime": "5 mins",
    "summary": "Repeatedly cycle through array elements indefinitely.",
    "problemStatement": "Write a function `createCycleIterator(items)` that returns a function. Each call returns the next item in `items`, wrapping back to the beginning after the last item.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[['red', 'green', 'blue'], [[], [], [], []]]",
        "output": "['red', 'green', 'blue', 'red']",
        "explanation": "Wraps back to 'red'."
      }
    ],
    "constraints": [
      "items is non-empty array."
    ],
    "starterCode": "function createCycleIterator(items) {\n  // Write your solution here\n}",
    "functionName": "createCycleIterator",
    "testCases": [
      {
        "id": "tc_313_1",
        "input": "[['red', 'green', 'blue'], [[], [], [], []]]",
        "expectedOutput": "['red', 'green', 'blue', 'red']",
        "isHidden": false
      },
      {
        "id": "tc_313_2",
        "input": "[[1, 2], [[], [], []]]",
        "expectedOutput": "[1, 2, 1]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_313_3",
        "input": "[['only'], [[], []]]",
        "expectedOutput": "['only', 'only']",
        "isHidden": true
      }
    ],
    "solution": "function createCycleIterator(items) {\n  let index = 0;\n  return function() {\n    const item = items[index];\n    index = (index + 1) % items.length;\n    return item;\n  };\n}",
    "explanation": "Maintain index in closure and update with index = (index + 1) % items.length.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Use index = (index + 1) % items.length."
    ]
  },
  {
    "id": "JS-P314",
    "number": 314,
    "title": "Create Accumulator Function",
    "slug": "js-p314-create-accumulator-function",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Accumulators",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "State"
    ],
    "tags": [
      "accumulator",
      "closures"
    ],
    "expectedTime": "5 mins",
    "summary": "Return running total adding each provided number.",
    "problemStatement": "Write a function `createAccumulator(init = 0)` that returns a function `(val)` which adds `val` to the accumulated total and returns the new total.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[0, [[5], [10], [-3]]]",
        "output": "[5, 15, 12]",
        "explanation": "Accumulates 0 + 5 + 10 - 3."
      }
    ],
    "constraints": [
      "val is numeric."
    ],
    "starterCode": "function createAccumulator(init = 0) {\n  // Write your solution here\n}",
    "functionName": "createAccumulator",
    "testCases": [
      {
        "id": "tc_314_1",
        "input": "[0, [[5], [10], [-3]]]",
        "expectedOutput": "[5, 15, 12]",
        "isHidden": false
      },
      {
        "id": "tc_314_2",
        "input": "[100, [[50], [25]]]",
        "expectedOutput": "[150, 175]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_314_3",
        "input": "[-10, [[10]]]",
        "expectedOutput": "[0]",
        "isHidden": true
      }
    ],
    "solution": "function createAccumulator(init = 0) {\n  let total = init;\n  return function(val = 0) {\n    total += val;\n    return total;\n  };\n}",
    "explanation": "Add val to total stored in closure.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "total += val; return total;"
    ]
  },
  {
    "id": "JS-P315",
    "number": 315,
    "title": "Create Countdown Timer",
    "slug": "js-p315-create-countdown-timer",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Generators",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Counters"
    ],
    "tags": [
      "countdown",
      "closures"
    ],
    "expectedTime": "5 mins",
    "summary": "Count down from n to 0, staying at 0 thereafter.",
    "problemStatement": "Write a function `createCountdown(n)` that returns a function. Each invocation yields `n, n-1...` down to `0`. Once `0` is reached, subsequent invocations continue returning `0`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[2, [[], [], [], []]]",
        "output": "[2, 1, 0, 0]",
        "explanation": "Counts down 2, 1, 0, 0."
      }
    ],
    "constraints": [
      "n >= 0."
    ],
    "starterCode": "function createCountdown(n) {\n  // Write your solution here\n}",
    "functionName": "createCountdown",
    "testCases": [
      {
        "id": "tc_315_1",
        "input": "[2, [[], [], [], []]]",
        "expectedOutput": "[2, 1, 0, 0]",
        "isHidden": false
      },
      {
        "id": "tc_315_2",
        "input": "[0, [[], []]]",
        "expectedOutput": "[0, 0]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_315_3",
        "input": "[1, [[], [], []]]",
        "expectedOutput": "[1, 0, 0]",
        "isHidden": true
      }
    ],
    "solution": "function createCountdown(n) {\n  let current = n;\n  return function() {\n    const val = current;\n    if (current > 0) current--;\n    return val;\n  };\n}",
    "explanation": "Decrement while current > 0.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Return current, decrement if > 0."
    ]
  },
  {
    "id": "JS-P316",
    "number": 316,
    "title": "Create Call Counter Spy",
    "slug": "js-p316-create-call-counter-spy",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Testing Spies",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Spies",
      "Testing"
    ],
    "tags": [
      "spy",
      "testing",
      "closures"
    ],
    "expectedTime": "10 mins",
    "summary": "Wrap a function to track callCount, lastArgs, and call history.",
    "problemStatement": "Write a function `createSpy(fn)` that returns a spy wrapper function with properties/methods:\n- `spy(...args)`: invokes `fn(...args)` and returns its result\n- `spy.callCount()`: returns number of times spy was called\n- `spy.lastArgs()`: returns arguments of most recent call (or `null` if not called)\n- `spy.calls()`: returns array of all argument arrays",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[x => x * 2], [['spy', 5], ['spy', 10], ['callCount'], ['lastArgs']]]",
        "output": "[10, 20, 2, [10]]",
        "explanation": "Tracks calls and last arguments."
      }
    ],
    "constraints": [
      "Preserve fn this context."
    ],
    "starterCode": "function createSpy(fn) {\n  // Write your solution here\n}",
    "functionName": "createSpy",
    "testCases": [
      {
        "id": "tc_316_1",
        "input": "[[x => x * 2], [['spy', 5], ['spy', 10], ['callCount'], ['lastArgs']]]",
        "expectedOutput": "[10, 20, 2, [10]]",
        "isHidden": false
      },
      {
        "id": "tc_316_2",
        "input": "[[() => 'ok'], [['callCount'], ['lastArgs']]]",
        "expectedOutput": "[0, null]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_316_3",
        "input": "[[(a, b) => a + b], [['spy', 1, 2], ['calls']]]",
        "expectedOutput": "[3, [[1, 2]]]",
        "isHidden": true
      }
    ],
    "solution": "function createSpy(fn) {\n  const callsList = [];\n  function spy(...args) {\n    callsList.push(args);\n    return fn.apply(this, args);\n  }\n  spy.spy = spy;\n  spy.callCount = () => callsList.length;\n  spy.lastArgs = () => (callsList.length > 0 ? callsList[callsList.length - 1] : null);\n  spy.calls = () => callsList.slice();\n  return spy;\n}",
    "explanation": "Attach inspection methods to the returned spy function.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(c) calls",
    "hints": [
      "Attach methods directly to the wrapper function."
    ]
  },
  {
    "id": "JS-P317",
    "number": 317,
    "title": "Create State Machine",
    "slug": "js-p317-create-state-machine",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "State Machine",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "State Machines"
    ],
    "tags": [
      "stateMachine",
      "fsm",
      "state"
    ],
    "expectedTime": "10 mins",
    "summary": "Manage finite state machine transitions.",
    "problemStatement": "Write a function `createStateMachine(initial, transitions)` returning an object with:\n- `transition(action)`: if a transition exists for `current` state and `action`, updates state and returns new state; otherwise returns `null`\n- `getState()`: returns current state",
    "examples": [
      {
        "title": "Example 1",
        "input": "['idle', { idle: { start: 'running' }, running: { stop: 'idle' } }, [['transition', 'start'], ['getState'], ['transition', 'invalid']]]",
        "output": "['running', 'running', null]",
        "explanation": "Transitions idle -> running on 'start'."
      }
    ],
    "constraints": [
      "transitions is an object mapping state -> { action: nextState }."
    ],
    "starterCode": "function createStateMachine(initial, transitions) {\n  // Write your solution here\n}",
    "functionName": "createStateMachine",
    "testCases": [
      {
        "id": "tc_317_1",
        "input": "['idle', { idle: { start: 'running' }, running: { stop: 'idle' } }, [['transition', 'start'], ['getState'], ['transition', 'invalid']]]",
        "expectedOutput": "['running', 'running', null]",
        "isHidden": false
      },
      {
        "id": "tc_317_2",
        "input": "['locked', { locked: { coin: 'unlocked' }, unlocked: { push: 'locked' } }, [['getState'], ['transition', 'coin'], ['transition', 'push']]]",
        "expectedOutput": "['locked', 'unlocked', 'locked']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_317_3",
        "input": "['a', {}, [['transition', 'x']]]",
        "expectedOutput": "[null]",
        "isHidden": true
      }
    ],
    "solution": "function createStateMachine(initial, transitions) {\n  let current = initial;\n  return {\n    transition: (action) => {\n      const next = transitions[current] && transitions[current][action];\n      if (next !== undefined) {\n        current = next;\n        return current;\n      }\n      return null;\n    },\n    getState: () => current\n  };\n}",
    "explanation": "Check transitions[current][action] and update current state.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Check if transitions[current][action] exists."
    ]
  },
  {
    "id": "JS-P318",
    "number": 318,
    "title": "Create Stack Store",
    "slug": "js-p318-create-stack-store",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Data Structures",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Stack"
    ],
    "tags": [
      "stack",
      "dataStructures",
      "closures"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement LIFO stack with private storage.",
    "problemStatement": "Write a function `createStackStore()` returning an object with `push(item)`, `pop()`, `peek()`, `size()`, `isEmpty()`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['push', 1], ['push', 2], ['peek'], ['pop'], ['size']]]",
        "output": "[null, null, 2, 2, 1]",
        "explanation": "LIFO: 2 popped first."
      }
    ],
    "constraints": [
      "pop() and peek() on empty stack return undefined."
    ],
    "starterCode": "function createStackStore() {\n  // Write your solution here\n}",
    "functionName": "createStackStore",
    "testCases": [
      {
        "id": "tc_318_1",
        "input": "[[], [['push', 1], ['push', 2], ['peek'], ['pop'], ['size']]]",
        "expectedOutput": "[null, null, 2, 2, 1]",
        "isHidden": false
      },
      {
        "id": "tc_318_2",
        "input": "[[], [['isEmpty'], ['pop'], ['peek']]]",
        "expectedOutput": "[true, null, null]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_318_3",
        "input": "[[], [['push', 'a'], ['isEmpty']]]",
        "expectedOutput": "[null, false]",
        "isHidden": true
      }
    ],
    "solution": "function createStackStore() {\n  const items = [];\n  return {\n    push: (item) => { items.push(item); },\n    pop: () => items.pop(),\n    peek: () => (items.length > 0 ? items[items.length - 1] : undefined),\n    size: () => items.length,\n    isEmpty: () => items.length === 0\n  };\n}",
    "explanation": "Use array.push and array.pop inside closure.",
    "timeComplexity": "O(1) all operations",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use items.pop() and items[items.length - 1]."
    ]
  },
  {
    "id": "JS-P319",
    "number": 319,
    "title": "Create Queue Store",
    "slug": "js-p319-create-queue-store",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Data Structures",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Queue"
    ],
    "tags": [
      "queue",
      "dataStructures",
      "closures"
    ],
    "expectedTime": "5 mins",
    "summary": "Implement FIFO queue with private storage.",
    "problemStatement": "Write a function `createQueueStore()` returning an object with `enqueue(item)`, `dequeue()`, `peek()`, `size()`, `isEmpty()`.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['enqueue', 'a'], ['enqueue', 'b'], ['dequeue'], ['peek']]]",
        "output": "[null, null, 'a', 'b']",
        "explanation": "FIFO: 'a' dequeued first."
      }
    ],
    "constraints": [
      "dequeue() and peek() on empty queue return undefined."
    ],
    "starterCode": "function createQueueStore() {\n  // Write your solution here\n}",
    "functionName": "createQueueStore",
    "testCases": [
      {
        "id": "tc_319_1",
        "input": "[[], [['enqueue', 'a'], ['enqueue', 'b'], ['dequeue'], ['peek']]]",
        "expectedOutput": "[null, null, 'a', 'b']",
        "isHidden": false
      },
      {
        "id": "tc_319_2",
        "input": "[[], [['isEmpty'], ['size']]]",
        "expectedOutput": "[true, 0]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_319_3",
        "input": "[[], [['enqueue', 42], ['isEmpty']]]",
        "expectedOutput": "[null, false]",
        "isHidden": true
      }
    ],
    "solution": "function createQueueStore() {\n  const items = [];\n  return {\n    enqueue: (item) => { items.push(item); },\n    dequeue: () => items.shift(),\n    peek: () => (items.length > 0 ? items[0] : undefined),\n    size: () => items.length,\n    isEmpty: () => items.length === 0\n  };\n}",
    "explanation": "Use array.push and array.shift.",
    "timeComplexity": "O(1) enqueue/peek, O(n) dequeue",
    "spaceComplexity": "O(n)",
    "hints": [
      "items.shift() for FIFO."
    ]
  },
  {
    "id": "JS-P320",
    "number": 320,
    "title": "Create Circular Buffer",
    "slug": "js-p320-create-circular-buffer",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Buffers",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Circular Buffer",
      "Pointers"
    ],
    "tags": [
      "circularBuffer",
      "buffer",
      "closures"
    ],
    "expectedTime": "10 mins",
    "summary": "Fixed-size circular FIFO buffer overwriting oldest on overflow.",
    "problemStatement": "Write a function `createCircularBuffer(capacity)` with:\n- `write(item)`: writes item to buffer. If full, overwrites oldest item.\n- `read()`: reads and removes oldest item; if empty, returns `undefined`\n- `isFull()`: returns true if size === capacity\n- `isEmpty()`: returns true if size === 0",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[2], [['write', 1], ['write', 2], ['write', 3], ['read'], ['read']]]",
        "output": "[null, null, null, 2, 3]",
        "explanation": "1 was overwritten by 3."
      }
    ],
    "constraints": [
      "capacity > 0."
    ],
    "starterCode": "function createCircularBuffer(capacity) {\n  // Write your solution here\n}",
    "functionName": "createCircularBuffer",
    "testCases": [
      {
        "id": "tc_320_1",
        "input": "[[2], [['write', 1], ['write', 2], ['write', 3], ['read'], ['read']]]",
        "expectedOutput": "[null, null, null, 2, 3]",
        "isHidden": false
      },
      {
        "id": "tc_320_2",
        "input": "[[3], [['isEmpty'], ['isFull']]]",
        "expectedOutput": "[true, false]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_320_3",
        "input": "[[1], [['write', 'a'], ['isFull'], ['read'], ['isEmpty']]]",
        "expectedOutput": "[null, true, 'a', true]",
        "isHidden": true
      }
    ],
    "solution": "function createCircularBuffer(capacity) {\n  const buf = [];\n  return {\n    write: (item) => {\n      if (buf.length >= capacity) buf.shift();\n      buf.push(item);\n    },\n    read: () => buf.shift(),\n    isFull: () => buf.length === capacity,\n    isEmpty: () => buf.length === 0\n  };\n}",
    "explanation": "Shift oldest item when length exceeds capacity.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(capacity)",
    "hints": [
      "When buf.length >= capacity, call buf.shift()."
    ]
  },
  {
    "id": "JS-P321",
    "number": 321,
    "title": "Create LRU Cache",
    "slug": "js-p321-create-lru-cache",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Caching",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "LRU Cache",
      "Map"
    ],
    "tags": [
      "lru",
      "cache",
      "closures"
    ],
    "expectedTime": "10 mins",
    "summary": "Least Recently Used cache evicting oldest accessed item.",
    "problemStatement": "Write a function `createLRUCache(capacity)` returning an object with:\n- `get(key)`: returns value or -1 if not found. Access marks key as recently used.\n- `put(key, val)`: inserts or updates key. If capacity exceeded, evict least recently used key.\n- `size()`: returns current item count",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[2], [['put', 1, 1], ['put', 2, 2], ['get', 1], ['put', 3, 3], ['get', 2]]]",
        "output": "[null, null, 1, null, -1]",
        "explanation": "Key 2 was evicted because key 1 was accessed."
      }
    ],
    "constraints": [
      "capacity >= 1."
    ],
    "starterCode": "function createLRUCache(capacity) {\n  // Write your solution here\n}",
    "functionName": "createLRUCache",
    "testCases": [
      {
        "id": "tc_321_1",
        "input": "[[2], [['put', 1, 1], ['put', 2, 2], ['get', 1], ['put', 3, 3], ['get', 2]]]",
        "expectedOutput": "[null, null, 1, null, -1]",
        "isHidden": false
      },
      {
        "id": "tc_321_2",
        "input": "[[1], [['put', 'k', 'v'], ['size'], ['get', 'k']]]",
        "expectedOutput": "[null, 1, 'v']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_321_3",
        "input": "[[2], [['get', 99]]]",
        "expectedOutput": "[-1]",
        "isHidden": true
      }
    ],
    "solution": "function createLRUCache(capacity) {\n  const map = new Map();\n  return {\n    get: (key) => {\n      if (!map.has(key)) return -1;\n      const val = map.get(key);\n      map.delete(key);\n      map.set(key, val);\n      return val;\n    },\n    put: (key, val) => {\n      if (map.has(key)) map.delete(key);\n      else if (map.size >= capacity) {\n        const oldest = map.keys().next().value;\n        map.delete(oldest);\n      }\n      map.set(key, val);\n    },\n    size: () => map.size\n  };\n}",
    "explanation": "Leverage JS Map insertion-order guarantee: delete and re-set to mark recently used.",
    "timeComplexity": "O(1) all operations",
    "spaceComplexity": "O(capacity)",
    "hints": [
      "Use JavaScript Map's key insertion ordering."
    ]
  },
  {
    "id": "JS-P322",
    "number": 322,
    "title": "Create Subscribable Store",
    "slug": "js-p322-create-subscribable-store",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Observer Pattern",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Observer",
      "PubSub"
    ],
    "tags": [
      "store",
      "subscribable",
      "closures"
    ],
    "expectedTime": "10 mins",
    "summary": "Mini Redux-like store with getState, setState, and subscribe.",
    "problemStatement": "Write a function `createStore(initialState)` with:\n- `getState()`: returns current state\n- `setState(newState)`: updates state and calls all subscriber callbacks with new state\n- `subscribe(listener)`: registers listener callback, returns an `unsubscribe` function",
    "examples": [
      {
        "title": "Example 1",
        "input": "[{ count: 0 }, [['getState'], ['setState', { count: 1 }], ['getState']]]",
        "output": "[{\"count\":0}, null, {\"count\":1}]",
        "explanation": "Updates state."
      }
    ],
    "constraints": [
      "Listener is invoked on every setState."
    ],
    "starterCode": "function createStore(initialState) {\n  // Write your solution here\n}",
    "functionName": "createStore",
    "testCases": [
      {
        "id": "tc_322_1",
        "input": "[{ count: 0 }, [['getState'], ['setState', { count: 1 }], ['getState']]]",
        "expectedOutput": "[{\"count\":0}, null, {\"count\":1}]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_322_2",
        "input": "[42, [['getState']]]",
        "expectedOutput": "[42]",
        "isHidden": true
      }
    ],
    "solution": "function createStore(initialState) {\n  let state = initialState;\n  const listeners = new Set();\n  return {\n    getState: () => state,\n    setState: (newState) => {\n      state = newState;\n      listeners.forEach(fn => fn(state));\n    },\n    subscribe: (fn) => {\n      listeners.add(fn);\n      return () => listeners.delete(fn);\n    }\n  };\n}",
    "explanation": "Maintain state and Set of listener callbacks in closure.",
    "timeComplexity": "O(1) getState, O(s) setState",
    "spaceComplexity": "O(s) subscribers",
    "hints": [
      "Use Set for listeners."
    ]
  },
  {
    "id": "JS-P323",
    "number": 323,
    "title": "Create Event Emitter",
    "slug": "js-p323-create-event-emitter",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Events",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "EventEmitter",
      "Events"
    ],
    "tags": [
      "events",
      "emitter",
      "closures"
    ],
    "expectedTime": "10 mins",
    "summary": "Pub/Sub Event Emitter supporting on, emit, and off.",
    "problemStatement": "Write a function `createEventEmitter()` returning an object with:\n- `on(event, cb)`: registers listener for event\n- `emit(event, ...args)`: calls all listeners registered for event with `...args`, returns array of their return values\n- `off(event, cb)`: removes specific listener for event",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['on', 'click', () => 1], ['emit', 'click']]]",
        "output": "[null, [1]]",
        "explanation": "Emits to registered listener."
      }
    ],
    "constraints": [
      "Emit returns empty array if no listeners."
    ],
    "starterCode": "function createEventEmitter() {\n  // Write your solution here\n}",
    "functionName": "createEventEmitter",
    "testCases": [
      {
        "id": "tc_323_1",
        "input": "[[], [['on', 'click', () => 1], ['emit', 'click']]]",
        "expectedOutput": "[null, [1]]",
        "isHidden": false
      },
      {
        "id": "tc_323_2",
        "input": "[[], [['emit', 'missing']]]",
        "expectedOutput": "[[]]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_323_3",
        "input": "[[], [['on', 'msg', s => `Hello ${s}`], ['emit', 'msg', 'World']]]",
        "expectedOutput": "[null, ['Hello World']]",
        "isHidden": true
      }
    ],
    "solution": "function createEventEmitter() {\n  const events = new Map();\n  return {\n    on: (event, cb) => {\n      if (!events.has(event)) events.set(event, []);\n      events.get(event).push(cb);\n    },\n    emit: (event, ...args) => {\n      if (!events.has(event)) return [];\n      return events.get(event).map(cb => cb(...args));\n    },\n    off: (event, cb) => {\n      if (!events.has(event)) return;\n      events.set(event, events.get(event).filter(fn => fn !== cb));\n    }\n  };\n}",
    "explanation": "Store Map of event -> array of callbacks.",
    "timeComplexity": "O(1) on, O(k) emit/off",
    "spaceComplexity": "O(e + k)",
    "hints": [
      "Store callbacks in Map keyed by event name."
    ]
  },
  {
    "id": "JS-P324",
    "number": 324,
    "title": "Create Once Event Emitter",
    "slug": "js-p324-create-once-event-emitter",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Events",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Events"
    ],
    "tags": [
      "once",
      "emitter",
      "events"
    ],
    "expectedTime": "10 mins",
    "summary": "Event emitter where listeners registered with once() trigger only on the first emit.",
    "problemStatement": "Write a function `createOnceEmitter()` with:\n- `once(event, cb)`: registers listener that fires at most once\n- `emit(event, ...args)`: invokes listeners and unregisters once listeners",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['once', 'greet', () => 'hi'], ['emit', 'greet'], ['emit', 'greet']]]",
        "output": "[null, ['hi'], []]",
        "explanation": "Second emit has no active listeners."
      }
    ],
    "constraints": [
      "Listener is removed immediately after first emit."
    ],
    "starterCode": "function createOnceEmitter() {\n  // Write your solution here\n}",
    "functionName": "createOnceEmitter",
    "testCases": [
      {
        "id": "tc_324_1",
        "input": "[[], [['once', 'greet', () => 'hi'], ['emit', 'greet'], ['emit', 'greet']]]",
        "expectedOutput": "[null, ['hi'], []]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_324_2",
        "input": "[[], [['emit', 'empty']]]",
        "expectedOutput": "[[]]",
        "isHidden": true
      }
    ],
    "solution": "function createOnceEmitter() {\n  const events = new Map();\n  return {\n    once: (event, cb) => {\n      if (!events.has(event)) events.set(event, []);\n      events.get(event).push(cb);\n    },\n    emit: (event, ...args) => {\n      if (!events.has(event)) return [];\n      const list = events.get(event);\n      events.delete(event);\n      return list.map(cb => cb(...args));\n    }\n  };\n}",
    "explanation": "Clear event callbacks from Map upon emit.",
    "timeComplexity": "O(1) once, O(k) emit",
    "spaceComplexity": "O(k)",
    "hints": [
      "Delete callbacks upon emitting."
    ]
  },
  {
    "id": "JS-P325",
    "number": 325,
    "title": "Create Safe Invoker",
    "slug": "js-p325-create-safe-invoker",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Error Handling",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Error Handling"
    ],
    "tags": [
      "safeInvoker",
      "resilience",
      "closures"
    ],
    "expectedTime": "5 mins",
    "summary": "Wrap a function to return fallback on error up to maxErrors times.",
    "problemStatement": "Write a function `createSafeInvoker(fn, maxErrors, fallback)` that wraps `fn`. When `fn` throws, it increments error count and returns `fallback`. If error count exceeds `maxErrors`, it throws the error.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[() => { throw new Error('fail'); }, 2, 'safe', [[], [], []]]",
        "output": "['safe', 'safe', 'fail']",
        "explanation": "Throws on 3rd error."
      }
    ],
    "constraints": [
      "Throw original error once limit is exceeded."
    ],
    "starterCode": "function createSafeInvoker(fn, maxErrors, fallback) {\n  // Write your solution here\n}",
    "functionName": "createSafeInvoker",
    "testCases": [
      {
        "id": "tc_325_1",
        "input": "[x => { if (x < 0) throw new Error('neg'); return x; }, 1, 'fallback', [[5], [-1], [10]]]",
        "expectedOutput": "[5, 'fallback', 10]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_325_2",
        "input": "[x => x * 2, 0, 'bad', [[3]]]",
        "expectedOutput": "[6]",
        "isHidden": true
      }
    ],
    "solution": "function createSafeInvoker(fn, maxErrors, fallback) {\n  let errors = 0;\n  return function(...args) {\n    try {\n      return fn.apply(this, args);\n    } catch (err) {\n      errors++;\n      if (errors <= maxErrors) return fallback;\n      throw err;\n    }\n  };\n}",
    "explanation": "Count errors and rethrow if errors > maxErrors.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Catch error, if errors <= maxErrors return fallback else throw err."
    ]
  },
  {
    "id": "JS-P326",
    "number": 326,
    "title": "Create Lazy Evaluator",
    "slug": "js-p326-create-lazy-evaluator",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Optimization",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Lazy Evaluation"
    ],
    "tags": [
      "lazy",
      "closures",
      "optimization"
    ],
    "expectedTime": "5 mins",
    "summary": "Compute expensive factory() only on first call, cache result forever.",
    "problemStatement": "Write a function `createLazyValue(factory)` that returns a function. `factory()` is executed only on the first call; subsequent calls return the cached value without invoking `factory()` again.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[() => ({ id: Math.random() }), [[], []]]",
        "output": "same cached object",
        "explanation": "Returns identical cached object on second call."
      }
    ],
    "constraints": [
      "factory takes zero arguments."
    ],
    "starterCode": "function createLazyValue(factory) {\n  // Write your solution here\n}",
    "functionName": "createLazyValue",
    "testCases": [
      {
        "id": "tc_326_1",
        "input": "[(() => { let c = 0; return () => ++c; })(), [[], [], []]]",
        "expectedOutput": "[1, 1, 1]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_326_2",
        "input": "[() => 'static', [[]]]",
        "expectedOutput": "['static']",
        "isHidden": true
      }
    ],
    "solution": "function createLazyValue(factory) {\n  let evaluated = false;\n  let value;\n  return function() {\n    if (!evaluated) {\n      value = factory();\n      evaluated = true;\n    }\n    return value;\n  };\n}",
    "explanation": "Store evaluated boolean flag and value in closure.",
    "timeComplexity": "O(1) after first call",
    "spaceComplexity": "O(1)",
    "hints": [
      "If !evaluated, compute value = factory() and set evaluated = true."
    ]
  },
  {
    "id": "JS-P327",
    "number": 327,
    "title": "Create Auto-Increment Key Map",
    "slug": "js-p327-create-auto-increment-key-map",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "ID Mapping",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Map"
    ],
    "tags": [
      "autoIncrement",
      "map",
      "closures"
    ],
    "expectedTime": "5 mins",
    "summary": "Assign sequential IDs to unique keys, returning existing ID on repeats.",
    "problemStatement": "Write a function `createAutoIncrementMap(startId = 1)` returning an object with:\n- `getId(key)`: returns existing ID if `key` was seen; otherwise assigns next integer ID starting from `startId`\n- `size()`: returns number of unique keys registered",
    "examples": [
      {
        "title": "Example 1",
        "input": "[1, [['getId', 'apple'], ['getId', 'banana'], ['getId', 'apple'], ['size']]]",
        "output": "[1, 2, 1, 2]",
        "explanation": "Apple gets 1, banana gets 2, apple returns 1."
      }
    ],
    "constraints": [
      "startId is positive integer."
    ],
    "starterCode": "function createAutoIncrementMap(startId = 1) {\n  // Write your solution here\n}",
    "functionName": "createAutoIncrementMap",
    "testCases": [
      {
        "id": "tc_327_1",
        "input": "[1, [['getId', 'apple'], ['getId', 'banana'], ['getId', 'apple'], ['size']]]",
        "expectedOutput": "[1, 2, 1, 2]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_327_2",
        "input": "[100, [['getId', 'x'], ['getId', 'y']]]",
        "expectedOutput": "[100, 101]",
        "isHidden": true
      }
    ],
    "solution": "function createAutoIncrementMap(startId = 1) {\n  const map = new Map();\n  let nextId = startId;\n  return {\n    getId: (key) => {\n      if (!map.has(key)) {\n        map.set(key, nextId++);\n      }\n      return map.get(key);\n    },\n    size: () => map.size\n  };\n}",
    "explanation": "Check Map.has(key); if not present, map.set(key, nextId++).",
    "timeComplexity": "O(1) amortized",
    "spaceComplexity": "O(k)",
    "hints": [
      "Use Map in closure with nextId counter."
    ]
  },
  {
    "id": "JS-P328",
    "number": 328,
    "title": "Create Priority Queue",
    "slug": "js-p328-create-priority-queue",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Data Structures",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Priority Queue",
      "Data Structures"
    ],
    "tags": [
      "priorityQueue",
      "dataStructures",
      "closures"
    ],
    "expectedTime": "10 mins",
    "summary": "Priority queue where items with lower numeric priority value are dequeued first.",
    "problemStatement": "Write a function `createPriorityQueue()` returning an object with:\n- `enqueue(val, priority)`: inserts item with given numeric priority\n- `dequeue()`: removes and returns value of highest priority (smallest priority number). If tie, FIFO.\n- `peek()`: returns value of highest priority without removing\n- `size()`: returns current item count",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['enqueue', 'low', 10], ['enqueue', 'high', 1], ['dequeue']]]",
        "output": "[null, null, 'high']",
        "explanation": "Priority 1 dequeued before 10."
      }
    ],
    "constraints": [
      "Smallest priority number = highest priority."
    ],
    "starterCode": "function createPriorityQueue() {\n  // Write your solution here\n}",
    "functionName": "createPriorityQueue",
    "testCases": [
      {
        "id": "tc_328_1",
        "input": "[[], [['enqueue', 'low', 10], ['enqueue', 'high', 1], ['dequeue']]]",
        "expectedOutput": "[null, null, 'high']",
        "isHidden": false
      },
      {
        "id": "tc_328_2",
        "input": "[[], [['enqueue', 'a', 1], ['enqueue', 'b', 1], ['dequeue'], ['dequeue']]]",
        "expectedOutput": "[null, null, 'a', 'b']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_328_3",
        "input": "[[], [['dequeue']]]",
        "expectedOutput": "[null]",
        "isHidden": true
      }
    ],
    "solution": "function createPriorityQueue() {\n  const queue = [];\n  return {\n    enqueue: (val, priority) => {\n      queue.push({ val, priority });\n      queue.sort((a, b) => a.priority - b.priority);\n    },\n    dequeue: () => (queue.length > 0 ? queue.shift().val : undefined),\n    peek: () => (queue.length > 0 ? queue[0].val : undefined),\n    size: () => queue.length\n  };\n}",
    "explanation": "Store { val, priority } entries sorted by priority.",
    "timeComplexity": "O(n log n) enqueue, O(1) dequeue",
    "spaceComplexity": "O(n)",
    "hints": [
      "Sort queue by priority on insertion."
    ]
  },
  {
    "id": "JS-P329",
    "number": 329,
    "title": "Create Middleware Pipeline",
    "slug": "js-p329-create-middleware-pipeline",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Pipeline",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Middleware",
      "Pipeline"
    ],
    "tags": [
      "middleware",
      "pipeline",
      "closures"
    ],
    "expectedTime": "10 mins",
    "summary": "Register middleware functions and execute input through them in order.",
    "problemStatement": "Write a function `createPipeline()` with:\n- `use(fn)`: registers a middleware function `(val) => nextVal`\n- `execute(input)`: passes `input` sequentially through all registered middlewares and returns final result",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['use', x => x + 1], ['use', x => x * 2], ['execute', 5]]]",
        "output": "[null, null, 12]",
        "explanation": "(5 + 1) * 2 = 12."
      }
    ],
    "constraints": [
      "Returns input unchanged if no middlewares."
    ],
    "starterCode": "function createPipeline() {\n  // Write your solution here\n}",
    "functionName": "createPipeline",
    "testCases": [
      {
        "id": "tc_329_1",
        "input": "[[], [['use', x => x + 1], ['use', x => x * 2], ['execute', 5]]]",
        "expectedOutput": "[null, null, 12]",
        "isHidden": false
      },
      {
        "id": "tc_329_2",
        "input": "[[], [['execute', 42]]]",
        "expectedOutput": "[42]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_329_3",
        "input": "[[], [['use', s => s.toUpperCase()], ['execute', 'hi']]]",
        "expectedOutput": "[null, 'HI']",
        "isHidden": true
      }
    ],
    "solution": "function createPipeline() {\n  const middlewares = [];\n  return {\n    use: (fn) => { middlewares.push(fn); },\n    execute: (input) => middlewares.reduce((acc, fn) => fn(acc), input)\n  };\n}",
    "explanation": "Reduce middlewares starting from input.",
    "timeComplexity": "O(m) where m is middleware count",
    "spaceComplexity": "O(m)",
    "hints": [
      "Use middlewares.reduce((acc, fn) => fn(acc), input)."
    ]
  },
  {
    "id": "JS-P330",
    "number": 330,
    "title": "Create Scoped Context Registry",
    "slug": "js-p330-create-scoped-context-registry",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Scope Management",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Scope Hierarchy"
    ],
    "tags": [
      "scope",
      "context",
      "closures"
    ],
    "expectedTime": "10 mins",
    "summary": "Nested lexical scope stack supporting set, get, enterScope, and exitScope.",
    "problemStatement": "Write a function `createScopedContext()` returning an object with:\n- `set(k, v)`: sets variable in current innermost scope\n- `get(k)`: looks up `k` starting from innermost scope outwards; returns `undefined` if not found\n- `enterScope()`: pushes a new child scope\n- `exitScope()`: pops innermost scope (cannot pop root scope)",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['set', 'a', 1], ['enterScope'], ['set', 'a', 2], ['get', 'a'], ['exitScope'], ['get', 'a']]]",
        "output": "[null, null, null, 2, null, 1]",
        "explanation": "Inner scope shadows outer scope."
      }
    ],
    "constraints": [
      "Root scope is never popped."
    ],
    "starterCode": "function createScopedContext() {\n  // Write your solution here\n}",
    "functionName": "createScopedContext",
    "testCases": [
      {
        "id": "tc_330_1",
        "input": "[[], [['set', 'a', 1], ['enterScope'], ['set', 'a', 2], ['get', 'a'], ['exitScope'], ['get', 'a']]]",
        "expectedOutput": "[null, null, null, 2, null, 1]",
        "isHidden": false
      },
      {
        "id": "tc_330_2",
        "input": "[[], [['get', 'unset']]]",
        "expectedOutput": "[null]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_330_3",
        "input": "[[], [['set', 'x', 10], ['enterScope'], ['get', 'x']]]",
        "expectedOutput": "[null, null, 10]",
        "isHidden": true
      }
    ],
    "solution": "function createScopedContext() {\n  const scopes = [new Map()];\n  return {\n    set: (k, v) => {\n      scopes[scopes.length - 1].set(k, v);\n    },\n    get: (k) => {\n      for (let i = scopes.length - 1; i >= 0; i--) {\n        if (scopes[i].has(k)) return scopes[i].get(k);\n      }\n      return undefined;\n    },\n    enterScope: () => { scopes.push(new Map()); },\n    exitScope: () => {\n      if (scopes.length > 1) scopes.pop();\n    }\n  };\n}",
    "explanation": "Array of Maps representing lexical scope chain; traverse from back to front.",
    "timeComplexity": "O(1) set, O(d) get where d is depth",
    "spaceComplexity": "O(vars)",
    "hints": [
      "Iterate backwards through scopes array for get(k)."
    ]
  },
  {
    "id": "JS-P331",
    "number": 331,
    "title": "Create Object Diff Tracker",
    "slug": "js-p331-create-object-diff-tracker",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "State Tracking",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Objects",
      "Diff"
    ],
    "tags": [
      "diff",
      "tracker",
      "closures"
    ],
    "expectedTime": "10 mins",
    "summary": "Track modified properties relative to initial object state.",
    "problemStatement": "Write a function `createDiffTracker(initialObj)` returning an object with:\n- `update(partial)`: merges `partial` into current object\n- `getChanges()`: returns an object containing only properties whose values differ from `initialObj`\n- `reset()`: reverts to initialObj state",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[{ a: 1, b: 2 }], [['update', { a: 99 }], ['getChanges'], ['reset'], ['getChanges']]]",
        "output": "[null, {\"a\":99}, null, {}]",
        "explanation": "Detects changed key 'a'."
      }
    ],
    "constraints": [
      "Shallow comparison for property values."
    ],
    "starterCode": "function createDiffTracker(initialObj) {\n  // Write your solution here\n}",
    "functionName": "createDiffTracker",
    "testCases": [
      {
        "id": "tc_331_1",
        "input": "[[{ a: 1, b: 2 }], [['update', { a: 99 }], ['getChanges'], ['reset'], ['getChanges']]]",
        "expectedOutput": "[null, {\"a\":99}, null, {}]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_331_2",
        "input": "[[{ x: 10 }], [['getChanges']]]",
        "expectedOutput": "[{}]",
        "isHidden": true
      }
    ],
    "solution": "function createDiffTracker(initialObj) {\n  const base = { ...initialObj };\n  let current = { ...initialObj };\n  return {\n    update: (partial) => { Object.assign(current, partial); },\n    getChanges: () => {\n      const diff = {};\n      for (const k of Object.keys(current)) {\n        if (current[k] !== base[k]) diff[k] = current[k];\n      }\n      return diff;\n    },\n    reset: () => { current = { ...base }; }\n  };\n}",
    "explanation": "Store base copy and current state; compare keys in getChanges.",
    "timeComplexity": "O(k)",
    "spaceComplexity": "O(k)",
    "hints": [
      "Compare current[k] !== base[k]."
    ]
  },
  {
    "id": "JS-P332",
    "number": 332,
    "title": "Create Token Bucket Limiter",
    "slug": "js-p332-create-token-bucket-limiter",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Rate Limiting",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Token Bucket",
      "Rate Limiting"
    ],
    "tags": [
      "tokenBucket",
      "rateLimiter",
      "closures"
    ],
    "expectedTime": "10 mins",
    "summary": "Simulate token bucket rate limiter with consume and refill operations.",
    "problemStatement": "Write a function `createTokenBucket(capacity)` returning an object with:\n- `consume(tokens)`: if available tokens >= `tokens`, deducts and returns `true`; else returns `false`\n- `refill(tokens)`: adds `tokens` up to `capacity`, returns current token count\n- `getTokens()`: returns current available tokens",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[10], [['consume', 4], ['consume', 7], ['refill', 5], ['consume', 7]]]",
        "output": "[true, false, 10, true]",
        "explanation": "10 - 4 = 6; 7 > 6 fails; refill to 10; 10 - 7 = 3 succeeds."
      }
    ],
    "constraints": [
      "Starts full with tokens === capacity."
    ],
    "starterCode": "function createTokenBucket(capacity) {\n  // Write your solution here\n}",
    "functionName": "createTokenBucket",
    "testCases": [
      {
        "id": "tc_332_1",
        "input": "[[10], [['consume', 4], ['consume', 7], ['refill', 5], ['consume', 7]]]",
        "expectedOutput": "[true, false, 10, true]",
        "isHidden": false
      },
      {
        "id": "tc_332_2",
        "input": "[[5], [['getTokens'], ['consume', 5], ['getTokens']]]",
        "expectedOutput": "[5, true, 0]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_332_3",
        "input": "[[5], [['consume', 6]]]",
        "expectedOutput": "[false]",
        "isHidden": true
      }
    ],
    "solution": "function createTokenBucket(capacity) {\n  let tokens = capacity;\n  return {\n    consume: (count) => {\n      if (tokens >= count) {\n        tokens -= count;\n        return true;\n      }\n      return false;\n    },\n    refill: (count) => {\n      tokens = Math.min(capacity, tokens + count);\n      return tokens;\n    },\n    getTokens: () => tokens\n  };\n}",
    "explanation": "Maintain tokens <= capacity in closure.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "tokens = Math.min(capacity, tokens + count)."
    ]
  },
  {
    "id": "JS-P333",
    "number": 333,
    "title": "Create Sequential Step Runner",
    "slug": "js-p333-create-sequential-step-runner",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Flow Control",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Step Runner"
    ],
    "tags": [
      "stepRunner",
      "workflow",
      "closures"
    ],
    "expectedTime": "5 mins",
    "summary": "Execute an array of step functions one at a time on next().",
    "problemStatement": "Write a function `createStepRunner(steps)` with:\n- `next(input)`: invokes current step function with `input`, advances step pointer, returns result. If all steps completed, returns `undefined`\n- `hasMore()`: returns `true` if more steps remain\n- `reset()`: resets pointer to step 0",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[[x => x + 1, x => x * 2]], [['next', 5], ['next', 10], ['hasMore']]]",
        "output": "[6, 20, false]",
        "explanation": "Runs step 1 (5+1), then step 2 (10*2)."
      }
    ],
    "constraints": [
      "steps is array of functions."
    ],
    "starterCode": "function createStepRunner(steps) {\n  // Write your solution here\n}",
    "functionName": "createStepRunner",
    "testCases": [
      {
        "id": "tc_333_1",
        "input": "[[[x => x + 1, x => x * 2]], [['next', 5], ['next', 10], ['hasMore']]]",
        "expectedOutput": "[6, 20, false]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_333_2",
        "input": "[[[]], [['hasMore'], ['next', 1]]]",
        "expectedOutput": "[false, null]",
        "isHidden": true
      }
    ],
    "solution": "function createStepRunner(steps) {\n  let idx = 0;\n  return {\n    next: (input) => {\n      if (idx < steps.length) {\n        return steps[idx++](input);\n      }\n      return undefined;\n    },\n    hasMore: () => idx < steps.length,\n    reset: () => { idx = 0; }\n  };\n}",
    "explanation": "Increment idx pointer on each next call.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Execute steps[idx++] and check idx < steps.length."
    ]
  },
  {
    "id": "JS-P334",
    "number": 334,
    "title": "Create Replay Subject",
    "slug": "js-p334-create-replay-subject",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Observer Pattern",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "ReplaySubject",
      "RxJS Pattern"
    ],
    "tags": [
      "replaySubject",
      "observer",
      "closures"
    ],
    "expectedTime": "10 mins",
    "summary": "Replay buffer of past N events to new subscribers.",
    "problemStatement": "Write a function `createReplaySubject(bufferSize = 2)` with:\n- `next(val)`: emits `val` to active subscribers and buffers it (keeping at most `bufferSize` recent items)\n- `subscribe(fn)`: registers `fn` and immediately replays buffered items to it. Returns array of recorded values.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[2], [['next', 'a'], ['next', 'b'], ['next', 'c'], ['getBuffer']]]",
        "output": "[null, null, null, ['b', 'c']]",
        "explanation": "Buffers 2 most recent values."
      }
    ],
    "constraints": [
      "Buffer size >= 1."
    ],
    "starterCode": "function createReplaySubject(bufferSize = 2) {\n  // Write your solution here\n}",
    "functionName": "createReplaySubject",
    "testCases": [
      {
        "id": "tc_334_1",
        "input": "[[2], [['next', 'a'], ['next', 'b'], ['next', 'c'], ['getBuffer']]]",
        "expectedOutput": "[null, null, null, ['b', 'c']]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_334_2",
        "input": "[[1], [['next', 10], ['getBuffer']]]",
        "expectedOutput": "[null, [10]]",
        "isHidden": true
      }
    ],
    "solution": "function createReplaySubject(bufferSize = 2) {\n  const buffer = [];\n  const subscribers = new Set();\n  return {\n    next: (val) => {\n      buffer.push(val);\n      if (buffer.length > bufferSize) buffer.shift();\n      subscribers.forEach(fn => fn(val));\n    },\n    subscribe: (fn) => {\n      subscribers.add(fn);\n      buffer.forEach(val => fn(val));\n      return () => subscribers.delete(fn);\n    },\n    getBuffer: () => buffer.slice()\n  };\n}",
    "explanation": "Keep at most bufferSize items in buffer. Replay to new subscribers.",
    "timeComplexity": "O(1) next, O(b) subscribe",
    "spaceComplexity": "O(bufferSize)",
    "hints": [
      "Replay buffered items when subscribe is called."
    ]
  },
  {
    "id": "JS-P335",
    "number": 335,
    "title": "Create In-Memory KV Store with Simulated TTL",
    "slug": "js-p335-create-in-memory-kv-store-with-simulated-ttl",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Caching",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "TTL",
      "Caching"
    ],
    "tags": [
      "ttl",
      "cache",
      "store"
    ],
    "expectedTime": "10 mins",
    "summary": "Store key-value pairs with expiration timestamp.",
    "problemStatement": "Write a function `createTTLStore()` with:\n- `set(key, val, ttlMs, now = 0)`: sets value to expire at `now + ttlMs`\n- `get(key, now = 0)`: returns value if `now < expiry`; otherwise returns `null` and deletes key\n- `size(now = 0)`: returns count of non-expired keys at timestamp `now`",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['set', 'token', 'abc', 100, 0], ['get', 'token', 50], ['get', 'token', 150]]]",
        "output": "[null, 'abc', null]",
        "explanation": "Expires after 100ms."
      }
    ],
    "constraints": [
      "now is an integer timestamp."
    ],
    "starterCode": "function createTTLStore() {\n  // Write your solution here\n}",
    "functionName": "createTTLStore",
    "testCases": [
      {
        "id": "tc_335_1",
        "input": "[[], [['set', 'token', 'abc', 100, 0], ['get', 'token', 50], ['get', 'token', 150]]]",
        "expectedOutput": "[null, 'abc', null]",
        "isHidden": false
      },
      {
        "id": "tc_335_2",
        "input": "[[], [['set', 'a', 1, 50, 0], ['size', 20], ['size', 60]]]",
        "expectedOutput": "[null, 1, 0]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_335_3",
        "input": "[[], [['get', 'none', 0]]]",
        "expectedOutput": "[null]",
        "isHidden": true
      }
    ],
    "solution": "function createTTLStore() {\n  const store = new Map();\n  return {\n    set: (key, val, ttlMs, now = 0) => {\n      store.set(key, { val, expiry: now + ttlMs });\n    },\n    get: (key, now = 0) => {\n      if (!store.has(key)) return null;\n      const item = store.get(key);\n      if (now >= item.expiry) {\n        store.delete(key);\n        return null;\n      }\n      return item.val;\n    },\n    size: (now = 0) => {\n      let count = 0;\n      for (const [k, v] of store.entries()) {\n        if (now < v.expiry) count++;\n        else store.delete(k);\n      }\n      return count;\n    }\n  };\n}",
    "explanation": "Store { val, expiry } and verify now < expiry on read.",
    "timeComplexity": "O(1) get/set",
    "spaceComplexity": "O(k)",
    "hints": [
      "Check now >= item.expiry."
    ]
  },
  {
    "id": "JS-P336",
    "number": 336,
    "title": "Create Transaction Manager",
    "slug": "js-p336-create-transaction-manager",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Transactions",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Transactions"
    ],
    "tags": [
      "transactions",
      "commit",
      "rollback"
    ],
    "expectedTime": "10 mins",
    "summary": "Support begin, set, commit, and rollback for key-value state.",
    "problemStatement": "Write a function `createTransactionManager()` with:\n- `set(k, v)`: updates key in active transaction or root\n- `get(k)`: returns current value of key\n- `begin()`: starts a new nested transaction\n- `commit()`: applies transaction changes to parent level\n- `rollback()`: discards active transaction changes",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['set', 'a', 1], ['begin'], ['set', 'a', 2], ['get', 'a'], ['rollback'], ['get', 'a']]]",
        "output": "[null, null, null, 2, null, 1]",
        "explanation": "Rollback restores 'a' to 1."
      }
    ],
    "constraints": [
      "Support nested transactions."
    ],
    "starterCode": "function createTransactionManager() {\n  // Write your solution here\n}",
    "functionName": "createTransactionManager",
    "testCases": [
      {
        "id": "tc_336_1",
        "input": "[[], [['set', 'a', 1], ['begin'], ['set', 'a', 2], ['get', 'a'], ['rollback'], ['get', 'a']]]",
        "expectedOutput": "[null, null, null, 2, null, 1]",
        "isHidden": false
      },
      {
        "id": "tc_336_2",
        "input": "[[], [['begin'], ['set', 'x', 10], ['commit'], ['get', 'x']]]",
        "expectedOutput": "[null, null, null, 10]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_336_3",
        "input": "[[], [['rollback'], ['get', 'a']]]",
        "expectedOutput": "[null, null]",
        "isHidden": true
      }
    ],
    "solution": "function createTransactionManager() {\n  const stack = [new Map()];\n  return {\n    set: (k, v) => {\n      stack[stack.length - 1].set(k, v);\n    },\n    get: (k) => {\n      for (let i = stack.length - 1; i >= 0; i--) {\n        if (stack[i].has(k)) return stack[i].get(k);\n      }\n      return undefined;\n    },\n    begin: () => { stack.push(new Map()); },\n    commit: () => {\n      if (stack.length > 1) {\n        const top = stack.pop();\n        for (const [k, v] of top.entries()) {\n          stack[stack.length - 1].set(k, v);\n        }\n      }\n    },\n    rollback: () => {\n      if (stack.length > 1) stack.pop();\n    }\n  };\n}",
    "explanation": "Stack of Maps; commit merges top Map into parent; rollback pops top Map.",
    "timeComplexity": "O(1) begin/rollback, O(k) commit",
    "spaceComplexity": "O(v)",
    "hints": [
      "Use stack of Maps, commit merges into parent Map."
    ]
  },
  {
    "id": "JS-P337",
    "number": 337,
    "title": "Create Action Dispatcher",
    "slug": "js-p337-create-action-dispatcher",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Patterns",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Dispatch"
    ],
    "tags": [
      "dispatcher",
      "action",
      "closures"
    ],
    "expectedTime": "5 mins",
    "summary": "Register action handlers and dispatch actions by type.",
    "problemStatement": "Write a function `createActionDispatcher()` with:\n- `register(type, handler)`: registers handler function for action type\n- `dispatch(action)`: calls registered handler for `action.type` passing `action.payload`. Returns result, or `null` if unregistered.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['register', 'ADD', p => p + 1], ['dispatch', { type: 'ADD', payload: 10 }]]]",
        "output": "[null, 11]",
        "explanation": "Calls ADD handler."
      }
    ],
    "constraints": [
      "Actions have format { type, payload }."
    ],
    "starterCode": "function createActionDispatcher() {\n  // Write your solution here\n}",
    "functionName": "createActionDispatcher",
    "testCases": [
      {
        "id": "tc_337_1",
        "input": "[[], [['register', 'ADD', p => p + 1], ['dispatch', { type: 'ADD', payload: 10 }]]]",
        "expectedOutput": "[null, 11]",
        "isHidden": false
      },
      {
        "id": "tc_337_2",
        "input": "[[], [['dispatch', { type: 'UNKNOWN' }]]]",
        "expectedOutput": "[null]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_337_3",
        "input": "[[], [['register', 'UPPER', s => s.toUpperCase()], ['dispatch', { type: 'UPPER', payload: 'test' }]]]",
        "expectedOutput": "[null, 'TEST']",
        "isHidden": true
      }
    ],
    "solution": "function createActionDispatcher() {\n  const handlers = new Map();\n  return {\n    register: (type, handler) => { handlers.set(type, handler); },\n    dispatch: (action) => {\n      const handler = handlers.get(action.type);\n      return handler ? handler(action.payload) : null;\n    }\n  };\n}",
    "explanation": "Store handlers in Map keyed by type.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(h)",
    "hints": [
      "handlers.get(action.type) and call with action.payload."
    ]
  },
  {
    "id": "JS-P338",
    "number": 338,
    "title": "Create Batch Collector",
    "slug": "js-p338-create-batch-collector",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Batching",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Batching"
    ],
    "tags": [
      "batch",
      "collector",
      "closures"
    ],
    "expectedTime": "5 mins",
    "summary": "Collect items until batch size is reached or flushed manually.",
    "problemStatement": "Write a function `createBatchCollector(batchSize)` with:\n- `add(item)`: adds item to current batch. Returns true if batch is now full, else false\n- `isFull()`: returns true if current batch count === batchSize\n- `flush()`: returns array of collected items and resets batch to empty",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[2], [['add', 'a'], ['add', 'b'], ['flush']]]",
        "output": "[false, true, ['a', 'b']]",
        "explanation": "Flushes full batch."
      }
    ],
    "constraints": [
      "batchSize >= 1."
    ],
    "starterCode": "function createBatchCollector(batchSize) {\n  // Write your solution here\n}",
    "functionName": "createBatchCollector",
    "testCases": [
      {
        "id": "tc_338_1",
        "input": "[[2], [['add', 'a'], ['add', 'b'], ['flush']]]",
        "expectedOutput": "[false, true, ['a', 'b']]",
        "isHidden": false
      },
      {
        "id": "tc_338_2",
        "input": "[[3], [['flush']]]",
        "expectedOutput": "[[]]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_338_3",
        "input": "[[1], [['add', 42], ['isFull']]]",
        "expectedOutput": "[true, true]",
        "isHidden": true
      }
    ],
    "solution": "function createBatchCollector(batchSize) {\n  let batch = [];\n  return {\n    add: (item) => {\n      batch.push(item);\n      return batch.length >= batchSize;\n    },\n    isFull: () => batch.length >= batchSize,\n    flush: () => {\n      const items = batch;\n      batch = [];\n      return items;\n    }\n  };\n}",
    "explanation": "Store items in batch array; reset on flush.",
    "timeComplexity": "O(1) all operations",
    "spaceComplexity": "O(batchSize)",
    "hints": [
      "Reset batch to [] on flush."
    ]
  },
  {
    "id": "JS-P339",
    "number": 339,
    "title": "Create Polling Simulator",
    "slug": "js-p339-create-polling-simulator",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Mocking",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Mocking"
    ],
    "tags": [
      "poller",
      "mocking",
      "closures"
    ],
    "expectedTime": "5 mins",
    "summary": "Simulate polling responses from an array, repeating last response when exhausted.",
    "problemStatement": "Write a function `createPoller(responses)` that returns a function `poll()`. It returns responses in sequential order; once the end is reached, it keeps returning the last response.",
    "examples": [
      {
        "title": "Example 1",
        "input": "[['pending', 'done'], [[], [], []]]",
        "output": "['pending', 'done', 'done']",
        "explanation": "Repeats 'done' when exhausted."
      }
    ],
    "constraints": [
      "responses is non-empty."
    ],
    "starterCode": "function createPoller(responses) {\n  // Write your solution here\n}",
    "functionName": "createPoller",
    "testCases": [
      {
        "id": "tc_339_1",
        "input": "[['pending', 'done'], [[], [], []]]",
        "expectedOutput": "['pending', 'done', 'done']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_339_2",
        "input": "[[42], [[], []]]",
        "expectedOutput": "[42, 42]",
        "isHidden": true
      }
    ],
    "solution": "function createPoller(responses) {\n  let idx = 0;\n  return function() {\n    const res = responses[Math.min(idx, responses.length - 1)];\n    idx++;\n    return res;\n  };\n}",
    "explanation": "Use Math.min(idx, responses.length - 1) to clamp to last response.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Clamp index with Math.min."
    ]
  },
  {
    "id": "JS-P340",
    "number": 340,
    "title": "Create Debounced State",
    "slug": "js-p340-create-debounced-state",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "State",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "State"
    ],
    "tags": [
      "state",
      "staging",
      "closures"
    ],
    "expectedTime": "5 mins",
    "summary": "Hold pending state changes until commit() is called.",
    "problemStatement": "Write a function `createDebounceState(initial)` with:\n- `setPending(val)`: stages `val` without updating current\n- `commit()`: applies pending value to current. Returns new current\n- `get()`: returns current committed value\n- `getPending()`: returns staged pending value",
    "examples": [
      {
        "title": "Example 1",
        "input": "['A', [['setPending', 'B'], ['get'], ['commit'], ['get']]]",
        "output": "[null, 'A', 'B', 'B']",
        "explanation": "Only updates upon commit."
      }
    ],
    "constraints": [
      "Initial pending equals initial."
    ],
    "starterCode": "function createDebounceState(initial) {\n  // Write your solution here\n}",
    "functionName": "createDebounceState",
    "testCases": [
      {
        "id": "tc_340_1",
        "input": "['A', [['setPending', 'B'], ['get'], ['commit'], ['get']]]",
        "expectedOutput": "[null, 'A', 'B', 'B']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_340_2",
        "input": "[0, [['getPending']]]",
        "expectedOutput": "[0]",
        "isHidden": true
      }
    ],
    "solution": "function createDebounceState(initial) {\n  let current = initial;\n  let pending = initial;\n  return {\n    setPending: (val) => { pending = val; },\n    commit: () => {\n      current = pending;\n      return current;\n    },\n    get: () => current,\n    getPending: () => pending\n  };\n}",
    "explanation": "Store current and pending variables in closure.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "current = pending on commit()."
    ]
  },
  {
    "id": "JS-P341",
    "number": 341,
    "title": "Create Mutex Lock Mechanism",
    "slug": "js-p341-create-mutex-lock-mechanism",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Concurrency Control",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Mutex",
      "Concurrency"
    ],
    "tags": [
      "lock",
      "mutex",
      "closures"
    ],
    "expectedTime": "5 mins",
    "summary": "Synchronous binary mutex supporting acquire, release, and isLocked.",
    "problemStatement": "Write a function `createLock()` with:\n- `acquire()`: if unlocked, sets locked and returns `true`; if already locked, returns `false`\n- `release()`: unlocks and returns `true`\n- `isLocked()`: returns current lock boolean state",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['acquire'], ['acquire'], ['release'], ['acquire']]]",
        "output": "[true, false, true, true]",
        "explanation": "Second acquire fails until release."
      }
    ],
    "constraints": [
      "Starts unlocked."
    ],
    "starterCode": "function createLock() {\n  // Write your solution here\n}",
    "functionName": "createLock",
    "testCases": [
      {
        "id": "tc_341_1",
        "input": "[[], [['acquire'], ['acquire'], ['release'], ['acquire']]]",
        "expectedOutput": "[true, false, true, true]",
        "isHidden": false
      },
      {
        "id": "tc_341_2",
        "input": "[[], [['isLocked'], ['release']]]",
        "expectedOutput": "[false, true]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_341_3",
        "input": "[[], [['acquire'], ['isLocked']]]",
        "expectedOutput": "[true, true]",
        "isHidden": true
      }
    ],
    "solution": "function createLock() {\n  let locked = false;\n  return {\n    acquire: () => {\n      if (locked) return false;\n      locked = true;\n      return true;\n    },\n    release: () => {\n      locked = false;\n      return true;\n    },\n    isLocked: () => locked\n  };\n}",
    "explanation": "Boolean flag representing mutex state.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "hints": [
      "Return false if locked is already true."
    ]
  },
  {
    "id": "JS-P342",
    "number": 342,
    "title": "Create Indexed Object Store",
    "slug": "js-p342-create-indexed-object-store",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Storage",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Indexing",
      "Storage"
    ],
    "tags": [
      "indexedStore",
      "database",
      "closures"
    ],
    "expectedTime": "10 mins",
    "summary": "In-memory database indexed by primary key property.",
    "problemStatement": "Write a function `createIndexedStore(keyProp = 'id')` with:\n- `insert(item)`: inserts item indexed by `item[keyProp]`. Returns item\n- `findById(id)`: returns item or `null`\n- `remove(id)`: deletes item, returns true if deleted, else false\n- `getAll()`: returns array of all items",
    "examples": [
      {
        "title": "Example 1",
        "input": "['id', [['insert', { id: 1, name: 'Alice' }], ['findById', 1], ['remove', 1], ['findById', 1]]]",
        "output": "[{\"id\":1,\"name\":\"Alice\"}, {\"id\":1,\"name\":\"Alice\"}, true, null]",
        "explanation": "Indexed storage by id."
      }
    ],
    "constraints": [
      "keyProp is string."
    ],
    "starterCode": "function createIndexedStore(keyProp = 'id') {\n  // Write your solution here\n}",
    "functionName": "createIndexedStore",
    "testCases": [
      {
        "id": "tc_342_1",
        "input": "['id', [['insert', { id: 1, name: 'Alice' }], ['findById', 1], ['remove', 1], ['findById', 1]]]",
        "expectedOutput": "[{\"id\":1,\"name\":\"Alice\"}, {\"id\":1,\"name\":\"Alice\"}, true, null]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_342_2",
        "input": "['key', [['getAll']]]",
        "expectedOutput": "[[]]",
        "isHidden": true
      }
    ],
    "solution": "function createIndexedStore(keyProp = 'id') {\n  const store = new Map();\n  return {\n    insert: (item) => {\n      store.set(item[keyProp], item);\n      return item;\n    },\n    findById: (id) => (store.has(id) ? store.get(id) : null),\n    remove: (id) => store.delete(id),\n    getAll: () => Array.from(store.values())\n  };\n}",
    "explanation": "Store items in Map keyed by item[keyProp].",
    "timeComplexity": "O(1) insert/find/remove",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use Map keyed by item[keyProp]."
    ]
  },
  {
    "id": "JS-P343",
    "number": 343,
    "title": "Create Snapshot Manager",
    "slug": "js-p343-create-snapshot-manager",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Snapshots",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Snapshots",
      "State"
    ],
    "tags": [
      "snapshot",
      "restore",
      "closures"
    ],
    "expectedTime": "10 mins",
    "summary": "Take and restore named snapshots of state.",
    "problemStatement": "Write a function `createSnapshotManager(init)` with:\n- `set(val)`: updates current state\n- `takeSnapshot(name)`: saves current state under `name`\n- `restore(name)`: restores state from snapshot `name` if exists, returns state; otherwise returns `null`\n- `get()`: returns current state",
    "examples": [
      {
        "title": "Example 1",
        "input": "[10, [['takeSnapshot', 's1'], ['set', 20], ['get'], ['restore', 's1'], ['get']]]",
        "output": "[null, null, 20, 10, 10]",
        "explanation": "Restores snapshot 's1'."
      }
    ],
    "constraints": [
      "Snapshots are deep cloned."
    ],
    "starterCode": "function createSnapshotManager(init) {\n  // Write your solution here\n}",
    "functionName": "createSnapshotManager",
    "testCases": [
      {
        "id": "tc_343_1",
        "input": "[10, [['takeSnapshot', 's1'], ['set', 20], ['get'], ['restore', 's1'], ['get']]]",
        "expectedOutput": "[null, null, 20, 10, 10]",
        "isHidden": false
      },
      {
        "id": "tc_343_2",
        "input": "['a', [['restore', 'invalid']]]",
        "expectedOutput": "[null]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_343_3",
        "input": "[0, [['set', 5], ['get']]]",
        "expectedOutput": "[null, 5]",
        "isHidden": true
      }
    ],
    "solution": "function createSnapshotManager(init) {\n  let current = JSON.parse(JSON.stringify(init));\n  const snapshots = new Map();\n  return {\n    set: (val) => { current = JSON.parse(JSON.stringify(val)); },\n    takeSnapshot: (name) => { snapshots.set(name, JSON.parse(JSON.stringify(current))); },\n    restore: (name) => {\n      if (!snapshots.has(name)) return null;\n      current = JSON.parse(JSON.stringify(snapshots.get(name)));\n      return current;\n    },\n    get: () => JSON.parse(JSON.stringify(current))\n  };\n}",
    "explanation": "Store deep copies in Map and return restored copy.",
    "timeComplexity": "O(n) per snapshot",
    "spaceComplexity": "O(s * n)",
    "hints": [
      "Deep copy with JSON parse/stringify."
    ]
  },
  {
    "id": "JS-P344",
    "number": 344,
    "title": "Create Filtered Stream",
    "slug": "js-p344-create-filtered-stream",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Streams",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Filtering"
    ],
    "tags": [
      "stream",
      "filter",
      "closures"
    ],
    "expectedTime": "5 mins",
    "summary": "Collect only items satisfying a predicate into an internal stream.",
    "problemStatement": "Write a function `createFilteredStream(predicate)` with:\n- `push(item)`: adds item if `predicate(item)` is truthy, returns boolean whether accepted\n- `getValues()`: returns array of accepted items\n- `clear()`: clears accepted items",
    "examples": [
      {
        "title": "Example 1",
        "input": "[x => x % 2 === 0, [['push', 1], ['push', 2], ['push', 4], ['getValues']]]",
        "output": "[false, true, true, [2, 4]]",
        "explanation": "Only even numbers accepted."
      }
    ],
    "constraints": [
      "predicate returns boolean."
    ],
    "starterCode": "function createFilteredStream(predicate) {\n  // Write your solution here\n}",
    "functionName": "createFilteredStream",
    "testCases": [
      {
        "id": "tc_344_1",
        "input": "[x => x % 2 === 0, [['push', 1], ['push', 2], ['push', 4], ['getValues']]]",
        "expectedOutput": "[false, true, true, [2, 4]]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_344_2",
        "input": "[() => true, [['push', 42], ['clear'], ['getValues']]]",
        "expectedOutput": "[true, null, []]",
        "isHidden": true
      }
    ],
    "solution": "function createFilteredStream(predicate) {\n  let values = [];\n  return {\n    push: (item) => {\n      if (predicate(item)) {\n        values.push(item);\n        return true;\n      }\n      return false;\n    },\n    getValues: () => values.slice(),\n    clear: () => { values = []; }\n  };\n}",
    "explanation": "Filter incoming items using predicate before pushing.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(n)",
    "hints": [
      "Check predicate(item) before values.push."
    ]
  },
  {
    "id": "JS-P345",
    "number": 345,
    "title": "Create Dynamic Property Interceptor",
    "slug": "js-p345-create-dynamic-property-interceptor",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Interceptors",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Interceptors"
    ],
    "tags": [
      "interceptor",
      "properties",
      "closures"
    ],
    "expectedTime": "5 mins",
    "summary": "Intercept reads and writes with custom transformations.",
    "problemStatement": "Write a function `createPropertyInterceptor(getTransform, setTransform)` with:\n- `set(k, v)`: sets `k` to `setTransform(v)`\n- `get(k)`: returns `getTransform(storedVal)` (or `undefined` if key unset)",
    "examples": [
      {
        "title": "Example 1",
        "input": "[x => (x ? x.toUpperCase() : undefined), x => x.trim(), [['set', 'name', '  alice  '], ['get', 'name']]]",
        "output": "[null, 'ALICE']",
        "explanation": "Trims on set, uppercases on get."
      }
    ],
    "constraints": [
      "Transforms are functions."
    ],
    "starterCode": "function createPropertyInterceptor(getTransform, setTransform) {\n  // Write your solution here\n}",
    "functionName": "createPropertyInterceptor",
    "testCases": [
      {
        "id": "tc_345_1",
        "input": "[x => (x ? x.toUpperCase() : undefined), x => x.trim(), [['set', 'name', '  alice  '], ['get', 'name']]]",
        "expectedOutput": "[null, 'ALICE']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_345_2",
        "input": "[x => x, x => x, [['get', 'unset']]]",
        "expectedOutput": "[null]",
        "isHidden": true
      }
    ],
    "solution": "function createPropertyInterceptor(getTransform, setTransform) {\n  const store = new Map();\n  return {\n    set: (k, v) => {\n      store.set(k, setTransform(v));\n    },\n    get: (k) => {\n      if (!store.has(k)) return undefined;\n      return getTransform(store.get(k));\n    }\n  };\n}",
    "explanation": "Apply setTransform on write and getTransform on read.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(k)",
    "hints": [
      "Apply transforms inside get/set."
    ]
  },
  {
    "id": "JS-P346",
    "number": 346,
    "title": "Create Event History Logger",
    "slug": "js-p346-create-event-history-logger",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Logging",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Logging"
    ],
    "tags": [
      "logger",
      "events",
      "closures"
    ],
    "expectedTime": "5 mins",
    "summary": "Record events with payloads and retrieve logs per event type.",
    "problemStatement": "Write a function `createEventLogger()` with:\n- `log(event, payload)`: records event occurrence with payload\n- `getLogs(event)`: returns array of payloads for specified event\n- `count(event)`: returns number of times event was logged",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['log', 'click', { x: 10 }], ['log', 'click', { x: 20 }], ['count', 'click']]]",
        "output": "[null, null, 2]",
        "explanation": "Tracks 2 click events."
      }
    ],
    "constraints": [
      "Return empty array if no logs exist."
    ],
    "starterCode": "function createEventLogger() {\n  // Write your solution here\n}",
    "functionName": "createEventLogger",
    "testCases": [
      {
        "id": "tc_346_1",
        "input": "[[], [['log', 'click', { x: 10 }], ['log', 'click', { x: 20 }], ['count', 'click']]]",
        "expectedOutput": "[null, null, 2]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_346_2",
        "input": "[[], [['getLogs', 'empty'], ['count', 'empty']]]",
        "expectedOutput": "[[], 0]",
        "isHidden": true
      }
    ],
    "solution": "function createEventLogger() {\n  const logs = new Map();\n  return {\n    log: (event, payload) => {\n      if (!logs.has(event)) logs.set(event, []);\n      logs.get(event).push(payload);\n    },\n    getLogs: (event) => (logs.has(event) ? logs.get(event).slice() : []),\n    count: (event) => (logs.has(event) ? logs.get(event).length : 0)\n  };\n}",
    "explanation": "Map event -> array of payloads.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(l)",
    "hints": [
      "Use Map of event -> array."
    ]
  },
  {
    "id": "JS-P347",
    "number": 347,
    "title": "Create Windowed Moving Average",
    "slug": "js-p347-create-windowed-moving-average",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Sliding Window",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Sliding Window",
      "Math"
    ],
    "tags": [
      "movingAverage",
      "slidingWindow",
      "closures"
    ],
    "expectedTime": "5 mins",
    "summary": "Compute moving average of the last N added numbers.",
    "problemStatement": "Write a function `createMovingAverage(size)` with:\n- `add(val)`: adds `val` to window, evicting oldest if count > size. Returns new average\n- `getAverage()`: returns current window average (0 if empty)",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[3], [['add', 1], ['add', 2], ['add', 3], ['add', 4]]]",
        "output": "[1, 1.5, 2, 3]",
        "explanation": "(2 + 3 + 4) / 3 = 3."
      }
    ],
    "constraints": [
      "size >= 1."
    ],
    "starterCode": "function createMovingAverage(size) {\n  // Write your solution here\n}",
    "functionName": "createMovingAverage",
    "testCases": [
      {
        "id": "tc_347_1",
        "input": "[[3], [['add', 1], ['add', 2], ['add', 3], ['add', 4]]]",
        "expectedOutput": "[1, 1.5, 2, 3]",
        "isHidden": false
      },
      {
        "id": "tc_347_2",
        "input": "[[2], [['getAverage']]]",
        "expectedOutput": "[0]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_347_3",
        "input": "[[1], [['add', 10], ['getAverage']]]",
        "expectedOutput": "[10, 10]",
        "isHidden": true
      }
    ],
    "solution": "function createMovingAverage(size) {\n  const window = [];\n  let sum = 0;\n  return {\n    add: (val) => {\n      window.push(val);\n      sum += val;\n      if (window.length > size) sum -= window.shift();\n      return sum / window.length;\n    },\n    getAverage: () => (window.length > 0 ? sum / window.length : 0)\n  };\n}",
    "explanation": "Maintain running sum and sliding array window.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(size)",
    "hints": [
      "Maintain running sum so computing average is O(1)."
    ]
  },
  {
    "id": "JS-P348",
    "number": 348,
    "title": "Create Bi-directional Map",
    "slug": "js-p348-create-bi-directional-map",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Data Structures",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "BiMap",
      "Data Structures"
    ],
    "tags": [
      "biMap",
      "dataStructures",
      "closures"
    ],
    "expectedTime": "10 mins",
    "summary": "Map allowing O(1) lookups by key or by value.",
    "problemStatement": "Write a function `createBiMap()` with:\n- `set(key, val)`: stores bidirectional pair (removes any previous conflicting key/val)\n- `getByKey(key)`: returns value or undefined\n- `getByVal(val)`: returns key or undefined\n- `size()`: returns number of unique pairs",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[], [['set', 'a', 1], ['getByKey', 'a'], ['getByVal', 1]]]",
        "output": "[null, 1, 'a']",
        "explanation": "Can query by key or value."
      }
    ],
    "constraints": [
      "One-to-one bijection."
    ],
    "starterCode": "function createBiMap() {\n  // Write your solution here\n}",
    "functionName": "createBiMap",
    "testCases": [
      {
        "id": "tc_348_1",
        "input": "[[], [['set', 'a', 1], ['getByKey', 'a'], ['getByVal', 1]]]",
        "expectedOutput": "[null, 1, 'a']",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_348_2",
        "input": "[[], [['getByKey', 'x'], ['getByVal', 99]]]",
        "expectedOutput": "[null, null]",
        "isHidden": true
      }
    ],
    "solution": "function createBiMap() {\n  const keyToVal = new Map();\n  const valToKey = new Map();\n  return {\n    set: (key, val) => {\n      if (keyToVal.has(key)) valToKey.delete(keyToVal.get(key));\n      if (valToKey.has(val)) keyToVal.delete(valToKey.get(val));\n      keyToVal.set(key, val);\n      valToKey.set(val, key);\n    },\n    getByKey: (key) => keyToVal.get(key),\n    getByVal: (val) => valToKey.get(val),\n    size: () => keyToVal.size\n  };\n}",
    "explanation": "Two symmetric Maps kept synchronized.",
    "timeComplexity": "O(1) all operations",
    "spaceComplexity": "O(n)",
    "hints": [
      "Use two Maps: keyToVal and valToKey."
    ]
  },
  {
    "id": "JS-P349",
    "number": 349,
    "title": "Create History Stack with Max Capacity",
    "slug": "js-p349-create-history-stack-with-max-capacity",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Stack",
    "difficulty": "Easy",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Stack"
    ],
    "tags": [
      "historyStack",
      "stack",
      "closures"
    ],
    "expectedTime": "5 mins",
    "summary": "Bounded stack dropping oldest entries when capacity is exceeded.",
    "problemStatement": "Write a function `createHistoryStack(maxSize)` with:\n- `push(item)`: pushes item. If size > maxSize, removes oldest bottom element\n- `pop()`: pops and returns newest top element\n- `peek()`: returns top element without removing\n- `getItems()`: returns array from oldest to newest",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[2], [['push', 1], ['push', 2], ['push', 3], ['getItems']]]",
        "output": "[null, null, null, [2, 3]]",
        "explanation": "1 was dropped due to maxSize 2."
      }
    ],
    "constraints": [
      "maxSize >= 1."
    ],
    "starterCode": "function createHistoryStack(maxSize) {\n  // Write your solution here\n}",
    "functionName": "createHistoryStack",
    "testCases": [
      {
        "id": "tc_349_1",
        "input": "[[2], [['push', 1], ['push', 2], ['push', 3], ['getItems']]]",
        "expectedOutput": "[null, null, null, [2, 3]]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_349_2",
        "input": "[[1], [['push', 'a'], ['peek'], ['pop']]]",
        "expectedOutput": "[null, 'a', 'a']",
        "isHidden": true
      }
    ],
    "solution": "function createHistoryStack(maxSize) {\n  const stack = [];\n  return {\n    push: (item) => {\n      stack.push(item);\n      if (stack.length > maxSize) stack.shift();\n    },\n    pop: () => stack.pop(),\n    peek: () => (stack.length > 0 ? stack[stack.length - 1] : undefined),\n    getItems: () => stack.slice()\n  };\n}",
    "explanation": "Array where shift() removes oldest when exceeding maxSize.",
    "timeComplexity": "O(1) push/pop/peek",
    "spaceComplexity": "O(maxSize)",
    "hints": [
      "If stack.length > maxSize, call stack.shift()."
    ]
  },
  {
    "id": "JS-P350",
    "number": 350,
    "title": "Create Function Cache with Invalidation",
    "slug": "js-p350-create-function-cache-with-invalidation",
    "category": "Scope / Hoisting / Closures",
    "subcategory": "Caching",
    "difficulty": "Medium",
    "questionType": "Implementation",
    "skills": [
      "Closures",
      "Caching",
      "Invalidation"
    ],
    "tags": [
      "cache",
      "invalidation",
      "closures"
    ],
    "expectedTime": "10 mins",
    "summary": "Cache function results with selective and complete invalidation methods.",
    "problemStatement": "Write a function `createInvalidatableCache(fn)` returning an object with:\n- `call(...args)`: computes and caches `fn(...args)` by stringified args\n- `invalidate(...args)`: removes cached result for specific `args`\n- `invalidateAll()`: clears entire cache\n- `size()`: returns current cached entry count",
    "examples": [
      {
        "title": "Example 1",
        "input": "[[x => x * 2], [['call', 5], ['size'], ['invalidate', 5], ['size']]]",
        "output": "[10, 1, null, 0]",
        "explanation": "Invalidates specific cached arg."
      }
    ],
    "constraints": [
      "Key is JSON.stringify(args)."
    ],
    "starterCode": "function createInvalidatableCache(fn) {\n  // Write your solution here\n}",
    "functionName": "createInvalidatableCache",
    "testCases": [
      {
        "id": "tc_350_1",
        "input": "[[x => x * 2], [['call', 5], ['size'], ['invalidate', 5], ['size']]]",
        "expectedOutput": "[10, 1, null, 0]",
        "isHidden": false
      },
      {
        "id": "tc_350_2",
        "input": "[[(a, b) => a + b], [['call', 1, 2], ['call', 3, 4], ['invalidateAll'], ['size']]]",
        "expectedOutput": "[3, 7, null, 0]",
        "isHidden": false
      }
    ],
    "hiddenTestCases": [
      {
        "id": "tc_350_3",
        "input": "[[s => s.length], [['size']]]",
        "expectedOutput": "[0]",
        "isHidden": true
      }
    ],
    "solution": "function createInvalidatableCache(fn) {\n  const cache = new Map();\n  return {\n    call: (...args) => {\n      const key = JSON.stringify(args);\n      if (cache.has(key)) return cache.get(key);\n      const res = fn(...args);\n      cache.set(key, res);\n      return res;\n    },\n    invalidate: (...args) => {\n      cache.delete(JSON.stringify(args));\n    },\n    invalidateAll: () => {\n      cache.clear();\n    },\n    size: () => cache.size\n  };\n}",
    "explanation": "Map keyed by JSON.stringify(args) with delete and clear methods.",
    "timeComplexity": "O(1) amortized",
    "spaceComplexity": "O(m)",
    "hints": [
      "Use cache.delete and cache.clear."
    ]
  }
];
