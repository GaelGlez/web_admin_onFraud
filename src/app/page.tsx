"use client";
import axios from "axios";
import { Form, Formik, FormikHelpers, FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import { UserCreateDTO } from "../types/UserCreateDTO";
import { createUser, getUsers } from "../network/UserApi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const registerFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});
export default function Home() {
  const [savingUser, setSavingUser] = useState(false);
  const [users, setUsers] = useState<UserCreateDTO[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const router = useRouter();
  async function fetchUsers() {
    setLoadingUsers(true);
    const users = await getUsers();
    setUsers(users);
    setLoadingUsers(false);
  }
  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col border border-gray-100 shadow p-10 rounded-lg">
        <Formik
          validationSchema={registerFormSchema}
          validateOnChange={true}
          initialValues={{
            name: "",
            email: "",
            password: "",
            dsaoduas: "",
          }}
          onSubmit={async (values) => {
            setSavingUser(true);
            console.log(values);
            await createUser(values);
            setSavingUser(false);
            fetchUsers();
          }}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form>
              <div className="flex flex-col gap-2">
                <label htmlFor="username" className="text-black">
                  Username
                </label>
                <input
                  className={errors.name ? "border border-red-500" : ""}
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={(e) => {
                    setFieldValue("name", e.target.value);
                  }}
                ></input>
                <label htmlFor="email" className="text-black">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  className={errors.email ? "border !border-red-500" : ""}
                  value={values.email}
                  onChange={(e) => {
                    setFieldValue("email", e.target.value);
                  }}
                ></input>
                <p className="text-red-700 text-sm">{errors.email}</p>
                <label htmlFor="password" className="text-black">
                  Password
                </label>
                <input
                  className={errors.password ? "border border-red-500" : ""}
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={(e) => {
                    setFieldValue("password", e.target.value);
                  }}
                ></input>
                <p className="text-red-700 text-sm">{errors.password}</p>
              </div>
              <button
                type="submit"
                disabled={savingUser}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                {savingUser ? "Saving..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
      {loadingUsers && <p>Loading users...</p>}
      {!loadingUsers && (
        <table className="w-full max-w-2xl mt-10 border border-gray-300">
          <thead>
            <tr className="bg-gray-800">
              <td className="text-white bg-gray-800">Username</td>
              <td className="text-white bg-gray-800">Email</td>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              return (
                <tr key={index}>
                  <td className="text-black">{user.name}</td>
                  <td className="text-black">{user.email}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <button
        onClick={() => {
          router.push("/users");
        }}
      >
        Go to Users
      </button>
    </div>
  );
}