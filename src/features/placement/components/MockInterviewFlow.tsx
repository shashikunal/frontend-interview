import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { usePlacement } from '../hooks/usePlacement'
import { pickQuestions } from '../data/questions'
import type { PlacementQuestionRecord } from '../types/placement.types'

type InterviewPhase = 'intro' | 'questioning' | 'feedback' | 'complete'

interface InterviewQuestion {
  question: PlacementQuestionRecord
  userAnswer: string
  selfRating: number
  timeSpent: number
}

const MOCK_TEMPLATES = [
  {
    id: 'startup-full',
    name: 'Startup Full Mock',
    description: 'Complete simulation: aptitude, technical, DSA, frontend, communication',
    duration: 60,
    categories: ['aptitude', 'technical_mcq', 'dsa', 'frontend', 'communication'] as const,
  },
  {
    id: 'frontend-focused',
    name: 'Frontend Focused',
    description: 'Deep dive into JavaScript, React, TypeScript, and frontend concepts',
    duration: 45,
    categories: ['technical_mcq', 'frontend'] as const,
  },
  {
    id: 'dsa-intensive',
    name: 'DSA Intensive',
    description: 'Data structures and algorithms problem-solving under time pressure',
    duration: 45,
    categories: ['dsa'] as const,
  },
  {
    id: 'communication-hr',
    name: 'Communication & HR',
    description: 'Behavioral questions, communication skills, and cultural fit',
    duration: 30,
    categories: ['communication'] as const,
  },
]

