import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, UtensilsCrossed, DollarSign, ClipboardList, Save, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

const MEAL_PERIODS = [
  { id: '1', name: 'Petit déjeuner', code: 'breakfast' },
  { id: '2', name: 'Déjeuner', code: 'lunch' },
  { id: '3', name: 'Collation', code: 'collation' },
  { id: '4', name: 'Dîner', code: 'dinner' },
]

const MEAL_CATEGORIES = [
  { id: '1', name: 'Repas malade normal', code: 'normal', isCalculated: true },
  { id: '2', name: 'Régime hyperprotidique', code: 'hyperprotidique', isCalculated: false },
  { id: '3', name: 'Régime léger', code: 'leger', isCalculated: false },
  { id: '4', name: 'Mixé', code: 'mice', isCalculated: false },
  { id: '5', name: 'Repas VIP', code: 'vip', isCalculated: false },
  { id: '6', name: 'Repas Médecine', code: 'medecine', isCalculated: false },
  { id: '7', name: 'Accompagnant normal', code: 'accompagnant_normal', isCalculated: false },
  { id: '8', name: 'Accompagnant VIP', code: 'accompagnant_vip', isCalculated: false },
]

const PRICES = {
  normal: 45.00,
  hyperprotidique: 65.00,
  leger: 50.00,
  mice: 55.00,
  vip: 80.00,
  medecine: 70.00,
  accompagnant_normal: 25.00,
  accompagnant_vip: 40.00,
}

