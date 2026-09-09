import React, { useState, useMemo } from 'react'
import type { DSAQuestion } from '../data/dsaTypes'
import { dsaProgressService } from '../lib/dsaProgressService'

interface Props {
  questions: DSAQuestion[]
  currentId: string
  onSelect: (id: string) => void
  onClose?: () => void
}

export const DSAQuestionList: React.FC<Props> = ({
  questions,
  currentId,
  onSelect,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All')
  const [selectedTopic, setSelectedTopic] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Solved' | 'Attempted' | 'Bookmarked'>('All')
  const [displayLimit, setDisplayLimit] = useState<number>(100)

  const solvedSet = useMemo(() => dsaProgressService.getSolvedIds(), [])
  const attemptedSet = useMemo(() => dsaProgressService.getAttemptedIds(), [])
  const bookmarkedSet = useMemo(() => dsaProgressService.getBookmarkedIds(), [])

  // Unique topics
  const topics = useMemo(() => {
    const set = new Set<string>()
    questions.forEach(q => set.add(q.topic))
    return ['All', ...Array.from(set).sort()]
  }, [questions])

  const filtered = useMemo(() => {
    return questions.filter(q => {
      // Search
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        const matchesTitle = q.title.toLowerCase().includes(term)
        const matchesTopic = q.topic.toLowerCase().includes(term)
        const matchesNum = String(q.number) === term || q.id.toLowerCase().includes(term)
        const matchesTag = q.tags.some(t => t.toLowerCase().includes(term))
        if (!matchesTitle && !matchesTopic && !matchesNum && !matchesTag) return false
      }

      // Difficulty
      if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) {
        return false
      }

      // Topic
      if (selectedTopic !== 'All' && q.topic !== selectedTopic) {
        return false
      }

      // Status
      if (statusFilter === 'Solved' && !solvedSet.has(q.id)) return false
      if (statusFilter === 'Attempted' && !attemptedSet.has(q.id)) return false
      if (statusFilter === 'Bookmarked' && !bookmarkedSet.has(q.id)) return false

      return true
    })
  }, [questions, searchTerm, selectedDifficulty, selectedTopic, statusFilter, solvedSet, attemptedSet, bookmarkedSet])

  return (
    <div className="dsa-qlist-container">
      <div className="dsa-qlist-header">
        <div className="dsa-qlist-title-row">
          <h3>Problems ({filtered.length})</h3>
          {onClose && (
            <button className="dsa-icon-btn" onClick={onClose} title="Close list">
              ✕
            </button>
          )}
        </div>

        <div className="dsa-qlist-search-box">
          <span className="dsa-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search problems by name, tag, or #..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value)
              setDisplayLimit(100)
            }}
            className="dsa-search-input"
          />
          {searchTerm && (
            <button className="dsa-clear-search" onClick={() => { setSearchTerm(''); setDisplayLimit(100); }}>✕</button>
          )}
        </div>

        <div className="dsa-qlist-filters">
          {/* Status Pills */}
          <div className="dsa-filter-pills">
            {(['All', 'Solved', 'Attempted', 'Bookmarked'] as const).map(st => (
              <button
                key={st}
                className={`dsa-pill-btn ${statusFilter === st ? 'active' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                {st === 'Solved' && '✓ '}
                {st === 'Bookmarked' && '★ '}
                {st}
              </button>
            ))}
          </div>

          {/* Difficulty & Topic Selectors */}
          <div className="dsa-filter-dropdowns">
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="dsa-select"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Difficult">Hard / Difficult</option>
            </select>

            <select
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
              className="dsa-select"
            >
              {topics.map(t => (
                <option key={t} value={t}>{t === 'All' ? 'All Topics' : t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="dsa-qlist-body">
        {filtered.length === 0 ? (
          <div className="dsa-qlist-empty">
            <p>No questions match your filter criteria.</p>
            <button
              className="dsa-reset-btn"
              onClick={() => {
                setSearchTerm('')
                setSelectedDifficulty('All')
                setSelectedTopic('All')
                setStatusFilter('All')
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {filtered.slice(0, displayLimit).map(q => {
            const isSolved = solvedSet.has(q.id)
            const isAttempted = attemptedSet.has(q.id)
            const isBookmarked = bookmarkedSet.has(q.id)
            const isCurrent = q.id === currentId

            return (
              <div
                key={q.id}
                className={`dsa-qitem ${isCurrent ? 'selected' : ''}`}
                onClick={() => onSelect(q.id)}
              >
                <div className="dsa-qitem-status">
                  {isSolved ? (
                    <span className="dsa-badge-solved" title="Solved">✓</span>
                  ) : isAttempted ? (
                    <span className="dsa-badge-attempted" title="Attempted">●</span>
                  ) : (
                    <span className="dsa-badge-unsolved">○</span>
                  )}
                </div>

                <div className="dsa-qitem-content">
                  <div className="dsa-qitem-title">
                    <span className="dsa-qitem-num">{q.number}.</span> {q.title}
                  </div>
                  <div className="dsa-qitem-meta">
                    <span className={`dsa-diff-tag ${q.difficulty.toLowerCase()}`}>
                      {q.difficulty}
                    </span>
                    <span className="dsa-topic-tag">{q.topic}</span>
                    {q.pattern[0] && (
                      <span className="dsa-pattern-tag">{q.pattern[0]}</span>
                    )}
                  </div>
                </div>

                <div className="dsa-qitem-actions">
                  {isBookmarked && <span className="dsa-qitem-star">★</span>}
                </div>
              </div>
            )
          })}
          {filtered.length > displayLimit && (
            <div style={{ padding: '12px', textAlign: 'center' }}>
              <button
                className="dsa-nav-btn"
                style={{ width: '100%', padding: '8px', fontSize: '12px' }}
                onClick={() => setDisplayLimit(l => l + 100)}
              >
                Load more ({filtered.length - displayLimit} remaining)
              </button>
            </div>
          )}
        </>
        )}
      </div>
    </div>
  )
}
