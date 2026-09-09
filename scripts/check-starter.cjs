const fs = require('fs');
const content = fs.readFileSync('./src/components/machinecoding/machineCodingQuestions.ts', 'utf8');

['Q050', 'Q100', 'Q250', 'Q500'].forEach(id => {
  const match = content.match(new RegExp(`['"]?id['"]?\\s*:\\s*['"]${id}['"][\\s\\S]*?(?=\\n\\s*\\{\\s*['"]?id['"]?\\s*:|\\n\\];|$)`));
  if (match) {
    const starterMatch = match[0].match(/"starterCode":\s*"([\s\S]*?)",\s*"solutionCode"/);
    console.log(`=== ${id} STARTER CODE ===`);
    console.log(starterMatch ? starterMatch[1].slice(0, 300) : 'not found');
  }
});
