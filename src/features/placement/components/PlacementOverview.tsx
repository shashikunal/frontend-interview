import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { usePlacement } from '../hooks/usePlacement'
import { usePlacementReadiness } from '../hooks/usePlacementReadiness'
import { PLACEMENT_DAY_DEFINITIONS } from '../data/curriculum'

export default function PlacementOverview() {
  const { user } = useAuth()
  const userId = user?.id
  const { program, progress, priority, weakTopics, loading, error, completeDay } = usePlacement(userId)
  const { readiness, loading: readinessLoading } = usePlacementReadiness(userId)

  if (loading || readinessLoading) {
    return <div className="placement-empty">Loading…</div>
  }

  if (error) {
    return <div className="placement-callout danger">{error}</div>
  }

  const currentDay = progress?.currentDay ?? 1
  const daysCompleted = progress?.daysCompleted.length ?? 0
  const dayDef = PLACEMENT_DAY_DEFINITIONS.find((d) => d.dayNumber === currentDay)
  const inPlacementMode = progress?.enrollmentStatus === 'placement_mode'
  const completedPriority = priority.filter((p) => p.completed >= p.target).length

  const isNewUser = daysCompleted === 0 && !readiness

  return (
    <div>
      {isNewUser && (
        <div className="placement-callout" style={{ marginBottom: 20, textAlign: 'center', padding: '20px' }}>
          <h2 style={{ margin: '0 0 8px', fontSize: '1.3rem' }}>Welcome to Your Placement Journey!</h2>
          <p style={{ margin: 0, fontSize: '1rem' }}>
            Complete daily tasks, track your progress, and get job-ready. Start with Day 1 or take a baseline assessment.
          </p>
        </div>
      )}

      <div className="placement-grid cols-4" style={{ marginBottom: 20 }}>
        <div className="placement-card placement-stat">
          <span className="value">
            {inPlacementMode ? 'Mode' : `Day ${currentDay}`}
          </span>
          <span className="label">
            {inPlacementMode ? 'Placement Mode' : `of ${program.durationDays}`}
          </span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{readiness ? `${readiness.overallScore}%` : '—'}</span>
          <span className="label">Readiness</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{daysCompleted}</span>
          <span className="label">Days Done</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">
            {readiness ? (readiness.isJobReady ? 'READY' : 'NOT READY') : '—'}
          </span>
          <span className="label">Job Ready</span>
        </div>
      </div>

      <div className="placement-grid cols-2">
        <section className="placement-card">
          <h2>Today&apos;s Tasks</h2>
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
              </div>
            </>
          ) : (
            <div className="placement-empty">No daily tasks generated yet.</div>
          )}
        </section>

        <section className="placement-card">
          <h2>Weak Areas</h2>
          {weakTopics.length ? (
            <>
              <ul className="placement-list" style={{ marginTop: 12 }}>
                {weakTopics.slice(0, 5).map((topic) => (
                  <li key={topic.subcategory}>
                    <div className="placement-item-body">
                      <p className="placement-item-title">{topic.subcategory}</p>
                      <p className="placement-item-meta">
                        {topic.correct}/{topic.attempts} correct ({topic.accuracy}%)
                      </p>
                    </div>
                    <span className="placement-badge bad">{topic.accuracy}%</span>
                  </li>
                ))}
              </ul>
              <div className="placement-actions">
                <Link className="btn btn-primary" to="/placement?view=practice">
                  Practice weak topics
                </Link>
              </div>
            </>
          ) : (
            <div className="placement-empty">
              No weak areas yet. They appear after 3+ attempts below 60% accuracy.
            </div>
          )}
        </section>

        <section className="placement-card">
          <h2>Quick Start</h2>
          <div className="placement-grid cols-2" style={{ marginTop: 12 }}>
            <Link to="/placement?view=practice" className="btn btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>
              Practice Now
            </Link>
            <Link to="/placement?view=interview-prep" className="btn" style={{ textAlign: 'center', textDecoration: 'none' }}>
              Interview Prep
            </Link>
            <Link to="/placement?view=assessments" className="btn" style={{ textAlign: 'center', textDecoration: 'none' }}>
              Take Assessment
            </Link>
            <Link to="/placement?view=mock-interviews" className="btn" style={{ textAlign: 'center', textDecoration: 'none' }}>
              Mock Interview
            </Link>
          </div>
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
                  {readiness.overallScore}% overall from your real attempts.
                </p>
              </div>
              {readiness.blockingReasons.length ? (
                <div className="placement-callout danger">
                  <strong>Focus on:</strong>
                  <ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>
                    {readiness.blockingReasons.slice(0, 3).map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="placement-callout success">
                  All thresholds met. Keep applying!
                </div>
              )}
              <div className="placement-actions">
                <Link className="btn" to="/placement?view=readiness">
                  Full report
                </Link>
              </div>
            </>
          ) : (
            <div className="placement-empty">
              Complete a few practice questions to generate your readiness score.
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
