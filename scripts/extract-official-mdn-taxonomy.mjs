import fs from 'fs';

async function extractMdnTaxonomy() {
  const res = await fetch('https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements');
  const t = await res.text();

  // MDN has sections with <h2 id="..."> or <h3 id="..."> followed by a table of elements
  const categoryRegex = /<h[23]\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h[23]>([\s\S]*?)(?=<h[23]\s+id=|$)/gi;
  const categories = [];

  let match;
  while ((match = categoryRegex.exec(t)) !== null) {
    const id = match[1];
    const rawHeading = match[2].replace(/<[^>]+>/g, '').trim();
    const sectionHtml = match[3];

    // parse elements from this section
    const elemRegex = /<tr[^>]*>\s*<td>\s*<a[^>]*><code>&lt;([a-z0-9]+)&gt;<\/code><\/a>\s*<\/td>\s*<td>([\s\S]*?)<\/td>/gi;
    const elements = [];
    let elemMatch;
    while ((elemMatch = elemRegex.exec(sectionHtml)) !== null) {
      elements.push({
        tag: elemMatch[1],
        description: elemMatch[2].replace(/<[^>]+>/g, '').trim()
      });
    }

    if (elements.length > 0) {
      categories.push({
        id,
        title: rawHeading,
        elements
      });
    }
  }

  console.log(`Extracted ${categories.length} official MDN categories containing ${categories.reduce((acc, c) => acc + c.elements.length, 0)} elements total.`);
  categories.forEach(c => {
    console.log(`\n### ${c.title} (${c.id}) - ${c.elements.length} elements:`);
    console.log(c.elements.map(e => `<${e.tag}>: ${e.description.slice(0, 70)}...`).join('\n'));
  });

  fs.writeFileSync('scripts/mdn_elements_catalog.json', JSON.stringify(categories, null, 2));
}

extractMdnTaxonomy().catch(console.error);
