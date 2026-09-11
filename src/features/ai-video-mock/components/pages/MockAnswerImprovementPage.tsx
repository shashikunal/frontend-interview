import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import type { InterviewAnswer, EvaluationReport } from '../../types/mock.types';
import { mockSessionService } from '../../services/mockSessionService';
import { answerEvaluationService } from '../../services/answerEvaluationService';
import { communicationService } from '../../services/communicationService';
import { getMockQuestionById } from '../../data/questionBankRegistry';

export default function MockAnswerImprovementPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sessionId = searchParams.get('sessionId') || '';
  const questionId = searchParams.get('questionId') || '';

  const [originalAnswer, setOriginalAnswer] = useState<InterviewAnswer | null>(null);
  const [revisedText, setRevisedText] = useState('');
  const [revisedCode, setRevisedCode] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [revisedEvaluation, setRevisedEvaluation] = useState<EvaluationReport | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [attemptCount, setAttemptCount] = useState(2);

  useEffect(() => {
    if (sessionId) {
      const session = mockSessionService.getSession(sessionId);
      if (session) {
        const found = session.answers.find(a => a.questionId === questionId || a.id === questionId);
        if (found) {
          setOriginalAnswer(found);
          if (found.mode === 'code') {
            setRevisedCode(found.submittedCode || found.question.starterCode || found.question.programmingSpec?.starterCode || '');
          } else {
            setRevisedText(found.transcript?.cleanedText || found.transcript?.cleanedTranscript || '');
          }
          return;
        }
      }
    }

    // Fallback if no session: load question directly for standalone practice
    if (questionId) {
      const q = getMockQuestionById(questionId);
      if (q) {
        setOriginalAnswer({
          id: `ans_demo_${q.id}`,
          sessionId: 'demo_session',
          questionNumber: 1,
          questionId: q.id,
          question: q,
          mode: (q.questionType === 'Programming' || q.questionType === 'Machine Coding') ? 'code' : 'speech',
          status: 'EVALUATED',
          timeSpentSeconds: 65,
          startedAt: new Date().toISOString(),
          evaluation: {
            id: `eval_demo_${q.id}`,
            answerId: `ans_demo_${q.id}`,
            questionId: q.id,
            numericScore: 5.5,
            letterGrade: 'C',
            confidence: 'High',
            rubricBreakdown: {
              technicalAccuracy: 5.0,
              depthAndCompleteness: 5.5,
              senioritySignaling: 5.0,
              architectureTradeoffs: 5.0,
              communicationClarity: 6.5,
            },
            evaluationRubricScores: {
              correctness: 5.5,
              conceptualDepth: 5.0,
              practicalKnowledge: 5.5,
              communication: 6.5,
              problemSolving: 5.0,
            },
            comparison: {
              correctConcepts: [q.expectedConcepts[0] || 'Core Syntax'],
              missingConcepts: q.expectedConcepts.slice(1),
              incorrectConcepts: [],
            },
            whyMarksLost: ['Lacked in-depth discussion of edge cases', 'Did not address production trade-offs'],
            positiveHighlights: ['Recognized foundational terminology.'],
            experienceAwareFeedback: 'Deepen understanding of edge cases and memory implications.',
            improvedAnswer: q.rubric.strongAnswer,
            selfCorrectionDetected: false,
            honestIDontKnow: false,
            modelInfo: {
              modelName: 'deterministic-rules-engine',
              modelVersion: '1.0',
              promptVersion: '1.0',
              rubricVersion: '1.0',
              evaluatedAt: new Date().toISOString(),
            },
          },
        });
        if (q.questionType === 'Programming' || q.questionType === 'Machine Coding') {
          setRevisedCode(q.starterCode || q.programmingSpec?.starterCode || '// Write solution here\n');
        }
      }
    }
  }, [sessionId, questionId]);

  // Speech Recognition for Try-Again voice response
  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your revised answer below.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognizer = new SpeechRecognition();
      recognizer.continuous = true;
      recognizer.interimResults = true;
      recognizer.lang = 'en-US';

      recognizer.onstart = () => setIsRecording(true);
      recognizer.onend = () => setIsRecording(false);
      recognizer.onerror = () => setIsRecording(false);

      recognizer.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        setRevisedText(transcript);
      };

      recognizer.start();
    } catch {
      setIsRecording(false);
    }
  };

  const handleEvaluateRevision = async () => {
    if (!originalAnswer) return;
    setIsEvaluating(true);

    try {
      const commReport = communicationService.analyzeTranscript(revisedText, 60);

      const evalResult = await answerEvaluationService.evaluateAnswer({
        question: originalAnswer.question,
        candidateAnswerText: originalAnswer.mode === 'code' ? revisedCode : revisedText,
        submittedCode: originalAnswer.mode === 'code' ? revisedCode : undefined,
        experienceTier: '6-8',
        claimedYears: 6,
        communicationMetrics: commReport,
      });

      setRevisedEvaluation(evalResult);
      setAttemptCount(prev => prev + 1);

      // If tied to an active session, update session
      if (sessionId) {
        const session = mockSessionService.getSession(sessionId);
        if (session) {
          const ansIdx = session.answers.findIndex(a => a.id === originalAnswer.id || a.questionId === originalAnswer.questionId);
          if (ansIdx !== -1) {
            session.answers[ansIdx].evaluation = evalResult;
            if (originalAnswer.mode === 'code') {
              session.answers[ansIdx].submittedCode = revisedCode;
            } else {
              session.answers[ansIdx].transcript = {
                id: `tr_${Date.now()}`,
                version: (session.answers[ansIdx].transcript?.version || 1) + 1,
                rawTranscript: revisedText,
                cleanedTranscript: revisedText,
                rawText: revisedText,
                cleanedText: revisedText,
                wpm: commReport.wpm,
                language: 'en-US',
                provider: 'web-speech-api',
                model: 'web-speech-api',
                confidence: 0.95,
                timestamp: new Date().toISOString(),
              };
            }
            mockSessionService.saveSessionLocally(session);
          }
        }
      }
    } catch (err) {
      console.error('Failed to evaluate revised answer:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  if (!originalAnswer) {
    return (
      <div className="ai-vm-container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: 12 }}>No Question Selected For Improvement</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
          Please select a question from your interview scorecard or weak-areas practice to try again.
        </p>
        <Link to="/ai-video-mock/practice" className="ai-vm-btn-primary">
          Go To Practice Weak Areas →
        </Link>
      </div>
    );
  }

  const origEval = originalAnswer.evaluation;
  const scoreDelta = revisedEvaluation && origEval
    ? Number((revisedEvaluation.numericScore - origEval.numericScore).toFixed(1))
    : null;

  // Concept delta
  const conceptsGained = revisedEvaluation && origEval
    ? revisedEvaluation.comparison.correctConcepts.filter((c: string) => !origEval.comparison.correctConcepts.includes(c))
    : [];

  const remainingGaps = revisedEvaluation
    ? revisedEvaluation.comparison.missingConcepts
    : (origEval?.comparison.missingConcepts || []);

  return (
    <div className="ai-vm-container" style={{ maxWidth: 1200, padding: '32px 20px' }}>
      {/* Breadcrumb & Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
            Answer Improvement Mode · Attempt #{attemptCount}
          </div>
          <h1 style={{ fontSize: '1.6rem', margin: 0, fontWeight: 800 }}>
            Try Again & Close Knowledge Gaps
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {sessionId && (
            <button
              type="button"
              className="ai-vm-btn-secondary"
              onClick={() => navigate(`/ai-video-mock/result/${sessionId}`)}
            >
              ← Back to Scorecard
            </button>
          )}
        </div>
      </div>

      {/* Target Question Context Card */}
      <div className="ai-vm-card" style={{ marginBottom: 24, borderLeft: '4px solid #818cf8' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {originalAnswer.question.technology.toUpperCase()} · {originalAnswer.question.topic} · {originalAnswer.question.difficulty}
          </span>
          <span className="ai-vm-badge" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#818cf8' }}>
            {originalAnswer.question.questionType}
          </span>
        </div>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 10px' }}>
          {originalAnswer.question.question}
        </h2>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Expected Core Concepts: {originalAnswer.question.expectedConcepts.join(', ')}
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Left: Original Answer & Evaluation */}
        <div className="ai-vm-card" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              ORIGINAL ATTEMPT (#1)
            </span>
            {origEval && (
              <span style={{ fontWeight: 800, color: origEval.numericScore >= 8 ? '#10b981' : '#f59e0b' }}>
                {origEval.numericScore} / 10 ({origEval.letterGrade})
              </span>
            )}
          </div>

          <div style={{ minHeight: 140, fontSize: '0.88rem', lineHeight: 1.5, whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', background: 'var(--bg)', padding: 12, borderRadius: 8, border: '1px solid var(--border)', marginBottom: 14 }}>
            {originalAnswer.mode === 'code'
              ? (originalAnswer.submittedCode || '// No code submitted')
              : (originalAnswer.transcript?.cleanedText || 'No transcript recorded')}
          </div>

          {origEval && (
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#10b981', marginBottom: 6 }}>
                Covered Concepts ({origEval.comparison.correctConcepts.length}):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                {origEval.comparison.correctConcepts.map((c: string) => (
                  <span key={c} className="ai-vm-concept-pill correct" style={{ fontSize: '0.72rem' }}>
                    ✓ {c}
                  </span>
                ))}
              </div>

              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ef4444', marginBottom: 6 }}>
                Missed Concepts ({origEval.comparison.missingConcepts.length}):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {origEval.comparison.missingConcepts.map((c: string) => (
                  <span key={c} className="ai-vm-concept-pill missing" style={{ fontSize: '0.72rem' }}>
                    ✗ {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Revised Attempt Workspace */}
        <div className="ai-vm-card" style={{ border: '1px solid #818cf8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#818cf8' }}>
              REVISED ATTEMPT (#{attemptCount})
            </span>
            {originalAnswer.mode !== 'code' && (
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: isRecording ? '#ef4444' : 'rgba(99, 102, 241, 0.15)',
                  color: isRecording ? '#fff' : '#818cf8',
                  border: 'none',
                }}
              >
                {isRecording ? '⏹ Stop Recording' : '🎙 Record Voice'}
              </button>
            )}
          </div>

          {originalAnswer.mode === 'code' ? (
            <textarea
              className="ai-vm-input"
              rows={10}
              value={revisedCode}
              onChange={e => setRevisedCode(e.target.value)}
              placeholder="Refine your code solution, handling edge cases and clean abstractions..."
              style={{ fontFamily: 'monospace', fontSize: '0.85rem', width: '100%', marginBottom: 14 }}
            />
          ) : (
            <textarea
              className="ai-vm-input"
              rows={8}
              value={revisedText}
              onChange={e => setRevisedText(e.target.value)}
              placeholder="Speak or type your improved answer. Cover the missing concepts identified on the left..."
              style={{ fontSize: '0.88rem', width: '100%', marginBottom: 14 }}
            />
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="ai-vm-btn-primary"
              disabled={isEvaluating || (!revisedText.trim() && !revisedCode.trim())}
              onClick={handleEvaluateRevision}
            >
              {isEvaluating ? 'Evaluating Revision...' : 'Evaluate Revised Answer ⚡'}
            </button>
          </div>
        </div>
      </div>

      {/* Delta Analysis Section (Rendered after evaluation) */}
      {revisedEvaluation && (
        <div className="ai-vm-card" style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.3)', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>
                DELTA ANALYSIS COMPLETE
              </div>
              <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>
                Score & Concept Improvements
              </h3>
            </div>

            {/* Score Delta Pill */}
            {scoreDelta !== null && (
              <div style={{ textAlign: 'center', background: 'var(--bg)', padding: '8px 18px', borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: scoreDelta >= 0 ? '#10b981' : '#ef4444' }}>
                  {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta} pts
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  {origEval?.numericScore} → {revisedEvaluation.numericScore} / 10
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 16 }}>
            {/* Concepts Gained */}
            <div style={{ background: 'var(--bg)', padding: 14, borderRadius: 10, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981', marginBottom: 8 }}>
                ✨ Concepts Gained (+{conceptsGained.length}):
              </div>
              {conceptsGained.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {conceptsGained.map((c: string) => (
                    <span key={c} className="ai-vm-concept-pill correct" style={{ fontSize: '0.75rem' }}>
                      ✓ {c}
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  No new unique concepts gained in this attempt.
                </div>
              )}
            </div>

            {/* Remaining Gaps */}
            <div style={{ background: 'var(--bg)', padding: 14, borderRadius: 10, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ef4444', marginBottom: 8 }}>
                ⚠️ Remaining Gaps ({remainingGaps.length}):
              </div>
              {remainingGaps.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {remainingGaps.map((c: string) => (
                    <span key={c} className="ai-vm-concept-pill missing" style={{ fontSize: '0.75rem' }}>
                      ✗ {c}
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 600 }}>
                  🎉 All expected core concepts fully satisfied!
                </div>
              )}
            </div>
          </div>

          {/* Model Answer Reminder */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: 12, borderRadius: 8, fontSize: '0.84rem' }}>
            <span style={{ fontWeight: 700, color: '#818cf8' }}>Senior Production Standard: </span>
            {originalAnswer.question.rubric.strongAnswer}
          </div>
        </div>
      )}
    </div>
  );
}
