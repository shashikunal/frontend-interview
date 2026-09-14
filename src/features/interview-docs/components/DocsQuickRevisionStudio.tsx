import { useState, useEffect, useMemo, useCallback } from 'react';
import { ALL_QUESTIONS_REGISTRY } from '../data/docsRegistry';
import { ALL_SUBJECTS_CATALOG } from '../data/subjectsCatalog';
import type { InterviewQuestion } from '../types/docs.types';
import { docsProgressService } from '../services/docsProgressService';
import { docsAudioService } from '../services/docsAudioService';
import { SafeMarkdownViewer } from './common/SafeMarkdownViewer';

type TimeboxMinutes = 5 | 15 | 30;

export function DocsQuickRevisionStudio() {
  const [timebox, setTimebox] = useState<TimeboxMinutes>(5);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'must-know' | 'traps'>('all');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(300); // 5 * 60
  const [masteredCount, setMasteredCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  // Subscribe to audio state
  useEffect(() => {
    const unsub = docsAudioService.subscribe((playing) => {
      setIsSpeaking(playing);
    });
    return unsub;
  }, []);

  // Filter pool of questions based on selected criteria
  const questionPool = useMemo(() => {
    let list = ALL_QUESTIONS_REGISTRY.slice();

    if (selectedSubject !== 'all') {
      list = list.filter(q => q.subjectId === selectedSubject);
    }

    if (priorityFilter === 'must-know') {
      list = list.filter(q => q.difficulty === 'intermediate' || q.difficulty === 'difficult');
    } else if (priorityFilter === 'traps') {
      list = list.filter(q => !!q.whyAsked?.commonWeakAnswer || (!!q.commonMistakes && q.commonMistakes.length > 0));
    }

    // Limit pool count based on timebox: 5 min -> 5-8 questions, 15 min -> 15-20, 30 min -> 30-40
    const targetCount = timebox === 5 ? 8 : timebox === 15 ? 20 : 35;
    return list.slice(0, targetCount);
  }, [selectedSubject, priorityFilter, timebox]);

  const currentQuestion: InterviewQuestion | undefined = questionPool[currentIndex];

  // Countdown timer when session is active
  useEffect(() => {
    if (!isSessionActive || isSessionFinished) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSessionFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSessionActive, isSessionFinished]);

  // Start revision session
  const startSession = () => {
    setSecondsRemaining(timebox * 60);
    setCurrentIndex(0);
    setIsAnswerRevealed(false);
    setMasteredCount(0);
    setReviewCount(0);
    setIsSessionFinished(false);
    setIsSessionActive(true);
  };

  // Move to next question
  const handleNext = useCallback(() => {
    docsAudioService.stop();
    setIsAnswerRevealed(false);
    if (currentIndex < questionPool.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsSessionFinished(true);
    }
  }, [currentIndex, questionPool.length]);

  const handlePrev = useCallback(() => {
    docsAudioService.stop();
    setIsAnswerRevealed(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleRate = useCallback((status: 'mastered' | 'review') => {
    if (!currentQuestion) return;
    if (status === 'mastered') {
      setMasteredCount(prev => prev + 1);
    } else {
      setReviewCount(prev => prev + 1);
    }
    docsProgressService.recordQuestionAnswer(currentQuestion.subjectId, currentQuestion.id, status === 'mastered' ? 'knew-it' : 'needs-review');
    handleNext();
  }, [currentQuestion, handleNext]);

  const handleToggleAudio = () => {
    if (!currentQuestion) return;
    if (isSpeaking) {
      docsAudioService.stop();
    } else {
      const text = isAnswerRevealed
        ? `${currentQuestion.question}. Answer: ${currentQuestion.shortAnswer}`
        : currentQuestion.question;
      docsAudioService.speak(text);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    if (!isSessionActive || isSessionFinished) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsAnswerRevealed(prev => !prev);
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        handleNext();
      } else if (e.key === '1') {
        e.preventDefault();
        handleRate('mastered');
      } else if (e.key === '2') {
        e.preventDefault();
        handleRate('review');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSessionActive, isSessionFinished, handleNext, handleRate]);

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="docs-revision-studio">
      {/* Studio Header */}
      <header className="docs-studio-header">
        <div className="dsh-left">
          <span className="dsh-badge">⚡ RAPID-FIRE ENGINE</span>
          <h1 className="dsh-title">Quick Revision Mode</h1>
          <p className="dsh-subtext">
            High-yield interview revision engineered for last-minute prep. Focus strictly on Must-Know concepts, frequently tested questions, and common interviewer traps.
          </p>
        </div>

        {isSessionActive && !isSessionFinished && (
          <div className="dsh-timer-card">
            <span className="timer-label">TIME REMAINING</span>
            <span className={`timer-digits ${secondsRemaining < 60 ? 'timer-warning' : ''}`}>
              ⏱️ {formatTime(secondsRemaining)}
            </span>
          </div>
        )}
      </header>

      {/* Configuration Bar (when session is inactive) */}
      {!isSessionActive ? (
        <div className="docs-revision-config-card">
          <h3 className="config-title">Configure Revision Session</h3>
          <div className="config-grid">
            <div className="config-group">
              <label>Select Timebox</label>
              <div className="timebox-btn-group">
                {([5, 15, 30] as TimeboxMinutes[]).map(mins => (
                  <button
                    key={mins}
                    type="button"
                    className={`timebox-btn ${timebox === mins ? 'active' : ''}`}
                    onClick={() => setTimebox(mins)}
                  >
                    ⏱️ {mins} Minutes
                  </button>
                ))}
              </div>
            </div>

            <div className="config-group">
              <label>Subject Track</label>
              <select
                className="config-select"
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
              >
                <option value="all">All 21 Subjects ({ALL_QUESTIONS_REGISTRY.length} Questions)</option>
                {ALL_SUBJECTS_CATALOG.map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {sub.icon} {sub.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="config-group">
              <label>Revision Focus</label>
              <select
                className="config-select"
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value as any)}
              >
                <option value="all">All Available Questions</option>
                <option value="must-know">🔥 Must Know / Senior Questions Only</option>
                <option value="traps">⚠️ Common Interview Traps &amp; Pitfalls</option>
              </select>
            </div>
          </div>

          <div className="config-footer">
            <span className="config-pool-info">
              Ready to review <strong>{questionPool.length} curated questions</strong> in {timebox} minutes.
            </span>
            <button type="button" className="start-revision-btn" onClick={startSession}>
              ⚡ Start {timebox}-Min Revision →
            </button>
          </div>
        </div>
      ) : isSessionFinished ? (
        /* Completion Summary Modal */
        <div className="revision-summary-card">
          <div className="rsc-header">
            <span className="rsc-icon">🏆</span>
            <h2>Revision Session Completed!</h2>
            <p>You completed your {timebox}-minute rapid-fire revision run.</p>
          </div>

          <div className="rsc-stats-grid">
            <div className="rsc-stat">
              <span className="stat-num">{questionPool.length}</span>
              <span className="stat-label">Reviewed</span>
            </div>
            <div className="rsc-stat">
              <span className="stat-num text-success">{masteredCount}</span>
              <span className="stat-label">Mastered</span>
            </div>
            <div className="rsc-stat">
              <span className="stat-num text-warning">{reviewCount}</span>
              <span className="stat-label">Needs Review</span>
            </div>
          </div>

          <div className="rsc-actions">
            <button type="button" className="restart-btn" onClick={startSession}>
              🔄 Run Another Session
            </button>
            <button type="button" className="exit-btn" onClick={() => setIsSessionActive(false)}>
              ← Back to Revision Config
            </button>
          </div>
        </div>
      ) : (
        /* Active Rapid-Fire Revision Card */
        currentQuestion && (
          <div className="revision-card-container">
            <div className="rc-top-meta">
              <div className="rc-tags">
                <span className="rc-badge subject-badge">{currentQuestion.subjectId.toUpperCase()}</span>
                <span className={`rc-badge diff-${currentQuestion.difficulty}`}>{currentQuestion.difficulty.toUpperCase()}</span>
                <span className="rc-badge exp-badge">LEVEL: {currentQuestion.experience.toUpperCase()}</span>
              </div>
              <div className="rc-counter">
                Question {currentIndex + 1} of {questionPool.length}
              </div>
            </div>

            <h2 className="rc-question-title">{currentQuestion.question}</h2>

            <div className="rc-actions-bar">
              <button
                type="button"
                className={`rc-reveal-btn ${isAnswerRevealed ? 'revealed' : ''}`}
                onClick={() => setIsAnswerRevealed(prev => !prev)}
              >
                {isAnswerRevealed ? 'Hide Answer' : '👁️ Reveal Answer (Space)'}
              </button>

              <button
                type="button"
                className={`rc-audio-btn ${isSpeaking ? 'speaking' : ''}`}
                onClick={handleToggleAudio}
                title="Listen to question and answer"
              >
                {isSpeaking ? '⏹ Stop' : '🔊 Listen'}
              </button>
            </div>

            {/* Answer Drawer */}
            {isAnswerRevealed && (
              <div className="rc-answer-drawer animate-fade-in">
                <div className="rc-quick-answer-box">
                  <h4 className="box-label">⚡ QUICK INTERVIEW ANSWER</h4>
                  <p className="box-text">{currentQuestion.shortAnswer}</p>
                </div>

                <div className="rc-detailed-answer-box">
                  <h4 className="box-label">📖 DETAILED TECHNICAL EXPLANATION</h4>
                  <SafeMarkdownViewer content={currentQuestion.detailedAnswer} />
                </div>

                {(currentQuestion.whyAsked?.commonWeakAnswer || (currentQuestion.commonMistakes && currentQuestion.commonMistakes.length > 0)) && (
                  <div className="rc-trap-alert-box">
                    <h4 className="box-label text-danger">⚠️ COMMON INTERVIEW TRAP</h4>
                    <p className="box-text">{currentQuestion.whyAsked?.commonWeakAnswer || currentQuestion.commonMistakes?.join(' • ')}</p>
                  </div>
                )}

                {currentQuestion.seniorAnswer && (
                  <div className="rc-senior-box">
                    <h4 className="box-label text-accent">🧠 SENIOR ARCHITECT SIGNAL</h4>
                    <p className="box-text">{currentQuestion.seniorAnswer}</p>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Grading Bar */}
            <div className="rc-grading-bar">
              <div className="rc-grade-buttons">
                <button
                  type="button"
                  className="grade-btn mastered"
                  onClick={() => handleRate('mastered')}
                  title="Press 1"
                >
                  ✅ Mastered (1)
                </button>
                <button
                  type="button"
                  className="grade-btn needs-review"
                  onClick={() => handleRate('review')}
                  title="Press 2"
                >
                  🔄 Needs Review (2)
                </button>
              </div>

              <div className="rc-nav-buttons">
                <button
                  type="button"
                  className="nav-btn prev"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  className="nav-btn next"
                  onClick={handleNext}
                >
                  Next (N) →
                </button>
              </div>
            </div>

            {/* Keyboard Shortcuts Hint */}
            <div className="rc-shortcuts-hint">
              <span>⌨️ Shortcuts:</span>
              <kbd>Space</kbd> Reveal Answer
              <kbd>1</kbd> Mastered
              <kbd>2</kbd> Review
              <kbd>N</kbd> Next
            </div>
          </div>
        )
      )}
    </div>
  );
}
