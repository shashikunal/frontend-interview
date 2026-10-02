import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileService } from '../features/auth/services/profile.service'
import { cloudinaryService } from '../lib/cloudinaryService'
import { useAuth } from '../features/auth/hooks/useAuth'
import type { AuthUserProfile } from '../features/auth/types/auth.types'

export const PROFILE_QUERY_KEY = ['userProfile']

/**
 * Hook to query active user profile from Supabase with TanStack Query
 */
export function useProfileQuery() {
  const { user } = useAuth()
  const userId = user?.id

  return useQuery({
    queryKey: [...PROFILE_QUERY_KEY, userId],
    queryFn: async () => {
      if (!userId) return null
      return await profileService.getProfile(userId)
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  })
}

/**
 * Mutation to update profile metadata in Supabase
 */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()
  const { updateProfile } = useAuth()

  return useMutation({
    mutationFn: async (updates: Partial<AuthUserProfile>) => {
      const res = await updateProfile(updates)
      if (!res.success) {
        throw new Error(res.message || 'Failed to update profile.')
      }
      return updates
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
    },
  })
}

/**
 * Mutation to upload a profile avatar to Cloudinary and update Supabase profile
 */
export function useUploadAvatarMutation() {
  const queryClient = useQueryClient()
  const { user, updateProfile } = useAuth()

  return useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('You must be signed in to upload an avatar.')

      // 1. Upload new image to Cloudinary
      const uploadRes = await cloudinaryService.uploadAvatar(file)
      if (!uploadRes.success || !uploadRes.avatar_url) {
        throw new Error(uploadRes.error || 'Avatar upload failed.')
      }

      // 2. Delete previous Cloudinary asset if public ID exists
      if (user.avatarPublicId) {
        cloudinaryService.removeAvatar(user.avatarPublicId).catch(() => {})
      }

      // 3. Update Supabase profile metadata
      const updateRes = await updateProfile({
        avatarUrl: uploadRes.avatar_url,
        avatarPublicId: uploadRes.avatar_public_id,
      })

      if (!updateRes.success) {
        throw new Error(updateRes.message || 'Failed to save avatar URL to profile.')
      }

      return {
        avatarUrl: uploadRes.avatar_url,
        avatarPublicId: uploadRes.avatar_public_id,
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
    },
  })
}

/**
 * Mutation to remove profile avatar and revert to initials fallback
 */
export function useRemoveAvatarMutation() {
  const queryClient = useQueryClient()
  const { user, updateProfile } = useAuth()

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('You must be signed in to remove avatar.')

      // 1. Delete asset from Cloudinary if public ID exists
      if (user.avatarPublicId) {
        await cloudinaryService.removeAvatar(user.avatarPublicId)
      }

      // 2. Clear avatar metadata in Supabase profile
      const updateRes = await updateProfile({
        avatarUrl: '',
        avatarPublicId: '',
      })

      if (!updateRes.success) {
        throw new Error(updateRes.message || 'Failed to update profile.')
      }

      return true
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
    },
  })
}
