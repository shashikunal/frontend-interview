import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Editor, { DiffEditor } from '@monaco-editor/react';
import { useTheme } from '../../context/ThemeContext';
import { buildReactSrcDoc } from '../../lib/runner';
import { exportMachineCodingZip } from '../../lib/zipExport';
import { MACHINE_CODING_QUESTIONS } from './machineCodingQuestions';
import { getQuestionTestCases, type MCTestCase, type MCTestResult } from './data/machineCodingTests';
import InterviewScorecardModal, { type ScorecardData } from './InterviewScorecardModal';
import AIInterviewPrompter from './AIInterviewPrompter';
import './MachineCodingStudio.css';

interface ConsoleLog {
  level: 'log' | 'info' | 'warn' | 'error';
  message: string;
}

const DEFAULT_STARTER_CSS = `/* Custom Stylesheet for Component */
.container {
  padding: 1rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1e293b;
}

button {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: 1px solid #cbd5e1;
  background-color: #f8fafc;
  color: #0f172a;
  cursor: pointer;
  transition: all 0.15s ease;
}

button:hover {
  background-color: #f1f5f9;
  border-color: #94a3b8;
}

input, select, textarea {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #0f172a;
  outline: none;
}

input:focus, select:focus, textarea:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}
`;

const FILE_PRESETS = [
  {
    name: 'styles.css',
    icon: '🎨',
    desc: 'CSS Stylesheet (injected into live sandbox)',
    template: DEFAULT_STARTER_CSS,
  },
  {
    name: 'mockData.ts',
    icon: '📋',
    desc: 'Mock data arrays, API fixtures & models',
    template: `// Mock data definitions
export interface Item {
  id: string;
  name: string;
  category: string;
  value: number;
}

export const MOCK_ITEMS: Item[] = [
  { id: '1', name: 'Item Alpha', category: 'Frontend', value: 120 },
  { id: '2', name: 'Item Beta', category: 'Backend', value: 85 },
  { id: '3', name: 'Item Gamma', category: 'Design', value: 240 },
];
`,
  },
  {
    name: 'types.ts',
    icon: '🏷️',
    desc: 'TypeScript interfaces and type declarations',
    template: `// Common TypeScript types & interfaces
export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface BaseEntity {
  id: string;
  createdAt: number;
  updatedAt: number;
}
`,
  },
  {
    name: 'utils.ts',
    icon: '⚙️',
    desc: 'Helper algorithms, formatting & debounce tools',
    template: `// Utility functions
export function debounce<T extends (...args: any[]) => any>(fn: T, delayMs: number) {
  let timer: any;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
}

export function formatCurrency(val: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
}
`,
  },
];

const getEditorLanguage = (fileName: string): string => {
  if (fileName.endsWith('.css')) return 'css';
  if (fileName.endsWith('.json')) return 'json';
  if (fileName.endsWith('.html')) return 'html';
  if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) return 'typescript';
  return 'javascript';
};

