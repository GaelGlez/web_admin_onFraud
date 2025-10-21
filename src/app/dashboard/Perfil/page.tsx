"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

type AuthUser = { full_name?: string; email?: string; role?: string } | null;

export default function PerfilPage() {
  const auth = useAuth() as any;
  const user: AuthUser = auth?.user ?? null; // si tu contexto guarda info del usuario autenticado
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.full_name ?? "",
        email: user.email ?? "",
        role: user.role ?? "Administrador",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Aquí podrías enviar la actualización al backend si lo deseas
    console.log("Datos actualizados:", formData);
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Perfil del Administrador</h1>

      <div className="card max-w-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Nombre completo</label>
            {editing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1"
              />
            ) : (
              <p className="text-gray-800 mt-1">{formData.name || "—"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600">Correo electrónico</label>
            {editing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1"
              />
            ) : (
              <p className="text-gray-800 mt-1">{formData.email || "—"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600">Rol</label>
            <p className="text-gray-800 mt-1">{formData.role}</p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            {editing ? (
              <>
                <button
                  className="secondary"
                  onClick={() => setEditing(false)}
                >
                  Cancelar
                </button>
                <button
                  className="primary"
                  onClick={handleSave}
                >
                  Guardar cambios
                </button>
              </>
            ) : (
              <button
                className="primary"
                onClick={() => setEditing(true)}
              >
                Editar perfil
              </button>
            )}
          </div>
        </div>
      </div>

      {!user && (
        <p className="text-gray-500">
          No se ha cargado información del usuario autenticado.
        </p>
      )}
    </div>
  );
}
