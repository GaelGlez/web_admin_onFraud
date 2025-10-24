"use client";

import { useState } from "react";
import { UsersDTO, UpdateUserDTO } from "@/types/UsersDTO";
import { Button } from "@nextui-org/react";
import EditUserModal from "./editUserModal";
import ConfirmModal from "../ui/confirmModal";
import SearchBar from "@/components/reports/SearchBar";

interface UserTableProps {
    users: UsersDTO[];
    onUpdate: (id: number, data: UpdateUserDTO) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}

export default function UserTable({ users, onUpdate, onDelete }: UserTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState<UsersDTO | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const pageSize = 10;

    // Filtrado por búsqueda
    const filtered = users.filter(
        (u) =>
        u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginación
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(filtered.length / pageSize);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        {/* Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <SearchBar searchTerm={searchTerm} placeholder="Buscar por nombre o correo" onSearch={setSearchTerm} />
            <p className="text-gray-500 text-sm">
            {filtered.length} usuario{filtered.length !== 1 ? "s" : ""}
            </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-[color:var(--color-primary)] text-white">
                <tr>
                <th className="py-2 px-4 text-left font-bold">ID</th>
                <th className="py-2 px-4 text-left font-bold">Nombre</th>
                <th className="py-2 px-4 text-left font-bold">Email</th>
                <th className="py-2 px-4 text-left font-bold">Acciones</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
                {paginated.length > 0 ? (
                paginated.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2 px-4 font-medium text-gray-700">#{u.id}</td>
                    <td className="py-2 px-4">{u.full_name}</td>
                    <td className="py-2 px-4">{u.email}</td>
                    <td className="py-2 px-4 flex gap-2">
                        <Button
                        size="sm"
                        className="bg-blue-600 text-white font-bold px-3 py-1.5 rounded-md hover:bg-[#1a4088] transition-all"
                        onPress={() => setSelectedUser(u)}
                        >
                        Editar
                        </Button>
                        <Button
                        size="sm"
                        className="bg-[color:var(--color-danger)] text-white font-bold px-3 py-1.5 rounded-md hover:bg-[#a62214] transition-all"
                        onPress={() => setConfirmDeleteId(u.id)}
                        >
                        Eliminar
                        </Button>
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-400">
                    No se encontraron usuarios.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
                <button
                key={i}
                className={`px-3 py-1 rounded-md ${
                    page === i + 1
                    ? "bg-[color:var(--color-primary)] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setPage(i + 1)}
                >
                {i + 1}
                </button>
            ))}
            </div>
        )}

        {/* Modales */}
        <EditUserModal
            open={!!selectedUser}
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onSave={(data) => (selectedUser ? onUpdate(selectedUser.id, data) : Promise.resolve())}
        />

        <ConfirmModal
            open={!!confirmDeleteId}
            title="Eliminar usuario"
            message="¿Estás seguro de eliminar este usuario?"
            buttonText1="Eliminar"
            buttonText2="Cancelar"
            onClose={() => setConfirmDeleteId(null)}
            onConfirm={async () => {
            if (confirmDeleteId) {
                await onDelete(confirmDeleteId);
                setConfirmDeleteId(null);
            }
            }}
        />
        </div>
    );
}
