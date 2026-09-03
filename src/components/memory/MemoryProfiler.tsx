import { useState } from 'react'
import { Link } from 'react-router-dom'
import './MemoryProfiler.css'

export interface LeakScenario {
  id: string
  title: string
  badge: string
  description: string
  badCode: string
  goodCode: string
  leakSizeMb: number
}

const LEAK_SCENARIOS: LeakScenario[] = [
  {
    id: 'detached-dom',
    title: '1. Detached DOM Tree Leak',
    badge: 'DOM Closure Retainer',
    description: 'DOM nodes are removed from document.body using removeChild(), but JavaScript variables or closures still hold references to them, preventing V8 GC reclamation.',
    badCode: `// ❌ BUG: Retaining detached DOM nodes in memory
const detachedNodes = [];

function removeList() {
  const container = document.getElementById('user-list');
  // Removed from visible DOM, but saved in JS array:
  detachedNodes.push(container);
  container.parentNode.removeChild(container);
}`,
    goodCode: `// ✅ FIX: Allow GC by breaking all JavaScript references
function removeList() {
  const container = document.getElementById('user-list');
  container.parentNode.removeChild(container);
  // Break references:
  container = null;
}`,
    leakSizeMb: 18.5,
  },
  {
    id: 'dangling-listeners',
    title: '2. Dangling Global Event Listeners',
    badge: 'Window Listener Leak',
    description: 'Components attach event listeners to window or document on mount, but fail to call removeEventListener on unmount, keeping entire component scopes alive in memory.',
    badCode: `// ❌ BUG: Listener retains component scope forever
function DataFeed() {
  const [data, setData] = useState(largeDataset);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      console.log('Scroll pos:', window.scrollY, data.length);
    });
    // Missing return cleanup function!
  }, []);
}`,
    goodCode: `// ✅ FIX: Clean up with AbortController or removeEventListener
function DataFeed() {
  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener('scroll', handleScroll, {
      signal: controller.signal
    });

    return () => controller.abort(); // Automatic cleanup on unmount
  }, []);
}`,
    leakSizeMb: 14.0,
  },
  {
    id: 'uncleaned-intervals',
    title: '3. Uncleaned Interval Timers',
    badge: 'Timer Scope Leak',
    description: 'setInterval timers continue firing after a component unmounts, capturing state variables in closure scope and preventing garbage collection.',
    badCode: `// ❌ BUG: Timer continues firing indefinitely
function RealtimeTicker() {
  const [metrics, setMetrics] = useState(payloadBuffer);

  useEffect(() => {
    setInterval(() => {
      fetchMetrics(metrics);
    }, 1000);
    // Missing clearInterval!
  }, []);
}`,
    goodCode: `// ✅ FIX: Clear timer in useEffect return function
function RealtimeTicker() {
  useEffect(() => {
    const timerId = setInterval(fetchMetrics, 1000);
    return () => clearInterval(timerId); // Cleared on unmount
  }, []);
}`,
    leakSizeMb: 12.5,
  },
  {
    id: 'unbounded-cache',
    title: '4. Unbounded Cache (Accidental Globals)',
    badge: 'Unbounded Growth',
    description: 'Adding items to an in-memory Object or Array cache without an eviction policy (LRU) or using Strong references instead of WeakMap.',
    badCode: `// ❌ BUG: Cache grows indefinitely without bounds
const userCache = new Map();

function cacheUserProfile(user) {
  // Strongly references entire user DOM tree and metadata
  userCache.set(user.id, user);
}`,
    goodCode: `// ✅ FIX: Use WeakMap for automatic GC or an LRU Cache
const userCache = new WeakMap(); // Automatically garbage collected when user object is unreferenced

// Or bounded LRU Cache:
const lruCache = new LRUCache({ max: 500, ttl: 1000 * 60 * 5 });`,
    leakSizeMb: 24.0,
  },
]

