import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockSessionService } from '../../services/mockSessionService';
import type { TechnologyTrack } from '../../types/questionBank.types';

export default function MockProjectInterviewPage() {
  const navigate = useNavigate();
  const [projectTitle, setProjectTitle] = useState('Enterprise Cloud UI & Micro-frontends');
  const [techStack, setTechStack] = useState('React, TypeScript, Next.js, Webpack Module Federation, Tailwind CSS');
  const [architectureOverview, setArchitectureOverview] = useState(
    'Distributed micro-frontend web app with unified design system tokens, local-first optimistic caching, and WebSocket event bus for live collaborative editing.'
  );
  const [productionIncidents, setProductionIncidents] = useState(
    'Encountered severe memory retention caused by detached DOM nodes and uncleaned event listeners during route transitions; resolved with custom cleanup hooks and automated leak profiling in CI.'
  );
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunchProjectInterview = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLaunching(true);

    const primaryTech: TechnologyTrack = 'frontend-architecture';
    const secondaryTechs: TechnologyTrack[] = ['react', 'typescript', 'web-performance'];

    const projectSummary = `
PROJECT: ${projectTitle}
STACK: ${techStack}
ARCHITECTURE: ${architectureOverview}
PRODUCTION INCIDENTS & FAILURES: ${productionIncidents}
    `.trim();

    const session = mockSessionService.createSession('anonymous_candidate', {
      totalExperienceYears: 6,
      experienceTier: '6-8',
      techSpecificExperience: { 'frontend-architecture': 6, react: 5, typescript: 4 },
      primaryTechnology: primaryTech,
      secondaryTechnologies: secondaryTechs,
      difficulty: 'Advanced',
      interviewMode: 'Project Interview',
      interviewerStyle: 'System Design Interviewer',
      interviewerPersonaId: 'p_netflix_elena',
      questionCount: 5,
      questionMix: {
        theoryPercent: 10,
        practicalPercent: 20,
        codingPercent: 0,
        scenarioPercent: 70,
      },
      projectDescription: projectSummary,
    });

    navigate(`/ai-video-mock/session/${session.id}`);
  };

  return (
    <div className="ai-vm-container" style={{ maxWidth: 960, padding: '36px 20px' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
          Deep Dive Architecture Mode
        </div>
        <h1 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 800 }}>
          Project &amp; System Architecture Interview
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0', fontSize: '0.92rem' }}>
          Provide the real technical architecture of a system you built. The AI interviewer tests your trade-offs, scalability, failure scenarios, and production incident ownership.
        </p>
      </div>

      <div className="ai-vm-card">
        <form onSubmit={handleLaunchProjectInterview}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
              Project Title / System Name:
            </label>
            <input
              type="text"
              className="ai-vm-input"
              value={projectTitle}
              onChange={e => setProjectTitle(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
              Technology Stack Used:
            </label>
            <input
              type="text"
              className="ai-vm-input"
              value={techStack}
              onChange={e => setTechStack(e.target.value)}
              placeholder="e.g. React 19, TypeScript, Next.js, Redux Toolkit, WebRTC"
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
              System Architecture &amp; Key Design Decisions:
            </label>
            <textarea
              className="ai-vm-input"
              rows={4}
              value={architectureOverview}
              onChange={e => setArchitectureOverview(e.target.value)}
              placeholder="Describe your component hierarchy, state distribution, caching layers, and API integration..."
              required
              style={{ width: '100%', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
              Production Incidents, Failures &amp; Debugging:
            </label>
            <textarea
              className="ai-vm-input"
              rows={3}
              value={productionIncidents}
              onChange={e => setProductionIncidents(e.target.value)}
              placeholder="What went wrong in production? High CPU, memory leaks, latency spikes, cascading failures, and how did you resolve them?"
              required
              style={{ width: '100%', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Interviewer: <strong>Elena Rostova</strong> (Netflix Engineering Director · Architecture)
            </div>
            <button
              type="submit"
              className="ai-vm-btn-primary"
              disabled={isLaunching}
              style={{ padding: '12px 28px', fontSize: '0.95rem' }}
            >
              {isLaunching ? 'Synthesizing Architecture Questions...' : 'Start Project Architecture Mock →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
