import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  Clock,
  Upload,
  FileText,
  Shield,
  Building,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Award,
  Users,
  Package,
  Truck,
  AlertTriangle,
  Camera,
  X,
  Plus,
  ArrowRight,
  ArrowLeft,
  Star,
  Zap,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "pending" | "in_progress" | "completed" | "failed";
  required: boolean;
  estimatedTime: string;
}

interface BusinessInfo {
  businessName: string;
  businessType: "manufacturer" | "distributor" | "retailer" | "logistics";
  registrationNumber: string;
  taxId: string;
  website?: string;
  description: string;
  foundedYear: number;
  employeeCount: "1-10" | "11-50" | "51-200" | "200+";
  annualRevenue: "under-1m" | "1m-10m" | "10m-50m" | "50m+";
}

interface ContactInfo {
  primaryContact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  businessAddress: {
    street: string;
    city: string;
    county: string;
    postalCode: string;
    country: string;
  };
  warehouseAddresses: Array<{
    id: string;
    name: string;
    address: string;
    capacity: string;
    operational: boolean;
  }>;
}

interface DocumentUpload {
  id: string;
  name: string;
  type:
    | "business_license"
    | "tax_certificate"
    | "bank_statement"
    | "product_certificate"
    | "insurance";
  status: "pending" | "uploaded" | "verified" | "rejected";
  file?: File;
  url?: string;
  rejectionReason?: string;
  required: boolean;
}

interface BankingInfo {
  bankName: string;
  accountNumber: string;
  accountName: string;
  branchCode: string;
  swiftCode?: string;
  mpesaNumber: string;
  preferredPaymentMethod: "bank_transfer" | "mpesa" | "both";
}

const StepIndicator = ({
  steps,
  currentStep,
}: {
  steps: OnboardingStep[];
  currentStep: string;
}) => {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                step.status === "completed"
                  ? "bg-green-500 border-green-500 text-white"
                  : step.status === "in_progress"
                    ? "bg-blue-500 border-blue-500 text-white"
                    : step.status === "failed"
                      ? "bg-red-500 border-red-500 text-white"
                      : index <= currentIndex
                        ? "border-green-500 text-green-500"
                        : "border-gray-300 text-gray-300"
              }`}
            >
              {step.status === "completed" ? (
                <CheckCircle className="h-5 w-5" />
              ) : step.status === "failed" ? (
                <AlertTriangle className="h-5 w-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>

            <div className="text-center mt-2">
              <p
                className={`text-sm font-medium ${
                  index <= currentIndex ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {step.title}
              </p>
              <p className="text-xs text-gray-500">{step.estimatedTime}</p>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`absolute h-0.5 bg-gray-300 ${
                  step.status === "completed" ? "bg-green-500" : ""
                }`}
                style={{
                  width: `calc(100% / ${steps.length} - 2.5rem)`,
                  left: `calc(${((index + 1) * 100) / steps.length}% - ${50 / steps.length}%)`,
                  top: "1.25rem",
                  zIndex: -1,
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Progress
          value={((currentIndex + 1) / steps.length) * 100}
          className="h-2"
        />
        <p className="text-sm text-gray-600 mt-2">
          Step {currentIndex + 1} of {steps.length} -{" "}
          {(((currentIndex + 1) / steps.length) * 100).toFixed(0)}% Complete
        </p>
      </div>
    </div>
  );
};

