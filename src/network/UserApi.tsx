import axios from "axios";
import { Users } from "../types/UsersDTO";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Obtener usuarios
export async function getUsers(): Promise<Users[]> {
    const response = await axios.get<Users[]>(`${BASE_URL}/admin/users`);
    return response.data;
}
