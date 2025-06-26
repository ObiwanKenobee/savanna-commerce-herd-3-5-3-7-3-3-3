import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  CreditCard,
  Shield,
  AlertTriangle,
  TrendingUp,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  type: "supplier" | "retailer" | "logistics";
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  status: "active" | "suspended" | "pending";
  creditScore: number;
  ltv: number;
  orders: number;
  lastActive: string;
  verification: {
    email: boolean;
    phone: boolean;
    kyc: boolean;
    business: boolean;
  };
  avatar?: string;
}

interface OnboardingStep {
  step: string;
  completion: number;
  dropoffRate: number;
  icon: string;
}

const UserManagement = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const users: User[] = [
    {
      id: "1",
      name: "Mama Mboga Enterprises",
      type: "supplier",
      email: "mama@mboga.co.ke",
      phone: "+254712345678",
      location: "Nakuru, Kenya",
      joinDate: "2024-01-15",
      status: "active",
      creditScore: 850,
      ltv: 45000,
      orders: 234,
      lastActive: "2 hours ago",
      verification: { email: true, phone: true, kyc: true, business: true },
    },
    {
      id: "2",
      name: "Kiosks R Us",
      type: "retailer",
      email: "admin@kiosks.co.ke",
      phone: "+254723456789",
      location: "Nairobi, Kenya",
      joinDate: "2024-02-20",
      status: "active",
      creditScore: 720,
      ltv: 23000,
      orders: 156,
      lastActive: "1 hour ago",
      verification: { email: true, phone: true, kyc: false, business: true },
    },
    {
      id: "3",
      name: "SwiftTrans Logistics",
      type: "logistics",
      email: "ops@swifttrans.ke",
      phone: "+254734567890",
      location: "Mombasa, Kenya",
      joinDate: "2024-03-10",
      status: "pending",
      creditScore: 650,
      ltv: 12000,
      orders: 89,
      lastActive: "5 hours ago",
      verification: { email: true, phone: false, kyc: false, business: false },
    },
  ];

  const onboardingSteps: OnboardingStep[] = [
    { step: "Registration", completion: 100, dropoffRate: 0, icon: "📝" },
    { step: "Email Verification", completion: 85, dropoffRate: 15, icon: "📧" },
    { step: "Phone Verification", completion: 72, dropoffRate: 13, icon: "📱" },
    { step: "KYC Documents", completion: 42, dropoffRate: 30, icon: "🆔" },
    {
      step: "Business Verification",
      completion: 35,
      dropoffRate: 7,
      icon: "🏢",
    },
    { step: "First Order", completion: 28, dropoffRate: 7, icon: "🛒" },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      userTypeFilter === "all" || user.type === userTypeFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case "supplier":
        return "🦁";
      case "retailer":
        return "🦓";
      case "logistics":
        return "🐆";
      default:
        return "👤";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 800) return "text-green-600";
    if (score >= 700) return "text-yellow-600";
    return "text-red-600";
  };

  const UserDetailModal = ({ user }: { user: User }) => (
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{getUserTypeIcon(user.type)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-bold">{user.name}</h3>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Elephant Memory Profile */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🐘 Elephant Memory Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">User Type</p>
                  <p className="font-medium">
                    {getUserTypeIcon(user.type)} {user.type}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{user.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Active</p>
                  <p className="font-medium">{user.lastActive}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Order History & Behavior</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Orders</span>
                    <span className="font-bold">{user.orders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lifetime Value</span>
                    <span className="font-bold">
                      KSH {user.ltv.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Credit Score</span>
                    <span
                      className={`font-bold ${getCreditScoreColor(user.creditScore)}`}
                    >
                      {user.creditScore}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification Status */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>🦏 Rhino Certification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Email</span>
                {user.verification.email ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Phone</span>
                {user.verification.phone ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">KYC Documents</span>
                {user.verification.kyc ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-yellow-600" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Business License</span>
                {user.verification.business ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>

              <div className="pt-3 border-t">
                <Button size="sm" className="w-full">
                  Review Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-6">
        <Button variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
        <Button variant="outline">
          <CreditCard className="h-4 w-4 mr-2" />
          BNPL Settings
        </Button>
        <Button variant="outline">
          <Shield className="h-4 w-4 mr-2" />
          Security Log
        </Button>
        <Button variant="destructive">
          <Ban className="h-4 w-4 mr-2" />
          Suspend User
        </Button>
      </div>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">🦁 Pride Control Center</h1>
          <p className="text-muted-foreground">
            Manage the savanna ecosystem participants
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <UserCheck className="h-4 w-4 mr-2" />
            Bulk Approve
          </Button>
          <Button>
            <TrendingUp className="h-4 w-4 mr-2" />
            LTV Analysis
          </Button>
        </div>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">👥 Pride Members</TabsTrigger>
          <TabsTrigger value="onboarding">🚪 Drought Zones</TabsTrigger>
          <TabsTrigger value="analytics">📊 Herd Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="User Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="supplier">🦁 Suppliers</SelectItem>
                <SelectItem value="retailer">🦓 Retailers</SelectItem>
                <SelectItem value="logistics">🐆 Logistics</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* User Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {getUserTypeIcon(user.type)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Type:</span>
                      <span>
                        {getUserTypeIcon(user.type)} {user.type}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>LTV:</span>
                      <span className="font-medium">
                        KSH {user.ltv.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Credit:</span>
                      <span className={getCreditScoreColor(user.creditScore)}>
                        {user.creditScore}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Orders:</span>
                      <span>{user.orders}</span>
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div className="flex gap-1 mb-4">
                    {user.verification.email && (
                      <Badge variant="secondary" className="text-xs">
                        📧
                      </Badge>
                    )}
                    {user.verification.phone && (
                      <Badge variant="secondary" className="text-xs">
                        📱
                      </Badge>
                    )}
                    {user.verification.kyc && (
                      <Badge variant="secondary" className="text-xs">
                        🆔
                      </Badge>
                    )}
                    {user.verification.business && (
                      <Badge variant="secondary" className="text-xs">
                        🏢
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <UserDetailModal user={user} />
                    </Dialog>

                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="onboarding" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏜️ Onboarding Drought Zones - Drop-off Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {onboardingSteps.map((step, index) => (
                  <div key={step.step} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{step.icon}</span>
                        <span className="font-medium">{step.step}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {step.completion}% completion
                        </span>
                        {step.dropoffRate > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            -{step.dropoffRate}% drop-off
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Progress
                        value={step.completion}
                        className="flex-1 h-3"
                      />
                      <span className="text-sm font-medium w-12">
                        {step.completion}%
                      </span>
                    </div>

                    {step.dropoffRate > 20 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 ml-8">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-red-800 font-medium">
                            Critical Drop-off Zone
                          </span>
                        </div>
                        <p className="text-sm text-red-600 mt-1">
                          Suggested fix: Implement USSD/SMS alternative for
                          low-internet areas
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  🎯 Growth Lever Recommendations
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Streamline KYC with mobile-friendly document upload</li>
                  <li>• Add WhatsApp integration for business verification</li>
                  <li>
                    • Implement progressive onboarding with partial access
                  </li>
                  <li>
                    • Create USSD fallback for rural areas with poor internet
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>👑 High-LTV Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Top 10% Users</span>
                    <Badge>KSH 890K avg LTV</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Dairy Cooperatives</span>
                    <Badge variant="secondary">67% of revenue</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Retention Rate</span>
                    <Badge variant="secondary">94.2%</Badge>
                  </div>
                </div>
                <Button className="w-full mt-4" size="sm">
                  Launch Loyalty Rewards
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📈 Growth Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monthly Active Users</span>
                    <span className="font-bold">+23.4%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">New Registrations</span>
                    <span className="font-bold">+15.7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Churn Rate</span>
                    <span className="font-bold text-green-600">-2.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🏆 User Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>🦁 Suppliers</span>
                    <span>1,247 (34%)</span>
                  </div>
                  <Progress value={34} className="h-2" />

                  <div className="flex justify-between text-sm">
                    <span>🦓 Retailers</span>
                    <span>2,156 (59%)</span>
                  </div>
                  <Progress value={59} className="h-2" />

                  <div className="flex justify-between text-sm">
                    <span>🐆 Logistics</span>
                    <span>256 (7%)</span>
                  </div>
                  <Progress value={7} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;
