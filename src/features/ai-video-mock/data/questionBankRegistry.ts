import type { MockQuestion, TechnologyTrack, QuestionDifficulty, QuestionType, ExperienceTier } from '../types/questionBank.types';
import { ALL_TECHNOLOGY_TRACKS, MockQuestionSchema } from '../types/questionBank.types';

import { javascript_questions } from './questionBank/javascript';
import { typescript_questions } from './questionBank/typescript';
import { html_questions } from './questionBank/html';
import { css_questions } from './questionBank/css';
import { react_questions } from './questionBank/react';
import { nextjs_questions } from './questionBank/nextjs';
import { angular_questions } from './questionBank/angular';
import { vue_questions } from './questionBank/vue';
import { redux_state_questions } from './questionBank/redux-state';
import { web_performance_questions } from './questionBank/web-performance';
import { browser_web_apis_questions } from './questionBank/browser-web-apis';
import { frontend_security_questions } from './questionBank/frontend-security';
import { accessibility_questions } from './questionBank/accessibility';
import { testing_questions } from './questionBank/testing';
import { frontend_architecture_questions } from './questionBank/frontend-architecture';
import { communication_questions } from './questionBank/communication';

export const TRACK_QUESTIONS_MAP: Record<TechnologyTrack, MockQuestion[]> = {
  javascript: javascript_questions,
  typescript: typescript_questions,
  html: html_questions,
  css: css_questions,
  react: react_questions,
  nextjs: nextjs_questions,
  angular: angular_questions,
  vue: vue_questions,
  'redux-state': redux_state_questions,
  'web-performance': web_performance_questions,
  'browser-web-apis': browser_web_apis_questions,
  'frontend-security': frontend_security_questions,
  accessibility: accessibility_questions,
  testing: testing_questions,
  'frontend-architecture': frontend_architecture_questions,
  communication: communication_questions,
};

// Unified flat list and O(1) Map
export const ALL_MOCK_QUESTIONS: MockQuestion[] = Object.values(TRACK_QUESTIONS_MAP).flat();

export const mockQuestionByIdMap = new Map<string, MockQuestion>();
for (const q of ALL_MOCK_QUESTIONS) {
  mockQuestionByIdMap.set(q.id, q);
}

export function getMockQuestionById(id: string): MockQuestion | undefined {
  if (!id) return undefined;
  return mockQuestionByIdMap.get(id) || mockQuestionByIdMap.get(id.toUpperCase());
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

