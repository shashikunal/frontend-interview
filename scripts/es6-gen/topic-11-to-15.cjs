// scripts/es6-gen/topic-11-to-15.cjs
// Topics 11 - 15:
// 11. Iterators
// 12. Generators
// 13. for...of
// 14. Map
// 15. Set

module.exports = [
  // ==========================================
  // TOPIC 11: Iterators
  // ==========================================
  {
    topic: "Iterators",
    subtopic: "Iterator and Iterable Protocols",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is the difference between the Iterable protocol and the Iterator protocol in ES6?",
    shortAnswer: "An Iterable is an object that implements a [Symbol.iterator]() method returning an Iterator. An Iterator is an object with a next() method that returns an object containing { value, done }.",
    detailedExplanation: "- **Iterable Protocol**: Requires an object to have a `[Symbol.iterator]` zero-argument function that returns an iterator object.\n- **Iterator Protocol**: Requires an object with a `next()` method returning `{ value: any, done: boolean }`.\n- **Completion**: When sequence ends, `done` is `true` and `value` is typically `undefined`.\n- **Built-in Iterables**: Arrays, Strings, Maps, Sets, TypedArrays, and NodeLists.",
    codeExample: "const arr = ['a', 'b'];\n// 1. Get the iterator from the iterable:\nconst iterator = arr[Symbol.iterator]();\n\n// 2. Consume iterator via next():\nconsole.log(iterator.next()); // { value: 'a', done: false }\nconsole.log(iterator.next()); // { value: 'b', done: false }\nconsole.log(iterator.next()); // { value: undefined, done: true }",
    interviewTips: ["Clearly separate: Iterable has `[Symbol.iterator]()`; Iterator has `next()`."]
  },
  {
    topic: "Iterators",
    subtopic: "Creating a Custom Iterable Object",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you make a custom plain JavaScript object iterable so it works with for...of loops?",
    shortAnswer: "Add a [Symbol.iterator] method to the object that returns an object with a next() method delivering { value, done } objects.",
    detailedExplanation: "- **Method Name**: Must use the exact computed property `[Symbol.iterator]`.\n- **State Retention**: Track the internal iteration index in the closure or method instance.\n- **Language Support**: Immediately enables `for...of`, `[...customObj]`, `Array.from(customObj)`, and destructuring `[first, second] = customObj`.",
    codeExample: "const range = {\n  start: 1,\n  end: 3,\n  [Symbol.iterator]() {\n    let current = this.start;\n    const last = this.end;\n    return {\n      next() {\n        if (current <= last) {\n          return { value: current++, done: false };\n        }\n        return { value: undefined, done: true };\n      }\n    };\n  }\n};\n\nfor (const num of range) {\n  console.log(num); // Logs: 1, 2, 3\n}\nconsole.log([...range]); // [1, 2, 3]",
    interviewTips: ["Be ready to implement a custom `range` iterator on a whiteboard in technical interviews."]
  },
  {
    topic: "Iterators",
    subtopic: "Infinite Iterators",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "What is an infinite iterator and how do you safely consume it without freezing the browser?",
    shortAnswer: "An infinite iterator produces values indefinitely with done: false forever. It is consumed safely by taking only the needed values using break, return, or taking functions.",
    detailedExplanation: "- **Lazy Generation**: Values are generated on-demand one at a time via `next()` without storing an infinite array in memory.\n- **Infinite Loop Danger**: Spreading `[...infiniteIterator]` or running an unbounded `for...of` will lock the JavaScript thread and crash memory.\n- **Bounded Loops**: Always terminate with `if (count >= limit) break;`.",
    codeExample: "const idGenerator = {\n  [Symbol.iterator]() {\n    let id = 1;\n    return {\n      next: () => ({ value: id++, done: false })\n    };\n  }\n};\n\n// Consumed safely with break condition:\nfor (const id of idGenerator) {\n  console.log('Generated ID:', id);\n  if (id >= 3) break; // Exits safely: 1, 2, 3\n}",
    interviewTips: ["Warn that spreading an infinite iterator `[...gen]` causes an infinite loop and crashes the thread."]
  },
  {
    topic: "Iterators",
    subtopic: "Iterator return() and throw() Methods",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "What is the purpose of the optional return() method in the Iterator protocol?",
    shortAnswer: "The return() method handles early termination cleanup, called automatically by the engine when a loop terminates prematurely via break, return, or an uncaught exception.",
    detailedExplanation: "- **Resource Teardown**: Closes open file handles, database connections, sockets, or timer subscriptions when a consumer exits early.\n- **Engine Invocation**: Triggered if a `for...of` loop executes `break`, `return`, or throws an error before `done: true`.\n- **Signature**: Returns `{ done: true }`.",
    codeExample: "function makeResourceIterator() {\n  return {\n    [Symbol.iterator]() {\n      let i = 0;\n      return {\n        next() { return { value: ++i, done: false }; },\n        return() {\n          console.log('Cleanup: Loop exited early, closing resources.');\n          return { done: true };\n        }\n      };\n    }\n  };\n}\n\nfor (const val of makeResourceIterator()) {\n  console.log(val);\n  if (val === 2) break; // Triggers return() cleanup automatically!\n}",
    interviewTips: ["Mention that `iterator.return()` is the iterator equivalent of a `finally` block for cleanup."]
  },
  {
    topic: "Iterators",
    subtopic: "Built-in Collection Iterators (.keys(), .values(), .entries())",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What do the .keys(), .values(), and .entries() methods return on built-in collections like Arrays and Maps?",
    shortAnswer: "They return iterator objects that iterate over the collection's indices/keys, values, and [key, value] pairs respectively.",
    detailedExplanation: "- **Array.prototype.entries()**: Returns an iterator of `[index, element]` pairs.\n- **Map.prototype.entries()**: Returns an iterator of `[key, value]` pairs.\n- **Set.prototype.keys()**: Aliased to `.values()` because Sets only contain values.\n- **Consume with for...of**: Can be directly looped over or converted using `Array.from()`.",
    codeExample: "const colors = ['red', 'green', 'blue'];\n\nfor (const [index, color] of colors.entries()) {\n  console.log(`${index}: ${color}`); // '0: red', '1: green', '2: blue'\n}\n\nconst keyIterator = colors.keys();\nconsole.log([...keyIterator]); // [0, 1, 2]",
    interviewTips: ["Highlight `arr.entries()` as the clean modern replacement for needing an index counter in `for...of` loops."]
  },
  {
    topic: "Iterators",
    subtopic: "Making an Iterator Iterable",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "Why should custom iterators also implement [Symbol.iterator]() returning this?",
    shortAnswer: "Making an iterator return itself from [Symbol.iterator]() makes the iterator both an Iterator and an Iterable, allowing it to be used directly in for...of loops and with the spread operator.",
    detailedExplanation: "- **Standard Compliance**: All built-in ES6 iterators (array iterator, generator object) are also iterables.\n- **Flexibility**: Consumers can pass either the collection or the iterator itself to functions expecting an iterable.\n- **Implementation**: Simply define `[Symbol.iterator]() { return this; }` on the iterator object.",
    codeExample: "function createCounter() {\n  let count = 0;\n  return {\n    next() {\n      return count < 3 ? { value: ++count, done: false } : { done: true };\n    },\n    // Makes the iterator itself iterable:\n    [Symbol.iterator]() { return this; }\n  };\n}\n\nconst counter = createCounter();\nfor (const n of counter) {\n  console.log(n); // Works directly in for...of: 1, 2, 3\n}",
    interviewTips: ["State that `[Symbol.iterator]() { return this; }` allows an iterator to be passed wherever an iterable is expected."]
  },

  // ==========================================
  // TOPIC 12: Generators
  // ==========================================
  {
    topic: "Generators",
    subtopic: "Generator Functions Syntax and Execution",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What is a generator function in ES6 and how does its execution differ from regular functions?",
    shortAnswer: "A generator function (declared with function*) can pause its execution midway using the yield keyword and resume later, returning a Generator object that conforms to both the iterable and iterator protocols.",
    detailedExplanation: "- **Not Executed Immediately**: Calling a generator function does not run its body; it returns a Generator iterator object.\n- **Pausing with yield**: The function runs until it hits a `yield` expression, yields the value, and pauses state.\n- **Resuming with next()**: Calling `.next()` resumes execution right after the `yield` statement until the next `yield` or `return`.",
    codeExample: "function* numberGenerator() {\n  console.log('Execution started');\n  yield 1;\n  console.log('Resumed after 1');\n  yield 2;\n  return 3;\n}\n\nconst gen = numberGenerator(); // Nothing logged yet!\nconsole.log(gen.next()); // Logs 'Execution started', returns { value: 1, done: false }\nconsole.log(gen.next()); // Logs 'Resumed after 1', returns { value: 2, done: false }\nconsole.log(gen.next()); // Returns { value: 3, done: true }",
    interviewTips: ["Emphasize that calling `function*` does NOT execute code; it returns a suspended generator object."]
  },
  {
    topic: "Generators",
    subtopic: "Two-Way Data Passing via next(value)",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you pass data into a paused generator using generator.next(value)?",
    shortAnswer: "Passing an argument to gen.next(value) sets that value as the evaluated result of the currently paused yield expression inside the generator.",
    detailedExplanation: "- **First next() Trap**: Arguments passed to the initial `.next()` call are IGNORED, because execution hasn't reached a `yield` yet.\n- **Two-Way Communication**: `yield x` sends `x` out to caller; `gen.next(y)` sends `y` back into the generator.\n- **Coroutine Foundation**: Powers async coroutines and cooperative multitasking in libraries like Redux Saga.",
    codeExample: "function* chat() {\n  const name = yield 'What is your name?';\n  const role = yield `Hello ${name}, what is your role?`;\n  return `${name} works as ${role}`;\n}\n\nconst gen = chat();\nconsole.log(gen.next().value);         // 'What is your name?'\nconsole.log(gen.next('Alice').value);  // 'Hello Alice, what is your role?'\nconsole.log(gen.next('Engineer').value); // 'Alice works as Engineer'",
    interviewTips: ["Remember: The argument to the FIRST `.next()` is always discarded because no `yield` is paused yet."]
  },
  {
    topic: "Generators",
    subtopic: "Generator Delegation with yield*",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "What does the yield* operator do in ES6 generators?",
    shortAnswer: "yield* delegates execution to another generator function or iterable, yielding each of its values sequentially until the delegated sequence finishes.",
    detailedExplanation: "- **Iterable Delegation**: Can delegate to other generators (`yield* otherGen()`), Arrays (`yield* [1, 2]`), or strings (`yield* 'abc'`).\n- **Return Value Capture**: If the delegated generator returns a value with `return 'val'`, `yield*` evaluates to that return value.\n- **Flattening Subtrees**: Essential for recursively traversing hierarchical tree structures.",
    codeExample: "function* subTask() {\n  yield 'Task 1.1';\n  yield 'Task 1.2';\n  return 'SubTask Complete';\n}\n\nfunction* mainTask() {\n  yield 'Start';\n  const result = yield* subTask(); // Delegates to subTask\n  console.log('Result from subTask:', result);\n  yield 'End';\n}\n\nfor (const step of mainTask()) {\n  console.log(step); // 'Start', 'Task 1.1', 'Task 1.2', 'End'\n}",
    interviewTips: ["Point out that `yield*` can delegate to ANY iterable (including arrays), not just other generators."]
  },
  {
    topic: "Generators",
    subtopic: "generator.return() and generator.throw()",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "What do generator.return(value) and generator.throw(error) do to a suspended generator?",
    shortAnswer: "return(value) immediately finishes the generator returning { value, done: true }; throw(error) injects an error at the paused yield point, which can be caught by a try/catch inside the generator.",
    detailedExplanation: "- **generator.return()**: Forces early completion, triggering any enclosing `finally` blocks.\n- **generator.throw()**: Simulates an exception occurring at the current `yield` expression inside the generator.\n- **Error Recovery**: If the generator has a `try/catch` around `yield`, it can handle the error and continue yielding subsequent values.",
    codeExample: "function* controlled() {\n  try {\n    yield 'Working...';\n  } catch (err) {\n    yield `Caught error: ${err.message}`;\n  }\n  yield 'Still alive';\n}\n\nconst gen = controlled();\nconsole.log(gen.next().value); // 'Working...'\n// Injects error into paused generator:\nconsole.log(gen.throw(new Error('Network Failed')).value); // 'Caught error: Network Failed'\nconsole.log(gen.next().value); // 'Still alive'",
    interviewTips: ["Highlight `gen.throw()` as the key mechanism that allows async runners to reject promises back into generators."]
  },
  {
    topic: "Generators",
    subtopic: "Infinite Generators and Memory Efficiency",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do generator functions handle infinite sequences without running out of memory?",
    shortAnswer: "Generators evaluate lazily on-demand: they pause execution and store only local state variables between next() calls, taking O(1) memory regardless of how many values are eventually generated.",
    detailedExplanation: "- **Lazy Evaluation**: The `while (true)` loop inside a generator is suspended at `yield`, consuming zero CPU cycles until `.next()` is called.\n- **Zero Array Overhead**: Generates Fibonacci numbers or unique IDs without pre-allocating large arrays.\n- **Safe Consumption**: Consumers take as many items as needed and exit.",
    codeExample: "function* fibonacci() {\n  let [prev, curr] = [0, 1];\n  while (true) {\n    yield curr;\n    [prev, curr] = [curr, prev + curr];\n  }\n}\n\nconst fib = fibonacci();\nfor (let i = 0; i < 5; i++) {\n  console.log(fib.next().value); // 1, 1, 2, 3, 5\n}",
    interviewTips: ["Cite `while(true) { yield x; }` as a valid, non-blocking pattern inside generators due to lazy suspension."]
  },
  {
    topic: "Generators",
    subtopic: "for...of Behavior with Generator Return Values",
    difficulty: "INTERMEDIATE",
    questionType: "OUTPUT",
    question: "Does a for...of loop output the value returned by a generator's 'return' statement?",
    shortAnswer: "No, for...of loops discard the value of a generator's return statement because once done is true, the loop terminates without processing the value property.",
    detailedExplanation: "- **Loop Termination Rule**: When `done: true`, `for...of` exits immediately.\n- **Manual next() Difference**: Calling `gen.next()` manually DOES expose `{ value: 'final', done: true }`.\n- **Best Practice**: Use `yield` for all data you want consumers to process in loops; use `return` only for metadata or termination signals.",
    codeExample: "function* test() {\n  yield 1;\n  yield 2;\n  return 3;\n}\n\nfor (const v of test()) {\n  console.log(v); // Logs: 1, 2 (3 is completely ignored!)\n}\n\nconst gen = test();\ngen.next(); // { value: 1, done: false }\ngen.next(); // { value: 2, done: false }\nconsole.log(gen.next()); // { value: 3, done: true } (value is visible here)",
    interviewTips: ["This is a classic senior interview trap: `for...of` completely ignores the return value when `done: true`."]
  },
  {
    topic: "Generators",
    subtopic: "Asynchronous Generator Runners (Pre-Async/Await)",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "How did libraries like co or Redux Saga use ES6 generators to implement async/await before async/await was natively introduced?",
    shortAnswer: "A runner function recursively calls generator.next() whenever a yielded Promise resolves, feeding the resolved value back via gen.next(val), and calling gen.throw(err) if the promise rejects.",
    detailedExplanation: "- **Historical Significance**: The `co` library proved that yielding promises could eliminate callback hell, directly inspiring the native `async/await` syntax in ES2017.\n- **Coroutine Runner**: Evaluates `const res = gen.next(val)`, checks if `res.value` is a Promise, and calls `res.value.then(nextVal => step(nextVal), err => gen.throw(err))`.\n- **Redux Saga**: Still uses this exact pattern with custom effect descriptors.",
    codeExample: "function run(generatorFunc) {\n  const gen = generatorFunc();\n  function step(val) {\n    const { value, done } = gen.next(val);\n    if (done) return Promise.resolve(value);\n    return Promise.resolve(value).then(step, err => gen.throw(err));\n  }\n  return step();\n}\n\n// Looked and acted just like modern async/await:\n// run(function* () { const user = yield fetchUser(); console.log(user); });",
    interviewTips: ["Explain that native `async/await` is essentially syntactic sugar over Promises + Generators."]
  },

  // ==========================================
  // TOPIC 13: for...of
  // ==========================================
  {
    topic: "for...of",
    subtopic: "for...of vs for...in",
    difficulty: "EASY",
    questionType: "COMPARISON",
    question: "What is the difference between for...of and for...in loops in JavaScript?",
    shortAnswer: "for...in iterates over the enumerable property keys (including prototype keys) of any object, while for...of iterates over the values of an iterable object (Arrays, Strings, Sets, Maps).",
    detailedExplanation: "- **for...in (Keys)**: Inspects object keys/indices as strings (`'0'`, `'1'`, `'customProp'`). Traverses prototype chain unless filtered with `hasOwnProperty`.\n- **for...of (Values)**: Invokes `[Symbol.iterator]` to retrieve elements directly. Ignores prototype properties and non-indexed properties on arrays.\n- **Plain Objects**: Plain objects are NOT iterable by default, so `for (const x of plainObj)` throws a `TypeError`.",
    codeExample: "const arr = ['a', 'b'];\narr.custom = 'test';\n\n// for...in loops over keys (strings):\nfor (const key in arr) {\n  console.log('for...in:', key); // '0', '1', 'custom'\n}\n\n// for...of loops over iterable values:\nfor (const val of arr) {\n  console.log('for...of:', val); // 'a', 'b'\n}",
    interviewTips: ["Mnemonic: 'for...IN is for KEYS IN an object; for...OF is for VALUES OF an iterable.'"]
  },
  {
    topic: "for...of",
    subtopic: "Iterating Strings and Unicode Safety",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How does for...of handle Unicode surrogate pairs (like emojis) compared to a traditional index-based for loop?",
    shortAnswer: "for...of is Unicode-aware: it iterates by full Unicode code points rather than 16-bit code units, correctly yielding complete emoji and surrogate pairs without splitting them in half.",
    detailedExplanation: "- **Surrogate Pair Problem**: Emojis like '🔥' take 2 UTF-16 code units (`length: 2`). A standard `for (let i = 0; i < str.length; i++)` slices the emoji into two broken surrogate halves.\n- **for...of Solution**: String's `[Symbol.iterator]` yields full code points: `for (const char of '🔥')` runs once for the whole emoji.\n- **Spread Operator**: `[...'🔥']` similarly yields a single-element array.",
    codeExample: "const text = 'A🔥B';\n\n// Traditional loop (splits surrogate pairs):\nfor (let i = 0; i < text.length; i++) {\n  console.log('Index loop:', text[i]); // 'A', '\\uD83D', '\\uDD25', 'B' (Broken emoji!)\n}\n\n// for...of (Unicode-safe):\nfor (const char of text) {\n  console.log('for...of:', char); // 'A', '🔥', 'B' (Correct!)\n}",
    interviewTips: ["Cite emoji surrogate pair handling as proof of `for...of`'s native Unicode awareness."]
  },
  {
    topic: "for...of",
    subtopic: "break and continue Support",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "Can you use break and continue inside a for...of loop? How does it compare to forEach()?",
    shortAnswer: "Yes, for...of fully supports break, continue, and return statements, whereas Array.prototype.forEach() cannot be stopped early or skipped with continue.",
    detailedExplanation: "- **forEach Limitation**: There is no way to stop or break a `forEach()` callback other than throwing an exception.\n- **Early Exit**: `for...of` allows exiting instantly with `break` when a search item is found.\n- **async/await Support**: `for...of` supports `await` inside the loop body for sequential asynchronous processing, which breaks in `forEach()`.",
    codeExample: "const nums = [1, 2, 3, 4, 5];\n\nfor (const n of nums) {\n  if (n === 2) continue; // Skips 2\n  if (n === 4) break;    // Stops loop entirely\n  console.log(n);        // Logs 1, 3\n}",
    interviewTips: ["Mention that `for...of` supports `break`, `continue`, and sequential `await`, making it more flexible than `.forEach()`."]
  },
  {
    topic: "for...of",
    subtopic: "Iterating Maps and Sets with for...of",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What does for...of yield when iterating directly over a Map versus a Set?",
    shortAnswer: "Iterating over a Map yields [key, value] pairs as two-element arrays, which can be destructured directly. Iterating over a Set yields individual element values.",
    detailedExplanation: "- **Map Default Iterator**: `map[Symbol.iterator]()` is aliased to `map.entries()`, yielding `[key, val]`.\n- **Set Default Iterator**: `set[Symbol.iterator]()` is aliased to `set.values()`, yielding unique elements in insertion order.\n- **Destructuring**: `for (const [key, value] of myMap)` is standard idiomatic syntax.",
    codeExample: "const map = new Map([['admin', 'Alice'], ['editor', 'Bob']]);\nfor (const [role, name] of map) {\n  console.log(`${name}: ${role}`);\n}\n\nconst set = new Set(['apple', 'banana']);\nfor (const item of set) {\n  console.log(item); // 'apple', 'banana'\n}",
    interviewTips: ["Showcase destructuring `[key, value]` directly in the `for...of` header on Maps."]
  },
  {
    topic: "for...of",
    subtopic: "Attempting for...of on Plain Objects",
    difficulty: "INTERMEDIATE",
    questionType: "OUTPUT",
    question: "Why does for (const x of { a: 1 }) throw a TypeError and how do you iterate plain objects?",
    shortAnswer: "Plain objects do not implement the iterable protocol ([Symbol.iterator] is undefined), throwing 'TypeError: ... is not iterable'. Iterate over Object.keys(), Object.values(), or Object.entries() instead.",
    detailedExplanation: "- **Design Choice**: TC39 excluded `[Symbol.iterator]` from `Object.prototype` because it was ambiguous whether iteration should yield keys, values, or entries, and to prevent prototype property iteration bugs.\n- **Object.entries()**: `for (const [key, val] of Object.entries(obj))` is the recommended approach.\n- **Object.keys()**: Use when only keys are needed.",
    codeExample: "const user = { name: 'Alice', age: 30 };\n\n// THROWS TypeError:\n// for (const x of user) {} // TypeError: user is not iterable\n\n// RECOMMENDED APPROACH:\nfor (const [key, value] of Object.entries(user)) {\n  console.log(`${key}: ${value}`);\n}",
    interviewTips: ["Explain why objects are not iterable: iterating could mean keys, values, or entries; `Object.entries(obj)` makes the intent explicit."]
  },

  // ==========================================
  // TOPIC 14: Map
  // ==========================================
  {
    topic: "Map",
    subtopic: "Map Overview & Method API",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What is an ES6 Map and what are its primary CRUD methods?",
    shortAnswer: "Map is a keyed collection of key-value pairs that remembers the original insertion order of keys. Its primary methods are set(k, v), get(k), has(k), delete(k), clear(), and size property.",
    detailedExplanation: "- **set(key, val)**: Adds or updates an entry; returns the Map instance (allowing chaining).\n- **get(key)**: Retrieves value, or `undefined` if key does not exist.\n- **has(key)**: Fast O(1) boolean check for key existence.\n- **delete(key)**: Removes key and returns boolean indicating if key was found.\n- **size**: Getter returning total count of entries.",
    codeExample: "const userRoles = new Map();\nuserRoles.set('alice', 'admin').set('bob', 'editor');\n\nconsole.log(userRoles.get('alice')); // 'admin'\nconsole.log(userRoles.has('bob'));    // true\nconsole.log(userRoles.size);          // 2\n\nuserRoles.delete('bob');\nconsole.log(userRoles.size);          // 1",
    interviewTips: ["Mention that `map.size` is a property getter, NOT a method like `map.size()`."]
  },
  {
    topic: "Map",
    subtopic: "Map vs Plain Object Differences",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    question: "What are the major advantages of Map over a plain Object for key-value storage?",
    shortAnswer: "Map allows keys of ANY data type (including objects and functions), preserves insertion order, provides an accurate size property, has no prototype key collisions, and is optimized for frequent additions and removals.",
    detailedExplanation: "- **Key Types**: Plain Object keys can only be Strings or Symbols (objects get coerced to `'[object Object]'`). Map supports object, array, function, and primitive keys.\n- **Size**: `map.size` is O(1); Object requires `Object.keys(obj).length` (O(N)).\n- **No Accidental Keys**: Objects inherit prototype keys (`toString`, `constructor`) unless created with `Object.create(null)`.\n- **Iteration**: Map is directly iterable in insertion order.",
    codeExample: "const map = new Map();\nconst keyObj = { id: 1 };\nconst keyFunc = () => {};\n\nmap.set(keyObj, 'Object Data');\nmap.set(keyFunc, 'Function Data');\n\nconsole.log(map.get(keyObj));  // 'Object Data' (keyed by object reference!)\nconsole.log(map.get(keyFunc)); // 'Function Data'",
    interviewTips: ["List the 4 key advantages: 1) Any key type, 2) Insertion order guarantee, 3) Native `size`, 4) Zero prototype pollution."]
  },
  {
    topic: "Map",
    subtopic: "Key Equality in Map (SameValueZero)",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "How does Map determine whether two keys are equal? How does it handle NaN, +0, and -0?",
    shortAnswer: "Map uses the SameValueZero algorithm: NaN is considered equal to NaN (unlike ===), and +0 is considered equal to -0.",
    detailedExplanation: "- **NaN as Key**: In strict equality `NaN === NaN` is `false`, but in a Map, `NaN` matches `NaN`, so only one `NaN` key can exist.\n- **Zeroes**: `+0` and `-0` are considered identical keys.\n- **Objects by Reference**: Two distinct object literals `{}` and `{}` are NOT equal because their memory references differ.",
    codeExample: "const map = new Map();\n\nmap.set(NaN, 'First NaN');\nmap.set(NaN, 'Second NaN');\nconsole.log(map.size); // 1 (NaN matched the existing NaN key!)\nconsole.log(map.get(NaN)); // 'Second NaN'\n\nmap.set({}, 'Obj 1');\nmap.set({}, 'Obj 2');\nconsole.log(map.size); // 3 (Different object references are separate keys!)",
    interviewTips: ["Name the comparison algorithm: `SameValueZero`. It treats `NaN === NaN` as true."]
  },
  {
    topic: "Map",
    subtopic: "Object Keys Lookup by Reference",
    difficulty: "INTERMEDIATE",
    questionType: "OUTPUT",
    question: "Why does map.set({}, 'data'); map.get({}) return undefined?",
    shortAnswer: "Each empty object literal {} creates a brand new object instance at a different memory address. Map matches objects by reference identity, so map.get({}) looks up a different object reference.",
    detailedExplanation: "- **Reference Equality**: Map uses identity comparison for objects (`refA === refB`).\n- **Separate Heap Allocations**: The object passed to `get({})` is a new allocation, not the one passed to `set({}, ...)`.\n- **Resolution**: Store the object reference in a variable and pass that variable to both `set` and `get`.",
    codeExample: "const map = new Map();\n\n// BUG:\nmap.set({ id: 1 }, 'User Data');\nconsole.log(map.get({ id: 1 })); // undefined (different object reference!)\n\n// FIX: Store reference:\nconst userKey = { id: 1 };\nmap.set(userKey, 'User Data');\nconsole.log(map.get(userKey)); // 'User Data' (same reference)",
    interviewTips: ["State clearly: 'Objects are compared by reference, not by structural value equality.'"]
  },
  {
    topic: "Map",
    subtopic: "Converting Between Map and Object / JSON",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you convert a Map into a plain JavaScript Object or JSON string and vice versa?",
    shortAnswer: "Convert Map to object with Object.fromEntries(map); convert object to Map with new Map(Object.entries(obj)). Convert to JSON with JSON.stringify(Object.fromEntries(map)).",
    detailedExplanation: "- **Object.fromEntries()**: Takes an iterable of `[key, val]` entries (like a Map) and produces a plain object.\n- **Object.entries()**: Takes a plain object and produces an array of `[key, val]` entries suitable for `new Map()`.\n- **Limitation**: When converting to object/JSON, non-string keys will be coerced to strings.",
    codeExample: "const map = new Map([['name', 'Alice'], ['role', 'Admin']]);\n\n// Map to Object:\nconst obj = Object.fromEntries(map);\nconsole.log(obj); // { name: 'Alice', role: 'Admin' }\n\n// Object to Map:\nconst restoredMap = new Map(Object.entries(obj));\nconsole.log(restoredMap.get('name')); // 'Alice'",
    interviewTips: ["Highlight `Object.fromEntries(map)` as the standard ES2019 addition that finalized seamless Map-to-Object conversions."]
  },
  {
    topic: "Map",
    subtopic: "Map Iteration Methods",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you iterate through keys, values, and entries of an ES6 Map?",
    shortAnswer: "Use map.keys() for keys, map.values() for values, map.entries() (or the Map itself) for [key, value] pairs, or map.forEach((val, key) => ...).",
    detailedExplanation: "- **forEach Signature**: Notice parameter order in `forEach`: `(value, key, map)`—value comes first to match `Array.prototype.forEach`.\n- **Insertion Order**: Iteration order is strictly guaranteed to be the order keys were inserted.\n- **Direct Destructuring**: `for (const [k, v] of map)` iterates entries directly.",
    codeExample: "const map = new Map([['a', 1], ['b', 2]]);\n\nmap.forEach((val, key) => {\n  console.log(`${key} => ${val}`);\n});\n\nfor (const key of map.keys()) console.log('Key:', key);\nfor (const val of map.values()) console.log('Val:', val);",
    interviewTips: ["Notice `map.forEach((value, key) => ...)`: value is first, key is second!"]
  },
  {
    topic: "Map",
    subtopic: "Map Memory Retention & Garbage Collection Hazard",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "Why can storing DOM elements as keys in a regular Map cause memory leaks?",
    shortAnswer: "A standard Map holds strong references to its keys; as long as the Map exists, DOM elements used as keys cannot be garbage collected even after being removed from the DOM tree. Use WeakMap to prevent this.",
    detailedExplanation: "- **Strong References**: The garbage collector cannot free an object if a Map key points to it.\n- **Detached DOM Leaks**: If an element is removed from the DOM with `.remove()`, the Map retains the element, its closures, and its subtree in memory.\n- **WeakMap Solution**: `WeakMap` holds weak references, allowing the garbage collector to reclaim elements as soon as they have no other strong references.",
    codeExample: "const metadata = new Map();\n\nfunction attachMetadata(element, data) {\n  metadata.set(element, data); // Strong reference prevents GC!\n}\n\n// Even if element is removed from the document:\n// element.remove(); // LEAK: Still pinned in memory by metadata Map!\n\n// Solution: Use WeakMap\nconst safeMetadata = new WeakMap();",
    interviewTips: ["Use this exact scenario to explain why `WeakMap` was introduced in ES6."]
  },

  // ==========================================
  // TOPIC 15: Set
  // ==========================================
  {
    topic: "Set",
    subtopic: "Set Overview & Methods",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What is an ES6 Set and what methods does it provide?",
    shortAnswer: "Set is a collection of unique values of any type. Its primary methods are add(value), has(value), delete(value), clear(), and the size property.",
    detailedExplanation: "- **Uniqueness**: Duplicate values are ignored automatically.\n- **add() Chaining**: `add()` returns the Set instance, allowing chaining.\n- **Insertion Order**: Values are iterated in the exact order they were inserted.\n- **Lookup Speed**: `set.has(x)` is an O(1) constant-time check, compared to `array.includes(x)` which is O(N).",
    codeExample: "const set = new Set();\nset.add('apple').add('banana').add('apple'); // 'apple' duplicate is ignored\n\nconsole.log(set.size);        // 2\nconsole.log(set.has('apple')); // true\n\nset.delete('banana');\nconsole.log(set.size);        // 1",
    interviewTips: ["Highlight `set.has()` being O(1) versus `array.includes()` being O(N)."]
  },
  {
    topic: "Set",
    subtopic: "Deduplicating Arrays with Set",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you remove duplicate values from an array in a single line using ES6 Set?",
    shortAnswer: "Pass the array to the Set constructor and spread back into an array: const unique = [...new Set(array)].",
    detailedExplanation: "- **Constructor Ingestion**: `new Set(array)` consumes the array and keeps only unique items.\n- **Spread Conversion**: `[...set]` or `Array.from(set)` converts the Set back to an array.\n- **Preserves Order**: Retains original first-seen insertion order.\n- **Primitives vs Objects**: Works perfectly for numbers, strings, and booleans. Object elements are compared by reference.",
    codeExample: "const duplicates = [1, 2, 2, 3, 4, 4, 5];\nconst unique = [...new Set(duplicates)];\nconsole.log(unique); // [1, 2, 3, 4, 5]\n\nconst words = ['apple', 'orange', 'apple'];\nconsole.log(Array.from(new Set(words))); // ['apple', 'orange']",
    interviewTips: ["`[...new Set(arr)]` is the single most commonly asked ES6 code snippet in technical interviews."]
  },
  {
    topic: "Set",
    subtopic: "Set vs Array Comparison",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    question: "When should you choose a Set over an Array in JavaScript?",
    shortAnswer: "Choose Set when you need to enforce uniqueness of items or require high-frequency search and deletion operations (O(1) with has/delete). Choose Array when you need duplicate elements, index-based access ([i]), or sorting.",
    detailedExplanation: "- **No Index Access**: Set does not support `set[0]`; access requires iteration or conversion to array.\n- **Search Performance**: Checking existence in a 1,000,000 item Set via `set.has()` takes microseconds; `arr.includes()` takes milliseconds.\n- **Array Methods**: Sets lack `.map()`, `.filter()`, and `.sort()` (must spread to array to use them).",
    codeExample: "const visitedIds = new Set();\n\nfunction processUser(id) {\n  // Instant O(1) lookup:\n  if (visitedIds.has(id)) return;\n  visitedIds.add(id);\n  // Process user...\n}",
    interviewTips: ["Explain the complexity tradeoff: Set has O(1) search and uniqueness; Array has index access and sorting."]
  },
  {
    topic: "Set",
    subtopic: "Set Operations (Union, Intersection, Difference)",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you implement Union, Intersection, and Difference between two Sets in ES6?",
    shortAnswer: "Union: new Set([...setA, ...setB]); Intersection: new Set([...setA].filter(x => setB.has(x))); Difference: new Set([...setA].filter(x => !setB.has(x))).",
    detailedExplanation: "- **Union**: Combines elements from both sets and removes duplicates.\n- **Intersection**: Filters elements present in both sets using `setB.has(x)`.\n- **Difference**: Filters elements in `setA` that do NOT exist in `setB`.\n- **Set Methods in Modern JS**: Note that modern ECMAScript has added native `union()`, `intersection()`, and `difference()` methods to `Set.prototype`.",
    codeExample: "const setA = new Set([1, 2, 3]);\nconst setB = new Set([2, 3, 4]);\n\n// Union:\nconst union = new Set([...setA, ...setB]); // Set { 1, 2, 3, 4 }\n\n// Intersection:\nconst intersection = new Set([...setA].filter(x => setB.has(x))); // Set { 2, 3 }\n\n// Difference (in A but not B):\nconst difference = new Set([...setA].filter(x => !setB.has(x))); // Set { 1 }",
    interviewTips: ["Be ready to write one-line implementations for Set Union, Intersection, and Difference."]
  },
  {
    topic: "Set",
    subtopic: "Object Uniqueness in Set",
    difficulty: "INTERMEDIATE",
    questionType: "OUTPUT",
    question: "Why does new Set([{ a: 1 }, { a: 1 }]).size equal 2?",
    shortAnswer: "Set compares objects by memory reference identity, not by structural value. The two object literals are stored at different memory addresses, so Set treats them as distinct unique values.",
    detailedExplanation: "- **SameValueZero Algorithm**: Objects are compared using reference equality (`ref1 === ref2`).\n- **Separate Allocations**: `{ a: 1 } !== { a: 1 }` in JavaScript.\n- **Deduplicating Objects**: To deduplicate objects, track unique primitive IDs in a Set, or serialize via JSON stringification.",
    codeExample: "const set = new Set();\nset.add({ a: 1 });\nset.add({ a: 1 });\nconsole.log(set.size); // 2 (distinct objects!)\n\nconst sharedRef = { b: 2 };\nset.add(sharedRef);\nset.add(sharedRef);\nconsole.log(set.size); // 3 (same reference was ignored)",
    interviewTips: ["Explain that Set does not perform deep equality checks on objects."]
  },
  {
    topic: "Set",
    subtopic: "Set Iteration Order",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "Does an ES6 Set guarantee iteration order, and how is it determined?",
    shortAnswer: "Yes, ES6 Set strictly guarantees iteration in insertion order: values are yielded in the exact sequence they were added using add().",
    detailedExplanation: "- **Deterministic**: Unlike sets in languages like C++ or Java (`HashSet`), JavaScript Set always preserves insertion order.\n- **Re-Adding Existing Items**: If an existing item is added again via `set.add(existing)`, its position in the iteration order does NOT change.\n- **Deletion and Re-addition**: Deleting an item and re-adding it moves it to the end of the iteration order.",
    codeExample: "const set = new Set();\nset.add('first');\nset.add('second');\nset.add('first'); // Ignored, position unchanged\nset.add('third');\n\nconsole.log([...set]); // ['first', 'second', 'third'] (Exact insertion order)",
    interviewTips: ["Confirm that JavaScript Set always preserves insertion order."]
  }
];
