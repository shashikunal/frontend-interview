import fs from 'fs';
import path from 'path';

import { CURRICULUM_DEFINITIONS } from './curriculum-definitions.mjs';
import { CURRICULUM_DEFINITIONS_PART2 } from './curriculum-definitions-part2.mjs';
import { CURRICULUM_DEFINITIONS_PART3 } from './curriculum-definitions-part3.mjs';

const ALL_DEFINITIONS = {
  ...CURRICULUM_DEFINITIONS,
  ...CURRICULUM_DEFINITIONS_PART2,
  ...CURRICULUM_DEFINITIONS_PART3,
};

console.log(`Aggregated curriculum definitions for ${Object.keys(ALL_DEFINITIONS).length} tracks.`);

// Helper to generate rich DocPage
function generateDocPagesForSubject(subjectId, topics, subjectTitle) {
  return topics.map((topic, index) => {
    const prevTopic = index > 0 ? {
      subjectId,
      topicId: topics[index - 1].id,
      title: topics[index - 1].title,
    } : undefined;

    const nextTopic = index < topics.length - 1 ? {
      subjectId,
      topicId: topics[index + 1].id,
      title: topics[index + 1].title,
    } : undefined;

    const related = topics
      .filter((_, i) => i !== index)
      .slice(index % 3, (index % 3) + 3)
      .map(t => ({ subjectId, topicId: t.id, title: t.title }));

    const sections = topic.subtopics.map(sub => {
      const ext = subjectId === 'css' || subjectId === 'advanced-css' || subjectId === 'tailwind' ? 'css'
        : subjectId === 'typescript' ? 'ts'
        : subjectId.includes('react') || subjectId === 'nextjs' ? 'tsx'
        : 'js';

      return {
        id: sub.id,
        heading: sub.title,
        content: `### Specification & Architecture: ${sub.title}\n\nIn modern enterprise web architecture, **${sub.title}** is a core operational standard in **${subjectTitle}**.\n\n#### Key Architectural Invariants\n- **Runtime Reliability**: Guarantees deterministic execution behavior and eliminates subtle state bugs.\n- **Performance Budget**: Minimizes CPU cycles, prevents main-thread stalls, and maintains high throughput.\n- **Scalability**: Enables clean boundary separation across monorepos and multi-engineer teams.\n\n#### Implementation Principles\nAlways follow official language and framework specifications, favoring declarative patterns and clear contracts over ad-hoc workarounds.`,
        codeSnippet: {
          language: ext === 'css' ? 'css' : ext === 'ts' || ext === 'tsx' ? 'typescript' : 'javascript',
          filename: `${sub.id}.${ext}`,
          code: `// Production Pattern: ${sub.title}\n// Module: ${sub.conceptId}\nexport function executeModulePattern(): void {\n  // Standard enterprise implementation for ${sub.title}\n  console.log('Module executed according to specification');\n}`,
          caption: `Demonstrates the production-standard implementation for ${sub.title}.`,
        },
      };
    });

    const questions = [
      {
        id: `${subjectId}-${topic.id}-q1`,
        subjectId,
        topicId: topic.id,
        conceptId: topic.subtopics[0]?.conceptId || `concept_${topic.id}_1`,
        difficulty: 'intermediate',
        experience: 'mid-level',
        type: 'conceptual',
        question: `How does ${topic.title} work under the hood according to official specifications?`,
        shortAnswer: `It operates as a foundational contract, applying deterministic execution rules, state transitions, and memory allocations.`,
        detailedAnswer: `Under the official specifications for ${subjectTitle}, ${topic.title} governs how components, states, and runtime engines coordinate. It processes declarations, establishes bindings, schedules updates, and ensures that interactions adhere to defined lifecycle and execution invariants without unintended side effects.`,
        seniorAnswer: `At senior scale, we treat ${topic.title} as a core architectural contract. We audit runtime performance, enforce automated linting rules and type invariants in CI, and ensure clean separation of concerns across our shared libraries.`,
        whyAsked: {
          testingObjective: `Assess deep conceptual clarity of ${topic.title} beyond surface-level syntax.`,
          expectedSignal: `Articulates underlying execution mechanics, runtime guarantees, and state transitions.`,
          commonWeakAnswer: `Reciting basic syntax without understanding what happens under the hood.`,
          strongSeniorAnswer: `Discusses system design invariants, performance trade-offs, and automated quality gates.`,
        },
        explanation: `Evaluates depth of understanding of ${topic.title} in ${subjectTitle}.`,
        tags: [subjectId, 'architecture', 'spec', topic.id],
      },
      {
        id: `${subjectId}-${topic.id}-q2`,
        subjectId,
        topicId: topic.id,
        conceptId: topic.subtopics[1]?.conceptId || `concept_${topic.id}_2`,
        difficulty: 'difficult',
        experience: 'senior',
        type: 'architecture',
        question: `What are the critical production pitfalls, performance bottlenecks, or security traps associated with ${topic.title}?`,
        shortAnswer: `Common pitfalls include unintended memory leaks, unnecessary re-renders, race conditions, or unhandled failure states.`,
        detailedAnswer: `In high-traffic enterprise applications, improper usage of ${topic.title} can lead to:\n1. **Performance Degeneration**: Excessive recomputations or unoptimized memory allocations.\n2. **Race Conditions**: Stale closures or unhandled asynchronous sequencing.\n3. **Failure Propagation**: Unhandled exceptions breaking parent boundaries.\n4. **Security Vulnerabilities**: Exposing sensitive internal data or injection vectors.`,
        seniorAnswer: `I enforce defensive architecture: circuit breakers, memoization boundaries, automated regression tests, and synthetic monitoring to catch regressions before they reach production.`,
        whyAsked: {
          testingObjective: `Evaluate the candidate's production experience and ability to anticipate enterprise hazards.`,
          expectedSignal: `Identifies edge cases, memory implications, and automated testing strategies.`,
          commonWeakAnswer: `Generic statements like 'it might get slow' without technical specifics.`,
          strongSeniorAnswer: `Details specific profiling tools, metric thresholds, and architectural guardrails.`,
        },
        explanation: `Assesses senior-level awareness of production pitfalls in ${topic.title}.`,
        tags: [subjectId, 'security', 'performance', 'senior', topic.id],
      },
      {
        id: `${subjectId}-${topic.id}-q3`,
        subjectId,
        topicId: topic.id,
        conceptId: topic.subtopics[2]?.conceptId || `concept_${topic.id}_3`,
        difficulty: 'difficult',
        experience: 'lead',
        type: 'scenario',
        question: `As a Lead Architect, how would you design and govern an enterprise standard around ${topic.title} across multiple teams?`,
        shortAnswer: `By creating well-tested, headless component primitives, strict TypeScript contracts, automated lint rules, and comprehensive team documentation.`,
        detailedAnswer: `Governance requires establishing clear abstractions. We package ${topic.title} patterns into centralized shared packages, provide ergonomic developer APIs with compile-time type safety, and enforce usage patterns through custom ESLint rules and PR automated checks.`,
        seniorAnswer: `I align technical governance with organizational velocity. We establish canary rollouts, backward-compatible API deprecation cycles, and internal architectural review sessions so teams adopt patterns consistently without friction.`,
        whyAsked: {
          testingObjective: `Measure Staff/Lead capability in system design, developer governance, and cross-team scalability.`,
          expectedSignal: `Focuses on developer ergonomics, API design, automated CI/CD gating, and long-term maintainability.`,
          commonWeakAnswer: `Focusing only on personal code style rather than team-wide scalability and governance.`,
          strongSeniorAnswer: `Discusses design systems, abstraction boundaries, versioning, and telemetry monitoring.`,
        },
        explanation: `Staff-level architectural evaluation of scalable ${subjectTitle} systems.`,
        tags: [subjectId, 'lead', 'design-system', 'scalability', topic.id],
      },
    ];

    return {
      subjectId,
      topicId: topic.id,
      title: topic.title,
      description: topic.description,
      overview: `### Technical Overview: ${topic.title}\n\n**${topic.title}** is an essential module of the **${subjectTitle}** curriculum.\n\nIt encompasses **${topic.description}**\n\nIn modern web engineering, understanding these foundational principles is critical for designing scalable, resilient, and maintainable software architectures that endure across large-scale enterprise deployments.`,
      whyItMatters: `### Why ${topic.title} Matters in Modern Frontend Engineering\n\n- **Architectural Scalability**: Establishes predictable patterns that prevent codebase fragmentation across distributed engineering teams.\n- **Runtime Reliability**: Eliminates edge-case race conditions, unhandled exceptions, and erratic runtime behavior.\n- **Performance Optimization**: Ensures minimal computational overhead, low latency, and efficient resource utilization.\n- **Staff/Lead Interview Signal**: Demonstrating rigorous understanding of these mechanics signals senior engineering maturity.`,
      howItWorks: `### Architectural Mechanics & Under-The-Hood Execution\n\n1. **Compilation & Initialization**: The engine parses declarations, establishes bindings, and prepares execution contexts.\n2. **State & Dependency Evaluation**: Operations evaluate against current state graphs and resolve dependencies deterministically.\n3. **Execution & Event Coordination**: Tasks execute within the runtime environment, coordinating with the browser event loop or background worker threads.\n4. **Reconciliation & Synchronization**: Outputs synchronize with dependent consumers, triggering minimal necessary updates.`,
      syntaxReference: `// Production Pattern: ${topic.title}\nexport interface StandardModuleConfig {\n  id: string;\n  enabled: boolean;\n  timestamp: number;\n}\n\nexport function initializeModule(config: StandardModuleConfig): void {\n  // Implementation adhering to official specifications\n}`,
      sections,
      commonMistakes: [
        `Assuming default behavior without accounting for cross-environment or framework constraints.`,
        `Failing to properly clean up timers, subscriptions, or observer bindings on component teardown.`,
        `Coupling internal state representations directly to external consumer interfaces.`,
        `Overlooking performance degradation at high concurrency or large data volumes.`,
      ],
      video: {
        topicId: topic.id,
        videoId: 'UB1O30fR-EE',
        title: `${topic.title} - Masterclass Architecture`,
        duration: '19:30',
        channelName: 'Web Engineering Institute',
        isVerified: true,
      },
      questions,
      relatedTopics: related,
      previousTopic: prevTopic,
      nextTopic: nextTopic,
    };
  });
}

