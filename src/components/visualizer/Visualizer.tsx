import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Visualizer.css'


export interface EventLoopStep {
  stepNumber: number
  lineHighlight: number
  description: string
  callStack: string[]
  microtasks: string[]
  macrotasks: string[]
  webApis: string[]
  renderQueue: string[]
  consoleOutput: string[]
  activePhase: 'sync' | 'microtask' | 'macrotask' | 'render'
}

export interface EventLoopScenario {
  id: string
  title: string
  difficulty: string
  code: string
  description: string
  steps: EventLoopStep[]
}

const SCENARIOS: EventLoopScenario[] = [
  {
    id: 'classic-puzzle',
    title: '1. Classic FAANG Event Loop Order Puzzle',
    difficulty: 'Medium',
    description: 'The definitive frontend interview question testing sync execution, microtasks (Promise), and macrotasks (setTimeout).',
    code: `console.log('1: Sync start');

setTimeout(() => {
  console.log('2: setTimeout');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Promise 1');
}).then(() => {
  console.log('4: Promise 2');
});

queueMicrotask(() => {
  console.log('5: queueMicrotask');
});

console.log('6: Sync end');`,
    steps: [
      {
        stepNumber: 1,
        lineHighlight: 1,
        description: 'Execute synchronous console.log("1: Sync start")',
        callStack: ['console.log("1: Sync start")', 'global()'],
        microtasks: [],
        macrotasks: [],
        webApis: [],
        renderQueue: [],
        consoleOutput: ['1: Sync start'],
        activePhase: 'sync',
      },
      {
        stepNumber: 2,
        lineHighlight: 3,
        description: 'Encounter setTimeout(..., 0). Offload timer callback to Web APIs.',
        callStack: ['setTimeout(...)', 'global()'],
        microtasks: [],
        macrotasks: [],
        webApis: ['Timer (0ms) -> cb: "2: setTimeout"'],
        renderQueue: [],
        consoleOutput: ['1: Sync start'],
        activePhase: 'sync',
      },
      {
        stepNumber: 3,
        lineHighlight: 7,
        description: 'Timer expires immediately -> callback moves to Macrotask Queue.',
        callStack: ['global()'],
        microtasks: [],
        macrotasks: ['cb: "2: setTimeout"'],
        webApis: [],
        renderQueue: [],
        consoleOutput: ['1: Sync start'],
        activePhase: 'sync',
      },
      {
        stepNumber: 4,
        lineHighlight: 7,
        description: 'Promise.resolve().then() creates a resolved promise and enqueues Promise 1 into Microtask Queue.',
        callStack: ['Promise.then(...)', 'global()'],
        microtasks: ['Promise.then: "3: Promise 1"'],
        macrotasks: ['cb: "2: setTimeout"'],
        webApis: [],
        renderQueue: [],
        consoleOutput: ['1: Sync start'],
        activePhase: 'sync',
      },
      {
        stepNumber: 5,
        lineHighlight: 13,
        description: 'queueMicrotask() explicitly enqueues its callback into the Microtask Queue.',
        callStack: ['queueMicrotask(...)', 'global()'],
        microtasks: ['Promise.then: "3: Promise 1"', 'queueMicrotask: "5: queueMicrotask"'],
        macrotasks: ['cb: "2: setTimeout"'],
        webApis: [],
        renderQueue: [],
        consoleOutput: ['1: Sync start'],
        activePhase: 'sync',
      },
      {
        stepNumber: 6,
        lineHighlight: 17,
        description: 'Execute synchronous console.log("6: Sync end"). Call stack becomes empty.',
        callStack: ['console.log("6: Sync end")', 'global()'],
        microtasks: ['Promise.then: "3: Promise 1"', 'queueMicrotask: "5: queueMicrotask"'],
        macrotasks: ['cb: "2: setTimeout"'],
        webApis: [],
        renderQueue: [],
        consoleOutput: ['1: Sync start', '6: Sync end'],
        activePhase: 'sync',
      },
      {
        stepNumber: 7,
        lineHighlight: 8,
        description: 'Call stack empty! Event loop checks Microtask Queue first. Pops "3: Promise 1". Returns a new promise that chains "4: Promise 2".',
        callStack: ['cb: "3: Promise 1"'],
        microtasks: ['queueMicrotask: "5: queueMicrotask"', 'Promise.then: "4: Promise 2"'],
        macrotasks: ['cb: "2: setTimeout"'],
        webApis: [],
        renderQueue: [],
        consoleOutput: ['1: Sync start', '6: Sync end', '3: Promise 1'],
        activePhase: 'microtask',
      },
      {
        stepNumber: 8,
        lineHighlight: 14,
        description: 'Drain next Microtask: execute "5: queueMicrotask".',
        callStack: ['cb: "5: queueMicrotask"'],
        microtasks: ['Promise.then: "4: Promise 2"'],
        macrotasks: ['cb: "2: setTimeout"'],
        webApis: [],
        renderQueue: [],
        consoleOutput: ['1: Sync start', '6: Sync end', '3: Promise 1', '5: queueMicrotask'],
        activePhase: 'microtask',
      },
      {
        stepNumber: 9,
        lineHighlight: 10,
        description: 'Drain next Microtask: execute chained "4: Promise 2". Microtask Queue is now completely drained!',
        callStack: ['cb: "4: Promise 2"'],
        microtasks: [],
        macrotasks: ['cb: "2: setTimeout"'],
        webApis: [],
        renderQueue: [],
        consoleOutput: ['1: Sync start', '6: Sync end', '3: Promise 1', '5: queueMicrotask', '4: Promise 2'],
        activePhase: 'microtask',
      },
      {
        stepNumber: 10,
        lineHighlight: 4,
        description: 'All microtasks drained! Event loop now dequeues ONE Macrotask from the Macrotask Queue: execute "2: setTimeout".',
        callStack: ['cb: "2: setTimeout"'],
        microtasks: [],
        macrotasks: [],
        webApis: [],
        renderQueue: ['Browser Paint & Frame Commit'],
        consoleOutput: ['1: Sync start', '6: Sync end', '3: Promise 1', '5: queueMicrotask', '4: Promise 2', '2: setTimeout'],
        activePhase: 'macrotask',
      },
    ],
  },
  {
    id: 'async-await-interleaving',
    title: '2. Async / Await Microtask Interleaving',
    difficulty: 'Hard',
    description: 'How await transforms execution into Promise microtasks and pauses function resumption.',
    code: `async function foo() {
  console.log('foo 1');
  await bar();
  console.log('foo 2');
}

async function bar() {
  console.log('bar 1');
}

console.log('start');
foo();
console.log('end');`,
    steps: [
      {
        stepNumber: 1,
        lineHighlight: 10,
        description: 'Execute synchronous console.log("start")',
        callStack: ['console.log("start")', 'global()'],
        microtasks: [],
        macrotasks: [],
        webApis: [],
        renderQueue: [],
        consoleOutput: ['start'],
        activePhase: 'sync',
      },
      {
        stepNumber: 2,
        lineHighlight: 11,
        description: 'Call foo(). Enters foo() execution context.',
        callStack: ['foo()', 'global()'],
        microtasks: [],
        macrotasks: [],
        webApis: [],
        renderQueue: [],
        consoleOutput: ['start'],
        activePhase: 'sync',
      },
      {
        stepNumber: 3,
        lineHighlight: 2,
        description: 'Synchronous execution inside foo(): logs "foo 1".',
        callStack: ['console.log("foo 1")', 'foo()', 'global()'],
        microtasks: [],
        macrotasks: [],
        webApis: [],
        renderQueue: [],
        consoleOutput: ['start', 'foo 1'],
        activePhase: 'sync',
      },
      {
        stepNumber: 4,
        lineHighlight: 3,
        description: 'Calls await bar(). bar() executes synchronously up until its return/await point.',
        callStack: ['bar()', 'foo()', 'global()'],
        microtasks: [],
        macrotasks: [],
        webApis: [],
        renderQueue: [],
        consoleOutput: ['start', 'foo 1'],
        activePhase: 'sync',
      },
      {
        stepNumber: 5,
        lineHighlight: 7,
        description: 'Inside bar(): logs "bar 1". bar() returns a resolved Promise.',
        callStack: ['console.log("bar 1")', 'bar()', 'foo()', 'global()'],
        microtasks: [],
        macrotasks: [],
        webApis: [],
        renderQueue: [],
        consoleOutput: ['start', 'foo 1', 'bar 1'],
        activePhase: 'sync',
      },
      {
        stepNumber: 6,
        lineHighlight: 3,
        description: 'await bar() pauses foo() execution and schedules the remainder of foo() into the Microtask Queue!',
        callStack: ['global()'],
        microtasks: ['Resume foo() (after await)'],
        macrotasks: [],
        webApis: [],
        renderQueue: [],
        consoleOutput: ['start', 'foo 1', 'bar 1'],
        activePhase: 'sync',
      },
      {
        stepNumber: 7,
        lineHighlight: 12,
        description: 'Synchronous script continues: logs "end". Call stack is now empty.',
        callStack: ['console.log("end")', 'global()'],
        microtasks: ['Resume foo() (after await)'],
        macrotasks: [],
        webApis: [],
        renderQueue: [],
        consoleOutput: ['start', 'foo 1', 'bar 1', 'end'],
        activePhase: 'sync',
      },
      {
        stepNumber: 8,
        lineHighlight: 4,
        description: 'Event loop runs microtasks: resumes foo() after the await point -> logs "foo 2".',
        callStack: ['console.log("foo 2")', 'foo()'],
        microtasks: [],
        macrotasks: [],
        webApis: [],
        renderQueue: [],
        consoleOutput: ['start', 'foo 1', 'bar 1', 'end', 'foo 2'],
        activePhase: 'microtask',
      },
    ],
  },
]

