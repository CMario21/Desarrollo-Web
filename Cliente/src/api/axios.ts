// Cliente/src/api/axios.ts
import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

const baseURL =
  (import.meta.env?.VITE_API_URL && import.meta.env.VITE_API_URL.trim().length > 0)
    ? import.meta.env.VITE_API_URL
    : '/api'

const api = axios.create({
  baseURL,
  withCredentials: false,
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      // Axios v1: headers suele ser AxiosHeaders con método .set()
      const h = config.headers as any
      if (h?.set) {
        h.set('Authorization', `Bearer ${token}`)
        h.set('x-access-token', token) // opcional
      } else {
        // fallback por si fuera un objeto plano
        h['Authorization'] = `Bearer ${token}`
        h['x-access-token'] = token
      }
    }
    return config
  },
  (err) => Promise.reject(err)
)

export default api
