export default function TaskModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Asignar Tarea</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título de la Tarea</label>
            <input type="text" className="w-full px-4 py-2 border rounded-lg mt-1" placeholder="Ej. Crear base de datos" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Asignar a (Usuario)</label>
            <select className="w-full px-4 py-2 border rounded-lg mt-1 bg-white">
              <option>Seleccione un usuario...</option>
              <option>Juan Pérez</option>
              <option>María López</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-bold">Cancelar</button>
            <button type="button" className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700">Guardar Tarea</button>
          </div>
        </form>
      </div>
    </div>
  );
}