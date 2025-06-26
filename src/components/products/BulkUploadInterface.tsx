import React, { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Alert, AlertDescription } from "../ui/alert";
import { Separator } from "../ui/separator";
import {
  Upload,
  FileText,
  Download,
  Users,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  FileSpreadsheet,
  Key,
} from "lucide-react";
import {
  productUploadService,
  BulkUploadData,
} from "../../services/productUploadService";
import { userRoleService } from "../../services/userRoleService";

interface BulkUploadInterfaceProps {
  userId: string;
}

interface BulkUploadState {
  loading: boolean;
  progress: number;
  stage: "idle" | "validating" | "processing" | "completed" | "error";
  results?: {
    success: number;
    failed: number;
    errors: string[];
  };
  errorMessage?: string;
}

interface CooperativeInfo {
  id: string;
  name: string;
  type: "farmer_coop" | "trader_coop" | "artisan_coop";
  memberCount: number;
  verificationLevel: "verified" | "certified";
  dailyLimit: number;
  apiKeyRequired: boolean;
}

const SAMPLE_CSV_DATA = `product_name,price,unit,category,description,image_url
Unga Pembe Grade A,120,kg,staples,High quality wheat flour from Nakuru,https://example.com/unga.jpg
Sukari Nyeupe,150,kg,staples,Pure white sugar refined locally,https://example.com/sukari.jpg
Mchele wa India,180,kg,staples,Premium basmati rice imported,https://example.com/mchele.jpg
Maharagwe Red Kidney,200,kg,staples,Fresh red kidney beans organic,https://example.com/maharagwe.jpg
Nyama ya Ng'ombe,800,kg,meat,Fresh beef from local ranch,https://example.com/nyama.jpg`;

const COOPERATIVE_EXAMPLES: CooperativeInfo[] = [
  {
    id: "kenfed_001",
    name: "Kenya National Farmers Federation",
    type: "farmer_coop",
    memberCount: 15000,
    verificationLevel: "certified",
    dailyLimit: 1000,
    apiKeyRequired: true,
  },
  {
    id: "nairobi_traders_002",
    name: "Nairobi Traders Cooperative",
    type: "trader_coop",
    memberCount: 500,
    verificationLevel: "verified",
    dailyLimit: 500,
    apiKeyRequired: true,
  },
  {
    id: "maasai_artisans_003",
    name: "Maasai Artisans Collective",
    type: "artisan_coop",
    memberCount: 150,
    verificationLevel: "certified",
    dailyLimit: 100,
    apiKeyRequired: false,
  },
];

