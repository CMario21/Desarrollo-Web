import axios from 'axios';
// Usa VITE_API_URL si existe; si no, sirve desde el mismo dominio (/api)
const baseURL = (import.meta.env?.VITE_API_URL && import.meta.env.VITE_API_URL.trim().length > 0)
    ? import.meta.env.VITE_API_URL
    : '/api';
export const api = axios.create({
    baseURL,
    withCredentials: true,
});
export default api;
