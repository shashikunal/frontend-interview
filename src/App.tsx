import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './components/home/Home'
import QuestionList from './components/questions/QuestionList'
import QuestionDetail from './components/questions/QuestionDetail'
import QuestionDetailPage from './components/questions/QuestionDetailPage'
import CodingList from './components/coding/CodingList'
import Workspace from './components/workspace/Workspace'
import Videos from './components/videos/Videos'
import Quiz from './components/quiz/Quiz'
import Dashboard from './components/dashboard/Dashboard'
import MockInterview from './components/mock/MockInterview'
import VideoMockInterview from './components/mock/VideoMockInterview'
import SystemDesignCanvas from './components/system-design/SystemDesignCanvas'
import Visualizer from './components/visualizer/Visualizer'
import Pathways from './components/pathways/Pathways'
import Flashcards from './components/flashcards/Flashcards'
import ExperienceTracks from './components/experience/ExperienceTracks'
import Profiler from './components/profiler/Profiler'
import Behavioral from './components/behavioral/Behavioral'
import ResumeOptimizer from './components/resume/ResumeOptimizer'
import PeerRoom from './components/peer/PeerRoom'
import Compensation from './components/compensation/Compensation'
import CodeReview from './components/codereview/CodeReview'
import AccessibilityLab from './components/accessibility/AccessibilityLab'
import CaseStudies from './components/casestudies/CaseStudies'
import DailyChallenge from './components/daily/DailyChallenge'
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
const AnalyticsDashboard = lazy(() => import('./components/analytics/AnalyticsDashboard'))
import RoleGuard from './components/auth/RoleGuard'
import FeatureGuard from './components/auth/FeatureGuard'
import { ProtectedRoute } from './features/auth'
import AuthModal from './components/auth/AuthModal'
import ScrollToTop from './components/common/ScrollToTop'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Header />
      <AuthModal />
      <main className="main-content">
        <Suspense fallback={<div className="app-route-loader"><div className="app-route-spinner" /><p>Loading masterclass studio...</p></div>}>
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />



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

          {/* Practice Labs */}
          <Route
            path="/flashcards"
            element={
              <FeatureGuard feature="questions_full" featureName="Active Recall Flashcards Studio">
                <Flashcards />
              </FeatureGuard>
            }
          />
          <Route
            path="/quiz"
            element={
              <FeatureGuard feature="questions_full" featureName="Practice Quiz Assessments">
                <Quiz />
              </FeatureGuard>
            }
          />
          <Route
            path="/videos"
            element={
              <FeatureGuard feature="questions_full" featureName="700+ Video Masterclasses">
                <Videos />
              </FeatureGuard>
            }
          />
          <Route
            path="/code-review"
            element={
              <FeatureGuard feature="compiler_studios" featureName="AI Static Code Reviewer">
                <CodeReview />
              </FeatureGuard>
            }
          />
          <Route
            path="/accessibility"
            element={
              <FeatureGuard feature="compiler_studios" featureName="Accessibility (a11y) Lab">
                <AccessibilityLab />
              </FeatureGuard>
            }
          />
          <Route
            path="/daily"
            element={
              <FeatureGuard feature="questions_full" featureName="Daily Challenge & Streak">
                <DailyChallenge />
              </FeatureGuard>
            }
          />

          {/* Mocks */}
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

          {/* Questions Bank */}
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

          {/* Coding Challenges */}
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

          <Route path="/practice" element={<Navigate to="/questions" replace />} />
          <Route path="/practice/*" element={<Navigate to="/questions" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}



































