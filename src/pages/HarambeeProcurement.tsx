import { useState, useEffect } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Heart,
  DollarSign,
  Clock,
  MapPin,
  Phone,
  ShoppingCart,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Globe,
  Zap,
  Target,
  Award,
} from "lucide-react";

interface CollectiveBid {
  id: string;
  productName: string;
  category: string;
  targetQuantity: number;
  unitOfMeasure: string;
  maxPricePerUnit: number;
  currentCommitted: number;
  participantCount: number;
  timeRemaining: string;
  organizer: string;
  location: string;
  status: "active" | "funding" | "executing" | "completed";
  description: string;
  estimatedSavings: number;
}

interface Participant {
  name: string;
  phone: string;
  quantity: number;
  committed: number;
  location: string;
  joinedDate: string;
}

const HarambeeProcurement = () => {
  const [activeBids, setActiveBids] = useState<CollectiveBid[]>([]);
  const [selectedBid, setSelectedBid] = useState<CollectiveBid | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [joinQuantity, setJoinQuantity] = useState(1);
  const [newBidForm, setNewBidForm] = useState({
    productName: "",
    category: "",
    targetQuantity: 0,
    maxPrice: 0,
    description: "",
  });

  useEffect(() => {
    // Mock collective bids data
    const mockBids: CollectiveBid[] = [
      {
        id: "bid-001",
        productName: "Unga (Maize Flour)",
        category: "Grains & Cereals",
        targetQuantity: 1000,
        unitOfMeasure: "50kg bags",
        maxPricePerUnit: 4500,
        currentCommitted: 650,
        participantCount: 47,
        timeRemaining: "2 days, 14 hours",
        organizer: "Mary Wanjiku (Kibera Traders Chama)",
        location: "Nairobi County",
        status: "active",
        description:
          "Bulk purchase of quality maize flour for retail shops in Kibera. Group procurement from certified miller with 6-month quality guarantee.",
        estimatedSavings: 950,
      },
      {
        id: "bid-002",
        productName: "Solar Panels (100W)",
        category: "Energy Solutions",
        targetQuantity: 200,
        unitOfMeasure: "units",
        maxPricePerUnit: 15000,
        currentCommitted: 145,
        participantCount: 23,
        timeRemaining: "5 days, 8 hours",
        organizer: "James Kiprotich (Renewable Energy Coop)",
        location: "Rift Valley",
        status: "active",
        description:
          "Community solar panel procurement for rural electrification project. Includes installation training and 10-year warranty.",
        estimatedSavings: 3500,
      },
      {
        id: "bid-003",
        productName: "Mobile Phone Accessories",
        category: "Electronics",
        targetQuantity: 500,
        unitOfMeasure: "mixed bundles",
        maxPricePerUnit: 1200,
        currentCommitted: 380,
        participantCount: 34,
        timeRemaining: "1 day, 6 hours",
        organizer: "Grace Muthoni (Electronics Vendors Association)",
        location: "Mombasa County",
        status: "funding",
        description:
          "Assorted phone accessories (chargers, cases, screen protectors) for electronics vendors. Quality tested imports with return guarantee.",
        estimatedSavings: 400,
      },
      {
        id: "bid-004",
        productName: "Fertilizer (NPK)",
        category: "Agricultural Inputs",
        targetQuantity: 2000,
        unitOfMeasure: "50kg bags",
        maxPricePerUnit: 3800,
        currentCommitted: 1200,
        participantCount: 89,
        timeRemaining: "3 days, 12 hours",
        organizer: "Samuel Kiptoo (Farmers Cooperative)",
        location: "Trans Nzoia County",
        status: "active",
        description:
          "Premium NPK fertilizer for maize and wheat farming. Direct import from manufacturer with soil testing support included.",
        estimatedSavings: 800,
      },
    ];

    setActiveBids(mockBids);

    // Mock participants for selected bid
    const mockParticipants: Participant[] = [
      {
        name: "Peter Macharia",
        phone: "+254712****78",
        quantity: 20,
        committed: 90000,
        location: "Kibera, Nairobi",
        joinedDate: "2 days ago",
      },
      {
        name: "Agnes Wambui",
        phone: "+254723****45",
        quantity: 15,
        committed: 67500,
        location: "Mathare, Nairobi",
        joinedDate: "1 day ago",
      },
      {
        name: "John Ochieng",
        phone: "+254734****91",
        quantity: 25,
        committed: 112500,
        location: "Kawangware, Nairobi",
        joinedDate: "3 hours ago",
      },
    ];

    setParticipants(mockParticipants);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "funding":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "executing":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "completed":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <TrendingUp className="h-4 w-4" />;
      case "funding":
        return <DollarSign className="h-4 w-4" />;
      case "executing":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const joinCollectiveBid = (bidId: string, quantity: number) => {
    // Simulate USSD integration
    alert(
      `USSD Message Sent:\n\n*384*HARAMBEE*${bidId}*${quantity}#\n\nReply with M-Pesa PIN to confirm joining collective bid`,
    );
  };

  const createNewBid = () => {
    // Simulate DAO smart contract creation
    const newBid: CollectiveBid = {
      id: `bid-${Date.now()}`,
      productName: newBidForm.productName,
      category: newBidForm.category,
      targetQuantity: newBidForm.targetQuantity,
      unitOfMeasure: "units",
      maxPricePerUnit: newBidForm.maxPrice,
      currentCommitted: 0,
      participantCount: 1,
      timeRemaining: "7 days",
      organizer: "Your Business",
      location: "Your County",
      status: "active",
      description: newBidForm.description,
      estimatedSavings: Math.round(newBidForm.maxPrice * 0.2),
    };

    setActiveBids([newBid, ...activeBids]);
    setNewBidForm({
      productName: "",
      category: "",
      targetQuantity: 0,
      maxPrice: 0,
      description: "",
    });
    alert(
      "New Harambee bid created! Smart contract deployed on Celo blockchain.",
    );
  };

  const overallStats = {
    totalBids: activeBids.length,
    totalParticipants: activeBids.reduce(
      (sum, bid) => sum + bid.participantCount,
      0,
    ),
    totalSavings: activeBids.reduce(
      (sum, bid) => sum + bid.estimatedSavings * bid.participantCount,
      0,
    ),
    avgSavings:
      activeBids.length > 0
        ? Math.round(
            activeBids.reduce((sum, bid) => sum + bid.estimatedSavings, 0) /
              activeBids.length,
          )
        : 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            🤝 Harambee Procurement
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            <strong>"Mkono moja haulei mwana"</strong> - Collective buying power
            through traditional <em>harambee</em> principles. Small shops unite
            via USSD to bid on bulk orders, achieving 40% cost reductions
            through DAO smart contracts.
          </p>
          <div className="mt-4 text-sm text-green-600 font-medium">
            Powered by Celo Blockchain • M-Pesa Settlement • USSD Integration
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6 text-center">
              <Heart className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-3xl font-bold text-green-700">
                {overallStats.totalBids}
              </div>
              <div className="text-sm text-green-600">Active Harambee Bids</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-3xl font-bold text-blue-700">
                {overallStats.totalParticipants}
              </div>
              <div className="text-sm text-blue-600">Participating Shops</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="pt-6 text-center">
              <DollarSign className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-700">
                KSH {overallStats.totalSavings.toLocaleString()}
              </div>
              <div className="text-sm text-purple-600">Total Savings</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <div className="text-3xl font-bold text-orange-700">
                {overallStats.avgSavings}
              </div>
              <div className="text-sm text-orange-600">
                Avg Savings per Unit
              </div>
            </CardContent>
          </Card>
        </div>

        {/* USSD Integration Alert */}
        <Alert className="mb-8 border-green-200 bg-green-50">
          <Phone className="h-4 w-4" />
          <AlertDescription>
            <strong>USSD Access:</strong> Join any Harambee bid by dialing{" "}
            <code className="bg-green-100 px-2 py-1 rounded">
              *384*HARAMBEE*[BID-ID]#
            </code>
            from any phone. No smartphone or internet required!
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Bids List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">🛍️ Active Collective Bids</h2>
              <Button onClick={() => setSelectedBid(null)}>
                + Create New Harambee
              </Button>
            </div>

            {activeBids.map((bid) => (
              <Card
                key={bid.id}
                className="hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedBid(bid)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl text-green-700">
                        {bid.productName}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{bid.category}</Badge>
                        <Badge className={getStatusColor(bid.status)}>
                          {getStatusIcon(bid.status)}
                          <span className="ml-1 capitalize">{bid.status}</span>
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        KSH {bid.estimatedSavings.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        savings per unit
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {bid.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-green-600">
                        Target:
                      </span>
                      <div>
                        {bid.targetQuantity.toLocaleString()}{" "}
                        {bid.unitOfMeasure}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-green-600">
                        Max Price:
                      </span>
                      <div>KSH {bid.maxPricePerUnit.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="font-medium text-green-600">
                        Location:
                      </span>
                      <div>{bid.location}</div>
                    </div>
                    <div>
                      <span className="font-medium text-green-600">
                        Time Left:
                      </span>
                      <div>{bid.timeRemaining}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        Progress ({bid.participantCount} participants)
                      </span>
                      <span>
                        {Math.round(
                          (bid.currentCommitted / bid.targetQuantity) * 100,
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={(bid.currentCommitted / bid.targetQuantity) * 100}
                      className="h-3"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {bid.currentCommitted.toLocaleString()} committed
                      </span>
                      <span>{bid.targetQuantity.toLocaleString()} target</span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        joinCollectiveBid(bid.id, joinQuantity);
                      }}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Join Harambee
                    </Button>
                    <Button variant="outline" size="sm">
                      <Globe className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {selectedBid ? (
              /* Bid Details */
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Bid Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">
                      {selectedBid.productName}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedBid.description}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Organizer:</span>
                      <span className="font-medium">
                        {selectedBid.organizer}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>USSD Code:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        *384*{selectedBid.id.split("-")[1]}#
                      </code>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Join with quantity:
                    </label>
                    <Input
                      type="number"
                      value={joinQuantity}
                      onChange={(e) => setJoinQuantity(Number(e.target.value))}
                      className="mt-1"
                      min="1"
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={() =>
                      joinCollectiveBid(selectedBid.id, joinQuantity)
                    }
                  >
                    Join with {joinQuantity} units
                  </Button>
                </CardContent>
              </Card>
            ) : (
              /* Create New Bid Form */
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Create Harambee Bid</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Product Name</label>
                    <Input
                      value={newBidForm.productName}
                      onChange={(e) =>
                        setNewBidForm({
                          ...newBidForm,
                          productName: e.target.value,
                        })
                      }
                      placeholder="e.g., Unga (Maize Flour)"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={newBidForm.category}
                      onChange={(e) =>
                        setNewBidForm({
                          ...newBidForm,
                          category: e.target.value,
                        })
                      }
                      className="w-full mt-1 p-2 border rounded-lg"
                    >
                      <option value="">Select category...</option>
                      <option value="Grains & Cereals">Grains & Cereals</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Agricultural Inputs">
                        Agricultural Inputs
                      </option>
                      <option value="Energy Solutions">Energy Solutions</option>
                      <option value="Office Supplies">Office Supplies</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Target Quantity
                    </label>
                    <Input
                      type="number"
                      value={newBidForm.targetQuantity}
                      onChange={(e) =>
                        setNewBidForm({
                          ...newBidForm,
                          targetQuantity: Number(e.target.value),
                        })
                      }
                      placeholder="1000"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Max Price per Unit (KSH)
                    </label>
                    <Input
                      type="number"
                      value={newBidForm.maxPrice}
                      onChange={(e) =>
                        setNewBidForm({
                          ...newBidForm,
                          maxPrice: Number(e.target.value),
                        })
                      }
                      placeholder="4500"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newBidForm.description}
                      onChange={(e) =>
                        setNewBidForm({
                          ...newBidForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe the product, quality requirements, and terms..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={createNewBid}
                    disabled={
                      !newBidForm.productName ||
                      !newBidForm.category ||
                      newBidForm.targetQuantity <= 0
                    }
                  >
                    Create Harambee DAO
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Participants List */}
            {selectedBid && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Participants ({selectedBid.participantCount})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {participants.slice(0, 5).map((participant, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div>
                          <div className="font-medium text-sm">
                            {participant.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {participant.location}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {participant.quantity} units
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {participant.joinedDate}
                          </div>
                        </div>
                      </div>
                    ))}
                    {selectedBid.participantCount > 5 && (
                      <div className="text-center text-sm text-muted-foreground">
                        +{selectedBid.participantCount - 5} more participants
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* How It Works */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700">
                  How Harambee Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div>
                    <strong>Create or Join:</strong> Start a collective bid or
                    join via USSD
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div>
                    <strong>Pool Resources:</strong> Smart contract locks M-Pesa
                    funds
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div>
                    <strong>Bulk Purchase:</strong> Automated procurement when
                    target reached
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <div>
                    <strong>Distribute:</strong> Products delivered, savings
                    distributed
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HarambeeProcurement;
