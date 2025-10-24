"use client";

import { useState, useEffect, useMemo } from "react";
import { UsersDTO, UpdateUserDTO } from "@/types/UsersDTO";
import { Button, Input } from "@nextui-org/react";
import CustomInputField from "../ui/customInputField";

interface EditUserModalProps {
    open: boolean;
    user: UsersDTO | null;
    onClose: () => void;
    onSave: (data: UpdateUserDTO) => Promise<void>;
}

export default function EditUserModal({ open, user, onClose, onSave }: EditUserModalProps) {
    const [form, setForm] = useState<UpdateUserDTO>({ full_name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ full_name?: string; email?: string }>({});

    // Calcular campos modificados
    const getModifiedFields = (): UpdateUserDTO => {
        if (!user) return {};
        const updated: UpdateUserDTO = {};
        if (form.full_name !== user.full_name) updated.full_name = form.full_name;
        if (form.email !== user.email) updated.email = form.email;
        if (form.password && form.password.trim() !== "") updated.password = form.password;
        return updated;
    };

    // Saber si hay cambios
    const isDirty = useMemo(() => Object.keys(getModifiedFields()).length > 0, [form, user]);

    const handleChange = (field: keyof UpdateUserDTO, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleSubmit = async () => {
        const newErrors: { full_name?: string; email?: string } = {};
        if (!(form.full_name ?? "").trim()) newErrors.full_name = "El nombre es obligatorio";
        if (!(form.email ?? "").trim()) newErrors.email = "El correo es obligatorio";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const modifiedFields = getModifiedFields();
        if (Object.keys(modifiedFields).length === 0) return; // nada que enviar

        setLoading(true);
        try {
            await onSave(modifiedFields);
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Actualizar form cuando cambia el usuario
    useEffect(() => {
        if (user) {
            setForm({ full_name: user.full_name, email: user.email, password: "" });
            setErrors({});
        }
    }, [user]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative z-[10000] bg-white p-6 rounded-xl shadow-lg max-w-md w-full space-y-4">
                <h2 className="text-lg font-semibold text-[color:var(--color-primary)]">Editar usuario</h2>

                <div className="flex flex-col gap-3">
                    <CustomInputField
                        value={form.full_name ?? ""}
                        onChange={(e) => handleChange("full_name", e)}
                        placeholder="Nombre completo"
                        error={errors.full_name}
                    />
                    {errors.full_name && <p className="text-sm text-red-600">{errors.full_name}</p>}

                    <CustomInputField
                        value={form.email ?? ""}
                        onChange={(e) => handleChange("email", e)}
                        placeholder="Correo"
                        type="email"
                        error={errors.email}
                    />
                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}

                    <CustomInputField
                        value={form.password ?? ""}
                        onChange={(v) => handleChange("password", v)}
                        placeholder="Contraseña (opcional)"
                        type="password"
                    />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <Button
                        size="sm"
                        className={`font-bold px-3 py-1.5 rounded-md transition-all ${
                            loading || !isDirty
                                ? "bg-green-100 text-gray-400 cursor-not-allowed" // bloqueado
                                : "bg-[color:var(--color-primary)] text-white hover:bg-[#05442c]" // activo
                        }`}
                        onPress={handleSubmit}
                        isDisabled={loading || !isDirty}
                    >
                        Guardar
                    </Button>
                    <Button
                        size="sm"
                        className="bg-[color:var(--color-danger)] text-white font-bold px-3 py-1.5 rounded-md hover:bg-[#a62214] transition-all"
                        onPress={onClose}
                    >
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    );
}
