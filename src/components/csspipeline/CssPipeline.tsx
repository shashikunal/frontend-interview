import { useState } from 'react'
import { Link } from 'react-router-dom'
import './CssPipeline.css'

export interface CssPropertyDemo {
  id: string
  name: string
  property: string
  type: 'layout' | 'paint' | 'composite'
  stages: {
    recalculateStyle: boolean
    layout: boolean
    paint: boolean
    composite: boolean
  }
  frameTimeMs: number
  fpsTarget: number
  description: string
  codeSnippet: string
}

const CSS_PROPERTIES: CssPropertyDemo[] = [
  {
    id: 'transform-gpu',
    name: 'transform: translate3d() (GPU Accelerated)',
    property: 'transform: translate3d(140px, 0, 0)',
    type: 'composite',
    stages: {
      recalculateStyle: true,
      layout: false,
      paint: false,
      composite: true,
    },
    frameTimeMs: 1.2,
    fpsTarget: 120,
    description: 'Bypasses Layout (Reflow) and Paint entirely! Hardware-accelerated GPU layer blitting at silky-smooth 120 FPS.',
    codeSnippet: `.box-animated {
  will-change: transform;
  transform: translate3d(140px, 0, 0); /* GPU Compositor only */
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}`,
  },
  {
    id: 'left-reflow',
    name: 'left / top (Triggers Full Layout Reflow)',
    property: 'left: 140px',
    type: 'layout',
    stages: {
      recalculateStyle: true,
      layout: true,
      paint: true,
      composite: true,
    },
    frameTimeMs: 18.6,
    fpsTarget: 42,
    description: 'Forces browser to recalculate geometry for the element and all child/sibling nodes. Drops frames below 60fps.',
    codeSnippet: `.box-animated {
  position: relative;
  left: 140px; /* ❌ Triggers Layout -> Paint -> Composite */
  transition: left 0.3s ease;
}`,
  },
  {
    id: 'bg-repaint',
    name: 'background-color (Triggers Paint / Repaint)',
    property: 'background-color: #ec4899',
    type: 'paint',
    stages: {
      recalculateStyle: true,
      layout: false,
      paint: true,
      composite: true,
    },
    frameTimeMs: 7.4,
    fpsTarget: 60,
    description: 'Bypasses Layout, but browser must re-rasterize vectors and text into bitmaps before sending to GPU.',
    codeSnippet: `.box-animated {
  background-color: #ec4899; /* Triggers Repaint -> Composite */
  transition: background-color 0.3s ease;
}`,
  },
]

