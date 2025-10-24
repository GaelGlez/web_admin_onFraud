"use client";

import { useState, useMemo } from "react";
import { Button } from "@nextui-org/react";
import CustomInputField from "../ui/customInputField";
import { CategoriesDTO } from "@/types/CategoriesDTO";

interface NewCategoryModalProps {
    open: boolean;
    onClose: () => void;
    onCreate: (data: CategoriesDTO) => Promise<void>;
}

export default function NewCategoryModal({ open, onClose, onCreate }: NewCategoryModalProps) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Saber si el input tiene algo
    const isDirty = useMemo(() => name.trim() !== "", [name]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError("El nombre es obligatorio");
            return;
        }

        setLoading(true);
        try {
            await onCreate({ name });
            setName(""); // limpiar input
            onClose();
        } catch (err) {
            console.error(err);
            setError("Ocurrió un error al crear la categoría");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative z-[10000] bg-white p-6 rounded-xl shadow-lg max-w-md w-full space-y-4">
                <h2 className="text-lg font-semibold text-[color:var(--color-primary)]">Nueva categoría</h2>

                <CustomInputField
                    value={name}
                    onChange={setName}
                    placeholder="Nombre de la categoría"
                    error={error}
                />

                <div className="flex justify-end gap-3 mt-4">
                    <Button
                        size="sm"
                        className={`font-bold px-3 py-1.5 rounded-md transition-all ${
                            loading || !isDirty
                                ? "bg-green-100 text-gray-400 cursor-not-allowed"
                                : "bg-[color:var(--color-primary)] text-white hover:bg-[#05442c]"
                        }`}
                        onPress={handleSubmit}
                        isDisabled={loading || !isDirty} // desactivado si no hay texto
                    >
                        Crear
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
