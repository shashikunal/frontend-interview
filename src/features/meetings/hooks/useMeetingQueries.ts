import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/query/queryKeys';
import { meetingClientService } from '../services/meetingClientService';
import type { UserRole } from '../../auth/types/auth.types';
import type { MeetingStatus } from '../../../../server/meetings/meetingTypes';

export interface UserContextParam {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export function useStudentMeetings(currentUser?: UserContextParam, statusFilter?: MeetingStatus) {
  return useQuery({
    queryKey: queryKeys.meetings.list({ status: statusFilter, userId: currentUser?.id }),
    queryFn: async () => {
      if (!currentUser) return [];
      const meetings = await meetingClientService.listMeetings(currentUser, statusFilter);
      return meetings || [];
    },
    enabled: Boolean(currentUser?.id),
    staleTime: 30 * 1000,
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
