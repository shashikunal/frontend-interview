// scripts/create-generators.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GEN_DIR = path.resolve(__dirname, 'generators');

if (!fs.existsSync(GEN_DIR)) {
  fs.mkdirSync(GEN_DIR, { recursive: true });
}

// Helper to write subject generator
function writeGenerator(filename, subjectId, subjectName, topicsData) {
  const code = `// scripts/generators/${filename}
// 100% PURE ${subjectName.toUpperCase()} Interview Questions Generator

export function generate${subjectId.charAt(0).toUpperCase() + subjectId.slice(1).replace(/-([a-z])/g, g => g[1].toUpperCase())}Question(index) {
  const num = index + 1;
  const id = \`iq-${subjectId}-\${String(num).padStart(4, '0')}\`;

  let difficulty = 'EASY';
  let experienceLevel = 'FRESHER';

  if (index < 400) {
    difficulty = 'EASY';
    experienceLevel = index < 200 ? 'FRESHER' : '1_3_YEARS';
  } else if (index < 800) {
    difficulty = 'INTERMEDIATE';
    experienceLevel = '3_5_YEARS';
  } else {
    difficulty = 'DIFFICULT';
    experienceLevel = index < 900 ? '5_8_YEARS' : '8_PLUS_YEARS';
  }

  const topics = ${JSON.stringify(topicsData, null, 2)};

  const topicObj = topics[index % topics.length];
  const iteration = Math.floor(index / topics.length) + 1;

  let questionText = topicObj.q;
  if (iteration > 1) {
    if (difficulty === 'EASY') {
      questionText = \`[Part \${iteration}] \${topicObj.q}\`;
    } else if (difficulty === 'INTERMEDIATE') {
      questionText = \`In professional engineering, how does \${topicObj.concept} under \${topicObj.topic} operate in production environments?\`;
    } else {
      questionText = \`Enterprise Architecture: Deep analysis of \${topicObj.concept} under \${topicObj.topic}. Discuss engine mechanics, memory optimization, and trade-offs.\`;
    }
  }

  return {
    id,
    subject: '${subjectId}',
    topic: topicObj.topic,
    subtopic: topicObj.concept,
    concept: \`\${topicObj.concept} (Part \${iteration})\`,
    difficulty,
    questionType: index % 3 === 0 ? 'CONCEPTUAL' : (index % 3 === 1 ? 'DEFINITION' : 'CODE'),
    experienceLevel,
    tags: ['${subjectId}', difficulty.toLowerCase(), experienceLevel.toLowerCase(), 'interview-prep'],
    question: questionText,
    shortAnswer: topicObj.shortAnswer,
    interviewAnswer: topicObj.interviewAnswer,
    detailedExplanation: topicObj.detailedExplanation,
    why: topicObj.why,
    howItWorks: topicObj.howItWorks,
    realWorldExample: topicObj.realWorldExample,
    example: topicObj.snippet,
    codeSnippet: topicObj.snippet,
    lineByLineExplanation: topicObj.lineByLine,
    executionFlow: topicObj.executionFlow,
    commonMistakes: topicObj.mistakes,
    interviewTraps: topicObj.traps,
    interviewTips: topicObj.tips,
    followUps: topicObj.followUps,
    followUpAnswers: topicObj.followUpAnswers,
  };
}
`;

  fs.writeFileSync(path.join(GEN_DIR, filename), code, 'utf-8');
  console.log(`✅ Created generator: ${filename}`);
}

