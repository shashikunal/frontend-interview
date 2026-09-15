import type { SubjectId, UserDocsProgress, MasteryState } from '../types/docs.types';
import { ALL_SUBJECTS_CATALOG, TOPICS_BY_SUBJECT } from '../data/subjectsCatalog';
import type { AuthUserProfile } from '../../auth/types/auth.types';

const LOCAL_PROGRESS_KEY = 'interview_docs_progress_v1';
const ALL_CANDIDATES_DOCS_KEY = 'all_candidates_docs_progress_v1';

export interface SyllabusTrackProgress {
  subjectId: SubjectId;
  title: string;
  icon: string;
  category: string;
  badge: string;
  completedTopicsCount: number;
  totalTopicsCount: number;
  completionPercentage: number;
  masteredCount: number;
  questionsPracticed: number;
  readinessScore: number;
}

export interface SyllabusOverallStats {
  totalCompletedTopics: number;
  totalSyllabusTopics: number;
  completionPercentage: number;
  activeTracksCount: number;
  totalTracksCount: number;
  bookmarkedCount: number;
  bookmarkedTopicsCount: number;
  bookmarkedQuestionsCount: number;
  trackBreakdown: SyllabusTrackProgress[];
  recentCompletedTopics: Array<{
    key: string;
    subjectId: SubjectId;
    topicId: string;
    subjectTitle: string;
    topicTitle: string;
  }>;
  lastVisited?: {
    subjectId: SubjectId;
    topicId: string;
    subjectTitle: string;
    topicTitle: string;
    timestamp: number;
  };
}

export interface CandidateDocsSummary {
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  totalCompletedTopics: number;
  totalSyllabusTopics: number;
  completionPercentage: number;
  activeTracksCount: number;
  topTrackName: string;
  topTrackCompleted: number;
  bookmarkedCount: number;
  lastVisited?: {
    subjectId: SubjectId;
    topicId: string;
    subjectTitle: string;
    topicTitle: string;
    timestamp: number;
  };
  lastUpdated: string;
  trackBreakdown: SyllabusTrackProgress[];
  completedTopicTitles: string[];
}

