import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts'
import {
  DollarSign, UtensilsCrossed, Users, Building2, MapPin, ClipboardList,
  TrendingUp, Calendar, Activity, Menu, ChevronDown, ChevronUp
} from 'lucide-react'
import { dashboardApi } from '@/lib/api'
import { cn } from '@/lib/utils'

const PIE_COLORS = ['#1261A0', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE', '#E0E7FF', '#EFF6FF']

interface DashboardStats {
  daily_revenue: number
  monthly_revenue: number
  total_meals: number
  total_passages: number
  active_services: number
  sub_sites: number
  sites: number
  revenue_by_day: Array<{ date: string; revenue: number }>
  revenue_by_site: Array<{ site: string; revenue: number }>
  revenue_by_sub_site: Array<{ sub_site: string; revenue: number }>
  revenue_by_service: Array<{ service: string; revenue: number }>
  revenue_by_meal_period: Array<{ period: string; revenue: number }>
  meal_category_distribution: Array<{ category: string; quantity: number }>
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState('today')

  useEffect(() => {
    fetchStats()
  }, [dateRange])

  const fetchStats = async () => {
    try {
      const data = await dashboardApi.getStats({ date_range: dateRange })
      setStats(data)
    } catch (err) {
      console.error('Failed to load dashboard stats:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent className="h-48 animate-pulse bg-gray-100" />
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Impossible de charger les statistiques.</p>
      </div>
    )
  }

  const kpiCards = [
    {
      label: 'Chiffre d\'affaires du jour',
      value: `€${stats.daily_revenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-blue-50 text-blue-700',
      trend: 'up',
    },
    {
      label: 'Chiffre d\'affaires du mois',
      value: `€${stats.monthly_revenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-green-50 text-green-700',
      trend: 'up',
    },
    {
      label: 'Total repas servis',
      value: stats.total_meals.toString(),
      icon: UtensilsCrossed,
      color: 'bg-purple-50 text-purple-700',
      trend: 'up',
    },
    {
      label: 'Total passages',
      value: stats.total_passages.toString(),
      icon: ClipboardList,
      color: 'bg-orange-50 text-orange-700',
      trend: 'up',
    },
    {
      label: 'Services actifs',
      value: stats.active_services.toString(),
      icon: Users,
      color: 'bg-pink-50 text-pink-700',
      trend: 'up',
    },
    {
      label: 'Sous-sites',
      value: stats.sub_sites.toString(),
      icon: MapPin,
      color: 'bg-teal-50 text-teal-700',
      trend: 'up',
    },
    {
      label: 'Sites',
      value: stats.sites.toString(),
      icon: Building2,
      color: 'bg-indigo-50 text-indigo-700',
      trend: 'up',
    },
  ]

  const chartData = {
    dates: stats.revenue_by_day.map(d => d.date),
    revenues: stats.revenue_by_day.map(d => d.revenue),
  }

  const siteChartData = stats.revenue_by_site.map(s => ({
    name: s.site,
    revenue: s.revenue,
  }))

  const subSiteChartData = stats.revenue_by_sub_site.map(s => ({
    name: s.sub_site,
    revenue: s.revenue,
  }))

  const serviceChartData = stats.revenue_by_service.map(s => ({
    name: s.service,
    revenue: s.revenue,
  }))

  const mealPeriodChartData = stats.revenue_by_meal_period.map(m => ({
    name: m.period,
    revenue: m.revenue,
  }))

  const pieData = stats.meal_category_distribution.map((c, i) => ({
    name: c.category,
    value: c.quantity,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }))

  return (
    <div className="space-y-6">
      {/* Date range filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">Tableau de bord</h2>
          <Badge variant="outline" className="border-blue-200 text-blue-700">
            {dateRange === 'today' ? 'Aujourd\'hui' : dateRange === 'week' ? 'Semaine' : 'Mois'}
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={dateRange === 'today' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateRange('today')}
          >
            Aujourd'hui
          </Button>
          <Button
            variant={dateRange === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateRange('week')}
          >
            Semaine
          </Button>
          <Button
            variant={dateRange === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateRange('month')}
          >
            Mois
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", card.color)}>
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by day */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Revenue by Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="dates" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value: any) => [`€${Number(value).toFixed(2)}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="revenues" stroke="#1261A0" strokeWidth={2} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by site */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Revenue by Site</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={siteChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value: any) => [`€${Number(value).toFixed(2)}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#1261A0" radius={[4, 4, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by sub-site */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Revenue by Sub-site</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={subSiteChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value: any) => [`€${Number(value).toFixed(2)}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by service */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Revenue by Service</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={serviceChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value: any) => [`€${Number(value).toFixed(2)}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#60A5FA" radius={[4, 4, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Meal Period Revenue */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Revenue by Meal Period</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mealPeriodChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value: any) => [`€${Number(value).toFixed(2)}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#1261A0" radius={[4, 4, 0, 0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Meal Category Distribution */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Meal Category Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#1261A0"
                dataKey="value"
                nameKey="name"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value: any, name: string) => [`${value} repas`, name]}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}