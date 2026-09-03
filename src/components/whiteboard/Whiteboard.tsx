import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Whiteboard.css'

export interface StickyNote {
  id: string
  text: string
  x: number
  y: number
  color: string
}

export interface WsPacket {
  timestamp: string
  event: string
  client: string
  payload: string
}

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [activeTool, setActiveTool] = useState<'pen' | 'rect' | 'circle' | 'eraser'>('pen')
  const [strokeColor, setStrokeColor] = useState<string>('#6366f1')
  const [strokeWidth, setStrokeWidth] = useState<number>(3)

  // Sticky notes
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([
    {
      id: 'sticky-1',
      text: '📌 Architecture: Client ➔ WebSocket Gateway ➔ Redis Pub/Sub ➔ CRDT Document Engine',
      x: 30,
      y: 40,
      color: '#fef08a',
    },
    {
      id: 'sticky-2',
      text: '💡 Latency Target: < 50ms peer-to-peer cursor broadcast',
      x: 340,
      y: 40,
      color: '#bae6fd',
    },
  ])

  // Multiplayer Peer Simulation
  const [peerActivity, setPeerActivity] = useState<boolean>(true)
  const [peerCursors, setPeerCursors] = useState<{
    sarah: { x: number; y: number; tool: string }
    david: { x: number; y: number; tool: string }
  }>({
    sarah: { x: 480, y: 220, tool: 'pen' },
    david: { x: 260, y: 310, tool: 'rect' },
  })

  // WebSocket Packets Telemetry
  const [wsPackets, setWsPackets] = useState<WsPacket[]>([
    {
      timestamp: new Date().toLocaleTimeString(),
      event: 'WS_CONNECTED',
      client: 'wss://realtime.faang.io/whiteboard/room-77',
      payload: 'Handshake 101 Switching Protocols. Subscriptions: [crdt-sync, cursor-stream]',
    },
  ])

  const [activeTab, setActiveTab] = useState<'canvas' | 'crdt-guide'>('canvas')

  // Helper to log WS packets
  const logWsPacket = (event: string, client: string, payload: string) => {
    const packet: WsPacket = {
      timestamp: new Date().toLocaleTimeString(),
      event,
      client,
      payload,
    }
    setWsPackets(prev => [packet, ...prev.slice(0, 15)])
  }

  // Draw event listeners
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)

    logWsPacket('WS_DRAW_START', 'Local Candidate (You)', `x: ${Math.round(x)}, y: ${Math.round(y)}, tool: ${activeTool}`)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (activeTool === 'eraser') {
      ctx.strokeStyle = '#090d16'
      ctx.lineWidth = strokeWidth * 4
    } else {
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = strokeWidth
    }

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      logWsPacket('WS_DRAW_END', 'Local Candidate (You)', 'Stroke committed to CRDT document tree')
    }
  }

  const handleClearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    logWsPacket('WS_CANVAS_CLEARED', 'Local Candidate (You)', 'Cleared entire shared drawing state')
  }

  const handleAddSticky = (color: string) => {
    const newSticky: StickyNote = {
      id: `sticky-${Date.now()}`,
      text: 'New architecture note...',
      x: 80 + Math.random() * 200,
      y: 120 + Math.random() * 150,
      color,
    }
    setStickyNotes(prev => [...prev, newSticky])
    logWsPacket('WS_STICKY_CREATED', 'Local Candidate (You)', `id: ${newSticky.id}, x: ${Math.round(newSticky.x)}, y: ${Math.round(newSticky.y)}`)
  }

  // Multiplayer Peer Movement Simulator
  useEffect(() => {
    if (!peerActivity) return

    const interval = setInterval(() => {
      setPeerCursors(prev => ({
        sarah: {
          x: Math.max(50, Math.min(650, prev.sarah.x + (Math.random() * 40 - 20))),
          y: Math.max(50, Math.min(400, prev.sarah.y + (Math.random() * 40 - 20))),
          tool: 'pen',
        },
        david: {
          x: Math.max(50, Math.min(650, prev.david.x + (Math.random() * 40 - 20))),
          y: Math.max(50, Math.min(400, prev.david.y + (Math.random() * 40 - 20))),
          tool: 'rect',
        },
      }))
    }, 1200)

    return () => clearInterval(interval)
  }, [peerActivity])

  return (
    <div className="whiteboard-page page-enter">
      {/* Header */}
      <div className="whiteboard-header">
        <div>
          <span className="wb-badge">⚡ Real-Time Collaborative Architecture Canvas</span>
          <h1>Collaborative Whiteboard &amp; WebSocket Studio</h1>
          <p className="subtitle">
            Multi-user drawing canvas, multiplayer cursor synchronization, sticky notes, and real-time CRDT WebSocket packet telemetry.
          </p>
        </div>

        <div className="wb-header-actions">
          <button
            type="button"
            className={`btn ${peerActivity ? 'btn-primary' : 'btn-secondary'} peer-toggle-btn`}
            onClick={() => setPeerActivity(prev => !prev)}
          >
            {peerActivity ? '🟢 Multiplayer Active (2 Peers)' : '⚪ Multiplayer Paused'}
          </button>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="wb-tabs-bar">
        <button
          type="button"
          className={`wb-tab ${activeTab === 'canvas' ? 'active' : ''}`}
          onClick={() => setActiveTab('canvas')}
        >
          🎨 Live Whiteboard Canvas
        </button>
        <button
          type="button"
          className={`wb-tab ${activeTab === 'crdt-guide' ? 'active' : ''}`}
          onClick={() => setActiveTab('crdt-guide')}
        >
          📖 CRDT vs OT Collaborative Theory Guide
        </button>
      </div>

      {/* 1. CANVAS TAB */}
      {activeTab === 'canvas' && (
        <div className="wb-main-grid">
          {/* Left Column: Canvas & Sticky Stage */}
          <div className="canvas-column">
            {/* Toolbar */}
            <div className="canvas-toolbar">
              <div className="tool-group">
                <button
                  type="button"
                  className={`tool-btn ${activeTool === 'pen' ? 'active' : ''}`}
                  onClick={() => setActiveTool('pen')}
                  title="Freehand Pen"
                >
                  ✏️ Pen
                </button>
                <button
                  type="button"
                  className={`tool-btn ${activeTool === 'eraser' ? 'active' : ''}`}
                  onClick={() => setActiveTool('eraser')}
                  title="Eraser"
                >
                  🧹 Eraser
                </button>
              </div>

              <div className="tool-group">
                <span>Color:</span>
                <input
                  type="color"
                  className="color-picker-input"
                  value={strokeColor}
                  onChange={e => setStrokeColor(e.target.value)}
                />
              </div>

              <div className="tool-group">
                <span>Width:</span>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={strokeWidth}
                  onChange={e => setStrokeWidth(Number(e.target.value))}
                />
                <span>{strokeWidth}px</span>
              </div>

              <div className="tool-group">
                <span>Add Note:</span>
                <button
                  type="button"
                  className="sticky-add-btn yellow"
                  onClick={() => handleAddSticky('#fef08a')}
                >
                  + Yellow
                </button>
                <button
                  type="button"
                  className="sticky-add-btn blue"
                  onClick={() => handleAddSticky('#bae6fd')}
                >
                  + Blue
                </button>
                <button
                  type="button"
                  className="sticky-add-btn green"
                  onClick={() => handleAddSticky('#bbf7d0')}
                >
                  + Green
                </button>
              </div>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleClearCanvas}
              >
                Clear Canvas
              </button>
            </div>

            {/* Drawing Stage Wrapper */}
            <div className="canvas-stage-wrapper">
              <canvas
                ref={canvasRef}
                width={720}
                height={480}
                className="drawing-canvas"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />

              {/* Draggable / Editable Sticky Notes */}
              {stickyNotes.map(note => (
                <div
                  key={note.id}
                  className="sticky-note-card"
                  style={{
                    left: `${note.x}px`,
                    top: `${note.y}px`,
                    backgroundColor: note.color,
                  }}
                >
                  <textarea
                    defaultValue={note.text}
                    rows={3}
                    spellCheck={false}
                    onChange={e => {
                      logWsPacket('WS_STICKY_EDITED', 'Local Candidate (You)', `id: ${note.id}, text: "${e.target.value.slice(0, 20)}..."`)
                    }}
                  />
                </div>
              ))}

              {/* Simulated Peer Cursors */}
              {peerActivity && (
                <>
                  <div
                    className="peer-cursor sarah-cursor"
                    style={{ left: `${peerCursors.sarah.x}px`, top: `${peerCursors.sarah.y}px` }}
                  >
                    <span className="cursor-pointer">▲</span>
                    <span className="cursor-label">Sarah (Staff SWE - Google)</span>
                  </div>

                  <div
                    className="peer-cursor david-cursor"
                    style={{ left: `${peerCursors.david.x}px`, top: `${peerCursors.david.y}px` }}
                  >
                    <span className="cursor-pointer">▲</span>
                    <span className="cursor-label">David (Senior SWE - Meta)</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column: WebSocket Telemetry */}
          <div className="telemetry-column">
            <div className="ws-telemetry-card">
              <div className="telemetry-header-row">
                <h3>WebSocket Stream Telemetry</h3>
                <span className="ws-status-dot">● Real-Time CRDT</span>
              </div>
              <p className="ws-desc">
                Live bidirectional WebSocket frames transporting fractional indexing &amp; delta updates.
              </p>

              <div className="ws-packet-stream">
                {wsPackets.map((pkt, idx) => (
                  <div key={idx} className="ws-packet-entry">
                    <div className="pkt-top">
                      <span className="pkt-time">{pkt.timestamp}</span>
                      <span className="pkt-client">{pkt.client}</span>
                    </div>
                    <div className="pkt-event">{pkt.event}</div>
                    <div className="pkt-payload">{pkt.payload}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CRDT GUIDE TAB */}
      {activeTab === 'crdt-guide' && (
        <div className="crdt-guide-container">
          <div className="crdt-intro-banner">
            <h3>Real-Time Collaborative Systems: CRDTs vs Operational Transformation (OT)</h3>
            <p>
              How modern apps like Figma, Notion, and Google Docs achieve zero-conflict simultaneous multiplayer editing.
            </p>
          </div>

          <div className="crdt-grid">
            <div className="crdt-card">
              <span className="crdt-type-tag">Figma, Yjs, Automerge</span>
              <h4>1. Conflict-free Replicated Data Types (CRDTs)</h4>
              <p>
                Mathematical data structures that can be concurrently modified across multiple nodes without a central coordinating server. Local changes are applied immediately, and state converges deterministically via commutative merge rules.
              </p>
              <ul className="crdt-bullets">
                <li><strong>State vs Op-based:</strong> Transmits operation deltas over WebSockets or WebRTC data channels.</li>
                <li><strong>Fractional Indexing:</strong> Solves ordering without re-indexing entire arrays.</li>
                <li><strong>Offline First:</strong> Can edit fully offline and sync seamlessly upon reconnection.</li>
              </ul>
            </div>

            <div className="crdt-card">
              <span className="crdt-type-tag ot-tag">Google Docs, Etherpad</span>
              <h4>2. Operational Transformation (OT)</h4>
              <p>
                Relies on a single authoritative central server that serializes and transforms concurrent operation indices (e.g. <code>Insert(pos, char)</code>) before broadcasting to peers.
              </p>
              <ul className="crdt-bullets">
                <li><strong>Central Authority Required:</strong> High server complexity to maintain global revision tree.</li>
                <li><strong>Weak Offline Support:</strong> Difficult to resolve complex branching history offline.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="wb-footer">
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
