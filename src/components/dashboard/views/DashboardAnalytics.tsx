import React, { lazy, Suspense } from 'react';

const StudentPerformanceView = lazy(() => import('../../../features/performance-history/components/student/StudentPerformanceView'));

export const DashboardAnalytics: React.FC = () => {
  return (
    <div className="dashboard-analytics-workspace" id="workspace-panel-analytics" role="tabpanel" aria-labelledby="tab-analytics">
      <Suspense fallback={
        <div className="analytics-loading-skeleton card-box" style={{ padding: '40px', textAlign: 'center' }}>
          <div className="skeleton skeleton-line" style={{ width: '240px', margin: '0 auto 16px' }} />
          <div className="skeleton skeleton-card" style={{ height: '300px' }} />
        </div>
      }>
        <StudentPerformanceView />
      </Suspense>
    </div>
  );
};
