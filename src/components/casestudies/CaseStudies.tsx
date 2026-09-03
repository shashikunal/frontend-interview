import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './CaseStudies.css'

export interface CaseStudyStep {
  stepNumber: number
  tier: 'Client UI' | 'Worker / Local Store' | 'Network / Transport' | 'Server / Cloud'
  title: string
  description: string
  payloadPreview?: string
}

export interface CaseStudy {
  id: string
  company: string
  title: string
  icon: string
  scaleMetric: string
  architectLevel: string
  summary: string
  techStack: string[]
  keyChallenges: string[]
  tradeOffs: { choice: string; alternative: string; rationale: string }[]
  dataFlowSteps: CaseStudyStep[]
  interviewerRubric: string[]
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'figma-canvas',
    company: 'Figma',
    title: 'Real-Time Multiplayer Infinite Canvas',
    icon: '🎨',
    scaleMetric: '50+ concurrent editors · 50k+ vector nodes · 60fps canvas',
    architectLevel: 'Staff / Principal Architect (L6/L7)',
    summary: 'Figma bypassed the DOM entirely for the main canvas, compiling a custom C++ rendering engine to WebAssembly with WebGL rendering and Yjs CRDTs over WebSockets for zero-conflict peer synchronization.',
    techStack: ['WebAssembly (C++)', 'WebGL / Canvas 2D', 'Web Workers', 'Yjs CRDTs', 'WebSockets', 'Spatial Hash Grid'],
    keyChallenges: [
      'DOM overhead: Standard HTML DOM elements cannot render 50,000+ vector paths at 60fps.',
      'Distributed State: Handling simultaneous vector node transformations without locking.',
      'Viewport Culling: Quickly discovering which of the 50,000 objects are within the visible screen.',
    ],
    tradeOffs: [
      {
        choice: 'Custom WebAssembly + WebGL Renderer',
        alternative: 'SVG / HTML DOM Elements',
        rationale: 'WebGL allows direct hardware GPU rendering, maintaining 60fps pan/zoom across 100,000+ shapes where DOM trees grind to 2fps.',
      },
      {
        choice: 'CRDTs (Conflict-free Replicated Data Types)',
        alternative: 'Centralized Server Lock-based Editing',
        rationale: 'CRDTs allow local optimistic mutations without waiting for server network roundtrips, guaranteeing mathematical convergence across all peers.',
      },
    ],
    dataFlowSteps: [
      {
        stepNumber: 1,
        tier: 'Client UI',
        title: '1. User Moves Vector Node',
        description: 'Candidate clicks and drags a vector shape. High-frequency PointerEvents are captured and normalized to canvas world coordinates.',
        payloadPreview: '{ event: "POINTER_MOVE", x: 1420.5, y: 860.2, targetId: "node_982" }',
      },
      {
        stepNumber: 2,
        tier: 'Worker / Local Store',
        title: '2. Spatial Hash Grid Culling',
        description: 'Web Worker queries a 2D spatial hash grid in O(1) time to detect intersecting elements and marks the dirty canvas bounding box.',
        payloadPreview: '{ dirtyRect: { x: 1400, y: 840, width: 60, height: 60 }, culledNodes: 12 }',
      },
      {
        stepNumber: 3,
        tier: 'Client UI',
        title: '3. GPU WebGL Frame Render (60fps)',
        description: 'WebAssembly pipeline updates vertex buffers and renders the modified scene graph via WebGL at 60 frames per second.',
      },
      {
        stepNumber: 4,
        tier: 'Network / Transport',
        title: '4. Yjs CRDT Binary Delta Dispatch',
        description: 'The mutation is encoded as an immutable Yjs binary update delta and dispatched over a WebSocket connection to the collaboration gateway.',
        payloadPreview: 'Uint8Array [ 1, 23, 142, 98, 2, 10, 44, 18 ... ] (Binary CRDT Delta)',
      },
      {
        stepNumber: 5,
        tier: 'Server / Cloud',
        title: '5. WebSocket Broadcast to Remote Peers',
        description: 'Central WebSocket routing cluster broadcasts the delta to all collaborators active in the document session.',
      },
      {
        stepNumber: 6,
        tier: 'Worker / Local Store',
        title: '6. Remote Peer CRDT Document Merge',
        description: 'Remote clients receive the binary delta and execute `Y.applyUpdate()`, merging the vector translation deterministically without layout shifts.',
      },
    ],
    interviewerRubric: [
      'Candidate demonstrates why DOM elements fail at scale and justifies WebGL/WASM.',
      'Candidate explains CRDT conflict resolution vs Operational Transformation (OT).',
      'Candidate articulates spatial indexing (Spatial Hash / R-Tree / QuadTree) for viewport culling.',
    ],
  },
  {
    id: 'meta-messenger',
    company: 'Meta',
    title: 'Meta Messenger Local-First Architecture',
    icon: '💬',
    scaleMetric: '100M+ DAU · Sub-100ms cold start · 100% offline-first',
    architectLevel: 'Senior / Staff Engineer (L5/L6)',
    summary: 'Meta re-architected Messenger Web from a heavy 1.5MB React SPA to a local-first SQLite database compiled to WASM running directly in the browser via Origin Private File System (OPFS).',
    techStack: ['React 19', 'SQLite (WASM)', 'OPFS Storage', 'WebSockets', 'Service Workers', 'Optimistic Outbox'],
    keyChallenges: [
      'Slow Cold Start: Loading massive JS bundles and making dozens of network waterfall queries on boot.',
      'Offline Resilience: Users expect instant message drafting and conversation history offline.',
      'Cache Invalidation: Syncing millions of threads with zero stale data anomalies.',
    ],
    tradeOffs: [
      {
        choice: 'Client-Side SQLite WASM Database',
        alternative: 'Redux / IndexedDB Raw Key-Value Store',
        rationale: 'SQLite allows complex relational SQL queries directly in the client worker, ensuring sub-5ms query times across 50,000+ local messages.',
      },
      {
        choice: 'Optimistic Outbox Sync Pattern',
        alternative: 'Direct Async REST Calls',
        rationale: 'Messages are persisted to local SQLite first (instant UI update) and drained by a background sync worker with retry jitter.',
      },
    ],
    dataFlowSteps: [
      {
        stepNumber: 1,
        tier: 'Client UI',
        title: '1. User Types & Clicks Send',
        description: 'User enters text into the message input. React captures the event and invokes the local SQLite mutation dispatcher.',
        payloadPreview: '{ text: "Let\'s meet at 5pm!", threadId: "thr_449", tempId: "tmp_01" }',
      },
      {
        stepNumber: 2,
        tier: 'Worker / Local Store',
        title: '2. Write to Local SQLite WASM (OPFS)',
        description: 'Message is written directly to SQLite in the browser OPFS with status="PENDING". UI immediately renders message with a single gray checkmark.',
        payloadPreview: 'INSERT INTO messages (id, thread_id, body, status) VALUES ("tmp_01", "thr_449", "...", "PENDING");',
      },
      {
        stepNumber: 3,
        tier: 'Network / Transport',
        title: '3. Outbox Queue WebSocket Dispatch',
        description: 'Background Outbox worker dequeues pending mutation and dispatches it over the persistent WebSocket connection.',
        payloadPreview: '{ type: "SEND_MSG", payload: { threadId: "thr_449", body: "...", clientTimestamp: 1725239480 } }',
      },
      {
        stepNumber: 4,
        tier: 'Server / Cloud',
        title: '4. Server Persistence & Sequence ID Assignment',
        description: 'Backend persists message into distributed database, assigns a global monotonically increasing sequence ID, and emits an ACK.',
        payloadPreview: '{ ack: true, tempId: "tmp_01", serverMsgId: "msg_988214", seq: 10482 }',
      },
      {
        stepNumber: 5,
        tier: 'Worker / Local Store',
        title: '5. Local SQLite Status Update (DELIVERED)',
        description: 'Client receives server ACK, updates SQLite message status to "DELIVERED", and React UI renders the double blue checkmark icon.',
      },
    ],
    interviewerRubric: [
      'Candidate understands local-first state and why SQLite WASM surpasses raw IndexedDB.',
      'Candidate designs an optimistic outbox queue handling offline intermittent network drops.',
      'Candidate explains delta synchronization with server sequence monotonic counters.',
    ],
  },
  {
    id: 'uber-dispatch',
    company: 'Uber',
    title: 'Uber Rider Real-Time Dispatch & Tracking',
    icon: '🚗',
    scaleMetric: '25k active vehicles / metro · 60fps smooth car interpolation',
    architectLevel: 'Senior Frontend Engineer (L5)',
    summary: 'Uber powers real-time vehicle dispatch using Uber H3 hexagonal spatial indexing on the backend and Mapbox GL WebGL with dead-reckoning Bézier interpolation on the frontend.',
    techStack: ['Uber H3 Hexagonal Index', 'Mapbox GL / WebGL', 'Server-Sent Events (SSE)', 'Bézier Interpolation'],
    keyChallenges: [
      'GPS Jitter: Raw GPS coordinates arrive with delay, noise, and jumpiness.',
      'High-Throughput Streams: Streaming 25,000 driver locations per city without crashing mobile RAM.',
      'Geofencing: Detecting pickup ETA and arrival events in real time.',
    ],
    tradeOffs: [
      {
        choice: 'Server-Sent Events (SSE) for Telemetry Stream',
        alternative: 'Full-Duplex WebSockets',
        rationale: 'SSE provides lightweight unidirectional streaming over HTTP/2 with built-in reconnection, ideal for server-to-client GPS updates.',
      },
      {
        choice: 'Dead-Reckoning Bézier Curve Interpolation',
        alternative: 'Raw GPS Coordinate Teleportation',
        rationale: 'Interpolating vehicle position between updates along the roadway vector creates a smooth 60fps glide animation without visual snapping.',
      },
    ],
    dataFlowSteps: [
      {
        stepNumber: 1,
        tier: 'Server / Cloud',
        title: '1. Driver GPS Update Ingested',
        description: 'Driver mobile app transmits GPS telemetry (lat, lng, heading, speed) to Uber ingestion gateways.',
        payloadPreview: '{ driverId: "drv_712", lat: 37.7749, lng: -122.4194, heading: 85, speedKmh: 45 }',
      },
      {
        stepNumber: 2,
        tier: 'Server / Cloud',
        title: '2. Uber H3 Hexagonal Cell Mapping',
        description: 'Backend converts coordinates into an H3 Hex Cell Index (Resolution 8) and identifies subscribed riders in adjacent cells.',
        payloadPreview: 'H3Index: "8828308281fffff" (San Francisco downtown hex cell)',
      },
      {
        stepNumber: 3,
        tier: 'Network / Transport',
        title: '3. Server-Sent Events (SSE) Delta Stream',
        description: 'SSE stream pushes updated vehicle coordinates and estimated time of arrival (ETA) to the rider client.',
        payloadPreview: 'event: vehicle_update\ndata: { id: "drv_712", lat: 37.7751, lng: -122.4189, etaMinutes: 3 }\n\n',
      },
      {
        stepNumber: 4,
        tier: 'Client UI',
        title: '4. Dead-Reckoning Bézier Animation (60fps)',
        description: 'Mapbox WebGL canvas interpolates the vehicle marker smoothly along the road polyline using requestAnimationFrame.',
      },
    ],
    interviewerRubric: [
      'Candidate articulates spatial indexing (H3 Hexagons / Geohashing) to prevent global broadcast broadcasts.',
      'Candidate explains coordinate interpolation (dead-reckoning) for smooth 60fps animations.',
      'Candidate justifies SSE vs WebSocket for unidirectional telemetry streaming.',
    ],
  },
  {
    id: 'netflix-player',
    company: 'Netflix',
    title: 'Netflix Adaptive Video Player & DRM Pipeline',
    icon: '🍿',
    scaleMetric: '250M+ global subscribers · 4K HDR 60fps · Zero buffering',
    architectLevel: 'Staff Frontend Architect (L6/L7)',
    summary: 'Netflix builds a custom video player engine using HTML5 Media Source Extensions (MSE) and Encrypted Media Extensions (EME DRM) with a Web Worker buffer management thread.',
    techStack: ['Media Source Extensions (MSE)', 'Encrypted Media Extensions (EME)', 'Widevine / FairPlay DRM', 'Web Workers', 'Adaptive HLS/DASH'],
    keyChallenges: [
      'Bandwidth Fluctuations: Adapting stream quality seamlessly between 1080p, 4K, and 720p without video stalls.',
      'Content Protection: Decrypting 4K streams securely through hardware Content Decryption Modules (CDM).',
      'Battery & CPU Efficiency: Offloading segment downloading and demuxing away from the main UI thread.',
    ],
    tradeOffs: [
      {
        choice: 'Web Worker Stream Demuxer & Buffer Engine',
        alternative: 'Main-Thread Demuxing',
        rationale: 'Processing and parsing ISO-BMFF video segment chunks inside a dedicated Web Worker prevents UI stutters on user interactions.',
      },
      {
        choice: 'Dynamic Throughput Sliding Window ABR',
        alternative: 'Fixed Bitrate Streaming',
        rationale: 'Measuring chunk download speeds across a sliding 5-second window allows proactive bitrate stepping before buffer starvation occurs.',
      },
    ],
    dataFlowSteps: [
      {
        stepNumber: 1,
        tier: 'Network / Transport',
        title: '1. Master Manifest Fetch (HLS/DASH)',
        description: 'Player fetches master manifest describing available bitrates (360p up to 4K Dolby Vision) and audio codec tracks.',
        payloadPreview: '#EXTM3U\n#EXT-X-STREAM-INF:BANDWIDTH=15000000,RESOLUTION=3840x2160\n4k_stream.m3u8',
      },
      {
        stepNumber: 2,
        tier: 'Worker / Local Store',
        title: '2. ABR Worker Evaluates Bandwidth',
        description: 'Adaptive Bitrate worker measures download throughput of the last 3 chunks and selects optimal 4K profile.',
        payloadPreview: '{ measuredThroughputMbps: 48.2, targetBitrate: "4K_UHD_15Mbps", forwardBufferSeconds: 28 }',
      },
      {
        stepNumber: 3,
        tier: 'Network / Transport',
        title: '3. Encrypted Chunk Fetch (2s ISO-BMFF)',
        description: 'Worker fetches 2-second video segment chunks from the nearest CDN edge Point of Presence (PoP).',
      },
      {
        stepNumber: 4,
        tier: 'Worker / Local Store',
        title: '4. Hardware DRM Decryption (EME CDM)',
        description: 'Encrypted chunk is passed to the browser Content Decryption Module (Widevine/FairPlay) via Encrypted Media Extensions.',
      },
      {
        stepNumber: 5,
        tier: 'Client UI',
        title: '5. Append to HTML5 SourceBuffer (60fps Decode)',
        description: 'Decrypted media frames are appended to the HTML5 `SourceBuffer` and decoded by hardware GPU video pipelines.',
      },
    ],
    interviewerRubric: [
      'Candidate explains the roles of Media Source Extensions (MSE) and Encrypted Media Extensions (EME).',
      'Candidate articulates adaptive bitrate (ABR) buffer algorithms and forward buffer thresholds.',
      'Candidate demonstrates why Web Workers are essential for high-bitrate media parsing.',
    ],
  },
]

