import { useState, useEffect } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Vote,
  Coins,
  Smartphone,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Target,
  Award,
  Globe,
  Heart,
  Zap,
  Activity,
  PieChart,
} from "lucide-react";

interface ChamaDAO {
  id: string;
  name: string;
  description: string;
  category: "savings" | "investment" | "trading" | "farming" | "cooperative";
  members: number;
  totalValue: number;
  governance: "democratic" | "consensus" | "weighted" | "traditional";
  activeProposals: number;
  successRate: number;
  founded: string;
  location: string;
  communicationMethod: "ussd" | "whatsapp" | "sms" | "voice";
  votingPower: number;
  treasury: number;
  nextMeeting: string;
}

interface Proposal {
  id: string;
  chamaId: string;
  title: string;
  description: string;
  type:
    | "investment"
    | "expense"
    | "rule-change"
    | "membership"
    | "distribution";
  amount?: number;
  proposer: string;
  status: "voting" | "approved" | "rejected" | "executed";
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  deadline: string;
  quorum: number;
  requiresSuperMajority: boolean;
  ussdCode: string;
}

interface Vote {
  id: string;
  proposalId: string;
  member: string;
  choice: "for" | "against" | "abstain";
  weight: number;
  timestamp: string;
  method: "ussd" | "voice" | "sms";
  reasoning?: string;
}

