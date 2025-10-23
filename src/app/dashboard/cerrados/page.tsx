"use client";
import { useEffect, useMemo, useState } from "react";
import { Reports } from "@/types/ReportsDTO";
import { getReports } from "@/network/ReportApi";

/* ========= Tabla simple local ========= */
const ReportsTable = ({
  reports,
  showActions = true,
  title,
}: {
  reports: Reports[];
  showActions?: boolean;
  title?: string;
}) => {
  return (
    <div>
      {title && <h2 className="text-xl font-semibold">{title}</h2>}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="px-2 py-1">ID</th>
              <th className="px-2 py-1">Título</th>
              <th className="px-2 py-1">Estado</th>
              {showActions && <th className="px-2 py-1">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td className="px-2 py-1">{r.id}</td>
                <td className="px-2 py-1">{r.title ?? "—"}</td>
                <td className="px-2 py-1">
                  {r.status_name ??
                    (r as any)?.status?.name ??
                    (r as any)?.status_id ??
                    "—"}
                </td>
                {showActions && <td className="px-2 py-1">{/* action buttons */}</td>}
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={showActions ? 4 : 3} className="px-2 py-3 text-gray-500">
                  No hay reportes cerrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ========= Lógica de “cerrado” ========= */
/** Ajusta estos IDs si tu backend usa otros para aprobado/rechazado/cerrado */
const APPROVED_ID = 2;
const REJECTED_ID = 3;

/** Acepta varios nombres que podrían significar “cerrado” */
const CLOSED_NAMES = ["aprobado", "rechazado", "cerrado", "finalizado"];

/** Detecta si un reporte está cerrado por id o por nombre (case-insensitive). */
function isClosed(r: Reports): boolean {
  const statusId =
    (r as any)?.status?.id ??
    (r as any)?.status_id ??
    undefined;

  if (statusId === APPROVED_ID || statusId === REJECTED_ID) return true;

  const nameRaw =
    (r as any)?.status?.name ??
    (r as any)?.status_name ??
    "";

  const name = String(nameRaw).trim().toLowerCase();
  return CLOSED_NAMES.includes(name);
}

/* ========= Página ========= */
export default function CerradosPage() {
  const [reports, setReports] = useState<Reports[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const r = await getReports();
        setReports(r ?? []);
      } catch (e: any) {
        setErr(e?.message ?? "Error al cargar reportes");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const closed = useMemo(() => reports.filter(isClosed), [reports]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reportes cerrados</h1>
      {loading && <p>Cargando...</p>}
      {err && <p className="text-red-600">{err}</p>}
      {!loading && !err && (
        <ReportsTable reports={closed} showActions={false} title="Cerrados" />
      )}
    </div>
  );
}
