import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { DocPage, SubjectMetadata } from '../types/docs.types';
import { docsTopicQuizService } from '../services/docsTopicQuizService';
import { docsProgressService } from '../services/docsProgressService';
import '../styles/DocsTopicMasteryQuiz.css';

export interface DocsTopicMasteryQuizProps {
  doc: DocPage;
  subject?: SubjectMetadata;
  onTopicCompletedChange?: (isCompleted: boolean) => void;
}

export function DocsTopicMasteryQuiz({ doc, subject, onTopicCompletedChange }: DocsTopicMasteryQuizProps) {
  const quizQuestions = useMemo(() => {
    return docsTopicQuizService.getQuizForTopic(doc, subject);
  }, [doc, subject]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [isTopicMasteredInSyllabus, setIsTopicMasteredInSyllabus] = useState(() => {
    return docsProgressService.isTopicCompleted(doc.subjectId, doc.topicId);
  });

  // Reset state when topic changes
  useEffect(() => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsAnswerRevealed(false);
    setIsQuizCompleted(false);
    setIsTopicMasteredInSyllabus(docsProgressService.isTopicCompleted(doc.subjectId, doc.topicId));
  }, [doc.subjectId, doc.topicId]);

  // Synchronize when topic completion updates elsewhere
  useEffect(() => {
    const handleSync = () => {
      setIsTopicMasteredInSyllabus(docsProgressService.isTopicCompleted(doc.subjectId, doc.topicId));
    };
    window.addEventListener('docs_progress_updated', handleSync);
    return () => window.removeEventListener('docs_progress_updated', handleSync);
  }, [doc.subjectId, doc.topicId]);

  const currentQ = quizQuestions[currentIndex];
  const totalQuestions = quizQuestions.length;

  // Calculate score
  const correctCount = useMemo(() => {
    return quizQuestions.reduce((acc, q) => {
      return selectedAnswers[q.id] === q.correctIndex ? acc + 1 : acc;
    }, 0);
  }, [quizQuestions, selectedAnswers]);

  const scorePercentage = Math.round((correctCount / Math.max(1, totalQuestions)) * 100);
  const isPassing = scorePercentage >= 65;

  const handleSelectOption = (optionIndex: number) => {
    if (isAnswerRevealed || !currentQ) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
    setIsAnswerRevealed(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex(prev => prev + 1);
      setIsAnswerRevealed(false);
    } else {
      setIsQuizCompleted(true);
      // If passed and not completed, auto record practice attempt
      if (isPassing) {
        docsProgressService.recordQuestionAnswer(doc.subjectId, currentQ.id, 'knew-it');
      }
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsAnswerRevealed(false);
    setIsQuizCompleted(false);
  };

  const handleMarkTopicInSyllabus = () => {
    const nextState = docsProgressService.toggleTopicCompleted(doc.subjectId, doc.topicId);
    setIsTopicMasteredInSyllabus(nextState);
    if (onTopicCompletedChange) {
      onTopicCompletedChange(nextState);
    }
  };

  if (totalQuestions === 0) return null;

  return (
    <section className="topic-mastery-quiz-card" id="topic-mastery-quiz" aria-label="Topic Mastery Assessment">
      {/* Quiz Card Header */}
      <div className="tmq-header">
        <div className="tmq-header-left">
          <div className="tmq-badge-row">
            <span className="tmq-badge">🧠 Retention &amp; Mastery Quiz</span>
            <span className="tmq-reward-pill">+50 XP Syllabus Bonus</span>
          </div>
          <h3 className="tmq-title">Self-Assessment: {doc.title}</h3>
          <p className="tmq-subtitle">
            Validate your conceptual retention, avoid subtle gotchas, and verify readiness for technical interviews.
          </p>
        </div>

        <div className="tmq-header-right">
          <span className="tmq-progress-stat">
            {!isQuizCompleted ? `Question ${currentIndex + 1} of ${totalQuestions}` : `Completed (${totalQuestions}/${totalQuestions})`}
          </span>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="tmq-stepper-track">
        <div
          className="tmq-stepper-fill"
          style={{
            width: isQuizCompleted
              ? '100%'
              : `${Math.round(((currentIndex + (isAnswerRevealed ? 1 : 0)) / totalQuestions) * 100)}%`
          }}
        />
      </div>

      {/* Active Question Screen */}
      {!isQuizCompleted && currentQ && (
        <div className="tmq-question-wrap">
          <div className="tmq-meta-chips">
            <span className={`tmq-diff-pill diff-${currentQ.difficulty}`}>
              {currentQ.difficulty === 'easy' ? '🟢 Easy' : currentQ.difficulty === 'intermediate' ? '🟡 Intermediate' : '🔴 Difficult'}
            </span>
            <span className="tmq-concept-pill">
              📌 {currentQ.conceptTag}
            </span>
          </div>

          <h4 className="tmq-prompt-text">{currentQ.prompt}</h4>

          {currentQ.codeSnippet && (
            <pre className="tmq-code-snippet">
              <code>{currentQ.codeSnippet.code}</code>
            </pre>
          )}

          {/* Options Grid */}
          <div className="tmq-options-grid" role="radiogroup">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentQ.id] === idx;
              const isCorrect = idx === currentQ.correctIndex;
              let optionStateClass = '';

              if (isAnswerRevealed) {
                if (isCorrect) optionStateClass = 'state-correct';
                else if (isSelected) optionStateClass = 'state-incorrect';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  className={`tmq-option-btn ${optionStateClass}`}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerRevealed}
                  aria-checked={isSelected}
                  role="radio"
                >
                  <span className="tmq-opt-letter">{String.fromCharCode(65 + idx)}</span>
                  <span className="tmq-opt-text">{opt}</span>
                  {isAnswerRevealed && isCorrect && (
                    <span className="tmq-status-tag correct">✓ Correct</span>
                  )}
                  {isAnswerRevealed && isSelected && !isCorrect && (
                    <span className="tmq-status-tag incorrect">✕ Incorrect</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Card upon answering */}
          {isAnswerRevealed && (
            <div className="tmq-explanation-box">
              <div className="teb-header">
                <span>💡 Senior Engineer Takeaway</span>
              </div>
              <p className="teb-content">{currentQ.explanation}</p>
              <div className="tmq-actions-bar">
                <button
                  type="button"
                  className="tmq-next-btn"
                  onClick={handleNextQuestion}
                >
                  {currentIndex + 1 < totalQuestions ? 'Next Question →' : 'See Assessment Results →'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Completion & Score Screen */}
      {isQuizCompleted && (
        <div className="tmq-completed-card">
          <div className="tmc-icon-badge">
            {isPassing ? '🏆' : '📚'}
          </div>
          <h4 className="tmc-heading">
            {isPassing ? 'Topic Conceptual Retention Mastered!' : 'Assessment Complete — Review Recommended'}
          </h4>
          <p className="tmc-subtext">
            {isPassing
              ? `Outstanding performance! You answered ${correctCount} of ${totalQuestions} questions correctly (${scorePercentage}%). You have demonstrated solid architectural mastery of ${doc.title}.`
              : `You scored ${correctCount} of ${totalQuestions} (${scorePercentage}%). Review the key concepts and common mistakes in the documentation sections above before technical rounds.`}
          </p>

          <div className="tmc-score-banner">
            <div className="tsb-metric">
              <span className="tsb-num">{scorePercentage}%</span>
              <span className="tsb-label">Score</span>
            </div>
            <div className="tsb-divider" />
            <div className="tsb-metric">
              <span className="tsb-num">{correctCount} / {totalQuestions}</span>
              <span className="tsb-label">Correct</span>
            </div>
            <div className="tsb-divider" />
            <div className="tsb-metric">
              <span className="tsb-num" style={{ color: isPassing ? '#10b981' : '#f59e0b' }}>
                {isPassing ? 'PASS' : 'REVIEW'}
              </span>
              <span className="tsb-label">Verdict</span>
            </div>
          </div>

          <div className="tmc-buttons-row">
            <button
              type="button"
              className={`tmc-mark-complete-btn ${isTopicMasteredInSyllabus ? 'already-done' : ''}`}
              onClick={handleMarkTopicInSyllabus}
            >
              {isTopicMasteredInSyllabus ? '✓ Topic Completed in Syllabus' : '✓ Mark Topic Completed in Syllabus (+50 XP)'}
            </button>

            <button
              type="button"
              className="tmc-retake-btn"
              onClick={handleRetakeQuiz}
            >
              🔄 Retake Quiz
            </button>

            <Link
              to={`/docs/practice?subject=${doc.subjectId}&topic=${doc.topicId}`}
              className="tmc-practice-btn"
            >
              🎯 Full Practice Studio →
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
