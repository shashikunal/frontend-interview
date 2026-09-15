import type { SubjectId } from '../types/docs.types';
import { ALL_SUBJECTS_CATALOG, TOPICS_BY_SUBJECT } from '../data/subjectsCatalog';
import { ALL_DOCS_PAGES, ALL_QUESTIONS_REGISTRY } from '../data/docsRegistry';
import { docsProgressService } from './docsProgressService';

export interface SearchResultItem {
  id: string;
  type: 'subject' | 'topic' | 'question' | 'action';
  title: string;
  snippet: string;
  subjectId?: SubjectId;
  subjectTitle?: string;
  topicId?: string;
  badge?: string;
  tags?: string[];
  url: string;
  icon?: string;
  isBookmarked?: boolean;
}

export const QUICK_ACTIONS: SearchResultItem[] = [
  {
    id: 'action_interview',
    type: 'action',
    title: 'AI Mock Interview Studio',
    snippet: 'Real-time interactive AI technical & behavioral mock interview with Ollama evaluation and dynamic scoring.',
    badge: 'STUDIO',
    url: '/docs/interview',
    icon: '🎙️',
    tags: ['interview', 'mock', 'ai', 'ollama', 'practice', 'questions', 'behavioral', 'drills'],
  },
  {
    id: 'action_candidate_tracker',
    type: 'action',
    title: 'Candidate Syllabus Tracker',
    snippet: 'Track completion percentage across all 21 tracks, review completed topics and progress stats with in-route query filters.',
    badge: 'TRACKER',
    url: '/dashboard?tab=docs',
    icon: '📊',
    tags: ['syllabus', 'tracker', 'progress', 'candidate', 'completion', 'dashboard'],
  },
  {
    id: 'action_admin_tracker',
    type: 'action',
    title: 'Admin Syllabus & Candidate Audit',
    snippet: 'Inspect candidate syllabus completions, audit curriculum status and monitor learning metrics.',
    badge: 'ADMIN',
    url: '/admin?tab=docs',
    icon: '🛡️',
    tags: ['admin', 'audit', 'syllabus', 'candidates', 'stats', 'analytics'],
  },
  {
    id: 'action_css_playground',
    type: 'action',
    title: 'CSS & HTML Interactive Playground',
    snippet: 'Live browser sandbox with real-time compilation, dual tabs, themes & Senior AI code review.',
    badge: 'PLAYGROUND',
    url: '/docs/css/css-intro-syntax#interactive-playground-section',
    icon: '🎨',
    tags: ['css', 'html', 'playground', 'sandbox', 'live', 'code', 'interactive'],
  },
  {
    id: 'action_diagrams',
    type: 'action',
    title: 'Architecture & Diagrams Studio',
    snippet: 'Interactive deep-dive architectural diagrams: React Fiber tree, Event loop, Micro-Frontends, and Web vitals.',
    badge: 'STUDIO',
    url: '/docs/diagrams',
    icon: '📐',
    tags: ['diagrams', 'architecture', 'fiber', 'event loop', 'visualizer', 'rendering'],
  },
  {
    id: 'action_leaderboard',
    type: 'action',
    title: 'Global Competitive Leaderboard',
    snippet: 'Global developer ranks, achievement badges, total XP, and competitive mock interview standings.',
    badge: 'LEADERBOARD',
    url: '/leaderboard',
    icon: '🏆',
    tags: ['leaderboard', 'ranks', 'competition', 'xp', 'trophies', 'scores'],
  },
  {
    id: 'action_flashcards',
    type: 'action',
    title: 'Rapid Revision Flashcards Studio',
    snippet: 'Active recall flashcards for fast high-frequency interview questions and memory drills.',
    badge: 'STUDIO',
    url: '/docs/flashcards',
    icon: '🗂️',
    tags: ['flashcards', 'revision', 'memory', 'quick', 'cards', 'active recall'],
  },
  {
    id: 'action_comparisons',
    type: 'action',
    title: 'Framework Comparisons & Diffs',
    snippet: 'Head-to-head architectural diffs: React vs Vue, Vite vs Webpack, Next.js App vs Pages Router.',
    badge: 'DIFFS',
    url: '/docs/comparisons',
    icon: '⚖️',
    tags: ['comparisons', 'diffs', 'react vs vue', 'vite vs webpack', 'frameworks'],
  },
  {
    id: 'action_study_plan',
    type: 'action',
    title: 'Master Frontend Study Roadmap',
    snippet: 'Comprehensive curriculum study plan for junior, mid-level, and staff frontend engineering roles.',
    badge: 'ROADMAP',
    url: '/docs/study-plan',
    icon: '🗺️',
    tags: ['roadmap', 'study plan', 'curriculum', 'career', 'guide'],
  },
  {
    id: 'action_practice',
    type: 'action',
    title: 'Daily Practice Drills Studio',
    snippet: 'Curated technical challenges, timed quizzes, and coding drills to sharpen problem-solving.',
    badge: 'STUDIO',
    url: '/docs/practice',
    icon: '🎯',
    tags: ['practice', 'drills', 'quiz', 'challenges', 'timed'],
  }
];

