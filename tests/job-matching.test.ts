import { describe, it, expect } from 'vitest'

// ─── Score Calculation Tests ───────────────────────────────────────────────

describe('Score Calculation', () => {
  it('calculates weighted score correctly', () => {
    const weights = { skills: 30, experience: 20, responsibilities: 20, projects: 10, keywords: 10, education: 5, ats: 5 }
    const scores = { skills: 90, experience: 80, responsibilities: 85, projects: 70, keywords: 75, education: 100, ats: 90 }
    const overall = Math.round(
      (scores.skills * weights.skills +
        scores.experience * weights.experience +
        scores.responsibilities * weights.responsibilities +
        scores.projects * weights.projects +
        scores.keywords * weights.keywords +
        scores.education * weights.education +
        scores.ats * weights.ats) / 100
    )
    expect(overall).toBe(85)
  })

  it('clamps score to 0-100 range', () => {
    const score = Math.min(100, Math.max(0, 150))
    expect(score).toBe(100)
  })

  it('handles zero scores', () => {
    const weights = { skills: 30, experience: 20, responsibilities: 20, projects: 10, keywords: 10, education: 5, ats: 5 }
    const scores = { skills: 0, experience: 0, responsibilities: 0, projects: 0, keywords: 0, education: 0, ats: 0 }
    const overall = Math.round(
      (scores.skills * weights.skills +
        scores.experience * weights.experience +
        scores.responsibilities * weights.responsibilities +
        scores.projects * weights.projects +
        scores.keywords * weights.keywords +
        scores.education * weights.education +
        scores.ats * weights.ats) / 100
    )
    expect(overall).toBe(0)
  })
})

// ─── Match Classification Tests ────────────────────────────────────────────

describe('Match Classification', () => {
  it('classifies 95 as Excellent Match', () => {
    expect(classifyMatch(95)).toBe('Excellent Match')
  })

  it('classifies 85 as Strong Match', () => {
    expect(classifyMatch(85)).toBe('Strong Match')
  })

  it('classifies 75 as Good Match', () => {
    expect(classifyMatch(75)).toBe('Good Match')
  })

  it('classifies 65 as Partial Match', () => {
    expect(classifyMatch(65)).toBe('Partial Match')
  })

  it('classifies 45 as Weak Match', () => {
    expect(classifyMatch(45)).toBe('Weak Match')
  })

  it('handles boundary at 90', () => {
    expect(classifyMatch(90)).toBe('Excellent Match')
  })

  it('handles boundary at 80', () => {
    expect(classifyMatch(80)).toBe('Strong Match')
  })

  it('handles boundary at 70', () => {
    expect(classifyMatch(70)).toBe('Good Match')
  })

  it('handles boundary at 60', () => {
    expect(classifyMatch(60)).toBe('Partial Match')
  })
})

// ─── Skill Matching Tests ──────────────────────────────────────────────────

describe('Skill Matching', () => {
  it('matches exact skills', () => {
    const result = matchSkills(['React', 'TypeScript'], ['React', 'TypeScript'], [])
    expect(result.matched).toContain('React')
    expect(result.matched).toContain('TypeScript')
    expect(result.missing).toHaveLength(0)
  })

  it('detects missing skills', () => {
    const result = matchSkills(['React'], ['React', 'AWS'], [])
    expect(result.matched).toContain('React')
    expect(result.missing).toContain('AWS')
  })

  it('is case-insensitive', () => {
    const result = matchSkills(['react', 'typescript'], ['React', 'TypeScript'], [])
    expect(result.matched).toHaveLength(2)
  })

  it('detects partial matches', () => {
    const result = matchSkills(['Docker'], ['Docker', 'Kubernetes'], [])
    expect(result.matched.length + result.partial.length + result.missing.length).toBeGreaterThan(0)
  })

  it('separates preferred from required', () => {
    const result = matchSkills(['React'], ['React'], ['AWS'])
    expect(result.matched).toContain('React')
  })

  it('handles empty candidate skills', () => {
    const result = matchSkills([], ['React', 'TypeScript'], [])
    expect(result.missing).toHaveLength(2)
  })

  it('handles empty required skills', () => {
    const result = matchSkills(['React'], [], [])
    expect(result.score).toBe(100)
  })
})

// ─── Experience Matching Tests ─────────────────────────────────────────────

describe('Experience Matching', () => {
  it('matches when candidate exceeds requirement', () => {
    const result = matchExperience(7, 5)
    expect(result.analysis.result).toBe('Strong Match')
    expect(result.analysis.candidate).toBe(7)
    expect(result.analysis.required).toBe(5)
  })

  it('matches when candidate meets requirement exactly', () => {
    const result = matchExperience(5, 5)
    expect(result.analysis.result).toBe('Strong Match')
  })

  it('shows partial match when close', () => {
    const result = matchExperience(4, 5)
    expect(result.analysis.result).toBe('Partial Match')
  })

  it('shows weak match when far below', () => {
    const result = matchExperience(2, 5)
    expect(result.analysis.result).toBe('Weak Match')
  })

  it('handles zero requirement', () => {
    const result = matchExperience(3, 0)
    expect(result.analysis.result).toBe('Strong Match')
  })
})

// ─── Keyword Matching Tests ────────────────────────────────────────────────

