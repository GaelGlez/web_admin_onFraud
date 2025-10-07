"use client";

import { useEffect, useState } from "react";
import { getUsers } from "../../network/UserApi";
import { Users } from "../../types/Users";

export default function dashboard() {
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Función para traer usuarios
  async function fetchUsers() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error: any) {
      setErrorMsg(error.message || "Error al obtener usuarios");
    } finally {
      setLoading(false);
    }
  }

  // Se ejecuta al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-6 text-black">Lista de Usuarios</h1>

      {loading && <p>Cargando usuarios...</p>}
      {errorMsg && <p className="text-red-700 mb-4">{errorMsg}</p>}

      {!loading && !errorMsg && (
        <table className="w-full max-w-3xl border border-gray-300">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-2">Username</th>
              <th className="p-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="border-t border-gray-300">
                <td className="p-2 text-black">{user.name}</td>
                <td className="p-2 text-black">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
