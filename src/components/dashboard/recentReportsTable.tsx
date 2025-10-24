"use client";

import { useState } from "react";
import { Reports } from "@/types/ReportsDTO";
import { Button } from "@nextui-org/react";

interface RecentReportsTableProps {
    reports: Reports[];
}

type Props = {
    report: Reports;
};

export default function RecentReportsTable({ reports }: RecentReportsTableProps) {
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // Paginación
    const paginated = reports.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(reports.length / pageSize);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-lg font-semibold mb-6 text-gray-700">Reportes recientes</h2>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full text-sm divide-y divide-gray-200">
                    <thead className="bg-[color:var(--color-primary)] text-white">
                        <tr>
                            <th className="py-2 px-4 text-left font-bold">ID</th>
                            <th className="py-2 px-4 text-left font-bold">Título</th>
                            <th className="py-2 px-4 text-left font-bold">Categoría</th>
                            <th className="py-2 px-4 text-left font-bold">Estado</th>
                            <th className="py-2 px-4 text-left font-bold">Fecha</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {paginated.length > 0 ? (
                            paginated.map((r) => (
                                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-2 px-4 font-medium text-gray-700">#{r.id}</td>
                                    <td className="py-2 px-4">{r.title}</td>
                                    <td className="py-2 px-4">{r.category_name}</td>
                                    <td className="py-2 px-4">
                                        <span
                                            className={`px-2 py-1 text-xs font-bold rounded-full text-center justify-center ${
                                                r.status_name === "Aprobado"
                                                    ? "bg-[color:var(--color-primary)] text-white"
                                                    : r.status_name === "Rechazado"
                                                    ? "bg-[color:var(--color-danger)] text-white"
                                                    : "bg-[color:var(--color-warning)] text-white"
                                            }`}
                                        >
                                            {r.status_name}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 text-gray-500">
                                        {new Date(r.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-6 text-center text-gray-400">
                                    No se encontraron reportes.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-4 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            className={`px-3 py-1 rounded-md ${
                                page === i + 1
                                    ? "bg-[color:var(--color-primary)] text-white"
                                    : "bg-gray-200 text-gray-700"
                            }`}
                            onClick={() => setPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}