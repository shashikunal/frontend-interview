#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT = path.resolve(__dirname, '..')
const MASTER_DIR = path.join(ROOT, 'public', 'data', 'interview-questions')
const PUBLIC_DATA_DIR = path.join(ROOT, 'public', 'data')
const QUESTION_SERVICE = path.join(ROOT, 'src', 'data', 'questionService.ts')
const BANK_TOTALS_PATH = path.join(ROOT, 'src', 'data', 'bankTotals.json')
const MOCK_BANK_DIR = path.join(ROOT, 'src', 'features', 'ai-video-mock', 'data', 'questionBank')
const WRITE_TOTALS = process.argv.includes('--write')

const MASTER_DIFFICULTIES = new Set(['EASY', 'INTERMEDIATE', 'DIFFICULT'])
const MASTER_LEVELS = new Set(['FRESHER', '1_3_YEARS', '3_5_YEARS', '5_8_YEARS', '8_PLUS_YEARS'])
const MAIN_DIFFICULTIES = new Set(['Easy', 'Medium', 'Hard'])
const AUX_FILES = new Set(['companies.json', 'topbrains-videos.json', 'catalog.json'])

const errors = []
const warnings = []

function error(message) {
  errors.push(message)
}

function warn(message) {
  warnings.push(message)
}

