import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import type { MCQuestion } from '../../machinecoding/machineCodingQuestions'
import { MACHINE_CODING_CATALOG, getQuestionDetailById } from '../../machinecoding/lib/mcCatalogService'
import { DSA_QUESTIONS } from '../../dsa/data/dsaQuestions'
import { CORE_PROGRAMMING_QUESTIONS } from '../../coreprogramming/data/coreProgrammingQuestions'
import { FRONTEND_JS_QUESTIONS } from '../../frontendjs/data/frontendJsQuestions'
import {
  questionManagementService,
  type CustomMCQuestion,
  type CustomMCQuestionDraft,
} from '../../../lib/questionManagementService'
import AdminQuestionFormModal from './AdminQuestionFormModal'
import AdminQuestionPreviewModal from './AdminQuestionPreviewModal'

export type TrackViewTab = 'mc' | 'dsa' | 'cp' | 'fjs' | 'custom'

const DIFF_COLOR: Record<string, string> = {
  Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444', Difficult: '#ef4444', Senior: '#a855f7', Expert: '#a855f7',
}

const CAT_COLOR: Record<string, string> = {
  ReactJS: '#38bdf8', JavaScript: '#fbbf24', TypeScript: '#818cf8',
  'React Redux Toolkit': '#ec4899', 'React Query': '#34d399', DOM: '#fb923c', LeetCode: '#22c55e',
  Arrays: '#38bdf8', Strings: '#fbbf24', 'Two Pointers': '#818cf8', Trees: '#ec4899',
  Graphs: '#34d399', 'Dynamic Programming': '#fb923c', 'Binary Search': '#22c55e',
}

function DiffBadge({ diff }: { diff: string }) {
  const norm = diff || 'Medium'
  const color = DIFF_COLOR[norm] ?? '#94a3b8'
  return (
    <span style={{
      background: `${color}18`,
      color: color,
      border: `1px solid ${color}40`,
      borderRadius: 6, padding: '2px 9px', fontSize: '0.72rem', fontWeight: 700,
    }}>{norm}</span>
  )
}

function CatBadge({ cat }: { cat: string }) {
  const norm = cat || 'General'
  const color = CAT_COLOR[norm] ?? '#94a3b8'
  return (
    <span style={{
      background: `${color}18`,
      color: color,
      border: `1px solid ${color}35`,
      borderRadius: 6, padding: '2px 9px', fontSize: '0.72rem', fontWeight: 600,
    }}>{norm}</span>
  )
}

function IconBtn({
  title, emoji, onClick, danger = false,
}: { title: string; emoji: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        background: danger ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${danger ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.1)'}`,
        color: danger ? '#ef4444' : '#94a3b8',
        borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
        fontSize: '0.82rem', transition: 'all 0.15s',
      }}
    >{emoji}</button>
  )
}

interface UnifiedQuestionRow {
  id: string
  title: string
  category: string
  difficulty: string
  timeEstimate: string
  studioUrl: string
  testCount: number
  trackTag: string
  raw: any
}

