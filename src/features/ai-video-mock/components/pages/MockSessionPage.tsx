import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { MockInterviewSession, InterviewAnswer } from '../../types/mock.types';
import { mockSessionService } from '../../services/mockSessionService';
import { mockPersistenceService, type PersistenceStatus } from '../../services/mockPersistenceService';
import { answerEvaluationService } from '../../services/answerEvaluationService';
import { finalReportService } from '../../services/finalReportService';
import { sandboxProvider } from '../../services/providers/sandboxProvider';
import { voiceSynthesisService } from '../../services/providers/voiceSynthesisService';
import { followUpService, type FollowUpDecision } from '../../services/followUpService';
import { videoStorageService } from '../../services/providers/videoStorageService';
import { interviewEngine } from '../../services/interviewEngine';
import { PERSONAS } from './MockSetupPage';
import MockQuestionResultModal from './MockQuestionResultModal';
import Editor from '@monaco-editor/react';

export default function MockSessionPage() {
  const params = useParams<{ sessionId?: string; id?: string }>();
  const sessionId = params.sessionId || params.id || '';
  const navigate = useNavigate();

  const [session, setSession] = useState<MockInterviewSession | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<InterviewAnswer | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptText, setTranscriptText] = useState('');
  const [codeContent, setCodeContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluatedAnswer, setEvaluatedAnswer] = useState<InterviewAnswer | null>(null);
  const [questionSeconds, setQuestionSeconds] = useState(0);

  // Persistence status: Cloud Saved ✓ / Local Backup ⚠ (never silent)
  const [persistStatus, setPersistStatus] = useState<PersistenceStatus>('idle');
  const [persistError, setPersistError] = useState<string | null>(null);

  const markPersisted = (ok: boolean, provider: 'cloud' | 'local', error?: string) => {
    if (ok && provider === 'cloud') {
      setPersistStatus('cloud');
      setPersistError(null);
    } else {
      setPersistStatus('local');
      setPersistError(error || null);
    }
  };

  // Sandbox Quick Test State
  const [isRunningSandboxTest, setIsRunningSandboxTest] = useState(false);
  const [sandboxQuickResult, setSandboxQuickResult] = useState<any>(null);

  // Voice-First AI Interviewer State
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [activeFollowUp, setActiveFollowUp] = useState<FollowUpDecision | null>(null);
  const [followUpAnswerText, setFollowUpAnswerText] = useState('');
  const [hasFollowUpResolved, setHasFollowUpResolved] = useState(false);

  // Video & Audio refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  // Get active persona
  const currentPersona = session
    ? PERSONAS.find(p => p.id === session.config.interviewerPersonaId) || PERSONAS[0]
    : PERSONAS[0];

  // Load Session: local first, Supabase fallback (refresh-proof)
  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    (async () => {
      const s = await mockSessionService.getSessionWithRemote(sessionId);
      if (cancelled) return;
      if (!s) {
        navigate('/ai-video-mock/setup');
        return;
      }
      setSession(s);

      const currentIdx = s.currentQuestionIndex || 0;
      const ans = s.answers[currentIdx] || s.answers[0];
      setCurrentAnswer(ans);
      if (ans.question.programmingSpec?.starterCode) {
        setCodeContent(ans.question.programmingSpec.starterCode);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId, navigate]);

  // Camera & Mic setup
  useEffect(() => {
    async function initMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Camera/Mic permission not granted or unavailable:', err);
      }
    }
    initMedia();

    return () => {
      voiceSynthesisService.stop();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Voice-First: Speak Question Aloud on Question Load
  useEffect(() => {
    if (!currentAnswer || currentAnswer.mode === 'code') return;

    // Trigger AI speech delivery
    voiceSynthesisService.speak(currentAnswer.question.question, currentPersona, {
      onStart: () => setIsAiSpeaking(true),
      onEnd: () => setIsAiSpeaking(false),
      onError: () => setIsAiSpeaking(false),
    });

    return () => {
      voiceSynthesisService.stop();
    };
  }, [currentAnswer?.id]);

  // Question Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setQuestionSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [session?.currentQuestionIndex]);

  // Start MediaRecorder for video capture
  const startVideoRecording = () => {
    if (!mediaStreamRef.current) return;
    try {
      recordedChunksRef.current = [];
      const options = { mimeType: 'video/webm;codecs=vp8,opus' };
      const recorder = MediaRecorder.isTypeSupported(options.mimeType)
        ? new MediaRecorder(mediaStreamRef.current, options)
        : new MediaRecorder(mediaStreamRef.current);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
    } catch (err) {
      console.warn('Could not initialize MediaRecorder:', err);
    }
  };

  const stopAndSaveVideoRecording = async (answerId: string, qNumber: number) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    // Wait 200ms for data chunks to flush
    await new Promise(r => setTimeout(r, 200));

    if (recordedChunksRef.current.length > 0 && session) {
      const mimeType = mediaRecorderRef.current?.mimeType || 'video/webm';
      const videoBlob = new Blob(recordedChunksRef.current, { type: mimeType });

      await videoStorageService.saveRecording({
        id: `rec_${answerId}`,
        sessionId: session.id,
        answerId,
        questionNumber: qNumber,
        blob: videoBlob,
        sizeBytes: videoBlob.size,
        durationSeconds: questionSeconds,
        mimeType,
        recordedAt: new Date().toISOString(),
      }, session.userId);
    }
  };

  // Replay Question Speech
  const handleReplayQuestion = () => {
    if (!currentAnswer) return;
    const textToSpeak = activeFollowUp ? activeFollowUp.followUpQuestion || currentAnswer.question.question : currentAnswer.question.question;
    voiceSynthesisService.speak(textToSpeak, currentPersona, {
      onStart: () => setIsAiSpeaking(true),
      onEnd: () => setIsAiSpeaking(false),
      onError: () => setIsAiSpeaking(false),
    });
  };

  // Stop AI Speech
  const handleStopAiSpeech = () => {
    voiceSynthesisService.stop();
    setIsAiSpeaking(false);
  };

  // Quick Test Sandbox in Coding Mode
  const handleRunSandboxQuickTest = async () => {
    if (!currentAnswer || isRunningSandboxTest) return;
    setIsRunningSandboxTest(true);
    const testCases = currentAnswer.question.programmingSpec?.testCases.map(tc => ({
      id: tc.id,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
    })) || [];

    const res = await sandboxProvider.execute({
      code: codeContent,
      language: currentAnswer.question.programmingSpec?.programmingLanguage || 'javascript',
      testCases,
    });
    setSandboxQuickResult(res);
    setIsRunningSandboxTest(false);
  };

  // Speech Recognition Handling
  const toggleRecording = () => {
    if (isRecording) {
      // Stop
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      if (isAiSpeaking) {
        handleStopAiSpeech();
      }
      startVideoRecording();

      // Start Web Speech API or local transcription
      if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recog = new SpeechRec();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = 'en-US';

        recog.onresult = (event: any) => {
          let currentStr = '';
          for (let i = 0; i < event.results.length; i++) {
            currentStr += event.results[i][0].transcript + ' ';
          }
          if (activeFollowUp && !hasFollowUpResolved) {
            setFollowUpAnswerText(currentStr);
          } else {
            setTranscriptText(currentStr);
          }
        };

        recog.onerror = (err: any) => {
          console.warn('Speech recognition error:', err);
        };

        recog.start();
        recognitionRef.current = recog;
        setIsRecording(true);
      } else {
        alert('Browser Speech Recognition API is not supported in this browser. You can type your verbal answer directly into the transcript box below.');
        setIsRecording(true);
      }
    }
  };

  // Submit Answer & Handle Dynamic Voice Follow-Up
  const handleSubmitAnswer = async () => {
    if (!session || !currentAnswer || isSubmitting) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    // Check if we should ask an AI voice follow-up first (for non-coding questions)
    if (!isCodingQuestion && !activeFollowUp && !hasFollowUpResolved && transcriptText.trim().length > 30) {
      setIsSubmitting(true);
      const comparison = answerEvaluationService.performConceptComparison(currentAnswer.question, transcriptText);
      const followUpDecision = await followUpService.generateFollowUp(
        currentAnswer.question,
        transcriptText,
        comparison,
        session.config.experienceTier
      );
      setIsSubmitting(false);

      if (followUpDecision.shouldAskFollowUp && followUpDecision.followUpQuestion) {
        setActiveFollowUp(followUpDecision);
        // AI speaks follow-up aloud
        voiceSynthesisService.speak(followUpDecision.followUpQuestion, currentPersona, {
          onStart: () => setIsAiSpeaking(true),
          onEnd: () => setIsAiSpeaking(false),
          onError: () => setIsAiSpeaking(false),
        });
        return;
      }
    }

    setIsSubmitting(true);
    await stopAndSaveVideoRecording(currentAnswer.id, currentAnswer.questionNumber);

    const fullAnswerText = activeFollowUp && followUpAnswerText
      ? `${transcriptText}\n\n[Follow-up Response]: ${followUpAnswerText}`
      : transcriptText;

    const updatedAns: InterviewAnswer = {
      ...currentAnswer,
      timeSpentSeconds: questionSeconds,
      submittedAt: new Date().toISOString(),
    };

    if (currentAnswer.mode === 'code') {
      updatedAns.submittedCode = codeContent;
      // Execute test cases via sandbox
      const testCases = currentAnswer.question.programmingSpec?.testCases.map(tc => ({
        id: tc.id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
      })) || [];

      const runResult = await sandboxProvider.execute({
        code: codeContent,
        language: currentAnswer.question.programmingSpec?.programmingLanguage || 'javascript',
        testCases,
      });

      // AI Code Quality Review
      const aiReview = await sandboxProvider.reviewCodeWithAI(
        codeContent,
        currentAnswer.question.question,
        runResult
      );

      updatedAns.codingEvaluation = {
        testsPassed: runResult.testsPassed,
        testsTotal: runResult.testsTotal,
        status: runResult.status,
        executionTimeMs: runResult.executionTimeMs,
        failedCases: runResult.failedCases,
        aiCodeReview: aiReview,
      };

      // Also generate standard rubric evaluation
      const evalRes = await answerEvaluationService.evaluateTheoryAnswer(
        currentAnswer.question,
        `Code Implementation passing ${runResult.testsPassed}/${runResult.testsTotal} test cases: ${codeContent}`,
        session.config.experienceTier
      );
      updatedAns.evaluation = evalRes;
      updatedAns.status = 'EVALUATED';
    } else {
      updatedAns.transcript = {
        id: `tr_${Date.now()}`,
        version: 1,
        rawTranscript: fullAnswerText,
        cleanedTranscript: fullAnswerText.trim(),
        rawText: fullAnswerText,
        cleanedText: fullAnswerText.trim(),
        language: 'en',
        provider: 'web-speech-api',
        model: 'browser-native',
        confidence: 0.95,
        timestamp: new Date().toISOString(),
      };

      const evalRes = await answerEvaluationService.evaluateTheoryAnswer(
        currentAnswer.question,
        fullAnswerText,
        session.config.experienceTier
      );
      updatedAns.evaluation = evalRes;
      updatedAns.status = 'EVALUATED';
    }

    mockSessionService.saveAnswer(session.id, updatedAns);
    setEvaluatedAnswer(updatedAns);
    setIsSubmitting(false);

    // Persist answer (+transcript/video inline) and evaluation to Supabase;
    // localStorage remains the fallback and the outcome is shown, never hidden.
    try {
      setPersistStatus('saving');
      const aRes = await mockPersistenceService.saveAnswer(session, updatedAns);
      if (updatedAns.evaluation) {
        const eRes = await mockPersistenceService.saveEvaluation(
          session.id,
          session.userId,
          updatedAns,
          updatedAns.evaluation
        );
        markPersisted(aRes.ok && eRes.ok, aRes.ok && eRes.ok ? 'cloud' : 'local', eRes.error || aRes.error);
      } else {
        markPersisted(aRes.ok, aRes.provider, aRes.error);
      }
    } catch (e) {
      markPersisted(false, 'local', e instanceof Error ? e.message : 'persistence failed');
    }
  };

  // Move to next question with Adaptive Progression
  const handleProceedNext = async () => {
    if (!session || !currentAnswer) return;
    const nextIdx = session.currentQuestionIndex + 1;

    if (nextIdx >= session.totalQuestions) {
      // Complete interview
      const scorecard = finalReportService.generateScorecard(session.id, session.answers, session.config);
      session.scorecard = scorecard;
      session.state = 'COMPLETED';
      mockSessionService.saveSessionLocally(session);
      try {
        setPersistStatus('saving');
        const [sRes, scRes] = await Promise.all([
          mockSessionService.syncSessionRemote(session),
          mockPersistenceService.saveScorecard(session, scorecard),
        ]);
        markPersisted(sRes.ok && scRes.ok, sRes.ok && scRes.ok ? 'cloud' : 'local', scRes.error || sRes.error);
      } catch (e) {
        markPersisted(false, 'local', e instanceof Error ? e.message : 'persistence failed');
      }
      navigate(`/ai-video-mock/result/${session.id}`);
    } else {
      // Dynamic Adaptive Selection for next question
      setIsSubmitting(true);
      const adaptiveResult = await interviewEngine.decideNextQuestion(
        session,
        evaluatedAnswer || currentAnswer
      );
      setIsSubmitting(false);

      let nextAns: InterviewAnswer;
      if (session.answers[nextIdx]) {
        // Adapt question and difficulty
        session.answers[nextIdx].question = adaptiveResult.nextQuestion;
        session.answers[nextIdx].questionId = adaptiveResult.nextQuestion.id;
        session.answers[nextIdx].mode = (adaptiveResult.nextQuestion.questionType === 'Programming' || adaptiveResult.nextQuestion.questionType === 'Machine Coding') ? 'code' : 'speech';
        nextAns = session.answers[nextIdx];
      } else {
        const updated = mockSessionService.appendAdaptiveNextQuestion(session.id, adaptiveResult.nextQuestion);
        nextAns = updated!.answers[nextIdx];
      }

      session.currentQuestionIndex = nextIdx;
      mockSessionService.saveSessionLocally(session);
      setSession({ ...session });
      setCurrentAnswer(nextAns);
      setEvaluatedAnswer(null);
      setTranscriptText('');
      setFollowUpAnswerText('');
      setActiveFollowUp(null);
      setHasFollowUpResolved(false);
      setSandboxQuickResult(null);
      setQuestionSeconds(0);
      if (nextAns.question.programmingSpec?.starterCode) {
        setCodeContent(nextAns.question.programmingSpec.starterCode);
      }
    }
  };

  if (!session || !currentAnswer) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading interview session...</div>;
  }

  const isCodingQuestion = currentAnswer.mode === 'code';
  const isLastQuestion = session.currentQuestionIndex + 1 >= session.totalQuestions;

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="ai-vm-session-layout">
      {/* Topbar */}
      <div className="ai-vm-session-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Question {session.currentQuestionIndex + 1} of {session.totalQuestions}
          </span>
          <div style={{ width: 140, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                background: 'var(--grad-brand)',
                width: `${((session.currentQuestionIndex + 1) / session.totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Persona Chip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-hover)', padding: '4px 12px', borderRadius: 20, border: '1px solid var(--border)' }}>
            <span>{currentPersona.avatar}</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{currentPersona.name}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({currentPersona.company})</span>
          </div>

          {/* Persistence status: Cloud Saved ✓ / Local Backup ⚠ */}
          <div
            title={persistError || (persistStatus === 'cloud' ? 'Session, answers and evaluations saved to Supabase' : 'Saving locally; will sync when Supabase is reachable')}
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: 20,
              border: '1px solid var(--border)',
              background: persistStatus === 'cloud' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
              color: persistStatus === 'cloud' ? '#10b981' : '#f59e0b',
            }}
          >
            {persistStatus === 'cloud' ? 'Cloud Saved ✓' : persistStatus === 'saving' ? 'Saving…' : persistStatus === 'local' ? 'Local Backup ⚠' : persistStatus === 'error' ? 'Save Issue ⚠' : 'Not Saved Yet'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span>⏱️ Time:</span>
            <span style={{ fontWeight: 700, color: questionSeconds > 240 ? '#ef4444' : 'var(--text-primary)' }}>
              {formatTimer(questionSeconds)}
            </span>
          </div>

          <button
            type="button"
            className="ai-vm-btn-secondary"
            onClick={() => {
              mockSessionService.updateSessionState(session.id, 'PAUSED');
              alert('Interview paused. You can resume at any time from this URL.');
            }}
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            ⏸️ Pause
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="ai-vm-session-content">
        {/* Left: Question Prompt, Voice Status & Video Feed */}
        <div className="ai-vm-session-left">
          <div className="ai-vm-question-card">
            <div className="ai-vm-q-meta">
              <span className="ai-vm-q-tag">{currentAnswer.question.technology}</span>
              <span className="ai-vm-q-tag" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                {currentAnswer.question.difficulty}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {currentAnswer.question.topic}
              </span>
            </div>

            {/* Voice-First Status Banner */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0', padding: '8px 12px', borderRadius: 8, background: isAiSpeaking ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg)', border: `1px solid ${isAiSpeaking ? '#818cf8' : 'var(--border)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.1rem' }}>{isAiSpeaking ? '🔊' : '🎙️'}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isAiSpeaking ? '#818cf8' : '#10b981' }}>
                  {isAiSpeaking ? `${currentPersona.name} is speaking... (Listen)` : 'Your Turn (Answer Aloud)'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                {isAiSpeaking ? (
                  <button
                    type="button"
                    onClick={handleStopAiSpeech}
                    className="ai-vm-btn-secondary"
                    style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                  >
                    ⏹️ Stop Audio
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleReplayQuestion}
                    className="ai-vm-btn-secondary"
                    style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                  >
                    🔊 Replay Question
                  </button>
                )}
              </div>
            </div>

            <h2 className="ai-vm-q-title">
              {currentAnswer.question.question}
            </h2>

            {/* Dynamic Follow-Up Prompt Box */}
            {activeFollowUp && (
              <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', marginBottom: 4 }}>
                  ⚡ AI INTERVIEWER FOLLOW-UP:
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  &ldquo;{activeFollowUp.followUpQuestion}&rdquo;
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                  Reason: {activeFollowUp.reason}
                </div>
              </div>
            )}

            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 8 }}>
              🎯 Target Concepts: {currentAnswer.question.expectedConcepts.slice(0, 4).join(' · ')}
            </div>
          </div>

          {/* Video Preview with Live Recording Indicator */}
          <div className="ai-vm-video-feed-wrap">
            <video ref={videoRef} autoPlay playsInline muted className="ai-vm-video-element" />
            {isRecording && (
              <div className="ai-vm-rec-badge">
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                <span>REC · LIVE VIDEO &amp; MIC</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Speech Recording OR Code Editor */}
        <div className="ai-vm-session-right">
          {isCodingQuestion ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ padding: '10px 16px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  💻 Coding Workspace ({currentAnswer.question.programmingSpec?.programmingLanguage || 'JavaScript'})
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Sandboxed Web Worker Execution
                </span>
              </div>

              <div style={{ flex: 1, minHeight: 300 }}>
                <Editor
                  height="100%"
                  language={currentAnswer.question.programmingSpec?.programmingLanguage || 'javascript'}
                  theme="vs-dark"
                  value={codeContent}
                  onChange={val => setCodeContent(val || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>

              {/* Quick Sandbox Test Feedback Panel */}
              {sandboxQuickResult && (
                <div style={{ padding: '10px 16px', background: sandboxQuickResult.status === 'PASSED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderTop: '1px solid var(--border)', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: sandboxQuickResult.status === 'PASSED' ? '#10b981' : '#ef4444' }}>
                      Status: {sandboxQuickResult.status} ({sandboxQuickResult.testsPassed}/{sandboxQuickResult.testsTotal} cases passed in {sandboxQuickResult.executionTimeMs}ms)
                    </span>
                    <button
                      type="button"
                      onClick={() => setSandboxQuickResult(null)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      ✕ Close
                    </button>
                  </div>
                  {sandboxQuickResult.failedCases?.length > 0 && (
                    <div style={{ color: '#f87171', fontSize: '0.75rem' }}>
                      Failed input: {sandboxQuickResult.failedCases[0].input} · Expected: {sandboxQuickResult.failedCases[0].expected} · Got: {sandboxQuickResult.failedCases[0].actual}
                    </div>
                  )}
                </div>
              )}

              <div style={{ padding: 16, background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  className="ai-vm-btn-secondary"
                  onClick={handleRunSandboxQuickTest}
                  disabled={isRunningSandboxTest || isSubmitting}
                  style={{ fontSize: '0.85rem' }}
                >
                  {isRunningSandboxTest ? 'Running Sandbox...' : '▶️ Test Solution'}
                </button>
                <button
                  type="button"
                  className="ai-vm-btn-primary"
                  onClick={handleSubmitAnswer}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Evaluating Sandbox & AI Review...' : 'Run Tests & Submit Code →'}
                </button>
              </div>
            </div>
          ) : (
            <div className="ai-vm-transcript-pane">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                  🎙️ Verbal Response &amp; Live Speech Recognition
                </span>
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={isAiSpeaking}
                  title={isAiSpeaking ? 'AI is speaking. Please listen before recording.' : undefined}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 16px',
                    borderRadius: 20,
                    background: isRecording ? '#ef4444' : isAiSpeaking ? 'var(--surface-hover)' : 'var(--grad-brand)',
                    color: isAiSpeaking ? 'var(--text-muted)' : '#fff',
                    border: isAiSpeaking ? '1px solid var(--border)' : 'none',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: isAiSpeaking ? 'not-allowed' : 'pointer',
                    opacity: isAiSpeaking ? 0.7 : 1,
                  }}
                >
                  {isRecording ? '⏹️ Stop Recording' : isAiSpeaking ? '🔊 Listening to Interviewer...' : '🔴 Speak / Record Answer'}
                </button>
              </div>

              {/* Dynamic Transcript Area */}
              <div className="ai-vm-transcript-box">
                {activeFollowUp ? (
                  followUpAnswerText || (
                    <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Follow-up active! Speak or type your answer to {currentPersona.name}&apos;s follow-up question.
                    </span>
                  )
                ) : (
                  transcriptText || (
                    <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Click &ldquo;Speak / Record Answer&rdquo; above to begin speaking. Your voice will be transcribed in real-time. You can also type or edit your response directly here.
                    </span>
                  )
                )}
              </div>

              <textarea
                value={activeFollowUp ? followUpAnswerText : transcriptText}
                onChange={e => {
                  if (activeFollowUp) {
                    setFollowUpAnswerText(e.target.value);
                  } else {
                    setTranscriptText(e.target.value);
                  }
                }}
                placeholder={activeFollowUp ? "Speak or type your answer to the interviewer's follow-up..." : "Or type/edit your verbal response transcript here..."}
                style={{
                  width: '100%',
                  height: 100,
                  padding: 12,
                  borderRadius: 8,
                  background: 'var(--surface)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  fontSize: '0.85rem',
                  resize: 'vertical',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <button
                  type="button"
                  className="ai-vm-btn-secondary"
                  onClick={() => {
                    setTranscriptText("I don't know");
                  }}
                  style={{ fontSize: '0.82rem' }}
                >
                  I Don&apos;t Know
                </button>

                <button
                  type="button"
                  className="ai-vm-btn-primary"
                  onClick={handleSubmitAnswer}
                  disabled={isSubmitting || (!transcriptText.trim() && !followUpAnswerText.trim())}
                  style={{ padding: '10px 24px' }}
                >
                  {isSubmitting ? 'Evaluating...' : activeFollowUp ? 'Submit Follow-Up Answer →' : 'Submit Answer for Review →'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Immediate Question Result Modal */}
      {evaluatedAnswer && (
        <MockQuestionResultModal
          answer={evaluatedAnswer}
          onNextQuestion={handleProceedNext}
          isLastQuestion={isLastQuestion}
        />
      )}
    </div>
  );
}
