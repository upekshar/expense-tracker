import { useState } from "react";
import { useDispatch } from "react-redux";
import { useExpenseMutations } from "../api/mutations/useExpenseMutations";
import { queueAdd } from "../redux/slices/expenseSlice";
import ExpenseForm from "../components/ExpenseForm";
import type { Expense } from "../types/Expense";
import toast from "react-hot-toast";

export default function AddExpensePage() {
  const { add } = useExpenseMutations();
  const dispatch = useDispatch();
  const [formKey, setFormKey] = useState(0);

  const handleAdd = (data: Omit<Expense, "id">) => {
    const newExpense: Expense = { id: Date.now().toString(), ...data };

    if (!navigator.onLine) {
      dispatch(queueAdd(newExpense));
      toast.success("Expense added locally (offline)");
      setFormKey((k) => k + 1);
      return;
    }

    add.mutate(newExpense, {
      onSuccess: () => {
        toast.success("Expense added successfully");
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
