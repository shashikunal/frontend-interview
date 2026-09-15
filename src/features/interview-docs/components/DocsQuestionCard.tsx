import { useState, useEffect } from 'react';
import type { InterviewQuestion } from '../types/docs.types';
import { SafeMarkdownViewer } from './common/SafeMarkdownViewer';
import { docsProgressService } from '../services/docsProgressService';
import { docsAudioService } from '../services/docsAudioService';

interface DocsQuestionCardProps {
  question: InterviewQuestion;
  index: number;
  initialBookmarked?: boolean;
}

export function DocsQuestionCard({ question, index, initialBookmarked = false }: DocsQuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'quick' | 'detailed' | 'senior' | 'whyAsked'>('quick');
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [activeFollowUpIndex, setActiveFollowUpIndex] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return docsAudioService.subscribe((playing, activeId) => {
      setIsSpeaking(playing && activeId === question.id);
    });
  }, [question.id]);

  useEffect(() => {
    setIsBookmarked(docsProgressService.isQuestionBookmarked(question.id));
    const handleSync = () => {
      setIsBookmarked(docsProgressService.isQuestionBookmarked(question.id));
    };
    window.addEventListener('docs_progress_updated', handleSync);
    return () => window.removeEventListener('docs_progress_updated', handleSync);
  }, [question.id]);

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = docsProgressService.toggleQuestionBookmark(question.id);
    setIsBookmarked(result);
  };

  const handleToggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      docsAudioService.stop();
    } else {
      const speechText = `Question: ${question.question}. Core takeaway: ${question.shortAnswer}.`;
      docsAudioService.speak(speechText, question.id);
    }
  };

  const getDifficultyBadge = (diff: string) => {
    if (diff === 'easy') return <span className="diff-badge diff-easy">🟢 EASY</span>;
    if (diff === 'intermediate') return <span className="diff-badge diff-mid">🟡 INTERMEDIATE</span>;
    return <span className="diff-badge diff-hard">🔴 DIFFICULT</span>;
  };

  return (
    <article className={`docs-question-card ${isExpanded ? 'is-expanded' : ''}`} id={question.id}>
      <div className="dqc-header" onClick={() => setIsExpanded(prev => !prev)}>
        <div className="dqc-header-left">
          <span className="dqc-index-num">Q{index + 1}</span>
          <h4 className="dqc-title">{question.question}</h4>
        </div>
        <div className="dqc-header-right">
          {getDifficultyBadge(question.difficulty)}
          <span className="dqc-type-pill">{question.type}</span>
          <button
            type="button"
            className={`dqc-audio-btn ${isSpeaking ? 'speaking' : ''}`}
            onClick={handleToggleAudio}
            title={isSpeaking ? 'Stop narration' : 'Listen to question & answer'}
            aria-label="Listen to question narration"
          >
            {isSpeaking ? '⏹️' : '🔊'}
          </button>
          <button
            type="button"
            className={`dqc-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={handleToggleBookmark}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
            aria-label="Bookmark question"
          >
            {isBookmarked ? '★' : '☆'}
          </button>
          <span className="dqc-expand-caret">{isExpanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="dqc-body">
          {/* Answer Mode Tabs */}
          <div className="dqc-tabs-bar" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'quick'}
              className={`dqc-tab-btn ${activeTab === 'quick' ? 'active' : ''}`}
              onClick={() => setActiveTab('quick')}
            >
              ⚡ Quick Answer
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'detailed'}
              className={`dqc-tab-btn ${activeTab === 'detailed' ? 'active' : ''}`}
              onClick={() => setActiveTab('detailed')}
            >
              📖 Detailed Answer
            </button>
            {question.seniorAnswer && (
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'senior'}
                className={`dqc-tab-btn ${activeTab === 'senior' ? 'active' : ''}`}
                onClick={() => setActiveTab('senior')}
              >
                👔 Senior / Architect View
              </button>
            )}
            {question.whyAsked && (
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'whyAsked'}
                className={`dqc-tab-btn ${activeTab === 'whyAsked' ? 'active' : ''}`}
                onClick={() => setActiveTab('whyAsked')}
              >
                🎯 Why Is This Asked?
              </button>
            )}
          </div>

          {/* Tab Content Display */}
          <div className="dqc-tab-panel">
            {activeTab === 'quick' && (
              <div className="dqc-quick-answer-box">
                <div className="quick-answer-tag">2-Sentence Rapid Recall:</div>
                <p className="dqc-answer-p">{question.shortAnswer}</p>
              </div>
            )}

            {activeTab === 'detailed' && (
              <div className="dqc-detailed-answer-box">
                <SafeMarkdownViewer content={question.detailedAnswer} />

                {question.code && (
                  <div className="dqc-code-sample">
                    <span className="dqc-code-caption">Production Code Example:</span>
                    <SafeMarkdownViewer content={`\`\`\`${question.code.language}\n${question.code.snippet}\n\`\`\``} />
                    {question.code.explanation && (
                      <p className="dqc-code-note">{question.code.explanation}</p>
                    )}
                  </div>
                )}

                {question.commonMistakes && question.commonMistakes.length > 0 && (
                  <div className="dqc-mistakes-alert">
                    <strong>⚠️ Common Interview Pitfall:</strong>
                    <ul>
                      {question.commonMistakes.map((m, mIdx) => (
                        <li key={mIdx}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'senior' && question.seniorAnswer && (
              <div className="dqc-senior-answer-box">
                <div className="senior-badge-indicator">
                  <span>👔 Staff / Principal Engineer Evaluation Criteria:</span>
                </div>
                <SafeMarkdownViewer content={question.seniorAnswer} />
              </div>
            )}

            {activeTab === 'whyAsked' && question.whyAsked && (
              <div className="dqc-why-asked-grid">
                <div className="why-asked-card testing-objective">
                  <span className="wac-label">🎯 What Interviewer Is Testing</span>
                  <p>{question.whyAsked.testingObjective}</p>
                </div>
                <div className="why-asked-card expected-signal">
                  <span className="wac-label">🟢 Expected Competency Signal</span>
                  <p>{question.whyAsked.expectedSignal}</p>
                </div>
                <div className="why-asked-card weak-answer">
                  <span className="wac-label">❌ Common Weak Answer</span>
                  <p>{question.whyAsked.commonWeakAnswer}</p>
                </div>
                <div className="why-asked-card strong-answer">
                  <span className="wac-label">⭐ Strong Senior Response</span>
                  <p>{question.whyAsked.strongSeniorAnswer}</p>
                </div>
              </div>
            )}
          </div>

          {/* Follow-up Interview Chains */}
          {question.followUps && question.followUps.length > 0 && (
            <div className="dqc-followups-section">
              <span className="dqc-followups-title">🔄 Realistic Interview Follow-Up Questions:</span>
              <div className="dqc-followups-list">
                {question.followUps.map((fu, fuIdx) => {
                  const isOpen = activeFollowUpIndex === fuIdx;
                  return (
                    <div key={fu.id} className="dqc-followup-item">
                      <div
                        className="dqc-followup-header"
                        onClick={() => setActiveFollowUpIndex(isOpen ? null : fuIdx)}
                      >
                        <span className="fu-depth-tag">{fu.depthLevel.toUpperCase()}</span>
                        <span className="fu-question-text">{fu.question}</span>
                        <span className="fu-toggle-icon">{isOpen ? '−' : '+'}</span>
                      </div>
                      {isOpen && (
                        <div className="dqc-followup-answer">
                          <p><strong>Expected Senior Answer:</strong> {fu.expectedAnswer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="dqc-tags-row">
            {question.tags.map(t => (
              <span key={t} className="dqc-tag">#{t}</span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
