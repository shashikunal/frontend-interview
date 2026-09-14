import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import type { SubjectId, QuestionDifficulty } from '../types/docs.types';
import { ALL_SUBJECTS_CATALOG } from '../data/subjectsCatalog';
import { ALL_QUESTIONS_REGISTRY } from '../data/docsRegistry';
import { docsProgressService } from '../services/docsProgressService';
import { docsAudioService } from '../services/docsAudioService';
import { SafeMarkdownViewer } from './common/SafeMarkdownViewer';

export function DocsPracticeStudio() {
  const [searchParams] = useSearchParams();
  const initialTopic = searchParams.get('topic') || '';

  // Filter Configuration
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>(
    () => (searchParams.get('subject') as SubjectId) || 'all'
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestionDifficulty | 'all'>('all');
  const [sessionQuestionCount, setSessionQuestionCount] = useState<number>(10);
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);
  const [bookmarkedList, setBookmarkedList] = useState<string[]>(() => docsProgressService.getProgress().bookmarkedQuestions);

  // Session State
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [sessionResults, setSessionResults] = useState<Record<string, 'knew-it' | 'needs-review' | 'missed'>>({});
  const [sessionQuestions, setSessionQuestions] = useState(ALL_QUESTIONS_REGISTRY);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return docsAudioService.subscribe((playing, activeId) => {
      setIsSpeaking(playing && !!activeId && activeId.startsWith('practice-'));
    });
  }, []);

  const userProgress = docsProgressService.getProgress();

  // Filter eligible questions respecting no-repeat logic & bookmarks
  const availableQuestions = useMemo(() => {
    return ALL_QUESTIONS_REGISTRY.filter(q => {
      const subjectMatch = selectedSubject === 'all' || q.subjectId === selectedSubject;
      const difficultyMatch = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      const topicMatch = !initialTopic || q.topicId === initialTopic;
      const bookmarkMatch = !onlyBookmarks || bookmarkedList.includes(q.id);
      return subjectMatch && difficultyMatch && topicMatch && bookmarkMatch;
    });
  }, [selectedSubject, selectedDifficulty, initialTopic, onlyBookmarks, bookmarkedList]);

  const handleToggleBookmark = (questionId: string) => {
    const isSaved = docsProgressService.toggleQuestionBookmark(questionId);
    setBookmarkedList(prev => (isSaved ? [...prev, questionId] : prev.filter(id => id !== questionId)));
  };

  const handleStartPractice = () => {
    docsAudioService.stop();
    // Exclude mastered questions first (no-repeat policy)
    let eligible = availableQuestions.filter(q => userProgress.questionMastery[q.id] !== 'mastered');
    if (eligible.length === 0) {
      eligible = [...availableQuestions]; // All are mastered, reset for review
    }

    const shuffled = [...eligible].sort(() => Math.random() - 0.5).slice(0, sessionQuestionCount);
    setSessionQuestions(shuffled);
    setCurrentIndex(0);
    setIsAnswerRevealed(false);
    setSessionResults({});
    setIsSessionActive(true);
  };

  const handleGradeCurrentQuestion = (status: 'knew-it' | 'needs-review' | 'missed') => {
    docsAudioService.stop();
    const activeQuestion = sessionQuestions[currentIndex];
    if (!activeQuestion) return;

    docsProgressService.recordQuestionAnswer(activeQuestion.subjectId, activeQuestion.id, status);

    setSessionResults(prev => ({
      ...prev,
      [activeQuestion.id]: status,
    }));

    // Move to next question or complete
    if (currentIndex + 1 < sessionQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setIsAnswerRevealed(false);
    } else {
      setIsSessionActive(false); // Session completed
    }
  };

  const currentQ = sessionQuestions[currentIndex];
  const isFinished = !isSessionActive && Object.keys(sessionResults).length > 0;

  return (
    <div className="docs-practice-studio-container">
      {/* Studio Header */}
      <div className="practice-header-card">
        <div className="ph-left">
          <span className="ph-badge">🎯 LEETCODE &amp; QUIZ PRACTICE</span>
          <h2>Interactive Technical Practice Mode</h2>
          <p>
            Sharpen your instant recall and problem-solving intuition with no-repeat spaced review.
          </p>
        </div>
        <div className="ph-right">
          <div className="ph-stat-pill">
            <span className="stat-label">Total Completed</span>
            <span className="stat-val">{userProgress.practiceAttemptsCount}</span>
          </div>
          <div className="ph-stat-pill">
            <span className="stat-label">Mastered</span>
            <span className="stat-val text-green">
              {Object.values(userProgress.questionMastery).filter(m => m === 'mastered').length}
            </span>
          </div>
        </div>
      </div>

      {/* Configuration View (Before Start) */}
      {!isSessionActive && !isFinished && (
        <div className="practice-config-panel">
          <h3 className="config-title">Configure Practice Set</h3>

          <div className="config-grid">
            <div className="config-field">
              <label>Select Learning Track</label>
              <select
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value as SubjectId | 'all')}
                className="config-select"
              >
                <option value="all">🌐 All 21 Tracks Combined</option>
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
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value as any)}
                className="config-select"
              >
                <option value="all">All Difficulties (Balanced)</option>
                <option value="easy">🟢 Easy Fundamentals</option>
                <option value="intermediate">🟡 Intermediate Professional</option>
                <option value="difficult">🔴 Difficult Staff / Architect</option>
              </select>
            </div>

            <div className="config-field">
              <label>Question Count</label>
              <select
                value={sessionQuestionCount}
                onChange={e => setSessionQuestionCount(Number(e.target.value))}
                className="config-select"
              >
                <option value={5}>5 Questions (Rapid 5-min Sprint)</option>
                <option value={10}>10 Questions (Standard Session)</option>
                <option value={20}>20 Questions (Deep Assessment)</option>
              </select>
            </div>

            <div className="config-field">
              <label>Bookmark Filter</label>
              <button
                type="button"
                className={`practice-filter-toggle-btn ${onlyBookmarks ? 'active' : ''}`}
                onClick={() => setOnlyBookmarks(prev => !prev)}
              >
                {onlyBookmarks ? '🔖 Bookmarked Only (Active)' : '🔖 All Questions'} ({bookmarkedList.length} saved)
              </button>
            </div>
          </div>

          <div className="config-actions-bar">
            <span className="available-count-info">
              {availableQuestions.length} unique questions available in this category.
              {onlyBookmarks && availableQuestions.length === 0 && (
                <span className="no-bookmarks-hint"> (Tip: bookmark questions during practice or reading to review them here)</span>
              )}
            </span>
            <button
              type="button"
              className="start-practice-btn"
              onClick={handleStartPractice}
              disabled={availableQuestions.length === 0}
            >
              Start Practice Session →
            </button>
          </div>
        </div>
      )}

      {/* Active Question Session View */}
      {isSessionActive && currentQ && (
        <div className="practice-active-session">
          {/* Progress bar */}
          <div className="practice-progress-header">
            <span className="q-progress-text">
              Question <strong>{currentIndex + 1}</strong> of <strong>{sessionQuestions.length}</strong>
            </span>
            <div className="q-progress-track">
              <div
                className="q-progress-fill"
                style={{ width: `${((currentIndex + 1) / sessionQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Flashcard Question Panel */}
          <div className="practice-flashcard">
            <div className="card-top-tags">
              <div className="card-tags-left">
                <span className={`diff-pill pill-${currentQ.difficulty}`}>
                  {currentQ.difficulty.toUpperCase()}
                </span>
                <span className="category-pill">{currentQ.type}</span>
              </div>
              <div className="card-top-actions">
                <button
                  type="button"
                  className={`practice-audio-btn ${isSpeaking ? 'speaking' : ''}`}
                  onClick={() => {
                    if (isSpeaking) {
                      docsAudioService.stop();
                    } else {
                      const textToRead = isAnswerRevealed
                        ? `Question: ${currentQ.question}. Core takeaway: ${currentQ.shortAnswer}`
                        : currentQ.question;
                      docsAudioService.speak(textToRead, `practice-${currentQ.id}`);
                    }
                  }}
                  title={isSpeaking ? 'Stop narration' : 'Listen to question'}
                >
                  {isSpeaking ? '⏹️ Stop' : '🔊 Listen'}
                </button>
                <button
                  type="button"
                  className={`practice-bookmark-btn ${bookmarkedList.includes(currentQ.id) ? 'bookmarked' : ''}`}
                  onClick={() => handleToggleBookmark(currentQ.id)}
                  title={bookmarkedList.includes(currentQ.id) ? 'Remove bookmark' : 'Bookmark question'}
                >
                  {bookmarkedList.includes(currentQ.id) ? '🔖 Saved' : '🔖 Bookmark'}
                </button>
              </div>
            </div>

            <h3 className="card-question-title">{currentQ.question}</h3>

            {!isAnswerRevealed ? (
              <div className="card-think-prompt">
                <p>💭 Think through the answer in your head or jot down notes before revealing...</p>
                <button
                  type="button"
                  className="reveal-answer-btn"
                  onClick={() => setIsAnswerRevealed(true)}
                >
                  👁️ Reveal Complete Answer
                </button>
              </div>
            ) : (
              <div className="card-revealed-answer-box">
                <div className="short-answer-summary">
                  <strong>Core Takeaway:</strong>
                  <p>{currentQ.shortAnswer}</p>
                </div>

                <div className="detailed-explanation">
                  <SafeMarkdownViewer content={currentQ.detailedAnswer} />
                </div>

                {currentQ.code && (
                  <div className="card-code-block">
                    <SafeMarkdownViewer content={`\`\`\`${currentQ.code.language}\n${currentQ.code.snippet}\n\`\`\``} />
                  </div>
                )}

                {/* Self-Grading Buttons */}
                <div className="self-grading-bar">
                  <span className="grade-prompt">How confident were you?</span>
                  <div className="grade-buttons-group">
                    <button
                      type="button"
                      className="grade-btn btn-knew"
                      onClick={() => handleGradeCurrentQuestion('knew-it')}
                    >
                      ✓ Mastered It
                    </button>
                    <button
                      type="button"
                      className="grade-btn btn-review"
                      onClick={() => handleGradeCurrentQuestion('needs-review')}
                    >
                      ⚡ Needs Review
                    </button>
                    <button
                      type="button"
                      className="grade-btn btn-missed"
                      onClick={() => handleGradeCurrentQuestion('missed')}
                    >
                      ✕ Missed It
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Session Completed View */}
      {isFinished && (
        <div className="practice-results-card">
          <div className="results-trophy-icon">🏆</div>
          <h3>Practice Session Completed!</h3>
          <p>
            You answered <strong>{sessionQuestions.length}</strong> questions in this session.
          </p>

          <div className="results-breakdown-row">
            <div className="r-box r-green">
              <span className="r-num">
                {Object.values(sessionResults).filter(v => v === 'knew-it').length}
              </span>
              <span className="r-lbl">Mastered</span>
            </div>
            <div className="r-box r-amber">
              <span className="r-num">
                {Object.values(sessionResults).filter(v => v === 'needs-review').length}
              </span>
              <span className="r-lbl">Needs Review</span>
            </div>
            <div className="r-box r-red">
              <span className="r-num">
                {Object.values(sessionResults).filter(v => v === 'missed').length}
              </span>
              <span className="r-lbl">Missed</span>
            </div>
          </div>

          <div className="results-actions-bar">
            <button
              type="button"
              className="start-practice-btn"
              onClick={handleStartPractice}
            >
              🔄 Practice Another Batch
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
