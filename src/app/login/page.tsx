"use client";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const loginFormSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

export default function LoginPage() {
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const { login } = useAuth();
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col border border-gray-100 shadow p-10 rounded-lg w-full max-w-md">
            <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginFormSchema}
            validateOnChange={true}
            onSubmit={async (values) => {
                setIsSigningIn(true);
                setLoginError(null); // reset error
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
                <Form className="flex flex-col gap-4">
                {loginError && (
                    <div className="text-red-700 text-sm bg-red-100 p-2 rounded">
                    {loginError}
                    </div>
                )}
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-black font-medium">Email</label>
                    <input
                    type="text"
                    name="email"
                    className={`border p-2 rounded ${errors.email && touched.email ? "border-red-500" : "border-gray-300"}`}
                    value={values.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => { void setFieldValue("email", e.target.value); }}
                    />
                    <p className="text-red-700 text-sm">{errors.email && touched.email && errors.email}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-black font-medium">Password</label>
                    <input
                    type="password"
                    name="password"
                    className={`border p-2 rounded ${errors.password && touched.password ? "border-red-500" : "border-gray-300"}`}
                    value={values.password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => { void setFieldValue("password", e.target.value); }}
                    />
                    <p className="text-red-700 text-sm">{errors.password && touched.password && errors.password}</p>
                </div>
                <button
                    type="submit"
                    disabled={isSigningIn}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    {isSigningIn ? "Signing in..." : "Login"}
                </button>
                </Form>
            )}
            </Formik>
        </div>
        </div>
    );
}