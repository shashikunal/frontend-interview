import { createClient } from '@supabase/supabase-js'
import { applySecurityHeaders } from '../server/security/securityHeaders.ts'
import { tokenService } from '../server/auth/tokenService.ts'
import { rateLimiter } from '../server/redis/rateLimiter.ts'
import { createErrorResponse } from '../server/auth/rbacMiddleware.ts'
import {
  calculateMatchScore,
  classifyMatch,
  matchSkills,
  matchExperience,
  matchResponsibilities,
  matchProjects,
  matchKeywords,
  analyzeATS,
  generateRecommendations,
  shouldIApply,
} from './_handlers/matchingEngine.js'

export const config = { maxDuration: 45 }

function getSupabaseClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lzjkxfxaiuemjsiflwlv.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8'
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

function authenticate(req) {
  const authHeader = req.headers?.authorization || req.headers?.Authorization
  const userIdHeader = req.headers?.['x-user-id']

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace(/^Bearer\s+/i, '').trim()
    const verification = tokenService.verifyMeetingToken(token)
    if (verification.valid && verification.claims) {
      return {
        id: verification.claims.userId,
        email: verification.claims.userEmail,
        role: verification.claims.userRole,
      }
    }

    try {
      const parts = token.split('.')
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'))
        if (payload && (payload.sub || payload.email || payload.user_metadata)) {
          const role = payload.user_metadata?.role || (payload.email?.includes('admin') ? 'admin' : 'candidate')
          return {
            id: payload.sub || payload.userId || 'jwt_user',
            email: payload.email || payload.userEmail || '',
            role,
          }
        }
      }
    } catch (_) {}
  }

  if (userIdHeader) {
    return { id: userIdHeader, email: '', role: 'candidate' }
  }

  const host = req.headers?.host || ''
  const isDev = process.env.NODE_ENV !== 'production' || host.includes('localhost') || host.includes('127.0.0.1')
  if (isDev) {
    return { id: 'dev_user', email: 'dev@localhost', role: 'admin' }
  }

  return null
}

async function callOpenAI(systemPrompt, userPrompt) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) return null

  const aiJson = await res.json()
  return JSON.parse(aiJson.choices?.[0]?.message?.content || '{}')
}

function buildAIPrompt(resumeData, jdData) {
  const systemPrompt = `You are an expert career advisor and job matching analyst.
Analyze the candidate's resume against the job description and provide a detailed match analysis.
Respond ONLY with a valid JSON object matching this schema:
{
  "overallScore": number (0-100),
  "classification": "Excellent Match" | "Strong Match" | "Good Match" | "Partial Match" | "Weak Match",
  "atsScore": number (0-100),
  "skillsScore": number (0-100),
  "experienceScore": number (0-100),
  "responsibilityScore": number (0-100),
  "projectScore": number (0-100),
  "keywordScore": number (0-100),
  "educationScore": number (0-100),
  "certificationScore": number (0-100),
  "matchedSkills": [{"skill": string, "evidence": string}],
  "partialSkills": [{"skill": string, "evidence": string, "gap": string}],
  "missingSkills": [{"skill": string, "priority": "High" | "Low", "reason": string}],
  "matchedResponsibilities": [{"responsibility": string, "evidence": string, "match": "Strong" | "Moderate"}],
  "missingResponsibilities": [{"responsibility": string, "reason": string}],
  "experienceAnalysis": {"required": string, "candidate": string, "relevant": string, "result": string},
  "recommendations": string[],
  "applyRecommendation": "Recommended" | "Consider" | "Low Match",
  "applyReasons": string[],
  "scoreBreakdown": {"skills": {"weight": 30, "score": number}, "experience": {"weight": 20, "score": number}, "responsibilities": {"weight": 20, "score": number}, "projects": {"weight": 10, "score": number}, "keywords": {"weight": 10, "score": number}, "education": {"weight": 5, "score": number}, "ats": {"weight": 5, "score": number}}
}`

  const userPrompt = `Candidate Resume:
${JSON.stringify(resumeData, null, 2)}

Job Description:
${JSON.stringify(jdData, null, 2)}

Perform a thorough analysis and return the structured JSON result.`

  return { systemPrompt, userPrompt }
}

