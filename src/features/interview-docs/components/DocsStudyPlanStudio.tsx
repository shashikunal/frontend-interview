import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  docsStudyPlanService,
  ARCHETYPE_PROFILES,
  DOMAIN_CATEGORIES,
  type CompanyArchetype,
  type PlanTimeline,
  type StudyPlanConfig,
  type GeneratedStudyPlan,
} from '../services/docsStudyPlanService';
import type { ExperienceLevel } from '../types/docs.types';

export function DocsStudyPlanStudio() {
  const [activePlan, setActivePlan] = useState<GeneratedStudyPlan | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [config, setConfig] = useState<StudyPlanConfig>(() => docsStudyPlanService.getDefaultConfig());
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [filterIncompleteOnly, setFilterIncompleteOnly] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Load existing plan from localStorage on mount
  useEffect(() => {
    const existing = docsStudyPlanService.getActivePlan();
    if (existing) {
      setActivePlan(existing);
      setConfig(existing.config);
    } else {
      setIsConfiguring(true);
    }
  }, []);

  const handleGeneratePlan = () => {
    const newPlan = docsStudyPlanService.generateStudyPlan(config);
    setActivePlan(newPlan);
    setIsConfiguring(false);
    setSelectedWeek('all');
  };

  const handleToggleDay = (day: number) => {
    const updated = docsStudyPlanService.toggleDayCompletion(day);
    if (updated) {
      setActivePlan({ ...updated });
    }
  };

  const handleCopyMarkdown = () => {
    if (!activePlan) return;
    const md = docsStudyPlanService.exportToMarkdown(activePlan);
    navigator.clipboard.writeText(md).then(() => {
      setCopiedMarkdown(true);
      setTimeout(() => setCopiedMarkdown(false), 2500);
    });
  };

  const handleDownloadMarkdown = () => {
    if (!activePlan) return;
    const md = docsStudyPlanService.exportToMarkdown(activePlan);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `study-plan-${activePlan.archetypeMeta.id}-${activePlan.config.timeline}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations for active plan progress
  const completedCount = activePlan ? activePlan.completedDays.length : 0;
  const totalDays = activePlan ? activePlan.totalDays : 1;
  const progressPct = Math.round((completedCount / totalDays) * 100);

  // Filtered milestones
  const filteredMilestones = activePlan
    ? activePlan.milestones.filter(m => {
        if (selectedWeek !== 'all' && m.week !== selectedWeek) return false;
        if (filterIncompleteOnly && activePlan.completedDays.includes(m.day)) return false;
        return true;
      })
    : [];

  const totalWeeks = activePlan ? Math.ceil(activePlan.totalDays / 7) : 0;

  return (
    <div className="docs-study-plan-container">
      {/* Studio Header Card */}
      <div className="sp-header-card">
        <div className="sp-header-badge">
          <span className="sp-badge-icon">🗺️</span>
          <span>AI CAREER ROADMAP &amp; STUDY PLAN GENERATOR</span>
        </div>
        <h2>Company-Tailored Technical Preparation Pathways</h2>
        <p>
          Diagnose knowledge gaps, select your target employer archetype (FAANG, Unicorn, Scaleup, Staff Architect), and follow a structured daily milestone schedule with automated spaced repetition intervals.
        </p>
      </div>

      {/* Configuration Mode */}
      {isConfiguring && (
        <div className="sp-config-panel">
          <div className="sp-config-header">
            <h3>⚙️ Configure Your Personalized Study Roadmap</h3>
            {activePlan && (
              <button
                type="button"
                className="sp-cancel-config-btn"
                onClick={() => setIsConfiguring(false)}
              >
                ✕ Return to Active Roadmap
              </button>
            )}
          </div>

          {/* Step 1: Select Employer Archetype */}
          <div className="sp-config-section">
            <label className="sp-section-label">
              <span className="sp-step-num">1</span>
              <span>Select Your Target Company Profile &amp; Bar</span>
            </label>
            <div className="sp-archetypes-grid">
              {(Object.keys(ARCHETYPE_PROFILES) as CompanyArchetype[]).map(key => {
                const arch = ARCHETYPE_PROFILES[key];
                const isSelected = config.archetype === key;
                return (
                  <div
                    key={key}
                    className={`sp-archetype-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setConfig(prev => ({ ...prev, archetype: key }))}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="sp-arch-top">
                      <span className="sp-arch-icon">{arch.icon}</span>
                      <span className="sp-arch-badge">{arch.badge}</span>
                    </div>
                    <h4 className="sp-arch-title">{arch.title}</h4>
                    <p className="sp-arch-summary">{arch.summary}</p>
                    <div className="sp-arch-companies">
                      <strong>Target:</strong> {arch.targetCompanies.slice(0, 4).join(', ')}
                    </div>
                    <div className="sp-arch-skills">
                      {arch.keyFocusAreas.slice(0, 3).map((skill, i) => (
                        <span key={i} className="sp-skill-chip">{skill}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Timeline & Seniority */}
          <div className="sp-config-section">
            <label className="sp-section-label">
              <span className="sp-step-num">2</span>
              <span>Preparation Timeline &amp; Seniority Calibrations</span>
            </label>
            <div className="sp-dual-controls-grid">
              <div className="sp-control-card">
                <span className="sp-ctrl-title">Target Timeline:</span>
                <div className="sp-timeline-buttons">
                  {(['7-day', '30-day', '60-day', '90-day'] as PlanTimeline[]).map(t => (
                    <button
                      key={t}
                      type="button"
                      className={`sp-time-btn ${config.timeline === t ? 'active' : ''}`}
                      onClick={() => setConfig(prev => ({ ...prev, timeline: t }))}
                    >
                      {t === '7-day' && '⚡ 7-Day Blitz'}
                      {t === '30-day' && '🚀 30-Day Sprint'}
                      {t === '60-day' && '📚 60-Day In-Depth'}
                      {t === '90-day' && '🏆 90-Day Masterclass'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sp-control-card">
                <span className="sp-ctrl-title">Target Experience Level:</span>
                <select
                  value={config.experience}
                  onChange={e => setConfig(prev => ({ ...prev, experience: e.target.value as ExperienceLevel }))}
                  className="sp-select"
                >
                  <option value="junior">Junior Frontend Engineer (1-2 yrs)</option>
                  <option value="mid-level">Mid-Level Software Engineer (3-5 yrs)</option>
                  <option value="senior">Senior Frontend Engineer (5-8 yrs)</option>
                  <option value="architect">Staff / Principal Solutions Architect (8+ yrs)</option>
                </select>
              </div>

              <div className="sp-control-card">
                <span className="sp-ctrl-title">Daily Study Commitment:</span>
                <div className="sp-hours-slider-box">
                  <input
                    type="range"
                    min={1}
                    max={4}
                    step={0.5}
                    value={config.dailyHours}
                    onChange={e => setConfig(prev => ({ ...prev, dailyHours: Number(e.target.value) }))}
                    className="sp-range"
                  />
                  <div className="sp-hours-display">
                    <strong>{config.dailyHours} Hours/Day</strong> ({Math.round(config.dailyHours * 60)} minutes daily)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Diagnostic Gap Assessment */}
          <div className="sp-config-section">
            <label className="sp-section-label">
              <span className="sp-step-num">3</span>
              <span>Diagnostic Knowledge Baseline (Rate Your Current Confidence)</span>
            </label>
            <p className="sp-diag-desc">
              Lower-rated areas will automatically be prioritized early in your roadmap with additional practice drills.
            </p>
            <div className="sp-diagnostic-grid">
              {DOMAIN_CATEGORIES.map(domain => {
                const val = config.domainConfidence[domain.name] ?? 3;
                const labels = ['', 'Novice', 'Developing', 'Competent', 'Advanced', 'Master'];
                return (
                  <div key={domain.name} className="sp-diag-card">
                    <div className="sp-diag-head">
                      <span className="sp-diag-icon">{domain.icon}</span>
                      <strong>{domain.name}</strong>
                      <span className={`sp-diag-pill level-${val}`}>{labels[val]}</span>
                    </div>
                    <div className="sp-diag-slider-row">
                      <input
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        value={val}
                        onChange={e => {
                          const num = Number(e.target.value);
                          setConfig(prev => ({
                            ...prev,
                            domainConfidence: {
                              ...prev.domainConfidence,
                              [domain.name]: num,
                            },
                          }));
                        }}
                        className="sp-range"
                      />
                      <span className="sp-diag-val">{val}/5</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="sp-config-footer">
            <button
              type="button"
              className="sp-generate-btn"
              onClick={handleGeneratePlan}
            >
              🚀 Generate My Personalized Career Roadmap →
            </button>
          </div>
        </div>
      )}

      {/* Active Roadmap View */}
      {activePlan && !isConfiguring && (
        <div className="sp-active-plan-shell">
          {/* Dashboard Summary Card */}
          <div className="sp-summary-card">
            <div className="sp-summary-top">
              <div className="sp-summary-info">
                <div className="sp-meta-badges">
                  <span className="sp-archetype-pill">
                    {activePlan.archetypeMeta.icon} {activePlan.archetypeMeta.title}
                  </span>
                  <span className="sp-timeline-pill">⏱ {activePlan.config.timeline.toUpperCase()}</span>
                  <span className="sp-level-pill">👔 {activePlan.config.experience.toUpperCase()}</span>
                </div>
                <h3>{activePlan.archetypeMeta.title} Career Pathway</h3>
                <p className="sp-summary-text">{activePlan.archetypeMeta.summary}</p>
                <div className="sp-companies-row">
                  <strong>Tailored For:</strong> {activePlan.archetypeMeta.targetCompanies.join(' • ')}
                </div>
              </div>

              {/* Progress Gauge */}
              <div className="sp-progress-gauge">
                <div className="sp-gauge-circle">
                  <span className="sp-gauge-pct">{progressPct}%</span>
                  <span className="sp-gauge-sub">Complete</span>
                </div>
                <div className="sp-gauge-stats">
                  <div><strong>{completedCount}</strong> of {totalDays} Days</div>
                  <div><strong>{activePlan.totalEstimatedHours}h</strong> Total Study</div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="sp-summary-actions">
              <div className="sp-action-left">
                <button
                  type="button"
                  className="sp-action-btn export-btn"
                  onClick={() => setShowExportModal(true)}
                >
                  📥 Export / Share Roadmap
                </button>
                <button
                  type="button"
                  className="sp-action-btn secondary-btn"
                  onClick={handleCopyMarkdown}
                >
                  {copiedMarkdown ? '✓ Copied Markdown!' : '📋 Copy as Markdown'}
                </button>
              </div>

              <div className="sp-action-right">
                <button
                  type="button"
                  className="sp-action-btn config-trigger-btn"
                  onClick={() => setIsConfiguring(true)}
                >
                  ⚙️ Reconfigure Plan
                </button>
              </div>
            </div>
          </div>

          {/* Today's Spaced Repetition Notification (if applicable) */}
          {activePlan.milestones.some(m => !m.isCompleted && m.spacedRepetitionTopic) && (
            <div className="sp-rep-alert-card">
              <div className="sp-rep-icon">↺</div>
              <div className="sp-rep-content">
                <h4>Spaced Repetition Review Queue</h4>
                <p>
                  Retention science shows reviewing topics at 3-day and 7-day intervals permanently commits architectural concepts into long-term memory. Look for the purple spaced repetition cues on your daily cards.
                </p>
              </div>
              <Link to="/docs/flashcards" className="sp-rep-btn">
                Open Flashcards Studio →
              </Link>
            </div>
          )}

          {/* Filters & Week Switcher */}
          <div className="sp-filter-toolbar">
            <div className="sp-week-tabs">
              <button
                type="button"
                className={`sp-week-tab ${selectedWeek === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedWeek('all')}
              >
                All Days ({activePlan.totalDays})
              </button>
              {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(weekNum => (
                <button
                  key={weekNum}
                  type="button"
                  className={`sp-week-tab ${selectedWeek === weekNum ? 'active' : ''}`}
                  onClick={() => setSelectedWeek(weekNum)}
                >
                  Week {weekNum}
                </button>
              ))}
            </div>

            <label className="sp-incomplete-checkbox">
              <input
                type="checkbox"
                checked={filterIncompleteOnly}
                onChange={e => setFilterIncompleteOnly(e.target.checked)}
              />
              <span>Incomplete Only</span>
            </label>
          </div>

          {/* Day-by-Day Milestone Cards Grid */}
          <div className="sp-milestones-list">
            {filteredMilestones.map(m => {
              const isDone = activePlan.completedDays.includes(m.day);
              return (
                <div key={m.day} className={`sp-day-card ${isDone ? 'completed' : ''}`}>
                  <div className="sp-day-head">
                    <label className="sp-check-wrap">
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => handleToggleDay(m.day)}
                        className="sp-checkbox"
                      />
                      <span className="sp-day-num">DAY {m.day}</span>
                    </label>

                    <span className="sp-phase-pill">{m.phase}</span>
                    <span className="sp-est-pill">⏱ {m.estimatedMinutes} mins</span>
                  </div>

                  <h4 className="sp-day-title">{m.title}</h4>

                  {/* Reading Assignments Links */}
                  <div className="sp-topics-box">
                    <span className="sp-box-label">📖 REQUIRED READING &amp; CODE SPECS:</span>
                    <div className="sp-topic-links">
                      {m.topics.map(t => (
                        <Link
                          key={t.id}
                          to={`/docs/${t.subjectId}/${t.id}`}
                          className="sp-topic-link"
                        >
                          <span className="sp-tl-subject">{t.subjectId.toUpperCase()}:</span>
                          <span className="sp-tl-title">{t.title}</span>
                          <span className="sp-tl-arrow">→</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Practice Goal */}
                  <div className="sp-practice-goal">
                    <span className="sp-goal-icon">🎯</span>
                    <div className="sp-goal-text">
                      <strong>Target:</strong> {m.practiceGoal}
                    </div>
                    <Link
                      to={`/docs/practice?track=${m.subjectId}`}
                      className="sp-practice-link"
                    >
                      Practice Questions →
                    </Link>
                  </div>

                  {/* Spaced Repetition Cue */}
                  {m.spacedRepetitionTopic && (
                    <div className="sp-spaced-cue">
                      <span className="sp-sc-icon">↺</span>
                      <div className="sp-sc-text">
                        <strong>{m.spacedRepetitionTopic.reviewInterval}:</strong> Review{' '}
                        <Link
                          to={`/docs/${m.spacedRepetitionTopic.subjectId}/${m.spacedRepetitionTopic.topicId}`}
                          className="sp-sc-link"
                        >
                          {m.spacedRepetitionTopic.title}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Export Markdown Modal */}
      {showExportModal && activePlan && (
        <div className="sp-modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="sp-modal-content" onClick={e => e.stopPropagation()}>
            <div className="sp-modal-head">
              <h3>📥 Export Career Roadmap</h3>
              <button
                type="button"
                className="sp-modal-close"
                onClick={() => setShowExportModal(false)}
              >
                ✕
              </button>
            </div>

            <p className="sp-modal-desc">
              Your personalized career pathway has been generated in GitHub Flavored Markdown. You can copy it into your notes, Notion, or download as a standalone document.
            </p>

            <div className="sp-modal-code">
              <pre>{docsStudyPlanService.exportToMarkdown(activePlan)}</pre>
            </div>

            <div className="sp-modal-actions">
              <button
                type="button"
                className="sp-modal-btn copy"
                onClick={handleCopyMarkdown}
              >
                {copiedMarkdown ? '✓ Copied to Clipboard!' : '📋 Copy Markdown'}
              </button>
              <button
                type="button"
                className="sp-modal-btn download"
                onClick={handleDownloadMarkdown}
              >
                💾 Download .md File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
