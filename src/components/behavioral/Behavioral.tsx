import { useState, useMemo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './Behavioral.css'

export interface BehavioralQuestion {
  id: string
  company: 'Amazon' | 'Google' | 'Meta' | 'Netflix'
  principle: string
  question: string
  tips: string[]
  exemplarAnswer: {
    situation: string
    task: string
    action: string
    result: string
  }
}

const BEHAVIORAL_QUESTIONS: BehavioralQuestion[] = [
  {
    id: 'amzn-disagree-commit',
    company: 'Amazon',
    principle: 'Disagree and Commit / Bias for Action',
    question: 'Tell me about a time when you had a strong technical disagreement with a Tech Lead or Senior Architect. How did you handle the situation and what was the outcome?',
    tips: [
      'Focus on data, benchmark numbers, and user impact rather than opinions.',
      'Show that you respectfully voiced concerns but fully committed once a decision was finalized.',
      'Highlight how you preserved a healthy team relationship.',
    ],
    exemplarAnswer: {
      situation: 'At my previous company, our team was building a high-traffic checkout portal processing $5M in daily transactions. The Tech Lead proposed rewriting the entire UI using a heavy third-party state library that would add 140KB to the initial bundle payload.',
      task: 'As the Senior Frontend Engineer on the project, my responsibility was to ensure our P99 mobile load time remained strictly under 1.8 seconds while delivering the checkout redesign within a 6-week sprint.',
      action: 'Instead of debating hypotheticals, I built a lightweight Proof-of-Concept over two days comparing the proposed library against React 19 native Actions and Zustand. I created side-by-side Chrome DevTools Lighthouse profiles showing that our custom lightweight solution saved 120ms of Total Blocking Time (TBT) on low-end 4G mobile devices. I presented the benchmark data in an architecture review. While the lead initially had reservations, they appreciated the concrete data.',
      result: 'The team adopted the lightweight architecture, launching the new checkout on time. Post-launch telemetry showed a 22% improvement in mobile checkout conversion and zero state-related regressions, contributing an estimated $420k in incremental quarterly revenue.',
    },
  },
  {
    id: 'goog-ambiguity',
    company: 'Google',
    principle: 'Navigating Ambiguity / Intellectual Humility',
    question: 'Describe a situation where you had to design and deliver a frontend system with highly ambiguous requirements and incomplete API specifications.',
    tips: [
      'Explain how you structured an iterative discovery framework.',
      'Discuss how you defined mock API data contracts to unblock engineering early.',
      'Highlight intellectual humility and continuous feedback loops.',
    ],
    exemplarAnswer: {
      situation: 'Our engineering organization decided to build a real-time collaborative dashboard for enterprise clients, but the backend microservices and streaming WebSocket protocols were still being designed across three remote teams.',
      task: 'I was tasked with leading the frontend architecture and delivering a working MVP in 8 weeks despite having zero stable API endpoints.',
      action: 'I drafted a comprehensive OpenAPI / TypeScript data contract proposal and scheduled an alignment RFC session with the backend leads. To decouple the frontend team, I implemented a Mock Service Worker (MSW) layer simulating network latency, streaming WebSocket bursts, and intermittent disconnects. I also designed the UI around a normalized Zustand store so changing the transport layer later would require zero component refactoring.',
      result: 'When backend services were ready in Week 6, our frontend integrated in less than 3 days with zero breaking schema changes. We delivered the enterprise MVP two weeks ahead of schedule, enabling our sales team to close three Fortune 500 pilots.',
    },
  },
  {
    id: 'meta-move-fast',
    company: 'Meta',
    principle: 'Move Fast / Focus on Long-Term Impact',
    question: 'Tell me about a time you identified significant technical debt or a major web performance regression and took proactive ownership to resolve it.',
    tips: [
      'Quantify the performance regression (LCP, INP, CLS, or bounce rates).',
      'Explain how you balanced speed of shipping with engineering rigor.',
      'Demonstrate high ownership without waiting for a manager to assign the task.',
    ],
    exemplarAnswer: {
      situation: 'During a major product launch, our main social feed page suffered an unexpected performance regression where Interaction to Next Paint (INP) jumped to 340ms, causing noticeable UI stutter during rapid scrolling.',
      task: 'Although my sprint was dedicated to building new monetization features, I recognized that poor scroll performance directly degraded user retention across our 12 Million daily active users.',
      action: 'I spent an evening profiling CPU flamecharts in Chrome DevTools and discovered that an un-memoized feed header was forcing 500 child card components to re-render on every scroll dispatch. I refactored the feed using `startTransition` and implemented DOM windowing with dynamic ResizeObserver height caching. I also authored an automated ESLint rule and CI performance budget check to prevent future un-memoized context regressions.',
      result: 'The refactor slashed our INP from 340ms down to 18ms (a 94% latency reduction) and restored silky 60fps scrolling. User daily session length increased by 8.4% across mobile devices.',
    },
  },
  {
    id: 'nflx-freedom-responsibility',
    company: 'Netflix',
    principle: 'Freedom & Responsibility / High Candor',
    question: 'Describe a time you caused or encountered a major production incident. How did you diagnose the issue, communicate with stakeholders, and implement long-term preventions?',
    tips: [
      'Own mistakes transparently without shifting blame.',
      'Demonstrate calm crisis triage and clear stakeholder status updates.',
      'Focus on root-cause analysis and automated guardrails (Post-Mortem culture).',
    ],
    exemplarAnswer: {
      situation: 'During a Friday afternoon deployment, a bug in our video player bundle caused unhandled Promise rejections on older Safari TV browsers, preventing video playback for approximately 150,000 subscribers.',
      task: 'As the on-call UI engineer, I was responsible for triaging the incident, restoring subscriber playback immediately, and conducting the blameless post-mortem.',
      action: 'Within 4 minutes of the PagerDuty alert, I rolled back the production CDN release using our instant canary switchboard, restoring service in under 6 minutes total. I then reproduced the issue in a Safari 14 environment, identifying a missing polyfill for `Array.prototype.at()`. I added the polyfill, wrote end-to-end Playwright tests across our browser matrix, and updated our CI build pipeline to enforce strict target ES2020 transpilation audits.',
      result: 'Total downtime was contained to under 6 minutes with zero subscriber data loss. I published a blameless post-mortem doc adopted across all 8 frontend teams, and the automated CI guardrails prevented 4 similar compatibility regressions over the following year.',
    },
  },
]

export default function Behavioral() {
  const [selectedCompany, setSelectedCompany] = useState<string>('All')
  const [selectedQuestion, setSelectedQuestion] = useState<BehavioralQuestion>(BEHAVIORAL_QUESTIONS[0])
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'practice' | 'exemplar'>('practice')

  const recognitionRef = useRef<any>(null)

  // Filter questions by company
  const filteredQuestions = useMemo(() => {
    if (selectedCompany === 'All') return BEHAVIORAL_QUESTIONS
    return BEHAVIORAL_QUESTIONS.filter(q => q.company === selectedCompany)
  }, [selectedCompany])

  // Speech Recognition setup (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event: any) => {
        let transcript = ''
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript
        }
        setUserAnswer(prev => prev ? `${prev} ${transcript}` : transcript)
      }

      recognition.onerror = () => {
        setIsRecording(false)
      }

      recognition.onend = () => {
        setIsRecording(false)
      }

      recognitionRef.current = recognition
    }
  }, [])

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported on this browser. You can type your answer in the text box.')
      return
    }

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      recognitionRef.current.start()
      setIsRecording(true)
    }
  }

  // Real-Time STAR Analysis Engine
  const starAnalysis = useMemo(() => {
    const text = userAnswer.toLowerCase()
    const words = text.split(/\s+/).filter(Boolean)
    const wordCount = words.length

    // 1. Situation: Context, timeline, challenges
    const situationKeywords = ['when', 'at', 'company', 'project', 'team', 'facing', 'crisis', 'deadline', 'traffic', 'legacy', 'monolith', 'challenge']
    const situationMatches = situationKeywords.filter(kw => text.includes(kw))
    const situationScore = Math.min(100, situationMatches.length * 25)

    // 2. Task: Objective, role, goals
    const taskKeywords = ['tasked', 'goal', 'responsibility', 'needed to', 'objective', 'assigned', 'aim', 'deliver', 'expected']
    const taskMatches = taskKeywords.filter(kw => text.includes(kw))
    const taskScore = Math.min(100, taskMatches.length * 30)

    // 3. Action: Individual active verbs ("I architected", "I refactored")
    const actionKeywords = ['i built', 'i architected', 'i designed', 'i implemented', 'i refactored', 'i facilitated', 'i investigated', 'i benchmarked', 'i led', 'i proposed', 'i created']
    const actionMatches = actionKeywords.filter(kw => text.includes(kw))
    const actionScore = Math.min(100, actionMatches.length * 30)

    // 4. Result: Quantifiable metrics (%, ms, $, numbers)
    const hasNumbers = /\b\d+(\.\d+)?%?\b/.test(userAnswer)
    const resultKeywords = ['reduced', 'improved', 'increased', 'saved', 'launched', 'revenue', 'conversion', 'ms', 'seconds', 'post-mortem', 'outcome', 'growth']
    const resultMatches = resultKeywords.filter(kw => text.includes(kw))
    const resultScore = Math.min(100, (hasNumbers ? 40 : 0) + resultMatches.length * 20)

    // Overall STAR Completeness Score
    const overallScore = wordCount < 30 ? 20 : Math.round((situationScore + taskScore + actionScore + resultScore) / 4)

    return {
      wordCount,
      situationScore,
      taskScore,
      actionScore,
      resultScore,
      overallScore,
      hasNumbers,
    }
  }, [userAnswer])

  return (
    <div className="behavioral-page page-enter">
      {/* Header */}
      <div className="behavioral-header">
        <div>
          <span className="beh-badge">🤝 FAANG Leadership Principles &amp; STAR Simulator</span>
          <h1>Behavioral &amp; Leadership Principles Trainer</h1>
          <p className="subtitle">
            Practice real behavioral questions for Amazon (16 LPs), Google, Meta, and Netflix with speech-to-text dictation, real-time STAR method analysis, and quantifiable metric scoring.
          </p>
        </div>
      </div>

      {/* Company Selector Filter */}
      <div className="company-filter-bar">
        <span>Filter by Company Framework:</span>
        <div className="company-filter-pills">
          {['All', 'Amazon', 'Google', 'Meta', 'Netflix'].map(comp => (
            <button
              key={comp}
              type="button"
              className={`comp-pill-btn ${selectedCompany === comp ? 'active' : ''}`}
              onClick={() => setSelectedCompany(comp)}
            >
              {comp}
            </button>
          ))}
        </div>
      </div>

      {/* Question Selector Cards */}
      <div className="questions-selector-list">
        {filteredQuestions.map(q => (
          <button
            key={q.id}
            type="button"
            className={`q-selector-card ${selectedQuestion.id === q.id ? 'active' : ''}`}
            onClick={() => {
              setSelectedQuestion(q)
              setUserAnswer('')
              setActiveTab('practice')
            }}
          >
            <div className="q-card-top">
              <span className={`comp-tag tag-${q.company.toLowerCase()}`}>{q.company}</span>
              <span className="principle-name">{q.principle}</span>
            </div>
            <p className="q-title-text">{q.question}</p>
          </button>
        ))}
      </div>

      {/* Main Practice & Analysis Stage */}
      <div className="behavioral-main-stage">
        {/* Left Column: Practice & Exemplar */}
        <div className="practice-column">
          <div className="active-question-card">
            <div className="active-q-header">
              <span className={`comp-tag tag-${selectedQuestion.company.toLowerCase()}`}>{selectedQuestion.company}</span>
              <span className="active-principle">{selectedQuestion.principle}</span>
            </div>
            <h3 className="active-q-text">{selectedQuestion.question}</h3>

            <div className="staff-tips-box">
              <strong>💡 Interviewer Coaching Tips:</strong>
              <ul>
                {selectedQuestion.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mode Tabs: Practice vs Model Answer */}
          <div className="practice-tabs-bar">
            <button
              type="button"
              className={`p-tab ${activeTab === 'practice' ? 'active' : ''}`}
              onClick={() => setActiveTab('practice')}
            >
              🎙️ Practice My Answer (Voice / Text)
            </button>
            <button
              type="button"
              className={`p-tab ${activeTab === 'exemplar' ? 'active' : ''}`}
              onClick={() => setActiveTab('exemplar')}
            >
              🌟 Staff Engineer Exemplar Solution
            </button>
          </div>

          {activeTab === 'practice' ? (
            <div className="answer-editor-box">
              <div className="editor-toolbar">
                <button
                  type="button"
                  className={`btn btn-sm ${isRecording ? 'btn-danger' : 'btn-secondary'} record-btn`}
                  onClick={toggleRecording}
                >
                  {isRecording ? '⏹ Stop Dictation' : '🎙️ Dictate with Mic (Speech-to-Text)'}
                </button>
                <span className="word-count-tag">{starAnalysis.wordCount} words</span>
              </div>

              <textarea
                className="behavioral-textarea"
                placeholder="Structure your answer using the STAR method:
• Situation: Set the context, project constraints, and deadline...
• Task: What was your specific goal and responsibility?
• Action: What explicit technical and leadership actions did YOU take? (e.g. 'I architected...', 'I benchmarked...')
• Result: Quantifiable business outcome (e.g. 'Reduced latency by 45%', 'Boosted conversion by $400k')..."
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                rows={9}
              />
            </div>
          ) : (
            <div className="exemplar-view-card">
              <div className="star-block star-s">
                <span className="star-tag">📌 Situation</span>
                <p>{selectedQuestion.exemplarAnswer.situation}</p>
              </div>
              <div className="star-block star-t">
                <span className="star-tag">🎯 Task</span>
                <p>{selectedQuestion.exemplarAnswer.task}</p>
              </div>
              <div className="star-block star-a">
                <span className="star-tag">⚡ Action (Individual Ownership)</span>
                <p>{selectedQuestion.exemplarAnswer.action}</p>
              </div>
              <div className="star-block star-r">
                <span className="star-tag">📈 Result (Quantifiable Impact)</span>
                <p>{selectedQuestion.exemplarAnswer.result}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Real-Time STAR Method Analyzer */}
        <div className="analysis-column">
          <div className="star-analyzer-card">
            <h4>Live STAR Method Quality Analysis</h4>

            <div className="overall-score-box">
              <span className="overall-score-num">{starAnalysis.overallScore}%</span>
              <span className="overall-score-label">STAR Completeness Score</span>
            </div>

            <div className="star-breakdown-list">
              <div className="star-meter-row">
                <div className="meter-label-row">
                  <span>📌 Situation (Context &amp; Constraints)</span>
                  <strong>{starAnalysis.situationScore}%</strong>
                </div>
                <div className="meter-track">
                  <div className="meter-fill" style={{ width: `${starAnalysis.situationScore}%` }} />
                </div>
              </div>

              <div className="star-meter-row">
                <div className="meter-label-row">
                  <span>🎯 Task (Objective &amp; Scope)</span>
                  <strong>{starAnalysis.taskScore}%</strong>
                </div>
                <div className="meter-track">
                  <div className="meter-fill" style={{ width: `${starAnalysis.taskScore}%` }} />
                </div>
              </div>

              <div className="star-meter-row">
                <div className="meter-label-row">
                  <span>⚡ Action ("I" vs "We" Ownership)</span>
                  <strong>{starAnalysis.actionScore}%</strong>
                </div>
                <div className="meter-track">
                  <div className="meter-fill" style={{ width: `${starAnalysis.actionScore}%` }} />
                </div>
              </div>

              <div className="star-meter-row">
                <div className="meter-label-row">
                  <span>📈 Result (Quantifiable Metrics)</span>
                  <strong>{starAnalysis.resultScore}%</strong>
                </div>
                <div className="meter-track">
                  <div className="meter-fill" style={{ width: `${starAnalysis.resultScore}%` }} />
                </div>
              </div>
            </div>

            <div className="actionable-feedback-box">
              <strong>Checklist Recommendations:</strong>
              <ul>
                <li className={starAnalysis.situationScore > 50 ? 'checked' : 'pending'}>
                  {starAnalysis.situationScore > 50 ? '✓ Context & constraints established' : '○ Add context (timeline, project scale)'}
                </li>
                <li className={starAnalysis.actionScore > 50 ? 'checked' : 'pending'}>
                  {starAnalysis.actionScore > 50 ? '✓ Strong individual action verbs used' : '○ Use "I architected", "I refactored"'}
                </li>
                <li className={starAnalysis.hasNumbers ? 'checked' : 'pending'}>
                  {starAnalysis.hasNumbers ? '✓ Concrete metrics & numbers included' : '○ Include exact numbers (e.g. "35% latency drop", "$400k revenue")'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="behavioral-footer">
        <Link to="/experience" className="btn btn-secondary">
          🎯 0-20 Years Career Ladder
        </Link>
        <Link to="/video-mock" className="btn btn-primary">
          🎥 Start Live AI Video Mock Interview →
        </Link>
      </div>
    </div>
  )
}
