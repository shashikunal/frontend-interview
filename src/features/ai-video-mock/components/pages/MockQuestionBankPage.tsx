import { useState, useMemo } from 'react';
import { ALL_TECHNOLOGY_TRACKS, type TechnologyTrack, type QuestionDifficulty, type MockQuestion } from '../../types/questionBank.types';
import { filterMockQuestions } from '../../data/questionBankRegistry';

export default function MockQuestionBankPage() {
  const [selectedTrack, setSelectedTrack] = useState<TechnologyTrack | undefined>(undefined);
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestionDifficulty | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectQuestion, setInspectQuestion] = useState<MockQuestion | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const questions = useMemo(() => {
    return filterMockQuestions({
      technology: selectedTrack,
      difficulty: selectedDifficulty,
      searchQuery,
    });
  }, [selectedTrack, selectedDifficulty, searchQuery]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return questions.slice(start, start + pageSize);
  }, [questions, currentPage]);

  const totalPages = Math.ceil(questions.length / pageSize);

  return (
    <div style={{ maxWidth: 1100, margin: '32px auto', padding: '0 20px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 6px' }}>
          Mock Question Bank Explorer
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          Browse all 5,120+ approved interview questions across 16 technologies with full rubrics, expected concepts, and common pitfalls.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="ai-vm-card" style={{ marginBottom: 24, padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
          <input
            type="text"
            placeholder="Search by keyword, concept, topic, or question ID..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'var(--bg)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          />

          <select
            value={selectedTrack || ''}
            onChange={e => {
              setSelectedTrack((e.target.value as TechnologyTrack) || undefined);
              setCurrentPage(1);
            }}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: 'var(--bg)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          >
            <option value="">All 16 Technologies</option>
            {ALL_TECHNOLOGY_TRACKS.map(t => (
              <option key={t.id} value={t.id}>{t.icon} {t.label}</option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={e => {
              setSelectedDifficulty(e.target.value as any);
              setCurrentPage(1);
            }}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: 'var(--bg)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          >
            <option value="All">All Difficulties</option>
            <option value="Basic">Basic</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Found {questions.length} approved questions matching filter.
        </div>
      </div>

      {/* Questions Table */}
      <div className="ai-vm-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'var(--surface-hover)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px 16px' }}>ID</th>
              <th style={{ padding: '12px 16px' }}>Track</th>
              <th style={{ padding: '12px 16px' }}>Difficulty</th>
              <th style={{ padding: '12px 16px' }}>Topic / Question</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(q => (
              <tr key={q.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: '#818cf8' }}>
                  {q.id}
                </td>
                <td style={{ padding: '12px 16px', textTransform: 'capitalize' }}>
                  {q.technology}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: q.difficulty === 'Basic' ? 'rgba(34, 197, 94, 0.1)' : q.difficulty === 'Intermediate' ? 'rgba(56, 189, 248, 0.1)' : q.difficulty === 'Advanced' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: q.difficulty === 'Basic' ? '#4ade80' : q.difficulty === 'Intermediate' ? '#38bdf8' : q.difficulty === 'Advanced' ? '#a855f7' : '#f87171',
                    }}
                  >
                    {q.difficulty}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                    {q.question}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {q.topic} · {q.subtopic}
                  </div>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => setInspectQuestion(q)}
                    className="ai-vm-btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  >
                    Inspect Rubric →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--surface-hover)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Page {currentPage} of {Math.max(1, totalPages)}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="ai-vm-btn-secondary"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => p - 1)}
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              Previous
            </button>
            <button
              type="button"
              className="ai-vm-btn-secondary"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Inspect Modal */}
      {inspectQuestion && (
        <div className="ai-vm-modal-overlay">
          <div className="ai-vm-modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700 }}>
                  {inspectQuestion.id} · {inspectQuestion.technology.toUpperCase()} ({inspectQuestion.difficulty})
                </span>
                <h2 style={{ fontSize: '1.2rem', margin: '4px 0 0', fontWeight: 700 }}>
                  {inspectQuestion.question}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setInspectQuestion(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: 'var(--bg)', padding: 14, borderRadius: 10 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#10b981', marginBottom: 4 }}>
                  STRONG REFERENCE ANSWER:
                </div>
                <p style={{ fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
                  {inspectQuestion.rubric.strongAnswer}
                </p>
              </div>

              <div style={{ background: 'var(--bg)', padding: 14, borderRadius: 10 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#818cf8', marginBottom: 4 }}>
                  SENIOR-LEVEL EXPECTATIONS:
                </div>
                <p style={{ fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
                  {inspectQuestion.rubric.seniorLevelExpectations}
                </p>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>
                  Expected Concepts:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {inspectQuestion.expectedConcepts.map(c => (
                    <span key={c} className="ai-vm-concept-pill correct">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>
                  Ideal Answer Key Points:
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.82rem', lineHeight: 1.5 }}>
                  {inspectQuestion.idealAnswerPoints.map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
