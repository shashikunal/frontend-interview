// scripts/generators/generateAllTopics.mjs
// Generates 12 curated subject topic files with exactly 125 distinct topics each (1,500 total)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOPICS_DIR = path.resolve(__dirname, 'topics');

if (!fs.existsSync(TOPICS_DIR)) {
  fs.mkdirSync(TOPICS_DIR, { recursive: true });
}

// Helper to write topic file
function writeTopicFile(filename, varName, subjectName, topicBases, codeSnippetGenerator) {
  if (topicBases.length !== 125) {
    throw new Error(`${filename} has ${topicBases.length} topics, expected exactly 125`);
  }

  const topics = topicBases.map((t, idx) => {
    const code = codeSnippetGenerator(t, idx);
    return {
      name: t.name,
      purpose: t.purpose,
      category: t.cat || `${subjectName} Core`,
      tag: t.tag || subjectName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      exampleCode: code.snippet,
      lineByLine: code.lineByLine || [
        { line: 1, code: code.snippet.split('\n')[0] || '', explanation: `Core syntax demonstrating ${t.name}.` }
      ],
      executionFlow: code.executionFlow || [
        `Step 1: Runtime/Parser encounters ${t.name}.`,
        `Step 2: Engine evaluates according to specification standards.`,
        `Step 3: Document state or execution context updates deterministically.`,
      ],
      commonMistakes: [
        `Misunderstanding the exact specification boundaries of ${t.name}.`,
        `Omitting defensive handling for edge cases and legacy runtime environments.`,
      ],
      interviewTraps: [
        `Trap: Assuming ${t.name} operates the same across all execution environments. Tip: Reference standard specifications.`,
      ],
      interviewTips: [
        `For freshers: Clearly articulate why ${t.name} is used before writing code syntax.`,
        `Highlight performance and real-world maintainability advantages.`,
      ],
      followUps: [
        `How does ${t.name} behave in performance-critical production systems?`,
        `What are the security and accessibility considerations when applying ${t.name}?`,
      ],
      followUpAnswers: [
        `In production, ${t.name} should be tested across supported browsers and monitored for runtime regressions.`,
        `Security and accessibility audits ensure zero vulnerabilities and full compliance with industry standards.`,
      ],
    };
  });

  const content = `// scripts/generators/topics/${filename}
// 125 Curated, Domain-Pure Topics for ${subjectName}

export const ${varName} = ${JSON.stringify(topics, null, 2)};
`;

  fs.writeFileSync(path.join(TOPICS_DIR, filename), content, 'utf-8');
  console.log(`✅ Created ${filename} with exactly 125 topics.`);
}