const getFileIcon = (fileName: string): string => {
  if (fileName.endsWith('.css')) return '🎨';
  if (fileName.endsWith('.json')) return '📋';
  if (fileName.endsWith('.html')) return '🌐';
  if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) return '⚛️';
  if (fileName.endsWith('.ts') || fileName.endsWith('.js')) return '📄';
  return '📄';
};

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

  // Multi-file project workspace state
  const [files, setFiles] = useState<Record<string, string>>({ 'App.tsx': '' });
  const [activeFileName, setActiveFileName] = useState<string>('App.tsx');
  const [multiFilesMap, setMultiFilesMap] = useState<Record<string, Record<string, string>>>(() => {
    try {
      const saved = localStorage.getItem('mc_multi_files_v2');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [showAddFileModal, setShowAddFileModal] = useState(false);
  const [newFileNameInput, setNewFileNameInput] = useState('');

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

  // Custom Test Builder State
  const [customTestsMap, setCustomTestsMap] = useState<Record<string, MCTestCase[]>>(() => {
    try {
      const saved = localStorage.getItem('mc_custom_tests_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [isAddingCustomTest, setIsAddingCustomTest] = useState(false);
  const [newTestName, setNewTestName] = useState('');
  const [newTestDesc, setNewTestDesc] = useState('');
  const [newTestAssertion, setNewTestAssertion] = useState('');

  // Hotkeys & Snapshots State
  interface CodeSnapshot {
    id: string;
    timestamp: number;
    label: string;
    files: Record<string, string>;
  }
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showSnapshotMenu, setShowSnapshotMenu] = useState(false);
  const [newSnapshotLabel, setNewSnapshotLabel] = useState('');
  const [snapshots, setSnapshots] = useState<CodeSnapshot[]>([]);
  const snapshotMenuRef = useRef<HTMLDivElement>(null);
  const filesRef = useRef(files);
  filesRef.current = files;
  const executeCodeRef = useRef<() => void>(() => {});
  const handleRunTestsRef = useRef<() => void>(() => {});
  const handleFormatCodeRef = useRef<() => void>(() => {});
  const handleSaveAndFormatRef = useRef<() => void>(() => {});

  // Resizable Panels & Fullscreen Layout State
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mc_panel_left_w');
      return saved ? Number(saved) : 420;
    } catch {
      return 420;
    }
  });
  const [editorWidthPct, setEditorWidthPct] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mc_panel_editor_pct');
      return saved ? Number(saved) : 52;
    } catch {
      return 52;
    }
  });
  const [fullscreenPanel, setFullscreenPanel] = useState<'none' | 'specs' | 'editor' | 'preview'>('none');
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingEditor, setIsDraggingEditor] = useState(false);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // Dragging Mouse Event Listeners for Resizable Panels
  useEffect(() => {
    if (!isDraggingLeft && !isDraggingEditor) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingLeft) {
        const minW = 240;
        const maxW = Math.max(300, window.innerWidth - 420);
        const nextW = Math.max(minW, Math.min(maxW, e.clientX));
        setLeftPanelWidth(nextW);
        try {
          localStorage.setItem('mc_panel_left_w', String(nextW));
        } catch (_) {}
      } else if (isDraggingEditor && rightPanelRef.current) {
        const rect = rightPanelRef.current.getBoundingClientRect();
        if (rect.width > 0) {
          const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
          const clamped = Math.max(20, Math.min(80, pct));
          setEditorWidthPct(clamped);
          try {
            localStorage.setItem('mc_panel_editor_pct', String(clamped));
          } catch (_) {}
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingLeft(false);
      setIsDraggingEditor(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      if (editorRef.current && typeof editorRef.current.layout === 'function') {
        editorRef.current.layout();
      }
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDraggingLeft, isDraggingEditor]);

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

      let questionFiles = multiFilesMap[activeQuestion.id];
      if (!questionFiles) {
        const legacyCode = userCodeMap[activeQuestion.id] || activeQuestion.starterCode;
        questionFiles = {
          'App.tsx': legacyCode,
          'styles.css': DEFAULT_STARTER_CSS,
        };
      } else {
        questionFiles = { ...questionFiles };
      }

      if (!questionFiles['App.tsx']) {
        questionFiles['App.tsx'] = activeQuestion.starterCode;
      }

      setFiles(questionFiles);
      setActiveFileName('App.tsx');
      const initialCode = questionFiles['App.tsx'];
      setCurrentCode(initialCode);
      if (editorRef.current) {
        editorRef.current.setValue(initialCode);
      }
      executeCode(questionFiles);
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

  // Sync snapshots from localStorage on question change
  useEffect(() => {
    if (!activeQuestion) return;
    try {
      const raw = localStorage.getItem(`mc_snapshots_${activeQuestion.id}`);
      setSnapshots(raw ? JSON.parse(raw) : []);
    } catch {
      setSnapshots([]);
    }
  }, [activeQuestion?.id]);

  // Close snapshot menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (snapshotMenuRef.current && !snapshotMenuRef.current.contains(e.target as Node)) {
        setShowSnapshotMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Code Execution via buildReactSrcDoc with multi-file support
  const executeCode = async (filesToRun?: Record<string, string>) => {
    const targetFiles = filesToRun || files;
    setIsCompiling(true);
    setConsoleLogs([]);
    const nextRunId = runId + 1;
    setRunId(nextRunId);

    try {
      const srcDoc = await buildReactSrcDoc(targetFiles, 'App.tsx', nextRunId);
      setPreviewSrcDoc(srcDoc);
    } catch (err: any) {
      console.error(err);
      setConsoleLogs(prev => [...prev, { level: 'error', message: err?.message || 'Babel compilation error' }]);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleSelectFile = (fileName: string) => {
    if (fileName === activeFileName) return;
    setActiveFileName(fileName);
    const content = files[fileName] ?? '';
    setCurrentCode(content);
    if (editorRef.current) {
      editorRef.current.setValue(content);
    }
  };

  const handleAddFile = (name: string, template = '') => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (files[trimmed]) {
      showToast(`⚠️ File "${trimmed}" already exists!`);
      handleSelectFile(trimmed);
      setShowAddFileModal(false);
      return;
    }
    const updatedFiles = { ...files, [trimmed]: template };
    setFiles(updatedFiles);
    setActiveFileName(trimmed);
    setCurrentCode(template);
    if (editorRef.current) {
      editorRef.current.setValue(template);
    }
    if (activeQuestion) {
      setMultiFilesMap(prev => {
        const updated = { ...prev, [activeQuestion.id]: updatedFiles };
        try {
          localStorage.setItem('mc_multi_files_v2', JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });
    }
    setShowAddFileModal(false);
    setNewFileNameInput('');
    showToast(`✓ Created file "${trimmed}"!`);
    executeCode(updatedFiles);
  };

  const handleDeleteFile = (name: string) => {
    if (name === 'App.tsx') {
      showToast('⚠️ App.tsx is the primary entrypoint and cannot be deleted.');
      return;
    }
    const { [name]: _, ...rest } = files;
    setFiles(rest);
    if (activeFileName === name) {
      setActiveFileName('App.tsx');
      const fallbackCode = rest['App.tsx'] || '';
      setCurrentCode(fallbackCode);
      if (editorRef.current) {
        editorRef.current.setValue(fallbackCode);
      }
    }
    if (activeQuestion) {
      setMultiFilesMap(prev => {
        const updated = { ...prev, [activeQuestion.id]: rest };
        try {
          localStorage.setItem('mc_multi_files_v2', JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });
    }
    showToast(`Deleted file "${name}"`);
    executeCode(rest);
  };

  const getAllQuestionTests = (q: any): MCTestCase[] => {
    if (!q) return [];
    const builtIn = getQuestionTestCases(q);
    const custom = customTestsMap[q.id] || [];
    return [...builtIn, ...custom];
  };

  const handleAddCustomTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuestion) return;
    const name = newTestName.trim();
    const assertion = newTestAssertion.trim();
    if (!name || !assertion) {
      showToast('⚠️ Please provide both a test name and assertion code.');
      return;
    }

    const newTest: MCTestCase = {
      id: `custom-${Date.now()}`,
      name,
      description: newTestDesc.trim() || 'Custom test assertion',
      assertion,
    };

    setCustomTestsMap(prev => {
      const current = prev[activeQuestion.id] || [];
      const updated = { ...prev, [activeQuestion.id]: [...current, newTest] };
      try {
        localStorage.setItem('mc_custom_tests_v1', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    setIsAddingCustomTest(false);
    setNewTestName('');
    setNewTestDesc('');
    setNewTestAssertion('');
    showToast(`✓ Custom test "${name}" added!`);
  };

  const handleDeleteCustomTest = (testId: string) => {
    if (!activeQuestion) return;
    setCustomTestsMap(prev => {
      const current = prev[activeQuestion.id] || [];
      const updated = {
        ...prev,
        [activeQuestion.id]: current.filter(t => t.id !== testId),
      };
      try {
        localStorage.setItem('mc_custom_tests_v1', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
    showToast('Custom test removed.');
  };

  const handleExportProject = () => {
    if (!activeQuestion) return;
    try {
      exportMachineCodingZip({
        questionId: activeQuestion.id,
        title: activeQuestion.title,
        description: activeQuestion.description,
        files,
      });
      showToast(`📦 Downloaded Vite + React project for ${activeQuestion.id}!`);
    } catch (err: any) {
      console.error(err);
      showToast('⚠️ Failed to package project ZIP export.');
    }
  };

  const handleRunTests = async () => {
    if (!activeQuestion) return;
    setIsRunningTests(true);
    setActiveTab('tests');
    const tests = getAllQuestionTests(activeQuestion);

    // Make sure latest multi-file code is compiled and mounted
    await executeCode(files);

    // Wait a brief tick for iframe DOM to mount, then trigger test execution
    setTimeout(() => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ t: 'run_tests', testCases: tests }, '*');
      }
    }, 250);
  };

  const runTestsAsync = async (filesToTest?: Record<string, string>): Promise<MCTestResult[]> => {
    if (!activeQuestion) return [];
    setIsRunningTests(true);
    setActiveTab('tests');

    await executeCode(filesToTest || files);

    return new Promise((resolve) => {
      testResultResolverRef.current = resolve;
      const tests = getAllQuestionTests(activeQuestion);

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

    const results = await runTestsAsync(files);
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
    const updatedFiles = { ...files, [activeFileName]: nextVal };
    setFiles(updatedFiles);

    if (activeQuestion) {
      setMultiFilesMap(prev => {
        const updated = { ...prev, [activeQuestion.id]: updatedFiles };
        try {
          localStorage.setItem('mc_multi_files_v2', JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });

      if (activeFileName === 'App.tsx') {
        setUserCodeMap(prev => {
          const updated = { ...prev, [activeQuestion.id]: nextVal };
          try {
            localStorage.setItem('mc_code_drafts_v1', JSON.stringify(updated));
          } catch (_) {}
          return updated;
        });
      }
    }
  };

  const handleLoadSolution = () => {
    if (!activeQuestion) return;
    if (isInterviewActive) {
      showToast('🔒 Solution is locked during an active interview round!');
      return;
    }
    const sol = activeQuestion.solutionCode;
    const updatedFiles = { ...files, 'App.tsx': sol };
    setFiles(updatedFiles);
    if (activeFileName === 'App.tsx') {
      setCurrentCode(sol);
      if (editorRef.current) {
        editorRef.current.setValue(sol);
      }
    }
    executeCode(updatedFiles);
    setMultiFilesMap(prev => {
      const updated = { ...prev, [activeQuestion.id]: updatedFiles };
      try {
        localStorage.setItem('mc_multi_files_v2', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
    setUserCodeMap(prev => {
      const updated = { ...prev, [activeQuestion.id]: sol };
      try {
        localStorage.setItem('mc_code_drafts_v1', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
    showToast('✓ Reference solution loaded into App.tsx & executed!');
  };

  const handleResetStarter = () => {
    if (!activeQuestion) return;
    const starter = activeQuestion.starterCode;
    const resetFiles: Record<string, string> = {
      'App.tsx': starter,
      'styles.css': DEFAULT_STARTER_CSS,
    };
    setFiles(resetFiles);
    setActiveFileName('App.tsx');
    setCurrentCode(starter);
    if (editorRef.current) {
      editorRef.current.setValue(starter);
    }
    executeCode(resetFiles);
    setMultiFilesMap(prev => {
      const updated = { ...prev, [activeQuestion.id]: resetFiles };
      try {
        localStorage.setItem('mc_multi_files_v2', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
    setUserCodeMap(prev => {
      const updated = { ...prev, [activeQuestion.id]: starter };
      try {
        localStorage.setItem('mc_code_drafts_v1', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
    showToast('↺ Project files reset to initial challenge template!');
  };

  // Format Code Helper
  const handleFormatCode = () => {
    if (editorRef.current) {
      const action = editorRef.current.getAction('editor.action.formatDocument');
      if (action) {
        action.run();
        showToast('🪄 Code formatted cleanly!');
        return;
      }
    }
    showToast('🪄 Format action triggered');
  };

  // Save Draft & Auto-Format Helper
  const handleSaveAndFormat = () => {
    handleFormatCode();
    if (activeQuestion) {
      setUserCodeMap(prev => {
        const updated = { ...prev, [activeQuestion.id]: currentCode };
        try {
          localStorage.setItem('mc_code_drafts_v1', JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });
      setMultiFilesMap(prev => {
        const updated = { ...prev, [activeQuestion.id]: files };
        try {
          localStorage.setItem('mc_multi_files_v2', JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });
    }
    executeCode(files);
    showToast('💾 Draft saved & compiled!');
  };

  // Snapshot Management Helpers
  const handleCreateSnapshot = (customLabel?: string) => {
    if (!activeQuestion) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newSnap: CodeSnapshot = {
      id: `snap_${Date.now()}`,
      timestamp: Date.now(),
      label: customLabel?.trim() || `Snapshot at ${timeStr}`,
      files: { ...files },
    };
    const updated = [newSnap, ...snapshots].slice(0, 10);
    setSnapshots(updated);
    try {
      localStorage.setItem(`mc_snapshots_${activeQuestion.id}`, JSON.stringify(updated));
    } catch (_) {}
    setNewSnapshotLabel('');
    showToast(`📸 Saved snapshot: "${newSnap.label}"`);
  };

  const handleRestoreSnapshot = (snap: CodeSnapshot) => {
    setFiles(snap.files);
    const curFile = snap.files[activeFileName] !== undefined ? activeFileName : 'App.tsx';
    setActiveFileName(curFile);
    const code = snap.files[curFile] || '';
    setCurrentCode(code);
    if (editorRef.current) {
      editorRef.current.setValue(code);
    }
    executeCode(snap.files);
    showToast(`↺ Restored snapshot: ${snap.label}`);
    setShowSnapshotMenu(false);
  };

  const handleDeleteSnapshot = (id: string) => {
    if (!activeQuestion) return;
    const updated = snapshots.filter(s => s.id !== id);
    setSnapshots(updated);
    try {
      localStorage.setItem(`mc_snapshots_${activeQuestion.id}`, JSON.stringify(updated));
    } catch (_) {}
    showToast('Snapshot removed.');
  };

  // Sync ref callbacks for Monaco editor commands
  executeCodeRef.current = () => executeCode(filesRef.current);
  handleRunTestsRef.current = handleRunTests;
  handleFormatCodeRef.current = handleFormatCode;
  handleSaveAndFormatRef.current = handleSaveAndFormat;

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape: exit any fullscreen panel or close modals
      if (e.key === 'Escape') {
        if (showShortcutsModal) {
          setShowShortcutsModal(false);
          return;
        }
        if (showSnapshotMenu) {
          setShowSnapshotMenu(false);
          return;
        }
        if (fullscreenPanel !== 'none') {
          setFullscreenPanel('none');
          return;
        }
      }

      // Question mark (?): open shortcuts modal if not typing in text fields
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName || '')) {
        e.preventDefault();
        setShowShortcutsModal(prev => !prev);
        return;
      }

      // Ctrl+Enter or Cmd+Enter: Run Live
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        executeCode(files);
        showToast('⚡ Executing sandbox (Ctrl+Enter)');
        return;
      }

      // Ctrl+Shift+T or Cmd+Shift+T: Run Test Suite
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'T' || e.key === 't')) {
        e.preventDefault();
        handleRunTests();
        return;
      }

      // Ctrl+S or Cmd+S: Save Draft & Format
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        handleSaveAndFormat();
        return;
      }

      // Ctrl+B or Cmd+B: Toggle AI Interviewer Drawer
      if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        setShowAIPrompter(prev => !prev);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [files, activeQuestion?.id, fullscreenPanel, showShortcutsModal, showSnapshotMenu, currentCode]);

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
              title="Run automated test suite (Ctrl+Shift+T)"
            >
              {isRunningTests ? '🧪 Running Tests...' : '🧪 Run Tests'}
            </button>

            <button
              type="button"
              className="mc-action-btn mc-btn-shortcuts"
              onClick={() => setShowShortcutsModal(true)}
              title="Keyboard shortcuts cheat sheet (?)"
            >
              ⌨️ Hotkeys
            </button>

            <button
              className="mc-action-btn mc-btn-export"
              onClick={handleExportProject}
              title="Download standalone Vite + React project (.zip) with all multi-file workspace code"
            >
              📦 Export Project
            </button>

            <button
              className="mc-action-btn mc-btn-run"
              onClick={() => executeCode(files)}
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
          <div
            className="mc-spec-panel"
            style={{
              width: fullscreenPanel === 'specs' ? '100%' : `${leftPanelWidth}px`,
              display: (fullscreenPanel === 'editor' || fullscreenPanel === 'preview') ? 'none' : 'flex',
              flex: fullscreenPanel === 'specs' ? 1 : undefined,
              borderRight: fullscreenPanel === 'specs' ? 'none' : undefined,
            }}
          >
            <div className="mc-spec-tabs">
              <div className="mc-spec-tabs-list">
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
              <button
                type="button"
                className={`mc-panel-tool-btn ${fullscreenPanel === 'specs' ? 'active' : ''}`}
                onClick={() => setFullscreenPanel(prev => prev === 'specs' ? 'none' : 'specs')}
                title={fullscreenPanel === 'specs' ? 'Restore panel size' : 'Expand Problem Specs to fullscreen'}
              >
                {fullscreenPanel === 'specs' ? '⤓ Restore' : '⛶ Fullscreen'}
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        className="mc-btn-add-test"
                        onClick={() => {
                          setIsAddingCustomTest(prev => !prev);
                          if (!newTestAssertion) {
                            setNewTestAssertion(`// Write assertion helpers: expect, root, getByText, getAll, fireClick, fireInput, wait\nexpect(root && root.children.length > 0, "Component mounted into root");\n`);
                          }
                        }}
                        title="Add custom assertion test case"
                      >
                        {isAddingCustomTest ? '✕ Cancel' : '+ Custom Test'}
                      </button>

                      <button
                        className="mc-action-btn mc-btn-tests"
                        onClick={handleRunTests}
                        disabled={isRunningTests || isCompiling}
                      >
                        {isRunningTests ? '🧪 Running...' : '▶ Run Suite'}
                      </button>
                    </div>
                  </div>

                  {/* Inline Custom Test Creator Form */}
                  {isAddingCustomTest && (
                    <form className="mc-custom-test-card-form" onSubmit={handleAddCustomTest}>
                      <div className="mc-test-form-row">
                        <label>Test Title</label>
                        <input
                          type="text"
                          className="mc-test-form-input"
                          placeholder="e.g. Reset button restores count to 0"
                          value={newTestName}
                          onChange={e => setNewTestName(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <div className="mc-test-form-row">
                        <label>Description</label>
                        <input
                          type="text"
                          className="mc-test-form-input"
                          placeholder="e.g. Verifies clicking the reset button resets display to 0"
                          value={newTestDesc}
                          onChange={e => setNewTestDesc(e.target.value)}
                        />
                      </div>
                      <div className="mc-test-form-row">
                        <label>DOM Assertion Script (helpers: expect, root, getByText, getAll, fireClick, fireInput, wait)</label>
                        <textarea
                          className="mc-test-form-textarea"
                          value={newTestAssertion}
                          onChange={e => setNewTestAssertion(e.target.value)}
                          placeholder="expect(root.innerText.includes('0'), 'Counter has 0');"
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setIsAddingCustomTest(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary btn-sm">
                          ✓ Save Custom Test
                        </button>
                      </div>
                    </form>
                  )}

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
                    {(testResults ? testResults : getAllQuestionTests(activeQuestion).map(tc => ({ ...tc, status: 'pending' as const, durationMs: 0 }))).map((tc, idx) => (
                      <div key={tc.id} className={`mc-test-card ${tc.status}`}>
                        <div className="mc-test-card-header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className={`mc-test-badge ${tc.status}`}>
                              {tc.status === 'passed' ? '✓ PASS' : tc.status === 'failed' ? '✕ FAIL' : '○ READY'}
                            </span>
                            {tc.id.startsWith('custom-') && (
                              <span className="mc-test-badge custom">CUSTOM</span>
                            )}
                            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                              #{idx + 1} {tc.name}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {tc.durationMs > 0 && (
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {tc.durationMs}ms
                              </span>
                            )}
                            {tc.id.startsWith('custom-') && (
                              <button
                                type="button"
                                className="mc-test-delete-btn"
                                onClick={() => handleDeleteCustomTest(tc.id)}
                                title="Delete this custom test"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
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

          {/* Draggable resizer divider between Specs and Right Panel */}
          {fullscreenPanel === 'none' && (
            <div
              className={`mc-resizer-col ${isDraggingLeft ? 'dragging' : ''}`}
              onMouseDown={(e) => {
                e.preventDefault();
                setIsDraggingLeft(true);
              }}
              title="Drag to resize Problem Specs"
            />
          )}

          {/* Right Area: Monaco Editor + Live Sandbox */}
          <div
            ref={rightPanelRef}
            className="mc-right-panel"
            style={{
              display: fullscreenPanel === 'specs' ? 'none' : 'flex',
              flex: 1,
            }}
          >
            <div className="mc-editor-preview-split">
              {/* Editor */}
              <div
                className="mc-editor-container"
                style={{
                  width: fullscreenPanel === 'editor' ? '100%' : `${editorWidthPct}%`,
                  display: fullscreenPanel === 'preview' ? 'none' : 'flex',
                  flex: fullscreenPanel === 'editor' ? 1 : undefined,
                  borderRight: fullscreenPanel === 'editor' ? 'none' : undefined,
                }}
              >
                <div className="mc-panel-header">
                  <div className="mc-file-tabs-bar">
                    {Object.keys(files).map(fileName => (
                      <div
                        key={fileName}
                        className={`mc-file-tab ${fileName === activeFileName ? 'active' : ''}`}
                        onClick={() => handleSelectFile(fileName)}
                        title={`Switch to ${fileName}`}
                      >
                        <span className="mc-file-icon">{getFileIcon(fileName)}</span>
                        <span className="mc-file-name">{fileName}</span>
                        {fileName !== 'App.tsx' && (
                          <button
                            type="button"
                            className="mc-file-close-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFile(fileName);
                            }}
                            title={`Delete ${fileName}`}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="mc-add-file-btn"
                      onClick={() => setShowAddFileModal(true)}
                      title="Add new file to workspace (styles.css, mockData.ts, types.ts)"
                    >
                      + New File
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

                    <button
                      type="button"
                      className="mc-panel-tool-btn"
                      onClick={handleFormatCode}
                      title="Format Code document cleanly (Alt+F or Ctrl+S)"
                    >
                      🪄 Format
                    </button>

                    <div className="mc-snapshot-menu-wrapper" ref={snapshotMenuRef}>
                      <button
                        type="button"
                        className={`mc-panel-tool-btn ${showSnapshotMenu ? 'active' : ''}`}
                        onClick={() => setShowSnapshotMenu(prev => !prev)}
                        title="Local snapshots & revision history"
                      >
                        📸 Snapshots {snapshots.length > 0 ? `(${snapshots.length})` : ''}
                      </button>

                      {showSnapshotMenu && (
                        <div className="mc-snapshot-dropdown">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#f1f5f9' }}>
                              Code Revision Snapshots
                            </span>
                            <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                              {snapshots.length}/10 saved
                            </span>
                          </div>

                          <div className="mc-snapshot-create-row">
                            <input
                              type="text"
                              className="mc-snapshot-input"
                              placeholder="Snapshot label (optional)..."
                              value={newSnapshotLabel}
                              onChange={(e) => setNewSnapshotLabel(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleCreateSnapshot(newSnapshotLabel);
                                }
                              }}
                            />
                            <button
                              type="button"
                              className="mc-snapshot-save-btn"
                              onClick={() => handleCreateSnapshot(newSnapshotLabel)}
                            >
                              + Save
                            </button>
                          </div>

                          <div className="mc-snapshot-list">
                            {snapshots.length === 0 ? (
                              <div style={{ padding: '16px', textAlign: 'center', color: '#64748b', fontSize: '11px' }}>
                                No snapshots saved yet. Click "+ Save" to take a point-in-time backup of your code!
                              </div>
                            ) : (
                              snapshots.map(snap => (
                                <div key={snap.id} className="mc-snapshot-item">
                                  <div className="mc-snapshot-meta">
                                    <span className="mc-snapshot-label" title={snap.label}>
                                      {snap.label}
                                    </span>
                                    <span className="mc-snapshot-time">
                                      {new Date(snap.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {Object.keys(snap.files).length} files
                                    </span>
                                  </div>
                                  <div className="mc-snapshot-actions">
                                    <button
                                      type="button"
                                      className="mc-snapshot-btn-restore"
                                      onClick={() => handleRestoreSnapshot(snap)}
                                      title="Restore this snapshot into workspace"
                                    >
                                      Restore
                                    </button>
                                    <button
                                      type="button"
                                      className="mc-snapshot-btn-del"
                                      onClick={() => handleDeleteSnapshot(snap.id)}
                                      title="Delete snapshot"
                                    >
                                      ×
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      className={`mc-panel-tool-btn ${fullscreenPanel === 'editor' ? 'active' : ''}`}
                      onClick={() => setFullscreenPanel(prev => prev === 'editor' ? 'none' : 'editor')}
                      title={fullscreenPanel === 'editor' ? 'Restore editor size' : 'Expand Code Editor to fullscreen'}
                    >
                      {fullscreenPanel === 'editor' ? '⤓ Restore' : '⛶ Fullscreen'}
                    </button>
                  </div>
                </div>

                {editorViewMode === 'diff' && (
                  <div className="mc-panel-header" style={{ borderTop: 'none', background: '#161b22', justifyContent: 'flex-end' }}>
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
                  </div>
                )}

                <div className="mc-monaco-wrapper">
                  {editorViewMode === 'diff' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                      <div className="mc-diff-legend-bar">
                        <div className="mc-diff-legend-col">
                          <span className="mc-diff-tag original">ORIGINAL</span>
                          <span style={{ fontWeight: '600', fontSize: '12px', color: 'var(--text-primary)' }}>
                            👤 Your Implementation ({activeFileName})
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
                          language={getEditorLanguage(activeFileName)}
                          theme={resolvedTheme === 'light' ? 'light' : 'vs-dark'}
                          original={currentCode}
                          modified={diffTarget === 'solution' ? (activeFileName === 'App.tsx' ? activeQuestion.solutionCode : '') : (activeFileName === 'App.tsx' ? activeQuestion.starterCode : '')}
                          options={{
                            readOnly: true,
                            renderSideBySide: diffSideBySide,
                            minimap: { enabled: false },
                            automaticLayout: true,
                            fontSize: 13,
                            scrollBeyondLastLine: false,
                            wordWrap: 'on',
                            renderValidationDecorations: 'off',
                            quickSuggestions: false,
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <Editor
                      height="100%"
                      language={getEditorLanguage(activeFileName)}
                      theme={resolvedTheme === 'light' ? 'light' : 'vs-dark'}
                      value={currentCode}
                      onChange={handleCodeChange}
                      onMount={(editor, monaco) => {
                        editorRef.current = editor;
                        if (monaco?.languages?.typescript) {
                          monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                            noSemanticValidation: true,
                            noSyntaxValidation: true,
                            noSuggestionDiagnostics: true,
                          });
                          monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                            noSemanticValidation: true,
                            noSyntaxValidation: true,
                            noSuggestionDiagnostics: true,
                          });
                        }

                        // Register Monaco-level key commands
                        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
                          executeCodeRef.current();
                        });
                        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyT, () => {
                          handleRunTestsRef.current();
                        });
                        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
                          handleSaveAndFormatRef.current();
                        });
                        editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyF, () => {
                          handleFormatCodeRef.current();
                        });
                        editor.addCommand(monaco.KeyCode.Escape, () => {
                          setFullscreenPanel('none');
                          setShowShortcutsModal(false);
                          setShowSnapshotMenu(false);
                        });
                      }}
                      options={{
                        fontSize: 13,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: 'on',
                        renderValidationDecorations: 'off',
                        quickSuggestions: false,
                        lightbulb: { enabled: false }
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Draggable resizer divider between Editor and Preview */}
              {fullscreenPanel === 'none' && (
                <div
                  className={`mc-resizer-col ${isDraggingEditor ? 'dragging' : ''}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setIsDraggingEditor(true);
                  }}
                  title="Drag to resize Editor vs Preview Sandbox"
                />
              )}

              {/* Live Preview */}
              <div
                className="mc-preview-container"
                style={{
                  width: fullscreenPanel === 'preview' ? '100%' : `${100 - editorWidthPct}%`,
                  display: fullscreenPanel === 'editor' ? 'none' : 'flex',
                  flex: fullscreenPanel === 'preview' ? 1 : undefined,
                }}
              >
                <div className="mc-panel-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>⚡ Interactive Execution Sandbox</span>
                    <button
                      onClick={() => executeCode(files)}
                      style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '11px' }}
                    >
                      ⟳ Refresh
                    </button>
                  </div>
                  <button
                    type="button"
                    className={`mc-panel-tool-btn ${fullscreenPanel === 'preview' ? 'active' : ''}`}
                    onClick={() => setFullscreenPanel(prev => prev === 'preview' ? 'none' : 'preview')}
                    title={fullscreenPanel === 'preview' ? 'Restore preview size' : 'Expand Sandbox to fullscreen'}
                  >
                    {fullscreenPanel === 'preview' ? '⤓ Restore' : '⛶ Fullscreen'}
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
            <div
              className="mc-console-drawer"
              style={{
                display: fullscreenPanel === 'editor' ? 'none' : 'flex',
              }}
            >
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

        {/* Add New File Modal */}
        {showAddFileModal && (
          <div className="mc-file-modal-overlay" onClick={() => setShowAddFileModal(false)}>
            <div className="mc-file-modal-card" onClick={e => e.stopPropagation()}>
              <div className="mc-file-modal-header">
                <h3>📂 Add File to Workspace</h3>
                <button
                  type="button"
                  className="mc-file-modal-close"
                  onClick={() => setShowAddFileModal(false)}
                >
                  ✕
                </button>
              </div>
              <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#94a3b8' }}>
                Choose a starter template or create a custom file for styles, mock data, or types.
              </p>

              <div className="mc-file-presets-grid">
                {FILE_PRESETS.map(preset => {
                  const alreadyExists = !!files[preset.name];
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      className="mc-file-preset-card"
                      style={{ opacity: alreadyExists ? 0.5 : 1, cursor: alreadyExists ? 'default' : 'pointer' }}
                      onClick={() => {
                        if (!alreadyExists) {
                          handleAddFile(preset.name, preset.template);
                        } else {
                          handleSelectFile(preset.name);
                          setShowAddFileModal(false);
                        }
                      }}
                    >
                      <span className="mc-preset-icon">{preset.icon}</span>
                      <div>
                        <div className="mc-preset-title">{preset.name} {alreadyExists ? '(Open)' : ''}</div>
                        <div className="mc-preset-desc">{preset.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <form
                className="mc-custom-file-form"
                onSubmit={e => {
                  e.preventDefault();
                  handleAddFile(newFileNameInput, '// Custom module\n');
                }}
              >
                <input
                  type="text"
                  className="mc-custom-file-input"
                  placeholder="Custom filename (e.g. helpers.ts, constants.ts)"
                  value={newFileNameInput}
                  onChange={e => setNewFileNameInput(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  className="mc-custom-file-btn"
                  disabled={!newFileNameInput.trim()}
                >
                  Create File
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Cheat Sheet Modal */}
        {showShortcutsModal && (
          <div className="mc-shortcuts-modal-overlay" onClick={() => setShowShortcutsModal(false)}>
            <div className="mc-shortcuts-modal" onClick={e => e.stopPropagation()}>
              <div className="mc-shortcuts-header">
                <h3 className="mc-shortcuts-title">
                  <span>⌨️</span> Developer Keyboard Shortcuts
                </h3>
                <button
                  type="button"
                  className="mc-shortcuts-close"
                  onClick={() => setShowShortcutsModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="mc-shortcuts-body">
                <div className="mc-shortcut-row">
                  <div className="mc-shortcut-info">
                    <span className="mc-shortcut-name">Run Live Sandbox</span>
                    <span className="mc-shortcut-desc">Compiles multi-file project and refreshes sandbox</span>
                  </div>
                  <div className="mc-shortcut-keys">
                    <kbd className="mc-kbd">Ctrl</kbd>
                    <span style={{ color: '#64748b' }}>+</span>
                    <kbd className="mc-kbd">Enter</kbd>
                  </div>
                </div>

                <div className="mc-shortcut-row">
                  <div className="mc-shortcut-info">
                    <span className="mc-shortcut-name">Run Automated Tests</span>
                    <span className="mc-shortcut-desc">Runs edge-case suite and calculates pass rate</span>
                  </div>
                  <div className="mc-shortcut-keys">
                    <kbd className="mc-kbd">Ctrl</kbd>
                    <span style={{ color: '#64748b' }}>+</span>
                    <kbd className="mc-kbd">Shift</kbd>
                    <span style={{ color: '#64748b' }}>+</span>
                    <kbd className="mc-kbd">T</kbd>
                  </div>
                </div>

                <div className="mc-shortcut-row">
                  <div className="mc-shortcut-info">
                    <span className="mc-shortcut-name">Save Draft & Auto-Format</span>
                    <span className="mc-shortcut-desc">Formats code, saves to browser storage, and compiles</span>
                  </div>
                  <div className="mc-shortcut-keys">
                    <kbd className="mc-kbd">Ctrl</kbd>
                    <span style={{ color: '#64748b' }}>+</span>
                    <kbd className="mc-kbd">S</kbd>
                  </div>
                </div>

                <div className="mc-shortcut-row">
                  <div className="mc-shortcut-info">
                    <span className="mc-shortcut-name">Format Code Document</span>
                    <span className="mc-shortcut-desc">Auto-indents and cleans active file</span>
                  </div>
                  <div className="mc-shortcut-keys">
                    <kbd className="mc-kbd">Alt</kbd>
                    <span style={{ color: '#64748b' }}>+</span>
                    <kbd className="mc-kbd">F</kbd>
                  </div>
                </div>

                <div className="mc-shortcut-row">
                  <div className="mc-shortcut-info">
                    <span className="mc-shortcut-name">Exit Fullscreen / Close Modal</span>
                    <span className="mc-shortcut-desc">Restores split layout or dismisses popups</span>
                  </div>
                  <div className="mc-shortcut-keys">
                    <kbd className="mc-kbd">Esc</kbd>
                  </div>
                </div>

                <div className="mc-shortcut-row">
                  <div className="mc-shortcut-info">
                    <span className="mc-shortcut-name">Toggle AI Staff Interviewer</span>
                    <span className="mc-shortcut-desc">Opens/collapses the AI voice prompter drawer</span>
                  </div>
                  <div className="mc-shortcut-keys">
                    <kbd className="mc-kbd">Ctrl</kbd>
                    <span style={{ color: '#64748b' }}>+</span>
                    <kbd className="mc-kbd">B</kbd>
                  </div>
                </div>

                <div className="mc-shortcut-row">
                  <div className="mc-shortcut-info">
                    <span className="mc-shortcut-name">Shortcuts Cheat Sheet</span>
                    <span className="mc-shortcut-desc">Opens this shortcuts reference dialog</span>
                  </div>
                  <div className="mc-shortcut-keys">
                    <kbd className="mc-kbd">?</kbd>
                  </div>
                </div>
              </div>

              <div className="mc-shortcuts-footer">
                <span>💡 Press <kbd className="mc-kbd">Esc</kbd> anytime to dismiss</span>
                <span>Works on Mac (use <kbd className="mc-kbd">⌘</kbd>) & Windows</span>
              </div>
            </div>
          </div>
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