export default function MemoryProfiler() {
  const [heapUsed, setHeapUsed] = useState<number>(28.4)
  const [heapAllocated] = useState<number>(64.0)
  const [maxHeapLimit] = useState<number>(128.0)
  const [activeLeaks, setActiveLeaks] = useState<Record<string, boolean>>({})
  const [gcLog, setGcLog] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'sandbox' | 'gc-visualizer' | 'cheatsheet'>('sandbox')

  // Toggle Memory Leak Injection
  const handleToggleLeak = (scenario: LeakScenario) => {
    const isCurrentlyLeaking = !!activeLeaks[scenario.id]

    if (isCurrentlyLeaking) {
      // Fix leak
      setActiveLeaks(prev => ({ ...prev, [scenario.id]: false }))
      setHeapUsed(prev => Math.max(28.4, Number((prev - scenario.leakSizeMb).toFixed(1))))
      setGcLog(`✅ Fixed "${scenario.title}"! Reclaimed ${scenario.leakSizeMb} MB of heap memory.`)
    } else {
      // Inject leak
      setActiveLeaks(prev => ({ ...prev, [scenario.id]: true }))
      setHeapUsed(prev => Math.min(maxHeapLimit, Number((prev + scenario.leakSizeMb).toFixed(1))))
      setGcLog(`⚠️ Leaked ${scenario.leakSizeMb} MB from "${scenario.title}"! Retained in V8 heap.`)
    }
  }

  // Force GC (Mark-and-Sweep)
  const handleForceGC = () => {
    const leakedMb = Object.entries(activeLeaks).reduce((acc, [id, active]) => {
      if (active) {
        const item = LEAK_SCENARIOS.find(s => s.id === id)
        return acc + (item ? item.leakSizeMb : 0)
      }
      return acc
    }, 0)

    if (leakedMb === 0) {
      setHeapUsed(28.4)
      setGcLog('🧹 Garbage Collection Ran: No unreachable objects found. Base heap is optimal at 28.4 MB.')
    } else {
      setGcLog(`⚠️ Garbage Collection Sweep: ${leakedMb.toFixed(1)} MB cannot be reclaimed because JavaScript closures hold active references to GC Roots! Fix leaks to release.`)
    }
  }

  const heapPercent = Math.min(100, Math.round((heapUsed / maxHeapLimit) * 100))

  return (
    <div className="memory-page page-enter">
      {/* Header */}
      <div className="memory-header">
        <div>
          <span className="memory-badge">🧠 V8 Engine &amp; Garbage Collection Profiler</span>
          <h1>Memory Leak &amp; GC Heap Profiler</h1>
          <p className="subtitle">
            Diagnose retained closure references, simulate Mark-and-Sweep garbage collection, and eliminate detached DOM and event listener memory leaks.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary force-gc-btn"
          onClick={handleForceGC}
        >
          🧹 Force Garbage Collection (GC)
        </button>
      </div>

      {/* Heap Memory Telemetry Card */}
      <div className="heap-telemetry-card">
        <div className="telemetry-header">
          <div className="telemetry-info">
            <span className="telemetry-title">V8 JavaScript Heap Usage</span>
            <span className="telemetry-status">
              {heapPercent > 70 ? '🚨 CRITICAL (High Memory Pressure)' : heapPercent > 45 ? '⚠️ WARNING (Leaks Detected)' : '✅ HEALTHY'}
            </span>
          </div>
          <div className="heap-stat-values">
            <strong>{heapUsed} MB</strong> / {maxHeapLimit} MB ({heapPercent}%)
          </div>
        </div>

        {/* Progress bar */}
        <div className="heap-bar-track">
          <div
            className={`heap-bar-fill ${heapPercent > 70 ? 'critical' : heapPercent > 45 ? 'warning' : 'healthy'}`}
            style={{ width: `${heapPercent}%` }}
          />
        </div>

        <div className="heap-sub-stats">
          <span>Allocated Heap: <strong>{heapAllocated} MB</strong></span>
          <span>Active Leak Retainers: <strong>{Object.values(activeLeaks).filter(Boolean).length}</strong></span>
          <span>Baseline App Memory: <strong>28.4 MB</strong></span>
        </div>

        {gcLog && (
          <div className={`gc-log-banner ${gcLog.includes('✅') || gcLog.includes('optimal') ? 'log-success' : 'log-warn'}`}>
            {gcLog}
          </div>
        )}
      </div>

      {/* Mode Tabs */}
      <div className="memory-tabs-bar">
        <button
          type="button"
          className={`mem-tab ${activeTab === 'sandbox' ? 'active' : ''}`}
          onClick={() => setActiveTab('sandbox')}
        >
          💥 4 Interactive Memory Leak Labs
        </button>
        <button
          type="button"
          className={`mem-tab ${activeTab === 'gc-visualizer' ? 'active' : ''}`}
          onClick={() => setActiveTab('gc-visualizer')}
        >
          🕸️ Mark-and-Sweep Graph Visualizer
        </button>
        <button
          type="button"
          className={`mem-tab ${activeTab === 'cheatsheet' ? 'active' : ''}`}
          onClick={() => setActiveTab('cheatsheet')}
        >
          📖 FAANG Memory Optimization Cheatsheet
        </button>
      </div>

      {/* 1. LEAK SANDBOX TAB */}
      {activeTab === 'sandbox' && (
        <div className="scenarios-grid">
          {LEAK_SCENARIOS.map(sc => {
            const isLeaking = !!activeLeaks[sc.id]
            return (
              <div key={sc.id} className={`scenario-card ${isLeaking ? 'card-leaking' : ''}`}>
                <div className="scenario-top-row">
                  <span className="scenario-badge">{sc.badge}</span>
                  <span className="scenario-impact">+{sc.leakSizeMb} MB Heap</span>
                </div>

                <h3>{sc.title}</h3>
                <p className="scenario-desc">{sc.description}</p>

                {/* Code comparison */}
                <div className="code-comparison-grid">
                  <div className="code-pane bad-pane">
                    <span className="pane-tag">❌ Flawed (Causes Memory Leak)</span>
                    <pre><code>{sc.badCode}</code></pre>
                  </div>
                  <div className="code-pane good-pane">
                    <span className="pane-tag">✅ Staff-Level Fix</span>
                    <pre><code>{sc.goodCode}</code></pre>
                  </div>
                </div>

                {/* Action Trigger */}
                <div className="scenario-action-bar">
                  <button
                    type="button"
                    className={`btn ${isLeaking ? 'btn-danger' : 'btn-secondary'} scenario-btn`}
                    onClick={() => handleToggleLeak(sc)}
                  >
                    {isLeaking ? '⚡ Apply Fix & Break Closure' : '💥 Simulate Leak (+ ' + sc.leakSizeMb + ' MB)'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 2. GC VISUALIZER TAB */}
      {activeTab === 'gc-visualizer' && (
        <div className="gc-graph-container">
          <div className="gc-intro-banner">
            <h3>How V8 Mark-and-Sweep Garbage Collection Works</h3>
            <p>
              V8 starts traversal at <strong>GC Roots</strong> (window, global scope, active callstack stack frames, and DOM tree). It traces all reachable pointers ("Mark Phase") and deletes everything else ("Sweep Phase").
            </p>
          </div>

          <div className="gc-phases-grid">
            <div className="gc-phase-card root-card">
              <span className="phase-badge">Step 1: GC Roots</span>
              <h4>Roots Traversal</h4>
              <p>The runtime identifies root references: <code>window</code>, current call stack, and live DOM nodes in <code>document.body</code>.</p>
            </div>

            <div className="gc-phase-card mark-card">
              <span className="phase-badge">Step 2: Mark Phase</span>
              <h4>Object Graph Marking</h4>
              <p>Traverses pointers recursively. All reachable objects are marked with a bit flag. Unreferenced objects remain unmarked.</p>
            </div>

            <div className="gc-phase-card sweep-card">
              <span className="phase-badge">Step 3: Sweep &amp; Compact</span>
              <h4>Memory Reclamation</h4>
              <p>V8 sweeps over memory heap pages, reclaims unmarked memory addresses, and compacts fragmented heap pages.</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. CHEATSHEET TAB */}
      {activeTab === 'cheatsheet' && (
        <div className="mem-cheatsheet-container">
          <div className="mem-cheat-banner">
            <h3>Senior &amp; Staff Memory Profiling Cheatsheet</h3>
            <p>Master the memory profiling terminology tested in FAANG technical interviews.</p>
          </div>

          <div className="mem-cheat-grid">
            <div className="mem-cheat-card">
              <h4>1. Shallow Size vs Retained Size</h4>
              <p><strong>Shallow Size:</strong> The memory held by the object itself (e.g. primitive property values).</p>
              <p><strong>Retained Size:</strong> The total memory that would be freed once this object is deleted (including all objects only reachable through it).</p>
            </div>

            <div className="mem-cheat-card">
              <h4>2. WeakMap &amp; WeakSet</h4>
              <p>Keys in a <code>WeakMap</code> are held weakly. If no other references to a key object exist, the entry is automatically garbage collected, preventing unbounded dictionary leaks.</p>
            </div>

            <div className="mem-cheat-card">
              <h4>3. FinalizationRegistry &amp; WeakRef</h4>
              <p>Modern ES2021 APIs allowing developers to register cleanup callbacks when an object is collected by the GC engine.</p>
            </div>

            <div className="mem-cheat-card">
              <h4>4. Chrome DevTools Heap Snapshots</h4>
              <p>Take 3 snapshots: 1) Initial, 2) After user action, 3) After cleanup. Use the <strong>"Objects allocated between Snapshot 1 and 2"</strong> filter to identify retained leaks.</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="mem-footer">
        <Link to="/profiler" className="btn btn-secondary">
          ⚡ Web Vitals Profiler Lab
        </Link>
        <Link to="/code-review" className="btn btn-primary">
          🔍 AI Static Code Reviewer →
        </Link>
      </div>
    </div>
  )
}
