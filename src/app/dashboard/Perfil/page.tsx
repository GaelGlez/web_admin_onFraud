"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

/** Decodifica JWT (header y payload) sin verificar firma. */
function decodeJwt(token?: string) {
  if (!token) return null;
  try {
    const [h, p] = token.split(".");
    if (!p) return null;
    // base64url → base64
    const base64 = p.replace(/-/g, "+").replace(/_/g, "/");
    const json = typeof window !== "undefined"
      ? decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        )
      : Buffer.from(base64, "base64").toString("utf8");
    return JSON.parse(json) as Record<string, any>;
  } catch {
    return null;
  }
}

function fmt(ts?: number) {
  if (!ts) return "—";
  // exp/iat normalmente vienen en segundos
  const d = new Date(ts * 1000);
  return d.toLocaleString();
}

export default function PerfilPage() {
  const { accessToken, refreshToken, isAuthenticated, logout, refreshTokenFunc } = useAuth();
  const router = useRouter();

  const [showAccess, setShowAccess] = useState(false);
  const [showRefresh, setShowRefresh] = useState(false);

  const payload = useMemo(() => decodeJwt(accessToken || undefined), [accessToken]);

  // Datos derivados
  const email = payload?.email ?? payload?.sub ?? "—";
  const roles = payload?.roles ?? payload?.role ?? payload?.authorities ?? "—";
  const iat = payload?.iat as number | undefined;
  const exp = payload?.exp as number | undefined;

  const remaining = useMemo(() => {
    if (!exp) return "—";
    const ms = exp * 1000 - Date.now();
    if (ms <= 0) return "Expirado";
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins}m ${secs}s`;
  }, [exp]);

  useEffect(() => {
    if (!isAuthenticated) {
      // layout también redirige, esto acelera UX post-logout
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Perfil / Sesión</h1>

      <div className="card max-w-3xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Estado</p>
            <p className="font-medium">{isAuthenticated ? "Autenticado" : "No autenticado"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Usuario</p>
            <p className="font-medium">{email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Rol(es)</p>
            <p className="font-medium">
              {Array.isArray(roles) ? roles.join(", ") : String(roles)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Emitido (iat)</p>
            <p className="font-medium">{fmt(iat)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Expira (exp)</p>
            <p className="font-medium">{fmt(exp)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tiempo restante</p>
            <p className="font-medium">{remaining}</p>
          </div>
        </div>
      </div>

      <div className="card max-w-3xl space-y-3">
        <h2 className="text-lg font-semibold">Tokens</h2>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">Access Token</p>
          <div className="flex items-center gap-3">
            <code className="block w-full overflow-x-auto text-sm bg-gray-50 border border-gray-200 rounded px-3 py-2">
              {showAccess ? accessToken ?? "—" : accessToken ? "••••••••••••" : "—"}
            </code>
            {accessToken && (
              <button
                className="secondary"
                onClick={() => setShowAccess((v) => !v)}
              >
                {showAccess ? "Ocultar" : "Ver"}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">Refresh Token</p>
          <div className="flex items-center gap-3">
            <code className="block w-full overflow-x-auto text-sm bg-gray-50 border border-gray-200 rounded px-3 py-2">
              {showRefresh ? refreshToken ?? "—" : refreshToken ? "••••••••••••" : "—"}
            </code>
            {refreshToken && (
              <button
                className="secondary"
                onClick={() => setShowRefresh((v) => !v)}
              >
                {showRefresh ? "Ocultar" : "Ver"}
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button className="secondary" onClick={async () => { await refreshTokenFunc(); }}>
            Refrescar token
          </button>
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

      {!accessToken && (
        <p className="text-gray-500">
          No hay access token en la sesión. Inicia sesión para ver los detalles.
        </p>
      )}
    </div>
  );
}