export interface PlatformDocsMetrics {
  totalTopicsCompletedAcrossPlatform: number;
  averageCandidateCompletionPct: number;
  activeLearnersCount: number;
  mostStudiedTrack: string;
  totalRegisteredCandidates: number;
}

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
  private userId: string = 'guest';

  constructor() {
    try {
      if (typeof localStorage !== 'undefined') {
        const storedProfile = localStorage.getItem('interviewprep_active_profile');
        if (storedProfile) {
          const parsed = JSON.parse(storedProfile);
          if (parsed?.id) {
            this.userId = parsed.id;
          }
        }
      }
    } catch {
      // ignore
    }
  }

  public setUserId(id?: string | null): void {
    const newId = id || 'guest';
    if (this.userId !== newId) {
      this.userId = newId;
      // Seamless migration: if guest had progress and new user progress is empty, initialize with guest progress
      if (newId !== 'guest' && typeof localStorage !== 'undefined') {
        const userKey = this.getKey();
        const userExisting = localStorage.getItem(userKey);
        if (!userExisting) {
          const guestRaw = localStorage.getItem(LOCAL_PROGRESS_KEY);
          if (guestRaw) {
            localStorage.setItem(userKey, guestRaw);
          }
        }
      }
      this.notifyListeners();
    }
  }

  public getUserId(): string {
    return this.userId;
  }

  private getKey(): string {
    return this.userId === 'guest' ? LOCAL_PROGRESS_KEY : `${LOCAL_PROGRESS_KEY}_${this.userId}`;
  }

  private notifyListeners(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('docs_progress_updated'));
    }
  }

  getProgress(): UserDocsProgress {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(this.getKey());
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            ...getInitialProgress(),
            ...parsed,
          };
        }
        // Fallback to guest progress if user progress not yet separate
        const fallbackRaw = localStorage.getItem(LOCAL_PROGRESS_KEY);
        if (fallbackRaw) {
          const parsedFallback = JSON.parse(fallbackRaw);
          return {
            ...getInitialProgress(),
            ...parsedFallback,
          };
        }
      }
    } catch (_) {}
    return getInitialProgress();
  }

  saveProgress(progress: UserDocsProgress): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const key = this.getKey();
        localStorage.setItem(key, JSON.stringify(progress));
        // Also mirror to global LOCAL_PROGRESS_KEY for immediate fallback
        if (this.userId === 'guest') {
          localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(progress));
        }

        // Mirror to multi-candidate registry for administrator audits
        const candidatesRaw = localStorage.getItem(ALL_CANDIDATES_DOCS_KEY);
        const map: Record<string, { progress: UserDocsProgress; lastUpdated: string }> = candidatesRaw ? JSON.parse(candidatesRaw) : {};
        map[this.userId] = {
          progress,
          lastUpdated: new Date().toISOString(),
        };
        localStorage.setItem(ALL_CANDIDATES_DOCS_KEY, JSON.stringify(map));
      }
    } catch (_) {}
    this.notifyListeners();
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

  isDocBookmarked(subjectId: SubjectId, topicId: string): boolean {
    const p = this.getProgress();
    return (p.bookmarkedDocs || []).includes(`${subjectId}:${topicId}`);
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

  isQuestionBookmarked(questionId: string): boolean {
    const p = this.getProgress();
    return (p.bookmarkedQuestions || []).includes(questionId);
  }

  getBookmarkedDocKeys(): string[] {
    return this.getProgress().bookmarkedDocs || [];
  }

  getBookmarkedQuestionIds(): string[] {
    return this.getProgress().bookmarkedQuestions || [];
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

  calculateOverallReadiness(customProgress?: UserDocsProgress): { overallScore: number; trackScores: Record<SubjectId, number> } {
    const p = customProgress || this.getProgress();
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

  /**
   * Returns comprehensive syllabus statistics for a given user progress object
   */
  getSyllabusStats(customProgress?: UserDocsProgress): SyllabusOverallStats {
    const p = customProgress || this.getProgress();
    const { trackScores } = this.calculateOverallReadiness(p);

    let totalSyllabusTopics = 0;
    let activeTracksCount = 0;

    const trackBreakdown: SyllabusTrackProgress[] = ALL_SUBJECTS_CATALOG.map(s => {
      const totalTopics = s.totalTopicsCount || 0;
      totalSyllabusTopics += totalTopics;

      const sp = p.subjectProgress[s.id] || { topicsRead: 0, questionsPracticed: 0, masteredCount: 0 };
      // Count topics completed for this subject
      const completedForSubject = p.completedTopics.filter(k => k.startsWith(`${s.id}:`)).length;
      const count = Math.max(completedForSubject, sp.topicsRead);

      if (count > 0) activeTracksCount++;

      const pct = totalTopics > 0 ? Math.min(100, Math.round((count / totalTopics) * 100)) : 0;

      return {
        subjectId: s.id,
        title: s.title,
        icon: s.icon,
        category: s.category,
        badge: s.badge,
        completedTopicsCount: count,
        totalTopicsCount: totalTopics,
        completionPercentage: pct,
        masteredCount: sp.masteredCount || 0,
        questionsPracticed: sp.questionsPracticed || 0,
        readinessScore: trackScores[s.id] || 0,
      };
    });

    const totalCompletedTopics = p.completedTopics.length;
    const completionPercentage = totalSyllabusTopics > 0 ? Math.min(100, Math.round((totalCompletedTopics / totalSyllabusTopics) * 100)) : 0;

    // Resolve human-readable topic titles for completed topics
    const recentCompletedTopics = p.completedTopics.slice(-10).reverse().map(key => {
      const [sId, tId] = key.split(':') as [SubjectId, string];
      const subject = ALL_SUBJECTS_CATALOG.find(s => s.id === sId);
      const topicsList = TOPICS_BY_SUBJECT[sId] || [];
      const topic = topicsList.find(t => t.id === tId);

      return {
        key,
        subjectId: sId,
        topicId: tId,
        subjectTitle: subject?.title || sId,
        topicTitle: topic?.title || tId.replace(/-/g, ' '),
      };
    });

    let lastVisited: SyllabusOverallStats['lastVisited'] = undefined;
    if (p.lastVisited) {
      const sId = p.lastVisited.subjectId;
      const tId = p.lastVisited.topicId;
      const subject = ALL_SUBJECTS_CATALOG.find(s => s.id === sId);
      const topicsList = TOPICS_BY_SUBJECT[sId] || [];
      const topic = topicsList.find(t => t.id === tId);

      lastVisited = {
        subjectId: sId,
        topicId: tId,
        subjectTitle: subject?.title || sId,
        topicTitle: topic?.title || tId.replace(/-/g, ' '),
        timestamp: p.lastVisited.timestamp,
      };
    }

    return {
      totalCompletedTopics,
      totalSyllabusTopics,
      completionPercentage,
      activeTracksCount,
      totalTracksCount: ALL_SUBJECTS_CATALOG.length,
      bookmarkedCount: p.bookmarkedDocs.length + p.bookmarkedQuestions.length,
      bookmarkedTopicsCount: p.bookmarkedDocs.length,
      bookmarkedQuestionsCount: p.bookmarkedQuestions.length,
      trackBreakdown,
      recentCompletedTopics,
      lastVisited,
    };
  }

  /**
   * Aggregates syllabus progress across all candidates for Administrator Operations
   */
  getAllCandidatesDocsProgress(profiles: AuthUserProfile[]): {
    metrics: PlatformDocsMetrics;
    candidates: CandidateDocsSummary[];
  } {
    let multiMap: Record<string, { progress: UserDocsProgress; lastUpdated: string }> = {};
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(ALL_CANDIDATES_DOCS_KEY);
        if (raw) multiMap = JSON.parse(raw);
      }
    } catch (_) {}

    let totalCompletedAll = 0;
    let totalPctSum = 0;
    let activeLearners = 0;
    const trackStudyCounts: Record<string, number> = {};

    const candidates: CandidateDocsSummary[] = profiles.map(profile => {
      // Find candidate progress from map or individual localStorage key
      let userProg: UserDocsProgress | null = null;
      let lastUpdated = profile.createdAt || new Date().toISOString();

      if (multiMap[profile.id]?.progress) {
        userProg = multiMap[profile.id].progress;
        lastUpdated = multiMap[profile.id].lastUpdated || lastUpdated;
      } else if (typeof localStorage !== 'undefined') {
        const singleRaw = localStorage.getItem(`${LOCAL_PROGRESS_KEY}_${profile.id}`);
        if (singleRaw) {
          try {
            userProg = JSON.parse(singleRaw);
          } catch (_) {}
        }
      }

      // If active current user matches profile, use active progress
      if (!userProg && profile.id === this.userId) {
        userProg = this.getProgress();
      }

      // Fallback to guest progress if only 1 profile or admin testing
      if (!userProg && profile.id === 'guest') {
        userProg = this.getProgress();
      }

      const p = userProg || getInitialProgress();
      const stats = this.getSyllabusStats(p);

      totalCompletedAll += stats.totalCompletedTopics;
      totalPctSum += stats.completionPercentage;
      if (stats.totalCompletedTopics > 0) {
        activeLearners++;
      }

      // Find top track for this candidate
      let topTrackName = 'Not Started';
      let topTrackCompleted = 0;
      stats.trackBreakdown.forEach(t => {
        if (t.completedTopicsCount > topTrackCompleted) {
          topTrackCompleted = t.completedTopicsCount;
          topTrackName = t.title;
        }
        if (t.completedTopicsCount > 0) {
          trackStudyCounts[t.title] = (trackStudyCounts[t.title] || 0) + t.completedTopicsCount;
        }
      });

      const completedTopicTitles = stats.recentCompletedTopics.map(t => `${t.subjectTitle}: ${t.topicTitle}`);

      return {
        userId: profile.id,
        userName: profile.name || profile.email?.split('@')[0] || 'Candidate',
        userEmail: profile.email,
        userRole: profile.role,
        totalCompletedTopics: stats.totalCompletedTopics,
        totalSyllabusTopics: stats.totalSyllabusTopics,
        completionPercentage: stats.completionPercentage,
        activeTracksCount: stats.activeTracksCount,
        topTrackName,
        topTrackCompleted,
        bookmarkedCount: stats.bookmarkedTopicsCount,
        lastVisited: stats.lastVisited,
        lastUpdated,
        trackBreakdown: stats.trackBreakdown,
        completedTopicTitles,
      };
    });

    // Determine platform-wide most studied track
    let mostStudiedTrack = 'Core JavaScript & V8 Engine';
    let maxTrackCount = 0;
    Object.entries(trackStudyCounts).forEach(([title, count]) => {
      if (count > maxTrackCount) {
        maxTrackCount = count;
        mostStudiedTrack = title;
      }
    });

    const candidateCount = Math.max(1, candidates.length);
    const averageCandidateCompletionPct = Math.round(totalPctSum / candidateCount);

    const metrics: PlatformDocsMetrics = {
      totalTopicsCompletedAcrossPlatform: totalCompletedAll,
      averageCandidateCompletionPct,
      activeLearnersCount: activeLearners,
      mostStudiedTrack,
      totalRegisteredCandidates: profiles.length,
    };

    return { metrics, candidates };
  }
}

export const docsProgressService = new DocsProgressService();
