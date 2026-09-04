import { useState, useEffect, useRef } from 'react';
import type { MCQuestion } from './machineCodingQuestions';
import './AIInterviewPrompter.css';

interface Props {
  question: MCQuestion;
  onClose: () => void;
}

export default function AIInterviewPrompter({ question, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'briefing' | 'hints' | 'probing'>('briefing');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [transcript, setTranscript] = useState<string>('');
  const [hintLevel, setHintLevel] = useState<number>(1);
  const [selectedProbingIdx, setSelectedProbingIdx] = useState<number | null>(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Stop speaking when question changes or unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [question.id]);

  // Speech Helper
  const speakText = (text: string) => {
    setTranscript(text);
    if (isMuted) return;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // cancel any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate;
      utterance.pitch = 1.05;

      // Select a natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v =>
        v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('David'))
      ) || voices.find(v => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Content Generators
  const getBriefingText = () => {
    const mainReq = question.requirements[0] || 'implement core component state';
    const pitfall = question.commonMistakes[0] || 'neglecting edge-case bounds and cleanup handlers';
    return `Welcome to your FAANG machine coding round! Today you'll be implementing: ${question.title}. ` +
      `Your main goal is to ${mainReq}. As an interviewer, I'll be evaluating clean state modeling, performance, and defensive error handling. ` +
      `Be especially mindful of ${pitfall}. You have full access to automated tests. Take a moment to inspect the requirements, and let's build something solid!`;
  };

  const getHintContent = (level: number) => {
    if (level === 1) {
      return {
        title: 'Level 1: Conceptual Architecture',
        text: `Think carefully about component state boundaries. For ${question.title}, you'll want to separate stateful business logic from presentation. ` +
          `Consider whether state should live in a custom hook or directly in the component, and identify which values need to trigger re-renders versus refs for mutable flags.`
      };
    } else if (level === 2) {
      const tip = question.interviewTips[0] || 'handle cleanup effects on unmount';
      return {
        title: 'Level 2: Edge-Case & Pitfall Warning',
        text: `Here is an edge-case tip that separates Senior candidates: ${tip}. ` +
          `Also verify asynchronous event ordering—if users interact rapidly, ensure state updates do not race or cause stale closures.`
      };
    } else {
      return {
        title: 'Level 3: Senior Staff Blueprint',
        text: `Blueprint breakdown: 1) Initialize state with sensible defaults. ` +
          `2) Set up event handlers with input validation. ` +
          `3) Use useMemo or useCallback only where reference stability matters. ` +
          `4) Ensure ARIA accessibility attributes such as role and aria-live are present for assistive tech.`
      };
    }
  };

  const PROBING_QUESTIONS = [
    {
      q: 'How would you scale this implementation if dataset grew to 100,000 items?',
      answer:
        'I would implement windowed list virtualization (e.g. TanStack Virtual or react-window) to render only items in the visible DOM viewport (~20-30 DOM nodes). ' +
        'Additionally, I would offload filtering/searching to Web Workers or indexed lookups (Trie/Map) to avoid blocking the main JavaScript thread at 60fps.'
    },
    {
      q: 'What trade-offs did you make regarding React re-rendering performance?',
      answer:
        'I kept state localized to child leaf components where possible so state updates do not trigger unnecessary top-level subtree reconciliations. ' +
        'For event callbacks passed as props, useCallback prevents children wrapped in React.memo from re-rendering unless internal dependencies change.'
    },
    {
      q: 'How did you ensure WCAG 2.1 AA accessibility in this component?',
      answer:
        'I ensured full keyboard navigability (Tab focus traps, Arrow keys, Enter/Space activation), added explicit aria-labels on icon buttons, ' +
        'configured aria-live="polite" for dynamic state announcements, and maintained minimum 4.5:1 contrast ratios across both light and dark modes.'
    }
  ];

  // Auto-speak initial briefing on first open if not muted
  useEffect(() => {
    speakText(getBriefingText());
  }, [question.id]);

  return (
    <div className="mc-prompter-panel" role="region" aria-label="AI Interviewer Companion">
      {/* Header with Avatar & Waveform */}
      <div className="mc-prompter-header">
        <div className="mc-prompter-persona">
          <div className="mc-prompter-avatar">
            <span className="mc-avatar-emoji">👨‍💼</span>
            <span className={`mc-avatar-status-dot ${isSpeaking ? 'speaking' : 'ready'}`} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mc-persona-name">Alex Mercer</span>
              <span className="mc-persona-badge">L6 Senior Staff Interviewer</span>
            </div>
            <div className="mc-persona-role">Meta / Google Frontend Bar Raiser</div>
          </div>
        </div>

        {/* Controls: Audio Waveform + Mute + Close */}
        <div className="mc-prompter-header-actions">
          {/* Waveform visualizer */}
          <div className={`mc-audio-waveform ${isSpeaking ? 'active' : ''}`} title={isSpeaking ? 'Interviewer speaking...' : 'Audio idle'}>
            <span className="mc-wave-bar" />
            <span className="mc-wave-bar" />
            <span className="mc-wave-bar" />
            <span className="mc-wave-bar" />
            <span className="mc-wave-bar" />
          </div>

          <button
            className={`mc-prompter-icon-btn ${isMuted ? 'muted' : ''}`}
            onClick={() => {
              if (!isMuted) stopSpeaking();
              setIsMuted(!isMuted);
            }}
            title={isMuted ? 'Unmute voice prompter' : 'Mute voice prompter'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          <select
            className="mc-speech-rate-select"
            value={speechRate}
            onChange={(e) => {
              const rate = parseFloat(e.target.value);
              setSpeechRate(rate);
              if (isSpeaking) {
                stopSpeaking();
                setTimeout(() => speakText(transcript), 50);
              }
            }}
            title="Speech Rate"
          >
            <option value="0.9">0.9x</option>
            <option value="1.0">1.0x</option>
            <option value="1.15">1.15x</option>
          </select>

          <button className="mc-prompter-icon-btn" onClick={onClose} title="Hide AI Interviewer">
            ✕
          </button>
        </div>
      </div>

      {/* Mode Tabs: Briefing | Progressive Hints | Probing Questions */}
      <div className="mc-prompter-tabs">
        <button
          className={`mc-prompter-tab ${activeTab === 'briefing' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('briefing');
            speakText(getBriefingText());
          }}
        >
          🎙️ Challenge Briefing
        </button>
        <button
          className={`mc-prompter-tab ${activeTab === 'hints' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('hints');
            const h = getHintContent(hintLevel);
            speakText(h.text);
          }}
        >
          💡 Progressive Hints ({hintLevel}/3)
        </button>
        <button
          className={`mc-prompter-tab ${activeTab === 'probing' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('probing');
            if (selectedProbingIdx === null) {
              setSelectedProbingIdx(0);
              speakText(PROBING_QUESTIONS[0].q);
            }
          }}
        >
          ❓ Architectural Probing
        </button>
      </div>

      {/* Main Body */}
      <div className="mc-prompter-body">
        {/* Live Transcript Bubble */}
        <div className="mc-transcript-box">
          <div className="mc-transcript-header">
            <span className="mc-transcript-label">
              {isSpeaking ? '🗣️ INTERVIEWER SPEAKING...' : '💬 INTERVIEWER TRANSCRIPT'}
            </span>
            {isSpeaking ? (
              <button className="mc-transcript-action" onClick={stopSpeaking}>
                ⏹️ Pause Audio
              </button>
            ) : (
              <button className="mc-transcript-action" onClick={() => speakText(transcript)}>
                ▶ Replay Audio
              </button>
            )}
          </div>
          <p className="mc-transcript-text">{transcript}</p>
        </div>

        {/* Tab Specific Content */}
        {activeTab === 'briefing' && (
          <div className="mc-briefing-pane">
            <div className="mc-prompt-tip-card">
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#38bdf8' }}>
                💡 Pro-Tip for this challenge:
              </span>
              <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Before diving into code, clarify the state contracts. Mention any assumptions aloud to demonstrate Senior engineering communication.
              </p>
            </div>
            <button className="mc-prompter-cta-btn" onClick={() => speakText(getBriefingText())}>
              ▶ Re-read Challenge Briefing Aloud
            </button>
          </div>
        )}

        {activeTab === 'hints' && (
          <div className="mc-hints-pane">
            <div className="mc-hint-level-picker">
              {[1, 2, 3].map(lvl => (
                <button
                  key={lvl}
                  className={`mc-hint-level-btn ${hintLevel === lvl ? 'active' : ''}`}
                  onClick={() => {
                    setHintLevel(lvl);
                    const h = getHintContent(lvl);
                    speakText(h.text);
                  }}
                >
                  Level {lvl}
                </button>
              ))}
            </div>

            <div className="mc-hint-card">
              <div style={{ fontWeight: '700', fontSize: '13px', color: '#a855f7', marginBottom: '4px' }}>
                {getHintContent(hintLevel).title}
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {getHintContent(hintLevel).text}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button
                className="mc-prompter-cta-btn"
                onClick={() => {
                  const next = hintLevel < 3 ? hintLevel + 1 : 1;
                  setHintLevel(next);
                  const h = getHintContent(next);
                  speakText(h.text);
                }}
              >
                {hintLevel < 3 ? `Unlock Level ${hintLevel + 1} Hint →` : '↺ Loop Back to Level 1'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'probing' && (
          <div className="mc-probing-pane">
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Select a follow-up question commonly asked by FAANG staff at the end of the round:
            </div>

            <div className="mc-probing-list">
              {PROBING_QUESTIONS.map((pq, idx) => (
                <div
                  key={idx}
                  className={`mc-probing-item ${selectedProbingIdx === idx ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedProbingIdx(idx);
                    setShowModelAnswer(false);
                    speakText(pq.q);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#38bdf8', fontWeight: '700' }}>#{idx + 1}</span>
                    <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {pq.q}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {selectedProbingIdx !== null && (
              <div className="mc-probing-answer-box">
                <button
                  className="mc-answer-toggle-btn"
                  onClick={() => {
                    const next = !showModelAnswer;
                    setShowModelAnswer(next);
                    if (next) {
                      speakText(PROBING_QUESTIONS[selectedProbingIdx].answer);
                    }
                  }}
                >
                  {showModelAnswer ? '🙈 Hide Staff Model Answer' : '👁️ Reveal Senior Staff Model Answer'}
                </button>

                {showModelAnswer && (
                  <div className="mc-model-answer-card">
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#22c55e', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Senior Staff Benchmark Response:
                    </div>
                    <p style={{ margin: 0, fontSize: '12.5px', lineHeight: '1.45', color: 'var(--text-secondary)' }}>
                      {PROBING_QUESTIONS[selectedProbingIdx].answer}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