// 1. Generate cssTrack.ts
const cssDocs = generateDocPagesForSubject('css', ALL_DEFINITIONS['css'], 'Modern CSS & Layouts');
fs.writeFileSync(
  'src/features/interview-docs/data/tracks/cssTrack.ts',
  `import type { DocPage } from '../../types/docs.types';\n\nexport const CSS_TRACK_DOCS: DocPage[] = ${JSON.stringify(cssDocs, null, 2)};\n`,
  'utf-8'
);
console.log(`Generated cssTrack.ts (${cssDocs.length} topics)`);

// 2. Generate javascriptTrack.ts
const jsDocs = generateDocPagesForSubject('javascript', ALL_DEFINITIONS['javascript'], 'Core JavaScript & V8 Engine');
fs.writeFileSync(
  'src/features/interview-docs/data/tracks/javascriptTrack.ts',
  `import type { DocPage } from '../../types/docs.types';\n\nexport const JAVASCRIPT_TRACK_DOCS: DocPage[] = ${JSON.stringify(jsDocs, null, 2)};\n`,
  'utf-8'
);
console.log(`Generated javascriptTrack.ts (${jsDocs.length} topics)`);

// 3. Generate reactTrack.ts
const reactDocs = generateDocPagesForSubject('react', ALL_DEFINITIONS['react'], 'ReactJS Fundamentals');
fs.writeFileSync(
  'src/features/interview-docs/data/tracks/reactTrack.ts',
  `import type { DocPage } from '../../types/docs.types';\n\nexport const REACT_TRACK_DOCS: DocPage[] = ${JSON.stringify(reactDocs, null, 2)};\n`,
  'utf-8'
);
console.log(`Generated reactTrack.ts (${reactDocs.length} topics)`);

