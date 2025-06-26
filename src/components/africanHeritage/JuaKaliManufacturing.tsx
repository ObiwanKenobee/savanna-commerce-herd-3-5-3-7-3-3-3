import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Wrench,
  Package,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Factory,
  Hammer,
} from "lucide-react";

interface Workshop {
  id: string;
  name: string;
  location: string;
  specialization: string;
  craftsmen: number;
  capacity: number;
  currentProduction: number;
  efficiency: number;
  status: "active" | "maintenance" | "idle";
  totalOrders: number;
  completedOrders: number;
}

interface ManufacturingOrder {
  id: string;
  product: string;
  workshop: string;
  quantity: number;
  progress: number;
  status: "pending" | "in-progress" | "completed" | "delayed";
  estimatedCompletion: string;
  priority: "low" | "medium" | "high";
  cost: number;
}

export const JuaKaliManufacturing = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([
    {
      id: "workshop-001",
      name: "Kariakoo Metalworks",
      location: "Dar es Salaam",
      specialization: "Metal fabrication",
      craftsmen: 12,
      capacity: 100,
      currentProduction: 85,
      efficiency: 92,
      status: "active",
      totalOrders: 45,
      completedOrders: 38,
    },
    {
      id: "workshop-002",
      name: "Gikomba Textiles",
      location: "Nairobi",
      specialization: "Clothing & textiles",
      craftsmen: 18,
      capacity: 150,
      currentProduction: 120,
      efficiency: 88,
      status: "active",
      totalOrders: 67,
      completedOrders: 59,
    },
    {
      id: "workshop-003",
      name: "Mwenge Woodcraft",
      location: "Mwanza",
      specialization: "Furniture & carpentry",
      craftsmen: 8,
      capacity: 60,
      currentProduction: 0,
      efficiency: 0,
      status: "maintenance",
      totalOrders: 23,
      completedOrders: 20,
    },
    {
      id: "workshop-004",
      name: "Eastleigh Electronics",
      location: "Nairobi",
      specialization: "Electronics assembly",
      craftsmen: 15,
      capacity: 200,
      currentProduction: 160,
      efficiency: 95,
      status: "active",
      totalOrders: 89,
      completedOrders: 84,
    },
  ]);

  const [orders, setOrders] = useState<ManufacturingOrder[]>([
    {
      id: "order-001",
      product: "Solar panel mounting brackets",
      workshop: "Kariakoo Metalworks",
      quantity: 100,
      progress: 75,
      status: "in-progress",
      estimatedCompletion: "2 days",
      priority: "high",
      cost: 2500,
    },
    {
      id: "order-002",
      product: "School uniform sets",
      workshop: "Gikomba Textiles",
      quantity: 250,
      progress: 100,
      status: "completed",
      estimatedCompletion: "Completed",
      priority: "medium",
      cost: 5000,
    },
    {
      id: "order-003",
      product: "Office desks",
      workshop: "Mwenge Woodcraft",
      quantity: 20,
      progress: 0,
      status: "pending",
      estimatedCompletion: "Pending",
      priority: "low",
      cost: 3200,
    },
    {
      id: "order-004",
      product: "Mobile phone chargers",
      workshop: "Eastleigh Electronics",
      quantity: 500,
      progress: 60,
      status: "in-progress",
      estimatedCompletion: "3 days",
      priority: "medium",
      cost: 1800,
    },
  ]);

  const [totalProduction, setTotalProduction] = useState(365);
  const [activeWorkshops, setActiveWorkshops] = useState(3);
  const [totalCraftsmen, setTotalCraftsmen] = useState(53);
  const [averageEfficiency, setAverageEfficiency] = useState(91.7);

  useEffect(() => {
    // Calculate metrics from workshops
    const active = workshops.filter((w) => w.status === "active").length;
    const totalCrafts = workshops.reduce((sum, w) => sum + w.craftsmen, 0);
    const avgEff =
      workshops.reduce((sum, w) => sum + w.efficiency, 0) / workshops.length;

    setActiveWorkshops(active);
    setTotalCraftsmen(totalCrafts);
    setAverageEfficiency(Math.round(avgEff * 10) / 10);
  }, [workshops]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "maintenance":
        return "text-yellow-600 bg-yellow-100";
      case "idle":
        return "text-gray-600 bg-gray-100";
      case "completed":
        return "text-green-600 bg-green-100";
      case "in-progress":
        return "text-blue-600 bg-blue-100";
      case "delayed":
        return "text-red-600 bg-red-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-orange-600 bg-orange-100";
      case "low":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Manufacturing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Production
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalProduction}
                </p>
              </div>
              <Factory className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Active Workshops
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {activeWorkshops}/4
                </p>
              </div>
              <Wrench className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Craftsmen</p>
                <p className="text-2xl font-bold text-purple-600">
                  {totalCraftsmen}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Efficiency</p>
                <p className="text-2xl font-bold text-orange-600">
                  {averageEfficiency}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workshop Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Hammer className="mr-2 h-5 w-5" />
            Jua Kali Workshops
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workshops.map((workshop) => (
              <Card
                key={workshop.id}
                className="border-l-4 border-l-orange-500"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{workshop.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {workshop.location}
                      </p>
                      <p className="text-xs text-orange-600">
                        {workshop.specialization}
                      </p>
                    </div>
                    <Badge className={getStatusColor(workshop.status)}>
                      {workshop.status}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Production Capacity</span>
                      <span className="font-medium">
                        {workshop.currentProduction}/{workshop.capacity}
                      </span>
                    </div>
                    <Progress
                      value={
                        (workshop.currentProduction / workshop.capacity) * 100
                      }
                      className="h-2"
                    />

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Craftsmen</p>
                        <p className="font-medium">{workshop.craftsmen}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Efficiency</p>
                        <p className="font-medium">{workshop.efficiency}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Orders</p>
                        <p className="font-medium">
                          {workshop.completedOrders}/{workshop.totalOrders}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Manufacturing Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Active Manufacturing Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{order.product}</h3>
                      <Badge className={getPriorityColor(order.priority)}>
                        {order.priority}
                      </Badge>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {order.workshop}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Quantity</p>
                        <p className="font-medium">{order.quantity} units</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Progress</p>
                        <p className="font-medium">{order.progress}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cost</p>
                        <p className="font-medium">${order.cost}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Completion</p>
                        <p className="font-medium">
                          {order.estimatedCompletion}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {order.status === "completed" && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {order.status === "delayed" && (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    {order.status === "in-progress" && (
                      <Clock className="h-5 w-5 text-blue-600" />
                    )}
                    {order.status === "pending" && (
                      <Clock className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                </div>
                {order.status === "in-progress" && (
                  <div className="mt-2">
                    <Progress value={order.progress} className="h-2" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Management Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Manufacturing Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              <Package className="mr-2 h-4 w-4" />
              Create Order
            </Button>
            <Button variant="outline" size="sm">
              <Users className="mr-2 h-4 w-4" />
              Manage Craftsmen
            </Button>
            <Button variant="outline" size="sm">
              <TrendingUp className="mr-2 h-4 w-4" />
              Performance Report
            </Button>
            <Button variant="outline" size="sm">
              <DollarSign className="mr-2 h-4 w-4" />
              Cost Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
