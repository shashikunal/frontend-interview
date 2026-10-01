# Question Bank Audit Report

Generated: 2026-10-01T17:50:32.359Z

## Summary

- Master bank: 35 subject files, 2545 questions (catalog claims 2545)
- Main bank: 12 data files, 22222 questions, 0 id collisions
- Findings: 0 error(s), 115 warning(s)

## Master Question Bank (public/data/interview-questions)

```
Subject                Actual  Catalog claim  Categories
---------------------  ------  -------------  ----------
accessibility          30      30             5
bom                    125     125            1
browser-internals      30      30             5
build-tools            30      30             5
coding-problems        30      30             5
company-questions      30      30             5
css                    125     125            1
design-patterns        30      30             5
dom                    125     125            1
es6                    125     125            1
es7                    110     110            1
es8                    110     110            1
frontend-architecture  30      30             5
git                    30      30             5
html                   40      40             16
http                   30      30             5
javascript             125     125            1
jquery                 500     500            14
machine-coding         30      30             5
micro-frontends        30      30             5
nextjs                 30      30             5
performance            30      30             5
react                  125     125            1
react-router           30      30             5
redux                  125     125            1
rest-apis              30      30             5
scenarios              30      30             5
security               30      30             5
seo                    30      30             5
system-design          30      30             5
tanstack-query         30      30             5
testing                30      30             5
typescript             125     125            1
web-apis               125     125            2
websockets             30      30             5
```

Difficulty breakdown:

```
EASY             875
INTERMEDIATE     847
DIFFICULT        823
```

## Main Question Bank (public/data, loaded via DATA_FILES)

```
File                      Questions  ID collisions
------------------------  ---------  -------------
leetcode-style            6000       0
frontendmasters-style     4000       0
greatfrontend-javascript  193        0
greatfrontend-react       50         0
greatfrontend-typescript  1500       0
greatfrontend-dom         1500       0
algomonster               2000       0
educative                 3000       0
frontendlead              3000       0
topbrains                 257        0
js-assignments            50         0
system-design             672        0
```

Difficulty breakdown:

```
Medium           9903
Hard             6520
Easy             5799
```

Category breakdown:

```
Algorithms                   5521
Data Structures              2483
DOM & Web APIs               2380
TypeScript                   1955
JavaScript                   1875
Web Security                 1416
ReactJS                      1400
System Design                1352
CSS                          1152
Frontend Performance         832
Accessibility                688
Programming                  253
JavaScript & ES6             243
System Design - Components   192
System Design - Real-Time    168
System Design - Media & Video 72
System Design - Performance & Web Vitals 72
System Design - State & Data Layer 72
System Design - Micro-Frontends & Modularity 48
System Design - Security & Authentication 48
```

## Findings

