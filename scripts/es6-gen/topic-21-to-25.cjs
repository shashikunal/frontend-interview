// Topics 21 to 25
module.exports = [
  // ==========================================
  // TOPIC 21: Promises
  // ==========================================
  {
    topic: "Promises",
    subtopic: "Promise Basics",
    concept: "What is a JavaScript Promise and what problem does it solve?",
    difficulty: "Beginner",
    questionType: "Concept",
    experienceLevel: "Junior",
    isHighFrequency: true,
    companyTags: ["Google", "Amazon", "Meta", "Microsoft"],
    tags: ["promises", "asynchronous", "es6-features"],
    question: "What is a Promise in ES6 and what problem does it solve?",
    shortAnswer: "A Promise is an ES6 object representing the eventual completion (or failure) of an asynchronous operation and its resulting value, replacing deeply nested callbacks ('callback hell').",
    detailedExplanation: "Before ES6, asynchronous operations relied entirely on callback functions. Nested asynchronous operations led to 'callback hell' or the 'pyramid of doom', making error handling and control flow notoriously difficult. A Promise provides a clean, standardized abstraction with chained `.then()`, `.catch()`, and `.finally()` methods.",
    codeExample: `// Creating and consuming an ES6 Promise
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true;
      if (success) resolve({ id: 1, name: "Antigravity" });
      else reject(new Error("Failed to fetch"));
    }, 100);
  });
};

fetchData()
  .then(data => console.log(data.name))
  .catch(err => console.error(err.message));`
  },
  {
    topic: "Promises",
    subtopic: "Promise States",
    concept: "What are the three possible states of a Promise?",
    difficulty: "Beginner",
    questionType: "Concept",
    experienceLevel: "Junior",
    isHighFrequency: true,
    companyTags: ["Meta", "Uber", "Netflix"],
    tags: ["promises", "promise-states", "async"],
    question: "What are the three states of a JavaScript Promise, and can a Promise transition between them more than once?",
    shortAnswer: "The three states are: pending (initial state), fulfilled (operation succeeded), and rejected (operation failed). Once settled (fulfilled or rejected), a Promise is immutable and cannot transition again.",
    detailedExplanation: "A Promise starts in 'pending'. It transitions exactly once to either 'fulfilled' (via resolve()) or 'rejected' (via reject()). Once settled, further calls to resolve or reject have no effect.",
    codeExample: `const p = new Promise((resolve, reject) => {
  resolve("First resolution");
  reject("Ignored rejection"); // No effect
  resolve("Ignored resolution"); // No effect
});

p.then(val => console.log(val)); // "First resolution"`
  },
  {
    topic: "Promises",
    subtopic: "Promise Chaining",
    concept: "How does Promise chaining work with .then()?",
    difficulty: "Intermediate",
    questionType: "Concept",
    experienceLevel: "Mid-level",
    isHighFrequency: true,
    companyTags: ["Amazon", "Flipkart", "PayPal"],
    tags: ["promises", "promise-chaining", "then"],
    question: "How does Promise chaining work in JavaScript, and what determines the value passed to the next .then()?",
    shortAnswer: "Each `.then()` returns a brand new Promise. If the callback returns a primitive or object, the new Promise immediately fulfills with that value; if it returns a Promise, the chain waits for that inner Promise to settle.",
    detailedExplanation: "Promise chaining allows sequential asynchronous steps without nesting. Returning a value from `.then()` fulfills the next promise with that value. Returning a promise causes the outer promise to adopt the state and result of the returned promise.",
    codeExample: `fetchUser(1)
  .then(user => fetchUserPosts(user.id)) // Returns a new Promise
  .then(posts => posts[0]) // Returns a synchronous value
  .then(firstPost => console.log(firstPost.title))
  .catch(err => console.error("Chain error:", err));`
  },
  {
    topic: "Promises",
    subtopic: "Error Handling",
    concept: "How does .catch() handle errors in a Promise chain?",
    difficulty: "Intermediate",
    questionType: "Concept",
    experienceLevel: "Mid-level",
    isHighFrequency: true,
    companyTags: ["Google", "Salesforce", "Atlassian"],
    tags: ["promises", "error-handling", "catch"],
    question: "How does `.catch()` handle errors in a Promise chain, and what is the difference between `.catch()` and the second callback of `.then()`?",
    shortAnswer: "`.catch(fn)` catches any error thrown in preceding steps of the chain. The second argument to `.then(onFulfilled, onRejected)` only catches errors from previous steps, NOT errors thrown inside the same `.then`'s `onFulfilled` handler.",
    detailedExplanation: "Placing a single `.catch()` at the end of a chain provides centralized error handling analogous to a `try...catch` block. Using `promise.then(fn, errFn)` fails to catch runtime errors that happen inside `fn`.",
    codeExample: `// .then(onFulfilled, onRejected) misses errors inside onFulfilled:
promise.then(
  data => { throw new Error("Inside handler error"); },
  err => { /* will NOT catch the error above */ }
);

// .catch() correctly catches errors from all preceding steps:
promise
  .then(data => { throw new Error("Inside handler error"); })
  .catch(err => console.error("Caught safely:", err.message));`
  },
  {
    topic: "Promises",
    subtopic: "Promise.finally",
    concept: "What is the purpose of Promise.prototype.finally()?",
    difficulty: "Intermediate",
    questionType: "Concept",
    experienceLevel: "Mid-level",
    isHighFrequency: false,
    companyTags: ["Microsoft", "Airbnb"],
    tags: ["promises", "finally", "cleanup"],
    question: "What is the purpose of `.finally()` in a Promise chain, and does it receive any arguments?",
    shortAnswer: "`.finally(callback)` runs cleanup logic regardless of whether the promise fulfilled or rejected. Its callback receives NO arguments, and it passes the original resolution or rejection through unchanged (unless the callback itself throws/rejects).",
    detailedExplanation: "`.finally()` is ideal for hiding loading spinners, closing database connections, or freeing up resources after an asynchronous workflow finishes. It was standardized in ES2018 as an extension to ES6 Promises.",
    codeExample: `let isLoading = true;

fetchData()
  .then(renderUI)
  .catch(showErrorMessage)
  .finally(() => {
    isLoading = false;
    console.log("Cleanup: spinner stopped regardless of outcome");
  });`
  },
  {
    topic: "Promises",
    subtopic: "Promise.all",
    concept: "How does Promise.all() behave on success vs rejection?",
    difficulty: "Intermediate",
    questionType: "Concept",
    experienceLevel: "Mid-level",
    isHighFrequency: true,
    companyTags: ["Google", "Amazon", "Apple", "Uber"],
    tags: ["promises", "promise-all", "concurrency"],
    question: "How does `Promise.all()` work, and what happens if one of the promises rejects?",
    shortAnswer: "`Promise.all()` takes an iterable of promises and fulfills with an array of all results in order when ALL input promises fulfill. If ANY promise rejects, it immediately fails fast, rejecting with that first error.",
    detailedExplanation: "`Promise.all()` is best for dependent operations where all parts are mandatory. The resolved array order corresponds to the input iterable order, not completion order.",
    codeExample: `const p1 = Promise.resolve(10);
const p2 = new Promise(resolve => setTimeout(() => resolve(20), 50));
const p3 = Promise.resolve(30);

Promise.all([p1, p2, p3])
  .then(values => console.log(values)); // [10, 20, 30]

// Fail-fast behavior:
Promise.all([Promise.resolve("OK"), Promise.reject("Boom!")])
  .catch(err => console.log("Rejected immediately:", err)); // "Boom!"`
  },
  {
    topic: "Promises",
    subtopic: "Promise.race",
    concept: "How does Promise.race() work?",
    difficulty: "Intermediate",
    questionType: "Concept",
    experienceLevel: "Mid-level",
    isHighFrequency: true,
    companyTags: ["Meta", "Netflix"],
    tags: ["promises", "promise-race", "concurrency"],
    question: "How does `Promise.race()` work and what is a common practical use case for it?",
    shortAnswer: "`Promise.race()` settles (fulfills or rejects) as soon as the first promise in the iterable settles, adopting its value or reason. A common use case is implementing a network request timeout.",
    detailedExplanation: "Unlike `Promise.all`, which waits for all or the first rejection, `Promise.race` adopts whatever outcome the fastest promise produces.",
    codeExample: `// Practical timeout implementation with Promise.race
const timeout = (ms) => new Promise((_, reject) => 
  setTimeout(() => reject(new Error("Request timed out")), ms)
);

Promise.race([fetch("/api/data"), timeout(5000)])
  .then(res => res.json())
  .catch(err => console.error(err.message));`
  },
  {
    topic: "Promises",
    subtopic: "Promise Combinators Comparison",
    concept: "How do Promise.all, Promise.race, Promise.allSettled, and Promise.any differ?",
    difficulty: "Advanced",
    questionType: "Difference",
    experienceLevel: "Senior",
    isHighFrequency: true,
    companyTags: ["Google", "Amazon", "Meta", "Stripe"],
    tags: ["promises", "promise-combinators", "allsettled", "any"],
    question: "Compare the four Promise combinators: Promise.all, Promise.race, Promise.allSettled, and Promise.any.",
    shortAnswer: "`Promise.all`: waits for all to fulfill, rejects on first failure. `Promise.race`: settles as soon as first settles (success or fail). `Promise.allSettled` (ES2020): waits for all to settle, never rejects. `Promise.any` (ES2021): fulfills on first success, rejects only if ALL fail with an AggregateError.",
    detailedExplanation: "ES6 standardized `Promise.all` and `Promise.race`. ECMAScript later added `Promise.allSettled` (ES2020) for resilient multi-task workflows where you need statuses of all operations, and `Promise.any` (ES2021) for finding the first successful response among replicas.",
    codeExample: `// Promise.allSettled example:
const promises = [Promise.resolve("Success"), Promise.reject("Fail")];
Promise.allSettled(promises).then(results => {
  // [
  //   { status: "fulfilled", value: "Success" },
  //   { status: "rejected", reason: "Fail" }
  // ]
  console.log(results);
});`
  },
  {
    topic: "Promises",
    subtopic: "Promise.resolve and Promise.reject",
    concept: "What do Promise.resolve() and Promise.reject() do?",
    difficulty: "Beginner",
    questionType: "Concept",
    experienceLevel: "Junior",
    isHighFrequency: true,
    companyTags: ["Microsoft", "LinkedIn"],
    tags: ["promises", "promise-resolve", "promise-reject"],
    question: "What are `Promise.resolve()` and `Promise.reject()`, and what happens if you pass an existing Promise to `Promise.resolve()`?",
    shortAnswer: "They are static factory methods that return an already fulfilled or rejected Promise. If you pass an existing Promise to `Promise.resolve()`, it returns that exact same Promise instance without re-wrapping.",
    detailedExplanation: "`Promise.resolve(val)` converts non-promise values or thenables into native Promises. If `val` is already a native Promise, it is returned directly (`Promise.resolve(p) === p`). `Promise.reject(reason)` always returns a new rejected Promise.",
    codeExample: `const p1 = Promise.resolve(42);
p1.then(v => console.log(v)); // 42

const existing = new Promise(r => r("hello"));
console.log(Promise.resolve(existing) === existing); // true`
  },

  // ==========================================
  // TOPIC 22: Async/Await
  // ==========================================
  {
    topic: "Async/Await",
    subtopic: "Async Function Basics",
    concept: "What does the async keyword do and what does an async function always return?",
    difficulty: "Beginner",
    questionType: "Concept",
    experienceLevel: "Junior",
    isHighFrequency: true,
    companyTags: ["Google", "Amazon", "Meta", "Netflix"],
    tags: ["async-await", "async-function", "promises"],
    question: "What does the `async` keyword do to a function, and what does it always return?",
    shortAnswer: "An `async` function always returns a Promise. If the function returns a non-promise value, JavaScript automatically wraps it in a resolved Promise (`Promise.resolve(value)`).",
    detailedExplanation: "`async/await` was standardized in ES2017 (built directly on ES6 Promises and Generators) to provide synchronous-looking syntax for asynchronous code. Inside an async function, you can use the `await` expression.",
    codeExample: `async function getGreeting() {
  return "Hello, World!";
}

const result = getGreeting();
console.log(result instanceof Promise); // true
result.then(msg => console.log(msg)); // "Hello, World!"`
  },
  {
    topic: "Async/Await",
    subtopic: "Await Keyword",
    concept: "How does the await keyword work inside an async function?",
    difficulty: "Intermediate",
    questionType: "Concept",
    experienceLevel: "Mid-level",
    isHighFrequency: true,
    companyTags: ["Meta", "Uber", "Apple"],
    tags: ["async-await", "await", "event-loop"],
    question: "How does the `await` keyword work, and does it block the entire JavaScript execution thread?",
    shortAnswer: "`await` pauses the execution of only the enclosing async function until the awaited Promise settles. It does NOT block the main JavaScript thread or event loop; other tasks continue executing concurrently.",
    detailedExplanation: "Under the hood, `await` yields control back to the event loop, scheduling the remainder of the async function as a microtask when the promise resolves. This is conceptually equivalent to wrapping everything after `await` in a `.then()` callback.",
    codeExample: `async function demo() {
  console.log("1: Inside start");
  const value = await Promise.resolve("Resolved!");
  console.log("3: Resumed with:", value);
}

console.log("0: Before call");
demo();
console.log("2: After call (main thread not blocked)");

// Output:
// 0: Before call
// 1: Inside start
// 2: After call (main thread not blocked)
// 3: Resumed with: Resolved!`
  },
  {
    topic: "Async/Await",
    subtopic: "Error Handling with Try/Catch",
    concept: "How is error handling performed in async/await functions?",
    difficulty: "Intermediate",
    questionType: "Concept",
    experienceLevel: "Mid-level",
    isHighFrequency: true,
    companyTags: ["Amazon", "Salesforce", "Atlassian"],
    tags: ["async-await", "try-catch", "error-handling"],
    question: "How do you handle errors in `async/await` code, and what happens if an error is not caught inside the function?",
    shortAnswer: "Errors are handled using standard `try...catch` blocks. If an awaited promise rejects and is not caught inside a `try...catch`, the entire async function returns a rejected promise.",
    detailedExplanation: "When an awaited promise rejects, JavaScript unwraps the rejection reason and throws it as an exception inside the async function, allowing traditional `try/catch/finally` control flow.",
    codeExample: `async function loadData() {
  try {
    const res = await fetch("/invalid-endpoint");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Caught error:", err.message);
    return null; // Fallback value
  }
}`
  },
  {
    topic: "Async/Await",
    subtopic: "Sequential vs Parallel Execution",
    concept: "What is the performance difference between sequential awaits and parallel execution?",
    difficulty: "Intermediate",
    questionType: "Scenario",
    experienceLevel: "Mid-level",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Airbnb", "Netflix"],
    tags: ["async-await", "parallel-execution", "performance"],
    question: "What is the common performance mistake with sequential `await` statements, and how do you execute promises in parallel?",
    shortAnswer: "Awaiting independent promises sequentially causes an unnecessary waterfall where each operation waits for the previous one to finish. Use `Promise.all([p1(), p2()])` to initiate and await them concurrently.",
    detailedExplanation: "If two operations do not depend on each other's output, awaiting them sequentially doubles the latency. Initiating both promises immediately and awaiting `Promise.all` allows them to run concurrently.",
    codeExample: `// ❌ Sequential Waterfall (e.g. takes 2 + 2 = 4 seconds):
async function slow() {
  const users = await fetchUsers();
  const products = await fetchProducts();
  return { users, products };
}

// ✅ Parallel Execution (takes max(2, 2) = 2 seconds):
async function fast() {
  const [users, products] = await Promise.all([
    fetchUsers(),
    fetchProducts()
  ]);
  return { users, products };
}`
  },
  {
    topic: "Async/Await",
    subtopic: "Async/Await vs Promises",
    concept: "Compare async/await with raw Promises.",
    difficulty: "Intermediate",
    questionType: "Difference",
    experienceLevel: "Mid-level",
    isHighFrequency: true,
    companyTags: ["Amazon", "Microsoft", "Stripe"],
    tags: ["async-await", "promises", "comparison"],
    question: "What are the advantages of `async/await` over raw Promise chaining?",
    shortAnswer: "`async/await` offers cleaner syntax, synchronous-looking control flow, simpler `try/catch` error handling, better debugging stack traces, and easier handling of conditional logic and shared intermediate variables.",
    detailedExplanation: "With raw `.then()`, passing intermediate results through multiple steps requires nesting or outer scope variables. With `async/await`, intermediate values remain easily accessible in local variables.",
    codeExample: `// Promise chaining intermediate value issue:
fetchUser()
  .then(user => {
    return fetchPermissions(user).then(perms => ({ user, perms }));
  })
  .then(({ user, perms }) => render(user, perms));

// Cleaner with async/await:
async function init() {
  const user = await fetchUser();
  const perms = await fetchPermissions(user);
  render(user, perms);
}`
  },

  // ==========================================
  // TOPIC 23: ES6 Proxy
  // ==========================================
  {
    topic: "ES6 Proxy",
    subtopic: "Proxy Basics",
    concept: "What is an ES6 Proxy and what are targets and handlers?",
    difficulty: "Intermediate",
    questionType: "Concept",
    experienceLevel: "Mid-level",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Apple"],
    tags: ["proxy", "metaprogramming", "es6-features"],
    question: "What is an ES6 Proxy, and what are the roles of the `target` and `handler` objects?",
    shortAnswer: "A Proxy allows you to intercept and customize fundamental operations on an object (such as property lookup, assignment, enumeration, and function invocation). `target` is the original object being wrapped, and `handler` is an object containing 'traps' (interceptor functions).",
    detailedExplanation: "Syntax: `new Proxy(target, handler)`. When an operation is performed on the proxy, the engine checks if the handler defines the corresponding trap. If defined, the trap executes; otherwise, the default operation is forwarded to the target.",
    codeExample: `const target = { name: "Alice" };
const handler = {
  get(target, prop, receiver) {
    return prop in target ? target[prop] : "Property not found";
  }
};

const proxy = new Proxy(target, handler);
console.log(proxy.name); // "Alice"
console.log(proxy.age);  // "Property not found"`
  },
  {
    topic: "ES6 Proxy",
    subtopic: "Get and Set Traps",
    concept: "How do the get and set traps work for property access and validation?",
    difficulty: "Advanced",
    questionType: "Short Code",
    experienceLevel: "Senior",
    isHighFrequency: true,
    companyTags: ["Google", "Amazon", "Netflix"],
    tags: ["proxy", "traps", "validation"],
    question: "How do you implement property validation using an ES6 Proxy `set` trap?",
    shortAnswer: "The `set(target, prop, value, receiver)` trap intercepts property assignment. You validate the incoming value, and either assign it to `target[prop] = value` and return `true` (success), or throw a TypeError/return `false`.",
    detailedExplanation: "In strict mode, returning `false` from a `set` trap throws a `TypeError`. The `set` trap must return a boolean indicating whether the assignment succeeded.",
    codeExample: `const validator = {
  set(target, prop, value) {
    if (prop === "age") {
      if (typeof value !== "number" || value < 0) {
        throw new TypeError("Age must be a positive number");
      }
    }
    target[prop] = value;
    return true; // Indicates success
  }
};

const person = new Proxy({}, validator);
person.age = 25; // Works
// person.age = -5; // Throws TypeError: Age must be a positive number`
  },
  {
    topic: "ES6 Proxy",
    subtopic: "Has and DeleteProperty Traps",
    concept: "How do the has and deleteProperty traps intercept the in and delete operators?",
    difficulty: "Advanced",
    questionType: "Concept",
    experienceLevel: "Senior",
    isHighFrequency: false,
    companyTags: ["Meta", "Uber"],
    tags: ["proxy", "has-trap", "delete-trap"],
    question: "Which operations are intercepted by the `has` and `deleteProperty` traps in an ES6 Proxy?",
    shortAnswer: "The `has` trap intercepts the `in` operator (e.g., `'secret' in proxy`). The `deleteProperty` trap intercepts property deletion via the `delete` operator (e.g., `delete proxy.secret`).",
    detailedExplanation: "Both traps allow hiding private properties or making certain fields read-only and undeletable without modifying the underlying object structure.",
    codeExample: `const secretHandler = {
  has(target, prop) {
    if (prop.startsWith("_")) return false; // Hide private fields from 'in'
    return prop in target;
  },
  deleteProperty(target, prop) {
    if (prop.startsWith("_")) {
      throw new Error(\`Cannot delete private property \${prop}\`);
    }
    return delete target[prop];
  }
};

const obj = new Proxy({ name: "Doc", _token: "secret123" }, secretHandler);
console.log("_token" in obj); // false
console.log("name" in obj);   // true`
  },
  {
    topic: "ES6 Proxy",
    subtopic: "Proxy Use Cases",
    concept: "What are the common real-world use cases of ES6 Proxies?",
    difficulty: "Advanced",
    questionType: "Scenario",
    experienceLevel: "Senior",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Vue.js Community", "Microsoft"],
    tags: ["proxy", "use-cases", "reactivity"],
    question: "What are the most common real-world use cases for ES6 Proxy?",
    shortAnswer: "Key use cases include: reactive state management (used in Vue 3 Reactivity and MobX), data validation/type checking, negative array indexing, logging and profiling access, and caching/memoization.",
    detailedExplanation: "Vue 3 replaced `Object.defineProperty` with ES6 `Proxy` because Proxies can track new property additions, property deletions, and array index assignments seamlessly without requiring manual reactivity hooks like `Vue.set`.",
    codeExample: `// Negative array indexing using Proxy:
const negativeArray = (arr) => new Proxy(arr, {
  get(target, prop) {
    const index = Number(prop);
    if (index < 0) {
      return target[target.length + index];
    }
    return target[prop];
  }
});

const list = negativeArray(["a", "b", "c", "d"]);
console.log(list[-1]); // "d"
console.log(list[-2]); // "c"`
  },
  {
    topic: "ES6 Proxy",
    subtopic: "Revocable Proxies",
    concept: "What is Proxy.revocable() and when is it useful?",
    difficulty: "Advanced",
    questionType: "Concept",
    experienceLevel: "Senior",
    isHighFrequency: false,
    companyTags: ["Google", "Meta"],
    tags: ["proxy", "revocable", "security"],
    question: "What is `Proxy.revocable()` and when would you use it?",
    shortAnswer: "`Proxy.revocable(target, handler)` returns an object `{ proxy, revoke }`. Calling `revoke()` permanently disables the proxy; any subsequent operation on it throws a `TypeError`.",
    detailedExplanation: "Revocable proxies are useful for security and resource management—for example, granting temporary access to sensitive data or an external plugin and cutting off access completely when the session ends.",
    codeExample: `const { proxy, revoke } = Proxy.revocable({ secret: "XYZ" }, {});
console.log(proxy.secret); // "XYZ"

revoke(); // Revoke access
// Any subsequent access throws:
try {
  console.log(proxy.secret);
} catch (e) {
  console.log("Revoked proxy access forbidden:", e.name); // TypeError
}`
  },

  // ==========================================
  // TOPIC 24: Reflect
  // ==========================================
  {
    topic: "Reflect",
    subtopic: "Reflect Basics",
    concept: "What is the ES6 Reflect API and why was it introduced?",
    difficulty: "Intermediate",
    questionType: "Concept",
    experienceLevel: "Mid-level",
    isHighFrequency: true,
    companyTags: ["Google", "Meta", "Amazon"],
    tags: ["reflect", "metaprogramming", "es6-features"],
    question: "What is the ES6 `Reflect` built-in object, and why was it introduced?",
    shortAnswer: "`Reflect` is a built-in global object (not a constructor) that provides methods for interceptable JavaScript operations. Its methods match Proxy traps 1:1, unifying internal object methods into a clean API.",
    detailedExplanation: "Prior to ES6, object reflection was fragmented across `Object.prototype`, `Object.defineProperty`, `delete`, and `in`. `Reflect` unifies these into a clean functional API and provides sensible boolean return values instead of throwing exceptions.",
    codeExample: `// Reflect methods mirror Proxy traps 1:1
const obj = { x: 1, y: 2 };

console.log(Reflect.has(obj, "x")); // true (like 'x' in obj)
console.log(Reflect.get(obj, "y")); // 2 (like obj.y)
Reflect.set(obj, "z", 3);           // like obj.z = 3
console.log(obj.z);                 // 3`
  },
  {
    topic: "Reflect",
    subtopic: "Reflect with Proxy",
    concept: "Why should you always use Reflect inside Proxy traps?",
    difficulty: "Advanced",
    questionType: "Concept",
    experienceLevel: "Senior",
    isHighFrequency: true,
    companyTags: ["Google", "Microsoft", "Stripe"],
    tags: ["reflect", "proxy", "receiver"],
    question: "Why is it best practice to use `Reflect` methods inside Proxy traps?",
    shortAnswer: "Reflect methods mirror Proxy traps with identical signatures and handle the `receiver` parameter correctly, ensuring getters/setters execute with the right `this` context when inheritance is involved.",
    detailedExplanation: "If you simply write `target[prop]` inside a `get` trap, any getter on the target will evaluate with `this === target` rather than `this === proxy`. Passing the `receiver` via `Reflect.get(target, prop, receiver)` preserves prototype inheritance.",
    codeExample: `const parent = {
  _name: "Parent",
  get name() { return this._name; }
};

const proxy = new Proxy(parent, {
  get(target, prop, receiver) {
    // Correctly forwards receiver so 'this' inside getter points to receiver:
    return Reflect.get(target, prop, receiver);
  }
});

const child = { _name: "Child" };
Object.setPrototypeOf(child, proxy);
console.log(child.name); // "Child" (with Reflect.get), would be "Parent" with target[prop]`
  },
  {
    topic: "Reflect",
    subtopic: "Reflect vs Object Methods",
    concept: "How do Reflect methods differ from corresponding Object methods?",
    difficulty: "Advanced",
    questionType: "Difference",
    experienceLevel: "Senior",
    isHighFrequency: true,
    companyTags: ["Meta", "Amazon"],
    tags: ["reflect", "object-methods", "comparison"],
    question: "How do `Reflect` methods differ from their corresponding `Object` methods (e.g. `Reflect.defineProperty` vs `Object.defineProperty`)?",
    shortAnswer: "`Object.defineProperty` throws a `TypeError` if property definition fails, whereas `Reflect.defineProperty` returns `false`. Also, `Reflect.ownKeys()` returns all string and symbol keys, whereas `Object.keys()` only returns enumerable strings.",
    detailedExplanation: "`Reflect` methods return boolean flags representing success or failure, simplifying error handling without requiring `try...catch` blocks for common reflection tasks.",
    codeExample: `const obj = Object.freeze({ a: 1 });

// Object.defineProperty throws TypeError in strict mode:
// Object.defineProperty(obj, "b", { value: 2 }); // Uncaught TypeError!

// Reflect.defineProperty cleanly returns false:
const success = Reflect.defineProperty(obj, "b", { value: 2 });
console.log("Did it succeed?:", success); // false`
  },
  {
    topic: "Reflect",
    subtopic: "Reflect.ownKeys",
    concept: "What does Reflect.ownKeys() return and how does it compare to Object.keys()?",
    difficulty: "Intermediate",
    questionType: "Concept",
    experienceLevel: "Mid-level",
    isHighFrequency: true,
    companyTags: ["Google", "Uber"],
    tags: ["reflect", "ownkeys", "symbols"],
    question: "What does `Reflect.ownKeys()` return, and how does it differ from `Object.keys()` and `Object.getOwnPropertyNames()`?",
    shortAnswer: "`Reflect.ownKeys(target)` returns an array of ALL own property keys of the target object, including non-enumerable properties and Symbol keys. It is equivalent to `Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))`.",
    detailedExplanation: "`Object.keys()` returns only enumerable string properties. `Object.getOwnPropertyNames()` returns enumerable and non-enumerable string properties but misses symbols. `Reflect.ownKeys()` returns all strings and symbols.",
    codeExample: `const sym = Symbol("id");
const obj = {
  visible: "yes",
  [sym]: 123
};
Object.defineProperty(obj, "hidden", { value: "secret", enumerable: false });

console.log(Object.keys(obj));                 // ["visible"]
console.log(Object.getOwnPropertyNames(obj));  // ["visible", "hidden"]
console.log(Reflect.ownKeys(obj));             // ["visible", "hidden", Symbol(id)]`
  },

  // ==========================================
  // TOPIC 25: ES6 Built-in Improvements Overview
  // ==========================================
  {
    topic: "ES6 Built-in Improvements",
    subtopic: "Standard Library Overview",
    concept: "What major improvements were added to standard JavaScript built-ins in ES6?",
    difficulty: "Beginner",
    questionType: "Concept",
    experienceLevel: "Junior",
    isHighFrequency: true,
    companyTags: ["Google", "Amazon", "Microsoft"],
    tags: ["built-ins", "es6-improvements", "standard-library"],
    question: "Summarize the major additions to JavaScript built-in standard objects introduced in ES6.",
    shortAnswer: "ES6 added new collection types (Map, Set, WeakMap, WeakSet), new primitive (Symbol), Promises, Proxy/Reflect, and substantial utility methods across Array (`from`, `of`, `find`, `findIndex`), String (`includes`, `startsWith`, `endsWith`, `repeat`), Object (`assign`, `is`), Number (`isNaN`, `isFinite`, `isInteger`), and Math.",
    detailedExplanation: "Before ES6, developers frequently relied on utility libraries like Underscore or Lodash for basic operations like cloning objects, searching arrays, or checking integers. ES6 baked these directly into the language runtime.",
    codeExample: `// Before ES6 (Lodash/workarounds):
// _.find(arr, fn), _.assign({}, a, b), isNaN(val) [flawed]

// In native ES6:
const found = [1, 2, 3, 4].find(x => x > 2); // 3
const merged = Object.assign({}, { a: 1 }, { b: 2 }); // { a: 1, b: 2 }
const safe = Number.isInteger(42); // true`
  },
  {
    topic: "ES6 Built-in Improvements",
    subtopic: "Math Improvements",
    concept: "What new Math methods were introduced in ES6?",
    difficulty: "Intermediate",
    questionType: "Concept",
    experienceLevel: "Mid-level",
    isHighFrequency: false,
    companyTags: ["Microsoft", "Adobe"],
    tags: ["math", "es6-improvements", "number"],
    question: "Which notable methods were added to the `Math` object in ES6?",
    shortAnswer: "Key ES6 Math additions include: `Math.trunc()` (removes fractional digits), `Math.sign()` (returns -1, 0, or 1), `Math.cbrt()` (cube root), `Math.hypot()` (square root of sum of squares), `Math.log10()`, and `Math.clz32()` (leading zero bits).",
    detailedExplanation: "`Math.trunc()` provides clean integer truncation without the subtle gotchas of `Math.floor()` on negative numbers. `Math.hypot()` avoids intermediate overflow when computing Euclidean distance.",
    codeExample: `// Math.trunc vs Math.floor with negative numbers:
console.log(Math.trunc(-4.9)); // -4
console.log(Math.floor(-4.9)); // -5

// Math.sign:
console.log(Math.sign(-50)); // -1
console.log(Math.sign(0));   // 0
console.log(Math.sign(42));  // 1

// Math.hypot (Pythagorean theorem: hypotenuse):
console.log(Math.hypot(3, 4)); // 5`
  }
];
