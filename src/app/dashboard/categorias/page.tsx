"use client";

import { useEffect, useState } from "react";
import { Categories, CategoriesDTO } from "@/types/CategoriesDTO";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/network/CategoriesApi";
import CategoriesCard from "@/components/categories/categoriesCard";

export default function CategoriasPage() {
    const [categories, setCategories] = useState<Categories[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async (category: CategoriesDTO) => {
        const newCategory = await createCategory(category);
        setCategories((prev) => [...prev, newCategory]);
    };

    const handleUpdate = async (id: number, category: CategoriesDTO) => {
        const updatedCategory = await updateCategory(id, category);
        setCategories((prev) => prev.map((c) => (c.id === id ? updatedCategory : c)));
    };

    const handleDelete = async (id: number) => {
        await deleteCategory(id);
        setCategories((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <main className="min-h-screen p-8 bg-gray-50">
            <h1 className="text-3xl font-bold mb-8 text-[color:var(--color-primary)]">
                Control de Categorías
            </h1>
            <CategoriesCard
                categories={categories}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
            />
        </main>
    );
}
