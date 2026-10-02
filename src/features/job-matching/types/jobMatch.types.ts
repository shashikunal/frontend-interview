export type MatchClassification = 'strong_match' | 'good_match' | 'partial_match' | 'weak_match'

export type SkillMatchStatus = 'strong' | 'partial' | 'missing'

export interface SkillMatch {
  name: string
  status: SkillMatchStatus
  resumeEvidence?: string
  jdRequirement?: string
}

export interface ExperienceAnalysis {
  requiredYears?: number
  candidateYears?: number
  gap: number
  withinRange: boolean
  notes: string[]
}

export interface ResponsibilityMatch {
  responsibility: string
  covered: boolean
  evidence?: string
}

export interface ProjectRelevance {
  projectName: string
  relevanceScore: number
  relevantSkills: string[]
  notes?: string
}

export interface KeywordAnalysis {
  matched: string[]
  missing: string[]
  matchRate: number
}

export interface ScoreBreakdownItem {
  label: string
  score: number
  maxScore: number
  weight: number
  description: string
}

export interface ATSCompatibility {
  score: number
  issues: string[]
  recommendations: string[]
}

export interface ApplyRecommendation {
  shouldApply: boolean
  confidence: 'high' | 'medium' | 'low'
  reasons: string[]
  improvements: string[]
}

export interface MatchResult {
  overallScore: number
  classification: MatchClassification
  scoreBreakdown: ScoreBreakdownItem[]
  skillsMatch: {
    strong: SkillMatch[]
    partial: SkillMatch[]
    missing: SkillMatch[]
  }
  experienceAnalysis: ExperienceAnalysis
  responsibilityMatch: ResponsibilityMatch[]
  projectRelevance: ProjectRelevance[]
  keywordAnalysis: KeywordAnalysis
  atsCompatibility: ATSCompatibility
  applyRecommendation: ApplyRecommendation
}

export interface JobMatchAnalysis {
  id: string
  userId: string
  resumeId: string
  resumeName: string
  jobTitle: string
  company?: string
  jobDescription: string
  result: MatchResult
  createdAt: string
}

export interface AnalyzeJobMatchRequest {
  resumeId: string
  jobTitle: string
  company?: string
  jobDescription: string
}

export interface SavedResume {
  id: string
  name: string
  fileName?: string
  updatedAt?: string
}
