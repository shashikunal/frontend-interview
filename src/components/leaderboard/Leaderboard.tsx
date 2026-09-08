import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  leaderboardService,
  type LeaderboardEntry,
  type LeaderboardTimeframe,
  type LeaderboardCategory,
  type TierName,
} from '../../lib/leaderboardService'
import './Leaderboard.css'

interface LeaderboardProps {
  compact?: boolean
}

const TIER_EMOJI: Record<TierName, string> = {
  diamond: '💎',
  platinum: '🔮',
  gold: '🥇',
  silver: '🥈',
  bronze: '🥉',
}

const TIER_LABEL: Record<TierName, string> = {
  diamond: 'Diamond',
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
}

function RankDelta({ delta }: { delta: number }) {
  if (delta === 0) return <span className="lb-rank-delta same">— 0</span>
  if (delta > 0) return <span className="lb-rank-delta up">▲ +{delta}</span>
  return <span className="lb-rank-delta down">▼ {delta}</span>
}

function TierBadge({ tier }: { tier: TierName }) {
  return (
    <span className={`lb-tier-badge ${tier}`}>
      {TIER_EMOJI[tier]} {TIER_LABEL[tier]}
    </span>
  )
}

function Avatar({ name, color, size = 38 }: { name: string; color: string; size?: number }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div
      className="lb-avatar-sm"
      style={{ background: color, width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  )
}

function PodiumCard({ entry, position }: { entry: LeaderboardEntry; position: 1 | 2 | 3 }) {
  const medals = { 1: '👑', 2: '🥈', 3: '🥉' }
  const rankLabels = { 1: '1st Place', 2: '2nd Place', 3: '3rd Place' }

  return (
    <div className={`lb-podium-card rank-${position}`}>
      <div className={`lb-podium-rank-badge rank-${position}`}>{position}</div>
      <span className="lb-podium-crown">{medals[position]}</span>

      <div
        className="lb-podium-avatar"
        style={{
          background: entry.avatarColor,
          width: position === 1 ? 86 : 72,
          height: position === 1 ? 86 : 72,
          margin: '16px auto 12px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: position === 1 ? '1.7rem' : '1.4rem',
          color: '#fff',
        }}
      >
        {entry.initials}
      </div>

      <div className="lb-podium-name">{entry.name}</div>
      <div className="lb-podium-company">
        {entry.company ? `${entry.company} · ` : ''}{entry.level || rankLabels[position]}
      </div>

      <span className="lb-podium-score">{entry.totalScore}</span>
      <span className="lb-podium-score-label">pts</span>

      <div className="lb-podium-meta">
        <span>🎯 {entry.questionsCompleted} solved</span>
        <span>✅ {entry.accuracyRate}% acc</span>
      </div>

      <div className="lb-candidate-id-badge" title={`Candidate ID: ${entry.userId}`}>
        ID: {entry.userId.slice(0, 8)}...
      </div>

      {entry.recentQuestions && entry.recentQuestions.length > 0 && (
        <div className="lb-podium-recent">
          {entry.recentQuestions.slice(0, 2).map(q => (
            <span key={q.id} className="lb-recent-chip" title={`${q.id}: ${q.title} (${q.score}%)`}>
              ⚡ {q.id}
            </span>
          ))}
        </div>
      )}

      {entry.streak > 0 && (
        <div style={{ marginTop: 10, fontSize: '0.78rem', color: '#f59e0b' }}>
          🔥 {entry.streak}d streak
        </div>
      )}

      <div className="lb-badges" style={{ justifyContent: 'center', marginTop: 12 }}>
        {entry.badges.slice(0, 2).map(b => (
          <span key={b.id} className="lb-badge-pill" style={{ color: b.color, borderColor: b.color + '44' }}>
            {b.emoji} {b.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 7 }).map((_, i) => (
        <tr key={i}>
          <td><div className="lb-skeleton-block" style={{ width: 28, height: 20 }} /></td>
          <td>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div className="lb-skeleton-block" style={{ width: 38, height: 38, borderRadius: '50%' }} />
              <div>
                <div className="lb-skeleton-block" style={{ width: 120, height: 14, marginBottom: 6 }} />
                <div className="lb-skeleton-block" style={{ width: 80, height: 10 }} />
              </div>
            </div>
          </td>
          <td><div className="lb-skeleton-block" style={{ width: 70, height: 20, borderRadius: 20 }} /></td>
          <td>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="lb-skeleton-block" style={{ width: 32, height: 18 }} />
              <div className="lb-skeleton-block" style={{ flex: 1, height: 5, minWidth: 80 }} />
            </div>
          </td>
          <td className="lb-hide-mobile"><div className="lb-skeleton-block" style={{ width: 36, height: 16 }} /></td>
          <td className="lb-hide-mobile"><div className="lb-skeleton-block" style={{ width: 36, height: 16 }} /></td>
          <td className="lb-hide-mobile"><div className="lb-skeleton-block" style={{ width: 60, height: 18 }} /></td>
        </tr>
      ))}
    </>
  )
}

export default function Leaderboard({ compact = false }: LeaderboardProps) {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const initialCat = (searchParams.get('category') as LeaderboardCategory) || 'all'
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>('all')
  const [category, setCategory] = useState<LeaderboardCategory>(initialCat)
  const [myEntry, setMyEntry] = useState<LeaderboardEntry | null>(null)

  const handleCategoryChange = (newCat: LeaderboardCategory) => {
    setCategory(newCat)
    if (newCat === 'all') {
      searchParams.delete('category')
      setSearchParams(searchParams)
    } else {
      setSearchParams({ ...Object.fromEntries(searchParams.entries()), category: newCat })
    }
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await leaderboardService.getGlobalLeaderboard(timeframe, category, compact ? 20 : 50)
      setEntries(data)

      // Identify the current active candidate
      if (user) {
        const me = data.find(e =>
          (user.id && e.userId === user.id) ||
          (user.email && e.userId.toLowerCase().includes(user.email.toLowerCase())) ||
          (user.name && e.name.toLowerCase() === user.name.toLowerCase())
        ) ?? null
        setMyEntry(me)
      }
    } finally {
      setLoading(false)
    }
  }, [timeframe, category, compact, user])

  useEffect(() => { void load() }, [load])

  // Filter by user search query (name or candidate ID)
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries
    const q = searchQuery.toLowerCase().trim()
    return entries.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.userId.toLowerCase().includes(q) ||
      (e.company && e.company.toLowerCase().includes(q))
    )
  }, [entries, searchQuery])

  const topThree = filteredEntries.slice(0, 3)

  return (
    <div className={`leaderboard-page ${compact ? 'compact-mode' : ''}`}>
      {/* ---- Header ---- */}
      <div className="lb-header">
        <div className="lb-header-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0 }}>🏆 Global Leaderboard</h1>
            <span className="lb-live-status-pill">
              <span className="lb-live-pulse-dot" /> Live Supabase Synced
            </span>
          </div>
          <p>Real-time candidate submissions and rankings verified from Supabase</p>
        </div>

        <div className="lb-header-right">
          {/* Quick Solve Link */}
          <Link to="/machine-coding" className="lb-cta-solve-btn">
            ⚡ Machine Coding Studio
          </Link>

          {/* Timeframe filter */}
          <div className="lb-filters">
            {(['today', '7days', '30days', 'all'] as LeaderboardTimeframe[]).map(tf => (
              <button
                key={tf}
                type="button"
                id={`lb-timeframe-${tf}`}
                className={`lb-filter-btn ${timeframe === tf ? 'active' : ''}`}
                onClick={() => setTimeframe(tf)}
              >
                {tf === 'today' ? 'Today' : tf === '7days' ? '7 Days' : tf === '30days' ? '30 Days' : 'All Time'}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <select
            id="lb-category-select"
            className="lb-filter-select"
            value={category}
            onChange={e => handleCategoryChange(e.target.value as LeaderboardCategory)}
          >
            <option value="all">All Categories</option>
            <option value="machine-coding">⚡ Machine Coding Submissions</option>
            <option value="algorithms">Algorithms & Logic</option>
            <option value="javascript">JavaScript & DOM</option>
            <option value="system-design">System Design</option>
          </select>
        </div>
      </div>

      {/* ---- Search Bar ---- */}
      <div className="lb-search-bar-wrap">
        <span className="lb-search-icon">🔍</span>
        <input
          type="text"
          className="lb-search-input"
          placeholder="Search by candidate name, target company, or candidate ID..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button type="button" className="lb-search-clear" onClick={() => setSearchQuery('')}>
            ✕
          </button>
        )}
      </div>

      {/* ---- My Rank Banner ---- */}
      {myEntry && (
        <div className="lb-my-rank">
          <div>
            <div className="lb-my-rank-label">Your Standing (Candidate ID: {myEntry.userId.slice(0, 8)}...)</div>
            <div className="lb-my-rank-value">#{myEntry.rank} · {myEntry.totalScore} pts</div>
          </div>
          <TierBadge tier={myEntry.tier} />
          <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
            {myEntry.questionsCompleted} questions · {myEntry.accuracyRate}% accuracy · 🔥 {myEntry.streak}d streak
          </div>
        </div>
      )}

      {/* ---- Podium ---- */}
      {!loading && topThree.length >= 3 && !searchQuery && (
        <div className="lb-podium">
          {/* Reorder: 2nd, 1st, 3rd */}
          <PodiumCard entry={topThree[1]} position={2} />
          <PodiumCard entry={topThree[0]} position={1} />
          <PodiumCard entry={topThree[2]} position={3} />
        </div>
      )}

      {/* ---- Ranked Table ---- */}
      <div className="lb-table-wrap">
        <div className="lb-section-title" style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            {category === 'machine-coding' ? '⚡ Machine Coding Leaderboard' : 'Full Rankings'} — {filteredEntries.length} verified candidates
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 400 }}>
            Source: Supabase PostgreSQL
          </span>
        </div>

        <table className="lb-table" role="table" aria-label="Candidate leaderboard rankings">
          <thead>
            <tr>
              <th style={{ width: 60, textAlign: 'center' }}>#</th>
              <th>Candidate &amp; ID</th>
              <th>Tier</th>
              <th>Score</th>
              <th className="lb-hide-mobile">Solved</th>
              <th className="lb-hide-mobile">Accuracy</th>
              <th className="lb-hide-mobile">Recent Challenges</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows />
            ) : filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="lb-empty">
                    <span className="lb-empty-icon">⚡</span>
                    <h3>No machine coding submissions found</h3>
                    <p>Be the first candidate to solve a machine-level coding question and rank on the leaderboard!</p>
                    <Link to="/machine-coding" className="lb-cta-solve-btn" style={{ marginTop: 12, display: 'inline-flex' }}>
                      Start Machine Coding →
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              filteredEntries.map(entry => {
                const isMe = user?.id === entry.userId || (user?.email && entry.userId.toLowerCase().includes(user.email.toLowerCase()))
                return (
                  <tr
                    key={entry.userId}
                    id={`lb-row-${entry.userId}`}
                    className={isMe ? 'highlighted' : ''}
                  >
                    {/* Rank */}
                    <td className="lb-rank-cell">
                      <span className={`lb-rank-num ${entry.rank <= 3 ? 'top3' : ''}`}>
                        {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                      </span>
                      <RankDelta delta={entry.rankChange} />
                    </td>

                    {/* Candidate */}
                    <td>
                      <div className="lb-candidate-cell">
                        <Avatar name={entry.name} color={entry.avatarColor} size={38} />
                        <div className="lb-candidate-info">
                          <div className="lb-candidate-name">
                            {entry.name}
                            {isMe && (
                              <span style={{ marginLeft: 6, fontSize: '0.7rem', color: '#6366f1', background: 'rgba(99, 102, 241, 0.12)', padding: '2px 6px', borderRadius: '4px' }}>You</span>
                            )}
                          </div>
                          <div className="lb-candidate-meta">
                            {entry.company && `${entry.company} · `}{entry.level || 'Candidate'}
                            <span className="lb-inline-cid" title={`Candidate UUID: ${entry.userId}`}>
                              · ID: {entry.userId.slice(0, 8)}...
                            </span>
                          </div>
                          {/* Badges inline on mobile */}
                          {entry.badges.length > 0 && (
                            <div className="lb-badges" style={{ marginTop: 4 }}>
                              {entry.badges.map(b => (
                                <span
                                  key={b.id}
                                  className="lb-badge-pill"
                                  style={{ color: b.color, borderColor: b.color + '44' }}
                                >
                                  {b.emoji} {b.label}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Tier */}
                    <td><TierBadge tier={entry.tier} /></td>

                    {/* Score bar */}
                    <td>
                      <div className="lb-score-bar-wrap">
                        <span className="lb-score-value">{entry.totalScore}</span>
                        <div className="lb-score-bar-track">
                          <div
                            className="lb-score-bar-fill"
                            style={{ width: `${entry.totalScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Questions solved */}
                    <td className="lb-hide-mobile" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      {entry.questionsCompleted}
                    </td>

                    {/* Accuracy */}
                    <td className="lb-hide-mobile" style={{ color: entry.accuracyRate >= 80 ? '#10b981' : 'var(--text-secondary)', fontWeight: 600 }}>
                      {entry.accuracyRate}%
                    </td>

                    {/* Recent Challenges */}
                    <td className="lb-hide-mobile">
                      {entry.recentQuestions && entry.recentQuestions.length > 0 ? (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {entry.recentQuestions.slice(0, 2).map(q => (
                            <Link
                              key={q.id}
                              to={`/machine-coding?id=${q.id}`}
                              className="lb-recent-q-pill"
                              title={`${q.id}: ${q.title} (${q.score}%)`}
                            >
                              ⚡ {q.id} ({q.score}%)
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ---- Tier Legend ---- */}
      {!compact && (
        <div className="lb-table-wrap" style={{ marginTop: 32 }}>
          <div className="lb-section-title">Tier Legend</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {(['diamond', 'platinum', 'gold', 'silver', 'bronze'] as TierName[]).map(tier => {
              const thresholds: Record<TierName, string> = {
                diamond: '95–100 pts', platinum: '85–94 pts', gold: '70–84 pts', silver: '50–69 pts', bronze: '<50 pts',
              }
              return (
                <div
                  key={tier}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px',
                    background: 'var(--surface)',
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                  }}
                >
                  <TierBadge tier={tier} />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{thresholds[tier]}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
