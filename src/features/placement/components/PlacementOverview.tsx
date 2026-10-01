import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { usePlacement } from '../hooks/usePlacement'
import { usePlacementReadiness } from '../hooks/usePlacementReadiness'
import { PLACEMENT_DAY_DEFINITIONS, PLACEMENT_PROGRAM } from '../data/curriculum'

export default function PlacementOverview() {
  const { user } = useAuth()
  const userId = user?.id
  const { program, progress, priority, weakTopics, loading, error, completeDay } = usePlacement(userId)
  const { readiness, loading: readinessLoading } = usePlacementReadiness(userId)

  if (loading || readinessLoading) {
    return <div className="placement-empty">Loading your placement status…</div>
  }

  if (error) {
    return <div className="placement-callout danger">{error}</div>
  }

  const currentDay = progress?.currentDay ?? 1
  const daysCompleted = progress?.daysCompleted.length ?? 0
  const dayDef = PLACEMENT_DAY_DEFINITIONS.find((d) => d.dayNumber === currentDay)
  const inPlacementMode = progress?.enrollmentStatus === 'placement_mode'
  const completedPriority = priority.filter((p) => p.completed >= p.target).length

  return (
    <div>
      <div className="placement-grid cols-4" style={{ marginBottom: 20 }}>
        <div className="placement-card placement-stat">
          <span className="value">
            {inPlacementMode ? 'Mode' : `Day ${currentDay}`}
          </span>
          <span className="label">
            {inPlacementMode ? 'Placement Mode — keep applying' : `of ${program.durationDays}`}
          </span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{readiness ? `${readiness.overallScore}%` : '—'}</span>
          <span className="label">Overall Readiness</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{daysCompleted}</span>
          <span className="label">Days Completed</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">
            {readiness ? (readiness.isJobReady ? 'READY' : 'NOT READY') : '—'}
          </span>
          <span className="label">Job Ready Gate</span>
        </div>
      </div>

      <div className="placement-grid cols-2">
        <section className="placement-card">
          <h2>Today&apos;s Priority</h2>
          <p className="placement-inline-note">
            {dayDef ? `${dayDef.phase} · ${dayDef.title}` : 'Placement mode — set your own targets.'}
          </p>
          {priority.length ? (
            <>
              <ul className="placement-list" style={{ marginTop: 12 }}>
                {priority.map((item, index) => {
                  const done = item.completed >= item.target
                  return (
                    <li key={item.key} className={done ? 'done' : undefined}>
                      <span className="placement-badge">{index + 1}</span>
                      <div className="placement-item-body">
                        <p className="placement-item-title">{item.label}</p>
                        <p className="placement-item-meta">
                          {item.completed}/{item.target} completed
                          {item.route ? ` · opens ${item.route}` : ''}
                        </p>
                      </div>
                      <span className={`placement-badge ${done ? 'good' : 'warn'}`}>
                        {done ? 'Done' : 'Pending'}
                      </span>
                    </li>
                  )
                })}
              </ul>
              <div className="placement-actions">
                <span className="placement-badge info">
                  {completedPriority}/{priority.length} done
                </span>
                {!inPlacementMode && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => void completeDay(currentDay)}
                  >
                    Mark Day {currentDay} complete
                  </button>
                )}
                <Link className="btn" to="/placement?view=day-plan">
                  Open day plan
                </Link>
              </div>
            </>
          ) : (
            <div className="placement-empty">No daily tasks generated yet.</div>
          )}
        </section>

        <section className="placement-card">
          <h2>Readiness Snapshot</h2>
          {readiness ? (
            <>
              <div style={{ margin: '12px 0' }}>
                <div className="placement-progress-track">
                  <div
                    className="placement-progress-fill"
                    style={{ width: `${Math.min(100, readiness.overallScore)}%` }}
                  />
                </div>
                <p className="placement-inline-note">
                  {readiness.overallScore}% overall, computed from your real attempts and
                  submissions. Weights are set by your administrator.
                </p>
              </div>
              {readiness.blockingReasons.length ? (
                <div className="placement-callout danger">
                  <strong>Blocking the job-ready gate:</strong>
                  <ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>
                    {readiness.blockingReasons.slice(0, 5).map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="placement-callout success">
                  All thresholds met. The job-ready gate is open — keep applying and tracking
                  interviews.
                </div>
              )}
              <div className="placement-actions">
                <Link className="btn btn-primary" to="/placement?view=readiness">
                  Full readiness report
                </Link>
              </div>
            </>
          ) : (
            <div className="placement-empty">
              No data available yet. Complete a few practice questions to generate your readiness
              score.
            </div>
          )}
        </section>

        <section className="placement-card">
          <h2>Weak Areas</h2>
          {weakTopics.length ? (
            <>
              <p className="placement-inline-note">
                Derived from your recorded attempts only. Day 29 builds its practice set from this
                list.
              </p>
              <ul className="placement-list" style={{ marginTop: 12 }}>
                {weakTopics.slice(0, 6).map((topic) => (
                  <li key={topic.subcategory}>
                    <div className="placement-item-body">
                      <p className="placement-item-title">{topic.subcategory}</p>
                      <p className="placement-item-meta">
                        {topic.correct}/{topic.attempts} correct ({topic.accuracy}%) · {topic.category}
                      </p>
                    </div>
                    <span className="placement-badge bad">{topic.accuracy}%</span>
                  </li>
                ))}
              </ul>
              <div className="placement-actions">
                <Link className="btn" to="/placement?view=practice">
                  Practice weak topics
                </Link>
              </div>
            </>
          ) : (
            <div className="placement-empty">
              No weak areas identified yet. Weak areas appear after at least 3 attempts in a topic
              below 60% accuracy.
            </div>
          )}
        </section>

        <section className="placement-card">
          <h2>Program</h2>
          <p>{program.description}</p>
          <p className="placement-inline-note">
            Target roles: {program.targetRoles.join(', ')}
          </p>
          <div className="placement-actions">
            <Link className="btn" to="/placement?view=assessments">
              Assessments
            </Link>
            <Link className="btn" to="/placement?view=project">
              Project defense
            </Link>
            <Link className="btn" to="/placement?view=applications">
              Application tracker
            </Link>
            <Link className="btn" to="/placement?view=interview-prep">
              Interview prep
            </Link>
          </div>
          <p className="placement-inline-note" style={{ marginTop: 12 }}>
            Practice continues in the existing studios:{' '}
            <Link to="/dsa/questions">DSA</Link>,{' '}
            <Link to="/machine-coding">Machine Coding</Link>,{' '}
            <Link to="/core-programming">Core Programming</Link>,{' '}
            <Link to="/interview-questions">Question Bank</Link>. {PLACEMENT_PROGRAM.durationDays}{' '}
            days end in placement mode — the platform keeps supporting you after that.
          </p>
        </section>
      </div>
    </div>
  )
}
