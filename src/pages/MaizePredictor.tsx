import { useState, useEffect } from "react";
import { SavannahNavigation } from "@/components/wildlife/SavannahNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Satellite,
  Thermometer,
  Droplets,
  Wind,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Activity,
  MapPin,
  Calendar,
  Target,
  Globe,
  Zap,
  Eye,
  Brain,
  Cloud,
} from "lucide-react";

interface WeatherData {
  id: string;
  location: string;
  coordinates: { lat: number; lng: number };
  temperature: number;
  humidity: number;
  rainfall: number;
  soilMoisture: number;
  windSpeed: number;
  timestamp: string;
  satelliteConfidence: number;
}

interface CropPrediction {
  id: string;
  location: string;
  cropType: "maize" | "wheat" | "beans" | "sorghum" | "millet";
  currentStage: string;
  healthScore: number;
  yieldPrediction: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  threatFactors: string[];
  recommendedActions: string[];
  confidence: number;
  updateTime: string;
}

interface GroundSensor {
  id: string;
  location: string;
  type: "soil" | "weather" | "pest" | "irrigation" | "livestock";
  status: "active" | "inactive" | "maintenance";
  batteryLevel: number;
  lastReading: string;
  dataQuality: number;
  farmerId: string;
  alertsTriggered: number;
}

interface FoodSecurityAlert {
  id: string;
  severity: "info" | "warning" | "urgent" | "emergency";
  region: string;
  affectedPopulation: number;
  timeframe: string;
  description: string;
  aiConfidence: number;
  recommendedResponse: string[];
  status: "active" | "monitoring" | "resolved";
}

