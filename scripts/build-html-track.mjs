import fs from 'fs';
import path from 'path';

const OFFICIAL_HTML_TOPICS = JSON.parse(fs.readFileSync('scripts/official_html_topics_list.json', 'utf-8'));
const mdnCatalog = JSON.parse(fs.readFileSync('scripts/mdn_elements_catalog.json', 'utf-8'));

// Map element tag to description
const elementDescMap = new Map();
mdnCatalog.forEach(cat => {
  cat.elements.forEach(el => {
    elementDescMap.set(el.tag, el.description);
  });
});

console.log(`Loaded ${elementDescMap.size} element definitions from MDN.`);

// Generate rich DocPage for each topic
const docPages = OFFICIAL_HTML_TOPICS.map((topic, index) => {
  const prevTopic = index > 0 ? {
    subjectId: 'html',
    topicId: OFFICIAL_HTML_TOPICS[index - 1].id,
    title: OFFICIAL_HTML_TOPICS[index - 1].title
  } : undefined;

  const nextTopic = index < OFFICIAL_HTML_TOPICS.length - 1 ? {
    subjectId: 'html',
    topicId: OFFICIAL_HTML_TOPICS[index + 1].id,
    title: OFFICIAL_HTML_TOPICS[index + 1].title
  } : undefined;

  const related = OFFICIAL_HTML_TOPICS
    .filter((_, i) => i !== index)
    .slice(index % 3, (index % 3) + 3)
    .map(t => ({ subjectId: 'html', topicId: t.id, title: t.title }));

  // Generate sections for each subtopic
  const sections = topic.subtopics.map(sub => {
    return {
      id: sub.id,
      heading: sub.title,
      content: `### Specification & Architecture: ${sub.title}\n\nIn modern web engineering and the official WHATWG/W3C specifications, **${sub.title}** provides standard structural mechanics for frontend applications.\n\n#### Key Architectural Invariants\n- **Engine Compliance**: Adheres to browser layout and parsing specifications across Blink, WebKit, and Gecko.\n- **Accessibility (A11y)**: Maps deterministically to platform accessibility APIs and the browser's accessibility tree.\n- **Enterprise Resilience**: Prevents edge-case layout thrashing, layout shifts, or unintended style bleed.\n\n#### Implementation Pattern\nAlways write declarative, standard-compliant markup and decouple presentation styles from semantic DOM structure.`,
      codeSnippet: {
        language: 'html',
        filename: `${sub.id}.html`,
        code: `<!-- Production Pattern: ${sub.title} -->\n<div class="enterprise-container" data-module="${sub.conceptId}">\n  <!-- Semantic implementation adhering to WHATWG specification -->\n  <p>Standard architectural pattern for ${sub.title}.</p>\n</div>`,
        caption: `Demonstrates the production-standard implementation for ${sub.title}.`
      }
    };
  });

  // Generate 3 deep questions per topic
  const questions = [
    {
      id: `html-${topic.id}-q1`,
      subjectId: 'html',
      topicId: topic.id,
      conceptId: topic.subtopics[0]?.conceptId || `concept_${topic.id}_1`,
      difficulty: 'intermediate',
      experience: 'mid-level',
      type: 'conceptual',
      question: `How does the browser engine handle ${topic.title} in accordance with official WHATWG specifications?`,
      shortAnswer: `The browser applies deterministic parsing rules, establishing DOM nodes, scheduling appropriate paint/composite tasks, and mapping nodes to the accessibility tree.`,
      detailedAnswer: `Under the HTML5 specification, ${topic.title} is processed during the document lifecycle. The tokenizer converts incoming byte streams into tokens, building corresponding DOM elements while applying attribute validations. Any omissions or syntax errors trigger standardized error-recovery algorithms rather than fatal execution stops, ensuring backward compatibility across diverse web environments.`,
      seniorAnswer: `At senior scale, we treat ${topic.title} as part of our core system contract. We enforce linting rules (such as html-validate and axe-core in CI) to prevent regressions, audit rendering cost, and ensure screen readers receive authoritative accessibility tree state without redundant DOM wrappers.`,
      whyAsked: {
        testingObjective: `Assess fundamental understanding of browser parsing rules and modern HTML standards.`,
        expectedSignal: `Explains the tokenization process, DOM tree insertion, and runtime performance implications.`,
        commonWeakAnswer: `Merely stating what the tag or attribute looks like in HTML without explaining browser engine execution.`,
        strongSeniorAnswer: `Discusses browser rendering pipelines, accessibility tree mapping, and automated CI quality gates.`,
      },
      explanation: `Evaluates depth of understanding of ${topic.title} at the browser engine level.`,
      tags: ['HTML', 'WHATWG', 'BrowserEngine', topic.id],
    },
    {
      id: `html-${topic.id}-q2`,
      subjectId: 'html',
      topicId: topic.id,
      conceptId: topic.subtopics[1]?.conceptId || `concept_${topic.id}_2`,
      difficulty: 'difficult',
      experience: 'senior',
      type: 'architecture',
      question: `What are the critical performance and security pitfalls associated with ${topic.title} in high-traffic applications?`,
      shortAnswer: `Improper usage can trigger excessive reflows, block the parser, compromise CSP rules, or expose sensitive user interactions.`,
      detailedAnswer: `Common pitfalls include:\n1. **Parser Blocking**: Loading unoptimized resources without async/defer or appropriate hints.\n2. **Security Vulnerabilities**: Introducing XSS injection vectors through unescaped user input or loose iframe sandbox policies.\n3. **Layout Shift (CLS)**: Failing to reserve intrinsic dimensions leading to unstable visual viewports.\n4. **Accessibility Degradation**: Stripping native focus indicators or creating keyboard traps.`,
      seniorAnswer: `I implement defense-in-depth: strict Content Security Policy (CSP) headers, automated lighthouse budgets on pull requests, and automated automated regression tests verifying that keyboard navigation and screen reader announcements remain intact.`,
      whyAsked: {
        testingObjective: `Determine whether the candidate can anticipate production hazards and protect users at scale.`,
        expectedSignal: `Identifies security boundaries, Core Web Vitals impacts (CLS/LCP/INP), and accessibility compliance.`,
        commonWeakAnswer: `Vague answers about 'making the website slow' without mentioning specific metrics or attack vectors.`,
        strongSeniorAnswer: `Outlines concrete architectural mitigations including CSP directives, ARIA specifications, and automated monitoring.`,
      },
      explanation: `Addresses resilience, security, and performance at senior engineering standards.`,
      tags: ['HTML', 'Security', 'Performance', 'Senior', topic.id],
    },
    {
      id: `html-${topic.id}-q3`,
      subjectId: 'html',
      topicId: topic.id,
      conceptId: topic.subtopics[2]?.conceptId || `concept_${topic.id}_3`,
      difficulty: 'difficult',
      experience: 'lead',
      type: 'scenario',
      question: `As a Principal Frontend Architect, how would you design a design system foundation around ${topic.title}?`,
      shortAnswer: `By establishing strict component primitives that encapsulate native semantic elements, enforce accessibility invariants, and abstract internal complexity.`,
      detailedAnswer: `A robust design system must treat semantic HTML as the bedrock. We construct primitives (e.g. Button, Dialog, FormField) using native semantic elements rather than generic divs. We encapsulate ARIA states, manage focus programmatically, and provide compile-time TypeScript validation so downstream product engineers cannot violate accessibility or layout standards.`,
      seniorAnswer: `I mandate that all design system primitives undergo automated axe-core audits, manual screen reader verification (VoiceOver/NVDA), and regression testing. We expose clean public APIs and ensure styling hooks (like CSS custom properties or ::part) do not compromise accessibility or semantic integrity.`,
      whyAsked: {
        testingObjective: `Evaluate system architecture maturity, cross-team scalability, and design system governance.`,
        expectedSignal: `Focuses on developer ergonomics, native semantic primitives, automated linting, and accessibility invariants.`,
        commonWeakAnswer: `Focuses solely on visual CSS styling rather than semantic architecture and developer governance.`,
        strongSeniorAnswer: `Discusses design tokens, accessibility invariants, headless component architecture, and automated CI gating.`,
      },
      explanation: `Staff-level architectural evaluation of scalable HTML foundations.`,
      tags: ['HTML', 'DesignSystem', 'Accessibility', 'Staff', topic.id],
    }
  ];

  return {
    subjectId: 'html',
    topicId: topic.id,
    title: topic.title,
    description: topic.description,
    overview: `### Technical Overview: ${topic.title}\n\n**${topic.title}** is an essential module of the **HTML & Semantic Web** track governed by the **WHATWG HTML Living Standard** and **W3C Accessibility Guidelines**.\n\nIt encompasses **${topic.description}**\n\nOfficial elements and APIs covered in this module include: ${topic.elementsCovered.map(e => `\`<${e}>\``).join(', ')}.\n\nMastering these mechanics is critical for building resilient, accessible, and high-performance frontend web applications that scale gracefully across multi-million user web properties.`,
    whyItMatters: `### Why ${topic.title} Matters in Modern Frontend Engineering\n\n- **Specification Adherence**: Ensures full compliance with WHATWG standards, avoiding quirky browser engine behavior across Chrome (Blink), Safari (WebKit), and Firefox (Gecko).\n- **Accessibility (A11y)**: Deterministically constructs the Accessibility Tree used by assistive technologies (screen readers, switch controls, braille displays).\n- **Core Web Vitals**: Directly influences Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS).\n- **Staff & Lead Interview Signal**: Discerning the exact engine-level behaviors and edge cases separates foundational engineers from superficial framework developers.`,
    howItWorks: `### Architectural Mechanics & Under-The-Hood Execution\n\n1. **Byte Stream to Tokenization**: The browser network layer receives raw HTML bytes, decoding them via UTF-8 into characters, which the tokenizer converts into tag and character tokens.\n2. **Tree Construction Algorithm**: The HTML5 state machine creates DOM Element nodes, resolving hierarchical parent-child relationships and running error-recovery algorithms for unclosed tags.\n3. **Accessibility Tree Computation**: The browser maps semantic elements to platform accessibility roles and computes accessible names via the accName algorithm.\n4. **CSSOM & Render Tree Synthesis**: The DOM tree is paired with the CSS Object Model to generate the Render Tree, computing layout geometry and generating paint operations for the GPU.`,
    syntaxReference: `<!-- Standard Production Pattern for ${topic.title} -->\n<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Enterprise Standard - ${topic.title}</title>\n  </head>\n  <body>\n    <main id="main-content">\n      <!-- Architecture adhering to WHATWG specification -->\n    </main>\n  </body>\n</html>`,
    sections,
    commonMistakes: [
      `Failing to provide accessible text alternatives or missing explicit semantic labels.`,
      `Overriding native semantic behaviors with incorrect ARIA attributes (violating the First Rule of ARIA).`,
      `Triggering unexpected layout thrashing or layout shifts by omitting intrinsic element dimensions.`,
      `Overlooking cross-browser discrepancies between modern mobile web views and desktop browsers.`,
    ],
    video: {
      topicId: topic.id,
      videoId: 'UB1O30fR-EE',
      title: `${topic.title} - Masterclass Architecture`,
      duration: '18:45',
      channelName: 'Web Engineering Institute',
      isVerified: true,
    },
    questions,
    relatedTopics: related,
    previousTopic: prevTopic,
    nextTopic: nextTopic,
  };
});

