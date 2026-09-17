/**
 * Collaborative Meeting Code Editor Component
 * Phase 7: Real-Time Collaborative Monaco Code Editor & Execution Sandbox
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import type {
  MeetingEditorDocument,
  SupportedLanguage,
  ProblemTemplate,
} from '../../../../server/meetings/editorTypes.ts';
import { editorClientService } from '../services/editorClientService';

interface MeetingCodeEditorProps {
  meetingId: string;
  meetingToken: string;
  currentUserId: string;
  currentUserName: string;
  currentUserRole: string; // 'HOST' | 'CO_HOST' | 'PARTICIPANT' | 'VIEWER'
  onClose: () => void;
}

const SUPPORTED_LANGUAGES: { label: string; value: SupportedLanguage }[] = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'JSON', value: 'json' },
  { label: 'SQL', value: 'sql' },
  { label: 'C++', value: 'cpp' },
  { label: 'Java', value: 'java' },
  { label: 'Go', value: 'go' },
];

export const MeetingCodeEditor: React.FC<MeetingCodeEditorProps> = ({
  meetingId,
  meetingToken,
  currentUserId,
  currentUserName,
  currentUserRole,
  onClose,
}) => {
  const [document, setDocument] = useState<MeetingEditorDocument | null>(null);
  const [templates, setTemplates] = useState<ProblemTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('two-sum');
  const [isLoading, setIsLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeConsoleTab, setActiveConsoleTab] = useState<'output' | 'tests'>('output');
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const [localCode, setLocalCode] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('Syncing...');

  const editorRef = useRef<any>(null);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLocalEditRef = useRef(false);

  const canManageLock = currentUserRole === 'HOST' || currentUserRole === 'CO_HOST';

  // 1. Initial Snapshot Fetch
  useEffect(() => {
    let isMounted = true;
    async function loadEditor() {
      try {
        setIsLoading(true);
        const { document: doc, templates: tmpls } = await editorClientService.getSnapshot(
          meetingId,
          meetingToken
        );
        if (isMounted) {
          setDocument(doc);
          setLocalCode(doc.code);
          setTemplates(tmpls);
          if (doc.problemTemplateId) {
            setSelectedTemplateId(doc.problemTemplateId);
          }
          setStatusMessage(`Synced (v${doc.version})`);
        }
      } catch (err) {
        console.error('[MeetingCodeEditor] Failed to fetch editor snapshot:', err);
        if (isMounted) {
          setStatusMessage('Sync failed');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadEditor();
    return () => {
      isMounted = false;
    };
  }, [meetingId, meetingToken]);

  // 2. Real-Time BroadcastChannel Subscription
  useEffect(() => {
    const unsubscribe = editorClientService.subscribe(meetingId, message => {
      if (message.userId === currentUserId && message.type === 'CODE_CHANGED') {
        // Skip echo of own code changes
        return;
      }

      if (message.document) {
        setDocument(message.document);
        setStatusMessage(`Synced (v${message.document.version})`);

        if (message.type === 'CODE_CHANGED' || message.type === 'TEMPLATE_LOADED' || message.type === 'CODE_RESET') {
          if (!isLocalEditRef.current) {
            setLocalCode(message.document.code);
          }
        }
      }

      if (message.result) {
        setDocument(prev => (prev ? { ...prev, latestExecution: message.result } : prev));
        setIsConsoleOpen(true);
        if (message.result.testCases && message.result.testCases.length > 0) {
          setActiveConsoleTab('tests');
        } else {
          setActiveConsoleTab('output');
        }
      }
    });

    return () => {
      unsubscribe();
      editorClientService.cleanup(meetingId);
    };
  }, [meetingId, currentUserId]);

  // 3. Handle Local Code Change with Debounced Server Sync
  const handleCodeChange = useCallback(
    (newCode: string | undefined) => {
      if (newCode === undefined || document?.readOnly) return;

      isLocalEditRef.current = true;
      setLocalCode(newCode);
      setStatusMessage('Saving...');

      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      syncTimeoutRef.current = setTimeout(async () => {
        try {
          const updatedDoc = await editorClientService.syncCode(
            meetingId,
            meetingToken,
            newCode,
            currentUserId,
            currentUserName
          );
          setDocument(updatedDoc);
          setStatusMessage(`Synced (v${updatedDoc.version})`);
        } catch (err) {
          console.error('[MeetingCodeEditor] Sync failed:', err);
          setStatusMessage('Failed to save');
        } finally {
          isLocalEditRef.current = false;
        }
      }, 400);
    },
    [meetingId, meetingToken, currentUserId, currentUserName, document?.readOnly]
  );

  // 4. Change Language
  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as SupportedLanguage;
    try {
      setStatusMessage('Changing language...');
      const updatedDoc = await editorClientService.setLanguage(
        meetingId,
        meetingToken,
        newLang,
        currentUserId,
        currentUserName,
        false
      );
      setDocument(updatedDoc);
      setLocalCode(updatedDoc.code);
      setStatusMessage(`Language set to ${newLang} (v${updatedDoc.version})`);
    } catch (err) {
      console.error('[MeetingCodeEditor] Failed to set language:', err);
      setStatusMessage('Language change failed');
    }
  };

  // 5. Load Template
  const handleLoadTemplate = async (templateId: string) => {
    try {
      setSelectedTemplateId(templateId);
      setStatusMessage('Loading template...');
      const { document: updatedDoc } = await editorClientService.loadTemplate(
        meetingId,
        meetingToken,
        templateId,
        currentUserId,
        currentUserName
      );
      setDocument(updatedDoc);
      setLocalCode(updatedDoc.code);
      setStatusMessage(`Template loaded (v${updatedDoc.version})`);
    } catch (err) {
      console.error('[MeetingCodeEditor] Failed to load template:', err);
      setStatusMessage('Failed to load template');
    }
  };

  // 6. Toggle Read-Only Lock (Host only)
  const handleToggleLock = async () => {
    if (!canManageLock || !document) return;
    try {
      const nextLockState = !document.readOnly;
      setStatusMessage(nextLockState ? 'Locking editor...' : 'Unlocking editor...');
      const updatedDoc = await editorClientService.toggleLock(
        meetingId,
        meetingToken,
        nextLockState,
        currentUserId,
        currentUserName
      );
      setDocument(updatedDoc);
      setStatusMessage(nextLockState ? 'Editor Locked for Candidates' : 'Editor Unlocked (v' + updatedDoc.version + ')');
    } catch (err) {
      console.error('[MeetingCodeEditor] Failed to toggle lock:', err);
      setStatusMessage('Failed to update lock');
    }
  };

  // 7. Reset Code
  const handleResetCode = async () => {
    if (!window.confirm('Reset code back to original starter template?')) return;
    try {
      setStatusMessage('Resetting code...');
      const updatedDoc = await editorClientService.resetCode(
        meetingId,
        meetingToken,
        currentUserId,
        currentUserName
      );
      setDocument(updatedDoc);
      setLocalCode(updatedDoc.code);
      setStatusMessage(`Code reset (v${updatedDoc.version})`);
    } catch (err) {
      console.error('[MeetingCodeEditor] Failed to reset code:', err);
      setStatusMessage('Reset failed');
    }
  };

  // 8. Run Code
  const handleRunCode = async () => {
    try {
      setIsExecuting(true);
      setStatusMessage('Executing code...');
      const result = await editorClientService.runCode(
        meetingId,
        meetingToken,
        localCode,
        currentUserId,
        currentUserName
      );
      setDocument(prev => (prev ? { ...prev, latestExecution: result } : prev));
      setIsConsoleOpen(true);
      if (result.testCases && result.testCases.length > 0) {
        setActiveConsoleTab('tests');
      } else {
        setActiveConsoleTab('output');
      }
      setStatusMessage(
        result.success
          ? `Executed in ${result.durationMs}ms`
          : 'Execution completed with error'
      );
    } catch (err) {
      console.error('[MeetingCodeEditor] Run failed:', err);
      setStatusMessage('Execution request failed');
    } finally {
      setIsExecuting(false);
    }
  };

  // 9. Format Code
  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  const onEditorMount: OnMount = (editor) => {
    editorRef.current = editor;

    // Track cursor presence
    editor.onDidChangeCursorPosition(e => {
      editorClientService.broadcastPresence(
        meetingId,
        currentUserId,
        currentUserName,
        e.position.lineNumber,
        e.position.column
      );
    });
  };

  if (isLoading || !document) {
    return (
      <div className="rtc-editor-loading">
        <div className="rtc-spinner" />
        <span>Initializing Collaborative Code Sandbox...</span>
      </div>
    );
  }

  const latestExecution = document.latestExecution;

  return (
    <div className="rtc-editor-container">
      {/* 1. Editor Toolbar Header */}
      <div className="rtc-editor-toolbar">
        <div className="rtc-editor-toolbar-left">
          {/* Language Selector */}
          <div className="rtc-editor-control-group">
            <span className="rtc-editor-label">Language:</span>
            <select
              className="rtc-editor-select"
              value={document.language}
              onChange={handleLanguageChange}
              disabled={document.readOnly && !canManageLock}
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Problem Template Selector */}
          <div className="rtc-editor-control-group">
            <span className="rtc-editor-label">Problem:</span>
            <select
              className="rtc-editor-select"
              value={selectedTemplateId}
              onChange={e => handleLoadTemplate(e.target.value)}
              disabled={document.readOnly && !canManageLock}
            >
              {templates.map(tmpl => (
                <option key={tmpl.id} value={tmpl.id}>
                  {tmpl.title} ({tmpl.difficulty})
                </option>
              ))}
            </select>
          </div>

          {/* Status & Version Badge */}
          <div className="rtc-editor-status-badge">
            <span className="rtc-editor-status-dot" />
            <span className="rtc-editor-status-text">{statusMessage}</span>
          </div>

          {/* Read-Only Indicator */}
          {document.readOnly && (
            <div className="rtc-editor-locked-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Read-Only</span>
            </div>
          )}
        </div>

        <div className="rtc-editor-toolbar-right">
          {/* Host Lock Control */}
          {canManageLock && (
            <button
              className={`rtc-editor-btn ${document.readOnly ? 'rtc-editor-btn-locked' : 'rtc-editor-btn-secondary'}`}
              onClick={handleToggleLock}
              title={document.readOnly ? 'Unlock editor for participants' : 'Lock editor for candidates'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                {document.readOnly ? (
                  <>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </>
                ) : (
                  <>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                  </>
                )}
              </svg>
              <span>{document.readOnly ? 'Unlock Editor' : 'Lock Editor'}</span>
            </button>
          )}

          {/* Format Code */}
          <button
            className="rtc-editor-btn rtc-editor-btn-secondary"
            onClick={handleFormatCode}
            disabled={document.readOnly}
            title="Auto-format code indentation"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="21" y1="10" x2="3" y2="10" />
              <line x1="21" y1="6" x2="3" y2="6" />
              <line x1="21" y1="14" x2="3" y2="14" />
              <line x1="21" y1="18" x2="3" y2="18" />
            </svg>
            <span>Format</span>
          </button>

          {/* Reset Code */}
          <button
            className="rtc-editor-btn rtc-editor-btn-secondary"
            onClick={handleResetCode}
            disabled={document.readOnly}
            title="Reset to problem template starter"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 2v6h6" />
              <path d="M21 12A9 9 0 0 0 6 5.3L3 8" />
              <path d="M21 22v-6h-6" />
              <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" />
            </svg>
            <span>Reset</span>
          </button>

          {/* Run Code */}
          <button
            className="rtc-editor-btn rtc-editor-btn-primary"
            onClick={handleRunCode}
            disabled={isExecuting}
            title="Run code against test cases"
          >
            {isExecuting ? (
              <>
                <span className="rtc-spinner-small" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Run Code</span>
              </>
            )}
          </button>

          {/* Close Editor */}
          <button
            className="rtc-editor-close-btn"
            onClick={onClose}
            title="Close code editor and return to video grid"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* 2. Main Monaco Editor Body */}
      <div className="rtc-editor-main">
        <div className="rtc-editor-monaco-wrapper">
          <Editor
            height="100%"
            language={document.language}
            value={localCode}
            theme="vs-dark"
            onChange={handleCodeChange}
            onMount={onEditorMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: true,
              scrollBeyondLastLine: false,
              readOnly: document.readOnly,
              automaticLayout: true,
              wordWrap: 'on',
              tabSize: 2,
              suggestOnTriggerCharacters: true,
              formatOnPaste: true,
              padding: { top: 12, bottom: 12 },
            }}
          />
        </div>

        {/* 3. Collapsible Execution Console & Test Runner Drawer */}
        <div className={`rtc-editor-console ${isConsoleOpen ? 'is-open' : 'is-collapsed'}`}>
          <div className="rtc-editor-console-header">
            <div className="rtc-editor-console-tabs">
              <button
                className={`rtc-editor-console-tab ${activeConsoleTab === 'output' ? 'is-active' : ''}`}
                onClick={() => setActiveConsoleTab('output')}
              >
                Output & Logs
              </button>
              <button
                className={`rtc-editor-console-tab ${activeConsoleTab === 'tests' ? 'is-active' : ''}`}
                onClick={() => setActiveConsoleTab('tests')}
              >
                Test Cases
                {latestExecution?.testCases && (
                  <span
                    className={`rtc-editor-test-pill ${
                      latestExecution.allPassed ? 'is-passed' : 'is-failed'
                    }`}
                  >
                    {latestExecution.testCases.filter(t => t.passed).length}/
                    {latestExecution.testCases.length}
                  </span>
                )}
              </button>
            </div>

            <div className="rtc-editor-console-actions">
              {latestExecution && (
                <span className="rtc-editor-duration-badge">
                  {latestExecution.durationMs}ms
                </span>
              )}
              <button
                className="rtc-editor-console-toggle-btn"
                onClick={() => setIsConsoleOpen(prev => !prev)}
                title={isConsoleOpen ? 'Collapse console' : 'Expand console'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {isConsoleOpen ? (
                    <polyline points="6 9 12 15 18 9" />
                  ) : (
                    <polyline points="18 15 12 9 6 15" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {isConsoleOpen && (
            <div className="rtc-editor-console-body">
              {activeConsoleTab === 'output' && (
                <div className="rtc-editor-output-content">
                  {latestExecution ? (
                    <>
                      {latestExecution.error && (
                        <div className="rtc-editor-output-error">
                          <strong>Runtime Error:</strong> {latestExecution.error}
                        </div>
                      )}
                      {latestExecution.output && latestExecution.output.length > 0 ? (
                        latestExecution.output.map((line, idx) => (
                          <div key={idx} className="rtc-editor-output-line">
                            <span className="rtc-editor-output-prompt">&gt;</span> {line}
                          </div>
                        ))
                      ) : (
                        !latestExecution.error && (
                          <div className="rtc-editor-output-empty">
                            No standard output logged.
                          </div>
                        )
                      )}
                      {latestExecution.returnValue !== undefined && (
                        <div className="rtc-editor-output-return">
                          <span className="rtc-editor-return-label">Returned:</span>{' '}
                          <code>{latestExecution.returnValue}</code>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="rtc-editor-output-empty">
                      Click &quot;Run Code&quot; to execute your solution and view real-time console output.
                    </div>
                  )}
                </div>
              )}

              {activeConsoleTab === 'tests' && (
                <div className="rtc-editor-tests-content">
                  {latestExecution?.testCases && latestExecution.testCases.length > 0 ? (
                    <div className="rtc-editor-test-list">
                      {latestExecution.testCases.map((tc, idx) => (
                        <div
                          key={tc.id || idx}
                          className={`rtc-editor-test-card ${
                            tc.passed ? 'is-passed' : 'is-failed'
                          }`}
                        >
                          <div className="rtc-editor-test-card-header">
                            <div className="rtc-editor-test-name">
                              <span className={`rtc-test-status-icon ${tc.passed ? 'pass' : 'fail'}`}>
                                {tc.passed ? '✓' : '✗'}
                              </span>
                              <strong>{tc.name}</strong>
                            </div>
                            <span className={`rtc-test-badge ${tc.passed ? 'pass' : 'fail'}`}>
                              {tc.passed ? 'PASSED' : 'FAILED'}
                            </span>
                          </div>

                          <div className="rtc-editor-test-details">
                            <div className="rtc-test-detail-row">
                              <span className="rtc-test-detail-key">Input:</span>
                              <code>{tc.input}</code>
                            </div>
                            <div className="rtc-test-detail-row">
                              <span className="rtc-test-detail-key">Expected:</span>
                              <code>{tc.expectedOutput}</code>
                            </div>
                            <div className="rtc-test-detail-row">
                              <span className="rtc-test-detail-key">Actual:</span>
                              <code className={tc.passed ? 'actual-pass' : 'actual-fail'}>
                                {tc.actualOutput || 'undefined'}
                              </code>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rtc-editor-output-empty">
                      No automated test cases configured for this problem. Click &quot;Run Code&quot; to test your custom solution.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
