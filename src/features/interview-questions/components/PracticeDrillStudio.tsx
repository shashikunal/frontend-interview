import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { interviewQuestionsDataService } from '../services/interviewQuestionsDataService'
import { interviewQuestionsProgressService } from '../services/interviewQuestionsProgressService'
import type { MasterSubjectId, MasterQuestion } from '../types/interviewQuestions.types'

export default function PracticeDrillStudio() {
  const { subject: urlSubject } = useParams<{ subject?: string }>()
  const currentSubject = (urlSubject?.toLowerCase() || 'javascript') as MasterSubjectId

  const [questions, setQuestions] = useState<MasterQuestion[]>([])
  const [drillDifficulty, setDrillDifficulty] = useState<string>('EASY')
  const [highFreqOnly, setHighFreqOnly] = useState<boolean>(false)
  const [selectedCompany, setSelectedCompany] = useState<string>('ALL')
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false)
  const [ratedCounts, setRatedCounts] = useState({ hard: 0, good: 0, easy: 0 })

  useEffect(() => {
    let mounted = true

    async function loadSet() {
      try {
        setLoading(true)
        const set = await interviewQuestionsDataService.getRandomPracticeSet(
          currentSubject,
          10,
          { difficulty: drillDifficulty, companyTag: selectedCompany, highFreqOnly }
        )
        if (mounted) {
          setQuestions(set)
          setCurrentIndex(0)
          setIsAnswerRevealed(false)
          setSessionCompleted(false)
          setRatedCounts({ hard: 0, good: 0, easy: 0 })
        }
      } catch (err) {
        console.error('Failed to load practice set:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadSet()
    return () => { mounted = false }
  }, [currentSubject, drillDifficulty, selectedCompany, highFreqOnly])

  const currentQ = questions[currentIndex]

  const handleRate = (rating: 'hard' | 'good' | 'easy') => {
    setRatedCounts(prev => ({ ...prev, [rating]: prev[rating] + 1 }))

    if (rating === 'easy' && currentQ) {
      interviewQuestionsProgressService.toggleCompleted(currentQ.id, currentQ.subject)
    } else if (rating === 'hard' && currentQ) {
      interviewQuestionsProgressService.toggleNeedsReview(currentQ.id)
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(i => i + 1)
      setIsAnswerRevealed(false)
    } else {
      setSessionCompleted(true)
    }
  }

  const handleRestart = async () => {
    setLoading(true)
    const set = await interviewQuestionsDataService.getRandomPracticeSet(currentSubject, 10, drillDifficulty)
    setQuestions(set)
    setCurrentIndex(0)
    setIsAnswerRevealed(false)
    setSessionCompleted(false)
    setRatedCounts({ hard: 0, good: 0, easy: 0 })
    setLoading(false)
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div className="app-route-spinner" style={{ margin: '0 auto 1.5rem', width: 44, height: 44, border: '3px solid rgba(56,189,248,0.2)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <h3 style={{ color: 'var(--mqb-text-primary)' }}>Preparing Practice Drill...</h3>
      </div>
    )
  }

  if (sessionCompleted) {
    return (
      <div className="mqb-practice-container" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <div className="mqb-flashcard" style={{ minHeight: 'auto', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--mqb-text-primary)' }}>
            Practice Session Completed!
          </h2>
          <p style={{ color: 'var(--mqb-text-secondary)', marginBottom: '2rem' }}>
            You reviewed 10 questions in {currentSubject.toUpperCase()} ({drillDifficulty === 'EASY' ? '🌱 Fresher / Easy Mode' : drillDifficulty}).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ color: '#f87171', fontWeight: 800, fontSize: '1.8rem' }}>{ratedCounts.hard}</div>
              <div style={{ color: '#f87171', fontSize: '0.85rem', fontWeight: 600 }}>Needs Review</div>
            </div>
            <div style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.8rem' }}>{ratedCounts.good}</div>
              <div style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600 }}>Good Recall</div>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ color: '#34d399', fontWeight: 800, fontSize: '1.8rem' }}>{ratedCounts.easy}</div>
              <div style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: 600 }}>Mastered</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button
              type="button"
              className="mqb-action-pill-btn primary"
              onClick={handleRestart}
            >
              🔄 Practice Another 10 Questions
            </button>
            <Link
              to={`/interview-questions/${currentSubject}`}
              className="mqb-action-pill-btn"
            >
              Back to Catalog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!currentQ) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p>No questions available for practice.</p>
        <Link to="/interview-questions" className="mqb-action-pill-btn primary">Back to Master Bank</Link>
      </div>
    )
  }

  return (
    <div className="mqb-practice-container" id="practice-drill-container">
      {/* Breadcrumb & Progress */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div className="mqb-breadcrumb" style={{ margin: 0 }}>
          <Link to="/interview-questions">Master Bank</Link>
          <span>/</span>
          <Link to={`/interview-questions/${currentSubject}`}>{currentSubject.toUpperCase()}</Link>
          <span>/</span>
          <span>Practice Drill</span>
        </div>
        <span style={{ fontSize: '0.9rem', color: 'var(--mqb-text-secondary)', fontWeight: 600 }}>
          Card {currentIndex + 1} of {questions.length}
        </span>
      </div>

      {/* Fresher & Difficulty Mode Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', background: 'var(--mqb-bg-glass)', border: '1px solid var(--mqb-border)', borderRadius: '12px', padding: '0.6rem 1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--mqb-text-muted)', fontWeight: 700 }}>LEVEL:</span>
          <button
            type="button"
            className="mqb-action-pill-btn"
            id="drill-easy-fresher-btn"
            onClick={() => setDrillDifficulty('EASY')}
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.8rem',
              background: drillDifficulty === 'EASY' ? '#10b981' : 'rgba(16,185,129,0.12)',
              color: drillDifficulty === 'EASY' ? '#fff' : '#34d399',
              border: '1px solid rgba(16,185,129,0.4)',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            🌱 Fresher / Easy (1–400)
          </button>
          <button
            type="button"
            className="mqb-action-pill-btn"
            onClick={() => setDrillDifficulty('ALL')}
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.8rem',
              background: drillDifficulty === 'ALL' ? 'rgba(56,189,248,0.2)' : 'transparent',
              color: drillDifficulty === 'ALL' ? '#38bdf8' : 'var(--mqb-text-secondary)',
              cursor: 'pointer',
            }}
          >
            ⚡ All Levels
          </button>
          <button
            type="button"
            className="mqb-action-pill-btn"
            onClick={() => setDrillDifficulty('DIFFICULT')}
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.8rem',
              background: drillDifficulty === 'DIFFICULT' ? 'rgba(244,63,94,0.2)' : 'transparent',
              color: drillDifficulty === 'DIFFICULT' ? '#f87171' : 'var(--mqb-text-secondary)',
              cursor: 'pointer',
            }}
          >
            🔥 Difficult Only
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <select
            className="mqb-filter-select"
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
            value={selectedCompany}
            onChange={e => setSelectedCompany(e.target.value)}
          >
            <option value="ALL">All Companies</option>
            <option value="Google">Google</option>
            <option value="Meta">Meta</option>
            <option value="Amazon">Amazon</option>
            <option value="Microsoft">Microsoft</option>
            <option value="Netflix">Netflix</option>
            <option value="Apple">Apple</option>
          </select>

          <button
            type="button"
            className="mqb-action-pill-btn"
            onClick={() => setHighFreqOnly(!highFreqOnly)}
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.8rem',
              background: highFreqOnly ? 'rgba(245,158,11,0.2)' : 'transparent',
              color: highFreqOnly ? '#fbbf24' : 'var(--mqb-text-secondary)',
              border: highFreqOnly ? '1px solid rgba(245,158,11,0.5)' : '1px solid var(--mqb-border)',
              fontWeight: 700,
            }}
          >
            {highFreqOnly ? '🔥 High Freq (Active)' : '🔥 Top Asked'}
          </button>
        </div>
      </div>

      {/* Flashcard Component */}
      <div className="mqb-flashcard" id="practice-flashcard">
        <div>
          <div className="mqb-flashcard-header">
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className="mqb-qcard-id">{currentQ.id.toUpperCase()}</span>
              <span className={`mqb-diff-pill ${currentQ.difficulty}`}>{currentQ.difficulty}</span>
              <span className="mqb-type-pill">{currentQ.questionType}</span>
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--mqb-text-muted)' }}>{currentQ.topic}</span>
          </div>

          <h2 className="mqb-flashcard-q">{currentQ.question}</h2>

          {!isAnswerRevealed ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px dashed var(--mqb-border)' }}>
              <p style={{ color: 'var(--mqb-text-secondary)', marginBottom: '1.25rem' }}>
                Formulate your answer mentally or speak it aloud before flipping.
              </p>
              <button
                type="button"
                className="mqb-action-pill-btn primary"
                id="reveal-answer-btn"
                style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}
                onClick={() => setIsAnswerRevealed(true)}
              >
                👁️ Reveal Model Answer
              </button>
            </div>
          ) : (
            <div className="mqb-flashcard-answer-revealed" id="revealed-answer-box">
              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--mqb-accent-blue)', fontWeight: 700 }}>
                  Short Summary:
                </span>
                <p style={{ margin: '0.3rem 0 0', color: 'var(--mqb-text-primary)', lineHeight: 1.6 }}>
                  {currentQ.shortAnswer}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#a78bfa', fontWeight: 700 }}>
                  Spoken Interview Script:
                </span>
                <p style={{ margin: '0.3rem 0 0', color: 'var(--mqb-text-secondary)', fontStyle: 'italic', lineHeight: 1.6 }}>
                  "{currentQ.interviewAnswer}"
                </p>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--mqb-border)' }}>
                <Link
                  to={`/interview-questions/${currentSubject}/${currentQ.id}`}
                  target="_blank"
                  style={{ color: 'var(--mqb-accent-blue)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}
                >
                  Inspect Full 13-Section Deep Dive ↗
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Action Rating Buttons */}
        {isAnswerRevealed && (
          <div>
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--mqb-text-muted)', marginBottom: '0.75rem' }}>
              How well did you recall and explain this concept?
            </p>
            <div className="mqb-confidence-ratings">
              <button
                type="button"
                className="mqb-conf-btn hard"
                onClick={() => handleRate('hard')}
              >
                🔴 Difficult (Repeat Soon)
              </button>
              <button
                type="button"
                className="mqb-conf-btn good"
                onClick={() => handleRate('good')}
              >
                🟡 Good (Reviewed)
              </button>
              <button
                type="button"
                className="mqb-conf-btn easy"
                onClick={() => handleRate('easy')}
              >
                🟢 Easy (Mastered)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