const BusinessInfoStep = ({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: BusinessInfo;
  onChange: (data: Partial<BusinessInfo>) => void;
  onNext: () => void;
  onBack: () => void;
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data.businessName.trim())
      newErrors.businessName = "Business name is required";
    if (!data.businessType)
      newErrors.businessType = "Business type is required";
    if (!data.registrationNumber.trim())
      newErrors.registrationNumber = "Registration number is required";
    if (!data.description.trim())
      newErrors.description = "Business description is required";
    if (!data.foundedYear || data.foundedYear < 1900)
      newErrors.foundedYear = "Valid founding year is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  const businessTypes = [
    {
      value: "manufacturer",
      label: "🏭 Manufacturer",
      description: "Produce goods directly",
    },
    {
      value: "distributor",
      label: "📦 Distributor",
      description: "Wholesale distribution",
    },
    {
      value: "retailer",
      label: "🏪 Retailer",
      description: "Direct to consumer sales",
    },
    {
      value: "logistics",
      label: "🚛 Logistics Provider",
      description: "Transportation & delivery",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building className="h-5 w-5" />
          <span>Business Information</span>
        </CardTitle>
        <p className="text-gray-600">
          Tell us about your business to get started
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Business Name */}
        <div>
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            value={data.businessName}
            onChange={(e) => onChange({ businessName: e.target.value })}
            placeholder="e.g., Savanna Trading Company"
            className={errors.businessName ? "border-red-500" : ""}
          />
          {errors.businessName && (
            <p className="text-sm text-red-600 mt-1">{errors.businessName}</p>
          )}
        </div>

        {/* Business Type */}
        <div>
          <Label>Business Type *</Label>
          <div className="grid md:grid-cols-2 gap-3 mt-2">
            {businessTypes.map((type) => (
              <div
                key={type.value}
                onClick={() => onChange({ businessType: type.value as any })}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  data.businessType === type.value
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-medium">{type.label}</div>
                <div className="text-sm text-gray-600">{type.description}</div>
              </div>
            ))}
          </div>
          {errors.businessType && (
            <p className="text-sm text-red-600 mt-1">{errors.businessType}</p>
          )}
        </div>

        {/* Registration Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="registrationNumber">
              Business Registration Number *
            </Label>
            <Input
              id="registrationNumber"
              value={data.registrationNumber}
              onChange={(e) => onChange({ registrationNumber: e.target.value })}
              placeholder="e.g., BRS/2023/12345"
              className={errors.registrationNumber ? "border-red-500" : ""}
            />
            {errors.registrationNumber && (
              <p className="text-sm text-red-600 mt-1">
                {errors.registrationNumber}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="taxId">Tax ID/PIN Number</Label>
            <Input
              id="taxId"
              value={data.taxId}
              onChange={(e) => onChange({ taxId: e.target.value })}
              placeholder="e.g., P051234567M"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="website">Website (Optional)</Label>
          <Input
            id="website"
            value={data.website || ""}
            onChange={(e) => onChange({ website: e.target.value })}
            placeholder="https://your-website.com"
          />
        </div>

        {/* Business Description */}
        <div>
          <Label htmlFor="description">Business Description *</Label>
          <Textarea
            id="description"
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Describe what your business does, products/services offered, target market..."
            className={`min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Business Details */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="foundedYear">Founded Year *</Label>
            <Input
              id="foundedYear"
              type="number"
              value={data.foundedYear || ""}
              onChange={(e) =>
                onChange({ foundedYear: parseInt(e.target.value) })
              }
              placeholder="2020"
              min="1900"
              max={new Date().getFullYear()}
              className={errors.foundedYear ? "border-red-500" : ""}
            />
            {errors.foundedYear && (
              <p className="text-sm text-red-600 mt-1">{errors.foundedYear}</p>
            )}
          </div>
          <div>
            <Label htmlFor="employeeCount">Employee Count</Label>
            <Select
              value={data.employeeCount}
              onValueChange={(value) =>
                onChange({ employeeCount: value as any })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10 employees</SelectItem>
                <SelectItem value="11-50">11-50 employees</SelectItem>
                <SelectItem value="51-200">51-200 employees</SelectItem>
                <SelectItem value="200+">200+ employees</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="annualRevenue">Annual Revenue</Label>
            <Select
              value={data.annualRevenue}
              onValueChange={(value) =>
                onChange({ annualRevenue: value as any })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-1m">Under KES 1M</SelectItem>
                <SelectItem value="1m-10m">KES 1M - 10M</SelectItem>
                <SelectItem value="10m-50m">KES 10M - 50M</SelectItem>
                <SelectItem value="50m+">Over KES 50M</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="bg-green-600 hover:bg-green-700"
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const DocumentUploadStep = ({
  documents,
  onDocumentUpload,
  onNext,
  onBack,
}: {
  documents: DocumentUpload[];
  onDocumentUpload: (documentId: string, file: File) => void;
  onNext: () => void;
  onBack: () => void;
}) => {
  const [draggedOver, setDraggedOver] = useState<string | null>(null);

  const documentTypes = [
    {
      id: "business_license",
      name: "Business License",
      description: "Official business registration certificate",
      required: true,
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: "tax_certificate",
      name: "Tax Compliance Certificate",
      description: "KRA tax compliance certificate",
      required: true,
      icon: <Shield className="h-5 w-5" />,
    },
    {
      id: "bank_statement",
      name: "Bank Statement",
      description: "Recent bank statement (last 3 months)",
      required: true,
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      id: "product_certificate",
      name: "Product Certifications",
      description: "Quality certificates, KEBS approvals (if applicable)",
      required: false,
      icon: <Award className="h-5 w-5" />,
    },
    {
      id: "insurance",
      name: "Insurance Certificate",
      description: "Business insurance or product liability insurance",
      required: false,
      icon: <Shield className="h-5 w-5" />,
    },
  ];

  const handleFileUpload = (documentId: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload files smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF, JPG, or PNG files only",
        variant: "destructive",
      });
      return;
    }

    onDocumentUpload(documentId, file);
    toast({
      title: "Document uploaded! 📄",
      description: `${file.name} has been uploaded successfully`,
    });
  };

  const handleDrop = (e: React.DragEvent, documentId: string) => {
    e.preventDefault();
    setDraggedOver(null);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(documentId, file);
    }
  };

  const getDocumentStatus = (documentId: string) => {
    const doc = documents.find((d) => d.id === documentId);
    return doc?.status || "pending";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "uploaded":
        return "bg-blue-100 text-blue-800";
      case "verified":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canProceed = documentTypes
    .filter((dt) => dt.required)
    .every((dt) => {
      const doc = documents.find((d) => d.id === dt.id);
      return doc && (doc.status === "uploaded" || doc.status === "verified");
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Document Verification</span>
        </CardTitle>
        <p className="text-gray-600">
          Upload required documents for verification
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            All documents are securely encrypted and used only for verification
            purposes. Supported formats: PDF, JPG, PNG (max 10MB each).
          </AlertDescription>
        </Alert>

        {documentTypes.map((docType) => {
          const status = getDocumentStatus(docType.id);
          const doc = documents.find((d) => d.id === docType.id);

          return (
            <div key={docType.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">{docType.icon}</div>
                  <div>
                    <h4 className="font-medium flex items-center space-x-2">
                      <span>{docType.name}</span>
                      {docType.required && (
                        <Badge
                          variant="outline"
                          className="text-red-600 border-red-300"
                        >
                          Required
                        </Badge>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {docType.description}
                    </p>
                  </div>
                </div>

                <Badge className={getStatusColor(status)}>
                  {status === "uploaded" && <Clock className="h-3 w-3 mr-1" />}
                  {status === "verified" && (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  )}
                  {status === "rejected" && <X className="h-3 w-3 mr-1" />}
                  {status}
                </Badge>
              </div>

              {status === "pending" ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    draggedOver === docType.id
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDraggedOver(docType.id);
                  }}
                  onDragLeave={() => setDraggedOver(null)}
                  onDrop={(e) => handleDrop(e, docType.id)}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop your file here, or
                  </p>
                  <label
                    htmlFor={`file-${docType.id}`}
                    className="cursor-pointer"
                  >
                    <Button variant="outline" size="sm" asChild>
                      <span>Choose File</span>
                    </Button>
                    <input
                      id={`file-${docType.id}`}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(docType.id, file);
                        }
                      }}
                    />
                  </label>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium">
                          {doc?.file?.name || "Document uploaded"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {doc?.file?.size
                            ? `${(doc.file.size / 1024 / 1024).toFixed(1)} MB`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {status === "rejected" && (
                        <div className="text-right">
                          <p className="text-xs text-red-600">Rejected</p>
                          {doc?.rejectionReason && (
                            <p className="text-xs text-gray-500">
                              {doc.rejectionReason}
                            </p>
                          )}
                        </div>
                      )}
                      <label
                        htmlFor={`replace-${docType.id}`}
                        className="cursor-pointer"
                      >
                        <Button variant="outline" size="sm">
                          Replace
                        </Button>
                        <input
                          id={`replace-${docType.id}`}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(docType.id, file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Verification Status */}
        {documents.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">
              Verification Status
            </h4>
            <p className="text-sm text-blue-700">
              Documents are typically reviewed within 1-2 business days. You'll
              receive email notifications about the status of each document.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={onNext}
            className="bg-green-600 hover:bg-green-700"
            disabled={!canProceed}
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const VendorOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    businessName: "",
    businessType: "retailer",
    registrationNumber: "",
    taxId: "",
    description: "",
    foundedYear: new Date().getFullYear(),
    employeeCount: "1-10",
    annualRevenue: "under-1m",
  });

  const [documents, setDocuments] = useState<DocumentUpload[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    primaryContact: {
      name: "",
      title: "",
      email: "",
      phone: "",
    },
    businessAddress: {
      street: "",
      city: "",
      county: "",
      postalCode: "",
      country: "Kenya",
    },
    warehouseAddresses: [],
  });

  const { user } = useAuth();

  const steps: OnboardingStep[] = [
    {
      id: "business_info",
      title: "Business Info",
      description: "Basic business information",
      icon: <Building className="h-5 w-5" />,
      status: "in_progress",
      required: true,
      estimatedTime: "5 min",
    },
    {
      id: "contact_info",
      title: "Contact Details",
      description: "Contact and location information",
      icon: <MapPin className="h-5 w-5" />,
      status: "pending",
      required: true,
      estimatedTime: "3 min",
    },
    {
      id: "documents",
      title: "Documents",
      description: "Upload verification documents",
      icon: <FileText className="h-5 w-5" />,
      status: "pending",
      required: true,
      estimatedTime: "10 min",
    },
    {
      id: "banking",
      title: "Banking",
      description: "Payment and banking details",
      icon: <CreditCard className="h-5 w-5" />,
      status: "pending",
      required: true,
      estimatedTime: "5 min",
    },
    {
      id: "review",
      title: "Review",
      description: "Review and submit application",
      icon: <CheckCircle className="h-5 w-5" />,
      status: "pending",
      required: true,
      estimatedTime: "2 min",
    },
  ];

  const handleDocumentUpload = (documentId: string, file: File) => {
    setDocuments((prev) => {
      const existing = prev.find((d) => d.id === documentId);
      if (existing) {
        return prev.map((d) =>
          d.id === documentId ? { ...d, file, status: "uploaded" as const } : d,
        );
      } else {
        return [
          ...prev,
          {
            id: documentId,
            name: file.name,
            type: documentId as any,
            status: "uploaded" as const,
            file,
            required: true,
          },
        ];
      }
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BusinessInfoStep
            data={businessInfo}
            onChange={(updates) =>
              setBusinessInfo((prev) => ({ ...prev, ...updates }))
            }
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <DocumentUploadStep
            documents={documents}
            onDocumentUpload={handleDocumentUpload}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step {currentStep + 1} - Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This step is being implemented...</p>
              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Savanna Marketplace! 🦁
          </h1>
          <p className="text-gray-600">
            Join the pride and start growing your business across Africa
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={steps} currentStep={steps[currentStep].id} />

        {/* Current Step */}
        {renderCurrentStep()}

        {/* Help & Support */}
        <div className="mt-8 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">Need Help?</span>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                Our team is here to help you through the onboarding process
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorOnboarding;
