import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { trackingService } from '../lib/trackingService'

import { useAuth } from '../features/auth/hooks/useAuth'

const BOOKMARK_STORAGE_PREFIX = 'interview-prep-bookmarks'

interface BookmarkContextType {
  bookmarkedIds: Set<number>
  bookmarkedCount: number
  isBookmarked: (id: number) => boolean
  toggleBookmark: (id: number) => void
  addBookmark: (id: number) => void
  removeBookmark: (id: number) => void
  clearBookmarks: () => void
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined)

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const userId = user?.id || 'guest'
  const storageKey = `${BOOKMARK_STORAGE_PREFIX}_${userId}`

  const loadBookmarksForUser = useCallback((uId: string): Set<number> => {
    if (typeof window !== 'undefined') {
      try {
        const key = `${BOOKMARK_STORAGE_PREFIX}_${uId}`
        const saved = localStorage.getItem(key)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed)) {
            return new Set<number>(parsed)
          }
        }
      } catch {
        // Ignore parse error
      }
    }
    return new Set<number>()
  }, [])

  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(() => loadBookmarksForUser(userId))

  // Synchronize when authenticated user changes
  useEffect(() => {
    setBookmarkedIds(loadBookmarksForUser(userId))
  }, [userId, loadBookmarksForUser])

  // Synchronize state changes to user-scoped localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(bookmarkedIds)))
    } catch {
      // Ignore quota errors
    }
  }, [bookmarkedIds, storageKey])

  const isBookmarked = useCallback((id: number): boolean => {
    return bookmarkedIds.has(id)
  }, [bookmarkedIds])

  const toggleBookmark = useCallback((id: number) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev)
      const isRemoving = next.has(id)
      if (isRemoving) {
        next.delete(id)
        trackingService.trackActivity('question_unbookmarked', 'question', id)
      } else {
        next.add(id)
        trackingService.trackActivity('question_bookmarked', 'question', id)
      }
      return next
    })
  }, [])

  const addBookmark = useCallback((id: number) => {
    setBookmarkedIds(prev => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      trackingService.trackActivity('question_bookmarked', 'question', id)
      return next
    })
  }, [])

  const removeBookmark = useCallback((id: number) => {
    setBookmarkedIds(prev => {
      if (!prev.has(id)) return prev
      const next = new Set(prev)
      next.delete(id)
      trackingService.trackActivity('question_unbookmarked', 'question', id)
      return next
    })
  }, [])

  const clearBookmarks = useCallback(() => {
    setBookmarkedIds(new Set())
  }, [])

  return (
    <BookmarkContext.Provider
      value={{
        bookmarkedIds,
        bookmarkedCount: bookmarkedIds.size,
        isBookmarked,
        toggleBookmark,
        addBookmark,
        removeBookmark,
        clearBookmarks,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  )
}

export function useBookmarks(): BookmarkContextType {
  const context = useContext(BookmarkContext)
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider')
  }
  return context
}
