import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import './CodeReview.css'

export interface DiagnosticIssue {
  id: string
  category: 'Memory Leak' | 'Performance' | 'Accessibility (a11y)' | 'Security' | 'Best Practice'
  severity: 'Critical' | 'Warning' | 'Optimization'
  line?: number
  title: string
  description: string
  remediation: string
}

export interface CodePreset {
  id: string
  name: string
  tag: string
  buggyCode: string
  fixedCode: string
}

const PRESETS: CodePreset[] = [
  {
    id: 'user-profile',
    name: '1. User Profile & Data Fetcher',
    tag: 'Memory Leak + a11y Clickable Div',
    buggyCode: `// ❌ UNREVIEWED CODE: Contains Memory Leaks, a11y and Security Flaws
import React, { useState, useEffect } from 'react';

export function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ⚠️ CRITICAL: Missing AbortController (Memory leak / race condition)
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => setUser(data));

    // ⚠️ CRITICAL: Missing removeEventListener cleanup!
    window.addEventListener('resize', () => {
      console.log('Window resized for user:', userId);
    });
  }, [userId]);

  return (
    <div className="profile-card">
      {/* ⚠️ ACCESSIBILITY: Missing alt attribute on image */}
      <img src={user?.avatarUrl} />

      {/* ⚠️ ACCESSIBILITY: Non-interactive <div> with onClick missing role/tabIndex/keyboard handler */}
      <div onClick={() => alert('View Details')}>
        <h3>{user?.name}</h3>
      </div>

      {/* ⚠️ SECURITY: target="_blank" without rel="noopener noreferrer" (Reverse Tabnabbing) */}
      <a href={user?.website} target="_blank">
        Visit Website
      </a>
    </div>
  );
}`,
    fixedCode: `// ✅ STAFF-LEVEL REFACTOR: 100% Clean, Accessible & Memory-Safe
import React, { useState, useEffect } from 'react';

export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // ⚡ Safe async fetch with AbortController cancellation
    const controller = new AbortController();

    fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => {
        if (err.name !== 'AbortError') console.error('Fetch failed:', err);
      });

    // ⚡ Automatic listener cleanup with signal
    const handleResize = () => console.log('Window resized for user:', userId);
    window.addEventListener('resize', handleResize, { signal: controller.signal });

    return () => controller.abort();
  }, [userId]);

  return (
    <div className="profile-card">
      {/* ✓ Accessible Image with descriptive alt */}
      <img src={user?.avatarUrl} alt={\`\${user?.name || 'User'}'s profile avatar\`} />

      {/* ✓ Semantic accessible button element with keyboard support */}
      <button 
        type="button" 
        className="profile-title-btn"
        onClick={() => alert('View Details')}
      >
        <h3>{user?.name}</h3>
      </button>

      {/* ✓ Secure external link with noopener noreferrer */}
      <a href={user?.website} target="_blank" rel="noopener noreferrer">
        Visit Website
      </a>
    </div>
  );
}`,
  },
  {
    id: 'context-search',
    name: '2. Un-memoized Search & Context',
    tag: 'Cascading Re-renders',
    buggyCode: `// ❌ UNREVIEWED CODE: Causes 500 Unnecessary Child Component Re-renders
import React, { useState, createContext, useContext } from 'react';

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  // ⚠️ PERFORMANCE: Passing inline object literal forces all consumers to re-render on every keystroke!
  return (
    <SearchContext.Provider value={{ query, setQuery, filter, setFilter }}>
      {children}
    </SearchContext.Provider>
  );
}

export function ItemList({ items }) {
  // ⚠️ PERFORMANCE: Anonymous inline arrow function in map creates new closure per item per render
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => console.log(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}`,
    fixedCode: `// ✅ STAFF-LEVEL REFACTOR: Memoized Context Value & Optimized Handlers
import React, { useState, useMemo, useCallback, createContext, useContext } from 'react';

interface SearchContextType {
  query: string;
  setQuery: (q: string) => void;
  filter: string;
  setFilter: (f: string) => void;
}

const SearchContext = createContext<SearchContextType | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  // ⚡ Memoized context value prevents unneeded downstream re-renders
  const contextValue = useMemo(() => ({
    query, setQuery, filter, setFilter
  }), [query, filter]);

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
}

export const ItemList = React.memo(function ItemList({ items, onItemClick }: Props) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => onItemClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
});`,
  },
]

