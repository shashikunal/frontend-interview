import React from 'react';
import { CandidateDocsSyllabusTracker } from '../CandidateDocsSyllabusTracker';

interface DashboardProgressProps {
  totalSolved: number;
  totalCatalogCount: number;
  overallPercentage: number;
  streak?: number;
  docsSyllabusStats: {
    totalCompletedTopics: number;
    totalSyllabusTopics: number;
    completionPercentage: number;
  };
  mcSolvedCount: number;
  mcTotalCatalog: number;
  dsaSolvedCount: number;
  dsaTotalCatalog: number;
  cpSolvedCount: number;
  cpTotalCatalog: number;
  fjsSolvedCount: number;
  fjsTotalCatalog: number;
}

export const DashboardProgress: React.FC<DashboardProgressProps> = ({
  totalSolved,
  totalCatalogCount,
  overallPercentage,
  docsSyllabusStats,
  mcSolvedCount,
  mcTotalCatalog,
  dsaSolvedCount,
  dsaTotalCatalog,
  cpSolvedCount,
  cpTotalCatalog,
  fjsSolvedCount,
  fjsTotalCatalog,
}) => {
  return (
    <div className="dashboard-progress-workspace" id="workspace-panel-progress" role="tabpanel" aria-labelledby="tab-progress">
      <div className="progress-workspace-header card-box">
        <h2>📚 21-Track Curriculum Mastery &amp; Solved Progress</h2>
        <p className="sub-desc">Comprehensive telemetry across documentation tracks and coding problem catalogs.</p>

        <div className="progress-summary-grid">
          <div className="prog-stat-card">
            <span className="stat-label">Overall Solve Mastery</span>
            <div className="stat-val">{overallPercentage}%</div>
            <span className="stat-sub">{totalSolved} of {totalCatalogCount} Solved</span>
          </div>

          <div className="prog-stat-card">
            <span className="stat-label">21-Track Syllabus</span>
            <div className="stat-val">{docsSyllabusStats.completionPercentage}%</div>
            <span className="stat-sub">{docsSyllabusStats.totalCompletedTopics} of {docsSyllabusStats.totalSyllabusTopics} Topics</span>
          </div>

          <div className="prog-stat-card">
            <span className="stat-label">Machine Coding Solves</span>
            <div className="stat-val">{mcTotalCatalog > 0 ? Math.round((mcSolvedCount / mcTotalCatalog) * 100) : 0}%</div>
            <span className="stat-sub">{mcSolvedCount} of {mcTotalCatalog} Solved</span>
          </div>

          <div className="prog-stat-card">
            <span className="stat-label">Algorithm Solves</span>
            <div className="stat-val">{dsaTotalCatalog > 0 ? Math.round((dsaSolvedCount / dsaTotalCatalog) * 100) : 0}%</div>
            <span className="stat-sub">{dsaSolvedCount} of {dsaTotalCatalog} Solved</span>
          </div>
        </div>
      </div>

      {/* 21-Track Syllabus Tracker */}
      <div className="progress-section-wrapper">
        <CandidateDocsSyllabusTracker />
      </div>

      {/* Track Details Grid */}
      <div className="progress-tracks-grid card-box">
        <h3>💻 Coding Track Catalog Breakdown</h3>
        <div className="track-cards-row">
          <div className="track-breakdown-card">
            <div className="tb-header">
              <span className="tb-icon">⚡</span>
              <h4>Machine Coding Studio</h4>
            </div>
            <p>React 19 state machines, performance, and custom UI components.</p>
            <div className="tb-progress">
              <div className="tb-fill" style={{ width: `${mcTotalCatalog > 0 ? (mcSolvedCount / mcTotalCatalog) * 100 : 0}%` }} />
            </div>
            <div className="tb-meta">
              <span>{mcSolvedCount} Solved</span>
              <span>{mcTotalCatalog} Total</span>
            </div>
          </div>

          <div className="track-breakdown-card">
            <div className="tb-header">
              <span className="tb-icon">🧠</span>
              <h4>LeetCode / DSA Studio</h4>
            </div>
            <p>Data structures, algorithm complexity, dynamic programming, and tree graph traversals.</p>
            <div className="tb-progress">
              <div className="tb-fill purple" style={{ width: `${dsaTotalCatalog > 0 ? (dsaSolvedCount / dsaTotalCatalog) * 100 : 0}%` }} />
            </div>
            <div className="tb-meta">
              <span>{dsaSolvedCount} Solved</span>
              <span>{dsaTotalCatalog} Total</span>
            </div>
          </div>

          <div className="track-breakdown-card">
            <div className="tb-header">
              <span className="tb-icon">💻</span>
              <h4>Core Programming Studio</h4>
            </div>
            <p>Language mechanics, async control flow, closures, and object-oriented patterns.</p>
            <div className="tb-progress">
              <div className="tb-fill green" style={{ width: `${cpTotalCatalog > 0 ? (cpSolvedCount / cpTotalCatalog) * 100 : 0}%` }} />
            </div>
            <div className="tb-meta">
              <span>{cpSolvedCount} Solved</span>
              <span>{cpTotalCatalog} Total</span>
            </div>
          </div>

          <div className="track-breakdown-card">
            <div className="tb-header">
              <span className="tb-icon">🌐</span>
              <h4>Frontend JavaScript Studio</h4>
            </div>
            <p>DOM manipulation, browser event loop, web APIs, and storage primitives.</p>
            <div className="tb-progress">
              <div className="tb-fill orange" style={{ width: `${fjsTotalCatalog > 0 ? (fjsSolvedCount / fjsTotalCatalog) * 100 : 0}%` }} />
            </div>
            <div className="tb-meta">
              <span>{fjsSolvedCount} Solved</span>
              <span>{fjsTotalCatalog} Total</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
