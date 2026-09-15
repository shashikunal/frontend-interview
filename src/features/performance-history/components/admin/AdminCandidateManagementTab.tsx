import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { codingHistoryService } from '../../services/codingHistoryService';
import { hiringEvaluationService } from '../../services/hiringEvaluationService';
import { candidateHiringActionService } from '../../services/candidateHiringActionService';
import type { CandidateUserListItem, HiringStatus } from '../../types/history.types';
import './AdminCandidateManagementTab.css';

/**
 * Cleanly exports an array of candidate records to a standard CSV file with UTF-8 BOM.
 */
function exportCandidatesToCsv(candidatesToExport: CandidateUserListItem[], filename?: string) {
  if (!candidatesToExport.length) return;

  const headers = [
    'Candidate Name',
    'Email',
    'Role',
    'Hiring Status',
    'Overall Rating (1-5)',
    'Solved Questions',
    'Total Attempted Questions',
    'Success Rate (%)',
    'Speed Rating',
    'Machine Coding (%)',
    'DSA (%)',
    'Core Programming (%)',
    'Joined Date',
    'Last Active',
    'Candidate ID',
  ];

  const escapeCsv = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = candidatesToExport.map(c => [
    escapeCsv(c.name),
    escapeCsv(c.email),
    escapeCsv(c.role),
    escapeCsv(c.hiringStatus),
    escapeCsv(c.overallRating ? `${c.overallRating}/5` : 'N/A'),
    escapeCsv(c.solvedCount),
    escapeCsv(c.totalQuestions),
    escapeCsv(`${c.successRate}%`),
    escapeCsv(c.speedLabel || '🎯 Steady'),
    escapeCsv(`${c.machineCodingScore}%`),
    escapeCsv(`${c.dsaScore}%`),
    escapeCsv(`${c.coreProgrammingScore}%`),
    escapeCsv(c.joinedDate ? new Date(c.joinedDate).toLocaleDateString() : 'N/A'),
    escapeCsv(c.lastActive),
    escapeCsv(c.id),
  ].join(','));

  // Prepend UTF-8 BOM so Excel opens CSV without encoding errors
  const csvContent = '\uFEFF' + [headers.map(h => `"${h}"`).join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename || `candidates_export_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

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

  // Multi-Selection State
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<Set<string>>(new Set());

  // Batch Modals State
  const [showBatchStatusModal, setShowBatchStatusModal] = useState(false);
  const [showBatchAssignModal, setShowBatchAssignModal] = useState(false);
  const [batchProcessing, setBatchProcessing] = useState(false);

  // Batch Status Form
  const [batchStatusDecision, setBatchStatusDecision] = useState<HiringStatus>('Hire');
  const [batchStatusRating, setBatchStatusRating] = useState<number>(4);
  const [batchStatusNotes, setBatchStatusNotes] = useState<string>('');

  // Batch Assignment Form
  const [batchAssignTitle, setBatchAssignTitle] = useState<string>('Frontend Architecture & Coding Challenge');
  const [batchAssignTrack, setBatchAssignTrack] = useState<'MACHINE_CODING' | 'DSA' | 'CORE_PROGRAMMING' | 'FRONTEND_JS'>('MACHINE_CODING');
  const [batchAssignDifficulty, setBatchAssignDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('medium');
  const [batchAssignCount, setBatchAssignCount] = useState<number>(3);
  const [batchAssignDeadlineDays, setBatchAssignDeadlineDays] = useState<number>(7);
  const [batchAssignInstructions, setBatchAssignInstructions] = useState<string>('Please complete the assigned coding challenges within the designated deadline. Unit test coverage and clean architectural separation are strongly emphasized.');

  // Notification Toast
  const [actionToast, setActionToast] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'info' = 'success') => {
    setActionToast({ text, type });
    setTimeout(() => {
      setActionToast(null);
    }, 4500);
  }, []);

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

        const avgTime = summary?.uniqueSolved && summary.uniqueSolved > 0
          ? Math.round((summary.totalCodingTimeSeconds || 0) / summary.uniqueSolved)
          : (summary?.totalAttempts && summary.totalAttempts > 0
            ? Math.round((summary.totalCodingTimeSeconds || 0) / summary.totalAttempts)
            : 0);

        let speedLabel = '🎯 Steady';
        if (avgTime > 0 && avgTime <= 300) speedLabel = '⚡ Lightning';
        else if (avgTime > 300 && avgTime <= 600) speedLabel = '🏎️ Fast';
        else if (avgTime > 1200) speedLabel = '🧠 Methodical';

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
          speedLabel,
          avgTimeSpentSeconds: avgTime,
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

  // Selected candidates list
  const selectedCandidatesList = useMemo(() => {
    return candidates.filter(c => selectedCandidateIds.has(c.id));
  }, [candidates, selectedCandidateIds]);

  // Checkbox selection handlers
  const isAllFilteredSelected = useMemo(() => {
    return (
      filteredCandidates.length > 0 &&
      filteredCandidates.every(c => selectedCandidateIds.has(c.id))
    );
  }, [filteredCandidates, selectedCandidateIds]);

  const isSomeFilteredSelected = useMemo(() => {
    return (
      filteredCandidates.some(c => selectedCandidateIds.has(c.id)) &&
      !isAllFilteredSelected
    );
  }, [filteredCandidates, selectedCandidateIds, isAllFilteredSelected]);

  const handleToggleSelectAll = () => {
    if (isAllFilteredSelected) {
      // Deselect all visible
      setSelectedCandidateIds(prev => {
        const next = new Set(prev);
        filteredCandidates.forEach(c => next.delete(c.id));
        return next;
      });
    } else {
      // Select all visible
      setSelectedCandidateIds(prev => {
        const next = new Set(prev);
        filteredCandidates.forEach(c => next.add(c.id));
        return next;
      });
    }
  };

  const handleToggleSelectCandidate = (candidateId: string) => {
    setSelectedCandidateIds(prev => {
      const next = new Set(prev);
      if (next.has(candidateId)) {
        next.delete(candidateId);
      } else {
        next.add(candidateId);
      }
      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedCandidateIds(new Set());
  };

  // Export handlers
  const handleExportSelected = () => {
    if (selectedCandidatesList.length === 0) return;
    exportCandidatesToCsv(
      selectedCandidatesList,
      `selected_candidates_${selectedCandidatesList.length}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    showToast(`Successfully exported ${selectedCandidatesList.length} candidate(s) to CSV.`);
  };

  const handleExportAllFiltered = () => {
    if (filteredCandidates.length === 0) return;
    exportCandidatesToCsv(
      filteredCandidates,
      `all_candidates_${filteredCandidates.length}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    showToast(`Successfully exported ${filteredCandidates.length} candidate(s) to CSV.`);
  };

  // Batch Status Update Submit
  const handleConfirmBatchStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCandidateIds.size === 0) return;

    setBatchProcessing(true);
    try {
      const ids = Array.from(selectedCandidateIds);
      await Promise.all(
        ids.map(candidateId => {
          return hiringEvaluationService.saveEvaluation({
            candidateId,
            status: batchStatusDecision,
            overallRating: batchStatusRating,
            notes: batchStatusNotes.trim() || `Batch evaluation decision updated to ${batchStatusDecision}.`,
            recommendation: `Status set to ${batchStatusDecision} via Admin Batch Operation.`,
            evaluatedBy: 'admin',
            evaluatorName: 'Platform Administrator',
          });
        })
      );

      await loadCandidates();
      setShowBatchStatusModal(false);
      setBatchStatusNotes('');
      showToast(`Successfully updated hiring status for ${ids.length} candidate(s) to "${batchStatusDecision}".`);
      handleClearSelection();
    } catch (err) {
      console.error('[AdminCandidateManagementTab] Batch status update failed:', err);
      showToast('An error occurred during batch status update. Please try again.', 'info');
    } finally {
      setBatchProcessing(false);
    }
  };

  // Batch Assignment Submit
  const handleConfirmBatchAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCandidateIds.size === 0) return;

    setBatchProcessing(true);
    try {
      const ids = Array.from(selectedCandidateIds);
      const deadlineDate = new Date();
      deadlineDate.setDate(deadlineDate.getDate() + Number(batchAssignDeadlineDays));

      await Promise.all(
        ids.map(candidateId => {
          return candidateHiringActionService.saveAssignment({
            candidateId,
            title: batchAssignTitle.trim() || 'Technical Challenge Assessment',
            track: batchAssignTrack,
            difficulty: batchAssignDifficulty,
            questionsCount: Number(batchAssignCount) || 3,
            deadline: deadlineDate.toISOString(),
            instructions: batchAssignInstructions.trim(),
            status: 'Assigned',
            assignedBy: 'Administrator',
          });
        })
      );

      setShowBatchAssignModal(false);
      showToast(`Successfully assigned "${batchAssignTitle}" to ${ids.length} candidate(s).`);
      handleClearSelection();
    } catch (err) {
      console.error('[AdminCandidateManagementTab] Batch assignment failed:', err);
      showToast('An error occurred during batch assignment. Please try again.', 'info');
    } finally {
      setBatchProcessing(false);
    }
  };

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
      {/* Toast Notification Banner */}
      {actionToast && (
        <div className={`admin-batch-toast toast-${actionToast.type}`}>
          <span className="toast-icon">{actionToast.type === 'success' ? '✓' : 'ℹ️'}</span>
          <span className="toast-text">{actionToast.text}</span>
          <button
            type="button"
            className="toast-close"
            onClick={() => setActionToast(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="admin-cand-mgmt-header">
        <div>
          <h2 className="admin-cand-title">Candidate Hiring Management &amp; Evaluations</h2>
          <p className="admin-cand-subtitle">
            Search candidates, inspect multi-attempt code histories, perform bulk CSV exports, batch status updates, and assign take-home challenges.
          </p>
        </div>
        <div className="admin-cand-header-actions">
          <button
            type="button"
            className="admin-cand-export-all-btn"
            onClick={handleExportAllFiltered}
            disabled={loading || filteredCandidates.length === 0}
            title="Download CSV export of all candidates currently shown in table"
          >
            📥 Export All CSV ({filteredCandidates.length})
          </button>
          <button
            type="button"
            className="admin-cand-refresh-btn"
            onClick={loadCandidates}
            disabled={loading}
          >
            🔄 {loading ? 'Refreshing...' : 'Refresh Roster'}
          </button>
        </div>
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
                <th className="admin-cand-th-checkbox" style={{ width: '42px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    className="cand-master-checkbox"
                    checked={isAllFilteredSelected}
                    ref={el => {
                      if (el) el.indeterminate = isSomeFilteredSelected;
                    }}
                    onChange={handleToggleSelectAll}
                    title={isAllFilteredSelected ? 'Deselect all visible candidates' : 'Select all visible candidates'}
                    aria-label="Select all visible candidates"
                  />
                </th>
                <th>Candidate</th>
                <th>Role</th>
                <th style={{ textAlign: 'center' }}>Solved / Att.</th>
                <th>Success %</th>
                <th style={{ textAlign: 'center' }}>Speed</th>
                <th style={{ textAlign: 'center' }} title="Machine Level Coding Score">MC</th>
                <th style={{ textAlign: 'center' }} title="LeetCode & DSA Score">DSA</th>
                <th style={{ textAlign: 'center' }} title="Core Programming Score">Core</th>
                <th>Hiring Status</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map(cand => {
                const isSelected = selectedCandidateIds.has(cand.id);

                return (
                  <tr
                    key={cand.id}
                    onClick={() => navigate(`/admin/candidates/${cand.id}/performance`)}
                    className={`clickable-row ${isSelected ? 'row-selected' : ''}`}
                  >
                    <td
                      className="admin-cand-td-checkbox"
                      onClick={e => {
                        e.stopPropagation();
                      }}
                      style={{ textAlign: 'center' }}
                    >
                      <input
                        type="checkbox"
                        className="cand-row-checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectCandidate(cand.id)}
                        aria-label={`Select candidate ${cand.name}`}
                      />
                    </td>
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
                    <td style={{ textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        background: cand.speedLabel?.includes('Lightning')
                          ? 'rgba(234, 179, 8, 0.15)'
                          : cand.speedLabel?.includes('Fast')
                          ? 'rgba(16, 185, 129, 0.15)'
                          : 'rgba(99, 102, 241, 0.15)',
                        color: cand.speedLabel?.includes('Lightning')
                          ? '#facc15'
                          : cand.speedLabel?.includes('Fast')
                          ? '#34d399'
                          : '#a5b4fc',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}>
                        {cand.speedLabel || '🎯 Steady'}
                      </span>
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Floating / Sticky Batch Actions Toolbar */}
      {selectedCandidateIds.size > 0 && (
        <aside className="admin-batch-toolbar" aria-label="Candidate batch operations toolbar">
          <div className="batch-toolbar-left">
            <span className="batch-toolbar-badge">
              <span className="batch-check-icon">✓</span>
              <strong>{selectedCandidateIds.size}</strong> Candidate{selectedCandidateIds.size > 1 ? 's' : ''} Selected
            </span>
            <span className="batch-toolbar-subtext">
              (of {candidates.length} total)
            </span>
          </div>

          <div className="batch-toolbar-actions">
            <button
              type="button"
              className="batch-action-btn batch-btn-csv"
              onClick={handleExportSelected}
              title="Download CSV file of selected candidate records"
            >
              📥 Export CSV
            </button>

            <button
              type="button"
              className="batch-action-btn batch-btn-status"
              onClick={() => setShowBatchStatusModal(true)}
              title="Update hiring status for all selected candidates"
            >
              ⚖️ Update Status
            </button>

            <button
              type="button"
              className="batch-action-btn batch-btn-assign"
              onClick={() => setShowBatchAssignModal(true)}
              title="Assign a targeted assessment to all selected candidates"
            >
              📋 Assign Assessment
            </button>

            <button
              type="button"
              className="batch-action-btn batch-btn-clear"
              onClick={handleClearSelection}
              title="Clear current selection"
            >
              ✕ Clear
            </button>
          </div>
        </aside>
      )}

      {/* Batch Status Update Modal */}
      {showBatchStatusModal && (
        <div className="admin-cand-modal-backdrop" onClick={() => !batchProcessing && setShowBatchStatusModal(false)}>
          <div className="admin-batch-modal-container" onClick={e => e.stopPropagation()}>
            <div className="admin-batch-modal-header">
              <div className="batch-modal-title-group">
                <h3>⚖️ Batch Update Hiring Status</h3>
                <p>
                  Updating evaluation decision for <strong>{selectedCandidateIds.size}</strong> selected candidate{selectedCandidateIds.size > 1 ? 's' : ''}.
                </p>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => !batchProcessing && setShowBatchStatusModal(false)}
                disabled={batchProcessing}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmBatchStatusUpdate} className="admin-batch-modal-body">
              <div className="admin-field-group">
                <label>Hiring Status Decision *</label>
                <div className="admin-radio-options">
                  {(['Hire', 'Consider', 'Reject', 'Pending'] as HiringStatus[]).map(status => (
                    <label
                      key={status}
                      className={`admin-radio-tile tile-${status.toLowerCase()} ${batchStatusDecision === status ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="batchStatus"
                        value={status}
                        checked={batchStatusDecision === status}
                        onChange={() => {
                          setBatchStatusDecision(status);
                          if (status === 'Hire') setBatchStatusRating(4);
                          else if (status === 'Consider') setBatchStatusRating(3);
                          else if (status === 'Reject') setBatchStatusRating(2);
                          else if (status === 'Pending') setBatchStatusRating(3);
                        }}
                      />
                      <span className="tile-title">
                        {status === 'Hire' && '✓ Hire'}
                        {status === 'Consider' && '⚡ Consider'}
                        {status === 'Reject' && '✕ Reject'}
                        {status === 'Pending' && '⏳ Pending'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="admin-field-group">
                <label>Overall Evaluation Rating ({batchStatusRating} / 5 Stars)</label>
                <div className="batch-rating-stars-row">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`batch-star-btn ${star <= batchStatusRating ? 'active' : ''}`}
                      onClick={() => setBatchStatusRating(star)}
                    >
                      ★
                    </button>
                  ))}
                  <span className="batch-rating-label">
                    {batchStatusRating === 5 && 'Outstanding (Top 5%)'}
                    {batchStatusRating === 4 && 'Strong Candidate'}
                    {batchStatusRating === 3 && 'Meets Baseline Expectations'}
                    {batchStatusRating === 2 && 'Needs Improvement'}
                    {batchStatusRating === 1 && 'Does Not Meet Requirements'}
                  </span>
                </div>
              </div>

              <div className="admin-field-group">
                <label>Batch Decision Notes / Justification (Optional)</label>
                <textarea
                  rows={3}
                  className="admin-cand-textarea"
                  placeholder="e.g. Cleared technical interview loop; proceeding with leadership review."
                  value={batchStatusNotes}
                  onChange={e => setBatchStatusNotes(e.target.value)}
                />
              </div>

              <div className="admin-batch-modal-footer">
                <button
                  type="button"
                  className="admin-batch-cancel-btn"
                  onClick={() => setShowBatchStatusModal(false)}
                  disabled={batchProcessing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-batch-confirm-btn"
                  disabled={batchProcessing}
                >
                  {batchProcessing ? 'Updating Records...' : `Apply Status to ${selectedCandidateIds.size} Candidate${selectedCandidateIds.size > 1 ? 's' : ''}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Assign Assessment Modal */}
      {showBatchAssignModal && (
        <div className="admin-cand-modal-backdrop" onClick={() => !batchProcessing && setShowBatchAssignModal(false)}>
          <div className="admin-batch-modal-container" onClick={e => e.stopPropagation()}>
            <div className="admin-batch-modal-header">
              <div className="batch-modal-title-group">
                <h3>📋 Batch Assign Assessment</h3>
                <p>
                  Deploy a take-home technical challenge bundle to <strong>{selectedCandidateIds.size}</strong> candidate{selectedCandidateIds.size > 1 ? 's' : ''}.
                </p>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => !batchProcessing && setShowBatchAssignModal(false)}
                disabled={batchProcessing}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmBatchAssign} className="admin-batch-modal-body">
              <div className="admin-field-group">
                <label>Challenge Assessment Title *</label>
                <input
                  type="text"
                  required
                  className="admin-cand-input"
                  placeholder="e.g. React High-Order Components & Architecture"
                  value={batchAssignTitle}
                  onChange={e => setBatchAssignTitle(e.target.value)}
                />
              </div>

              <div className="admin-form-split">
                <div className="admin-field-group">
                  <label>Curated Track *</label>
                  <select
                    className="admin-cand-select-field"
                    value={batchAssignTrack}
                    onChange={e => setBatchAssignTrack(e.target.value as any)}
                  >
                    <option value="MACHINE_CODING">Machine Coding (Interactive UI)</option>
                    <option value="DSA">DSA &amp; LeetCode Challenges</option>
                    <option value="CORE_PROGRAMMING">Core Programming &amp; Algorithms</option>
                    <option value="FRONTEND_JS">Frontend &amp; JavaScript Polyfills</option>
                  </select>
                </div>

                <div className="admin-field-group">
                  <label>Target Difficulty *</label>
                  <select
                    className="admin-cand-select-field"
                    value={batchAssignDifficulty}
                    onChange={e => setBatchAssignDifficulty(e.target.value as any)}
                  >
                    <option value="easy">Easy (Fundamentals)</option>
                    <option value="medium">Medium (Standard Industry)</option>
                    <option value="hard">Hard (Senior / Staff Level)</option>
                    <option value="mixed">Mixed Tier Portfolio</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-split">
                <div className="admin-field-group">
                  <label>Number of Challenge Questions *</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    required
                    className="admin-cand-input"
                    value={batchAssignCount}
                    onChange={e => setBatchAssignCount(Number(e.target.value))}
                  />
                </div>

                <div className="admin-field-group">
                  <label>Completion Deadline (Days from Now) *</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    required
                    className="admin-cand-input"
                    value={batchAssignDeadlineDays}
                    onChange={e => setBatchAssignDeadlineDays(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="admin-field-group">
                <label>Candidate Instructions &amp; Evaluation Criteria</label>
                <textarea
                  rows={3}
                  className="admin-cand-textarea"
                  value={batchAssignInstructions}
                  onChange={e => setBatchAssignInstructions(e.target.value)}
                />
              </div>

              <div className="admin-batch-modal-footer">
                <button
                  type="button"
                  className="admin-batch-cancel-btn"
                  onClick={() => setShowBatchAssignModal(false)}
                  disabled={batchProcessing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-batch-confirm-btn btn-assign-primary"
                  disabled={batchProcessing}
                >
                  {batchProcessing ? 'Assigning...' : `Assign to ${selectedCandidateIds.size} Candidate${selectedCandidateIds.size > 1 ? 's' : ''}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
