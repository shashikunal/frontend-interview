import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../../context/ProgressContext'
import { useQuestions } from '../../data/useQuestions'
import { getSources } from '../../data/questionService'
import { DIFFICULTIES } from '../../models/question'
import type { Question } from '../../models/question'
import './Quiz.css'

const KNOWN_KEY = 'quiz-known-ids'

function catClass(name: string): string {
  return `cat-${name.toLowerCase().replace(/[^a-z]+/g, '-')}`
}

export default function Quiz() {
  const { questions, loading, error } = useQuestions()
  const { markSolved, recordQuizSession, recordActivity } = useProgress()
  const sources = useMemo(() => getSources(questions), [questions])

  const [filterSource, setFilterSource] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('')
  const [hideKnown, setHideKnown] = useState(false)
  const [knownIds, setKnownIds] = useState<Set<number>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(KNOWN_KEY) || '[]') as number[])
    } catch {
      return new Set<number>()
    }
  })

  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [stats, setStats] = useState({ seen: 0, known: 0 })

  const pool = useMemo(() => {
    let p = questions
    if (filterSource) p = p.filter(q => (q.source ?? '') === filterSource)
    if (filterDifficulty) p = p.filter(q => q.difficulty === filterDifficulty)
    if (hideKnown) p = p.filter(q => !knownIds.has(q.id))
    return p
  }, [questions, filterSource, filterDifficulty, hideKnown, knownIds])

  useEffect(() => {
    setIdx(0)
    setRevealed(false)
  }, [filterSource, filterDifficulty, hideKnown])

  const safeIdx = pool.length ? Math.min(idx, pool.length - 1) : 0
  const q: Question | undefined = pool.length ? pool[safeIdx] : undefined

  const persistKnown = (ids: Set<number>) => {
    setKnownIds(ids)
    localStorage.setItem(KNOWN_KEY, JSON.stringify([...ids]))
  }

  const next = useCallback(
    (knewIt?: boolean, markKnown?: boolean) => {
      recordActivity()
      if (markKnown && q) {
        const s = new Set(knownIds)
        s.add(q.id)
        persistKnown(s)
        markSolved(q.id)
      }
      const newSeen = stats.seen + 1
      const newKnown = stats.known + (knewIt ? 1 : 0)
      setStats({ seen: newSeen, known: newKnown })
      recordQuizSession(newKnown, newSeen, filterSource || undefined)

      setIdx(pool.length ? Math.floor(Math.random() * pool.length) : 0)
      setRevealed(false)
    },
    [pool.length, q, knownIds, stats, filterSource, markSolved, recordQuizSession, recordActivity]
  )


  if (loading) {
    return (
      <div className="quiz-page page-enter">
        <div className="skeleton" style={{ height: 220, marginBottom: 18 }} />
        <div className="skeleton" style={{ height: 120 }} />
      </div>
    )
  }

  if (error) {
    return <div className="error-note">Failed to load questions: {error}</div>
  }

  const accuracy = stats.seen > 0 ? Math.round((stats.known / stats.seen) * 100) : 0

  return (
    <div className="quiz-page page-enter">
      <div className="quiz-top">
        <h1>Practice Mode</h1>
        <div className="quiz-stats">
          <span className="quiz-stat"><strong>{stats.seen}</strong> seen</span>
          <span className="quiz-stat"><strong>{stats.known}</strong> knew</span>
          <span className="quiz-stat"><strong>{accuracy}%</strong> accuracy</span>
          <span className="quiz-stat"><strong>{knownIds.size}</strong> mastered</span>
        </div>
      </div>

      <div className="quiz-filters">
        <select
          value={filterSource}
          onChange={e => setFilterSource(e.target.value)}
          className="category-select"
          aria-label="Filter practice by source"
        >
          <option value="">All Sources</option>
          {sources.map(s => (
            <option key={s.name} value={s.name}>{s.name}</option>
          ))}
        </select>
        <select
          value={filterDifficulty}
          onChange={e => setFilterDifficulty(e.target.value)}
          className="category-select"
          aria-label="Filter practice by difficulty"
        >
          <option value="">All Difficulties</option>
          {DIFFICULTIES.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <label className="quiz-hide-known">
          <input
            type="checkbox"
            checked={hideKnown}
            onChange={e => setHideKnown(e.target.checked)}
          />
          Hide mastered
        </label>
        {(filterSource || filterDifficulty || hideKnown) && (
          <button
            className="clear-btn"
            onClick={() => { setFilterSource(''); setFilterDifficulty(''); setHideKnown(false) }}
          >
            Clear
          </button>
        )}
      </div>

      {!q ? (
        <div className="quiz-empty">
          <p>No questions match these filters{hideKnown ? ' (or you have mastered them all here 🎉)' : ''}.</p>
          <button className="btn btn-secondary" onClick={() => { setFilterSource(''); setFilterDifficulty(''); setHideKnown(false) }}>
            Reset filters
          </button>
        </div>
      ) : (
        <div className={`quiz-card ${catClass(q.category)}`}>
          <div className="card-header">
            <span className={`badge badge-category ${catClass(q.category)}`}>{q.category}</span>
            <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
            {q.source && <span className="badge badge-source">{q.source}</span>}
          </div>

          <p className="quiz-question">{q.question}</p>

          {!revealed ? (
            <button className="btn btn-primary quiz-reveal" onClick={() => setRevealed(true)}>
              Reveal Answer
            </button>
          ) : (
            <div className="quiz-answer">
              {q.answer.split(/\n{2,}/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              {q.code && (
                <pre className="quiz-code"><code>{q.code}</code></pre>
              )}
              {q.example && q.example !== q.code && (
                <pre className="quiz-code"><code>{q.example}</code></pre>
              )}

              <div className="quiz-actions">
                <button className="btn btn-secondary" onClick={() => next(true, true)}>
                  Knew it 👍
                </button>
                <button className="btn btn-secondary" onClick={() => next(false)}>
                  Still learning 🤔
                </button>
                <button className="btn btn-ghost" onClick={() => next(undefined, true)}>
                  Mark mastered
                </button>
                <button className="btn btn-ghost" onClick={() => next()}>
                  Skip →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="quiz-footer">
        <Link to="/questions" className="btn btn-ghost">Browse all questions</Link>
        {q && <button className="btn btn-ghost" onClick={() => next()}>Next question →</button>}
      </div>
    </div>
  )
}
