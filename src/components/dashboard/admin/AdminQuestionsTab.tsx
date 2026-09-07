import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { AdminQuestionStat } from '../../../lib/adminAnalyticsService'

interface AdminQuestionsTabProps {
  questionsList?: AdminQuestionStat[]
  initialStats?: AdminQuestionStat[]
  onRefresh?: () => void
}

const QUESTION_TITLE_MAP: Record<string, { title: string; category?: string }> = {
  Q001: { title: 'Interactive Counter with Step', category: 'Machine Coding' },
  Q002: { title: 'Search Autocomplete & Debounce', category: 'Machine Coding' },
  Q003: { title: 'Transfer List Component', category: 'Machine Coding' },
  Q004: { title: 'Virtual Scroll & Infinite List', category: 'Machine Coding' },
  Q005: { title: 'Interactive Star Rating', category: 'Machine Coding' },
  Q006: { title: 'Nested Comments Discussion Thread', category: 'Machine Coding' },
  Q007: { title: 'Drag & Drop Kanban Board', category: 'Machine Coding' },
  Q008: { title: 'Multi-Step Checkout Stepper', category: 'Machine Coding' },
  Q009: { title: 'Rich Text Markdown Editor', category: 'Machine Coding' },
  Q010: { title: 'Memory-Efficient Image Carousel', category: 'Machine Coding' },
  '1000000': { title: 'React Fiber Reconciler & Architecture', category: 'React 19 Core' },
  '1000001': { title: 'JavaScript Event Loop & Microtasks', category: 'Frontend Core' },
  '1000002': { title: 'DOM Virtualization & Layout Engine', category: 'Performance' },
  '1000003': { title: 'Custom React Hooks & Closures', category: 'React 19 Core' },
  '1000004': { title: 'State Management & Concurrent Rendering', category: 'React 19 Core' },
  'react-hooks-counter': { title: 'Counter with Reducer Hook', category: 'React' },
  'todo-app-react': { title: 'Production Todo List with LocalStorage', category: 'React' },
  'modal-overlay': { title: 'Accessible Modal Dialog & Focus Trap', category: 'Frontend Core' },
  'debounce-throttle': { title: 'Debounce & Throttle Utilities', category: 'JavaScript' },
}

function resolveQuestionInfo(id: string, fallbackTitle?: string, fallbackCat?: string) {
  const mapped = QUESTION_TITLE_MAP[id]
  const title = mapped?.title || (fallbackTitle && !fallbackTitle.startsWith('Question #') ? fallbackTitle : `Challenge: ${id}`)
  const category = mapped?.category || fallbackCat || (id.startsWith('Q') ? 'Machine Coding' : 'Frontend Core')
  return { title, category }
}

export default function AdminQuestionsTab({
  questionsList,
  initialStats,
  onRefresh,
}: AdminQuestionsTabProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('q') || ''
  const categoryFilter = searchParams.get('category') || 'ALL'

  const setSearch = (val: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (val) next.set('q', val)
      else next.delete('q')
      return next
    })
  }

  const setCategoryFilter = (val: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (val && val !== 'ALL') next.set('category', val)
      else next.delete('category')
      return next
    })
  }

  const effectiveList = questionsList || initialStats || []

  const enrichedList = useMemo(() => {
    return effectiveList.map(q => {
      const { title, category } = resolveQuestionInfo(q.id, q.title, q.category)
      return { ...q, title, category }
    })
  }, [effectiveList])

  const filtered = useMemo(() => {
    return enrichedList.filter(q => {
      const matchesSearch =
        !search ||
        q.id.toLowerCase().includes(search.toLowerCase()) ||
        q.title.toLowerCase().includes(search.toLowerCase())
      const matchesCat =
        categoryFilter === 'ALL' || q.category.toLowerCase().includes(categoryFilter.toLowerCase())
      return matchesSearch && matchesCat
    })
  }, [enrichedList, search, categoryFilter])

  return (
    <div className="admin-questions-tab">
      <div className="card-box aq-panel">
        <div className="aq-header">
          <div>
            <h3>Question Bank Performance &amp; Analytics ({filtered.length})</h3>
            <p className="aq-desc">
              Track candidate attempts, completion rates, submission success, and time spent across the 22,222 question catalog.
            </p>
          </div>

          <div className="aq-controls">
            <input
              type="text"
              className="search-field"
              placeholder="Search question ID or title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <select
              className="role-dropdown"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="Machine Coding">Machine Coding</option>
              <option value="Frontend Core">Frontend Core</option>
              <option value="React">ReactJS</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Performance">Performance</option>
              <option value="System Design">System Design</option>
            </select>

            {(search || categoryFilter !== 'ALL') && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSearch('')
                  setCategoryFilter('ALL')
                }}
                title="Reset filters"
              >
                ✕ Reset
              </button>
            )}

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onRefresh}
              title="Synchronize question analytics"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Question ID</th>
                <th>Title / Challenge</th>
                <th>Category</th>
                <th>Candidates Attempted</th>
                <th>Submissions</th>
                <th>Completion Rate</th>
                <th>Success Rate</th>
                <th>Avg Attempts</th>
                <th>Avg Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '48px 24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '2rem' }}>🔍</span>
                      <strong style={{ fontSize: '1rem', color: 'var(--h-text-white)' }}>
                        No questions match the current filters
                      </strong>
                      <span style={{ fontSize: '0.84rem', color: 'var(--h-text-muted)' }}>
                        Try searching with a different keyword or category.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(q => (
                  <tr key={q.id}>
                    <td>
                      <span className="aq-qid-tag">{q.id}</span>
                    </td>
                    <td>
                      <span className="aq-title">{q.title}</span>
                    </td>
                    <td>
                      <span className="aq-category-badge">{q.category}</span>
                    </td>
                    <td>
                      <strong className="aq-num-bold">{q.attemptsCount}</strong>
                    </td>
                    <td>
                      <span className="aq-num-sub">{q.submissionsCount}</span>
                    </td>
                    <td>
                      <div className="progress-cell">
                        <div className="mini-track">
                          <div
                            className="mini-fill"
                            style={{
                              width: `${Math.max(5, q.completionRate)}%`,
                              background:
                                q.completionRate >= 70
                                  ? 'var(--h-brand-green)'
                                  : q.completionRate >= 40
                                  ? 'var(--h-brand-gradient)'
                                  : 'var(--h-brand-amber)',
                            }}
                          />
                        </div>
                        <span className="mini-pct">{q.completionRate}%</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          q.successRate >= 60
                            ? 'badge-active'
                            : q.successRate > 0
                            ? 'badge-amber'
                            : 'badge-suspended'
                        }`}
                      >
                        {q.successRate}%
                      </span>
                    </td>
                    <td>
                      <span className="aq-num-sub">{q.avgAttempts}x</span>
                    </td>
                    <td>
                      <span className="aq-time-text">
                        {q.avgTimeSpentSeconds > 0 ? `${Math.round(q.avgTimeSpentSeconds / 60)}m` : '< 1m'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
