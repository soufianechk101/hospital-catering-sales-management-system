import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Building2, 
  MapPin, 
  ClipboardList, 
  DollarSign, 
  Users, 
  BarChart3, 
  FileText, 
  Settings,
  LogOut,
  Menu
} from "lucide-react";

const navigation = [
  { name: "Tableau de bord", href: "/", icon: Home },
  { name: "Sites", href: "/sites", icon: Building2 },
  { name: "Sous-sites", href: "/sub-sites", icon: MapPin },
  { name: "Services", href: "/services", icon: ClipboardList },
  { name: "Prix", href: "/prices", icon: DollarSign },
  { name: "Utilisateurs", href: "/users", icon: Users },
  { name: "Journaux", href: "/journals", icon: FileText },
  { name: "Rapports", href: "/reports", icon: BarChart3 },
  { name: "Paramètres", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-blue-900">MediCatering Pro</h2>
            <p className="text-sm text-gray-600">Système de gestion des ventes</p>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-700"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start text-gray-700 hover:bg-gray-50"
              onClick={() => {
                localStorage.removeItem("auth_token");
                window.location.href = "/login";
              }}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}