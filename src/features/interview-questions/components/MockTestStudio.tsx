import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { interviewQuestionsDataService } from '../services/interviewQuestionsDataService'
import { interviewQuestionsProgressService } from '../services/interviewQuestionsProgressService'
import type { MasterSubjectId, MasterQuestion } from '../types/interviewQuestions.types'

export default function MockTestStudio() {
  const { subject: urlSubject } = useParams<{ subject?: string }>()
  const initialSubject = (urlSubject?.toLowerCase() || 'javascript') as MasterSubjectId

  // Test setup
  const [selectedSubject, setSelectedSubject] = useState<MasterSubjectId | 'all'>(initialSubject)
  const [testDifficulty, setTestDifficulty] = useState<string>('EASY')
  const [questionCount, setQuestionCount] = useState<number>(10)
  const [isTestActive, setIsTestActive] = useState<boolean>(false)
  const [isTestFinished, setIsTestFinished] = useState<boolean>(false)

  // In-test state
  const [testQuestions, setTestQuestions] = useState<MasterQuestion[]>([])
  const [currentQIndex, setCurrentQIndex] = useState<number>(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, 'correct' | 'incorrect' | 'skipped'>>({})
  const [secondsRemaining, setSecondsRemaining] = useState<number>(600)
  const timerRef = useRef<any>(null)

  // Start the test
  const handleStartTest = async () => {
    const set = await interviewQuestionsDataService.getRandomPracticeSet(selectedSubject, questionCount, testDifficulty)
    setTestQuestions(set)
    setCurrentQIndex(0)
    setUserAnswers({})
    setSecondsRemaining(questionCount * 60) // 1 minute per question
    setIsTestActive(true)
    setIsTestFinished(false)
  }

  // Timer logic
  useEffect(() => {
    if (isTestActive && !isTestFinished) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            handleFinishTest()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isTestActive, isTestFinished])

  const handleFinishTest = () => {
    setIsTestActive(false)
    setIsTestFinished(true)

    // Calculate score
    const correctCount = Object.values(userAnswers).filter(v => v === 'correct').length
    const total = testQuestions.length || 10
    const pct = Math.round((correctCount / total) * 100)
    const timeSpent = (questionCount * 60) - secondsRemaining

    // Record in service
    interviewQuestionsProgressService.recordTestScore({
      subjectId: selectedSubject,
      score: correctCount,
      totalQuestions: total,
      percentage: pct,
      durationSeconds: Math.max(1, timeSpent),
    })
  }

  const markAnswer = (status: 'correct' | 'incorrect' | 'skipped') => {
    setUserAnswers(prev => ({ ...prev, [currentQIndex]: status }))
    if (currentQIndex + 1 < testQuestions.length) {
      setCurrentQIndex(i => i + 1)
    }
  }

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  // Setup View
  if (!isTestActive && !isTestFinished) {
    return (
      <div className="mqb-practice-container" id="mock-test-setup" style={{ padding: '2rem 1rem' }}>
        <div className="mqb-flashcard" style={{ minHeight: 'auto', padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>⏱️</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--mqb-text-primary)' }}>
              Timed Mock Interview Test
            </h1>
            <p style={{ color: 'var(--mqb-text-secondary)', maxWidth: 500, margin: '0 auto' }}>
              Simulate an authentic FAANG technical interview round under realistic time constraints.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Subject Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--mqb-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Select Subject Track
              </label>
              <select
                className="mqb-filter-select"
                style={{ width: '100%', padding: '0.75rem' }}
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value as any)}
              >
                <option value="all">Comprehensive (All 12 Subjects Mixed)</option>
                <option value="javascript">JavaScript Core & Engine</option>
                <option value="react">ReactJS & Modern Architecture</option>
                <option value="typescript">TypeScript Advanced Type System</option>
                <option value="redux">Redux & State Architecture</option>
                <option value="html">HTML & Semantic Web</option>
                <option value="css">CSS & Modern Layouts</option>
                <option value="es6">ECMAScript 2015 (ES6)</option>
                <option value="es7">ECMAScript 2016 (ES7)</option>
                <option value="es8">ECMAScript 2017 (ES8)</option>
                <option value="dom">DOM & Mutation Architecture</option>
                <option value="bom">BOM & Browser Runtime</option>
                <option value="web-apis">Modern Web APIs</option>
              </select>
            </div>

            {/* Assessment Difficulty Preset */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--mqb-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Difficulty Level Preset
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  id="test-diff-easy-fresher-btn"
                  className={`mqb-action-pill-btn ${testDifficulty === 'EASY' ? 'primary' : ''}`}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    justifyContent: 'center',
                    background: testDifficulty === 'EASY' ? '#10b981' : 'rgba(16,185,129,0.12)',
                    borderColor: 'rgba(16,185,129,0.4)',
                    color: testDifficulty === 'EASY' ? '#fff' : '#34d399',
                    fontWeight: 700,
                  }}
                  onClick={() => setTestDifficulty('EASY')}
                >
                  🌱 Fresher / Easy (Questions 1–400)
                </button>
                <button
                  type="button"
                  className={`mqb-action-pill-btn ${testDifficulty === 'ALL' ? 'primary' : ''}`}
                  style={{ flex: 1, padding: '0.75rem', justifyContent: 'center' }}
                  onClick={() => setTestDifficulty('ALL')}
                >
                  ⚡ All Levels (Mixed)
                </button>
                <button
                  type="button"
                  className={`mqb-action-pill-btn ${testDifficulty === 'DIFFICULT' ? 'primary' : ''}`}
                  style={{ flex: 1, padding: '0.75rem', justifyContent: 'center' }}
                  onClick={() => setTestDifficulty('DIFFICULT')}
                >
                  🔥 Advanced Only
                </button>
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--mqb-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Number of Questions
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {[10, 20, 30].map(count => (
                  <button
                    key={count}
                    type="button"
                    className={`mqb-action-pill-btn ${questionCount === count ? 'primary' : ''}`}
                    style={{ flex: 1, padding: '0.75rem', justifyContent: 'center' }}
                    onClick={() => setQuestionCount(count)}
                  >
                    {count} Questions ({count} mins)
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="mqb-action-pill-btn primary"
            id="start-mock-test-btn"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1.05rem', justifyContent: 'center' }}
            onClick={handleStartTest}
          >
            🚀 Launch Assessment Timer
          </button>
        </div>
      </div>
    )
  }

  // Finished Scorecard View
  if (isTestFinished) {
    const correctCount = Object.values(userAnswers).filter(v => v === 'correct').length
    const total = testQuestions.length
    const pct = Math.round((correctCount / total) * 100)

    return (
      <div className="mqb-practice-container" id="mock-test-results" style={{ padding: '2rem 1rem' }}>
        <div className="mqb-flashcard" style={{ minHeight: 'auto', padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
              {pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📈'}
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--mqb-text-primary)' }}>
              Assessment Scorecard
            </h2>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: pct >= 70 ? '#34d399' : '#fbbf24', margin: '0.5rem 0' }}>
              {pct}%
            </div>
            <p style={{ color: 'var(--mqb-text-secondary)' }}>
              {correctCount} out of {total} concepts mastered in {formatTimer((questionCount * 60) - secondsRemaining)}
            </p>
          </div>

          {/* Question Breakdown List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem', maxHeight: '350px', overflowY: 'auto' }}>
            {testQuestions.map((q, idx) => {
              const status = userAnswers[idx] || 'skipped'
              return (
                <div
                  key={q.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    background: 'rgba(0,0,0,0.25)',
                    border: '1px solid var(--mqb-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span>{status === 'correct' ? '✅' : status === 'incorrect' ? '❌' : '⚪'}</span>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--mqb-text-primary)' }}>{q.question}</div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--mqb-text-muted)' }}>{q.topic}</span>
                    </div>
                  </div>
                  <Link
                    to={`/interview-questions/${q.subject}/${q.id}`}
                    target="_blank"
                    style={{ fontSize: '0.8rem', color: '#38bdf8', textDecoration: 'none' }}
                  >
                    Review Answer →
                  </Link>
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              type="button"
              className="mqb-action-pill-btn primary"
              onClick={() => {
                setIsTestActive(false)
                setIsTestFinished(false)
              }}
            >
              🔄 Take Another Test
            </button>
            <Link to="/interview-questions" className="mqb-action-pill-btn">
              Back to Master Bank
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Active In-Test View
  const currentQ = testQuestions[currentQIndex]
  if (!currentQ) return null

  return (
    <div className="mqb-practice-container" id="active-mock-test" style={{ padding: '2rem 1rem' }}>
      {/* Test Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', background: 'var(--mqb-bg-glass)', border: '1px solid var(--mqb-border)', borderRadius: '14px', padding: '0.85rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontWeight: 700, color: 'var(--mqb-text-primary)' }}>
            Question {currentQIndex + 1} of {testQuestions.length}
          </span>
          <span className={`mqb-diff-pill ${currentQ.difficulty}`}>{currentQ.difficulty}</span>
        </div>

        {/* Countdown Timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--mqb-font-mono)', fontSize: '1.2rem', fontWeight: 800, color: secondsRemaining < 120 ? '#f87171' : '#38bdf8' }}>
          <span>⏱️</span>
          <span>{formatTimer(secondsRemaining)}</span>
        </div>

        <button
          type="button"
          className="mqb-action-pill-btn"
          style={{ fontSize: '0.8rem' }}
          onClick={handleFinishTest}
        >
          Submit Early
        </button>
      </div>

      {/* Test Question Card */}
      <div className="mqb-flashcard">
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--mqb-text-muted)', marginBottom: '0.5rem' }}>
            {currentQ.topic} • {currentQ.subtopic}
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.45, color: 'var(--mqb-text-primary)', margin: '0 0 1.5rem' }}>
            {currentQ.question}
          </h2>

          <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--mqb-border)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <p style={{ color: 'var(--mqb-text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              Formulate your response, evaluate your understanding against the model criteria, and mark your assessment below.
            </p>
          </div>
        </div>

        {/* Self-Assessment Buttons */}
        <div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              className="mqb-conf-btn easy"
              id="test-mark-confident"
              onClick={() => markAnswer('correct')}
            >
              ✅ Confident &amp; Complete
            </button>
            <button
              type="button"
              className="mqb-conf-btn hard"
              id="test-mark-unsure"
              onClick={() => markAnswer('incorrect')}
            >
              ❌ Unsure / Needs Study
            </button>
            <button
              type="button"
              className="mqb-action-pill-btn"
              onClick={() => markAnswer('skipped')}
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
