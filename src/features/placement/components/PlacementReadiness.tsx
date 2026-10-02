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

  const scoreColor = readiness.overallScore >= 75 ? '#16a34a' : readiness.overallScore >= 50 ? '#ca8a04' : '#dc2626'
  const metCount = readiness.categoryScores.filter((c) => c.meetsThreshold).length
  const totalCount = readiness.categoryScores.length

  return (
    <div>
      <div className="placement-grid cols-3" style={{ marginBottom: 18 }}>
        <div className="placement-card placement-stat">
          <span className="value" style={{ color: scoreColor }}>{readiness.overallScore}%</span>
          <span className="label">Overall Readiness</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{readiness.isJobReady ? 'JOB READY' : 'NOT READY'}</span>
          <span className="label">Job Ready Gate</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{metCount}/{totalCount}</span>
          <span className="label">Categories Met</span>
        </div>
      </div>

      <div className="placement-card" style={{ marginBottom: 18 }}>
        <h3>Readiness Progress</h3>
        <div className="placement-progress-track" style={{ marginTop: 12, height: 12 }}>
          <div className="placement-progress-fill" style={{ width: `${readiness.overallScore}%` }} />
        </div>
        <p className="placement-inline-note">
          {readiness.overallScore}% overall — {readiness.isJobReady ? 'All thresholds met' : `${readiness.blockingReasons.length} blocking reasons remaining`}
        </p>
      </div>

      <div className="placement-grid cols-2">
        <section className="placement-card">
          <h2>Category Breakdown</h2>
          <p className="placement-inline-note">
            Scores come from your real attempts and submissions. Weights and thresholds are
            configured by your administrator — they are not hardcoded here.
          </p>
          <div style={{ marginTop: 12 }}>
            {readiness.categoryScores.map((entry) => {
              const progress = Math.min(100, (entry.score / entry.threshold) * 100)
              return (
                <div key={entry.category} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <strong>{LABELS[entry.category] ?? entry.category}</strong>
                    <span className={`placement-badge ${entry.meetsThreshold ? 'good' : 'bad'}`}>
                      {entry.score}% / {entry.threshold}%
                    </span>
                  </div>
                  <div className="placement-progress-track">
                    <div
                      className="placement-progress-fill"
                      style={{
                        width: `${progress}%`,
                        background: entry.meetsThreshold ? '#16a34a' : '#dc2626',
                      }}
                    />
                  </div>
                  <p className="placement-inline-note" style={{ marginTop: 4 }}>
                    Weight: {entry.weight}% · {entry.evidence}
                  </p>
                </div>
              )
            })}
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
        <h3>Recommendations</h3>
        <ul className="placement-list">
          {readiness.categoryScores
            .filter((c) => !c.meetsThreshold)
            .sort((a, b) => a.score - b.score)
            .slice(0, 5)
            .map((entry) => (
              <li key={entry.category}>
                <div className="placement-item-body">
                  <p className="placement-item-title">
                    Improve {LABELS[entry.category] ?? entry.category}
                  </p>
                  <p className="placement-item-meta">
                    Currently {entry.score}% — need {entry.threshold}% to pass. Focus on practice questions and assessments in this area.
                  </p>
                </div>
                <span className="placement-badge bad">
                  +{entry.threshold - entry.score}%
                </span>
              </li>
            ))}
          {readiness.isJobReady && (
            <li>
              <div className="placement-item-body">
                <p className="placement-item-title">Ready to apply!</p>
                <p className="placement-item-meta">
                  All thresholds met. Start applying to companies and tracking your progress.
                </p>
              </div>
              <span className="placement-badge good">Ready</span>
            </li>
          )}
        </ul>
      </section>

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
