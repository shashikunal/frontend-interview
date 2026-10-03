import type { SectionReviewResult } from '../types/resume.types'

interface SectionReviewProps {
  reviews: SectionReviewResult[]
}

function getScoreClass(score: number): string {
  if (score >= 75) return 'good'
  if (score >= 50) return 'warn'
  return 'bad'
}

export default function SectionReview({ reviews }: SectionReviewProps) {
  if (reviews.length === 0) {
    return (
      <div className="section-review-empty">
        <p>No section reviews available. Run a review to see detailed feedback.</p>
      </div>
    )
  }

  return (
    <div className="section-review-list">
      {reviews.map((review) => (
        <div key={review.section} className="section-review-card">
          <div className="section-review-header">
            <span className="section-review-title">{review.title}</span>
            <span className={`section-review-score ${getScoreClass(review.score)}`}>
              {review.score}%
            </span>
          </div>
          <p className="section-review-feedback">{review.feedback}</p>
          {review.suggestions.length > 0 && (
            <div className="section-review-suggestions">
              <span className="suggestions-label">Suggestions:</span>
              <ul>
                {review.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
