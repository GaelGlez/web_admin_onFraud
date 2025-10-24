"use client";

import { useEffect, useState } from "react";
import { getUsers, updateUser, deleteUser } from "@/network/UserApi";
import { UsersDTO, UpdateUserDTO } from "@/types/UsersDTO";
import UserTable from "@/components/users/userTable";

export default function UsuariosPage() {
    const [users, setUsers] = useState<UsersDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
        };
        fetchUsers();
    }, []);

    const handleUpdate = async (id: number, data: UpdateUserDTO) => {
        try {
        const updated = await updateUser(id.toString(), data);
        setUsers((prev) =>
            prev.map((u) => (u.id === id ? { ...u, ...updated } : u))
        );
        } catch (err) {
        console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        try {
        await deleteUser(id.toString());
        setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (err) {
        console.error(err);
        }
    };

    return (
        <main className="min-h-screen p-8 bg-gray-50">
        <h1 className="text-3xl font-bold mb-8 text-[color:var(--color-primary)]">
            Control de Usuarios
        </h1>

        {loading ? (
            <p className="text-center text-gray-600 mt-10">Cargando usuarios...</p>
        ) : (
            <UserTable users={users} onUpdate={handleUpdate} onDelete={handleDelete} />
        )}
        </main>
    );
}
