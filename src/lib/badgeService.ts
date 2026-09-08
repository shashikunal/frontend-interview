// Badge & Achievement Service for Candidate Gamification
// Evaluates real user progress and computes tier, XP, and unlock status.

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'diamond'
export type BadgeCategory = 'starter' | 'streak' | 'machine_coding' | 'mock_interview' | 'mastery'

export interface BadgeDefinition {
  id: string
  title: string
  description: string
  icon: string
  tier: BadgeTier
  category: BadgeCategory
  xp: number
  target: number
  unit: string
  evaluate: (stats: CandidateStats) => { current: number; unlocked: boolean }
}

export interface CandidateStats {
  solvedCount: number
  streakDays: number
  mockCount: number
  strongHireCount: number
  bookmarkedCount: number
  machineCodingCount: number
}

export interface EvaluatedBadge extends BadgeDefinition {
  current: number
  unlocked: boolean
  progressPercent: number
  unlockedAt?: string
}

export interface CandidateLevelInfo {
  level: number
  title: string
  currentXp: number
  xpForCurrentLevel: number
  xpForNextLevel: number
  progressPercent: number
  totalBadgesUnlocked: number
  totalBadgesCount: number
}

const STORAGE_KEY_UNLOCKED_AT = 'interview-prep-badge-unlocks-v1'
const STORAGE_KEY_NOTIFIED = 'interview-prep-badge-notified-v1'

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // ── STARTER BADGES ──────────────────────────────────────────────
  {
    id: 'hello-world',
    title: 'Hello World',
    description: 'Solve your very first technical question.',
    icon: '🐣',
    tier: 'bronze',
    category: 'starter',
    xp: 50,
    target: 1,
    unit: 'questions',
    evaluate: (s) => ({ current: Math.min(1, s.solvedCount), unlocked: s.solvedCount >= 1 }),
  },
  {
    id: 'curious-mind',
    title: 'Curious Mind',
    description: 'Solve 5 interview prep questions across any topic.',
    icon: '🔍',
    tier: 'bronze',
    category: 'starter',
    xp: 100,
    target: 5,
    unit: 'questions',
    evaluate: (s) => ({ current: Math.min(5, s.solvedCount), unlocked: s.solvedCount >= 5 }),
  },
  {
    id: 'problem-solver',
    title: 'Problem Solver',
    description: 'Successfully complete 25 interview questions.',
    icon: '💡',
    tier: 'silver',
    category: 'starter',
    xp: 250,
    target: 25,
    unit: 'questions',
    evaluate: (s) => ({ current: Math.min(25, s.solvedCount), unlocked: s.solvedCount >= 25 }),
  },
  {
    id: 'centurion',
    title: 'Centurion',
    description: 'Master 100 coding questions in the question catalog.',
    icon: '💯',
    tier: 'gold',
    category: 'starter',
    xp: 500,
    target: 100,
    unit: 'questions',
    evaluate: (s) => ({ current: Math.min(100, s.solvedCount), unlocked: s.solvedCount >= 100 }),
  },

  // ── STREAK BADGES ───────────────────────────────────────────────
  {
    id: 'daily-habit',
    title: 'Daily Habit',
    description: 'Maintain a 3-day continuous study streak.',
    icon: '🔥',
    tier: 'bronze',
    category: 'streak',
    xp: 100,
    target: 3,
    unit: 'days',
    evaluate: (s) => ({ current: Math.min(3, s.streakDays), unlocked: s.streakDays >= 3 }),
  },
  {
    id: 'dedicated-coder',
    title: 'Dedicated Coder',
    description: 'Achieve a 7-day continuous study streak.',
    icon: '⚡',
    tier: 'silver',
    category: 'streak',
    xp: 250,
    target: 7,
    unit: 'days',
    evaluate: (s) => ({ current: Math.min(7, s.streakDays), unlocked: s.streakDays >= 7 }),
  },
  {
    id: 'fortnight-champion',
    title: 'Fortnight Champion',
    description: 'Build an unbroken 14-day study streak.',
    icon: '🛡️',
    tier: 'gold',
    category: 'streak',
    xp: 500,
    target: 14,
    unit: 'days',
    evaluate: (s) => ({ current: Math.min(14, s.streakDays), unlocked: s.streakDays >= 14 }),
  },
  {
    id: 'iron-discipline',
    title: 'Iron Discipline',
    description: 'Reach a legendary 30-day streak of daily practice.',
    icon: '👑',
    tier: 'diamond',
    category: 'streak',
    xp: 1000,
    target: 30,
    unit: 'days',
    evaluate: (s) => ({ current: Math.min(30, s.streakDays), unlocked: s.streakDays >= 30 }),
  },

  // ── MACHINE CODING BADGES ───────────────────────────────────────
  {
    id: 'sandbox-pioneer',
    title: 'Sandbox Pioneer',
    description: 'Run and validate code in the Machine Coding Studio.',
    icon: '💻',
    tier: 'bronze',
    category: 'machine_coding',
    xp: 100,
    target: 1,
    unit: 'challenge',
    evaluate: (s) => ({ current: Math.min(1, s.machineCodingCount), unlocked: s.machineCodingCount >= 1 }),
  },
  {
    id: 'code-artisan',
    title: 'Code Artisan',
    description: 'Tackle 3 full-featured machine coding challenges.',
    icon: '⚙️',
    tier: 'silver',
    category: 'machine_coding',
    xp: 300,
    target: 3,
    unit: 'challenges',
    evaluate: (s) => ({ current: Math.min(3, s.machineCodingCount), unlocked: s.machineCodingCount >= 3 }),
  },
  {
    id: 'master-builder',
    title: 'Master Builder',
    description: 'Complete 8 machine coding studio implementations.',
    icon: '🏗️',
    tier: 'gold',
    category: 'machine_coding',
    xp: 600,
    target: 8,
    unit: 'challenges',
    evaluate: (s) => ({ current: Math.min(8, s.machineCodingCount), unlocked: s.machineCodingCount >= 8 }),
  },

  // ── MOCK INTERVIEWS ─────────────────────────────────────────────
  {
    id: 'interview-ready',
    title: 'Interview Ready',
    description: 'Complete your first full timed Mock Interview simulation.',
    icon: '🎙️',
    tier: 'bronze',
    category: 'mock_interview',
    xp: 150,
    target: 1,
    unit: 'mock',
    evaluate: (s) => ({ current: Math.min(1, s.mockCount), unlocked: s.mockCount >= 1 }),
  },
  {
    id: 'mock-veteran',
    title: 'Mock Veteran',
    description: 'Complete 3 mock interview calibration sessions.',
    icon: '🎯',
    tier: 'silver',
    category: 'mock_interview',
    xp: 350,
    target: 3,
    unit: 'mocks',
    evaluate: (s) => ({ current: Math.min(3, s.mockCount), unlocked: s.mockCount >= 3 }),
  },
  {
    id: 'strong-hire',
    title: 'Strong Hire',
    description: 'Receive an official "Strong Hire" verdict in a mock interview.',
    icon: '🌟',
    tier: 'gold',
    category: 'mock_interview',
    xp: 500,
    target: 1,
    unit: 'hire',
    evaluate: (s) => ({ current: Math.min(1, s.strongHireCount), unlocked: s.strongHireCount >= 1 }),
  },

  // ── MASTERY & HABITS ────────────────────────────────────────────
  {
    id: 'revision-curator',
    title: 'Revision Curator',
    description: 'Save 5 high-priority questions to your revision list.',
    icon: '⭐',
    tier: 'bronze',
    category: 'mastery',
    xp: 75,
    target: 5,
    unit: 'bookmarks',
    evaluate: (s) => ({ current: Math.min(5, s.bookmarkedCount), unlocked: s.bookmarkedCount >= 5 }),
  },
  {
    id: 'grandmaster',
    title: 'Grandmaster',
    description: 'Unlock at least 8 other achievements across the platform.',
    icon: '🏆',
    tier: 'diamond',
    category: 'mastery',
    xp: 1500,
    target: 8,
    unit: 'badges',
    evaluate: (s) => {
      // Evaluate other 15 badges
      const otherUnlocks = BADGE_DEFINITIONS.filter(b => b.id !== 'grandmaster')
        .map(b => b.evaluate(s).unlocked)
        .filter(Boolean).length
      return { current: Math.min(8, otherUnlocks), unlocked: otherUnlocks >= 8 }
    },
  },
]

