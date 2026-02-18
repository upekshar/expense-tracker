import { Expense } from "../../../types/Expense";
import expenseReducer, {
  queueAdd,
  queueUpdate,
  queueDelete,
  clearQueue,
  OfflineAction,
} from "../expenseSlice";


describe("expenseSlice offline queue", () => {
  const mockExpense: Expense = {
    id: "1",
    title: "Test",
    amount: 10,
    date: "",
    category: "",
    notes: "",
  };

  it("queueAdd should add an action", () => {
    const state = expenseReducer(undefined, queueAdd(mockExpense));
    expect(state.offlineQueue).toEqual([
      { type: "add", payload: mockExpense },
    ]);
  });

  it("queueUpdate should update existing add", () => {
    const initialState = {
      offlineQueue: [
        { type: "add", payload: mockExpense } as OfflineAction,
      ],
    };

    const updated: Expense = { ...mockExpense, title: "Updated" };

    const state = expenseReducer(
      initialState,
      queueUpdate(updated)
    );

    expect(state.offlineQueue).toEqual([
      { type: "add", payload: updated },
    ]);
  });

  it("queueUpdate should add update when no existing add", () => {
    const initialState = {
      offlineQueue: [],
    };

    const updated: Expense = { ...mockExpense, title: "Updated" };

    const state = expenseReducer(
      initialState,
      queueUpdate(updated)
    );

    expect(state.offlineQueue).toEqual([
      { type: "update", payload: updated }
    ]);
  });

  it("queueDelete should remove add and update then add delete", () => {
    const initialState = {
      offlineQueue: [
        { type: "add", payload: mockExpense } as OfflineAction,
        { type: "update", payload: mockExpense } as OfflineAction,
      ],
    };

    const state = expenseReducer(initialState, queueDelete("1"));

    expect(state.offlineQueue).toEqual([
      { type: "delete", payload: "1" },
    ]);
  });

  it("clearQueue empties the queue", () => {
    const initialState = {
      offlineQueue: [
        { type: "add", payload: mockExpense } as OfflineAction,
      ],
    };

    const state = expenseReducer(initialState, clearQueue());
    expect(state.offlineQueue).toEqual([]);
  });
});
