import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { usePlacement } from '../hooks/usePlacement'
import {
  buildWeaknessPracticeSet,
  getVerifiedQuestions,
  pickQuestions,
} from '../data/questions'
import type { PlacementCategory, PlacementQuestionRecord } from '../types/placement.types'

const CATEGORY_LABELS: Record<PlacementCategory, string> = {
  aptitude: 'Aptitude',
  reasoning: 'Reasoning',
  verbal: 'Verbal',
  technical_mcq: 'Technical MCQ',
  dsa: 'DSA',
  programming: 'Programming',
  frontend: 'Frontend',
  sql: 'SQL',
  cs_fundamentals: 'CS Fundamentals',
  machine_coding: 'Machine Coding',
  project: 'Project',
  communication: 'Communication',
}

const SUBJECT_FILTERS = [
  { key: 'all', label: 'All Subjects' },
  { key: 'react', label: 'ReactJS' },
  { key: 'typescript', label: 'TypeScript' },
  { key: 'javascript', label: 'JavaScript' },
  { key: 'html', label: 'HTML' },
  { key: 'css', label: 'CSS' },
  { key: 'es6', label: 'ES6' },
  { key: 'redux', label: 'Redux' },
  { key: 'jquery', label: 'jQuery' },
] as const

type SubjectFilter = (typeof SUBJECT_FILTERS)[number]['key']

