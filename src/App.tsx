import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
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
import SystemDesignCanvas from './components/system-design/SystemDesignCanvas'
import Visualizer from './components/visualizer/Visualizer'
import Pathways from './components/pathways/Pathways'
import ExperienceTracks from './components/experience/ExperienceTracks'
import Profiler from './components/profiler/Profiler'
import Behavioral from './components/behavioral/Behavioral'
import ResumeOptimizer from './components/resume/ResumeOptimizer'
import PeerRoom from './components/peer/PeerRoom'
import Compensation from './components/compensation/Compensation'
import CaseStudies from './components/casestudies/CaseStudies'
import AstExplorer from './components/astexplorer/AstExplorer'
import SecuritySandbox from './components/security/SecuritySandbox'
import StateMachine from './components/statemachine/StateMachine'
import CapacityEstimator from './components/capacity/CapacityEstimator'
import MemoryProfiler from './components/memory/MemoryProfiler'
import ModuleFederation from './components/mfe/ModuleFederation'
import Whiteboard from './components/whiteboard/Whiteboard'
import ProtocolPlayground from './components/protocols/ProtocolPlayground'
import CssPipeline from './components/csspipeline/CssPipeline'
import WasmLab from './components/wasmlab/WasmLab'
import WebRtcLab from './components/webrtclab/WebRtcLab'
import LocalFirstStudio from './components/localfirst/LocalFirstStudio'
import DesignSystemStudio from './components/designsystem/DesignSystemStudio'
import I18nLab from './components/i18nlab/I18nLab'
import SduiLab from './components/sduilab/SduiLab'
import WebComponentsStudio from './components/webcomponents/WebComponentsStudio'
import SearchEngineStudio from './components/searchengine/SearchEngineStudio'
import UserProfile from './components/profile/UserProfile'
import UserManagementStudio from './components/usermanagement/UserManagementStudio'
import AdminDashboard from './components/dashboard/AdminDashboard'
const MachineCodingStudio = lazy(() => import('./components/machinecoding/MachineCodingStudio'))
const DSAStudio = lazy(() => import('./components/dsa/DSAStudio'))
const CoreProgrammingStudio = lazy(() => import('./components/coreprogramming/CoreProgrammingStudio'))
const FrontendJsStudio = lazy(() => import('./components/frontendjs/FrontendJsStudio'))
const AnalyticsDashboard = lazy(() => import('./components/analytics/AnalyticsDashboard'))
const Leaderboard = lazy(() => import('./components/leaderboard/Leaderboard'))
import RoleGuard from './components/auth/RoleGuard'
import { useAuth } from './context/AuthContext'
import FeatureGuard from './components/auth/FeatureGuard'
import { ProtectedRoute } from './features/auth'
import AuthModal from './components/auth/AuthModal'
import ScrollToTop from './components/common/ScrollToTop'
import AchievementUnlockToast from './components/badges/AchievementUnlockToast'
import { useBadgeEvaluator } from './hooks/useBadgeEvaluator'
import './App.css'

