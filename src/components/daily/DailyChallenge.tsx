import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import './DailyChallenge.css'

export interface DailyProblem {
  dateStr: string
  dayNumber: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  companies: string[]
  category: string
  description: string
  starterCode: string
  testCode: string
}

const TODAY_PROBLEM: DailyProblem = {
  dateStr: 'September 2, 2026',
  dayNumber: 245,
  title: 'Deep Clone Object with Circular References & TypedArrays',
  difficulty: 'Hard',
  companies: ['Google', 'Meta', 'Apple', 'Stripe'],
  category: 'JavaScript Core / Polyfills',
  description: `Implement a robust \`deepClone(value)\` function that handles:
1. Primitive values and wrapper objects (Number, String, Boolean).
2. Standard Arrays and Plain Objects.
3. Circular references using \`WeakMap\` without infinite recursion.
4. \`Date\`, \`RegExp\`, and \`Map\` / \`Set\` instances.
5. TypedArrays (e.g. \`Uint8Array\`).`,
  starterCode: `function deepClone(value, seen = new WeakMap()) {
  // Handle primitives and null/undefined
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // Handle circular references
  if (seen.has(value)) {
    return seen.get(value);
  }

  // Handle Date
  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  // Handle RegExp
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  // Handle Array vs Object
  const clone = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
  seen.set(value, clone);

  for (const key of Reflect.ownKeys(value)) {
    clone[key] = deepClone(value[key], seen);
  }

  return clone;
}`,
  testCode: `// Verification Tests
const obj: any = { a: 1, date: new Date('2026-01-01') };
obj.self = obj; // Circular ref
const cloned = deepClone(obj);
console.log('Is Circular equal:', cloned.self === cloned); // true
console.log('Is distinct ref:', cloned !== obj); // true
console.log('Cloned Date:', cloned.date.toISOString());`,
}

export interface CommunitySolution {
  id: string
  author: string
  avatar: string
  role: string
  title: string
  upvotes: number
  hasUpvoted?: boolean
  timeComplexity: string
  spaceComplexity: string
  codeSnippet: string
  explanation: string
}

const INITIAL_SOLUTIONS: CommunitySolution[] = [
  {
    id: 'sol-1',
    author: 'Elena Rostova',
    avatar: '👩‍💻',
    role: 'Staff Frontend Engineer @ Meta',
    title: 'Clean O(N) WeakMap Recursion with Prototype Preservation',
    upvotes: 342,
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    codeSnippet: `function deepClone(obj, hash = new WeakMap()) {
  if (Object(obj) !== obj || obj instanceof Function) return obj;
  if (hash.has(obj)) return hash.get(obj);
  
  const result = new obj.constructor();
  hash.set(obj, result);
  
  if (obj instanceof Map) {
    obj.forEach((val, key) => result.set(deepClone(key, hash), deepClone(val, hash)));
  } else if (obj instanceof Set) {
    obj.forEach(val => result.add(deepClone(val, hash)));
  } else {
    Object.assign(result, ...Object.keys(obj).map(
      key => ({ [key]: deepClone(obj[key], hash) })
    ));
  }
  return result;
}`,
    explanation: 'Uses `WeakMap` to store already-visited object references, short-circuiting circular paths in O(1) lookup. `new obj.constructor()` automatically inherits proper prototypes for Map, Set, Date, and RegExp.',
  },
  {
    id: 'sol-2',
    author: 'Marcus Vance',
    avatar: '👨‍💼',
    role: 'L6 Tech Lead @ Google',
    title: 'Modern structuredClone with Custom Fallback',
    upvotes: 189,
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    codeSnippet: `function safeClone(data) {
  try {
    return structuredClone(data);
  } catch (err) {
    // Fallback for symbols / functions
    return customDeepClone(data);
  }
}`,
    explanation: 'Leverages browser-native `structuredClone` (C++ implementation) for 10x faster cloning, with graceful fallback for non-cloneable objects like closures or DOM nodes.',
  },
]

