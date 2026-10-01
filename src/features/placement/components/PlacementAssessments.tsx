import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { pickQuestions, getVerifiedQuestions } from '../data/questions'
import type {
  PlacementCategory,
  PlacementQuestionRecord,
} from '../types/placement.types'
import {
  generateLocalId,
  nowIso,
  readLocal,
  writeLocal,
} from '../services/placementStorage'
import { supabase } from '../../../lib/supabase/client'

interface AssessmentDefinition {
  id: string
  title: string
  description: string
  assessmentType: 'weekly' | 'final'
  dayNumber: number
  durationMinutes: number
  questionCount: number
  categories: PlacementCategory[]
  passingScore: number
}

const ASSESSMENTS: AssessmentDefinition[] = [
  {
    id: 'weekly-1',
    title: 'Week 1 Checkpoint',
    description: 'Foundation: aptitude, reasoning, HTML, CSS and JavaScript fundamentals.',
    assessmentType: 'weekly',
    dayNumber: 7,
    durationMinutes: 60,
    questionCount: 20,
    categories: ['aptitude', 'reasoning', 'frontend', 'technical_mcq'],
    passingScore: 60,
  },
  {
    id: 'weekly-2',
    title: 'Week 2 Checkpoint',
    description: 'Core programming: DSA patterns, language fundamentals and React basics.',
    assessmentType: 'weekly',
    dayNumber: 14,
    durationMinutes: 60,
    questionCount: 20,
    categories: ['technical_mcq', 'programming', 'dsa', 'frontend'],
    passingScore: 60,
  },
  {
    id: 'weekly-3',
    title: 'Week 3 Checkpoint',
    description: 'Intermediate DSA, TypeScript and browser APIs.',
    assessmentType: 'weekly',
    dayNumber: 21,
    durationMinutes: 60,
    questionCount: 20,
    categories: ['technical_mcq', 'dsa', 'frontend', 'cs_fundamentals'],
    passingScore: 65,
  },
  {
    id: 'weekly-4',
    title: 'Week 4 Checkpoint',
    description: 'Interview depth: trees, graphs, DP basics, SQL and CS fundamentals.',
    assessmentType: 'weekly',
    dayNumber: 28,
    durationMinutes: 60,
    questionCount: 20,
    categories: ['technical_mcq', 'sql', 'cs_fundamentals', 'dsa'],
    passingScore: 65,
  },
  {
    id: 'final',
    title: 'Final Placement Assessment',
    description:
      '100-question screening simulation across aptitude, reasoning, technical MCQ, SQL and CS fundamentals. The DSA coding, machine coding, project defense and communication rounds run in the existing studios and in the mock interview module.',
    assessmentType: 'final',
    dayNumber: 30,
    durationMinutes: 90,
    questionCount: 30,
    categories: ['aptitude', 'reasoning', 'technical_mcq', 'sql', 'cs_fundamentals', 'frontend', 'verbal'],
    passingScore: 70,
  },
]

interface AssessmentResult {
  assessmentId: string
  score: number
  maxScore: number
  percentage: number
  correct: number
  wrong: number
  skipped: number
  weakTopics: string[]
  categoryBreakdown: Record<string, { correct: number; total: number }>
  submittedAt: string
}

