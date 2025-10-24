// Cliente/src/api/axios.ts (versión final)
import axios from 'axios';

const baseURL =
  (import.meta.env?.VITE_API_URL && import.meta.env.VITE_API_URL.trim().length > 0)
    ? import.meta.env.VITE_API_URL
    : '/api';

const api = axios.create({ baseURL, withCredentials: false });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // <-- Tu AuthContext guarda 'token'
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
    // opcional: duplica por compatibilidad
    // config.headers['x-access-token'] = token;
  }
  return config;
});

export default api;
export { api };