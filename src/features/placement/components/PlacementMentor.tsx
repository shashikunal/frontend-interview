import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import {
  placementMentorService,
  type InterventionTrigger,
} from '../services/placementMentor.service'
import type { MentorIntervention, MentorStudentRow } from '../types/placement.types'

export default function PlacementMentor() {
  const { user, hasPermission } = useAuth()
  const [students, setStudents] = useState<MentorStudentRow[]>([])
  const [selected, setSelected] = useState<MentorStudentRow | null>(null)
  const [triggers, setTriggers] = useState<InterventionTrigger[]>([])
  const [interventions, setInterventions] = useState<MentorIntervention[]>([])
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(false)

  const canView = hasPermission('interviewer')

  const refresh = async () => {
    setLoading(true)
    setStudents(await placementMentorService.getStudents())
    setLoading(false)
  }

  useEffect(() => {
    if (canView) void refresh()
    else setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canView])

  const selectStudent = async (row: MentorStudentRow) => {
    setSelected(row)
    setWorking(true)
    setTriggers(await placementMentorService.generateTriggers(row.userId))
    setInterventions(await placementMentorService.getInterventions(row.userId))
    setWorking(false)
  }

  const recordAll = async () => {
    if (!selected) return
    setWorking(true)
    for (const trigger of triggers) {
      await placementMentorService.saveIntervention(selected.userId, trigger, user?.id)
    }
    setInterventions(await placementMentorService.getInterventions(selected.userId))
    setWorking(false)
  }

  if (!canView) {
    return (
      <div className="placement-empty">
        The mentor dashboard is available to interviewers and administrators only. Student records
        are never exposed outside that role.
      </div>
    )
  }

  const totals = {
    total: students.length,
    active: students.length,
    jobReady: students.filter((s) => s.statusLabel === 'Job Ready').length,
    almostReady: students.filter((s) => s.statusLabel === 'Almost Ready').length,
    improving: students.filter((s) => s.statusLabel === 'Improving').length,
    needsIntervention: students.filter((s) => s.statusLabel === 'Needs Intervention').length,
    atRisk: students.filter((s) => s.statusLabel === 'At Risk').length,
    averageReadiness: students.length
      ? Math.round(students.reduce((sum, s) => sum + s.readiness, 0) / students.length)
      : 0,
    applications: students.reduce((sum, s) => sum + s.applications, 0),
    interviews: students.reduce((sum, s) => sum + s.interviews, 0),
    selections: students.reduce((sum, s) => sum + s.selections, 0),
    openInterventions: students.reduce((sum, s) => sum + s.openInterventions, 0),
  }

  return (
    <div>
      <div className="placement-grid cols-4" style={{ marginBottom: 18 }}>
        <div className="placement-card placement-stat">
          <span className="value">{totals.total}</span>
          <span className="label">Total students</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{totals.jobReady}</span>
          <span className="label">Job Ready</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{totals.almostReady}</span>
          <span className="label">Almost Ready</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{totals.improving}</span>
          <span className="label">Improving</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{totals.atRisk}</span>
          <span className="label">At Risk</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{totals.averageReadiness}%</span>
          <span className="label">Average readiness</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{totals.openInterventions}</span>
          <span className="label">Open interventions</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{totals.selections}</span>
          <span className="label">Selections</span>
        </div>
      </div>

      {students.length > 0 && (
        <div className="placement-card" style={{ marginBottom: 18 }}>
          <h3>Readiness Distribution</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100, marginTop: 12 }}>
            {[
              { label: '90-100%', count: students.filter((s) => s.readiness >= 90).length, color: '#16a34a' },
              { label: '75-89%', count: students.filter((s) => s.readiness >= 75 && s.readiness < 90).length, color: '#65a30d' },
              { label: '60-74%', count: students.filter((s) => s.readiness >= 60 && s.readiness < 75).length, color: '#ca8a04' },
              { label: '40-59%', count: students.filter((s) => s.readiness >= 40 && s.readiness < 60).length, color: '#ea580c' },
              { label: '0-39%', count: students.filter((s) => s.readiness < 40).length, color: '#dc2626' },
            ].map((bucket) => (
              <div key={bucket.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '100%',
                    height: `${students.length > 0 ? (bucket.count / students.length) * 100 : 0}%`,
                    background: bucket.color,
                    borderRadius: '4px 4px 0 0',
                    minHeight: 4,
                  }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {bucket.label}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{bucket.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <section className="placement-card" style={{ marginBottom: 18 }}>
        <h2>Students</h2>
        <p className="placement-inline-note">
          Every number comes from the student&apos;s own recorded attempts, submissions, projects
          and applications. When a student has no activity, the row shows 0 and says so.
        </p>
        {loading ? (
          <div className="placement-empty">Loading student records…</div>
        ) : students.length ? (
          <div className="placement-table-wrap" style={{ marginTop: 12 }}>
            <table className="placement-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Readiness</th>
                  <th>DSA</th>
                  <th>Frontend</th>
                  <th>Programming</th>
                  <th>Aptitude</th>
                  <th>Machine Coding</th>
                  <th>Project</th>
                  <th>Applications</th>
                  <th>Interviews</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {students.map((row) => (
                  <tr key={row.userId}>
                    <td>
                      <strong>{row.name}</strong>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {row.email}
                      </div>
                    </td>
                    <td>{row.readiness}%</td>
                    <td>{row.dsa}%</td>
                    <td>{row.frontend}%</td>
                    <td>{row.programming}%</td>
                    <td>{row.aptitude}%</td>
                    <td>{row.machineCoding}%</td>
                    <td>{row.project}%</td>
                    <td>{row.applications}</td>
                    <td>{row.interviews}</td>
                    <td>
                      <span
                        className={`placement-badge ${
                          row.statusLabel === 'Job Ready'
                            ? 'good'
                            : row.statusLabel === 'At Risk'
                              ? 'bad'
                              : 'warn'
                        }`}
                      >
                        {row.statusLabel}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => void selectStudent(row)}
                      >
                        Analyse
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="placement-empty">
            No data available yet. Student rows appear once candidates sign up and begin recording
            placement activity.
          </div>
        )}
      </section>

      {selected && (
        <div className="placement-grid cols-2">
          <section className="placement-card">
            <h2>
              Intervention analysis — {selected.name}
            </h2>
            <p className="placement-inline-note">
              Triggers are generated from this student&apos;s real records. Each one shows the
              problem, the evidence and a recommended action.
            </p>
            {working ? (
              <div className="placement-empty">Analysing…</div>
            ) : triggers.length ? (
              <>
                <ul className="placement-list" style={{ marginTop: 12 }}>
                  {triggers.map((trigger) => (
                    <li key={trigger.triggerKey}>
                      <div className="placement-item-body">
                        <p className="placement-item-title">{trigger.problem}</p>
                        <p className="placement-item-meta">Evidence: {trigger.evidence}</p>
                        <p className="placement-item-meta">
                          Recommended action: {trigger.recommendedAction}
                        </p>
                      </div>
                      <span
                        className={`placement-badge ${
                          trigger.priority === 'critical' || trigger.priority === 'high'
                            ? 'bad'
                            : 'warn'
                        }`}
                      >
                        {trigger.priority}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="placement-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={working}
                    onClick={() => void recordAll()}
                  >
                    Record all as interventions
                  </button>
                </div>
              </>
            ) : (
              <div className="placement-empty">
                No intervention triggers. This student has no recorded issue that meets a trigger
                threshold.
              </div>
            )}
          </section>

          <section className="placement-card">
            <h2>Recorded interventions</h2>
            {interventions.length ? (
              <ul className="placement-list">
                {interventions.map((intervention) => (
                  <li key={intervention.id} className={intervention.resolved ? 'done' : undefined}>
                    <div className="placement-item-body">
                      <p className="placement-item-title">{intervention.problem}</p>
                      <p className="placement-item-meta">{intervention.recommendedAction}</p>
                      <p className="placement-item-meta">
                        {new Date(intervention.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`placement-badge ${intervention.resolved ? 'good' : 'warn'}`}
                    >
                      {intervention.resolved ? 'Resolved' : intervention.statusLabel}
                    </span>
                    {!intervention.resolved && (
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => {
                          void placementMentorService
                            .resolveIntervention(selected.userId, intervention.id, 'Resolved by mentor')
                            .then(() => placementMentorService.getInterventions(selected.userId))
                            .then(setInterventions)
                        }}
                      >
                        Resolve
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="placement-empty">
                No data available yet. Record an intervention to start tracking follow-up.
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
