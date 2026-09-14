import { useState, useMemo } from 'react';
import { COMPARISONS_CATALOG, type ComparisonItem } from '../data/comparisonsCatalog';
import { SafeMarkdownViewer } from './common/SafeMarkdownViewer';

export function DocsComparisonStudio() {
  const [selectedId, setSelectedId] = useState<string>(COMPARISONS_CATALOG[0].id);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = useMemo(() => {
    const set = new Set(COMPARISONS_CATALOG.map(c => c.subject));
    return ['all', ...Array.from(set)];
  }, []);

  const filteredComparisons = useMemo(() => {
    if (categoryFilter === 'all') return COMPARISONS_CATALOG;
    return COMPARISONS_CATALOG.filter(c => c.subject === categoryFilter);
  }, [categoryFilter]);

  const activeComparison: ComparisonItem = useMemo(() => {
    return COMPARISONS_CATALOG.find(c => c.id === selectedId) || COMPARISONS_CATALOG[0];
  }, [selectedId]);

  return (
    <div className="docs-comparisons-studio">
      {/* Studio Header */}
      <header className="docs-studio-header">
        <div className="dsh-left">
          <span className="dsh-badge">⚖️ TECHNICAL MATRIX</span>
          <h1 className="dsh-title">Technical Comparison Matrix Hub</h1>
          <p className="dsh-subtext">
            Side-by-side architectural evaluations for the classic frontend interview face-offs. Master the trade-offs, mental models, performance implications, and senior signals.
          </p>
        </div>
      </header>

      {/* Category Pills & Selector Bar */}
      <div className="comparisons-selector-bar">
        <div className="comp-category-pills">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              className={`comp-cat-pill ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => {
                setCategoryFilter(cat);
                const matching = cat === 'all' ? COMPARISONS_CATALOG : COMPARISONS_CATALOG.filter(c => c.subject === cat);
                if (matching.length > 0) setSelectedId(matching[0].id);
              }}
            >
              {cat === 'all' ? 'All Comparisons' : cat}
            </button>
          ))}
        </div>

        <div className="comp-topics-tabs">
          {filteredComparisons.map(item => (
            <button
              key={item.id}
              type="button"
              className={`comp-tab-btn ${selectedId === item.id ? 'active' : ''}`}
              onClick={() => setSelectedId(item.id)}
            >
              <span className="tab-badge">{item.badge}</span>
              <span className="tab-title">{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Comparison Deep-Dive Sheet */}
      <article className="comparison-sheet-card animate-fade-in">
        {/* Title and Summary Header */}
        <div className="cs-header">
          <div className="cs-top-row">
            <span className="cs-subject-pill">{activeComparison.subject}</span>
            <span className="cs-category-pill">{activeComparison.category}</span>
            <span className="cs-badge-pill">{activeComparison.badge}</span>
          </div>
          <h2 className="cs-title">{activeComparison.title}</h2>
          <p className="cs-summary">{activeComparison.summary}</p>
        </div>

        {/* Dimension Comparison Table */}
        <section className="cs-section">
          <h3 className="cs-section-title">📊 Architectural Comparison Matrix</h3>
          <div className="cs-table-wrapper">
            <table className="cs-matrix-table">
              <thead>
                <tr>
                  <th>Dimension</th>
                  <th>{activeComparison.leftTitle}</th>
                  <th>{activeComparison.rightTitle}</th>
                  <th>Architectural Verdict</th>
                </tr>
              </thead>
              <tbody>
                {activeComparison.tableData.map((row, rIdx) => (
                  <tr key={rIdx}>
                    <td className="dim-cell">{row.dimension}</td>
                    <td className="left-val-cell">{row.leftValue}</td>
                    <td className="right-val-cell">{row.rightValue}</td>
                    <td className="verdict-cell">
                      <span className="verdict-tag">{row.verdict}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Mental Model Callout */}
        <section className="cs-section">
          <div className="cs-mental-model-card">
            <div className="cmm-icon">🧠</div>
            <div className="cmm-content">
              <h4>Mental Model &amp; Core Intuition</h4>
              <p>{activeComparison.mentalModel}</p>
            </div>
          </div>
        </section>

        {/* Side-by-Side Code Examples */}
        <section className="cs-section">
          <h3 className="cs-section-title">💻 Code Implementation Side-by-Side</h3>
          <div className="cs-code-grid">
            <div className="code-column left-col">
              <div className="code-column-header">
                <span>{activeComparison.leftTitle} Example</span>
              </div>
              <SafeMarkdownViewer
                content={`\`\`\`${activeComparison.leftCode.language}\n${activeComparison.leftCode.snippet}\n\`\`\``}
              />
            </div>
            <div className="code-column right-col">
              <div className="code-column-header">
                <span>{activeComparison.rightTitle} Example</span>
              </div>
              <SafeMarkdownViewer
                content={`\`\`\`${activeComparison.rightCode.language}\n${activeComparison.rightCode.snippet}\n\`\`\``}
              />
            </div>
          </div>
        </section>

        {/* When to Use Left vs Right Decision Grid */}
        <section className="cs-section">
          <h3 className="cs-section-title">⚖️ Decision Guide: When to Use Which?</h3>
          <div className="cs-decision-grid">
            <div className="decision-card left-decision">
              <div className="dec-head">
                <span className="dec-badge">CHOOSE THIS</span>
                <h4>When to choose {activeComparison.leftTitle}</h4>
              </div>
              <ul className="dec-list">
                {activeComparison.whenToUseLeft.map((item, idx) => (
                  <li key={idx}>✓ {item}</li>
                ))}
              </ul>
            </div>

            <div className="decision-card right-decision">
              <div className="dec-head">
                <span className="dec-badge">CHOOSE THIS</span>
                <h4>When to choose {activeComparison.rightTitle}</h4>
              </div>
              <ul className="dec-list">
                {activeComparison.whenToUseRight.map((item, idx) => (
                  <li key={idx}>✓ {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Performance & Senior Signals */}
        <section className="cs-section cs-insights-grid">
          <div className="insight-card perf-card">
            <div className="ic-header">
              <span>⚡ Performance &amp; Production Pitfalls</span>
            </div>
            <p className="ic-text">{activeComparison.performanceConsiderations}</p>
          </div>

          <div className="insight-card senior-card">
            <div className="ic-header">
              <span>🎯 Senior Architect Interview Signal</span>
            </div>
            <p className="ic-text">{activeComparison.seniorInterviewInsight}</p>
          </div>
        </section>

        {/* Interview Questions */}
        <section className="cs-section">
          <h3 className="cs-section-title">❓ Key Interview Questions &amp; Answers</h3>
          <div className="cs-questions-stack">
            {activeComparison.interviewQuestions.map((q, qIdx) => (
              <div key={qIdx} className="cs-q-card">
                <h4 className="cs-q-title">{q.question}</h4>
                <div className="cs-q-quick">
                  <span className="ans-tag quick-tag">Quick Answer:</span>
                  <p>{q.quickAnswer}</p>
                </div>
                <div className="cs-q-senior">
                  <span className="ans-tag senior-tag">Senior Signal:</span>
                  <p>{q.seniorAnswer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
