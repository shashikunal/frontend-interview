// src/components/frontendjs/components/FrontendJsLeaderboardModal.tsx
import { useState, useEffect } from 'react'
import {
  frontendJsLeaderboardService,
  type FrontendJsLeaderboardEntry,
} from '../lib/frontendJsLeaderboardService'

interface Props {
  onClose: () => void
}

const TIER_EMOJI: Record<string, string> = {
  diamond: '💎',
  platinum: '🔮',
  gold: '🥇',
  silver: '🥈',
  bronze: '🥉',
}

export function FrontendJsLeaderboardModal({ onClose }: Props) {
  const [entries, setEntries] = useState<FrontendJsLeaderboardEntry[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    frontendJsLeaderboardService.getLeaderboard().then(data => {
      setEntries(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="fjs-modal-overlay" onClick={onClose}>
      <div className="fjs-modal-card" onClick={e => e.stopPropagation()}>
        <div className="fjs-modal-header">
          <div>
            <span className="fjs-im-pill">🏆 GLOBAL RANKINGS</span>
            <h2>Frontend JavaScript Leaderboard</h2>
          </div>
          <button type="button" className="fjs-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="fjs-admin-body">
          {loading ? (
            <div className="fjs-executing-indicator">
              <div className="fjs-spinner" />
              <span>Fetching live rankings from Supabase...</span>
            </div>
          ) : entries.length === 0 ? (
            <div className="fjs-empty-results">
              <p>No verified candidate completions recorded yet. Solve your first question to establish your ranking!</p>
            </div>
          ) : (
            <table className="fjs-admin-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Candidate</th>
                  <th>Tier</th>
                  <th>Score</th>
                  <th>Solved</th>
                  <th>Accuracy</th>
                  <th>Avg Time</th>
                  <th>Streak</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(e => (
                  <tr key={e.userId}>
                    <td><strong>#{e.rank}</strong></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: e.avatarColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: 'bold',
                          }}
                        >
                          {e.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span>{e.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`fjs-health-tag ${e.tier}`}>
                        {TIER_EMOJI[e.tier] || '🥉'} {e.tier.toUpperCase()}
                      </span>
                    </td>
                    <td><strong>{e.totalScore} pts</strong></td>
                    <td>{e.solvedCount}</td>
                    <td>{e.accuracyRate}%</td>
                    <td>{e.avgTimeMinutes}m</td>
                    <td>🔥 {e.streak}d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
