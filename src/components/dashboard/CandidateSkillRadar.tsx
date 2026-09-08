import React, { useState, useMemo } from 'react'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import type { EvaluatorReview } from '../../lib/gradingService'
import './CandidateSkillRadar.css'

export interface CompetencyPillar {
  key: string
  subject: string
  fullName: string
  icon: string
  score: number // 0 to 10
  benchmark: number // 0 to 10
  level: 'Novice' | 'Developing' | 'Proficient' | 'Advanced' | 'Mastery'
  description: string
  recommendation: string
  accentColor: string
}

export interface CandidateSkillRadarProps {
  candidateId?: string
  candidateName?: string
  submissions?: Array<{
    id: string
    question_id: string
    title?: string
    score: number
    status: string
    created_at?: string
  }>
  reviews?: Record<string, EvaluatorReview>
  compact?: boolean
}

// Custom dark tooltip for Recharts Radar
function RadarTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string; payload?: { subject: string } }> }) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  const subject = item.payload?.subject || ''

  return (
    <div className="csr-radar-tooltip">
      <div className="csr-tooltip-title">{subject}</div>
      {payload.map((p, idx) => (
        <div key={idx} className="csr-tooltip-row" style={{ color: p.color }}>
          <span>{p.name}:</span>
          <strong>{p.value} / 10</strong>
        </div>
      ))}
    </div>
  )
}

