export const queryKeys = {
  meetings: {
    all: ['meetings'] as const,
    list: (filters?: Record<string, any>) => ['meetings', 'list', filters || {}] as const,
    detail: (id: string) => ['meetings', 'detail', id] as const,
    participants: (id: string) => ['meetings', 'participants', id] as const,
  },
  candidates: {
    all: ['candidates'] as const,
    list: (filters?: Record<string, any>) => ['candidates', 'list', filters || {}] as const,
    detail: (id: string) => ['candidates', 'detail', id] as const,
    performance: (id: string) => ['candidates', 'performance', id] as const,
  },
  questions: {
    all: ['questions'] as const,
    bank: (category?: string) => ['questions', 'bank', category || 'all'] as const,
    detail: (id: string) => ['questions', 'detail', id] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    user: (userId: string) => ['notifications', 'user', userId] as const,
  },
};
