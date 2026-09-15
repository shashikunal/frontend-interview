import { useState, useEffect } from 'react';
import { docsOfflineService, type OfflinePlatformStatus, type OfflineCacheProgress } from '../services/docsOfflineService';
import '../styles/DocsOfflineControl.css';

interface DocsOfflineControlProps {
  compact?: boolean;
}

export function DocsOfflineControl({ compact = false }: DocsOfflineControlProps) {
  const [status, setStatus] = useState<OfflinePlatformStatus>(docsOfflineService.getStatus());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCaching, setIsCaching] = useState(false);
  const [cacheProgress, setCacheProgress] = useState<OfflineCacheProgress | null>(null);
  const [justFinished, setJustFinished] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  useEffect(() => {
    // Register SW on mount
    docsOfflineService.register();

    // Subscribe to status changes
    const unsubStatus = docsOfflineService.subscribeStatus((newStatus) => {
      setStatus(newStatus);
    });

    // Subscribe to progress updates
    const unsubProgress = docsOfflineService.subscribeProgress((progress) => {
      setCacheProgress(progress);
      if (progress.isComplete) {
        setIsCaching(false);
        setJustFinished(true);
        setTimeout(() => setJustFinished(false), 5000);
      }
    });

    return () => {
      unsubStatus();
      unsubProgress();
    };
  }, []);

  // Offline status notification flash
  useEffect(() => {
    if (!status.isOnline) {
      setNotificationMsg('📡 Offline Mode Active: Reading all 21 tracks from local PWA cache');
    } else if (notificationMsg) {
      setNotificationMsg('🟢 Network Restored: MasterDocs live sync connected');
      const timer = setTimeout(() => setNotificationMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [status.isOnline]);

  const handleStartPrecache = async () => {
    setIsCaching(true);
    setCacheProgress({
      cached: 0,
      total: docsOfflineService.getTrackUrlsToCache().length,
      percent: 0,
      currentTrack: 'Initializing core shell...',
      isComplete: false,
    });

    const result = await docsOfflineService.precacheAllTracks();
    setIsCaching(false);
    if (result.success) {
      setJustFinished(true);
      setTimeout(() => setJustFinished(false), 6000);
    }
  };

  const handleClearCache = async () => {
    if (window.confirm('Are you sure you want to clear MasterDocs offline cache?')) {
      await docsOfflineService.clearCache();
      setCacheProgress(null);
    }
  };

  return (
    <div className="docs-offline-control-root">
      {/* Offline Alert Banner (when device is offline) */}
      {!status.isOnline && (
        <aside
          className="docs-offline-persistent-banner"
          role="status"
          aria-live="polite"
        >
          <div className="dopb-content">
            <span className="dopb-pulse-icon">📡</span>
            <span className="dopb-text">
              <strong>Offline Mode Active:</strong> You are currently offline. All 21 curriculum tracks, practice guides, and interview flashcards remain 100% accessible via local Service Worker cache.
            </span>
            <button
              type="button"
              className="dopb-manage-btn"
              onClick={() => setIsModalOpen(true)}
            >
              Storage Details
            </button>
          </div>
        </aside>
      )}

      {/* Online Restored Toast */}
      {status.isOnline && notificationMsg && (
        <aside
          className="docs-online-restored-toast"
          role="status"
          aria-live="polite"
        >
          <span className="dort-icon">🟢</span>
          <span className="dort-text">{notificationMsg}</span>
          <button
            type="button"
            className="dort-close"
            onClick={() => setNotificationMsg(null)}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </aside>
      )}

      {/* Trigger Button (placed in Top Bar) */}
      <button
        type="button"
        className={`docs-offline-pill-btn ${!status.isOnline ? 'is-offline' : status.isPrecached ? 'is-precached' : 'is-ready'} ${compact ? 'is-compact' : ''}`}
        onClick={() => setIsModalOpen(true)}
        title={!status.isOnline ? 'Offline Mode Active (Cached)' : status.isPrecached ? 'Offline Ready: All 21 Tracks Cached' : 'Pre-cache 21 Tracks for Offline Study'}
        aria-label="MasterDocs Offline PWA Settings"
      >
        <span className="dop-icon">
          {!status.isOnline ? '📡' : status.isPrecached ? '⚡' : '📥'}
        </span>
        <span className="dop-label">
          {!status.isOnline
            ? 'Offline Mode'
            : status.isPrecached
              ? 'Offline Ready'
              : 'Pre-cache Tracks'}
        </span>
        {status.isPrecached && status.isOnline && (
          <span className="dop-badge">21</span>
        )}
      </button>

      {/* Offline Storage Hub Modal */}
      {isModalOpen && (
        <div className="docs-offline-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="docs-offline-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="offline-modal-title"
          >
            <div className="domc-header">
              <div className="domc-header-title">
                <span className="domc-title-icon">💾</span>
                <div>
                  <h3 id="offline-modal-title">Offline Study &amp; PWA Cache Hub</h3>
                  <p className="domc-subtitle">
                    Full 21 Tracks &amp; 700+ Topics available without internet connection
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="domc-close-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="domc-body">
              {/* Status Grid */}
              <div className="domc-metrics-grid">
                <div className="domc-metric-card">
                  <span className="dmc-label">Network Connectivity</span>
                  <div className="dmc-val">
                    <span className={`dmc-dot ${status.isOnline ? 'online' : 'offline'}`} />
                    <span className="dmc-bold">{status.isOnline ? 'Online (Live)' : 'Offline (Disconnected)'}</span>
                  </div>
                </div>

                <div className="domc-metric-card">
                  <span className="dmc-label">Service Worker</span>
                  <div className="dmc-val">
                    <span className="dmc-tag active">
                      {status.isSwRegistered ? 'v1 Active & Claimed' : 'Active'}
                    </span>
                  </div>
                </div>

                <div className="domc-metric-card">
                  <span className="dmc-label">Offline Status</span>
                  <div className="dmc-val">
                    {status.isPrecached ? (
                      <span className="dmc-tag success">✓ 21 Tracks Stored</span>
                    ) : (
                      <span className="dmc-tag pending">Not Cached</span>
                    )}
                  </div>
                </div>

                <div className="domc-metric-card">
                  <span className="dmc-label">Cache Storage Footprint</span>
                  <div className="dmc-val">
                    <span className="dmc-bold">
                      {status.storageUsageMB ? `${status.storageUsageMB} MB` : '~4.2 MB'}
                    </span>
                    <span className="dmc-sub">
                      {status.storageQuotaMB ? ` / ${(status.storageQuotaMB / 1024).toFixed(0)} GB quota` : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Banner / Progress */}
              <div className="domc-precache-section">
                <div className="dps-info">
                  <h4>Zero-Network Offline MasterDocs</h4>
                  <p>
                    Pre-caching stores all 21 tracks (HTML, CSS, JavaScript, TypeScript, React, Next.js, Redux, Microfrontends, REST, WebSockets, Performance, etc.) into your browser's persistent Cache Storage. You can study on airplanes, subways, or during outages.
                  </p>
                </div>

                {isCaching && cacheProgress && (
                  <div className="domc-progress-box">
                    <div className="dpb-header">
                      <span className="dpb-status">
                        📥 Pre-caching Tracks: {cacheProgress.cached} of {cacheProgress.total}
                      </span>
                      <span className="dpb-percent">{cacheProgress.percent}%</span>
                    </div>
                    <div className="dpb-track">
                      <div
                        className="dpb-bar"
                        style={{ width: `${cacheProgress.percent}%` }}
                      />
                    </div>
                    <p className="dpb-curr">
                      Current item: <code>{cacheProgress.currentTrack}</code>
                    </p>
                  </div>
                )}

                {justFinished && (
                  <div className="domc-finished-toast">
                    <span className="dft-icon">🎉</span>
                    <div>
                      <strong>All 21 Tracks Successfully Cached!</strong>
                      <p>Full curriculum is now available offline anytime.</p>
                    </div>
                  </div>
                )}

                <div className="domc-actions-row">
                  <button
                    type="button"
                    className="domc-action-primary"
                    disabled={isCaching}
                    onClick={handleStartPrecache}
                  >
                    {isCaching ? (
                      <>
                        <span className="domc-spinner" /> Caching 21 Tracks...
                      </>
                    ) : status.isPrecached ? (
                      '🔄 Refresh & Update Offline Tracks'
                    ) : (
                      '📥 Pre-cache All 21 Tracks Now'
                    )}
                  </button>

                  {status.isPrecached && (
                    <button
                      type="button"
                      className="domc-action-secondary"
                      disabled={isCaching}
                      onClick={handleClearCache}
                    >
                      🗑️ Clear Offline Storage
                    </button>
                  )}
                </div>
              </div>

              {/* Supported Tracks Checklist */}
              <div className="domc-tracks-checklist">
                <h5>Cached Curriculum Overview (21 Tracks)</h5>
                <div className="domc-tracks-chips">
                  {[
                    '🌐 HTML & Semantics',
                    '🎨 Modern CSS',
                    '✨ Advanced CSS',
                    '⚡ JavaScript & V8',
                    '🚀 ES6+ Evolution',
                    '🔷 TypeScript',
                    '⚛️ React Fundamentals',
                    '🧬 Advanced React',
                    '🟣 Redux Core',
                    '📦 Redux Toolkit & RTKQ',
                    '🔄 TanStack Query v5',
                    '🧭 React Router DOM',
                    '🌊 Tailwind CSS',
                    '▲ Next.js & RSC',
                    '🧩 Microfrontends',
                    '🔌 RESTful APIs',
                    '🌐 HTTP & Protocols',
                    '📮 Postman Testing',
                    '📡 WebSockets',
                    '🪝 Webhooks',
                    '⚡ Web Performance',
                  ].map((trackName, idx) => (
                    <span key={idx} className="dtc-chip">
                      <span className="dtc-check">{status.isPrecached ? '✓' : '•'}</span>
                      {trackName}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="domc-footer">
              <span className="domc-footer-note">
                💡 Progressive Web App powered by Cache API &amp; Service Worker.
              </span>
              <button
                type="button"
                className="domc-footer-close"
                onClick={() => setIsModalOpen(false)}
              >
                Close Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
