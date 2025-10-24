import axios from "axios";
import { Categories, CategoriesDTO,  } from "../types/CategoriesDTO";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCategories(): Promise<Categories[]> {
    const response = await axios.get<Categories[]>(`${BASE_URL}/admin/categories`);
    return response.data;
}

export async function createCategory(category: CategoriesDTO): Promise<Categories> {
    const response = await axios.post<Categories>(`${BASE_URL}/admin/categories`, category);
    return response.data;
}

export async function updateCategory(categoryId: number, category: CategoriesDTO): Promise<Categories> {
    const response = await axios.put<Categories>(`${BASE_URL}/admin/categories/${categoryId}`, category);
    return response.data;
}

export async function deleteCategory(categoryId: number) {
    const response = await axios.delete(`${BASE_URL}/admin/categories/${categoryId}`);
    return response.data;
}