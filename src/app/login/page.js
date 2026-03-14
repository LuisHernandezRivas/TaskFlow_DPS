import Link from 'next/link';
import InputField from '../../components/auth/InputField';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">TaskFlow</h2>
        <p className="text-center text-gray-500 mb-6">Bienvenido de nuevo</p>

        <form className="space-y-5">
          
          {/* Utilizamos el componente InputField */}
          <InputField label="Correo Electrónico" type="email" placeholder="correo@dominio.com" />
          <InputField label="Contraseña" type="password" placeholder="••••••••" />

          <Link 
            href="/dashboard"
            className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 mt-4"
          >
            Iniciar Sesión
          </Link>
        </form>

        {/* Creamos eel enlace para registrarse */}
        <p className="text-sm text-center text-gray-600 mt-6">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="text-blue-600 hover:underline font-semibold">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}