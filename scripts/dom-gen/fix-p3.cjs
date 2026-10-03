const fs = require('fs');
const path = require('path');

const p3Path = path.join(__dirname, 'part3.cjs');
const p3 = require(p3Path);

p3[29] = {
  topic: 'Event System & Propagation',
  subtopic: 'Arrow Functions and this in Event Handlers',
  difficulty: 'INTERMEDIATE',
  questionType: 'CONCEPTUAL',
  question: 'Why does this not refer to the clicked element when using an arrow function as an event listener callback?',
  shortAnswer: 'Arrow functions do not bind their own this context; they lexically inherit this from the surrounding outer scope, whereas regular function callbacks bind this to event.currentTarget.',
  detailedExplanation: '- **Lexical Scoping**: Arrow functions capture this from the enclosing execution context at the time of definition (often window or the enclosing class instance).\n- **Regular Functions**: When registered with function(e) {}, the DOM engine automatically binds this to e.currentTarget.\n- **Accessing Target**: If using arrow functions, always access the element explicitly via event.currentTarget or event.target.',
  codeExample: 'const btn = document.querySelector("button");\n\n// Regular function (this === btn):\nbtn.addEventListener("click", function(e) {\n  console.log(this === btn); // true\n});\n\n// Arrow function (this === window):\nbtn.addEventListener("click", (e) => {\n  console.log(this === btn); // false!\n  console.log(e.currentTarget === btn); // true\n});',
  interviewTips: ['Recommend using event.currentTarget inside arrow functions rather than relying on this.']
};

fs.writeFileSync(p3Path, '// scripts/dom-gen/part3.cjs\nmodule.exports = ' + JSON.stringify(p3, null, 2) + ';\n');
console.log('Fixed index 29 in part3.cjs successfully!');
