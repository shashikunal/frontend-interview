import { useState } from 'react'
import { Link } from 'react-router-dom'
import './ModuleFederation.css'

export interface RemoteApp {
  id: string
  name: string
  port: number
  team: string
  exposedModules: string[]
  description: string
  accentColor: string
}

const REMOTES: RemoteApp[] = [
  {
    id: 'catalog-remote',
    name: 'Catalog & Discovery Remote',
    port: 3001,
    team: 'Team Discovery',
    exposedModules: ['./CatalogList', './ProductCard', './SearchFilter'],
    description: 'Autonomous micro-app responsible for product browsing, search indexing, and recommendations.',
    accentColor: '#38bdf8',
  },
  {
    id: 'checkout-remote',
    name: 'Checkout & Payments Remote',
    port: 3002,
    team: 'Team Payments',
    exposedModules: ['./CartDrawer', './PaymentForm', './OrderSummary'],
    description: 'PCI-compliant checkout funnel handling Stripe tokens, taxes, and shipping addresses.',
    accentColor: '#10b981',
  },
  {
    id: 'auth-remote',
    name: 'User Identity & Auth Remote',
    port: 3003,
    team: 'Team Identity',
    exposedModules: ['./LoginForm', './UserAvatar', './SessionProvider'],
    description: 'OAuth2/SAML SSO authentication, token refresh rotation, and user profile management.',
    accentColor: '#a855f7',
  },
]

export interface MfeEvent {
  timestamp: string
  source: string
  type: string
  payload: string
}

