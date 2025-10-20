"use client";
import { useEffect, useState } from "react";
import { Users } from "@/types/UsersDTO";
import { Reports } from "@/types/ReportsDTO";
import { getUsers } from "@/network/UserApi";
import { getReports, updateReportStatus } from "@/network/ReportApi";
import UsersTable from "../components/UsersTable";
import ReportsTable from "../components/ReportsTable";

const APPROVED_ID = 2;
const REJECTED_ID = 3;

export default function SeguimientoPage() {
  const [users, setUsers] = useState<Users[]>([]);
  const [reports, setReports] = useState<Reports[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function fetchAll() {
    setLoading(true);
    setErr(null);
    try {
      const [u, r] = await Promise.all([getUsers(), getReports()]);
      setUsers(u);
      setReports(r);
    } catch (e: any) {
      setErr(e?.message ?? "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  async function handleUpdateReportStatus(reportId: number, statusId: number) {
    try {
      await updateReportStatus(reportId, statusId);
      setReports(prev =>
        prev.map(r =>
          r.id === reportId
            ? { ...r, status_name: statusId === APPROVED_ID ? "Aprobado" : "Rechazado" }
            : r
        )
      );
    } catch (e: any) {
      alert(e?.message ?? "Error al actualizar el reporte");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Seguimiento</h1>
      {loading && <p>Cargando...</p>}
      {err && <p className="text-red-600">{err}</p>}

      {!loading && !err && (
        <>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Usuarios</h2>
            <UsersTable users={users} />
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Reportes</h2>
            <ReportsTable
              reports={reports}
              onApprove={(id) => handleUpdateReportStatus(id, APPROVED_ID)}
              onReject={(id) => handleUpdateReportStatus(id, REJECTED_ID)}
              showActions
            />
          </section>
        </>
      )}
    </div>
  );
}