export default function CssPipeline() {
  const [selectedDemo, setSelectedDemo] = useState<CssPropertyDemo>(CSS_PROPERTIES[0])
  const [isElementMoved, setIsElementMoved] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'pipeline' | 'thrashing' | 'cheatsheet'>('pipeline')

  // Layout thrashing state
  const [isThrashingFixed, setIsThrashingFixed] = useState<boolean>(false)
  const [thrashLog, setThrashLog] = useState<string | null>(null)

  const handleRunThrashSim = () => {
    if (isThrashingFixed) {
      setThrashLog('⚡ BATCHED FIX: Read all 100 dimensions first, then batched all 100 style writes in 1 requestAnimationFrame tick. Total execution time: 2.1 ms (120 FPS Smooth).')
    } else {
      setThrashLog('🚨 FORCED SYNCHRONOUS LAYOUT: Alternating read (offsetWidth) after write (style.width) inside a 100-iteration loop caused 100 consecutive Reflows! Main thread frozen for 94.8 ms (Jank detected).')
    }
  }

  return (
    <div className="pipeline-page page-enter">
      {/* Header */}
      <div className="pipeline-header">
        <div>
          <span className="pipeline-badge">⚡ Browser Rendering Engine &amp; GPU Pipeline</span>
          <h1>CSS Render Pipeline &amp; Compositor Studio</h1>
          <p className="subtitle">
            Understand how browser rendering engines (Chromium Blink, WebKit, Gecko) process DOM &amp; CSSOM mutations: Layout (Reflow), Paint (Repaint), and GPU Layer Compositing.
          </p>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="pipeline-tabs-bar">
        <button
          type="button"
          className={`pipe-tab ${activeTab === 'pipeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('pipeline')}
        >
          🎨 4-Stage Render Pipeline Visualizer
        </button>
        <button
          type="button"
          className={`pipe-tab ${activeTab === 'thrashing' ? 'active' : ''}`}
          onClick={() => setActiveTab('thrashing')}
        >
          💥 Layout Thrashing (Forced Reflow) Sandbox
        </button>
        <button
          type="button"
          className={`pipe-tab ${activeTab === 'cheatsheet' ? 'active' : ''}`}
          onClick={() => setActiveTab('cheatsheet')}
        >
          📖 FAANG 60/120 FPS Rendering Cheatsheet
        </button>
      </div>

      {/* 1. PIPELINE VISUALIZER TAB */}
      {activeTab === 'pipeline' && (
        <div className="pipeline-main-grid">
          {/* Controls Column */}
          <div className="pipeline-controls-col">
            <div className="pipe-card">
              <h3>Select CSS Property Mutation</h3>
              <div className="property-buttons-list">
                {CSS_PROPERTIES.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    className={`prop-select-btn ${selectedDemo.id === p.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedDemo(p)
                      setIsElementMoved(false)
                    }}
                  >
                    <div className="prop-btn-top">
                      <strong>{p.name}</strong>
                      <span className={`type-badge ${p.type}`}>{p.type}</span>
                    </div>
                    <code>{p.property}</code>
                  </button>
                ))}
              </div>

              {/* Telemetry Meter */}
              <div className="pipe-telemetry-box">
                <div className="telem-row">
                  <span>Frame Render Time:</span>
                  <strong className={selectedDemo.frameTimeMs > 16.6 ? 'bad' : 'good'}>
                    {selectedDemo.frameTimeMs} ms
                  </strong>
                </div>
                <div className="telem-row">
                  <span>Frame Rate Target:</span>
                  <strong className={selectedDemo.fpsTarget < 60 ? 'bad' : 'good'}>
                    {selectedDemo.fpsTarget} FPS {selectedDemo.fpsTarget >= 120 ? '✨ ProMotion' : selectedDemo.fpsTarget < 60 ? '⚠️ Frame Drop' : ''}
                  </strong>
                </div>
              </div>
            </div>

            {/* Interactive Animated Stage */}
            <div className="pipe-card">
              <h3>Interactive Animation Sandbox</h3>
              <p className="desc">{selectedDemo.description}</p>

              <div className="animated-stage-arena">
                <div
                  className={`interactive-box ${isElementMoved ? 'moved' : ''}`}
                  style={{
                    transform: selectedDemo.id === 'transform-gpu' && isElementMoved ? 'translate3d(140px, 0, 0)' : undefined,
                    left: selectedDemo.id === 'left-reflow' && isElementMoved ? '140px' : '0px',
                    backgroundColor: selectedDemo.id === 'bg-repaint' && isElementMoved ? '#ec4899' : undefined,
                  }}
                >
                  <span>UI Element</span>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary toggle-anim-btn"
                onClick={() => setIsElementMoved(prev => !prev)}
              >
                {isElementMoved ? '↩ Reset Position' : '▶ Trigger CSS Mutation'}
              </button>
            </div>
          </div>

          {/* 4-Stage Pipeline Column */}
          <div className="pipeline-stages-col">
            <div className="pipe-card">
              <h3>Browser Rendering Pipeline Stages Triggered</h3>

              <div className="stages-flow-list">
                {/* Stage 1 */}
                <div className={`stage-step-card ${selectedDemo.stages.recalculateStyle ? 'active-stage' : 'bypassed-stage'}`}>
                  <div className="stage-top">
                    <span className="stage-num">Stage 1</span>
                    <span className="stage-tag">{selectedDemo.stages.recalculateStyle ? 'Executed' : 'Bypassed'}</span>
                  </div>
                  <h4>Recalculate Style (DOM + CSSOM)</h4>
                  <p>Matches selector specificity rules and computes resolved CSS values for all affected DOM nodes.</p>
                </div>

                {/* Stage 2 */}
                <div className={`stage-step-card ${selectedDemo.stages.layout ? 'active-stage reflow-warning' : 'bypassed-stage'}`}>
                  <div className="stage-top">
                    <span className="stage-num">Stage 2</span>
                    <span className="stage-tag">{selectedDemo.stages.layout ? '⚠️ EXPENSIVE REFLOW' : '⚡ Bypassed'}</span>
                  </div>
                  <h4>Layout (Reflow)</h4>
                  <p>Calculates exact pixel geometry, coordinates (x, y), widths, and margins. Can invalidate entire subtree!</p>
                </div>

                {/* Stage 3 */}
                <div className={`stage-step-card ${selectedDemo.stages.paint ? 'active-stage repaint-warning' : 'bypassed-stage'}`}>
                  <div className="stage-top">
                    <span className="stage-num">Stage 3</span>
                    <span className="stage-tag">{selectedDemo.stages.paint ? 'Repaint Executed' : '⚡ Bypassed'}</span>
                  </div>
                  <h4>Paint (Repaint &amp; Rasterization)</h4>
                  <p>Fills in pixels for colors, shadows, borders, text, and images into bitmap display lists.</p>
                </div>

                {/* Stage 4 */}
                <div className={`stage-step-card ${selectedDemo.stages.composite ? 'active-stage gpu-success' : 'bypassed-stage'}`}>
                  <div className="stage-top">
                    <span className="stage-num">Stage 4</span>
                    <span className="stage-tag">⚡ GPU HARDWARE ACCELERATED</span>
                  </div>
                  <h4>Composite Layers (GPU Blit)</h4>
                  <p>GPU composites separate layer textures on the compositor thread without blocking the main JavaScript thread.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. LAYOUT THRASHING TAB */}
      {activeTab === 'thrashing' && (
        <div className="thrash-container">
          <div className="thrash-banner">
            <div>
              <h3>Layout Thrashing (Forced Synchronous Reflow)</h3>
              <p>
                Occurs when JavaScript repeatedly alternates between <strong>writing to the DOM</strong> and <strong>reading geometric properties</strong> (e.g. <code>offsetWidth</code>, <code>clientHeight</code>, <code>getBoundingClientRect()</code>) before the browser can batch layout passes.
              </p>
            </div>

            <button
              type="button"
              className={`btn ${isThrashingFixed ? 'btn-primary' : 'btn-danger'} thrash-toggle-btn`}
              onClick={() => setIsThrashingFixed(prev => !prev)}
            >
              {isThrashingFixed ? '⚡ FastDOM Batched Fix Active' : '❌ Layout Thrashing Loop (100 Reflows)'}
            </button>
          </div>

          <div className="thrash-grid">
            <div className="pipe-card">
              <h4>Code Implementation</h4>
              {isThrashingFixed ? (
                <pre className="code-box">
                  <code>{`// ✅ FIX: Read all geometry first, then batch write in rAF
const widths = [];

// Phase 1: Batch all DOM Reads (Zero Reflows triggered)
elements.forEach(el => {
  widths.push(el.offsetWidth);
});

// Phase 2: Batch all DOM Writes in single frame tick
requestAnimationFrame(() => {
  elements.forEach((el, i) => {
    el.style.width = \`\${widths[i] + 10}px\`;
  });
});`}</code>
                </pre>
              ) : (
                <pre className="code-box">
                  <code>{`// ❌ BUG: Interleaving DOM Write -> DOM Read triggers 100 Reflows!
for (let i = 0; i < elements.length; i++) {
  // 1. Write (invalidates current layout):
  elements[i].style.width = \`\${i * 2}px\`;

  // 2. Read (forces browser to immediately synchronously recalculate layout!):
  const boxWidth = elements[i].offsetWidth; // 💥 FORCED REFLOW
}`}</code>
                </pre>
              )}

              <button
                type="button"
                className="btn btn-secondary run-sim-btn"
                onClick={handleRunThrashSim}
              >
                ▶ Run 100-Element Animation Loop
              </button>

              {thrashLog && (
                <div className={`thrash-feedback ${thrashLog.includes('⚡') ? 'good-log' : 'bad-log'}`}>
                  {thrashLog}
                </div>
              )}
            </div>

            <div className="pipe-card info-pane">
              <h4>Reflow-Triggering Properties Cheatsheet:</h4>
              <ul className="thrash-rules">
                <li><code>el.offsetWidth</code>, <code>el.offsetHeight</code>, <code>el.offsetTop</code>, <code>el.offsetLeft</code></li>
                <li><code>el.clientWidth</code>, <code>el.clientHeight</code>, <code>el.scrollWidth</code>, <code>el.scrollHeight</code></li>
                <li><code>el.getBoundingClientRect()</code>, <code>el.getClientRects()</code></li>
                <li><code>window.getComputedStyle(el)</code></li>
                <li><code>window.scrollY</code>, <code>window.scrollX</code></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 3. CHEATSHEET TAB */}
      {activeTab === 'cheatsheet' && (
        <div className="cheat-container">
          <div className="cheat-banner">
            <h3>Staff Frontend 60 FPS / 120 FPS Rendering Cheatsheet</h3>
            <p>Techniques top engineers at Meta, Google, and Apple use to guarantee jank-free silky UI interactions.</p>
          </div>

          <div className="cheat-grid">
            <div className="pipe-card">
              <h4>1. The 16.6ms (and 8.3ms) Frame Budget</h4>
              <p>At 60Hz displays, you have <strong>16.6ms</strong> per frame. At 120Hz (Apple ProMotion / Gaming displays), you have only <strong>8.3ms</strong>. Browser overhead takes ~4ms, leaving ~4-10ms for JS execution!</p>
            </div>

            <div className="pipe-card">
              <h4>2. CSS <code>contain: layout paint content</code></h4>
              <p>Isolates DOM subtrees so mutations inside a widget never trigger global page reflows or repaints outside its container.</p>
              <code>contain: content; /* layout, paint, style &amp; size isolation */</code>
            </div>

            <div className="pipe-card">
              <h4>3. GPU Layer Promotion with <code>will-change</code></h4>
              <p>Promotes elements onto their own dedicated GPU compositor layer before animation begins, avoiding composite rasterization lag.</p>
              <code>will-change: transform, opacity;</code>
            </div>

            <div className="pipe-card">
              <h4>4. <code>content-visibility: auto</code></h4>
              <p>Modern CSS rule that skips layout and painting for off-screen elements until the user scrolls near them, speeding up initial page load by up to 85%.</p>
              <code>content-visibility: auto; contain-intrinsic-size: 0 400px;</code>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="pipe-footer">
        <Link to="/profiler" className="btn btn-secondary">
          ⚡ Web Vitals Profiler Lab
        </Link>
        <Link to="/visualizer" className="btn btn-primary">
          🌀 Event Loop &amp; Fiber Visualizer →
        </Link>
      </div>
    </div>
  )
}
