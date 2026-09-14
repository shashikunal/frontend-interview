import { Link } from 'react-router-dom';
import { ALL_SUBJECTS_CATALOG } from '../data/subjectsCatalog';
import { docsProgressService } from '../services/docsProgressService';
import { docsExportService } from '../services/docsExportService';

export function DocsReadinessDashboard() {
  const userProgress = docsProgressService.getProgress();
  const { overallScore, trackScores } = docsProgressService.calculateOverallReadiness();
  const lastVisited = userProgress.lastVisited;

  const lastVisitedSubject = lastVisited
    ? ALL_SUBJECTS_CATALOG.find(s => s.id === lastVisited.subjectId)
    : null;

  return (
    <div className="docs-readiness-dashboard-container">
      {/* Top Banner */}
      <div className="readiness-hero-card">
        <div className="rh-left">
          <span className="rh-badge">📊 INTERVIEW READINESS BENCHMARK</span>
          <h2>Frontend Interview University Readiness</h2>
          <p>
            Holistic assessment of your technical readiness across all 21 core web, framework, protocol, and architectural tracks.
          </p>
          <span className="readiness-disclaimer">
            * Application-generated competency indicator based on topics read, question mastery, and simulated interview loops.
          </span>
        </div>
        <div className="rh-gauge-wrap">
          <div className="gauge-circle">
            <span className="gauge-number">{overallScore}%</span>
            <span className="gauge-label">READINESS</span>
          </div>
        </div>
      </div>

      {/* Export & Study Kit Bar */}
      <div className="readiness-export-bar">
        <div className="reb-info">
          <span className="reb-badge">📦 REVISION &amp; EXPORT KIT</span>
          <h4>Export Readiness &amp; Study Materials</h4>
          <p>Download an offline Markdown study plan or print your complete competency report.</p>
        </div>
        <div className="reb-actions">
          <button
            type="button"
            className="reb-btn primary"
            onClick={() => docsExportService.exportMarkdownStudyPlan()}
            title="Download full study plan with bookmarks and scores as Markdown"
          >
            📄 Export Study Plan (.md)
          </button>
          <button
            type="button"
            className="reb-btn secondary"
            onClick={() => docsExportService.triggerPrintView()}
            title="Open browser print dialog for a clean report"
          >
            🖨️ Print Summary
          </button>
        </div>
      </div>

      {/* Continue Learning Resume Card */}
      {lastVisited && lastVisitedSubject && (
        <div className="continue-learning-card">
          <div className="cl-icon">{lastVisitedSubject.icon}</div>
          <div className="cl-info">
            <span className="cl-tag">CONTINUE LEARNING</span>
            <h4>{lastVisitedSubject.title}</h4>
            <p>Pick up right where you left off in your study journey.</p>
          </div>
          <Link
            to={`/docs/${lastVisited.subjectId}/${lastVisited.topicId}`}
            className="cl-resume-btn"
          >
            Resume Learning →
          </Link>
        </div>
      )}

      {/* 21 Tracks Readiness Grid */}
      <div className="readiness-tracks-section">
        <div className="rts-header">
          <h3>Track Competency Breakdown (21 Tracks)</h3>
          <span className="rts-count">All 21 Tracks Active</span>
        </div>

        <div className="readiness-tracks-grid">
          {ALL_SUBJECTS_CATALOG.map(subject => {
            const score = trackScores[subject.id] || 0;
            const progress = userProgress.subjectProgress[subject.id] || { topicsRead: 0, questionsPracticed: 0, masteredCount: 0 };

            return (
              <div key={subject.id} className="track-readiness-card">
                <div className="trc-head">
                  <span className="trc-icon">{subject.icon}</span>
                  <div className="trc-title-box">
                    <h5>{subject.title}</h5>
                    <span className="trc-category">{subject.category}</span>
                  </div>
                  <span className="trc-score-num">{score}%</span>
                </div>

                <div className="trc-progress-bar">
                  <div
                    className="trc-progress-fill"
                    style={{
                      width: `${score}%`,
                      backgroundColor: score >= 70 ? '#01b574' : score >= 40 ? '#ffb547' : '#4318ff',
                    }}
                  />
                </div>

                <div className="trc-footer-stats">
                  <span>📖 {progress.topicsRead}/{subject.totalTopicsCount} Topics</span>
                  <span>🏆 {progress.masteredCount} Mastered</span>
                  <div className="trc-card-actions">
                    <button
                      type="button"
                      className="trc-export-btn"
                      onClick={() => docsExportService.exportTrackCheatSheet(subject.id)}
                      title={`Download ${subject.title} Cheat Sheet as Markdown`}
                    >
                      📥 Cheat Sheet
                    </button>
                    <Link to={`/docs/${subject.id}`} className="trc-link">
                      Explore →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
