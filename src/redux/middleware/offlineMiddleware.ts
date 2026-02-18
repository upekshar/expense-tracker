import { Middleware } from "@reduxjs/toolkit";
import { setSyncing, setSyncDone } from "../slices/syncSlice";
import { clearQueue, OfflineAction } from "../slices/expenseSlice";
import { queryClient } from "../../api/queryClient";
import { Expense } from "../../types/Expense";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/expenses`;

export const createOfflineMiddleware =
  (): Middleware => (store) => (next) => async (action: any) => {
    const result = next(action);

    if (typeof action === "object" && action.type === "sync/triggerSync") {
      const state = store.getState() as {
        expenses: { offlineQueue: OfflineAction[] };
      };
      const queue = state.expenses.offlineQueue;

      if (!navigator.onLine || queue.length === 0) {
        return result;
      }

      // Start syncing
      store.dispatch(setSyncing());

      let success = true;

      for (const offlineAction of queue) {
        try {
          if (offlineAction.type === "add") {
            await fetch(API_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify(offlineAction.payload as Expense),
            });
          }

          if (offlineAction.type === "update") {
            const updatedExpense = offlineAction.payload as Expense;
            await fetch(`${API_URL}/${updatedExpense.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify(updatedExpense),
            });
          }

          if (offlineAction.type === "delete") {
            const id = offlineAction.payload as string;
            await fetch(`${API_URL}/${id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            });
          }
        } catch (err) {
          console.error("Offline sync error:", offlineAction, err);
          success = false;
          break;
        }
      }

      if (success) {
        store.dispatch(clearQueue());
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
      }

      store.dispatch(setSyncDone());
    }

    return result;
  };

export default createOfflineMiddleware;
