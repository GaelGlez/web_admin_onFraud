"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
        router.push("/login"); // redirige solo después de render
        }
    }, [isAuthenticated, router]);

    return <>{isAuthenticated && children}</>; // muestra children solo si autenticado
}