export interface TermLine {
  id: number
  kind: 'log' | 'info' | 'warn' | 'error' | 'system' | 'input'
  text: string
}

let lineId = 0

export function makeLine(kind: TermLine['kind'], text: string): TermLine {
  return { id: ++lineId, kind, text }
}