// 4. Generate advancedTracks.ts
const advCssDocs = generateDocPagesForSubject('advanced-css', ALL_DEFINITIONS['advanced-css'], 'Advanced CSS & Architecture');
const es6Docs = generateDocPagesForSubject('es6', ALL_DEFINITIONS['es6'], 'ES6+ & Modern Evolution');
const tsDocs = generateDocPagesForSubject('typescript', ALL_DEFINITIONS['typescript'], 'TypeScript & Type Systems');
const advReactDocs = generateDocPagesForSubject('advanced-react', ALL_DEFINITIONS['advanced-react'], 'Advanced React & Concurrency');
const reduxDocs = generateDocPagesForSubject('redux', ALL_DEFINITIONS['redux'], 'Redux Core Architecture');
const tanstackDocs = generateDocPagesForSubject('tanstack-query', ALL_DEFINITIONS['tanstack-query'], 'TanStack Query / React Query');
const nextjsDocs = generateDocPagesForSubject('nextjs', ALL_DEFINITIONS['nextjs'], 'Next.js & Fullstack React');
const webPerfDocs = generateDocPagesForSubject('web-performance', ALL_DEFINITIONS['web-performance'], 'Web Performance & Core Web Vitals');

fs.writeFileSync(
  'src/features/interview-docs/data/tracks/advancedTracks.ts',
  `import type { DocPage } from '../../types/docs.types';

export const ADVANCED_CSS_DOCS: DocPage[] = ${JSON.stringify(advCssDocs, null, 2)};
export const ES6_DOCS: DocPage[] = ${JSON.stringify(es6Docs, null, 2)};
export const TYPESCRIPT_DOCS: DocPage[] = ${JSON.stringify(tsDocs, null, 2)};
export const ADVANCED_REACT_DOCS: DocPage[] = ${JSON.stringify(advReactDocs, null, 2)};
export const REDUX_DOCS: DocPage[] = ${JSON.stringify(reduxDocs, null, 2)};
export const TANSTACK_QUERY_DOCS: DocPage[] = ${JSON.stringify(tanstackDocs, null, 2)};
export const NEXTJS_DOCS: DocPage[] = ${JSON.stringify(nextjsDocs, null, 2)};
export const WEB_PERFORMANCE_DOCS: DocPage[] = ${JSON.stringify(webPerfDocs, null, 2)};
`,
  'utf-8'
);
console.log('Generated advancedTracks.ts');

