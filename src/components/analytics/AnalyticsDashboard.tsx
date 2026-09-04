import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../../context/ProgressContext'
import { useQuestions } from '../../data/useQuestions'
import { getCategories } from '../../data/questionService'
import './AnalyticsDashboard.css'

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

/* ─── Line Chart ─── */
function LineChart({ data, color = '#6366f1', label = 'Score', max = 5 }: {
  data: { x: string; y: number }[]
  color?: string
  label?: string
  max?: number
}) {
  const W = 500, H = 160, PAD = { top: 16, right: 16, bottom: 32, left: 40 }
  if (data.length < 2) {
    return <div className="chart-empty"><span>📈</span><p>Complete at least 2 mock interviews to see your trend</p></div>
  }
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const points = data.map((d, i) => ({
    x: PAD.left + (i / (data.length - 1)) * innerW,
    y: PAD.top + innerH - (d.y / max) * innerH,
    value: d.y, label: d.x,
  }))
  const polyline = points.map(p => `${p.x},${p.y}`).join(' ')
  const area = `M ${points[0].x},${PAD.top + innerH} ${points.map(p => `L ${p.x},${p.y}`).join(' ')} L ${points[points.length - 1].x},${PAD.top + innerH} Z`
  const gradId = `lg${color.replace('#', '')}`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="line-chart-svg" aria-label={`${label} trend`}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {Array.from({ length: max + 1 }, (_, i) => i).map(tick => {
        const y = PAD.top + innerH - (tick / max) * innerH
        return (
          <g key={tick}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.3)">{tick}</text>
          </g>
        )
      })}
      <path d={area} fill={`url(#${gradId})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="5" fill={color} stroke="#0f172a" strokeWidth="2" />
          {i === data.length - 1 && (
            <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fill={color} fontWeight="700">{p.value.toFixed(1)}</text>
          )}
        </g>
      ))}
      {points.filter((_, i) => i % Math.ceil(points.length / 5) === 0 || i === points.length - 1).map((p, i) => (
        <text key={i} x={p.x} y={H - 6} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)">{p.label}</text>
      ))}
    </svg>
  )
}

/* ─── Radar Chart ─── */
function RadarChart({ pillars }: { pillars: Record<string, number> }) {
  const entries = Object.entries(pillars)
  const N = entries.length
  const CX = 150, CY = 150, R = 110, maxVal = 5
  if (N < 3) return <div className="chart-empty"><span>🕸️</span><p>Complete a mock interview to unlock pillar analysis</p></div>
  function polar(angle: number, radius: number) {
    const rad = (angle - 90) * (Math.PI / 180)
    return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) }
  }
  const rings = [1,2,3,4,5].map(v => entries.map((_, i) => { const p = polar((i/N)*360, (v/maxVal)*R); return `${p.x},${p.y}` }).join(' '))
  const dataPoints = entries.map(([,val], i) => polar((i/N)*360, (Math.min(val,maxVal)/maxVal)*R))
  const polygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ')
  const labels = entries.map(([name,val], i) => { const p = polar((i/N)*360, R+28); return { x:p.x, y:p.y, name, val } })
  const dotColors: Record<string,string> = { problemSolving:'#6366f1', codeCraft:'#22d3ee', architecture:'#f59e0b', communication:'#10b981' }
  const avg = +(entries.reduce((s,[,v]) => s+v, 0)/N).toFixed(1)
  return (
    <div className="radar-wrapper">
      <svg viewBox="0 0 300 300" className="radar-svg">
        <defs><radialGradient id="radarFill"><stop offset="0%" stopColor="#6366f1" stopOpacity="0.4"/><stop offset="100%" stopColor="#22d3ee" stopOpacity="0.1"/></radialGradient></defs>
        {rings.map((pts,i) => <polygon key={i} points={pts} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>)}
        {entries.map((_,i) => { const p = polar((i/N)*360, R); return <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>})}
        <polygon points={polygon} fill="url(#radarFill)" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round"/>
        {dataPoints.map((p,i) => <circle key={i} cx={p.x} cy={p.y} r="5" fill={dotColors[entries[i][0]]||'#6366f1'} stroke="#0f172a" strokeWidth="2"/>)}
        {labels.map((l,i) => (
          <g key={i}>
            <text x={l.x} y={l.y-6} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.65)" fontWeight="600">{l.name.replace(/([A-Z])/g,' $1').trim()}</text>
            <text x={l.x} y={l.y+8} textAnchor="middle" fontSize="11" fill={dotColors[entries[i][0]]||'#6366f1'} fontWeight="700">{l.val.toFixed(1)}/5</text>
          </g>
        ))}
        <circle cx={CX} cy={CY} r="30" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
        <text x={CX} y={CY-4} textAnchor="middle" fontSize="16" fill="#6366f1" fontWeight="800">{avg}</text>
        <text x={CX} y={CY+10} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.5)">avg/5</text>
      </svg>
    </div>
  )
}

/* ─── Donut Chart ─── */
function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s,d) => s+d.value, 0)
  if (total === 0) return <div className="chart-empty"><span>🍩</span><p>No interview verdicts yet</p></div>
  const CX = 80, CY = 80, R = 60, IR = 38
  let currentAngle = -90
  const slices = data.filter(d => d.value > 0).map(d => {
    const start = currentAngle
    currentAngle += (d.value/total)*360
    return { ...d, start, end: currentAngle }
  })
  function arc(s: number, e: number, r: number, ir: number) {
    const toXY = (a: number, rr: number) => ({ x: CX + rr*Math.cos((a*Math.PI)/180), y: CY + rr*Math.sin((a*Math.PI)/180) })
    const p1=toXY(s,r), p2=toXY(e,r), p3=toXY(e,ir), p4=toXY(s,ir)
    const lg = e-s>180?1:0
    return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${lg} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${ir} ${ir} 0 ${lg} 0 ${p4.x} ${p4.y} Z`
  }
  return (
    <div className="donut-wrapper">
      <svg viewBox="0 0 160 160" className="donut-svg">
        {slices.map((s,i) => <path key={i} d={arc(s.start,s.end,R,IR)} fill={s.color} stroke="#0f172a" strokeWidth="2"/>)}
        <text x={CX} y={CY-5} textAnchor="middle" fontSize="20" fill="#f8fafc" fontWeight="800">{total}</text>
        <text x={CX} y={CY+12} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.5)">interviews</text>
      </svg>
      <div className="donut-legend">
        {data.filter(d=>d.value>0).map(d => (
          <div key={d.label} className="donut-legend-item">
            <span className="donut-legend-dot" style={{ background: d.color }}/>
            <span>{d.label}</span>
            <span className="donut-legend-val">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Bar Chart ─── */
function BarChart({ data }: { data: { label: string; value: number; color?: string }[] }) {
  const W = 500, H = 140, PAD = { top: 12, right: 12, bottom: 28, left: 36 }
  const innerW = W-PAD.left-PAD.right
  const innerH = H-PAD.top-PAD.bottom
  const barW = Math.min(innerW/Math.max(data.length,1)-8, 40)
  if (data.length===0) return <div className="chart-empty"><span>📊</span><p>No quiz sessions recorded yet</p></div>
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="bar-chart-svg">
      <defs>{data.map((d,i) => (
        <linearGradient key={i} id={`bar${i}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={d.color||'#6366f1'} stopOpacity="1"/>
          <stop offset="100%" stopColor={d.color||'#6366f1'} stopOpacity="0.4"/>
        </linearGradient>
      ))}</defs>
      {[0,25,50,75,100].map(tick => {
        const y = PAD.top+innerH-(tick/100)*innerH
        return (
          <g key={tick}>
            <line x1={PAD.left} y1={y} x2={W-PAD.right} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            <text x={PAD.left-4} y={y+4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.3)">{tick}%</text>
          </g>
        )
      })}
      {data.map((d,i) => {
        const barH = (d.value/100)*innerH
        const x = PAD.left+(i/data.length)*innerW+(innerW/data.length-barW)/2
        const y = PAD.top+innerH-barH
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="4" fill={`url(#bar${i})`}/>
            {barH>16 && <text x={x+barW/2} y={y+13} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.8)" fontWeight="700">{d.value}%</text>}
            <text x={x+barW/2} y={H-6} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.35)">{d.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

/* ─── Year Heatmap ─── */
function YearHeatmap({ studyDates }: { studyDates: Set<string> }) {
  const weeks = useMemo(() => {
    const now = new Date()
    const start = new Date(now)
    start.setDate(start.getDate()-start.getDay()-52*7)
    const result: Array<Array<{ dateStr:string; active:boolean; label:string }>> = []
    let cur = new Date(start), week: typeof result[0] = []
    while (cur <= now) {
      const ds = `${cur.getFullYear()}-${String(cur.getMonth()+1).padStart(2,'0')}-${String(cur.getDate()).padStart(2,'0')}`
      week.push({ dateStr:ds, active:studyDates.has(ds), label:fmtDate(ds) })
      if (week.length===7) { result.push(week); week=[] }
      cur.setDate(cur.getDate()+1)
    }
    if (week.length>0) result.push(week)
    return result
  }, [studyDates])
  return (
    <div className="year-heatmap-scroll">
      <div className="year-heatmap-grid">
        {weeks.map((week,wi) => (
          <div key={wi} className="heatmap-week-col">
            {week.map(day => (
              <div key={day.dateStr} className={`heatmap-day-cell ${day.active?'active':''}`} title={`${day.label}: ${day.active?'✓ Active':'No activity'}`}/>
            ))}
          </div>
        ))}
      </div>
      <div className="heatmap-month-labels">
        {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <span key={m}>{m}</span>)}
      </div>
    </div>
  )
}

/* ─── Achievement Badge ─── */
interface Achievement {
  id: string; icon: string; title: string; desc: string; unlocked: boolean; progress?: number; max?: number
}
function AchievementBadge({ a }: { a: Achievement }) {
  return (
    <div className={`achievement-badge ${a.unlocked?'unlocked':'locked'}`}>
      <div className="achievement-icon">{a.unlocked?a.icon:'🔒'}</div>
      <div className="achievement-info">
        <div className="achievement-title">{a.title}</div>
        <div className="achievement-desc">{a.desc}</div>
        {a.max && !a.unlocked && (
          <>
            <div className="achievement-progress-bar">
              <div className="achievement-progress-fill" style={{ width:`${Math.min(100,((a.progress||0)/a.max)*100)}%` }}/>
            </div>
            <div className="achievement-progress-text">{a.progress||0} / {a.max}</div>
          </>
        )}
      </div>
      {a.unlocked && <div className="achievement-check">✓</div>}
    </div>
  )
}

/* ─── Readiness Gauge ─── */
function ReadinessGauge({ score }: { score: number }) {
  const s = Math.min(100, Math.max(0, score))
  const circ = 2*Math.PI*54
  const color = s>=75?'#10b981':s>=50?'#f59e0b':'#ef4444'
  const label = s>=80?'Interview Ready! 🚀':s>=60?'Getting There 💪':s>=40?'Keep Practicing 📚':'Just Starting 🌱'
  return (
    <div className="readiness-gauge">
      <svg viewBox="0 0 120 120" className="gauge-svg">
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10"/>
        <circle cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="10" strokeDasharray={`${circ}`} strokeDashoffset={circ-(s/100)*circ} strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition:'stroke-dashoffset 1.5s ease' }}/>
        <text x="60" y="56" textAnchor="middle" fontSize="22" fill={color} fontWeight="800">{s}</text>
        <text x="60" y="72" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.5)">/ 100</text>
      </svg>
      <div className="gauge-label" style={{ color }}>{label}</div>
    </div>
  )
}

/* ─── Main Dashboard ─── */
export default function AnalyticsDashboard() {
  const { solvedIds, streak, studyDates, quizSessions, mockInterviews } = useProgress()
  const { questions } = useQuestions()
  const [activeTab, setActiveTab] = useState<'overview'|'performance'|'activity'|'achievements'>('overview')

  const categories = useMemo(() => getCategories(questions), [questions])
  const totalSolved = solvedIds.size
  const totalQuestionsCount = questions.length || 1

  const scoreTrend = useMemo(() =>
    [...mockInterviews].reverse().slice(-15).map(m => ({ x: fmtDate(m.date), y: m.averageScore }))
  , [mockInterviews])

  const avgPillars = useMemo(() => {
    const wp = mockInterviews.filter(m => m.pillars)
    if (!wp.length) return { problemSolving:0, codeCraft:0, architecture:0, communication:0 }
    const sums = { problemSolving:0, codeCraft:0, architecture:0, communication:0 }
    wp.forEach(m => { if(m.pillars) { sums.problemSolving+=m.pillars.problemSolving; sums.codeCraft+=m.pillars.codeCraft; sums.architecture+=m.pillars.architecture; sums.communication+=m.pillars.communication } })
    const n = wp.length
    return { problemSolving:+(sums.problemSolving/n).toFixed(2), codeCraft:+(sums.codeCraft/n).toFixed(2), architecture:+(sums.architecture/n).toFixed(2), communication:+(sums.communication/n).toFixed(2) }
  }, [mockInterviews])

  const verdictCounts = useMemo(() => {
    const c: Record<string,number> = { 'Strong Hire':0, 'Hire':0, 'Lean Hire':0, 'Needs Practice':0 }
    mockInterviews.forEach(m => { c[m.verdict]=(c[m.verdict]||0)+1 })
    return [
      { label:'Strong Hire', value:c['Strong Hire'], color:'#10b981' },
      { label:'Hire', value:c['Hire'], color:'#6366f1' },
      { label:'Lean Hire', value:c['Lean Hire'], color:'#f59e0b' },
      { label:'Needs Practice', value:c['Needs Practice'], color:'#ef4444' },
    ]
  }, [mockInterviews])

  const quizBarData = useMemo(() =>
    [...quizSessions].reverse().slice(-10).map((s,i) => {
      const pct = s.total>0?Math.round((s.score/s.total)*100):0
      return { label:`S${i+1}`, value:pct, color:pct>=80?'#10b981':pct>=60?'#f59e0b':'#ef4444' }
    })
  , [quizSessions])

  const categoryStats = useMemo(() =>
    categories.map(cat => {
      const catQs = questions.filter(q => q.category===cat)
      const solved = catQs.filter(q => solvedIds.has(q.id)).length
      return { name:cat, total:catQs.length, solved, pct:catQs.length>0?Math.round((solved/catQs.length)*100):0 }
    }).sort((a,b) => b.pct-a.pct)
  , [categories, questions, solvedIds])

  const bestCat = categoryStats[0]
  const worstCat = [...categoryStats].sort((a,b) => a.pct-b.pct).find(c => c.total>0)
  const avgMockScore = mockInterviews.length>0 ? (mockInterviews.reduce((s,m)=>s+m.averageScore,0)/mockInterviews.length).toFixed(1) : null

  const drillAccuracy = useMemo(() => {
    if (!quizSessions.length) return 0
    let total=0, correct=0
    quizSessions.forEach(s => { total+=s.total; correct+=s.score })
    return total>0?Math.round((correct/total)*100):0
  }, [quizSessions])

  const readinessScore = useMemo(() => {
    let score=0
    score += Math.min(30, (totalSolved/Math.max(totalQuestionsCount,1))*30)
    if (avgMockScore) score += Math.min(30, (parseFloat(avgMockScore)/5)*30)
    score += Math.min(20, streak*4)
    score += Math.min(20, (drillAccuracy/100)*20)
    return Math.round(score)
  }, [totalSolved, totalQuestionsCount, avgMockScore, streak, drillAccuracy])

  const achievements: Achievement[] = useMemo(() => [
    { id:'first_solve', icon:'🎯', title:'First Blood', desc:'Solve your first question', unlocked:totalSolved>=1 },
    { id:'ten_solved', icon:'🏅', title:'Momentum Builder', desc:'Solve 10 questions', unlocked:totalSolved>=10, progress:totalSolved, max:10 },
    { id:'fifty_solved', icon:'🥇', title:'Half Century', desc:'Solve 50 questions', unlocked:totalSolved>=50, progress:totalSolved, max:50 },
    { id:'hundred_solved', icon:'💎', title:'Century Club', desc:'Solve 100 questions', unlocked:totalSolved>=100, progress:totalSolved, max:100 },
    { id:'five_hundred', icon:'🌙', title:'Legend', desc:'Solve 500 questions', unlocked:totalSolved>=500, progress:totalSolved, max:500 },
    { id:'streak_3', icon:'🔥', title:'3-Day Streak', desc:'Study 3 days in a row', unlocked:streak>=3, progress:streak, max:3 },
    { id:'streak_7', icon:'⚡', title:'Week Warrior', desc:'Study 7 days in a row', unlocked:streak>=7, progress:streak, max:7 },
    { id:'streak_14', icon:'🌊', title:'Fortnight Focus', desc:'Study 14 days in a row', unlocked:streak>=14, progress:streak, max:14 },
    { id:'streak_30', icon:'🌟', title:'Monthly Grinder', desc:'Study 30 days in a row', unlocked:streak>=30, progress:streak, max:30 },
    { id:'first_mock', icon:'🎬', title:'First Interview', desc:'Complete your first mock interview', unlocked:mockInterviews.length>=1 },
    { id:'five_mocks', icon:'🎭', title:'Interview Veteran', desc:'Complete 5 mock interviews', unlocked:mockInterviews.length>=5, progress:mockInterviews.length, max:5 },
    { id:'ten_mocks', icon:'🏆', title:'Interview Expert', desc:'Complete 10 mock interviews', unlocked:mockInterviews.length>=10, progress:mockInterviews.length, max:10 },
    { id:'strong_hire', icon:'🚀', title:'FAANG Ready', desc:'Achieve "Strong Hire" verdict', unlocked:mockInterviews.some(m=>m.verdict==='Strong Hire') },
    { id:'drill_ace', icon:'🎓', title:'Drill Ace', desc:'Achieve 90%+ drill accuracy', unlocked:drillAccuracy>=90, progress:drillAccuracy, max:90 },
    { id:'all_cats', icon:'🌈', title:'Full Stack Mind', desc:'Solve at least 1 question in every category', unlocked:categoryStats.length>0&&categoryStats.every(c=>c.solved>0), progress:categoryStats.filter(c=>c.solved>0).length, max:categoryStats.length },
  ], [totalSolved, streak, mockInterviews, drillAccuracy, categoryStats])

  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <div className="analytics-page">
      {/* Header */}
      <div className="analytics-header">
        <div className="analytics-header-left">
          <div className="analytics-header-badge">ANALYTICS</div>
          <h1>📊 Performance Analytics</h1>
          <p className="analytics-subtitle">Deep insights into your interview readiness journey</p>
        </div>
        <div className="analytics-header-actions">
          <Link to="/dashboard" className="btn-analytics-secondary">← Dashboard</Link>
          <Link to="/mock-interview" className="btn-analytics-primary">⏱️ Start Mock</Link>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="kpi-strip">
        <div className="kpi-card">
          <div className="kpi-icon">🎯</div>
          <div className="kpi-value">{totalSolved.toLocaleString()}</div>
          <div className="kpi-label">Questions Solved</div>
          <div className="kpi-sub">{Math.round((totalSolved/totalQuestionsCount)*100)}% complete</div>
        </div>
        <div className="kpi-card kpi-streak">
          <div className="kpi-icon">🔥</div>
          <div className="kpi-value">{streak}</div>
          <div className="kpi-label">Day Streak</div>
          <div className="kpi-sub">{studyDates.size} total active days</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">⏱️</div>
          <div className="kpi-value">{mockInterviews.length}</div>
          <div className="kpi-label">Mock Interviews</div>
          <div className="kpi-sub">{avgMockScore ? `Avg ${avgMockScore}/5` : 'None yet'}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">⚡</div>
          <div className="kpi-value">{drillAccuracy}%</div>
          <div className="kpi-label">Drill Accuracy</div>
          <div className="kpi-sub">{quizSessions.length} sessions total</div>
        </div>
        <div className="kpi-card kpi-achievements">
          <div className="kpi-icon">🏆</div>
          <div className="kpi-value">{unlockedCount}/{achievements.length}</div>
          <div className="kpi-label">Achievements</div>
          <div className="kpi-sub">Badges unlocked</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="analytics-tabs" role="tablist">
        {(['overview','performance','activity','achievements'] as const).map(tab => (
          <button key={tab} role="tab" aria-selected={activeTab===tab} className={`analytics-tab ${activeTab===tab?'active':''}`} onClick={() => setActiveTab(tab)}>
            {tab==='overview'&&'🏠 Overview'}{tab==='performance'&&'📈 Performance'}{tab==='activity'&&'📅 Activity'}{tab==='achievements'&&'🏆 Achievements'}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab==='overview' && (
        <div className="analytics-grid">
          <div className="analytics-card readiness-card">
            <h3 className="card-title">🎯 Interview Readiness Score</h3>
            <ReadinessGauge score={readinessScore}/>
            <div className="readiness-breakdown">
              <div className="readiness-row"><span>Questions solved</span><span className="readiness-pts">{Math.min(30,Math.round((totalSolved/totalQuestionsCount)*30))}/30</span></div>
              <div className="readiness-row"><span>Mock interview avg</span><span className="readiness-pts">{avgMockScore?Math.min(30,Math.round((parseFloat(avgMockScore)/5)*30)):0}/30</span></div>
              <div className="readiness-row"><span>Study streak</span><span className="readiness-pts">{Math.min(20,streak*4)}/20</span></div>
              <div className="readiness-row"><span>Drill accuracy</span><span className="readiness-pts">{Math.min(20,Math.round((drillAccuracy/100)*20))}/20</span></div>
            </div>
          </div>

          <div className="analytics-card radar-card">
            <h3 className="card-title">🕸️ FAANG Pillar Breakdown</h3>
            {mockInterviews.some(m=>m.pillars) ? <RadarChart pillars={avgPillars}/> : <div className="chart-empty"><span>🕸️</span><p>Complete a mock interview to unlock pillar analysis</p></div>}
          </div>

          <div className="analytics-card donut-card">
            <h3 className="card-title">🎭 Interview Verdicts</h3>
            <DonutChart data={verdictCounts}/>
          </div>

          <div className="analytics-card category-summary-card">
            <h3 className="card-title">📚 Category Insights</h3>
            {bestCat && (
              <div className="cat-insight">
                <div className="cat-insight-label">💪 Strongest</div>
                <div className="cat-insight-name">{bestCat.name}</div>
                <div className="cat-insight-bar-track"><div className="cat-insight-bar-fill best" style={{ width:`${bestCat.pct}%` }}/></div>
                <div className="cat-insight-pct">{bestCat.pct}%</div>
              </div>
            )}
            {worstCat && worstCat.name!==bestCat?.name && (
              <div className="cat-insight" style={{ marginTop:'16px' }}>
                <div className="cat-insight-label">⚠️ Needs Work</div>
                <div className="cat-insight-name">{worstCat.name}</div>
                <div className="cat-insight-bar-track"><div className="cat-insight-bar-fill worst" style={{ width:`${worstCat.pct}%` }}/></div>
                <div className="cat-insight-pct">{worstCat.pct}%</div>
              </div>
            )}
            <Link to="/dashboard" className="cat-all-link">View all categories →</Link>
          </div>
        </div>
      )}

      {/* ── PERFORMANCE ── */}
      {activeTab==='performance' && (
        <div className="analytics-col">
          <div className="analytics-card full-width-card">
            <h3 className="card-title">📈 Mock Interview Score Trend</h3>
            <p className="card-sub">Average score per session (out of 5)</p>
            <LineChart data={scoreTrend} color="#6366f1" label="Mock score" max={5}/>
          </div>
          <div className="analytics-card full-width-card">
            <h3 className="card-title">⚡ Quiz Drill Accuracy (Last 10 Sessions)</h3>
            <p className="card-sub">Percentage of correct answers per drill session</p>
            <BarChart data={quizBarData}/>
          </div>
          {mockInterviews.length>0 && (
            <div className="analytics-card full-width-card">
              <h3 className="card-title">📋 Interview Session History</h3>
              <div className="session-table-wrapper">
                <table className="session-table">
                  <thead><tr><th>Date</th><th>Track</th><th>Level</th><th>Duration</th><th>Avg Score</th><th>Verdict</th></tr></thead>
                  <tbody>
                    {[...mockInterviews].reverse().map(m => (
                      <tr key={m.id}>
                        <td>{fmtDate(m.date)}</td>
                        <td>{m.track}</td>
                        <td>{m.calibratedLevel||m.level}</td>
                        <td>{m.durationMinutes}m</td>
                        <td><span className={`score-pill ${m.averageScore>=4?'score-high':m.averageScore>=3?'score-mid':'score-low'}`}>{m.averageScore.toFixed(1)}/5</span></td>
                        <td><span className={`verdict-pill verdict-${m.verdict.toLowerCase().replace(/[\s/]+/g,'-')}`}>{m.verdict}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ACTIVITY ── */}
      {activeTab==='activity' && (
        <div className="analytics-col">
          <div className="analytics-card full-width-card">
            <div className="heatmap-header-row">
              <h3 className="card-title">📅 One Year Activity Heatmap</h3>
              <span className="heatmap-active-count">{studyDates.size} active days</span>
            </div>
            <p className="card-sub">Each cell = one day — green means you studied that day</p>
            <YearHeatmap studyDates={studyDates}/>
            <div className="heatmap-legend-row">
              <span className="legend-dot-inactive"/><span>Less</span>
              <span className="legend-dot-active"/><span>More</span>
            </div>
          </div>

          <div className="analytics-card full-width-card">
            <h3 className="card-title">📚 Category Completion Breakdown</h3>
            <div className="cat-completion-list">
              {categoryStats.slice(0,14).map(cat => (
                <div key={cat.name} className="cat-completion-row">
                  <div className="cat-completion-name">{cat.name}</div>
                  <div className="cat-completion-bar-track">
                    <div className="cat-completion-bar-fill" style={{ width:`${cat.pct}%`, background:cat.pct>=75?'#10b981':cat.pct>=40?'#6366f1':'#f59e0b' }}/>
                  </div>
                  <div className="cat-completion-stat">{cat.solved}/{cat.total}</div>
                  <div className="cat-completion-pct" style={{ color:cat.pct>=75?'#10b981':cat.pct>=40?'#6366f1':'#f59e0b' }}>{cat.pct}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-card streak-milestones-card">
            <h3 className="card-title">🔥 Streak Milestones</h3>
            <div className="streak-milestones-grid">
              {[1,3,7,14,30,60,100].map(m => (
                <div key={m} className={`streak-milestone ${streak>=m?'reached':'pending'}`}>
                  <div className="streak-milestone-val">{m}d</div>
                  {streak>=m && <div className="streak-milestone-check">✓</div>}
                </div>
              ))}
            </div>
            <p className="current-streak-note">Current streak: <strong>{streak} day{streak!==1?'s':''}</strong>{streak===0?' — visit daily to build your streak!':''}</p>
          </div>
        </div>
      )}

      {/* ── ACHIEVEMENTS ── */}
      {activeTab==='achievements' && (
        <div className="analytics-col">
          <div className="achievements-summary-row">
            <div className="achievements-progress-ring">
              <svg viewBox="0 0 80 80" className="ach-ring-svg">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7"/>
                <circle cx="40" cy="40" r="34" fill="none" stroke="#f59e0b" strokeWidth="7" strokeDasharray={`${2*Math.PI*34}`} strokeDashoffset={`${2*Math.PI*34*(1-unlockedCount/achievements.length)}`} strokeLinecap="round" transform="rotate(-90 40 40)"/>
                <text x="40" y="44" textAnchor="middle" fontSize="16" fill="#f8fafc" fontWeight="800">{unlockedCount}</text>
              </svg>
            </div>
            <div className="achievements-summary-text">
              <h2>{unlockedCount} of {achievements.length} Badges Earned</h2>
              <p>{achievements.length-unlockedCount} more to unlock — keep practicing!</p>
            </div>
          </div>
          <div className="achievements-grid">
            {achievements.map(a => <AchievementBadge key={a.id} a={a}/>)}
          </div>
        </div>
      )}
    </div>
  )
}