export function DailyEntry() {
  const { user, canAccessSubSite } = useAuth()
  const [sites, setSites] = useState<any[]>([])
  const [subSites, setSubSites] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [selectedSite, setSelectedSite] = useState<string>('')
  const [selectedSubSite, setSelectedSubSite] = useState<string>('')
  const [recordDate, setRecordDate] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Data entry state: serviceId -> mealPeriodId -> categoryId -> quantity
  const [entries, setEntries] = useState<Record<string, Record<string, Record<string, number>>>>({})

  useEffect(() => {
    loadSites()
  }, [user])

  const loadSites = async () => {
    try {
      const data = await fetch('/api/sites').then(res => res.json())
      setSites(data)
    } catch (err) {
      console.error('Failed to load sites:', err)
    }
  }

  const loadSubSites = async (siteId: string) => {
    try {
      const data = await fetch(`/api/sub-sites?site_id=${siteId}`).then(res => res.json())
      setSubSites(data)
    } catch (err) {
      console.error('Failed to load sub-sites:', err)
    }
  }

  const loadServices = async (subSiteId: string) => {
    try {
      const data = await fetch(`/api/services?sub_site_id=${subSiteId}`).then(res => res.json())
      setServices(data)
      // Initialize entries for new services
      setEntries(prev => {
        const newEntries = { ...prev }
        data.forEach(service => {
          if (!newEntries[service.id]) {
            newEntries[service.id] = {}
            MEAL_PERIODS.forEach(period => {
              newEntries[service.id][period.id] = {}
              MEAL_CATEGORIES.forEach(category => {
                newEntries[service.id][period.id][category.id] = 0
              })
            })
          }
        })
        return newEntries
      })
    } catch (err) {
      console.error('Failed to load services:', err)
    }
  }

  const handleSiteChange = (value: string) => {
    setSelectedSite(value)
    setSelectedSubSite('')
    setServices([])
    loadSubSites(value)
  }

  const handleSubSiteChange = (value: string) => {
    setSelectedSubSite(value)
    loadServices(value)
  }

  const updateQuantity = (serviceId: string, periodId: string, categoryId: string, value: number) => {
    setEntries(prev => {
      const newEntries = { ...prev }
      if (!newEntries[serviceId]) newEntries[serviceId] = {}
      if (!newEntries[serviceId][periodId]) newEntries[serviceId][periodId] = {}
      newEntries[serviceId][periodId][categoryId] = Math.max(0, value)
      return newEntries
    })
  }

  const calculateNormalMeals = (passageGlobal: number, periodId: string, serviceId: string) => {
    const periodEntries = entries[serviceId]?.[periodId]
    if (!periodEntries) return 0

    let sumOthers = 0
    MEAL_CATEGORIES.forEach(category => {
      if (!category.isCalculated) {
        sumOthers += periodEntries[category.id] || 0
      }
    })

    return Math.max(0, passageGlobal - sumOthers)
  }

  const getTotalRevenue = () => {
    let total = 0
    Object.entries(entries).forEach(([serviceId, periods]) => {
      Object.entries(periods).forEach(([periodId, categories]) => {
        Object.entries(categories).forEach(([categoryId, quantity]) => {
          const category = MEAL_CATEGORIES.find(c => c.id === categoryId)
          if (category && !category.isCalculated) {
            const price = PRICES[category.code as keyof typeof PRICES] || 0
            total += quantity * price
          }
        })
      })
    })
    return total
  }

  const validateEntries = () => {
    for (const [serviceId, periods] of Object.entries(entries)) {
      for (const [periodId, categories] of Object.entries(periods)) {
        const passageGlobal = categories['passage_global'] || 0
        let sumOthers = 0
        MEAL_CATEGORIES.forEach(category => {
          if (!category.isCalculated) {
            sumOthers += categories[category.id] || 0
          }
        })
        if (sumOthers > passageGlobal) {
          return false
        }
      }
    }
    return true
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!selectedSite || !selectedSubSite || !recordDate) {
      setError('Veuillez sélectionner le site, le sous-site et la date.')
      return
    }

    if (!validateEntries()) {
      setError('La somme des quantités ne peut pas dépasser le Passage global.')
      return
    }

    setIsLoading(true)

    try {
      // Prepare data for API
      const servicesData = Object.entries(entries).map(([serviceId, periods]) => {
        return Object.entries(periods).map(([periodId, categories]) => {
          const mealQuantities = Object.entries(categories).map(([categoryId, quantity]) => {
            const category = MEAL_CATEGORIES.find(c => c.id === categoryId)
            const price = category ? PRICES[category.code as keyof typeof PRICES] || 0 : 0
            return {
              meal_category_id: categoryId,
              quantity,
              unit_price: price,
              revenue: quantity * price,
            }
          })

          return {
            service_id: serviceId,
            meal_period_id: periodId,
            passage_global: categories['passage_global'] || 0,
            meal_quantities,
          }
        })
      }).flat()

      const response = await fetch('/api/daily-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sub_site_id: selectedSubSite,
          record_date: recordDate,
          passage_global: 0, // Will be calculated
          services: servicesData,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement')
      }

      setSuccess('Enregistrement sauvegardé avec succès !')
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'enregistrement')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Saisie Quotidienne</h1>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? 'Enregistrement...' : <><Save className="h-4 w-4 mr-2" />Sauvegarder</>}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      <div className="space-y-6">
        {/* Selection Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sélection</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Site</label>
              <Select
                value={selectedSite}
                onValueChange={handleSiteChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un site" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map(site => (
                    <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Sous-site</label>
              <Select
                value={selectedSubSite}
                onValueChange={handleSubSiteChange}
                disabled={!selectedSite}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un sous-site" />
                </SelectTrigger>
                <SelectContent>
                  {subSites.map(subSite => (
                    <SelectItem key={subSite.id} value={subSite.id}>{subSite.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date de saisie</label>
              <Input
                type="date"
                value={recordDate}
                onChange={(e) => setRecordDate(e.target.value)}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Entry Table */}
        {selectedSubSite && services.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Saisie des Données</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-gray-600 font-medium border-b">Service</th>
                      <th className="px-3 py-2 text-left text-gray-600 font-medium border-b">Période</th>
                      <th className="px-3 py-2 text-center text-gray-600 font-medium border-b">Passage Global</th>
                      {MEAL_CATEGORIES.map(cat => (
                        <th key={cat.id} className="px-3 py-2 text-center text-gray-600 font-medium border-b">
                          {cat.name}
                        </th>
                      ))}
                      <th className="px-3 py-2 text-center text-gray-600 font-medium border-b">Revenu (MAD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map(service => (
                      <React.Fragment key={service.id}>
                        {MEAL_PERIODS.map(period => {
                          const periodEntries = entries[service.id]?.[period.id] || {}
                          const passageGlobal = periodEntries['passage_global'] || 0
                          const normalMeals = calculateNormalMeals(passageGlobal, period.id, service.id)
                          
                          return (
                            <tr key={`${service.id}-${period.id}`} className="border-b hover:bg-gray-50">
                              <td className="px-3 py-2 font-medium">{service.name}</td>
                              <td className="px-3 py-2">{period.name}</td>
                              <td className="px-3 py-2 text-center">
                                <Input
                                  type="number"
                                  value={passageGlobal}
                                  onChange={(e) => updateQuantity(service.id, period.id, 'passage_global', parseInt(e.target.value) || 0)}
                                  className="w-20 text-center"
                                />
                              </td>
                              {MEAL_CATEGORIES.map(cat => {
                                if (cat.isCalculated) {
                                  return (
                                    <td key={cat.id} className="px-3 py-2 text-center font-medium text-blue-600">
                                      {normalMeals}
                                    </td>
                                  )
                                }
                                const quantity = periodEntries[cat.id] || 0
                                const price = PRICES[cat.code as keyof typeof PRICES] || 0
                                return (
                                  <td key={cat.id} className="px-3 py-2 text-center">
                                    <Input
                                      type="number"
                                      value={quantity}
                                      onChange={(e) => updateQuantity(service.id, period.id, cat.id, parseInt(e.target.value) || 0)}
                                      className="w-16 text-center"
                                    />
                                  </td>
                                )
                              })}
                              <td className="px-3 py-2 text-center font-medium">
                                {((periodEntries['hyperprotidique'] || 0) * PRICES.hyperprotidique +
                                 (periodEntries['leger'] || 0) * PRICES.leger +
                                 (periodEntries['mice'] || 0) * PRICES.mice +
                                 (periodEntries['vip'] || 0) * PRICES.vip +
                                 (periodEntries['medecine'] || 0) * PRICES.medecine +
                                 (periodEntries['accompagnant_normal'] || 0) * PRICES.accompagnant_normal +
                                 (periodEntries['accompagnant_vip'] || 0) * PRICES.accompagnant_vip +
                                 normalMeals * PRICES.normal).toFixed(2)}
                              </td>
                            </tr>
                          )
                        })}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">Total Revenu (MAD):</p>
                  <p className="text-lg font-bold text-blue-600">{getTotalRevenue().toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}