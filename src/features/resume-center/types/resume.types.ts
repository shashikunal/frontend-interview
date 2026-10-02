export type ResumeTemplate = 'professional' | 'modern' | 'minimal' | 'technical'

export type ResumeSectionType =
  | 'summary'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'education'
  | 'certifications'
  | 'achievements'

export interface ResumeSection {
  id: string
  type: ResumeSectionType
  title: string
  content: string
  order: number
}

export interface Resume {
  id: string
  userId: string
  name: string
  targetRole: string
  company: string
  template: ResumeTemplate
  font: string
  spacing: string
  sections: ResumeSection[]
  atsScore: number | null
  jobMatch: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ResumeVersion {
  id: string
  resumeId: string
  version: number
  name: string
  sections: ResumeSection[]
  template: ResumeTemplate
  createdAt: string
  isActive: boolean
}

export interface JobDescription {
  id: string
  userId: string
  title: string
  company: string
  content: string
  createdAt: string
}

export interface SkillMatch {
  skill: string
  required: boolean
  present: boolean
  importance: 'high' | 'medium' | 'low'
}

export interface SectionReviewResult {
  section: ResumeSectionType
  title: string
  score: number
  feedback: string
  suggestions: string[]
}

export interface ResumeReview {
  id: string
  resumeId: string
  jobDescriptionId: string | null
  overallScore: number
  atsScore: number
  jobMatch: number
  skillMatches: SkillMatch[]
  sectionReviews: SectionReviewResult[]
  summary: string
  createdAt: string
}

export interface ResumeAnalysisResult {
  overallScore: number
  atsScore: number
  jobMatch: number
  skillMatches: SkillMatch[]
  sectionReviews: SectionReviewResult[]
  summary: string
}

export interface ResumeGenerateResult {
  sections: ResumeSection[]
  summary: string
}

export interface ResumeValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface CreateResumeInput {
  name: string
  targetRole: string
  company: string
  template: ResumeTemplate
  sections: ResumeSection[]
}

export interface UpdateResumeInput {
  name?: string
  targetRole?: string
  company?: string
  template?: ResumeTemplate
  font?: string
  spacing?: string
  sections?: ResumeSection[]
  atsScore?: number | null
  jobMatch?: number | null
}

export interface ResumeListFilters {
  search?: string
  sortBy?: 'name' | 'updatedAt' | 'atsScore' | 'jobMatch'
  sortOrder?: 'asc' | 'desc'
}
