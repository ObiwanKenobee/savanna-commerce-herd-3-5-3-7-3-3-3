import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Wheat,
  Radio,
  Hammer,
  Droplets,
  BookOpen,
  Shield,
  Plus,
  Settings,
  Activity,
  TrendingUp,
  Users,
  MapPin,
  Zap,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface HeritageSystemMetrics {
  granaries: {
    total: number;
    active: number;
    avgPreservation: number;
    totalCapacity: number;
  };
  drumsNetwork: {
    nodes: number;
    activeNodes: number;
    messagesDaily: number;
    networkHealth: number;
  };
  manufacturing: {
    workshops: number;
    activeOrders: number;
    avgEfficiency: number;
    carbonReduced: number;
  };
  knowledge: {
    nfts: number;
    verified: number;
    totalEarnings: number;
    activeContributors: number;
  };
}

export default function AfricanHeritageAdmin() {
  const [activeTab, setActiveTab] = useState("overview");
  const [metrics, setMetrics] = useState<HeritageSystemMetrics>({
    granaries: {
      total: 47,
      active: 43,
      avgPreservation: 89.3,
      totalCapacity: 125000,
    },
    drumsNetwork: {
      nodes: 89,
      activeNodes: 82,
      messagesDaily: 2847,
      networkHealth: 94.1,
    },
    manufacturing: {
      workshops: 156,
      activeOrders: 34,
      avgEfficiency: 76.8,
      carbonReduced: 2.4,
    },
    knowledge: {
      nfts: 234,
      verified: 187,
      totalEarnings: 45780,
      activeContributors: 67,
    },
  });

  const [newGranary, setNewGranary] = useState({
    productType: "",
    location: "",
    capacity: "",
    description: "",
  });

  const [newDrumNode, setNewDrumNode] = useState({
    nodeId: "",
    location: "",
    frequency: "",
    radius: "",
  });

  const [systemAlerts, setSystemAlerts] = useState([
    {
      id: 1,
      type: "granary",
      severity: "warning",
      message: "Humidity levels high in Nakuru Central granary",
      timestamp: "2024-01-16T10:30:00Z",
    },
    {
      id: 2,
      type: "drums",
      severity: "info",
      message: "New drum node connected in Mombasa",
      timestamp: "2024-01-16T09:15:00Z",
    },
    {
      id: 3,
      type: "security",
      severity: "critical",
      message: "Potential fraud pattern detected",
      timestamp: "2024-01-16T08:45:00Z",
    },
  ]);

  const createGranary = async () => {
    try {
      // API call to create granary
      console.log("Creating granary:", newGranary);
      // Reset form
      setNewGranary({
        productType: "",
        location: "",
        capacity: "",
        description: "",
      });
    } catch (error) {
      console.error("Error creating granary:", error);
    }
  };

  const createDrumNode = async () => {
    try {
      // API call to create drum node
      console.log("Creating drum node:", newDrumNode);
      // Reset form
      setNewDrumNode({ nodeId: "", location: "", frequency: "", radius: "" });
    } catch (error) {
      console.error("Error creating drum node:", error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "info":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-green-600 bg-clip-text text-transparent">
            African Heritage Engineering Admin
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor pre-colonial inspired platform features
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
          <Button size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Granary Systems
            </CardTitle>
            <Wheat className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.granaries.active}/{metrics.granaries.total}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.granaries.avgPreservation}% avg preservation
            </p>
            <Progress
              value={(metrics.granaries.active / metrics.granaries.total) * 100}
              className="mt-2 h-1"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drums Network</CardTitle>
            <Radio className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.drumsNetwork.activeNodes}/{metrics.drumsNetwork.nodes}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.drumsNetwork.messagesDaily} messages/day
            </p>
            <Progress
              value={metrics.drumsNetwork.networkHealth}
              className="mt-2 h-1"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Jua Kali Workshops
            </CardTitle>
            <Hammer className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.manufacturing.workshops}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.manufacturing.activeOrders} active orders
            </p>
            <Progress
              value={metrics.manufacturing.avgEfficiency}
              className="mt-2 h-1"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Knowledge NFTs
            </CardTitle>
            <BookOpen className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.knowledge.verified}/{metrics.knowledge.nfts}
            </div>
            <p className="text-xs text-muted-foreground">
              KSh {metrics.knowledge.totalEarnings.toLocaleString()} earned
            </p>
            <Progress
              value={
                (metrics.knowledge.verified / metrics.knowledge.nfts) * 100
              }
              className="mt-2 h-1"
            />
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
              >
                {getSeverityIcon(alert.severity)}
                <div className="flex-1">
                  <div className="font-medium">{alert.message}</div>
                  <div className="text-sm opacity-75">
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  Resolve
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="granaries">Granaries</TabsTrigger>
          <TabsTrigger value="drums">Drums</TabsTrigger>
          <TabsTrigger value="manufacturing">Manufacturing</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Granary Systems", health: 94 },
                  { name: "Drums Network", health: 97 },
                  { name: "Manufacturing", health: 89 },
                  { name: "Knowledge Base", health: 92 },
                  { name: "Security Systems", health: 96 },
                ].map((system) => (
                  <div
                    key={system.name}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{system.name}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={system.health} className="w-20 h-2" />
                      <span className="text-sm font-medium">
                        {system.health}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Wheat className="h-4 w-4 text-amber-500" />
                    <span>New granary deployed in Kisumu</span>
                    <span className="text-muted-foreground ml-auto">
                      2h ago
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Radio className="h-4 w-4 text-purple-500" />
                    <span>Drum node maintenance completed</span>
                    <span className="text-muted-foreground ml-auto">
                      4h ago
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-green-500" />
                    <span>Knowledge NFT verified</span>
                    <span className="text-muted-foreground ml-auto">
                      6h ago
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-red-500" />
                    <span>Security alert resolved</span>
                    <span className="text-muted-foreground ml-auto">
                      8h ago
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="granaries" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Granary Management</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Deploy New Granary
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Deploy New Granary System</DialogTitle>
                  <DialogDescription>
                    Create a new Benin-inspired granary with IoT monitoring
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="productType">Product Type</Label>
                    <Select
                      onValueChange={(value) =>
                        setNewGranary({ ...newGranary, productType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maize">Maize</SelectItem>
                        <SelectItem value="beans">Beans</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="wheat">Wheat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newGranary.location}
                      onChange={(e) =>
                        setNewGranary({
                          ...newGranary,
                          location: e.target.value,
                        })
                      }
                      placeholder="e.g., Nakuru Central"
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacity (kg)</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={newGranary.capacity}
                      onChange={(e) =>
                        setNewGranary({
                          ...newGranary,
                          capacity: e.target.value,
                        })
                      }
                      placeholder="e.g., 5000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newGranary.description}
                      onChange={(e) =>
                        setNewGranary({
                          ...newGranary,
                          description: e.target.value,
                        })
                      }
                      placeholder="Additional details..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={createGranary}>Deploy Granary</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Preservation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      id: 1,
                      product: "White Maize",
                      location: "Nakuru Central",
                      capacity: "5000kg",
                      preservation: 94,
                      status: "Active",
                    },
                    {
                      id: 2,
                      product: "Red Beans",
                      location: "Meru Highlands",
                      capacity: "3000kg",
                      preservation: 89,
                      status: "Active",
                    },
                    {
                      id: 3,
                      product: "Brown Rice",
                      location: "Kisumu West",
                      capacity: "4000kg",
                      preservation: 76,
                      status: "Warning",
                    },
                  ].map((granary) => (
                    <TableRow key={granary.id}>
                      <TableCell className="font-medium">
                        {granary.product}
                      </TableCell>
                      <TableCell>{granary.location}</TableCell>
                      <TableCell>{granary.capacity}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={granary.preservation}
                            className="w-16 h-2"
                          />
                          <span className="text-sm">
                            {granary.preservation}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            granary.status === "Active"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {granary.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            Monitor
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drums" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Talking Drums Network</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Drum Node
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Drum Network Node</DialogTitle>
                  <DialogDescription>
                    Deploy a new Yoruba-inspired communication node
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nodeId">Node ID</Label>
                    <Input
                      id="nodeId"
                      value={newDrumNode.nodeId}
                      onChange={(e) =>
                        setNewDrumNode({
                          ...newDrumNode,
                          nodeId: e.target.value,
                        })
                      }
                      placeholder="e.g., DRUM_NAIROBI_001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="drumLocation">Location</Label>
                    <Input
                      id="drumLocation"
                      value={newDrumNode.location}
                      onChange={(e) =>
                        setNewDrumNode({
                          ...newDrumNode,
                          location: e.target.value,
                        })
                      }
                      placeholder="e.g., Nairobi Central"
                    />
                  </div>
                  <div>
                    <Label htmlFor="frequency">Frequency Range (Hz)</Label>
                    <Input
                      id="frequency"
                      value={newDrumNode.frequency}
                      onChange={(e) =>
                        setNewDrumNode({
                          ...newDrumNode,
                          frequency: e.target.value,
                        })
                      }
                      placeholder="e.g., 50-5000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="radius">Transmission Radius (km)</Label>
                    <Input
                      id="radius"
                      type="number"
                      value={newDrumNode.radius}
                      onChange={(e) =>
                        setNewDrumNode({
                          ...newDrumNode,
                          radius: e.target.value,
                        })
                      }
                      placeholder="e.g., 50"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={createDrumNode}>Deploy Node</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Network Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  94.1%
                </div>
                <Progress value={94.1} className="mb-2" />
                <p className="text-sm text-muted-foreground">
                  82/89 nodes active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Messages Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  2,847
                </div>
                <p className="text-sm text-muted-foreground">
                  +12% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Avg Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  3.2s
                </div>
                <p className="text-sm text-muted-foreground">
                  Across 50km radius
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="manufacturing" className="space-y-4">
          <h3 className="text-lg font-semibold">
            Jua Kali Manufacturing Network
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Workshop Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "3D Printing Hubs", count: 45, efficiency: 82 },
                  { name: "Metalwork Shops", count: 67, efficiency: 76 },
                  { name: "Electronics Labs", count: 23, efficiency: 89 },
                  { name: "Textile Centers", count: 21, efficiency: 74 },
                ].map((workshop) => (
                  <div
                    key={workshop.name}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">{workshop.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {workshop.count} workshops
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{workshop.efficiency}%</div>
                      <div className="text-sm text-muted-foreground">
                        efficiency
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Environmental Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    2.4 tons
                  </div>
                  <div className="text-sm text-muted-foreground">
                    CO₂ reduced this month
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold">89%</div>
                    <div className="text-muted-foreground">
                      Materials recycled
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">156</div>
                    <div className="text-muted-foreground">Solar workshops</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <h3 className="text-lg font-semibold">
            Indigenous Knowledge Management
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">234</div>
                <div className="text-sm text-muted-foreground">Total NFTs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">187</div>
                <div className="text-sm text-muted-foreground">Verified</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">67</div>
                <div className="text-sm text-muted-foreground">
                  Contributors
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  KSh 45,780
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Earnings
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pending Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    title: "Traditional Maize Storage Techniques",
                    contributor: "Mama Wanjiku",
                    category: "Farming",
                  },
                  {
                    title: "Herbal Medicine for Livestock",
                    contributor: "Mzee Kariuki",
                    category: "Medicine",
                  },
                  {
                    title: "Rain Prediction Methods",
                    contributor: "Elder Sankale",
                    category: "Weather",
                  },
                ].map((knowledge, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div>
                      <div className="font-medium">{knowledge.title}</div>
                      <div className="text-sm text-muted-foreground">
                        By {knowledge.contributor} • {knowledge.category}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                      <Button size="sm">Verify</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <h3 className="text-lg font-semibold">Earthen Firewall Security</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Threats Blocked</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 mb-2">45</div>
                <p className="text-sm text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Detection Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  96.8%
                </div>
                <Progress value={96.8} className="mb-2" />
                <p className="text-sm text-muted-foreground">
                  2.1% false positives
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">All Systems Operational</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  7 defense layers active
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
