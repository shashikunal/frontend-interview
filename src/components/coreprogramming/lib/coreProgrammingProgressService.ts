// src/components/coreprogramming/lib/coreProgrammingProgressService.ts
import type { CoreProgrammingSubmission, CoreProgrammingQuestion } from '../data/coreProgrammingTypes';

const STORAGE_KEYS = {
  SOLVED: 'core_prog_solved_v1',
  ATTEMPTED: 'core_prog_attempted_v1',
  BOOKMARKS: 'core_prog_bookmarks_v1',
  REVISIT: 'core_prog_revisit_v1',
  NOTES: 'core_prog_notes_v1',
  DRAFTS: 'core_prog_drafts_v1',
  SUBMISSIONS: 'core_prog_submissions_v1',
  STREAK: 'core_prog_streak_v1',
  TIMER: 'core_prog_timer_v1',
  LAST_Q: 'core_prog_last_question_v1',
  HINTS: 'core_prog_hints_v1',
  SOLUTIONS_VIEWED: 'core_prog_solutions_viewed_v1',
  DAILY_PRACTICE: 'core_prog_daily_practice_v1'
} as const;

export type CoreProgrammingQuestionStatus = 'Not Started' | 'In Progress' | 'Attempted' | 'Solved' | 'Revisit';

export interface DailyPracticeSession {
  date: string;
  count: number;
  questionIds: string[];
  completedIds: string[];
}

type Listener = () => void;

class CoreProgrammingProgressService {
  private listeners: Set<Listener> = new Set();

