import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import './ResumeOptimizer.css'

export interface KeywordCategory {
  category: string
  icon: string
  keywords: string[]
}

const KEYWORD_GROUPS: KeywordCategory[] = [
  {
    category: 'Architecture & State',
    icon: '🏗️',
    keywords: ['React', 'TypeScript', 'Next.js', 'TanStack Query', 'Zustand', 'Redux', 'Module Federation', 'Micro-Frontends', 'CRDT', 'State Management', 'SSR', 'Server Actions'],
  },
  {
    category: 'Performance & Web Vitals',
    icon: '⚡',
    keywords: ['INP', 'LCP', 'CLS', 'Core Web Vitals', 'Virtualization', 'Code-splitting', 'Tree-shaking', 'Web Workers', 'Lighthouse', 'Bundle Optimization', '60fps', 'Memoization'],
  },
  {
    category: 'Testing & Quality',
    icon: '🧪',
    keywords: ['Playwright', 'Vitest', 'Jest', 'React Testing Library', 'Cypress', 'CI/CD', 'E2E Testing', 'Unit Testing', 'Mock Service Worker', 'RUM Telemetry'],
  },
  {
    category: 'Accessibility & Security',
    icon: '🔒',
    keywords: ['WCAG', 'ARIA', 'Keyboard Accessibility', 'Content Security Policy', 'CSP', 'XSS', 'CSRF', 'Trusted Types', 'Semantic HTML', 'DOMPurify'],
  },
]

const SAMPLE_STAFF_RESUME = `SENIOR / STAFF FRONTEND ENGINEER
Spearheaded the multi-year architectural modernization of the core checkout web application serving 15 Million Daily Active Users, migrating from a legacy monolith to Next.js 14 with React Server Components.
• Architected dynamic DOM virtualization and adaptive image delivery pipelines, slashing Interaction to Next Paint (INP) from 340ms to 18ms (94% reduction) and boosting mobile checkout conversion by 14.2%.
• Engineered an offline-first mutation queue using IndexedDB and Service Worker background sync with exponential backoff jitter, achieving zero lost transactions during intermittent connectivity drops.
• Orchestrated company-wide Design System token architecture across 40+ squads with automated WCAG 2.1 AA accessibility regression audits, cutting frontend development turnaround by 35%.
• Spearheaded automated CI/CD performance budgeting and Playwright E2E suites with Vitest, increasing test coverage from 42% to 91% and eliminating production release rollbacks.`

const WEAK_VERBS = [
  { weak: 'worked on', replacement: 'Spearheaded / Architected' },
  { weak: 'helped with', replacement: 'Collaborated with / Orchestrated' },
  { weak: 'responsible for', replacement: 'Engineered / Spearheaded' },
  { weak: 'assisted in', replacement: 'Accelerated / Co-designed' },
  { weak: 'changed', replacement: 'Refactored / Modernized' },
  { weak: 'made', replacement: 'Implemented / Engineered' },
]

export interface PortfolioBlueprint {
  id: string
  title: string
  icon: string
  tagline: string
  techStack: string[]
  architectureSummary: string
  resumeBulletTemplate: string
}

