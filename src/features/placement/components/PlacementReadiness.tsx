import { useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { usePlacementReadiness } from '../hooks/usePlacementReadiness'
import { placementReadinessService } from '../services/placementReadiness.service'

const LABELS: Record<string, string> = {
  dsa: 'DSA',
  frontend: 'Frontend',
  programming: 'Programming',
  aptitude: 'Aptitude',
  technical_mcq: 'Technical MCQ',
  machine_coding: 'Machine Coding',
  sql_cs: 'SQL / CS',
  project: 'Project',
  communication: 'Communication',
  resume: 'Resume',
  github: 'GitHub profile',
  portfolio: 'Portfolio',
  live_project: 'Live project',
  readme: 'Project README',
  min_mock_interviews: 'Mock interviews completed',
  final_assessment_passed: 'Final assessment passed',
}

export default function PlacementReadiness() {
  const { user } = useAuth()
  const { config, readiness, loading, error, refresh } = usePlacementReadiness(user?.id)
  const [checklistDraft, setChecklistDraft] = useState<Record<string, boolean | number>>({})
  const [saving, setSaving] = useState(false)

  if (loading) return <div className="placement-empty">Computing readiness from your activity…</div>
  if (error) return <div className="placement-callout danger">{error}</div>
  if (!readiness) {
    return (
      <div className="placement-empty">
        No data available yet. Complete practice questions and assessments to generate a readiness
        report.
      </div>
    )
  }

  const saveChecklist = async () => {
    if (!user?.id) return
    setSaving(true)
    await placementReadinessService.saveChecklist(user.id, {
      ...readiness.checklistState,
      ...checklistDraft,
    })
    await refresh()
    setSaving(false)
  }

  return (
    <div>
      <div className="placement-grid cols-3" style={{ marginBottom: 18 }}>
        <div className="placement-card placement-stat">
          <span className="value">{readiness.overallScore}%</span>
          <span className="label">Overall Readiness</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{readiness.isJobReady ? 'JOB READY' : 'NOT READY'}</span>
          <span className="label">Job Ready Gate</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{readiness.blockingReasons.length}</span>
          <span className="label">Blocking reasons</span>
        </div>
      </div>

      <div className="placement-grid cols-2">
        <section className="placement-card">
          <h2>Category Breakdown</h2>
          <p className="placement-inline-note">
            Scores come from your real attempts and submissions. Weights and thresholds are
            configured by your administrator — they are not hardcoded here.
          </p>
          <div className="placement-table-wrap" style={{ marginTop: 12 }}>
            <table className="placement-table">
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Score</th>
                  <th>Min</th>
                  <th>Weight</th>
                  <th>Evidence</th>
                </tr>
              </thead>
              <tbody>
                {readiness.categoryScores.map((entry) => (
                  <tr key={entry.category}>
                    <td>
                      <strong>{LABELS[entry.category] ?? entry.category}</strong>
                    </td>
                    <td>
                      <span
                        className={`placement-badge ${entry.meetsThreshold ? 'good' : 'bad'}`}
                      >
                        {entry.score}%
                      </span>
                    </td>
                    <td>{entry.threshold}%</td>
                    <td>{entry.weight}%</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {entry.evidence}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="placement-card">
          <h2>Job Ready Gate</h2>
          {readiness.blockingReasons.length ? (
            <div className="placement-callout danger">
              <strong>Not ready yet. Exact reasons:</strong>
              <ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>
                {readiness.blockingReasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="placement-callout success">
              Every threshold and checklist item is satisfied. <strong>Job Ready.</strong> Move into
              placement mode: apply, interview, record feedback and iterate.
            </div>
          )}

          <h3 style={{ marginTop: 18 }}>Checklist</h3>
          <p className="placement-inline-note">
            Items are marked complete only from real records — a project counts as deployed only
            when a live URL is saved.
          </p>
          <div className="placement-checklist" style={{ marginTop: 10 }}>
            {['resume', 'github', 'portfolio', 'live_project', 'readme'].map((key) => {
              const current = Boolean(
                checklistDraft[key] ?? readiness.checklistState[key] ?? false,
              )
              return (
                <label key={key}>
                  <input
                    type="checkbox"
                    checked={current}
                    onChange={(e) =>
                      setChecklistDraft((d) => ({ ...d, [key]: e.target.checked }))
                    }
                  />
                  {LABELS[key] ?? key}
                </label>
              )
            })}
            <label>
              <input
                type="checkbox"
                checked={Boolean(
                  checklistDraft.final_assessment_passed ??
                    readiness.checklistState.final_assessment_passed ??
                    false,
                )}
                onChange={(e) =>
                  setChecklistDraft((d) => ({ ...d, final_assessment_passed: e.target.checked }))
                }
              />
              {LABELS.final_assessment_passed}
            </label>
            <p className="placement-inline-note">
              Mock interviews completed:{' '}
              {Number(readiness.checklistState.min_mock_interviews ?? 0)} of{' '}
              {config.gateChecklist.min_mock_interviews} required (recorded automatically).
            </p>
          </div>

          <div className="placement-actions">
            <button
              type="button"
              className="btn btn-primary"
              disabled={saving}
              onClick={() => void saveChecklist()}
            >
              {saving ? 'Saving…' : 'Save checklist'}
            </button>
            <button type="button" className="btn" onClick={() => void refresh()}>
              Recompute
            </button>
          </div>
        </section>
      </div>

      <section className="placement-card" style={{ marginTop: 18 }}>
        <h3>How the score is calculated</h3>
        <p>
          Overall readiness is the weighted average of the category scores above. A category score
          is measured from actual recorded activity: placement attempts, accepted submissions in
          the DSA and Core Programming studios, project completeness, and mock interview results.
          When there is no activity in an area the score is 0% and the evidence column says so.
        </p>
        <p className="placement-inline-note">
          Computed at {new Date(readiness.computedAt).toLocaleString()}.
        </p>
      </section>
    </div>
  )
}
