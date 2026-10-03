import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Route smoke test.
 *
 * This used to only assert "HTTP 200 + contains id=\"root\"", which every SPA
 * path satisfies — including paths that no <Route> matches. It reported
 * 42/42 PASS while 25 routes were unregistered. It now extracts the real route
 * table out of src/App.tsx and fails if the routes under test are not
 * registered.
 *
 * Usage:  node scripts/test-all-navigation-routes.mjs [baseUrl]
 *   baseUrl defaults to http://localhost:5173
 *
 * Exits non-zero when a route under test is not registered, when the app
 * cannot be reached, or when the route table cannot be parsed.
 */

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..')
const APP_TSX = path.join(ROOT, 'src', 'App.tsx')

const BASE_URL = process.argv[2] || 'http://localhost:5173'

/**
 * Routes to exercise. `/meet/:id`-style patterns are listed with a concrete
 * sample value so the HTTP probe hits a real path.
 * Keep in sync with the user-facing navigation.
 */
const ROUTES_TO_TEST = [
  { path: '/', label: 'Home Page' },
  { path: '/questions', label: 'Questions Bank' },
  { path: '/practice', label: 'Practice Redirect Route' },
  { path: '/coding', label: 'Coding Challenges & Monaco Sandbox' },
  { path: '/dashboard', label: 'Study Tracker & Metrics' },
  { path: '/quiz', label: 'Timed Quiz Assessment' },
  { path: '/flashcards', label: 'Active Recall Spaced Repetition Cards' },
  { path: '/videos', label: 'Video Masterclasses' },
  { path: '/daily', label: 'Daily Challenge & Heatmap' },
  { path: '/interview-questions', label: 'Master Question Bank' },
  { path: '/docs', label: 'Interview Docs' },
  { path: '/resume-builder', label: 'AI Resume Builder' },
  { path: '/resume-center', label: 'Resume Center' },
  { path: '/leaderboard', label: 'Leaderboard' },
  { path: '/machine-coding', label: 'Machine-Level Coding Masterclass' },
  { path: '/dsa', label: 'DSA Masterclass' },
  { path: '/frontend-javascript', label: 'Frontend JavaScript Programming' },
  { path: '/core-programming', label: 'Core JavaScript Programming' },
  { path: '/mock-coding', label: 'Machine Coding Mock' },
  { path: '/mock-interview', label: 'Timed Interview Simulation' },
  { path: '/video-mock', label: 'AI Video Mock Interview' },
  { path: '/ai-video-mock', label: 'AI Video Mock Studio 2.0' },
  { path: '/behavioral', label: 'FAANG STAR Behavioral Matrix' },
  { path: '/peer-room', label: 'Peer-to-Peer Mock Interview Room' },
  { path: '/profile', label: 'Candidate Profile & Readiness Tracker' },
  { path: '/user-management', label: 'User Management & Admin Studio' },
  { path: '/meet', label: 'Instant Meeting Landing' },
  { path: '/meetings', label: 'Meetings List' },
  { path: '/meet/sample-123', label: 'Meeting Room' },
]

/**
 * Extract every `path="..."` literal from App.tsx.
 * This is a lexical scan rather than a full parse on purpose: it must work
 * without evaluating TSX, and it only ever reports registered route patterns.
 */
function readRegisteredRoutes() {
  if (!fs.existsSync(APP_TSX)) {
    throw new Error(`Route table not found at ${APP_TSX}`)
  }
  const src = fs.readFileSync(APP_TSX, 'utf8')
  const out = new Set()
  // Single-line and multi-line <Route path="..."> both match this shape.
  const re = /<Route\b[^>]*?\bpath=["']([^"']+)["']/gs
  let m
  while ((m = re.exec(src)) !== null) {
    out.add(m[1])
  }
  // <Route path="/x/*"> style splats cover any deeper path.
  for (const p of [...out]) {
    if (p.endsWith('/*')) out.add(p.slice(0, -1))
  }
  return out
}

