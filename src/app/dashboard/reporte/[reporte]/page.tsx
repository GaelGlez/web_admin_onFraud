"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getReports, updateReportStatus, getEvidencesByReport, deleteReport } from "@/network/ReportApi";
import { Reports } from "@/types/ReportsDTO";
import { Button } from "@nextui-org/react";
import { X, Trash  } from "lucide-react";
import { Evidences } from "@/types/EvidencesDTO";
import ConfirmModal from "@/components/ui/confirmModal";


export default function Page() {
    const router = useRouter();
    const pathname = usePathname();
    const reporteId = pathname?.split("/").pop();

    const [report, setReport] = useState<Reports | null>(null);
    const [evidences, setEvidences] = useState<Evidences[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [autoNext, setAutoNext] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

    const handleToggle = () => {
        setAutoNext(prev => {
            localStorage.setItem("autoNext", (!prev).toString());
            return !prev;
        });
    };

    const handleStatusChange = async (statusId: number) => {
        if (!report) return;
        setActionLoading(true);
        try {
            await updateReportStatus(report.id, statusId);
            setReport({ ...report, status_id: statusId, status_name: statusId === 2 ? "Aprobado" : "Rechazado" });

            if (autoNext) {
                const allReports = await getReports({});
                const currentIndex = allReports.findIndex(r => r.id === report.id);
                if (currentIndex >= 0 && currentIndex < allReports.length - 1) {
                    const nextReportId = allReports[currentIndex + 1].id;
                    router.push(`/dashboard/reporte/${nextReportId}`);
                } else {
                    router.push("/dashboard/reportes");
                }
            } else {
                router.push("/dashboard/reportes");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!report) return;
        setActionLoading(true);
        try {
            await deleteReport(report.id);
            router.push("/dashboard/reportes");
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!reporteId) return;
            setLoading(true);
            try {
                const data = await getReports({});
                const found = data.find((r) => r.id === Number.parseInt(reporteId));
                if (!found) throw new Error("Reporte no encontrado");
                setReport(found);

                const ev = await getEvidencesByReport(found.id);
                setEvidences(ev);
            } catch (err: any) {
                setError(err.message || "Error al cargar reporte");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [reporteId]);

    useEffect(() => {
        const saved = localStorage.getItem("autoNext");
        if (saved === "true") setAutoNext(true);
    }, []);

    if (loading) return <div className="text-center mt-20">Cargando reporte...</div>;
    if (error) return <div className="text-red-700 text-center mt-20">{error}</div>;
    if (!report) return null;

    return (
        <main className="min-h-screen p-6 bg-gray-50">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white rounded-md shadow-md p-6 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <h1 className="text-3xl font-bold text-[color:var(--color-primary)]">{report.title}</h1>
                        <Button
                            isIconOnly
                            size="sm"
                            color="secondary"
                            onPress={() => router.back()}
                            className="bg-[color:var(--color-primary)] text-white rounded-full p-2 hover:bg-[color:var(--color-primary)]/80 transition-all"
                            startContent={<X className="w-4 h-4" />}
                        />
                    </div>

                    {/* Información del reporte */}
                    <div className="flex flex-col gap-2 text-gray-600 text-sm">
                        <span>
                            <span className={`px-2 py-1 rounded-full ${getStatusColor()}`}>
                                {report.status_name}
                            </span>
                        </span>
                        <span><span className="font-bold text-[color:var(--color-primary)]">Título:</span> {report.title}</span>
                        <span><span className="font-bold text-[color:var(--color-primary)]">Creación:</span> {new Date(report.created_at).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })}</span>
                        <span><span className="font-bold text-[color:var(--color-primary)]">Categoría:</span> {report.category_name}</span>
                        {report.url && (
                            <span>
                                <span className="font-bold text-[color:var(--color-primary)]">URL:</span>{" "}
                                <a href={report.url} target="_blank" rel="noopener noreferrer" className="text-[color:var(--color-primary)] hover:underline">
                                    {report.url}
                                </a>
                            </span>
                        )}
                        <span><span className="font-bold text-[color:var(--color-primary)]">ID:</span> #{report.id}</span>
                    </div>

                    {/* Descripción */}
                    {report.description && (
                        <div className="bg-gray-50 p-4 rounded-md shadow-inner">
                            <h2 className="text-[color:var(--color-primary)] font-semibold mb-2">Descripción</h2>
                            <p className="text-gray-700">{report.description}</p>
                        </div>
                    )}

                    {/* Evidencias */}
                    {evidences.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-md shadow-inner space-y-2">
                            <h2 className="text-[color:var(--color-primary)] font-semibold mb-2">Evidencias</h2>
                            <div className="flex flex-wrap gap-2">
                                {evidences.map((ev) => (
                                    <img
                                        key={ev.id}
                                        src={`http://localhost:4000/public/${ev.file_path.replace('/dashboard/reporte', '')}`}
                                        alt={ev.file_key}
                                        className="w-24 h-24 object-cover rounded cursor-pointer border hover:border-[color:var(--color-primary)]"
                                        onClick={() => setSelectedImage(ev.file_path)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Modal de imagens */}
                    {selectedImage && (
                        <div className="fixed inset-0 z-50 flex justify-center items-center">
                            <div className="absolute inset-0 backdrop-blur-sm bg-black/10" onClick={() => setSelectedImage(null)} />
                            <div className="relative z-10 p-2 bg-white rounded shadow-lg">
                                <img
                                    src={`http://localhost:4000/public/${selectedImage.replace('/dashboard/reporte', '')}`}
                                    alt="Evidencia ampliada"
                                    className="max-w-lg max-h-[80vh] rounded"
                                />
                            </div>
                        </div>
                    )}

                    {/* Toggle autoNext */}
                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            id="autoNext"
                            checked={autoNext}
                            onChange={handleToggle}
                            className="h-4 w-4"
                        />
                        <label htmlFor="autoNext" className="text-sm text-gray-700">Avanzar automáticamente al siguiente reporte</label>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2 justify-center mt-2">
                        <Button
                            size="sm"
                            className="bg-[color:var(--color-danger)] text-white font-bold px-3 py-1.5 rounded-md hover:bg-[#a62214] transition-all"
                            onPress={() => handleStatusChange(3)}
                            isDisabled={actionLoading || report.status_id === 3}
                        >
                            Rechazar
                        </Button>
                        <Button
                            size="sm"
                            className="bg-[color:var(--color-primary)] text-white font-bold px-3 py-1.5 rounded-md hover:bg-[#05442c] transition-all"
                            onPress={() => handleStatusChange(2)}
                            isDisabled={actionLoading || report.status_id === 2}
                        >
                            Aprobar
                        </Button>
                        <Button
                            size="sm"
                            isIconOnly
                            onPress={() => setShowDeleteConfirm(true)}
                            isDisabled={actionLoading}
                            className="bg-gray-200 text-gray-700 hover:bg-gray-300 p-3 rounded-full transition-all"
                            startContent={<Trash className="w-6 h-6" />}
                        />
                        <ConfirmModal
                            open={showDeleteConfirm}
                            title="Confirmar eliminación"
                            message="¿Estás seguro de que quieres eliminar este reporte? Esta acción no se puede deshacer."
                            buttonText1="Eliminar"
                            buttonText2="Cancelar"
                            onConfirm={handleConfirmDelete}
                            onClose={() => setShowDeleteConfirm(false)}
                            loading={actionLoading}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
