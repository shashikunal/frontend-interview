// scripts/es6-gen/topic-01-to-05.cjs
// Topics 1 - 5:
// 1. let, const and var
// 2. Template Literals
// 3. Arrow Functions
// 4. Default Parameters
// 5. Rest Parameters

module.exports = [
  // ==========================================
  // TOPIC 1: let, const and var
  // ==========================================
  {
    topic: "let, const and var",
    subtopic: "Block Scope vs Function Scope",
    difficulty: "EASY",
    questionType: "COMPARISON",
    question: "What is the difference in scoping between var, let, and const in ES6?",
    shortAnswer: "var is function-scoped (or globally-scoped if declared outside a function), while let and const are block-scoped, meaning they only exist within the curly braces {} where they are declared.",
    detailedExplanation: "- **Block Scope (`let`/`const`)**: Confined to any enclosing block (`if`, `for`, `while`, or standalone `{}`). They cannot be accessed outside the block.\n- **Function Scope (`var`)**: Ignores block boundaries (`if`, `for`) and is accessible anywhere within the enclosing function.\n- **Global Pollution**: Declaring `var` at the top level adds a property to `window`, whereas `let` and `const` do not.",
    codeExample: "if (true) {\n  var functionScoped = 'accessible outside';\n  let blockScoped = 'hidden outside';\n}\nconsole.log(functionScoped); // 'accessible outside'\n// console.log(blockScoped); // ReferenceError: blockScoped is not defined",
    interviewTips: ["Mention that block scope eliminates the classic loop counter bug where var leaked across iterations."]
  },
  {
    topic: "let, const and var",
    subtopic: "Temporal Dead Zone (TDZ)",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is the Temporal Dead Zone (TDZ) and how does it affect let and const?",
    shortAnswer: "The Temporal Dead Zone is the period between entering a scope and the variable declaration being evaluated, during which accessing the variable throws a ReferenceError.",
    detailedExplanation: "- **Hoisting Difference**: `var` is hoisted and initialized with `undefined`. `let` and `const` are hoisted into scope, but remain uninitialized.\n- **ReferenceError**: Attempting to read or write a `let`/`const` variable in its TDZ throws `ReferenceError: Cannot access 'x' before initialization`.\n- **typeof Check**: Even `typeof x` throws a ReferenceError if `x` is in the TDZ, unlike undeclared variables which return `'undefined'`.",
    codeExample: "console.log(myVar); // undefined (hoisted & initialized)\n// console.log(myLet); // ReferenceError: Cannot access 'myLet' before initialization (TDZ!)\n\nvar myVar = 10;\nlet myLet = 20;",
    interviewTips: ["Emphasize that `let` and `const` ARE hoisted, but they are not initialized until execution reaches their declaration."]
  },
  {
    topic: "let, const and var",
    subtopic: "Redeclaration Rules",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "How do redeclaration rules differ between var and let/const?",
    shortAnswer: "var allows you to redeclare the same variable multiple times in the same scope without error, while let and const forbid redeclaration and throw a SyntaxError.",
    detailedExplanation: "- **var Permissiveness**: In large scripts, re-declaring `var x` can accidentally overwrite earlier variables with the same name.\n- **let/const Safety**: Declaring `let a = 1; let a = 2;` causes an immediate compile-time `SyntaxError: Identifier 'a' has already been declared`.\n- **Shadowing in Inner Blocks**: You CAN declare a variable with the same name inside a nested inner block (variable shadowing).",
    codeExample: "var x = 1;\nvar x = 2; // Allowed without error\n\nlet y = 1;\n// let y = 2; // SyntaxError: Identifier 'y' has already been declared\n\nif (true) {\n  let y = 10; // Allowed: shadowed in a new block scope\n}",
    interviewTips: ["Point out that preventing redeclaration catches accidental variable overwrites before code ever runs."]
  },
  {
    topic: "let, const and var",
    subtopic: "const Immutability vs Object Mutation",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "Does const create an immutable value in JavaScript?",
    shortAnswer: "No, const creates an immutable variable binding (the variable cannot be reassigned to a new memory address), but the contents of objects and arrays assigned to const can still be mutated.",
    detailedExplanation: "- **Binding Immutability**: Reassigning `const x = 5; x = 10;` throws `TypeError: Assignment to constant variable`.\n- **Internal Mutation**: You can push to an array or mutate object properties: `const obj = {}; obj.name = 'Alice';`.\n- **True Immutability**: To prevent object property mutations, you must call `Object.freeze(obj)`.",
    codeExample: "const user = { name: 'Alice' };\nuser.name = 'Bob'; // Allowed! Object properties can be mutated.\n\n// user = { name: 'Charlie' }; // TypeError: Assignment to constant variable!\n\nconst frozen = Object.freeze({ count: 1 });\n// frozen.count = 2; // Fails silently (or throws in strict mode)",
    interviewTips: ["Use the phrase: 'const protects the variable binding, not the object structure.'"]
  },
  {
    topic: "let, const and var",
    subtopic: "Loop Closure Problem (var vs let in for loops)",
    difficulty: "INTERMEDIATE",
    questionType: "OUTPUT",
    question: "What is the output of setTimeout inside a for loop with var versus let?",
    shortAnswer: "With var, all setTimeout callbacks log 3 because a single shared variable is mutated. With let, each iteration creates a new lexical binding, logging 0, 1, 2.",
    detailedExplanation: "- **var in Loops**: A single `i` variable is shared across the entire function. By the time `setTimeout` runs, the loop has completed and `i` equals 3.\n- **let in Loops**: ES6 specifies that `for (let i = 0; ...)` creates a new lexical environment for every iteration, capturing the current value of `i` in each closure.\n- **Pre-ES6 Workaround**: Before ES6, developers had to wrap each loop in an IIFE to capture the value.",
    codeExample: "// Using var:\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log('var:', i), 10); // Logs: var: 3, var: 3, var: 3\n}\n\n// Using let:\nfor (let j = 0; j < 3; j++) {\n  setTimeout(() => console.log('let:', j), 10); // Logs: let: 0, let: 1, let: 2\n}",
    interviewTips: ["Explain that ES6 creates a brand new binding for each iteration of a `for (let ...)` loop."]
  },
  {
    topic: "let, const and var",
    subtopic: "Global Object Property Attachment",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "How do top-level var declarations differ from top-level let/const declarations regarding the global window object?",
    shortAnswer: "Top-level var declarations attach properties directly to the global object (window or globalThis), whereas let and const declarations do not attach to the global object.",
    detailedExplanation: "- **var on Window**: In browser global scope, `var age = 30;` creates `window.age = 30`.\n- **let/const Isolation**: In the same scope, `let count = 5;` creates a variable in the script declarative record, so `window.count` remains `undefined`.\n- **Global Namespace Protection**: `let` and `const` avoid accidental overwrites of existing `window` properties like `window.name` or `window.status`.",
    codeExample: "var globalVar = 'I am on window';\nlet globalLet = 'I am NOT on window';\n\nconsole.log(window.globalVar); // 'I am on window'\nconsole.log(window.globalLet); // undefined",
    interviewTips: ["Mention that `let` and `const` protect against polluting and colliding with built-in `window` properties."]
  },
  {
    topic: "let, const and var",
    subtopic: "TDZ with typeof Operator",
    difficulty: "INTERMEDIATE",
    questionType: "OUTPUT",
    question: "What is the result of typeof x when x is undeclared versus when x is declared with let later in the block?",
    shortAnswer: "If x is completely undeclared, `typeof x` safely returns 'undefined'. If x is declared with let later in the block, `typeof x` throws a ReferenceError due to the Temporal Dead Zone.",
    detailedExplanation: "- **Safe Undeclared**: Historically, `typeof` was considered safe because `typeof nonexistent` never threw an error.\n- **TDZ Breaks Safety**: In ES6, TDZ takes precedence: accessing a `let` or `const` identifier before its line of declaration throws `ReferenceError`.\n- **Proof of Hoisting**: This behavior proves `let` is hoisted into the block, because if it wasn't, `typeof` would see it as undeclared.",
    codeExample: "// Completely undeclared:\nconsole.log(typeof completelyUndeclared); // 'undefined'\n\n// In TDZ:\nfunction test() {\n  // console.log(typeof blockScoped); // ReferenceError: Cannot access 'blockScoped' before initialization\n  let blockScoped = 10;\n}",
    interviewTips: ["Cite `typeof` throwing in the TDZ as undeniable proof that `let` and `const` are hoisted into block scope."]
  },
  {
    topic: "let, const and var",
    subtopic: "const Declaration Without Initialization",
    difficulty: "EASY",
    questionType: "CODE",
    question: "Can a const variable be declared without an immediate initial value?",
    shortAnswer: "No, a const variable must be initialized during its declaration, otherwise JavaScript throws an immediate SyntaxError.",
    detailedExplanation: "- **Mandatory Initialization**: Because a `const` variable can never be reassigned, creating one without a value would leave it permanently `undefined`.\n- **Syntax Requirement**: `const x;` fails at parse time with `SyntaxError: Missing initializer in const declaration`.\n- **Contrast with let**: `let y;` is valid and initializes `y` to `undefined`.",
    codeExample: "let a; // Valid: a is undefined\na = 10;\n\n// const b; // SyntaxError: Missing initializer in const declaration\nconst b = 20; // Valid",
    interviewTips: ["State that `const` requires an initializer because it cannot be reassigned later."]
  },

  // ==========================================
  // TOPIC 2: Template Literals
  // ==========================================
  {
    topic: "Template Literals",
    subtopic: "Template Literal Syntax and Interpolation",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What are template literals in ES6 and what advantages do they provide over string concatenation?",
    shortAnswer: "Template literals are string literals delimited with backticks (``) that support embedded expressions via ${expression}, multiline strings without escape sequences, and string formatting.",
    detailedExplanation: "- **String Interpolation**: Embed variables and expressions directly via `${varName}`, replacing messy `+` string concatenations.\n- **Multiline Strings**: Native multiline support without needing `\\n` or backslash line continuations.\n- **Arbitrary Expressions**: Anything that evaluates to a value (ternary expressions, function calls, arithmetic) can be embedded inside `${}`.",
    codeExample: "const user = 'Alice';\nconst role = 'Admin';\n\n// String Interpolation:\nconst greeting = `Hello, ${user}! Your role is: ${role}.`;\n\n// Multiline String:\nconst html = `\n  <div>\n    <p>${greeting}</p>\n  </div>\n`;",
    interviewTips: ["Mention that template literals evaluate any valid JavaScript expression inside `${}`, including function calls."]
  },
  {
    topic: "Template Literals",
    subtopic: "Embedded Expressions and Ternaries",
    difficulty: "EASY",
    questionType: "CODE",
    question: "Can you execute function calls and ternary operators inside template literal placeholders?",
    shortAnswer: "Yes, any valid JavaScript expression—including ternary operators, math operations, and function calls—can be placed inside ${}.",
    detailedExplanation: "- **Expressions vs Statements**: Any expression that yields a value works; statements like `if/else` or `for` loops cannot be used directly inside `${}`.\n- **Ternary Operator**: Commonly used for conditional string output: `${isOnline ? 'Online' : 'Offline'}`.\n- **Function Invocations**: Functions execute synchronously and their return values are coerced to strings.",
    codeExample: "const items = ['apple', 'orange'];\nconst status = `Cart: ${items.length} ${items.length === 1 ? 'item' : 'items'} (Total: $${calculateTotal(items)})`;\n\nfunction calculateTotal(arr) {\n  return arr.length * 1.5;\n}",
    interviewTips: ["Clarify that expressions work inside `${}`, but statements (like `if` statements) do not."]
  },
  {
    topic: "Template Literals",
    subtopic: "Tagged Templates",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What are tagged template literals and what arguments does the tag function receive?",
    shortAnswer: "Tagged templates allow you to parse template literals with a custom function. The tag function receives an array of literal string segments as its first argument, followed by the evaluated expression values.",
    detailedExplanation: "- **Syntax**: `tagFunction`string text ${expr} more text``.\n- **First Argument**: An array of static strings around the expressions (e.g. `['string text ', ' more text']`).\n- **Subsequent Arguments**: The evaluated values of the `${}` placeholders (captured using rest parameters `...values`).\n- **Real-World Uses**: Libraries like `styled-components`, HTML escaping helpers, GraphQL query parsers (`gql`), and SQL query builders.",
    codeExample: "function highlight(strings, ...values) {\n  return strings.reduce((acc, str, i) => {\n    const val = values[i] ? `<mark>${values[i]}</mark>` : '';\n    return `${acc}${str}${val}`;\n  }, '');\n}\n\nconst user = 'Alice';\nconst action = 'logged in';\nconst output = highlight`User ${user} has ${action}.`;\nconsole.log(output); // 'User <mark>Alice</mark> has <mark>logged in</mark>.'",
    interviewTips: ["Point to `styled-components` in React or GraphQL `gql` as famous production examples of tagged templates."]
  },
  {
    topic: "Template Literals",
    subtopic: "Raw Strings (String.raw)",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "What does String.raw do and how does it handle backslashes and escape sequences?",
    shortAnswer: "String.raw is a built-in tag function that returns the raw string without processing escape sequences like \\n or \\t.",
    detailedExplanation: "- **Preserves Backslashes**: Treats `\\n` as two literal characters (backslash and 'n') rather than a newline.\n- **Regex and File Paths**: Ideal for writing Windows file paths (`C:\\new\\test`) and complex regular expressions without double-escaping backslashes (`\\\\`).\n- **strings.raw Property**: Inside custom tagged template functions, `strings.raw` provides access to the raw strings.",
    codeExample: "const normal = `Hello\\nWorld`;\nconsole.log(normal); // Logs on two separate lines\n\nconst raw = String.raw`Hello\\nWorld`;\nconsole.log(raw); // Logs literal string: 'Hello\\nWorld'\n\nconst windowsPath = String.raw`C:\\projects\\new_app`;\nconsole.log(windowsPath); // 'C:\\projects\\new_app'",
    interviewTips: ["Cite Windows file paths and regex strings as primary use cases for `String.raw`."]
  },
  {
    topic: "Template Literals",
    subtopic: "HTML Escaping with Tagged Templates",
    difficulty: "INTERMEDIATE",
    questionType: "SECURITY",
    question: "How can a tagged template be used as an XSS sanitizer function for dynamic HTML markup?",
    shortAnswer: "A tag function can automatically sanitize all dynamic `${}` expression values by escaping special HTML characters before concatenating them with static string segments.",
    detailedExplanation: "- **Safe Interpolation**: Prevents user-injected `<script>` or `<img onerror>` tags from executing.\n- **Separation**: The function has clear separation between trusted static strings (first argument) and untrusted dynamic values (subsequent arguments).\n- **Framework Adoption**: Libraries like `lit-html` and `hyperHTML` use this exact pattern for safe, fast template rendering.",
    codeExample: "function safeHtml(strings, ...values) {\n  const escape = (str) => String(str).replace(/[&<>'\"/]/g, s => (\n    { '&': '&amp;', '<': '&lt;', '>': '&gt;', \"'\": '&#39;', '\"': '&quot;', '/': '&#x2F;' }[s]\n  ));\n  return strings.reduce((acc, str, i) => acc + str + (values[i] ? escape(values[i]) : ''), '');\n}\n\nconst userInput = '<script>alert(\"XSS\")</script>';\nconst markup = safeHtml`<div class=\"comment\">${userInput}</div>`;\nconsole.log(markup); // '<div class=\"comment\">&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;</div>'",
    interviewTips: ["Explain that tagged templates know which parts are author-written strings and which parts are untrusted user inputs."]
  },

  // ==========================================
  // TOPIC 3: Arrow Functions
  // ==========================================
  {
    topic: "Arrow Functions",
    subtopic: "Arrow Function Syntax and Returns",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How does implicit return work in ES6 arrow functions?",
    shortAnswer: "When an arrow function has a single expression without curly braces {}, that expression is automatically evaluated and returned without requiring the 'return' keyword.",
    detailedExplanation: "- **Concise Body**: `(a, b) => a + b` automatically returns the sum.\n- **Block Body**: When curly braces `{}` are used, you MUST explicitly write `return`: `(a, b) => { return a + b; }`.\n- **Single Parameter**: Parentheses around the parameter are optional if there is exactly one parameter: `x => x * 2`.",
    codeExample: "// Implicit return:\nconst double = x => x * 2;\n\n// Explicit return (mandatory when using braces):\nconst add = (a, b) => {\n  const result = a + b;\n  return result;\n};",
    interviewTips: ["Warn that adding curly braces `{}` without a `return` keyword causes the function to return `undefined`."]
  },
  {
    topic: "Arrow Functions",
    subtopic: "Returning Object Literals in Arrow Functions",
    difficulty: "EASY",
    questionType: "CODE",
    question: "Why does () => { count: 1 } return undefined, and how do you return an object literal implicitly?",
    shortAnswer: "The engine interprets curly braces {} as a function block body rather than an object literal. To return an object implicitly, wrap the object in parentheses: () => ({ count: 1 }).",
    detailedExplanation: "- **Ambiguity Resolution**: The JavaScript grammar parses `{` following `=>` as the start of a block of statements.\n- **Label Trap**: In `{ count: 1 }`, `count:` is parsed as a statement label, and `1` is an unused statement expression, returning `undefined`.\n- **Parentheses Syntax**: Wrapping the object in parentheses `({ ... })` signals an expression.",
    codeExample: "// BUG: Returns undefined!\nconst makeUserBug = (name) => { name: name };\nconsole.log(makeUserBug('Alice')); // undefined\n\n// FIX: Wrap in parentheses\nconst makeUser = (name) => ({ name: name });\nconsole.log(makeUser('Alice')); // { name: 'Alice' }",
    interviewTips: ["This is a classic junior-to-mid interview bug: wrapping object literals in parentheses `({ ... })` fixes it."]
  },
  {
    topic: "Arrow Functions",
    subtopic: "Lexical this Binding",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is lexical 'this' in arrow functions and how does it differ from regular functions?",
    shortAnswer: "Arrow functions do not bind their own 'this'; they inherit 'this' from the enclosing lexical scope at the time they are defined, ignoring call-time binding via method invocation, call(), apply(), or bind().",
    detailedExplanation: "- **Regular Functions**: Have dynamic `this` determined by HOW the function is called (e.g. `obj.method()`, standalone call, or constructor).\n- **Arrow Functions**: Capture `this` from the outer scope just like any ordinary variable.\n- **Callbacks**: Perfect for timers, promises, and array iterators inside class methods because they preserve the class instance `this` without `.bind(this)`.",
    codeExample: "function Timer() {\n  this.seconds = 0;\n  // Arrow function retains 'this' pointing to Timer instance:\n  setInterval(() => {\n    this.seconds++;\n    console.log(this.seconds);\n  }, 1000);\n}\n\n// In contrast, a regular function would have 'this' point to window or undefined!",
    interviewTips: ["State clearly: 'Arrow functions do not have their own this; they capture this from their enclosing lexical context.'"]
  },
  {
    topic: "Arrow Functions",
    subtopic: "Arrow Functions as Object Methods",
    difficulty: "INTERMEDIATE",
    questionType: "OUTPUT",
    question: "What happens when an arrow function is used as an object method and references this?",
    shortAnswer: "'this' refers to the outer scope where the object was created (typically window or global), NOT the object itself, usually leading to undefined property lookups.",
    detailedExplanation: "- **Objects Do Not Create Scope**: An object literal `{}` does NOT create a new lexical scope; only functions, blocks, and modules create scope.\n- **Outer Fallback**: An arrow function declared inside an object literal inherits `this` from whatever scope enclosed the object declaration.\n- **Best Practice**: Always use ES6 method shorthand `method() { ... }` or regular functions for object methods.",
    codeExample: "const person = {\n  name: 'Alice',\n  // BUG: 'this' is NOT person, it is the outer scope (e.g. window)!\n  greetArrow: () => `Hello, ${this.name}`,\n  // CORRECT: Method shorthand binds 'this' dynamically to person:\n  greetMethod() {\n    return `Hello, ${this.name}`;\n  }\n};\n\nconsole.log(person.greetArrow());  // 'Hello, undefined'\nconsole.log(person.greetMethod()); // 'Hello, Alice'",
    interviewTips: ["Never use arrow functions for object methods that need access to `this`."]
  },
  {
    topic: "Arrow Functions",
    subtopic: "Lack of arguments Object",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "Do arrow functions have their own arguments object? How do you access all parameters?",
    shortAnswer: "No, arrow functions do not have their own arguments object; referencing 'arguments' accesses the arguments of the enclosing regular function. Use ES6 rest parameters (...args) instead.",
    detailedExplanation: "- **Lexical arguments**: Just like `this`, `arguments` is lexically resolved from the outer scope.\n- **Global Scope Error**: In global scope (or in ES modules), referencing `arguments` inside an arrow function throws a `ReferenceError`.\n- **Modern Solution**: Rest parameters (`(...args) => ...`) provide a true JavaScript Array with all passed arguments.",
    codeExample: "const sum = (...args) => {\n  // args is a real Array:\n  return args.reduce((acc, n) => acc + n, 0);\n};\nconsole.log(sum(1, 2, 3, 4)); // 10\n\nfunction outer() {\n  const arrow = () => console.log(arguments[0]); // Captures outer's arguments!\n  arrow('inner');\n}\nouter('outer argument'); // Logs: 'outer argument'",
    interviewTips: ["Highlight that rest parameters (`...args`) are superior anyway because they form a real array, not an array-like object."]
  },
  {
    topic: "Arrow Functions",
    subtopic: "Arrow Functions Cannot Be Used as Constructors",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "Why does calling 'new' on an arrow function throw a TypeError?",
    shortAnswer: "Arrow functions lack an internal [[Construct]] method and do not have a prototype property, so the engine throws a TypeError: ... is not a constructor.",
    detailedExplanation: "- **No [[Construct]]**: The ECMAScript specification defines arrow functions strictly as callable subroutines, omitting the constructor internal method.\n- **No prototype**: `arrowFunc.prototype` is `undefined`, meaning there is no prototype object for a newly constructed instance to inherit from.\n- **Performance**: Omitting constructor logic and prototype objects makes arrow functions lightweight.",
    codeExample: "const Person = (name) => {\n  this.name = name;\n};\n\nconsole.log(Person.prototype); // undefined\n// const p = new Person('Alice'); // TypeError: Person is not a constructor",
    interviewTips: ["State the two technical reasons: arrow functions lack a `prototype` property and do not have an internal `[[Construct]]` method."]
  },
  {
    topic: "Arrow Functions",
    subtopic: "Arrow Functions with call(), apply(), and bind()",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "How do call(), apply(), and bind() affect the 'this' value of an arrow function?",
    shortAnswer: "call(), apply(), and bind() cannot change the 'this' of an arrow function; the first argument (thisArg) is completely ignored.",
    detailedExplanation: "- **Fixed Lexical this**: The lexical binding of `this` is established permanently when the arrow function is created.\n- **Parameter Passing Still Works**: While `thisArg` is ignored, you can still pass argument parameters via `call(null, arg1, arg2)` or `apply(null, [args])`.\n- **No Overriding**: You cannot override an arrow function's `this` context under any circumstances.",
    codeExample: "const objA = { name: 'A' };\nconst objB = { name: 'B' };\n\nfunction makeArrow() {\n  return () => console.log(this.name);\n}\n\nconst arrow = makeArrow.call(objA); // 'this' bound to objA\narrow(); // 'A'\n\n// Attempts to re-bind 'this' to objB are ignored:\narrow.call(objB); // Still 'A'!\narrow.apply(objB); // Still 'A'",
    interviewTips: ["State clearly that `call`, `apply`, and `bind` cannot override an arrow function's `this`."]
  },
  {
    topic: "Arrow Functions",
    subtopic: "Arrow Functions Cannot Be Generators",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "Can an arrow function be used as a generator function using yield?",
    shortAnswer: "No, arrow functions cannot be declared as generators; the syntax () => * is invalid, and using yield inside an arrow function throws a SyntaxError.",
    detailedExplanation: "- **Syntax Limitation**: The `function*` declaration is required for generators.\n- **Yield Context**: `yield` is only valid directly inside the body of a `function*` generator.\n- **Specification Design**: Generators require complex iterator and execution context machinery that arrow functions were explicitly designed to avoid.",
    codeExample: "// INVALID SYNTAX (SyntaxError):\n// const myGen = *() => { yield 1; };\n// const myGen = () =>* { yield 1; };\n\n// CORRECT (Standard generator function):\nfunction* myGen() {\n  yield 1;\n  yield 2;\n}",
    interviewTips: ["Mention that arrow functions cannot be generators, cannot be constructors, and have no prototype."]
  },

  // ==========================================
  // TOPIC 4: Default Parameters
  // ==========================================
  {
    topic: "Default Parameters",
    subtopic: "Default Values and undefined vs null",
    difficulty: "EASY",
    questionType: "COMPARISON",
    question: "When are ES6 default parameters triggered? How do they treat undefined versus null?",
    shortAnswer: "Default parameters trigger ONLY when an argument is missing or explicitly passed as undefined. If null, false, 0, or '' is passed, the default parameter is NOT triggered.",
    detailedExplanation: "- **Falsy vs Undefined**: The pre-ES6 idiom `x = x || 'default'` triggered on any falsy value (`0`, `''`, `false`), causing unintended bugs.\n- **Strict Trigger**: ES6 default parameters trigger strictly when `arg === undefined`.\n- **null Preservation**: If you pass `null`, the parameter receives `null`.",
    codeExample: "function greet(name = 'Guest') {\n  return `Hello, ${name}`;\n}\n\nconsole.log(greet());          // 'Hello, Guest' (missing arg -> default)\nconsole.log(greet(undefined)); // 'Hello, Guest' (undefined -> default)\nconsole.log(greet(null));      // 'Hello, null' (null is NOT replaced!)\nconsole.log(greet(''));        // 'Hello, ' (empty string is preserved)",
    interviewTips: ["Emphasize that `null` does NOT trigger default parameters—only `undefined` does."]
  },
  {
    topic: "Default Parameters",
    subtopic: "Expressions as Default Parameters",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "Can default parameters use function calls or expressions, and when are they evaluated?",
    shortAnswer: "Yes, default parameters can be dynamic expressions or function calls, and they are evaluated lazily at call time only when the parameter is missing or undefined.",
    detailedExplanation: "- **Lazy Evaluation**: The default expression is NOT evaluated when the script parses; it runs only when the function is invoked without that argument.\n- **Unique Execution**: If a function call generates a default value (e.g. `id = generateId()`), the generator executes afresh on each omitted call.\n- **Parameters in Scope**: Default expressions can reference earlier parameters in the same signature.",
    codeExample: "let callCount = 0;\nfunction getTimestamp() {\n  callCount++;\n  return Date.now();\n}\n\nfunction logEvent(msg, time = getTimestamp()) {\n  console.log(`${msg} at ${time}`);\n}\n\nlogEvent('First'); // getTimestamp() is evaluated (callCount: 1)\nlogEvent('Second', 1000); // getTimestamp() is NOT called (callCount remains 1)",
    interviewTips: ["Highlight lazy evaluation: default expressions only execute when the argument is omitted."]
  },
  {
    topic: "Default Parameters",
    subtopic: "Referencing Previous Parameters in Defaults",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "Can a default parameter reference other parameters defined in the same function signature?",
    shortAnswer: "Yes, later parameters can reference earlier parameters (e.g. width, height = width * 2), but earlier parameters cannot reference later ones due to the Temporal Dead Zone.",
    detailedExplanation: "- **Left-to-Right Scope**: Parameters are evaluated sequentially from left to right in their own intermediate parameter scope.\n- **Valid Forward Reference**: `(width, height = width * 2)` works because `width` is already initialized.\n- **TDZ Error**: `(width = height * 2, height = 10)` throws `ReferenceError: Cannot access 'height' before initialization`.",
    codeExample: "// VALID:\nfunction makeArea(width, height = width) {\n  return width * height;\n}\nconsole.log(makeArea(5)); // 25 (height defaults to width)\n\n// INVALID (TDZ ReferenceError):\n// function badArea(width = height, height = 5) { ... }\n// badArea(undefined, 10); // ReferenceError!",
    interviewTips: ["Explain that parameters are evaluated left-to-right, so defaults can only read earlier parameters."]
  },
  {
    topic: "Default Parameters",
    subtopic: "Default Parameters and Function length Property",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "How do default parameters affect the fn.length property of a function?",
    shortAnswer: "fn.length only counts parameters before the first parameter with a default value, excluding parameters with default values and rest parameters.",
    detailedExplanation: "- **fn.length Definition**: Reports the number of expected arguments.\n- **Cutoff Rule**: Once a parameter has a default value, it and all subsequent parameters are excluded from `.length`.\n- **Rest Parameters**: Rest parameters (`...rest`) are never included in `fn.length`.",
    codeExample: "function fn1(a, b, c) {}\nconsole.log(fn1.length); // 3\n\nfunction fn2(a, b = 1, c) {}\nconsole.log(fn2.length); // 1 (stops at first default parameter!)\n\nfunction fn3(a = 1, b, c) {}\nconsole.log(fn3.length); // 0",
    interviewTips: ["This is a favorite trick question: `fn.length` stops counting as soon as it encounters the first parameter with a default value."]
  },
  {
    topic: "Default Parameters",
    subtopic: "Mandatory Parameter Validation Pattern",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How can you use default parameter expressions to enforce required function arguments without manual if-checks?",
    shortAnswer: "Assign a default parameter to a helper function that throws an error: param = required('paramName'). If the argument is omitted, the helper executes and throws immediately.",
    detailedExplanation: "- **Clean Code**: Eliminates repetitive `if (!param) throw new Error(...)` blocks at the top of functions.\n- **Lazy Execution**: The `required()` function only runs when the caller fails to provide the argument.\n- **Self-Documenting**: Makes required parameters explicit in the function signature.",
    codeExample: "function required(paramName) {\n  throw new Error(`Missing mandatory parameter: '${paramName}'`);\n}\n\nfunction createUser(username = required('username'), email = required('email')) {\n  return { username, email };\n}\n\nconsole.log(createUser('alice', 'alice@test.com')); // Valid\n// createUser('alice'); // Throws Error: Missing mandatory parameter: 'email'",
    interviewTips: ["Demonstrate this pattern to show elegant, modern ES6 API design skills."]
  },

  // ==========================================
  // TOPIC 5: Rest Parameters
  // ==========================================
  {
    topic: "Rest Parameters",
    subtopic: "Rest Parameter Syntax & Collection",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What are rest parameters in ES6 and how do they collect remaining arguments?",
    shortAnswer: "Rest parameter syntax (...paramName) collects all remaining arguments into a true JavaScript Array instance.",
    detailedExplanation: "- **Syntax**: Prefixed with three dots: `function myFunc(first, ...rest) { ... }`.\n- **True Array**: Unlike the legacy `arguments` object, rest parameters are genuine `Array` instances, meaning methods like `.map()`, `.filter()`, and `.reduce()` work directly.\n- **Empty Array**: If no remaining arguments are supplied, the rest parameter evaluates to an empty array `[]`, not `undefined`.",
    codeExample: "function multiply(multiplier, ...numbers) {\n  // numbers is a true Array:\n  return numbers.map(n => n * multiplier);\n}\n\nconsole.log(multiply(2, 10, 20, 30)); // [20, 40, 60]\nconsole.log(multiply(5));             // []",
    interviewTips: ["Stress that rest parameters are real Arrays, eliminating `Array.prototype.slice.call(arguments)`."]
  },
  {
    topic: "Rest Parameters",
    subtopic: "Rest Parameter Syntax Rules (Must Be Last)",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "What syntax rules must be followed when using rest parameters in function definitions?",
    shortAnswer: "A rest parameter MUST be the last parameter in the function signature, and there can only be ONE rest parameter per function.",
    detailedExplanation: "- **Trailing Only**: Placing any parameter after a rest parameter (`(...rest, last)`) throws `SyntaxError: Rest parameter must be last formal parameter`.\n- **Single Rest Only**: Having multiple rest parameters (`(...a, ...b)`) throws a SyntaxError.\n- **Destructuring in Rest**: You can destructure directly inside a rest parameter: `function foo(...[first, second])`.",
    codeExample: "// VALID:\nfunction valid(a, b, ...others) {}\n\n// INVALID (Throws SyntaxError):\n// function invalid(...others, last) {}\n// function invalidMultiple(...first, ...second) {}",
    interviewTips: ["Remember: Exactly one rest parameter per function, and it MUST be the final parameter."]
  },
  {
    topic: "Rest Parameters",
    subtopic: "Rest Parameters vs arguments Object",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    question: "What are the key differences between rest parameters and the arguments object?",
    shortAnswer: "Rest parameters are real Array instances containing only un-named remaining arguments, whereas arguments is an array-like object containing all arguments passed to the function and is absent in arrow functions.",
    detailedExplanation: "- **Type**: Rest parameters are real `Array` instances (`instanceof Array === true`); `arguments` is an array-like object lacking methods like `.map()`.\n- **Selective**: Rest parameters collect only remaining un-named arguments; `arguments` holds all arguments.\n- **Arrow Functions**: Arrow functions do NOT have their own `arguments` object, but DO support rest parameters.\n- **Strict Mode Cleanliness**: `arguments` has historical oddities like syncing with named parameters in non-strict mode, which rest parameters eliminate.",
    codeExample: "function demo(first, ...rest) {\n  console.log(Array.isArray(rest));      // true\n  console.log(Array.isArray(arguments)); // false\n  \n  console.log(rest);      // [2, 3]\n  console.log(arguments); // [Arguments] { '0': 1, '1': 2, '2': 3 }\n}\ndemo(1, 2, 3);",
    interviewTips: ["List the 3 key contrasts: 1) Real Array vs Array-like, 2) Subset vs All args, 3) Supported in arrow functions."]
  },
  {
    topic: "Rest Parameters",
    subtopic: "Rest Parameters in Setter Functions",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "Can an ES6 class or object setter method use a rest parameter?",
    shortAnswer: "No, setters must have exactly one parameter; declaring a setter with a rest parameter throws a SyntaxError: Setter function must have exactly one parameter.",
    detailedExplanation: "- **Specification Constraint**: Setters are invoked via assignment expressions (`obj.prop = value`), which only supply a single value.\n- **SyntaxError**: Defining `set myProp(...args)` fails at parse time.\n- **Getters**: Getters must have exactly zero parameters (`get myProp()`).",
    codeExample: "class Config {\n  // VALID:\n  set theme(value) { this._theme = value; }\n  \n  // INVALID (SyntaxError: Setter function must have exactly one parameter):\n  // set theme(...values) {}\n}",
    interviewTips: ["Remember: Setters require exactly one formal parameter; rest parameters are forbidden."]
  },
  {
    topic: "Rest Parameters",
    subtopic: "Destructuring Inside Rest Parameters",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How can you combine destructuring syntax directly inside a rest parameter?",
    shortAnswer: "You can write array destructuring inside the rest parameter: function foo(...[first, second]) to collect and destructure arguments in the function signature.",
    detailedExplanation: "- **Pattern**: `...[a, b]` collects remaining arguments into an array and immediately destructures the first two elements.\n- **Length Impact**: Even when destructured, the presence of the rest syntax sets `fn.length` to 0 (or count of prior non-default params).\n- **Use Case**: Cleanly extracting the first couple of variadic arguments while discarding or ignoring extra ones.",
    codeExample: "function logCoordinates(...[x, y, z = 0]) {\n  console.log(`X: ${x}, Y: ${y}, Z: ${z}`);\n}\n\nlogCoordinates(10, 20);     // 'X: 10, Y: 20, Z: 0'\nlogCoordinates(10, 20, 30); // 'X: 10, Y: 20, Z: 30'",
    interviewTips: ["Demonstrate `...[x, y]` to show advanced parameter destructuring fluency."]
  }
];
