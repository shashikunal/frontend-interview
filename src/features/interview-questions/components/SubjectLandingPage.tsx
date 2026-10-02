import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { interviewQuestionsDataService } from '../services/interviewQuestionsDataService'
import type { MasterBankCatalog, MasterQuestion, MasterSubjectId } from '../types/interviewQuestions.types'
import { SkeletonLoader } from '../../../components/common/SkeletonLoader'

interface SubjectGroup {
  subject: MasterBankCatalog['subjects'][number]
  questions: MasterQuestion[] | null
  matched: MasterQuestion[]
}

function matchesQuery(q: MasterQuestion, term: string): boolean {
  const hay = [
    q.question,
    q.concept,
    q.topic,
    q.subtopic,
    q.category,
    q.id,
    ...(q.tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return hay.includes(term)
}

function diffLabel(difficulty: string): string {
  const d = (difficulty || '').toUpperCase()
  if (d === 'EASY') return 'Easy'
  if (d === 'INTERMEDIATE' || d === 'MEDIUM') return 'Medium'
  if (d === 'DIFFICULT' || d === 'HARD') return 'Hard'
  return d ? d.charAt(0) + d.slice(1).toLowerCase() : ''
}

export default function SubjectLandingPage() {
  const [catalog, setCatalog] = useState<MasterBankCatalog | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState<string>('')
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})
  const [questionsBySubject, setQuestionsBySubject] = useState<Record<string, MasterQuestion[]>>({})
  const [searching, setSearching] = useState<boolean>(false)
  const [searchProgress, setSearchProgress] = useState<number>(0)

  const inFlight = useRef<Set<string>>(new Set())
  const questionsRef = useRef<Record<string, MasterQuestion[]>>({})
  const searchRunning = useRef(false)

  useEffect(() => {
    questionsRef.current = questionsBySubject
  }, [questionsBySubject])

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        setLoading(true)
        const cat = await interviewQuestionsDataService.getCatalog()
        if (mounted) {
          setCatalog(cat)
          setError(null)
        }
      } catch (err: any) {
        if (mounted) setError(err.message || 'Failed to load question bank')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const loadSubject = useCallback(async (subjectId: MasterSubjectId) => {
    if (questionsRef.current[subjectId] || inFlight.current.has(subjectId)) return
    inFlight.current.add(subjectId)
    try {
      const qs = await interviewQuestionsDataService.getSubjectQuestions(subjectId)
      questionsRef.current = { ...questionsRef.current, [subjectId]: qs }
      setQuestionsBySubject(questionsRef.current)
    } catch (err: any) {
      console.error(`Failed to load ${subjectId}:`, err)
    } finally {
      inFlight.current.delete(subjectId)
    }
  }, [])

  const toggleGroup = useCallback(
    (subjectId: string) => {
      setOpenGroups(prev => {
        const next = { ...prev, [subjectId]: !prev[subjectId] }
        if (next[subjectId]) void loadSubject(subjectId as MasterSubjectId)
        return next
      })
    },
    [loadSubject],
  )

  const term = query.trim().toLowerCase()

  useEffect(() => {
    if (!catalog || term.length < 2 || searchRunning.current) return
    const missing = catalog.subjects.filter(s => !questionsRef.current[s.id])
    if (missing.length === 0) return

    let cancelled = false
    searchRunning.current = true
    setSearching(true)
    setSearchProgress(0)

    ;(async () => {
      for (const s of missing) {
        if (cancelled) break
        await loadSubject(s.id)
        setSearchProgress(prev => prev + 1)
      }
      if (!cancelled) setSearching(false)
      searchRunning.current = false
    })()

    return () => {
      cancelled = true
    }
  }, [term, catalog, loadSubject])

  const groups: SubjectGroup[] = useMemo(() => {
    if (!catalog) return []
    const out: SubjectGroup[] = []
    for (const subject of catalog.subjects) {
      const list = questionsBySubject[subject.id] || null
      if (!list) {
        if (!term) out.push({ subject, questions: null, matched: [] })
        continue
      }
      const matched = term ? list.filter(q => matchesQuery(q, term)) : list
      if (term && matched.length === 0) continue
      out.push({ subject, questions: list, matched })
    }
    return out
  }, [catalog, questionsBySubject, term])

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <SkeletonLoader variant="studio" />
      </div>
    )
  }

  if (error || !catalog) {
    return (
      <div className="mqb-error-state" id="mqb-error-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ color: 'var(--mqb-tone-danger)' }}>Unable to load questions</h2>
        <p style={{ color: 'var(--mqb-text-secondary)', maxWidth: 500, margin: '0 auto 1.5rem' }}>{error}</p>
        <button type="button" className="mqb-action-pill-btn primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="mqb-plain-hub" id="master-bank-landing-page">
      <h1>Frontend Interview Questions</h1>
      <p className="mqb-plain-meta">
        {catalog.totalQuestions.toLocaleString()} questions · {catalog.subjects.length} subjects
      </p>

      <input
        type="search"
        className="mqb-plain-search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search questions (e.g. semantic HTML, closures, hooks)..."
        aria-label="Search questions"
      />

      {term.length >= 2 && searching && (
        <p className="mqb-plain-status">
          Searching… loaded {searchProgress} of {catalog.subjects.length} subjects
        </p>
      )}

      <div className="mqb-plain-groups" id="mqb-subject-groups">
        {groups.length === 0 && <p className="mqb-plain-status">No questions match “{query}”.</p>}

        {groups.map(({ subject, questions, matched }) => {
          const isOpen = term.length >= 2 || !!openGroups[subject.id]
          const visible = term ? matched : questions
          const count = term ? matched.length : (questions ? questions.length : subject.totalQuestions)

          return (
            <section key={subject.id} className="mqb-plain-group" id={`mqb-group-${subject.id}`}>
              <button
                type="button"
                className="mqb-plain-group-head"
                aria-expanded={isOpen}
                onClick={() => toggleGroup(subject.id)}
              >
                <span className="mqb-plain-group-title">{subject.name}</span>
                <span className="mqb-plain-group-count">{count} questions</span>
              </button>

              {isOpen && !visible && <p className="mqb-plain-status">Loading questions…</p>}

              {isOpen && visible && (
                <ol className="mqb-plain-list">
                  {visible.map((q, idx) => (
                    <li key={q.id}>
                      <Link to={`/interview-questions/${subject.id}/${q.id}`}>
                        {q.questionNumber ?? idx + 1}. {q.question}
                      </Link>
                      <span className="mqb-plain-diff">{diffLabel(String(q.difficulty))}</span>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
