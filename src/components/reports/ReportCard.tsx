"use client";

import { Reports } from "../../types/ReportsDTO";
import { Card, CardHeader, CardFooter } from "@heroui/react";
import { useRouter } from "next/navigation";
import { User, Tag, Calendar } from "lucide-react";
import { Separator } from "../ui/separator";

type Props = {
    report: Reports;
};

export default function ReportCard({ report }: Props) {
    const router = useRouter();

    const getStatusColor = () => {
        switch (report?.status_name) {
            case "Aprobado":
                return "bg-[color:var(--color-primary)] text-white font-bold text-lg px-3 py-2 rounded-full";
            case "Rechazado":
                return "bg-[color:var(--color-danger)] text-white font-bold text-lg px-3 py-2 rounded-full";
            case "Pendiente":
                return "bg-[color:var(--color-warning)] text-white font-bold text-lg px-3 py-2 rounded-full";
            default:
                return "bg-gray-100 text-gray-800 font-bold text-lg px-3 py-2 rounded-full";
        }
    };

    const briefDescription = report.description
        ? report.description.length > 120
        ? report.description.slice(0, 120) + "..."
        : report.description
        : "Sin descripción";

    return (
        <Card
        isPressable
        onPress={() => router.push(`/dashboard/reporte/${report.id}`)}
        className="relative w-full h-[280px] group hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 bg-white rounded-2xl overflow-hidden flex flex-col justify-between"
        >
        {/* ===== HEADER ===== */}
        <CardHeader className="flex flex-col items-start text-left p-5">
            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-[#00623A] transition-colors mb-1 line-clamp-2">
            {report.title}
            </h2>

            {report.url && (
            <a
                href={report.url}
                target="_blank"
                className="text-sm text-[#00623A] hover:underline mb-2 break-all"
            >
                {report.url}
            </a>
            )}

            <p className="text-gray-600 text-sm line-clamp-3">{briefDescription}</p>
        </CardHeader>

        {/* ===== FOOTER ===== */}
        <CardFooter className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-center text-center bg-gray-50 border-t border-gray-200 py-3 space-y-2">
            <div className="flex flex-wrap items-center justify-center gap-x-4 text-[color:var(--color-primary)] text-sm">
                <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>{report.user_name ?? "Anónimo"}</span>
                </div>

                <Separator 
                    orientation="vertical" 
                        className="mx-2 h-4" 
                        style={{
                            borderRightWidth: '1px',       // grosor de la línea
                            borderRightColor: 'var(--color-primary)' // color de la línea
                        }} 
                />

                {report.category_name && (
                    <div className="flex items-center gap-1">
                        <Tag size={14} />
                        <span>{report.category_name}</span>
                    </div>
                )}

                <Separator 
                    orientation="vertical" 
                        className="mx-2 h-4" 
                        style={{
                            borderRightWidth: '1px',       // grosor de la línea
                            borderRightColor: 'var(--color-primary)' // color de la línea
                        }} 
                />

                {report.created_at && (
                    <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                            {new Date(report.created_at).toLocaleDateString("es-MX", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                )}
            </div>

            <span
                className={`px-3 py-1 rounded-full text-xs ${getStatusColor()}`}
            >
                {report.status_name ?? "Pendiente"}
            </span>
        </CardFooter>
        </Card>
    );
}
