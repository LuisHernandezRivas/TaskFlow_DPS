import Link from 'next/link';
import InputField from '../../components/auth/InputField';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">TaskFlow</h2>
        <p className="text-center text-gray-500 mb-6">Crea tu cuenta para empezar</p>

        <form className="space-y-4">
          
          {/* Utilizamos el componente InputField */}
          <InputField label="Nombre Completo" type="text" placeholder="Juan Pérez" />
          <InputField label="Correo Electrónico" type="email" placeholder="correo@dominio.com" />
          <InputField label="Contraseña" type="password" placeholder="••••••••" />

          {/* Seleccionamos el rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol en el sistema</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-900 cursor-pointer">
              <option value="usuario">Usuario (Ver proyectos y tareas)</option>
              <option value="gerente">Gerente (Crear y asignar)</option>
            </select>
          </div>

          {/* Creamos el botón de registro */}
          <button 
            type="button" 
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 mt-6"
          >
            Registrarse
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