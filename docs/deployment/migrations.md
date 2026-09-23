# Zero-Downtime Database Migration Guidelines (Phase 18)

## 1. The Expand-Contract (Parallel Run) Pattern
All database schema evolutions must be divided into three discrete phases:

```
  Phase 1: Expand
  Add new columns / tables with NULL or safe default values.
  Do not modify existing columns.
         │
         ▼
  Phase 2: Deploy Code
  Deploy application version that writes to both old and new columns,
  reading primarily from the new schema with fallback to old.
         │
         ▼
  Phase 3: Backfill & Contract
  Backfill historic rows. Once all old application versions are decommissioned,
  deploy a cleanup migration removing deprecated columns.
```

---

## 2. Strict Migration Safety Rules
1. **Never Rename Columns Directly**: Renaming a column causes instantaneous failures for active containers still running the previous code version. Instead, add the new column and use double-writes.
2. **Add Indexes Concurrently in Production**:
   ```sql
   CREATE INDEX CONCURRENTLY idx_example ON table_name(column_name);
   ```
   Prevents table-level write locks on large active tables.
3. **Always Include Defaults for NOT NULL Columns**: When adding a `NOT NULL` column, provide a `DEFAULT` or add it as nullable first, backfill rows, and subsequently add the constraint.
4. **Deterministic Migration Naming**: Format files with ISO timestamp prefix: `YYYYMMDD_feature_description.sql` (e.g., `20260923_meeting_recordings_and_transcripts.sql`).
