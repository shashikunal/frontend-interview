import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockSessionService } from '../../services/mockSessionService';
import type { TechnologyTrack } from '../../types/questionBank.types';

export default function MockJobInterviewPage() {
  const navigate = useNavigate();
  const [jobText, setJobText] = useState('');
  const [targetCompany, setTargetCompany] = useState('Meta');
  const [targetRole, setTargetRole] = useState('Senior Frontend Engineer (L5)');
  const [isExtracting, setIsExtracting] = useState(false);

  const sampleJD = `Role: Senior Frontend Engineer
Company: Meta / Reality Labs
Requirements:
- 5+ years building high-performance web applications using modern JavaScript and React.
- Strong knowledge of concurrency, Fiber architecture, state management, and memory lifecycle.
- Deep expertise in Core Web Vitals (LCP, INP, CLS) and critical rendering path optimization.
- Experience with large-scale micro-frontends, design systems, and TypeScript.
- Excellent verbal communication, cross-functional stakeholder leadership, and mentorship.`;

  const handleSynthesizeInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobText.trim()) return;
    setIsExtracting(true);

    let primaryTrack: TechnologyTrack = 'react';
    let experienceTier: any = '4-6';

    try {
      const { ollamaProvider } = await import('../../services/providers/ollamaProvider');
      const status = await ollamaProvider.isAvailable();
      if (status.available) {
        const prompt = `Analyze this Job Description:
Company: ${targetCompany}
Role: ${targetRole}
JD:
${jobText.slice(0, 1500)}

Extract the primary technology and expected experience level.
Output JSON ONLY:
{
  "primaryTechnology": "react", // one of: javascript, typescript, react, nextjs, vue, angular, web-performance, frontend-architecture
  "experienceTier": "4-6" // one of: 0-1, 1-2, 2-4, 4-6, 6-8, 8-12, 12+
}`;
        const res = await ollamaProvider.generateCompletion(prompt, { jsonMode: true });
        if (res.success && res.parsedJson) {
          if (res.parsedJson.primaryTechnology) primaryTrack = res.parsedJson.primaryTechnology;
          if (res.parsedJson.experienceTier) experienceTier = res.parsedJson.experienceTier;
        }
      }
    } catch {}

    // Fallback regex detection
    if (!primaryTrack || primaryTrack === 'react') {
      const lower = jobText.toLowerCase();
      if (lower.includes('next.js') || lower.includes('nextjs')) primaryTrack = 'nextjs';
      else if (lower.includes('angular')) primaryTrack = 'angular';
      else if (lower.includes('vue')) primaryTrack = 'vue';
      else if (lower.includes('performance')) primaryTrack = 'web-performance';
      else if (lower.includes('typescript')) primaryTrack = 'typescript';
      else if (lower.includes('architecture')) primaryTrack = 'frontend-architecture';
    }

    const session = mockSessionService.createSession('anonymous_candidate', {
      totalExperienceYears: 6,
      experienceTier,
      techSpecificExperience: { [primaryTrack]: 5, javascript: 6, typescript: 3 },
      primaryTechnology: primaryTrack,
      secondaryTechnologies: ['javascript', 'communication'],
      difficulty: 'Advanced',
      interviewMode: 'Job Description Interview',
      interviewerStyle: 'Senior Interviewer',
      interviewerPersonaId: 'p_meta_sarah',
      questionCount: 5,
      questionMix: {
        theoryPercent: 40,
        practicalPercent: 30,
        codingPercent: 20,
        scenarioPercent: 10,
      },
      jobDescription: jobText,
    });

    setIsExtracting(false);
    navigate(`/ai-video-mock/session/${session.id}`);
  };

  return (
    <div style={{ maxWidth: 880, margin: '32px auto', padding: '0 20px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 6px' }}>
          Job Description → Custom Mock Interview
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          Paste any real job description. The platform synthesizes an tailored interview loop mapped directly against the target job requirements.
        </p>
      </div>

      <form onSubmit={handleSynthesizeInterview} className="ai-vm-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
              Target Company Name:
            </label>
            <input
              type="text"
              value={targetCompany}
              onChange={e => setTargetCompany(e.target.value)}
              placeholder="e.g. Google, Meta, Netflix, Stripe"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: 'var(--bg)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
              Target Role / Level:
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: 'var(--bg)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
            />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Paste Job Description:
            </label>
            <button
              type="button"
              onClick={() => setJobText(sampleJD)}
              style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Load Sample Senior React JD
            </button>
          </div>

          <textarea
            value={jobText}
            onChange={e => setJobText(e.target.value)}
            placeholder="Paste role responsibilities, required qualifications, tech stack..."
            style={{
              width: '100%',
              height: 200,
              padding: 14,
              borderRadius: 10,
              background: 'var(--bg)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              fontSize: '0.88rem',
              lineHeight: 1.5,
              resize: 'vertical',
            }}
          />
        </div>

        <button
          type="submit"
          className="ai-vm-btn-primary"
          disabled={isExtracting || !jobText.trim()}
          style={{ padding: '14px', fontSize: '1rem' }}
        >
          {isExtracting ? 'Analyzing JD & Generating Questions...' : `Generate Custom Mock for ${targetCompany} →`}
        </button>
      </form>
    </div>
  );
}
