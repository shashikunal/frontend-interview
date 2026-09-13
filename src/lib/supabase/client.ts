import { createClient } from '@supabase/supabase-js'

const globalObj = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined
const nodeProcess = globalObj?.process

// In Node.js environments (such as when vite.config.ts imports server/socket), load .env if available
if (nodeProcess && typeof nodeProcess.loadEnvFile === 'function') {
  try {
    nodeProcess.loadEnvFile()
  } catch {}
}

const supabaseUrl =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  nodeProcess?.env?.VITE_SUPABASE_URL ||
  'https://lzjkxfxaiuemjsiflwlv.supabase.co'

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  nodeProcess?.env?.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8'

export { supabaseUrl, supabaseAnonKey }
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
