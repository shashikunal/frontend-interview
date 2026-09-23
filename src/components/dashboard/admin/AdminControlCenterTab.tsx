import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getAdminBearerToken } from '../../../features/auth/services/adminTokenHelper';
import './AdminControlCenter.css';

interface DashboardOverviewData {
  users: {
    total: number;
    active: number;
    suspended: number;
    admins: number;
    candidates: number;
    recentRegistrationsCount: number;
  };
  meetings: {
    total: number;
    scheduled: number;
    started: number;
    active: number;
    ended: number;
    cancelled: number;
    currentlyActiveCount: number;
  };
  participants: {
    totalInvited: number;
    totalAccepted: number;
    totalPending: number;
    activeConnectedCount: number;
  };
  chat: {
    messagesTotalToday: number;
    activeConversationsCount: number;
  };
  notifications: {
    totalSent: number;
    delivered: number;
    failed: number;
    retryCount: number;
    dlqCount: number;
  };
  infrastructure: {
    status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' | 'UNKNOWN';
    activeAlertsCount: number;
    database: { status: string; latencyMs: number };
    redis: { status: string; latencyMs: number };
    kafka: { status: string; lag: number };
    websocket: { status: string; activeConnections: number };
  };
  timestamp: string;
}

interface Props {
  onNavigateTab: (tab: string) => void;
}

