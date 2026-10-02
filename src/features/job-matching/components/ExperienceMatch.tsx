import type { ExperienceAnalysis, ResponsibilityMatch } from '../types/jobMatch.types'

interface ExperienceMatchProps {
  experience: ExperienceAnalysis
  responsibilities: ResponsibilityMatch[]
}

export default function ExperienceMatch({ experience, responsibilities }: ExperienceMatchProps) {
  return (
    <div className="jm-section">
      <h3 className="jm-section-title">Experience Match</h3>

      <div className="jm-experience-analysis">
        <div className="jm-exp-grid">
          <div className="jm-exp-item">
            <span className="jm-exp-label">Required</span>
            <span className="jm-exp-value">{experience.requiredYears ?? 'N/A'} years</span>
          </div>
          <div className="jm-exp-item">
            <span className="jm-exp-label">Your Experience</span>
            <span className="jm-exp-value">{experience.candidateYears ?? 'N/A'} years</span>
          </div>
          <div className="jm-exp-item">
            <span className="jm-exp-label">Gap</span>
            <span className={`jm-exp-value ${experience.gap > 0 ? 'jm-exp-gap' : 'jm-exp-match'}`}>
              {experience.gap > 0 ? `${experience.gap} years` : 'None'}
            </span>
          </div>
        </div>

        {experience.notes.length > 0 && (
          <ul className="jm-exp-notes">
            {experience.notes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        )}
      </div>

      {responsibilities.length > 0 && (
        <div className="jm-responsibility-match">
          <h4 className="jm-subsection-title">Responsibility Coverage</h4>
          <ul className="jm-responsibility-list">
            {responsibilities.map((resp, idx) => (
              <li key={idx} className={`jm-responsibility-item ${resp.covered ? 'jm-resp-covered' : 'jm-resp-uncovered'}`}>
                <span className="jm-resp-icon">{resp.covered ? '✓' : '✗'}</span>
                <div>
                  <span className="jm-resp-text">{resp.responsibility}</span>
                  {resp.evidence && <span className="jm-resp-evidence">{resp.evidence}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