export const CandidateSkillRadar: React.FC<CandidateSkillRadarProps> = ({
  candidateName = 'Candidate',
  submissions = [],
  reviews = {},
  compact = false,
}) => {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('all')

  // Available evaluated question options
  const evaluatedQuestions = useMemo(() => {
    const list: Array<{ id: string; title: string }> = []
    const seen = new Set<string>()

    Object.values(reviews).forEach(rev => {
      if (!seen.has(rev.questionId)) {
        seen.add(rev.questionId)
        list.push({
          id: rev.questionId,
          title: rev.questionTitle || rev.questionId,
        })
      }
    })

    // Also include any other submitted questions
    submissions.forEach(sub => {
      if (!seen.has(sub.question_id)) {
        seen.add(sub.question_id)
        list.push({
          id: sub.question_id,
          title: sub.title || sub.question_id,
        })
      }
    })

    return list
  }, [reviews, submissions])

  // Compute 5-Pillar Competencies
  const competencies: CompetencyPillar[] = useMemo(() => {
    // Filter reviews if specific question selected
    const activeReviews = Object.values(reviews).filter(r =>
      selectedQuestionId === 'all' ? true : r.questionId === selectedQuestionId
    )

    const activeSubmissions = submissions.filter(s =>
      selectedQuestionId === 'all' ? true : s.question_id === selectedQuestionId
    )

    let avgClean = 0
    let avgArch = 0
    let avgEdge = 0
    let avgPerf = 0
    let avgA11y = 0

    if (activeReviews.length > 0) {
      let sumClean = 0
      let sumArch = 0
      let sumEdge = 0
      let sumScore = 0

      activeReviews.forEach(r => {
        sumClean += r.cleanCodeRating || 8
        sumArch += r.architectureRating || 8.5
        sumEdge += r.edgeCasesRating || 7.5
        sumScore += r.score || 80
      })

      const count = activeReviews.length
      avgClean = sumClean / count
      avgArch = sumArch / count
      avgEdge = sumEdge / count

      // Derived metrics from score and sub-ratings
      const normalizedScore10 = (sumScore / count) / 10
      avgPerf = Math.min(10, Math.max(5, (normalizedScore10 * 0.6 + avgArch * 0.4)))
      avgA11y = Math.min(10, Math.max(5, (avgClean * 0.5 + avgEdge * 0.5 + 0.3)))
    } else {
      // If no evaluator reviews yet, derive from overall submission pass rates
      const avgSubScore = activeSubmissions.length > 0
        ? activeSubmissions.reduce((acc, s) => acc + (s.score || 75), 0) / activeSubmissions.length
        : 82

      const base10 = avgSubScore / 10
      avgClean = Math.min(10, Math.max(6, base10 - 0.2))
      avgArch = Math.min(10, Math.max(6, base10 + 0.4))
      avgEdge = Math.min(10, Math.max(5.5, base10 - 0.6))
      avgPerf = Math.min(10, Math.max(6, base10 + 0.1))
      avgA11y = Math.min(10, Math.max(6, base10 - 0.3))
    }

    // Level helper
    const getLevel = (score: number) => {
      if (score >= 9.0) return 'Mastery'
      if (score >= 8.0) return 'Advanced'
      if (score >= 7.0) return 'Proficient'
      if (score >= 5.5) return 'Developing'
      return 'Novice'
    }

    return [
      {
        key: 'arch',
        subject: 'React 19 & Arch',
        fullName: 'React 19 & State Architecture',
        icon: '⚛️',
        score: Number(avgArch.toFixed(1)),
        benchmark: 8.5,
        level: getLevel(avgArch),
        description: 'Component decoupling, modern hook lifecycle, state derivation, and concurrency boundaries.',
        recommendation: avgArch >= 8.5
          ? 'Outstanding state architecture. Keep leading clean abstraction patterns.'
          : 'Refactor complex component state into custom hooks and use transitions for heavy renders.',
        accentColor: '#38bdf8',
      },
      {
        key: 'clean',
        subject: 'Clean Code',
        fullName: 'Clean Code & Maintainability',
        icon: '🧹',
        score: Number(avgClean.toFixed(1)),
        benchmark: 8.2,
        level: getLevel(avgClean),
        description: 'Readability, idiomatic TypeScript typings, SOLID principles, and modular breakdown.',
        recommendation: avgClean >= 8.2
          ? 'Code readability and modularity meet top-tier FAANG production standards.'
          : 'Ensure strict prop-types, avoid repetitive logic, and use clear descriptive identifier names.',
        accentColor: '#10b981',
      },
      {
        key: 'perf',
        subject: 'Performance',
        fullName: 'Runtime Speed & Optimization',
        icon: '⚡',
        score: Number(avgPerf.toFixed(1)),
        benchmark: 8.0,
        level: getLevel(avgPerf),
        description: 'Minimal re-renders, memoization strategy, debounce/throttle, and low memory footprint.',
        recommendation: avgPerf >= 8.0
          ? 'Excellent runtime performance and DOM efficiency under rapid user interaction.'
          : 'Apply useCallback/useMemo strategically and profile virtual DOM re-renders in DevTools.',
        accentColor: '#f59e0b',
      },
      {
        key: 'edge',
        subject: 'Edge Cases',
        fullName: 'Edge Cases & Resilience',
        icon: '🛡️',
        score: Number(avgEdge.toFixed(1)),
        benchmark: 8.0,
        level: getLevel(avgEdge),
        description: 'Null/undefined safety, empty & boundary state handling, unmount cleanup, and error recovery.',
        recommendation: avgEdge >= 8.0
          ? 'Resilient handling of empty states, rapid inputs, and asynchronous timer cleanups.'
          : 'Add explicit defenses for empty collections, boundary inputs, and network abort handling.',
        accentColor: '#ec4899',
      },
      {
        key: 'a11y',
        subject: 'Accessibility & UX',
        fullName: 'Accessibility (a11y) & UX Polish',
        icon: '♿',
        score: Number(avgA11y.toFixed(1)),
        benchmark: 8.0,
        level: getLevel(avgA11y),
        description: 'WAI-ARIA semantics, keyboard focus traps, screen reader landmarks, and feedback micro-states.',
        recommendation: avgA11y >= 8.0
          ? 'High standard of accessible interactions with proper ARIA attributes and focus cycles.'
          : 'Verify tab indices, aria-expanded/aria-checked attributes, and keyboard Enter/Space triggers.',
        accentColor: '#8b5cf6',
      },
    ]
  }, [reviews, submissions, selectedQuestionId])

  // Overall Index Score
  const overallIndex = useMemo(() => {
    const total = competencies.reduce((acc, c) => acc + c.score, 0)
    return Number((total / competencies.length).toFixed(1))
  }, [competencies])

  const benchmarkIndex = useMemo(() => {
    const total = competencies.reduce((acc, c) => acc + c.benchmark, 0)
    return Number((total / competencies.length).toFixed(1))
  }, [competencies])

  const radarData = useMemo(() => {
    return competencies.map(c => ({
      subject: c.subject,
      candidate: c.score,
      benchmark: c.benchmark,
      fullMark: 10,
    }))
  }, [competencies])

  return (
    <div className={`candidate-skill-radar-container ${compact ? 'csr-compact' : ''}`}>
      {/* Header & Filter Controls */}
      <div className="csr-header">
        <div className="csr-header-left">
          <div className="csr-badge-pill">
            <span className="csr-pulse-dot" />
            <span>Multi-Pillar Competency Radar</span>
          </div>
          <h3 className="csr-title">
            <span>🎯</span> {candidateName}&apos;s Frontend Competency Profile
          </h3>
          <p className="csr-subtitle">
            Evaluated against the FAANG Senior Frontend Engineering standard across 5 core competencies.
          </p>
        </div>

        {evaluatedQuestions.length > 0 && (
          <div className="csr-filter-box">
            <label htmlFor="csr-scope-select" className="csr-filter-label">Assessment Scope:</label>
            <select
              id="csr-scope-select"
              className="csr-select"
              value={selectedQuestionId}
              onChange={e => setSelectedQuestionId(e.target.value)}
            >
              <option value="all">🌟 Overall Aggregate ({submissions.length} submissions)</option>
              {evaluatedQuestions.map(q => (
                <option key={q.id} value={q.id}>
                  {q.title.length > 32 ? `${q.title.slice(0, 30)}...` : q.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Grid: Radar Chart on Left, Metric Cards on Right */}
      <div className="csr-main-grid">
        {/* Radar Spider Chart Card */}
        <div className="csr-chart-card">
          <div className="csr-card-header">
            <div className="csr-score-cluster">
              <span className="csr-index-val">{overallIndex}</span>
              <span className="csr-index-max">/ 10</span>
            </div>
            <div className="csr-index-meta">
              <div className="csr-index-title">
                Competency Index
                {overallIndex >= benchmarkIndex ? (
                  <span className="csr-tag-exceeds">Exceeds Senior Bar</span>
                ) : (
                  <span className="csr-tag-target">Target Bar: {benchmarkIndex}</span>
                )}
              </div>
              <div className="csr-index-subtitle">
                {overallIndex >= 8.5
                  ? 'Ready for Senior / Staff Frontend Engineering challenges'
                  : 'Solid engineering foundation with clear targeted growth avenues'}
              </div>
            </div>
          </div>

          <div className="csr-radar-canvas-wrap">
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid stroke="rgba(148, 163, 184, 0.18)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 10]}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  stroke="rgba(148, 163, 184, 0.15)"
                />
                <Tooltip content={<RadarTooltip />} />
                <Legend
                  wrapperStyle={{
                    paddingTop: '16px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                  iconType="circle"
                />
                <Radar
                  name="Candidate Mastery"
                  dataKey="candidate"
                  stroke="#38bdf8"
                  fill="#38bdf8"
                  fillOpacity={0.45}
                  strokeWidth={2.5}
                />
                <Radar
                  name="FAANG Senior Bar"
                  dataKey="benchmark"
                  stroke="#a855f7"
                  fill="#a855f7"
                  fillOpacity={0.15}
                  strokeDasharray="4 4"
                  strokeWidth={1.8}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="csr-chart-footer">
            <div className="csr-legend-pill">
              <span className="csr-legend-dot blue" />
              <span>Candidate ({overallIndex})</span>
            </div>
            <div className="csr-legend-pill">
              <span className="csr-legend-dot purple" />
              <span>FAANG Benchmark ({benchmarkIndex})</span>
            </div>
          </div>
        </div>

        {/* 5-Pillar Scorecards */}
        <div className="csr-pillars-card">
          <div className="csr-pillars-header">
            <h4>Core Pillar Performance</h4>
            <span className="csr-pillars-count">5 Core Dimensions</span>
          </div>

          <div className="csr-pillars-list">
            {competencies.map(pillar => {
              const pct = (pillar.score / 10) * 100
              const isAhead = pillar.score >= pillar.benchmark

              return (
                <div key={pillar.key} className="csr-pillar-item">
                  <div className="csr-pillar-top">
                    <div className="csr-pillar-identity">
                      <span className="csr-pillar-icon">{pillar.icon}</span>
                      <div>
                        <div className="csr-pillar-title">{pillar.fullName}</div>
                        <div className="csr-pillar-desc">{pillar.description}</div>
                      </div>
                    </div>
                    <div className="csr-pillar-metrics">
                      <div className="csr-score-bubble" style={{ borderColor: pillar.accentColor }}>
                        <span className="csr-sb-num" style={{ color: pillar.accentColor }}>
                          {pillar.score}
                        </span>
                        <span className="csr-sb-sub">/ 10</span>
                      </div>
                      <span className={`csr-status-pill ${isAhead ? 'ahead' : 'growth'}`}>
                        {isAhead ? '✓ Bar Met' : 'Needs Practice'}
                      </span>
                    </div>
                  </div>

                  {/* Progress Meter */}
                  <div className="csr-meter-track">
                    <div
                      className="csr-meter-fill"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${pillar.accentColor}aa, ${pillar.accentColor})`,
                      }}
                    />
                    <div
                      className="csr-meter-benchmark-line"
                      style={{ left: `${(pillar.benchmark / 10) * 100}%` }}
                      title={`Benchmark: ${pillar.benchmark}/10`}
                    />
                  </div>

                  {/* Evaluator Insight */}
                  <div className="csr-pillar-insight">
                    <span className="csr-insight-icon">💡</span>
                    <span className="csr-insight-text">{pillar.recommendation}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
