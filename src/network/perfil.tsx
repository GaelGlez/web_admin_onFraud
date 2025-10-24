import axios from "axios";
import { Users } from "../lib/types/UsersDTO";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Obtiene el perfil del usuario autenticado.
 * Requiere que exista accessToken en localStorage.
 */
export async function getUserProfile(): Promise<Users> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  if (!token) {
    throw new Error("No hay token de autenticación. Inicia sesión.");
  }

  try {
    const response = await axios.get<Users>(`${BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err: any) {
    // Si el backend devuelve 401/403, lo propagamos para que el caller redirija al login
    const msg =
      err?.response?.data?.error ||
      err?.response?.statusText ||
      err?.message ||
      "Error al obtener el perfil";
    const e = new Error(msg) as Error & { status?: number };
    e.status = err?.response?.status;
    throw e;
  }
}
