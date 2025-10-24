// Cliente/src/api/axios.ts
import axios from 'axios';

// Base: mismo dominio en prod (Vite: VITE_API_URL=/api)
const baseURL =
  (import.meta.env?.VITE_API_URL && import.meta.env.VITE_API_URL.trim().length > 0)
    ? import.meta.env.VITE_API_URL
    : '/api';

const api = axios.create({
  baseURL,
  withCredentials: false, // usamos Bearer, no cookies
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // tu AuthContext guarda 'token'
  // DEBUG opcional: ver si existe token y a qué URL va
  // console.log('[axios] token?', !!token, '→', config.method, config.url);

  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
    // opcional: compat extra
    // config.headers['x-access-token'] = token;
  }
  return config;
});

export default api;
export { api };