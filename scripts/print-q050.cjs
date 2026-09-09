const fs = require('fs');
const content = fs.readFileSync('./src/components/machinecoding/machineCodingQuestions.ts', 'utf8');

const match = content.match(/['"]?id['"]?\s*:\s*['"]Q050['"][\s\S]*?(?=\n\s*\{\s*['"]?id['"]?\s*:|\n\];|$)/);
if (match) {
  console.log(match[0].substring(0, 1500));
}
