import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase/client'
import { useSaveAnswer, useSubmitAttempt, useAutoSubmitAttempt, usePauseAttempt, useResumeAttempt } from '../../features/assessment-engine'
import type { Assessment, AssessmentAttempt, AttemptQuestion, AttemptAnswer, AssessmentQuestion } from '../../features/assessment-engine'
import './AssessmentRunner.css'

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export default function AssessmentRunner() {
  const [searchParams] = useSearchParams()
  const assessmentId = searchParams.get('assessment_id')
  const attemptId = searchParams.get('attempt_id')

  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null)
  const [questions, setQuestions] = useState<AttemptQuestion[]>([])
  const [answers, setAnswers] = useState<AttemptAnswer[]>([])
  const [assessmentQuestions, setAssessmentQuestions] = useState<AssessmentQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showNavigator, setShowNavigator] = useState(false)

  const saveMutation = useSaveAnswer()
  const submitMutation = useSubmitAttempt()
  const autoSubmitMutation = useAutoSubmitAttempt()
  const pauseMutation = usePauseAttempt()
  const resumeMutation = useResumeAttempt()

  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!assessmentId || !attemptId) {
      setError('Missing assessment or attempt ID')
      setLoading(false)
      return
    }

    async function loadAttempt() {
      try {
        const { data: attemptData, error: attError } = await supabase
          .from('assessment_attempts')
          .select('*')
          .eq('id', attemptId)
          .single()
        if (attError) throw attError
        setAttempt(attemptData)

        const { data: assessmentData, error: assessError } = await supabase
          .from('assessments')
          .select('*')
          .eq('id', assessmentId)
          .single()
        if (assessError) throw assessError
        setAssessment(assessmentData)

        const { data: aqData, error: aqError } = await supabase
          .from('assessment_questions')
          .select('*')
          .eq('assessment_id', assessmentId)
          .order('question_order', { ascending: true })
        if (aqError) throw aqError
        setAssessmentQuestions(aqData || [])

        const { data: tqData, error: tqError } = await supabase
          .from('attempt_questions')
          .select('*')
          .eq('attempt_id', attemptId)
          .order('question_order', { ascending: true })
        if (tqError) throw tqError
        setQuestions(tqData || [])

        const { data: ansData, error: ansError } = await supabase
          .from('attempt_answers')
          .select('*')
          .eq('attempt_id', attemptId)
        if (ansError) throw ansError
        setAnswers(ansData || [])

        if (attemptData.expires_at) {
          const remaining = new Date(attemptData.expires_at).getTime() - Date.now()
          setTimeRemaining(Math.max(0, remaining))
        }

        setLoading(false)
      } catch (err: any) {
        setError(err.message || 'Failed to load assessment')
        setLoading(false)
      }
    }

    loadAttempt()
  }, [assessmentId, attemptId])

  useEffect(() => {
    if (!attempt || attempt.status !== 'IN_PROGRESS') return

    timerRef.current = setInterval(() => {
      if (attempt.expires_at) {
        const remaining = new Date(attempt.expires_at).getTime() - Date.now()
        setTimeRemaining(Math.max(0, remaining))

        if (remaining <= 0) {
          handleAutoSubmit()
        }
      }
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [attempt?.status, attempt?.expires_at])

  const handleAutoSubmit = useCallback(async () => {
    if (!attemptId || submitting) return
    setSubmitting(true)
    try {
      await autoSubmitMutation.mutateAsync(attemptId)
      window.location.href = '/dashboard?tab=assessments'
    } catch (err: any) {
      setError(err.message || 'Auto-submit failed')
      setSubmitting(false)
    }
  }, [attemptId, submitting, autoSubmitMutation])

  const currentQuestion = questions[currentIndex]
  const currentAnswer = answers.find((a) => a.attempt_question_id === currentQuestion?.id)
  const currentAssessmentQuestion = assessmentQuestions.find((aq) => aq.id === currentQuestion?.assessment_question_id)

  const handleAnswerChange = useCallback((field: string, value: any) => {
    if (!currentQuestion) return

    setAnswers((prev) => {
      const existing = prev.find((a) => a.attempt_question_id === currentQuestion.id)
      if (existing) {
        return prev.map((a) =>
          a.attempt_question_id === currentQuestion.id ? { ...a, [field]: value } : a
        )
      }
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          attempt_id: attemptId!,
          attempt_question_id: currentQuestion.id,
          answer_text: field === 'answer_text' ? value : null,
          selected_options: field === 'selected_options' ? value : [],
          code: field === 'code' ? value : null,
          language: field === 'language' ? value : 'javascript',
          test_status: null,
          score: 0,
          is_correct: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]
    })

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)
    autoSaveTimerRef.current = setTimeout(() => {
      handleAutoSave()
    }, 1000)
  }, [currentQuestion, attemptId])

  const handleAutoSave = useCallback(async () => {
    if (!currentQuestion || !attemptId) return

    const answer = answers.find((a) => a.attempt_question_id === currentQuestion.id)
    if (!answer) return

    try {
      await saveMutation.mutateAsync({
        attemptId,
        input: {
          attempt_question_id: currentQuestion.id,
          answer_text: answer.answer_text || undefined,
          selected_options: answer.selected_options?.length ? answer.selected_options : undefined,
          code: answer.code || undefined,
          language: answer.language,
        },
      })
    } catch (err) {
      // Silent fail for autosave - will retry on next change
    }
  }, [currentQuestion, attemptId, answers, saveMutation])

  const handleMarkReview = useCallback(async () => {
    if (!currentQuestion || !attemptId) return
    const newMarked = !currentQuestion.marked_for_review
    setQuestions((prev) =>
      prev.map((q) => (q.id === currentQuestion.id ? { ...q, marked_for_review: newMarked } : q))
    )
    try {
      await supabase
        .from('attempt_questions')
        .update({ marked_for_review: newMarked, updated_at: new Date().toISOString() })
        .eq('id', currentQuestion.id)
    } catch (err) {
      // Silent fail
    }
  }, [currentQuestion, attemptId])

  const handleSubmit = useCallback(async () => {
    if (!attemptId || submitting) return
    if (!confirm('Are you sure you want to submit? You cannot change your answers after submission.')) return

    setSubmitting(true)
    try {
      await submitMutation.mutateAsync(attemptId)
      window.location.href = '/dashboard?tab=assessments'
    } catch (err: any) {
      setError(err.message || 'Submit failed')
      setSubmitting(false)
    }
  }, [attemptId, submitting, submitMutation])

  const handlePause = useCallback(async () => {
    if (!attemptId) return
    try {
      await pauseMutation.mutateAsync(attemptId)
      setAttempt((prev) => prev ? { ...prev, status: 'PAUSED' } : null)
    } catch (err: any) {
      setError(err.message || 'Pause failed')
    }
  }, [attemptId, pauseMutation])

  const handleResume = useCallback(async () => {
    if (!attemptId) return
    try {
      await resumeMutation.mutateAsync(attemptId)
      setAttempt((prev) => prev ? { ...prev, status: 'IN_PROGRESS' } : null)
    } catch (err: any) {
      setError(err.message || 'Resume failed')
    }
  }, [attemptId, resumeMutation])

  const navigateTo = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index)
    }
  }, [questions.length])

  if (loading) return <div className="assessment-runner-loading">Loading assessment...</div>
  if (error) return <div className="assessment-runner-error">{error}</div>
  if (!assessment || !attempt) return <div className="assessment-runner-error">Assessment not found</div>

  const isPaused = attempt.status === 'PAUSED'
  const isSubmitted = attempt.status === 'SUBMITTED' || attempt.status === 'AUTO_SUBMITTED' || attempt.status === 'EVALUATED'
  const warningThreshold = 5 * 60 * 1000
  const dangerThreshold = 1 * 60 * 1000

  return (
    <div className="assessment-runner">
      <div className="assessment-runner-header">
        <div className="assessment-runner-info">
          <h2>{assessment.title}</h2>
          <span className="assessment-runner-attempt">
            Attempt {attempt.attempt_number} of {assessment.maximum_attempts}
          </span>
        </div>
        <div className="assessment-runner-timer">
          <span className={`timer-label ${timeRemaining < dangerThreshold ? 'danger' : timeRemaining < warningThreshold ? 'warning' : ''}`}>
            Time Remaining
          </span>
          <span className={`timer-value ${timeRemaining < dangerThreshold ? 'danger' : timeRemaining < warningThreshold ? 'warning' : ''}`}>
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      <div className="assessment-runner-body">
        <div className="assessment-runner-main">
          {isSubmitted ? (
            <div className="assessment-runner-submitted">
              <h3>Assessment Submitted</h3>
              <p>Your assessment has been submitted successfully.</p>
              <a href="/dashboard?tab=assessments" className="btn btn-primary">Back to Dashboard</a>
            </div>
          ) : isPaused ? (
            <div className="assessment-runner-paused">
              <h3>Assessment Paused</h3>
              <p>Your assessment is currently paused.</p>
              <button className="btn btn-primary" onClick={handleResume}>Resume</button>
            </div>
          ) : currentQuestion && currentAssessmentQuestion ? (
            <QuestionView
              question={currentQuestion}
              assessmentQuestion={currentAssessmentQuestion}
              answer={currentAnswer}
              onAnswerChange={handleAnswerChange}
            />
          ) : (
            <div className="assessment-runner-no-questions">
              <p>No questions available for this assessment.</p>
            </div>
          )}
        </div>

        <div className="assessment-runner-sidebar">
          <div className="assessment-runner-progress">
            <h4>Progress</h4>
            <span>{questions.filter((q) => q.status === 'answered').length} / {questions.length} Answered</span>
          </div>

          <button className="btn btn-sm btn-navigator-toggle" onClick={() => setShowNavigator(!showNavigator)}>
            {showNavigator ? 'Hide' : 'Show'} Navigator
          </button>

          {showNavigator && (
            <div className="assessment-runner-navigator">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  className={`nav-item ${idx === currentIndex ? 'current' : ''} ${q.status === 'answered' ? 'answered' : ''} ${q.marked_for_review ? 'marked' : ''}`}
                  onClick={() => navigateTo(idx)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}

          <div className="assessment-runner-actions">
            <button className="btn btn-sm" onClick={() => navigateTo(currentIndex - 1)} disabled={currentIndex === 0}>
              Previous
            </button>
            <button className="btn btn-sm" onClick={() => navigateTo(currentIndex + 1)} disabled={currentIndex === questions.length - 1}>
              Next
            </button>
            <button className="btn btn-sm btn-warning" onClick={handleMarkReview}>
              {currentQuestion?.marked_for_review ? 'Unmark' : 'Mark'} Review
            </button>
            <button className="btn btn-sm" onClick={handlePause}>
              Pause
            </button>
            <button className="btn btn-sm btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuestionView({
  question,
  assessmentQuestion,
  answer,
  onAnswerChange,
}: {
  question: AttemptQuestion
  assessmentQuestion: AssessmentQuestion
  answer: AttemptAnswer | undefined
  onAnswerChange: (field: string, value: any) => void
}) {
  const snapshot = assessmentQuestion.question_snapshot as Record<string, any>
  const questionType = snapshot.templateType || snapshot.question_type || 'concept'
  const questionText = snapshot.question || snapshot.prompt || ''
  const options = snapshot.options || []
  const code = answer?.code || snapshot.code || snapshot.starter_code || ''
  const language = answer?.language || snapshot.language || 'javascript'

  return (
    <div className="question-view">
      <div className="question-header">
        <span className="question-number">Question {question.question_order + 1}</span>
        <span className="question-marks">{assessmentQuestion.marks} marks</span>
        {question.marked_for_review && <span className="question-marked">Marked for Review</span>}
      </div>

      <div className="question-content">
        <div className="question-text">{questionText}</div>

        {snapshot.example && (
          <div className="question-example">
            <strong>Example:</strong>
            <pre>{snapshot.example}</pre>
          </div>
        )}

        {questionType === 'concept' || questionType === 'mcq' ? (
          <div className="question-options">
            {options.map((opt: string, idx: number) => (
              <label key={idx} className="option-label">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={opt}
                  checked={answer?.selected_options?.[0] === opt}
                  onChange={() => onAnswerChange('selected_options', [opt])}
                />
                {opt}
              </label>
            ))}
          </div>
        ) : questionType === 'multiple_select' ? (
          <div className="question-options">
            {options.map((opt: string, idx: number) => (
              <label key={idx} className="option-label">
                <input
                  type="checkbox"
                  value={opt}
                  checked={answer?.selected_options?.includes(opt) || false}
                  onChange={(e) => {
                    const current = answer?.selected_options || []
                    if (e.target.checked) {
                      onAnswerChange('selected_options', [...current, opt])
                    } else {
                      onAnswerChange('selected_options', current.filter((o: string) => o !== opt))
                    }
                  }}
                />
                {opt}
              </label>
            ))}
          </div>
        ) : (
          <div className="question-code">
            <div className="code-editor-placeholder">
              <textarea
                value={code}
                onChange={(e) => onAnswerChange('code', e.target.value)}
                placeholder="Write your code here..."
                rows={15}
                className="code-textarea"
              />
            </div>
            <div className="code-language">
              <span>Language: {language}</span>
            </div>
          </div>
        )}

        {questionType === 'theory' || questionType === 'output_based' ? (
          <div className="question-text-answer">
            <textarea
              value={answer?.answer_text || ''}
              onChange={(e) => onAnswerChange('answer_text', e.target.value)}
              placeholder="Type your answer here..."
              rows={5}
              className="answer-textarea"
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
