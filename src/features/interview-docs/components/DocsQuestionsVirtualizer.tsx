import { useState, useRef, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { SubjectId, InterviewQuestion, QuestionDifficulty } from '../types/docs.types';
import { getQuestionsBySubject } from '../data/docsRegistry';
import { DocsQuestionCard } from './DocsQuestionCard';

interface DocsQuestionsVirtualizerProps {
  questions: InterviewQuestion[];
  subjectId: SubjectId;
  subjectTitle: string;
  topicId: string;
  topicTitle: string;
}

export function DocsQuestionsVirtualizer({
  questions,
  subjectId,
  subjectTitle,
  topicId,
  topicTitle,
}: DocsQuestionsVirtualizerProps) {
  const [scope, setScope] = useState<'topic' | 'track'>('topic');
  const [filterQuery, setFilterQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<QuestionDifficulty | 'all'>('all');

  // Fetch all track questions lazily on demand when user switches to track view
  const trackQuestions = useMemo(() => {
    if (scope === 'track') {
      return getQuestionsBySubject(subjectId);
    }
    return [];
  }, [scope, subjectId]);

  // Active question set based on scope
  const activeQuestions = scope === 'topic' ? questions : trackQuestions;

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    let list = activeQuestions;

    if (difficultyFilter !== 'all') {
      list = list.filter(q => q.difficulty === difficultyFilter);
    }

    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase().trim();
      list = list.filter(item => {
        return (
          item.question.toLowerCase().includes(q) ||
          item.shortAnswer.toLowerCase().includes(q) ||
          (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
        );
      });
    }

    return list;
  }, [activeQuestions, difficultyFilter, filterQuery]);

  // TanStack Virtualizer setup
  const parentScrollRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: filteredQuestions.length,
    getScrollElement: () => parentScrollRef.current,
    estimateSize: () => 140, // Base collapsed card height
    overscan: 4,
  });

  // When scope changes or filter changes, scroll to top of virtualizer
  useEffect(() => {
    if (parentScrollRef.current) {
      parentScrollRef.current.scrollTop = 0;
    }
  }, [scope, difficultyFilter]);

  return (
    <div className="docs-questions-virtualizer-container">
      {/* Virtualizer Header Controls Bar */}
      <div className="dqv-header-bar">
        <div className="dqv-header-info">
          <div className="dqv-title-row">
            <h2 className="section-title">Interview Questions &amp; Practice</h2>
            <span className="dqv-virtualizer-badge" title="Powered by @tanstack/react-virtual for instant 60fps windowed DOM rendering">
              ⚡ TanStack Virtualizer (60fps Windowed)
            </span>
          </div>
          <p className="section-subtext">
            {scope === 'topic'
              ? `Real interview scenarios, follow-up chains, and senior architect evaluations for ${topicTitle}.`
              : `Comprehensive interview question pool across the entire ${subjectTitle} track (${trackQuestions.length} questions).`}
          </p>
        </div>

        <div className="dqv-header-actions">
          <Link
            to={`/docs/practice?subject=${subjectId}&topic=${scope === 'topic' ? topicId : ''}`}
            className="docs-practice-topic-btn"
          >
            🎯 Practice Studio →
          </Link>
        </div>
      </div>

      {/* Scope & Filter Strip */}
      <div className="dqv-controls-strip">
        {/* Scope Selector: Topic Questions vs Full Track Questions */}
        <div className="dqv-scope-pills" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={scope === 'topic'}
            className={`dqv-scope-btn ${scope === 'topic' ? 'active' : ''}`}
            onClick={() => setScope('topic')}
          >
            📌 Topic Questions ({questions.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={scope === 'track'}
            className={`dqv-scope-btn ${scope === 'track' ? 'active' : ''}`}
            onClick={() => setScope('track')}
          >
            📚 Full {subjectTitle} Track
          </button>
        </div>

        {/* Quick Search & Difficulty Filters */}
        <div className="dqv-filter-group">
          <div className="dqv-search-box">
            <span className="dqv-search-icon">🔍</span>
            <input
              type="text"
              className="dqv-search-input"
              placeholder={`Search ${filteredQuestions.length} questions...`}
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
            />
            {filterQuery && (
              <button
                type="button"
                className="dqv-clear-btn"
                onClick={() => setFilterQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          <div className="dqv-difficulty-pills">
            {(['all', 'easy', 'intermediate', 'difficult'] as const).map(diff => (
              <button
                key={diff}
                type="button"
                className={`dqv-diff-btn diff-${diff} ${difficultyFilter === diff ? 'active' : ''}`}
                onClick={() => setDifficultyFilter(diff)}
              >
                {diff === 'all' ? 'All' : diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="dqv-status-bar">
        <span className="dqv-status-count">
          Showing <strong>{filteredQuestions.length}</strong> of {activeQuestions.length} questions
          {scope === 'track' && ` (Full ${subjectTitle} Curriculum)`}
        </span>
        <span className="dqv-status-hint">
          Click questions to expand detailed answers, senior perspectives, and code examples.
        </span>
      </div>

      {/* TanStack Virtualizer Viewport */}
      {filteredQuestions.length === 0 ? (
        <div className="dqv-empty-state">
          <span>🔍</span>
          <p>No questions matched your filter query.</p>
          <button
            type="button"
            className="dqv-reset-filter-btn"
            onClick={() => {
              setFilterQuery('');
              setDifficultyFilter('all');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div
          ref={parentScrollRef}
          className="dqv-virtual-viewport"
          style={{
            maxHeight: scope === 'track' ? '700px' : '800px',
            overflowY: 'auto',
            position: 'relative',
            contain: 'strict',
          }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const q = filteredQuestions[virtualRow.index];
              if (!q) return null;

              return (
                <div
                  key={q.id}
                  ref={rowVirtualizer.measureElement}
                  data-index={virtualRow.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                    paddingBottom: '16px',
                  }}
                >
                  <DocsQuestionCard
                    question={q}
                    index={virtualRow.index}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
