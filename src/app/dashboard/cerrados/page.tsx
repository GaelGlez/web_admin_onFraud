import { Metadata } from "next";
import Link from "next/link";
import { Reports } from "@/types/ReportsDTO";
import { isClosed, nameById, norm } from "@/src/lib/reportStatus";

export const metadata: Metadata = {
  title: "Reportes cerrados",
  description: "Listado de reportes en estado cerrado (aprobado/rechazado/cerrado).",
};

// === Utilidades de esta página ===
async function fetchReports(): Promise<Reports[]> {
  // Intenta con variable de entorno; si no existe, usa una ruta local típica.
  const base = process.env.NEXT_PUBLIC_REPORTS_API ?? "/api/reports";
  const url = `${base}`;
  const res = await fetch(url, {
    // Revalidación en producción (App Router). Ajusta si usas SSR o ISR diferentes.
    next: { revalidate: 30 },
    // Si tu API necesita credenciales/cookies, añade: credentials: "include"
  });

  if (!res.ok) {
    throw new Error(`Error al obtener reportes: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as Reports[];
  return Array.isArray(data) ? data : [];
}

function StatusBadge({ r }: { r: Reports }) {
  const statusId = (r as any)?.status?.id ?? (r as any)?.status_id;
  const statusName = (r as any)?.status?.name ?? (r as any)?.status_name ?? "";
  const label = statusId != null ? nameById(statusId) : (norm(statusName) || "Cerrado");
  const pillColor =
    label.toLowerCase() === "aprobado"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : label.toLowerCase() === "rechazado"
      ? "bg-rose-100 text-rose-700 border-rose-200"
      : "bg-zinc-100 text-zinc-700 border-zinc-200";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${pillColor}`}>
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className="fill-current"><circle cx="5" cy="5" r="5"/></svg>
      {label}
    </span>
  );
}

function CellDate({ value }: { value?: string | Date | null }) {
  if (!value) return <span className="text-zinc-400">—</span>;
  const d = new Date(value);
  const short = d.toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });
  return <time dateTime={d.toISOString()}>{short}</time>;
}

export default async function ClosedReportsPage() {
  let reports: Reports[] = [];
  try {
    reports = await fetchReports();
  } catch (err: any) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Reportes cerrados</h1>
            <p className="text-sm text-zinc-500">No fue posible cargar los reportes. {String(err?.message ?? "")}</p>
          </div>
          <Link href="/reports" className="rounded-lg border px-3 py-2 text-sm hover:bg-zinc-50">← Volver</Link>
        </header>
      </main>
    );
  }

  const closed = reports.filter((r) => {
    try { return isClosed(r); } catch { return false; }
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reportes cerrados</h1>
          <p className="text-sm text-zinc-500">Se muestran aquellos con estado aprobado / rechazado / cerrado / finalizado.</p>
        </div>
        <Link href="/reports" className="rounded-lg border px-3 py-2 text-sm hover:bg-zinc-50">← Volver</Link>
      </header>

      {closed.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead className="bg-zinc-50">
              <tr>
                <Th>Folio</Th>
                <Th>Título</Th>
                <Th>Estado</Th>
                <Th>Creado</Th>
                <Th>Actualizado</Th>
                <Th className="text-right">Acciones</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {closed.map((r) => (
                <tr key={(r as any)?.id ?? `${(r as any)?.folio ?? Math.random()}`} className="hover:bg-zinc-50/60">
                  <Td className="font-mono text-xs text-zinc-700">{(r as any)?.folio ?? (r as any)?.id ?? "—"}</Td>
                  <Td>{(r as any)?.title ?? (r as any)?.titulo ?? "(sin título)"}</Td>
                  <Td><StatusBadge r={r} /></Td>
                  <Td><CellDate value={(r as any)?.createdAt ?? (r as any)?.created_at} /></Td>
                  <Td><CellDate value={(r as any)?.updatedAt ?? (r as any)?.updated_at} /></Td>
                  <Td className="text-right">
                    <Link href={`/reports/${(r as any)?.id ?? (r as any)?.folio ?? ""}`} className="rounded-md border px-2 py-1 text-xs hover:bg-zinc-50">Ver</Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

function EmptyState() {
  return (
    <div className="grid place-items-center rounded-xl border py-16 text-center">
      <div className="space-y-2">
        <p className="text-lg font-medium">No hay reportes cerrados</p>
        <p className="text-sm text-zinc-500">Cuando algún reporte sea aprobado, rechazado o cerrado, aparecerá aquí.</p>
      </div>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600 ${className}`}>{children}</th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 align-middle text-sm text-zinc-800 ${className}`}>{children}</td>
  );
}
