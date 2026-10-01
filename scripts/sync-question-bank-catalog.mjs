#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const MASTER_DIR = path.join(ROOT, 'public', 'data', 'interview-questions')
const CATALOG_PATH = path.join(MASTER_DIR, 'catalog.json')

const NEW_SUBJECT_META = {
  es7: {
    after: 'es6',
    meta: {
      id: 'es7',
      name: 'ECMAScript 2016 (ES7)',
      icon: '✨',
      badge: 'ES2016',
      color: '#007acc',
      accentGradient: 'linear-gradient(135deg, #007acc 0%, #00b4d8 100%)',
      description:
        'ECMAScript 2016 additions: Array.prototype.includes, the exponentiation operator (**), and tighter Math functions with interview-focused explanations.',
    },
  },
  es8: {
    after: 'es7',
    meta: {
      id: 'es8',
      name: 'ECMAScript 2017 (ES8)',
      icon: '🧩',
      badge: 'ES2017',
      color: '#007acc',
      accentGradient: 'linear-gradient(135deg, #007acc 0%, #00b4d8 100%)',
      description:
        'ECMAScript 2017 additions: async/await, Object.values/entries, String padding, SharedArrayBuffer, and Atomics with interview-focused explanations.',
    },
  },
}

function loadQuestions(subjectId) {
  const filePath = path.join(MASTER_DIR, `${subjectId}.json`)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function deriveTopics(questions) {
  const set = new Set()
  for (const q of questions) {
    const value = q.category || q.topic
    if (value) set.add(value)
  }
  return [...set].sort((a, b) => a.localeCompare(b))
}

function main() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'))
  const files = fs
    .readdirSync(MASTER_DIR)
    .filter(f => f.endsWith('.json') && f !== 'catalog.json')
    .map(f => f.replace('.json', ''))
    .sort()

  const changes = []
  const subjects = []

  for (const existing of catalog.subjects) {
    if (!files.includes(existing.id)) {
      changes.push(`removed "${existing.id}" (no ${existing.id}.json on disk)`)
      continue
    }
    subjects.push(existing)
  }

  for (const id of files) {
    const questions = loadQuestions(id)
    const topics = deriveTopics(questions)
    const index = subjects.findIndex(s => s.id === id)

    if (index === -1) {
      const entry = NEW_SUBJECT_META[id]
      if (!entry) {
        throw new Error(
          `Subject file ${id}.json has no catalog entry and no metadata in NEW_SUBJECT_META — add metadata before syncing.`
        )
      }
      subjects.push({ ...entry.meta, totalQuestions: questions.length, topics })
      changes.push(`registered "${id}" (${questions.length} questions)`)
      continue
    }

    const subject = subjects[index]
    const beforeCount = subject.totalQuestions
    const beforeTopics = JSON.stringify(subject.topics || [])
    const afterTopics = JSON.stringify(topics)

    if (beforeCount !== questions.length) {
      changes.push(`"${id}" totalQuestions: ${beforeCount} -> ${questions.length}`)
    }
    if (beforeTopics !== afterTopics) {
      changes.push(`"${id}" topics: ${(subject.topics || []).length} -> ${topics.length} entries`)
    }

    subjects[index] = { ...subject, totalQuestions: questions.length, topics }
  }

  for (const [id, entry] of Object.entries(NEW_SUBJECT_META)) {
    const current = subjects.findIndex(s => s.id === id)
    if (current === -1) continue
    const [subject] = subjects.splice(current, 1)
    const anchor = subjects.findIndex(s => s.id === entry.after)
    if (anchor === -1) {
      throw new Error(`Cannot place "${id}": anchor subject "${entry.after}" not found in catalog`)
    }
    const insertAt = anchor + 1
    if (current !== insertAt) {
      subjects.splice(insertAt, 0, subject)
      changes.push(`moved "${id}" directly after "${entry.after}"`)
    } else {
      subjects.splice(insertAt, 0, subject)
    }
  }

  const totalQuestions = subjects.reduce((sum, s) => sum + s.totalQuestions, 0)
  const beforeTotal = catalog.totalQuestions
  const beforeSubjects = catalog.totalSubjects

  const next = {
    generatedAt: new Date().toISOString(),
    totalQuestions,
    totalSubjects: subjects.length,
    subjects,
  }

  if (beforeTotal !== totalQuestions) {
    changes.push(`totalQuestions: ${beforeTotal} -> ${totalQuestions}`)
  }
  if (beforeSubjects !== subjects.length) {
    changes.push(`totalSubjects: ${beforeSubjects} -> ${subjects.length}`)
  }

  fs.writeFileSync(CATALOG_PATH, `${JSON.stringify(next, null, 2)}\n`)

  console.log(`catalog.json synced: ${subjects.length} subjects, ${totalQuestions} questions`)
  if (changes.length === 0) {
    console.log('No changes — catalog already matches question files.')
  } else {
    for (const change of changes) console.log(`  - ${change}`)
  }
}

main()
