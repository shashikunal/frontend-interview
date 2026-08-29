import type { Files } from '../lib/runner'
import data from './taskBased.json'

export interface TaskExample {
  id: string
  title: string
  description: string
  starter: Files
  solution: Files
}

export const taskExamples = (data as unknown as { examples: TaskExample[] }).examples
