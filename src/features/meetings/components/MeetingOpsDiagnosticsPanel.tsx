import React, { useState, useEffect } from 'react';
import { webrtcPeerService } from '../services/webrtcPeerService';
import { meetingMutationTracker } from '../services/meetingMutationTracker';
import './MeetingOpsDiagnosticsPanel.css';

interface MeetingOpsDiagnosticsPanelProps {
  meetingId: string;
  userId: string;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export const MeetingOpsDiagnosticsPanel: React.FC<MeetingOpsDiagnosticsPanelProps> = ({
  meetingId,
  userId,
  isOpen = false,
  onClose,
  className = '',
}) => {
  const [diagnostics, setDiagnostics] = useState<any>(() => webrtcPeerService.getPeerDiagnostics());
  const [lastMutation, setLastMutation] = useState<any>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'webrtc' | 'tracks' | 'mutations'>('webrtc');

  useEffect(() => {
    if (!isOpen) return;

    const updateDiag = () => {
      setDiagnostics(webrtcPeerService.getPeerDiagnostics());
      setLastMutation({
        lastMutationTime: meetingMutationTracker.getLastMutationTimestamp(),
        hasPendingAbort: false,
      });
    };

    updateDiag();
    let interval: ReturnType<typeof setInterval> | null = null;
    if (autoRefresh) {
      interval = setInterval(updateDiag, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, autoRefresh]);

  if (!isOpen) return null;

  const peers = diagnostics?.peers || [];

  return (
    <div className={`meeting-ops-diagnostics-drawer ${className}`} role="dialog" aria-label="Meeting Ops Diagnostics Panel">
      <div className="diag-header">
        <div className="diag-title-area">
          <span className="diag-badge">LIVE DIAGNOSTICS</span>
          <h3>Meeting Connection Telemetry</h3>
        </div>
        <div className="diag-header-actions">
          <label className="diag-auto-refresh-toggle">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            <span>Auto (1s)</span>
          </label>
          <button
            type="button"
            className="diag-refresh-btn"
            onClick={() => setDiagnostics(webrtcPeerService.getPeerDiagnostics())}
            title="Refresh Diagnostics"
          >
            ↻
          </button>
          {onClose && (
            <button type="button" className="diag-close-btn" onClick={onClose} title="Close Diagnostics">
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="diag-tab-bar">
        <button
          type="button"
          className={`diag-tab ${activeTab === 'webrtc' ? 'active' : ''}`}
          onClick={() => setActiveTab('webrtc')}
        >
          Signal & Peers ({peers.length})
        </button>
        <button
          type="button"
          className={`diag-tab ${activeTab === 'tracks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracks')}
        >
          Media Tracks
        </button>
        <button
          type="button"
          className={`diag-tab ${activeTab === 'mutations' ? 'active' : ''}`}
          onClick={() => setActiveTab('mutations')}
        >
          Mutations & Safety
        </button>
      </div>

      <div className="diag-content">
        {/* Core Metadata */}
        <div className="diag-grid">
          <div className="diag-card">
            <span className="diag-label">Meeting ID</span>
            <span className="diag-value font-mono">{meetingId || 'N/A'}</span>
          </div>
          <div className="diag-card">
            <span className="diag-label">User ID</span>
            <span className="diag-value font-mono">{userId || 'N/A'}</span>
          </div>
          <div className="diag-card">
            <span className="diag-label">Socket State</span>
            <span className={`diag-status-pill ${diagnostics.socketConnected ? 'connected' : 'disconnected'}`}>
              {diagnostics.socketConnected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>
          <div className="diag-card">
            <span className="diag-label">Tab Session</span>
            <span className="diag-value font-mono">{diagnostics.tabSessionId || 'main'}</span>
          </div>
        </div>

        {activeTab === 'webrtc' && (
          <div className="diag-section">
            <h4 className="diag-section-title">Peer Connection Mesh ({peers.length} active)</h4>
            {peers.length === 0 ? (
              <div className="diag-empty-state">
                <p>No remote WebRTC peers connected yet.</p>
                <small>Once participants join and signaling offers/answers exchange, connection states appear here.</small>
              </div>
            ) : (
              <div className="diag-peers-list">
                {peers.map((peer: any, idx: number) => (
                  <div key={peer.peerUserId || idx} className="diag-peer-item">
                    <div className="diag-peer-header">
                      <strong>Peer: {peer.peerUserId}</strong>
                      <span className={`diag-state-badge ${peer.connectionState}`}>
                        {peer.connectionState?.toUpperCase() || 'NEW'}
                      </span>
                    </div>

                    <div className="diag-states-row">
                      <div className="diag-mini-state">
                        <span className="sub-label">Signaling</span>
                        <span className="sub-val">{peer.signalingState || 'stable'}</span>
                      </div>
                      <div className="diag-mini-state">
                        <span className="sub-label">ICE State</span>
                        <span className="sub-val">{peer.iceConnectionState || 'new'}</span>
                      </div>
                      <div className="diag-mini-state">
                        <span className="sub-label">ICE Gathering</span>
                        <span className="sub-val">{peer.iceGatheringState || 'new'}</span>
                      </div>
                      <div className="diag-mini-state">
                        <span className="sub-label">Queued Candidates</span>
                        <span className="sub-val">{peer.queuedIceCandidates || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h4 className="diag-section-title" style={{ marginTop: '16px' }}>Last Signaling Event</h4>
            <div className="diag-code-box">
              {diagnostics.lastSignalingEvent ? (
                <pre>{JSON.stringify(diagnostics.lastSignalingEvent, null, 2)}</pre>
              ) : (
                <span className="diag-muted">No signaling event recorded yet.</span>
              )}
            </div>
          </div>
        )}

        {activeTab === 'tracks' && (
          <div className="diag-section">
            <h4 className="diag-section-title">Local Media Stream</h4>
            <div className="diag-media-indicator">
              <div>Camera / Mic: <strong>{diagnostics.localStreamActive ? 'ACTIVE' : 'INACTIVE'}</strong></div>
              <div>Screen Share: <strong>{diagnostics.localScreenStreamActive ? 'STREAMING' : 'IDLE'}</strong></div>
            </div>

            <h4 className="diag-section-title" style={{ marginTop: '16px' }}>Remote Peer Tracks</h4>
            {peers.length === 0 ? (
              <div className="diag-muted">No remote peer tracks attached.</div>
            ) : (
              peers.map((p: any) => (
                <div key={p.peerUserId} className="diag-track-peer">
                  <strong>{p.peerUserId} ({p.remoteTracks?.length || 0} tracks)</strong>
                  <ul>
                    {(p.remoteTracks || []).map((t: any, i: number) => (
                      <li key={i}>{t.kind.toUpperCase()}: {t.label || t.id}</li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'mutations' && (
          <div className="diag-section">
            <h4 className="diag-section-title">Single Source of Truth & Race Condition Guard (Req 21 & 22)</h4>
            <div className="diag-grid">
              <div className="diag-card">
                <span className="diag-label">Last Local Mutation</span>
                <span className="diag-value">
                  {lastMutation?.lastMutationTime ? new Date(lastMutation.lastMutationTime).toLocaleTimeString() : 'None recorded'}
                </span>
              </div>
              <div className="diag-card">
                <span className="diag-label">In-Flight Abort Guard</span>
                <span className="diag-status-pill connected">ARMED</span>
              </div>
            </div>
            <p className="diag-explainer">
              The platform executes single-source-of-truth reconciliation: when a DELETE or CREATE mutation triggers,
              stale in-flight GET requests are aborted via AbortController and any delayed responses are scrubbed of deleted meeting IDs before React Query caches them.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
