// src/components/coreprogramming/CoreProgrammingStudio.tsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { CORE_PROGRAMMING_QUESTIONS, getCoreProgrammingQuestion } from './data/coreProgrammingQuestions';
import type { CoreProgrammingQuestion, CoreProgrammingRunResult, CoreProgrammingSubmission } from './data/coreProgrammingTypes';
import { runCoreProgrammingCode } from './lib/coreProgrammingRunner';
import { coreProgrammingProgressService } from './lib/coreProgrammingProgressService';
import { coreProgrammingSubmissionService } from './lib/coreProgrammingSubmissionService';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { CoreProgrammingDetail } from './components/CoreProgrammingDetail';
import { CoreProgrammingTestPanel } from './components/CoreProgrammingTestPanel';
import { CoreProgrammingDashboard } from './components/CoreProgrammingDashboard';
import { CoreProgrammingDailyPractice } from './components/CoreProgrammingDailyPractice';
import { CoreProgrammingQuestionList } from './components/CoreProgrammingQuestionList';
import './CoreProgrammingStudio.css';

const CP_BATCHES = [
  { id: 'b1', label: 'B1: Basics & Strings (1-50)', start: 1, end: 50 },
  { id: 'b2', label: 'B2: Strings & Arrays (51-100)', start: 51, end: 100 },
  { id: 'b3', label: 'B3: Arrays Deep Dive (101-150)', start: 101, end: 150 },
  { id: 'b4', label: 'B4: Objects Mastery (151-200)', start: 151, end: 200 },
  { id: 'b5', label: 'B5: Functions & Scope (201-250)', start: 201, end: 250 },
  { id: 'b6', label: 'B6: Array Methods & Prototypes (251-300)', start: 251, end: 300 },
  { id: 'b7', label: 'B7: Closures & this / bind (301-350)', start: 301, end: 350 },
  { id: 'b8', label: 'B8: ES6+ & Recursion (351-400)', start: 351, end: 400 },
  { id: 'b9', label: 'B9: Algorithms & Functional JS (401-450)', start: 401, end: 450 },
  { id: 'b10', label: 'B10: Async & Advanced JS (451-500)', start: 451, end: 500 },
];

export default function CoreProgrammingStudio() {
  const [searchParams] = useSearchParams();
  const { id: routeId } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const isNamedCatalog = routeId && ['questions', 'progress', 'daily'].includes(routeId);
  const qIdParam = searchParams.get('id') || (!isNamedCatalog && routeId ? routeId : null);

  const [isDailyPracticeOpen, setIsDailyPracticeOpen] = useState(false);

  // Active question lookup
  const activeQuestion = useMemo<CoreProgrammingQuestion | null>(() => {
    if (!qIdParam) return null;
    return getCoreProgrammingQuestion(qIdParam) || CORE_PROGRAMMING_QUESTIONS[0];
  }, [qIdParam]);

  const handleSelectQuestion = useCallback((qid: string) => {
    navigate(`/core-programming/question/${qid}`);
  }, [navigate]);

  const handleBackToCatalog = useCallback(() => {
    navigate('/core-programming');
  }, [navigate]);

  if (!activeQuestion) {
    return (
      <>
        <CoreProgrammingDashboard
          questions={CORE_PROGRAMMING_QUESTIONS}
          onSelectQuestion={handleSelectQuestion}
          onOpenDailyPractice={() => setIsDailyPracticeOpen(true)}
        />
        <CoreProgrammingDailyPractice
          isOpen={isDailyPracticeOpen}
          onClose={() => setIsDailyPracticeOpen(false)}
          questions={CORE_PROGRAMMING_QUESTIONS}
          onStartSession={handleSelectQuestion}
        />
      </>
    );
  }

  return (
    <CoreProgrammingWorkspace
      question={activeQuestion}
      onBackToCatalog={handleBackToCatalog}
      onSelectQuestion={handleSelectQuestion}
    />
  );
}

interface WorkspaceProps {
  question: CoreProgrammingQuestion;
  onBackToCatalog: () => void;
  onSelectQuestion: (qid: string) => void;
}