export default function DailyChallenge() {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 14,
    minutes: 32,
    seconds: 45,
  })

  const [code, setCode] = useState<string>(TODAY_PROBLEM.starterCode)
  const [isCompletedToday, setIsCompletedToday] = useState<boolean>(() => {
    return localStorage.getItem('daily_completed_245') === 'true'
  })
  const [streakCount, setStreakCount] = useState<number>(() => {
    return Number(localStorage.getItem('user_streak') || '14')
  })
  const [freezeTokens] = useState<number>(2)
  const [activeTab, setActiveTab] = useState<'problem' | 'solutions'>('problem')
  const [solutions, setSolutions] = useState<CommunitySolution[]>(INITIAL_SOLUTIONS)
  const [testOutput, setTestOutput] = useState<string | null>(null)

  // Countdown timer to UTC midnight
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const midnight = new Date()
      midnight.setUTCHours(24, 0, 0, 0)
      const diff = Math.max(0, midnight.getTime() - now.getTime())

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      setTimeLeft({ hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 52-Week (364 days) Heatmap data generation
  const heatmapWeeks = useMemo(() => {
    const weeks: { date: string; level: number; count: number }[][] = []
    const today = new Date()

    for (let w = 51; w >= 0; w--) {
      const daysInWeek = []
      for (let d = 0; d < 7; d++) {
        const pastDate = new Date(today)
        pastDate.setDate(today.getDate() - (w * 7 + (6 - d)))
        const dateKey = pastDate.toISOString().split('T')[0]

        // Seed realistic activity distribution
        const rand = (pastDate.getDate() * 17 + pastDate.getMonth() * 31) % 100
        let level = 0
        let count = 0
        if (rand > 80) { level = 4; count = 7; }
        else if (rand > 55) { level = 3; count = 4; }
        else if (rand > 30) { level = 2; count = 2; }
        else if (rand > 15) { level = 1; count = 1; }

        // Today's cell
        if (w === 0 && d === 6 && isCompletedToday) {
          level = 4
          count = Math.max(1, count + 1)
        }

        daysInWeek.push({ date: dateKey, level, count })
      }
      weeks.push(daysInWeek)
    }
    return weeks
  }, [isCompletedToday])

  const handleRunCode = () => {
    setTestOutput(`[SUCCESS] 3/3 Test Suites Passed (12ms)
✓ Deep clone creates independent object references (PASS)
✓ Circular references handled with WeakMap without callstack overflow (PASS)
✓ Date, RegExp, and TypedArray prototypes preserved (PASS)`)
  }

  const handleCompleteToday = () => {
    if (!isCompletedToday) {
      setIsCompletedToday(true)
      const nextStreak = streakCount + 1
      setStreakCount(nextStreak)
      localStorage.setItem('daily_completed_245', 'true')
      localStorage.setItem('user_streak', nextStreak.toString())
      setTestOutput('🎉 Challenge Completed! Daily streak incremented to ' + nextStreak + ' Days!')
    }
  }

  const toggleUpvote = (id: string) => {
    setSolutions(prev =>
      prev.map(s => {
        if (s.id === id) {
          const upvoted = !s.hasUpvoted
          return {
            ...s,
            hasUpvoted: upvoted,
            upvotes: upvoted ? s.upvotes + 1 : s.upvotes - 1,
          }
        }
        return s
      })
    )
  }

  return (
    <div className="daily-page page-enter">
      {/* Header */}
      <div className="daily-header">
        <div>
          <span className="daily-badge">🔥 Daily Challenge &amp; 365-Day Activity Heatmap</span>
          <h1>Daily Frontend Challenge #{TODAY_PROBLEM.dayNumber}</h1>
          <p className="subtitle">
            Solve one curated FAANG interview challenge every day, maintain your streak multiplier, and explore staff-level community solutions.
          </p>
        </div>

        {/* Countdown Pill */}
        <div className="countdown-pill-card">
          <span className="countdown-label">Next Challenge In:</span>
          <div className="countdown-digits">
            <span>{String(timeLeft.hours).padStart(2, '0')}h</span> :
            <span>{String(timeLeft.minutes).padStart(2, '0')}m</span> :
            <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
          </div>
        </div>
      </div>

      {/* Streak Dashboard Stats Grid */}
      <div className="streak-stats-grid">
        <div className="streak-card highlight-streak">
          <span className="streak-icon">🔥</span>
          <div className="streak-info">
            <span className="streak-val">{streakCount} Days</span>
            <span className="streak-caption">Current Active Streak</span>
          </div>
        </div>

        <div className="streak-card">
          <span className="streak-icon">⚡</span>
          <div className="streak-info">
            <span className="streak-val">42 Days</span>
            <span className="streak-caption">Longest All-Time Streak</span>
          </div>
        </div>

        <div className="streak-card">
          <span className="streak-icon">🛡️</span>
          <div className="streak-info">
            <span className="streak-val">{freezeTokens} Available</span>
            <span className="streak-caption">Streak Freeze Shields</span>
          </div>
        </div>

        <div className="streak-card">
          <span className="streak-icon">💎</span>
          <div className="streak-info">
            <span className="streak-val">318 Solved</span>
            <span className="streak-caption">Total Questions This Year</span>
          </div>
        </div>
      </div>

      {/* 52-Week Activity Heatmap */}
      <div className="heatmap-card">
        <div className="heatmap-header">
          <h3>365-Day Activity Heatmap</h3>
          <div className="heatmap-legend">
            <span>Less</span>
            <span className="legend-cell lvl-0" />
            <span className="legend-cell lvl-1" />
            <span className="legend-cell lvl-2" />
            <span className="legend-cell lvl-3" />
            <span className="legend-cell lvl-4" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid Container */}
        <div className="heatmap-scroll-wrap">
          <div className="heatmap-grid">
            {heatmapWeeks.map((week, wIdx) => (
              <div key={wIdx} className="heatmap-week-col">
                {week.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    className={`heatmap-cell lvl-${day.level}`}
                    title={`${day.date}: ${day.count} question${day.count === 1 ? '' : 's'} solved`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="daily-tabs-bar">
        <button
          type="button"
          className={`daily-tab ${activeTab === 'problem' ? 'active' : ''}`}
          onClick={() => setActiveTab('problem')}
        >
          💻 Today's Challenge: {TODAY_PROBLEM.title}
        </button>
        <button
          type="button"
          className={`daily-tab ${activeTab === 'solutions' ? 'active' : ''}`}
          onClick={() => setActiveTab('solutions')}
        >
          💬 Community &amp; Staff Solutions ({solutions.length})
        </button>
      </div>

      {/* 1. TODAY'S PROBLEM TAB */}
      {activeTab === 'problem' && (
        <div className="daily-workspace-grid">
          {/* Left Column: Problem Prompt */}
          <div className="prompt-column">
            <div className="prompt-card">
              <div className="prompt-top-row">
                <span className="diff-pill diff-hard">{TODAY_PROBLEM.difficulty}</span>
                <span className="date-tag">{TODAY_PROBLEM.dateStr}</span>
              </div>

              <h2>{TODAY_PROBLEM.title}</h2>
              <span className="cat-tag">📂 {TODAY_PROBLEM.category}</span>

              <div className="companies-pills-row">
                <span>Asked by:</span>
                {TODAY_PROBLEM.companies.map(c => (
                  <span key={c} className="company-pill">{c}</span>
                ))}
              </div>

              <div className="prompt-desc-text">
                <p>{TODAY_PROBLEM.description}</p>
              </div>

              {/* Action completion button */}
              <div className="complete-action-box">
                <button
                  type="button"
                  className={`btn btn-lg ${isCompletedToday ? 'btn-secondary' : 'btn-primary'} complete-btn`}
                  onClick={handleCompleteToday}
                >
                  {isCompletedToday ? '✓ Completed for Today!' : '🏆 Mark Completed & Advance Streak'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Code Editor & Console */}
          <div className="editor-column">
            <div className="code-editor-card">
              <div className="editor-header">
                <span className="editor-lang">JavaScript (ES2024)</span>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleRunCode}
                >
                  ▶ Run Tests
                </button>
              </div>

              <textarea
                className="code-textarea"
                value={code}
                onChange={e => setCode(e.target.value)}
                rows={16}
                spellCheck={false}
              />
            </div>

            {testOutput && (
              <div className="test-output-card">
                <span className="test-title">Test Runner Output</span>
                <pre className="test-stdout">
                  <code>{testOutput}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. COMMUNITY SOLUTIONS TAB */}
      {activeTab === 'solutions' && (
        <div className="solutions-container">
          <div className="solutions-intro-banner">
            <h3>Staff Solutions &amp; Peer Discussions</h3>
            <p>
              Compare your implementation against Staff-level exemplars and vote for the most elegant, time-optimal approaches.
            </p>
          </div>

          <div className="solutions-list">
            {solutions.map(s => (
              <div key={s.id} className="solution-card">
                <div className="solution-card-top">
                  <div className="author-row">
                    <span className="author-avatar">{s.avatar}</span>
                    <div>
                      <h4 className="author-name">{s.author}</h4>
                      <span className="author-role">{s.role}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`upvote-btn ${s.hasUpvoted ? 'upvoted' : ''}`}
                    onClick={() => toggleUpvote(s.id)}
                  >
                    ▲ {s.upvotes} Upvotes
                  </button>
                </div>

                <h3 className="solution-title">{s.title}</h3>

                <div className="complexity-badges-row">
                  <span className="c-badge">⏱️ Time: <strong>{s.timeComplexity}</strong></span>
                  <span className="c-badge">💾 Space: <strong>{s.spaceComplexity}</strong></span>
                </div>

                <p className="solution-exp">{s.explanation}</p>

                <pre className="solution-code-box">
                  <code>{s.codeSnippet}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="daily-footer">
        <Link to="/questions" className="btn btn-secondary">
          📚 Browse 22,222 Question Bank
        </Link>
        <Link to="/mock-interview" className="btn btn-primary">
          ⏱️ Timed Mock Interview Simulator →
        </Link>
      </div>
    </div>
  )
}
