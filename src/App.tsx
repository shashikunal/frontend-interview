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



          <Route path="/experience" element={<ExperienceTracks />} />
          <Route path="/pathways" element={<Pathways />} />
          <Route path="/compensation" element={<Compensation />} />
          <Route path="/resume-optimizer" element={<ResumeOptimizer />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route
            path="/system-design"
            element={
              <FeatureGuard feature="system_design" featureName="System Design Studio">
                <SystemDesignCanvas />
              </FeatureGuard>
            }
          />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route
            path="/ast-explorer"
            element={
              <FeatureGuard feature="compiler_studios" featureName="AST Explorer & Compiler Visualizer">
                <AstExplorer />
              </FeatureGuard>
            }
          />
          <Route path="/security" element={<SecuritySandbox />} />
          <Route path="/state-machine" element={<StateMachine />} />
          <Route path="/capacity-estimator" element={<CapacityEstimator />} />
          <Route path="/memory-profiler" element={<MemoryProfiler />} />
          <Route path="/module-federation" element={<ModuleFederation />} />
          <Route path="/whiteboard" element={<Whiteboard />} />
          <Route path="/protocols" element={<ProtocolPlayground />} />
          <Route path="/css-pipeline" element={<CssPipeline />} />
          <Route
            path="/wasm-lab"
            element={
              <FeatureGuard feature="compiler_studios" featureName="WebAssembly Compiler Studio">
                <WasmLab />
              </FeatureGuard>
            }
          />
          <Route path="/webrtc-lab" element={<WebRtcLab />} />
          <Route path="/local-first" element={<LocalFirstStudio />} />
          <Route path="/design-system" element={<DesignSystemStudio />} />
          <Route path="/i18n-lab" element={<I18nLab />} />
          <Route path="/sdui-lab" element={<SduiLab />} />
          <Route path="/web-components" element={<WebComponentsStudio />} />
          <Route path="/search-engine" element={<SearchEngineStudio />} />
          <Route path="/visualizer" element={<Visualizer />} />
          <Route path="/profiler" element={<Profiler />} />
          <Route path="/code-review" element={<CodeReview />} />
          <Route path="/accessibility" element={<AccessibilityLab />} />
          <Route path="/daily" element={<DailyChallenge />} />
          <Route path="/behavioral" element={<Behavioral />} />
          <Route path="/peer-room" element={<PeerRoom />} />
          <Route path="/mock-interview" element={<MockInterview />} />
          <Route
            path="/video-mock"
            element={
              <FeatureGuard feature="video_mock" featureName="AI Video Mock Interview">
                <VideoMockInterview />
              </FeatureGuard>
            }
          />
          <Route path="/questions" element={<QuestionList />} />


          <Route path="/practice" element={<Navigate to="/questions" replace />} />
          <Route path="/practice/*" element={<Navigate to="/questions" replace />} />
          <Route path="/questions/:id" element={<QuestionDetail />} />
          <Route path="/questions/:id/detail" element={<QuestionDetailPage />} />
          <Route path="/coding" element={<CodingList />} />
          <Route path="/coding/:id" element={<Workspace />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}



































