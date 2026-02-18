interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl shadow-md text-white ${color || "bg-gray-800"}`}
    >
      <div>
        <h3 className="text-sm">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div>{icon}</div>
    </div>
  );
}
