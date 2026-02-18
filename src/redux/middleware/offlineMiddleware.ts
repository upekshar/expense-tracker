// src/redux/middleware/offlineMiddleware.ts
import { Middleware } from "@reduxjs/toolkit";
import { setSyncing } from "../slices/syncSlice";
import { clearQueue, OfflineAction } from "../slices/expenseSlice";
import { queryClient } from "../../api/queryClient";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/expenses`;

export const createOfflineMiddleware = (): Middleware => (store) => (next) => async (action) => {
  const result = next(action);

  if (action && typeof action === "object" && "type" in action) {
    const typedAction = action as { type: string };

    // Sync trigger
    if (typedAction.type === "sync/triggerSync") {
      const state: any = store.getState();
      const queue: OfflineAction[] = state.expenses.offlineQueue;

      // If offline or queue empty → nothing to sync
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
          "Accept": "application/json",
        },
        body: JSON.stringify(offlineAction.payload),
      });
    }

    if (offlineAction.type === "update") {
      await fetch(`${API_URL}/${offlineAction.payload.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(offlineAction.payload),
      });
    }

    if (offlineAction.type === "delete") {
      await fetch(`${API_URL}/${offlineAction.payload}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
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
        // Clear queue now that sync succeeded
        store.dispatch(clearQueue());

        // Update cache for server changes
        queryClient.setQueryData(["expenses"], (oldData: any) => {
          if (!oldData) return oldData;

          // Apply delete removals
          let updatedPages = oldData.pages;

          queue.forEach((offlineAction) => {
            if (offlineAction.type === "delete") {
              updatedPages = updatedPages.map((page: any) => ({
                ...page,
                data: page.data.filter((e: any) => e.id !== offlineAction.payload),
              }));
            }
          });

          return { ...oldData, pages: updatedPages };
        });

        // Trigger a fresh refetch so server state replaces local cache
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
      }

      store.dispatch(setSyncing());
    }
  }

  return result;
};

export default createOfflineMiddleware;
