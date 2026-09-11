import { useState } from 'react';
import { supabase } from '../../../lib/supabase/client';

const BACKUP_TABLES = [
  'profiles',
  'submissions',
  'core_programming_submissions',
  'frontend_js_submissions',
  'frontend_js_attempts',
  'question_attempts',
  'user_question_progress',
  'user_progress',
  'activity_logs',
  'dsa_submissions',
  'interview_sessions',
] as const;

const PAGE_SIZE = 1000;
const ACTIVITY_LOG_CAP = 10000;

export default function AdminBackupButton({ showToast }: { showToast?: (msg: string) => void }) {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [progress, setProgress] = useState('');

  const handleBackup = async () => {
    if (isBackingUp) return;
    setIsBackingUp(true);
    setProgress('Starting…');
    try {
      const dump: Record<string, { count: number; rows: unknown[] } | { error: string }> = {};
      for (const table of BACKUP_TABLES) {
        const cap = table === 'activity_logs' ? ACTIVITY_LOG_CAP : Number.MAX_SAFE_INTEGER;
        const rows: unknown[] = [];
        let from = 0;
        let tableError: string | null = null;
        while (rows.length < cap) {
          const to = Math.min(from + PAGE_SIZE - 1, cap - 1);
          const { data, error } = await supabase.from(table).select('*').range(from, to);
          if (error) {
            tableError = error.message;
            break;
          }
          rows.push(...(data || []));
          if (!data || data.length < PAGE_SIZE) break;
          from += PAGE_SIZE;
          setProgress(`${table} (${rows.length})…`);
        }
        dump[table] = tableError && rows.length === 0 ? { error: tableError } : { count: rows.length, rows };
      }
      const payload = { backedUpAt: new Date().toISOString(), tables: dump };
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `db-backup-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      const total = Object.values(dump).reduce((n, t) => n + ('count' in t ? t.count : 0), 0);
      setProgress('');
      showToast?.(`Backup downloaded (${total} rows across ${BACKUP_TABLES.length} tables).`);
    } catch (err) {
      setProgress('');
      showToast?.(`Backup failed: ${err instanceof Error ? err.message : 'unknown error'}`);
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <button type="button" className="btn btn-secondary" onClick={handleBackup} disabled={isBackingUp}>
      {isBackingUp ? `⏳ Backing up… ${progress}` : '🛡️ Backup Database (JSON)'}
    </button>
  );
}