export default function PlacementAssessments() {
  const { user } = useAuth()
  const userId = user?.id

  const [active, setActive] = useState<AssessmentDefinition | null>(null)
  const [paper, setPaper] = useState<PlacementQuestionRecord[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [index, setIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [history, setHistory] = useState<AssessmentResult[]>([])
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!userId) return
    setHistory(readLocal<AssessmentResult[]>('assessment_history', userId, []))
  }, [userId])

  useEffect(() => {
    if (!active || result) return
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [active, result])

  const startAssessment = useCallback((definition: AssessmentDefinition) => {
    const generated = pickQuestions({
      categories: definition.categories,
      limit: definition.questionCount,
      seed: Date.now() % 100000,
    })
    setActive(definition)
    setPaper(generated)
    setAnswers({})
    setIndex(0)
    setResult(null)
    setSecondsLeft(definition.durationMinutes * 60)
  }, [])

  const submit = useCallback(async () => {
    if (!active || !userId) return
    let correct = 0
    let wrong = 0
    let skipped = 0
    const categoryBreakdown: Record<string, { correct: number; total: number }> = {}
    const weakTopics: string[] = []

    for (const question of paper) {
      const entry = categoryBreakdown[question.subcategory] ?? { correct: 0, total: 0 }
      entry.total += 1
      const answer = answers[question.id]
      if (!answer) {
        skipped += 1
      } else if (answer === question.correctAnswer) {
        correct += 1
        entry.correct += 1
      } else {
        wrong += 1
        if (!weakTopics.includes(question.subcategory)) weakTopics.push(question.subcategory)
      }
      categoryBreakdown[question.subcategory] = entry
    }

    const maxScore = paper.length || 1
    const percentage = Math.round((correct / maxScore) * 100)
    const computed: AssessmentResult = {
      assessmentId: active.id,
      score: correct,
      maxScore,
      percentage,
      correct,
      wrong,
      skipped,
      weakTopics,
      categoryBreakdown,
      submittedAt: nowIso(),
    }

    setResult(computed)
    const nextHistory = [computed, ...history].slice(0, 20)
    setHistory(nextHistory)
    writeLocal('assessment_history', userId, nextHistory)

    try {
      await supabase.from('placement_assessment_attempts').insert({
        id: generateLocalId('paa'),
        user_id: userId,
        assessment_id: active.id,
        program_id: 'placement-30-day',
        status: 'submitted',
        submitted_at: computed.submittedAt,
        score: computed.score,
        max_score: computed.maxScore,
        percentage: computed.percentage,
        correct_count: computed.correct,
        wrong_count: computed.wrong,
        skipped_count: computed.skipped,
        weak_topics: computed.weakTopics,
        category_breakdown: computed.categoryBreakdown,
      })
    } catch {
      /* local history is already written */
    }
  }, [active, answers, history, paper, userId])

  const bankSize = useMemo(() => getVerifiedQuestions().length, [])
  const current = paper[index]
  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  if (result && active) {
    return (
      <div>
        <div className="placement-card" style={{ marginBottom: 18 }}>
          <h2>{active.title} — Result</h2>
          <div className="placement-grid cols-4" style={{ marginTop: 12 }}>
            <div className="placement-stat">
              <span className="value">{result.percentage}%</span>
              <span className="label">Score</span>
            </div>
            <div className="placement-stat">
              <span className="value">{result.correct}</span>
              <span className="label">Correct</span>
            </div>
            <div className="placement-stat">
              <span className="value">{result.wrong}</span>
              <span className="label">Wrong</span>
            </div>
            <div className="placement-stat">
              <span className="value">{result.skipped}</span>
              <span className="label">Skipped</span>
            </div>
          </div>
          <div
            className={`placement-callout ${result.percentage >= active.passingScore ? 'success' : 'danger'}`}
            style={{ marginTop: 16 }}
          >
            {result.percentage >= active.passingScore
              ? `Passed — ${result.percentage}% against a ${active.passingScore}% requirement.`
              : `Below the ${active.passingScore}% requirement. The topics below are added to your weakness plan.`}
          </div>
          {result.weakTopics.length > 0 && (
            <>
              <h3 style={{ marginTop: 16 }}>Topics to correct</h3>
              <ul className="placement-list">
                {result.weakTopics.map((topic) => {
                  const stats = result.categoryBreakdown[topic]
                  return (
                    <li key={topic}>
                      <div className="placement-item-body">
                        <p className="placement-item-title">{topic}</p>
                        <p className="placement-item-meta">
                          {stats.correct}/{stats.total} correct in this assessment
                        </p>
                      </div>
                      <span className="placement-badge bad">
                        {Math.round((stats.correct / stats.total) * 100)}%
                      </span>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
          <div className="placement-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setActive(null)
                setResult(null)
                setPaper([])
              }}
            >
              Back to assessments
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (active && current) {
    return (
      <div className="placement-question">
        <div className="placement-actions" style={{ marginTop: 0, marginBottom: 12 }}>
          <span className="placement-badge info">{active.title}</span>
          <span className="placement-badge">
            {index + 1} / {paper.length}
          </span>
          <span className={`placement-badge ${secondsLeft < 120 ? 'bad' : 'warn'}`}>
            Time left: {minutes}:{String(seconds).padStart(2, '0')}
          </span>
        </div>

        <p className="prompt">{current.prompt}</p>
        {current.codeSnippet ? <pre>{current.codeSnippet}</pre> : null}

        <div className="placement-options" role="radiogroup" aria-label="Answer options">
          {current.options.map((option) => (
            <button
              key={option.key}
              type="button"
              role="radio"
              aria-checked={answers[current.id] === option.key}
              className={`placement-option ${answers[current.id] === option.key ? 'selected' : ''}`}
              onClick={() => setAnswers((a) => ({ ...a, [current.id]: option.key }))}
            >
              <span className="key">{option.key}</span>
              <span>{option.text}</span>
            </button>
          ))}
        </div>

        <div className="placement-actions">
          <button
            type="button"
            className="btn"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn"
            disabled={index >= paper.length - 1}
            onClick={() => setIndex((i) => Math.min(paper.length - 1, i + 1))}
          >
            Next
          </button>
          <button type="button" className="btn btn-primary" onClick={() => void submit()}>
            Submit assessment
          </button>
        </div>
        <p className="placement-inline-note">
          Interview mode rules apply: no hints, no solutions, the timer keeps running and the
          submission is recorded.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="placement-card" style={{ marginBottom: 18 }}>
        <h2>Assessments</h2>
        <p>
          Weekly checkpoints every 7 days and a final placement assessment on Day 30. Every paper
          is drawn from the {bankSize} verified questions in the placement bank — questions that
          are marked for review or incorrect are excluded automatically.
        </p>
        <p className="placement-inline-note">
          The DSA coding, machine coding, project defense and communication rounds of the final
          assessment run in the existing studios (<a href="/dsa/questions">DSA</a>,{' '}
          <a href="/machine-coding">Machine Coding</a>) and in the mock interview module, so
          nothing is duplicated here.
        </p>
      </div>

      <div className="placement-grid cols-2">
        {ASSESSMENTS.map((assessment) => (
          <section key={assessment.id} className="placement-card">
            <h3>{assessment.title}</h3>
            <p>{assessment.description}</p>
            <div className="placement-actions" style={{ marginTop: 10 }}>
              <span className="placement-badge info">{assessment.assessmentType}</span>
              <span className="placement-badge">Day {assessment.dayNumber}</span>
              <span className="placement-badge">{assessment.questionCount} questions</span>
              <span className="placement-badge">{assessment.durationMinutes} min</span>
              <span className="placement-badge warn">Pass: {assessment.passingScore}%</span>
            </div>
            <div className="placement-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => startAssessment(assessment)}
              >
                Start assessment
              </button>
            </div>
          </section>
        ))}
      </div>

      <section className="placement-card" style={{ marginTop: 18 }}>
        <h3>Your assessment history</h3>
        {history.length ? (
          <div className="placement-table-wrap">
            <table className="placement-table">
              <thead>
                <tr>
                  <th>Assessment</th>
                  <th>Score</th>
                  <th>Correct</th>
                  <th>Wrong</th>
                  <th>Skipped</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry) => {
                  const definition = ASSESSMENTS.find((a) => a.id === entry.assessmentId)
                  return (
                    <tr key={`${entry.assessmentId}-${entry.submittedAt}`}>
                      <td>{definition?.title ?? entry.assessmentId}</td>
                      <td>
                        <span
                          className={`placement-badge ${
                            entry.percentage >= (definition?.passingScore ?? 60) ? 'good' : 'bad'
                          }`}
                        >
                          {entry.percentage}%
                        </span>
                      </td>
                      <td>{entry.correct}</td>
                      <td>{entry.wrong}</td>
                      <td>{entry.skipped}</td>
                      <td>{new Date(entry.submittedAt).toLocaleString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="placement-empty">
            No data available yet. Complete an assessment to see your history and weak topics.
          </div>
        )}
      </section>
    </div>
  )
}
