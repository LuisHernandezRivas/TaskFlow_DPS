"use client";
import { useState, useEffect, useContext, useMemo } from 'react';
import {AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

// Importacion de los componentes que conforman el dashboard
import Navbar from '../../components/Navbar';
import ProgressBar from '../../components/ProgressBar';
import ProjectList from '../../components/ProjectList';
import TaskList from '../../components/TaskList';
import ProjectModal from '../../components/modals/ProjectModal';
import TaskModal from '../../components/modals/TaskModal';

const DEFAULT_PROJECTS = [
  {
    id: 1,
    nombre: "App Móvil Comunitaria",
    descripcion: "Plataforma para gestionar servicios comunitarios.",
    estado: "En progreso",
  },
];

const DEFAULT_TASKS = [];

export default function DashboardPage() {
 // Estados para controlar la visibilidad de los modales
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

 const { user } = useContext(AuthContext);
 const router = useRouter();

 // Protegemos la ruta del dashboard para que solo usuarios autenticados puedan acceder
 useEffect(() => {
  const sessionGuardada = localStorage.getItem("session");
  if (!user && !sessionGuardada) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem("projects"));
    if (savedProjects && Array.isArray(savedProjects)) {
      setProjects(savedProjects);
    } else {
      setProjects(DEFAULT_PROJECTS);
      localStorage.setItem("projects", JSON.stringify(DEFAULT_PROJECTS));
    }

    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks && Array.isArray(savedTasks)) {
      setTasks(savedTasks);
      return;
    }
    setTasks(DEFAULT_TASKS);
    localStorage.setItem("tasks", JSON.stringify(DEFAULT_TASKS));
  }, []);

  const openCreateProjectModal = () => {
    setProjectToEdit(null);
    setShowProjectModal(true);
  };

  const openEditProjectModal = (projectId) => {
    const projectFound = projects.find((project) => project.id === projectId);
    if (!projectFound) return;
    setProjectToEdit(projectFound);
    setShowProjectModal(true);
  };

  const saveProjects = (nextProjects) => {
    setProjects(nextProjects);
    localStorage.setItem("projects", JSON.stringify(nextProjects));
  };

  const handleSaveProject = (projectData) => {
    // No guardamos el estado - será calculado dinámicamente
    const { estado, ...dataWithoutStatus } = projectData;
    
    if (projectToEdit) {
      const updatedProjects = projects.map((project) =>
        project.id === projectToEdit.id
          ? { ...project, ...dataWithoutStatus }
          : project
      );
      saveProjects(updatedProjects);
      return;
    }

    const newProject = {
      id: Date.now(),
      ...dataWithoutStatus,
    };
    saveProjects([...projects, newProject]);
  };

  const handleDeleteProject = (projectId) => {
    const updatedProjects = projects.filter((project) => project.id !== projectId);
    saveProjects(updatedProjects);

    const updatedTasks = tasks.filter((task) => task.projectId !== projectId);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const handleCloseProjectModal = () => {
    setShowProjectModal(false);
    setProjectToEdit(null);
  };

  const openTaskModal = (projectId) => {
    const projectFound = projects.find((project) => project.id === projectId);
    if (!projectFound) return;
    setTaskToEdit(null);
    setSelectedProjectForTask(projectFound);
    setShowTaskModal(true);
  };

  const openEditTaskModal = (taskId) => {
    const taskFound = tasks.find((task) => task.id === taskId);
    if (!taskFound) return;

    const projectFound = projects.find((project) => project.id === taskFound.projectId);
    const projectForTask = projectFound || {
      id: taskFound.projectId,
      nombre: taskFound.projectName,
    };

    setTaskToEdit(taskFound);
    setSelectedProjectForTask(projectForTask);
    setShowTaskModal(true);
  };

  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
    setSelectedProjectForTask(null);
    setTaskToEdit(null);
  };

  const handleSaveTask = (taskData) => {
    if (taskToEdit) {
      const nextTasks = tasks.map((task) =>
        task.id === taskToEdit.id
          ? { ...task, ...taskData, id: taskToEdit.id }
          : task
      );
      setTasks(nextTasks);
      localStorage.setItem("tasks", JSON.stringify(nextTasks));
      return;
    }

    const newTask = {
      id: Date.now(),
      ...taskData,
    };

    const nextTasks = [...tasks, newTask];
    setTasks(nextTasks);
    localStorage.setItem("tasks", JSON.stringify(nextTasks));
  };

  const handleUpdateTaskStatus = (taskId, estado) => {
    const nextTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, estado } : task
    );
    setTasks(nextTasks);
    localStorage.setItem("tasks", JSON.stringify(nextTasks));
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const byName = project.nombre.toLowerCase().includes(projectSearch.toLowerCase());
      const byStatus = projectStatusFilter === "Todos" || project.estado === projectStatusFilter;
      return byName && byStatus;
    });
  }, [projects, projectSearch, projectStatusFilter]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const byTitle = task.titulo.toLowerCase().includes(taskSearch.toLowerCase());
      const byStatus = taskStatusFilter === "Todos" || task.estado === taskStatusFilter;
      const byPriority = taskPriorityFilter === "Todas" || (task.prioridad || "Media") === taskPriorityFilter;
      return byTitle && byStatus && byPriority;
    });
  }, [tasks, taskSearch, taskStatusFilter, taskPriorityFilter]);

  const isAssignedToUser = (task) => {
    if (Array.isArray(task.assignedToEmails)) {
      return task.assignedToEmails.includes(user?.email);
    }
    return task.assignedToEmail === user?.email;
  };

  // Calcular el estado dinámico de cada proyecto basado en sus tareas
  const calculateProjectState = (projectId) => {
    const projectTasks = tasks.filter((task) => task.projectId === projectId);
    
    if (projectTasks.length === 0) {
      return "Pendiente";
    }
    
    // Si hay al menos una tarea en "Pendiente", el proyecto es "Pendiente"
    if (projectTasks.some((t) => t.estado === "Pendiente")) {
      return "Pendiente";
    }
    
    // Si hay al menos una tarea en "En progreso", el proyecto es "En progreso"
    if (projectTasks.some((t) => t.estado === "En progreso")) {
      return "En progreso";
    }
    
    // Si todas las tareas son "Completado", el proyecto es "Completado"
    return "Completado";
  };

  // Enriquecer TODOS los proyectos con estados calculados dinámicamente
  const projectsWithCalculatedState = useMemo(() => {
    return projects.map((project) => ({
      ...project,
      estado: calculateProjectState(project.id),
    }));
  }, [projects, tasks]);

  // Filtrar proyectos por búsqueda y estado (usando estados calculados)
  const filteredProjectsWithState = useMemo(() => {
    return projectsWithCalculatedState.filter((project) => {
      const byName = project.nombre.toLowerCase().includes(projectSearch.toLowerCase());
      const byStatus = projectStatusFilter === "Todos" || project.estado === projectStatusFilter;
      return byName && byStatus;
    });
  }, [projectsWithCalculatedState, projectSearch, projectStatusFilter]);

  const projectsForDisplay = useMemo(() => {
    if (user?.role === "gerente") {
      return filteredProjectsWithState;
    }

    const userTaskProjectIds = new Set(
      filteredTasks.filter((task) => isAssignedToUser(task)).map((task) => task.projectId)
    );

    return filteredProjectsWithState.filter((project) => userTaskProjectIds.has(project.id));
  }, [filteredProjectsWithState, filteredTasks, user]);

  const progresoProyectos = useMemo(() => {
    const projToUse = user?.role === "gerente" ? projectsWithCalculatedState : projectsForDisplay;
    
    if (projToUse.length === 0) return 0;

    const estadoToProgreso = {
      "Pendiente": 0,
      "En progreso": 50,
      "Completado": 100,
    };

    const total = projToUse.reduce((acumulado, project) => {
      return acumulado + (estadoToProgreso[project.estado] ?? 0);
    }, 0);

    return Math.round(total / projToUse.length);
  }, [projects, projectsForDisplay, user, projectsWithCalculatedState, tasks]);

  const kpis = useMemo(() => {
    const isManager = user?.role === "gerente";

    const isAssignedToUserLocal = (task) => {
      if (Array.isArray(task.assignedToEmails)) {
        return task.assignedToEmails.includes(user?.email);
      }
      return task.assignedToEmail === user?.email;
    };

    const userTasks = isManager ? tasks : tasks.filter((task) => isAssignedToUserLocal(task));
    const userProjectIds = new Set(userTasks.map((task) => task.projectId));
    const userProjects = isManager ? projectsWithCalculatedState : projectsWithCalculatedState.filter((project) => userProjectIds.has(project.id));

    const proyectosActivosTotal = projectsWithCalculatedState.filter((project) => project.estado !== "Completado").length;
    const tareasPendientes = userTasks.filter((task) => task.estado !== "Completado").length;
    const tareasCompletadas = userTasks.filter((task) => task.estado === "Completado").length;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const tareasVencidas = userTasks.filter((task) => {
      if (!task.fechaLimite || task.estado === "Completado") return false;
      const limite = new Date(`${task.fechaLimite}T00:00:00`);
      return limite < hoy;
    }).length;

    return {
      proyectosActivos: isManager ? proyectosActivosTotal : userProjects.filter((p) => p.estado !== "Completado").length,
      tareasPendientes,
      tareasCompletadas,
      tareasVencidas,
    };
  }, [projects, tasks, user, projectsWithCalculatedState]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative">
      
      {/* Barra de navegación */}
      <Navbar />

      <main className="p-6 max-w-6xl mx-auto space-y-8 mt-4">
        
        {/* Encabezado Principal */}
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

        {/* 2. Insertamos la barra de progreso */}
        <ProgressBar progreso={progresoProyectos} />

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

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-lg font-bold text-gray-700">Búsqueda y Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-600">Proyectos</p>
              <input
                type="text"
                placeholder="Buscar proyecto..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <select
                value={projectStatusFilter}
                onChange={(e) => setProjectStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-white"
              >
                <option value="Todos">Todos los estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="En progreso">En progreso</option>
                <option value="Completado">Completado</option>
              </select>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-600">Tareas</p>
              <input
                type="text"
                placeholder="Buscar tarea..."
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={taskStatusFilter}
                  onChange={(e) => setTaskStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-white"
                >
                  <option value="Todos">Todos los estados</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En progreso">En progreso</option>
                  <option value="Completado">Completado</option>
                </select>
                <select
                  value={taskPriorityFilter}
                  onChange={(e) => setTaskPriorityFilter(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-white"
                >
                  <option value="Todas">Todas las prioridades</option>
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Insertamos las listas en sus columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Insertamos la lista de proyectos */}
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

      {/* 4. Ventanas que se muestran según el estado */}
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
