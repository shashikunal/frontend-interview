import { useState, useMemo } from 'react'
import type { AdminActivityFeedItem } from '../../../lib/adminAnalyticsService'
import './AdminActivityTab.css'

interface AdminActivityTabProps {
  activityList?: AdminActivityFeedItem[]
  initialFeed?: AdminActivityFeedItem[]
  onRefresh?: () => void
  onInspectUser?: (userId: string) => void
}

function getRelativeTime(timestampStr: string): string {
  try {
    const past = new Date(timestampStr).getTime()
    const now = Date.now()
    const diffSec = Math.max(0, Math.floor((now - past) / 1000))
    if (diffSec < 60) return 'Just now'
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin}m ago`
    const diffHours = Math.floor(diffMin / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return new Date(timestampStr).toLocaleDateString([], { month: 'short', day: 'numeric' })
  } catch {
    return 'Recently'
  }
}

function getActionIcon(action: string): string {
  switch (action) {
    case 'answer_submitted':
      return '📝'
    case 'submission_accepted':
      return '✅'
    case 'submission_failed':
      return '❌'
    case 'code_run':
      return '⚡'
    case 'question_completed':
      return '🏆'
    case 'question_started':
      return '🚀'
    case 'question_viewed':
      return '👁️'
    case 'login':
      return '🔐'
    case 'logout':
      return '🚪'
    case 'mock_interview_started':
    case 'mock_interview_completed':
      return '🎥'
    default:
      return '⚡'
  }
}

function getActionBadgeColor(action: string, fallbackColor?: string): string {
  switch (action) {
    case 'submission_accepted':
    case 'question_completed':
      return '#01b574' // green
    case 'submission_failed':
      return '#ee5d50' // red
    case 'answer_submitted':
      return '#a855f7' // purple
    case 'code_run':
      return '#38bdf8' // cyan/blue
    case 'question_started':
      return '#ffb547' // amber
    case 'question_viewed':
      return '#818cf8' // indigo
    case 'login':
      return '#10b981' // emerald
    case 'logout':
      return '#94a3b8' // slate
    default:
      return fallbackColor || '#7551ff'
  }
}

export default function AdminActivityTab({
  activityList,
  initialFeed,
  onRefresh,
  onInspectUser,
}: AdminActivityTabProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [actionDropdown, setActionDropdown] = useState<string>('ALL')
  const [search, setSearch] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  const effectiveList = activityList || initialFeed || []

  // Top KPI Metrics
  const stats = useMemo(() => {
    let submissions = 0
    let codeRuns = 0
    let completed = 0
    const userIds = new Set<string>()

    effectiveList.forEach(item => {
      if (item.userId) userIds.add(item.userId)
      else if (item.userEmail) userIds.add(item.userEmail)

      if (['answer_submitted', 'submission_accepted', 'submission_failed'].includes(item.action)) {
        submissions++
      } else if (item.action === 'code_run') {
        codeRuns++
      } else if (item.action === 'question_completed') {
        completed++
      }
    })

    return {
      total: effectiveList.length,
      submissions,
      codeRuns,
      completed,
      activeUsers: userIds.size,
    }
  }, [effectiveList])

  // Filtered List
  const filtered = useMemo(() => {
    return effectiveList.filter(item => {
      // Category pills filter
      let matchCat = true
      if (categoryFilter === 'SUBMISSIONS') {
        matchCat = ['answer_submitted', 'submission_accepted', 'submission_failed'].includes(item.action)
      } else if (categoryFilter === 'CODE_RUNS') {
        matchCat = item.action === 'code_run'
      } else if (categoryFilter === 'COMPLETED') {
        matchCat = item.action === 'question_completed'
      } else if (categoryFilter === 'QUESTIONS') {
        matchCat = ['question_viewed', 'question_started'].includes(item.action)
      } else if (categoryFilter === 'AUTH') {
        matchCat = ['login', 'logout'].includes(item.action)
      }

      // Dropdown filter
      const matchAction = actionDropdown === 'ALL' || item.action === actionDropdown

      // Search filter
      const s = search.trim().toLowerCase()
      const matchSearch =
        !s ||
        item.formattedText.toLowerCase().includes(s) ||
        item.userName.toLowerCase().includes(s) ||
        item.userEmail.toLowerCase().includes(s) ||
        item.action.toLowerCase().includes(s) ||
        (item.rawMetadata && JSON.stringify(item.rawMetadata).toLowerCase().includes(s))

      return matchCat && matchAction && matchSearch
    })
  }, [effectiveList, categoryFilter, actionDropdown, search])

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, currentPage, pageSize])

  const handleRefresh = () => {
    setIsRefreshing(true)
    onRefresh?.()
    setTimeout(() => setIsRefreshing(false), 600)
  }

  const handleClearFilters = () => {
    setCategoryFilter('ALL')
    setActionDropdown('ALL')
    setSearch('')
    setCurrentPage(1)
  }

  return (
    <div className="admin-activity-tab">
      {/* Top 4 KPI Metrics Widgets */}
      <div className="act-stats-grid">
        <div className="act-stat-card">
          <div className="act-stat-icon-wrap purple">⚡</div>
          <div className="act-stat-info">
            <span className="act-stat-label">Total Activity Events</span>
            <span className="act-stat-value">{stats.total}</span>
            <span className="act-stat-sub">Real-time telemetry stream</span>
          </div>
        </div>

        <div className="act-stat-card">
          <div className="act-stat-icon-wrap green">📝</div>
          <div className="act-stat-info">
            <span className="act-stat-label">Code Submissions</span>
            <span className="act-stat-value">{stats.submissions}</span>
            <span className="act-stat-sub">Evaluated submissions</span>
          </div>
        </div>

        <div className="act-stat-card">
          <div className="act-stat-icon-wrap blue">💻</div>
          <div className="act-stat-info">
            <span className="act-stat-label">Live Code Runs</span>
            <span className="act-stat-value">{stats.codeRuns}</span>
            <span className="act-stat-sub">Test runner executions</span>
          </div>
        </div>

        <div className="act-stat-card">
          <div className="act-stat-icon-wrap amber">👥</div>
          <div className="act-stat-info">
            <span className="act-stat-label">Active Candidates</span>
            <span className="act-stat-value">{stats.activeUsers}</span>
            <span className="act-stat-sub">Engaged in problem solving</span>
          </div>
        </div>
      </div>

      {/* Main Activity Timeline Panel */}
      <div className="act-panel">
        <div className="act-header">
          <div className="act-header-top">
            <div className="act-title-box">
              <h3>
                ⚡ Candidate Chronological Activity Feed
                <span className="act-count-badge">
                  {filtered.length} Event{filtered.length === 1 ? '' : 's'}
                </span>
              </h3>
              <p className="act-desc">
                High-fidelity chronological stream of candidate question views, live test runs, evaluated submissions, and platform sessions.
              </p>
            </div>

            <button
              type="button"
              className={`act-refresh-btn ${isRefreshing ? 'spinning' : ''}`}
              onClick={handleRefresh}
              title="Refresh live activity feed"
            >
              <span className="act-spin-icon">🔄</span> Refresh Feed
            </button>
          </div>

          {/* Quick Filter Category Pills */}
          <div className="act-filter-pills">
            <button
              type="button"
              className={`act-pill-btn ${categoryFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => { setCategoryFilter('ALL'); setCurrentPage(1); }}
            >
              ⚡ All Events <span className="act-pill-count">{stats.total}</span>
            </button>
            <button
              type="button"
              className={`act-pill-btn ${categoryFilter === 'SUBMISSIONS' ? 'active' : ''}`}
              onClick={() => { setCategoryFilter('SUBMISSIONS'); setCurrentPage(1); }}
            >
              📝 Submissions <span className="act-pill-count">{stats.submissions}</span>
            </button>
            <button
              type="button"
              className={`act-pill-btn ${categoryFilter === 'CODE_RUNS' ? 'active' : ''}`}
              onClick={() => { setCategoryFilter('CODE_RUNS'); setCurrentPage(1); }}
            >
              💻 Code Runs <span className="act-pill-count">{stats.codeRuns}</span>
            </button>
            <button
              type="button"
              className={`act-pill-btn ${categoryFilter === 'COMPLETED' ? 'active' : ''}`}
              onClick={() => { setCategoryFilter('COMPLETED'); setCurrentPage(1); }}
            >
              🏆 Completed <span className="act-pill-count">{stats.completed}</span>
            </button>
            <button
              type="button"
              className={`act-pill-btn ${categoryFilter === 'QUESTIONS' ? 'active' : ''}`}
              onClick={() => { setCategoryFilter('QUESTIONS'); setCurrentPage(1); }}
            >
              👁️ Question Views
            </button>
            <button
              type="button"
              className={`act-pill-btn ${categoryFilter === 'AUTH' ? 'active' : ''}`}
              onClick={() => { setCategoryFilter('AUTH'); setCurrentPage(1); }}
            >
              🔐 Auth Sessions
            </button>
          </div>

          {/* Search and Action Dropdown Toolbar */}
          <div className="act-controls">
            <div className="act-search-wrap">
              <span className="act-search-icon">🔍</span>
              <input
                type="text"
                className="act-search-input"
                placeholder="Search candidate name, email, action, or problem..."
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              />
              {search && (
                <button
                  type="button"
                  className="act-search-clear"
                  onClick={() => setSearch('')}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              className="act-select"
              value={actionDropdown}
              onChange={e => { setActionDropdown(e.target.value); setCurrentPage(1); }}
              aria-label="Filter by action"
            >
              <option value="ALL">All Actions</option>
              <option value="answer_submitted">📝 Answer Submitted</option>
              <option value="submission_accepted">✅ Submission Accepted</option>
              <option value="submission_failed">❌ Submission Failed</option>
              <option value="code_run">⚡ Code Run</option>
              <option value="question_completed">🏆 Question Completed</option>
              <option value="question_started">🚀 Question Started</option>
              <option value="question_viewed">👁️ Question Viewed</option>
              <option value="login">🔐 Login</option>
              <option value="logout">🚪 Logout</option>
            </select>

            <select
              className="act-select"
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              aria-label="Items per page"
              style={{ width: '130px' }}
            >
              <option value={15}>15 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>

        {/* Chronological Activity Feed Timeline */}
        <div className="activity-feed-timeline">
          {filtered.length === 0 ? (
            <div className="act-empty-box">
              <div className="act-empty-icon">🔍</div>
              <strong className="act-empty-title">No Activity Events Found</strong>
              <p className="act-empty-sub">
                No chronological platform events match your current search query or filter selection.
              </p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleClearFilters}
                style={{ marginTop: '8px' }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            paginatedList.map(act => {
              const badgeColor = getActionBadgeColor(act.action, act.badgeColor)
              const actionIcon = getActionIcon(act.action)
              const relativeTime = getRelativeTime(act.timestamp)
              const dateObj = new Date(act.timestamp)
              const dateStr = !isNaN(dateObj.getTime())
                ? dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' })
                : 'Today'

              const candidateInitial = act.userName
                ? act.userName.trim().charAt(0).toUpperCase()
                : 'C'

              return (
                <div key={act.id} className="act-timeline-item">
                  {/* Left Column: Formatted Timestamp */}
                  <div className="act-time-col">
                    <span className="act-time-badge">{act.timeStr}</span>
                    <span className="act-relative-sub">{relativeTime}</span>
                    <span className="act-date-sub">{dateStr}</span>
                  </div>

                  {/* Center Column: Glowing Bullet Dot & Connector Line */}
                  <div className="act-dot-col">
                    <span
                      className="act-bullet-dot"
                      style={{
                        backgroundColor: badgeColor,
                        color: badgeColor,
                        boxShadow: `0 0 0 4px var(--h-card), 0 0 10px ${badgeColor}`,
                      }}
                    />
                    <div className="act-line" />
                  </div>

                  {/* Right Column: Card Box with Micro-Data */}
                  <div className="act-content-card">
                    <div className="act-content-header">
                      <div className="act-title-with-icon">
                        <span className="act-type-icon-circle">{actionIcon}</span>
                        <span className="act-text">{act.formattedText}</span>
                      </div>

                      <span
                        className="act-action-pill"
                        style={{
                          borderColor: badgeColor,
                          color: badgeColor,
                          backgroundColor: `${badgeColor}18`,
                        }}
                      >
                        {act.action.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Candidate User Information Strip */}
                    <div className="act-user-meta">
                      <div className="act-avatar-micro">{candidateInitial}</div>
                      <button
                        type="button"
                        className="act-user-btn"
                        onClick={() => act.userId && onInspectUser?.(act.userId)}
                        title={`Inspect ${act.userName}'s candidate dossier`}
                      >
                        <span className="act-user-name">{act.userName || 'Candidate'}</span>
                      </button>
                      {act.userEmail && <span className="act-user-email">({act.userEmail})</span>}

                      {act.userId && (
                        <button
                          type="button"
                          className="act-dossier-pill-btn"
                          onClick={() => act.userId && onInspectUser?.(act.userId)}
                          title={`View ${act.userName}'s full profile dossier`}
                        >
                          👤 Inspect Dossier →
                        </button>
                      )}
                    </div>

                    {/* Metadata Chips if present */}
                    {act.rawMetadata && Object.keys(act.rawMetadata).length > 0 && (
                      <div className="act-metadata-row">
                        {Object.entries(act.rawMetadata).map(([k, v]) => {
                          if (v === null || v === undefined || v === '') return null
                          return (
                            <span key={k} className="act-meta-tag">
                              {k}: <strong>{String(v)}</strong>
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Pagination Controls */}
        {filtered.length > pageSize && (
          <div className="act-pagination-bar">
            <span className="act-pagination-info">
              Showing {(currentPage - 1) * pageSize + 1} – {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} events
            </span>

            <div className="act-pagination-controls">
              <button
                type="button"
                className="act-page-btn"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                title="Previous page"
              >
                ‹ Prev
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pNum = i + 1
                if (totalPages > 5 && currentPage > 3) {
                  pNum = Math.min(totalPages, currentPage - 2 + i)
                }
                return (
                  <button
                    key={pNum}
                    type="button"
                    className={`act-page-btn ${currentPage === pNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pNum)}
                  >
                    {pNum}
                  </button>
                )
              })}

              <button
                type="button"
                className="act-page-btn"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                title="Next page"
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