function CoreProgrammingWorkspace({
  question,
  onBackToCatalog,
  onSelectQuestion,
}: WorkspaceProps) {
  const { user } = useAuth();
  const { resolvedTheme } = useTheme();

  // Code state
  const [currentCode, setCurrentCode] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const autosaveTimeoutRef = useRef<number | null>(null);
  const editorRef = useRef<any>(null);

  // Layout & Resizing
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(() => {
    return Math.max(400, Math.min(680, Math.floor(window.innerWidth * 0.44)));
  });
  const [bottomPanelHeight, setBottomPanelHeight] = useState<number>(290);
  const [fullscreenPanel, setFullscreenPanel] = useState<'none' | 'specs' | 'editor' | 'test'>('none');
  const isDraggingLeft = useRef<boolean>(false);
  const isDraggingBottom = useRef<boolean>(false);

  // Auto-resize Monaco editor when fullscreenPanel toggles
  useEffect(() => {
    const timer = setTimeout(() => {
      if (editorRef.current && typeof editorRef.current.layout === 'function') {
        editorRef.current.layout();
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [fullscreenPanel]);

  // Execution & Test State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<CoreProgrammingRunResult | null>(null);
  const [activeTestTab, setActiveTestTab] = useState<'testcase' | 'result' | 'submissions'>('testcase');
  const [customInput, setCustomInput] = useState<string>('');
  const [useCustomInput, setUseCustomInput] = useState<boolean>(false);
  const [submissions, setSubmissions] = useState<CoreProgrammingSubmission[]>([]);

  // Editor Appearance State
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>(
    resolvedTheme === 'dark' ? 'vs-dark' : 'light'
  );
  const [fontSize, setFontSize] = useState<number>(13);

  // Modals & Drawers
  const [isListDrawerOpen, setIsListDrawerOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [paletteSearchQuery, setPaletteSearchQuery] = useState<string>('');
  const [paletteSelectedIndex, setPaletteSelectedIndex] = useState<number>(0);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);
  const paletteListRef = useRef<HTMLDivElement>(null);

  // Bookmark & Solved State
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isAttempted, setIsAttempted] = useState<boolean>(false);
  const [isSolved, setIsSolved] = useState<boolean>(false);

  // Practice Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  }, []);

  // Navigation
  const currentIndex = useMemo(() => {
    return CORE_PROGRAMMING_QUESTIONS.findIndex(q => q.id === question.id);
  }, [question.id]);
  const prevQuestion = currentIndex > 0 ? CORE_PROGRAMMING_QUESTIONS[currentIndex - 1] : null;
  const nextQuestion = currentIndex < CORE_PROGRAMMING_QUESTIONS.length - 1 ? CORE_PROGRAMMING_QUESTIONS[currentIndex + 1] : null;

  // Initialize question state
  useEffect(() => {
    const draft = coreProgrammingProgressService.getDraft(question.id);
    setCurrentCode(draft !== null ? draft : question.starterCode);
    setIsBookmarked(coreProgrammingProgressService.isBookmarked(question.id));
    setIsAttempted(coreProgrammingProgressService.isAttempted(question.id));
    setIsSolved(coreProgrammingProgressService.isSolved(question.id));

    const timer = coreProgrammingProgressService.getTimer(question.id);
    setTimerSeconds(timer.elapsedSeconds);
    setIsTimerRunning(true);

    setSubmissions(coreProgrammingProgressService.getSubmissions(question.id));
    setRunResult(null);
    setActiveTestTab('testcase');
    setCustomInput(question.testCases[0]?.input || '[]');
    setUseCustomInput(false);
    coreProgrammingProgressService.setLastVisitedQuestion(question.id);
  }, [question.id, question.starterCode]);

  // Sync editor theme with application theme
  useEffect(() => {
    setEditorTheme(resolvedTheme === 'dark' ? 'vs-dark' : 'light');
  }, [resolvedTheme]);

  // Timer interval
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = window.setInterval(() => {
      setTimerSeconds(prev => {
        const next = prev + 1;
        if (next % 10 === 0) {
          coreProgrammingProgressService.saveTimer(question.id, next);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, question.id]);

  // Autosave code changes with debounce
  const handleCodeChange = (newVal: string | undefined) => {
    const val = newVal || '';
    setCurrentCode(val);

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = window.setTimeout(() => {
      coreProgrammingProgressService.saveDraft(question.id, val);
    }, 1000);
  };

  // Run Code (Sample cases or custom input)
  const handleRunCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    coreProgrammingProgressService.markAttempted(question.id);
    setIsAttempted(true);
    setActiveTestTab('result');
    showToast('⚙️ Executing JavaScript tests in sandbox...');

    try {
      let targetCases: any[];
      if (useCustomInput) {
        targetCases = [
          {
            id: 'custom_case',
            input: customInput,
            expectedOutput: 'null',
            isHidden: false,
          },
        ];
      } else {
        targetCases = question.testCases;
      }

      const res = await runCoreProgrammingCode(currentCode, question.functionName, targetCases, 4000);
      setRunResult(res);

      if (res.success) {
        showToast('✓ All sample test cases passed!');
      } else {
        showToast(`Execution finished with ${res.passedCount}/${res.totalCount} passed.`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setRunResult({
        success: false,
        status: 'Runtime Error',
        passedCount: 0,
        totalCount: question.testCases.length,
        results: [],
        totalRuntimeMs: 0,
        consoleLogs: [],
        error: msg,
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Solution (All test cases including hidden ones)
  const handleSubmitSolution = async () => {
    if (isSubmitting || isRunning) return;
    setIsSubmitting(true);
    setIsRunning(true);
    coreProgrammingProgressService.markAttempted(question.id);
    setIsAttempted(true);
    setActiveTestTab('result');
    showToast('🏁 Evaluating official candidate submission...');

    try {
      const allTests = [...question.testCases, ...(question.hiddenTestCases || [])];
      const res = await runCoreProgrammingCode(currentCode, question.functionName, allTests, 5000);
      setRunResult(res);

      const submissionScore = res.success
        ? 100
        : Math.round((res.passedCount / Math.max(1, res.totalCount)) * 80);

      const newSub: CoreProgrammingSubmission = {
        id: `sub_${Date.now().toString(36)}`,
        questionId: question.id,
        code: currentCode,
        status: res.status,
        testsPassed: res.passedCount,
        testsTotal: res.totalCount,
        runtimeMs: res.totalRuntimeMs,
        score: submissionScore,
        timestamp: new Date().toISOString(),
      };

      // Persist locally + sync to Supabase + mirror for leaderboard/dashboard
      await coreProgrammingSubmissionService.submit(newSub, user)
      setSubmissions(coreProgrammingProgressService.getSubmissions(question.id));

      if (res.success) {
        setIsSolved(true);
        showToast('🎉 Outstanding! All test cases passed. Submission accepted!');
      } else {
        showToast(`Submission finished: ${res.passedCount}/${res.totalCount} test cases passed.`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setRunResult({
        success: false,
        status: 'Runtime Error',
        passedCount: 0,
        totalCount: question.testCases.length,
        results: [],
        totalRuntimeMs: 0,
        consoleLogs: [],
        error: msg,
      });
    } finally {
      setIsRunning(false);
      setIsSubmitting(false);
    }
  };

  // Splitter Dragging: Left Panel vs Right Panel
  const handleLeftMouseMove = useCallback((e: MouseEvent) => {
    if (isDraggingLeft.current) {
      const newWidth = Math.max(340, Math.min(window.innerWidth * 0.65, e.clientX));
      setLeftPanelWidth(newWidth);
    }
  }, []);

  const handleLeftMouseUp = useCallback(() => {
    isDraggingLeft.current = false;
    window.removeEventListener('mousemove', handleLeftMouseMove);
    window.removeEventListener('mouseup', handleLeftMouseUp);
  }, [handleLeftMouseMove]);

  const startLeftDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingLeft.current = true;
    window.addEventListener('mousemove', handleLeftMouseMove);
    window.addEventListener('mouseup', handleLeftMouseUp);
  };

  // Splitter Dragging: Editor vs Bottom Test Panel
  const handleBottomMouseMove = useCallback((e: MouseEvent) => {
    if (isDraggingBottom.current) {
      const newHeight = Math.max(160, Math.min(window.innerHeight * 0.7, window.innerHeight - e.clientY));
      setBottomPanelHeight(newHeight);
    }
  }, []);

  const handleBottomMouseUp = useCallback(() => {
    isDraggingBottom.current = false;
    window.removeEventListener('mousemove', handleBottomMouseMove);
    window.removeEventListener('mouseup', handleBottomMouseUp);
  }, [handleBottomMouseMove]);

  const startBottomDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingBottom.current = true;
    window.addEventListener('mousemove', handleBottomMouseMove);
    window.addEventListener('mouseup', handleBottomMouseUp);
  };

  // Toggle Bookmark
  const handleToggleBookmark = () => {
    const next = coreProgrammingProgressService.toggleBookmark(question.id);
    setIsBookmarked(next);
    showToast(next ? '★ Challenge bookmarked!' : '☆ Challenge removed from bookmarks.');
  };

  // Reset code to initial template
  const handleResetCode = () => {
    if (window.confirm('Reset code to the original starter template for this problem?')) {
      setCurrentCode(question.starterCode);
      coreProgrammingProgressService.saveDraft(question.id, question.starterCode);
      showToast('Code reset to default starter template.');
    }
  };

  // Format code in Monaco
  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
      showToast('Code formatted.');
    }
  };

  // Adopt reference solution
  const handleAdoptSolution = (code: string) => {
    setCurrentCode(code);
    coreProgrammingProgressService.saveDraft(question.id, code);
    showToast('Reference solution adopted into editor.');
  };

  // Select previous submission
  const handleSelectSubmission = (sub: CoreProgrammingSubmission) => {
    if (sub.code) {
      setCurrentCode(sub.code);
      coreProgrammingProgressService.saveDraft(question.id, sub.code);
      showToast(`Loaded submission code from ${new Date(sub.timestamp).toLocaleTimeString()}`);
    }
  };

  // Global Keyboard Shortcuts (⌘K, ⌘Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        if (fullscreenPanel !== 'none') {
          setFullscreenPanel('none');
          return;
        }
        setIsCommandPaletteOpen(false);
        setIsListDrawerOpen(false);
        setShowShortcutsModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCode, isRunning, isSubmitting, useCustomInput, customInput, fullscreenPanel]);

  // Command palette search
  const filteredPaletteQuestions = useMemo(() => {
    if (!paletteSearchQuery.trim()) return CORE_PROGRAMMING_QUESTIONS.slice(0, 50);
    const q = paletteSearchQuery.toLowerCase();
    return CORE_PROGRAMMING_QUESTIONS.filter(item =>
      item.id.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }, [paletteSearchQuery]);

  const formatMMSS = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="dsa-studio-container cp-studio-container">
      {/* ================= 1. CANONICAL TOPBAR NAVIGATION ================= */}
      <header className="dsa-topbar cp-topbar">
        <div className="dsa-topbar-left cp-topbar-left">
          <button
            type="button"
            className="cp-nav-btn"
            onClick={onBackToCatalog}
            title="Return to Core Programming Catalog"
          >
            ← Catalog
          </button>

          <button
            type="button"
            className="cp-nav-btn"
            onClick={() => setIsListDrawerOpen(prev => !prev)}
            title="Browse all 500 questions (Problem List)"
          >
            📋 Problem List
          </button>

          <button
            type="button"
            className="cp-nav-btn cp-search-btn"
            onClick={() => setIsCommandPaletteOpen(true)}
            title="Quick Search (Ctrl+K)"
          >
            <span>🔍 Search</span>
            <kbd className="cp-kbd">⌘K</kbd>
          </button>

          <div className="cp-challenge-capsule">
            <div className="cp-nav-arrows">
              <button
                type="button"
                className="cp-nav-arrow"
                disabled={!prevQuestion}
                onClick={() => prevQuestion && onSelectQuestion(prevQuestion.id)}
                title={prevQuestion ? `Prev: ${prevQuestion.id}` : 'First problem'}
                aria-label="Previous problem"
              >
                ◀
              </button>
              <button
                type="button"
                className="cp-nav-arrow"
                disabled={!nextQuestion}
                onClick={() => nextQuestion && onSelectQuestion(nextQuestion.id)}
                title={nextQuestion ? `Next: ${nextQuestion.id}` : 'Last problem'}
                aria-label="Next problem"
              >
                ▶
              </button>
            </div>
            <span className="cp-counter">
              {currentIndex + 1} / {CORE_PROGRAMMING_QUESTIONS.length}
            </span>
            <div className="cp-select-wrapper">
              <select
                className="cp-question-select"
                value={question.id}
                onChange={(e) => onSelectQuestion(e.target.value)}
                title={`${question.id}: ${question.title}`}
              >
                {CP_BATCHES.map(b => (
                  <optgroup key={b.id} label={b.label}>
                    {CORE_PROGRAMMING_QUESTIONS.slice(b.start - 1, b.end).map(q => (
                      <option key={q.id} value={q.id}>
                        {q.id}: {q.title} ({q.difficulty}) {coreProgrammingProgressService.isSolved(q.id) ? '✓' : ''}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          <span className={`cp-diff-pill ${question.difficulty.toLowerCase()}`}>
            {question.difficulty}
          </span>

          <button
            type="button"
            className={`cp-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={handleToggleBookmark}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark challenge'}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark challenge'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>

          <span className={`cp-status-pill ${isSolved ? 'solved' : isAttempted ? 'attempted' : 'not-started'}`}>
            {isSolved ? '✓ Solved' : isAttempted ? '● Attempted' : '○ Ready'}
          </span>
        </div>

        {/* Center: Language & Session Timer */}
        <div className="dsa-topbar-center cp-topbar-center">
          <div className="cp-lang-pill">
            <span className="cp-lang-js-badge">JS</span>
            <span className="cp-lang-text">JavaScript (ES2026)</span>
          </div>

          <div
            className="cp-timer-box"
            onClick={() => setIsTimerRunning(prev => !prev)}
            title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{formatMMSS(timerSeconds)}</span>
            <span className="cp-timer-state">{isTimerRunning ? '⏸' : '▶'}</span>
          </div>
        </div>

        {/* Right: Reset, Format, Run, Submit buttons */}
        <div className="dsa-topbar-right cp-topbar-right">
          <button
            type="button"
            className="cp-topbar-btn cp-btn-ghost"
            onClick={handleFormatCode}
            title="Auto-format code document"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
            </svg>
            <span>Format</span>
          </button>

          <button
            type="button"
            className="cp-topbar-btn cp-btn-ghost"
            onClick={handleResetCode}
            title="Reset code to starter template"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            <span>Reset</span>
          </button>

          <button
            type="button"
            className="cp-topbar-btn cp-btn-run"
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            title="Run sample test cases (Ctrl + Enter)"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>{isRunning && !isSubmitting ? 'Running...' : 'Run Code'}</span>
          </button>

          <button
            type="button"
            className="cp-topbar-btn cp-btn-submit"
            onClick={handleSubmitSolution}
            disabled={isRunning || isSubmitting}
            title="Submit solution against all hidden tests"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 12 5 5L20 7" />
            </svg>
            <span>{isSubmitting ? 'Evaluating...' : 'Submit'}</span>
          </button>

          <button
            type="button"
            className="cp-topbar-icon-btn"
            onClick={() => setShowShortcutsModal(true)}
            title="Keyboard shortcuts & Help"
            aria-label="Keyboard shortcuts"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10" />
            </svg>
          </button>
        </div>
      </header>

      {/* ================= 2. CANONICAL 2-COLUMN IDE WORKSPACE ================= */}
      <div className="dsa-workspace cp-workspace">
        {/* LEFT PANEL: Problem Details, Checklist, Examples, Constraints, Editorial, Hints */}
        <div
          className="dsa-left-panel cp-left-panel"
          style={{
            width: fullscreenPanel === 'specs' ? '100%' : leftPanelWidth,
            display: (fullscreenPanel === 'editor' || fullscreenPanel === 'test') ? 'none' : 'flex',
            flex: fullscreenPanel === 'specs' ? 1 : undefined,
            borderRight: fullscreenPanel === 'specs' ? 'none' : undefined,
          }}
        >
          <CoreProgrammingDetail
            question={question}
            submissions={submissions}
            onAdoptSolution={handleAdoptSolution}
            onSelectSubmission={handleSelectSubmission}
            fullscreenPanel={fullscreenPanel}
            onToggleFullscreen={() => setFullscreenPanel(prev => prev === 'specs' ? 'none' : 'specs')}
          />
        </div>

        {/* RESIZABLE SPLITTER (Vertical) */}
        {fullscreenPanel === 'none' && (
          <div
            className="dsa-splitter cp-splitter"
            onMouseDown={startLeftDrag}
            title="Drag to resize Problem Description vs Editor"
          />
        )}

        {/* RIGHT PANEL: Monaco Editor (Top) + Test Cases & Execution Results (Bottom) */}
        <div
          className="dsa-right-panel cp-right-panel"
          style={{
            display: fullscreenPanel === 'specs' ? 'none' : 'flex',
            flex: 1,
            width: fullscreenPanel !== 'none' ? '100%' : undefined,
          }}
        >
          {/* Editor Header Bar */}
          <div className="cp-editor-toolbar" style={{ display: fullscreenPanel === 'test' ? 'none' : 'flex' }}>
            <div className="cp-editor-tab-group">
              <div className="cp-editor-file-tab">
                <span className="cp-file-js-icon">JS</span>
                <span className="cp-file-name">solution.js</span>
                <span className="cp-file-fn">• {question.functionName}(...)</span>
              </div>
            </div>

            <div className="cp-editor-tools">
              <button
                type="button"
                className="cp-editor-tool-btn"
                onClick={() => setEditorTheme(t => t === 'vs-dark' ? 'light' : 'vs-dark')}
                title="Toggle editor theme"
              >
                {editorTheme === 'vs-dark' ? '🌙 Dark' : '☀️ Light'}
              </button>
              <div className="cp-font-pills">
                <span className="cp-font-label">Font:</span>
                {[12, 13, 15].map(sz => (
                  <button
                    key={sz}
                    type="button"
                    className={`cp-font-btn ${fontSize === sz ? 'active' : ''}`}
                    onClick={() => setFontSize(sz)}
                  >
                    {sz}px
                  </button>
                ))}
              </div>

              <button
                type="button"
                className={`cp-icon-tool-btn cp-fullscreen-btn ${fullscreenPanel === 'editor' ? 'active' : ''}`}
                onClick={() => setFullscreenPanel(prev => prev === 'editor' ? 'none' : 'editor')}
                title={fullscreenPanel === 'editor' ? 'Restore Editor Size (Esc)' : 'Maximize Code Editor (Fullscreen)'}
                aria-label={fullscreenPanel === 'editor' ? 'Restore Editor Size' : 'Maximize Code Editor'}
              >
                {fullscreenPanel === 'editor' ? (
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
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div
            className="dsa-editor-wrapper cp-editor-wrapper"
            style={{
              display: fullscreenPanel === 'test' ? 'none' : 'flex',
              flex: 1,
              height: fullscreenPanel === 'editor' ? '100%' : undefined,
            }}
          >
            <Editor
              height="100%"
              language="javascript"
              theme={editorTheme}
              value={currentCode}
              onChange={handleCodeChange}
              onMount={(ed) => {
                editorRef.current = ed;
              }}
              options={{
                fontSize: fontSize,
                fontFamily: "'Fira Code', 'Courier New', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                automaticLayout: true,
                tabSize: 2,
                folding: true,
                cursorBlinking: 'smooth',
                wordWrap: 'on',
              }}
            />
          </div>

          {/* RESIZABLE SPLITTER (Horizontal) */}
          {fullscreenPanel === 'none' && (
            <div
              className="dsa-horizontal-splitter cp-horizontal-splitter"
              onMouseDown={startBottomDrag}
              title="Drag to resize Editor vs Testcases console"
            />
          )}

          {/* BOTTOM PANEL: Canonical Test Cases & Test Results */}
          <div
            className="dsa-bottom-panel cp-bottom-panel"
            style={{
              display: fullscreenPanel === 'editor' ? 'none' : 'flex',
              height: fullscreenPanel === 'test' ? '100%' : bottomPanelHeight,
              flex: fullscreenPanel === 'test' ? 1 : undefined,
              borderTop: fullscreenPanel === 'test' ? 'none' : undefined,
            }}
          >
            <CoreProgrammingTestPanel
              testCases={question.testCases}
              runResult={runResult}
              isRunning={isRunning}
              activeTab={activeTestTab as any}
              setActiveTab={setActiveTestTab as any}
              customInput={customInput}
              onCustomInputChange={setCustomInput}
              useCustomInput={useCustomInput}
              onToggleCustomInput={setUseCustomInput}
              submissions={submissions}
              fullscreenPanel={fullscreenPanel}
              onToggleFullscreen={() => setFullscreenPanel(prev => prev === 'test' ? 'none' : 'test')}
            />
          </div>
        </div>
      </div>

      {/* ================= 3. SLIDING PROBLEM LIST DRAWER ================= */}
      {isListDrawerOpen && (
        <div className="cp-qlist-drawer-overlay" onClick={() => setIsListDrawerOpen(false)}>
          <div className="cp-qlist-drawer" onClick={e => e.stopPropagation()}>
            <CoreProgrammingQuestionList
              questions={CORE_PROGRAMMING_QUESTIONS}
              activeQuestionId={question.id}
              onSelectQuestion={(qid) => {
                onSelectQuestion(qid);
                setIsListDrawerOpen(false);
              }}
              onClose={() => setIsListDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ================= 4. COMMAND PALETTE MODAL (⌘K) ================= */}
      {isCommandPaletteOpen && (
        <div className="mc-palette-overlay" onClick={() => setIsCommandPaletteOpen(false)}>
          <div className="mc-palette-modal" onClick={e => e.stopPropagation()}>
            <div className="mc-palette-search-box">
              <span className="mc-palette-search-icon">🔍</span>
              <input
                type="text"
                autoFocus
                className="mc-palette-input"
                placeholder="Type question ID (e.g. JS-P002), title, or category..."
                value={paletteSearchQuery}
                onChange={e => {
                  setPaletteSearchQuery(e.target.value);
                  setPaletteSelectedIndex(0);
                }}
                onKeyDown={e => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setPaletteSelectedIndex(prev => Math.min(filteredPaletteQuestions.length - 1, prev + 1));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setPaletteSelectedIndex(prev => Math.max(0, prev - 1));
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (filteredPaletteQuestions[paletteSelectedIndex]) {
                      onSelectQuestion(filteredPaletteQuestions[paletteSelectedIndex].id);
                      setIsCommandPaletteOpen(false);
                    }
                  }
                }}
              />
              <span className="mc-palette-tag">ESC to close</span>
            </div>

            <div ref={paletteListRef} className="mc-palette-results">
              {filteredPaletteQuestions.map((q, idx) => {
                const isSelected = idx === paletteSelectedIndex;
                const isItemSolved = coreProgrammingProgressService.isSolved(q.id);
                return (
                  <div
                    key={q.id}
                    className={`mc-palette-item ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      onSelectQuestion(q.id);
                      setIsCommandPaletteOpen(false);
                    }}
                    onMouseEnter={() => setPaletteSelectedIndex(idx)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="mc-palette-item-id">{q.id}</span>
                      <span className="mc-palette-item-title">{q.title}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="mc-cat-badge">{q.category}</span>
                      <span className={`mc-badge ${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                      {isItemSolved && <span style={{ color: '#34d399', fontSize: '12px' }}>✓</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= 5. KEYBOARD SHORTCUTS MODAL ================= */}
      {showShortcutsModal && (
        <div className="mc-palette-overlay" onClick={() => setShowShortcutsModal(false)}>
          <div className="mc-palette-modal" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(148, 163, 184, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Keyboard Shortcuts</h3>
              <button type="button" className="mc-modal-close" onClick={() => setShowShortcutsModal(false)}>×</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#cbd5e1', fontSize: '13px' }}>Quick Question Switcher</span>
                <kbd style={{ background: '#0f172a', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(148, 163, 184, 0.2)', color: '#818cf8', fontSize: '12px' }}>⌘K / Ctrl+K</kbd>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#cbd5e1', fontSize: '13px' }}>Run Code Sample Cases</span>
                <kbd style={{ background: '#0f172a', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(148, 163, 184, 0.2)', color: '#818cf8', fontSize: '12px' }}>⌘Enter / Ctrl+Enter</kbd>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#cbd5e1', fontSize: '13px' }}>Close Modals / Drawers</span>
                <kbd style={{ background: '#0f172a', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(148, 163, 184, 0.2)', color: '#818cf8', fontSize: '12px' }}>Esc</kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 6. TOAST NOTIFICATION ================= */}
      {toastMessage && (
        <div className="mc-toast">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
