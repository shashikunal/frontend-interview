/**
 * Shared storage helpers for the placement module.
 *
 * Every placement service follows the repository convention: try Supabase
 * first, then fall back to localStorage so the module keeps working before the
 * placement migrations have been applied to a given environment.
 */

const LOCAL_PREFIX = 'placement_v1'

export function placementLocalKey(scope: string, userId: string): string {
  return `${LOCAL_PREFIX}:${scope}:${userId || 'anonymous'}`
}

export function readLocal<T>(scope: string, userId: string, fallback: T): T {
  if (typeof localStorage === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(placementLocalKey(scope, userId))
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeLocal<T>(scope: string, userId: string, value: T): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(placementLocalKey(scope, userId), JSON.stringify(value))
  } catch {
    // Storage may be full or unavailable — placement state is non-critical.
  }
}

export function removeLocal(scope: string, userId: string): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.removeItem(placementLocalKey(scope, userId))
  } catch {
    /* ignore */
  }
}

export function generateLocalId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10)
}

export function nowIso(): string {
  return new Date().toISOString()
}

/** Maps snake_case DB rows onto the camelCase view models used by the UI. */
export function snakeToCamelRow<T>(row: Record<string, unknown>): T {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(row)) {
    const camel = key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
    out[camel] = value
  }
  return out as T
}
