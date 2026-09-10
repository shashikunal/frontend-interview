// src/components/frontendjs/components/FrontendJsTestPanel.tsx
import { useState } from 'react'
import type { FrontendJsTestCase, FrontendJsRunResult, FrontendJsSubmission } from '../data/frontendJsTypes'

interface Props {
  testCases: FrontendJsTestCase[]
  runResult: FrontendJsRunResult | null
  isRunning: boolean
  activeTab: 'testcase' | 'result' | 'submissions'
  setActiveTab: (tab: 'testcase' | 'result' | 'submissions') => void
  submissions: FrontendJsSubmission[]
  fullscreenPanel?: 'none' | 'specs' | 'editor' | 'preview'
  onToggleFullscreen?: () => void
}

export function FrontendJsTestPanel({
  testCases,
  runResult,
  isRunning,
  activeTab,
  setActiveTab,
  submissions,
  fullscreenPanel = 'none',
  onToggleFullscreen,
}: Props) {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState<number>(0)

  return (
    <div className="mc-preview-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Canonical MC Panel Header */}
      <div className="mc-panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div className="mc-spec-tabs-list" style={{ borderBottom: 'none' }}>
            <button
              type="button"
              className={`mc-spec-tab ${activeTab === 'testcase' ? 'active' : ''}`}
              onClick={() => setActiveTab('testcase')}
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              🧪 Test Cases ({testCases.length})
            </button>
            <button
              type="button"
              className={`mc-spec-tab ${activeTab === 'result' ? 'active' : ''}`}
              onClick={() => setActiveTab('result')}
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              📊 Results {runResult ? (runResult.success ? `(✓ ${runResult.passedCount}/${runResult.totalCount})` : `(✗ ${runResult.passedCount}/${runResult.totalCount})`) : ''}
            </button>
            <button
              type="button"
              className={`mc-spec-tab ${activeTab === 'submissions' ? 'active' : ''}`}
              onClick={() => setActiveTab('submissions')}
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              🕒 History ({submissions.length})
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {runResult && (
            <span className={`mc-status-pill ${runResult.success ? 'completed' : 'attempted'}`} style={{ fontSize: '11px' }}>
              {runResult.status} ({runResult.totalRuntimeMs}ms)
            </span>
          )}
          {onToggleFullscreen && (
            <button
              type="button"
              className={`mc-icon-tool-btn ${fullscreenPanel === 'preview' ? 'active' : ''}`}
              onClick={onToggleFullscreen}
              title={fullscreenPanel === 'preview' ? 'Restore Test Panel Size (Esc)' : 'Maximize Test Panel (Fullscreen)'}
            >
              {fullscreenPanel === 'preview' ? '⤓' : '⛶'}
            </button>
          )}
        </div>
      </div>

      {/* Body Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: 'rgba(15, 23, 42, 0.4)' }}>
        {isRunning && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: '#94a3b8' }}>
            <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
            <span>Running assertions in sandboxed environment...</span>
          </div>
        )}

        {/* TAB 1: TEST CASES */}
        {!isRunning && activeTab === 'testcase' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
              {testCases.map((tc, idx) => (
                <button
                  key={tc.id}
                  type="button"
                  className={`mc-action-btn ${selectedCaseIdx === idx ? 'mc-btn-solved-toggle solved' : ''}`}
                  onClick={() => setSelectedCaseIdx(idx)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '12px',
                    borderRadius: '6px',
                    background: selectedCaseIdx === idx ? undefined : 'rgba(30, 41, 59, 0.6)',
                  }}
                >
                  Case {idx + 1}
                </button>
              ))}
            </div>

            {testCases[selectedCaseIdx] && (
              <div className="mc-spec-example-card">
                <div className="mc-spec-example-title" style={{ color: '#38bdf8' }}>
                  Test Case {selectedCaseIdx + 1} Specification
                </div>
                <div className="mc-spec-example-row">
                  <span className="mc-spec-example-label">Input:</span>
                  <code>{testCases[selectedCaseIdx].input}</code>
                </div>
                <div className="mc-spec-example-row">
                  <span className="mc-spec-example-label">Expected Output:</span>
                  <code>{testCases[selectedCaseIdx].expectedOutput}</code>
                </div>
                {testCases[selectedCaseIdx].description && (
                  <div className="mc-spec-example-row">
                    <span className="mc-spec-example-label">Note:</span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{testCases[selectedCaseIdx].description}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TEST RESULTS */}
        {!isRunning && activeTab === 'result' && (
          <div>
            {!runResult ? (
              <div style={{ textAlign: 'center', padding: '36px 16px', color: '#94a3b8', fontSize: '13px' }}>
                <p>No assertion results available. Click <strong>▶ Run Code</strong> or <strong>🏁 Submit</strong> to test your solution.</p>
              </div>
            ) : (
              <div>
                {runResult.error && (
                  <div className="mc-preview-error-overlay" style={{ position: 'static', marginBottom: '16px' }}>
                    <div className="mc-preview-error-header">
                      <span className="mc-preview-error-badge">⚠️ Execution Failure</span>
                      <span className="mc-preview-error-title">{runResult.status}</span>
                    </div>
                    <pre className="mc-preview-error-msg">{runResult.error}</pre>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {runResult.results.map((r, i) => (
                    <div
                      key={r.testCaseId || i}
                      className="mc-spec-example-card"
                      style={{
                        borderLeft: r.passed ? '3px solid #10b981' : '3px solid #ef4444',
                        background: r.passed ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className={`mc-status-pill ${r.passed ? 'completed' : 'attempted'}`} style={{ fontSize: '11px' }}>
                            {r.passed ? '✓ Passed' : '✗ Failed'}
                          </span>
                          <span style={{ fontWeight: 600, fontSize: '12px', color: '#f1f5f9' }}>
                            Case {i + 1} {r.isHidden ? '(Hidden)' : ''}
                          </span>
                        </div>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{r.runtimeMs}ms</span>
                      </div>

                      <div className="mc-spec-example-row">
                        <span className="mc-spec-example-label">Input:</span>
                        <code>{r.input}</code>
                      </div>
                      <div className="mc-spec-example-row">
                        <span className="mc-spec-example-label">Expected:</span>
                        <code>{r.expectedOutput}</code>
                      </div>
                      {!r.passed && (
                        <div className="mc-spec-example-row">
                          <span className="mc-spec-example-label" style={{ color: '#f87171' }}>Actual:</span>
                          <code style={{ color: '#f87171', background: 'rgba(239, 68, 68, 0.15)' }}>
                            {r.actualOutput !== undefined ? r.actualOutput : r.error}
                          </code>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SUBMISSIONS HISTORY */}
        {!isRunning && activeTab === 'submissions' && (
          <div>
            {submissions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 16px', color: '#94a3b8', fontSize: '13px' }}>
                <p>No previous submissions recorded for this challenge yet.</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.2)', color: '#94a3b8', textAlign: 'left' }}>
                    <th style={{ padding: '8px' }}>Status</th>
                    <th style={{ padding: '8px' }}>Score</th>
                    <th style={{ padding: '8px' }}>Tests</th>
                    <th style={{ padding: '8px' }}>Runtime</th>
                    <th style={{ padding: '8px' }}>Time Spent</th>
                    <th style={{ padding: '8px' }}>Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                      <td style={{ padding: '8px' }}>
                        <span className={`mc-status-pill ${s.status === 'Accepted' ? 'completed' : 'attempted'}`} style={{ fontSize: '11px' }}>
                          {s.status}
                        </span>
                      </td>
                      <td style={{ padding: '8px', fontWeight: 'bold' }}>{s.score}%</td>
                      <td style={{ padding: '8px' }}>{s.testsPassed} / {s.testsTotal}</td>
                      <td style={{ padding: '8px' }}>{s.runtimeMs}ms</td>
                      <td style={{ padding: '8px' }}>{Math.floor(s.timeSpentSeconds / 60)}m {s.timeSpentSeconds % 60}s</td>
                      <td style={{ padding: '8px', color: '#94a3b8' }}>
                        {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
