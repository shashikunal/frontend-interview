import { useState, useRef, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './SystemDesignCanvas.css'

export type NodeTier = 'client-ui' | 'state-storage' | 'network' | 'server-edge'

export interface ArchNode {
  id: string
  title: string
  tier: NodeTier
  x: number
  y: number
  icon: string
  description: string
  techStack?: string
}

export interface ArchConnection {
  id: string
  fromId: string
  toId: string
  label?: string
  protocol?: 'HTTP/REST' | 'WebSocket' | 'IPC Worker' | 'IndexedDB' | 'Memory Ref'
}

export interface DesignTemplate {
  id: string
  company: string
  title: string
  level: string
  duration: string
  problemStatement: string
  requirements: {
    functional: string[]
    nonFunctional: string[]
  }
  nodes: ArchNode[]
  connections: ArchConnection[]
  staffRationale: string
  webVitalsTarget: {
    lcp: string
    inp: string
    cls: string
    cacheRatio: string
  }
}

const TEMPLATES: DesignTemplate[] = [
  {
    id: 'meta-messenger',
    company: 'Meta',
    title: 'Real-Time Messenger & Group Feed',
    level: 'L5 / Senior',
    duration: '45 mins',
    problemStatement: 'Design a highly responsive, real-time messaging client supporting millions of active conversations, instant optimistic message sending, offline draft syncing, and 60fps virtualization.',
    requirements: {
      functional: [
        'Real-time bi-directional message delivery with typing indicators and read receipts.',
        'Instant optimistic UI updates with rollback on delivery failure.',
        'Offline conversation history browsing and message queueing in IndexedDB.',
        'Infinite scroll virtualized conversation feed without layout thrashing.',
      ],
      nonFunctional: [
        'INP < 50ms during message typing and high-frequency incoming socket events.',
        'Resilient automatic WebSocket reconnection with exponential backoff and jitter.',
        'Zero-memory leaks with unmounted media and message node recycling.',
      ],
    },
    nodes: [
      { id: 'ui-virtual-list', title: 'Virtualized Message Feed', tier: 'client-ui', x: 80, y: 120, icon: '📜', description: 'Windowed DOM recycling rendering only visible messages at 60fps.' },
      { id: 'ui-composer', title: 'Optimistic Chat Composer', tier: 'client-ui', x: 80, y: 320, icon: '✍️', description: 'Instant input state with debounced draft persistence and media attachments.' },
      { id: 'state-normalizer', title: 'Normalized Entity Cache', tier: 'state-storage', x: 380, y: 120, icon: '🗂️', description: 'Keyed message map (threads, users, reactions) preventing redundant re-renders.' },
      { id: 'state-idb', title: 'IndexedDB Offline Store', tier: 'state-storage', x: 380, y: 320, icon: '💾', description: 'Persistent local storage for offline reading and outbox message sync queue.' },
      { id: 'net-socket', title: 'WebSocket Real-Time Gateway', tier: 'network', x: 680, y: 120, icon: '⚡', description: 'Persistent duplex connection with heartbeat and reconnection backoff.' },
      { id: 'net-sw', title: 'Service Worker Background Sync', tier: 'network', x: 680, y: 320, icon: '🔄', description: 'Background sync API dispatching pending outbox queue when back online.' },
      { id: 'edge-cdn', title: 'Edge CDN & Media Pipeline', tier: 'server-edge', x: 960, y: 120, icon: '🌐', description: 'Global edge cache with on-the-fly image thumbnail resizing and WebP conversion.' },
    ],
    connections: [
      { id: 'c1', fromId: 'ui-composer', toId: 'state-normalizer', label: '1. Optimistic Push', protocol: 'Memory Ref' },
      { id: 'c2', fromId: 'state-normalizer', toId: 'ui-virtual-list', label: '2. Reactive State Flow', protocol: 'Memory Ref' },
      { id: 'c3', fromId: 'ui-composer', toId: 'state-idb', label: '3. Outbox Persistence', protocol: 'IndexedDB' },
      { id: 'c4', fromId: 'state-normalizer', toId: 'net-socket', label: '4. Transmit Payload', protocol: 'WebSocket' },
      { id: 'c5', fromId: 'state-idb', toId: 'net-sw', label: '5. Offline Sync Drain', protocol: 'IPC Worker' },
      { id: 'c6', fromId: 'net-socket', toId: 'edge-cdn', label: '6. Media Upload & Ack', protocol: 'HTTP/REST' },
    ],
    staffRationale: 'By separating the Normalized Entity Cache from the UI layer and offloading outbox syncing to IndexedDB + Service Worker, the client maintains an instantaneous INP < 30ms even during high socket packet ingestion.',
    webVitalsTarget: { lcp: '1.2s', inp: '32ms', cls: '0.01', cacheRatio: '94%' },
  },
  {
    id: 'google-autocomplete',
    company: 'Google',
    title: 'High-Scale Search Autocomplete & Typeahead',
    level: 'L5 / Senior',
    duration: '45 mins',
    problemStatement: 'Architect a sub-50ms search autocomplete component handling millions of queries per second, fuzzy matching, dynamic client caching, LRU eviction, and resilient keyboard navigation.',
    requirements: {
      functional: [
        'Debounced query execution with request cancellation (AbortController).',
        'Multi-tier caching: In-memory Trie + LRU Map + localStorage.',
        'WAI-ARIA 1.2 compliant combobox keyboard navigation and screen reader announcements.',
        'High-speed prefix fuzzy matching and highlighted result substrings.',
      ],
      nonFunctional: [
        'Zero layout shift (CLS = 0) with reserved dropdown dimensions.',
        'Under 40ms end-to-end latency for cached prefix keystrokes.',
        'Zero memory leak on rapid unmounting / remounting.',
      ],
    },
    nodes: [
      { id: 'ui-combobox', title: 'Search Input & Combobox UI', tier: 'client-ui', x: 80, y: 160, icon: '🔍', description: 'Accessible input with ARIA combobox attributes and active-descendant focus.' },
      { id: 'state-lru', title: 'In-Memory Trie & LRU Cache', tier: 'state-storage', x: 380, y: 160, icon: '🌲', description: 'Prefix trie data structure storing top 100 queries with LRU eviction.' },
      { id: 'state-worker', title: 'Web Worker Matcher', tier: 'state-storage', x: 380, y: 340, icon: '⚙️', description: 'Off-thread fuzzy substring scoring preventing main-thread UI jank.' },
      { id: 'net-debouncer', title: 'Debounced Request Manager', tier: 'network', x: 680, y: 160, icon: '⏱️', description: '300ms debounce window with AbortController cancelling stale inflight fetches.' },
      { id: 'edge-api', title: 'Edge CDN Suggest API', tier: 'server-edge', x: 960, y: 160, icon: '🚀', description: 'Geographically distributed edge cache serving cached search suggestions.' },
    ],
    connections: [
      { id: 'g1', fromId: 'ui-combobox', toId: 'state-lru', label: '1. Prefix Cache Lookup', protocol: 'Memory Ref' },
      { id: 'g2', fromId: 'state-lru', toId: 'state-worker', label: '2. Fuzzy Score Off-Thread', protocol: 'IPC Worker' },
      { id: 'g3', fromId: 'ui-combobox', toId: 'net-debouncer', label: '3. Debounce & Abort', protocol: 'Memory Ref' },
      { id: 'g4', fromId: 'net-debouncer', toId: 'edge-api', label: '4. Fetch Suggestions', protocol: 'HTTP/REST' },
      { id: 'g5', fromId: 'edge-api', toId: 'state-lru', label: '5. Populate Trie Cache', protocol: 'Memory Ref' },
    ],
    staffRationale: 'Using an In-Memory Prefix Trie combined with a Web Worker for fuzzy ranking offloads computation entirely from the main thread, achieving an INP of 16ms and instant keystroke responsiveness.',
    webVitalsTarget: { lcp: '0.9s', inp: '18ms', cls: '0.00', cacheRatio: '88%' },
  },
  {
    id: 'tiktok-feed',
    company: 'TikTok / YouTube',
    title: 'High-Throughput Infinite Video Feed',
    level: 'L6 / Staff',
    duration: '45 mins',
    problemStatement: 'Design a continuous infinite scrolling short-form video player pipeline with aggressive prefetching, adaptive bitrate (HLS), memory-constrained DOM recycling, and seamless swipe transitions.',
    requirements: {
      functional: [
        'Seamless vertical swipe transitions with zero buffering delay between videos.',
        'Adaptive Bitrate (HLS / DASH) switching dynamically based on network telemetry.',
        'Strict 3-video DOM windowing (Previous, Current, Next) to prevent mobile browser crashes.',
        'IntersectionObserver viewport tracking for autoplay / pause triggering.',
      ],
      nonFunctional: [
        'Zero layout shifts (CLS = 0) across varying video aspect ratios.',
        'Battery and memory capping: max 150MB client RAM footprint.',
      ],
    },
    nodes: [
      { id: 'ui-video-player', title: 'Virtualized Video Viewport', tier: 'client-ui', x: 80, y: 200, icon: '📱', description: 'Windowed swipe container recycling video elements to cap memory footprint.' },
      { id: 'state-hls-manager', title: 'Adaptive HLS Buffer Manager', tier: 'state-storage', x: 380, y: 120, icon: '📊', description: 'Network bandwidth observer preloading first 3 seconds of next 2 videos.' },
      { id: 'state-blob-cache', title: 'Media Blob Cache', tier: 'state-storage', x: 380, y: 320, icon: '📼', description: 'LRU video segment storage in Cache API avoiding re-fetching on back-swipes.' },
      { id: 'net-prefetcher', title: 'Priority Network Prefetcher', tier: 'network', x: 680, y: 200, icon: '⚡', description: 'HTTP/2 stream prioritization requesting video segments ahead of viewport.' },
      { id: 'edge-cdn-video', title: 'Multi-Region Video CDN', tier: 'server-edge', x: 960, y: 200, icon: '🌍', description: 'Distributed edge nodes caching transcoded HLS chunks (240p - 1080p).' },
    ],
    connections: [
      { id: 't1', fromId: 'ui-video-player', toId: 'state-hls-manager', label: '1. Intersection Change', protocol: 'Memory Ref' },
      { id: 't2', fromId: 'state-hls-manager', toId: 'net-prefetcher', label: '2. Prefetch Target Chunks', protocol: 'Memory Ref' },
      { id: 't3', fromId: 'net-prefetcher', toId: 'edge-cdn-video', label: '3. Range Requests', protocol: 'HTTP/REST' },
      { id: 't4', fromId: 'net-prefetcher', toId: 'state-blob-cache', label: '4. Cache Chunks', protocol: 'IndexedDB' },
      { id: 't5', fromId: 'state-blob-cache', toId: 'ui-video-player', label: '5. Instant Playback', protocol: 'Memory Ref' },
    ],
    staffRationale: 'Maintaining a rigid 3-video DOM footprint and prefetching only the initial 3 seconds of adjacent videos keeps RAM under 100MB while guaranteeing instant play on swipe.',
    webVitalsTarget: { lcp: '1.1s', inp: '24ms', cls: '0.00', cacheRatio: '91%' },
  },
]

const AVAILABLE_PALETTE: Array<{ title: string; tier: NodeTier; icon: string; description: string }> = [
  { title: 'Virtualized Viewport', tier: 'client-ui', icon: '📜', description: 'DOM recycling window for large datasets' },
  { title: 'Error Boundary & Fallback', tier: 'client-ui', icon: '🛡️', description: 'Catches runtime crashes with fallback UI' },
  { title: 'Rich Text / Canvas Editor', tier: 'client-ui', icon: '🎨', description: 'Interactive canvas / editable surface' },
  { title: 'Normalized Redux/Zustand Store', tier: 'state-storage', icon: '🗂️', description: 'Centralized state with shallow subscriptions' },
  { title: 'Optimistic UI Cache', tier: 'state-storage', icon: '⚡', description: 'Immediate UI mutations with rollback' },
  { title: 'IndexedDB Offline Database', tier: 'state-storage', icon: '💾', description: 'Structured client storage for offline sync' },
  { title: 'Web Worker Thread', tier: 'state-storage', icon: '⚙️', description: 'Off-thread background processing' },
  { title: 'WebSocket / SSE Connection', tier: 'network', icon: '🔌', description: 'Bi-directional real-time communication' },
  { title: 'Service Worker Cache', tier: 'network', icon: '🔄', description: 'Offline asset caching & background sync' },
  { title: 'Request Debouncer & Batcher', tier: 'network', icon: '⏱️', description: 'Reduces server pressure via batching' },
  { title: 'Edge CDN Global Cache', tier: 'server-edge', icon: '🌐', description: 'Low latency geo-distributed static cache' },
  { title: 'Node.js SSR Streaming Server', tier: 'server-edge', icon: '🚀', description: 'HTML streaming with React Server Components' },
  { title: 'BFF (Backend-For-Frontend) Gateway', tier: 'server-edge', icon: '🚪', description: 'Aggregates microservices for UI consumption' },
]

export default function SystemDesignCanvas() {
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate>(TEMPLATES[0])
  const [nodes, setNodes] = useState<ArchNode[]>(TEMPLATES[0].nodes)
  const [connections, setConnections] = useState<ArchConnection[]>(TEMPLATES[0].connections)
  const [activeTab, setActiveTab] = useState<'canvas' | 'staff-solution' | 'web-vitals'>('canvas')

  // Selected node for editing/linking
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [linkingFromId, setLinkingFromId] = useState<string | null>(null)

  // Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const canvasRef = useRef<SVGSVGElement | null>(null)

  const loadTemplate = (tmpl: DesignTemplate) => {
    setSelectedTemplate(tmpl)
    setNodes(tmpl.nodes)
    setConnections(tmpl.connections)
    setSelectedNodeId(null)
    setLinkingFromId(null)
  }

  // Node Dragging Handlers
  const onMouseDownNode = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation()
    const node = nodes.find(n => n.id === nodeId)
    if (!node || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    setDraggingNodeId(nodeId)
    setDragOffset({ x: mouseX - node.x, y: mouseY - node.y })
    setSelectedNodeId(nodeId)
  }

  const onMouseMoveCanvas = (e: React.MouseEvent) => {
    if (!draggingNodeId || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const newX = Math.max(20, Math.min(1100, mouseX - dragOffset.x))
    const newY = Math.max(20, Math.min(520, mouseY - dragOffset.y))

    setNodes(prev =>
      prev.map(n => (n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n))
    )
  }

  const onMouseUpCanvas = () => {
    setDraggingNodeId(null)
  }

  // Add Node from Palette
  const addNodeFromPalette = (item: typeof AVAILABLE_PALETTE[0]) => {
    const newNode: ArchNode = {
      id: `node-${Date.now()}`,
      title: item.title,
      tier: item.tier,
      x: 350 + Math.random() * 200,
      y: 180 + Math.random() * 160,
      icon: item.icon,
      description: item.description,
    }
    setNodes(prev => [...prev, newNode])
    setSelectedNodeId(newNode.id)
  }

  // Connect Two Nodes
  const handleNodeClick = (nodeId: string) => {
    if (linkingFromId) {
      if (linkingFromId !== nodeId) {
        const newConn: ArchConnection = {
          id: `conn-${Date.now()}`,
          fromId: linkingFromId,
          toId: nodeId,
          label: 'Data Contract',
          protocol: 'HTTP/REST',
        }
        setConnections(prev => [...prev, newConn])
      }
      setLinkingFromId(null)
    } else {
      setSelectedNodeId(nodeId)
    }
  }

  const removeNode = (nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId))
    setConnections(prev => prev.filter(c => c.fromId !== nodeId && c.toId !== nodeId))
    if (selectedNodeId === nodeId) setSelectedNodeId(null)
  }

  const removeConnection = (connId: string) => {
    setConnections(prev => prev.filter(c => c.id !== connId))
  }

  // Simulated Web Vitals calculation based on architectural nodes present
  const computedMetrics = useMemo(() => {
    const hasWorker = nodes.some(n => n.tier === 'state-storage' && (n.title.includes('Worker') || n.description.includes('Off-thread')))
    const hasVirtual = nodes.some(n => n.title.includes('Virtual') || n.description.includes('windowed'))
    const hasCache = nodes.some(n => n.title.includes('Cache') || n.title.includes('LRU') || n.title.includes('IndexedDB'))
    const hasCDN = nodes.some(n => n.tier === 'server-edge' && n.title.includes('CDN'))
    const hasSSR = nodes.some(n => n.title.includes('SSR') || n.title.includes('Server'))

    let lcpVal = 2.4
    if (hasCDN) lcpVal -= 0.6
    if (hasSSR) lcpVal -= 0.5
    if (hasCache) lcpVal -= 0.3
    lcpVal = Math.max(0.7, Math.round(lcpVal * 10) / 10)

    let inpVal = 90
    if (hasWorker) inpVal -= 45
    if (hasVirtual) inpVal -= 25
    inpVal = Math.max(16, inpVal)

    const clsVal = hasVirtual ? '0.00' : '0.02'
    const cacheHit = hasCache ? '92%' : '45%'

    return {
      lcp: `${lcpVal}s`,
      inp: `${inpVal}ms`,
      cls: clsVal,
      cacheHit,
      architectureScore: Math.min(98, 65 + (hasWorker ? 10 : 0) + (hasVirtual ? 10 : 0) + (hasCache ? 8 : 0) + (hasCDN ? 7 : 0)),
    }
  }, [nodes])

  // Compute Bezier Curve path between two nodes
  const getNodeCenter = useCallback(
    (id: string) => {
      const node = nodes.find(n => n.id === id)
      if (!node) return { x: 0, y: 0 }
      return { x: node.x + 110, y: node.y + 38 }
    },
    [nodes]
  )

  return (
    <div className="system-design-page page-enter">
      {/* Studio Header */}
      <div className="system-design-header">
        <div className="header-left">
          <span className="sd-badge">🏗️ Staff &amp; Principal Interview Studio</span>
          <h1>Interactive Frontend System Design Canvas</h1>
          <p className="subtitle">
            Diagram high-scale frontend architectures, configure component boundaries, design data contracts, and analyze Web Vitals impact in real time.
          </p>
        </div>

        {/* Template Selector Bar */}
        <div className="template-selector-box">
          <label className="selector-label">Choose FAANG Architecture Template:</label>
          <div className="template-pills">
            {TEMPLATES.map(tmpl => (
              <button
                key={tmpl.id}
                type="button"
                className={`tmpl-pill ${selectedTemplate.id === tmpl.id ? 'active' : ''}`}
                onClick={() => loadTemplate(tmpl)}
              >
                <span className="tmpl-company">{tmpl.company}</span>
                <span className="tmpl-name">{tmpl.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="studio-tabs-row">
        <div className="tab-buttons">
          <button
            type="button"
            className={`studio-tab ${activeTab === 'canvas' ? 'active' : ''}`}
            onClick={() => setActiveTab('canvas')}
          >
            📐 Interactive Architecture Canvas ({nodes.length} Nodes)
          </button>
          <button
            type="button"
            className={`studio-tab ${activeTab === 'staff-solution' ? 'active' : ''}`}
            onClick={() => setActiveTab('staff-solution')}
          >
            🏛️ Staff Engineer Reference Blueprint
          </button>
          <button
            type="button"
            className={`studio-tab ${activeTab === 'web-vitals' ? 'active' : ''}`}
            onClick={() => setActiveTab('web-vitals')}
          >
            📊 Web Vitals &amp; Production Telemetry
          </button>
        </div>

        <div className="tab-quick-metrics">
          <span className="metric-chip">LCP: <strong>{computedMetrics.lcp}</strong></span>
          <span className="metric-chip">INP: <strong>{computedMetrics.inp}</strong></span>
          <span className="metric-chip">Cache Hit: <strong>{computedMetrics.cacheHit}</strong></span>
          <span className="metric-chip score-chip">Architecture Rating: <strong>{computedMetrics.architectureScore}%</strong></span>
        </div>
      </div>

      {/* 1. INTERACTIVE CANVAS VIEW */}
      {activeTab === 'canvas' && (
        <div className="canvas-studio-layout">
          {/* Left: Modular Architecture Palette */}
          <div className="canvas-sidebar">
            <h3>Architecture Palette</h3>
            <span className="palette-subtext">Click any component to drop it onto your architecture canvas:</span>

            <div className="palette-tiers-list">
              <div className="palette-tier-section">
                <span className="tier-header client-ui">Client UI Layer</span>
                {AVAILABLE_PALETTE.filter(p => p.tier === 'client-ui').map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="palette-item-btn"
                    onClick={() => addNodeFromPalette(item)}
                  >
                    <span className="item-icon">{item.icon}</span>
                    <div className="item-info">
                      <span className="item-title">{item.title}</span>
                      <span className="item-desc">{item.description}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="palette-tier-section">
                <span className="tier-header state-storage">State &amp; Storage</span>
                {AVAILABLE_PALETTE.filter(p => p.tier === 'state-storage').map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="palette-item-btn"
                    onClick={() => addNodeFromPalette(item)}
                  >
                    <span className="item-icon">{item.icon}</span>
                    <div className="item-info">
                      <span className="item-title">{item.title}</span>
                      <span className="item-desc">{item.description}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="palette-tier-section">
                <span className="tier-header network">Networking &amp; Sync</span>
                {AVAILABLE_PALETTE.filter(p => p.tier === 'network').map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="palette-item-btn"
                    onClick={() => addNodeFromPalette(item)}
                  >
                    <span className="item-icon">{item.icon}</span>
                    <div className="item-info">
                      <span className="item-title">{item.title}</span>
                      <span className="item-desc">{item.description}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="palette-tier-section">
                <span className="tier-header server-edge">Edge &amp; Server</span>
                {AVAILABLE_PALETTE.filter(p => p.tier === 'server-edge').map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="palette-item-btn"
                    onClick={() => addNodeFromPalette(item)}
                  >
                    <span className="item-icon">{item.icon}</span>
                    <div className="item-info">
                      <span className="item-title">{item.title}</span>
                      <span className="item-desc">{item.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Visual SVG Diagramming Stage */}
          <div className="canvas-main-stage">
            <div className="canvas-toolbar">
              <div className="canvas-status">
                <span className="live-dot" />
                <span>
                  {linkingFromId
                    ? `Click target node to connect with ${nodes.find(n => n.id === linkingFromId)?.title}`
                    : 'Drag nodes to reposition · Click Connect to draw data contracts'}
                </span>
              </div>

              <div className="canvas-actions">
                {linkingFromId && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setLinkingFromId(null)}
                  >
                    Cancel Connect
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => loadTemplate(selectedTemplate)}
                >
                  Reset Template
                </button>
              </div>
            </div>

            {/* SVG Interactive Canvas */}
            <div className="svg-canvas-container">
              <svg
                ref={canvasRef}
                className="arch-svg-stage"
                viewBox="0 0 1200 620"
                onMouseMove={onMouseMoveCanvas}
                onMouseUp={onMouseUpCanvas}
              >
                {/* Background Grid Pattern */}
                <defs>
                  <pattern id="canvas-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.08)" />
                  </pattern>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
                  </marker>
                </defs>
                <rect width="100%" height="100%" fill="url(#canvas-grid)" />

                {/* Tier Backdrop Zones */}
                <g className="tier-zones">
                  <rect x="20" y="20" width="260" height="580" rx="12" className="zone-rect zone-ui" />
                  <text x="35" y="50" className="zone-label">1. Client Viewport Layer</text>

                  <rect x="310" y="20" width="260" height="580" rx="12" className="zone-rect zone-state" />
                  <text x="325" y="50" className="zone-label">2. Client State &amp; Store</text>

                  <rect x="600" y="20" width="260" height="580" rx="12" className="zone-rect zone-net" />
                  <text x="615" y="50" className="zone-label">3. Network &amp; Protocols</text>

                  <rect x="890" y="20" width="290" height="580" rx="12" className="zone-rect zone-edge" />
                  <text x="905" y="50" className="zone-label">4. Edge &amp; API Services</text>
                </g>

                {/* Drawn Connections & Data Flow Paths */}
                {connections.map(conn => {
                  const p1 = getNodeCenter(conn.fromId)
                  const p2 = getNodeCenter(conn.toId)
                  const midX = (p1.x + p2.x) / 2
                  const midY = (p1.y + p2.y) / 2
                  const pathD = `M ${p1.x} ${p1.y} C ${p1.x + 40} ${p1.y}, ${p2.x - 40} ${p2.y}, ${p2.x} ${p2.y}`

                  return (
                    <g key={conn.id} className="connection-group" onClick={() => removeConnection(conn.id)}>
                      <path d={pathD} className="connection-path-glow" />
                      <path d={pathD} className="connection-path" markerEnd="url(#arrowhead)" />
                      {conn.label && (
                        <g className="conn-label-group">
                          <rect
                            x={midX - 55}
                            y={midY - 12}
                            width="110"
                            height="24"
                            rx="6"
                            className="conn-label-bg"
                          />
                          <text x={midX} y={midY + 4} className="conn-label-text">
                            {conn.label}
                          </text>
                        </g>
                      )}
                    </g>
                  )
                })}

                {/* Render Interactive Architecture Nodes */}
                {nodes.map(node => {
                  const isSelected = selectedNodeId === node.id
                  const isLinking = linkingFromId === node.id

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      className={`arch-node-g tier-${node.tier} ${isSelected ? 'selected' : ''} ${isLinking ? 'linking' : ''}`}
                      onMouseDown={e => onMouseDownNode(e, node.id)}
                      onClick={() => handleNodeClick(node.id)}
                    >
                      <rect
                        width="220"
                        height="76"
                        rx="10"
                        className="node-card-bg"
                      />
                      <text x="14" y="28" className="node-icon">{node.icon}</text>
                      <text x="44" y="28" className="node-title">{node.title.length > 18 ? node.title.slice(0, 18) + '…' : node.title}</text>
                      <text x="14" y="52" className="node-desc">{node.description.slice(0, 32)}…</text>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Selected Node Properties & Actions */}
            {selectedNodeId && (() => {
              const sel = nodes.find(n => n.id === selectedNodeId)
              if (!sel) return null
              return (
                <div className="selected-node-inspector">
                  <div className="inspector-left">
                    <span className="insp-icon">{sel.icon}</span>
                    <div>
                      <h4>{sel.title}</h4>
                      <p>{sel.description}</p>
                    </div>
                  </div>
                  <div className="inspector-actions">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setLinkingFromId(sel.id)}
                    >
                      🔗 Connect to Node…
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeNode(sel.id)}
                    >
                      🗑️ Delete Node
                    </button>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* 2. STAFF ENGINEER REFERENCE BLUEPRINT VIEW */}
      {activeTab === 'staff-solution' && (
        <div className="staff-solution-container">
          <div className="staff-header-banner">
            <span className="staff-pill">FAANG Staff Architect Blueprint</span>
            <h2>{selectedTemplate.title} · Staff Solution Analysis</h2>
            <p className="subtitle">{selectedTemplate.problemStatement}</p>
          </div>

          <div className="staff-grid">
            <div className="staff-card requirements-card">
              <h3>Core Requirements Matrix</h3>
              <div className="req-group">
                <h4>Functional Requirements:</h4>
                <ul>
                  {selectedTemplate.requirements.functional.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
              <div className="req-group">
                <h4>Non-Functional &amp; Performance SLAs:</h4>
                <ul>
                  {selectedTemplate.requirements.nonFunctional.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="staff-card rationale-card">
              <h3>Staff Architecture Justification &amp; Trade-offs</h3>
              <p className="rationale-text">{selectedTemplate.staffRationale}</p>

              <div className="tradeoffs-list">
                <div className="tradeoff-box">
                  <strong>✅ Why Normalized State over Deep Objects?</strong>
                  <p>Prevents cascading re-renders across parent components when single child messages or reactions update.</p>
                </div>
                <div className="tradeoff-box">
                  <strong>✅ Why IndexedDB + Service Worker Outbox?</strong>
                  <p>Guarantees zero lost messages if the user closes the browser or enters an elevator while sending a chat.</p>
                </div>
                <div className="tradeoff-box">
                  <strong>✅ DOM Virtualization vs Infinite Native DOM:</strong>
                  <p>Caps DOM node count to ~30 nodes regardless of 100,000 message history, keeping memory usage constant.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. WEB VITALS & PRODUCTION TELEMETRY VIEW */}
      {activeTab === 'web-vitals' && (
        <div className="web-vitals-container">
          <div className="vitals-header">
            <h2>Live Production Telemetry &amp; Web Vitals Analyzer</h2>
            <p>Real-time estimation of Core Web Vitals based on the components and caching tiers in your architecture.</p>
          </div>

          <div className="vitals-metrics-grid">
            <div className="vital-card">
              <span className="vital-name">LCP (Largest Contentful Paint)</span>
              <span className="vital-val good">{computedMetrics.lcp}</span>
              <span className="vital-status">Target: &lt; 2.5s (Good)</span>
              <p>Estimated time until the main hero content and primary UI viewport renders for users.</p>
            </div>

            <div className="vital-card">
              <span className="vital-name">INP (Interaction to Next Paint)</span>
              <span className="vital-val good">{computedMetrics.inp}</span>
              <span className="vital-status">Target: &lt; 200ms (Good)</span>
              <p>UI responsiveness latency during user interactions, typing, and concurrent real-time events.</p>
            </div>

            <div className="vital-card">
              <span className="vital-name">CLS (Cumulative Layout Shift)</span>
              <span className="vital-val good">{computedMetrics.cls}</span>
              <span className="vital-status">Target: &lt; 0.1 (Stable)</span>
              <p>Visual stability score ensuring asynchronous media / elements do not cause jarring page shifts.</p>
            </div>

            <div className="vital-card">
              <span className="vital-name">Client Cache Hit Ratio</span>
              <span className="vital-val good">{computedMetrics.cacheHit}</span>
              <span className="vital-status">Tier: In-Memory + IndexedDB</span>
              <p>Percentage of user requests served instantly from local browser cache without network trips.</p>
            </div>
          </div>

          <div className="vitals-recommendations">
            <h3>Architectural Performance Recommendations:</h3>
            <div className="rec-list">
              <div className="rec-item">
                <span className="rec-icon">⚡</span>
                <div>
                  <strong>Maintain Off-Thread Web Workers for Heavy Computations:</strong>
                  <p>Offload parsing, diffing, and fuzzy scoring to a Web Worker to ensure INP stays under 40ms.</p>
                </div>
              </div>
              <div className="rec-item">
                <span className="rec-icon">🛡️</span>
                <div>
                  <strong>Implement Exponential Jitter on WebSocket Reconnects:</strong>
                  <p>Prevents Thundering Herd DDOS on server infrastructure when thousands of clients regain connectivity simultaneously.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="system-design-footer">
        <Link to="/mock-interview" className="btn btn-secondary">
          ← Back to Timed Mock Interview
        </Link>
        <Link to="/dashboard" className="btn btn-primary">
          📊 Open Mastery Dashboard
        </Link>
      </div>
    </div>
  )
}
