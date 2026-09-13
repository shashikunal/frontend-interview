import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Editor, { DiffEditor } from '@monaco-editor/react';
import type { CodingAttempt } from '../../types/history.types';
import { codingHistoryService } from '../../services/codingHistoryService';
import './QuestionHistoryDetailModal.css';

interface QuestionHistoryDetailModalProps {
  attempt: CodingAttempt;
  userId: string;
  onClose: () => void;
}

function computeLineDiff(prevCode?: string, currCode?: string) {
  if (!prevCode) return { added: currCode ? currCode.split('\n').length : 0, removed: 0 };
  const prevLines = new Set(prevCode.split('\n'));
  const currLines = currCode ? currCode.split('\n') : [];
  let added = 0;
  for (const l of currLines) {
    if (!prevLines.has(l)) added++;
  }
  const currSet = new Set(currLines);
  let removed = 0;
  for (const l of prevCode.split('\n')) {
    if (!currSet.has(l)) removed++;
  }
  return { added, removed };
}

function formatTimeDelta(prevDateStr?: string, currDateStr?: string) {
  if (!prevDateStr || !currDateStr) return null;
  const diffMs = Math.max(0, new Date(currDateStr).getTime() - new Date(prevDateStr).getTime());
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `+${diffSec}s`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `+${diffMin}m ${diffSec % 60}s`;
  const diffHr = Math.floor(diffMin / 60);
  return `+${diffHr}h ${diffMin % 60}m`;
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
  const [viewMode, setViewMode] = useState<'single' | 'diff'>('single');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1500);

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

  const sortedAttempts = useMemo(() => {
    const source = attemptsList.length > 0 ? attemptsList : [attempt];
    return [...source].sort((a, b) => a.attemptNumber - b.attemptNumber);
  }, [attemptsList, attempt]);

  const currentAttempt =
    sortedAttempts.find(a => a.attemptNumber === selectedAttemptNumber) ||
    sortedAttempts[0] ||
    attempt;

  const currentIndex = sortedAttempts.findIndex(
    a => a.attemptNumber === currentAttempt.attemptNumber
  );
  const prevAttempt = currentIndex > 0 ? sortedAttempts[currentIndex - 1] : null;
  const nextAttempt = currentIndex < sortedAttempts.length - 1 ? sortedAttempts[currentIndex + 1] : null;

  const diffStats = useMemo(() => {
    return computeLineDiff(prevAttempt?.code, currentAttempt.code);
  }, [prevAttempt?.code, currentAttempt.code]);

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;
    if (sortedAttempts.length <= 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setInterval(() => {
      setSelectedAttemptNumber(prevNum => {
        const curIdx = sortedAttempts.findIndex(a => a.attemptNumber === prevNum);
        if (curIdx < sortedAttempts.length - 1) {
          return sortedAttempts[curIdx + 1].attemptNumber;
        } else {
          setIsPlaying(false);
          return prevNum;
        }
      });
    }, playbackSpeed);
    return () => clearInterval(timer);
  }, [isPlaying, sortedAttempts, playbackSpeed]);

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

        {/* Interactive Playback & Attempt Timeline */}
        <div className="perf-playback-timeline-container">
          <div className="perf-playback-toolbar">
            <div className="perf-playback-nav">
              <button
                type="button"
                className="perf-playback-btn"
                disabled={!prevAttempt}
                onClick={() => prevAttempt && setSelectedAttemptNumber(prevAttempt.attemptNumber)}
                title="Step to Previous Attempt"
              >
                ◀ Prev
              </button>

              <button
                type="button"
                className={`perf-playback-btn play-btn ${isPlaying ? 'playing' : ''}`}
                disabled={sortedAttempts.length <= 1}
                onClick={() => setIsPlaying(p => !p)}
                title={isPlaying ? 'Pause Auto-Play' : 'Auto-Play Progression'}
              >
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>

              <button
                type="button"
                className="perf-playback-btn"
                disabled={!nextAttempt}
                onClick={() => nextAttempt && setSelectedAttemptNumber(nextAttempt.attemptNumber)}
                title="Step to Next Attempt"
              >
                Next ▶
              </button>

              <div className="perf-speed-toggle">
                <button
                  type="button"
                  className={`speed-pill ${playbackSpeed === 1500 ? 'active' : ''}`}
                  onClick={() => setPlaybackSpeed(1500)}
                >
                  1x
                </button>
                <button
                  type="button"
                  className={`speed-pill ${playbackSpeed === 750 ? 'active' : ''}`}
                  onClick={() => setPlaybackSpeed(750)}
                >
                  2x
                </button>
              </div>
            </div>

            <div className="perf-playback-counter">
              <span>Attempt <strong>{currentIndex + 1}</strong> of <strong>{sortedAttempts.length}</strong></span>
              {prevAttempt && (
                <span className="perf-time-delta">
                  ⏱ {formatTimeDelta(prevAttempt.createdAt, currentAttempt.createdAt)}
                </span>
              )}
            </div>
          </div>

          {/* Horizontal Scrubber Track */}
          <div className="perf-timeline-track">
            {loadingAttempts ? (
              <span className="perf-loading-attempts">Loading attempt timeline...</span>
            ) : (
              sortedAttempts.map((att, idx) => {
                const isActive = att.attemptNumber === selectedAttemptNumber;
                const prior = idx > 0 ? sortedAttempts[idx - 1] : null;
                const scoreDelta = prior ? att.score - prior.score : null;
                return (
                  <button
                    key={att.attemptNumber}
                    type="button"
                    className={`perf-timeline-step ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setIsPlaying(false);
                      setSelectedAttemptNumber(att.attemptNumber);
                    }}
                  >
                    <div className="perf-timeline-node">
                      <span className={`node-dot ${getStatusBadgeClass(att.status)}`} />
                      <span className="node-num">#{att.attemptNumber}</span>
                    </div>
                    <div className="perf-timeline-meta">
                      <span className="meta-score">{att.score}%</span>
                      {scoreDelta !== null && scoreDelta !== 0 && (
                        <span className={`meta-delta ${scoreDelta > 0 ? 'pos' : 'neg'}`}>
                          {scoreDelta > 0 ? `+${scoreDelta}%` : `${scoreDelta}%`}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
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

        {/* Recorded Code Header & View Mode Switcher */}
        <div className="perf-code-section-header">
          <div className="perf-code-section-title">
            <span>
              {viewMode === 'diff' && prevAttempt
                ? `Diff: Attempt #${prevAttempt.attemptNumber} → #${currentAttempt.attemptNumber}`
                : `Recorded Code — Attempt #${currentAttempt.attemptNumber}`}
            </span>
            <span className="perf-code-lines-count">
              ({currentAttempt.code ? currentAttempt.code.split('\n').length : 0} lines)
            </span>
          </div>

          <div className="perf-code-controls-right">
            {/* View Mode Switcher */}
            <div className="perf-view-toggle">
              <button
                type="button"
                className={`perf-view-tab ${viewMode === 'single' ? 'active' : ''}`}
                onClick={() => setViewMode('single')}
              >
                📝 Full Code
              </button>
              <button
                type="button"
                className={`perf-view-tab ${viewMode === 'diff' ? 'active' : ''}`}
                disabled={!prevAttempt}
                onClick={() => setViewMode('diff')}
                title={!prevAttempt ? 'No previous attempt to compare' : 'Compare diff with previous attempt'}
              >
                🔀 Diff with Prev
              </button>
            </div>

            {viewMode === 'diff' && prevAttempt && (
              <div className="perf-diff-chips">
                <span className="chip-add">+{diffStats.added}</span>
                <span className="chip-del">-{diffStats.removed}</span>
              </div>
            )}

            <button className="perf-copy-code-btn" onClick={handleCopyCode} type="button">
              {copied ? '✓ Copied' : 'Copy Code'}
            </button>
          </div>
        </div>

        {/* Monaco Read-Only Code Viewer or DiffEditor */}
        <div className="perf-modal-editor-wrap">
          {viewMode === 'diff' && prevAttempt ? (
            <DiffEditor
              height="360px"
              language={
                currentAttempt.language === 'typescript' || currentAttempt.language === 'tsx'
                  ? 'typescript'
                  : 'javascript'
              }
              original={prevAttempt.code || '// Empty previous attempt'}
              modified={currentAttempt.code || '// Empty current attempt'}
              theme="vs-dark"
              options={{
                readOnly: true,
                domReadOnly: true,
                fontSize: 13,
                fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                renderSideBySide: true,
                automaticLayout: true,
              }}
            />
          ) : (
            <Editor
              height="360px"
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
          )}
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
