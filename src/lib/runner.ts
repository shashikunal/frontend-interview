// Execution engine: Web Worker JS runner + sandboxed React/HTML iframe previews.
// Console protocol: messages shaped { t: 'log' | 'done' | 'error' | 'files', ... }.

import type { Question } from '../models/question'

export type LogLevel = 'log' | 'info' | 'warn' | 'error'

export interface RunMessage {
  t: 'log' | 'done' | 'error' | 'files' | 'dom'
  level?: LogLevel
  parts?: string[]
  files?: Record<string, string>
  ms?: number
  message?: string
  stack?: string
  hasDom?: boolean
}

export type Files = Record<string, string>

const FMT_SRC = `
function formatValue(v) {
  if (typeof v === 'string') return v;
  if (v instanceof Error) return v.stack || (v.name + ': ' + v.message);
  if (typeof v === 'function') return '[Function: ' + (v.name || 'anonymous') + ']';
  if (typeof v === 'bigint' || typeof v === 'symbol') return String(v);
  if (v === undefined) return 'undefined';
  try {
    const s = JSON.stringify(v, null, 2);
    return s === undefined ? String(v) : s;
  } catch (e) {
    return String(v);
  }
}
`

function buildJsWorkerSource(files: Files, code: string, postlude?: string): string {
  const filesJson = JSON.stringify(files)
  const codeJson = JSON.stringify(code)
  return `${FMT_SRC}
self.__files = ${filesJson};
const __post = (msg) => postMessage(msg);
const console = {
  log: (...a) => __post({ t: 'log', level: 'log', parts: a.map(formatValue) }),
  info: (...a) => __post({ t: 'log', level: 'info', parts: a.map(formatValue) }),
  warn: (...a) => __post({ t: 'log', level: 'warn', parts: a.map(formatValue) }),
  error: (...a) => __post({ t: 'log', level: 'error', parts: a.map(formatValue) }),
  debug: () => {},
};
const __eq = (a, b) => {
  if (a === b) return true;
  try { return JSON.stringify(a) === JSON.stringify(b); } catch (e) { return false; }
};
const __tests = [];
function check(name, fnOrValue, expected) {
  try {
    const actual = typeof fnOrValue === 'function' ? fnOrValue() : fnOrValue;
    const pass = __eq(actual, expected);
    __tests.push(pass);
    if (pass) console.log('\\u2713 ' + name);
    else console.log('\\u2717 ' + name + '  \\u2192  expected ' + formatValue(expected) + ', got ' + formatValue(actual));
  } catch (e) {
    __tests.push(false);
    console.log('\\u2717 ' + name + '  \\u2192  threw: ' + (e && e.message || e));
  }
}
function __summary() {
  if (!__tests.length) return;
  const passed = __tests.filter(Boolean).length;
  const total = __tests.filter(() => true).length;
  if (passed === total) console.log('\\u2705 ' + passed + '/' + total + ' tests passed');
  else console.log('\\u274C ' + passed + '/' + total + ' tests passed');
}
const fs = {
  readFileSync(p, enc) {
    if (!(p in self.__files)) throw new Error("ENOENT: no such file or directory '" + p + "'");
    return enc ? self.__files[p] : self.__files[p];
  },
  writeFileSync(p, data) {
    self.__files[p] = String(data);
    __post({ t: 'files', files: { ...self.__files } });
    return self.__files[p];
  },
  appendFileSync(p, data) {
    self.__files[p] = (self.__files[p] || '') + String(data);
    __post({ t: 'files', files: { ...self.__files } });
  },
  unlinkSync(p) {
    delete self.__files[p];
    __post({ t: 'files', files: { ...self.__files } });
  },
  existsSync(p) { return p in self.__files; },
  readdirSync() { return Object.keys(self.__files); },
  statSync(p) {
    if (!(p in self.__files)) throw new Error("ENOENT: " + p);
    const content = self.__files[p];
    return { size: content.length, isFile: () => true, isDirectory: () => false };
  },
};
const require = (name) => {
  if (name === 'fs') return fs;
  throw new Error("Module '" + name + "' is not available in the browser sandbox. Try 'fs'.");
};
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const __t0 = performance.now();
let __settled = false;
function __finish() {
  if (__settled) return;
  __settled = true;
  __post({ t: 'done', ms: Math.round(performance.now() - __t0) });
}
(async function () {
  const __src = ${codeJson};
  const fn = new AsyncFunction('require', 'fs', __src);
  await fn(require, fs);
  ${postlude ?? ''}
})().then(
  () => __finish(),
  (e) => {
    __post({ t: 'error', message: String(e && e.message || e), stack: e && e.stack });
    __finish();
  }
);
`
}

