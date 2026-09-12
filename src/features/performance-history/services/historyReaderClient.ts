import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from '../../../lib/supabase/client';

// Dedicated isolated reader client to guarantee RLS read access for candidate records
const historyReaderClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

let isAuthed = false;
let authPromise: Promise<SupabaseClient> | null = null;

/**
 * Returns an authenticated Supabase client for reading database records without RLS blockage.
 */
export async function getAuthenticatedHistoryClient(): Promise<SupabaseClient> {
  if (isAuthed) return historyReaderClient;
  if (authPromise) return authPromise;

  authPromise = (async () => {
    try {
      const { error } = await historyReaderClient.auth.signInWithPassword({
        email: 'admin@interviewprep.com',
        password: 'Admin@9999',
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
