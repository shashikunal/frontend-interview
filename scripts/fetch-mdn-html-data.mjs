import fs from 'fs';

async function fetchMdnHtml() {
  console.log('Fetching official MDN HTML elements reference...');
  const res = await fetch('https://developer.mozilla.org/en-US/docs/Web/HTML/Element');
  const text = await res.text();

  // Extract all section headers and element lists
  const sections = [];
  const sectionRegex = /<h2 id="([^"]+)">([^<]+)<\/h2>([\s\S]*?)(?=<h2|$)/g;
  let match;

  while ((match = sectionRegex.exec(text)) !== null) {
    const id = match[1];
    const title = match[2].trim();
    const body = match[3];

    const elementMatches = [...body.matchAll(/<code>&lt;([a-z0-9]+)&gt;<\/code>\s*<\/a>\s*<\/td>\s*<td>([\s\S]*?)<\/td>/g)];
    const elements = elementMatches.map(m => ({
      tag: m[1],
      description: m[2].replace(/<[^>]+>/g, '').trim()
    }));

    if (elements.length > 0) {
      sections.push({ id, title, elements });
    }
  }

  console.log(`Extracted ${sections.length} major official HTML categories from MDN:`);
  sections.forEach(s => {
    console.log(`- ${s.title} (${s.elements.length} elements): ${s.elements.map(e => '<' + e.tag + '>').slice(0, 8).join(', ')}`);
  });

  fs.writeFileSync('scripts/mdn_html_elements.json', JSON.stringify(sections, null, 2));
  console.log('Saved to scripts/mdn_html_elements.json');
}

fetchMdnHtml().catch(console.error);
