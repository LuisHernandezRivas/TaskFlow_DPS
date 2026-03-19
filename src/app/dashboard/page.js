"use client";
import { useState, useEffect, useContext } from 'react';
import {AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

// Importacion de los componentes que conforman el dashboard
import Navbar from '../../components/Navbar';
import ProgressBar from '../../components/ProgressBar';
import ProjectList from '../../components/ProjectList';
import TaskList from '../../components/TaskList';
import ProjectModal from '../../components/modals/ProjectModal';
import TaskModal from '../../components/modals/TaskModal';

export default function DashboardPage() {
 // Estados para controlar la visibilidad de los modales
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

 const { user } = useContext(AuthContext);
 const router = useRouter();

 // Protegemos la ruta del dashboard para que solo usuarios autenticados puedan acceder
 useEffect(() => {
  const sessionGuardada = localStorage.getItem("session");
  if (!user && !sessionGuardada) {
      router.push("/login");
    }
  }, [user, router]);

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
    onClick={() => setShowProjectModal(true)}
    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-200"
  >
    + Nuevo Proyecto
  </button>
)}
 
</div>

        {/* 2. Insertamos la barra de progreso */}
        <ProgressBar progreso={75} />

        {/* 3. Insertamos las listas en sus columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Insertamos la lista de proyectos */}
          <ProjectList 
            onAbrirModalProyecto={() => setShowProjectModal(true)} 
            onAbrirModalTarea={() => setShowTaskModal(true)} 
          />
          <TaskList />
        </div>
      </main>

      {/* 4. Ventanas que se muestran según el estado */}
      {showProjectModal && <ProjectModal onClose={() => setShowProjectModal(false)} />}
      {showTaskModal && <TaskModal onClose={() => setShowTaskModal(false)} />}

    </div>
  );
}
