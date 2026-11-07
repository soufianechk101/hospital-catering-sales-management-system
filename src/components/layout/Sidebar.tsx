import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import {
  Home,
  Building2,
  MapPin,
  Users,
  DollarSign,
  ClipboardList,
  BarChart3,
  FileText,
  Settings,
  Menu,
  X,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles?: string[]
}

const navItems: NavItem[] = [
  { label: 'Tableau de bord', href: '/dashboard', icon: Home, roles: ['super_admin', 'site_manager', 'sub_site_manager', 'data_entry'] },
  { label: 'Sites', href: '/sites', icon: Building2, roles: ['super_admin', 'site_manager'] },
  { label: 'Sous-sites', href: '/sub-sites', icon: MapPin, roles: ['super_admin', 'site_manager', 'sub_site_manager'] },
  { label: 'Services', href: '/services', icon: Users, roles: ['super_admin', 'site_manager', 'sub_site_manager'] },
  { label: 'Prix', href: '/prices', icon: DollarSign, roles: ['super_admin'] },
  { label: 'Saisie quotidienne', href: '/daily-entry', icon: ClipboardList, roles: ['super_admin', 'site_manager', 'sub_site_manager', 'data_entry'] },
  { label: 'Journaux', href: '/journals', icon: FileText, roles: ['super_admin', 'site_manager', 'sub_site_manager'] },
  { label: 'Rapports', href: '/reports', icon: BarChart3, roles: ['super_admin', 'site_manager', 'sub_site_manager'] },
  { label: 'Utilisateurs', href: '/users', icon: Users, roles: ['super_admin'] },
  { label: 'Paramètres', href: '/settings', icon: Settings, roles: ['super_admin'] },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, hasAnyRole } = useAuth()
  const location = useLocation()

  const filteredNavItems = navItems.filter(item => {
    if (item.roles) {
      return hasAnyRole(item.roles)
    }
    return true
  })

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MC</span>
            </div>
            <span className="font-semibold text-gray-900">MediCatering Pro</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    onClick={() => onClose()}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          {user && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-semibold">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.fullName}</p>
                <p className="text-xs text-gray-500 truncate">{user.role}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}