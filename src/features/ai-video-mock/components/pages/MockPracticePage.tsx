import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RecurringWeakness } from '../../types/mock.types';
import { mockSessionService } from '../../services/mockSessionService';

export default function MockPracticePage() {
  const navigate = useNavigate();
  const [weaknesses, setWeaknesses] = useState<RecurringWeakness[]>([]);

  useEffect(() => {
    const sessions = mockSessionService.getAllLocalSessions();
    const map = new Map<string, RecurringWeakness>();

    for (const s of sessions) {
      if (s.scorecard?.recurringWeaknesses) {
        for (const w of s.scorecard.recurringWeaknesses) {
          const key = `${w.technology}_${w.topic}`;
          if (!map.has(key)) {
            map.set(key, w);
          } else {
            const existing = map.get(key)!;
            existing.occurrences += 1;
          }
        }
      }
    }

    if (map.size === 0) {
      // Provide high-value default weak area tracks
      setWeaknesses([
        {
          topic: 'Event Loop & Asynchronous JS',
          technology: 'javascript',
          averageScore: 6.2,
          occurrences: 2,
          lastMissedConcepts: ['Microtasks vs Macrotasks', 'Event Queue Pacing', 'AbortController'],
        },
        {
          topic: 'Concurrent React',
          technology: 'react',
          averageScore: 5.8,
          occurrences: 3,
          lastMissedConcepts: ['useTransition Hook', 'Tearing', 'Suspense Boundaries'],
        },
        {
          topic: 'Core Web Vitals',
          technology: 'web-performance',
          averageScore: 6.5,
          occurrences: 1,
          lastMissedConcepts: ['Interaction to Next Paint (INP)', 'Layout Thrashing', 'LCP Budgeting'],
        },
      ]);
    } else {
      setWeaknesses(Array.from(map.values()));
    }
  }, []);

  const handleStartFocusedSession = (w: RecurringWeakness) => {
    const session = mockSessionService.createSession('anonymous_candidate', {
      totalExperienceYears: 5,
      experienceTier: '4-6',
      techSpecificExperience: { [w.technology]: 4 },
      primaryTechnology: w.technology,
      secondaryTechnologies: [],
      topic: w.topic,
      difficulty: 'Intermediate',
      interviewMode: 'Weak Areas Only',
      interviewerStyle: 'Senior Interviewer',
      interviewerPersonaId: 'p_meta_sarah',
      questionCount: 5,
      questionMix: {
        theoryPercent: 50,
        practicalPercent: 30,
        codingPercent: 20,
        scenarioPercent: 0,
      },
    });

    navigate(`/ai-video-mock/session/${session.id}`);
  };

  return (
    <div style={{ maxWidth: 960, margin: '32px auto', padding: '0 20px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 6px' }}>
          Practice My Weak Areas
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          Targeted 5-question mock sessions focusing strictly on your recurring concept gaps and past lost marks.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        {weaknesses.map((w, i) => (
          <div key={i} className="ai-vm-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#818cf8', background: 'rgba(99, 102, 241, 0.12)', padding: '2px 8px', borderRadius: 4 }}>
                {w.technology}
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: w.averageScore < 6 ? '#ef4444' : '#f59e0b' }}>
                Avg Score: {w.averageScore}/10
              </span>
            </div>

            <h3 style={{ fontSize: '1.1rem', margin: '0 0 8px' }}>{w.topic}</h3>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Recently Missed Concepts:
              <ul style={{ margin: '4px 0 0', paddingLeft: 18, color: 'var(--text-primary)' }}>
                {w.lastMissedConcepts.slice(0, 3).map((c, j) => (
                  <li key={j}>{c}</li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              className="ai-vm-btn-primary"
              onClick={() => handleStartFocusedSession(w)}
              style={{ width: '100%' }}
            >
              Start 5-Question Focused Mock →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
