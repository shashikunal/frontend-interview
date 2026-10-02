import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { usePlacement } from '../hooks/usePlacement'
import { usePlacementReadiness } from '../hooks/usePlacementReadiness'
import { PLACEMENT_DAY_DEFINITIONS } from '../data/curriculum'
import { placementApplicationsService } from '../services/placementApplications.service'
import { readLocal } from '../services/placementStorage'
import type {
  PlacementMockInterview,
  PlacementMockResult,
  PlacementJobApplication,
  PlacementProject,
  PlacementInterviewFeedback,
} from '../types/placement.types'
import { ASSESSMENTS } from './PlacementAssessments'

interface DashboardData {
  overallReadiness: number
  theoryProgress: number
  practicalProgress: number
  programmingProgress: number
  aptitudeProgress: number
  reasoningProgress: number
  interviewProgress: number
  projectProgress: number
  weakAreas: string[]
  recommendedActions: string[]
  streakDays: number
  totalPracticeTime: number
  assessmentsCompleted: number
  mockInterviewsCompleted: number
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const userId = user?.id
  const { progress, attempts, weakTopics } = usePlacement(userId)
  const { readiness } = usePlacementReadiness(userId)
  const [applications, setApplications] = useState<PlacementJobApplication[]>([])
  const [mockInterviews, setMockInterviews] = useState<PlacementMockInterview[]>([])
  const [mockResults, setMockResults] = useState<PlacementMockResult[]>([])
  const [projects, setProjects] = useState<PlacementProject[]>([])
  const [interviewFeedback, setInterviewFeedback] = useState<PlacementInterviewFeedback[]>([])
  const [assessmentHistory, setAssessmentHistory] = useState<Array<{
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
  }>>([])
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)

  useEffect(() => {
    if (!userId) return
    void placementApplicationsService.getApplications(userId).then(setApplications)
    void placementApplicationsService.getMockInterviews(userId).then(setMockInterviews)
    void placementApplicationsService.getMockResults(userId).then(setMockResults)
    void placementApplicationsService.getProjects(userId).then(setProjects)
    void placementApplicationsService.getInterviewFeedback(userId).then(setInterviewFeedback)
    setAssessmentHistory(readLocal('assessment_history', userId, []))
  }, [userId])

  useEffect(() => {
    if (!userId || !progress) return

    const totalAttempts = attempts.length
    const correctAttempts = attempts.filter((a) => a.isCorrect).length
    const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0

    const daysCompleted = progress.daysCompleted?.length ?? 0
    const totalDays = PLACEMENT_DAY_DEFINITIONS.length

    const theoryProgress = Math.round((daysCompleted / totalDays) * 100)
    const practicalProgress = Math.min(100, Math.round((totalAttempts / 100) * 100))
    const programmingProgress = Math.min(100, Math.round((correctAttempts / 50) * 100))
    const aptitudeProgress = Math.min(100, Math.round((attempts.filter((a) => a.category === 'aptitude').length / 20) * 100))
    const reasoningProgress = Math.min(100, Math.round((attempts.filter((a) => a.category === 'reasoning').length / 20) * 100))
    const interviewProgress = Math.min(100, Math.round((attempts.filter((a) => a.category === 'communication').length / 10) * 100))
    const projectProgress = applications.length > 0 ? 50 : 0

    const weakAreas = weakTopics.map((w) => w.subcategory).slice(0, 5)

    const recommendedActions: string[] = []
    if (aptitudeProgress < 60) recommendedActions.push('Practice aptitude questions')
    if (reasoningProgress < 60) recommendedActions.push('Practice reasoning questions')
    if (programmingProgress < 60) recommendedActions.push('Solve more programming problems')
    if (interviewProgress < 60) recommendedActions.push('Practice interview questions')
    if (weakAreas.length > 0) recommendedActions.push(`Review weak areas: ${weakAreas.join(', ')}`)

    const totalTime = attempts.reduce((sum, a) => sum + (a.timeSpentSeconds ?? 0), 0)

    const completedMocks = mockInterviews.filter((m) => m.status === 'completed').length

    setDashboard({
      overallReadiness: readiness?.overallScore ?? 0,
      theoryProgress,
      practicalProgress,
      programmingProgress,
      aptitudeProgress,
      reasoningProgress,
      interviewProgress,
      projectProgress,
      weakAreas,
      recommendedActions,
      streakDays: progress?.streakDays ?? 0,
      totalPracticeTime: Math.round(totalTime / 60),
      assessmentsCompleted: assessmentHistory.length,
      mockInterviewsCompleted: completedMocks,
    })
  }, [userId, progress, attempts, weakTopics, readiness, applications, mockInterviews, assessmentHistory])

  if (!dashboard) {
    return <div className="placement-empty">Loading your dashboard...</div>
  }

  const progressItems = [
    { label: 'Theory', value: dashboard.theoryProgress, color: '#6366f1' },
    { label: 'Practical', value: dashboard.practicalProgress, color: '#8b5cf6' },
    { label: 'Programming', value: dashboard.programmingProgress, color: '#06b6d4' },
    { label: 'Aptitude', value: dashboard.aptitudeProgress, color: '#10b981' },
    { label: 'Reasoning', value: dashboard.reasoningProgress, color: '#f59e0b' },
    { label: 'Interview', value: dashboard.interviewProgress, color: '#ef4444' },
    { label: 'Project', value: dashboard.projectProgress, color: '#ec4899' },
  ]

  return (
    <div>
      <div className="placement-card" style={{ marginBottom: 18 }}>
        <h2>Student Dashboard</h2>
        <p>Track your progress across all areas of the placement program.</p>
      </div>

      <div className="placement-grid cols-4" style={{ marginBottom: 18 }}>
        <div className="placement-card placement-stat">
          <span className="value">{dashboard.overallReadiness}%</span>
          <span className="label">Overall Readiness</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{dashboard.streakDays}</span>
          <span className="label">Day Streak</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{dashboard.totalPracticeTime}m</span>
          <span className="label">Practice Time</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{dashboard.assessmentsCompleted}</span>
          <span className="label">Assessments</span>
        </div>
      </div>

      <div className="placement-grid cols-2" style={{ marginBottom: 18 }}>
        <section className="placement-card">
          <h3>Progress by Area</h3>
          <div style={{ marginTop: 12 }}>
            {progressItems.map((item) => (
              <div key={item.label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.label}</span>
                  <span className="placement-badge info">{item.value}%</span>
                </div>
                <div className="placement-progress-track">
                  <div
                    className="placement-progress-fill"
                    style={{ width: `${item.value}%`, background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="placement-card">
          <h3>Recommended Actions</h3>
          {dashboard.recommendedActions.length > 0 ? (
            <ul className="placement-list" style={{ marginTop: 12 }}>
              {dashboard.recommendedActions.map((action) => (
                <li key={action}>
                  <div className="placement-item-body">
                    <p className="placement-item-title">{action}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="placement-empty" style={{ marginTop: 12 }}>
              Great job! No immediate actions required. Keep practicing to maintain your progress.
            </div>
          )}

          <h3 style={{ marginTop: 18 }}>Quick Actions</h3>
          <div className="placement-grid cols-2" style={{ marginTop: 12 }}>
            <Link to="/placement?view=practice" className="btn btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>
              Practice
            </Link>
            <Link to="/placement?view=assessments" className="btn" style={{ textAlign: 'center', textDecoration: 'none' }}>
              Take Test
            </Link>
            <Link to="/placement?view=interview-prep" className="btn" style={{ textAlign: 'center', textDecoration: 'none' }}>
              Interview Prep
            </Link>
            <Link to="/placement?view=analytics" className="btn" style={{ textAlign: 'center', textDecoration: 'none' }}>
              View Analytics
            </Link>
          </div>
        </section>
      </div>

      {dashboard.weakAreas.length > 0 && (
        <section className="placement-card" style={{ marginBottom: 18 }}>
          <h3>Weak Areas</h3>
          <p className="placement-inline-note">Focus on these areas to improve your readiness score.</p>
          <ul className="placement-list" style={{ marginTop: 12 }}>
            {dashboard.weakAreas.map((area) => (
              <li key={area}>
                <div className="placement-item-body">
                  <p className="placement-item-title">{area}</p>
                </div>
                <Link to="/placement?view=practice" className="btn btn-sm">
                  Practice
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="placement-card">
        <h3>30-Day Program Progress</h3>
        <div className="placement-progress-track" style={{ marginTop: 12 }}>
          <div
            className="placement-progress-fill"
            style={{ width: `${(progress?.daysCompleted?.length ?? 0) / PLACEMENT_DAY_DEFINITIONS.length * 100}%` }}
          />
        </div>
        <p className="placement-inline-note">
          {progress?.daysCompleted?.length ?? 0} of {PLACEMENT_DAY_DEFINITIONS.length} days completed
        </p>
      </section>

      <section className="placement-card" style={{ marginTop: 18 }}>
        <h3>Assessment History</h3>
        {assessmentHistory.length > 0 ? (
          <div className="placement-table-wrap">
            <table className="placement-table">
              <thead>
                <tr>
                  <th>Assessment</th>
                  <th>Score</th>
                  <th>Correct</th>
                  <th>Wrong</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {assessmentHistory.slice(0, 10).map((entry) => {
                  const def = ASSESSMENTS.find((a) => a.id === entry.assessmentId)
                  return (
                    <tr key={`${entry.assessmentId}-${entry.submittedAt}`}>
                      <td>{def?.title ?? entry.assessmentId}</td>
                      <td>
                        <span className={`placement-badge ${entry.percentage >= (def?.passingScore ?? 60) ? 'good' : 'bad'}`}>
                          {entry.percentage}%
                        </span>
                      </td>
                      <td>{entry.correct}</td>
                      <td>{entry.wrong}</td>
                      <td>{new Date(entry.submittedAt).toLocaleDateString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="placement-empty">No assessments taken yet.</div>
        )}
      </section>

      <section className="placement-card" style={{ marginTop: 18 }}>
        <h3>Mock Interviews</h3>
        {mockInterviews.length > 0 ? (
          <ul className="placement-list">
            {mockInterviews.slice(0, 10).map((mock) => {
              const result = mockResults.find((r) => r.mockId === mock.id)
              return (
                <li key={mock.id}>
                  <div className="placement-item-body">
                    <p className="placement-item-title">{mock.title}</p>
                    <p className="placement-item-meta">
                      {mock.mockType.replace(/_/g, ' ')} · {mock.durationMinutes} min · {mock.status}
                      {result ? ` · Score: ${result.overallScore}%` : ''}
                    </p>
                  </div>
                  <span className={`placement-badge ${mock.status === 'completed' ? 'good' : 'info'}`}>
                    {mock.status}
                  </span>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="placement-empty">No mock interviews yet.</div>
        )}
      </section>

      <section className="placement-card" style={{ marginTop: 18 }}>
        <h3>Applications</h3>
        {applications.length > 0 ? (
          <div className="placement-table-wrap">
            <table className="placement-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Applied</th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 10).map((app) => (
                  <tr key={app.id}>
                    <td>{app.company}</td>
                    <td>{app.role}</td>
                    <td>
                      <span className={`placement-badge ${app.status === 'selected' ? 'good' : app.status === 'rejected' ? 'bad' : 'info'}`}>
                        {app.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="placement-empty">No applications tracked yet.</div>
        )}
      </section>

      <section className="placement-card" style={{ marginTop: 18 }}>
        <h3>Projects</h3>
        {projects.length > 0 ? (
          <ul className="placement-list">
            {projects.map((project) => (
              <li key={project.id}>
                <div className="placement-item-body">
                  <p className="placement-item-title">{project.title}</p>
                  <p className="placement-item-meta">
                    {project.techStack.join(', ')} · {project.status.replace(/_/g, ' ')}
                  </p>
                </div>
                <span className={`placement-badge ${project.status === 'defended' ? 'good' : project.status === 'ready_for_review' ? 'info' : 'warn'}`}>
                  {project.status.replace(/_/g, ' ')}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="placement-empty">No projects added yet.</div>
        )}
      </section>

      <section className="placement-card" style={{ marginTop: 18 }}>
        <h3>Interview Feedback</h3>
        {interviewFeedback.length > 0 ? (
          <ul className="placement-list">
            {interviewFeedback.slice(0, 10).map((fb) => (
              <li key={fb.id}>
                <div className="placement-item-body">
                  <p className="placement-item-title">{fb.company} — {fb.round}</p>
                  <p className="placement-item-meta">
                    {fb.result} · Passed: {fb.questionsPassed.length} · Failed: {fb.questionsFailed.length}
                  </p>
                </div>
                <span className={`placement-badge ${fb.result === 'cleared' ? 'good' : fb.result === 'rejected' ? 'bad' : 'warn'}`}>
                  {fb.result}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="placement-empty">No interview feedback recorded yet.</div>
        )}
      </section>
    </div>
  )
}
