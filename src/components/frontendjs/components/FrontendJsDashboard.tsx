// src/components/frontendjs/components/FrontendJsDashboard.tsx
import { useState, useMemo } from 'react'
import type { FrontendJsQuestion } from '../data/frontendJsTypes'
import { frontendJsProgressService } from '../lib/frontendJsProgressService'

interface Props {
  questions: FrontendJsQuestion[]
  onSelectQuestion: (questionId: string) => void
  onOpenInterviewMode: () => void
  onOpenLeaderboard: () => void
  onOpenAdminTab?: () => void
  isAdmin?: boolean
}

const BATCHES = [
  { id: 'all', label: 'All 1,000', start: 1, end: 1000 },
  { id: 'b1', label: 'B1: Fundamentals (1-100)', start: 1, end: 100 },
  { id: 'b2', label: 'B2: Closures & Scopes (101-200)', start: 1, end: 200 },
  { id: 'b3', label: 'B3: Modern ES6+ (201-300)', start: 201, end: 300 },
  { id: 'b4', label: 'B4: Arrays & Transforms (301-400)', start: 301, end: 400 },
  { id: 'b5', label: 'B5: Objects & Prototypes (401-500)', start: 401, end: 500 },
  { id: 'b6', label: 'B6: Strings & Text (501-600)', start: 501, end: 600 },
  { id: 'b7', label: 'B7: Async JS & Event Loop (601-700)', start: 601, end: 700 },
  { id: 'b8', label: 'B8: DOM & Events (701-800)', start: 701, end: 800 },
  { id: 'b9', label: 'B9: Performance & Opt (801-900)', start: 801, end: 900 },
  { id: 'b10', label: 'B10: Production Scenarios (901-1000)', start: 901, end: 1000 },
]

