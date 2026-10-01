import React, { useState, useMemo } from 'react';
import type { CandidateMCSubmission } from '../../../lib/leaderboardService';
import type { DSASubmission } from '../../dsa/data/dsaTypes';
import type { CoreProgrammingSubmission } from '../../coreprogramming/data/coreProgrammingTypes';
import type { FrontendJsSubmission } from '../../frontendjs/data/frontendJsTypes';
import { DSA_QUESTIONS } from '../../dsa/data/dsaQuestions';
import { CORE_PROGRAMMING_QUESTIONS } from '../../coreprogramming/data/coreProgrammingQuestions';

interface DashboardActivityProps {
  mcSubmissions: CandidateMCSubmission[];
  dsaSubmissions: DSASubmission[];
  cpSubmissions: CoreProgrammingSubmission[];
  fjsSubmissions: FrontendJsSubmission[];
  onViewSubmission: (submission: {
    id: string;
    questionId: string;
    title: string;
    category: string;
    tech: string;
    status: string;
    score?: number | string;
    code: string;
    language: string;
    testsPassed?: number;
    testsTotal?: number;
    runtimeMs?: number;
    timestamp?: string;
    studioUrl?: string;
    isMachineCoding?: boolean;
  }) => void;
}

type ActivityTab = 'mc' | 'dsa' | 'cp' | 'fjs';

