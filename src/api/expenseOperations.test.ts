import { describe, it, expect, beforeEach, vi } from "vitest";
import {
fetchExpenses,
addExpense,
updateExpense,
deleteExpense,
} from "./expenseOperations";
import { Expense } from "../types/Expense";

// Mock fetch
global.fetch = vi.fn();

describe("expenseOperations", () => {
beforeEach(() => {
  vi.clearAllMocks();
});

describe("fetchExpenses", () => {
  it("should fetch expenses successfully", async () => {
    const mockData = [
      { id: "1", name: "Lunch", amount: 15 },
      { id: "2", name: "Gas", amount: 50 },
    ];
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchExpenses();
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/expenses")
    );
  });

  it("should throw error when fetch fails", async () => {
    (global.fetch as any).mockResolvedValueOnce({ ok: false });
    await expect(fetchExpenses()).rejects.toThrow(
      "Failed to fetch expenses"
    );
  });
});

describe("addExpense", () => {
  it("should add expense successfully", async () => {
    const newExpense: Expense = {
      id: "3", title: "Coffee", amount: 5,
      date: "",
      category: ""
    };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => newExpense,
    });

    const result = await addExpense(newExpense);
    expect(result).toEqual(newExpense);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/expenses"),
      expect.objectContaining({ method: "POST" })
    );
  });

  it("should throw error when adding expense fails", async () => {
    const expense: Expense = { id: "3", title: "Coffee", amount: 5, date: "", category: "" };
    (global.fetch as any).mockResolvedValueOnce({ ok: false });
    await expect(addExpense(expense)).rejects.toThrow("Add failed");
  });
});

describe("updateExpense", () => {
  it("should update expense successfully", async () => {
    const updatedExpense: Expense = { id: "1", title: "Lunch", amount: 20, date: "", category: "" };
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => updatedExpense,
    });

    const result = await updateExpense(updatedExpense);
    expect(result).toEqual(updatedExpense);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/expenses/1"),
      expect.objectContaining({ method: "PUT" })
    );
  });
});

describe("deleteExpense", () => {
  it("should delete expense successfully", async () => {
    const mockResponse = { success: true };
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockResponse,
    });

    const result = await deleteExpense("1");
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/expenses/1"),
      expect.objectContaining({ method: "DELETE" })
    );
  });
});
});