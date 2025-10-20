"use client";
import { useEffect, useState, useMemo } from "react";
import { Reports } from "@/types/ReportsDTO";
import { getReports } from "@/network/ReportApi";

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
                <td className="px-2 py-1">{r.status_name ?? "—"}</td>
                {showActions && <td className="px-2 py-1">{/* action buttons */}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CLOSED_NAMES = ["Cerrado", "Closed", "Finalizado"];

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
        setReports(r);
      } catch (e: any) {
        setErr(e?.message ?? "Error al cargar reportes");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const closed = useMemo(
    () => reports.filter(r => CLOSED_NAMES.includes(r.status_name ?? "")),
    [reports]
  );

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
