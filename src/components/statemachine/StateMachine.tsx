import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import './StateMachine.css'

export interface StateNode {
  id: string
  label: string
  description: string
  on: Record<string, { target: string; guard?: string; action?: string }>
}

export interface FsmPreset {
  id: string
  name: string
  description: string
  initialState: string
  states: StateNode[]
  initialContext: Record<string, unknown>
  xstateCode: string
}

const FSM_PRESETS: FsmPreset[] = [
  {
    id: 'media-player',
    name: '1. Media Player State Machine',
    description: 'Models a production audio/video player handling buffering, playback, pauses, errors, and seeking without race conditions.',
    initialState: 'idle',
    initialContext: { currentTime: 0, duration: 240, volume: 80, bufferPercent: 100 },
    states: [
      {
        id: 'idle',
        label: 'Idle (Stopped)',
        description: 'No media loaded. Player is inactive.',
        on: {
          LOAD_TRACK: { target: 'loading', action: 'Fetch media manifest' },
        },
      },
      {
        id: 'loading',
        label: 'Loading Manifest',
        description: 'Fetching media stream and metadata headers.',
        on: {
          LOADED: { target: 'playing', action: 'Start audio decode' },
          FAIL: { target: 'error', action: 'Log playback error' },
        },
      },
      {
        id: 'playing',
        label: 'Playing (60fps)',
        description: 'Actively playing audio/video stream.',
        on: {
          PAUSE: { target: 'paused', action: 'Halt playback clock' },
          BUFFER_EMPTY: { target: 'buffering', action: 'Pause clock, buffer stream' },
          TRACK_END: { target: 'ended', action: 'Reset playhead' },
        },
      },
      {
        id: 'paused',
        label: 'Paused',
        description: 'Stream is loaded and paused at current playhead.',
        on: {
          RESUME: { target: 'playing', action: 'Resume audio decode' },
          SEEK: { target: 'paused', action: 'Update playhead offset' },
        },
      },
      {
        id: 'buffering',
        label: 'Buffering Media',
        description: 'Network starved. Downloading forward segment chunks.',
        on: {
          BUFFER_READY: { target: 'playing', action: 'Resume playback' },
          TIMEOUT: { target: 'error', action: 'Network stall error' },
        },
      },
      {
        id: 'ended',
        label: 'Track Ended',
        description: 'Playback completed to 100% duration.',
        on: {
          REPLAY: { target: 'playing', action: 'Seek to 0:00 & play' },
          LOAD_TRACK: { target: 'loading', action: 'Load next track' },
        },
      },
      {
        id: 'error',
        label: 'Playback Error',
        description: 'Media decode or network failure encountered.',
        on: {
          RETRY: { target: 'loading', action: 'Retry manifest fetch' },
        },
      },
    ],
    xstateCode: `import { createMachine } from 'xstate';

export const mediaPlayerMachine = createMachine({
  id: 'mediaPlayer',
  initial: 'idle',
  context: { currentTime: 0, duration: 240, volume: 80 },
  states: {
    idle: { on: { LOAD_TRACK: 'loading' } },
    loading: { on: { LOADED: 'playing', FAIL: 'error' } },
    playing: { on: { PAUSE: 'paused', BUFFER_EMPTY: 'buffering', TRACK_END: 'ended' } },
    paused: { on: { RESUME: 'playing', SEEK: 'paused' } },
    buffering: { on: { BUFFER_READY: 'playing', TIMEOUT: 'error' } },
    ended: { on: { REPLAY: 'playing', LOAD_TRACK: 'loading' } },
    error: { on: { RETRY: 'loading' } }
  }
});`,
  },
  {
    id: 'checkout-flow',
    name: '2. Multi-Step Checkout with Guards',
    description: 'E-commerce purchase funnel with strict guard conditions preventing invalid state progression.',
    initialState: 'cart',
    initialContext: { cartTotal: 149.99, isAddressValid: true, hasFunds: true, attempts: 0 },
    states: [
      {
        id: 'cart',
        label: 'Shopping Cart',
        description: 'Items added to cart. Ready for checkout.',
        on: {
          PROCEED: { target: 'shipping', action: 'Lock item inventory' },
        },
      },
      {
        id: 'shipping',
        label: 'Shipping Details',
        description: 'Validating delivery address and tax estimation.',
        on: {
          SUBMIT_ADDRESS: { target: 'payment', guard: 'isAddressValid', action: 'Calculate shipping cost' },
          EDIT_CART: { target: 'cart' },
        },
      },
      {
        id: 'payment',
        label: 'Payment Method',
        description: 'Awaiting credit card authorization.',
        on: {
          AUTHORIZE: { target: 'processing', action: 'Dispatch Stripe token' },
          BACK_TO_SHIPPING: { target: 'shipping' },
        },
      },
      {
        id: 'processing',
        label: 'Processing Charge',
        description: 'Payment gateway charge in-flight.',
        on: {
          SUCCESS: { target: 'confirmed', action: 'Generate receipt invoice' },
          DECLINED: { target: 'declined', action: 'Increment retry counter' },
        },
      },
      {
        id: 'confirmed',
        label: 'Order Confirmed! 🎉',
        description: 'Payment captured and order confirmation dispatched.',
        on: {},
      },
      {
        id: 'declined',
        label: 'Payment Declined',
        description: 'Card declined or insufficient funds.',
        on: {
          TRY_AGAIN: { target: 'payment', action: 'Reset payment form' },
        },
      },
    ],
    xstateCode: `import { createMachine } from 'xstate';

export const checkoutMachine = createMachine({
  id: 'checkout',
  initial: 'cart',
  context: { cartTotal: 149.99, isAddressValid: true, hasFunds: true },
  states: {
    cart: { on: { PROCEED: 'shipping' } },
    shipping: {
      on: {
        SUBMIT_ADDRESS: {
          target: 'payment',
          guard: ({ context }) => context.isAddressValid
        },
        EDIT_CART: 'cart'
      }
    },
    payment: { on: { AUTHORIZE: 'processing', BACK_TO_SHIPPING: 'shipping' } },
    processing: { on: { SUCCESS: 'confirmed', DECLINED: 'declined' } },
    confirmed: { type: 'final' },
    declined: { on: { TRY_AGAIN: 'payment' } }
  }
});`,
  },
  {
    id: 'async-fetcher',
    name: '3. Resilient Fetcher with Backoff',
    description: 'Handles network API calls with automatic exponential backoff retries before bubbling terminal failures.',
    initialState: 'idle',
    initialContext: { data: null, error: null, retriesLeft: 3, delayMs: 1000 },
    states: [
      {
        id: 'idle',
        label: 'Idle',
        description: 'Ready to dispatch network request.',
        on: {
          FETCH: { target: 'fetching', action: 'Trigger AbortController fetch' },
        },
      },
      {
        id: 'fetching',
        label: 'Fetching API Data',
        description: 'HTTP request in-flight.',
        on: {
          RESOLVE: { target: 'success', action: 'Store JSON payload' },
          REJECT: { target: 'retrying', guard: 'retriesLeft > 0', action: 'Schedule retry timer' },
          FATAL: { target: 'failed', action: 'Display error toast' },
        },
      },
      {
        id: 'retrying',
        label: 'Exponential Backoff',
        description: 'Waiting before retry attempt.',
        on: {
          RETRY_NOW: { target: 'fetching', action: 'Decrement retriesLeft' },
        },
      },
      {
        id: 'success',
        label: 'Data Resolved (200 OK)',
        description: 'API response cached and ready for render.',
        on: {
          REFRESH: { target: 'fetching', action: 'Re-fetch latest data' },
        },
      },
      {
        id: 'failed',
        label: 'Terminal Failure (500)',
        description: 'All retries exhausted.',
        on: {
          MANUAL_RETRY: { target: 'fetching', action: 'Reset retries to 3' },
        },
      },
    ],
    xstateCode: `import { createMachine } from 'xstate';

export const asyncFetcherMachine = createMachine({
  id: 'asyncFetcher',
  initial: 'idle',
  context: { retriesLeft: 3, delayMs: 1000 },
  states: {
    idle: { on: { FETCH: 'fetching' } },
    fetching: {
      on: {
        RESOLVE: 'success',
        REJECT: { target: 'retrying', guard: ({ context }) => context.retriesLeft > 0 },
        FATAL: 'failed'
      }
    },
    retrying: { on: { RETRY_NOW: 'fetching' } },
    success: { on: { REFRESH: 'fetching' } },
    failed: { on: { MANUAL_RETRY: 'fetching' } }
  }
});`,
  },
]

