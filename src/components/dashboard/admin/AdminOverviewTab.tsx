import type { AdminOverviewStats, TimeframeFilter, OverviewDataSource } from '../../../lib/adminAnalyticsService'
import { MACHINE_CODING_CATALOG } from '../../machinecoding/data/machineCodingCatalog'
import { DSA_QUESTIONS } from '../../dsa/data/dsaQuestions'
import { CORE_PROGRAMMING_QUESTIONS } from '../../coreprogramming/data/coreProgrammingQuestions'
import { FRONTEND_JS_QUESTIONS } from '../../frontendjs/data/frontendJsQuestions'

interface AdminOverviewTabProps {
  stats: AdminOverviewStats | null
  timeframe: TimeframeFilter
  onTimeframeChange: (tf: TimeframeFilter) => void
  dataSource: OverviewDataSource
  onDataSourceChange: (src: OverviewDataSource) => void
  onNavigateTab: (tab: any) => void
  onInspectUser?: (userId: string) => void
}

export default function AdminOverviewTab({
  stats,
  timeframe,
  onTimeframeChange,
  dataSource,
  onDataSourceChange,
  onNavigateTab,
}: AdminOverviewTabProps) {
  const mcTotalQuestions = MACHINE_CODING_CATALOG.length
  const dsaTotalQuestions = DSA_QUESTIONS.length
  const cpTotalQuestions = CORE_PROGRAMMING_QUESTIONS.length
  const fjsTotalQuestions = FRONTEND_JS_QUESTIONS.length
  const totalPlatformChallenges = mcTotalQuestions + dsaTotalQuestions + cpTotalQuestions + fjsTotalQuestions

  const s = stats || {
    totalUsers: 0,
    activeUsers: 0,
    totalQuestions: totalPlatformChallenges,
    totalAttempts: 0,
    totalSubmissions: 0,
    completedQuestions: 0,
    acceptedSubmissions: 0,
    failedSubmissions: 0,
    activityToday: 0,
    completionRate: 0,
    successRate: 0,
    avgAttemptsPerQuestion: 0,
    avgTimeSpentMinutes: 0,
    mcTotalQuestions,
    mcSubmissionsCount: 0,
    mcAcceptedCount: 0,
    mcAttemptsCount: 0,
    mcCompletedCount: 0,
    dsaTotalQuestions,
    dsaSubmissionsCount: 0,
    dsaAcceptedCount: 0,
    cpTotalQuestions,
    cpSubmissionsCount: 0,
    cpAcceptedCount: 0,
    fjsTotalQuestions,
    fjsSubmissionsCount: 0,
    fjsAcceptedCount: 0,
  }

  return (
    <div className="admin-overview-panel">
      {/* Top Controls: Timeframe Filter */}
      <div className="overview-header-bar">
        <div>
          <h2>System Operations &amp; Candidate Activity Overview</h2>
          <p className="overview-desc">
            Aggregated real-time metrics across {totalPlatformChallenges.toLocaleString()} coding challenges (Machine Coding, Core Programming, DSA, Frontend JS), active candidate submissions, problem attempts, and database audit logs.
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
        <div className="timeframe-pill-selector">
          <span className="tf-label">Data:</span>
          <button
            type="button"
            className={`tf-btn ${dataSource === 'all' ? 'active' : ''}`}
            onClick={() => onDataSourceChange('all')}
            title="Server rows plus this device's local practice rows"
          >
            🌐 All Data
          </button>
          <button
            type="button"
            className={`tf-btn ${dataSource === 'server' ? 'active' : ''}`}
            onClick={() => onDataSourceChange('server')}
            title="Server rows only — identical on every browser"
          >
            🗄️ Server Only
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
            <span className="oc-icon">⚡</span>
            <span className="oc-badge purple">Catalog</span>
          </div>
          <div className="oc-value">{totalPlatformChallenges.toLocaleString()}</div>
          <div className="oc-label">Total Coding Challenges</div>
          <div className="oc-sub">500 MC · 1,000 DSA · 500 CP · 1,000 FJS</div>
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

      {/* 4 Curriculum Tracks Performance Grid */}
      <div className="overview-tracks-section">
        <div className="tracks-section-header">
          <h3>Curriculum Tracks &amp; Studio Performance</h3>
          <span className="tracks-section-subtitle">Real-time submissions and acceptance across all 4 programming tracks</span>
        </div>
        <div className="overview-tracks-grid">
          {/* Machine Coding */}
          <div className="overview-track-card" onClick={() => onNavigateTab('submissions')}>
            <div className="otc-top">
              <span className="otc-icon">⚡</span>
              <span className="otc-badge purple">Machine Coding</span>
            </div>
            <div className="otc-title">React &amp; UI Systems</div>
            <div className="otc-stats-row">
              <div>
                <div className="otc-stat-val">{mcTotalQuestions}</div>
                <div className="otc-stat-lbl">Challenges</div>
              </div>
              <div>
                <div className="otc-stat-val">{s.mcSubmissionsCount || 0}</div>
                <div className="otc-stat-lbl">Submissions</div>
              </div>
              <div>
                <div className="otc-stat-val" style={{ color: '#22c55e' }}>{s.mcAcceptedCount || 0}</div>
                <div className="otc-stat-lbl">Passed</div>
              </div>
            </div>
          </div>

          {/* DSA Masterclass */}
          <div className="overview-track-card" onClick={() => onNavigateTab('submissions')}>
            <div className="otc-top">
              <span className="otc-icon">📐</span>
              <span className="otc-badge cyan">DSA Masterclass</span>
            </div>
            <div className="otc-title">Data Structures &amp; Algorithms</div>
            <div className="otc-stats-row">
              <div>
                <div className="otc-stat-val">{dsaTotalQuestions}</div>
                <div className="otc-stat-lbl">Problems</div>
              </div>
              <div>
                <div className="otc-stat-val">{s.dsaSubmissionsCount || 0}</div>
                <div className="otc-stat-lbl">Submissions</div>
              </div>
              <div>
                <div className="otc-stat-val" style={{ color: '#22c55e' }}>{s.dsaAcceptedCount || 0}</div>
                <div className="otc-stat-lbl">Passed</div>
              </div>
            </div>
          </div>

          {/* Core Programming */}
          <div className="overview-track-card" onClick={() => onNavigateTab('submissions')}>
            <div className="otc-top">
              <span className="otc-icon">💻</span>
              <span className="otc-badge amber">Core Programming</span>
            </div>
            <div className="otc-title">Core JavaScript &amp; Polyfills (JS-P)</div>
            <div className="otc-stats-row">
              <div>
                <div className="otc-stat-val">{cpTotalQuestions}</div>
                <div className="otc-stat-lbl">Problems</div>
              </div>
              <div>
                <div className="otc-stat-val">{s.cpSubmissionsCount || 0}</div>
                <div className="otc-stat-lbl">Submissions</div>
              </div>
              <div>
                <div className="otc-stat-val" style={{ color: '#22c55e' }}>{s.cpAcceptedCount || 0}</div>
                <div className="otc-stat-lbl">Passed</div>
              </div>
            </div>
          </div>

          {/* Frontend JS */}
          <div className="overview-track-card" onClick={() => onNavigateTab('submissions')}>
            <div className="otc-top">
              <span className="otc-icon">🌐</span>
              <span className="otc-badge green">Frontend JS</span>
            </div>
            <div className="otc-title">DOM &amp; Web APIs (FJP)</div>
            <div className="otc-stats-row">
              <div>
                <div className="otc-stat-val">{fjsTotalQuestions}</div>
                <div className="otc-stat-lbl">Challenges</div>
              </div>
              <div>
                <div className="otc-stat-val">{s.fjsSubmissionsCount || 0}</div>
                <div className="otc-stat-lbl">Submissions</div>
              </div>
              <div>
                <div className="otc-stat-val" style={{ color: '#22c55e' }}>{s.fjsAcceptedCount || 0}</div>
                <div className="otc-stat-lbl">Passed</div>
              </div>
            </div>
          </div>
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
              <div className="lp-desc">Analyze completion rates and difficulty bottlenecks across {totalPlatformChallenges.toLocaleString()} challenges</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
