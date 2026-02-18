// src/api/mutations/useExpenseMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addExpense, updateExpense, deleteExpense } from "../expenses";
import { Expense } from "../../types/Expense";

export const useExpenseMutations = () => {
  const queryClient = useQueryClient();

  // ---------------- HELPER: remove item from all pages ----------------
  const removeFromPages = (pages: any[], id: string) => {
    return pages.map((page) => ({
      ...page,
      data: page.data.filter((item: any) => item.id !== id),
    }));
  };

  // ---------------- ADD ----------------
  const add = useMutation({
  mutationFn: addExpense,

  onMutate: async (newExpense: any) => {
    await queryClient.cancelQueries({ queryKey: ["expenses", newExpense.category] });

    const previous = queryClient.getQueryData(["expenses", newExpense.category]);

    queryClient.setQueryData(["expenses", newExpense.category], (old: any) => {
      if (!old) return old;

      return {
        ...old,
        pages: old.pages.map((page: any, idx: number) => {
          if (idx === 0) {
            return {
              ...page,
              data: [newExpense, ...page.data],
            };
          }
          return page;
        }),
      };
    });

    return { previous };
  },

  onError: (err, newExpense, context) => {
    if (context?.previous) {
      queryClient.setQueryData(["expenses", (newExpense as any).category], context.previous);
    }
  },

  onSettled: (data, error, variables) => {
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
  }
});


  // ---------------- UPDATE ----------------
  const update = useMutation({
    mutationFn: updateExpense,

    onMutate: async (updatedExpense: Expense) => {
      await queryClient.cancelQueries({ queryKey: ["expenses"] });
      const previousData = queryClient.getQueryData(["expenses"]);

      // Immediately update cache
      queryClient.setQueryData(["expenses"], (oldData: any) => {
        if (!oldData) return oldData;

        // Remove existing item
        const cleanedPages = removeFromPages(oldData.pages, updatedExpense.id);

        // Insert updated item at top
        const updatedPages = cleanedPages.map((page: any, index: number) => {
          if (index === 0) {
            return { ...page, data: [updatedExpense, ...page.data] };
          }
          return page;
        });

        return { ...oldData, pages: updatedPages };
      });

      return { previousData };
    },

    onError: (_err, _updatedExpense, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["expenses"], context.previousData);
      }
    },

    onSettled: () => {
      // Optionally refetch
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  // ---------------- DELETE ----------------
  const remove = useMutation({
    mutationFn: deleteExpense,

    onMutate: async (deletedId: string) => {
      await queryClient.cancelQueries({ queryKey: ["expenses"] });
      const previousData = queryClient.getQueryData(["expenses"]);

      // Immediately remove
      queryClient.setQueryData(["expenses"], (oldData: any) => {
        if (!oldData) return oldData;

        const updatedPages = oldData.pages.map((page: any) => ({
          ...page,
          data: page.data.filter((item: any) => item.id !== deletedId),
        }));

        return { ...oldData, pages: updatedPages };
      });

      return { previousData };
    },

    onError: (_err, _deletedId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["expenses"], context.previousData);
      }
    },

    onSettled: () => {
      // Optionally refetch
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  return { add, update, remove };
};
