"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "../../network/UserApi";

// Esquema de validación con Yup
const loginFormSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col border border-gray-100 shadow p-10 rounded-lg w-[350px]">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Admin Login</h1>

        <Formik
          validationSchema={loginFormSchema}
          validateOnChange={true}
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={async (values) => {
            setLoading(true);
            setErrorMsg(null);

            // 🔒 limpiar tokens previos
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");

            try {
                const data = await loginAdmin(values);

                // Si no viene access_token, algo falló
                if (!data?.access_token) {
                throw new Error("Credenciales inválidas");
                }

                // Guardar token localmente
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("refresh_token", data.refresh_token);

                router.push("/dashboard");
            } catch (err: any) {
                setErrorMsg(err.message || "Login failed");
            } finally {
                setLoading(false);
            }
            }}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form>
              <div className="flex flex-col gap-3">
                <label htmlFor="email" className="text-black">Email</label>
                <input
                  type="text"
                  name="email"
                  className={`border p-2 rounded ${
                    errors.email && touched.email ? "border-red-500" : "border-gray-300"
                  }`}
                  value={values.email}
                  onChange={(e) => setFieldValue("email", e.target.value)}
                />
                {errors.email && touched.email && (
                  <p className="text-red-700 text-sm">{errors.email}</p>
                )}

                <label htmlFor="password" className="text-black">Password</label>
                <input
                  type="password"
                  name="password"
                  className={`border p-2 rounded ${
                    errors.password && touched.password ? "border-red-500" : "border-gray-300"
                  }`}
                  value={values.password}
                  onChange={(e) => setFieldValue("password", e.target.value)}
                />
                {errors.password && touched.password && (
                  <p className="text-red-700 text-sm">{errors.password}</p>
                )}
              </div>

              {errorMsg && (
                <p className="text-red-700 text-sm mt-3 text-center">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 bg-blue-500 text-white px-4 py-2 rounded w-full"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