export default function CaseStudies() {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy>(CASE_STUDIES[0])
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0)
  const [isPlayingReplay, setIsPlayingReplay] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'stepper' | 'tradeoffs' | 'rubric'>('stepper')

  // Auto-play replay timer
  useEffect(() => {
    if (!isPlayingReplay) return

    const interval = setInterval(() => {
      setActiveStepIndex(prev => {
        if (prev >= selectedStudy.dataFlowSteps.length - 1) {
          setIsPlayingReplay(false)
          return prev
        }
        return prev + 1
      })
    }, 2400)

    return () => clearInterval(interval)
  }, [isPlayingReplay, selectedStudy])

  const currentStep = selectedStudy.dataFlowSteps[activeStepIndex] || selectedStudy.dataFlowSteps[0]

  return (
    <div className="case-studies-page page-enter">
      {/* Header */}
      <div className="cs-header">
        <div>
          <span className="cs-badge">🏗️ Staff-Level FAANG Architecture Blueprints</span>
          <h1>FAANG Architecture Case Studies &amp; Replays</h1>
          <p className="subtitle">
            Interactive, step-by-step architectural replays for Figma, Meta Messenger, Uber, and Netflix. Explore data flows, trade-off matrices, and hiring rubrics.
          </p>
        </div>
      </div>

      {/* Case Studies Selector Cards */}
      <div className="cs-selector-grid">
        {CASE_STUDIES.map(cs => (
          <button
            key={cs.id}
            type="button"
            className={`cs-card ${selectedStudy.id === cs.id ? 'active' : ''}`}
            onClick={() => {
              setSelectedStudy(cs)
              setActiveStepIndex(0)
              setIsPlayingReplay(false)
            }}
          >
            <div className="cs-card-top">
              <span className="cs-icon">{cs.icon}</span>
              <span className="cs-company-pill">{cs.company}</span>
            </div>
            <h3 className="cs-title">{cs.title}</h3>
            <span className="cs-scale-metric">{cs.scaleMetric}</span>
            <span className="cs-level-tag">{cs.architectLevel}</span>
          </button>
        ))}
      </div>

      {/* Selected Study Dossier Hero */}
      <div className="study-hero-dossier">
        <div className="dossier-left">
          <div className="dossier-title-row">
            <span className="dossier-icon">{selectedStudy.icon}</span>
            <div>
              <span className="dossier-company">{selectedStudy.company} Architecture Blueprint</span>
              <h2>{selectedStudy.title}</h2>
            </div>
          </div>
          <p className="dossier-summary">{selectedStudy.summary}</p>

          <div className="dossier-tech-row">
            {selectedStudy.techStack.map(t => (
              <span key={t} className="tech-pill">{t}</span>
            ))}
          </div>
        </div>

        <div className="dossier-right">
          <h4>Key Architectural Challenges</h4>
          <ul className="challenges-list">
            {selectedStudy.keyChallenges.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="cs-tabs-bar">
        <button
          type="button"
          className={`cs-tab ${activeTab === 'stepper' ? 'active' : ''}`}
          onClick={() => setActiveTab('stepper')}
        >
          ▶ Interactive Data-Flow Replay ({selectedStudy.dataFlowSteps.length} Steps)
        </button>
        <button
          type="button"
          className={`cs-tab ${activeTab === 'tradeoffs' ? 'active' : ''}`}
          onClick={() => setActiveTab('tradeoffs')}
        >
          ⚖️ Architectural Trade-off Matrix ({selectedStudy.tradeOffs.length} Trade-offs)
        </button>
        <button
          type="button"
          className={`cs-tab ${activeTab === 'rubric' ? 'active' : ''}`}
          onClick={() => setActiveTab('rubric')}
        >
          🏆 Staff Hiring Evaluation Rubric
        </button>
      </div>

      {/* 1. DATA FLOW STEPPER TAB */}
      {activeTab === 'stepper' && (
        <div className="stepper-container">
          {/* Controls Bar */}
          <div className="stepper-controls-bar">
            <div className="controls-left">
              <button
                type="button"
                className={`btn btn-sm ${isPlayingReplay ? 'btn-danger' : 'btn-primary'} replay-toggle-btn`}
                onClick={() => {
                  if (!isPlayingReplay && activeStepIndex === selectedStudy.dataFlowSteps.length - 1) {
                    setActiveStepIndex(0)
                  }
                  setIsPlayingReplay(!isPlayingReplay)
                }}
              >
                {isPlayingReplay ? '⏸ Pause Replay' : '▶ Auto-Play Architecture Replay'}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={activeStepIndex === 0}
                onClick={() => setActiveStepIndex(i => Math.max(0, i - 1))}
              >
                ← Prev Step
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={activeStepIndex === selectedStudy.dataFlowSteps.length - 1}
                onClick={() => setActiveStepIndex(i => Math.min(selectedStudy.dataFlowSteps.length - 1, i + 1))}
              >
                Next Step →
              </button>
            </div>

            <span className="step-progress-text">
              Step <strong>{activeStepIndex + 1}</strong> of {selectedStudy.dataFlowSteps.length}
            </span>
          </div>

          {/* Stepper Visual Architecture Canvas */}
          <div className="architecture-stepper-canvas">
            {/* 4 Architectural Tier Blocks */}
            <div className="arch-tiers-grid">
              {['Client UI', 'Worker / Local Store', 'Network / Transport', 'Server / Cloud'].map(tier => {
                const isCurrentTier = currentStep.tier === tier
                return (
                  <div key={tier} className={`arch-tier-box ${isCurrentTier ? 'active-tier' : ''}`}>
                    <span className="tier-header-tag">{tier}</span>
                    <div className="tier-pulse-ring" />
                  </div>
                )
              })}
            </div>

            {/* Current Active Step Details Card */}
            <div className="active-step-details-card">
              <div className="step-card-header">
                <span className="tier-badge">{currentStep.tier}</span>
                <h3>{currentStep.title}</h3>
              </div>
              <p className="step-desc">{currentStep.description}</p>

              {currentStep.payloadPreview && (
                <div className="payload-box">
                  <strong>Telemetry / Data Payload Preview:</strong>
                  <code>{currentStep.payloadPreview}</code>
                </div>
              )}
            </div>

            {/* Stepper Timeline Progress Bar */}
            <div className="stepper-timeline-bar">
              {selectedStudy.dataFlowSteps.map((s, idx) => (
                <button
                  key={s.stepNumber}
                  type="button"
                  className={`timeline-step-dot ${activeStepIndex === idx ? 'current' : idx < activeStepIndex ? 'completed' : ''}`}
                  onClick={() => {
                    setActiveStepIndex(idx)
                    setIsPlayingReplay(false)
                  }}
                >
                  <span className="dot-num">{idx + 1}</span>
                  <span className="dot-title">{s.title.split('. ')[1]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. TRADE-OFFS TAB */}
      {activeTab === 'tradeoffs' && (
        <div className="tradeoffs-container">
          <div className="tradeoffs-intro-banner">
            <h3>Staff &amp; Principal Architectural Justifications</h3>
            <p>
              In FAANG System Design interviews, there is no single "correct" answer—every engineering choice involves deliberate trade-offs between latency, memory footprint, complexity, and network bandwidth.
            </p>
          </div>

          <div className="tradeoffs-list">
            {selectedStudy.tradeOffs.map((t, idx) => (
              <div key={idx} className="tradeoff-card">
                <div className="tradeoff-header">
                  <span className="choice-tag">✅ Selected Architecture: <strong>{t.choice}</strong></span>
                  <span className="alt-tag">❌ Rejected Alternative: {t.alternative}</span>
                </div>
                <div className="rationale-box">
                  <strong>Staff Engineering Rationale:</strong>
                  <p>{t.rationale}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. HIRING RUBRIC TAB */}
      {activeTab === 'rubric' && (
        <div className="rubric-container">
          <div className="rubric-intro-banner">
            <h3>Hiring Committee Evaluation Rubric for {selectedStudy.title}</h3>
            <p>
              How FAANG hiring committees evaluate candidates during the {selectedStudy.architectLevel} system design loop:
            </p>
          </div>

          <div className="rubric-items-list">
            {selectedStudy.interviewerRubric.map((r, idx) => (
              <div key={idx} className="rubric-item-card">
                <span className="rubric-num">{idx + 1}</span>
                <p>{r}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="cs-footer">
        <Link to="/system-design" className="btn btn-secondary">
          📐 Interactive System Design Canvas
        </Link>
        <Link to="/experience" className="btn btn-primary">
          🎯 0-20 Years Career Ladder →
        </Link>
      </div>
    </div>
  )
}
