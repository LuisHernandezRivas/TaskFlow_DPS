"use client";
import { useEffect, useState } from "react";

export default function ProjectModal({ onClose, onSave, initialData }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    if (!initialData) {
      setNombre("");
      setDescripcion("");
      return;
    }

    setNombre(initialData.nombre || "");
    setDescripcion(initialData.descripcion || "");
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert("El nombre del proyecto es obligatorio");
      return;
    }

    onSave({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Gestión de Proyecto</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del Proyecto</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg mt-1"
              placeholder="Ej. Nuevo Sistema"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              className="w-full px-4 py-2 border rounded-lg mt-1"
              rows="3"
              placeholder="Detalles del proyecto..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            ></textarea>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-bold">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
              {initialData ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}