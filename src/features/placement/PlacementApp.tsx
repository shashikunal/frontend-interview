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
  { view: 'overview', label: 'Overview' },
  { view: 'day-plan', label: 'Day Plan' },
  { view: 'practice', label: 'Practice' },
  { view: 'assessments', label: 'Assessments' },
  { view: 'readiness', label: 'Readiness' },
  { view: 'mock-interviews', label: 'Mock Interviews' },
  { view: 'project', label: 'Project' },
  { view: 'applications', label: 'Applications' },
  { view: 'interview-prep', label: 'Interview Prep' },
  { view: 'mentor', label: 'Mentor', minRole: 'interviewer' },
  { view: 'admin', label: 'Admin', minRole: 'admin' },
]

function PlacementLoading() {
  return (
    <div className="placement-empty" role="status" aria-live="polite">
      Loading placement module…
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
          Sign in to open the 30-Day Placement Program. Your progress, readiness score and
          application tracker are stored against your account.
        </div>
      </div>
    )
  }

  return (
    <div className="placement-shell" data-testid="placement-shell">
      <header className="placement-header">
        <div>
          <h1>30-Day Fresher Placement Program</h1>
          <p className="placement-sub">
            Interview ready → Job ready → Actively applying → Interviewing → Learning from
            rejections → Getting selected
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
        {selected?.view === 'project' && <PlacementProject />}
        {selected?.view === 'applications' && <PlacementApplications />}
        {selected?.view === 'interview-prep' && <PlacementInterviewPrep />}
        {selected?.view === 'mentor' && <PlacementMentor />}
        {selected?.view === 'admin' && <PlacementAdmin />}
      </Suspense>
    </div>
  )
}
