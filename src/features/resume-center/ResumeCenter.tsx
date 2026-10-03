import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/hooks/useAuth'
import CreateResume from './CreateResume'
import ReviewResume from './ReviewResume'
import MyResumes from './MyResumes'
import ResumeVersions from './ResumeVersions'
import './ResumeCenter.css'

type Tab = 'create' | 'review' | 'my-resumes' | 'versions'

const TABS: { key: Tab; label: string }[] = [
  { key: 'create', label: 'Create Resume' },
  { key: 'review', label: 'Review Resume' },
  { key: 'my-resumes', label: 'My Resumes' },
  { key: 'versions', label: 'Resume Versions' },
]

export default function ResumeCenter() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, isLoading: authLoading, openAuthModal } = useAuth()

  const currentTab = useMemo(() => {
    const tab = searchParams.get('tab') as Tab | null
    return tab && TABS.some((t) => t.key === tab) ? tab : 'create'
  }, [searchParams])

  const setTab = (tab: Tab) => {
    const params = new URLSearchParams(searchParams)
    params.set('tab', tab)
    setSearchParams(params, { replace: true })
  }

  if (authLoading) {
    return (
      <div className="resume-center-loading">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="resume-center-auth" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '480px', margin: '40px auto', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📄</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>AI Resume Builder</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Sign in to create, edit, score, and export your role-specific resumes.</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => openAuthModal('user')}
        >
          Sign In / Register
        </button>
      </div>
    )
  }

  return (
    <div className="resume-center page-enter">
      <div className="resume-center-header">
        <h1>AI Resume Center</h1>
        <p>Create, review, and manage your resumes with AI-powered insights.</p>
      </div>

      <div className="resume-center-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`rc-tab ${currentTab === tab.key ? 'active' : ''}`}
            onClick={() => setTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="resume-center-content">
        {currentTab === 'create' && <CreateResume />}
        {currentTab === 'review' && <ReviewResume />}
        {currentTab === 'my-resumes' && <MyResumes />}
        {currentTab === 'versions' && <ResumeVersions resume={null} />}
      </div>
    </div>
  )
}
