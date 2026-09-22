import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { interviewQuestionsDataService } from '../services/interviewQuestionsDataService'
import { interviewQuestionsProgressService } from '../services/interviewQuestionsProgressService'
import { sanitizeForSpeech, getStoredSpeechRate } from '../utils/speechSanitizer'
import type { MasterSubjectId, MasterQuestion, MasterBankCatalog } from '../types/interviewQuestions.types'

export default function MockTestStudio() {
  const { subject: urlSubject } = useParams<{ subject?: string }>()
  const initialSubject = (urlSubject?.toLowerCase() || 'all') as MasterSubjectId | 'all'

  // Catalog
  const [catalog, setCatalog] = useState<MasterBankCatalog | null>(null)

  // Test setup
  const [selectedSubject, setSelectedSubject] = useState<MasterSubjectId | 'all'>(initialSubject)
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL')
  const [selectedType, setSelectedType] = useState<string>('ALL') // ALL | MCQ | CONCEPTUAL
  const [testDifficulty, setTestDifficulty] = useState<string>('EASY')
  const [selectedCompany, setSelectedCompany] = useState<string>('ALL')
  const [highFreqOnly, setHighFreqOnly] = useState<boolean>(false)
  const [questionCount, setQuestionCount] = useState<number>(10)
  const [isTestActive, setIsTestActive] = useState<boolean>(false)
  const [isTestFinished, setIsTestFinished] = useState<boolean>(false)
  const [isLoadingTest, setIsLoadingTest] = useState<boolean>(false)

  // In-test state
  const [testQuestions, setTestQuestions] = useState<MasterQuestion[]>([])
  const [currentQIndex, setCurrentQIndex] = useState<number>(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, 'correct' | 'incorrect' | 'skipped'>>({})
  const [selectedMcqOption, setSelectedMcqOption] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState<boolean>(false)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(600)
  const [isSpeechPlaying, setIsSpeechPlaying] = useState<boolean>(false)
  const timerRef = useRef<any>(null)

  useEffect(() => {
    interviewQuestionsDataService.getCatalog().then(cat => {
      setCatalog(cat)
    }).catch(err => console.error('Failed to load catalog:', err))
  }, [])

  // Topics for selected subject
  const currentSubjectMeta = catalog?.subjects.find(s => s.id === selectedSubject)
  const availableTopics = currentSubjectMeta?.topics || []

  // Start the test
  const handleStartTest = async () => {
    try {
      setIsLoadingTest(true)
      const set = await interviewQuestionsDataService.getRandomPracticeSet(
        selectedSubject,
        questionCount,
        {
          difficulty: testDifficulty,
          companyTag: selectedCompany,
          highFreqOnly,
          questionType: selectedType,
          topic: selectedTopic,
        }
      )

      if (!set || set.length === 0) {
        alert('No questions matched the selected criteria. Try adjusting the difficulty or question type.')
        return
      }

      setTestQuestions(set)
      setCurrentQIndex(0)
      setUserAnswers({})
      setSelectedMcqOption(null)
      setShowExplanation(false)
      setSecondsRemaining(set.length * 60) // 1 minute per question
      setIsTestActive(true)
      setIsTestFinished(false)
    } catch (err) {
      console.error('Failed to start test:', err)
      alert('Unable to assemble test questions. Please check connection and try again.')
    } finally {
      setIsLoadingTest(false)
    }
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
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    setIsSpeechPlaying(false)
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
    advanceNext()
  }

  const handleSelectMCQ = (optionKey: string) => {
    if (selectedMcqOption) return // already answered this question
    setSelectedMcqOption(optionKey)
    setShowExplanation(true)

    const q = testQuestions[currentQIndex]
    const isCorrect = q.correctAnswer ? (optionKey.toUpperCase() === q.correctAnswer.toUpperCase()) : optionKey === 'A'
    setUserAnswers(prev => ({ ...prev, [currentQIndex]: isCorrect ? 'correct' : 'incorrect' }))
  }

  const advanceNext = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    setIsSpeechPlaying(false)
    setSelectedMcqOption(null)
    setShowExplanation(false)

    if (currentQIndex + 1 < testQuestions.length) {
      setCurrentQIndex(i => i + 1)
    } else {
      handleFinishTest()
    }
  }

  const handleToggleTTS = (textToRead: string) => {
    if (!('speechSynthesis' in window)) return
    if (isSpeechPlaying) {
      window.speechSynthesis.cancel()
      setIsSpeechPlaying(false)
      return
    }

    const clean = sanitizeForSpeech(textToRead)
    const utterance = new SpeechSynthesisUtterance(clean)
    utterance.rate = getStoredSpeechRate()
    utterance.onend = () => setIsSpeechPlaying(false)
    utterance.onerror = () => setIsSpeechPlaying(false)

    const voices = window.speechSynthesis.getVoices()
    const indianVoice = voices.find(v => v.lang === 'en-IN' || v.name.toLowerCase().includes('india'))
    if (indianVoice) utterance.voice = indianVoice

    window.speechSynthesis.speak(utterance)
    setIsSpeechPlaying(true)
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
              Universal Timed Mock Interview Test
            </h1>
            <p style={{ color: 'var(--mqb-text-secondary)', maxWidth: 540, margin: '0 auto' }}>
              Simulate an authentic FAANG/Tier-1 frontend interview evaluation under realistic countdown timers across all 33 tracks.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Subject Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--mqb-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                1. Select Subject Track (33 Available)
              </label>
              <select
                className="mqb-filter-select"
                style={{ width: '100%', padding: '0.75rem' }}
                value={selectedSubject}
                onChange={e => {
                  setSelectedSubject(e.target.value as any)
                  setSelectedTopic('ALL')
                }}
              >
                <option value="all">🌟 Comprehensive Mixed Assessment (All 33 Subjects)</option>
                {catalog?.subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.icon} {s.name} ({s.badge})
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Topic Filter if Subject Selected */}
            {selectedSubject !== 'all' && availableTopics.length > 0 && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--mqb-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  2. Select Specific Topic (Optional)
                </label>
                <select
                  className="mqb-filter-select"
                  style={{ width: '100%', padding: '0.75rem' }}
                  value={selectedTopic}
                  onChange={e => setSelectedTopic(e.target.value)}
                >
                  <option value="ALL">All Topics for {currentSubjectMeta?.name}</option>
                  {availableTopics.map(top => (
                    <option key={top} value={top}>
                      📌 {top}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Question Type Preset */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--mqb-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                3. Question Format Type
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                <button
                  type="button"
                  className={`mqb-action-pill-btn ${selectedType === 'ALL' ? 'primary' : ''}`}
                  onClick={() => setSelectedType('ALL')}
                  style={{ justifyContent: 'center', padding: '0.65rem' }}
                >
                  ⚖️ Mixed (MCQ + Concept)
                </button>
                <button
                  type="button"
                  className={`mqb-action-pill-btn ${selectedType === 'MCQ' ? 'primary' : ''}`}
                  onClick={() => setSelectedType('MCQ')}
                  style={{ justifyContent: 'center', padding: '0.65rem' }}
                >
                  ⚡ Interactive MCQs Only
                </button>
                <button
                  type="button"
                  className={`mqb-action-pill-btn ${selectedType === 'CONCEPTUAL' ? 'primary' : ''}`}
                  onClick={() => setSelectedType('CONCEPTUAL')}
                  style={{ justifyContent: 'center', padding: '0.65rem' }}
                >
                  📖 Long-Form Concepts
                </button>
              </div>
            </div>

            {/* Assessment Difficulty Preset */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--mqb-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                4. Difficulty Level
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
                  🌱 Easy / Fresher
                </button>

                <button
                  type="button"
                  id="test-diff-med-intermediate-btn"
                  className={`mqb-action-pill-btn ${testDifficulty === 'INTERMEDIATE' ? 'primary' : ''}`}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    justifyContent: 'center',
                    background: testDifficulty === 'INTERMEDIATE' ? '#f59e0b' : 'rgba(245,158,11,0.12)',
                    borderColor: 'rgba(245,158,11,0.4)',
                    color: testDifficulty === 'INTERMEDIATE' ? '#fff' : '#fbbf24',
                    fontWeight: 700,
                  }}
                  onClick={() => setTestDifficulty('INTERMEDIATE')}
                >
                  ⚡ Intermediate (1-3 yrs)
                </button>

                <button
                  type="button"
                  id="test-diff-hard-difficult-btn"
                  className={`mqb-action-pill-btn ${testDifficulty === 'DIFFICULT' ? 'primary' : ''}`}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    justifyContent: 'center',
                    background: testDifficulty === 'DIFFICULT' ? '#f43f5e' : 'rgba(244,63,94,0.12)',
                    borderColor: 'rgba(244,63,94,0.4)',
                    color: testDifficulty === 'DIFFICULT' ? '#fff' : '#fb7185',
                    fontWeight: 700,
                  }}
                  onClick={() => setTestDifficulty('DIFFICULT')}
                >
                  🔥 Senior / Difficult (3+ yrs)
                </button>
              </div>
            </div>

            {/* Target Tech Giant Preset */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--mqb-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                5. Company Question Pool
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <select
                  className="mqb-filter-select"
                  style={{ padding: '0.75rem' }}
                  value={selectedCompany}
                  onChange={e => setSelectedCompany(e.target.value)}
                >
                  <option value="ALL">🌐 All Tech Companies</option>
                  <option value="Google">🏢 Google Interview Pool</option>
                  <option value="Meta">🏢 Meta (Facebook) Pool</option>
                  <option value="Amazon">🏢 Amazon Pool</option>
                  <option value="Microsoft">🏢 Microsoft Pool</option>
                  <option value="Netflix">🏢 Netflix Pool</option>
                  <option value="Apple">🏢 Apple Pool</option>
                </select>

                <button
                  type="button"
                  className="mqb-action-pill-btn"
                  onClick={() => setHighFreqOnly(!highFreqOnly)}
                  style={{
                    padding: '0.75rem',
                    justifyContent: 'center',
                    background: highFreqOnly ? 'rgba(245,158,11,0.2)' : 'var(--mqb-input-bg)',
                    color: highFreqOnly ? '#fbbf24' : 'var(--mqb-text-secondary)',
                    border: highFreqOnly ? '1px solid rgba(245,158,11,0.5)' : '1px solid var(--mqb-border)',
                    fontWeight: 700,
                  }}
                >
                  {highFreqOnly ? '🔥 High-Frequency Active' : '🔥 Target High-Frequency'}
                </button>
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--mqb-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                6. Number of Questions
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
            disabled={isLoadingTest}
          >
            {isLoadingTest ? '⏳ Assembling Real-Time Test Questions...' : '🚀 Launch Assessment Timer'}
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
              {correctCount} out of {total} questions mastered in {formatTimer((questionCount * 60) - secondsRemaining)}
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
                      <div style={{ fontSize: '0.75rem', color: 'var(--mqb-text-muted)' }}>{q.subject.toUpperCase()} • {q.topic}</div>
                    </div>
                  </div>
                  <Link
                    to={`/interview-questions/${q.subject}/${q.id}`}
                    target="_blank"
                    style={{ fontSize: '0.75rem', color: '#38bdf8', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}
                  >
                    View Studio ↗
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

  const isMCQ = (Array.isArray(currentQ.options) && currentQ.options.length > 0) || currentQ.questionType === 'MCQ' || currentQ.question_type === 'mcq'
  const isAnswered = selectedMcqOption !== null || userAnswers[currentQIndex] !== undefined

  return (
    <div className="mqb-practice-container" id="active-mock-test" style={{ padding: '2rem 1rem' }}>
      {/* Test Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', background: 'var(--mqb-bg-glass)', border: '1px solid var(--mqb-border)', borderRadius: '14px', padding: '0.85rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontWeight: 700, color: 'var(--mqb-text-primary)' }}>
            Question {currentQIndex + 1} of {testQuestions.length}
          </span>
          <span className={`mqb-diff-pill ${currentQ.difficulty}`}>{currentQ.difficulty}</span>
          <span className="mqb-sc-badge" style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8' }}>
            {currentQ.subject.toUpperCase()}
          </span>
        </div>

        {/* Countdown Timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--mqb-font-mono)', fontSize: '1.2rem', fontWeight: 800, color: secondsRemaining < 120 ? '#f87171' : '#38bdf8' }}>
          <span>⏱️</span>
          <span>{formatTimer(secondsRemaining)}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="mqb-action-pill-btn"
            style={{ fontSize: '0.8rem' }}
            onClick={() => handleToggleTTS(currentQ.question + '. ' + (currentQ.shortAnswer || ''))}
            aria-label="Read question aloud"
          >
            {isSpeechPlaying ? '⏹ Stop Voice' : '🔊 Listen'}
          </button>

          <button
            type="button"
            className="mqb-action-pill-btn"
            style={{ fontSize: '0.8rem' }}
            onClick={handleFinishTest}
          >
            Submit Early
          </button>
        </div>
      </div>

      {/* Test Question Card */}
      <div className="mqb-flashcard">
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--mqb-text-muted)', marginBottom: '0.5rem' }}>
            {currentQ.topic} • {currentQ.subtopic || currentQ.concept}
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.45, color: 'var(--mqb-text-primary)', margin: '0 0 1.5rem' }}>
            {currentQ.question}
          </h2>

          {/* Interactive MCQ Option Grid */}
          {isMCQ && currentQ.options && currentQ.options.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {currentQ.options.map((opt, optIdx) => {
                const optKey = typeof opt === 'string' ? String.fromCharCode(65 + optIdx) : opt.key
                const optText = typeof opt === 'string' ? opt : opt.text
                const isSelected = selectedMcqOption === optKey
                const isCorrect = currentQ.correctAnswer ? (optKey.toUpperCase() === currentQ.correctAnswer.toUpperCase()) : optKey === 'A'
                let optBg = 'var(--mqb-bg-card)'
                let optBorder = 'var(--mqb-border)'
                let optColor = 'var(--mqb-text-primary)'

                if (selectedMcqOption) {
                  if (isSelected && isCorrect) {
                    optBg = 'rgba(16, 185, 129, 0.2)'
                    optBorder = '#10b981'
                    optColor = '#34d399'
                  } else if (isSelected && !isCorrect) {
                    optBg = 'rgba(239, 68, 68, 0.2)'
                    optBorder = '#ef4444'
                    optColor = '#f87171'
                  } else if (isCorrect) {
                    optBg = 'rgba(16, 185, 129, 0.12)'
                    optBorder = '#10b981'
                  }
                }

                return (
                  <button
                    key={optKey}
                    type="button"
                    disabled={selectedMcqOption !== null}
                    onClick={() => handleSelectMCQ(optKey)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      padding: '0.9rem 1.1rem',
                      borderRadius: '10px',
                      background: optBg,
                      border: `1px solid ${optBorder}`,
                      color: optColor,
                      cursor: selectedMcqOption ? 'default' : 'pointer',
                      textAlign: 'left',
                      fontSize: '0.92rem',
                      transition: 'all 0.15s ease',
                      width: '100%',
                    }}
                  >
                    <span style={{
                      fontWeight: 800,
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255,255,255,0.08)',
                      flexShrink: 0
                    }}>
                      {optKey}
                    </span>
                    <span style={{ flex: 1 }}>{optText}</span>
                    {selectedMcqOption && isCorrect && <span style={{ color: '#10b981', fontWeight: 800 }}>✓ Correct</span>}
                    {selectedMcqOption && isSelected && !isCorrect && <span style={{ color: '#ef4444', fontWeight: 800 }}>✕ Incorrect</span>}
                  </button>
                )
              })}

              {/* Instant Explanation Box */}
              {showExplanation && (
                <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '10px', padding: '1rem', marginTop: '0.5rem' }}>
                  <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
                    💡 Explanation:
                  </div>
                  <div style={{ color: 'var(--mqb-text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    {currentQ.mcqExplanation || currentQ.shortAnswer || 'This option strictly aligns with web platform standards.'}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Conceptual Long-form View */
            <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--mqb-border)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <p style={{ color: 'var(--mqb-text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1rem' }}>
                Formulate your answer mentally or verbally. Once ready, reveal the model interview answer and self-evaluate.
              </p>

              {showExplanation ? (
                <div style={{ borderTop: '1px solid var(--mqb-border)', paddingTop: '1rem' }}>
                  <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '0.4rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    Model Interview Answer:
                  </div>
                  <div style={{ color: 'var(--mqb-text-primary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                    {currentQ.shortAnswer}
                  </div>
                  {currentQ.codeExample && (
                    <pre style={{ background: '#090d16', padding: '0.85rem', borderRadius: '8px', overflowX: 'auto', fontSize: '0.82rem', color: '#e2e8f0', margin: 0 }}>
                      <code>{currentQ.codeExample}</code>
                    </pre>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  className="mqb-action-pill-btn"
                  onClick={() => setShowExplanation(true)}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  👁️ Reveal Model Answer
                </button>
              )}
            </div>
          )}
        </div>

        {/* Navigation Action Buttons */}
        <div style={{ borderTop: '1px solid var(--mqb-border)', paddingTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
          {isMCQ ? (
            <div style={{ display: 'flex', gap: '0.75rem', width: '100%', justifyContent: 'space-between' }}>
              <button
                type="button"
                className="mqb-action-pill-btn"
                onClick={() => markAnswer('skipped')}
              >
                ⏭️ Skip Question
              </button>

              <button
                type="button"
                className="mqb-action-pill-btn primary"
                onClick={advanceNext}
                disabled={!isAnswered}
                style={{ opacity: isAnswered ? 1 : 0.6 }}
              >
                {currentQIndex + 1 === testQuestions.length ? '🏁 Finish Test' : 'Next Question →'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="mqb-action-pill-btn"
                onClick={() => markAnswer('skipped')}
              >
                ⏭️ Skip
              </button>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="mqb-action-pill-btn"
                  style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}
                  onClick={() => markAnswer('incorrect')}
                >
                  ✕ Incorrect
                </button>
                <button
                  type="button"
                  className="mqb-action-pill-btn"
                  style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#34d399' }}
                  onClick={() => markAnswer('correct')}
                >
                  ✓ Mastered
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
