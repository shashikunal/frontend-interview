const fs = require('fs');

const content = fs.readFileSync('./src/components/machinecoding/machineCodingQuestions.ts', 'utf8');

const ids = ['Q001', 'Q002', 'Q010', 'Q050', 'Q100', 'Q250', 'Q500'];

ids.forEach(id => {
  const re = new RegExp(`['"]?id['"]?\\s*:\\s*['"]${id}['"][\\s\\S]*?(?=\\n\\s*\\{\\s*['"]?id['"]?\\s*:|\\n\\];|$)`);
  const match = content.match(re);
  if (match) {
    const qStr = match[0];
    const title = (qStr.match(/title:\s*['"]([^'"]+)/) || qStr.match(/"title":\s*"([^"]+)/) || [])[1];
    const summary = (qStr.match(/summary:\s*['"`]([^'"`]+)/) || qStr.match(/"summary":\s*"([^"]+)/) || [])[1];
    const desc = (qStr.match(/description:\s*`([^`]+)`/) || qStr.match(/"description":\s*"([^"]+)/) || [])[1];
    const reqs = (qStr.match(/requirements:\s*\[([\s\S]*?)\]/) || qStr.match(/"requirements":\s*\[([\s\S]*?)\]/) || [])[1];
    console.log(`=== ${id} ===`);
    console.log('Title:', title);
    console.log('Summary:', summary ? summary.slice(0, 120) : 'none');
    console.log('Desc:', desc ? desc.slice(0, 150) : 'none');
    console.log('Reqs:', reqs ? reqs.slice(0, 150).replace(/\s+/g, ' ') : 'none');
    console.log('');
  } else {
    console.log('NOT FOUND:', id);
  }
});
