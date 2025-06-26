import { useState, useEffect } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Mic,
  Volume2,
  FileAudio,
  Shield,
  Globe,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  Languages,
  Gavel,
  Award,
  Eye,
  Lock,
  Zap,
} from "lucide-react";

interface VoiceContract {
  id: string;
  title: string;
  type: "sale" | "service" | "loan" | "partnership" | "employment" | "land";
  language:
    | "kiswahili"
    | "dholuo"
    | "kikuyu"
    | "kalenjin"
    | "luhya"
    | "turkana"
    | "maasai";
  parties: {
    initiator: string;
    responder: string;
    witnesses: string[];
  };
  terms: {
    description: string;
    amount?: number;
    duration: string;
    deliverables: string[];
    conditions: string[];
  };
  audioRecordings: {
    original: string;
    confirmation: string;
    witnessVerifications: string[];
  };
  status:
    | "draft"
    | "pending"
    | "active"
    | "completed"
    | "disputed"
    | "cancelled";
  createdDate: string;
  activeDate?: string;
  completionDate?: string;
  blockchainHash: string;
  aiTranscription: string;
  culturalContext: string;
  enforceability: number;
  communitySupport: number;
}

interface VoiceWitness {
  id: string;
  name: string;
  role:
    | "elder"
    | "community-leader"
    | "family-member"
    | "business-associate"
    | "cultural-authority";
  language: string;
  location: string;
  contractsWitnessed: number;
  reputationScore: number;
  culturalAuthority: number;
  voiceSignature: string;
  lastActive: string;
}

interface LanguageDialect {
  id: string;
  name: string;
  nativeName: string;
  speakers: number;
  region: string;
  aiAccuracy: number;
  culturalNuances: string[];
  contractTerms: string[];
  elderSupport: boolean;
  writtenEquivalent: boolean;
}

interface ContractDispute {
  id: string;
  contractId: string;
  type:
    | "breach"
    | "misunderstanding"
    | "cultural-conflict"
    | "payment"
    | "delivery";
  description: string;
  claimant: string;
  evidence: string[];
  status: "open" | "mediation" | "arbitration" | "resolved" | "escalated";
  mediator?: string;
  culturalConsultant?: string;
  resolution?: string;
  filedDate: string;
  resolvedDate?: string;
  satisfaction: number;
}

