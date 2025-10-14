"use client";

import axios from "axios";
import {
    createContext,
    use,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

type Tokens = { accessToken: string; refreshToken: string };

type AuthContextType = {
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshTokenFunc: () => Promise<void>;
    setTokens: (tokens: Tokens) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    /*
    Pueden guardar aqui el usuario
    */

    useEffect(() => {
        if (typeof window === "undefined") return;
        const accesTokenFromStorage = localStorage.getItem("accessToken");
        const refreshTokenFromStorage = localStorage.getItem("refreshToken");
        if (accesTokenFromStorage && refreshTokenFromStorage) {
        setAccessToken(accesTokenFromStorage);
        setRefreshToken(refreshTokenFromStorage);
        }
    }, []);
    const setTokens = useCallback((tokens: Tokens) => {
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
    }, []);

    const clearTokens = useCallback(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAccessToken(null);
        setRefreshToken(null);
    }, []);

    const login = useCallback(
        async (email: string, password: string) => {
            try {
            const response = await axios.post("http://localhost:4000/auth/admin/login", {
                email,
                password,
            });

            // ✅ Verificar si el backend devolvió error
            const data = response.data as { error?: string; access_token?: string; refresh_token?: string };
            if (data.error) {
                throw new Error(data.error);
            }

            const tokens: Tokens = {
                accessToken: data.access_token!,
                refreshToken: data.refresh_token!,
            };

            setTokens(tokens);
            } catch (err: any) {
            throw new Error(err.response?.data?.error || err.message || "Login failed");
            }
        },
        [setTokens]
    );

    const logout = useCallback(() => {
        clearTokens();
    }, [clearTokens]);

    const refreshTokenFunc = useCallback(async () => {
        if (!refreshToken) return;
        try {
        const response = await axios.post("http://localhost:3000/auth/refresh-token", {
            token: refreshToken,
        });
        if (response.status !== 200) {
            logout();
            return;
        }
        const tokens: Tokens = response.data as Tokens;
        setTokens(tokens);
        } catch (error) {
        console.error(error);
        clearTokens();
        }
    }, [refreshToken, clearTokens]);
    const value = useMemo<AuthContextType>(
        () => ({
        accessToken,
        refreshToken,
        isAuthenticated: accessToken !== null,
        login,
        logout,
        refreshTokenFunc,
        setTokens,
        }),
        [accessToken, refreshToken, login, logout, refreshTokenFunc, setTokens]
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    }

    export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}