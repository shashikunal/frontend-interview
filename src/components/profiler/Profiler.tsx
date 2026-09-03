import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './Profiler.css'

export interface PerformanceScenario {
  id: string
  title: string
  category: 'DOM' | 'Memory' | 'Main Thread' | 'React'
  difficulty: 'Medium' | 'Hard'
  summary: string
  rootCause: string
  fixExplanation: string
  unoptimizedCode: string
  optimizedCode: string
  unoptimizedMetrics: {
    fps: number
    frameTimeMs: number
    heapMb: number
    inpMs: number
    layoutRecalcs: number
    vitalsRating: 'Poor' | 'Needs Improvement' | 'Good'
  }
  optimizedMetrics: {
    fps: number
    frameTimeMs: number
    heapMb: number
    inpMs: number
    layoutRecalcs: number
    vitalsRating: 'Poor' | 'Needs Improvement' | 'Good'
  }
}

const SCENARIOS: PerformanceScenario[] = [
  {
    id: 'layout-thrashing',
    title: '1. Layout Thrashing & Forced Synchronous Layout',
    category: 'DOM',
    difficulty: 'Medium',
    summary: 'Interleaving DOM geometry reads (`offsetHeight`) and style writes in a loop causes the browser engine to force a synchronous layout recalculation on every iteration, dropping frame rate from 60fps to 12fps.',
    rootCause: 'Reading a layout property (`offsetHeight`, `offsetTop`, `clientWidth`, `getBoundingClientRect()`) invalidates the browser’s clean style tree if any preceding write occurred, forcing an expensive synchronous reflow on the CPU.',
    fixExplanation: 'Separate DOM reads from DOM writes into two distinct batches. Batch all geometry measurements first into memory, then batch all DOM mutations in a single write pass, reducing 50 layout recalcs to exactly 1.',
    unoptimizedCode: `// ❌ UNOPTIMIZED: Causes 50 Forced Synchronous Layouts
function resizeElements(elements: HTMLElement[]) {
  for (let i = 0; i < elements.length; i++) {
    // ⚠️ READ: Forces immediate synchronous layout recalc
    const height = elements[i].offsetHeight;
    
    // ⚠️ WRITE: Invalidates layout for the next iteration
    elements[i].style.height = \`\${height + 10}px\`;
  }
}`,
    optimizedCode: `// ✅ OPTIMIZED: Batched Reads followed by Batched Writes (1 Layout Recalc)
function resizeElements(elements: HTMLElement[]) {
  // 1. Batch all READS first
  const heights = elements.map(el => el.offsetHeight);

  // 2. Batch all WRITES together
  elements.forEach((el, i) => {
    el.style.height = \`\${heights[i] + 10}px\`;
  });
}`,
    unoptimizedMetrics: {
      fps: 14,
      frameTimeMs: 71.4,
      heapMb: 24.2,
      inpMs: 140,
      layoutRecalcs: 50,
      vitalsRating: 'Poor',
    },
    optimizedMetrics: {
      fps: 60,
      frameTimeMs: 3.8,
      heapMb: 24.3,
      inpMs: 16,
      layoutRecalcs: 1,
      vitalsRating: 'Good',
    },
  },
  {
    id: 'memory-leak',
    title: '2. Detached DOM Nodes & Event Listener Leaks',
    category: 'Memory',
    difficulty: 'Hard',
    summary: 'Removing UI elements from the DOM while dangling global event listeners or closures retain references prevents JavaScript garbage collection, leaking hundreds of megabytes of RAM over long user sessions.',
    rootCause: 'A removed DOM element remains in memory as a "Detached HTMLDivElement" because a closure inside `window.addEventListener` or an uncancelled interval retains an active reference to it.',
    fixExplanation: 'Use `AbortController.signal` to automatically clean up all associated event listeners when the component unmounts, or invoke explicit `removeEventListener` cleanup lifecycles.',
    unoptimizedCode: `// ❌ UNOPTIMIZED: Memory Leak (Dangling Listener Retains Detached Element)
function setupWidget(container: HTMLElement) {
  const bigData = new Array(500000).fill('leak_payload');

  window.addEventListener('resize', () => {
    // ⚠️ Closure retains container & bigData forever in memory!
    container.style.width = \`\${window.innerWidth}px\`;
    console.log(bigData.length);
  });
}`,
    optimizedCode: `// ✅ OPTIMIZED: Auto-Cleanup with AbortController Signal
function setupWidget(container: HTMLElement) {
  const controller = new AbortController();
  const bigData = new Array(500000).fill('payload');

  window.addEventListener('resize', () => {
    container.style.width = \`\${window.innerWidth}px\`;
  }, { signal: controller.signal });

  // Call when widget unmounts: immediately frees memory & detached DOM
  return () => controller.abort();
}`,
    unoptimizedMetrics: {
      fps: 48,
      frameTimeMs: 20.8,
      heapMb: 148.6,
      inpMs: 65,
      layoutRecalcs: 2,
      vitalsRating: 'Poor',
    },
    optimizedMetrics: {
      fps: 60,
      frameTimeMs: 4.1,
      heapMb: 28.4,
      inpMs: 15,
      layoutRecalcs: 1,
      vitalsRating: 'Good',
    },
  },
  {
    id: 'long-tasks',
    title: '3. Long Tasks & Main-Thread Freezing (INP)',
    category: 'Main Thread',
    difficulty: 'Hard',
    summary: 'A continuous 350ms synchronous calculation blocks the browser main thread, preventing user keystrokes, clicks, and animations from executing, resulting in a poor INP score of 360ms.',
    rootCause: 'JavaScript is single-threaded. Any synchronous loop taking >50ms is classified by Chrome as a "Long Task", starving the input event dispatcher and compositor thread.',
    fixExplanation: 'Break up the monolithic synchronous task into micro-chunks and yield control back to the browser event loop using `await scheduler.yield()` or `requestIdleCallback()`.',
    unoptimizedCode: `// ❌ UNOPTIMIZED: Blocks Main Thread for 350ms (Freezes UI)
function filterHugeDataset(items: string[]) {
  const results: string[] = [];
  // ⚠️ Synchronous blocking execution freezes all user clicks
  for (let i = 0; i < items.length; i++) {
    expensiveCryptoHash(items[i]);
    results.push(items[i]);
  }
  return results;
}`,
    optimizedCode: `// ✅ OPTIMIZED: Cooperative Multitasking with scheduler.yield()
async function filterHugeDataset(items: string[]) {
  const results: string[] = [];
  for (let i = 0; i < items.length; i++) {
    expensiveCryptoHash(items[i]);
    results.push(items[i]);

    // ⚡ Yield back to browser every 100 items to process user clicks
    if (i % 100 === 0 && 'scheduler' in window) {
      await (window as any).scheduler.yield();
    }
  }
  return results;
}`,
    unoptimizedMetrics: {
      fps: 8,
      frameTimeMs: 350.0,
      heapMb: 35.1,
      inpMs: 360,
      layoutRecalcs: 1,
      vitalsRating: 'Poor',
    },
    optimizedMetrics: {
      fps: 60,
      frameTimeMs: 5.2,
      heapMb: 35.4,
      inpMs: 18,
      layoutRecalcs: 1,
      vitalsRating: 'Good',
    },
  },
  {
    id: 'react-rerenders',
    title: '4. React Context Cascading Re-renders',
    category: 'React',
    difficulty: 'Medium',
    summary: 'Passing un-memoized object literals to React Context Provider triggers unnecessary reconciliation passes across 500 child components on every single keystroke.',
    rootCause: 'Creating a new object literal `value={{ user, theme }}` creates a new memory reference on every render, causing all `useContext` subscribers to re-render regardless of whether properties changed.',
    fixExplanation: 'Wrap the context value in `useMemo` and separate high-frequency transient state (e.g. text input) from low-frequency global state (e.g. user authentication / theme).',
    unoptimizedCode: `// ❌ UNOPTIMIZED: New object reference allocated on every keystroke
function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('dark');
  const [search, setSearch] = useState('');

  // ⚠️ 500 child components re-render whenever 'search' changes!
  return (
    <AppContext.Provider value={{ theme, setTheme, search, setSearch }}>
      {children}
    </AppContext.Provider>
  );
}`,
    optimizedCode: `// ✅ OPTIMIZED: Memoized Context Value with useMemo
function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('dark');
  const [search, setSearch] = useState('');

  // ⚡ Context reference only updates when theme actually changes
  const contextValue = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}`,
    unoptimizedMetrics: {
      fps: 22,
      frameTimeMs: 45.4,
      heapMb: 42.0,
      inpMs: 95,
      layoutRecalcs: 1,
      vitalsRating: 'Needs Improvement',
    },
    optimizedMetrics: {
      fps: 60,
      frameTimeMs: 2.1,
      heapMb: 38.2,
      inpMs: 14,
      layoutRecalcs: 1,
      vitalsRating: 'Good',
    },
  },
]

