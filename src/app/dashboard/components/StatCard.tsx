export default function StatCard({
  title,
  value,
  sub,
}: { title: string; value: number | string; sub?: string }) {
  return (
    <div className="card">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-semibold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}
