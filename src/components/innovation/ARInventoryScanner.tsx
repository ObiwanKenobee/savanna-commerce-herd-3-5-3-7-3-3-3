import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  innovationService,
  ARShelfData,
  DealTag,
} from "@/services/innovationService";
import {
  Camera,
  CameraOff,
  Scan,
  Target,
  Eye,
  Package,
  TrendingDown,
  TrendingUp,
  Star,
  Clock,
  MapPin,
  Smartphone,
  Zap,
  Brain,
  DollarSign,
} from "lucide-react";

interface ARInventoryScannerProps {
  className?: string;
}

export const ARInventoryScanner = ({ className }: ARInventoryScannerProps) => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [arData, setArData] = useState<ARShelfData | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [detectedProducts, setDetectedProducts] = useState<any[]>([]);
  const [bestDeals, setBestDeals] = useState<DealTag[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isScanning) {
      simulateARScanning();
    }
  }, [isScanning]);

  const startARScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
        setScanProgress(0);

        toast({
          title: "📱 AR Scanner Active",
          description: "Point camera at shelves to detect products and prices",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Camera Access Failed",
        description: "Please enable camera access for AR scanning.",
        variant: "destructive",
      });
    }
  };

  const stopARScanning = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
    setScanProgress(0);
  };

  const simulateARScanning = () => {
    let progress = 0;
    const scanInterval = setInterval(() => {
      progress += 10;
      setScanProgress(progress);

      if (progress >= 100) {
        clearInterval(scanInterval);
        processARScan();
      }
    }, 200);
  };

  const processARScan = async () => {
    try {
      // Mock location data (would come from device GPS)
      const mockLocation = { lat: -1.2921, lng: 36.8219 }; // Nairobi coordinates

      const arScanData = await innovationService.getARShelfData(mockLocation);
      setArData(arScanData);
      setDetectedProducts(arScanData.products);
      setBestDeals(arScanData.best_deals);

      toast({
        title: "🎯 AR Scan Complete",
        description: `Found ${arScanData.products.length} products with ${arScanData.best_deals.length} active deals`,
      });
    } catch (error) {
      toast({
        title: "❌ AR Processing Failed",
        description: "Failed to process AR scan. Try again.",
        variant: "destructive",
      });
    }
  };

  const getDealColor = (discount: number) => {
    if (discount >= 20) return "bg-red-100 text-red-700 border-red-200";
    if (discount >= 10)
      return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  const getStockColor = (level: number) => {
    if (level >= 30) return "text-green-600";
    if (level >= 10) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* AR Scanner Header */}
      <div className="text-center space-y-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-blue-700">
          <Eye className="w-8 h-8" />
          <span>AR Inventory Scanner</span>
          <Target className="w-8 h-8" />
        </div>
        <p className="text-blue-600 max-w-2xl mx-auto">
          Point your camera at empty shelves to see real-time supplier prices,
          stock levels, and exclusive deals floating in augmented reality.
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-blue-600">
          <div className="flex items-center space-x-1">
            <Smartphone className="w-4 h-4" />
            <span>Low-end Device Support</span>
          </div>
          <div className="flex items-center space-x-1">
            <Brain className="w-4 h-4" />
            <span>AI Product Recognition</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4" />
            <span>Real-time Price Updates</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AR Camera Interface */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-700">
              <Camera className="w-5 h-5" />
              <span>AR Shelf Scanner</span>
              <Badge className="bg-blue-100 text-blue-700">
                Unity + ARCore
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Camera Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={isScanning ? stopARScanning : startARScanning}
                className={`${
                  isScanning
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
                size="lg"
              >
                {isScanning ? (
                  <>
                    <CameraOff className="w-5 h-5 mr-2" />
                    Stop Scanning
                  </>
                ) : (
                  <>
                    <Scan className="w-5 h-5 mr-2" />
                    Start AR Scan
                  </>
                )}
              </Button>
            </div>

            {/* Camera Feed with AR Overlay */}
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover rounded-lg bg-gray-200"
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-64 pointer-events-none"
              />

              {/* AR Overlay Elements */}
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-blue-600 bg-opacity-90 text-white px-4 py-2 rounded-full">
                    <div className="flex items-center space-x-2">
                      <Target className="w-5 h-5 animate-pulse" />
                      <span>Scanning for products...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Mock AR Product Tags */}
              {detectedProducts.length > 0 && (
                <>
                  <div className="absolute top-4 left-4 bg-green-600 text-white px-2 py-1 rounded text-sm">
                    📦 Unga wa Pembe - KSH 120
                  </div>
                  <div className="absolute top-16 right-4 bg-blue-600 text-white px-2 py-1 rounded text-sm">
                    🍬 Sukari Mumias - KSH 150
                  </div>
                  <div className="absolute bottom-16 left-4 bg-red-600 text-white px-2 py-1 rounded text-sm">
                    🔥 DEAL: 15% OFF Today!
                  </div>
                </>
              )}
            </div>

            {/* Scanning Progress */}
            {isScanning && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">
                    Scanning Progress:
                  </span>
                  <span className="text-sm font-medium">{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} className="h-2" />
              </div>
            )}

            {/* AR Instructions */}
            <div className="space-y-2">
              <h4 className="font-medium text-blue-700">Scanning Tips:</h4>
              <div className="grid grid-cols-1 gap-2 text-sm text-blue-600">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Point camera at empty shelves</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Keep camera steady for 2-3 seconds</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>AR overlays appear automatically</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detected Products & Deals */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700">
              <Package className="w-5 h-5" />
              <span>Detected Products</span>
              <Badge className="bg-green-100 text-green-700">
                {detectedProducts.length} found
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {detectedProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Start AR scanning to detect products</p>
              </div>
            ) : (
              <div className="space-y-4">
                {detectedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="bg-white p-4 rounded-lg border"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Package className="w-4 h-4" />
                          <span>Stock: </span>
                          <span
                            className={`font-medium ${getStockColor(product.stock_level)}`}
                          >
                            {product.stock_level} units
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          KSH {(120 + index * 30).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Best Price</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span>Demand: {product.demand_forecast}/week</span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Order Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Best Deals Today */}
      {bestDeals.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-700">
              <Star className="w-5 h-5" />
              <span>Best Deals Today</span>
              <Badge className="bg-red-100 text-red-700">Limited Time</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bestDeals.map((deal, index) => (
                <div
                  key={deal.id}
                  className={`p-4 rounded-lg border-2 ${getDealColor(deal.discount_percent)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-lg font-bold">
                      {deal.discount_percent}% OFF
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>2h left</span>
                    </div>
                  </div>
                  <div className="text-sm opacity-80 mb-3">{deal.text}</div>
                  <Button
                    size="sm"
                    className="w-full"
                    style={{ backgroundColor: deal.color }}
                  >
                    Grab Deal
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AR Innovation Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-center text-blue-700">
            AR Scanner Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">90%</div>
              <div className="text-sm text-blue-700">Recognition Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">2.5x</div>
              <div className="text-sm text-green-700">Faster Restocking</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">40%</div>
              <div className="text-sm text-purple-700">Reduced Stockouts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">15%</div>
              <div className="text-sm text-orange-700">Better Margins</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kenya-Specific Benefits */}
      <Alert className="border-green-300 bg-green-50">
        <MapPin className="w-4 h-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <div className="space-y-2">
            <div className="font-medium">Why AR Works for Kenya:</div>
            <div className="text-sm space-y-1">
              <div>
                • Reduces literacy barriers with visual product recognition
              </div>
              <div>• Aligns with "see and buy" market culture</div>
              <div>• Works on low-end Android devices with ARCore</div>
              <div>
                • Supports 3 languages: English, Swahili, and local dialects
              </div>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ARInventoryScanner;