export default function MockInterviewFlow() {
  const { user } = useAuth()
  const { recordAttempt } = usePlacement(user?.id)
  const [phase, setPhase] = useState<InterviewPhase>('intro')
  const [selectedTemplate, setSelectedTemplate] = useState<typeof MOCK_TEMPLATES[0] | null>(null)
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [answers, setAnswers] = useState<Record<string, { answer: string; rating: number }>>({})

  const startInterview = (template: typeof MOCK_TEMPLATES[0]) => {
    setSelectedTemplate(template)
    const picked = pickQuestions({
      categories: [...template.categories],
      limit: 10,
      seed: Date.now() % 100000,
    })
    setQuestions(
      picked.map((q) => ({
        question: q,
        userAnswer: '',
        selfRating: 3,
        timeSpent: 0,
      })),
    )
    setCurrentIndex(0)
    setStartTime(Date.now())
    setPhase('questioning')
  }

  const submitAnswer = () => {
    const current = questions[currentIndex]
    if (!current) return
    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    const updated = [...questions]
    updated[currentIndex] = {
      ...current,
      userAnswer: answers[current.question.id]?.answer ?? '',
      selfRating: answers[current.question.id]?.rating ?? 3,
      timeSpent,
    }
    setQuestions(updated)

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setStartTime(Date.now())
    } else {
      setPhase('feedback')
    }
  }

  const saveResults = async () => {
    if (!user?.id) return
    for (const q of questions) {
      await recordAttempt({
        questionId: q.question.id,
        dayId: null,
        category: q.question.category,
        subcategory: q.question.subcategory,
        mode: 'mock',
        selectedAnswer: q.userAnswer,
        isCorrect: q.selfRating >= 3,
        score: q.selfRating,
        maxScore: 5,
        timeSpentSeconds: q.timeSpent,
        attemptsCount: 1,
        hintsUsed: 0,
        resultStatus: q.selfRating >= 3 ? 'passed' : 'partial',
      })
    }
    setPhase('complete')
  }

  const currentQuestion = questions[currentIndex]
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0

  if (phase === 'intro') {
    return (
      <div>
        <div className="placement-card" style={{ marginBottom: 18 }}>
          <h2>Mock Interview Simulator</h2>
          <p>
            Practice in a realistic interview environment. Choose a template, answer questions under
            time pressure, and get immediate feedback. Your results feed into your readiness score.
          </p>
        </div>

        <div className="placement-grid cols-2">
          {MOCK_TEMPLATES.map((template) => (
            <div key={template.id} className="placement-card">
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              <p className="placement-inline-note">Duration: {template.duration} minutes</p>
              <div className="placement-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => startInterview(template)}
                >
                  Start Interview
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="placement-card" style={{ marginTop: 18 }}>
          <h3>Tips for Mock Interviews</h3>
          <ul className="placement-list">
            <li>
              <div className="placement-item-body">
                <p className="placement-item-title">Think out loud</p>
                <p className="placement-item-meta">
                  Narrate your thought process as you solve problems
                </p>
              </div>
            </li>
            <li>
              <div className="placement-item-body">
                <p className="placement-item-title">Manage your time</p>
                <p className="placement-item-meta">
                  Do not spend too long on one question — move on and come back
                </p>
              </div>
            </li>
            <li>
              <div className="placement-item-body">
                <p className="placement-item-title">Be honest</p>
                <p className="placement-item-meta">
                  If you do not know something, say so — interviewers value honesty
                </p>
              </div>
            </li>
          </ul>
          <div className="placement-actions">
            <Link className="btn" to="/placement?view=mock-interviews">
              View scheduled mocks
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'questioning' && currentQuestion) {
    return (
      <div>
        <div className="placement-card" style={{ marginBottom: 18 }}>
          <div className="placement-actions" style={{ marginTop: 0, marginBottom: 12 }}>
            <span className="placement-badge info">{selectedTemplate?.name}</span>
            <span className="placement-badge">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="placement-badge">{currentQuestion.question.category}</span>
          </div>
          <div className="placement-progress-track">
            <div className="placement-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="placement-question">
          <p className="prompt">{currentQuestion.question.prompt}</p>
          {currentQuestion.question.codeSnippet ? (
            <pre>{currentQuestion.question.codeSnippet}</pre>
          ) : null}

          <div className="placement-form" style={{ marginTop: 12 }}>
            <label>
              Your answer
              <textarea
                rows={5}
                value={answers[currentQuestion.question.id]?.answer ?? ''}
                onChange={(e) =>
                  setAnswers((a) => ({
                    ...a,
                    [currentQuestion.question.id]: {
                      answer: e.target.value,
                      rating: a[currentQuestion.question.id]?.rating ?? 3,
                    },
                  }))
                }
                placeholder="Type your answer here..."
              />
            </label>
          </div>

          <h3 style={{ marginTop: 14 }}>Self-assessment</h3>
          <div className="placement-form">
            <label>
              How confident are you in this answer? ({answers[currentQuestion.question.id]?.rating ?? 3}/5)
              <input
                type="range"
                min={1}
                max={5}
                value={answers[currentQuestion.question.id]?.rating ?? 3}
                onChange={(e) =>
                  setAnswers((a) => ({
                    ...a,
                    [currentQuestion.question.id]: {
                      answer: a[currentQuestion.question.id]?.answer ?? '',
                      rating: Number(e.target.value),
                    },
                  }))
                }
              />
            </label>
          </div>

          <div className="placement-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={submitAnswer}
            >
              {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'feedback') {
    const avgRating =
      questions.reduce((sum, q) => sum + q.selfRating, 0) / Math.max(1, questions.length)
    const passed = questions.filter((q) => q.selfRating >= 3).length

    return (
      <div>
        <div className="placement-card" style={{ marginBottom: 18, textAlign: 'center' }}>
          <h2>Interview Complete!</h2>
          <p style={{ fontSize: '1.1rem', margin: '12px 0' }}>
            You completed {questions.length} questions
          </p>
          <div className="placement-grid cols-3" style={{ marginTop: 16 }}>
            <div className="placement-stat">
              <span className="value">{Math.round(avgRating * 20)}%</span>
              <span className="label">Average Confidence</span>
            </div>
            <div className="placement-stat">
              <span className="value">{passed}</span>
              <span className="label">Questions Passed</span>
            </div>
            <div className="placement-stat">
              <span className="value">{questions.length - passed}</span>
              <span className="label">Needs Improvement</span>
            </div>
          </div>
        </div>

        <div className="placement-card" style={{ marginBottom: 18 }}>
          <h3>Question Review</h3>
          <ul className="placement-list">
            {questions.map((q, i) => (
              <li key={q.question.id}>
                <div className="placement-item-body">
                  <p className="placement-item-title">
                    {i + 1}. {q.question.topic}
                  </p>
                  <p className="placement-item-meta">
                    {q.question.subcategory} · Self-rating: {q.selfRating}/5 · Time: {q.timeSpent}s
                  </p>
                </div>
                <span
                  className={`placement-badge ${q.selfRating >= 3 ? 'good' : 'warn'}`}
                >
                  {q.selfRating >= 3 ? 'Passed' : 'Review'}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="placement-actions">
          <button type="button" className="btn btn-primary" onClick={() => void saveResults()}>
            Save Results
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setPhase('intro')
              setQuestions([])
              setCurrentIndex(0)
            }}
          >
            Start New Interview
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="placement-card" style={{ textAlign: 'center', padding: '40px' }}>
      <h2>Results Saved!</h2>
      <p>Your mock interview results have been recorded and will contribute to your readiness score.</p>
      <div className="placement-actions" style={{ justifyContent: 'center' }}>
        <Link to="/placement?view=mock-interviews" className="btn btn-primary">
          View All Mocks
        </Link>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setPhase('intro')
            setQuestions([])
            setCurrentIndex(0)
          }}
        >
          Start New Interview
        </button>
      </div>
    </div>
  )
}
