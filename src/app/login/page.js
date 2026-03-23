"use client";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import InputField from "../../components/auth/InputField";
import { getUserByEmail } from "../../services/api";
 
export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const router = useRouter();
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 
  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Por favor ingresa correo y contraseña.");
      return;
    }
    setLoading(true);
    try {
      const userFound = await getUserByEmail(email.trim());
      if (!userFound || userFound.password !== password) {
        setError("Usuario o contraseña incorrectos.");
        return;
      }
      login(userFound);
      router.push("/dashboard");
    } catch {
      setError("No se pudo conectar con el servidor. ¿Está corriendo json-server?");
    } finally {
      setLoading(false);
    }
  };
 
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">TaskFlow</h2>
        <p className="text-center text-gray-500 mb-6">Bienvenido de nuevo</p>
 
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}
 
        <div className="space-y-5" onKeyDown={handleKeyDown}>
          <InputField
            label="Correo Electrónico"
            type="email"
            placeholder="correo@dominio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
 
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full block text-center bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2 px-4 rounded-lg transition duration-200 mt-4"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </div>
 
        <p className="text-sm text-center text-gray-600 mt-6">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-blue-600 hover:underline font-semibold">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}