export interface AuditLog {
  timestamp: string
  from: string
  event: string
  to: string
  action?: string
}

export default function StateMachine() {
  const [selectedPreset, setSelectedPreset] = useState<FsmPreset>(FSM_PRESETS[0])
  const [currentStateId, setCurrentStateId] = useState<string>(FSM_PRESETS[0].initialState)
  const [contextData, setContextData] = useState<Record<string, unknown>>(FSM_PRESETS[0].initialContext)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      timestamp: new Date().toLocaleTimeString(),
      from: 'INITIAL',
      event: 'INITIALIZE',
      to: FSM_PRESETS[0].initialState,
      action: 'Machine spawned',
    },
  ])
  const [copiedCode, setCopiedCode] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'simulator' | 'xstate-code'>('simulator')

  const currentState = useMemo(() => {
    return selectedPreset.states.find(s => s.id === currentStateId) || selectedPreset.states[0]
  }, [selectedPreset, currentStateId])

  const availableEvents = useMemo(() => {
    return Object.keys(currentState.on || {})
  }, [currentState])

  const handleApplyPreset = (preset: FsmPreset) => {
    setSelectedPreset(preset)
    setCurrentStateId(preset.initialState)
    setContextData(preset.initialContext)
    setAuditLogs([
      {
        timestamp: new Date().toLocaleTimeString(),
        from: 'INITIAL',
        event: 'INITIALIZE',
        to: preset.initialState,
        action: 'Preset loaded',
      },
    ])
  }

  const handleDispatchEvent = (event: string) => {
    const transition = currentState.on[event]
    if (!transition) return

    const nextStateId = transition.target
    const time = new Date().toLocaleTimeString()

    setAuditLogs(prev => [
      {
        timestamp: time,
        from: currentState.id,
        event,
        to: nextStateId,
        action: transition.action,
      },
      ...prev.slice(0, 15),
    ])

    setCurrentStateId(nextStateId)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedPreset.xstateCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  return (
    <div className="fsm-page page-enter">
      {/* Header */}
      <div className="fsm-header">
        <div>
          <span className="fsm-badge">⚙️ Finite State Automata &amp; XState Studio</span>
          <h1>State Machine &amp; XState Visualizer</h1>
          <p className="subtitle">
            Model complex frontend state machines without impossible state bugs. Interactive transition triggers, guard conditions, and 1-click XState v5 code export.
          </p>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="presets-bar">
        <span>FSM Presets:</span>
        <div className="presets-pills">
          {FSM_PRESETS.map(p => (
            <button
              key={p.id}
              type="button"
              className={`preset-pill ${selectedPreset.id === p.id ? 'active' : ''}`}
              onClick={() => handleApplyPreset(p)}
            >
              <strong>{p.name}</strong>
            </button>
          ))}
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="fsm-tabs-bar">
        <button
          type="button"
          className={`fsm-tab ${activeTab === 'simulator' ? 'active' : ''}`}
          onClick={() => setActiveTab('simulator')}
        >
          ▶ Interactive FSM Simulator
        </button>
        <button
          type="button"
          className={`fsm-tab ${activeTab === 'xstate-code' ? 'active' : ''}`}
          onClick={() => setActiveTab('xstate-code')}
        >
          📋 XState v5 TypeScript Definition
        </button>
      </div>

      {/* 1. SIMULATOR TAB */}
      {activeTab === 'simulator' && (
        <div className="simulator-grid">
          {/* Left Column: Visual State Diagram */}
          <div className="fsm-diagram-column">
            <div className="diagram-card">
              <div className="card-header-row">
                <h3>Visual State Diagram</h3>
                <span className="active-state-tag">
                  Current State: <strong>{currentState.id}</strong>
                </span>
              </div>
              <p className="fsm-preset-desc">{selectedPreset.description}</p>

              {/* State Nodes Grid */}
              <div className="state-nodes-grid">
                {selectedPreset.states.map(s => {
                  const isActive = s.id === currentStateId
                  return (
                    <div
                      key={s.id}
                      className={`state-node-box ${isActive ? 'active-node' : ''}`}
                    >
                      <div className="node-top-bar">
                        <span className="node-id-tag">{s.id}</span>
                        {isActive && <span className="node-pulse-dot" />}
                      </div>
                      <h4>{s.label}</h4>
                      <p>{s.description}</p>

                      {/* Transitions preview */}
                      <div className="node-transitions-list">
                        {Object.entries(s.on).map(([ev, tr]) => (
                          <span key={ev} className="trans-pill">
                            {ev} ➔ {tr.target}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Dispatcher & Audit Logs */}
          <div className="fsm-controls-column">
            {/* Event Dispatcher Card */}
            <div className="dispatcher-card">
              <h4>Dispatch Event (Current: {currentState.id})</h4>
              <p className="disp-desc">
                Only valid events for the active state are enabled. Impossible state transitions are mathematically prevented.
              </p>

              {availableEvents.length === 0 ? (
                <div className="final-state-box">
                  <span>🏁 Final State Reached (No outgoing transitions)</span>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => setCurrentStateId(selectedPreset.initialState)}
                  >
                    🔄 Restart State Machine
                  </button>
                </div>
              ) : (
                <div className="events-buttons-grid">
                  {availableEvents.map(ev => (
                    <button
                      key={ev}
                      type="button"
                      className="btn btn-primary event-btn"
                      onClick={() => handleDispatchEvent(ev)}
                    >
                      ⚡ {ev}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Context Inspector */}
            <div className="context-card">
              <h4>Machine Context (Extended State)</h4>
              <pre className="context-json">
                <code>{JSON.stringify(contextData, null, 2)}</code>
              </pre>
            </div>

            {/* Audit Log Stream */}
            <div className="audit-card">
              <div className="audit-header">
                <h4>Transition Audit Trail</h4>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setAuditLogs([])}
                >
                  Clear Logs
                </button>
              </div>

              <div className="audit-stream">
                {auditLogs.map((log, idx) => (
                  <div key={idx} className="audit-entry">
                    <span className="audit-time">{log.timestamp}</span>
                    <div className="audit-details">
                      <strong>{log.from}</strong> ➔ <code>{log.event}</code> ➔ <strong className="to-tag">{log.to}</strong>
                      {log.action && <span className="action-text">Action: {log.action}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. XSTATE CODE TAB */}
      {activeTab === 'xstate-code' && (
        <div className="code-export-container">
          <div className="code-export-header">
            <div>
              <h3>Production XState v5 Machine Code</h3>
              <p>Ready to drop into your React application using <code>useMachine(machine)</code>.</p>
            </div>
            <button
              type="button"
              className="btn btn-primary copy-code-btn"
              onClick={handleCopyCode}
            >
              {copiedCode ? '✓ Copied to Clipboard!' : '📋 Copy TypeScript Definition'}
            </button>
          </div>

          <pre className="xstate-code-box">
            <code>{selectedPreset.xstateCode}</code>
          </pre>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="fsm-footer">
        <Link to="/visualizer" className="btn btn-secondary">
          🌀 Concurrency &amp; Event Loop Visualizer
        </Link>
        <Link to="/case-studies" className="btn btn-primary">
          📐 FAANG Architecture Case Studies →
        </Link>
      </div>
    </div>
  )
}
