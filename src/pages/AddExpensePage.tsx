import { useState } from "react";
import { useExpenseMutations } from "../api/mutations/useExpenseMutations";
import ExpenseForm from "../components/ExpenseForm";
import type { Expense } from "../types/Expense";
import toast from "react-hot-toast";

export default function AddExpensePage() {
  const { add } = useExpenseMutations();
  const [formKey, setFormKey] = useState(0);

  const handleAdd = (data: Omit<Expense, "id">) => {
    const newExpense: Expense = { id: Date.now().toString(), ...data };

    add.mutate(newExpense, {
      onSuccess: () => {
        toast.success("Expense added successfully");

        // bump key to remount form - resetting it to default values
        setFormKey((k) => k + 1);
      },
      onError: () => toast.error("Failed to add expense"),
    });
  };

  return (
    <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md w-full max-w-full sm:max-w-md mx-auto min-w-0">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">
        Add New Expense
      </h2>

      <ExpenseForm
        key={formKey}
        onSubmit={handleAdd}
        isLoading={add.isPending}
        submitLabel="Add Expense"
        onCancel={() => setFormKey((k) => k + 1)}
      />
    </div>
  );
}
