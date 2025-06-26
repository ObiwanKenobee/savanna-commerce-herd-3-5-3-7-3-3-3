import { useState, useEffect } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Eye,
  Smartphone,
  Users,
  Package,
  TrendingUp,
  Clock,
  Zap,
  Activity,
  Globe,
  Radio,
  AlertTriangle,
  CheckCircle,
  ShoppingCart,
  Truck,
  BarChart3,
} from "lucide-react";

interface NaivasBranch {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  distance: number;
  stockLevel: number;
  customerCount: number;
  lastUpdate: string;
  specialties: string[];
  ussdAccess: boolean;
  microsoft365Connected: boolean;
  status: "active" | "busy" | "low-stock" | "closed";
}

interface InventoryItem {
  id: string;
  product: string;
  category: string;
  branchStock: {
    [branchId: string]: number;
  };
  totalStock: number;
  reorderLevel: number;
  trend: "increasing" | "stable" | "decreasing";
  lastSynced: string;
}

interface USSDSession {
  id: string;
  phoneNumber: string;
  sessionType:
    | "stock-check"
    | "price-inquiry"
    | "branch-locator"
    | "product-search";
  query: string;
  nearestBranch: string;
  timestamp: string;
  resolved: boolean;
}

const Naivas = () => {
  const [branches, setBranches] = useState<NaivasBranch[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [ussdSessions, setUssdSessions] = useState<USSDSession[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("giraffe-view");

  useEffect(() => {
    // Mock Naivas branches data
    const mockBranches: NaivasBranch[] = [
      {
        id: "naivas-nakuru",
        name: "Naivas Nakuru",
        location: "Nakuru Town Center",
        coordinates: { lat: -0.3031, lng: 36.08 },
        distance: 0,
        stockLevel: 87,
        customerCount: 234,
        lastUpdate: "2 minutes ago",
        specialties: ["Electronics", "Fresh Produce", "Pharmacy"],
        ussdAccess: true,
        microsoft365Connected: true,
        status: "active",
      },
      {
        id: "naivas-nakuru-west",
        name: "Naivas Nakuru West",
        location: "Section 58",
        coordinates: { lat: -0.312, lng: 36.0701 },
        distance: 2.3,
        stockLevel: 92,
        customerCount: 156,
        lastUpdate: "1 minute ago",
        specialties: ["Household Items", "Baby Care", "Clothing"],
        ussdAccess: true,
        microsoft365Connected: true,
        status: "active",
      },
      {
        id: "naivas-nakuru-east",
        name: "Naivas Pipeline",
        location: "Pipeline Estate",
        coordinates: { lat: -0.2987, lng: 36.0934 },
        distance: 3.1,
        stockLevel: 34,
        customerCount: 89,
        lastUpdate: "8 minutes ago",
        specialties: ["Groceries", "Beverages", "Snacks"],
        ussdAccess: true,
        microsoft365Connected: false,
        status: "low-stock",
      },
      {
        id: "naivas-gilgil",
        name: "Naivas Gilgil",
        location: "Gilgil Town",
        coordinates: { lat: -0.5069, lng: 36.3173 },
        distance: 45.2,
        stockLevel: 78,
        customerCount: 67,
        lastUpdate: "15 minutes ago",
        specialties: ["Agricultural Supplies", "Hardware", "Groceries"],
        ussdAccess: true,
        microsoft365Connected: true,
        status: "active",
      },
      {
        id: "naivas-naivasha",
        name: "Naivas Naivasha",
        location: "Naivasha Town",
        coordinates: { lat: -0.7167, lng: 36.4333 },
        distance: 67.8,
        stockLevel: 45,
        customerCount: 123,
        lastUpdate: "22 minutes ago",
        specialties: ["Tourism Supplies", "Fresh Fish", "Flowers"],
        ussdAccess: true,
        microsoft365Connected: true,
        status: "busy",
      },
    ];

    // Mock inventory data across branches
    const mockInventory: InventoryItem[] = [
      {
        id: "inv-001",
        product: "Unga wa Mahindi 2kg",
        category: "Food Staples",
        branchStock: {
          "naivas-nakuru": 45,
          "naivas-nakuru-west": 67,
          "naivas-nakuru-east": 12,
          "naivas-gilgil": 34,
          "naivas-naivasha": 23,
        },
        totalStock: 181,
        reorderLevel: 50,
        trend: "decreasing",
        lastSynced: "3 minutes ago",
      },
      {
        id: "inv-002",
        product: "Cooking Oil 1L",
        category: "Cooking Essentials",
        branchStock: {
          "naivas-nakuru": 89,
          "naivas-nakuru-west": 76,
          "naivas-nakuru-east": 23,
          "naivas-gilgil": 56,
          "naivas-naivasha": 34,
        },
        totalStock: 278,
        reorderLevel: 80,
        trend: "stable",
        lastSynced: "1 minute ago",
      },
      {
        id: "inv-003",
        product: "Rice 5kg Pishori",
        category: "Food Staples",
        branchStock: {
          "naivas-nakuru": 67,
          "naivas-nakuru-west": 45,
          "naivas-nakuru-east": 8,
          "naivas-gilgil": 23,
          "naivas-naivasha": 12,
        },
        totalStock: 155,
        reorderLevel: 40,
        trend: "increasing",
        lastSynced: "5 minutes ago",
      },
    ];

    // Mock USSD sessions
    const mockUSSDSessions: USSDSession[] = [
      {
        id: "ussd-001",
        phoneNumber: "+254701234567",
        sessionType: "stock-check",
        query: "Unga wa mahindi availability",
        nearestBranch: "Naivas Nakuru",
        timestamp: "2 minutes ago",
        resolved: true,
      },
      {
        id: "ussd-002",
        phoneNumber: "+254722345678",
        sessionType: "branch-locator",
        query: "Nearest Naivas with pharmacy",
        nearestBranch: "Naivas Nakuru",
        timestamp: "5 minutes ago",
        resolved: true,
      },
      {
        id: "ussd-003",
        phoneNumber: "+254733456789",
        sessionType: "price-inquiry",
        query: "Cooking oil prices comparison",
        nearestBranch: "Naivas Nakuru West",
        timestamp: "8 minutes ago",
        resolved: false,
      },
    ];

    setBranches(mockBranches);
    setInventory(mockInventory);
    setUssdSessions(mockUSSDSessions);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "busy":
        return "bg-yellow-100 text-yellow-700";
      case "low-stock":
        return "bg-orange-100 text-orange-700";
      case "closed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "increasing":
        return "text-green-600";
      case "stable":
        return "text-blue-600";
      case "decreasing":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return "📈";
      case "stable":
        return "📊";
      case "decreasing":
        return "📉";
      default:
        return "📊";
    }
  };

  const activateGiraffeView = () => {
    alert(
      `🦒 Giraffe View Activated!\n\nScanning 5 nearest branches...\nReal-time inventory sync enabled\nUSSD hotline *384*NAIVAS# now live\nCustomer can see stock across all locations`,
    );
  };

  const syncMicrosoft365 = () => {
    alert(
      `🔄 Microsoft 365 Integration\n\nEmployee authentication syncing...\nInventory data flowing to Teams\nPower BI dashboards updated\nOutlook calendar integration active`,
    );
  };

  const totalStats = {
    totalBranches: branches.length,
    averageStock: Math.round(
      branches.reduce((sum, b) => sum + b.stockLevel, 0) / branches.length,
    ),
    totalCustomers: branches.reduce((sum, b) => sum + b.customerCount, 0),
    ussdSessions: ussdSessions.length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            🦒 Naivas Giraffe View
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            <strong>Hyperlocal Branch Intelligence</strong> - See across your
            neighborhood network like a giraffe scanning the savannah. Real-time
            inventory sync, USSD accessibility, and Microsoft 365 integration.
          </p>
          <div className="mt-4 text-sm text-green-600 font-medium">
            Hyperlocal Sync • USSD Access *384*NAIVAS# • Microsoft 365
            Integration • 5-Branch View
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6 text-center">
              <MapPin className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-3xl font-bold text-green-700">
                {totalStats.totalBranches}
              </div>
              <div className="text-sm text-green-600">Network Branches</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <Package className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-3xl font-bold text-blue-700">
                {totalStats.averageStock}%
              </div>
              <div className="text-sm text-blue-600">Avg Stock Level</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-700">
                {totalStats.totalCustomers}
              </div>
              <div className="text-sm text-purple-600">Active Customers</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="pt-6 text-center">
              <Radio className="h-8 w-8 mx-auto text-amber-600 mb-2" />
              <div className="text-3xl font-bold text-amber-700">
                {totalStats.ussdSessions}
              </div>
              <div className="text-sm text-amber-600">USSD Sessions</div>
            </CardContent>
          </Card>
        </div>

        {/* Giraffe View Alert */}
        <Alert className="mb-8 border-green-200 bg-green-50">
          <Eye className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>🦒 Giraffe View Active:</strong> Monitoring 5 branches
              within 70km radius. Real-time inventory sync enabled. USSD hotline
              *384*NAIVAS# serving 1,247 daily queries.
            </div>
            <Button size="sm" onClick={activateGiraffeView}>
              Refresh View
            </Button>
          </AlertDescription>
        </Alert>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="giraffe-view">🦒 Giraffe View</TabsTrigger>
            <TabsTrigger value="inventory-sync">📦 Inventory Sync</TabsTrigger>
            <TabsTrigger value="ussd-access">📱 USSD Access</TabsTrigger>
            <TabsTrigger value="microsoft365">🔄 Microsoft 365</TabsTrigger>
          </TabsList>

          <TabsContent value="giraffe-view" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Branch Network Map */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5" />
                      <span>5 Nearest Branches Network</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {branches.map((branch) => (
                      <div
                        key={branch.id}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">🦒</span>
                            <div>
                              <h4 className="font-semibold text-green-800">
                                {branch.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {branch.location}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(branch.status)}>
                              {branch.status}
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-1">
                              {branch.distance === 0
                                ? "Current Location"
                                : `${branch.distance}km away`}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">
                              Stock:
                            </span>
                            <div className="font-medium">
                              {branch.stockLevel}%
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Customers:
                            </span>
                            <div className="font-medium">
                              {branch.customerCount}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Updated:
                            </span>
                            <div className="font-medium">
                              {branch.lastUpdate}
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <Progress value={branch.stockLevel} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {branch.specialties.map((specialty, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex space-x-1">
                            {branch.ussdAccess && (
                              <Badge className="bg-blue-100 text-blue-700 text-xs">
                                USSD
                              </Badge>
                            )}
                            {branch.microsoft365Connected && (
                              <Badge className="bg-purple-100 text-purple-700 text-xs">
                                M365
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button
                      className="w-full justify-start"
                      onClick={activateGiraffeView}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Refresh Giraffe View
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={syncMicrosoft365}
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Sync Microsoft 365
                    </Button>

                    <Button variant="outline" className="w-full justify-start">
                      <Radio className="h-4 w-4 mr-2" />
                      Test USSD Hotline
                    </Button>

                    <Button variant="outline" className="w-full justify-start">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Cross-Branch Transfer
                    </Button>

                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Branch Performance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory-sync" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Real-time Inventory Sync</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {inventory.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {item.product}
                        </h4>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">
                            {getTrendIcon(item.trend)}
                          </span>
                          <span
                            className={`font-medium ${getTrendColor(item.trend)}`}
                          >
                            {item.trend}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Last synced: {item.lastSynced}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      {Object.entries(item.branchStock).map(
                        ([branchId, stock]) => {
                          const branch = branches.find(
                            (b) => b.id === branchId,
                          );
                          return (
                            <div
                              key={branchId}
                              className="text-center p-2 bg-gray-50 rounded"
                            >
                              <div className="font-medium">
                                {branch?.name.split(" ")[1] || branchId}
                              </div>
                              <div
                                className={`text-lg font-bold ${
                                  stock <= item.reorderLevel
                                    ? "text-red-600"
                                    : "text-green-600"
                                }`}
                              >
                                {stock}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                units
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Total Stock:{" "}
                        </span>
                        <span className="font-medium">
                          {item.totalStock} units
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          (Reorder at {item.reorderLevel})
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Transfer Stock
                        </Button>
                        <Button size="sm" variant="outline">
                          Reorder
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ussd-access" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Radio className="h-5 w-5" />
                    <span>USSD Hotline *384*NAIVAS#</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="border-blue-200 bg-blue-50">
                    <Smartphone className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Active Hotline:</strong> *384*NAIVAS# provides
                      stock checks, price inquiries, and branch locations to any
                      mobile phone.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <h5 className="font-semibold">USSD Menu Structure:</h5>
                    <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm">
                      *384*NAIVAS#
                      <br />
                      1. Check stock at nearest branch
                      <br />
                      2. Compare prices across branches
                      <br />
                      3. Find branch with specific item
                      <br />
                      4. Get directions to branch
                      <br />
                      5. Store hours and contact info
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        1,247
                      </div>
                      <div className="text-sm text-green-500">
                        Daily USSD Users
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        94%
                      </div>
                      <div className="text-sm text-blue-500">
                        Query Success Rate
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Recent USSD Sessions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ussdSessions.map((session) => (
                    <div key={session.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-sm capitalize">
                          {session.sessionType.replace("-", " ")}
                        </div>
                        <Badge
                          variant={session.resolved ? "default" : "secondary"}
                        >
                          {session.resolved ? "Resolved" : "Pending"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Query: {session.query}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        {session.phoneNumber} • {session.timestamp} •{" "}
                        {session.nearestBranch}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="microsoft365" className="space-y-6">
            <Card className="p-8 text-center">
              <CardContent>
                <div className="text-6xl mb-4">🔄</div>
                <h3 className="text-xl font-bold mb-2">
                  Microsoft 365 Integration
                </h3>
                <p className="text-muted-foreground">
                  Employee authentication through Azure AD, inventory data
                  syncing to Teams, Power BI analytics dashboards, and Outlook
                  calendar integration for staff scheduling.
                </p>
                <Button className="mt-4" onClick={syncMicrosoft365}>
                  <Activity className="h-4 w-4 mr-2" />
                  Sync Microsoft 365
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Naivas;
