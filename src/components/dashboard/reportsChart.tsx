"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function ReportsChart({ data }: { data: any[] }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Reportes por categoría
        </h2>
        {data.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        ) : (
            <p className="text-gray-500 text-sm">No hay datos para mostrar.</p>
        )}
        </div>
    );
}
