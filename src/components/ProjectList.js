"use client";
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function ProjectList({ projects, onAbrirModalProyecto, onAbrirModalTarea, onEliminarProyecto }) {
  const { user } = useContext(AuthContext);

  const statusColor = {
    Completado: "text-green-600",
    "En progreso": "text-orange-500",
    Pendiente: "text-red-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Proyectos Activos</h3>
      <ul className="space-y-4">
        {projects.length === 0 ? (
          <li className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-600">
            No hay proyectos registrados.
          </li>
        ) : (
          projects.map((project) => (
            <li key={project.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition">
              <div>
                <h4 className="font-bold text-blue-700 text-lg">{project.nombre}</h4>
                <p className="text-sm text-gray-600 font-medium mt-1">
                  Estado: <span className={statusColor[project.estado] || "text-gray-600"}>{project.estado}</span>
                </p>
              </div>

              {/*Solo el gerente ve estos botones */}
              {user?.role === 'gerente' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onAbrirModalTarea(project.id)}
                    className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 px-3 py-1.5 rounded-lg font-semibold transition duration-200 text-sm shadow-sm"
                  >
                    + Tarea
                  </button>
                  <button
                    onClick={() => onAbrirModalProyecto(project.id)}
                    className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-semibold transition duration-200 text-sm shadow-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onEliminarProyecto(project.id)}
                    className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 px-3 py-1.5 rounded-lg font-semibold transition duration-200 text-sm shadow-sm"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}