"use client";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const userName = user?.nombre || "Usuario";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-wide">TaskFlow</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Hola, {userName}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-bold transition duration-200"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}