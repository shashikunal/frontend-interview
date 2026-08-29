// Build-time scraper for GreatFrontEnd's free, open-source question content.
//
// GreatFrontEnd publishes curated interview questions as public GitHub repos
// (full Q&A in Markdown). This script fetches those READMEs, parses the
// questions/answers/code, derives difficulty from the table-of-contents levels,
// and writes them to public/data/*.json so the app can load them like any other
// local question set (no runtime CORS, no paywall).
//
// Run with:  node scripts/scrape-greatfrontend.mjs
//
// Note: Only JavaScript and React have free open-source repos. TypeScript and
// DOM do not have a free public repo, so this script only emits those two
// categories. The app keeps its existing generated/fallback content for TS/DOM.

import { writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT_DIR = resolve(ROOT, 'public/data')

const SOURCES = [
  {
    repo: 'greatfrontend/top-javascript-interview-questions',
    file: 'greatfrontend-javascript',
    category: 'JavaScript & ES6',
    idBase: 1_000_000,
  },
  {
    repo: 'greatfrontend/top-reactjs-interview-questions',
    file: 'greatfrontend-react',
    category: 'ReactJS',
    idBase: 2_000_000,
  },
]

const RAW_BASE = 'https://raw.githubusercontent.com'
const QUESTION_RE = /^(?:\d+\.\s+)?###\s+(.+?)\s*$/
const TOC_RE = /^\|\s*\d+\s*\|\s*\[(.+?)\]\(#([^)]+)\)\s*\|\s*(Basic|Intermediate|Advanced)\s*\|\s*$/

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function mapLevel(level) {
  if (level === 'Basic') return 'Easy'
  if (level === 'Advanced') return 'Hard'
  return 'Medium'
}

async function fetchMarkdown(repo) {
  const url = `${RAW_BASE}/${repo}/main/README.md`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  return res.text()
}

function parseQuestions(md, category) {
  const lines = md.split('\n')

  // 1. Build slug -> difficulty from the TOC tables.
  const levelMap = {}
  for (const line of lines) {
    const m = line.match(TOC_RE)
    if (m) {
      const slug = m[2].trim()
      levelMap[slug] = m[3]
    }
  }

  // 2. Walk the QUESTIONS regions, splitting on `### ` headings.
  const questions = []
  const seen = new Set()
  let inRegion = false
  let cur = null
  let inCode = false
  let codeBuf = []

  const flush = () => {
    if (!cur) return
    let answer = cur.prose.join('\n')
    answer = answer
      .replace(/<br\s*\/?>/gi, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
    const code = cur.code.join('\n\n').trim()
    const slug = slugify(cur.heading)
    if (!seen.has(slug)) {
      seen.add(slug)
      const q = {
        category,
        difficulty: mapLevel(levelMap[slug] || 'Medium'),
        question: cur.heading,
        answer,
      }
      if (code) q.code = code
      questions.push(q)
    }
    cur = null
  }

  for (const line of lines) {
    if (/<!--\s*QUESTIONS/.test(line)) {
      if (/START/.test(line)) inRegion = true
      else if (/END/.test(line)) {
        inRegion = false
        flush()
      }
      continue
    }
    if (!inRegion) continue

    const qm = line.match(QUESTION_RE)
    if (qm) {
      flush()
      cur = { heading: qm[1].trim(), prose: [], code: [] }
      inCode = false
      codeBuf = []
      continue
    }
    if (!cur) continue

    const trimmed = line.trim()
    if (trimmed.startsWith('```')) {
      if (!inCode) {
        inCode = true
        codeBuf = []
      } else {
        inCode = false
        if (codeBuf.length) cur.code.push(codeBuf.join('\n'))
        codeBuf = []
      }
      continue
    }
    if (inCode) {
      codeBuf.push(line)
      continue
    }
    // Drop the "Read the detailed answer" promo and the back-to-top link.
    if (/^>\s*Read the \[detailed answer\]/i.test(line)) continue
    if (/^\[Back to top/i.test(line)) continue
    cur.prose.push(line)
  }
  flush()

  return questions
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  for (const src of SOURCES) {
    try {
      const md = await fetchMarkdown(src.repo)
      const parsed = parseQuestions(md, src.category)
      const withIds = parsed.map((q, i) => ({ id: src.idBase + i, ...q }))
      const outPath = resolve(OUT_DIR, `${src.file}.json`)
      await writeFile(outPath, JSON.stringify(withIds, null, 2) + '\n', 'utf8')
      console.log(`Wrote ${withIds.length} ${src.category} questions -> ${src.file}.json`)
    } catch (err) {
      console.error(`Skipping ${src.repo}:`, err.message)
    }
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