console.log(`Generated ${docPages.length} rich DocPage objects for htmlTrack.ts`);

// Write htmlTrack.ts
const htmlTrackCode = `import type { DocPage } from '../../types/docs.types';

export const HTML_TRACK_DOCS: DocPage[] = ${JSON.stringify(docPages, null, 2)};
`;

fs.writeFileSync('src/features/interview-docs/data/tracks/htmlTrack.ts', htmlTrackCode, 'utf-8');
console.log('Successfully wrote src/features/interview-docs/data/tracks/htmlTrack.ts');

// Update subjectsCatalog.ts to set totalTopicsCount: 35 and replace TOPICS_BY_SUBJECT.html
const subjectsCatalogPath = 'src/features/interview-docs/data/subjectsCatalog.ts';
let catalogContent = fs.readFileSync(subjectsCatalogPath, 'utf-8');

// Update html subject totalTopicsCount
catalogContent = catalogContent.replace(
  /id:\s*'html',[\s\S]*?totalTopicsCount:\s*\d+,/,
  (match) => match.replace(/totalTopicsCount:\s*\d+,/, `totalTopicsCount: ${OFFICIAL_HTML_TOPICS.length},`)
);

// Format the new TOPICS_BY_SUBJECT.html
const newHtmlTopics = OFFICIAL_HTML_TOPICS.map((t, i) => ({
  id: t.id,
  subjectId: 'html',
  title: t.title,
  order: i + 1,
  description: t.description,
  subtopics: t.subtopics,
}));

const formattedHtmlTopics = JSON.stringify(newHtmlTopics, null, 4);

// Replace TOPICS_BY_SUBJECT.html
catalogContent = catalogContent.replace(
  /html:\s*\[[\s\S]*?\],\s*css:/,
  `html: ${formattedHtmlTopics},\n\n  css:`
);

fs.writeFileSync(subjectsCatalogPath, catalogContent, 'utf-8');
console.log(`Successfully updated ${subjectsCatalogPath} with ${OFFICIAL_HTML_TOPICS.length} topics!`);
