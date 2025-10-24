// Cliente/src/api/axios.ts
import axios from 'axios'

  const baseURL = import.meta.env.VITE_API_URL ?? 'https://votaciones-app-5b5c.onrender.com/api'
  
  const api = axios.create({
    baseURL,
    withCredentials: false, // usando Authorization Bearer, no cookies
  })
  
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  console.log('[axios] →', config.method?.toUpperCase(), config.url, 'token?', !!token)
  if (token) {
    const h = config.headers as any
    if (h?.set) {
      h.set('Authorization', `Bearer ${token}`)
    } else {
      h.Authorization = `Bearer ${token}`
    }
  }
  return config
})

  
  export default api
