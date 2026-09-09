const fs = require('fs');
const path = require('path');

// Read machineCodingQuestions.ts
const filePath = path.join(__dirname, '../src/components/machinecoding/machineCodingQuestions.ts');
const fileContent = fs.readFileSync(filePath, 'utf8');

// The file exports MACHINE_CODING_QUESTIONS = [...]
// Let's use ts-node or a small runner, or extract JSON if it's an object array.
// Alternatively we can use Vite/Node with esbuild or tsx.
console.log(`Read ${fileContent.length} bytes from machineCodingQuestions.ts`);
