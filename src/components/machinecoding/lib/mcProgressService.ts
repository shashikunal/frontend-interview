/**
 * Machine Coding Progress, Notes & Bookmark Service
 * Scoped by authenticated user to guarantee Candidate Isolation (Section 21).
 * Completely decoupled from DSA progress service (Section 2).
 */

type Listener = () => void;

export interface MCActivityItem {
  id: string;
  type: 'attempt' | 'solve';
  timestamp: number;
}

class MCProgressService {
  private userId: string = 'guest';
  private listeners: Set<Listener> = new Set();

  constructor() {
    // Attempt to read current active user from auth storage if available
    try {
      const storedProfile = typeof localStorage !== 'undefined' ? localStorage.getItem('interviewprep_active_profile') : null;
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        if (parsed?.id) {
          this.userId = parsed.id;
          return;
        }
      }
      const storedAuth = typeof localStorage !== 'undefined' ? (localStorage.getItem('supabase.auth.token') || localStorage.getItem('sb-auth-token')) : null;
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        if (parsed?.user?.id) {
          this.userId = parsed.user.id;
        }
      }
    } catch {
      // Ignore
    }
  }

  public setUserId(id?: string | null): void {
    const newId = id || 'guest';
    if (this.userId !== newId) {
      this.userId = newId;
      this.notify();
    }
  }

  public getUserId(): string {
    return this.userId;
  }

  private getKey(prefix: string): string {
    return this.userId === 'guest' ? `${prefix}_v1` : `${prefix}_v1_${this.userId}`;
  }

  private safeParse<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        return fallback;
      }
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  private safeSave(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Also mirror to legacy key if guest so existing tests and tabs continue to work seamlessly
      if (this.userId === 'guest') {
        // Already legacy format
      }
      this.notify();
    } catch (err) {
      console.warn(`[MCProgressService] Failed to save ${key}:`, err);
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (err) {
        console.error('[MCProgressService] Listener error:', err);
      }
    });
  }

  // --- SOLVED ---
  public getSolvedIds(): Set<string> {
    const raw = this.safeParse<any>(this.getKey('mc_solved'), []);
    if (Array.isArray(raw)) return new Set(raw);
    if (raw && typeof raw === 'object') {
      return new Set(Object.keys(raw).filter(k => !!raw[k]));
    }
    return new Set();
  }

  public isSolved(questionId: string): boolean {
    return this.getSolvedIds().has(questionId);
  }

  public markSolved(questionId: string): void {
    const set = this.getSolvedIds();
    if (!set.has(questionId)) {
      set.add(questionId);
      this.safeSave(this.getKey('mc_solved'), Array.from(set));
      this.recordActivity(questionId, 'solve');
    }
  }

  public unmarkSolved(questionId: string): void {
    const set = this.getSolvedIds();
    if (set.has(questionId)) {
      set.delete(questionId);
      this.safeSave(this.getKey('mc_solved'), Array.from(set));
    }
  }

  // --- ATTEMPTED ---
  public getAttemptedIds(): Set<string> {
    const raw = this.safeParse<any>(this.getKey('mc_attempted'), []);
    if (Array.isArray(raw)) return new Set(raw);
    if (raw && typeof raw === 'object') {
      return new Set(Object.keys(raw).filter(k => !!raw[k]));
    }
    return new Set();
  }

  public isAttempted(questionId: string): boolean {
    return this.getAttemptedIds().has(questionId);
  }

  public markAttempted(questionId: string): void {
    const set = this.getAttemptedIds();
    if (!set.has(questionId)) {
      set.add(questionId);
      this.safeSave(this.getKey('mc_attempted'), Array.from(set));
      this.recordActivity(questionId, 'attempt');
    }
  }

  // --- BOOKMARKS ---
  public getBookmarkedIds(): Set<string> {
    const raw = this.safeParse<any>(this.getKey('mc_bookmarks'), []);
    if (Array.isArray(raw)) return new Set(raw);
    if (raw && typeof raw === 'object') {
      return new Set(Object.keys(raw).filter(k => !!raw[k]));
    }
    return new Set();
  }

  public isBookmarked(questionId: string): boolean {
    return this.getBookmarkedIds().has(questionId);
  }

  public toggleBookmark(questionId: string): boolean {
    const set = this.getBookmarkedIds();
    const willBookmark = !set.has(questionId);
    if (willBookmark) {
      set.add(questionId);
    } else {
      set.delete(questionId);
    }
    this.safeSave(this.getKey('mc_bookmarks'), Array.from(set));
    return willBookmark;
  }

  // --- NOTES (User + Question Scoped) ---
  public getAllNotes(): Record<string, string> {
    return this.safeParse<Record<string, string>>(this.getKey('mc_notes'), {});
  }

  public getNote(questionId: string): string {
    const notes = this.getAllNotes();
    return notes[questionId] || '';
  }

  public saveNote(questionId: string, text: string): void {
    const notes = this.getAllNotes();
    if (text.trim()) {
      notes[questionId] = text;
    } else {
      delete notes[questionId];
    }
    this.safeSave(this.getKey('mc_notes'), notes);
  }

  public deleteNote(questionId: string): void {
    const notes = this.getAllNotes();
    if (notes[questionId]) {
      delete notes[questionId];
      this.safeSave(this.getKey('mc_notes'), notes);
    }
  }

  // --- RECENT ACTIVITY ---
  public getRecentActivity(): MCActivityItem[] {
    return this.safeParse<MCActivityItem[]>(this.getKey('mc_recent_activity'), []);
  }

  public recordActivity(id: string, type: 'attempt' | 'solve'): void {
    const current = this.getRecentActivity().filter(item => !(item.id === id && item.type === type));
    const next: MCActivityItem[] = [{ id, type, timestamp: Date.now() }, ...current].slice(0, 50);
    this.safeSave(this.getKey('mc_recent_activity'), next);
  }

  // --- STATUS HELPER ---
  public getStatus(questionId: string): 'Not Started' | 'Attempted' | 'Solved' {
    if (this.isSolved(questionId)) return 'Solved';
    if (this.isAttempted(questionId)) return 'Attempted';
    return 'Not Started';
  }
}

export const mcProgressService = new MCProgressService();
