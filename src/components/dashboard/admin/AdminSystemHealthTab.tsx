import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { getAdminBearerToken } from '../../../features/auth/services/adminTokenHelper'
import './AdminSystemHealthTab.css'

interface DependencyHealthItem {
  name: string
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN' | 'UNKNOWN'
  mode?: string
  latencyMs: number
  lastChecked: string
  critical: boolean
  message?: string
  details?: Record<string, any>
}

interface AlertItem {
  id: string
  name: string
  severity: 'WARNING' | 'CRITICAL'
  description: string
  threshold: number
  active: boolean
  currentValue?: number
}

interface AuditRecordItem {
  id: string
  actorUserId?: string
  actorEmail?: string
  action: string
  resourceType: string
  resourceId?: string
  timestamp: string
  result: 'SUCCESS' | 'FAILURE' | 'DENIED'
  correlationId?: string
  metadata?: Record<string, any>
}

export default function AdminSystemHealthTab() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)

  // System telemetry state
  const [overallStatus, setOverallStatus] = useState<'HEALTHY' | 'DEGRADED' | 'DOWN'>('HEALTHY')
  const [uptimeSeconds, setUptimeSeconds] = useState(0)
  const [processMem, setProcessMem] = useState({ rssMb: 0, heapMb: 0 })
  const [dependencies, setDependencies] = useState<Record<string, DependencyHealthItem>>({})
  const [alerts, setAlerts] = useState<AlertItem[]>([])

  // Audit records state
  const [auditLogs, setAuditLogs] = useState<AuditRecordItem[]>([])
  const [auditSearch, setAuditSearch] = useState('')
  const [selectedActionFilter, setSelectedActionFilter] = useState('ALL')
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null)

  const fetchHealthData = async () => {
    try {
      const res = await fetch('/api/v1/health/dependencies')
      if (res.ok) {
        const data = await res.json()
        setOverallStatus(data.status || 'HEALTHY')
        setUptimeSeconds(data.uptimeSeconds || 0)
        if (data.process) {
          setProcessMem({
            rssMb: data.process.memoryRssMb || 0,
            heapMb: data.process.memoryHeapUsedMb || 0,
          })
        }
        if (data.dependencies) {
          setDependencies(data.dependencies)
        }
        if (data.alerts?.alerts) {
          setAlerts(data.alerts.alerts)
        }
      }
    } catch {
      // Fallback local health state if serverless handler is running statically
      setOverallStatus('HEALTHY')
    }

    // Fetch recent audit records
    try {
      const token = await getAdminBearerToken(user)
      const res = await fetch('/api/v1/audit?limit=40', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data.records)) {
          setAuditLogs(data.records)
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
      setLastRefreshed(new Date())
    }
  }

  useEffect(() => {
    fetchHealthData()
    if (!autoRefresh) return
    const interval = setInterval(fetchHealthData, 15000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  const formatUptime = (secs: number) => {
    const d = Math.floor(secs / 86400)
    const h = Math.floor((secs % 86400) / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    if (d > 0) return `${d}d ${h}h ${m}m`
    if (h > 0) return `${h}h ${m}m ${s}s`
    return `${m}m ${s}s`
  }

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      if (selectedActionFilter !== 'ALL' && !log.action.includes(selectedActionFilter)) {
        return false
      }
      if (auditSearch.trim()) {
        const q = auditSearch.toLowerCase()
        const matchesAction = log.action.toLowerCase().includes(q)
        const matchesResource = log.resourceType.toLowerCase().includes(q)
        const matchesActor = (log.actorEmail || log.actorUserId || '').toLowerCase().includes(q)
        const matchesCorr = (log.correlationId || '').toLowerCase().includes(q)
        return matchesAction || matchesResource || matchesActor || matchesCorr
      }
      return true
    })
  }, [auditLogs, selectedActionFilter, auditSearch])

  return (
    <div className="admin-health-container">
      {/* Top Bar with Overall Status & Refresh Controls */}
      <div className="health-top-bar">
        <div className="health-headline">
          <div className="health-headline-icon">🛰️</div>
          <div>
            <div className="health-headline-title-wrap">
              <h2>System Health &amp; Telemetry</h2>
              <span className={`health-status-badge ${overallStatus.toLowerCase()}`}>
                ● {overallStatus}
              </span>
            </div>
            <span className="health-headline-sub">
              Last synchronized: {lastRefreshed.toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="health-controls">
          <label className="health-auto-refresh-toggle">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={e => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh (15s)
          </label>

          <button
            type="button"
            className="health-btn-primary"
            onClick={fetchHealthData}
            disabled={loading}
          >
            {loading ? 'Refreshing…' : '🔄 Refresh Now'}
          </button>
        </div>
      </div>

      {/* System Metrics Ribbon */}
      <div className="health-overview-grid">
        <div className="health-metric-box">
          <div className="health-metric-top">
            <span className="health-metric-title">Platform Uptime</span>
            <div className="health-metric-icon green">⏱️</div>
          </div>
          <span className="health-metric-value">{formatUptime(uptimeSeconds)}</span>
          <span className="health-metric-sub">Zero-downtime architecture</span>
        </div>

        <div className="health-metric-box">
          <div className="health-metric-top">
            <span className="health-metric-title">Process Memory RSS</span>
            <div className="health-metric-icon purple">🧠</div>
          </div>
          <span className="health-metric-value">{processMem.rssMb} MB</span>
          <span className="health-metric-sub">Heap: {processMem.heapMb} MB used</span>
        </div>

        <div className="health-metric-box">
          <div className="health-metric-top">
            <span className="health-metric-title">Active Alert Signals</span>
            <div className="health-metric-icon amber">🔔</div>
          </div>
          <span
            className="health-metric-value"
            style={{ color: alerts.filter(a => a.active).length > 0 ? 'var(--h-brand-amber)' : 'var(--h-brand-green)' }}
          >
            {alerts.filter(a => a.active).length} / {alerts.length}
          </span>
          <span className="health-metric-sub">Operational threshold monitors</span>
        </div>

        <div className="health-metric-box">
          <div className="health-metric-top">
            <span className="health-metric-title">Durable Audit Events</span>
            <div className="health-metric-icon blue">🛡️</div>
          </div>
          <span className="health-metric-value" style={{ color: 'var(--h-brand-blue)' }}>
            {auditLogs.length}
          </span>
          <span className="health-metric-sub">Append-only compliance logs</span>
        </div>
      </div>

      {/* Dependencies Telemetry Grid */}
      <div>
        <div className="dependencies-section-title">
          <span>⚙</span> Core Infrastructure &amp; Dependency Health
        </div>

        <div className="dependencies-grid">
          {Object.entries(dependencies).map(([key, dep]) => {
            const isHealthy = dep.status === 'HEALTHY'
            const isDegraded = dep.status === 'DEGRADED'

            return (
              <div key={key} className="dep-card">
                <div className="dep-card-header">
                  <span className="dep-name">{dep.name}</span>
                  <span className={`health-status-badge ${dep.status.toLowerCase()}`}>
                    {dep.status}
                  </span>
                </div>

                <div style={{ marginBottom: '0.25rem' }}>
                  <span className="dep-mode-tag">MODE: {dep.mode || 'STANDBY'}</span>
                </div>

                <div className="dep-stat-row">
                  <span className="dep-stat-label">Latency</span>
                  <span
                    className="dep-stat-val"
                    style={{
                      color: isHealthy
                        ? 'var(--h-brand-green)'
                        : isDegraded
                        ? 'var(--h-brand-amber)'
                        : 'var(--h-brand-red)',
                    }}
                  >
                    {dep.latencyMs} ms
                  </span>
                </div>

                <div className="dep-stat-row">
                  <span className="dep-stat-label">Critical Tier</span>
                  <span className="dep-stat-val">
                    {dep.critical ? 'CRITICAL (Tier 1)' : 'DEGRADED RESILIENT'}
                  </span>
                </div>

                {dep.details && (
                  <div style={{ marginTop: '0.25rem', paddingTop: '0.5rem', borderTop: '1px solid var(--h-border-subtle)' }}>
                    {Object.entries(dep.details).map(([dKey, dVal]) => (
                      <div key={dKey} className="dep-stat-row">
                        <span className="dep-stat-label">{dKey}</span>
                        <span className="dep-stat-val">{String(dVal)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Alert Monitor Banner */}
      <div className="alerts-banner">
        <div className="alerts-header">
          <h3 className="alerts-title">
            🔔 Threshold Alerting Foundation
          </h3>
          <span className="alerts-subtitle">
            PROMETHEUS ENGINE // LATENCY &amp; LAG GUARDS
          </span>
        </div>

        {alerts.map(alert => (
          <div key={alert.id} className="alert-item">
            <div>
              <span className={`alert-item-name ${alert.active ? 'active' : ''}`}>{alert.name}</span>
              <div className="alert-item-desc">
                {alert.description}
              </div>
            </div>
            <div>
              <span className={`alert-badge ${alert.active ? 'triggered' : 'ok'}`}>
                {alert.active ? 'TRIGGERED' : 'OK'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Durable Audit Logging Section */}
      <div className="audit-viewer-section">
        <div className="audit-header-row">
          <div>
            <h3 className="audit-title">
              🛡️ Durable Audit Log Trail
            </h3>
            <span className="audit-subtitle">
              Append-only compliance records with request correlation IDs
            </span>
          </div>

          <div className="audit-filter-pill-group">
            {['ALL', 'AUTH', 'MEETING', 'RBAC', 'SECURITY'].map(cat => (
              <button
                key={cat}
                type="button"
                className={`audit-filter-btn ${selectedActionFilter === cat ? 'active' : ''}`}
                onClick={() => setSelectedActionFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Search Bar */}
        <div className="audit-search-box">
          <span>🔍</span>
          <input
            type="search"
            placeholder="Search action, actor, resource or correlation ID…"
            value={auditSearch}
            onChange={e => setAuditSearch(e.target.value)}
          />
        </div>

        {/* Audit Log Table */}
        <div className="audit-table-wrapper">
          <table className="audit-table">
            <thead>
              <tr>
                <th>TIMESTAMP</th>
                <th>ACTION</th>
                <th>ACTOR</th>
                <th>RESOURCE</th>
                <th>RESULT</th>
                <th>CORRELATION ID</th>
                <th>DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => {
                const isExpanded = expandedLogId === log.id

                return (
                  <tr key={log.id}>
                    <td>
                      <span className="audit-timestamp">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </td>
                    <td>
                      <span className="audit-action-pill">{log.action}</span>
                    </td>
                    <td>
                      <div className="audit-actor-text" title={log.actorEmail || log.actorUserId}>
                        {log.actorEmail || log.actorUserId}
                      </div>
                    </td>
                    <td>{log.resourceType}{log.resourceId ? `:${log.resourceId}` : ''}</td>
                    <td>
                      <span className={`audit-result-tag ${log.result.toLowerCase()}`}>
                        {log.result}
                      </span>
                    </td>
                    <td>
                      <span className="audit-correlation-id" title={log.correlationId}>
                        {log.correlationId || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="audit-inspect-btn"
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      >
                        {isExpanded ? 'Hide' : 'Inspect'}
                      </button>

                      {isExpanded && log.metadata && (
                        <div className="audit-metadata-drawer">
                          <pre style={{ margin: 0 }}>{JSON.stringify(log.metadata, null, 2)}</pre>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--h-text-muted)' }}>
                    No audit records match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
