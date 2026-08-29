// Generic premium-question scraper.
//
// Iterates over the adapters in scripts/sources.mjs, renders each paywalled
// question page with YOUR subscription cookie (via Playwright), and extracts the
// question/answer/code. Each adapter's `listings` write to public/data/<file>.json.
//
// Run:  npm run scrape:premium
// Limit to specific sources:  SCRAPE_ONLY=gfe,leetcode npm run scrape:premium
//
// Per source you must provide a cookie (env var named by cookieEnv, or a file
// at cookieFile — both gitignored). The GreatFrontEnd adapter is enabled and
// tuned; the other adapters are stubs you enable + tune for each site's DOM.

import { writeFile, mkdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { SOURCES } from './sources.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT_DIR = resolve(ROOT, 'public/data')

function parseCookies(header, domain) {
  if (!header) return []
  return header
    .split(';')
    .map(p => p.trim())
    .filter(Boolean)
    .map(pair => {
      const idx = pair.indexOf('=')
      return {
        name: pair.slice(0, idx),
        value: pair.slice(idx + 1),
        domain,
        path: '/',
      }
    })
}

async function loadCookie(src) {
  if (process.env[src.cookieEnv]) return process.env[src.cookieEnv]
  try {
    return (await readFile(resolve(ROOT, src.cookieFile), 'utf8')).trim()
  } catch {
    return ''
  }
}

async function collectLinks(page, listing, linkPattern) {
  await page.goto(listing.url, { waitUntil: 'networkidle' })
  const hrefs = await page
    .locator('a[href*="/"]')
    .evaluateAll(els => els.map(e => e.getAttribute('href')).filter(Boolean))
  const base = new URL(listing.url).origin
  const seen = new Set()
  for (const h of hrefs) {
    try {
      const abs = new URL(h, base).pathname
      if (linkPattern.test(abs)) seen.add(abs)
    } catch {
      /* ignore malformed */
    }
  }
  return [...seen]
}

async function extract(page, selectors, listing) {
  await page.waitForSelector(`${selectors.question}, ${selectors.answer.split(',')[0]}`, { timeout: 15000 })
  const question = (await page.locator(selectors.question).first().innerText()).trim()
  if (!question) return null

  let answer = ''
  const answerLoc = page.locator(selectors.answer.split(',')[0].trim())
  if (await answerLoc.count()) {
    answer = (await answerLoc.innerText()).trim()
    if (answer.startsWith(question)) answer = answer.slice(question.length).trim()
  }

  const codeBlocks = await page.locator(selectors.code).allInnerTexts()
  const code = codeBlocks.map(c => c.trim()).filter(Boolean).join('\n\n')

  let category = listing.category
  if (listing.keywordFilter) {
    const hay = (question + ' ' + page.url()).toLowerCase()
    if (!listing.keywordFilter.some(k => hay.includes(k))) return null
  }

  let difficulty = 'Medium'
  for (const lvl of selectors.difficulty) {
    if (await page.getByText(lvl, { exact: true }).first().count()) {
      difficulty = lvl
      break
    }
  }

  const q = { category, difficulty, question, answer }
  if (code) q.code = code
  return q
}

async function scrapeSource(browser, src) {
  const header = await loadCookie(src)
  if (!header) {
    console.warn(`  ! no cookie for ${src.name} (set ${src.cookieEnv} or ${src.cookieFile}) — skipping`)
    return
  }
  const cookies = parseCookies(header, src.cookieDomain)
  if (!cookies.length) {
    console.warn(`  ! cookie for ${src.name} parsed to zero entries — skipping`)
    return
  }

  const context = await browser.newContext()
  await context.addCookies(cookies)
  const page = await context.newPage()

  for (const listing of src.listings) {
    try {
      console.log(`  -> ${listing.category} (${listing.url})`)
      const links = await collectLinks(page, listing, src.linkPattern)
      console.log(`     found ${links.length} candidate links`)

      const out = []
      let skipped = 0
      for (let i = 0; i < links.length; i++) {
        const url = new URL(listing.url).origin + links[i]
        try {
          await page.goto(url, { waitUntil: 'domcontentloaded' })
          const q = await extract(page, src.selectors, listing)
          if (!q) {
            skipped++
            continue
          }
          out.push({ id: listing.idBase + out.length, ...q })
        } catch (err) {
          console.warn(`     ! failed ${links[i]}: ${err.message}`)
        }
        if ((i + 1) % 10 === 0) console.log(`     progress ${i + 1}/${links.length}`)
        await page.waitForTimeout(250)
      }

      const path = resolve(OUT_DIR, `${listing.file}.json`)
      await writeFile(path, JSON.stringify(out, null, 2) + '\n', 'utf8')
      console.log(`     wrote ${out.length} -> ${listing.file}.json (skipped ${skipped})`)
    } catch (err) {
      console.error(`     ! listing failed: ${err.message}`)
    }
  }

  await context.close()
}

function getPath(obj, path) {
  if (!path) return obj
  return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj)
}

