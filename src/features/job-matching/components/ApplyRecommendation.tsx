import type { ApplyRecommendation as ApplyRecommendationType } from '../types/jobMatch.types'

interface ApplyRecommendationProps {
  recommendation: ApplyRecommendationType
}

export default function ApplyRecommendation({ recommendation }: ApplyRecommendationProps) {
  const { shouldApply, confidence, reasons, improvements } = recommendation

  return (
    <div className="jm-section">
      <h3 className="jm-section-title">Should I Apply?</h3>
      <div className={`jm-apply-recommendation ${shouldApply ? 'jm-apply--yes' : 'jm-apply--no'}`}>
        <div className="jm-apply-verdict">
          <span className="jm-apply-icon">{shouldApply ? '✅' : '⚠️'}</span>
          <div>
            <div className="jm-apply-decision">
              {shouldApply ? 'Yes, you should apply' : 'Proceed with caution'}
            </div>
            <div className="jm-apply-confidence">
              Confidence: <strong>{confidence}</strong>
            </div>
          </div>
        </div>

        {reasons.length > 0 && (
          <div className="jm-apply-reasons">
            <h4>Why</h4>
            <ul>
              {reasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        {improvements.length > 0 && (
          <div className="jm-apply-improvements">
            <h4>Before Applying</h4>
            <ul>
              {improvements.map((improvement, idx) => (
                <li key={idx}>{improvement}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