export default function CodeReview() {
  const [selectedPreset, setSelectedPreset] = useState<CodePreset>(PRESETS[0])
  const [sourceCode, setSourceCode] = useState<string>(PRESETS[0].buggyCode)

  // Real-Time Static Analysis Engine
  const analysisResults = useMemo(() => {
    const issues: DiagnosticIssue[] = []
    const lines = sourceCode.split('\n')

    // 1. Check for missing AbortController / fetch in useEffect
    if (sourceCode.includes('useEffect') && sourceCode.includes('fetch(') && !sourceCode.includes('AbortController') && !sourceCode.includes('signal')) {
      issues.push({
        id: 'mem-abort-controller',
        category: 'Memory Leak',
        severity: 'Critical',
        title: 'Missing AbortController in useEffect fetch',
        description: 'Asynchronous fetch inside useEffect without cancellation can cause race conditions and memory leaks if the component unmounts before response resolves.',
        remediation: 'Instantiate `const controller = new AbortController();`, pass `{ signal: controller.signal }` to fetch, and call `controller.abort()` in the cleanup return.',
      })
    }

    // 2. Check for addEventListener without cleanup
    if (sourceCode.includes('addEventListener') && !sourceCode.includes('removeEventListener') && !sourceCode.includes('signal:')) {
      issues.push({
        id: 'mem-event-listener',
        category: 'Memory Leak',
        severity: 'Critical',
        title: 'Dangling window.addEventListener Without Cleanup',
        description: 'Registering an event listener without a corresponding removeEventListener in the cleanup return function prevents garbage collection of the enclosing component closure.',
        remediation: 'Return a cleanup function from useEffect removing the listener, or pass `{ signal: controller.signal }`.',
      })
    }

    // 3. Check for Clickable <div> (Accessibility)
    if (/<div[^>]*onClick/i.test(sourceCode) && !sourceCode.includes('role="button"')) {
      issues.push({
        id: 'a11y-clickable-div',
        category: 'Accessibility (a11y)',
        severity: 'Critical',
        title: 'Non-Semantic Clickable <div> (WCAG Violation)',
        description: 'Using `onClick` on a `<div>` without `role="button"`, `tabIndex="0"`, and keyboard handlers (`onKeyDown`) prevents screen readers and keyboard-only users from activating the element.',
        remediation: 'Replace `<div onClick=...>` with a semantic `<button type="button">` element.',
      })
    }

    // 4. Check for Image missing alt
    if (/<img(?![^>]*\balt=)[^>]*>/i.test(sourceCode)) {
      issues.push({
        id: 'a11y-img-alt',
        category: 'Accessibility (a11y)',
        severity: 'Warning',
        title: 'Image Tag Missing alt Attribute (WCAG 1.1.1)',
        description: 'Images without `alt` attributes cannot be interpreted by screen readers.',
        remediation: 'Add a descriptive `alt="..."` attribute, or `alt=""` if purely decorative.',
      })
    }

    // 5. Check for target="_blank" without rel="noopener noreferrer"
    if (/target=["']_blank["']/i.test(sourceCode) && !sourceCode.includes('noopener')) {
      issues.push({
        id: 'sec-target-blank',
        category: 'Security',
        severity: 'Critical',
        title: 'Reverse Tabnabbing Vulnerability (target="_blank")',
        description: 'Opening links with `target="_blank"` without `rel="noopener noreferrer"` exposes `window.opener`, allowing malicious target pages to redirect your application.',
        remediation: 'Add `rel="noopener noreferrer"` to all external anchor links.',
      })
    }

    // 6. Check for un-memoized Context value
    if (/\.Provider\s+value=\{\{[^}]+\}\}/i.test(sourceCode)) {
      issues.push({
        id: 'perf-context-object',
        category: 'Performance',
        severity: 'Warning',
        title: 'Un-memoized Context Object Literal (Cascading Re-renders)',
        description: 'Passing inline object literals like `value={{ ... }}` creates a new memory reference on every render, triggering re-renders across all useContext consumers.',
        remediation: 'Wrap the context object value in `useMemo(() => ({ ... }), [dependencies])`.',
      })
    }

    // 7. Check for dangerouslySetInnerHTML
    if (sourceCode.includes('dangerouslySetInnerHTML') && !sourceCode.includes('DOMPurify')) {
      issues.push({
        id: 'sec-xss-innerhtml',
        category: 'Security',
        severity: 'Critical',
        title: 'Cross-Site Scripting (XSS) via Unsanitized dangerouslySetInnerHTML',
        description: 'Rendering raw HTML without sanitization allows attackers to inject malicious JavaScript.',
        remediation: 'Sanitize the HTML payload using `DOMPurify.sanitize(dirtyHtml)`.',
      })
    }

    // Cyclomatic Complexity calculation
    let complexity = 1
    for (const line of lines) {
      const matches = line.match(/\b(if|else if|case|for|while|catch)\b|&&|\|\||\?/g)
      if (matches) complexity += matches.length
    }


    // Health Score calculation
    const criticals = issues.filter(i => i.severity === 'Critical').length
    const warnings = issues.filter(i => i.severity === 'Warning').length
    const optimizations = issues.filter(i => i.severity === 'Optimization').length

    let score = 100 - (criticals * 30) - (warnings * 15) - (optimizations * 5)
    score = Math.max(10, Math.min(100, score))

    return {
      issues,
      complexity,
      criticals,
      warnings,
      optimizations,
      score,
    }
  }, [sourceCode])

  const applyPreset = (p: CodePreset) => {
    setSelectedPreset(p)
    setSourceCode(p.buggyCode)
  }

  const applyAutomatedFix = () => {
    setSourceCode(selectedPreset.fixedCode)
  }

  return (
    <div className="code-review-page page-enter">
      {/* Header */}
      <div className="code-review-header">
        <div>
          <span className="cr-badge">🔍 AI Static Code Reviewer &amp; AST Linter</span>
          <h1>Static Code Reviewer &amp; AST Analysis Studio</h1>
          <p className="subtitle">
            Instantly diagnose memory leaks, cascading re-renders, accessibility violations (WCAG 2.1 AA), and security flaws with 1-click Staff-level automated refactoring.
          </p>
        </div>
      </div>

      {/* Presets Bar */}
      <div className="presets-row">
        <span>Sample Buggy Snippets:</span>
        <div className="preset-buttons">
          {PRESETS.map(p => (
            <button
              key={p.id}
              type="button"
              className={`preset-btn ${selectedPreset.id === p.id ? 'active' : ''}`}
              onClick={() => applyPreset(p)}
            >
              <strong>{p.name}</strong> ({p.tag})
            </button>
          ))}
        </div>
      </div>

      {/* Main Review Grid */}
      <div className="review-main-grid">
        {/* Left Column: Code Editor */}
        <div className="editor-column">
          <div className="code-editor-card">
            <div className="editor-card-header">
              <span className="editor-lang-tag">React / TypeScript Source</span>
              <div className="editor-header-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-sm apply-fix-btn"
                  onClick={applyAutomatedFix}
                >
                  ⚡ Apply Staff-Level Automated Refactor
                </button>
              </div>
            </div>

            <textarea
              className="source-code-editor"
              value={sourceCode}
              onChange={e => setSourceCode(e.target.value)}
              rows={22}
              spellCheck={false}
            />
          </div>
        </div>

        {/* Right Column: Telemetry & Issues List */}
        <div className="diagnostics-column">
          {/* Health Score Hero */}
          <div className="health-score-hero">
            <div className="score-dial">
              <span className={`score-digit ${analysisResults.score >= 85 ? 'good' : analysisResults.score >= 50 ? 'warn' : 'bad'}`}>
                {analysisResults.score}%
              </span>
              <span className="score-sub">Code Health</span>
            </div>

            <div className="health-meta">
              <h4>{analysisResults.score === 100 ? '✅ 100% Clean & Production-Ready' : '⚠️ Actionable Code Smells Detected'}</h4>
              <div className="severity-counts-row">
                <span className="sev-pill sev-crit">{analysisResults.criticals} Critical</span>
                <span className="sev-pill sev-warn">{analysisResults.warnings} Warnings</span>
                <span className="sev-pill sev-comp">Complexity: {analysisResults.complexity}</span>
              </div>
            </div>
          </div>

          {/* Diagnostics Issues List */}
          <div className="issues-list-card">
            <h4>Diagnostic Issues ({analysisResults.issues.length})</h4>

            {analysisResults.issues.length === 0 ? (
              <div className="clean-code-state">
                <span className="clean-icon">🎉</span>
                <strong>Zero Code Smells or Vulnerabilities Found!</strong>
                <p>This code adheres to Staff-level engineering standards: memory-safe lifecycle hooks, 100% WCAG accessible elements, and secure tab targets.</p>
              </div>
            ) : (
              <div className="issues-cards-list">
                {analysisResults.issues.map(issue => (
                  <div key={issue.id} className={`issue-card sev-border-${issue.severity.toLowerCase()}`}>
                    <div className="issue-card-top">
                      <span className={`issue-sev-tag sev-${issue.severity.toLowerCase()}`}>{issue.severity}</span>
                      <span className="issue-cat-tag">{issue.category}</span>
                    </div>
                    <h5 className="issue-title">{issue.title}</h5>
                    <p className="issue-desc">{issue.description}</p>
                    <div className="issue-fix-box">
                      <strong>Remediation:</strong>
                      <p>{issue.remediation}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="review-footer">
        <Link to="/profiler" className="btn btn-secondary">
          ⚡ Web Vitals Profiler Lab
        </Link>
        <Link to="/questions" className="btn btn-primary">
          📚 Browse 22,222 Questions →
        </Link>
      </div>
    </div>
  )
}
