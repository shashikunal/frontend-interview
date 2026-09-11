import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ALL_TECHNOLOGY_TRACKS, type TechnologyTrack, type QuestionDifficulty, type ExperienceTier } from '../../types/questionBank.types';
import type { InterviewMode, CandidateSetupConfig, InterviewerPersona } from '../../types/mock.types';
import { mockSessionService } from '../../services/mockSessionService';
import { useAuth } from '../../../../context/AuthContext';

export const PERSONAS: InterviewerPersona[] = [
  {
    id: 'p_meta_sarah',
    name: 'Sarah Chen',
    role: 'Staff Frontend Architect',
    company: 'Meta',
    avatar: '👩‍💻',
    style: 'Senior Interviewer',
    bio: 'Focuses on concurrent React, Fiber reconciliation, state machines & distributed UI systems.',
    voicePitch: 1.0,
    voiceRate: 1.0,
  },
  {
    id: 'p_google_david',
    name: 'David Miller',
    role: 'Principal UI Engineer',
    company: 'Google',
    avatar: '👨‍💼',
    style: 'Strict',
    bio: 'Deep technical examination of JavaScript runtime, event loop, memory leaks & high-load concurrency.',
    voicePitch: 0.9,
    voiceRate: 1.05,
  },
  {
    id: 'p_netflix_elena',
    name: 'Elena Rostova',
    role: 'Engineering Director',
    company: 'Netflix',
    avatar: '👩‍🔬',
    style: 'System Design Interviewer',
    bio: 'Evaluates large-scale frontend architecture, trade-offs, micro-frontends, and resilience under failure.',
    voicePitch: 1.05,
    voiceRate: 0.95,
  },
  {
    id: 'p_amazon_marcus',
    name: 'Marcus Vance',
    role: 'Bar Raiser & Senior Manager',
    company: 'Amazon',
    avatar: '👨‍🏫',
    style: 'HR / Behavioral',
    bio: 'Focuses on STAR methodology, conflict resolution, executive communication, and customer obsession.',
    voicePitch: 0.95,
    voiceRate: 1.0,
  },
];

