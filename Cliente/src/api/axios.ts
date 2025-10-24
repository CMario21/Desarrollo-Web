import axios from 'axios';

// Usa VITE_API_URL si existe; si no, mismo dominio (/api)
const baseURL =
  (import.meta.env?.VITE_API_URL && import.meta.env.VITE_API_URL.trim().length > 0)
    ? import.meta.env.VITE_API_URL
    : '/api';

const api = axios.create({
  baseURL,
  // usamos Bearer, no cookies
  withCredentials: false,
});

// Adjunta Authorization: Bearer <token> si existe en localStorage
api.interceptors.request.use((config) => {
  try {
    // Tu AuthContext guarda en 'token' y 'user'
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
      // Si tu middleware también acepta x-access-token, puedes duplicarlo:
      // config.headers['x-access-token'] = token;
    }
  } catch { /* ignore */ }
  return config;
});

export default api;
export { api };