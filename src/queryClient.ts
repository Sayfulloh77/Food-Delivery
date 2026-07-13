import { QueryClient } from '@tanstack/vue-query'

export const queryClient = new QueryClient({
  defaultOptions: { 
    queries: {
      // Backend data here changes from other users' actions (new orders, status
      // updates), so keep results fresh rather than trusting a long stale time.
      staleTime: 15_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
