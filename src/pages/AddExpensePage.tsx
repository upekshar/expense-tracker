import { useForm, SubmitHandler } from "react-hook-form";
import { useExpenseMutations } from "../api/mutations/useExpenseMutations";
import type { Expense } from "../types/Expense";
import toast from "react-hot-toast";

const categories = ["Food", "Travel", "Shopping"];

interface FormValues {
  title: string;
  amount: number;
  date: string;
  category: string;
  notes?: string;
}

export default function AddExpensePage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const { add } = useExpenseMutations();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      ...data,
    };

    add.mutate(newExpense, {
      onSuccess: () => {
        toast.success("Expense added successfully");
        reset();
      },
      onError: () => {
        toast.error("Failed to add expense");
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <fieldset disabled={add.isPending} className="flex flex-col gap-3">
          {/* TITLE */}
          <div>
            <input
              {...register("title", {
                required: "Title is required",
                minLength: { value: 3, message: "Minimum 3 characters" },
              })}
              placeholder="Title"
              className="p-2 border rounded w-full"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* AMOUNT */}
          <div>
            <input
              type="number"
              step="0.01"
              {...register("amount", {
                required: "Amount is required",
                valueAsNumber: true,
                min: { value: 0.01, message: "Amount must be positive" },
              })}
              placeholder="Amount"
              className="p-2 border rounded w-full"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount.message}</p>
            )}
          </div>

          {/* DATE */}
          <div>
            <input
              type="date"
              {...register("date", {
                required: "Date is required",
                validate: (value) => {
                  const selected = new Date(value);
                  const now = new Date();
                  return (
                    selected <= now || "Date cannot be in the future"
                  );
                },
              })}
              className="p-2 border rounded w-full"
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date.message}</p>
            )}
          </div>

          {/* CATEGORY */}
          <div>
            <select
              {...register("category", {
                required: "Category is required",
              })}
              className="p-2 border rounded w-full"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          {/* NOTES */}
          <div>
            <textarea
              {...register("notes", {
                maxLength: {
                  value: 200,
                  message: "Notes can be max 200 characters",
                },
              })}
              placeholder="Notes (optional)"
              className="p-2 border rounded w-full"
            />
            {errors.notes && (
              <p className="text-red-500 text-sm">{errors.notes.message}</p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {add.isPending && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {add.isPending ? "Adding..." : "Add Expense"}
          </button>
        </fieldset>
      </form>
    </div>
  );
}
