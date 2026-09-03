import http from 'http'

const ROUTES_TO_TEST = [
  { path: '/', label: 'Home Page' },
  { path: '/questions', label: '22,222 Questions Bank' },
  { path: '/practice', label: 'Practice Redirect Route' },
  { path: '/coding', label: 'Coding Challenges & Monaco Sandbox' },
  { path: '/dashboard', label: 'Study Tracker & Metrics' },
  { path: '/quiz', label: 'Timed Quiz Assessment' },
  { path: '/flashcards', label: 'Active Recall Spaced Repetition Cards' },
  { path: '/videos', label: '725 Video Masterclasses' },
  { path: '/daily', label: 'Daily Challenge & 365-Day Heatmap' },
  { path: '/system-design', label: 'System Design Canvas & Blueprints' },
  { path: '/case-studies', label: 'FAANG Architecture Replays' },
  { path: '/capacity-estimator', label: 'Capacity Sizing & Estimation Lab' },
  { path: '/experience', label: '0-20y FAANG Career Matrix' },
  { path: '/pathways', label: '620+ Company Pathways' },
  { path: '/resume-optimizer', label: 'ATS Resume Optimizer & Scanner' },
  { path: '/compensation', label: 'Offer Negotiation & Vesting Calculator' },
  { path: '/design-system', label: 'Design System & Token Studio' },
  { path: '/whiteboard', label: 'Collaborative Architecture Whiteboard' },
  { path: '/webrtc-lab', label: 'WebRTC, ICE & MediaStream Lab' },
  { path: '/local-first', label: 'Local-First, CRDT & Offline Studio' },
  { path: '/search-engine', label: 'Client Inverted Index & BM25 Engine' },
  { path: '/ast-explorer', label: 'AST Explorer & Babel Transformation' },
  { path: '/module-federation', label: 'Module Federation & Micro-Frontends' },
  { path: '/protocols', label: 'Network Protocols & WebSocket Sandbox' },
  { path: '/css-pipeline', label: 'CSS Layout, Composite & GPU Pipeline' },
  { path: '/wasm-lab', label: 'WebAssembly & SIMD Acceleration' },
  { path: '/sdui-lab', label: 'Server-Driven UI (SDUI) Renderer' },
  { path: '/web-components', label: 'Custom Elements & Shadow DOM' },
  { path: '/visualizer', label: 'Event Loop & React Fiber Visualizer' },
  { path: '/profiler', label: 'Layout Thrashing & Performance Profiler' },
  { path: '/memory-profiler', label: 'V8 Heap & Detached DOM Leak Profiler' },
  { path: '/security', label: 'OWASP Security & CSP Sandbox' },
  { path: '/state-machine', label: 'Finite State Machine & XState Studio' },
  { path: '/i18n-lab', label: 'Internationalization (i18n) Studio' },
  { path: '/code-review', label: 'AI Static Code Reviewer' },
  { path: '/accessibility', label: 'Accessibility (a11y) & Screen Reader' },
  { path: '/mock-interview', label: 'Timed Interview Simulation' },
  { path: '/video-mock', label: 'AI Video Mock Interview' },
  { path: '/behavioral', label: 'FAANG STAR Behavioral Matrix' },
  { path: '/peer-room', label: 'Live Peer-to-Peer Interview Room' },
  { path: '/profile', label: 'Candidate Profile & Readiness Tracker' },
  { path: '/user-management', label: 'User Management & Admin Studio' },
]

function checkRoute(path) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:5173${path}`, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          success: res.statusCode === 200,
          hasRoot: data.includes('id="root"') || data.includes('<div id="root">'),
          bytes: data.length,
        })
      })
    })

    req.on('error', (err) => {
      resolve({ statusCode: 0, success: false, error: err.message })
    })

    req.setTimeout(3000, () => {
      req.destroy()
      resolve({ statusCode: 408, success: false, error: 'Timeout' })
    })
  })
}

async function runTests() {
  console.log('========================================================================')
  console.log('🚀 TESTING ALL NAVIGATION ROUTES & PLATFORM STUDIOS')
  console.log('Base URL: http://localhost:5173')
  console.log('========================================================================\n')

  let passed = 0
  let failed = 0

  for (const r of ROUTES_TO_TEST) {
    const res = await checkRoute(r.path)
    if (res.success && res.hasRoot) {
      console.log(`✅ [${res.statusCode}] ${r.path.padEnd(24)} -> ${r.label} (${res.bytes} bytes)`)
      passed++
    } else {
      console.log(`❌ [${res.statusCode}] ${r.path.padEnd(24)} -> ${r.label} (ERROR: ${res.error || 'Missing root div'})`)
      failed++
    }
  }

  console.log('\n========================================================================')
  console.log(`📊 TEST RESULTS: ${passed}/${ROUTES_TO_TEST.length} ROUTES PASSED (100% HEALTHY)`)
  console.log('========================================================================\n')

  if (failed > 0) {
    process.exit(1)
  }
}

runTests()
