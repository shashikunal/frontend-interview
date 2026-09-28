export type DashboardView = 'overview' | 'activity' | 'progress' | 'analytics' | 'upcoming' | 'profile';

export interface DashboardViewConfig {
  id: DashboardView;
  label: string;
  icon: string;
  badge?: string;
  description: string;
}

export const DASHBOARD_VIEWS: Record<DashboardView, DashboardViewConfig> = {
  overview: {
    id: 'overview',
    label: 'Overview',
    icon: '📊',
    description: 'Workspace summary, key metrics & quick launcher',
  },
  activity: {
    id: 'activity',
    label: 'Activity',
    icon: '⚡',
    description: 'Candidate code submissions & verification audit log',
  },
  progress: {
    id: 'progress',
    label: 'Progress',
    icon: '📚',
    description: '21-Track syllabus mastery & studio solve completion',
  },
  analytics: {
    id: 'analytics',
    label: 'Analytics',
    icon: '📈',
    description: 'Assessment telemetry, velocity & technical readiness',
  },
  upcoming: {
    id: 'upcoming',
    label: 'Upcoming',
    icon: '📅',
    description: 'Live interview sessions & scheduled assessments',
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    icon: '👤',
    description: 'User settings, study targets, and candidate achievements',
  },
};

export const DEFAULT_DASHBOARD_VIEW: DashboardView = 'overview';
