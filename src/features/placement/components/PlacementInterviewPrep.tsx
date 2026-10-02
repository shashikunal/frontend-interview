import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { usePlacement } from '../hooks/usePlacement'
import { INTERVIEW_QUESTIONS } from '../data/questions/interviewQuestions'
import { BANGALORE_STARTUP_QUESTIONS } from '../data/questions/bangaloreStartupQuestions'

const ALL_QUESTIONS = [...INTERVIEW_QUESTIONS, ...BANGALORE_STARTUP_QUESTIONS]

const DURATION_LABELS: Record<string, string> = {
  '60s': '60-second answer',
  '2min': '2-minute answer',
  technical: 'Technical explanation',
  project: 'Project explanation',
  'startup-culture': 'Startup culture',
  fresher: 'Fresher specific',
  scenario: 'Scenario based',
  'product-thinking': 'Product thinking',
  bangalore: 'Bangalore specific',
}

export default function PlacementInterviewPrep() {
  const { user } = useAuth()
  const { recordAttempt } = usePlacement(user?.id)
  const [duration, setDuration] = useState<string>('all')
  const [subcat, setSubcat] = useState<string>('all')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [answerText, setAnswerText] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [selfRatings, setSelfRatings] = useState({
    clarity: 3,
    structure: 3,
    technicalCorrectness: 3,
    confidence: 3,
    conciseness: 3,
  })
  const [practiceCount, setPracticeCount] = useState(0)

  const subcategories = useMemo(
    () => [...new Set(ALL_QUESTIONS.map((q) => q.subcategory))].sort(),
    [],
  )

  const filtered = ALL_QUESTIONS.filter((q) => {
    if (subcat !== 'all' && q.subcategory !== subcat) return false
    if (duration === 'all') return true
    if (duration === '60s') return q.expectedTimeSeconds <= 60
    if (duration === '2min') return q.expectedTimeSeconds > 60 && q.expectedTimeSeconds <= 120
    return q.subcategory === duration
  })

  const active = ALL_QUESTIONS.find((q) => q.id === activeId)

  const saveSelfAssessment = async () => {
    if (!active) return
    const average = Math.round(
      (selfRatings.clarity +
        selfRatings.structure +
        selfRatings.technicalCorrectness +
        selfRatings.confidence +
        selfRatings.conciseness) /
        5,
    )
    await recordAttempt({
      questionId: active.id,
      dayId: null,
      category: 'communication',
      subcategory: active.subcategory,
      mode: 'practice',
      selectedAnswer: answerText.slice(0, 2000),
      isCorrect: average >= 3,
      score: average,
      maxScore: 5,
      timeSpentSeconds: 0,
      attemptsCount: 1,
      hintsUsed: 0,
      resultStatus: average >= 3 ? 'passed' : 'partial',
    })
    setAnswerText('')
    setRevealed(false)
    setActiveId(null)
    setPracticeCount((c) => c + 1)
    setSelfRatings({
      clarity: 3,
      structure: 3,
      technicalCorrectness: 3,
      confidence: 3,
      conciseness: 3,
    })
  }

  return (
    <div>
      <div className="placement-card" style={{ marginBottom: 18 }}>
        <h2>Interview &amp; Communication Preparation</h2>
        <p>
          Spoken-answer practice is scored on clarity, structure, technical correctness, confidence
          and conciseness. Practise out loud before comparing with the reference answer — reading a
          model answer does not build the skill.
        </p>
        {practiceCount > 0 && (
          <p className="placement-inline-note" style={{ marginTop: 8 }}>
            You have practised {practiceCount} {practiceCount === 1 ? 'question' : 'questions'} this session. Keep going!
          </p>
        )}
        <div className="placement-form" style={{ marginTop: 12 }}>
          <div className="placement-form-row">
            <label>
              Answer length
              <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                <option value="all">All</option>
                <option value="60s">60-second answers</option>
                <option value="2min">2-minute answers</option>
                <option value="project">Project explanations</option>
                <option value="technical">Technical explanations</option>
              </select>
            </label>
            <label>
              Topic
              <select value={subcat} onChange={(e) => setSubcat(e.target.value)}>
                <option value="all">All topics</option>
                {subcategories.map((s) => (
                  <option key={s} value={s}>
                    {s.replace('-', ' ')}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="placement-grid cols-2">
        <section className="placement-card">
          <h2>Prompts ({filtered.length})</h2>
          <ul className="placement-list">
            {filtered.map((question) => (
              <li key={question.id}>
                <div className="placement-item-body">
                  <p className="placement-item-title">{question.topic}</p>
                  <p className="placement-item-meta">
                    {question.subcategory.replace('-', ' ')} ·{' '}
                    {question.expectedTimeSeconds <= 60 ? '60s' : '2 min'}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => {
                    setActiveId(question.id)
                    setRevealed(false)
                    setAnswerText('')
                  }}
                >
                  Practise
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="placement-card">
          {active ? (
            <>
              <h2>{active.topic}</h2>
              <p className="placement-inline-note">
                {DURATION_LABELS[active.subcategory] ?? active.subcategory} · target{' '}
                {active.expectedTimeSeconds}s
              </p>
              <p style={{ whiteSpace: 'pre-wrap' }}>{active.prompt}</p>

              <div className="placement-form" style={{ marginTop: 12 }}>
                <label>
                  Your answer (type what you said out loud)
                  <textarea
                    rows={5}
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="Write a short outline or transcript of your spoken answer."
                  />
                </label>
              </div>

              <h3 style={{ marginTop: 14 }}>Self-assessment</h3>
              <div className="placement-form">
                {(
                  [
                    ['clarity', 'Clarity'],
                    ['structure', 'Structure'],
                    ['technicalCorrectness', 'Technical correctness'],
                    ['confidence', 'Confidence'],
                    ['conciseness', 'Conciseness'],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key}>
                    {label}: {selfRatings[key]} / 5
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={selfRatings[key]}
                      onChange={(e) =>
                        setSelfRatings((r) => ({ ...r, [key]: Number(e.target.value) }))
                      }
                    />
                  </label>
                ))}
              </div>

              <div className="placement-actions">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setRevealed((r) => !r)}
                >
                  {revealed ? 'Hide reference answer' : 'Show reference answer'}
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => void saveSelfAssessment()}
                >
                  Save practice attempt
                </button>
              </div>

              {revealed && (
                <div className="placement-explanation">
                  <strong>Reference answer:</strong>
                  <p style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{active.correctAnswer}</p>
                  <p style={{ marginTop: 8 }}>
                    <strong>Scoring guidance:</strong> {active.explanation}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="placement-empty">
              Select a prompt to practise. Aim for a structured answer: context, your action, the
              result, and what you learned.
            </div>
          )}

          <div className="placement-actions">
            <Link className="btn" to="/behavioral">
              Open STAR behavioral practice
            </Link>
            <Link className="btn" to="/mock-interview">
              Run a mock interview
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
