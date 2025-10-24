"use client";

import { useEffect, useState, useMemo } from "react";
import { useProfileApi } from "@/network/ProfileApi";
import { ProfileDTO, UpdateUserDTO, UpdatePasswordDTO } from "@/types/ProfileDTO";
import CustomInputField from "@/components/ui/customInputField";
import { Button } from "@nextui-org/react";

export default function PerfilPage() {
  const { getProfile, updateUser, updatePassword } = useProfileApi();

  // Estado del perfil
  const [profile, setProfile] = useState<ProfileDTO | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Estado del formulario de datos
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [userError, setUserError] = useState("");

  // Estado de contraseña
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Loading botones
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  // Cargar perfil al inicio
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setFullName(data.full_name);
        setEmail(data.email);
      } catch (err) {
        console.error(err);
        setUserError("No se pudo cargar el perfil");
      } finally {
        setLoadingProfile(false);
      }
    };
    loadProfile();
  }, [getProfile]);

  // Detectar cambios en datos
  const isUserDirty = useMemo(() => {
    return profile ? fullName !== profile.full_name || email !== profile.email : false;
  }, [fullName, email, profile]);

  // Detectar cambios en contraseña
  const isPasswordDirty = useMemo(() => oldPassword && newPassword, [oldPassword, newPassword]);

  // Guardar cambios de usuario
  const handleSaveUser = async () => {
    setUserError("");
    if (!fullName.trim() || !email.trim()) {
      setUserError("Nombre y correo son obligatorios");
      return;
    }
    setLoadingUser(true);
    try {
      const updateData: UpdateUserDTO = { full_name: fullName, email };
      const updatedProfile = await updateUser(updateData);
      setProfile(updatedProfile);
    } catch (err: any) {
      setUserError(err.response?.data?.error || "Error al actualizar datos");
    } finally {
      setLoadingUser(false);
    }
  };

  // Cambiar contraseña
  const handleChangePassword = async () => {
    setPassError("");
    setPasswordSuccess(false);
    if (!oldPassword || !newPassword) {
      setPassError("Ambos campos son obligatorios");
      return;
    }
    setLoadingPass(true);
    try {
      await updatePassword({ oldPassword, newPassword } as UpdatePasswordDTO);
      setOldPassword("");
      setNewPassword("");
      setPasswordSuccess(true);
    } catch (err: any) {
      setPassError(err.response?.data?.error || "Error al cambiar contraseña");
    } finally {
      setLoadingPass(false);
    }
  };

  if (loadingProfile) return <p>Cargando perfil...</p>;

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-[color:var(--color-primary)]">
        Perfil
      </h1>

      {/* Sección de datos */}
      <section className="bg-white p-6 rounded-2xl shadow-md mb-8 max-w-lg">
        <h2 className="text-lg font-semibold mb-4">Información personal</h2>
        <div className="space-y-4">
          <CustomInputField
            value={fullName}
            onChange={setFullName}
            placeholder="Nombre completo"
          />
          <CustomInputField
            value={email}
            onChange={setEmail}
            placeholder="Correo electrónico"
            type="email"
          />
          {userError && <p className="text-[color:var(--color-danger)] font-bold">{userError}</p>}
          <div className="flex justify-end">
            <Button
              size="sm"
              className={`font-bold px-4 py-2 rounded-md transition-all ${
                !isUserDirty || loadingUser
                  ? "bg-green-100 text-gray-400 cursor-not-allowed"
                  : "bg-[color:var(--color-primary)] text-white hover:bg-[#05442c]"
              }`}
              onPress={handleSaveUser}
              isDisabled={!isUserDirty || loadingUser}
            >
              Guardar cambios
            </Button>
          </div>
        </div>
      </section>

      {/* Sección de contraseña */}
      <section className="bg-white p-6 rounded-2xl shadow-md max-w-lg">
        <h2 className="text-lg font-semibold mb-4">Cambiar contraseña</h2>
        <div className="space-y-4">
          <CustomInputField
            value={oldPassword}
            onChange={setOldPassword}
            placeholder="Contraseña actual"
            type="password"
          />
          <CustomInputField
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Nueva contraseña"
            type="password"
          />
          {passError && <p className="text-[color:var(--color-danger)] font-bold">{passError}</p>}
          {passwordSuccess && <p className="text-green-600 font-bold">Contraseña actualizada</p>}
          <div className="flex justify-end">
            <Button
              size="sm"
              className={`font-bold px-4 py-2 rounded-md transition-all ${
                !isPasswordDirty || loadingPass
                  ? "bg-green-100 text-gray-400 cursor-not-allowed"
                  : "bg-[color:var(--color-primary)] text-white hover:bg-[#05442c]"
              }`}
              onPress={handleChangePassword}
              isDisabled={!isPasswordDirty || loadingPass}
            >
              Cambiar contraseña
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
