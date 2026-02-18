import { useState } from "react";
import {
  HomeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { name: "Dashboard", icon: <HomeIcon className="w-6 h-6" /> },
  { name: "Expenses", icon: <CurrencyDollarIcon className="w-6 h-6" /> },
  { name: "Reports", icon: <ChartBarIcon className="w-6 h-6" /> },
  { name: "Settings", icon: <Cog6ToothIcon className="w-6 h-6" /> },
];

export default function Sidebar({ onSelect }: { onSelect?: (page: string) => void }) {
  const [active, setActive] = useState("Dashboard");

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-6">Expense Tracker</h1>
      {navItems.map((item) => (
        <button
          key={item.name}
          onClick={() => {
            setActive(item.name);
            onSelect && onSelect(item.name);
          }}
          className={`flex items-center gap-3 p-3 rounded-lg mb-2 hover:bg-gray-700 ${
            active === item.name ? "bg-gray-700" : ""
          }`}
        >
          {item.icon}
          <span>{item.name}</span>
        </button>
      ))}
    </div>
  );
}
