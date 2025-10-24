"use client";

import { useState } from "react";
import { Categories, CategoriesDTO } from "@/types/CategoriesDTO";
import { Button } from "@nextui-org/react";
import EditCategoryModal from "./editCategoryModal";
import NewCategoryModal from "./newCategoryModal"; // importamos modal de creación
import ConfirmModal from "../ui/confirmModal";

interface CategoriesCardsProps {
    readonly categories: readonly Categories[];
    readonly onCreate: (data: CategoriesDTO) => Promise<void>;
    readonly onUpdate: (id: number, data: CategoriesDTO) => Promise<void>;
    readonly onDelete: (id: number) => Promise<void>;
}

export default function CategoriesCards({ categories, onCreate, onUpdate, onDelete }: CategoriesCardsProps) {
    const [selectedCategory, setSelectedCategory] = useState<Categories | null>(null);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false); // nuevo modal
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-700">Categorías</h2>
                <Button
                    size="sm"
                    className="bg-[color:var(--color-primary)] text-white font-bold px-3 py-1.5 rounded-md hover:bg-[#05442c] transition-all"
                    onPress={() => setIsNewModalOpen(true)} // abrir modal de creación
                >
                    Nueva categoría
                </Button>
            </div>

            {/* Grid de cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.length > 0 ? (
                    categories.map((c) => (
                        <div
                            key={c.id}
                            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                        >
                            <div>
                                <p className="text-gray-400 text-sm">ID: #{c.id}</p>
                                <h3 className="text-gray-800 font-semibold text-lg mt-1">{c.name}</h3>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <Button
                                    size="sm"
                                    className="bg-blue-600 text-white font-bold px-3 py-1.5 rounded-md hover:bg-[#1a4088] transition-all"
                                    onPress={() => setSelectedCategory(c)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-[color:var(--color-danger)] text-white font-bold px-3 py-1.5 rounded-md hover:bg-[#a62214] transition-all"
                                    onPress={() => setConfirmDeleteId(c.id)}
                                >
                                    Eliminar
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="col-span-full py-6 text-center text-gray-400">
                        No se encontraron categorías.
                    </p>
                )}
            </div>

            {/* Modal de edición */}
            <EditCategoryModal
                open={selectedCategory !== null}
                category={selectedCategory}
                onClose={() => setSelectedCategory(null)}
                onSave={(data) =>
                    selectedCategory ? onUpdate(selectedCategory.id, data) : Promise.resolve()
                }
            />

            {/* Modal de creación */}
            <NewCategoryModal
                open={isNewModalOpen}
                onClose={() => setIsNewModalOpen(false)}
                onCreate={onCreate}
            />

            {/* Confirmar eliminar */}
            <ConfirmModal
                open={!!confirmDeleteId}
                title="Eliminar categoría"
                message="¿Estás seguro de eliminar esta categoría?"
                buttonText1="Eliminar"
                buttonText2="Cancelar"
                onClose={() => setConfirmDeleteId(null)}
                onConfirm={async () => {
                    if (confirmDeleteId) {
                        try {
                            await onDelete(confirmDeleteId);
                            setConfirmDeleteId(null);
                        } catch (error: any) {
                            console.error("Error al eliminar categoría:", error);
                            alert(
                                error?.message ||
                                "No se puede eliminar esta categoría porque tiene reportes asociados."
                            );
                        }
                    }
                }}
            />
        </div>
    );
}
