export default function MiniBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(1, ...data.map(d => d.value));

  return (
    <div className="card">
      <p className="text-sm text-gray-500 mb-3">Resumen de reportes</p>

      <div className="flex items-end gap-4 h-40">
        {data.map((d) => {
          const pct = (d.value / max) * 100;
          const barHeight = d.value === 0 ? 6 : Math.max(10, pct); // mínimo visual
          return (
            <div key={d.label} className="flex-1 flex flex-col items-center">
              <div
                className="w-full rounded-t-md"
                style={{ height: `${barHeight}%`, backgroundColor: "var(--color-primary)" }}
                title={`${d.label}: ${d.value}`}
              />
              <span className="mt-2 text-xs text-gray-600">{d.label}</span>
              <span className="text-xs text-gray-900 font-medium">{d.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
