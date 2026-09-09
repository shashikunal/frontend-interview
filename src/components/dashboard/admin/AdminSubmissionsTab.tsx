import { useState, useMemo, useEffect } from 'react'
import type { AdminSubmissionItem } from '../../../lib/adminAnalyticsService'
import { gradingService, type EvaluatorReview } from '../../../lib/gradingService'

interface AdminSubmissionsTabProps {
  submissions?: AdminSubmissionItem[]
  initialSubmissions?: AdminSubmissionItem[]
  onRefresh?: () => void
  onViewCode: (submission: AdminSubmissionItem) => void
  onInspectUser?: (userId: string) => void
}

export default function AdminSubmissionsTab({
  submissions,
  initialSubmissions,
  onRefresh,
  onViewCode,
  onInspectUser,
}: AdminSubmissionsTabProps) {
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [langFilter, setLangFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'MACHINE_CODING' | 'DSA' | 'THEORY'>('ALL')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [reviewsMap, setReviewsMap] = useState<Record<string, EvaluatorReview>>({})

  useEffect(() => {
    gradingService.getAllEvaluatorReviews().then(setReviewsMap)
  }, [submissions])

  const effectiveList = submissions || initialSubmissions || []

  const mcCount = useMemo(() => effectiveList.filter(s => s.isMachineCoding).length, [effectiveList])
  const dsaCount = useMemo(() => effectiveList.filter(s => s.isDSA || s.questionId.startsWith('DSA')).length, [effectiveList])
  const theoryCount = useMemo(() => effectiveList.filter(s => !s.isMachineCoding && !s.isDSA && !s.questionId.startsWith('DSA')).length, [effectiveList])

  const filtered = useMemo(() => {
    return effectiveList.filter(s => {
      const matchStatus = statusFilter === 'ALL' || s.status === statusFilter
      const matchLang = langFilter === 'ALL' || s.language.toLowerCase().includes(langFilter.toLowerCase())
      const isDSAItem = s.isDSA || s.questionId.startsWith('DSA')
      const matchType =
        typeFilter === 'ALL' ||
        (typeFilter === 'MACHINE_CODING' && s.isMachineCoding) ||
        (typeFilter === 'DSA' && isDSAItem) ||
        (typeFilter === 'THEORY' && !s.isMachineCoding && !isDSAItem)

      const matchSearch =
        !search ||
        s.questionId.toLowerCase().includes(search.toLowerCase()) ||
        (s.questionTitle && s.questionTitle.toLowerCase().includes(search.toLowerCase())) ||
        (s.userName && s.userName.toLowerCase().includes(search.toLowerCase())) ||
        (s.userEmail && s.userEmail.toLowerCase().includes(search.toLowerCase()))
      return matchStatus && matchLang && matchType && matchSearch
    })
  }, [effectiveList, statusFilter, langFilter, typeFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, currentPage, pageSize])

  const handleFilterChange = (setter: (val: any) => void, val: any) => {
    setter(val)
    setCurrentPage(1)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <span className="submission-pill accepted">✓ Accepted</span>
      case 'wrong_answer':
        return <span className="submission-pill wrong">✕ Wrong Answer</span>
      case 'runtime_error':
        return <span className="submission-pill error">⚠️ Runtime Error</span>
      case 'compile_error':
        return <span className="submission-pill compile">⚙️ Compile Error</span>
      default:
        return <span className="submission-pill pending">{status}</span>
    }
  }

  return (
    <div className="admin-submissions-tab">
      <div className="card-box as-panel">
        <div className="as-header">
          <div>
            <h3>Candidate Submissions Ledger ({filtered.length})</h3>
            <p className="as-desc">
              Real-time audit trail of machine coding problems, code sandbox evaluations, marks, and candidate submissions.
            </p>

            {/* Quick Type Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn btn-sm ${typeFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleFilterChange(setTypeFilter, 'ALL')}
              >
                All Submissions ({effectiveList.length})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${typeFilter === 'MACHINE_CODING' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleFilterChange(setTypeFilter, 'MACHINE_CODING')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <span>⚡</span>
                <span>Machine Coding ({mcCount})</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm ${typeFilter === 'DSA' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleFilterChange(setTypeFilter, 'DSA')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <span>🧠</span>
                <span>DSA Masterclass ({dsaCount})</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm ${typeFilter === 'THEORY' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleFilterChange(setTypeFilter, 'THEORY')}
              >
                Theory &amp; Algo ({theoryCount})
              </button>
            </div>
          </div>

          <div className="as-controls">
            <input
              type="text"
              className="search-field"
              placeholder="Search user, question, marks..."
              value={search}
              onChange={e => handleFilterChange(setSearch, e.target.value)}
            />

            <select
              className="role-dropdown"
              value={typeFilter}
              onChange={e => handleFilterChange(setTypeFilter, e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="MACHINE_CODING">⚡ Machine Coding Only</option>
              <option value="DSA">🧠 DSA Masterclass</option>
              <option value="THEORY">Theory &amp; Algorithmic</option>
            </select>

            <select
              className="role-dropdown"
              value={statusFilter}
              onChange={e => handleFilterChange(setStatusFilter, e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="accepted">Accepted (100%)</option>
              <option value="wrong_answer">Wrong Answer</option>
              <option value="runtime_error">Runtime Error</option>
              <option value="compile_error">Compile Error</option>
            </select>

            <select
              className="role-dropdown"
              value={langFilter}
              onChange={e => handleFilterChange(setLangFilter, e.target.value)}
            >
              <option value="ALL">All Languages</option>
              <option value="react">ReactJS</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="dom">Vanilla DOM</option>
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
                <th>Timestamp</th>
                <th>Candidate / User</th>
                <th>Submitted Question</th>
                <th>Language</th>
                <th>Status</th>
                <th>Marks / Score</th>
                <th>Exec Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No submission records found.
                  </td>
                </tr>
              ) : (
                paginated.map(sub => {
                  const review = reviewsMap[sub.id]
                  const effectiveScore = review?.score ?? sub.score
                  return (
                    <tr key={sub.id}>
                      <td>
                        <span className="sub-time">
                          {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="sub-date">
                          {new Date(sub.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="h-user-btn"
                          onClick={() => sub.userId && onInspectUser?.(sub.userId)}
                          title={`View candidate dossier for ${sub.userName || 'Candidate'}`}
                        >
                          <div className="h-avatar-circle">
                            {(sub.userName || 'C').charAt(0).toUpperCase()}
                          </div>
                          <div className="sub-user-cell">
                            <span className="sub-user-name">{sub.userName || 'Candidate'}</span>
                            <span className="sub-user-email">{sub.userEmail || ''}</span>
                          </div>
                        </button>
                      </td>
                      <td>
                        <div className="as-question-cell" style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <span className="aq-qid-tag" style={{ fontWeight: 700 }}>#{sub.questionId}</span>
                            {sub.isMachineCoding && (
                              <span className="submission-pill" style={{ background: 'rgba(67, 24, 255, 0.12)', color: '#4318FF', fontSize: '11px', padding: '2px 6px' }}>
                                ⚡ Machine Coding
                              </span>
                            )}
                            {(sub.isDSA || sub.questionId.startsWith('DSA')) && (
                              <span className="submission-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '11px', padding: '2px 6px' }}>
                                🧠 DSA Masterclass
                              </span>
                            )}
                            {review && (
                              <span className="submission-pill" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', fontSize: '10px', padding: '1px 6px', fontWeight: 700 }}>
                                ⭐ Graded
                              </span>
                            )}
                          </div>
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: 600,
                              color: 'var(--text-primary)',
                              maxWidth: '240px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            title={sub.questionTitle || sub.questionId}
                          >
                            {sub.questionTitle || `Question ${sub.questionId}`}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="lang-tag">{sub.language}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          {getStatusBadge(sub.status)}
                          {review && (
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                color: review.decision === 'approved' ? '#10b981' : review.decision === 'needs_work' ? '#f59e0b' : '#ef4444',
                              }}
                            >
                              {review.decision === 'approved' ? '🟢 Hire / Approved' : review.decision === 'needs_work' ? '🟡 Needs Revision' : '🔴 Below Bar'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <strong style={{ fontSize: '14px', color: effectiveScore >= 100 ? '#10b981' : effectiveScore >= 70 ? '#3b82f6' : '#ef4444' }}>
                              {effectiveScore}%
                            </strong>
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                              ({effectiveScore}/100)
                            </span>
                          </div>
                          {review ? (
                            <span style={{ fontSize: '10px', color: '#8b5cf6', fontWeight: 600 }}>
                              ✓ Verified by Evaluator
                            </span>
                          ) : effectiveScore >= 100 ? (
                            <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 600 }}>✓ Full Marks</span>
                          ) : effectiveScore >= 70 ? (
                            <span style={{ fontSize: '10px', color: '#3b82f6', fontWeight: 600 }}>Passed</span>
                          ) : (
                            <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 600 }}>Failed Assertions</span>
                          )}
                        </div>
                      </td>
                      <td>
                        {sub.executionTime > 0 ? `${sub.executionTime}ms` : '0ms'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <button
                            type="button"
                            className={`btn btn-sm ${review ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={() => onViewCode(sub)}
                            style={{ padding: '4px 10px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            title={review ? 'Edit Grade & Feedback' : 'Grade Candidate Submission'}
                          >
                            <span>⭐</span>
                            <span>{review ? 'Edit Grade' : 'Grade'}</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary as-view-code-btn"
                            onClick={() => onViewCode(sub)}
                            title="View Submitted Code"
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                          >
                            👁️
                          </button>
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
              {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} submissions
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
