// Topics 26 to 30
module.exports = [
  // ==========================================
  // TOPIC 26: Unicode
  // ==========================================
  {
    topic: "Unicode",
    subtopic: "Code Points vs Code Units",
    concept: "How did ES6 improve Unicode support in JavaScript?",
    difficulty: "Intermediate",
    questionType: "Concept",
    experienceLevel: "Mid-level",
    isHighFrequency: false,
    companyTags: ["Google", "Apple"],
    tags: ["unicode", "strings", "code-points"],
    question: "How did ES6 improve Unicode support, and what is the difference between a UTF-16 code unit and a Unicode code point?",
    shortAnswer: "ES6 introduced full support for Unicode code points up to U+10FFFF. Previously, JavaScript strings only supported 16-bit code units (UCS-2/UTF-16), meaning characters outside the BMP (like emojis and rare Han characters) were split into surrogate pairs of two 16-bit units.",
    detailedExplanation: "In pre-ES6, `string.length` counts 16-bit code units, causing emojis like 𝌆 or 😀 to report a length of 2. ES6 added `codePointAt()`, `String.fromCodePoint()`, `\\u{...}` escape sequences, and the regex `u` flag to handle 21-bit code points properly.",
    codeExample: `const emoji = "😀"; // Code point U+1F600
console.log(emoji.length); // 2 (counts UTF-16 code units!)

// Iterating over code points with ES6 for...of:
for (const char of emoji) {
  console.log(char); // "😀" (correctly treats as 1 character)
}`
  },
  {
    topic: "Unicode",
    subtopic: "codePointAt vs charCodeAt",
    concept: "What is the difference between codePointAt() and charCodeAt()?",
    difficulty: "Intermediate",
    questionType: "Difference",
    experienceLevel: "Mid-level",
    isHighFrequency: false,
    companyTags: ["Google", "Microsoft"],
    tags: ["unicode", "codepointat", "charcodeat"],
    question: "What is the difference between `String.prototype.codePointAt()` and `String.prototype.charCodeAt()`?",
    shortAnswer: "`charCodeAt()` returns the 16-bit UTF-16 code unit at an index (0 to 65535). `codePointAt()` returns the full 32-bit Unicode code point (which can exceed 65535 for characters outside the Basic Multilingual Plane, such as emojis).",
    detailedExplanation: "For surrogate pair characters, `charCodeAt(0)` only gives the high surrogate value. `codePointAt(0)` resolves the entire astral plane code point.",
    codeExample: `const text = "𠮷"; // Surrogate pair, code point 134071 (0x20BB7)

console.log(text.charCodeAt(0));  // 55362 (high surrogate only)
console.log(text.codePointAt(0)); // 134071 (complete Unicode code point)
console.log(text.codePointAt(0).toString(16)); // "20bb7"`
  },
  {
    topic: "Unicode",
    subtopic: "String.fromCodePoint",
    concept: "How does String.fromCodePoint() improve upon String.fromCharCode()?",
    difficulty: "Intermediate",
    questionType: "Difference",
    experienceLevel: "Mid-level",
    isHighFrequency: false,
    companyTags: ["Meta", "Adobe"],
    tags: ["unicode", "fromcodepoint", "fromcharcode"],
    question: "What is the difference between `String.fromCodePoint()` and `String.fromCharCode()`?",
    shortAnswer: "`String.fromCharCode()` only accepts 16-bit numbers (up to 0xFFFF) and truncates higher numbers. `String.fromCodePoint()` can take any valid Unicode code point up to 0x10FFFF and returns the correct character.",
    detailedExplanation: "If you pass 0x1F680 (rocket emoji) to `String.fromCharCode()`, it truncates the top bits and produces garbage. `String.fromCodePoint(0x1F680)` properly generates the surrogate pair.",
    codeExample: `// String.fromCharCode fails on values > 0xFFFF:
console.log(String.fromCharCode(0x1F680)); // Truncated, prints invalid glyph

// String.fromCodePoint handles full Unicode:
console.log(String.fromCodePoint(0x1F680)); // "🚀"`
  },
  {
    topic: "Unicode",
    subtopic: "Unicode RegExp 'u' Flag",
    concept: "What does the regular expression 'u' flag do in ES6?",
    difficulty: "Advanced",
    questionType: "Concept",
    experienceLevel: "Senior",
    isHighFrequency: false,
    companyTags: ["Google", "Stripe"],
    tags: ["unicode", "regex", "u-flag"],
    question: "What does the `u` (Unicode) flag do in ES6 Regular Expressions?",
    shortAnswer: "The `u` flag enables full Unicode handling in regex. It causes surrogate pairs to be treated as single code points, allows extended `\\u{...}` escape sequences, and properly handles character classes with surrogate pairs.",
    detailedExplanation: "Without the `u` flag, `/^.$/` will fail on an emoji because the emoji consists of two UTF-16 code units. With the `u` flag, `/^.$/u` matches the full code point.",
    codeExample: `const regexWithoutU = /^.$/;
console.log(regexWithoutU.test("🔥")); // false (treated as 2 units)

const regexWithU = /^.$/u;
console.log(regexWithU.test("🔥"));    // true (treated as 1 Unicode character)`
  },

  // ==========================================
  // TOPIC 27: Number Improvements
  // ==========================================
  {
    topic: "Number Improvements",
    subtopic: "Number.isNaN vs isNaN",
    concept: "What is the critical difference between Number.isNaN() and global isNaN()?",
    difficulty: "Beginner",
    questionType: "Difference",
    experienceLevel: "Junior",
    isHighFrequency: true,
    companyTags: ["Google", "Amazon", "Meta", "Microsoft"],
    tags: ["number", "isnan", "type-coercion"],
    question: "What is the difference between `Number.isNaN()` and the global `isNaN()` function?",
    shortAnswer: "Global `isNaN()` coercively converts its argument to a number before checking, leading to false positives for strings like `isNaN('hello') === true`. `Number.isNaN()` performs NO coercion and only returns `true` if the argument is strictly the number type and equals `NaN`.",
    detailedExplanation: "`Number.isNaN()` is much safer because it does not coerce non-numbers. In ES6, `Number.isNaN(x)` is equivalent to `typeof x === 'number' && isNaN(x)`.",
    codeExample: `// Global isNaN forces Number("text") -> NaN -> returns true!
console.log(isNaN("hello")); // true (confusing gotcha!)
console.log(isNaN(undefined)); // true

// ES6 Number.isNaN checks without coercion:
console.log(Number.isNaN("hello")); // false (it's a string, not NaN)
console.log(Number.isNaN(undefined)); // false
console.log(Number.isNaN(NaN)); // true
console.log(Number.isNaN(0 / 0)); // true`
  },
  {
    topic: "Number Improvements",
    subtopic: "Number.isFinite vs isFinite",
    concept: "How does Number.isFinite() differ from global isFinite()?",
    difficulty: "Beginner",
    questionType: "Difference",
    experienceLevel: "Junior",
    isHighFrequency: true,
    companyTags: ["Amazon", "Uber"],
    tags: ["number", "isfinite", "comparison"],
    question: "How does `Number.isFinite()` differ from the global `isFinite()` function?",
    shortAnswer: "Global `isFinite()` coerces its argument to a number first (so `isFinite('10')` is `true`), whereas `Number.isFinite()` does NOT coerce the argument (so `Number.isFinite('10')` is `false`).",
    detailedExplanation: "`Number.isFinite(val)` returns `true` ONLY if `val` is of type `'number'` and is neither `Infinity`, `-Infinity`, nor `NaN`.",
    codeExample: `// Global isFinite coerces strings:
console.log(isFinite("42")); // true
console.log(isFinite(null)); // true (null coerced to 0)

// ES6 Number.isFinite:
console.log(Number.isFinite("42")); // false
console.log(Number.isFinite(null)); // false
console.log(Number.isFinite(42));   // true`
  },
  {
    topic: "Number Improvements",
    subtopic: "Number.isInteger",
    concept: "What does Number.isInteger() check?",
    difficulty: "Beginner",
    questionType: "Concept",
    experienceLevel: "Junior",
    isHighFrequency: true,
    companyTags: ["Microsoft", "Paypal"],
    tags: ["number", "isinteger"],
    question: "What does `Number.isInteger()` check, and how does it handle values like 4.0?",
    shortAnswer: "`Number.isInteger()` determines whether the passed value is a finite number without a fractional component. Because JavaScript treats `4.0` identically to `4` in IEEE 754 floating point, `Number.isInteger(4.0)` returns `true`.",
    detailedExplanation: "It returns `false` for non-number types, `NaN`, infinities, and floating point numbers with fractional values.",
    codeExample: `console.log(Number.isInteger(25));    // true
console.log(Number.isInteger(25.0));  // true (exact integer representation)
console.log(Number.isInteger(25.5));  // false
console.log(Number.isInteger("25"));  // false (no coercion)`
  },
  {
    topic: "Number Improvements",
    subtopic: "Safe Integers",
    concept: "What are Number.MAX_SAFE_INTEGER and Number.isSafeInteger()?",
    difficulty: "Intermediate",
    questionType: "Concept",
    experienceLevel: "Mid-level",
    isHighFrequency: true,
    companyTags: ["Google", "Bloomberg", "Goldman Sachs"],
    tags: ["number", "safe-integer", "max-safe-integer"],
    question: "What are `Number.MAX_SAFE_INTEGER` and `Number.isSafeInteger()`, and why do they exist?",
    shortAnswer: "`Number.MAX_SAFE_INTEGER` is `(2^53 - 1)` (9,007,199,254,740,991). Beyond this number, JavaScript's double-precision floating point format cannot represent every consecutive integer uniquely. `Number.isSafeInteger()` verifies if an integer falls safely within `[-(2^53 - 1), 2^53 - 1]`.",
    detailedExplanation: "Beyond `MAX_SAFE_INTEGER`, mathematical operations produce rounding errors where `n + 1 === n + 2`. (For larger integers, ES2020 introduced `BigInt`).",
    codeExample: `console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991

console.log(Number.isSafeInteger(9007199254740991)); // true
console.log(Number.isSafeInteger(9007199254740992)); // false

// Unsafe arithmetic precision loss:
console.log(9007199254740992 + 1 === 9007199254740992 + 2); // true (loss of precision!)`
  },
  {
    topic: "Number Improvements",
    subtopic: "Number.EPSILON",
    concept: "What is Number.EPSILON and how does it solve 0.1 + 0.2 !== 0.3?",
    difficulty: "Intermediate",
    questionType: "Short Code",
    experienceLevel: "Mid-level",
    isHighFrequency: true,
    companyTags: ["Amazon", "Uber", "Apple"],
    tags: ["number", "epsilon", "floating-point"],
    question: "What is `Number.EPSILON` and how do you use it to safely compare floating-point numbers in JavaScript?",
    shortAnswer: "`Number.EPSILON` represents the smallest difference between 1 and the next smallest floating-point number (approx `2.22e-16`). It serves as a tolerance margin (delta) when comparing floating-point calculations like `0.1 + 0.2 === 0.3`.",
    detailedExplanation: "Due to binary IEEE 754 floating-point representation, `0.1 + 0.2` produces `0.30000000000000004`. Checking `Math.abs(a - b) < Number.EPSILON` safely determines equivalence.",
    codeExample: `console.log(0.1 + 0.2 === 0.3); // false!

function areNumbersClose(a, b) {
  return Math.abs(a - b) < Number.EPSILON;
}

console.log(areNumbersClose(0.1 + 0.2, 0.3)); // true`
  },

  // ==========================================
  // TOPIC 28: New String Methods
  // ==========================================
  {
    topic: "New String Methods",
    subtopic: "startsWith and endsWith",
    concept: "How do String.prototype.startsWith() and endsWith() work?",
    difficulty: "Beginner",
    questionType: "Concept",
    experienceLevel: "Junior",
    isHighFrequency: true,
    companyTags: ["Amazon", "Meta", "Google"],
    tags: ["strings", "startswith", "endswith"],
    question: "How do `startsWith()` and `endsWith()` work in ES6, and what optional second parameter do they accept?",
    shortAnswer: "`startsWith(searchStr, position)` checks if a string begins with `searchStr`, starting search from `position` (defaults to 0). `endsWith(searchStr, length)` checks if a string ends with `searchStr`, treating `length` as the string's end boundary (defaults to `str.length`).",
    detailedExplanation: "Before ES6, developers had to use `str.indexOf(sub) === 0` or regular expressions. `startsWith` and `endsWith` are case-sensitive and return boolean values.",
    codeExample: `const filename = "avatar_profile.png";

console.log(filename.startsWith("avatar")); // true
console.log(filename.startsWith("profile", 7)); // true (starts at index 7)

console.log(filename.endsWith(".png")); // true
console.log(filename.endsWith("avatar", 6)); // true (first 6 characters)`
  },
  {
    topic: "New String Methods",
    subtopic: "includes",
    concept: "How does String.prototype.includes() improve upon indexOf()?",
    difficulty: "Beginner",
    questionType: "Difference",
    experienceLevel: "Junior",
    isHighFrequency: true,
    companyTags: ["Google", "Microsoft"],
    tags: ["strings", "includes", "indexof"],
    question: "How does `String.prototype.includes()` improve upon `indexOf()`?",
    shortAnswer: "`includes()` returns a clear boolean (`true`/`false`) indicating if a substring exists, eliminating the clumsy `str.indexOf(sub) !== -1` comparison.",
    detailedExplanation: "It takes an optional second argument `position` to start the search from. Note that `Array.prototype.includes()` was added shortly after in ES2016.",
    codeExample: `const text = "Frontend interview preparation";

// ES5:
console.log(text.indexOf("interview") !== -1); // true

// ES6:
console.log(text.includes("interview")); // true
console.log(text.includes("interview", 15)); // false (search starts after index 15)`
  },
  {
    topic: "New String Methods",
    subtopic: "repeat",
    concept: "What does String.prototype.repeat() do and what are its constraints?",
    difficulty: "Beginner",
    questionType: "Concept",
    experienceLevel: "Junior",
    isHighFrequency: false,
    companyTags: ["Amazon", "Salesforce"],
    tags: ["strings", "repeat"],
    question: "What does `String.prototype.repeat()` do, and what happens if you pass a negative number?",
    shortAnswer: "`repeat(count)` returns a new string containing the specified number of copies of the original string concatenated together. If `count` is negative or `Infinity`, it throws a `RangeError`.",
    detailedExplanation: "If `count` is 0, it returns an empty string `\"\"`. If `count` is a float, it is converted to an integer via truncation.",
    codeExample: `console.log("ha".repeat(3)); // "hahaha"
console.log("*".repeat(5));  // "*****"

try {
  "error".repeat(-1);
} catch (e) {
  console.log(e.name); // RangeError: Invalid count value
}`
  },
  {
    topic: "New String Methods",
    subtopic: "ES6 vs Later Standards (padStart and padEnd)",
    concept: "Were padStart and padEnd introduced in ES6 or a later standard?",
    difficulty: "Intermediate",
    questionType: "Concept",
    experienceLevel: "Mid-level",
    isHighFrequency: true,
    companyTags: ["Meta", "Google"],
    tags: ["strings", "padstart", "padend", "ecmascript-standards"],
    question: "Were `padStart()` and `padEnd()` part of ES6 (ES2015), or a later ECMAScript standard?",
    shortAnswer: "`padStart()` and `padEnd()` were NOT part of ES6 (ES2015); they were standardized in **ES2017 (ES8)**. ES6 added `startsWith()`, `endsWith()`, `includes()`, and `repeat()`.",
    detailedExplanation: "Accurate version distinction is essential in interview settings: ES6 (2015) introduced the baseline string improvements, while string padding (`padStart`/`padEnd`) was added in ES2017 following the famous 'left-pad' ecosystem event.",
    codeExample: `// ES2017 (ES8) feature:
const id = "7";
console.log(id.padStart(4, "0")); // "0007"
console.log(id.padEnd(4, "!"));   // "7!!!"`
  },

  // ==========================================
  // TOPIC 29: Array Improvements
  // ==========================================
  {
    topic: "Array Improvements",
    subtopic: "Array.from",
    concept: "What is Array.from() and what types of inputs does it convert?",
    difficulty: "Intermediate",
    questionType: "Concept",
    experienceLevel: "Mid-level",
    isHighFrequency: true,
    companyTags: ["Google", "Amazon", "Meta", "Uber"],
    tags: ["arrays", "array-from", "iterables"],
    question: "What is `Array.from()`, what inputs can it convert, and how does its optional mapping function work?",
    shortAnswer: "`Array.from()` creates a new shallow-copied Array from an array-like object (has a `length` property and indexed elements, like `arguments` or `NodeList`) or any iterable object (like `Set`, `Map`, or strings). Its optional second argument is a `mapFn` executed on each element.",
    detailedExplanation: "`Array.from(obj, mapFn)` is more efficient than `Array.from(obj).map(mapFn)` because it does not create an intermediate array.",
    codeExample: `// 1. Converting a DOM NodeList or arguments:
function sumArgs() {
  return Array.from(arguments).reduce((a, b) => a + b, 0);
}
console.log(sumArgs(10, 20, 30)); // 60

// 2. Generating ranges with mapping function:
const range = Array.from({ length: 5 }, (_, i) => i + 1);
console.log(range); // [1, 2, 3, 4, 5]`
  },
  {
    topic: "Array Improvements",
    subtopic: "Array.of vs Array Constructor",
    concept: "Why was Array.of() added and how does it fix the new Array() quirk?",
    difficulty: "Beginner",
    questionType: "Difference",
    experienceLevel: "Junior",
    isHighFrequency: true,
    companyTags: ["Google", "Microsoft"],
    tags: ["arrays", "array-of", "constructors"],
    question: "Why was `Array.of()` introduced in ES6, and how does it resolve the single-argument inconsistency of the `Array` constructor?",
    shortAnswer: "`new Array(3)` creates an empty array with length 3 (`[empty × 3]`), while `new Array(3, 4)` creates `[3, 4]`. `Array.of(3)` eliminates this inconsistency by ALWAYS creating an array with the passed elements as its items, regardless of count or type.",
    detailedExplanation: "This design flaw in the original `Array` constructor made generic array factory utilities error-prone. `Array.of(n)` consistently produces `[n]`.",
    codeExample: `// Inconsistent Array constructor:
console.log(new Array(3));     // [empty x 3] (sparse array!)
console.log(new Array(3, 4));  // [3, 4]

// Predictable Array.of:
console.log(Array.of(3));      // [3]
console.log(Array.of(3, 4));   // [3, 4]
console.log(Array.of(undefined)); // [undefined]`
  },
  {
    topic: "Array Improvements",
    subtopic: "find and findIndex",
    concept: "How do Array.prototype.find() and findIndex() work?",
    difficulty: "Beginner",
    questionType: "Concept",
    experienceLevel: "Junior",
    isHighFrequency: true,
    companyTags: ["Amazon", "Meta", "Netflix"],
    tags: ["arrays", "find", "findindex"],
    question: "How do `find()` and `findIndex()` work in ES6, and what do they return when no element matches?",
    shortAnswer: "`find(predicate)` returns the value of the first element satisfying the test function, or `undefined` if none match. `findIndex(predicate)` returns the 0-based index of the first matching element, or `-1` if none match.",
    detailedExplanation: "Unlike `filter()` which evaluates the entire array and returns a new array, `find()` and `findIndex()` short-circuit immediately upon finding the first match.",
    codeExample: `const users = [
  { id: 1, name: "Alice", active: false },
  { id: 2, name: "Bob", active: true },
  { id: 3, name: "Charlie", active: true }
];

const activeUser = users.find(u => u.active);
console.log(activeUser.name); // "Bob"

const inactiveIndex = users.findIndex(u => u.id === 99);
console.log(inactiveIndex); // -1 (not found)`
  },
  {
    topic: "Array Improvements",
    subtopic: "Array Iterator Methods (keys, values, entries)",
    concept: "What do Array.prototype.keys(), values(), and entries() return?",
    difficulty: "Intermediate",
    questionType: "Concept",
    experienceLevel: "Mid-level",
    isHighFrequency: false,
    companyTags: ["Uber", "Google"],
    tags: ["arrays", "iterators", "entries", "keys", "values"],
    question: "What do the ES6 Array methods `keys()`, `values()`, and `entries()` return?",
    shortAnswer: "They return Array Iterator objects containing the keys (indices), values (elements), and entries (`[index, element]` pairs) respectively, which can be traversed with `for...of` loops.",
    detailedExplanation: "Unlike `Object.keys()` which returns an array of strings, `arr.keys()` returns an iterator yielding integer numbers.",
    codeExample: `const fruits = ["apple", "banana"];

for (const [index, fruit] of fruits.entries()) {
  console.log(\`Index \${index}: \${fruit}\`);
}
// Index 0: apple
// Index 1: banana

for (const index of fruits.keys()) {
  console.log(typeof index, index); // "number" 0, "number" 1
}`
  },
  {
    topic: "Array Improvements",
    subtopic: "fill and copyWithin",
    concept: "What do Array.prototype.fill() and copyWithin() do?",
    difficulty: "Intermediate",
    questionType: "Concept",
    experienceLevel: "Mid-level",
    isHighFrequency: false,
    companyTags: ["Adobe", "Apple"],
    tags: ["arrays", "fill", "copywithin", "mutating"],
    question: "What do `Array.prototype.fill()` and `copyWithin()` do, and do they mutate the original array?",
    shortAnswer: "Both methods mutate the original array in place. `fill(val, start, end)` fills elements with a static value. `copyWithin(target, start, end)` copies a sequence of array elements to another position within the same array without modifying its length.",
    detailedExplanation: "`fill()` is commonly used to initialize matrices or arrays of predetermined length. Note that if you fill an array with an object (`arr.fill({})`), all slots reference the same object instance.",
    codeExample: `// Initializing an array of zeros:
const zeros = new Array(4).fill(0);
console.log(zeros); // [0, 0, 0, 0]

// copyWithin(target, start, end):
const nums = [1, 2, 3, 4, 5];
nums.copyWithin(0, 3, 5); // Copy elements at index 3..5 ([4, 5]) into index 0
console.log(nums); // [4, 5, 3, 4, 5]`
  },

  // ==========================================
  // TOPIC 30: Object Improvements
  // ==========================================
  {
    topic: "Object Improvements",
    subtopic: "Object.is",
    concept: "How does Object.is() differ from strict equality (===)?",
    difficulty: "Intermediate",
    questionType: "Difference",
    experienceLevel: "Mid-level",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "React Team", "Microsoft"],
    tags: ["objects", "object-is", "equality", "samevalue"],
    question: "How does `Object.is()` differ from strict equality (`===`) in ES6?",
    shortAnswer: "`Object.is()` implements the SameValue algorithm. It differs from `===` in only two edge cases: `Object.is(NaN, NaN)` is `true` (whereas `NaN === NaN` is `false`), and `Object.is(+0, -0)` is `false` (whereas `+0 === -0` is `true`).",
    detailedExplanation: "React uses `Object.is` (SameValue) under the hood for its component props and state comparison algorithm (`React.memo`, `useEffect` dependencies).",
    codeExample: `// NaN comparisons:
console.log(NaN === NaN);          // false
console.log(Object.is(NaN, NaN));  // true

// +0 and -0 comparisons:
console.log(+0 === -0);            // true
console.log(Object.is(+0, -0));    // false

// All other values behave identically to ===:
console.log(Object.is("str", "str")); // true
console.log(Object.is({}, {}));       // false`
  },
  {
    topic: "Object Improvements",
    subtopic: "Object Methods Standardization (ES6 vs ES2017)",
    concept: "Which Object methods belong to ES6 versus ES2017?",
    difficulty: "Intermediate",
    questionType: "Concept",
    experienceLevel: "Mid-level",
    isHighFrequency: true,
    companyTags: ["Meta", "Google", "Amazon"],
    tags: ["objects", "ecmascript-standards", "object-keys", "object-values", "object-entries"],
    question: "Which Object methods were introduced in ES6 (ES2015) versus ES2017 (ES8)?",
    shortAnswer: "ES6 introduced `Object.assign()`, `Object.is()`, `Object.setPrototypeOf()`, and `Object.getOwnPropertySymbols()`. `Object.values()` and `Object.entries()` were added in **ES2017 (ES8)**; `Object.keys()` has been available since ES5.",
    detailedExplanation: "Many developers casually refer to `Object.entries()` as 'ES6', but it was officially standardized in ECMAScript 2017. Accurate knowledge of language specifications is a common differentiator in senior frontend interviews.",
    codeExample: `// ES6 additions:
const target = Object.assign({}, { a: 1 });
const isSame = Object.is(5, 5);

// ES2017 additions:
const user = { name: "Antigravity", role: "AI" };
console.log(Object.values(user));  // ["Antigravity", "AI"]
console.log(Object.entries(user)); // [["name", "Antigravity"], ["role", "AI"]]`
  },
  {
    topic: "Object Improvements",
    subtopic: "Enhanced Object Literal Features Summary",
    concept: "Summarize the three core object literal enhancements introduced in ES6.",
    difficulty: "Beginner",
    questionType: "Concept",
    experienceLevel: "Junior",
    isHighFrequency: true,
    companyTags: ["Amazon", "Uber", "Microsoft"],
    tags: ["objects", "object-literals", "shorthand"],
    question: "Summarize the three key syntactic enhancements for object literals introduced in ES6.",
    shortAnswer: "1. Property shorthand (`{ x }` instead of `{ x: x }`). 2. Method definition shorthand (`{ greet() {} }` instead of `{ greet: function() {} }`). 3. Computed property names (`{ [dynamicKey]: value }`).",
    detailedExplanation: "These enhancements drastically reduced repetitive boilerplate when constructing configuration objects, state models, and Redux action creators.",
    codeExample: `const key = "status";
const code = 200;

const response = {
  code, // 1. Property shorthand
  [key]: "OK", // 2. Computed property
  send() { // 3. Method shorthand
    return \`\${this.code}: \${this.status}\`;
  }
};

console.log(response.send()); // "200: OK"`
  }
];
