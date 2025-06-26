import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  innovationService,
  ChamaDAO,
  ChambaMember,
  BulkOrder,
} from "@/services/innovationService";
import {
  Users,
  DollarSign,
  Vote,
  Package,
  Coins,
  Shield,
  TrendingUp,
  HeartHandshake,
  Globe,
  Lock,
  Zap,
  Star,
  Plus,
  Minus,
  CheckCircle,
  Clock,
  Award,
} from "lucide-react";

interface ChamaDAOSystemProps {
  className?: string;
}

export const ChamaDAOSystem = ({ className }: ChamaDAOSystemProps) => {
  const { toast } = useToast();
  const [chamas, setChamas] = useState<ChamaDAO[]>([]);
  const [selectedChama, setSelectedChama] = useState<ChamaDAO | null>(null);
  const [isCreatingChama, setIsCreatingChama] = useState(false);
  const [newChamaName, setNewChamaName] = useState("");
  const [stakeAmount, setStakeAmount] = useState(5000);
  const [loading, setLoading] = useState(false);
  const [userStake, setUserStake] = useState(0);
  const [votingPower, setVotingPower] = useState(0);

  useEffect(() => {
    loadMockChamas();
  }, []);

  const loadMockChamas = () => {
    const mockChamas: ChamaDAO[] = [
      {
        id: "chama_kibera_traders",
        name: "Kibera Fresh Produce Chama",
        members: [
          {
            user_id: "user_1",
            stake_amount: 10000,
            voting_power: 25,
            contribution_score: 4.8,
            join_date: "2024-01-15",
          },
          {
            user_id: "user_2",
            stake_amount: 15000,
            voting_power: 35,
            contribution_score: 4.9,
            join_date: "2024-01-10",
          },
          {
            user_id: "user_3",
            stake_amount: 8000,
            voting_power: 20,
            contribution_score: 4.6,
            join_date: "2024-01-20",
          },
          {
            user_id: "user_4",
            stake_amount: 12000,
            voting_power: 30,
            contribution_score: 4.7,
            join_date: "2024-01-12",
          },
        ],
        pool_balance: 850000,
        smart_contract_address: "0x1234567890abcdef1234567890abcdef12345678",
        governance_rules: [
          { rule: "Minimum 5 members for bulk order", threshold: 5 },
          { rule: "60% majority for governance decisions", threshold: 0.6 },
          { rule: "Maximum individual stake: 40%", threshold: 0.4 },
        ],
        bulk_orders: [
          {
            id: "order_1",
            products: ["Unga wa Pembe 50kg", "Sukari 25kg", "Mafuta 20L"],
            total_amount: 125000,
            member_contributions: {
              user_1: 31250,
              user_2: 46875,
              user_3: 25000,
              user_4: 37500,
            },
            status: "active",
          },
        ],
      },
      {
        id: "chama_eastlands_electronics",
        name: "Eastlands Electronics Collective",
        members: [
          {
            user_id: "user_5",
            stake_amount: 25000,
            voting_power: 40,
            contribution_score: 4.9,
            join_date: "2024-02-01",
          },
          {
            user_id: "user_6",
            stake_amount: 20000,
            voting_power: 35,
            contribution_score: 4.8,
            join_date: "2024-02-03",
          },
          {
            user_id: "user_7",
            stake_amount: 15000,
            voting_power: 25,
            contribution_score: 4.7,
            join_date: "2024-02-05",
          },
        ],
        pool_balance: 1200000,
        smart_contract_address: "0xabcdef1234567890abcdef1234567890abcdef12",
        governance_rules: [
          { rule: "Minimum 3 members for bulk order", threshold: 3 },
          { rule: "70% majority for governance decisions", threshold: 0.7 },
        ],
        bulk_orders: [],
      },
    ];

    setChamas(mockChamas);
    if (mockChamas.length > 0) {
      setSelectedChama(mockChamas[0]);
      setUserStake(mockChamas[0].members[0]?.stake_amount || 0);
      setVotingPower(mockChamas[0].members[0]?.voting_power || 0);
    }
  };

  const createNewChama = async () => {
    if (!newChamaName.trim()) {
      toast({
        title: "❌ Validation Error",
        description: "Please enter a chama name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const newChama = await innovationService.createChamaDAO({
        name: newChamaName,
        members: [
          {
            user_id: "current_user",
            stake_amount: stakeAmount,
            voting_power: 100,
            contribution_score: 5.0,
            join_date: new Date().toISOString(),
          },
        ],
      });

      setChamas((prev) => [...prev, newChama]);
      setSelectedChama(newChama);
      setIsCreatingChama(false);
      setNewChamaName("");

      toast({
        title: "🎉 Chama Created Successfully",
        description: `${newChama.name} is now active on Celo blockchain!`,
      });
    } catch (error) {
      toast({
        title: "❌ Creation Failed",
        description: "Failed to create chama. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const joinChama = async (chamaId: string) => {
    setLoading(true);
    try {
      // Simulate joining chama
      const chama = chamas.find((c) => c.id === chamaId);
      if (chama) {
        const newMember: ChambaMember = {
          user_id: "current_user",
          stake_amount: stakeAmount,
          voting_power: Math.floor((stakeAmount / chama.pool_balance) * 100),
          contribution_score: 5.0,
          join_date: new Date().toISOString(),
        };

        chama.members.push(newMember);
        chama.pool_balance += stakeAmount;

        setUserStake(stakeAmount);
        setVotingPower(newMember.voting_power);

        toast({
          title: "🤝 Successfully Joined Chama",
          description: `You are now a member of ${chama.name}!`,
        });
      }
    } catch (error) {
      toast({
        title: "❌ Join Failed",
        description: "Failed to join chama. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createBulkOrder = async () => {
    if (!selectedChama) return;

    const newOrder: BulkOrder = {
      id: `order_${Date.now()}`,
      products: ["Unga wa Pembe 100kg", "Sukari 50kg", "Rice 75kg"],
      total_amount: 250000,
      member_contributions: {},
      status: "active",
    };

    // Calculate contributions based on voting power
    selectedChama.members.forEach((member) => {
      const contribution = (member.voting_power / 100) * newOrder.total_amount;
      newOrder.member_contributions[member.user_id] = contribution;
    });

    selectedChama.bulk_orders.push(newOrder);

    toast({
      title: "📦 Bulk Order Created",
      description: `KSH ${newOrder.total_amount.toLocaleString()} order initiated via smart contract`,
    });
  };

  const getStakePercentage = (stake: number, totalPool: number) => {
    return totalPool > 0 ? (stake / totalPool) * 100 : 0;
  };

  const getMembershipTier = (contributionScore: number) => {
    if (contributionScore >= 4.8)
      return { tier: "Gold", color: "text-yellow-600", icon: "👑" };
    if (contributionScore >= 4.5)
      return { tier: "Silver", color: "text-gray-600", icon: "🥈" };
    return { tier: "Bronze", color: "text-orange-600", icon: "🥉" };
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Chama DAO Header */}
      <div className="text-center space-y-4 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
        <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-green-700">
          <Users className="w-8 h-8" />
          <span>Chama DAOs - Digital Trade Circles</span>
          <Coins className="w-8 h-8" />
        </div>
        <p className="text-green-600 max-w-2xl mx-auto">
          Form blockchain-powered co-ops that pool orders and credit, just like
          traditional chamas but with smart contracts and automatic bulk
          discounts.
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-green-600">
          <div className="flex items-center space-x-1">
            <Globe className="w-4 h-4" />
            <span>Celo Blockchain</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="w-4 h-4" />
            <span>Smart Contracts</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4" />
            <span>Auto Bulk Discounts</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chama Selection & Creation */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700">
              <Users className="w-5 h-5" />
              <span>Available Chamas</span>
              <Badge className="bg-green-100 text-green-700">
                {chamas.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Create New Chama */}
            <div className="space-y-3">
              <Button
                onClick={() => setIsCreatingChama(!isCreatingChama)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Chama
              </Button>

              {isCreatingChama && (
                <div className="space-y-3 p-3 bg-white rounded border">
                  <Input
                    placeholder="Enter chama name"
                    value={newChamaName}
                    onChange={(e) => setNewChamaName(e.target.value)}
                  />
                  <div>
                    <label className="text-sm font-medium">
                      Initial Stake (KSH)
                    </label>
                    <Input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(Number(e.target.value))}
                      min={1000}
                      step={1000}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={createNewChama}
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Create
                    </Button>
                    <Button
                      onClick={() => setIsCreatingChama(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Existing Chamas */}
            <div className="space-y-3">
              {chamas.map((chama) => (
                <div
                  key={chama.id}
                  className={`p-3 rounded border cursor-pointer transition-all ${
                    selectedChama?.id === chama.id
                      ? "bg-green-100 border-green-300"
                      : "bg-white border-gray-200 hover:border-green-200"
                  }`}
                  onClick={() => setSelectedChama(chama)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{chama.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {chama.members.length} members
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Pool Balance:</span>
                      <span className="font-medium">
                        KSH {chama.pool_balance.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Orders:</span>
                      <span className="font-medium">
                        {chama.bulk_orders.length}
                      </span>
                    </div>
                  </div>

                  {!chama.members.find((m) => m.user_id === "current_user") && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        joinChama(chama.id);
                      }}
                      size="sm"
                      className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
                      disabled={loading}
                    >
                      Join Chama
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Chama Details */}
        {selectedChama && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-700">
                <Shield className="w-5 h-5" />
                <span>{selectedChama.name}</span>
                <Badge className="bg-blue-100 text-blue-700">Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chama Overview */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white p-3 rounded">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedChama.members.length}
                    </div>
                    <div className="text-blue-700">Members</div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <div className="text-2xl font-bold text-green-600">
                      KSH {(selectedChama.pool_balance / 1000).toFixed(0)}K
                    </div>
                    <div className="text-green-700">Pool Balance</div>
                  </div>
                </div>

                {/* Your Stake */}
                {userStake > 0 && (
                  <div className="bg-white p-3 rounded border-2 border-blue-200">
                    <h4 className="font-medium text-blue-700 mb-2">
                      Your Stake
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Amount:</span>
                        <div className="font-bold">
                          KSH {userStake.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Voting Power:</span>
                        <div className="font-bold">{votingPower}%</div>
                      </div>
                    </div>
                    <Progress
                      value={getStakePercentage(
                        userStake,
                        selectedChama.pool_balance,
                      )}
                      className="mt-2 h-2"
                    />
                  </div>
                )}

                {/* Smart Contract Info */}
                <div className="bg-white p-3 rounded">
                  <h4 className="font-medium text-blue-700 mb-2 flex items-center">
                    <Lock className="w-4 h-4 mr-1" />
                    Smart Contract
                  </h4>
                  <div className="text-xs text-gray-600 break-all">
                    {selectedChama.smart_contract_address}
                  </div>
                  <Badge className="mt-2 bg-green-100 text-green-700 text-xs">
                    Celo Network
                  </Badge>
                </div>

                {/* Governance Rules */}
                <div className="bg-white p-3 rounded">
                  <h4 className="font-medium text-blue-700 mb-2 flex items-center">
                    <Vote className="w-4 h-4 mr-1" />
                    Governance Rules
                  </h4>
                  <div className="space-y-1 text-xs">
                    {selectedChama.governance_rules.map((rule, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-600">{rule.rule}:</span>
                        <span className="font-medium">
                          {rule.threshold < 1
                            ? `${rule.threshold * 100}%`
                            : rule.threshold}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Members & Bulk Orders */}
        {selectedChama && (
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-purple-700">
                <Package className="w-5 h-5" />
                <span>Members & Orders</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Members List */}
              <div>
                <h4 className="font-medium text-purple-700 mb-3">Members</h4>
                <div className="space-y-2">
                  {selectedChama.members.map((member, index) => {
                    const memberTier = getMembershipTier(
                      member.contribution_score,
                    );
                    return (
                      <div
                        key={member.user_id}
                        className="bg-white p-3 rounded border"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{memberTier.icon}</span>
                            <div>
                              <div className="font-medium text-sm">
                                Member {index + 1}
                              </div>
                              <div className={`text-xs ${memberTier.color}`}>
                                {memberTier.tier} Tier
                              </div>
                            </div>
                          </div>
                          <div className="text-right text-xs">
                            <div className="font-medium">
                              {member.voting_power}%
                            </div>
                            <div className="text-gray-600">Voting Power</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                          <div>
                            <span>Stake:</span>
                            <div className="font-medium">
                              KSH {member.stake_amount.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <span>Score:</span>
                            <div className="font-medium flex items-center">
                              <Star className="w-3 h-3 mr-1 text-yellow-500" />
                              {member.contribution_score}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bulk Orders */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-purple-700">Bulk Orders</h4>
                  <Button
                    onClick={createBulkOrder}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    New Order
                  </Button>
                </div>

                {selectedChama.bulk_orders.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No active bulk orders
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedChama.bulk_orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white p-3 rounded border"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm font-medium">
                            Order #{order.id.slice(-6)}
                          </div>
                          <Badge
                            className={
                              order.status === "active"
                                ? "bg-green-100 text-green-700"
                                : order.status === "completed"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="text-gray-600">Products:</span>
                            <div className="font-medium">
                              {order.products.join(", ")}
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Amount:</span>
                            <span className="font-medium">
                              KSH {order.total_amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Contributors:</span>
                            <span className="font-medium">
                              {Object.keys(order.member_contributions).length}{" "}
                              members
                            </span>
                          </div>
                        </div>

                        {order.status === "active" && (
                          <div className="flex space-x-2 mt-3">
                            <Button
                              size="sm"
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            >
                              <Clock className="w-4 h-4 mr-1" />
                              Details
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Chama Innovation Stats */}
      <Card className="bg-gradient-to-r from-green-50 to-purple-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-center text-green-700">
            Chama DAO Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">25%</div>
              <div className="text-sm text-green-700">Bulk Savings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-blue-700">Transparent</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">5x</div>
              <div className="text-sm text-purple-700">Faster Decisions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">99.9%</div>
              <div className="text-sm text-orange-700">Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kenya Cultural Context */}
      <Alert className="border-green-300 bg-green-50">
        <HeartHandshake className="w-4 h-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <div className="space-y-2">
            <div className="font-medium">
              Cultural Innovation - Digital Chamas:
            </div>
            <div className="text-sm space-y-1">
              <div>
                • Mirrors traditional "chama" savings groups but with blockchain
                transparency
              </div>
              <div>
                • Smart contracts ensure fair distribution of bulk discounts
              </div>
              <div>
                • Voting system reflects democratic decision-making culture
              </div>
              <div>
                • Low gas fees on Celo blockchain make micro-transactions viable
              </div>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

// Add missing import for Loader2
import { Loader2 } from "lucide-react";

export default ChamaDAOSystem;
