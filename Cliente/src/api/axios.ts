// Cliente/src/api/axios.ts
import axios from 'axios'

  const baseURL = import.meta.env.VITE_API_URL ?? 'https://votaciones-app-5b5c.onrender.com/api'
  
  const api = axios.create({
    baseURL,
    withCredentials: false, // usando Authorization Bearer, no cookies
  })
  
  // Interceptor: lee token desde localStorage en cada petición y lo adjunta
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    console.debug('[api] attach token?', !!token, config.method, config.url)
    if (token) {
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${token}`
      config.headers['x-access-token'] = token // fallback
    }
    return config
  }, (err) => Promise.reject(err))
  
  export default api
