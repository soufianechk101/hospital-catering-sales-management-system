import React from 'react'
import { Menu, Bell, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-gray-900">
              {user?.role === 'super_admin' && 'Super Administrateur'}
              {user?.role === 'site_manager' && 'Gestionnaire de Site'}
              {user?.role === 'sub_site_manager' && 'Gestionnaire de Sous-site'}
              {user?.role === 'data_entry' && 'Saisie de Données'}
            </h1>
            <p className="text-sm text-gray-500">Bienvenue, {user?.fullName}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="hidden lg:flex">
            <Bell className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-900">
              {user?.fullName}
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:block ml-2">Déconnexion</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}