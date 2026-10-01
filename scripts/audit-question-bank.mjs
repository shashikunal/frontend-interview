#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const MASTER_DIR = path.join(ROOT, 'public', 'data', 'interview-questions')
const PUBLIC_DATA_DIR = path.join(ROOT, 'public', 'data')
const QUESTION_SERVICE = path.join(ROOT, 'src', 'data', 'questionService.ts')

const AUX_FILES = new Set(['companies.json', 'topbrains-videos.json', 'catalog.json'])

const argv = process.argv.slice(2)
const reportFlag = argv.indexOf('--report')
const REPORT_PATH = reportFlag !== -1 ? argv[reportFlag + 1] : null

function normalizeText(value) {
  return (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function readDataFiles() {
  const source = fs.readFileSync(QUESTION_SERVICE, 'utf8')
  const match = source.match(/export const DATA_FILES = \[([\s\S]*?)\] as const/)
  if (!match) {
    throw new Error('Could not locate DATA_FILES array in src/data/questionService.ts')
  }
  return [...match[1].matchAll(/'([^']+)'/g)].map(m => m[1])
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function countBy(items, keyFn) {
  const map = new Map()
  for (const item of items) {
    const key = keyFn(item)
    map.set(key, (map.get(key) || 0) + 1)
  }
  return map
}

function sortedEntries(map) {
  return [...map.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])))
}

function formatTable(rows, headers) {
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map(r => String(r[i] ?? '').length))
  )
  const line = cells =>
    cells.map((c, i) => String(c ?? '').padEnd(widths[i])).join('  ').trimEnd()
  return [line(headers), line(widths.map(w => '-'.repeat(w))), ...rows.map(line)].join('\n')
}

function auditMasterBank() {
  const findings = []
  const catalogPath = path.join(MASTER_DIR, 'catalog.json')
  const catalog = loadJson(catalogPath)
  const files = fs
    .readdirSync(MASTER_DIR)
    .filter(f => f.endsWith('.json') && f !== 'catalog.json')
    .map(f => f.replace('.json', ''))
    .sort()

  const catalogIds = catalog.subjects.map(s => s.id)
  const orphanFiles = files.filter(f => !catalogIds.includes(f))
  const missingFiles = catalogIds.filter(id => !files.includes(id))

  for (const id of orphanFiles) {
    findings.push({ level: 'WARN', area: 'master', message: `${id}.json exists but is not registered in catalog.json (unreachable from subject nav)` })
  }
  for (const id of missingFiles) {
    findings.push({ level: 'ERROR', area: 'master', message: `catalog.json lists subject "${id}" but ${id}.json is missing` })
  }

  const subjectRows = []
  let actualTotal = 0
  let claimedTotal = 0
  const difficultyTotals = new Map()
  const typeTotals = new Map()
  const globalIdMap = new Map()
  const globalTextMap = new Map()
  let missingAnswer = 0
  let missingTags = 0

  for (const subjectId of files) {
    const questions = loadJson(path.join(MASTER_DIR, `${subjectId}.json`))
    const meta = catalog.subjects.find(s => s.id === subjectId)
    const claimed = meta ? meta.totalQuestions : null
    actualTotal += questions.length
    claimedTotal += claimed || 0

    if (claimed !== null && claimed !== questions.length) {
      findings.push({
        level: 'WARN',
        area: 'master',
        message: `catalog.json claims ${claimed} questions for "${subjectId}" but ${subjectId}.json has ${questions.length}`,
      })
    }

    const actualCategories = [...new Set(questions.map(q => q.category || q.topic).filter(Boolean))].sort()
    if (meta) {
      const stale = (meta.topics || []).filter(t => !actualCategories.includes(t))
      const unlisted = actualCategories.filter(c => !(meta.topics || []).includes(c))
      if (stale.length || unlisted.length) {
        findings.push({
          level: 'WARN',
          area: 'master',
          message: `topic mismatch for "${subjectId}": ${unlisted.length} category(ies) missing from catalog topics, ${stale.length} catalog topic(s) not present in data`,
        })
      }
    }

    const seenText = new Set()
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const diff = (q.difficulty || 'UNSET').toUpperCase()
      difficultyTotals.set(diff, (difficultyTotals.get(diff) || 0) + 1)
      const type = q.questionType || q.question_type || 'UNSET'
      typeTotals.set(type, (typeTotals.get(type) || 0) + 1)

      if (!q.shortAnswer && !q.interviewAnswer && !q.detailedAnswer && !q.detailedExplanation) missingAnswer++
      if (!Array.isArray(q.tags) || q.tags.length === 0) missingTags++

      if (!q.id) {
        findings.push({ level: 'ERROR', area: 'master', message: `question #${i + 1} in ${subjectId}.json has no id` })
      } else if (globalIdMap.has(q.id)) {
        findings.push({ level: 'ERROR', area: 'master', message: `duplicate id "${q.id}" in ${subjectId}.json (also in ${globalIdMap.get(q.id)})` })
      } else {
        globalIdMap.set(q.id, subjectId)
      }

      const normalized = normalizeText(q.question)
      if (seenText.has(normalized)) {
        findings.push({ level: 'WARN', area: 'master', message: `duplicate question title within ${subjectId}.json: "${(q.question || '').slice(0, 70)}"` })
      }
      seenText.add(normalized)

      if (globalTextMap.has(normalized)) {
        const other = globalTextMap.get(normalized)
        if (other.subject !== subjectId) {
          findings.push({ level: 'WARN', area: 'master', message: `cross-subject duplicate: ${subjectId} #${i + 1} duplicates ${other.subject} #${other.index + 1}` })
        }
      } else {
        globalTextMap.set(normalized, { subject: subjectId, index: i })
      }
    }

    subjectRows.push([subjectId, questions.length, claimed ?? '—', actualCategories.length])
  }

  if (catalog.totalQuestions !== actualTotal) {
    findings.push({
      level: 'WARN',
      area: 'master',
      message: `catalog.json totalQuestions=${catalog.totalQuestions} but actual total=${actualTotal}`,
    })
  }
  if (catalog.totalSubjects !== catalogIds.length) {
    findings.push({
      level: 'WARN',
      area: 'master',
      message: `catalog.json totalSubjects=${catalog.totalSubjects} but subjects array has ${catalogIds.length} entries`,
    })
  }
  if (missingAnswer > 0) {
    findings.push({ level: 'WARN', area: 'master', message: `${missingAnswer} question(s) have no answer content (shortAnswer/interviewAnswer/detailedAnswer)` })
  }
  if (missingTags > 0) {
    findings.push({ level: 'WARN', area: 'master', message: `${missingTags} question(s) have missing or empty tags` })
  }

  return {
    title: 'Master Question Bank (public/data/interview-questions)',
    subjectRows,
    subjectHeaders: ['Subject', 'Actual', 'Catalog claim', 'Categories'],
    actualTotal,
    claimedTotal,
    difficultyTotals,
    typeTotals,
    findings,
    summary: `${files.length} subject files, ${actualTotal} questions (catalog claims ${claimedTotal})`,
  }
}

