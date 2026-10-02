import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { usePlacement } from '../hooks/usePlacement'
import { getQuestionById } from '../data/questions'

interface Mistake {
  questionId: string
  question: string
  category: string
  subcategory: string
  userAnswer: string
  correctAnswer: string
  explanation: string
  timestamp: string
  reviewed: boolean
}

export default function MistakeBook() {
  const { user } = useAuth()
  const userId = user?.id
  const { attempts } = usePlacement(userId)
  const [mistakes, setMistakes] = useState<Mistake[]>([])
  const [filter, setFilter] = useState<'all' | 'unreviewed' | 'reviewed'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    if (!userId || !attempts.length) {
      setMistakes([])
      return
    }

    const failedAttempts = attempts
      .filter((a) => !a.isCorrect)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 100)

    const mistakeList: Mistake[] = failedAttempts
      .map((attempt) => {
        const question = getQuestionById(attempt.questionId)
        if (!question) return null
        return {
          questionId: attempt.questionId,
          question: question.prompt,
          category: attempt.category,
          subcategory: attempt.subcategory,
          userAnswer: attempt.selectedAnswer ?? '',
          correctAnswer: question.correctAnswer ?? '',
          explanation: question.explanation ?? '',
          timestamp: attempt.createdAt ?? new Date().toISOString(),
          reviewed: false,
        }
      })
      .filter((m): m is Mistake => m !== null)

    setMistakes(mistakeList)
  }, [userId, attempts])

  const categories = [...new Set(mistakes.map((m) => m.category))]

  const filtered = mistakes.filter((m) => {
    if (filter === 'unreviewed' && m.reviewed) return false
    if (filter === 'reviewed' && !m.reviewed) return false
    if (categoryFilter !== 'all' && m.category !== categoryFilter) return false
    return true
  })

  const markReviewed = (questionId: string) => {
    setMistakes((prev) =>
      prev.map((m) => (m.questionId === questionId ? { ...m, reviewed: true } : m)),
    )
  }

  const unreviewedCount = mistakes.filter((m) => !m.reviewed).length

  return (
    <div>
      <div className="placement-card" style={{ marginBottom: 18 }}>
        <h2>Mistake Book</h2>
        <p>
          Review your mistakes to learn from them. Each mistake shows the question, your answer,
          the correct answer, and an explanation.
        </p>
        {unreviewedCount > 0 && (
          <p className="placement-inline-note" style={{ marginTop: 8 }}>
            You have {unreviewedCount} unreviewed {unreviewedCount === 1 ? 'mistake' : 'mistakes'}.
          </p>
        )}
        <div className="placement-actions" style={{ marginTop: 12 }}>
          {(['all', 'unreviewed', 'reviewed'] as const).map((f) => (
            <button
              key={f}
              type="button"
              className={`btn btn-sm ${filter === f ? 'btn-primary' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        {categories.length > 0 && (
          <div className="placement-actions" style={{ marginTop: 8 }}>
            <button
              type="button"
              className={`btn btn-sm ${categoryFilter === 'all' ? 'btn-primary' : ''}`}
              onClick={() => setCategoryFilter('all')}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm ${categoryFilter === cat ? 'btn-primary' : ''}`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="placement-list">
          {filtered.map((mistake) => (
            <div
              key={mistake.questionId}
              className="placement-card"
              style={{
                marginBottom: 12,
                borderLeft: mistake.reviewed ? '4px solid #16a34a' : '4px solid #dc2626',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span className="placement-badge info">{mistake.category}</span>
                    <span className="placement-badge">{mistake.subcategory}</span>
                    {mistake.reviewed && <span className="placement-badge good">Reviewed</span>}
                  </div>
                  <p style={{ fontWeight: 600, marginBottom: 8 }}>{mistake.question}</p>
                  <div style={{ marginBottom: 8 }}>
                    <p style={{ color: '#dc2626', fontSize: '0.9rem' }}>
                      <strong>Your answer:</strong> {mistake.userAnswer}
                    </p>
                    <p style={{ color: '#16a34a', fontSize: '0.9rem' }}>
                      <strong>Correct answer:</strong> {mistake.correctAnswer}
                    </p>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <strong>Explanation:</strong> {mistake.explanation}
                  </p>
                  <p className="placement-inline-note" style={{ marginTop: 8 }}>
                    {new Date(mistake.timestamp).toLocaleString()}
                  </p>
                </div>
                {!mistake.reviewed && (
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => markReviewed(mistake.questionId)}
                  >
                    Mark Reviewed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="placement-empty">
          No mistakes found. Keep practicing to maintain your accuracy!
        </div>
      )}
    </div>
  )
}
