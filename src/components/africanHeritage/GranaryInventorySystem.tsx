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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wheat,
  Thermometer,
  Droplets,
  Wind,
  Bug,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap,
  Activity,
} from "lucide-react";

interface GranaryData {
  id: string;
  productName: string;
  location: string;
  currentStock: number;
  optimalStock: number;
  preservationScore: number;
  conditions: {
    humidity: number;
    temperature: number;
    ventilation: number;
    termiteActivity: number;
  };
  solarPower: number;
  forecast: {
    nextWeek: number;
    nextMonth: number;
    recommendation: string;
  };
}

export const GranaryInventorySystem = () => {
  const [granaries, setGranaries] = useState<GranaryData[]>([
    {
      id: "GRAN_001",
      productName: "White Maize",
      location: "Nakuru Central",
      currentStock: 2400,
      optimalStock: 2880, // 20% buffer using termite algorithm
      preservationScore: 94.2,
      conditions: {
        humidity: 13.2,
        temperature: 22.5,
        ventilation: 3.8,
        termiteActivity: 0.05,
      },
      solarPower: 87,
      forecast: {
        nextWeek: 2200,
        nextMonth: 1800,
        recommendation:
          "Maintain current levels. Peak demand expected in 2 weeks.",
      },
    },
    {
      id: "GRAN_002",
      productName: "Red Beans",
      location: "Meru Highlands",
      currentStock: 1100,
      optimalStock: 1265, // 15% buffer for beans
      preservationScore: 89.7,
      conditions: {
        humidity: 14.1,
        temperature: 19.8,
        ventilation: 4.2,
        termiteActivity: 0.02,
      },
      solarPower: 92,
      forecast: {
        nextWeek: 1000,
        nextMonth: 850,
        recommendation: "Stock levels optimal. Consider harvest season influx.",
      },
    },
    {
      id: "GRAN_003",
      productName: "Brown Rice",
      location: "Kisumu West",
      currentStock: 800,
      optimalStock: 1040, // 30% buffer for rice
      preservationScore: 76.3,
      conditions: {
        humidity: 15.8, // Higher than optimal
        temperature: 26.2, // Higher than optimal
        ventilation: 2.1,
        termiteActivity: 0.12,
      },
      solarPower: 71,
      forecast: {
        nextWeek: 750,
        nextMonth: 650,
        recommendation: "URGENT: Improve ventilation. High humidity detected.",
      },
    },
  ]);

  const [selectedGranary, setSelectedGranary] = useState(granaries[0]);

  useEffect(() => {
    // Simulate real-time sensor updates
    const interval = setInterval(() => {
      setGranaries((prev) =>
        prev.map((granary) => ({
          ...granary,
          conditions: {
            ...granary.conditions,
            humidity: Math.max(
              10,
              Math.min(
                20,
                granary.conditions.humidity + (Math.random() - 0.5) * 0.5,
              ),
            ),
            temperature: Math.max(
              15,
              Math.min(
                30,
                granary.conditions.temperature + (Math.random() - 0.5) * 1,
              ),
            ),
            ventilation: Math.max(
              1,
              Math.min(
                6,
                granary.conditions.ventilation + (Math.random() - 0.5) * 0.2,
              ),
            ),
            termiteActivity: Math.max(
              0,
              Math.min(
                0.3,
                granary.conditions.termiteActivity +
                  (Math.random() - 0.5) * 0.02,
              ),
            ),
          },
          preservationScore: calculatePreservationScore(granary.conditions),
        })),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const calculatePreservationScore = (conditions: any): number => {
    let score = 100;

    // Humidity penalty
    if (conditions.humidity > 14) score -= (conditions.humidity - 14) * 10;
    if (conditions.humidity < 12) score -= (12 - conditions.humidity) * 15;

    // Temperature penalty
    if (conditions.temperature > 25) score -= (conditions.temperature - 25) * 5;
    if (conditions.temperature < 15) score -= (15 - conditions.temperature) * 8;

    // Termite activity penalty
    if (conditions.termiteActivity > 0.1)
      score -= conditions.termiteActivity * 200;

    return Math.max(0, Math.min(100, score));
  };

  const getConditionStatus = (value: number, optimal: [number, number]) => {
    if (value >= optimal[0] && value <= optimal[1]) return "optimal";
    if (value < optimal[0] * 0.9 || value > optimal[1] * 1.1) return "critical";
    return "warning";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "critical":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "optimal":
        return <CheckCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "critical":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          Benin Granary Inventory Systems
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          AI-powered stock forecasting inspired by Benin's underground grain
          silos, using termite-inspired ventilation algorithms and IoT sensor
          monitoring
        </p>
      </div>

      {/* Granary Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {granaries.map((granary) => (
          <Card
            key={granary.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedGranary.id === granary.id
                ? "ring-2 ring-amber-500 bg-amber-50"
                : ""
            }`}
            onClick={() => setSelectedGranary(granary)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {granary.productName}
                  </CardTitle>
                  <CardDescription>{granary.location}</CardDescription>
                </div>
                <Wheat className="h-8 w-8 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Preservation Score</span>
                  <span className="font-medium">
                    {granary.preservationScore.toFixed(1)}%
                  </span>
                </div>
                <Progress value={granary.preservationScore} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="font-medium text-blue-600">
                    {granary.currentStock}
                  </div>
                  <div className="text-muted-foreground">Current Stock</div>
                </div>
                <div>
                  <div className="font-medium text-green-600">
                    {granary.optimalStock}
                  </div>
                  <div className="text-muted-foreground">Optimal Stock</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Solar: {granary.solarPower}%</span>
                <Progress value={granary.solarPower} className="flex-1 h-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Granary Analysis */}
      <Tabs defaultValue="conditions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="conditions">Silo Conditions</TabsTrigger>
          <TabsTrigger value="algorithm">Termite Algorithm</TabsTrigger>
          <TabsTrigger value="iot">IoT Sensors</TabsTrigger>
          <TabsTrigger value="forecast">AI Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="conditions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-amber-500" />
                Environmental Conditions - {selectedGranary.productName}
              </CardTitle>
              <CardDescription>
                Real-time monitoring inspired by traditional Benin mud silo
                thermodynamics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Condition Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    name: "Humidity",
                    value: selectedGranary.conditions.humidity,
                    unit: "%",
                    optimal: [12, 14],
                    icon: <Droplets className="h-5 w-5" />,
                  },
                  {
                    name: "Temperature",
                    value: selectedGranary.conditions.temperature,
                    unit: "°C",
                    optimal: [15, 25],
                    icon: <Thermometer className="h-5 w-5" />,
                  },
                  {
                    name: "Ventilation",
                    value: selectedGranary.conditions.ventilation,
                    unit: "m/s",
                    optimal: [2, 5],
                    icon: <Wind className="h-5 w-5" />,
                  },
                  {
                    name: "Termite Activity",
                    value: selectedGranary.conditions.termiteActivity,
                    unit: "index",
                    optimal: [0, 0.1],
                    icon: <Bug className="h-5 w-5" />,
                  },
                ].map((condition) => {
                  const status = getConditionStatus(
                    condition.value,
                    condition.optimal,
                  );
                  return (
                    <Card key={condition.name}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          {condition.icon}
                          <span className="font-medium text-sm">
                            {condition.name}
                          </span>
                        </div>
                        <div className="text-2xl font-bold mb-1">
                          {condition.value.toFixed(1)}
                          {condition.unit}
                        </div>
                        <Badge className={getStatusColor(status)}>
                          {getStatusIcon(status)}
                          <span className="ml-1 capitalize">{status}</span>
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-2">
                          Optimal: {condition.optimal[0]}-{condition.optimal[1]}
                          {condition.unit}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Preservation Score Analysis */}
              <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-amber-700">
                      Overall Preservation Score
                    </h3>
                    <div className="text-3xl font-bold text-amber-600">
                      {selectedGranary.preservationScore.toFixed(1)}%
                    </div>
                  </div>
                  <Progress
                    value={selectedGranary.preservationScore}
                    className="h-3 mb-4"
                  />
                  <div className="text-sm text-amber-600">
                    <strong>Traditional Wisdom:</strong> Benin granaries
                    maintained optimal humidity through termite-inspired
                    ventilation channels, preserving grain for 5+ years.
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="algorithm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5 text-orange-500" />
                Termite Algorithm Stock Calculation
              </CardTitle>
              <CardDescription>
                Stock optimization based on termite colony efficiency principles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                <div className="text-gray-600 mb-2">Python Implementation:</div>
                <code className="text-gray-800">
                  def calculate_optimal_stock(product):
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;if product['type'] == 'maize':
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return demand
                  * 1.2 # 20% buffer
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;elif product['type'] == 'beans':
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return demand
                  * 1.15 # 15% buffer
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;elif product['type'] == 'rice':
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return demand
                  * 1.3 # 30% buffer
                  <br />
                </code>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Current Calculation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Base Demand:</span>
                        <span>2,400 kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Termite Buffer (20%):</span>
                        <span>480 kg</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Optimal Stock:</span>
                        <span>{selectedGranary.optimalStock} kg</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Seasonal Factors</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Current Season:</span>
                        <span>Post-Harvest</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Factor:</span>
                        <span>1.5x</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Weather Pattern:</span>
                        <span>Normal</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-700 mb-2">
                  Ancient Inspiration
                </h4>
                <p className="text-orange-600 text-sm">
                  Termite colonies maintain precise humidity and temperature
                  through sophisticated ventilation systems. Our algorithm
                  mimics this efficiency by calculating optimal stock buffers
                  that account for environmental variations and seasonal demand
                  patterns.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="iot" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                IoT Sensor Network
              </CardTitle>
              <CardDescription>
                Solar-powered sensors monitoring silo conditions in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Sensor Status</h4>
                    <div className="space-y-3">
                      {[
                        {
                          name: "Humidity Sensor",
                          status: "active",
                          battery: 87,
                        },
                        {
                          name: "Temperature Probe",
                          status: "active",
                          battery: 92,
                        },
                        {
                          name: "Airflow Monitor",
                          status: "active",
                          battery: 78,
                        },
                        {
                          name: "Termite Detector",
                          status: "warning",
                          battery: 65,
                        },
                      ].map((sensor, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                sensor.status === "active"
                                  ? "bg-green-500"
                                  : "bg-yellow-500"
                              }`}
                            />
                            <span className="text-sm">{sensor.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs">{sensor.battery}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Data Transmission</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Last Update:</span>
                        <span>2 minutes ago</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Update Frequency:</span>
                        <span>Every 5 minutes</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Data Points Today:</span>
                        <span>1,247</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Network Type:</span>
                        <span>LoRaWAN</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-700 mb-2">
                  Solar Power Integration
                </h4>
                <p className="text-blue-600 text-sm mb-3">
                  Each silo is equipped with solar panels that power the IoT
                  sensor network, ensuring continuous monitoring even in remote
                  locations.
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {selectedGranary.solarPower}%
                    </div>
                    <div className="text-xs text-blue-500">Current Charge</div>
                  </div>
                  <Progress
                    value={selectedGranary.solarPower}
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                AI-Powered Stock Forecast
              </CardTitle>
              <CardDescription>
                Predictive analytics for optimal inventory management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedGranary.forecast.nextWeek}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Next Week
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      -8% projected
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {selectedGranary.forecast.nextMonth}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Next Month
                    </div>
                    <div className="text-xs text-orange-600 mt-1">
                      -25% projected
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(
                        (selectedGranary.currentStock /
                          selectedGranary.optimalStock) *
                          100,
                      )}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Capacity Used
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      Optimal range
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <h4 className="font-medium text-green-700 mb-2">
                    AI Recommendation
                  </h4>
                  <p className="text-green-600 text-sm">
                    {selectedGranary.forecast.recommendation}
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <h4 className="font-medium">Optimization Actions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <Wind className="h-4 w-4 mr-2" />
                    Improve Ventilation
                  </Button>
                  <Button variant="outline" size="sm">
                    <Droplets className="h-4 w-4 mr-2" />
                    Adjust Humidity
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bug className="h-4 w-4 mr-2" />
                    Termite Treatment
                  </Button>
                  <Button variant="outline" size="sm">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Restock Alert
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
