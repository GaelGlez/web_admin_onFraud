"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";

const SidebarComponent: any = Sidebar;

export default function DashboardLayout({
    children,
    }: Readonly<{ children: React.ReactNode }>) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Redirigir a login si no está autenticado
    useEffect(() => {
        if (!isAuthenticated) {
        router.push("/login");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null; // evita renderizar antes de la verificación

    return (
        <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar siempre visible */}
        <SidebarComponent currentPath={pathname} />

        {/* Contenido principal */}
        <main className="flex-1 p-6">
            {children}
            {/* Opcional: botón de logout en el layout */}
        </main>
        </div>
    );
}
