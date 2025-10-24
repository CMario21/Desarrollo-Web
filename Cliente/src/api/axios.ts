// ...existing code...
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'
const api = axios.create({ baseURL })

// Interceptor: leer token desde localStorage en cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api
// ...existing code...