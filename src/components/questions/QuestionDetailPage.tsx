import { useMemo, useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getById } from '../../data/questionService'
import { useQuestions } from '../../data/useQuestions'
import { buildJsSrcDoc, buildReactSrcDoc, buildHtmlSrcDoc, isReactCode, isHtmlWorkspace } from '../../lib/runner'
import TaskBasedPanel from './TaskBasedPanel'
import SplitPane from '../common/SplitPane'
import BrowserPreview from '../common/BrowserPreview'
import './QuestionDetailPage.css'

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { questions: allQuestions, loading } = useQuestions()
  const question = useMemo(() => getById(allQuestions, Number(id)), [allQuestions, id])
  // const navigate = useNavigate() // Reserved for future navigation needs
  const [showAnswer, setShowAnswer] = useState(true)
  const [code, setCode] = useState('')
  const [output, setOutput] = useState<string[]>([])
  const [previewDoc, setPreviewDoc] = useState('')
  const [hasDom, setHasDom] = useState<boolean | null>(null)
  const [hasLog, setHasLog] = useState(false)
  const [running, setRunning] = useState(false)
  const [execTime, setExecTime] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const runIdRef = useRef(0)
  const handlersRef = useRef<(e: MessageEvent) => void>(() => {})

  useEffect(() => {
    const listener = (e: MessageEvent) => handlersRef.current(e)
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [id])

  useEffect(() => {
    setCode(question?.code || '')
    setOutput([])
    setPreviewDoc('')
    setHasDom(null)
    setHasLog(false)
    setExecTime(null)
  }, [question?.code])

  const runCode = async (source: string) => {
    if (!source.trim()) return
    const id = ++runIdRef.current
    const startTime = performance.now()
    setRunning(true)
    setOutput([])
    setHasDom(null)
    setHasLog(false)
    setExecTime(null)

    handlersRef.current = (e: MessageEvent) => {
      const m = e.data
      if (!m || m.runId !== id) return
      if (m.t === 'log') {
        setHasLog(true)
        setOutput(prev => [...prev, (m.parts ?? []).join(' ')])
      } else if (m.t === 'dom') {
        setHasDom(m.hasDom ?? false)
      } else if (m.t === 'error') {
        setOutput(prev => [...prev, m.stack || m.message])
        setRunning(false)
        setExecTime(Math.round(performance.now() - startTime))
      } else if (m.t === 'done') {
        setRunning(false)
        setExecTime(m.ms ?? Math.round(performance.now() - startTime))
      }
    }
    try {
      if (question && isHtmlWorkspace(question)) {
        setPreviewDoc(buildHtmlSrcDoc(question.example ?? '', source, id))
      } else if (isReactCode(source)) {
        const doc = await buildReactSrcDoc({ 'App.jsx': source }, 'App.jsx', id)
        setPreviewDoc(doc)
      } else {
        setPreviewDoc(buildJsSrcDoc(source, id))
      }
    } catch (err) {
      setOutput(prev => [...prev, err instanceof Error ? err.message : String(err)])
      setRunning(false)
      setExecTime(Math.round(performance.now() - startTime))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      runCode(code || question?.code || '')
    }
  }

  const handleCopyCode = () => {
    const textToCopy = code || question?.code || ''
    if (!textToCopy) return
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const [activeTab, setActiveTab] = useState<'overview' | 'solution' | 'syntax' | 'examples' | 'specifications' | 'browser-compatibility' | 'task-based'>('overview')

  if (loading) {
    return <div className="detail-page loading"><p>Loading question...</p></div>
  }

  if (!question) {
    return (
      <div className="detail-page not-found">
        <h2>Question not found</h2>
        <Link to="/questions" className="btn btn-primary">Back to Questions</Link>
      </div>
    )
  }

  const currentIndex = allQuestions.findIndex(q => q.id === question.id)
  const prevQuestion = currentIndex > 0 ? allQuestions[currentIndex - 1] : null
  const nextQuestion = currentIndex < allQuestions.length - 1 ? allQuestions[currentIndex + 1] : null

  const isCoding = !!question.code

  const solutionPlayground = (
    <div className="code-playground">
      <div className="playground-header">
        <h3>Interactive Solution Playground</h3>
        <span className="keyboard-hint">Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to run</span>
      </div>
      <SplitPane
        className="code-split"
        left={
          <div className="code-pane code-pane-left">
            <div className="code-window">
              <div className="code-window-bar">
                <div className="window-dots">
                  <span className="code-dot" style={{ background: '#ff5f57' }} />
                  <span className="code-dot" style={{ background: '#febc2e' }} />
                  <span className="code-dot" style={{ background: '#28c840' }} />
                </div>
                <span className="window-filename">
                  {isReactCode(code || question.code || '') ? 'App.jsx' : 'solution.js'}
                </span>
                <div className="window-actions">
                  <button
                    className="window-btn"
                    onClick={handleCopyCode}
                    title="Copy code to clipboard"
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                  <button
                    className="window-btn"
                    onClick={() => { setCode(question?.code || ''); setOutput([]); setExecTime(null); }}
                    title="Reset code to original"
                  >
                    Reset
                  </button>
                </div>
              </div>
              <textarea
                className="code-editor"
                value={code || question.code || ''}
                onChange={e => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                placeholder="Edit or test solution code here..."
              />
            </div>
            <div className="code-actions">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => { setCode(question?.code || ''); setOutput([]); setExecTime(null); }}
              >
                Reset Code
              </button>
              <button
                className="btn btn-success btn-sm run-btn"
                onClick={() => runCode(code || question.code || '')}
                disabled={running}
              >
                {running ? 'Running…' : '▶ Execute Solution'}
              </button>
            </div>
          </div>
        }
        right={
          <div className="code-pane code-pane-right">
            <div className="output-section">
              <h4>Live Preview</h4>
              {hasDom === false ? (
                <div className="code-preview-empty">{hasLog ? 'No DOM output — see Console logs below.' : 'Ran successfully — no DOM output.'}</div>
              ) : previewDoc ? (
                <BrowserPreview srcDoc={previewDoc} url={`${window.location.origin}/preview`} title="preview" />
              ) : (
                <div className="code-preview-empty">Press <strong>Execute Solution</strong> to render in the sandbox.</div>
              )}
            </div>
            <div className="output-section console-section">
              <div className="console-header-row">
                <div className="console-title-group">
                  <span className={`status-dot ${running ? 'running' : output.length > 0 ? 'success' : ''}`} />
                  <h4>Console Output</h4>
                  {execTime !== null && <span className="exec-time-badge">{execTime}ms</span>}
                </div>
                {output.length > 0 && (
                  <button className="console-clear-btn" onClick={() => setOutput([])}>Clear</button>
                )}
              </div>
              <pre className="code-output">
                {output.length > 0
                  ? output.map((line, idx) => (
                      <div key={idx} className="console-line">
                        <span className="console-line-no">{idx + 1}</span>
                        <span className="console-line-text">{line}</span>
                      </div>
                    ))
                  : <span className="console-placeholder">Console output will appear here after execution...</span>}
              </pre>
            </div>
          </div>
        }
      />
    </div>
  )

  const overviewContent = (
    <div className="content-section">
      <h2>Overview</h2>
      <div className="question-meta">
        <span className={`badge badge-category cat-${question.category.toLowerCase().replace(/[^a-z]+/g, '-')}`}>{question.category}</span>
        <span className={`badge badge-${question.difficulty.toLowerCase()}`}>{question.difficulty}</span>
        <span className="question-id">Question #{question.id}</span>
      </div>
      <div className="question-text">
        <h3>Question</h3>
        <p>{question.question}</p>
      </div>
      <div className="answer-section">
        <h3>Explanation & Approach</h3>
        <button
          className="btn btn-secondary btn-sm toggle-answer"
          onClick={() => setShowAnswer(!showAnswer)}
        >
          {showAnswer ? 'Hide Explanation' : 'Show Explanation'}
        </button>
        {showAnswer && (
          <div className="answer-content">
            {question.answer.split(/\n{2,}/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )}
      </div>

      {isCoding && (
        <div className="overview-solution-block">
          <h3>Solution & Runnable Code</h3>
          {solutionPlayground}
        </div>
      )}
    </div>
  )

  const solutionContent = (
    <div className="content-section">
      <h2>Solution & Interactive Playground</h2>
      {isCoding ? solutionPlayground : (
        <div className="answer-section">
          <h3>Solution Details</h3>
          <div className="answer-content">
            {question.answer.split(/\n{2,}/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const syntaxContent = (
    <div className="content-section">
      <h2>Syntax & Concepts</h2>
      <div className="syntax-guide">
        <h3>Key Concepts</h3>
        <ul className="concept-list">
          {generateKeyConcepts(question).map((concept, i) => (
            <li key={i}>{concept}</li>
          ))}
        </ul>
        {generateSyntaxExamples(question).map((example, i) => (
          <div key={i} className="syntax-example">
            <h4>{example.title}</h4>
            <pre><code>{example.code}</code></pre>
            <p>{example.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  )

  const examplesContent = (
    <div className="content-section">
      <h2>Examples & References</h2>
      {isCoding && solutionPlayground}
      {question.example && (
        <div className="example-section">
          <h3>Reference Example</h3>
          <div className="code-window">
            <div className="code-window-bar" aria-hidden="true">
              <span className="code-dot" style={{ background: '#ff5f57' }} />
              <span className="code-dot" style={{ background: '#febc2e' }} />
              <span className="code-dot" style={{ background: '#28c840' }} />
            </div>
            <pre><code>{question.example}</code></pre>
          </div>
        </div>
      )}
      {generateAdditionalExamples(question).map((ex, i) => (
        <div key={i} className="additional-example">
          <h4>{ex.title}</h4>
          <pre><code>{ex.code}</code></pre>
          <p>{ex.explanation}</p>
        </div>
      ))}
    </div>
  )

  const specificationsContent = (
    <div className="content-section">
      <h2>Specifications</h2>
      <div className="spec-table">
        <table>
          <thead>
            <tr>
              <th>Specification</th>
              <th>Status</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {generateSpecifications(question).map((spec, i) => (
              <tr key={i}>
                <td><a href={spec.url} target="_blank" rel="noopener noreferrer">{spec.name}</a></td>
                <td><span className={`spec-status ${spec.status.toLowerCase()}`}>{spec.status}</span></td>
                <td>{spec.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const browserCompatContent = (
    <div className="content-section">
      <h2>Browser Compatibility</h2>
      <div className="compat-table">
        <table>
          <thead>
            <tr>
              <th>Browser</th>
              <th>Desktop</th>
              <th>Mobile</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {generateBrowserCompat(question).map((browser, i) => (
              <tr key={i}>
                <td>{browser.name}</td>
                <td><span className={`compat-badge ${browser.desktop.toLowerCase()}`}>{browser.desktop}</span></td>
                <td><span className={`compat-badge ${browser.mobile.toLowerCase()}`}>{browser.mobile}</span></td>
                <td>{browser.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="compat-note">Compatibility data is generated based on the JavaScript/ECMAScript features discussed in this question.</p>
    </div>
  )

  const tabs: Array<{id: 'overview' | 'solution' | 'syntax' | 'examples' | 'specifications' | 'browser-compatibility' | 'task-based', label: string, content: React.ReactNode}> = [
    { id: 'overview', label: 'Overview', content: overviewContent },
    ...(isCoding ? [{ id: 'solution' as const, label: 'Solution & Playground', content: solutionContent }] : []),
    { id: 'syntax', label: 'Syntax & Concepts', content: syntaxContent },
    { id: 'examples', label: 'Examples', content: examplesContent },
    { id: 'specifications', label: 'Specifications', content: specificationsContent },
    { id: 'browser-compatibility', label: 'Browser Compatibility', content: browserCompatContent },
    { id: 'task-based', label: 'Task-Based', content: <TaskBasedPanel /> },
  ]

  return (
    <div className="detail-page">
      <nav className="detail-nav" aria-label="Question navigation">
        {prevQuestion ? (
          <Link to={`/questions/${prevQuestion.id}/detail`} className="nav-arrow">&larr; Previous</Link>
        ) : <span className="nav-placeholder" />}
        <div className="detail-nav-center">
          <Link to="/questions" className="nav-back">Back to List</Link>
          <Link to={`/questions/${question.id}`} className="nav-simple">Simple View</Link>
        </div>
        {nextQuestion ? (
          <Link to={`/questions/${nextQuestion.id}/detail`} className="nav-arrow">Next &rarr;</Link>
        ) : <span className="nav-placeholder" />}
      </nav>

      <article className="detail-article">
        <header className="detail-header">
          <h1>{question.question}</h1>
          <div className="detail-meta">
            <span className={`badge badge-category cat-${question.category.toLowerCase().replace(/[^a-z]+/g, '-')}`}>{question.category}</span>
            <span className={`badge badge-${question.difficulty.toLowerCase()}`}>{question.difficulty}</span>
            <span className="question-id">#{question.id}</span>
          </div>
        </header>

        <nav className="tab-nav" aria-label="Documentation sections">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="tab-panel" role="tabpanel" aria-labelledby={`${activeTab}-tab`}>
          {tabs.find(t => t.id === activeTab)?.content}
        </div>
      </article>

      <footer className="detail-footer">
        <div className="footer-nav-links">
          <Link to="/questions" className="btn btn-secondary">All Questions</Link>
          {prevQuestion && <Link to={`/questions/${prevQuestion.id}/detail`} className="btn btn-primary">&larr; Previous</Link>}
          {nextQuestion && <Link to={`/questions/${nextQuestion.id}/detail`} className="btn btn-primary">Next &rarr;</Link>}
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Scroll to top of the page"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="18 15 12 9 6 15" />
          </svg>
          Back to Top
        </button>
      </footer>
    </div>
  )
}

function generateKeyConcepts(question: any): string[] {
  const concepts: string[] = []
  const q = question.question.toLowerCase()
  const a = question.answer.toLowerCase()

  if (q.includes('===') || q.includes('==')) {
    concepts.push('Strict equality (===) vs loose equality (==)')
    concepts.push('Type coercion in JavaScript')
    concepts.push('Abstract Equality Comparison Algorithm')
    concepts.push('Strict Equality Comparison Algorithm')
  }
  if (q.includes('promise') || a.includes('promise')) {
    concepts.push('Promise states: pending, fulfilled, rejected')
    concepts.push('Promise chaining with .then() and .catch()')
    concepts.push('Promise.all(), Promise.race(), Promise.allSettled()')
  }
  if (q.includes('closure') || a.includes('closure')) {
    concepts.push('Lexical scoping')
    concepts.push('Function returning function')
    concepts.push('Captured variables')
  }
  if (q.includes('event loop') || a.includes('event loop')) {
    concepts.push('Call stack')
    concepts.push('Task queue (macrotasks)')
    concepts.push('Microtask queue')
    concepts.push('Event loop tick')
  }
  if (q.includes('var') && (q.includes('let') || q.includes('const'))) {
    concepts.push('Function scope vs block scope')
    concepts.push('Hoisting behavior')
    concepts.push('Temporal Dead Zone (TDZ)')
  }
  if (q.includes('this') || a.includes('this')) {
    concepts.push('Call-site binding')
    concepts.push('Implicit, explicit, new, and default binding')
    concepts.push('Arrow function lexical this')
  }
  if (q.includes('prototype') || a.includes('prototype')) {
    concepts.push('Prototype chain')
    concepts.push('Object.create()')
    concepts.push('Constructor functions')
  }
  if (q.includes('async') || q.includes('await')) {
    concepts.push('Async function returns Promise')
    concepts.push('Await pauses execution')
    concepts.push('Error handling with try/catch')
  }
  if (q.includes('map') || q.includes('foreach') || q.includes('reduce') || q.includes('filter')) {
    concepts.push('Array iteration methods')
    concepts.push('Functional programming patterns')
    concepts.push('Immutability considerations')
  }

  if (concepts.length === 0) {
    concepts.push('Core JavaScript concept')
    concepts.push('Interview-relevant knowledge')
    concepts.push('Practical application in React')
  }

  return concepts
}

function generateSyntaxExamples(question: any): Array<{title: string, code: string, explanation: string}> {
  const examples: Array<{title: string, code: string, explanation: string}> = []
  const q = question.question.toLowerCase()

  if (q.includes('===') || q.includes('==')) {
    examples.push({
      title: 'Loose Equality (==)',
      code: `// Type coercion occurs
5 == "5"        // true
null == undefined  // true
0 == false      // true
"" == 0         // true
"0" == false    // true`,
      explanation: 'Loose equality converts both operands to the same type before comparing. This can lead to unexpected results.'
    })
    examples.push({
      title: 'Strict Equality (===)',
      code: `// No type coercion
5 === "5"       // false
null === undefined  // false
0 === false     // false
"" === 0        // false
"0" === false   // false`,
      explanation: 'Strict equality compares both value and type without conversion. This is the recommended approach.'
    })
    examples.push({
      title: 'Best Practice',
      code: `// Always prefer ===
if (value === expected) { ... }
if (userInput === "yes") { ... }

// Use Object.is() for special cases
Object.is(NaN, NaN)        // true (=== returns false)
Object.is(0, -0)           // false (=== returns true)`,
      explanation: 'Use strict equality by default. Object.is() handles edge cases like NaN and ±0.'
    })
  }

  if (q.includes('promise')) {
    examples.push({
      title: 'Basic Promise',
      code: `const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("done"), 1000)
})

promise
  .then(result => console.log(result))
  .catch(error => console.error(error))`,
      explanation: 'Creating and consuming a basic Promise with resolve and reject.'
    })
    examples.push({
      title: 'Promise Chaining',
      code: `fetchUser(id)
  .then(user => fetchPosts(user.id))
  .then(posts => render(posts))
  .catch(handleError)`,
      explanation: 'Chaining multiple async operations with automatic error propagation.'
    })
  }

  if (q.includes('var') && (q.includes('let') || q.includes('const'))) {
    examples.push({
      title: 'var - Function Scoped',
      code: `function example() {
  if (true) {
    var x = 10
  }
  console.log(x) // 10 - accessible outside block
}`,
      explanation: 'var is function-scoped, not block-scoped.'
    })
    examples.push({
      title: 'let/const - Block Scoped',
      code: `function example() {
  if (true) {
    let y = 10
    const z = 20
  }
  console.log(y) // ReferenceError
  console.log(z) // ReferenceError
}`,
      explanation: 'let and const are block-scoped, limited to the {} block.'
    })
    examples.push({
      title: 'Hoisting Differences',
      code: `console.log(a) // undefined (hoisted)
var a = 5

console.log(b) // ReferenceError (TDZ)
let b = 5`,
      explanation: 'var is hoisted and initialized with undefined. let/const are hoisted but uninitialized (TDZ).'
    })
  }

  if (q.includes('closure')) {
    examples.push({
      title: 'Basic Closure',
      code: `function outer() {
  const secret = "hidden"
  return function inner() {
    return secret // accesses outer scope
  }
}

const getSecret = outer()
console.log(getSecret()) // "hidden"`,
      explanation: 'Inner function retains access to outer function scope after outer returns.'
    })
    examples.push({
      title: 'Closure in React (useState)',
      code: `function Counter() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount(c => c + 1) // closure captures latest count
  }
  // ...
}`,
      explanation: 'React hooks use closures to capture state values. Functional updates avoid stale closures.'
    })
  }

  if (q.includes('event loop')) {
    examples.push({
      title: 'Event Loop Order',
      code: `console.log('1')

setTimeout(() => console.log('2'), 0)

Promise.resolve().then(() => console.log('3'))

console.log('4')

// Output: 1, 4, 3, 2`,
      explanation: 'Synchronous code runs first, then microtasks (Promise), then macrotasks (setTimeout).'
    })
  }

  if (q.includes('this')) {
    examples.push({
      title: 'this Binding Rules',
      code: `// Default binding
function foo() { console.log(this) }
foo() // window (or undefined in strict)

// Implicit binding
const obj = { foo: function() { console.log(this) } }
obj.foo() // obj

// Explicit binding
foo.call(obj) // obj

// new binding
new foo() // new instance

// Arrow function (lexical)
const arrow = () => console.log(this)
arrow() // enclosing scope's this`,
      explanation: 'this is determined by how a function is called (call-site), not where it\'s defined. Arrow functions inherit this lexically.'
    })
  }

  if (q.includes('map') || q.includes('foreach') || q.includes('reduce') || q.includes('filter')) {
    examples.push({
      title: 'map() - Transform',
      code: `const numbers = [1, 2, 3]
const doubled = numbers.map(n => n * 2)
// [2, 4, 6] - new array, same length`,
      explanation: 'map() creates a new array with transformed values. Returns a new array.'
    })
    examples.push({
      title: 'forEach() - Side Effects',
      code: `const numbers = [1, 2, 3]
numbers.forEach(n => console.log(n * 2))
// Logs: 2, 4, 6
// Returns: undefined`,
      explanation: 'forEach() executes a function for each element. Returns undefined, used for side effects only.'
    })
    examples.push({
      title: 'reduce() - Accumulate',
      code: `const numbers = [1, 2, 3]
const sum = numbers.reduce((acc, n) => acc + n, 0)
// 6 - single accumulated value`,
      explanation: 'reduce() reduces array to a single value. Powerful for transformations, grouping, and computations.'
    })
  }

  // Generic fallback
  if (examples.length === 0) {
    examples.push({
      title: 'General Syntax',
      code: `// Example related to: ${question.question}
// Refer to the answer section for details`,
      explanation: 'This question covers fundamental concepts. See the Overview tab for the detailed answer.'
    })
  }

  return examples
}

function generateAdditionalExamples(question: any): Array<{title: string, code: string, explanation: string}> {
  // Generate practical examples based on the question topic
  const examples: Array<{title: string, code: string, explanation: string}> = []
  const q = question.question.toLowerCase()

  if (q.includes('===') || q.includes('==')) {
    examples.push({
      title: 'Real-world Bug Prevention',
      code: `// BAD: Unexpected coercion
function isActive(user) {
  return user.status == "active" // "1" == "active" -> false, but 1 == "1" -> true
}

// GOOD: Explicit comparison
function isActive(user) {
  return user.status === "active"
}

// Type-safe API response handling
function parseResponse(data: unknown): User {
  if (data && typeof data === "object" && "id" in data) {
    return data as User
  }
  throw new Error("Invalid user data")
}`,
      explanation: 'Using === prevents subtle bugs from type coercion, especially with API data.'
    })
  }

  if (q.includes('promise')) {
    examples.push({
      title: 'Parallel vs Sequential',
      code: `// Sequential (slower)
const user = await fetchUser(id)
const posts = await fetchPosts(id)

// Parallel (faster) - Promise.all
const [user, posts] = await Promise.all([
  fetchUser(id),
  fetchPosts(id)
])

// Race - first to settle
const result = await Promise.race([
  fetchWithTimeout(5000),
  fetchData()
])`,
      explanation: 'Promise.all() runs promises in parallel. Promise.race() returns the first settled promise.'
    })
  }

  if (q.includes('var') && (q.includes('let') || q.includes('const'))) {
    examples.push({
      title: 'Loop Variable Capture',
      code: `// PROBLEM with var
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100)
}
// Logs: 3, 3, 3

// SOLUTION with let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100)
}
// Logs: 0, 1, 2`,
      explanation: 'var creates one shared variable. let creates a new binding per iteration.'
    })
  }

  return examples
}

function generateSpecifications(question: any): Array<{name: string, url: string, status: string, comment: string}> {
  const specs: Array<{name: string, url: string, status: string, comment: string}> = []
  const q = question.question.toLowerCase()

  if (q.includes('===') || q.includes('==')) {
    specs.push({
      name: 'ECMAScript Language Specification - Abstract Equality Comparison',
      url: 'https://tc39.es/ecma262/#sec-abstract-equality-comparison',
      status: 'Living Standard',
      comment: 'Defines the == algorithm with type coercion'
    })
    specs.push({
      name: 'ECMAScript Language Specification - Strict Equality Comparison',
      url: 'https://tc39.es/ecma262/#sec-strict-equality-comparison',
      status: 'Living Standard',
      comment: 'Defines the === algorithm without type coercion'
    })
  }

  if (q.includes('promise')) {
    specs.push({
      name: 'ECMAScript 2015 (ES6) - Promise Objects',
      url: 'https://tc39.es/ecma262/#sec-promise-objects',
      status: 'Standard',
      comment: 'Standardized Promise implementation'
    })
    specs.push({
      name: 'Promises/A+ Specification',
      url: 'https://promisesaplus.com/',
      status: 'Standard',
      comment: 'Interoperable Promise specification'
    })
  }

  if (q.includes('var') && (q.includes('let') || q.includes('const'))) {
    specs.push({
      name: 'ECMAScript 2015 (ES6) - let and const Declarations',
      url: 'https://tc39.es/ecma262/#sec-let-and-const-declarations',
      status: 'Standard',
      comment: 'Introduced block-scoped declarations'
    })
  }

  if (q.includes('async') || q.includes('await')) {
    specs.push({
      name: 'ECMAScript 2017 - Async Functions',
      url: 'https://tc39.es/ecma262/#sec-async-function-definitions',
      status: 'Standard',
      comment: 'Syntactic sugar over Promises'
    })
  }

  // Generic fallback
  if (specs.length === 0) {
    specs.push({
      name: 'ECMAScript Language Specification',
      url: 'https://tc39.es/ecma262/',
      status: 'Living Standard',
      comment: 'The official JavaScript language specification'
    })
    specs.push({
      name: 'MDN Web Docs - JavaScript',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      status: 'Documentation',
      comment: 'Comprehensive JavaScript reference and guides'
    })
  }

  return specs
}

function generateBrowserCompat(question: any): Array<{name: string, desktop: string, mobile: string, notes: string}> {
  const compat: Array<{name: string, desktop: string, mobile: string, notes: string}> = []
  const q = question.question.toLowerCase()

  // Modern JS features (ES6+) - widely supported
  const modernFeatures = q.includes('let') || q.includes('const') || q.includes('arrow') ||
                         q.includes('promise') || q.includes('async') || q.includes('map') ||
                         q.includes('reduce') || q.includes('spread') || q.includes('destructur')

  if (modernFeatures) {
    compat.push(
      { name: 'Chrome', desktop: 'Full Support', mobile: 'Full Support', notes: 'Since v49+' },
      { name: 'Firefox', desktop: 'Full Support', mobile: 'Full Support', notes: 'Since v45+' },
      { name: 'Safari', desktop: 'Full Support', mobile: 'Full Support', notes: 'Since v10+' },
      { name: 'Edge', desktop: 'Full Support', mobile: 'Full Support', notes: 'Since v14+' },
      { name: 'Opera', desktop: 'Full Support', mobile: 'Full Support', notes: 'Since v36+' }
    )
  } else {
    // Older features - universally supported
    compat.push(
      { name: 'Chrome', desktop: 'Full Support', mobile: 'Full Support', notes: 'All versions' },
      { name: 'Firefox', desktop: 'Full Support', mobile: 'Full Support', notes: 'All versions' },
      { name: 'Safari', desktop: 'Full Support', mobile: 'Full Support', notes: 'All versions' },
      { name: 'Edge', desktop: 'Full Support', mobile: 'Full Support', notes: 'All versions' },
      { name: 'IE 11', desktop: 'Full Support', mobile: 'N/A', notes: 'Legacy support' }
    )
  }

  return compat
}