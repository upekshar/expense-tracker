import { useForm, SubmitHandler } from "react-hook-form";
import type { Expense } from "../types/Expense";

/**
 * Reusable form component for both adding and editing expenses.
 * - Accepts default values for editing.
 * - Validates inputs with react-hook-form.
 * - Shows loading state and error messages.
 * - Optional cancel button for edit mode.
 * Note: For simplicity, category options are hardcoded here, but they could be fetched from an API or defined in a constants file.
 */
const categories = ["Food", "Travel", "Shopping"];

export interface ExpenseFormProps {
  defaultValues?: Partial<Expense>;
  onSubmit: (data: Omit<Expense, "id">) => void;
  isLoading?: boolean;
  submitLabel?: string;
  onCancel?: () => void; // ← optional cancel callback
}

export default function ExpenseForm({
  defaultValues = {},
  onSubmit,
  isLoading = false,
  submitLabel = "Submit",
  onCancel,
}: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<Expense, "id">>({
    defaultValues,
  });

  const handleFormSubmit: SubmitHandler<Omit<Expense, "id">> = (data) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-3 w-full min-w-0"
    >
      {/* TITLE */}
      <div>
        <input
          {...register("title", {
            required: "Title is required",
            minLength: { value: 3, message: "Minimum 3 characters" },
          })}
          placeholder="Title"
          className="p-2 border rounded w-full min-w-0"
        />
        {errors.title && (
          <p className="text-red-500 text-xs sm:text-sm">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* AMOUNT */}
      <div>
        <input
          type="number"
          step="0.01"
          min="0.01"
          {...register("amount", {
            required: "Amount is required",
            valueAsNumber: true,
            min: { value: 0.01, message: "Amount must be greater than 0" },
          })}
          placeholder="Amount"
          className="p-2 border rounded w-full min-w-0"
        />
        {errors.amount && (
          <p className="text-red-500 text-xs sm:text-sm">
            {errors.amount.message}
          </p>
        )}
      </div>

      {/* DATE */}
      <div>
        <input
          type="date"
          {...register("date", {
            required: "Date is required",
            validate: (v) =>
              new Date(v) <= new Date() || "Date cannot be in the future",
          })}
          className="p-2 border rounded w-full min-w-0"
        />
        {errors.date && (
          <p className="text-red-500 text-xs sm:text-sm">
            {errors.date.message}
          </p>
        )}
      </div>

      {/* CATEGORY */}
      <div>
        <select
          {...register("category", { required: "Category is required" })}
          className="p-2 border rounded w-full min-w-0"
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-xs sm:text-sm">
            {errors.category.message}
          </p>
        )}
      </div>

      {/* NOTES */}
      <div>
        <textarea
          {...register("notes", {
            maxLength: { value: 200, message: "Notes max 200 characters" },
          })}
          placeholder="Notes (optional)"
          className="p-2 border rounded w-full min-w-0"
          rows={3}
        />
        {errors.notes && (
          <p className="text-red-500 text-xs sm:text-sm">
            {errors.notes.message}
          </p>
        )}
      </div>

      {/* BUTTONS */}
      <div className="flex gap-2 items-center">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {submitLabel}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
