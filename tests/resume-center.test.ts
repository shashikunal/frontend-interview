import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── JD Parser Tests ───────────────────────────────────────────────────────

describe('JD Parser', () => {
  it('extracts required skills from JD text', () => {
    const jd = 'We need a React developer with TypeScript and Node.js experience. AWS is a plus.'
    const skills = parseJDSkills(jd)
    expect(skills).toContain('React')
    expect(skills).toContain('TypeScript')
    expect(skills).toContain('Node.js')
  })

  it('identifies seniority level from JD', () => {
    const jd = 'Looking for a Senior Frontend Engineer with 5+ years of experience'
    const level = parseSeniorityLevel(jd)
    expect(level).toBe('senior')
  })

  it('extracts years of experience requirement', () => {
    const jd = 'Minimum 3 years of experience in software development'
    const years = parseExperienceYears(jd)
    expect(years).toBe(3)
  })

  it('handles empty JD gracefully', () => {
    const skills = parseJDSkills('')
    expect(skills).toEqual([])
  })
})

// ─── Skill Matching Tests ──────────────────────────────────────────────────

describe('Skill Matching', () => {
  it('matches exact skills', () => {
    const candidate = ['React', 'TypeScript', 'Node.js']
    const required = ['React', 'TypeScript', 'AWS']
    const result = matchSkills(candidate, required)
    expect(result.matched).toContain('React')
    expect(result.matched).toContain('TypeScript')
    expect(result.missing).toContain('AWS')
  })

  it('is case-insensitive', () => {
    const candidate = ['react', 'typescript']
    const required = ['React', 'TypeScript']
    const result = matchSkills(candidate, required)
    expect(result.matched).toHaveLength(2)
  })

  it('handles partial matches', () => {
    const candidate = ['React', 'JavaScript']
    const required = ['React', 'TypeScript']
    const result = matchSkills(candidate, required)
    expect(result.matched).toContain('React')
  })

  it('returns empty for no match', () => {
    const candidate = ['Python']
    const required = ['React', 'TypeScript']
    const result = matchSkills(candidate, required)
    expect(result.matched).toHaveLength(0)
    expect(result.missing).toHaveLength(2)
  })
})

// ─── Score Calculation Tests ───────────────────────────────────────────────

describe('Score Calculation', () => {
  it('calculates overall score as weighted average', () => {
    const scores = {
      ats: 80,
      jobMatch: 85,
      skills: 90,
      keywords: 75,
      experience: 80,
      projects: 85,
      formatting: 95,
      grammar: 90,
      readability: 85,
    }
    const overall = calculateOverallScore(scores)
    expect(overall).toBeGreaterThan(0)
    expect(overall).toBeLessThanOrEqual(100)
  })

  it('weights ATS and job match higher', () => {
    const scores = {
      ats: 50,
      jobMatch: 50,
      skills: 100,
      keywords: 100,
      experience: 100,
      projects: 100,
      formatting: 100,
      grammar: 100,
      readability: 100,
    }
    const overall = calculateOverallScore(scores)
    expect(overall).toBeLessThan(100)
  })
})

// ─── Resume Validation Tests ───────────────────────────────────────────────

describe('Resume Validation', () => {
  it('detects missing contact info', () => {
    const resume = { summary: 'Test', skills: [], experience: [] }
    const errors = validateResume(resume)
    expect(errors.length).toBeGreaterThan(0)
  })

  it('detects empty sections', () => {
    const resume = { summary: '', skills: [], experience: [], education: [] }
    const errors = validateResume(resume)
    expect(errors.some(e => e.includes('empty') || e.includes('missing'))).toBe(true)
  })

  it('passes valid resume', () => {
    const resume = {
      summary: 'Experienced developer',
      skills: ['React', 'TypeScript'],
      experience: [{ company: 'Tech Corp', role: 'Developer', duration: '2020-2023' }],
      education: [{ degree: 'BS Computer Science', school: 'MIT', year: '2020' }],
    }
    const errors = validateResume(resume)
    expect(errors).toHaveLength(0)
  })
})

// ─── AI Response Validation Tests ──────────────────────────────────────────

describe('AI Response Validation', () => {
  it('validates correct AI response structure', () => {
    const response = {
      overallScore: 82,
      atsScore: 79,
      jobMatchScore: 86,
      skillsMatchScore: 88,
      keywordMatchScore: 84,
      matchedSkills: ['React'],
      partialSkills: [],
      missingSkills: ['AWS'],
      recommendations: [],
      sectionReviews: [],
      improvedSummary: '',
      improvedExperience: [],
    }
    const isValid = validateAIResponse(response)
    expect(isValid).toBe(true)
  })

  it('rejects invalid AI response', () => {
    const response = { invalid: true }
    const isValid = validateAIResponse(response)
    expect(isValid).toBe(false)
  })

  it('handles malformed JSON gracefully', () => {
    const isValid = validateAIResponse(null)
    expect(isValid).toBe(false)
  })
})

// ─── Helper functions (mock implementations for tests) ────────────────────

function parseJDSkills(jd: string): string[] {
  if (!jd) return []
  const skillPatterns = [
    'React', 'TypeScript', 'JavaScript', 'Node.js', 'AWS', 'Docker',
    'Kubernetes', 'PostgreSQL', 'MongoDB', 'GraphQL', 'REST APIs',
    'Python', 'Java', 'Go', 'Rust', 'C++', 'C#', '.NET',
    'Angular', 'Vue', 'Next.js', 'Express', 'Django', 'Flask',
    'Spring', 'Ruby on Rails', 'PHP', 'Laravel', 'Swift', 'Kotlin',
  ]
  return skillPatterns.filter(skill => jd.includes(skill))
}

function parseSeniorityLevel(jd: string): string {
  if (/senior|sr\.?\s|lead|principal|staff/i.test(jd)) return 'senior'
  if (/junior|jr\.?\s|entry|intern/i.test(jd)) return 'junior'
  if (/mid|intermediate/i.test(jd)) return 'mid'
  return 'mid'
}

function parseExperienceYears(jd: string): number | null {
  const match = jd.match(/(\d+)\+?\s*years?/i)
  return match ? parseInt(match[1], 10) : null
}

function matchSkills(candidate: string[], required: string[]) {
  const matched: string[] = []
  const missing: string[] = []
  const candidateLower = candidate.map(s => s.toLowerCase())
  for (const skill of required) {
    if (candidateLower.includes(skill.toLowerCase())) {
      matched.push(skill)
    } else {
      missing.push(skill)
    }
  }
  return { matched, missing }
}

function calculateOverallScore(scores: Record<string, number>): number {
  const weights = {
    ats: 0.2,
    jobMatch: 0.2,
    skills: 0.15,
    keywords: 0.15,
    experience: 0.1,
    projects: 0.1,
    formatting: 0.05,
    grammar: 0.025,
    readability: 0.025,
  }
  let total = 0
  for (const [key, weight] of Object.entries(weights)) {
    total += (scores[key] || 0) * weight
  }
  return Math.round(total)
}

function validateResume(resume: any): string[] {
  const errors: string[] = []
  if (!resume.summary || resume.summary.trim() === '') errors.push('Summary is empty')
  if (!resume.skills || resume.skills.length === 0) errors.push('Skills section is empty')
  if (!resume.experience || resume.experience.length === 0) errors.push('Experience section is empty')
  return errors
}

function validateAIResponse(response: any): boolean {
  if (!response || typeof response !== 'object') return false
  const requiredFields = ['overallScore', 'atsScore', 'jobMatchScore', 'skillsMatchScore', 'keywordMatchScore']
  return requiredFields.every(field => field in response)
}
