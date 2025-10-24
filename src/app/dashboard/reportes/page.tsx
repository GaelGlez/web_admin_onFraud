"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import { getReports } from "@/network/ReportApi";
import { Reports } from "@/types/ReportsDTO";
import { SearchBar, ReportCard } from "@/components/reports";
import { X } from "lucide-react";
import { Button } from "@nextui-org/react";
import Select from "@/components/reports/Select";

// Opciones de filtros
const statusOptions = [
    { label: "Aprobado", value: "Aprobado" },
    { label: "Rechazado", value: "Rechazado" },
    { label: "Pendiente", value: "Pendiente" },
];

// Mapeo para IDs del backend
const statusMap: Record<string, number> = {
    "Pendiente": 1,
    "Aprobado": 2,
    "Rechazado": 3,
    };

const userOptions = [
    { label: "Anónimo", value: "anonimo" },
    { label: "Autenticado", value: "autenticado" },
];

export default function Page() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;

    const [reports, setReports] = useState<Reports[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

        // Generar query params para mantener filtros en la URL
    const createQueryString = useCallback(
        (name: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set(name, value);
        return params.toString();
        },
        [searchParams]
    );

    // Filtros
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || '');
    const [selectedStatus, setSelectedStatus] = useState(searchParams.get("status") || 'Pendiente');
    const [selectedUser, setSelectedUser] = useState(searchParams.get("user") || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");

    // Fetch de reportes
    const fetchReports = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getReports({
                statusId: statusMap[selectedStatus], // Por default pendiente
                categoryId: selectedCategory ? parseInt(selectedCategory) : undefined,
                userFilter:
                    selectedUser === 'anonimo'
                    ? 'onlyAnonymous'
                    : selectedUser === 'autenticado'
                    ? 'onlyUsers'
                    : undefined,
                keyword: searchTerm || undefined,
                });
            setReports(data);
        } catch (err: any) {
            setError(err.message || 'Error al cargar reportes');
        } finally {
            setLoading(false);
        }
        }, [selectedStatus, selectedCategory, selectedUser, searchTerm]);

    // Handlers de filtros
    const handleReset = () => {
        router.push(pathname);
        setSearchTerm('');
        setSelectedStatus('Pendiente');
        setSelectedUser('');
        setSelectedCategory('');
    };

    const handleSearch = (term: string) => {
        router.push(pathname + "?" + createQueryString("search", term));
        setSearchTerm(term);
    };

    const handleStatusChange = (value: string) => {
        router.push(pathname + "?" + createQueryString("status", value));
        setSelectedStatus(value);
    };

    const handleUserChange = (value: string) => {
        router.push(pathname + "?" + createQueryString("user", value));
        setSelectedUser(value);
    };

    const handleCategoryChange = (value: string) => {
        router.push(pathname + "?" + createQueryString("category", value || ""));
        setSelectedCategory(value || "");
    };

    // Extraer categorías únicas para el Select
    const categoryOptions = Array.from(
        new Set(reports.map(r => r.category_name).filter(Boolean))
    ).map(c => ({ label: c!, value: c! }));


    // Filtrado de reportes
    const filteredReports = reports
        .filter((r) =>
        (r.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.description || "").toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((r) => (selectedStatus ? r.status_name === selectedStatus : true))
        .filter((r) => {
        if (!selectedUser) return true;
        return selectedUser === "anonimo" ? !r.user_name : !!r.user_name;
        })
        .filter((r) =>
        selectedCategory
            ? r.category_name?.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
            : true
        );
    
    useEffect(() => {
        fetchReports();
    }, [selectedStatus, selectedCategory, selectedUser]);

    if (loading) return <div>Cargando reportes...</div>;
    if (error) return <div className="text-red-700">{error}</div>;

    return (
        <Suspense fallback={<div>Cargando...</div>}>
        <main className="min-h-screen p-6 bg-gray-50">
            <h1 className="text-3xl font-bold text-[color:var(--color-primary)] mb-6">Reportes</h1>

            {/* Barra de búsqueda y filtros */}
            <div className="flex flex-col md:flex-row gap-2 mb-6 items-center">
            <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
            <div className="flex flex-row gap-2 flex-wrap items-center">
                <Select
                    value={selectedStatus}
                    title="Status"
                    options={statusOptions}
                    onChange={handleStatusChange}
                    canSearch={false}
                />
                <Select
                    value={selectedUser}
                    title="Usuario"
                    options={userOptions}
                    onChange={handleUserChange}
                    canSearch={false}
                />
                <Select
                    value={selectedCategory}
                    title="Categoría"
                    options={categoryOptions.length > 0 ? categoryOptions : []}
                    onChange={handleCategoryChange}
                    canSearch={true}
                />
                {/* Botón de reset */}
                {(searchTerm || selectedStatus || selectedUser || selectedCategory) && (
                    <Button isIconOnly size="sm" className="button-reset"startContent={<X className="w-4 h-4" />} onPress={handleReset} />
                )}
            </div>
            </div>

            {/* Grid de reportes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} />
            ))}
            </div>
        </main>
        </Suspense>
    );
}
