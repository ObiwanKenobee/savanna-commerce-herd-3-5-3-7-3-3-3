import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  BarChart3,
  Shield,
  Users,
  Settings,
  Activity,
  AlertTriangle,
  Crown,
  Truck,
  DollarSign,
  Eye,
} from "lucide-react";
import SavannaCommandCenter from "./SavannaCommandCenter";

const AdminDashboardOverview: React.FC = () => {
  const adminModules = [
    {
      id: "command-center",
      title: "Savanna Command Center",
      description: "Real-time marketplace operations dashboard",
      icon: "🦁",
      path: "/admin/command-center",
      status: "active",
      priority: "high",
    },
    {
      id: "user-management",
      title: "User Management",
      description: "Manage users, suppliers, and permissions",
      icon: "👥",
      path: "/admin/users",
      status: "active",
      priority: "medium",
    },
    {
      id: "content-moderation",
      title: "Content Moderation",
      description: "Vulture Watch AI and human moderation",
      icon: "🦅",
      path: "/admin/moderation",
      status: "active",
      priority: "high",
    },
    {
      id: "fraud-detection",
      title: "Fraud Detection",
      description: "Security monitoring and fraud prevention",
      icon: "🛡️",
      path: "/admin/security",
      status: "active",
      priority: "high",
    },
    {
      id: "analytics",
      title: "Analytics & Reports",
      description: "Business intelligence and reporting",
      icon: "📊",
      path: "/admin/analytics",
      status: "active",
      priority: "medium",
    },
    {
      id: "logistics",
      title: "Logistics Management",
      description: "Delivery network and supply chain",
      icon: "🚛",
      path: "/admin/logistics",
      status: "active",
      priority: "medium",
    },
  ];

  const quickStats = [
    {
      title: "Active Alerts",
      value: "12",
      change: "+3",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Total Revenue",
      value: "KES 2.4M",
      change: "+18%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Active Suppliers",
      value: "1,247",
      change: "+52",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "System Health",
      value: "98.5%",
      change: "+0.2%",
      icon: Activity,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-4xl">👑</div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Savannah Marketplace Administration Center
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-xs ${stat.color}`}>{stat.change}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Admin Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminModules.map((module) => (
          <Card
            key={module.id}
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
            onClick={() => (window.location.href = module.path)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{module.icon}</span>
                  <span>{module.title}</span>
                </div>
                <Badge
                  variant={
                    module.priority === "high"
                      ? "destructive"
                      : module.priority === "medium"
                        ? "default"
                        : "secondary"
                  }
                >
                  {module.priority}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{module.description}</p>
              <div className="flex items-center justify-between">
                <Badge
                  variant={module.status === "active" ? "default" : "secondary"}
                >
                  {module.status}
                </Badge>
                <Button variant="outline" size="sm">
                  Open Module
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <p className="font-medium">High fraud alert detected</p>
                <p className="text-sm text-muted-foreground">
                  12 fake listings in Kibera - auto-quarantined
                </p>
              </div>
              <span className="text-xs text-muted-foreground">2 min ago</span>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <Shield className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium">M-Pesa reconciliation completed</p>
                <p className="text-sm text-muted-foreground">
                  98.2% success rate - 23 failed transactions recovered
                </p>
              </div>
              <span className="text-xs text-muted-foreground">15 min ago</span>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium">New supplier onboarded</p>
                <p className="text-sm text-muted-foreground">
                  Nakuru Fresh Produce - verified and approved
                </p>
              </div>
              <span className="text-xs text-muted-foreground">1 hour ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AdminDashboardPage: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboardOverview />} />
      <Route path="command-center" element={<SavannaCommandCenter />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminDashboardPage;
