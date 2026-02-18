

import { CurrencyDollarIcon, CakeIcon, TruckIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import AddExpensePage from "./AddExpensePage";
import ExpenseListPage from "./ExpenseListPage";
import StatCard from "../components/StatCard";
import Header from "../components/Header";

export default function Dashboard() {
  
  return (
    <div className="flex flex-col gap-6">
      <Header />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Expenses" value="$560" icon={<CurrencyDollarIcon className="w-8 h-8 text-white" />} color="bg-cyan-500"/>
        <StatCard title="Food" value="$120" icon={<CakeIcon className="w-8 h-8 text-white" />} color="bg-green-500"/>
        <StatCard title="Travel" value="$80" icon={<TruckIcon className="w-8 h-8 text-white" />} color="bg-yellow-500"/>
        <StatCard title="Shopping" value="$150" icon={<ShoppingBagIcon className="w-8 h-8 text-white" />} color="bg-purple-500"/>
      </div>

      {/* Add & List Sections as Separate Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <AddExpensePage />
        <ExpenseListPage />
      </div>
    </div>
  );
}
