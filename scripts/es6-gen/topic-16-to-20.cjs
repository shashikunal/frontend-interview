// scripts/es6-gen/topic-16-to-20.cjs
// Topics 16 - 20:
// 16. WeakMap
// 17. WeakSet
// 18. Classes
// 19. Inheritance
// 20. Modules

module.exports = [
  // ==========================================
  // TOPIC 16: WeakMap
  // ==========================================
  {
    topic: "WeakMap",
    subtopic: "WeakMap Overview and Object Keys",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is an ES6 WeakMap and why must its keys be objects?",
    shortAnswer: "A WeakMap is a collection of key-value pairs where keys must be objects (or non-registered Symbols) and are held weakly, meaning if an object key has no other references, it is automatically garbage collected along with its value.",
    detailedExplanation: "- **Object Keys Only**: Primitive values (like numbers or strings) cannot be keys because primitives are not subject to garbage collection.\n- **Weak References**: The WeakMap does not prevent its keys from being reclaimed by the garbage collector.\n- **Automatic Cleanup**: When an object key is collected, its associated value in the WeakMap is also freed, preventing memory leaks.\n- **Methods**: Only supports `get()`, `set()`, `has()`, and `delete()`.",
    codeExample: "const wm = new WeakMap();\nlet user = { name: 'Alice' };\n\nwm.set(user, 'Metadata');\nconsole.log(wm.get(user)); // 'Metadata'\n\n// When user is dereferenced:\nuser = null;\n// The entry in wm will be automatically garbage collected!",
    interviewTips: ["State that WeakMap exists to associate metadata with objects without preventing those objects from being garbage collected."]
  },
  {
    topic: "WeakMap",
    subtopic: "WeakMap Non-Enumerability & No Size",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "Why does a WeakMap have no .size property and no iteration methods (.keys(), .values(), for...of)?",
    shortAnswer: "Because keys are held weakly, the timing of garbage collection is non-deterministic. Exposing .size or iteration would expose internal engine garbage collection timing, which is forbidden by the ECMAScript specification.",
    detailedExplanation: "- **Garbage Collection Independence**: An object might be eligible for garbage collection, but the engine hasn't run the GC cycle yet.\n- **Observability**: If `wm.size` existed, observing it before and after a GC cycle would expose non-deterministic engine internals.\n- **No Snapshot**: You cannot inspect all keys; you can only query a key if you already hold a reference to that key object.",
    codeExample: "const wm = new WeakMap();\nconst obj = {};\nwm.set(obj, 'test');\n\nconsole.log(wm.size);     // undefined (property does not exist!)\n// for (const x of wm) {} // TypeError: wm is not iterable\n// wm.clear();            // undefined (clear() method does not exist in standard WeakMap)",
    interviewTips: ["Explain that exposing size or iteration would leak non-deterministic garbage collection timing."]
  },
  {
    topic: "WeakMap",
    subtopic: "WeakMap vs Map",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    question: "What are the key differences between WeakMap and Map?",
    shortAnswer: "Map allows keys of any type, is iterable, has a size property, and holds strong references. WeakMap requires object keys, is non-iterable, has no size, and holds weak references allowing automatic garbage collection.",
    detailedExplanation: "- **Key Types**: Map accepts primitives and objects; WeakMap strictly requires objects.\n- **Garbage Collection**: Map prevents keys from being GC'd; WeakMap allows keys to be GC'd.\n- **Iteration**: Map has `keys()`, `values()`, `entries()`, `forEach()`; WeakMap has no iteration methods.\n- **Methods**: WeakMap has only `get`, `set`, `has`, `delete`.",
    codeExample: "// Map (Strong references - memory retained):\nconst map = new Map();\nlet key1 = { id: 1 };\nmap.set(key1, 'data'); // key1 cannot be garbage collected while map exists\n\n// WeakMap (Weak references - safe from memory leaks):\nconst weakMap = new WeakMap();\nlet key2 = { id: 2 };\nweakMap.set(key2, 'data'); // key2 will be garbage collected if nullified",
    interviewTips: ["Structure your answer into 4 points: Key types, GC behavior, Iterability, and Size availability."]
  },
  {
    topic: "WeakMap",
    subtopic: "Private Data Simulation with WeakMap",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How was WeakMap used in ES6 to simulate truly private instance variables before private class fields (#) were added?",
    shortAnswer: "Create a WeakMap scoped inside a module closure with 'this' as the key; instances store private fields in the WeakMap, preventing outer code from accessing them.",
    detailedExplanation: "- **Closure Protection**: Outer code cannot inspect the WeakMap if it is not exported from the module.\n- **Instance Isolation**: Using `this` as the key ensures each instance has isolated private state.\n- **Automatic GC**: When the instance is destroyed, its private data in the WeakMap is cleaned up automatically.",
    codeExample: "const privateData = new WeakMap();\n\nclass BankAccount {\n  constructor(initialBalance) {\n    // Stores private state keyed by this instance:\n    privateData.set(this, { balance: initialBalance });\n  }\n  getBalance() {\n    return privateData.get(this).balance;\n  }\n  deposit(amount) {\n    privateData.get(this).balance += amount;\n  }\n}\n\nconst account = new BankAccount(100);\nconsole.log(account.getBalance()); // 100\nconsole.log(account.balance);      // undefined (truly private!)",
    interviewTips: ["Mention that the WeakMap private data pattern was the standard before `#field` syntax was standardized."]
  },
  {
    topic: "WeakMap",
    subtopic: "DOM Node Metadata Caching with WeakMap",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "Why is WeakMap the ideal data structure for caching event listener metadata or widget state for DOM elements?",
    shortAnswer: "Using DOM elements as keys in a WeakMap ensures that when an element is removed from the DOM tree and has no other references, its cached metadata is automatically freed without needing manual cleanup.",
    detailedExplanation: "- **Detached DOM Leaks**: A standard `Map` retains deleted DOM nodes forever, causing memory leaks in single-page apps.\n- **Zero Cleanup Code**: You don't have to manually delete entries when elements unmount.\n- **Encapsulated State**: Associate click counts, active state, or controllers with DOM nodes safely.",
    codeExample: "const clickCounts = new WeakMap();\n\nfunction trackButtonClick(button) {\n  const currentCount = clickCounts.get(button) || 0;\n  clickCounts.set(button, currentCount + 1);\n  console.log(`Button clicked ${currentCount + 1} times`);\n}\n\n// When button is later removed with button.remove(),\n// clickCounts entry is automatically reclaimed by GC!",
    interviewTips: ["Cite DOM node metadata caching as the primary real-world application of `WeakMap` in frontend architecture."]
  },

  // ==========================================
  // TOPIC 17: WeakSet
  // ==========================================
  {
    topic: "WeakSet",
    subtopic: "WeakSet Overview and Object Values",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is an ES6 WeakSet and how does it differ from a regular Set?",
    shortAnswer: "A WeakSet is a collection of unique objects only. Values are held weakly, meaning unreferenced objects are automatically garbage collected. WeakSets cannot store primitives, have no .size property, and cannot be iterated.",
    detailedExplanation: "- **Objects Only**: Calling `weakSet.add(42)` throws a `TypeError: Invalid value used in weak set`.\n- **Weak References**: Does not prevent garbage collection of stored objects.\n- **Methods**: Only supports `add()`, `has()`, and `delete()`.\n- **Non-Enumerable**: Has no `size`, `values()`, or `clear()` method.",
    codeExample: "const ws = new WeakSet();\nlet user = { id: 1 };\n\nws.add(user);\nconsole.log(ws.has(user)); // true\n\n// user is dereferenced:\nuser = null;\n// Object will be reclaimed from WeakSet automatically by GC!",
    interviewTips: ["State that `WeakSet` only stores objects, not primitives, and cannot be iterated."]
  },
  {
    topic: "WeakSet",
    subtopic: "Tagging / Marking Objects with WeakSet",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "What is the primary use case for WeakSet in JavaScript architecture?",
    shortAnswer: "WeakSet is primarily used to tag or mark objects (e.g. tracking visited objects in recursive algorithms, or ensuring methods are only called on valid class instances) without modifying the objects themselves.",
    detailedExplanation: "- **Zero Object Mutation**: Avoids adding dummy properties like `obj._isVisited = true` or `obj._processed = true` to user objects.\n- **No Memory Leaks**: Temporary tracking sets do not prevent object disposal after processing completes.\n- **Method Branding**: Check if an object was created by a specific constructor before executing sensitive methods.",
    codeExample: "const visitedObjects = new WeakSet();\n\nfunction deepTraverse(obj) {\n  // Detect circular references without mutating obj:\n  if (visitedObjects.has(obj)) {\n    return '[Circular]';\n  }\n  visitedObjects.add(obj);\n  \n  for (const [key, val] of Object.entries(obj)) {\n    if (typeof val === 'object' && val !== null) {\n      deepTraverse(val);\n    }\n  }\n}",
    interviewTips: ["Cite circular reference detection during recursive traversal as the textbook use case for WeakSet."]
  },
  {
    topic: "WeakSet",
    subtopic: "Method Invocation Protection with WeakSet",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How can a WeakSet be used to ensure an instance method is only invoked on authorized class instances?",
    shortAnswer: "Add newly constructed instances to a private WeakSet in the constructor and verify ws.has(this) at the beginning of method calls, throwing an error if invoked with an invalid this context.",
    detailedExplanation: "- **Brand Check**: Guarantees that someone didn't borrow the method via `method.call(unauthorizedObj)`.\n- **Private Enforcement**: The WeakSet is kept in module scope, inaccessible to outside code.\n- **Modern Equivalents**: Similar to internal private brand checks performed by `#privateField`.",
    codeExample: "const validInstances = new WeakSet();\n\nclass SecureResource {\n  constructor() {\n    validInstances.add(this); // Brand instance\n  }\n  performSecureAction() {\n    if (!validInstances.has(this)) {\n      throw new TypeError('Method called on unauthorized instance');\n    }\n    console.log('Action performed successfully');\n  }\n}\n\nconst resource = new SecureResource();\nresource.performSecureAction(); // Valid\n\n// Unauthorized invocation:\n// SecureResource.prototype.performSecureAction.call({}); // Throws TypeError!",
    interviewTips: ["Explain that this 'brand check' pattern prevents unauthorized method borrowing."]
  },
  {
    topic: "WeakSet",
    subtopic: "WeakSet Error on Primitives",
    difficulty: "EASY",
    questionType: "OUTPUT",
    question: "What happens when you call weakSet.add('hello') or weakSet.add(10)?",
    shortAnswer: "It throws a TypeError: Invalid value used in weak set, because WeakSet strictly requires object values.",
    detailedExplanation: "- **Specification Rule**: Every value added to a WeakSet must be an Object (or non-registered Symbol in newer specs).\n- **Why Primitives Are Rejected**: Primitives are values, not memory identities, and cannot be garbage collected weakly.\n- **Contrast with Set**: Regular `Set` accepts any primitive or object value.",
    codeExample: "const ws = new WeakSet();\n\ntry {\n  ws.add('hello'); // Throws TypeError!\n} catch (err) {\n  console.log(err.name); // 'TypeError'\n}\n\n// Correct usage:\nws.add({ message: 'hello' }); // Allowed!",
    interviewTips: ["Remember: Primitive values passed to WeakSet always throw a TypeError."]
  },

  // ==========================================
  // TOPIC 18: Classes
  // ==========================================
  {
    topic: "Classes",
    subtopic: "Class Syntax and Constructor",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What is the ES6 class syntax and how does the constructor method work?",
    shortAnswer: "ES6 class syntax provides a clean, declarative way to define object constructors and prototypes. The constructor() method is called automatically when instantiating the class with 'new'.",
    detailedExplanation: "- **Syntactic Sugar**: Built on top of JavaScript's existing prototype-based inheritance model.\n- **constructor Method**: Initializes instance properties on `this`.\n- **Single Constructor**: A class can have only one `constructor` method; defining more than one throws a `SyntaxError`.\n- **Mandatory 'new'**: Calling a class without `new` throws `TypeError: Class constructor cannot be invoked without 'new'`.",
    codeExample: "class User {\n  constructor(name, role) {\n    this.name = name;\n    this.role = role;\n  }\n  greet() {\n    return `Hello, I am ${this.name}`;\n  }\n}\n\nconst alice = new User('Alice', 'Admin');\nconsole.log(alice.greet()); // 'Hello, I am Alice'",
    interviewTips: ["Emphasize that calling a class without `new` throws a TypeError, unlike traditional ES5 function constructors."]
  },
  {
    topic: "Classes",
    subtopic: "Class Declarations vs Function Constructors",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    question: "What are the major technical differences between an ES6 class and an ES5 constructor function?",
    shortAnswer: "Classes are not hoisted into initialized scope (TDZ applies), always execute in strict mode, require the 'new' keyword, have non-enumerable prototype methods, and provide cleaner inheritance syntax.",
    detailedExplanation: "- **TDZ Hoisting**: Function declarations are hoisted and initialized; class declarations are hoisted into TDZ.\n- **Strict Mode**: The entire body of a class runs in `'use strict'` mode automatically.\n- **Non-Enumerable Methods**: Class methods on the prototype have `enumerable: false` (skipped by `for...in`).\n- **Invocation Safety**: Constructor functions can be called as ordinary functions `Person()`; classes throw `TypeError` if called without `new`.",
    codeExample: "// ES5 constructor can be called without new (polluting window):\nfunction OldUser(name) { this.name = name; }\n// OldUser('Alice'); // Accidental global pollution!\n\n// ES6 class is safe:\nclass NewUser {\n  constructor(name) { this.name = name; }\n}\n// NewUser('Alice'); // TypeError: Class constructor NewUser cannot be invoked without 'new'",
    interviewTips: ["List at least 3 differences: 1) Strict mode by default, 2) No invocation without `new`, 3) Methods are non-enumerable."]
  },
  {
    topic: "Classes",
    subtopic: "Static Methods and Properties",
    difficulty: "EASY",
    questionType: "CODE",
    question: "What is a static method in an ES6 class and how is it invoked?",
    shortAnswer: "A static method is defined with the static keyword and belongs to the class constructor itself, not to individual instances. It is called directly as ClassName.methodName().",
    detailedExplanation: "- **Constructor Attachment**: Static methods are defined directly on the constructor function object, not on `prototype`.\n- **Instance Access**: Instances cannot call static methods (`instance.staticMethod()` is undefined).\n- **Utility Functions**: Commonly used for factory functions (e.g. `User.createAdmin()`), comparison helpers, and cloning.",
    codeExample: "class Point {\n  constructor(x, y) {\n    this.x = x;\n    this.y = y;\n  }\n  static distance(a, b) {\n    const dx = a.x - b.x;\n    const dy = a.y - b.y;\n    return Math.hypot(dx, dy);\n  }\n}\n\nconst p1 = new Point(0, 0);\nconst p2 = new Point(3, 4);\nconsole.log(Point.distance(p1, p2)); // 5 (Called on Point class)\n// console.log(p1.distance(p1, p2));  // TypeError: p1.distance is not a function",
    interviewTips: ["Clarify that `this` inside a static method points to the class constructor itself, not an instance."]
  },
  {
    topic: "Classes",
    subtopic: "Getters and Setters in Classes",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do getters and setters work in ES6 classes?",
    shortAnswer: "Getters (get propName()) and setters (set propName(value)) define accessor properties on the prototype that execute functions when properties are read or assigned.",
    detailedExplanation: "- **Accessor Syntax**: Accessed as normal properties without parentheses: `user.fullName`.\n- **Validation & Encapsulation**: Setters allow validating incoming values before storing them.\n- **Prototype Placement**: Defined on `Class.prototype`, shared across all instances.",
    codeExample: "class Temperature {\n  constructor(celsius) {\n    this._celsius = celsius;\n  }\n  get fahrenheit() {\n    return (this._celsius * 9/5) + 32;\n  }\n  set fahrenheit(val) {\n    this._celsius = (val - 32) * 5/9;\n  }\n}\n\nconst temp = new Temperature(0);\nconsole.log(temp.fahrenheit); // 32\ntemp.fahrenheit = 212;\nconsole.log(temp._celsius);   // 100",
    interviewTips: ["Warn against naming backing instance variables identically to the getter/setter, which causes infinite recursive loops (`this.val = val` in `set val()`)."]
  },
  {
    topic: "Classes",
    subtopic: "Class Expressions vs Class Declarations",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is the difference between a class declaration and a class expression?",
    shortAnswer: "A class declaration has a named identifier (class User {}); a class expression assigns an anonymous or named class to a variable (const User = class {};).",
    detailedExplanation: "- **First-Class Citizens**: Class expressions demonstrate that classes in JavaScript are first-class values that can be passed to functions or returned from functions.\n- **Named Class Expressions**: In `const MyClass = class InternalName {}`, `InternalName` is visible ONLY inside the class body.\n- **Factory Creation**: Allows creating dynamic classes on the fly.",
    codeExample: "// Class Declaration:\nclass Box {}\n\n// Anonymous Class Expression:\nconst Rectangle = class {\n  constructor(w, h) { this.w = w; this.h = h; }\n};\n\n// Named Class Expression (useful for debugging stack traces):\nconst Circle = class MyCircle {\n  printName() { console.log(MyCircle.name); }\n};\nnew Circle().printName(); // 'MyCircle'",
    interviewTips: ["Explain that class expressions allow factory functions to generate and return custom configured classes."]
  },
  {
    topic: "Classes",
    subtopic: "Class Fields (Public & Private Context)",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What are class public and private fields in modern ECMAScript and how does private syntax (#) work?",
    shortAnswer: "Public class fields declare instance properties directly on the class body without constructor assignment. Private fields are prefixed with a hash (#field) and cannot be accessed from outside the class.",
    detailedExplanation: "- **Public Fields**: `count = 0;` declares property on each instance during instantiation.\n- **Private Fields (#)**: Enforced by the JavaScript engine; attempting `instance.#privateField` from outside throws a compile-time `SyntaxError`.\n- **ECMAScript Context**: The `#field` syntax was finalized in ES2022, building directly upon the foundational ES6 class model.",
    codeExample: "class Counter {\n  publicLabel = 'My Counter';\n  #count = 0; // Private field!\n\n  increment() {\n    this.#count++;\n  }\n  getCount() {\n    return this.#count;\n  }\n}\n\nconst c = new Counter();\nc.increment();\nconsole.log(c.getCount()); // 1\n// console.log(c.#count); // SyntaxError: Private field '#count' must be declared in an enclosing class",
    interviewTips: ["Be accurate about ECMAScript timeline: ES6 introduced basic class syntax; private `#field` syntax was standardized in ES2022."]
  },
  {
    topic: "Classes",
    subtopic: "Prototype Method Enumerability in Classes",
    difficulty: "INTERMEDIATE",
    questionType: "OUTPUT",
    question: "Why do class methods not appear when iterating over an instance using for...in?",
    shortAnswer: "ES6 specifies that all methods declared inside a class body have their enumerable descriptor flag set to false, meaning they are excluded from for...in loops and Object.keys().",
    detailedExplanation: "- **Clean Iteration**: Prevents object method names from polluting iterations when inspecting an instance's data properties.\n- **Contrast with ES5**: In ES5, `Constructor.prototype.method = function() {}` created enumerable properties by default unless manually hidden with `Object.defineProperty`.\n- **Inspection**: You can inspect non-enumerable methods using `Object.getOwnPropertyNames(Class.prototype)`.",
    codeExample: "class Car {\n  constructor(make) {\n    this.make = make;\n  }\n  drive() {}\n}\n\nconst car = new Car('Toyota');\nfor (const key in car) {\n  console.log(key); // Logs 'make' only! 'drive' is non-enumerable.\n}\n\nconsole.log(Object.getOwnPropertyDescriptor(Car.prototype, 'drive').enumerable); // false",
    interviewTips: ["State that class methods have `enumerable: false` on the prototype by design."]
  },

  // ==========================================
  // TOPIC 19: Inheritance
  // ==========================================
  {
    topic: "Inheritance",
    subtopic: "extends Keyword and Prototype Chain",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How does class inheritance work in ES6 using the extends keyword?",
    shortAnswer: "The extends keyword sets up prototype inheritance between classes, linking Child.prototype to Parent.prototype for instance methods, and linking Child to Parent for static methods.",
    detailedExplanation: "- **Two Prototype Links**: In ES6 classes, both instances AND the constructor functions inherit prototypes.\n- **Instance Chain**: `childInstance.__proto__ === Child.prototype`, and `Child.prototype.__proto__ === Parent.prototype`.\n- **Static Chain**: `Child.__proto__ === Parent`, meaning static methods on the parent are inherited by the child class automatically.",
    codeExample: "class Animal {\n  constructor(name) { this.name = name; }\n  speak() { return `${this.name} makes a noise`; }\n  static info() { return 'Animal Kingdom'; }\n}\n\nclass Dog extends Animal {\n  speak() { return `${this.name} barks`; }\n}\n\nconst d = new Dog('Rex');\nconsole.log(d.speak());    // 'Rex barks'\nconsole.log(Dog.info());   // 'Animal Kingdom' (Static method inherited!)",
    interviewTips: ["Highlight that `extends` inherits BOTH instance prototype methods and static methods."]
  },
  {
    topic: "Inheritance",
    subtopic: "super() in Constructor & 'this' Initialization",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "Why MUST super() be called before accessing 'this' in a derived class constructor?",
    shortAnswer: "In derived classes, 'this' is not initialized by the engine until the parent constructor executes via super(). Accessing 'this' before super() throws a ReferenceError.",
    detailedExplanation: "- **Subclass Construction Spec**: In ES6, derived classes have an internal `[[ConstructorKind]]: 'derived'` slot.\n- **Parent Allocation**: The parent class constructor is responsible for allocating the instance memory and binding it to `this`.\n- **ReferenceError**: Accessing `this.prop` or returning before `super()` throws `ReferenceError: Must call super constructor in derived class before accessing 'this'`.",
    codeExample: "class Parent {}\n\nclass Child extends Parent {\n  constructor(name) {\n    // console.log(this); // ReferenceError: Must call super constructor before accessing 'this'\n    super(); // Allocates and initializes 'this'\n    this.name = name; // Valid!\n  }\n}",
    interviewTips: ["Cite the internal reason: derived constructors do not allocate `this`—`super()` allocates it."]
  },
  {
    topic: "Inheritance",
    subtopic: "Method Overriding and super.method()",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you override a parent method in a child class while still calling the parent implementation?",
    shortAnswer: "Define a method with the same name in the child class and use super.methodName(args) to invoke the parent version.",
    detailedExplanation: "- **Method Overriding**: Declaring `method()` in the child class shadows the method on `Parent.prototype`.\n- **super Reference**: `super.method()` looks up the prototype chain starting from `Object.getPrototypeOf(Child.prototype)`.\n- **Extending Behavior**: Allows child classes to prepend, append, or modify parent behavior cleanly.",
    codeExample: "class Employee {\n  getCompensation() {\n    return 50000;\n  }\n}\n\nclass Manager extends Employee {\n  getCompensation() {\n    const base = super.getCompensation(); // Calls parent method\n    return base + 20000; // Adds bonus\n  }\n}\n\nconsole.log(new Manager().getCompensation()); // 70000",
    interviewTips: ["Mention that `super.methodName()` provides clean access to parent logic without calling `Parent.prototype.method.call(this)`."]
  },
  {
    topic: "Inheritance",
    subtopic: "Omitting Constructor in Derived Class",
    difficulty: "INTERMEDIATE",
    questionType: "OUTPUT",
    question: "What happens if a derived class does not define a constructor?",
    shortAnswer: "The engine automatically generates a default constructor that forwards all arguments to the parent: constructor(...args) { super(...args); }.",
    detailedExplanation: "- **Automatic Forwarding**: You do not have to write a constructor if you are not adding new instance properties.\n- **Parent Initialization**: All arguments passed to `new Child(a, b)` are passed directly to `Parent`.\n- **Base Class Default**: In an un-extended base class, the default constructor is empty: `constructor() {}`.",
    codeExample: "class Parent {\n  constructor(a, b) {\n    this.a = a;\n    this.b = b;\n  }\n}\n\n// No explicit constructor defined:\nclass Child extends Parent {}\n\nconst c = new Child(10, 20);\nconsole.log(c.a, c.b); // 10 20 (Automatically forwarded via super(...args)!)",
    interviewTips: ["Explain the default generated constructor in derived classes: `constructor(...args) { super(...args); }`."]
  },
  {
    topic: "Inheritance",
    subtopic: "Inheriting from Built-in Classes (Array, Error, Map)",
    difficulty: "DIFFICULT",
    questionType: "CODE",
    question: "How did ES6 class inheritance solve the problem of subclassing built-in objects like Array or Error?",
    shortAnswer: "ES6 allocates instances from the parent down through super(), correctly binding native internal slots like [[ArrayData]] that ES5 prototype inheritance could not properly initialize.",
    detailedExplanation: "- **ES5 Subclassing Failure**: In ES5, `Array.apply(this)` failed to initialize internal array length mechanics on custom objects.\n- **ES6 Inversion**: In ES6, the parent constructor creates the instance first, properly establishing internal engine memory slots.\n- **Custom Errors**: Allows building rich domain-specific error classes with clean stack traces and status codes.",
    codeExample: "class CustomApiError extends Error {\n  constructor(message, statusCode) {\n    super(message);\n    this.name = 'CustomApiError';\n    this.statusCode = statusCode;\n  }\n}\n\nconst err = new CustomApiError('Resource not found', 404);\nconsole.log(err instanceof Error); // true\nconsole.log(err.statusCode);       // 404\nconsole.log(err.stack);            // Valid stack trace!",
    interviewTips: ["Mention that ES6 subclasses built-in objects properly because `super()` allocates the instance with native engine slots."]
  },
  {
    topic: "Inheritance",
    subtopic: "Static Method Inheritance",
    difficulty: "INTERMEDIATE",
    questionType: "OUTPUT",
    question: "Are static methods inherited by child classes in ES6? How does the prototype chain support this?",
    shortAnswer: "Yes, static methods are inherited. ES6 sets the prototype of the Child constructor function to the Parent constructor function (Object.setPrototypeOf(Child, Parent)).",
    detailedExplanation: "- **Constructor Prototype Chain**: `Child.__proto__ === Parent`.\n- **Lookup Mechanics**: Calling `Child.staticMethod()` looks up the constructor prototype chain to `Parent.staticMethod`.\n- **ES5 Contrast**: In ES5, developers had to manually loop through constructor properties to copy static methods.",
    codeExample: "class Vehicle {\n  static identify() {\n    return 'Vehicle Class';\n  }\n}\n\nclass Truck extends Vehicle {}\n\nconsole.log(Truck.identify()); // 'Vehicle Class' (Inherited!)\nconsole.log(Object.getPrototypeOf(Truck) === Vehicle); // true",
    interviewTips: ["Point out that `Child.__proto__ === Parent`, which is why static methods are inherited."]
  },

  // ==========================================
  // TOPIC 20: Modules
  // ==========================================
  {
    topic: "Modules",
    subtopic: "Named Exports vs Default Exports",
    difficulty: "EASY",
    questionType: "COMPARISON",
    question: "What is the difference between named exports and default exports in ES6 modules?",
    shortAnswer: "A module can have multiple named exports which must be imported using matching names in curly braces { name }, but only ONE default export which can be imported with any arbitrary name without curly braces.",
    detailedExplanation: "- **Named Exports**: `export const a = 1;` -> `import { a } from './mod.js'`. Supports renaming with `as`.\n- **Default Export**: `export default myFunc;` -> `import anyName from './mod.js'`.\n- **Combining Both**: A module can export both a default export and multiple named exports simultaneously.\n- **Static Analysis**: Named exports enable tree-shaking by bundlers.",
    codeExample: "// module.js\nexport const version = '1.0.0';\nexport function helper() {}\nexport default class MainApp {}\n\n// main.js\nimport MainApp, { version, helper } from './module.js';",
    interviewTips: ["Mention that named exports facilitate tree-shaking because bundlers can detect unreferenced named exports."]
  },
  {
    topic: "Modules",
    subtopic: "Import and Export Aliasing with 'as'",
    difficulty: "EASY",
    questionType: "CODE",
    question: "How do you rename imports and exports using the 'as' keyword in ES6?",
    shortAnswer: "Use 'as' to alias names during export (export { func as newName }) or during import (import { origName as aliasName } from './mod.js').",
    detailedExplanation: "- **Conflict Resolution**: Prevents collisions when two different modules export functions with the same name.\n- **Namespace Import**: `import * as Utils from './utils.js'` gathers all exports into a single module object.\n- **Clear Intent**: Allows renaming internal functions to more public-friendly names upon export.",
    codeExample: "// Export aliasing:\nconst calculateTax = () => {};\nexport { calculateTax as taxCalculator };\n\n// Import aliasing:\nimport { taxCalculator as getTax } from './tax.js';\n\n// Namespace import:\nimport * as MathUtils from './math.js';\n// MathUtils.add(), MathUtils.subtract()",
    interviewTips: ["Show both export aliasing (`export { x as y }`) and import aliasing (`import { y as z }`)."]
  },
  {
    topic: "Modules",
    subtopic: "Live Bindings in ES6 Modules",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "What are 'live bindings' in ES6 modules and how do they differ from CommonJS module.exports?",
    shortAnswer: "ES6 imports are live, read-only views into the exported variable: when the exporting module updates the variable, the importing module sees the updated value immediately. CommonJS copies values on export.",
    detailedExplanation: "- **CommonJS Copying**: CommonJS exports a value copy; modifying the variable inside the module later does NOT update the value held by `require()`.\n- **Live References**: ES6 modules export pointers to the live memory binding.\n- **Read-Only in Importer**: The importing file cannot reassign an imported variable (`importVal = 5` throws `TypeError: Assignment to constant variable`).",
    codeExample: "// counter.js\nexport let count = 0;\nexport function increment() { count++; }\n\n// main.js\nimport { count, increment } from './counter.js';\nconsole.log(count); // 0\nincrement();\nconsole.log(count); // 1 (Live binding updated automatically!)\n// count = 10; // TypeError: Assignment to constant variable",
    interviewTips: ["Highlight 'live bindings' as one of the most important architectural differences between ES Modules and CommonJS."]
  },
  {
    topic: "Modules",
    subtopic: "Re-exporting (Aggregating Modules)",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you re-export functions or components from other modules to create an index/barrel file?",
    shortAnswer: "Use export { x } from './module.js' or export * from './module.js' to aggregate and export modules without importing them into local scope.",
    detailedExplanation: "- **Barrel Pattern**: Centralizes imports so consumers can write `import { Button, Modal } from '@/components'`.\n- **Zero Local Scope**: `export { x } from './x.js'` does NOT introduce `x` as a variable in the index file.\n- **Default Re-export**: `export { default as MyComponent } from './MyComponent.js'` re-exports a default export as a named export.",
    codeExample: "// components/index.js (Barrel file)\nexport * from './Button.js';\nexport * from './Modal.js';\nexport { default as Header } from './Header.js';",
    interviewTips: ["Explain the barrel file pattern using `export * from './...'`."]
  },
  {
    topic: "Modules",
    subtopic: "Module Scope and Strict Mode",
    difficulty: "EASY",
    questionType: "CONCEPTUAL",
    question: "Does an ES6 module run in strict mode by default? What is module scope?",
    shortAnswer: "Yes, ES6 modules always execute in strict mode ('use strict') by default, and top-level variables are scoped strictly to the module file rather than being added to the global window object.",
    detailedExplanation: "- **Implicit Strict Mode**: No need to write `'use strict'`; all strict mode rules apply automatically.\n- **File Isolation**: Variables declared with `const`, `let`, or `var` in a module exist only in that module file.\n- **this is undefined**: At the top level of an ES module, `this` is `undefined` instead of `window`.",
    codeExample: "// In an ES6 module:\nvar moduleScoped = 10; // NOT added to window!\nconsole.log(window.moduleScoped); // undefined\nconsole.log(this); // undefined (not window!)",
    interviewTips: ["Mention that at top-level module scope, `this` is `undefined`, not `window`."]
  },
  {
    topic: "Modules",
    subtopic: "Static Import Hoisting & Top-Level Requirement",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "Why cannot static import statements be placed inside an if-statement or function body?",
    shortAnswer: "Static ES6 imports must be at the top level of a file because they are hoisted and statically analyzed by the JavaScript engine before code executes, enabling dead code elimination and tree-shaking.",
    detailedExplanation: "- **Compile-Time Graph**: The engine builds the module dependency graph before running any code.\n- **Dynamic Import Alternative**: For conditional or on-demand loading, use dynamic `import('./module.js')` which returns a Promise.\n- **SyntaxError**: Putting `if (cond) { import ... }` throws an immediate `SyntaxError`.",
    codeExample: "// SYNTAX ERROR:\n// if (needCharts) {\n//   import { Chart } from './chart.js'; // SyntaxError: import declarations may only appear at top level\n// }\n\n// VALID (Dynamic import() for conditional loading):\nif (needCharts) {\n  const { Chart } = await import('./chart.js');\n  new Chart();\n}",
    interviewTips: ["Contrast static `import` (compile-time, top-level only) with dynamic `import()` (runtime, returns Promise)."]
  },
  {
    topic: "Modules",
    subtopic: "Circular Dependencies in ES6 Modules",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "How do ES6 modules handle circular dependencies compared to CommonJS?",
    shortAnswer: "ES6 modules handle circular dependencies via live bindings: the module graph is resolved before execution, so circular imports reference uninitialized bindings that resolve once execution completes, whereas CommonJS can return incomplete partial object copies.",
    detailedExplanation: "- **Module Graph Construction**: Phase 1 parses and links module records; Phase 2 executes code.\n- **TDZ Gotcha in Circular Imports**: If module A imports class B before class B has executed, accessing B during initialization throws a `ReferenceError` due to TDZ.\n- **Best Practice**: Restructure circular dependencies into a shared third dependency to avoid TDZ order traps.",
    codeExample: "// a.js\nimport { b } from './b.js';\nexport const a = 'A';\n\n// b.js\nimport { a } from './a.js';\nexport const b = 'B';",
    interviewTips: ["Mention that while ES Modules support circular dependencies via live bindings, TDZ errors can occur if variables are accessed before declaration."]
  }
];
