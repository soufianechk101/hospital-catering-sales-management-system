import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '@/lib/api'

interface User {
  id: string
  username: string
  email: string
  fullName: string
  role: 'super_admin' | 'site_manager' | 'sub_site_manager' | 'data_entry'
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  hasRole: (role: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
  canAccessSite: (siteId: string) => boolean
  canAccessSubSite: (subSiteId: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = useCallback(async (username: string, password: string) => {
    const data = await authApi.login(username, password)
    setUser(data.user)
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
  }, [])

  const checkAuth = useCallback(async () => {
    try {
      const data = await authApi.me()
      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const hasRole = useCallback((role: string) => {
    return user?.role === role
  }, [user])

  const hasAnyRole = useCallback((roles: string[]) => {
    return user ? roles.includes(user.role) : false
  }, [user])

  const canAccessSite = useCallback((siteId: string) => {
    if (!user) return false
    if (user.role === 'super_admin') return true
    if (user.role === 'site_manager') {
      // In production, check user_site_access
      return siteId === '22222222-2222-2222-2222-222222222222' // Tanger
    }
    return false
  }, [user])

  const canAccessSubSite = useCallback((subSiteId: string) => {
    if (!user) return false
    if (user.role === 'super_admin') return true
    if (user.role === 'sub_site_manager' || user.role === 'data_entry') {
      return subSiteId === '44444444-4444-4444-4444-444444444444' // Tanger Sous-site 1
    }
    if (user.role === 'site_manager') {
      return subSiteId === '44444444-4444-4444-4444-444444444444' || 
             subSiteId === '55555555-5555-5555-5555-555555555555' // Tanger sub-sites
    }
    return false
  }, [user])

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
      checkAuth,
      hasRole,
      hasAnyRole,
      canAccessSite,
      canAccessSubSite,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}