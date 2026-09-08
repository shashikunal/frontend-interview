import { useState, useEffect, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { MACHINE_CODING_QUESTIONS, type MCQuestion } from '../../machinecoding/machineCodingQuestions'
import {
  questionManagementService,
  type CustomMCQuestion,
  type CustomMCQuestionDraft,
} from '../../../lib/questionManagementService'
import AdminQuestionFormModal from './AdminQuestionFormModal'
import AdminQuestionPreviewModal from './AdminQuestionPreviewModal'

type ViewTab = 'builtin' | 'custom'

const DIFF_COLOR: Record<string, string> = {
  Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444', Senior: '#a855f7',
}

const CAT_COLOR: Record<string, string> = {
  ReactJS: '#38bdf8', JavaScript: '#fbbf24', TypeScript: '#818cf8',
  'React Redux Toolkit': '#ec4899', 'React Query': '#34d399', DOM: '#fb923c', LeetCode: '#22c55e',
}

function DiffBadge({ diff }: { diff: string }) {
  return (
    <span style={{
      background: `${DIFF_COLOR[diff] ?? '#94a3b8'}18`,
      color: DIFF_COLOR[diff] ?? '#94a3b8',
      border: `1px solid ${DIFF_COLOR[diff] ?? '#94a3b8'}40`,
      borderRadius: 6, padding: '2px 9px', fontSize: '0.72rem', fontWeight: 700,
    }}>{diff}</span>
  )
}

function CatBadge({ cat }: { cat: string }) {
  return (
    <span style={{
      background: `${CAT_COLOR[cat] ?? '#94a3b8'}18`,
      color: CAT_COLOR[cat] ?? '#94a3b8',
      border: `1px solid ${CAT_COLOR[cat] ?? '#94a3b8'}35`,
      borderRadius: 6, padding: '2px 9px', fontSize: '0.72rem', fontWeight: 600,
    }}>{cat}</span>
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

export default function AdminQuestionsTab() {
  const [viewTab, setViewTab] = useState<ViewTab>('builtin')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [difficultyFilter, setDifficultyFilter] = useState('ALL')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, categoryFilter, difficultyFilter, viewTab])

  // Custom questions state
  const [customList, setCustomList] = useState<CustomMCQuestion[]>([])
  const [loadingCustom, setLoadingCustom] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Modal state
  const [formTarget, setFormTarget] = useState<CustomMCQuestion | null | 'new'>(null)
  const [previewTarget, setPreviewTarget] = useState<MCQuestion | CustomMCQuestion | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const loadCustom = useCallback(async () => {
    setLoadingCustom(true)
    try {
      const list = await questionManagementService.list()
      setCustomList(list)
    } finally {
      setLoadingCustom(false)
    }
  }, [])

  useEffect(() => { void loadCustom() }, [loadCustom])

  /* ---- Filtering for built-in catalog ---- */
  const filteredBuiltin = useMemo(() => {
    return MACHINE_CODING_QUESTIONS.filter(q => {
      const matchesSearch =
        !search ||
        q.id.toLowerCase().includes(search.toLowerCase()) ||
        q.title.toLowerCase().includes(search.toLowerCase())
      const matchesCat = categoryFilter === 'ALL' || q.category === categoryFilter
      const matchesDiff = difficultyFilter === 'ALL' || q.difficulty === difficultyFilter
      return matchesSearch && matchesCat && matchesDiff
    })
  }, [search, categoryFilter, difficultyFilter])

  /* ---- Filtering for custom questions ---- */
  const filteredCustom = useMemo(() => {
    return customList.filter(q => {
      const matchesSearch =
        !search ||
        q.id.toLowerCase().includes(search.toLowerCase()) ||
        q.title.toLowerCase().includes(search.toLowerCase())
      const matchesCat = categoryFilter === 'ALL' || q.category === categoryFilter
      const matchesDiff = difficultyFilter === 'ALL' || q.difficulty === difficultyFilter
      return matchesSearch && matchesCat && matchesDiff
    })
  }, [customList, search, categoryFilter, difficultyFilter])

  /* ---- CRUD handlers ---- */
  const handleSave = async (draft: CustomMCQuestionDraft) => {
    if (formTarget === 'new') {
      const created = await questionManagementService.create(draft)
      setCustomList(prev => [created, ...prev])
      showToast(`✅ Created question "${created.title}"`)
    } else if (formTarget) {
      const updated = await questionManagementService.update(formTarget.id, draft)
      if (updated) {
        setCustomList(prev => prev.map(q => q.id === updated.id ? updated : q))
        showToast(`✅ Updated "${updated.title}"`)
      }
    }
    setFormTarget(null)
  }

  const handleDelete = async (id: string) => {
    const ok = await questionManagementService.delete(id)
    if (ok) {
      setCustomList(prev => prev.filter(q => q.id !== id))
      showToast(`🗑️ Question deleted.`)
    }
    setDeleteConfirmId(null)
  }

  /* ---- Category options from built-in + custom ---- */
  const categoryOptions = useMemo(() => {
    const cats = new Set<string>()
    MACHINE_CODING_QUESTIONS.forEach(q => cats.add(q.category))
    customList.forEach(q => cats.add(q.category))
    return Array.from(cats).sort()
  }, [customList])

  /* ---- Pagination calculations ---- */
  const activeFilteredCount = viewTab === 'builtin' ? filteredBuiltin.length : filteredCustom.length
  const totalPages = Math.max(1, Math.ceil(activeFilteredCount / pageSize))

  const paginatedBuiltin = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredBuiltin.slice(start, start + pageSize)
  }, [filteredBuiltin, currentPage, pageSize])

  const paginatedCustom = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredCustom.slice(start, start + pageSize)
  }, [filteredCustom, currentPage, pageSize])

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
          animation: 'aqfmFadeIn 0.2s ease',
        }}>
          {toast}
        </div>
      )}

      <div className="card-box" style={{ padding: '28px 28px 0' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: '0 0 4px', color: 'var(--h-text-white)', fontSize: '1.05rem', fontWeight: 700 }}>
              Question Management
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--h-text-muted)' }}>
              Browse the built-in catalog of {MACHINE_CODING_QUESTIONS.length.toLocaleString()} questions · Manage {customList.length} custom questions
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

        {/* Sub-tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 0 }}>
          {(['builtin', 'custom'] as ViewTab[]).map(t => (
            <button
              key={t}
              type="button"
              id={`aqm-tab-${t}`}
              onClick={() => setViewTab(t)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: viewTab === t ? '2px solid #6366f1' : '2px solid transparent',
                color: viewTab === t ? '#a5b4fc' : '#4b5563',
                padding: '10px 18px',
                fontSize: '0.85rem',
                fontWeight: viewTab === t ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
                letterSpacing: '0.3px',
              }}
            >
              {t === 'builtin' ? `📚 Built-in Catalog (${MACHINE_CODING_QUESTIONS.length.toLocaleString()})` : `✏️ Custom Questions (${customList.length})`}
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
            <option value="ALL">All Categories</option>
            {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            className="role-dropdown"
            value={difficultyFilter}
            onChange={e => setDifficultyFilter(e.target.value)}
          >
            <option value="ALL">All Difficulties</option>
            {['Easy', 'Medium', 'Hard', 'Senior'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {(search || categoryFilter !== 'ALL' || difficultyFilter !== 'ALL') && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => { setSearch(''); setCategoryFilter('ALL'); setDifficultyFilter('ALL') }}
            >✕ Reset</button>
          )}
        </div>

        {/* ---- BUILT-IN TAB ---- */}
        {viewTab === 'builtin' && (
          <div className="table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th style={{ width: 80 }}>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th style={{ width: 90 }}>Difficulty</th>
                  <th style={{ width: 90 }}>Est. Time</th>
                  <th style={{ width: 80, textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuiltin.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--h-text-muted)' }}>
                      🔍 No questions match the current filters.
                    </td>
                  </tr>
                ) : (
                  paginatedBuiltin.map(q => (
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
                      <td style={{ textAlign: 'center' }}>
                        <IconBtn
                          title="Preview question"
                          emoji="👁️"
                          onClick={() => setPreviewTarget(q)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ---- CUSTOM TAB ---- */}
        {viewTab === 'custom' && (
          <>
            {loadingCustom ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--h-text-muted)' }}>
                ⏳ Loading custom questions…
              </div>
            ) : filteredCustom.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📝</div>
                <div style={{ color: 'var(--h-text-white)', fontWeight: 600, marginBottom: 6 }}>
                  {customList.length === 0 ? 'No custom questions yet' : 'No questions match the current filters'}
                </div>
                <div style={{ color: 'var(--h-text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
                  {customList.length === 0
                    ? 'Create your first custom machine coding question to supplement the built-in catalog.'
                    : 'Try adjusting your search or filter criteria.'}
                </div>
                {customList.length === 0 && (
                  <button
                    type="button"
                    onClick={() => setFormTarget('new')}
                    style={{
                      background: 'linear-gradient(135deg,#4f46e5,#6366f1)',
                      color: '#fff', border: 'none', borderRadius: 10,
                      padding: '10px 22px', fontWeight: 700, fontSize: '0.9rem',
                      cursor: 'pointer',
                    }}
                  >➕ Create First Question</button>
                )}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: 90 }}>ID</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th style={{ width: 90 }}>Difficulty</th>
                      <th style={{ width: 90 }}>Est. Time</th>
                      <th style={{ width: 120, textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCustom.map(q => (
                      <tr key={q.id}>
                        <td>
                          <span style={{
                            background: 'rgba(16,185,129,0.12)',
                            color: '#34d399',
                            border: '1px solid rgba(16,185,129,0.25)',
                            borderRadius: 6, padding: '2px 8px',
                            fontSize: '0.75rem', fontWeight: 700,
                          }}>{q.id}</span>
                        </td>
                        <td style={{ color: 'var(--h-text-white)', fontWeight: 500, fontSize: '0.88rem' }}>{q.title}</td>
                        <td><CatBadge cat={q.category} /></td>
                        <td><DiffBadge diff={q.difficulty} /></td>
                        <td style={{ color: 'var(--h-text-muted)', fontSize: '0.82rem' }}>{q.timeEstimate}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                            <IconBtn title="Preview" emoji="👁️" onClick={() => setPreviewTarget(q)} />
                            <IconBtn title="Edit" emoji="✏️" onClick={() => setFormTarget(q)} />
                            <IconBtn title="Delete" emoji="🗑️" danger onClick={() => setDeleteConfirmId(q.id)} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ---- Pagination Toolbar ---- */}
        {activeFilteredCount > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderTop: '1px solid var(--border-color, rgba(255,255,255,0.08))',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Showing {Math.min((currentPage - 1) * pageSize + 1, activeFilteredCount)}–{Math.min(currentPage * pageSize, activeFilteredCount)} of {activeFilteredCount} questions
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                ← Prev
              </button>

              <span style={{ fontSize: '13px', padding: '0 8px', color: 'var(--text-primary)' }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                className="btn btn-sm btn-secondary"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                Next →
              </button>

              <select
                className="role-dropdown"
                style={{ marginLeft: '12px', padding: '4px 8px', fontSize: '12px' }}
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(1)
                }}
              >
                <option value={10}>10 / page</option>
                <option value={25}>25 / page</option>
                <option value={50}>50 / page</option>
                <option value={100}>100 / page</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ---- Delete Confirm Dialog ---- */}
      {deleteConfirmId && typeof document !== 'undefined' && createPortal(
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(5,8,20,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
            boxSizing: 'border-box',
          }}
          onClick={e => { if (e.target === e.currentTarget) setDeleteConfirmId(null) }}
          role="dialog"
          aria-modal="true"
        >
          <div style={{
            background: '#0f1629',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 16,
            padding: '28px 32px',
            maxWidth: 400, width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🗑️</div>
            <h3 style={{ color: '#f1f5f9', margin: '0 0 8px', fontSize: '1.05rem' }}>Delete Question?</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 24px' }}>
              This will permanently remove question <strong style={{ color: '#94a3b8' }}>{deleteConfirmId}</strong> from the custom bank. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8', borderRadius: 10, padding: '9px 20px',
                  fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer',
                }}
              >Cancel</button>
              <button
                type="button"
                id="aqm-confirm-delete-btn"
                onClick={() => void handleDelete(deleteConfirmId)}
                style={{
                  background: 'linear-gradient(135deg,#dc2626,#ef4444)',
                  color: '#fff', border: 'none', borderRadius: 10,
                  padding: '9px 20px', fontWeight: 700, fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >🗑️ Yes, Delete</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ---- Form Modal (Create / Edit) ---- */}
      {formTarget !== null && (
        <AdminQuestionFormModal
          initial={formTarget === 'new' ? null : formTarget}
          onSave={handleSave}
          onClose={() => setFormTarget(null)}
        />
      )}

      {/* ---- Preview Modal ---- */}
      {previewTarget !== null && (
        <AdminQuestionPreviewModal
          question={previewTarget}
          onClose={() => setPreviewTarget(null)}
          onEdit={'isCustom' in previewTarget ? () => {
            setFormTarget(previewTarget as CustomMCQuestion)
            setPreviewTarget(null)
          } : undefined}
        />
      )}
    </div>
  )
}
