"use client";
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
export default function ProjectList({ onAbrirModalProyecto, onAbrirModalTarea }) {
  const { user } = useContext(AuthContext);
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Proyectos Activos</h3>
      <ul className="space-y-4">
        <li className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition">
          <div>
            <h4 className="font-bold text-blue-700 text-lg">App Móvil Comunitaria</h4>
            <p className="text-sm text-gray-600 font-medium mt-1">Estado: <span className="text-green-600">En progreso</span></p>
          </div>

          {/*Solo el gerente ve estos botones */}
          {user?.role==='gerente' && (
          <div className="flex gap-2">
            <button 
              onClick={onAbrirModalTarea} 
              className="text-green-600 hover:bg-green-100 px-3 py-1 rounded font-semibold transition text-sm"
            >
              + Tarea
            </button>
            <button 
              onClick={onAbrirModalProyecto} 
              className="text-blue-600 hover:bg-blue-100 px-3 py-1 rounded font-semibold transition text-sm"
            >
              Editar
            </button>
            <button className="text-red-600 hover:bg-red-100 px-3 py-1 rounded font-semibold transition text-sm">
              Eliminar
            </button>
          </div>)}
        </li>
      </ul>
    </div>
  );
}