function auditMainBank(dataFiles) {
  const findings = []
  const filesOnDisk = fs
    .readdirSync(PUBLIC_DATA_DIR)
    .filter(f => f.endsWith('.json') && !AUX_FILES.has(f))
    .map(f => f.replace('.json', ''))
    .sort()

  const referenced = [...dataFiles]
  for (const name of referenced) {
    if (!fs.existsSync(path.join(PUBLIC_DATA_DIR, `${name}.json`))) {
      findings.push({ level: 'ERROR', area: 'questions', message: `DATA_FILES references "${name}" but public/data/${name}.json is missing (request would 404)` })
    }
  }

  const unreferenced = filesOnDisk.filter(f => !referenced.includes(f))
  for (const name of unreferenced) {
    findings.push({ level: 'WARN', area: 'questions', message: `public/data/${name}.json is not listed in DATA_FILES (never loaded)` })
  }

  const rows = []
  const idMap = new Map()
  let total = 0
  const difficultyTotals = new Map()
  const categoryTotals = new Map()

  for (const name of referenced) {
    const filePath = path.join(PUBLIC_DATA_DIR, `${name}.json`)
    if (!fs.existsSync(filePath)) continue
    const questions = loadJson(filePath)
    total += questions.length

    if (questions.length === 0) {
      findings.push({ level: 'WARN', area: 'questions', message: `${name}.json is empty (contributes 0 questions)` })
    }

    let collisions = 0
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const diff = q.difficulty || 'UNSET'
      difficultyTotals.set(diff, (difficultyTotals.get(diff) || 0) + 1)
      const cat = q.category || 'UNSET'
      categoryTotals.set(cat, (categoryTotals.get(cat) || 0) + 1)

      if (q.id === undefined || q.id === null) {
        findings.push({ level: 'ERROR', area: 'questions', message: `question #${i + 1} in ${name}.json has no id` })
        continue
      }
      if (idMap.has(q.id)) {
        collisions++
        const other = idMap.get(q.id)
        if (other.file !== name) {
          findings.push({
            level: 'ERROR',
            area: 'questions',
            message: `id collision: ${q.id} exists in both "${other.file}" (index ${other.index}) and "${name}" (index ${i}) — /questions/${q.id} resolves to the first only`,
          })
        }
      } else {
        idMap.set(q.id, { file: name, index: i })
      }
    }

    rows.push([name, questions.length, collisions])
  }

  return {
    title: 'Main Question Bank (public/data, loaded via DATA_FILES)',
    fileRows: rows,
    fileHeaders: ['File', 'Questions', 'ID collisions'],
    total,
    difficultyTotals,
    categoryTotals,
    findings,
    summary: `${referenced.length} data files, ${total} questions, ${rows.reduce((a, r) => a + r[2], 0)} id collisions`,
  }
}