export default function ModuleFederation() {
  const [activeRemoteId, setActiveRemoteId] = useState<string>('catalog-remote')
  const [cartCount, setCartCount] = useState<number>(2)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true)
  const [copiedConfig, setCopiedConfig] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'topology' | 'dependencies' | 'config-export'>('topology')

  const [eventStream, setEventStream] = useState<MfeEvent[]>([
    {
      timestamp: new Date().toLocaleTimeString(),
      source: 'HostContainer (:3000)',
      type: 'FEDERATION_INITIALIZED',
      payload: 'Remotes registered: [3001, 3002, 3003]',
    },
  ])

  const activeRemote = REMOTES.find(r => r.id === activeRemoteId) || REMOTES[0]

  const dispatchMfeEvent = (source: string, type: string, payload: string) => {
    const newEv: MfeEvent = {
      timestamp: new Date().toLocaleTimeString(),
      source,
      type,
      payload,
    }
    setEventStream(prev => [newEv, ...prev.slice(0, 15)])
  }

  const handleAddToCart = () => {
    const nextCount = cartCount + 1
    setCartCount(nextCount)
    dispatchMfeEvent('CatalogRemote (:3001)', 'ITEM_ADDED_TO_CART', `Product #4928 added. Total items: ${nextCount}`)
  }

  const handleToggleAuth = () => {
    const nextAuth = !isLoggedIn
    setIsLoggedIn(nextAuth)
    dispatchMfeEvent(
      'AuthRemote (:3003)',
      nextAuth ? 'USER_LOGGED_IN' : 'USER_LOGGED_OUT',
      nextAuth ? 'Session active: Alex Chen (alex@faang.com)' : 'Session terminated'
    )
  }

  const handleCheckout = () => {
    dispatchMfeEvent('CheckoutRemote (:3002)', 'PAYMENT_AUTHORIZED', 'Transaction $289.50 captured via Stripe SDK')
  }

  const webpackConfigCode = `// Host Shell: webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'hostApp',
      remotes: {
        catalogApp: 'catalogApp@http://localhost:3001/remoteEntry.js',
        checkoutApp: 'checkoutApp@http://localhost:3002/remoteEntry.js',
        authApp: 'authApp@http://localhost:3003/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0', eager: false },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0', eager: false },
        zustand: { singleton: true }
      }
    })
  ]
};`

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(webpackConfigCode)
    setCopiedConfig(true)
    setTimeout(() => setCopiedConfig(false), 2000)
  }

  return (
    <div className="mfe-page page-enter">
      {/* Header */}
      <div className="mfe-header">
        <div>
          <span className="mfe-badge">🌐 Micro-Frontend (MFE) Architecture Studio</span>
          <h1>Micro-Frontends &amp; Module Federation Studio</h1>
          <p className="subtitle">
            Simulate Webpack 5 &amp; Vite runtime module federation, dynamic remote loading, singleton dependency deduplication, and cross-MFE event bus telemetry.
          </p>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="mfe-tabs-bar">
        <button
          type="button"
          className={`mfe-tab ${activeTab === 'topology' ? 'active' : ''}`}
          onClick={() => setActiveTab('topology')}
        >
          🏗️ Host-Remote Topology &amp; Live Sandbox
        </button>
        <button
          type="button"
          className={`mfe-tab ${activeTab === 'dependencies' ? 'active' : ''}`}
          onClick={() => setActiveTab('dependencies')}
        >
          📦 Shared Singleton Scope Negotiator
        </button>
        <button
          type="button"
          className={`mfe-tab ${activeTab === 'config-export' ? 'active' : ''}`}
          onClick={() => setActiveTab('config-export')}
        >
          📋 Webpack 5 &amp; Vite Federation Config
        </button>
      </div>

      {/* 1. TOPOLOGY TAB */}
      {activeTab === 'topology' && (
        <div className="topology-grid">
          {/* Left Column: Remotes & Host Canvas */}
          <div className="topology-canvas-col">
            {/* Host Container Card */}
            <div className="host-shell-card">
              <div className="shell-header-bar">
                <div className="shell-branding">
                  <span className="shell-dot" />
                  <strong>Host Shell Container (<code>localhost:3000</code>)</strong>
                </div>
                <div className="shell-nav-badges">
                  <span className="shell-badge">
                    👤 {isLoggedIn ? 'Alex Chen' : 'Guest'}
                  </span>
                  <span className="shell-badge cart-badge">
                    🛒 Cart ({cartCount})
                  </span>
                </div>
              </div>

              {/* Dynamic Remote Navigation */}
              <div className="remotes-nav-bar">
                <span>Dynamically Load Remote:</span>
                <div className="remotes-buttons">
                  {REMOTES.map(r => (
                    <button
                      key={r.id}
                      type="button"
                      className={`remote-nav-btn ${activeRemoteId === r.id ? 'active' : ''}`}
                      style={{
                        borderColor: activeRemoteId === r.id ? r.accentColor : 'var(--border)',
                        color: activeRemoteId === r.id ? r.accentColor : 'var(--text-primary)',
                      }}
                      onClick={() => {
                        setActiveRemoteId(r.id)
                        dispatchMfeEvent('HostContainer (:3000)', 'REMOTE_MOUNTED', `Mounted ${r.name} from port :${r.port}`)
                      }}
                    >
                      <strong>{r.name}</strong>
                      <small>(:{r.port})</small>
                    </button>
                  ))}
                </div>
              </div>

              {/* Federated Remote Micro-App Frame */}
              <div className="federated-frame" style={{ borderColor: activeRemote.accentColor }}>
                <div className="frame-header" style={{ background: `${activeRemote.accentColor}18` }}>
                  <span className="frame-title" style={{ color: activeRemote.accentColor }}>
                    ● Remote Entry: <code>{activeRemote.name}</code> (Owner: {activeRemote.team})
                  </span>
                  <span className="exposed-tag">
                    Exposes: {activeRemote.exposedModules.join(', ')}
                  </span>
                </div>

                <div className="frame-body">
                  {activeRemote.id === 'catalog-remote' && (
                    <div className="remote-content-demo">
                      <h4>Catalog Micro-App (Discovery Team)</h4>
                      <p>Renders autonomous product grid. Dispatches cross-MFE event upon action.</p>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleAddToCart}
                      >
                        🛍️ Simulate "Add to Cart" (+1 Item)
                      </button>
                    </div>
                  )}

                  {activeRemote.id === 'checkout-remote' && (
                    <div className="remote-content-demo">
                      <h4>Checkout &amp; Payments Micro-App (Payments Team)</h4>
                      <p>PCI-compliant isolated payment drawer reading shared global cart count.</p>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleCheckout}
                      >
                        💳 Simulate "Authorize $289.50 Payment"
                      </button>
                    </div>
                  )}

                  {activeRemote.id === 'auth-remote' && (
                    <div className="remote-content-demo">
                      <h4>Identity &amp; Auth Micro-App (Security Team)</h4>
                      <p>Handles SSO identity state, synchronized with Host Container.</p>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleToggleAuth}
                      >
                        {isLoggedIn ? '🚪 Simulate "Sign Out"' : '🔑 Simulate "Sign In"'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Cross-MFE Event Bus Stream */}
          <div className="event-stream-col">
            <div className="event-stream-card">
              <div className="stream-header-row">
                <h3>Cross-MFE Event Bus Stream</h3>
                <span className="live-pill">● CustomEvent Bus</span>
              </div>
              <p className="stream-desc">
                Decoupled communication between isolated micro-frontends without tight code coupling.
              </p>

              <div className="stream-events-list">
                {eventStream.map((ev, idx) => (
                  <div key={idx} className="stream-event-item">
                    <div className="ev-meta">
                      <span className="ev-time">{ev.timestamp}</span>
                      <span className="ev-src">{ev.source}</span>
                    </div>
                    <div className="ev-type">{ev.type}</div>
                    <div className="ev-payload">{ev.payload}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DEPENDENCIES TAB */}
      {activeTab === 'dependencies' && (
        <div className="deps-container">
          <div className="deps-intro-banner">
            <h3>Shared Singleton Dependency Negotiation</h3>
            <p>
              Module Federation dynamically deduplicates shared libraries at runtime, ensuring only a single React instance exists in memory while allowing isolated versions for non-singletons.
            </p>
          </div>

          <div className="deps-table-wrap">
            <table className="deps-table">
              <thead>
                <tr>
                  <th>Package Name</th>
                  <th>Singleton Mode</th>
                  <th>Required Version</th>
                  <th>Conflict Strategy</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>react</code></td>
                  <td><span className="status-badge green">true</span></td>
                  <td><code>^19.0.0</code></td>
                  <td>Strict Error on Mismatch (Prevents Invalid Hook Calls)</td>
                  <td>✅ Shared Single Instance</td>
                </tr>
                <tr>
                  <td><code>react-dom</code></td>
                  <td><span className="status-badge green">true</span></td>
                  <td><code>^19.0.0</code></td>
                  <td>Strict Error on Mismatch</td>
                  <td>✅ Shared Single Instance</td>
                </tr>
                <tr>
                  <td><code>zustand</code></td>
                  <td><span className="status-badge green">true</span></td>
                  <td><code>^4.5.0</code></td>
                  <td>Singleton Global State Bus</td>
                  <td>✅ Shared Single Instance</td>
                </tr>
                <tr>
                  <td><code>lodash</code></td>
                  <td><span className="status-badge yellow">false</span></td>
                  <td><code>^4.17.21</code></td>
                  <td>Fallback to Isolated Bundle per Remote</td>
                  <td>⚠️ Isolated per Micro-App</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CONFIG EXPORT TAB */}
      {activeTab === 'config-export' && (
        <div className="config-export-container">
          <div className="config-header-row">
            <div>
              <h3>Webpack 5 ModuleFederationPlugin Setup</h3>
              <p>Production host orchestrator configuration with typed remote manifests.</p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCopyConfig}
            >
              {copiedConfig ? '✓ Copied to Clipboard!' : '📋 Copy webpack.config.js'}
            </button>
          </div>

          <pre className="config-code-box">
            <code>{webpackConfigCode}</code>
          </pre>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="mfe-footer">
        <Link to="/case-studies" className="btn btn-secondary">
          📐 FAANG Architecture Case Studies
        </Link>
        <Link to="/system-design" className="btn btn-primary">
          🏗️ Open System Design Studio →
        </Link>
      </div>
    </div>
  )
}
