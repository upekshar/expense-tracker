import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchExpenses } from "../expenses";

export const useExpenses = (limit: number, category: string) => {
  return useInfiniteQuery({
    queryKey: ["expenses", category],
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      if (!navigator.onLine) {
        const cached = localStorage.getItem("expenses_cache");
        return { data: cached ? JSON.parse(cached) : [] };
      }

      return fetchExpenses(pageParam as number, limit, category);
    },

    getNextPageParam: (lastPage, allPages) => {
      // If lastPage returned no items → stop
      if (!lastPage.data || lastPage.data.length === 0) {
        return undefined;
      }
      // Still has items → try next page
      return allPages.length + 1;
    },

    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
  });
};

