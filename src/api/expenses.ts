import type { Expense } from "../types/Expense";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/expenses`;



// Fetch expenses with pagination
export const fetchExpenses = async (
  page: number,
  limit: number,
  category: string,
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (category !== "All") {
    params.append("category", category);
  }

  const response = await fetch(`${API_URL}?${params}`);

  if (!response.ok) throw new Error("Network error");

  const data = await response.json();

  // ✅ Save locally
  localStorage.setItem("expenses_cache", JSON.stringify(data));

  return { data };
};

// Add expense
export const addExpense = async (expense: Expense) => {
  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(expense),
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Add failed");
  return await response.json();
};



// Update expense
export const updateExpense = async (expense: Expense) => {
  const res = await fetch(`${API_URL}/${expense.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
  return res.json();
};

// Delete expense
export const deleteExpense = async (id: string) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return res.json();
};
