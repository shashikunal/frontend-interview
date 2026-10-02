import React from 'react';
import { Link } from 'react-router-dom';
import type { DashboardView } from '../types/dashboardTypes';

interface DashboardOverviewProps {
  totalSolved: number;
  totalCatalogCount: number;
  overallPercentage: number;
  streak: number;
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
  onOpenDossier?: () => void;
  onSelectView?: (view: DashboardView) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  totalSolved,
  totalCatalogCount,
  overallPercentage,
  streak,
  docsSyllabusStats,
  mcSolvedCount,
  mcTotalCatalog,
  dsaSolvedCount,
  dsaTotalCatalog,
  cpSolvedCount,
  cpTotalCatalog,
  fjsSolvedCount,
  fjsTotalCatalog,
  onOpenDossier,
  onSelectView,
}) => {
  return (
    <div className="dashboard-overview-workspace" id="workspace-panel-overview" role="tabpanel" aria-labelledby="tab-overview">
      {/* 4-Card Compact KPI Strip */}
      <div className="kpi-compact-strip">
        <div className="kpi-card" onClick={() => onSelectView?.('progress')} role="button" tabIndex={0}>
          <div className="kpi-header">
            <span className="kpi-icon">⚡</span>
            <span className="kpi-tag">Verified Solves</span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{totalSolved}</span>
            <span className="kpi-total">/ {totalCatalogCount}</span>
          </div>
          <div className="kpi-progress-bar">
            <div className="kpi-progress-fill" style={{ width: `${overallPercentage}%` }} />
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-icon">🔥</span>
            <span className="kpi-tag">Practice Streak</span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{streak}</span>
            <span className="kpi-unit">Days</span>
          </div>
          <div className="kpi-subtext">Active Daily Consistency</div>
        </div>

        <div className="kpi-card" onClick={() => onSelectView?.('progress')} role="button" tabIndex={0}>
          <div className="kpi-header">
            <span className="kpi-icon">📚</span>
            <span className="kpi-tag">21-Track Coverage</span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{docsSyllabusStats.completionPercentage}%</span>
            <span className="kpi-total">({docsSyllabusStats.totalCompletedTopics}/{docsSyllabusStats.totalSyllabusTopics})</span>
          </div>
          <div className="kpi-progress-bar">
            <div className="kpi-progress-fill purple" style={{ width: `${docsSyllabusStats.completionPercentage}%` }} />
          </div>
        </div>

        <div className="kpi-card" onClick={() => onSelectView?.('analytics')} role="button" tabIndex={0}>
          <div className="kpi-header">
            <span className="kpi-icon">🎯</span>
            <span className="kpi-tag">Technical Dossier</span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">Ready</span>
          </div>
          <div className="kpi-subtext">View Telemetry &amp; Export</div>
        </div>
      </div>

      {/* Main 2-Column Balanced Grid */}
      <div className="dashboard-main-grid">
        {/* Column 1: Core Action Launcher */}
        <div className="quick-start-launcher card-box">
          <div className="card-box-header">
            <h3>🚀 Core Action Launcher</h3>
            <p className="card-sub-desc">Launch targeted drills, mock interview loops, or inspect syllabus tracks.</p>
          </div>
          <div className="quick-launcher-grid">
            <Link to="/mock-interview" className="launcher-tile">
              <span className="tile-icon">⏱️</span>
              <div className="tile-info">
                <strong>AI Video Mock</strong>
                <span>Simulate technical loops with speech analysis</span>
              </div>
            </Link>

            <Link to="/machine-coding" className="launcher-tile">
              <span className="tile-icon">💻</span>
              <div className="tile-info">
                <strong>Machine Coding Studio</strong>
                <span>Build React components under timer constraints ({mcSolvedCount}/{mcTotalCatalog} solved)</span>
              </div>
            </Link>

            <Link to="/questions" className="launcher-tile">
              <span className="tile-icon">📖</span>
              <div className="tile-info">
                <strong>Master Question Bank</strong>
                <span>Browse catalog with company &amp; difficulty filters</span>
              </div>
            </Link>

            <button type="button" className="launcher-tile btn-tile" onClick={onOpenDossier}>
              <span className="tile-icon">📄</span>
              <div className="tile-info">
                <strong>Technical Dossier</strong>
                <span>Generate candidate readiness report</span>
              </div>
            </button>
          </div>
        </div>

        {/* Column 2: Studio Solve Progress Snapshot */}
        <div className="studio-snapshot-card card-box">
          <div className="card-box-header">
            <h3>💻 Coding Studios Solve Summary</h3>
            <button type="button" className="btn-link" onClick={() => onSelectView?.('progress')}>
              View Full Progress →
            </button>
          </div>
          <div className="studio-snapshot-list">
            <div className="studio-snap-item">
              <div className="snap-info">
                <span className="snap-title">⚡ Machine Coding</span>
                <span className="snap-count">{mcSolvedCount} / {mcTotalCatalog} Solved</span>
              </div>
              <div className="snap-bar">
                <div className="snap-fill" style={{ width: `${mcTotalCatalog > 0 ? (mcSolvedCount / mcTotalCatalog) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="studio-snap-item">
              <div className="snap-info">
                <span className="snap-title">🧠 LeetCode / DSA</span>
                <span className="snap-count">{dsaSolvedCount} / {dsaTotalCatalog} Solved</span>
              </div>
              <div className="snap-bar">
                <div className="snap-fill purple" style={{ width: `${dsaTotalCatalog > 0 ? (dsaSolvedCount / dsaTotalCatalog) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="studio-snap-item">
              <div className="snap-info">
                <span className="snap-title">💻 Core Programming</span>
                <span className="snap-count">{cpSolvedCount} / {cpTotalCatalog} Solved</span>
              </div>
              <div className="snap-bar">
                <div className="snap-fill green" style={{ width: `${cpTotalCatalog > 0 ? (cpSolvedCount / cpTotalCatalog) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="studio-snap-item">
              <div className="snap-info">
                <span className="snap-title">🌐 Frontend JavaScript</span>
                <span className="snap-count">{fjsSolvedCount} / {fjsTotalCatalog} Solved</span>
              </div>
              <div className="snap-bar">
                <div className="snap-fill orange" style={{ width: `${fjsTotalCatalog > 0 ? (fjsSolvedCount / fjsTotalCatalog) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

