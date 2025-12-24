import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/auth.service'
import type { AuthResponse } from '../services/auth.service'

interface AuthContextType {
  user: AuthResponse['user'] | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (
    email: string,
    password: string,
    name: string,
    passwordConfirmation: string,
  ) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in on mount
    const storedUser = authService.getUser()
    const token = authService.getToken()

    if (storedUser && token) {
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password })
    setUser(response.user)
  }

  const register = async (
    email: string,
    password: string,
    name: string,
    passwordConfirmation: string,
  ) => {
    const response = await authService.register({
      email,
      password,
      password_confirmation: passwordConfirmation,
      name,
    })
    setUser(response.user)
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
