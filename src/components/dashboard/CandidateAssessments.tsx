import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCandidateAssessments, useStartAttempt } from '../../features/assessment-engine'
import type { CandidateAssessmentView, AssessmentStatus } from '../../features/assessment-engine'
import './CandidateAssessments.css'

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  READY: 'Ready',
  PUBLISHED: 'Published',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  ARCHIVED: 'Archived',
}

const ATTEMPT_STATUS_LABELS: Record<string, string> = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  PAUSED: 'Paused',
  SUBMITTED: 'Submitted',
  AUTO_SUBMITTED: 'Auto Submitted',
  EXPIRED: 'Expired',
  TERMINATED: 'Terminated',
  EVALUATED: 'Evaluated',
}

const TYPE_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  'machine-coding': 'Machine Coding',
  dsa: 'DSA / LeetCode',
  'core-programming': 'Core Programming',
}

type TabKey = 'assigned' | 'upcoming' | 'in_progress' | 'completed' | 'expired'

export default function CandidateAssessments() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<TabKey>('assigned')
  const { data: assessments, isLoading, error } = useCandidateAssessments(user?.id || '')
  const startMutation = useStartAttempt()

  const [startingId, setStartingId] = useState<string | null>(null)

  const handleStart = useCallback(async (assessmentId: string) => {
    setStartingId(assessmentId)
    try {
      const result = await startMutation.mutateAsync(assessmentId)
      const assessment = result.assessment
      const routeMap: Record<string, string> = {
        frontend: '/frontend-javascript',
        'machine-coding': '/machine-coding',
        dsa: '/dsa',
        'core-programming': '/core-programming',
      }
      const route = routeMap[assessment.assessment_type] || '/frontend-javascript'
      window.location.href = `${route}?assessment_id=${assessment.id}&attempt_id=${result.attempt.id}`
    } catch (err: any) {
      alert(err.message || 'Failed to start assessment')
    } finally {
      setStartingId(null)
    }
  }, [startMutation])

  const handleContinue = useCallback((assessmentId: string, attemptId: string) => {
    const view = assessments?.find((a) => a.assessment.id === assessmentId)
    if (!view) return
    const routeMap: Record<string, string> = {
      frontend: '/frontend-javascript',
      'machine-coding': '/machine-coding',
      dsa: '/dsa',
      'core-programming': '/core-programming',
    }
    const route = routeMap[view.assessment.assessment_type] || '/frontend-javascript'
    window.location.href = `${route}?assessment_id=${assessmentId}&attempt_id=${attemptId}`
  }, [assessments])

  if (isLoading) return <div className="candidate-assessments-loading">Loading your assessments...</div>
  if (error) return <div className="candidate-assessments-error">Error loading assessments</div>
  if (!assessments || assessments.length === 0) {
    return (
      <div className="candidate-assessments-empty">
        <h2>My Assessments</h2>
        <p>No assessments have been assigned to you yet.</p>
      </div>
    )
  }

  const now = new Date()
  const categorized = {
    assigned: assessments.filter((a) => {
      if (!a.attempt) return true
      return a.attempt.status === 'NOT_STARTED' || a.attempt.status === 'IN_PROGRESS' || a.attempt.status === 'PAUSED'
    }),
    upcoming: assessments.filter((a) => {
      if (!a.assessment.start_at) return false
      return new Date(a.assessment.start_at) > now && !a.attempt
    }),
    in_progress: assessments.filter((a) => a.attempt?.status === 'IN_PROGRESS' || a.attempt?.status === 'PAUSED'),
    completed: assessments.filter((a) =>
      a.attempt?.status === 'SUBMITTED' || a.attempt?.status === 'AUTO_SUBMITTED' || a.attempt?.status === 'EVALUATED'
    ),
    expired: assessments.filter((a) => {
      if (!a.assessment.end_at) return false
      return new Date(a.assessment.end_at) < now && !a.attempt
    }),
  }

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: 'assigned', label: 'Assigned', count: categorized.assigned.length },
    { key: 'upcoming', label: 'Upcoming', count: categorized.upcoming.length },
    { key: 'in_progress', label: 'In Progress', count: categorized.in_progress.length },
    { key: 'completed', label: 'Completed', count: categorized.completed.length },
    { key: 'expired', label: 'Expired', count: categorized.expired.length },
  ]

  const currentList = categorized[activeTab]

  return (
    <div className="candidate-assessments">
      <h2>My Assessments</h2>

      <div className="candidate-assessments-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`candidate-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {currentList.length === 0 ? (
        <div className="candidate-assessments-empty-list">
          <p>No {activeTab.replace('_', ' ')} assessments.</p>
        </div>
      ) : (
        <div className="candidate-assessments-grid">
          {currentList.map((view) => (
            <AssessmentCard
              key={view.assessment.id}
              view={view}
              onStart={handleStart}
              onContinue={handleContinue}
              isStarting={startingId === view.assessment.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function AssessmentCard({
  view,
  onStart,
  onContinue,
  isStarting,
}: {
  view: CandidateAssessmentView
  onStart: (id: string) => void
  onContinue: (assessmentId: string, attemptId: string) => void
  isStarting: boolean
}) {
  const { assessment, attempt, result, question_count, answered_count } = view
  const progress = question_count > 0 ? Math.round((answered_count / question_count) * 100) : 0

  const canStart = !attempt || attempt.status === 'NOT_STARTED'
  const canContinue = attempt?.status === 'IN_PROGRESS' || attempt?.status === 'PAUSED'
  const isCompleted = attempt?.status === 'SUBMITTED' || attempt?.status === 'AUTO_SUBMITTED' || attempt?.status === 'EVALUATED'

  return (
    <div className="candidate-assessment-card">
      <div className="candidate-assessment-header">
        <h3>{assessment.title}</h3>
        <span className="candidate-assessment-type">{TYPE_LABELS[assessment.assessment_type]}</span>
      </div>

      <div className="candidate-assessment-meta">
        <span>{question_count} Questions</span>
        <span>{assessment.duration_minutes} Minutes</span>
        <span>{assessment.total_marks} Marks</span>
        {attempt && <span>Attempt {attempt.attempt_number} of {assessment.maximum_attempts}</span>}
      </div>

      {assessment.start_at && (
        <div className="candidate-assessment-schedule">
          <span>Starts: {new Date(assessment.start_at).toLocaleString()}</span>
        </div>
      )}
      {assessment.end_at && (
        <div className="candidate-assessment-schedule">
          <span>Due: {new Date(assessment.end_at).toLocaleString()}</span>
        </div>
      )}

      {attempt && (
        <div className="candidate-assessment-status">
          Status: {ATTEMPT_STATUS_LABELS[attempt.status] || attempt.status}
        </div>
      )}

      {canContinue && question_count > 0 && (
        <div className="candidate-assessment-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span>{answered_count} / {question_count} Answered ({progress}%)</span>
        </div>
      )}

      {result && assessment.show_score && (
        <div className="candidate-assessment-result">
          <span>Score: {result.obtained_marks} / {result.total_marks}</span>
          {assessment.show_percentage && <span>({result.percentage}%)</span>}
          {assessment.show_pass_fail && (
            <span className={`result-badge ${result.passed ? 'pass' : 'fail'}`}>
              {result.result}
            </span>
          )}
        </div>
      )}

      <div className="candidate-assessment-actions">
        {canStart && (
          <button className="btn btn-primary" onClick={() => onStart(assessment.id)} disabled={isStarting}>
            {isStarting ? 'Starting...' : 'Start Assessment'}
          </button>
        )}
        {canContinue && (
          <button className="btn btn-primary" onClick={() => onContinue(assessment.id, attempt!.id)}>
            Continue
          </button>
        )}
        {isCompleted && (
          <span className="candidate-assessment-completed">Completed</span>
        )}
      </div>
    </div>
  )
}
