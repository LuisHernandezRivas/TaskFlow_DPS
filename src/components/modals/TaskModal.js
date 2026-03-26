"use client";
import { useEffect, useState } from "react";
import { getUsers } from "../../services/api";
export default function TaskModal({ onClose, onSave, selectedProject, currentUser, initialData }) {
  const [titulo, setTitulo] = useState("");
  const [prioridad, setPrioridad] = useState("Media");
  const [fechaLimite, setFechaLimite] = useState("");
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);



// DESPUÉS — líneas 14 a 39, llama a la API
useEffect(() => {
  async function fetchUsers() {
    try {
      const allUsers = await getUsers();
      const filtered = allUsers.filter((u) => u.role === "usuario");
      if (currentUser?.email) {
        const yaExiste = filtered.some((u) => u.email === currentUser.email);
        if (!yaExiste) {
          filtered.push({
            id: currentUser.id,
            nombre: currentUser.nombre || "Gerente",
            email: currentUser.email,
            role: currentUser.role,
          });
        }
      }
      setUsuarios(filtered);
    } catch {
      setUsuarios([]);
    } finally {
      setLoadingUsers(false);
    }
  }
  fetchUsers();
}, [currentUser]);

  useEffect(() => {
    if (!initialData) {
      setTitulo("");
      setPrioridad("Media");
      setFechaLimite("");
      setUsuariosSeleccionados([]);
      return;
    }

    setTitulo(initialData.titulo || "");
    setPrioridad(initialData.prioridad || "Media");
    setFechaLimite(initialData.fechaLimite || "");

    if (Array.isArray(initialData.assignedToEmails)) {
      setUsuariosSeleccionados(initialData.assignedToEmails);
      return;
    }

    if (initialData.assignedToEmail) {
      setUsuariosSeleccionados([initialData.assignedToEmail]);
      return;
    }

    setUsuariosSeleccionados([]);
  }, [initialData]);

  const handleSeleccionarTodos = () => {
    setUsuariosSeleccionados(usuarios.map((usuario) => usuario.email));
  };

  const handleQuitarTodos = () => {
    setUsuariosSeleccionados([]);
  };

  const handleToggleUsuario = (email) => {
    setUsuariosSeleccionados((prev) => {
      if (prev.includes(email)) {
        return prev.filter((item) => item !== email);
      }
      return [...prev, email];
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedProject) {
      alert("Selecciona un proyecto antes de asignar la tarea");
      return;
    }

    if (!titulo.trim()) {
      alert("El título de la tarea es obligatorio");
      return;
    }

    if (usuariosSeleccionados.length === 0) {
      alert("Selecciona al menos un usuario para asignar la tarea");
      return;
    }

    const usuariosAsignados = usuarios.filter((item) =>
      usuariosSeleccionados.includes(item.email)
    );

    onSave({
      titulo: titulo.trim(),
      estado: initialData?.estado || "Pendiente",
      prioridad,
      fechaLimite,
      projectId: selectedProject.id,
      projectName: selectedProject.nombre,
      assignedToEmails: usuariosAsignados.map((item) => item.email),
      assignedToNames: usuariosAsignados.map((item) => item.name),
    });

    onClose();
  };

 return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{initialData ? "Editar Tarea" : "Asignar Tarea"}</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Proyecto</label>
            <input type="text" value={selectedProject?.nombre || ""} disabled
              className="w-full px-4 py-2 border rounded-lg mt-1 bg-gray-100 text-gray-700" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Título de la Tarea</label>
            <input type="text" className="w-full px-4 py-2 border rounded-lg mt-1"
              placeholder="Ej. Crear base de datos" value={titulo}
              onChange={(e) => setTitulo(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Prioridad</label>
              <select className="w-full px-4 py-2 border rounded-lg mt-1 bg-white"
                value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha límite</label>
              <input type="date" className="w-full px-4 py-2 border rounded-lg mt-1"
                value={fechaLimite} onChange={(e) => setFechaLimite(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Asignar a (Usuario)</label>
            {loadingUsers ? (
              <p className="text-sm text-gray-500 mt-2">Cargando usuarios...</p>
            ) : (
              <>
                <div className="flex justify-end gap-2 mt-1">
                  <button type="button" onClick={handleSeleccionarTodos}
                    className="text-xs text-blue-600 font-semibold hover:underline">
                    Seleccionar todos
                  </button>
                  <button type="button" onClick={handleQuitarTodos}
                    className="text-xs text-gray-600 font-semibold hover:underline">
                    Quitar todos
                  </button>
                </div>
                <div className="max-h-36 overflow-y-auto border rounded-lg mt-1 p-2 bg-white space-y-2">
                  {usuarios.map((u) => (
                    <label key={u.email} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input type="checkbox"
                        checked={usuariosSeleccionados.includes(u.email)}
                        onChange={() => handleToggleUsuario(u.email)} />
                      <span>{u.nombre} <span className="text-gray-500">({u.role})</span></span>
                    </label>
                  ))}
                </div>
                {usuarios.length === 0 && (
                  <p className="text-sm text-red-600 mt-2">No hay usuarios registrados en el servidor.</p>
                )}
              </>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-bold">
              Cancelar
            </button>
            <button type="submit" disabled={usuarios.length === 0 || loadingUsers}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
              {initialData ? "Actualizar Tarea" : "Guardar Tarea"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}