import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/query/queryKeys';
import { meetingClientService } from '../services/meetingClientService';
import { meetingMutationTracker } from '../services/meetingMutationTracker';
import { getAdminBearerToken } from '../../auth/services/adminTokenHelper';
import type { UserRole } from '../../auth/types/auth.types';
import type { MeetingStatus } from '../../../../server/meetings/meetingTypes';
import type { MeetingRecord, MeetingOpsDashboardStats } from '../../../../server/meetings/meetingOpsTypes';

export interface UserContextParam {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AdminMeetingsQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  meetingType?: string;
  batchId?: string;
  search?: string;
}

export interface AdminMeetingsResult {
  meetings: MeetingRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  dashboardStats?: MeetingOpsDashboardStats;
}

export function useStudentMeetings(currentUser?: UserContextParam, statusFilter?: MeetingStatus) {
  return useQuery({
    queryKey: queryKeys.meetings.list({ status: statusFilter, userId: currentUser?.id }),
    queryFn: async ({ signal }) => {
      if (!currentUser) return [];
      const meetings = await meetingClientService.listMeetings(currentUser, statusFilter, signal);
      return meetings || [];
    },
    enabled: Boolean(currentUser?.id),
    staleTime: 15 * 1000,
  });
}

/**
 * Authoritative Server State: Admin Meetings & Ops Query (Requirement 21 & 22)
 * Disallows independent local state. Uses abort signals & mutation sanitization.
 */
export function useAdminMeetingsQuery(
  currentUser?: UserContextParam,
  params: AdminMeetingsQueryParams = {}
) {
  return useQuery({
    queryKey: queryKeys.meetings.list(params as Record<string, any>),
    queryFn: async ({ signal }): Promise<AdminMeetingsResult> => {
      let token = await getAdminBearerToken(currentUser);
      const searchParams = new URLSearchParams({
        page: String(params.page || 1),
        limit: String(params.limit || 10),
      });
      if (params.status && params.status !== 'ALL') searchParams.set('status', params.status);
      if (params.meetingType && params.meetingType !== 'ALL') searchParams.set('meetingType', params.meetingType);
      if (params.batchId && params.batchId !== 'ALL') searchParams.set('batchId', params.batchId);
      if (params.search && params.search.trim()) searchParams.set('search', params.search.trim());

      let res = await fetch(`/api/v1/admin/meetings?${searchParams.toString()}`, {
        signal,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401) {
        token = await getAdminBearerToken(currentUser, true);
        res = await fetch(`/api/v1/admin/meetings?${searchParams.toString()}`, {
          signal,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to load meetings.`);
      }

      const json = await res.json();
      const rawMeetings: MeetingRecord[] = json.meetings || [];
      const cleanMeetings = meetingMutationTracker.sanitizeMeetingList(rawMeetings);

      return {
        meetings: cleanMeetings,
        pagination: json.pagination || { page: 1, limit: 10, total: cleanMeetings.length, totalPages: 1 },
        dashboardStats: json.dashboardStats,
      };
    },
    enabled: Boolean(currentUser?.role === 'admin'),
    staleTime: 10 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Delete Race Condition Protection Mutation (Requirement 22 & 24 & 25)
 * - Aborts in-flight GET requests
 * - Optimistically removes deleted meeting from all query caches
 * - Invokes idempotent backend delete
 * - Invalidation keeps server state synchronized without restoring deleted items
 */
export function useDeleteMeetingMutation(currentUser?: UserContextParam) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ meetingId, reason }: { meetingId: string; reason?: string }) => {
      if (!currentUser) throw new Error('Authentication required');
      // Step 1: Register deletion & cancel in-flight queries
      meetingMutationTracker.registerDelete(meetingId);
      await queryClient.cancelQueries({ queryKey: queryKeys.meetings.all });

      // Step 2: Call backend API
      return meetingClientService.deleteMeeting(currentUser, meetingId, reason);
    },
    onMutate: async ({ meetingId }) => {
      // Optimistic cache update across all meeting list queries
      await queryClient.cancelQueries({ queryKey: queryKeys.meetings.all });
      queryClient.setQueriesData({ queryKey: queryKeys.meetings.all }, (oldData: any) => {
        if (!oldData) return oldData;
        if (Array.isArray(oldData)) {
          return oldData.filter((m: any) => m.id !== meetingId);
        }
        if (oldData.meetings && Array.isArray(oldData.meetings)) {
          return {
            ...oldData,
            meetings: oldData.meetings.filter((m: any) => m.id !== meetingId),
            pagination: oldData.pagination ? {
              ...oldData.pagination,
              total: Math.max(0, (oldData.pagination.total || 1) - 1),
            } : oldData.pagination,
          };
        }
        return oldData;
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings.all });
    },
  });
}

export function useMeetingRsvpMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ meetingId, status, token }: { meetingId: string; status: 'accepted' | 'declined'; token?: string }) => {
      const response = await fetch('/api/v1/meetings/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ meetingId, status }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to record RSVP');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings.all });
    },
  });
}

/**
 * Realtime Meeting Sync Hook (Requirement 23)
 * Subscribes to realtime events (WebSocket / EventSource) and updates React Query server state.
 */
export function useRealtimeMeetingSync(socket: any) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const onMeetingDeleted = (data: { meetingId: string }) => {
      if (!data?.meetingId) return;
      meetingMutationTracker.registerDelete(data.meetingId);
      queryClient.setQueriesData({ queryKey: queryKeys.meetings.all }, (oldData: any) => {
        if (!oldData) return oldData;
        if (Array.isArray(oldData)) {
          return oldData.filter((m: any) => m.id !== data.meetingId);
        }
        if (oldData.meetings && Array.isArray(oldData.meetings)) {
          return {
            ...oldData,
            meetings: oldData.meetings.filter((m: any) => m.id !== data.meetingId),
          };
        }
        return oldData;
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings.all });
    };

    const onMeetingUpdated = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings.all });
    };

    socket.on('meeting:deleted', onMeetingDeleted);
    socket.on('meeting:created', onMeetingUpdated);
    socket.on('meeting:updated', onMeetingUpdated);
    socket.on('meeting:cancelled', onMeetingUpdated);

    return () => {
      socket.off('meeting:deleted', onMeetingDeleted);
      socket.off('meeting:created', onMeetingUpdated);
      socket.off('meeting:updated', onMeetingUpdated);
      socket.off('meeting:cancelled', onMeetingUpdated);
    };
  }, [socket, queryClient]);
}

