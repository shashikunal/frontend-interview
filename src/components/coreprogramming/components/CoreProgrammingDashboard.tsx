// src/components/coreprogramming/components/CoreProgrammingDashboard.tsx
import { useState, useMemo, useEffect } from 'react';
import type { CoreProgrammingQuestion } from '../data/coreProgrammingTypes';
import { coreProgrammingProgressService } from '../lib/coreProgrammingProgressService';
import { CORE_PROGRAMMING_CATEGORIES } from '../data/coreProgrammingQuestions';

interface Props {
  questions: CoreProgrammingQuestion[];
  onSelectQuestion: (questionId: string) => void;
  onOpenDailyPractice: () => void;
}

const BATCHES = [
  { id: 'all', label: 'All 500', start: 1, end: 500 },
  { id: 'b1', label: 'B1: Basics & Strings (1-50)', start: 1, end: 50 },
  { id: 'b2', label: 'B2: Strings & Arrays (51-100)', start: 51, end: 100 },
  { id: 'b3', label: 'B3: Arrays Deep Dive (101-150)', start: 101, end: 150 },
  { id: 'b4', label: 'B4: Objects Mastery (151-200)', start: 151, end: 200 },
  { id: 'b5', label: 'B5: Functions & Scope (201-250)', start: 201, end: 250 },
  { id: 'b6', label: 'B6: Array Methods & Prototypes (251-300)', start: 251, end: 300 },
  { id: 'b7', label: 'B7: Closures & this / bind (301-350)', start: 301, end: 350 },
  { id: 'b8', label: 'B8: ES6+ & Recursion (351-400)', start: 351, end: 400 },
  { id: 'b9', label: 'B9: Algorithms & Functional JS (401-450)', start: 401, end: 450 },
  { id: 'b10', label: 'B10: Async & Advanced JS (451-500)', start: 451, end: 500 },
];

