import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/axios'
import type { AuthUser, LoginResponse } from '../types/auth'

interface AuthState {
  user: AuthUser | null
  token: string | null
  login: (cred: { colegiado: string; dpi: string; password: string }) => Promise<void>
}

const AuthCtx = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Rehidrata sesión al montar
  useEffect(() => {
    const t = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (t && u) {
      setToken(t)
      try {
        setUser(JSON.parse(u))
      } catch {}
      // Asegura que Axios incluya el token automáticamente
      api.defaults.headers = api.defaults.headers || {}
      api.defaults.headers.common = api.defaults.headers.common || {}
      api.defaults.headers.common['Authorization'] = `Bearer ${t}`
    }
  }, [])

  // Login y guardado persistente
  async function login(cred: { colegiado: string; dpi: string; password: string }) {
    const { data } = await api.post<LoginResponse>('/auth/login', cred)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    // Setea el header por defecto para próximas peticiones
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

    setToken(data.token)
    setUser(data.user)
  }

  const value = useMemo(() => ({ user, token, login }), [user, token])
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
