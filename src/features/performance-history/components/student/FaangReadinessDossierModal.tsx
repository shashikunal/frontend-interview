import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserPerformanceSummary, CodingAttempt } from '../../types/history.types';
import { docsProgressService } from '../../../interview-docs/services/docsProgressService';
import './FaangReadinessDossierModal.css';

interface FaangReadinessDossierModalProps {
  candidateId: string;
  candidateName?: string;
  candidateEmail?: string;
  summary: UserPerformanceSummary | null;
  attempts: CodingAttempt[];
  onClose: () => void;
}

interface StudioStat {
  name: string;
  icon: string;
  key: string;
  attempted: number;
  solved: number;
  totalCatalog: number;
  avgScore: number;
  successRate: number;
  avgTimeSec: number;
  accentColor: string;
}

export default function FaangReadinessDossierModal({
  candidateId,
  candidateName = 'Candidate',
  candidateEmail,
  summary,
  attempts,
  onClose,
}: FaangReadinessDossierModalProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'visual' | 'markdown'>('visual');
  const [copied, setCopied] = useState(false);
  const [selectedStudioKey, setSelectedStudioKey] = useState<string | null>(null);

  // 1. Fetch 21-Track Docs Syllabus Telemetry
  const docsStats = useMemo(() => {
    try {
      if (candidateId) {
        docsProgressService.setUserId(candidateId);
      }
      const st = docsProgressService.getSyllabusStats();
      if (st && st.totalCompletedTopics > 0) return st;

      // Fallback check direct localStorage keys
      if (typeof localStorage !== 'undefined') {
        const keys = [
          `interview_docs_progress_v1_${candidateId}`,
          'interview_docs_progress_v1',
          'interviewprep_docs_progress_v1',
        ];
        for (const k of keys) {
          const raw = localStorage.getItem(k);
          if (raw) {
            const parsed = JSON.parse(raw);
            const completed = Array.isArray(parsed?.completedTopics) ? parsed.completedTopics : [];
            if (completed.length > 0) {
              const totalCompletedTopics = completed.length;
              const totalSyllabusTopics = 708;
              const completionPercentage = Math.round((totalCompletedTopics / totalSyllabusTopics) * 100);
              return {
                ...st,
                totalCompletedTopics,
                totalSyllabusTopics,
                completionPercentage,
                activeTracksCount: Math.min(21, Math.max(1, Math.ceil(totalCompletedTopics / 5))),
              };
            }
          }
        }
      }
      return st;
    } catch {
      return {
        totalCompletedTopics: 0,
        totalSyllabusTopics: 708,
        completionPercentage: 0,
        activeTracksCount: 0,
        totalTracksCount: 21,
        trackBreakdown: [],
      };
    }
  }, [candidateId]);

  // 2. Compute 4 Studios Metrics
  const studioStats: StudioStat[] = useMemo(() => {
    // Machine Coding
    const mc = summary?.categoryStats?.MACHINE_CODING;
    const mcAttempted = mc?.questionsAttempted || 0;
    const mcSolved = mc?.questionsSolved || 0;
    const mcScore = Math.round(mc?.averageScore || 0);
    const mcSuccess = mc?.successRate || (mcAttempted > 0 ? Math.round((mcSolved / mcAttempted) * 100) : 0);
    const mcTime = mc?.averageCompletionTimeSeconds || 0;

    // LeetCode / DSA
    const dsa = summary?.categoryStats?.DSA;
    const dsaAttempted = dsa?.questionsAttempted || 0;
    const dsaSolved = dsa?.questionsSolved || 0;
    const dsaScore = Math.round(dsa?.averageScore || 0);
    const dsaSuccess = dsa?.successRate || (dsaAttempted > 0 ? Math.round((dsaSolved / dsaAttempted) * 100) : 0);
    const dsaTime = dsa?.averageCompletionTimeSeconds || 0;

    // Core Programming
    const cp = summary?.categoryStats?.CORE_PROGRAMMING;
    const cpAttempted = cp?.questionsAttempted || 0;
    const cpSolved = cp?.questionsSolved || 0;
    const cpScore = Math.round(cp?.averageScore || 0);
    const cpSuccess = cp?.successRate || (cpAttempted > 0 ? Math.round((cpSolved / cpAttempted) * 100) : 0);
    const cpTime = cp?.averageCompletionTimeSeconds || 0;

    // Frontend JavaScript (Check local storage or attempts with FJP prefix)
    let fjsAttempted = 0;
    let fjsSolved = 0;
    let fjsTotalScore = 0;
    let fjsTotalTime = 0;

    // Check attempts
    const fjsAttempts = attempts.filter(
      a => a.category?.toUpperCase() === 'FRONTEND_JS' || a.questionId?.toLowerCase().startsWith('fjp')
    );
    if (fjsAttempts.length > 0) {
      const distinctQ = new Set<string>();
      const solvedQ = new Set<string>();
      fjsAttempts.forEach(a => {
        distinctQ.add(a.questionId);
        if (a.status === 'Solved' || a.score >= 70) solvedQ.add(a.questionId);
        fjsTotalScore += a.score || 0;
        fjsTotalTime += a.durationSeconds || 0;
      });
      fjsAttempted = distinctQ.size;
      fjsSolved = solvedQ.size;
    } else {
      try {
        if (typeof localStorage !== 'undefined') {
          const raw = localStorage.getItem('fjp_submissions_v1');
          if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
              const distinctQ = new Set<string>();
              const solvedQ = new Set<string>();
              list.forEach((sub: any) => {
                const qid = sub.questionId || sub.question_id;
                if (qid) {
                  distinctQ.add(qid);
                  if (sub.status === 'Accepted' || sub.score >= 70) solvedQ.add(qid);
                  fjsTotalScore += Number(sub.score || 0);
                  fjsTotalTime += Number(sub.timeSpentSeconds || sub.durationSeconds || 0);
                }
              });
              fjsAttempted = distinctQ.size;
              fjsSolved = solvedQ.size;
            }
          }
        }
      } catch {}
    }

    const fjsScore = fjsAttempted > 0 ? Math.round(fjsTotalScore / Math.max(1, fjsAttempts.length || fjsAttempted)) : 0;
    const fjsSuccess = fjsAttempted > 0 ? Math.round((fjsSolved / fjsAttempted) * 100) : 0;
    const fjsTime = fjsAttempted > 0 ? Math.round(fjsTotalTime / Math.max(1, fjsSolved || fjsAttempted)) : 0;

    return [
      {
        name: 'Machine Coding Studio',
        icon: '⚡',
        key: 'MACHINE_CODING',
        attempted: mcAttempted,
        solved: mcSolved,
        totalCatalog: 500,
        avgScore: mcScore,
        successRate: mcSuccess,
        avgTimeSec: mcTime,
        accentColor: '#3b82f6',
      },
      {
        name: 'LeetCode / DSA Studio',
        icon: '🧠',
        key: 'DSA',
        attempted: dsaAttempted,
        solved: dsaSolved,
        totalCatalog: 1000,
        avgScore: dsaScore,
        successRate: dsaSuccess,
        avgTimeSec: dsaTime,
        accentColor: '#8b5cf6',
      },
      {
        name: 'Core Programming Studio',
        icon: '💻',
        key: 'CORE_PROGRAMMING',
        attempted: cpAttempted,
        solved: cpSolved,
        totalCatalog: 500,
        avgScore: cpScore,
        successRate: cpSuccess,
        avgTimeSec: cpTime,
        accentColor: '#10b981',
      },
      {
        name: 'Frontend JS Studio',
        icon: '🌐',
        key: 'FRONTEND_JS',
        attempted: fjsAttempted,
        solved: fjsSolved,
        totalCatalog: 1000,
        avgScore: fjsScore,
        successRate: fjsSuccess,
        avgTimeSec: fjsTime,
        accentColor: '#f59e0b',
      },
    ];
  }, [summary, attempts]);

  // 3. Speed & Efficiency Telemetry
  const speedMetrics = useMemo(() => {
    const totalTime = summary?.totalCodingTimeSeconds || 0;
    const totalAttempts = summary?.totalAttempts || attempts.length || 0;
    const totalSolved = summary?.uniqueSolved || 0;
    const denominator = Math.max(1, totalSolved || totalAttempts);
    const avgSec = Math.round(totalTime / denominator);
    const avgMin = (avgSec / 60).toFixed(1);

    let badge = { label: '🎯 Steady (< 20m)', icon: '🎯', tier: 'Steady Pace', percentile: '65th Percentile' };
    if (avgSec > 0 && avgSec <= 300) {
      badge = { label: '⚡ Lightning (< 5m)', icon: '⚡', tier: 'Lightning Velocity', percentile: 'Top 5% (95th Percentile)' };
    } else if (avgSec > 300 && avgSec <= 600) {
      badge = { label: '🏎️ Fast (< 10m)', icon: '🏎️', tier: 'High Velocity', percentile: 'Top 20% (80th Percentile)' };
    } else if (avgSec > 1200) {
      badge = { label: '🧠 Methodical (> 20m)', icon: '🧠', tier: 'Deep Analysis', percentile: '50th Percentile (Thorough)' };
    }

    return {
      totalTimeSec: totalTime,
      avgSec,
      avgMin,
      badge,
    };
  }, [summary, attempts]);

  // 4. FAANG Readiness Index Calculation (0 - 100)
  const readinessIndex = useMemo(() => {
    // Studio Score component (max 45 pts)
    const activeStudios = studioStats.filter(s => s.attempted > 0);
    const avgStudioScore = activeStudios.length > 0
      ? activeStudios.reduce((acc, s) => acc + s.avgScore, 0) / activeStudios.length
      : 0;
    const studioScorePoints = Math.min(45, (avgStudioScore / 100) * 45);

    // Problem Solved Volume component (max 25 pts)
    const totalSolved = summary?.uniqueSolved || 0;
    const volumePoints = Math.min(25, (totalSolved / 30) * 25);

    // 21-Track Syllabus Coverage component (max 20 pts)
    const syllabusPct = docsStats.completionPercentage || 0;
    const syllabusPoints = Math.min(20, (syllabusPct / 100) * 20);

    // Speed / Efficiency component (max 10 pts)
    let speedPoints = 7;
    if (speedMetrics.avgSec > 0 && speedMetrics.avgSec <= 600) {
      speedPoints = 10;
    } else if (speedMetrics.avgSec > 1200) {
      speedPoints = 5;
    }

    const totalIndex = Math.min(100, Math.round(studioScorePoints + volumePoints + syllabusPoints + speedPoints));

    let tierLabel = '🌱 Foundation Phase';
    let tierColor = '#64748b';
    let hiringVerdict = 'Practice Recommended';
    let targetBand = 'L3 / Junior Frontend Engineer';

    if (totalIndex >= 85) {
      tierLabel = '🌟 FAANG Ready (Tier 1)';
      tierColor = '#22c55e';
      hiringVerdict = 'Strong Hire';
      targetBand = 'L5 / Senior Frontend Specialist';
    } else if (totalIndex >= 70) {
      tierLabel = '🚀 Competitive Hire (Tier 2)';
      tierColor = '#3b82f6';
      hiringVerdict = 'Hire / Interview Ready';
      targetBand = 'L4 / Mid-Level Frontend Engineer';
    } else if (totalIndex >= 50) {
      tierLabel = '📈 On-Track (Tier 3)';
      tierColor = '#f59e0b';
      hiringVerdict = 'Targeted Practice Needed';
      targetBand = 'L3-L4 Transitioning Engineer';
    }

    return {
      totalIndex,
      tierLabel,
      tierColor,
      hiringVerdict,
      targetBand,
      studioScorePoints: Math.round(studioScorePoints),
      volumePoints: Math.round(volumePoints),
      syllabusPoints: Math.round(syllabusPoints),
      speedPoints,
    };
  }, [studioStats, summary, docsStats, speedMetrics]);

  // 4b. Compute Targeted Studio Recommendation for Mock Interview
  const targetedRecommendation = useMemo(() => {
    const studios = [
      {
        key: 'MACHINE_CODING',
        name: 'Machine Coding Studio',
        icon: '⚡',
        route: '/machine-coding',
        actionLabel: 'Launch Component Sandbox',
        stat: studioStats.find(s => s.key === 'MACHINE_CODING'),
      },
      {
        key: 'DSA',
        name: 'LeetCode & Algorithm Studio',
        icon: '🧮',
        route: '/dsa',
        actionLabel: 'Launch Algorithm Drill',
        stat: studioStats.find(s => s.key === 'DSA'),
      },
      {
        key: 'CORE_JS',
        name: 'Core JavaScript Mechanics',
        icon: '💻',
        route: '/core-programming',
        actionLabel: 'Launch Core JS Challenge',
        stat: studioStats.find(s => s.key === 'CORE_JS'),
      },
      {
        key: 'FRONTEND_JS',
        name: 'Frontend JS & Browser APIs',
        icon: '🌐',
        route: '/frontend-javascript',
        actionLabel: 'Launch DOM / API Sandbox',
        stat: studioStats.find(s => s.key === 'FRONTEND_JS'),
      },
    ];

    const sorted = [...studios].sort((a, b) => {
      const aSolved = a.stat?.solved || 0;
      const bSolved = b.stat?.solved || 0;
      if (aSolved !== bSolved) return aSolved - bSolved;
      const aScore = a.stat?.avgScore || 0;
      const bScore = b.stat?.avgScore || 0;
      return aScore - bScore;
    });

    const recommended = sorted[0] || studios[0];

    const activeStudio = selectedStudioKey
      ? studios.find(s => s.key === selectedStudioKey) || (selectedStudioKey === 'AI_MOCK' ? {
          key: 'AI_MOCK',
          name: 'AI Video Mock Interview',
          icon: '🎥',
          route: '/ai-video-mock',
          actionLabel: 'Launch Live AI Video Mock',
          stat: null,
        } : recommended)
      : recommended;

    let reason = '';
    if (activeStudio.stat) {
      if (activeStudio.stat.solved === 0) {
        reason = `Zero verified problems completed in ${activeStudio.name}. Practicing here will produce the highest score gain.`;
      } else if (activeStudio.stat.successRate < 70) {
        reason = `Success rate is currently ${activeStudio.stat.successRate}% (${activeStudio.stat.solved}/${activeStudio.stat.attempted} solved). A timed targeted drill will boost accuracy.`;
      } else {
        reason = `Candidate has ${activeStudio.stat.solved} solved with ${activeStudio.stat.avgScore}% avg score. Great momentum for high-difficulty challenges.`;
      }
    } else {
      reason = 'Simulate full behavioral and technical FAANG interview loops with real-time AI speech and coding analysis.';
    }

    return {
      allStudios: studios,
      activeStudio,
      isAutoRecommended: !selectedStudioKey || selectedStudioKey === recommended.key,
      recommendedKey: recommended.key,
      reason,
    };
  }, [studioStats, selectedStudioKey]);

  // 5. Generate Formatted Markdown
  const markdownContent = useMemo(() => {
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `# 🏆 FAANG Technical Readiness Dossier
**Candidate**: ${candidateName} (${candidateId})  
**Evaluation Date**: ${dateStr}  
**FAANG Readiness Index**: **${readinessIndex.totalIndex} / 100** — *${readinessIndex.tierLabel}*  
**Hiring Verdict**: **${readinessIndex.hiringVerdict}** | **Target Level**: **${readinessIndex.targetBand}**  

---

## 📊 Executive Competency Breakdown

| Evaluation Pillar | Score / Metric | Points Contributed | Benchmark Target |
| :--- | :--- | :--- | :--- |
| **Coding Studios Score** | ${Math.round(studioStats.reduce((acc, s) => acc + s.avgScore, 0) / 4)}% Avg | ${readinessIndex.studioScorePoints} / 45 pts | ≥ 80% across studios |
| **Verified Problem Solves** | ${summary?.uniqueSolved || 0} Solved (${summary?.uniqueAttempted || 0} Attempted) | ${readinessIndex.volumePoints} / 25 pts | ≥ 30 Solved |
| **21-Track Syllabus Mastery** | ${docsStats.totalCompletedTopics} / ${docsStats.totalSyllabusTopics} (${docsStats.completionPercentage}%) | ${readinessIndex.syllabusPoints} / 20 pts | ≥ 50% Coverage |
| **Solve Pace & Efficiency** | ${speedMetrics.avgMin} min/q (${speedMetrics.badge.label}) | ${readinessIndex.speedPoints} / 10 pts | ≤ 10 min/q |

---

## 💻 Coding Studios Performance (4 Tracks)

| Studio Track | Attempted | Solved | Success Rate | Avg Score | Avg Pace |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **⚡ Machine Coding** | ${studioStats[0].attempted} / ${studioStats[0].totalCatalog} | ${studioStats[0].solved} | ${studioStats[0].successRate}% | ${studioStats[0].avgScore}% | ${studioStats[0].avgTimeSec > 0 ? `${Math.round(studioStats[0].avgTimeSec / 60)}m` : '—'} |
| **🧠 LeetCode / DSA** | ${studioStats[1].attempted} / ${studioStats[1].totalCatalog} | ${studioStats[1].solved} | ${studioStats[1].successRate}% | ${studioStats[1].avgScore}% | ${studioStats[1].avgTimeSec > 0 ? `${Math.round(studioStats[1].avgTimeSec / 60)}m` : '—'} |
| **💻 Core Programming** | ${studioStats[2].attempted} / ${studioStats[2].totalCatalog} | ${studioStats[2].solved} | ${studioStats[2].successRate}% | ${studioStats[2].avgScore}% | ${studioStats[2].avgTimeSec > 0 ? `${Math.round(studioStats[2].avgTimeSec / 60)}m` : '—'} |
| **🌐 Frontend JavaScript** | ${studioStats[3].attempted} / ${studioStats[3].totalCatalog} | ${studioStats[3].solved} | ${studioStats[3].successRate}% | ${studioStats[3].avgScore}% | ${studioStats[3].avgTimeSec > 0 ? `${Math.round(studioStats[3].avgTimeSec / 60)}m` : '—'} |

---

## ⚡ Speed & Telemetry Profiling
- **Pacing**: ${speedMetrics.avgMin} minutes per completed question
- **Velocity Tier**: ${speedMetrics.badge.label}
- **Benchmark Percentile**: ${speedMetrics.badge.percentile}
- **Total Evaluated Coding Time**: ${Math.round(speedMetrics.totalTimeSec / 60)} minutes

---

## 📚 21-Track Curriculum & Documentation Syllabus
- **Total Mastered Topics**: ${docsStats.totalCompletedTopics} / ${docsStats.totalSyllabusTopics} Topics
- **Syllabus Coverage**: ${docsStats.completionPercentage}% Complete
- **Active Curriculum Tracks**: ${docsStats.activeTracksCount} / ${docsStats.totalTracksCount} Tracks Active
- **Remaining Topics**: ${Math.max(0, docsStats.totalSyllabusTopics - docsStats.totalCompletedTopics)} Topics

---

## 🎯 Technical Recommendation
${readinessIndex.totalIndex >= 70
  ? `Candidate demonstrates high proficiency in core frontend engineering mechanics, algorithm resolution, and structured component architecture. Recommended for on-site senior technical loops at top-tier engineering organizations.`
  : `Candidate demonstrates solid foundational capabilities. Continued deliberate practice in LeetCode algorithms and high-velocity Machine Coding component implementations will accelerate readiness for Tier-1 FAANG hiring loops.`}

*Generated automatically by Frontend MasterDocs University & Candidate Assessment Engine.*
`;
  }, [candidateName, candidateId, readinessIndex, studioStats, summary, docsStats, speedMetrics]);

  // Copy to Clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  // Download Markdown file
  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FAANG_Readiness_Dossier_${candidateName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Print PDF handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="faang-dossier-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="faang-dossier-modal" onClick={e => e.stopPropagation()}>
        {/* Modal Topbar */}
        <div className="faang-dossier-topbar no-print">
          <div className="faang-dossier-topbar-left">
            <span className="faang-dossier-logo-badge">🏆 FAANG DOSSIER</span>
            <span className="faang-dossier-title-sub">Technical Evaluation &amp; Export</span>
          </div>

          <div className="faang-dossier-tab-pills">
            <button
              type="button"
              className={`faang-tab-pill ${activeTab === 'visual' ? 'active' : ''}`}
              onClick={() => setActiveTab('visual')}
            >
              📊 Executive Dossier
            </button>
            <button
              type="button"
              className={`faang-tab-pill ${activeTab === 'markdown' ? 'active' : ''}`}
              onClick={() => setActiveTab('markdown')}
            >
              📝 Formatted Markdown
            </button>
          </div>

          <div className="faang-dossier-topbar-actions">
            <button
              type="button"
              className="faang-action-btn print-btn"
              onClick={handlePrint}
              title="Print or Save as PDF"
            >
              🖨️ Print / PDF
            </button>
            <button
              type="button"
              className="faang-action-btn copy-btn"
              onClick={handleCopy}
              title="Copy formatted Markdown to clipboard"
            >
              {copied ? '✓ Copied!' : '📋 Copy Markdown'}
            </button>
            <button
              type="button"
              className="faang-action-btn download-btn"
              onClick={handleDownloadMarkdown}
              title="Download dossier as .md file"
            >
              💾 Download .md
            </button>
            <button
              type="button"
              className="faang-close-btn"
              onClick={onClose}
              aria-label="Close Dossier Modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="faang-dossier-body">
          {activeTab === 'visual' ? (
            <div className="faang-dossier-printable" id="faang-readiness-dossier-printable">
              {/* Printable Header Hero */}
              <div className="dossier-hero-card">
                <div className="dossier-hero-profile">
                  <div className="dossier-avatar">
                    {candidateName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="dossier-candidate-name">{candidateName}</h2>
                    <p className="dossier-candidate-meta">
                      ID: <code>{candidateId}</code> {candidateEmail ? `• ${candidateEmail}` : ''} • Evaluated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <div className="dossier-tags">
                      <span className="dossier-tag role">{readinessIndex.targetBand}</span>
                      <span className="dossier-tag verdict">{readinessIndex.hiringVerdict}</span>
                      <span className="dossier-tag speed">{speedMetrics.badge.label}</span>
                    </div>
                  </div>
                </div>

                <div className="dossier-readiness-scorebox" style={{ borderColor: readinessIndex.tierColor }}>
                  <span className="scorebox-label">FAANG Readiness</span>
                  <div className="scorebox-value" style={{ color: readinessIndex.tierColor }}>
                    {readinessIndex.totalIndex}
                    <span className="scorebox-pct">%</span>
                  </div>
                  <span className="scorebox-tier">{readinessIndex.tierLabel}</span>
                </div>
              </div>

              {/* KPI Metrics Strip */}
              <div className="dossier-kpi-grid">
                <div className="dossier-kpi-tile">
                  <span className="kpi-label">Studio Score Contrib.</span>
                  <span className="kpi-val text-blue">{readinessIndex.studioScorePoints} / 45</span>
                  <span className="kpi-sub">Avg across 4 studios</span>
                </div>
                <div className="dossier-kpi-tile">
                  <span className="kpi-label">Problem Solves Contrib.</span>
                  <span className="kpi-val text-green">{readinessIndex.volumePoints} / 25</span>
                  <span className="kpi-sub">{summary?.uniqueSolved || 0} passing questions</span>
                </div>
                <div className="dossier-kpi-tile">
                  <span className="kpi-label">Syllabus Coverage Contrib.</span>
                  <span className="kpi-val text-purple">{readinessIndex.syllabusPoints} / 20</span>
                  <span className="kpi-sub">{docsStats.completionPercentage}% of 708 topics</span>
                </div>
                <div className="dossier-kpi-tile">
                  <span className="kpi-label">Solve Pace Contrib.</span>
                  <span className="kpi-val text-amber">{readinessIndex.speedPoints} / 10</span>
                  <span className="kpi-sub">{speedMetrics.avgMin} min/q average</span>
                </div>
              </div>

              {/* 4-Studio Competency Table */}
              <div className="dossier-section">
                <div className="dossier-section-header">
                  <h3>⚡ 4-Studio Technical Competencies</h3>
                  <span className="section-badge">All 4 Studios Active</span>
                </div>

                <div className="dossier-table-wrapper">
                  <table className="dossier-table">
                    <thead>
                      <tr>
                        <th>Coding Studio Track</th>
                        <th style={{ textAlign: 'center' }}>Catalog Size</th>
                        <th style={{ textAlign: 'center' }}>Attempted</th>
                        <th style={{ textAlign: 'center' }}>Solved</th>
                        <th style={{ textAlign: 'center' }}>Success Rate</th>
                        <th style={{ textAlign: 'center' }}>Avg Score</th>
                        <th style={{ textAlign: 'center' }}>Pace</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studioStats.map(studio => (
                        <tr key={studio.key}>
                          <td>
                            <div className="dossier-studio-cell">
                              <span className="studio-icon">{studio.icon}</span>
                              <strong>{studio.name}</strong>
                            </div>
                          </td>
                          <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                            {studio.totalCatalog} Qs
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: 600 }}>
                            {studio.attempted}
                          </td>
                          <td style={{ textAlign: 'center', color: '#22c55e', fontWeight: 700 }}>
                            {studio.solved}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <div className="dossier-progress-cell">
                              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{studio.successRate}%</span>
                              <div className="dossier-mini-bar">
                                <div
                                  className="dossier-mini-fill"
                                  style={{ width: `${studio.successRate}%`, backgroundColor: studio.accentColor }}
                                />
                              </div>
                            </div>
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: 700, color: studio.accentColor }}>
                            {studio.avgScore}%
                          </td>
                          <td style={{ textAlign: 'center', fontSize: '0.85rem' }}>
                            {studio.avgTimeSec > 0 ? `${Math.round(studio.avgTimeSec / 60)}m` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Split Row: Speed Telemetry & 21-Track Docs Syllabus */}
              <div className="dossier-split-grid">
                {/* Speed & Efficiency Telemetry Card */}
                <div className="dossier-card">
                  <div className="dossier-card-title">
                    <h4>🏎️ Speed &amp; Efficiency Telemetry</h4>
                    <span className="pill-badge speed">{speedMetrics.badge.label}</span>
                  </div>
                  <div className="dossier-speed-stats">
                    <div className="speed-stat-row">
                      <span>Average Pace per Problem:</span>
                      <strong>{speedMetrics.avgMin} minutes</strong>
                    </div>
                    <div className="speed-stat-row">
                      <span>Velocity Classification:</span>
                      <strong style={{ color: '#38bdf8' }}>{speedMetrics.badge.tier}</strong>
                    </div>
                    <div className="speed-stat-row">
                      <span>Benchmark Percentile:</span>
                      <strong style={{ color: '#22c55e' }}>{speedMetrics.badge.percentile}</strong>
                    </div>
                    <div className="speed-stat-row">
                      <span>Total Time Invested:</span>
                      <strong>{Math.round(speedMetrics.totalTimeSec / 60)} minutes</strong>
                    </div>
                  </div>
                </div>

                {/* 21-Track Docs Syllabus Coverage Card */}
                <div className="dossier-card">
                  <div className="dossier-card-title">
                    <h4>📚 21-Track Syllabus Mastery</h4>
                    <span className="pill-badge docs">{docsStats.completionPercentage}% Covered</span>
                  </div>
                  <div className="dossier-docs-stats">
                    <div className="docs-stat-row">
                      <span>Topics Mastered:</span>
                      <strong style={{ color: '#a855f7' }}>
                        {docsStats.totalCompletedTopics} / {docsStats.totalSyllabusTopics}
                      </strong>
                    </div>
                    <div className="docs-stat-row">
                      <span>Active Curriculum Tracks:</span>
                      <strong>{docsStats.activeTracksCount} of 21 Tracks</strong>
                    </div>
                    <div className="docs-stat-row">
                      <span>Topics Remaining:</span>
                      <strong>{Math.max(0, docsStats.totalSyllabusTopics - docsStats.totalCompletedTopics)} Topics</strong>
                    </div>
                    <div className="docs-stat-bar-container">
                      <div className="docs-stat-bar-fill" style={{ width: `${docsStats.completionPercentage}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Verdict & Recommendation */}
              <div className="dossier-verdict-card">
                <div className="verdict-icon">🎯</div>
                <div className="verdict-content">
                  <h4>Staff Evaluator Summary &amp; Recommendation</h4>
                  <p>
                    {readinessIndex.totalIndex >= 70
                      ? `Candidate demonstrates high proficiency in core frontend engineering mechanics, algorithm resolution, and structured component architecture. Highly recommended for technical interview loops at FAANG / Tier-1 engineering organizations.`
                      : `Candidate demonstrates solid foundational capabilities across early assessment tasks. Continued practice with DSA algorithms and higher-tempo Machine Coding component tasks will significantly elevate readiness for top-tier senior frontend loops.`}
                  </p>
                </div>
              </div>

              {/* 1-Click Targeted Mock Interview Launcher */}
              <div className="dossier-targeted-mock-card no-print">
                <div className="targeted-mock-header">
                  <div className="targeted-mock-info">
                    <div className="targeted-mock-badge-row">
                      <span className="targeted-mock-priority-tag">
                        {targetedRecommendation.isAutoRecommended ? '🔥 HIGHEST IMPACT FOCUS' : '🎯 CUSTOM TARGETED PRACTICE'}
                      </span>
                      {targetedRecommendation.isAutoRecommended && (
                        <span className="targeted-mock-sub-tag">AI Recommended</span>
                      )}
                    </div>
                    <h4 className="targeted-mock-title">
                      Targeted Mock Practice: {targetedRecommendation.activeStudio.name}
                    </h4>
                    <p className="targeted-mock-desc">
                      {targetedRecommendation.reason}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="targeted-mock-launch-btn"
                    onClick={() => {
                      onClose();
                      navigate(targetedRecommendation.activeStudio.route);
                    }}
                  >
                    <span>{targetedRecommendation.activeStudio.icon}</span>
                    <span>{targetedRecommendation.activeStudio.actionLabel} →</span>
                  </button>
                </div>

                {/* Studio selector pills */}
                <div className="targeted-mock-selector-wrap">
                  <span className="targeted-selector-label">Or Switch Focus:</span>
                  <div className="targeted-studio-pills">
                    {targetedRecommendation.allStudios.map((st) => {
                      const isSelected = targetedRecommendation.activeStudio.key === st.key;
                      const isRec = st.key === targetedRecommendation.recommendedKey;
                      return (
                        <button
                          key={st.key}
                          type="button"
                          className={`targeted-studio-pill ${isSelected ? 'active' : ''}`}
                          onClick={() => setSelectedStudioKey(st.key)}
                        >
                          <span>{st.icon}</span>
                          <span>{st.name.replace(' Studio', '')}</span>
                          {isRec && <span className="rec-mini-badge">AI Pick</span>}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      className={`targeted-studio-pill ${targetedRecommendation.activeStudio.key === 'AI_MOCK' ? 'active' : ''}`}
                      onClick={() => setSelectedStudioKey('AI_MOCK')}
                    >
                      <span>🎥</span>
                      <span>AI Video Mock</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="faang-dossier-markdown-view">
              <div className="markdown-toolbar">
                <span>GitHub Flavored Markdown (Ready for Interview Notes, Notion, or Slack)</span>
                <button type="button" className="markdown-copy-pill" onClick={handleCopy}>
                  {copied ? '✓ Copied to Clipboard!' : '📋 Copy All Markdown'}
                </button>
              </div>
              <textarea
                className="faang-markdown-textarea"
                readOnly
                value={markdownContent}
                rows={22}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