const MaizePredictor = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [predictions, setPredictions] = useState<CropPrediction[]>([]);
  const [sensors, setSensors] = useState<GroundSensor[]>([]);
  const [alerts, setAlerts] = useState<FoodSecurityAlert[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "predictions" | "sensors" | "alerts"
  >("overview");

  useEffect(() => {
    // Mock weather data
    const mockWeatherData: WeatherData[] = [
      {
        id: "weather-001",
        location: "Kitale, Trans Nzoia",
        coordinates: { lat: 1.0167, lng: 35.0 },
        temperature: 24.5,
        humidity: 67,
        rainfall: 2.3,
        soilMoisture: 45,
        windSpeed: 8.2,
        timestamp: "15 minutes ago",
        satelliteConfidence: 94,
      },
      {
        id: "weather-002",
        location: "Nakuru, Rift Valley",
        coordinates: { lat: -0.3031, lng: 36.08 },
        temperature: 22.1,
        humidity: 58,
        rainfall: 0.0,
        soilMoisture: 32,
        windSpeed: 12.1,
        timestamp: "12 minutes ago",
        satelliteConfidence: 89,
      },
      {
        id: "weather-003",
        location: "Eldoret, Uasin Gishu",
        coordinates: { lat: 0.5143, lng: 35.2697 },
        temperature: 19.8,
        humidity: 71,
        rainfall: 4.7,
        soilMoisture: 62,
        windSpeed: 6.5,
        timestamp: "8 minutes ago",
        satelliteConfidence: 97,
      },
    ];

    // Mock crop predictions
    const mockPredictions: CropPrediction[] = [
      {
        id: "pred-001",
        location: "Kitale, Trans Nzoia",
        cropType: "maize",
        currentStage: "Flowering Stage",
        healthScore: 85,
        yieldPrediction: 28.5,
        riskLevel: "low",
        threatFactors: [
          "Minor pest pressure",
          "Seasonal temperature variation",
        ],
        recommendedActions: [
          "Continue current irrigation",
          "Monitor for fall armyworm",
        ],
        confidence: 92,
        updateTime: "2 hours ago",
      },
      {
        id: "pred-002",
        location: "Nakuru, Rift Valley",
        cropType: "maize",
        currentStage: "Grain Filling",
        healthScore: 62,
        yieldPrediction: 18.2,
        riskLevel: "medium",
        threatFactors: [
          "Declining soil moisture",
          "Above-average temperatures",
          "Irregular rainfall",
        ],
        recommendedActions: [
          "Increase irrigation frequency",
          "Apply drought-resistant varieties next season",
        ],
        confidence: 87,
        updateTime: "1 hour ago",
      },
      {
        id: "pred-003",
        location: "Eldoret, Uasin Gishu",
        cropType: "wheat",
        currentStage: "Vegetative Growth",
        healthScore: 91,
        yieldPrediction: 32.8,
        riskLevel: "low",
        threatFactors: ["Optimal conditions"],
        recommendedActions: [
          "Maintain current practices",
          "Prepare for harvesting equipment",
        ],
        confidence: 95,
        updateTime: "30 minutes ago",
      },
    ];

    // Mock ground sensors
    const mockSensors: GroundSensor[] = [
      {
        id: "sensor-001",
        location: "Kitale Farm #12",
        type: "soil",
        status: "active",
        batteryLevel: 87,
        lastReading: "5 minutes ago",
        dataQuality: 98,
        farmerId: "John Kipkoech",
        alertsTriggered: 0,
      },
      {
        id: "sensor-002",
        location: "Nakuru Irrigation Block 7",
        type: "weather",
        status: "active",
        batteryLevel: 92,
        lastReading: "3 minutes ago",
        dataQuality: 94,
        farmerId: "Mary Wanjiku",
        alertsTriggered: 2,
      },
      {
        id: "sensor-003",
        location: "Eldoret Cooperative Farm",
        type: "pest",
        status: "maintenance",
        batteryLevel: 34,
        lastReading: "2 hours ago",
        dataQuality: 76,
        farmerId: "David Kiprotich",
        alertsTriggered: 1,
      },
    ];

    // Mock food security alerts
    const mockAlerts: FoodSecurityAlert[] = [
      {
        id: "alert-001",
        severity: "warning",
        region: "Turkana County",
        affectedPopulation: 125000,
        timeframe: "Next 3-6 months",
        description:
          "Satellite data indicates declining vegetation health and below-normal rainfall patterns",
        aiConfidence: 89,
        recommendedResponse: [
          "Deploy emergency food reserves",
          "Activate early warning systems",
          "Support livestock destocking",
        ],
        status: "active",
      },
      {
        id: "alert-002",
        severity: "info",
        region: "Central Kenya Highlands",
        affectedPopulation: 890000,
        timeframe: "Next harvest season",
        description:
          "Favorable conditions predicted for main crop season with above-average yield expectations",
        aiConfidence: 93,
        recommendedResponse: [
          "Prepare storage infrastructure",
          "Plan market stabilization",
          "Support smallholder marketing",
        ],
        status: "monitoring",
      },
    ];

    setWeatherData(mockWeatherData);
    setPredictions(mockPredictions);
    setSensors(mockSensors);
    setAlerts(mockAlerts);
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "info":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "urgent":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "emergency":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getSensorStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-red-100 text-red-700";
      case "maintenance":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const totalStats = {
    activeSensors: sensors.filter((s) => s.status === "active").length,
    averageYield:
      Math.round(
        (predictions.reduce((sum, p) => sum + p.yieldPrediction, 0) /
          predictions.length) *
          10,
      ) / 10,
    criticalAlerts: alerts.filter(
      (a) => a.severity === "urgent" || a.severity === "emergency",
    ).length,
    averageConfidence: Math.round(
      predictions.reduce((sum, p) => sum + p.confidence, 0) /
        predictions.length,
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50">
      <SavannahNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            🛰️ Maize Crisis Predictor
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            <strong>Satellite + ground sensor AI</strong> for food security
            monitoring. Combining NASA satellite data with IoT soil sensors and
            weather stations to predict crop failures and food crises before
            they happen.
          </p>
          <div className="mt-4 text-sm text-emerald-600 font-medium">
            Satellite Imagery • IoT Sensors • Machine Learning • Early Warning •
            Food Security Intelligence
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
            <CardContent className="pt-6 text-center">
              <Activity className="h-8 w-8 mx-auto text-emerald-600 mb-2" />
              <div className="text-3xl font-bold text-emerald-700">
                {totalStats.activeSensors}
              </div>
              <div className="text-sm text-emerald-600">Active Sensors</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-3xl font-bold text-blue-700">
                {totalStats.averageYield}
              </div>
              <div className="text-sm text-blue-600">Avg Yield (bags/acre)</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <div className="text-3xl font-bold text-orange-700">
                {totalStats.criticalAlerts}
              </div>
              <div className="text-sm text-orange-600">Critical Alerts</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="pt-6 text-center">
              <Brain className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-700">
                {totalStats.averageConfidence}%
              </div>
              <div className="text-sm text-purple-600">AI Confidence</div>
            </CardContent>
          </Card>
        </div>

        {/* Satellite Data Alert */}
        <Alert className="mb-8 border-emerald-200 bg-emerald-50">
          <Satellite className="h-4 w-4" />
          <AlertDescription>
            <strong>Multi-Source Intelligence:</strong> Combining NASA MODIS
            satellite data, Sentinel-2 imagery, IoT ground sensors, and local
            weather stations for comprehensive crop monitoring across Kenya.
          </AlertDescription>
        </Alert>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(["overview", "predictions", "sensors", "alerts"] as const).map(
            (tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                onClick={() => setActiveTab(tab)}
                className="capitalize"
              >
                {tab === "overview" && <Eye className="h-4 w-4 mr-2" />}
                {tab === "predictions" && (
                  <TrendingUp className="h-4 w-4 mr-2" />
                )}
                {tab === "sensors" && <Activity className="h-4 w-4 mr-2" />}
                {tab === "alerts" && <AlertTriangle className="h-4 w-4 mr-2" />}
                {tab}
              </Button>
            ),
          )}
        </div>

        {/* Predictions Tab */}
        {activeTab === "predictions" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Prediction Listings */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold">🌽 Crop Yield Predictions</h2>

              {predictions.map((prediction) => (
                <Card
                  key={prediction.id}
                  className="hover:shadow-xl transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {prediction.location}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="capitalize">
                            {prediction.cropType}
                          </Badge>
                          <Badge className={getRiskColor(prediction.riskLevel)}>
                            {prediction.riskLevel} risk
                          </Badge>
                          <Badge variant="outline">
                            {prediction.currentStage}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {prediction.yieldPrediction}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          bags/acre
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Health Score */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Crop Health Score</span>
                        <span>{prediction.healthScore}%</span>
                      </div>
                      <Progress
                        value={prediction.healthScore}
                        className="h-2"
                      />
                    </div>

                    {/* AI Confidence */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>AI Prediction Confidence</span>
                        <span>{prediction.confidence}%</span>
                      </div>
                      <Progress value={prediction.confidence} className="h-2" />
                    </div>

                    {/* Threat Factors */}
                    <div>
                      <h4 className="font-medium mb-2 text-red-600">
                        Threat Factors
                      </h4>
                      <div className="space-y-1">
                        {prediction.threatFactors.map((threat, index) => (
                          <div
                            key={index}
                            className="text-sm bg-red-50 p-2 rounded flex items-center"
                          >
                            <AlertTriangle className="h-3 w-3 text-red-600 mr-2" />
                            {threat}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommended Actions */}
                    <div>
                      <h4 className="font-medium mb-2 text-blue-600">
                        Recommended Actions
                      </h4>
                      <div className="space-y-1">
                        {prediction.recommendedActions.map((action, index) => (
                          <div
                            key={index}
                            className="text-sm bg-blue-50 p-2 rounded flex items-center"
                          >
                            <CheckCircle className="h-3 w-3 text-blue-600 mr-2" />
                            {action}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Last updated: {prediction.updateTime}</span>
                      <Button size="sm" variant="outline">
                        <Globe className="h-3 w-3 mr-1" />
                        View Satellite Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Weather Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Cloud className="h-5 w-5" />
                    <span>Current Weather</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weatherData.slice(0, 2).map((weather) => (
                      <div
                        key={weather.id}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="font-medium text-sm mb-2">
                          {weather.location}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center">
                            <Thermometer className="h-3 w-3 text-red-500 mr-1" />
                            {weather.temperature}°C
                          </div>
                          <div className="flex items-center">
                            <Droplets className="h-3 w-3 text-blue-500 mr-1" />
                            {weather.humidity}%
                          </div>
                          <div className="flex items-center">
                            <Cloud className="h-3 w-3 text-gray-500 mr-1" />
                            {weather.rainfall}mm
                          </div>
                          <div className="flex items-center">
                            <Wind className="h-3 w-3 text-green-500 mr-1" />
                            {weather.windSpeed} km/h
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          Satellite confidence: {weather.satelliteConfidence}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* How It Works */}
              <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-700">
                    AI Prediction Process
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div>
                      <strong>Satellite Analysis:</strong> MODIS and Sentinel-2
                      vegetation indices
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div>
                      <strong>Ground Truth:</strong> IoT sensor data validation
                      and calibration
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <div>
                      <strong>Weather Modeling:</strong> Climate data fusion and
                      trend analysis
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      4
                    </div>
                    <div>
                      <strong>ML Prediction:</strong> Deep learning yield
                      forecasting models
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Sensors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Ground Sensors</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sensors.slice(0, 3).map((sensor) => (
                      <div
                        key={sensor.id}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">
                            {sensor.location}
                          </span>
                          <Badge
                            className={getSensorStatusColor(sensor.status)}
                          >
                            {sensor.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          {sensor.type} sensor • {sensor.lastReading}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs">
                            Battery: {sensor.batteryLevel}%
                          </div>
                          <div className="text-xs">
                            Quality: {sensor.dataQuality}%
                          </div>
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
        {activeTab !== "predictions" && (
          <Card className="p-8 text-center">
            <CardContent>
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-bold mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                Dashboard
              </h3>
              <p className="text-muted-foreground">
                Advanced {activeTab} features coming soon. This will include
                detailed satellite imagery analysis, sensor network management,
                and early warning system coordination.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MaizePredictor;