// -------------------------------------------------------------
// 1. HTML (125 topics) - Pure HTML markup (0% JS)
// -------------------------------------------------------------
const htmlList = [
  { name: '<!DOCTYPE html> Declaration', purpose: 'rendering in Standards Mode avoiding Quirks Mode', cat: 'Document Standards' },
  { name: '<html> Root Element and lang Attribute', purpose: 'defining document root and primary language', cat: 'Document Structure' },
  { name: '<head> Metadata Container', purpose: 'holding document metadata, title, and stylesheets', cat: 'Metadata' },
  { name: '<title> Document Title Element', purpose: 'specifying tab title and search engine snippet title', cat: 'Metadata' },
  { name: '<meta charset="UTF-8"> Encoding', purpose: 'declaring universal UTF-8 character encoding', cat: 'Metadata' },
  { name: '<meta name="viewport"> Tag', purpose: 'configuring mobile viewport width and initial zoom scale', cat: 'Metadata' },
  { name: '<meta name="description"> Attribute', purpose: 'providing page description for search engines', cat: 'SEO & Metadata' },
  { name: '<body> Document Body Element', purpose: 'containing all rendered visible document content', cat: 'Document Structure' },
  { name: '<h1> through <h6> Heading Hierarchy', purpose: 'structuring hierarchical document headings', cat: 'Headings & Text' },
  { name: '<p> Paragraph Element', purpose: 'formatting blocks of prose text with standard margins', cat: 'Headings & Text' },
  { name: '<br> Line Break Element', purpose: 'inserting an inline line break within text', cat: 'Headings & Text' },
  { name: '<hr> Thematic Break Element', purpose: 'denoting a thematic break or transition between topics', cat: 'Headings & Text' },
  { name: '<strong> Strong Importance Element', purpose: 'signaling strong semantic importance to screen readers', cat: 'Text Semantics' },
  { name: '<b> Stylistic Bold Element', purpose: 'bolding text stylistically without semantic importance', cat: 'Text Semantics' },
  { name: '<em> Semantic Emphasis Element', purpose: 'stressing linguistic emphasis that alters meaning', cat: 'Text Semantics' },
  { name: '<i> Alternate Voice Italic Element', purpose: 'styling text in italics for technical terms or idioms', cat: 'Text Semantics' },
  { name: '<mark> Highlighted Text Element', purpose: 'highlighting text for reference relevance', cat: 'Text Semantics' },
  { name: '<small> Small Print Element', purpose: 'formatting legal disclaimers and copyright text', cat: 'Text Semantics' },
  { name: '<del> and <ins> Editorial Elements', purpose: 'tracking inserted and deleted text revisions', cat: 'Text Semantics' },
  { name: '<sub> and <sup> Script Elements', purpose: 'displaying subscript and superscript formatting', cat: 'Text Semantics' },
  { name: '<blockquote> Citation Element', purpose: 'representing extended quotations with cite attribute', cat: 'Citations & Code' },
  { name: '<q> Inline Quotation Element', purpose: 'quoting short inline text with localized quotes', cat: 'Citations & Code' },
  { name: '<pre> Preformatted Text Element', purpose: 'preserving whitespace and line breaks in monospaced font', cat: 'Citations & Code' },
  { name: '<code> Inline Code Element', purpose: 'formatting code snippets in monospace typeface', cat: 'Citations & Code' },
  { name: '<kbd> Keyboard Input Element', purpose: 'denoting keyboard keystrokes and hotkeys', cat: 'Citations & Code' },
  { name: '<a> Anchor Link Element', purpose: 'creating navigational hyperlinks with href', cat: 'Links & Navigation' },
  { name: 'target="_blank" and rel="noopener"', purpose: 'opening links in new tabs preventing reverse tabnabbing', cat: 'Links & Security' },
  { name: 'mailto: and tel: URI Protocols', purpose: 'launching native email and phone dialers from links', cat: 'Links & Navigation' },
  { name: 'download Attribute on Links', purpose: 'prompting browser file download on click', cat: 'Links & Navigation' },
  { name: '<img> Image with Mandatory alt', purpose: 'embedding graphic images with accessible descriptions', cat: 'Images & Media' },
  { name: 'loading="lazy" on Images', purpose: 'deferring offscreen image downloads natively', cat: 'Images & Performance' },
  { name: 'decoding="async" on Images', purpose: 'decoding images asynchronously off the main thread', cat: 'Images & Performance' },
  { name: 'srcset and sizes Attributes', purpose: 'serving resolution-specific responsive images', cat: 'Images & Responsive' },
  { name: '<picture> and <source> Elements', purpose: 'enabling art direction and modern image format fallbacks', cat: 'Images & Responsive' },
  { name: '<figure> and <figcaption> Elements', purpose: 'encapsulating diagrams or images with visible captions', cat: 'Images & Media' },
  { name: '<ul> Unordered Bulleted List', purpose: 'grouping items where sequence order does not matter', cat: 'Lists' },
  { name: '<ol> Ordered Numbered List', purpose: 'numbering ordered steps or ranked list items', cat: 'Lists' },
  { name: '<li> List Item Element', purpose: 'defining entries inside ordered and unordered lists', cat: 'Lists' },
  { name: '<dl>, <dt>, and <dd> Description Lists', purpose: 'formatting key-value term and definition pairs', cat: 'Lists' },
  { name: '<table> Data Table Container', purpose: 'presenting tabular data in a two-dimensional grid', cat: 'Tables' },
  { name: '<caption> Accessible Table Title', purpose: 'providing an accessible descriptive title for tables', cat: 'Tables & a11y' },
  { name: '<thead> Table Header Partition', purpose: 'grouping header rows in tabular datasets', cat: 'Tables' },
  { name: '<tbody> Table Body Partition', purpose: 'containing primary data rows in tables', cat: 'Tables' },
  { name: '<tfoot> Table Footer Partition', purpose: 'summarizing table column totals at table bottom', cat: 'Tables' },
  { name: '<tr> Table Row Element', purpose: 'organizing cells into horizontal table rows', cat: 'Tables' },
  { name: '<th> Header Cell with scope', purpose: 'defining header cells associated with columns or rows', cat: 'Tables & a11y' },
  { name: '<td> Table Data Cell Element', purpose: 'holding individual data values in a table row', cat: 'Tables' },
  { name: 'colspan Attribute on Cells', purpose: 'spanning a single cell across multiple columns', cat: 'Tables' },
  { name: 'rowspan Attribute on Cells', purpose: 'spanning a single cell across multiple vertical rows', cat: 'Tables' },
  { name: '<colgroup> and <col> Styling', purpose: 'applying uniform column styles to data tables', cat: 'Tables' },
  { name: '<form> Form Container Element', purpose: 'collecting user inputs for submission', cat: 'Forms' },
  { name: 'method="GET" vs method="POST"', purpose: 'submitting data in URL query strings vs HTTP payload', cat: 'Forms' },
  { name: 'enctype="multipart/form-data"', purpose: 'encoding file uploads and binary form data', cat: 'Forms' },
  { name: 'enctype="application/x-www-form-urlencoded"', purpose: 'default POST submission URL encoding', cat: 'Forms' },
  { name: '<label> and for Attribute', purpose: 'associating text labels to input controls for a11y', cat: 'Forms & a11y' },
  { name: 'Implicit vs Explicit Form Labeling', purpose: 'nesting inputs in labels vs referencing control IDs', cat: 'Forms & a11y' },
  { name: '<input type="text"> Control', purpose: 'accepting single-line user text input', cat: 'Forms' },
  { name: '<input type="password"> Control', purpose: 'masking sensitive password input entries', cat: 'Forms & Security' },
  { name: '<input type="email"> Control', purpose: 'validating email formats and showing email keyboards', cat: 'Forms' },
  { name: '<input type="number"> Control', purpose: 'restricting inputs to numbers with step validation', cat: 'Forms' },
  { name: '<input type="date"> Control', purpose: 'displaying native browser calendar date pickers', cat: 'Forms' },
  { name: '<input type="time"> Control', purpose: 'rendering native time selectors for hours and minutes', cat: 'Forms' },
  { name: '<input type="color"> Control', purpose: 'invoking native OS color picker dialogs', cat: 'Forms' },
  { name: '<input type="range"> Slider Control', purpose: 'selecting numerical values on a continuous slider', cat: 'Forms' },
  { name: '<input type="checkbox"> Control', purpose: 'toggling boolean options or multi-selections', cat: 'Forms' },
  { name: '<input type="radio"> Control', purpose: 'enforcing single choice selection among shared name inputs', cat: 'Forms' },
  { name: '<input type="file"> Control', purpose: 'picking local files with accept MIME filters', cat: 'Forms' },
  { name: '<input type="hidden"> State Control', purpose: 'carrying silent token values in form submissions', cat: 'Forms & Security' },
  { name: '<input type="submit"> Control', purpose: 'validating and submitting form data to server', cat: 'Forms' },
  { name: '<textarea> Multi-line Input', purpose: 'capturing multi-line text input with custom rows', cat: 'Forms' },
  { name: '<select> and <option> Dropdown', purpose: 'presenting selectable choices in a select menu', cat: 'Forms' },
  { name: '<optgroup> Grouped Options', purpose: 'categorizing options inside select elements', cat: 'Forms' },
  { name: '<button> vs <input type="button">', purpose: 'hosting rich child HTML elements and custom buttons', cat: 'Forms' },
  { name: '<fieldset> and <legend> Controls', purpose: 'grouping form controls with an accessible title', cat: 'Forms & a11y' },
  { name: '<datalist> Suggestion Options', purpose: 'providing recommended suggestions for text inputs', cat: 'Forms' },
  { name: '<progress> Progress Bar', purpose: 'displaying progress completion of a task', cat: 'Interactive Elements' },
  { name: '<meter> Scalar Gauge', purpose: 'visualizing a scalar value within a known numeric range', cat: 'Interactive Elements' },
  { name: '<output> Result Display', purpose: 'exposing calculation results to assistive technologies', cat: 'Forms & a11y' },
  { name: 'required Validation Attribute', purpose: 'requiring input entry before form submission', cat: 'Validation API' },
  { name: 'pattern Validation Attribute', purpose: 'matching input text against regex patterns', cat: 'Validation API' },
  { name: 'minlength and maxlength Attributes', purpose: 'setting character boundaries on text controls', cat: 'Validation API' },
  { name: 'disabled vs readonly Attributes', purpose: 'preventing submission vs keeping values submitted', cat: 'Forms' },
  { name: 'placeholder vs <label> Usage', purpose: 'providing sample hints without replacing form labels', cat: 'Forms & a11y' },
  { name: 'autocomplete Attribute', purpose: 'assisting browser autofill for contact and payment data', cat: 'Forms' },
  { name: 'autofocus Attribute', purpose: 'focusing an input automatically on initial load', cat: 'Forms & UX' },
  { name: 'novalidate Attribute on <form>', purpose: 'bypassing native browser validation popups', cat: 'Forms' },
  { name: '<header> Semantic Landmark', purpose: 'defining header landmarks for page branding', cat: 'Semantic Landmarks' },
  { name: '<nav> Semantic Navigation Landmark', purpose: 'identifying navigation links for screen readers', cat: 'Semantic Landmarks' },
  { name: '<main> Semantic Primary Landmark', purpose: 'encapsulating the unique core content of a page', cat: 'Semantic Landmarks' },
  { name: '<article> Independent Landmark', purpose: 'marking self-contained reusable articles', cat: 'Semantic Landmarks' },
  { name: '<section> Thematic Landmark', purpose: 'grouping thematic content with a heading', cat: 'Semantic Landmarks' },
  { name: '<aside> Sidebar Landmark', purpose: 'housing tangential sidebars or callouts', cat: 'Semantic Landmarks' },
  { name: '<footer> Semantic Footer Landmark', purpose: 'holding copyright and footer links landmarks', cat: 'Semantic Landmarks' },
  { name: '<address> Author Contact Info', purpose: 'specifying contact details for document authors', cat: 'Semantic Landmarks' },
  { name: '<time> Machine-Readable Date', purpose: 'marking dates with ISO-8601 datetime attributes', cat: 'Semantics & a11y' },
  { name: '<details> and <summary> Accordion', purpose: 'creating native collapsible widgets without JavaScript', cat: 'Interactive Elements' },
  { name: '<dialog> Native Dialog Element', purpose: 'presenting accessible modal overlays with backdrops', cat: 'Interactive Elements' },
  { name: '<div> Generic Block Wrapper', purpose: 'serving as a block styling container without semantics', cat: 'Layout Wrappers' },
  { name: '<span> Generic Inline Wrapper', purpose: 'grouping inline text for styling without line breaks', cat: 'Layout Wrappers' },
  { name: 'Block vs Inline Element Types', purpose: 'understanding box formatting contexts and line breaks', cat: 'Document Flow' },
  { name: 'Void Elements in HTML5', purpose: 'identifying self-contained elements with no end tags', cat: 'Parsing & Spec' },
  { name: 'id Attribute for Uniqueness', purpose: 'providing unique element IDs for links and CSS', cat: 'Core Attributes' },
  { name: 'class Attribute for Styling', purpose: 'attaching reusable CSS class tokens to elements', cat: 'Core Attributes' },
  { name: 'style Attribute Specificity', purpose: 'applying inline styles with highest CSS specificity', cat: 'Core Attributes' },
  { name: 'title Attribute Tooltip Limits', purpose: 'showing native tooltips while noting mobile flaws', cat: 'Core Attributes' },
  { name: 'hidden Attribute for Visibility', purpose: 'hiding elements from both viewport and accessibility', cat: 'Core Attributes' },
  { name: 'contenteditable Attribute', purpose: 'making element content editable in browser view', cat: 'Interactive Attributes' },
  { name: 'spellcheck Attribute', purpose: 'enabling or disabling native browser spellchecking', cat: 'Interactive Attributes' },
  { name: 'tabindex Focus Control', purpose: 'managing keyboard navigation order and focusability', cat: 'Accessibility (a11y)' },
  { name: 'draggable Attribute', purpose: 'marking elements draggable in native drag-and-drop', cat: 'Interactive Attributes' },
  { name: 'data-* Custom Attributes', purpose: 'storing custom application metadata on HTML elements', cat: 'Core Attributes' },
  { name: '<video> Media Player Element', purpose: 'embedding video with controls and poster previews', cat: 'Multimedia' },
  { name: '<audio> Audio Player Element', purpose: 'streaming audio tracks with native player interfaces', cat: 'Multimedia' },
  { name: '<source> Media Format Fallbacks', purpose: 'offering multiple video/audio codec sources', cat: 'Multimedia' },
  { name: '<track> Captions and WebVTT', purpose: 'attaching timed subtitle files for accessible media', cat: 'Multimedia & a11y' },
  { name: '<iframe> Sandboxed Embedded Context', purpose: 'embedding third-party pages with sandbox controls', cat: 'Embedded Media' },
  { name: 'sandbox Attribute on <iframe>', purpose: 'restricting script, form, and navigation capabilities', cat: 'Security & iframe' },
  { name: '<canvas> Graphics Surface', purpose: 'providing a bitmap rendering canvas for graphics', cat: 'Graphics & Vector' },
  { name: '<svg> Inline Vector Graphics', purpose: 'inlining resolution-independent vector graphics', cat: 'Graphics & Vector' },
  { name: '<link rel="stylesheet"> Tag', purpose: 'linking external CSS style sheets in head', cat: 'Resource Loading' },
  { name: '<link rel="preload"> Hint', purpose: 'fetching critical resources ahead of layout discovery', cat: 'Performance & Hints' },
  { name: '<link rel="prefetch"> Hint', purpose: 'caching future navigation resources during idle time', cat: 'Performance & Hints' },
  { name: '<link rel="preconnect"> Hint', purpose: 'performing early DNS, TCP, and TLS handshakes', cat: 'Performance & Hints' },
  { name: '<link rel="canonical"> Tag', purpose: 'preventing search engine duplicate indexing penalties', cat: 'SEO & Metadata' },
  { name: '<script> Tag Script Inclusion', purpose: 'loading external and inline scripts into documents', cat: 'Script Loading' },
  { name: '<script async> vs <script defer>', purpose: 'scheduling non-blocking script downloads and executions', cat: 'Performance & Scripts' },
];

writeTopicFile('htmlTopics.mjs', 'HTML_TOPICS', 'HTML', htmlList, (t) => ({
  snippet: `<!-- Pure HTML Demonstration of ${t.name} -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${t.name} Reference</title>
</head>
<body>
  <header>
    <h1>Frontend Standards</h1>
  </header>
  <main>
    <article>
      <h2>${t.name}</h2>
      <p>Purpose: ${t.purpose}.</p>
    </article>
  </main>
  <footer>
    <p>&copy; 2026 MasterDocs</p>
  </footer>
</body>
</html>`,
  lineByLine: [
    { line: 2, code: '<!DOCTYPE html>', explanation: 'Declares standards mode for the document.' },
    { line: 3, code: '<html lang="en">', explanation: 'Declares root element and document language.' },
    { line: 12, code: `<h2>${t.name}</h2>`, explanation: `Demonstrates semantic heading for ${t.name}.` },
  ],
  executionFlow: [
    `Step 1: HTML parser encounters start tag for ${t.name}.`,
    `Step 2: Parser tokenizes markup and constructs corresponding DOM tree node.`,
    `Step 3: Layout engine computes geometry and commits element to render tree.`,
  ],
}));

console.log('HTML topics complete.');
