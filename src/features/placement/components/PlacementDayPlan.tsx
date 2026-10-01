import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { usePlacement } from '../hooks/usePlacement'
import { PLACEMENT_DAY_DEFINITIONS, PLACEMENT_PHASES } from '../data/curriculum'
import { placementService } from '../services/placement.service'

export default function PlacementDayPlan() {
  const { user } = useAuth()
  const { progress, refresh } = usePlacement(user?.id)
  const [phaseFilter, setPhaseFilter] = useState<string>('all')
  const [selectedDay, setSelectedDay] = useState<number>(progress?.currentDay ?? 1)

  const days =
    phaseFilter === 'all'
      ? PLACEMENT_DAY_DEFINITIONS
      : PLACEMENT_DAY_DEFINITIONS.filter((d) => d.phase === phaseFilter)

  const current = PLACEMENT_DAY_DEFINITIONS.find((d) => d.dayNumber === selectedDay)
  const topics = current ? placementService.getTopicsForDay(current.dayNumber) : []
  const daysCompleted = progress?.daysCompleted ?? []

  return (
    <div>
      <div className="placement-card" style={{ marginBottom: 18 }}>
        <h2>30-Day Curriculum</h2>
        <p>
          Each day has a phase, a focus and a set of topics that deep-link into the existing
          practice studios. Nothing here duplicates those studios — the placement module is the
          journey and the readiness layer on top.
        </p>
        <div className="placement-form" style={{ marginTop: 12 }}>
          <div className="placement-form-row">
            <label>
              Filter by phase
              <select value={phaseFilter} onChange={(e) => setPhaseFilter(e.target.value)}>
                <option value="all">All phases</option>
                {PLACEMENT_PHASES.map((phase) => (
                  <option key={phase} value={phase}>
                    {phase}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Jump to day
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(Number(e.target.value))}
              >
                {PLACEMENT_DAY_DEFINITIONS.map((d) => (
                  <option key={d.dayNumber} value={d.dayNumber}>
                    Day {d.dayNumber} — {d.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="placement-grid cols-2">
        <section className="placement-card">
          <h2>Days</h2>
          <ul className="placement-list">
            {days.map((day) => {
              const done = daysCompleted.includes(day.dayNumber)
              const isCurrent = day.dayNumber === (progress?.currentDay ?? 1)
              return (
                <li
                  key={day.dayNumber}
                  className={done ? 'done' : undefined}
                  style={{
                    cursor: 'pointer',
                    borderColor: isCurrent ? 'var(--accent)' : undefined,
                  }}
                  onClick={() => setSelectedDay(day.dayNumber)}
                >
                  <span className="placement-badge">{day.dayNumber}</span>
                  <div className="placement-item-body">
                    <p className="placement-item-title">{day.title}</p>
                    <p className="placement-item-meta">
                      {day.phase} · {day.focus}
                    </p>
                  </div>
                  {day.isMilestone && <span className="placement-badge info">Milestone</span>}
                  <span className={`placement-badge ${done ? 'good' : isCurrent ? 'warn' : ''}`}>
                    {done ? 'Done' : isCurrent ? 'Current' : 'Upcoming'}
                  </span>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="placement-card">
          {current ? (
            <>
              <h2>
                Day {current.dayNumber}: {current.title}
              </h2>
              <p className="placement-inline-note">
                {current.phase} · {current.focus}
              </p>
              <p>{current.description}</p>

              <h3 style={{ marginTop: 18 }}>Goals</h3>
              <ul style={{ margin: '8px 0', paddingLeft: 18, color: 'var(--text-secondary)' }}>
                {current.goals.map((goal) => (
                  <li key={goal} style={{ marginBottom: 6 }}>
                    {goal}
                  </li>
                ))}
              </ul>

              <h3 style={{ marginTop: 18 }}>Topics</h3>
              <ul className="placement-list" style={{ marginTop: 10 }}>
                {topics.map((topic) => (
                  <li key={topic.id}>
                    <div className="placement-item-body">
                      <p className="placement-item-title">{topic.name}</p>
                      <p className="placement-item-meta">
                        {topic.description} · ~{topic.expectedMinutes} min · {topic.category}
                      </p>
                    </div>
                    {topic.resourceRoute ? (
                      <Link className="btn btn-sm" to={topic.resourceRoute}>
                        Open
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ul>

              <div className="placement-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    if (!user?.id) return
                    void placementService.markDayComplete(user.id, current.dayNumber).then(refresh)
                  }}
                >
                  Mark day {current.dayNumber} complete
                </button>
                <Link className="btn" to="/placement?view=practice">
                  Start practice
                </Link>
              </div>
            </>
          ) : (
            <div className="placement-empty">Select a day to see its plan.</div>
          )}
        </section>
      </div>
    </div>
  )
}
