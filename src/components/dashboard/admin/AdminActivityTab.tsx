import { useState, useMemo } from 'react'
import type { AdminActivityFeedItem } from '../../../lib/adminAnalyticsService'

interface AdminActivityTabProps {
  activityList?: AdminActivityFeedItem[]
  initialFeed?: AdminActivityFeedItem[]
  onRefresh?: () => void
}

export default function AdminActivityTab({
  activityList,
  initialFeed,
  onRefresh,
}: AdminActivityTabProps) {
  const [actionFilter, setActionFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  const effectiveList = activityList || initialFeed || []

  const filtered = useMemo(() => {
    return effectiveList.filter(item => {
      const matchAction = actionFilter === 'ALL' || item.action === actionFilter
      const matchSearch =
        !search ||
        item.formattedText.toLowerCase().includes(search.toLowerCase()) ||
        item.userName.toLowerCase().includes(search.toLowerCase()) ||
        item.userEmail.toLowerCase().includes(search.toLowerCase())
      return matchAction && matchSearch
    })
  }, [effectiveList, actionFilter, search])

  return (
    <div className="admin-activity-tab">
      <div className="card-box act-panel">
        <div className="act-header">
          <div>
            <h3>Candidate Chronological Activity Feed ({filtered.length})</h3>
            <p className="act-desc">
              Real-time audit log of user problem views, sandbox code runs, test submissions, and question completions.
            </p>
          </div>

          <div className="act-controls">
            <input
              type="text"
              className="search-field"
              placeholder="Search activity, user, or question..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <select
              className="role-dropdown"
              value={actionFilter}
              onChange={e => setActionFilter(e.target.value)}
            >
              <option value="ALL">All Actions</option>
              <option value="question_viewed">Question Viewed</option>
              <option value="question_started">Question Started</option>
              <option value="code_run">Code Run</option>
              <option value="answer_submitted">Answer Submitted</option>
              <option value="submission_accepted">Submission Accepted</option>
              <option value="submission_failed">Submission Failed</option>
              <option value="question_completed">Question Completed</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
            </select>

            <button type="button" className="btn btn-secondary btn-sm" onClick={() => onRefresh?.()}>
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Chronological Activity Feed Stream */}
        <div className="activity-feed-timeline">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
              No chronological events recorded matching current filters.
            </div>
          ) : (
            filtered.map(act => (
              <div key={act.id} className="act-timeline-item">
                <div className="act-time-col">
                  <span className="act-time-badge">{act.timeStr}</span>
                  <span className="act-date-sub">
                    {new Date(act.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <div className="act-dot-col">
                  <span className="act-bullet-dot" style={{ backgroundColor: act.badgeColor }} />
                  <div className="act-line" />
                </div>

                <div className="act-content-card">
                  <div className="act-content-header">
                    <span className="act-text">{act.formattedText}</span>
                    <span className="act-action-pill" style={{ borderColor: act.badgeColor, color: act.badgeColor }}>
                      {act.action}
                    </span>
                  </div>
                  {act.userEmail && (
                    <div className="act-user-meta">
                      <span>👤 {act.userName}</span>
                      <span>({act.userEmail})</span>
                    </div>
                  )}
                  {act.rawMetadata && Object.keys(act.rawMetadata).length > 0 && (
                    <div className="act-metadata-row">
                      {Object.entries(act.rawMetadata).map(([k, v]) => (
                        <span key={k} className="act-meta-tag">
                          {k}: <strong>{String(v)}</strong>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
