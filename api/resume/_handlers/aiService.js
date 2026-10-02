// AI Service Module for Resume Analysis
// Provides OpenAI-powered resume analysis with rule-based fallback

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

const SYSTEM_PROMPT = `You are an expert resume reviewer and career coach with 15+ years of experience in technical recruiting.
You analyze resumes against job descriptions and provide actionable, specific feedback.
CRITICAL RULE: Never invent, fabricate, or assume any information not explicitly present in the resume.
Only reference skills, experiences, and qualifications that are actually stated in the provided content.`

// ─── OpenAI Helper ──────────────────────────────────────────────────

async function callOpenAI(userPrompt, maxTokens = 2000) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`OpenAI error ${response.status}: ${errText}`)
  }

  const data = await response.json()
  return JSON.parse(data.choices?.[0]?.message?.content || '{}')
}

// ─── Skill Matching ─────────────────────────────────────────────────

function normalizeSkill(skill) {
  return skill.toLowerCase().trim().replace(/[._-]/g, ' ').replace(/\s+/g, ' ')
}

function matchSkills(candidateSkills, requiredSkills) {
  const matched = []
  const partial = []
  const missing = []
  const optional = []

  const normalizedCandidate = candidateSkills.map(s => ({ original: s, normalized: normalizeSkill(s) }))

  for (const req of requiredSkills) {
    const normalizedReq = normalizeSkill(req)
    const isOptional = /nice.to.have|preferred|bonus|plus/i.test(req)

    const exactMatch = normalizedCandidate.find(c => c.normalized === normalizedReq)
    if (exactMatch) {
      matched.push(req)
      continue
    }

    const partialMatch = normalizedCandidate.find(c =>
      c.normalized.includes(normalizedReq) || normalizedReq.includes(c.normalized)
    )
    if (partialMatch) {
      partial.push(req)
      continue
    }

    if (isOptional) {
      optional.push(req)
    } else {
      missing.push(req)
    }
  }

  return { matched, partial, missing, optional }
}

// ─── Keyword Matching ───────────────────────────────────────────────

function matchKeywords(resumeText, jdKeywords) {
  const normalizedResume = resumeText.toLowerCase()
  const matched = []
  const missing = []

  for (const keyword of jdKeywords) {
    const normalizedKeyword = keyword.toLowerCase().trim()
    if (normalizedResume.includes(normalizedKeyword)) {
      matched.push(keyword)
    } else {
      missing.push(keyword)
    }
  }

  return { matched, missing }
}

// ─── Score Calculation ──────────────────────────────────────────────

function calculateScores(resumeContent, parsedJD) {
  const { matchedSkills, partialSkills, missingSkills, optionalSkills } = matchSkills(
    resumeContent.skills || [],
    parsedJD.requiredSkills || []
  )

  const { matchedKeywords, missingKeywords } = matchKeywords(
    resumeContent.fullText || '',
    parsedJD.keywords || []
  )

  const totalRequired = (parsedJD.requiredSkills || []).length || 1
  const skillsMatchScore = Math.round(
    ((matchedSkills.length + partialSkills.length * 0.5) / totalRequired) * 100
  )

  const totalKeywords = (parsedJD.keywords || []).length || 1
  const keywordMatchScore = Math.round(
    (matchedKeywords.length / totalKeywords) * 100
  )

  const hasExperience = resumeContent.experience && resumeContent.experience.length > 0
  const hasProjects = resumeContent.projects && resumeContent.projects.length > 0
  const hasEducation = resumeContent.education && resumeContent.education.length > 0

  const experienceMatchScore = hasExperience
    ? Math.min(95, 60 + resumeContent.experience.length * 10)
    : 30

  const projectRelevanceScore = hasProjects
    ? Math.min(95, 55 + resumeContent.projects.length * 12)
    : 25

  const formattingScore = calculateFormattingScore(resumeContent)
  const grammarScore = calculateGrammarScore(resumeContent.fullText || '')
  const readabilityScore = calculateReadabilityScore(resumeContent.fullText || '')

  const atsScore = Math.round(
    keywordMatchScore * 0.35 +
    skillsMatchScore * 0.35 +
    formattingScore * 0.15 +
    grammarScore * 0.15
  )

  const jobMatchScore = Math.round(
    skillsMatchScore * 0.3 +
    keywordMatchScore * 0.25 +
    experienceMatchScore * 0.25 +
    projectRelevanceScore * 0.2
  )

  const overallScore = Math.round(
    atsScore * 0.4 +
    jobMatchScore * 0.35 +
    readabilityScore * 0.15 +
    formattingScore * 0.1
  )

  return {
    overallScore: Math.min(100, Math.max(0, overallScore)),
    atsScore: Math.min(100, Math.max(0, atsScore)),
    jobMatchScore: Math.min(100, Math.max(0, jobMatchScore)),
    skillsMatchScore: Math.min(100, Math.max(0, skillsMatchScore)),
    keywordMatchScore: Math.min(100, Math.max(0, keywordMatchScore)),
    experienceMatchScore: Math.min(100, Math.max(0, experienceMatchScore)),
    projectRelevanceScore: Math.min(100, Math.max(0, projectRelevanceScore)),
    formattingScore: Math.min(100, Math.max(0, formattingScore)),
    grammarScore: Math.min(100, Math.max(0, grammarScore)),
    readabilityScore: Math.min(100, Math.max(0, readabilityScore)),
    matchedSkills,
    partialSkills,
    missingSkills,
    optionalSkills,
    matchedKeywords,
    missingKeywords,
  }
}