export const BulkUploadInterface: React.FC<BulkUploadInterfaceProps> = ({
  userId,
}) => {
  const [uploadState, setUploadState] = useState<BulkUploadState>({
    loading: false,
    progress: 0,
    stage: "idle",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cooperativeId, setCooperativeId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [userPermissions, setUserPermissions] = useState<any>(null);
  const [csvPreview, setCsvPreview] = useState<string[][]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user permissions on mount
  React.useEffect(() => {
    loadUserPermissions();
  }, [userId]);

  const loadUserPermissions = async () => {
    try {
      const permissions = await userRoleService.verifyUploadPermissions(userId);
      setUserPermissions(permissions);
    } catch (error) {
      console.error("Failed to load user permissions:", error);
    }
  };

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        previewCSV(file);
      }
    },
    [],
  );

  const previewCSV = async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.split("\n").slice(0, 6); // Show first 6 lines
      const preview = lines.map((line) => line.split(","));
      setCsvPreview(preview);
    } catch (error) {
      console.error("Failed to preview CSV:", error);
    }
  };

  const downloadSampleCSV = () => {
    const blob = new Blob([SAMPLE_CSV_DATA], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "savannah_bulk_upload_sample.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBulkUpload = async () => {
    if (!selectedFile || !cooperativeId) {
      setUploadState({
        loading: false,
        progress: 0,
        stage: "error",
        errorMessage: "Please select a file and provide cooperative ID",
      });
      return;
    }

    try {
      setUploadState({
        loading: true,
        progress: 10,
        stage: "validating",
      });

      // Validate cooperative permissions
      setUploadState((prev) => ({
        ...prev,
        progress: 30,
        stage: "validating",
      }));

      const bulkData: BulkUploadData = {
        csvFile: selectedFile,
        cooperativeId,
        apiKey,
      };

      setUploadState((prev) => ({
        ...prev,
        progress: 50,
        stage: "processing",
      }));

      const results = await productUploadService.uploadViaBulk(bulkData);

      setUploadState({
        loading: false,
        progress: 100,
        stage: "completed",
        results,
      });
    } catch (error) {
      console.error("Bulk upload failed:", error);
      setUploadState({
        loading: false,
        progress: 0,
        stage: "error",
        errorMessage:
          error instanceof Error ? error.message : "Bulk upload failed",
      });
    }
  };

  const resetUpload = () => {
    setUploadState({
      loading: false,
      progress: 0,
      stage: "idle",
    });
    setSelectedFile(null);
    setCsvPreview([]);
    setCooperativeId("");
    setApiKey("");
  };

  const renderCooperativeSelector = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Cooperative Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cooperative-id">Cooperative ID *</Label>
            <Input
              id="cooperative-id"
              placeholder="Enter your cooperative ID"
              value={cooperativeId}
              onChange={(e) => setCooperativeId(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter API key (if required)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Required for some cooperatives. Contact admin if you don't have
              one.
            </p>
          </div>

          {/* Example Cooperatives */}
          <div>
            <Label>Example Cooperatives:</Label>
            <div className="mt-2 space-y-2">
              {COOPERATIVE_EXAMPLES.map((coop) => (
                <div
                  key={coop.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => {
                    setCooperativeId(coop.id);
                    if (!coop.apiKeyRequired) setApiKey("");
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{coop.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {coop.memberCount.toLocaleString()} members •
                        {coop.dailyLimit} daily limit
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          coop.verificationLevel === "certified"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {coop.verificationLevel}
                      </Badge>
                      {coop.apiKeyRequired && <Key className="h-3 w-3" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderFileUpload = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileSpreadsheet className="h-5 w-5" />
            <span>CSV File Upload</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Input */}
          <div>
            <Label>Select CSV File *</Label>
            <div className="mt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-24 border-2 border-dashed"
              >
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span>Click to upload CSV file</span>
                  <span className="text-xs text-muted-foreground">
                    Max 10MB. Must follow template format.
                  </span>
                </div>
              </Button>
            </div>
          </div>

          {/* Selected File Info */}
          {selectedFile && (
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {selectedFile.name}
                  </span>
                </div>
                <Badge variant="secondary">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </Badge>
              </div>
            </div>
          )}

          {/* CSV Preview */}
          {csvPreview.length > 0 && (
            <div>
              <Label>File Preview</Label>
              <div className="mt-2 overflow-x-auto">
                <table className="min-w-full text-xs border">
                  <thead>
                    <tr className="bg-muted">
                      {csvPreview[0]?.map((header, index) => (
                        <th
                          key={index}
                          className="border p-2 text-left font-medium"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvPreview.slice(1).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="border p-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Download Template */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <p className="text-sm font-medium text-blue-900">
                Need a template?
              </p>
              <p className="text-xs text-blue-700">
                Download our sample CSV file
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={downloadSampleCSV}>
              <Download className="h-4 w-4 mr-2" />
              Sample CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderUploadProgress = () => {
    if (uploadState.stage === "idle") return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Upload Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {uploadState.progress}%
              </span>
            </div>
            <Progress value={uploadState.progress} className="w-full" />
          </div>

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
            <span className="text-sm">
              {uploadState.stage === "validating" &&
                "Validating permissions..."}
              {uploadState.stage === "processing" && "Processing products..."}
              {uploadState.stage === "completed" && "Upload completed!"}
              {uploadState.stage === "error" && "Upload failed"}
            </span>
          </div>

          {/* Results */}
          {uploadState.results && (
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h4 className="font-medium">Upload Results</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    <strong>{uploadState.results.success}</strong> successful
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">
                    <strong>{uploadState.results.failed}</strong> failed
                  </span>
                </div>
              </div>

              {uploadState.results.errors.length > 0 && (
                <div>
                  <Label className="text-xs">Errors:</Label>
                  <div className="mt-1 max-h-32 overflow-y-auto">
                    {uploadState.results.errors.map((error, index) => (
                      <div
                        key={index}
                        className="text-xs text-red-600 bg-red-50 p-2 rounded mb-1"
                      >
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {uploadState.errorMessage && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{uploadState.errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            {uploadState.stage === "completed" ||
            uploadState.stage === "error" ? (
              <Button onClick={resetUpload} className="w-full">
                Upload Another File
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderRequirements = () => {
    return (
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-amber-900">
            <Shield className="h-5 w-5" />
            <span>Bulk Upload Requirements</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-amber-800">
          <div>
            <h4 className="font-medium mb-2">Eligibility:</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Verified cooperative membership</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Valid API key (for certified cooperatives)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Minimum 3 months transaction history</span>
              </li>
            </ul>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">CSV Format Requirements:</h4>
            <ul className="space-y-1 text-sm">
              <li>• Required columns: product_name, price, unit, category</li>
              <li>• Optional columns: description, image_url</li>
              <li>• Maximum 1000 products per upload</li>
              <li>• UTF-8 encoding with comma separators</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Special Permissions:</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center space-x-2">
                <Star className="h-3 w-3 text-yellow-600" />
                <span>Price override during emergencies (admin approval)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Clock className="h-3 w-3 text-blue-600" />
                <span>Priority processing for government supplies</span>
              </li>
            </ul>
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
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-6 w-6" />
            <span>Bulk Product Upload</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Upload multiple products at once using CSV files. Available for
            verified cooperatives and aggregators.
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {renderCooperativeSelector()}
          {renderFileUpload()}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {renderRequirements()}
          {renderUploadProgress()}
        </div>
      </div>

      {/* Upload Button */}
      {uploadState.stage === "idle" && (
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={handleBulkUpload}
              disabled={!selectedFile || !cooperativeId || uploadState.loading}
              className="w-full"
              size="lg"
            >
              {uploadState.loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Start Bulk Upload</span>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkUploadInterface;
