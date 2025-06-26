import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription } from "../ui/alert";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Users,
  Image,
  MessageSquare,
  Flag,
  Award,
  Shield,
  BarChart3,
} from "lucide-react";
import {
  contentModerationService,
  CommunityReport,
} from "../../services/contentModerationService";

interface ModerationItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    unit: string;
    category: string;
    description?: string;
    images: string[];
    supplier: {
      id: string;
      name: string;
      phone: string;
      verification_level: string;
    };
  };
  ai_score: number;
  flagged_issues: string[];
  priority: "low" | "medium" | "high";
  created_at: string;
  reports?: CommunityReport[];
}

interface ModerationStats {
  pending: number;
  approved: number;
  rejected: number;
  avgProcessingTime: number;
  aiAccuracy: number;
  communityReports: number;
}

export const ContentModerationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("queue");
  const [moderationQueue, setModerationQueue] = useState<ModerationItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [moderationNotes, setModerationNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ModerationStats>({
    pending: 0,
    approved: 0,
    rejected: 0,
    avgProcessingTime: 0,
    aiAccuracy: 0,
    communityReports: 0,
  });

  useEffect(() => {
    loadModerationData();
    const interval = setInterval(loadModerationData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadModerationData = async () => {
    try {
      setLoading(true);
      const [queue, queueStats] = await Promise.all([
        contentModerationService.getModerationQueue(),
        loadModerationStats(),
      ]);

      setModerationQueue(queue);
      setStats(queueStats);
    } catch (error) {
      console.error("Failed to load moderation data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadModerationStats = async (): Promise<ModerationStats> => {
    // Mock stats - in production, these would come from analytics service
    return {
      pending: 23,
      approved: 156,
      rejected: 12,
      avgProcessingTime: 18, // minutes
      aiAccuracy: 0.89,
      communityReports: 7,
    };
  };

  const handleApprove = async (item: ModerationItem) => {
    try {
      await contentModerationService.approveProduct(
        item.product.id,
        "current_moderator_id", // In production, get from auth context
        moderationNotes,
      );

      // Remove from queue
      setModerationQueue((prev) => prev.filter((i) => i.id !== item.id));
      setSelectedItem(null);
      setModerationNotes("");

      // Update stats
      setStats((prev) => ({
        ...prev,
        pending: prev.pending - 1,
        approved: prev.approved + 1,
      }));
    } catch (error) {
      console.error("Failed to approve product:", error);
    }
  };

  const handleReject = async (item: ModerationItem, reason: string) => {
    try {
      await contentModerationService.rejectProduct(
        item.product.id,
        "current_moderator_id",
        reason,
      );

      // Remove from queue
      setModerationQueue((prev) => prev.filter((i) => i.id !== item.id));
      setSelectedItem(null);
      setModerationNotes("");

      // Update stats
      setStats((prev) => ({
        ...prev,
        pending: prev.pending - 1,
        rejected: prev.rejected + 1,
      }));
    } catch (error) {
      console.error("Failed to reject product:", error);
    }
  };

  const validateCommunityReport = async (
    reportId: string,
    isValid: boolean,
  ) => {
    try {
      const result = await contentModerationService.validateCommunityReport(
        reportId,
        isValid,
        "current_moderator_id",
      );

      if (result.reward > 0) {
        // Show success message about airtime reward
        console.log(`Awarded ${result.reward} KSh airtime`);
      }

      // Refresh data
      await loadModerationData();
    } catch (error) {
      console.error("Failed to validate community report:", error);
    }
  };

  const renderStatsCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Review
                </p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Approved Today
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.approved}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  AI Accuracy
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {(stats.aiAccuracy * 100).toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg. Processing
                </p>
                <p className="text-2xl font-bold">{stats.avgProcessingTime}m</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderModerationQueue = () => {
    const sortedQueue = moderationQueue.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-medium">Moderation Queue</h3>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border rounded-lg animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {sortedQueue.map((item) => (
                <Card
                  key={item.id}
                  className={`cursor-pointer transition-colors ${
                    selectedItem?.id === item.id
                      ? "border-primary"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">
                          {item.product.name}
                        </h4>
                        <Badge
                          variant={
                            item.priority === "high"
                              ? "destructive"
                              : item.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {item.priority}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {item.product.price} KSh/{item.product.unit} •{" "}
                        {item.product.category}
                      </p>

                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          AI: {(item.ai_score * 100).toFixed(1)}%
                        </Badge>
                        {item.flagged_issues.length > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {item.flagged_issues.length} issues
                          </Badge>
                        )}
                        {item.reports && item.reports.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {item.reports.length} reports
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Supplier: {item.product.supplier.name}(
                        {item.product.supplier.verification_level})
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {sortedQueue.length === 0 && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-8 w-8 mx-auto mb-2" />
                  <p>No items pending moderation</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Review Panel */}
        <div className="lg:col-span-2">
          {selectedItem ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Review Product</span>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        selectedItem.priority === "high"
                          ? "destructive"
                          : selectedItem.priority === "medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {selectedItem.priority} priority
                    </Badge>
                    <Badge variant="outline">
                      AI: {(selectedItem.ai_score * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Product Details */}
                <div>
                  <h4 className="font-medium mb-3">Product Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>
                        <strong>Name:</strong> {selectedItem.product.name}
                      </p>
                      <p>
                        <strong>Price:</strong> {selectedItem.product.price} KSh
                      </p>
                      <p>
                        <strong>Unit:</strong> {selectedItem.product.unit}
                      </p>
                      <p>
                        <strong>Category:</strong>{" "}
                        {selectedItem.product.category}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Supplier:</strong>{" "}
                        {selectedItem.product.supplier.name}
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        {selectedItem.product.supplier.phone}
                      </p>
                      <p>
                        <strong>Verification:</strong>{" "}
                        {selectedItem.product.supplier.verification_level}
                      </p>
                      <p>
                        <strong>Submitted:</strong>{" "}
                        {new Date(selectedItem.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {selectedItem.product.description && (
                    <div className="mt-4">
                      <p>
                        <strong>Description:</strong>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedItem.product.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Product Images */}
                {selectedItem.product.images.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Product Images</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedItem.product.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Flagged Issues */}
                {selectedItem.flagged_issues.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Flagged Issues</h4>
                    <div className="space-y-2">
                      {selectedItem.flagged_issues.map((issue, index) => (
                        <Alert key={index}>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>{issue}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>
                )}

                {/* Community Reports */}
                {selectedItem.reports && selectedItem.reports.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Community Reports</h4>
                    <div className="space-y-3">
                      {selectedItem.reports.map((report, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{report.reason}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(report.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{report.description}</p>

                          <div className="flex space-x-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                validateCommunityReport(report.id, true)
                              }
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Valid (50 KSh reward)
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                validateCommunityReport(report.id, false)
                              }
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Invalid
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Moderation Notes */}
                <div>
                  <h4 className="font-medium mb-3">Moderation Notes</h4>
                  <Textarea
                    placeholder="Add notes about your decision..."
                    value={moderationNotes}
                    onChange={(e) => setModerationNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    className="flex-1"
                    onClick={() => handleApprove(selectedItem)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Product
                  </Button>

                  <Select
                    onValueChange={(reason) =>
                      handleReject(selectedItem, reason)
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Reject with reason..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="poor_quality">
                        Poor Quality Images
                      </SelectItem>
                      <SelectItem value="pricing_error">
                        Pricing Error
                      </SelectItem>
                      <SelectItem value="prohibited_item">
                        Prohibited Item
                      </SelectItem>
                      <SelectItem value="spam">Spam/Duplicate</SelectItem>
                      <SelectItem value="misleading">
                        Misleading Description
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">Select an item to review</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a product from the queue to start moderation
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const renderCommunityReports = () => {
    return (
      <div className="space-y-4">
        <h3 className="font-medium">Community Reports Management</h3>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Flag className="h-5 w-5" />
              <span>Report Validation Queue</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Community reports are automatically integrated with product
              moderation. Valid reports earn contributors 50 KSh airtime
              rewards.
            </p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Users className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                    <p className="text-2xl font-bold">247</p>
                    <p className="text-sm text-muted-foreground">
                      Active Reporters
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Award className="h-8 w-8 mx-auto text-green-500 mb-2" />
                    <p className="text-2xl font-bold">1,340</p>
                    <p className="text-sm text-muted-foreground">
                      KSh Rewards Paid
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Shield className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                    <p className="text-2xl font-bold">89%</p>
                    <p className="text-sm text-muted-foreground">
                      Report Accuracy
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAnalytics = () => {
    return (
      <div className="space-y-4">
        <h3 className="font-medium">Moderation Analytics</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Vulture Watch AI Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Overall Accuracy</span>
                  <span className="font-medium">
                    {(stats.aiAccuracy * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Auto-Approved</span>
                  <span className="font-medium">67%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Flagged for Review</span>
                  <span className="font-medium">33%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">False Positives</span>
                  <span className="font-medium">11%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Processing Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Avg. Review Time</span>
                  <span className="font-medium">
                    {stats.avgProcessingTime} minutes
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Queue Wait Time</span>
                  <span className="font-medium">45 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Daily Throughput</span>
                  <span className="font-medium">156 products</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Rejection Rate</span>
                  <span className="font-medium">7.1%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Common Issues Detected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { issue: "Price deviation > 20%", count: 12, percentage: 34 },
                { issue: "Poor image quality", count: 8, percentage: 23 },
                {
                  issue: "Missing product description",
                  count: 6,
                  percentage: 17,
                },
                { issue: "Duplicate listings", count: 5, percentage: 14 },
                { issue: "Prohibited keywords", count: 4, percentage: 12 },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded"
                >
                  <span className="text-sm">{item.issue}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{item.count}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span>Content Moderation Dashboard</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Vulture Watch AI + Human moderation system for marketplace integrity
          </p>
        </CardHeader>
      </Card>

      {renderStatsCards()}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="queue" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Moderation Queue</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <Flag className="h-4 w-4" />
            <span>Community Reports</span>
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex items-center space-x-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-6">
          {renderModerationQueue()}
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {renderCommunityReports()}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {renderAnalytics()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentModerationDashboard;
