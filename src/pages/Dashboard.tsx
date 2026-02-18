import {
  CurrencyDollarIcon,
  CakeIcon,
  TruckIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

import AddExpensePage from "./AddExpensePage";
import ExpenseListPage from "./ExpenseListPage";
import StatCard from "../components/StatCard";
import Header from "../components/Header";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <Header />

      {/* Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        <StatCard
          title="Total Expenses"
          value="$560"
          icon={
            <CurrencyDollarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          }
          color="bg-cyan-500"
        />
        <StatCard
          title="Food"
          value="$120"
          icon={<CakeIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Travel"
          value="$80"
          icon={<TruckIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Shopping"
          value="$150"
          icon={
            <ShoppingBagIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          }
          color="bg-purple-500"
        />
      </section>

      {/* Add + List Section */}
      <section className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="bg-white p-3 sm:p-5 rounded-2xl shadow hover:shadow-md transition w-full min-w-0">
          <AddExpensePage />
        </div>
        <div className="bg-white p-3 sm:p-5 rounded-2xl shadow hover:shadow-md transition w-full min-w-0">
          <ExpenseListPage />
        </div>
      </section>
    </div>
  );
}
