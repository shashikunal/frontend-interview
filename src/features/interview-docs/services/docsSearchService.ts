import type { SubjectId } from '../types/docs.types';
import { ALL_SUBJECTS_CATALOG, TOPICS_BY_SUBJECT } from '../data/subjectsCatalog';
import { ALL_DOCS_PAGES, ALL_QUESTIONS_REGISTRY } from '../data/docsRegistry';

export interface SearchResultItem {
  id: string;
  type: 'subject' | 'topic' | 'question';
  title: string;
  snippet: string;
  subjectId: SubjectId;
  subjectTitle: string;
  topicId?: string;
  badge?: string;
  tags?: string[];
  url: string;
}

class DocsSearchService {
  private searchIndex: SearchResultItem[] = [];
  private isIndexed = false;

  private buildIndex() {
    if (this.isIndexed) return;

    const items: SearchResultItem[] = [];

    // 1. Index Subjects
    ALL_SUBJECTS_CATALOG.forEach(s => {
      items.push({
        id: `sub_${s.id}`,
        type: 'subject',
        title: s.title,
        snippet: `${s.tagline} ${s.description}`,
        subjectId: s.id,
        subjectTitle: s.title,
        badge: s.badge,
        tags: s.tags,
        url: `/docs/${s.id}`,
      });
    });

    // 2. Index Topics
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
        });
      });
    });

    // 3. Index Documentation Pages
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
      });
    });

    // 4. Index Questions
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
      });
    });

    this.searchIndex = items;
    this.isIndexed = true;
  }

  /**
   * Fast, in-memory case-insensitive search with ranking.
   */
  search(query: string, maxResults = 12): SearchResultItem[] {
    this.buildIndex();
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const tokens = q.split(/\s+/).filter(t => t.length > 0);

    const matches: { item: SearchResultItem; score: number }[] = [];

    for (const item of this.searchIndex) {
      const titleLower = item.title.toLowerCase();
      const snippetLower = item.snippet.toLowerCase();
      const tagsLower = (item.tags || []).join(' ').toLowerCase();

      let score = 0;
      let matchedAll = true;

      for (const token of tokens) {
        let tokenMatched = false;
        if (titleLower.includes(token)) {
          score += 10;
          tokenMatched = true;
        }
        if (tagsLower.includes(token)) {
          score += 5;
          tokenMatched = true;
        }
        if (snippetLower.includes(token)) {
          score += 2;
          tokenMatched = true;
        }

        if (!tokenMatched) {
          matchedAll = false;
          break;
        }
      }

      if (matchedAll && score > 0) {
        matches.push({ item, score });
      }
    }

    matches.sort((a, b) => b.score - a.score);
    return matches.slice(0, maxResults).map(m => m.item);
  }
}

export const docsSearchService = new DocsSearchService();
