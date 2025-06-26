import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Phone,
  MessageCircle,
  Calendar,
  DollarSign,
} from "lucide-react";
import EnterpriseNavigation from "@/components/EnterpriseNavigation";
import EnterpriseFooter from "@/components/EnterpriseFooter";

interface CreditTransaction {
  id: string;
  type: "borrowed" | "payment" | "interest";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "overdue";
}

const CreditPage = () => {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "mpesa" | "bank" | "cash"
  >("mpesa");

  // User's credit profile
  const creditProfile = {
    totalCredit: 50000,
    usedCredit: 35000,
    availableCredit: 15000,
    creditScore: 750,
    nextPaymentDate: "2025-01-20",
    nextPaymentAmount: 5000,
    totalOutstanding: 35000,
    interestRate: 3.5,
    daysOverdue: 0,
  };

  const creditTransactions: CreditTransaction[] = [
    {
      id: "1",
      type: "borrowed",
      amount: 10000,
      description: "Maize flour bulk purchase",
      date: "2025-01-10",
      status: "completed",
    },
    {
      id: "2",
      type: "payment",
      amount: -3000,
      description: "M-Pesa payment",
      date: "2025-01-12",
      status: "completed",
    },
    {
      id: "3",
      type: "borrowed",
      amount: 25000,
      description: "Sugar & cooking oil stock",
      date: "2025-01-14",
      status: "completed",
    },
    {
      id: "4",
      type: "interest",
      amount: 875,
      description: "Monthly interest charge",
      date: "2025-01-15",
      status: "completed",
    },
    {
      id: "5",
      type: "payment",
      amount: -5000,
      description: "Scheduled payment due",
      date: "2025-01-20",
      status: "pending",
    },
  ];

  const getWaterholeLevel = () => {
    return (
      ((creditProfile.totalCredit - creditProfile.usedCredit) /
        creditProfile.totalCredit) *
      100
    );
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return "text-green-600";
    if (score >= 650) return "text-yellow-600";
    return "text-red-600";
  };

  const handleMpesaPayment = () => {
    if (!paymentAmount || isNaN(Number(paymentAmount))) {
      alert("Please enter a valid amount");
      return;
    }

    // Simulate M-Pesa STK Push
    alert(
      `🔄 M-Pesa STK Push sent to your phone!\n\nAmount: KES ${paymentAmount}\nPaybill: 247247\nAccount: 888988 BNPL-${Math.random().toString(36).substr(2, 8).toUpperCase()}\n\nCheck your phone for payment prompt.`,
    );
    setPaymentAmount("");
  };

  const handleQuickPayment = (amount: number) => {
    setPaymentAmount(amount.toString());
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "borrowed":
        return "💳";
      case "payment":
        return "✅";
      case "interest":
        return "📈";
      default:
        return "💰";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <EnterpriseNavigation />

      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💧</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  💧 Waterhole Credit
                </h1>
                <p className="text-gray-600">Buy Now Pay Later (BNPL) Portal</p>
              </div>
            </div>

            {/* Credit Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Available Credit
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        KES {creditProfile.availableCredit.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-2xl">💧</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Outstanding
                      </p>
                      <p className="text-2xl font-bold text-red-600">
                        KES {creditProfile.totalOutstanding.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-2xl">⚠️</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Credit Score
                      </p>
                      <p
                        className={`text-2xl font-bold ${getCreditScoreColor(creditProfile.creditScore)}`}
                      >
                        {creditProfile.creditScore}
                      </p>
                    </div>
                    <span className="text-2xl">⭐</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Next Payment
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        KES {creditProfile.nextPaymentAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {creditProfile.nextPaymentDate}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Waterhole Visualization & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Waterhole Credit Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-xl">💧</span>
                    <span>Waterhole Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Circular Waterhole Graphic */}
                    <div className="w-64 h-64 mx-auto relative">
                      <div className="w-64 h-64 rounded-full border-8 border-blue-200 bg-gradient-to-b from-blue-100 to-blue-50 relative overflow-hidden">
                        {/* Water Level */}
                        <div
                          className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-300 transition-all duration-1000"
                          style={{ height: `${getWaterholeLevel()}%` }}
                        >
                          {/* Water ripple effect */}
                          <div className="absolute top-0 w-full h-4 bg-white/20 rounded-full animate-pulse"></div>
                        </div>

                        {/* Animals around waterhole */}
                        <div className="absolute -top-2 left-1/4 text-2xl animate-bounce">
                          🦒
                        </div>
                        <div className="absolute top-1/4 -right-2 text-2xl">
                          🐘
                        </div>
                        <div className="absolute bottom-1/4 -left-2 text-2xl">
                          🦓
                        </div>
                        <div className="absolute -bottom-2 right-1/4 text-2xl">
                          🦁
                        </div>

                        {/* Credit amount display */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white font-bold">
                            <div className="text-sm">Available</div>
                            <div className="text-2xl">
                              KES{" "}
                              {creditProfile.availableCredit.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-4">
                      <div className="text-sm text-gray-600 mb-2">
                        Credit Utilization:{" "}
                        {Math.round(
                          (creditProfile.usedCredit /
                            creditProfile.totalCredit) *
                            100,
                        )}
                        %
                      </div>
                      <Progress
                        value={
                          (creditProfile.usedCredit /
                            creditProfile.totalCredit) *
                          100
                        }
                        className="w-64 mx-auto"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* M-Pesa Quick Payment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Smartphone className="h-5 w-5" />
                    <span>💚 M-Pesa Quick Pay</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Quick amount buttons */}
                    <div className="grid grid-cols-4 gap-2">
                      {[500, 1000, 2000, 5000].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          onClick={() => handleQuickPayment(amount)}
                          className="text-sm"
                        >
                          {amount}
                        </Button>
                      ))}
                    </div>

                    {/* Custom amount input */}
                    <div className="space-y-3">
                      <Input
                        type="number"
                        placeholder="Enter amount (KES)"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="text-lg"
                      />

                      <Button
                        onClick={handleMpesaPayment}
                        className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                      >
                        <Smartphone className="h-5 w-5 mr-2" />
                        Lipa {paymentAmount || "___"} KSh via M-Pesa
                      </Button>
                    </div>

                    {/* Payment info */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-green-800">
                        <div className="font-semibold mb-2">
                          📱 M-Pesa Payment Info:
                        </div>
                        <div>
                          • Paybill: <strong>247247</strong>
                        </div>
                        <div>• Account: 888988</div>
                        <div>• Instant processing ⚡</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Transactions & Alerts */}
            <div className="space-y-6">
              {/* Payment Reminder */}
              {creditProfile.nextPaymentAmount > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">🔔</span>
                      <div>
                        <div className="font-semibold text-orange-800 mb-2">
                          Payment Due Soon
                        </div>
                        <div className="text-sm text-orange-700">
                          <div>
                            Amount:{" "}
                            <strong>
                              KES{" "}
                              {creditProfile.nextPaymentAmount.toLocaleString()}
                            </strong>
                          </div>
                          <div>
                            Due:{" "}
                            <strong>{creditProfile.nextPaymentDate}</strong>
                          </div>
                          <div className="mt-2">
                            <Button
                              size="sm"
                              className="bg-orange-600 hover:bg-orange-700 text-white"
                            >
                              <Smartphone className="h-4 w-4 mr-1" />
                              Pay Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Hyena List (Debt Tracking) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-xl">🐺</span>
                    <span>Hyena List</span>
                    <Badge variant="secondary" className="ml-auto">
                      {creditProfile.daysOverdue} days overdue
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {creditProfile.daysOverdue === 0 ? (
                      <div className="text-center py-4">
                        <span className="text-4xl mb-2 block">✅</span>
                        <div className="text-green-600 font-semibold">
                          All payments up to date!
                        </div>
                        <div className="text-sm text-gray-600">
                          Keep it up, you're in the good books
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-red-50 p-3 rounded-lg">
                          <div className="text-red-800 font-semibold mb-1">
                            Overdue Payment
                          </div>
                          <div className="text-sm text-red-700">
                            KES{" "}
                            {creditProfile.nextPaymentAmount.toLocaleString()}{" "}
                            overdue by {creditProfile.daysOverdue} days
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            SMS
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {creditTransactions.slice(0, 5).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">
                            {getTransactionIcon(transaction.type)}
                          </span>
                          <div>
                            <div className="text-sm font-medium">
                              {transaction.description}
                            </div>
                            <div className="text-xs text-gray-500">
                              {transaction.date}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-semibold ${transaction.amount > 0 ? "text-red-600" : "text-green-600"}`}
                          >
                            {transaction.amount > 0 ? "+" : ""}KES{" "}
                            {Math.abs(transaction.amount).toLocaleString()}
                          </div>
                          <Badge
                            variant={
                              transaction.status === "completed"
                                ? "default"
                                : transaction.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full mt-4">
                    View All Transactions
                  </Button>
                </CardContent>
              </Card>

              {/* Credit Score Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-xl">⭐</span>
                    <span>Credit Health</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div
                        className={`text-4xl font-bold ${getCreditScoreColor(creditProfile.creditScore)}`}
                      >
                        {creditProfile.creditScore}
                      </div>
                      <div className="text-sm text-gray-600">
                        {creditProfile.creditScore >= 750
                          ? "Excellent"
                          : creditProfile.creditScore >= 650
                            ? "Good"
                            : "Needs Improvement"}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Payment History:</span>
                        <span className="font-semibold text-green-600">
                          98%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Credit Utilization:</span>
                        <span className="font-semibold text-yellow-600">
                          70%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Account Age:</span>
                        <span className="font-semibold text-green-600">
                          8 months
                        </span>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                      <div className="font-semibold mb-1">
                        💡 Tip to improve:
                      </div>
                      <div>
                        Keep credit utilization below 30% to boost your score
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <EnterpriseFooter />
    </div>
  );
};

export default CreditPage;