/**
 * True when `sample` matches one of the registered React Router patterns.
 *
 * Handles the three pattern forms actually used in App.tsx:
 *   "/questions"        exact literal
 *   "/docs/*"           splat — matches "/docs" and any descendant
 *   "/meet/:meetingId"  dynamic segment — matches exactly one segment
 *
 * The bare catch-all pattern "*" is deliberately ignored: it renders
 * NotFoundPage, so counting it as a match would make every unregistered path
 * look valid — exactly the false-green bug this script exists to prevent.
 */
function matchesRegisteredRoute(sample, registered) {
  if (registered.has(sample)) return true

  const sampleSegments = sample.split('/').filter(Boolean)

  for (const pattern of registered) {
    if (pattern === '*' || pattern === '/*') continue // NotFoundPage catch-all

    const patternSegments = pattern.split('/').filter(Boolean)
    let ok = true

    for (let i = 0; i < patternSegments.length; i++) {
      const seg = patternSegments[i]

      if (seg === '*') {
        // Splat consumes the rest, including nothing at all.
        ok = true
        break
      }
      if (i >= sampleSegments.length) { ok = false; break }
      if (seg.startsWith(':')) continue // dynamic segment matches any single one
      if (seg !== sampleSegments[i]) { ok = false; break }
    }

    // A pattern with no splat must not match a longer path.
    if (ok && !patternSegments.includes('*') && sampleSegments.length !== patternSegments.length) {
      ok = false
    }

    if (ok) return true
  }

  return false
}

function checkRoute(p) {
  return new Promise(resolve => {
    const req = http.get(`${BASE_URL}${p}`, res => {
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          success: res.statusCode === 200,
          hasRoot: data.includes('id="root"') || data.includes('<div id="root">'),
          bytes: data.length,
        })
      })
    })
    req.on('error', err => resolve({ statusCode: 0, success: false, error: err.message }))
    req.setTimeout(5000, () => {
      req.destroy()
      resolve({ statusCode: 408, success: false, error: 'Timeout' })
    })
  })
}

async function runTests() {
  console.log('========================================================================')
  console.log('🚀 TESTING NAVIGATION ROUTES AGAINST THE REAL ROUTE TABLE')
  console.log(`Base URL: ${BASE_URL}`)
  console.log(`Route table: ${path.relative(ROOT, APP_TSX)}`)
  console.log('========================================================================\n')

  let registered
  try {
    registered = readRegisteredRoutes()
  } catch (e) {
    console.error(`❌ Could not read route table: ${e.message}`)
    process.exit(1)
  }
  console.log(`Found ${registered.size} registered route pattern(s).\n`)

  let passed = 0
  let failed = 0
  let unreachable = 0

  for (const r of ROUTES_TO_TEST) {
    // The meaningful assertion: this path must match a registered route.
    if (!matchesRegisteredRoute(r.path, registered)) {
      console.log(`❌ [UNREGISTERED] ${r.path.padEnd(24)} -> ${r.label}`)
      failed++
      continue
    }

    const res = await checkRoute(r.path)
    if (res.statusCode === 0 || res.statusCode === 408) {
      unreachable++
    }

    if (res.success && res.hasRoot) {
      console.log(`✅ [${res.statusCode}] ${r.path.padEnd(24)} -> ${r.label} (${res.bytes} bytes)`)
      passed++
    } else {
      console.log(
        `❌ [${res.statusCode}] ${r.path.padEnd(24)} -> ${r.label} ` +
        `(ERROR: ${res.error || 'Missing root div'})`
      )
      failed++
    }
  }

  const total = ROUTES_TO_TEST.length
  console.log('\n========================================================================')
  console.log(`📊 RESULT: ${passed}/${total} PASSED · ${failed} FAILED`)
  if (unreachable > 0) {
    console.log(`⚠️  ${unreachable} route(s) were unreachable — is the dev server running on ${BASE_URL}?`)
  }
  console.log('========================================================================\n')

  if (unreachable > 0) {
    console.error('❌ Dev server unreachable. Start it with `npm run dev` and re-run.')
    process.exit(1)
  }

  if (failed > 0) {
    console.error('❌ Failures detected.')
    process.exit(1)
  }
}

runTests()