import { useState, useMemo } from 'react'
import './AdminTracksTab.css'

interface TrackStat {
  id: string
  name: string
  icon: string
  totalModules: number
  activeCandidates: number
  avgScore: number
  difficulty: 'Core' | 'Advanced' | 'Staff'
  description?: string
  tags?: string[]
}

interface AdminTracksTabProps {
  tracks: TrackStat[]
  onNavigateToCandidates?: (filter?: string) => void
}

type DifficultyFilter = 'All' | 'Core' | 'Advanced' | 'Staff'
type ViewMode = 'grid' | 'list'

export default function AdminTracksTab({ tracks, onNavigateToCandidates }: AdminTracksTabProps) {
  const [diffFilter, setDiffFilter] = useState<DifficultyFilter>('All')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const filtered = useMemo(() => {
    if (diffFilter === 'All') return tracks
    return tracks.filter(t => t.difficulty === diffFilter)
  }, [tracks, diffFilter])

  const totalChallenges = useMemo(() => tracks.reduce((a, t) => a + t.totalModules, 0), [tracks])
  const totalEnrolled = useMemo(() => tracks.reduce((a, t) => a + t.activeCandidates, 0), [tracks])
  const avgPlatformAccuracy = useMemo(() => {
    if (tracks.length === 0) return 0
    return Math.round(tracks.reduce((a, t) => a + t.avgScore, 0) / tracks.length)
  }, [tracks])

  const getDiffClass = (d: string) => d.toLowerCase() as 'core' | 'advanced' | 'staff'

  const getDiffEmoji = (d: string) => {
    if (d === 'Core') return '🟢'
    if (d === 'Advanced') return '🟣'
    return '🔴'
  }

  const getTrackDescription = (name: string) => {
    if (name.includes('JavaScript') || name.includes('DOM'))
      return 'Browser APIs, closures, event loop, performance optimization & rendering pipeline mastery.'
    if (name.includes('React'))
      return 'React 19 concurrent features, state architecture, Server Components & advanced patterns.'
    if (name.includes('System Design'))
      return 'Frontend system design, component libraries, micro-frontends & scalability fundamentals.'
    if (name.includes('Babel') || name.includes('AST'))
      return 'AST traversal, Babel transform plugins, compiler internals & code generation techniques.'
    if (name.includes('Algorithm'))
      return 'Data structures, sorting algorithms, dynamic programming & problem-solving frameworks.'
    if (name.includes('Mock') || name.includes('Video') || name.includes('AI'))
      return 'AI-powered video mock interviews with real-time feedback & behavioral coaching tracks.'
    return 'Structured curriculum track with progressive difficulty challenges and evaluation checkpoints.'
  }

  return (
    <div className="admin-tracks-tab">
      {/* ─── Top KPI Stat Cards ──────────────────────────────────────────── */}
      <div className="trk-stats-grid">
        <div className="trk-stat-card">
          <div className="trk-stat-icon purple">📚</div>
          <div className="trk-stat-info">
            <span className="trk-stat-label">Curriculum Tracks</span>
            <span className="trk-stat-value">{tracks.length}</span>
            <span className="trk-stat-sub">Active learning pathways</span>
          </div>
        </div>

        <div className="trk-stat-card">
          <div className="trk-stat-icon green">🎯</div>
          <div className="trk-stat-info">
            <span className="trk-stat-label">Total Challenges</span>
            <span className="trk-stat-value">{totalChallenges.toLocaleString()}</span>
            <span className="trk-stat-sub">Coding problems in catalog</span>
          </div>
        </div>

        <div className="trk-stat-card">
          <div className="trk-stat-icon cyan">👥</div>
          <div className="trk-stat-info">
            <span className="trk-stat-label">Total Enrollments</span>
            <span className="trk-stat-value">{totalEnrolled.toLocaleString()}</span>
            <span className="trk-stat-sub">Cross-track enrolled students</span>
          </div>
        </div>

        <div className="trk-stat-card">
          <div className="trk-stat-icon amber">📈</div>
          <div className="trk-stat-info">
            <span className="trk-stat-label">Avg Platform Accuracy</span>
            <span className="trk-stat-value">{avgPlatformAccuracy}%</span>
            <span className="trk-stat-sub">Across all curriculum tracks</span>
          </div>
        </div>
      </div>

      {/* ─── Filters & View Toggle ────────────────────────────────────────── */}
      <div className="trk-controls-bar">
        <div className="trk-pills">
          {(['All', 'Core', 'Advanced', 'Staff'] as DifficultyFilter[]).map(f => (
            <button
              key={f}
              type="button"
              className={`trk-pill ${diffFilter === f ? 'active' : ''}`}
              onClick={() => setDiffFilter(f)}
            >
              {f === 'All' ? '📚' : f === 'Core' ? '🟢' : f === 'Advanced' ? '🟣' : '🔴'}
              {f}
              <span style={{
                background: 'rgba(255,255,255,.18)',
                borderRadius: '9999px',
                padding: '1px 7px',
                fontSize: '.72rem',
                fontWeight: 700,
              }}>
                {f === 'All' ? tracks.length : tracks.filter(t => t.difficulty === f).length}
              </span>
            </button>
          ))}
        </div>

        <div className="trk-view-toggle">
          <button
            type="button"
            className={`trk-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            ⊞
          </button>
          <button
            type="button"
            className={`trk-view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            ☰
          </button>
        </div>
      </div>

      {/* ─── Grid View ───────────────────────────────────────────────────── */}
      {viewMode === 'grid' && (
        <div className="trk-grid">
          {filtered.map(tr => {
            const dc = getDiffClass(tr.difficulty)
            return (
              <div key={tr.id} className={`trk-card diff-${dc}`}>
                {/* Top: icon + difficulty badge */}
                <div className="trk-card-top">
                  <div className={`trk-icon-circle ${dc}`}>{tr.icon}</div>
                  <span className={`trk-diff-badge ${dc}`}>
                    {getDiffEmoji(tr.difficulty)} {tr.difficulty}
                  </span>
                </div>

                {/* Track name */}
                <h3 className="trk-card-name">{tr.name}</h3>

                {/* Description */}
                <p style={{ fontSize: '.85rem', color: 'var(--h-text-muted)', margin: 0, lineHeight: 1.5 }}>
                  {getTrackDescription(tr.name)}
                </p>

                {/* 3 metric cells */}
                <div className="trk-card-stats">
                  <div className="trk-stat-cell">
                    <span className="trk-cell-val">{tr.totalModules}</span>
                    <span className="trk-cell-lbl">Challenges</span>
                  </div>
                  <div className="trk-stat-cell">
                    <span className="trk-cell-val">{tr.activeCandidates.toLocaleString()}</span>
                    <span className="trk-cell-lbl">Enrolled</span>
                  </div>
                  <div className="trk-stat-cell">
                    <span className="trk-cell-val" style={{
                      color: tr.avgScore >= 75 ? '#01b574' : tr.avgScore >= 65 ? '#ffb547' : '#ee5d50'
                    }}>
                      {tr.avgScore}%
                    </span>
                    <span className="trk-cell-lbl">Avg Score</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="trk-progress-wrap">
                  <div className="trk-progress-labels">
                    <span>Platform Mastery</span>
                    <span style={{ color: 'var(--h-text-white)', fontWeight: 700 }}>{tr.avgScore}%</span>
                  </div>
                  <div className="trk-progress-track">
                    <div
                      className={`trk-progress-fill ${dc}`}
                      style={{ width: `${tr.avgScore}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="trk-card-footer">
                  <div className="trk-footer-info">
                    <span>⚡</span>
                    <span>{tr.activeCandidates >= 1000 ? `${(tr.activeCandidates / 1000).toFixed(1)}K` : tr.activeCandidates} active learners</span>
                  </div>
                  <button
                    type="button"
                    className="trk-view-challenges-btn"
                    onClick={() => onNavigateToCandidates?.(tr.name)}
                    title={`View candidates in ${tr.name}`}
                  >
                    <span>View Candidates</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ─── List / Table View ───────────────────────────────────────────── */}
      {viewMode === 'list' && (
        <div className="trk-table-wrap">
          <table className="trk-table">
            <thead>
              <tr>
                <th style={{ width: 52 }}>#</th>
                <th>Track</th>
                <th>Difficulty</th>
                <th>Challenges</th>
                <th>Enrolled</th>
                <th>Avg Score</th>
                <th>Mastery Progress</th>
                <th style={{ width: 110 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tr, idx) => {
                const dc = getDiffClass(tr.difficulty)
                return (
                  <tr key={tr.id}>
                    <td style={{ color: 'var(--h-text-muted)', fontWeight: 700 }}>
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className={`trk-table-icon ${dc === 'core' ? '' : ''}`} style={{
                          background: dc === 'core'
                            ? 'rgba(1,181,116,.15)'
                            : dc === 'advanced'
                            ? 'rgba(117,81,255,.15)'
                            : 'rgba(238,93,80,.12)',
                          border: `1px solid ${dc === 'core' ? 'rgba(1,181,116,.25)' : dc === 'advanced' ? 'rgba(117,81,255,.25)' : 'rgba(238,93,80,.2)'}`,
                        }}>
                          {tr.icon}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--h-text-white)', fontSize: '.9rem' }}>{tr.name}</div>
                          <div style={{ fontSize: '.76rem', color: 'var(--h-text-muted)', marginTop: 2 }}>
                            {getTrackDescription(tr.name).slice(0, 55)}…
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`trk-diff-badge ${dc}`}>
                        {getDiffEmoji(tr.difficulty)} {tr.difficulty}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{tr.totalModules}</td>
                    <td style={{ fontWeight: 700 }}>{tr.activeCandidates.toLocaleString()}</td>
                    <td>
                      <span style={{
                        fontWeight: 800,
                        color: tr.avgScore >= 75 ? '#01b574' : tr.avgScore >= 65 ? '#ffb547' : '#ee5d50'
                      }}>
                        {tr.avgScore}%
                      </span>
                    </td>
                    <td>
                      <div className="trk-table-progress">
                        <div className="trk-table-bar">
                          <div
                            className={`trk-table-bar-fill ${dc}`}
                            style={{ width: `${tr.avgScore}%` }}
                          />
                        </div>
                        <span className="trk-table-pct">{tr.avgScore}%</span>
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="trk-view-challenges-btn"
                        style={{ fontSize: '.76rem', padding: '6px 10px' }}
                        onClick={() => onNavigateToCandidates?.(tr.name)}
                      >
                        Candidates →
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── Platform Summary Footer Card ────────────────────────────────── */}
      <div className="trk-summary-card">
        <div className="trk-summary-left">
          <h4 className="trk-summary-title">📊 Platform Curriculum Summary</h4>
          <p className="trk-summary-sub">
            Aggregate learning activity across all {tracks.length} tracks — updated in real time from Supabase.
          </p>
        </div>
        <div className="trk-summary-metrics">
          <div className="trk-summary-metric">
            <span className="trk-sm-val">{tracks.filter(t => t.difficulty === 'Core').length}</span>
            <span className="trk-sm-lbl">Core<br/>Tracks</span>
          </div>
          <div className="trk-summary-metric">
            <span className="trk-sm-val">{tracks.filter(t => t.difficulty === 'Advanced').length}</span>
            <span className="trk-sm-lbl">Advanced<br/>Tracks</span>
          </div>
          <div className="trk-summary-metric">
            <span className="trk-sm-val">{tracks.filter(t => t.difficulty === 'Staff').length}</span>
            <span className="trk-sm-lbl">Staff<br/>Tracks</span>
          </div>
          <div className="trk-summary-metric">
            <span className="trk-sm-val" style={{ color: '#01b574' }}>
              {tracks.filter(t => t.avgScore >= 75).length}/{tracks.length}
            </span>
            <span className="trk-sm-lbl">High<br/>Mastery</span>
          </div>
        </div>
      </div>
    </div>
  )
}
