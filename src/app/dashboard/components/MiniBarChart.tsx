export default function MiniBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(1, ...data.map(d => d.value));
  return (
    <div className="card">
      <p className="text-sm text-gray-500 mb-3">Resumen de reportes</p>
      <div className="flex items-end gap-3 h-40">
        {data.map((d) => (
          <div key={d.label} className="flex-1 flex flex-col items-center">
            <div
              className="w-full rounded-t-md"
              style={{ height: `${(d.value / max) * 100}%`, backgroundColor: "var(--color-primary)" }}
              title={`${d.label}: ${d.value}`}
            />
            <span className="mt-2 text-xs text-gray-600">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
