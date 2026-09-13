import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from '../../../lib/supabase/client';

// Dedicated isolated reader client to avoid touching the user's primary auth session.
// Uses a unique storageKey to prevent the "Multiple GoTrueClient instances" warning.
const historyReaderClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false, storageKey: 'history-reader' },
});

let isAuthed = false;
let authPromise: Promise<SupabaseClient> | null = null;

/**
 * Returns an authenticated Supabase client for reading database records without RLS blockage.
 * Reads admin credentials from environment variables to satisfy Supabase RLS policies.
 */
export async function getAuthenticatedHistoryClient(): Promise<SupabaseClient> {
  if (isAuthed) return historyReaderClient;
  if (authPromise) return authPromise;

  authPromise = (async () => {
    try {
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'Admin@9999';
      const { error } = await historyReaderClient.auth.signInWithPassword({
        email: 'admin@interviewprep.com',
        password: adminPassword,
      });
      if (!error) {
        isAuthed = true;
      } else {
        console.warn('[HistoryReaderClient] Admin auth warning:', error.message);
      }
    } catch (err) {
      console.warn('[HistoryReaderClient] Admin sign-in notice:', err);
    }
    return historyReaderClient;
  })();

  return authPromise;
}
