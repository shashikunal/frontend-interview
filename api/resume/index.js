// Vercel Serverless Function: /api/resume
// AI Resume Center - CRUD operations, file upload, AI analysis, generation, and validation

export const config = { maxDuration: 60 }

import { createClient } from '@supabase/supabase-js'
import { parseJobDescription, analyzeResume, generateImprovedResume, validateResume } from './_handlers/aiService.js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lzjkxfxaiuemjsiflwlv.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8'
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

// ─── Auth Helper ────────────────────────────────────────────────────

function getUserId(req) {
  const userIdHeader = req.headers['x-user-id'] || req.headers['X-User-Id']
  if (userIdHeader) return userIdHeader

  const authHeader = req.headers.authorization || req.headers.Authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace(/^Bearer\s+/i, '').trim()
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1] || '', 'base64').toString())
      return payload.sub || payload.userId || payload.id || null
    } catch {
      return null
    }
  }

  return null
}

// ─── File Text Extraction ───────────────────────────────────────────

function extractTextFromBase64(base64Content, mimeType) {
  try {
    const buffer = Buffer.from(base64Content, 'base64')

    if (mimeType === 'application/pdf' || mimeType?.includes('pdf')) {
      const text = buffer.toString('latin1')
      const textMatches = text.match(/\(([^)]+)\)\s*Tj|\[(.*?)\]\s*TJ/g)
      if (textMatches) {
        return textMatches
          .map(m => m.replace(/^\[|\]$/, '').replace(/^\(|\)$/g, '').replace(/\\\(|\\\)/g, ''))
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim()
      }
      return text.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ').trim()
    }

    if (mimeType?.includes('word') || mimeType?.includes('officedocument')) {
      const text = buffer.toString('utf-8')
      const stripped = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      return stripped || buffer.toString('latin1').replace(/[^\x20-\x7E\n]/g, ' ').trim()
    }

    return buffer.toString('utf-8').replace(/\s+/g, ' ').trim()
  } catch (err) {
    console.error('[resume] Text extraction error:', err.message)
    return ''
  }
}

// ─── Resume Content Parser ──────────────────────────────────────────

function parseResumeContent(text) {
  if (!text) return null

  const sections = {}
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)

  const sectionHeaders = {
    summary: /^(summary|objective|profile|about)/i,
    experience: /^(experience|work history|employment|professional experience)/i,
    education: /^(education|academic|qualifications)/i,
    skills: /^(skills|technologies|tech stack|competencies)/i,
    projects: /^(projects|portfolio|personal projects)/i,
    certifications: /^(certifications|certificates|licenses)/i,
  }

  let currentSection = null
  const sectionContent = {}

  for (const line of lines) {
    let matched = false
    for (const [key, pattern] of Object.entries(sectionHeaders)) {
      if (pattern.test(line) && line.length < 50) {
        currentSection = key
        sectionContent[key] = []
        matched = true
        break
      }
    }
    if (!matched && currentSection) {
      sectionContent[currentSection].push(line)
    }
  }

  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/)
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i)

  const skillsSection = (sectionContent.skills || []).join(' ')
  const skillItems = skillsSection.split(/[,;•|]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 50)

  const experienceSection = (sectionContent.experience || []).join('\n')
  const experienceBullets = experienceSection.split(/\n|•/).map(s => s.trim()).filter(s => s.length > 10)

  const projectSection = (sectionContent.projects || []).join('\n')
  const projectItems = projectSection.split(/\n|•/).map(s => s.trim()).filter(s => s.length > 10)

  return {
    fullText: text,
    summary: (sectionContent.summary || []).join(' ').trim(),
    experience: experienceBullets,
    education: (sectionContent.education || []).join('\n').trim(),
    skills: skillItems,
    projects: projectItems,
    certifications: (sectionContent.certifications || []).join('\n').trim(),
    contactInfo: {
      email: emailMatch ? emailMatch[0] : null,
      phone: phoneMatch ? phoneMatch[0] : null,
      linkedin: linkedinMatch ? linkedinMatch[0] : null,
    },
    hasContactInfo: !!(emailMatch || phoneMatch),
    hasSummary: (sectionContent.summary || []).join(' ').length > 0,
    hasSkills: skillItems.length > 0,
    sections: Object.keys(sectionContent).filter(k => sectionContent[k].length > 0),
  }
}

