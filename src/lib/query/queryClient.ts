import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute default stale time
      gcTime: 5 * 60 * 1000, // 5 minutes garbage collection time
      retry: (failureCount, error: any) => {
        // Do not retry on explicit 401/403 auth errors
        if (error?.status === 401 || error?.status === 403) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