export default function App() {
  const location = useLocation()
  const { user } = useAuth()
  useBadgeEvaluator()

  const isAdminDashboard = location.pathname.startsWith('/admin') || (location.pathname.startsWith('/dashboard') && user?.role === 'admin')
  const isStudioWorkspace =
    (location.pathname.startsWith('/machine-coding') || location.pathname.startsWith('/dsa') || location.pathname.startsWith('/frontend-javascript') || location.pathname.startsWith('/frontend-js') || location.pathname.startsWith('/core-programming') || location.pathname.startsWith('/frontend-programming')) &&
    (Boolean(new URLSearchParams(location.search).get('id')) || location.pathname.startsWith('/dsa/DSA') || location.pathname.startsWith('/dsa/question/') || location.pathname.startsWith('/frontend-javascript/question/') || location.pathname.startsWith('/frontend-javascript/FJP') || location.pathname.startsWith('/frontend-js/question/') || location.pathname.startsWith('/frontend-js/FJP') || location.pathname.startsWith('/core-programming/question/') || location.pathname.startsWith('/core-programming/JS-P') || location.pathname.startsWith('/frontend-programming/question/') || location.pathname.startsWith('/frontend-programming/JS-P'))
  const hideHeader = isAdminDashboard
  const hideFooter = isAdminDashboard || isStudioWorkspace

  return (
    <div className={`app ${isAdminDashboard ? 'dashboard-layout-mode' : ''} ${isStudioWorkspace ? 'studio-layout-mode' : ''}`}>
      <ScrollToTop />
      {!hideHeader && <Header />}
      <AuthModal />
      <AchievementUnlockToast />
      <main className={`main-content ${isAdminDashboard ? 'dashboard-main-content' : ''} ${isStudioWorkspace ? 'studio-main-content' : ''}`}>
        <Suspense fallback={<div className="app-route-loader"><div className="app-route-spinner" /><p>Loading masterclass studio...</p></div>}>
          <div key={location.pathname} className="app-page-transition">
            <Routes>
          <Route path="/" element={<Home />} />
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
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />



          {/* Career & Negotiations */}
          <Route
            path="/experience"
            element={
              <FeatureGuard feature="system_design" featureName="0-20y Career Ladder & FAANG Rubrics">
                <ExperienceTracks />
              </FeatureGuard>
            }
          />
          <Route
            path="/pathways"
            element={
              <FeatureGuard feature="system_design" featureName="620+ Company Pathways">
                <Pathways />
              </FeatureGuard>
            }
          />
          <Route
            path="/compensation"
            element={
              <FeatureGuard feature="system_design" featureName="Offer Negotiation & Total Compensation">
                <Compensation />
              </FeatureGuard>
            }
          />
          <Route
            path="/resume-optimizer"
            element={
              <FeatureGuard feature="system_design" featureName="ATS Resume Optimizer">
                <ResumeOptimizer />
              </FeatureGuard>
            }
          />
          <Route
            path="/design-system"
            element={
              <FeatureGuard feature="system_design" featureName="Enterprise Design System & Tokens">
                <DesignSystemStudio />
              </FeatureGuard>
            }
          />

          {/* System Architecture & Labs */}
          <Route
            path="/system-design"
            element={
              <FeatureGuard feature="system_design" featureName="System Design Studio">
                <SystemDesignCanvas />
              </FeatureGuard>
            }
          />
          <Route
            path="/case-studies"
            element={
              <FeatureGuard feature="system_design" featureName="FAANG Architecture Replays & Case Studies">
                <CaseStudies />
              </FeatureGuard>
            }
          />
          <Route
            path="/capacity-estimator"
            element={
              <FeatureGuard feature="system_design" featureName="Capacity Sizing Estimator">
                <CapacityEstimator />
              </FeatureGuard>
            }
          />
          <Route
            path="/whiteboard"
            element={
              <FeatureGuard feature="system_design" featureName="Collaborative Architecture Whiteboard">
                <Whiteboard />
              </FeatureGuard>
            }
          />
          <Route
            path="/webrtc-lab"
            element={
              <FeatureGuard feature="system_design" featureName="WebRTC & ICE Signaling Lab">
                <WebRtcLab />
              </FeatureGuard>
            }
          />
          <Route
            path="/local-first"
            element={
              <FeatureGuard feature="system_design" featureName="Local-First & Offline Sync Studio">
                <LocalFirstStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/search-engine"
            element={
              <FeatureGuard feature="system_design" featureName="Client Search Engine & BM25 Studio">
                <SearchEngineStudio />
              </FeatureGuard>
            }
          />

          {/* Compilers & Micro-Frontends */}
          <Route
            path="/ast-explorer"
            element={
              <FeatureGuard feature="compiler_studios" featureName="AST Explorer & Compiler Visualizer">
                <AstExplorer />
              </FeatureGuard>
            }
          />
          <Route
            path="/module-federation"
            element={
              <FeatureGuard feature="compiler_studios" featureName="Micro-Frontends & Module Federation Studio">
                <ModuleFederation />
              </FeatureGuard>
            }
          />
          <Route
            path="/state-machine"
            element={
              <FeatureGuard feature="compiler_studios" featureName="State Machine & XState Studio">
                <StateMachine />
              </FeatureGuard>
            }
          />
          <Route
            path="/protocols"
            element={
              <FeatureGuard feature="compiler_studios" featureName="API Protocols & GraphQL Playground">
                <ProtocolPlayground />
              </FeatureGuard>
            }
          />
          <Route
            path="/wasm-lab"
            element={
              <FeatureGuard feature="compiler_studios" featureName="WebAssembly Compiler Studio">
                <WasmLab />
              </FeatureGuard>
            }
          />
          <Route
            path="/sdui-lab"
            element={
              <FeatureGuard feature="compiler_studios" featureName="Server-Driven UI & RSC Studio">
                <SduiLab />
              </FeatureGuard>
            }
          />
          <Route
            path="/web-components"
            element={
              <FeatureGuard feature="compiler_studios" featureName="Shadow DOM & Web Components Studio">
                <WebComponentsStudio />
              </FeatureGuard>
            }
          />

          {/* Security & Performance */}
          <Route
            path="/security"
            element={
              <FeatureGuard feature="system_design" featureName="Web Security & OWASP Sandbox">
                <SecuritySandbox />
              </FeatureGuard>
            }
          />
          <Route
            path="/memory-profiler"
            element={
              <FeatureGuard feature="system_design" featureName="Memory & V8 Heap Profiler">
                <MemoryProfiler />
              </FeatureGuard>
            }
          />
          <Route
            path="/profiler"
            element={
              <FeatureGuard feature="system_design" featureName="Performance Profiler Lab">
                <Profiler />
              </FeatureGuard>
            }
          />
          <Route
            path="/visualizer"
            element={
              <FeatureGuard feature="system_design" featureName="Event Loop & React Fiber Concurrency Visualizer">
                <Visualizer />
              </FeatureGuard>
            }
          />
          <Route
            path="/css-pipeline"
            element={
              <FeatureGuard feature="system_design" featureName="CSS Render Pipeline Studio">
                <CssPipeline />
              </FeatureGuard>
            }
          />
          <Route
            path="/i18n-lab"
            element={
              <FeatureGuard feature="system_design" featureName="i18n & RTL Studio">
                <I18nLab />
              </FeatureGuard>
            }
          />

          {/* Practice Labs: Video Masterclass Preserved, others redirected */}
          <Route
            path="/videos"
            element={
              <FeatureGuard feature="questions_full" featureName="700+ Video Masterclasses">
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
              <FeatureGuard feature="coding_sandbox" featureName="Interactive Coding Challenges">
                <CodingList />
              </FeatureGuard>
            }
          />
          <Route
            path="/coding/:id"
            element={
              <FeatureGuard feature="coding_sandbox" featureName="Interactive Coding Sandbox & Workspace">
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
              <FeatureGuard feature="video_mock" featureName="Timed Mock Interview Simulator">
                <MockInterview />
              </FeatureGuard>
            }
          />
          <Route
            path="/video-mock"
            element={
              <FeatureGuard feature="video_mock" featureName="AI Video Mock Interview">
                <VideoMockInterview />
              </FeatureGuard>
            }
          />
          <Route
            path="/behavioral"
            element={
              <FeatureGuard feature="video_mock" featureName="FAANG STAR Behavioral Interview Studio">
                <Behavioral />
              </FeatureGuard>
            }
          />
          <Route
            path="/peer-room"
            element={
              <FeatureGuard feature="video_mock" featureName="Peer-to-Peer Mock Interview Room">
                <PeerRoom />
              </FeatureGuard>
            }
          />

          {/* Questions Bank (22,222+ Questions) */}
          <Route
            path="/questions"
            element={
              <FeatureGuard feature="questions_full" featureName="22,222 Questions Bank">
                <QuestionList />
              </FeatureGuard>
            }
          />
          <Route
            path="/questions/:id"
            element={
              <FeatureGuard feature="questions_full" featureName="Question Solution & Walkthrough">
                <QuestionDetail />
              </FeatureGuard>
            }
          />
          <Route
            path="/questions/:id/detail"
            element={
              <FeatureGuard feature="questions_full" featureName="Question Deep-Dive Detail">
                <QuestionDetailPage />
              </FeatureGuard>
            }
          />

          {/* Machine Coding Masterclass Studio */}
          <Route
            path="/machine-coding"
            element={
              <FeatureGuard feature="coding_sandbox" featureName="Machine-Level Coding Masterclass">
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
              <FeatureGuard feature="coding_sandbox" featureName="DSA Masterclass">
                <DSAStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/dsa/questions"
            element={
              <FeatureGuard feature="coding_sandbox" featureName="DSA Question Catalog">
                <DSAStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/dsa/question/:id"
            element={
              <FeatureGuard feature="coding_sandbox" featureName="DSA Problem Studio">
                <DSAStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/dsa/progress"
            element={
              <FeatureGuard feature="coding_sandbox" featureName="DSA Candidate Progress">
                <DSAStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/dsa/bookmarks"
            element={
              <FeatureGuard feature="coding_sandbox" featureName="DSA Bookmarks">
                <DSAStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/dsa/:id"
            element={
              <FeatureGuard feature="coding_sandbox" featureName="DSA Problem Studio">
                <DSAStudio />
              </FeatureGuard>
            }
          />

          {/* Frontend JavaScript Programming Isolated Routes */}
          <Route
            path="/frontend-javascript"
            element={
              <FeatureGuard feature="coding_sandbox" featureName="Frontend JavaScript Programming">
                <FrontendJsStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/frontend-javascript/questions"
            element={
              <FeatureGuard feature="coding_sandbox" featureName="Frontend JavaScript Catalog">
                <FrontendJsStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/frontend-javascript/question/:id"
            element={
              <FeatureGuard feature="coding_sandbox" featureName="Frontend JavaScript Studio">
                <FrontendJsStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/frontend-javascript/progress"
            element={
              <FeatureGuard feature="coding_sandbox" featureName="Frontend JavaScript Progress">
                <FrontendJsStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/frontend-javascript/leaderboard"
            element={
              <FeatureGuard feature="coding_sandbox" featureName="Frontend JavaScript Leaderboard">
                <FrontendJsStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/frontend-javascript/interview"
            element={
              <FeatureGuard feature="coding_sandbox" featureName="Frontend JavaScript Interview Mode">
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
              <FeatureGuard feature="coding_sandbox" featureName="Frontend JavaScript Studio">
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
              <FeatureGuard feature="coding_sandbox" featureName="Core JavaScript Programming">
                <CoreProgrammingStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/core-programming/questions"
            element={
              <FeatureGuard feature="coding_sandbox" featureName="Core JavaScript Catalog">
                <CoreProgrammingStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/core-programming/question/:id"
            element={
              <FeatureGuard feature="coding_sandbox" featureName="Core JavaScript Problem Studio">
                <CoreProgrammingStudio />
              </FeatureGuard>
            }
          />
          <Route
            path="/core-programming/:id"
            element={
              <FeatureGuard feature="coding_sandbox" featureName="Core JavaScript Problem Studio">
                <CoreProgrammingStudio />
              </FeatureGuard>
            }
          />
          <Route path="/frontend-programming" element={<Navigate to="/core-programming" replace />} />
          <Route path="/frontend-programming/*" element={<Navigate to="/core-programming" replace />} />

          <Route path="/practice" element={<Navigate to="/questions" replace />} />
          <Route path="/practice/*" element={<Navigate to="/questions" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </div>
        </Suspense>
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}



































