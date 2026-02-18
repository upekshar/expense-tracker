import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchExpenses } from "../expenses";

export const useExpenses = (limit: number, category: string) => {
  return useInfiniteQuery({
    queryKey: ["expenses", category],
    initialPageParam: 1,

    queryFn: async ({ pageParam = 1 }) => {
      let all, total;

      if (!navigator.onLine) {
        const cached = localStorage.getItem("expenses_cache");
        all = cached ? JSON.parse(cached) : [];
      } else {
        const fetched = await fetchExpenses(pageParam, limit, category);
        all = fetched.data;
        total = fetched.total;
      }

      const start = (pageParam - 1) * limit;
      return {
        data: all.slice(start, start + limit),
        total: total ?? all.length
      };
    },

    getNextPageParam: (lastPage, allPages) => {
      const alreadyFetched = allPages.reduce(
        (sum, page) => sum + page.data.length,
        0
      );
      return lastPage.total > alreadyFetched
        ? allPages.length + 1
        : undefined;
    },

    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
  });
};


