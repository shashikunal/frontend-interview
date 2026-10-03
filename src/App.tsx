import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { bankTotals, fmtCount } from './data/bankTotals'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './components/home/Home'
import QuestionList from './components/questions/QuestionList'
import QuestionDetail from './components/questions/QuestionDetail'
import QuestionDetailPage from './components/questions/QuestionDetailPage'
import CodingList from './components/coding/CodingList'
import Workspace from './components/workspace/Workspace'
import Videos from './components/videos/Videos'
import Dashboard from './components/dashboard/Dashboard'
import MockInterview from './components/mock/MockInterview'
import VideoMockInterview from './components/mock/VideoMockInterview'
import MachineCodingMock from './components/mock/MachineCodingMock'
import Behavioral from './components/behavioral/Behavioral'
import PeerRoom from './components/peer/PeerRoom'
import UserProfile from './components/profile/UserProfile'
import UserManagementStudio from './components/usermanagement/UserManagementStudio'
import AdminDashboard from './components/dashboard/AdminDashboard'
import { PlacementApp } from './features/placement'
const MachineCodingStudio = lazy(() => import('./components/machinecoding/MachineCodingStudio'))
const DSAStudio = lazy(() => import('./components/dsa/DSAStudio'))
const CoreProgrammingStudio = lazy(() => import('./components/coreprogramming/CoreProgrammingStudio'))
const FrontendJsStudio = lazy(() => import('./components/frontendjs/FrontendJsStudio'))
const AnalyticsDashboard = lazy(() => import('./components/analytics/AnalyticsDashboard'))
const Leaderboard = lazy(() => import('./components/leaderboard/Leaderboard'))
const AIVideoMockApp = lazy(() => import('./features/ai-video-mock/AIVideoMockApp'))
const StudentPerformanceView = lazy(() => import('./features/performance-history/components/student/StudentPerformanceView'))
const DocsPlatform = lazy(() => import('./features/interview-docs/DocsPlatform'))
const MasterQuestionBankApp = lazy(() => import('./features/interview-questions/MasterQuestionBankApp'))
const InstantMeetingLandingPage = lazy(() => import('./features/meetings/components/InstantMeetingLandingPage'))
const MeetingRoom = lazy(() => import('./features/meetings/components/MeetingRoom'))
const MeetingRecordingPage = lazy(() => import('./features/meetings/components/MeetingRecordingPage'))
const AppChatWorkspace = lazy(() => import('./features/chat/components/AppChatWorkspace'))
const ResumeCenter = lazy(() => import('./features/resume-center/ResumeCenter'))
const NotFoundPage = lazy(() => import('./components/common/NotFoundPage'))
import RoleGuard from './components/auth/RoleGuard'
import { useAuth } from './context/AuthContext'
import FeatureGuard from './components/auth/FeatureGuard'
import { ProtectedRoute } from './features/auth'
import AuthModal from './components/auth/AuthModal'
import ScrollToTop from './components/common/ScrollToTop'
import AchievementUnlockToast from './components/badges/AchievementUnlockToast'
import { useBadgeEvaluator } from './hooks/useBadgeEvaluator'
import { DocsCommandPalette } from './features/interview-docs/components/DocsCommandPalette'
import './App.css'