const ChamaDAOs = () => {
  const [chamaDAOs, setChamaDAOs] = useState<ChamaDAO[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [selectedChama, setSelectedChama] = useState<ChamaDAO | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "chamas" | "proposals" | "governance"
  >("overview");

  useEffect(() => {
    // Mock Chama DAOs data
    const mockChamas: ChamaDAO[] = [
      {
        id: "chama-001",
        name: "Maendeleo Traders Collective",
        description:
          "Self-governing group purchasing and investment circle for Kibera small traders",
        category: "trading",
        members: 47,
        totalValue: 2340000,
        governance: "democratic",
        activeProposals: 3,
        successRate: 89,
        founded: "January 2023",
        location: "Kibera, Nairobi",
        communicationMethod: "ussd",
        votingPower: 15,
        treasury: 145000,
        nextMeeting: "Tomorrow 7:00 PM",
      },
      {
        id: "chama-002",
        name: "Kakamega Coffee Farmers DAO",
        description:
          "Decentralized coffee farming cooperative with transparent pricing and profit sharing",
        category: "farming",
        members: 89,
        totalValue: 5670000,
        governance: "consensus",
        activeProposals: 2,
        successRate: 94,
        founded: "March 2022",
        location: "Kakamega County",
        communicationMethod: "whatsapp",
        votingPower: 22,
        treasury: 890000,
        nextMeeting: "Friday 6:00 PM",
      },
      {
        id: "chama-003",
        name: "Mombasa Port Workers Savings",
        description:
          "Worker-owned savings and loan cooperative with smart contract automation",
        category: "savings",
        members: 156,
        totalValue: 8900000,
        governance: "weighted",
        activeProposals: 5,
        successRate: 76,
        founded: "September 2021",
        location: "Mombasa",
        communicationMethod: "sms",
        votingPower: 8,
        treasury: 1250000,
        nextMeeting: "Sunday 4:00 PM",
      },
      {
        id: "chama-004",
        name: "Maasai Women Beadwork Collective",
        description:
          "Traditional wisdom meets blockchain governance for artisan women's cooperative",
        category: "cooperative",
        members: 34,
        totalValue: 890000,
        governance: "traditional",
        activeProposals: 1,
        successRate: 97,
        founded: "June 2023",
        location: "Kajiado, Maasailand",
        communicationMethod: "voice",
        votingPower: 28,
        treasury: 67000,
        nextMeeting: "Next Monday 5:00 PM",
      },
    ];

    // Mock proposals data
    const mockProposals: Proposal[] = [
      {
        id: "prop-001",
        chamaId: "chama-001",
        title: "Bulk purchase of 500kg maize flour at wholesale price",
        description:
          "Proposal to buy maize flour in bulk from Unga Limited at KSH 110 per kg (market price KSH 135)",
        type: "investment",
        amount: 55000,
        proposer: "Mary Wanjiku",
        status: "voting",
        votesFor: 28,
        votesAgainst: 12,
        votesAbstain: 3,
        deadline: "Tomorrow 6:00 PM",
        quorum: 24,
        requiresSuperMajority: false,
        ussdCode: "*334*12345#",
      },
      {
        id: "prop-002",
        chamaId: "chama-002",
        title: "Invest in new coffee drying equipment",
        description:
          "Purchase modern coffee drying machines to improve quality and reduce post-harvest losses",
        type: "investment",
        amount: 450000,
        proposer: "James Wekesa",
        status: "voting",
        votesFor: 67,
        votesAgainst: 15,
        votesAbstain: 7,
        deadline: "3 days remaining",
        quorum: 45,
        requiresSuperMajority: true,
        ussdCode: "*334*67890#",
      },
      {
        id: "prop-003",
        chamaId: "chama-003",
        title: "Change voting power calculation method",
        description:
          "Modify governance to weight votes based on contribution history rather than equal voting",
        type: "rule-change",
        proposer: "Ahmed Hassan",
        status: "rejected",
        votesFor: 45,
        votesAgainst: 89,
        votesAbstain: 22,
        deadline: "Completed",
        quorum: 78,
        requiresSuperMajority: true,
        ussdCode: "*334*11111#",
      },
    ];

    // Mock votes data
    const mockVotes: Vote[] = [
      {
        id: "vote-001",
        proposalId: "prop-001",
        member: "John Kiprotich",
        choice: "for",
        weight: 1,
        timestamp: "2 hours ago",
        method: "ussd",
        reasoning: "Good price for quality flour",
      },
      {
        id: "vote-002",
        proposalId: "prop-001",
        member: "Grace Mutua",
        choice: "against",
        weight: 1,
        timestamp: "4 hours ago",
        method: "ussd",
        reasoning: "Should negotiate even lower price",
      },
    ];

    setChamaDAOs(mockChamas);
    setProposals(mockProposals);
    setVotes(mockVotes);
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "trading":
        return "bg-blue-100 text-blue-700";
      case "farming":
        return "bg-green-100 text-green-700";
      case "savings":
        return "bg-purple-100 text-purple-700";
      case "investment":
        return "bg-orange-100 text-orange-700";
      case "cooperative":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getGovernanceColor = (governance: string) => {
    switch (governance) {
      case "democratic":
        return "bg-blue-100 text-blue-700";
      case "consensus":
        return "bg-green-100 text-green-700";
      case "weighted":
        return "bg-purple-100 text-purple-700";
      case "traditional":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getProposalStatusColor = (status: string) => {
    switch (status) {
      case "voting":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "executed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const castUSSDVote = (
    proposal: Proposal,
    choice: "for" | "against" | "abstain",
  ) => {
    alert(
      `USSD Vote Cast!\n\nProposal: ${proposal.title}\nYour Vote: ${choice.toUpperCase()}\nUSSD Code: ${proposal.ussdCode}\n\nYou will receive SMS confirmation within 2 minutes.\nVote recorded on blockchain for transparency.`,
    );
  };

  const totalStats = {
    totalChamas: chamaDAOs.length,
    totalMembers: chamaDAOs.reduce((sum, chama) => sum + chama.members, 0),
    totalValue: chamaDAOs.reduce((sum, chama) => sum + chama.totalValue, 0),
    activeProposals: chamaDAOs.reduce(
      (sum, chama) => sum + chama.activeProposals,
      0,
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            🗳️ Chama DAOs: Self-Governing Circles
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            <strong>Self-governing trade circles</strong> with USSD voting and
            smart contracts. Traditional chama model enhanced with blockchain
            governance, transparent decision-making, and automated execution.
          </p>
          <div className="mt-4 text-sm text-blue-600 font-medium">
            USSD Voting • Smart Contracts • Transparent Governance • Automated
            Execution • Community Consensus
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-3xl font-bold text-blue-700">
                {totalStats.totalChamas}
              </div>
              <div className="text-sm text-blue-600">Active Chamas</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6 text-center">
              <Heart className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-3xl font-bold text-green-700">
                {totalStats.totalMembers}
              </div>
              <div className="text-sm text-green-600">Total Members</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="pt-6 text-center">
              <Coins className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-700">
                KSH {totalStats.totalValue.toLocaleString()}
              </div>
              <div className="text-sm text-purple-600">Total Value</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="pt-6 text-center">
              <Vote className="h-8 w-8 mx-auto text-amber-600 mb-2" />
              <div className="text-3xl font-bold text-amber-700">
                {totalStats.activeProposals}
              </div>
              <div className="text-sm text-amber-600">Active Proposals</div>
            </CardContent>
          </Card>
        </div>

        {/* USSD Voting Alert */}
        <Alert className="mb-8 border-indigo-200 bg-indigo-50">
          <Smartphone className="h-4 w-4" />
          <AlertDescription>
            <strong>USSD Democracy:</strong> Vote on proposals using *334# codes
            from any mobile phone. No smartphone or internet required -
            governance accessible to all community members.
          </AlertDescription>
        </Alert>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(["overview", "chamas", "proposals", "governance"] as const).map(
            (tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                onClick={() => setActiveTab(tab)}
                className="capitalize"
              >
                {tab === "overview" && <Activity className="h-4 w-4 mr-2" />}
                {tab === "chamas" && <Users className="h-4 w-4 mr-2" />}
                {tab === "proposals" && <Vote className="h-4 w-4 mr-2" />}
                {tab === "governance" && <Shield className="h-4 w-4 mr-2" />}
                {tab}
              </Button>
            ),
          )}
        </div>

        {/* Chamas Tab */}
        {activeTab === "chamas" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chama Listings */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold">🤝 Chama DAOs Directory</h2>

              {chamaDAOs.map((chama) => (
                <Card
                  key={chama.id}
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedChama(chama)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{chama.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getCategoryColor(chama.category)}>
                            {chama.category}
                          </Badge>
                          <Badge
                            className={getGovernanceColor(chama.governance)}
                          >
                            {chama.governance}
                          </Badge>
                          <Badge variant="outline">
                            {chama.members} members
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          KSH {chama.totalValue.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Value
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {chama.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-blue-600">
                          Location:
                        </span>
                        <div>{chama.location}</div>
                      </div>
                      <div>
                        <span className="font-medium text-blue-600">
                          Founded:
                        </span>
                        <div>{chama.founded}</div>
                      </div>
                      <div>
                        <span className="font-medium text-blue-600">
                          Success Rate:
                        </span>
                        <div>{chama.successRate}%</div>
                      </div>
                      <div>
                        <span className="font-medium text-blue-600">
                          Communication:
                        </span>
                        <div className="capitalize">
                          {chama.communicationMethod}
                        </div>
                      </div>
                    </div>

                    {/* Governance Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Your Voting Power</span>
                        <span>{chama.votingPower}%</span>
                      </div>
                      <Progress value={chama.votingPower} className="h-2" />
                    </div>

                    <Alert className="border-blue-200 bg-blue-50">
                      <Clock className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Next Meeting:</strong> {chama.nextMeeting} •
                        {chama.activeProposals} active proposals require your
                        vote
                      </AlertDescription>
                    </Alert>

                    <div className="flex items-center space-x-3">
                      <Button size="sm">
                        <Vote className="h-3 w-3 mr-1" />
                        View Proposals
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Group Chat
                      </Button>
                      <Button size="sm" variant="outline">
                        <PieChart className="h-3 w-3 mr-1" />
                        Treasury
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {selectedChama ? (
                /* Chama Details */
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>{selectedChama.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Governance Model</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <Badge
                            className={getGovernanceColor(
                              selectedChama.governance,
                            )}
                          >
                            {selectedChama.governance}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {selectedChama.governance === "democratic" &&
                            "Equal voting rights for all members"}
                          {selectedChama.governance === "consensus" &&
                            "Decisions require unanimous agreement"}
                          {selectedChama.governance === "weighted" &&
                            "Voting power based on contribution"}
                          {selectedChama.governance === "traditional" &&
                            "Elder council with community input"}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Financial Overview</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Treasury:</span>
                          <span className="font-bold">
                            KSH {selectedChama.treasury.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Per Member:</span>
                          <span>
                            KSH{" "}
                            {Math.round(
                              selectedChama.totalValue / selectedChama.members,
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active Proposals:</span>
                          <span>{selectedChama.activeProposals}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Communication</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Primary Method:</span>
                          <Badge variant="outline" className="capitalize">
                            {selectedChama.communicationMethod}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {selectedChama.communicationMethod === "ussd" &&
                            "Voting via *334# codes"}
                          {selectedChama.communicationMethod === "whatsapp" &&
                            "WhatsApp group coordination"}
                          {selectedChama.communicationMethod === "sms" &&
                            "SMS notifications and voting"}
                          {selectedChama.communicationMethod === "voice" &&
                            "Voice calls and audio messages"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* How DAOs Work */
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-700">
                      How Chama DAOs Work
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        1
                      </div>
                      <div>
                        <strong>Traditional Foundation:</strong> Built on
                        existing chama trust and social structures
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <div>
                        <strong>USSD Governance:</strong> Vote on proposals
                        using basic mobile phones
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        3
                      </div>
                      <div>
                        <strong>Smart Execution:</strong> Approved decisions
                        automatically implemented
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        4
                      </div>
                      <div>
                        <strong>Transparent Records:</strong> All votes and
                        funds tracked on blockchain
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Active Proposals Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Vote className="h-5 w-5" />
                    <span>Active Proposals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {proposals
                      .filter((p) => p.status === "voting")
                      .slice(0, 3)
                      .map((proposal) => (
                        <div
                          key={proposal.id}
                          className="p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="font-medium text-sm mb-1">
                            {proposal.title}
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {proposal.amount &&
                              `KSH ${proposal.amount.toLocaleString()} • `}
                            {proposal.deadline}
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              className="flex-1 text-xs h-6"
                              onClick={() => castUSSDVote(proposal, "for")}
                            >
                              Yes ({proposal.votesFor})
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs h-6"
                              onClick={() => castUSSDVote(proposal, "against")}
                            >
                              No ({proposal.votesAgainst})
                            </Button>
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
        {activeTab !== "chamas" && (
          <Card className="p-8 text-center">
            <CardContent>
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-bold mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                Dashboard
              </h3>
              <p className="text-muted-foreground">
                Advanced {activeTab} features coming soon. This will include
                detailed proposal creation, governance analytics, and smart
                contract management tools.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ChamaDAOs;
