import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { SubjectId, QuestionDifficulty, ExperienceLevel, InterviewSessionState, InterviewQuestion } from '../types/docs.types';
import { ALL_SUBJECTS_CATALOG } from '../data/subjectsCatalog';
import { interviewSimulatorService } from '../services/interviewSimulatorService';
import { docsProgressService } from '../services/docsProgressService';
import { docsAudioService } from '../services/docsAudioService';
import { docsAnswerEvaluationService, type DocsAnswerEvaluation } from '../services/docsAnswerEvaluationService';
import { SafeMarkdownViewer } from './common/SafeMarkdownViewer';

export function DocsInterviewStudio() {
  // Configuration
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectId[]>(['react', 'javascript', 'typescript']);
  const [difficulty, setDifficulty] = useState<QuestionDifficulty | 'mixed'>('mixed');
  const [experience, setExperience] = useState<ExperienceLevel>('senior');
  const [questionCount, setQuestionCount] = useState<number>(3);

  // Active Session
  const [session, setSession] = useState<InterviewSessionState | null>(null);

  // Active Question Candidate Answer & AI Evaluation
  const [candidateTranscript, setCandidateTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [evaluation, setEvaluation] = useState<DocsAnswerEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [activeFollowUp, setActiveFollowUp] = useState<number | null>(null);
  const [followUpAnswer, setFollowUpAnswer] = useState('');
  const [revealedBenchmark, setRevealedBenchmark] = useState(false);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Clean up audio on unmount or question change
  useEffect(() => {
    return () => {
      docsAudioService.stop();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Listen to docsAudioService playing state
  useEffect(() => {
    const unsub = docsAudioService.subscribe((playing) => {
      setIsPlayingAudio(playing);
    });
    return unsub;
  }, []);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const toggleSubjectSelection = (subId: SubjectId) => {
    setSelectedSubjects(prev => {
      if (prev.includes(subId)) {
        if (prev.length === 1) return prev;
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
    resetQuestionState();
  };

  const resetQuestionState = () => {
    setCandidateTranscript('');
    setIsRecording(false);
    setRecordingSeconds(0);
    setEvaluation(null);
    setIsEvaluating(false);
    setActiveFollowUp(null);
    setFollowUpAnswer('');
    setRevealedBenchmark(false);
    docsAudioService.stop();
  };

  const handleToggleVoicePrompt = (q: InterviewQuestion) => {
    if (isPlayingAudio) {
      docsAudioService.stop();
    } else {
      const textToSpeak = `Question ${session ? session.currentIndex + 1 : 1}. In ${q.subjectId}. ${q.question}. ${q.whyAsked?.testingObjective ? 'Testing objective: ' + q.whyAsked.testingObjective : ''}`;
      docsAudioService.speak(textToSpeak, q.id);
    }
  };

  const handleToggleSpeechRecording = () => {
    if (isRecording) {
      // Stop recording
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsRecording(false);
    } else {
      // Start recording
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert('Web Speech API is not supported in this browser. You can type your response directly into the transcript box.');
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentStr = '';
          for (let i = 0; i < event.results.length; ++i) {
            currentStr += event.results[i][0].transcript + ' ';
          }
          setCandidateTranscript(currentStr.trim());
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setIsRecording(false);
      }
    }
  };

  const handleRunAiEvaluation = () => {
    if (!session || !currentQ) return;
    if (isRecording) {
      handleToggleSpeechRecording();
    }
    setIsEvaluating(true);

    setTimeout(() => {
      const evalResult = docsAnswerEvaluationService.evaluateCandidateAnswer(
        currentQ,
        candidateTranscript,
        session.config.experience
      );
      setEvaluation(evalResult);
      setIsEvaluating(false);
      setRevealedBenchmark(true);
    }, 400);
  };

  const handleNextQuestion = () => {
    if (!session || !currentQ) return;

    const currentEval = evaluation || docsAnswerEvaluationService.evaluateCandidateAnswer(
      currentQ,
      candidateTranscript,
      session.config.experience
    );

    const updatedTranscripts = {
      ...(session.candidateTranscripts || {}),
      [currentQ.id]: candidateTranscript,
    };

    const updatedEvaluations = {
      ...(session.evaluations || {}),
      [currentQ.id]: currentEval,
    };

    const ratingScore = Math.max(1, Math.min(5, Math.round(currentEval.score / 20)));
    const updatedRatings = { ...session.userRatings, [currentQ.id]: ratingScore };

    if (session.currentIndex + 1 < session.questions.length) {
      setSession({
        ...session,
        currentIndex: session.currentIndex + 1,
        activeFollowUpIndex: -1,
        userRatings: updatedRatings,
        candidateTranscripts: updatedTranscripts,
        evaluations: updatedEvaluations,
      });
      resetQuestionState();
    } else {
      // Completed session
      const finishedSession: InterviewSessionState = {
        ...session,
        isFinished: true,
        userRatings: updatedRatings,
        candidateTranscripts: updatedTranscripts,
        evaluations: updatedEvaluations,
        completedAt: new Date().toISOString(),
      };
      const scoreSummary = interviewSimulatorService.evaluateSession(finishedSession);
      finishedSession.scoreSummary = scoreSummary;
      setSession(finishedSession);
      docsProgressService.recordInterviewCompleted();
      resetQuestionState();
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = session && !session.isFinished ? session.questions[session.currentIndex] : null;

  return (
    <div className="docs-interview-studio-container">
      {/* Studio Header */}
      <div className="interview-header-card">
        <span className="ih-badge">🎙️ INTERACTIVE AI MOCK INTERVIEWER</span>
        <h2>AI Technical Interview Loop &amp; Voice Evaluation</h2>
        <p>
          State your technical explanations aloud using live speech-to-text. Receive automated senior architectural rubric evaluation, concept coverage checks, and dynamic follow-up probe questions.
        </p>
      </div>

      {/* Setup Config Screen */}
      {!session && (
        <div className="interview-setup-panel">
          <h3 className="setup-title">Configure Interview Session</h3>

          {/* Subject Multi-Select */}
          <div className="setup-field">
            <label>Select Technical Tracks to Test</label>
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
              <label>Target Seniority Level</label>
              <select
                value={experience}
                onChange={e => setExperience(e.target.value as any)}
                className="config-select"
              >
                <option value="junior">Junior Frontend Engineer</option>
                <option value="mid-level">Mid-Level Engineer</option>
                <option value="senior">Senior Engineer (Tech Lead)</option>
                <option value="architect">Staff / Principal Solutions Architect</option>
              </select>
            </div>

            <div className="setup-field">
              <label>Interview Length</label>
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
              🎙️ Begin AI Mock Interview Loop →
            </button>
          </div>
        </div>
      )}

      {/* Active Question Screen */}
      {session && !session.isFinished && currentQ && (
        <div className="active-interview-box">
          {/* Question Header & Voice Prompter */}
          <div className="interview-q-header">
            <div className="iq-top-row">
              <div className="iq-meta">
                <span className="iq-round-pill">
                  QUESTION {session.currentIndex + 1} OF {session.questions.length}
                </span>
                <span className="iq-track-pill">{currentQ.subjectId.toUpperCase()}</span>
                <span className="iq-diff-pill">{currentQ.difficulty.toUpperCase()}</span>
              </div>
              <button
                type="button"
                className={`iq-voice-btn ${isPlayingAudio ? 'is-speaking' : ''}`}
                onClick={() => handleToggleVoicePrompt(currentQ)}
                title="Listen to interviewer ask question aloud"
              >
                {isPlayingAudio ? '⏹ Stop Speaking' : '🔊 Listen to Question'}
              </button>
            </div>
            <h3 className="iq-question-text">{currentQ.question}</h3>
          </div>

          {/* Interviewer Objective Signal */}
          {currentQ.whyAsked && (
            <div className="interviewer-signal-box">
              <span className="is-badge">🎯 INTERVIEWER SIGNAL</span>
              <p><strong>Testing Objective:</strong> {currentQ.whyAsked.testingObjective}</p>
            </div>
          )}

          {/* Speech-to-Text Live Microphone Recording Console */}
          <div className="aim-recording-card">
            <div className="aim-recording-head">
              <div className="aim-status-wrap">
                <span className={`aim-pulse-dot ${isRecording ? 'active' : ''}`} />
                <span className="aim-status-text">
                  {isRecording ? 'Recording Live Speech...' : 'Microphone Ready'}
                </span>
                {isRecording && <span className="aim-timer-badge">⏱ {formatTimer(recordingSeconds)}</span>}
              </div>

              <div className="aim-mic-actions">
                <button
                  type="button"
                  className={`aim-mic-btn ${isRecording ? 'recording' : ''}`}
                  onClick={handleToggleSpeechRecording}
                >
                  {isRecording ? '⏹ Stop Recording' : '🎙️ Speak Your Answer'}
                </button>
                {candidateTranscript && (
                  <button
                    type="button"
                    className="aim-clear-btn"
                    onClick={() => setCandidateTranscript('')}
                    title="Clear transcript"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Transcript Text Area (Speech output or manual typing) */}
            <div className="aim-transcript-box">
              <textarea
                value={candidateTranscript}
                onChange={e => setCandidateTranscript(e.target.value)}
                placeholder="Click 'Speak Your Answer' to record your technical explanation aloud, or type your answer here..."
                rows={4}
                className="aim-textarea"
              />
              <div className="aim-textarea-footer">
                <span className="aim-word-count">
                  {candidateTranscript.trim() ? candidateTranscript.trim().split(/\s+/).length : 0} words
                </span>
                <button
                  type="button"
                  className="aim-evaluate-btn"
                  onClick={handleRunAiEvaluation}
                  disabled={isEvaluating || !candidateTranscript.trim()}
                >
                  {isEvaluating ? '⏳ Analyzing Answer...' : '⚡ Submit for AI Evaluation'}
                </button>
              </div>
            </div>
          </div>

          {/* AI Semantic Evaluation Card */}
          {evaluation && (
            <div className="aim-eval-card">
              <div className="aim-eval-header">
                <div className="aim-eval-score-box">
                  <span className="aim-score-num">{evaluation.score}%</span>
                  <span className={`aim-grade-pill grade-${evaluation.letterGrade.toLowerCase()}`}>
                    GRADE: {evaluation.letterGrade}
                  </span>
                </div>
                <div className="aim-eval-verdict">
                  <h4>Interviewer Verdict:</h4>
                  <p>{evaluation.seniorVerdict}</p>
                  <p className="aim-exp-note">💡 {evaluation.experienceFeedback}</p>
                </div>
              </div>

              <div className="aim-concepts-grid">
                <div className="aim-concepts-col covered-col">
                  <h5>✓ Technical Concepts Articulated ({evaluation.coveredConcepts.length})</h5>
                  {evaluation.coveredConcepts.length > 0 ? (
                    <div className="aim-pills-wrap">
                      {evaluation.coveredConcepts.map((c, i) => (
                        <span key={i} className="concept-pill covered">{c}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="aim-empty-text">No core technical keywords detected in response.</p>
                  )}
                </div>

                <div className="aim-concepts-col missing-col">
                  <h5>⚠️ Missed Architectural Concepts ({evaluation.missingConcepts.length})</h5>
                  {evaluation.missingConcepts.length > 0 ? (
                    <div className="aim-pills-wrap">
                      {evaluation.missingConcepts.map((m, i) => (
                        <span key={i} className="concept-pill missing">{m}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="aim-empty-text">All major concepts covered effectively!</p>
                  )}
                </div>
              </div>

              {/* Dynamic Follow-Up Probe Question */}
              {currentQ.followUps && currentQ.followUps.length > 0 && (
                <div className="aim-followup-probe-box">
                  <div className="aim-fu-head">
                    <span className="aim-fu-badge">🔥 INTERVIEWER FOLLOW-UP PROBE</span>
                    <h4>{currentQ.followUps[activeFollowUp ?? 0].depthLevel.toUpperCase()} DRILL:</h4>
                  </div>
                  <p className="aim-fu-q">{currentQ.followUps[activeFollowUp ?? 0].question}</p>

                  <div className="aim-fu-answer-box">
                    <input
                      type="text"
                      value={followUpAnswer}
                      onChange={e => setFollowUpAnswer(e.target.value)}
                      placeholder="How would you address this follow-up?"
                      className="aim-fu-input"
                    />
                    {followUpAnswer && (
                      <div className="aim-fu-expected">
                        <strong>Expected Senior Answer:</strong>
                        <p>{currentQ.followUps[activeFollowUp ?? 0].expectedAnswer}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Benchmark Senior Answer Accordion */}
              <div className="aim-benchmark-accordion">
                <button
                  type="button"
                  className="aim-benchmark-toggle-btn"
                  onClick={() => setRevealedBenchmark(prev => !prev)}
                >
                  {revealedBenchmark ? 'Hide Benchmark Senior Answer ▴' : 'View Benchmark Senior Answer ▾'}
                </button>

                {revealedBenchmark && (
                  <div className="aim-benchmark-content">
                    <SafeMarkdownViewer content={currentQ.detailedAnswer} />
                    {currentQ.seniorAnswer && (
                      <div className="aim-architect-perspective">
                        <strong>Architect Perspective &amp; Edge Cases:</strong>
                        <SafeMarkdownViewer content={currentQ.seniorAnswer} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Next Question Advance Button */}
              <div className="aim-advance-bar">
                <button
                  type="button"
                  className="aim-next-btn"
                  onClick={handleNextQuestion}
                >
                  {session.currentIndex + 1 < session.questions.length
                    ? 'Save Evaluation & Next Question →'
                    : 'Finalize Interview Loop & Generate Dossier →'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Finished Interview Dossier */}
      {session && session.isFinished && session.scoreSummary && (
        <div className="interview-results-dossier">
          <div className="verdict-banner">
            <span className="verdict-tag">{session.scoreSummary.readinessGrade}</span>
            <h2>AI Mock Interview Loop Score: {session.scoreSummary.overallPercentage}%</h2>
          </div>

          <div className="dossier-grid">
            <div className="dossier-card strengths-card">
              <h4>💪 Core Strengths Articulated</h4>
              <ul>
                {session.scoreSummary.strengths.length > 0 ? (
                  session.scoreSummary.strengths.map((s, idx) => <li key={idx}>✓ {s}</li>)
                ) : (
                  <li>Practice more foundational tracks to build confidence and vocabulary.</li>
                )}
              </ul>
            </div>

            <div className="dossier-card weaknesses-card">
              <h4>🎯 Recommended Focus Areas</h4>
              <ul>
                {session.scoreSummary.weaknesses.length > 0 ? (
                  session.scoreSummary.weaknesses.map((w, idx) => <li key={idx}>⚠️ {w}</li>)
                ) : (
                  <li>Strong technical coverage across all tested modules.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Question by Question Detailed Performance Breakdown */}
          <div className="aim-breakdown-card">
            <h3>Question-by-Question AI Analysis ({session.questions.length})</h3>
            <div className="aim-breakdown-list">
              {session.questions.map((q, idx) => {
                const evalData = session.evaluations ? session.evaluations[q.id] : null;
                const transcript = session.candidateTranscripts ? session.candidateTranscripts[q.id] : '';
                return (
                  <div key={q.id} className="aim-breakdown-item">
                    <div className="abi-header">
                      <span className="abi-q-num">Q{idx + 1}</span>
                      <strong className="abi-q-title">{q.question}</strong>
                      {evalData && (
                        <span className={`abi-score-pill grade-${evalData.letterGrade.toLowerCase()}`}>
                          {evalData.score}% ({evalData.letterGrade})
                        </span>
                      )}
                    </div>
                    {transcript && (
                      <div className="abi-transcript">
                        <span className="abi-subhead">Candidate Transcript:</span>
                        <p>"{transcript}"</p>
                      </div>
                    )}
                    {evalData && (
                      <div className="abi-verdict">
                        <span className="abi-subhead">Interviewer Feedback:</span>
                        <p>{evalData.seniorVerdict}</p>
                      </div>
                    )}
                    <div className="abi-topic-link">
                      <Link to={`/docs/${q.subjectId}/${q.topicId}`} className="abi-link">
                        📖 Review Technical Specs for {q.topicId} →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="dossier-actions-bar">
            <button
              type="button"
              className="start-interview-btn"
              onClick={() => {
                setSession(null);
                resetQuestionState();
              }}
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
