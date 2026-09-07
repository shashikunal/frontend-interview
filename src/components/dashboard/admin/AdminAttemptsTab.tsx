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
              onChange={e => setSearch(e.target.value)}
            />

            <select
              className="role-dropdown"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No attempt records found.
                  </td>
                </tr>
              ) : (
                filtered.map(att => (
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
      </div>
    </div>
  )
}
