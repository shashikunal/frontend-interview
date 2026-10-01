import type { MockQuestion, TechnologyTrack, QuestionDifficulty, QuestionType, ExperienceTier } from '../types/questionBank.types';
import { ALL_TECHNOLOGY_TRACKS, MockQuestionSchema } from '../types/questionBank.types';

// Per-track dynamic loaders so the 16-track (~11MB) bank splits into
// on-demand chunks instead of one blocking ai-mock-bank bundle.
// Each questionBank/<track> module must export `<track>_questions`
// (e.g. javascript.ts exports javascript_questions).
const trackLoaders: Record<TechnologyTrack, () => Promise<MockQuestion[]>> = {
  javascript: () => import('./questionBank/javascript').then(m => m.javascript_questions),
  typescript: () => import('./questionBank/typescript').then(m => m.typescript_questions),
  html: () => import('./questionBank/html').then(m => m.html_questions),
  css: () => import('./questionBank/css').then(m => m.css_questions),
  react: () => import('./questionBank/react').then(m => m.react_questions),
  nextjs: () => import('./questionBank/nextjs').then(m => m.nextjs_questions),
  angular: () => import('./questionBank/angular').then(m => m.angular_questions),
  vue: () => import('./questionBank/vue').then(m => m.vue_questions),
  'redux-state': () => import('./questionBank/redux-state').then(m => m.redux_state_questions),
  'web-performance': () => import('./questionBank/web-performance').then(m => m.web_performance_questions),
  'browser-web-apis': () => import('./questionBank/browser-web-apis').then(m => m.browser_web_apis_questions),
  'frontend-security': () => import('./questionBank/frontend-security').then(m => m.frontend_security_questions),
  accessibility: () => import('./questionBank/accessibility').then(m => m.accessibility_questions),
  testing: () => import('./questionBank/testing').then(m => m.testing_questions),
  'frontend-architecture': () => import('./questionBank/frontend-architecture').then(m => m.frontend_architecture_questions),
  communication: () => import('./questionBank/communication').then(m => m.communication_questions),
};

// Sync cache populated on demand. Kept as the same exported reference so
// existing sync readers (blueprint/engine) see updates after preload.
export const TRACK_QUESTIONS_MAP: Record<TechnologyTrack, MockQuestion[]> = {
  javascript: [],
  typescript: [],
  html: [],
  css: [],
  react: [],
  nextjs: [],
  angular: [],
  vue: [],
  'redux-state': [],
  'web-performance': [],
  'browser-web-apis': [],
  'frontend-security': [],
  accessibility: [],
  testing: [],
  'frontend-architecture': [],
  communication: [],
};

const loadedTracks = new Set<TechnologyTrack>();
const loadPromises = new Map<TechnologyTrack, Promise<MockQuestion[]>>();

export const mockQuestionByIdMap = new Map<string, MockQuestion>();

function indexQuestions(list: MockQuestion[]): void {
  for (const q of list) {
    mockQuestionByIdMap.set(q.id, q);
    mockQuestionByIdMap.set(q.id.toLowerCase(), q);
    mockQuestionByIdMap.set(q.id.toUpperCase(), q);
  }
}

export function isTrackLoaded(track: TechnologyTrack): boolean {
  return loadedTracks.has(track);
}

/** Sync read of the cache (empty until ensureTrackLoaded resolves). */
export function getTrackQuestions(track: TechnologyTrack): MockQuestion[] {
  return TRACK_QUESTIONS_MAP[track] || TRACK_QUESTIONS_MAP.javascript || [];
}

// Unified flat list over loaded tracks only (async callers: await ensureAllTracksLoaded() first).
export const ALL_MOCK_QUESTIONS: MockQuestion[] = [];

function refreshAllList(): void {
  ALL_MOCK_QUESTIONS.length = 0;
  for (const track of Object.keys(trackLoaders) as TechnologyTrack[]) {
    ALL_MOCK_QUESTIONS.push(...TRACK_QUESTIONS_MAP[track]);
  }
}

export function ensureTrackLoaded(track: TechnologyTrack): Promise<MockQuestion[]> {
  if (loadedTracks.has(track)) return Promise.resolve(TRACK_QUESTIONS_MAP[track]);
  const pending = loadPromises.get(track);
  if (pending) return pending;
  const loader = trackLoaders[track] || trackLoaders.javascript;
  const p = loader().then(list => {
    TRACK_QUESTIONS_MAP[track] = list;
    indexQuestions(list);
    loadedTracks.add(track);
    loadPromises.delete(track);
    refreshAllList();
    return list;
  });
  loadPromises.set(track, p);
  return p;
}

export async function ensureTracksLoaded(tracks: TechnologyTrack[]): Promise<void> {
  await Promise.all(tracks.map(t => ensureTrackLoaded(t)));
}

export async function ensureAllTracksLoaded(): Promise<void> {
  await Promise.all((Object.keys(trackLoaders) as TechnologyTrack[]).map(t => ensureTrackLoaded(t)));
}

export function getMockQuestionById(id: string): MockQuestion | undefined {
  if (!id) return undefined;
  return mockQuestionByIdMap.get(id) || mockQuestionByIdMap.get(id.toLowerCase()) || mockQuestionByIdMap.get(id.toUpperCase());
}

