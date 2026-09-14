import { useState, useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { executePlayground, type PlaygroundLogItem } from '../services/docsPlaygroundRunner';

export interface PlaygroundSnippetPreset {
  id: string;
  title: string;
  language: string;
  code: string;
}

export interface DocsInteractivePlaygroundProps {
  topicTitle: string;
  subjectTitle: string;
  presets: PlaygroundSnippetPreset[];
  activeSnippetOverride?: PlaygroundSnippetPreset;
  onClearOverride?: () => void;
}

export function DocsInteractivePlayground({
  topicTitle,
  subjectTitle,
  presets = [],
  activeSnippetOverride,
  onClearOverride,
}: DocsInteractivePlaygroundProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    activeSnippetOverride ? activeSnippetOverride.id : presets[0]?.id || 'default'
  );
  const [code, setCode] = useState<string>(
    activeSnippetOverride ? activeSnippetOverride.code : presets[0]?.code || '// Write code here\nconsole.log("Hello from Docs Playground!");'
  );
  const [language, setLanguage] = useState<string>(
    activeSnippetOverride ? activeSnippetOverride.language : presets[0]?.language || 'javascript'
  );
  const [logs, setLogs] = useState<PlaygroundLogItem[]>([]);
  const [previewSrcDoc, setPreviewSrcDoc] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'console' | 'preview'>('console');
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync when active snippet override changes from an external section click
  useEffect(() => {
    if (activeSnippetOverride) {
      setSelectedPresetId(activeSnippetOverride.id);
      setCode(activeSnippetOverride.code);
      setLanguage(activeSnippetOverride.language || 'javascript');
      setLogs([]);
      setPreviewSrcDoc(null);
      setHasRun(false);
    }
  }, [activeSnippetOverride]);

  // Sync when presets change or topic changes
  useEffect(() => {
    if (!activeSnippetOverride && presets.length > 0) {
      setSelectedPresetId(presets[0].id);
      setCode(presets[0].code);
      setLanguage(presets[0].language || 'javascript');
      setLogs([]);
      setPreviewSrcDoc(null);
      setHasRun(false);
    }
  }, [topicTitle, presets, activeSnippetOverride]);

  const handleSelectPreset = (preset: PlaygroundSnippetPreset) => {
    if (onClearOverride) onClearOverride();
    setSelectedPresetId(preset.id);
    setCode(preset.code);
    setLanguage(preset.language || 'javascript');
    setLogs([]);
    setPreviewSrcDoc(null);
    setHasRun(false);
  };

  const handleReset = () => {
    const current = presets.find(p => p.id === selectedPresetId) || presets[0];
    if (current) {
      setCode(current.code);
      setLanguage(current.language || 'javascript');
      setLogs([]);
      setPreviewSrcDoc(null);
      setHasRun(false);
    }
  };

  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    try {
      const result = await executePlayground(code, language);
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
  }, [code, language, isRunning]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
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

  const monacoLanguage = language.toLowerCase().includes('html')
    ? 'html'
    : language.toLowerCase().includes('typescript') || language.toLowerCase().includes('ts')
    ? 'typescript'
    : 'javascript';

  return (
    <div
      className={`docs-playground-card ${isFullscreen ? 'is-fullscreen' : ''}`}
      id="interactive-playground-section"
      onKeyDown={handleKeyDown}
    >
      {/* Playground Header Bar */}
      <div className="dpc-header">
        <div className="dpc-header-left">
          <div className="dpc-brand">
            <span className="dpc-icon">⚡</span>
            <span className="dpc-title">Interactive Code Playground</span>
            <span className="dpc-badge">{subjectTitle.toUpperCase()}</span>
          </div>
          <span className="dpc-subtitle">
            Edit &amp; execute code in real-time. Hotkey: <kbd className="dpc-kbd">Ctrl+Enter</kbd>
          </span>
        </div>

        <div className="dpc-header-right">
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
            {isRunning ? '⏳ Running...' : '▶ Run Code'}
          </button>
        </div>
      </div>

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
            <span className="dpc-pane-tag">SOURCE EDITOR ({monacoLanguage.toUpperCase()})</span>
            <span className="dpc-pane-tip">Type or modify code freely</span>
          </div>
          <div className="dpc-monaco-wrapper">
            <Editor
              height="100%"
              language={monacoLanguage}
              theme="vs-dark"
              value={code}
              onChange={val => setCode(val || '')}
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
                className={`dpc-tab-btn ${activeTab === 'console' ? 'active' : ''}`}
                onClick={() => setActiveTab('console')}
              >
                <span className="tab-icon">💻</span>
                <span>Console Output</span>
                {logs.length > 0 && <span className="tab-count">({logs.length})</span>}
              </button>
              {previewSrcDoc && (
                <button
                  type="button"
                  className={`dpc-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('preview')}
                >
                  <span className="tab-icon">🌐</span>
                  <span>Live DOM Preview</span>
                </button>
              )}
            </div>

            <div className="dpc-output-meta">
              {executionTime !== null && (
                <span className="dpc-timer-badge">⏱️ {executionTime}ms</span>
              )}
              {logs.length > 0 && (
                <button
                  type="button"
                  className="dpc-clear-btn"
                  onClick={() => {
                    setLogs([]);
                    setPreviewSrcDoc(null);
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
            {activeTab === 'console' ? (
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
            ) : (
              <div className="dpc-preview-frame-wrap">
                {previewSrcDoc ? (
                  <iframe
                    className="dpc-preview-iframe"
                    srcDoc={previewSrcDoc}
                    title="Playground Live Component Preview"
                    sandbox="allow-scripts allow-modals allow-same-origin"
                  />
                ) : (
                  <div className="dpc-empty-console">
                    <span className="dec-icon">🌐</span>
                    <p className="dec-title">No Visual Preview</p>
                    <p className="dec-sub">This snippet executes in standard console mode.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
