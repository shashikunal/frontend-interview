import type {
  AnalyzeJobMatchRequest,
  JobMatchAnalysis,
  SavedResume,
} from '../types/jobMatch.types'

const BASE_URL = '/api/job-matching'

function getAuthHeaders(): Record<string, string> {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const message = errorBody?.message || errorBody?.error || `Request failed with status ${response.status}`
    throw new Error(message)
  }
  return response.json()
}

export const jobMatchService = {
  async getSavedResumes(): Promise<SavedResume[]> {
    const response = await fetch(`${BASE_URL}/resumes`, {
      headers: { ...getAuthHeaders() },
    })
    const data = await handleResponse<{ resumes: SavedResume[] }>(response)
    return data.resumes
  },

  async analyzeJobMatch(request: AnalyzeJobMatchRequest): Promise<JobMatchAnalysis> {
    const response = await fetch(`${BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(request),
    })
    return handleResponse<JobMatchAnalysis>(response)
  },

  async getMatchHistory(): Promise<JobMatchAnalysis[]> {
    const response = await fetch(`${BASE_URL}/history`, {
      headers: { ...getAuthHeaders() },
    })
    const data = await handleResponse<{ analyses: JobMatchAnalysis[] }>(response)
    return data.analyses
  },

  async getMatchAnalysis(id: string): Promise<JobMatchAnalysis> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<JobMatchAnalysis>(response)
  },

  async deleteMatchAnalysis(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    })
    if (!response.ok) {
      const errorBody = await response.json().catch(() => null)
      throw new Error(errorBody?.message || 'Failed to delete analysis')
    }
  },

  async createTailoredResume(analysisId: string): Promise<{ resumeId: string; message: string }> {
    const response = await fetch(`${BASE_URL}/${analysisId}/create-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    })
    return handleResponse<{ resumeId: string; message: string }>(response)
  },
}
