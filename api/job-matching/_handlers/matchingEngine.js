export const SCORING_WEIGHTS = {
  skills: 30,
  experience: 20,
  responsibilities: 20,
  projects: 10,
  keywords: 10,
  education: 5,
  ats: 5,
}

function normalizeSkill(skill) {
  return String(skill || '').toLowerCase().trim().replace(/[._-]/g, ' ')
}

function skillsOverlap(a, b) {
  const tokensA = normalizeSkill(a).split(/\s+/).filter(Boolean)
  const tokensB = normalizeSkill(b).split(/\s+/).filter(Boolean)
  return tokensA.some(t => tokensB.includes(t)) || tokensB.some(t => tokensA.includes(t))
}

export function calculateMatchScore(resumeData, jdData) {
  const skillsResult = matchSkills(
    resumeData.skills || [],
    jdData.requiredSkills || [],
    jdData.preferredSkills || []
  )
  const experienceResult = matchExperience(resumeData.experience, jdData.requiredYears)
  const responsibilityResult = matchResponsibilities(
    resumeData.resumeText || '',
    jdData.responsibilities || []
  )
  const projectResult = matchProjects(resumeData.projects || [], jdData.domain || '')
  const keywordResult = matchKeywords(resumeData.resumeText || '', jdData.keywords || [])
  const educationScore = scoreEducation(resumeData.education, jdData.requiredEducation)
  const atsScore = analyzeATS(resumeData.resumeText || '', jdData)

  const skillsScore = skillsResult.score
  const experienceScore = experienceResult.score
  const responsibilityScore = responsibilityResult.score
  const projectScore = projectResult.score
  const keywordScore = keywordResult.score

  const overallScore = Math.round(
    (skillsScore * SCORING_WEIGHTS.skills +
      experienceScore * SCORING_WEIGHTS.experience +
      responsibilityScore * SCORING_WEIGHTS.responsibilities +
      projectScore * SCORING_WEIGHTS.projects +
      keywordScore * SCORING_WEIGHTS.keywords +
      educationScore * SCORING_WEIGHTS.education +
      atsScore * SCORING_WEIGHTS.ats) / 100
  )

  return {
    overallScore: Math.min(100, Math.max(0, overallScore)),
    classification: classifyMatch(overallScore),
    atsScore,
    skillsScore,
    experienceScore,
    responsibilityScore,
    projectScore,
    keywordScore,
    educationScore,
    certificationScore: scoreCertifications(resumeData.certifications || [], jdData.preferredCertifications || []),
    matchedSkills: skillsResult.matched,
    partialSkills: skillsResult.partial,
    missingSkills: skillsResult.missing,
    matchedResponsibilities: responsibilityResult.matched,
    missingResponsibilities: responsibilityResult.missing,
    experienceAnalysis: experienceResult.analysis,
    recommendations: generateRecommendations({
      overallScore,
      skillsResult,
      experienceResult,
      responsibilityResult,
      projectResult,
      keywordResult,
      educationScore,
      atsScore,
    }),
    applyRecommendation: shouldIApply(overallScore, skillsResult.missing, experienceResult),
    applyReasons: buildApplyReasons(overallScore, skillsResult.missing, experienceResult),
    scoreBreakdown: {
      skills: { weight: SCORING_WEIGHTS.skills, score: Math.round(skillsScore * SCORING_WEIGHTS.skills / 100) },
      experience: { weight: SCORING_WEIGHTS.experience, score: Math.round(experienceScore * SCORING_WEIGHTS.experience / 100) },
      responsibilities: { weight: SCORING_WEIGHTS.responsibilities, score: Math.round(responsibilityScore * SCORING_WEIGHTS.responsibilities / 100) },
      projects: { weight: SCORING_WEIGHTS.projects, score: Math.round(projectScore * SCORING_WEIGHTS.projects / 100) },
      keywords: { weight: SCORING_WEIGHTS.keywords, score: Math.round(keywordScore * SCORING_WEIGHTS.keywords / 100) },
      education: { weight: SCORING_WEIGHTS.education, score: Math.round(educationScore * SCORING_WEIGHTS.education / 100) },
      ats: { weight: SCORING_WEIGHTS.ats, score: Math.round(atsScore * SCORING_WEIGHTS.ats / 100) },
    },
  }
}

