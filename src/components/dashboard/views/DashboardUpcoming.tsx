import React from 'react';
import StudentMeetingDashboard from '../../../features/meetings/components/StudentMeetingDashboard';

export const DashboardUpcoming: React.FC = () => {
  return (
    <div className="dashboard-upcoming-workspace" id="workspace-panel-upcoming" role="tabpanel" aria-labelledby="tab-upcoming">
      <StudentMeetingDashboard />
    </div>
  );
};