export default function Visualizer() {
  const [activeMode, setActiveMode] = useState<'event-loop' | 'react-fiber'>('event-loop')
  const [selectedScenario, setSelectedScenario] = useState<EventLoopScenario>(SCENARIOS[0])
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedMs, setSpeedMs] = useState(1500)

  // React Fiber visualizer state
  const [fiberPhase, setFiberPhase] = useState<'idle' | 'render' | 'commit' | 'painted'>('idle')

  // Auto-play timer

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (isPlaying) {
      timer = setInterval(() => {
        setStepIndex(prev => {
          if (prev >= selectedScenario.steps.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, speedMs)
    }
    return () => clearInterval(timer)
  }, [isPlaying, selectedScenario, speedMs])

  const loadScenario = (s: EventLoopScenario) => {
    setSelectedScenario(s)
    setStepIndex(0)
    setIsPlaying(false)
  }

  const currentStep = selectedScenario.steps[stepIndex] || selectedScenario.steps[0]

  const nextStep = () => {
    if (stepIndex < selectedScenario.steps.length - 1) {
      setStepIndex(stepIndex + 1)
    }
  }

  const prevStep = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1)
    }
  }

  const resetStepper = () => {
    setStepIndex(0)
    setIsPlaying(false)
  }

  return (
    <div className="visualizer-page page-enter">
      {/* Header */}
      <div className="visualizer-header">
        <div>
          <span className="vis-badge">⚡ Interactive Concurrency &amp; Render Debugger</span>
          <h1>JavaScript Event Loop &amp; React Fiber Visualizer</h1>
          <p className="subtitle">
            Step through JavaScript asynchronous execution queues (Call Stack, Microtasks, Macrotasks) and React 19 Fiber reconciliation with interactive visual animations.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="vis-mode-toggle">
          <button
            type="button"
            className={`mode-btn ${activeMode === 'event-loop' ? 'active' : ''}`}
            onClick={() => {
              setActiveMode('event-loop')
              setIsPlaying(false)
            }}
          >
            🌀 JS Event Loop Engine
          </button>
          <button
            type="button"
            className={`mode-btn ${activeMode === 'react-fiber' ? 'active' : ''}`}
            onClick={() => {
              setActiveMode('react-fiber')
              setIsPlaying(false)
            }}
          >
            ⚛️ React 19 Fiber Reconciliation
          </button>
        </div>
      </div>

      {/* 1. JAVASCRIPT EVENT LOOP VISUALIZER */}
      {activeMode === 'event-loop' && (
        <div className="event-loop-visualizer-container">
          {/* Scenario Selector & Stepper Controls */}
          <div className="controls-card">
            <div className="scenario-selector-row">
              <label>Interview Puzzle Scenario:</label>
              <div className="scenario-buttons">
                {SCENARIOS.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    className={`scenario-btn ${selectedScenario.id === s.id ? 'active' : ''}`}
                    onClick={() => loadScenario(s)}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="stepper-toolbar">
              <div className="stepper-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={resetStepper}
                  title="Reset to step 1"
                >
                  ⏮ Reset
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={stepIndex === 0}
                  onClick={prevStep}
                >
                  ◀ Prev Step
                </button>
                <button
                  type="button"
                  className={`btn ${isPlaying ? 'btn-danger' : 'btn-primary'} btn-sm`}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? '⏸ Pause' : '▶ Play (Auto-run)'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={stepIndex === selectedScenario.steps.length - 1}
                  onClick={nextStep}
                >
                  Next Step ▶
                </button>
              </div>

              <div className="stepper-status">
                <span className="step-counter">
                  Step <strong>{stepIndex + 1}</strong> of {selectedScenario.steps.length}
                </span>
                <label className="speed-slider-label">
                  Speed:
                  <select
                    value={speedMs}
                    onChange={e => setSpeedMs(Number(e.target.value))}
                    className="speed-select"
                  >
                    <option value={2000}>0.5x (Slow)</option>
                    <option value={1400}>1.0x (Normal)</option>
                    <option value={800}>2.0x (Fast)</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          {/* Code Viewer & Live Step Explanation */}
          <div className="execution-overview-grid">
            <div className="code-viewer-card">
              <div className="code-viewer-header">
                <h4>Source Code</h4>
                <span className="phase-indicator phase-${currentStep.activePhase}">
                  Phase: {currentStep.activePhase.toUpperCase()}
                </span>
              </div>
              <pre className="code-block-viewer">
                {selectedScenario.code.split('\n').map((line, idx) => {
                  const lineNo = idx + 1
                  const isCurrent = currentStep.lineHighlight === lineNo
                  return (
                    <div key={lineNo} className={`code-line-row ${isCurrent ? 'highlight' : ''}`}>
                      <span className="line-no">{lineNo}</span>
                      <span className="line-code">{line}</span>
                    </div>
                  )
                })}
              </pre>
            </div>

            <div className="step-explanation-card">
              <h4>Current Execution Step</h4>
              <div className="step-description-box">
                <p className="step-text">{currentStep.description}</p>
              </div>

              <div className="console-stream-box">
                <span className="console-stream-label">Browser Console Output:</span>
                <div className="console-lines">
                  {currentStep.consoleOutput.length > 0 ? (
                    currentStep.consoleOutput.map((msg, i) => (
                      <div key={i} className="console-msg">
                        <span className="console-prompt">&gt;</span> {msg}
                      </div>
                    ))
                  ) : (
                    <span className="empty-msg">No logs printed yet...</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Visual Queue Containers (Call Stack, Microtasks, Macrotasks, Web APIs) */}
          <div className="queues-visual-grid">
            {/* 1. Call Stack */}
            <div className="queue-box stack-box">
              <div className="queue-header">
                <span className="q-icon">⚡</span>
                <h5>Call Stack</h5>
                <span className="q-badge">{currentStep.callStack.length} frame(s)</span>
              </div>
              <div className="queue-items-container stack-layout">
                {currentStep.callStack.map((frame, i) => (
                  <div key={i} className="stack-frame-card">
                    {frame}
                  </div>
                ))}
                {currentStep.callStack.length === 0 && (
                  <div className="empty-queue-note">Stack Empty (Ready for Microtasks)</div>
                )}
              </div>
            </div>

            {/* 2. Microtask Queue */}
            <div className="queue-box microtask-box">
              <div className="queue-header">
                <span className="q-icon">🔮</span>
                <h5>Microtask Queue</h5>
                <span className="q-badge priority-high">High Priority</span>
              </div>
              <p className="queue-hint">Drained completely before ANY macrotask or frame render.</p>
              <div className="queue-items-container">
                {currentStep.microtasks.map((task, i) => (
                  <div key={i} className="queue-item-card microtask-item">
                    {task}
                  </div>
                ))}
                {currentStep.microtasks.length === 0 && (
                  <div className="empty-queue-note">Microtask Queue Empty</div>
                )}
              </div>
            </div>

            {/* 3. Macrotask Queue */}
            <div className="queue-box macrotask-box">
              <div className="queue-header">
                <span className="q-icon">⏱️</span>
                <h5>Macrotask Queue</h5>
                <span className="q-badge">{currentStep.macrotasks.length} task(s)</span>
              </div>
              <p className="queue-hint">Executes ONE task per tick after microtask drain.</p>
              <div className="queue-items-container">
                {currentStep.macrotasks.map((task, i) => (
                  <div key={i} className="queue-item-card macrotask-item">
                    {task}
                  </div>
                ))}
                {currentStep.macrotasks.length === 0 && (
                  <div className="empty-queue-note">Macrotask Queue Empty</div>
                )}
              </div>
            </div>

            {/* 4. Web APIs / Timers */}
            <div className="queue-box webapi-box">
              <div className="queue-header">
                <span className="q-icon">🌐</span>
                <h5>Web APIs &amp; Timers</h5>
                <span className="q-badge">Background</span>
              </div>
              <p className="queue-hint">Background OS threads counting timer intervals.</p>
              <div className="queue-items-container">
                {currentStep.webApis.map((api, i) => (
                  <div key={i} className="queue-item-card webapi-item">
                    {api}
                  </div>
                ))}
                {currentStep.webApis.length === 0 && (
                  <div className="empty-queue-note">No Active Web API Workers</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. REACT 19 FIBER RECONCILIATION VISUALIZER */}
      {activeMode === 'react-fiber' && (
        <div className="react-fiber-visualizer-container">
          <div className="fiber-intro-card">
            <h3>React 19 Two-Phase Fiber Architecture</h3>
            <p>
              React splits rendering into two separate phases: the <strong>Render Phase</strong> (asynchronous, interruptible Fiber tree diffing) and the <strong>Commit Phase</strong> (synchronous DOM mutation and layout effect execution).
            </p>
            <div className="fiber-stepper-row">
              <button
                type="button"
                className={`fiber-step-btn ${fiberPhase === 'idle' ? 'active' : ''}`}
                onClick={() => setFiberPhase('idle')}
              >
                1. Initial Idle State
              </button>
              <button
                type="button"
                className={`fiber-step-btn ${fiberPhase === 'render' ? 'active' : ''}`}
                onClick={() => setFiberPhase('render')}
              >
                2. Render Phase (beginWork / Diffing)
              </button>
              <button
                type="button"
                className={`fiber-step-btn ${fiberPhase === 'commit' ? 'active' : ''}`}
                onClick={() => setFiberPhase('commit')}
              >
                3. Commit Phase (DOM Mutation)
              </button>
              <button
                type="button"
                className={`fiber-step-btn ${fiberPhase === 'painted' ? 'active' : ''}`}
                onClick={() => setFiberPhase('painted')}
              >
                4. Layout &amp; Passive Effects (useEffect)
              </button>
            </div>
          </div>

          <div className="fiber-tree-comparison-grid">
            {/* Current Fiber Tree */}
            <div className="fiber-tree-card current-tree">
              <div className="tree-header">
                <h4>Current Fiber Tree (Rendered on Screen)</h4>
                <span className="tree-tag current-tag">DOM Host</span>
              </div>
              <div className="fiber-nodes-list">
                <div className="fiber-node root-node">
                  <span className="f-tag">HostRoot</span>
                  <span className="f-name">&lt;App /&gt;</span>
                  <span className="f-memo">state: {`{ count: 0 }`}</span>
                </div>
                <div className="fiber-connector" />
                <div className="fiber-node child-node">
                  <span className="f-tag">FunctionComponent</span>
                  <span className="f-name">&lt;Counter count=0 /&gt;</span>
                </div>
                <div className="fiber-connector" />
                <div className="fiber-node leaf-node">
                  <span className="f-tag">HostComponent</span>
                  <span className="f-name">&lt;button&gt;Count: 0&lt;/button&gt;</span>
                </div>
              </div>
            </div>

            {/* WorkInProgress Fiber Tree */}
            <div className={`fiber-tree-card wip-tree ${fiberPhase !== 'idle' ? 'active-wip' : ''}`}>
              <div className="tree-header">
                <h4>WorkInProgress Fiber Tree (Alternate)</h4>
                <span className="tree-tag wip-tag">
                  {fiberPhase === 'render' ? '⚡ Diffing in Progress' : fiberPhase === 'commit' ? '🚀 Committing Changes' : 'Double Buffer'}
                </span>
              </div>
              <div className="fiber-nodes-list">
                <div className={`fiber-node root-node ${fiberPhase === 'render' ? 'highlight-render' : ''}`}>
                  <span className="f-tag">HostRoot (WIP)</span>
                  <span className="f-name">&lt;App /&gt;</span>
                  <span className="f-memo">state: {`{ count: 1 }`}</span>
                </div>
                <div className="fiber-connector" />
                <div className={`fiber-node child-node ${fiberPhase === 'render' ? 'highlight-render' : ''}`}>
                  <span className="f-tag">FunctionComponent (WIP)</span>
                  <span className="f-name">&lt;Counter count=1 /&gt;</span>
                  <span className="f-flag">flags: Update</span>
                </div>
                <div className="fiber-connector" />
                <div className={`fiber-node leaf-node ${fiberPhase === 'commit' ? 'highlight-commit' : ''}`}>
                  <span className="f-tag">HostComponent (WIP)</span>
                  <span className="f-name">&lt;button&gt;Count: 1&lt;/button&gt;</span>
                  <span className="f-flag">flags: Placement / ContentUpdate</span>
                </div>
              </div>
            </div>
          </div>

          <div className="fiber-explanation-card">
            <h4>Phase Explanation</h4>
            {fiberPhase === 'idle' && (
              <p>System is in equilibrium. When a state update (e.g. <code>setCount(1)</code>) occurs, React schedules a new render pass on the alternate WorkInProgress tree.</p>
            )}
            {fiberPhase === 'render' && (
              <p><strong>Render Phase:</strong> React performs depth-first traversal with <code>beginWork()</code> and <code>completeWork()</code>, comparing current props vs next props to calculate minimal DOM diffs. This phase is asynchronous and can be paused or prioritized by React 19's scheduler.</p>
            )}
            {fiberPhase === 'commit' && (
              <p><strong>Commit Phase:</strong> React applies the calculated mutations to the actual browser DOM synchronously in a single uninterruptible batch, preventing partial UI flicker.</p>
            )}
            {fiberPhase === 'painted' && (
              <p><strong>Effects Execution:</strong> Synchronous <code>useLayoutEffect</code> fires immediately before browser paint. After the browser repaints the pixels, asynchronous <code>useEffect</code> callbacks execute in a separate microtask/macrotask tick.</p>
            )}
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="visualizer-footer">
        <Link to="/questions" className="btn btn-secondary">
          ← Back to Question Bank
        </Link>
        <Link to="/mock-interview" className="btn btn-primary">
          ⏱️ Take a Timed Mock Interview
        </Link>
      </div>
    </div>
  )
}
