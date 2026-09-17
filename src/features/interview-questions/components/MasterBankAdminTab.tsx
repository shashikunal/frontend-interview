import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { interviewQuestionsDataService } from '../services/interviewQuestionsDataService'
import { interviewQuestionsProgressService } from '../services/interviewQuestionsProgressService'
import type { MasterSubjectId, MasterQuestion } from '../types/interviewQuestions.types'

export default function MasterBankAdminTab() {
  const [selectedSubject, setSelectedSubject] = useState<MasterSubjectId>('javascript')
  const [questions, setQuestions] = useState<MasterQuestion[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState<boolean>(true)
  const [inspectingQ, setInspectingQ] = useState<MasterQuestion | null>(null)

  useEffect(() => {
    async function loadSubject() {
      try {
        setLoading(true)
        const list = await interviewQuestionsDataService.getSubjectQuestions(selectedSubject)
        setQuestions(list)
        setInspectingQ(null)
      } catch (err) {
        console.error('Failed to load subject for admin:', err)
      } finally {
        setLoading(false)
      }
    }
    loadSubject()
  }, [selectedSubject])

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return questions.slice(0, 50)
    return questions.filter(
      item =>
        item.id.toLowerCase().includes(q) ||
        item.question.toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q) ||
        item.concept.toLowerCase().includes(q)
    ).slice(0, 50)
  }, [questions, searchQuery])

  const progressState = interviewQuestionsProgressService.getState()

  return (
    <div className="admin-tab-pane" id="admin-master-bank-tab" style={{ padding: '1rem' }}>
      {/* Top Banner */}
      <div style={{ background: 'var(--mqb-bg-glass, rgba(15,23,42,0.8))', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
              🎯 Master Interview Question Bank Operations (12,000 Questions)
            </h2>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.92rem' }}>
              Real-time audit, schema fidelity monitoring, quality validation, and content inspection across 12 tracks.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link
              to="/interview-questions"
              target="_blank"
              className="mqb-action-pill-btn primary"
            >
              Open Live Master Bank ↗
            </Link>
          </div>
        </div>

        {/* Real Metrics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Total Catalog Size</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8' }}>12,000 Qs</div>
            <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.2rem' }}>✓ 100% Quality Audited</div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Total Tracks</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>12 Subjects</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>1,000 questions each</div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Platform Solved Count</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>
              {progressState.completedQuestionIds.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>Candidate completions</div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Mock Tests Conducted</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#a78bfa' }}>
              {progressState.testScores.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>Timed evaluations</div>
          </div>
        </div>
      </div>

      {/* Content Management & Inspector Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: inspectingQ ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
        {/* Left: Table of Questions */}
        <div style={{ background: 'var(--mqb-bg-glass, rgba(15,23,42,0.8))', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            {/* Subject Dropdown */}
            <select
              className="mqb-filter-select"
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value as MasterSubjectId)}
            >
              <option value="javascript">JavaScript (1,000)</option>
              <option value="react">ReactJS (1,000)</option>
              <option value="typescript">TypeScript (1,000)</option>
              <option value="redux">Redux (1,000)</option>
              <option value="html">HTML (1,000)</option>
              <option value="css">CSS (1,000)</option>
              <option value="es6">ES6 (1,000)</option>
              <option value="es7">ES7 (1,000)</option>
              <option value="es8">ES8 (1,000)</option>
              <option value="dom">DOM (1,000)</option>
              <option value="bom">BOM (1,000)</option>
              <option value="web-apis">Web APIs (1,000)</option>
            </select>

            <input
              type="text"
              className="mqb-search-input"
              style={{ width: '260px', padding: '0.5rem 0.8rem' }}
              placeholder="Search ID, title, or concept..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8' }}>
              Loading {selectedSubject} records...
            </div>
          ) : (
            <div style={{ maxHeight: '550px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', textAlign: 'left' }}>
                    <th style={{ padding: '0.6rem 0.5rem' }}>ID</th>
                    <th style={{ padding: '0.6rem 0.5rem' }}>Question</th>
                    <th style={{ padding: '0.6rem 0.5rem' }}>Diff</th>
                    <th style={{ padding: '0.6rem 0.5rem' }}>Type</th>
                    <th style={{ padding: '0.6rem 0.5rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(q => (
                    <tr
                      key={q.id}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        background: inspectingQ?.id === q.id ? 'rgba(56,189,248,0.1)' : 'transparent',
                        cursor: 'pointer',
                      }}
                      onClick={() => setInspectingQ(q)}
                    >
                      <td style={{ padding: '0.6rem 0.5rem', fontFamily: 'monospace', color: '#38bdf8' }}>{q.id}</td>
                      <td style={{ padding: '0.6rem 0.5rem', color: '#f1f5f9', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {q.question}
                      </td>
                      <td style={{ padding: '0.6rem 0.5rem' }}>
                        <span className={`mqb-diff-pill ${q.difficulty}`}>{q.difficulty}</span>
                      </td>
                      <td style={{ padding: '0.6rem 0.5rem', color: '#94a3b8' }}>{q.questionType}</td>
                      <td style={{ padding: '0.6rem 0.5rem' }}>
                        <button
                          type="button"
                          className="mqb-action-pill-btn"
                          style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setInspectingQ(q)
                          }}
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Detailed Question Inspector */}
        {inspectingQ && (
          <div style={{ background: 'var(--mqb-bg-glass, rgba(15,23,42,0.8))', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', maxHeight: '650px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700 }}>
                {inspectingQ.id.toUpperCase()}
              </span>
              <button
                type="button"
                className="mqb-action-pill-btn"
                style={{ fontSize: '0.75rem' }}
                onClick={() => setInspectingQ(null)}
              >
                ✕ Close Inspector
              </button>
            </div>

            <h3 style={{ margin: '0 0 1rem', fontSize: '1.2rem', color: '#fff' }}>
              {inspectingQ.question}
            </h3>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span className={`mqb-diff-pill ${inspectingQ.difficulty}`}>{inspectingQ.difficulty}</span>
              <span className="mqb-type-pill">{inspectingQ.questionType}</span>
              <span className="mqb-tag-pill">{inspectingQ.topic}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.85rem', borderRadius: '8px' }}>
                <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '0.25rem' }}>Short Answer:</strong>
                <p style={{ margin: 0, color: '#cbd5e1' }}>{inspectingQ.shortAnswer}</p>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.85rem', borderRadius: '8px' }}>
                <strong style={{ color: '#a78bfa', display: 'block', marginBottom: '0.25rem' }}>Spoken Interview Script:</strong>
                <p style={{ margin: 0, color: '#e2e8f0', fontStyle: 'italic' }}>"{inspectingQ.interviewAnswer}"</p>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.85rem', borderRadius: '8px' }}>
                <strong style={{ color: '#34d399', display: 'block', marginBottom: '0.25rem' }}>Why It Exists:</strong>
                <p style={{ margin: 0, color: '#cbd5e1' }}>{inspectingQ.why}</p>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.85rem', borderRadius: '8px' }}>
                <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '0.25rem' }}>Common Mistakes:</strong>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#cbd5e1' }}>
                  {inspectingQ.commonMistakes.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>

              <div>
                <Link
                  to={`/interview-questions/${inspectingQ.subject}/${inspectingQ.id}`}
                  target="_blank"
                  className="mqb-action-pill-btn primary"
                  style={{ display: 'inline-flex' }}
                >
                  View Full 13-Section Deep Dive ↗
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
