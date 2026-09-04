import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Editor, { DiffEditor } from '@monaco-editor/react';
import { useTheme } from '../../context/ThemeContext';
import { buildReactSrcDoc } from '../../lib/runner';
import { MACHINE_CODING_QUESTIONS } from './machineCodingQuestions';
import { getQuestionTestCases, type MCTestResult } from './data/machineCodingTests';
import InterviewScorecardModal, { type ScorecardData } from './InterviewScorecardModal';
import AIInterviewPrompter from './AIInterviewPrompter';
import './MachineCodingStudio.css';

interface ConsoleLog {
  level: 'log' | 'info' | 'warn' | 'error';
  message: string;
}

export default function MachineCodingStudio() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeId = searchParams.get('id');
  const { resolvedTheme } = useTheme();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  const BATCHES = [
    { id: 'all', label: 'All 500', start: 1, end: 500 },
    { id: 'b1', label: 'B1: Foundations (1-50)', start: 1, end: 50 },
    { id: 'b2', label: 'B2: UI Components (51-100)', start: 51, end: 100 },
    { id: 'b3', label: 'B3: Custom Hooks (101-150)', start: 101, end: 150 },
    { id: 'b4', label: 'B4: Complex Forms (151-200)', start: 151, end: 200 },
    { id: 'b5', label: 'B5: Perf & Virtual (201-250)', start: 201, end: 250 },
    { id: 'b6', label: 'B6: Games & Widgets (251-300)', start: 251, end: 300 },
    { id: 'b7', label: 'B7: Real-Time & Media (301-350)', start: 301, end: 350 },
    { id: 'b8', label: 'B8: Architecture (351-400)', start: 351, end: 400 },
    { id: 'b9', label: 'B9: Data Grids & BI (401-450)', start: 401, end: 450 },
    { id: 'b10', label: 'B10: Systems & Offline (451-500)', start: 451, end: 500 },
  ];

  // Active question resolution
  const activeQuestion = useMemo(() => {
    if (!activeId) return null;
    return MACHINE_CODING_QUESTIONS.find(q => q.id === activeId) || null;
  }, [activeId]);

  // Code editor state
  const [currentCode, setCurrentCode] = useState('');
  const [userCodeMap, setUserCodeMap] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('mc_code_drafts_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Monaco Diff Editor State
  const [editorViewMode, setEditorViewMode] = useState<'code' | 'diff'>('code');
  const [diffSideBySide, setDiffSideBySide] = useState(true);
  const [diffTarget, setDiffTarget] = useState<'solution' | 'starter'>('solution');

  // AI Interviewer Prompter State
  const [showAIPrompter, setShowAIPrompter] = useState(false);

  // Runner state
  const [isCompiling, setIsCompiling] = useState(false);
  const [previewSrcDoc, setPreviewSrcDoc] = useState('');
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const [runId, setRunId] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Test Runner State
  const [testResults, setTestResults] = useState<MCTestResult[] | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const testResultResolverRef = useRef<((res: MCTestResult[]) => void) | null>(null);

  // Timed Interview Simulator State
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [interviewDuration, setInterviewDuration] = useState(45 * 60); // default 45 mins
  const [interviewTimeLeft, setInterviewTimeLeft] = useState(45 * 60);
  const [, setInterviewStartedAt] = useState<number | null>(null);
  const [interviewFinished, setInterviewFinished] = useState(false);
  const [showScorecard, setShowScorecard] = useState(false);
  const [scorecardData, setScorecardData] = useState<ScorecardData | null>(null);

  const editorRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3200);
  };

  const formatMMSS = (secs: number) => {
    const m = Math.floor(Math.max(0, secs) / 60);
    const s = Math.max(0, secs) % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Solved state
  const [solvedMap, setSolvedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('mc_solved_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleSolved = (id: string) => {
    setSolvedMap(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('mc_solved_v1', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  // Spec tab
  const [activeTab, setActiveTab] = useState<'specs' | 'solution' | 'tips' | 'tests'>('specs');

  // Checklists per question
  const [checkedItems, setCheckedItems] = useState<Record<string, Record<number, boolean>>>({});

  // Sync code when active question changes
  useEffect(() => {
    if (activeQuestion) {
      setTestResults(null);
      setIsRunningTests(false);
      const savedCode = userCodeMap[activeQuestion.id];
      const initial = savedCode || activeQuestion.starterCode;
      setCurrentCode(initial);
      if (editorRef.current) {
        editorRef.current.setValue(initial);
      }
      executeCode(initial);
    }
  }, [activeQuestion?.id]);

  // Handle iframe messages (console logs, runtime errors, and test results)
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'object') return;
      const { t, level, parts, message, results } = e.data;

      if (t === 'log') {
        const text = parts ? parts.join(' ') : '';
        setConsoleLogs(prev => [...prev, { level: level || 'log', message: text }]);
      } else if (t === 'error') {
        setConsoleLogs(prev => [...prev, { level: 'error', message: message || 'Execution error' }]);
      } else if (t === 'test_results') {
        const res: MCTestResult[] = results || [];
        setTestResults(res);
        setIsRunningTests(false);
        if (testResultResolverRef.current) {
          testResultResolverRef.current(res);
          testResultResolverRef.current = null;
        }
        const passedCount = res.filter(r => r.status === 'passed').length;
        if (res.length > 0 && passedCount === res.length) {
          showToast(`🎉 All ${res.length} test assertions passed!`);
          if (activeQuestion && !solvedMap[activeQuestion.id]) {
            toggleSolved(activeQuestion.id);
          }
        } else {
          showToast(`🧪 Test run complete: ${passedCount}/${res.length} passed.`);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activeQuestion, solvedMap]);

  // Interview Timer Countdown Effect
  useEffect(() => {
    if (!isInterviewActive) return;

    const timer = setInterval(() => {
      setInterviewTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => {
            handleFinishInterview();
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isInterviewActive, interviewDuration, activeQuestion, currentCode]);

  // Code Execution via buildReactSrcDoc
  const executeCode = async (codeToRun: string) => {
    setIsCompiling(true);
    setConsoleLogs([]);
    const nextRunId = runId + 1;
    setRunId(nextRunId);

    try {
      const srcDoc = await buildReactSrcDoc({ 'App.jsx': codeToRun }, 'App.jsx', nextRunId);
      setPreviewSrcDoc(srcDoc);
    } catch (err: any) {
      console.error(err);
      setConsoleLogs(prev => [...prev, { level: 'error', message: err?.message || 'Babel compilation error' }]);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleRunTests = async () => {
    if (!activeQuestion) return;
    setIsRunningTests(true);
    setActiveTab('tests');
    const tests = getQuestionTestCases(activeQuestion);

    // Make sure latest code is compiled and mounted
    await executeCode(currentCode);

    // Wait a brief tick for iframe DOM to mount, then trigger test execution
    setTimeout(() => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ t: 'run_tests', testCases: tests }, '*');
      }
    }, 250);
  };

  const runTestsAsync = async (codeToTest: string): Promise<MCTestResult[]> => {
    if (!activeQuestion) return [];
    setIsRunningTests(true);
    setActiveTab('tests');

    await executeCode(codeToTest);

    return new Promise((resolve) => {
      testResultResolverRef.current = resolve;
      const tests = getQuestionTestCases(activeQuestion);

      setTimeout(() => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ t: 'run_tests', testCases: tests }, '*');
        }
      }, 300);

      // Safety timeout: if iframe takes too long, fallback
      setTimeout(() => {
        if (testResultResolverRef.current) {
          testResultResolverRef.current(testResults || []);
          testResultResolverRef.current = null;
          setIsRunningTests(false);
        }
      }, 4000);
    });
  };

  const handleStartInterview = (durationSecs = 45 * 60) => {
    if (!activeQuestion) return;
    setInterviewDuration(durationSecs);
    setInterviewTimeLeft(durationSecs);
    setInterviewStartedAt(Date.now());
    setIsInterviewActive(true);
    setInterviewFinished(false);
    setTestResults(null);
    setEditorViewMode('code');
    setActiveTab('specs');
    showToast(`⏱️ ${Math.round(durationSecs / 60)}-Minute Interview Round Started! Reference solution locked.`);
  };

  const handleFinishInterview = async () => {
    if (!activeQuestion) return;
    setIsInterviewActive(false);
    setInterviewFinished(true);
    showToast('🏁 Round submitted! Generating candidate evaluation scorecard...');

    const results = await runTestsAsync(currentCode);
    const passed = results.filter(r => r.status === 'passed').length;
    const total = results.length;
    const timeSpent = Math.max(1, interviewDuration - Math.max(0, interviewTimeLeft));

    setScorecardData({
      question: activeQuestion,
      timeSpentSeconds: timeSpent,
      totalDurationSeconds: interviewDuration,
      testResults: results,
      passedTests: passed,
      totalTests: total
    });
    setShowScorecard(true);
  };

  const handleCodeChange = (val?: string) => {
    const nextVal = val ?? '';
    setCurrentCode(nextVal);
    if (activeQuestion) {
      setUserCodeMap(prev => {
        const updated = { ...prev, [activeQuestion.id]: nextVal };
        try {
          localStorage.setItem('mc_code_drafts_v1', JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });
    }
  };

  const handleLoadSolution = () => {
    if (!activeQuestion) return;
    if (isInterviewActive) {
      showToast('🔒 Solution is locked during an active interview round!');
      return;
    }
    const sol = activeQuestion.solutionCode;
    setCurrentCode(sol);
    if (editorRef.current) {
      editorRef.current.setValue(sol);
    }
    executeCode(sol);
    setUserCodeMap(prev => {
      const updated = { ...prev, [activeQuestion.id]: sol };
      try {
        localStorage.setItem('mc_code_drafts_v1', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
    showToast('✓ Reference solution loaded into editor & executed!');
  };

  const handleResetStarter = () => {
    if (!activeQuestion) return;
    const starter = activeQuestion.starterCode;
    setCurrentCode(starter);
    if (editorRef.current) {
      editorRef.current.setValue(starter);
    }
    executeCode(starter);
    setUserCodeMap(prev => {
      const updated = { ...prev, [activeQuestion.id]: starter };
      try {
        localStorage.setItem('mc_code_drafts_v1', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
    showToast('↺ Code reset to initial challenge template!');
  };

  const selectQuestion = (id: string) => {
    if (isInterviewActive) {
      const confirmExit = window.confirm('An interview round is currently active. Are you sure you want to exit and switch questions?');
      if (!confirmExit) return;
      setIsInterviewActive(false);
    }
    setSearchParams({ id });
  };

  const closeStudio = () => {
    setSearchParams({});
  };

  const activeBatchObj = BATCHES.find(b => b.id === selectedBatch) || BATCHES[0];

  const filteredQuestions = useMemo(() => {
    return MACHINE_CODING_QUESTIONS.filter(q => {
      const qNum = parseInt(q.id.replace(/\D/g, ''), 10) || 0;
      const inBatch = qNum >= activeBatchObj.start && qNum <= activeBatchObj.end;

      const matchesSearch =
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.summary.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'All' || q.category === selectedCategory;
      const matchesDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;

      return inBatch && matchesSearch && matchesCat && matchesDiff;
    });
  }, [searchQuery, selectedBatch, selectedCategory, selectedDifficulty, activeBatchObj]);

  const totalPages = Math.ceil(filteredQuestions.length / pageSize) || 1;
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, currentPage, pageSize]);

  const solvedCount = Object.values(solvedMap).filter(Boolean).length;
  const categories = ['All', 'State Management', 'Interactive UI', 'Custom Hooks', 'Async & Performance', 'Architecture'];

  // -------------------------------------------------------------
  // RENDER: WORKSPACE MODE (when question is active)
  // -------------------------------------------------------------
  if (activeQuestion) {
    const currentIndex = MACHINE_CODING_QUESTIONS.findIndex(q => q.id === activeQuestion.id);
    const prevQuestion = currentIndex > 0 ? MACHINE_CODING_QUESTIONS[currentIndex - 1] : null;
    const nextQuestion = currentIndex < MACHINE_CODING_QUESTIONS.length - 1 ? MACHINE_CODING_QUESTIONS[currentIndex + 1] : null;
    const isSolved = !!solvedMap[activeQuestion.id];

    return (
      <div className="mc-studio-container mc-workspace">
        {/* Top bar navigation */}
        <div className="mc-topbar">
          <div className="mc-topbar-left">
            <button className="mc-back-btn" onClick={closeStudio} title="Back to All Questions">
              ← Hub Directory
            </button>

            <div className="mc-nav-arrows">
              <button
                className="mc-nav-arrow"
                disabled={!prevQuestion}
                onClick={() => prevQuestion && selectQuestion(prevQuestion.id)}
                title={prevQuestion ? `Prev: ${prevQuestion.id} ${prevQuestion.title}` : 'First challenge'}
              >
                ‹
              </button>
              <button
                className="mc-nav-arrow"
                disabled={!nextQuestion}
                onClick={() => nextQuestion && selectQuestion(nextQuestion.id)}
                title={nextQuestion ? `Next: ${nextQuestion.id} ${nextQuestion.title}` : 'Last challenge'}
              >
                ›
              </button>
            </div>

            <select
              className="mc-question-select"
              value={activeQuestion.id}
              onChange={(e) => selectQuestion(e.target.value)}
            >
              {BATCHES.slice(1).map(b => (
                <optgroup key={b.id} label={b.label}>
                  {MACHINE_CODING_QUESTIONS.slice(b.start - 1, b.end).map(q => (
                    <option key={q.id} value={q.id}>
                      {q.id}: {q.title} ({q.difficulty}) {solvedMap[q.id] ? '✓' : ''}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="mc-topbar-right">
            {!isInterviewActive ? (
              <div className="mc-interview-launcher">
                <select
                  className="mc-duration-select"
                  value={interviewDuration}
                  onChange={(e) => setInterviewDuration(Number(e.target.value))}
                  title="Select interview round duration"
                >
                  <option value={30 * 60}>30m Sprint</option>
                  <option value={45 * 60}>45m FAANG</option>
                  <option value={60 * 60}>60m Deep Dive</option>
                </select>
                <button
                  className="mc-action-btn mc-btn-interview-start"
                  onClick={() => handleStartInterview(interviewDuration)}
                  title="Begin timed FAANG machine coding simulation round"
                >
                  ⏱️ Start Interview
                </button>
              </div>
            ) : (
              <div className="mc-active-interview-controls">
                <div
                  className={`mc-interview-hud ${
                    interviewTimeLeft < 180 ? 'urgent-critical' : interviewTimeLeft < 600 ? 'urgent-warn' : 'normal'
                  }`}
                  title="Remaining time in active interview round"
                >
                  <span className="mc-hud-pulse" />
                  <span className="mc-hud-label">INTERVIEW ROUND</span>
                  <span className="mc-hud-timer">{formatMMSS(interviewTimeLeft)}</span>
                </div>
                <button
                  className="mc-action-btn mc-btn-interview-finish"
                  onClick={handleFinishInterview}
                  title="Submit candidate code and generate scorecard"
                >
                  🏁 Finish & Submit
                </button>
              </div>
            )}

            {interviewFinished && !isInterviewActive && scorecardData && (
              <button
                className="mc-action-btn mc-btn-view-scorecard"
                onClick={() => setShowScorecard(true)}
                title="Re-open candidate interview scorecard"
              >
                📊 Scorecard
              </button>
            )}

            <button
              className={`mc-action-btn mc-btn-ai-interviewer ${showAIPrompter ? 'active' : ''}`}
              onClick={() => setShowAIPrompter(prev => !prev)}
              title="Toggle Interactive AI Staff Interviewer & Voice Prompter"
            >
              <span className="mc-ai-pulse-dot" />
              🎙️ AI Interviewer
            </button>

            <button
              className={`mc-action-btn mc-btn-solved-toggle ${isSolved ? 'solved' : ''}`}
              onClick={() => toggleSolved(activeQuestion.id)}
            >
              {isSolved ? '✓ Completed' : 'Mark as Solved'}
            </button>

            <button className="mc-action-btn mc-btn-reset" onClick={handleResetStarter} title="Reset to initial boilerplate">
              ↺ Reset
            </button>
            <button
              className={`mc-action-btn mc-btn-solution ${isInterviewActive ? 'locked' : ''}`}
              onClick={handleLoadSolution}
              disabled={isInterviewActive}
              title={isInterviewActive ? "Reference solution is locked during active interview round" : "Inspect reference solution"}
            >
              {isInterviewActive ? '🔒 Solution Locked' : '💡 Load Solution'}
            </button>

            <button
              className="mc-action-btn mc-btn-tests"
              onClick={handleRunTests}
              disabled={isRunningTests || isCompiling}
              title="Run automated test suite"
            >
              {isRunningTests ? '🧪 Running Tests...' : '🧪 Run Tests'}
            </button>

            <button
              className="mc-action-btn mc-btn-run"
              onClick={() => executeCode(currentCode)}
              disabled={isCompiling}
            >
              {isCompiling ? 'Compiling...' : '▶ Run Live'}
            </button>
          </div>
        </div>
        {toastMessage && (
          <div className="mc-toast-banner" role="status" aria-live="polite">
            {toastMessage}
          </div>
        )}

        {/* AI Interviewer — full-width drawer, sits OUTSIDE the split-body so it never overlaps */}
        {showAIPrompter && (
          <div className="mc-ai-drawer">
            <AIInterviewPrompter
              question={activeQuestion}
              onClose={() => setShowAIPrompter(false)}
            />
          </div>
        )}

        {/* Split screen body */}
        <div className="mc-split-body">
          {/* Left panel: Specifications & Checklist */}
          <div className="mc-spec-panel">
            <div className="mc-spec-tabs">
              <button
                className={`mc-spec-tab ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                Problem Specs
              </button>
              <button
                className={`mc-spec-tab ${activeTab === 'tips' ? 'active' : ''}`}
                onClick={() => setActiveTab('tips')}
              >
                Interviewer Rubric
              </button>
              <button
                className={`mc-spec-tab ${activeTab === 'solution' ? 'active' : ''} ${isInterviewActive ? 'locked' : ''}`}
                onClick={() => setActiveTab('solution')}
              >
                {isInterviewActive ? '🔒 Solution (Locked)' : 'Solution Code'}
              </button>
              <button
                className={`mc-spec-tab ${activeTab === 'tests' ? 'active' : ''}`}
                onClick={() => setActiveTab('tests')}
              >
                🧪 Test Cases {testResults ? `(${testResults.filter(r => r.status === 'passed').length}/${testResults.length})` : ''}
              </button>
            </div>

            <div className="mc-spec-content">
              {activeTab === 'specs' && (
                <div>
                  <h2 className="mc-spec-title">{activeQuestion.id}: {activeQuestion.title}</h2>
                  <div className="mc-spec-tags">
                    <span className={`mc-badge ${activeQuestion.difficulty.toLowerCase()}`}>
                      {activeQuestion.difficulty}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>⏱️ {activeQuestion.timeEstimate}</span>
                    <span style={{ fontSize: '12px', color: '#38bdf8' }}>🏷️ {activeQuestion.category}</span>
                  </div>

                  <div className="mc-spec-body" style={{ whiteSpace: 'pre-line', marginBottom: '16px' }}>
                    {activeQuestion.description}
                  </div>

                  <h4 style={{ margin: '16px 0 8px', fontSize: '14px', color: '#f0f6fc' }}>
                    Candidate Checklist:
                  </h4>
                  <div className="mc-checklist">
                    {activeQuestion.requirements.map((req, idx) => {
                      const isChecked = !!checkedItems[activeQuestion.id]?.[idx];
                      return (
                        <label key={idx} className="mc-checklist-item">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setCheckedItems(prev => {
                                const cur = prev[activeQuestion.id] || {};
                                return {
                                  ...prev,
                                  [activeQuestion.id]: { ...cur, [idx]: !isChecked }
                                };
                              });
                            }}
                          />
                          <span style={{ textDecoration: isChecked ? 'line-through' : 'none', opacity: isChecked ? 0.6 : 1 }}>
                            {req}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'tips' && (
                <div>
                  <h3 style={{ margin: '0 0 12px', fontSize: '16px', color: '#58a6ff' }}>
                    Senior Staff Evaluation Rubric
                  </h3>

                  <div className="mc-interview-card">
                    <div className="mc-interview-title">🎯 What Interviewers Look For:</div>
                    <ul style={{ margin: '6px 0 0', paddingLeft: '18px', fontSize: '13px', lineHeight: '1.6', color: '#c9d1d9' }}>
                      {activeQuestion.interviewTips.map((tip, idx) => (
                        <li key={idx} style={{ marginBottom: '6px' }}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mc-pitfalls-card">
                    <div className="mc-pitfalls-title">⚠️ Common Candidate Traps:</div>
                    <ul style={{ margin: '6px 0 0', paddingLeft: '18px', fontSize: '13px', lineHeight: '1.6', color: '#fca5a5' }}>
                      {activeQuestion.commonMistakes.map((mistake, idx) => (
                        <li key={idx} style={{ marginBottom: '6px' }}>{mistake}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'solution' && (
                isInterviewActive ? (
                  <div className="mc-solution-locked-card">
                    <div className="mc-locked-icon">🔒</div>
                    <h3 className="mc-locked-title">Reference Solution Locked</h3>
                    <p className="mc-locked-desc">
                      Solution code is concealed during active interview rounds to maintain realistic FAANG coding constraints.
                    </p>
                    <div className="mc-locked-rules">
                      <div className="mc-locked-rule-item">
                        <span>⏱️</span>
                        <span>Round Timer: <strong>{formatMMSS(interviewTimeLeft)}</strong> remaining</span>
                      </div>
                      <div className="mc-locked-rule-item">
                        <span>🧪</span>
                        <span>Run assertions anytime to validate edge-cases before submitting</span>
                      </div>
                      <div className="mc-locked-rule-item">
                        <span>🏁</span>
                        <span>Click <strong>Finish & Submit</strong> to unlock reference code and view your score</span>
                      </div>
                    </div>
                    <button
                      className="mc-action-btn mc-btn-interview-finish"
                      onClick={handleFinishInterview}
                      style={{ marginTop: '14px', width: '100%', justifyContent: 'center', padding: '10px' }}
                    >
                      🏁 Finish & Submit Round Now
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ margin: 0, fontSize: '15px', color: '#c084fc' }}>Reference Solution</h3>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setDiffTarget('solution');
                            setEditorViewMode('diff');
                          }}
                          style={{
                            padding: '4px 10px',
                            fontSize: '12px',
                            background: 'rgba(56, 189, 248, 0.15)',
                            color: '#38bdf8',
                            border: '1px solid rgba(56, 189, 248, 0.35)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 600
                          }}
                          title="Open side-by-side Monaco Diff with this solution"
                        >
                          🔀 Compare Diff
                        </button>
                        <button
                          onClick={handleLoadSolution}
                          style={{
                            padding: '4px 10px',
                            fontSize: '12px',
                            background: '#a855f7',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 600
                          }}
                        >
                          Copy to Editor
                        </button>
                      </div>
                    </div>
                    <pre style={{
                      background: '#0d1117',
                      padding: '14px',
                      borderRadius: '8px',
                      border: '1px solid #30363d',
                      fontSize: '12px',
                      overflowX: 'auto',
                      color: '#e6edf3',
                      lineHeight: '1.5'
                    }}>
                      {activeQuestion.solutionCode}
                    </pre>
                  </div>
                )
              )}

              {activeTab === 'tests' && (
                <div className="mc-test-suite-panel">
                  {/* Test Suite Summary Header */}
                  <div className="mc-test-suite-header">
                    <div>
                      <h3 style={{ margin: '0 0 4px', fontSize: '15px', color: 'var(--text-primary)' }}>
                        Automated Assertion Suite
                      </h3>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {testResults
                          ? `${testResults.filter(r => r.status === 'passed').length} of ${testResults.length} assertions passed`
                          : 'Validates component mounting, reactive state, and user interactions'}
                      </p>
                    </div>

                    <button
                      className="mc-action-btn mc-btn-tests"
                      onClick={handleRunTests}
                      disabled={isRunningTests || isCompiling}
                    >
                      {isRunningTests ? '🧪 Running...' : '▶ Run Test Suite'}
                    </button>
                  </div>

                  {/* Progress Meter */}
                  {testResults && (
                    <div style={{ margin: '14px 0 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                        <span style={{ fontWeight: '700', color: testResults.every(r => r.status === 'passed') ? '#22c55e' : '#ef4444' }}>
                          {testResults.every(r => r.status === 'passed') ? '✓ ALL TESTS PASSED (100%)' : `${testResults.filter(r => r.status === 'passed').length}/${testResults.length} PASSED`}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>
                          ⏱️ {testResults.reduce((acc, r) => acc + r.durationMs, 0)}ms total
                        </span>
                      </div>
                      <div className="mc-test-progress-track">
                        <div
                          className="mc-test-progress-fill"
                          style={{
                            width: `${(testResults.filter(r => r.status === 'passed').length / testResults.length) * 100}%`,
                            background: testResults.every(r => r.status === 'passed') ? '#22c55e' : 'linear-gradient(90deg, #ef4444, #f59e0b)'
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Test Cases List */}
                  <div className="mc-test-case-list">
                    {(testResults ? testResults : getQuestionTestCases(activeQuestion).map(tc => ({ ...tc, status: 'pending' as const, durationMs: 0 }))).map((tc, idx) => (
                      <div key={tc.id} className={`mc-test-card ${tc.status}`}>
                        <div className="mc-test-card-header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className={`mc-test-badge ${tc.status}`}>
                              {tc.status === 'passed' ? '✓ PASS' : tc.status === 'failed' ? '✕ FAIL' : '○ READY'}
                            </span>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                              #{idx + 1} {tc.name}
                            </span>
                          </div>
                          {tc.durationMs > 0 && (
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              {tc.durationMs}ms
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
                          {tc.description}
                        </div>

                        {tc.status === 'failed' && (tc as any).error && (
                          <div className="mc-test-error-box">
                            <span style={{ fontWeight: '700', color: '#ef4444' }}>Assertion Failure:</span>{' '}
                            {(tc as any).error}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Area: Monaco Editor + Live Sandbox */}
          <div className="mc-right-panel">
            <div className="mc-editor-preview-split">
              {/* Editor */}
              <div className="mc-editor-container">
                <div className="mc-panel-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>💻 App.jsx</span>
                    <div className="mc-editor-mode-toggle">
                      <button
                        className={`mc-toggle-pill ${editorViewMode === 'code' ? 'active' : ''}`}
                        onClick={() => setEditorViewMode('code')}
                      >
                        Code Editor
                      </button>
                      <button
                        className={`mc-toggle-pill ${editorViewMode === 'diff' ? 'active' : ''}`}
                        onClick={() => {
                          if (isInterviewActive) {
                            showToast('🔒 Diff comparison is locked during an active interview round!');
                            return;
                          }
                          setEditorViewMode('diff');
                        }}
                        disabled={isInterviewActive}
                        title={isInterviewActive ? "Diff comparison locked during active round" : "Compare your code with staff reference solution"}
                      >
                        {isInterviewActive ? '🔒 Diff (Locked)' : '🔀 Diff vs Solution'}
                      </button>
                    </div>
                  </div>

                  {editorViewMode === 'diff' ? (
                    <div className="mc-diff-header-controls">
                      <select
                        className="mc-diff-target-select"
                        value={diffTarget}
                        onChange={(e) => setDiffTarget(e.target.value as any)}
                        title="Select comparison target"
                      >
                        <option value="solution">Compare: Staff Reference Solution</option>
                        <option value="starter">Compare: Starter Boilerplate</option>
                      </select>
                      <button
                        className="mc-diff-opt-btn"
                        onClick={() => setDiffSideBySide(prev => !prev)}
                        title="Toggle side-by-side or inline diff layout"
                      >
                        {diffSideBySide ? '⧉ Inline' : '⧉ Side-by-Side'}
                      </button>
                      <button
                        className="mc-diff-opt-btn mc-diff-adopt-btn"
                        onClick={() => {
                          handleLoadSolution();
                          setEditorViewMode('code');
                        }}
                        title="Adopt reference solution into active editor"
                      >
                        Adopt Reference
                      </button>
                      <button
                        className="mc-diff-opt-btn"
                        onClick={() => setEditorViewMode('code')}
                        title="Return to code editor"
                      >
                        ✕ Close Diff
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Babel Standalone compiler</span>
                  )}
                </div>

                <div className="mc-monaco-wrapper">
                  {editorViewMode === 'diff' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                      <div className="mc-diff-legend-bar">
                        <div className="mc-diff-legend-col">
                          <span className="mc-diff-tag original">ORIGINAL</span>
                          <span style={{ fontWeight: '600', fontSize: '12px', color: 'var(--text-primary)' }}>
                            👤 Your Implementation
                          </span>
                        </div>
                        <div className="mc-diff-legend-col">
                          <span className="mc-diff-tag modified">MODIFIED</span>
                          <span style={{ fontWeight: '600', fontSize: '12px', color: 'var(--text-primary)' }}>
                            {diffTarget === 'solution' ? '🏆 Senior Staff Solution' : '📄 Initial Starter Template'}
                          </span>
                        </div>
                      </div>
                      <div style={{ flex: 1, minHeight: 0 }}>
                        <DiffEditor
                          height="100%"
                          language="javascript"
                          theme={resolvedTheme === 'light' ? 'light' : 'vs-dark'}
                          original={currentCode}
                          modified={diffTarget === 'solution' ? activeQuestion.solutionCode : activeQuestion.starterCode}
                          options={{
                            readOnly: true,
                            renderSideBySide: diffSideBySide,
                            minimap: { enabled: false },
                            automaticLayout: true,
                            fontSize: 13,
                            scrollBeyondLastLine: false,
                            wordWrap: 'on'
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <Editor
                      height="100%"
                      defaultLanguage="javascript"
                      theme={resolvedTheme === 'light' ? 'light' : 'vs-dark'}
                      value={currentCode}
                      onChange={handleCodeChange}
                      onMount={(editor) => {
                        editorRef.current = editor;
                      }}
                      options={{
                        fontSize: 13,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: 'on'
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Live Preview */}
              <div className="mc-preview-container">
                <div className="mc-panel-header">
                  <span>⚡ Interactive Execution Sandbox</span>
                  <button
                    onClick={() => executeCode(currentCode)}
                    style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '11px' }}
                  >
                    ⟳ Refresh
                  </button>
                </div>
                <iframe
                  ref={iframeRef}
                  className="mc-iframe-runner"
                  title="React Preview Sandbox"
                  srcDoc={previewSrcDoc}
                  sandbox="allow-scripts allow-modals allow-same-origin"
                />
              </div>
            </div>

            {/* Live Console Drawer */}
            <div className="mc-console-drawer">
              <div className="mc-panel-header" style={{ borderTop: 'none', background: '#161b22' }}>
                <span>Terminal Output / Logs ({consoleLogs.length})</span>
                <button
                  onClick={() => setConsoleLogs([])}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '11px' }}
                >
                  Clear Console
                </button>
              </div>
              <div className="mc-console-logs">
                {consoleLogs.length === 0 ? (
                  <div style={{ color: '#484f58', fontStyle: 'italic' }}>
                    No console logs or errors. Press "Run Live" or interact with components above.
                  </div>
                ) : (
                  consoleLogs.map((log, idx) => (
                    <div key={idx} className={`mc-log-entry ${log.level}`}>
                      <span>[{log.level.toUpperCase()}]</span>
                      <span>{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Evaluation Scorecard Modal */}
        {showScorecard && scorecardData && (
          <InterviewScorecardModal
            data={scorecardData}
            onClose={() => setShowScorecard(false)}
            onReviewSolution={() => {
              setShowScorecard(false);
              setActiveTab('solution');
            }}
            onOpenDiff={() => {
              setShowScorecard(false);
              setDiffTarget('solution');
              setEditorViewMode('diff');
            }}
            onRetry={() => {
              setShowScorecard(false);
              handleResetStarter();
              handleStartInterview(interviewDuration);
            }}
          />
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: HUB DIRECTORY / OVERVIEW MODE
  // -------------------------------------------------------------
  return (
    <div className="mc-studio-container">
      <div className="mc-overview">
        {/* Hero Section */}
        <div className="mc-hero">
          <div className="mc-hero-tag">
            <span>⚡ Full 500-Question Curriculum</span>
            <span>•</span>
            <span>Batches 1–10</span>
          </div>

          <h1 className="mc-hero-title">
            React.js Machine Coding Masterclass (500 Questions)
          </h1>

          <p className="mc-hero-desc">
            Complete 500-question React.js machine coding curriculum with real-time execution. Write code in Monaco Editor, compile with Babel standalone, inspect live DOM previews, and master FAANG-level state architectures across all 10 major interview tiers.
          </p>

          <div className="mc-stats-row">
            <div className="mc-stat-card">
              <span className="mc-stat-num">{MACHINE_CODING_QUESTIONS.length}</span>
              <span className="mc-stat-label">Available Problems</span>
            </div>
            <div className="mc-stat-card">
              <span className="mc-stat-num" style={{ color: '#4ade80' }}>{solvedCount}</span>
              <span className="mc-stat-label">Completed</span>
            </div>
            <div className="mc-stat-card">
              <span className="mc-stat-num" style={{ color: '#38bdf8' }}>
                {Math.round((solvedCount / MACHINE_CODING_QUESTIONS.length) * 100)}%
              </span>
              <span className="mc-stat-label">Progress Rate</span>
            </div>
            <div className="mc-stat-card">
              <span className="mc-stat-num" style={{ color: '#c084fc' }}>React 19</span>
              <span className="mc-stat-label">Engine Environment</span>
            </div>
          </div>
        </div>

        {/* Batch Selection Tabs */}
        <div className="mc-batch-tabs">
          {BATCHES.map(b => (
            <button
              key={b.id}
              className={`mc-batch-btn ${selectedBatch === b.id ? 'active' : ''}`}
              onClick={() => { setSelectedBatch(b.id); setCurrentPage(1); }}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="mc-controls-bar">
          <div className="mc-search-box">
            <span className="mc-search-icon">🔍</span>
            <input
              type="text"
              className="mc-search-input"
              placeholder="Search 500 challenges by title, ID (e.g. Q042), or topic..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <div className="mc-filter-pills">
            {categories.map(cat => (
              <button
                key={cat}
                className={`mc-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {['All', 'Easy', 'Medium', 'Hard', 'Senior'].map(diff => (
              <button
                key={diff}
                className={`mc-filter-btn ${selectedDifficulty === diff ? 'active' : ''}`}
                onClick={() => { setSelectedDifficulty(diff); setCurrentPage(1); }}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="mc-cards-grid">
          {paginatedQuestions.map((q) => {
            const isCompleted = !!solvedMap[q.id];

            return (
              <div key={q.id} className={`mc-card ${isCompleted ? 'completed' : ''}`}>
                <div>
                  <div className="mc-card-header">
                    <span className="mc-card-id">{q.id}</span>
                    <span className={`mc-badge ${q.difficulty.toLowerCase()}`}>
                      {q.difficulty}
                    </span>
                  </div>

                  <h3 className="mc-card-title">{q.title}</h3>
                  <p className="mc-card-summary">{q.summary}</p>
                </div>

                <div className="mc-card-footer">
                  <div className="mc-card-meta">
                    <span>⏱️ {q.timeEstimate}</span>
                    <span>•</span>
                    <span>{q.category}</span>
                  </div>

                  <button
                    className="mc-btn-primary"
                    onClick={() => selectQuestion(q.id)}
                  >
                    <span>{isCompleted ? 'Review' : 'Code'}</span>
                    <span>▶</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mc-pagination-bar">
            <button
              className="mc-page-nav-btn"
              disabled={currentPage === 1}
              onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              ‹ Previous
            </button>
            <span className="mc-page-indicator">
              Page {currentPage} of {totalPages} ({filteredQuestions.length} total questions in view)
            </span>
            <button
              className="mc-page-nav-btn"
              disabled={currentPage === totalPages}
              onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              Next ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
