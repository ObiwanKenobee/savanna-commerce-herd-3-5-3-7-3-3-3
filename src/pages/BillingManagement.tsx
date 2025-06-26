import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import PaymentProcessor from "@/components/billing/PaymentProcessor";
import RevOpsDashboard from "@/components/billing/RevOpsDashboard";
import { useAuth } from "@/hooks/useAuth";
import {
  CreditCard,
  Crown,
  TrendingUp,
  Calendar,
  Receipt,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  Phone,
  Settings,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react";

interface CurrentPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  wildlife: string;
  nextBilling: string;
  status: "active" | "cancelled" | "past_due";
}

interface InvoiceHistory {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  description: string;
  downloadUrl: string;
}

const BillingManagement: React.FC = () => {
  const { user, profile } = useAuth();
  const [showUpgradeFlow, setShowUpgradeFlow] = useState(false);
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState(null);

  const [currentPlan, setCurrentPlan] = useState<CurrentPlan>({
    id: "retailer-pro",
    name: "Lion's Pride Pro",
    price: 1500,
    currency: "KES",
    period: "month",
    wildlife: "🦁",
    nextBilling: "2024-02-15",
    status: "active",
  });

  const [invoiceHistory, setInvoiceHistory] = useState<InvoiceHistory[]>([
    {
      id: "inv_001",
      date: "2024-01-15",
      amount: 1500,
      status: "paid",
      description: "Lion's Pride Pro - January 2024",
      downloadUrl: "/invoices/inv_001.pdf",
    },
    {
      id: "inv_002",
      date: "2023-12-15",
      amount: 1500,
      status: "paid",
      description: "Lion's Pride Pro - December 2023",
      downloadUrl: "/invoices/inv_002.pdf",
    },
    {
      id: "inv_003",
      date: "2023-11-15",
      amount: 1500,
      status: "paid",
      description: "Lion's Pride Pro - November 2023",
      downloadUrl: "/invoices/inv_003.pdf",
    },
  ]);

  const upgradePlans = [
    {
      id: "supplier-growth",
      name: "Elephant Scale",
      price: 8500,
      currency: "KES",
      period: "month",
      description: "Comprehensive platform for wholesalers and brand suppliers",
      features: [
        "Supplier dashboard",
        "Inventory management",
        "Demand forecasting",
        "Analytics & insights",
        "6% commission + fixed fee",
      ],
      wildlife: "🐘",
      userType: "supplier",
    },
    {
      id: "supplier-enterprise",
      name: "Baobab Enterprise",
      price: 25000,
      currency: "KES",
      period: "month",
      description: "White-label solution for major brands",
      features: [
        "Everything in Growth",
        "White-label storefront",
        "Custom branding",
        "Dedicated account manager",
        "4% commission + enterprise fee",
      ],
      wildlife: "🌳",
      userType: "supplier",
    },
  ];

  const renderCurrentPlan = () => (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span className="text-2xl">{currentPlan.wildlife}</span>
          <span>{currentPlan.name}</span>
          <Badge variant="default" className="bg-green-600">
            {currentPlan.status === "active"
              ? "Active"
              : currentPlan.status === "cancelled"
                ? "Cancelled"
                : "Past Due"}
          </Badge>
        </CardTitle>
        <CardDescription>
          Your current subscription plan in the Savanna ecosystem
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border">
            <div className="text-xl md:text-2xl font-bold text-green-600">
              KES {currentPlan.price.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              per {currentPlan.period}
            </div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border">
            <div className="text-base md:text-lg font-semibold">
              Next Billing
            </div>
            <div className="text-sm text-gray-600">
              {currentPlan.nextBilling}
            </div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-center space-x-1">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Auto-Renewal</span>
            </div>
            <div className="text-sm text-gray-600">Enabled</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => alert("Payment method update feature coming soon!")}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Update Payment Method
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // Create and download a sample invoice
              const link = document.createElement("a");
              link.href =
                "data:text/plain;charset=utf-8,Sample Invoice - Savanna Marketplace";
              link.download = "invoice-latest.txt";
              link.click();
            }}
          >
            <Receipt className="h-4 w-4 mr-2" />
            Download Latest Invoice
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPlan((prev) => ({
                ...prev,
                status: prev.status === "active" ? "cancelled" : "active",
              }))
            }
          >
            <Settings className="h-4 w-4 mr-2" />
            {currentPlan.status === "active"
              ? "Cancel Subscription"
              : "Reactivate Subscription"}
          </Button>
        </div>

        {currentPlan.status === "past_due" && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Payment Past Due</AlertTitle>
            <AlertDescription>
              Your account is past due. Please update your payment method to
              continue using the service.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  const renderUsageStats = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <span>This Month's Usage</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">247</div>
            <div className="text-sm text-gray-600">Orders Processed</div>
            <div className="text-xs text-blue-500">No limit</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">KES 45,600</div>
            <div className="text-sm text-gray-600">Transaction Value</div>
            <div className="text-xs text-purple-500">3% commission</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-sm text-gray-600">BNPL Transactions</div>
            <div className="text-xs text-green-500">Available</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">98.5%</div>
            <div className="text-sm text-gray-600">Service Uptime</div>
            <div className="text-xs text-yellow-500">SLA: 99%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderInvoiceHistory = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Receipt className="h-5 w-5 text-gray-600" />
          <span>Invoice History</span>
        </CardTitle>
        <CardDescription>
          Download and view your billing history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {invoiceHistory.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    invoice.status === "paid"
                      ? "bg-green-500"
                      : invoice.status === "pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                />
                <div>
                  <div className="font-medium">{invoice.description}</div>
                  <div className="text-sm text-gray-600">{invoice.date}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-semibold">
                    KES {invoice.amount.toLocaleString()}
                  </div>
                  <Badge
                    variant={
                      invoice.status === "paid"
                        ? "default"
                        : invoice.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {invoice.status}
                  </Badge>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Load More
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderUpgradeOptions = () => (
    <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Crown className="h-5 w-5 text-yellow-600" />
          <span>Upgrade Your Pride</span>
        </CardTitle>
        <CardDescription>
          Unlock more features and grow your business in the savanna
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upgradePlans.map((plan) => (
            <div
              key={plan.id}
              className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{plan.wildlife}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-600">
                    KES {plan.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">per {plan.period}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <ul className="text-sm space-y-1">
                  {plan.features
                    .slice(0, Math.ceil(plan.features.length / 2))
                    .map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                </ul>
                <ul className="text-sm space-y-1">
                  {plan.features
                    .slice(Math.ceil(plan.features.length / 2))
                    .map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                </ul>
              </div>
              <Button
                className="w-full bg-yellow-600 hover:bg-yellow-700"
                onClick={() => {
                  setSelectedUpgradePlan(plan as any);
                  setShowUpgradeFlow(true);
                }}
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to {plan.name}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderPaymentMethods = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          <span>Payment Methods</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium">M-Pesa</div>
                <div className="text-sm text-gray-600">+254 700 ••• 123</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="default">Primary</Badge>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            <CreditCard className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (showUpgradeFlow && selectedUpgradePlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <EnhancedNavigation />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowUpgradeFlow(false);
                    setSelectedUpgradePlan(null);
                  }}
                >
                  ← Back to Billing
                </Button>
              </div>
              <PaymentProcessor
                selectedPlan={selectedUpgradePlan}
                onPaymentComplete={(result) => {
                  if (result.success) {
                    setCurrentPlan({
                      id: selectedUpgradePlan.id,
                      name: selectedUpgradePlan.name,
                      price: selectedUpgradePlan.price,
                      currency: selectedUpgradePlan.currency,
                      period: selectedUpgradePlan.period,
                      wildlife: selectedUpgradePlan.wildlife,
                      nextBilling: new Date(
                        Date.now() + 30 * 24 * 60 * 60 * 1000,
                      )
                        .toISOString()
                        .split("T")[0],
                      status: "active",
                    });
                    setShowUpgradeFlow(false);
                    setSelectedUpgradePlan(null);
                  }
                }}
                onCancel={() => {
                  setShowUpgradeFlow(false);
                  setSelectedUpgradePlan(null);
                }}
              />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <EnhancedNavigation />

      <main className="pt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-green-800">
                💳 Billing & Subscription Management
              </h1>
              <p className="text-green-600 mt-1">
                Manage your Savanna subscription, payments, and billing history
              </p>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 md:mb-8 h-auto p-1">
                <TabsTrigger
                  value="overview"
                  className="text-xs md:text-sm py-2"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger value="usage" className="text-xs md:text-sm py-2">
                  Usage
                </TabsTrigger>
                <TabsTrigger
                  value="invoices"
                  className="text-xs md:text-sm py-2"
                >
                  Invoices
                </TabsTrigger>
                <TabsTrigger value="revops" className="text-xs md:text-sm py-2">
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6">
                  {renderCurrentPlan()}
                  {renderUpgradeOptions()}
                  {renderPaymentMethods()}
                </div>
              </TabsContent>

              <TabsContent value="usage" className="space-y-6">
                {renderUsageStats()}
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">
                          Usage analytics chart would be displayed here
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="invoices" className="space-y-6">
                {renderInvoiceHistory()}
              </TabsContent>

              <TabsContent value="revops" className="space-y-6">
                <RevOpsDashboard />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BillingManagement;
