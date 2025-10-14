"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
        router.push("/dashboard"); // navega solo después de render
        }
    }, [isAuthenticated, router]);

    return <>{!isAuthenticated && children}</>;
}