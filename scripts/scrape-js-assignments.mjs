// Scraper for the public GitHub repo shashikunal/js_assignments.
//
// That repo is a set of JavaScript/DOM "build this project" assignments: each
// folder has index.html + script.js + style.css. We turn each folder into a
// coding question:
//   - question : humanized folder name ("Build: Todo List")
//   - code     : the editable script (script.js)
//   - example  : a self-contained HTML document (index.html with style.css
//                inlined and the <script src> removed) used for the live
//                iframe preview in the workspace
//   - answer   : short instructions
//
// Run:  node scripts/scrape-js-assignments.mjs   (or: npm run scrape:jsasgn)

import { writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT_DIR = resolve(ROOT, 'public/data')

const REPO = 'shashikunal/js_assignments'
const BRANCH = 'master'
const RAW = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`

const ACRONYMS = { ui: 'UI', api: 'API', app: 'App', dom: 'DOM', css: 'CSS', js: 'JS', id: 'ID', url: 'URL', html: 'HTML', jsx: 'JSX' }

function humanize(dir) {
  return dir
    .split('-')
    .map(w => {
      const up = w.toUpperCase()
      if (ACRONYMS[up]) return ACRONYMS[up]
      return w.charAt(0).toUpperCase() + w.slice(1)
    })
    .join(' ')
    .replace(/\b3d\b/i, '3D')
}

function difficultyFor(script) {
  const lines = script.split('\n').length
  if (lines < 50) return 'Easy'
  if (lines < 120) return 'Medium'
  return 'Hard'
}

async function getText(url) {
  const res = await fetch(url)
  if (!res.ok) return ''
  return res.text()
}

async function main() {
  const treeRes = await fetch(`https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`)
  if (!treeRes.ok) {
    console.error(`Failed to fetch repo tree: ${treeRes.status}`)
    process.exit(1)
  }
  const tree = await treeRes.json()
  const blobs = tree.tree || []

  // Group blob paths by their top-level project folder.
  const folders = new Map()
  for (const b of blobs) {
    if (b.type !== 'blob') continue
    const slash = b.path.indexOf('/')
    if (slash < 0) continue
    const dir = b.path.slice(0, slash)
    const file = b.path.slice(slash + 1)
    if (!folders.has(dir)) folders.set(dir, new Set())
    folders.get(dir).add(file)
  }

  const out = []
  let idx = 0
  for (const [dir, files] of folders) {
    if (!files.has('script.js')) continue
    const title = humanize(dir)
    const [script, html, css] = await Promise.all([
      getText(`${RAW}/${dir}/script.js`),
      getText(`${RAW}/${dir}/index.html`),
      files.has('style.css') ? getText(`${RAW}/${dir}/style.css`) : Promise.resolve(''),
    ])
    if (!script) continue

    // Build a self-contained HTML document for the live preview:
    //  - inline style.css (replace the local <link rel="stylesheet" href="style.css">)
    //  - drop the <script src="script.js"> (the user's edited code is injected at runtime)
    let page = (html || '').trim()
    if (css) {
      const linkRe = /<link\b[^>]*rel=["']?stylesheet["']?[^>]*href=["']?style\.css["']?[^>]*\/?>/i
      if (linkRe.test(page)) {
        page = page.replace(linkRe, `<style>\n${css}\n</style>`)
      } else {
        page = page.replace(/<\/head>/i, `<style>\n${css}\n</style>\n</head>`)
      }
    }
    page = page.replace(/<script\s+[^>]*src=["']?script\.js["']?[^>]*>\s*<\/script>/i, '')

    const q = {
      id: 11_000_000 + idx,
      category: 'JavaScript & ES6',
      difficulty: difficultyFor(script),
      question: `Build: ${title}`,
      source: 'JS Assignments',
      answer: `${title} — a JavaScript/DOM mini-project. Edit script.js and press Run to see it render live; the styling is loaded automatically.`,
      example: page,
      code: script.trim(),
    }
    out.push(q)
    idx++
    console.log(`  ${out.length}/${folders.size}  ${title} (${q.difficulty})`)
  }

  await mkdir(OUT_DIR, { recursive: true })
  const path = resolve(OUT_DIR, 'js-assignments.json')
  await writeFile(path, JSON.stringify(out, null, 2) + '\n', 'utf8')
  console.log(`\nWrote ${out.length} JS assignment questions -> js-assignments.json`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