const OralContracts = () => {
  const [contracts, setContracts] = useState<VoiceContract[]>([]);
  const [witnesses, setWitnesses] = useState<VoiceWitness[]>([]);
  const [dialects, setDialects] = useState<LanguageDialect[]>([]);
  const [disputes, setDisputes] = useState<ContractDispute[]>([]);
  const [selectedContract, setSelectedContract] =
    useState<VoiceContract | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "contracts" | "witnesses" | "disputes"
  >("overview");
  const [isRecording, setIsRecording] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  useEffect(() => {
    // Mock voice contracts data
    const mockContracts: VoiceContract[] = [
      {
        id: "contract-001",
        title: "Ugali Supply Agreement - Mama Grace & Kibera Shop",
        type: "sale",
        language: "kiswahili",
        parties: {
          initiator: "Mama Grace Wanjiku",
          responder: "Kibera Community Shop",
          witnesses: ["Elder John Kiprotich", "Mary Mutua"],
        },
        terms: {
          description: "Weekly supply of 50kg ugali flour at agreed price",
          amount: 6000,
          duration: "6 months",
          deliverables: [
            "50kg maize flour weekly",
            "Quality grade A",
            "Consistent delivery Tuesdays",
          ],
          conditions: [
            "Payment within 7 days",
            "Quality guarantee",
            "Emergency supply provision",
          ],
        },
        audioRecordings: {
          original: "voice_recording_001.wav",
          confirmation: "voice_confirmation_001.wav",
          witnessVerifications: [
            "witness_001_verification.wav",
            "witness_002_verification.wav",
          ],
        },
        status: "active",
        createdDate: "2 weeks ago",
        activeDate: "10 days ago",
        blockchainHash: "0x9f8e7d6c5b4a3928f7e6d5c4b3a2918e7d6c5b4a392",
        aiTranscription:
          "Mama Grace: 'Nakubali kutoa unga wa mahindi kilo hamsini kila wiki kwa bei ya shilingi mia sita....' (Complete transcription available)",
        culturalContext:
          "Traditional weekly market agreement following Kikuyu business customs",
        enforceability: 94,
        communitySupport: 98,
      },
      {
        id: "contract-002",
        title: "Shamba Cultivation Partnership - Ole Sankale & Neighbors",
        type: "partnership",
        language: "maasai",
        parties: {
          initiator: "Ole Sankale Parsapit",
          responder: "Kajiado Farming Collective",
          witnesses: ["Elder Mama Nasirian", "Chief Joseph Lenku"],
        },
        terms: {
          description:
            "Joint cultivation of 10-acre plot with shared labor and harvest",
          duration: "2 seasons",
          deliverables: [
            "Land preparation",
            "Seed provision",
            "Labor sharing",
            "Harvest distribution",
          ],
          conditions: [
            "Equal labor contribution",
            "60-40 harvest split",
            "Water rights respect",
          ],
        },
        audioRecordings: {
          original: "maasai_contract_002.wav",
          confirmation: "maasai_confirmation_002.wav",
          witnessVerifications: ["elder_verification_002.wav"],
        },
        status: "pending",
        createdDate: "5 days ago",
        blockchainHash: "0x8d7c6b5a49382f1e0d9c8b7a69584f3e2d1c0b9a8",
        aiTranscription:
          "Ole Sankale: 'Apee enkutoto enye natii neyieu enkishon...' (Traditional Maasai land agreement)",
        culturalContext:
          "Sacred land sharing agreement following Maasai traditional law",
        enforceability: 89,
        communitySupport: 96,
      },
      {
        id: "contract-003",
        title: "Fish Trading Agreement - Lake Victoria Cooperative",
        type: "service",
        language: "dholuo",
        parties: {
          initiator: "Peter Ochieng Fisherman",
          responder: "Kisumu Fish Market Union",
          witnesses: ["Elder Ruth Atieno", "Market Chairman Tom Odera"],
        },
        terms: {
          description:
            "Daily fish supply with quality guarantee and fair pricing",
          amount: 15000,
          duration: "3 months",
          deliverables: [
            "Fresh fish daily delivery",
            "Quality ice preservation",
            "Market price adherence",
          ],
          conditions: [
            "Dawn delivery schedule",
            "Sustainable fishing practices",
            "Weather contingency",
          ],
        },
        audioRecordings: {
          original: "luo_fish_contract.wav",
          confirmation: "luo_confirmation.wav",
          witnessVerifications: ["elder_atieno_verification.wav"],
        },
        status: "active",
        createdDate: "1 month ago",
        activeDate: "3 weeks ago",
        blockchainHash: "0x7f6e5d4c3b2a1908e7d6c5b4a39281f0e9d8c7b6",
        aiTranscription:
          "Peter: 'Ayie ni akel rech mapek pile ka pile...' (Luo fishing agreement with market)",
        culturalContext:
          "Traditional fishing community agreement respecting lake customs",
        enforceability: 91,
        communitySupport: 93,
      },
    ];

    // Mock witnesses data
    const mockWitnesses: VoiceWitness[] = [
      {
        id: "witness-001",
        name: "Elder John Kiprotich",
        role: "elder",
        language: "Kiswahili & Kalenjin",
        location: "Kibera, Nairobi",
        contractsWitnessed: 234,
        reputationScore: 98,
        culturalAuthority: 95,
        voiceSignature: "voice_signature_elder_kiprotich.wav",
        lastActive: "2 hours ago",
      },
      {
        id: "witness-002",
        name: "Mama Nasirian Ole Sankale",
        role: "cultural-authority",
        language: "Maa (Maasai)",
        location: "Kajiado County",
        contractsWitnessed: 89,
        reputationScore: 97,
        culturalAuthority: 99,
        voiceSignature: "voice_signature_mama_nasirian.wav",
        lastActive: "1 day ago",
      },
      {
        id: "witness-003",
        name: "Elder Ruth Atieno",
        role: "community-leader",
        language: "Dholuo",
        location: "Kisumu, Nyanza",
        contractsWitnessed: 156,
        reputationScore: 94,
        culturalAuthority: 88,
        voiceSignature: "voice_signature_ruth_atieno.wav",
        lastActive: "3 hours ago",
      },
    ];

    // Mock language dialects
    const mockDialects: LanguageDialect[] = [
      {
        id: "lang-001",
        name: "Kiswahili",
        nativeName: "Kiswahili",
        speakers: 45000000,
        region: "National Language",
        aiAccuracy: 96,
        culturalNuances: [
          "Respect forms",
          "Business terminology",
          "Islamic influences",
          "Coastal variants",
        ],
        contractTerms: ["Hati", "Makubaliano", "Ahadi", "Masharti"],
        elderSupport: true,
        writtenEquivalent: true,
      },
      {
        id: "lang-002",
        name: "Maa",
        nativeName: "ɔl Maa",
        speakers: 1500000,
        region: "Rift Valley & Northern Tanzania",
        aiAccuracy: 87,
        culturalNuances: [
          "Pastoral context",
          "Age-set hierarchy",
          "Sacred terminology",
          "Seasonal cycles",
        ],
        contractTerms: ["Enkutoto", "Enaishoret", "Enkishon", "Entasimi"],
        elderSupport: true,
        writtenEquivalent: false,
      },
      {
        id: "lang-003",
        name: "Dholuo",
        nativeName: "Dholuo",
        speakers: 4200000,
        region: "Nyanza Province & Parts of Uganda",
        aiAccuracy: 89,
        culturalNuances: [
          "Fishing culture",
          "Clan systems",
          "Respect protocols",
          "Ancestral references",
        ],
        contractTerms: ["Wach", "Singruok", "Kwer", "Chik"],
        elderSupport: true,
        writtenEquivalent: true,
      },
    ];

    // Mock disputes
    const mockDisputes: ContractDispute[] = [
      {
        id: "dispute-001",
        contractId: "contract-001",
        type: "delivery",
        description: "Flour quality inconsistent with agreed standards",
        claimant: "Kibera Community Shop",
        evidence: [
          "Photos of substandard flour",
          "Customer complaints",
          "Quality test results",
        ],
        status: "mediation",
        mediator: "Elder John Kiprotich",
        culturalConsultant: "Market Association Representative",
        filedDate: "3 days ago",
        satisfaction: 0,
      },
    ];

    setContracts(mockContracts);
    setWitnesses(mockWitnesses);
    setDialects(mockDialects);
    setDisputes(mockDisputes);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "disputed":
        return "bg-red-100 text-red-700 border-red-200";
      case "cancelled":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "draft":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getLanguageColor = (language: string) => {
    switch (language) {
      case "kiswahili":
        return "bg-green-100 text-green-700";
      case "maasai":
        return "bg-red-100 text-red-700";
      case "dholuo":
        return "bg-blue-100 text-blue-700";
      case "kikuyu":
        return "bg-purple-100 text-purple-700";
      case "kalenjin":
        return "bg-orange-100 text-orange-700";
      case "luhya":
        return "bg-pink-100 text-pink-700";
      case "turkana":
        return "bg-teal-100 text-teal-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getLanguageFlag = (language: string) => {
    switch (language) {
      case "kiswahili":
        return "🇰🇪";
      case "maasai":
        return "🔴";
      case "dholuo":
        return "🐟";
      case "kikuyu":
        return "🌾";
      case "kalenjin":
        return "🏃";
      case "luhya":
        return "🎭";
      case "turkana":
        return "🐪";
      default:
        return "🗣️";
    }
  };

  const playVoiceContract = (contractId: string, audioType: string) => {
    setPlayingAudio(`${contractId}-${audioType}`);
    setTimeout(() => setPlayingAudio(null), 3000);
    alert(
      `🎵 Playing ${audioType} for contract ${contractId}\n\nNote: In production, this would play actual voice recordings stored on IPFS with blockchain verification.`,
    );
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      alert(
        "🎤 Voice contract recorded!\n\nThe AI has processed your recording and identified:\n- Language: Kiswahili\n- Contract Type: Sale Agreement\n- Parties: Detected from voice patterns\n- Terms: Extracted and ready for confirmation\n\nWould you like to review the transcription?",
      );
    }, 4000);
  };

  const totalStats = {
    activeContracts: contracts.filter((c) => c.status === "active").length,
    totalValue: contracts.reduce((sum, c) => sum + (c.terms.amount || 0), 0),
    avgEnforceability: Math.round(
      contracts.reduce((sum, c) => sum + c.enforceability, 0) /
        contracts.length,
    ),
    supportedLanguages: dialects.length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            🎤 Oral Contract Blockchain
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            <strong>Voice note smart contracts</strong> in indigenous languages.
            Preserving traditional oral agreement customs while providing modern
            blockchain security and enforceability for community commerce.
          </p>
          <div className="mt-4 text-sm text-indigo-600 font-medium">
            Indigenous Languages • Voice Recognition • Smart Contracts •
            Cultural Preservation • Oral Traditions
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <CardContent className="pt-6 text-center">
              <FileAudio className="h-8 w-8 mx-auto text-indigo-600 mb-2" />
              <div className="text-3xl font-bold text-indigo-700">
                {totalStats.activeContracts}
              </div>
              <div className="text-sm text-indigo-600">Active Contracts</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-3xl font-bold text-green-700">
                KSH {totalStats.totalValue.toLocaleString()}
              </div>
              <div className="text-sm text-green-600">Total Contract Value</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="pt-6 text-center">
              <Shield className="h-8 w-8 mx-auto text-amber-600 mb-2" />
              <div className="text-3xl font-bold text-amber-700">
                {totalStats.avgEnforceability}%
              </div>
              <div className="text-sm text-amber-600">Avg Enforceability</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <Languages className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-3xl font-bold text-blue-700">
                {totalStats.supportedLanguages}
              </div>
              <div className="text-sm text-blue-600">Supported Languages</div>
            </CardContent>
          </Card>
        </div>

        {/* Voice Recording Demo */}
        <Alert className="mb-8 border-indigo-200 bg-indigo-50">
          <Mic className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>Record Voice Contract:</strong> Speak your agreement in
              any supported indigenous language. AI will transcribe, identify
              parties, and create blockchain-secured smart contract.
            </div>
            <Button
              onClick={startVoiceRecording}
              disabled={isRecording}
              size="sm"
              className="ml-4"
            >
              {isRecording ? (
                <>
                  <Volume2 className="h-4 w-4 mr-2 animate-pulse" />
                  Recording...
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Start Recording
                </>
              )}
            </Button>
          </AlertDescription>
        </Alert>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(["overview", "contracts", "witnesses", "disputes"] as const).map(
            (tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                onClick={() => setActiveTab(tab)}
                className="capitalize"
              >
                {tab === "overview" && <Eye className="h-4 w-4 mr-2" />}
                {tab === "contracts" && <FileAudio className="h-4 w-4 mr-2" />}
                {tab === "witnesses" && <Users className="h-4 w-4 mr-2" />}
                {tab === "disputes" && <Gavel className="h-4 w-4 mr-2" />}
                {tab}
              </Button>
            ),
          )}
        </div>

        {/* Contracts Tab */}
        {activeTab === "contracts" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contract Listings */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold">🎤 Voice Contracts</h2>

              {contracts.map((contract) => (
                <Card
                  key={contract.id}
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedContract(contract)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {contract.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            className={getLanguageColor(contract.language)}
                          >
                            {getLanguageFlag(contract.language)}{" "}
                            {contract.language}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {contract.type}
                          </Badge>
                          <Badge className={getStatusColor(contract.status)}>
                            {contract.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        {contract.terms.amount && (
                          <>
                            <div className="text-2xl font-bold text-indigo-600">
                              KSH {contract.terms.amount.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Contract Value
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {contract.terms.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-indigo-600">
                          Initiator:
                        </span>
                        <div>{contract.parties.initiator}</div>
                      </div>
                      <div>
                        <span className="font-medium text-indigo-600">
                          Responder:
                        </span>
                        <div>{contract.parties.responder}</div>
                      </div>
                      <div>
                        <span className="font-medium text-indigo-600">
                          Duration:
                        </span>
                        <div>{contract.terms.duration}</div>
                      </div>
                      <div>
                        <span className="font-medium text-indigo-600">
                          Witnesses:
                        </span>
                        <div>{contract.parties.witnesses.length} verified</div>
                      </div>
                    </div>

                    {/* Enforceability and Community Support */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Enforceability</span>
                          <span>{contract.enforceability}%</span>
                        </div>
                        <Progress
                          value={contract.enforceability}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Community Support</span>
                          <span>{contract.communitySupport}%</span>
                        </div>
                        <Progress
                          value={contract.communitySupport}
                          className="h-2"
                        />
                      </div>
                    </div>

                    <Alert className="border-purple-200 bg-purple-50">
                      <Lock className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Blockchain Secured:</strong>{" "}
                        {contract.culturalContext} • Hash:{" "}
                        {contract.blockchainHash.substring(0, 16)}...
                      </AlertDescription>
                    </Alert>

                    <div className="flex items-center space-x-3">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          playVoiceContract(contract.id, "original");
                        }}
                        disabled={playingAudio === `${contract.id}-original`}
                      >
                        {playingAudio === `${contract.id}-original` ? (
                          <>
                            <Pause className="h-3 w-3 mr-1" />
                            Playing...
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            Play Original
                          </>
                        )}
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileAudio className="h-3 w-3 mr-1" />
                        Transcript
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {selectedContract ? (
                /* Contract Details */
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileAudio className="h-5 w-5" />
                      <span>Contract Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Voice Recordings</h4>
                      <div className="space-y-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() =>
                            playVoiceContract(selectedContract.id, "original")
                          }
                        >
                          <Play className="h-3 w-3 mr-2" />
                          Original Agreement
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() =>
                            playVoiceContract(
                              selectedContract.id,
                              "confirmation",
                            )
                          }
                        >
                          <Play className="h-3 w-3 mr-2" />
                          Confirmation
                        </Button>
                        {selectedContract.audioRecordings.witnessVerifications.map(
                          (_, index) => (
                            <Button
                              key={index}
                              size="sm"
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() =>
                                playVoiceContract(
                                  selectedContract.id,
                                  `witness-${index}`,
                                )
                              }
                            >
                              <Play className="h-3 w-3 mr-2" />
                              Witness {index + 1}
                            </Button>
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Deliverables</h4>
                      <div className="space-y-1">
                        {selectedContract.terms.deliverables.map(
                          (deliverable, index) => (
                            <div
                              key={index}
                              className="text-sm bg-green-50 p-2 rounded flex items-center"
                            >
                              <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                              {deliverable}
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Conditions</h4>
                      <div className="space-y-1">
                        {selectedContract.terms.conditions.map(
                          (condition, index) => (
                            <div
                              key={index}
                              className="text-sm bg-blue-50 p-2 rounded flex items-center"
                            >
                              <AlertTriangle className="h-3 w-3 text-blue-600 mr-2" />
                              {condition}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* How Oral Contracts Work */
                <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
                  <CardHeader>
                    <CardTitle className="text-indigo-700">
                      Voice Contract Process
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        1
                      </div>
                      <div>
                        <strong>Voice Recording:</strong> Parties record
                        agreement in their native language
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <div>
                        <strong>AI Transcription:</strong> Advanced NLP
                        processes and translates content
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        3
                      </div>
                      <div>
                        <strong>Witness Verification:</strong> Community elders
                        verify and sign vocally
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        4
                      </div>
                      <div>
                        <strong>Blockchain Security:</strong> Immutable storage
                        with cultural context
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Supported Languages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Languages className="h-5 w-5" />
                    <span>Supported Languages</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dialects.slice(0, 4).map((dialect) => (
                      <div
                        key={dialect.id}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm flex items-center">
                            <span className="mr-2">
                              {getLanguageFlag(dialect.name.toLowerCase())}
                            </span>
                            {dialect.nativeName}
                          </span>
                          <Badge variant="outline">
                            {dialect.aiAccuracy}% accuracy
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {dialect.speakers.toLocaleString()} speakers •{" "}
                          {dialect.region}
                        </div>
                        {dialect.elderSupport && (
                          <div className="text-xs text-green-600 mt-1">
                            ✓ Elder community support
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Witness Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Active Witnesses</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {witnesses.slice(0, 3).map((witness) => (
                      <div
                        key={witness.id}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">
                            {witness.name}
                          </span>
                          <Badge variant="outline" className="capitalize">
                            {witness.role}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mb-1">
                          {witness.language} • {witness.location}
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span>{witness.contractsWitnessed} contracts</span>
                          <span>{witness.reputationScore}% reputation</span>
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
        {activeTab !== "contracts" && (
          <Card className="p-8 text-center">
            <CardContent>
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-bold mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                Dashboard
              </h3>
              <p className="text-muted-foreground">
                Advanced {activeTab} features coming soon. This will include
                witness management systems, dispute resolution protocols, and
                language processing improvements.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OralContracts;
