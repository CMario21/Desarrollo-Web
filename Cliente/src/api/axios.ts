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

// DEBUG: quita estos console después
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    console.info('[axios] →', config.method?.toUpperCase(), config.url, 'token?', !!token)
    if (token) {
      const h = config.headers as any
      if (typeof h.set === 'function') {
        h.set('Authorization', `Bearer ${token}`)
      } else {
        h['Authorization'] = `Bearer ${token}`
      }
    }
    return config
  },
  (err) => Promise.reject(err)
)

// (opcional) loguea 401/403 de vuelta
api.interceptors.response.use(
  (r) => r,
  (err) => {
    const status = err?.response?.status
    if (status === 401 || status === 403) {
      console.warn('[axios] ←', status, 'URL:', err?.config?.url)
    }
    return Promise.reject(err)
  }
)

export default api
