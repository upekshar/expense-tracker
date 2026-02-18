// src/redux/slices/expenseSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Expense } from "../../types/Expense";

// ------------------ OFFLINE ACTION TYPE ------------------
export type OfflineAction =
  | { type: "add"; payload: Expense }
  | { type: "update"; payload: Expense }
  | { type: "delete"; payload: string };

// ------------------ SLICE STATE ------------------
interface ExpenseState {
  offlineQueue: OfflineAction[];
}

// ✅ Safe localStorage load
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
    localStorage.setItem(
      "pending_offline_actions",
      JSON.stringify(queue)
    );
  } catch {
    // ignore localStorage write errors
  }
};

const initialState: ExpenseState = {
  offlineQueue: loadQueue(),
};

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    // ---------------- ADD ----------------
    queueAdd: (state, action: PayloadAction<Expense>) => {
      const expense = action.payload;

      // If delete existed for this id — remove it
      state.offlineQueue = state.offlineQueue.filter(
        (a) => !(a.type === "delete" && a.payload === expense.id)
      );

      // If update existed for this id — remove it
      state.offlineQueue = state.offlineQueue.filter(
        (a) => !(a.type === "update" && a.payload.id === expense.id)
      );

      // Push new add
      state.offlineQueue.push({ type: "add", payload: expense });
      saveQueue(state.offlineQueue);
    },

    // ---------------- UPDATE ----------------
    queueUpdate: (state, action: PayloadAction<Expense>) => {
      const updated = action.payload;

      // If already added offline → just update that add payload
      const existingAdd = state.offlineQueue.find(
        (a) => a.type === "add" && a.payload.id === updated.id
      );

      if (existingAdd) {
        existingAdd.payload = updated;
      } else {
        // Remove any existing update to avoid duplicates
        state.offlineQueue = state.offlineQueue.filter(
          (a) => !(a.type === "update" && a.payload.id === updated.id)
        );

        // If a delete exists for this id — ignore update, as delete takes priority
        const hasDelete = state.offlineQueue.some(
          (a) => a.type === "delete" && a.payload === updated.id
        );

        if (!hasDelete) {
          state.offlineQueue.push({ type: "update", payload: updated });
        }
      }

      saveQueue(state.offlineQueue);
    },

    // ---------------- DELETE ----------------
    queueDelete: (state, action: PayloadAction<string>) => {
      const id = action.payload;

      // If it was *added offline* and not yet synced → remove that add
      state.offlineQueue = state.offlineQueue.filter(
        (a) => !(a.type === "add" && a.payload.id === id)
      );

      // If update existed for this id → remove it
      state.offlineQueue = state.offlineQueue.filter(
        (a) => !(a.type === "update" && a.payload.id === id)
      );

      // Only add delete once (avoid duplicates)
      const alreadyDeleted = state.offlineQueue.some(
        (a) => a.type === "delete" && a.payload === id
      );

      if (!alreadyDeleted) {
        state.offlineQueue.push({ type: "delete", payload: id });
      }

      saveQueue(state.offlineQueue);
    },

    // ---------------- CLEAR ----------------
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
