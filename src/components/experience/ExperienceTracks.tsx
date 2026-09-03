import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuestions } from '../../data/useQuestions'
import { useBookmarks } from '../../context/BookmarkContext'
import { useProgress } from '../../context/ProgressContext'
import type { Question } from '../../models/question'
import './ExperienceTracks.css'

export interface ExperienceTier {
  id: string
  years: string
  title: string
  levels: string
  salary: string
  badgeColor: string
  icon: string
  summary: string
  coreCompetencies: string[]
  levelEquivalences: Record<string, string>
  studyPlan: {
    week1_2: string
    week3_4: string
    week5_6: string
    week7_8: string
  }
  domainDeepDives: {
    jsTs: string
    reactFramework: string
    systemDesign: string
    leadershipBehavioral: string
  }
  interviewRubricExpectations: string[]
  sampleSystemDesignTopic: string
  signatureInterviewProblem: {
    title: string
    prompt: string
    solutionSummary: string
  }
  keywords: string[]
  recommendedDifficulty: 'Easy' | 'Medium' | 'Hard'
}

const TIERS: ExperienceTier[] = [
  {
    id: 'tier-1',
    years: '0 - 2 Years',
    title: 'Entry / Junior Frontend Engineer',
    levels: 'Junior · Associate · L3 · E3 · SDE I',
    salary: '$80k - $140k total comp',
    badgeColor: '#10b981',
    icon: '🌱',
    summary: 'Focuses on clean code correctness, modern HTML5/CSS3 semantics, ES6+ JavaScript fundamentals, React component composition, responsive layouts, and debugging basic errors without hand-holding.',
    levelEquivalences: {
      'Google': 'L3 (Software Engineer II)',
      'Meta': 'E3 (Software Engineer)',
      'Amazon': 'SDE I (L4)',
      'Apple': 'ICT2 / ICT3',
      'Microsoft': 'Level 59 - 60',
      'Netflix': 'N/A (Senior-only hiring)',
      'Uber': 'Software Engineer I',
      'Stripe': 'L1 / L2 Engineer'
    },
    studyPlan: {
      week1_2: 'Master JavaScript ES6+ Array Methods (map/filter/reduce), Closures, and Scoping.',
      week3_4: 'Build responsive UI layouts with Flexbox and CSS Grid without frameworks.',
      week5_6: 'React Fundamentals: JSX, Props, useState, useEffect dependency arrays, and controlled forms.',
      week7_8: 'Async JavaScript: fetch(), Promise error handling, and building a GitHub user search app.'
    },
    domainDeepDives: {
      jsTs: 'Focuses on variable declarations (let/const vs var), closure creation, array and object destructuring, arrow functions, and basic primitive vs reference types.',
      reactFramework: 'Understanding the unilateral data flow in React: passing props down, emitting callbacks up, avoiding direct DOM mutations, and conditional rendering.',
      systemDesign: 'Component-level design: structuring an accessible Modal, Accordion, or Tabs widget with keyboard support and clean CSS transitions.',
      leadershipBehavioral: 'Demonstrating curiosity, receiving critical code review feedback constructively, and asking clarifying questions when requirements are underspecified.'
    },
    coreCompetencies: [
      'HTML5 Semantic Structure & Form Controls',
      'CSS Flexbox, Grid, Box Model & Media Queries',
      'JavaScript ES6+: Array methods (map/filter/reduce), Closures, Destructuring',
      'React Fundamentals: JSX, Props, useState, useEffect, Event Handlers',
      'Async JavaScript: fetch(), Promises, async/await',
      'Git Workflow: branch, commit, rebase, PR reviews',
      'Browser Developer Tools: Console, Elements, Network tab inspection'
    ],
    interviewRubricExpectations: [
      'Can write bug-free JavaScript syntax for straightforward algorithmic problems.',
      'Understands how React state triggers re-renders and avoids direct DOM mutation.',
      'Builds clean, responsive UI layouts matching Figma specs accurately.',
      'Receptive to interviewer feedback and tests edge cases (e.g. empty arrays, null inputs).',
    ],
    sampleSystemDesignTopic: 'Design an Accessible Accordion, Image Carousel, or Todo List with localStorage persistence.',
    signatureInterviewProblem: {
      title: 'Array.prototype.myFilter Implementation',
      prompt: 'Implement a zero-dependency polyfill for Array.prototype.filter that handles sparse arrays and passes the current index and array reference to the callback.',
      solutionSummary: 'Iterate through `this` using a standard for loop, check `Object.prototype.hasOwnProperty.call(this, i)` to handle sparse slots, invoke the callback with (this[i], i, this), and push matching elements to a new output array.'
    },
    keywords: ['html', 'css', 'javascript', 'array', 'closure', 'dom', 'react', 'hooks', 'promise'],
    recommendedDifficulty: 'Easy',
  },
  {
    id: 'tier-2',
    years: '3 - 5 Years',
    title: 'Mid-Level Frontend Engineer',
    levels: 'Software Engineer II · SDE II · L4 · E4',
    salary: '$140k - $240k total comp',
    badgeColor: '#38bdf8',
    icon: '🚀',
    summary: 'Demonstrates autonomous delivery of complex features, deep understanding of the JavaScript runtime (event loop, microtasks), TypeScript typing, custom hooks, and accessibility (WCAG 2.1 AA).',
    levelEquivalences: {
      'Google': 'L4 (Software Engineer III)',
      'Meta': 'E4 (Software Engineer)',
      'Amazon': 'SDE II (L5)',
      'Apple': 'ICT3 / ICT4',
      'Microsoft': 'Level 61 - 62',
      'Netflix': 'Senior UI (entry band)',
      'Uber': 'Software Engineer II',
      'Stripe': 'L2 / L3 Engineer'
    },
    studyPlan: {
      week1_2: 'Deep dive into Event Loop, Microtasks (Promise/queueMicrotask), and Prototype Inheritance.',
      week3_4: 'TypeScript Type Gymnastics: Generics, Discriminated Unions, and Mapped Types.',
      week5_6: 'Advanced React: Custom Hooks, Context, useMemo/useCallback performance profiling, and React 19 Actions.',
      week7_8: 'State Management & Caching with TanStack Query / Zustand, and Automated Testing with Vitest + RTL.'
    },
    domainDeepDives: {
      jsTs: 'Mastery of asynchronous execution queues, Debounce/Throttle implementations with leading/trailing options, and building type-safe utility libraries.',
      reactFramework: 'Building robust custom hooks with cleanup lifecycles, understanding the difference between stale closures and fresh state, and optimizing component trees.',
      systemDesign: 'Designing client-side widgets with caching: Search Autocomplete Combobox, Multi-step wizard forms with draft auto-save, and Infinite scroll pagination.',
      leadershipBehavioral: 'Leading small feature initiatives, resolving ambiguous tickets independently, and driving automated test coverage across pull requests.'
    },
    coreCompetencies: [
      'JavaScript Engine: Event Loop, Microtask Queue vs Macrotask, Prototype Chain',
      'TypeScript: Generics, Mapped Types, Discriminated Unions, Type Guards',
      'Advanced React: Custom Hooks, Context, useMemo/useCallback, React 19 Actions',
      'State Management: TanStack Query, Zustand, Redux Toolkit, Cache Invalidation',
      'Accessibility: WAI-ARIA roles, Keyboard Trapping, Screen Reader announcements',
      'Testing: Unit tests with Vitest/Jest, Component integration with RTL, E2E with Playwright',
      'Performance: Debouncing, Throttling, and Request Cancellation with AbortController'
    ],
    interviewRubricExpectations: [
      'Diagnoses asynchronous race conditions and memory leaks in React useEffect.',
      'Structures custom reusable hooks with clean separation of side-effects.',
      'Implements robust debounce/throttle and cancellation with AbortController.',
      'Writes type-safe code with strict TypeScript compiler options enabled.',
    ],
    sampleSystemDesignTopic: 'Design an Autocomplete Search Combobox with debouncing, LRU caching, and WAI-ARIA combobox pattern.',
    signatureInterviewProblem: {
      title: 'Promisified Throttle with Leading & Trailing Flags',
      prompt: 'Implement a throttle utility that supports both `leading: true` and `trailing: true` options, ensuring subsequent rapid invocations are properly scheduled.',
      solutionSummary: 'Maintain `lastExec` timestamp and `timeoutId` timer. If cooldown has elapsed and leading is true, execute immediately and update lastExec. Otherwise, if trailing is true, schedule a timeout to execute the latest arguments when the remainder of the interval expires.'
    },
    keywords: ['typescript', 'event loop', 'debounce', 'throttle', 'aria', 'accessibility', 'custom hook', 'cache', 'abortcontroller'],
    recommendedDifficulty: 'Medium',
  },
  {
    id: 'tier-3',
    years: '6 - 9 Years',
    title: 'Senior Frontend Engineer & Tech Lead',
    levels: 'Senior SDE · Tech Lead · L5 · E5 · ICT5',
    salary: '$230k - $420k total comp',
    badgeColor: '#a855f7',
    icon: '⚡',
    summary: 'Architects large-scale frontend applications, guarantees Core Web Vitals (LCP/INP/CLS), designs 60fps virtualization for 50k+ items, micro-frontends, security hardening (CSP/XSS), and design systems.',
    levelEquivalences: {
      'Google': 'L5 (Senior Software Engineer)',
      'Meta': 'E5 (Senior Software Engineer)',
      'Amazon': 'Senior SDE (L6)',
      'Apple': 'ICT5 (Senior Engineer)',
      'Microsoft': 'Level 63 - 64 (Senior SDE)',
      'Netflix': 'Senior Software Engineer',
      'Uber': 'Senior Software Engineer (L5)',
      'Stripe': 'L4 Senior Engineer'
    },
    studyPlan: {
      week1_2: 'Frontend System Design Framework: 4-Tier Architecture (UI, Store, Network, Edge).',
      week3_4: 'Core Web Vitals Mastery: LCP preloading, INP task scheduling (scheduler.yield), and CLS prevention.',
      week5_6: 'DOM Virtualization & Windowing: Building 60fps lists for 50,000+ items with dynamic heights.',
      week7_8: 'Frontend Security (CSP, Trusted Types, XSS) and Micro-Frontends with Module Federation.'
    },
    domainDeepDives: {
      jsTs: 'Memory profiling via Chrome DevTools Heap Snapshots, garbage collection behavior, and optimizing V8 inline caches.',
      reactFramework: 'React 19 Fiber reconciliation internals, Concurrent Mode batching, Transition API (`startTransition`), and React Server Components (RSC).',
      systemDesign: 'Designing high-throughput consumer platforms: Meta Messenger real-time chat, TikTok infinite video feed with adaptive HLS, and Google Docs presence indicators.',
      leadershipBehavioral: 'Navigating contentious architectural decisions, driving team-wide engineering velocity, mentoring juniors, and delivering quarterly OKRs.'
    },
    coreCompetencies: [
      'Frontend System Design: High-scale architecture, state normalization, client data contracts',
      'Core Web Vitals: LCP preloading, INP long-task splitting, CLS elimination',
      'DOM Virtualization & Windowing: 60fps rendering across 50,000+ items',
      'Micro-Frontends: Module Federation, Web Components, Decoupled Event Buses',
      'Security: CSP Headers, Trusted Types, DOMPurify, CSRF/XSS defense, HttpOnly cookies',
      'Build Tooling & Bundlers: Vite/Rollup tree-shaking, code-splitting, chunk optimization',
      'Design Systems: Multi-brand design token pipeline with zero-FOUC theme engines'
    ],
    interviewRubricExpectations: [
      'Deconstructs ambiguous product requirements into scalable 4-tier client architectures.',
      'Balances technical trade-offs (e.g. Normalized cache vs Nested state; SSR vs CSR vs SSG).',
      'Deep knowledge of browser rendering pipeline (Recalculate Styles, Layout, Composite).',
      'Mentors engineers, conducts architecture reviews, and leads engineering standards.',
    ],
    sampleSystemDesignTopic: 'Design an Infinite Scrolling Social Feed with virtualization, optimistic updates, and offline sync.',
    signatureInterviewProblem: {
      title: 'Dynamic Virtualized List with ResizeObserver',
      prompt: 'Design and implement a dynamic-height virtualized list container that maintains smooth 60fps scrolling over 100,000 variable-height items without layout shifts.',
      solutionSummary: 'Maintain a cumulative offset prefix-sum array and an in-memory item height cache. Use ResizeObserver on rendered items to dynamically update heights and recalculate cumulative offsets. Position rendered items using absolute CSS transforms.'
    },
    keywords: ['system design', 'virtual', 'lcp', 'inp', 'cls', 'performance', 'security', 'csp', 'module federation', 'micro-frontend'],
    recommendedDifficulty: 'Hard',
  },
  {
    id: 'tier-4',
    years: '10 - 15 Years',
    title: 'Staff & Principal Frontend Architect',
    levels: 'Staff SDE · Principal Engineer · Lead Architect · L6 · E6',
    salary: '$380k - $650k total comp',
    badgeColor: '#f59e0b',
    icon: '🏛️',
    summary: 'Shapes technical strategy across multiple organizations, builds distributed offline-first architectures (CRDTs/OT), Web Workers/WASM, multi-tier caching at 100M+ DAU scale, and establishes company-wide RFC governance.',
    levelEquivalences: {
      'Google': 'L6 (Staff SWE) / L7 (Senior Staff SWE)',
      'Meta': 'E6 (Staff Engineer) / E7 (Senior Staff)',
      'Amazon': 'Principal SDE (L7)',
      'Apple': 'ICT6 (Staff / Principal)',
      'Microsoft': 'Level 65 - 67 (Principal / Partner)',
      'Netflix': 'Staff Software Engineer / Lead Architect',
      'Uber': 'Staff Software Engineer (L6)',
      'Stripe': 'L5 Staff / Principal Engineer'
    },
    studyPlan: {
      week1_2: 'Distributed State & Real-Time Sync: CRDTs (Yjs/Automerge) vs Operational Transformation (OT).',
      week3_4: 'Browser Concurrency: Web Workers, SharedArrayBuffers, Atomics, and WebAssembly (WASM).',
      week5_6: 'Resilient Offline Architecture: IndexedDB Outbox Sync, Exponential Backoff + Jitter, and Idempotency.',
      week7_8: 'Organizational Architecture: Cross-organization RFC Governance, Design Token Scaling, and Strangler Fig Migrations.'
    },
    domainDeepDives: {
      jsTs: 'Compiling high-performance modules to WASM with Rust/C++, managing shared memory safely with SharedArrayBuffers and Web Workers.',
      reactFramework: 'Custom React reconcilers, Streaming Server-Side Rendering (SSR) with React Server Components, and zero-bundle-size client architectures.',
      systemDesign: 'Real-time collaborative workspaces (Figma canvas, Google Docs rich text editor) supporting 50+ concurrent live editors with deterministic conflict resolution.',
      leadershipBehavioral: 'Driving consensus across 100+ engineers, authoring company-wide architectural RFCs, unblocking cross-org dependencies, and executive tech evangelism.'
    },
    coreCompetencies: [
      'Distributed State & Real-Time Sync: CRDTs (Yjs/Automerge) vs Operational Transformation',
      'Heavy Computing in Browser: Web Workers, SharedArrayBuffer, WebAssembly (WASM)',
      'Edge & Streaming: React Server Components (RSC), SSR Streaming, Edge Compute Workers',
      'Resilient Offline Outbox: IndexedDB background sync, idempotency, retry jitter',
      'Cross-Team Architecture Governance: RFC processes, Design Tokens across 50+ squads',
      'Zero-Downtime Multi-Year Migrations: Strangler Fig pattern for legacy frontend monoliths',
      'Global Telemetry & Performance Budgets: RUM (Real User Monitoring) pipelines'
    ],
    interviewRubricExpectations: [
      'Defines comprehensive multi-system architecture with explicit failure recovery models.',
      'Demonstrates high business acumen: maps engineering choices directly to latency & revenue metrics.',
      'Exhibits mastery over multi-threading, concurrency locks, and memory budgets.',
      'Proven track record of cross-functional influence and organizational alignment.',
    ],
    sampleSystemDesignTopic: 'Design a Real-Time Collaborative Canvas / Rich Text Editor (Figma / Google Docs / Notion scale) with CRDTs.',
    signatureInterviewProblem: {
      title: 'Offline-First Outbox Synchronization Engine',
      prompt: 'Architect an enterprise-grade offline sync engine using IndexedDB and Service Worker background sync that guarantees exactly-once delivery with exponential jitter.',
      solutionSummary: 'Write mutations to an IndexedDB outbox table with idempotency keys. On reconnection, register a Service Worker Background Sync event that drains the queue sequentially. On 4xx/5xx errors, apply truncated exponential backoff with full jitter to avoid thundering herd on backend APIs.'
    },
    keywords: ['crdt', 'operational transformation', 'web worker', 'webassembly', 'wasm', 'rsc', 'edge', 'offline', 'indexeddb'],
    recommendedDifficulty: 'Hard',
  },
  {
    id: 'tier-5',
    years: '16 - 20+ Years',
    title: 'Distinguished Engineer / VP of Frontend',
    levels: 'Distinguished Engineer · Fellow · VP of Frontend · L7 · L8',
    salary: '$600k - $1.2M+ total comp',
    badgeColor: '#ef4444',
    icon: '👑',
    summary: 'Drives multi-year technological vision and multi-platform convergence (Web, React Native, Electron, WebGPU), understands browser engine internals (V8 TurboFan JIT, Chromium Blink), shapes TC39/W3C web standards, and optimizes multi-million dollar compute budgets.',
    levelEquivalences: {
      'Google': 'L8 (Principal SWE) / L9 (Distinguished SWE)',
      'Meta': 'E8 (Principal Engineer) / E9 (Distinguished)',
      'Amazon': 'Senior Principal SDE (L8) / VP',
      'Apple': 'Distinguished Engineer / Fellow',
      'Microsoft': 'Partner SWE / Technical Fellow (Level 68+)',
      'Netflix': 'VP of UI Engineering / Distinguished Architect',
      'Uber': 'Senior Staff / Principal Engineer (L7+)',
      'Stripe': 'Fellow / VP of Engineering'
    },
    studyPlan: {
      week1_2: 'Browser Engine Internals: V8 TurboFan JIT, Hidden Classes, Inline Caches, and Blink Rendering Pipelines.',
      week3_4: 'Multi-Platform Convergence: Cross-Platform Core Architecture (Web, React Native, Desktop Electron, WebGPU).',
      week5_6: 'Global Compute & Bandwidth Economics: Petabyte CDN Optimization and Cloud Compute ROI.',
      week7_8: 'Executive Tech Leadership: 3-5 Year Technology Roadmaps, Engineering Org Design, and M&A Technical Diligence.'
    },
    domainDeepDives: {
      jsTs: 'Deep compilation pipelines, understanding AST transformations, TC39 Stage 1-4 standard proposal lifecycle, and low-level V8 bytecode profiling.',
      reactFramework: 'Architecting cross-platform runtime engines, compiler-driven UI optimization, and next-generation WebGPU graphics engines.',
      systemDesign: 'Global multi-region frontend deployment topology for 500 Million Daily Active Users with edge hydration, geo-routing, and sub-100ms global TTFB.',
      leadershipBehavioral: 'Advising executive leadership, board-level technical risk mitigation, architecting engineering career ladders, and driving cultural transformation.'
    },
    coreCompetencies: [
      'Browser Engine Internals: V8 Hidden Classes, Inline Caches, TurboFan JIT, Chromium Blink pipelines',
      'Multi-Platform Architectural Convergence: Shared business logic across Web, Native, Desktop',
      'Web Standards Advocacy: W3C / TC39 proposal lifecycles and browser vendor collaboration',
      'Global Compute & Bandwidth Economics: Optimizing petabyte-scale CDN delivery costs',
      'Engineering Organization Design: Talent architecture, staff archetypes, and technical succession',
      'Executive Leadership: Navigating complex technical risk with C-suite stakeholders',
      'Technical Due Diligence: Evaluating frontend architecture for M&A acquisitions'
    ],
    interviewRubricExpectations: [
      'Articulates 3-to-5 year technology roadmaps and architectural foresight.',
      'Demonstrates deep browser compiler optimization and low-level memory layout.',
      'Commands executive presence with crisp communication of complex technical trade-offs.',
      'Fosters a world-class engineering culture that attracts and develops top industry talent.',
    ],
    sampleSystemDesignTopic: 'Design Global Frontend Infrastructure & Multi-Platform Client Runtime for 500 Million Daily Active Users.',
    signatureInterviewProblem: {
      title: 'Global Multi-Region Edge Frontend Infrastructure',
      prompt: 'Design an edge-rendered frontend architecture delivering sub-150ms P99 TTFB across 6 continents while cutting CDN egress bandwidth costs by 40%.',
      solutionSummary: 'Deploy distributed V8 edge compute workers at 300+ PoPs worldwide. Stream HTML chunks via React Server Components with stale-while-revalidate edge caching. Use Brotli/AVIF compression with automated dynamic image transcoding at the CDN edge.'
    },
    keywords: ['v8', 'jit', 'compiler', 'engine', 'standards', 'infrastructure', 'convergence', 'scale', 'architecture'],
    recommendedDifficulty: 'Hard',
  },
]

