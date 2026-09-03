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

    // 1. Instant Real-Time WebSocket & BroadcastChannel subscription
    const unsub = auditService.subscribeToAccessRequests(() => {
      loadNotifications()
    })

    // 2. Active 2-second heartbeat
    const interval = setInterval(loadNotifications, 2000)

    return () => {
      unsub()
      clearInterval(interval)
    }
  }, [loadNotifications])

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
    setNotifications(prev =>
      prev.map(n => (n.id === notifId ? { ...n, status: 'DECLINED' } : n))
    )
    setFeedbackMsg('Request declined.')
    setTimeout(() => setFeedbackMsg(null), 3000)
  }

  // Simulate candidate request for instant verification
  const handleCreateTestRequest = async () => {
    await auditService.logEvent({
      userId: 'usr_candidate_demo',
      action: 'FEATURE_ACCESS_REQUESTED',
      resource: 'system_design',
      details: {
        featureName: 'System Design Studio',
        userEmail: 'candidate@faang.io',
        userName: 'Alex Rivers (Candidate)',
        currentRole: 'candidate',
      },
    })
    await loadNotifications()
    setFeedbackMsg('Created access request for candidate@faang.io!')
    setTimeout(() => setFeedbackMsg(null), 3000)
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
              <span className="abd-status-pill">{pendingCount} Pending</span>
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
              <div className="abd-empty" style={{ padding: '20px 12px', textAlign: 'center' }}>
                <span style={{ fontSize: '1.6rem', display: 'block', marginBottom: '8px' }}>🎉</span>
                <p style={{ margin: '0 0 12px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  No pending access requests.
                </p>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={handleCreateTestRequest}
                  style={{ fontSize: '0.76rem', padding: '6px 12px', fontWeight: 700 }}
                >
                  ⚡ Simulate Candidate Request
                </button>
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
                      <span className={`abd-tag ${notif.status.toLowerCase()}`}>
                        {notif.status}
                      </span>
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
