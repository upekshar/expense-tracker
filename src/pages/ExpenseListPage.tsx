import { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { useExpenses } from "../api/queries/useExpenses";
import { useExpenseMutations } from "../api/mutations/useExpenseMutations";
import { Expense } from "../types/Expense";
import toast from "react-hot-toast";
import { ConfirmModal } from "../components/ConfirmModal";
import { useDispatch, useSelector } from "react-redux";
import {
  queueUpdate,
  queueDelete,
  OfflineAction,
} from "../redux/slices/expenseSlice";
import { RootState } from "../redux/store";
import ExpenseForm from "../components/ExpenseForm";

const categories = ["All", "Food", "Travel", "Shopping"];
const sortOptions = [
  { label: "Date Desc", value: "date_desc" },
  { label: "Date Asc", value: "date_asc" },
  { label: "Amount Desc", value: "amount_desc" },
  { label: "Amount Asc", value: "amount_asc" },
];

export default function ExpenseListPage() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOption, setSortOption] = useState("date_desc");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data: allExpenses = [], isLoading } = useExpenses();
  const { update, remove } = useExpenseMutations();

  const offlineQueue = useSelector(
    (state: RootState) => state.expenses.offlineQueue,
  ) as OfflineAction[];

  /**
   * The merging logic is as follows:
   * 1. Start with the server data (already filtered/sorted).
   * 2. Create maps/sets from the offline queue for quick lookup of updates and deletes.
   */
  const filteredServer = allExpenses.filter((exp: Expense) =>
    categoryFilter === "All" ? true : exp.category === categoryFilter,
  );

  const sortedServer = filteredServer.sort((a: Expense, b: Expense) => {
    switch (sortOption) {
      case "date_asc":
        return +new Date(a.date) - +new Date(b.date);
      case "date_desc":
        return +new Date(b.date) - +new Date(a.date);
      case "amount_asc":
        return a.amount - b.amount;
      case "amount_desc":
        return b.amount - a.amount;
      default:
        return 0;
    }
  });

  /**
   * Merge logic to combine server data with offline changes:
   * - Start with the server data (already filtered/sorted).
   * - Create maps/sets from the offline queue for quick lookup of updates and deletes.
   */
  const offlineUpdateMap = new Map<string, Expense>();
  const offlineDeleteSet = new Set<string>();
  const offlineAdds: Expense[] = [];

  offlineQueue.forEach((action) => {
    if (action.type === "add") offlineAdds.push(action.payload as Expense);
    if (action.type === "update")
      offlineUpdateMap.set(
        (action.payload as Expense).id,
        action.payload as Expense,
      );
    if (action.type === "delete")
      offlineDeleteSet.add(action.payload as string);
  });

  const mergedList = [
    ...offlineAdds,
    ...sortedServer
      .filter((exp: Expense) => !offlineDeleteSet.has(exp.id))
      .map((exp: Expense) => offlineUpdateMap.get(exp.id) ?? exp),
  ];

  const uniqueList: Expense[] = Array.from(
    new Map(mergedList.map((e) => [e.id, e])).values(),
  );

  /**
   * Pagination is applied after merging to ensure that users see the most relevant data first,
   * including their offline changes. The "Load More" button allows them to fetch additional merged results
   * without losing the context of their recent edits or additions.
   */
  const displayedExpenses = uniqueList.slice(0, page * limit);
  const hasMore = uniqueList.length > displayedExpenses.length;

  const isInitialLoading = isLoading && displayedExpenses.length === 0;

  /**
   *
   * @param id
   * @returns
   */
  const handleDelete = (id: string) => {
    if (!navigator.onLine) {
      dispatch(queueDelete(id));
      toast.success("Deleted locally (offline)");

      queryClient.setQueryData(["expenses"], (old: any) =>
        (old ?? []).filter((e: any) => e.id !== id),
      );

      setDeleteId(null);
      return;
    }

    remove.mutate(id, {
      onSuccess: () => {
        toast.success("Expense deleted");
        setDeleteId(null);
      },
      onError: () => toast.error("Failed to delete"),
    });
  };

  /**
   *
   * @param data
   * @param id
   * @returns
   */
  const handleEditSubmit = (data: Omit<Expense, "id">, id: string) => {
    const updatedExpense = { id, ...data } as Expense;

    if (!navigator.onLine) {
      dispatch(queueUpdate(updatedExpense));
      toast.success("Updated locally (offline)");

      queryClient.setQueryData(["expenses"], (old: any) =>
        (old ?? []).map((e: any) => (e.id === id ? updatedExpense : e)),
      );

      setEditingId(null);
      return;
    }

    update.mutate(updatedExpense, {
      onSuccess: () => toast.success("Expense updated"),
      onError: () => toast.error("Failed to update"),
    });

    setEditingId(null);
  };

  return (
    <div className="space-y-4 min-w-0">
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center mb-2">
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="border rounded p-1 w-full sm:w-auto"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={sortOption}
          onChange={(e) => {
            setSortOption(e.target.value);
            setPage(1);
          }}
          className="border rounded p-1 w-full sm:w-auto"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {isInitialLoading && (
        <p className="text-center text-gray-500">Loading...</p>
      )}

      {!isInitialLoading && displayedExpenses.length === 0 && (
        <p className="text-center text-gray-500">No expenses found</p>
      )}

      {displayedExpenses.map((exp: Expense) => {
        const isOffline = offlineQueue.some(
          (o) =>
            (o.type === "add" || o.type === "update") &&
            (o.payload as Expense).id === exp.id,
        );

        return (
          <div
            key={exp.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition min-w-0"
          >
            <div className="flex flex-col gap-1 w-full sm:w-2/3 min-w-0">
              {editingId === exp.id ? (
                <ExpenseForm
                  defaultValues={exp}
                  onSubmit={(data) => handleEditSubmit(data, exp.id)}
                  isLoading={update.isPending}
                  submitLabel="Save"
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <span className="font-semibold text-lg truncate">
                    {exp.title}
                    {isOffline && (
                      <span className="ml-2 text-xs text-yellow-600">
                        (Offline)
                      </span>
                    )}
                  </span>
                  <span className="text-gray-500 text-sm truncate">
                    {exp.category} • {exp.date}
                  </span>
                  <span className="font-medium text-gray-800 truncate">
                    ${exp.amount}
                  </span>
                </>
              )}
            </div>

            {editingId !== exp.id && (
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => setEditingId(exp.id)}
                  className="p-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDeleteId(exp.id)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        );
      })}

      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setPage((p: number) => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Load More
          </button>
        </div>
      )}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Expense"
        message="Are you sure?"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={remove.isPending}
        onConfirm={() => handleDelete(deleteId!)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
