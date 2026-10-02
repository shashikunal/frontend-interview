import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { placementApplicationsService } from '../services/placementApplications.service'
import { placementReadinessService } from '../services/placementReadiness.service'
import type {
  ApplicationStatus,
  PlacementInterviewFeedback,
  PlacementJobApplication,
  RejectionAnalysis,
} from '../types/placement.types'

const STATUSES: ApplicationStatus[] = [
  'saved',
  'applied',
  'online_assessment',
  'shortlisted',
  'technical_round',
  'hr_round',
  'selected',
  'rejected',
  'no_response',
  'withdrawn',
]

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  saved: 'Saved',
  applied: 'Applied',
  online_assessment: 'Online Assessment',
  shortlisted: 'Shortlisted',
  technical_round: 'Technical Round',
  hr_round: 'HR Round',
  selected: 'Selected',
  rejected: 'Rejected',
  no_response: 'No Response',
  withdrawn: 'Withdrawn',
}

const EMPTY_APPLICATION = {
  company: '',
  role: '',
  location: '',
  jobUrl: '',
  source: '',
  appliedAt: null as string | null,
  status: 'saved' as ApplicationStatus,
  interviewDate: null as string | null,
  currentRound: '',
  salaryRange: '',
  notes: '',
}

const EMPTY_FEEDBACK = {
  company: '',
  role: '',
  round: '',
  interviewDate: null as string | null,
  questionsAsked: '',
  questionsFailed: '',
  questionsPassed: '',
  dsa: 'pass' as 'pass' | 'fail' | 'partial',
  frontend: 'pass' as 'pass' | 'fail' | 'partial',
  language: 'pass' as 'pass' | 'fail' | 'partial',
  sql: 'pass' as 'pass' | 'fail' | 'partial',
  communication: 'pass' as 'pass' | 'fail' | 'partial',
  result: 'pending' as PlacementInterviewFeedback['result'],
  feedback: '',
}

