export default function ProgressBar({ progreso }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-700 mb-3">Progreso General del Equipo</h3>
      <div className="w-full bg-gray-200 rounded-full h-5">
        <div 
          className="bg-blue-600 h-5 rounded-full transition-all duration-500" 
          style={{ width: `${progreso}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-500 mt-2 font-medium">{progreso}% de tareas completadas este mes</p>
    </div>
  );
}