  private safeParse<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private safeSave(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notify();
    } catch (err) {
      console.warn(`Failed to save Core Programming key ${key}:`, err);
    }
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (e) {
        console.error(e);
      }
    });
  }

  // Solved Questions
  getSolvedIds(): Set<string> {
    const list = this.safeParse<string[]>(STORAGE_KEYS.SOLVED, []);
    return new Set(list);
  }

  isSolved(questionId: string): boolean {
    return this.getSolvedIds().has(questionId);
  }

  setSolved(questionId: string, solved: boolean): void {
    const set = this.getSolvedIds();
    if (solved) {
      set.add(questionId);
      this.updateStreak();
    } else {
      set.delete(questionId);
    }
    this.safeSave(STORAGE_KEYS.SOLVED, Array.from(set));
  }

  markSolved(questionId: string): void {
    const set = this.getSolvedIds();
    if (!set.has(questionId)) {
      set.add(questionId);
      this.safeSave(STORAGE_KEYS.SOLVED, Array.from(set));
      this.updateStreak();
    }
  }

  // Attempted Questions
  getAttemptedIds(): Set<string> {
    const list = this.safeParse<string[]>(STORAGE_KEYS.ATTEMPTED, []);
    return new Set(list);
  }

  isAttempted(questionId: string): boolean {
    return this.getAttemptedIds().has(questionId);
  }

  markAttempted(questionId: string): void {
    const set = this.getAttemptedIds();
    if (!set.has(questionId)) {
      set.add(questionId);
      this.safeSave(STORAGE_KEYS.ATTEMPTED, Array.from(set));
    }
  }

  // Bookmarks
  getBookmarkedIds(): Set<string> {
    const list = this.safeParse<string[]>(STORAGE_KEYS.BOOKMARKS, []);
    return new Set(list);
  }

  isBookmarked(questionId: string): boolean {
    return this.getBookmarkedIds().has(questionId);
  }

  toggleBookmark(questionId: string): boolean {
    const set = this.getBookmarkedIds();
    const willBookmark = !set.has(questionId);
    if (willBookmark) {
      set.add(questionId);
    } else {
      set.delete(questionId);
    }
    this.safeSave(STORAGE_KEYS.BOOKMARKS, Array.from(set));
    return willBookmark;
  }

  // Revisit
  getRevisitIds(): Set<string> {
    const list = this.safeParse<string[]>(STORAGE_KEYS.REVISIT, []);
    return new Set(list);
  }

  isRevisit(questionId: string): boolean {
    return this.getRevisitIds().has(questionId);
  }

  toggleRevisit(questionId: string): boolean {
    const set = this.getRevisitIds();
    const willRevisit = !set.has(questionId);
    if (willRevisit) {
      set.add(questionId);
    } else {
      set.delete(questionId);
    }
    this.safeSave(STORAGE_KEYS.REVISIT, Array.from(set));
    return willRevisit;
  }

  // Overall Question Status
  getQuestionStatus(questionId: string): CoreProgrammingQuestionStatus {
    if (this.isRevisit(questionId)) return 'Revisit';
    if (this.getSolvedIds().has(questionId)) return 'Solved';
    if (this.getAttemptedIds().has(questionId)) return 'Attempted';
    if (this.getDraft(questionId)) return 'In Progress';
    return 'Not Started';
  }

  // Notes
  getNotes(): Record<string, string> {
    return this.safeParse<Record<string, string>>(STORAGE_KEYS.NOTES, {});
  }

  getNote(questionId: string): string {
    const notes = this.getNotes();
    return notes[questionId] || '';
  }

  saveNote(questionId: string, content: string): void {
    const notes = this.getNotes();
    notes[questionId] = content;
    this.safeSave(STORAGE_KEYS.NOTES, notes);
  }

  // Code Draft Autosave
  getDraft(questionId: string): string | null {
    const drafts = this.safeParse<Record<string, string>>(STORAGE_KEYS.DRAFTS, {})
    return drafts[questionId] ?? null;
  }

  saveDraft(questionId: string, code: string): void {
    const drafts = this.safeParse<Record<string, string>>(STORAGE_KEYS.DRAFTS, {});
    drafts[questionId] = code;
    this.safeSave(STORAGE_KEYS.DRAFTS, drafts);
  }

  // Submissions
  getSubmissions(questionId?: string): CoreProgrammingSubmission[] {
    const all = this.safeParse<CoreProgrammingSubmission[]>(STORAGE_KEYS.SUBMISSIONS, []);
    if (questionId) {
      return all.filter(s => s.questionId === questionId);
    }
    return all;
  }

  addSubmission(submission: CoreProgrammingSubmission): void {
    const all = this.getSubmissions();
    all.unshift(submission);
    if (all.length > 500) {
      all.length = 500;
    }
    this.safeSave(STORAGE_KEYS.SUBMISSIONS, all);

    if (submission.status === 'Accepted') {
      this.markSolved(submission.questionId);
    } else {
      this.markAttempted(submission.questionId);
    }
  }

  // Timer persistence
  getTimer(questionId: string): { startedAt: number; elapsedSeconds: number } {
    const timers = this.safeParse<Record<string, { startedAt: number; elapsedSeconds: number }>>(
      STORAGE_KEYS.TIMER,
      {}
    );
    return timers[questionId] || { startedAt: Date.now(), elapsedSeconds: 0 };
  }

  saveTimer(questionId: string, elapsedSeconds: number): void {
    const timers = this.safeParse<Record<string, { startedAt: number; elapsedSeconds: number }>>(
      STORAGE_KEYS.TIMER,
      {}
    );
    timers[questionId] = { startedAt: Date.now(), elapsedSeconds };
    this.safeSave(STORAGE_KEYS.TIMER, timers);
  }

  // Last Visited Question
  getLastVisitedQuestion(): string | null {
    return this.safeParse<string | null>(STORAGE_KEYS.LAST_Q, null);
  }

  setLastVisitedQuestion(questionId: string): void {
    this.safeSave(STORAGE_KEYS.LAST_Q, questionId);
  }

  // Hints and Solution Reveal Tracking
  getHintsUsed(questionId: string): number {
    const hints = this.safeParse<Record<string, number>>(STORAGE_KEYS.HINTS, {});
    return hints[questionId] || 0;
  }

  incrementHintUsed(questionId: string): number {
    const hints = this.safeParse<Record<string, number>>(STORAGE_KEYS.HINTS, {});
    hints[questionId] = (hints[questionId] || 0) + 1;
    this.safeSave(STORAGE_KEYS.HINTS, hints);
    return hints[questionId];
  }

  isSolutionViewed(questionId: string): boolean {
    const viewed = this.safeParse<Record<string, boolean>>(STORAGE_KEYS.SOLUTIONS_VIEWED, {});
    return !!viewed[questionId];
  }

  markSolutionViewed(questionId: string): void {
    const viewed = this.safeParse<Record<string, boolean>>(STORAGE_KEYS.SOLUTIONS_VIEWED, {});
    viewed[questionId] = true;
    this.safeSave(STORAGE_KEYS.SOLUTIONS_VIEWED, viewed);
  }

  // Streak Tracking
  getStreak(): { currentStreak: number; lastSolvedDate: string | null } {
    return this.safeParse(STORAGE_KEYS.STREAK, { currentStreak: 0, lastSolvedDate: null });
  }

  private updateStreak(): void {
    const today = new Date().toISOString().split('T')[0];
    const current = this.getStreak();

    if (current.lastSolvedDate === today) return;

    if (!current.lastSolvedDate) {
      this.safeSave(STORAGE_KEYS.STREAK, { currentStreak: 1, lastSolvedDate: today });
      return;
    }

    const lastDate = new Date(current.lastSolvedDate);
    const nowDate = new Date(today);
    const diffDays = Math.round((nowDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 1) {
      this.safeSave(STORAGE_KEYS.STREAK, { currentStreak: current.currentStreak + 1, lastSolvedDate: today });
    } else if (diffDays > 1) {
      this.safeSave(STORAGE_KEYS.STREAK, { currentStreak: 1, lastSolvedDate: today });
    }
  }

  // Daily Practice Session
  getDailyPracticeSession(): DailyPracticeSession | null {
    const session = this.safeParse<DailyPracticeSession | null>(STORAGE_KEYS.DAILY_PRACTICE, null);
    const today = new Date().toISOString().split('T')[0];
    if (session && session.date === today) {
      return session;
    }
    return null;
  }

  startDailyPracticeSession(count: number, questions: CoreProgrammingQuestion[]): DailyPracticeSession {
    const today = new Date().toISOString().split('T')[0];
    const solved = this.getSolvedIds();
    const unsolved = questions.filter(q => !solved.has(q.id));
    const pool = unsolved.length >= count ? unsolved : questions;

    // Deterministic random shuffle based on date seed
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count).map(q => q.id);

    const session: DailyPracticeSession = {
      date: today,
      count,
      questionIds: selected,
      completedIds: []
    };

    this.safeSave(STORAGE_KEYS.DAILY_PRACTICE, session);
    return session;
  }
}

export const coreProgrammingProgressService = new CoreProgrammingProgressService();