export function classifyMatch(score) {
  if (score >= 90) return 'Excellent Match'
  if (score >= 80) return 'Strong Match'
  if (score >= 70) return 'Good Match'
  if (score >= 60) return 'Partial Match'
  return 'Weak Match'
}

export function matchSkills(candidateSkills = [], requiredSkills = [], preferredSkills = []) {
  const matched = []
  const partial = []
  const missing = []

  const candidateNormalized = candidateSkills.map(s => normalizeSkill(s))

  for (const req of requiredSkills) {
    const reqNorm = normalizeSkill(req)
    const exact = candidateNormalized.find(c => c === reqNorm)
    const overlap = candidateNormalized.find(c => skillsOverlap(c, req))

    if (exact) {
      matched.push({ skill: req, evidence: `Found "${req}" in candidate skills` })
    } else if (overlap) {
      partial.push({
        skill: req,
        evidence: `Partial match with "${overlap}"`,
        gap: `Candidate has related skill "${overlap}" but not exact "${req}"`,
      })
    } else {
      missing.push({
        skill: req,
        priority: 'High',
        reason: `Required skill "${req}" not found in candidate profile`,
      })
    }
  }

  for (const pref of preferredSkills) {
    const prefNorm = normalizeSkill(pref)
    const exact = candidateNormalized.find(c => c === prefNorm)
    const overlap = candidateNormalized.find(c => skillsOverlap(c, pref))

    if (exact) {
      matched.push({ skill: pref, evidence: `Preferred skill "${pref}" found` })
    } else if (overlap) {
      partial.push({
        skill: pref,
        evidence: `Partial match with "${overlap}"`,
        gap: `Candidate has related skill "${overlap}" but not exact "${pref}"`,
      })
    } else {
      missing.push({
        skill: pref,
        priority: 'Low',
        reason: `Preferred skill "${pref}" not found but not required`,
      })
    }
  }

  const totalRequired = requiredSkills.length
  const matchedRequired = matched.filter(m =>
    requiredSkills.some(r => normalizeSkill(r) === normalizeSkill(m.skill))
  ).length
  const partialRequired = partial.filter(p =>
    requiredSkills.some(r => normalizeSkill(r) === normalizeSkill(p.skill))
  ).length

  const score = totalRequired === 0
    ? 80
    : Math.round(((matchedRequired + partialRequired * 0.5) / totalRequired) * 100)

  return { matched, partial, missing, score: Math.min(100, score) }
}

export function matchExperience(candidateExp, requiredYears) {
  const candidateYears = parseYears(candidateExp)
  const required = parseYears(requiredYears)

  if (!required || required === 0) {
    return {
      score: 75,
      analysis: {
        required: requiredYears || 'Not specified',
        candidate: candidateExp || 'Not specified',
        relevant: candidateYears || 0,
        result: 'No requirement specified',
      },
    }
  }

  if (!candidateYears && candidateYears !== 0) {
    return {
      score: 40,
      analysis: {
        required: requiredYears,
        candidate: 'Not specified',
        relevant: 0,
        result: 'Insufficient data',
      },
    }
  }

  const ratio = candidateYears / required
  let score
  let result

  if (ratio >= 1.5) {
    score = 100
    result = 'Exceeds Requirements'
  } else if (ratio >= 1.0) {
    score = 90
    result = 'Strong Match'
  } else if (ratio >= 0.75) {
    score = 75
    result = 'Good Match'
  } else if (ratio >= 0.5) {
    score = 60
    result = 'Partial Match'
  } else {
    score = 40
    result = 'Below Requirements'
  }

  return {
    score,
    analysis: {
      required: requiredYears,
      candidate: candidateExp,
      relevant: candidateYears,
      result,
    },
  }
}

