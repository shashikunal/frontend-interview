const fs = require('fs');
const content = fs.readFileSync('./src/components/machinecoding/machineCodingQuestions.ts', 'utf8');

const match = content.match(/['"]?id['"]?\s*:\s*['"]Q050['"][\s\S]*?(?=\n\s*\{\s*['"]?id['"]?\s*:|\n\];|$)/);
if (match) {
  const starterMatch = match[0].match(/"starterCode":\s*"([\s\S]*?)",\s*"solutionCode"/);
  console.log(starterMatch ? JSON.parse(`"${starterMatch[1]}"`) : 'not found');
}
