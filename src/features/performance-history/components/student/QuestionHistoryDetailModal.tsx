import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Editor from '@monaco-editor/react';
import type { CodingAttempt } from '../../types/history.types';
import { codingHistoryService } from '../../services/codingHistoryService';
import './QuestionHistoryDetailModal.css';

interface QuestionHistoryDetailModalProps {
  attempt: CodingAttempt;
  userId: string;
  onClose: () => void;
}

export default function QuestionHistoryDetailModal({
  attempt,
  userId,
  onClose,
}: QuestionHistoryDetailModalProps) {
  const [attemptsList, setAttemptsList] = useState<CodingAttempt[]>([]);
  const [selectedAttemptNumber, setSelectedAttemptNumber] = useState<number>(attempt.attemptNumber);
  const [copied, setCopied] = useState(false);
  const [loadingAttempts, setLoadingAttempts] = useState(true);

  // Prevent background page scrolling while modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Keyboard Escape listener to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    let isMounted = true;
    async function loadAllAttempts() {
      setLoadingAttempts(true);
      try {
        const list = await codingHistoryService.getQuestionAttempts(userId, attempt.questionId);
        if (isMounted) {
          setAttemptsList(list);
          setSelectedAttemptNumber(attempt.attemptNumber);
        }
      } catch (err) {
        console.warn('Failed loading question attempts:', err);
      } finally {
        if (isMounted) setLoadingAttempts(false);
      }
    }
    loadAllAttempts();
    return () => {
      isMounted = false;
    };
  }, [userId, attempt.questionId, attempt.attemptNumber]);

  const currentAttempt =
    attemptsList.find(a => a.attemptNumber === selectedAttemptNumber) || attempt;

  const handleCopyCode = async () => {
    if (!currentAttempt.code) return;
    try {
      await navigator.clipboard.writeText(currentAttempt.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  const getStatusBadgeClass = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'solved' || s === 'accepted') return 'badge-solved';
    if (s === 'partial') return 'badge-partial';
    if (s === 'failed' || s === 'wrong_answer') return 'badge-failed';
    return 'badge-attempted';
  };

  const getDifficultyClass = (diff: string) => {
    const d = diff.toLowerCase();
    if (d === 'easy') return 'diff-easy';
    if (d === 'hard') return 'diff-hard';
    return 'diff-medium';
  };

  const modalContent = (
    <div className="perf-modal-backdrop" onClick={onClose}>
      <div
        className="perf-modal-container"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="perf-modal-header">
          <div className="perf-modal-title-box">
            <div className="perf-modal-badges">
              <span className={`perf-badge ${getStatusBadgeClass(currentAttempt.status)}`}>
                {currentAttempt.status}
              </span>
              <span className={`perf-badge ${getDifficultyClass(currentAttempt.difficulty)}`}>
                {currentAttempt.difficulty}
              </span>
              <span className="perf-badge badge-category">
                {currentAttempt.category.replace(/_/g, ' ')}
              </span>
              <span className="perf-badge badge-lang">
                {currentAttempt.language.toUpperCase()}
              </span>
            </div>
            <h2 className="perf-modal-title">{currentAttempt.questionTitle}</h2>
            <div className="perf-modal-qid">Problem ID: {currentAttempt.questionId}</div>
          </div>
          <button className="perf-modal-close-btn" onClick={onClose} aria-label="Close dialog">
            ✕
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="perf-modal-body">

        {/* Attempt Switcher Bar */}
        <div className="perf-attempts-bar">
          <div className="perf-attempts-label">
            <span>Historical Attempts:</span>
            <span className="perf-attempts-count">({attemptsList.length || 1} total)</span>
          </div>
          <div className="perf-attempts-selector">
            {loadingAttempts ? (
              <span className="perf-loading-attempts">Loading attempts...</span>
            ) : attemptsList.length > 0 ? (
              attemptsList.map(att => (
                <button
                  key={att.attemptNumber}
                  type="button"
                  className={`perf-attempt-pill ${
                    att.attemptNumber === selectedAttemptNumber ? 'active' : ''
                  }`}
                  onClick={() => setSelectedAttemptNumber(att.attemptNumber)}
                >
                  Attempt {att.attemptNumber}
                  <span className={`pill-dot ${getStatusBadgeClass(att.status)}`} />
                </button>
              ))
            ) : (
              <button type="button" className="perf-attempt-pill active">
                Attempt 1
              </button>
            )}
          </div>
        </div>

        {/* Attempt Metrics Cards */}
        <div className="perf-modal-stats-grid">
          <div className="perf-metric-card">
            <div className="perf-metric-lbl">Score / Percentage</div>
            <div className="perf-metric-val">{currentAttempt.percentage}%</div>
            <div className="perf-metric-sub">{currentAttempt.score} pts earned</div>
          </div>
          <div className="perf-metric-card">
            <div className="perf-metric-lbl">Test Cases</div>
            <div className="perf-metric-val">
              {currentAttempt.testCasesPassed !== null && currentAttempt.totalTestCases !== null
                ? `${currentAttempt.testCasesPassed} / ${currentAttempt.totalTestCases}`
                : 'Not available'}
            </div>
            <div className="perf-metric-sub">
              {currentAttempt.testCasesPassed === currentAttempt.totalTestCases &&
              currentAttempt.totalTestCases
                ? '100% Passed'
                : 'Automated evaluation'}
            </div>
          </div>
          <div className="perf-metric-card">
            <div className="perf-metric-lbl">Duration</div>
            <div className="perf-metric-val">
              {currentAttempt.durationSeconds > 0
                ? `${Math.floor(currentAttempt.durationSeconds / 60)}m ${
                    currentAttempt.durationSeconds % 60
                  }s`
                : 'Not available'}
            </div>
            <div className="perf-metric-sub">Time to submit</div>
          </div>
          <div className="perf-metric-card">
            <div className="perf-metric-lbl">Submitted At</div>
            <div className="perf-metric-val date-val">
              {new Date(currentAttempt.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <div className="perf-metric-sub">
              {new Date(currentAttempt.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>

        {/* Recorded Code Header */}
        <div className="perf-code-section-header">
          <div className="perf-code-section-title">
            <span>Recorded Code — Attempt #{currentAttempt.attemptNumber}</span>
            <span className="perf-code-lines-count">
              ({currentAttempt.code ? currentAttempt.code.split('\n').length : 0} lines)
            </span>
          </div>
          <button className="perf-copy-code-btn" onClick={handleCopyCode} type="button">
            {copied ? '✓ Copied' : 'Copy Code'}
          </button>
        </div>

        {/* Monaco Read-Only Code Viewer */}
        <div className="perf-modal-editor-wrap">
          <Editor
            height="320px"
            language={
              currentAttempt.language === 'typescript' || currentAttempt.language === 'tsx'
                ? 'typescript'
                : 'javascript'
            }
            value={currentAttempt.code || '// No code was captured for this attempt'}
            theme="vs-dark"
            options={{
              readOnly: true,
              domReadOnly: true,
              fontSize: 13,
              fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              wordWrap: 'on',
              renderLineHighlight: 'none',
              automaticLayout: true,
            }}
          />
        </div>

        {/* Execution Output or Compiler Errors (if present) */}
        {currentAttempt.errorMessage && (
          <div className="perf-error-box">
            <div className="perf-error-title">Runtime / Compiler Error:</div>
            <pre className="perf-error-body">{currentAttempt.errorMessage}</pre>
          </div>
        )}

        {currentAttempt.compilerOutput && (
          <div className="perf-output-box">
            <div className="perf-output-title">Compiler Output:</div>
            <pre className="perf-output-body">{currentAttempt.compilerOutput}</pre>
          </div>
        )}

        </div>

        {/* Footer */}
        <div className="perf-modal-footer">
          <span className="perf-footer-note">
            History record ID: <code>{currentAttempt.id}</code>
          </span>
          <button className="perf-btn-done" onClick={onClose} type="button">
            Done
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