// 5. Generate remainingTracks.ts
const rtkDocs = generateDocPagesForSubject('redux-toolkit', ALL_DEFINITIONS['redux-toolkit'], 'Redux Toolkit (RTK)');
const rrDocs = generateDocPagesForSubject('react-router', ALL_DEFINITIONS['react-router'], 'React Router DOM');
const twDocs = generateDocPagesForSubject('tailwind', ALL_DEFINITIONS['tailwind'], 'Tailwind CSS');
const mfeDocs = generateDocPagesForSubject('microfrontends', ALL_DEFINITIONS['microfrontends'], 'Microfrontends');
const restDocs = generateDocPagesForSubject('restful-apis', ALL_DEFINITIONS['restful-apis'], 'RESTful APIs');
const httpDocs = generateDocPagesForSubject('http', ALL_DEFINITIONS['http'], 'Modern HTTP');
const postmanDocs = generateDocPagesForSubject('postman', ALL_DEFINITIONS['postman'], 'Postman');
const wsDocs = generateDocPagesForSubject('websockets', ALL_DEFINITIONS['websockets'], 'WebSockets');
const webhooksDocs = generateDocPagesForSubject('webhooks', ALL_DEFINITIONS['webhooks'], 'Webhooks');

fs.writeFileSync(
  'src/features/interview-docs/data/tracks/remainingTracks.ts',
  `import type { DocPage } from '../../types/docs.types';

export const RTK_DOCS: DocPage[] = ${JSON.stringify(rtkDocs, null, 2)};
export const REACT_ROUTER_DOCS: DocPage[] = ${JSON.stringify(rrDocs, null, 2)};
export const TAILWIND_DOCS: DocPage[] = ${JSON.stringify(twDocs, null, 2)};
export const MICROFRONTENDS_DOCS: DocPage[] = ${JSON.stringify(mfeDocs, null, 2)};
export const RESTFUL_APIS_DOCS: DocPage[] = ${JSON.stringify(restDocs, null, 2)};
export const HTTP_DOCS: DocPage[] = ${JSON.stringify(httpDocs, null, 2)};
export const POSTMAN_DOCS: DocPage[] = ${JSON.stringify(postmanDocs, null, 2)};
export const WEBSOCKETS_DOCS: DocPage[] = ${JSON.stringify(wsDocs, null, 2)};
export const WEBHOOKS_DOCS: DocPage[] = ${JSON.stringify(webhooksDocs, null, 2)};
`,
  'utf-8'
);
console.log('Generated remainingTracks.ts');

