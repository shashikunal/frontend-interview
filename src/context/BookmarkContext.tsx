import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'

const BOOKMARK_STORAGE_KEY = 'interview-prep-bookmarks'

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
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(BOOKMARK_STORAGE_KEY)
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
  })

  // Synchronize state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(Array.from(bookmarkedIds)))
    } catch {
      // Ignore quota errors
    }
  }, [bookmarkedIds])

  const isBookmarked = useCallback((id: number): boolean => {
    return bookmarkedIds.has(id)
  }, [bookmarkedIds])

  const toggleBookmark = useCallback((id: number) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const addBookmark = useCallback((id: number) => {
    setBookmarkedIds(prev => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const removeBookmark = useCallback((id: number) => {
    setBookmarkedIds(prev => {
      if (!prev.has(id)) return prev
      const next = new Set(prev)
      next.delete(id)
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