export interface JsRunnerHandlers {
  onLog: (level: LogLevel, parts: string[]) => void
  onFiles: (files: Files) => void
  onDone: (ms: number) => void
  onError: (message: string, stack?: string) => void
}

export class JsRunner {
  private worker: Worker | null = null
  private url: string | null = null

  run(files: Files, code: string, handlers: JsRunnerHandlers, opts?: { postlude?: string }): void {
    this.stop()
    this.url = URL.createObjectURL(new Blob([buildJsWorkerSource(files, code, opts?.postlude)], { type: 'text/javascript' }))
    const worker = new Worker(this.url)
    this.worker = worker
    worker.onmessage = (e: MessageEvent<RunMessage>) => {
      const m = e.data
      if (m.t === 'log') handlers.onLog(m.level ?? 'log', m.parts ?? [])
      else if (m.t === 'files') handlers.onFiles(m.files ?? {})
      else if (m.t === 'done') handlers.onDone(m.ms ?? 0)
      else if (m.t === 'error') handlers.onError(m.message ?? 'Unknown error', m.stack)
    }
    worker.onerror = e => {
      handlers.onError(e.message || 'Worker crashed')
      handlers.onDone(0)
    }
  }

  stop(): void {
    this.worker?.terminate()
    this.worker = null
    if (this.url) {
      URL.revokeObjectURL(this.url)
      this.url = null
    }
  }
}

// ---------- React preview (sandboxed iframe with Babel-transformed JSX) ----------

let babel: typeof import('@babel/standalone') | null = null

async function loadBabel() {
  if (!babel) {
    babel = await import('@babel/standalone')
  }
  return babel
}

function transformJsx(source: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = (babel as any).transform(source, {
    filename: 'App.jsx',
    presets: [['react', { runtime: 'classic' }]],
  })
  // The output is evaluated inside new Function(), so ESM syntax must be removed.
  return (result.code as string)
    .replace(/^\s*import[\s\S]*?from\s*['"][^'"]*['"];?[ \t]*$/gm, '')
    .replace(/^\s*import\s*['"][^'"]*['"];?[ \t]*$/gm, '')
    .replace(/^\s*export\s+default\s+/gm, '')
    .replace(/^\s*export\s+(?=(const|let|var|function|class)\b)/gm, '')
}

const REACT_VERSION = '19.2.0'

// React APIs we expose to user snippets. Destructuring a non-existent export
// just yields `undefined`, so an over-broad list is harmless.
const REACT_APIS = 'useState, useEffect, useRef, useMemo, useCallback, useReducer, useContext, createContext, createRef, Fragment, lazy, Suspense, memo, forwardRef, useLayoutEffect, useImperativeHandle, useId, useTransition, useDeferredValue'

// A permissive Proxy that stands in for any free variable the snippet never
// declares, so an illustrative fragment (which may reference props/state the
// data doesn't define) can still execute instead of throwing a ReferenceError.
// It produces no visible output of its own — we never fabricate data or UI.
const REACT_STUB = `const __stub = new Proxy(function(){}, { get: (t, p) => p === 'then' ? undefined : (p === Symbol.toPrimitive || p === 'toString' || p === 'valueOf') ? (() => '') : __stub, apply: () => __stub, construct: () => __stub });`