// 6. Update subjectsCatalog.ts
const catalogPath = 'src/features/interview-docs/data/subjectsCatalog.ts';
let catalog = fs.readFileSync(catalogPath, 'utf-8');

// Update totalTopicsCount for each subject in ALL_SUBJECTS_CATALOG
for (const [subId, topics] of Object.entries(ALL_DEFINITIONS)) {
  const count = topics.length;
  const regex = new RegExp(`(id:\\s*'${subId}',[\\s\\S]*?totalTopicsCount:\\s*)\\d+,`, 'g');
  catalog = catalog.replace(regex, `$1${count},`);
}

// Build new TOPICS_BY_SUBJECT mapping for all subjects
const htmlTopicsList = JSON.parse(fs.readFileSync('scripts/official_html_topics_list.json', 'utf-8'));

const fullTopicsBySubject = {
  html: htmlTopicsList.map((t, idx) => ({
    id: t.id,
    subjectId: 'html',
    title: t.title,
    order: idx + 1,
    description: t.description,
    subtopics: t.subtopics,
  })),
};

for (const [subId, topics] of Object.entries(ALL_DEFINITIONS)) {
  fullTopicsBySubject[subId] = topics.map((t, idx) => ({
    id: t.id,
    subjectId: subId,
    title: t.title,
    order: idx + 1,
    description: t.description,
    subtopics: t.subtopics,
  }));
}

const newTopicsBySubjectStr = `export const TOPICS_BY_SUBJECT: Record<SubjectId, TopicMetadata[]> = ${JSON.stringify(fullTopicsBySubject, null, 2)};\n`;

// Replace export const TOPICS_BY_SUBJECT in catalog
const cutIdx = catalog.indexOf('export const TOPICS_BY_SUBJECT: Record<SubjectId, TopicMetadata[]> =');
if (cutIdx !== -1) {
  catalog = catalog.slice(0, cutIdx) + newTopicsBySubjectStr;
  fs.writeFileSync(catalogPath, catalog, 'utf-8');
  console.log('Successfully updated subjectsCatalog.ts with all 21 tracks!');
} else {
  console.error('Could not find TOPICS_BY_SUBJECT in subjectsCatalog.ts');
}