export function FrontendJsDashboard({
  questions,
  onSelectQuestion,
  onOpenInterviewMode,
  onOpenLeaderboard,
  onOpenAdminTab,
  isAdmin,
}: Props) {
  // Progress sets
  const solvedSet = frontendJsProgressService.getSolvedIds()
  const attemptedSet = frontendJsProgressService.getAttemptedIds()
  const revisitSet = frontendJsProgressService.getRevisitIds()
  const [bookmarkedSet, setBookmarkedSet] = useState<Set<string>>(() => {
    const s = new Set<string>()
    for (const q of questions) {
      if (frontendJsProgressService.isBookmarked(q.id)) s.add(q.id)
    }
    return s
  })

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBatch, setSelectedBatch] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Solved' | 'Unsolved' | 'Attempted' | 'Bookmarked' | 'Revisit'>('All')
  const [sortBy, setSortBy] = useState<'id-asc' | 'id-desc' | 'difficulty' | 'category' | 'recent-attempted' | 'recent-solved'>('id-asc')
  const [overviewViewMode, setOverviewViewMode] = useState<'grid' | 'list'>(() => {
    try {
      const saved = localStorage.getItem('fjs_catalog_view_mode')
      return saved === 'list' ? 'list' : 'grid'
    } catch {
      return 'grid'
    }
  })
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 24

  const categories = useMemo(() => {
    return Array.from(new Set(questions.map(q => q.category))).sort()
  }, [questions])

  const toggleBookmark = (id: string) => {
    frontendJsProgressService.toggleBookmark(id)
    setBookmarkedSet(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Filter & Sort questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      // 1. Batch filter
      if (selectedBatch !== 'all') {
        const batch = BATCHES.find(b => b.id === selectedBatch)
        if (batch) {
          const num = q.number || parseInt(q.id.replace(/\D/g, ''), 10)
          if (num < batch.start || num > batch.end) return false
        }
      }

      // 2. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchTitle = q.title.toLowerCase().includes(query)
        const matchId = q.id.toLowerCase().includes(query)
        const matchSlug = q.slug.toLowerCase().includes(query)
        const matchCat = q.category.toLowerCase().includes(query)
        if (!matchTitle && !matchId && !matchSlug && !matchCat) return false
      }

      // 3. Category
      if (selectedCategory !== 'All' && q.category !== selectedCategory) return false

      // 4. Difficulty
      if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) return false

      // 5. Status
      if (selectedStatus === 'Solved' && !solvedSet.has(q.id)) return false
      if (selectedStatus === 'Unsolved' && solvedSet.has(q.id)) return false
      if (selectedStatus === 'Attempted' && !attemptedSet.has(q.id)) return false
      if (selectedStatus === 'Bookmarked' && !bookmarkedSet.has(q.id)) return false
      if (selectedStatus === 'Revisit' && !revisitSet.has(q.id)) return false

      return true
    }).sort((a, b) => {
      if (sortBy === 'id-desc') return b.number - a.number
      if (sortBy === 'difficulty') {
        const weight: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 }
        return (weight[a.difficulty] || 0) - (weight[b.difficulty] || 0)
      }
      if (sortBy === 'category') return a.category.localeCompare(b.category)
      return a.number - b.number
    })
  }, [questions, selectedBatch, searchQuery, selectedCategory, selectedDifficulty, selectedStatus, sortBy, solvedSet, attemptedSet, bookmarkedSet, revisitSet])

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / pageSize) || 1
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredQuestions.slice(start, start + pageSize)
  }, [filteredQuestions, currentPage, pageSize])

  const solvedCount = solvedSet.size

  return (
    <div className="mc-studio-container">
      <div className="mc-overview">
        {/* Canonical MC Hero Section */}
        <div className="mc-hero">
          <div className="mc-hero-tag">
            <span>⚡ Full 1,000-Question Curriculum</span>
            <span>•</span>
            <span>Batches 1–10</span>
          </div>

          <h1 className="mc-hero-title">
            Frontend JavaScript Programming Masterclass
          </h1>

          <p className="mc-hero-desc">
            Master production JavaScript engineering: ES6+, closures, prototypes, asynchronous flows, DOM & events, memory management, web performance, and real-world frontend challenges.
          </p>

          {/* Quick Hub Navigation Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="mc-action-btn mc-btn-interview-start"
              onClick={onOpenInterviewMode}
              title="Start 60-minute timed mock interview simulation"
            >
              ⏱️ Timed Mock Interview
            </button>
            <button
              type="button"
              className="mc-action-btn"
              onClick={onOpenLeaderboard}
              title="Open global ranking leaderboard"
              style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.3)' }}
            >
              🏆 Global Leaderboard
            </button>
            {isAdmin && onOpenAdminTab && (
              <button
                type="button"
                className="mc-action-btn"
                onClick={onOpenAdminTab}
                title="Open platform moderation and audit center"
                style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}
              >
                🛡️ Admin Moderation
              </button>
            )}
          </div>

          {/* Stats Row */}
          <div className="mc-stats-row">
            <div className="mc-stat-card">
              <span className="mc-stat-num">1,000</span>
              <span className="mc-stat-label">Production Problems</span>
            </div>
            <div className="mc-stat-card">
              <span className="mc-stat-num">10</span>
              <span className="mc-stat-label">Curriculum Batches</span>
            </div>
            <div className="mc-stat-card">
              <span className="mc-stat-num">{solvedCount} / {questions.length}</span>
              <span className="mc-stat-label">Solved ({Math.round((solvedCount / questions.length) * 100)}%)</span>
            </div>
            <div className="mc-stat-card">
              <span className="mc-stat-num">⚡ Node / Web</span>
              <span className="mc-stat-label">Isolated Sandbox</span>
            </div>
          </div>
        </div>

        {/* Batch Filter Tabs */}
        <div className="mc-batch-tabs">
          {BATCHES.map(b => (
            <button
              key={b.id}
              className={`mc-batch-btn ${selectedBatch === b.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedBatch(b.id)
                setCurrentPage(1)
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
              placeholder="Search 1,000 challenges by title, slug, ID, or keywords..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
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
              setSelectedCategory(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="All">All Categories ({categories.length})</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            className="mc-select"
            value={selectedDifficulty}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <div className="mc-filter-pills">
            {(['All', 'Solved', 'Unsolved', 'Attempted', 'Bookmarked', 'Revisit'] as const).map(st => (
              <button
                key={st}
                className={`mc-filter-btn ${selectedStatus === st ? 'active' : ''}`}
                onClick={() => {
                  setSelectedStatus(st)
                  setCurrentPage(1)
                }}
              >
                {st}
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

            <div className="mc-view-switcher">
              <button
                className={`mc-view-btn ${overviewViewMode === 'grid' ? 'active' : ''}`}
                onClick={() => {
                  setOverviewViewMode('grid')
                  try { localStorage.setItem('fjs_catalog_view_mode', 'grid') } catch {}
                }}
                title="Grid Card View"
              >
                ▦
              </button>
              <button
                className={`mc-view-btn ${overviewViewMode === 'list' ? 'active' : ''}`}
                onClick={() => {
                  setOverviewViewMode('list')
                  try { localStorage.setItem('fjs_catalog_view_mode', 'list') } catch {}
                }}
                title="Compact Table List View"
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredQuestions.length === 0 ? (
          <div className="mc-empty-state">
            <div className="mc-empty-icon">🔍</div>
            <h3 className="mc-empty-title">No problems match your criteria</h3>
            <p className="mc-empty-desc">
              Try adjusting your search query, batch selection, or status filters.
            </p>
            <button
              className="mc-btn-primary"
              onClick={() => {
                setSearchQuery('')
                setSelectedBatch('all')
                setSelectedCategory('All')
                setSelectedDifficulty('All')
                setSelectedStatus('All')
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
              const isCompleted = solvedSet.has(q.id)
              const isAttempted = attemptedSet.has(q.id)
              const isBookmarked = bookmarkedSet.has(q.id)

              return (
                <div
                  key={q.id}
                  className={`mc-card ${isCompleted ? 'completed' : isAttempted ? 'attempted' : ''}`}
                  onClick={() => onSelectQuestion(q.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') onSelectQuestion(q.id) }}
                >
                  <div className="mc-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        className={`mc-card-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleBookmark(q.id)
                        }}
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark challenge'}
                        aria-label="Bookmark"
                      >
                        {isBookmarked ? '★' : '☆'}
                      </button>
                      <span className="mc-card-id">{q.id}</span>
                    </div>
                    <span className={`mc-badge ${q.difficulty.toLowerCase()}`}>
                      {q.difficulty}
                    </span>
                  </div>

                  <h3 className="mc-card-title">{q.title}</h3>
                  <p className="mc-card-summary">{(q as any).summary || (q.problemStatement ? q.problemStatement.slice(0, 110) + '...' : '')}</p>

                  <div className="mc-card-footer">
                    <span className="mc-cat-pill">{q.category}</span>
                    <span className="mc-list-time-val">⏱️ {q.timeEstimate || '15m'}</span>
                    <span className={`mc-status-pill ${isCompleted ? 'completed' : isAttempted ? 'attempted' : 'pending'}`}>
                      {isCompleted ? '✓ Solved' : isAttempted ? '● Attempted' : '○ Ready'}
                    </span>
                    <div style={{ marginLeft: 'auto' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="mc-btn-primary mc-btn-sm"
                        onClick={() => onSelectQuestion(q.id)}
                      >
                        {isCompleted ? 'Review' : 'Code'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* List View Mode */
          <div className="mc-cards-list">
            <div className="mc-list-header-row">
              <span className="mc-th mc-th-id">ID</span>
              <span className="mc-th mc-th-title">Title &amp; Summary</span>
              <span className="mc-th mc-th-category">Category</span>
              <span className="mc-th mc-th-diff">Difficulty</span>
              <span className="mc-th mc-th-time">Time</span>
              <span className="mc-th mc-th-status">Status</span>
              <span className="mc-th mc-th-action">Action</span>
            </div>

            {paginatedQuestions.map(q => {
              const isCompleted = solvedSet.has(q.id)
              const isAttempted = attemptedSet.has(q.id)
              const isBookmarked = bookmarkedSet.has(q.id)

              return (
                <div
                  key={q.id}
                  className={`mc-list-item ${isCompleted ? 'completed' : isAttempted ? 'attempted' : ''}`}
                  onClick={() => onSelectQuestion(q.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') onSelectQuestion(q.id) }}
                >
                  <div className="mc-td mc-td-id" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      className={`mc-card-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleBookmark(q.id)
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
                    <div className="mc-list-summary-text">{(q as any).summary || (q.problemStatement ? q.problemStatement.slice(0, 110) + '...' : '')}</div>
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
                    <span className="mc-list-time-val">⏱️ {q.timeEstimate || '15m'}</span>
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
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {filteredQuestions.length > pageSize && (
          <div className="mc-pagination">
            <span style={{ fontSize: '13px', color: 'var(--text-secondary, #94a3b8)' }}>
              Showing {((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, filteredQuestions.length)} of {filteredQuestions.length} challenges
            </span>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                type="button"
                className="mc-page-btn"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                ‹ Prev
              </button>

              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                let p = i + 1
                if (totalPages > 7) {
                  if (currentPage > 4) {
                    p = currentPage - 3 + i
                    if (p > totalPages) p = totalPages - (6 - i)
                  }
                }
                return (
                  <button
                    key={p}
                    type="button"
                    className={`mc-page-btn ${currentPage === p ? 'active' : ''}`}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </button>
                )
              })}

              <button
                type="button"
                className="mc-page-btn"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                Next ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
