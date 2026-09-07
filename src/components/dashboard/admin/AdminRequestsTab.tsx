import { useState, useMemo } from 'react'
import type { AccessNotificationItem } from '../../../features/auth/services/audit.service'
import './AdminRequestsTab.css'

interface AdminRequestsTabProps {
  notifications: AccessNotificationItem[]
  pendingRequestsCount: number
  onApprove: (notif: AccessNotificationItem) => void
  onDecline: (id: string, email: string, feature: string) => void
  onDelete: (id: string) => void
  onClearAll: () => void
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

function getFeatureIcon(featureName: string): string {
  const f = featureName.toLowerCase()
  if (f.includes('design')) return '🏗️'
  if (f.includes('question') || f.includes('22k')) return '📚'
  if (f.includes('mock') || f.includes('video')) return '🎥'
  if (f.includes('analytics')) return '📊'
  if (f.includes('code') || f.includes('machine')) return '💻'
  return '🔒'
}

export default function AdminRequestsTab({
  notifications,
  pendingRequestsCount,
  onApprove,
  onDecline,
  onDelete,
  onClearAll,
  onInspectUser,
}: AdminRequestsTabProps) {
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [search, setSearch] = useState('')

  // Top KPI Stats
  const stats = useMemo(() => {
    let pending = 0
    let approved = 0
    let declined = 0

    notifications.forEach(n => {
      if (n.status === 'PENDING') pending++
      else if (n.status === 'APPROVED') approved++
      else if (n.status === 'DECLINED') declined++
    })

    const effectivePending = pendingRequestsCount !== undefined ? pendingRequestsCount : pending

    return {
      total: notifications.length,
      pending: effectivePending,
      approved,
      declined,
    }
  }, [notifications, pendingRequestsCount])

  // Filtered list
  const filtered = useMemo(() => {
    return notifications.filter(n => {
      const matchStatus = statusFilter === 'ALL' || n.status === statusFilter
      const s = search.trim().toLowerCase()
      const matchSearch =
        !s ||
        n.userName.toLowerCase().includes(s) ||
        n.userEmail.toLowerCase().includes(s) ||
        n.featureName.toLowerCase().includes(s) ||
        n.status.toLowerCase().includes(s)

      return matchStatus && matchSearch
    })
  }, [notifications, statusFilter, search])

  // Bulk approve all pending
  const handleBatchApprove = () => {
    const pendingList = notifications.filter(n => n.status === 'PENDING')
    pendingList.forEach(n => onApprove(n))
  }

  return (
    <div className="admin-requests-tab">
      {/* Top 4 KPI Metrics Widgets */}
      <div className="req-stats-grid">
        <div className="req-stat-card">
          <div className="req-stat-icon-wrap amber">📩</div>
          <div className="req-stat-info">
            <span className="req-stat-label">Pending Approval</span>
            <span className="req-stat-value">{stats.pending}</span>
            <span className="req-stat-sub">Requires administrator action</span>
          </div>
        </div>

        <div className="req-stat-card">
          <div className="req-stat-icon-wrap green">✅</div>
          <div className="req-stat-info">
            <span className="req-stat-label">Access Granted</span>
            <span className="req-stat-value">{stats.approved}</span>
            <span className="req-stat-sub">Unlocked features in Supabase</span>
          </div>
        </div>

        <div className="req-stat-card">
          <div className="req-stat-icon-wrap red">❌</div>
          <div className="req-stat-info">
            <span className="req-stat-label">Declined Requests</span>
            <span className="req-stat-value">{stats.declined}</span>
            <span className="req-stat-sub">Dismissed / restricted</span>
          </div>
        </div>

        <div className="req-stat-card">
          <div className="req-stat-icon-wrap purple">🛡️</div>
          <div className="req-stat-info">
            <span className="req-stat-label">Total Entitlement Requests</span>
            <span className="req-stat-value">{stats.total}</span>
            <span className="req-stat-sub">Historical access audit log</span>
          </div>
        </div>
      </div>

      {/* Main Requests Center Panel */}
      <div className="req-panel">
        <div className="req-header">
          <div className="req-header-top">
            <div className="req-title-box">
              <h3>
                📩 Candidate Feature Access Requests
                <span className={`req-count-badge ${stats.pending === 0 ? 'zero' : ''}`}>
                  {stats.pending} Pending Review
                </span>
              </h3>
              <p className="req-desc">
                When candidates navigate to restricted platform features (such as System Design Studio or the 22,222 Questions Bank), their access requests stream here in real time. Approving grants instantaneous entitlements in Supabase without requiring re-login.
              </p>
            </div>

            <div className="req-header-actions">
              {stats.pending > 0 && (
                <button
                  type="button"
                  className="req-btn-batch-approve"
                  onClick={handleBatchApprove}
                  title="Approve all pending requests in one click"
                >
                  ⚡ Approve All ({stats.pending})
                </button>
              )}

              {notifications.length > 0 && (
                <button
                  type="button"
                  className="req-btn-clear-all"
                  onClick={onClearAll}
                  title="Clear all historical requests"
                >
                  🗑️ Clear All
                </button>
              )}
            </div>
          </div>

          {/* Quick Filter Status Pills */}
          <div className="req-filter-pills">
            <button
              type="button"
              className={`req-pill-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ALL')}
            >
              🛡️ All Requests <span className="req-pill-count">{stats.total}</span>
            </button>
            <button
              type="button"
              className={`req-pill-btn ${statusFilter === 'PENDING' ? 'active' : ''}`}
              onClick={() => setStatusFilter('PENDING')}
            >
              ⏳ Pending <span className="req-pill-count">{stats.pending}</span>
            </button>
            <button
              type="button"
              className={`req-pill-btn ${statusFilter === 'APPROVED' ? 'active' : ''}`}
              onClick={() => setStatusFilter('APPROVED')}
            >
              ✅ Approved <span className="req-pill-count">{stats.approved}</span>
            </button>
            <button
              type="button"
              className={`req-pill-btn ${statusFilter === 'DECLINED' ? 'active' : ''}`}
              onClick={() => setStatusFilter('DECLINED')}
            >
              ❌ Declined <span className="req-pill-count">{stats.declined}</span>
            </button>
          </div>

          {/* Search Toolbar */}
          <div className="req-controls">
            <div className="req-search-wrap">
              <span className="req-search-icon">🔍</span>
              <input
                type="text"
                className="req-search-input"
                placeholder="Search candidate name, email, or requested feature..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="req-search-clear"
                  onClick={() => setSearch('')}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              className="req-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              aria-label="Filter by request status"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Approval</option>
              <option value="APPROVED">Access Granted</option>
              <option value="DECLINED">Declined</option>
            </select>
          </div>
        </div>

        {/* Requests Cards List */}
        {filtered.length === 0 ? (
          <div className="req-empty-box">
            <div className="req-empty-icon">🎉</div>
            <strong className="req-empty-title">
              {notifications.length === 0 ? 'No Pending Access Requests' : 'No Matching Requests'}
            </strong>
            <p className="req-empty-sub">
              {notifications.length === 0
                ? 'All candidate entitlement requests have been reviewed and approved. When a candidate requests access to a locked feature, it will appear here immediately.'
                : 'No requests match your current search or status filter selection.'}
            </p>
            {notifications.length > 0 && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => { setStatusFilter('ALL'); setSearch(''); }}
                style={{ marginTop: '8px' }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="requests-cards-list">
            {filtered.map(notif => {
              const isPending = notif.status === 'PENDING'
              const isApproved = notif.status === 'APPROVED'
              const featureIcon = getFeatureIcon(notif.featureName)
              const relativeTime = getRelativeTime(notif.createdAt)
              const userInitial = notif.userName ? notif.userName.trim().charAt(0).toUpperCase() : 'C'

              return (
                <div key={notif.id} className={`request-card ${notif.status.toLowerCase()}`}>
                  <div className="rc-left">
                    <div className="rc-avatar-circle">{userInitial}</div>

                    <div className="rc-details">
                      <div className="rc-user-row">
                        <button
                          type="button"
                          className="rc-candidate-btn"
                          onClick={() => notif.userId && onInspectUser?.(notif.userId)}
                          title={`Inspect candidate dossier for ${notif.userName}`}
                        >
                          {notif.userName}
                        </button>
                        <span className="rc-email">({notif.userEmail})</span>
                        <span className={`rc-status-pill ${notif.status.toLowerCase()}`}>
                          {notif.status}
                        </span>
                      </div>

                      <div className="rc-feature-row">
                        <span style={{ color: 'var(--h-text-muted)' }}>Requested Entitlement:</span>
                        <span className="rc-feature-badge">
                          {featureIcon} {notif.featureName}
                        </span>
                        <span className="rc-time">
                          🕒 {relativeTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rc-actions">
                    {isPending ? (
                      <>
                        <button
                          type="button"
                          className="btn-approve-action"
                          onClick={() => onApprove(notif)}
                          title="Grant immediate access in Supabase"
                        >
                          ✅ Approve &amp; Grant Access
                        </button>
                        <button
                          type="button"
                          className="btn-decline-action"
                          onClick={() => onDecline(notif.id, notif.userEmail, notif.featureName)}
                          title="Decline this request"
                        >
                          ❌ Decline
                        </button>
                      </>
                    ) : isApproved ? (
                      <span className="approved-pill-badge">
                        ✅ Access Granted in Supabase
                      </span>
                    ) : (
                      <span className="declined-pill-badge">
                        ❌ Request Dismissed
                      </span>
                    )}

                    {notif.userId && (
                      <button
                        type="button"
                        className="rc-dossier-link"
                        onClick={() => notif.userId && onInspectUser?.(notif.userId)}
                        title={`View ${notif.userName}'s candidate profile`}
                      >
                        👤 Dossier
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn-dismiss-action"
                      onClick={() => onDelete(notif.id)}
                      title="Dismiss notification"
                      aria-label="Dismiss notification"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
