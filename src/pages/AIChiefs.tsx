import { useState, useEffect } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Gavel,
  MessageSquare,
  Users,
  Shield,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  Mic,
  Volume2,
  Award,
  Globe,
  Target,
  TrendingUp,
} from "lucide-react";

interface Dispute {
  id: string;
  title: string;
  description: string;
  category: "payment" | "delivery" | "quality" | "pricing" | "contract";
  parties: {
    complainant: string;
    respondent: string;
  };
  severity: "low" | "medium" | "high" | "critical";
  status:
    | "submitted"
    | "under-review"
    | "elder-council"
    | "resolved"
    | "escalated";
  submittedDate: string;
  aiChiefAssigned: string;
  evidence: string[];
  culturalContext: string;
  traditionApplied: string;
  confidence: number;
  communityVotes?: number;
}

interface AIChief {
  id: string;
  name: string;
  specialization: string[];
  language: string;
  successRate: number;
  casesResolved: number;
  culturalAuthority: string;
  wisdomLevel: number;
  avatar: string;
}

const AIChiefs = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [aiChiefs, setAIChiefs] = useState<AIChief[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [newDispute, setNewDispute] = useState({
    title: "",
    description: "",
    category: "",
    respondent: "",
    evidence: "",
  });
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    // Mock AI Chiefs data
    const mockChiefs: AIChief[] = [
      {
        id: "chief-001",
        name: "Mzee Simba wa Haki",
        specialization: ["Contract Disputes", "Payment Issues", "Trade Ethics"],
        language: "Kiswahili",
        successRate: 94,
        casesResolved: 1247,
        culturalAuthority: "Maasai Elder Principles",
        wisdomLevel: 9,
        avatar: "🦁",
      },
      {
        id: "chief-002",
        name: "Mama Tembo wa Busara",
        specialization: [
          "Quality Disputes",
          "Delivery Issues",
          "Group Mediation",
        ],
        language: "Kiswahili & English",
        successRate: 91,
        casesResolved: 892,
        culturalAuthority: "Kikuyu Traditional Law",
        wisdomLevel: 8,
        avatar: "🐘",
      },
      {
        id: "chief-003",
        name: "Baba Chui wa Haraka",
        specialization: [
          "Urgent Cases",
          "Time-Sensitive Disputes",
          "Emergency Mediation",
        ],
        language: "Sheng & Kiswahili",
        successRate: 89,
        casesResolved: 634,
        culturalAuthority: "Urban Traditional Mix",
        wisdomLevel: 7,
        avatar: "🐆",
      },
    ];

    // Mock disputes data
    const mockDisputes: Dispute[] = [
      {
        id: "dispute-001",
        title: "Unga delivery mismatch - Different quality received",
        description:
          "Ordered premium grade unga but received lower quality. Supplier claims it's the same grade but packaging changed.",
        category: "quality",
        parties: {
          complainant: "Mary Wanjiku (Kibera Traders)",
          respondent: "Unga Mills Ltd",
        },
        severity: "medium",
        status: "under-review",
        submittedDate: "2 hours ago",
        aiChiefAssigned: "Mama Tembo wa Busara",
        evidence: [
          "Photos of received product",
          "Original order receipt",
          "Quality certificate",
        ],
        culturalContext: "Traditional market trust expectations",
        traditionApplied:
          "Kikuyu principle of 'Gũtiri mũndũ ũtarĩ na ũgima' - Every person deserves fair treatment",
        confidence: 87,
      },
      {
        id: "dispute-002",
        title: "M-Pesa payment not received for solar panel order",
        description:
          "Customer claims M-Pesa payment sent 3 days ago but supplier hasn't received funds. Both parties have transaction IDs.",
        category: "payment",
        parties: {
          complainant: "James Kiprotich (Renewable Energy Coop)",
          respondent: "Solar Solutions Kenya",
        },
        severity: "high",
        status: "elder-council",
        submittedDate: "1 day ago",
        aiChiefAssigned: "Mzee Simba wa Haki",
        evidence: [
          "M-Pesa transaction receipt",
          "Safaricom confirmation",
          "Order agreement",
        ],
        culturalContext: "Maasai concept of cattle payment honor",
        traditionApplied:
          "Principle of 'Meishô' - Truth will always emerge through patient investigation",
        confidence: 92,
        communityVotes: 23,
      },
      {
        id: "dispute-003",
        title: "Group buying coordinator missing with collective funds",
        description:
          "Chama coordinator collected KSH 150,000 for group purchase but disappeared. 15 participants affected.",
        category: "contract",
        parties: {
          complainant: "Kibera Electronics Vendors Chama",
          respondent: "Samuel Mutua (Coordinator)",
        },
        severity: "critical",
        status: "escalated",
        submittedDate: "3 days ago",
        aiChiefAssigned: "Mzee Simba wa Haki",
        evidence: [
          "M-Pesa transaction logs",
          "Chama agreement",
          "Witness statements",
        ],
        culturalContext: "Chama trust system breakdown",
        traditionApplied:
          "Harambee responsibility principle - Community accountability",
        confidence: 95,
        communityVotes: 47,
      },
    ];

    setAIChiefs(mockChiefs);
    setDisputes(mockDisputes);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "under-review":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "elder-council":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "resolved":
        return "bg-green-100 text-green-700 border-green-200";
      case "escalated":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "critical":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const submitDispute = () => {
    const dispute: Dispute = {
      id: `dispute-${Date.now()}`,
      title: newDispute.title,
      description: newDispute.description,
      category: newDispute.category as any,
      parties: {
        complainant: "Your Business",
        respondent: newDispute.respondent,
      },
      severity: "medium",
      status: "submitted",
      submittedDate: "Just now",
      aiChiefAssigned: "AI Chief Assignment Pending",
      evidence: newDispute.evidence ? [newDispute.evidence] : [],
      culturalContext: "Modern trade dispute",
      traditionApplied: "Pending cultural analysis",
      confidence: 0,
    };

    setDisputes([dispute, ...disputes]);
    setNewDispute({
      title: "",
      description: "",
      category: "",
      respondent: "",
      evidence: "",
    });
    alert(
      "Dispute submitted to AI Chiefs. You will receive a USSD notification when assigned to an elder.",
    );
  };

  const simulateVoiceDispute = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setNewDispute({
        title: "Mahindi supplier price change without notice",
        description:
          "Supplier ya mahindi aliongeza bei kutoka 2500 hadi 3200 bila notice. Tumekuwa na deal ya miezi sita.",
        category: "pricing",
        respondent: "Maize Traders Association",
        evidence: "Voice recording uploaded",
      });
      alert(
        "Voice dispute recorded in Kiswahili! AI Chief will analyze using traditional wisdom.",
      );
    }, 3000);
  };

  const overallStats = {
    totalDisputes: disputes.length,
    resolvedRate:
      Math.round(
        (disputes.filter((d) => d.status === "resolved").length /
          disputes.length) *
          100,
      ) || 0,
    avgResolutionTime: "2.3 days",
    communityTrust: 94,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            🧙‍♂️ AI-Chiefs: Digital Elders Council
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Swahili-speaking AI market elders that mediate disputes using{" "}
            <strong>Maasai conflict resolution principles</strong>. Traditional
            wisdom meets artificial intelligence for fair, culturally-authentic
            dispute resolution.
          </p>
          <div className="mt-4 text-sm text-amber-600 font-medium">
            Powered by Traditional Wisdom Algorithms • Natural Language
            Processing • Community Validation
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="pt-6 text-center">
              <Gavel className="h-8 w-8 mx-auto text-amber-600 mb-2" />
              <div className="text-3xl font-bold text-amber-700">
                {overallStats.totalDisputes}
              </div>
              <div className="text-sm text-amber-600">Active Cases</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-3xl font-bold text-green-700">
                {overallStats.resolvedRate}%
              </div>
              <div className="text-sm text-green-600">Resolution Rate</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-3xl font-bold text-blue-700">
                {overallStats.avgResolutionTime}
              </div>
              <div className="text-sm text-blue-600">Avg Resolution Time</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="pt-6 text-center">
              <Star className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-700">
                {overallStats.communityTrust}%
              </div>
              <div className="text-sm text-purple-600">Community Trust</div>
            </CardContent>
          </Card>
        </div>

        {/* Voice Input Alert */}
        <Alert className="mb-8 border-orange-200 bg-orange-50">
          <Mic className="h-4 w-4" />
          <AlertDescription>
            <strong>Msaada wa Sauti:</strong> Speak your dispute in Kiswahili,
            Sheng, or English. AI Chiefs understand all major Kenyan languages
            and dialects.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Cases */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">⚖️ Active Disputes</h2>
              <Button onClick={() => setSelectedDispute(null)}>
                + Submit New Dispute
              </Button>
            </div>

            {disputes.map((dispute) => (
              <Card
                key={dispute.id}
                className="hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedDispute(dispute)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{dispute.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="capitalize">
                          {dispute.category}
                        </Badge>
                        <Badge className={getSeverityColor(dispute.severity)}>
                          {dispute.severity} priority
                        </Badge>
                        <Badge className={getStatusColor(dispute.status)}>
                          {dispute.status.replace("-", " ")}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        Confidence: {dispute.confidence}%
                      </div>
                      {dispute.communityVotes && (
                        <div className="text-xs text-muted-foreground">
                          {dispute.communityVotes} community votes
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {dispute.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-amber-600">
                        Complainant:
                      </span>
                      <div>{dispute.parties.complainant}</div>
                    </div>
                    <div>
                      <span className="font-medium text-amber-600">
                        Respondent:
                      </span>
                      <div>{dispute.parties.respondent}</div>
                    </div>
                    <div>
                      <span className="font-medium text-amber-600">
                        AI Chief:
                      </span>
                      <div>{dispute.aiChiefAssigned}</div>
                    </div>
                    <div>
                      <span className="font-medium text-amber-600">
                        Submitted:
                      </span>
                      <div>{dispute.submittedDate}</div>
                    </div>
                  </div>

                  {dispute.traditionApplied !== "Pending cultural analysis" && (
                    <Alert className="border-purple-200 bg-purple-50">
                      <Brain className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Traditional Wisdom Applied:</strong>{" "}
                        {dispute.traditionApplied}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex items-center space-x-3">
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    {dispute.status === "elder-council" && (
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Users className="h-3 w-3 mr-1" />
                        Join Council Vote
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {selectedDispute ? (
              /* Dispute Details */
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gavel className="h-5 w-5" />
                    <span>Case Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Cultural Context</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedDispute.culturalContext}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Evidence Submitted</h4>
                    <div className="space-y-1">
                      {selectedDispute.evidence.map((evidence, index) => (
                        <div
                          key={index}
                          className="text-sm bg-gray-50 p-2 rounded"
                        >
                          📄 {evidence}
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedDispute.confidence > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">
                        AI Analysis Confidence
                      </h4>
                      <Progress
                        value={selectedDispute.confidence}
                        className="h-3"
                      />
                      <div className="text-sm text-muted-foreground mt-1">
                        {selectedDispute.confidence}% confidence in traditional
                        wisdom application
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              /* Submit New Dispute */
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Submit Dispute</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Case Title</label>
                    <input
                      value={newDispute.title}
                      onChange={(e) =>
                        setNewDispute({ ...newDispute, title: e.target.value })
                      }
                      placeholder="Brief description of the issue"
                      className="w-full mt-1 p-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={newDispute.category}
                      onChange={(e) =>
                        setNewDispute({
                          ...newDispute,
                          category: e.target.value,
                        })
                      }
                      className="w-full mt-1 p-2 border rounded-lg"
                    >
                      <option value="">Select category...</option>
                      <option value="payment">Payment Issues</option>
                      <option value="delivery">Delivery Problems</option>
                      <option value="quality">Quality Disputes</option>
                      <option value="pricing">Pricing Conflicts</option>
                      <option value="contract">Contract Violations</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Other Party</label>
                    <input
                      value={newDispute.respondent}
                      onChange={(e) =>
                        setNewDispute({
                          ...newDispute,
                          respondent: e.target.value,
                        })
                      }
                      placeholder="Name of supplier/buyer in dispute"
                      className="w-full mt-1 p-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Describe the Issue
                    </label>
                    <Textarea
                      value={newDispute.description}
                      onChange={(e) =>
                        setNewDispute({
                          ...newDispute,
                          description: e.target.value,
                        })
                      }
                      placeholder="Eleza tatizo lako kwa Kiswahili au Kingereza... (Explain your issue in Swahili or English)"
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={simulateVoiceDispute}
                      disabled={isListening}
                      className="flex-1"
                    >
                      {isListening ? (
                        <>
                          <Volume2 className="h-4 w-4 mr-2 animate-pulse" />
                          Listening...
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4 mr-2" />
                          Speak
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={submitDispute}
                      disabled={!newDispute.title || !newDispute.description}
                      className="flex-1"
                    >
                      Submit to Elders
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Chiefs Directory */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>AI Chiefs Council</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiChiefs.map((chief) => (
                    <div
                      key={chief.id}
                      className="p-3 bg-amber-50 rounded-lg border border-amber-200"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{chief.avatar}</span>
                        <div className="flex-1">
                          <div className="font-medium text-amber-800">
                            {chief.name}
                          </div>
                          <div className="text-xs text-amber-600">
                            {chief.culturalAuthority}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {chief.casesResolved} cases • {chief.successRate}%
                            success
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            {Array.from({ length: chief.wisdomLevel }).map(
                              (_, i) => (
                                <Star
                                  key={i}
                                  className="h-3 w-3 text-amber-500 fill-current"
                                />
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-700">
                  How AI Chiefs Work
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div>
                    <strong>Cultural Analysis:</strong> AI applies traditional
                    wisdom principles
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div>
                    <strong>Language Processing:</strong> Understands Kiswahili,
                    Sheng, and English
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div>
                    <strong>Elder Council:</strong> Community validates AI
                    recommendations
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <div>
                    <strong>Resolution:</strong> Culturally appropriate
                    settlement enforced
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

export default AIChiefs;