export default function MockSetupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const initialTrack = (searchParams.get('track') as TechnologyTrack) || 'javascript';

  const [totalYears, setTotalYears] = useState<number>(5);
  const [expTier, setExpTier] = useState<ExperienceTier>('4-6');
  const [primaryTech, setPrimaryTech] = useState<TechnologyTrack>(initialTrack);
  const [difficulty, setDifficulty] = useState<QuestionDifficulty | 'Adaptive'>('Adaptive');
  const [interviewMode, setInterviewMode] = useState<InterviewMode>('Standard');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('p_meta_sarah');
  const [pressureMode, setPressureMode] = useState<boolean>(false);

  // Tech-specific experience breakdown
  const [techYears] = useState<Record<string, number>>({
    javascript: 5,
    react: 4,
    typescript: 3,
  });

  const handleStartInterview = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedPersona = PERSONAS.find(p => p.id === selectedPersonaId) || PERSONAS[0];

    const config: CandidateSetupConfig = {
      totalExperienceYears: totalYears,
      experienceTier: expTier,
      techSpecificExperience: techYears,
      primaryTechnology: primaryTech,
      secondaryTechnologies: [],
      difficulty,
      interviewMode,
      interviewerStyle: selectedPersona.style,
      interviewerPersonaId: selectedPersona.id,
      questionCount,
      questionMix: {
        theoryPercent: 40,
        practicalPercent: 30,
        codingPercent: 20,
        scenarioPercent: 10,
      },
      pressureMode,
    };

    const session = mockSessionService.createSession(user?.id || 'anonymous_candidate', config);
    navigate(`/ai-video-mock/session/${session.id}`);
  };

  return (
    <div style={{ maxWidth: 880, margin: '32px auto', padding: '0 20px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 8px' }}>
          Configure Your Mock Interview
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          Set your experience profile, target technologies, and question distribution to generate a tailored interview blueprint.
        </p>
      </div>

      <form onSubmit={handleStartInterview} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Experience Level */}
        <div className="ai-vm-card">
          <h3 style={{ fontSize: '1.05rem', marginBottom: 12 }}>1. Candidate Experience Profile</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                Total Professional Experience:
              </label>
              <select
                value={expTier}
                onChange={e => {
                  const val = e.target.value as ExperienceTier;
                  setExpTier(val);
                  setTotalYears(val === '0-1' ? 1 : val === '1-2' ? 2 : val === '2-4' ? 3 : val === '4-6' ? 5 : val === '6-8' ? 7 : val === '8-12' ? 10 : 14);
                }}
                style={{ width: '100%', padding: '10px', borderRadius: 8, background: 'var(--bg)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              >
                <option value="0-1">0–1 Years (Fresher / Entry Level)</option>
                <option value="1-2">1–2 Years (Junior Developer)</option>
                <option value="2-4">2–4 Years (Mid-Level Developer)</option>
                <option value="4-6">4–6 Years (Senior Developer)</option>
                <option value="6-8">6–8 Years (Senior+ / Lead)</option>
                <option value="8-12">8–12 Years (Tech Lead / Principal)</option>
                <option value="12+">12+ Years (Architect / Engineering Director)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                Difficulty Strategy:
              </label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as any)}
                style={{ width: '100%', padding: '10px', borderRadius: 8, background: 'var(--bg)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              >
                <option value="Adaptive">Dynamic Adaptive (Recommended)</option>
                <option value="Basic">Basic Focus</option>
                <option value="Intermediate">Intermediate Focus</option>
                <option value="Advanced">Advanced Focus</option>
                <option value="Expert">Expert / Principal Focus</option>
              </select>
            </div>
          </div>
        </div>

        {/* Primary Technology */}
        <div className="ai-vm-card">
          <h3 style={{ fontSize: '1.05rem', marginBottom: 12 }}>2. Primary Assessment Track</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
            {ALL_TECHNOLOGY_TRACKS.map(t => {
              const isSelected = primaryTech === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setPrimaryTech(t.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: isSelected ? 'rgba(99, 102, 241, 0.16)' : 'var(--bg)',
                    border: isSelected ? '1.5px solid #6366f1' : '1px solid var(--border)',
                    color: isSelected ? '#c7d2fe' : 'var(--text-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{t.icon}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode & Question Count */}
        <div className="ai-vm-card">
          <h3 style={{ fontSize: '1.05rem', marginBottom: 12 }}>3. Interview Format & Scope</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                Interview Mode:
              </label>
              <select
                value={interviewMode}
                onChange={e => setInterviewMode(e.target.value as any)}
                style={{ width: '100%', padding: '10px', borderRadius: 8, background: 'var(--bg)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              >
                <option value="Quick">Quick Check (5 Questions)</option>
                <option value="Standard">Standard FAANG Loop (5–10 Questions)</option>
                <option value="Full">Full Comprehensive Round (15 Questions)</option>
                <option value="Deep">Deep Architecture Dive (20 Questions)</option>
                <option value="Technical">Technical Theory Only</option>
                <option value="Coding">Coding & Problem Solving</option>
                <option value="Communication">Executive Communication & Leadership</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                Exact Question Count:
              </label>
              <select
                value={questionCount}
                onChange={e => setQuestionCount(Number(e.target.value))}
                style={{ width: '100%', padding: '10px', borderRadius: 8, background: 'var(--bg)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              >
                {[5, 10, 15, 20, 25, 30, 40, 50].map(cnt => (
                  <option key={cnt} value={cnt}>{cnt} Questions</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="checkbox"
              id="pressure-mode"
              checked={pressureMode}
              onChange={e => setPressureMode(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: '#6366f1' }}
            />
            <label htmlFor="pressure-mode" style={{ fontSize: '0.88rem', cursor: 'pointer' }}>
              🔥 Enable Interview Pressure Mode (Deep consecutive follow-ups testing production resilience)
            </label>
          </div>
        </div>

        {/* Persona Selection */}
        <div className="ai-vm-card">
          <h3 style={{ fontSize: '1.05rem', marginBottom: 12 }}>4. Select AI Interviewer Persona</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {PERSONAS.map(p => {
              const isSelected = selectedPersonaId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPersonaId(p.id)}
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg)',
                    border: isSelected ? '1.5px solid #6366f1' : '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: '1.6rem' }}>{p.avatar}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p.role} · {p.company}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                    {p.bio}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="ai-vm-btn-primary"
          style={{ padding: '14px', fontSize: '1.05rem', marginTop: 8 }}
        >
          Generate Blueprint &amp; Enter Interview Room →
        </button>
      </form>
    </div>
  );
}
