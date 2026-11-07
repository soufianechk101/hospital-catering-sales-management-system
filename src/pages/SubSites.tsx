import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Table, TableHeader, TableRow, TableCell, TableBody } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { MapPin, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SubSites() {
  const { user, canAccessSite } = useAuth()
  const [subSites, setSubSites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSubSites() {
      try {
        const data = await fetch('/api/sub-sites')
          .then(res => res.json())
        setSubSites(data)
      } catch (err) {
        console.error('Failed to load sub-sites:', err)
      } finally {
        setLoading(false)
      }
    }
    loadSubSites()
  }, [user])

  if (!user) return null

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Sous-sites</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un Sous-site
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
                <TableCell>Site</TableCell>
                <TableCell>Code</TableCell>
                <TableCell className="w-24">Statut</TableCell>
                <TableCell className="text-right">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subSites.map((subSite) => (
                <TableRow key={subSite.id} className="border-b hover:bg-gray-50">
                  <TableCell className="font-medium">{subSite.name}</TableCell>
                  <TableCell>{subSite.site_id}</TableCell>
                  <TableCell>{subSite.code}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      subSite.is_active 
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    )}>
                      {subSite.is_active ? 'Actif' : 'Inactif'}
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