class DocsSearchService {
  private searchIndex: SearchResultItem[] = [];
  private isIndexed = false;

  private buildIndex() {
    if (this.isIndexed) return;

    const items: SearchResultItem[] = [];

    // 1. Index Quick Actions
    QUICK_ACTIONS.forEach(action => {
      items.push(action);
    });

    // 2. Index Subjects
    ALL_SUBJECTS_CATALOG.forEach(s => {
      items.push({
        id: `sub_${s.id}`,
        type: 'subject',
        title: s.title,
        snippet: `${s.tagline} ${s.description}`,
        subjectId: s.id,
        subjectTitle: s.title,
        badge: s.badge || 'Track',
        tags: s.tags,
        url: `/docs/${s.id}`,
        icon: s.icon || '🌐',
      });
    });

    // 3. Index Topics
    Object.entries(TOPICS_BY_SUBJECT).forEach(([subId, topics]) => {
      const subject = ALL_SUBJECTS_CATALOG.find(s => s.id === subId);
      topics.forEach(t => {
        items.push({
          id: `top_${subId}_${t.id}`,
          type: 'topic',
          title: t.title,
          snippet: `${t.description} ${t.subtopics.map(st => st.title).join(' ')}`,
          subjectId: subId as SubjectId,
          subjectTitle: subject?.title || subId,
          topicId: t.id,
          badge: 'Topic',
          tags: [subId, 'Documentation'],
          url: `/docs/${subId}/${t.id}`,
          icon: subject?.icon || '📄',
        });
      });
    });

    // 4. Index Documentation Pages
    ALL_DOCS_PAGES.forEach(doc => {
      const subject = ALL_SUBJECTS_CATALOG.find(s => s.id === doc.subjectId);
      items.push({
        id: `doc_${doc.subjectId}_${doc.topicId}`,
        type: 'topic',
        title: doc.title,
        snippet: `${doc.overview} ${doc.whyItMatters} ${doc.sections.map(s => s.heading + ' ' + s.content).join(' ')}`,
        subjectId: doc.subjectId,
        subjectTitle: subject?.title || doc.subjectId,
        topicId: doc.topicId,
        badge: 'Doc',
        tags: [doc.subjectId],
        url: `/docs/${doc.subjectId}/${doc.topicId}`,
        icon: subject?.icon || '📘',
      });
    });

    // 5. Index Questions
    ALL_QUESTIONS_REGISTRY.forEach(q => {
      const subject = ALL_SUBJECTS_CATALOG.find(s => s.id === q.subjectId);
      items.push({
        id: `q_${q.id}`,
        type: 'question',
        title: q.question,
        snippet: `${q.shortAnswer} ${q.detailedAnswer} ${q.tags.join(' ')}`,
        subjectId: q.subjectId,
        subjectTitle: subject?.title || q.subjectId,
        topicId: q.topicId,
        badge: q.difficulty.toUpperCase(),
        tags: q.tags,
        url: `/docs/${q.subjectId}/${q.topicId}#${q.id}`,
        icon: '❓',
      });
    });

    this.searchIndex = items;
    this.isIndexed = true;
  }

