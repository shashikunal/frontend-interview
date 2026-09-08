import { useEffect, useMemo } from 'react'
import { useProgress } from '../context/ProgressContext'
import { useBookmarks } from '../context/BookmarkContext'
import { badgeService, type CandidateStats } from '../lib/badgeService'

export function useBadgeEvaluator(): CandidateStats {
  const { solvedIds, streak, mockInterviews } = useProgress()
  const { bookmarkedCount } = useBookmarks()

  const stats: CandidateStats = useMemo(() => {
    const solvedCount = solvedIds.size
    const strongHireCount = mockInterviews.filter(m => m.verdict === 'Strong Hire').length
    const mockCount = mockInterviews.length
    const machineCodingCount = Math.max(
      mockInterviews.reduce((acc, m) => acc + ((m.testCasesPassed && m.testCasesPassed > 0) ? 1 : 0), 0),
      solvedCount > 0 ? 1 : 0
    )

    return {
      solvedCount,
      streakDays: streak,
      mockCount,
      strongHireCount,
      bookmarkedCount,
      machineCodingCount,
    }
  }, [solvedIds.size, streak, mockInterviews, bookmarkedCount])

  // Automatically check for new unlocks and dispatch celebrations
  useEffect(() => {
    badgeService.checkAndNotifyNewUnlocks(stats)
  }, [stats])

  return stats
}
