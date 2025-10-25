import axios from "axios";
import { ProfileDTO, UpdatePasswordDTO, UpdateUserDTO } from "@/types/ProfileDTO";
import { useAuth } from "@/context/AuthContext";
import { useMemo } from "react";
import { useRef, useEffect } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type FailedQueueItem = {
    resolve: (token: string) => void;
    reject: (error: any) => void;
};

export function useProfileApi() {
    const { accessToken, refreshTokenFunc } = useAuth();
    const accessTokenRef = useRef(accessToken);

    useEffect(() => {
        accessTokenRef.current = accessToken;
    }, [accessToken]);

    const axiosInstance = useMemo(() => {
        const instance = axios.create({ baseURL: `${BASE_URL}/users` });
        let isRefreshing = false;
        let failedQueue: FailedQueueItem[] = [];

        const processQueue = (error: any, token: string | null = null) => {
        failedQueue.forEach(prom => {
            if (error) {
            prom.reject(error);
            } else if (token) {
            prom.resolve(token);
            }
        });
        failedQueue = [];
        };

        // Interceptor request: usar siempre el token más reciente
        instance.interceptors.request.use(config => {
            const token = accessTokenRef.current; // useRef actualizado siempre
            if (token) {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${token}`,
                };
            }
            return config;
        });


        // Interceptor response: refrescar token si es 401
        instance.interceptors.response.use(
        response => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && refreshTokenFunc) {
            if (isRefreshing) {
                return new Promise<string>((resolve, reject) => {
                failedQueue.push({ resolve, reject });
                }).then(token => {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                return instance(originalRequest);
                });
            }

            isRefreshing = true;

            try {
            const newToken = await refreshTokenFunc();

            if (!newToken) {
                // Si no se pudo refrescar, hacemos logout, ya se hizo en refreshTokenFunc
                return Promise.reject(new Error("No se pudo refrescar el token, inicia sesión de nuevo"));
            }

                originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                processQueue(null, newToken);
                return instance(originalRequest);
            } catch (err) {
                processQueue(err, null);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
            }

            return Promise.reject(error);
        }
        );

        return instance;
    }, [refreshTokenFunc, accessToken]); // accessToken incluido para asegurar request interceptor

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
            try {
            // Usamos axios "directo", sin interceptores
            const { data } = await axios.put<{ success: boolean }>(
                `${BASE_URL}/users/password`,
                passwordDto,
                {
                headers: {
                    Authorization: `Bearer ${accessTokenRef.current}`,
                },
                }
            );
            return data;
            } catch (err: any) {
            if (err.response?.status === 401) {
                throw new Error("La contraseña actual es incorrecta");
            }
            throw err;
            }
        },
        [accessTokenRef]
    );

    return { getProfile, updateUser, updatePassword };
}
