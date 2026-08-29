import { useState, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { type Files, buildReactSrcDoc, languageForFile } from '../../lib/runner'
import { taskExamples, type TaskExample } from '../../data/taskBased'
import SplitPane from '../common/SplitPane'
import BrowserPreview from '../common/BrowserPreview'
import './TaskBasedPanel.css'

export default function TaskBasedPanel() {
  const [activeId, setActiveId] = useState(taskExamples[0]?.id ?? '')
  const example: TaskExample | undefined = taskExamples.find(e => e.id === activeId)

  const [files, setFiles] = useState<Files>(example?.starter ?? {})
  const [activeFile, setActiveFile] = useState(Object.keys(example?.starter ?? {}).pop() ?? 'App.jsx')
  const [previewDoc, setPreviewDoc] = useState('')
  const [lines, setLines] = useState<string[]>([])
  const [running, setRunning] = useState(false)
  const [hasDom, setHasDom] = useState<boolean | null>(null)
  const [hasLog, setHasLog] = useState(false)

  const runIdRef = useRef(0)
  const handlersRef = useRef<(e: MessageEvent) => void>(() => {})

  useEffect(() => {
    const listener = (e: MessageEvent) => handlersRef.current(e)
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [])

  useEffect(() => {
    if (!example) return
    setFiles(example.starter)
    setActiveFile(Object.keys(example.starter).pop() ?? 'App.jsx')
    setPreviewDoc('')
    setLines([])
    setHasDom(null)
    setHasLog(false)
  }, [activeId]) // eslint-disable-line react-hooks/exhaustive-deps

  const run = async () => {
    if (!example) return
    const id = ++runIdRef.current
    setRunning(true)
    setLines([])
    setHasDom(null)
    setHasLog(false)
    handlersRef.current = (e: MessageEvent) => {
      const m = e.data
      if (!m || m.runId !== id) return
      if (m.t === 'log') { setHasLog(true); setLines(prev => [...prev, (m.parts ?? []).join(' ')]) }
      else if (m.t === 'dom') setHasDom(m.hasDom ?? false)
      else if (m.t === 'error') {
        setLines(prev => [...prev, m.stack || m.message])
        setRunning(false)
      } else if (m.t === 'done') setRunning(false)
    }
    const entry = Object.keys(files).find(n => n.endsWith('.jsx') || n.endsWith('.tsx')) ?? activeFile
    try {
      const doc = await buildReactSrcDoc(files, entry, id)
      setPreviewDoc(doc)
    } catch (err) {
      setLines(prev => [...prev, err instanceof Error ? err.message : String(err)])
      setRunning(false)
    }
    setTimeout(() => setRunning(false), 4000)
  }

  const loadFiles = (next: Files) => {
    setFiles(next)
    setActiveFile(Object.keys(next).pop() ?? 'App.jsx')
    setPreviewDoc('')
    setLines([])
  }

  if (!example) {
    return <div className="task-based"><p>No task-based examples available.</p></div>
  }

  return (
    <div className="task-based">
      <div className="tb-sidebar">
        <h3>Task-Based</h3>
        <ul className="tb-list">
          {taskExamples.map(ex => (
            <li key={ex.id}>
              <button
                className={`tb-item ${ex.id === activeId ? 'active' : ''}`}
                onClick={() => setActiveId(ex.id)}
              >
                {ex.title}
              </button>
            </li>
          ))}
        </ul>
        <p className="tb-desc">{example.description}</p>
      </div>

      <div className="tb-main">
        <div className="tb-toolbar">
          <div className="tb-filetabs">
            {Object.keys(files).map(name => (
              <button
                key={name}
                className={`tb-filetab ${name === activeFile ? 'active' : ''}`}
                onClick={() => setActiveFile(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="tb-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => loadFiles(example.starter)}>Reset</button>
            <button className="btn btn-secondary btn-sm" onClick={() => loadFiles(example.solution)}>Show Solution</button>
            <button className="btn btn-primary btn-sm" onClick={run} disabled={running}>
              {running ? 'Running…' : 'Execute'}
            </button>
          </div>
        </div>

        <SplitPane
          className="tb-split tall"
          left={
            <div className="tb-pane tb-pane-left">
              <div className="tb-editor">
                <Editor
                  height="100%"
                  language={languageForFile(activeFile)}
                  value={files[activeFile] ?? ''}
                  onChange={value => setFiles(prev => ({ ...prev, [activeFile]: value ?? '' }))}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13.5,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                  }}
                />
              </div>
            </div>
          }
          right={
            <div className="tb-pane tb-pane-right">
                <div className="tb-preview">
                  <div className="tb-preview-label">Preview</div>
                  {hasDom === false ? (
                    <div className="tb-preview-empty">{hasLog ? 'No DOM output — see Console below.' : 'Ran successfully — no output produced.'}</div>
                  ) : previewDoc ? (
                    <BrowserPreview srcDoc={previewDoc} url={`${window.location.origin}/task-based/${example?.id ?? ''}`} title="preview" />
                  ) : (
                    <div className="tb-preview-empty">Press Execute to render your component.</div>
                  )}
                </div>

              <div className="tb-console">
                <div className="tb-preview-label">Console</div>
                <pre className="tb-console-out">
                  {lines.length > 0 ? lines.join('\n') : 'Console output appears here.'}
                </pre>
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}
