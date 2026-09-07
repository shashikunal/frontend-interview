import { useState, useMemo } from 'react'
import type { QuestionAttempt } from '../../../lib/trackingService'

interface AdminAttemptsTabProps {
  attempts?: QuestionAttempt[]
  initialAttempts?: QuestionAttempt[]
  onRefresh?: () => void
}

export default function AdminAttemptsTab({
  attempts,
  initialAttempts,
  onRefresh,
}: AdminAttemptsTabProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  const effectiveList = attempts || initialAttempts || []

  const filtered = useMemo(() => {
    return effectiveList.filter(a => {
      const matchStatus = statusFilter === 'ALL' || a.status === statusFilter
      const matchSearch =
        !search ||
        a.questionId.toLowerCase().includes(search.toLowerCase()) ||
        a.userId.toLowerCase().includes(search.toLowerCase())
      return matchStatus && matchSearch
    })
  }, [effectiveList, statusFilter, search])

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
            <h3>Question Problem Solving Attempts ({filtered.length})</h3>
            <p className="aa-desc">
              Tracks when candidates open, start, spend active time, and finish each coding challenge.
            </p>
          </div>

          <div className="aa-controls">
            <input
              type="text"
              className="search-field"
              placeholder="Search by question ID or user ID..."
              value={search}
              onChange={e => handleFilterChange(setSearch, e.target.value)}
            />

            <select
              className="role-dropdown"
              value={statusFilter}
              onChange={e => handleFilterChange(setStatusFilter, e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="started">Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="abandoned">Abandoned</option>
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
                <th>User ID</th>
                <th>Question ID</th>
                <th>Status</th>
                <th>Time Spent</th>
                <th>Attempt Count</th>
                <th>Started At</th>
                <th>Completed At</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No attempt records found.
                  </td>
                </tr>
              ) : (
                paginated.map(att => (
                  <tr key={att.id}>
                    <td>
                      <code style={{ fontSize: '11px', color: '#94a3b8' }}>{att.id.slice(0, 12)}...</code>
                    </td>
                    <td>
                      <code style={{ fontSize: '11px', color: '#60a5fa' }}>{att.userId.slice(0, 8)}...</code>
                    </td>
                    <td>
                      <span className="aq-qid-tag">{att.questionId}</span>
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
                      {att.attemptCount}
                    </td>
                    <td>
                      {new Date(att.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                      {new Date(att.startedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </td>
                    <td>
                      {att.completedAt ? (
                        <>
                          {new Date(att.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                          {new Date(att.completedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>In progress</span>
                      )}
                    </td>
                  </tr>
                ))
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
