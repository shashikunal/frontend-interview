import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DSA_QUESTIONS, DSA_ROADMAPS } from './data/dsaQuestions'
import type { DSAQuestion } from './data/dsaTypes'
import { dsaProgressService } from './lib/dsaProgressService'
import { DSAInterviewMode } from './components/DSAInterviewMode'
import { DSAHeatmap } from './components/DSAHeatmap'

export interface DSADashboardProps {
  initialFilter?: 'All' | 'Solved' | 'Unsolved' | 'Attempted' | 'Bookmarked' | 'Revisit'
  initialFocusProgress?: boolean
}

export const DSADashboard: React.FC<DSADashboardProps> = ({
  initialFilter = 'All',
}) => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All')
  const [selectedTopic, setSelectedTopic] = useState<string>('All')
  const [selectedPattern, setSelectedPattern] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Solved' | 'Unsolved' | 'Attempted' | 'Bookmarked' | 'Revisit'>(initialFilter)
  const [sortBy, setSortBy] = useState<'number' | 'difficulty' | 'topic' | 'recently-attempted' | 'recently-solved'>('number')
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 25

  const solvedSet = useMemo(() => dsaProgressService.getSolvedIds(), [])
  const attemptedSet = useMemo(() => dsaProgressService.getAttemptedIds(), [])
  const bookmarkedSet = useMemo(() => dsaProgressService.getBookmarkedIds(), [])
  const revisitSet = useMemo(() => dsaProgressService.getRevisitIds(), [])
  const streakInfo = useMemo(() => dsaProgressService.getStreak(), [])
  const submissions = useMemo(() => dsaProgressService.getSubmissions(), [])

  // Difficulty counts
  const totalCount = DSA_QUESTIONS.length
  const solvedTotal = solvedSet.size
  const attemptedTotal = attemptedSet.size
  const remainingTotal = Math.max(0, totalCount - solvedTotal)

  const easyQuestions = useMemo(() => DSA_QUESTIONS.filter(q => q.difficulty === 'Easy'), [])
  const mediumQuestions = useMemo(() => DSA_QUESTIONS.filter(q => q.difficulty === 'Medium'), [])
  const hardQuestions = useMemo(() => DSA_QUESTIONS.filter(q => q.difficulty === 'Difficult'), [])

  const easySolved = easyQuestions.filter(q => solvedSet.has(q.id)).length
  const mediumSolved = mediumQuestions.filter(q => solvedSet.has(q.id)).length
  const hardSolved = hardQuestions.filter(q => solvedSet.has(q.id)).length

  // Unique topics and patterns
  const allTopics = useMemo(() => Array.from(new Set(DSA_QUESTIONS.map(q => q.topic))), [])
  const allPatterns = useMemo(() => Array.from(new Set(DSA_QUESTIONS.flatMap(q => q.pattern))), [])

  // Daily Question deterministically picked for today
  const dailyQuestion = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    let hash = 0
    for (let i = 0; i < today.length; i++) {
      hash = (hash * 31 + today.charCodeAt(i)) >>> 0
    }
    const idx = hash % Math.min(15, DSA_QUESTIONS.length)
    return DSA_QUESTIONS[idx] || DSA_QUESTIONS[0]
  }, [])

  // Topic mastery list
  const topicStats = useMemo(() => {
    const map = new Map<string, { total: number; solved: number }>()
    DSA_QUESTIONS.forEach(q => {
      const cur = map.get(q.topic) || { total: 0, solved: 0 }
      cur.total++
      if (solvedSet.has(q.id)) cur.solved++
      map.set(q.topic, cur)
    })
    return Array.from(map.entries()).map(([topic, stat]) => ({
      topic,
      total: stat.total,
      solved: stat.solved,
      pct: Math.round((stat.solved / stat.total) * 100),
    }))
  }, [solvedSet])

  // Filtered and Sorted questions
  const filtered = useMemo(() => {
    const list = DSA_QUESTIONS.filter(q => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        const matchesTitle = q.title.toLowerCase().includes(term)
        const matchesTopic = q.topic.toLowerCase().includes(term)
        const matchesNum = String(q.number) === term || q.id.toLowerCase().includes(term)
        const matchesTag = q.tags.some(t => t.toLowerCase().includes(term))
        const matchesPattern = q.pattern.some(p => p.toLowerCase().includes(term))
        if (!matchesTitle && !matchesTopic && !matchesNum && !matchesTag && !matchesPattern) return false
      }
      if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) return false
      if (selectedTopic !== 'All' && q.topic !== selectedTopic) return false
      if (selectedPattern !== 'All' && !q.pattern.includes(selectedPattern)) return false
      if (statusFilter === 'Solved' && !solvedSet.has(q.id)) return false
      if (statusFilter === 'Unsolved' && solvedSet.has(q.id)) return false
      if (statusFilter === 'Attempted' && !attemptedSet.has(q.id)) return false
      if (statusFilter === 'Bookmarked' && !bookmarkedSet.has(q.id)) return false
      if (statusFilter === 'Revisit' && !revisitSet.has(q.id)) return false
      return true
    })

    const diffOrder: Record<string, number> = { Easy: 1, Medium: 2, Difficult: 3 }
    list.sort((a, b) => {
      if (sortBy === 'difficulty') {
        return (diffOrder[a.difficulty] || 0) - (diffOrder[b.difficulty] || 0)
      }
      if (sortBy === 'topic') {
        return a.topic.localeCompare(b.topic)
      }
      if (sortBy === 'recently-attempted') {
        const aAtt = attemptedSet.has(a.id) ? 1 : 0
        const bAtt = attemptedSet.has(b.id) ? 1 : 0
        if (aAtt !== bAtt) return bAtt - aAtt
      }
      if (sortBy === 'recently-solved') {
        const aSol = solvedSet.has(a.id) ? 1 : 0
        const bSol = solvedSet.has(b.id) ? 1 : 0
        if (aSol !== bSol) return bSol - aSol
      }
      return a.number - b.number
    })

    return list
  }, [searchTerm, selectedDifficulty, selectedTopic, selectedPattern, statusFilter, sortBy, solvedSet, attemptedSet, bookmarkedSet, revisitSet])

  const totalPages = Math.ceil(filtered.length / pageSize) || 1
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, currentPage])

  const handleOpenQuestion = (qId: string) => {
    navigate(`/dsa?id=${qId}`)
  }

  const handleStartInterview = (selected: DSAQuestion[]) => {
    setIsInterviewModalOpen(false)
    if (selected.length > 0) {
      navigate(`/dsa?id=${selected[0].id}`)
    }
  }

  return (
    <div className="dsa-dashboard-container">
      {/* Hero Header */}
      <div className="dsa-dash-hero">
        <span className="dsa-dash-badge">⚡ DSA Masterclass</span>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="dsa-dash-title">Data Structures & Algorithms Studio</h1>
            <p className="dsa-dash-subtitle">
              Master algorithmic problem solving with curated FAANG patterns and genuine test suites.
            </p>
          </div>
          <button
            className="dsa-btn-submit"
            onClick={() => setIsInterviewModalOpen(true)}
            style={{ padding: '10px 20px', fontSize: '14px' }}
          >
            ⏱️ Start Mock Interview Mode
          </button>
        </div>
      </div>

      {/* Stats Cards Grid (Solved, Attempted, Remaining, Easy, Medium, Difficult) */}
      <div className="dsa-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        {/* Solved */}
        <div className="dsa-stat-card brand">
          <div className="dsa-stat-header">
            <span className="dsa-stat-label">Solved</span>
            <span className="dsa-stat-icon">🏆</span>
          </div>
          <div className="dsa-stat-val">
            {solvedTotal} <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>/ {totalCount}</span>
          </div>
          <div className="dsa-stat-bar-track">
            <div
              className="dsa-stat-bar-fill brand"
              style={{ width: `${Math.max(1, (solvedTotal / totalCount) * 100)}%` }}
            />
          </div>
          <span className="dsa-stat-sub">{((solvedTotal / (totalCount || 1)) * 100).toFixed(1)}% Completed</span>
        </div>

        {/* Attempted */}
        <div className="dsa-stat-card medium">
          <div className="dsa-stat-header">
            <span className="dsa-stat-label">Attempted</span>
            <span className="dsa-stat-icon">◐</span>
          </div>
          <div className="dsa-stat-val">
            {attemptedTotal} <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>/ {totalCount}</span>
          </div>
          <div className="dsa-stat-bar-track">
            <div
              className="dsa-stat-bar-fill medium"
              style={{ width: `${Math.max(1, (attemptedTotal / totalCount) * 100)}%` }}
            />
          </div>
          <span className="dsa-stat-sub">In Progress</span>
        </div>

        {/* Remaining */}
        <div className="dsa-stat-card" style={{ background: 'var(--surface)' }}>
          <div className="dsa-stat-header">
            <span className="dsa-stat-label">Remaining</span>
            <span className="dsa-stat-icon">○</span>
          </div>
          <div className="dsa-stat-val">
            {remainingTotal}
          </div>
          <div className="dsa-stat-bar-track">
            <div
              className="dsa-stat-bar-fill"
              style={{ width: `${Math.max(1, (remainingTotal / totalCount) * 100)}%`, background: '#64748b' }}
            />
          </div>
          <span className="dsa-stat-sub">Unsolved problems</span>
        </div>

        {/* Easy Solved */}
        <div className="dsa-stat-card easy">
          <div className="dsa-stat-header">
            <span className="dsa-stat-label">Easy</span>
            <span className="dsa-stat-icon">🟢</span>
          </div>
          <div className="dsa-stat-val">
            {easySolved} <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>/ {easyQuestions.length}</span>
          </div>
          <div className="dsa-stat-bar-track">
            <div
              className="dsa-stat-bar-fill easy"
              style={{ width: `${Math.max(1, (easySolved / (easyQuestions.length || 1)) * 100)}%` }}
            />
          </div>
          <span className="dsa-stat-sub">{((easySolved / (easyQuestions.length || 1)) * 100).toFixed(1)}% Solved</span>
        </div>

        {/* Medium Solved */}
        <div className="dsa-stat-card medium">
          <div className="dsa-stat-header">
            <span className="dsa-stat-label">Medium</span>
            <span className="dsa-stat-icon">🟡</span>
          </div>
          <div className="dsa-stat-val">
            {mediumSolved} <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>/ {mediumQuestions.length}</span>
          </div>
          <div className="dsa-stat-bar-track">
            <div
              className="dsa-stat-bar-fill medium"
              style={{ width: `${Math.max(1, (mediumSolved / (mediumQuestions.length || 1)) * 100)}%` }}
            />
          </div>
          <span className="dsa-stat-sub">{((mediumSolved / (mediumQuestions.length || 1)) * 100).toFixed(1)}% Solved</span>
        </div>

        {/* Difficult Solved */}
        <div className="dsa-stat-card hard">
          <div className="dsa-stat-header">
            <span className="dsa-stat-label">Difficult</span>
            <span className="dsa-stat-icon">🔴</span>
          </div>
          <div className="dsa-stat-val">
            {hardSolved} <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>/ {hardQuestions.length}</span>
          </div>
          <div className="dsa-stat-bar-track">
            <div
              className="dsa-stat-bar-fill hard"
              style={{ width: `${Math.max(1, (hardSolved / (hardQuestions.length || 1)) * 100)}%` }}
            />
          </div>
          <span className="dsa-stat-sub">{((hardSolved / (hardQuestions.length || 1)) * 100).toFixed(1)}% Solved</span>
        </div>
      </div>

      {/* Daily Challenge Banner */}
      {dailyQuestion && (
        <div className="dsa-daily-banner">
          <div className="dsa-daily-left">
            <span className="dsa-daily-tag">🔥 Today's Daily Challenge</span>
            <h3 className="dsa-daily-title">
              {dailyQuestion.number}. {dailyQuestion.title}
            </h3>
            <span className="dsa-daily-meta">
              Difficulty: <strong>{dailyQuestion.difficulty}</strong> • Topic: {dailyQuestion.topic} • Streak: {streakInfo.currentStreak} Days
            </span>
          </div>
          <button
            className="dsa-daily-btn"
            onClick={() => handleOpenQuestion(dailyQuestion.id)}
          >
            Solve Today's Problem →
          </button>
        </div>
      )}

      {/* LeetCode Style Submission Heatmap */}
      <DSAHeatmap submissions={submissions} />

      {/* Curated Roadmaps */}
      <h2 className="dsa-section-title">🗺️ Structured Learning Roadmaps</h2>
      <div className="dsa-roadmaps-grid">
        {DSA_ROADMAPS.map(rm => {
          const solvedInRm = rm.questionIds.filter(id => solvedSet.has(id)).length
          const totalInRm = rm.questionIds.length
          return (
            <div
              key={rm.id}
              className="dsa-roadmap-card"
              onClick={() => handleOpenQuestion(rm.questionIds[0])}
            >
              <span className="dsa-roadmap-badge">{rm.badge}</span>
              <h3 className="dsa-roadmap-title">{rm.title}</h3>
              <p className="dsa-roadmap-desc">{rm.description}</p>
              <div className="dsa-roadmap-footer">
                <span>{solvedInRm} / {totalInRm} Completed</span>
                <span>Launch Roadmap →</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Topic Mastery Grid */}
      <h2 className="dsa-section-title">🧠 Topic Mastery Progress</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 12,
          marginBottom: 36,
        }}
      >
        {topicStats.slice(0, 12).map(t => (
          <div
            key={t.topic}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '12px 14px',
              cursor: 'pointer',
            }}
            onClick={() => {
              setSelectedTopic(t.topic)
              window.scrollTo({ top: 900, behavior: 'smooth' })
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              <span>{t.topic}</span>
              <span style={{ color: 'var(--text-muted)' }}>{t.solved}/{t.total}</span>
            </div>
            <div style={{ height: 4, background: 'var(--bg)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.max(2, t.pct)}%`, background: 'var(--accent)' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Question Table Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <h2 className="dsa-section-title" style={{ margin: 0 }}>
          All Problems ({filtered.length})
        </h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search problems..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '6px 12px',
              color: 'var(--text-primary)',
              fontSize: 13,
              outline: 'none',
              width: 220,
            }}
          />
          <select
            value={selectedDifficulty}
            onChange={e => {
              setSelectedDifficulty(e.target.value)
              setCurrentPage(1)
            }}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '6px 10px',
              color: 'var(--text-primary)',
              fontSize: 13,
            }}
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Difficult">Difficult</option>
          </select>
          <select
            value={selectedTopic}
            onChange={e => {
              setSelectedTopic(e.target.value)
              setCurrentPage(1)
            }}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '6px 10px',
              color: 'var(--text-primary)',
              fontSize: 13,
            }}
          >
            <option value="All">All Topics</option>
            {allTopics.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            value={selectedPattern}
            onChange={e => {
              setSelectedPattern(e.target.value)
              setCurrentPage(1)
            }}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '6px 10px',
              color: 'var(--text-primary)',
              fontSize: 13,
            }}
          >
            <option value="All">All Patterns</option>
            {allPatterns.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value as any)
              setCurrentPage(1)
            }}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '6px 10px',
              color: 'var(--text-primary)',
              fontSize: 13,
            }}
          >
            <option value="All">All Status</option>
            <option value="Solved">✓ Solved</option>
            <option value="Unsolved">○ Unsolved</option>
            <option value="Attempted">◐ Attempted</option>
            <option value="Bookmarked">★ Bookmarked</option>
            <option value="Revisit">⚑ Revisit</option>
          </select>
          <select
            value={sortBy}
            onChange={e => {
              setSortBy(e.target.value as any)
              setCurrentPage(1)
            }}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '6px 10px',
              color: 'var(--text-primary)',
              fontSize: 13,
            }}
          >
            <option value="number">Sort: # Number</option>
            <option value="difficulty">Sort: Difficulty</option>
            <option value="topic">Sort: Topic</option>
            <option value="recently-attempted">Sort: Attempted First</option>
            <option value="recently-solved">Sort: Solved First</option>
          </select>
        </div>
      </div>

      {/* Questions Table */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: 20,
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px 16px', width: 60 }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Title</th>
              <th style={{ padding: '12px 16px', width: 120 }}>Difficulty</th>
              <th style={{ padding: '12px 16px', width: 140 }}>Topic</th>
              <th style={{ padding: '12px 16px', width: 140 }}>Pattern</th>
              <th style={{ padding: '12px 16px', width: 100, textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(q => {
              const isSolved = solvedSet.has(q.id)
              const isAttempted = attemptedSet.has(q.id)
              const isBookmarked = bookmarkedSet.has(q.id)
              const isRevisit = revisitSet.has(q.id)

              return (
                <tr
                  key={q.id}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => handleOpenQuestion(q.id)}
                >
                  <td style={{ padding: '12px 16px' }}>
                    {isSolved ? (
                      <span style={{ color: '#34d399', fontWeight: 700 }} title="Solved">✓</span>
                    ) : isRevisit ? (
                      <span style={{ color: '#f87171' }} title="Marked to Revisit">⚑</span>
                    ) : isAttempted ? (
                      <span style={{ color: '#fbbf24' }} title="Attempted">◐</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }} title="Not Started">○</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {q.number}. {q.title} {isBookmarked && <span style={{ color: '#fbbf24' }}>★</span>}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`dsa-diff-pill ${q.difficulty.toLowerCase()}`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                    {q.topic}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: 12 }}>
                    {q.pattern[0] || '—'}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button
                      className="dsa-nav-btn"
                      style={{ padding: '4px 10px', fontSize: 12 }}
                      onClick={e => {
                        e.stopPropagation()
                        handleOpenQuestion(q.id)
                      }}
                    >
                      Solve
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <button
            className="dsa-nav-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            ← Previous
          </button>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            className="dsa-nav-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            Next →
          </button>
        </div>
      )}

      {/* Mock Interview Modal */}
      {isInterviewModalOpen && (
        <DSAInterviewMode
          questions={DSA_QUESTIONS}
          onStartSession={handleStartInterview}
          onClose={() => setIsInterviewModalOpen(false)}
        />
      )}
    </div>
  )
}
