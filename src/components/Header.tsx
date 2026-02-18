export default function Header() {
  const isOnline = navigator.onLine;

  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${isOnline ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>
    </div>
  );
}