export const DashboardActivity: React.FC<DashboardActivityProps> = ({
  mcSubmissions,
  dsaSubmissions,
  cpSubmissions,
  fjsSubmissions,
  onViewSubmission,
}) => {
  const [activeTab, setActiveTab] = useState<ActivityTab>('mc');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMC = useMemo(() => {
    if (!searchQuery.trim()) return mcSubmissions;
    const term = searchQuery.toLowerCase();
    return mcSubmissions.filter(s =>
      s.questionId.toLowerCase().includes(term) ||
      s.questionTitle.toLowerCase().includes(term) ||
      s.category.toLowerCase().includes(term)
    );
  }, [mcSubmissions, searchQuery]);

  const filteredDSA = useMemo(() => {
    if (!searchQuery.trim()) return dsaSubmissions;
    const term = searchQuery.toLowerCase();
    return dsaSubmissions.filter(s => {
      const q = DSA_QUESTIONS.find(item => item.id === s.questionId);
      return (
        s.questionId.toLowerCase().includes(term) ||
        (q && q.title.toLowerCase().includes(term)) ||
        s.language.toLowerCase().includes(term)
      );
    });
  }, [dsaSubmissions, searchQuery]);

  const filteredCP = useMemo(() => {
    if (!searchQuery.trim()) return cpSubmissions;
    const term = searchQuery.toLowerCase();
    return cpSubmissions.filter(s => {
      const q = CORE_PROGRAMMING_QUESTIONS.find(item => item.id === s.questionId);
      return (
        s.questionId.toLowerCase().includes(term) ||
        (q && q.title.toLowerCase().includes(term)) ||
        s.status.toLowerCase().includes(term)
      );
    });
  }, [cpSubmissions, searchQuery]);

  const filteredFJS = useMemo(() => {
    if (!searchQuery.trim()) return fjsSubmissions;
    const term = searchQuery.toLowerCase();
    return fjsSubmissions.filter(s =>
      s.questionId.toLowerCase().includes(term) ||
      s.status.toLowerCase().includes(term)
    );
  }, [fjsSubmissions, searchQuery]);

  return (
    <div className="dashboard-activity-workspace" id="workspace-panel-activity" role="tabpanel" aria-labelledby="tab-activity">
      <div className="activity-header-bar card-box">
        <div className="activity-header-info">
          <h2>⚡ Candidate Verification &amp; Submissions Audit</h2>
          <p className="sub-text">Inspect past execution code, test result telemetry, and score evaluations across studios.</p>
        </div>

        <div className="activity-search-wrapper">
          <input
            type="text"
            className="activity-search-input"
            placeholder="Search submissions by title or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="activity-tabs-bar">
        <button
          type="button"
          className={`activity-tab-btn ${activeTab === 'mc' ? 'active' : ''}`}
          onClick={() => setActiveTab('mc')}
        >
          💻 Machine Coding ({mcSubmissions.length})
        </button>
        <button
          type="button"
          className={`activity-tab-btn ${activeTab === 'dsa' ? 'active' : ''}`}
          onClick={() => setActiveTab('dsa')}
        >
          🧠 LeetCode / DSA ({dsaSubmissions.length})
        </button>
        <button
          type="button"
          className={`activity-tab-btn ${activeTab === 'cp' ? 'active' : ''}`}
          onClick={() => setActiveTab('cp')}
        >
          💻 Core Programming ({cpSubmissions.length})
        </button>
        <button
          type="button"
          className={`activity-tab-btn ${activeTab === 'fjs' ? 'active' : ''}`}
          onClick={() => setActiveTab('fjs')}
        >
          🌐 Frontend JS ({fjsSubmissions.length})
        </button>
      </div>

      {/* Tab Content Tables */}
      <div className="activity-table-card card-box">
        {activeTab === 'mc' && (
          filteredMC.length === 0 ? (
            <div className="activity-empty-state">
              <span className="empty-icon">📂</span>
              <h3>No Machine Coding Submissions Yet</h3>
              <p>Complete a machine coding component challenge to generate submission telemetry.</p>
            </div>
          ) : (
            <div className="activity-table-scroll">
              <table className="activity-data-table">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Category</th>
                    <th>Score</th>
                    <th>Execution Time</th>
                    <th>Submitted At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMC.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <strong>{s.questionTitle}</strong>
                        <div className="sub-id">{s.questionId}</div>
                      </td>
                      <td><span className="badge-tag">{s.category}</span></td>
                      <td>
                        <span className={`score-badge ${s.score >= 70 ? 'pass' : 'fail'}`}>
                          {s.score} / 100
                        </span>
                      </td>
                      <td>—</td>
                      <td>{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => onViewSubmission({
                            id: s.id,
                            questionId: s.questionId,
                            title: s.questionTitle,
                            category: s.category,
                            tech: 'React 19 / TypeScript',
                            status: s.score >= 70 ? 'passed' : 'failed',
                            score: s.score,
                            code: s.code || '// No source recorded',
                            language: 'typescript',
                            timestamp: s.createdAt,
                            isMachineCoding: true,
                          })}
                        >
                          View Code
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {activeTab === 'dsa' && (
          filteredDSA.length === 0 ? (
            <div className="activity-empty-state">
              <span className="empty-icon">🧠</span>
              <h3>No LeetCode / DSA Submissions Yet</h3>
              <p>Solve algorithm challenges in DSA Studio to view verification audit history.</p>
            </div>
          ) : (
            <div className="activity-table-scroll">
              <table className="activity-data-table">
                <thead>
                  <tr>
                    <th>Question ID</th>
                    <th>Language</th>
                    <th>Status</th>
                    <th>Runtime</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDSA.map((s) => (
                    <tr key={s.id}>
                      <td><strong>{s.questionId}</strong></td>
                      <td><code>{s.language}</code></td>
                      <td>
                        <span className={`status-pill ${s.status === 'Accepted' ? 'pass' : 'fail'}`}>
                          {s.status.toUpperCase()}
                        </span>
                      </td>
                      <td>{s.runtimeMs ? `${s.runtimeMs}ms` : '—'}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => onViewSubmission({
                            id: s.id,
                            questionId: s.questionId,
                            title: s.questionId,
                            category: 'DSA',
                            tech: s.language,
                            status: s.status,
                            code: s.code || '// No source recorded',
                            language: s.language,
                            runtimeMs: s.runtimeMs,
                            timestamp: s.timestamp,
                          })}
                        >
                          View Code
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {activeTab === 'cp' && (
          filteredCP.length === 0 ? (
            <div className="activity-empty-state">
              <span className="empty-icon">💻</span>
              <h3>No Core Programming Submissions Yet</h3>
              <p>Complete language syntax &amp; core programming exercises to record history.</p>
            </div>
          ) : (
            <div className="activity-table-scroll">
              <table className="activity-data-table">
                <thead>
                  <tr>
                    <th>Question ID</th>
                    <th>Language</th>
                    <th>Tests</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCP.map((s) => (
                    <tr key={s.id}>
                      <td><strong>{s.questionId}</strong></td>
                      <td><code>JavaScript</code></td>
                      <td>{s.testsPassed} / {s.testsTotal}</td>
                      <td>
                        <span className={`status-pill ${s.status === 'Accepted' ? 'pass' : 'fail'}`}>
                          {s.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => onViewSubmission({
                            id: s.id,
                            questionId: s.questionId,
                            title: s.questionId,
                            category: 'Core Programming',
                            tech: 'JavaScript',
                            status: s.status,
                            code: s.code || '// No source recorded',
                            language: 'javascript',
                            testsPassed: s.testsPassed,
                            testsTotal: s.testsTotal,
                            timestamp: s.timestamp,
                          })}
                        >
                          View Code
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {activeTab === 'fjs' && (
          filteredFJS.length === 0 ? (
            <div className="activity-empty-state">
              <span className="empty-icon">🌐</span>
              <h3>No Frontend JS Submissions Yet</h3>
              <p>Practice DOM &amp; Vanilla JavaScript challenges to view activity telemetry.</p>
            </div>
          ) : (
            <div className="activity-table-scroll">
              <table className="activity-data-table">
                <thead>
                  <tr>
                    <th>Question ID</th>
                    <th>Status</th>
                    <th>Submitted At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFJS.map((s) => (
                    <tr key={s.id}>
                      <td><strong>{s.questionId}</strong></td>
                      <td>
                        <span className={`status-pill ${s.status === 'Accepted' ? 'pass' : 'fail'}`}>
                          {s.status.toUpperCase()}
                        </span>
                      </td>
                      <td>{s.timestamp ? new Date(s.timestamp).toLocaleDateString() : '—'}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => onViewSubmission({
                            id: s.id,
                            questionId: s.questionId,
                            title: s.questionId,
                            category: 'Frontend JS',
                            tech: 'JavaScript',
                            status: s.status,
                            code: s.code || '// No source recorded',
                            language: 'javascript',
                            timestamp: s.timestamp,
                          })}
                        >
                          View Code
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
};
