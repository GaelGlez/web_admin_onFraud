import axios from "axios";
import { ProfileDTO, UpdatePasswordDTO, UpdateUserDTO } from "@/types/ProfileDTO";
import { useAuth } from "@/context/AuthContext";
import { useMemo } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function useProfileApi() {
    const { accessToken, refreshTokenFunc } = useAuth();

    const axiosInstance = useMemo(() => {
        const instance = axios.create({ baseURL: `${BASE_URL}/users` });

        // Interceptor request: usar siempre el token más reciente
        instance.interceptors.request.use((config) => {
        if (accessToken) {
            config.headers = {
            ...config.headers,
            Authorization: `Bearer ${accessToken}`,
            };
        }
        return config;
        });

        // Interceptor response: refrescar token si es 401
        instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response?.status === 401 && refreshTokenFunc) {
            const newAccessToken = await refreshTokenFunc();
            if (newAccessToken) {
                error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return axios.request(error.config);
            }
            }
            return Promise.reject(error);
        }
        );

        return instance;
    }, [accessToken, refreshTokenFunc]);

    const getProfile = useMemo(
        () => async (): Promise<ProfileDTO> => {
        const { data } = await axiosInstance.get<{ profile: ProfileDTO }>("/profile");
        return data.profile;
        },
        [axiosInstance]
    );

    const updateUser = useMemo(
        () => async (updateDto: UpdateUserDTO): Promise<ProfileDTO> => {
        const { data } = await axiosInstance.put<ProfileDTO>("/", updateDto);
        return data;
        },
        [axiosInstance]
    );

    const updatePassword = useMemo(
        () => async (passwordDto: UpdatePasswordDTO): Promise<{ success: boolean }> => {
        const { data } = await axiosInstance.put<{ success: boolean }>("/password", passwordDto);
        return data;
        },
        [axiosInstance]
    );

    return { getProfile, updateUser, updatePassword };
}
