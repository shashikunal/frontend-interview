import { useState, useEffect } from 'react';
import { authService } from '../../../auth/services/auth.service';
import { codingHistoryService } from '../../services/codingHistoryService';
import { hiringEvaluationService } from '../../services/hiringEvaluationService';
import type {
  CodingAttempt,
  UserPerformanceSummary,
  HiringEvaluationHistoryItem,
  HiringStatus,
} from '../../types/history.types';
import QuestionHistoryDetailModal from '../student/QuestionHistoryDetailModal';

interface AdminCandidateProfileModalProps {
  candidate: {
    id: string;
    name: string;
    email: string;
    role: string;
    joinedDate?: string;
    lastActive?: string;
  };
  onClose: () => void;
  onEvaluationSaved?: () => void;
}

export default function AdminCandidateProfileModal({
  candidate,
  onClose,
  onEvaluationSaved,
}: AdminCandidateProfileModalProps) {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<UserPerformanceSummary | null>(null);
  const [attempts, setAttempts] = useState<CodingAttempt[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'code-history' | 'hiring'>('hiring');

  // Selected attempt for detailed inspect modal
  const [selectedAttempt, setSelectedAttempt] = useState<CodingAttempt | null>(null);

  // Hiring Evaluation State
  const [hiringStatus, setHiringStatus] = useState<HiringStatus>('Pending');
  const [overallRating, setOverallRating] = useState<number>(3);
  const [rubricProblemSolving, setRubricProblemSolving] = useState<number>(3);
  const [rubricCodeQuality, setRubricCodeQuality] = useState<number>(3);
  const [rubricCommunication, setRubricCommunication] = useState<number>(3);
  const [rubricArchitecture, setRubricArchitecture] = useState<number>(3);
  const [recommendation, setRecommendation] = useState('');
  const [notes, setNotes] = useState('');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [finalComments, setFinalComments] = useState('');
  const [evaluationHistory, setEvaluationHistory] = useState<HiringEvaluationHistoryItem[]>([]);
  const [savingEvaluation, setSavingEvaluation] = useState(false);
  const [evaluationSaveMessage, setEvaluationSaveMessage] = useState<string | null>(null);

  // Password Reset Action State
  const [resettingPassword, setResettingPassword] = useState(false);
  const [passwordResetToast, setPasswordResetToast] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [sum, history, currentEval, evalHist] = await Promise.all([
          codingHistoryService.getUserPerformanceSummary(candidate.id),
          codingHistoryService.getUserCodingHistory(candidate.id),
          hiringEvaluationService.getEvaluation(candidate.id),
          hiringEvaluationService.getEvaluationHistory(candidate.id),
        ]);

        if (isMounted) {
          setSummary(sum);
          setAttempts(history);
          setEvaluationHistory(evalHist);

          if (currentEval) {
            setHiringStatus(currentEval.status);
            setOverallRating(currentEval.overallRating);
            if (currentEval.rubricProblemSolving) setRubricProblemSolving(currentEval.rubricProblemSolving);
            if (currentEval.rubricCodeQuality) setRubricCodeQuality(currentEval.rubricCodeQuality);
            if (currentEval.rubricCommunication) setRubricCommunication(currentEval.rubricCommunication);
            if (currentEval.rubricArchitecture) setRubricArchitecture(currentEval.rubricArchitecture);
            setRecommendation(currentEval.recommendation || '');
            setNotes(currentEval.notes || '');
            setStrengths(currentEval.strengths || '');
            setWeaknesses(currentEval.weaknesses || '');
            setFinalComments(currentEval.finalComments || '');
          }
        }
      } catch (err) {
        console.warn('[AdminCandidateProfileModal] Error loading candidate data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [candidate.id]);

  // Handle Save Evaluation
  const handleSaveEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEvaluation(true);
    setEvaluationSaveMessage(null);
    try {
      await hiringEvaluationService.saveEvaluation({
        candidateId: candidate.id,
        status: hiringStatus,
        overallRating,
        rubricProblemSolving,
        rubricCodeQuality,
        rubricCommunication,
        rubricArchitecture,
        recommendation,
        notes,
        strengths,
        weaknesses,
        finalComments,
        evaluatedBy: 'admin',
        evaluatorName: 'Platform Administrator',
      });

      const updatedHistory = await hiringEvaluationService.getEvaluationHistory(candidate.id);
      setEvaluationHistory(updatedHistory);
      setEvaluationSaveMessage('✓ Hiring decision and evaluation persisted successfully.');
      if (onEvaluationSaved) onEvaluationSaved();
      setTimeout(() => setEvaluationSaveMessage(null), 4000);
    } catch (err) {
      console.warn('Failed saving evaluation:', err);
      setEvaluationSaveMessage('❌ Failed to save evaluation.');
    } finally {
      setSavingEvaluation(false);
    }
  };

  // Secure Password Reset Handler (Never exposes plaintext passwords)
  const handleInitiatePasswordReset = async () => {
    if (!candidate.email) return;
    setResettingPassword(true);
    try {
      const res = await authService.resetPassword(candidate.email);
      setPasswordResetToast(
        res.success
          ? `✓ Secure password reset email dispatched to ${candidate.email}`
          : `⚠️ ${res.message || 'Unable to dispatch reset email'}`
      );
      setTimeout(() => setPasswordResetToast(null), 5000);
    } catch (_) {
      setPasswordResetToast('⚠️ Password reset failed. Verify user email.');
      setTimeout(() => setPasswordResetToast(null), 5000);
    } finally {
      setResettingPassword(false);
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds <= 0) return '0m';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  const mcStat = summary?.categoryStats.MACHINE_CODING;
  const dsaStat = summary?.categoryStats.DSA;
  const cpStat = summary?.categoryStats.CORE_PROGRAMMING;

  return (
    <div className="admin-cand-modal-backdrop" onClick={onClose}>
      <div
        className="admin-cand-modal-container"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Header */}
        <div className="admin-cand-modal-header">
          <div className="admin-cand-info">
            <div className="admin-cand-avatar">
              {candidate.name ? candidate.name[0].toUpperCase() : 'C'}
            </div>
            <div>
              <div className="admin-cand-name-row">
                <h2>{candidate.name}</h2>
                <span className="admin-cand-role-pill">{candidate.role.toUpperCase()}</span>
                <span className={`admin-cand-status-badge status-${hiringStatus.toLowerCase()}`}>
                  {hiringStatus}
                </span>
              </div>
              <div className="admin-cand-sub-row">
                <span>📧 {candidate.email}</span>
                <span>•</span>
                <span>ID: <code>{candidate.id.slice(0, 16)}...</code></span>
                <span>•</span>
                <span>Active: {candidate.lastActive || 'Today'}</span>
              </div>
            </div>
          </div>

          <div className="admin-cand-header-actions">
            <button
              type="button"
              className="admin-cand-pwd-btn"
              onClick={handleInitiatePasswordReset}
              disabled={resettingPassword}
              title="Send secure password reset link to candidate's email (Passwords are never exposed)"
            >
              🔑 {resettingPassword ? 'Sending Reset...' : 'Reset Password'}
            </button>
            <button className="admin-cand-close-btn" onClick={onClose} aria-label="Close dialog">
              ✕
            </button>
          </div>
        </div>

        {passwordResetToast && (
          <div className="admin-cand-toast">
            {passwordResetToast}
          </div>
        )}

        {/* Modal Sub-Navigation */}
        <div className="admin-cand-nav-tabs">
          <button
            type="button"
            className={`admin-cand-tab-btn ${activeTab === 'hiring' ? 'active' : ''}`}
            onClick={() => setActiveTab('hiring')}
          >
            ⚖️ Hiring Evaluation &amp; Scorecard
          </button>
          <button
            type="button"
            className={`admin-cand-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            📊 Performance Analytics
          </button>
          <button
            type="button"
            className={`admin-cand-tab-btn ${activeTab === 'code-history' ? 'active' : ''}`}
            onClick={() => setActiveTab('code-history')}
          >
            💻 Complete Code History ({attempts.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="admin-cand-modal-body">
          {loading ? (
            <div className="admin-cand-loading">
              <div className="perf-spinner" />
              <p>Aggregating candidate dossier and multi-attempt coding records...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: HIRING EVALUATION & SCORECARD */}
              {activeTab === 'hiring' && (
                <div className="admin-hiring-tab-content">
                  {/* Performance Scorecard Grid */}
                  <div className="admin-scorecard-section">
                    <h4 className="admin-section-heading">Candidate Technical Scorecard (Real Data)</h4>
                    <div className="admin-scorecard-grid">
                      <div className="admin-scorecard-card">
                        <span className="lbl">Overall Performance</span>
                        <div className="val text-blue">{summary?.successRate || 0}%</div>
                        <span className="sub">{summary?.uniqueSolved || 0} of {summary?.uniqueAttempted || 0} Solved</span>
                      </div>
                      <div className="admin-scorecard-card">
                        <span className="lbl">Machine Coding</span>
                        <div className="val text-purple">{mcStat?.averageScore || 0}%</div>
                        <span className="sub">{mcStat?.questionsSolved || 0} Solved ({mcStat?.totalAttempts || 0} Attempts)</span>
                      </div>
                      <div className="admin-scorecard-card">
                        <span className="lbl">LeetCode / DSA</span>
                        <div className="val text-blue">{dsaStat?.averageScore || 0}%</div>
                        <span className="sub">{dsaStat?.questionsSolved || 0} Solved ({dsaStat?.totalAttempts || 0} Attempts)</span>
                      </div>
                      <div className="admin-scorecard-card">
                        <span className="lbl">Core Programming</span>
                        <div className="val text-green">{cpStat?.averageScore || 0}%</div>
                        <span className="sub">{cpStat?.questionsSolved || 0} Solved ({cpStat?.totalAttempts || 0} Attempts)</span>
                      </div>
                      <div className="admin-scorecard-card">
                        <span className="lbl">Coding Velocity</span>
                        <div className="val">{formatDuration(summary?.totalCodingTimeSeconds || 0)}</div>
                        <span className="sub">Total Time Invested</span>
                      </div>
                    </div>
                  </div>

                  {/* Hiring Decision & Manual Rubric Form */}
                  <form onSubmit={handleSaveEvaluation} className="admin-hiring-form">
                    <div className="admin-form-split">
                      {/* Left: Decision & Rubric */}
                      <div className="admin-form-col">
                        <h4 className="admin-section-heading">Hiring Decision &amp; Rating</h4>

                        {/* Decision Status Radios */}
                        <div className="admin-decision-radio-group">
                          <label className="admin-radio-lbl">Hiring Status:</label>
                          <div className="admin-radio-options">
                            {(['Hire', 'Consider', 'Reject', 'Pending'] as HiringStatus[]).map(st => (
                              <label
                                key={st}
                                className={`admin-radio-tile tile-${st.toLowerCase()} ${
                                  hiringStatus === st ? 'selected' : ''
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="hiringStatus"
                                  value={st}
                                  checked={hiringStatus === st}
                                  onChange={() => setHiringStatus(st)}
                                />
                                <span className="tile-title">{st}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Overall Rating (1 - 5 Stars) */}
                        <div className="admin-form-group">
                          <label className="admin-form-lbl">
                            Overall Rating: <strong>{overallRating} / 5</strong>
                          </label>
                          <div className="admin-star-selector">
                            {[1, 2, 3, 4, 5].map(val => (
                              <button
                                key={val}
                                type="button"
                                className={`admin-star-btn ${val <= overallRating ? 'filled' : ''}`}
                                onClick={() => setOverallRating(val)}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Manual Technical Rubric (1-5 for each dimension) */}
                        <div className="admin-rubric-box">
                          <h5 className="rubric-box-title">Manual Evaluator Assessment (1-5)</h5>

                          <div className="rubric-row">
                            <span className="rubric-dim">Problem Solving &amp; Logic</span>
                            <div className="rubric-stars">
                              {[1, 2, 3, 4, 5].map(v => (
                                <button
                                  key={v}
                                  type="button"
                                  className={`star-pill ${v <= rubricProblemSolving ? 'active' : ''}`}
                                  onClick={() => setRubricProblemSolving(v)}
                                >
                                  {v}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="rubric-row">
                            <span className="rubric-dim">Code Quality &amp; Cleanliness</span>
                            <div className="rubric-stars">
                              {[1, 2, 3, 4, 5].map(v => (
                                <button
                                  key={v}
                                  type="button"
                                  className={`star-pill ${v <= rubricCodeQuality ? 'active' : ''}`}
                                  onClick={() => setRubricCodeQuality(v)}
                                >
                                  {v}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="rubric-row">
                            <span className="rubric-dim">Technical Communication</span>
                            <div className="rubric-stars">
                              {[1, 2, 3, 4, 5].map(v => (
                                <button
                                  key={v}
                                  type="button"
                                  className={`star-pill ${v <= rubricCommunication ? 'active' : ''}`}
                                  onClick={() => setRubricCommunication(v)}
                                >
                                  {v}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="rubric-row">
                            <span className="rubric-dim">Architecture &amp; Design</span>
                            <div className="rubric-stars">
                              {[1, 2, 3, 4, 5].map(v => (
                                <button
                                  key={v}
                                  type="button"
                                  className={`star-pill ${v <= rubricArchitecture ? 'active' : ''}`}
                                  onClick={() => setRubricArchitecture(v)}
                                >
                                  {v}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Notes & Recommendations */}
                      <div className="admin-form-col">
                        <h4 className="admin-section-heading">Evaluator Notes &amp; Feedback</h4>

                        <div className="admin-form-group">
                          <label className="admin-form-lbl">Executive Recommendation</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            placeholder="e.g. Strong Senior Frontend candidate, recommend for team match"
                            value={recommendation}
                            onChange={e => setRecommendation(e.target.value)}
                          />
                        </div>

                        <div className="admin-form-group">
                          <label className="admin-form-lbl">Demonstrated Strengths</label>
                          <textarea
                            className="admin-form-textarea"
                            rows={2}
                            placeholder="e.g. Fast implementation of complex React state, clean component structure..."
                            value={strengths}
                            onChange={e => setStrengths(e.target.value)}
                          />
                        </div>

                        <div className="admin-form-group">
                          <label className="admin-form-lbl">Areas for Improvement / Weaknesses</label>
                          <textarea
                            className="admin-form-textarea"
                            rows={2}
                            placeholder="e.g. Could optimize time complexity on recursive tree traversals..."
                            value={weaknesses}
                            onChange={e => setWeaknesses(e.target.value)}
                          />
                        </div>

                        <div className="admin-form-group">
                          <label className="admin-form-lbl">Internal Admin Notes (Protected from Student)</label>
                          <textarea
                            className="admin-form-textarea"
                            rows={3}
                            placeholder="Confidential interviewer impressions, salary expectations, interview team notes..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                          />
                        </div>

                        {evaluationSaveMessage && (
                          <div className="admin-eval-msg">{evaluationSaveMessage}</div>
                        )}

                        <div className="admin-form-action-row">
                          <button
                            type="submit"
                            className="admin-save-eval-btn"
                            disabled={savingEvaluation}
                          >
                            {savingEvaluation ? 'Saving Decision...' : '💾 Save Hiring Evaluation'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>

                  {/* Preserved Evaluation Audit History */}
                  <div className="admin-eval-history-section">
                    <h4 className="admin-section-heading">Evaluation Audit History</h4>
                    {evaluationHistory.length === 0 ? (
                      <div className="admin-empty-subtext">
                        No previous evaluations on record. Saving your decision above will start this candidate&apos;s audit trail.
                      </div>
                    ) : (
                      <div className="admin-eval-history-list">
                        {evaluationHistory.map(hist => (
                          <div key={hist.id} className="admin-eval-history-item">
                            <div className="admin-eval-hist-top">
                              <span className={`admin-cand-status-badge status-${hist.status.toLowerCase()}`}>
                                {hist.status}
                              </span>
                              <span className="rating">Rating: {hist.overallRating}/5 ⭐</span>
                              <span className="evaluator">Evaluated by: {hist.evaluatorName || hist.evaluatedBy || 'Admin'}</span>
                              <span className="date">
                                {new Date(hist.createdAt).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            {hist.recommendation && (
                              <div className="admin-eval-hist-rec">
                                <strong>Recommendation:</strong> {hist.recommendation}
                              </div>
                            )}
                            {hist.notes && (
                              <div className="admin-eval-hist-notes">
                                <strong>Notes:</strong> {hist.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: PERFORMANCE ANALYTICS */}
              {activeTab === 'profile' && (
                <div className="admin-profile-tab-content">
                  <div className="perf-summary-grid">
                    <div className="perf-card">
                      <div className="perf-card-icon">📚</div>
                      <div className="perf-card-content">
                        <span className="perf-card-label">Total Attempts</span>
                        <div className="perf-card-value">{summary?.totalAttempts ?? 0}</div>
                        <span className="perf-card-sub">Recorded Submissions</span>
                      </div>
                    </div>
                    <div className="perf-card">
                      <div className="perf-card-icon">✅</div>
                      <div className="perf-card-content">
                        <span className="perf-card-label">Solved Problems</span>
                        <div className="perf-card-value text-green">{summary?.uniqueSolved || 0}</div>
                        <span className="perf-card-sub">Unique Solved</span>
                      </div>
                    </div>
                    <div className="perf-card">
                      <div className="perf-card-icon">🎯</div>
                      <div className="perf-card-content">
                        <span className="perf-card-label">Attempted</span>
                        <div className="perf-card-value">{summary?.uniqueAttempted || 0}</div>
                        <span className="perf-card-sub">Unique Attempted</span>
                      </div>
                    </div>
                    <div className="perf-card">
                      <div className="perf-card-icon">📈</div>
                      <div className="perf-card-content">
                        <span className="perf-card-label">Success Rate</span>
                        <div className="perf-card-value text-blue">{summary?.successRate || 0}%</div>
                        <span className="perf-card-sub">Completion Ratio</span>
                      </div>
                    </div>
                    <div className="perf-card">
                      <div className="perf-card-icon">⏱️</div>
                      <div className="perf-card-content">
                        <span className="perf-card-label">Total Duration</span>
                        <div className="perf-card-value">{formatDuration(summary?.totalCodingTimeSeconds || 0)}</div>
                        <span className="perf-card-sub">Time Recorded</span>
                      </div>
                    </div>
                    <div className="perf-card">
                      <div className="perf-card-icon">🔁</div>
                      <div className="perf-card-content">
                        <span className="perf-card-label">Total Runs/Attempts</span>
                        <div className="perf-card-value text-purple">{summary?.totalAttempts || 0}</div>
                        <span className="perf-card-sub">Executions Tracked</span>
                      </div>
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <h4 className="admin-section-heading">Track Mastery Breakdown</h4>
                  <div className="perf-categories-grid">
                    <div className="perf-cat-card">
                      <div className="perf-cat-header">
                        <div className="perf-cat-badge badge-mc">Machine Coding</div>
                        <div className="perf-cat-score">{mcStat?.averageScore || 0}%</div>
                      </div>
                      <div className="perf-cat-title">Component Architecture</div>
                      <div className="perf-cat-metrics">
                        <div className="perf-cat-metric-item">
                          <span className="lbl">Attempted</span>
                          <span className="val">{mcStat?.questionsAttempted || 0}</span>
                        </div>
                        <div className="perf-cat-metric-item">
                          <span className="lbl">Solved</span>
                          <span className="val">{mcStat?.questionsSolved || 0}</span>
                        </div>
                        <div className="perf-cat-metric-item">
                          <span className="lbl">Success %</span>
                          <span className="val">{mcStat?.successRate || 0}%</span>
                        </div>
                        <div className="perf-cat-metric-item">
                          <span className="lbl">Avg Time</span>
                          <span className="val">{formatDuration(mcStat?.averageCompletionTimeSeconds || 0)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="perf-cat-card">
                      <div className="perf-cat-header">
                        <div className="perf-cat-badge badge-dsa">LeetCode / DSA</div>
                        <div className="perf-cat-score">{dsaStat?.averageScore || 0}%</div>
                      </div>
                      <div className="perf-cat-title">Algorithms &amp; Problem Solving</div>
                      <div className="perf-cat-metrics">
                        <div className="perf-cat-metric-item">
                          <span className="lbl">Attempted</span>
                          <span className="val">{dsaStat?.questionsAttempted || 0}</span>
                        </div>
                        <div className="perf-cat-metric-item">
                          <span className="lbl">Solved</span>
                          <span className="val">{dsaStat?.questionsSolved || 0}</span>
                        </div>
                        <div className="perf-cat-metric-item">
                          <span className="lbl">Success %</span>
                          <span className="val">{dsaStat?.successRate || 0}%</span>
                        </div>
                        <div className="perf-cat-metric-item">
                          <span className="lbl">Avg Time</span>
                          <span className="val">{formatDuration(dsaStat?.averageCompletionTimeSeconds || 0)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="perf-cat-card">
                      <div className="perf-cat-header">
                        <div className="perf-cat-badge badge-cp">Core Programming</div>
                        <div className="perf-cat-score">{cpStat?.averageScore || 0}%</div>
                      </div>
                      <div className="perf-cat-title">JavaScript &amp; Web Internals</div>
                      <div className="perf-cat-metrics">
                        <div className="perf-cat-metric-item">
                          <span className="lbl">Attempted</span>
                          <span className="val">{cpStat?.questionsAttempted || 0}</span>
                        </div>
                        <div className="perf-cat-metric-item">
                          <span className="lbl">Solved</span>
                          <span className="val">{cpStat?.questionsSolved || 0}</span>
                        </div>
                        <div className="perf-cat-metric-item">
                          <span className="lbl">Success %</span>
                          <span className="val">{cpStat?.successRate || 0}%</span>
                        </div>
                        <div className="perf-cat-metric-item">
                          <span className="lbl">Avg Time</span>
                          <span className="val">{formatDuration(cpStat?.averageCompletionTimeSeconds || 0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: COMPLETE CODE & ATTEMPT HISTORY */}
              {activeTab === 'code-history' && (
                <div className="admin-code-history-tab">
                  <div className="admin-table-controls">
                    <span className="admin-table-count">
                      Displaying <strong>{attempts.length}</strong> historical coding attempts
                    </span>
                  </div>

                  {attempts.length === 0 ? (
                    <div className="perf-empty-state">
                      <div className="perf-empty-icon">📂</div>
                      <h4>No activity yet</h4>
                      <p>This candidate has not executed or submitted code on any platform questions yet.</p>
                    </div>
                  ) : (
                    <div className="perf-table-responsive">
                      <table className="perf-history-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Attempt #</th>
                            <th>Category</th>
                            <th>Question</th>
                            <th>Language</th>
                            <th>Status</th>
                            <th>Score / %</th>
                            <th>Duration</th>
                            <th>Code Inspection</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attempts.map(att => (
                            <tr
                              key={att.id}
                              className="perf-table-row"
                              onClick={() => setSelectedAttempt(att)}
                            >
                              <td className="cell-date">
                                {new Date(att.createdAt).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </td>
                              <td>
                                <span className="attempt-pill">Attempt {att.attemptNumber}</span>
                              </td>
                              <td>
                                <span className="cat-pill">{att.category.replace(/_/g, ' ')}</span>
                              </td>
                              <td className="cell-title">
                                <span className="problem-title">{att.questionTitle}</span>
                                <span className="problem-id">{att.questionId}</span>
                              </td>
                              <td className="cell-lang">{att.language}</td>
                              <td>
                                <span className={`perf-tag tag-${att.status.toLowerCase()}`}>
                                  {att.status}
                                </span>
                              </td>
                              <td className="cell-score">
                                <span className="score-num">{att.percentage}%</span>
                              </td>
                              <td>{att.durationSeconds > 0 ? `${Math.round(att.durationSeconds / 60)}m` : '—'}</td>
                              <td>
                                <button
                                  type="button"
                                  className="perf-inspect-code-btn"
                                  onClick={e => {
                                    e.stopPropagation();
                                    setSelectedAttempt(att);
                                  }}
                                >
                                  View Code
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="admin-cand-modal-footer">
          <span className="candidate-secure-footer-text">
            🔒 Candidate Dossier &amp; Evaluations protected by Row-Level Security. Passwords encrypted.
          </span>
          <button className="perf-btn-done" onClick={onClose} type="button">
            Close Dossier
          </button>
        </div>
      </div>

      {/* Code Inspection Modal */}
      {selectedAttempt && (
        <QuestionHistoryDetailModal
          attempt={selectedAttempt}
          userId={candidate.id}
          onClose={() => setSelectedAttempt(null)}
        />
      )}
    </div>
  );
}
