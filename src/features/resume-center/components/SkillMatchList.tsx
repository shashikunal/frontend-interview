import type { SkillMatch } from '../types/resume.types'

interface SkillMatchListProps {
  skills: SkillMatch[]
}

export default function SkillMatchList({ skills }: SkillMatchListProps) {
  const matched = skills.filter((s) => s.present)
  const missing = skills.filter((s) => !s.present)
  const highPriorityMissing = missing.filter((s) => s.importance === 'high')

  if (skills.length === 0) {
    return (
      <div className="skill-match-empty">
        <p>No skill analysis available. Run a review to see skill matches.</p>
      </div>
    )
  }

  return (
    <div className="skill-match-list">
      <div className="skill-match-summary">
        <span className="skill-match-count matched">
          {matched.length} matched
        </span>
        <span className="skill-match-count missing">
          {missing.length} missing
        </span>
        {highPriorityMissing.length > 0 && (
          <span className="skill-match-count high-priority">
            {highPriorityMissing.length} high-priority gaps
          </span>
        )}
      </div>

      {matched.length > 0 && (
        <div className="skill-group">
          <h4 className="skill-group-title">Matched Skills</h4>
          <div className="skill-pills">
            {matched.map((s) => (
              <span key={s.skill} className="skill-pill present">
                {s.skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {missing.length > 0 && (
        <div className="skill-group">
          <h4 className="skill-group-title">Missing Skills</h4>
          <div className="skill-pills">
            {missing.map((s) => (
              <span
                key={s.skill}
                className={`skill-pill missing ${s.importance === 'high' ? 'high-priority' : ''}`}
              >
                {s.skill}
                {s.importance === 'high' && <span className="skill-priority-badge">!</span>}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