export default function PlacementApplications() {
  const { user } = useAuth()
  const userId = user?.id
  const [applications, setApplications] = useState<PlacementJobApplication[]>([])
  const [feedback, setFeedback] = useState<PlacementInterviewFeedback[]>([])
  const [analysis, setAnalysis] = useState<RejectionAnalysis | null>(null)
  const [appDraft, setAppDraft] = useState(EMPTY_APPLICATION)
  const [feedbackDraft, setFeedbackDraft] = useState(EMPTY_FEEDBACK)
  const [saving, setSaving] = useState(false)

  const refresh = async () => {
    if (!userId) return
    const apps = await placementApplicationsService.getApplications(userId)
    const fb = await placementApplicationsService.getInterviewFeedback(userId)
    setApplications(apps)
    setFeedback(fb)
    setAnalysis(placementReadinessService.analyseRejections(fb))
  }

  useEffect(() => {
    void refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const saveApplication = async () => {
    if (!userId || !appDraft.company.trim() || !appDraft.role.trim()) return
    setSaving(true)
    await placementApplicationsService.saveApplication(userId, {
      ...appDraft,
      company: appDraft.company.trim(),
      role: appDraft.role.trim(),
    })
    setAppDraft(EMPTY_APPLICATION)
    setSaving(false)
    await refresh()
  }

  const saveFeedback = async () => {
    if (!userId) return
    setSaving(true)
    await placementApplicationsService.saveInterviewFeedback(userId, {
      company: feedbackDraft.company.trim(),
      role: feedbackDraft.role.trim(),
      round: feedbackDraft.round.trim(),
      interviewDate: feedbackDraft.interviewDate
        ? new Date(feedbackDraft.interviewDate).toISOString()
        : null,
      questionsAsked: feedbackDraft.questionsAsked
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      questionsFailed: feedbackDraft.questionsFailed
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      questionsPassed: feedbackDraft.questionsPassed
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      areaResults: {
        dsa: feedbackDraft.dsa,
        frontend: feedbackDraft.frontend,
        language: feedbackDraft.language,
        sql: feedbackDraft.sql,
        communication: feedbackDraft.communication,
      },
      result: feedbackDraft.result,
      feedback: feedbackDraft.feedback,
    })
    setFeedbackDraft(EMPTY_FEEDBACK)
    setSaving(false)
    await refresh()
  }

  const statusCounts = STATUSES.map((status) => ({
    status,
    count: applications.filter((a) => a.status === status).length,
  })).filter((s) => s.count > 0)

  const activeApplications = applications.filter((a) => !['selected', 'rejected', 'withdrawn'].includes(a.status)).length
  const successRate = applications.length > 0 ? Math.round((applications.filter((a) => a.status === 'selected').length / applications.length) * 100) : 0

  return (
    <div>
      <div className="placement-grid cols-4" style={{ marginBottom: 18 }}>
        <div className="placement-card placement-stat">
          <span className="value">{applications.length}</span>
          <span className="label">Applications tracked</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{activeApplications}</span>
          <span className="label">Active</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{feedback.length}</span>
          <span className="label">Interviews recorded</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{successRate}%</span>
          <span className="label">Success rate</span>
        </div>
      </div>

      {applications.length > 0 && (
        <div className="placement-card" style={{ marginBottom: 18 }}>
          <h3>Pipeline Overview</h3>
          <div className="placement-grid cols-3" style={{ marginTop: 12 }}>
            {statusCounts.slice(0, 6).map(({ status, count }) => (
              <div key={status} className="placement-card" style={{ textAlign: 'center', padding: '12px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{count}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {STATUS_LABELS[status]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="placement-grid cols-2">
        <section className="placement-card">
          <h2>Add an application</h2>
          <div className="placement-form" style={{ marginTop: 12 }}>
            <div className="placement-form-row">
              <label>
                Company
                <input
                  value={appDraft.company}
                  onChange={(e) => setAppDraft({ ...appDraft, company: e.target.value })}
                />
              </label>
              <label>
                Role
                <input
                  value={appDraft.role}
                  onChange={(e) => setAppDraft({ ...appDraft, role: e.target.value })}
                />
              </label>
              <label>
                Location
                <input
                  value={appDraft.location}
                  onChange={(e) => setAppDraft({ ...appDraft, location: e.target.value })}
                />
              </label>
            </div>
            <div className="placement-form-row">
              <label>
                Job URL
                <input
                  value={appDraft.jobUrl}
                  onChange={(e) => setAppDraft({ ...appDraft, jobUrl: e.target.value })}
                />
              </label>
              <label>
                Source
                <input
                  value={appDraft.source}
                  onChange={(e) => setAppDraft({ ...appDraft, source: e.target.value })}
                  placeholder="LinkedIn, referral, careers page"
                />
              </label>
              <label>
                Applied date
                <input
                  type="date"
                  value={appDraft.appliedAt ?? ''}
                  onChange={(e) => setAppDraft({ ...appDraft, appliedAt: e.target.value })}
                />
              </label>
            </div>
            <div className="placement-form-row">
              <label>
                Status
                <select
                  value={appDraft.status}
                  onChange={(e) =>
                    setAppDraft({ ...appDraft, status: e.target.value as ApplicationStatus })
                  }
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Current round
                <input
                  value={appDraft.currentRound}
                  onChange={(e) => setAppDraft({ ...appDraft, currentRound: e.target.value })}
                />
              </label>
              <label>
                Salary range
                <input
                  value={appDraft.salaryRange}
                  onChange={(e) => setAppDraft({ ...appDraft, salaryRange: e.target.value })}
                />
              </label>
            </div>
            <label>
              Notes
              <textarea
                rows={2}
                value={appDraft.notes}
                onChange={(e) => setAppDraft({ ...appDraft, notes: e.target.value })}
              />
            </label>
            <div className="placement-actions">
              <button
                type="button"
                className="btn btn-primary"
                disabled={saving || !appDraft.company.trim() || !appDraft.role.trim()}
                onClick={() => void saveApplication()}
              >
                {saving ? 'Saving…' : 'Save application'}
              </button>
            </div>
          </div>
        </section>

        <section className="placement-card">
          <h2>Record interview feedback</h2>
          <p className="placement-inline-note">
            Record what was actually asked and what failed. This is what drives the rejection
            analysis and the Day 29 weakness plan — no generic advice.
          </p>
          <div className="placement-form" style={{ marginTop: 12 }}>
            <div className="placement-form-row">
              <label>
                Company
                <input
                  value={feedbackDraft.company}
                  onChange={(e) => setFeedbackDraft({ ...feedbackDraft, company: e.target.value })}
                />
              </label>
              <label>
                Role
                <input
                  value={feedbackDraft.role}
                  onChange={(e) => setFeedbackDraft({ ...feedbackDraft, role: e.target.value })}
                />
              </label>
              <label>
                Round
                <input
                  value={feedbackDraft.round}
                  onChange={(e) => setFeedbackDraft({ ...feedbackDraft, round: e.target.value })}
                  placeholder="Technical 1, HR, etc."
                />
              </label>
            </div>
            <div className="placement-form-row">
              {(
                [
                  ['dsa', 'DSA'],
                  ['frontend', 'Frontend'],
                  ['language', 'Language'],
                  ['sql', 'SQL'],
                  ['communication', 'Communication'],
                ] as const
              ).map(([key, label]) => (
                <label key={key}>
                  {label}
                  <select
                    value={feedbackDraft[key]}
                    onChange={(e) =>
                      setFeedbackDraft({
                        ...feedbackDraft,
                        [key]: e.target.value as 'pass' | 'fail' | 'partial',
                      })
                    }
                  >
                    <option value="pass">Pass</option>
                    <option value="partial">Partial</option>
                    <option value="fail">Fail</option>
                  </select>
                </label>
              ))}
            </div>
            <div className="placement-form-row">
              <label>
                Result
                <select
                  value={feedbackDraft.result}
                  onChange={(e) =>
                    setFeedbackDraft({
                      ...feedbackDraft,
                      result: e.target.value as PlacementInterviewFeedback['result'],
                    })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="cleared">Cleared</option>
                  <option value="rejected">Rejected</option>
                  <option value="holding">On hold</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </label>
              <label>
                Interview date
                <input
                  type="date"
                  value={feedbackDraft.interviewDate ?? ''}
                  onChange={(e) =>
                    setFeedbackDraft({ ...feedbackDraft, interviewDate: e.target.value })
                  }
                />
              </label>
            </div>
            <label>
              Questions asked (one per line)
              <textarea
                rows={3}
                value={feedbackDraft.questionsAsked}
                onChange={(e) =>
                  setFeedbackDraft({ ...feedbackDraft, questionsAsked: e.target.value })
                }
              />
            </label>
            <label>
              Questions failed (one per line)
              <textarea
                rows={3}
                value={feedbackDraft.questionsFailed}
                onChange={(e) =>
                  setFeedbackDraft({ ...feedbackDraft, questionsFailed: e.target.value })
                }
              />
            </label>
            <label>
              Feedback notes
              <textarea
                rows={2}
                value={feedbackDraft.feedback}
                onChange={(e) => setFeedbackDraft({ ...feedbackDraft, feedback: e.target.value })}
              />
            </label>
            <div className="placement-actions">
              <button type="button" className="btn btn-primary" onClick={() => void saveFeedback()}>
                {saving ? 'Saving…' : 'Save interview feedback'}
              </button>
            </div>
          </div>
        </section>
      </div>

      <section className="placement-card" style={{ marginTop: 18 }}>
        <h2>Application tracker</h2>
        {statusCounts.length ? (
          <div className="placement-actions" style={{ marginTop: 0, marginBottom: 12 }}>
            {statusCounts.map((entry) => (
              <span key={entry.status} className="placement-badge info">
                {STATUS_LABELS[entry.status]}: {entry.count}
              </span>
            ))}
          </div>
        ) : null}
        {applications.length ? (
          <div className="placement-table-wrap">
            <table className="placement-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th>Round</th>
                  <th>Notes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td>
                      {application.jobUrl ? (
                        <a href={application.jobUrl} target="_blank" rel="noreferrer">
                          {application.company}
                        </a>
                      ) : (
                        application.company
                      )}
                    </td>
                    <td>{application.role}</td>
                    <td>{application.location || '—'}</td>
                    <td>
                      <select
                        value={application.status}
                        onChange={(e) => {
                          if (!userId) return
                          void placementApplicationsService
                            .saveApplication(userId, {
                              ...application,
                              status: e.target.value as ApplicationStatus,
                            })
                            .then(refresh)
                        }}
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{application.appliedAt ?? '—'}</td>
                    <td>{application.currentRound || '—'}</td>
                    <td style={{ maxWidth: 220, color: 'var(--text-muted)' }}>
                      {application.notes || '—'}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => {
                          if (!userId) return
                          void placementApplicationsService
                            .deleteApplication(userId, application.id)
                            .then(refresh)
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="placement-empty">
            No data available yet. Add the roles you are applying to so the platform can track
            rounds, rejections and follow-ups with you.
          </div>
        )}
      </section>

      <section className="placement-card" style={{ marginTop: 18 }}>
        <h2>Rejection analysis</h2>
        <p className="placement-inline-note">
          Built from your last {analysis?.windowSize ?? 5} recorded interviews only. Nothing is
          recommended that is not backed by a failed question or a failed area in your own records.
        </p>
        {analysis && analysis.totalInterviews ? (
          <div className="placement-grid cols-2" style={{ marginTop: 12 }}>
            <div>
              <h3>Area results (last {analysis.totalInterviews} interviews)</h3>
              <ul className="placement-list">
                {Object.keys({ ...analysis.areaFailureCounts, ...analysis.areaPassCounts }).map(
                  (area) => (
                    <li key={area}>
                      <div className="placement-item-body">
                        <p className="placement-item-title">{area}</p>
                        <p className="placement-item-meta">
                          Passed: {analysis.areaPassCounts[area] ?? 0} · Failed:{' '}
                          {analysis.areaFailureCounts[area] ?? 0}
                        </p>
                      </div>
                      <span
                        className={`placement-badge ${
                          (analysis.areaFailureCounts[area] ?? 0) > (analysis.areaPassCounts[area] ?? 0)
                            ? 'bad'
                            : 'good'
                        }`}
                      >
                        {(analysis.areaFailureCounts[area] ?? 0) >
                        (analysis.areaPassCounts[area] ?? 0)
                          ? 'Failing'
                          : 'Holding'}
                      </span>
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div>
              <h3>Recommended focus</h3>
              <ul className="placement-list">
                {analysis.recommendations.map((recommendation) => (
                  <li key={recommendation}>
                    <div className="placement-item-body">
                      <p className="placement-item-title">{recommendation}</p>
                    </div>
                  </li>
                ))}
              </ul>
              {analysis.weakTopics.length > 0 && (
                <>
                  <h3 style={{ marginTop: 14 }}>Failed questions to re-practice</h3>
                  <ul className="placement-list">
                    {analysis.weakTopics.slice(0, 6).map((topic) => (
                      <li key={topic}>
                        <div className="placement-item-body">
                          <p className="placement-item-title">{topic}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="placement-empty">
            No data available yet. Record interview results and the analysis will name the exact
            topics to improve — never random questions.
          </div>
        )}
      </section>
    </div>
  )
}
