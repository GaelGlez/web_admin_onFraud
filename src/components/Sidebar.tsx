"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import ConfirmModal from "@/components/ui/confirmModal";
import {
  LayoutDashboard, User, Users, FileSearch, LogOut, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loading, setLoading] = useState(false);


  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/reportes", label: "Reportes", icon: FileSearch },
    { href: "/dashboard/usuarios", label: "Usuarios", icon: Users },
    { href: "/dashboard/categorias", label: "Categorías", icon: ShieldCheck },
    { href: "/dashboard/perfil", label: "Perfil", icon: User },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-[#00623A] text-white flex flex-col justify-between p-6 shadow-xl">
      {/* ===== Header ===== */}
      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 flex items-center justify-center">
            <Image
              src="/logo_onFraud_white.png"
              alt="onFraud logo"
              width={68}
              height={89}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight roboto-condensed">onFraud</h1>
            <p className="text-sm text-white/80"> Panel administrativo</p>
          </div>
        </div>

        {/* ===== Navigation ===== */}
        <nav className="flex flex-col space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
                  ${active
                    ? "bg-white shadow-sm"
                    : "hover:bg-white/10 hover:translate-x-1"
                  }`}
              >
                <Icon
                  size={18}
                  className={active ? "text-[#00623A]" : "text-white"}
                />
                <span className={active ? "text-[#00623A] font-semibold" : "text-white text-[15px] tracking-wide"}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ===== Footer / Logout ===== */}
      <div className="border-t border-white/20 pt-5">
        <button
          className="flex items-center gap-2 bg-[color:var(--color-danger)] text-white font-bold px-4 py-2 rounded-lg w-full justify-center hover:bg-[#a62214] transition-all"
          onClick={() => setShowLogoutConfirm(true)}
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>

        <ConfirmModal
          open={showLogoutConfirm}
          title="Cerrar sesión"
          message="¿Estás seguro de que quieres cerrar sesión?"
          buttonText1="Cerrar sesión"
          buttonText2="Cancelar"
          loading={loading}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={async () => {
            setLoading(true);
            try {
              logout();           // tu función de logout
              router.push("/login");
            } finally {
              setLoading(false);
              setShowLogoutConfirm(false);
            }
          }}
        />

        <p className="text-xs text-white/60 mt-4">
          ©<span className="font-semibold">onFraud</span>. Todos los derechos reservados.
        </p>
      </div>
    </aside>
  );
}
