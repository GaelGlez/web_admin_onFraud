"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface CustomInputFieldProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    type?: "text" | "email" | "password";
    error?: string;
    fullWidth?: boolean;
}

export default function CustomInputField({
    value,
    onChange,
    placeholder,
    type = "text",
    error,
    fullWidth = true,
}: CustomInputFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className={`relative w-full ${fullWidth ? "w-full" : ""}`}>
            {/* Input con borde verde en focus */}
            <input
                type={inputType}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder=" "
                className={`peer w-full rounded-xl border border-gray-300 bg-white px-4 pt-6 pb-2 text-sm text-gray-900 placeholder-transparent
                            focus:border-[color:var(--color-primary)] focus:ring-2 focus:ring-[color:var(--color-primary)] outline-none transition-all`}
            />

            {/* Label flotante */}
            <label
                className={`absolute left-4 text-gray-400 text-sm transition-all
                            peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400
                            peer-focus:top-2 peer-focus:text-[color:var(--color-primary)]
                            ${value ? "top-2 text-[color:var(--color-primary)]" : ""}`}
            >
                {placeholder}
            </label>

            {/* Ojo para password */}
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[color:var(--color-primary)]"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            )}

            {/* Error */}
            {error && (
                <p className="mt-2 text-sm text-[color:var(--color-danger)] font-bold">
                    {error}
                </p>
            )}
        </div>
    );
}
