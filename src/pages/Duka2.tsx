import { useState, useEffect } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Store,
  Sun,
  Zap,
  Fingerprint,
  QrCode,
  Wifi,
  TrendingUp,
  MapPin,
  ShoppingCart,
  CreditCard,
  Battery,
  Monitor,
  Users,
  Clock,
  Star,
  Activity,
  Smartphone,
  Eye,
} from "lucide-react";

interface SmartKiosk {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  owner: string;
  status: "online" | "offline" | "maintenance";
  solarCharge: number;
  batteryLevel: number;
  dailySales: number;
  monthlyRevenue: number;
  productsCount: number;
  lastSync: string;
  customerSatisfaction: number;
  technologies: string[];
  operatingHours: string;
  connectivity: "wifi" | "4g" | "satellite" | "offline";
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  kioskId: string;
  einkDisplay: boolean;
  popularityScore: number;
  lastUpdated: string;
}

interface Transaction {
  id: string;
  kioskId: string;
  productId: string;
  amount: number;
  paymentMethod: "fingerprint-mpesa" | "qr-code" | "nfc" | "voice-command";
  customerType: "local" | "tourist" | "regular";
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

const Duka2 = () => {
  const [kiosks, setKiosks] = useState<SmartKiosk[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedKiosk, setSelectedKiosk] = useState<SmartKiosk | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "kiosks" | "products" | "analytics"
  >("overview");

  useEffect(() => {
    // Mock smart kiosks data
    const mockKiosks: SmartKiosk[] = [
      {
        id: "duka-001",
        name: "Kibera Solar Duka",
        location: "Kibera, Nairobi",
        coordinates: { lat: -1.3133, lng: 36.7833 },
        owner: "Mary Wanjiku",
        status: "online",
        solarCharge: 92,
        batteryLevel: 87,
        dailySales: 15600,
        monthlyRevenue: 345000,
        productsCount: 127,
        lastSync: "2 minutes ago",
        customerSatisfaction: 4.8,
        technologies: [
          "E-ink Pricing",
          "Fingerprint Payment",
          "Solar Power",
          "Offline Mode",
        ],
        operatingHours: "6:00 AM - 10:00 PM",
        connectivity: "4g",
      },
      {
        id: "duka-002",
        name: "Mombasa Beach Kiosk",
        location: "Mombasa Old Town",
        coordinates: { lat: -4.0435, lng: 39.6682 },
        owner: "Ahmed Hassan",
        status: "online",
        solarCharge: 78,
        batteryLevel: 65,
        dailySales: 23400,
        monthlyRevenue: 567000,
        productsCount: 89,
        lastSync: "5 minutes ago",
        customerSatisfaction: 4.6,
        technologies: [
          "Multi-language Display",
          "Tourist Mode",
          "Currency Converter",
          "QR Payments",
        ],
        operatingHours: "5:00 AM - 11:00 PM",
        connectivity: "wifi",
      },
      {
        id: "duka-003",
        name: "Maasai Mara Trading Post",
        location: "Maasai Mara, Narok",
        coordinates: { lat: -1.4833, lng: 35.15 },
        owner: "John Ole Kina",
        status: "maintenance",
        solarCharge: 45,
        batteryLevel: 32,
        dailySales: 8900,
        monthlyRevenue: 178000,
        productsCount: 156,
        lastSync: "2 hours ago",
        customerSatisfaction: 4.9,
        technologies: [
          "Satellite Internet",
          "Weather Resistant",
          "Wildlife Camera",
          "Emergency Beacon",
        ],
        operatingHours: "5:30 AM - 9:30 PM",
        connectivity: "satellite",
      },
    ];

    // Mock products data
    const mockProducts: Product[] = [
      {
        id: "prod-001",
        name: "Unga wa Mahindi (Maize Flour)",
        category: "Food Staples",
        price: 120,
        stock: 45,
        kioskId: "duka-001",
        einkDisplay: true,
        popularityScore: 95,
        lastUpdated: "1 hour ago",
      },
      {
        id: "prod-002",
        name: "Mafuta ya Kupikia (Cooking Oil)",
        category: "Cooking Essentials",
        price: 280,
        stock: 23,
        kioskId: "duka-001",
        einkDisplay: true,
        popularityScore: 87,
        lastUpdated: "30 minutes ago",
      },
      {
        id: "prod-003",
        name: "Solar Phone Charger",
        category: "Electronics",
        price: 1500,
        stock: 8,
        kioskId: "duka-002",
        einkDisplay: true,
        popularityScore: 76,
        lastUpdated: "15 minutes ago",
      },
    ];

    // Mock transactions
    const mockTransactions: Transaction[] = [
      {
        id: "tx-001",
        kioskId: "duka-001",
        productId: "prod-001",
        amount: 120,
        paymentMethod: "fingerprint-mpesa",
        customerType: "regular",
        timestamp: "5 minutes ago",
        status: "completed",
      },
      {
        id: "tx-002",
        kioskId: "duka-002",
        productId: "prod-003",
        amount: 1500,
        paymentMethod: "qr-code",
        customerType: "tourist",
        timestamp: "12 minutes ago",
        status: "completed",
      },
    ];

    setKiosks(mockKiosks);
    setProducts(mockProducts);
    setTransactions(mockTransactions);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-700";
      case "offline":
        return "bg-red-100 text-red-700";
      case "maintenance":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getConnectivityIcon = (connectivity: string) => {
    switch (connectivity) {
      case "wifi":
        return <Wifi className="h-4 w-4 text-blue-600" />;
      case "4g":
        return <Smartphone className="h-4 w-4 text-green-600" />;
      case "satellite":
        return <Activity className="h-4 w-4 text-purple-600" />;
      case "offline":
        return <Monitor className="h-4 w-4 text-gray-600" />;
      default:
        return <Monitor className="h-4 w-4 text-gray-600" />;
    }
  };

  const totalStats = {
    totalKiosks: kiosks.length,
    onlineKiosks: kiosks.filter((k) => k.status === "online").length,
    totalDailySales: kiosks.reduce((sum, kiosk) => sum + kiosk.dailySales, 0),
    avgSatisfaction:
      Math.round(
        (kiosks.reduce((sum, kiosk) => sum + kiosk.customerSatisfaction, 0) /
          kiosks.length) *
          10,
      ) / 10,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
            ☀️ Duka 2.0: Solar Smart Kiosks
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            <strong>Solar-powered smart kiosks</strong> with e-ink pricing
            displays and fingerprint-to-M-Pesa payments. Autonomous retail units
            for off-grid communities with real-time inventory and solar energy
            management.
          </p>
          <div className="mt-4 text-sm text-amber-600 font-medium">
            Solar-Powered • E-ink Displays • Fingerprint Payments •
            Offline-First Design • IoT Sensors
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
            <CardContent className="pt-6 text-center">
              <Store className="h-8 w-8 mx-auto text-amber-600 mb-2" />
              <div className="text-3xl font-bold text-amber-700">
                {totalStats.totalKiosks}
              </div>
              <div className="text-sm text-amber-600">Total Kiosks</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6 text-center">
              <Zap className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-3xl font-bold text-green-700">
                {totalStats.onlineKiosks}
              </div>
              <div className="text-sm text-green-600">Online Now</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-3xl font-bold text-blue-700">
                KSH {totalStats.totalDailySales.toLocaleString()}
              </div>
              <div className="text-sm text-blue-600">Daily Sales</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="pt-6 text-center">
              <Star className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-700">
                {totalStats.avgSatisfaction}
              </div>
              <div className="text-sm text-purple-600">Avg Satisfaction</div>
            </CardContent>
          </Card>
        </div>

        {/* Solar Power Alert */}
        <Alert className="mb-8 border-yellow-200 bg-yellow-50">
          <Sun className="h-4 w-4" />
          <AlertDescription>
            <strong>Solar-Powered Network:</strong> All kiosks run on 100% solar
            energy with battery backup. E-ink displays require minimal power and
            update pricing automatically via satellite or cellular connection.
          </AlertDescription>
        </Alert>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(["overview", "kiosks", "products", "analytics"] as const).map(
            (tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                onClick={() => setActiveTab(tab)}
                className="capitalize"
              >
                {tab === "overview" && <Eye className="h-4 w-4 mr-2" />}
                {tab === "kiosks" && <Store className="h-4 w-4 mr-2" />}
                {tab === "products" && (
                  <ShoppingCart className="h-4 w-4 mr-2" />
                )}
                {tab === "analytics" && <TrendingUp className="h-4 w-4 mr-2" />}
                {tab}
              </Button>
            ),
          )}
        </div>

        {/* Kiosks Tab */}
        {activeTab === "kiosks" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Kiosk Listings */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold">🏪 Smart Kiosks Network</h2>

              {kiosks.map((kiosk) => (
                <Card
                  key={kiosk.id}
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedKiosk(kiosk)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{kiosk.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {kiosk.location}
                          </span>
                          <Badge className={getStatusColor(kiosk.status)}>
                            {kiosk.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          KSH {kiosk.dailySales.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Daily Sales
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Power Status */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Sun className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium">
                            Solar Charge
                          </span>
                        </div>
                        <Progress value={kiosk.solarCharge} className="h-2" />
                        <div className="text-xs text-muted-foreground mt-1">
                          {kiosk.solarCharge}%
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Battery className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">
                            Battery Level
                          </span>
                        </div>
                        <Progress value={kiosk.batteryLevel} className="h-2" />
                        <div className="text-xs text-muted-foreground mt-1">
                          {kiosk.batteryLevel}%
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-amber-600">
                          Products:
                        </span>
                        <div>{kiosk.productsCount} items</div>
                      </div>
                      <div>
                        <span className="font-medium text-amber-600">
                          Owner:
                        </span>
                        <div>{kiosk.owner}</div>
                      </div>
                      <div>
                        <span className="font-medium text-amber-600">
                          Rating:
                        </span>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          {kiosk.customerSatisfaction}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-amber-600">
                          Connectivity:
                        </span>
                        <div className="flex items-center">
                          {getConnectivityIcon(kiosk.connectivity)}
                          <span className="ml-1 capitalize">
                            {kiosk.connectivity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {kiosk.technologies.map((tech, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center space-x-3">
                      <Button size="sm">
                        <Monitor className="h-3 w-3 mr-1" />
                        Remote Control
                      </Button>
                      <Button size="sm" variant="outline">
                        <QrCode className="h-3 w-3 mr-1" />
                        QR Menu
                      </Button>
                      <Button size="sm" variant="outline">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {selectedKiosk ? (
                /* Kiosk Details */
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Store className="h-5 w-5" />
                      <span>{selectedKiosk.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Operating Status</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge
                            className={getStatusColor(selectedKiosk.status)}
                          >
                            {selectedKiosk.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Hours:</span>
                          <span className="text-sm">
                            {selectedKiosk.operatingHours}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Last sync: {selectedKiosk.lastSync}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Power Management</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Solar Panel:</span>
                            <span>{selectedKiosk.solarCharge}%</span>
                          </div>
                          <Progress
                            value={selectedKiosk.solarCharge}
                            className="h-2 mt-1"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Battery:</span>
                            <span>{selectedKiosk.batteryLevel}%</span>
                          </div>
                          <Progress
                            value={selectedKiosk.batteryLevel}
                            className="h-2 mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Performance</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Monthly Revenue:</span>
                          <span className="font-bold">
                            KSH {selectedKiosk.monthlyRevenue.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Customer Rating:</span>
                          <span className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                            {selectedKiosk.customerSatisfaction}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* How It Works */
                <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-amber-700">
                      How Duka 2.0 Works
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        1
                      </div>
                      <div>
                        <strong>Solar Power:</strong> 100% solar with battery
                        backup for 24/7 operation
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <div>
                        <strong>E-ink Displays:</strong> Ultra-low power pricing
                        that updates automatically
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        3
                      </div>
                      <div>
                        <strong>Biometric Payments:</strong>{" "}
                        Fingerprint-to-M-Pesa for secure transactions
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        4
                      </div>
                      <div>
                        <strong>Offline Mode:</strong> Functions without
                        internet, syncs when connected
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Recent Transactions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">
                            {transaction.paymentMethod}
                          </span>
                          <Badge
                            variant={
                              transaction.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          KSH {transaction.amount.toLocaleString()} •{" "}
                          {transaction.timestamp}
                        </div>
                        <div className="text-xs text-blue-600 mt-1 capitalize">
                          {transaction.customerType} customer
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {activeTab !== "kiosks" && (
          <Card className="p-8 text-center">
            <CardContent>
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-bold mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                Dashboard
              </h3>
              <p className="text-muted-foreground">
                Advanced {activeTab} features coming soon. This will include
                detailed solar energy analytics, product performance tracking,
                and revenue optimization insights.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Duka2;
