"use client";
import Link from "next/link";

function isActive(currentPath: string | null, href: string) {
  if (!currentPath) return false;
  return currentPath === href;
}

export default function Sidebar({ currentPath }: { currentPath?: string | null }) {
  return (
    <aside className="sidebar w-64 shrink-0 p-4 h-screen sticky top-0">
      <h2 className="text-xl font-bold mb-6">Admin</h2>
      <nav className="space-y-2">
        <Link
          href="/dashboard"
          className={`${
            isActive(currentPath ?? null, "/dashboard") ? "active" : ""
          }`}
        >
          Dashboard Overview
        </Link>

        <Link
          href="/dashboard/seguimiento"
          className={`${
            isActive(currentPath ?? null, "/dashboard/seguimiento") ? "active" : ""
          }`}
        >
          Seguimiento
        </Link>

        <Link
          href="/dashboard/cerrados"
          className={`${
            isActive(currentPath ?? null, "/dashboard/cerrados") ? "active" : ""
          }`}
        >
          Reportes cerrados
        </Link>
      </nav>
    </aside>
  );
}
