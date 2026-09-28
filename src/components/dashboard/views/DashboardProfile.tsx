import React, { lazy, Suspense } from 'react';
import { SkeletonLoader } from '../../common/SkeletonLoader';

const UserProfile = lazy(() => import('../../profile/UserProfile'));

export const DashboardProfile: React.FC = () => {
  return (
    <div className="dashboard-profile-workspace" id="workspace-panel-profile" role="tabpanel" aria-labelledby="tab-profile">
      <Suspense fallback={<SkeletonLoader variant="profile" />}>
        <UserProfile embedded />
      </Suspense>
    </div>
  );
};