// ─── Route Handlers ─────────────────────────────────────────────────

async function handleList(req, res, userId) {
  const { data, error } = await supabase
    .from('resumes')
    .select('id, title, target_role, status, overall_score, created_at, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('[resume] List error:', error.message)
    return res.status(500).json({ error: 'Failed to fetch resumes' })
  }

  return res.status(200).json({ resumes: data || [] })
}

async function handleCreate(req, res, userId) {
  const { title, content, targetRole, status = 'draft' } = req.body || {}

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' })
  }

  const { data, error } = await supabase
    .from('resumes')
    .insert({
      user_id: userId,
      title,
      content,
      target_role: targetRole || null,
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('[resume] Create error:', error.message)
    return res.status(500).json({ error: 'Failed to create resume' })
  }

  return res.status(201).json({ resume: data })
}

async function handleGet(req, res, userId, id) {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Resume not found' })
    }
    console.error('[resume] Get error:', error.message)
    return res.status(500).json({ error: 'Failed to fetch resume' })
  }

  return res.status(200).json({ resume: data })
}

async function handleUpdate(req, res, userId, id) {
  const { title, content, targetRole, status, overallScore } = req.body || {}

  const updates = { updated_at: new Date().toISOString() }
  if (title !== undefined) updates.title = title
  if (content !== undefined) updates.content = content
  if (targetRole !== undefined) updates.target_role = targetRole
  if (status !== undefined) updates.status = status
  if (overallScore !== undefined) updates.overall_score = overallScore

  const { data, error } = await supabase
    .from('resumes')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Resume not found' })
    }
    console.error('[resume] Update error:', error.message)
    return res.status(500).json({ error: 'Failed to update resume' })
  }

  return res.status(200).json({ resume: data })
}

async function handleDelete(req, res, userId, id) {
  const { error } = await supabase
    .from('resumes')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    console.error('[resume] Delete error:', error.message)
    return res.status(500).json({ error: 'Failed to delete resume' })
  }

  return res.status(200).json({ success: true })
}

async function handleUpload(req, res, userId) {
  const { fileName, fileContent, mimeType } = req.body || {}

  if (!fileContent) {
    return res.status(400).json({ error: 'File content is required' })
  }

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ]

  if (mimeType && !allowedTypes.some(t => mimeType.includes(t.split('/')[1]))) {
    return res.status(400).json({ error: 'Unsupported file type. Please upload PDF, DOCX, or TXT.' })
  }

  const base64Data = fileContent.includes(',') ? fileContent.split(',')[1] : fileContent
  const extractedText = extractTextFromBase64(base64Data, mimeType)

  if (!extractedText || extractedText.length < 50) {
    return res.status(422).json({ error: 'Could not extract meaningful text from the file. Please ensure the file is not corrupted or password-protected.' })
  }

  const parsedContent = parseResumeContent(extractedText)

  return res.status(200).json({
    success: true,
    fileName: fileName || 'uploaded_resume',
    extractedText: extractedText.slice(0, 50000),
    parsedContent,
  })
}

async function handleAnalyze(req, res, userId) {
  const { resumeContent, jdContent } = req.body || {}

  if (!resumeContent) {
    return res.status(400).json({ error: 'Resume content is required' })
  }
  if (!jdContent) {
    return res.status(400).json({ error: 'Job description content is required' })
  }

  const contentToAnalyze = typeof resumeContent === 'string'
    ? parseResumeContent(resumeContent) || { fullText: resumeContent }
    : resumeContent

  const analysis = await analyzeResume(contentToAnalyze, jdContent)

  return res.status(200).json({ analysis })
}

