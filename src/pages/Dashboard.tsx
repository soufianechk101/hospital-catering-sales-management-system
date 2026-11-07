import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, UtensilsCrossed, ClipboardList, Building2, MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { toast } from "@/components/ui/toast";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState({
    start_date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`/api/dashboard/stats?date=${dateRange.end_date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
  });

  const { data: revenueByDay, isLoading: revenueLoading } = useQuery({
    queryKey: ["dashboard-revenue-by-day", dateRange],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`/api/dashboard/revenue-by-day?start_date=${dateRange.start_date}&end_date=${dateRange.end_date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
  });

  const { data: revenueBySite, isLoading: siteLoading } = useQuery({
    queryKey: ["dashboard-revenue-by-site", dateRange],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`/api/dashboard/revenue-by-site?start_date=${dateRange.start_date}&end_date=${dateRange.end_date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  if (statsLoading) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>;
  }

  const kpis = [
    {
      title: "Chiffre d'affaires du jour",
      value: formatCurrency(stats?.today_revenue || 0),
      icon: DollarSign,
      description: "Total des ventes du jour",
    },
    {
      title: "Chiffre d'affaires du mois",
      value: formatCurrency(stats?.month_revenue || 0),
      icon: DollarSign,
      description: "Total des ventes du mois",
    },
    {
      title: "Repas servis",
      value: stats?.today_meals?.toString() || "0",
      icon: UtensilsCrossed,
      description: "Total des repas du jour",
    },
    {
      title: "Services actifs",
      value: stats?.active_services?.toString() || "0",
      icon: ClipboardList,
      description: "Services opérationnels",
    },
    {
      title: "Sous-sites",
      value: stats?.sub_sites?.toString() || "0",
      icon: MapPin,
      description: "Sous-sites actifs",
    },
    {
      title: "Sites",
      value: stats?.sites?.toString() || "0",
      icon: Building2,
      description: "Sites actifs",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Tableau de bord</h1>
          <p className="text-gray-600">Vue d'ensemble des performances de vente</p>
        </div>
        <div className="flex items-center space-x-2">
          <Input type="date" value={dateRange.start_date} onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })} />
          <span className="text-gray-600">à</span>
          <Input type="date" value={dateRange.end_date} onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index} className="bg-white border border-gray-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{kpi.title}</CardTitle>
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                <kpi.icon className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{kpi.value}</div>
              <p className="text-xs text-gray-500 mt-1">{kpi.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenus par jour</CardTitle>
            <CardDescription>Évolution des revenus sur la période</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueLoading ? (
              <div className="h-64 flex items-center justify-center">Chargement...</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueByDay?.map((d: any) => ({ date: d.date, revenue: parseFloat(d.revenue) })) || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#1261A0" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenus par site</CardTitle>
            <CardDescription>Comparaison des revenus par site</CardDescription>
          </CardHeader>
          <CardContent>
            {siteLoading ? (
              <div className="h-64 flex items-center justify-center">Chargement...</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueBySite || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="site_name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#1261A0" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}