export default function App() {
  const location = useLocation()
  const { user } = useAuth()
  useBadgeEvaluator()

  const isAdminDashboard = location.pathname.startsWith('/admin') || (location.pathname.startsWith('/dashboard') && user?.role === 'admin')
  const isStudioWorkspace =
    (location.pathname.startsWith('/machine-coding') || location.pathname.startsWith('/dsa') || location.pathname.startsWith('/frontend-javascript') || location.pathname.startsWith('/frontend-js') || location.pathname.startsWith('/core-programming') || location.pathname.startsWith('/frontend-programming')) &&
    (Boolean(new URLSearchParams(location.search).get('id')) || location.pathname.startsWith('/dsa/DSA') || location.pathname.startsWith('/dsa/question/') || location.pathname.startsWith('/frontend-javascript/question/') || location.pathname.startsWith('/frontend-javascript/FJP') || location.pathname.startsWith('/frontend-js/question/') || location.pathname.startsWith('/frontend-js/FJP') || location.pathname.startsWith('/core-programming/question/') || location.pathname.startsWith('/core-programming/JS-P') || location.pathname.startsWith('/frontend-programming/question/') || location.pathname.startsWith('/frontend-programming/JS-P'))
  const isAIVideoMockLiveSession = location.pathname.startsWith('/ai-video-mock/session')
  const isDocsPlatform = location.pathname.startsWith('/docs')
  const isMeetingRoom = location.pathname.startsWith('/meet') || location.pathname.startsWith('/meetings')
  const hideHeader = isAdminDashboard || isMeetingRoom
  const hideFooter = isAdminDashboard || isStudioWorkspace || isAIVideoMockLiveSession || isDocsPlatform || isMeetingRoom

  return (
    <div className={`app ${isAdminDashboard ? 'dashboard-layout-mode' : ''} ${isStudioWorkspace ? 'studio-layout-mode' : ''} ${isDocsPlatform ? 'docs-layout-mode' : ''} ${isMeetingRoom ? 'meeting-layout-mode' : ''}`}>
      <ScrollToTop />
      {!hideHeader && <Header />}
      <AuthModal />
      <AchievementUnlockToast />
      <DocsCommandPalette />
      <main className={`main-content ${isAdminDashboard ? 'dashboard-main-content' : ''} ${isStudioWorkspace ? 'studio-main-content' : ''} ${isDocsPlatform ? 'docs-main-content' : ''} ${isMeetingRoom ? 'meeting-main-content' : ''}`}>
        <Suspense fallback={<div className="app-route-loader"><div className="app-route-spinner" /><p>Loading masterclass studio...</p></div>}>
          <div key={location.pathname} className="app-page-transition">
            <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meet" element={<InstantMeetingLandingPage />} />
          <Route path="/meetings" element={<InstantMeetingLandingPage />} />
          <Route path="/meet/:meetingId" element={<MeetingRoom />} />
          <Route path="/meet/:meetingId/recording/:recordingId" element={<MeetingRecordingPage />} />
          <Route path="/meetings/:meetingId/recordings/:recordingId" element={<MeetingRecordingPage />} />
          <Route path="/chat" element={<AppChatWorkspace />} />
          <Route path="/app-chat" element={<AppChatWorkspace />} />
          <Route path="/docs/*" element={<DocsPlatform />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-management"
            element={
              <RoleGuard
                minRole="admin"
                fallbackTitle="🔒 Administrator Access Required"
                fallbackMessage="User Management & Feature Entitlement Studio is restricted to Platform Administrators. Please sign in with an Admin account or request Admin permissions."
              >
                <UserManagementStudio />
              </RoleGuard>
            }
          />
          <Route
            path="/admin"
            element={
              <RoleGuard
                minRole="admin"
                fallbackTitle="🔒 Administrator Access Required"
                fallbackMessage="Enterprise Operations Command Center is restricted to Platform Administrators."
              >
                <AdminDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/:tab"
            element={
              <RoleGuard
                minRole="admin"
                fallbackTitle="🔒 Administrator Access Required"
                fallbackMessage="Enterprise Operations Command Center is restricted to Platform Administrators."
              >
                <AdminDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/candidates/:userId/performance"
            element={
              <RoleGuard
                minRole="admin"
                fallbackTitle="🔒 Administrator Access Required"
                fallbackMessage="Candidate Performance Dossier is restricted to Platform Administrators."
              >
                <AdminDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/candidates/:userId/performance/track/:trackKey"
            element={
              <RoleGuard
                minRole="admin"
                fallbackTitle="🔒 Administrator Access Required"
                fallbackMessage="Candidate Performance Dossier is restricted to Platform Administrators."
              >
                <AdminDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/candidates/:userId/performance/coding/:attemptId"
            element={
              <RoleGuard
                minRole="admin"
                fallbackTitle="🔒 Administrator Access Required"
                fallbackMessage="Candidate Performance Dossier is restricted to Platform Administrators."
              >
                <AdminDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/candidates/:userId/performance/ai-mock/:sessionId"
            element={
              <RoleGuard
                minRole="admin"
                fallbackTitle="🔒 Administrator Access Required"
                fallbackMessage="Candidate Performance Dossier is restricted to Platform Administrators."
              >
                <AdminDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/candidates/:userId/performance"
            element={
              <RoleGuard
                minRole="admin"
                fallbackTitle="🔒 Administrator Access Required"
                fallbackMessage="Candidate Performance Dossier is restricted to Platform Administrators."
              >
                <AdminDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/candidates/:userId/performance/track/:trackKey"
            element={
              <RoleGuard
                minRole="admin"
                fallbackTitle="🔒 Administrator Access Required"
                fallbackMessage="Candidate Performance Dossier is restricted to Platform Administrators."
              >
                <AdminDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/candidates/:userId/performance/mentor-mock/:sessionId"
            element={
              <RoleGuard
                minRole="admin"
                fallbackTitle="🔒 Administrator Access Required"
                fallbackMessage="Candidate Performance Dossier is restricted to Platform Administrators."
              >
                <AdminDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/users/:userId/performance"
            element={
              <RoleGuard
                minRole="admin"
                fallbackTitle="🔒 Administrator Access Required"
                fallbackMessage="Candidate Performance Dossier is restricted to Platform Administrators."
              >
                <AdminDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/users/:userId/performance/track/:trackKey"
            element={
              <RoleGuard
                minRole="admin"
                fallbackTitle="🔒 Administrator Access Required"
                fallbackMessage="Candidate Performance Dossier is restricted to Platform Administrators."
              >
                <AdminDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/users/:userId/performance/coding/:attemptId"
            element={
              <RoleGuard
                minRole="admin"
                fallbackTitle="🔒 Administrator Access Required"
                fallbackMessage="Candidate Performance Dossier is restricted to Platform Administrators."
              >
                <AdminDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/users/:userId/performance/ai-mock/:sessionId"
            element={
              <RoleGuard
                minRole="admin"
                fallbackTitle="🔒 Administrator Access Required"
                fallbackMessage="Candidate Performance Dossier is restricted to Platform Administrators."
              >
                <AdminDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/users/:userId/performance/mentor-mock/:sessionId"
            element={
              <RoleGuard
                minRole="admin"
                fallbackTitle="🔒 Administrator Access Required"
                fallbackMessage="Candidate Performance Dossier is restricted to Platform Administrators."
              >
                <AdminDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/:tab"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/placement"
            element={
              <ProtectedRoute>
                <PlacementApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/placement/:view"
            element={
              <ProtectedRoute>
                <PlacementApp />
              </ProtectedRoute>
            }
          />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route
            path="/my-performance"
            element={
              <ProtectedRoute>
                <StudentPerformanceView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/performance"
            element={
              <ProtectedRoute>
                <StudentPerformanceView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coding-history"
            element={
              <ProtectedRoute>
                <StudentPerformanceView />
              </ProtectedRoute>
            }
          />



            <Route
            path="/resume-center"
            element={
              <ProtectedRoute>
                <ResumeCenter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-center/:tab"
            element={
              <ProtectedRoute>
                <ResumeCenter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-center/edit/:id"
            element={
              <ProtectedRoute>
                <ResumeCenter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-builder"
            element={
              <ProtectedRoute>
                <ResumeCenter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-builder/:tab"
            element={
              <ProtectedRoute>
                <ResumeCenter />
              </ProtectedRoute>
            }
          />

          {/* Practice Labs: Video Masterclass Preserved, others redirected */}
          <Route
            path="/videos"
            element={
              <FeatureGuard featureName="700+ Video Masterclasses">
                <Videos />
              </FeatureGuard>
            }
          />
          <Route path="/flashcards" element={<Navigate to="/videos" replace />} />
          <Route path="/quiz" element={<Navigate to="/videos" replace />} />
          <Route path="/code-review" element={<Navigate to="/videos" replace />} />
          <Route path="/accessibility" element={<Navigate to="/videos" replace />} />
          <Route path="/daily" element={<Navigate to="/videos" replace />} />
          <Route
            path="/coding"
            element={
              <FeatureGuard featureName="Interactive Coding Challenges">
                <CodingList />
              </FeatureGuard>
            }
          />
          <Route
            path="/coding/:id"
            element={
              <FeatureGuard featureName="Interactive Coding Sandbox & Workspace">
                <Workspace />
              </FeatureGuard>
            }
          />

          {/* Mocks */}
          <Route
            path="/mock-coding"
            element={<MachineCodingMock />}
          />
          <Route
            path="/mock-interview"
            element={
              <FeatureGuard featureName="Timed Mock Interview Simulator">
                <MockInterview />
              </FeatureGuard>
            }
          />
          <Route
            path="/video-mock"
            element={
              <FeatureGuard featureName="AI Video Mock Interview">
                <VideoMockInterview />
              </FeatureGuard>
            }
          />
          <Route
            path="/behavioral"
            element={
              <FeatureGuard featureName="FAANG STAR Behavioral Interview Studio">
                <Behavioral />
              </FeatureGuard>
            }
          />
          <Route
            path="/peer-room"
            element={
              <FeatureGuard featureName="Peer-to-Peer Mock Interview Room">
                <PeerRoom />
              </FeatureGuard>
            }
          />

          {/* Questions Bank (15,941 Questions) */}
          <Route
            path="/questions"
            element={
              <FeatureGuard featureName={`${fmtCount(bankTotals.mainBankQuestions)} Questions Bank`}>
                <QuestionList />
              </FeatureGuard>
            }
          />
          <Route
            path="/questions/:id"
            element={
              <FeatureGuard featureName="Question Solution & Walkthrough">
                <QuestionDetail />
              </FeatureGuard>
            }
          />
          <Route
            path="/questions/:id/detail"
            element={
              <FeatureGuard featureName="Question Deep-Dive Detail">
                <QuestionDetailPage />
              </FeatureGuard>
            }
          />

          {/* Frontend Interview Master Question Bank (1,233 Questions) */}
          <Route
            path="/interview-questions/*"
            element={<MasterQuestionBankApp />}
          />

          {/* Machine Coding Masterclass Studio */}
          <Route
            path="/machine-coding"
            element={
              <FeatureGuard featureName="Machine-Level Coding Masterclass">
                <MachineCodingStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/machine-level-coding"
            element={<Navigate to="/machine-coding" replace />}
          />

          {/* DSA System Independent Routes */}
          <Route
            path="/dsa"
            element={
              <FeatureGuard featureName="DSA Masterclass">
                <DSAStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/dsa/questions"
            element={
              <FeatureGuard featureName="DSA Question Catalog">
                <DSAStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/dsa/question/:id"
            element={
              <FeatureGuard featureName="DSA Problem Studio">
                <DSAStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/dsa/progress"
            element={
              <FeatureGuard featureName="DSA Candidate Progress">
                <DSAStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/dsa/bookmarks"
            element={
              <FeatureGuard featureName="DSA Bookmarks">
                <DSAStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/dsa/:id"
            element={
              <FeatureGuard featureName="DSA Problem Studio">
                <DSAStudio />
              </FeatureGuard>
            }
          />

          {/* Frontend JavaScript Programming Isolated Routes */}
          <Route
            path="/frontend-javascript"
            element={
              <FeatureGuard featureName="Frontend JavaScript Programming">
                <FrontendJsStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/frontend-javascript/questions"
            element={
              <FeatureGuard featureName="Frontend JavaScript Catalog">
                <FrontendJsStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/frontend-javascript/question/:id"
            element={
              <FeatureGuard featureName="Frontend JavaScript Studio">
                <FrontendJsStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/frontend-javascript/progress"
            element={
              <FeatureGuard featureName="Frontend JavaScript Progress">
                <FrontendJsStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/frontend-javascript/leaderboard"
            element={
              <FeatureGuard featureName="Frontend JavaScript Leaderboard">
                <FrontendJsStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/frontend-javascript/interview"
            element={
              <FeatureGuard featureName="Frontend JavaScript Interview Mode">
                <FrontendJsStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/frontend-javascript/admin"
            element={
              <RoleGuard minRole="admin">
                <FrontendJsStudio />
              </RoleGuard>
            }
          />
          <Route
            path="/frontend-javascript/:id"
            element={
              <FeatureGuard featureName="Frontend JavaScript Studio">
                <FrontendJsStudio />
              </FeatureGuard>
            }
          />
          <Route path="/frontend-js" element={<Navigate to="/frontend-javascript" replace />} />
          <Route path="/frontend-js/*" element={<Navigate to="/frontend-javascript" replace />} />

          {/* Core Programming Isolated Routes */}
          <Route
            path="/core-programming"
            element={
              <FeatureGuard featureName="Core JavaScript Programming">
                <CoreProgrammingStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/core-programming/questions"
            element={
              <FeatureGuard featureName="Core JavaScript Catalog">
                <CoreProgrammingStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/core-programming/question/:id"
            element={
              <FeatureGuard featureName="Core JavaScript Problem Studio">
                <CoreProgrammingStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/core-programming/:id"
            element={
              <FeatureGuard featureName="Core JavaScript Problem Studio">
                <CoreProgrammingStudio />
              </FeatureGuard>
            }
          />
          <Route path="/frontend-programming" element={<Navigate to="/core-programming" replace />} />
          <Route path="/frontend-programming/*" element={<Navigate to="/core-programming" replace />} />

          {/* AI Video Mock Interview Platform Isolated Module */}
          <Route
            path="/ai-video-mock/*"
            element={<AIVideoMockApp />}
          />

          <Route path="/practice" element={<Navigate to="/questions" replace />} />
          <Route path="/practice/*" element={<Navigate to="/questions" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </div>
        </Suspense>
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}



