export function matchResponsibilities(resumeText = '', responsibilities = []) {
  const matched = []
  const missing = []
  const resumeLower = resumeText.toLowerCase()

  for (const resp of responsibilities) {
    const respLower = String(resp).toLowerCase()
    const keywords = respLower.split(/\s+/).filter(w => w.length > 3)
    const matchCount = keywords.filter(k => resumeLower.includes(k)).length
    const matchRatio = keywords.length > 0 ? matchCount / keywords.length : 0

    if (matchRatio >= 0.5) {
      matched.push({
        responsibility: resp,
        evidence: `Found ${matchCount}/${keywords.length} key terms in resume`,
        match: matchRatio >= 0.8 ? 'Strong' : 'Moderate',
      })
    } else {
      missing.push({
        responsibility: resp,
        reason: `Only ${matchCount}/${keywords.length} key terms found in resume`,
      })
    }
  }

  const score = responsibilities.length === 0
    ? 70
    : Math.round((matched.length / responsibilities.length) * 100)

  return { matched, missing, score: Math.min(100, score) }
}

export function matchProjects(projects = [], jdDomain = '') {
  if (!Array.isArray(projects) || projects.length === 0) {
    return { score: 50, relevant: [], note: 'No projects provided' }
  }

  const domainKeywords = jdDomain.toLowerCase().split(/[\s,]+/).filter(Boolean)
  const relevant = []

  for (const project of projects) {
    const projText = `${project.name || ''} ${project.description || ''} ${project.technologies || ''}`.toLowerCase()
    const matchCount = domainKeywords.filter(k => projText.includes(k)).length
    if (matchCount > 0 || domainKeywords.length === 0) {
      relevant.push({
        name: project.name || 'Unnamed Project',
        relevance: matchCount > 0 ? 'High' : 'General',
      })
    }
  }

  const score = relevant.length === 0 ? 40 : Math.min(100, 50 + relevant.length * 15)

  return { score, relevant }
}

export function matchKeywords(resumeText = '', jdKeywords = []) {
  if (!Array.isArray(jdKeywords) || jdKeywords.length === 0) {
    return { score: 70, matched: [], missing: [] }
  }

  const resumeLower = resumeText.toLowerCase()
  const matched = []
  const missing = []

  for (const keyword of jdKeywords) {
    if (resumeLower.includes(String(keyword).toLowerCase())) {
      matched.push(keyword)
    } else {
      missing.push(keyword)
    }
  }

  const score = Math.round((matched.length / jdKeywords.length) * 100)

  return { score, matched, missing }
}

export function analyzeATS(resumeContent = '', jdContent = '') {
  let score = 100
  const issues = []

  if (!resumeContent || resumeContent.length < 100) {
    score -= 30
    issues.push('Resume content is too short for ATS parsing')
  }

  const hasContactInfo = /@|\d{3}[-.]?\d{3}[-.]?\d{4}/.test(resumeContent)
  if (!hasContactInfo) {
    score -= 15
    issues.push('Missing contact information (email or phone)')
  }

  const hasSections = /experience|education|skills|summary|objective/i.test(resumeContent)
  if (!hasSections) {
    score -= 20
    issues.push('Missing standard resume sections')
  }

  const hasBullets = resumeContent.includes('•') || resumeContent.includes('-') || resumeContent.includes('*')
  if (!hasBullets) {
    score -= 10
    issues.push('No bullet points detected — ATS may struggle to parse achievements')
  }

  const hasActionVerbs = /led|built|developed|designed|created|implemented|managed|improved|increased|reduced|launched|architected/i.test(resumeContent)
  if (!hasActionVerbs) {
    score -= 10
    issues.push('No strong action verbs detected')
  }

  const hasQuantified = /\d+%|\$\d+|\d+\+?/i.test(resumeContent)
  if (!hasQuantified) {
    score -= 10
    issues.push('No quantified achievements detected')
  }

  if (jdContent) {
    const jdWords = jdContent.toLowerCase().split(/\s+/).filter(w => w.length > 4)
    const resumeWords = resumeContent.toLowerCase().split(/\s+/)
    const overlap = jdWords.filter(w => resumeWords.includes(w)).length
    const overlapRatio = jdWords.length > 0 ? overlap / jdWords.length : 0
    if (overlapRatio < 0.1) {
      score -= 15
      issues.push('Low keyword overlap with job description')
    }
  }

  return { score: Math.max(0, score), issues }
}

