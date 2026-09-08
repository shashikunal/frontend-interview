import { useState, useMemo } from 'react'
import { useProgress } from '../../context/ProgressContext'
import { useBookmarks } from '../../context/BookmarkContext'
import { badgeService, type EvaluatedBadge, type BadgeCategory } from '../../lib/badgeService'
import BadgeCard from './BadgeCard'
import BadgeModal from './BadgeModal'
import './BadgeShowcase.css'

type FilterKey = 'all' | 'unlocked' | BadgeCategory

export default function BadgeShowcase() {
  const { solvedIds, streak, mockInterviews } = useProgress()
  const { bookmarkedCount } = useBookmarks()

  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')
  const [selectedBadge, setSelectedBadge] = useState<EvaluatedBadge | null>(null)

  // Derive candidate stats
  const stats = useMemo(() => {
    const solvedCount = solvedIds.size
    const strongHireCount = mockInterviews.filter(m => m.verdict === 'Strong Hire').length
    const mockCount = mockInterviews.length
    // Machine coding challenges completed: approximate from mock or test passes
    const machineCodingCount = Math.max(
      mockInterviews.reduce((acc, m) => acc + (m.testCasesPassed || 0 > 0 ? 1 : 0), 0),
      solvedCount > 0 ? 1 : 0
    )

    return {
      solvedCount,
      streakDays: streak,
      mockCount,
      strongHireCount,
      bookmarkedCount,
      machineCodingCount,
    }
  }, [solvedIds.size, streak, mockInterviews, bookmarkedCount])

  // Evaluate badges
  const evaluatedBadges = useMemo(() => {
    return badgeService.evaluateBadges(stats)
  }, [stats])

  // Calculate Level info
  const levelInfo = useMemo(() => {
    return badgeService.calculateLevelInfo(evaluatedBadges)
  }, [evaluatedBadges])

  // Filter badges
  const filteredBadges = useMemo(() => {
    if (activeFilter === 'all') return evaluatedBadges
    if (activeFilter === 'unlocked') return evaluatedBadges.filter(b => b.unlocked)
    return evaluatedBadges.filter(b => b.category === activeFilter)
  }, [evaluatedBadges, activeFilter])

  const unlockedCount = useMemo(() => {
    return evaluatedBadges.filter(b => b.unlocked).length
  }, [evaluatedBadges])

  return (
    <div className="badge-showcase">
      {/* Level & XP Banner */}
      <div className="bs-level-banner">
        <div className="bs-level-left">
          <div className="bs-level-badge">
            <span className="bs-lvl-num">L{levelInfo.level}</span>
            <span className="bs-lvl-tag">LEVEL</span>
          </div>
          <div className="bs-level-meta">
            <h3 className="bs-level-title">{levelInfo.title}</h3>
            <p className="bs-level-subtitle">
              {unlockedCount} of {evaluatedBadges.length} achievements unlocked · {levelInfo.currentXp} XP earned
            </p>
          </div>
        </div>

        <div className="bs-level-right">
          <div className="bs-xp-meta">
            <span className="bs-xp-current">+{levelInfo.currentXp} XP Total</span>
            <span className="bs-xp-ratio">
              Next Rank: {levelInfo.xpForNextLevel} XP
            </span>
          </div>
          <div className="bs-xp-track">
            <div className="bs-xp-fill" style={{ width: `${levelInfo.progressPercent}%` }} />
          </div>
          <span className="bs-badges-ratio-tag">
            {levelInfo.progressPercent}% progress to Level {levelInfo.level + 1}
          </span>
        </div>
      </div>

      {/* Filter Navigation */}
      <div className="bs-filter-bar" role="tablist" aria-label="Achievement category filters">
        <button
          type="button"
          className={`bs-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All ({evaluatedBadges.length})
        </button>
        <button
          type="button"
          className={`bs-filter-btn ${activeFilter === 'unlocked' ? 'active' : ''}`}
          onClick={() => setActiveFilter('unlocked')}
        >
          ✨ Unlocked ({unlockedCount})
        </button>
        <button
          type="button"
          className={`bs-filter-btn ${activeFilter === 'starter' ? 'active' : ''}`}
          onClick={() => setActiveFilter('starter')}
        >
          🐣 Starter
        </button>
        <button
          type="button"
          className={`bs-filter-btn ${activeFilter === 'streak' ? 'active' : ''}`}
          onClick={() => setActiveFilter('streak')}
        >
          🔥 Streaks
        </button>
        <button
          type="button"
          className={`bs-filter-btn ${activeFilter === 'machine_coding' ? 'active' : ''}`}
          onClick={() => setActiveFilter('machine_coding')}
        >
          ⚡ Machine Coding
        </button>
        <button
          type="button"
          className={`bs-filter-btn ${activeFilter === 'mock_interview' ? 'active' : ''}`}
          onClick={() => setActiveFilter('mock_interview')}
        >
          🎙️ Mocks
        </button>
        <button
          type="button"
          className={`bs-filter-btn ${activeFilter === 'mastery' ? 'active' : ''}`}
          onClick={() => setActiveFilter('mastery')}
        >
          🏆 Mastery
        </button>
      </div>

      {/* Badges Grid */}
      {filteredBadges.length > 0 ? (
        <div className="bs-grid">
          {filteredBadges.map(badge => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              onClick={(b) => setSelectedBadge(b)}
            />
          ))}
        </div>
      ) : (
        <div className="bs-empty">
          <p>No achievements match this filter.</p>
        </div>
      )}

      {/* Badge Inspection Modal */}
      <BadgeModal
        badge={selectedBadge}
        onClose={() => setSelectedBadge(null)}
      />
    </div>
  )
}