function calculateFormattingScore(resumeContent) {
  let score = 70
  if (resumeContent.hasContactInfo) score += 10
  if (resumeContent.hasSummary) score += 8
  if (resumeContent.hasSkills) score += 7
  if (resumeContent.sections && resumeContent.sections.length >= 3) score += 5
  return Math.min(100, score)
}

function calculateGrammarScore(text) {
  if (!text) return 50
  let score = 85
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const longSentences = sentences.filter(s => s.split(/\s+/).length > 35)
  score -= longSentences.length * 3
  if (text.match(/\b(their|there|they're)\b/gi)?.length > 2) score -= 5
  if (text.match(/\b(its|it's)\b/gi)?.length > 2) score -= 5
  return Math.max(30, Math.min(100, score))
}

function calculateReadabilityScore(text) {
  if (!text) return 50
  const words = text.split(/\s+/).filter(w => w.length > 0)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  if (sentences.length === 0 || words.length === 0) return 50

  const avgWordsPerSentence = words.length / sentences.length
  const longWords = words.filter(w => w.length > 8).length
  const longWordRatio = longWords / words.length

  let score = 90
  if (avgWordsPerSentence > 25) score -= 15
  else if (avgWordsPerSentence > 20) score -= 8
  if (longWordRatio > 0.25) score -= 10
  else if (longWordRatio > 0.18) score -= 5

  return Math.max(30, Math.min(100, score))
}

// ─── JD Parsing ─────────────────────────────────────────────────────

export function parseJobDescription(jdText) {
  if (!jdText || typeof jdText !== 'string') {
    return { requiredSkills: [], keywords: [], responsibilities: [], qualifications: [] }
  }

  const skillPatterns = [
    /\b(JavaScript|TypeScript|Python|Java|Go|Rust|C\+\+|C#|Ruby|PHP|Swift|Kotlin|Scala|Elixir)\b/gi,
    /\b(React|Angular|Vue|Svelte|Next\.?js|Node\.?js|Express|Django|Flask|Spring|Rails|Laravel)\b/gi,
    /\b(AWS|Azure|GCP|Docker|Kubernetes|Terraform|Jenkins|GitLab|GitHub Actions|CircleCI)\b/gi,
    /\b(PostgreSQL|MySQL|MongoDB|Redis|Elasticsearch|DynamoDB|Cassandra|SQLite)\b/gi,
    /\b(REST|GraphQL|gRPC|WebSocket|Microservices|Serverless|CI\/CD|TDD|BDD)\b/gi,
    /\b(HTML|CSS|SASS|LESS|Tailwind|Bootstrap|Material UI|Styled Components)\b/gi,
    /\b(Git|Agile|Scrum|Kanban|Jira|Confluence|Figma|Sketch)\b/gi,
    /\b(Machine Learning|Deep Learning|NLP|Computer Vision|TensorFlow|PyTorch)\b/gi,
  ]

  const foundSkills = new Set()
  for (const pattern of skillPatterns) {
    const matches = jdText.match(pattern)
    if (matches) {
      matches.forEach(m => foundSkills.add(m.trim()))
    }
  }

  const responsibilitySection = extractSection(jdText, /responsibilities|what you'll do|role overview/i)
  const qualificationSection = extractSection(jdText, /qualifications|requirements|what you'll need|must.have/i)

  const keywords = [...foundSkills].slice(0, 20)
  const responsibilities = responsibilitySection
    ? responsibilitySection.split(/[•\-\n]/).map(s => s.trim()).filter(s => s.length > 10).slice(0, 8)
    : []
  const qualifications = qualificationSection
    ? qualificationSection.split(/[•\-\n]/).map(s => s.trim()).filter(s => s.length > 10).slice(0, 8)
    : []

  return {
    requiredSkills: [...foundSkills],
    keywords,
    responsibilities,
    qualifications,
  }
}

function extractSection(text, headerPattern) {
  const lines = text.split('\n')
  let capturing = false
  const sectionLines = []

  for (const line of lines) {
    if (headerPattern.test(line)) {
      capturing = true
      continue
    }
    if (capturing) {
      if (/^[A-Z][A-Z\s]{3,}$/.test(line.trim()) && sectionLines.length > 2) break
      sectionLines.push(line)
    }
  }

  return sectionLines.join('\n').trim()
}

// ─── Resume Analysis ────────────────────────────────────────────────

export async function analyzeResume(resumeContent, jdContent) {
  const parsedJD = typeof jdContent === 'string' ? parseJobDescription(jdContent) : jdContent

  if (!OPENAI_API_KEY) {
    return ruleBasedAnalysis(resumeContent, parsedJD)
  }

  try {
    const prompt = `Analyze the following resume against the job description.

RESUME CONTENT:
${JSON.stringify(resumeContent, null, 2)}

JOB DESCRIPTION:
${typeof jdContent === 'string' ? jdContent : JSON.stringify(jdContent, null, 2)}

PARSED JD DATA:
${JSON.stringify(parsedJD, null, 2)}

Return ONLY this exact JSON structure:
{
  "overallScore": number (0-100),
  "atsScore": number (0-100),
  "jobMatchScore": number (0-100),
  "skillsMatchScore": number (0-100),
  "keywordMatchScore": number (0-100),
  "experienceMatchScore": number (0-100),
  "projectRelevanceScore": number (0-100),
  "formattingScore": number (0-100),
  "grammarScore": number (0-100),
  "readabilityScore": number (0-100),
  "matchedSkills": string[],
  "partialSkills": string[],
  "missingSkills": string[],
  "optionalSkills": string[],
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "sectionReviews": [
    { "section": string, "score": number, "feedback": string }
  ],
  "recommendations": string[],
  "improvedSummary": string,
  "improvedExperience": [
    { "original": string, "improved": string, "reason": string }
  ]
}`

    const result = await callOpenAI(prompt, 2500)
    return { ...result, isAiGenerated: true }
  } catch (err) {
    console.error('[aiService] OpenAI analysis failed, using fallback:', err.message)
    return ruleBasedAnalysis(resumeContent, parsedJD)
  }
}

function ruleBasedAnalysis(resumeContent, parsedJD) {
  const scores = calculateScores(resumeContent, parsedJD)

  const sectionReviews = []
  if (resumeContent.summary) {
    sectionReviews.push({
      section: 'Summary',
      score: resumeContent.summary.length > 100 ? 80 : 60,
      feedback: resumeContent.summary.length > 100
        ? 'Summary provides good context. Consider tailoring it more specifically to the target role.'
        : 'Summary is too brief. Expand to 2-3 sentences highlighting your key value proposition.',
    })
  }
  if (resumeContent.experience?.length) {
    sectionReviews.push({
      section: 'Experience',
      score: scores.experienceMatchScore,
      feedback: scores.experienceMatchScore >= 70
        ? 'Experience section is well-structured. Ensure each bullet starts with an action verb and includes metrics.'
        : 'Experience section needs strengthening. Add quantifiable achievements and align with job requirements.',
    })
  }
  if (resumeContent.skills?.length) {
    sectionReviews.push({
      section: 'Skills',
      score: scores.skillsMatchScore,
      feedback: scores.skillsMatchScore >= 70
        ? 'Good skill coverage. Consider grouping skills by category (languages, frameworks, tools).'
        : `Missing key skills: ${scores.missingSkills.slice(0, 5).join(', ')}. Consider adding relevant projects or learning.`,
    })
  }

  const recommendations = []
  if (scores.missingSkills.length > 0) {
    recommendations.push(`Develop or highlight experience with: ${scores.missingSkills.slice(0, 3).join(', ')}`)
  }
  if (scores.keywordMatchScore < 70) {
    recommendations.push('Incorporate more keywords from the job description naturally throughout your resume')
  }
  if (scores.formattingScore < 80) {
    recommendations.push('Improve resume formatting: ensure consistent spacing, clear section headers, and ATS-friendly layout')
  }
  if (scores.grammarScore < 80) {
    recommendations.push('Review grammar and sentence structure. Use shorter, more impactful sentences')
  }
  if (recommendations.length === 0) {
    recommendations.push('Resume is well-optimized. Consider tailoring further for each specific job application')
  }

  return {
    ...scores,
    sectionReviews,
    recommendations: recommendations.slice(0, 5),
    improvedSummary: resumeContent.summary || '',
    improvedExperience: [],
    isAiGenerated: false,
  }
}

// ─── Resume Generation ──────────────────────────────────────────────

export async function generateImprovedResume(resumeContent, jdContent, analysis) {
  if (!OPENAI_API_KEY) {
    return ruleBasedGeneration(resumeContent, jdContent, analysis)
  }

  try {
    const prompt = `Improve the following resume based on the job description and analysis feedback.

CURRENT RESUME:
${JSON.stringify(resumeContent, null, 2)}

JOB DESCRIPTION:
${typeof jdContent === 'string' ? jdContent : JSON.stringify(jdContent, null, 2)}

ANALYSIS FEEDBACK:
${JSON.stringify(analysis, null, 2)}

IMPORTANT: Only use information explicitly present in the resume. Do NOT invent new experiences, skills, or qualifications.
Rewrite and restructure existing content to better align with the job description.

Return ONLY this exact JSON structure:
{
  "improvedSummary": string,
  "improvedExperience": [
    {
      "original": string,
      "improved": string,
      "reason": string
    }
  ],
  "improvedSkills": string[],
  "improvedProjects": [
    {
      "original": string,
      "improved": string,
      "reason": string
    }
  ],
  "additionalSuggestions": string[]
}`

    const result = await callOpenAI(prompt, 3000)
    return { ...result, isAiGenerated: true }
  } catch (err) {
    console.error('[aiService] OpenAI generation failed, using fallback:', err.message)
    return ruleBasedGeneration(resumeContent, jdContent, analysis)
  }
}

function ruleBasedGeneration(resumeContent, jdContent, analysis) {
  const parsedJD = typeof jdContent === 'string' ? parseJobDescription(jdContent) : jdContent

  const improvedExperience = (resumeContent.experience || []).slice(0, 5).map(exp => ({
    original: exp,
    improved: exp,
    reason: 'No AI available for enhancement. Consider manually aligning this bullet with job requirements.',
  }))

  const additionalSuggestions = []
  if (analysis.missingSkills?.length) {
    additionalSuggestions.push(`Consider adding a projects section highlighting: ${analysis.missingSkills.slice(0, 3).join(', ')}`)
  }
  if (analysis.missingKeywords?.length) {
    additionalSuggestions.push(`Naturally incorporate these keywords: ${analysis.missingKeywords.slice(0, 5).join(', ')}`)
  }
  additionalSuggestions.push('Use the STAR method (Situation, Task, Action, Result) for each bullet point')
  additionalSuggestions.push('Quantify achievements with metrics (%, $, time saved, users impacted)')

  return {
    improvedSummary: resumeContent.summary || '',
    improvedExperience,
    improvedSkills: resumeContent.skills || [],
    improvedProjects: [],
    additionalSuggestions,
    isAiGenerated: false,
  }
}

// ─── Resume Validation ──────────────────────────────────────────────

export async function validateResume(resumeContent) {
  if (!OPENAI_API_KEY) {
    return ruleBasedValidation(resumeContent)
  }

  try {
    const prompt = `Validate the following resume for quality, completeness, and ATS compatibility.

RESUME CONTENT:
${JSON.stringify(resumeContent, null, 2)}

Check for:
1. Completeness (all required sections present)
2. Contact information present
3. Action verbs in experience bullets
4. Quantifiable achievements
5. ATS compatibility (no tables, columns, headers/footers)
6. Consistent formatting
7. Appropriate length (1-2 pages)
8. No typos or grammatical errors

Return ONLY this exact JSON structure:
{
  "isValid": boolean,
  "completenessScore": number (0-100),
  "atsCompatibilityScore": number (0-100),
  "issues": [
    { "type": "error|warning|info", "message": string, "section": string }
  ],
  "strengths": string[],
  "exportReady": boolean
}`

    const result = await callOpenAI(prompt, 1500)
    return { ...result, isAiGenerated: true }
  } catch (err) {
    console.error('[aiService] OpenAI validation failed, using fallback:', err.message)
    return ruleBasedValidation(resumeContent)
  }
}

function ruleBasedValidation(resumeContent) {
  const issues = []
  const strengths = []

  if (!resumeContent.fullText || resumeContent.fullText.length < 200) {
    issues.push({ type: 'error', message: 'Resume content is too short. Ensure all sections are filled out.', section: 'General' })
  }

  if (!resumeContent.hasContactInfo) {
    issues.push({ type: 'error', message: 'Missing contact information (email, phone, or LinkedIn).', section: 'Contact' })
  } else {
    strengths.push('Contact information is present')
  }

  if (!resumeContent.summary) {
    issues.push({ type: 'warning', message: 'No professional summary found. A strong summary improves recruiter engagement.', section: 'Summary' })
  } else if (resumeContent.summary.length < 100) {
    issues.push({ type: 'warning', message: 'Professional summary is too brief. Aim for 2-3 impactful sentences.', section: 'Summary' })
  } else {
    strengths.push('Professional summary is present and substantive')
  }

  if (!resumeContent.experience || resumeContent.experience.length === 0) {
    issues.push({ type: 'error', message: 'No work experience section found.', section: 'Experience' })
  } else {
    const actionVerbs = ['led', 'built', 'developed', 'created', 'designed', 'implemented', 'managed', 'improved', 'increased', 'reduced', 'launched', 'delivered', 'achieved', 'optimized', 'architected']
    const hasActionVerbs = resumeContent.experience.some(exp =>
      actionVerbs.some(verb => exp.toLowerCase().startsWith(verb))
    )
    if (hasActionVerbs) {
      strengths.push('Experience bullets use strong action verbs')
    } else {
      issues.push({ type: 'warning', message: 'Experience bullets should start with strong action verbs (e.g., Led, Built, Developed).', section: 'Experience' })
    }

    const hasMetrics = resumeContent.experience.some(exp => /\d+%|\$\d+|\d+x|\d+\+/.test(exp))
    if (hasMetrics) {
      strengths.push('Experience includes quantifiable achievements')
    } else {
      issues.push({ type: 'info', message: 'Add quantifiable metrics to experience bullets (e.g., "Increased performance by 40%").', section: 'Experience' })
    }
  }

  if (!resumeContent.skills || resumeContent.skills.length === 0) {
    issues.push({ type: 'warning', message: 'No skills section found. ATS systems rely heavily on keyword matching.', section: 'Skills' })
  } else if (resumeContent.skills.length < 5) {
    issues.push({ type: 'info', message: 'Consider expanding your skills section with relevant technologies.', section: 'Skills' })
  } else {
    strengths.push('Skills section is present with good coverage')
  }

  if (!resumeContent.education || resumeContent.education.length === 0) {
    issues.push({ type: 'info', message: 'No education section found.', section: 'Education' })
  }

  const wordCount = (resumeContent.fullText || '').split(/\s+/).length
  if (wordCount > 800) {
    issues.push({ type: 'warning', message: `Resume is ${wordCount} words. Consider trimming to 400-700 words for optimal recruiter engagement.`, section: 'General' })
  } else if (wordCount >= 300) {
    strengths.push('Resume length is appropriate')
  }

  const errorCount = issues.filter(i => i.type === 'error').length
  const warningCount = issues.filter(i => i.type === 'warning').length
  const completenessScore = Math.max(0, 100 - errorCount * 25 - warningCount * 10)
  const atsCompatibilityScore = resumeContent.hasContactInfo && resumeContent.skills?.length > 0 ? 85 : 60

  return {
    isValid: errorCount === 0,
    completenessScore,
    atsCompatibilityScore,
    issues,
    strengths,
    exportReady: errorCount === 0 && warningCount <= 2,
    isAiGenerated: false,
  }
}
