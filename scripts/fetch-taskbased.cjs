const fs = require('fs')

const OWNER = 'shashikunal'
const REPO = 'react-task-based-questions'
const PREFIX = 'examples-20260715T064057Z-1-001/examples/'

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`)
  return res.json()
}

async function fetchRaw(path) {
  const url = `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/${encodeURI(path)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`raw ${path} -> ${res.status}`)
  return res.text()
}

function renameDefaultToApp(src) {
  const m1 = src.match(/export\s+default\s+(?:function|class)\s+([A-Za-z0-9_$]+)/)
  const m2 = src.match(/export\s+default\s+([A-Za-z0-9_$]+)\s*;?/)
  const defaultName = m1 ? m1[1] : m2 ? m2[1] : null
  if (!defaultName) return src
  let out = src.replace(
    new RegExp(`(const|function|class)\\s+${defaultName}\\b`, 'g'),
    '$1 App'
  )
  out = out.replace(new RegExp(`export\\s+default\\s+${defaultName}\\b`), 'export default App')
  return out
}

function pretty(name) {
  return name
    .replace(/\.(jsx?|tsx?|css)$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

async function main() {
  const tree = await fetchJson(
    `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/main?recursive=1`
  )
  if (tree.truncated) console.warn('WARNING: tree truncated by GitHub')

  const blobs = (tree.tree || []).filter(
    t => t.type === 'blob' && t.path.startsWith(PREFIX) && !t.path.endsWith('/')
  )

  // group files by example folder
  const byExample = new Map()
  for (const b of blobs) {
    const rel = b.path.slice(PREFIX.length)
    const slash = rel.indexOf('/')
    if (slash === -1) continue
    const name = rel.slice(0, slash)
    const file = rel.slice(slash + 1)
    if (!byExample.has(name)) byExample.set(name, [])
    byExample.get(name).push({ file, path: b.path })
  }

  const examples = []
  for (const [folder, files] of byExample) {
    try {
      const jsx = files.filter(f => /\.(jsx?|tsx?)$/i.test(f.file))
      const css = files.filter(f => /\.css$/i.test(f.file))
      if (jsx.length === 0) {
        console.log(`skip ${folder}: no jsx`)
        continue
      }
      // pick main jsx: prefer the one matching the folder name, else the largest
      const mainJsx =
        jsx.find(f => f.file.toLowerCase().startsWith(folder.toLowerCase().replace(/[^a-z0-9]/g, ''))) ||
        jsx.sort((a, b) => b.file.length - a.file.length)[0]

      const solJsx = renameDefaultToApp(await fetchRaw(mainJsx.path))
      const solCss = {}
      for (const c of css) solCss[c.file] = await fetchRaw(c.path)

      const cssImport = css.length
        ? `\nimport "./${css[0].file}";`
        : ''
      const starterJsx = `import React from "react";${cssImport}

// Task: build the ${pretty(folder)} component.
const App = () => {
  return (
    <div>
      <h1>${pretty(folder)}</h1>
      {/* Implement your component here */}
    </div>
  );
};

export default App;
`

      examples.push({
        id: folder.replace(/[^a-z0-9]/gi, '-').toLowerCase(),
        title: pretty(folder),
        description: `Build the ${pretty(folder)} component from the task-based question set.`,
        starter: { 'App.jsx': starterJsx, ...(css.length ? { [css[0].file]: Object.values(solCss)[0] } : {}) },
        solution: { 'App.jsx': solJsx, ...solCss },
      })
      console.log(`ok ${folder}`)
    } catch (e) {
      console.log(`fail ${folder}: ${e.message}`)
    }
  }

  fs.writeFileSync('src/data/taskBased.json', JSON.stringify({ examples }, null, 2))
  console.log(`\nWrote ${examples.length} examples to src/data/taskBased.json`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
