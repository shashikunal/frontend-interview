import { useState } from 'react'
import { Link } from 'react-router-dom'
import './SduiLab.css'

export interface SduiComponentNode {
  type: 'HEADER' | 'BANNER' | 'STAT_GRID' | 'BUTTON' | 'ALERT'
  props: Record<string, unknown>
  children?: SduiComponentNode[]
}

const DEFAULT_SDUI_SCHEMA: SduiComponentNode[] = [
  {
    type: 'HEADER',
    props: {
      title: 'FAANG Staff Engineer Roadmaps',
      badge: 'PRO TIER',
      subtitle: 'Dynamic layout rendered dynamically from backend JSON response.',
    },
  },
  {
    type: 'BANNER',
    props: {
      headline: '🔥 85% Off Black Friday Lifetime Access',
      ctaText: 'Claim Offer',
      bgGradient: 'brand',
    },
  },
  {
    type: 'STAT_GRID',
    props: {
      stats: [
        { label: 'Completed Challenges', val: '142' },
        { label: 'Mock Peer Sessions', val: '18' },
        { label: 'Interview Readiness', val: '94%' },
      ],
    },
  },
  {
    type: 'BUTTON',
    props: {
      label: '🚀 Launch Timed System Design Mock',
      variant: 'primary',
      action: 'START_MOCK',
    },
  },
]

