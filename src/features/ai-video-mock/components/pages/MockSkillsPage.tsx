import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockSessionService } from '../../services/mockSessionService';

export default function MockSkillsPage() {
  const [skillAverages, setSkillAverages] = useState<Record<string, number>>({
    'JavaScript Core': 8.4,
    'React & Concurrency': 7.8,
    'TypeScript Advanced': 7.2,
    'Web Performance (CWV)': 6.9,
    'Frontend Architecture': 6.8,
    'Executive Communication': 8.2,
  });

  useEffect(() => {
    const sessions = mockSessionService.getAllLocalSessions().filter(s => s.scorecard);
    if (sessions.length > 0) {
      let js = 0, rct = 0, ts = 0, perf = 0, arch = 0, comm = 0, count = 0;
      for (const s of sessions) {
        const sc = s.scorecard!;
        js += sc.competencyPillars.technicalCorrectness;
        rct += sc.competencyPillars.conceptualDepth;
        ts += sc.competencyPillars.practicalApplication;
        perf += sc.competencyPillars.problemSolving;
        arch += sc.competencyPillars.architectureAndDesign;
        comm += sc.competencyPillars.communicationAndClarity;
        count++;
      }
      setSkillAverages({
        'Technical Correctness': Math.round((js / count) * 10) / 10,
        'Conceptual Depth': Math.round((rct / count) * 10) / 10,
        'Practical Knowledge': Math.round((ts / count) * 10) / 10,
        'Problem Solving': Math.round((perf / count) * 10) / 10,
        'Architecture & Design': Math.round((arch / count) * 10) / 10,
        'Communication & Clarity': Math.round((comm / count) * 10) / 10,
      });
    }
  }, []);

  return (
    <div style={{ maxWidth: 960, margin: '32px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 6px' }}>
            Skill Trends &amp; Competency Pillars
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Longitudinal telemetry tracking your progression across core engineering tracks and executive presentation.
          </p>
        </div>

        <Link to="/ai-video-mock/practice" className="ai-vm-btn-primary">
          Practice Weak Areas →
        </Link>
      </div>

      <div className="ai-vm-card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: 20 }}>Demonstrated Competency Matrix</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Object.entries(skillAverages).map(([skill, score]) => {
            const pct = Math.min(100, Math.round(score * 10));
            return (
              <div key={skill}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: 6 }}>
                  <span>{skill}</span>
                  <span style={{ color: score >= 8.0 ? '#10b981' : score >= 7.0 ? '#818cf8' : '#f59e0b' }}>
                    {score} / 10 ({pct}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: 10, background: 'var(--bg)', borderRadius: 5, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div
                    style={{
                      height: '100%',
                      background: score >= 8.0 ? '#10b981' : score >= 7.0 ? '#6366f1' : '#f59e0b',
                      width: `${pct}%`,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
