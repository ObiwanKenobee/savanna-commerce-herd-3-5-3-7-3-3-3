import React, { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription } from "../ui/alert";
import { Progress } from "../ui/progress";
import {
  Upload,
  Camera,
  Smartphone,
  MessageSquare,
  FileText,
  Shield,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Clock,
  Users,
  Star,
} from "lucide-react";
import {
  productUploadService,
  ProductUploadData,
} from "../../services/productUploadService";
import { userRoleService } from "../../services/userRoleService";
import { USSDProductFlow } from "./USSDProductFlow";
import { BulkUploadInterface } from "./BulkUploadInterface";

interface ProductUploadSystemProps {
  userId: string;
  onUploadSuccess?: (productId: string) => void;
  onUploadError?: (error: string) => void;
}

interface UploadState {
  loading: boolean;
  progress: number;
  stage: "idle" | "uploading" | "processing" | "completed" | "error";
  message: string;
  result?: any;
}

const PRODUCT_CATEGORIES = [
  { value: "staples", label: "Vyakula Vikuu (Staples)", icon: "🌾" },
  { value: "vegetables", label: "Mboga (Vegetables)", icon: "🥬" },
  { value: "fruits", label: "Matunda (Fruits)", icon: "🍌" },
  { value: "meat", label: "Nyama (Meat)", icon: "🥩" },
  { value: "fish", label: "Samaki (Fish)", icon: "🐟" },
  { value: "dairy", label: "Maziwa (Dairy)", icon: "🥛" },
  { value: "grains", label: "Nafaka (Grains)", icon: "🌽" },
  { value: "spices", label: "Viungo (Spices)", icon: "🌶️" },
  { value: "household", label: "Vya Nyumbani (Household)", icon: "🧽" },
  { value: "handicrafts", label: "Mchongo (Handicrafts)", icon: "🏺" },
];

const UNITS = [
  { value: "kg", label: "Kilo (kg)" },
  { value: "ltr", label: "Lita (L)" },
  { value: "piece", label: "Kipande (piece)" },
  { value: "bunch", label: "Vifurushi (bunch)" },
  { value: "bag", label: "Mfuko (bag)" },
  { value: "box", label: "Sanduku (box)" },
  { value: "bottle", label: "Chupa (bottle)" },
  { value: "packet", label: "Pakiti (packet)" },
];

