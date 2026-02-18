const expenses = [
  { title: "Lunch", amount: 12, date: "2026-02-16", category: "Food" },
  { title: "Uber", amount: 20, date: "2026-02-15", category: "Travel" },
  { title: "Shoes", amount: 60, date: "2026-02-14", category: "Shopping" },
  { title: "Coffee", amount: 5, date: "2026-02-13", category: "Food" },
];

export default function ExpenseTable() {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Title</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Amount</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Category</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {expenses.map((exp, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-4 py-2">{exp.title}</td>
              <td className="px-4 py-2">${exp.amount}</td>
              <td className="px-4 py-2">{exp.date}</td>
              <td className="px-4 py-2">{exp.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
