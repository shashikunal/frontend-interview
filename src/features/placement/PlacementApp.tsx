import { lazy, Suspense, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/hooks/useAuth'
import type { PlacementView } from './types/placement.types'
import { PLACEMENT_VIEWS } from './types/placement.types'
import './Placement.css'

const PlacementOverview = lazy(() => import('./components/PlacementOverview'))
const PlacementDayPlan = lazy(() => import('./components/PlacementDayPlan'))
const PlacementPractice = lazy(() => import('./components/PlacementPractice'))
const PlacementAssessments = lazy(() => import('./components/PlacementAssessments'))
const PlacementReadiness = lazy(() => import('./components/PlacementReadiness'))
const PlacementMockInterviews = lazy(() => import('./components/PlacementMockInterviews'))
const MockInterviewFlow = lazy(() => import('./components/MockInterviewFlow'))
const PlacementAnalytics = lazy(() => import('./components/PlacementAnalytics'))
const PlacementNotifications = lazy(() => import('./components/PlacementNotifications'))
const ProjectInterviewFlow = lazy(() => import('./components/ProjectInterviewFlow'))
const PlacementProject = lazy(() => import('./components/PlacementProject'))
const PlacementApplications = lazy(() => import('./components/PlacementApplications'))
const PlacementInterviewPrep = lazy(() => import('./components/PlacementInterviewPrep'))
const PlacementMentor = lazy(() => import('./components/PlacementMentor'))
const PlacementAdmin = lazy(() => import('./components/PlacementAdmin'))

interface NavItem {
  view: PlacementView
  label: string
  minRole?: 'interviewer' | 'admin'
}

const NAV_ITEMS: NavItem[] = [
  { view: 'overview', label: 'Home' },
  { view: 'practice', label: 'Practice' },
  { view: 'interview-prep', label: 'Interview Prep' },
  { view: 'assessments', label: 'Assessments' },
  { view: 'mock-interviews', label: 'Mock Interviews' },
  { view: 'readiness', label: 'Readiness' },
  { view: 'applications', label: 'Applications' },
  { view: 'day-plan', label: 'Day Plan' },
  { view: 'project', label: 'Project' },
  { view: 'analytics', label: 'Analytics' },
  { view: 'notifications', label: 'Notifications' },
  { view: 'mock-flow', label: 'Mock Flow' },
  { view: 'project-interview', label: 'Project Defense' },
  { view: 'mentor', label: 'Mentor', minRole: 'interviewer' },
  { view: 'admin', label: 'Admin', minRole: 'admin' },
]

function PlacementLoading() {
  return (
    <div className="placement-empty" role="status" aria-live="polite">
      Loading…
    </div>
  )
}

export default function PlacementApp() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, hasPermission, isLoading } = useAuth()

  const requestedView = (searchParams.get('view') ?? 'overview') as PlacementView
  const view: PlacementView = PLACEMENT_VIEWS.includes(requestedView) ? requestedView : 'overview'

  const visibleItems = useMemo(
    () => NAV_ITEMS.filter((item) => !item.minRole || hasPermission(item.minRole)),
    [hasPermission],
  )

  const selected = visibleItems.find((item) => item.view === view) ?? visibleItems[0]

  const setView = (next: PlacementView) => {
    const params = new URLSearchParams(searchParams)
    params.set('view', next)
    setSearchParams(params, { replace: true })
  }

  if (isLoading) return <PlacementLoading />

  if (!user) {
    return (
      <div className="placement-shell">
        <div className="placement-empty">
          Sign in to access your placement prep. Your progress and readiness are saved to your account.
        </div>
      </div>
    )
  }

  return (
    <div className="placement-shell" data-testid="placement-shell">
      <header className="placement-header">
        <div>
          <h1>Placement Prep</h1>
          <p className="placement-sub">
            30-day program to get you job-ready
          </p>
        </div>
        <div className="placement-day-chip">
          <span aria-hidden="true">🎯</span>
          <span>{user.name || user.email}</span>
        </div>
      </header>

      <nav className="placement-nav" aria-label="Placement sections">
        {visibleItems.map((item) => (
          <button
            key={item.view}
            type="button"
            className={item.view === selected?.view ? 'active' : undefined}
            aria-current={item.view === selected?.view ? 'page' : undefined}
            onClick={() => setView(item.view)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <Suspense fallback={<PlacementLoading />}>
        {selected?.view === 'overview' && <PlacementOverview />}
        {selected?.view === 'day-plan' && <PlacementDayPlan />}
        {selected?.view === 'practice' && <PlacementPractice />}
        {selected?.view === 'assessments' && <PlacementAssessments />}
        {selected?.view === 'readiness' && <PlacementReadiness />}
        {selected?.view === 'mock-interviews' && <PlacementMockInterviews />}
        {selected?.view === 'mock-flow' && <MockInterviewFlow />}
        {selected?.view === 'analytics' && <PlacementAnalytics />}
        {selected?.view === 'notifications' && <PlacementNotifications />}
        {selected?.view === 'project-interview' && <ProjectInterviewFlow />}
        {selected?.view === 'project' && <PlacementProject />}
        {selected?.view === 'applications' && <PlacementApplications />}
        {selected?.view === 'interview-prep' && <PlacementInterviewPrep />}
        {selected?.view === 'mentor' && <PlacementMentor />}
        {selected?.view === 'admin' && <PlacementAdmin />}
      </Suspense>
    </div>
  )
}
