import { supabase } from '../../../lib/supabase/client'
import type {
  Resume,
  ResumeVersion,
  JobDescription,
  ResumeReview,
  ResumeAnalysisResult,
  ResumeGenerateResult,
  ResumeValidationResult,
  CreateResumeInput,
  UpdateResumeInput,
  ResumeListFilters,
} from '../types/resume.types'

const API_BASE = '/api/resume'

async function getAuthHeaders(): Promise<Record<string, string>> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return {
    'Content-Type': 'application/json',
    Authorization: session?.access_token ? `Bearer ${session.access_token}` : '',
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.message || `Request failed with status ${response.status}`)
  }
  return response.json()
}

export const resumeService = {
  async listResumes(filters?: ResumeListFilters): Promise<Resume[]> {
    const headers = await getAuthHeaders()
    const params = new URLSearchParams()
    if (filters?.search) params.set('search', filters.search)
    if (filters?.sortBy) params.set('sortBy', filters.sortBy)
    if (filters?.sortOrder) params.set('sortOrder', filters.sortOrder)
    const query = params.toString() ? `?${params.toString()}` : ''
    const response = await fetch(`${API_BASE}${query}`, { headers })
    return handleResponse<Resume[]>(response)
  },

  async getResume(id: string): Promise<Resume> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/${id}`, { headers })
    return handleResponse<Resume>(response)
  },

  async createResume(input: CreateResumeInput): Promise<Resume> {
    const headers = await getAuthHeaders()
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers,
      body: JSON.stringify(input),
    })
    return handleResponse<Resume>(response)
  },

  async updateResume(id: string, input: UpdateResumeInput): Promise<Resume> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(input),
    })
    return handleResponse<Resume>(response)
  },

  async deleteResume(id: string): Promise<void> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers,
    })
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      throw new Error(errorBody.message || `Delete failed with status ${response.status}`)
    }
  },

  async uploadFile(file: File): Promise<{ text: string; fileName: string }> {
    const headers = await getAuthHeaders()
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { Authorization: headers.Authorization },
      body: formData,
    })
    return handleResponse<{ text: string; fileName: string }>(response)
  },

  async analyzeResume(resumeId: string, jobDescriptionId?: string): Promise<ResumeAnalysisResult> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ resumeId, jobDescriptionId }),
    })
    return handleResponse<ResumeAnalysisResult>(response)
  },

  async generateResume(input: {
    targetRole: string
    company: string
    jobDescription?: string
    existingSections?: Resume['sections']
  }): Promise<ResumeGenerateResult> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify(input),
    })
    return handleResponse<ResumeGenerateResult>(response)
  },

  async reviewResume(resumeId: string, jobDescriptionId?: string): Promise<ResumeReview> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/review`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ resumeId, jobDescriptionId }),
    })
    return handleResponse<ResumeReview>(response)
  },

  async validateResume(resumeId: string): Promise<ResumeValidationResult> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/validate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ resumeId }),
    })
    return handleResponse<ResumeValidationResult>(response)
  },

  async listVersions(resumeId: string): Promise<ResumeVersion[]> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/${resumeId}/versions`, { headers })
    return handleResponse<ResumeVersion[]>(response)
  },

  async createVersion(resumeId: string, name: string): Promise<ResumeVersion> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/${resumeId}/versions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name }),
    })
    return handleResponse<ResumeVersion>(response)
  },

  async switchVersion(resumeId: string, versionId: string): Promise<Resume> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/${resumeId}/versions/${versionId}/activate`, {
      method: 'POST',
      headers,
    })
    return handleResponse<Resume>(response)
  },

  async listJobDescriptions(): Promise<JobDescription[]> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/job-descriptions`, { headers })
    return handleResponse<JobDescription[]>(response)
  },

  async saveJobDescription(input: { title: string; company: string; content: string }): Promise<JobDescription> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/job-descriptions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(input),
    })
    return handleResponse<JobDescription>(response)
  },
}
