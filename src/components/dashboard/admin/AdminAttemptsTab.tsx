import { useState, useMemo } from 'react'
import type { AdminAttemptItem } from '../../../lib/adminAnalyticsService'
import { MACHINE_CODING_CATALOG } from '../../machinecoding/data/machineCodingCatalog'

interface AdminAttemptsTabProps {
  attempts?: AdminAttemptItem[]
  initialAttempts?: AdminAttemptItem[]
  onRefresh?: () => void
  onViewCode?: (attempt: AdminAttemptItem) => void
  onInspectUser?: (userId: string) => void
}

export default function AdminAttemptsTab({
  attempts,
  initialAttempts,
  onRefresh,
  onViewCode,
  onInspectUser,
}: AdminAttemptsTabProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [langFilter, setLangFilter] = useState('ALL')
  const [trackFilter, setTrackFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  const effectiveList = attempts || initialAttempts || []

  const isItemCPAttempt = (a: AdminAttemptItem) =>
    a.category === 'CORE_PROGRAMMING' ||
    a.track === 'CORE_PROGRAMMING' ||
    a.questionId.toUpperCase().startsWith('JS-P') ||
    a.questionId.toUpperCase().startsWith('JSP') ||
    a.questionId.toUpperCase().startsWith('CP') ||
    MACHINE_CODING_CATALOG.find(q => q.id.toLowerCase() === a.questionId.toLowerCase())?.category === 'JavaScript'

  const filtered = useMemo(() => {
    return effectiveList.filter(a => {
      const matchStatus = statusFilter === 'ALL' || a.status === statusFilter
      const matchLang = langFilter === 'ALL' || (a.language && a.language.toLowerCase().includes(langFilter.toLowerCase()))
      const cat = a.category || a.track
      const isCP = isItemCPAttempt(a)
      const matchTrack = trackFilter === 'ALL' ||
        (trackFilter === 'CORE_PROGRAMMING' && isCP) ||
        (trackFilter === 'DSA' && !isCP && a.questionId.toUpperCase().startsWith('DSA')) ||
        (trackFilter === 'FRONTEND_JS' && !isCP && (cat === 'FRONTEND_JS' || a.questionId.toUpperCase().startsWith('FJP'))) ||
        (trackFilter === 'MACHINE_CODING' && !isCP && (!cat || cat === 'MACHINE_CODING'))
      const s = search.toLowerCase()
      const matchSearch =
        !search ||
        a.questionId.toLowerCase().includes(s) ||
        (a.questionTitle && a.questionTitle.toLowerCase().includes(s)) ||
        a.userId.toLowerCase().includes(s) ||
        (a.userName && a.userName.toLowerCase().includes(s)) ||
        (a.userEmail && a.userEmail.toLowerCase().includes(s)) ||
        (a.language && a.language.toLowerCase().includes(s))
      return matchStatus && matchLang && matchTrack && matchSearch
    })
  }, [effectiveList, statusFilter, langFilter, trackFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, currentPage, pageSize])

  const handleFilterChange = (setter: (val: string) => void, val: string) => {
    setter(val)
    setCurrentPage(1)
  }

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0s'
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return m > 0 ? `${m}m ${s}s` : `${s}s`
  }

  return (
    <div className="admin-attempts-tab">
      <div className="card-box aa-panel">
        <div className="aa-header">
          <div>
            <h3>Candidate Problem-Solving Attempts &amp; Code ({filtered.length})</h3>
            <p className="aa-desc">
              Inspect what candidates wrote for each problem, including source code, execution runtime, test assertions, and active solving duration.
            </p>
          </div>

          <div className="aa-controls">
            <input
              type="text"
              className="search-field"
              placeholder="Search challenge, candidate, or language..."
              value={search}
              onChange={e => handleFilterChange(setSearch, e.target.value)}
            />

            <select
              className="role-dropdown"
              value={statusFilter}
              onChange={e => handleFilterChange(setStatusFilter, e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="started">Started</option>
              <option value="abandoned">Abandoned</option>
            </select>

            <select
              className="role-dropdown"
              value={trackFilter}
              onChange={e => handleFilterChange(setTrackFilter, e.target.value)}
            >
              <option value="ALL">All Tracks</option>
              <option value="MACHINE_CODING">⚡ Machine Coding</option>
              <option value="DSA">🧠 DSA Masterclass</option>
              <option value="CORE_PROGRAMMING">💻 Core Programming</option>
              <option value="FRONTEND_JS">🌐 Frontend JS</option>
              <option value="AI_MOCK">🎥 AI Video Mock</option>
            </select>

            <select
              className="role-dropdown"
              value={langFilter}
              onChange={e => handleFilterChange(setLangFilter, e.target.value)}
            >
              <option value="ALL">All Languages</option>
              <option value="typescript">TypeScript</option>
              <option value="react">React (TSX)</option>
              <option value="javascript">JavaScript</option>
            </select>

            <button type="button" className="btn btn-secondary btn-sm" onClick={() => onRefresh?.()}>
              🔄 Refresh
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Attempt ID</th>
                <th>Candidate</th>
                <th>Question &amp; Challenge</th>
                <th>Candidate Code</th>
                <th>Status</th>
                <th>Time Spent</th>
                <th>Attempt #</th>
                <th>Started At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>💻</div>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>No problem attempts found.</strong>
                    <p style={{ margin: '6px 0 0', fontSize: '0.84rem' }}>
                      Try adjusting your search filters or click <strong>Refresh</strong>.
                    </p>
                  </td>
                </tr>
              ) : (
                paginated.map(att => {
                  const lineCount = att.linesOfCode || (att.code ? att.code.split('\n').length : 0)

                  return (
                    <tr key={att.id}>
                      <td>
                        <code style={{ fontSize: '11px', color: '#94a3b8' }}>{att.id.slice(0, 11)}...</code>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="h-user-btn"
                          onClick={() => att.userId && onInspectUser?.(att.userId)}
                          title={`View candidate dossier for ${att.userName || 'Candidate'}`}
                        >
                          <div className="h-avatar-circle">
                            {(att.userName || 'C').charAt(0).toUpperCase()}
                          </div>
                          <div className="sub-user-cell">
                            <span className="sub-user-name">{att.userName || 'Candidate'}</span>
                            <span className="sub-user-email">
                              {att.userEmail || (att.userId ? `${att.userId.slice(0, 8)}...` : '')}
                            </span>
                          </div>
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <span
                              className="aq-qid-tag clickable"
                              onClick={() => onViewCode?.(att)}
                              title="Click to view candidate code"
                              style={{ cursor: 'pointer' }}
                            >
                              #{att.questionId}
                            </span>
                            {(() => {
                              const cat = att.category || att.track
                              if (cat === 'DSA' || att.questionId.toUpperCase().startsWith('DSA')) {
                                return (
                                  <span className="submission-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '10px', padding: '2px 6px', fontWeight: 600 }}>
                                    🧠 DSA
                                  </span>
                                )
                              }
                              if (cat === 'CORE_PROGRAMMING' || att.questionId.toUpperCase().startsWith('JS-P') || att.questionId.toUpperCase().startsWith('JSP')) {
                                return (
                                  <span className="submission-pill" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', fontSize: '10px', padding: '2px 6px', fontWeight: 600 }}>
                                    💻 Core
                                  </span>
                                )
                              }
                              if (cat === 'FRONTEND_JS' || att.questionId.toUpperCase().startsWith('FJP')) {
                                return (
                                  <span className="submission-pill" style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9', fontSize: '10px', padding: '2px 6px', fontWeight: 600 }}>
                                    🌐 Frontend JS
                                  </span>
                                )
                              }
                              if (cat === 'AI_MOCK') {
                                return (
                                  <span className="submission-pill" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', fontSize: '10px', padding: '2px 6px', fontWeight: 600 }}>
                                    🎥 AI Mock
                                  </span>
                                )
                              }
                              return (
                                <span className="submission-pill" style={{ background: 'rgba(67, 24, 255, 0.12)', color: '#4318FF', fontSize: '10px', padding: '2px 6px', fontWeight: 600 }}>
                                  ⚡ Machine Coding
                                </span>
                              )
                            })()}
                            <span className="lang-tag" style={{ fontSize: '0.65rem' }}>
                              {att.language || 'typescript'}
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: '0.84rem',
                              fontWeight: 700,
                              color: 'var(--h-text-white, #2b3674)',
                              cursor: 'pointer',
                            }}
                            onClick={() => onViewCode?.(att)}
                            title="Click to inspect code"
                          >
                            {att.questionTitle || `Challenge #${att.questionId}`}
                          </span>
                        </div>
                      </td>
                      <td>
                        {/* Interactive Code Button with line count */}
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary att-code-btn"
                          onClick={() => onViewCode?.(att)}
                          title="Click to view full candidate source code"
                        >
                          <span className="att-code-icon">💻</span>
                          <span className="att-code-label">View Code</span>
                          <span className="att-code-pill">
                            {lineCount > 0 ? `${lineCount} lines` : 'View'}
                          </span>
                        </button>
                      </td>
                      <td>
                        <span className={`submission-pill ${att.status === 'completed' ? 'accepted' : 'pending'}`}>
                          {att.status}
                        </span>
                      </td>
                      <td>
                        <strong>{formatDuration(att.timeSpent)}</strong>
                      </td>
                      <td>
                        <span className="attempt-badge-pill">#{att.attemptCount}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', color: 'var(--h-text-muted)' }}>
                          {new Date(att.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                          {new Date(att.startedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions-row">
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary att-action-inspect-btn"
                            onClick={() => onViewCode?.(att)}
                            title="Inspect what candidate wrote"
                          >
                            👁️ Code
                          </button>
                          {att.userId && onInspectUser && (
                            <button
                              type="button"
                              className="btn btn-sm btn-secondary"
                              onClick={() => onInspectUser(att.userId)}
                              title="View full candidate profile"
                              style={{ fontSize: '0.74rem' }}
                            >
                              👤
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {filtered.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderTop: '1px solid var(--border-color, rgba(255,255,255,0.08))',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Showing {Math.min((currentPage - 1) * pageSize + 1, filtered.length)}–
              {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} attempts
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                ← Prev
              </button>

              <span style={{ fontSize: '13px', padding: '0 8px', color: 'var(--text-primary)' }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                className="btn btn-sm btn-secondary"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                Next →
              </button>

              <select
                className="role-dropdown"
                style={{ marginLeft: '12px', padding: '4px 8px', fontSize: '12px' }}
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(1)
                }}
              >
                <option value={10}>10 / page</option>
                <option value={25}>25 / page</option>
                <option value={50}>50 / page</option>
                <option value={100}>100 / page</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