export default function ExperienceTracks() {
  const { questions } = useQuestions()
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const { isSolved, toggleSolved } = useProgress()
  const navigate = useNavigate()

  const [selectedTier, setSelectedTier] = useState<ExperienceTier>(TIERS[0])
  const [selectedTab, setSelectedTab] = useState<'overview' | 'deep-dives' | 'study-plan' | 'questions' | 'rubric'>('overview')

  // Curate questions matching selected tier
  const tierQuestions = useMemo(() => {
    if (!questions) return []
    const kws = selectedTier.keywords.map(k => k.toLowerCase())

    let filtered = questions.filter(q => {
      const text = `${q.question} ${q.category} ${q.answer}`.toLowerCase()
      return kws.some(kw => text.includes(kw))
    })

    if (selectedTier.recommendedDifficulty === 'Easy') {
      filtered = filtered.filter(q => q.difficulty === 'Easy' || q.difficulty === 'Medium')
    } else if (selectedTier.recommendedDifficulty === 'Hard') {
      filtered = filtered.filter(q => q.difficulty === 'Hard' || q.difficulty === 'Medium')
    }

    return filtered.slice(0, 30)
  }, [questions, selectedTier])

  // Tier Solved Count & Readiness
  const solvedCount = useMemo(() => {
    return tierQuestions.filter(q => isSolved(q.id)).length
  }, [tierQuestions, isSolved])

  const readinessScore = tierQuestions.length > 0
    ? Math.round((solvedCount / tierQuestions.length) * 100)
    : 0

  const launchTierMock = () => {
    navigate('/mock-interview')
  }

  return (
    <div className="experience-page page-enter">
      {/* Header */}
      <div className="experience-header">
        <div>
          <span className="exp-badge">🎯 0 to 20+ Years Comprehensive Career Matrix</span>
          <h1>Experience-Level Career Ladder &amp; Calibration</h1>
          <p className="subtitle">
            Exhaustive interview roadmaps, FAANG level equivalences, 8-week study plans, deep-dive domain competencies, and rubrics spanning 0 to 20+ years of engineering experience.
          </p>
        </div>
      </div>

      {/* 5-Tier Experience Progression Selector */}
      <div className="experience-tiers-grid">
        {TIERS.map(tier => (
          <button
            key={tier.id}
            type="button"
            className={`tier-card ${selectedTier.id === tier.id ? 'active' : ''}`}
            onClick={() => setSelectedTier(tier)}
          >
            <div className="tier-card-top">
              <span className="tier-icon">{tier.icon}</span>
              <span className="tier-years-tag">{tier.years}</span>
            </div>
            <h3 className="tier-title">{tier.title}</h3>
            <span className="tier-levels-sub">{tier.levels}</span>
            <span className="tier-salary-pill">{tier.salary}</span>
          </button>
        ))}
      </div>

      {/* Selected Tier Hero Dossier */}
      <div className="tier-dossier-hero">
        <div className="tier-hero-left">
          <div className="tier-hero-title-row">
            <span className="tier-hero-icon">{selectedTier.icon}</span>
            <div>
              <span className="tier-hero-exp-tag">{selectedTier.years} Track</span>
              <h2>{selectedTier.title} ({selectedTier.levels})</h2>
            </div>
          </div>
          <p className="tier-summary-text">{selectedTier.summary}</p>

          <div className="tier-meta-badges">
            <span className="t-badge">💰 Target Comp: <strong>{selectedTier.salary}</strong></span>
            <span className="t-badge">📊 Recommended Difficulty: <strong>{selectedTier.recommendedDifficulty}</strong></span>
          </div>
        </div>

        <div className="tier-hero-right">
          <div className="tier-readiness-card">
            <span className="readiness-label">Your {selectedTier.years} Readiness Score:</span>
            <div className="readiness-bar-wrap">
              <div className="readiness-bar-fill" style={{ width: `${readinessScore}%` }} />
            </div>
            <span className="readiness-sub">{solvedCount} / {tierQuestions.length} Curated Questions Mastered ({readinessScore}%)</span>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-lg launch-tier-mock-btn"
            onClick={launchTierMock}
          >
            🚀 Launch {selectedTier.years} Calibrated Mock
          </button>
        </div>
      </div>

      {/* Detail Tabs Bar */}
      <div className="tier-tabs-bar">
        <button
          type="button"
          className={`tier-tab ${selectedTab === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedTab('overview')}
        >
          📋 Core Competencies &amp; Level Matrix
        </button>
        <button
          type="button"
          className={`tier-tab ${selectedTab === 'deep-dives' ? 'active' : ''}`}
          onClick={() => setSelectedTab('deep-dives')}
        >
          🔍 Domain Deep Dives (JS/React/System/Leadership)
        </button>
        <button
          type="button"
          className={`tier-tab ${selectedTab === 'study-plan' ? 'active' : ''}`}
          onClick={() => setSelectedTab('study-plan')}
        >
          📅 8-Week Tailored Study Plan
        </button>
        <button
          type="button"
          className={`tier-tab ${selectedTab === 'questions' ? 'active' : ''}`}
          onClick={() => setSelectedTab('questions')}
        >
          📚 Calibrated Question Deck ({tierQuestions.length} Questions)
        </button>
        <button
          type="button"
          className={`tier-tab ${selectedTab === 'rubric' ? 'active' : ''}`}
          onClick={() => setSelectedTab('rubric')}
        >
          🏆 Interview Rubric &amp; Signature Problem
        </button>
      </div>

      {/* 1. OVERVIEW & LEVEL EQUIVALENCES TAB */}
      {selectedTab === 'overview' && (
        <div className="tier-overview-container">
          <div className="competencies-grid">
            <div className="comp-panel">
              <h3>Required Technical Competencies ({selectedTier.years})</h3>
              <ul className="comp-list">
                {selectedTier.coreCompetencies.map((c, i) => (
                  <li key={i}>
                    <span className="check-bullet">✓</span> {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="comp-panel">
              <h3>FAANG &amp; Tier-1 Level Equivalences</h3>
              <div className="level-equiv-grid">
                {Object.entries(selectedTier.levelEquivalences).map(([company, level]) => (
                  <div key={company} className="equiv-row">
                    <span className="equiv-company">{company}:</span>
                    <strong className="equiv-level">{level}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DOMAIN DEEP DIVES TAB */}
      {selectedTab === 'deep-dives' && (
        <div className="deep-dives-container">
          <div className="deep-dives-grid">
            <div className="deep-dive-card">
              <span className="dd-icon">⚡</span>
              <h4>JavaScript &amp; TypeScript Depth</h4>
              <p>{selectedTier.domainDeepDives.jsTs}</p>
            </div>

            <div className="deep-dive-card">
              <span className="dd-icon">⚛️</span>
              <h4>React &amp; Framework Architecture</h4>
              <p>{selectedTier.domainDeepDives.reactFramework}</p>
            </div>

            <div className="deep-dive-card">
              <span className="dd-icon">🏗️</span>
              <h4>Frontend System Design &amp; Web Vitals</h4>
              <p>{selectedTier.domainDeepDives.systemDesign}</p>
            </div>

            <div className="deep-dive-card">
              <span className="dd-icon">🤝</span>
              <h4>Leadership &amp; Behavioral (STAR)</h4>
              <p>{selectedTier.domainDeepDives.leadershipBehavioral}</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. 8-WEEK STUDY PLAN TAB */}
      {selectedTab === 'study-plan' && (
        <div className="study-plan-container">
          <div className="study-timeline">
            <div className="timeline-block">
              <span className="time-badge">Weeks 1 - 2</span>
              <h4>Phase 1: Foundations &amp; Core Mechanics</h4>
              <p>{selectedTier.studyPlan.week1_2}</p>
            </div>

            <div className="timeline-block">
              <span className="time-badge">Weeks 3 - 4</span>
              <h4>Phase 2: Complex Patterns &amp; Type Safety</h4>
              <p>{selectedTier.studyPlan.week3_4}</p>
            </div>

            <div className="timeline-block">
              <span className="time-badge">Weeks 5 - 6</span>
              <h4>Phase 3: Scale, Performance &amp; Virtualization</h4>
              <p>{selectedTier.studyPlan.week5_6}</p>
            </div>

            <div className="timeline-block">
              <span className="time-badge">Weeks 7 - 8</span>
              <h4>Phase 4: Full System Design &amp; Mock Simulation</h4>
              <p>{selectedTier.studyPlan.week7_8}</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. QUESTIONS TAB */}
      {selectedTab === 'questions' && (
        <div className="tier-questions-container">
          <div className="deck-cards-list">
            {tierQuestions.map((q: Question) => (
              <div key={q.id} className="deck-question-card">
                <div className="deck-card-top">
                  <div className="deck-card-tags">
                    <span className={`badge badge-category cat-${q.category.toLowerCase().replace(/[^a-z]+/g, '-')}`}>{q.category}</span>
                    <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                  </div>
                  <div className="deck-card-actions">
                    <button
                      type="button"
                      className={`solved-toggle-btn ${isSolved(q.id) ? 'solved' : ''}`}
                      onClick={() => toggleSolved(q.id)}
                    >
                      {isSolved(q.id) ? '✓ Solved' : '○ Mark Solved'}
                    </button>
                    <button
                      type="button"
                      className={`detail-bookmark-btn ${isBookmarked(q.id) ? 'bookmarked' : ''}`}
                      onClick={() => toggleBookmark(q.id)}
                    >
                      <span className="star-icon">★</span>
                    </button>
                  </div>
                </div>
                <h4 className="deck-q-title">{q.question}</h4>
                <div className="deck-q-footer">
                  <Link to={`/questions/${q.id}`} className="deck-practice-link">
                    Practice Question &amp; View Solution →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. RUBRIC & SIGNATURE PROBLEM TAB */}
      {selectedTab === 'rubric' && (
        <div className="tier-rubric-container">
          <div className="signature-problem-card">
            <span className="sig-badge">🌟 Signature Interview Problem for {selectedTier.years}</span>
            <h3>{selectedTier.signatureInterviewProblem.title}</h3>
            <p className="sig-prompt"><strong>Prompt:</strong> {selectedTier.signatureInterviewProblem.prompt}</p>
            <div className="sig-solution">
              <strong>Staff Architect Walkthrough:</strong>
              <p>{selectedTier.signatureInterviewProblem.solutionSummary}</p>
            </div>
          </div>

          <div className="rubric-summary-card">
            <h3>Hiring Committee Evaluation Rubric ({selectedTier.levels})</h3>
            <div className="rubric-expectations-list">
              {selectedTier.interviewRubricExpectations.map((exp, idx) => (
                <div key={idx} className="rubric-exp-item">
                  <span className="exp-num">{idx + 1}</span>
                  <p>{exp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