function getQuestionSummary(q: CoreProgrammingQuestion): string {
  if (q.summary && q.summary.trim()) return q.summary.trim();
  if (!q.problemStatement) return `${q.category} practice challenge`;
  const cleaned = q.problemStatement.replace(/`([^`]+)`/g, '$1').replace(/\n+/g, ' ').trim();
  const firstSentence = cleaned.split(/\.\s+/)[0]?.trim();
  if (firstSentence && firstSentence.length >= 20 && firstSentence.length <= 110) {
    return firstSentence.endsWith('.') ? firstSentence : `${firstSentence}.`;
  }
  if (cleaned.length <= 100) return cleaned;
  return cleaned.slice(0, 95).trim() + '...';
}

export function CoreProgrammingDashboard({
  questions,
  onSelectQuestion,
  onOpenDailyPractice,
}: Props) {
  const [progressTick, setProgressTick] = useState(0);

  useEffect(() => {
    return coreProgrammingProgressService.subscribe(() => {
      setProgressTick(t => t + 1);
    });
  }, []);

  const solvedSet = useMemo(() => coreProgrammingProgressService.getSolvedIds(), [progressTick]);
  const attemptedSet = useMemo(() => coreProgrammingProgressService.getAttemptedIds(), [progressTick]);
  const revisitSet = useMemo(() => coreProgrammingProgressService.getRevisitIds(), [progressTick]);
  const [bookmarkedSet, setBookmarkedSet] = useState<Set<string>>(() => {
    const s = new Set<string>();
    for (const q of questions) {
      if (coreProgrammingProgressService.isBookmarked(q.id)) s.add(q.id);
    }
    return s;
  });

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Solved' | 'Unsolved' | 'Attempted' | 'Bookmarked' | 'Revisit'>('All');
  const [sortBy, setSortBy] = useState<'id-asc' | 'id-desc' | 'difficulty' | 'category'>('id-asc');
  const [overviewViewMode, setOverviewViewMode] = useState<'grid' | 'list'>(() => {
    try {
      const saved = localStorage.getItem('cp_catalog_view_mode');
      return saved === 'list' ? 'list' : 'grid';
    } catch {
      return 'grid';
    }
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  const toggleBookmark = (id: string) => {
    coreProgrammingProgressService.toggleBookmark(id);
    setBookmarkedSet(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filter & Sort
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      // 1. Batch filter
      if (selectedBatch !== 'all') {
        const batch = BATCHES.find(b => b.id === selectedBatch);
        if (batch) {
          const num = q.number || parseInt(q.id.replace(/\D/g, ''), 10);
          if (num < batch.start || num > batch.end) return false;
        }
      }

      // 2. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = q.title.toLowerCase().includes(query);
        const matchId = q.id.toLowerCase().includes(query);
        const matchCat = q.category.toLowerCase().includes(query);
        const matchSubcat = q.subcategory?.toLowerCase().includes(query);
        const matchStmt = q.problemStatement?.toLowerCase().includes(query);
        if (!matchTitle && !matchId && !matchCat && !matchSubcat && !matchStmt) return false;
      }

      // 3. Category
      if (selectedCategory !== 'All' && q.category !== selectedCategory) return false;

      // 4. Difficulty
      if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) return false;

      // 5. Status
      if (selectedStatus === 'Solved' && !solvedSet.has(q.id)) return false;
      if (selectedStatus === 'Unsolved' && solvedSet.has(q.id)) return false;
      if (selectedStatus === 'Attempted' && !attemptedSet.has(q.id)) return false;
      if (selectedStatus === 'Bookmarked' && !bookmarkedSet.has(q.id)) return false;
      if (selectedStatus === 'Revisit' && !revisitSet.has(q.id)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'id-desc') return b.number - a.number;
      if (sortBy === 'difficulty') {
        const weight: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3, Expert: 4 };
        return (weight[a.difficulty] || 0) - (weight[b.difficulty] || 0);
      }
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      return a.number - b.number;
    });
  }, [questions, selectedBatch, searchQuery, selectedCategory, selectedDifficulty, selectedStatus, sortBy, solvedSet, attemptedSet, bookmarkedSet, revisitSet]);

  const totalPages = Math.ceil(filteredQuestions.length / pageSize) || 1;
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, currentPage, pageSize]);

  const solvedCount = solvedSet.size;

  return (
    <div className="mc-studio-container">
      <div className="mc-overview">
        {/* Hero Section */}
        <div className="mc-hero">
          <div className="mc-hero-tag">
            <span>🎯 500 Core Challenges</span>
            <span>•</span>
            <span>13 JavaScript Domains</span>
            <span>•</span>
            <span>Batches 1–10</span>
          </div>

          <h1 className="mc-hero-title">
            Core JavaScript Programming Practice
          </h1>

          <p className="mc-hero-desc">
            Systematically master fundamental to expert JavaScript programming: Types, Strings, Arrays, Objects, Scope & Closures, Prototypes & `this`, ES6+, Recursion, Functional JS, and Asynchronous programming.
          </p>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="mc-action-btn mc-btn-interview-start"
              onClick={onOpenDailyPractice}
              title="Launch daily randomized practice sprint"
            >
              🔥 Daily Practice Sprint
            </button>
          </div>

          <div className="mc-stats-row">
            <div className="mc-stat-card">
              <span className="mc-stat-num">500</span>
              <span className="mc-stat-label">Total Challenges</span>
            </div>
            <div className="mc-stat-card">
              <span className="mc-stat-num">10</span>
              <span className="mc-stat-label">Modular Batches</span>
            </div>
            <div className="mc-stat-card">
              <span className="mc-stat-num">{solvedCount} / {questions.length}</span>
              <span className="mc-stat-label">Solved ({Math.round((solvedCount / questions.length) * 100)}%)</span>
            </div>
            <div className="mc-stat-card">
              <span className="mc-stat-num">13</span>
              <span className="mc-stat-label">Specialized Categories</span>
            </div>
          </div>
        </div>

        {/* Batch Tabs */}
        <div className="mc-batch-tabs">
          {BATCHES.map(b => (
            <button
              key={b.id}
              className={`mc-batch-btn ${selectedBatch === b.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedBatch(b.id);
                setCurrentPage(1);
              }}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Controls & Filter Bar */}
        <div className="mc-controls-bar">
          <div className="mc-search-box">
            <span className="mc-search-icon">🔍</span>
            <input
              type="text"
              className="mc-search-input"
              placeholder="Search 500 core challenges by title, slug, ID, or keywords..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            {searchQuery && (
              <button
                type="button"
                className="mc-search-clear"
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                ✕
              </button>
            )}
          </div>

          <select
            className="mc-select"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            title="Filter by JavaScript category"
            aria-label="Filter by JavaScript category"
          >
            <option value="All">🏷️ All Categories ({CORE_PROGRAMMING_CATEGORIES.length})</option>
            {CORE_PROGRAMMING_CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            className="mc-select"
            value={selectedDifficulty}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value);
              setCurrentPage(1);
            }}
            title="Filter by challenge difficulty"
            aria-label="Filter by challenge difficulty"
          >
            <option value="All">⚡ All Difficulties</option>
            <option value="Easy">⚡ Easy</option>
            <option value="Medium">⚡ Medium</option>
            <option value="Hard">⚡ Hard</option>
            <option value="Expert">⚡ Expert</option>
          </select>

          <div className="mc-filter-pills">
            {(['All', 'Solved', 'Unsolved', 'Attempted', 'Bookmarked', 'Revisit'] as const).map(st => (
              <button
                key={st}
                type="button"
                className={`mc-filter-btn ${selectedStatus === st ? 'active' : ''}`}
                onClick={() => {
                  setSelectedStatus(st);
                  setCurrentPage(1);
                }}
              >
                {st === 'Bookmarked'
                  ? `★ Bookmarked${bookmarkedSet.size > 0 ? ` (${bookmarkedSet.size})` : ''}`
                  : st === 'Solved'
                  ? `✓ Solved${solvedSet.size > 0 ? ` (${solvedSet.size})` : ''}`
                  : st === 'Attempted'
                  ? `● Attempted${attemptedSet.size > 0 ? ` (${attemptedSet.size})` : ''}`
                  : st === 'Revisit'
                  ? `🔄 Revisit${revisitSet.size > 0 ? ` (${revisitSet.size})` : ''}`
                  : st}
              </button>
            ))}
          </div>

          <div className="mc-controls-right">
            <select
              className="mc-select mc-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="id-asc">Sort: ID (Ascending)</option>
              <option value="id-desc">Sort: ID (Descending)</option>
              <option value="difficulty">Sort: Difficulty</option>
              <option value="category">Sort: Category</option>
            </select>

            <div className="mc-view-switcher" role="group" aria-label="Layout view mode">
              <button
                type="button"
                className={`mc-view-btn ${overviewViewMode === 'grid' ? 'active' : ''}`}
                onClick={() => {
                  setOverviewViewMode('grid');
                  try { localStorage.setItem('cp_catalog_view_mode', 'grid'); } catch {}
                }}
                title="Grid Card View"
                aria-label="Grid Card View"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                </svg>
                <span>Grid</span>
              </button>
              <button
                type="button"
                className={`mc-view-btn ${overviewViewMode === 'list' ? 'active' : ''}`}
                onClick={() => {
                  setOverviewViewMode('list');
                  try { localStorage.setItem('cp_catalog_view_mode', 'list'); } catch {}
                }}
                title="Compact Table List View"
                aria-label="Compact Table List View"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                <span>List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredQuestions.length === 0 ? (
          <div className="mc-empty-state">
            <div className="mc-empty-icon">🔍</div>
            <h3 className="mc-empty-title">No challenges match your criteria</h3>
            <p className="mc-empty-desc">
              Try adjusting your search query, batch selection, or category filters.
            </p>
            <button
              className="mc-btn-primary"
              onClick={() => {
                setSearchQuery('');
                setSelectedBatch('all');
                setSelectedCategory('All');
                setSelectedDifficulty('All');
                setSelectedStatus('All');
              }}
              style={{ marginTop: '16px' }}
            >
              Reset All Filters
            </button>
          </div>
        ) : overviewViewMode === 'grid' ? (
          /* Grid View Mode */
          <div className="mc-cards-grid">
            {paginatedQuestions.map(q => {
              const isCompleted = solvedSet.has(q.id);
              const isAttempted = attemptedSet.has(q.id);
              const isBookmarked = bookmarkedSet.has(q.id);

              return (
                <div
                  key={q.id}
                  className={`mc-card ${isCompleted ? 'completed' : isAttempted ? 'attempted' : ''}`}
                  onClick={() => onSelectQuestion(q.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') onSelectQuestion(q.id); }}
                >
                  <div className="mc-card-body">
                    <div className="mc-card-header">
                      <span className="mc-card-id">{q.id}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          className={`mc-card-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(q.id);
                          }}
                          title={isBookmarked ? 'Remove bookmark' : 'Bookmark challenge'}
                          aria-label="Bookmark"
                        >
                          {isBookmarked ? '★' : '☆'}
                        </button>
                        <span className={`mc-badge ${q.difficulty.toLowerCase()}`}>
                          {q.difficulty}
                        </span>
                      </div>
                    </div>

                    <h3 className="mc-card-title">{q.title}</h3>
                    <p className="mc-card-summary">{getQuestionSummary(q)}</p>
                  </div>

                  <div className="mc-card-footer">
                    <div className="mc-card-meta">
                      <span className="mc-meta-time">⏱️ {q.expectedTime || '15m'}</span>
                      <span className="mc-meta-sep">•</span>
                      <span className="mc-meta-category">{q.category}</span>
                      {isCompleted ? (
                        <span className="mc-meta-status solved">✓ Solved</span>
                      ) : isAttempted ? (
                        <span className="mc-meta-status attempted">● Attempted</span>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      className="mc-btn-primary"
                      onClick={() => onSelectQuestion(q.id)}
                    >
                      <span>{isCompleted ? 'Review' : 'Code'}</span>
                      <span>▶</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View Mode */
          <div className="mc-cards-list">
            <div className="mc-list-header-row">
              <span className="mc-th mc-th-id">ID</span>
              <span className="mc-th mc-th-title">Challenge Title &amp; Concept</span>
              <span className="mc-th mc-th-category">Category</span>
              <span className="mc-th mc-th-diff">Difficulty</span>
              <span className="mc-th mc-th-time">Time</span>
              <span className="mc-th mc-th-status">Status</span>
              <span className="mc-th mc-th-action">Action</span>
            </div>

            {paginatedQuestions.map(q => {
              const isCompleted = solvedSet.has(q.id);
              const isAttempted = attemptedSet.has(q.id);
              const isBookmarked = bookmarkedSet.has(q.id);

              return (
                <div
                  key={q.id}
                  className={`mc-list-item ${isCompleted ? 'completed' : isAttempted ? 'attempted' : ''}`}
                  onClick={() => onSelectQuestion(q.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') onSelectQuestion(q.id); }}
                >
                  <div className="mc-td mc-td-id" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      className={`mc-card-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(q.id);
                      }}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark challenge'}
                      aria-label="Bookmark"
                    >
                      {isBookmarked ? '★' : '☆'}
                    </button>
                    <span className="mc-card-id">{q.id}</span>
                  </div>

                  <div className="mc-td mc-td-title">
                    <div className="mc-list-title-text">{q.title}</div>
                    <div className="mc-list-summary-text">{getQuestionSummary(q)}</div>
                  </div>

                  <div className="mc-td mc-td-category">
                    <span className="mc-cat-pill">{q.category}</span>
                  </div>

                  <div className="mc-td mc-td-diff">
                    <span className={`mc-badge ${q.difficulty.toLowerCase()}`}>
                      {q.difficulty}
                    </span>
                  </div>

                  <div className="mc-td mc-td-time">
                    <span className="mc-list-time-val">{q.expectedTime || '15m'}</span>
                  </div>

                  <div className="mc-td mc-td-status">
                    {isCompleted ? (
                      <span className="mc-status-pill completed">✓ Solved</span>
                    ) : isAttempted ? (
                      <span className="mc-status-pill attempted">● Attempted</span>
                    ) : (
                      <span className="mc-status-pill pending">○ Ready</span>
                    )}
                  </div>

                  <div className="mc-td mc-td-action" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="mc-btn-primary mc-btn-list-action"
                      onClick={() => onSelectQuestion(q.id)}
                    >
                      <span>{isCompleted ? 'Review' : 'Code'}</span>
                      <span>▶</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mc-pagination-bar">
            <button
              type="button"
              className="mc-page-nav-btn"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(p => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              ‹ Previous
            </button>
            <span className="mc-page-indicator">
              Page {currentPage} of {totalPages} ({filteredQuestions.length} total challenges in view)
            </span>
            <button
              type="button"
              className="mc-page-nav-btn"
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage(p => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Next ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
