/**
 * Utility functions to detect and filter out generic batch-generated boilerplate
 * in interview questions, ensuring candidate views contain only authentic,
 * question-specific content.
 */

export function isGenericHowItWorks(text?: string | null): boolean {
  if (!text || typeof text !== 'string') return true
  const trimmed = text.trim()
  if (trimmed.length === 0) return true
  const lower = trimmed.toLowerCase()

  // CSS rendering engine duplicate
  if (lower.includes('under the hood in the browser rendering engine')) return true
  if (lower.includes('the browser css parser tokenizes rules')) return true

  // JS engine generic duplicate
  if (lower.includes('under the hood in the javascript engine')) return true

  // Browser generic duplicate
  if (lower.includes('under the hood in the browser:')) return true

  // React Fiber generic duplicate
  if (lower.includes('under the hood in react fiber')) return true

  // Redux generic duplicate
  if (lower.includes('under the hood in redux')) return true

  // TypeScript compiler generic duplicate
  if (lower.includes('under the hood in the typescript compiler')) return true

  // jQuery generic duplicate
  if (lower.includes('the jquery collection targets matching dom nodes')) return true

  // HTML generic duplicates
  if (lower.includes('the browser requests and receives the raw html bytes')) return true
  if (lower.includes('the browser engine parses the html markup into the dom tree')) return true
  if (lower.includes('as the parser reads an opening tag, it identifies attribute')) return true

  // Generic runtime initializes pattern across tracks
  if (/^1\.\s*the .* runtime initializes/i.test(trimmed)) return true

  return false
}

export function isGenericExecutionFlow(flow?: string[] | null): boolean {
  if (!flow || !Array.isArray(flow) || flow.length === 0) return true
  const first = (flow[0] || '').toLowerCase()
  if (first.includes('abstract syntax tree')) return true
  if (first.includes('browser hardware event')) return true
  if (first.includes('css object model') || first.includes('cssom')) return true
  if (first.includes('state setter function triggers re-render')) return true
  if (first.includes('store.dispatch(action)')) return true
  if (first.includes('scanner tokenizes raw source text')) return true
  return false
}
