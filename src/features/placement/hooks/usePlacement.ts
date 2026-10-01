import { useCallback, useEffect, useState } from 'react'
import type {
  PlacementAttempt,
  PlacementDailyPriorityItem,
  PlacementProgress,
} from '../types/placement.types'
import { placementService, type WeakTopicStat } from '../services/placement.service'
import { PLACEMENT_PROGRAM } from '../data/curriculum'

export function usePlacement(userId: string | undefined) {
  const [progress, setProgress] = useState<PlacementProgress | null>(null)
  const [priority, setPriority] = useState<PlacementDailyPriorityItem[]>([])
  const [weakTopics, setWeakTopics] = useState<WeakTopicStat[]>([])
  const [attempts, setAttempts] = useState<PlacementAttempt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const current = await placementService.getProgress(userId)
      setProgress(current)
      setAttempts(await placementService.getAttempts(userId))
      setWeakTopics(await placementService.getWeakSubcategories(userId))
      setPriority(await placementService.buildDailyPriority(userId, current.currentDay))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to load placement progress')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const recordAttempt = useCallback(
    async (attempt: Omit<PlacementAttempt, 'id' | 'userId' | 'createdAt'>) => {
      if (!userId) return null
      const saved = await placementService.recordAttempt(userId, attempt)
      await refresh()
      return saved
    },
    [userId, refresh],
  )

  const completeDay = useCallback(
    async (dayNumber: number) => {
      if (!userId) return null
      const updated = await placementService.markDayComplete(userId, dayNumber)
      setProgress(updated)
      return updated
    },
    [userId],
  )

  return {
    program: PLACEMENT_PROGRAM,
    progress,
    priority,
    weakTopics,
    attempts,
    loading,
    error,
    refresh,
    recordAttempt,
    completeDay,
  }
}
