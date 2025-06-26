
import EnterpriseNavigation from "@/components/EnterpriseNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  Shield,
  Zap,
  Globe,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react";

const Supply = () => {
  const supplyChainMetrics = [
    { label: "Active Routes", value: "1,247", icon: Truck, change: "+18%" },
    { label: "Shipments Tracked", value: "45,892", icon: Package, change: "+23%" },
    { label: "Delivery Accuracy", value: "97.8%", icon: CheckCircle, change: "+2.1%" },
    { label: "Avg. Transit Time", value: "2.3 days", icon: Clock, change: "-15%" }
  ];

  const activeShipments = [
    {
      id: "SH-2024-001",
      origin: "Nairobi, Kenya",
      destination: "Kampala, Uganda",
      status: "In Transit",
      progress: 65,
      eta: "2 hours",
      value: "KSH 2.4M",
      carrier: "East Africa Logistics"
    },
    {
      id: "SH-2024-002",
      origin: "Mombasa, Kenya",
      destination: "Dar es Salaam, Tanzania",
      status: "Customs",
      progress: 85,
      eta: "4 hours",
      value: "KSH 1.8M",
      carrier: "Coastal Express"
    },
    {
      id: "SH-2024-003",
      origin: "Kigali, Rwanda",
      destination: "Nairobi, Kenya",
      status: "Delivered",
      progress: 100,
      eta: "Completed",
      value: "KSH 950K",
      carrier: "Rwanda Direct"
    }
  ];

  const supplyChainNodes = [
    {
      location: "Nairobi Distribution Hub",
      type: "Primary Hub",
      capacity: "85%",
      throughput: "12,500 packages/day",
      status: "Operational",
      efficiency: 92
    },
    {
      location: "Mombasa Port Terminal",
      type: "Import/Export",
      capacity: "73%",
      throughput: "8,900 containers/month",
      status: "Operational",
      efficiency: 88
    },
    {
      location: "Kisumu Regional Center",
      type: "Regional Hub",
      capacity: "61%",
      throughput: "4,200 packages/day",
      status: "Operational",
      efficiency: 85
    },
    {
      location: "Eldoret Processing Facility",
      type: "Processing",
      capacity: "45%",
      throughput: "2,800 units/day",
      status: "Maintenance",
      efficiency: 78
    }
  ];

  const riskAlerts = [
    {
      level: "Medium",
      title: "Weather Disruption Alert",
      description: "Heavy rainfall expected on Nairobi-Mombasa route affecting 15 shipments",
      impact: "2-4 hour delays",
      action: "Reroute recommended"
    },
    {
      level: "Low",
      title: "Border Processing Delay",
      description: "Slight delays at Kenya-Uganda border due to system upgrades",
      impact: "30-60 minute delays",
      action: "Monitor closely"
    },
    {
      level: "High",
      title: "Supplier Capacity Issue",
      description: "Major supplier in Nakuru reporting 40% capacity reduction",
      impact: "Supply shortage risk",
      action: "Activate backup suppliers"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered": return "bg-green-500";
      case "in transit": return "bg-blue-500";
      case "customs": return "bg-yellow-500";
      case "delayed": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high": return "border-red-500 bg-red-50";
      case "medium": return "border-yellow-500 bg-yellow-50";
      case "low": return "border-green-500 bg-green-50";
      default: return "border-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <EnterpriseNavigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Supply Chain Command Center
          </h1>
          <p className="text-muted-foreground text-lg">
            Real-time visibility and control across the African logistics network
          </p>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {supplyChainMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="h-8 w-8 text-primary" />
                    <Badge className="bg-green-500">{metric.change}</Badge>
                  </div>
                  <div className="text-2xl font-bold mb-1">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="tracking" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
            <TabsTrigger value="network">Network Status</TabsTrigger>
            <TabsTrigger value="optimization">Route Optimization</TabsTrigger>
            <TabsTrigger value="risk">Risk Management</TabsTrigger>
          </TabsList>

          <TabsContent value="tracking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Real-Time Shipment Tracking</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shipment ID</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>ETA</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Carrier</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeShipments.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell className="font-medium">{shipment.id}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{shipment.origin}</div>
                            <div className="text-muted-foreground">→ {shipment.destination}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(shipment.status)}>
                            {shipment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="w-20">
                            <Progress value={shipment.progress} className="h-2" />
                            <span className="text-xs text-muted-foreground">{shipment.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{shipment.eta}</TableCell>
                        <TableCell className="font-medium">{shipment.value}</TableCell>
                        <TableCell>{shipment.carrier}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network" className="space-y-6">
            <div className="grid gap-6">
              {supplyChainNodes.map((node, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{node.location}</CardTitle>
                        <Badge variant="outline">{node.type}</Badge>
                      </div>
                      <Badge className={node.status === "Operational" ? "bg-green-500" : "bg-yellow-500"}>
                        {node.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Capacity Utilization</p>
                        <p className="font-bold text-lg">{node.capacity}</p>
                        <Progress value={parseInt(node.capacity)} className="h-2 mt-1" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Throughput</p>
                        <p className="font-bold">{node.throughput}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Efficiency Score</p>
                        <p className="font-bold text-green-600">{node.efficiency}%</p>
                      </div>
                      <div>
                        <Button size="sm" variant="outline" className="w-full">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>AI Route Optimization</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800">Efficiency Gains</h4>
                      <p className="text-sm text-green-600">23% reduction in average delivery time</p>
                      <p className="text-sm text-green-600">18% fuel cost savings</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800">Active Optimizations</h4>
                      <p className="text-sm text-blue-600">247 routes currently optimized</p>
                      <p className="text-sm text-blue-600">Real-time traffic integration</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>Cross-Border Efficiency</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Digital Customs Integration</span>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Automated Documentation</span>
                      <Badge className="bg-green-500">98% Success Rate</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Border Processing Time</span>
                      <Badge className="bg-blue-500">-45% Reduction</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Active Risk Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskAlerts.map((alert, index) => (
                    <div key={index} className={`p-4 border-l-4 rounded-lg ${getRiskColor(alert.level)}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{alert.title}</h4>
                          <Badge variant="outline">{alert.level} Risk</Badge>
                        </div>
                        <Button size="sm" variant="outline">Take Action</Button>
                      </div>
                      <p className="text-muted-foreground mb-2">{alert.description}</p>
                      <div className="text-sm">
                        <span className="font-medium">Impact:</span> {alert.impact} | 
                        <span className="font-medium"> Recommended Action:</span> {alert.action}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Mitigation Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">87%</div>
                  <p className="text-sm text-muted-foreground">
                    Supply chain resilience index
                  </p>
                  <Progress value={87} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Backup Suppliers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">156</div>
                  <p className="text-sm text-muted-foreground">
                    Alternative suppliers activated
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Insurance Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">KSH 2.8B</div>
                  <p className="text-sm text-muted-foreground">
                    Total shipment value covered
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Supply;
