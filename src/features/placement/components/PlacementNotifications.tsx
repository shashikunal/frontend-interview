import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { usePlacement } from '../hooks/usePlacement'
import { usePlacementReadiness } from '../hooks/usePlacementReadiness'
import { PLACEMENT_DAY_DEFINITIONS } from '../data/curriculum'

interface Notification {
  id: string
  type: 'milestone' | 'deadline' | 'achievement' | 'reminder' | 'alert'
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: 'low' | 'medium' | 'high'
}

export default function PlacementNotifications() {
  const { user } = useAuth()
  const userId = user?.id
  const { progress, priority } = usePlacement(userId)
  const { readiness } = usePlacementReadiness(userId)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'milestone' | 'deadline' | 'achievement'>('all')

  useEffect(() => {
    if (!userId || !progress) return

    const generated: Notification[] = []
    const now = new Date().toISOString()

    const currentDay = progress.currentDay ?? 1
    const daysCompleted = progress.daysCompleted?.length ?? 0
    const totalDays = PLACEMENT_DAY_DEFINITIONS.length

    if (daysCompleted > 0 && daysCompleted % 7 === 0) {
      generated.push({
        id: `milestone-${daysCompleted}`,
        type: 'milestone',
        title: `${daysCompleted} Days Complete!`,
        message: `You have completed ${daysCompleted} days of the placement program. Keep going!`,
        timestamp: now,
        read: false,
        priority: 'high',
      })
    }

    const currentDayDef = PLACEMENT_DAY_DEFINITIONS.find((d) => d.dayNumber === currentDay)
    if (currentDayDef?.isMilestone) {
      generated.push({
        id: `milestone-day-${currentDay}`,
        type: 'milestone',
        title: `Day ${currentDay} Milestone`,
        message: `Today is a milestone day: ${currentDayDef.title}. Complete it to unlock the next phase.`,
        timestamp: now,
        read: false,
        priority: 'high',
      })
    }

    if (priority.length > 0) {
      const pendingCount = priority.filter((p) => p.completed < p.target).length
      if (pendingCount > 0) {
        generated.push({
          id: 'daily-reminder',
          type: 'reminder',
          title: 'Daily Tasks Pending',
          message: `You have ${pendingCount} tasks remaining for today. Complete them to stay on track.`,
          timestamp: now,
          read: false,
          priority: 'medium',
        })
      }
    }

    if (readiness) {
      if (readiness.isJobReady) {
        generated.push({
          id: 'job-ready',
          type: 'achievement',
          title: 'Job Ready!',
          message: 'Congratulations! You have met all readiness criteria. Start applying to companies!',
          timestamp: now,
          read: false,
          priority: 'high',
        })
      } else if (readiness.blockingReasons.length > 0) {
        generated.push({
          id: 'readiness-alert',
          type: 'alert',
          title: 'Readiness Update',
          message: `You have ${readiness.blockingReasons.length} areas that need attention. Check your readiness report.`,
          timestamp: now,
          read: false,
          priority: 'medium',
        })
      }
    }

    if (currentDay >= totalDays - 3 && currentDay < totalDays) {
      generated.push({
        id: 'program-ending',
        type: 'deadline',
        title: 'Program Ending Soon',
        message: `Only ${totalDays - currentDay} days left in the program. Make sure you have completed all milestones.`,
        timestamp: now,
        read: false,
        priority: 'high',
      })
    }

    setNotifications(generated)
  }, [userId, progress, priority, readiness])

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true
    if (filter === 'unread') return !n.read
    return n.type === filter
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'milestone': return '🏆'
      case 'deadline': return '⏰'
      case 'achievement': return '🎉'
      case 'reminder': return '📌'
      case 'alert': return '⚠️'
      default: return '📋'
    }
  }

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high': return '#dc2626'
      case 'medium': return '#ca8a04'
      case 'low': return '#16a34a'
      default: return '#6b7280'
    }
  }

  return (
    <div>
      <div className="placement-card" style={{ marginBottom: 18 }}>
        <h2>Notifications</h2>
        <p>
          Stay updated with your progress, milestones, and important deadlines.
        </p>
        {unreadCount > 0 && (
          <div className="placement-actions" style={{ marginTop: 12 }}>
            <span className="placement-badge info">{unreadCount} unread</span>
            <button type="button" className="btn btn-sm" onClick={markAllAsRead}>
              Mark all as read
            </button>
          </div>
        )}
        <div className="placement-actions" style={{ marginTop: 12 }}>
          {(['all', 'unread', 'milestone', 'deadline', 'achievement'] as const).map((f) => (
            <button
              key={f}
              type="button"
              className={`btn btn-sm ${filter === f ? 'btn-primary' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="placement-list">
          {filtered.map((notification) => (
            <div
              key={notification.id}
              className="placement-card"
              style={{
                marginBottom: 12,
                borderLeft: `4px solid ${getPriorityColor(notification.priority)}`,
                opacity: notification.read ? 0.7 : 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: '1.2rem' }}>{getIcon(notification.type)}</span>
                    <strong>{notification.title}</strong>
                    {!notification.read && (
                      <span className="placement-badge info">New</span>
                    )}
                  </div>
                  <p style={{ margin: '4px 0', color: 'var(--text-secondary)' }}>
                    {notification.message}
                  </p>
                  <p className="placement-inline-note">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="placement-empty">
          No notifications at this time. Complete tasks and reach milestones to see updates here.
        </div>
      )}
    </div>
  )
}
