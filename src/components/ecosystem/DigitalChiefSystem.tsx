import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Crown,
  Gavel,
  CloudRain,
  Users,
  AlertTriangle,
  Smartphone,
  MapPin,
  Calendar,
  TrendingUp,
  Scale,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";

interface Chief {
  id: string;
  name: string;
  village: string;
  county: string;
  tribalAffiliation: string;
  yearsInOffice: number;
  casesResolved: number;
  communityRating: number;
  digitalSkillLevel: "Basic" | "Intermediate" | "Advanced";
  avatar: string;
}

interface CommunityCase {
  id: string;
  type:
    | "Land Dispute"
    | "Family Conflict"
    | "Resource Management"
    | "Environmental Issue";
  status: "Open" | "Under Review" | "Resolved" | "Escalated";
  priority: "Low" | "Medium" | "High" | "Critical";
  description: string;
  submittedBy: string;
  dateSubmitted: string;
  village: string;
  chief: string;
}

interface WeatherForecast {
  date: string;
  temperature: number;
  rainfall: number;
  conditions: string;
  grazingRecommendation: string;
  riskLevel: "Low" | "Medium" | "High";
}

const chiefs: Chief[] = [
  {
    id: "chief-001",
    name: "Mzee Jonathan Kimutai",
    village: "Kajiado Central",
    county: "Kajiado",
    tribalAffiliation: "Maasai",
    yearsInOffice: 12,
    casesResolved: 347,
    communityRating: 94,
    digitalSkillLevel: "Advanced",
    avatar: "👨🏿‍🦳",
  },
  {
    id: "chief-002",
    name: "Mama Grace Wanjiku",
    village: "Kiambu Township",
    county: "Kiambu",
    tribalAffiliation: "Kikuyu",
    yearsInOffice: 8,
    casesResolved: 256,
    communityRating: 91,
    digitalSkillLevel: "Intermediate",
    avatar: "👩🏿‍🦳",
  },
  {
    id: "chief-003",
    name: "Chief Samuel Ochieng",
    village: "Kisumu Rural",
    county: "Kisumu",
    tribalAffiliation: "Luo",
    yearsInOffice: 15,
    casesResolved: 423,
    communityRating: 88,
    digitalSkillLevel: "Basic",
    avatar: "👨🏿‍🦲",
  },
];

const activeCases: CommunityCase[] = [
  {
    id: "case-001",
    type: "Land Dispute",
    status: "Under Review",
    priority: "High",
    description:
      "Boundary dispute between two farming families over 5-acre plot near the river",
    submittedBy: "Peter Mwangi",
    dateSubmitted: "2024-01-10",
    village: "Kajiado Central",
    chief: "Mzee Jonathan Kimutai",
  },
  {
    id: "case-002",
    type: "Resource Management",
    status: "Open",
    priority: "Medium",
    description:
      "Water point access scheduling for livestock during dry season",
    submittedBy: "Mary Nasserian",
    dateSubmitted: "2024-01-12",
    village: "Kajiado Central",
    chief: "Mzee Jonathan Kimutai",
  },
  {
    id: "case-003",
    type: "Environmental Issue",
    status: "Critical",
    priority: "Critical",
    description: "Illegal logging detected in community forest area",
    submittedBy: "James Mutiso",
    dateSubmitted: "2024-01-15",
    village: "Kiambu Township",
    chief: "Mama Grace Wanjiku",
  },
];

const weatherForecasts: WeatherForecast[] = [
  {
    date: "2024-01-20",
    temperature: 28,
    rainfall: 5,
    conditions: "Partly cloudy",
    grazingRecommendation: "Move cattle to eastern pastures",
    riskLevel: "Low",
  },
  {
    date: "2024-01-21",
    temperature: 25,
    rainfall: 15,
    conditions: "Light showers",
    grazingRecommendation: "Keep livestock near homestead",
    riskLevel: "Medium",
  },
  {
    date: "2024-01-22",
    temperature: 23,
    rainfall: 45,
    conditions: "Heavy rain expected",
    grazingRecommendation: "Shelter animals, prepare for flooding",
    riskLevel: "High",
  },
];

