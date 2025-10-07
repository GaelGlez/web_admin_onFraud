"use client";

import { useEffect, useState } from "react";
import { getUsers } from "../../network/UserApi";
import { Users } from "../../types/UsersDTO";
import { Reports } from "@/types/ReportsDTO";
import { getReports, updateReportStatus } from "@/network/ReportApi";

// These IDs should match your backend's status ids
const APPROVED_ID = 2;
const REJECTED_ID = 3;

export default function dashboard() {
    const [users, setUsers] = useState<Users[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState<string | null>(null);

    const [reports, setReports] = useState<Reports[]>([]);
    const [reportsLoading, setReportsLoading] = useState(false);
    const [reportsError, setReportsError] = useState<string | null>(null);


    // Función para traer usuarios
    async function fetchUsers() {
        setUsersLoading(true);
        setUsersError(null);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error: any) {
            setUsersError(error.message || "Error al obtener usuarios");
        } finally {
            setUsersLoading(false);
        }
    }

    // Función para traer reportes
    async function fetchReports() {
        setReportsLoading(true);
        setReportsError(null);
        try {
            const data = await getReports();
            setReports(data);
        } catch (error: any) {
            setReportsError(error.message || "Error al obtener reportes");
        } finally {
            setReportsLoading(false);
        }
    }

    async function handleUpdateReportStatus(reportId: number, statusId: number) {
        try {
            await updateReportStatus(reportId, statusId);
            // Actualizar estado local sin recargar todo
            setReports((prev) =>
                prev.map((r) =>
                    r.id === reportId ? { ...r, status: { id: statusId, name: statusId === APPROVED_ID ? "Aprobado" : "Rechazado" } } : r
                )
            );
        } catch (error: any) {
            alert(error.message || "Error al actualizar el reporte");
        }
    }


    // Se ejecuta al montar el componente
    useEffect(() => {
        fetchUsers();
        fetchReports();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
        <h1 className="text-2xl font-bold mb-6 text-black">Lista de Usuarios</h1>

        {usersLoading && <p>Cargando usuarios...</p>}
        {usersError && <p className="text-red-700 mb-4">{usersError}</p>}

        {!usersLoading && !usersError && (
            <table className="w-full max-w-3xl border border-gray-300">
            <thead>
                <tr className="bg-gray-800 text-white">
                <th className="p-2">Username</th>
                <th className="p-2">Email</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user, index) => (
                <tr key={index} className="border-t border-gray-300">
                    <td className="p-2 text-black">{user.full_name}</td>
                    <td className="p-2 text-black">{user.email}</td>
                </tr>
                ))}
            </tbody>
            </table>
        )}

        <h1 className="text-2xl font-bold mb-6 text-black">Reportes</h1>
        {reportsLoading && <p>Cargando reportes...</p>}
        {reportsError && <p className="text-red-700 mb-4">{reportsError}</p>}

        {!reportsLoading && !reportsError && (
            <table className="w-full max-w-3xl border border-gray-300">
            <thead>
                <tr className="bg-gray-800 text-white">
                <th className="p-2">Usuario</th>
                <th className="p-2">Título</th>
                <th className="p-2">URL</th>
                <th className="p-2">Descripción</th>
                <th className="p-2">Categoría</th>
                <th className="p-2">Estado</th>
                <th className="p-2">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {reports.map((r) => {
                const matchedUser = users.find((u) => u.id === r.user_id);
                return (
                    <tr key={r.id} className="border-t border-gray-300">
                        <td className="p-2">{r.user_name || "Anónimo"}</td>
                        <td className="p-2">{r.title}</td>
                        <td className="p-2">{r.url}</td>
                        <td className="p-2">{r.description}</td>
                        <td className="p-2">{r.category_name ?? "—"}</td>
                        <td className="p-2">{r.status_name ?? "—"}</td>
                        <td className="p-2 flex gap-2">
                        <button
                            className="bg-green-500 px-2 py-1 text-white rounded"
                            onClick={() => handleUpdateReportStatus(r.id, APPROVED_ID)}
                        >
                            Aprobar
                        </button>
                        <button
                            className="bg-red-500 px-2 py-1 text-white rounded"
                            onClick={() => handleUpdateReportStatus(r.id, REJECTED_ID)}
                        >
                            Rechazar
                        </button>
                        </td>
                    </tr>
                );
                })}
            </tbody>
            </table>
        )}
        </div>
    );
}
