import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { auditService, type AccessNotificationItem } from '../../features/auth/services/audit.service'
import './AdminNotificationBell.css'

export default function AdminNotificationBell() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [notifications, setNotifications] = useState<AccessNotificationItem[]>([])
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null)
  const bellRef = useRef<HTMLDivElement | null>(null)

  // Fetch access notifications
  const loadNotifications = useCallback(async () => {
    try {
      const items = await auditService.getAccessNotifications()
      setNotifications(items)
    } catch {
      // Fallback items handled inside auditService
    }
  }, [])

  useEffect(() => {
    loadNotifications()

    // Real-Time subscription for incoming access requests
    const unsub = auditService.subscribeToAccessRequests(() => {
      loadNotifications()
    })

    return () => {
      unsub()
    }
  }, [loadNotifications])

  // Refresh when user opens the notification bell
  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen, loadNotifications])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Pending count
  const pendingCount = notifications.filter(n => n.status === 'PENDING').length

  // Approve action
  const handleApprove = async (e: React.MouseEvent, notif: AccessNotificationItem) => {
    e.stopPropagation()
    const res = await auditService.approveAccessRequest(notif)
    if (res.success) {
      setNotifications(prev =>
        prev.map(n => (n.id === notif.id ? { ...n, status: 'APPROVED' } : n))
      )
      setFeedbackMsg(`Granted '${notif.featureName}' to ${notif.userName}!`)
      setTimeout(() => setFeedbackMsg(null), 3000)
    }
  }

  // Decline action
  const handleDecline = (e: React.MouseEvent, notifId: string) => {
    e.stopPropagation()
    auditService.declineAccessRequest(notifId)
    setNotifications(prev =>
      prev.map(n => (n.id === notifId ? { ...n, status: 'DECLINED' } : n))
    )
    setFeedbackMsg('Request declined.')
    setTimeout(() => setFeedbackMsg(null), 3000)
  }

  // Dismiss / Delete single notification
  const handleDismiss = (e: React.MouseEvent, notifId: string) => {
    e.stopPropagation()
    auditService.deleteNotification(notifId)
    setNotifications(prev => prev.filter(n => n.id !== notifId))
  }

  // Clear all notifications
  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    auditService.clearAllNotifications()
    setNotifications([])
    setFeedbackMsg('All notifications cleared.')
    setTimeout(() => setFeedbackMsg(null), 2500)
  }

  return (
    <div className="admin-bell-container" ref={bellRef}>
      <button
        type="button"
        className={`admin-bell-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        title={pendingCount > 0 ? `${pendingCount} Pending Access Requests` : 'Admin Notifications'}
        aria-label="Admin Notifications"
      >
        <span className="bell-icon">🔔</span>
        {pendingCount > 0 && (
          <span className="bell-badge-count pulse">{pendingCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="admin-bell-dropdown">
          <div className="abd-header">
            <div className="abd-title-row">
              <span className="abd-title">Admin Access Requests</span>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span className="abd-status-pill">{pendingCount} Pending</span>
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 600,
                    }}
                    title="Clear all notifications"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
            <p className="abd-sub">Candidate requests for locked platform features.</p>
          </div>

          {feedbackMsg && (
            <div className="abd-toast-inline">
              ✅ {feedbackMsg}
            </div>
          )}

          <div className="abd-list">
            {notifications.length === 0 ? (
              <div className="abd-empty" style={{ padding: '24px 12px', textAlign: 'center' }}>
                <span style={{ fontSize: '1.6rem', display: 'block', marginBottom: '8px' }}>🎉</span>
                <p style={{ margin: '0', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  No pending access requests.
                </p>
              </div>
            ) : (
              notifications.slice(0, 6).map(notif => {
                const isPending = notif.status === 'PENDING'
                const isApproved = notif.status === 'APPROVED'

                return (
                  <div
                    key={notif.id}
                    className={`abd-item ${notif.status.toLowerCase()}`}
                  >
                    <div className="abd-item-top">
                      <div className="abd-user-info">
                        <strong>{notif.userName}</strong>
                        <span className="abd-email">{notif.userEmail}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span className={`abd-tag ${notif.status.toLowerCase()}`}>
                          {notif.status}
                        </span>
                        <button
                          type="button"
                          onClick={e => handleDismiss(e, notif.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            fontSize: '0.78rem',
                            padding: '2px 4px',
                            lineHeight: 1,
                            opacity: 0.7,
                          }}
                          title="Dismiss"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div className="abd-feature-badge">
                      🔒 <strong>{notif.featureName}</strong>
                    </div>

                    <div className="abd-item-footer">
                      <span className="abd-time">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      <div className="abd-actions">
                        {isPending ? (
                          <>
                            <button
                              type="button"
                              className="btn btn-sm btn-primary abd-btn-approve"
                              onClick={e => handleApprove(e, notif)}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-secondary abd-btn-decline"
                              onClick={e => handleDecline(e, notif.id)}
                            >
                              Decline
                            </button>
                          </>
                        ) : isApproved ? (
                          <span className="abd-granted-tag">✅ Granted in DB</span>
                        ) : (
                          <span className="abd-declined-tag">Declined</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <div className="abd-footer">
            <Link
              to="/dashboard"
              className="abd-view-all-link"
              onClick={() => setIsOpen(false)}
            >
              Open Admin Command Center ➔
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
