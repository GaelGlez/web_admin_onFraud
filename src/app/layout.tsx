import type { Metadata } from "next";
import "./globals.css"; // Importa tu hoja global personalizada
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "onFraud Admin",
  description: "Panel administrativo de onFraud",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-[var(--color-bg)] text-[var(--color-text)] font-['Roboto',sans-serif]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
