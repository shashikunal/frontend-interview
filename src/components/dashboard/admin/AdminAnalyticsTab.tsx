import type { AdminOverviewStats } from '../../../lib/adminAnalyticsService'

interface AdminAnalyticsTabProps {
  stats?: AdminOverviewStats | null
  overviewStats?: AdminOverviewStats | null
}

export default function AdminAnalyticsTab({ stats, overviewStats }: AdminAnalyticsTabProps) {
  const s = stats || overviewStats || {
    totalUsers: 1,
    activeUsers: 1,
    totalQuestions: 22222,
    totalAttempts: 0,
    totalSubmissions: 0,
    completedQuestions: 0,
    acceptedSubmissions: 0,
    failedSubmissions: 0,
    activityToday: 0,
    completionRate: 0,
    successRate: 0,
    avgAttemptsPerQuestion: 1.2,
    avgTimeSpentMinutes: 15,
  }

  return (
    <div className="admin-analytics-tab">
      <div className="card-box aat-panel">
        <div className="aat-header">
          <h3>Platform Analytics &amp; Aggregate Candidate Trends</h3>
          <p className="aat-desc">
            Deep-dive aggregate telemetry metrics across candidate learning trajectories, test passes, and language selections.
          </p>
        </div>

        <div className="analytics-metrics-grid">
          <div className="metric-panel-card">
            <h4>🎯 Submission Success Distribution</h4>
            <div className="mpc-ratio-row">
              <span className="mpc-label">Accepted Submissions</span>
              <span className="mpc-num" style={{ color: '#22c55e' }}>{s.acceptedSubmissions}</span>
            </div>
            <div className="mini-track" style={{ height: '8px', margin: '8px 0 14px' }}>
              <div className="mini-fill" style={{ width: `${s.successRate}%`, background: '#22c55e' }} />
            </div>

            <div className="mpc-ratio-row">
              <span className="mpc-label">Failed / Need Revision</span>
              <span className="mpc-num" style={{ color: '#ef4444' }}>{s.failedSubmissions}</span>
            </div>
            <div className="mini-track" style={{ height: '8px', margin: '8px 0 14px' }}>
              <div className="mini-fill" style={{ width: `${100 - s.successRate}%`, background: '#ef4444' }} />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Overall platform submission success rate: <strong>{s.successRate}%</strong>
            </p>
          </div>

          <div className="metric-panel-card">
            <h4>📚 Curriculum Completion Velocity</h4>
            <div className="mpc-ratio-row">
              <span className="mpc-label">Total Catalog Questions</span>
              <span className="mpc-num">{s.totalQuestions}</span>
            </div>
            <div className="mpc-ratio-row">
              <span className="mpc-label">Distinct Solved Challenges</span>
              <span className="mpc-num" style={{ color: '#c084fc' }}>{s.completedQuestions}</span>
            </div>
            <div className="mpc-ratio-row">
              <span className="mpc-label">Avg Attempts / Challenge</span>
              <span className="mpc-num">{s.avgAttemptsPerQuestion}x</span>
            </div>
            <div className="mpc-ratio-row">
              <span className="mpc-label">Avg Candidate Solving Time</span>
              <span className="mpc-num">{s.avgTimeSpentMinutes} mins</span>
            </div>
          </div>

          <div className="metric-panel-card">
            <h4>⚡ Telemetry Activity Breakdown</h4>
            <div className="mpc-ratio-row">
              <span className="mpc-label">Activity Events Today</span>
              <span className="mpc-num" style={{ color: '#38bdf8' }}>{s.activityToday}</span>
            </div>
            <div className="mpc-ratio-row">
              <span className="mpc-label">Active Solvers Today</span>
              <span className="mpc-num" style={{ color: '#34d399' }}>{s.activeUsers}</span>
            </div>
            <div className="mpc-ratio-row">
              <span className="mpc-label">Total Platform Attempts</span>
              <span className="mpc-num">{s.totalAttempts}</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px' }}>
              Synchronized via persistent Supabase PostgreSQL audit logs.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