async function scrapeApiSource(src) {
  const tokenHeader = await loadCookie(src)
  let token = tokenHeader

  if (!token && src.auth?.loginPath) {
    console.log(`  logging in at ${src.base}${src.auth.loginPath}`)
    const res = await fetch(`${src.base}${src.auth.loginPath}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(src.auth.loginBody),
    })
    if (!res.ok) {
      console.error(`  ! login failed: ${res.status}`)
      return
    }
    token = getPath(await res.json(), src.auth.tokenPath)
  }
  if (!token) {
    console.warn(`  ! no token for ${src.name} (set ${src.cookieEnv} or ${src.cookieFile}, or configure auth.loginPath)`)
    return
  }

  const headers = { Authorization: `Bearer ${token}` }
  const listRes = await fetch(`${src.base}${src.list.path}`, { headers })
  if (!listRes.ok) {
    console.error(`  ! list failed: ${listRes.status}`)
    return
  }
  const listJson = await listRes.json()
  const items = getPath(listJson, src.list.itemsPath) || []
  console.log(`  got ${items.length} items from ${src.list.path}`)

  const out = []
  for (const item of items) {
    let detail = item
    if (src.detail) {
      const dRes = await fetch(`${src.base}${src.detail.path}${item.id}`, { headers })
      if (dRes.ok) detail = await dRes.json()
    }
    const q = src.map(item, detail)
    if (q && q.question) out.push({ id: src.output.idBase + out.length, ...q })
  }

  const path = resolve(OUT_DIR, `${src.output.file}.json`)
  await writeFile(path, JSON.stringify(out, null, 2) + '\n', 'utf8')
  console.log(`  wrote ${out.length} -> ${src.output.file}.json`)
}

const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' }

function decodeEntities(s) {
  return s.replace(/&[a-z#0-9]+;/gi, m => ENTITIES[m] ?? m)
}

// Strip HTML to plain text, extracting <pre><code> blocks as code samples.
function htmlToTextAndCode(html) {
  if (!html) return { text: '', code: '' }
  const codeBlocks = []
  let work = html.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/gi, (_, block) => {
    codeBlocks.push(decodeEntities(block).trim())
    return ''
  })
  const text = decodeEntities(
    work
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|h[1-6]|li|ul|ol|div|tr)>/gi, '\n')
      .replace(/<[^>]+>/g, '')
  )
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  return { text, code: codeBlocks.join('\n\n') }
}

const DIFF_MAP = { EASY: 'Easy', MEDIUM: 'Medium', HARD: 'Hard' }

// Videos live on the `subject/v1` API and require auth. We only fetch metadata
// + watch links (no file downloading). Returns a Bearer token or null.
async function getTopBrainsToken(src) {
  const direct = (process.env.TOPBRAINS_TOKEN || '').trim()
  if (direct) return direct
  try {
    const raw = await readFile(resolve(ROOT, 'scripts/.topbrains-token'), 'utf8')
    if (raw.trim()) return raw.trim()
  } catch {
    /* no token file */
  }
  const email = process.env.TOPBRAINS_EMAIL
  const pwd = process.env.TOPBRAINS_PASSWORD
  if (email && pwd) {
    const authBase = src.base.replace('/challenge/v1', '/subject/v1')
    const res = await fetch(`${authBase}/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ userEmail: email, userPassword: pwd }),
    })
    if (!res.ok) {
      console.warn(`  ! TopBrains login failed: ${res.status}`)
      return null
    }
    const j = await res.json()
    return j.accessToken || j?.payload?.accessToken || j.token || j?.data?.accessToken || null
  }
  return null
}

