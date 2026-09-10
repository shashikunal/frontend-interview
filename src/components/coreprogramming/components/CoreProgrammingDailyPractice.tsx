// src/components/coreprogramming/components/CoreProgrammingDailyPractice.tsx
import { useState, useEffect } from 'react';
import type { CoreProgrammingQuestion } from '../data/coreProgrammingTypes';
import { coreProgrammingProgressService, type DailyPracticeSession } from '../lib/coreProgrammingProgressService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  questions: CoreProgrammingQuestion[];
  onStartSession: (firstQuestionId: string) => void;
}

export function CoreProgrammingDailyPractice({ isOpen, onClose, questions, onStartSession }: Props) {
  const [selectedCount, setSelectedCount] = useState<number>(5);
  const [currentSession, setCurrentSession] = useState<DailyPracticeSession | null>(null);
  const streak = coreProgrammingProgressService.getStreak();

  useEffect(() => {
    if (isOpen) {
      setCurrentSession(coreProgrammingProgressService.getDailyPracticeSession());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStart = () => {
    const session = coreProgrammingProgressService.startDailyPracticeSession(selectedCount, questions);
    if (session.questionIds.length > 0) {
      onStartSession(session.questionIds[0]);
      onClose();
    }
  };

  const handleResume = () => {
    if (currentSession && currentSession.questionIds.length > 0) {
      const remaining = currentSession.questionIds.find(id => !currentSession.completedIds.includes(id));
      onStartSession(remaining || currentSession.questionIds[0]);
      onClose();
    }
  };

  return (
    <div className="cp-modal-overlay" onClick={onClose}>
      <div className="cp-modal-card" onClick={e => e.stopPropagation()}>
        <div className="cp-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>🔥</span>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Daily JavaScript Practice Sprint</h2>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              Current Streak: <strong style={{ color: '#f59e0b' }}>{streak.currentStreak} Days</strong>
            </div>
          </div>
          <button type="button" className="cp-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="cp-modal-body">
          {currentSession ? (
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎯</div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Active Daily Sprint in Progress</h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
                Completed {currentSession.completedIds.length} of {currentSession.count} challenges today.
              </p>
              <button
                type="button"
                className="cp-daily-start-btn"
                onClick={handleResume}
              >
                Resume Daily Sprint
              </button>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                Select the number of core JavaScript challenges for your daily workout. We prioritize unattempted challenges tailored across the 13 core domains.
              </p>

              <div className="cp-daily-option-grid">
                {[5, 10, 20, 30].map(count => (
                  <div
                    key={count}
                    className={`cp-daily-card ${selectedCount === count ? 'active' : ''}`}
                    onClick={() => setSelectedCount(count)}
                  >
                    <div className="cp-daily-count">{count}</div>
                    <div className="cp-daily-label">Questions</div>
                    <div className="cp-daily-desc">
                      {count === 5 && 'Quick 15-min Warmup'}
                      {count === 10 && 'Standard 30-min Sprint'}
                      {count === 20 && 'Deep 60-min Workout'}
                      {count === 30 && 'Marathon Interview Prep'}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="cp-daily-start-btn"
                onClick={handleStart}
              >
                Start Daily Practice ({selectedCount} Questions)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
