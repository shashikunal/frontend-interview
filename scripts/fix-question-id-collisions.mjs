#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DATA_DIR = path.join(ROOT, 'public', 'data')

const REMAPS = {
  'greatfrontend-javascript': { fromStart: 1000000, fromEnd: 1000192, toStart: 1500000 },
  'greatfrontend-react': { fromStart: 2000000, fromEnd: 2000049, toStart: 2500000 },
  frontendlead: { fromStart: 223916, fromEnd: 224607, toStart: 400000 },
}

const DATA_FILES = [
  'leetcode-style',
  'frontendmasters-style',
  'greatfrontend-javascript',
  'greatfrontend-react',
  'greatfrontend-typescript',
  'greatfrontend-dom',
  'algomonster',
  'educative',
  'frontendlead',
  'topbrains',
  'js-assignments',
  'system-design',
]

function remapId(file, id) {
  const remap = REMAPS[file]
  if (!remap) return id
  if (id < remap.fromStart || id > remap.fromEnd) return id
  return id - remap.fromStart + remap.toStart
}

function main() {
  const questionsByFile = new Map()
  for (const file of DATA_FILES) {
    const filePath = path.join(DATA_DIR, `${file}.json`)
    questionsByFile.set(file, JSON.parse(fs.readFileSync(filePath, 'utf8')))
  }

  const idOwners = new Map()
  const collisions = []
  for (const [file, questions] of questionsByFile) {
    questions.forEach((q, index) => {
      const nextId = remapId(file, q.id)
      const owner = idOwners.get(nextId)
      if (owner) {
        collisions.push(`${nextId}: ${owner} and ${file} (index ${index})`)
      } else {
        idOwners.set(nextId, `${file} (index ${index})`)
      }
    })
  }

  if (collisions.length > 0) {
    console.error(`Refusing to write: ${collisions.length} id collision(s) would remain:`)
    collisions.slice(0, 20).forEach(c => console.error(`  - ${c}`))
    process.exit(1)
  }

  const changedFiles = []
  for (const [file, questions] of questionsByFile) {
    let changed = 0
    for (const q of questions) {
      const nextId = remapId(file, q.id)
      if (nextId !== q.id) {
        q.id = nextId
        changed++
      }
    }
    if (changed > 0) {
      const filePath = path.join(DATA_DIR, `${file}.json`)
      const original = fs.readFileSync(filePath, 'utf8')
      const trailing = original.endsWith('\n') ? '\n' : ''
      fs.writeFileSync(filePath, `${JSON.stringify(questions, null, 2)}${trailing}`)
      changedFiles.push(`${file}.json: ${changed} ids remapped`)
    }
  }

  if (changedFiles.length === 0) {
    console.log('No id collisions found — nothing to change.')
  } else {
    console.log(`Remapped question ids (${idOwners.size} unique ids verified):`)
    changedFiles.forEach(entry => console.log(`  - ${entry}`))
  }
}

main()