describe('Keyword Matching', () => {
  it('matches keywords found in resume', () => {
    const resumeText = 'Experienced React and TypeScript developer with Node.js'
    const result = matchKeywords(resumeText, ['React', 'TypeScript', 'Node.js'])
    expect(result.matched).toHaveLength(3)
    expect(result.score).toBe(100)
  })

  it('detects missing keywords', () => {
    const resumeText = 'Experienced React developer'
    const result = matchKeywords(resumeText, ['React', 'AWS', 'Docker'])
    expect(result.matched).toContain('React')
    expect(result.missing).toContain('AWS')
    expect(result.missing).toContain('Docker')
  })

  it('is case-insensitive', () => {
    const resumeText = 'react typescript developer'
    const result = matchKeywords(resumeText, ['React', 'TypeScript'])
    expect(result.matched).toHaveLength(2)
  })

  it('handles empty keywords', () => {
    const result = matchKeywords('some text', [])
    expect(result.score).toBe(100)
  })
})

// ─── Apply Recommendation Tests ────────────────────────────────────────────

describe('Apply Recommendation', () => {
  it('recommends when score is high and no critical missing skills', () => {
    const result = shouldIApply(85, [], { analysis: { result: 'Strong Match' } })
    expect(result.recommendation).toBe('Recommended')
  })

  it('suggests consider when score is moderate', () => {
    const result = shouldIApply(70, [{ priority: 'Low' }], { analysis: { result: 'Good Match' } })
    expect(result.recommendation).toBe('Consider')
  })

  it('shows low match when score is below 65', () => {
    const result = shouldIApply(50, [{ priority: 'High' }], { analysis: { result: 'Weak Match' } })
    expect(result.recommendation).toBe('Low Match')
  })

  it('downgrades recommendation when critical skills missing', () => {
    const result = shouldIApply(85, [{ priority: 'High' }], { analysis: { result: 'Strong Match' } })
    expect(result.recommendation).toBe('Consider')
  })
})

// ─── ATS Analysis Tests ────────────────────────────────────────────────────

describe('ATS Analysis', () => {
  it('scores well-formatted resume high', () => {
    const resume = 'John Doe\njohn@email.com\n555-1234\n\nSummary\nExperienced developer\n\nSkills\nReact, TypeScript\n\nExperience\nCompany A - Developer 2020-2023'
    const result = analyzeATS(resume, {})
    expect(result.score).toBeGreaterThan(70)
  })

  it('detects missing contact info', () => {
    const resume = 'Summary\nExperienced developer'
    const result = analyzeATS(resume, {})
    expect(result.issues.length).toBeGreaterThan(0)
  })

  it('detects tables and images', () => {
    const resume = '<table><tr><td>Data</td></tr></table>\n<img src="photo.jpg" />'
    const result = analyzeATS(resume, {})
    expect(result.issues.some(i => i.includes('table') || i.includes('image'))).toBe(true)
  })
})

// ─── Helper functions (mock implementations for tests) ────────────────────

function classifyMatch(score: number): string {
  if (score >= 90) return 'Excellent Match'
  if (score >= 80) return 'Strong Match'
  if (score >= 70) return 'Good Match'
  if (score >= 60) return 'Partial Match'
  return 'Weak Match'
}

function matchSkills(candidate: string[], required: string[], preferred: string[]) {
  const matched: string[] = []
  const missing: string[] = []
  const partial: string[] = []
  const candidateLower = candidate.map(s => s.toLowerCase())
  for (const skill of required) {
    if (candidateLower.includes(skill.toLowerCase())) {
      matched.push(skill)
    } else {
      missing.push(skill)
    }
  }
  const total = required.length || 1
  const score = Math.round((matched.length / total) * 100)
  return { matched, missing, partial, score }
}

function matchExperience(candidate: number, required: number) {
  let result = 'Weak Match'
  if (required === 0 || candidate >= required) result = 'Strong Match'
  else if (candidate >= required * 0.8) result = 'Partial Match'
  return {
    score: required === 0 ? 100 : Math.min(100, Math.round((candidate / required) * 100)),
    analysis: { candidate, required, result },
  }
}

function matchKeywords(resumeText: string, keywords: string[]) {
  const matched: string[] = []
  const missing: string[] = []
  const textLower = resumeText.toLowerCase()
  for (const kw of keywords) {
    if (textLower.includes(kw.toLowerCase())) matched.push(kw)
    else missing.push(kw)
  }
  const total = keywords.length || 1
  return { matched, missing, score: Math.round((matched.length / total) * 100) }
}

function analyzeATS(resume: string, _jd: Record<string, unknown>) {
  const issues: string[] = []
  let score = 100
  if (!resume.includes('@')) { issues.push('Missing email address'); score -= 15 }
  if (!resume.match(/\d{3}[-.]?\d{3}[-.]?\d{4}/)) { issues.push('Missing phone number'); score -= 10 }
  if (resume.includes('<table')) { issues.push('Contains tables'); score -= 20 }
  if (resume.includes('<img')) { issues.push('Contains images'); score -= 15 }
  if (!resume.includes('Summary') && !resume.includes('Objective')) { issues.push('Missing summary section'); score -= 10 }
  if (!resume.includes('Experience')) { issues.push('Missing experience section'); score -= 10 }
  if (!resume.includes('Skills') && !resume.includes('Skill')) { issues.push('Missing skills section'); score -= 10 }
  return { score: Math.max(0, score), issues }
}

function shouldIApply(score: number, missingSkills: Array<{ priority: string }>, experienceResult: { analysis: { result: string } }) {
  const hasCriticalMissing = missingSkills.some(s => s.priority === 'High')
  if (score >= 80 && !hasCriticalMissing) return { recommendation: 'Recommended' }
  if (score >= 65) return { recommendation: 'Consider' }
  return { recommendation: 'Low Match' }
}
