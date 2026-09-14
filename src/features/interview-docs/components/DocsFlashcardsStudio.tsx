import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import type { SubjectId, QuestionDifficulty, InterviewQuestion } from '../types/docs.types';
import { ALL_SUBJECTS_CATALOG } from '../data/subjectsCatalog';
import { ALL_QUESTIONS_REGISTRY } from '../data/docsRegistry';
import { docsProgressService } from '../services/docsProgressService';
import { docsAudioService } from '../services/docsAudioService';
import { SafeMarkdownViewer } from './common/SafeMarkdownViewer';

export function DocsFlashcardsStudio() {
  const [searchParams] = useSearchParams();
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>(
    () => (searchParams.get('subject') as SubjectId) || 'all'
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestionDifficulty | 'all'>('all');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deck, setDeck] = useState<InterviewQuestion[]>([]);
  const [sessionStats, setSessionStats] = useState({ mastered: 0, review: 0 });
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  useEffect(() => {
    return docsAudioService.subscribe((playing, activeId) => {
      setActiveSpeechId(playing ? activeId : null);
    });
  }, []);

  // Filter available cards
  const availableQuestions = useMemo(() => {
    return ALL_QUESTIONS_REGISTRY.filter(q => {
      const matchSub = selectedSubject === 'all' || q.subjectId === selectedSubject;
      const matchDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      return matchSub && matchDiff;
    });
  }, [selectedSubject, selectedDifficulty]);

  const handleStartDeck = () => {
    docsAudioService.stop();
    const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ mastered: 0, review: 0 });
    setIsSessionActive(true);
  };

  const handleFlip = () => {
    docsAudioService.stop();
    setIsFlipped(prev => !prev);
  };

  const handleScoreCard = (status: 'mastered' | 'review') => {
    docsAudioService.stop();
    const currentQ = deck[currentIndex];
    if (!currentQ) return;

    docsProgressService.recordQuestionAnswer(
      currentQ.subjectId,
      currentQ.id,
      status === 'mastered' ? 'knew-it' : 'needs-review'
    );

    setSessionStats(prev => ({
      ...prev,
      [status]: prev[status] + 1,
    }));

    if (currentIndex + 1 < deck.length) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setIsSessionActive(false);
    }
  };

  const handleNext = () => {
    docsAudioService.stop();
    if (currentIndex + 1 < deck.length) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    docsAudioService.stop();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const currentQ = deck[currentIndex];
  const isFinished = !isSessionActive && (sessionStats.mastered > 0 || sessionStats.review > 0);

  return (
    <div className="docs-flashcards-container">
      {/* Header */}
      <div className="flashcards-header-card">
        <div className="fhc-left">
          <span className="fhc-badge">⚡ RAPID RECALL</span>
          <h2>Technical Interview Flashcards</h2>
          <p>
            Anki-style rapid recall cards across all 21 tracks. Flip to check the core concept, code pattern, and senior perspective.
          </p>
        </div>
        <div className="fhc-right">
          <Link to="/docs/practice" className="switch-mode-link">
            Switch to Quiz Mode →
          </Link>
        </div>
      </div>

      {/* Configuration View */}
      {!isSessionActive && !isFinished && (
        <div className="flashcard-config-card">
          <h3>Configure Flashcard Deck</h3>
          <div className="config-grid">
            <div className="config-field">
              <label>Learning Track</label>
              <select
                className="config-select"
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value as SubjectId | 'all')}
              >
                <option value="all">🌟 All 21 Tracks Combined</option>
                {ALL_SUBJECTS_CATALOG.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.icon} {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="config-field">
              <label>Difficulty Tier</label>
              <select
                className="config-select"
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value as QuestionDifficulty | 'all')}
              >
                <option value="all">All Difficulties</option>
                <option value="easy">🟢 Easy (Fundamentals)</option>
                <option value="intermediate">🟡 Intermediate (Mid-Level)</option>
                <option value="difficult">🔴 Difficult (Senior/Lead)</option>
              </select>
            </div>
          </div>

          <div className="deck-start-bar">
            <span className="deck-card-count">
              <strong>{availableQuestions.length}</strong> flashcards available in this deck
            </span>
            <button
              type="button"
              className="start-deck-btn"
              onClick={handleStartDeck}
              disabled={availableQuestions.length === 0}
            >
              Start Rapid Flip Session ⚡
            </button>
          </div>
        </div>
      )}

      {/* Active Flip Session View */}
      {isSessionActive && currentQ && (
        <div className="flashcard-active-session">
          {/* Progress Tracker */}
          <div className="flashcard-progress-bar">
            <div className="fp-info">
              <span>Card <strong>{currentIndex + 1}</strong> of <strong>{deck.length}</strong></span>
              <span className="fp-track-name">{currentQ.subjectId.toUpperCase()} • {currentQ.topicId}</span>
            </div>
            <div className="fp-track">
              <div
                className="fp-fill"
                style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
              />
            </div>
          </div>

          {/* 3D Flip Card Container */}
          <div
            className={`flashcard-3d-box ${isFlipped ? 'flipped' : ''}`}
            onClick={handleFlip}
            role="button"
            tabIndex={0}
            aria-label="Click or press Space to flip card"
            onKeyDown={e => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                handleFlip();
              }
            }}
          >
            <div className="card-flipper">
              {/* FRONT OF CARD */}
              <div className="card-face card-front">
                <div className="face-header">
                  <div className="face-header-left">
                    <span className={`diff-pill pill-${currentQ.difficulty}`}>
                      {currentQ.difficulty.toUpperCase()}
                    </span>
                    <button
                      type="button"
                      className={`fc-audio-btn ${activeSpeechId === `fc-front-${currentQ.id}` ? 'speaking' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activeSpeechId === `fc-front-${currentQ.id}`) {
                          docsAudioService.stop();
                        } else {
                          docsAudioService.speak(currentQ.question, `fc-front-${currentQ.id}`);
                        }
                      }}
                      title={activeSpeechId === `fc-front-${currentQ.id}` ? 'Stop reading' : 'Listen to question'}
                    >
                      {activeSpeechId === `fc-front-${currentQ.id}` ? '⏹️' : '🔊'}
                    </button>
                  </div>
                  <span className="face-hint">Click card or press Space to flip ⟳</span>
                </div>
                <div className="face-body">
                  <h3 className="front-question-text">{currentQ.question}</h3>
                </div>
                <div className="face-footer">
                  <span className="front-tags">
                    {currentQ.tags.map(t => (
                      <span key={t} className="mini-tag">#{t}</span>
                    ))}
                  </span>
                </div>
              </div>

              {/* BACK OF CARD */}
              <div className="card-face card-back">
                <div className="face-header">
                  <div className="face-header-left">
                    <span className="face-badge-answer">ANSWER &amp; ARCHITECTURE</span>
                    <button
                      type="button"
                      className={`fc-audio-btn ${activeSpeechId === `fc-back-${currentQ.id}` ? 'speaking' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activeSpeechId === `fc-back-${currentQ.id}`) {
                          docsAudioService.stop();
                        } else {
                          docsAudioService.speak(`Core takeaway: ${currentQ.shortAnswer}`, `fc-back-${currentQ.id}`);
                        }
                      }}
                      title={activeSpeechId === `fc-back-${currentQ.id}` ? 'Stop reading' : 'Listen to answer'}
                    >
                      {activeSpeechId === `fc-back-${currentQ.id}` ? '⏹️' : '🔊'}
                    </button>
                  </div>
                  <span className="face-hint">Click to flip back ⟳</span>
                </div>
                <div className="face-body back-body-scroll">
                  <div className="back-quick-answer">
                    <strong>Core Takeaway:</strong> {currentQ.shortAnswer}
                  </div>
                  <div className="back-detailed-text">
                    <SafeMarkdownViewer content={currentQ.detailedAnswer} />
                  </div>
                  {currentQ.code && (
                    <div className="back-code-block">
                      <SafeMarkdownViewer content={`\`\`\`${currentQ.code.language}\n${currentQ.code.snippet}\n\`\`\``} />
                    </div>
                  )}
                  {currentQ.seniorAnswer && (
                    <div className="back-senior-note">
                      <strong>Senior Perspective:</strong> {currentQ.seniorAnswer}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Controls */}
          <div className="flashcard-controls-panel">
            <button
              type="button"
              className="fc-nav-btn"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              ← Previous
            </button>

            <button
              type="button"
              className="fc-flip-btn"
              onClick={handleFlip}
            >
              {isFlipped ? 'Show Question' : 'Flip to Answer (Space)'}
            </button>

            <div className="fc-scoring-buttons">
              <button
                type="button"
                className="score-card-btn btn-mastered"
                onClick={() => handleScoreCard('mastered')}
              >
                ✓ I Knew This (Mastered)
              </button>
              <button
                type="button"
                className="score-card-btn btn-review"
                onClick={() => handleScoreCard('review')}
              >
                ⚡ Need Practice
              </button>
            </div>

            <button
              type="button"
              className="fc-nav-btn"
              onClick={handleNext}
              disabled={currentIndex === deck.length - 1}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Finished Summary */}
      {isFinished && (
        <div className="flashcard-finished-card">
          <span className="finished-trophy">🏆</span>
          <h3>Flashcard Deck Completed!</h3>
          <p>You have reviewed all cards in this targeted sprint.</p>
          <div className="finished-stats-row">
            <div className="fs-pill text-green">
              <strong>{sessionStats.mastered}</strong> Mastered
            </div>
            <div className="fs-pill text-amber">
              <strong>{sessionStats.review}</strong> Needs Review
            </div>
          </div>
          <div className="finished-actions">
            <button type="button" className="start-deck-btn" onClick={handleStartDeck}>
              Restart This Deck
            </button>
            <Link to="/docs/readiness" className="view-readiness-btn">
              View Readiness Score →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
