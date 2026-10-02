import { useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { usePlacement } from '../hooks/usePlacement'
import { placementApplicationsService } from '../services/placementApplications.service'

interface DefenseQuestion {
  id: string
  question: string
  category: string
  tips: string[]
  followUp: string
}

const DEFENSE_QUESTIONS: DefenseQuestion[] = [
  {
    id: 'dq-001',
    question: 'What problem does your project solve?',
    category: 'Problem',
    tips: ['Be specific about the target user', 'Explain the pain point', 'Keep it under 30 seconds'],
    followUp: 'How did you validate that this was a real problem?',
  },
  {
    id: 'dq-002',
    question: 'Why did you choose this tech stack?',
    category: 'Technical',
    tips: ['Tie choices to requirements', 'Mention alternatives you considered', 'Show you understand trade-offs'],
    followUp: 'What would you change if you started over?',
  },
  {
    id: 'dq-003',
    question: 'How does authentication work in your project?',
    category: 'Security',
    tips: ['Explain the flow step by step', 'Mention token handling', 'Discuss security considerations'],
    followUp: 'How do you handle token expiration?',
  },
  {
    id: 'dq-004',
    question: 'How do you handle API errors?',
    category: 'Error Handling',
    tips: ['Show you handle loading, error, and empty states', 'Mention specific error types', 'Explain retry logic'],
    followUp: 'How do you handle network failures?',
  },
  {
    id: 'dq-005',
    question: 'How did you manage state in your project?',
    category: 'Architecture',
    tips: ['Explain your state management approach', 'Mention local vs global state', 'Discuss data flow'],
    followUp: 'How would you scale this to a larger app?',
  },
  {
    id: 'dq-006',
    question: 'What was your hardest bug and how did you solve it?',
    category: 'Debugging',
    tips: ['Use STAR method', 'Show your debugging process', 'Explain what you learned'],
    followUp: 'How do you prevent similar bugs in the future?',
  },
  {
    id: 'dq-007',
    question: 'How did you deploy your project?',
    category: 'Deployment',
    tips: ['Explain the deployment pipeline', 'Mention hosting platform', 'Discuss environment variables'],
    followUp: 'How would you set up CI/CD for this project?',
  },
  {
    id: 'dq-008',
    question: 'What happens if 1000 users use your app at once?',
    category: 'Scaling',
    tips: ['Think in layers: client, server, database', 'Mention caching and pagination', 'Be honest about what you have not tested'],
    followUp: 'How would you load test this?',
  },
  {
    id: 'dq-009',
    question: 'What would you improve with two more weeks?',
    category: 'Improvement',
    tips: ['Prioritize by user impact', 'Be specific about what and why', 'Show self-awareness'],
    followUp: 'How would you measure the impact of these improvements?',
  },
  {
    id: 'dq-010',
    question: 'How does your frontend communicate with the backend?',
    category: 'Architecture',
    tips: ['Explain the API layer', 'Mention request/response flow', 'Discuss error handling'],
    followUp: 'How do you handle API versioning?',
  },
]

interface Answer {
  questionId: string
  answer: string
  selfRating: number
  timeSpent: number
}

export default function ProjectInterviewFlow() {
  const { user } = useAuth()
  const { recordAttempt } = usePlacement(user?.id)
  const [projects, setProjects] = useState<Awaited<ReturnType<typeof placementApplicationsService.getProjects>>>([])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [showTips, setShowTips] = useState(false)
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const currentQuestion = DEFENSE_QUESTIONS[currentQuestionIndex]
  const project = projects.find((p) => p.id === selectedProject)

  const startQuestion = () => {
    setStartTime(Date.now())
    setShowTips(false)
    setShowFollowUp(false)
  }

  const submitAnswer = async () => {
    if (!currentQuestion || !user?.id) return

    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    const answer = answers[currentQuestion.id]?.answer ?? ''
    const selfRating = answers[currentQuestion.id]?.selfRating ?? 3

    await recordAttempt({
      questionId: `project-defense-${currentQuestion.id}`,
      dayId: null,
      category: 'project',
      subcategory: 'defense',
      mode: 'practice',
      selectedAnswer: answer,
      isCorrect: selfRating >= 3,
      score: selfRating,
      maxScore: 5,
      timeSpentSeconds: timeSpent,
      attemptsCount: 1,
      hintsUsed: 0,
      resultStatus: selfRating >= 3 ? 'passed' : 'partial',
    })

    if (currentQuestionIndex < DEFENSE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      startQuestion()
    } else {
      setIsComplete(true)
    }
  }

  const progress = ((currentQuestionIndex + 1) / DEFENSE_QUESTIONS.length) * 100

  if (isComplete) {
    const avgRating = Object.values(answers).reduce((sum, a) => sum + a.selfRating, 0) / DEFENSE_QUESTIONS.length
    const passed = Object.values(answers).filter((a) => a.selfRating >= 3).length

    return (
      <div>
        <div className="placement-card" style={{ marginBottom: 18, textAlign: 'center' }}>
          <h2>Project Defense Complete!</h2>
          <p style={{ fontSize: '1.1rem', margin: '12px 0' }}>
            You completed {DEFENSE_QUESTIONS.length} defense questions
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
              <span className="value">{DEFENSE_QUESTIONS.length - passed}</span>
              <span className="label">Needs Improvement</span>
            </div>
          </div>
        </div>

        <div className="placement-card" style={{ marginBottom: 18 }}>
          <h3>Question Review</h3>
          <ul className="placement-list">
            {DEFENSE_QUESTIONS.map((q, i) => {
              const answer = answers[q.id]
              return (
                <li key={q.id}>
                  <div className="placement-item-body">
                    <p className="placement-item-title">
                      {i + 1}. {q.question}
                    </p>
                    <p className="placement-item-meta">
                      {q.category} · Self-rating: {answer?.selfRating ?? 0}/5 · Time: {answer?.timeSpent ?? 0}s
                    </p>
                  </div>
                  <span className={`placement-badge ${answer && answer.selfRating >= 3 ? 'good' : 'warn'}`}>
                    {answer && answer.selfRating >= 3 ? 'Passed' : 'Review'}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="placement-actions">
          <button
            type="button"
            className="btn"
            onClick={() => {
              setIsComplete(false)
              setCurrentQuestionIndex(0)
              setAnswers({})
            }}
          >
            Practice Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="placement-card" style={{ marginBottom: 18 }}>
        <h2>Project Defense Rehearsal</h2>
        <p>
          Practice explaining your project like an interviewer is listening. Answer each question out loud,
          then type your answer and self-assess.
        </p>
        {projects.length > 0 && (
          <div className="placement-form" style={{ marginTop: 12 }}>
            <label>
              Select Project
              <select
                value={selectedProject ?? ''}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="">Select a project...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>

      <div className="placement-card" style={{ marginBottom: 18 }}>
        <div className="placement-actions" style={{ marginTop: 0, marginBottom: 12 }}>
          <span className="placement-badge info">Question {currentQuestionIndex + 1} of {DEFENSE_QUESTIONS.length}</span>
          <span className="placement-badge">{currentQuestion.category}</span>
        </div>
        <div className="placement-progress-track">
          <div className="placement-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="placement-question">
        <p className="prompt">{currentQuestion.question}</p>

        <div className="placement-actions">
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => setShowTips(!showTips)}
          >
            {showTips ? 'Hide Tips' : 'Show Tips'}
          </button>
        </div>

        {showTips && (
          <div className="placement-explanation" style={{ marginTop: 12 }}>
            <strong>Tips:</strong>
            <ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>
              {currentQuestion.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="placement-form" style={{ marginTop: 12 }}>
          <label>
            Your answer (type what you said out loud)
            <textarea
              rows={5}
              value={answers[currentQuestion.id]?.answer ?? ''}
              onChange={(e) =>
                setAnswers((a) => ({
                  ...a,
                  [currentQuestion.id]: {
                    ...a[currentQuestion.id],
                    questionId: currentQuestion.id,
                    answer: e.target.value,
                    selfRating: a[currentQuestion.id]?.selfRating ?? 3,
                    timeSpent: 0,
                  },
                }))
              }
              placeholder="Type your spoken answer here..."
            />
          </label>
        </div>

        <h3 style={{ marginTop: 14 }}>Self-assessment</h3>
        <div className="placement-form">
          <label>
            How confident are you? ({answers[currentQuestion.id]?.selfRating ?? 3}/5)
            <input
              type="range"
              min={1}
              max={5}
              value={answers[currentQuestion.id]?.selfRating ?? 3}
              onChange={(e) =>
                setAnswers((a) => ({
                  ...a,
                  [currentQuestion.id]: {
                    ...a[currentQuestion.id],
                    questionId: currentQuestion.id,
                    answer: a[currentQuestion.id]?.answer ?? '',
                    selfRating: Number(e.target.value),
                    timeSpent: 0,
                  },
                }))
              }
            />
          </label>
        </div>

        <div className="placement-actions">
          <button
            type="button"
            className="btn"
            onClick={() => setShowFollowUp(!showFollowUp)}
          >
            {showFollowUp ? 'Hide Follow-up' : 'Show Follow-up'}
          </button>
        </div>

        {showFollowUp && (
          <div className="placement-explanation" style={{ marginTop: 12 }}>
            <strong>Follow-up question:</strong>
            <p style={{ marginTop: 8 }}>{currentQuestion.followUp}</p>
          </div>
        )}

        <div className="placement-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={submitAnswer}
          >
            {currentQuestionIndex < DEFENSE_QUESTIONS.length - 1 ? 'Next Question' : 'Finish'}
          </button>
        </div>
      </div>
    </div>
  )
}
