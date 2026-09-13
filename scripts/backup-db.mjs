import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load .env
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      if (!process.env[key]) process.env[key] = value.trim();
    }
  }
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://lzjkxfxaiuemjsiflwlv.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_PASSWORD = process.env.VITE_ADMIN_PASSWORD || 'Admin@9999';

if (!SUPABASE_KEY) {
  console.error('Missing VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const client = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const TABLES = [
  'profiles',
  'submissions',
  'core_programming_submissions',
  'dsa_submissions',
  'frontend_js_submissions',
  'frontend_js_attempts',
  'question_attempts',
  'user_question_progress',
  'user_progress',
  'activity_logs',
  'mock_interview_sessions',
  'mock_final_scorecards',
  'mock_answers',
];

async function fetchTableAllRows(tableName) {
  const pageSize = 1000;
  let offset = 0;
  const allRows = [];

  while (true) {
    const { data, error } = await client
      .from(tableName)
      .select('*')
      .range(offset, offset + pageSize - 1);

    if (error) {
      console.warn(`[Backup] Table '${tableName}' error:`, error.message);
      break;
    }

    if (!data || data.length === 0) break;
    allRows.push(...data);
    offset += data.length;

    if (data.length < pageSize) break;
  }

  return allRows;
}

async function runBackup() {
  console.log('🔄 Authenticating as admin to bypass RLS...');
  const { error: authErr } = await client.auth.signInWithPassword({
    email: 'admin@interviewprep.com',
    password: ADMIN_PASSWORD,
  });

  if (authErr) {
    console.error('❌ Admin authentication failed:', authErr.message);
    process.exit(1);
  }
  console.log('✅ Admin authenticated successfully.\n');

  const todayStr = new Date().toISOString().split('T')[0];
  const outputFileName = `db-backup-${todayStr}.json`;
  const outputPath = path.resolve(process.cwd(), outputFileName);

  const backupData = {
    backedUpAt: new Date().toISOString(),
    supabaseUrl: SUPABASE_URL,
    tables: {},
  };

  console.log(`📦 Starting full database backup to: ${outputFileName}\n`);
  console.log('---------------------------------------------------------');
  console.log('| Table Name                      | Total Rows Backed Up |');
  console.log('---------------------------------------------------------');

  let totalRecords = 0;

  for (const table of TABLES) {
    process.stdout.write(`| ${table.padEnd(31)} | `);
    const rows = await fetchTableAllRows(table);
    backupData.tables[table] = {
      count: rows.length,
      rows,
    };
    totalRecords += rows.length;
    console.log(`${String(rows.length).padStart(20)} |`);
  }

  console.log('---------------------------------------------------------');
  console.log(`| TOTAL RECORDS                   | ${String(totalRecords).padStart(20)} |`);
  console.log('---------------------------------------------------------\n');

  console.log('💾 Writing backup file to disk...');
  fs.writeFileSync(outputPath, JSON.stringify(backupData, null, 2), 'utf8');

  const stats = fs.statSync(outputPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log(`\n🎉 Backup complete!`);
  console.log(`📁 File: ${outputPath}`);
  console.log(`📊 Size: ${sizeMB} MB`);
  console.log(`🕒 Timestamp: ${backupData.backedUpAt}`);
}

runBackup().catch((err) => {
  console.error('Fatal backup error:', err);
  process.exit(1);
});