const BLUEPRINTS: PortfolioBlueprint[] = [
  {
    id: 'canvas-crdt',
    title: 'Real-Time Collaborative Canvas (Figma-Scale)',
    icon: '🎨',
    tagline: 'Multiplayer infinite canvas with CRDT conflict resolution and 60fps WebGL/Canvas rendering.',
    techStack: ['React 19', 'TypeScript', 'Yjs / CRDTs', 'HTML5 Canvas 2D / WebGL', 'WebSockets', 'Web Workers'],
    architectureSummary: 'Decoupled rendering engine using an offscreen canvas worker with spatial hash grid partitioning for O(1) viewport collision detection, paired with Yjs CRDTs over WebSockets for zero-conflict multi-user editing.',
    resumeBulletTemplate: '• Architected a real-time collaborative canvas supporting 50+ concurrent users with sub-25ms peer latency using Yjs CRDTs and Web Workers, maintaining 60fps rendering across 20,000+ vector nodes.',
  },
  {
    id: 'edge-ecommerce',
    title: 'Edge-Rendered Monorepo E-Commerce Platform',
    icon: '⚡',
    tagline: 'Ultra-low latency storefront with React Server Components and Module Federation.',
    techStack: ['Next.js App Router', 'React Server Components', 'Vercel Edge Workers', 'Turborepo', 'Module Federation'],
    architectureSummary: 'Distributed edge SSR rendering with stale-while-revalidate edge caching across 300+ PoPs, integrated with Module Federation to allow independent deployment of Cart, Search, and Catalog squads.',
    resumeBulletTemplate: '• Engineered a distributed edge-rendered e-commerce frontend delivering sub-120ms P99 TTFB globally, increasing page engagement by 28% and reducing CDN egress costs by $85k annually.',
  },
  {
    id: 'design-system',
    title: 'Enterprise Multi-Brand Design System & Tokens',
    icon: '🧩',
    tagline: 'Zero-runtime CSS token engine with WCAG 2.1 AAA accessibility and Figma sync.',
    techStack: ['React', 'TypeScript', 'CSS Modules / StyleX', 'Style Dictionary', 'Storybook', 'Playwright'],
    architectureSummary: 'Automated token compilation pipeline translating Figma design tokens into CSS custom properties with zero-runtime overhead, equipped with automated axe-core accessibility regression gates in CI.',
    resumeBulletTemplate: '• Designed an enterprise-grade multi-brand Design System adopted across 25+ product squads, achieving 100% WCAG 2.1 AAA compliance and accelerating UI feature delivery by 40%.',
  },
  {
    id: 'telemetry-rum',
    title: 'Real User Monitoring (RUM) Telemetry Pipeline',
    icon: '📊',
    tagline: 'High-throughput client telemetry capturing Core Web Vitals and network traces.',
    techStack: ['TypeScript', 'Web Vitals API', 'PerformanceObserver', 'navigator.sendBeacon', 'ClickHouse / Grafana'],
    architectureSummary: 'Lightweight (<3KB) client SDK utilizing PerformanceObserver and scheduler.yield to batch and transmit Web Vitals (LCP, INP, CLS) via navigator.sendBeacon without blocking page unloads.',
    resumeBulletTemplate: '• Developed a zero-overhead (<3KB) Real User Monitoring SDK tracking INP and LCP across 10M daily sessions, enabling engineering teams to diagnose and eliminate 18 major performance regressions.',
  },
]