  /**
   * Get all currently bookmarked topics & questions
   */
  getBookmarkedItems(): SearchResultItem[] {
    this.buildIndex();
    const docKeys = new Set(docsProgressService.getBookmarkedDocKeys());
    const qIds = new Set(docsProgressService.getBookmarkedQuestionIds());

    const results: SearchResultItem[] = [];

    for (const item of this.searchIndex) {
      if (item.type === 'topic' && item.subjectId && item.topicId) {
        if (docKeys.has(`${item.subjectId}:${item.topicId}`)) {
          results.push({ ...item, isBookmarked: true });
        }
      } else if (item.type === 'question') {
        const rawQId = item.id.replace(/^q_/, '');
        if (qIds.has(item.id) || qIds.has(rawQId)) {
          results.push({ ...item, isBookmarked: true });
        }
      }
    }

    return results;
  }

  /**
   * Fast, in-memory case-insensitive search with ranking.
   */
  search(
    query: string,
    maxResults = 25,
    filterType: 'all' | 'subject' | 'topic' | 'question' | 'action' | 'favorite' = 'all',
    filterSubjectId?: string
  ): SearchResultItem[] {
    this.buildIndex();
    const q = query.trim().toLowerCase();

    const docKeys = new Set(docsProgressService.getBookmarkedDocKeys());
    const qIds = new Set(docsProgressService.getBookmarkedQuestionIds());

    const checkIsBookmarked = (item: SearchResultItem): boolean => {
      if (item.type === 'topic' && item.subjectId && item.topicId) {
        return docKeys.has(`${item.subjectId}:${item.topicId}`);
      }
      if (item.type === 'question') {
        const rawQId = item.id.replace(/^q_/, '');
        return qIds.has(item.id) || qIds.has(rawQId);
      }
      return false;
    };

    // If searching within favorites:
    if (filterType === 'favorite') {
      const allFavorites = this.getBookmarkedItems();
      if (!q) {
        return allFavorites.slice(0, maxResults);
      }
      // Filter within favorites
      const tokens = q.split(/\s+/).filter(t => t.length > 0);
      return allFavorites.filter(item => {
        const text = `${item.title} ${item.snippet} ${(item.tags || []).join(' ')}`.toLowerCase();
        return tokens.every(t => text.includes(t));
      }).slice(0, maxResults);
    }

    if (!q) return [];

    const tokens = q.split(/\s+/).filter(t => t.length > 0);

    const matches: { item: SearchResultItem; score: number }[] = [];

    for (const item of this.searchIndex) {
      if (filterType !== 'all' && item.type !== filterType) {
        continue;
      }
      if (filterSubjectId && filterSubjectId !== 'all' && item.subjectId && item.subjectId !== filterSubjectId) {
        continue;
      }

      const titleLower = item.title.toLowerCase();
      const snippetLower = item.snippet.toLowerCase();
      const tagsLower = (item.tags || []).join(' ').toLowerCase();

      let score = 0;
      let matchedAll = true;

      // Bonus for exact or prefix title match
      if (titleLower === q) {
        score += 50;
      } else if (titleLower.startsWith(q)) {
        score += 30;
      }

      // Bonus for quick actions
      if (item.type === 'action') {
        score += 8;
      } else if (item.type === 'subject') {
        score += 5;
      }

      for (const token of tokens) {
        let tokenMatched = false;
        if (titleLower.includes(token)) {
          score += 15;
          tokenMatched = true;
        }
        if (tagsLower.includes(token)) {
          score += 8;
          tokenMatched = true;
        }
        if (snippetLower.includes(token)) {
          score += 3;
          tokenMatched = true;
        }

        if (!tokenMatched) {
          matchedAll = false;
          break;
        }
      }

      if (matchedAll && score > 0) {
        matches.push({
          item: {
            ...item,
            isBookmarked: checkIsBookmarked(item),
          },
          score,
        });
      }
    }

    matches.sort((a, b) => b.score - a.score);
    return matches.slice(0, maxResults).map(m => m.item);
  }

  /**
   * Get default recommendations (Actions + Featured Tracks) for empty query state.
   */
  getDefaultSuggestions(): SearchResultItem[] {
    this.buildIndex();
    return QUICK_ACTIONS;
  }
}

export const docsSearchService = new DocsSearchService();
