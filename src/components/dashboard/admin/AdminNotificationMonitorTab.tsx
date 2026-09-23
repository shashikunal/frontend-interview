import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getAdminBearerToken } from '../../../features/auth/services/adminTokenHelper';
import './AdminControlCenter.css';

interface NotificationTelemetry {
  metrics: {
    processedCount: number;
    duplicateCount: number;
    retryCount: number;
    dlqCount: number;
  };
  dlqRecords: Array<{
    originalEventId: string;
    originalTopic: string;
    originalEventType: string;
    error: string;
    retryCount: number;
    failedAt: string;
    rawPayload?: any;
  }>;
}

export const AdminNotificationMonitorTab: React.FC = () => {
  const { user } = useAuth();
  const [telemetry, setTelemetry] = useState<NotificationTelemetry | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTelemetry = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let token = await getAdminBearerToken(user);

      let res = await fetch('/api/v1/admin/notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401) {
        token = await getAdminBearerToken(user, true);
        res = await fetch('/api/v1/admin/notifications', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch notification telemetry.`);
      }

      const json = await res.json();
      if (json.success && json.data) {
        setTelemetry(json.data);
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with notification monitoring API.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTelemetry();
  }, [fetchTelemetry]);

  return (
    <div className="acc-container">
      <div className="acc-header">
        <div className="acc-header-left">
          <h2>Notification Delivery &amp; Event Dead-Letter Queue (DLQ)</h2>
          <p>Inspect asynchronous delivery status, provider latency, retry loops, and poison messages routed to the DLQ.</p>
        </div>
        <div className="acc-header-actions">
          <button
            type="button"
            className="acc-refresh-btn"
            onClick={fetchTelemetry}
            disabled={isLoading}
          >
            {isLoading ? '⏳ Refreshing...' : '🔄 Refresh DLQ State'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ color: '#f87171', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* KPI Cards */}
      {telemetry && (
        <div className="acc-kpi-grid">
          <div className="acc-kpi-card">
            <div className="acc-kpi-top">
              <div className="acc-kpi-icon green">📨</div>
              <span className="acc-kpi-badge live">KAFKA PROCESSED</span>
            </div>
            <div className="acc-kpi-value">{telemetry.metrics.processedCount}</div>
            <div className="acc-kpi-label">Dispatched Events Processed</div>
            <div className="acc-kpi-sub">
              Deduplicated: {telemetry.metrics.duplicateCount} idempotent skips
            </div>
          </div>

          <div className="acc-kpi-card">
            <div className="acc-kpi-top">
              <div className="acc-kpi-icon amber">🔁</div>
              <span className="acc-kpi-badge">BACKOFF</span>
            </div>
            <div className="acc-kpi-value">{telemetry.metrics.retryCount}</div>
            <div className="acc-kpi-label">Transient Retries Executed</div>
            <div className="acc-kpi-sub">
              Exponential backoff up to 3 attempts
            </div>
          </div>

          <div className="acc-kpi-card">
            <div className="acc-kpi-top">
              <div className="acc-kpi-icon red">☠️</div>
              <span className={`acc-kpi-badge ${telemetry.metrics.dlqCount > 0 ? 'alert' : ''}`}>
                {telemetry.metrics.dlqCount > 0 ? 'POISON DETECTED' : 'CLEAN'}
              </span>
            </div>
            <div className="acc-kpi-value">{telemetry.metrics.dlqCount}</div>
            <div className="acc-kpi-label">Dead-Letter Queue Backlog</div>
            <div className="acc-kpi-sub">
              Permanent failures quarantined safely
            </div>
          </div>
        </div>
      )}

      {/* DLQ Inspector Table */}
      <div className="acc-table-card">
        <div className="acc-table-toolbar">
          <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
            Quarantined DLQ Records ({telemetry?.dlqRecords.length || 0})
          </div>
        </div>

        <div className="acc-table-wrapper">
          <table className="acc-table">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Topic</th>
                <th>Event Type</th>
                <th>Failure Reason</th>
                <th>Retries</th>
                <th>Quarantined At</th>
              </tr>
            </thead>
            <tbody>
              {(!telemetry || telemetry.dlqRecords.length === 0) && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    🎉 Dead-Letter Queue is empty. No poison or failed notification messages detected.
                  </td>
                </tr>
              )}
              {telemetry?.dlqRecords.map(r => (
                <tr key={r.originalEventId}>
                  <td style={{ fontFamily: 'monospace', color: '#f87171' }}>{r.originalEventId}</td>
                  <td>{r.originalTopic}</td>
                  <td><span className="acc-status-pill suspended">{r.originalEventType}</span></td>
                  <td style={{ color: '#fca5a5' }}>{r.error}</td>
                  <td>{r.retryCount}</td>
                  <td>{new Date(r.failedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationMonitorTab;
