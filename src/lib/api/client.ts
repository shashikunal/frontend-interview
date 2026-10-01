/**
 * Standardized API Client & Response Contract Helper
 * Provides consistent error handling, status mapping, and typed response boundaries.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  meta?: Record<string, any>;
}

export class ApiError extends Error {
  public status: number;
  public code?: string;
  public details?: any;

  constructor(message: string, status = 500, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const res = await fetch(endpoint, { ...options, headers });
    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new ApiError(
        json.error || json.message || `API request failed with status ${res.status}`,
        res.status,
        json.code,
        json.details
      );
    }

    return {
      success: true,
      data: json.data !== undefined ? json.data : json,
      meta: json.meta,
    };
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err?.message || 'Network communication error', 500);
  }
}