export default function SduiLab() {
  const [activeTab, setActiveTab] = useState<'sdui' | 'rsc' | 'islands' | 'blueprints'>('sdui')

  // SDUI Editor State
  const [jsonText, setJsonText] = useState<string>(JSON.stringify(DEFAULT_SDUI_SCHEMA, null, 2))
  const [parsedSchema, setParsedSchema] = useState<SduiComponentNode[]>(DEFAULT_SDUI_SCHEMA)
  const [parseError, setParseError] = useState<string | null>(null)
  const [actionLog, setActionLog] = useState<string | null>(null)

  const handleJsonChange = (text: string) => {
    setJsonText(text)
    try {
      const parsed = JSON.parse(text)
      if (Array.isArray(parsed)) {
        setParsedSchema(parsed)
        setParseError(null)
      } else {
        setParseError('Schema root must be a JSON array of component nodes.')
      }
    } catch (err: unknown) {
      setParseError(err instanceof Error ? err.message : 'Invalid JSON format')
    }
  }

  const handleActionClick = (actionName: string) => {
    setActionLog(`⚡ SDUI Action Dispatched: ${actionName} at ${new Date().toLocaleTimeString()}`)
  }

  // Recursive SDUI Component Renderer
  const renderSduiNode = (node: SduiComponentNode, idx: number) => {
    switch (node.type) {
      case 'HEADER':
        return (
          <div key={idx} className="sdui-node sdui-header-node">
            <div className="node-top-row">
              <h2>{String(node.props.title || 'Untitled Header')}</h2>
              {Boolean(node.props.badge) && (
                <span className="sdui-badge">{String(node.props.badge)}</span>
              )}
            </div>
            {Boolean(node.props.subtitle) && (
              <p className="sdui-subtitle">{String(node.props.subtitle)}</p>
            )}
          </div>
        )

      case 'BANNER':
        return (
          <div key={idx} className="sdui-node sdui-banner-node">
            <span>{String(node.props.headline || 'Announcement')}</span>
            {Boolean(node.props.ctaText) && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleActionClick('BANNER_CTA_CLICK')}
              >
                {String(node.props.ctaText)}
              </button>
            )}
          </div>
        )


      case 'STAT_GRID':
        return (
          <div key={idx} className="sdui-node sdui-stat-grid-node">
            {Array.isArray(node.props.stats) &&
              node.props.stats.map((s: Record<string, unknown>, sIdx: number) => (
                <div key={sIdx} className="sdui-stat-card">
                  <span className="st-lbl">{String(s.label || '')}</span>
                  <strong className="st-val">{String(s.val || '')}</strong>
                </div>
              ))}
          </div>
        )

      case 'BUTTON':
        return (
          <div key={idx} className="sdui-node sdui-btn-node">
            <button
              type="button"
              className={`btn btn-${String(node.props.variant || 'primary')}`}
              onClick={() => handleActionClick(String(node.props.action || 'BUTTON_CLICK'))}
            >
              {String(node.props.label || 'Action')}
            </button>
          </div>
        )

      default:
        return (
          <div key={idx} className="sdui-node sdui-unknown">
            Unknown Component Type: {node.type}
          </div>
        )
    }
  }

  return (
    <div className="sdui-page page-enter">
      {/* Header */}
      <div className="sdui-header">
        <div>
          <span className="sdui-badge-pill">🏗️ Backend-Driven Component Architecture &amp; RSC</span>
          <h1>Hydration, Islands &amp; Server-Driven UI (SDUI) Studio</h1>
          <p className="subtitle">
            Render dynamic screens on the fly via backend JSON schemas (Airbnb/Uber style), inspect React Server Component (RSC) flight wire streams, and compare Islands hydration performance.
          </p>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="sdui-tabs-bar">
        <button
          type="button"
          className={`sdui-tab ${activeTab === 'sdui' ? 'active' : ''}`}
          onClick={() => setActiveTab('sdui')}
        >
          📱 1. Live Server-Driven UI (SDUI) Engine
        </button>
        <button
          type="button"
          className={`sdui-tab ${activeTab === 'rsc' ? 'active' : ''}`}
          onClick={() => setActiveTab('rsc')}
        >
          ⚡ 2. React Server Components (RSC) Stream
        </button>
        <button
          type="button"
          className={`sdui-tab ${activeTab === 'islands' ? 'active' : ''}`}
          onClick={() => setActiveTab('islands')}
        >
          🏝️ 3. Islands Architecture vs Full Hydration
        </button>
        <button
          type="button"
          className={`sdui-tab ${activeTab === 'blueprints' ? 'active' : ''}`}
          onClick={() => setActiveTab('blueprints')}
        >
          🏢 4. FAANG SDUI Blueprints (Airbnb &amp; Uber)
        </button>
      </div>

      {/* 1. SDUI ENGINE TAB */}
      {activeTab === 'sdui' && (
        <div className="sdui-main-grid">
          {/* Left Column: JSON Schema Editor */}
          <div className="editor-column">
            <div className="card-box">
              <div className="editor-top-row">
                <h3>Backend SDUI JSON Response Schema</h3>
                <span className="json-status">{parseError ? '❌ Error' : '✅ Valid'}</span>
              </div>
              <p className="desc">
                Modify this JSON payload. Watch the native UI component tree dynamically re-render on the right with zero client deployments!
              </p>

              <textarea
                className="sdui-json-editor"
                rows={16}
                value={jsonText}
                onChange={e => handleJsonChange(e.target.value)}
                spellCheck={false}
              />

              {parseError && <div className="sdui-error-banner">{parseError}</div>}
            </div>
          </div>

          {/* Right Column: Rendered Native Component Tree */}
          <div className="preview-column">
            <div className="card-box preview-card">
              <div className="preview-top-row">
                <h3>Dynamic Rendered UI Screen</h3>
                <span className="rendered-badge">● SDUI Dynamic Client</span>
              </div>

              <div className="sdui-rendered-container">
                {parsedSchema.map((node, i) => renderSduiNode(node, i))}
              </div>

              {actionLog && <div className="sdui-action-toast">{actionLog}</div>}
            </div>
          </div>
        </div>
      )}

      {/* 2. RSC STREAM TAB */}
      {activeTab === 'rsc' && (
        <div className="rsc-container">
          <div className="rsc-intro-banner">
            <div>
              <h3>React Server Components (RSC) Flight Stream Wire Format</h3>
              <p>
                Server Components execute <strong>exclusively on the backend</strong> with direct database access. They stream compact serialized Virtual DOM flight chunks to the browser with zero client JavaScript bundle size overhead.
              </p>
            </div>
          </div>

          <div className="rsc-grid">
            <div className="card-box">
              <h4>Server Component Flight Wire Payload (HTTP Stream)</h4>
              <pre className="rsc-code-box">
                <code>{`// HTTP/2 Chunked Stream: /dashboard (React 19 RSC)
0:["$","div",null,{"className":"user-profile-shell","children":[
  ["$","h1",null,{"children":"Staff Architecture Dashboard"}],
  ["$","$L1",null,{"userId":"usr_4829"}] // Reference to Client Component boundary!
]}]

// Chunk 2: Client Component Lazy Chunk Reference
1:I{"id":"./src/components/ClientCounter.js","chunks":["client-counter.js"],"name":"ClientCounter"}

// Chunk 3: Resolved Server Data
2:{"userName":"Alex Chen","reputation":4820}`}</code>
              </pre>
            </div>

            <div className="card-box">
              <h4>Benefits of Server Components</h4>
              <div className="rsc-benefits-list">
                <div className="benefit-item">
                  <span className="b-icon">📦</span>
                  <div>
                    <strong>Zero Client Bundle Size:</strong>
                    <p>Heavy dependencies like <code>marked</code> (Markdown parser) or <code>moment.js</code> never ship to the client browser.</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <span className="b-icon">🔒</span>
                  <div>
                    <strong>Direct Database &amp; Secret Access:</strong>
                    <p>Execute SQL queries and read private API keys directly inside component render functions.</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <span className="b-icon">⚡</span>
                  <div>
                    <strong>Seamless Client Boundary (`'use client'`):</strong>
                    <p>Interleave interactive client state (useState, event handlers) inside server trees without page reloads.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. ISLANDS TAB */}
      {activeTab === 'islands' && (
        <div className="islands-container">
          <div className="islands-intro-banner">
            <h3>Hydration Strategies: Monolith vs Selective vs Islands</h3>
            <p>How modern architectures minimize Time-to-Interactive (TTI) and eliminate main-thread CPU locks.</p>
          </div>

          <div className="islands-grid">
            <div className="card-box strategy-card">
              <span className="strat-tag monolith">1. Full Monolithic Hydration (Legacy Next.js)</span>
              <h4>Hydrates Entire DOM Tree at Once</h4>
              <p>
                The browser downloads HTML, then downloads a massive JS bundle that attaches event listeners to every element simultaneously. Freezes the main thread for 300ms+ on mobile devices.
              </p>
            </div>

            <div className="card-box strategy-card">
              <span className="strat-tag selective">2. Selective Hydration (React 18 &lt;Suspense&gt;)</span>
              <h4>Streams &amp; Prioritizes User Clicks</h4>
              <p>
                Components wrapped in <code>&lt;Suspense&gt;</code> stream HTML progressively. If a user clicks on an un-hydrated button, React interrupts its queue to hydrate that specific subtree first!
              </p>
            </div>


            <div className="card-box strategy-card">
              <span className="strat-tag islands">3. Islands Architecture (Astro / Fresh)</span>
              <h4>95% Pure Static HTML + Isolated Islands</h4>
              <p>
                Page is rendered as zero-JS static HTML. Interactive widgets exist as independent "Islands" hydrated on demand via triggers: <code>client:visible</code> or <code>client:idle</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. BLUEPRINTS TAB */}
      {activeTab === 'blueprints' && (
        <div className="bp-container">
          <div className="bp-intro-banner">
            <h3>FAANG Server-Driven UI (SDUI) Production Blueprints</h3>
            <p>How top engineering teams deploy instant UI updates and A/B experiments without App Store reviews.</p>
          </div>

          <div className="bp-grid">
            <div className="card-box bp-card">
              <span className="bp-tag airbnb">🏠 Airbnb (Ghost Platform)</span>
              <h4>Unified Backend Component Rendering</h4>
              <p>
                Airbnb’s homepage and listing details screens are 100% Server-Driven. The backend defines the exact component ordering, layout grids, and navigation actions, allowing product managers to run 50+ live A/B experiments simultaneously without mobile app updates.
              </p>
            </div>

            <div className="card-box bp-card">
              <span className="bp-tag uber">🚗 Uber &amp; Uber Eats</span>
              <h4>Dynamic Feed Architecture</h4>
              <p>
                Rides and Eats homefeeds are generated dynamically based on real-time driver availability, promotions, and weather conditions. Backend emits SDUI cards (e.g. <code>PromoBanner</code>, <code>CarTierCarousel</code>) mapped to pre-built native mobile &amp; web primitives.
              </p>
            </div>

            <div className="card-box bp-card">
              <span className="bp-tag doordash">🍔 DoorDash</span>
              <h4>Flexible Checkout Funnel</h4>
              <p>
                DoorDash uses SDUI to dynamically insert tipping options, upsell carousels, and substitution policies tailored to specific merchant requirements and geographic jurisdictions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="sdui-footer">
        <Link to="/design-system" className="btn btn-secondary">
          🎨 Design System &amp; Tokens Studio
        </Link>
        <Link to="/case-studies" className="btn btn-primary">
          📐 FAANG Architecture Case Studies →
        </Link>
      </div>
    </div>
  )
}
