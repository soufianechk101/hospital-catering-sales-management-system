import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Table, TableHeader, TableRow, TableCell, TableBody } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Users, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Services() {
  const { user, canAccessSubSite } = useAuth()
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await fetch('/api/services')
          .then(res => res.json())
        setServices(data)
      } catch (err) {
        console.error('Failed to load services:', err)
      } finally {
        setLoading(false)
      }
    }
    loadServices()
  }, [user])

  if (!user) return null

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Services</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un Service
        </Button>
      </div>
      
      {loading ? (
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="w-24">Nom</TableCell>
                <TableCell>Sous-site</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell className="text-right">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id} className="border-b hover:bg-gray-50">
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.sub_site_id}</TableCell>
                  <TableCell>{service.code}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      service.is_active 
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    )}>
                      {service.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Voir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}