import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Editor from '@monaco-editor/react';
import {
  executePlayground,
  generateDefaultHtmlForCss,
  type PlaygroundLogItem,
} from '../services/docsPlaygroundRunner';
import {
  docsAiAssistantService,
  type DocsAiResponse,
} from '../services/docsAiAssistantService';
import { SafeMarkdownViewer } from './common/SafeMarkdownViewer';

export interface PlaygroundSnippetPreset {
  id: string;
  title: string;
  language: string;
  code: string;
}

export interface DocsInteractivePlaygroundProps {
  topicTitle: string;
  subjectTitle: string;
  subjectId?: string;
  presets: PlaygroundSnippetPreset[];
  activeSnippetOverride?: PlaygroundSnippetPreset;
  onClearOverride?: () => void;
}

export function DocsInteractivePlayground({
  topicTitle,
  subjectTitle,
  subjectId,
  presets = [],
  activeSnippetOverride,
  onClearOverride,
}: DocsInteractivePlaygroundProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    activeSnippetOverride ? activeSnippetOverride.id : presets[0]?.id || 'default'
  );
  const [code, setCode] = useState<string>(
    activeSnippetOverride
      ? activeSnippetOverride.code
      : presets[0]?.code || '// Write code here\nconsole.log("Hello from Docs Playground!");'
  );
  const [language, setLanguage] = useState<string>(
    activeSnippetOverride ? activeSnippetOverride.language : presets[0]?.language || 'javascript'
  );

  // Respective CSS Studio States
  const isCssSubject = useMemo(() => {
    return (
      subjectId === 'css' ||
      subjectId === 'advanced-css' ||
      subjectId === 'tailwind' ||
      language.toLowerCase().includes('css') ||
      subjectTitle.toLowerCase().includes('css')
    );
  }, [subjectId, language, subjectTitle]);

  const [activeFileTab, setActiveFileTab] = useState<'css' | 'html'>('css');
  const [companionHtml, setCompanionHtml] = useState<string>(() =>
    generateDefaultHtmlForCss(
      activeSnippetOverride ? activeSnippetOverride.code : presets[0]?.code || ''
    )
  );
  const [canvasTheme, setCanvasTheme] = useState<'dark' | 'light'>('dark');

  // Execution & Output states
  const [logs, setLogs] = useState<PlaygroundLogItem[]>([]);
  const [previewSrcDoc, setPreviewSrcDoc] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'console' | 'preview'>(
    isCssSubject ? 'preview' : 'console'
  );
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // AI & Ollama States
  const [ollamaInfo, setOllamaInfo] = useState<{ available: boolean; modelName?: string; message: string }>({
    available: false,
    message: 'Checking AI Engine...',
  });
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiMode, setAiMode] = useState<'suggest' | 'review' | 'custom'>('suggest');
  const [aiResponse, setAiResponse] = useState<DocsAiResponse | null>(null);
  const [customAiPrompt, setCustomAiPrompt] = useState('');
  const [aiAppliedToast, setAiAppliedToast] = useState<string | null>(null);

  // Probe Ollama status on mount
  useEffect(() => {
    docsAiAssistantService.checkStatus().then(info => {
      setOllamaInfo(info);
    });
  }, []);

  // Handle ESC key to exit fullscreen smoothly
  useEffect(() => {
    if (!isFullscreen) return;
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isFullscreen]);

  // Lock body scroll when fullscreen is active to avoid background movement
  useEffect(() => {
    if (isFullscreen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isFullscreen]);

  // Core execution handler
  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    try {
      const result = await executePlayground(code, language, {
        companionHtml: isCssSubject ? companionHtml : undefined,
        canvasTheme: canvasTheme,
      });
      setLogs(result.logs);
      setExecutionTime(result.executionTimeMs);
      setHasRun(true);

      if (result.isVisual && result.previewSrcDoc) {
        setPreviewSrcDoc(result.previewSrcDoc);
        setActiveTab('preview');
      } else {
        setPreviewSrcDoc(null);
        setActiveTab('console');
      }
    } catch (err: any) {
      setLogs([
        {
          id: `err-${Date.now()}`,
          level: 'error',
          parts: [err?.message || 'Execution failed'],
          timestamp: Date.now(),
        },
      ]);
      setActiveTab('console');
    } finally {
      setIsRunning(false);
    }
  }, [code, language, isRunning, isCssSubject, companionHtml, canvasTheme]);

  // Auto-run for CSS on initial render or canvas theme change so user immediately sees styled elements
  useEffect(() => {
    if (isCssSubject) {
      handleRun();
    }
  }, [isCssSubject, canvasTheme]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync when active snippet override changes from an external section click
  useEffect(() => {
    if (activeSnippetOverride) {
      setSelectedPresetId(activeSnippetOverride.id);
      setCode(activeSnippetOverride.code);
      setLanguage(activeSnippetOverride.language || (isCssSubject ? 'css' : 'javascript'));
      setLogs([]);
      setHasRun(false);

      if (isCssSubject) {
        const newHtml = generateDefaultHtmlForCss(activeSnippetOverride.code);
        setCompanionHtml(newHtml);
        executePlayground(activeSnippetOverride.code, 'css', { companionHtml: newHtml, canvasTheme }).then(res => {
          if (res.previewSrcDoc) {
            setPreviewSrcDoc(res.previewSrcDoc);
            setActiveTab('preview');
          }
        });
      }
    }
  }, [activeSnippetOverride, isCssSubject, canvasTheme]);

  // Sync when presets change or topic changes
  useEffect(() => {
    if (!activeSnippetOverride && presets.length > 0) {
      const first = presets[0];
      setSelectedPresetId(first.id);
      setCode(first.code);
      setLanguage(first.language || (isCssSubject ? 'css' : 'javascript'));
      setLogs([]);
      setHasRun(false);

      if (isCssSubject) {
        const newHtml = generateDefaultHtmlForCss(first.code);
        setCompanionHtml(newHtml);
        executePlayground(first.code, 'css', { companionHtml: newHtml, canvasTheme }).then(res => {
          if (res.previewSrcDoc) {
            setPreviewSrcDoc(res.previewSrcDoc);
            setActiveTab('preview');
          }
        });
      }
    }
  }, [topicTitle, presets, activeSnippetOverride, isCssSubject, canvasTheme]);

  // Listen for console logs and runtime errors forwarded from the sandboxed preview iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.t === 'log') {
        const parts = Array.isArray(e.data.parts) ? e.data.parts : [String(e.data.parts || '')];
        const newLog: PlaygroundLogItem = {
          id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          level: (e.data.level as any) || 'log',
          parts,
          timestamp: Date.now(),
        };
        setLogs(prev => [...prev, newLog]);
      } else if (e.data.t === 'error') {
        const newLog: PlaygroundLogItem = {
          id: `err-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          level: 'error',
          parts: [e.data.message || 'Runtime Error'],
          timestamp: Date.now(),
        };
        setLogs(prev => [...prev, newLog]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleSelectPreset = (preset: PlaygroundSnippetPreset) => {
    if (onClearOverride) onClearOverride();
    setSelectedPresetId(preset.id);
    setCode(preset.code);
    setLanguage(preset.language || (isCssSubject ? 'css' : 'javascript'));
    setLogs([]);
    setHasRun(false);

    if (isCssSubject) {
      const newHtml = generateDefaultHtmlForCss(preset.code);
      setCompanionHtml(newHtml);
      executePlayground(preset.code, 'css', { companionHtml: newHtml, canvasTheme }).then(res => {
        if (res.previewSrcDoc) {
          setPreviewSrcDoc(res.previewSrcDoc);
          setActiveTab('preview');
        }
      });
    }
  };

  const handleReset = () => {
    const current = presets.find(p => p.id === selectedPresetId) || presets[0];
    if (current) {
      setCode(current.code);
      setLanguage(current.language || (isCssSubject ? 'css' : 'javascript'));
      setLogs([]);
      setHasRun(false);

      if (isCssSubject) {
        const newHtml = generateDefaultHtmlForCss(current.code);
        setCompanionHtml(newHtml);
        executePlayground(current.code, 'css', { companionHtml: newHtml, canvasTheme }).then(res => {
          if (res.previewSrcDoc) {
            setPreviewSrcDoc(res.previewSrcDoc);
            setActiveTab('preview');
          }
        });
      }
    }
  };

  const handleCopy = () => {
    const textToCopy = isCssSubject && activeFileTab === 'html' ? companionHtml : code;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Keyboard shortcut Ctrl+Enter or Cmd+Enter to execute
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
    }
  };

  // AI Suggestion & Recommendations trigger
  const handleTriggerAiSuggestions = async (customQuery?: string) => {
    setIsAiOpen(true);
    setIsAiLoading(true);
    setAiMode(customQuery ? 'custom' : 'suggest');
    try {
      const res = await docsAiAssistantService.getRecommendations({
        subjectTitle,
        topicTitle,
        code,
        language: isCssSubject ? 'css' : language,
        customPrompt: customQuery,
      });
      setAiResponse(res);
    } catch (err: any) {
      console.warn('AI suggestions error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // AI Code Review trigger
  const handleTriggerAiReview = async () => {
    setIsAiOpen(true);
    setIsAiLoading(true);
    setAiMode('review');
    try {
      const res = await docsAiAssistantService.getCodeReview({
        subjectTitle,
        topicTitle,
        code,
        language: isCssSubject ? 'css' : language,
      });
      setAiResponse(res);
    } catch (err: any) {
      console.warn('AI review error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Apply AI Suggestion directly into the editor
  const handleApplyAiSnippet = () => {
    if (!aiResponse?.suggestedSnippet) return;
    setCode(aiResponse.suggestedSnippet);
    if (isCssSubject) {
      setActiveFileTab('css');
    }
    setAiAppliedToast('✓ Applied AI Optimized Code to Editor!');
    setTimeout(() => setAiAppliedToast(null), 3000);
    // Auto-run updated snippet
    setTimeout(() => {
      handleRun();
    }, 100);
  };

  // Monaco language mode selection
  const monacoLanguage = useMemo(() => {
    if (isCssSubject) {
      return activeFileTab === 'html' ? 'html' : 'css';
    }
    const norm = language.toLowerCase();
    if (norm.includes('html')) return 'html';
    if (norm.includes('typescript') || norm.includes('ts')) return 'typescript';
    return 'javascript';
  }, [isCssSubject, activeFileTab, language]);

  const activeEditorCode = isCssSubject && activeFileTab === 'html' ? companionHtml : code;
  const handleEditorChange = (val: string | undefined) => {
    const text = val || '';
    if (isCssSubject && activeFileTab === 'html') {
      setCompanionHtml(text);
    } else {
      setCode(text);
    }
  };

  const playgroundCard = (
    <div
      className={`docs-playground-card ${isFullscreen ? 'is-fullscreen' : ''} ${isCssSubject ? 'css-playground-mode' : ''}`}
      onKeyDown={handleKeyDown}
    >
      {/* Playground Header Bar */}
      <div className="dpc-header">
        <div className="dpc-header-left">
          <div className="dpc-brand">
            <span className="dpc-icon">{isCssSubject ? '🎨' : '⚡'}</span>
            <span className="dpc-title">
              {isCssSubject ? 'Interactive CSS Styling Studio' : 'Interactive Code Playground'}
            </span>
            <span className="dpc-badge">{subjectTitle.toUpperCase()}</span>
          </div>
          <span className="dpc-subtitle">
            {isCssSubject
              ? 'Edit CSS rules & live companion HTML with instant visual styling preview.'
              : `Edit & execute code in real-time. Hotkey: Ctrl+Enter`}
          </span>
        </div>

        <div className="dpc-header-right">
          {/* AI Status Badge */}
          <div
            className={`dpc-ai-status-pill ${ollamaInfo.available ? 'online' : 'fallback'}`}
            title={ollamaInfo.message}
          >
            <span>{ollamaInfo.available ? '🟢' : '🤖'}</span>
            <span>{ollamaInfo.available ? `Ollama (${ollamaInfo.modelName || 'Local LLM'})` : 'AI Assistant Ready'}</span>
          </div>

          <button
            type="button"
            className="dpc-btn dpc-btn-secondary"
            onClick={handleCopy}
            title="Copy code to clipboard"
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>

          <button
            type="button"
            className="dpc-btn dpc-btn-secondary"
            onClick={handleReset}
            title="Reset code to original snippet"
          >
            ↺ Reset
          </button>

          <button
            type="button"
            className="dpc-btn dpc-btn-secondary"
            onClick={() => setIsFullscreen(prev => !prev)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand to Fullscreen'}
          >
            {isFullscreen ? '✕ Exit' : '⛶ Fullscreen'}
          </button>

          <button
            type="button"
            className={`dpc-btn dpc-btn-primary ${isRunning ? 'is-running' : ''}`}
            onClick={handleRun}
            disabled={isRunning}
            title="Run code (Ctrl+Enter)"
          >
            {isRunning ? '⏳ Running...' : isCssSubject ? '▶ Apply & Preview' : '▶ Run Code'}
          </button>
        </div>
      </div>

      {/* AI Assistant Quick Actions Bar */}
      <div className="dpc-ai-action-bar">
        <div className="dpc-ai-actions-left">
          <button
            type="button"
            className={`dpc-ai-action-btn ${isAiOpen && aiMode === 'suggest' ? 'active' : ''}`}
            onClick={() => {
              if (isAiOpen && aiMode === 'suggest') {
                setIsAiOpen(false);
              } else {
                handleTriggerAiSuggestions();
              }
            }}
            title="Ask Ollama for modern recommendations, next concepts to master, and code improvements"
          >
            <span>💡</span>
            <span>AI Suggestion &amp; Recommended Concepts</span>
          </button>

          <button
            type="button"
            className={`dpc-ai-action-btn ${isAiOpen && aiMode === 'review' ? 'active' : ''}`}
            onClick={() => {
              if (isAiOpen && aiMode === 'review') {
                setIsAiOpen(false);
              } else {
                handleTriggerAiReview();
              }
            }}
            title="Ask Ollama for a senior FAANG technical code review with score & gotchas"
          >
            <span>🔍</span>
            <span>AI Senior Code Review</span>
          </button>

          {isAiOpen && (
            <button
              type="button"
              className="dpc-ai-action-btn close"
              onClick={() => setIsAiOpen(false)}
              title="Close AI Assistant drawer"
            >
              ✕ Close AI Panel
            </button>
          )}
        </div>

        {aiAppliedToast && (
          <div className="dpc-ai-toast">
            {aiAppliedToast}
          </div>
        )}
      </div>

      {/* Collapsible AI Assistant Drawer */}
      {isAiOpen && (
        <div className="dpc-ai-drawer">
          <div className="dpc-ai-drawer-header">
            <div className="dpc-ai-title-row">
              <span className="dpc-ai-badge">
                {aiMode === 'review' ? '🔍 TECHNICAL CODE REVIEW' : '💡 OLLAMA ARCHITECT RECOMMENDATIONS'}
              </span>
              {aiResponse?.score !== undefined && (
                <span
                  className="dpc-ai-score-pill"
                  style={{
                    background: aiResponse.score >= 90 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: aiResponse.score >= 90 ? '#34d399' : '#fbbf24',
                    border: `1px solid ${aiResponse.score >= 90 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                  }}
                >
                  Score: {aiResponse.score}/100 • {aiResponse.verdict}
                </span>
              )}
              {aiResponse && (
                <span className="dpc-ai-meta">
                  Engine: {aiResponse.modelUsed} ({aiResponse.latencyMs}ms)
                </span>
              )}
            </div>

            <div className="dpc-ai-header-controls">
              {aiResponse?.suggestedSnippet && (
                <button
                  type="button"
                  className="dpc-ai-apply-btn"
                  onClick={handleApplyAiSnippet}
                  title="Replace editor code with the AI refactored snippet"
                >
                  ✨ Apply AI Code to Editor
                </button>
              )}
              <button
                type="button"
                className="dpc-ai-close-icon"
                onClick={() => setIsAiOpen(false)}
              >
                ✕
              </button>
            </div>
          </div>

          <div className="dpc-ai-drawer-body">
            {isAiLoading ? (
              <div className="dpc-ai-loading">
                <span className="dpc-ai-spinner">⏳</span>
                <p>Ollama is evaluating code architecture and synthesizing recommendations...</p>
              </div>
            ) : aiResponse ? (
              <div className="dpc-ai-markdown-wrap">
                <SafeMarkdownViewer content={aiResponse.markdown} />
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>Click an action above to generate suggestions or code reviews.</p>
            )}

            {/* Ask Ollama Custom Question Row */}
            <div className="dpc-ai-ask-row">
              <input
                type="text"
                className="dpc-ai-prompt-input"
                placeholder={`Ask Ollama about this ${subjectTitle} code (e.g., "How to center this with CSS grid?", "Add hover animation", "Make responsive")...`}
                value={customAiPrompt}
                onChange={e => setCustomAiPrompt(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && customAiPrompt.trim()) {
                    handleTriggerAiSuggestions(customAiPrompt.trim());
                  }
                }}
              />
              <button
                type="button"
                className="dpc-ai-ask-btn"
                disabled={isAiLoading || !customAiPrompt.trim()}
                onClick={() => {
                  if (customAiPrompt.trim()) {
                    handleTriggerAiSuggestions(customAiPrompt.trim());
                  }
                }}
              >
                Ask Ollama →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preset Snippets Switcher Strip */}
      {presets.length > 1 && (
        <div className="dpc-presets-strip">
          <span className="dpc-presets-label">Code Examples:</span>
          <div className="dpc-presets-pills">
            {presets.map(p => {
              const isActive = p.id === selectedPresetId;
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`dpc-preset-pill ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectPreset(p)}
                >
                  <span className="pill-dot" />
                  <span className="pill-title">{p.title}</span>
                  <span className="pill-lang">{p.language}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Split Body: Editor on Left, Console/Preview on Right */}
      <div className="dpc-split-body">
        {/* Left Pane: Code Editor */}
        <div className="dpc-editor-pane">
          <div className="dpc-pane-title-bar">
            {isCssSubject ? (
              /* Respective CSS Dual File Tabs (styles.css & index.html) */
              <div className="dpc-file-tabs">
                <button
                  type="button"
                  className={`dpc-file-tab ${activeFileTab === 'css' ? 'active' : ''}`}
                  onClick={() => setActiveFileTab('css')}
                >
                  <span>🎨</span>
                  <span>styles.css</span>
                </button>
                <button
                  type="button"
                  className={`dpc-file-tab ${activeFileTab === 'html' ? 'active' : ''}`}
                  onClick={() => setActiveFileTab('html')}
                >
                  <span>📄</span>
                  <span>index.html</span>
                </button>
              </div>
            ) : (
              <span className="dpc-pane-tag">SOURCE EDITOR ({monacoLanguage.toUpperCase()})</span>
            )}
            <span className="dpc-pane-tip">
              {isCssSubject
                ? activeFileTab === 'css'
                  ? 'Edit CSS rules'
                  : 'Edit companion HTML elements'
                : 'Type or modify code freely'}
            </span>
          </div>

          <div className="dpc-monaco-wrapper">
            <Editor
              height="100%"
              language={monacoLanguage}
              theme="vs-dark"
              value={activeEditorCode}
              onChange={handleEditorChange}
              options={{
                fontSize: 13.5,
                lineHeight: 20,
                fontFamily: 'JetBrains Mono, Fira Code, Menlo, monospace',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                automaticLayout: true,
                padding: { top: 12, bottom: 12 },
                tabSize: 2,
                wordWrap: 'on',
              }}
            />
          </div>
        </div>

        {/* Right Pane: Console Output & Visual Preview */}
        <div className="dpc-output-pane">
          <div className="dpc-output-tabs-bar">
            <div className="dpc-tabs-group">
              <button
                type="button"
                className={`dpc-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                onClick={() => setActiveTab('preview')}
              >
                <span className="tab-icon">👁️</span>
                <span>Live Preview</span>
              </button>

              <button
                type="button"
                className={`dpc-tab-btn ${activeTab === 'console' ? 'active' : ''}`}
                onClick={() => setActiveTab('console')}
              >
                <span className="tab-icon">💻</span>
                <span>Console &amp; Diagnostics</span>
                {logs.length > 0 && <span className="tab-count">({logs.length})</span>}
              </button>
            </div>

            <div className="dpc-output-meta">
              {isCssSubject && (
                <button
                  type="button"
                  className="dpc-canvas-toggle"
                  onClick={() => setCanvasTheme(t => (t === 'dark' ? 'light' : 'dark'))}
                  title="Toggle preview canvas background between dark and light"
                >
                  {canvasTheme === 'dark' ? '🌓 Dark Canvas' : '☀️ Light Canvas'}
                </button>
              )}

              {executionTime !== null && (
                <span className="dpc-timer-badge">⏱️ {executionTime}ms</span>
              )}

              {logs.length > 0 && (
                <button
                  type="button"
                  className="dpc-clear-btn"
                  onClick={() => {
                    setLogs([]);
                    setHasRun(false);
                  }}
                  title="Clear Console Output"
                >
                  Clear Logs
                </button>
              )}
            </div>
          </div>

          <div className="dpc-output-content">
            {activeTab === 'preview' ? (
              <div className={`dpc-preview-frame-wrap canvas-${canvasTheme}`}>
                {previewSrcDoc ? (
                  <iframe
                    className="dpc-preview-iframe"
                    srcDoc={previewSrcDoc}
                    title="Playground Live Visual Preview"
                    sandbox="allow-scripts allow-modals allow-same-origin"
                  />
                ) : (
                  <div className="dpc-empty-console">
                    <span className="dec-icon">🌐</span>
                    <p className="dec-title">Preview Rendering</p>
                    <p className="dec-sub">Click <strong>▶ Apply &amp; Preview</strong> to compile CSS into the DOM.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="dpc-console-scroll">
                {!hasRun && logs.length === 0 ? (
                  <div className="dpc-empty-console">
                    <span className="dec-icon">▶</span>
                    <p className="dec-title">Ready for Execution</p>
                    <p className="dec-sub">
                      Click <strong>▶ Run Code</strong> or press <kbd>Ctrl+Enter</kbd> to execute this snippet and inspect logs.
                    </p>
                  </div>
                ) : logs.length === 0 ? (
                  <div className="dpc-empty-console">
                    <span className="dec-icon">✓</span>
                    <p className="dec-title">Execution Complete</p>
                    <p className="dec-sub">Code finished with no log output.</p>
                  </div>
                ) : (
                  <div className="dpc-logs-list">
                    {logs.map((item, idx) => (
                      <div key={item.id || idx} className={`dpc-log-row log-${item.level}`}>
                        <span className="dpc-log-prefix">
                          {item.level === 'error'
                            ? '❌ [Error]'
                            : item.level === 'warn'
                            ? '⚠️ [Warn]'
                            : item.level === 'info'
                            ? 'ℹ️ [Info]'
                            : '› [Log]'}
                        </span>
                        <div className="dpc-log-body">
                          {item.parts.map((p, pIdx) => (
                            <pre key={pIdx} className="dpc-log-text">{p}</pre>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isFullscreen ? (
        <>
          <div className="docs-playground-placeholder">
            <div className="dpc-placeholder-inner">
              <div className="dpc-placeholder-info">
                <span className="dpc-placeholder-icon">{isCssSubject ? '🎨' : '⚡'}</span>
                <div>
                  <div className="dpc-placeholder-title">
                    {isCssSubject ? 'CSS Styling Studio' : 'Interactive Playground'} is open in Fullscreen Mode
                  </div>
                  <div className="dpc-placeholder-desc">
                    Working in expanded view. Press <kbd className="dpc-kbd">Esc</kbd> or click to restore.
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="dpc-btn dpc-btn-secondary"
                onClick={() => setIsFullscreen(false)}
              >
                ✕ Restore Inline
              </button>
            </div>
          </div>
          {createPortal(
            <div
              className="docs-playground-fullscreen-overlay"
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsFullscreen(false);
              }}
            >
              {playgroundCard}
            </div>,
            document.body
          )}
        </>
      ) : (
        playgroundCard
      )}
    </>
  );
}