function buildReport(master, main) {
  const allFindings = [...master.findings, ...main.findings]
  const errors = allFindings.filter(f => f.level === 'ERROR')
  const warnings = allFindings.filter(f => f.level === 'WARN')
  const lines = []

  lines.push('# Question Bank Audit Report')
  lines.push('')
  lines.push(`Generated: ${new Date().toISOString()}`)
  lines.push('')
  lines.push('## Summary')
  lines.push('')
  lines.push(`- Master bank: ${master.summary}`)
  lines.push(`- Main bank: ${main.summary}`)
  lines.push(`- Findings: ${errors.length} error(s), ${warnings.length} warning(s)`)
  lines.push('')
  lines.push(`## ${master.title}`)
  lines.push('')
  lines.push('```')
  lines.push(formatTable(master.subjectRows, master.subjectHeaders))
  lines.push('```')
  lines.push('')
  lines.push('Difficulty breakdown:')
  lines.push('')
  lines.push('```')
  for (const [key, count] of sortedEntries(master.difficultyTotals)) {
    lines.push(`${String(key).padEnd(16)} ${count}`)
  }
  lines.push('```')
  lines.push('')
  lines.push(`## ${main.title}`)
  lines.push('')
  lines.push('```')
  lines.push(formatTable(main.fileRows, main.fileHeaders))
  lines.push('```')
  lines.push('')
  lines.push('Difficulty breakdown:')
  lines.push('')
  lines.push('```')
  for (const [key, count] of sortedEntries(main.difficultyTotals)) {
    lines.push(`${String(key).padEnd(16)} ${count}`)
  }
  lines.push('```')
  lines.push('')
  lines.push('Category breakdown:')
  lines.push('')
  lines.push('```')
  for (const [key, count] of sortedEntries(main.categoryTotals)) {
    lines.push(`${String(key).padEnd(28)} ${count}`)
  }
  lines.push('```')
  lines.push('')
  lines.push('## Findings')
  lines.push('')
  if (allFindings.length === 0) {
    lines.push('No findings — question bank is consistent.')
  } else {
    for (const f of allFindings) {
      lines.push(`- **${f.level}** (${f.area}): ${f.message}`)
    }
  }
  lines.push('')
  return lines.join('\n')
}

function printSummary(master, main) {
  const allFindings = [...master.findings, ...main.findings]
  const errors = allFindings.filter(f => f.level === 'ERROR').length
  const warnings = allFindings.filter(f => f.level === 'WARN').length

  console.log('================================================================')
  console.log('Question Bank Audit')
  console.log('================================================================')
  console.log('')
  console.log(`Master bank : ${master.summary}`)
  console.log(`Main bank   : ${main.summary}`)
  console.log('')

  console.log(master.title)
  console.log(formatTable(master.subjectRows, master.subjectHeaders))
  console.log('')

  console.log(main.title)
  console.log(formatTable(main.fileRows, main.fileHeaders))
  console.log('')

  console.log(`Findings: ${errors} error(s), ${warnings} warning(s)`)
  for (const f of allFindings.slice(0, 30)) {
    console.log(`  [${f.level}] (${f.area}) ${f.message}`)
  }
  if (allFindings.length > 30) {
    console.log(`  ... and ${allFindings.length - 30} more`)
  }
}

function main() {
  const dataFiles = readDataFiles()
  const master = auditMasterBank()
  const mainBank = auditMainBank(dataFiles)

  printSummary(master, mainBank)

  if (REPORT_PATH) {
    const reportPath = path.isAbsolute(REPORT_PATH) ? REPORT_PATH : path.join(ROOT, REPORT_PATH)
    fs.mkdirSync(path.dirname(reportPath), { recursive: true })
    fs.writeFileSync(reportPath, buildReport(master, mainBank))
    console.log('')
    console.log(`Report written to ${path.relative(ROOT, reportPath)}`)
  }
}

main()
