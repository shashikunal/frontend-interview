import type { AdminOverviewStats, TimeframeFilter } from '../../../lib/adminAnalyticsService'

interface AdminOverviewTabProps {
  stats: AdminOverviewStats | null
  timeframe: TimeframeFilter
  onTimeframeChange: (tf: TimeframeFilter) => void
  onNavigateTab: (tab: any) => void
  onInspectUser?: (userId: string) => void
}

export default function AdminOverviewTab({
  stats,
  timeframe,
  onTimeframeChange,
  onNavigateTab,
}: AdminOverviewTabProps) {
  const s = stats || {
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
    <div className="admin-overview-panel">
      {/* Top Controls: Timeframe Filter */}
      <div className="overview-header-bar">
        <div>
          <h2>System Operations &amp; Candidate Activity Overview</h2>
          <p className="overview-desc">
            Aggregated real-time metrics across 22,222 questions, active candidate submissions, problem attempts, and cloud audit logs.
          </p>
        </div>

        <div className="timeframe-pill-selector">
          <span className="tf-label">Filter:</span>
          <button
            type="button"
            className={`tf-btn ${timeframe === 'today' ? 'active' : ''}`}
            onClick={() => onTimeframeChange('today')}
          >
            Today
          </button>
          <button
            type="button"
            className={`tf-btn ${timeframe === '7days' ? 'active' : ''}`}
            onClick={() => onTimeframeChange('7days')}
          >
            7 Days
          </button>
          <button
            type="button"
            className={`tf-btn ${timeframe === '30days' ? 'active' : ''}`}
            onClick={() => onTimeframeChange('30days')}
          >
            30 Days
          </button>
          <button
            type="button"
            className={`tf-btn ${timeframe === 'all' ? 'active' : ''}`}
            onClick={() => onTimeframeChange('all')}
          >
            All Time
          </button>
        </div>
      </div>

      {/* 9 Core Metric Cards Grid */}
      <div className="overview-kpi-grid">
        <div className="overview-card" onClick={() => onNavigateTab('users')}>
          <div className="oc-header">
            <span className="oc-icon">👥</span>
            <span className="oc-badge">Total</span>
          </div>
          <div className="oc-value">{s.totalUsers.toLocaleString()}</div>
          <div className="oc-label">Total Registered Users</div>
          <div className="oc-sub">Candidates, pro members, &amp; admins</div>
        </div>

        <div className="overview-card" onClick={() => onNavigateTab('users')}>
          <div className="oc-header">
            <span className="oc-icon">🟢</span>
            <span className="oc-badge green">Active</span>
          </div>
          <div className="oc-value">{s.activeUsers.toLocaleString()}</div>
          <div className="oc-label">Active Users</div>
          <div className="oc-sub">In selected timeframe</div>
        </div>

        <div className="overview-card" onClick={() => onNavigateTab('questions')}>
          <div className="oc-header">
            <span className="oc-icon">📚</span>
            <span className="oc-badge purple">Catalog</span>
          </div>
          <div className="oc-value">{s.totalQuestions.toLocaleString()}</div>
          <div className="oc-label">Total Questions Bank</div>
          <div className="oc-sub">Frontend, LeetCode, SDUI &amp; System Design</div>
        </div>

        <div className="overview-card" onClick={() => onNavigateTab('attempts')}>
          <div className="oc-header">
            <span className="oc-icon">⏱️</span>
            <span className="oc-badge amber">Attempts</span>
          </div>
          <div className="oc-value">{s.totalAttempts.toLocaleString()}</div>
          <div className="oc-label">Question Attempts</div>
          <div className="oc-sub">Session problem solving instances</div>
        </div>

        <div className="overview-card" onClick={() => onNavigateTab('submissions')}>
          <div className="oc-header">
            <span className="oc-icon">📝</span>
            <span className="oc-badge cyan">Submissions</span>
          </div>
          <div className="oc-value">{s.totalSubmissions.toLocaleString()}</div>
          <div className="oc-label">Total Submissions</div>
          <div className="oc-sub">Code executions and tests graded</div>
        </div>

        <div className="overview-card" onClick={() => onNavigateTab('submissions')}>
          <div className="oc-header">
            <span className="oc-icon">✅</span>
            <span className="oc-badge green">Passed</span>
          </div>
          <div className="oc-value" style={{ color: '#22c55e' }}>{s.acceptedSubmissions.toLocaleString()}</div>
          <div className="oc-label">Accepted Submissions</div>
          <div className="oc-sub">Full assertion passes</div>
        </div>

        <div className="overview-card" onClick={() => onNavigateTab('submissions')}>
          <div className="oc-header">
            <span className="oc-icon">✕</span>
            <span className="oc-badge red">Failed</span>
          </div>
          <div className="oc-value" style={{ color: '#ef4444' }}>{s.failedSubmissions.toLocaleString()}</div>
          <div className="oc-label">Failed Submissions</div>
          <div className="oc-sub">Wrong answers or runtime errors</div>
        </div>

        <div className="overview-card" onClick={() => onNavigateTab('questions')}>
          <div className="oc-header">
            <span className="oc-icon">🏆</span>
            <span className="oc-badge gold">Completed</span>
          </div>
          <div className="oc-value">{s.completedQuestions.toLocaleString()}</div>
          <div className="oc-label">Completed Questions</div>
          <div className="oc-sub">Distinct problem resolutions</div>
        </div>

        <div className="overview-card" onClick={() => onNavigateTab('activity')}>
          <div className="oc-header">
            <span className="oc-icon">⚡</span>
            <span className="oc-badge blue">Today</span>
          </div>
          <div className="oc-value">{s.activityToday.toLocaleString()}</div>
          <div className="oc-label">Activity Today</div>
          <div className="oc-sub">Telemetry events logged since 00:00 UTC</div>
        </div>
      </div>

      {/* Aggregate Ratios Bar */}
      <div className="overview-ratios-card">
        <div className="orc-item">
          <div className="orc-title">Overall Completion Rate</div>
          <div className="orc-progress-wrap">
            <div className="orc-bar">
              <div className="orc-fill green" style={{ width: `${s.completionRate}%` }} />
            </div>
            <span className="orc-pct">{s.completionRate}%</span>
          </div>
          <span className="orc-sub">Completed attempts / Total attempts</span>
        </div>

        <div className="orc-item">
          <div className="orc-title">Submission Success Rate</div>
          <div className="orc-progress-wrap">
            <div className="orc-bar">
              <div className="orc-fill blue" style={{ width: `${s.successRate}%` }} />
            </div>
            <span className="orc-pct">{s.successRate}%</span>
          </div>
          <span className="orc-sub">Accepted / Total graded submissions</span>
        </div>

        <div className="orc-item">
          <div className="orc-title">Average Attempts / Question</div>
          <div className="orc-big-num">{s.avgAttemptsPerQuestion}x</div>
          <span className="orc-sub">Attempts before achieving accepted pass</span>
        </div>

        <div className="orc-item">
          <div className="orc-title">Average Time Spent</div>
          <div className="orc-big-num">{s.avgTimeSpentMinutes} mins</div>
          <span className="orc-sub">Average solving duration per challenge</span>
        </div>
      </div>

      {/* Quick Launchpad Buttons */}
      <div className="overview-quick-launchpad">
        <h3>Admin Command Navigation</h3>
        <div className="launchpad-grid">
          <button type="button" className="lp-card" onClick={() => onNavigateTab('users')}>
            <span className="lp-icon">👥</span>
            <div>
              <div className="lp-title">Manage Candidates &amp; Users</div>
              <div className="lp-desc">Inspect candidate progress, deep-dive question history, and manage roles</div>
            </div>
          </button>
          <button type="button" className="lp-card" onClick={() => onNavigateTab('submissions')}>
            <span className="lp-icon">📝</span>
            <div>
              <div className="lp-title">View All Submissions</div>
              <div className="lp-desc">Inspect submitted code, execution times, memory, and assertion scores</div>
            </div>
          </button>
          <button type="button" className="lp-card" onClick={() => onNavigateTab('activity')}>
            <span className="lp-icon">⚡</span>
            <div>
              <div className="lp-title">Live Activity Stream</div>
              <div className="lp-desc">Chronological feed of views, code runs, and completions</div>
            </div>
          </button>
          <button type="button" className="lp-card" onClick={() => onNavigateTab('questions')}>
            <span className="lp-icon">❓</span>
            <div>
              <div className="lp-title">Question Bank Performance</div>
              <div className="lp-desc">Analyze completion rates and difficulty bottlenecks across 22,222 questions</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