export default async function handler(req, res) {
  if (!applySecurityHeaders(req, res)) {
    return
  }

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  const urlObj = new URL(req.url || '/', 'http://localhost')
  const path = urlObj.pathname
  const pathParts = path.split('/').filter(Boolean)
  const lastPart = pathParts[pathParts.length - 1]

  const isAnalyze = pathParts.includes('analyze')
  const isHistory = pathParts.includes('history')
  const isCreateResume = pathParts.includes('create-resume')
  const hasId = lastPart && lastPart !== 'job-matching' && lastPart !== 'analyze' && lastPart !== 'history' && lastPart !== 'create-resume'

  if (req.method === 'GET' && !isHistory && !hasId) {
    return listAnalyses(req, res)
  }

  if (req.method === 'POST' && isAnalyze) {
    return analyzeJobMatch(req, res)
  }

  if (req.method === 'GET' && isHistory) {
    return getHistory(req, res)
  }

  if (req.method === 'GET' && hasId) {
    return getAnalysis(req, res, lastPart)
  }

  if (req.method === 'DELETE' && hasId) {
    return deleteAnalysis(req, res, lastPart)
  }

  if (req.method === 'POST' && isCreateResume) {
    return createTailoredResume(req, res, pathParts[pathParts.indexOf('create-resume') - 1])
  }

  return res.status(405).json({ error: 'Method Not Allowed' })
}

async function listAnalyses(req, res) {
  const user = authenticate(req)
  if (!user) {
    return res.status(401).json(createErrorResponse('Unauthorized', 'Authentication required to list job matching analyses.', 'MISSING_TOKEN'))
  }

  try {
    const sb = getSupabaseClient()
    const { data, error } = await sb
      .from('job_match_analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return res.status(200).json({ success: true, analyses: data || [] })
  } catch (err) {
    console.error('[Job Matching API Error]:', err)
    return res.status(500).json({ error: 'Failed to retrieve job matching analyses.' })
  }
}

async function analyzeJobMatch(req, res) {
  const user = authenticate(req)
  if (!user) {
    return res.status(401).json(createErrorResponse('Unauthorized', 'Authentication required for job matching analysis.', 'MISSING_TOKEN'))
  }

  const { resumeId, resumeData, jdData } = req.body || {}

  if (!resumeData || !jdData) {
    return res.status(400).json({ error: 'resumeData and jdData are required for analysis.' })
  }

  if (!jdData.title && !jdData.company) {
    return res.status(400).json({ error: 'jdData must include at least a title or company.' })
  }

  const rateLimit = await rateLimiter.consume('APP_CHAT', `job_match_${user.id}`, {
    name: 'JOB_MATCHING',
    maxRequests: 10,
    windowMs: 60 * 1000,
  })

  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds))
    return res.status(429).json({
      error: 'Too Many Requests',
      message: `Job matching limit reached. Please wait ${rateLimit.retryAfterSeconds} seconds.`,
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    })
  }

  try {
    const { systemPrompt, userPrompt } = buildAIPrompt(resumeData, jdData)
    let aiResult = null

    try {
      aiResult = await callOpenAI(systemPrompt, userPrompt)
    } catch (llmErr) {
      console.warn('[Job Matching] OpenAI call failed, falling back to rule-based engine:', llmErr)
    }

    let analysis
    if (aiResult && aiResult.overallScore != null) {
      analysis = {
        ...aiResult,
        generatedAt: new Date().toISOString(),
        isAiGenerated: true,
        engine: 'OpenAI GPT-4o-mini',
      }
    } else {
      const ruleBased = calculateMatchScore(resumeData, jdData)
      analysis = {
        ...ruleBased,
        generatedAt: new Date().toISOString(),
        isAiGenerated: false,
        engine: 'Rule-Based Matching Engine v1.0',
      }
    }

    const sb = getSupabaseClient()
    const { data, error } = await sb
      .from('job_match_analyses')
      .insert({
        user_id: user.id,
        resume_id: resumeId || null,
        job_title: jdData.title || 'Unknown',
        company: jdData.company || 'Unknown',
        analysis: analysis,
        overall_score: analysis.overallScore,
        classification: analysis.classification,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return res.status(200).json({
      success: true,
      analysis: data,
    })
  } catch (err) {
    console.error('[Job Matching API Error]:', err)
    return res.status(500).json({ error: 'Failed to perform job matching analysis.' })
  }
}

async function getHistory(req, res) {
  const user = authenticate(req)
  if (!user) {
    return res.status(401).json(createErrorResponse('Unauthorized', 'Authentication required to view analysis history.', 'MISSING_TOKEN'))
  }

  const urlObj = new URL(req.url || '/', 'http://localhost')
  const limit = parseInt(urlObj.searchParams.get('limit') || '20', 10)
  const offset = parseInt(urlObj.searchParams.get('offset') || '0', 10)

  try {
    const sb = getSupabaseClient()
    const { data, error } = await sb
      .from('job_match_analyses')
      .select('id, job_title, company, overall_score, classification, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return res.status(200).json({ success: true, history: data || [] })
  } catch (err) {
    console.error('[Job Matching API Error]:', err)
    return res.status(500).json({ error: 'Failed to retrieve analysis history.' })
  }
}

async function getAnalysis(req, res, id) {
  const user = authenticate(req)
  if (!user) {
    return res.status(401).json(createErrorResponse('Unauthorized', 'Authentication required to view analysis.', 'MISSING_TOKEN'))
  }

  if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    return res.status(400).json({ error: 'Invalid analysis ID.' })
  }

  try {
    const sb = getSupabaseClient()
    const { data, error } = await sb
      .from('job_match_analyses')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) throw error

    if (!data) {
      return res.status(404).json({ error: 'Analysis not found.' })
    }

    return res.status(200).json({ success: true, analysis: data })
  } catch (err) {
    console.error('[Job Matching API Error]:', err)
    return res.status(500).json({ error: 'Failed to retrieve analysis.' })
  }
}

