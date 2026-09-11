import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ollamaProvider } from '../services/providers/ollamaProvider';

export default function AIVideoMockNavbar() {
  const location = useLocation();
  const [ollamaStatus, setOllamaStatus] = useState<{ available: boolean; message: string }>({
    available: false,
    message: 'Checking Ollama...',
  });

  useEffect(() => {
    ollamaProvider.isAvailable().then(res => {
      setOllamaStatus({ available: res.available, message: res.statusMessage });
    });
  }, []);

  const navItems = [
    { label: 'Overview', path: '/ai-video-mock' },
    { label: 'Start Interview', path: '/ai-video-mock/setup' },
    { label: 'Practice Weak Areas', path: '/ai-video-mock/practice' },
    { label: 'Improve Answer', path: '/ai-video-mock/improve' },
    { label: 'Job Interview', path: '/ai-video-mock/job-interview' },
    { label: 'Resume Mock', path: '/ai-video-mock/resume-interview' },
    { label: 'Project Mock', path: '/ai-video-mock/project-interview' },
    { label: 'Question Bank', path: '/ai-video-mock/question-bank' },
    { label: 'History', path: '/ai-video-mock/history' },
    { label: 'Skills & Trends', path: '/ai-video-mock/skills' },
    { label: 'System Audit', path: '/ai-video-mock/system-audit' },
    { label: 'Admin Lifecycle', path: '/ai-video-mock/admin-audit' },
  ];

  return (
    <nav className="ai-vm-navbar" aria-label="AI Video Mock Navigation">
      <div className="ai-vm-nav-left">
        <Link to="/ai-video-mock" className="ai-vm-logo-pill">
          <span>🎙️</span>
          <span>AI Video Mock Studio</span>
        </Link>

        <ul className="ai-vm-nav-links">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link to={item.path} className={`ai-vm-nav-link ${isActive ? 'active' : ''}`}>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          className={`ai-vm-provider-chip ${ollamaStatus.available ? 'online' : 'offline'}`}
          title={ollamaStatus.message}
        >
          <span style={{ fontSize: '0.65rem' }}>{ollamaStatus.available ? '🟢' : '🟡'}</span>
          <span>{ollamaStatus.available ? 'Ollama Online' : 'Ollama Offline (Using Rule Engine)'}</span>
        </div>

        <Link to="/ai-video-mock/setup" className="ai-vm-btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
          + New Mock
        </Link>
      </div>
    </nav>
  );
}
