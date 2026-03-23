"use client";
import { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

import Navbar from "../../components/Navbar";
import ProgressBar from "../../components/ProgressBar";
import ProjectList from "../../components/ProjectList";
import TaskList from "../../components/TaskList";
import ProjectModal from "../../components/modals/ProjectModal";
import TaskModal from "../../components/modals/TaskModal";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  deleteTasksByProject,
  getTasks,
  createTask,
  updateTask,
} from "../../services/api";

export default function DashboardPage() {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [selectedProjectForTask, setSelectedProjectForTask] = useState(null);
  const [projectSearch, setProjectSearch] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState("Todos");
  const [taskSearch, setTaskSearch] = useState("");
  const [taskStatusFilter, setTaskStatusFilter] = useState("Todos");
  const [taskPriorityFilter, setTaskPriorityFilter] = useState("Todas");
  const [apiError, setApiError] = useState("");

  const { user } = useContext(AuthContext);
  const router = useRouter();

  // Proteger ruta
  useEffect(() => {
    const session = sessionStorage.getItem("session");
    if (!user && !session) {
      router.push("/login");
    }
  }, [user, router]);

  // Cargar datos desde la API al montar
  useEffect(() => {
    async function loadData() {
      try {
        const [proj, task] = await Promise.all([getProjects(), getTasks()]);
        setProjects(proj);
        setTasks(task);
        setApiError("");
      } catch {
        setApiError("No se pudo conectar con el servidor. Verifica que json-server esté corriendo en el puerto 3001.");
      }
    }
    loadData();
  }, []);

  // ── Proyectos ─────────────────────────────────

  const openCreateProjectModal = () => {
    setProjectToEdit(null);
    setShowProjectModal(true);
  };

  const openEditProjectModal = (projectId) => {
    const found = projects.find((p) => p.id === projectId);
    if (!found) return;
    setProjectToEdit(found);
    setShowProjectModal(true);
  };

  const handleSaveProject = async (projectData) => {
    const { estado, ...dataWithoutStatus } = projectData;
    try {
      if (projectToEdit) {
        const updated = await updateProject(projectToEdit.id, dataWithoutStatus);
        setProjects((prev) =>
          prev.map((p) => (p.id === projectToEdit.id ? { ...p, ...updated } : p))
        );
      } else {
        const created = await createProject(dataWithoutStatus);
        setProjects((prev) => [...prev, created]);
      }
    } catch {
      alert("Error al guardar el proyecto. Verifica la conexión con el servidor.");
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteTasksByProject(projectId);
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      setTasks((prev) => prev.filter((t) => t.projectId !== projectId));
    } catch {
      alert("Error al eliminar el proyecto.");
    }
  };

  const handleCloseProjectModal = () => {
    setShowProjectModal(false);
    setProjectToEdit(null);
  };

  // ── Tareas ────────────────────────────────────

  const openTaskModal = (projectId) => {
    const found = projects.find((p) => p.id === projectId);
    if (!found) return;
    setTaskToEdit(null);
    setSelectedProjectForTask(found);
    setShowTaskModal(true);
  };

  const openEditTaskModal = (taskId) => {
    const found = tasks.find((t) => t.id === taskId);
    if (!found) return;
    const proj = projects.find((p) => p.id === found.projectId) || {
      id: found.projectId,
      nombre: found.projectName,
    };
    setTaskToEdit(found);
    setSelectedProjectForTask(proj);
    setShowTaskModal(true);
  };

  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
    setSelectedProjectForTask(null);
    setTaskToEdit(null);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (taskToEdit) {
        const updated = await updateTask(taskToEdit.id, { ...taskData, id: taskToEdit.id });
        setTasks((prev) =>
          prev.map((t) => (t.id === taskToEdit.id ? { ...t, ...updated } : t))
        );
      } else {
        const created = await createTask(taskData);
        setTasks((prev) => [...prev, created]);
      }
    } catch {
      alert("Error al guardar la tarea. Verifica la conexión con el servidor.");
    }
  };

  const handleUpdateTaskStatus = async (taskId, estado) => {
    try {
      const updated = await updateTask(taskId, { estado });
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...updated } : t))
      );
    } catch {
      alert("Error al actualizar el estado de la tarea.");
    }
  };

  // ── Lógica derivada (igual que el original) ───

  const calculateProjectState = (projectId) => {
    const projectTasks = tasks.filter((t) => t.projectId === projectId);
    if (projectTasks.length === 0) return "Pendiente";
    if (projectTasks.some((t) => t.estado === "Pendiente")) return "Pendiente";
    if (projectTasks.some((t) => t.estado === "En progreso")) return "En progreso";
    return "Completado";
  };

  const projectsWithCalculatedState = useMemo(
    () => projects.map((p) => ({ ...p, estado: calculateProjectState(p.id) })),
    [projects, tasks]
  );

  const isAssignedToUser = (task) => {
    if (Array.isArray(task.assignedToEmails)) return task.assignedToEmails.includes(user?.email);
    return task.assignedToEmail === user?.email;
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const byTitle = task.titulo.toLowerCase().includes(taskSearch.toLowerCase());
      const byStatus = taskStatusFilter === "Todos" || task.estado === taskStatusFilter;
      const byPriority = taskPriorityFilter === "Todas" || (task.prioridad || "Media") === taskPriorityFilter;
      return byTitle && byStatus && byPriority;
    });
  }, [tasks, taskSearch, taskStatusFilter, taskPriorityFilter]);

  const filteredProjectsWithState = useMemo(() => {
    return projectsWithCalculatedState.filter((p) => {
      const byName = p.nombre.toLowerCase().includes(projectSearch.toLowerCase());
      const byStatus = projectStatusFilter === "Todos" || p.estado === projectStatusFilter;
      return byName && byStatus;
    });
  }, [projectsWithCalculatedState, projectSearch, projectStatusFilter]);

  const projectsForDisplay = useMemo(() => {
    if (user?.role === "gerente") return filteredProjectsWithState;
    const userTaskProjectIds = new Set(
      filteredTasks.filter(isAssignedToUser).map((t) => t.projectId)
    );
    return filteredProjectsWithState.filter((p) => userTaskProjectIds.has(p.id));
  }, [filteredProjectsWithState, filteredTasks, user]);

  const progresoProyectos = useMemo(() => {
    const projToUse = user?.role === "gerente" ? projectsWithCalculatedState : projectsForDisplay;
    if (projToUse.length === 0) return 0;
    const estadoToProgreso = { Pendiente: 0, "En progreso": 50, Completado: 100 };
    const total = projToUse.reduce((acc, p) => acc + (estadoToProgreso[p.estado] ?? 0), 0);
    return Math.round(total / projToUse.length);
  }, [projectsWithCalculatedState, projectsForDisplay, user, tasks]);

  const kpis = useMemo(() => {
    const isManager = user?.role === "gerente";
    const userTasks = isManager ? tasks : tasks.filter(isAssignedToUser);
    const userProjectIds = new Set(userTasks.map((t) => t.projectId));
    const userProjects = isManager
      ? projectsWithCalculatedState
      : projectsWithCalculatedState.filter((p) => userProjectIds.has(p.id));

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return {
      proyectosActivos: isManager
        ? projectsWithCalculatedState.filter((p) => p.estado !== "Completado").length
        : userProjects.filter((p) => p.estado !== "Completado").length,
      tareasPendientes: userTasks.filter((t) => t.estado !== "Completado").length,
      tareasCompletadas: userTasks.filter((t) => t.estado === "Completado").length,
      tareasVencidas: userTasks.filter((t) => {
        if (!t.fechaLimite || t.estado === "Completado") return false;
        return new Date(`${t.fechaLimite}T00:00:00`) < hoy;
      }).length,
    };
  }, [tasks, user, projectsWithCalculatedState]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative">
      <Navbar />

      <main className="p-6 max-w-6xl mx-auto space-y-8 mt-4">

        {/* Error de API */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-4">
            ⚠️ {apiError}
          </div>
        )}

        {/* Encabezado */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Dashboard de Proyectos</h2>
            <p className="text-gray-500 mt-1">Gestiona tus proyectos y tareas asignadas.</p>
          </div>
          {user?.role === "gerente" && (
            <button
              onClick={openCreateProjectModal}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-200"
            >
              + Nuevo Proyecto
            </button>
          )}
        </div>

        {/* Barra de progreso */}
        <ProgressBar progreso={progresoProyectos} />

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Proyectos Activos</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{kpis.proyectosActivos}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Tareas Pendientes</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{kpis.tareasPendientes}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Tareas Completadas</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{kpis.tareasCompletadas}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Tareas Vencidas</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{kpis.tareasVencidas}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-lg font-bold text-gray-700">Búsqueda y Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-600">Proyectos</p>
              <input type="text" placeholder="Buscar proyecto..." value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg" />
              <select value={projectStatusFilter} onChange={(e) => setProjectStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-white">
                <option value="Todos">Todos los estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="En progreso">En progreso</option>
                <option value="Completado">Completado</option>
              </select>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-600">Tareas</p>
              <input type="text" placeholder="Buscar tarea..." value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg" />
              <div className="grid grid-cols-2 gap-3">
                <select value={taskStatusFilter} onChange={(e) => setTaskStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-white">
                  <option value="Todos">Todos los estados</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En progreso">En progreso</option>
                  <option value="Completado">Completado</option>
                </select>
                <select value={taskPriorityFilter} onChange={(e) => setTaskPriorityFilter(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-white">
                  <option value="Todas">Todas las prioridades</option>
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Listas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProjectList
            projects={projectsForDisplay}
            onAbrirModalProyecto={openEditProjectModal}
            onAbrirModalTarea={openTaskModal}
            onEliminarProyecto={handleDeleteProject}
          />
          <TaskList
            tasks={filteredTasks}
            user={user}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onEditTask={openEditTaskModal}
          />
        </div>
      </main>

      {showProjectModal && (
        <ProjectModal
          onClose={handleCloseProjectModal}
          onSave={handleSaveProject}
          initialData={projectToEdit}
        />
      )}
      {showTaskModal && (
        <TaskModal
          onClose={handleCloseTaskModal}
          onSave={handleSaveTask}
          selectedProject={selectedProjectForTask}
          currentUser={user}
          initialData={taskToEdit}
        />
      )}
    </div>
  );
}