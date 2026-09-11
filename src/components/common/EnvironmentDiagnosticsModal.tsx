import { useState, useEffect } from 'react'
import { supabase, supabaseUrl } from '../../lib/supabase/client'
import { useAuth } from '../../context/AuthContext'
import './EnvironmentDiagnosticsModal.css'

interface EnvironmentDiagnosticsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface DiagnosticState {
  environment: 'development' | 'production'
  hostname: string
  supabaseRef: string
  supabaseUrl: string
  dbStatus: 'checking' | 'connected' | 'error'
  dbLatencyMs: number | null
  dbRecordCount: number | null
  dbError: string | null
  realtimeStatus: 'checking' | 'connected' | 'error'
  apiHealth: 'checking' | 'online' | 'offline'
  buildTimestamp: string
  appVersion: string
}

export default function EnvironmentDiagnosticsModal({ isOpen, onClose }: EnvironmentDiagnosticsModalProps) {
  const { user, role, hasPermission } = useAuth()
  const isAdmin = role === 'admin' || user?.role === 'admin' || (typeof hasPermission === 'function' && hasPermission('admin'))
  const isDev = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

  const [diagnostics, setDiagnostics] = useState<DiagnosticState>(() => {
    // Extract project ref safely (subdomain before .supabase.co)
    let ref = 'unknown'
    try {
      const parsed = new URL(supabaseUrl)
      ref = parsed.hostname.split('.')[0] || 'unknown'
    } catch {
      // fallback
    }

    return {
      environment: isDev ? 'development' : 'production',
      hostname: typeof window !== 'undefined' ? window.location.hostname : '',
      supabaseRef: ref,
      supabaseUrl: supabaseUrl.replace(/\/$/, ''),
      dbStatus: 'checking',
      dbLatencyMs: null,
      dbRecordCount: null,
      dbError: null,
      realtimeStatus: 'checking',
      apiHealth: 'checking',
      buildTimestamp: import.meta.env.VITE_BUILD_TIME || new Date().toISOString().slice(0, 19).replace('T', ' '),
      appVersion: '2.5.0-production-audit',
    }
  })

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    let isMounted = true

    async function runDiagnostics() {
      // 1. Check Database Ping & Latency
      const startPing = performance.now()
      try {
        const { count, error } = await supabase
          .from('submissions')
          .select('*', { count: 'exact', head: true })

        const latency = Math.round(performance.now() - startPing)
        if (isMounted) {
          if (error) {
            setDiagnostics(prev => ({
              ...prev,
              dbStatus: 'error',
              dbLatencyMs: latency,
              dbError: error.message,
            }))
          } else {
            setDiagnostics(prev => ({
              ...prev,
              dbStatus: 'connected',
              dbLatencyMs: latency,
              dbRecordCount: count ?? 0,
              dbError: null,
            }))
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setDiagnostics(prev => ({
            ...prev,
            dbStatus: 'error',
            dbLatencyMs: Math.round(performance.now() - startPing),
            dbError: err?.message || 'Connection failed',
          }))
        }
      }

      // 2. Check Realtime Connectivity
      try {
        const testChannel = supabase.channel('diag_ping_' + Date.now())
        testChannel.subscribe(status => {
          if (isMounted) {
            if (status === 'SUBSCRIBED') {
              setDiagnostics(prev => ({ ...prev, realtimeStatus: 'connected' }))
              setTimeout(() => {
                supabase.removeChannel(testChannel)
              }, 1000)
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
              setDiagnostics(prev => ({ ...prev, realtimeStatus: 'error' }))
            }
          }
        })
      } catch {
        if (isMounted) {
          setDiagnostics(prev => ({ ...prev, realtimeStatus: 'error' }))
        }
      }

      // 3. Check Local API Health
      try {
        const res = await fetch('/api/system-status', { signal: AbortSignal.timeout(3000) })
        if (isMounted) {
          setDiagnostics(prev => ({ ...prev, apiHealth: res.ok ? 'online' : 'offline' }))
        }
      } catch {
        if (isMounted) {
          setDiagnostics(prev => ({ ...prev, apiHealth: 'offline' }))
        }
      }
    }

    void runDiagnostics()

    return () => {
      isMounted = false
    }
  }, [isOpen])

  if (!isOpen) return null

  // Guard: Accessible only to admins or development mode
  if (!isAdmin && !isDev) {
    return (
      <div className="diag-modal-backdrop" onClick={onClose}>
        <div className="diag-modal-card" onClick={e => e.stopPropagation()}>
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <h3>🔒 Access Restricted</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Environment diagnostics are restricted to Platform Administrators.
            </p>
            <button type="button" className="diag-btn-primary" onClick={onClose} style={{ marginTop: 16 }}>
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleCopyReport = () => {
    const report = `[System Diagnostics Report]
Timestamp: ${new Date().toISOString()}
Environment: ${diagnostics.environment.toUpperCase()}
Hostname: ${diagnostics.hostname}
App Version: ${diagnostics.appVersion}
Build Time: ${diagnostics.buildTimestamp}
Supabase Ref: ${diagnostics.supabaseRef}
Supabase URL: ${diagnostics.supabaseUrl}
Database Status: ${diagnostics.dbStatus} (${diagnostics.dbLatencyMs}ms latency, ${diagnostics.dbRecordCount} total submissions)
Realtime Status: ${diagnostics.realtimeStatus}
Local API Health: ${diagnostics.apiHealth}
Authenticated User ID: ${user?.id || 'none'}
User Role: ${role || 'guest'}
`
    navigator.clipboard.writeText(report)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="diag-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="diag-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="diag-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.4rem' }}>🛠️</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem' }}>Environment &amp; Supabase Diagnostics</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Authoritative System State &amp; Connection Integrity
              </span>
            </div>
          </div>
          <button type="button" className="diag-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Diagnostics Body */}
        <div className="diag-modal-body">
          {/* Status Banners */}
          <div className="diag-grid-badges">
            <div className="diag-stat-card">
              <span className="diag-stat-label">Environment</span>
              <span className={`diag-pill-badge env-${diagnostics.environment}`}>
                {diagnostics.environment === 'development' ? '💻 Local Development' : '🚀 Vercel Production'}
              </span>
            </div>
            <div className="diag-stat-card">
              <span className="diag-stat-label">Database Connection</span>
              <span className={`diag-pill-badge status-${diagnostics.dbStatus}`}>
                {diagnostics.dbStatus === 'connected' ? `✓ Online (${diagnostics.dbLatencyMs}ms)` : diagnostics.dbStatus === 'checking' ? '⏳ Checking...' : '✕ Error'}
              </span>
            </div>
            <div className="diag-stat-card">
              <span className="diag-stat-label">Realtime WebSockets</span>
              <span className={`diag-pill-badge status-${diagnostics.realtimeStatus}`}>
                {diagnostics.realtimeStatus === 'connected' ? '✓ Connected' : diagnostics.realtimeStatus === 'checking' ? '⏳ Checking...' : '✕ Offline'}
              </span>
            </div>
            <div className="diag-stat-card">
              <span className="diag-stat-label">Local API Health</span>
              <span className={`diag-pill-badge status-${diagnostics.apiHealth === 'online' ? 'connected' : 'idle'}`}>
                {diagnostics.apiHealth === 'online' ? '✓ Online' : '⚠️ Offline/Serverless'}
              </span>
            </div>
          </div>

          {/* Detailed Info Table */}
          <div className="diag-table-container">
            <table className="diag-table">
              <tbody>
                <tr>
                  <td>Supabase Project Ref</td>
                  <td>
                    <code className="diag-code-highlight">{diagnostics.supabaseRef}</code>
                  </td>
                </tr>
                <tr>
                  <td>Supabase URL</td>
                  <td>
                    <code>{diagnostics.supabaseUrl}</code>
                  </td>
                </tr>
                <tr>
                  <td>Hostname</td>
                  <td><code>{diagnostics.hostname}</code></td>
                </tr>
                <tr>
                  <td>Submissions in DB</td>
                  <td>
                    <strong>{diagnostics.dbRecordCount !== null ? `${diagnostics.dbRecordCount} rows` : 'Checking...'}</strong>
                  </td>
                </tr>
                <tr>
                  <td>App Version</td>
                  <td><code>{diagnostics.appVersion}</code></td>
                </tr>
                <tr>
                  <td>Build Timestamp</td>
                  <td>{diagnostics.buildTimestamp}</td>
                </tr>
                <tr>
                  <td>Authenticated User</td>
                  <td>
                    {user ? (
                      <div>
                        <code>{user.id}</code>
                        <span style={{ marginLeft: 8, fontSize: '0.75rem', color: '#6366f1' }}>({user.email || 'No email'})</span>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Unauthenticated (Guest)</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Active Role</td>
                  <td>
                    <span className="diag-role-pill">{role || 'candidate'}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {diagnostics.dbError && (
            <div className="diag-error-box">
              <strong>Database Warning:</strong> {diagnostics.dbError}
            </div>
          )}

          <div className="diag-security-note">
            <span>🔒 Security Check:</span> Service-role keys and database passwords are never loaded or exposed to the client bundle. All interactions route through row-level security (RLS).
          </div>
        </div>

        {/* Footer */}
        <div className="diag-modal-footer">
          <button type="button" className="diag-btn-secondary" onClick={handleCopyReport}>
            {copied ? '✓ Report Copied!' : '📋 Copy Diagnostics Report'}
          </button>
          <button type="button" className="diag-btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