export const ProductUploadSystem: React.FC<ProductUploadSystemProps> = ({
  userId,
  onUploadSuccess,
  onUploadError,
}) => {
  const [activeTab, setActiveTab] = useState("web");
  const [uploadState, setUploadState] = useState<UploadState>({
    loading: false,
    progress: 0,
    stage: "idle",
    message: "",
  });
  const [userPermissions, setUserPermissions] = useState<any>(null);
  const [formData, setFormData] = useState<Partial<ProductUploadData>>({
    name: "",
    price: 0,
    unit: "kg",
    category: "staples",
    description: "",
    images: [],
    supplierId: userId,
    metadata: {
      uploadMethod: "web",
      verificationLevel: "basic",
    },
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [locationData, setLocationData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user permissions on mount
  React.useEffect(() => {
    loadUserPermissions();
    getCurrentLocation();
  }, [userId]);

  const loadUserPermissions = async () => {
    try {
      const permissions = await userRoleService.verifyUploadPermissions(userId);
      setUserPermissions(permissions);

      if (!permissions.canUpload) {
        setUploadState({
          loading: false,
          progress: 0,
          stage: "error",
          message: permissions.reason || "Upload permissions denied",
        });
      }
    } catch (error) {
      console.error("Failed to load user permissions:", error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationData({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            provider: "gps",
          });
        },
        (error) => {
          console.log("Location access denied, using IP-based location");
          // In production, use IP-based geolocation service
        },
      );
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        const newImages = Array.from(files);
        setSelectedImages((prev) => [...prev, ...newImages]);

        // Update form data
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), ...newImages],
        }));
      }
    },
    [],
  );

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleWebUpload = async () => {
    if (!userPermissions?.canUpload) {
      onUploadError?.("Upload permissions denied");
      return;
    }

    try {
      setUploadState({
        loading: true,
        progress: 10,
        stage: "uploading",
        message: "Validating product data...",
      });

      // Validate required fields
      if (!formData.name || !formData.price || formData.price <= 0) {
        throw new Error("Please fill in all required fields");
      }

      setUploadState((prev) => ({
        ...prev,
        progress: 30,
        message: "Running security checks...",
      }));

      // Prepare upload data
      const uploadData: ProductUploadData = {
        name: formData.name!,
        price: formData.price!,
        unit: formData.unit || "kg",
        category: formData.category || "general",
        description: formData.description,
        images: selectedImages,
        supplierId: userId,
        location: locationData,
        metadata: {
          uploadMethod: "web",
          verificationLevel: userPermissions.verificationLevel || "basic",
        },
      };

      setUploadState((prev) => ({
        ...prev,
        progress: 60,
        message: "AI screening in progress...",
      }));

      // Upload product
      const result = await productUploadService.uploadProduct(uploadData);

      setUploadState((prev) => ({
        ...prev,
        progress: 100,
        stage: "completed",
        message: `Product uploaded successfully! Status: ${result.status}`,
        result,
      }));

      onUploadSuccess?.(result.status);

      // Reset form
      setTimeout(() => {
        resetForm();
      }, 3000);
    } catch (error) {
      console.error("Upload failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";

      setUploadState({
        loading: false,
        progress: 0,
        stage: "error",
        message: errorMessage,
      });

      onUploadError?.(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      unit: "kg",
      category: "staples",
      description: "",
      images: [],
      supplierId: userId,
      metadata: {
        uploadMethod: "web",
        verificationLevel: "basic",
      },
    });
    setSelectedImages([]);
    setUploadState({
      loading: false,
      progress: 0,
      stage: "idle",
      message: "",
    });
  };

  const renderUploadLimitations = () => {
    if (!userPermissions?.limitations) return null;

    return (
      <Alert className="mb-4">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <div className="font-medium mb-2">Upload Limitations:</div>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {userPermissions.limitations.map(
              (limitation: string, index: number) => (
                <li key={index}>{limitation}</li>
              ),
            )}
          </ul>
        </AlertDescription>
      </Alert>
    );
  };

  const renderImagePreviews = () => {
    if (selectedImages.length === 0) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {selectedImages.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={URL.createObjectURL(image)}
              alt={`Preview ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg border"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderUploadProgress = () => {
    if (uploadState.stage === "idle") return null;

    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Upload Progress</span>
              <span className="text-sm text-muted-foreground">
                {uploadState.progress}%
              </span>
            </div>

            <Progress value={uploadState.progress} className="w-full" />

            <div className="flex items-center space-x-2">
              {uploadState.stage === "completed" && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {uploadState.stage === "error" && (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              {uploadState.loading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              )}
              <span className="text-sm">{uploadState.message}</span>
            </div>

            {uploadState.result && (
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm space-y-2">
                  <div>
                    <strong>AI Confidence:</strong>{" "}
                    {(uploadState.result.aiScore * 100).toFixed(1)}%
                  </div>
                  <div>
                    <strong>Status:</strong>
                    <Badge
                      className="ml-2"
                      variant={
                        uploadState.result.status === "approved"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {uploadState.result.status}
                    </Badge>
                  </div>
                  {uploadState.result.estimatedApprovalTime > 0 && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        <strong>Estimated approval:</strong>{" "}
                        {uploadState.result.estimatedApprovalTime} minutes
                      </span>
                    </div>
                  )}
                  {uploadState.result.flaggedIssues.length > 0 && (
                    <div>
                      <strong>Flagged Issues:</strong>
                      <ul className="list-disc list-inside mt-1 text-xs">
                        {uploadState.result.flaggedIssues.map(
                          (issue: string, index: number) => (
                            <li key={index}>{issue}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!userPermissions) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Loading permissions...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-6 w-6" />
            <span>Savannah Product Upload Center</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Upload products via multiple channels: Web, USSD, WhatsApp, or Bulk
            CSV
          </p>
        </CardHeader>
      </Card>

      {renderUploadLimitations()}
      {renderUploadProgress()}

      {/* Upload Methods */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="web" className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4" />
            <span>Web Upload</span>
          </TabsTrigger>
          <TabsTrigger value="ussd" className="flex items-center space-x-2">
            <span>📱</span>
            <span>USSD Flow</span>
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>WhatsApp</span>
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Bulk CSV</span>
          </TabsTrigger>
        </TabsList>

        {/* Web Upload */}
        <TabsContent value="web" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Web Upload Form</CardTitle>
              <p className="text-sm text-muted-foreground">
                Upload products directly through the web interface
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Product Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Unga Pembe, Fresh Tomatoes"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price (KSh) *</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="120"
                        value={formData.price || ""}
                        onChange={(e) =>
                          handleInputChange("price", parseFloat(e.target.value))
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="unit">Unit</Label>
                      <Select
                        value={formData.unit}
                        onValueChange={(value) =>
                          handleInputChange("unit", value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {UNITS.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_CATEGORIES.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            <span className="flex items-center space-x-2">
                              <span>{category.icon}</span>
                              <span>{category.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your product quality, origin, etc."
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className="mt-1"
                      rows={4}
                    />
                  </div>

                  {locationData && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        Location detected (±{locationData.accuracy?.toFixed(0)}
                        m)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <Label>Product Images</Label>
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-24 border-2 border-dashed"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                      <span>Click to upload images</span>
                      <span className="text-xs text-muted-foreground">
                        Support JPG, PNG. Max 5MB each.
                      </span>
                    </div>
                  </Button>
                </div>
                {renderImagePreviews()}
              </div>

              {/* Upload Button */}
              <Button
                onClick={handleWebUpload}
                disabled={uploadState.loading || !userPermissions.canUpload}
                className="w-full"
                size="lg"
              >
                {uploadState.loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload Product</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* USSD Flow Simulation */}
        <TabsContent value="ussd">
          <USSDProductFlow userId={userId} />
        </TabsContent>

        {/* WhatsApp Instructions */}
        <TabsContent value="whatsapp">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-6 w-6" />
                <span>WhatsApp Upload</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Star className="h-4 w-4" />
                <AlertDescription>
                  <strong>Swahili Voice Notes Supported!</strong> Our AI
                  understands Kiswahili product descriptions.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h4 className="font-medium">How to upload via WhatsApp:</h4>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Send Photos</p>
                      <p className="text-sm text-muted-foreground">
                        Send clear photos of your product to{" "}
                        <strong>+254 700 SAVANNAH</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Record Voice Note</p>
                      <p className="text-sm text-muted-foreground">
                        Include product name, price, and unit in Swahili or
                        English
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Example: "Hii ni unga pembe, bei ni shilingi mia moja na
                        ishirini kwa kilo"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Get Confirmation</p>
                      <p className="text-sm text-muted-foreground">
                        Receive upload confirmation and tracking reference
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h5 className="font-medium mb-2">Voice Note Tips:</h5>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Speak clearly in Swahili or English</li>
                    <li>• Include: Product name, price, unit</li>
                    <li>• Mention quality or special features</li>
                    <li>• Keep voice notes under 2 minutes</li>
                  </ul>
                </div>

                <Button
                  className="w-full"
                  onClick={() =>
                    window.open("https://wa.me/254700SAVANNAH", "_blank")
                  }
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Open WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Upload */}
        <TabsContent value="bulk">
          <BulkUploadInterface userId={userId} />
        </TabsContent>
      </Tabs>

      {/* Cultural Integration Notice */}
      <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🦅</div>
            <div>
              <h4 className="font-medium text-orange-900">
                Vulture Watch AI Protection
              </h4>
              <p className="text-sm text-orange-700">
                All uploads are protected by our AI system that screens for
                quality, pricing, and authenticity. Your products are reviewed
                by both AI and human moderators to ensure marketplace integrity.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductUploadSystem;
