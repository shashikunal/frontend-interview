import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { SubjectId, QuestionDifficulty, ExperienceLevel, InterviewSessionState } from '../types/docs.types';
import { ALL_SUBJECTS_CATALOG } from '../data/subjectsCatalog';
import { interviewSimulatorService } from '../services/interviewSimulatorService';
import { docsProgressService } from '../services/docsProgressService';
import { SafeMarkdownViewer } from './common/SafeMarkdownViewer';

export function DocsInterviewStudio() {
  // Configuration
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectId[]>(['react', 'javascript', 'typescript']);
  const [difficulty, setDifficulty] = useState<QuestionDifficulty | 'mixed'>('mixed');
  const [experience, setExperience] = useState<ExperienceLevel>('senior');
  const [questionCount, setQuestionCount] = useState<number>(5);

  // Active Session
  const [session, setSession] = useState<InterviewSessionState | null>(null);
  const [revealedAnswer, setRevealedAnswer] = useState(false);

  const toggleSubjectSelection = (subId: SubjectId) => {
    setSelectedSubjects(prev => {
      if (prev.includes(subId)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(s => s !== subId);
      }
      return [...prev, subId];
    });
  };

  const handleStartInterview = () => {
    const newSession = interviewSimulatorService.createInterviewSession({
      subjectIds: selectedSubjects,
      difficulty,
      experience,
      questionCount,
    });
    setSession(newSession);
    setRevealedAnswer(false);
  };

  const handleRateAnswer = (rating: number) => {
    if (!session) return;
    const currentQ = session.questions[session.currentIndex];
    const updatedRatings = { ...session.userRatings, [currentQ.id]: rating };

    if (session.currentIndex + 1 < session.questions.length) {
      setSession({
        ...session,
        currentIndex: session.currentIndex + 1,
        activeFollowUpIndex: -1,
        userRatings: updatedRatings,
      });
      setRevealedAnswer(false);
    } else {
      // Completed!
      const finishedSession: InterviewSessionState = {
        ...session,
        isFinished: true,
        userRatings: updatedRatings,
        completedAt: new Date().toISOString(),
      };
      const scoreSummary = interviewSimulatorService.evaluateSession(finishedSession);
      finishedSession.scoreSummary = scoreSummary;
      setSession(finishedSession);
      docsProgressService.recordInterviewCompleted();
    }
  };

  const currentQ = session && !session.isFinished ? session.questions[session.currentIndex] : null;

  return (
    <div className="docs-interview-studio-container">
      {/* Studio Header */}
      <div className="interview-header-card">
        <span className="ih-badge">🎙️ REALISTIC INTERVIEW SIMULATOR</span>
        <h2>Frontend Technical Interview Loop</h2>
        <p>
          Simulate a multi-round technical interview loop with dynamic follow-up chains, interviewer competency signals, and senior readiness diagnosis.
        </p>
      </div>

      {/* Setup Config Screen */}
      {!session && (
        <div className="interview-setup-panel">
          <h3 className="setup-title">Configure Interview Loop</h3>

          {/* Subject Multi-Select */}
          <div className="setup-field">
            <label>Select Tracks to Test (Multi-Select)</label>
            <div className="subject-tags-grid">
              {ALL_SUBJECTS_CATALOG.map(s => {
                const isSelected = selectedSubjects.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={`subject-tag-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleSubjectSelection(s.id)}
                  >
                    <span>{s.icon}</span>
                    <span>{s.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="setup-dual-row">
            <div className="setup-field">
              <label>Experience Level</label>
              <select
                value={experience}
                onChange={e => setExperience(e.target.value as any)}
                className="config-select"
              >
                <option value="junior">Junior Developer</option>
                <option value="mid-level">Mid-Level Engineer</option>
                <option value="senior">Senior Engineer (Staff / Principal)</option>
                <option value="architect">Lead / Solutions Architect</option>
              </select>
            </div>

            <div className="setup-field">
              <label>Loop Length</label>
              <select
                value={questionCount}
                onChange={e => setQuestionCount(Number(e.target.value))}
                className="config-select"
              >
                <option value={3}>3 Questions (Quick Screen - 15m)</option>
                <option value={5}>5 Questions (Standard Technical Loop - 30m)</option>
                <option value={10}>10 Questions (Full Day Loop - 60m)</option>
              </select>
            </div>

            <div className="setup-field">
              <label>Difficulty Distribution</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as any)}
                className="config-select"
              >
                <option value="mixed">Mixed Progression (Easy &rarr; Hard)</option>
                <option value="intermediate">Intermediate Standards</option>
                <option value="difficult">Difficult Only (Staff Level)</option>
              </select>
            </div>
          </div>

          <div className="setup-footer">
            <button
              type="button"
              className="start-interview-btn"
              onClick={handleStartInterview}
            >
              🎙️ Begin Simulated Interview →
            </button>
          </div>
        </div>
      )}

      {/* Active Interview Question */}
      {session && !session.isFinished && currentQ && (
        <div className="active-interview-box">
          <div className="interview-q-header">
            <div className="iq-meta">
              <span className="iq-round-pill">
                QUESTION {session.currentIndex + 1} OF {session.questions.length}
              </span>
              <span className="iq-track-pill">{currentQ.subjectId.toUpperCase()}</span>
              <span className="iq-diff-pill">{currentQ.difficulty.toUpperCase()}</span>
            </div>
            <h3 className="iq-question-text">{currentQ.question}</h3>
          </div>

          {/* Interviewer Signal Box */}
          {currentQ.whyAsked && (
            <div className="interviewer-signal-box">
              <span className="is-badge">🎯 INTERVIEWER SIGNAL</span>
              <p><strong>Testing Objective:</strong> {currentQ.whyAsked.testingObjective}</p>
            </div>
          )}

          {!revealedAnswer ? (
            <div className="interview-answer-prompt">
              <p>🗣️ State your complete technical answer out loud as you would to a senior hiring manager.</p>
              <button
                type="button"
                className="reveal-senior-btn"
                onClick={() => setRevealedAnswer(true)}
              >
                Reveal Benchmarked Senior Answer &amp; Self-Score
              </button>
            </div>
          ) : (
            <div className="interview-benchmarked-answer">
              <div className="answer-section">
                <h4>Benchmark Strong Answer:</h4>
                <SafeMarkdownViewer content={currentQ.detailedAnswer} />
                {currentQ.seniorAnswer && (
                  <div className="senior-addendum">
                    <strong>Architect Perspective:</strong>
                    <SafeMarkdownViewer content={currentQ.seniorAnswer} />
                  </div>
                )}
              </div>

              {/* Follow-up Question Chains */}
              {currentQ.followUps && currentQ.followUps.length > 0 && (
                <div className="interview-followup-box">
                  <h4>Anticipated Follow-Up Questions:</h4>
                  {currentQ.followUps.map(fu => (
                    <div key={fu.id} className="fu-item">
                      <p><strong>{fu.depthLevel.toUpperCase()}:</strong> {fu.question}</p>
                      <p className="fu-ans"><em>Expected:</em> {fu.expectedAnswer}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* 5-Star Self-Scoring Rubric */}
              <div className="interview-scoring-bar">
                <span className="scoring-label">Self-Evaluate Your Delivery (1 = Poor, 5 = Flawless):</span>
                <div className="star-buttons-row">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className="rating-star-btn"
                      onClick={() => handleRateAnswer(star)}
                    >
                      {star} ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Finished Interview Evaluation Report */}
      {session && session.isFinished && session.scoreSummary && (
        <div className="interview-results-dossier">
          <div className="verdict-banner">
            <span className="verdict-tag">{session.scoreSummary.readinessGrade}</span>
            <h2>Technical Interview Performance Score: {session.scoreSummary.overallPercentage}%</h2>
          </div>

          <div className="dossier-grid">
            <div className="dossier-card strengths-card">
              <h4>💪 Core Strengths</h4>
              <ul>
                {session.scoreSummary.strengths.length > 0 ? (
                  session.scoreSummary.strengths.map((s, idx) => <li key={idx}>✓ {s}</li>)
                ) : (
                  <li>Practice more foundational tracks to build confidence.</li>
                )}
              </ul>
            </div>

            <div className="dossier-card weaknesses-card">
              <h4>🎯 Recommended Focus Areas</h4>
              <ul>
                {session.scoreSummary.weaknesses.length > 0 ? (
                  session.scoreSummary.weaknesses.map((w, idx) => <li key={idx}>⚠️ {w}</li>)
                ) : (
                  <li>Excellent technical coverage across all tested tracks.</li>
                )}
              </ul>
            </div>
          </div>

          <div className="dossier-actions-bar">
            <button
              type="button"
              className="start-interview-btn"
              onClick={() => setSession(null)}
            >
              🔄 Launch Another Interview Loop
            </button>
            <Link to="/docs" className="return-docs-link">
              ← Return to Documentation
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
