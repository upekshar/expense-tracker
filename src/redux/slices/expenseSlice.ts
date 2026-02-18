import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Expense } from "../../types/Expense";

export type OfflineAction =
  | { type: "add"; payload: Expense }
  | { type: "update"; payload: Expense }
  | { type: "delete"; payload: string };

interface ExpenseState {
  offlineQueue: OfflineAction[];
}

const loadQueue = (): OfflineAction[] => {
  try {
    const stored = localStorage.getItem("pending_offline_actions");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveQueue = (queue: OfflineAction[]) => {
  try {
    localStorage.setItem("pending_offline_actions", JSON.stringify(queue));
  } catch {
    // Ignore write errors (e.g. quota exceeded)
  }
};

const initialState: ExpenseState = {
  offlineQueue: loadQueue(),
};

/**
 *
 * The expenseSlice is responsible for managing the queue of offline actions (add/update/delete) that need to be synced
 *  with the server once connectivity is restored. It provides reducers to add actions to the queue and clear it after
 * successful sync.
 */

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    queueAdd: (state, action: PayloadAction<Expense>) => {
      const expense = action.payload;
      state.offlineQueue = state.offlineQueue.filter(
        (a) => !(a.type === "delete" && a.payload === expense.id),
      );
      state.offlineQueue = state.offlineQueue.filter(
        (a) => !(a.type === "update" && a.payload.id === expense.id),
      );
      state.offlineQueue.push({ type: "add", payload: expense });
      saveQueue(state.offlineQueue);
    },

    queueUpdate: (state, action: PayloadAction<Expense>) => {
      const updated = action.payload;
      const existingAdd = state.offlineQueue.find(
        (a) => a.type === "add" && a.payload.id === updated.id,
      );

      if (existingAdd) {
        existingAdd.payload = updated;
      } else {
        state.offlineQueue = state.offlineQueue.filter(
          (a) => !(a.type === "update" && a.payload.id === updated.id),
        );
        const hasDelete = state.offlineQueue.some(
          (a) => a.type === "delete" && a.payload === updated.id,
        );

        if (!hasDelete) {
          state.offlineQueue.push({ type: "update", payload: updated });
        }
      }

      saveQueue(state.offlineQueue);
    },

    queueDelete: (state, action: PayloadAction<string>) => {
      const id = action.payload;

      state.offlineQueue = state.offlineQueue.filter(
        (a) => !(a.type === "add" && a.payload.id === id),
      );

      state.offlineQueue = state.offlineQueue.filter(
        (a) => !(a.type === "update" && a.payload.id === id),
      );

      const alreadyDeleted = state.offlineQueue.some(
        (a) => a.type === "delete" && a.payload === id,
      );

      if (!alreadyDeleted) {
        state.offlineQueue.push({ type: "delete", payload: id });
      }

      saveQueue(state.offlineQueue);
    },

    clearQueue: (state) => {
      state.offlineQueue = [];
      try {
        localStorage.removeItem("pending_offline_actions");
      } catch {}
    },
  },
});

export const selectOfflineQueue = (state: { expenses: ExpenseState }) =>
  state.expenses.offlineQueue;

export const { queueAdd, queueUpdate, queueDelete, clearQueue } =
  expenseSlice.actions;

export default expenseSlice.reducer;
