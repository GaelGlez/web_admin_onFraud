"use client";

import { useEffect, useState } from "react";
import { getUsers } from "@/network/UserApi";
import {
  getReportsStats,
  getReportsByCategory,
  getRecentReports,
} from "@/network/ReportApi";
import { Users } from "@/types/UsersDTO";
import { Reports } from "@/types/ReportsDTO";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  const [users, setUsers] = useState<Users[]>([]);
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
    return <div className="text-center mt-20">Cargando dashboard...</div>;

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-[color:var(--color-primary)]">
        Dashboard
      </h1>

      {/* === MÉTRICAS === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-sm text-gray-500">Usuarios totales</h2>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-sm text-gray-500">Reportes pendientes</h2>
          <p className="text-2xl font-bold">{stats?.pending || 0}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-sm text-gray-500">Reportes aprobados</h2>
          <p className="text-2xl font-bold text-green-600">
            {stats?.approved || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-sm text-gray-500">Reportes rechazados</h2>
          <p className="text-2xl font-bold text-red-600">
            {stats?.rejected || 0}
          </p>
        </div>
      </div>

      {/* === GRÁFICA POR CATEGORÍA === */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Reportes por categoría</h2>
        {reportsByCategory.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportsByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="rgba(0, 98, 58, 0.8)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No hay datos para mostrar.</p>
        )}
      </div>

      {/* === REPORTES RECIENTES === */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Reportes recientes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="border-b text-gray-600">
              <tr>
                <th className="py-2 px-3">ID</th>
                <th className="py-2 px-3">Título</th>
                <th className="py-2 px-3">Categoría</th>
                <th className="py-2 px-3">Estado</th>
                <th className="py-2 px-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium">#{r.id}</td>
                  <td className="py-2 px-3">{r.title}</td>
                  <td className="py-2 px-3">{r.category_name}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        r.status_name === "Aprobado"
                          ? "bg-green-100 text-green-700"
                          : r.status_name === "Rechazado"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {r.status_name}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
