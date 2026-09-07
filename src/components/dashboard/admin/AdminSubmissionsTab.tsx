import { useState, useMemo } from 'react'
import type { AdminSubmissionItem } from '../../../lib/adminAnalyticsService'

interface AdminSubmissionsTabProps {
  submissions?: AdminSubmissionItem[]
  initialSubmissions?: AdminSubmissionItem[]
  onRefresh?: () => void
  onViewCode: (submission: AdminSubmissionItem) => void
}

export default function AdminSubmissionsTab({
  submissions,
  initialSubmissions,
  onRefresh,
  onViewCode,
}: AdminSubmissionsTabProps) {
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [langFilter, setLangFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  const effectiveList = submissions || initialSubmissions || []

  const filtered = useMemo(() => {
    return effectiveList.filter(s => {
      const matchStatus = statusFilter === 'ALL' || s.status === statusFilter
      const matchLang = langFilter === 'ALL' || s.language.toLowerCase().includes(langFilter.toLowerCase())
      const matchSearch =
        !search ||
        s.questionId.toLowerCase().includes(search.toLowerCase()) ||
        (s.userName && s.userName.toLowerCase().includes(search.toLowerCase())) ||
        (s.userEmail && s.userEmail.toLowerCase().includes(search.toLowerCase()))
      return matchStatus && matchLang && matchSearch
    })
  }, [effectiveList, statusFilter, langFilter, search])

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
              Full real-time audit trail of all code runs, assertion evaluations, and candidate submissions.
            </p>
          </div>

          <div className="as-controls">
            <input
              type="text"
              className="search-field"
              placeholder="Search user, email, question..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <select
              className="role-dropdown"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
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
              onChange={e => setLangFilter(e.target.value)}
            >
              <option value="ALL">All Languages</option>
              <option value="javascript">JavaScript</option>
              <option value="react">ReactJS</option>
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
                <th>Question ID</th>
                <th>Language</th>
                <th>Status</th>
                <th>Score</th>
                <th>Exec Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No submission records found.
                  </td>
                </tr>
              ) : (
                filtered.map(sub => (
                  <tr key={sub.id}>
                    <td>
                      <span className="sub-time">
                        {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      <span className="sub-date">
                        {new Date(sub.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </td>
                    <td>
                      <div className="sub-user-cell">
                        <span className="sub-user-name">{sub.userName || 'Candidate'}</span>
                        <span className="sub-user-email">{sub.userEmail || ''}</span>
                      </div>
                    </td>
                    <td>
                      <span className="aq-qid-tag">{sub.questionId}</span>
                    </td>
                    <td>
                      <span className="lang-tag">{sub.language}</span>
                    </td>
                    <td>
                      {getStatusBadge(sub.status)}
                    </td>
                    <td>
                      <strong>{sub.score}%</strong>
                    </td>
                    <td>
                      {sub.executionTime > 0 ? `${sub.executionTime}ms` : '0ms'}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary as-view-code-btn"
                        onClick={() => onViewCode(sub)}
                        title="View Submitted Code"
                      >
                        👁️ View Code
                      </button>
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
