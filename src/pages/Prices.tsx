import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Table, TableHeader, TableRow, TableCell, TableBody } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { DollarSign, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Prices() {
  const { user, hasRole } = useAuth()
  const [prices, setPrices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPrices() {
      try {
        const data = await fetch('/api/prices')
          .then(res => res.json())
        setPrices(data)
      } catch (err) {
        console.error('Failed to load prices:', err)
      } finally {
        setLoading(false)
      }
    }
    loadPrices()
  }, [user])

  if (!user) return null

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Prix</h1>
        {hasRole(['super_admin']) && (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un Prix
          </Button>
        )}
      </div>
      
      {loading ? (
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="w-32">Catégorie</TableCell>
                <TableCell>Prix Unitaire (MAD)</TableCell>
                <TableCell>Date d'effet</TableCell>
                <TableCell className="text-right">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prices.map((price) => (
                <TableRow key={price.id} className="border-b hover:bg-gray-50">
                  <TableCell>{price.meal_category_name}</TableCell>
                  <TableCell>{price.unit_price.toFixed(2)}</TableCell>
                  <TableCell>{price.effective_date}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Modifier
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