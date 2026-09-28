import React from 'react';
import type { DashboardView } from './types/dashboardTypes';
import { DASHBOARD_VIEWS } from './types/dashboardTypes';

interface DashboardWorkspaceNavProps {
  activeView: DashboardView;
  onSelectView: (view: DashboardView) => void;
}

export const DashboardWorkspaceNav: React.FC<DashboardWorkspaceNavProps> = ({ activeView, onSelectView }) => {
  const viewsList = Object.values(DASHBOARD_VIEWS);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % viewsList.length;
      onSelectView(viewsList[nextIndex].id);
      const el = document.getElementById(`tab-${viewsList[nextIndex].id}`);
      if (el) el.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + viewsList.length) % viewsList.length;
      onSelectView(viewsList[prevIndex].id);
      const el = document.getElementById(`tab-${viewsList[prevIndex].id}`);
      if (el) el.focus();
    }
  };

  return (
    <nav className="dashboard-workspace-nav" aria-label="Dashboard Workspace Views">
      <div className="workspace-nav-track" role="tablist" aria-orientation="horizontal">
        {viewsList.map((item, index) => {
          const isActive = item.id === activeView;
          return (
            <button
              key={item.id}
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={isActive}
              aria-controls={`workspace-panel-${item.id}`}
              tabIndex={isActive ? 0 : -1}
              className={`workspace-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectView(item.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              type="button"
              title={item.description}
            >
              <span className="nav-btn-icon" aria-hidden="true">{item.icon}</span>
              <span className="nav-btn-label">{item.label}</span>
              {isActive && <span className="nav-btn-indicator" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
