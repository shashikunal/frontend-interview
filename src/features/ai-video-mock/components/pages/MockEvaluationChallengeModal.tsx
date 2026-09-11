import { useState } from 'react';
import type { InterviewAnswer } from '../../types/mock.types';

interface MockEvaluationChallengeModalProps {
  answer: InterviewAnswer;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

const LOCAL_CHALLENGES_KEY = 'ai_video_mock_challenges_v1';

export interface EvaluationChallengeRecord {
  id: string;
  sessionId: string;
  answerId: string;
  questionId: string;
  questionNumber: number;
  originalNumericScore: number;
  originalLetterGrade: string;
  category: 'evaluation_incorrect' | 'ai_misunderstood' | 'expected_answer_wrong' | 'question_ambiguous' | 'technical_disagreement';
  candidateReason: string;
  suggestedScore?: number;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export default function MockEvaluationChallengeModal({
  answer,
  onClose,
  onSubmitSuccess,
}: MockEvaluationChallengeModalProps) {
  const [category, setCategory] = useState<EvaluationChallengeRecord['category']>('ai_misunderstood');
  const [reason, setReason] = useState('');
  const [suggestedScore, setSuggestedScore] = useState<number>(Math.min(10, (answer.evaluation?.numericScore || 5) + 2));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);

    const challenge: EvaluationChallengeRecord = {
      id: `chal_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      sessionId: answer.sessionId,
      answerId: answer.id,
      questionId: answer.questionId,
      questionNumber: answer.questionNumber,
      originalNumericScore: answer.evaluation?.numericScore || 0,
      originalLetterGrade: answer.evaluation?.letterGrade || 'C',
      category,
      candidateReason: reason.trim(),
      suggestedScore,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = localStorage.getItem(LOCAL_CHALLENGES_KEY);
      const list: EvaluationChallengeRecord[] = existing ? JSON.parse(existing) : [];
      list.unshift(challenge);
      localStorage.setItem(LOCAL_CHALLENGES_KEY, JSON.stringify(list));
    } catch (err) {
      console.warn('Failed to save challenge locally:', err);
    }

    setIsSubmitting(false);
    setIsDone(true);
    setTimeout(() => {
      onSubmitSuccess();
      onClose();
    }, 1500);
  };

  return (
    <div className="ai-vm-modal-overlay">
      <div className="ai-vm-modal-card" style={{ maxWidth: 580 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 14, marginBottom: 18 }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem' }}>⚖️ Challenge Evaluation / Report Feedback</h3>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            ✕
          </button>
        </div>

        {isDone ? (
          <div style={{ padding: '30px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>✓</div>
            <h4 style={{ margin: '0 0 6px', color: '#10b981' }}>Challenge Submitted for Admin Audit</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Your challenge and reasoning have been preserved. Original AI score remains intact until reviewed by staff.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Question #{answer.questionNumber}: <strong>{answer.question.question}</strong>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 6 }}>
                Challenge Category:
              </label>
              <select
                className="ai-vm-select"
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                style={{ width: '100%' }}
              >
                <option value="ai_misunderstood">AI Misunderstood My Answer / Vocabulary</option>
                <option value="technical_disagreement">Technical Disagreement with Evaluation Rubric</option>
                <option value="expected_answer_wrong">Expected Reference Answer is Outdated / Inaccurate</option>
                <option value="question_ambiguous">Question Phrasing was Ambiguous or Misleading</option>
                <option value="evaluation_incorrect">Score Deduction Too Harsh for Depth Provided</option>
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 6 }}>
                Detailed Technical Reasoning &amp; Evidence:
              </label>
              <textarea
                className="ai-vm-input"
                rows={4}
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Explain why the AI evaluation or deduction was inaccurate, referencing specs or production standards..."
                required
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 6 }}>
                Candidate Expected Score (0 - 10):
              </label>
              <input
                type="number"
                min={0}
                max={10}
                step={0.5}
                className="ai-vm-input"
                value={suggestedScore}
                onChange={e => setSuggestedScore(Number(e.target.value))}
                style={{ width: 120 }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" className="ai-vm-btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="ai-vm-btn-primary"
                disabled={isSubmitting || !reason.trim()}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Challenge →'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
