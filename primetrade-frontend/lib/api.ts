import axios from "axios";
import Cookies from "js-cookie";

const BASE = "http://127.0.0.1:8000/api/v1";

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser = (data: { name: string; email: string; password: string }) =>
  api.post("/auth/register", data);

export const loginUser = (data: { email: string; password: string }) =>
  api.post("/auth/login", data);

export const getMe = () => api.get("/auth/me");

// Tasks
export const getTasks = () => api.get("/tasks");
export const createTask = (data: { title: string; description?: string }) =>
  api.post("/tasks", data);
export const updateTask = (id: number, data: { title?: string; description?: string; completed?: boolean }) =>
  api.put(`/tasks/${id}`, data);
export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);

// Admin
export const getAllTasks = () => api.get("/admin/tasks");

export default api;