// Names we must NOT treat as missing/user variables when stubbing.
const STUB_KNOWN = new Set([
  'React', 'ReactDOM', 'useState', 'useEffect', 'useRef', 'useMemo', 'useCallback', 'useReducer',
  'useContext', 'useLayoutEffect', 'useImperativeHandle', 'useDebugValue', 'useId', 'useTransition',
  'useDeferredValue', 'createRef', 'Fragment', 'console', 'window', 'document', 'self', 'globalThis',
  'Math', 'JSON', 'Array', 'Object', 'String', 'Number', 'Boolean', 'Symbol', 'Promise', 'Map', 'Set',
  'Date', 'RegExp', 'Error', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'queueMicrotask',
  'fetch', 'alert', 'confirm', 'prompt', 'parseInt', 'parseFloat', 'isNaN', 'localStorage', 'sessionStorage',
  'navigator', '__stub', 'undefined', 'null', 'true', 'false', 'this', 'arguments', 'module', 'exports', 'require',
])
const STUB_KW = new Set('if for while return function const let var class new typeof instanceof of in do else switch case break continue await async yield export import from default extends super void delete try catch throw finally with as get set static into'.split(' '))

// Collect names declared by the snippet (top-level + destructured).
function collectDeclared(raw: string): string[] {
  const names: string[] = []
  let m: RegExpExecArray | null
  const re1 = /\b(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/g
  while ((m = re1.exec(raw))) names.push(m[1])
  const re2 = /\b(?:const|let|var)\s*[\[{][^}\]]*/g
  while ((m = re2.exec(raw))) {
    const inner = m[0].replace(/^[\[{]/, '').replace(/[\]}].*$/, '')
    ;(inner.match(/[A-Za-z_$][\w$]*/g) || []).forEach(n => names.push(n))
  }
  return names
}

// Free identifiers the snippet uses but never declares (and aren't globals).
function collectFree(raw: string): string[] {
  const declared = new Set(collectDeclared(raw))
  const used = new Set<string>()
  let m: RegExpExecArray | null
  const re = /\b[A-Za-z_$][\w$]*\b/g
  while ((m = re.exec(raw))) {
    const n = m[0]
    if (declared.has(n) || STUB_KNOWN.has(n) || STUB_KW.has(n)) continue
    used.add(n)
  }
  return [...used]
}

export async function buildReactSrcDoc(files: Files, entryFile: string, runId: number): Promise<string> {
  await loadBabel()
  const raw = files[entryFile] ?? ''
  const head = REACT_STUB + '\n' + `const { ${REACT_APIS} } = React;\n`
  const body = transformJsx(raw)

  const definesApp = /\b(function|const|let|var|class)\s+App\b/.test(raw)
  const callsRender = /createRoot|ReactDOM\.render|\brender\(/.test(raw)
  let transformed: string
  if (definesApp && !callsRender) {
    transformed = head + body + `\n;ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));`
  } else if (!callsRender) {
    // Bare fragment / one-liner (e.g. a React hook example). Wrap it in a
    // component so hooks run in a valid React context, stub any undefined
    // free variables so the snippet can evaluate, and render an empty
    // fragment. We never fabricate UI or sample data — snippets that define
    // but don't render/log simply show the parent's "no output" state.
    const free = collectFree(raw)
    const stubLines = free.map(n => `var ${n} = __stub;`).join('\n')
    const appBody = (stubLines ? stubLines + '\n' : '') + body
    transformed = `${head}\nfunction App() {\n${appBody}\nreturn React.createElement(React.Fragment, null);\n}\nReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));`
  } else {
    transformed = head + body
  }

  const cssFiles = Object.entries(files)
    .filter(([name]) => name.endsWith('.css'))
    .map(([, content]) => content)
    .join('\n')

  const shim = FMT_SRC + `
const __post = (msg) => parent.postMessage({ ...msg, runId: ${runId} }, '*');
console.log = (...a) => __post({ t: 'log', level: 'log', parts: a.map(formatValue) });
console.info = (...a) => __post({ t: 'log', level: 'info', parts: a.map(formatValue) });
console.warn = (...a) => __post({ t: 'log', level: 'warn', parts: a.map(formatValue) });
console.error = (...a) => __post({ t: 'log', level: 'error', parts: a.map(formatValue) });
window.addEventListener('error', e => __post({ t: 'error', message: e.message }));
window.addEventListener('unhandledrejection', e => __post({ t: 'error', message: String(e.reason) }));
function __hasDom() {
  const root = document.getElementById('root');
  if (!root) return false;
  return root.children.length > 0 || !!root.innerText.trim();
}

window.addEventListener('message', async (e) => {
  if (e.data && e.data.t === 'run_tests') {
    const testCases = e.data.testCases || [];
    const root = document.getElementById('root');
    const results = [];

    const helpers = {
      root,
      document,
      window,
      expect: (condition, msg) => {
        if (!condition) throw new Error(msg || 'Assertion failed');
      },
      wait: (ms) => new Promise(res => setTimeout(res, ms)),
      fireClick: (el) => {
        if (!el) throw new Error('Target element not found for click');
        el.click();
        el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      },
      fireInput: (el, val) => {
        if (!el) throw new Error('Target element not found for input');
        el.value = val;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      },
      getAll: (selector) => Array.from(document.querySelectorAll(selector)),
      getByText: (text) => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
        let node;
        while (node = walker.nextNode()) {
          if (node.innerText && node.innerText.includes(text)) return node;
        }
        return null;
      }
    };

    for (const tc of testCases) {
      const t0 = performance.now();
      try {
        const AsyncFn = Object.getPrototypeOf(async function(){}).constructor;
        const testFn = new AsyncFn('ctx', 'with(ctx) { ' + tc.assertion + ' }');
        await testFn(helpers);
        results.push({
          id: tc.id,
          name: tc.name,
          description: tc.description,
          status: 'passed',
          durationMs: Math.max(1, Math.round(performance.now() - t0))
        });
      } catch (err) {
        results.push({
          id: tc.id,
          name: tc.name,
          description: tc.description,
          status: 'failed',
          durationMs: Math.max(1, Math.round(performance.now() - t0)),
          error: err && err.message ? err.message : String(err)
        });
      }
    }

    __post({ t: 'test_results', results });
  }
});
`

  const moduleScript = `import React from 'https://esm.sh/react@${REACT_VERSION}';
import ReactDOM from 'https://esm.sh/react-dom@${REACT_VERSION}/client';
try {
  const __src = ${JSON.stringify(transformed)};
  const fn = new Function('React', 'ReactDOM', __src);
  fn(React, ReactDOM);
  setTimeout(() => {
    __post({ t: 'dom', hasDom: __hasDom() });
    __post({ t: 'done', ms: 0 });
  }, 120);
} catch (e) {
  __post({ t: 'error', message: String(e && e.message || e), stack: e && e.stack });
  try { __post({ t: 'dom', hasDom: false }); } catch (_) {}
  __post({ t: 'done', ms: 0 });
}`

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 16px; background: #fff; color: #171717; }
</style>
<style>${cssFiles}</style>
<script>${shim}</script>
</head>
<body>
<div id="root"></div>
<script type="module">${moduleScript}</script>
</body>
</html>`
}

export function languageForFile(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'js': return 'javascript'
    case 'jsx': return 'javascript'
    case 'ts': return 'typescript'
    case 'tsx': return 'typescript'
    case 'css': return 'css'
    case 'html': return 'html'
    case 'json': return 'json'
    case 'md': return 'markdown'
    default: return 'plaintext'
  }
}

export function isReactWorkspace(files: Files): boolean {
  return Object.keys(files).some(name => name.endsWith('.jsx') || name.endsWith('.tsx'))
}

// Heuristic for a single code string: does it look like React/JSX so it
// should run in the React iframe rather than the plain-JS sandbox?
export function isReactCode(code: string): boolean {
  return (
    /\bfrom\s+['"]react['"]/.test(code) ||
    /\bReact\b/.test(code) ||
    /\b(useState|useEffect|useMemo|useCallback|useRef|useReducer|useContext|useLayoutEffect|useImperativeHandle|useDebugValue|useId|useTransition|useDeferredValue|createRoot|ReactDOM)\b/.test(code) ||
    /<\/?[A-Za-z][\w.-]*(\s|>|\/)/.test(code)
  )
}

// A "browser project" (e.g. JS Assignments) carries a full HTML document in
// `example` and the editable script in `code`. It must run in a DOM iframe,
// not the Node worker.
export function isHtmlWorkspace(q: Pick<Question, 'source' | 'example' | 'code'>): boolean {
  return (
    q.source === 'JS Assignments' ||
    (!!q.code && !!q.example && /^<!doctype html|<html[\s>]/i.test(q.example.trim()))
  )
}

// Builds a sandboxed iframe document: the starter HTML with the user's JS
// injected before </body>, plus a console shim that forwards logs to the parent.
export function buildHtmlSrcDoc(html: string, jsCode: string, runId: number): string {
  const shim = FMT_SRC + `
const __t0 = performance.now();
const __post = (msg) => parent.postMessage({ ...msg, runId: ${runId} }, '*');
console.log = (...a) => __post({ t: 'log', level: 'log', parts: a.map(formatValue) });
console.info = (...a) => __post({ t: 'log', level: 'info', parts: a.map(formatValue) });
console.warn = (...a) => __post({ t: 'log', level: 'warn', parts: a.map(formatValue) });
console.error = (...a) => __post({ t: 'log', level: 'error', parts: a.map(formatValue) });
window.addEventListener('error', e => __post({ t: 'error', message: e.message, stack: e.error && e.error.stack }));
window.addEventListener('unhandledrejection', e => __post({ t: 'error', message: String(e.reason) }));
function __finish(){ __post({ t: 'done', ms: Math.round(performance.now() - __t0) }); }
if (document.readyState === 'complete' || document.readyState === 'interactive') setTimeout(__finish, 60);
else window.addEventListener('DOMContentLoaded', () => setTimeout(__finish, 60));
`

  let doc = html
  if (/<\/head>/i.test(doc)) {
    doc = doc.replace(/<head>/i, `<head>\n<script>${shim}</script>`)
  } else if (/<head\b[^>]*>/i.test(doc)) {
    doc = doc.replace(/<head[^>]*>/i, m => `${m}\n<script>${shim}</script>`)
  } else {
    doc = `<script>${shim}</script>\n${doc}`
  }

  if (/<\/body>/i.test(doc)) {
    doc = doc.replace(/<\/body>/i, `<script>${jsCode}</script>\n</body>`)
  } else {
    doc = `${doc}\n<script>${jsCode}</script>`
  }
  return doc
}

// Builds a sandboxed browser iframe that runs plain JS with full DOM access
// (document/window/etc.), a live preview of the rendered DOM, and a console
// shim that forwards logs/errors to the parent window.
export function buildJsSrcDoc(jsCode: string, runId: number): string {
  const shim = FMT_SRC + `
const __t0 = performance.now();
const __post = (msg) => parent.postMessage({ ...msg, runId: ${runId} }, '*');
console.log = (...a) => __post({ t: 'log', level: 'log', parts: a.map(formatValue) });
console.info = (...a) => __post({ t: 'log', level: 'info', parts: a.map(formatValue) });
console.warn = (...a) => __post({ t: 'log', level: 'warn', parts: a.map(formatValue) });
console.error = (...a) => __post({ t: 'log', level: 'error', parts: a.map(formatValue) });
window.addEventListener('error', e => __post({ t: 'error', message: e.message, stack: e.error && e.error.stack }));
window.addEventListener('unhandledrejection', e => __post({ t: 'error', message: String(e.reason) }));
function __hasDom() {
  const app = document.getElementById('app');
  if (app && (app.children.length > 0 || app.innerText.trim())) return true;
  const extra = [...document.body.children].filter(el => el.tagName !== 'SCRIPT' && el.id !== 'app');
  if (extra.length > 0) return true;
  return !!document.body.innerText.trim();
}
function __finish(){ __post({ t: 'done', ms: Math.round(performance.now() - __t0) }); }
(async () => {
  try {
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    const __src = ${JSON.stringify(jsCode)};
    const __fn = new AsyncFunction(__src);
    await __fn();
  } catch (__e) {
    __post({ t: 'error', message: String(__e && __e.message || __e), stack: __e && __e.stack });
  } finally {
    setTimeout(() => {
      try { __post({ t: 'dom', hasDom: __hasDom() }); } catch (e) {}
      __finish();
    }, 80);
  }
})();
`
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 16px; background: #fff; color: #171717; }</style>
</head>
<body>
<div id="app"></div>
<script>${shim}</script>
</body>
</html>`
}
