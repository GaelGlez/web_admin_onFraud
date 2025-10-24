"use client";

import { useEffect, useState } from "react";
import { getUsers } from "@/network/UserApi";
import { getReportsStats, getReportsByCategory, getRecentReports } from "@/network/ReportApi";
import { UsersDTO } from "@/types/UsersDTO";
import { Reports } from "@/types/ReportsDTO";
import StatCard from "@/components/dashboard/statCard";
import ReportsChart from "@/components/dashboard/reportsChart";
import RecentReportsTable from "@/components/dashboard/recentReportsTable";
import { Users, FileWarning, CheckCircle, XCircle } from "lucide-react";

export default function DashboardPage() {
  const [users, setUsers] = useState<UsersDTO[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [reportsByCategory, setReportsByCategory] = useState<any[]>([]);
  const [recentReports, setRecentReports] = useState<Reports[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersData, statsData, byCategoryData, recentData] = await Promise.all([
          getUsers(),
          getReportsStats(),
          getReportsByCategory(),
          getRecentReports(),
        ]);

        setUsers(usersData);
        setStats(statsData);
        setReportsByCategory(byCategoryData);
        setRecentReports(recentData);
      } catch (err) {
        console.error("Error al cargar dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return <div className="text-center mt-20 text-gray-600">Cargando dashboard...</div>;

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-[color:var(--color-primary)]">
        Dashboard onFraud
      </h1>

      {/* === MÉTRICAS === */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Usuarios totales" value={users.length} icon={<Users />} />
        <StatCard title="Pendientes" value={stats?.pending || 0} icon={<FileWarning />} color="#EAB308" />
        <StatCard title="Aprobados" value={stats?.approved || 0} icon={<CheckCircle />} color="#16A34A" />
        <StatCard title="Rechazados" value={stats?.rejected || 0} icon={<XCircle />} color="#DC2626" />
      </section>

      {/* === GRÁFICA === */}
      <section className="mb-10">
        <ReportsChart data={reportsByCategory} />
      </section>

      {/* === REPORTES RECIENTES === */}
      <section>
        <RecentReportsTable reports={recentReports} />
      </section>
    </main>
  );
}