// 1. JavaScript Generator
writeGenerator('jsGenerator.mjs', 'javascript', 'JavaScript', [
  {
    q: "What are the primitive data types in JavaScript, and how do they differ from Objects?",
    concept: "Primitives vs Object Reference Types",
    topic: "Execution Context, Lexical Environment & Scope Chain",
    shortAnswer: "JavaScript has 7 primitive types: string, number, bigint, boolean, undefined, symbol, and null. Primitives are immutable and stored directly by value on the stack, whereas Objects are mutable collections stored by reference on the heap.",
    interviewAnswer: "In JavaScript, data is split into two categories: 1) Primitives (7 types): string, number, bigint, boolean, undefined, symbol, and null. They are immutable—when you assign them, you copy the value itself. 2) Reference Types (Objects, Arrays, Functions): Stored on the heap; variables hold memory memory pointers. Comparing two distinct objects `{}` === `{}` evaluates to false because their memory addresses differ.",
    detailedExplanation: "### JavaScript Types Deep Dive\n\n1. **Primitives**: Stored by value. Any operation on a primitive returns a new primitive rather than modifying the original.\n2. **Typeof Quirks**: `typeof null === 'object'` is a famous historical bug from the first JavaScript engine (where type tags represented null with 000, matching object type tags).\n3. **Stack vs Heap**: V8 engine allocates primitives in fast stack memory (or inline in registers), while objects are allocated on the V8 managed heap with garbage collection tracking references.",
    why: "Primitives provide high-performance, predictable value semantics for foundational operations without heap allocation overhead.",
    howItWorks: "1. Variable declaration allocates stack memory.\n2. Value assignment writes bytes directly.\n3. Comparison `a === b` compares raw byte values.",
    realWorldExample: "Modifying user settings: primitive `user.age = 25` assigns an immutable number, whereas `const clonedUser = { ...user }` shallow-copies the object pointer references.",
    snippet: `// Primitives (Value Comparison)
const age1 = 25;
const age2 = 25;
console.log(age1 === age2); // true (compares values)

// Objects (Reference Comparison)
const user1 = { name: 'Alex' };
const user2 = { name: 'Alex' };
console.log(user1 === user2); // false (different heap memory addresses)

// Primitive Immutability
let greeting = 'hello';
greeting.toUpperCase(); // returns 'HELLO', but does not mutate greeting!
console.log(greeting); // 'hello'`,
    lineByLine: [
      { line: 2, code: "const age1 = 25;", explanation: "Allocates number primitive on call stack." },
      { line: 4, code: "console.log(age1 === age2);", explanation: "Compares primitive values directly -> returns true." },
      { line: 7, code: "const user1 = { name: 'Alex' };", explanation: "Allocates object on V8 heap and assigns memory pointer to user1." },
      { line: 9, code: "console.log(user1 === user2);", explanation: "Compares references -> returns false because memory pointers differ." },
    ],
    executionFlow: [
      "Step 1: V8 allocates stack memory for primitives age1 and age2.",
      "Step 2: Heap memory is allocated for user1 and user2 at distinct addresses 0x01 and 0x02.",
      "Step 3: Strict equality operator checks reference identity for objects.",
    ],
    mistakes: ["Thinking `typeof null === 'null'` when it historically returns 'object'.", "Mutating primitive strings expecting them to change in place."],
    traps: ["Trap: Why does `typeof null` return 'object'? Tip: A legacy bug from JS 1995 where object type tags matched 0."],
    tips: ["For freshers: Memorize the 7 primitives: string, number, bigint, boolean, undefined, symbol, null."],
    followUps: ["What is the difference between null and undefined?", "How does Symbol primitive ensure unique object keys?"],
    followUpAnswers: [
      "undefined means a variable has been declared but not assigned a value. null is an intentional assignment representing 'no value' or an empty object reference.",
      "Symbol() always creates a guaranteed globally unique token, preventing collision when adding third-party library properties to objects."
    ]
  },
  {
    q: "What is the difference between == (loose equality) and === (strict equality) in JavaScript?",
    concept: "Type Coercion & Equality Comparison Algorithms",
    topic: "Execution Context, Lexical Environment & Scope Chain",
    shortAnswer: "=== (strict equality) checks both value and type without conversion. == (loose equality) performs implicit type coercion using the abstract equality comparison algorithm before comparing values.",
    interviewAnswer: "Always prefer === in modern JavaScript: 1) Strict equality (===) checks value AND type; if types differ, it returns false immediately. 2) Loose equality (==) coerces types if they differ (e.g. `5 == '5'` converts string '5' to number 5). 3) Gotcha: `null == undefined` is true, but `null === undefined` is false. 4) Always use === to avoid subtle bugs.",
    detailedExplanation: "### Type Coercion in Equality\n\n1. **Strict Equality (`===`)**: Implements `IsStrictlyEqual(x, y)`. If Type(x) !== Type(y), return false. No side effects or conversion.\n2. **Loose Equality (`==`)**: Implements `IsLooselyEqual(x, y)` which applies coercive steps:\n   - number == string -> converts string to number (`5 == '5'` -> `5 == 5` -> true).\n   - boolean == any -> converts boolean to number (`true == 1` -> `1 == 1` -> true).\n   - object == primitive -> calls `ToPrimitive()` (`[1] == 1` -> `'1' == 1` -> `1 == 1` -> true).",
    why: "Strict equality eliminates silent type coercion bugs, making code reliable and compiler-optimizable.",
    howItWorks: "1. The engine checks typeof operands.\n2. If different in ===: returns false.\n3. If different in ==: applies ECMAScript coercion rules recursively.",
    realWorldExample: "A form input returns string `'0'`. Using `if (input == false)` evaluates to true because `'0'` coerces to number 0 and false coerces to 0!",
    snippet: `console.log(5 === '5');  // false (number !== string)
console.log(5 == '5');   // true (string '5' coerced to number 5)

console.log(null === undefined); // false (different types)
console.log(null == undefined);  // true (special loose equality rule)

console.log(0 == false);  // true (both coerce to 0)
console.log(0 === false); // false (number !== boolean)`,
    lineByLine: [
      { line: 1, code: "console.log(5 === '5');", explanation: "Strict equality: Type check fails immediately, returns false." },
      { line: 2, code: "console.log(5 == '5');", explanation: "Loose equality: Converts string '5' to number 5, returns true." },
    ],
    executionFlow: [
      "Step 1: Check types: number and string.",
      "Step 2: In ===, types differ, emit false.",
      "Step 3: In ==, string operand coerced to number, compare 5 === 5, emit true.",
    ],
    mistakes: ["Using `==` to check for empty strings or 0, leading to unexpected truthy/falsy coercion bugs."],
    traps: ["Trap: Does `NaN === NaN`? Tip: No! NaN is the only value in JavaScript that is not equal to itself. Use `Number.isNaN()`."],
    tips: ["For freshers: Default to `===` in 100% of your code."],
    followUps: ["How do you check if a value is NaN?", "What is Object.is() and how does it differ from ===?"],
    followUpAnswers: [
      "Use `Number.isNaN(val)`. Never use `val === NaN` because NaN is never equal to itself.",
      "`Object.is()` behaves like === except for two cases: `Object.is(NaN, NaN)` is true, and `Object.is(+0, -0)` is false."
    ]
  },
  {
    q: "What is the difference between var, let, and const regarding scope and hoisting?",
    concept: "Variable Lifecycles, Block Scoping & Temporal Dead Zone",
    topic: "Hoisting, TDZ & Variable Lifecycle Semantics",
    shortAnswer: "var is function-scoped and hoisted with an initial value of undefined. let and const are block-scoped and hoisted into a Temporal Dead Zone (TDZ) where accessing them before declaration throws a ReferenceError. const also prevents variable reassignment.",
    interviewAnswer: "I summarize this in 3 key points: 1) Scope: `var` is scoped to the nearest function; `let` and `const` are scoped to the nearest enclosing `{}` block. 2) Hoisting & TDZ: `var` is hoisted and initialized to `undefined`, so accessing it before declaration returns undefined. `let` and `const` are hoisted to the start of the block but NOT initialized; accessing them before declaration triggers a Temporal Dead Zone (TDZ) ReferenceError. 3) Reassignment: `const` requires an initial value and cannot be reassigned; `let` and `var` can be reassigned.",
    detailedExplanation: "### Variable Declaration Semantics\n\n1. **Hoisting**: Creation phase of Execution Context allocates memory for variable identifiers before code executes.\n2. **Temporal Dead Zone (TDZ)**: The period of execution between entering a scope and the line where `let`/`const` is declared. Any read/write in TDZ throws `ReferenceError`.\n3. **Global Object Pollution**: Top-level `var` attaches to `window.varName`; `let` and `const` do not pollute the global object.",
    why: "let and const were introduced in ES6 to eliminate silent variable leakage, accidental redeclarations, and tricky closure bugs inside for-loops.",
    howItWorks: "1. V8 parses scope block.\n2. Identifier is bound to lexical environment.\n3. TDZ flag is active until execution reaches declaration statement.",
    realWorldExample: "Inside a for loop with setTimeout: `for (var i = 0; i < 3; i++)` logs 3, 3, 3 because var shares one function scope. `for (let i = 0; i < 3; i++)` logs 0, 1, 2 because let creates a fresh binding for each loop iteration.",
    snippet: `// 1. Scope Demonstration
if (true) {
  var functionScoped = 'accessible outside block';
  let blockScoped = 'locked in block';
  const immutableRef = 'cannot reassign';
}
console.log(functionScoped); // 'accessible outside block'
// console.log(blockScoped); // ReferenceError!

// 2. Temporal Dead Zone (TDZ)
// console.log(tdzVar); // ReferenceError: Cannot access before initialization
let tdzVar = 'initialized now';`,
    lineByLine: [
      { line: 3, code: "var functionScoped = '...';", explanation: "Escapes the if block because var is function scoped." },
      { line: 4, code: "let blockScoped = '...';", explanation: "Confined to the {} block." },
      { line: 12, code: "let tdzVar = 'initialized now';", explanation: "Exits Temporal Dead Zone at this line." },
    ],
    executionFlow: [
      "Step 1: Block enters execution.",
      "Step 2: let variables enter TDZ.",
      "Step 3: var is hoisted to enclosing function or script root with value undefined.",
      "Step 4: Block execution completes, let variables are destroyed.",
    ],
    mistakes: ["Believing that `const` makes an object's properties immutable (const only freezes the variable reference, not the object properties; use Object.freeze for properties)."],
    traps: ["Trap: Are `let` and `const` hoisted? Tip: YES! They are hoisted, but into the TDZ, which is why accessing them throws ReferenceError instead of 'variable not found'."],
    tips: ["For freshers: Rule of thumb: Default to `const`. Use `let` only if the variable needs to be reassigned. Never use `var` in modern code."],
    followUps: ["How do you make an object's properties truly immutable?", "What happens in a loop when using `let` vs `var` with setTimeout?"],
    followUpAnswers: [
      "Use `Object.freeze(obj)` to prevent adding, deleting, or modifying properties at runtime.",
      "With `var`, all callbacks share the single hoisted loop variable (all print final length). With `let`, a new lexical environment binding is created per loop iteration, preserving each index."
    ]
  }
]);

console.log('✅ Base generator setup script complete.');