function normalizeText(value) {
  return (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function readDataFiles() {
  const source = fs.readFileSync(QUESTION_SERVICE, 'utf8')
  const match = source.match(/export const DATA_FILES = \[([\s\S]*?)\] as const/)
  if (!match) {
    throw new Error('Could not locate DATA_FILES array in src/data/questionService.ts')
  }
  return [...match[1].matchAll(/'([^']+)'/g)].map(m => m[1])
}

function validateMasterBank() {
  const catalogPath = path.join(MASTER_DIR, 'catalog.json')
  if (!fs.existsSync(catalogPath)) {
    error('master: catalog.json is missing')
    return { subjectCount: 0, questionCount: 0 }
  }

  let catalog
  try {
    catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
  } catch (err) {
    error(`master: catalog.json is not valid JSON (${err.message})`)
    return { subjectCount: 0, questionCount: 0 }
  }

  const files = fs
    .readdirSync(MASTER_DIR)
    .filter(f => f.endsWith('.json') && f !== 'catalog.json')
    .map(f => f.replace('.json', ''))
    .sort()
  const catalogIds = catalog.subjects.map(s => s.id)

  if (catalog.totalSubjects !== catalogIds.length) {
    error(`master: catalog.totalSubjects=${catalog.totalSubjects} but subjects[] has ${catalogIds.length} entries`)
  }

  for (const id of files.filter(f => !catalogIds.includes(f))) {
    error(`master: ${id}.json exists but is not registered in catalog.json`)
  }
  for (const id of catalogIds.filter(id => !files.includes(id))) {
    error(`master: catalog.json lists "${id}" but ${id}.json is missing`)
  }

  const globalIds = new Map()
  let questionCount = 0
  let sharedTitleVariants = 0

  const contentSignature = q => {
    const copy = { ...q }
    delete copy.id
    delete copy.standard_id
    delete copy.questionNumber
    delete copy.question_hash
    return JSON.stringify(copy)
  }

  for (const subject of catalog.subjects) {
    const filePath = path.join(MASTER_DIR, `${subject.id}.json`)
    if (!fs.existsSync(filePath)) continue

    let questions
    try {
      questions = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    } catch (err) {
      error(`master: ${subject.id}.json is not valid JSON (${err.message})`)
      continue
    }
    if (!Array.isArray(questions)) {
      error(`master: ${subject.id}.json is not an array`)
      continue
    }

    questionCount += questions.length

    if (subject.totalQuestions !== questions.length) {
      error(`master: catalog claims ${subject.totalQuestions} questions for "${subject.id}" but file has ${questions.length}`)
    }

    const actualCategories = new Set(
      questions.map(q => q.category || q.topic).filter(Boolean)
    )
    for (const topic of subject.topics || []) {
      if (!actualCategories.has(topic)) {
        error(`master: catalog topic "${topic}" for "${subject.id}" does not exist in question data`)
      }
    }
    for (const category of actualCategories) {
      if (!(subject.topics || []).includes(category)) {
        error(`master: category "${category}" in ${subject.id}.json is missing from catalog topics`)
      }
    }

    const seenTitles = new Map()
    questions.forEach((q, index) => {
      const label = `${subject.id}.json #${index + 1} (${q.id ?? 'no-id'})`

      if (!isNonEmptyString(q.id)) error(`master: ${label} is missing id`)
      if (q.subject !== subject.id) error(`master: ${label} has subject="${q.subject}", expected "${subject.id}"`)
      if (!isNonEmptyString(q.question)) error(`master: ${label} is missing question`)
      if (!isNonEmptyString(q.shortAnswer)) error(`master: ${label} is missing shortAnswer`)
      if (!MASTER_DIFFICULTIES.has(q.difficulty)) {
        error(`master: ${label} has non-canonical difficulty "${q.difficulty}"`)
      }
      if (!MASTER_LEVELS.has(q.experienceLevel)) {
        error(`master: ${label} has missing/invalid experienceLevel "${q.experienceLevel}"`)
      }
      if (!isNonEmptyString(q.questionType) && !isNonEmptyString(q.question_type)) {
        error(`master: ${label} is missing questionType`)
      }
      if (!Array.isArray(q.tags) || q.tags.length === 0) {
        error(`master: ${label} has missing or empty tags`)
      }

      if (isNonEmptyString(q.id)) {
        if (globalIds.has(q.id)) {
          error(`master: duplicate id "${q.id}" in ${subject.id}.json (also in ${globalIds.get(q.id)})`)
        } else {
          globalIds.set(q.id, subject.id)
        }
      }

      const title = normalizeText(q.question)
      if (seenTitles.has(title)) {
        const first = seenTitles.get(title)
        if (contentSignature(first.question) === contentSignature(q)) {
          error(`master: exact duplicate question in ${subject.id}.json at #${index + 1} (same content as #${first.index + 1})`)
        } else {
          sharedTitleVariants++
        }
      } else {
        seenTitles.set(title, { index, question: q })
      }
    })
  }

  if (catalog.totalQuestions !== questionCount) {
    error(`master: catalog.totalQuestions=${catalog.totalQuestions} but actual question count=${questionCount}`)
  }

  console.log(`master bank : ${catalog.subjects.length} subjects, ${questionCount} questions`)
  if (sharedTitleVariants > 0) {
    console.log(`info: ${sharedTitleVariants} shared-title variant pair(s) (base + advanced questions with the same title)`)
  }
  return { subjectCount: catalog.subjects.length, questionCount }
}

function validateMainBank(dataFiles) {
  const filesOnDisk = fs
    .readdirSync(PUBLIC_DATA_DIR)
    .filter(f => f.endsWith('.json') && !AUX_FILES.has(f))
    .map(f => f.replace('.json', ''))
    .sort()

  const globalIds = new Map()
  let questionCount = 0

  for (const name of dataFiles) {
    const filePath = path.join(PUBLIC_DATA_DIR, `${name}.json`)
    if (!fs.existsSync(filePath)) {
      error(`questions: DATA_FILES references "${name}" but public/data/${name}.json is missing`)
      continue
    }

    let questions
    try {
      questions = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    } catch (err) {
      error(`questions: ${name}.json is not valid JSON (${err.message})`)
      continue
    }
    if (!Array.isArray(questions)) {
      error(`questions: ${name}.json is not an array`)
      continue
    }
    if (questions.length === 0) {
      error(`questions: ${name}.json is empty`)
      continue
    }

    questionCount += questions.length

    questions.forEach((q, index) => {
      const label = `${name}.json #${index + 1} (id=${q.id ?? 'missing'})`

      if (q.id === undefined || q.id === null) {
        error(`questions: ${label} is missing id`)
        return
      }
      if (globalIds.has(q.id)) {
        error(`questions: duplicate id ${q.id} in ${name}.json (also in ${globalIds.get(q.id)})`)
      } else {
        globalIds.set(q.id, name)
      }

      if (!isNonEmptyString(q.question)) error(`questions: ${label} is missing question`)
      if (!isNonEmptyString(q.answer)) error(`questions: ${label} is missing answer`)
      if (!MAIN_DIFFICULTIES.has(q.difficulty)) {
        error(`questions: ${label} has non-canonical difficulty "${q.difficulty}"`)
      }
      if (!isNonEmptyString(q.category)) error(`questions: ${label} is missing category`)
    })
  }

  for (const name of filesOnDisk.filter(f => !dataFiles.includes(f))) {
    warn(`questions: public/data/${name}.json is not listed in DATA_FILES (never loaded)`)
  }

  console.log(`main bank   : ${dataFiles.length} data files, ${questionCount} questions`)
  return { dataFileCount: dataFiles.length, questionCount }
}

function validateMockBank() {
  if (!fs.existsSync(MOCK_BANK_DIR)) {
    error('mock: question bank directory is missing')
    return { questionCount: 0, trackCount: 0 }
  }

  const files = fs.readdirSync(MOCK_BANK_DIR).filter(f => f.endsWith('.ts')).sort()
  let questionCount = 0

  for (const file of files) {
    const source = fs.readFileSync(path.join(MOCK_BANK_DIR, file), 'utf8')
    questionCount += (source.match(/"questionType":/g) || []).length
  }

  console.log(`mock bank   : ${files.length} tracks, ${questionCount} questions`)
  return { questionCount, trackCount: files.length }
}

function validateBankTotals(master, mainBank, mockBank) {
  const expected = {
    mainBankQuestions: mainBank.questionCount,
    masterBankQuestions: master.questionCount,
    masterBankSubjects: master.subjectCount,
    mockBankQuestions: mockBank.questionCount,
    mockBankTracks: mockBank.trackCount,
  }

  let actual = null
  try {
    actual = JSON.parse(fs.readFileSync(BANK_TOTALS_PATH, 'utf8'))
  } catch (err) {
    error(`totals: src/data/bankTotals.json is missing or invalid JSON (${err.message})`)
  }

  if (!actual) return expected

  const stale = Object.entries(expected).filter(([key, value]) => actual[key] !== value)

  if (stale.length > 0) {
    if (WRITE_TOTALS) {
      fs.writeFileSync(BANK_TOTALS_PATH, `${JSON.stringify(expected, null, 2)}\n`)
      console.log(`totals      : rewrote src/data/bankTotals.json (${stale.map(([k]) => k).join(', ')})`)
    } else {
      stale.forEach(([key, value]) => {
        error(`totals: bankTotals.${key}=${actual[key]} but actual value is ${value} (run "npm run validate:questions -- --write")`)
      })
    }
  } else {
    console.log('totals      : src/data/bankTotals.json matches computed counts')
  }

  return expected
}

function main() {
  console.log('================================================================')
  console.log('Strict Question Bank Validation')
  console.log('================================================================')

  const dataFiles = readDataFiles()
  const master = validateMasterBank()
  const mainBank = validateMainBank(dataFiles)
  const mockBank = validateMockBank()
  validateBankTotals(master, mainBank, mockBank)

  console.log('----------------------------------------------------------------')
  console.log(`Warnings: ${warnings.length}`)
  console.log(`Errors:   ${errors.length}`)

  if (warnings.length > 0) {
    const limit = 10
    warnings.slice(0, limit).forEach(w => console.log(`  [warn] ${w}`))
    if (warnings.length > limit) console.log(`  ... and ${warnings.length - limit} more warnings`)
  }

  if (errors.length > 0) {
    console.error('Validation FAILED:')
    errors.slice(0, 30).forEach(e => console.error(`  [error] ${e}`))
    if (errors.length > 30) console.error(`  ... and ${errors.length - 30} more errors`)
    process.exit(1)
  }

  console.log(
    `Validation PASSED: ${master.questionCount} master + ${mainBank.questionCount} main bank questions across ${master.subjectCount} subjects.`
  )
}

main()
