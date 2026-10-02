import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { usePlacement } from '../hooks/usePlacement'
import { usePlacementReadiness } from '../hooks/usePlacementReadiness'
import { placementApplicationsService } from '../services/placementApplications.service'
import { PLACEMENT_DAY_DEFINITIONS } from '../data/curriculum'

interface AnalyticsData {
  totalAttempts: number
  correctAttempts: number
  accuracy: number
  categoryBreakdown: Record<string, { correct: number; total: number; accuracy: number }>
  dailyActivity: Record<string, number>
  weeklyProgress: { week: number; accuracy: number; attempts: number }[]
  topStrengths: string[]
  topWeaknesses: number
  averageTimePerQuestion: number
  streakDays: number
  totalPracticeTime: number
}

export default function PlacementAnalytics() {
  const { user } = useAuth()
  const userId = user?.id
  const { attempts, progress } = usePlacement(userId)
  const { readiness } = usePlacementReadiness(userId)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [applications, setApplications] = useState<Awaited<ReturnType<typeof placementApplicationsService.getApplications>>>([])

  useEffect(() => {
    if (!userId) return
    void placementApplicationsService.getApplications(userId).then(setApplications)
  }, [userId])

  useEffect(() => {
    if (!userId || !attempts.length) {
      setAnalytics(null)
      return
    }

    const totalAttempts = attempts.length
    const correctAttempts = attempts.filter((a) => a.isCorrect).length
    const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0

    const categoryMap: Record<string, { correct: number; total: number }> = {}
    for (const attempt of attempts) {
      const cat = attempt.category
      if (!categoryMap[cat]) categoryMap[cat] = { correct: 0, total: 0 }
      categoryMap[cat].total += 1
      if (attempt.isCorrect) categoryMap[cat].correct += 1
    }
    const categoryBreakdown: AnalyticsData['categoryBreakdown'] = {}
    for (const [cat, data] of Object.entries(categoryMap)) {
      categoryBreakdown[cat] = {
        ...data,
        accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      }
    }

    const dailyMap: Record<string, number> = {}
    for (const attempt of attempts) {
      const day = attempt.createdAt?.slice(0, 10) ?? 'unknown'
      dailyMap[day] = (dailyMap[day] ?? 0) + 1
    }
    const dailyActivity = Object.fromEntries(
      Object.entries(dailyMap).sort((a, b) => a[0].localeCompare(b[0])).slice(-14),
    )

    const weeklyProgress: AnalyticsData['weeklyProgress'] = []
    for (let week = 1; week <= 4; week++) {
      const weekAttempts = attempts.filter((a) => {
        const day = new Date(a.createdAt ?? '').getDate()
        return day >= (week - 1) * 7 + 1 && day <= week * 7
      })
      const weekCorrect = weekAttempts.filter((a) => a.isCorrect).length
      weeklyProgress.push({
        week,
        attempts: weekAttempts.length,
        accuracy: weekAttempts.length > 0 ? Math.round((weekCorrect / weekAttempts.length) * 100) : 0,
      })
    }

    const sortedCategories = Object.entries(categoryBreakdown).sort((a, b) => b[1].accuracy - a[1].accuracy)
    const topStrengths = sortedCategories.filter(([, d]) => d.accuracy >= 70).map(([cat]) => cat).slice(0, 3)
    const topWeaknesses = sortedCategories.filter(([, d]) => d.accuracy < 60).length

    const totalTime = attempts.reduce((sum, a) => sum + (a.timeSpentSeconds ?? 0), 0)
    const averageTimePerQuestion = totalAttempts > 0 ? Math.round(totalTime / totalAttempts) : 0

    const today = new Date()
    let streakDays = 0
    for (let i = 0; i < 30; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      if (dailyMap[key]) streakDays++
      else if (i > 0) break
    }

    setAnalytics({
      totalAttempts,
      correctAttempts,
      accuracy,
      categoryBreakdown,
      dailyActivity,
      weeklyProgress,
      topStrengths,
      topWeaknesses,
      averageTimePerQuestion,
      streakDays,
      totalPracticeTime: Math.round(totalTime / 60),
    })
  }, [attempts, userId])

  if (!analytics) {
    return (
      <div className="placement-empty">
        Complete some practice questions to see your analytics dashboard.
      </div>
    )
  }

  const maxDaily = Math.max(...Object.values(analytics.dailyActivity), 1)

  return (
    <div>
      <div className="placement-card" style={{ marginBottom: 18 }}>
        <h2>Progress Analytics</h2>
        <p>
          Detailed insights into your preparation journey. Use this to identify patterns, track improvement, and focus your efforts.
        </p>
      </div>

      <div className="placement-grid cols-4" style={{ marginBottom: 18 }}>
        <div className="placement-card placement-stat">
          <span className="value">{analytics.accuracy}%</span>
          <span className="label">Overall Accuracy</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{analytics.totalAttempts}</span>
          <span className="label">Total Attempts</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{analytics.streakDays}</span>
          <span className="label">Day Streak</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{analytics.totalPracticeTime}m</span>
          <span className="label">Practice Time</span>
        </div>
      </div>

      <div className="placement-grid cols-2" style={{ marginBottom: 18 }}>
        <section className="placement-card">
          <h3>Category Breakdown</h3>
          <div style={{ marginTop: 12 }}>
            {Object.entries(analytics.categoryBreakdown)
              .sort((a, b) => b[1].accuracy - a[1].accuracy)
              .map(([cat, data]) => (
                <div key={cat} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{cat.replace(/_/g, ' ')}</span>
                    <span className={`placement-badge ${data.accuracy >= 70 ? 'good' : data.accuracy >= 50 ? 'warn' : 'bad'}`}>
                      {data.accuracy}%
                    </span>
                  </div>
                  <div className="placement-progress-track">
                    <div className="placement-progress-fill" style={{ width: `${data.accuracy}%` }} />
                  </div>
                  <p className="placement-inline-note">{data.correct}/{data.total} correct</p>
                </div>
              ))}
          </div>
        </section>

        <section className="placement-card">
          <h3>Weekly Progress</h3>
          <div style={{ marginTop: 12 }}>
            {analytics.weeklyProgress.map((week) => (
              <div key={week.week} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Week {week.week}</span>
                  <span className="placement-badge info">{week.attempts} attempts</span>
                </div>
                <div className="placement-progress-track">
                  <div className="placement-progress-fill" style={{ width: `${week.accuracy}%` }} />
                </div>
                <p className="placement-inline-note">{week.accuracy}% accuracy</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="placement-grid cols-2" style={{ marginBottom: 18 }}>
        <section className="placement-card">
          <h3>Daily Activity (Last 14 Days)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 120, marginTop: 12 }}>
            {Object.entries(analytics.dailyActivity).map(([day, count]) => (
              <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '100%',
                    height: `${(count / maxDaily) * 100}%`,
                    background: 'var(--grad-brand)',
                    borderRadius: '4px 4px 0 0',
                    minHeight: 4,
                  }}
                />
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {day.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="placement-card">
          <h3>Insights</h3>
          <ul className="placement-list" style={{ marginTop: 12 }}>
            {analytics.topStrengths.length > 0 && (
              <li>
                <div className="placement-item-body">
                  <p className="placement-item-title">Top Strengths</p>
                  <p className="placement-item-meta">{analytics.topStrengths.join(', ').replace(/_/g, ' ')}</p>
                </div>
                <span className="placement-badge good">Strong</span>
              </li>
            )}
            {analytics.topWeaknesses > 0 && (
              <li>
                <div className="placement-item-body">
                  <p className="placement-item-title">Areas Needing Focus</p>
                  <p className="placement-item-meta">{analytics.topWeaknesses} categories below 60% accuracy</p>
                </div>
                <span className="placement-badge bad">Weak</span>
              </li>
            )}
            <li>
              <div className="placement-item-body">
                <p className="placement-item-title">Average Time per Question</p>
                <p className="placement-item-meta">{analytics.averageTimePerQuestion} seconds</p>
              </div>
              <span className="placement-badge info">{analytics.averageTimePerQuestion < 60 ? 'Fast' : 'Steady'}</span>
            </li>
            {applications.length > 0 && (
              <li>
                <div className="placement-item-body">
                  <p className="placement-item-title">Applications</p>
                  <p className="placement-item-meta">{applications.length} tracked, {applications.filter((a) => a.status === 'selected').length} selected</p>
                </div>
                <span className="placement-badge good">{applications.filter((a) => a.status === 'selected').length}</span>
              </li>
            )}
          </ul>
        </section>
      </div>

      {readiness && (
        <section className="placement-card">
          <h3>Readiness Score</h3>
          <div className="placement-progress-track" style={{ marginTop: 12 }}>
            <div className="placement-progress-fill" style={{ width: `${readiness.overallScore}%` }} />
          </div>
          <p className="placement-inline-note">
            {readiness.overallScore}% overall — {readiness.isJobReady ? 'Job Ready' : 'Not yet job ready'}
          </p>
        </section>
      )}
    </div>
  )
}
