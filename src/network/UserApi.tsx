import axios from "axios";
import { UsersDTO, UpdateUserDTO } from "@/types/UsersDTO";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Obtener usuarios
export async function getUsers(): Promise<UsersDTO[]> {
    const response = await axios.get<UsersDTO[]>(`${BASE_URL}/admin/users`);
    return response.data;
}

export async function updateUser(id: String, data: UpdateUserDTO): Promise<UpdateUserDTO> {
    const response = await axios.put<UpdateUserDTO>(`${BASE_URL}/admin/users/${id}`, data);
    return response.data;
}

export async function deleteUser(id: String): Promise<void> {
    await axios.delete(`${BASE_URL}/admin/users/${id}`);
}