// ── Level Thresholds ────────────────────────────────────────────────
const LEVEL_THRESHOLDS = [
  { level: 1, title: 'Apprentice Candidate', minXp: 0, maxXp: 150 },
  { level: 2, title: 'Junior Frontend Dev', minXp: 150, maxXp: 450 },
  { level: 3, title: 'Mid-Level Engineer', minXp: 450, maxXp: 950 },
  { level: 4, title: 'Senior Frontend Craftsman', minXp: 950, maxXp: 1750 },
  { level: 5, title: 'Staff Frontend Architect', minXp: 1750, maxXp: 2800 },
  { level: 6, title: 'Principal Tech Lead', minXp: 2800, maxXp: 4200 },
  { level: 7, title: 'Fellow Frontend Master', minXp: 4200, maxXp: 6000 },
]

export const badgeService = {
  // Get stored unlock timestamps
  getStoredUnlockMap(): Record<string, string> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_UNLOCKED_AT)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  },

  // Save an unlock timestamp if not already recorded
  recordUnlock(badgeId: string): string {
    const map = this.getStoredUnlockMap()
    if (!map[badgeId]) {
      map[badgeId] = new Date().toISOString()
      try {
        localStorage.setItem(STORAGE_KEY_UNLOCKED_AT, JSON.stringify(map))
      } catch {
        // storage full/disabled
      }
    }
    return map[badgeId]
  },

  // Evaluate all badges for current candidate
  evaluateBadges(stats: CandidateStats): EvaluatedBadge[] {
    const unlockMap = this.getStoredUnlockMap()
    let updated = false

    const evaluated: EvaluatedBadge[] = BADGE_DEFINITIONS.map(badge => {
      const { current, unlocked } = badge.evaluate(stats)
      let unlockedAt = unlockMap[badge.id]

      if (unlocked && !unlockedAt) {
        unlockedAt = new Date().toISOString()
        unlockMap[badge.id] = unlockedAt
        updated = true
      }

      const progressPercent = Math.min(100, Math.round((current / badge.target) * 100))

      return {
        ...badge,
        current,
        unlocked,
        progressPercent,
        unlockedAt,
      }
    })

    if (updated) {
      try {
        localStorage.setItem(STORAGE_KEY_UNLOCKED_AT, JSON.stringify(unlockMap))
      } catch {
        // ignore
      }
    }

    return evaluated
  },

  // Calculate Level and XP
  calculateLevelInfo(evaluatedBadges: EvaluatedBadge[]): CandidateLevelInfo {
    const unlockedBadges = evaluatedBadges.filter(b => b.unlocked)
    const currentXp = unlockedBadges.reduce((acc, b) => acc + b.xp, 0)

    let matchedLevel = LEVEL_THRESHOLDS[0]
    for (const lvl of LEVEL_THRESHOLDS) {
      if (currentXp >= lvl.minXp) {
        matchedLevel = lvl
      }
    }

    const xpForCurrentLevel = matchedLevel.minXp
    const xpForNextLevel = matchedLevel.maxXp
    const range = xpForNextLevel - xpForCurrentLevel
    const progressInLevel = Math.max(0, currentXp - xpForCurrentLevel)
    const progressPercent = Math.min(100, Math.round((progressInLevel / range) * 100))

    return {
      level: matchedLevel.level,
      title: matchedLevel.title,
      currentXp,
      xpForCurrentLevel,
      xpForNextLevel,
      progressPercent,
      totalBadgesUnlocked: unlockedBadges.length,
      totalBadgesCount: evaluatedBadges.length,
    }
  },

  // Map of badge IDs that have already triggered a notification toast
  getNotifiedMap(): Record<string, boolean> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_NOTIFIED)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  },

  // Mark a badge as notified so the celebratory toast fires once
  markNotified(badgeId: string): void {
    const map = this.getNotifiedMap()
    map[badgeId] = true
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFIED, JSON.stringify(map))
    } catch {
      // ignore storage error
    }
  },

  // Check stats, identify any brand-new unlocks, and dispatch custom event
  checkAndNotifyNewUnlocks(stats: CandidateStats): EvaluatedBadge[] {
    const evaluated = this.evaluateBadges(stats)
    const notifiedMap = this.getNotifiedMap()
    const newlyUnlocked: EvaluatedBadge[] = []

    for (const badge of evaluated) {
      if (badge.unlocked && !notifiedMap[badge.id]) {
        this.markNotified(badge.id)
        newlyUnlocked.push(badge)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('achievement:unlocked', { detail: badge }))
        }
      }
    }

    return newlyUnlocked
  },
}

// Synthesizes a celebratory crystal-clear victory chime using Web Audio API
export function playAchievementChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const now = ctx.currentTime

    // Oscillator 1: fundamental victory chime (D5 -> A5)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'triangle'
    osc1.frequency.setValueAtTime(587.33, now)
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.14)
    gain1.gain.setValueAtTime(0.18, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.45)

    // Oscillator 2: higher harmonic sparkle (A5 -> E6)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(880, now + 0.1)
    osc2.frequency.exponentialRampToValueAtTime(1318.51, now + 0.26)
    gain2.gain.setValueAtTime(0.15, now + 0.1)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now + 0.1)
    osc2.stop(now + 0.7)
  } catch {
    // AudioContext blocked or user interaction needed
  }
}