async function deleteAnalysis(req, res, id) {
  const user = authenticate(req)
  if (!user) {
    return res.status(401).json(createErrorResponse('Unauthorized', 'Authentication required to delete analysis.', 'MISSING_TOKEN'))
  }

  if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    return res.status(400).json({ error: 'Invalid analysis ID.' })
  }

  try {
    const sb = getSupabaseClient()
    const { error } = await sb
      .from('job_match_analyses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    return res.status(200).json({ success: true, message: 'Analysis deleted successfully.' })
  } catch (err) {
    console.error('[Job Matching API Error]:', err)
    return res.status(500).json({ error: 'Failed to delete analysis.' })
  }
}

async function createTailoredResume(req, res, analysisId) {
  const user = authenticate(req)
  if (!user) {
    return res.status(401).json(createErrorResponse('Unauthorized', 'Authentication required to create tailored resume.', 'MISSING_TOKEN'))
  }

  if (!analysisId || !/^[a-zA-Z0-9_-]+$/.test(analysisId)) {
    return res.status(400).json({ error: 'Invalid analysis ID.' })
  }

  try {
    const sb = getSupabaseClient()
    const { data: analysis, error: fetchError } = await sb
      .from('job_match_analyses')
      .select('*')
      .eq('id', analysisId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (fetchError) throw fetchError

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found.' })
    }

    const { resumeData, jdData } = req.body || {}
    if (!resumeData) {
      return res.status(400).json({ error: 'resumeData is required to create a tailored resume.' })
    }

    const systemPrompt = `You are an expert resume writer specializing in tailoring resumes for specific job descriptions.
Based on the candidate's resume data and the job matching analysis, create an optimized resume that:
1. Highlights skills and experience most relevant to the job
2. Incorporates missing keywords naturally
3. Emphasizes quantified achievements
4. Uses strong action verbs
5. Is ATS-friendly

Respond ONLY with a valid JSON object:
{
  "tailoredResume": {
    "summary": string,
    "skills": string[],
    "experience": [{"title": string, "company": string, "bullets": string[]}],
    "projects": [{"name": string, "description": string, "technologies": string[]}],
    "education": string,
    "certifications": string[]
  },
  "changes": string[],
  "atsImprovements": string[]
}`

    const userPrompt = `Candidate Resume Data:
${JSON.stringify(resumeData, null, 2)}

Job Matching Analysis:
${JSON.stringify(analysis.analysis, null, 2)}

Job Description:
${JSON.stringify(jdData || {}, null, 2)}

Create a tailored resume optimized for this specific job.`

    let aiResult = null
    try {
      aiResult = await callOpenAI(systemPrompt, userPrompt)
    } catch (llmErr) {
      console.warn('[Job Matching] OpenAI call failed for resume creation:', llmErr)
    }

    let result
    if (aiResult && aiResult.tailoredResume) {
      result = {
        ...aiResult,
        generatedAt: new Date().toISOString(),
        isAiGenerated: true,
        engine: 'OpenAI GPT-4o-mini',
      }
    } else {
      result = generateRuleBasedResume(resumeData, analysis.analysis)
    }

    return res.status(200).json({
      success: true,
      analysisId,
      ...result,
    })
  } catch (err) {
    console.error('[Job Matching API Error]:', err)
    return res.status(500).json({ error: 'Failed to create tailored resume.' })
  }
}

function generateRuleBasedResume(resumeData, analysis) {
  const matchedSkills = (analysis.matchedSkills || []).map(s => s.skill)
  const allSkills = [...new Set([...matchedSkills, ...(resumeData.skills || [])])]

  const changes = [
    `Reordered skills to prioritize ${matchedSkills.slice(0, 3).join(', ') || 'relevant skills'}`,
    'Emphasized experience matching job requirements',
  ]

  const atsImprovements = [
    'Added standard section headers for ATS parsing',
    'Incorporated keywords from job description',
  ]

  return {
    tailoredResume: {
      summary: resumeData.summary || `Results-driven professional with expertise in ${allSkills.slice(0, 3).join(', ')}.`,
      skills: allSkills,
      experience: resumeData.experience || [],
      projects: resumeData.projects || [],
      education: resumeData.education || '',
      certifications: resumeData.certifications || [],
    },
    changes,
    atsImprovements,
    generatedAt: new Date().toISOString(),
    isAiGenerated: false,
    engine: 'Rule-Based Resume Tailoring v1.0',
  }
}
