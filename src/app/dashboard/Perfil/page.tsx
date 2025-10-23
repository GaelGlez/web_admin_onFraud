"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile } from "@/network/perfil";
import { Users } from "@/types/UsersDTO";

export default function PerfilPage() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const [profile, setProfile] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    // Si no hay auth, te vas a login (el layout también protege, esto mejora UX)
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const me = await getUserProfile();
        setProfile(me);
      } catch (e: any) {
        if (e?.status === 401 || e?.status === 403) {
          // Token inválido/expirado → limpiar y mandar a login
          logout();
          router.push("/login");
          return;
        }
        setErr(e?.message ?? "No se pudo cargar el perfil");
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated, logout, router]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Perfil</h1>

      {loading && <p>Cargando perfil...</p>}
      {err && <p className="text-red-600">{err}</p>}

      {!loading && !err && profile && (
        <div className="card max-w-3xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nombre completo</p>
              <p className="font-medium">{profile.full_name ?? "—"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Correo</p>
              <p className="font-medium">{profile.email ?? "—"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">ID</p>
              <p className="font-medium">{String(profile.id ?? "—")}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Rol</p>
              <p className="font-medium">{(profile as any).role ?? "Administrador"}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              className="primary"
              onClick={() => {
                logout();
                router.push("/login");
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}

      {!loading && !err && !profile && (
        <p className="text-gray-500">No se encontró información de perfil.</p>
      )}
    </div>
  );
}
