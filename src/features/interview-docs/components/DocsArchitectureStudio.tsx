import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ARCHITECTURE_DIAGRAMS,
  type DiagramCategory,
} from '../services/docsDiagramsService';

export function DocsArchitectureStudio() {
  const [activeCategory, setActiveCategory] = useState<DiagramCategory>('event-loop');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const autoPlayTimerRef = useRef<any>(null);

  const diagram = ARCHITECTURE_DIAGRAMS[activeCategory];
  const steps = diagram.steps;
  const currentStep = steps[currentStepIndex] || steps[0];

  // Auto-play timer effect
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.round(2400 / playbackSpeed);
      autoPlayTimerRef.current = setTimeout(() => {
        setCurrentStepIndex(prev => {
          if (prev + 1 < steps.length) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, intervalMs);
    } else {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    }
    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, playbackSpeed]);

  const handleSwitchCategory = (cat: DiagramCategory) => {
    setActiveCategory(cat);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStepIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1));
  };

  const handleTogglePlay = () => {
    if (currentStepIndex >= steps.length - 1 && !isPlaying) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(prev => !prev);
  };

  return (
    <div className="docs-architecture-studio-container">
      {/* Studio Header */}
      <div className="arch-header-card">
        <div className="arch-header-badge">
          <span className="arch-badge-icon">📐</span>
          <span>INTERACTIVE ARCHITECTURE &amp; SYSTEM DESIGN STUDIO</span>
        </div>
        <h2>Frontend Systems, Engine Lifecycles &amp; Tree Visualizers</h2>
        <p>
          Master the hardest concepts asked in Senior and Staff technical interviews with step-by-step animated diagrams, memory inspector queues, and verbal explanation cheatsheets.
        </p>
      </div>

      {/* Visualizer Category Switcher Tabs */}
      <div className="arch-category-tabs">
        {(Object.keys(ARCHITECTURE_DIAGRAMS) as DiagramCategory[]).map(key => {
          const item = ARCHITECTURE_DIAGRAMS[key];
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              type="button"
              className={`arch-cat-tab ${isActive ? 'active' : ''}`}
              onClick={() => handleSwitchCategory(key)}
            >
              <span className="cat-tab-icon">{item.icon}</span>
              <div className="cat-tab-text">
                <strong>{item.title.split('&')[0]}</strong>
                <span className="cat-tab-sub">{item.badge}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Visualizer Stage Shell */}
      <div className="arch-stage-shell">
        {/* Stage Toolbar */}
        <div className="arch-toolbar">
          <div className="arch-tool-left">
            <span className="arch-step-counter">
              STEP {currentStepIndex + 1} OF {steps.length}
            </span>
            <span className="arch-phase-badge">
              {currentStep.activePhase || 'Execution Phase'}
            </span>
          </div>

          <div className="arch-tool-center">
            <button
              type="button"
              className="arch-ctrl-btn"
              onClick={handleReset}
              title="Reset to beginning"
            >
              ⏮ Reset
            </button>
            <button
              type="button"
              className="arch-ctrl-btn"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              title="Previous step"
            >
              ◀ Prev
            </button>
            <button
              type="button"
              className={`arch-ctrl-btn play-btn ${isPlaying ? 'is-playing' : ''}`}
              onClick={handleTogglePlay}
            >
              {isPlaying ? '⏸ Pause' : '▶ Auto-Play'}
            </button>
            <button
              type="button"
              className="arch-ctrl-btn"
              onClick={handleNext}
              disabled={currentStepIndex === steps.length - 1}
              title="Next step"
            >
              Next ▶
            </button>
          </div>

          <div className="arch-tool-right">
            <span className="speed-label">Speed:</span>
            <div className="speed-buttons">
              {[0.5, 1, 2].map(s => (
                <button
                  key={s}
                  type="button"
                  className={`speed-btn ${playbackSpeed === s ? 'active' : ''}`}
                  onClick={() => setPlaybackSpeed(s)}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Narrative Banner for Current Step */}
        <div className="arch-narrative-banner">
          <h4>{currentStep.title}</h4>
          <p>{currentStep.description}</p>
        </div>

        {/* -------------------------------------------------------------
            Dynamic Canvas: Tailored per Visualizer Category
            ------------------------------------------------------------- */}
        <div className="arch-canvas-stage">
          {/* 1. Event Loop Visualizer Stage */}
          {activeCategory === 'event-loop' && (
            <div className="event-loop-canvas-grid">
              {/* Call Stack */}
              <div className="el-box call-stack-box">
                <div className="el-box-header">
                  <span className="el-indicator pulse" />
                  <strong>Call Stack (Single Thread)</strong>
                </div>
                <div className="el-box-content">
                  {currentStep.callStack && currentStep.callStack.length > 0 ? (
                    currentStep.callStack.map((frame, i) => (
                      <div key={i} className="el-frame-pill active">
                        {frame}
                      </div>
                    ))
                  ) : (
                    <div className="el-empty-slot">Stack Empty (Tick Idle)</div>
                  )}
                </div>
              </div>

              {/* Web APIs */}
              <div className="el-box web-apis-box">
                <div className="el-box-header">
                  <span className="el-indicator blue" />
                  <strong>Browser Web APIs (C++ Threads)</strong>
                </div>
                <div className="el-box-content">
                  {currentStep.webApis && currentStep.webApis.length > 0 ? (
                    currentStep.webApis.map((item, i) => (
                      <div key={i} className="el-api-pill">
                        ⚙️ {item}
                      </div>
                    ))
                  ) : (
                    <div className="el-empty-slot">No active timers or fetch threads</div>
                  )}
                </div>
              </div>

              {/* Microtask Queue */}
              <div className="el-box microtask-box">
                <div className="el-box-header">
                  <span className="el-priority-tag">HIGHEST PRIORITY</span>
                  <strong>Microtask Queue (Drained to 0)</strong>
                </div>
                <div className="el-box-content">
                  {currentStep.microtasks && currentStep.microtasks.length > 0 ? (
                    currentStep.microtasks.map((task, i) => (
                      <div key={i} className="el-task-pill microtask">
                        ⚡ {task}
                      </div>
                    ))
                  ) : (
                    <div className="el-empty-slot">Microtask queue clear</div>
                  )}
                </div>
              </div>

              {/* Macrotask Queue */}
              <div className="el-box macrotask-box">
                <div className="el-box-header">
                  <span className="el-priority-tag yellow">1 PER TICK</span>
                  <strong>Macrotask Queue (Task Queue)</strong>
                </div>
                <div className="el-box-content">
                  {currentStep.macrotasks && currentStep.macrotasks.length > 0 ? (
                    currentStep.macrotasks.map((task, i) => (
                      <div key={i} className="el-task-pill macrotask">
                        ⏱ {task}
                      </div>
                    ))
                  ) : (
                    <div className="el-empty-slot">Macrotask queue empty</div>
                  )}
                </div>
              </div>

              {/* Render Pipeline */}
              <div className="el-box render-pipeline-box">
                <div className="el-box-header">
                  <span className="el-indicator green" />
                  <strong>Render Queue (rAF, Style, Layout, Paint)</strong>
                </div>
                <div className="el-box-content">
                  {currentStep.renderQueue && currentStep.renderQueue.length > 0 ? (
                    currentStep.renderQueue.map((item, i) => (
                      <div key={i} className="el-task-pill render">
                        🖼️ {item}
                      </div>
                    ))
                  ) : (
                    <div className="el-empty-slot">No visual frame pending</div>
                  )}
                </div>
              </div>

              {/* Console Output Terminal */}
              <div className="el-box console-box">
                <div className="el-box-header">
                  <span>💻 Terminal Output</span>
                </div>
                <div className="el-console-screen">
                  {currentStep.consoleLogs && currentStep.consoleLogs.length > 0 ? (
                    currentStep.consoleLogs.map((log, i) => (
                      <div key={i} className="el-log-line">
                        <span className="log-arrow">&gt;</span> {log}
                      </div>
                    ))
                  ) : (
                    <div className="el-empty-slot">Awaiting execution...</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. React 19 Fiber Visualizer Stage */}
          {activeCategory === 'react-fiber' && (
            <div className="fiber-canvas-container">
              <div className="fiber-trees-split">
                {/* Current Tree */}
                <div className="fiber-tree-pane current">
                  <div className="fiber-tree-header">
                    <span className="tree-badge current">ACTIVE SCREEN BUFFER</span>
                    <h4>Current Tree (DOM Connected)</h4>
                  </div>
                  <div className="fiber-nodes-stack">
                    <div className="fiber-node root">
                      <div className="fn-top">
                        <span className="fn-tag">HostRoot</span>
                        <span className="fn-lane">No Work</span>
                      </div>
                      <div className="fn-name">RootFiber</div>
                    </div>
                    <div className="fiber-branch-line" />
                    <div className="fiber-node app">
                      <div className="fn-top">
                        <span className="fn-tag">FunctionComponent</span>
                        <span className="fn-pointer">child ▾</span>
                      </div>
                      <div className="fn-name">&lt;App /&gt;</div>
                    </div>
                    <div className="fiber-branch-line" />
                    <div className="fiber-node content">
                      <div className="fn-top">
                        <span className="fn-tag">Component</span>
                        <span className="fn-state">memoizedState</span>
                      </div>
                      <div className="fn-name">&lt;Content /&gt;</div>
                    </div>
                  </div>
                </div>

                {/* Double Buffering Alternate Connectors */}
                <div className="fiber-alternate-bridge">
                  <div className="bridge-pill">
                    <span>⇄</span>
                    <strong>Double Buffering</strong>
                    <small>alternate pointer</small>
                  </div>
                </div>

                {/* Work-in-Progress (WIP) Tree */}
                <div className="fiber-tree-pane wip">
                  <div className="fiber-tree-header">
                    <span className="tree-badge wip">IN-MEMORY RECONCILER</span>
                    <h4>Work-In-Progress Tree (WIP)</h4>
                  </div>
                  <div className="fiber-nodes-stack">
                    <div className={`fiber-node root ${currentStepIndex >= 2 ? 'wip-active' : ''}`}>
                      <div className="fn-top">
                        <span className="fn-tag">HostRoot</span>
                        <span className="fn-lane">WIP Clone</span>
                      </div>
                      <div className="fn-name">RootFiber (WIP)</div>
                    </div>
                    <div className="fiber-branch-line" />
                    <div className={`fiber-node app ${currentStepIndex >= 3 ? 'wip-active' : ''}`}>
                      <div className="fn-top">
                        <span className="fn-tag">FunctionComponent</span>
                        <span className="fn-pointer">child ▾</span>
                      </div>
                      <div className="fn-name">&lt;App /&gt; (Reused)</div>
                    </div>
                    <div className="fiber-branch-line" />
                    <div className={`fiber-node content ${currentStepIndex >= 4 ? 'wip-active dirty' : ''}`}>
                      <div className="fn-top">
                        <span className="fn-tag">Component</span>
                        <span className="fn-effect-flag">
                          {currentStepIndex >= 4 ? 'FLAGS: UPDATE (0x04)' : 'Pending'}
                        </span>
                      </div>
                      <div className="fn-name">&lt;Content /&gt; (New State)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fiber Node Inspector Card */}
              <div className="fiber-inspector-card">
                <h5>🔍 Active Fiber Node Memory Inspector</h5>
                <div className="fiber-inspector-grid">
                  <div className="fi-cell">
                    <span className="fi-key">Lanes / Priority:</span>
                    <span className="fi-val">TransitionLane (0b0000000000000000000000010000000)</span>
                  </div>
                  <div className="fi-cell">
                    <span className="fi-key">Alternate Pointer:</span>
                    <span className="fi-val">current.alternate ⇄ wip</span>
                  </div>
                  <div className="fi-cell">
                    <span className="fi-key">Reconciliation Phase:</span>
                    <span className="fi-val highlight">{currentStep.activePhase}</span>
                  </div>
                  <div className="fi-cell">
                    <span className="fi-key">Child &amp; Sibling Links:</span>
                    <span className="fi-val">Linked list pointer traversal (O(1) tree climb)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Browser Critical Rendering Path Visualizer Stage */}
          {activeCategory === 'critical-rendering-path' && (
            <div className="crp-canvas-container">
              <div className="crp-waterfall-flow">
                {[
                  { step: 1, name: 'HTML & CSS Bytes', desc: 'Raw Network Stream', metric: 'TTFB' },
                  { step: 2, name: 'Tokenization', desc: 'Characters to Tokens', metric: 'Tokenizer' },
                  { step: 3, name: 'DOM & CSSOM Trees', desc: 'Tree Node Construction', metric: 'FCP' },
                  { step: 4, name: 'Render Tree', desc: 'Visual Nodes (display:none omitted)', metric: 'Computed Styles' },
                  { step: 5, name: 'Layout (Reflow)', desc: 'Box Geometry & Viewport Coordinates', metric: 'CLS' },
                  { step: 6, name: 'Paint & Compositing', desc: 'GPU Layer Rasterization (120fps)', metric: 'INP / LCP' },
                ].map(stage => {
                  const isCurrent = currentStepIndex + 1 === stage.step;
                  const isPassed = currentStepIndex + 1 > stage.step;
                  return (
                    <div
                      key={stage.step}
                      className={`crp-stage-node ${isCurrent ? 'active' : ''} ${isPassed ? 'passed' : ''}`}
                    >
                      <div className="crp-step-badge">{stage.step}</div>
                      <div className="crp-node-info">
                        <strong>{stage.name}</strong>
                        <span>{stage.desc}</span>
                      </div>
                      <div className="crp-metric-tag">{stage.metric}</div>
                      {stage.step < 6 && <div className="crp-connector-arrow">→</div>}
                    </div>
                  );
                })}
              </div>

              {/* CRP Performance Deep Dive Card */}
              <div className="crp-tip-card">
                <div className="crp-tip-header">
                  <span className="crp-tip-icon">⚡</span>
                  <h4>Vitals Metric Impact: {currentStep.highlightData?.metric || 'Performance'}</h4>
                </div>
                <p>
                  {currentStepIndex <= 2 && 'CSSOM blocks initial paint! Keep critical CSS under 14KB (the initial TCP slow-start congestion window) so it arrives in the first packet.'}
                  {currentStepIndex === 3 && 'Render Tree filters out display:none and <head> elements, but keeps visibility:hidden because it still occupies geometric layout space.'}
                  {currentStepIndex === 4 && 'Layout Thrashing occurs when reading offsetTop or getComputedStyle immediately after modifying element styles. Always batch style writes!'}
                  {currentStepIndex >= 5 && 'Composited layers run exclusively on the GPU Compositor thread. Animating transform or opacity bypasses Layout and Paint entirely, avoiding INP frame drops.'}
                </p>
              </div>
            </div>
          )}

          {/* 4. State Management Unidirectional Flow Visualizer Stage */}
          {activeCategory === 'state-data-flow' && (
            <div className="state-canvas-container">
              <div className="state-track-ring">
                {[
                  { id: 1, title: 'Component Interaction', desc: 'User click triggers dispatch(action)', icon: '🖱️' },
                  { id: 2, title: 'Middleware Pipeline', desc: 'Intercepts logging, analytics, and RTK Query', icon: '🛡️' },
                  { id: 3, title: 'Reducer State Mutation', desc: 'Produces next immutable state tree (Immer)', icon: '⚙️' },
                  { id: 4, title: 'Subscriber Notification', desc: 'Store notifies fine-grained selectors', icon: '📡' },
                  { id: 5, title: 'Targeted Re-render', desc: 'Only dirty components re-render (Subtree saved!)', icon: '🎯' },
                ].map(step => {
                  const isCurrent = currentStepIndex + 1 === step.id;
                  const isDone = currentStepIndex + 1 > step.id;
                  return (
                    <div
                      key={step.id}
                      className={`state-station ${isCurrent ? 'active' : ''} ${isDone ? 'done' : ''}`}
                    >
                      <span className="station-icon">{step.icon}</span>
                      <div className="station-body">
                        <strong>{step.title}</strong>
                        <p>{step.desc}</p>
                      </div>
                      <span className="station-step-tag">Phase {step.id}</span>
                    </div>
                  );
                })}
              </div>

              <div className="state-comparison-card">
                <div className="scc-header">
                  <h5>⚖️ Architectural Comparison: Redux Toolkit / Zustand vs. React Context</h5>
                </div>
                <div className="scc-grid">
                  <div className="scc-col">
                    <h6>❌ Naive React Context Problem:</h6>
                    <p>When any value in a Context Provider changes, <strong>EVERY consumer re-renders</strong>, even if it only cared about an untouched property. Causes severe rendering jank in data-rich apps.</p>
                  </div>
                  <div className="scc-col highlight">
                    <h6>✅ Selector Subscription Solution:</h6>
                    <p>Fine-grained selectors (<code>useSelector(selectCartCount)</code>) perform reference equality checks. If <code>cart.count</code> didn't change, <strong>component re-rendering is 100% skipped</strong>.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Code Snippet Preview (if provided) */}
        {diagram.codeSnippet && (
          <div className="arch-code-preview">
            <div className="acp-header">
              <span>📄 Architectural Code Implementation</span>
            </div>
            <pre><code>{diagram.codeSnippet}</code></pre>
          </div>
        )}
      </div>

      {/* Senior & Staff Interview Verbal Explanation Cheatsheet */}
      <div className="arch-cheatsheet-card">
        <div className="acc-badge">
          <span>👔 SENIOR INTERVIEW EXPLAINER CHEATSHEET</span>
        </div>
        <h3>How to Explain "{diagram.title}" to a Staff Engineer in 60 Seconds</h3>

        <div className="acc-pitch-box">
          <p className="acc-pitch-text">"{diagram.seniorExplanation.in60Seconds}"</p>
        </div>

        <div className="acc-two-col-grid">
          <div className="acc-col watchouts">
            <h4>⚠️ Common Interview Traps &amp; Watchouts</h4>
            <ul>
              {diagram.seniorExplanation.interviewWatchouts.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>

          <div className="acc-col takeaways">
            <h4>💡 Staff / Principal Engineering Insights</h4>
            <ul>
              {diagram.seniorExplanation.staffTakeaways.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="acc-topic-footer">
          <Link
            to={`/docs/${diagram.relatedSubjectId}/${diagram.relatedTopicId}`}
            className="acc-deep-dive-btn"
          >
            📖 Read Full Documentation Spec on {diagram.title} →
          </Link>
        </div>
      </div>
    </div>
  );
}
