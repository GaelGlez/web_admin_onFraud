"use client";
import { Reports } from "@/types/ReportsDTO";

type Props = {
  reports: Reports[];
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  showActions?: boolean;
  title?: string;
};

export default function ReportsTable({
  reports,
  onApprove,
  onReject,
  showActions = true,
  title = "Reportes",
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Título</th>
            <th>URL</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Estado</th>
            {showActions && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id}>
              <td>{r.user_name || "Anónimo"}</td>
              <td>{r.title}</td>
              <td>
                <a className="underline" href={r.url} target="_blank" rel="noreferrer">enlace</a>
              </td>
              <td>{r.description}</td>
              <td>{r.category_name ?? "—"}</td>
              <td>{r.status_name ?? "—"}</td>
              {showActions && (
                <td>
                  <div className="flex gap-2">
                    <button className="primary" onClick={() => onApprove?.(r.id)}>Aprobar</button>
                    <button className="secondary" onClick={() => onReject?.(r.id)}>Rechazar</button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
