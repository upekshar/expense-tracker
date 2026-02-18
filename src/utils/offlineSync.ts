const API_URL = "https://699355fffade7a9ec0f274ea.mockapi.io/api/v1/expense";

export const syncOfflineExpenses = async () => {
  const pending = JSON.parse(
    localStorage.getItem("pending_expenses") || "[]"
  );

  if (pending.length === 0) return;

  for (const expense of pending) {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    });
  }

  localStorage.removeItem("pending_expenses");
};
