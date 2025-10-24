"use client";

import { useEffect, useState } from "react";
import { getUsers } from "@/network/UserApi";
//import { getReportStats } from "@/network/ReportApi";
import { Users } from "@/types/UsersDTO";

export default function DashboardPage() {
  const [users, setUsers] = useState<Users[]>([]);
  const [stats, setStats] = useState<any>(null); // puedes tipar según tu endpoint
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const usersData = await getUsers();
        setUsers(usersData);

        //const statsData = await getReportStats();
        //setStats(statsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center mt-20">Cargando dashboard...</div>;

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-[color:var(--color-primary)]">Dashboard</h1>

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
          <p className="text-2xl font-bold">{stats?.approved || 0}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-sm text-gray-500">Reportes rechazados</h2>
          <p className="text-2xl font-bold">{stats?.rejected || 0}</p>
        </div>
      </div>

      {/* Aquí luego puedes agregar gráficas o tabla de reportes recientes */}
    </main>
  );
}