export default function ResumeOptimizer() {
  const [resumeText, setResumeText] = useState<string>('')
  const [targetLevel, setTargetLevel] = useState<string>('Senior (L5 / E5)')
  const [activeTab, setActiveTab] = useState<'scanner' | 'bullets' | 'blueprints'>('scanner')

  // Real-time ATS Keyword Matcher
  const keywordAnalysis = useMemo(() => {
    const text = resumeText.toLowerCase()
    let totalKeywords = 0
    let matchedKeywords = 0

    const categoryStats = KEYWORD_GROUPS.map(grp => {
      const matches = grp.keywords.filter(kw => text.includes(kw.toLowerCase()))
      totalKeywords += grp.keywords.length
      matchedKeywords += matches.length
      return {
        ...grp,
        matches,
        score: Math.round((matches.length / grp.keywords.length) * 100),
      }
    })

    const overallAtsScore = resumeText.trim().length < 50
      ? 0
      : Math.min(100, Math.round((matchedKeywords / (totalKeywords * 0.45)) * 100))

    return {
      categoryStats,
      matchedKeywords,
      totalKeywords,
      overallAtsScore,
    }
  }, [resumeText])

  // Google XYZ Formula Bullet Scorer
  const bulletAnalysis = useMemo(() => {
    const lines = resumeText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.startsWith('•') || l.startsWith('-') || l.startsWith('*') || l.length > 30)

    const scoredBullets = lines.map(b => {
      const lower = b.toLowerCase()

      // 1. Check for metrics (numbers, %, $, ms)
      const hasMetric = /\b\d+(\.\d+)?(%|ms|s|k|m|b|\$)?\b/i.test(b)

      // 2. Check for strong power verbs
      const powerVerbs = ['architected', 'spearheaded', 'engineered', 'orchestrated', 'slashed', 'optimized', 'scaled', 'delivered', 'designed', 'accelerated']
      const hasPowerVerb = powerVerbs.some(v => lower.includes(v))

      // 3. Check for weak verbs
      const detectedWeak = WEAK_VERBS.find(w => lower.includes(w.weak))

      let score = 30
      if (hasMetric) score += 40
      if (hasPowerVerb) score += 30
      if (detectedWeak) score -= 20

      return {
        text: b,
        score: Math.max(10, Math.min(100, score)),
        hasMetric,
        hasPowerVerb,
        weakVerb: detectedWeak,
      }
    })

    const avgBulletScore = scoredBullets.length > 0
      ? Math.round(scoredBullets.reduce((acc, curr) => acc + curr.score, 0) / scoredBullets.length)
      : 0

    return {
      scoredBullets,
      avgBulletScore,
    }
  }, [resumeText])

  const loadSampleResume = () => {
    setResumeText(SAMPLE_STAFF_RESUME)
  }

  return (
    <div className="resume-page page-enter">
      {/* Header */}
      <div className="resume-header">
        <div>
          <span className="res-badge">📄 FAANG ATS Scanner &amp; Google XYZ Formula</span>
          <h1>ATS Resume Scanner &amp; Portfolio Architect</h1>
          <p className="subtitle">
            Optimize your frontend resume for FAANG Applicant Tracking Systems (ATS), score impact bullets with Google’s XYZ formula, and explore Staff-level portfolio project blueprints.
          </p>
        </div>
      </div>

      {/* Target Level & Actions Bar */}
      <div className="resume-controls-bar">
        <div className="level-select-wrap">
          <label htmlFor="target-level-select">Target Level:</label>
          <select
            id="target-level-select"
            className="level-select"
            value={targetLevel}
            onChange={e => setTargetLevel(e.target.value)}
          >
            <option>Junior Frontend (L3 / E3)</option>
            <option>Mid-Level Frontend (L4 / E4)</option>
            <option>Senior (L5 / E5)</option>
            <option>Staff / Principal Architect (L6 / E6+)</option>
          </select>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={loadSampleResume}
        >
          📄 Load Staff Frontend Exemplar Resume
        </button>
      </div>

      {/* Mode Tabs */}
      <div className="resume-tabs-bar">
        <button
          type="button"
          className={`res-tab ${activeTab === 'scanner' ? 'active' : ''}`}
          onClick={() => setActiveTab('scanner')}
        >
          🔍 ATS Keyword Matcher ({keywordAnalysis.overallAtsScore}%)
        </button>
        <button
          type="button"
          className={`res-tab ${activeTab === 'bullets' ? 'active' : ''}`}
          onClick={() => setActiveTab('bullets')}
        >
          ⚡ Google XYZ Bullet Scorer ({bulletAnalysis.avgBulletScore}%)
        </button>
        <button
          type="button"
          className={`res-tab ${activeTab === 'blueprints' ? 'active' : ''}`}
          onClick={() => setActiveTab('blueprints')}
        >
          🏗️ Staff Portfolio Blueprints (4 Blueprints)
        </button>
      </div>

      {/* 1. ATS SCANNER TAB */}
      {activeTab === 'scanner' && (
        <div className="scanner-grid">
          {/* Left: Input Textarea */}
          <div className="resume-input-column">
            <div className="resume-textarea-card">
              <div className="card-top-label">
                <span>Paste Your Resume Experience / Bullets:</span>
                <span className="char-count">{resumeText.length} characters</span>
              </div>
              <textarea
                className="resume-textarea"
                placeholder="Paste your resume work history or bullet points here...
Example:
• Architected dynamic DOM virtualization, slashing INP from 340ms to 18ms and boosting checkout conversion by 14%...
• Built offline-first mutation queue using IndexedDB and Service Workers with Playwright tests..."
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                rows={14}
              />
            </div>
          </div>

          {/* Right: ATS Score & Keyword Density Matrix */}
          <div className="ats-results-column">
            <div className="ats-score-hero">
              <div className="score-circle">
                <span className="score-number">{keywordAnalysis.overallAtsScore}%</span>
                <span className="score-caption">ATS Match</span>
              </div>
              <div className="score-summary">
                <h4>{keywordAnalysis.overallAtsScore >= 75 ? '🚀 Strong FAANG ATS Rating' : '⚠️ Missing High-Yield Keywords'}</h4>
                <p>
                  Targeting <strong>{targetLevel}</strong>. {keywordAnalysis.matchedKeywords} high-impact technical keywords detected.
                </p>
              </div>
            </div>

            {/* Keyword Categories */}
            <div className="keyword-categories-list">
              {keywordAnalysis.categoryStats.map(cat => (
                <div key={cat.category} className="kw-cat-card">
                  <div className="kw-cat-header">
                    <span className="kw-cat-title">{cat.icon} {cat.category}</span>
                    <span className="kw-cat-percent">{cat.score}%</span>
                  </div>
                  <div className="kw-pill-wrap">
                    {cat.keywords.map(kw => {
                      const isFound = cat.matches.includes(kw)
                      return (
                        <span key={kw} className={`kw-pill ${isFound ? 'found' : 'missing'}`}>
                          {isFound ? '✓ ' : '+ '}{kw}
                        </span>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. GOOGLE XYZ BULLET SCORER TAB */}
      {activeTab === 'bullets' && (
        <div className="bullets-grid">
          <div className="xyz-formula-banner">
            <h3>Google Laszlo Bock XYZ Impact Formula</h3>
            <p className="xyz-quote">
              "Accomplished <strong>[X]</strong> as measured by <strong>[Y]</strong>, by doing <strong>[Z]</strong>."
            </p>
            <p className="xyz-sub">
              FAANG hiring managers reject vague duty descriptions (*"responsible for maintaining UI"*). Every bullet must start with a power verb and include a quantifiable metric.
            </p>
          </div>

          {bulletAnalysis.scoredBullets.length === 0 ? (
            <div className="empty-bullets-state">
              <p>Paste your resume bullets in the ATS Scanner tab to analyze them with the Google XYZ formula.</p>
              <button type="button" className="btn btn-primary" onClick={loadSampleResume}>
                Load Sample Bullets
              </button>
            </div>
          ) : (
            <div className="scored-bullets-list">
              {bulletAnalysis.scoredBullets.map((b, idx) => (
                <div key={idx} className="bullet-eval-card">
                  <div className="bullet-card-header">
                    <span className={`bullet-score-badge ${b.score >= 80 ? 'good' : b.score >= 50 ? 'warn' : 'bad'}`}>
                      {b.score}% XYZ Score
                    </span>
                    <div className="bullet-checks">
                      <span className={`b-check ${b.hasPowerVerb ? 'yes' : 'no'}`}>
                        {b.hasPowerVerb ? '✓ Power Verb' : '✗ Weak Opening'}
                      </span>
                      <span className={`b-check ${b.hasMetric ? 'yes' : 'no'}`}>
                        {b.hasMetric ? '✓ Quantifiable Metric' : '✗ Missing Numbers (%)'}
                      </span>
                    </div>
                  </div>
                  <p className="bullet-text">{b.text}</p>

                  {b.weakVerb && (
                    <div className="weak-verb-tip">
                      ⚠️ Replace weak phrase <em>"{b.weakVerb.weak}"</em> with <strong>"{b.weakVerb.replacement}"</strong>.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. PORTFOLIO BLUEPRINTS TAB */}
      {activeTab === 'blueprints' && (
        <div className="blueprints-grid">
          {BLUEPRINTS.map(bp => (
            <div key={bp.id} className="blueprint-card">
              <div className="bp-header">
                <span className="bp-icon">{bp.icon}</span>
                <div>
                  <h3 className="bp-title">{bp.title}</h3>
                  <span className="bp-tagline">{bp.tagline}</span>
                </div>
              </div>

              <div className="bp-tech-row">
                {bp.techStack.map(t => (
                  <span key={t} className="bp-tech-pill">{t}</span>
                ))}
              </div>

              <div className="bp-arch-box">
                <strong>Architecture Highlights:</strong>
                <p>{bp.architectureSummary}</p>
              </div>

              <div className="bp-bullet-box">
                <strong>Ready-to-Use Resume Bullet:</strong>
                <code>{bp.resumeBulletTemplate}</code>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Navigation */}
      <div className="resume-footer">
        <Link to="/experience" className="btn btn-secondary">
          🎯 0-20 Years Career Ladder
        </Link>
        <Link to="/pathways" className="btn btn-primary">
          🏢 Browse 620+ Company Pathways →
        </Link>
      </div>
    </div>
  )
}
