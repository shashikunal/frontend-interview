import { useEffect, useState } from 'react'
import type { Question } from '../models/question'
import { loadAll } from './questionService'

interface QuestionsState {
  questions: Question[]
  loading: boolean
  error: string | null
}

export function useQuestions(): QuestionsState {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    loadAll()
      .then(qs => {
        if (!cancelled) {
          setQuestions(qs)
          setLoading(false)
        }
      })
      .catch(e => {
        if (!cancelled) {
          setQuestions([])
          setLoading(false)
          setError(e instanceof Error ? e.message : 'Failed to load questions')
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { questions, loading, error }
}
