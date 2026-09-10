// src/components/coreprogramming/components/CoreProgrammingQuestionList.tsx
import { useState, useMemo } from 'react';
import type { CoreProgrammingQuestion } from '../data/coreProgrammingTypes';
import { coreProgrammingProgressService, type CoreProgrammingQuestionStatus } from '../lib/coreProgrammingProgressService';
import { CORE_PROGRAMMING_CATEGORIES } from '../data/coreProgrammingQuestions';

interface Props {
  questions: CoreProgrammingQuestion[];
  activeQuestionId: string;
  onSelectQuestion: (questionId: string) => void;
  onClose?: () => void;
}

type PaletteFilter =
  | 'All'
  | 'Solved'
  | 'In Progress'
  | 'Attempted'
  | 'Revisit'
  | 'Easy'
  | 'Medium'
  | 'Hard'
  | 'Expert';

function getStatusSymbol(status: CoreProgrammingQuestionStatus): string {
  switch (status) {
    case 'Solved':
      return '✓';
    case 'Attempted':
      return '●';
    case 'Revisit':
      return '↻';
    case 'In Progress':
      return '⌛';
    default:
      return '○';
  }
}

export function CoreProgrammingQuestionList({
  questions,
  activeQuestionId,
  onSelectQuestion,
  onClose,
}: Props) {
  const [filter, setFilter] = useState<PaletteFilter>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [page, setPage] = useState<number>(0);
  const pageSize = 100;

  const solvedSet = coreProgrammingProgressService.getSolvedIds();
  const attemptedSet = coreProgrammingProgressService.getAttemptedIds();
  const revisitSet = coreProgrammingProgressService.getRevisitIds();

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      // Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchTitle = q.title.toLowerCase().includes(query);
        const matchId = q.id.toLowerCase().includes(query);
        const matchCat = q.category.toLowerCase().includes(query);
        const matchStmt = q.problemStatement?.toLowerCase().includes(query);
        if (!matchTitle && !matchId && !matchCat && !matchStmt) return false;
      }

      // Category filter
      if (categoryFilter !== 'All' && q.category !== categoryFilter) {
        return false;
      }

      // Status / Difficulty Filter
      if (filter === 'Solved') return solvedSet.has(q.id);
      if (filter === 'Attempted') return attemptedSet.has(q.id) && !solvedSet.has(q.id);
      if (filter === 'Revisit') return revisitSet.has(q.id);
      if (filter === 'In Progress') return Boolean(coreProgrammingProgressService.getDraft(q.id)) && !solvedSet.has(q.id);
      if (filter === 'Easy' || filter === 'Medium' || filter === 'Hard' || filter === 'Expert') {
        return q.difficulty === filter;
      }

      return true;
    });
  }, [questions, searchTerm, categoryFilter, filter, solvedSet, attemptedSet, revisitSet]);

  const totalPages = Math.ceil(filteredQuestions.length / pageSize) || 1;
  const paginatedQuestions = useMemo(() => {
    const start = page * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, page, pageSize]);

  return (
    <div className="cp-qlist-container">
      {/* Header */}
      <div className="cp-qlist-header">
        <div className="cp-qlist-title-row">
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#f8fafc' }}>
              📋 Problem Directory
            </h3>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              Completed: <strong style={{ color: '#34d399' }}>{solvedSet.size}</strong> / {questions.length}
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              className="cp-modal-close"
              onClick={onClose}
              title="Close drawer"
              style={{ fontSize: '20px' }}
            >
              ×
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="cp-qlist-search-box">
          <span style={{ position: 'absolute', left: '10px', fontSize: '12px', color: '#94a3b8' }}>🔍</span>
          <input
            type="text"
            className="cp-qlist-search-input"
            placeholder="Search by ID, title, or topic..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              ×
            </button>
          )}
        </div>

        {/* Category Filter */}
        <select
          className="mc-select"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(0);
          }}
          style={{ width: '100%', fontSize: '12px', padding: '6px 8px' }}
        >
          <option value="All">All Categories ({CORE_PROGRAMMING_CATEGORIES.length})</option>
          {CORE_PROGRAMMING_CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Filter Pills */}
        <div className="cp-qlist-filter-pills">
          {(['All', 'Solved', 'In Progress', 'Attempted', 'Revisit', 'Easy', 'Medium', 'Hard', 'Expert'] as PaletteFilter[]).map(f => (
            <button
              key={f}
              type="button"
              className={`cp-qlist-pill-btn ${filter === f ? 'active' : ''}`}
              onClick={() => {
                setFilter(f);
                setPage(0);
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Body List */}
      <div className="cp-qlist-body">
        {paginatedQuestions.map(q => {
          const status = coreProgrammingProgressService.getQuestionStatus(q.id);
          const symbol = getStatusSymbol(status);
          const isActive = q.id === activeQuestionId;
          const formattedNum = String(q.number).padStart(3, '0');

          return (
            <div
              key={q.id}
              className={`cp-qitem ${isActive ? 'selected' : ''}`}
              onClick={() => {
                onSelectQuestion(q.id);
                if (onClose) onClose();
              }}
              title={`${q.id}: ${q.title} (${q.difficulty} - ${status})`}
            >
              <div className="cp-qitem-prefix">
                <span className="cp-qitem-num">{formattedNum}</span>
                <span className={`cp-qitem-sym status-${status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {symbol}
                </span>
              </div>

              <div className="cp-qitem-content">
                <div className="cp-qitem-title">
                  {q.title}
                </div>
                <div className="cp-qitem-meta">
                  <span className={`mc-badge ${q.difficulty.toLowerCase()}`} style={{ fontSize: '10px', padding: '1px 6px' }}>
                    {q.difficulty}
                  </span>
                  <span className="cp-qitem-cat">{q.category}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="cp-qlist-pagination">
          <button
            type="button"
            className="mc-action-btn"
            disabled={page === 0}
            onClick={() => setPage(p => Math.max(0, p - 1))}
            style={{ fontSize: '11px', padding: '4px 10px' }}
          >
            ← Prev
          </button>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            className="mc-action-btn"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            style={{ fontSize: '11px', padding: '4px 10px' }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
