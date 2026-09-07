import { useState, useMemo } from 'react'
import type { ActivityLogItem } from '../../../lib/supabase'
import { dbActivityService } from '../../../lib/supabase'
import './AdminTelemetryTab.css'

interface AdminTelemetryTabProps {
  liveActivities: ActivityLogItem[]
  onClearStream: () => void
  onExportCSV: () => void
  isAutoScrollPaused: boolean
  onToggleAutoScroll: () => void
  onInspectUser: (userId: string) => void
  onRefresh?: () => void
}

type EventFilterKey =
  | 'ALL'
  | 'QUESTION_SOLVED'
  | 'QUIZ_SCORED'
  | 'MOCK_COMPLETED'
  | 'TRACK_SWITCHED'
  | 'FEATURE_GRANTED'
  | 'AUTH_SIGN_IN'

function getRelativeTime(timestampStr: string): string {
  try {
    const past = new Date(timestampStr).getTime()
    const now = Date.now()
    const diffSec = Math.max(0, Math.floor((now - past) / 1000))
    if (diffSec < 60) return `${diffSec}s ago`
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin}m ago`
    const diffHours = Math.floor(diffMin / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return 'Yesterday'
    return `${diffDays}d ago`
  } catch {
    return 'Recently'
  }
}

function getEventColor(type: string): { icon: string; color: 'green' | 'amber' | 'purple' | 'cyan' | 'blue'; label: string } {
  switch (type) {
    case 'QUESTION_SOLVED':
      return { icon: '💡', color: 'green', label: 'Question Solved' }
    case 'QUIZ_SCORED':
      return { icon: '🎯', color: 'amber', label: 'Quiz Drill' }
    case 'MOCK_COMPLETED':
      return { icon: '🎥', color: 'purple', label: 'Mock Interview' }
    case 'TRACK_SWITCHED':
      return { icon: '🚀', color: 'cyan', label: 'Track Assigned' }
    case 'FEATURE_GRANTED':
      return { icon: '✨', color: 'green', label: 'Access Granted' }
    case 'AUTH_SIGN_IN':
      return { icon: '🔑', color: 'purple', label: 'Auth Session' }
    case 'FEATURE_REQUESTED':
      return { icon: '📩', color: 'amber', label: 'Feature Requested' }
    case 'ROLE_UPDATED':
      return { icon: '🛡️', color: 'blue', label: 'Role Updated' }
    default:
      return { icon: '⚡', color: 'cyan', label: type.replace(/_/g, ' ') }
  }
}

export default function AdminTelemetryTab({
  liveActivities,
  onClearStream,
  onExportCSV,
  isAutoScrollPaused,
  onToggleAutoScroll,
  onInspectUser,
  onRefresh,
}: AdminTelemetryTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<EventFilterKey>('ALL')
  const [expandedPayloadId, setExpandedPayloadId] = useState<string | null>(null)
  const [isEmittingTestPing, setIsEmittingTestPing] = useState(false)

  // 1. Filtered activities based on type & search term
  const filteredActivities = useMemo(() => {
    return liveActivities.filter(item => {
      // Type filter
      if (activeFilter !== 'ALL' && item.type !== activeFilter) {
        return false
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = (item.userName || '').toLowerCase().includes(q)
        const matchEmail = (item.userEmail || '').toLowerCase().includes(q)
        const matchTitle = (item.title || '').toLowerCase().includes(q)
        const matchDetails = (item.details || '').toLowerCase().includes(q)
        const matchType = (item.type || '').toLowerCase().includes(q)
        return matchName || matchEmail || matchTitle || matchDetails || matchType
      }
      return true
    })
  }, [liveActivities, activeFilter, searchQuery])

  // 2. Aggregate telemetry KPI metrics
  const uniqueBroadcastersCount = useMemo(() => {
    const userIds = new Set(liveActivities.map(a => a.userId).filter(Boolean))
    return userIds.size
  }, [liveActivities])

  const solvedEventsCount = useMemo(() => {
    return liveActivities.filter(a => a.type === 'QUESTION_SOLVED').length
  }, [liveActivities])

  const mockEventsCount = useMemo(() => {
    return liveActivities.filter(a => a.type === 'MOCK_COMPLETED').length
  }, [liveActivities])

  const latestEventTime = useMemo(() => {
    if (liveActivities.length === 0) return 'No events'
    return getRelativeTime(liveActivities[0].timestamp)
  }, [liveActivities])

  // 3. Emit Test Telemetry Event (helps demo and verify stream connectivity)
  const handleEmitTestPing = async () => {
    setIsEmittingTestPing(true)
    try {
      await dbActivityService.logActivity({
        userId: 'usr_admin_telemetry_demo',
        userName: 'Telemetry Health Check',
        userEmail: 'system.monitor@interviewprep.io',
        type: 'QUESTION_SOLVED',
        title: 'Diagnostic Socket Telemetry Verified',
        details: 'Simulated candidate submission event evaluated through live channel heartbeat.',
      })
      if (onRefresh) onRefresh()
    } catch {
      // ignore
    } finally {
      setTimeout(() => setIsEmittingTestPing(false), 600)
    }
  }

  // Count helper for category pills
  const getCountForType = (type: EventFilterKey) => {
    if (type === 'ALL') return liveActivities.length
    return liveActivities.filter(a => a.type === type).length
  }

  return (
    <div className="admin-telemetry-tab">
      {/* ─── Top Telemetry Header ─────────────────────────────────────────── */}
      <div className="tel-header-card">
        <div className="tel-header-left">
          <div className="tel-status-badge-row">
            <span className={`tel-live-pill ${isAutoScrollPaused ? 'paused' : 'active'}`}>
              <span className={`tel-pulse-dot ${isAutoScrollPaused ? 'amber' : 'green'}`} />
              {isAutoScrollPaused ? 'Stream Paused' : 'Live WebSocket Broadcasting'}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--h-text-muted)' }}>
              • Postgres Realtime Stream
            </span>
          </div>
          <h2 className="tel-stream-title">Candidate Telemetry &amp; System Event Stream</h2>
          <p className="tel-stream-desc">
            Continuous real-time event pipeline streaming candidate problem attempts, code evaluations, mock interviews, and access governance audits.
          </p>
        </div>

        <div className="tel-header-actions">
          <button
            type="button"
            className={`tel-btn ${isAutoScrollPaused ? 'tel-btn-resume' : 'tel-btn-pause'}`}
            onClick={onToggleAutoScroll}
            title={isAutoScrollPaused ? 'Resume live autoscroll stream' : 'Pause autoscroll stream'}
          >
            {isAutoScrollPaused ? '▶️ Resume Stream' : '⏸️ Pause Stream'}
          </button>

          <button
            type="button"
            className="tel-btn tel-btn-secondary"
            onClick={handleEmitTestPing}
            disabled={isEmittingTestPing}
            title="Emit a simulated heartbeat telemetry event to verify real-time connectivity"
          >
            {isEmittingTestPing ? '⚡ Broadcasting...' : '⚡ Emit Test Event'}
          </button>

          <button
            type="button"
            className="tel-btn tel-btn-secondary"
            onClick={onExportCSV}
            title="Export filtered telemetry events to CSV"
          >
            📥 Export CSV
          </button>

          <button
            type="button"
            className="tel-btn tel-btn-danger"
            onClick={onClearStream}
            title="Clear current stream view"
          >
            🧹 Clear Feed
          </button>
        </div>
      </div>

      {/* ─── Top 4 Horizon KPI Stat Cards ─────────────────────────────────── */}
      <div className="tel-stats-grid">
        <div className="tel-stat-card">
          <div className="tel-stat-icon-wrap green">
            <span>🛰️</span>
          </div>
          <div className="tel-stat-info">
            <span className="tel-stat-label">Channel Status</span>
            <span className="tel-stat-value" style={{ color: isAutoScrollPaused ? '#ffb547' : '#01b574' }}>
              {isAutoScrollPaused ? 'PAUSED' : 'LIVE'}
            </span>
            <span className="tel-stat-sub">Supabase Realtime</span>
          </div>
        </div>

        <div className="tel-stat-card">
          <div className="tel-stat-icon-wrap purple">
            <span>⚡</span>
          </div>
          <div className="tel-stat-info">
            <span className="tel-stat-label">Logged Events</span>
            <span className="tel-stat-value">{liveActivities.length}</span>
            <span className="tel-stat-sub">Latest: {latestEventTime}</span>
          </div>
        </div>

        <div className="tel-stat-card">
          <div className="tel-stat-icon-wrap cyan">
            <span>👥</span>
          </div>
          <div className="tel-stat-info">
            <span className="tel-stat-label">Candidate Broadcasters</span>
            <span className="tel-stat-value">{uniqueBroadcastersCount}</span>
            <span className="tel-stat-sub">Unique active sessions</span>
          </div>
        </div>

        <div className="tel-stat-card">
          <div className="tel-stat-icon-wrap amber">
            <span>🎯</span>
          </div>
          <div className="tel-stat-info">
            <span className="tel-stat-label">Solved &amp; Mocks</span>
            <span className="tel-stat-value">{solvedEventsCount + mockEventsCount}</span>
            <span className="tel-stat-sub">{solvedEventsCount} Solved • {mockEventsCount} Mocks</span>
          </div>
        </div>
      </div>

      {/* ─── Category Filter Pills ────────────────────────────────────────── */}
      <div className="tel-pills-bar">
        {(
          [
            { key: 'ALL', label: '⚡ All Events' },
            { key: 'QUESTION_SOLVED', label: '💡 Questions Solved' },
            { key: 'QUIZ_SCORED', label: '🎯 Quiz Drills' },
            { key: 'MOCK_COMPLETED', label: '🎥 Mock Interviews' },
            { key: 'TRACK_SWITCHED', label: '🚀 Track Changes' },
            { key: 'FEATURE_GRANTED', label: '✨ Access Granted' },
            { key: 'AUTH_SIGN_IN', label: '🔑 Auth Sessions' },
          ] as const
        ).map(f => (
          <button
            key={f.key}
            type="button"
            className={`tel-pill-btn ${activeFilter === f.key ? 'active' : ''}`}
            onClick={() => setActiveFilter(f.key)}
          >
            <span>{f.label}</span>
            <span className="tel-pill-count">{getCountForType(f.key)}</span>
          </button>
        ))}
      </div>

      {/* ─── Search & Controls Bar ────────────────────────────────────────── */}
      <div className="tel-controls-card">
        <div className="tel-search-wrapper">
          <span className="tel-search-icon">🔍</span>
          <input
            type="text"
            className="tel-search-input"
            placeholder="Search candidate name, email, event title, or payload..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="tel-search-clear"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="tel-actions-right">
          <span style={{ fontSize: '0.85rem', color: 'var(--h-text-muted)', fontWeight: 600 }}>
            Showing <strong>{filteredActivities.length}</strong> of {liveActivities.length} stream events
          </span>
        </div>
      </div>

      {/* ─── Stream Events Feed List ──────────────────────────────────────── */}
      {filteredActivities.length === 0 ? (
        <div className="tel-empty-state">
          <div className="tel-empty-radar">
            <span>🛰️</span>
          </div>
          <h3 className="tel-empty-title">
            {liveActivities.length === 0
              ? 'Listening for Live Candidate Telemetry...'
              : 'No Telemetry Events Match Your Filter'}
          </h3>
          <p className="tel-empty-sub">
            {liveActivities.length === 0
              ? 'As candidates solve interview challenges, run test suites, or update their learning tracks, telemetry packets will broadcast here instantaneously.'
              : 'Try clearing your search query or selecting "All Events" to view recent activity packets.'}
          </p>
          {liveActivities.length === 0 && (
            <button
              type="button"
              className="tel-btn tel-btn-primary"
              onClick={handleEmitTestPing}
              style={{ marginTop: '8px' }}
            >
              ⚡ Emit Heartbeat Test Packet
            </button>
          )}
        </div>
      ) : (
        <div className="tel-stream-feed">
          {filteredActivities.map(act => {
            const meta = getEventColor(act.type)
            const initials = act.userName ? act.userName.slice(0, 2).toUpperCase() : 'CD'
            const formattedTime = new Date(act.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
            const formattedDate = new Date(act.timestamp).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
            })
            const isPayloadOpen = expandedPayloadId === act.id

            return (
              <div
                key={act.id}
                className={`tel-stream-card ${act.type.toLowerCase()}`}
              >
                <div className="tel-card-main">
                  <div className={`tel-event-icon-circle ${meta.color}`}>
                    {meta.icon}
                  </div>

                  <div className="tel-event-body">
                    {/* Meta Row */}
                    <div className="tel-event-meta-row">
                      <span className={`tel-type-badge ${meta.color}`}>
                        {meta.label}
                      </span>

                      <button
                        type="button"
                        className="tel-candidate-chip"
                        onClick={() => act.userId && onInspectUser(act.userId)}
                        title={`Inspect Candidate Dossier for ${act.userName || 'Candidate'}`}
                      >
                        <div className="tel-avatar-mini">{initials}</div>
                        <span className="tel-candidate-name">{act.userName || 'Candidate'}</span>
                        {act.userEmail && (
                          <span className="tel-candidate-email">({act.userEmail})</span>
                        )}
                      </button>

                      <div className="tel-time-chip">
                        <span>🕒 {formattedTime} • {formattedDate}</span>
                        <span style={{ color: 'var(--h-brand-light)', fontWeight: 600 }}>
                          ({getRelativeTime(act.timestamp)})
                        </span>
                      </div>
                    </div>

                    {/* Title and Formatted Details (Separated with clean spacing) */}
                    <div className="tel-event-title-row">
                      <span className="tel-event-title">{act.title}</span>
                      {act.details && (
                        <div className="tel-event-details">
                          {act.details}
                        </div>
                      )}
                    </div>

                    {/* Expandable JSON Payload */}
                    {isPayloadOpen && (
                      <div className="tel-payload-drawer">
                        <pre>
                          {JSON.stringify(
                            {
                              id: act.id,
                              event: act.type,
                              userId: act.userId,
                              userName: act.userName,
                              userEmail: act.userEmail,
                              title: act.title,
                              details: act.details,
                              timestamp: act.timestamp,
                              transport: 'Supabase Realtime Broadcast',
                            },
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Right Actions */}
                <div className="tel-card-actions">
                  {act.userId && (
                    <button
                      type="button"
                      className="tel-inspect-btn"
                      onClick={() => onInspectUser(act.userId)}
                      title="Open Candidate Dossier"
                    >
                      <span>👤 Dossier</span>
                      <span>→</span>
                    </button>
                  )}

                  <button
                    type="button"
                    className="tel-payload-toggle-btn"
                    onClick={() => setExpandedPayloadId(isPayloadOpen ? null : act.id)}
                    title={isPayloadOpen ? 'Hide payload' : 'Inspect JSON payload'}
                  >
                    {isPayloadOpen ? '✕ Hide Payload' : '{ } Payload'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
