import type { SkillMatch } from '../types/jobMatch.types'

interface SkillGapAnalysisProps {
  strong: SkillMatch[]
  partial: SkillMatch[]
  missing: SkillMatch[]
}

function SkillGroup({ title, skills, variant }: { title: string; skills: SkillMatch[]; variant: 'strong' | 'partial' | 'missing' }) {
  if (skills.length === 0) return null
  return (
    <div className={`jm-skill-group jm-skill-group--${variant}`}>
      <h4 className="jm-skill-group-title">
        <span className="jm-skill-badge jm-skill-badge--{variant}">{title}</span>
        <span className="jm-skill-count">{skills.length}</span>
      </h4>
      <ul className="jm-skill-list">
        {skills.map((skill, idx) => (
          <li key={idx} className="jm-skill-item">
            <span className="jm-skill-name">{skill.name}</span>
            {skill.resumeEvidence && (
              <span className="jm-skill-evidence">{skill.resumeEvidence}</span>
            )}
            {skill.jdRequirement && (
              <span className="jm-skill-requirement">Required: {skill.jdRequirement}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function SkillGapAnalysis({ strong, partial, missing }: SkillGapAnalysisProps) {
  return (
    <div className="jm-section">
      <h3 className="jm-section-title">Skills Match</h3>
      <div className="jm-skill-gap-analysis">
        <SkillGroup title="Strong Match" skills={strong} variant="strong" />
        <SkillGroup title="Partial Match" skills={partial} variant="partial" />
        <SkillGroup title="Missing" skills={missing} variant="missing" />
      </div>
    </div>
  )
}
