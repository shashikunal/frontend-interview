// Per-question dynamic starter files + output-tracing detection.
// Starters are derived from the question's own snippet instead of boilerplate.

import type { Files } from './runner'

export interface QuestionSeed {
  question?: string
  code?: string
  category?: string
  example?: string
  source?: string
}

const ENV_DEPENDENT =
  /\b(document|window)\s*[.[]|\bfetch\s*\(|addEventListener|\blocalStorage\b|\bsessionStorage\b|requestAnimationFrame|\balert\s*\(|\bconfirm\s*\(|\bprompt\s*\(|setTimeout|setInterval|\bnavigator\b/

export function isOutputTracing(code?: string): boolean {
  return !!code && code.trim().length > 0 && !ENV_DEPENDENT.test(code)
}

// Comment-prefix every line so multi-line question text stays inside a
// single-line comment block instead of leaking into live code.
function commentLines(text: string): string[] {
  return text.split('\n').map(l => '// ' + l)
}

function jsStarter(questionText: string, seedCode: string): Files {
  const main = [
    '// ─── Auto-generated workspace · graded against hidden expected output ───',
    ...commentLines(questionText),
    '//',
    '// 1. Read the snippet below and predict what it logs.',
    "// 2. Write your guess in the 'your prediction' section.",
    '// 3. Press Run — your console output is compared to the expected result.',
    '',
    seedCode,
    '',
    '// --- your prediction (uncomment and edit, or add your own logs) ---',
    "// console.log('my prediction: ...')",
    '',
  ].join('\n')
  return { 'main.js': main }
}

function jsReferenceStarter(questionText: string, seedCode: string): Files {
  const reference = `// Reference snippet from the challenge:\n${commentLines(questionText).join('\n')}\n\n${seedCode}\n`
  const main = [
    ...commentLines(questionText),
    '//',
    "// This snippet uses browser APIs that aren't available in the Node sandbox.",
    '// See the "snippet.js" tab for the original example, then reproduce or adapt it here.',
    "// You can stub the pieces you need, e.g.:",
    "//   const document = { querySelector: () => ({ classList: { add() {}, toggle() {} } }) }",
    '',
    "console.log('TODO: explore this challenge');",
    '',
  ].join('\n')
  return { 'main.js': main, 'snippet.js': reference }
}

const REACT_STYLES = `.app-card {
  font-family: system-ui;
  max-width: 420px;
  margin: 40px auto;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
}
.app-card button {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: #6366f1;
  color: #fff;
  cursor: pointer;
}
`

function stripModuleSyntax(src: string): string {
  return src
    .replace(/^[ \t]*import[^\n]*;?[ \t]*\n?/gm, '')
    .replace(/^[ \t]*export[ \t]+default[ \t]+/gm, '')
    .replace(/^[ \t]*export[ \t]+(?=(const|let|var|function|class)\b)/gm, '')
}

function themedReactApp(questionText: string): string {
  return `function App() {\n  const [count, setCount] = useState(0)\n\n  return (\n    <div className="app-card">\n      <h2>${questionText.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}</h2>\n      <p>Recreate the concept from this challenge as live components.</p>\n      <button onClick={() => setCount(c => c + 1)}>Clicked {count} times</button>\n    </div>\n  )\n}\n`
}

export function reactStarterFiles(questionText: string, seedCode?: string): Files {
  const jsx = seedCode?.trim()
  if (!jsx || !/<[A-Za-z/]/.test(jsx)) {
    return { 'App.jsx': themedReactApp(questionText), 'styles.css': REACT_STYLES }
  }

  const clean = stripModuleSyntax(jsx)
  if (/\b(const|function|class)[ \t]+App\b/.test(clean)) {
    return { 'App.jsx': `${clean}\n`, 'styles.css': REACT_STYLES }
  }

  const named = clean.match(/\b(?:function|const|let|class)[ \t]+([A-Z][A-Za-z0-9_]*)/)
  if (named) {
    const app = `${clean}\n\nfunction App() {\n  return (\n    <div className="app-card">\n      <${named[1]} />\n    </div>\n  )\n}\n`
    return { 'App.jsx': app, 'styles.css': REACT_STYLES }
  }

  return {
    'App.jsx': themedReactApp(questionText),
    'snippet.jsx': `// Original snippet from the challenge:\n${jsx}\n`,
    'styles.css': REACT_STYLES,
  }
}

export function buildStarters(seed: QuestionSeed): Files {
  const questionText = seed.question?.trim() || 'Coding challenge'
  if (seed.category === 'ReactJS') {
    return reactStarterFiles(questionText, seed.code)
  }
  // Browser/DOM "build this project" assignments: the editable part is the
  // script, and the HTML page is rendered live in an iframe preview.
  if (
    (seed.source === 'JS Assignments' || (seed.example && /^<!doctype html|<html[\s>]/i.test(seed.example.trim()))) &&
    seed.code
  ) {
    return { 'script.js': seed.code }
  }
  if (isOutputTracing(seed.code) && seed.code) {
    return jsStarter(questionText, seed.code)
  }
  if (seed.code) {
    return jsReferenceStarter(questionText, seed.code)
  }
  return {
    'main.js': `${commentLines(questionText).join('\n')}\n// The Node-style 'fs' module works here \u2014 try:\n//   fs.writeFileSync('out.txt', 'hello'); console.log(fs.readdirSync());\n\nconsole.log('Hello from the sandbox!');\n`,
    'data.txt': 'sample data line one\nsample data line two\n',
  }
}
