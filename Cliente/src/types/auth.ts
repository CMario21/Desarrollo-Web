export type UserRole = 'admin' | 'voter'

export interface AuthUser {
  _id: string
  nombre: string
  email: string
  rol: UserRole
}

export interface LoginResponse {
  token: string
  user: AuthUser
}