- **WARN** (master): duplicate question title within bom.json: "What is the difference between the window object and the document obje"
- **WARN** (master): duplicate question title within bom.json: "What is the difference between the window object and the document obje"
- **WARN** (master): duplicate question title within dom.json: "What is the DOM tree hierarchy and what is the difference between a No"
- **WARN** (master): duplicate question title within dom.json: "What is the DOM tree hierarchy and what is the difference between a No"
- **WARN** (master): duplicate question title within es6.json: "What is the difference between let, const, and var in ES6?"
- **WARN** (master): duplicate question title within es6.json: "What is the difference between let, const, and var in ES6?"
- **WARN** (master): duplicate question title within es6.json: "What is the difference between let, const, and var in ES6?"
- **WARN** (master): duplicate question title within es6.json: "What is the difference between let, const, and var in ES6?"
- **WARN** (master): duplicate question title within es6.json: "What is the difference between let, const, and var in ES6?"
- **WARN** (master): duplicate question title within es6.json: "What is the difference between let, const, and var in ES6?"
- **WARN** (master): duplicate question title within javascript.json: "What is an Execution Context in JavaScript and how do the Creation and"
- **WARN** (master): duplicate question title within javascript.json: "What is a Lexical Environment in JavaScript and how does it differ fro"
- **WARN** (master): duplicate question title within javascript.json: "How does the Scope Chain work in JavaScript and how are variable looku"
- **WARN** (master): duplicate question title within javascript.json: "What are Closures in JavaScript and how do they capture lexical scope?"
- **WARN** (master): duplicate question title within javascript.json: "How does Garbage Collection work in JavaScript and what is the Mark-an"
- **WARN** (master): duplicate question title within javascript.json: "What is the difference between the Scavenger and Mark-Sweep phases in "
- **WARN** (master): duplicate question title within javascript.json: "What are the common causes of memory leaks in JavaScript and how do yo"
- **WARN** (master): duplicate question title within javascript.json: "What is Hoisting in JavaScript and how does it work for var, let, cons"
- **WARN** (master): duplicate question title within javascript.json: "What is the Temporal Dead Zone (TDZ) in JavaScript?"
- **WARN** (master): duplicate question title within javascript.json: "How is the "this" keyword determined in JavaScript and what are the 4 "
- **WARN** (master): duplicate question title within javascript.json: "What is the difference between call(), apply(), and bind() in JavaScri"
- **WARN** (master): duplicate question title within javascript.json: "What is Prototypal Inheritance and how does the prototype chain work i"
- **WARN** (master): duplicate question title within javascript.json: "What is Object.create() and how does it achieve prototype delegation i"
- **WARN** (master): duplicate question title within javascript.json: "What is the Event Loop in JavaScript and how do the Call Stack, Microt"
- **WARN** (master): duplicate question title within javascript.json: "What is the difference between microtasks and macrotasks in JavaScript"
- **WARN** (master): duplicate question title within javascript.json: "What is the difference between Callbacks, Promises, and Async/Await in"
- **WARN** (master): duplicate question title within javascript.json: "How does the V8 engine execute JavaScript using the Ignition interpret"
- **WARN** (master): duplicate question title within javascript.json: "What are the three phases of Event Propagation in the browser DOM?"
- **WARN** (master): duplicate question title within javascript.json: "What is Event Delegation and why is it recommended for dynamic web app"
- **WARN** (master): duplicate question title within javascript.json: "What is the difference between Debouncing and Throttling in JavaScript"
- **WARN** (master): duplicate question title within javascript.json: "What is the difference between primitive types and reference types in "
- **WARN** (master): duplicate question title within javascript.json: "What is the difference between == and === operators in JavaScript?"
- **WARN** (master): duplicate question title within javascript.json: "What are Object property descriptors (writable, enumerable, configurab"
- **WARN** (master): duplicate question title within javascript.json: "What is Strict Mode ("use strict") in JavaScript and what benefits doe"
- **WARN** (master): duplicate question title within javascript.json: "What is an Execution Context in JavaScript and how do the Creation and"
- **WARN** (master): duplicate question title within javascript.json: "What is a Lexical Environment in JavaScript and how does it differ fro"
- **WARN** (master): duplicate question title within javascript.json: "How does the Scope Chain work in JavaScript and how are variable looku"
- **WARN** (master): duplicate question title within javascript.json: "What are Closures in JavaScript and how do they capture lexical scope?"
- **WARN** (master): duplicate question title within javascript.json: "How does Garbage Collection work in JavaScript and what is the Mark-an"
- **WARN** (master): duplicate question title within javascript.json: "What is the difference between the Scavenger and Mark-Sweep phases in "
- **WARN** (master): duplicate question title within javascript.json: "What are the common causes of memory leaks in JavaScript and how do yo"
- **WARN** (master): duplicate question title within javascript.json: "What is Hoisting in JavaScript and how does it work for var, let, cons"
- **WARN** (master): duplicate question title within javascript.json: "What is the Temporal Dead Zone (TDZ) in JavaScript?"
- **WARN** (master): duplicate question title within javascript.json: "How is the "this" keyword determined in JavaScript and what are the 4 "
- **WARN** (master): duplicate question title within javascript.json: "What is the difference between call(), apply(), and bind() in JavaScri"
- **WARN** (master): duplicate question title within javascript.json: "What is Prototypal Inheritance and how does the prototype chain work i"
- **WARN** (master): duplicate question title within javascript.json: "What is Object.create() and how does it achieve prototype delegation i"
- **WARN** (master): duplicate question title within javascript.json: "What is the Event Loop in JavaScript and how do the Call Stack, Microt"
- **WARN** (master): duplicate question title within javascript.json: "What is the difference between microtasks and macrotasks in JavaScript"
- **WARN** (master): duplicate question title within javascript.json: "What is the difference between Callbacks, Promises, and Async/Await in"
- **WARN** (master): duplicate question title within javascript.json: "How does the V8 engine execute JavaScript using the Ignition interpret"
- **WARN** (master): duplicate question title within javascript.json: "What are the three phases of Event Propagation in the browser DOM?"
- **WARN** (master): duplicate question title within javascript.json: "What is Event Delegation and why is it recommended for dynamic web app"
- **WARN** (master): duplicate question title within javascript.json: "What is the difference between Debouncing and Throttling in JavaScript"
- **WARN** (master): duplicate question title within javascript.json: "What is the difference between primitive types and reference types in "
- **WARN** (master): duplicate question title within javascript.json: "What is the difference between == and === operators in JavaScript?"
- **WARN** (master): duplicate question title within javascript.json: "What are Object property descriptors (writable, enumerable, configurab"
- **WARN** (master): duplicate question title within javascript.json: "What is Strict Mode ("use strict") in JavaScript and what benefits doe"
- **WARN** (master): duplicate question title within javascript.json: "What is an Execution Context in JavaScript and how do the Creation and"
- **WARN** (master): duplicate question title within javascript.json: "What is a Lexical Environment in JavaScript and how does it differ fro"
- **WARN** (master): duplicate question title within javascript.json: "How does the Scope Chain work in JavaScript and how are variable looku"
- **WARN** (master): duplicate question title within javascript.json: "What are Closures in JavaScript and how do they capture lexical scope?"
- **WARN** (master): duplicate question title within javascript.json: "How does Garbage Collection work in JavaScript and what is the Mark-an"
- **WARN** (master): duplicate question title within javascript.json: "What is the difference between the Scavenger and Mark-Sweep phases in "
- **WARN** (master): duplicate question title within javascript.json: "What are the common causes of memory leaks in JavaScript and how do yo"
- **WARN** (master): duplicate question title within javascript.json: "What is Hoisting in JavaScript and how does it work for var, let, cons"
- **WARN** (master): duplicate question title within javascript.json: "What is the Temporal Dead Zone (TDZ) in JavaScript?"
- **WARN** (master): duplicate question title within javascript.json: "How is the "this" keyword determined in JavaScript and what are the 4 "
- **WARN** (master): duplicate question title within javascript.json: "What is the difference between call(), apply(), and bind() in JavaScri"
- **WARN** (master): duplicate question title within javascript.json: "What is Prototypal Inheritance and how does the prototype chain work i"
- **WARN** (master): duplicate question title within javascript.json: "What is Object.create() and how does it achieve prototype delegation i"
- **WARN** (master): duplicate question title within javascript.json: "What is the Event Loop in JavaScript and how do the Call Stack, Microt"
- **WARN** (master): duplicate question title within javascript.json: "What is the difference between microtasks and macrotasks in JavaScript"
- **WARN** (master): duplicate question title within javascript.json: "What is the difference between Callbacks, Promises, and Async/Await in"
- **WARN** (master): duplicate question title within javascript.json: "How does the V8 engine execute JavaScript using the Ignition interpret"
- **WARN** (master): duplicate question title within javascript.json: "What are the three phases of Event Propagation in the browser DOM?"
- **WARN** (master): duplicate question title within javascript.json: "What is Event Delegation and why is it recommended for dynamic web app"
- **WARN** (master): duplicate question title within javascript.json: "What is the difference between Debouncing and Throttling in JavaScript"
- **WARN** (master): duplicate question title within javascript.json: "What is the difference between primitive types and reference types in "
- **WARN** (master): duplicate question title within javascript.json: "What is the difference between == and === operators in JavaScript?"
- **WARN** (master): duplicate question title within javascript.json: "What are Object property descriptors (writable, enumerable, configurab"
- **WARN** (master): duplicate question title within javascript.json: "What is Strict Mode ("use strict") in JavaScript and what benefits doe"
- **WARN** (master): duplicate question title within javascript.json: "What is an Execution Context in JavaScript and how do the Creation and"
- **WARN** (master): duplicate question title within javascript.json: "What is a Lexical Environment in JavaScript and how does it differ fro"
- **WARN** (master): duplicate question title within javascript.json: "How does the Scope Chain work in JavaScript and how are variable looku"
- **WARN** (master): duplicate question title within javascript.json: "What are Closures in JavaScript and how do they capture lexical scope?"
- **WARN** (master): duplicate question title within javascript.json: "How does Garbage Collection work in JavaScript and what is the Mark-an"
- **WARN** (master): duplicate question title within javascript.json: "What is the difference between the Scavenger and Mark-Sweep phases in "
- **WARN** (master): duplicate question title within javascript.json: "What are the common causes of memory leaks in JavaScript and how do yo"
- **WARN** (master): duplicate question title within javascript.json: "What is Hoisting in JavaScript and how does it work for var, let, cons"
- **WARN** (master): duplicate question title within javascript.json: "What is the Temporal Dead Zone (TDZ) in JavaScript?"
- **WARN** (master): duplicate question title within javascript.json: "How is the "this" keyword determined in JavaScript and what are the 4 "
- **WARN** (master): duplicate question title within javascript.json: "What is the difference between call(), apply(), and bind() in JavaScri"
- **WARN** (master): duplicate question title within javascript.json: "What is Prototypal Inheritance and how does the prototype chain work i"
- **WARN** (master): duplicate question title within react.json: "What is JSX and how does React transform it into elements?"
- **WARN** (master): duplicate question title within react.json: "What is the difference between the Render Phase and Commit Phase in Re"
- **WARN** (master): duplicate question title within react.json: "What is JSX and how does React transform it into elements?"
- **WARN** (master): duplicate question title within react.json: "What is the difference between the Render Phase and Commit Phase in Re"
- **WARN** (master): duplicate question title within react.json: "What is JSX and how does React transform it into elements?"
- **WARN** (master): duplicate question title within react.json: "What is the difference between the Render Phase and Commit Phase in Re"
- **WARN** (master): duplicate question title within react.json: "What is JSX and how does React transform it into elements?"
- **WARN** (master): duplicate question title within react.json: "What is the difference between the Render Phase and Commit Phase in Re"
- **WARN** (master): duplicate question title within redux.json: "What are the three core principles of Redux?"
- **WARN** (master): duplicate question title within redux.json: "What are the three core principles of Redux?"
- **WARN** (master): duplicate question title within redux.json: "What are the three core principles of Redux?"
- **WARN** (master): duplicate question title within redux.json: "What are the three core principles of Redux?"
- **WARN** (master): duplicate question title within redux.json: "What are the three core principles of Redux?"
- **WARN** (master): duplicate question title within redux.json: "What are the three core principles of Redux?"
- **WARN** (master): duplicate question title within typescript.json: "What is the difference between Type Inference, Type Annotation, and Ty"
- **WARN** (master): duplicate question title within typescript.json: "What is the difference between Type Inference, Type Annotation, and Ty"
- **WARN** (master): duplicate question title within typescript.json: "What is the difference between Type Inference, Type Annotation, and Ty"
- **WARN** (master): duplicate question title within typescript.json: "What is the difference between Type Inference, Type Annotation, and Ty"
- **WARN** (master): duplicate question title within typescript.json: "What is the difference between Type Inference, Type Annotation, and Ty"
- **WARN** (master): duplicate question title within typescript.json: "What is the difference between Type Inference, Type Annotation, and Ty"
- **WARN** (master): duplicate question title within web-apis.json: "What is the Fetch API and how does it differ from XMLHttpRequest?"
