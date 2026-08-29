import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuestions } from '../../data/useQuestions'
import { getSources } from '../../data/questionService'
import type { Question } from '../../models/question'
import { DIFFICULTIES } from '../../models/question'
import './CodingList.css'

function catClass(name: string): string {
  return `cat-${name.toLowerCase().replace(/[^a-z]+/g, '-')}`
}

const PAGE_SIZE = 24

export default function CodingList() {
  const { questions, loading, error } = useQuestions()
  const [selectedSource, setSelectedSource] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const sources = useMemo(() => getSources(questions), [questions])

  const codingQuestions = useMemo(() => {
    let list: Question[] = questions.filter(q => q.code)
    if (selectedSource) list = list.filter(q => (q.source ?? '') === selectedSource)
    if (selectedDifficulty) list = list.filter(q => q.difficulty === selectedDifficulty)
    return list
  }, [questions, selectedSource, selectedDifficulty])

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const hasMore = visibleCount < codingQuestions.length

  // Reset paging whenever the underlying list changes.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [codingQuestions.length, selectedSource, selectedDifficulty])

  // Infinite scroll: load the next page when the sentinel nears the viewport.
  // Re-observe on every visibleCount change so a fresh observe() fires again
  // if the sentinel is still in view, cascading until it leaves the viewport.
  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !hasMore) return
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setVisibleCount(c => Math.min(c + PAGE_SIZE, codingQuestions.length))
        }
      },
      { rootMargin: '400px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [codingQuestions.length, visibleCount, hasMore])

  const visible = codingQuestions.slice(0, visibleCount)

  if (loading) {
    return (
      <div className="coding-list-page">
        <div className="skeleton skeleton-line" style={{ width: '260px' }} />
        <div className="coding-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 120 }} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="error-note">Failed to load challenges: {error}</div>
  }

  return (
    <div className="coding-list-page page-enter">
      <h1>Coding Challenges</h1>
      <p className="subtitle">
        Read the snippet, predict the output, then check the explanation.
        {' '}{codingQuestions.length} challenge{codingQuestions.length !== 1 ? 's' : ''} across all categories.
      </p>

      <div className="coding-filters">
        <select
          value={selectedSource}
          onChange={e => setSelectedSource(e.target.value)}
          className="category-select"
          aria-label="Filter by source"
        >
          <option value="">All Sources</option>
          {sources.map(s => (
            <option key={s.name} value={s.name}>{s.name} ({s.count})</option>
          ))}
        </select>
        <select
          value={selectedDifficulty}
          onChange={e => setSelectedDifficulty(e.target.value)}
          className="category-select"
          aria-label="Filter by difficulty"
        >
          <option value="">All Difficulties</option>
          {DIFFICULTIES.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        {(selectedSource || selectedDifficulty) && (
          <button
            className="clear-btn"
            onClick={() => { setSelectedSource(''); setSelectedDifficulty('') }}
          >
            Clear filters
          </button>
        )}
      </div>

      {codingQuestions.length === 0 ? (
        <div className="empty-state">
          <h3>No challenges found</h3>
          <p>Try a different source or difficulty.</p>
        </div>
      ) : (
        <>
          <div className="coding-grid">
            {visible.map(q => (
              <Link key={q.id} to={`/coding/${q.id}`} className={`coding-card ${catClass(q.category)}`}>
                <div className="card-header">
                  <span className={`badge badge-category ${catClass(q.category)}`}>{q.category}</span>
                  <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                  {q.source && <span className="badge badge-source">{q.source}</span>}
                </div>
                <p className="card-question">{q.question}</p>
                <pre className="card-snippet"><code>{q.code}</code></pre>
              </Link>
            ))}
          </div>

          {hasMore ? (
            <div ref={sentinelRef} className="coding-sentinel">
              <div className="coding-spinner" aria-hidden="true" />
              <p className="coding-loading-note">Loading more challenges…</p>
            </div>
          ) : (
            <p className="coding-end-note">You&rsquo;ve reached the end — {codingQuestions.length} challenges.</p>
          )}
        </>
      )}
    </div>
  )
}