export const AdminControlCenterTab: React.FC<Props> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const fetchOverview = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let token = await getAdminBearerToken(user);

      let res = await fetch('/api/v1/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // If token expired or rejected, force a token refresh and retry once
      if (res.status === 401) {
        token = await getAdminBearerToken(user, true);
        res = await fetch('/api/v1/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `HTTP ${res.status}: Failed to load control center overview.`);
      }

      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
        setLastRefreshed(new Date().toLocaleTimeString());
      } else {
        throw new Error('Invalid response structure from dashboard API.');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with control center API.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOverview();
    const interval = setInterval(fetchOverview, 15000); // 15s live refresh
    return () => clearInterval(interval);
  }, [fetchOverview]);

  return (
    <div className="acc-container">
      {/* Top Action Bar */}
      <div className="acc-header">
        <div className="acc-header-left">
          <h2>Operational Command Center</h2>
          <p>Real-time telemetry and management across user profiles, active meetings, Kafka events, and infrastructure.</p>
        </div>
        <div className="acc-header-actions">
          {lastRefreshed && (
            <span className="acc-updated-time">
              Updated: {lastRefreshed}
            </span>
          )}
          <button
            type="button"
            className="acc-refresh-btn"
            onClick={fetchOverview}
            disabled={isLoading}
          >
            {isLoading ? '⏳ Syncing...' : '🔄 Refresh Live State'}
          </button>
        </div>
      </div>

      {error && (
        <div className="acc-error-banner">
          ⚠️ {error}
        </div>
      )}

      {/* System Status Banner */}
      {data && (
        <div className="acc-banner">
          <div className="acc-banner-status">
            <div className={`acc-pulse-dot ${data.infrastructure.status.toLowerCase()}`} />
            <div>
              <div className="acc-banner-title">
                Platform Status: {data.infrastructure.status}
              </div>
              <div className="acc-banner-subtitle">
                Active Alerts: {data.infrastructure.activeAlertsCount} • Connected WebSockets: {data.infrastructure.websocket.activeConnections}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="acc-refresh-btn secondary"
            onClick={() => onNavigateTab('health')}
          >
            🩺 View Subsystem Health
          </button>
        </div>
      )}

      {/* Core KPI Metrics Grid */}
      {data && (
        <div className="acc-kpi-grid">
          {/* Active Meetings */}
          <div className="acc-kpi-card" onClick={() => onNavigateTab('meeting_ops')} style={{ cursor: 'pointer' }}>
            <div className="acc-kpi-top">
              <div className="acc-kpi-icon blue">📹</div>
              <span className={`acc-kpi-badge ${data.meetings.currentlyActiveCount > 0 ? 'live' : ''}`}>
                {data.meetings.currentlyActiveCount > 0 ? 'LIVE NOW' : 'IDLE'}
              </span>
            </div>
            <div className="acc-kpi-value">{data.meetings.currentlyActiveCount}</div>
            <div className="acc-kpi-label">Active Meeting Rooms</div>
            <div className="acc-kpi-sub">
              {data.meetings.total} total sessions ({data.meetings.scheduled} scheduled)
            </div>
          </div>

          {/* Active Participants */}
          <div className="acc-kpi-card" onClick={() => onNavigateTab('meeting_ops')} style={{ cursor: 'pointer' }}>
            <div className="acc-kpi-top">
              <div className="acc-kpi-icon green">👥</div>
              <span className="acc-kpi-badge live">REALTIME</span>
            </div>
            <div className="acc-kpi-value">{data.participants.activeConnectedCount}</div>
            <div className="acc-kpi-label">Active Connected Participants</div>
            <div className="acc-kpi-sub">
              {data.participants.totalAccepted} joins accepted across meetings
            </div>
          </div>

          {/* Users Directory */}
          <div className="acc-kpi-card" onClick={() => onNavigateTab('users')} style={{ cursor: 'pointer' }}>
            <div className="acc-kpi-top">
              <div className="acc-kpi-icon purple">👤</div>
              <span className="acc-kpi-badge">DATABASE</span>
            </div>
            <div className="acc-kpi-value">{data.users.total}</div>
            <div className="acc-kpi-label">Registered User Profiles</div>
            <div className="acc-kpi-sub">
              {data.users.admins} Admins • {data.users.candidates} Candidates
            </div>
          </div>

          {/* Notifications & DLQ */}
          <div className="acc-kpi-card" onClick={() => onNavigateTab('notifications')} style={{ cursor: 'pointer' }}>
            <div className="acc-kpi-top">
              <div className="acc-kpi-icon amber">🔔</div>
              {data.notifications.dlqCount > 0 && (
                <span className="acc-kpi-badge alert">{data.notifications.dlqCount} DLQ</span>
              )}
            </div>
            <div className="acc-kpi-value">{data.notifications.delivered}</div>
            <div className="acc-kpi-label">Notifications Delivered</div>
            <div className="acc-kpi-sub">
              {data.notifications.failed} delivery failures ({data.notifications.retryCount} retries)
            </div>
          </div>
        </div>
      )}

      {/* Subsystem Quick Pulse */}
      {data && (
        <div className="acc-subsystems-grid">
          <div className="acc-kpi-card">
            <div className="acc-subsystem-header">POSTGRESQL DATABASE</div>
            <div className={`acc-subsystem-status ${data.infrastructure.database.status.toLowerCase()}`}>
              {data.infrastructure.database.status}
            </div>
            <div className="acc-subsystem-meta">
              Latency: {data.infrastructure.database.latencyMs}ms
            </div>
          </div>

          <div className="acc-kpi-card">
            <div className="acc-subsystem-header">REDIS CACHE &amp; PRESENCE</div>
            <div className={`acc-subsystem-status ${data.infrastructure.redis.status.toLowerCase()}`}>
              {data.infrastructure.redis.status}
            </div>
            <div className="acc-subsystem-meta">
              Latency: {data.infrastructure.redis.latencyMs}ms
            </div>
          </div>

          <div className="acc-kpi-card">
            <div className="acc-subsystem-header">KAFKA EVENT STREAM</div>
            <div className={`acc-subsystem-status ${data.infrastructure.kafka.status.toLowerCase()}`}>
              {data.infrastructure.kafka.status}
            </div>
            <div className="acc-subsystem-meta">
              Consumer Lag: {data.infrastructure.kafka.lag} events
            </div>
          </div>

          <div className="acc-kpi-card">
            <div className="acc-subsystem-header">SOCKET.IO GATEWAY</div>
            <div className={`acc-subsystem-status ${data.infrastructure.websocket.status.toLowerCase()}`}>
              {data.infrastructure.websocket.status}
            </div>
            <div className="acc-subsystem-meta">
              Active Sockets: {data.infrastructure.websocket.activeConnections}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminControlCenterTab;
