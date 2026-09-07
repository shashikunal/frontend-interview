import { useState, useEffect } from 'react'
import { adminAnalyticsService, type AdminUserDetail, type AdminSubmissionItem } from '../../../lib/adminAnalyticsService'

interface AdminUserDetailModalProps {
  userId?: string | null
  userDetail?: AdminUserDetail | null
  isLoading?: boolean
  onClose: () => void
  onViewCode?: (submission: AdminSubmissionItem) => void
}

export default function AdminUserDetailModal({
  userId,
  userDetail: propUserDetail,
  isLoading: propLoading = false,
  onClose,
  onViewCode,
}: AdminUserDetailModalProps) {
  const [activeSubTab, setActiveSubTab] = useState<'submissions' | 'attempts' | 'activity'>('submissions')
  const [fetchedDetail, setFetchedDetail] = useState<AdminUserDetail | null>(null)
  const [loading, setLoading] = useState(propLoading)

  useEffect(() => {
    if (!userId) return
    let isCancelled = false
    setLoading(true)
    adminAnalyticsService.getUserDetailAnalytics(userId)
      .then(res => {
        if (!isCancelled) {
          setFetchedDetail(res)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!isCancelled) setLoading(false)
      })
    return () => {
      isCancelled = true
    }
  }, [userId])

  const userDetail = propUserDetail || fetchedDetail
  const isLoading = loading

  if (!userDetail && !isLoading) return null

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-card user-detail-card" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="am-header">
          <div>
            <span className="am-badge">Candidate Deep Dive &amp; History</span>
            <h2>{userDetail?.name || 'Candidate Details'}</h2>
            <p className="am-sub">
              {userDetail?.email} • Role: <strong style={{ color: '#c084fc', textTransform: 'uppercase' }}>{userDetail?.role}</strong>
            </p>
          </div>
          <button type="button" className="am-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {isLoading ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div className="app-route-spinner" />
            <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Loading user history from Supabase...</p>
          </div>
        ) : userDetail ? (
          <div className="am-body">
            {/* 5 Metric Badges */}
            <div className="aud-stats-grid">
              <div className="aud-stat-box">
                <span className="aud-num" style={{ color: '#22c55e' }}>{userDetail.completedCount}</span>
                <span className="aud-label">Questions Completed</span>
              </div>
              <div className="aud-stat-box">
                <span className="aud-num" style={{ color: '#38bdf8' }}>{userDetail.totalAttempts}</span>
                <span className="aud-label">Questions Attempted</span>
              </div>
              <div className="aud-stat-box">
                <span className="aud-num" style={{ color: '#a855f7' }}>{userDetail.accuracyRate}%</span>
                <span className="aud-label">Accuracy Rate</span>
              </div>
              <div className="aud-stat-box">
                <span className="aud-num" style={{ color: '#f59e0b' }}>{userDetail.avgScore}%</span>
                <span className="aud-label">Average Score</span>
              </div>
              <div className="aud-stat-box">
                <span className="aud-num" style={{ color: '#ec4899' }}>{userDetail.totalTimeMinutes}m</span>
                <span className="aud-label">Total Time Spent</span>
              </div>
            </div>

            {/* Profile Meta Row */}
            <div className="aud-meta-row">
              <div className="aud-meta-item">
                <span>Joined:</span>
                <strong>{new Date(userDetail.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
              </div>
              <div className="aud-meta-item">
                <span>Last Active:</span>
                <strong>{new Date(userDetail.lastActive).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
              </div>
              <div className="aud-meta-item">
                <span>Total Submissions:</span>
                <strong>{userDetail.totalSubmissions}</strong>
              </div>
            </div>

            {/* Modal Inner Tabs */}
            <div className="aud-subtabs-nav">
              <button
                type="button"
                className={`aud-tab ${activeSubTab === 'submissions' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('submissions')}
              >
                📝 Submissions ({userDetail.recentSubmissions.length})
              </button>
              <button
                type="button"
                className={`aud-tab ${activeSubTab === 'attempts' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('attempts')}
              >
                ⏱️ Question Attempts ({userDetail.recentAttempts.length})
              </button>
              <button
                type="button"
                className={`aud-tab ${activeSubTab === 'activity' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('activity')}
              >
                ⚡ Activity History ({userDetail.recentActivities.length})
              </button>
            </div>

            {/* Sub-tab 1: Recent Submissions */}
            {activeSubTab === 'submissions' && (
              <div className="aud-tab-body">
                {userDetail.recentSubmissions.length === 0 ? (
                  <p className="empty-subtab-msg">No submissions recorded for this user yet.</p>
                ) : (
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Question</th>
                        <th>Language</th>
                        <th>Status</th>
                        <th>Score</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userDetail.recentSubmissions.map(sub => (
                        <tr key={sub.id}>
                          <td>{new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                          <td><span className="aq-qid-tag">{sub.questionId}</span></td>
                          <td><span className="lang-tag">{sub.language}</span></td>
                          <td>
                            <span className={`submission-pill ${sub.status === 'accepted' ? 'accepted' : 'wrong'}`}>
                              {sub.status}
                            </span>
                          </td>
                          <td>{sub.score}%</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-xs btn-secondary"
                              onClick={() => onViewCode?.(sub)}
                            >
                              👁️ Code
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Sub-tab 2: Question Attempts */}
            {activeSubTab === 'attempts' && (
              <div className="aud-tab-body">
                {userDetail.recentAttempts.length === 0 ? (
                  <p className="empty-subtab-msg">No problem attempts recorded yet.</p>
                ) : (
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Question ID</th>
                        <th>Status</th>
                        <th>Duration</th>
                        <th>Attempts</th>
                        <th>Started</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userDetail.recentAttempts.map(att => (
                        <tr key={att.id}>
                          <td><span className="aq-qid-tag">{att.questionId}</span></td>
                          <td>
                            <span className={`submission-pill ${att.status === 'completed' ? 'accepted' : 'pending'}`}>
                              {att.status}
                            </span>
                          </td>
                          <td>{att.timeSpent > 0 ? `${Math.round(att.timeSpent / 60)}m` : '< 1m'}</td>
                          <td>{att.attemptCount}</td>
                          <td>{new Date(att.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Sub-tab 3: Activity History */}
            {activeSubTab === 'activity' && (
              <div className="aud-tab-body">
                {userDetail.recentActivities.length === 0 ? (
                  <p className="empty-subtab-msg">No activity events recorded yet.</p>
                ) : (
                  <div className="aud-activity-list">
                    {userDetail.recentActivities.map(act => (
                      <div key={act.id} className="aud-act-item">
                        <span className="aud-act-time">{act.timeStr}</span>
                        <span className="aud-act-text">{act.formattedText}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
