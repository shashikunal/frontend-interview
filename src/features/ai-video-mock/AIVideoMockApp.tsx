import { Routes, Route, Navigate } from 'react-router-dom';
import AIVideoMockNavbar from './components/AIVideoMockNavbar';
import AIVideoMockHome from './components/pages/AIVideoMockHome';
import MockSetupPage from './components/pages/MockSetupPage';
import MockSessionPage from './components/pages/MockSessionPage';
import MockFinalResultPage from './components/pages/MockFinalResultPage';
import MockHistoryPage from './components/pages/MockHistoryPage';
import MockPracticePage from './components/pages/MockPracticePage';
import MockJobInterviewPage from './components/pages/MockJobInterviewPage';
import MockResumeInterviewPage from './components/pages/MockResumeInterviewPage';
import MockProjectInterviewPage from './components/pages/MockProjectInterviewPage';
import MockQuestionBankPage from './components/pages/MockQuestionBankPage';
import MockSystemAuditPage from './components/pages/MockSystemAuditPage';
import MockSkillsPage from './components/pages/MockSkillsPage';
import MockAnswerImprovementPage from './components/pages/MockAnswerImprovementPage';
import MockAdminAuditPage from './components/pages/MockAdminAuditPage';
import './styles/AIVideoMock.css';

export default function AIVideoMockApp() {
  return (
    <div className="ai-vm-root">
      <AIVideoMockNavbar />
      <main className="ai-vm-main-content">
        <Routes>
          <Route path="/" element={<AIVideoMockHome />} />
          <Route path="/setup" element={<MockSetupPage />} />
          <Route path="/session/:id" element={<MockSessionPage />} />
          <Route path="/session/:sessionId" element={<MockSessionPage />} />
          <Route path="/result/:id" element={<MockFinalResultPage />} />
          <Route path="/result/:sessionId" element={<MockFinalResultPage />} />
          <Route path="/history" element={<MockHistoryPage />} />
          <Route path="/practice" element={<MockPracticePage />} />
          <Route path="/job-interview" element={<MockJobInterviewPage />} />
          <Route path="/resume-interview" element={<MockResumeInterviewPage />} />
          <Route path="/project-interview" element={<MockProjectInterviewPage />} />
          <Route path="/question-bank" element={<MockQuestionBankPage />} />
          <Route path="/system-audit" element={<MockSystemAuditPage />} />
          <Route path="/skills" element={<MockSkillsPage />} />
          <Route path="/improve" element={<MockAnswerImprovementPage />} />
          <Route path="/answer-improvement" element={<MockAnswerImprovementPage />} />
          <Route path="/admin-audit" element={<MockAdminAuditPage />} />
          <Route path="/admin/audit" element={<MockAdminAuditPage />} />
          <Route path="*" element={<Navigate to="/ai-video-mock" replace />} />
        </Routes>
      </main>
    </div>
  );
}
