import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { CONTENT_HIERARCHY, getSubject, type SubjectId } from '../data/contentHierarchy'

export default function TheoryViewer() {
  const { user } = useAuth()
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | null>(null)
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null)
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null)
  const [expandedSubtopic, setExpandedSubtopic] = useState<string | null>(null)

  const subject = selectedSubject ? getSubject(selectedSubject) : null

  return (
    <div>
      <div className="placement-card" style={{ marginBottom: 18 }}>
        <h2>Theory Learning</h2>
        <p>
          Structured theory content organized by subject, chapter, topic, and subtopic.
          Each subtopic includes theory, key points, common mistakes, and interview questions.
        </p>
      </div>

      <div className="placement-grid cols-2">
        <section className="placement-card">
          <h2>Subjects</h2>
          <ul className="placement-list">
            {CONTENT_HIERARCHY.map((s) => (
              <li
                key={s.id}
                style={{
                  cursor: 'pointer',
                  borderColor: selectedSubject === s.id ? 'var(--accent)' : undefined,
                  backgroundColor: selectedSubject === s.id ? 'var(--bg-soft)' : undefined,
                }}
                onClick={() => {
                  setSelectedSubject(s.id)
                  setExpandedChapter(null)
                  setExpandedTopic(null)
                  setExpandedSubtopic(null)
                }}
              >
                <div className="placement-item-body">
                  <p className="placement-item-title">
                    <span style={{ marginRight: 8 }}>{s.icon}</span>
                    {s.name}
                  </p>
                  <p className="placement-item-meta">{s.description}</p>
                </div>
                <span className="placement-badge info">{s.chapters.length} chapters</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="placement-card">
          {subject ? (
            <>
              <h2>{subject.name}</h2>
              <p className="placement-inline-note">{subject.description}</p>

              {subject.chapters.map((chapter) => (
                <div key={chapter.id} style={{ marginTop: 16 }}>
                  <h3
                    style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                    onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
                  >
                    {chapter.name}
                    <span>{expandedChapter === chapter.id ? '−' : '+'}</span>
                  </h3>

                  {expandedChapter === chapter.id && (
                    <div style={{ marginLeft: 16 }}>
                      {chapter.topics.map((topic) => (
                        <div key={topic.id} style={{ marginTop: 12 }}>
                          <h4
                            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                            onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                          >
                            {topic.name}
                            <span>{expandedTopic === topic.id ? '−' : '+'}</span>
                          </h4>

                          {expandedTopic === topic.id && (
                            <div style={{ marginLeft: 16 }}>
                              {topic.subtopics.map((subtopic) => (
                                <div key={subtopic.id} style={{ marginTop: 12 }}>
                                  <div
                                    style={{
                                      cursor: 'pointer',
                                      padding: '12px',
                                      border: '1px solid var(--border)',
                                      borderRadius: '8px',
                                      backgroundColor: expandedSubtopic === subtopic.id ? 'var(--bg-soft)' : undefined,
                                    }}
                                    onClick={() => setExpandedSubtopic(expandedSubtopic === subtopic.id ? null : subtopic.id)}
                                  >
                                    <strong>{subtopic.name}</strong>
                                  </div>

                                  {expandedSubtopic === subtopic.id && (
                                    <div style={{ marginTop: 12, padding: 12 }}>
                                      <h4>Theory</h4>
                                      <p style={{ color: 'var(--text-secondary)' }}>{subtopic.theory}</p>

                                      <h4 style={{ marginTop: 12 }}>Key Points</h4>
                                      <ul style={{ paddingLeft: 18 }}>
                                        {subtopic.keyPoints.map((point) => (
                                          <li key={point}>{point}</li>
                                        ))}
                                      </ul>

                                      <h4 style={{ marginTop: 12 }}>Common Mistakes</h4>
                                      <ul style={{ paddingLeft: 18 }}>
                                        {subtopic.commonMistakes.map((mistake) => (
                                          <li key={mistake}>{mistake}</li>
                                        ))}
                                      </ul>

                                      <h4 style={{ marginTop: 12 }}>Interview Questions</h4>
                                      <ul style={{ paddingLeft: 18 }}>
                                        {subtopic.interviewQuestions.map((q) => (
                                          <li key={q}>{q}</li>
                                        ))}
                                      </ul>

                                      <h4 style={{ marginTop: 12 }}>Follow-ups</h4>
                                      <ul style={{ paddingLeft: 18 }}>
                                        {subtopic.followUps.map((f) => (
                                          <li key={f}>{f}</li>
                                        ))}
                                      </ul>

                                      <div className="placement-actions" style={{ marginTop: 12 }}>
                                        <Link
                                          to={`/placement?view=practice&subtopic=${subtopic.id}`}
                                          className="btn btn-primary"
                                        >
                                          Practice Questions
                                        </Link>
                                        <Link
                                          to={`/placement?view=interview-prep&topic=${subtopic.id}`}
                                          className="btn"
                                        >
                                          Interview Prep
                                        </Link>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="placement-empty">
              Select a subject to view its theory content.
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
