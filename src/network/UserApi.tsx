import axios from "axios";
import { UserCreateDTO } from "../types/UserCreateDTO";
import { LoginDTO } from "../types/LoginDTO";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Crear usuario
export async function createUser(user: UserCreateDTO): Promise<any> {
    const response = await axios.post(`${BASE_URL}/auth/register`, user);
    return response.data;
}

// Obtener usuarios
export async function getUsers(): Promise<UserCreateDTO[]> {
    const response = await axios.get<UserCreateDTO[]>(`${BASE_URL}/admin/users`);
    return response.data;
}

// ✅ Login de administrador (sin usar AxiosError)
export async function loginAdmin(loginDto: LoginDTO): Promise<{ access_token: string; refresh_token: string }> {
    try {
        const response = await axios.post<{ access_token: string; refresh_token: string }>(
        `${BASE_URL}/auth/admin/login`,
        { email: loginDto.email, password: loginDto.password },
        { withCredentials: true }
        );
        return response.data;
    } catch (error: any) {
        // Manejo básico sin AxiosError
        const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Error en el inicio de sesión";
        throw new Error(errorMessage);
    }
}
