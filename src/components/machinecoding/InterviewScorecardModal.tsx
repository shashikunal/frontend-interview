import { useState, useMemo } from 'react';
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
  files?: Record<string, string>;
}

export interface CodeAuditFinding {
  id: string;
  type: 'good' | 'warning' | 'critical';
  title: string;
  description: string;
  recommendation?: string;
}

export interface CodeAuditReport {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  findings: CodeAuditFinding[];
}

export function auditCandidateCode(files: Record<string, string> = {}): CodeAuditReport {
  const code = Object.values(files).join('\n');
  const findings: CodeAuditFinding[] = [];
  let score = 100;

  // 1. Direct DOM Queries check
  const domMatch = code.match(/document\.(getElementById|querySelector|querySelectorAll|getElementsByClassName|getElementsByTagName)/);
  const innerHtmlMatch = code.includes('.innerHTML');
  if (domMatch || innerHtmlMatch) {
    score -= 20;
    findings.push({
      id: 'dom-mutation',
      type: 'critical',
      title: 'Imperative DOM Query Detected',
      description: `Detected direct DOM access (${domMatch ? domMatch[0] : '.innerHTML'}). In React, querying or mutating the DOM directly bypasses the virtual DOM reconciler.`,
      recommendation: 'Use React `useRef()` for DOM node references and declarative state/props to control element attributes and content.'
    });
  } else {
    findings.push({
      id: 'declarative-dom',
      type: 'good',
      title: 'Pure Declarative React',
      description: 'Zero direct DOM queries detected. Relies cleanly on declarative JSX and React virtual DOM synchronization.'
    });
  }

  // 2. Functional State Updaters
  const functionalSetterMatch = code.match(/set[A-Z]\w*\(\s*(prev|\([a-zA-Z0-9_,\s]*\))\s*=>/);
  if (functionalSetterMatch) {
    findings.push({
      id: 'functional-updates',
      type: 'good',
      title: 'Functional State Updaters',
      description: 'Employs functional updaters (`prev => ...`), protecting state updates against stale closure race conditions.'
    });
  } else if (code.includes('useState')) {
    score -= 8;
    findings.push({
      id: 'stale-state-risk',
      type: 'warning',
      title: 'Potential Stale State Closures',
      description: 'State updates detected without functional callbacks (`setVal(prev => ...)`). Rapid sequential triggers may read stale state.',
      recommendation: 'Prefer `setCount(prev => prev + 1)` whenever the next state calculation depends on the prior state.'
    });
  }

  // 3. Mutating Array/Object Methods
  const mutatingMethods = code.match(/\.(push|splice|pop|shift|unshift)\s*\(/);
  if (mutatingMethods) {
    score -= 15;
    findings.push({
      id: 'state-mutation',
      type: 'critical',
      title: `In-Place Array Mutation (.${mutatingMethods[1]}())`,
      description: `Found mutating method \`.${mutatingMethods[1]}()\`. In-place array mutations retain the same memory reference, causing skipped re-renders.`,
      recommendation: 'Use immutable operators like `[...prevArray, item]`, `.filter()`, or `.map()`.'
    });
  } else {
    findings.push({
      id: 'immutable-updates',
      type: 'good',
      title: 'Immutable State Operations',
      description: 'Follows immutable React patterns without destructive in-place array or object mutations.'
    });
  }

  // 4. Timer / Listener Cleanup in useEffect
  const hasTimerOrListener = code.match(/(setInterval|addEventListener|setTimeout)\s*\(/);
  const hasCleanup = code.match(/return\s*\(\s*\)\s*=>\s*\{?[^}]*(clearInterval|removeEventListener|clearTimeout)/);
  if (hasTimerOrListener) {
    if (hasCleanup) {
      findings.push({
        id: 'effect-cleanup',
        type: 'good',
        title: 'Safe Lifecycle Cleanup',
        description: 'Timers and event listeners include teardown functions (`return () => ...`), preventing memory leaks and orphaned intervals.'
      });
    } else {
      score -= 12;
      findings.push({
        id: 'missing-cleanup',
        type: 'warning',
        title: 'Missing Unmount Cleanup Handler',
        description: 'Found `setInterval` or `addEventListener` without explicit cleanup teardown on component unmount.',
        recommendation: 'Return a teardown function inside `useEffect`: `return () => clearInterval(timerId);`'
      });
    }
  }

  // 5. Accessibility & Semantics
  const hasAriaOrSemantic = code.match(/(aria-[a-z]+|role=["'][a-z]+["']|htmlFor|aria-label|aria-live)/);
  if (hasAriaOrSemantic) {
    findings.push({
      id: 'a11y-attributes',
      type: 'good',
      title: 'Accessible ARIA Considerations',
      description: 'Includes semantic labels or ARIA attributes, demonstrating production accessibility standards.'
    });
  } else {
    score -= 5;
    findings.push({
      id: 'missing-a11y',
      type: 'warning',
      title: 'Minimal Accessibility Annotations',
      description: 'No explicit ARIA attributes (e.g. aria-label, aria-live) detected for assistive screen readers.',
      recommendation: 'Add `aria-label` on icon buttons and `aria-live="polite"` for dynamic counters or alerts.'
    });
  }

  // 6. Leftover Debug Console Logs
  const consoleMatch = code.match(/console\.log\s*\(/);
  if (consoleMatch) {
    score -= 5;
    findings.push({
      id: 'console-logs',
      type: 'warning',
      title: 'Leftover Debug Logs (console.log)',
      description: 'Found `console.log()` statements left in the candidate submission.',
      recommendation: 'Remove active debugging logs before finalizing technical rounds.'
    });
  }

  const finalScore = Math.max(20, Math.min(100, score));
  let auditGrade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'C';
  if (finalScore >= 95) auditGrade = 'A+';
  else if (finalScore >= 85) auditGrade = 'A';
  else if (finalScore >= 70) auditGrade = 'B';
  else if (finalScore >= 50) auditGrade = 'C';
  else auditGrade = 'D';

  return {
    score: finalScore,
    grade: auditGrade,
    findings,
  };
}

interface Props {
  data: ScorecardData;
  onClose: () => void;
  onReviewSolution: () => void;
  onRetry: () => void;
  onOpenDiff?: () => void;
}

export default function InterviewScorecardModal({ data, onClose, onReviewSolution, onRetry, onOpenDiff }: Props) {
  const { question, timeSpentSeconds, totalDurationSeconds, testResults, passedTests, totalTests, files = {} } = data;
  const [copiedReport, setCopiedReport] = useState(false);

  const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
  const timeUsedPct = (timeSpentSeconds / totalDurationSeconds) * 100;

  // Run Senior Staff Static Code & Anti-Pattern Analysis
  const auditReport = useMemo(() => auditCandidateCode(files), [files]);

  // Overall Grade & Hire Recommendation (combines tests, time, and code quality)
  let recommendation: 'STRONG HIRE' | 'HIRE' | 'LEAN HIRE' | 'NO HIRE' = 'NO HIRE';
  let grade = 'C';
  const overallScore = Math.round((passRate * 0.5) + (auditReport.score * 0.3) + (timeUsedPct <= 75 ? 20 : timeUsedPct <= 100 ? 10 : 0));

  if (passRate === 100 && auditReport.score >= 85) {
    if (timeUsedPct <= 65) {
      recommendation = 'STRONG HIRE';
      grade = 'A+';
    } else {
      recommendation = 'HIRE';
      grade = 'A';
    }
  } else if (passRate >= 75 && auditReport.score >= 70) {
    recommendation = 'LEAN HIRE';
    grade = 'B';
  } else if (passRate >= 50) {
    recommendation = 'NO HIRE';
    grade = 'C';
  } else {
    recommendation = 'NO HIRE';
    grade = 'D';
  }

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}m ${String(remainder).padStart(2, '0')}s`;
  };

  const handleCopyReport = () => {
    const reportText = `# 🏆 FAANG Machine Coding Evaluation Report
- **Problem**: ${question.id}: ${question.title}
- **Candidate Verdict**: ${recommendation} (Grade: ${grade} | Overall: ${overallScore}/100)
- **Test Suite Pass Rate**: ${passedTests}/${totalTests} (${Math.round(passRate)}%)
- **Time Utilization**: ${formatDuration(timeSpentSeconds)} of ${formatDuration(totalDurationSeconds)} (${Math.round(timeUsedPct)}%)
- **Code Quality Rating**: Grade ${auditReport.grade} (${auditReport.score}/100)

## 🔍 Code Quality & Anti-Pattern Audit:
${auditReport.findings.map(f => `- [${f.type.toUpperCase()}] ${f.title}: ${f.description}${f.recommendation ? `\n  💡 Tip: ${f.recommendation}` : ''}`).join('\n')}

---
*Generated by React Machine Coding Masterclass Studio*`;

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
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
            <span className="mc-score-number">{overallScore}</span>
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
            <div className="mc-metric-label">TEST PASS RATE</div>
            <div className="mc-metric-value" style={{ color: passRate === 100 ? '#22c55e' : '#f59e0b' }}>
              {passedTests}/{totalTests} ({Math.round(passRate)}%)
            </div>
            <div className="mc-metric-sub">automated DOM assertions</div>
          </div>

          <div className="mc-metric-card">
            <div className="mc-metric-label">CODE QUALITY AUDIT</div>
            <div className="mc-metric-value" style={{ color: auditReport.score >= 85 ? '#22c55e' : '#38bdf8' }}>
              {auditReport.score}/100
            </div>
            <div className="mc-metric-sub">Grade {auditReport.grade} • Anti-Pattern check</div>
          </div>
        </div>

        {/* Static Code Quality & Anti-Pattern Audit Section */}
        <div className="mc-audit-section">
          <div className="mc-audit-header">
            <div className="mc-audit-title">
              <span>🔍</span> Senior Staff Code Quality & Anti-Pattern Audit
            </div>
            <span className={`mc-audit-score-pill grade-${auditReport.grade.toLowerCase().replace('+', '')}`}>
              Grade {auditReport.grade} • {auditReport.score}/100
            </span>
          </div>

          <div className="mc-audit-list">
            {auditReport.findings.map(finding => (
              <div key={finding.id} className={`mc-audit-item ${finding.type}`}>
                <div className="mc-audit-item-top">
                  <span className="mc-audit-item-title">
                    {finding.type === 'good' ? '✓' : finding.type === 'warning' ? '⚠️' : '✕'} {finding.title}
                  </span>
                  <span className={`mc-audit-badge ${finding.type}`}>
                    {finding.type === 'good' ? 'Clean Pattern' : finding.type === 'warning' ? 'Warning' : 'Anti-Pattern'}
                  </span>
                </div>
                <div className="mc-audit-desc">{finding.description}</div>
                {finding.recommendation && (
                  <div className="mc-audit-rec">
                    <strong>💡 Senior Staff Tip:</strong> {finding.recommendation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Copy Report Button */}
          <button type="button" className="mc-btn-copy-report" onClick={handleCopyReport}>
            <span>{copiedReport ? '✓ Report Copied to Clipboard!' : '📋 Copy Senior Staff Evaluation Report'}</span>
          </button>
        </div>

        {/* Test Assertions Breakdown */}
        <div className="mc-scorecard-section" style={{ marginTop: '18px' }}>
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
        <div className="mc-scorecard-section mc-staff-notes" style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#38bdf8', marginBottom: '6px' }}>
            INTERVIEW COMMITTEE SYNTHESIS
          </div>
          <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
            {passRate === 100 && auditReport.score >= 85
              ? 'Outstanding performance. The candidate combined complete functional edge-case coverage with production-grade declarative React patterns and clean lifecycle management.'
              : passRate >= 75
              ? 'Strong attempt with viable foundations. Review the anti-pattern recommendations above and inspect the reference solution to refine state granularity.'
              : 'The submission missed key functional specifications or exhibited critical anti-patterns. Review the reference solution below and retry the simulation.'}
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
