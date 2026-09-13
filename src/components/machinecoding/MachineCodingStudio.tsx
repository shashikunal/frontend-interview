import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import Editor, { DiffEditor } from '@monaco-editor/react';
import { useTheme } from '../../context/ThemeContext';
import { buildMachineCodingSrcDoc } from '../../lib/runner';
import { exportMachineCodingZip } from '../../lib/zipExport';
import { MACHINE_CODING_QUESTIONS, type MCQuestion } from './machineCodingQuestions';
import { getEnrichedQuestionSpec, type EnrichedMCQuestion } from './lib/mcQuestionSpecService';
import { MACHINE_CODING_CATALOG, getQuestionDetailById } from './lib/mcCatalogService';
import { getQuestionTestCases, type MCTestCase, type MCTestResult } from './data/machineCodingTests';
import {
  type MCLanguage,
  LANGUAGE_OPTIONS,
  buildStarterFilesForLanguage,
  getSolutionCodeForLanguage,
  getSolutionCodeForFile,
} from './lib/languageStarters';
import { isGenericBoilerplateStarter, generateDynamicCss, buildStarterMetadata, GENERATOR_VERSION, type StarterMetadata } from './lib/mcStarterGenerator';
import InterviewScorecardModal, { type ScorecardData } from './InterviewScorecardModal';
import AIInterviewPrompter from './AIInterviewPrompter';
import { useQuestions } from '../../data/useQuestions';
import { trackingService } from '../../lib/trackingService';
import { leaderboardService } from '../../lib/leaderboardService';
import * as Y from 'yjs';
import { useAuth } from '../../context/AuthContext';
import { SupabaseYjsProvider } from '../../lib/yjs/supabaseYjsProvider';
import { MonacoYjsBinding } from '../../lib/yjs/monacoYjsBinding';
import {
  interviewSessionService,
  type InterviewSession,
  type SessionParticipant,
  type SessionMessage,
  type SessionExecutionRecord,
} from '../../lib/interviewSessionService';
import LiveInterviewCollabDrawer from './LiveInterviewCollabDrawer';
import { renderFormattedMarkdown } from '../../lib/questionTemplate';
import { mcProgressService } from './lib/mcProgressService';
import { useInterviewSocket } from '../../hooks/useInterviewSocket';
import './MachineCodingStudio.css';

interface ConsoleLog {
  level: 'log' | 'info' | 'warn' | 'error';
  message: string;
}

