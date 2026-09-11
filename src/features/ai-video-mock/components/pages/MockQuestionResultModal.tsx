import { useState } from 'react';
import type { InterviewAnswer } from '../../types/mock.types';
import MockEvaluationChallengeModal from './MockEvaluationChallengeModal';

interface MockQuestionResultModalProps {
  answer: InterviewAnswer;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

export default function MockQuestionResultModal({
  answer,
  onNextQuestion,
  isLastQuestion,
}: MockQuestionResultModalProps) {
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeNotice, setChallengeNotice] = useState(false);

  const e = answer.evaluation;
  if (!e) return null;

  return (
    <div className="ai-vm-modal-overlay">
      <div className="ai-vm-modal-card">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
              Question #{answer.questionNumber} Assessment · {answer.question.topic}
            </div>
            <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>
              {answer.question.question}
            </h2>
          </div>

          <div style={{ textAlign: 'center', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '8px 16px', borderRadius: 12 }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#818cf8' }}>
              {e.numericScore} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>/ 10</span>
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a855f7' }}>
              Grade: {e.letterGrade}
            </div>
          </div>
        </div>

        {/* Candidate Answer vs Expected Answer */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 20 }}>
          <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 12, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
              YOUR ANSWER:
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.5, margin: 0, whiteSpace: 'pre-wrap' }}>
              {answer.transcript?.cleanedText || answer.submittedCode || 'No answer recorded.'}
            </p>
          </div>

          <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 12, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981', marginBottom: 8 }}>
              EXPECTED REFERENCE ANSWER:
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
              {answer.question.rubric.strongAnswer}
            </p>
          </div>
        </div>

        {/* Concept Comparison Breakdown */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 8 }}>
            Conceptual Evaluation Breakdown:
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {e.comparison.correctConcepts.map(c => (
              <span key={c} className="ai-vm-concept-pill correct">
                ✓ {c}
              </span>
            ))}
            {e.comparison.missingConcepts.map(c => (
              <span key={c} className="ai-vm-concept-pill missing">
                ✗ Missing: {c}
              </span>
            ))}
          </div>

          {e.comparison.incorrectConcepts.length > 0 && (
            <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 8, padding: '8px 12px', fontSize: '0.82rem', color: '#f87171' }}>
              ⚠️ {e.comparison.incorrectConcepts.join(' ')}
            </div>
          )}
        </div>

        {/* Why Marks Were Lost */}
        {e.whyMarksLost.length > 0 && (
          <div style={{ marginBottom: 20, background: 'var(--surface-hover)', padding: 14, borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f59e0b', marginBottom: 6 }}>
              Why Marks Were Lost:
            </div>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.85rem', lineHeight: 1.5 }}>
              {e.whyMarksLost.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Improved Senior-Level Answer */}
        <div style={{ marginBottom: 24, background: 'rgba(99, 102, 241, 0.06)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: 16, borderRadius: 12 }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#818cf8', marginBottom: 6 }}>
            💡 Senior-Level Model Answer:
          </div>
          <p style={{ fontSize: '0.88rem', lineHeight: 1.5, margin: 0, color: 'var(--text-primary)' }}>
            {e.improvedAnswer}
          </p>
        </div>

        {/* 5-Pillar Rubric Breakdown */}
        {e.rubricBreakdown && (
          <div style={{ marginBottom: 20, background: 'var(--bg)', padding: 14, borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10 }}>
              5-DIMENSIONAL RUBRIC SCORING:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
              {[
                { label: 'Technical Accuracy', val: e.rubricBreakdown.technicalAccuracy },
                { label: 'Depth & Completeness', val: e.rubricBreakdown.depthAndCompleteness },
                { label: 'Seniority Signaling', val: e.rubricBreakdown.senioritySignaling },
                { label: 'Architecture & Tradeoffs', val: e.rubricBreakdown.architectureTradeoffs },
                { label: 'Communication Clarity', val: e.rubricBreakdown.communicationClarity },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                    <span style={{ fontWeight: 700, color: item.val >= 8 ? '#10b981' : item.val >= 6 ? '#818cf8' : '#f59e0b' }}>
                      {item.val.toFixed(1)}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: 4, background: 'var(--surface-hover)', borderRadius: 2, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${(item.val / 10) * 100}%`,
                        height: '100%',
                        background: item.val >= 8 ? '#10b981' : item.val >= 6 ? '#6366f1' : '#f59e0b',
                        borderRadius: 2,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <a
              href={`/ai-video-mock/improve?sessionId=${answer.sessionId}&questionId=${answer.questionId}`}
              className="ai-vm-btn-secondary"
              style={{ fontSize: '0.85rem', padding: '10px 16px', textDecoration: 'none' }}
            >
              🔄 Try Again (Improve)
            </a>

            <button
              type="button"
              className="ai-vm-btn-secondary"
              onClick={() => setShowChallengeModal(true)}
              style={{ fontSize: '0.85rem', padding: '10px 16px' }}
            >
              ⚖️ Challenge Evaluation
            </button>
          </div>

          <button
            type="button"
            className="ai-vm-btn-primary"
            onClick={onNextQuestion}
            style={{ padding: '12px 28px', fontSize: '0.95rem' }}
          >
            {isLastQuestion ? 'Complete Interview & View Scorecard →' : 'Next Question →'}
          </button>
        </div>

        {challengeNotice && (
          <div style={{ marginTop: 12, fontSize: '0.78rem', color: '#10b981', textAlign: 'center' }}>
            ✓ Challenge logged successfully for reviewer audit.
          </div>
        )}
      </div>

      {showChallengeModal && (
        <MockEvaluationChallengeModal
          answer={answer}
          onClose={() => setShowChallengeModal(false)}
          onSubmitSuccess={() => setChallengeNotice(true)}
        />
      )}
    </div>
  );
}
