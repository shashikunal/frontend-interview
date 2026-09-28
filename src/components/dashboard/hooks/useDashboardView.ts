import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { DashboardView } from '../types/dashboardTypes';
import { DEFAULT_DASHBOARD_VIEW } from '../types/dashboardTypes';

const VIEW_MAPPING: Record<string, DashboardView> = {
  overview: 'overview',
  activity: 'activity',
  submissions: 'activity',
  audit: 'activity',
  progress: 'progress',
  syllabus: 'progress',
  docs: 'progress',
  documentation: 'progress',
  analytics: 'analytics',
  performance: 'analytics',
  history: 'analytics',
  coding_history: 'analytics',
  'coding-history': 'analytics',
  rankings: 'analytics',
  leaderboard: 'analytics',
  upcoming: 'upcoming',
  meetings: 'upcoming',
  meeting_ops: 'upcoming',
  'meeting-ops': 'upcoming',
  profile: 'profile',
  user_profile: 'profile',
  'user-profile': 'profile',
  account: 'profile',
  settings: 'profile',
};

export function useDashboardView() {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawView = searchParams.get('view') || searchParams.get('tab');
  const normalizedKey = rawView ? rawView.trim().toLowerCase() : '';
  const currentView: DashboardView = VIEW_MAPPING[normalizedKey] || DEFAULT_DASHBOARD_VIEW;

  // Auto-normalize invalid parameters or legacy 'tab' parameter in URL
  const isInvalid = Boolean(rawView && !VIEW_MAPPING[normalizedKey]);
  const hasLegacyTab = searchParams.has('tab');

  useEffect(() => {
    if (isInvalid || hasLegacyTab) {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.set('view', currentView);
        if (next.has('tab')) next.delete('tab');
        return next;
      }, { replace: true });
    }
  }, [isInvalid, hasLegacyTab, currentView, setSearchParams]);

  const setView = (view: DashboardView, extraParams?: Record<string, string>) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('view', view);
      if (next.has('tab')) next.delete('tab');
      if (extraParams) {
        Object.entries(extraParams).forEach(([k, v]) => {
          if (v) next.set(k, v);
          else next.delete(k);
        });
      }
      return next;
    }, { replace: false });
  };

  return { currentView, setView };
}
