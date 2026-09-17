// scripts/generators/buildSubjectTopicFiles.mjs
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

// 1. HTML Topics (125 distinct pure HTML topics)
const htmlTopicBases = [
  { name: '<!DOCTYPE html> Declaration', purpose: 'instructing browser engines to render in Standards Mode avoiding Quirks Mode', cat: 'Document Standards' },
  { name: '<html> Root Element and lang Attribute', purpose: 'defining root element and declaring primary spoken language for screen readers', cat: 'Document Structure' },
  { name: '<head> Metadata Container', purpose: 'encapsulating document metadata, title, character encoding, and external resource links', cat: 'Metadata & Links' },
  { name: '<title> Document Title Element', purpose: 'specifying document title for browser window tabs, bookmarks, and search engine results', cat: 'Metadata & Links' },
  { name: '<meta charset="UTF-8"> Encoding', purpose: 'declaring universal UTF-8 character encoding to correctly display international characters', cat: 'Metadata & Links' },
  { name: '<meta name="viewport"> Tag', purpose: 'configuring mobile viewport scale and width for responsive web layouts', cat: 'Metadata & Links' },
  { name: '<meta name="description"> Attribute', purpose: 'providing concise page summary for search engine snippet indexing', cat: 'SEO & Metadata' },
  { name: '<body> Document Body Element', purpose: 'containing all visible rendered content displayed in the browser viewport', cat: 'Document Structure' },
  { name: '<h1> through <h6> Heading Levels', purpose: 'establishing hierarchical outline structure for document headings', cat: 'Headings & Text' },
  { name: '<p> Paragraph Element', purpose: 'formatting blocks of prose text with standard user-agent vertical margins', cat: 'Headings & Text' },
  { name: '<br> Line Break Element', purpose: 'inserting a manual line break within text without creating a new paragraph', cat: 'Headings & Text' },
  { name: '<hr> Thematic Break Element', purpose: 'representing a thematic change or transition between paragraph-level sections', cat: 'Headings & Text' },
  { name: '<strong> Strong Importance Element', purpose: 'conveying strong semantic importance, seriousness, or urgency to screen readers', cat: 'Text Semantics' },
  { name: '<b> Stylistic Bold Element', purpose: 'drawing visual attention to text without imparting extra semantic importance', cat: 'Text Semantics' },
  { name: '<em> Semantic Emphasis Element', purpose: 'stressing emphasis that alters the linguistic meaning of a sentence', cat: 'Text Semantics' },
  { name: '<i> Alternate Voice / Italic Element', purpose: 'representing text in an alternate voice, technical term, or idiom', cat: 'Text Semantics' },
  { name: '<mark> Highlighted Text Element', purpose: 'highlighting text of reference relevance such as search result matches', cat: 'Text Semantics' },
  { name: '<small> Small Print Element', purpose: 'representing legal disclaimers, copyright notices, and secondary side comments', cat: 'Text Semantics' },
  { name: '<del> and <ins> Editorial Elements', purpose: 'marking text deleted from or inserted into a document for editorial tracking', cat: 'Text Semantics' },
  { name: '<sub> and <sup> Script Elements', purpose: 'displaying typographic subscript and superscript for chemical formulas and footnotes', cat: 'Text Semantics' },
  { name: '<blockquote> Citation Element', purpose: 'representing section quoted from another source with optional cite attribute', cat: 'Citations & Code' },
  { name: '<q> Inline Quotation Element', purpose: 'demarcating short inline quotations with automatic language-specific quote marks', cat: 'Citations & Code' },
  { name: '<pre> Preformatted Text Element', purpose: 'preserving whitespace, tabs, and line breaks in monospaced format', cat: 'Citations & Code' },
  { name: '<code> Inline Code Snippet Element', purpose: 'marking fragments of computer code in a monospaced typeface', cat: 'Citations & Code' },
  { name: '<kbd> Keyboard Input Element', purpose: 'denoting user keyboard input, shortcuts, and key combinations', cat: 'Citations & Code' },
  { name: '<a> Anchor Hyperlink Element', purpose: 'creating navigational hyperlinks connecting web resources via href attribute', cat: 'Links & Navigation' },
  { name: 'target="_blank" and rel="noopener"', purpose: 'opening links in a new tab securely preventing reverse tabnabbing attacks', cat: 'Links & Security' },
  { name: 'mailto: and tel: URI Protocols', purpose: 'triggering native email clients and phone dialers directly from hyperlinks', cat: 'Links & Navigation' },
  { name: 'download Attribute on Links', purpose: 'instructing browser to download linked resource rather than navigating to it', cat: 'Links & Navigation' },
  { name: '<img> Image and Mandatory alt Attribute', purpose: 'embedding graphic assets with accessible alternative text descriptions', cat: 'Images & Media' },
  { name: 'loading="lazy" on Images', purpose: 'deferring off-screen image loading until near the user viewport', cat: 'Images & Performance' },
  { name: 'decoding="async" on Images', purpose: 'decoding compressed image bytes off the main UI rendering thread', cat: 'Images & Performance' },
  { name: 'srcset and sizes Attributes', purpose: 'serving resolution-tailored responsive images to varied device viewports', cat: 'Images & Responsive' },
  { name: '<picture> and <source> Elements', purpose: 'enabling art direction and modern image format fallbacks (AVIF/WebP)', cat: 'Images & Responsive' },
  { name: '<figure> and <figcaption> Elements', purpose: 'encapsulating self-contained diagrams, photos, or code with an accessible caption', cat: 'Images & Media' },
  { name: '<ul> Unordered Bulleted List', purpose: 'grouping items whose numerical ordering carries no intrinsic sequence', cat: 'Lists' },
  { name: '<ol> Ordered Numbered List', purpose: 'organizing sequential steps or ranked list items with automatic numbering', cat: 'Lists' },
  { name: '<li> List Item Element', purpose: 'defining individual entries inside ordered or unordered parent lists', cat: 'Lists' },
  { name: '<dl>, <dt>, and <dd> Description Lists', purpose: 'structuring terms and definitions for glossaries, metadata, and key-value pairs', cat: 'Lists' },
  { name: '<table> Data Table Container', purpose: 'displaying tabular data in a structured multi-dimensional grid format', cat: 'Tables' },
  { name: '<caption> Accessible Table Title', purpose: 'providing an accessible summary title for data tables read by screen readers', cat: 'Tables & a11y' },
  { name: '<thead> Table Header Partition', purpose: 'grouping header rows that repeat at the top of printed or paged tables', cat: 'Tables' },
  { name: '<tbody> Table Body Partition', purpose: 'encapsulating the primary data rows of a tabular dataset', cat: 'Tables' },
  { name: '<tfoot> Table Footer Partition', purpose: 'summarizing table column totals or calculations at the base of the table', cat: 'Tables' },
  { name: '<tr> Table Row Element', purpose: 'defining horizontal rows of cells within a table partition', cat: 'Tables' },
  { name: '<th> Header Cell with scope Attribute', purpose: 'identifying row or column headers and associating them with data cells', cat: 'Tables & a11y' },
  { name: '<td> Table Data Cell Element', purpose: 'holding individual data values within a tabular row', cat: 'Tables' },
  { name: 'colspan Attribute on Cells', purpose: 'spanning a single table cell across multiple horizontal columns', cat: 'Tables' },
  { name: 'rowspan Attribute on Cells', purpose: 'spanning a single table cell vertically across multiple rows', cat: 'Tables' },
  { name: '<colgroup> and <col> Styling', purpose: 'applying consistent styles and column widths across entire table columns', cat: 'Tables' },
  { name: '<form> Form Container Element', purpose: 'grouping interactive form controls for server submission and user input collection', cat: 'Forms' },
  { name: 'method="GET" vs method="POST"', purpose: 'choosing between URL query parameter encoding and HTTP request body submission', cat: 'Forms' },
  { name: 'enctype="multipart/form-data"', purpose: 'encoding binary file uploads and complex payload structures in HTTP forms', cat: 'Forms' },
  { name: 'enctype="application/x-www-form-urlencoded"', purpose: 'standard key-value pair form encoding format for default POST submissions', cat: 'Forms' },
  { name: '<label> and for Attribute', purpose: 'binding accessible text labels to input controls and expanding clickable hit areas', cat: 'Forms & a11y' },
  { name: 'Implicit vs Explicit Form Labeling', purpose: 'comparing nesting inputs inside labels vs using for and id attributes', cat: 'Forms & a11y' },
  { name: '<input type="text"> Control', purpose: 'capturing single-line text input from users with autocomplete support', cat: 'Forms' },
  { name: '<input type="password"> Control', purpose: 'masking credential inputs and integrating with browser password managers', cat: 'Forms & Security' },
  { name: '<input type="email"> Control', purpose: 'triggering mobile email keyboards and built-in RFC email format validation', cat: 'Forms' },
  { name: '<input type="number"> Control', purpose: 'restricting input to numeric digits with min, max, and step validation', cat: 'Forms' },
  { name: '<input type="date"> Control', purpose: 'providing native calendar pickers without external JavaScript libraries', cat: 'Forms' },
  { name: '<input type="time"> Control', purpose: 'invoking native browser time pickers for hour and minute capture', cat: 'Forms' },
  { name: '<input type="color"> Control', purpose: 'rendering an OS-native color selection dialog returning hexadecimal values', cat: 'Forms' },
  { name: '<input type="range"> Slider Control', purpose: 'providing a numeric slider for selecting imprecise values between min and max', cat: 'Forms' },
  { name: '<input type="checkbox"> Control', purpose: 'capturing boolean toggle states and multi-select choices within a group', cat: 'Forms' },
  { name: '<input type="radio"> Control', purpose: 'enforcing single mutually exclusive option selection across shared name inputs', cat: 'Forms' },
  { name: '<input type="file"> Control', purpose: 'selecting local user files with accept mime filters and multiple upload support', cat: 'Forms' },
  { name: '<input type="hidden"> State Control', purpose: 'holding non-visible state values, CSRF tokens, and entity IDs in form payloads', cat: 'Forms & Security' },
  { name: '<input type="submit"> Control', purpose: 'triggering form validation and initiating HTTP submission', cat: 'Forms' },
  { name: '<textarea> Multi-line Input', purpose: 'capturing long-form multi-line text input with configurable rows and columns', cat: 'Forms' },
  { name: '<select> and <option> Dropdown', purpose: 'offering selectable choices in a compact dropdown selection menu', cat: 'Forms' },
  { name: '<optgroup> Grouped Dropdown Options', purpose: 'hierarchically categorizing options inside select elements', cat: 'Forms' },
  { name: '<button> vs <input type="button">', purpose: 'supporting HTML child elements, icons, and distinct button types (submit, reset, button)', cat: 'Forms' },
  { name: '<fieldset> and <legend> Controls', purpose: 'grouping related form controls together with an accessible group description', cat: 'Forms & a11y' },
  { name: '<datalist> Autocomplete Suggestions', purpose: 'supplying predefined suggestion options for input elements while allowing custom text', cat: 'Forms' },
  { name: '<progress> Bar Element', purpose: 'visualizing completion progress of an ongoing task or calculation', cat: 'Interactive & Metrics' },
  { name: '<meter> Scalar Measurement Gauge', purpose: 'displaying a scalar measurement within a known range (disk usage, score)', cat: 'Interactive & Metrics' },
  { name: '<output> Calculation Result Display', purpose: 'exposing calculation results or user action outputs to assistive technologies', cat: 'Forms & a11y' },
  { name: 'required Validation Attribute', purpose: 'blocking form submission when mandatory fields remain empty', cat: 'Validation API' },
  { name: 'pattern Validation Attribute', purpose: 'evaluating input values against client-side regular expressions natively', cat: 'Validation API' },
  { name: 'minlength and maxlength Attributes', purpose: 'restricting allowable character count bounds on text inputs and textareas', cat: 'Validation API' },
  { name: 'disabled vs readonly Attributes', purpose: 'excluding controls from form submission vs keeping them submitted but uneditable', cat: 'Forms' },
  { name: 'placeholder vs <label> Usage', purpose: 'providing ephemeral formatting hints while avoiding label replacement anti-patterns', cat: 'Forms & a11y' },
  { name: 'autocomplete Attribute', purpose: 'guiding browser autofill heuristics for names, addresses, and payment credentials', cat: 'Forms' },
  { name: 'autofocus Attribute', purpose: 'automatically placing keyboard focus into a designated input on page load', cat: 'Forms & UX' },
  { name: 'novalidate Attribute on <form>', purpose: 'suppressing native browser constraint validation popups for custom handling', cat: 'Forms' },
  { name: '<header> Semantic Landmark', purpose: 'defining introductory content, branding logos, and site navigation landmarks', cat: 'Semantic Landmarks' },
  { name: '<nav> Semantic Navigation Landmark', purpose: 'identifying major navigational link clusters for screen reader landmark jumps', cat: 'Semantic Landmarks' },
  { name: '<main> Semantic Primary Landmark', purpose: 'demarcating the central, unique content of the document (singular per page)', cat: 'Semantic Landmarks' },
  { name: '<article> Independent Content Landmark', purpose: 'encapsulating self-contained content distributable independently (blog post, card)', cat: 'Semantic Landmarks' },
  { name: '<section> Thematic Grouping Landmark', purpose: 'grouping related thematic content typically introduced by an explicit heading', cat: 'Semantic Landmarks' },
  { name: '<aside> Tangential Landmark', purpose: 'housing secondary sidebars, callout notes, glossaries, or related links', cat: 'Semantic Landmarks' },
  { name: '<footer> Semantic Footer Landmark', purpose: 'holding author information, copyright disclaimers, and legal footer links', cat: 'Semantic Landmarks' },
  { name: '<address> Contact Info Element', purpose: 'providing contact information for the author of an article or document', cat: 'Semantic Landmarks' },
  { name: '<time> Semantic Machine-Readable Date', purpose: 'formatting dates and times with datetime ISO-8601 attributes for parsers', cat: 'Semantics & a11y' },
  { name: '<details> and <summary> Native Accordion', purpose: 'implementing collapsible disclosure widgets natively without JavaScript code', cat: 'Interactive Elements' },
  { name: '<dialog> Native HTML5 Dialog', purpose: 'providing accessible modal and non-modal popup overlays with native backdrop styling', cat: 'Interactive Elements' },
  { name: '<div> Generic Block Container', purpose: 'serving as a style and layout wrapper without imparting semantic meaning', cat: 'Layout Wrappers' },
  { name: '<span> Generic Inline Container', purpose: 'styling inline text segments without altering document layout flow', cat: 'Layout Wrappers' },
  { name: 'Block-level vs Inline Elements', purpose: 'distinguishing between elements starting on new lines vs flowing within text', cat: 'Document Flow' },
  { name: 'Void Elements in HTML Specification', purpose: 'identifying tags that cannot possess closing tags or child content', cat: 'Parsing & Spec' },
  { name: 'id Attribute and Anchor Fragments', purpose: 'uniquely identifying elements for CSS targeting, script access, and jump links', cat: 'Core Attributes' },
  { name: 'class Attribute and Multi-Class Tokens', purpose: 'assigning space-separated class tokens for reusable CSS styling', cat: 'Core Attributes' },
  { name: 'style Attribute and Specificity', purpose: 'applying inline CSS rules directly to elements overriding external classes', cat: 'Core Attributes' },
  { name: 'title Attribute Tooltip Caveats', purpose: 'providing advisory hover tooltips while avoiding touch device accessibility flaws', cat: 'Core Attributes' },
  { name: 'hidden Attribute for Visibility', purpose: 'hiding elements from visual layout and the accessibility tree declaratively', cat: 'Core Attributes' },
  { name: 'contenteditable Attribute', purpose: 'enabling users to edit element content directly inside the rendered browser page', cat: 'Interactive Attributes' },
  { name: 'spellcheck Attribute', purpose: 'controlling whether the browser performs red-underline spellchecking on fields', cat: 'Interactive Attributes' },
  { name: 'tabindex="0" and tabindex="-1"', purpose: 'controlling sequential keyboard tab order and programmatic focus targeting', cat: 'Accessibility (a11y)' },
  { name: 'draggable Attribute', purpose: 'designating elements as draggable components in native HTML5 drag-and-drop', cat: 'Interactive Attributes' },
  { name: 'data-* Custom Data Attributes', purpose: 'storing custom private application data attributes on DOM elements', cat: 'Core Attributes' },
  { name: '<video> Video Player Element', purpose: 'embedding video files with native player controls, poster images, and preload flags', cat: 'Multimedia' },
  { name: '<audio> Audio Player Element', purpose: 'streaming sound files and podcasts with browser-native playback controls', cat: 'Multimedia' },
  { name: '<source> Media Fallbacks', purpose: 'supplying alternative media formats (MP4, WebM) for cross-browser playback', cat: 'Multimedia' },
  { name: '<track> Subtitles and WebVTT', purpose: 'attaching timed caption and subtitle tracks to video players for accessibility', cat: 'Multimedia & a11y' },
  { name: '<iframe> Embedded Browsing Context', purpose: 'nesting external web pages inside sandboxed inline frames', cat: 'Embedded Media' },
  { name: 'sandbox Attribute on <iframe>', purpose: 'imposing strict security restrictions on embedded iframe capabilities and scripts', cat: 'Security & iframe' },
  { name: '<canvas> Bitmap Graphics Surface', purpose: 'providing a procedural pixel rendering canvas for graphics and visualizations', cat: 'Graphics & Vector' },
  { name: '<svg> Inline Vector Graphics', purpose: 'inlining scalable XML vector artwork with sharp rendering at all display densities', cat: 'Graphics & Vector' },
  { name: '<link rel="stylesheet"> Stylesheet Tag', purpose: 'linking external CSS style sheets inside the document head', cat: 'Resource Loading' },
  { name: '<link rel="preload"> Resource Hint', purpose: 'prioritizing high-priority resource downloads early in the critical rendering path', cat: 'Performance & Hints' },
  { name: '<link rel="prefetch"> Resource Hint', purpose: 'downloading resources needed for future navigations during browser idle time', cat: 'Performance & Hints' },
  { name: '<link rel="preconnect"> Handshake Hint', purpose: 'initiating early DNS resolution, TCP handshake, and TLS negotiation with servers', cat: 'Performance & Hints' },
  { name: '<link rel="canonical"> URL Tag', purpose: 'preventing search engine duplicate content penalties by designating preferred URLs', cat: 'SEO & Metadata' },
  { name: '<script> Script Inclusion', purpose: 'embedding external and inline JavaScript programs into web documents', cat: 'Script Loading' },
  { name: '<script async> vs <script defer>', purpose: 'optimizing script downloading and execution timing relative to DOM construction', cat: 'Performance & Scripts' },
];