async function handleGenerate(req, res, userId) {
  const { resumeContent, jdContent, analysis } = req.body || {}

  if (!resumeContent) {
    return res.status(400).json({ error: 'Resume content is required' })
  }
  if (!jdContent) {
    return res.status(400).json({ error: 'Job description content is required' })
  }

  const contentToUse = typeof resumeContent === 'string'
    ? parseResumeContent(resumeContent) || { fullText: resumeContent }
    : resumeContent

  const analysisData = analysis || await analyzeResume(contentToUse, jdContent)
  const improved = await generateImprovedResume(contentToUse, jdContent, analysisData)

  return res.status(200).json({ improved })
}

async function handleReview(req, res, userId) {
  const { resumeContent, jdContent } = req.body || {}

  if (!resumeContent) {
    return res.status(400).json({ error: 'Resume content is required' })
  }

  const contentToReview = typeof resumeContent === 'string'
    ? parseResumeContent(resumeContent) || { fullText: resumeContent }
    : resumeContent

  const analysis = await analyzeResume(contentToReview, jdContent || '')
  const validation = await validateResume(contentToReview)

  return res.status(200).json({
    analysis,
    validation,
    overallScore: analysis.overallScore || 0,
    isReadyForExport: validation.exportReady && analysis.overallScore >= 70,
  })
}

async function handleValidate(req, res, userId) {
  const { resumeContent } = req.body || {}

  if (!resumeContent) {
    return res.status(400).json({ error: 'Resume content is required' })
  }

  const contentToValidate = typeof resumeContent === 'string'
    ? parseResumeContent(resumeContent) || { fullText: resumeContent }
    : resumeContent

  const validation = await validateResume(contentToValidate)

  return res.status(200).json({ validation })
}

// ─── Main Handler ───────────────────────────────────────────────────

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Id')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const userId = getUserId(req)
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  const url = new URL(req.url || '/', 'http://localhost')
  const path = url.pathname
  const pathParts = path.split('/').filter(Boolean)

  const isApiPrefix = pathParts[0] === 'api' && pathParts[1] === 'resume'
  const isDirectPrefix = pathParts[0] === 'resume'

  if (!isApiPrefix && !isDirectPrefix) {
    return res.status(404).json({ error: 'Not found' })
  }

  const subParts = isApiPrefix ? pathParts.slice(2) : pathParts.slice(1)
  const subPath = subParts[0] || ''
  const id = /^\d+$/.test(subParts[0]) ? subParts[0] : null

  try {
    if (req.method === 'GET' && !subPath) {
      return await handleList(req, res, userId)
    }

    if (req.method === 'POST' && !subPath) {
      return await handleCreate(req, res, userId)
    }

    if (req.method === 'GET' && id && subParts.length === 1) {
      return await handleGet(req, res, userId, id)
    }

    if (req.method === 'PUT' && id && subParts.length === 1) {
      return await handleUpdate(req, res, userId, id)
    }

    if (req.method === 'DELETE' && id && subParts.length === 1) {
      return await handleDelete(req, res, userId, id)
    }

    if (req.method === 'POST' && subPath === 'upload') {
      return await handleUpload(req, res, userId)
    }

    if (req.method === 'POST' && subPath === 'analyze') {
      return await handleAnalyze(req, res, userId)
    }

    if (req.method === 'POST' && subPath === 'generate') {
      return await handleGenerate(req, res, userId)
    }

    if (req.method === 'POST' && subPath === 'review') {
      return await handleReview(req, res, userId)
    }

    if (req.method === 'POST' && subPath === 'validate') {
      return await handleValidate(req, res, userId)
    }

    return res.status(404).json({ error: 'Route not found' })
  } catch (err) {
    console.error('[resume] Unhandled error:', err)
    return res.status(500).json({ error: 'An unexpected error occurred. Please try again.' })
  }
}