function renderSpecDescription(desc: string) {
  if (!desc) return null;
  const lines = desc.split('\n');
  const blocks: React.ReactNode[] = [];
  let currentParagraphLines: string[] = [];

  const flushParagraph = (key: string | number) => {
    if (currentParagraphLines.length > 0) {
      blocks.push(
        <p key={key} className="mc-spec-text">
          {currentParagraphLines.map((line, lIdx) => (
            <span key={lIdx}>
              {renderFormattedMarkdown(line)}
              {lIdx < currentParagraphLines.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
      );
      currentParagraphLines = [];
    }
  };

  lines.forEach((rawLine, idx) => {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      flushParagraph(`p-${idx}`);
      return;
    }

    if (trimmed.startsWith('### ')) {
      flushParagraph(`p-before-h-${idx}`);
      const title = trimmed.replace(/^###\s+/, '');
      blocks.push(
        <h4 key={`h-${idx}`} className="mc-spec-heading">
          {title}
        </h4>
      );
      return;
    }

    if (/^\s*(\d+\.|\-|\*)\s+/.test(trimmed)) {
      flushParagraph(`p-before-li-${idx}`);
      const cleanText = trimmed.replace(/^\s*(\d+\.|\-|\*)\s+/, '');
      blocks.push(
        <div key={`li-${idx}`} className="mc-spec-list-item-single">
          <span className="mc-spec-bullet">•</span>
          <span className="mc-spec-list-text">{renderFormattedMarkdown(cleanText)}</span>
        </div>
      );
      return;
    }

    currentParagraphLines.push(trimmed);
  });

  flushParagraph('p-final');
  return <div className="mc-spec-description-rendered">{blocks}</div>;
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
    name: 'script.js',
    icon: '🟨',
    desc: 'Vanilla JavaScript entry script (DOM & logic)',
    template: `// Vanilla JavaScript implementation\nconsole.log('Script loaded');\n`,
  },
  {
    name: 'index.html',
    icon: '🌐',
    desc: 'HTML5 Semantic layout and markup skeleton',
    template: `<div class="card" id="app">\n  <h2>Component Title</h2>\n  <div id="display">Ready</div>\n</div>\n`,
  },
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
  if (fileName.endsWith('.ts')) return 'typescript';
  if (fileName.endsWith('.tsx')) return 'typescript';
  if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) return 'javascript';
  if (fileName.endsWith('.html')) return 'html';
  return 'javascript';
};

const getFileIcon = (fileName: string): string => {
  if (fileName.endsWith('.css')) return '🎨';
  if (fileName.endsWith('.json')) return '📊';
  if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) return '⚛️';
  if (fileName.endsWith('.ts')) return '🔷';
  if (fileName.endsWith('.html')) return '🌐';
  if (fileName.endsWith('.js')) return '🟨';
  return '📄';
};

export default function MachineCodingStudio() {
  const { id: routeId } = useParams<{ id?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeId = searchParams.get('id') || routeId;
  const { resolvedTheme } = useTheme();
  const { questions: allBankQuestions } = useQuestions();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Solved' | 'Unsolved' | 'Attempted' | 'Bookmarked'>('All');
  const [sortBy, setSortBy] = useState<'id-asc' | 'id-desc' | 'difficulty' | 'category' | 'recent-attempted' | 'recent-solved'>('id-asc');
  const [overviewViewMode, setOverviewViewMode] = useState<'grid' | 'list'>(() => {
    try {
      const saved = localStorage.getItem('mc_catalog_view_mode');
      return saved === 'list' ? 'list' : 'grid';
    } catch {
      return 'grid';
    }
  });
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

  // Active question resolution: supports MC Questions (Q001-Q500) and Bank Questions via O(1) fast Map lookup
  const activeQuestion = useMemo<EnrichedMCQuestion | null>(() => {
    if (!activeId) return null;
    const direct = getQuestionDetailById(activeId);
    if (direct) return direct;

    const rawNum = activeId.replace(/\D/g, '');
    const bankQ = allBankQuestions.find(q => String(q.id) === activeId || (rawNum && String(q.id) === rawNum));
    if (bankQ) {
      return getEnrichedQuestionSpec({
        id: String(bankQ.id),
        title: bankQ.question,
        category: (bankQ.category as any) || 'JavaScript',
        difficulty: (bankQ.difficulty as any) || 'Medium',
        timeEstimate: '25 mins',
        summary: bankQ.question,
        description: `### Problem Description\n${bankQ.question}\n\n### Explanation & Solution Approach\n${bankQ.answer || 'Build a production-grade component adhering to best practices, robust state modeling, and clean lifecycle management.'}`,
        requirements: [
          `Implement component and logic for: ${bankQ.question}`,
          'Handle boundary conditions, empty states, and invalid parameters.',
          'Provide clear state management and smooth reactive updates.',
          'Verify execution in the live sandbox preview and inspect console logs.'
        ],
        interviewTips: [
          'Communicate your architectural plan clearly before jumping into code.',
          'Prioritize clean separation of concerns between state and UI.',
          'Account for edge cases and optimal performance characteristics.'
        ],
        commonMistakes: [
          'Failing to handle empty or undefined input variables.',
          'Direct mutation of state structures instead of immutable patterns.',
          'Omitting accessible controls and semantic element structuring.'
        ],
        starterCode: bankQ.code
          ? `// Implement solution for: ${bankQ.question}\n\n${bankQ.code.includes('export default') || bankQ.code.includes('function App') ? bankQ.code : `import React, { useState } from 'react';\n\nexport default function App() {\n  return (\n    <div style={{ padding: '24px', fontFamily: 'system-ui' }}>\n      <h2>${bankQ.question}</h2>\n      <p>Write your solution here.</p>\n    </div>\n  );\n}\n`}`
          : `import React, { useState } from 'react';\n\nexport default function App() {\n  const [val, setVal] = useState('');\n  return (\n    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>\n      <h2 style={{ color: '#38bdf8' }}>${bankQ.question}</h2>\n      <p style={{ color: '#94a3b8' }}>Implement your component logic here.</p>\n    </div>\n  );\n}\n`,
        solutionCode: bankQ.code || bankQ.example || `// Reference Solution for: ${bankQ.question}\n\n${bankQ.answer}\n`,
      });
    }

    return null;
  }, [activeId, allBankQuestions]);

  // Code editor state
  const [currentCode, setCurrentCode] = useState('');
  const [, setUserCodeMap] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('mc_code_drafts_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Language Environment State
  const [selectedLanguage, setSelectedLanguage] = useState<MCLanguage>(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const urlLang = sp.get('lang') as MCLanguage | null;
      if (urlLang && LANGUAGE_OPTIONS.some(l => l.id === urlLang)) return urlLang;
      const saved = localStorage.getItem('mc_active_language') as MCLanguage | null;
      if (saved && LANGUAGE_OPTIONS.some(l => l.id === saved)) return saved;
    } catch (_) {}
    return 'react';
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

  // Starter-code metadata tracking: { [questionId]: { [language]: StarterMetadata } }
  const [starterMetaMap, setStarterMetaMap] = useState<Record<string, Record<string, StarterMetadata>>>(() => {
    try {
      const saved = localStorage.getItem('mc_starter_meta_v2');
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
  const [livePreviewError, setLivePreviewError] = useState<string | null>(null);
  const livePreviewDebounceTimerRef = useRef<any>(null);
  const previewExecutionCountRef = useRef(0);
  // Auto-refresh toggle — persisted in localStorage
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem('mc_auto_refresh') !== 'false'; } catch { return true; }
  });
  const [isPreviewRefreshing, setIsPreviewRefreshing] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  // Use a ref instead of state so executeCode always reads the latest ID without stale closures
  const runIdRef = useRef(1);
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
  const selectQuestionRef = useRef<(id: string) => void>(() => {});
  const showToastRef = useRef<(msg: string) => void>(() => {});
  const mcEditorDisposablesRef = useRef<Array<{ dispose: () => void }>>([]);
  useEffect(() => {
    return () => {
      for (const d of mcEditorDisposablesRef.current) {
        try {
          d.dispose();
        } catch (_) {}
      }
      mcEditorDisposablesRef.current = [];
    };
  }, []);
  // Mutable keyboard-shortcut inputs mirrored per render so the global
  // keydown listener registers once per question instead of per keystroke.
  const mcKeyStateRef = useRef({
    isCommandPaletteOpen: false,
    filteredPaletteQuestions: [] as Array<{ id: string }>,
    paletteSelectedIndex: 0,
    fullscreenPanel: 'none' as string,
    showShortcutsModal: false,
    showSnapshotMenu: false,
  });

  // Command Palette & Quick Switcher State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [paletteSearchQuery, setPaletteSearchQuery] = useState('');
  const [paletteCategoryFilter, setPaletteCategoryFilter] = useState('All');
  const [paletteDifficultyFilter, setPaletteDifficultyFilter] = useState('All');
  const [paletteSelectedIndex, setPaletteSelectedIndex] = useState(0);
  const paletteSearchInputRef = useRef<HTMLInputElement>(null);
  const paletteListRef = useRef<HTMLDivElement>(null);

  // Resizable Panels & Fullscreen Layout State
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mc_panel_left_w');
      if (saved) {
        const parsed = Number(saved);
        if (parsed >= 240 && parsed <= 500) return parsed;
      }
      return typeof window !== 'undefined' && window.innerWidth < 1440 ? 340 : 380;
    } catch {
      return 360;
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
        const minW = 260;
        const maxW = Math.min(500, Math.max(320, Math.floor(window.innerWidth * 0.38)));
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
  const [, setInterviewFinished] = useState(false);
  const [showScorecard, setShowScorecard] = useState(false);
  const [scorecardData, setScorecardData] = useState<ScorecardData | null>(null);

  // User & Live Collaborative Session State
  const { user, role, hasFeature, hasPermission } = useAuth();
  const lastSubmitTimeRef = useRef<number>(0);
  const submitInFlightRef = useRef<boolean>(false);
  const urlRole = searchParams.get('role');
  const userRole: 'candidate' | 'interviewer' | 'admin' | 'observer' = useMemo(() => {
    const effectiveRole = role || user?.role || 'candidate';
    if (urlRole === 'observer') {
      return 'observer';
    }
    // Defense-in-depth: Never trust client URL role override unless user has authoritative permissions
    if (urlRole === 'admin' && (hasPermission?.('admin') || effectiveRole === 'admin')) {
      return 'admin';
    }
    if (urlRole === 'interviewer' && (hasPermission?.('interviewer') || effectiveRole === 'admin' || effectiveRole === 'interviewer')) {
      return 'interviewer';
    }
    if (effectiveRole === 'admin') return 'admin';
    if (effectiveRole === 'interviewer') return 'interviewer';
    return 'candidate';
    // Scalar deps: whole-`user` identity changes per render and refires
    // every downstream effect that consumes userRole.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlRole, role, user?.id, user?.role, hasPermission]);

  const canViewSolution = useMemo(() => {
    return Boolean(hasFeature?.('questions_full') || userRole === 'admin' || role === 'admin' || user?.role === 'admin' || userRole === 'interviewer');
  }, [hasFeature, userRole, role, user?.role]);

  const currentUserId = useMemo(() => {
    if (user?.id) return user.id;
    const cached = localStorage.getItem('mc_collab_anon_id');
    if (cached) return cached;
    const generated = `usr_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('mc_collab_anon_id', generated);
    return generated;
  }, [user?.id]);

  const currentUserName = useMemo(() => {
    if (user?.name) return user.name;
    if ((user as any)?.user_metadata?.name) return (user as any).user_metadata.name;
    if (user?.email) return user.email.split('@')[0];
    if (userRole === 'admin') return 'Admin Interviewer';
    return 'Candidate';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.name, user?.email, userRole]);

  const [collabSession, setCollabSession] = useState<InterviewSession | null>(null);
  const [isCollabActive, setIsCollabActive] = useState<boolean>(false);
  const [isCollabDrawerOpen, setIsCollabDrawerOpen] = useState<boolean>(false);
  const [sessionParticipants, setSessionParticipants] = useState<SessionParticipant[]>([]);
  const [sessionMessages, setSessionMessages] = useState<SessionMessage[]>([]);
  const [unreadMessageCount, setUnreadMessageCount] = useState<number>(0);
  const [canAdminEdit, setCanAdminEdit] = useState<boolean>(false);
  const [lastExecutionEvent, setLastExecutionEvent] = useState<SessionExecutionRecord | null>(null);

  const yDocRef = useRef<Y.Doc>(new Y.Doc());
  // Per-mount Y.Doc must die with the mount, or every studio visit leaks a
  // live doc (provider/binding above are already cleaned; the doc was not).
  useEffect(() => {
    const doc = yDocRef.current;
    return () => {
      try {
        doc.destroy();
      } catch (_) {}
    };
  }, []);
  const yjsProviderRef = useRef<SupabaseYjsProvider | null>(null);
  const monacoBindingRef = useRef<MonacoYjsBinding | null>(null);
  const lastSnapshotRef = useRef<string>('');

  useEffect(() => {
    if (isCollabDrawerOpen) {
      setUnreadMessageCount(0);
    }
  }, [isCollabDrawerOpen]);

  const editorRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isSwitchingRef = useRef<boolean>(false);
  const activeFileNameRef = useRef<string>('App.tsx');
  const activeQuestionRef = useRef<MCQuestion | null>(null);

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

  // Solved, Attempted, Bookmarked & Notes state
  const [solvedMap, setSolvedMap] = useState<Record<string, boolean>>(() => {
    const ids = mcProgressService.getSolvedIds();
    const map: Record<string, boolean> = {};
    ids.forEach(id => { map[id] = true; });
    return map;
  });
  const [bookmarkedSet, setBookmarkedSet] = useState<Set<string>>(() => mcProgressService.getBookmarkedIds());
  const [attemptedSet, setAttemptedSet] = useState<Set<string>>(() => mcProgressService.getAttemptedIds());
  const [candidateNote, setCandidateNote] = useState<string>('');
  const [noteSavedAt, setNoteSavedAt] = useState<string | null>(null);

  // Synchronize progress and candidate isolation whenever user changes
  useEffect(() => {
    mcProgressService.setUserId(user?.id);
    const syncState = () => {
      const ids = mcProgressService.getSolvedIds();
      const map: Record<string, boolean> = {};
      ids.forEach(id => { map[id] = true; });
      setSolvedMap(map);
      setBookmarkedSet(mcProgressService.getBookmarkedIds());
      setAttemptedSet(mcProgressService.getAttemptedIds());
    };
    syncState();
    return mcProgressService.subscribe(syncState);
  }, [user?.id]);

  // Load candidate note when active question changes
  useEffect(() => {
    if (activeQuestion) {
      const existing = mcProgressService.getNote(activeQuestion.id);
      setCandidateNote(existing);
      setNoteSavedAt(existing ? 'Saved' : null);
    }
  }, [activeQuestion?.id]);

  const handleSaveNote = () => {
    if (!activeQuestion) return;
    mcProgressService.saveNote(activeQuestion.id, candidateNote);
    setNoteSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    showToast(`📝 Note saved for challenge ${activeQuestion.id}`);
  };

  const handleDeleteNote = () => {
    if (!activeQuestion) return;
    mcProgressService.deleteNote(activeQuestion.id);
    setCandidateNote('');
    setNoteSavedAt(null);
    showToast(`🗑️ Note removed for challenge ${activeQuestion.id}`);
  };

  const toggleBookmark = (id: string) => {
    const isNowBookmarked = mcProgressService.toggleBookmark(id);
    showToast(isNowBookmarked ? `★ Challenge ${id} bookmarked for revision` : `Challenge ${id} removed from bookmarks`);
  };

  const toggleSolved = (id: string) => {
    setSolvedMap(prev => {
      const isNowSolved = !prev[id];
      const next = { ...prev, [id]: isNowSolved };
      if (isNowSolved) {
        mcProgressService.markSolved(id);
        trackingService.completeQuestionAttempt(id, 100);
        showToast(`✓ Challenge ${id} marked as Solved`);
      } else {
        mcProgressService.unmarkSolved(id);
        showToast(`Challenge ${id} marked as Unsolved`);
      }
      return next;
    });
  };

  // Spec tab
  const [activeTab, setActiveTab] = useState<'specs' | 'solution' | 'tips' | 'tests' | 'notes'>('specs');

  // Checklists per question
  const [checkedItems, setCheckedItems] = useState<Record<string, Record<number, boolean>>>({});

  // Sync code when active question changes
  useEffect(() => {
    if (activeQuestion) {
      activeQuestionRef.current = activeQuestion;
      isSwitchingRef.current = true;
      setTestResults(null);
      setIsRunningTests(false);

      const urlLang = searchParams.get('lang') as MCLanguage | null;
      const globalLang = (localStorage.getItem('mc_active_language') as MCLanguage | null) || 'react';
      const targetLang: MCLanguage = (urlLang && LANGUAGE_OPTIONS.some(l => l.id === urlLang)) ? urlLang : globalLang;
      setSelectedLanguage(targetLang);

      let questionFiles = multiFilesMap[activeQuestion.id];

      // Check if files belong to another question (stale cache leak from previous navigation bug)
      const belongsToAnotherQuestion =
        questionFiles &&
        (
          (targetLang === 'react' && questionFiles['App.tsx'] && questionFiles['App.tsx'].includes('[Q') && !questionFiles['App.tsx'].includes(`[${activeQuestion.id}]`)) ||
          (targetLang === 'javascript' && questionFiles['script.js'] && questionFiles['script.js'].includes('[Q') && !questionFiles['script.js'].includes(`[${activeQuestion.id}]`)) ||
          (targetLang === 'dom' && questionFiles['index.html'] && !questionFiles['index.html'].includes(activeQuestion.title)) ||
          (targetLang === 'typescript' && questionFiles['script.ts'] && questionFiles['script.ts'].includes('[Q') && !questionFiles['script.ts'].includes(`[${activeQuestion.id}]`)) ||
          (targetLang === 'leetcode' && questionFiles['solution.js'] && questionFiles['solution.js'].includes('[Q') && !questionFiles['solution.js'].includes(`[${activeQuestion.id}]`))
        );

      // Check if current files match the target language
      const isWrongLanguageForWorkspace =
        questionFiles &&
        (
          (targetLang === 'react' && !questionFiles['App.tsx']) ||
          (targetLang === 'javascript' && (!questionFiles['script.js'] || !questionFiles['index.html'])) ||
          (targetLang === 'dom' && (!questionFiles['index.html'] || !questionFiles['script.js'])) ||
          (targetLang === 'typescript' && !questionFiles['script.ts']) ||
          (targetLang === 'leetcode' && !questionFiles['solution.js'])
        );

      // Detect if workspace has stale fallback or generic boilerplate
      const isCorrupted =
        questionFiles &&
        (
          (targetLang === 'react' && (
            questionFiles['index.html']?.includes('id="display-container"') ||
            questionFiles['index.html']?.includes('id="primary-action-btn"') ||
            questionFiles['App.tsx']?.includes("active ? 'Toggle Off' : 'Toggle On'") ||
            isGenericBoilerplateStarter(questionFiles['App.tsx'])
          )) ||
          (targetLang === 'typescript' && (
            questionFiles['script.ts']?.includes("interface State {\n  status: 'idle'") ||
            isGenericBoilerplateStarter(questionFiles['script.ts'])
          )) ||
          (targetLang === 'javascript' && (
            questionFiles['script.js']?.includes('const state = {\n  active: false,\n  counter: 0') ||
            isGenericBoilerplateStarter(questionFiles['script.js'])
          ))
        );

      const isCustomModified = starterMetaMap[activeQuestion.id]?.[targetLang]?.isCustomModified ?? false;

      if (!questionFiles || isWrongLanguageForWorkspace || belongsToAnotherQuestion || (isCorrupted && !isCustomModified)) {
        questionFiles = buildStarterFilesForLanguage(activeQuestion, targetLang);
      } else {
        if (targetLang === 'react' && (!questionFiles['App.tsx'] || !questionFiles['App.tsx'].trim() || (!isCustomModified && (isGenericBoilerplateStarter(questionFiles['App.tsx']) || questionFiles['App.tsx'].includes('#1e222d'))))) {
          questionFiles['App.tsx'] = buildStarterFilesForLanguage(activeQuestion, 'react')['App.tsx'];
        }
        questionFiles = { ...questionFiles };
      }

      // Dynamically upgrade old static CSS if candidate hasn't customized it
      if (questionFiles['styles.css'] && !isCustomModified) {
        const css = questionFiles['styles.css'];
        const isOutdatedCss =
          css.includes('/* Modern UI Stylesheet */') ||
          css.includes('--bg-surface: #1e222d') ||
          css.includes('#1e222d') ||
          !css.includes('--glow:') ||
          !css.includes(`[${activeQuestion.id}]`);
        if (isOutdatedCss) {
          questionFiles['styles.css'] = generateDynamicCss(activeQuestion);
        }
      }

      // If in JavaScript or DOM mode, strictly remove any React files (App.tsx, App.ts, App.jsx)
      if (targetLang === 'javascript' || targetLang === 'dom') {
        delete questionFiles['App.tsx'];
        delete questionFiles['App.ts'];
        delete questionFiles['App.jsx'];
      }
      // If in React mode, strictly remove any Vanilla JS files
      if (targetLang === 'react') {
        delete questionFiles['script.js'];
        delete questionFiles['index.html'];
      }

      setMultiFilesMap(prev => {
        const updated = { ...prev, [activeQuestion.id]: questionFiles };
        try {
          localStorage.setItem('mc_multi_files_v2', JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });

      // Clean up legacy keys
      try {
        localStorage.removeItem(`mc_lang_${activeQuestion.id}`);
      } catch (_) {}

      const langOpt = LANGUAGE_OPTIONS.find(l => l.id === targetLang) || LANGUAGE_OPTIONS[0];
      const primaryFile = questionFiles[langOpt.primaryFile] !== undefined ? langOpt.primaryFile : Object.keys(questionFiles)[0];

      filesRef.current = questionFiles;
      activeFileNameRef.current = primaryFile;

      setFiles(questionFiles);
      setActiveFileName(primaryFile);
      const initialCode = questionFiles[primaryFile] || '';
      setCurrentCode(initialCode);
      if (editorRef.current) {
        editorRef.current.setValue(initialCode);
      }
      if (livePreviewDebounceTimerRef.current) {
        clearTimeout(livePreviewDebounceTimerRef.current);
      }
      setLivePreviewError(null);

      // Track starter-code metadata and candidate edit status
      const currentMeta = buildStarterMetadata(activeQuestion, targetLang, initialCode, isCustomModified);
      setStarterMetaMap(prev => {
        const updated = {
          ...prev,
          [activeQuestion.id]: {
            ...(prev[activeQuestion.id] || {}),
            [targetLang]: currentMeta,
          }
        };
        try {
          localStorage.setItem('mc_starter_meta_v2', JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });

      // BUG 4 FIX: Use try/finally to guarantee isSwitchingRef is always unlocked
      // even if executeCode throws synchronously or the promise rejects.
      const switchTimer = setTimeout(() => {
        isSwitchingRef.current = false;
      }, 50);

      executeCode(questionFiles, targetLang).finally(() => {
        // Belt-and-suspenders: clear the lock even if executeCode rejects before timer fires
        clearTimeout(switchTimer);
        setTimeout(() => {
          isSwitchingRef.current = false;
        }, 0);
      });

      if (activeQuestion?.id) {
        trackingService.trackActivity('question_viewed', 'question', activeQuestion.id, {
          title: activeQuestion.title,
          category: activeQuestion.category,
        });
      }
    }
  }, [activeQuestion?.id]);

  // ── AUTO-SESSION REGISTRATION ─────────────────────────────────────────────
  // Silently register a session in Supabase as soon as a candidate opens a
  // question (no button click required). Admins can then see them in the
  // Live Sessions dashboard immediately.
  const autoSessionRef = useRef<string | null>(null);
  useEffect(() => {
    if (!activeQuestion) return;
    // Only auto-register for candidates; admins/observers don't need tracking
    if (userRole === 'admin' || userRole === 'observer' || userRole === 'interviewer') return;
    // If there's already an explicit collab session, skip (it's already registered)
    if (collabSession) return;
    // Avoid duplicate registration for the same question
    if (autoSessionRef.current === activeQuestion.id) return;
    autoSessionRef.current = activeQuestion.id;

    interviewSessionService.getOrCreateSession({
      candidateId: currentUserId,
      candidateName: currentUserName,
      candidateEmail: user?.email,
      questionId: activeQuestion.id,
      questionTitle: activeQuestion.title,
      language: selectedLanguage,
      initialFiles: files,
    }).then(session => {
      // Store it so the heartbeat can keep it alive, but don't activate collab UI
      setCollabSession(prev => prev ?? session);
    }).catch(err => {
      console.warn('[AutoSession] Could not register session:', err);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuestion?.id, userRole]);

  // ── REALTIME TWO-WAY SOCKET.IO (Telemetry for Admin Virtual Monitor) ──
  const {
    emitCodeChange,
    emitCursorMove,
    emitFocus,
    emitCodeRun,
    emitFileSwitch,
    bindMonacoEditor,
  } = useInterviewSocket({
    sessionId: collabSession?.id,
    questionId: activeQuestion?.id || 'Q001',
    questionTitle: activeQuestion?.title || 'Machine Coding',
    track: 'machine-coding',
    language: selectedLanguage,
    activeFile: activeFileName,
    code: currentCode,
    user,
  });

  // ── SESSION HEARTBEAT ────────────────────────────────────────────────────
  // Every 30 seconds, update last_activity_at + active_file on Supabase so
  // the admin dashboard shows accurate "last seen" times.
  useEffect(() => {
    if (!collabSession?.id) return;

    const heartbeat = setInterval(() => {
      interviewSessionService.updateSessionActivity(
        collabSession.id,
        activeFileNameRef.current
      );
    }, 30000);

    return () => clearInterval(heartbeat);
  }, [collabSession?.id]);

  // Re-bind Monaco editor model to corresponding file in Y.Doc on file switch
  useEffect(() => {
    if (editorRef.current && collabSession?.id) {
      bindMonacoEditor(editorRef.current, activeFileName);
    }
  }, [activeFileName, collabSession?.id, bindMonacoEditor]);

  // Handle iframe messages (console logs, runtime errors, and test results)
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      // Production Hardening: Verify event source is strictly the runner iframe
      if (iframeRef.current && e.source !== iframeRef.current.contentWindow) return;
      if (!e.data || typeof e.data !== 'object') return;
      const { t, level, parts, message, results } = e.data;

      if (t === 'log') {
        const text = parts ? parts.join(' ') : '';
        setConsoleLogs(prev => [...prev.slice(-249), { level: level || 'log', message: text }]);
      } else if (t === 'error') {
        setConsoleLogs(prev => [...prev.slice(-249), { level: 'error', message: message || 'Execution error' }]);
      } else if (t === 'test_results') {
        const res: MCTestResult[] = results || [];
        setTestResults(res);
        setIsRunningTests(false);
        if (testResultResolverRef.current) {
          testResultResolverRef.current(res);
          testResultResolverRef.current = null;
        }
        const passedCount = res.filter(r => r.status === 'passed').length;
        const isAllPassed = res.length > 0 && passedCount === res.length;

        emitCodeRun({
          status: isAllPassed ? 'success' : 'failed',
          passed: passedCount,
          total: res.length,
          runtimeMs: res.reduce((acc, r) => acc + (r.durationMs || 0), 0),
        });

        if (activeQuestion?.id) {
          // Log code execution event only (Run != Submit)
          trackingService.recordCodeExecution({
            questionId: activeQuestion.id,
            language: selectedLanguage,
            executionStatus: isAllPassed ? 'success' : 'runtime_error',
            executionTime: res.reduce((acc, r) => acc + (r.durationMs || 0), 0),
          }).catch(() => {});
        }

        if (collabSession && isCollabActive && activeQuestion) {
          const duration = res.reduce((acc, r) => acc + (r.durationMs || 0), 0);
          const execEvent: SessionExecutionRecord = {
            session_id: collabSession.id,
            candidate_id: collabSession.candidate_id,
            question_id: activeQuestion.id,
            language: selectedLanguage,
            status: isAllPassed ? 'success' : 'failed',
            stdout: `Test Suite: ${passedCount}/${res.length} assertions passed`,
            stderr: isAllPassed ? '' : `${res.length - passedCount} assertion(s) failed`,
            exit_code: isAllPassed ? 0 : 1,
            execution_time: duration,
            tests_passed: passedCount,
            tests_total: res.length,
          };
          setLastExecutionEvent(execEvent);
          interviewSessionService.recordExecution(execEvent);
          yjsProviderRef.current?.broadcastExecution({
            status: isAllPassed ? 'success' : 'failed',
            testsPassed: passedCount,
            testsTotal: res.length,
            stdout: `Test Suite: ${passedCount}/${res.length} assertions passed`,
            executionTime: duration,
          });
        }

        if (isAllPassed) {
          showToast(`🎉 All ${res.length} test assertions passed! Click "🏁 Submit" to record your accepted solution.`);
        } else {
          showToast(`🧪 Test run complete: ${passedCount}/${res.length} passed.`);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activeQuestion, solvedMap]);

  // Cleanup timers on component unmount
  useEffect(() => {
    return () => {
      if (livePreviewDebounceTimerRef.current) {
        clearTimeout(livePreviewDebounceTimerRef.current);
      }
    };
  }, []);

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

  // -------------------------------------------------------------
  // REAL-TIME COLLABORATION & INTERVIEW SESSION EFFECTS (Yjs + Supabase)
  // -------------------------------------------------------------

  // 1. Auto-connect or load session if ?session=... is in URL
  useEffect(() => {
    const sessionId = searchParams.get('session');
    if (!sessionId || !activeQuestion) return;

    let isMounted = true;
    (async () => {
      try {
        const session = await interviewSessionService.getSessionById(sessionId);
        if (!isMounted) return;
        if (session) {
          setCollabSession(session);
          setIsCollabActive(true);

          // If joining as admin or observer and session has files, sync into workspace
          if (userRole === 'admin' || userRole === 'observer' || userRole === 'interviewer') {
            if (session.files_snapshot && Object.keys(session.files_snapshot).length > 0) {
              setFiles(session.files_snapshot);
              filesRef.current = session.files_snapshot;
              const primaryFile = Object.keys(session.files_snapshot)[0];
              setActiveFileName(primaryFile);
              activeFileNameRef.current = primaryFile;
              setCurrentCode(session.files_snapshot[primaryFile] || '');
              if (editorRef.current) {
                editorRef.current.setValue(session.files_snapshot[primaryFile] || '');
              }
              executeCode(session.files_snapshot);
            }
          }

          // Register participant in Supabase
          await interviewSessionService.joinParticipant({
            sessionId: session.id,
            userId: currentUserId,
            name: currentUserName,
            role: userRole,
            canEdit: userRole === 'candidate' || (userRole === 'admin' && canAdminEdit),
          });

          // Fetch initial chat messages
          const msgs = await interviewSessionService.getMessages(session.id);
          if (isMounted) setSessionMessages(msgs);

          showToast(`🔴 Connected to Live Interview Room (${session.id.substring(0, 8)}...)`);
        }
      } catch (err) {
        console.error('Failed to load session:', err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [searchParams.get('session'), activeQuestion?.id]);

  // 2. Set up Yjs Realtime Provider when collab session is active
  useEffect(() => {
    if (!collabSession?.id || !isCollabActive) {
      if (yjsProviderRef.current) {
        yjsProviderRef.current.destroy();
        yjsProviderRef.current = null;
      }
      return;
    }

    const provider = new SupabaseYjsProvider(
      collabSession.id,
      yDocRef.current,
      {
        id: currentUserId,
        name: currentUserName,
        role: userRole,
        color: userRole === 'admin' ? '#a855f7' : '#38bdf8',
      },
      {
        onCursorsChanged: (cursors) => {
          monacoBindingRef.current?.updateRemoteCursors(cursors, activeFileNameRef.current);
        },
      }
    );

    const unsubscribe = provider.subscribe((event) => {
      if (event.type === 'execution_started' || event.type === 'execution_completed') {
        setLastExecutionEvent(event.payload);
      } else if (event.type === 'peers_changed') {
        interviewSessionService.getParticipants(collabSession.id).then((parts) => {
          setSessionParticipants(parts);
        });
      }
    });

    yjsProviderRef.current = provider;

    return () => {
      unsubscribe();
      provider.destroy();
      if (yjsProviderRef.current === provider) {
        yjsProviderRef.current = null;
      }
    };
  }, [collabSession?.id, isCollabActive, currentUserId, currentUserName, userRole]);

  // 3. Bind Monaco Editor with Yjs Text document for live real-time editing & cursor sync
  useEffect(() => {
    if (!editorRef.current || !yjsProviderRef.current || !isCollabActive) {
      if (monacoBindingRef.current) {
        monacoBindingRef.current.destroy();
        monacoBindingRef.current = null;
      }
      return;
    }

    if (monacoBindingRef.current) {
      monacoBindingRef.current.destroy();
      monacoBindingRef.current = null;
    }

    const model = editorRef.current.getModel();
    if (!model) return;

    const yText = yDocRef.current.getText(activeFileName);

    // If yText is currently empty, seed it with current file content
    if (yText.length === 0 && files[activeFileName]) {
      yText.insert(0, files[activeFileName]);
    }

    const binding = new MonacoYjsBinding(yText, model, editorRef.current);
    monacoBindingRef.current = binding;

    const isReadOnly = userRole === 'observer' || (userRole === 'admin' && !canAdminEdit);
    editorRef.current.updateOptions({ readOnly: isReadOnly });

    // Track cursor movement and broadcast to participants
    const cursorDisp = editorRef.current.onDidChangeCursorPosition((e: any) => {
      yjsProviderRef.current?.sendCursorPosition(
        {
          startLineNumber: e.position.lineNumber,
          startColumn: e.position.column,
          endLineNumber: e.position.lineNumber,
          endColumn: e.position.column,
        },
        activeFileName
      );
    });

    // Update local state when yText changes remotely
    const observer = () => {
      const updatedCode = yText.toString();
      setCurrentCode(updatedCode);
      setFiles((prev) => ({ ...prev, [activeFileName]: updatedCode }));
      filesRef.current = { ...filesRef.current, [activeFileName]: updatedCode };
    };
    yText.observe(observer);

    return () => {
      cursorDisp.dispose();
      yText.unobserve(observer);
      binding.destroy();
      if (monacoBindingRef.current === binding) {
        monacoBindingRef.current = null;
      }
    };
  }, [activeFileName, isCollabActive, canAdminEdit, userRole, !!editorRef.current, !!yjsProviderRef.current]);

  // 4. Debounced snapshot persistence to Supabase (Every 20s if modified, never every keystroke)
  useEffect(() => {
    if (!collabSession?.id || !isCollabActive || !activeQuestion) return;

    const timer = setTimeout(() => {
      const filesJson = JSON.stringify(files);
      if (filesJson !== lastSnapshotRef.current) {
        lastSnapshotRef.current = filesJson;
        interviewSessionService.saveSnapshot(
          collabSession.id,
          files,
          'Periodic collaborative checkpoint'
        );
      }
    }, 20000);

    return () => clearTimeout(timer);
  }, [files, collabSession?.id, isCollabActive, activeQuestion?.id]);

  // 5. Broadcast active file switch to admin monitor whenever candidate switches files
  useEffect(() => {
    if (!collabSession?.id || !yjsProviderRef.current) return;
    yjsProviderRef.current.broadcastFileSwitch(activeFileName);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFileName, collabSession?.id]);

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

  // Code Execution via buildMachineCodingSrcDoc with multi-file support
  const executeCode = async (filesToRun?: Record<string, string>, langToRun?: MCLanguage) => {
    const targetFiles = filesToRun || filesRef.current;
    const activeLang = langToRun || selectedLanguage;
    setIsCompiling(true);
    setConsoleLogs([]);
    // Increment via ref — always synchronous and never stale (fixes BUG 1 race condition)
    const nextRunId = ++runIdRef.current;

    if (activeQuestion?.id) {
      trackingService.startQuestionAttempt(activeQuestion.id);
      trackingService.trackActivity('code_run', 'question', activeQuestion.id, {
        language: activeLang,
      });
    }

    if (collabSession && isCollabActive) {
      yjsProviderRef.current?.broadcastExecution({
        status: 'running',
      });
    }

    let compileErr: any = null;
    try {
      const srcDoc = await buildMachineCodingSrcDoc(targetFiles, activeLang, nextRunId);
      if (nextRunId === runIdRef.current) {
        setPreviewSrcDoc(srcDoc);
        setLivePreviewError(null);
      }
    } catch (err: any) {
      compileErr = err;
      console.error(err);
      if (nextRunId === runIdRef.current) {
        setConsoleLogs(prev => [...prev.slice(-249), { level: 'error', message: err?.message || 'Babel compilation error' }]);
      }
    } finally {
      if (nextRunId === runIdRef.current) {
        setIsCompiling(false);
      }
      if (collabSession && isCollabActive && activeQuestion) {
        const execEvent: SessionExecutionRecord = {
          session_id: collabSession.id,
          candidate_id: collabSession.candidate_id,
          question_id: activeQuestion.id,
          language: activeLang,
          status: compileErr ? 'compile_error' : 'success',
          stdout: 'Compiled & updated live sandbox preview',
          stderr: compileErr?.message || '',
          exit_code: compileErr ? 1 : 0,
          execution_time: 95,
        };
        setLastExecutionEvent(execEvent);
        interviewSessionService.recordExecution(execEvent);
        yjsProviderRef.current?.broadcastExecution({
          status: compileErr ? 'compile_error' : 'success',
          stdout: 'Compiled & updated live sandbox preview',
          stderr: compileErr?.message || '',
          executionTime: 95,
        });
      }
    }
  };

  const handleSwitchLanguage = (newLang: MCLanguage) => {
    if (!activeQuestion || newLang === selectedLanguage) return;
    isSwitchingRef.current = true;
    setSelectedLanguage(newLang);
    try {
      localStorage.setItem('mc_active_language', newLang);
      localStorage.removeItem(`mc_lang_${activeQuestion.id}`);
    } catch (_) {}
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (newLang === 'react') {
        next.delete('lang');
      } else {
        next.set('lang', newLang);
      }
      return next;
    }, { replace: true });

    const newFiles = buildStarterFilesForLanguage(activeQuestion, newLang);
    if (newLang === 'javascript' || newLang === 'dom') {
      delete newFiles['App.tsx'];
      delete newFiles['App.ts'];
      delete newFiles['App.jsx'];
    }
    const langOpt = LANGUAGE_OPTIONS.find(l => l.id === newLang) || LANGUAGE_OPTIONS[0];
    const primaryFile = newFiles[langOpt.primaryFile] !== undefined ? langOpt.primaryFile : Object.keys(newFiles)[0];

    filesRef.current = newFiles;
    activeFileNameRef.current = primaryFile;

    setFiles(newFiles);
    setActiveFileName(primaryFile);
    const content = newFiles[primaryFile] || '';
    setCurrentCode(content);
    if (editorRef.current) {
      editorRef.current.setValue(content);
    }
    setMultiFilesMap(prev => {
      const updated = { ...prev, [activeQuestion.id]: newFiles };
      try {
        localStorage.setItem('mc_multi_files_v2', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    // Track metadata for the new language environment
    const langMeta = buildStarterMetadata(activeQuestion, newLang, content, false);
    setStarterMetaMap(prev => {
      const updated = {
        ...prev,
        [activeQuestion.id]: {
          ...(prev[activeQuestion.id] || {}),
          [newLang]: langMeta,
        }
      };
      try {
        localStorage.setItem('mc_starter_meta_v2', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    showToast(`✓ Switched workspace environment to ${langOpt.label} (${langOpt.badge})`);
    executeCode(newFiles, newLang);

    setTimeout(() => {
      isSwitchingRef.current = false;
    }, 50);
  };

  const handleSelectFile = (fileName: string) => {
    if (fileName === activeFileName) return;
    activeFileNameRef.current = fileName;
    setActiveFileName(fileName);
    emitFileSwitch(fileName);
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
    executeCode(updatedFiles, selectedLanguage);
  };

  const handleDeleteFile = (name: string) => {
    const langOpt = LANGUAGE_OPTIONS.find(l => l.id === selectedLanguage) || LANGUAGE_OPTIONS[0];
    if (name === langOpt.primaryFile || Object.keys(files).length <= 1) {
      showToast(`⚠️ ${name} is the primary file and cannot be deleted.`);
      return;
    }
    const { [name]: _, ...rest } = files;
    setFiles(rest);
    if (activeFileName === name) {
      const fallbackName = Object.keys(rest)[0] || langOpt.primaryFile;
      setActiveFileName(fallbackName);
      const fallbackCode = rest[fallbackName] || '';
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
    executeCode(rest, selectedLanguage);
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
    if (name.length > 80) {
      showToast('⚠️ Test name exceeds 80 characters limit.');
      return;
    }
    if (assertion.length > 2000) {
      showToast('⚠️ Test assertion exceeds 2,000 characters limit.');
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
    if (!activeQuestion || isRunningTests) return;
    mcProgressService.markAttempted(activeQuestion.id);
    setIsRunningTests(true);
    emitCodeRun({ status: 'running' });
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

  const handleSubmitSolution = async () => {
    if (!activeQuestion || !/^Q\d{3}$/i.test(activeQuestion.id)) {
      showToast('⚠️ Question identity validation failed.');
      return;
    }

    const now = Date.now();
    if (now - lastSubmitTimeRef.current < 1500) {
      showToast('⏳ Submission rate limit: please wait 1.5s between evaluations.');
      return;
    }
    // Synchronous in-flight lock: double-clicks before React re-renders must
    // not start a second full evaluation (duplicate submissions/scores).
    if (submitInFlightRef.current || isRunningTests) return;
    submitInFlightRef.current = true;
    lastSubmitTimeRef.current = now;
    // One idempotency id for this submit: shared by tracking + leaderboard so
    // a retry/double-click converges instead of duplicating rows.
    const submitId = `mc_sub_${activeQuestion.id}_${now}_${Math.random().toString(36).slice(2, 8)}`;

    try {
    setIsRunningTests(true);
    setActiveTab('tests');
    showToast('🏁 Evaluating solution across full test suite...');

    const curFiles = filesRef.current || files;
    const results = await runTestsAsync(curFiles);
    const passed = results.filter(r => r.status === 'passed').length;
    const total = results.length;
    const score = total > 0 ? Math.round((passed / total) * 100) : 0;
    const isAccepted = total > 0 && passed === total;
    const qId = activeQuestion.id;

    if (isAccepted) {
      mcProgressService.markSolved(qId);
      setSolvedMap(prev => ({ ...prev, [qId]: true }));
      trackingService.completeQuestionAttempt(qId, 100);
      showToast(`🎉 Accepted! All ${total} assertions passed. Solved!`);
    } else {
      mcProgressService.markAttempted(qId);
      trackingService.completeQuestionAttempt(qId, score);
      showToast(`❌ Wrong Answer: ${passed}/${total} test cases passed. Status: Attempted.`);
    }

    // Persist official submission to Supabase & tracking ledger
    const submittedCode = curFiles[activeFileNameRef.current] || Object.values(curFiles)[0] || '';
    const executionDuration = isInterviewActive ? Math.max(1, interviewDuration - Math.max(0, interviewTimeLeft)) : 180;
    trackingService.recordSubmission({
      id: submitId,
      questionId: qId,
      category: 'MACHINE_CODING',
      userId: user?.id,
      code: submittedCode,
      language: selectedLanguage,
      status: isAccepted ? 'accepted' : 'wrong_answer',
      score,
      passedTests: passed,
      totalTests: total,
      executionTime: executionDuration,
      idempotencyKey: submitId,
    }).catch(err => console.debug('MC tracking submission notice:', err));

    leaderboardService.saveMachineCodingSubmission({
      candidateId: user?.id || 'anon',
      candidateName: user?.name || 'Candidate',
      candidateEmail: user?.email || '',
      questionId: qId,
      score,
      testsPassed: passed,
      testsTotal: total,
      code: submittedCode,
      language: selectedLanguage,
      timeSpentSeconds: executionDuration,
      idempotencyKey: submitId,
    }).catch(err => console.debug('MC leaderboard submission notice:', err));

    setScorecardData({
      question: activeQuestion,
      timeSpentSeconds: isInterviewActive ? Math.max(1, interviewDuration - Math.max(0, interviewTimeLeft)) : 1800,
      totalDurationSeconds: isInterviewActive ? interviewDuration : 1800,
      testResults: results,
      passedTests: passed,
      totalTests: total,
      files: { ...curFiles }
    });
    setShowScorecard(true);
    } finally {
      submitInFlightRef.current = false;
    }
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

  const handleStartLiveSession = async () => {
    if (!activeQuestion) return;
    try {
      showToast('Creating Live Interview Room...');
      const session = await interviewSessionService.getOrCreateSession({
        candidateId: currentUserId,
        candidateName: currentUserName,
        candidateEmail: user?.email,
        questionId: activeQuestion.id,
        questionTitle: activeQuestion.title,
        language: selectedLanguage,
        initialFiles: files,
      });

      setCollabSession(session);
      setIsCollabActive(true);
      setIsCollabDrawerOpen(true);

      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.set('session', session.id);
        return next;
      }, { replace: true });

      showToast(`🔴 Live Interview Room Online! ID: ${session.id.substring(0, 8)}...`);
    } catch (err: any) {
      console.error(err);
      showToast('⚠️ Failed to initiate live session room.');
    }
  };

  const handleSendCollabMessage = async (msg: string) => {
    if (!collabSession) return;
    try {
      const sent = await interviewSessionService.sendMessage({
        sessionId: collabSession.id,
        senderId: currentUserId,
        senderName: currentUserName,
        senderRole: userRole,
        message: msg,
      });
      setSessionMessages(prev => [...prev, sent]);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
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

    // If not already in a live session, auto-connect to session for monitoring
    if (!collabSession) {
      handleStartLiveSession();
    }
  };

  const handleExitInterview = () => {
    if (!activeQuestion) return;

    // Auto-save candidate work
    const qId = activeQuestion.id;
    const curFiles = filesRef.current || files;
    setMultiFilesMap(mapPrev => {
      const updatedMap = { ...mapPrev, [qId]: curFiles };
      try {
        localStorage.setItem('mc_multi_files_v2', JSON.stringify(updatedMap));
      } catch (_) {}
      return updatedMap;
    });

    const mainCode = curFiles['App.tsx'] || Object.values(curFiles)[0] || '';
    setUserCodeMap(uPrev => {
      const updatedUserMap = { ...uPrev, [qId]: mainCode };
      try {
        localStorage.setItem('mc_code_drafts_v1', JSON.stringify(updatedUserMap));
      } catch (_) {}
      return updatedUserMap;
    });

    setIsInterviewActive(false);
    showToast('🚪 Exited interview round. Candidate work has been auto-saved.');
  };

  const handleFinishInterview = async () => {
    if (!activeQuestion) return;
    setIsInterviewActive(false);
    setInterviewFinished(true);
    showToast('🏁 Submitting candidate work and evaluating test cases...');

    // Auto-save candidate work
    const qId = activeQuestion.id;
    const curFiles = filesRef.current || files;
    setMultiFilesMap(mapPrev => {
      const updatedMap = { ...mapPrev, [qId]: curFiles };
      try {
        localStorage.setItem('mc_multi_files_v2', JSON.stringify(updatedMap));
      } catch (_) {}
      return updatedMap;
    });

    const mainCode = curFiles['App.tsx'] || Object.values(curFiles)[0] || '';
    setUserCodeMap(uPrev => {
      const updatedUserMap = { ...uPrev, [qId]: mainCode };
      try {
        localStorage.setItem('mc_code_drafts_v1', JSON.stringify(updatedUserMap));
      } catch (_) {}
      return updatedUserMap;
    });

    const results = await runTestsAsync(curFiles);
    const passed = results.filter(r => r.status === 'passed').length;
    const total = results.length;
    const timeSpent = Math.max(1, interviewDuration - Math.max(0, interviewTimeLeft));
    const score = total > 0 ? Math.round((passed / total) * 100) : 0;

    setScorecardData({
      question: activeQuestion,
      timeSpentSeconds: timeSpent,
      totalDurationSeconds: interviewDuration,
      testResults: results,
      passedTests: passed,
      totalTests: total,
      files: { ...curFiles }
    });
    setShowScorecard(true);

    if (activeQuestion?.id) {
      trackingService.completeQuestionAttempt(activeQuestion.id, score, timeSpent);
      if (total > 0 && passed === total) {
        mcProgressService.markSolved(activeQuestion.id);
        setSolvedMap(prev => ({ ...prev, [activeQuestion.id]: true }));
        showToast(`🎉 Accepted! All ${total} tests passed. Challenge solved!`);
      } else {
        mcProgressService.markAttempted(activeQuestion.id);
        showToast(`✓ Candidate work submitted! Passed ${passed}/${total} tests. Status: Attempted.`);
      }
    }
  };

  // Automatic debounced live preview updater
  const triggerLivePreview = (updatedFiles: Record<string, string>, targetLang?: MCLanguage, instant = false) => {
    if (isSwitchingRef.current) return;
    if (livePreviewDebounceTimerRef.current) {
      clearTimeout(livePreviewDebounceTimerRef.current);
    }

    const delay = instant ? 0 : 350;
    livePreviewDebounceTimerRef.current = setTimeout(async () => {
      const execId = ++previewExecutionCountRef.current;
      const currentFiles = updatedFiles || filesRef.current;
      const lang = targetLang || selectedLanguage;

      setIsPreviewRefreshing(true);
      try {
        const srcDoc = await buildMachineCodingSrcDoc(currentFiles, lang, execId);
        // Ensure stale executions cannot overwrite newer preview results
        if (execId === previewExecutionCountRef.current) {
          setPreviewSrcDoc(srcDoc);
          setLivePreviewError(null);
        }
      } catch (err: any) {
        if (execId === previewExecutionCountRef.current) {
          const errMsg = err?.message || String(err) || 'Compilation syntax error';
          setLivePreviewError(errMsg);
        }
      } finally {
        if (execId === previewExecutionCountRef.current) {
          setTimeout(() => setIsPreviewRefreshing(false), 400);
        }
      }
    }, delay);
  };

  // Manual refresh — always fires regardless of auto-refresh toggle
  const handleManualRefresh = () => {
    triggerLivePreview(filesRef.current, selectedLanguage, true);
  };

  // Toggle auto-refresh and persist preference
  const handleToggleAutoRefresh = () => {
    setAutoRefreshEnabled(prev => {
      const next = !prev;
      try { localStorage.setItem('mc_auto_refresh', String(next)); } catch (_) {}
      return next;
    });
  };

  const handleCodeChange = (val?: string) => {
    if (isSwitchingRef.current) return;
    const nextVal = val ?? '';
    setCurrentCode(nextVal);
    const currentFile = activeFileNameRef.current;
    emitCodeChange(nextVal, currentFile);
    const q = activeQuestionRef.current;

    const updatedFiles = { ...filesRef.current, [currentFile]: nextVal };
    filesRef.current = updatedFiles;
    setFiles(updatedFiles);

    if (q) {
      setMultiFilesMap(mapPrev => {
        const updatedMap = { ...mapPrev, [q.id]: updatedFiles };
        try {
          localStorage.setItem('mc_multi_files_v2', JSON.stringify(updatedMap));
        } catch (_) {}
        return updatedMap;
      });

      if (currentFile === 'App.tsx') {
        setUserCodeMap(uPrev => {
          const updatedUserMap = { ...uPrev, [q.id]: nextVal };
          try {
            localStorage.setItem('mc_code_drafts_v1', JSON.stringify(updatedUserMap));
          } catch (_) {}
          return updatedUserMap;
        });
      }

      // Mark candidate edit in starterMetaMap
      setStarterMetaMap(prev => {
        const qMeta = prev[q.id] || {};
        const currentLangMeta = qMeta[selectedLanguage];
        if (!currentLangMeta || !currentLangMeta.isCustomModified) {
          const updated: Record<string, Record<string, StarterMetadata>> = {
            ...prev,
            [q.id]: {
              ...qMeta,
              [selectedLanguage]: {
                questionId: q.id,
                language: selectedLanguage,
                generatorVersion: GENERATOR_VERSION,
                generatedAt: currentLangMeta?.generatedAt || Date.now(),
                starterHash: currentLangMeta?.starterHash || '',
                domainType: currentLangMeta?.domainType || 'widget',
                difficulty: q.difficulty || 'Medium',
                isCustomModified: true,
              }
            }
          };
          try {
            localStorage.setItem('mc_starter_meta_v2', JSON.stringify(updated));
          } catch (_) {}
          return updated;
        }
        return prev;
      });
    }

    // BUG 5 FIX: Pass selectedLanguage explicitly so triggerLivePreview never falls back
    // to a stale closure value if language changed in the same render cycle.
    if (autoRefreshEnabled) {
      triggerLivePreview(updatedFiles, selectedLanguage);
    }
  };

  const handleLoadSolution = () => {
    if (!activeQuestion) return;
    if (isInterviewActive) {
      showToast('🔒 Solution is locked during an active interview round!');
      return;
    }

    isSwitchingRef.current = true;

    if (selectedLanguage === 'react') {
      const sol = activeQuestion.solutionCode;
      const updatedFiles = { ...files, 'App.tsx': sol };
      filesRef.current = updatedFiles;
      activeFileNameRef.current = 'App.tsx';

      setFiles(updatedFiles);
      setActiveFileName('App.tsx');
      setCurrentCode(sol);
      if (editorRef.current) {
        editorRef.current.setValue(sol);
      }
      executeCode(updatedFiles, 'react');
      setMultiFilesMap(prev => {
        const updated = { ...prev, [activeQuestion.id]: updatedFiles };
        try {
          localStorage.setItem('mc_multi_files_v2', JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });
      showToast('✓ React solution loaded into App.tsx & executed!');
    } else {
      const solFiles = buildStarterFilesForLanguage(activeQuestion, selectedLanguage);
      if (selectedLanguage === 'javascript' || selectedLanguage === 'dom') {
        delete solFiles['App.tsx'];
        delete solFiles['App.ts'];
        delete solFiles['App.jsx'];
      }
      const langOpt = LANGUAGE_OPTIONS.find(l => l.id === selectedLanguage) || LANGUAGE_OPTIONS[0];
      const primaryFile = solFiles[langOpt.primaryFile] !== undefined ? langOpt.primaryFile : Object.keys(solFiles)[0];
      const solCode = solFiles[primaryFile] || '';

      filesRef.current = solFiles;
      activeFileNameRef.current = primaryFile;

      setFiles(solFiles);
      setActiveFileName(primaryFile);
      setCurrentCode(solCode);
      if (editorRef.current) {
        editorRef.current.setValue(solCode);
      }
      executeCode(solFiles, selectedLanguage);
      setMultiFilesMap(prev => {
        const updated = { ...prev, [activeQuestion.id]: solFiles };
        try {
          localStorage.setItem('mc_multi_files_v2', JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });
      showToast(`✓ ${langOpt.label} solution loaded into ${primaryFile} & executed!`);
    }

    setTimeout(() => {
      isSwitchingRef.current = false;
    }, 50);
  };

  const handleResetStarter = () => {
    if (!activeQuestion) return;
    isSwitchingRef.current = true;
    const resetFiles = buildStarterFilesForLanguage(activeQuestion, selectedLanguage);
    if (selectedLanguage === 'javascript' || selectedLanguage === 'dom') {
      delete resetFiles['App.tsx'];
      delete resetFiles['App.ts'];
      delete resetFiles['App.jsx'];
    }
    const langOpt = LANGUAGE_OPTIONS.find(l => l.id === selectedLanguage) || LANGUAGE_OPTIONS[0];
    const primaryFile = resetFiles[langOpt.primaryFile] !== undefined ? langOpt.primaryFile : Object.keys(resetFiles)[0];

    filesRef.current = resetFiles;
    activeFileNameRef.current = primaryFile;

    setFiles(resetFiles);
    setActiveFileName(primaryFile);
    const initialContent = resetFiles[primaryFile] || '';
    setCurrentCode(initialContent);
    if (editorRef.current) {
      editorRef.current.setValue(initialContent);
    }
    executeCode(resetFiles, selectedLanguage);
    setMultiFilesMap(prev => {
      const updated = { ...prev, [activeQuestion.id]: resetFiles };
      try {
        localStorage.setItem('mc_multi_files_v2', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    // Reset starter metadata to freshly generated state
    const resetMeta = buildStarterMetadata(activeQuestion, selectedLanguage, initialContent, false);
    setStarterMetaMap(prev => {
      const updated = {
        ...prev,
        [activeQuestion.id]: {
          ...(prev[activeQuestion.id] || {}),
          [selectedLanguage]: resetMeta,
        }
      };
      try {
        localStorage.setItem('mc_starter_meta_v2', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    showToast(`↺ Project files reset to initial ${langOpt.label} template!`);

    setTimeout(() => {
      isSwitchingRef.current = false;
    }, 50);
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
  // BUG 7 FIX: Use filesRef.current and activeFileNameRef.current so the save always
  // captures the latest typed code, not a potentially stale closure value.
  const handleSaveAndFormat = () => {
    handleFormatCode();
    if (activeQuestion) {
      const latestFiles = filesRef.current;
      const latestCode = latestFiles[activeFileNameRef.current] || Object.values(latestFiles)[0] || '';
      setUserCodeMap(prev => {
        const updated = { ...prev, [activeQuestion.id]: latestCode };
        try {
          localStorage.setItem('mc_code_drafts_v1', JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });
      setMultiFilesMap(prev => {
        const updated = { ...prev, [activeQuestion.id]: latestFiles };
        try {
          localStorage.setItem('mc_multi_files_v2', JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });
    }
    executeCode(filesRef.current);
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

  // Filtered Questions for Command Palette Spotlight
  const filteredPaletteQuestions = useMemo(() => {
    return MACHINE_CODING_CATALOG.filter(q => {
      const matchesCat = paletteCategoryFilter === 'All' || q.category === paletteCategoryFilter;
      const matchesDiff = paletteDifficultyFilter === 'All' || q.difficulty === paletteDifficultyFilter;
      const query = paletteSearchQuery.trim().toLowerCase();
      const matchesSearch = !query ||
        q.title.toLowerCase().includes(query) ||
        q.id.toLowerCase().includes(query) ||
        q.category.toLowerCase().includes(query) ||
        q.summary.toLowerCase().includes(query);
      return matchesCat && matchesDiff && matchesSearch;
    });
  }, [paletteSearchQuery, paletteCategoryFilter, paletteDifficultyFilter]);

  // Keep selection within bounds
  useEffect(() => {
    setPaletteSelectedIndex(0);
  }, [paletteSearchQuery, paletteCategoryFilter, paletteDifficultyFilter]);

  // Auto-focus input when palette opens
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => {
        paletteSearchInputRef.current?.focus();
      }, 50);
    }
  }, [isCommandPaletteOpen]);

  // Scroll active item into view
  useEffect(() => {
    if (isCommandPaletteOpen && paletteListRef.current) {
      const selectedEl = paletteListRef.current.querySelector('.mc-palette-item.selected') as HTMLElement | null;
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [paletteSelectedIndex, isCommandPaletteOpen]);

  // Global Keyboard Shortcuts Listener.
  // Registered ONCE per question: all mutable inputs are read via refs mirrored
  // per render below, so typing (files/currentCode change per keystroke) does
  // not tear down and re-add this window listener on every character.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const ks = mcKeyStateRef.current;
      // Command Palette (Ctrl+K or Cmd+K)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }

      // If Command Palette is open, handle navigation keys
      if (ks.isCommandPaletteOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setIsCommandPaletteOpen(false);
          return;
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setPaletteSelectedIndex(prev => Math.min(prev + 1, ks.filteredPaletteQuestions.length - 1));
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setPaletteSelectedIndex(prev => Math.max(prev - 1, 0));
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          const target = ks.filteredPaletteQuestions[ks.paletteSelectedIndex];
          if (target) {
            selectQuestionRef.current(target.id);
            setIsCommandPaletteOpen(false);
          }
          return;
        }
      }

      // Escape: exit any fullscreen panel or close modals
      if (e.key === 'Escape') {
        if (ks.showShortcutsModal) {
          setShowShortcutsModal(false);
          return;
        }
        if (ks.showSnapshotMenu) {
          setShowSnapshotMenu(false);
          return;
        }
        if (ks.fullscreenPanel !== 'none') {
          setFullscreenPanel('none');
          return;
        }
      }

      // Shortcuts cheat sheet: Ctrl+/ or Cmd+/ (never bare '?' so ternary operator '?' and optional chaining '?.' work freely)
      const isEditing = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName || '') ||
        Boolean((e.target as HTMLElement)?.closest('.monaco-editor, [contenteditable="true"]'));
      if (!isEditing && (e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setShowShortcutsModal(prev => !prev);
        return;
      }

      // Ctrl+Enter or Cmd+Enter: Run Live
      // BUG 3 FIX: Use filesRef.current (always fresh) instead of closed-over `files` state.
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        executeCodeRef.current();
        showToastRef.current('⚡ Executing sandbox (Ctrl+Enter)');
        return;
      }

      // Ctrl+Shift+T or Cmd+Shift+T: Run Test Suite
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'T' || e.key === 't')) {
        e.preventDefault();
        handleRunTestsRef.current();
        return;
      }

      // Ctrl+S or Cmd+S: Save Draft & Format
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        handleSaveAndFormatRef.current();
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
    // Mutable inputs come from mcKeyStateRef/*Ref mirrors (assigned per render
    // below), so this registers once per question, not once per keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuestion?.id]);

  const selectQuestion = (id: string) => {
    if (isInterviewActive) {
      const confirmExit = window.confirm('An interview round is currently active. Are you sure you want to exit and switch questions?');
      if (!confirmExit) return;
      setIsInterviewActive(false);
    }
    const currentLang = selectedLanguage;
    if (routeId) {
      navigate(currentLang === 'react' ? `/questions/${id}` : `/questions/${id}?lang=${currentLang}`);
    } else {
      if (currentLang === 'react') {
        setSearchParams({ id });
      } else {
        setSearchParams({ id, lang: currentLang });
      }
    }
  };

  // Mirror mutable keyboard-shortcut inputs per render (see listener above).
  selectQuestionRef.current = selectQuestion;
  showToastRef.current = showToast;
  mcKeyStateRef.current = {
    isCommandPaletteOpen,
    filteredPaletteQuestions,
    paletteSelectedIndex,
    fullscreenPanel,
    showShortcutsModal,
    showSnapshotMenu,
  };

  const closeStudio = () => {
    if (routeId) {
      navigate('/questions');
    } else {
      setSearchParams({});
    }
  };

  const activeBatchObj = BATCHES.find(b => b.id === selectedBatch) || BATCHES[0];

  const filteredQuestions = useMemo(() => {
    let list = MACHINE_CODING_CATALOG.filter(q => {
      const qNum = parseInt(q.id.replace(/\D/g, ''), 10) || 0;
      const inBatch = activeBatchObj.id === 'all' || (qNum >= activeBatchObj.start && qNum <= activeBatchObj.end);

      const matchesSearch =
        !searchQuery.trim() ||
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray((q as any).tags) && (q as any).tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCat = selectedCategory === 'All' || q.category === selectedCategory;
      const matchesDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;

      const isSolvedQ = !!solvedMap[q.id];
      const isAttemptedQ = attemptedSet.has(q.id);
      const isBookmarkedQ = bookmarkedSet.has(q.id);

      let matchesStatus = true;
      if (selectedStatus === 'Solved') matchesStatus = isSolvedQ;
      else if (selectedStatus === 'Unsolved') matchesStatus = !isSolvedQ;
      else if (selectedStatus === 'Attempted') matchesStatus = isAttemptedQ && !isSolvedQ;
      else if (selectedStatus === 'Bookmarked') matchesStatus = isBookmarkedQ;

      return inBatch && matchesSearch && matchesCat && matchesDiff && matchesStatus;
    });

    const diffWeights: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3, Senior: 4 };
    const recentActivity = mcProgressService.getRecentActivity();
    const recentAttemptOrder = new Map(recentActivity.filter(a => a.type === 'attempt').map((a, i) => [a.id, i]));
    const recentSolveOrder = new Map(recentActivity.filter(a => a.type === 'solve').map((a, i) => [a.id, i]));

    return list.sort((a, b) => {
      const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;

      if (sortBy === 'id-asc') return numA - numB;
      if (sortBy === 'id-desc') return numB - numA;
      if (sortBy === 'difficulty') {
        const wA = diffWeights[a.difficulty] || 0;
        const wB = diffWeights[b.difficulty] || 0;
        return wA !== wB ? wA - wB : numA - numB;
      }
      if (sortBy === 'category') {
        const cComp = a.category.localeCompare(b.category);
        return cComp !== 0 ? cComp : numA - numB;
      }
      if (sortBy === 'recent-attempted') {
        const orderA = recentAttemptOrder.has(a.id) ? recentAttemptOrder.get(a.id)! : 999999;
        const orderB = recentAttemptOrder.has(b.id) ? recentAttemptOrder.get(b.id)! : 999999;
        return orderA !== orderB ? orderA - orderB : numA - numB;
      }
      if (sortBy === 'recent-solved') {
        const orderA = recentSolveOrder.has(a.id) ? recentSolveOrder.get(a.id)! : 999999;
        const orderB = recentSolveOrder.has(b.id) ? recentSolveOrder.get(b.id)! : 999999;
        return orderA !== orderB ? orderA - orderB : numA - numB;
      }
      return numA - numB;
    });
  }, [searchQuery, selectedBatch, selectedCategory, selectedDifficulty, selectedStatus, sortBy, activeBatchObj, solvedMap, bookmarkedSet, attemptedSet]);

  const totalPages = Math.ceil(filteredQuestions.length / pageSize) || 1;
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, currentPage, pageSize]);

  const solvedCount = Object.values(solvedMap).filter(Boolean).length;
  const categories = [
    'All',
    'JavaScript',
    'TypeScript',
    'ReactJS',
    'React Redux Toolkit',
    'React Query',
    'DOM',
    'LeetCode',
  ];

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
            <button className="mc-back-btn" onClick={closeStudio} title="Back to Questions Hub">
              <span className="mc-back-icon">←</span>
              <span className="mc-back-label">Hub</span>
            </button>

            <button
              type="button"
              className="mc-btn-palette"
              onClick={() => setIsCommandPaletteOpen(true)}
              title="Quick Search & Switch Challenge (Ctrl+K)"
            >
              <span className="mc-palette-icon">🔍</span>
              <span className="mc-palette-label">Switch</span>
              <span className="mc-btn-palette-kbd">⌘K</span>
            </button>

            <div className="mc-challenge-pill">
              <div className="mc-nav-arrows">
                <button
                  className="mc-nav-arrow"
                  disabled={!prevQuestion || isInterviewActive}
                  onClick={() => !isInterviewActive && prevQuestion && selectQuestion(prevQuestion.id)}
                  title={isInterviewActive ? 'Navigation disabled during active interview round' : prevQuestion ? `Prev: ${prevQuestion.id} ${prevQuestion.title}` : 'First challenge'}
                >
                  ‹
                </button>
                <button
                  className="mc-nav-arrow"
                  disabled={!nextQuestion || isInterviewActive}
                  onClick={() => !isInterviewActive && nextQuestion && selectQuestion(nextQuestion.id)}
                  title={isInterviewActive ? 'Navigation disabled during active interview round' : nextQuestion ? `Next: ${nextQuestion.id} ${nextQuestion.title}` : 'Last challenge'}
                >
                  ›
                </button>
              </div>

              <div className="mc-question-select-wrapper">
                <select
                  className="mc-question-select"
                  disabled={isInterviewActive}
                  value={activeQuestion.id}
                  onChange={(e) => !isInterviewActive && selectQuestion(e.target.value)}
                  title={isInterviewActive ? 'Locked during active interview round' : `${activeQuestion.id}: ${activeQuestion.title}`}
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

              <span className={`mc-badge ${activeQuestion.difficulty.toLowerCase()}`}>
                {activeQuestion.difficulty}
              </span>

              <button
                type="button"
                className={`mc-btn-bookmark ${bookmarkedSet.has(activeQuestion.id) ? 'bookmarked' : ''}`}
                onClick={() => toggleBookmark(activeQuestion.id)}
                title={bookmarkedSet.has(activeQuestion.id) ? 'Bookmarked (Click to remove)' : 'Bookmark challenge for revision'}
                aria-label="Bookmark challenge"
              >
                {bookmarkedSet.has(activeQuestion.id) ? '★' : '☆'}
              </button>

              <span className={`mc-status-indicator ${solvedMap[activeQuestion.id] ? 'solved' : attemptedSet.has(activeQuestion.id) ? 'attempted' : 'not-started'}`}>
                {solvedMap[activeQuestion.id] ? '✓ Solved' : attemptedSet.has(activeQuestion.id) ? '● Attempted' : '○ Ready'}
              </span>
            </div>

            {/* Language Environment Selector */}
            <div className="mc-topbar-lang-box" title="Select programming language & runtime environment">
              <select
                className="mc-topbar-lang-select"
                value={selectedLanguage}
                onChange={(e) => handleSwitchLanguage(e.target.value as MCLanguage)}
              >
                {LANGUAGE_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.icon} {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mc-topbar-right">
            {!isInterviewActive ? (
              <div className="mc-interview-launcher">
                <select
                  className="mc-duration-select"
                  value={interviewDuration}
                  onChange={(e) => setInterviewDuration(Number(e.target.value))}
                  title="Interview round duration"
                >
                  <option value={30 * 60}>30m</option>
                  <option value={45 * 60}>45m</option>
                  <option value={60 * 60}>60m</option>
                </select>
                <button
                  className="mc-action-btn mc-btn-interview-start"
                  onClick={() => handleStartInterview(interviewDuration)}
                  title="Begin timed FAANG interview simulation"
                >
                  ⏱️ Start
                </button>
              </div>
            ) : (
              <div className="mc-active-interview-controls">
                <div
                  className={`mc-interview-hud ${
                    interviewTimeLeft < 180 ? 'urgent-critical' : interviewTimeLeft < 600 ? 'urgent-warn' : 'normal'
                  }`}
                  title="Remaining time"
                >
                  <span className="mc-hud-pulse" />
                  <span className="mc-hud-timer">{formatMMSS(interviewTimeLeft)}</span>
                </div>
                <button
                  className="mc-action-btn mc-btn-interview-finish"
                  onClick={handleFinishInterview}
                  title="Submit candidate work & generate evaluation report"
                >
                  🏁 Submit
                </button>
                <button
                  className="mc-action-btn mc-btn-interview-exit"
                  onClick={handleExitInterview}
                  title="Exit interview round and auto-save candidate work"
                  style={{ background: '#374151', color: '#f3f4f6', border: '1px solid #4b5563' }}
                >
                  🚪 Exit
                </button>
              </div>
            )}

            {/* Live Collaborative Interview Room Pill */}
            <button
              type="button"
              className={`mc-action-btn mc-btn-collab ${isCollabActive ? 'active' : ''}`}
              onClick={() => {
                if (!isCollabActive) {
                  handleStartLiveSession();
                } else {
                  setIsCollabDrawerOpen(prev => !prev);
                }
              }}
              title={isCollabActive ? 'Toggle Live Collab Room (Yjs Real-Time + Chat)' : 'Start Real-Time Collaborative Interview Room'}
            >
              <span className={`mc-collab-pulse-dot ${isCollabActive ? 'live' : ''}`} />
              <span>{isCollabActive ? `🔴 Live (${sessionParticipants.length || 1})` : '👥 Live Collab'}</span>
              {unreadMessageCount > 0 && !isCollabDrawerOpen && (
                <span className="mc-collab-unread-badge">{unreadMessageCount}</span>
              )}
            </button>

            {userRole === 'admin' && (
              <span className="mc-admin-mode-pill" title="Administrator live monitoring mode">
                🛡️ Admin View
              </span>
            )}

            {/* Smart Utility Icon Toolbar */}
            <div className="mc-topbar-tool-group">
              <button
                type="button"
                className={`mc-topbar-icon-btn ${showAIPrompter ? 'active' : ''}`}
                onClick={() => setShowAIPrompter(prev => !prev)}
                title="AI Staff Interviewer Prompter (Ctrl+B)"
              >
                🎙️
                {showAIPrompter && <span className="mc-ai-pulse-dot" />}
              </button>

              <button
                type="button"
                className="mc-topbar-icon-btn"
                onClick={async () => {
                  if (!activeQuestion) return;
                  let results = testResults;
                  if (!results) {
                    showToast('🧪 Compiling test assertions & code audit...');
                    results = await runTestsAsync(files);
                  }
                  const passed = results ? results.filter(r => r.status === 'passed').length : 0;
                  const total = results ? results.length : 0;
                  setScorecardData({
                    question: activeQuestion,
                    timeSpentSeconds: isInterviewActive ? Math.max(1, interviewDuration - interviewTimeLeft) : 720,
                    totalDurationSeconds: interviewDuration,
                    testResults: results || [],
                    passedTests: passed,
                    totalTests: total,
                    files: { ...files },
                  });
                  setShowScorecard(true);
                }}
                title="Senior Staff Evaluation Scorecard & Anti-Pattern Audit"
              >
                📊
              </button>

              <button
                type="button"
                className="mc-topbar-icon-btn"
                onClick={handleLoadSolution}
                disabled={isInterviewActive}
                title={isInterviewActive ? "Reference solution locked during active interview" : "Inspect Reference Solution"}
              >
                💡
              </button>

              <button
                type="button"
                className="mc-topbar-icon-btn"
                onClick={handleResetStarter}
                title="Reset Starter Template"
              >
                ↺
              </button>

              <button
                type="button"
                className="mc-topbar-icon-btn"
                onClick={handleExportProject}
                title="Export Standalone Project (.ZIP)"
              >
                📦
              </button>

              <button
                type="button"
                className="mc-topbar-icon-btn"
                onClick={() => setShowShortcutsModal(true)}
                title="Keyboard Shortcuts Cheat Sheet (Ctrl+/)"
              >
                ⌨️
              </button>
            </div>

            {/* Solved Toggle */}
            <button
              className={`mc-action-btn mc-btn-solved-toggle ${isSolved ? 'solved' : ''}`}
              onClick={() => toggleSolved(activeQuestion.id)}
              title={isSolved ? 'Mark problem as uncompleted' : 'Mark problem as completed'}
            >
              {isSolved ? '✓ Solved' : 'Mark Solved'}
            </button>

            {/* Primary Actions */}
            <button
              className="mc-action-btn mc-btn-tests"
              onClick={handleRunTests}
              disabled={isRunningTests || isCompiling}
              title="Run automated test suite (Ctrl+Shift+T)"
            >
              {isRunningTests ? '🧪 Testing...' : '🧪 Tests'}
            </button>

            <button
              className="mc-action-btn mc-btn-run"
              onClick={() => executeCode(files)}
              disabled={isCompiling}
              title="Compile and preview live in sandbox (Ctrl+Enter)"
            >
              {isCompiling ? 'Compiling...' : '▶ Run Live'}
            </button>

            <button
              className="mc-action-btn mc-btn-submit-action"
              onClick={handleSubmitSolution}
              disabled={isRunningTests || isCompiling}
              title="Submit solution for automated scoring & evaluation"
            >
              🏁 Submit
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
                  Specs
                </button>
                <button
                  className={`mc-spec-tab ${activeTab === 'tips' ? 'active' : ''}`}
                  onClick={() => setActiveTab('tips')}
                >
                  Rubric
                </button>
                <button
                  className={`mc-spec-tab ${activeTab === 'solution' ? 'active' : ''} ${isInterviewActive ? 'locked' : ''}`}
                  onClick={() => setActiveTab('solution')}
                >
                  {isInterviewActive ? '🔒 Solution' : '💡 Solution'}
                </button>
                <button
                  className={`mc-spec-tab ${activeTab === 'tests' ? 'active' : ''}`}
                  onClick={() => setActiveTab('tests')}
                >
                  🧪 Tests {testResults ? `(${testResults.filter(r => r.status === 'passed').length}/${testResults.length})` : ''}
                </button>
                <button
                  className={`mc-spec-tab ${activeTab === 'notes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notes')}
                >
                  📝 Notes {candidateNote.trim() ? '●' : ''}
                </button>
              </div>
              <button
                type="button"
                className={`mc-icon-tool-btn ${fullscreenPanel === 'specs' ? 'active' : ''}`}
                onClick={() => setFullscreenPanel(prev => prev === 'specs' ? 'none' : 'specs')}
                title={fullscreenPanel === 'specs' ? 'Restore Specs Size (Esc)' : 'Maximize Specs (Fullscreen)'}
              >
                {fullscreenPanel === 'specs' ? '⤓' : '⛶'}
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
                    <span className="mc-spec-tag-time">⏱️ {activeQuestion.timeEstimate}</span>
                    <span className="mc-spec-tag-cat">🏷️ {activeQuestion.category}</span>
                  </div>

                  {/* Problem Statement */}
                  <div className="mc-spec-section-heading">
                    <span>📋</span> Problem Statement
                  </div>
                  <div className="mc-spec-problem-box">
                    {activeQuestion.problemStatement || renderSpecDescription(activeQuestion.description)}
                  </div>

                  {/* Requirements & Candidate Checklist */}
                  <h4 className="mc-checklist-heading">
                    Candidate Checklist ({activeQuestion.requirements.filter((_, idx) => !!checkedItems[activeQuestion.id]?.[idx]).length}/{activeQuestion.requirements.length}):
                  </h4>
                  <div className="mc-checklist">
                    {activeQuestion.requirements.map((req, idx) => {
                      const isChecked = !!checkedItems[activeQuestion.id]?.[idx];
                      return (
                        <label key={idx} className={`mc-checklist-item ${isChecked ? 'checked' : ''}`}>
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
                          <span className="mc-checklist-text">
                            {req}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Examples & Test Scenarios */}
                  {activeQuestion.examples && activeQuestion.examples.length > 0 && (
                    <>
                      <div className="mc-spec-section-heading">
                        <span>🧪</span> Examples &amp; Expected Outputs
                      </div>
                      <div className="mc-spec-examples-list">
                        {activeQuestion.examples.map((ex, exIdx) => (
                          <div key={exIdx} className="mc-spec-example-card">
                            <div className="mc-spec-example-title">{ex.title}</div>
                            {ex.input && (
                              <div className="mc-spec-example-row">
                                <span className="mc-spec-example-label">Input:</span>
                                <code>{ex.input}</code>
                              </div>
                            )}
                            {ex.output && (
                              <div className="mc-spec-example-row">
                                <span className="mc-spec-example-label">Output:</span>
                                <code>{ex.output}</code>
                              </div>
                            )}
                            {ex.explanation && (
                              <div className="mc-spec-example-row">
                                <span className="mc-spec-example-label">Explanation:</span>
                                <span>{ex.explanation}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Technical Constraints */}
                  {activeQuestion.constraints && activeQuestion.constraints.length > 0 && (
                    <>
                      <div className="mc-spec-section-heading">
                        <span>⚡</span> Technical Constraints
                      </div>
                      <ul className="mc-spec-constraints-list">
                        {activeQuestion.constraints.map((c, cIdx) => (
                          <li key={cIdx} className="mc-spec-constraint-item">
                            <span className="mc-spec-constraint-bullet">▸</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {/* Preview & Behavior Guide */}
                  {activeQuestion.previewInfo && (
                    <>
                      <div className="mc-spec-section-heading">
                        <span>👁️</span> Live Preview Information
                      </div>
                      <div className="mc-spec-preview-guide">
                        <div>{activeQuestion.previewInfo.summary}</div>
                        {activeQuestion.previewInfo.interactiveControls && activeQuestion.previewInfo.interactiveControls.length > 0 && (
                          <div className="mc-spec-controls-tags">
                            {activeQuestion.previewInfo.interactiveControls.map((ctrl, ctrlIdx) => (
                              <span key={ctrlIdx} className="mc-spec-control-tag">{ctrl}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'tips' && (
                <div>
                  <h3 className="mc-rubric-heading">
                    Senior Staff Evaluation Rubric
                  </h3>

                  <div className="mc-interview-card">
                    <div className="mc-interview-title">🎯 What Interviewers Look For:</div>
                    <ul className="mc-interview-list">
                      {activeQuestion.interviewTips.map((tip, idx) => (
                        <li key={idx}>{renderFormattedMarkdown(tip)}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mc-pitfalls-card">
                    <div className="mc-pitfalls-title">⚠️ Common Candidate Traps:</div>
                    <ul className="mc-pitfalls-list">
                      {activeQuestion.commonMistakes.map((mistake, idx) => (
                        <li key={idx}>{renderFormattedMarkdown(mistake)}</li>
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
                ) : !canViewSolution ? (
                  <div className="mc-solution-locked-card">
                    <div className="mc-locked-icon">🔒</div>
                    <h3 className="mc-locked-title">Reference Solution Locked</h3>
                    <p className="mc-locked-desc">
                      Official reference solutions require verified Pro Candidate or Platform Administrator entitlements.
                    </p>
                    <div className="mc-locked-rules">
                      <div className="mc-locked-rule-item">
                        <span>🛡️</span>
                        <span>Role: <strong>{userRole.toUpperCase()}</strong></span>
                      </div>
                      <div className="mc-locked-rule-item">
                        <span>💡</span>
                        <span>Upgrade your account or request administrator privileges to inspect production reference solutions.</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '15px', color: '#c084fc' }}>Reference Solution</h3>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          Environment: {LANGUAGE_OPTIONS.find(l => l.id === selectedLanguage)?.label || 'ReactJS'}
                        </span>
                      </div>
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
                      {getSolutionCodeForLanguage(activeQuestion, selectedLanguage)}
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

              {activeTab === 'notes' && (
                <div className="mc-spec-notes-panel">
                  <div className="mc-notes-head">
                    <div>
                      <h3 className="mc-notes-title">Candidate Notes — {activeQuestion.id}</h3>
                      <p className="mc-notes-subtitle">
                        Private notes scoped to your account and this challenge. Saved locally and synced.
                      </p>
                    </div>
                    {noteSavedAt && (
                      <span className="mc-notes-saved-badge">
                        ✓ Last saved {noteSavedAt}
                      </span>
                    )}
                  </div>

                  <textarea
                    className="mc-notes-textarea"
                    value={candidateNote}
                    onChange={(e) => setCandidateNote(e.target.value)}
                    placeholder="Document your architecture decisions, edge cases, interviewer discussions, time/space complexity, or revision notes for this challenge..."
                    rows={12}
                  />

                  <div className="mc-notes-actions">
                    <div className="mc-notes-stats">
                      <span>{candidateNote.length} characters</span>
                      <span>•</span>
                      <span>{candidateNote.trim() ? candidateNote.trim().split(/\s+/).length : 0} words</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {candidateNote.trim() && (
                        <button
                          type="button"
                          className="btn btn-ghost-danger btn-sm"
                          onClick={handleDeleteNote}
                          title="Clear notes for this challenge"
                        >
                          🗑️ Clear
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleSaveNote}
                      >
                        💾 Save Note
                      </button>
                    </div>
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
                    {Object.keys(files).map(fileName => {
                      const langOpt = LANGUAGE_OPTIONS.find(l => l.id === selectedLanguage);
                      const isPrimary = fileName === (langOpt?.primaryFile || 'App.tsx');
                      return (
                        <div
                          key={fileName}
                          className={`mc-file-tab ${fileName === activeFileName ? 'active' : ''}`}
                          onClick={() => handleSelectFile(fileName)}
                          title={`Switch to ${fileName}`}
                        >
                          <span className="mc-file-icon">{getFileIcon(fileName)}</span>
                          <span className="mc-file-name">{fileName}</span>
                          {!isPrimary && Object.keys(files).length > 1 && (
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
                      );
                    })}
                    <button
                      type="button"
                      className="mc-add-file-btn"
                      onClick={() => setShowAddFileModal(true)}
                      title="Add new file to workspace (styles.css, mockData.ts, types.ts)"
                    >
                      + New File
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <div className="mc-editor-mode-toggle">
                      <button
                        className={`mc-toggle-pill ${editorViewMode === 'code' ? 'active' : ''}`}
                        onClick={() => setEditorViewMode('code')}
                      >
                        Code
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
                        {isInterviewActive ? '🔒 Diff' : '🔀 Diff'}
                      </button>
                    </div>

                    <button
                      type="button"
                      className="mc-icon-tool-btn"
                      onClick={handleFormatCode}
                      title="Format Code Document (Alt+F or Ctrl+S)"
                    >
                      🪄
                    </button>

                    <div className="mc-snapshot-menu-wrapper" ref={snapshotMenuRef}>
                      <button
                        type="button"
                        className={`mc-icon-tool-btn ${showSnapshotMenu ? 'active' : ''}`}
                        onClick={() => setShowSnapshotMenu(prev => !prev)}
                        title={`Snapshots & History (${snapshots.length} saved)`}
                        style={{ position: 'relative' }}
                      >
                        📸
                        {snapshots.length > 0 && <span className="mc-badge-count">{snapshots.length}</span>}
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
                      className={`mc-icon-tool-btn ${fullscreenPanel === 'editor' ? 'active' : ''}`}
                      onClick={() => setFullscreenPanel(prev => prev === 'editor' ? 'none' : 'editor')}
                      title={fullscreenPanel === 'editor' ? 'Restore Editor Size (Esc)' : 'Maximize Code Editor (Fullscreen)'}
                    >
                      {fullscreenPanel === 'editor' ? '⤓' : '⛶'}
                    </button>
                  </div>
                </div>

                {editorViewMode === 'diff' && (
                  <div className="mc-panel-header mc-diff-header" style={{ borderTop: 'none', justifyContent: 'flex-end' }}>
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
                          modified={
                            diffTarget === 'solution'
                              ? getSolutionCodeForFile(activeQuestion, selectedLanguage, activeFileName)
                              : (selectedLanguage === 'react'
                                  ? (activeFileName === 'App.tsx' ? activeQuestion.starterCode : '')
                                  : (buildStarterFilesForLanguage(activeQuestion, selectedLanguage)[activeFileName] || ''))
                          }
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
                      path={`${activeQuestion?.id || 'mc'}/${activeFileName}`}
                      language={getEditorLanguage(activeFileName)}
                      theme={resolvedTheme === 'light' ? 'light' : 'vs-dark'}
                      value={currentCode}
                      onChange={(val) => {
                        if (isCollabActive && (userRole === 'observer' || (userRole === 'admin' && !canAdminEdit))) return;
                        handleCodeChange(val);
                      }}
                      onMount={(editor, monaco) => {
                        editorRef.current = editor;
                        // Deferred bind: the sync-gated auto-bind performs the
                        // actual bind once the session doc is synced. Binding
                        // immediately here could seed a stale session/code.
                        bindMonacoEditor(editor, activeFileName, true);
                        mcEditorDisposablesRef.current = [
                          editor.onDidChangeCursorPosition((e: any) => {
                            emitCursorMove(e.position.lineNumber, e.position.column);
                          }),
                          editor.onDidFocusEditorWidget(() => emitFocus(true)),
                          editor.onDidBlurEditorWidget(() => emitFocus(false)),
                        ];

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
                        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
                          setIsCommandPaletteOpen(prev => !prev);
                        });
                        editor.addCommand(monaco.KeyCode.Escape, () => {
                          setFullscreenPanel('none');
                          setShowShortcutsModal(false);
                          setShowSnapshotMenu(false);
                          setIsCommandPaletteOpen(false);
                        });
                      }}
                      options={{
                        fontSize: 13,
                        readOnly: isCollabActive ? (userRole === 'observer' || (userRole === 'admin' && !canAdminEdit)) : false,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: 'on',
                        renderValidationDecorations: 'off',
                        quickSuggestions: false,
                        lightbulb: { enabled: 'off' as any }
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
                  display: fullscreenPanel === 'editor' ? 'none' : 'flex',
                  flex: 1,
                  width: fullscreenPanel === 'preview' ? '100%' : undefined,
                  minWidth: 0,
                }}
              >
                <div className="mc-panel-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>⚡ Live Preview</span>
                    {/* Auto-refresh pulse indicator */}
                    {autoRefreshEnabled && (
                      <span
                        className="mc-preview-live-dot"
                        title="Auto-refresh is ON — preview updates as you type"
                      />
                    )}
                    {isPreviewRefreshing && (
                      <span className="mc-preview-refreshing-badge">Refreshing…</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {/* Auto-refresh toggle */}
                    <button
                      type="button"
                      id="mc-auto-refresh-toggle"
                      className={`mc-preview-toggle-btn ${autoRefreshEnabled ? 'active' : ''}`}
                      onClick={handleToggleAutoRefresh}
                      title={autoRefreshEnabled ? 'Auto-refresh ON — click to disable' : 'Auto-refresh OFF — click to enable'}
                    >
                      <span className="mc-preview-toggle-icon">{autoRefreshEnabled ? '⚡' : '⚡'}</span>
                      <span className="mc-preview-toggle-label">{autoRefreshEnabled ? 'Auto' : 'Manual'}</span>
                    </button>
                    {/* Manual refresh button */}
                    <button
                      type="button"
                      id="mc-manual-refresh-btn"
                      className={`mc-icon-tool-btn mc-refresh-btn ${isPreviewRefreshing ? 'spinning' : ''}`}
                      onClick={handleManualRefresh}
                      title="Manual Refresh — Force update preview now (Ctrl+Enter)"
                    >
                      ↺
                    </button>
                    <button
                      type="button"
                      className={`mc-icon-tool-btn ${fullscreenPanel === 'preview' ? 'active' : ''}`}
                      onClick={() => setFullscreenPanel(prev => prev === 'preview' ? 'none' : 'preview')}
                      title={fullscreenPanel === 'preview' ? 'Restore Sandbox Size (Esc)' : 'Maximize Sandbox (Fullscreen)'}
                    >
                      {fullscreenPanel === 'preview' ? '⤓' : '⛶'}
                    </button>
                  </div>
                </div>
                <iframe
                  ref={iframeRef}
                  className="mc-iframe-runner"
                  title="React Preview Sandbox"
                  srcDoc={previewSrcDoc}
                  sandbox="allow-scripts allow-modals"
                />

                {/* Live Preview Error Overlay with Auto-Recovery */}
                {livePreviewError && (
                  <div className="mc-preview-error-overlay">
                    <div className="mc-preview-error-header">
                      <span className="mc-preview-error-badge">⚠️ Compilation Error</span>
                      <span className="mc-preview-error-title">Syntax / Transpiler Failure</span>
                    </div>
                    <pre className="mc-preview-error-msg">{livePreviewError}</pre>
                    <div className="mc-preview-error-hint">
                      💡 Editor is still fully active. Once you correct the code syntax, Live Preview will recover automatically.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Live Console Drawer */}
            <div
              className="mc-console-drawer"
              style={{
                display: fullscreenPanel === 'editor' ? 'none' : 'flex',
              }}
            >
              <div className="mc-panel-header mc-terminal-header" style={{ borderTop: 'none' }}>
                <span className="mc-terminal-title">Terminal Output / Logs ({consoleLogs.length})</span>
                <button
                  className="mc-clear-console-btn"
                  onClick={() => setConsoleLogs([])}
                >
                  Clear Console
                </button>
              </div>
              <div className="mc-console-logs">
                {consoleLogs.length === 0 ? (
                  <div className="mc-console-empty">
                    No console logs or errors. Press "Run Live" or interact with components above.
                  </div>
                ) : (
                  consoleLogs.map((log, idx) => (
                    <div key={idx} className={`mc-log-entry ${log.level}`}>
                      <span className="mc-log-level">[{log.level.toUpperCase()}]</span>
                      <span className="mc-log-msg">{log.message}</span>
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
                    <span className="mc-shortcut-name">Quick Switch Challenge (Spotlight)</span>
                    <span className="mc-shortcut-desc">Instant fuzzy search across all 500 curriculum challenges</span>
                  </div>
                  <div className="mc-shortcut-keys">
                    <kbd className="mc-kbd">Ctrl</kbd>
                    <span style={{ color: '#64748b' }}>+</span>
                    <kbd className="mc-kbd">K</kbd>
                  </div>
                </div>

                <div className="mc-shortcut-row">
                  <div className="mc-shortcut-info">
                    <span className="mc-shortcut-name">Shortcuts Cheat Sheet</span>
                    <span className="mc-shortcut-desc">Opens this shortcuts reference dialog</span>
                  </div>
                  <div className="mc-shortcut-keys">
                    <kbd className="mc-kbd">Ctrl</kbd>
                    <span style={{ color: '#64748b' }}>+</span>
                    <kbd className="mc-kbd">/</kbd>
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

        {/* Command Palette & Quick Switcher Spotlight Modal (Ctrl+K) */}
        {isCommandPaletteOpen && (
          <div
            className="mc-palette-overlay"
            onClick={() => setIsCommandPaletteOpen(false)}
          >
            <div
              className="mc-palette-modal"
              onClick={e => e.stopPropagation()}
            >
              {/* Search Bar */}
              <div className="mc-palette-search-box">
                <span className="mc-palette-search-icon">🔍</span>
                <input
                  ref={paletteSearchInputRef}
                  type="text"
                  className="mc-palette-search-input"
                  placeholder="Type problem name, ID (e.g. Q042), or topic..."
                  value={paletteSearchQuery}
                  onChange={(e) => setPaletteSearchQuery(e.target.value)}
                />
                <span className="mc-palette-count-badge">
                  {filteredPaletteQuestions.length} matches
                </span>
              </div>

              {/* Quick Filters */}
              <div className="mc-palette-filters-bar">
                {['All', 'State Management', 'Interactive UI', 'Custom Hooks', 'Async & Performance', 'Architecture'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className={`mc-palette-filter-chip ${paletteCategoryFilter === cat ? 'active' : ''}`}
                    onClick={() => setPaletteCategoryFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
                <span style={{ color: 'rgba(255,255,255,0.15)', margin: '0 4px' }}>|</span>
                {['All', 'Easy', 'Medium', 'Hard', 'Senior'].map(diff => (
                  <button
                    key={diff}
                    type="button"
                    className={`mc-palette-filter-chip ${paletteDifficultyFilter === diff ? 'active' : ''}`}
                    onClick={() => setPaletteDifficultyFilter(diff)}
                  >
                    {diff}
                  </button>
                ))}
              </div>

              {/* Results List */}
              <div className="mc-palette-results-list" ref={paletteListRef}>
                {filteredPaletteQuestions.length === 0 ? (
                  <div className="mc-palette-empty">
                    No challenges found matching "{paletteSearchQuery}". Try another keyword or reset filters.
                  </div>
                ) : (
                  filteredPaletteQuestions.slice(0, 100).map((q, idx) => {
                    const isSelected = idx === paletteSelectedIndex;
                    const isCurrent = q.id === activeQuestion.id;
                    const isSolved = !!solvedMap[q.id];

                    return (
                      <div
                        key={q.id}
                        className={`mc-palette-item ${isSelected ? 'selected' : ''} ${isCurrent ? 'current' : ''}`}
                        onMouseEnter={() => setPaletteSelectedIndex(idx)}
                        onClick={() => {
                          selectQuestion(q.id);
                          setIsCommandPaletteOpen(false);
                        }}
                      >
                        <div className="mc-palette-item-left">
                          <span className="mc-palette-item-id">{q.id}</span>
                          <div className="mc-palette-item-title-col">
                            <div className="mc-palette-item-title">{q.title}</div>
                            <div className="mc-palette-item-sub">
                              <span>⏱️ {q.timeEstimate}</span>
                              <span>•</span>
                              <span>{q.category}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mc-palette-item-right">
                          <span className={`mc-badge ${q.difficulty.toLowerCase()}`}>
                            {q.difficulty}
                          </span>
                          {isSolved && (
                            <span className="mc-palette-solved-pill" title="Completed">
                              ✓ Solved
                            </span>
                          )}
                          {isCurrent && (
                            <span className="mc-palette-active-pill">
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="mc-palette-footer">
                <div className="mc-palette-footer-hints">
                  <span className="mc-palette-hint">
                    <kbd className="mc-kbd">↑</kbd>
                    <kbd className="mc-kbd">↓</kbd>
                    <span>navigate</span>
                  </span>
                  <span className="mc-palette-hint">
                    <kbd className="mc-kbd">↵</kbd>
                    <span>jump to problem</span>
                  </span>
                  <span className="mc-palette-hint">
                    <kbd className="mc-kbd">Esc</kbd>
                    <span>dismiss</span>
                  </span>
                </div>
                <span>500 Curriculum Challenges</span>
              </div>
            </div>
          </div>
        )}

        {/* Collaborative Interview Live Drawer (Chat, Presence, Admin Control & Telemetry) */}
        <LiveInterviewCollabDrawer
          isOpen={isCollabDrawerOpen}
          onClose={() => setIsCollabDrawerOpen(false)}
          session={collabSession}
          currentUser={{
            id: currentUserId,
            name: currentUserName,
            role: userRole,
          }}
          participants={sessionParticipants}
          messages={sessionMessages}
          onSendMessage={handleSendCollabMessage}
          canAdminEdit={canAdminEdit}
          onToggleAdminEdit={() => {
            const nextVal = !canAdminEdit;
            setCanAdminEdit(nextVal);
            if (editorRef.current) {
              editorRef.current.updateOptions({ readOnly: userRole === 'admin' ? !nextVal : false });
            }
          }}
          lastExecutionEvent={lastExecutionEvent}
          onStartSession={handleStartLiveSession}
          onSubmitSession={handleFinishInterview}
        />
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
            Engineering Questions &amp; Machine Coding Studio
          </h1>

          <p className="mc-hero-desc">
            Complete question curriculum with real-time execution. Write code in Monaco Editor, compile with Babel standalone, inspect live DOM previews, and master FAANG-level state architectures across JavaScript, TypeScript, ReactJS, React Redux Toolkit, React Query, DOM, and LeetCode.
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

          <div className="mc-status-filter-pills">
            {(['All', 'Solved', 'Unsolved', 'Attempted', 'Bookmarked'] as const).map(st => (
              <button
                key={st}
                type="button"
                className={`mc-filter-btn ${selectedStatus === st ? 'active' : ''}`}
                onClick={() => { setSelectedStatus(st); setCurrentPage(1); }}
              >
                {st === 'Bookmarked' ? '★ Bookmarked' : st === 'Solved' ? '✓ Solved' : st === 'Attempted' ? '● Attempted' : st}
                {st === 'Bookmarked' && bookmarkedSet.size > 0 ? ` (${bookmarkedSet.size})` : ''}
              </button>
            ))}
          </div>

          <div className="mc-controls-right">
            <select
              className="mc-sort-select"
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value as any); setCurrentPage(1); }}
              title="Sort challenges list"
            >
              <option value="id-asc">🔢 Question # (1 → 500)</option>
              <option value="id-desc">🔢 Question # (500 → 1)</option>
              <option value="difficulty">⚡ Difficulty (Easy → Senior)</option>
              <option value="category">🏷️ Category (A → Z)</option>
              <option value="recent-attempted">⏱️ Recently Attempted</option>
              <option value="recent-solved">🏆 Recently Solved</option>
            </select>

            <div className="mc-diff-filter-group" style={{ display: 'flex', gap: '6px' }}>
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

            {/* View Mode Switcher: Grid vs List */}
            <div className="mc-view-switcher" role="group" aria-label="Layout view mode">
              <button
                type="button"
                className={`mc-view-btn ${overviewViewMode === 'grid' ? 'active' : ''}`}
                onClick={() => {
                  setOverviewViewMode('grid');
                  try { localStorage.setItem('mc_catalog_view_mode', 'grid'); } catch (_) {}
                }}
                title="Grid view"
                aria-label="Grid view"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                </svg>
                <span>Grid</span>
              </button>
              <button
                type="button"
                className={`mc-view-btn ${overviewViewMode === 'list' ? 'active' : ''}`}
                onClick={() => {
                  setOverviewViewMode('list');
                  try { localStorage.setItem('mc_catalog_view_mode', 'list'); } catch (_) {}
                }}
                title="List view"
                aria-label="List view"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                <span>List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {paginatedQuestions.length === 0 ? (
          <div className="mc-empty-state">
            <div className="mc-empty-icon">🔍</div>
            <h3 className="mc-empty-title">No challenges match your criteria</h3>
            <p className="mc-empty-desc">Try clearing your search term or selecting a different batch/filter.</p>
            <button
              className="mc-btn-primary"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDifficulty('All');
                setSelectedBatch('all');
                setCurrentPage(1);
              }}
              style={{ margin: '14px auto 0' }}
            >
              Reset All Filters
            </button>
          </div>
        ) : overviewViewMode === 'grid' ? (
          /* Cards Grid View */
          <div className="mc-cards-grid">
            {paginatedQuestions.map((q) => {
              const isCompleted = !!solvedMap[q.id];
              const isAttempted = attemptedSet.has(q.id);
              const isBookmarked = bookmarkedSet.has(q.id);

              return (
                <div key={q.id} className={`mc-card ${isCompleted ? 'completed' : isAttempted ? 'attempted' : ''}`}>
                  <div className="mc-card-body">
                    <div className="mc-card-header">
                      <span className="mc-card-id">{q.id}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          className={`mc-card-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(q.id);
                          }}
                          title={isBookmarked ? 'Remove bookmark' : 'Bookmark challenge'}
                          aria-label="Bookmark"
                        >
                          {isBookmarked ? '★' : '☆'}
                        </button>
                        <span className={`mc-badge ${q.difficulty.toLowerCase()}`}>
                          {q.difficulty}
                        </span>
                      </div>
                    </div>

                    <h3 className="mc-card-title">{q.title}</h3>
                    <p className="mc-card-summary">{q.summary}</p>
                  </div>

                  <div className="mc-card-footer">
                    <div className="mc-card-meta">
                      <span className="mc-meta-time">⏱️ {q.timeEstimate}</span>
                      <span className="mc-meta-sep">•</span>
                      <span className="mc-meta-category">{q.category}</span>
                      {isCompleted ? (
                        <span className="mc-meta-status solved">✓ Solved</span>
                      ) : isAttempted ? (
                        <span className="mc-meta-status attempted" style={{ color: '#eab308' }}>● Attempted</span>
                      ) : null}
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
        ) : (
          /* Elegant List View */
          <div className="mc-cards-list">
            <div className="mc-list-header-row">
              <span className="mc-th mc-th-id">ID</span>
              <span className="mc-th mc-th-title">Challenge Title &amp; Concept</span>
              <span className="mc-th mc-th-category">Category</span>
              <span className="mc-th mc-th-diff">Difficulty</span>
              <span className="mc-th mc-th-time">Time</span>
              <span className="mc-th mc-th-status">Status</span>
              <span className="mc-th mc-th-action">Action</span>
            </div>

            {paginatedQuestions.map((q) => {
              const isCompleted = !!solvedMap[q.id];
              const isAttempted = attemptedSet.has(q.id);
              const isBookmarked = bookmarkedSet.has(q.id);

              return (
                <div
                  key={q.id}
                  className={`mc-list-item ${isCompleted ? 'completed' : isAttempted ? 'attempted' : ''}`}
                  onClick={() => selectQuestion(q.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') selectQuestion(q.id); }}
                >
                  <div className="mc-td mc-td-id" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      className={`mc-card-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(q.id);
                      }}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark challenge'}
                      aria-label="Bookmark"
                    >
                      {isBookmarked ? '★' : '☆'}
                    </button>
                    <span className="mc-card-id">{q.id}</span>
                  </div>

                  <div className="mc-td mc-td-title">
                    <div className="mc-list-title-text">{q.title}</div>
                    <div className="mc-list-summary-text">{q.summary}</div>
                  </div>

                  <div className="mc-td mc-td-category">
                    <span className="mc-cat-pill">{q.category}</span>
                  </div>

                  <div className="mc-td mc-td-diff">
                    <span className={`mc-badge ${q.difficulty.toLowerCase()}`}>
                      {q.difficulty}
                    </span>
                  </div>

                  <div className="mc-td mc-td-time">
                    <span className="mc-list-time-val">⏱️ {q.timeEstimate}</span>
                  </div>

                  <div className="mc-td mc-td-status">
                    {isCompleted ? (
                      <span className="mc-status-pill completed">✓ Solved</span>
                    ) : isAttempted ? (
                      <span className="mc-status-pill attempted">● Attempted</span>
                    ) : (
                      <span className="mc-status-pill pending">○ Ready</span>
                    )}
                  </div>

                  <div className="mc-td mc-td-action" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="mc-btn-primary mc-btn-list-action"
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
        )}

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
