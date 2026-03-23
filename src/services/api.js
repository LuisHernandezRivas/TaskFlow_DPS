const API_URL = "http://localhost:3001";

export async function getUsers() {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
}

export async function getUserByEmail(email) {
  const res = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error("Error al buscar usuario");
  const users = await res.json();
  return users[0] || null;
}

export async function createUser(userData) {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error("Error al crear usuario");
  return res.json();
}

export async function getProjects() {
  const res = await fetch(`${API_URL}/projects`);
  if (!res.ok) throw new Error("Error al obtener proyectos");
  return res.json();
}

export async function createProject(projectData) {
  const res = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projectData),
  });
  if (!res.ok) throw new Error("Error al crear proyecto");
  return res.json();
}

export async function updateProject(id, projectData) {
  const res = await fetch(`${API_URL}/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projectData),
  });
  if (!res.ok) throw new Error("Error al actualizar proyecto");
  return res.json();
}

export async function deleteProject(id) {
  const res = await fetch(`${API_URL}/projects/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar proyecto");
}

export async function getTasks() {
  const res = await fetch(`${API_URL}/tasks`);
  if (!res.ok) throw new Error("Error al obtener tareas");
  return res.json();
}

export async function createTask(taskData) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  if (!res.ok) throw new Error("Error al crear tarea");
  return res.json();
}

export async function updateTask(id, taskData) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  if (!res.ok) throw new Error("Error al actualizar tarea");
  return res.json();
}

export async function deleteTasksByProject(projectId) {
  const tasks = await getTasks();
  const toDelete = tasks.filter((t) => t.projectId === projectId);
  await Promise.all(
    toDelete.map((t) =>
      fetch(`${API_URL}/tasks/${t.id}`, { method: "DELETE" })
    )
  );
}