export default function Profiler() {
  const [selectedScenario, setSelectedScenario] = useState<PerformanceScenario>(SCENARIOS[0])
  const [activeTab, setActiveTab] = useState<'unoptimized' | 'optimized'>('unoptimized')
  const [isBenchmarking, setIsBenchmarking] = useState(false)
  const [currentFps, setCurrentFps] = useState(60)
  const [benchmarkCompleted, setBenchmarkCompleted] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animRef = useRef<number | null>(null)

  const activeMetrics = activeTab === 'optimized'
    ? selectedScenario.optimizedMetrics
    : selectedScenario.unoptimizedMetrics

  // Live Canvas Sandbox Animation simulating frame drops vs 60fps smoothness
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let x = 0
    let lastTime = performance.now()
    let frameCount = 0
    let fpsTimer = performance.now()

    const targetFps = isBenchmarking
      ? (activeTab === 'optimized' ? selectedScenario.optimizedMetrics.fps : selectedScenario.unoptimizedMetrics.fps)
      : (activeTab === 'optimized' ? 60 : selectedScenario.unoptimizedMetrics.fps)

    const frameDelay = 1000 / targetFps

    const renderLoop = (now: number) => {
      const delta = now - lastTime

      if (delta >= frameDelay) {
        lastTime = now - (delta % frameDelay)

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw moving test square
        x = (x + 3) % (canvas.width - 40)

        // Draw track
        ctx.fillStyle = '#1e293b'
        ctx.fillRect(0, 45, canvas.width, 10)

        // Draw animated projectile
        ctx.fillStyle = activeTab === 'optimized' ? '#10b981' : '#ef4444'
        ctx.beginPath()
        ctx.arc(x + 20, 50, 16, 0, Math.PI * 2)
        ctx.fill()

        // Draw telemetry label
        ctx.font = '11px sans-serif'
        ctx.fillStyle = '#94a3b8'
        ctx.fillText(`Simulated Rendering: ${targetFps} FPS (${targetFps === 60 ? 'Smooth 60fps' : 'Janky / Frame Drops'})`, 10, 25)

        frameCount++
      }

      if (now - fpsTimer >= 500) {
        const calculatedFps = Math.round((frameCount * 1000) / (now - fpsTimer))
        setCurrentFps(Math.min(60, calculatedFps))
        frameCount = 0
        fpsTimer = now
      }

      animRef.current = requestAnimationFrame(renderLoop)
    }

    animRef.current = requestAnimationFrame(renderLoop)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [selectedScenario, activeTab, isBenchmarking])

  const runBenchmark = () => {
    setIsBenchmarking(true)
    setBenchmarkCompleted(false)

    setTimeout(() => {
      setIsBenchmarking(false)
      setBenchmarkCompleted(true)
    }, 2000)
  }

  return (
    <div className="profiler-page page-enter">
      {/* Header */}
      <div className="profiler-header">
        <div>
          <span className="profiler-badge">⚡ Interactive Web Vitals &amp; Performance Lab</span>
          <h1>Frontend Performance Profiler &amp; Benchmarking Lab</h1>
          <p className="subtitle">
            Diagnose, benchmark, and resolve real-world performance bottlenecks: layout thrashing, memory leaks, long tasks, and un-memoized React re-renders.
          </p>
        </div>
      </div>

      {/* Scenario Selector Pills */}
      <div className="scenario-pills-row">
        {SCENARIOS.map(s => (
          <button
            key={s.id}
            type="button"
            className={`scenario-pill ${selectedScenario.id === s.id ? 'active' : ''}`}
            onClick={() => {
              setSelectedScenario(s)
              setBenchmarkCompleted(false)
            }}
          >
            <span className="pill-cat">{s.category}</span>
            <span className="pill-title">{s.title}</span>
          </button>
        ))}
      </div>

      {/* Main Profiler Layout */}
      <div className="profiler-main-grid">
        {/* Left Column: Code Comparison & Explanation */}
        <div className="profiler-code-column">
          <div className="scenario-summary-card">
            <div className="summary-header">
              <h3>{selectedScenario.title}</h3>
              <span className={`diff-tag diff-${selectedScenario.difficulty.toLowerCase()}`}>
                {selectedScenario.difficulty} Difficulty
              </span>
            </div>
            <p className="summary-desc">{selectedScenario.summary}</p>

            <div className="root-cause-box">
              <strong>Root Cause:</strong>
              <p>{selectedScenario.rootCause}</p>
            </div>
          </div>

          {/* Code Viewer Card with Toggle */}
          <div className="code-diff-card">
            <div className="diff-tabs-bar">
              <button
                type="button"
                className={`diff-tab-btn ${activeTab === 'unoptimized' ? 'active tab-bad' : ''}`}
                onClick={() => {
                  setActiveTab('unoptimized')
                  setBenchmarkCompleted(false)
                }}
              >
                ❌ Unoptimized (Root Cause)
              </button>
              <button
                type="button"
                className={`diff-tab-btn ${activeTab === 'optimized' ? 'active tab-good' : ''}`}
                onClick={() => {
                  setActiveTab('optimized')
                  setBenchmarkCompleted(false)
                }}
              >
                ⚡ Optimized Fix (Staff Architect)
              </button>
            </div>

            <pre className="profiler-code-block">
              <code>
                {activeTab === 'unoptimized' ? selectedScenario.unoptimizedCode : selectedScenario.optimizedCode}
              </code>
            </pre>

            <div className="fix-explanation-footer">
              <strong>Architectural Fix:</strong>
              <p>{selectedScenario.fixExplanation}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Live Telemetry & Benchmark Runner */}
        <div className="profiler-telemetry-column">
          {/* Live Frame Canvas Sandbox */}
          <div className="canvas-sandbox-card">
            <div className="sandbox-header">
              <h4>Live Browser Rendering Sandbox</h4>
              <span className={`fps-live-badge ${currentFps < 30 ? 'bad' : 'good'}`}>
                {currentFps} FPS
              </span>
            </div>
            <canvas ref={canvasRef} width={380} height={100} className="sandbox-canvas" />
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="metrics-telemetry-card">
            <h4>Performance Telemetry Dashboard</h4>

            <div className="metrics-gauges-grid">
              <div className="gauge-box">
                <span className="gauge-label">Frame Rate</span>
                <span className={`gauge-val ${activeMetrics.fps === 60 ? 'good' : 'bad'}`}>
                  {activeMetrics.fps} <small>FPS</small>
                </span>
                <span className="gauge-target">Target: 60 FPS</span>
              </div>

              <div className="gauge-box">
                <span className="gauge-label">Frame Time</span>
                <span className={`gauge-val ${activeMetrics.frameTimeMs <= 16.6 ? 'good' : 'bad'}`}>
                  {activeMetrics.frameTimeMs} <small>ms</small>
                </span>
                <span className="gauge-target">Budget: &lt; 16.6ms</span>
              </div>

              <div className="gauge-box">
                <span className="gauge-label">INP (Latency)</span>
                <span className={`gauge-val ${activeMetrics.inpMs <= 50 ? 'good' : 'bad'}`}>
                  {activeMetrics.inpMs} <small>ms</small>
                </span>
                <span className="gauge-target">Rating: {activeMetrics.vitalsRating}</span>
              </div>

              <div className="gauge-box">
                <span className="gauge-label">Heap Memory</span>
                <span className="gauge-val good">
                  {activeMetrics.heapMb} <small>MB</small>
                </span>
                <span className="gauge-target">Layout Recalcs: {activeMetrics.layoutRecalcs}</span>
              </div>
            </div>

            {/* Benchmark Action Button */}
            <button
              type="button"
              className={`btn btn-lg run-benchmark-btn ${isBenchmarking ? 'btn-secondary' : 'btn-primary'}`}
              disabled={isBenchmarking}
              onClick={runBenchmark}
            >
              {isBenchmarking ? '⏳ Running 2s Performance Profile...' : '▶ Run Live Performance Benchmark'}
            </button>

            {benchmarkCompleted && (
              <div className={`benchmark-result-alert ${activeTab === 'optimized' ? 'alert-success' : 'alert-warning'}`}>
                {activeTab === 'optimized' ? (
                  <>
                    <strong>✅ Benchmark Passed!</strong> Zero frame drops detected. Frame time is within the 16.6ms 60fps budget.
                  </>
                ) : (
                  <>
                    <strong>⚠️ Performance Warning!</strong> High main-thread blocking time detected. Frame rate dropped to {activeMetrics.fps} FPS. Switch to the Optimized tab to see the fix!
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="profiler-footer">
        <Link to="/system-design" className="btn btn-secondary">
          📐 Open System Design Studio
        </Link>
        <Link to="/mock-interview" className="btn btn-primary">
          ⏱️ Take a Full Mock Interview →
        </Link>
      </div>
    </div>
  )
}
