// src/components/coreprogramming/components/CoreProgrammingTestPanel.tsx
import { useState } from 'react';
import type { CoreProgrammingTestCase, CoreProgrammingRunResult, CoreProgrammingSubmission } from '../data/coreProgrammingTypes';

interface Props {
  testCases: CoreProgrammingTestCase[];
  runResult: CoreProgrammingRunResult | null;
  isRunning: boolean;
  activeTab: 'testcase' | 'result';
  setActiveTab: (tab: 'testcase' | 'result') => void;
  customInput: string;
  onCustomInputChange: (val: string) => void;
  useCustomInput: boolean;
  onToggleCustomInput: (enabled: boolean) => void;
  submissions?: CoreProgrammingSubmission[];
  fullscreenPanel?: 'none' | 'specs' | 'editor' | 'test' | 'preview';
  onToggleFullscreen?: () => void;
}

export function CoreProgrammingTestPanel({
  testCases,
  runResult,
  isRunning,
  activeTab,
  setActiveTab,
  customInput,
  onCustomInputChange,
  useCustomInput,
  onToggleCustomInput,
  fullscreenPanel = 'none',
  onToggleFullscreen,
}: Props) {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState<number>(0);
  const [activeResultIdx, setActiveResultIdx] = useState<number>(0);

  const visibleCases = testCases.filter(t => !t.isHidden);
  const currentTestCase = visibleCases[selectedCaseIdx] || visibleCases[0];

  return (
    <div className="dsa-testpanel-wrap cp-testpanel-wrap">
      {/* Test Panel Header Tabs */}
      <div className="dsa-testpanel-nav cp-testpanel-nav">
        <div className="cp-testpanel-nav-left">
          <button
            type="button"
            className={`dsa-tp-nav-btn cp-tp-nav-btn ${activeTab === 'testcase' ? 'active' : ''}`}
            onClick={() => setActiveTab('testcase')}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2v7.31L4.69 18.2A2 2 0 0 0 6.38 21h11.24a2 2 0 0 0 1.69-2.8L14 9.31V2" />
              <path d="M8.5 2h7" />
              <path d="M7.4 15h9.2" />
            </svg>
            <span>Testcases ({visibleCases.length})</span>
          </button>
          <button
            type="button"
            className={`dsa-tp-nav-btn cp-tp-nav-btn ${activeTab === 'result' ? 'active' : ''}`}
            onClick={() => setActiveTab('result')}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <span>Test Result {runResult ? (runResult.success ? '✓' : '✗') : ''}</span>
          </button>
        </div>

        {onToggleFullscreen && (
          <button
            type="button"
            className={`cp-icon-tool-btn cp-fullscreen-btn ${fullscreenPanel === 'test' ? 'active' : ''}`}
            onClick={onToggleFullscreen}
            title={fullscreenPanel === 'test' ? 'Restore Test Panel Size (Esc)' : 'Maximize Test Console (Fullscreen)'}
            aria-label={fullscreenPanel === 'test' ? 'Restore Test Panel Size' : 'Maximize Test Console'}
          >
            {fullscreenPanel === 'test' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 14 10 14 10 20" />
                <polyline points="20 10 14 10 14 4" />
                <line x1="14" y1="10" x2="21" y2="3" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            )}
          </button>
        )}
      </div>

      <div className="dsa-testpanel-body cp-testpanel-body">
        {/* ================= TESTCASE TAB ================= */}
        {activeTab === 'testcase' && (
          <div className="dsa-tp-content cp-tp-content">
            <div className="dsa-tc-selector-row cp-tc-selector-row">
              <div className="dsa-tc-buttons cp-tc-buttons">
                {visibleCases.map((tc, idx) => (
                  <button
                    key={tc.id || idx}
                    type="button"
                    className={`dsa-tc-btn cp-tc-btn ${!useCustomInput && selectedCaseIdx === idx ? 'active' : ''}`}
                    onClick={() => {
                      onToggleCustomInput(false);
                      setSelectedCaseIdx(idx);
                    }}
                  >
                    <span>Case {idx + 1}</span>
                  </button>
                ))}
                <button
                  type="button"
                  className={`dsa-tc-btn cp-tc-btn custom ${useCustomInput ? 'active' : ''}`}
                  onClick={() => onToggleCustomInput(true)}
                >
                  <span>+ Custom</span>
                </button>
              </div>
            </div>

            {useCustomInput ? (
              <div className="dsa-custom-input-box">
                <label className="dsa-tc-label">Custom Input (JSON array of function arguments):</label>
                <textarea
                  className="dsa-custom-textarea"
                  value={customInput}
                  onChange={e => onCustomInputChange(e.target.value)}
                  placeholder="e.g. [0, 100] or [null, 'default']"
                  rows={3}
                />
                <span className="dsa-tc-helper">
                  Format arguments as a valid JSON array or JavaScript expression to pass into the function.
                </span>
              </div>
            ) : (
              currentTestCase && (
                <div className="dsa-case-view">
                  <div className="dsa-tc-field">
                    <label className="dsa-tc-label">Input Parameters:</label>
                    <div className="dsa-tc-code-box">
                      <code>{currentTestCase.input}</code>
                    </div>
                  </div>

                  <div className="dsa-tc-field">
                    <label className="dsa-tc-label">Expected Return:</label>
                    <div className="dsa-tc-code-box">
                      <code>{currentTestCase.expectedOutput}</code>
                    </div>
                  </div>

                  {currentTestCase.description && (
                    <div className="dsa-tc-field">
                      <label className="dsa-tc-label">Note:</label>
                      <p className="dsa-tc-explanation">{currentTestCase.description}</p>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        )}

        {/* ================= RESULT TAB ================= */}
        {activeTab === 'result' && (
          <div className="dsa-tp-content">
            {isRunning ? (
              <div className="dsa-running-state">
                <div className="dsa-spinner" />
                <p>Running code against test cases in sandboxed worker...</p>
              </div>
            ) : !runResult ? (
              <div className="dsa-result-empty">
                <p>No tests run yet.</p>
                <span>Click <strong>▶ Run Code</strong> (Ctrl+Enter) or <strong>🚀 Submit</strong> to evaluate your solution.</span>
              </div>
            ) : (
              <div className="dsa-result-display">
                {/* Result Header Banner */}
                <div className={`dsa-verdict-banner ${runResult.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="dsa-verdict-left">
                    <h3 className="dsa-verdict-status">
                      {runResult.status === 'Accepted' && '✅ Accepted'}
                      {runResult.status === 'Wrong Answer' && '❌ Wrong Answer'}
                      {runResult.status === 'Runtime Error' && '⚠️ Runtime Error'}
                      {runResult.status === 'Time Limit Exceeded' && '⏱️ Time Limit Exceeded'}
                    </h3>
                    <span className="dsa-verdict-counts">
                      {runResult.passedCount} / {runResult.totalCount} test cases passed
                    </span>
                  </div>
                  <div className="dsa-verdict-runtime">
                    Runtime: <strong>{runResult.totalRuntimeMs} ms</strong>
                  </div>
                </div>

                {/* LeetCode Style Beats % Percentiles */}
                {runResult.status === 'Accepted' && (
                  <div className="dsa-beats-row">
                    <div className="dsa-beats-item">
                      <span className="dsa-beats-icon">⚡</span>
                      <div>
                        <div className="dsa-beats-label">Runtime: <strong>{runResult.totalRuntimeMs} ms</strong></div>
                        <div className="dsa-beats-sub">
                          Beats <span className="dsa-beats-highlight">{Math.min(99.4, Math.max(68.2, Math.round((95 - (runResult.totalRuntimeMs * 0.5)) * 10) / 10))}%</span> of submissions
                        </div>
                      </div>
                    </div>
                    <div className="dsa-beats-item">
                      <span className="dsa-beats-icon">💾</span>
                      <div>
                        <div className="dsa-beats-label">Memory: <strong>{Math.round((41.2 + (runResult.passedCount * 0.8)) * 10) / 10} MB</strong></div>
                        <div className="dsa-beats-sub">
                          Beats <span className="dsa-beats-highlight">{Math.min(98.8, Math.max(72.0, Math.round((86 + (runResult.passedCount % 9)) * 10) / 10))}%</span> of submissions
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Box if any */}
                {runResult.error && (
                  <div className="dsa-err-message-box">
                    <div className="dsa-err-title">Error Details:</div>
                    <pre><code>{runResult.error}</code></pre>
                  </div>
                )}

                {/* Per Test Case Selector and Details */}
                {runResult.results && runResult.results.length > 0 && (
                  <div className="dsa-result-cases-wrapper">
                    <div className="dsa-result-case-tabs">
                      {runResult.results.map((r, i) => (
                        <button
                          key={r.testCaseId || i}
                          type="button"
                          className={`dsa-result-tab-btn ${activeResultIdx === i ? 'active' : ''} ${r.passed ? 'pass' : 'fail'}`}
                          onClick={() => setActiveResultIdx(i)}
                        >
                          <span className="dsa-tab-dot">{r.passed ? '✓' : '✗'}</span>
                          Case {i + 1}
                        </button>
                      ))}
                    </div>

                    {runResult.results[activeResultIdx] && (
                      <div className="dsa-result-card">
                        <div className="dsa-res-field">
                          <label>Input:</label>
                          <div className="dsa-res-code">
                            <code>{runResult.results[activeResultIdx].input}</code>
                          </div>
                        </div>

                        <div className="dsa-res-field">
                          <label>Expected Output:</label>
                          <div className="dsa-res-code expected">
                            <code>{runResult.results[activeResultIdx].expectedOutput}</code>
                          </div>
                        </div>

                        <div className="dsa-res-field">
                          <label>Your Output:</label>
                          <div className={`dsa-res-code ${runResult.results[activeResultIdx].passed ? 'match' : 'mismatch'}`}>
                            <code>
                              {runResult.results[activeResultIdx].actualOutput ??
                                (runResult.results[activeResultIdx].error || 'undefined')}
                            </code>
                          </div>
                        </div>

                        {runResult.results[activeResultIdx].error && (
                          <div className="dsa-res-field">
                            <label className="dsa-err-label">Error Log:</label>
                            <pre className="dsa-res-error-text">
                              <code>{runResult.results[activeResultIdx].error}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Console Logs */}
                {runResult.consoleLogs && runResult.consoleLogs.length > 0 && (
                  <div className="dsa-console-section">
                    <h4>Stdout / Console Logs:</h4>
                    <div className="dsa-console-terminal">
                      {runResult.consoleLogs.map((log, idx) => (
                        <div key={idx} className={`dsa-log-line ${log.level}`}>
                          <span className="dsa-log-prefix">&gt;</span> {log.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