export default function AdminQuestionsTab() {
  const [viewTab, setViewTab] = useState<TrackViewTab>('mc')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [difficultyFilter, setDifficultyFilter] = useState('ALL')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 25

  // Custom questions state
  const [customList, setCustomList] = useState<CustomMCQuestion[]>([])
  const [toast, setToast] = useState<string | null>(null)

  // Modal state
  const [formTarget, setFormTarget] = useState<CustomMCQuestion | null | 'new'>(null)
  const [previewTarget, setPreviewTarget] = useState<MCQuestion | CustomMCQuestion | null>(null)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, categoryFilter, difficultyFilter, viewTab])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const loadCustom = useCallback(async () => {
    try {
      const list = await questionManagementService.list()
      setCustomList(list)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => { void loadCustom() }, [loadCustom])

  // Map each track into unified items
  const activeDataset = useMemo<UnifiedQuestionRow[]>(() => {
    if (viewTab === 'mc') {
      return MACHINE_CODING_CATALOG.map(q => ({
        id: q.id,
        title: q.title,
        category: q.category,
        difficulty: q.difficulty,
        timeEstimate: q.timeEstimate || '45 mins',
        studioUrl: `/machine-coding?id=${q.id}`,
        testCount: (q as any).testCases?.length || 4,
        trackTag: 'Machine Coding',
        raw: q,
      }))
    }
    if (viewTab === 'dsa') {
      return DSA_QUESTIONS.map(q => ({
        id: q.id,
        title: q.title,
        category: q.topic || (q.tags && q.tags[0]) || 'Algorithms',
        difficulty: q.difficulty === 'Difficult' ? 'Hard' : q.difficulty,
        timeEstimate: '30 mins',
        studioUrl: `/dsa/question/${q.id}`,
        testCount: q.examples?.length || 3,
        trackTag: 'DSA Masterclass',
        raw: q,
      }))
    }
    if (viewTab === 'cp') {
      return CORE_PROGRAMMING_QUESTIONS.map(q => ({
        id: q.id,
        title: q.title,
        category: q.category || 'JavaScript Core',
        difficulty: q.difficulty === 'Expert' ? 'Hard' : q.difficulty,
        timeEstimate: '25 mins',
        studioUrl: `/core-programming/question/${q.id}`,
        testCount: q.testCases?.length || 3,
        trackTag: 'Core Programming',
        raw: q,
      }))
    }
    if (viewTab === 'fjs') {
      return FRONTEND_JS_QUESTIONS.map(q => ({
        id: q.id,
        title: q.title,
        category: q.category || 'Web APIs & DOM',
        difficulty: q.difficulty,
        timeEstimate: '20 mins',
        studioUrl: `/frontend-javascript/question/${q.id}`,
        testCount: q.testCases?.length || 4,
        trackTag: 'Frontend JS',
        raw: q,
      }))
    }
    // Custom questions
    return customList.map(q => ({
      id: q.id,
      title: q.title,
      category: q.category,
      difficulty: q.difficulty,
      timeEstimate: q.timeEstimate || '45 mins',
      studioUrl: `/machine-coding?id=${q.id}`,
      testCount: (q as any).testCases?.length || 2,
      trackTag: 'Custom',
      raw: q,
    }))
  }, [viewTab, customList])

  // Derive categories from active dataset
  const categoryOptions = useMemo(() => {
    return Array.from(new Set(activeDataset.map(q => q.category))).filter(Boolean).sort()
  }, [activeDataset])

  // Filter active dataset
  const filteredDataset = useMemo(() => {
    const s = search.trim().toLowerCase()
    return activeDataset.filter(q => {
      let matchesSearch = true
      if (s) {
        matchesSearch = q.id.toLowerCase().includes(s) || q.title.toLowerCase().includes(s) || q.category.toLowerCase().includes(s)
      }
      const matchesCat = categoryFilter === 'ALL' || q.category === categoryFilter
      const matchesDiff = difficultyFilter === 'ALL' || q.difficulty === difficultyFilter
      return matchesSearch && matchesCat && matchesDiff
    })
  }, [activeDataset, search, categoryFilter, difficultyFilter])

  // Pagination
  const totalItems = filteredDataset.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredDataset.slice(start, start + pageSize)
  }, [filteredDataset, currentPage, pageSize])

  const handleOpenPreview = (item: UnifiedQuestionRow) => {
    if (viewTab === 'mc') {
      setPreviewTarget(getQuestionDetailById(item.id) || item.raw)
    } else if (viewTab === 'custom') {
      setPreviewTarget(item.raw)
    } else {
      window.open(item.studioUrl, '_blank')
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 2000,
          background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(99,102,241,0.4)',
          borderRadius: 12, padding: '12px 20px', color: '#e2e8f0',
          fontSize: '0.88rem', fontWeight: 500,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          {toast}
        </div>
      )}

      <div className="card-box" style={{ padding: '28px 28px 0' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: '0 0 4px', color: 'var(--h-text-white)', fontSize: '1.05rem', fontWeight: 700 }}>
              Question Bank &amp; Curriculum Management
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--h-text-muted)' }}>
              Explore and manage challenges across all 4 programming tracks (3,000 total challenge modules)
            </p>
          </div>
          {viewTab === 'custom' && (
            <button
              type="button"
              id="aqm-create-btn"
              onClick={() => setFormTarget('new')}
              style={{
                background: 'linear-gradient(135deg,#4f46e5,#6366f1)',
                color: '#fff', border: 'none', borderRadius: 10,
                padding: '9px 18px', fontWeight: 700, fontSize: '0.88rem',
                cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              ➕ Create New Question
            </button>
          )}
        </div>

        {/* 5 Track Sub-tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid rgba(255,255,255,0.07)', overflowX: 'auto' }}>
          {[
            { id: 'mc' as const, label: `⚡ Machine Coding (${MACHINE_CODING_CATALOG.length})` },
            { id: 'dsa' as const, label: `📐 DSA Masterclass (${DSA_QUESTIONS.length})` },
            { id: 'cp' as const, label: `💻 Core Programming (${CORE_PROGRAMMING_QUESTIONS.length})` },
            { id: 'fjs' as const, label: `🌐 Frontend JS (${FRONTEND_JS_QUESTIONS.length})` },
            { id: 'custom' as const, label: `✏️ Custom Questions (${customList.length})` },
          ].map(t => (
            <button
              key={t.id}
              type="button"
              id={`aqm-tab-${t.id}`}
              onClick={() => setViewTab(t.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: viewTab === t.id ? '2px solid #6366f1' : '2px solid transparent',
                color: viewTab === t.id ? '#a5b4fc' : '#94a3b8',
                padding: '10px 16px',
                fontSize: '0.85rem',
                fontWeight: viewTab === t.id ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card-box" style={{ marginTop: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: 'none' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20, paddingTop: 20 }}>
          <input
            type="text"
            className="search-field"
            placeholder="Search by ID or title…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: '1 1 200px', minWidth: 180 }}
          />
          <select
            className="role-dropdown"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="ALL">All Categories ({categoryOptions.length})</option>
            {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            className="role-dropdown"
            value={difficultyFilter}
            onChange={e => setDifficultyFilter(e.target.value)}
          >
            <option value="ALL">All Difficulties</option>
            {['Easy', 'Medium', 'Hard'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {(search || categoryFilter !== 'ALL' || difficultyFilter !== 'ALL') && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => { setSearch(''); setCategoryFilter('ALL'); setDifficultyFilter('ALL') }}
            >✕ Reset</button>
          )}
        </div>

        {/* Question Table */}
        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th style={{ width: 90 }}>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th style={{ width: 90 }}>Difficulty</th>
                <th style={{ width: 90 }}>Est. Time</th>
                <th style={{ width: 95 }}>Tests / Specs</th>
                <th style={{ width: 110, textAlign: 'center' }}>Studio Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDataset.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--h-text-muted)' }}>
                    🔍 No questions match the current filters.
                  </td>
                </tr>
              ) : (
                paginatedItems.map(q => (
                  <tr key={q.id}>
                    <td>
                      <span style={{
                        background: 'rgba(99,102,241,0.15)',
                        color: '#818cf8',
                        border: '1px solid rgba(99,102,241,0.3)',
                        borderRadius: 6, padding: '2px 8px',
                        fontSize: '0.75rem', fontWeight: 700,
                      }}>{q.id}</span>
                    </td>
                    <td style={{ color: 'var(--h-text-white)', fontWeight: 500, fontSize: '0.88rem' }}>{q.title}</td>
                    <td><CatBadge cat={q.category} /></td>
                    <td><DiffBadge diff={q.difficulty} /></td>
                    <td style={{ color: 'var(--h-text-muted)', fontSize: '0.82rem' }}>{q.timeEstimate}</td>
                    <td>
                      <span style={{
                        background: 'rgba(56,189,248,0.12)',
                        color: '#38bdf8',
                        border: '1px solid rgba(56,189,248,0.25)',
                        borderRadius: 6,
                        padding: '2px 7px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                      }}>
                        {q.testCount} Tests
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <Link
                        to={q.studioUrl}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.75rem', textDecoration: 'none', marginRight: 4 }}
                        target="_blank"
                      >
                        🚀 Open
                      </Link>
                      {(viewTab === 'mc' || viewTab === 'custom') && (
                        <IconBtn
                          title="Preview question spec"
                          emoji="👁️"
                          onClick={() => handleOpenPreview(q)}
                        />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, padding: '12px 0', borderTop: '1px solid var(--h-border)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--h-text-muted)' }}>
              Showing {((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, totalItems)} of {totalItems.toLocaleString()} questions
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                ◀ Prev
              </button>
              <span style={{ padding: '4px 10px', fontSize: '0.8rem', color: 'var(--h-text-white)', alignSelf: 'center' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                Next ▶
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTarget && (
        <AdminQuestionPreviewModal
          question={previewTarget}
          onClose={() => setPreviewTarget(null)}
          onEdit={viewTab === 'custom' ? () => {
            const current = previewTarget as CustomMCQuestion
            setPreviewTarget(null)
            setFormTarget(current)
          } : undefined}
        />
      )}

      {/* Form Modal */}
      {formTarget && (
        <AdminQuestionFormModal
          initial={formTarget === 'new' ? null : formTarget}
          onClose={() => setFormTarget(null)}
          onSave={async (draft: CustomMCQuestionDraft) => {
            if (formTarget === 'new') {
              await questionManagementService.create(draft)
              showToast('New question created successfully.')
            } else {
              await questionManagementService.update(formTarget.id, draft)
              showToast(`Question ${formTarget.id} updated successfully.`)
            }
            setFormTarget(null)
            void loadCustom()
          }}
        />
      )}
    </div>
  )
}