export default function PlacementPractice() {
  const { user } = useAuth()
  const { recordAttempt, weakTopics, refresh } = usePlacement(user?.id)

  const [category, setCategory] = useState<PlacementCategory | 'all' | 'weakness'>('all')
  const [subject, setSubject] = useState<SubjectFilter>('all')
  const [limit, setLimit] = useState(5)
  const [queue, setQueue] = useState<PlacementQuestionRecord[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [graded, setGraded] = useState<{ correct: boolean; correctAnswer: string } | null>(null)
  const [selfNote, setSelfNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 })

  const bankSize = useMemo(() => getVerifiedQuestions().length, [])

  const buildQueue = useMemo(() => {
    return () => {
      const weakSubcategories = weakTopics.map((w) => w.subcategory)
      let questions =
        category === 'weakness'
          ? buildWeaknessPracticeSet(weakSubcategories, limit)
          : category === 'all'
            ? pickQuestions({ limit, seed: Date.now() % 100000 })
            : pickQuestions({ categories: [category], limit, seed: Date.now() % 100000 })
      if (subject !== 'all') {
        questions = questions.filter(
          (q) =>
            q.subcategory.toLowerCase().includes(subject) ||
            q.topic.toLowerCase().includes(subject) ||
            q.tags.some((t) => t.toLowerCase().includes(subject))
        )
      }
      setQueue(questions)
      setIndex(0)
      setSelected(null)
      setGraded(null)
      setSelfNote('')
    }
  }, [category, subject, limit, weakTopics])

  useEffect(() => {
    buildQueue()
  }, [buildQueue])

  const question = queue[index]

  const grade = async () => {
    if (!question || !selected) return
    const correct = selected === question.correctAnswer
    setGraded({ correct, correctAnswer: question.correctAnswer })
    setSessionStats((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
    setSaving(true)
    await recordAttempt({
      questionId: question.id,
      dayId: null,
      category: question.category,
      subcategory: question.subcategory,
      mode: 'practice',
      selectedAnswer: selected,
      isCorrect: correct,
      score: correct ? question.points : 0,
      maxScore: question.points,
      timeSpentSeconds: 0,
      attemptsCount: 1,
      hintsUsed: 0,
      resultStatus: correct ? 'passed' : 'failed',
    })
    setSaving(false)
    void refresh()
  }

  const gradeSubjective = async () => {
    if (!question) return
    setSaving(true)
    await recordAttempt({
      questionId: question.id,
      dayId: null,
      category: question.category,
      subcategory: question.subcategory,
      mode: 'practice',
      selectedAnswer: selfNote.slice(0, 2000),
      isCorrect: true,
      score: question.points,
      maxScore: question.points,
      timeSpentSeconds: 0,
      attemptsCount: 1,
      hintsUsed: 0,
      resultStatus: 'submitted',
    })
    setGraded({ correct: true, correctAnswer: question.correctAnswer })
    setSaving(false)
    void refresh()
  }

  const next = () => {
    setSelected(null)
    setGraded(null)
    setSelfNote('')
    setIndex((i) => Math.min(i + 1, queue.length))
  }

  return (
    <div>
      <div className="placement-card" style={{ marginBottom: 18 }}>
        <h2>Practice</h2>
        <p>
          {bankSize} verified questions across aptitude, reasoning, verbal, technical MCQ and
          interview topics. Only verified questions appear here — questions marked for review are
          held back until an administrator corrects them.
        </p>
        <div className="placement-form" style={{ marginTop: 12 }}>
          <div className="placement-form-row">
            <label>
              Category
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PlacementCategory | 'all' | 'weakness')}
              >
                <option value="all">Mixed (all categories)</option>
                <option value="weakness">My weak topics</option>
                {(Object.keys(CATEGORY_LABELS) as PlacementCategory[])
                  .filter((key) => key !== 'dsa' && key !== 'machine_coding' && key !== 'project')
                  .map((key) => (
                    <option key={key} value={key}>
                      {CATEGORY_LABELS[key]}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              Subject
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectFilter)}
              >
                {SUBJECT_FILTERS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Questions per set
              <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <label>
              &nbsp;
              <button type="button" className="btn btn-primary" onClick={buildQueue}>
                New set
              </button>
            </label>
          </div>
        </div>
        {category === 'weakness' && !weakTopics.length && (
          <p className="placement-inline-note">
            No weak topics recorded yet. Complete practice in a few categories first — weakness
            detection needs at least 3 attempts per topic.
          </p>
        )}
      </div>

      {question ? (
        <div className="placement-question">
          <div className="placement-actions" style={{ marginTop: 0, marginBottom: 12 }}>
            <span className="placement-badge info">
              {CATEGORY_LABELS[question.category] ?? question.category}
            </span>
            <span className="placement-badge">{question.subcategory}</span>
            <span
              className={`placement-badge ${
                question.difficulty === 'easy' ? 'good' : question.difficulty === 'hard' ? 'bad' : 'warn'
              }`}
            >
              {question.difficulty}
            </span>
            <span className="placement-badge">{question.questionType}</span>
            <span className="placement-badge">
              {index + 1} / {queue.length}
            </span>
          </div>

          {sessionStats.total > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div className="placement-progress-track">
                <div
                  className="placement-progress-fill"
                  style={{ width: `${(sessionStats.correct / sessionStats.total) * 100}%` }}
                />
              </div>
              <p className="placement-inline-note">
                Session: {sessionStats.correct}/{sessionStats.total} correct ({Math.round((sessionStats.correct / sessionStats.total) * 100)}%)
              </p>
            </div>
          )}

          <p className="prompt">{question.prompt}</p>
          {question.codeSnippet ? <pre>{question.codeSnippet}</pre> : null}

          {(question.options || []).length > 0 ? (
            <div className="placement-options" role="radiogroup" aria-label="Answer options">
              {question.options.map((option) => {
                const isSelected = selected === option.key
                const isCorrect = graded?.correctAnswer === option.key
                const stateClass = graded
                  ? isCorrect
                    ? 'correct'
                    : isSelected
                      ? 'incorrect'
                      : ''
                  : isSelected
                    ? 'selected'
                    : ''
                return (
                  <button
                    key={option.key}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`placement-option ${stateClass}`}
                    disabled={Boolean(graded)}
                    onClick={() => setSelected(option.key)}
                  >
                    <span className="key">{option.key}</span>
                    <span>{option.text}</span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="placement-form">
              <label>
                Your answer (self-assessed against the reference answer)
                <textarea
                  rows={5}
                  value={selfNote}
                  onChange={(e) => setSelfNote(e.target.value)}
                  placeholder="Write or speak your answer, then compare with the reference below."
                />
              </label>
            </div>
          )}

          {graded ? (
            <div className="placement-explanation">
              <strong>{graded.correct ? 'Correct.' : 'Not quite.'}</strong>{' '}
              {question.options.length > 0 ? `Correct answer: ${graded.correctAnswer}. ` : ''}
              {question.explanation}
            </div>
          ) : null}

          <div className="placement-actions">
          {(question.options ?? []).length > 0 ? (
              <button
                type="button"
                className="btn btn-primary"
                disabled={!selected || Boolean(graded) || saving}
                onClick={() => void grade()}
              >
                {saving ? 'Saving…' : 'Submit answer'}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                disabled={Boolean(graded) || saving}
                onClick={() => void gradeSubjective()}
              >
                {saving ? 'Saving…' : 'Mark as practised'}
              </button>
            )}
            {graded && index < queue.length - 1 && (
              <button type="button" className="btn" onClick={next}>
                Next question
              </button>
            )}
            {graded && index >= queue.length - 1 && (
              <button type="button" className="btn" onClick={buildQueue}>
                Start another set
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="placement-empty">
          No questions match this filter. Try &quot;Mixed&quot; or a different category.
        </div>
      )}

      <div className="placement-card" style={{ marginTop: 18 }}>
        <h3>Related practice in the existing studios</h3>
        <p className="placement-inline-note">
          DSA, machine coding and programming practice run in the studios that already exist —
          the placement module records the outcome so your readiness stays accurate.
        </p>
        <div className="placement-actions">
          <Link className="btn" to="/dsa/questions">
            DSA Studio
          </Link>
          <Link className="btn" to="/machine-coding">
            Machine Coding
          </Link>
          <Link className="btn" to="/core-programming">
            Core Programming
          </Link>
          <Link className="btn" to="/frontend-javascript">
            Frontend JavaScript
          </Link>
        </div>
      </div>
    </div>
  )
}
