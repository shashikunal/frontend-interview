import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { codingHistoryService } from '../../services/codingHistoryService';
import { hiringEvaluationService } from '../../services/hiringEvaluationService';
import type { CandidateUserListItem } from '../../types/history.types';
import './AdminCandidateManagementTab.css';

export default function AdminCandidateManagementTab() {
  const navigate = useNavigate();
  const { getAllUsers } = useAuth();

  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<CandidateUserListItem[]>([]);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [hiringFilter, setHiringFilter] = useState<string>('ALL');
  const [performanceFilter, setPerformanceFilter] = useState<string>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Load candidates and aggregate real metrics via high-performance batch query
  const loadCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const [rawUsers, hiringStatusMap, userSummaries] = await Promise.all([
        getAllUsers(),
        hiringEvaluationService.getAllHiringStatuses(),
        codingHistoryService.getAllUsersPerformanceSummaries(),
      ]);

      const candidateItems: CandidateUserListItem[] = rawUsers.map(u => {
        const summary = userSummaries[u.id];
        const evalInfo = hiringStatusMap[u.id];

        return {
          id: u.id,
          name: u.name || 'Candidate',
          email: u.email || `${u.id.slice(0, 8)}@candidate.com`,
          role: u.role || 'candidate',
          joinedDate: u.createdAt || new Date().toISOString(),
          lastActive: u.lastLogin || (summary?.lastActiveDate ? new Date(summary.lastActiveDate).toLocaleDateString() : (summary?.totalAttempts && summary.totalAttempts > 0 ? 'Active recently' : 'Never active')),
          totalQuestions: summary?.uniqueAttempted || 0,
          solvedCount: summary?.uniqueSolved || 0,
          successRate: summary?.successRate || 0,
          machineCodingScore: summary?.machineCodingScore || 0,
          dsaScore: summary?.dsaScore || 0,
          coreProgrammingScore: summary?.coreProgrammingScore || 0,
          hiringStatus: evalInfo?.status || 'Not Evaluated',
          overallRating: evalInfo?.overallRating,
        };
      });

      setCandidates(candidateItems);
    } catch (err) {
      console.warn('[AdminCandidateManagementTab] Failed to load candidates:', err);
    } finally {
      setLoading(false);
    }
  }, [getAllUsers]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  // Filtered Candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter(cand => {
      // Search
      const searchMatch =
        !searchTerm ||
        cand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cand.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cand.id.toLowerCase().includes(searchTerm.toLowerCase());

      // Hiring Status
      const hiringMatch =
        hiringFilter === 'ALL' || cand.hiringStatus === hiringFilter;

      // Performance Filter
      let perfMatch = true;
      if (performanceFilter === 'HIGH') perfMatch = cand.successRate >= 70;
      else if (performanceFilter === 'MID') perfMatch = cand.successRate >= 40 && cand.successRate < 70;
      else if (performanceFilter === 'LOW') perfMatch = cand.successRate < 40;

      // Role Filter
      const roleMatch = roleFilter === 'ALL' || cand.role === roleFilter;

      return searchMatch && hiringMatch && perfMatch && roleMatch;
    });
  }, [candidates, searchTerm, hiringFilter, performanceFilter, roleFilter]);

  const getHiringBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'hire') return <span className="admin-status-pill pill-hire">✓ HIRE</span>;
    if (s === 'consider') return <span className="admin-status-pill pill-consider">⚡ CONSIDER</span>;
    if (s === 'reject') return <span className="admin-status-pill pill-reject">✕ REJECT</span>;
    if (s === 'pending') return <span className="admin-status-pill pill-pending">⏳ PENDING</span>;
    return <span className="admin-status-pill pill-none">NOT EVALUATED</span>;
  };

  return (
    <div className="admin-cand-mgmt-container">
      {/* Top Header */}
      <div className="admin-cand-mgmt-header">
        <div>
          <h2 className="admin-cand-title">Candidate Hiring Management &amp; Evaluations</h2>
          <p className="admin-cand-subtitle">
            Search candidates, inspect complete multi-attempt code histories, review metrics, and submit formal hiring evaluations.
          </p>
        </div>
        <button
          type="button"
          className="admin-cand-refresh-btn"
          onClick={loadCandidates}
          disabled={loading}
        >
          🔄 {loading ? 'Refreshing...' : 'Refresh Roster'}
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="admin-cand-filters-toolbar">
        <div className="admin-cand-search-wrap">
          <input
            type="text"
            className="admin-cand-search-input"
            placeholder="Search candidate by name, email, or user ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="admin-cand-clear-search"
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="admin-cand-filter-group">
          <select
            className="admin-cand-select"
            value={hiringFilter}
            onChange={e => setHiringFilter(e.target.value)}
          >
            <option value="ALL">All Hiring Statuses</option>
            <option value="Hire">Hire</option>
            <option value="Consider">Consider</option>
            <option value="Reject">Reject</option>
            <option value="Pending">Pending</option>
            <option value="Not Evaluated">Not Evaluated</option>
          </select>

          <select
            className="admin-cand-select"
            value={performanceFilter}
            onChange={e => setPerformanceFilter(e.target.value)}
          >
            <option value="ALL">All Performance Tiers</option>
            <option value="HIGH">High (≥70% Success)</option>
            <option value="MID">Mid (40% - 69% Success)</option>
            <option value="LOW">Low (&lt;40% Success)</option>
          </select>

          <select
            className="admin-cand-select"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="candidate">Candidate</option>
            <option value="pro_member">Pro Member</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
      </div>

      {/* Candidates Roster Table */}
      {loading ? (
        <div className="admin-cand-loading-box">
          <div className="perf-spinner" />
          <p>Compiling candidate portfolios and evaluations across platform tracks...</p>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="perf-empty-state">
          <div className="perf-empty-icon">👥</div>
          <h4>No candidates found</h4>
          <p>
            {searchTerm || hiringFilter !== 'ALL' || performanceFilter !== 'ALL'
              ? 'No candidates matched your search or filter criteria.'
              : 'No registered candidates found in the platform database.'}
          </p>
        </div>
      ) : (
        <div className="perf-table-responsive">
          <table className="admin-cand-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Role</th>
                <th style={{ textAlign: 'center' }}>Solved / Att.</th>
                <th>Success %</th>
                <th style={{ textAlign: 'center' }} title="Machine Level Coding Score">MC</th>
                <th style={{ textAlign: 'center' }} title="LeetCode & DSA Score">DSA</th>
                <th style={{ textAlign: 'center' }} title="Core Programming Score">Core</th>
                <th>Hiring Status</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map(cand => (
                <tr
                  key={cand.id}
                  onClick={() => navigate(`/admin/candidates/${cand.id}/performance`)}
                  className="clickable-row"
                >
                  <td className="cand-info-cell">
                    <div className="cand-avatar">
                      {cand.name ? cand.name[0].toUpperCase() : 'C'}
                    </div>
                    <div className="cand-meta">
                      <span className="cand-name">{cand.name}</span>
                      <span className="cand-email">{cand.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className="role-tag">{cand.role}</span>
                  </td>
                  <td className="cell-number" style={{ textAlign: 'center' }}>
                    <span className="text-green">{cand.solvedCount}</span>
                    <span className="text-sub" style={{ fontSize: '0.78rem' }}> / {cand.totalQuestions}</span>
                  </td>
                  <td>
                    <div className="perf-metric-bar-cell">
                      <span className="rate-num">{cand.totalQuestions > 0 ? `${cand.successRate}%` : '—'}</span>
                      <div className="mini-progress-bar">
                        <div
                          className="mini-progress-fill"
                          style={{ width: `${cand.successRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="score-cell text-purple">
                    {cand.machineCodingScore > 0 ? `${cand.machineCodingScore}%` : '—'}
                  </td>
                  <td className="score-cell text-blue">
                    {cand.dsaScore > 0 ? `${cand.dsaScore}%` : '—'}
                  </td>
                  <td className="score-cell text-green">
                    {cand.coreProgrammingScore > 0 ? `${cand.coreProgrammingScore}%` : '—'}
                  </td>
                  <td>{getHiringBadge(cand.hiringStatus)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="admin-evaluate-btn"
                      onClick={e => {
                        e.stopPropagation();
                        navigate(`/admin/candidates/${cand.id}/performance`);
                      }}
                    >
                      Dossier →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
