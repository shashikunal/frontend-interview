import type { MCQuestion } from './machineCodingQuestions';
import type { MCTestResult } from './data/machineCodingTests';
import './InterviewScorecardModal.css';

export interface ScorecardData {
  question: MCQuestion;
  timeSpentSeconds: number;
  totalDurationSeconds: number;
  testResults: MCTestResult[];
  passedTests: number;
  totalTests: number;
}

interface Props {
  data: ScorecardData;
  onClose: () => void;
  onReviewSolution: () => void;
  onRetry: () => void;
  onOpenDiff?: () => void;
}

export default function InterviewScorecardModal({ data, onClose, onReviewSolution, onRetry, onOpenDiff }: Props) {
  const { question, timeSpentSeconds, totalDurationSeconds, testResults, passedTests, totalTests } = data;

  const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
  const timeUsedPct = (timeSpentSeconds / totalDurationSeconds) * 100;

  // Grade & Hire Recommendation
  let recommendation: 'STRONG HIRE' | 'HIRE' | 'LEAN HIRE' | 'NO HIRE' = 'NO HIRE';
  let grade = 'C';
  let score = Math.round(passRate * 0.8 + (timeUsedPct <= 75 ? 20 : timeUsedPct <= 100 ? 10 : 0));

  if (passRate === 100) {
    if (timeUsedPct <= 65) {
      recommendation = 'STRONG HIRE';
      grade = 'A+';
      score = 98;
    } else {
      recommendation = 'HIRE';
      grade = 'A';
      score = 90;
    }
  } else if (passRate >= 75) {
    recommendation = 'LEAN HIRE';
    grade = 'B';
    score = 78;
  } else if (passRate >= 50) {
    recommendation = 'NO HIRE';
    grade = 'C';
    score = 55;
  } else {
    recommendation = 'NO HIRE';
    grade = 'D';
    score = Math.max(25, score);
  }

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}m ${String(remainder).padStart(2, '0')}s`;
  };

  return (
    <div className="mc-scorecard-overlay" onClick={onClose}>
      <div className="mc-scorecard-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="mc-scorecard-header">
          <div>
            <div className="mc-scorecard-kicker">FAANG MACHINE CODING REPORT</div>
            <h2 className="mc-scorecard-title">{question.id}: {question.title}</h2>
          </div>
          <button className="mc-scorecard-close" onClick={onClose} title="Close scorecard">
            ✕
          </button>
        </div>

        {/* Hero Result Banner */}
        <div className={`mc-verdict-banner ${recommendation.toLowerCase().replace(/\s+/g, '-')}`}>
          <div className="mc-verdict-badge">
            <span className="mc-verdict-label">EVALUATION VERDICT</span>
            <span className="mc-verdict-value">{recommendation}</span>
          </div>

          <div className="mc-score-circle">
            <span className="mc-score-number">{score}</span>
            <span className="mc-score-grade">GRADE {grade}</span>
          </div>
        </div>

        {/* Performance Metrics Grid */}
        <div className="mc-metrics-grid">
          <div className="mc-metric-card">
            <div className="mc-metric-label">TIME UTILIZATION</div>
            <div className="mc-metric-value">{formatDuration(timeSpentSeconds)}</div>
            <div className="mc-metric-sub">of {formatDuration(totalDurationSeconds)} allocated</div>
          </div>

          <div className="mc-metric-card">
            <div className="mc-metric-label">TEST SUITE PASS RATE</div>
            <div className="mc-metric-value" style={{ color: passRate === 100 ? '#22c55e' : '#f59e0b' }}>
              {passedTests}/{totalTests} ({Math.round(passRate)}%)
            </div>
            <div className="mc-metric-sub">automated DOM assertions</div>
          </div>

          <div className="mc-metric-card">
            <div className="mc-metric-label">COMPLEXITY LEVEL</div>
            <div className="mc-metric-value">{question.difficulty.toUpperCase()}</div>
            <div className="mc-metric-sub">{question.category}</div>
          </div>
        </div>

        {/* Test Assertions Breakdown */}
        <div className="mc-scorecard-section">
          <h4 style={{ margin: '0 0 10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            AUTOMATED ASSERTIONS BREAKDOWN
          </h4>
          <div className="mc-scorecard-test-list">
            {testResults.map((tc, idx) => (
              <div key={tc.id} className={`mc-scorecard-test-item ${tc.status}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`mc-pill ${tc.status}`}>{tc.status === 'passed' ? '✓ PASS' : '✕ FAIL'}</span>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>#{idx + 1} {tc.name}</span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{tc.durationMs}ms</span>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Evaluation Feedback */}
        <div className="mc-scorecard-section mc-staff-notes">
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#38bdf8', marginBottom: '6px' }}>
            SENIOR STAFF INTERVIEWER FEEDBACK
          </div>
          <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
            {passRate === 100
              ? 'Excellent execution. The candidate demonstrated clean component decoupling, resilient state architecture, and proper DOM accessibility.'
              : 'Good initial foundation, but certain edge-case boundaries or interaction lifecycle handlers were missed. Review the reference solution below to inspect optimal state modeling.'}
          </p>
        </div>

        {/* Actions */}
        <div className="mc-scorecard-actions">
          {onOpenDiff && (
            <button className="mc-btn-scorecard-diff" onClick={onOpenDiff}>
              🔀 Review Code Diff
            </button>
          )}
          <button className="mc-btn-scorecard-solution" onClick={onReviewSolution}>
            💡 Inspect Reference Solution
          </button>
          <button className="mc-btn-scorecard-retry" onClick={onRetry}>
            ↺ Retry Round
          </button>
          <button className="mc-btn-scorecard-close" onClick={onClose}>
            Back to Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
