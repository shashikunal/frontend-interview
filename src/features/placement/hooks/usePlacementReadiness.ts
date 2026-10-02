import { useCallback, useEffect, useState } from 'react'
import type { PlacementReadiness, ReadinessConfig } from '../types/placement.types'
import {
  DEFAULT_READINESS_CONFIG,
  placementReadinessService,
} from '../services/placementReadiness.service'

export function usePlacementReadiness(userId: string | undefined) {
  const [config, setConfig] = useState<ReadinessConfig>(DEFAULT_READINESS_CONFIG)
  const [readiness, setReadiness] = useState<PlacementReadiness | null>(null)
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
      const loadedConfig = await placementReadinessService.getConfig()
      setConfig(loadedConfig)
      const computed = await placementReadinessService.computeReadiness(userId)
      setReadiness(computed)
      await placementReadinessService.persistReadiness(userId, computed)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to compute readiness')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { config, readiness, loading, error, refresh }
}
