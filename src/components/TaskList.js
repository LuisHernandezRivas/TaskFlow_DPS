export default function TaskList() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Mis Tareas Asignadas</h3>
      <ul className="space-y-4">
        <li className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm">
          <h4 className="font-bold text-gray-800 text-lg">Diseñar Mockups Figma</h4>
          <p className="text-sm text-gray-600 mb-3 mt-1 font-medium">Proyecto: <span className="text-gray-800">App Móvil Comunitaria</span></p>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-gray-700">Estado:</label>
            <select className="text-sm border border-gray-300 p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer">
              <option>Pendiente</option>
              <option>En Progreso</option>
              <option>Completado</option>
            </select>
          </div>
        </li>
      </ul>
    </div>
  );
}