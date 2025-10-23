"use client";
import { useEffect, useMemo, useState } from "react";
import { getUsers } from "@/network/UserApi";
import { getReports } from "@/network/ReportApi";
import { Users } from "@/types/UsersDTO";
import { Reports } from "@/types/ReportsDTO";

import { isClosed } from "@/lib/reportStatus";

import StatCard from "./components/StatCard";
import MiniBarChart from "./components/MiniBarChart";

export default function OverviewPage() {
  const [users, setUsers] = useState<Users[]>([]);
  const [reports, setReports] = useState<Reports[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function fetchAll() {
    setLoading(true);
    setErr(null);
    try {
      const [u, r] = await Promise.all([getUsers(), getReports()]);
      setUsers(u ?? []);
      setReports(r ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  // 🔍 Usa la misma lógica que Cerrados y Seguimiento
  const totals = useMemo(() => {
    const total = reports.length;
    const cerrados = reports.filter(isClosed).length;
    const enCurso = Math.max(0, total - cerrados);
    return { total, enCurso, cerrados, usuarios: users.length };
  }, [reports, users]);

  const chartData = useMemo(() => ([
    { label: "Totales", value: totals.total },
    { label: "En curso", value: totals.enCurso },
    { label: "Cerrados", value: totals.cerrados },
  ]), [totals]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      {loading && <p>Cargando...</p>}
      {err && <p className="text-red-600">{err}</p>}

      {!loading && !err && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Reportes Totales" value={totals.total} />
            <StatCard title="Reportes en curso" value={totals.enCurso} />
            <StatCard title="Reportes cerrados" value={totals.cerrados} />
            <StatCard title="Usuarios" value={totals.usuarios} />
          </div>

          <MiniBarChart data={chartData} />
        </>
      )}
    </div>
  );
}
