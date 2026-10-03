// scripts/es6-gen/topic-06-to-10.cjs
// Topics 6 - 10:
// 6. Spread Syntax
// 7. Destructuring
// 8. Enhanced Object Literals
// 9. Object.assign
// 10. Symbols

module.exports = [
  // ==========================================
  // TOPIC 6: Spread Syntax
  // ==========================================
  {
    topic: "Spread Syntax",
    subtopic: "Spread in Array Literals and Function Calls",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What is the spread operator in ES6 and how is it used to expand arrays?",
    shortAnswer: "The spread operator (...iterable) unpacks elements of an array or iterable into individual arguments in a function call or into elements of a new array literal.",
    detailedExplanation: "- **Function Arguments**: Replaces `fn.apply(null, args)` with `fn(...args)` (e.g. `Math.max(...nums)`).\n- **Array Combining**: Cleanly concatenates arrays: `const combined = [...arr1, ...arr2]` without calling `.concat()`.\n- **String Splitting**: Spreading a string `[...'hello']` splits it into Unicode characters without regex.",
    codeExample: "const numbers = [5, 20, 15, 3];\n// Math.max expects separate arguments, not an array:\nconsole.log(Math.max(...numbers)); // 20\n\nconst fruits = ['apple', 'banana'];\nconst allFood = ['bread', ...fruits, 'cheese'];\nconsole.log(allFood); // ['bread', 'apple', 'banana', 'cheese']",
    interviewTips: ["Mention that `Math.max(...arr)` replaced the verbose `Math.max.apply(null, arr)` idiom."]
  },
  {
    topic: "Spread Syntax",
    subtopic: "Shallow Copy with Spread",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "Does the spread operator create a shallow copy or a deep copy of arrays and objects?",
    shortAnswer: "The spread operator creates a shallow copy: top-level primitive properties are copied by value, but nested objects and arrays are copied by reference.",
    detailedExplanation: "- **Top-Level Independence**: Mutating top-level properties on the clone does not affect the original.\n- **Nested Reference Sharing**: Mutating a nested array or object inside the clone DOES mutate the original object.\n- **Deep Clone Alternative**: For true deep cloning, use native `structuredClone(obj)` in modern environments or recursive cloning.",
    codeExample: "const original = { name: 'Alice', details: { age: 25 } };\nconst clone = { ...original };\n\nclone.name = 'Bob';\nconsole.log(original.name); // 'Alice' (top-level primitive is independent)\n\nclone.details.age = 30;\nconsole.log(original.details.age); // 30! (nested object reference is shared)",
    interviewTips: ["Always emphasize that spread is strictly a SHALLOW copy; nested references remain shared."]
  },
  {
    topic: "Spread Syntax",
    subtopic: "Spread vs Rest Syntax Difference",
    difficulty: "EASY",
    questionType: "COMPARISON",
    question: "What is the difference between the spread operator and rest parameters since both use three dots (...)?",
    shortAnswer: "Rest syntax collects multiple elements into a single array (used in function parameters and destructuring patterns), while spread syntax expands a single iterable into multiple individual elements.",
    detailedExplanation: "- **Rest (Gathering)**: Compresses/gathers multiple values into an array: `function sum(...nums)` or `[first, ...rest] = arr`.\n- **Spread (Unpacking)**: Expands/spreads an array into individual elements: `[...arr]` or `Math.max(...nums)`.\n- **Position**: Rest appears on the receiving side (assignment left-hand side or parameters); spread appears on the supplying side (expressions or arguments).",
    codeExample: "// Rest collects arguments into an array:\nfunction collectFirstAndRest(first, ...rest) {\n  console.log('First:', first);\n  console.log('Rest (gathered into array):', rest);\n}\n\n// Spread unpacks an array into separate arguments:\nconst values = [10, 20, 30];\ncollectFirstAndRest(...values);",
    interviewTips: ["Use the mnemonic: 'Rest gathers into an array; Spread unpacks out of an array.'"]
  },
  {
    topic: "Spread Syntax",
    subtopic: "Object Spread and Property Overriding",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How does property order affect object spread when merging objects with overlapping keys?",
    shortAnswer: "In object spread, properties evaluated later override properties evaluated earlier with the same key.",
    detailedExplanation: "- **Order Matters**: `{ ...defaults, ...overrides }` ensures user options take precedence over defaults.\n- **Accidental Override**: Putting `{ ...overrides, ...defaults }` causes defaults to overwrite user options.\n- **Prototype Properties**: Spread ONLY copies own enumerable properties; inherited prototype properties are not copied.",
    codeExample: "const defaults = { theme: 'light', fontSize: 14, debug: false };\nconst userConfig = { theme: 'dark', debug: true };\n\n// userConfig properties override defaults because they appear later:\nconst finalConfig = { ...defaults, ...userConfig };\nconsole.log(finalConfig); // { theme: 'dark', fontSize: 14, debug: true }\n\n// If swapped, defaults would overwrite user preferences!\nconst badConfig = { ...userConfig, ...defaults };\nconsole.log(badConfig.theme); // 'light'",
    interviewTips: ["Highlight the standard pattern: `{ ...defaults, ...options }` so caller options take precedence."]
  },
  {
    topic: "Spread Syntax",
    subtopic: "Spreading Non-Iterables",
    difficulty: "INTERMEDIATE",
    questionType: "OUTPUT",
    question: "What happens when you use spread syntax on null, undefined, numbers, or non-iterable objects?",
    shortAnswer: "In array literals [...x], spreading a non-iterable throws a TypeError. In object literals {...x}, spreading null, undefined, or primitives safely evaluates to no properties without throwing.",
    detailedExplanation: "- **Array Spread Requirement**: Array spread `[...x]` requires the operand to implement the iterable protocol (`Symbol.iterator`). Spreading `null` throws `TypeError: null is not iterable`.\n- **Object Spread Tolerance**: Object spread `{ ...x }` uses `ToObject` semantics: `null`, `undefined`, numbers, and booleans produce empty objects `{}` with zero own properties.\n- **String Exception**: Strings are iterable, so `[...'abc']` yields `['a', 'b', 'c']` and `{ ...'ab' }` yields `{ '0': 'a', '1': 'b' }`.",
    codeExample: "// Object spread is safe with null/undefined:\nconst obj = { a: 1, ...null, ...undefined };\nconsole.log(obj); // { a: 1 }\n\n// Array spread throws TypeError:\ntry {\n  const arr = [1, ...null];\n} catch (err) {\n  console.log(err.name); // 'TypeError: null is not iterable'\n}",
    interviewTips: ["Explain the contrast: Array spread throws on non-iterables, but object spread safely ignores null/undefined."]
  },
  {
    topic: "Spread Syntax",
    subtopic: "Spread Performance and Maximum Call Stack Size",
    difficulty: "DIFFICULT",
    questionType: "PERFORMANCE",
    question: "Why can Math.max(...largeArray) crash with a RangeError on arrays with 200,000 items, and how should it be handled?",
    shortAnswer: "Spreading an array into a function call pushes each element as a separate stack frame argument; exceeding the browser engine's maximum call stack limit throws 'RangeError: Maximum call stack size exceeded'. Use a loop or Array.prototype.reduce() instead.",
    detailedExplanation: "- **Argument Limits**: Most JavaScript engines (V8, JavaScriptCore) cap function arguments between 65,536 and 125,000.\n- **Call Stack Exhaustion**: Spreading huge arrays into `Math.max()` or `arr.push(...huge)` attempts to push 200,000 parameters onto the execution stack.\n- **Safe Alternatives**: `largeArray.reduce((max, n) => Math.max(max, n), -Infinity)` or a simple `for` loop.",
    codeExample: "const hugeArray = new Array(200000).fill(1);\n\n// CRASHES: RangeError: Maximum call stack size exceeded\n// Math.max(...hugeArray);\n\n// SAFE (Zero call stack limit risk):\nconst safeMax = hugeArray.reduce((max, val) => val > max ? val : max, -Infinity);\nconsole.log(safeMax); // 1",
    interviewTips: ["Cite `RangeError: Maximum call stack size exceeded` and recommend `.reduce()` for massive collections."]
  },

  // ==========================================
  // TOPIC 7: Destructuring
  // ==========================================
  {
    topic: "Destructuring",
    subtopic: "Array and Object Destructuring Basics",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do basic array and object destructuring work in ES6?",
    shortAnswer: "Array destructuring unpacks values based on positional index [a, b], while object destructuring unpacks values based on matching property keys { x, y }.",
    detailedExplanation: "- **Array Positional**: Assigns based on order: `const [first, second] = [10, 20]`.\n- **Object Key Matching**: Extracts by property name: `const { name, age } = user`.\n- **Skipping Elements**: Skip array positions using empty commas: `const [first, , third] = arr`.",
    codeExample: "// Array Destructuring:\nconst rgb = [255, 128, 0];\nconst [red, green, blue] = rgb;\nconsole.log(red, green, blue); // 255 128 0\n\n// Object Destructuring:\nconst point = { x: 10, y: 20 };\nconst { x, y } = point;\nconsole.log(x, y); // 10 20",
    interviewTips: ["Emphasize: Array destructuring matches by position; Object destructuring matches by key name."]
  },
  {
    topic: "Destructuring",
    subtopic: "Variable Renaming in Object Destructuring",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you rename a variable during object destructuring?",
    shortAnswer: "Use the syntax { originalKey: newVariableName } to extract the value of originalKey and assign it to newVariableName.",
    detailedExplanation: "- **Syntax**: The colon `:` indicates assignment target: `{ key: localName }`.\n- **Avoiding Collisions**: Prevents variable name collisions with existing variables in scope.\n- **Combined with Defaults**: Can combine renaming with a fallback default value: `{ key: localName = defaultValue }`.",
    codeExample: "const response = { status_code: 200, data: 'Success' };\n\n// Renames status_code to status:\nconst { status_code: status, data } = response;\nconsole.log(status); // 200\n// console.log(status_code); // ReferenceError: status_code is not defined",
    interviewTips: ["Remember: `key: newName` means 'extract key and store in newName'."]
  },
  {
    topic: "Destructuring",
    subtopic: "Default Values in Destructuring",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do default values work in destructuring when a property is missing or undefined?",
    shortAnswer: "Assign a default using = in the pattern ({ key = defaultValue }). The default applies ONLY when the extracted property is undefined.",
    detailedExplanation: "- **Strict undefined**: Default values are evaluated only when `value === undefined`.\n- **null Preservation**: If the property is explicitly `null`, the variable receives `null` (default is NOT used).\n- **Lazy Evaluation**: Default expressions are only evaluated if the property is undefined.",
    codeExample: "const config = { host: 'localhost', port: undefined, timeout: null };\n\nconst {\n  host = '127.0.0.1',\n  port = 8080,\n  timeout = 5000\n} = config;\n\nconsole.log(host);    // 'localhost' (property exists)\nconsole.log(port);    // 8080 (property was undefined -> default used)\nconsole.log(timeout); // null (null is preserved, default NOT used!)",
    interviewTips: ["Remind the interviewer that `null` does NOT trigger destructuring default values, only `undefined` does."]
  },
  {
    topic: "Destructuring",
    subtopic: "Swapping Variables Without Temporary Variables",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you swap two variables in a single line using ES6 array destructuring?",
    shortAnswer: "Use array destructuring assignment: [a, b] = [b, a].",
    detailedExplanation: "- **Evaluation**: The right-hand side creates an array literal `[b, a]` evaluating the current values.\n- **Assignment**: The left-hand side pattern unpacks those values into `a` and `b` simultaneously.\n- **No Temp Variable**: Eliminates `const temp = a; a = b; b = temp;`.\n- **Semicolon Precaution**: If previous statement doesn't end with a semicolon, leading `[` can trigger automatic semicolon insertion bugs.",
    codeExample: "let a = 1;\nlet b = 2;\n\n// Swapping without temp variable:\n[a, b] = [b, a];\n\nconsole.log(a); // 2\nconsole.log(b); // 1",
    interviewTips: ["Always mention `[a, b] = [b, a]` as the canonical clean ES6 variable swapping idiom."]
  },
  {
    topic: "Destructuring",
    subtopic: "Nested Destructuring",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you extract deeply nested properties using nested object destructuring?",
    shortAnswer: "Mirror the nested object structure in the pattern: const { user: { address: { city } } } = data.",
    detailedExplanation: "- **Path Navigation**: Intermediate keys (`user`, `address`) are used purely for traversal and are NOT created as variables unless explicitly captured.\n- **Safety Hazard**: If an intermediate property is `null` or `undefined`, destructuring throws a `TypeError: Cannot read properties of undefined`.\n- **Default Objects**: Protect intermediate keys using default empty objects: `{ user: { address = {} } = {} }`.",
    codeExample: "const profile = {\n  id: 42,\n  contact: {\n    email: 'alice@example.com',\n    geo: { lat: 37.77, lng: -122.41 }\n  }\n};\n\nconst { contact: { email, geo: { lat } } } = profile;\nconsole.log(email); // 'alice@example.com'\nconsole.log(lat);   // 37.77\n// console.log(contact); // ReferenceError: contact is not defined (used for traversal only!)",
    interviewTips: ["Point out that intermediate traversal keys (`contact`, `geo`) are NOT declared as variables."]
  },
  {
    topic: "Destructuring",
    subtopic: "Function Parameter Destructuring with Defaults",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you destructure function parameters and provide defaults for both individual properties and the entire options object?",
    shortAnswer: "Destructure the parameters inside curly braces and assign an empty object default to the whole parameter: function fetchUser({ id = 0, timeout = 3000 } = {}).",
    detailedExplanation: "- **Clean API Options**: Replaces positional parameters with self-documenting named configuration options.\n- **Omitted Parameter Crash**: Without `= {}`, calling `fetchUser()` with zero arguments throws `TypeError: Cannot destructure property of undefined`.\n- **Double Defaults**: The outer `= {}` handles omitting the entire options argument; inner `= 3000` handles omitting individual properties.",
    codeExample: "// Double default pattern:\nfunction setupWidget({ width = 100, height = 200, color = 'blue' } = {}) {\n  console.log(`Widget: ${width}x${height}, color: ${color}`);\n}\n\nsetupWidget({ width: 300 }); // 'Widget: 300x200, color: blue'\nsetupWidget();               // 'Widget: 100x200, color: blue' (Safe! Doesn't crash)",
    interviewTips: ["Highlight the `= {}` at the end of the parameter list as crucial for preventing crashes when callers pass no arguments."]
  },
  {
    topic: "Destructuring",
    subtopic: "Destructuring with Rest Pattern",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you extract specific properties from an object and collect all remaining properties into a new object?",
    shortAnswer: "Use object destructuring with a rest property: const { role, password, ...publicProfile } = user.",
    detailedExplanation: "- **Exclusion Pattern**: Elegant way to strip sensitive fields (passwords, tokens) before serializing or returning data.\n- **Shallow Copy**: The rest object `publicProfile` is a new shallow copy containing all properties not explicitly extracted.\n- **Trailing Requirement**: Just like rest parameters, the rest property `...rest` must be the last element in the destructuring pattern.",
    codeExample: "const userRecord = {\n  id: 101,\n  username: 'johndoe',\n  passwordHash: 'secret#123',\n  role: 'admin'\n};\n\n// Extracts passwordHash, gathers clean public fields:\nconst { passwordHash, ...safeUserData } = userRecord;\nconsole.log(safeUserData); // { id: 101, username: 'johndoe', role: 'admin' }",
    interviewTips: ["Mention object rest destructuring as the standard idiomatic way to omit/strip sensitive properties from an object."]
  },
  {
    topic: "Destructuring",
    subtopic: "Destructuring Existing Variables (Assignment Without Declaration)",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "Why does { a, b } = obj throw a SyntaxError when a and b are already declared, and how is it resolved?",
    shortAnswer: "The engine interprets a leading { as the start of a block of code, not an object. Wrap the entire assignment statement in parentheses: ({ a, b } = obj);.",
    detailedExplanation: "- **Grammar Ambiguity**: A statement beginning with `{` is parsed as a block statement.\n- **Parentheses Syntax**: Wrapping `({ a, b } = obj);` forces the parser to treat it as an expression.\n- **Mandatory Semicolon**: Ensure the preceding statement has a semicolon to prevent unintended function invocation parsing.",
    codeExample: "let a = 1;\nlet b = 2;\n\nconst newValues = { a: 10, b: 20 };\n\n// SYNTAX ERROR:\n// { a, b } = newValues; // SyntaxError: Unexpected token '='\n\n// CORRECT (Wrap in parentheses):\n({ a, b } = newValues);\nconsole.log(a, b); // 10 20",
    interviewTips: ["This is a classic senior JavaScript gotcha: destructuring assignment to pre-declared variables requires surrounding parentheses `({ ... } = obj);`."]
  },

  // ==========================================
  // TOPIC 8: Enhanced Object Literals
  // ==========================================
  {
    topic: "Enhanced Object Literals",
    subtopic: "Property Value Shorthand",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How does property shorthand work in ES6 object literals?",
    shortAnswer: "If an object key and a variable in scope have the same name, you can write just the variable name instead of key: variable.",
    detailedExplanation: "- **Cleaner Syntax**: `{ x, y }` replaces `{ x: x, y: y }`.\n- **Reduces Redundancy**: Common in module exports and factory functions returning objects.\n- **Mixed Properties**: Can be freely mixed with regular key-value assignments.",
    codeExample: "const username = 'alice';\nconst role = 'admin';\n\n// ES6 Property Shorthand:\nconst user = { username, role, active: true };\nconsole.log(user); // { username: 'alice', role: 'admin', active: true }",
    interviewTips: ["State that property shorthand eliminates repetitive `key: key` boilerplate in object declarations."]
  },
  {
    topic: "Enhanced Object Literals",
    subtopic: "Method Definition Shorthand",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How does ES6 concise method syntax differ from ES5 function properties?",
    shortAnswer: "ES6 allows defining methods directly as methodName() {} instead of methodName: function() {}, omitting the 'function' keyword and colon.",
    detailedExplanation: "- **Concise Syntax**: `greet() {}` instead of `greet: function() {}`.\n- **super Keyword**: Concise methods have a `[[HomeObject]]` binding, allowing them to use the `super` keyword to call prototype methods.\n- **Not Constructors**: Concise methods do NOT have a `prototype` property and cannot be invoked with `new`.",
    codeExample: "const calculator = {\n  value: 0,\n  // ES6 Concise Method Shorthand:\n  add(n) {\n    this.value += n;\n    return this;\n  }\n};\nconsole.log(calculator.add(5).value); // 5",
    interviewTips: ["Point out that concise methods are the only object methods that can use the `super` keyword."]
  },
  {
    topic: "Enhanced Object Literals",
    subtopic: "Computed Property Names",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What are computed property names in ES6 object literals and how are they written?",
    shortAnswer: "Computed property names allow using an expression inside square brackets [expression] as an object key directly inside the object literal definition.",
    detailedExplanation: "- **Pre-ES6 Limitation**: Previously, dynamic keys required creating the object first and assigning via bracket notation `obj[key] = value`.\n- **Inline Dynamic Keys**: Computed properties evaluate any expression (variables, functions, symbols) at object creation time.\n- **Useful for State Updates**: Widely used in form handlers: `[e.target.name]: e.target.value`.",
    codeExample: "const propName = 'user_' + 42;\n\nconst obj = {\n  [propName]: 'Alice',\n  ['computed_' + (1 + 2)]: 'Calculated'\n};\n\nconsole.log(obj.user_42);     // 'Alice'\nconsole.log(obj.computed_3);   // 'Calculated'",
    interviewTips: ["Cite dynamic form input state updates (`[e.target.name]: e.target.value`) as a primary real-world use case."]
  },
  {
    topic: "Enhanced Object Literals",
    subtopic: "Symbols as Computed Properties",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How are Symbols used as computed property keys to create unique or protocol properties?",
    shortAnswer: "Place the Symbol variable or expression inside square brackets [mySymbol]: value in the object literal.",
    detailedExplanation: "- **Collision-Proof Keys**: Symbols are guaranteed to be unique, preventing accidental property collisions.\n- **Protocol Implementation**: Implementing `[Symbol.iterator]() { ... }` makes any custom object directly iterable by `for...of`.\n- **Non-Enumerable by Default**: Symbol keys are skipped by `for...in` and `Object.keys()`.",
    codeExample: "const idSymbol = Symbol('id');\n\nconst employee = {\n  name: 'Bob',\n  [idSymbol]: 'EMP-9921'\n};\n\nconsole.log(employee[idSymbol]); // 'EMP-9921'\nconsole.log(Object.keys(employee)); // ['name'] (Symbol key is not listed)",
    interviewTips: ["Mention `[Symbol.iterator]` as the most famous example of computed Symbol properties in ES6."]
  },
  {
    topic: "Enhanced Object Literals",
    subtopic: "Method Shorthand and super Keyword",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "Why can ES6 concise methods use super while traditional function property assignments (fn: function()) cannot?",
    shortAnswer: "ES6 concise methods receive an internal [[HomeObject]] binding pointing to the object they were defined on, which the JavaScript engine requires to resolve super prototype lookups.",
    detailedExplanation: "- **[[HomeObject]]**: Created only for concise methods `method() {}` and class methods. Traditional `method: function() {}` lacks this internal slot.\n- **super Resolution**: `super.method()` looks up `Object.getPrototypeOf([[HomeObject]])`.\n- **SyntaxError**: Using `super` inside `method: function() { super.method(); }` throws a `SyntaxError: 'super' keyword unexpected here`.",
    codeExample: "const parent = {\n  greet() { return 'Hello from Parent'; }\n};\n\nconst child = {\n  // VALID: concise method has [[HomeObject]]\n  greet() {\n    return `${super.greet()} and Child`;\n  }\n};\nObject.setPrototypeOf(child, parent);\nconsole.log(child.greet()); // 'Hello from Parent and Child'",
    interviewTips: ["Mentioning the internal `[[HomeObject]]` slot proves deep ECMAScript specification knowledge."]
  },

  // ==========================================
  // TOPIC 9: Object.assign
  // ==========================================
  {
    topic: "Object.assign",
    subtopic: "Object.assign() Purpose & Signature",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What does Object.assign(target, ...sources) do and what does it return?",
    shortAnswer: "Object.assign() copies all own enumerable properties from one or more source objects to a target object and returns the mutated target object.",
    detailedExplanation: "- **Mutates Target**: The first argument `target` is modified in-place and returned.\n- **Cloning Pattern**: To create a new object without mutating inputs, pass an empty object as target: `Object.assign({}, source)`.\n- **Multiple Sources**: Sources are applied left-to-right; later sources overwrite earlier ones.",
    codeExample: "const target = { a: 1 };\nconst source1 = { b: 2 };\nconst source2 = { b: 3, c: 4 };\n\nconst result = Object.assign(target, source1, source2);\nconsole.log(target); // { a: 1, b: 3, c: 4 } (target was mutated!)\nconsole.log(result === target); // true",
    interviewTips: ["Always remember: `Object.assign` MUTATES the first argument (`target`)."]
  },
  {
    topic: "Object.assign",
    subtopic: "Object.assign vs Object Spread",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    question: "What are the key differences between Object.assign() and object spread syntax ({ ...obj })?",
    shortAnswer: "Object.assign() invokes setters on the target object and mutates it, whereas object spread syntax defines new properties on a fresh object literal without invoking prototype setters.",
    detailedExplanation: "- **Setter Trigger**: `Object.assign(target, src)` triggers setters defined on `target`; spread syntax `{ ...src }` creates brand new own properties using `DefineOwnProperty`.\n- **Target Mutation**: `Object.assign(target, ...)` mutates `target`; object spread always returns a brand new object instance.\n- **Syntax**: Object spread is cleaner and generally preferred in modern React and Redux codebases.",
    codeExample: "const targetWithSetter = {\n  set prop(val) { console.log('Setter called with:', val); }\n};\n\n// Triggers setter:\nObject.assign(targetWithSetter, { prop: 42 }); // Logs: 'Setter called with: 42'\n\n// Spread creates fresh object without triggering targetWithSetter:\nconst fresh = { ...targetWithSetter, prop: 42 };",
    interviewTips: ["Explain the difference between `[[Set]]` (Object.assign) and `[[DefineOwnProperty]]` (object spread)."]
  },
  {
    topic: "Object.assign",
    subtopic: "Shallow Copy Limitation in Object.assign",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "Does Object.assign() perform a deep clone or shallow clone of nested objects?",
    shortAnswer: "Object.assign() performs only a shallow copy; nested objects and arrays are copied by reference rather than being duplicated.",
    detailedExplanation: "- **Reference Sharing**: If a source object has a property pointing to an array or nested object, the target receives the exact same memory pointer.\n- **Mutation Side-Effects**: Mutating nested properties on the clone alters the original source object.\n- **Deep Cloning Solutions**: Use `structuredClone()` in modern browsers, `JSON.parse(JSON.stringify(obj))` for simple data, or libraries like Lodash `cloneDeep`.",
    codeExample: "const source = { config: { theme: 'dark' } };\nconst clone = Object.assign({}, source);\n\nclone.config.theme = 'light';\nconsole.log(source.config.theme); // 'light' (mutated because reference is shared!)",
    interviewTips: ["Clearly emphasize that `Object.assign` is strictly a shallow copy."]
  },
  {
    topic: "Object.assign",
    subtopic: "Copying Getters and Accessors",
    difficulty: "INTERMEDIATE",
    questionType: "OUTPUT",
    question: "What happens when Object.assign() copies an object property defined with a getter function?",
    shortAnswer: "Object.assign() evaluates the getter on the source object and copies the resulting evaluated static value to the target, completely losing the getter function itself.",
    detailedExplanation: "- **Getter Invocation**: `Object.assign` uses `[[Get]]` on the source, triggering the getter method during copy.\n- **Target State**: The target receives a normal data property containing the return value of the getter at that moment.\n- **Preserving Getters**: To copy getters and setters as accessor descriptors, use `Object.defineProperties(target, Object.getOwnPropertyDescriptors(src))`.",
    codeExample: "const source = {\n  get random() {\n    return Math.random();\n  }\n};\n\nconst copy = Object.assign({}, source);\nconsole.log(copy.random === copy.random); // true! (Frozen static number, getter is gone!)\nconsole.log(source.random === source.random); // false (evaluates afresh each read)",
    interviewTips: ["Explain that `Object.assign` evaluates getters into static values; use `Object.getOwnPropertyDescriptors` if you want to preserve getters."]
  },
  {
    topic: "Object.assign",
    subtopic: "Copying Symbol Properties",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "Does Object.assign() copy Symbol-keyed properties from source objects?",
    shortAnswer: "Yes, Object.assign() copies both string-keyed and Symbol-keyed own enumerable properties from source objects.",
    detailedExplanation: "- **Symbol Support**: Unlike `Object.keys()` which ignores Symbols, `Object.assign()` specifically copies own enumerable Symbols.\n- **Non-Enumerable Symbols**: Non-enumerable symbols are skipped.\n- **Use Case**: Safe for copying objects that use Symbol metadata identifiers.",
    codeExample: "const id = Symbol('id');\nconst source = {\n  name: 'Widget',\n  [id]: 402\n};\n\nconst copy = Object.assign({}, source);\nconsole.log(copy[id]); // 402 (Symbol was successfully copied!)\nconsole.log(Object.getOwnPropertySymbols(copy)); // [ Symbol(id) ]",
    interviewTips: ["Confirm that `Object.assign()` DOES copy enumerable Symbol properties."]
  },

  // ==========================================
  // TOPIC 10: Symbols
  // ==========================================
  {
    topic: "Symbols",
    subtopic: "Symbol Primitive and Uniqueness",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What is a Symbol in ES6 and what guarantees does it provide?",
    shortAnswer: "Symbol is a unique and immutable primitive data type introduced in ES6, guaranteed to be unique so that no two Symbols created with Symbol() are ever equal.",
    detailedExplanation: "- **Primitive Data Type**: 7th primitive type added to JavaScript alongside string, number, boolean, null, undefined, (and later BigInt).\n- **Optional Description**: `Symbol('desc')` takes an optional debug string, but it is purely for debugging and does not affect uniqueness.\n- **No 'new' Keyword**: Created via `Symbol()`, NOT `new Symbol()` (calling with `new` throws `TypeError`).",
    codeExample: "const sym1 = Symbol('id');\nconst sym2 = Symbol('id');\n\nconsole.log(sym1 === sym2); // false (Guaranteed unique!)\nconsole.log(typeof sym1);   // 'symbol'\n// const bad = new Symbol(); // TypeError: Symbol is not a constructor",
    interviewTips: ["State that `Symbol` is a primitive, not an object, which is why `new Symbol()` throws an error."]
  },
  {
    topic: "Symbols",
    subtopic: "Global Symbol Registry (Symbol.for and Symbol.keyFor)",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    question: "What is the global Symbol registry and how do Symbol.for() and Symbol.keyFor() work?",
    shortAnswer: "The global Symbol registry is a shared runtime table of Symbols. Symbol.for(key) searches the registry and returns an existing Symbol for that key or creates a new one; Symbol.keyFor(sym) returns the key string for a registered Symbol.",
    detailedExplanation: "- **Cross-Realm Sharing**: Symbols created via `Symbol.for()` are shared across iframes, service workers, and execution realms.\n- **Symbol() vs Symbol.for()**: `Symbol('app') === Symbol('app')` is `false`; `Symbol.for('app') === Symbol.for('app')` is `true`.\n- **Symbol.keyFor**: Returns the key if registered in the global registry, or `undefined` if created with `Symbol()`.",
    codeExample: "const s1 = Symbol.for('app.userId');\nconst s2 = Symbol.for('app.userId');\nconsole.log(s1 === s2); // true (retrieved from shared global registry)\n\nconsole.log(Symbol.keyFor(s1)); // 'app.userId'\n\nconst privateSym = Symbol('app.userId');\nconsole.log(Symbol.keyFor(privateSym)); // undefined (not in global registry)",
    interviewTips: ["Contrast `Symbol()` (always unique) with `Symbol.for()` (shared lookup in global registry)."]
  },
  {
    topic: "Symbols",
    subtopic: "Symbol Non-Enumerability in Iterations",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "How do for...in, Object.keys(), and JSON.stringify() treat Symbol-keyed properties?",
    shortAnswer: "Symbol-keyed properties are completely ignored by for...in loops, Object.keys(), Object.values(), and JSON.stringify().",
    detailedExplanation: "- **Hidden Metadata**: Ideal for attaching internal object metadata or library hooks without cluttering public property iterations.\n- **Not Truly Private**: Symbols can still be inspected using `Object.getOwnPropertySymbols(obj)` or `Reflect.ownKeys(obj)`.\n- **JSON Serialization**: `JSON.stringify()` drops Symbol keys silently.",
    codeExample: "const id = Symbol('id');\nconst user = { name: 'Alice', [id]: 101 };\n\nconsole.log(Object.keys(user));         // ['name'] (Symbol hidden)\nconsole.log(JSON.stringify(user));       // '{\"name\":\"Alice\"}' (Symbol omitted)\n\n// How to retrieve Symbol properties:\nconsole.log(Object.getOwnPropertySymbols(user)); // [ Symbol(id) ]\nconsole.log(Reflect.ownKeys(user));              // [ 'name', Symbol(id) ]",
    interviewTips: ["Clarify that Symbols are NOT private (they can be read via `Object.getOwnPropertySymbols`), but they are non-enumerable."]
  },
  {
    topic: "Symbols",
    subtopic: "Well-Known Symbols: Symbol.iterator",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "What is the well-known Symbol Symbol.iterator and what does it enable?",
    shortAnswer: "Symbol.iterator is a built-in Symbol that specifies the default iterator method for an object, allowing any object implementing [Symbol.iterator]() to be iterated with for...of loops and the spread operator.",
    detailedExplanation: "- **Iteration Protocol**: Built-in collections (Arrays, Strings, Sets, Maps) implement `[Symbol.iterator]` by default.\n- **Custom Iterables**: Any custom object defining `[Symbol.iterator]() { return { next() { ... } }; }` becomes iterable.\n- **Language Integration**: Powers `for...of`, `[...iterable]`, and `Array.from()`.",
    codeExample: "const countdown = {\n  from: 3,\n  [Symbol.iterator]() {\n    let current = this.from;\n    return {\n      next() {\n        return current > 0 \n          ? { value: current--, done: false } \n          : { done: true };\n      }\n    };\n  }\n};\n\nfor (const n of countdown) {\n  console.log(n); // 3, 2, 1\n}\nconsole.log([...countdown]); // [3, 2, 1]",
    interviewTips: ["Call `Symbol.iterator` the cornerstone of the ES6 iteration protocol."]
  },
  {
    topic: "Symbols",
    subtopic: "Well-Known Symbols: Symbol.toPrimitive",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "What does the Symbol.toPrimitive method do and what hint values does it receive?",
    shortAnswer: "Symbol.toPrimitive defines a method that converts an object into a corresponding primitive value, receiving a 'hint' argument ('number', 'string', or 'default').",
    detailedExplanation: "- **Replaces valueOf/toString**: Overrides the legacy `valueOf()` and `toString()` coercion algorithms.\n- **Hints**: Passed by engine: `'number'` (math operations), `'string'` (string interpolation/formatting), `'default'` (addition with binary `+`).\n- **Precise Coercion**: Gives objects complete control over how they convert in expressions.",
    codeExample: "const money = {\n  amount: 50,\n  currency: 'USD',\n  [Symbol.toPrimitive](hint) {\n    if (hint === 'number') return this.amount;\n    if (hint === 'string') return `${this.amount} ${this.currency}`;\n    return this.amount; // default hint\n  }\n};\n\nconsole.log(+money);       // 50 (number hint)\nconsole.log(`${money}`);   // '50 USD' (string hint)\nconsole.log(money + 10);   // 60 (default hint)",
    interviewTips: ["List the 3 hints: `'number'`, `'string'`, and `'default'`."]
  },
  {
    topic: "Symbols",
    subtopic: "Well-Known Symbols: Symbol.hasInstance",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How can you customize the behavior of the instanceof operator using Symbol.hasInstance?",
    shortAnswer: "Implement a static method [Symbol.hasInstance](instance) on a class or constructor function to customize whether an object is considered an instance of that class.",
    detailedExplanation: "- **Custom Type Validation**: `obj instanceof MyClass` internally invokes `MyClass[Symbol.hasInstance](obj)`.\n- **Structural Typing**: Allows implementing duck typing or range validations that work seamlessly with `instanceof`.\n- **Non-Constructible Types**: Allows creating non-constructor validator objects that support `instanceof`.",
    codeExample: "class EvenNumber {\n  static [Symbol.hasInstance](obj) {\n    return typeof obj === 'number' && obj % 2 === 0;\n  }\n}\n\nconsole.log(4 instanceof EvenNumber); // true\nconsole.log(7 instanceof EvenNumber); // false\nconsole.log('4' instanceof EvenNumber); // false",
    interviewTips: ["Mention that `instance instanceof Class` delegates directly to `Class[Symbol.hasInstance](instance)`."]
  },
  {
    topic: "Symbols",
    subtopic: "Type Coercion Rules for Symbols",
    difficulty: "INTERMEDIATE",
    questionType: "OUTPUT",
    question: "Can a Symbol be implicitly converted to a string or number?",
    shortAnswer: "No, Symbols cannot be implicitly coerced to numbers or strings (e.g. '' + sym or +sym throws a TypeError). They can only be explicitly converted via String(sym) or sym.toString(), and are truthy in boolean contexts.",
    detailedExplanation: "- **Implicit String Coercion**: `'' + Symbol('x')` throws `TypeError: Cannot convert a Symbol value to a string` to prevent accidental property name creation.\n- **Implicit Number Coercion**: `+Symbol()` throws `TypeError: Cannot convert a Symbol value to a number`.\n- **Explicit String**: `String(sym)` or `sym.toString()` returns `'Symbol(x)'`.\n- **Boolean**: Symbols are unconditionally truthy: `Boolean(Symbol()) === true`.",
    codeExample: "const sym = Symbol('token');\n\n// Explicit conversion (ALLOWED):\nconsole.log(String(sym)); // 'Symbol(token)'\nconsole.log(Boolean(sym)); // true\n\n// Implicit conversion (THROWS TypeError):\ntry {\n  const str = `Token: ${sym}`; // TypeError: Cannot convert a Symbol value to a string\n} catch (err) {\n  console.log(err.name); // 'TypeError'\n}",
    interviewTips: ["Highlight that template literals `${sym}` throw a TypeError because they attempt implicit string coercion."]
  }
];
