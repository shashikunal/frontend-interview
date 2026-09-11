import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockSessionService } from '../../services/mockSessionService';
import type { TechnologyTrack } from '../../types/questionBank.types';

export default function MockResumeInterviewPage() {
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Senior Frontend Engineer');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [extractedProfile, setExtractedProfile] = useState<{
    detectedTechs: TechnologyTrack[];
    claimedYears: number;
    highlightProjects: string[];
  } | null>(null);

  const handleAnalyzeResume = async () => {
    if (!resumeText.trim()) return;
    setIsSynthesizing(true);

    let detected: TechnologyTrack[] = [];
    let claimedYears = 5;
    let highlightProjects: string[] = [];

    try {
      const { ollamaProvider } = await import('../../services/providers/ollamaProvider');
      const status = await ollamaProvider.isAvailable();
      if (status.available) {
        const prompt = `Analyze this candidate resume:
${resumeText.slice(0, 1500)}

Extract key technical tracks, total years of experience, and up to 3 highlighted projects explicitly mentioned in the text (NEVER invent projects not in the text).
Output JSON ONLY:
{
  "detectedTechs": ["react", "typescript", "javascript"],
  "claimedYears": 5,
  "highlightProjects": ["Project 1", "Project 2"]
}`;
        const res = await ollamaProvider.generateCompletion(prompt, { jsonMode: true });
        if (res.success && res.parsedJson) {
          if (Array.isArray(res.parsedJson.detectedTechs) && res.parsedJson.detectedTechs.length > 0) {
            detected = res.parsedJson.detectedTechs;
          }
          if (typeof res.parsedJson.claimedYears === 'number') {
            claimedYears = res.parsedJson.claimedYears;
          }
          if (Array.isArray(res.parsedJson.highlightProjects) && res.parsedJson.highlightProjects.length > 0) {
            highlightProjects = res.parsedJson.highlightProjects;
          }
        }
      }
    } catch {}

    // Fallback extraction
    if (detected.length === 0) {
      const lower = resumeText.toLowerCase();
      if (lower.includes('react')) detected.push('react');
      if (lower.includes('javascript') || lower.includes('js')) detected.push('javascript');
      if (lower.includes('typescript') || lower.includes('ts')) detected.push('typescript');
      if (lower.includes('next')) detected.push('nextjs');
      if (lower.includes('css')) detected.push('css');
      if (lower.includes('performance')) detected.push('web-performance');
      if (detected.length === 0) detected.push('javascript', 'react');
    }

    if (highlightProjects.length === 0) {
      highlightProjects = [
        'Design System & Component Architecture',
        'Scalable Micro-Frontend Integration',
        'State Management & Performance Optimization',
      ];
    }

    setExtractedProfile({
      detectedTechs: detected,
      claimedYears,
      highlightProjects,
    });
    setIsSynthesizing(false);
  };

  const handleLaunchResumeInterview = () => {
    if (!extractedProfile) return;

    const primaryTech = extractedProfile.detectedTechs[0] || 'javascript';
    const secondaryTechs = extractedProfile.detectedTechs.slice(1);

    const session = mockSessionService.createSession('anonymous_candidate', {
      totalExperienceYears: extractedProfile.claimedYears,
      experienceTier: extractedProfile.claimedYears >= 6 ? '6-8' : '4-6',
      techSpecificExperience: { [primaryTech]: extractedProfile.claimedYears },
      primaryTechnology: primaryTech,
      secondaryTechnologies: secondaryTechs,
      difficulty: 'Adaptive',
      interviewMode: 'Resume Interview',
      interviewerStyle: 'Senior Interviewer',
      interviewerPersonaId: 'p_meta_sarah',
      questionCount: 6,
      questionMix: {
        theoryPercent: 20,
        practicalPercent: 30,
        codingPercent: 20,
        scenarioPercent: 30,
      },
      resumeText,
    });

    navigate(`/ai-video-mock/session/${session.id}`);
  };

  return (
    <div className="ai-vm-container" style={{ maxWidth: 960, padding: '36px 20px' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
          Specialized Interview Mode
        </div>
        <h1 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 800 }}>
          Resume-Driven AI Technical Interview
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0', fontSize: '0.92rem' }}>
          The AI Interviewer reads your real resume, verifies claimed projects, technical claims, and probes your architectural decision-making.
        </p>
      </div>

      <div className="ai-vm-card" style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 8 }}>
            Target Role / Position:
          </label>
          <input
            type="text"
            className="ai-vm-input"
            value={targetRole}
            onChange={e => setTargetRole(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 8 }}>
            Paste Resume Plaintext / Summary:
          </label>
          <textarea
            className="ai-vm-input"
            rows={10}
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
            placeholder="Paste your resume work experience, skills, and project highlights here..."
            style={{ width: '100%', fontSize: '0.85rem' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="ai-vm-btn-primary"
            onClick={handleAnalyzeResume}
            disabled={isSynthesizing || !resumeText.trim()}
          >
            {isSynthesizing ? 'Analyzing Resume & Claims...' : 'Analyze Resume Claims 🔍'}
          </button>
        </div>
      </div>

      {extractedProfile && (
        <div className="ai-vm-card" style={{ border: '1px solid #818cf8', background: 'rgba(99, 102, 241, 0.05)' }}>
          <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, marginBottom: 6 }}>
            ✓ RESUME PROFILE SYNTHESIZED
          </div>
          <h3 style={{ fontSize: '1.2rem', margin: '0 0 16px', fontWeight: 700 }}>
            Extracted Technical Claims &amp; Focus Areas
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 6 }}>Detected Technologies:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {extractedProfile.detectedTechs.map(t => (
                  <span key={t} className="ai-vm-badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
                    {t.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 6 }}>Seniority Calibration:</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {extractedProfile.claimedYears}+ Years Seniority Band
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 6 }}>Key Projects for Probing:</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.85rem', lineHeight: 1.6 }}>
              {extractedProfile.highlightProjects.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="ai-vm-btn-primary"
              onClick={handleLaunchResumeInterview}
              style={{ padding: '12px 28px', fontSize: '0.95rem' }}
            >
              Launch Resume Mock Interview →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
