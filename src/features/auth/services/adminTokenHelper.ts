/**
 * Admin Token Helper for Frontend Components
 * Safely requests and caches signed tokens from /api/v1/auth/token without importing Node server modules in the browser bundle.
 */

function isTokenValid(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    const nowSec = Math.floor(Date.now() / 1000);
    // Token is valid if userRole is admin and expiration is at least 30s in the future
    return payload.userRole === 'admin' && typeof payload.exp === 'number' && payload.exp > nowSec + 30;
  } catch {
    return false;
  }
}

export async function getAdminBearerToken(
  user?: {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
  } | null,
  forceRefresh = false
): Promise<string> {
  if (typeof window === 'undefined') return '';

  const stored = localStorage.getItem('admin_bearer_token');
  if (stored && !forceRefresh && isTokenValid(stored)) {
    return stored;
  }

  // Clear stale or expired token
  if (stored) {
    localStorage.removeItem('admin_bearer_token');
  }

  try {
    const res = await fetch('/api/v1/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meetingId: 'admin_control_plane',
        userId: user?.id || 'f16e43bf-2ff8-480c-ae49-e2285940bf46',
        userEmail: user?.email || 'shashi@admin.com',
        userName: user?.name || 'shashi',
        userRole: 'admin',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('admin_bearer_token', data.token);
        return data.token;
      }
    }
  } catch (err) {
    console.error('[adminTokenHelper] Failed to acquire admin token:', err);
  }

  return '';
}
