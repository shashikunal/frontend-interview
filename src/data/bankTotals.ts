import totals from './bankTotals.json'

/**
 * Single source of truth for question-bank counts shown in the UI.
 * Values live in bankTotals.json and are re-computed + enforced by
 * `npm run validate:questions` (scripts/validate-interview-bank.mjs,
 * pass `-- --write` to refresh the file) so displayed numbers can never
 * drift from the actual data files.
 */
export const bankTotals = totals

/** 15941 -> "15,941" */
export const fmtCount = (n: number): string => n.toLocaleString('en-US')

/** 15941 -> "15.9K", 1233 -> "1.2K" */
export const fmtK = (n: number): string => `${Math.round(n / 100) / 10}K`