console.log(`Generated ${htmlTopicBases.length} distinct HTML topics.`);

// Let's write htmlTopics.mjs
const htmlTopicsOutput = `// scripts/generators/topics/htmlTopics.mjs
// 125 Curated, Pure HTML Topics (Zero JavaScript Contamination)

export const HTML_TOPICS = ${JSON.stringify(
  htmlTopicBases.map((t, idx) => ({
    name: t.name,
    purpose: t.purpose,
    category: t.cat,
    tag: 'html5',
    exampleCode: `<!-- Pure HTML Demonstration of ${t.name} -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${t.name} Example</title>
</head>
<body>
  <main>
    <section>
      <h1>${t.name}</h1>
      <p>Demonstrating ${t.purpose}.</p>
    </section>
  </main>
</body>
</html>`,
    lineByLine: [
      { line: 2, code: '<!DOCTYPE html>', explanation: 'Declares standard HTML5 mode.' },
      { line: 3, code: '<html lang="en">', explanation: 'Declares document root and primary language.' },
      { line: 10, code: `<h1>${t.name}</h1>`, explanation: `Defines semantic heading for ${t.name}.` },
    ],
    executionFlow: [
      `Step 1: HTML parser tokenizes start tag for ${t.name}.`,
      `Step 2: Tree builder constructs DOM node and sets attributes.`,
      `Step 3: Node is added to Document tree and exposed to accessibility engine.`,
    ],
    commonMistakes: [
      `Misspelling attributes or nesting inside incompatible parent elements.`,
      `Omitting accessible alternatives required by WCAG guidelines.`,
    ],
    interviewTraps: [
      `Trap: How does the browser recover if ${t.name} is written with malformed markup? Tip: HTML5 spec specifies deterministic error recovery algorithms.`,
    ],
    interviewTips: [
      `For freshers: Always articulate semantic purpose before discussing visual presentation.`,
      `Mention accessibility tree mapping to stand out in interviews.`,
    ],
    followUps: [
      `What are the accessibility consequences if ${t.name} is omitted?`,
      `How does ${t.name} behave in mobile responsive viewports?`,
    ],
    followUpAnswers: [
      `Omitting proper markup damages screen reader navigation and lowers Lighthouse a11y scores.`,
      `Modern HTML5 elements adapt gracefully across viewports when paired with responsive viewport meta tags.`,
    ],
  })),
  null,
  2
)};
`;

fs.writeFileSync(path.join(TOPICS_DIR, 'htmlTopics.mjs'), htmlTopicsOutput, 'utf-8');
console.log('✅ Created htmlTopics.mjs with 125 pure HTML topics');
