"use client";
import "primeicons/primeicons.css";

export default function TaskList({ tasks, user, onUpdateTaskStatus, onEditTask }) {
  //función para manejar el cambio de estado de la tarea
  const handleStatusChange = (e, taskId) => {
    const nuevoEstado = e.target.value;
    onUpdateTaskStatus(taskId, nuevoEstado);
  };

  const isAssignedToUser = (task) => {
    if (Array.isArray(task.assignedToEmails)) {
      return task.assignedToEmails.includes(user?.email);
    }
    return task.assignedToEmail === user?.email;
  };

  const myTasks = tasks.filter((task) => isAssignedToUser(task));
  const teamTasks = tasks;

  const priorityStyles = {
    Alta: "bg-red-100 text-red-700",
    Media: "bg-amber-100 text-amber-700",
    Baja: "bg-green-100 text-green-700",
  };

  const isOverdue = (task) => {
    if (!task.fechaLimite || task.estado === "Completado") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(`${task.fechaLimite}T00:00:00`);
    return due < today;
  };

  const renderTaskItem = (task) => (
    <li key={task.id} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-bold text-gray-800 text-lg">{task.titulo}</h4>
        {user?.role === "gerente" && (
          <button
            type="button"
            onClick={() => onEditTask?.(task.id)}
            className="text-sm border border-blue-200 bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-md hover:bg-blue-100 font-semibold flex items-center justify-center"
            title="Editar tarea"
            aria-label="Editar tarea"
          >
            <i className="pi pi-pencil"></i>
          </button>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-1 mt-1 font-medium">Proyecto: <span className="text-gray-800">{task.projectName}</span></p>
      <p className="text-sm text-gray-600 mb-3 font-medium">
        Asignado a: <span className="text-gray-800">
          {Array.isArray(task.assignedToNames)
            ? task.assignedToNames.join(", ")
            : task.assignedToName}
        </span>
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${priorityStyles[task.prioridad || "Media"]}`}>
          Prioridad: {task.prioridad || "Media"}
        </span>
        <span className="text-xs px-2 py-1 rounded-full font-semibold bg-gray-100 text-gray-700">
          Fecha límite: {task.fechaLimite || "Sin fecha"}
        </span>
        {isOverdue(task) && (
          <span className="text-xs px-2 py-1 rounded-full font-semibold bg-red-100 text-red-700">
            Vencida
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-bold text-gray-700">Estado:</label>
        <select
          onChange={(e) => handleStatusChange(e, task.id)}
          value={task.estado}
          className="text-sm border border-gray-300 p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
        >
          <option value="Pendiente">Pendiente</option>
          <option value="En progreso">En progreso</option>
          <option value="Completado">Completado</option>
        </select>
      </div>
    </li>
  );

  if (user?.role === "gerente") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Mis Tareas Asignadas</h3>
          <ul className="space-y-4">
            {myTasks.length === 0 ? (
              <li className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-600">
                No tienes tareas asignadas.
              </li>
            ) : (
              myTasks.map((task) => renderTaskItem(task))
            )}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Tareas del Equipo</h3>
          <ul className="space-y-4">
            {teamTasks.length === 0 ? (
              <li className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-600">
                No hay tareas registradas.
              </li>
            ) : (
              teamTasks.map((task) => renderTaskItem(task))
            )}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Mis Tareas Asignadas</h3>
      <ul className="space-y-4">
        {myTasks.length === 0 ? (
          <li className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-600">
            No hay tareas asignadas.
          </li>
        ) : (
          myTasks.map((task) => renderTaskItem(task))
        )}
      </ul>
    </div>
  );
}