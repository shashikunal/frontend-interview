import type { SubjectId, UserDocsProgress, MasteryState } from '../types/docs.types';
import { ALL_SUBJECTS_CATALOG } from '../data/subjectsCatalog';

const LOCAL_PROGRESS_KEY = 'interview_docs_progress_v1';

function getInitialProgress(): UserDocsProgress {
  const initialSubjectProgress: Record<SubjectId, { topicsRead: number; questionsPracticed: number; masteredCount: number }> = {} as any;
  ALL_SUBJECTS_CATALOG.forEach(s => {
    initialSubjectProgress[s.id] = { topicsRead: 0, questionsPracticed: 0, masteredCount: 0 };
  });

  return {
    completedTopics: [],
    bookmarkedDocs: [],
    bookmarkedQuestions: [],
    questionMastery: {},
    practiceAttemptsCount: 0,
    interviewsCompletedCount: 0,
    subjectProgress: initialSubjectProgress,
  };
}

class DocsProgressService {
  getProgress(): UserDocsProgress {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_PROGRESS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            ...getInitialProgress(),
            ...parsed,
          };
        }
      }
    } catch (_) {}
    return getInitialProgress();
  }

  saveProgress(progress: UserDocsProgress): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(progress));
      }
    } catch (_) {}
  }

  recordTopicVisit(subjectId: SubjectId, topicId: string): void {
    const p = this.getProgress();
    p.lastVisited = {
      subjectId,
      topicId,
      timestamp: Date.now(),
    };
    this.saveProgress(p);
  }

  isTopicCompleted(subjectId: SubjectId, topicId: string): boolean {
    const p = this.getProgress();
    return p.completedTopics.includes(`${subjectId}:${topicId}`);
  }

  toggleTopicCompleted(subjectId: SubjectId, topicId: string): boolean {
    const p = this.getProgress();
    const key = `${subjectId}:${topicId}`;
    const idx = p.completedTopics.indexOf(key);
    let isCompleted = false;

    if (!p.subjectProgress[subjectId]) {
      p.subjectProgress[subjectId] = { topicsRead: 0, questionsPracticed: 0, masteredCount: 0 };
    }

    if (idx >= 0) {
      p.completedTopics.splice(idx, 1);
      p.subjectProgress[subjectId].topicsRead = Math.max(0, p.subjectProgress[subjectId].topicsRead - 1);
      isCompleted = false;
    } else {
      p.completedTopics.push(key);
      p.subjectProgress[subjectId].topicsRead++;
      isCompleted = true;
    }

    this.saveProgress(p);
    return isCompleted;
  }

  toggleDocBookmark(subjectId: SubjectId, topicId: string): boolean {
    const p = this.getProgress();
    const key = `${subjectId}:${topicId}`;
    const idx = p.bookmarkedDocs.indexOf(key);
    let isBookmarked = false;
    if (idx >= 0) {
      p.bookmarkedDocs.splice(idx, 1);
    } else {
      p.bookmarkedDocs.push(key);
      isBookmarked = true;
    }
    this.saveProgress(p);
    return isBookmarked;
  }

  toggleQuestionBookmark(questionId: string): boolean {
    const p = this.getProgress();
    const idx = p.bookmarkedQuestions.indexOf(questionId);
    let isBookmarked = false;
    if (idx >= 0) {
      p.bookmarkedQuestions.splice(idx, 1);
    } else {
      p.bookmarkedQuestions.push(questionId);
      isBookmarked = true;
    }
    this.saveProgress(p);
    return isBookmarked;
  }

  recordQuestionAnswer(subjectId: SubjectId, questionId: string, status: 'knew-it' | 'needs-review' | 'missed'): void {
    const p = this.getProgress();
    p.practiceAttemptsCount++;
    const masteryMap: Record<'knew-it' | 'needs-review' | 'missed', MasteryState> = {
      'knew-it': 'mastered',
      'needs-review': 'needs-review',
      'missed': 'incorrect',
    };
    p.questionMastery[questionId] = masteryMap[status];

    if (!p.subjectProgress[subjectId]) {
      p.subjectProgress[subjectId] = { topicsRead: 0, questionsPracticed: 0, masteredCount: 0 };
    }
    p.subjectProgress[subjectId].questionsPracticed++;
    if (status === 'knew-it') {
      p.subjectProgress[subjectId].masteredCount++;
    }

    this.saveProgress(p);
  }

  recordInterviewCompleted(): void {
    const p = this.getProgress();
    p.interviewsCompletedCount++;
    this.saveProgress(p);
  }

  calculateOverallReadiness(): { overallScore: number; trackScores: Record<SubjectId, number> } {
    const p = this.getProgress();
    const trackScores: Record<SubjectId, number> = {} as any;
    let totalScoreSum = 0;

    ALL_SUBJECTS_CATALOG.forEach(s => {
      const sp = p.subjectProgress[s.id] || { topicsRead: 0, questionsPracticed: 0, masteredCount: 0 };
      const topicsWeight = Math.min(100, Math.round((sp.topicsRead / Math.max(1, s.totalTopicsCount)) * 50));
      const questionsWeight = Math.min(50, sp.masteredCount * 10);
      const trackScore = Math.min(100, topicsWeight + questionsWeight);
      trackScores[s.id] = trackScore;
      totalScoreSum += trackScore;
    });

    const overallScore = Math.round(totalScoreSum / ALL_SUBJECTS_CATALOG.length);
    return { overallScore, trackScores };
  }
}

export const docsProgressService = new DocsProgressService();
