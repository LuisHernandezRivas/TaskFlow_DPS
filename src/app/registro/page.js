"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import InputField from '../../components/auth/InputField';
import { getUserByEmail, createUser } from "../../services/api";

export default function RegisterPage() {
  {/* Creamos los estados para los campos del formulario */}
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("usuario");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleRegister = async () => {
  setError("");
  if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
    setError("Por favor, llena todos los campos antes de registrarte.");
    return;
  }
  const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!regexLetras.test(name)) {
    setError("El nombre no es válido. Solo se permiten letras y espacios.");
    return;
  }
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexCorreo.test(email)) {
    setError("Por favor, ingresa un correo electrónico válido.");
    return;
  }
  if (password.length < 4) {
    setError("La contraseña debe tener al menos 4 caracteres.");
    return;
  }
  setLoading(true);
  try {
    const existing = await getUserByEmail(email.trim());
    if (existing) {
      setError("Este correo ya está registrado. Intenta con otro o inicia sesión.");
      return;
    }
    await createUser({ nombre: name.trim(), email: email.trim(), password, role });
    router.push("/login");
  } catch {
    setError("No se pudo conectar con el servidor. ¿Está corriendo json-server?");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">TaskFlow</h2>
        <p className="text-center text-gray-500 mb-6">Crea tu cuenta para empezar</p>
        {error && (
  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
    {error}
  </div>
)}
        <form className="space-y-4">
          
          {/* Agregamos los campos de entrada para el nombre, correo y contraseña */}
          <InputField 
            label="Nombre Completo" 
            type="text" 
            placeholder="Juan Pérez" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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

          {/* Seleccionamos el rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol en el sistema</label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-900 cursor-pointer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="usuario">Usuario (Ver proyectos y tareas)</option>
              <option value="gerente">Gerente (Crear y asignar)</option>
            </select>
          </div>

          {/* Creamos el botón de registro */}
        <button
          type="button"
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-bold py-2 px-4 rounded-lg transition duration-200 mt-6">
          {loading ? "Registrando..." : "Registrarse"}
        </button>
        </form>

        {/* Creamos el enlace para iniciar sesión */}
        <p className="text-sm text-center text-gray-600 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-semibold">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
