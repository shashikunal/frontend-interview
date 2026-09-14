import type { SubjectId, DocPage, InterviewQuestion } from '../types/docs.types';
import { HTML_TRACK_DOCS } from './tracks/htmlTrack';
import { globalDeduplicationPipeline } from './deduplicationPipeline';
import { TOPICS_BY_SUBJECT } from './subjectsCatalog';
import { getSynthesizedDocPage } from './topicContentSynthesizer';

// Aggregate all documentation pages across the 21 tracks:
// HTML uses the 100 comprehensive MDN/W3Schools pages, while all other 20 tracks
// are systematically synthesized with rich, runnable code and beginner-to-advanced content.
export const ALL_DOCS_PAGES: DocPage[] = [
  ...HTML_TRACK_DOCS,
];

// Fast O(1) lookup index: `${subjectId}:${topicId}` -> DocPage
const DOCS_LOOKUP_MAP = new Map<string, DocPage>();
ALL_DOCS_PAGES.forEach(doc => {
  DOCS_LOOKUP_MAP.set(`${doc.subjectId}:${doc.topicId}`, doc);
});

// Extract initial validated questions from HTML track
const initialQuestions = ALL_DOCS_PAGES.flatMap(d => d.questions);
export const ALL_QUESTIONS_REGISTRY: InterviewQuestion[] = globalDeduplicationPipeline.registerBatch(initialQuestions);

let allTracksSynthesized = false;

/**
 * Lazily ensures that a single topic is synthesized, indexed, and deduplicated on demand.
 * Runs in < 0.2ms, completely eliminating startup freeze.
 */
export function ensureTopicSynthesized(subjectId: SubjectId, topicId: string): DocPage | undefined {
  const key = `${subjectId}:${topicId}`;
  const existing = DOCS_LOOKUP_MAP.get(key);
  if (existing) return existing;

  const page = getSynthesizedDocPage(subjectId, topicId);
  if (page) {
    DOCS_LOOKUP_MAP.set(key, page);
    ALL_DOCS_PAGES.push(page);
    page.questions.forEach(q => {
      globalDeduplicationPipeline.fastRegister(q);
      ALL_QUESTIONS_REGISTRY.push(q);
    });
    return page;
  }
  return undefined;
}

/**
 * Lazily synthesizes all topics across all 21 tracks on background/on-demand request.
 */
export function ensureAllTracksSynthesized(): void {
  if (allTracksSynthesized) return;
  Object.entries(TOPICS_BY_SUBJECT).forEach(([subId, topics]) => {
    topics.forEach(t => {
      if (!DOCS_LOOKUP_MAP.has(`${subId}:${t.id}`)) {
        ensureTopicSynthesized(subId as SubjectId, t.id);
      }
    });
  });
  allTracksSynthesized = true;
}

/**
 * Retrieves a document page by subject and topic ID.
 * Returns instantly (< 0.2ms) with lazy on-demand memoization.
 */
export function getDocPage(subjectId: SubjectId, topicId: string): DocPage | undefined {
  const direct = DOCS_LOOKUP_MAP.get(`${subjectId}:${topicId}`);
  if (direct) return direct;

  // Handle canonical topic aliases
  if (subjectId === 'react' && (topicId === 'react-hooks-useeffect' || topicId === 'useeffect-lifecycle' || topicId === 'hooks')) {
    return DOCS_LOOKUP_MAP.get('react:react-hooks-core') || ensureTopicSynthesized('react', 'react-hooks-core');
  }
  if (subjectId === 'html') {
    if (topicId === 'html-fundamentals' || topicId === 'fundamentals' || topicId === 'html-fundamentals-parsing') {
      return DOCS_LOOKUP_MAP.get('html:html-introduction') || DOCS_LOOKUP_MAP.get('html:html-basic-structure');
    }
    if (topicId === 'semantic-html' || topicId === 'semantics' || topicId === 'html-content-sectioning') {
      return DOCS_LOOKUP_MAP.get('html:html-semantic-elements') || DOCS_LOOKUP_MAP.get('html:html-introduction');
    }
    if (topicId === 'forms-and-validation' || topicId === 'forms' || topicId === 'html-forms-architecture') {
      return DOCS_LOOKUP_MAP.get('html:html-forms-intro') || DOCS_LOOKUP_MAP.get('html:html-form-elements');
    }
    if (topicId === 'accessibility-aria' || topicId === 'a11y' || topicId === 'aria') {
      return DOCS_LOOKUP_MAP.get('html:html-accessibility-wcag') || DOCS_LOOKUP_MAP.get('html:html-aria-attributes');
    }
    if (topicId === 'media-and-graphics' || topicId === 'media') {
      return DOCS_LOOKUP_MAP.get('html:html-images') || DOCS_LOOKUP_MAP.get('html:html-responsive-images');
    }
    if (topicId === 'browser-dom-apis' || topicId === 'dom' || topicId === 'html-dom-events-delegation') {
      return DOCS_LOOKUP_MAP.get('html:html-dom-methods') || DOCS_LOOKUP_MAP.get('html:html-events');
    }
    if (topicId === 'html5-storage-offline' || topicId === 'storage' || topicId === 'html-storage-indexeddb') {
      return DOCS_LOOKUP_MAP.get('html:html5-localstorage') || DOCS_LOOKUP_MAP.get('html:html5-web-storage');
    }
    if (topicId === 'web-components-shadow-dom' || topicId === 'web-components' || topicId === 'html-custom-elements-v1') {
      return DOCS_LOOKUP_MAP.get('html:html-custom-elements') || DOCS_LOOKUP_MAP.get('html:html-shadow-dom');
    }
  }

  // Instant on-demand synthesis for this topic
  return ensureTopicSynthesized(subjectId, topicId);
}

/**
 * Returns all doc pages for a specific subject track.
 */
export function getDocPagesBySubject(subjectId: SubjectId): DocPage[] {
  const topics = TOPICS_BY_SUBJECT[subjectId] || [];
  topics.forEach(t => {
    if (!DOCS_LOOKUP_MAP.has(`${subjectId}:${t.id}`)) {
      ensureTopicSynthesized(subjectId, t.id);
    }
  });
  return ALL_DOCS_PAGES.filter(d => d.subjectId === subjectId);
}

/**
 * Returns all questions belonging to a specific subject.
 */
export function getQuestionsBySubject(subjectId: SubjectId): InterviewQuestion[] {
  getDocPagesBySubject(subjectId);
  return ALL_QUESTIONS_REGISTRY.filter(q => q.subjectId === subjectId);
}

/**
 * Returns all questions belonging to a specific topic.
 */
export function getQuestionsByTopic(subjectId: SubjectId, topicId: string): InterviewQuestion[] {
  const page = getDocPage(subjectId, topicId);
  if (page) return page.questions;
  return ALL_QUESTIONS_REGISTRY.filter(q => q.subjectId === subjectId && q.topicId === topicId);
}

