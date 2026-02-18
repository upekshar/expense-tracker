import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addExpense, updateExpense, deleteExpense } from "../expenseOperations";
import { Expense } from "../../types/Expense";

export const useExpenseMutations = () => {
  const queryClient = useQueryClient();

  /**
   * Note: We could split these into separate hooks (useAddExpense, useUpdateExpense, etc) for better separation of concerns and to avoid unnecessary re-renders in components that only need one of the mutations. However, for simplicity and given they share the same query invalidation logic, I've kept them together in a single hook.
   */
  const add = useMutation({
    mutationFn: addExpense,

    onMutate: async (newExpense: Expense) => {
      await queryClient.cancelQueries({ queryKey: ["expenses"] });

      const previous = queryClient.getQueryData(["expenses"]);

      // Optimistic update
      queryClient.setQueryData(["expenses"], (oldData: Expense[]) => {
        return oldData ? [newExpense, ...oldData] : [newExpense];
      });

      return { previous };
    },

    onError: (_err, _newExpense, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["expenses"], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  // ---------------- UPDATE ----------------
  const update = useMutation({
    mutationFn: updateExpense,

    onMutate: async (updatedExpense: Expense) => {
      await queryClient.cancelQueries({ queryKey: ["expenses"] });

      const previous = queryClient.getQueryData(["expenses"]);

      queryClient.setQueryData(["expenses"], (oldData: Expense[]) => {
        if (!oldData) return oldData;

        return oldData.map((e: Expense) =>
          e.id === updatedExpense.id ? updatedExpense : e,
        );
      });

      return { previous };
    },

    onError: (_err, _updatedExpense, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["expenses"], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  const remove = useMutation({
    mutationFn: deleteExpense,

    onMutate: async (deletedId: string) => {
      await queryClient.cancelQueries({ queryKey: ["expenses"] });

      const previous = queryClient.getQueryData(["expenses"]);

      queryClient.setQueryData(["expenses"], (oldData: Expense[]) =>
        oldData ? oldData.filter((e: Expense) => e.id !== deletedId) : [],
      );

      return { previous };
    },

    onError: (_err, _deletedId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["expenses"], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  return { add, update, remove };
};