export function registerDynamicMockQuestion(q: MockQuestion): void {
  mockQuestionByIdMap.set(q.id, q);
  mockQuestionByIdMap.set(q.id.toLowerCase(), q);
  mockQuestionByIdMap.set(q.id.toUpperCase(), q);
}

export interface QuestionFilterCriteria {
  technology?: TechnologyTrack;
  difficulty?: QuestionDifficulty | 'All';
  questionType?: QuestionType | 'All';
  searchQuery?: string;
  experienceLevel?: ExperienceTier;
  topic?: string;
}

export function filterMockQuestions(criteria: QuestionFilterCriteria): MockQuestion[] {
  let list = criteria.technology ? (TRACK_QUESTIONS_MAP[criteria.technology] || []) : ALL_MOCK_QUESTIONS;

  if (criteria.difficulty && criteria.difficulty !== 'All') {
    list = list.filter(q => q.difficulty === criteria.difficulty);
  }

  if (criteria.questionType && criteria.questionType !== 'All') {
    list = list.filter(q => q.questionType === criteria.questionType);
  }

  if (criteria.experienceLevel) {
    list = list.filter(q => q.experienceLevels.includes(criteria.experienceLevel!));
  }

  if (criteria.topic) {
    list = list.filter(q => q.topic.toLowerCase() === criteria.topic!.toLowerCase());
  }

  if (criteria.searchQuery && criteria.searchQuery.trim()) {
    const qLower = criteria.searchQuery.toLowerCase().trim();
    list = list.filter(q =>
      q.id.toLowerCase().includes(qLower) ||
      q.question.toLowerCase().includes(qLower) ||
      q.topic.toLowerCase().includes(qLower) ||
      q.subtopic.toLowerCase().includes(qLower) ||
      q.expectedConcepts.some(c => c.toLowerCase().includes(qLower)) ||
      q.tags.some(t => t.toLowerCase().includes(qLower))
    );
  }

  return list;
}

export interface TrackAuditReport {
  trackId: TechnologyTrack;
  name: string;
  icon: string;
  totalQuestions: number;
  approvedQuestions: number;
  publishedQuestions: number;
  validQuestions: number;
  exactDuplicates: number;
  semanticDuplicates: number;
  invalidQuestions: number;
  basicCount: number;
  intermediateCount: number;
  advancedCount: number;
  expertCount: number;
  requirementPass: boolean; // >= 300 approved
}

export function runQuestionBankAudit(): {
  overallPass: boolean;
  totalQuestionsAcrossAllTracks: number;
  trackReports: TrackAuditReport[];
} {
  const trackReports: TrackAuditReport[] = [];
  let overallPass = true;
  let totalCount = 0;

  for (const track of ALL_TECHNOLOGY_TRACKS) {
    const questions = TRACK_QUESTIONS_MAP[track.id] || [];
    totalCount += questions.length;

    let validCount = 0;
    let invalidCount = 0;
    const seenTexts = new Set<string>();
    let exactDuplicates = 0;
    let semanticDuplicates = 0;

    let basic = 0;
    let inter = 0;
    let adv = 0;
    let exp = 0;

    for (const q of questions) {
      // Validate schema
      const val = MockQuestionSchema.safeParse(q);
      if (val.success) {
        validCount++;
      } else {
        invalidCount++;
      }

      // Exact normalized text duplicate check
      const normalized = q.question.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (seenTexts.has(normalized)) {
        exactDuplicates++;
      } else {
        seenTexts.add(normalized);
      }

      if (q.difficulty === 'Basic') basic++;
      else if (q.difficulty === 'Intermediate') inter++;
      else if (q.difficulty === 'Advanced') adv++;
      else if (q.difficulty === 'Expert') exp++;
    }

    const approvedCount = questions.filter(q => q.status === 'APPROVED' || q.status === 'PUBLISHED').length;
    const isPass = approvedCount >= 300 && exactDuplicates === 0 && invalidCount === 0;

    if (!isPass) {
      overallPass = false;
    }

    trackReports.push({
      trackId: track.id,
      name: track.label,
      icon: track.icon,
      totalQuestions: questions.length,
      approvedQuestions: approvedCount,
      publishedQuestions: questions.filter(q => q.status === 'PUBLISHED').length,
      validQuestions: validCount,
      exactDuplicates,
      semanticDuplicates,
      invalidQuestions: invalidCount,
      basicCount: basic,
      intermediateCount: inter,
      advancedCount: adv,
      expertCount: exp,
      requirementPass: isPass,
    });
  }

  return {
    overallPass,
    totalQuestionsAcrossAllTracks: totalCount,
    trackReports,
  };
}

export function getAllMockQuestions(): MockQuestion[] {
  return ALL_MOCK_QUESTIONS;
}

export function getQuestionBankAuditMetrics() {
  const audit = runQuestionBankAudit();
  return {
    totalQuestions: audit.totalQuestionsAcrossAllTracks,
    overallPass: audit.overallPass,
    trackReports: audit.trackReports,
  };
}