export const DigitalChiefSystem = () => {
  const [selectedChief, setSelectedChief] = useState<Chief>(chiefs[0]);
  const [newCase, setNewCase] = useState({
    type: "Land Dispute" as CommunityCase["type"],
    description: "",
    priority: "Medium" as CommunityCase["priority"],
  });
  const [ussdCode, setUssdCode] = useState("");
  const [ussdResponse, setUssdResponse] = useState("");

  const handleUSSDQuery = (code: string) => {
    setUssdCode(code);

    switch (code) {
      case "*456*1#":
        setUssdResponse(`📞 COMMUNITY CHIEF SYSTEM
        
🏛️ Report New Issue:
1. Land dispute
2. Family conflict  
3. Resource issue
4. Environmental concern
5. Other

Reply with number (1-5)`);
        break;
      case "*456*2#":
        setUssdResponse(`🌦️ GRAZING FORECAST - Kajiado
        
Today: 28°C, 5mm rain
📍 Recommendation: Move cattle to eastern pastures
⚠️ Risk Level: LOW

Tomorrow: 25°C, 15mm rain expected
📍 Keep livestock near homestead
⚠️ Risk Level: MEDIUM

Reply: 
1. Get 7-day forecast
2. Report livestock issue
0. Back to menu`);
        break;
      case "*456*3#":
        setUssdResponse(`📅 COMMUNITY MEETING
        
📍 Location: Kajiado Community Hall
🕐 Time: Saturday 2PM
👥 Agenda: 
- Water point maintenance
- Grazing rotation schedule
- School fee collection

RSVP:
1. Will attend
2. Cannot attend
3. Suggest new topic
0. Back`);
        break;
      default:
        setUssdResponse(`📱 DIGITAL CHIEF SYSTEM
        
Welcome to community governance platform
        
🏛️ Main Menu:
1. Report conflict/issue
2. Check grazing forecasts  
3. Community meetings
4. Contact chief directly
5. Dispute resolution status
6. Traditional law guidance
0. Exit

Type choice (1-6) or dial *456*[option]#`);
    }
  };

  const submitCase = () => {
    if (!newCase.description.trim()) return;

    alert(`🏛️ Case Submitted to Digital Chief System!

📋 Case Details:
Type: ${newCase.type}
Priority: ${newCase.priority}
Chief: ${selectedChief.name}

⏳ Your case will be reviewed within 24 hours
📱 You'll receive USSD updates on progress
🤝 Traditional resolution process initiated

Case ID: CASE-${Date.now().toString().slice(-6)}

✅ Community governance made accessible!`);

    setNewCase({
      type: "Land Dispute",
      description: "",
      priority: "Medium",
    });
  };

  const scheduleMeeting = () => {
    alert(`📅 Community Meeting Scheduled!

📍 Location: ${selectedChief.village} Community Center
🕐 Date: Next Saturday 2:00 PM
👥 Expected Attendees: 150+ community members

📋 Agenda:
1. Resource allocation discussion
2. Seasonal grazing plans
3. Youth employment initiatives
4. Infrastructure priorities

📱 USSD reminders will be sent
🔔 SMS notifications 24hrs before
🎯 Traditional consensus-building methods`);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-indigo-800">
                  Digital Chief System
                </CardTitle>
                <p className="text-sm text-indigo-600">
                  Traditional Governance 2.0 - Bridging heritage and technology
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-indigo-100 text-indigo-700"
            >
              {chiefs.length} Chiefs Online
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chiefs" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="chiefs">Chief Dashboard</TabsTrigger>
              <TabsTrigger value="cases">Dispute Resolution</TabsTrigger>
              <TabsTrigger value="weather">Grazing Forecasts</TabsTrigger>
              <TabsTrigger value="ussd">USSD Interface</TabsTrigger>
            </TabsList>

            <TabsContent value="chiefs" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-indigo-800">
                    Community Chiefs
                  </h3>
                  {chiefs.map((chief, index) => (
                    <Card
                      key={chief.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedChief.id === chief.id
                          ? "ring-2 ring-indigo-500"
                          : ""
                      }`}
                      onClick={() => setSelectedChief(chief)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{chief.avatar}</div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-sm">
                                {chief.name}
                              </h4>
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  chief.digitalSkillLevel === "Advanced"
                                    ? "border-green-300 text-green-700"
                                    : chief.digitalSkillLevel === "Intermediate"
                                      ? "border-blue-300 text-blue-700"
                                      : "border-orange-300 text-orange-700"
                                }`}
                              >
                                {chief.digitalSkillLevel}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {chief.village}, {chief.county}
                            </p>
                            <p className="text-xs text-muted-foreground mb-1">
                              {chief.tribalAffiliation} • {chief.yearsInOffice}{" "}
                              years
                            </p>
                            <div className="flex items-center space-x-2">
                              <div className="text-xs font-medium text-green-600">
                                {chief.communityRating}% approval
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {chief.casesResolved} cases
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="lg:col-span-2">
                  <Card className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{selectedChief.avatar}</div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {selectedChief.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Chief of {selectedChief.village},{" "}
                            {selectedChief.county} County
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {selectedChief.tribalAffiliation} Traditional
                            Authority
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700"
                        >
                          {selectedChief.communityRating}% Approval
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-indigo-600">
                            {selectedChief.yearsInOffice}
                          </div>
                          <div className="text-muted-foreground">
                            Years in Office
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedChief.casesResolved}
                          </div>
                          <div className="text-muted-foreground">
                            Cases Resolved
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {selectedChief.communityRating}%
                          </div>
                          <div className="text-muted-foreground">
                            Community Rating
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {
                              activeCases.filter(
                                (c) => c.chief === selectedChief.name,
                              ).length
                            }
                          </div>
                          <div className="text-muted-foreground">
                            Active Cases
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Available Services:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Card className="p-3 bg-blue-50 border-blue-200">
                            <div className="flex items-center space-x-2">
                              <Gavel className="h-5 w-5 text-blue-600" />
                              <div>
                                <h5 className="font-medium text-blue-800 text-sm">
                                  Dispute Resolution
                                </h5>
                                <p className="text-xs text-blue-600">
                                  Traditional law and mediation
                                </p>
                              </div>
                            </div>
                          </Card>

                          <Card className="p-3 bg-green-50 border-green-200">
                            <div className="flex items-center space-x-2">
                              <CloudRain className="h-5 w-5 text-green-600" />
                              <div>
                                <h5 className="font-medium text-green-800 text-sm">
                                  Weather Guidance
                                </h5>
                                <p className="text-xs text-green-600">
                                  Seasonal farming and grazing
                                </p>
                              </div>
                            </div>
                          </Card>

                          <Card className="p-3 bg-purple-50 border-purple-200">
                            <div className="flex items-center space-x-2">
                              <Users className="h-5 w-5 text-purple-600" />
                              <div>
                                <h5 className="font-medium text-purple-800 text-sm">
                                  Community Meetings
                                </h5>
                                <p className="text-xs text-purple-600">
                                  Democratic decision making
                                </p>
                              </div>
                            </div>
                          </Card>

                          <Card className="p-3 bg-amber-50 border-amber-200">
                            <div className="flex items-center space-x-2">
                              <Scale className="h-5 w-5 text-amber-600" />
                              <div>
                                <h5 className="font-medium text-amber-800 text-sm">
                                  Traditional Law
                                </h5>
                                <p className="text-xs text-amber-600">
                                  Cultural guidance and wisdom
                                </p>
                              </div>
                            </div>
                          </Card>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            onClick={scheduleMeeting}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule Community Meeting
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Direct Consultation
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cases" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-indigo-800">
                      Submit New Case
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Case Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "Land Dispute",
                            "Family Conflict",
                            "Resource Management",
                            "Environmental Issue",
                          ].map((type) => (
                            <Button
                              key={type}
                              variant={
                                newCase.type === type ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                setNewCase((prev) => ({
                                  ...prev,
                                  type: type as CommunityCase["type"],
                                }))
                              }
                              className="text-xs"
                            >
                              {type}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Priority Level
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {["Low", "Medium", "High", "Critical"].map(
                            (priority) => (
                              <Button
                                key={priority}
                                variant={
                                  newCase.priority === priority
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                  setNewCase((prev) => ({
                                    ...prev,
                                    priority:
                                      priority as CommunityCase["priority"],
                                  }))
                                }
                                className="text-xs"
                              >
                                {priority}
                              </Button>
                            ),
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Case Description
                        </label>
                        <Textarea
                          value={newCase.description}
                          onChange={(e) =>
                            setNewCase((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Describe the issue in detail... Traditional mediation principles will be applied."
                          className="min-h-[100px]"
                        />
                      </div>

                      <Button
                        onClick={submitCase}
                        disabled={!newCase.description.trim()}
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Gavel className="mr-2 h-4 w-4" />
                        Submit to Chief {selectedChief.name}
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-indigo-800">
                      Active Cases
                    </h3>

                    <div className="space-y-3">
                      {activeCases
                        .filter((c) => c.chief === selectedChief.name)
                        .map((caseItem) => (
                          <Card
                            key={caseItem.id}
                            className="p-3 hover:shadow-md transition-shadow"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-xs">
                                  {caseItem.type}
                                </Badge>
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    variant="secondary"
                                    className={`text-xs ${
                                      caseItem.priority === "Critical"
                                        ? "bg-red-100 text-red-700"
                                        : caseItem.priority === "High"
                                          ? "bg-orange-100 text-orange-700"
                                          : caseItem.priority === "Medium"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-green-100 text-green-700"
                                    }`}
                                  >
                                    {caseItem.priority}
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className={`text-xs ${
                                      caseItem.status === "Resolved"
                                        ? "bg-green-100 text-green-700"
                                        : caseItem.status === "Under Review"
                                          ? "bg-blue-100 text-blue-700"
                                          : caseItem.status === "Escalated"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {caseItem.status}
                                  </Badge>
                                </div>
                              </div>

                              <p className="text-sm">{caseItem.description}</p>

                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>By: {caseItem.submittedBy}</span>
                                <span>{caseItem.dateSubmitted}</span>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>

                    {activeCases.filter((c) => c.chief === selectedChief.name)
                      .length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Gavel className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No active cases for this chief</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="weather" className="space-y-4">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    Pastoral Weather & Grazing Forecasts
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered predictions combined with traditional weather
                    knowledge
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {weatherForecasts.map((forecast, index) => (
                    <motion.div
                      key={forecast.date}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={`p-4 ${
                          forecast.riskLevel === "High"
                            ? "bg-red-50 border-red-200"
                            : forecast.riskLevel === "Medium"
                              ? "bg-yellow-50 border-yellow-200"
                              : "bg-green-50 border-green-200"
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">
                              {new Date(forecast.date).toLocaleDateString()}
                            </h4>
                            <Badge
                              variant="secondary"
                              className={`${
                                forecast.riskLevel === "High"
                                  ? "bg-red-100 text-red-700"
                                  : forecast.riskLevel === "Medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                              }`}
                            >
                              {forecast.riskLevel} Risk
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">
                                Temperature
                              </div>
                              <div className="font-semibold">
                                {forecast.temperature}°C
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">
                                Rainfall
                              </div>
                              <div className="font-semibold">
                                {forecast.rainfall}mm
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="text-muted-foreground">
                                Conditions:{" "}
                              </span>
                              <span className="font-medium">
                                {forecast.conditions}
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">
                                Grazing Advice:{" "}
                              </span>
                              <span className="font-medium">
                                {forecast.grazingRecommendation}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-800">
                        Predictive Analytics
                      </h4>
                      <p className="text-sm text-blue-600">
                        Combining satellite data, traditional knowledge, and AI
                        for accurate pastoral guidance
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-300"
                    >
                      View 30-Day Forecast
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="ussd" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-indigo-800">
                      USSD Quick Access
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Access chief services via any mobile phone - no internet
                      required
                    </p>

                    <div className="space-y-3">
                      <div className="grid grid-cols-1 gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleUSSDQuery("*456#")}
                          className="text-left justify-start"
                        >
                          <Smartphone className="mr-2 h-4 w-4" />
                          *456# - Main Menu
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleUSSDQuery("*456*1#")}
                          className="text-left justify-start"
                        >
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          *456*1# - Report Conflict
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleUSSDQuery("*456*2#")}
                          className="text-left justify-start"
                        >
                          <CloudRain className="mr-2 h-4 w-4" />
                          *456*2# - Grazing Forecast
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleUSSDQuery("*456*3#")}
                          className="text-left justify-start"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          *456*3# - Community Meeting
                        </Button>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Custom USSD Code
                        </label>
                        <div className="flex gap-2">
                          <Input
                            value={ussdCode}
                            onChange={(e) => setUssdCode(e.target.value)}
                            placeholder="Enter USSD code (e.g., *456*4#)"
                            className="font-mono"
                          />
                          <Button onClick={() => handleUSSDQuery(ussdCode)}>
                            Send
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-indigo-800">
                      USSD Response
                    </h3>

                    <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm min-h-[300px] whitespace-pre-wrap">
                      {ussdResponse ||
                        "📱 Dial a USSD code to see the response...\n\nAvailable codes:\n*456# - Main menu\n*456*1# - Report issues\n*456*2# - Weather forecast\n*456*3# - Community meetings"}
                    </div>

                    <Card className="p-3 bg-amber-50 border-amber-200">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-amber-600" />
                        <div>
                          <h4 className="font-semibold text-amber-800 text-sm">
                            Accessibility Features
                          </h4>
                          <p className="text-xs text-amber-600">
                            Works on all phones • No internet required •
                            Supports local languages
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