async function fetchTopBrainsVideos(src, token) {
  if (!token) {
    console.log('  (no TOPBRAINS_TOKEN / credentials — skipping videos)')
    return
  }
  const videoBase = src.base.replace('/challenge/v1', '/subject/v1')
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' }
  const res = await fetch(`${videoBase}/videos`, { headers })
  if (!res.ok) {
    console.warn(`  ! videos fetch failed: ${res.status}`)
    return
  }
  const json = await res.json()
  const wrapper = json.response ?? json.data ?? json
  const items = Array.isArray(wrapper) ? wrapper : wrapper.content ?? []
  if (!Array.isArray(items)) {
    console.warn('  ! unexpected videos response shape; raw saved to topbrains-videos-raw.json')
    await writeFile(resolve(OUT_DIR, 'topbrains-videos-raw.json'), JSON.stringify(json, null, 2), 'utf8')
    return
  }
  const out = items.map((v, i) => ({
    id: src.output.idBase + i,
    title: v.title || v.name || v.videoTitle || '',
    description: v.description || v.summary || '',
    url: v.url || v.videoUrl || v.link || v.src || v.fileUrl || v.playUrl || '',
    thumbnail: v.thumbnail || v.thumbnailUrl || v.poster || '',
    topic: v.topic || v.category || v.subject || '',
  }))
  await writeFile(resolve(OUT_DIR, 'topbrains-videos.json'), JSON.stringify(out, null, 2) + '\n', 'utf8')
  console.log(`  wrote ${out.length} video metadata -> topbrains-videos.json`)
}

async function scrapeTopBrains(src) {
  const base = src.base
  const headers = { Accept: 'application/json' }

  const catRes = await fetch(`${base}/challenge-category/get-all`, { headers })
  if (!catRes.ok) {
    console.error(`  ! category list failed: ${catRes.status}`)
    return
  }
  const cats = (await catRes.json()).response.filter(c => (c.challengesCount || 0) > 0)
  console.log(`  ${cats.length} categories with questions:`, cats.map(c => `${c.name}(${c.challengesCount})`).join(', '))

  const out = []
  for (const cat of cats) {
    let page = 0
    let done = false
    while (!done) {
      const listRes = await fetch(
        `${base}/challenge/get-all?categoryId=${encodeURIComponent(cat.id)}&pageNo=${page}&pageSize=100`,
        { headers }
      )
      if (!listRes.ok) {
        console.warn(`  ! list failed for ${cat.name} page ${page}: ${listRes.status}`)
        break
      }
      const data = await listRes.json()
      const items = data.response?.content ?? []
      done = data.response?.last ?? true

      for (const it of items) {
        try {
          const detRes = await fetch(`${base}/challenge/editor/${it.id}`, { headers })
          if (!detRes.ok) continue
          const det = (await detRes.json()).response
          const { text, code } = htmlToTextAndCode(det.description)
          const q = {
            category: cat.name,
            difficulty: DIFF_MAP[(det.difficulty || it.difficulty || 'MEDIUM').toUpperCase()] || 'Medium',
            question: det.title || it.title || '',
            answer: text,
            ...(code ? { code } : {}),
          }
          if (q.question) out.push({ id: src.output.idBase + out.length, ...q })
        } catch (err) {
          console.warn(`  ! detail ${it.id} failed: ${err.message}`)
        }
      }
      console.log(`  ${cat.name}: page ${page + 1} done (${out.length} total so far)`)
      page++
      if (page > 200) break
    }
  }

  const path = resolve(OUT_DIR, `${src.output.file}.json`)
  await writeFile(path, JSON.stringify(out, null, 2) + '\n', 'utf8')
  console.log(`  wrote ${out.length} -> ${src.output.file}.json`)

  const token = await getTopBrainsToken(src)
  await fetchTopBrainsVideos(src, token)
}

async function main() {
  const only = (process.env.SCRAPE_ONLY || '').split(',').map(s => s.trim()).filter(Boolean)
  const sources = SOURCES.filter(s => s.enabled && (!only.length || only.includes(s.id)))

  if (!sources.length) {
    console.error('No enabled sources match. Enable a source in scripts/sources.mjs or set SCRAPE_ONLY.')
    process.exit(1)
  }

  await mkdir(OUT_DIR, { recursive: true })

  for (const src of sources) {
    console.log(`\n== ${src.name} ==`)
    if (src.type === 'api') {
      await scrapeApiSource(src)
    } else if (src.type === 'topbrains') {
      await scrapeTopBrains(src)
    } else {
      const { chromium } = await import('playwright')
      const browser = await chromium.launch()
      await scrapeSource(browser, src)
      await browser.close()
    }
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
