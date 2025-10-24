"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CustomInputField from "@/components/ui/customInputField";

const loginFormSchema = Yup.object().shape({
    email: Yup.string()
        .email("Correo inválido")
        .required("Email es obligatorio"),
    password: Yup.string()
        .min(9, "La contraseña debe tener al menos 9 caracteres")
        .required("Contraseña es obligatoria"),
});

export default function LoginPage() {
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const { login } = useAuth();
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            {/* Card */}
            <div className="flex flex-col items-center w-full max-w-md bg-white shadow-lg rounded-2xl p-10 gap-6">
                
                {/* Logo */}
                <img
                    src="/logo_onFraud_3x.png"
                    alt="OnFraud Logo"
                    className="w-32 h-auto mb-2"
                />

                {/* Title */}
                <h1 className="text-2xl font-bold text-[color:var(--color-primary)] mb-2">
                    Bienvenido a OnFraud
                </h1>
                <p className="text-gray-500 text-sm mb-4 text-center">
                    Ingresa tus credenciales para continuar
                </p>

                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={loginFormSchema}
                    validateOnChange
                    onSubmit={async (values) => {
                        setIsSigningIn(true);
                        setLoginError(null);
                        try {
                            await login(values.email, values.password);
                            router.push("/dashboard");
                        } catch (err: any) {
                            setLoginError(err.message || "Login failed");
                        } finally {
                            setIsSigningIn(false);
                        }
                    }}
                >
                    {({ errors, touched, values, setFieldValue }) => (
                        <Form className="flex flex-col gap-4 w-full">
                            {loginError && (
                                <div className="text-[color:var(--color-danger)] font-bold bg-red-100 px-3 py-2 rounded">
                                    {loginError}
                                </div>
                            )}

                            <CustomInputField
                                value={values.email}
                                onChange={(val) => setFieldValue("email", val)}
                                placeholder="Email"
                                type="email"
                                error={errors.email && touched.email ? errors.email : ""}
                                fullWidth
                            />

                            <CustomInputField
                                value={values.password}
                                onChange={(val) => setFieldValue("password", val)}
                                placeholder="Contraseña"
                                type="password"
                                error={errors.password && touched.password ? errors.password : ""}
                                fullWidth
                            />

                            <button
                                type="submit"
                                disabled={isSigningIn}
                                className={`mt-2 w-full py-3 rounded-xl text-white font-bold transition-all
                                    ${isSigningIn ? "bg-green-400 cursor-not-allowed" : "bg-[color:var(--color-primary)] hover:bg-[#05442c]"}`
                                }
                            >
                                {isSigningIn ? "Ingresando..." : "Login"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