export function generateRecommendations(analysis) {
  const recommendations = []
  const { overallScore, skillsResult, experienceResult, responsibilityResult, projectResult, keywordResult, educationScore, atsScore } = analysis

  if (skillsResult.missing.length > 0) {
    const highPriority = skillsResult.missing.filter(s => s.priority === 'High')
    if (highPriority.length > 0) {
      recommendations.push(`Develop missing high-priority skills: ${highPriority.map(s => s.skill).join(', ')}`)
    }
  }

  if (skillsResult.partial.length > 0) {
    recommendations.push(`Strengthen partial skills: ${skillsResult.partial.map(s => s.skill).join(', ')}`)
  }

  if (experienceResult.score < 70) {
    recommendations.push('Gain more relevant experience or highlight transferable experience')
  }

  if (responsibilityResult.missing.length > 0) {
    recommendations.push(`Add experience related to: ${responsibilityResult.missing.slice(0, 3).map(r => r.responsibility).join(', ')}`)
  }

  if (projectResult.score < 60) {
    recommendations.push('Build projects relevant to the target role domain')
  }

  if (keywordResult.missing.length > 0) {
    recommendations.push(`Incorporate missing keywords naturally: ${keywordResult.missing.slice(0, 5).join(', ')}`)
  }

  if (educationScore < 70) {
    recommendations.push('Consider additional education or certifications to meet requirements')
  }

  if (atsScore < 70) {
    recommendations.push('Optimize resume for ATS: add standard sections, action verbs, and quantified achievements')
  }

  if (overallScore >= 80) {
    recommendations.push('Strong candidate — focus on interview preparation and cultural fit')
  } else if (overallScore >= 65) {
    recommendations.push('Competitive candidate — address key gaps before applying')
  } else {
    recommendations.push('Significant gaps — consider upskilling before applying to similar roles')
  }

  return recommendations
}

export function shouldIApply(overallScore, missingSkills, experienceMatch) {
  const criticalMissing = missingSkills.filter(s => s.priority === 'High')
  const expScore = experienceMatch?.score ?? 50

  if (overallScore >= 80 && criticalMissing.length === 0) {
    return 'Recommended'
  }

  if (overallScore >= 65 && criticalMissing.length <= 1 && expScore >= 60) {
    return 'Consider'
  }

  return 'Low Match'
}

function buildApplyReasons(score, missingSkills, experienceMatch) {
  const reasons = []
  const criticalMissing = missingSkills.filter(s => s.priority === 'High')

  if (score >= 80) {
    reasons.push(`Strong overall match score of ${score}%`)
  } else if (score >= 65) {
    reasons.push(`Moderate match score of ${score}% — some gaps to address`)
  } else {
    reasons.push(`Low match score of ${score}% — significant gaps exist`)
  }

  if (criticalMissing.length === 0) {
    reasons.push('No critical missing skills')
  } else {
    reasons.push(`Missing ${criticalMissing.length} critical skill(s): ${criticalMissing.map(s => s.skill).join(', ')}`)
  }

  if (experienceMatch?.score >= 75) {
    reasons.push('Experience meets or exceeds requirements')
  } else if (experienceMatch?.score >= 50) {
    reasons.push('Experience is below requirements but transferable')
  } else {
    reasons.push('Experience gap is significant')
  }

  return reasons
}

function parseYears(exp) {
  if (exp == null || exp === '') return null
  if (typeof exp === 'number') return exp
  const match = String(exp).match(/(\d+(?:\.\d+)?)/)
  return match ? parseFloat(match[1]) : null
}

function scoreEducation(candidateEducation, requiredEducation) {
  if (!requiredEducation) return 75
  if (!candidateEducation) return 40

  const levels = { highschool: 1, associate: 2, bachelor: 3, master: 4, phd: 5 }
  const candLevel = levels[String(candidateEducation).toLowerCase()] || 2
  const reqLevel = levels[String(requiredEducation).toLowerCase()] || 3

  if (candLevel >= reqLevel) return 100
  if (candLevel === reqLevel - 1) return 70
  return 40
}

function scoreCertifications(candidateCerts = [], preferredCerts = []) {
  if (!preferredCerts || preferredCerts.length === 0) return 75
  if (!candidateCerts || candidateCerts.length === 0) return 40

  const candNorm = candidateCerts.map(c => normalizeSkill(c))
  const matched = preferredCerts.filter(p => candNorm.some(c => skillsOverlap(c, p)))

  return Math.round((matched.length / preferredCerts.length) * 100)
}
