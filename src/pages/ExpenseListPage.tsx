import { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useExpenses } from "../api/queries/useExpenses";
import { useExpenseMutations } from "../api/mutations/useExpenseMutations";
import { Expense } from "../types/Expense";
import toast from "react-hot-toast";
import { ConfirmModal } from "../components/ConfirmModal";
import { useDispatch, useSelector } from "react-redux";
import { queueUpdate, queueDelete, OfflineAction } from "../redux/slices/expenseSlice";
import { RootState } from "../redux/store";
import { useQueryClient } from "@tanstack/react-query";

const categories = ["All", "Food", "Travel", "Shopping"];
const sortOptions = [
  { label: "Date Desc", value: "date_desc" },
  { label: "Date Asc", value: "date_asc" },
  { label: "Amount Desc", value: "amount_desc" },
  { label: "Amount Asc", value: "amount_asc" },
];

export default function ExpenseListPage() {
  const limit = 5;
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOption, setSortOption] = useState("date_desc");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Expense>>({});

  // Fetch server data
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useExpenses(limit, categoryFilter);

  const { update, remove } = useExpenseMutations();
  const offlineQueue = useSelector(
    (state: RootState) => state.expenses.offlineQueue
  ) as OfflineAction[];

  // --------------------------------------------
  // Build displayed expense list
  // --------------------------------------------

  // 1) Flatten server pages & cache
  const serverExpenses = data?.pages.flatMap((p) => p.data) ?? [];

  // 2) Apply filter to server list
  const filteredServer = serverExpenses.filter((exp) =>
    categoryFilter === "All" ? true : exp.category === categoryFilter
  );

  // 3) Sort server items
  const sortedServer = filteredServer.sort((a, b) => {
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

  // 4) Apply offline queue
  const offlineUpdateMap = new Map<string, Expense>();
  const offlineDeleteSet = new Set<string>();
  const offlineAddList: Expense[] = [];

  offlineQueue.forEach((action) => {
    if (action.type === "add") offlineAddList.push(action.payload as Expense);
    if (action.type === "update")
      offlineUpdateMap.set((action.payload as Expense).id, action.payload as Expense);
    if (action.type === "delete") offlineDeleteSet.add(action.payload as string);
  });

  // 5) Merge into final list
  const merged = [
    // offline adds always first
    ...offlineAddList,
    // server items, with offline updates applied & deletes removed
    ...sortedServer
      .filter((exp) => !offlineDeleteSet.has(exp.id))
      .map((exp) => offlineUpdateMap.get(exp.id) ?? exp),
  ];

  // Remove duplicates
  const seen = new Set<string>();
  const displayedExpenses: Expense[] = merged.filter((exp) => {
    if (seen.has(exp.id)) return false;
    seen.add(exp.id);
    return true;
  });

  const isInitialLoading = isLoading && !displayedExpenses.length;

  // --------------------------------------------
  // Handlers: Edit / Save / Delete
  // --------------------------------------------

  const startEditing = (exp: Expense) => {
    setEditingId(exp.id);
    setFormData(exp);
  };
  const cancelEditing = () => {
    setEditingId(null);
    setFormData({});
  };

  const saveEditing = () => {
    if (!editingId) return;

    const updatedExpense = { id: editingId, ...formData } as Expense;

    if (!navigator.onLine) {
      dispatch(queueUpdate(updatedExpense));
      toast.success("Updated locally (offline)");

      queryClient.setQueryData(["expenses"], (oldData: any) => {
        if (!oldData) return oldData;
        const updatedPages = oldData.pages.map((page: any) => ({
          ...page,
          data: page.data.map((e: any) =>
            e.id === updatedExpense.id ? updatedExpense : e
          ),
        }));
        return { ...oldData, pages: updatedPages };
      });

      cancelEditing();
      return;
    }

    update.mutate(updatedExpense, {
      onSuccess: () => toast.success("Expense updated"),
      onError: () => toast.error("Failed to update"),
    });

    cancelEditing();
  };

  const handleDelete = () => {
    if (!deleteId) return;

    if (!navigator.onLine) {
      dispatch(queueDelete(deleteId));
      toast.success("Deleted locally (offline)");

      queryClient.setQueryData(["expenses"], (oldData: any) => {
        if (!oldData) return oldData;
        const updatedPages = oldData.pages.map((page: any) => ({
          ...page,
          data: page.data.filter((e: any) => e.id !== deleteId),
        }));
        return { ...oldData, pages: updatedPages };
      });

      setDeleteId(null);
      return;
    }

    remove.mutate(deleteId, {
      onSuccess: () => {
        toast.success("Expense deleted");
        setDeleteId(null);
      },
      onError: () => toast.error("Failed to delete"),
    });
  };

  // --------------------------------------------
  // UI
  // --------------------------------------------

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center mb-4">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border rounded p-1"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border rounded p-1"
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

      {/* No Items */}
      {!isInitialLoading && displayedExpenses.length === 0 && (
        <p className="text-center text-gray-500">No expenses found</p>
      )}

      {/* Expense List */}
      {displayedExpenses.map((exp) => {
        const isOffline = offlineQueue.some(
          (o) =>
            (o.type === "add" || o.type === "update") &&
            (o.payload as Expense).id === exp.id
        );

        return (
          <div
            key={exp.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <div className="flex flex-col gap-1 w-full sm:w-2/3">
              {editingId === exp.id ? (
                <>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, title: e.target.value }))
                    }
                    className="border rounded p-1 w-full"
                  />
                  <input
                    type="number"
                    value={formData.amount || 0}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, amount: Number(e.target.value) }))
                    }
                    className="border rounded p-1 w-full"
                  />
                  <input
                    type="date"
                    value={formData.date || ""}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, date: e.target.value }))
                    }
                    className="border rounded p-1 w-full"
                  />
                </>
              ) : (
                <>
                  <span className="font-semibold text-lg">
                    {exp.title}
                    {isOffline && (
                      <span className="ml-2 text-xs text-yellow-600">
                        (Offline)
                      </span>
                    )}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {exp.category} • {exp.date}
                  </span>
                  <span className="font-medium text-gray-800">
                    ${exp.amount}
                  </span>
                </>
              )}
            </div>

            <div className="flex gap-2 mt-2 sm:mt-0">
              {editingId === exp.id ? (
                <>
                  <button
                    onClick={saveEditing}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEditing(exp)}
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
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* Load More */}
   
      {hasNextPage && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Expense"
        message="Are you sure?"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={remove.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
