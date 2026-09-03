import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react'
import { Link, useParams } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { getById } from '../../data/questionService'
import { useQuestions } from '../../data/useQuestions'
import {
  JsRunner,
  buildReactSrcDoc,
  buildHtmlSrcDoc,
  isReactWorkspace,
  isHtmlWorkspace,
  languageForFile,
  type Files,
  type LogLevel,
} from '../../lib/runner'
import { generateChallenge } from '../../lib/challenges'
import { buildStarters, isOutputTracing } from '../../lib/starter'
import Terminal from './Terminal'
import { makeLine, type TermLine } from './termLine'
import './Workspace.css'

interface CustomProblem {
  title: string
  instructions: string
  solution?: string
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

// Bump when starter generation changes so stale saved workspaces are regenerated.
const WORKSPACE_SCHEMA = 2

interface SavedWorkspace {
  v: number
  files: Files
  activeFile: string
  custom?: CustomProblem | null
}

export default function Workspace() {
  const { id } = useParams<{ id: string }>()
  const { resolvedTheme } = useTheme()
  const { questions, loading } = useQuestions()
  const question = useMemo(() => getById(questions, Number(id)), [questions, id])

  const [files, setFiles] = useState<Files>({})
  const [activeFile, setActiveFile] = useState('')
  const [ready, setReady] = useState(false)
  const [running, setRunning] = useState(false)
  const [panelTab, setPanelTab] = useState<'problem' | 'solution'>('problem')
  const [lines, setLines] = useState<TermLine[]>([])
  const [previewDoc, setPreviewDoc] = useState('')
  const [runId, setRunId] = useState(0)
  const [custom, setCustom] = useState<CustomProblem | null>(null)
  const [expected, setExpected] = useState<string[] | null>(null)

  const runnerRef = useRef<JsRunner>(new JsRunner())
  const graderRef = useRef<JsRunner>(new JsRunner())
  const handlersRef = useRef<(m: MessageEvent) => void>(() => {})

  const pushLine = useCallback((kind: TermLine['kind'], text: string) => {
    setLines(prev => [...prev.slice(-400), makeLine(kind, text)])
  }, [])

  // load persisted workspace or defaults
  useEffect(() => {
    if (!question) return
    setReady(false)
    graderRef.current.stop()
    const key = `workspace-v2-${question.id}`
    const saved = localStorage.getItem(key)
    let next: Files
    let active: string
    let savedData: SavedWorkspace | null = null
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as SavedWorkspace
        if (parsed && parsed.v === WORKSPACE_SCHEMA && parsed.files && Object.keys(parsed.files).length > 0) {
          savedData = parsed
        }
      } catch {
        savedData = null
      }
    }
    if (savedData) {
      next = savedData.files
      active = savedData.activeFile in next ? savedData.activeFile : Object.keys(next)[0]
      setCustom(savedData.custom ?? null)
    } else {
      next = buildStarters(question)
      active = Object.keys(next)[0]
      setCustom(null)
    }
    setFiles(next)
    setActiveFile(active)
    setLines([
      makeLine(
        'system',
        savedData?.custom
          ? `Restored your generated problem \u2014 ${savedData.custom.title}. Press Run to check tests.`
          : savedData
            ? `Workspace restored \u2014 ${Object.keys(next).length} file(s) from your last session.`
            : `Workspace loaded \u2014 ${Object.keys(next).length} file(s). Press Run to execute.`
      ),
    ])
    setPreviewDoc('')

    // hidden reference pass: capture the snippet's expected console output for grading
    // (skipped for generated/custom problems \u2014 they carry their own tests)
    if (!savedData?.custom && question.category !== 'ReactJS' && isOutputTracing(question.code) && question.code) {
      const collected: string[] = []
      graderRef.current.run({}, question.code, {
        onLog: (_level, parts) => collected.push(parts.join(' ').trim()),
        onFiles: () => {},
        onDone: () => {
          const lines = collected.filter(l => l.length > 0)
          setExpected(lines.length > 0 ? lines : null)
        },
        onError: () => setExpected(null),
      })
    } else {
      setExpected(null)
    }

    setReady(true)
  }, [question])

  useEffect(() => {
    if (!question || !ready) return
    const payload: SavedWorkspace = { v: WORKSPACE_SCHEMA, files, activeFile: activeFile, custom }
    localStorage.setItem(`workspace-v2-${question.id}`, JSON.stringify(payload))
  }, [files, activeFile, question, ready, custom])

  useEffect(() => () => {
    runnerRef.current.stop()
    graderRef.current.stop()
  }, [])

  // iframe message channel
  useEffect(() => {
    const listener = (e: MessageEvent) => handlersRef.current(e)
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [])

  const handleLog = useCallback((level: LogLevel, parts: string[]) => {
    pushLine(level === 'log' ? 'log' : level, parts.join(' '))
  }, [pushLine])

  const gradeRun = useCallback((collected: string[]) => {
    if (custom || !expected || expected.length === 0) return
    const actual = collected.map(l => l.trim()).filter(l => l.length > 0)
    const matched = expected.every((line, i) => line === actual[i]) && actual.length === expected.length
    if (matched) {
      pushLine('system', `\u2705 Graded: output matches \u2014 all ${expected.length} line(s) correct!`)
      return
    }
    pushLine('system', `\u274C Graded: ${actual.length} line(s) logged vs ${expected.length} expected.`)
    const first = expected.findIndex((line, i) => actual[i] !== line)
    if (first >= 0 && first < actual.length) {
      pushLine('system', `First difference at line ${first + 1}:`)
      pushLine('system', `  expected: ${expected[first]}`)
      pushLine('system', `  yours:    ${actual[first]}`)
    } else if (actual.length < expected.length) {
      pushLine('system', 'Your code logged fewer lines than the snippet should \u2014 did you remove any?')
    }
    pushLine('system', 'Adjust your prediction or logic and Run again.')
  }, [custom, expected, pushLine])

  const runJs = useCallback((codeOverride?: string, grade = false) => {
    setRunning(true)
    setPreviewDoc('')
    const collected: string[] = []
    runnerRef.current.run(files, codeOverride ?? files[activeFile] ?? '', {
      onLog: (level, parts) => {
        handleLog(level, parts)
        collected.push(parts.join(' ').trim())
      },
      onFiles: updated => {
        setFiles(prev => ({ ...prev, ...updated }))
      },
      onDone: ms => {
        setRunning(false)
        if (ms > 0) pushLine('system', `Finished in ${ms}ms`)
        if (grade && !codeOverride) gradeRun(collected)
      },
      onError: (message, stack) => {
        setRunning(false)
        pushLine('error', stack && stack.split('\n').length < 6 ? stack : message)
        if (grade && !codeOverride) pushLine('system', 'Grading skipped \u2014 fix the runtime error first.')
      },
    })
  }, [files, activeFile, handleLog, pushLine, gradeRun])

  const runReact = useCallback(async () => {
    setRunning(true)
    setPreviewDoc('')
    try {
      const nextRunId = runId + 1
      setRunId(nextRunId)
      handlersRef.current = (e: MessageEvent) => {
        const m = e.data
        if (!m || m.runId !== nextRunId) return
        if (m.t === 'log') handleLog(m.level, m.parts)
        else if (m.t === 'error') {
          setRunning(false)
          pushLine('error', m.stack && m.stack.length < 500 ? m.stack : m.message)
        } else if (m.t === 'done' && !running) {
          setRunning(false)
        }
      }
      const entry = Object.keys(files).find(n => n.endsWith('.jsx') || n.endsWith('.tsx')) ?? 'App.jsx'
      const doc = await buildReactSrcDoc(files, entry, nextRunId)
      setPreviewDoc(doc)
      setTimeout(() => setRunning(false), 4000)
    } catch (e) {
      setRunning(false)
      pushLine('error', e instanceof Error ? e.message : String(e))
    }
  }, [files, runId, handleLog, pushLine, running])

  const runHtml = useCallback(() => {
    if (!question || !question.example) {
      pushLine('error', 'This assignment has no previewable HTML.')
      return
    }
    setRunning(true)
    setPreviewDoc('')
    const nextRunId = runId + 1
    setRunId(nextRunId)
    handlersRef.current = (e: MessageEvent) => {
      const m = e.data
      if (!m || m.runId !== nextRunId) return
      if (m.t === 'log') handleLog(m.level, m.parts)
      else if (m.t === 'error') {
        setRunning(false)
        pushLine('error', m.stack && m.stack.length < 500 ? m.stack : m.message)
      } else if (m.t === 'done') {
        setRunning(false)
      }
    }
    const doc = buildHtmlSrcDoc(question.example, files['script.js'] ?? '', nextRunId)
    setPreviewDoc(doc)
    setTimeout(() => setRunning(false), 5000)
  }, [question, files, runId, handleLog, pushLine])

  const handleRun = useCallback(() => {
    if (!activeFile || !ready || !question) return
    if (isHtmlWorkspace(question)) runHtml()
    else if (isReactWorkspace(files)) void runReact()
    else runJs(undefined, !custom && activeFile === 'main.js')
  }, [activeFile, ready, files, custom, question, runHtml, runReact, runJs])

  const handleStop = useCallback(() => {
    runnerRef.current.stop()
    setRunning(false)
    setPreviewDoc('')
    pushLine('system', 'Execution stopped.')
  }, [pushLine])

  const handleEvaluate = useCallback((expr: string) => {
    pushLine('input', expr)
    const wrapped = `
const __src = ${JSON.stringify(expr)};
const __AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
try {
  const __fn = new __AsyncFunction('require', 'fs', 'return (' + __src + ')');
  const __r = await __fn(require, fs);
  console.log(__r);
} catch (__e) {
  if (__e instanceof SyntaxError) {
    const __st = new __AsyncFunction('require', 'fs', __src);
    await __st(require, fs);
  } else {
    throw __e;
  }
}`
    runJs(wrapped)
  }, [pushLine, runJs])

  const handleEditorChange = useCallback((value: string | undefined) => {
    setFiles(prev => ({ ...prev, [activeFile]: value ?? '' }))
  }, [activeFile])

  const addFile = useCallback(() => {
    const name = window.prompt('New file name (e.g. utils.js)', '')
    if (!name || files[name] !== undefined) return
    setFiles(prev => ({ ...prev, [name]: '' }))
    setActiveFile(name)
  }, [files])

  const renameFile = useCallback((oldName: string) => {
    const name = window.prompt('Rename file', oldName)
    if (!name || name === oldName || files[name] !== undefined) return
    setFiles(prev => {
      const next: Files = {}
      for (const [k, v] of Object.entries(prev)) next[k === oldName ? name : k] = v
      return next
    })
    setActiveFile(name)
  }, [files])

  const deleteFile = useCallback((name: string) => {
    if (Object.keys(files).length <= 1) return
    setFiles(prev => {
      const next = { ...prev }
      delete next[name]
      return next
    })
    if (activeFile === name) setActiveFile(Object.keys(files).find(f => f !== name) ?? '')
  }, [files, activeFile])

  const newProblem = useCallback(() => {
    const gen = generateChallenge(Date.now() ^ Math.floor(Math.random() * 0xffffffff))
    setFiles({ 'main.js': gen.starter })
    setActiveFile('main.js')
    setCustom({ title: gen.title, instructions: gen.instructions, solution: gen.solution, difficulty: gen.difficulty })
    setPreviewDoc('')
    runnerRef.current.stop()
    setRunning(false)
    setLines([
      makeLine('system', `New problem generated: ${gen.title} \u2014 saved to this workspace, so it survives reloads. Implement the function and press Run to check tests.`),
    ])
  }, [])

  const reset = useCallback(() => {
    if (!question) return
    if (!window.confirm('Reset workspace to the original starter files?')) return
    localStorage.removeItem(`workspace-v2-${question.id}`)
    setReady(false)
    const next = buildStarters(question)
    setFiles(next)
    setActiveFile(Object.keys(next)[0])
    setCustom(null)
    setLines([makeLine('system', 'Workspace reset.')])
    setPreviewDoc('')
    setReady(true)
  }, [question])

  const onMount: OnMount = editor => {
    editor.focus()
  }

  const copyCode = useCallback((code: string) => {
    navigator.clipboard?.writeText(code)
    pushLine('system', 'Solution copied to clipboard.')
  }, [pushLine])

  const loadSolution = useCallback((code: string) => {
    if (!question) return
    if (!window.confirm('Replace the current editor contents with the reference solution?')) return
    const entry = isHtmlWorkspace(question)
      ? (Object.keys(files).find(n => n.endsWith('.js')) ?? 'script.js')
      : isReactWorkspace(files)
        ? (Object.keys(files).find(n => n.endsWith('.jsx') || n.endsWith('.tsx')) ?? 'App.jsx')
        : 'main.js'
    setFiles(prev => ({ ...prev, [entry]: code }))
    setActiveFile(entry)
    pushLine('system', 'Loaded reference solution into the editor — press Run to see it work.')
  }, [files, question, pushLine])

  if (loading) {
    return (
      <div className="workspace-loading">
        <div className="skeleton skeleton-line" style={{ width: '60%' }} />
        <div className="skeleton" style={{ height: 320 }} />
      </div>
    )
  }

  if (!question) {
    return (
      <div className="not-found">
        <h2>Challenge not found</h2>
        <Link to="/coding" className="btn btn-primary">Back to Challenges</Link>
      </div>
    )
  }

  const reactMode = isReactWorkspace(files)
  const htmlMode = isHtmlWorkspace(question)
  const previewMode = reactMode || htmlMode

  return (
    <div className="workspace page-enter">
      <aside className="problem-panel">
        <div className="problem-head">
          {custom && <span className="badge badge-generated">Generated</span>}
          {!custom && expected && !reactMode && <span className="badge badge-generated">Auto-graded</span>}
          <span className={`badge badge-category cat-${question.category.toLowerCase().replace(/[^a-z]+/g, '-')}`}>{custom ? 'Practice' : question.category}</span>
          <span className={`badge badge-${(custom?.difficulty ?? question.difficulty).toLowerCase()}`}>{custom?.difficulty ?? question.difficulty}</span>
        </div>

        <div className="panel-tabs">
          <button
            className={`panel-tab ${panelTab === 'problem' ? 'active' : ''}`}
            onClick={() => setPanelTab('problem')}
          >
            Problem
          </button>
          <button
            className={`panel-tab ${panelTab === 'solution' ? 'active' : ''}`}
            onClick={() => setPanelTab('solution')}
          >
            Solution
          </button>
        </div>

        {panelTab === 'problem' ? (
          <>
            {custom ? (
              <>
                <p className="problem-text">{custom.title}</p>
                <p className="problem-instructions">{custom.instructions}</p>
              </>
            ) : (
              <p className="problem-text">{question.question}</p>
            )}

            {htmlMode && (
              <div className="problem-hint">
                Browser project — press Run to render the page live. Edit <code>script.js</code> to
                change behavior; the styles are loaded automatically.
              </div>
            )}
            {reactMode && (
              <div className="problem-hint">
                React workspace — press Run to compile JSX and render a live preview.
              </div>
            )}
            {!reactMode && !htmlMode && expected && (
              <div className="problem-hint">
                <strong>Auto-graded.</strong> Press Run and your console output is compared against the
                hidden expected result for this snippet. Tweak the code to explore, then match it.
              </div>
            )}
            {!reactMode && !htmlMode && !expected && (
              <div className="problem-hint">
                Sandbox includes Node-style <code>fs</code>: readFileSync, writeFileSync, readdirSync,
                existsSync, unlinkSync. Create &amp; read files across your workspace tabs.
              </div>
            )}
          </>
        ) : (
          <div className="solution-content">
            {custom ? (
              <>
                <p className="answer-text">
                  Generated challenges are solved by implementing the function so the bundled tests pass.
                  Here is one correct reference solution — study it, then implement your own and press Run to check the tests.
                </p>
                {custom.solution && (
                  <div className="solution-block">
                    <div className="solution-block-head">
                      <h4 className="solution-label">Reference Solution</h4>
                      <div className="solution-block-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => copyCode(custom.solution!)}>Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => loadSolution(custom.solution!)}>Load into editor</button>
                      </div>
                    </div>
                    <pre className="solution-code"><code>{custom.solution}</code></pre>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="answer-text">{question.answer}</p>
                {question.code && (
                  <div className="solution-block">
                    <div className="solution-block-head">
                      <h4 className="solution-label">Reference Solution</h4>
                      <div className="solution-block-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => copyCode(question.code!)}>Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => loadSolution(question.code!)}>Load into editor</button>
                      </div>
                    </div>
                    <pre className="solution-code"><code>{question.code}</code></pre>
                  </div>
                )}
                {question.example && question.example !== question.code && (
                  <div className="solution-block">
                    <div className="solution-block-head">
                      <h4 className="solution-label">Example</h4>
                      <button className="btn btn-secondary btn-sm" onClick={() => copyCode(question.example!)}>Copy</button>
                    </div>
                    <pre className="solution-code"><code>{question.example}</code></pre>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </aside>

      <section className="work-main">
        <div className="work-toolbar">
          <div className="file-tabs">
            {Object.keys(files).map(name => (
              <span
                key={name}
                className={`file-tab ${name === activeFile ? 'active' : ''}`}
                onClick={() => setActiveFile(name)}
                onDoubleClick={() => renameFile(name)}
                title={`${name} — double-click to rename`}
              >
                {name}
                {Object.keys(files).length > 1 && (
                  <button
                    className="tab-close"
                    aria-label={`Close ${name}`}
                    onClick={e => {
                      e.stopPropagation()
                      deleteFile(name)
                    }}
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
            <button className="tab-add" onClick={addFile} aria-label="New file">+</button>
          </div>
          <div className="run-actions">
            <span className="mode-chip">{previewMode ? (htmlMode ? 'HTML Preview' : 'React Preview') : expected ? 'Node Sandbox · Auto-graded' : 'Node Sandbox'}</span>
            <button className="btn btn-secondary btn-sm" onClick={newProblem} title="Generate a fresh random problem with tests">
              ⚡ New Problem
            </button>
            <button className="btn btn-secondary btn-sm" onClick={reset}>Reset</button>
            {running ? (
              <button className="btn btn-danger btn-sm" onClick={handleStop}>Stop</button>
            ) : null}
            <button className="btn btn-primary btn-sm" onClick={handleRun} disabled={!ready}>
              ▶ Run
            </button>
          </div>
        </div>

        <div className={`editor-split ${previewMode ? 'with-preview' : ''}`}>
          <div className="editor-holder">
            <Editor
              key={activeFile}
              height="100%"
              language={languageForFile(activeFile)}
              value={files[activeFile] ?? ''}
              onChange={handleEditorChange}
              onMount={onMount}
              theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
              loading={<div className="skeleton" style={{ width: '100%', height: '100%' }} />}
              options={{
                minimap: { enabled: false },
                fontSize: 13.5,
                fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                fontLigatures: true,
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                padding: { top: 14 },
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>
          {previewMode && (
            <div className="preview-holder">
              <div className="preview-label">Live Preview</div>
              {previewDoc ? (
                <iframe
                  key={runId}
                  className="preview-frame"
                  sandbox="allow-scripts"
                  srcDoc={previewDoc}
                  title={htmlMode ? 'HTML preview' : 'React preview'}
                />
              ) : (
                <div className="preview-empty">Press Run to render your {htmlMode ? 'page' : 'App'}.</div>
              )}
            </div>
          )}
        </div>

        <Terminal lines={lines} running={running} onEvaluate={handleEvaluate} />
      </section>
    </div>
  )
}
