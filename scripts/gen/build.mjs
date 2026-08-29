import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import jsCore from './kb-js-core.mjs'
import jsEs6 from './kb-js-es6.mjs'
import jsEngine from './kb-js-engine.mjs'
import jsPatterns from './kb-js-patterns.mjs'
import snippets from './kb-snippets.mjs'
import reactKb from './kb-react.mjs'
import tsKb from './kb-ts.mjs'
import cssKb from './kb-css.mjs'
import perfKb from './kb-perf.mjs'
import domKb from './kb-dom.mjs'
import domExamples from './kb-dom-examples.mjs'
import domAdvancedKb, { snippets as domAdvancedSnippets, enrich as enrichDomAdvanced } from './kb-dom-advanced.mjs'

// merge supplementary practical examples into DOM topics
for (const topic of domKb) {
  if (topic.c) continue
  const match = Object.keys(domExamples).find(key => topic.t.toLowerCase().includes(key.toLowerCase()))
  if (match) topic.c = domExamples[match]
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'data')

const CLAUSE_RE = /^(what|why|when|how|whether|where)\b\s/i

const cap = s => s.charAt(0).toUpperCase() + s.slice(1)
const lowerFirst = s => s.charAt(0).toLowerCase() + s.slice(1)
const looksPlural = t => /\bs$/.test(t) && !/(ss|us|is)$/.test(t)

function baseForms(topic) {
  const t = topic.t
  const d = topic.d
  const c = topic.c
  const exs = Array.isArray(topic.exs) ? topic.exs : (topic.e ? [topic.e] : [])
  if (CLAUSE_RE.test(t)) {
    const forms = [
      [`Can you clearly articulate ${t}?`, d],
      [`${cap(t)} \u2014 walk through your complete answer.`, d],
      [`${cap(t)} \u2014 what would you emphasize in a senior interview?`, d],
      [`${cap(t)} \u2014 give a concise, structured response.`, d],
      [`Prepare a strong interview answer covering ${t}.`, d],
    ]
    if (c) forms.push([`Show a practical example demonstrating ${t}.`, `${d}\n\nThe example above shows the interface in action \u2014 trace each line and note the gotchas mentioned.`, c])
    return forms.filter(Boolean).map((row, i) => {
      const [q, a, cd] = row
      const ex = Array.isArray(topic.exs) ? (cd ?? (exs.length ? exs[i % exs.length] : undefined)) : undefined
      return [q, a, cd, ex]
    })
  }
  const v = looksPlural(t)
  const forms = [
    [`What ${v ? 'are' : 'is'} ${t}?`, d],
    [`Explain ${t} in depth.`, d],
    c && [`Show a practical example of using ${t}.`, `${d}\n\nStudy the example above: it demonstrates the typical usage pattern and the pitfalls to avoid.`, c],
    [`How would you describe ${t} to a teammate?`, d],
    [`What ${v ? 'do' : 'does'} ${t} look like in practice, and when ${v ? 'do' : 'does'} it matter?`, d],
    [`What common mistakes do developers make with ${t}?`, d],
  ]
  return forms
    .filter(Boolean)
    .map((row, i) => {
      const [q, a, cd] = row
      const ex = Array.isArray(topic.exs) ? (cd ?? (exs.length ? exs[i % exs.length] : undefined)) : undefined
      return [q, a, cd, ex]
    })
}

const EXTRA_FRAMES = [
  q => `Quick check: ${lowerFirst(q)}`,
  q => `Deep dive: ${q}`,
  q => `Interview scenario \u2014 ${lowerFirst(q)}`,
  q => `Senior-level follow-up: ${q}`,
  q => `Rapid fire: ${lowerFirst(q)}`,
  q => `Whiteboard prompt: ${q}`,
  q => `Phone screen edition: ${lowerFirst(q)}`,
  q => `Onsite panel edition: ${q}`,
  q => `Hiring manager edition: ${lowerFirst(q)}`,
]

function diffPicker(seed, weights = [30, 45, 25]) {
  const roll = (seed * 37 + 11) % 100
  if (roll < weights[0]) return 'Easy'
  if (roll < weights[0] + weights[1]) return 'Medium'
  return 'Hard'
}

function buildCategory({ name, topics, snippets: snippetList = [], target, codeFrames = false }) {
  const seen = new Set()
  const out = []
  let seed = 0
  const push = (question, answer, code, example) => {
    if (seen.has(question)) return
    seen.add(question)
    seed++
    out.push({
      id: 0,
      category: name,
      difficulty: diffPicker(seed, code ? [10, 45, 45] : undefined),
      question,
      answer,
      ...(code ? { code } : {}),
      ...(example ? { example } : {}),
    })
    if (out.length >= target) return true
    return false
  }

  outer:
  for (let round = -1; round < EXTRA_FRAMES.length * 3; round++) {
    for (let i = 0; i < topics.length; i++) {
      if (round === -1) {
        for (const [q, a, cd, ex] of baseForms(topics[i])) {
          if (push(q, a, cd, ex)) break outer
        }
        if (round === -1 && i === topics.length - 1) {
          let snipIdx = 0
          for (const s of snippetList) {
            snipIdx++
            const answer = `Expected output: ${s.o}\n\n${s.e}`
            if (push(`Code output challenge ${snipIdx}: predict what this snippet logs.`, answer, s.c)) break outer
            if (push(`Output tracing ${snipIdx}: what will this code log, and why?`, answer, s.c)) break outer
          }
        }
      } else {
        const frame = EXTRA_FRAMES[round % EXTRA_FRAMES.length]
        const bases = baseForms(topics[i])
        const [q, a, cd, ex] = bases[(round + i) % bases.length]
        if (push(frame(q), a, codeFrames ? cd : undefined, ex)) break outer
      }
    }
  }

  return out.slice(0, target)
}

const CATEGORIES = [
  {
    slug: 'javascript-es6',
    name: 'JavaScript & ES6',
    topics: [...jsCore, ...jsEs6, ...jsEngine, ...jsPatterns],
    snippets,
    target: 5000,
  },
  { slug: 'reactjs', name: 'ReactJS', topics: reactKb, target: 1000 },
  { slug: 'typescript', name: 'TypeScript', topics: tsKb, target: 1000 },
  { slug: 'css', name: 'CSS', topics: cssKb, target: 1000 },
  { slug: 'frontend-performance', name: 'Frontend Performance', topics: perfKb, target: 1000 },
  { slug: 'dom-web-apis', name: 'DOM & Web APIs', topics: domKb, target: 500 },
  {
    slug: 'dom-advanced',
    name: 'DOM Advanced APIs',
    topics: enrichDomAdvanced(domAdvancedKb),
    snippets: domAdvancedSnippets,
    target: 1000,
    codeFrames: true,
  },
]

mkdirSync(OUT_DIR, { recursive: true })

let nextId = 1
let grandTotal = 0
for (const cat of CATEGORIES) {
  const questions = buildCategory(cat)
  for (const q of questions) q.id = nextId++
  const file = path.join(OUT_DIR, `${cat.slug}.json`)
  writeFileSync(file, JSON.stringify(questions))
  const codes = questions.filter(q => q.code).length
  grandTotal += questions.length
  console.log(`${cat.slug}.json: ${questions.length} questions (${codes} with code) -> ${file}`)
}
console.log(`TOTAL: ${grandTotal} questions`)
